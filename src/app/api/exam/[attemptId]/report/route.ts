import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { examAttempts, examSectionScores } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _request: NextRequest,
  { params }: { params: { attemptId: string } }
) {
  try {
    const { attemptId } = params;

    const [attempt] = await db
      .select()
      .from(examAttempts)
      .where(eq(examAttempts.id, attemptId))
      .limit(1);

    if (!attempt) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const sections = await db
      .select()
      .from(examSectionScores)
      .where(eq(examSectionScores.attemptId, attemptId));

    if (attempt.status !== 'completed') {
      const totalScore = sections.reduce(
        (sum, s) => sum + (s.score ?? 0),
        0
      );
      const maxScore = sections.reduce(
        (sum, s) => sum + (s.maxScore ?? 0),
        0
      );
      await db
        .update(examAttempts)
        .set({
          totalScore,
          maxScore,
          status: 'completed',
          completedAt: new Date(),
        })
        .where(eq(examAttempts.id, attemptId));

      attempt.totalScore = totalScore;
      attempt.maxScore = maxScore;
      attempt.completedAt = new Date();
    }

    return NextResponse.json({
      cefrLevel: attempt.cefrLevel,
      totalScore: attempt.totalScore ?? 0,
      maxScore: attempt.maxScore ?? 100,
      completedAt: attempt.completedAt?.toISOString(),
      sections: sections.map((s) => ({
        section: s.section,
        score: s.score,
        maxScore: s.maxScore,
        feedback: s.feedback,
      })),
    });
  } catch (error) {
    console.error('Report error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
