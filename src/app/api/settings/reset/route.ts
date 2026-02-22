import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userWords, wordReviewLogs, wordBatches, wordBatchExams, examAttempts, examSectionScores, aiInsights, reminders, users, resetLogs, questionSnapshots } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { type, confirmation } = await req.json();

    if (confirmation !== 'RESET') {
      return NextResponse.json({ error: 'Type RESET to confirm' }, { status: 400 });
    }

    if (!['vocabulary', 'progress', 'hard'].includes(type)) {
      return NextResponse.json({ error: 'Invalid reset type' }, { status: 400 });
    }

    const userId = session.id;

    if (type === 'vocabulary' || type === 'hard') {
      await db.delete(questionSnapshots).where(eq(questionSnapshots.userId, userId));
      await db.delete(wordBatchExams).where(eq(wordBatchExams.userId, userId));
      await db.delete(wordReviewLogs).where(eq(wordReviewLogs.userId, userId));
      await db.delete(userWords).where(eq(userWords.userId, userId));
      await db.delete(wordBatches).where(eq(wordBatches.userId, userId));
    }

    if (type === 'progress' || type === 'hard') {
      await db.delete(wordReviewLogs).where(eq(wordReviewLogs.userId, userId));
      await db.delete(wordBatchExams).where(eq(wordBatchExams.userId, userId));

      const userExams = await db.select({ id: examAttempts.id }).from(examAttempts).where(eq(examAttempts.userId, userId));
      for (const exam of userExams) {
        await db.delete(examSectionScores).where(eq(examSectionScores.attemptId, exam.id));
      }
      await db.delete(examAttempts).where(eq(examAttempts.userId, userId));

      await db.delete(aiInsights).where(eq(aiInsights.userId, userId));
      await db.delete(reminders).where(eq(reminders.userId, userId));
      await db.delete(questionSnapshots).where(eq(questionSnapshots.userId, userId));
      await db.update(users).set({ xp: 0, level: 1 }).where(eq(users.id, userId));
    }

    await db.insert(resetLogs).values({ userId, resetType: type });

    return NextResponse.json({ success: true, type });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    console.error('Reset error:', error);
    return NextResponse.json({ error: 'Reset failed' }, { status: 500 });
  }
}
