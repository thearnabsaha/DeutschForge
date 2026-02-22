import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userWords, wordReviewLogs } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { scheduleReview, type Rating, type CardSchedulingInfo } from '@/lib/fsrs';
import { getCurrentUserId } from '@/lib/get-user';

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const body = (await request.json()) as {
      wordId: string;
      rating: 1 | 2 | 3 | 4;
      mode: string;
      correct: boolean;
    };

    const { wordId, rating, mode, correct } = body;

    if (!wordId || ![1, 2, 3, 4].includes(rating)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(userWords)
      .where(and(eq(userWords.id, wordId), eq(userWords.userId, userId)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Word not found' }, { status: 404 });
    }

    const userWord = existing[0];
    const now = new Date();

    const card: CardSchedulingInfo = {
      stability: userWord.stability,
      difficulty: userWord.difficulty,
      elapsedDays: userWord.lastReview
        ? (now.getTime() - userWord.lastReview.getTime()) / (1000 * 60 * 60 * 24)
        : 0,
      scheduledDays: userWord.scheduledDays,
      reps: userWord.reps,
      lapses: userWord.lapses,
      state: userWord.state as 0 | 1 | 2 | 3,
      lastReview: userWord.lastReview,
      nextReview: userWord.nextReview,
    };

    const result = scheduleReview(card, rating as Rating, now);

    await db
      .update(userWords)
      .set({
        stability: result.stability,
        difficulty: result.difficulty,
        scheduledDays: result.scheduledDays,
        reps: result.reps,
        lapses: result.lapses,
        state: result.state,
        lastReview: now,
        nextReview: result.nextReview,
      })
      .where(eq(userWords.id, wordId));

    await db.insert(wordReviewLogs).values({
      userId,
      wordId,
      mode: mode || 'flashcard',
      rating,
      correct: correct ?? true,
      reviewedAt: now,
    });

    return NextResponse.json({
      success: true,
      nextReview: result.nextReview,
      scheduledDays: result.scheduledDays,
      state: result.state,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    console.error('Review error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
