import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userWords, wordBatches, wordReviewLogs } from '@/lib/schema';
import { eq, and, inArray, InferSelectModel } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

type UserWordRow = InferSelectModel<typeof userWords>;

function normalizeForComparison(word: string): string {
  return word
    .toLowerCase()
    .replace(/^(der|die|das|ein|eine|einen|einem|einer|eines)\s+/i, '')
    .trim();
}

// POST /api/vocabulary/sync - Synchronize and deduplicate vocabulary & word sets
export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const allWords: UserWordRow[] = await db
      .select()
      .from(userWords)
      .where(eq(userWords.userId, session.id));

    // Group words by normalized root form
    const groups = new Map<string, UserWordRow[]>();
    for (const w of allWords) {
      const key = normalizeForComparison(w.word);
      if (!key) continue;
      const list = groups.get(key) || [];
      list.push(w);
      groups.set(key, list);
    }

    let totalDuplicatesRemoved = 0;
    const removedIds: string[] = [];

    const clusters = Array.from(groups.values());
    for (const cluster of clusters) {
      if (cluster.length <= 1) continue;

      // Sort to find the highest-quality / most-progressed record to keep
      cluster.sort((a: UserWordRow, b: UserWordRow) => {
        const scoreA =
          (a.learned ? 100 : 0) +
          (a.stability || 0) * 10 +
          (a.reps || 0) +
          (a.exampleSentence ? 5 : 0) +
          (a.conjugation ? 5 : 0) +
          (a.gender ? 5 : 0);
        const scoreB =
          (b.learned ? 100 : 0) +
          (b.stability || 0) * 10 +
          (b.reps || 0) +
          (b.exampleSentence ? 5 : 0) +
          (b.conjugation ? 5 : 0) +
          (b.gender ? 5 : 0);
        return scoreB - scoreA;
      });

      const keeper = cluster[0];
      const duplicates = cluster.slice(1);

      // Merge progress into keeper
      const maxStability = Math.max(keeper.stability || 0, ...duplicates.map((d: UserWordRow) => d.stability || 0));
      const maxReps = Math.max(keeper.reps || 0, ...duplicates.map((d: UserWordRow) => d.reps || 0));
      const isLearned = keeper.learned || duplicates.some((d: UserWordRow) => d.learned);

      if (
        maxStability > (keeper.stability || 0) ||
        maxReps > (keeper.reps || 0) ||
        isLearned !== keeper.learned
      ) {
        await db
          .update(userWords)
          .set({
            stability: maxStability,
            reps: maxReps,
            learned: isLearned,
          })
          .where(eq(userWords.id, keeper.id));
      }

      // Re-link review logs to keeper before deleting duplicates
      for (const dup of duplicates) {
        await db
          .update(wordReviewLogs)
          .set({ wordId: keeper.id })
          .where(eq(wordReviewLogs.wordId, dup.id));
        removedIds.push(dup.id);
      }

      totalDuplicatesRemoved += duplicates.length;
    }

    // Delete all duplicate word records in bulk
    if (removedIds.length > 0) {
      await db
        .delete(userWords)
        .where(and(eq(userWords.userId, session.id), inArray(userWords.id, removedIds)));
    }

    // Recalculate word counts and learned counts for all user batches
    const userBatches = await db
      .select()
      .from(wordBatches)
      .where(eq(wordBatches.userId, session.id));

    let affectedSetsCount = 0;
    for (const b of userBatches) {
      const remainingWords = await db
        .select()
        .from(userWords)
        .where(and(eq(userWords.batchId, b.id), eq(userWords.userId, session.id)));

      const learned = remainingWords.filter((w) => w.learned || (w.stability || 0) > 0).length;

      if (b.wordCount !== remainingWords.length || b.learnedCount !== learned) {
        affectedSetsCount++;
        await db
          .update(wordBatches)
          .set({
            wordCount: remainingWords.length,
            learnedCount: learned,
          })
          .where(eq(wordBatches.id, b.id));
      }
    }

    const totalRemainingWords = allWords.length - totalDuplicatesRemoved;

    return NextResponse.json({
      success: true,
      removedDuplicatesCount: totalDuplicatesRemoved,
      affectedSetsCount,
      totalUniqueWords: totalRemainingWords,
      message:
        totalDuplicatesRemoved > 0
          ? `Synchronized! Removed ${totalDuplicatesRemoved} duplicate word${totalDuplicatesRemoved !== 1 ? 's' : ''} across your sets.`
          : 'All words are synchronized! No duplicate words found.',
    });
  } catch (error) {
    console.error('Error synchronizing words:', error);
    return NextResponse.json({ error: 'Failed to synchronize words' }, { status: 500 });
  }
}
