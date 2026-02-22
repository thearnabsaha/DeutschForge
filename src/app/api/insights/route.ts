import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  wordReviewLogs,
  examAttempts,
  examSectionScores,
  grammarAttempts,
  grammarTopics,
  aiInsights,
} from '@/lib/schema';
import { eq, sql, desc, inArray } from 'drizzle-orm';
import { generateInsights } from '@/lib/groq';
import { getCurrentUserId } from '@/lib/get-user';

async function buildAndSaveInsights(forceRegenerate: boolean, userId: string) {

  // 1. Count total word reviews
  const reviewCountResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(wordReviewLogs)
    .where(eq(wordReviewLogs.userId, userId));
  const totalReviews = reviewCountResult[0]?.count ?? 0;

  // 2. Count exam attempts
  const examCountResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(examAttempts)
    .where(eq(examAttempts.userId, userId));
  const examAttemptCount = examCountResult[0]?.count ?? 0;

  // 3. Check thresholds (unless force)
  if (!forceRegenerate && totalReviews < 50 && examAttemptCount < 1) {
    const existing = await db
      .select()
      .from(aiInsights)
      .where(eq(aiInsights.userId, userId))
      .orderBy(desc(aiInsights.generatedAt))
      .limit(1);

    return existing[0] ?? null;
  }

  // 4. Calculate correct rate from word reviews
  const correctResult = await db
    .select({
      total: sql<number>`count(*)::int`,
      correct: sql<number>`count(*) filter (where ${wordReviewLogs.correct} = true)::int`,
    })
    .from(wordReviewLogs)
    .where(eq(wordReviewLogs.userId, userId));
  const total = correctResult[0]?.total ?? 0;
  const correct = correctResult[0]?.correct ?? 0;
  const correctRate = total > 0 ? correct / total : 0;

  // 5. Get weak areas from grammar attempts (topics with low scores)
  const grammarTopicScores = await db
    .select({
      topicId: grammarAttempts.topicId,
      topicTitle: grammarTopics.title,
      avgScore: sql<number>`avg(${grammarAttempts.score} / nullif(${grammarAttempts.maxScore}, 0) * 100)::numeric`,
    })
    .from(grammarAttempts)
    .innerJoin(grammarTopics, eq(grammarTopics.id, grammarAttempts.topicId))
    .where(eq(grammarAttempts.userId, userId))
    .groupBy(grammarAttempts.topicId, grammarTopics.title);

  const weakGrammarTopics = grammarTopicScores
    .filter((r) => (r.avgScore ?? 0) < 70)
    .map((r) => `${r.topicTitle} (grammar: ${Math.round(r.avgScore ?? 0)}%)`);

  // 6. Get weak areas from exam section scores
  const userAttempts = await db
    .select({ id: examAttempts.id })
    .from(examAttempts)
    .where(eq(examAttempts.userId, userId));

  const attemptIds = userAttempts.map((a) => a.id);
  let weakExamSections: string[] = [];

  if (attemptIds.length > 0) {
    const sectionScores = await db
      .select({
        section: examSectionScores.section,
        avgPct: sql<number>`avg((${examSectionScores.score} / nullif(${examSectionScores.maxScore}, 0)) * 100)::numeric`,
      })
      .from(examSectionScores)
      .where(inArray(examSectionScores.attemptId, attemptIds))
      .groupBy(examSectionScores.section);

    weakExamSections = sectionScores
      .filter((s) => (s.avgPct ?? 0) < 70)
      .map((s) => `${s.section} (exam: ${Math.round(s.avgPct ?? 0)}%)`);
  }

  const weakAreas = [...weakGrammarTopics, ...weakExamSections];
  if (weakAreas.length === 0) {
    weakAreas.push('Continue practicing to identify weak areas');
  }

  // 7. Get exam scores by section for generateInsights
  const examScoresBySection: Array<{ section: string; score: number }> = [];
  for (const att of userAttempts) {
    const sections = await db
      .select()
      .from(examSectionScores)
      .where(eq(examSectionScores.attemptId, att.id));
    for (const s of sections) {
      examScoresBySection.push({
        section: s.section,
        score: (s.score ?? 0) / (s.maxScore > 0 ? s.maxScore : 1),
      });
    }
  }

  // 8. Call generateInsights
  const insights = await generateInsights({
    totalReviews,
    correctRate,
    weakAreas,
    examScores: examScoresBySection,
  });

  // 9. Save to aiInsights
  const dataPoints = totalReviews + examAttemptCount;

  const [inserted] = await db
    .insert(aiInsights)
    .values({
      userId,
      strengths: insights.strengths,
      weaknesses: insights.weaknesses,
      recommendations: insights.recommendations,
      dataPoints,
    })
    .returning();

  return inserted;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const result = await buildAndSaveInsights(false, userId);

    if (!result) {
      return NextResponse.json({
        message: 'Insufficient data. Complete at least 50 word reviews or 1 exam to generate insights.',
        insight: null,
      });
    }

    return NextResponse.json({
      insight: {
        id: result.id,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        recommendations: result.recommendations,
        dataPoints: result.dataPoints,
        generatedAt: result.generatedAt?.toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    console.error('Insights GET error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const result = await buildAndSaveInsights(true, userId);

    if (!result) {
      return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
    }

    return NextResponse.json({
      insight: {
        id: result.id,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        recommendations: result.recommendations,
        dataPoints: result.dataPoints,
        generatedAt: result.generatedAt?.toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    console.error('Insights POST error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
