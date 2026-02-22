import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userWords } from '@/lib/schema';
import { eq, and, lte, asc } from 'drizzle-orm';
import { getCurrentUserId } from '@/lib/get-user';

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'flashcard';
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 50);
    const now = new Date();

    // Mode-specific filters
    const posFilter =
      mode === 'gender'
        ? eq(userWords.partOfSpeech, 'noun')
        : mode === 'conjugation'
          ? eq(userWords.partOfSpeech, 'verb')
          : undefined;

    const baseConditions = [eq(userWords.userId, userId), lte(userWords.nextReview, now)];
    const fullConditions = posFilter ? and(...baseConditions, posFilter) : and(...baseConditions);

    // 1. Query userWords for due words (nextReview <= now), ordered by nextReview ASC
    let dueWords = await db
      .select()
      .from(userWords)
      .where(fullConditions)
      .orderBy(asc(userWords.nextReview))
      .limit(limit);

    // 2. If not enough, get new words (reps = 0, never reviewed)
    if (dueWords.length < limit) {
      const remaining = limit - dueWords.length;
      const dueIds = new Set(dueWords.map((w) => w.id));

      const newConditions = [
        eq(userWords.userId, userId),
        eq(userWords.reps, 0),
        ...(posFilter ? [posFilter] : []),
      ];

      const newWords = await db
        .select()
        .from(userWords)
        .where(and(...newConditions))
        .orderBy(asc(userWords.createdAt))
        .limit(remaining + 20);

      const filteredNew = newWords.filter((w) => !dueIds.has(w.id)).slice(0, remaining);
      dueWords = [...dueWords, ...filteredNew];
    }

    // 3. Shuffle
    const words = [...dueWords];
    for (let i = words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [words[i], words[j]] = [words[j], words[i]];
    }

    return NextResponse.json({ words });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    console.error('Practice queue error:', error);
    return NextResponse.json({ words: [] });
  }
}
