import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userWords, wordReviewLogs, grammarTopics, grammarAttempts, examAttempts, examSectionScores, aiInsights, conversationSessions } from '@/lib/schema';
import { eq, and, gte, desc } from 'drizzle-orm';
import { DEFAULT_USER_ID } from '@/lib/utils';

export async function GET() {
  try {
    // 1. Vocabulary stats
    const allWords = await db.select().from(userWords).where(eq(userWords.userId, DEFAULT_USER_ID));
    const totalWords = allWords.length;
    const byPOS: Record<string, number> = {};
    const byGender: Record<string, number> = { masculine: 0, feminine: 0, neuter: 0 };
    const byCEFR: Record<string, number> = { A1: 0, A2: 0, B1: 0, B2: 0 };
    const mastered = allWords.filter(w => w.state >= 2 && w.stability >= 21).length;

    for (const w of allWords) {
      byPOS[w.partOfSpeech] = (byPOS[w.partOfSpeech] || 0) + 1;
      if (w.gender) byGender[w.gender] = (byGender[w.gender] || 0) + 1;
      byCEFR[w.cefrLevel] = (byCEFR[w.cefrLevel] || 0) + 1;
    }

    // 2. Review stats (today and streak)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayReviews = await db.select().from(wordReviewLogs)
      .where(and(eq(wordReviewLogs.userId, DEFAULT_USER_ID), gte(wordReviewLogs.reviewedAt, today)));

    // Calculate streak: count consecutive days with reviews
    const allReviews = await db.select({ reviewedAt: wordReviewLogs.reviewedAt })
      .from(wordReviewLogs)
      .where(eq(wordReviewLogs.userId, DEFAULT_USER_ID))
      .orderBy(desc(wordReviewLogs.reviewedAt));

    let streak = 0;
    if (allReviews.length > 0) {
      const checkDate = new Date();
      checkDate.setHours(0, 0, 0, 0);
      const reviewDates = new Set(allReviews.map(r => {
        const d = new Date(r.reviewedAt);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      }));

      while (reviewDates.has(checkDate.getTime())) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }

    // 3. Grammar completion
    const allTopics = await db.select().from(grammarTopics);
    const topicsByLevel: Record<string, number> = {};
    for (const t of allTopics) {
      topicsByLevel[t.cefrLevel] = (topicsByLevel[t.cefrLevel] || 0) + 1;
    }

    const allGrammarAttempts = await db.select().from(grammarAttempts)
      .where(eq(grammarAttempts.userId, DEFAULT_USER_ID));
    const completedTopicIds = new Set(allGrammarAttempts.filter(a => a.score / a.maxScore >= 0.6).map(a => a.topicId));
    const grammarCompletion = allTopics.length > 0 ? Math.round((completedTopicIds.size / allTopics.length) * 100) : 0;

    // 4. Exam history
    const exams = await db.select().from(examAttempts)
      .where(eq(examAttempts.userId, DEFAULT_USER_ID))
      .orderBy(desc(examAttempts.startedAt))
      .limit(10);

    const examHistory = [];
    for (const exam of exams) {
      const sections = await db.select().from(examSectionScores)
        .where(eq(examSectionScores.attemptId, exam.id));
      examHistory.push({ ...exam, sections });
    }

    // 5. Latest insights
    const [latestInsight] = await db.select().from(aiInsights)
      .where(eq(aiInsights.userId, DEFAULT_USER_ID))
      .orderBy(desc(aiInsights.generatedAt))
      .limit(1);

    // 6. Memory stability index (avg stability of all words)
    const avgStability = allWords.length > 0
      ? Math.round(allWords.reduce((s, w) => s + w.stability, 0) / allWords.length * 10) / 10
      : 0;

    // 7. Conversation count
    const conversations = await db.select().from(conversationSessions)
      .where(eq(conversationSessions.userId, DEFAULT_USER_ID));

    // 8. Words due for review
    const now = new Date();
    const dueWords = allWords.filter(w => new Date(w.nextReview) <= now).length;

    return NextResponse.json({
      vocabulary: { totalWords, mastered, byPOS, byGender, byCEFR, dueWords },
      reviews: { today: todayReviews.length, streak },
      grammar: { totalTopics: allTopics.length, completed: completedTopicIds.size, completion: grammarCompletion, byLevel: topicsByLevel },
      exams: { history: examHistory, totalAttempts: exams.length },
      insights: latestInsight || null,
      memoryStability: avgStability,
      conversations: conversations.length,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
