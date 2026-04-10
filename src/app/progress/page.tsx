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
  hidden: { opacity: 0, y: 16 },
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <GlassCard hover={false} className="flex items-center gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bgColor}`}>
          <Icon size={20} className={color} />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold tabular-nums">{value}</p>
          <p className="text-xs text-[var(--text-tertiary)]">{label}</p>
          {sub && <p className="mt-0.5 text-[10px] text-[var(--text-tertiary)]">{sub}</p>}
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
        <span className="text-[var(--text-secondary)]">{label}</span>
        <span className="font-semibold tabular-nums">{value}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function MiniBarChart({
  data,
  maxHeight = 100,
}: {
  data: { label: string; value: number; correct?: number }[];
  maxHeight?: number;
}) {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-1" style={{ height: maxHeight }}>
      {data.map((d, i) => {
        const height = (d.value / maxVal) * 100;
        const correctPct = d.correct != null && d.value > 0 ? (d.correct / d.value) * 100 : 100;
        return (
          <div key={i} className="group relative flex flex-1 flex-col items-center gap-1">
            <span className="text-[8px] tabular-nums text-[var(--text-tertiary)] opacity-0 transition-opacity group-hover:opacity-100">
              {d.value}
            </span>
            <div
              className="relative w-full overflow-hidden rounded-t-md bg-[var(--accent)]/20 transition-all"
              style={{ height: `${Math.max(height, 4)}%`, minHeight: 4 }}
            >
              <div
                className="absolute bottom-0 left-0 w-full rounded-t-md bg-[var(--accent)] transition-all"
                style={{ height: `${correctPct}%` }}
              />
            </div>
            <span className="text-[7px] text-[var(--text-tertiary)]">{d.label}</span>
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
    <div className="flex items-center gap-3 rounded-xl bg-[var(--bg-tertiary)]/60 px-4 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{word.word}</p>
        <p className="truncate text-xs text-[var(--text-tertiary)]">{word.meaning}</p>
      </div>
      {word.gender && (
        <span className={`rounded-lg px-2 py-0.5 text-[10px] font-medium ${genderBg}`}>
          {word.gender === 'masculine' ? 'der' : word.gender === 'feminine' ? 'die' : 'das'}
        </span>
      )}
      {showAccuracy && (
        <div className="flex items-center gap-1.5 text-right">
          <div className="h-6 w-6">
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
          <span className="text-xs font-semibold tabular-nums">{word.accuracy}%</span>
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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title="Analytics" subtitle="Comprehensive learning insights" />

      {/* Tab Navigation */}
      <div className="mt-6 flex gap-1 overflow-x-auto rounded-2xl bg-[var(--bg-secondary)] p-1.5 scrollbar-none border border-[var(--border)]">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[var(--accent)] text-white shadow-md'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          {/* ═══════════ OVERVIEW TAB ═══════════ */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial="hidden" animate="visible" exit="hidden" variants={{ visible: { transition: { staggerChildren: 0.04 } } }}>
              {/* Hero Stats */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={BookOpen} label="Total Words" value={data.vocabulary.totalWords} sub={`${data.vocabulary.dueWords} due for review`} delay={0} />
                <StatCard icon={Flame} label="Day Streak" value={data.wordsPractice.streak} sub={`${data.wordsPractice.todayReviews} reviews today`} color="text-orange-500" bgColor="bg-orange-500/10" delay={0.05} />
                <StatCard icon={TrendingUp} label="Total Reviews" value={data.wordsPractice.totalReviews} sub={`${data.wordsPractice.meaningAccuracy}% meaning accuracy`} color="text-emerald-500" bgColor="bg-emerald-500/10" delay={0.1} />
                <StatCard icon={Award} label="Level" value={data.xp.level} sub={`${data.xp.total} XP earned`} color="text-purple-500" bgColor="bg-purple-500/10" delay={0.15} />
              </div>

              {/* Mastery + Daily Activity */}
              <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <motion.div variants={fadeIn}>
                  <GlassCard hover={false} className="flex flex-col items-center">
                    <ProgressRing progress={masteryPct} label={`${masteryPct}%`} sublabel="Mastery" />
                    <div className="mt-5 grid w-full grid-cols-2 gap-2">
                      {[
                        { label: 'New', count: data.vocabulary.byState.new, color: 'bg-gray-400' },
                        { label: 'Learning', count: data.vocabulary.byState.learning, color: 'bg-amber-400' },
                        { label: 'Review', count: data.vocabulary.byState.review, color: 'bg-emerald-400' },
                        { label: 'Relearning', count: data.vocabulary.byState.relearning, color: 'bg-red-400' },
                      ].map(s => (
                        <div key={s.label} className="flex items-center gap-2 text-xs">
                          <div className={`h-2 w-2 rounded-full ${s.color}`} />
                          <span className="text-[var(--text-secondary)]">{s.label}: {s.count}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 w-full border-t border-[var(--border)] pt-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--text-secondary)]">Mastered</span>
                        <span className="font-semibold">{data.vocabulary.masteredWords}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs">
                        <span className="text-[var(--text-secondary)]">Remaining</span>
                        <span className="font-semibold">{data.vocabulary.remainingWords}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs">
                        <span className="text-[var(--text-secondary)]">Memory Stability</span>
                        <span className="font-semibold">{data.memory.avgStability}</span>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>

                <motion.div variants={fadeIn} className="lg:col-span-2">
                  <GlassCard hover={false}>
                    <div className="flex items-center gap-2">
                      <Calendar size={18} className="text-[var(--accent)]" />
                      <h2 className="text-base font-semibold">Review Activity (30 Days)</h2>
                    </div>
                    <div className="mt-4">
                      <MiniBarChart
                        data={data.wordsPractice.dailyActivity.map(d => ({
                          label: new Date(d.date).toLocaleDateString('en', { day: '2-digit' }),
                          value: d.count,
                          correct: d.correct,
                        }))}
                        maxHeight={120}
                      />
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-[10px] text-[var(--text-tertiary)]">
                      <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm bg-[var(--accent)]" /> Correct</span>
                      <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm bg-[var(--accent)]/20" /> Incorrect</span>
                    </div>
                  </GlassCard>
                </motion.div>
              </div>

              {/* Vocabulary Breakdown */}
              <motion.div variants={fadeIn} className="mt-6">
                <GlassCard hover={false}>
                  <h2 className="text-base font-semibold">Vocabulary Breakdown</h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)]">By Part of Speech</h3>
                      <div className="space-y-2">
                        {Object.entries(data.vocabulary.byPOS).sort(([,a],[,b]) => b - a).map(([pos, cnt]) => (
                          <div key={pos} className="flex items-center gap-3">
                            <span className="w-24 text-xs text-[var(--text-secondary)] capitalize">{pos}</span>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                              <motion.div
                                className="h-full rounded-full bg-[var(--accent)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${(cnt / data.vocabulary.totalWords) * 100}%` }}
                                transition={{ duration: 0.6 }}
                              />
                            </div>
                            <span className="w-8 text-right text-xs font-semibold tabular-nums">{cnt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)]">By CEFR Level</h3>
                      <div className="space-y-2">
                        {['A1', 'A2', 'B1', 'B2'].map(level => {
                          const cnt = data.vocabulary.byCEFR[level] || 0;
                          const colors: Record<string, string> = { A1: 'bg-emerald-400', A2: 'bg-blue-400', B1: 'bg-amber-400', B2: 'bg-purple-400' };
                          return (
                            <div key={level} className="flex items-center gap-3">
                              <span className="w-24 text-xs font-medium">{level}</span>
                              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                                <motion.div
                                  className={`h-full rounded-full ${colors[level]}`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${data.vocabulary.totalWords > 0 ? (cnt / data.vocabulary.totalWords) * 100 : 0}%` }}
                                  transition={{ duration: 0.6 }}
                                />
                              </div>
                              <span className="w-8 text-right text-xs font-semibold tabular-nums">{cnt}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Weekly Trend */}
              <motion.div variants={fadeIn} className="mt-6 grid gap-6 sm:grid-cols-2">
                <GlassCard hover={false}>
                  <h2 className="text-base font-semibold">Weekly Trend</h2>
                  <div className="mt-4 space-y-3">
                    {data.wordsPractice.weeklyTrend.map(w => (
                      <div key={w.week} className="flex items-center gap-3">
                        <span className="w-10 text-xs font-medium text-[var(--text-secondary)]">{w.week}</span>
                        <div className="h-3 flex-1 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-purple-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(w.accuracy, 100)}%` }}
                            transition={{ duration: 0.6 }}
                          />
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold tabular-nums">{w.accuracy}%</span>
                          <span className="ml-2 text-[10px] text-[var(--text-tertiary)]">{w.reviews} reviews</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard hover={false}>
                  <h2 className="text-base font-semibold">Practice Modes</h2>
                  <div className="mt-4 space-y-3">
                    {Object.entries(data.wordsPractice.modeBreakdown).map(([mode, stats]) => (
                      <div key={mode} className="flex items-center gap-3 rounded-xl bg-[var(--bg-tertiary)]/60 px-3 py-2">
                        <span className="w-24 text-xs font-medium capitalize">{modeLabels[mode] || mode}</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
                          <div
                            className="h-full rounded-full bg-[var(--accent)]"
                            style={{ width: `${stats.accuracy}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold tabular-nums">{stats.accuracy}%</span>
                        <span className="text-[10px] text-[var(--text-tertiary)]">({stats.total})</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>

              {/* Quick Summary Cards */}
              <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
                <StatCard icon={Tag} label="Gender Accuracy" value={`${data.gender.accuracy}%`} color="text-amber-500" bgColor="bg-amber-500/10" />
                <StatCard icon={Brain} label="Grammar" value={`${data.grammar.completion}%`} sub={`${data.grammar.completed}/${data.grammar.totalTopics}`} color="text-blue-500" bgColor="bg-blue-500/10" />
                <StatCard icon={GraduationCap} label="Goethe Exams" value={data.goetheExams.totalAttempts} sub={data.goetheExams.avgScore > 0 ? `${data.goetheExams.avgScore}% avg` : 'No attempts'} color="text-red-500" bgColor="bg-red-500/10" />
                <StatCard icon={Headphones} label="Listening" value={data.listening.completed} sub={data.listening.avgScore > 0 ? `${data.listening.avgScore}% avg` : 'No attempts'} color="text-teal-500" bgColor="bg-teal-500/10" />
                <StatCard icon={MessageCircle} label="Conversations" value={data.conversations} color="text-indigo-500" bgColor="bg-indigo-500/10" />
                <StatCard icon={Target} label="Batches" value={data.batches.total} sub={`${data.batches.learnedWords}/${data.batches.totalWords} learned`} color="text-pink-500" bgColor="bg-pink-500/10" />
              </div>
            </motion.div>
          )}

          {/* ═══════════ GENDER TAB ═══════════ */}
          {activeTab === 'gender' && (
            <motion.div key="gender" initial="hidden" animate="visible" exit="hidden" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard icon={Tag} label="Total Gender Reviews" value={data.gender.totalReviews} color="text-amber-500" bgColor="bg-amber-500/10" />
                <StatCard icon={CheckCircle2} label="Overall Accuracy" value={`${data.gender.accuracy}%`} color="text-emerald-500" bgColor="bg-emerald-500/10" />
                <StatCard icon={BookOpen} label="Total Nouns" value={data.vocabulary.nouns} sub="In your vocabulary" color="text-blue-500" bgColor="bg-blue-500/10" />
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <motion.div variants={fadeIn}>
                  <GlassCard hover={false}>
                    <h2 className="text-base font-semibold">Gender Distribution</h2>
                    <p className="text-xs text-[var(--text-tertiary)]">How your nouns split across genders</p>
                    <div className="mt-6 flex items-center justify-center gap-6">
                      {[
                        { label: 'der', sublabel: 'Masculine', count: data.gender.distribution.masculine, color: 'text-blue-500', bg: 'bg-blue-500/10', ring: 'stroke-blue-500' },
                        { label: 'die', sublabel: 'Feminine', count: data.gender.distribution.feminine, color: 'text-pink-500', bg: 'bg-pink-500/10', ring: 'stroke-pink-500' },
                        { label: 'das', sublabel: 'Neuter', count: data.gender.distribution.neuter, color: 'text-emerald-500', bg: 'bg-emerald-500/10', ring: 'stroke-emerald-500' },
                      ].map(g => {
                        const total = data.vocabulary.nouns || 1;
                        const pct = Math.round((g.count / total) * 100);
                        return (
                          <div key={g.label} className="flex flex-col items-center">
                            <div className="relative">
                              <svg width={80} height={80} className="-rotate-90">
                                <circle cx={40} cy={40} r={34} fill="none" stroke="var(--border)" strokeWidth={6} />
                                <motion.circle
                                  cx={40} cy={40} r={34} fill="none" className={g.ring} strokeWidth={6} strokeLinecap="round"
                                  strokeDasharray={`${2 * Math.PI * 34}`}
                                  initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                                  animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - pct / 100) }}
                                  transition={{ duration: 1 }}
                                />
                              </svg>
                              <span className={`absolute inset-0 flex items-center justify-center text-lg font-bold ${g.color}`}>{pct}%</span>
                            </div>
                            <span className={`mt-2 text-sm font-semibold ${g.color}`}>{g.label}</span>
                            <span className="text-[10px] text-[var(--text-tertiary)]">{g.count} nouns</span>
                          </div>
                        );
                      })}
                    </div>
                  </GlassCard>
                </motion.div>

                <motion.div variants={fadeIn}>
                  <GlassCard hover={false}>
                    <h2 className="text-base font-semibold">Accuracy by Gender</h2>
                    <p className="text-xs text-[var(--text-tertiary)]">How well you recall each gender</p>
                    <div className="mt-6 space-y-4">
                      <AccuracyBar label="der (Masculine)" value={data.gender.accuracyByType.masculine} color="bg-blue-500" />
                      <AccuracyBar label="die (Feminine)" value={data.gender.accuracyByType.feminine} color="bg-pink-500" />
                      <AccuracyBar label="das (Neuter)" value={data.gender.accuracyByType.neuter} color="bg-emerald-500" />
                      {data.gender.totalReviews === 0 && (
                        <p className="py-4 text-center text-sm text-[var(--text-tertiary)]">
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
            <motion.div key="words" initial="hidden" animate="visible" exit="hidden" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={BookOpen} label="Total Words" value={data.vocabulary.totalWords} />
                <StatCard icon={CheckCircle2} label="Learned" value={data.vocabulary.learnedWords} color="text-emerald-500" bgColor="bg-emerald-500/10" />
                <StatCard icon={Star} label="Mastered" value={data.vocabulary.masteredWords} color="text-amber-500" bgColor="bg-amber-500/10" />
                <StatCard icon={Clock} label="Due for Review" value={data.vocabulary.dueWords} color="text-red-500" bgColor="bg-red-500/10" />
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <motion.div variants={fadeIn}>
                  <GlassCard hover={false}>
                    <h2 className="text-base font-semibold">Verb Analysis</h2>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between rounded-xl bg-[var(--bg-tertiary)]/60 px-3 py-2">
                        <span className="text-sm">Total Verbs</span>
                        <span className="font-semibold">{data.verbStats.total}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: 'Regular', value: data.verbStats.regular, color: 'bg-emerald-500/10 text-emerald-600' },
                          { label: 'Irregular', value: data.verbStats.irregular, color: 'bg-red-500/10 text-red-600' },
                          { label: 'Mixed', value: data.verbStats.mixed, color: 'bg-amber-500/10 text-amber-600' },
                        ].map(v => (
                          <div key={v.label} className={`rounded-xl p-3 text-center ${v.color}`}>
                            <p className="text-xl font-bold">{v.value}</p>
                            <p className="text-[10px]">{v.label}</p>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-xl bg-blue-500/10 p-3 text-center text-blue-600">
                          <p className="text-xl font-bold">{data.verbStats.haben}</p>
                          <p className="text-[10px]">haben auxiliary</p>
                        </div>
                        <div className="rounded-xl bg-purple-500/10 p-3 text-center text-purple-600">
                          <p className="text-xl font-bold">{data.verbStats.sein}</p>
                          <p className="text-[10px]">sein auxiliary</p>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>

                <motion.div variants={fadeIn}>
                  <GlassCard hover={false}>
                    <h2 className="text-base font-semibold">Conjugation Accuracy</h2>
                    <div className="mt-4 space-y-4">
                      <AccuracyBar label="Meaning / Flashcard" value={data.wordsPractice.meaningAccuracy} color="bg-blue-500" />
                      <AccuracyBar label="Conjugation" value={data.wordsPractice.conjugationAccuracy} color="bg-purple-500" />
                      <AccuracyBar label="Gender" value={data.gender.accuracy} color="bg-amber-500" />
                    </div>
                    <div className="mt-4 border-t border-[var(--border)] pt-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--text-secondary)]">Sentence Practices</span>
                        <span className="font-semibold">{data.wordsPractice.sentenceReviews}</span>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              </div>

              {/* Hardest + Best Words */}
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <motion.div variants={fadeIn}>
                  <GlassCard hover={false}>
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} className="text-[var(--danger)]" />
                      <h2 className="text-base font-semibold">Hardest Words</h2>
                    </div>
                    <p className="text-xs text-[var(--text-tertiary)]">Words you struggle with the most</p>
                    <div className="mt-4 space-y-2">
                      {data.hardestWords.length === 0 && (
                        <p className="py-4 text-center text-sm text-[var(--text-tertiary)]">Practice more to see your hardest words</p>
                      )}
                      {(showAllHard ? data.hardestWords : data.hardestWords.slice(0, 4)).map((w, i) => (
                        <WordRow key={i} word={w} />
                      ))}
                      {data.hardestWords.length > 4 && (
                        <button
                          onClick={() => setShowAllHard(!showAllHard)}
                          className="flex w-full items-center justify-center gap-1 pt-2 text-xs font-medium text-[var(--accent)]"
                        >
                          {showAllHard ? <><ChevronUp size={14} /> Show Less</> : <><ChevronDown size={14} /> Show All ({data.hardestWords.length})</>}
                        </button>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>

                <motion.div variants={fadeIn}>
                  <GlassCard hover={false}>
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-amber-500" />
                      <h2 className="text-base font-semibold">Best Words</h2>
                    </div>
                    <p className="text-xs text-[var(--text-tertiary)]">Words you know best</p>
                    <div className="mt-4 space-y-2">
                      {data.bestWords.length === 0 && (
                        <p className="py-4 text-center text-sm text-[var(--text-tertiary)]">Practice more to see your best words</p>
                      )}
                      {(showAllBest ? data.bestWords : data.bestWords.slice(0, 4)).map((w, i) => (
                        <WordRow key={i} word={w} />
                      ))}
                      {data.bestWords.length > 4 && (
                        <button
                          onClick={() => setShowAllBest(!showAllBest)}
                          className="flex w-full items-center justify-center gap-1 pt-2 text-xs font-medium text-[var(--accent)]"
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
            <motion.div key="exams" initial="hidden" animate="visible" exit="hidden" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={GraduationCap} label="Goethe Exams" value={data.goetheExams.totalAttempts} color="text-red-500" bgColor="bg-red-500/10" />
                <StatCard icon={TrendingUp} label="Avg Goethe Score" value={data.goetheExams.avgScore > 0 ? `${data.goetheExams.avgScore}%` : '—'} color="text-emerald-500" bgColor="bg-emerald-500/10" />
                <StatCard icon={Target} label="Batch Exams" value={data.batchExams.totalExams} color="text-blue-500" bgColor="bg-blue-500/10" />
                <StatCard icon={Award} label="Avg Batch Score" value={data.batchExams.avgScore > 0 ? `${data.batchExams.avgScore}%` : '—'} color="text-purple-500" bgColor="bg-purple-500/10" />
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <motion.div variants={fadeIn}>
                  <GlassCard hover={false}>
                    <h2 className="text-base font-semibold">Goethe Exam by Level</h2>
                    <div className="mt-4 space-y-3">
                      {Object.keys(data.goetheExams.byLevel).length === 0 && (
                        <p className="py-4 text-center text-sm text-[var(--text-tertiary)]">No Goethe exams completed yet</p>
                      )}
                      {Object.entries(data.goetheExams.byLevel).map(([level, stats]) => (
                        <div key={level} className="rounded-xl bg-[var(--bg-tertiary)]/60 p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">{level}</span>
                            <span className="text-xs text-[var(--text-tertiary)]">{stats.attempts} attempt{stats.attempts !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="mt-2 flex items-center gap-4">
                            <div className="flex-1">
                              <AccuracyBar label="Average" value={stats.avgScore} color="bg-[var(--accent)]" />
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-[var(--text-tertiary)]">Best</p>
                              <p className="text-lg font-bold text-[var(--success)]">{stats.best}%</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>

                <motion.div variants={fadeIn}>
                  <GlassCard hover={false}>
                    <h2 className="text-base font-semibold">Batch Exam Breakdown</h2>
                    <div className="mt-4 space-y-4">
                      <AccuracyBar label="Vocabulary Accuracy" value={data.batchExams.avgVocabAccuracy} color="bg-blue-500" />
                      <AccuracyBar label="Gender Accuracy" value={data.batchExams.avgGenderAccuracy} color="bg-amber-500" />
                      <AccuracyBar label="Verb Accuracy" value={data.batchExams.avgVerbAccuracy} color="bg-purple-500" />
                      {data.batchExams.totalExams === 0 && (
                        <p className="py-4 text-center text-sm text-[var(--text-tertiary)]">No batch exams completed yet</p>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              </div>

              {/* Recent exams list */}
              {data.goetheExams.recentExams.length > 0 && (
                <motion.div variants={fadeIn} className="mt-6">
                  <GlassCard hover={false}>
                    <h2 className="text-base font-semibold">Recent Goethe Exams</h2>
                    <div className="mt-4 space-y-2">
                      {data.goetheExams.recentExams.map(e => (
                        <div key={e.id} className="flex items-center gap-4 rounded-xl bg-[var(--bg-tertiary)]/60 px-4 py-3">
                          <span className="text-sm font-medium">{e.level}</span>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
                            <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${e.score}%` }} />
                          </div>
                          <span className="text-sm font-bold tabular-nums">{e.score}%</span>
                          <span className="text-xs text-[var(--text-tertiary)]">
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
            <motion.div key="grammar" initial="hidden" animate="visible" exit="hidden" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={Brain} label="Grammar Topics" value={data.grammar.totalTopics} />
                <StatCard icon={CheckCircle2} label="Completed" value={data.grammar.completed} color="text-emerald-500" bgColor="bg-emerald-500/10" />
                <StatCard icon={Target} label="Completion" value={`${data.grammar.completion}%`} color="text-blue-500" bgColor="bg-blue-500/10" />
                <StatCard icon={TrendingUp} label="Avg Score" value={data.grammar.avgScore > 0 ? `${data.grammar.avgScore}%` : '—'} color="text-purple-500" bgColor="bg-purple-500/10" />
              </div>

              <motion.div variants={fadeIn} className="mt-6">
                <GlassCard hover={false}>
                  <h2 className="text-base font-semibold">Grammar Progress</h2>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--text-secondary)]">Topics Completed</span>
                      <span className="font-semibold">{data.grammar.completed} / {data.grammar.totalTopics}</span>
                    </div>
                    <div className="mt-2 h-4 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${data.grammar.completion}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-[var(--text-tertiary)]">
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
            <motion.div key="listening" initial="hidden" animate="visible" exit="hidden" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard icon={Headphones} label="Total Attempts" value={data.listening.totalAttempts} color="text-teal-500" bgColor="bg-teal-500/10" />
                <StatCard icon={CheckCircle2} label="Completed" value={data.listening.completed} color="text-emerald-500" bgColor="bg-emerald-500/10" />
                <StatCard icon={TrendingUp} label="Avg Score" value={data.listening.avgScore > 0 ? `${data.listening.avgScore}%` : '—'} color="text-purple-500" bgColor="bg-purple-500/10" />
              </div>

              <motion.div variants={fadeIn} className="mt-6">
                <GlassCard hover={false}>
                  <h2 className="text-base font-semibold">Listening by Level</h2>
                  <div className="mt-4 space-y-3">
                    {Object.keys(data.listening.byLevel).length === 0 && (
                      <p className="py-4 text-center text-sm text-[var(--text-tertiary)]">No listening practice completed yet</p>
                    )}
                    {Object.entries(data.listening.byLevel).map(([level, stats]) => (
                      <div key={level} className="flex items-center gap-4 rounded-xl bg-[var(--bg-tertiary)]/60 px-4 py-3">
                        <span className="text-sm font-semibold">{level}</span>
                        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
                          <div className="h-full rounded-full bg-teal-500" style={{ width: `${stats.avgScore}%` }} />
                        </div>
                        <span className="text-sm font-bold tabular-nums">{stats.avgScore}%</span>
                        <span className="text-xs text-[var(--text-tertiary)]">{stats.attempts} attempt{stats.attempts !== 1 ? 's' : ''}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div variants={fadeIn} className="mt-6">
                <GlassCard hover={false}>
                  <h2 className="text-base font-semibold">Conversation Practice</h2>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10">
                      <MessageCircle size={28} className="text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{data.conversations}</p>
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
