import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { wordBatchExams, wordBatches, users } from '@/lib/schema';
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
    // answers: Array<{ wordId, type, userAnswer, correctAnswer, correct }>

    const total = answers.length;
    const correctCount = answers.filter((a: { correct: boolean }) => a.correct).length;
    const score = correctCount;
    const maxScore = total;

    const vocabAnswers = answers.filter((a: { type: string }) => a.type === 'meaning');
    const genderAnswers = answers.filter((a: { type: string }) => a.type === 'gender');
    const verbAnswers = answers.filter((a: { type: string }) => a.type === 'verb' || a.type === 'verb_tense');

    const vocabAcc =
      vocabAnswers.length > 0
        ? (vocabAnswers.filter((a: { correct: boolean }) => a.correct).length /
            vocabAnswers.length) *
          100
        : null;
    const genderAcc =
      genderAnswers.length > 0
        ? (genderAnswers.filter((a: { correct: boolean }) => a.correct).length /
            genderAnswers.length) *
          100
        : null;
    const verbAcc =
      verbAnswers.length > 0
        ? (verbAnswers.filter((a: { correct: boolean }) => a.correct).length /
            verbAnswers.length) *
          100
        : null;

    const [exam] = await db
      .insert(wordBatchExams)
      .values({
        userId: session.id,
        batchId,
        score,
        maxScore,
        vocabAccuracy: vocabAcc,
        genderAccuracy: genderAcc,
        verbAccuracy: verbAcc,
        timeSpent: timeSpent ?? null,
        answers,
      })
      .returning();

    // Unlock exam on batch (mark as completed)
    await db
      .update(wordBatches)
      .set({ examUnlocked: true })
      .where(eq(wordBatches.id, batchId));

    // Award XP based on score
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
      vocabAccuracy: vocabAcc,
      genderAccuracy: genderAcc,
      verbAccuracy: verbAcc,
    });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
