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
import { eq, sql, inArray } from 'drizzle-orm';
import { generateInsights } from '@/lib/groq';
import { DEFAULT_USER_ID } from '@/lib/utils';

export async function POST(_request: NextRequest) {
  try {
    const userId = DEFAULT_USER_ID;

    // Count total word reviews
    const reviewCountResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(wordReviewLogs)
      .where(eq(wordReviewLogs.userId, userId));
    const totalReviews = reviewCountResult[0]?.count ?? 0;

    // Count exam attempts
    const examCountResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(examAttempts)
      .where(eq(examAttempts.userId, userId));
    const examAttemptCount = examCountResult[0]?.count ?? 0;

    // Calculate correct rate from word reviews
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

    // Get weak areas from grammar attempts
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

    // Get weak areas from exam section scores
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

    // Get exam scores by section
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

    const insights = await generateInsights({
      totalReviews,
      correctRate,
      weakAreas,
      examScores: examScoresBySection,
    });

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

    return NextResponse.json({
      insight: {
        id: inserted.id,
        strengths: inserted.strengths,
        weaknesses: inserted.weaknesses,
        recommendations: inserted.recommendations,
        dataPoints: inserted.dataPoints,
        generatedAt: inserted.generatedAt?.toISOString(),
      },
    });
  } catch (error) {
    console.error('Insights generate error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
