import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cardStates, reviewLogs, examAttempts } from '@/lib/schema';
import { eq, and, count, avg, gte, lt, desc } from 'drizzle-orm';
import { DEFAULT_USER_ID } from '@/lib/utils';

export async function GET() {
  try {
    const userId = DEFAULT_USER_ID;

    const [totalReviewsResult, avgRatingResult, cardsByStateRows, examHistoryRows] =
      await Promise.all([
        db
          .select({ count: count() })
          .from(reviewLogs)
          .where(eq(reviewLogs.userId, userId)),
        db
          .select({ avg: avg(reviewLogs.rating) })
          .from(reviewLogs)
          .where(eq(reviewLogs.userId, userId)),
        db
          .select({ state: cardStates.state, count: count() })
          .from(cardStates)
          .where(eq(cardStates.userId, userId))
          .groupBy(cardStates.state),
        db
          .select({
            id: examAttempts.id,
            cefrLevel: examAttempts.cefrLevel,
            totalScore: examAttempts.totalScore,
            maxScore: examAttempts.maxScore,
            completedAt: examAttempts.completedAt,
          })
          .from(examAttempts)
          .where(
            and(eq(examAttempts.userId, userId), eq(examAttempts.status, 'completed'))
          )
          .orderBy(desc(examAttempts.completedAt))
          .limit(10),
      ]);

    const totalReviews = totalReviewsResult[0]?.count ?? 0;
    const averageRating = Number(avgRatingResult[0]?.avg ?? 0);
    const cardsByState = cardsByStateRows.map((s) => ({
      state: s.state,
      count: Number(s.count),
    }));

    const dayQueries = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      dayQueries.push(
        db
          .select({ count: count() })
          .from(reviewLogs)
          .where(
            and(
              eq(reviewLogs.userId, userId),
              gte(reviewLogs.reviewedAt, start),
              lt(reviewLogs.reviewedAt, end)
            )
          )
          .then(([row]) => ({
            date: start.toISOString(),
            count: Number(row?.count ?? 0),
          }))
      );
    }
    const recentActivity = await Promise.all(dayQueries);

    const examHistory = examHistoryRows.map((e) => ({
      id: e.id,
      level: e.cefrLevel,
      score: e.totalScore ?? 0,
      maxScore: e.maxScore ?? 100,
      date: e.completedAt?.toISOString() ?? '',
    }));

    return NextResponse.json({
      totalReviews,
      averageRating,
      cardsByState,
      recentActivity,
      examHistory,
    });
  } catch (error) {
    console.error('Progress API error:', error);
    return NextResponse.json({
      totalReviews: 0,
      averageRating: 0,
      cardsByState: [],
      recentActivity: [],
      examHistory: [],
    });
  }
}
