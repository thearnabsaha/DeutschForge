import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { expressionBatchExams, expressionBatches, users } from '@/lib/schema';
import { eq, sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const { batchId } = await params;

    const { answers, timeSpent } = await req.json();

    const total = answers.length;
    const correctCount = answers.filter((a: { correct: boolean }) => a.correct).length;
    const score = correctCount;
    const maxScore = total;

    const meaningAnswers = answers.filter((a: { type: string }) => a.type === 'meaning');
    const meaningAcc =
      meaningAnswers.length > 0
        ? (meaningAnswers.filter((a: { correct: boolean }) => a.correct).length / meaningAnswers.length) * 100
        : null;

    const [exam] = await db
      .insert(expressionBatchExams)
      .values({
        userId: session.id,
        batchId,
        score,
        maxScore,
        meaningAccuracy: meaningAcc,
        timeSpent: timeSpent ?? null,
        answers,
      })
      .returning();

    await db
      .update(expressionBatches)
      .set({ examUnlocked: true })
      .where(eq(expressionBatches.id, batchId));

    const xpEarned = correctCount * 10;
    await db
      .update(users)
      .set({ xp: sql`${users.xp} + ${xpEarned}` })
      .where(eq(users.id, session.id));

    return NextResponse.json({
      exam,
      xpEarned,
      score,
      maxScore,
      meaningAccuracy: meaningAcc,
    });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
