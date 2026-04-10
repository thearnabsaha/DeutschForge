import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  userWords,
  wordReviewLogs,
  wordBatches,
  wordBatchExams,
  grammarTopics,
  grammarAttempts,
  examAttempts,
  examSectionScores,
  listeningAttempts,
  conversationSessions,
  users,
} from '@/lib/schema';
import { eq, and, gte, desc, sql, count } from 'drizzle-orm';
import { getCurrentUserId } from '@/lib/get-user';

export async function GET() {
  try {
    const userId = await getCurrentUserId();

    const [
      allWords,
      allReviewLogs,
      allBatches,
      allBatchExams,
      allGrammarTopics,
      allGrammarAttempts,
      completedExams,
      allListening,
      allConversations,
      [user],
    ] = await Promise.all([
      db.select().from(userWords).where(eq(userWords.userId, userId)),
      db.select().from(wordReviewLogs).where(eq(wordReviewLogs.userId, userId)).orderBy(desc(wordReviewLogs.reviewedAt)),
      db.select().from(wordBatches).where(eq(wordBatches.userId, userId)),
      db.select().from(wordBatchExams).where(eq(wordBatchExams.userId, userId)).orderBy(desc(wordBatchExams.completedAt)),
      db.select().from(grammarTopics),
      db.select().from(grammarAttempts).where(eq(grammarAttempts.userId, userId)),
      db.select().from(examAttempts).where(and(eq(examAttempts.userId, userId), eq(examAttempts.status, 'completed'))).orderBy(desc(examAttempts.completedAt)),
      db.select().from(listeningAttempts).where(eq(listeningAttempts.userId, userId)).orderBy(desc(listeningAttempts.createdAt)),
      db.select().from(conversationSessions).where(eq(conversationSessions.userId, userId)),
      db.select({ xp: users.xp, level: users.level, createdAt: users.createdAt }).from(users).where(eq(users.id, userId)),
    ]);

    // ── VOCABULARY OVERVIEW ──
    const totalWords = allWords.length;
    const nouns = allWords.filter(w => w.partOfSpeech === 'noun');
    const verbs = allWords.filter(w => w.partOfSpeech === 'verb');
    const adjectives = allWords.filter(w => w.partOfSpeech === 'adjective');
    const others = allWords.filter(w => !['noun', 'verb', 'adjective'].includes(w.partOfSpeech));

    const byPOS: Record<string, number> = {};
    for (const w of allWords) {
      byPOS[w.partOfSpeech] = (byPOS[w.partOfSpeech] || 0) + 1;
    }

    const byCEFR: Record<string, number> = { A1: 0, A2: 0, B1: 0, B2: 0 };
    for (const w of allWords) {
      byCEFR[w.cefrLevel] = (byCEFR[w.cefrLevel] || 0) + 1;
    }

    const now = new Date();
    const dueWords = allWords.filter(w => new Date(w.nextReview) <= now).length;
    const learnedWords = allWords.filter(w => w.learned).length;
    const masteredWords = allWords.filter(w => w.state >= 2 && w.stability >= 21).length;

    // FSRS state distribution
    const byState: Record<string, number> = { new: 0, learning: 0, review: 0, relearning: 0 };
    for (const w of allWords) {
      if (w.state === 0) byState.new++;
      else if (w.state === 1) byState.learning++;
      else if (w.state === 2) byState.review++;
      else if (w.state === 3) byState.relearning++;
    }

    // ── GENDER ANALYTICS ──
    const genderDist = { masculine: 0, feminine: 0, neuter: 0 };
    for (const n of nouns) {
      if (n.gender === 'masculine') genderDist.masculine++;
      else if (n.gender === 'feminine') genderDist.feminine++;
      else if (n.gender === 'neuter') genderDist.neuter++;
    }

    const genderReviews = allReviewLogs.filter(r => r.mode === 'gender');
    const genderCorrect = genderReviews.filter(r => r.correct).length;
    const genderAccuracy = genderReviews.length > 0 ? Math.round((genderCorrect / genderReviews.length) * 100) : 0;

    // Per-gender accuracy from review logs
    const genderReviewMap: Record<string, { total: number; correct: number }> = {
      masculine: { total: 0, correct: 0 },
      feminine: { total: 0, correct: 0 },
      neuter: { total: 0, correct: 0 },
    };
    for (const r of genderReviews) {
      const word = allWords.find(w => w.id === r.wordId);
      if (word?.gender && genderReviewMap[word.gender]) {
        genderReviewMap[word.gender].total++;
        if (r.correct) genderReviewMap[word.gender].correct++;
      }
    }
    const genderAccuracyByType = {
      masculine: genderReviewMap.masculine.total > 0 ? Math.round((genderReviewMap.masculine.correct / genderReviewMap.masculine.total) * 100) : null,
      feminine: genderReviewMap.feminine.total > 0 ? Math.round((genderReviewMap.feminine.correct / genderReviewMap.feminine.total) * 100) : null,
      neuter: genderReviewMap.neuter.total > 0 ? Math.round((genderReviewMap.neuter.correct / genderReviewMap.neuter.total) * 100) : null,
    };

    // ── WORDS PRACTICE ANALYTICS ──
    const meaningReviews = allReviewLogs.filter(r => r.mode === 'meaning' || r.mode === 'flashcard');
    const meaningCorrect = meaningReviews.filter(r => r.correct).length;
    const meaningAccuracy = meaningReviews.length > 0 ? Math.round((meaningCorrect / meaningReviews.length) * 100) : 0;

    const conjugationReviews = allReviewLogs.filter(r => r.mode === 'conjugation');
    const conjugationCorrect = conjugationReviews.filter(r => r.correct).length;
    const conjugationAccuracy = conjugationReviews.length > 0 ? Math.round((conjugationCorrect / conjugationReviews.length) * 100) : 0;

    const sentenceReviews = allReviewLogs.filter(r => r.mode === 'sentence');

    // Per-mode breakdown
    const modeBreakdown: Record<string, { total: number; correct: number; accuracy: number }> = {};
    for (const r of allReviewLogs) {
      if (!modeBreakdown[r.mode]) modeBreakdown[r.mode] = { total: 0, correct: 0, accuracy: 0 };
      modeBreakdown[r.mode].total++;
      if (r.correct) modeBreakdown[r.mode].correct++;
    }
    for (const mode of Object.keys(modeBreakdown)) {
      const m = modeBreakdown[mode];
      m.accuracy = m.total > 0 ? Math.round((m.correct / m.total) * 100) : 0;
    }

    // ── REVIEW ACTIVITY (last 30 days) ──
    const dailyActivity: { date: string; count: number; correct: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().split('T')[0];
      const dayLogs = allReviewLogs.filter(r => {
        const rDate = new Date(r.reviewedAt).toISOString().split('T')[0];
        return rDate === dayStr;
      });
      dailyActivity.push({
        date: dayStr,
        count: dayLogs.length,
        correct: dayLogs.filter(r => r.correct).length,
      });
    }

    // Streak calculation
    let streak = 0;
    const checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);
    const reviewDates = new Set(allReviewLogs.map(r => {
      const d = new Date(r.reviewedAt);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    }));
    while (reviewDates.has(checkDate.getTime())) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayReviews = allReviewLogs.filter(r => new Date(r.reviewedAt) >= today).length;

    // ── BATCH EXAM ANALYTICS ──
    const batchExamStats = {
      totalExams: allBatchExams.length,
      avgScore: allBatchExams.length > 0
        ? Math.round(allBatchExams.reduce((s, e) => s + (e.score / e.maxScore) * 100, 0) / allBatchExams.length)
        : 0,
      avgVocabAccuracy: (() => {
        const valid = allBatchExams.filter(e => e.vocabAccuracy != null);
        return valid.length > 0 ? Math.round(valid.reduce((s, e) => s + (e.vocabAccuracy ?? 0), 0) / valid.length) : null;
      })(),
      avgGenderAccuracy: (() => {
        const valid = allBatchExams.filter(e => e.genderAccuracy != null);
        return valid.length > 0 ? Math.round(valid.reduce((s, e) => s + (e.genderAccuracy ?? 0), 0) / valid.length) : null;
      })(),
      avgVerbAccuracy: (() => {
        const valid = allBatchExams.filter(e => e.verbAccuracy != null);
        return valid.length > 0 ? Math.round(valid.reduce((s, e) => s + (e.verbAccuracy ?? 0), 0) / valid.length) : null;
      })(),
      recentExams: allBatchExams.slice(0, 10).map(e => ({
        id: e.id,
        batchId: e.batchId,
        score: Math.round((e.score / e.maxScore) * 100),
        vocabAccuracy: e.vocabAccuracy,
        genderAccuracy: e.genderAccuracy,
        verbAccuracy: e.verbAccuracy,
        timeSpent: e.timeSpent,
        date: e.completedAt.toISOString(),
      })),
    };

    // ── GOETHE EXAM ANALYTICS ──
    const examStats = {
      totalAttempts: completedExams.length,
      avgScore: completedExams.length > 0
        ? Math.round(completedExams.reduce((s, e) => s + ((e.totalScore ?? 0) / (e.maxScore ?? 100)) * 100, 0) / completedExams.length)
        : 0,
      byLevel: {} as Record<string, { attempts: number; avgScore: number; best: number }>,
      recentExams: completedExams.slice(0, 5).map(e => ({
        id: e.id,
        level: e.cefrLevel,
        score: Math.round(((e.totalScore ?? 0) / (e.maxScore ?? 100)) * 100),
        date: e.completedAt?.toISOString() ?? '',
      })),
    };
    for (const e of completedExams) {
      const pct = Math.round(((e.totalScore ?? 0) / (e.maxScore ?? 100)) * 100);
      if (!examStats.byLevel[e.cefrLevel]) {
        examStats.byLevel[e.cefrLevel] = { attempts: 0, avgScore: 0, best: 0 };
      }
      examStats.byLevel[e.cefrLevel].attempts++;
      examStats.byLevel[e.cefrLevel].avgScore += pct;
      if (pct > examStats.byLevel[e.cefrLevel].best) examStats.byLevel[e.cefrLevel].best = pct;
    }
    for (const level of Object.keys(examStats.byLevel)) {
      examStats.byLevel[level].avgScore = Math.round(examStats.byLevel[level].avgScore / examStats.byLevel[level].attempts);
    }

    // ── GRAMMAR ANALYTICS ──
    const completedTopicIds = new Set(allGrammarAttempts.filter(a => a.score / a.maxScore >= 0.6).map(a => a.topicId));
    const grammarStats = {
      totalTopics: allGrammarTopics.length,
      completed: completedTopicIds.size,
      completion: allGrammarTopics.length > 0 ? Math.round((completedTopicIds.size / allGrammarTopics.length) * 100) : 0,
      totalAttempts: allGrammarAttempts.length,
      avgScore: allGrammarAttempts.length > 0
        ? Math.round(allGrammarAttempts.reduce((s, a) => s + (a.score / a.maxScore) * 100, 0) / allGrammarAttempts.length)
        : 0,
    };

    // ── LISTENING ANALYTICS ──
    const completedListening = allListening.filter(l => l.score != null);
    const listeningStats = {
      totalAttempts: allListening.length,
      completed: completedListening.length,
      avgScore: completedListening.length > 0
        ? Math.round(completedListening.reduce((s, l) => s + ((l.score ?? 0) / (l.maxScore ?? 1)) * 100, 0) / completedListening.length)
        : 0,
      byLevel: {} as Record<string, { attempts: number; avgScore: number }>,
    };
    for (const l of completedListening) {
      const pct = Math.round(((l.score ?? 0) / (l.maxScore ?? 1)) * 100);
      if (!listeningStats.byLevel[l.cefrLevel]) listeningStats.byLevel[l.cefrLevel] = { attempts: 0, avgScore: 0 };
      listeningStats.byLevel[l.cefrLevel].attempts++;
      listeningStats.byLevel[l.cefrLevel].avgScore += pct;
    }
    for (const level of Object.keys(listeningStats.byLevel)) {
      listeningStats.byLevel[level].avgScore = Math.round(listeningStats.byLevel[level].avgScore / listeningStats.byLevel[level].attempts);
    }

    // ── HARDEST & BEST WORDS ──
    const wordAccuracyMap = new Map<string, { word: string; meaning: string; pos: string; gender: string | null; total: number; correct: number }>();
    for (const r of allReviewLogs) {
      const w = allWords.find(wd => wd.id === r.wordId);
      if (!w) continue;
      if (!wordAccuracyMap.has(r.wordId)) {
        wordAccuracyMap.set(r.wordId, { word: w.word, meaning: w.meaning, pos: w.partOfSpeech, gender: w.gender, total: 0, correct: 0 });
      }
      const entry = wordAccuracyMap.get(r.wordId)!;
      entry.total++;
      if (r.correct) entry.correct++;
    }
    const wordAccuracies = Array.from(wordAccuracyMap.values())
      .filter(w => w.total >= 2)
      .map(w => ({ ...w, accuracy: Math.round((w.correct / w.total) * 100) }));
    const hardestWords = wordAccuracies.sort((a, b) => a.accuracy - b.accuracy).slice(0, 8);
    const bestWords = wordAccuracies.sort((a, b) => b.accuracy - a.accuracy).slice(0, 8);

    // ── VERBS ANALYTICS ──
    const verbStats = {
      total: verbs.length,
      regular: verbs.filter(w => w.verbType === 'regular').length,
      irregular: verbs.filter(w => w.verbType === 'irregular').length,
      mixed: verbs.filter(w => w.verbType === 'mixed').length,
      haben: verbs.filter(w => w.auxiliaryType === 'haben').length,
      sein: verbs.filter(w => w.auxiliaryType === 'sein').length,
    };

    // ── MEMORY & XP ──
    const avgStability = allWords.length > 0
      ? Math.round(allWords.reduce((s, w) => s + w.stability, 0) / allWords.length * 10) / 10
      : 0;

    const xp = user?.xp ?? 0;
    const level = Math.floor(xp / 100) + 1;

    // ── WEEKLY TREND (last 4 weeks) ──
    const weeklyTrend: { week: string; reviews: number; accuracy: number }[] = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7 + 6));
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      const weekLogs = allReviewLogs.filter(r => {
        const d = new Date(r.reviewedAt);
        return d >= weekStart && d < weekEnd;
      });
      const weekCorrect = weekLogs.filter(r => r.correct).length;
      weeklyTrend.push({
        week: `W${4 - i}`,
        reviews: weekLogs.length,
        accuracy: weekLogs.length > 0 ? Math.round((weekCorrect / weekLogs.length) * 100) : 0,
      });
    }

    return NextResponse.json({
      vocabulary: {
        totalWords,
        learnedWords,
        masteredWords,
        dueWords,
        remainingWords: totalWords - masteredWords,
        byPOS,
        byCEFR,
        byState,
        nouns: nouns.length,
        verbs: verbs.length,
        adjectives: adjectives.length,
        others: others.length,
      },
      gender: {
        distribution: genderDist,
        totalReviews: genderReviews.length,
        accuracy: genderAccuracy,
        accuracyByType: genderAccuracyByType,
      },
      wordsPractice: {
        totalReviews: allReviewLogs.length,
        todayReviews,
        streak,
        meaningAccuracy,
        conjugationAccuracy,
        sentenceReviews: sentenceReviews.length,
        modeBreakdown,
        dailyActivity,
        weeklyTrend,
      },
      batchExams: batchExamStats,
      goetheExams: examStats,
      grammar: grammarStats,
      listening: listeningStats,
      conversations: allConversations.length,
      hardestWords,
      bestWords,
      verbStats,
      memory: { avgStability },
      xp: { total: xp, level },
      batches: {
        total: allBatches.length,
        totalWords: allBatches.reduce((s, b) => s + b.wordCount, 0),
        learnedWords: allBatches.reduce((s, b) => s + b.learnedCount, 0),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
