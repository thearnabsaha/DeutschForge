'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Calendar,
  TrendingUp,
  Brain,
  Loader2,
  BookOpen,
  Tag,
  Zap,
  GraduationCap,
  Headphones,
  MessageCircle,
  Target,
  Award,
  Flame,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Star,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { GlassCard } from '@/components/ui/glass-card';
import { ProgressRing } from '@/components/ui/progress-ring';

interface AnalyticsData {
  vocabulary: {
    totalWords: number;
    learnedWords: number;
    masteredWords: number;
    dueWords: number;
    remainingWords: number;
    byPOS: Record<string, number>;
    byCEFR: Record<string, number>;
    byState: Record<string, number>;
    nouns: number;
    verbs: number;
    adjectives: number;
    others: number;
  };
  gender: {
    distribution: { masculine: number; feminine: number; neuter: number };
    totalReviews: number;
    accuracy: number;
    accuracyByType: { masculine: number | null; feminine: number | null; neuter: number | null };
  };
  wordsPractice: {
    totalReviews: number;
    todayReviews: number;
    streak: number;
    meaningAccuracy: number;
    conjugationAccuracy: number;
    sentenceReviews: number;
    modeBreakdown: Record<string, { total: number; correct: number; accuracy: number }>;
    dailyActivity: { date: string; count: number; correct: number }[];
    weeklyTrend: { week: string; reviews: number; accuracy: number }[];
  };
  batchExams: {
    totalExams: number;
    avgScore: number;
    avgVocabAccuracy: number | null;
    avgGenderAccuracy: number | null;
    avgVerbAccuracy: number | null;
    recentExams: { id: string; batchId: string; score: number; date: string }[];
  };
  goetheExams: {
    totalAttempts: number;
    avgScore: number;
    byLevel: Record<string, { attempts: number; avgScore: number; best: number }>;
    recentExams: { id: string; level: string; score: number; date: string }[];
  };
  grammar: {
    totalTopics: number;
    completed: number;
    completion: number;
    totalAttempts: number;
    avgScore: number;
  };
  listening: {
    totalAttempts: number;
    completed: number;
    avgScore: number;
    byLevel: Record<string, { attempts: number; avgScore: number }>;
  };
  conversations: number;
  hardestWords: { word: string; meaning: string; pos: string; gender: string | null; total: number; correct: number; accuracy: number }[];
  bestWords: { word: string; meaning: string; pos: string; gender: string | null; total: number; correct: number; accuracy: number }[];
  verbStats: {
    total: number;
    regular: number;
    irregular: number;
    mixed: number;
    haben: number;
    sein: number;
  };
  memory: { avgStability: number };
  xp: { total: number; level: number };
  batches: { total: number; totalWords: number; learnedWords: number };
}

type TabId = 'overview' | 'gender' | 'words' | 'exams' | 'grammar' | 'listening';

const TABS: { id: TabId; label: string; icon: typeof Brain }[] = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'gender', label: 'Gender', icon: Tag },
  { id: 'words', label: 'Words', icon: BookOpen },
  { id: 'exams', label: 'Exams', icon: GraduationCap },
  { id: 'grammar', label: 'Grammar', icon: Brain },
  { id: 'listening', label: 'Listening', icon: Headphones },
];

const modeLabels: Record<string, string> = {
  flashcard: 'Flashcard',
  meaning: 'Meaning',
  gender: 'Gender',
  conjugation: 'Conjugation',
  sentence: 'Sentence',
};

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = 'text-[var(--accent)]',
  bgColor = 'bg-[var(--accent)]/10',
  delay = 0,
}: {
  icon: typeof Brain;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  bgColor?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="h-full"
    >
      <GlassCard hover={false} className="flex h-full items-center gap-3 p-3.5 sm:gap-4 sm:p-5">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${bgColor}`}>
          <Icon size={18} className={`sm:size-5 ${color}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-black tracking-tight tabular-nums sm:text-2xl">{value}</p>
          <p className="truncate text-[11px] font-medium text-[var(--text-tertiary)] sm:text-xs">{label}</p>
          {sub && <p className="mt-0.5 truncate text-[10px] text-[var(--text-secondary)]">{sub}</p>}
        </div>
      </GlassCard>
    </motion.div>
  );
}

function AccuracyBar({ label, value, color }: { label: string; value: number | null; color: string }) {
  if (value === null) return null;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="truncate text-[var(--text-secondary)]">{label}</span>
        <span className="font-bold tabular-nums">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(value, 100)}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function MiniBarChart({
  data,
  maxHeight = 110,
}: {
  data: { label: string; value: number; correct?: number }[];
  maxHeight?: number;
}) {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex w-full items-end gap-1 overflow-x-auto py-1 scrollbar-none" style={{ height: maxHeight }}>
      {data.map((d, i) => {
        const height = (d.value / maxVal) * 100;
        const correctPct = d.correct != null && d.value > 0 ? (d.correct / d.value) * 100 : 100;
        return (
          <div key={i} className="group relative flex min-w-[14px] flex-1 flex-col items-center gap-1">
            <span className="text-[8px] tabular-nums text-[var(--text-tertiary)] opacity-0 transition-opacity group-hover:opacity-100">
              {d.value}
            </span>
            <div
              className="relative w-full overflow-hidden rounded-t-sm bg-[var(--accent)]/20 transition-all sm:rounded-t-md"
              style={{ height: `${Math.max(height, 6)}%`, minHeight: 6 }}
            >
              <div
                className="absolute bottom-0 left-0 w-full rounded-t-sm bg-[var(--accent)] transition-all sm:rounded-t-md"
                style={{ height: `${correctPct}%` }}
              />
            </div>
            <span className="text-[7px] font-medium text-[var(--text-tertiary)] sm:text-[8px]">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function WordRow({ word, showAccuracy = true }: {
  word: { word: string; meaning: string; pos: string; gender: string | null; total: number; correct: number; accuracy: number };
  showAccuracy?: boolean;
}) {
  const genderBg = word.gender === 'masculine'
    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    : word.gender === 'feminine'
      ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
      : word.gender === 'neuter'
        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
        : '';

  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-[var(--bg-tertiary)]/60 px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5">
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-bold sm:text-sm">{word.word}</p>
        <p className="truncate text-[11px] text-[var(--text-tertiary)]">{word.meaning}</p>
      </div>
      {word.gender && (
        <span className={`shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-bold ${genderBg}`}>
          {word.gender === 'masculine' ? 'der' : word.gender === 'feminine' ? 'die' : 'das'}
        </span>
      )}
      {showAccuracy && (
        <div className="flex shrink-0 items-center gap-1.5 text-right">
          <div className="h-5 w-5 sm:h-6 sm:w-6">
            <svg viewBox="0 0 36 36" className="-rotate-90">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="var(--border)"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={word.accuracy >= 70 ? 'var(--success)' : word.accuracy >= 40 ? 'var(--warning)' : 'var(--danger)'}
                strokeWidth="3"
                strokeDasharray={`${word.accuracy}, 100`}
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-xs font-bold tabular-nums">{word.accuracy}%</span>
        </div>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [showAllHard, setShowAllHard] = useState(false);
  const [showAllBest, setShowAllBest] = useState(false);

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.json())
      .then(d => { if (!d.error) setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <AlertTriangle size={40} className="text-[var(--warning)]" />
        <p className="text-[var(--text-secondary)]">Unable to load analytics. Please log in first.</p>
      </div>
    );
  }

  const masteryPct = data.vocabulary.totalWords > 0
    ? Math.round((data.vocabulary.masteredWords / data.vocabulary.totalWords) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-6xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
      <PageHeader title="Analytics" subtitle="Comprehensive learning insights" />

      {/* Tab Navigation */}
      <div className="mt-4 flex gap-1.5 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-1.5 scrollbar-none sm:mt-6">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all sm:gap-2 sm:px-4 sm:text-sm ${
                isActive
                  ? 'bg-[var(--accent)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 sm:mt-8">
        <AnimatePresence mode="wait">
          {/* ═══════════ OVERVIEW TAB ═══════════ */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial="hidden" animate="visible" exit="hidden" variants={{ visible: { transition: { staggerChildren: 0.04 } } }} className="space-y-4 sm:space-y-6">
              {/* Hero Stats Bento - 2x2 on mobile, 4x1 on desktop */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
                <StatCard icon={BookOpen} label="Total Words" value={data.vocabulary.totalWords} sub={`${data.vocabulary.dueWords} due review`} delay={0} />
                <StatCard icon={Flame} label="Day Streak" value={data.wordsPractice.streak} sub={`${data.wordsPractice.todayReviews} today`} color="text-orange-500" bgColor="bg-orange-500/10" delay={0.04} />
                <StatCard icon={TrendingUp} label="Total Reviews" value={data.wordsPractice.totalReviews} sub={`${data.wordsPractice.meaningAccuracy}% accuracy`} color="text-emerald-500" bgColor="bg-emerald-500/10" delay={0.08} />
                <StatCard icon={Award} label="Level" value={data.xp.level} sub={`${data.xp.total} XP earned`} color="text-purple-500" bgColor="bg-purple-500/10" delay={0.12} />
              </div>

              {/* Mastery Ring + 30-Day Activity Chart Bento */}
              <div className="grid grid-cols-1 gap-3 sm:gap-6 lg:grid-cols-3">
                {/* Mastery Card */}
                <motion.div variants={fadeIn} className="h-full">
                  <GlassCard hover={false} className="flex h-full flex-col justify-between p-4 sm:p-6">
                    <div className="flex flex-col items-center">
                      <ProgressRing progress={masteryPct} label={`${masteryPct}%`} sublabel="Mastery" />
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-[var(--bg-tertiary)]/50 p-2.5">
                      {[
                        { label: 'New', count: data.vocabulary.byState.new, color: 'bg-gray-400' },
                        { label: 'Learning', count: data.vocabulary.byState.learning, color: 'bg-amber-400' },
                        { label: 'Review', count: data.vocabulary.byState.review, color: 'bg-emerald-400' },
                        { label: 'Relearning', count: data.vocabulary.byState.relearning, color: 'bg-red-400' },
                      ].map(s => (
                        <div key={s.label} className="flex items-center gap-1.5 text-[11px]">
                          <div className={`h-2 w-2 shrink-0 rounded-full ${s.color}`} />
                          <span className="truncate text-[var(--text-secondary)] font-medium">{s.label}: <b>{s.count}</b></span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 border-t border-[var(--border)] pt-3 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">Mastered Words</span>
                        <span className="font-bold tabular-nums">{data.vocabulary.masteredWords}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">Remaining Words</span>
                        <span className="font-bold tabular-nums">{data.vocabulary.remainingWords}</span>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>

                {/* 30-Day Activity Chart */}
                <motion.div variants={fadeIn} className="h-full lg:col-span-2">
                  <GlassCard hover={false} className="flex h-full flex-col justify-between p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-[var(--accent)]" />
                        <h2 className="text-sm font-bold sm:text-base">Review Activity</h2>
                      </div>
                      <span className="rounded-lg bg-[var(--bg-tertiary)] px-2 py-0.5 text-[10px] font-bold text-[var(--text-tertiary)]">
                        Recent Days
                      </span>
                    </div>

                    <div className="my-3 flex-1">
                      <MiniBarChart
                        data={data.wordsPractice.dailyActivity.slice(-18).map(d => ({
                          label: new Date(d.date).toLocaleDateString('en', { day: '2-digit' }),
                          value: d.count,
                          correct: d.correct,
                        }))}
                        maxHeight={110}
                      />
                    </div>

                    <div className="flex items-center justify-between border-t border-[var(--border)] pt-2 text-[10px] text-[var(--text-tertiary)]">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm bg-[var(--accent)]" /> Correct</span>
                        <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm bg-[var(--accent)]/20" /> Incorrect</span>
                      </div>
                      <span>Hover / tap bar for count</span>
                    </div>
                  </GlassCard>
                </motion.div>
              </div>

              {/* Vocabulary Breakdown Bento */}
              <motion.div variants={fadeIn}>
                <GlassCard hover={false} className="p-4 sm:p-6">
                  <h2 className="text-sm font-bold sm:text-base">Vocabulary Breakdown</h2>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">By Part of Speech</h3>
                      <div className="space-y-2">
                        {Object.entries(data.vocabulary.byPOS).sort(([,a],[,b]) => b - a).map(([pos, cnt]) => (
                          <div key={pos} className="flex items-center gap-2 text-xs">
                            <span className="w-20 truncate text-[var(--text-secondary)] font-medium capitalize">{pos}</span>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                              <motion.div
                                className="h-full rounded-full bg-[var(--accent)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${(cnt / (data.vocabulary.totalWords || 1)) * 100}%` }}
                                transition={{ duration: 0.6 }}
                              />
                            </div>
                            <span className="w-8 text-right font-bold tabular-nums">{cnt}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">By CEFR Level</h3>
                      <div className="space-y-2">
                        {['A1', 'A2', 'B1', 'B2'].map(level => {
                          const cnt = data.vocabulary.byCEFR[level] || 0;
                          const colors: Record<string, string> = { A1: 'bg-emerald-500', A2: 'bg-blue-500', B1: 'bg-amber-500', B2: 'bg-purple-500' };
                          return (
                            <div key={level} className="flex items-center gap-2 text-xs">
                              <span className="w-20 font-bold">{level}</span>
                              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                                <motion.div
                                  className={`h-full rounded-full ${colors[level]}`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${data.vocabulary.totalWords > 0 ? (cnt / data.vocabulary.totalWords) * 100 : 0}%` }}
                                  transition={{ duration: 0.6 }}
                                />
                              </div>
                              <span className="w-8 text-right font-bold tabular-nums">{cnt}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Weekly Trend & Practice Modes Bento */}
              <div className="grid grid-cols-1 gap-3 sm:gap-6 md:grid-cols-2">
                <motion.div variants={fadeIn} className="h-full">
                  <GlassCard hover={false} className="flex h-full flex-col justify-between p-4 sm:p-6">
                    <h2 className="text-sm font-bold sm:text-base">Weekly Trend</h2>
                    <div className="mt-3 space-y-2.5 flex-1">
                      {data.wordsPractice.weeklyTrend.map(w => (
                        <div key={w.week} className="flex items-center gap-2.5 text-xs">
                          <span className="w-10 font-bold text-[var(--text-secondary)]">{w.week}</span>
                          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                            <motion.div
                              className="h-full rounded-full bg-[var(--accent)]"
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(w.accuracy, 100)}%` }}
                              transition={{ duration: 0.6 }}
                            />
                          </div>
                          <div className="text-right">
                            <span className="font-bold tabular-nums">{w.accuracy}%</span>
                            <span className="ml-1 text-[10px] text-[var(--text-tertiary)]">({w.reviews})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>

                <motion.div variants={fadeIn} className="h-full">
                  <GlassCard hover={false} className="flex h-full flex-col justify-between p-4 sm:p-6">
                    <h2 className="text-sm font-bold sm:text-base">Practice Modes</h2>
                    <div className="mt-3 space-y-2 flex-1">
                      {Object.entries(data.wordsPractice.modeBreakdown).map(([mode, stats]) => (
                        <div key={mode} className="flex items-center gap-2.5 rounded-xl bg-[var(--bg-tertiary)]/60 px-3 py-2 text-xs">
                          <span className="w-20 truncate font-semibold capitalize">{modeLabels[mode] || mode}</span>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
                            <div
                              className="h-full rounded-full bg-[var(--accent)]"
                              style={{ width: `${stats.accuracy}%` }}
                            />
                          </div>
                          <span className="font-bold tabular-nums">{stats.accuracy}%</span>
                          <span className="text-[10px] text-[var(--text-tertiary)]">({stats.total})</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              </div>

              {/* Bottom Quick Summary Cards - 2x3 on mobile, 3x2 on tablet, 6x1 on desktop */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-3 lg:grid-cols-6">
                <StatCard icon={Tag} label="Gender Accuracy" value={`${data.gender.accuracy}%`} color="text-amber-500" bgColor="bg-amber-500/10" />
                <StatCard icon={Brain} label="Grammar" value={`${data.grammar.completion}%`} sub={`${data.grammar.completed}/${data.grammar.totalTopics}`} color="text-blue-500" bgColor="bg-blue-500/10" />
                <StatCard icon={GraduationCap} label="Goethe Exams" value={data.goetheExams.totalAttempts} sub={data.goetheExams.avgScore > 0 ? `${data.goetheExams.avgScore}% avg` : 'No attempts'} color="text-red-500" bgColor="bg-red-500/10" />
                <StatCard icon={Headphones} label="Listening" value={data.listening.completed} sub={data.listening.avgScore > 0 ? `${data.listening.avgScore}% avg` : 'No attempts'} color="text-teal-500" bgColor="bg-teal-500/10" />
                <StatCard icon={MessageCircle} label="Conversations" value={data.conversations} color="text-indigo-500" bgColor="bg-indigo-500/10" />
                <StatCard icon={Target} label="Batches" value={data.batches.total} sub={`${data.batches.learnedWords}/${data.batches.totalWords} words`} color="text-pink-500" bgColor="bg-pink-500/10" />
              </div>
            </motion.div>
          )}

          {/* ═══════════ GENDER TAB ═══════════ */}
          {activeTab === 'gender' && (
            <motion.div key="gender" initial="hidden" animate="visible" exit="hidden" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-3">
                <StatCard icon={Tag} label="Total Reviews" value={data.gender.totalReviews} color="text-amber-500" bgColor="bg-amber-500/10" />
                <StatCard icon={CheckCircle2} label="Accuracy" value={`${data.gender.accuracy}%`} color="text-emerald-500" bgColor="bg-emerald-500/10" />
                <div className="col-span-2 sm:col-span-1">
                  <StatCard icon={BookOpen} label="Total Nouns" value={data.vocabulary.nouns} sub="In vocabulary" color="text-blue-500" bgColor="bg-blue-500/10" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:gap-6 lg:grid-cols-2">
                <motion.div variants={fadeIn} className="h-full">
                  <GlassCard hover={false} className="flex h-full flex-col justify-between p-4 sm:p-6">
                    <div>
                      <h2 className="text-sm font-bold sm:text-base">Gender Distribution</h2>
                      <p className="text-[11px] text-[var(--text-tertiary)] sm:text-xs">How your nouns split across genders</p>
                    </div>
                    <div className="my-6 flex items-center justify-around gap-2">
                      {[
                        { label: 'der', sublabel: 'Masc', count: data.gender.distribution.masculine, color: 'text-blue-500', ring: 'stroke-blue-500' },
                        { label: 'die', sublabel: 'Fem', count: data.gender.distribution.feminine, color: 'text-pink-500', ring: 'stroke-pink-500' },
                        { label: 'das', sublabel: 'Neut', count: data.gender.distribution.neuter, color: 'text-emerald-500', ring: 'stroke-emerald-500' },
                      ].map(g => {
                        const total = data.vocabulary.nouns || 1;
                        const pct = Math.round((g.count / total) * 100);
                        return (
                          <div key={g.label} className="flex flex-col items-center">
                            <div className="relative">
                              <svg width={72} height={72} className="-rotate-90 sm:h-20 sm:w-20">
                                <circle cx={36} cy={36} r={30} fill="none" stroke="var(--border)" strokeWidth={5} />
                                <motion.circle
                                  cx={36} cy={36} r={30} fill="none" className={g.ring} strokeWidth={5} strokeLinecap="round"
                                  strokeDasharray={`${2 * Math.PI * 30}`}
                                  initial={{ strokeDashoffset: 2 * Math.PI * 30 }}
                                  animate={{ strokeDashoffset: 2 * Math.PI * 30 * (1 - pct / 100) }}
                                  transition={{ duration: 1 }}
                                />
                              </svg>
                              <span className={`absolute inset-0 flex items-center justify-center text-base font-black ${g.color}`}>{pct}%</span>
                            </div>
                            <span className={`mt-2 text-sm font-bold ${g.color}`}>{g.label}</span>
                            <span className="text-[10px] text-[var(--text-tertiary)]">{g.count} nouns</span>
                          </div>
                        );
                      })}
                    </div>
                  </GlassCard>
                </motion.div>

                <motion.div variants={fadeIn} className="h-full">
                  <GlassCard hover={false} className="flex h-full flex-col justify-between p-4 sm:p-6">
                    <div>
                      <h2 className="text-sm font-bold sm:text-base">Accuracy by Gender</h2>
                      <p className="text-[11px] text-[var(--text-tertiary)] sm:text-xs">How well you recall each gender</p>
                    </div>
                    <div className="my-4 space-y-3.5">
                      <AccuracyBar label="der (Masculine)" value={data.gender.accuracyByType.masculine} color="bg-blue-500" />
                      <AccuracyBar label="die (Feminine)" value={data.gender.accuracyByType.feminine} color="bg-pink-500" />
                      <AccuracyBar label="das (Neuter)" value={data.gender.accuracyByType.neuter} color="bg-emerald-500" />
                      {data.gender.totalReviews === 0 && (
                        <p className="py-4 text-center text-xs text-[var(--text-tertiary)]">
                          No gender practice sessions yet. Start a Gender Test to see accuracy here.
                        </p>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ═══════════ WORDS TAB ═══════════ */}
          {activeTab === 'words' && (
            <motion.div key="words" initial="hidden" animate="visible" exit="hidden" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
                <StatCard icon={BookOpen} label="Total Words" value={data.vocabulary.totalWords} />
                <StatCard icon={CheckCircle2} label="Learned" value={data.vocabulary.learnedWords} color="text-emerald-500" bgColor="bg-emerald-500/10" />
                <StatCard icon={Star} label="Mastered" value={data.vocabulary.masteredWords} color="text-amber-500" bgColor="bg-amber-500/10" />
                <StatCard icon={Clock} label="Due for Review" value={data.vocabulary.dueWords} color="text-red-500" bgColor="bg-red-500/10" />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:gap-6 lg:grid-cols-2">
                <motion.div variants={fadeIn} className="h-full">
                  <GlassCard hover={false} className="flex h-full flex-col justify-between p-4 sm:p-6">
                    <h2 className="text-sm font-bold sm:text-base">Verb Analysis</h2>
                    <div className="mt-3 space-y-2.5">
                      <div className="flex items-center justify-between rounded-xl bg-[var(--bg-tertiary)]/60 px-3 py-2 text-xs">
                        <span className="font-semibold">Total Verbs</span>
                        <span className="font-bold">{data.verbStats.total}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: 'Regular', value: data.verbStats.regular, color: 'bg-emerald-500/10 text-emerald-600' },
                          { label: 'Irregular', value: data.verbStats.irregular, color: 'bg-red-500/10 text-red-600' },
                          { label: 'Mixed', value: data.verbStats.mixed, color: 'bg-amber-500/10 text-amber-600' },
                        ].map(v => (
                          <div key={v.label} className={`rounded-xl p-2.5 text-center ${v.color}`}>
                            <p className="text-lg font-black">{v.value}</p>
                            <p className="text-[10px] font-semibold">{v.label}</p>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-xl bg-blue-500/10 p-2.5 text-center text-blue-600">
                          <p className="text-lg font-black">{data.verbStats.haben}</p>
                          <p className="text-[10px] font-semibold">haben</p>
                        </div>
                        <div className="rounded-xl bg-purple-500/10 p-2.5 text-center text-purple-600">
                          <p className="text-lg font-black">{data.verbStats.sein}</p>
                          <p className="text-[10px] font-semibold">sein</p>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>

                <motion.div variants={fadeIn} className="h-full">
                  <GlassCard hover={false} className="flex h-full flex-col justify-between p-4 sm:p-6">
                    <h2 className="text-sm font-bold sm:text-base">Accuracy Breakdown</h2>
                    <div className="my-3 space-y-3">
                      <AccuracyBar label="Meaning / Flashcard" value={data.wordsPractice.meaningAccuracy} color="bg-blue-500" />
                      <AccuracyBar label="Gender Accuracy" value={data.gender.accuracy} color="bg-amber-500" />
                      <AccuracyBar label="Conjugation" value={data.wordsPractice.conjugationAccuracy} color="bg-purple-500" />
                    </div>
                    <div className="border-t border-[var(--border)] pt-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">Sentence Practices</span>
                        <span className="font-bold">{data.wordsPractice.sentenceReviews}</span>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              </div>

              {/* Hardest + Best Words */}
              <div className="grid grid-cols-1 gap-3 sm:gap-6 lg:grid-cols-2">
                <motion.div variants={fadeIn} className="h-full">
                  <GlassCard hover={false} className="flex h-full flex-col p-4 sm:p-6">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} className="text-[var(--danger)]" />
                      <h2 className="text-sm font-bold sm:text-base">Hardest Words</h2>
                    </div>
                    <p className="text-[11px] text-[var(--text-tertiary)]">Words you struggle with the most</p>
                    <div className="mt-3 space-y-2">
                      {data.hardestWords.length === 0 && (
                        <p className="py-4 text-center text-xs text-[var(--text-tertiary)]">Practice more to see your hardest words</p>
                      )}
                      {(showAllHard ? data.hardestWords : data.hardestWords.slice(0, 4)).map((w, i) => (
                        <WordRow key={i} word={w} />
                      ))}
                      {data.hardestWords.length > 4 && (
                        <button
                          onClick={() => setShowAllHard(!showAllHard)}
                          className="flex w-full items-center justify-center gap-1 pt-1 text-xs font-semibold text-[var(--accent)]"
                        >
                          {showAllHard ? <><ChevronUp size={14} /> Show Less</> : <><ChevronDown size={14} /> Show All ({data.hardestWords.length})</>}
                        </button>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>

                <motion.div variants={fadeIn} className="h-full">
                  <GlassCard hover={false} className="flex h-full flex-col p-4 sm:p-6">
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-amber-500" />
                      <h2 className="text-sm font-bold sm:text-base">Best Words</h2>
                    </div>
                    <p className="text-[11px] text-[var(--text-tertiary)]">Words you know best</p>
                    <div className="mt-3 space-y-2">
                      {data.bestWords.length === 0 && (
                        <p className="py-4 text-center text-xs text-[var(--text-tertiary)]">Practice more to see your best words</p>
                      )}
                      {(showAllBest ? data.bestWords : data.bestWords.slice(0, 4)).map((w, i) => (
                        <WordRow key={i} word={w} />
                      ))}
                      {data.bestWords.length > 4 && (
                        <button
                          onClick={() => setShowAllBest(!showAllBest)}
                          className="flex w-full items-center justify-center gap-1 pt-1 text-xs font-semibold text-[var(--accent)]"
                        >
                          {showAllBest ? <><ChevronUp size={14} /> Show Less</> : <><ChevronDown size={14} /> Show All ({data.bestWords.length})</>}
                        </button>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ═══════════ EXAMS TAB ═══════════ */}
          {activeTab === 'exams' && (
            <motion.div key="exams" initial="hidden" animate="visible" exit="hidden" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
                <StatCard icon={GraduationCap} label="Goethe Exams" value={data.goetheExams.totalAttempts} color="text-red-500" bgColor="bg-red-500/10" />
                <StatCard icon={TrendingUp} label="Avg Score" value={data.goetheExams.avgScore > 0 ? `${data.goetheExams.avgScore}%` : '—'} color="text-emerald-500" bgColor="bg-emerald-500/10" />
                <StatCard icon={Target} label="Batch Exams" value={data.batchExams.totalExams} color="text-blue-500" bgColor="bg-blue-500/10" />
                <StatCard icon={Award} label="Avg Batch" value={data.batchExams.avgScore > 0 ? `${data.batchExams.avgScore}%` : '—'} color="text-purple-500" bgColor="bg-purple-500/10" />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:gap-6 lg:grid-cols-2">
                <motion.div variants={fadeIn} className="h-full">
                  <GlassCard hover={false} className="flex h-full flex-col p-4 sm:p-6">
                    <h2 className="text-sm font-bold sm:text-base">Goethe Exam by Level</h2>
                    <div className="mt-3 space-y-2.5">
                      {Object.keys(data.goetheExams.byLevel).length === 0 && (
                        <p className="py-4 text-center text-xs text-[var(--text-tertiary)]">No Goethe exams completed yet</p>
                      )}
                      {Object.entries(data.goetheExams.byLevel).map(([level, stats]) => (
                        <div key={level} className="rounded-xl bg-[var(--bg-tertiary)]/60 p-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold">{level}</span>
                            <span className="text-[var(--text-tertiary)]">{stats.attempts} attempt{stats.attempts !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="mt-2 flex items-center gap-3">
                            <div className="flex-1">
                              <AccuracyBar label="Average" value={stats.avgScore} color="bg-[var(--accent)]" />
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-[var(--text-tertiary)]">Best</p>
                              <p className="text-base font-black text-[var(--success)]">{stats.best}%</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>

                <motion.div variants={fadeIn} className="h-full">
                  <GlassCard hover={false} className="flex h-full flex-col p-4 sm:p-6">
                    <h2 className="text-sm font-bold sm:text-base">Batch Exam Breakdown</h2>
                    <div className="mt-3 space-y-3.5">
                      <AccuracyBar label="Vocabulary Accuracy" value={data.batchExams.avgVocabAccuracy} color="bg-blue-500" />
                      <AccuracyBar label="Gender Accuracy" value={data.batchExams.avgGenderAccuracy} color="bg-amber-500" />
                      <AccuracyBar label="Verb Accuracy" value={data.batchExams.avgVerbAccuracy} color="bg-purple-500" />
                      {data.batchExams.totalExams === 0 && (
                        <p className="py-4 text-center text-xs text-[var(--text-tertiary)]">No batch exams completed yet</p>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              </div>

              {/* Recent exams */}
              {data.goetheExams.recentExams.length > 0 && (
                <motion.div variants={fadeIn}>
                  <GlassCard hover={false} className="p-4 sm:p-6">
                    <h2 className="text-sm font-bold sm:text-base">Recent Goethe Exams</h2>
                    <div className="mt-3 space-y-2">
                      {data.goetheExams.recentExams.map(e => (
                        <div key={e.id} className="flex items-center gap-3 rounded-xl bg-[var(--bg-tertiary)]/60 px-3 py-2 text-xs sm:px-4 sm:py-2.5">
                          <span className="w-10 font-bold">{e.level}</span>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
                            <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${e.score}%` }} />
                          </div>
                          <span className="font-bold tabular-nums">{e.score}%</span>
                          <span className="text-[10px] text-[var(--text-tertiary)]">
                            {new Date(e.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ═══════════ GRAMMAR TAB ═══════════ */}
          {activeTab === 'grammar' && (
            <motion.div key="grammar" initial="hidden" animate="visible" exit="hidden" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
                <StatCard icon={Brain} label="Topics" value={data.grammar.totalTopics} />
                <StatCard icon={CheckCircle2} label="Completed" value={data.grammar.completed} color="text-emerald-500" bgColor="bg-emerald-500/10" />
                <StatCard icon={Target} label="Completion" value={`${data.grammar.completion}%`} color="text-blue-500" bgColor="bg-blue-500/10" />
                <StatCard icon={TrendingUp} label="Avg Score" value={data.grammar.avgScore > 0 ? `${data.grammar.avgScore}%` : '—'} color="text-purple-500" bgColor="bg-purple-500/10" />
              </div>

              <motion.div variants={fadeIn}>
                <GlassCard hover={false} className="p-4 sm:p-6">
                  <h2 className="text-sm font-bold sm:text-base">Grammar Progress</h2>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-[var(--text-secondary)] font-medium">Topics Completed</span>
                      <span className="font-bold">{data.grammar.completed} / {data.grammar.totalTopics}</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                      <motion.div
                        className="h-full rounded-full bg-[var(--accent)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${data.grammar.completion}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                    <div className="flex items-center justify-between pt-2 text-xs text-[var(--text-tertiary)]">
                      <span>Total Attempts: {data.grammar.totalAttempts}</span>
                      <span>Average Score: {data.grammar.avgScore}%</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>
          )}

          {/* ═══════════ LISTENING TAB ═══════════ */}
          {activeTab === 'listening' && (
            <motion.div key="listening" initial="hidden" animate="visible" exit="hidden" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-3">
                <StatCard icon={Headphones} label="Total Attempts" value={data.listening.totalAttempts} color="text-teal-500" bgColor="bg-teal-500/10" />
                <StatCard icon={CheckCircle2} label="Completed" value={data.listening.completed} color="text-emerald-500" bgColor="bg-emerald-500/10" />
                <div className="col-span-2 sm:col-span-1">
                  <StatCard icon={TrendingUp} label="Avg Score" value={data.listening.avgScore > 0 ? `${data.listening.avgScore}%` : '—'} color="text-purple-500" bgColor="bg-purple-500/10" />
                </div>
              </div>

              <motion.div variants={fadeIn}>
                <GlassCard hover={false} className="p-4 sm:p-6">
                  <h2 className="text-sm font-bold sm:text-base">Listening by Level</h2>
                  <div className="mt-3 space-y-2">
                    {Object.keys(data.listening.byLevel).length === 0 && (
                      <p className="py-4 text-center text-xs text-[var(--text-tertiary)]">No listening practice completed yet</p>
                    )}
                    {Object.entries(data.listening.byLevel).map(([level, stats]) => (
                      <div key={level} className="flex items-center gap-3 rounded-xl bg-[var(--bg-tertiary)]/60 px-3 py-2 text-xs sm:px-4 sm:py-2.5">
                        <span className="w-8 font-bold">{level}</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
                          <div className="h-full rounded-full bg-teal-500" style={{ width: `${stats.avgScore}%` }} />
                        </div>
                        <span className="font-bold tabular-nums">{stats.avgScore}%</span>
                        <span className="text-[10px] text-[var(--text-tertiary)]">{stats.attempts} attempts</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div variants={fadeIn}>
                <GlassCard hover={false} className="p-4 sm:p-6">
                  <h2 className="text-sm font-bold sm:text-base">Conversation Practice</h2>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10">
                      <MessageCircle size={22} className="text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-black">{data.conversations}</p>
                      <p className="text-xs text-[var(--text-tertiary)]">Total conversation sessions</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
