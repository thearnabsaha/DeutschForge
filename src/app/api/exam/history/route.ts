import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { examAttempts, examSectionScores, examTemplates } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const attempts = await db
      .select()
      .from(examAttempts)
      .where(eq(examAttempts.userId, session.id))
      .orderBy(desc(examAttempts.startedAt));

    const history = [];
    for (const attempt of attempts) {
      const [template] = await db
        .select()
        .from(examTemplates)
        .where(eq(examTemplates.id, attempt.templateId))
        .limit(1);

      const sections = await db
        .select()
        .from(examSectionScores)
        .where(eq(examSectionScores.attemptId, attempt.id));

      const totalTime = sections.reduce((s, sec) => s + (sec.timeSpent ?? 0), 0);

      history.push({
        id: attempt.id,
        cefrLevel: attempt.cefrLevel,
        setNumber: attempt.setNumber,
        title: attempt.setNumber
          ? `${attempt.cefrLevel} – Set ${attempt.setNumber}`
          : (template?.title ?? `${attempt.cefrLevel} Exam`),
        totalScore: attempt.totalScore,
        maxScore: attempt.maxScore,
        status: attempt.status,
        startedAt: attempt.startedAt,
        completedAt: attempt.completedAt,
        totalTime,
        sections: sections.map((sec) => ({
          section: sec.section,
          score: sec.score,
          maxScore: sec.maxScore,
          timeSpent: sec.timeSpent,
          hasSnapshot: !!sec.questionSnapshot,
        })),
      });
    }

    return NextResponse.json({ history });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
