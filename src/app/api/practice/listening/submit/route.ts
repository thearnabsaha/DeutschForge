import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { listeningAttempts, users } from '@/lib/schema';
import { eq, sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { attemptId, answers, timeSpent } = await req.json();

    if (!attemptId || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }

    const [attempt] = await db.select().from(listeningAttempts)
      .where(eq(listeningAttempts.id, attemptId));

    if (!attempt || attempt.userId !== session.id) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    }

    if (attempt.completedAt) {
      return NextResponse.json({ error: 'Already submitted' }, { status: 400 });
    }

    const questions = attempt.questions as Array<{
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
      type: string;
    }>;

    const gradedAnswers = answers.map((a: { questionIndex: number; userAnswer: number | string }, i: number) => {
      const q = questions[a.questionIndex ?? i];
      if (!q) return { questionIndex: i, userAnswer: a.userAnswer, correct: false };

      let correct = false;
      if (q.type === 'short_answer' && typeof a.userAnswer === 'string') {
        const normalizedUser = a.userAnswer.trim().toLowerCase();
        const normalizedCorrect = q.options[q.correctIndex]?.trim().toLowerCase() || '';
        correct = normalizedUser === normalizedCorrect || normalizedCorrect.includes(normalizedUser);
      } else {
        correct = a.userAnswer === q.correctIndex;
      }

      return { questionIndex: a.questionIndex ?? i, userAnswer: a.userAnswer, correct };
    });

    const correctCount = gradedAnswers.filter((a: { correct: boolean }) => a.correct).length;
    const score = correctCount;
    const maxScore = questions.length;

    await db.update(listeningAttempts).set({
      answers: gradedAnswers,
      score,
      maxScore,
      timeSpent: timeSpent ?? null,
      completedAt: new Date(),
    }).where(eq(listeningAttempts.id, attemptId));

    const xpEarned = correctCount * 10;
    await db.update(users).set({ xp: sql`${users.xp} + ${xpEarned}` })
      .where(eq(users.id, session.id));

    const results = questions.map((q, i) => ({
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
      type: q.type,
      userAnswer: gradedAnswers[i]?.userAnswer,
      correct: gradedAnswers[i]?.correct ?? false,
    }));

    return NextResponse.json({
      score,
      maxScore,
      xpEarned,
      percentage: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
      results,
    });
  } catch (error) {
    console.error('Listening submit error:', error);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
