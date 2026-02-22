import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userWords, wordBatches, users } from '@/lib/schema';
import { eq, and, sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const { batchId } = await params;
    const { wordId } = await req.json();

    if (!wordId) return NextResponse.json({ error: 'wordId required' }, { status: 400 });

    await db
      .update(userWords)
      .set({ learned: true })
      .where(and(eq(userWords.id, wordId), eq(userWords.userId, session.id)));

    // Award XP
    await db
      .update(users)
      .set({ xp: sql`${users.xp} + 10` })
      .where(eq(users.id, session.id));

    // Check if all words learned in batch
    const batchWords = await db
      .select()
      .from(userWords)
      .where(
        and(eq(userWords.batchId, batchId), eq(userWords.userId, session.id))
      );
    const allLearned = batchWords.every((w) => w.learned);

    if (allLearned) {
      await db
        .update(wordBatches)
        .set({ practiceUnlocked: true, learnedCount: batchWords.length })
        .where(eq(wordBatches.id, batchId));
    } else {
      const learnedCount = batchWords.filter((w) => w.learned).length;
      await db
        .update(wordBatches)
        .set({ learnedCount })
        .where(eq(wordBatches.id, batchId));
    }

    return NextResponse.json({ success: true, allLearned, xpEarned: 10 });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
