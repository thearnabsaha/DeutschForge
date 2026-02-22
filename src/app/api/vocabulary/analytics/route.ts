import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userWords, wordReviewLogs } from '@/lib/schema';
import { eq, sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const userId = session.id;

    // Get all words with review stats
    const words = await db.select().from(userWords).where(eq(userWords.userId, userId));

    // Get review logs per word
    const reviewStats = await db
      .select({
        wordId: wordReviewLogs.wordId,
        totalReviews: sql<number>`count(*)::int`,
        correctCount: sql<number>`count(*) filter (where ${wordReviewLogs.correct} = true)::int`,
        wrongCount: sql<number>`count(*) filter (where ${wordReviewLogs.correct} = false)::int`,
      })
      .from(wordReviewLogs)
      .where(eq(wordReviewLogs.userId, userId))
      .groupBy(wordReviewLogs.wordId);

    const statsMap = new Map(reviewStats.map((s) => [s.wordId, s]));

    const wordAnalytics = words.map((w) => {
      const stats = statsMap.get(w.id);
      const totalReviews = stats?.totalReviews ?? 0;
      const correctCount = stats?.correctCount ?? 0;
      const wrongCount = stats?.wrongCount ?? 0;
      const accuracy = totalReviews > 0 ? Math.round((correctCount / totalReviews) * 100) : 0;

      let category: 'hard' | 'medium' | 'easy' | 'mastered' | 'new';
      if (totalReviews === 0) category = 'new';
      else if (accuracy >= 90 && totalReviews >= 5) category = 'mastered';
      else if (accuracy >= 70) category = 'easy';
      else if (accuracy >= 40) category = 'medium';
      else category = 'hard';

      return {
        id: w.id,
        word: w.word,
        meaning: w.meaning,
        partOfSpeech: w.partOfSpeech,
        gender: w.gender,
        totalReviews,
        correctCount,
        wrongCount,
        accuracy,
        category,
      };
    });

    // Sort hard words first (lowest accuracy)
    const hardWords = wordAnalytics
      .filter((w) => w.category === 'hard')
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 10);
    const masteredWords = wordAnalytics.filter((w) => w.category === 'mastered');
    const easyWords = wordAnalytics.filter((w) => w.category === 'easy');

    const summary = {
      total: words.length,
      hard: wordAnalytics.filter((w) => w.category === 'hard').length,
      medium: wordAnalytics.filter((w) => w.category === 'medium').length,
      easy: easyWords.length,
      mastered: masteredWords.length,
      new: wordAnalytics.filter((w) => w.category === 'new').length,
    };

    return NextResponse.json({ hardWords, summary, allWords: wordAnalytics });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
