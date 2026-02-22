import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { examAttempts, examSectionScores, examTemplates } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _req: Request,
  { params }: { params: { attemptId: string } }
) {
  try {
    const attemptId = params.attemptId;

    const [attempt] = await db
      .select()
      .from(examAttempts)
      .where(eq(examAttempts.id, attemptId));

    if (!attempt) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    }

    const [template] = await db
      .select()
      .from(examTemplates)
      .where(eq(examTemplates.id, attempt.templateId));

    const sections = await db
      .select()
      .from(examSectionScores)
      .where(eq(examSectionScores.attemptId, attemptId));

    const totalScore = sections.reduce((s, sec) => s + (sec.score ?? 0), 0);
    const maxScore = sections.reduce((s, sec) => s + (sec.maxScore ?? 0), 0);
    const totalTimeSpent = sections.reduce((s, sec) => s + (sec.timeSpent ?? 0), 0);

    const weakAreas = sections
      .filter((s) => s.maxScore > 0 && (s.score ?? 0) / s.maxScore < 0.75)
      .map((s) => s.section);

    return NextResponse.json({
      attempt: {
        id: attempt.id,
        cefrLevel: attempt.cefrLevel,
        status: attempt.status,
        startedAt: attempt.startedAt,
        completedAt: attempt.completedAt,
      },
      template: template
        ? { id: template.id, title: template.title, cefrLevel: template.cefrLevel }
        : null,
      sections: sections.map((s) => ({
        section: s.section,
        score: s.score,
        maxScore: s.maxScore,
        answers: s.answers,
        feedback: s.feedback,
        questionSnapshot: s.questionSnapshot,
        timeSpent: s.timeSpent,
        completedAt: s.completedAt,
      })),
      summary: {
        totalScore: Math.round(totalScore * 100) / 100,
        maxScore,
        percentage: maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0,
        totalTimeSpent,
        weakAreas,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
