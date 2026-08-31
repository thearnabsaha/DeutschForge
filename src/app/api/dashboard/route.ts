import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userWords, wordReviewLogs, grammarAttempts, examAttempts, examSectionScores, aiInsights, conversationSessions, users } from '@/lib/schema';
import { GRAMMAR_TOPICS } from '@/lib/grammar-data';
import { eq, and, gte, desc, inArray } from 'drizzle-orm';
import { getCurrentUserId } from '@/lib/get-user';

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    ninetyDaysAgo.setHours(0, 0, 0, 0);

    // Run all independent queries in parallel
    const [
      allWords,
      todayReviews,
      recentReviews,
      allGrammarAttempts,
      exams,
      latestInsights,
      conversations,
      userRecords,
    ] = await Promise.all([
      db.select().from(userWords).where(eq(userWords.userId, userId)),
      db.select({ id: wordReviewLogs.id }).from(wordReviewLogs).where(and(eq(wordReviewLogs.userId, userId), gte(wordReviewLogs.reviewedAt, today))),
      db.select({ reviewedAt: wordReviewLogs.reviewedAt }).from(wordReviewLogs).where(and(eq(wordReviewLogs.userId, userId), gte(wordReviewLogs.reviewedAt, ninetyDaysAgo))).orderBy(desc(wordReviewLogs.reviewedAt)),
      db.select({ topicId: grammarAttempts.topicId, score: grammarAttempts.score, maxScore: grammarAttempts.maxScore }).from(grammarAttempts).where(eq(grammarAttempts.userId, userId)),
      db.select().from(examAttempts).where(eq(examAttempts.userId, userId)).orderBy(desc(examAttempts.startedAt)).limit(10),
      db.select().from(aiInsights).where(eq(aiInsights.userId, userId)).orderBy(desc(aiInsights.generatedAt)).limit(1),
      db.select({ id: conversationSessions.id }).from(conversationSessions).where(eq(conversationSessions.userId, userId)),
      db.select({ xp: users.xp, level: users.level }).from(users).where(eq(users.id, userId)),
    ]);

    // 1. Vocabulary stats
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

    // Verb breakdown
    const verbs = allWords.filter(w => w.partOfSpeech === 'verb');
    const verbBreakdown = {
      total: verbs.length,
      regular: verbs.filter(w => w.verbType === 'regular').length,
      irregular: verbs.filter(w => w.verbType === 'irregular').length,
      mixed: verbs.filter(w => w.verbType === 'mixed').length,
      haben: verbs.filter(w => w.auxiliaryType === 'haben').length,
      sein: verbs.filter(w => w.auxiliaryType === 'sein').length,
    };

    // 2. Calculate streak
    let streak = 0;
    if (recentReviews.length > 0) {
      const checkDate = new Date();
      checkDate.setHours(0, 0, 0, 0);
      const reviewDates = new Set(recentReviews.map(r => {
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
    const allTopics = GRAMMAR_TOPICS;
    const topicsByLevel: Record<string, number> = {};
    for (const t of allTopics) {
      const level = t.cefrLevel || 'A1';
      topicsByLevel[level] = (topicsByLevel[level] || 0) + 1;
    }

    const completedTopicIds = new Set(allGrammarAttempts.filter(a => a.score / a.maxScore >= 0.6).map(a => a.topicId));
    const grammarCompletion = allTopics.length > 0 ? Math.round((completedTopicIds.size / allTopics.length) * 100) : 0;

    // 4. Exam history
    let examHistory: Array<typeof exams[number] & { sections: any[] }> = [];
    if (exams.length > 0) {
      const examIds = exams.map(e => e.id);
      const allSections = await db.select().from(examSectionScores)
        .where(inArray(examSectionScores.attemptId, examIds));

      const sectionsByAttempt = new Map<string, typeof allSections>();
      for (const section of allSections) {
        const existing = sectionsByAttempt.get(section.attemptId) || [];
        existing.push(section);
        sectionsByAttempt.set(section.attemptId, existing);
      }

      examHistory = exams.map(exam => ({
        ...exam,
        sections: sectionsByAttempt.get(exam.id) || [],
      }));
    }

    // 5. Latest insights
    const latestInsight = latestInsights[0] || null;

    // 6. Memory stability index
    const avgStability = allWords.length > 0
      ? Math.round(allWords.reduce((s, w) => s + w.stability, 0) / allWords.length * 10) / 10
      : 0;

    // 7. Words due for review
    const now = new Date();
    const dueWords = allWords.filter(w => new Date(w.nextReview) <= now).length;

    // 8. User XP
    const user = userRecords[0];
    const xp = user?.xp ?? 0;
    const level = Math.floor(xp / 100) + 1;
    const xpInLevel = xp % 100;

    return NextResponse.json({
      vocabulary: { totalWords, mastered, byPOS, byGender, byCEFR, dueWords, verbBreakdown },
      reviews: { today: todayReviews.length, streak },
      grammar: { totalTopics: allTopics.length, completed: completedTopicIds.size, completion: grammarCompletion, byLevel: topicsByLevel },
      exams: { history: examHistory, totalAttempts: exams.length },
      insights: latestInsight,
      memoryStability: avgStability,
      conversations: conversations.length,
      xp: { total: xp, level, xpInLevel, xpForNextLevel: 100 },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
