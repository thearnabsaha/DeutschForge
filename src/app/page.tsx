'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Brain,
  Flame,
  BookOpen,
  MessageCircle,
  GraduationCap,
  Upload,
  BookMarked,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Bell,
  X,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { ProgressRing } from '@/components/ui/progress-ring';
import { getGreeting } from '@/lib/utils';
import { useEffect, useState } from 'react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

interface DashboardData {
  vocabulary: {
    totalWords: number;
    mastered: number;
    byPOS: Record<string, number>;
    byGender: Record<string, number>;
    byCEFR: Record<string, number>;
    dueWords: number;
  };
  reviews: { today: number; streak: number };
  grammar: {
    totalTopics: number;
    completed: number;
    completion: number;
    byLevel: Record<string, number>;
  };
  exams: { history: Array<{ id: string; totalScore?: number; maxScore?: number; cefrLevel: string; startedAt: string; sections: unknown[] }>; totalAttempts: number };
  insights: { strengths: string[]; weaknesses: string[]; recommendations: string[]; generatedAt: string } | null;
  memoryStability: number;
  conversations: number;
}

const CEFR_ORDER = ['A1', 'A2', 'B1', 'B2'];
const POS_COLORS: Record<string, string> = {
  noun: 'bg-blue-500',
  verb: 'bg-emerald-500',
  adjective: 'bg-amber-500',
  adverb: 'bg-purple-500',
  preposition: 'bg-rose-500',
  pronoun: 'bg-cyan-500',
  conjunction: 'bg-orange-500',
  article: 'bg-indigo-500',
  other: 'bg-slate-400',
};

const GENDER_COLORS: Record<string, string> = {
  masculine: 'bg-blue-500',
  feminine: 'bg-rose-500',
  neuter: 'bg-amber-500',
};

const GENDER_LABELS: Record<string, string> = {
  masculine: 'der',
  feminine: 'die',
  neuter: 'das',
};

function ReminderBanner() {
  const [reminders, setReminders] = useState<Array<{ id: string; message: string; type: string }>>([]);

  useEffect(() => {
    fetch('/api/reminders')
      .then((r) => r.json())
      .then((d) => setReminders(d.reminders || []))
      .catch(() => {});
  }, []);

  const dismiss = async (id: string) => {
    await fetch('/api/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reminderId: id }),
    });
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  if (reminders.length === 0) return null;

  return (
    <div className="mb-6 space-y-3">
      <AnimatePresence>
        {reminders.map((r) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3"
          >
          <div className="flex items-center gap-3">
            <Bell size={18} className="shrink-0 text-amber-500" />
            <p className="text-sm text-[var(--text-primary)]">{r.message}</p>
          </div>
          <button
            onClick={() => dismiss(r.id)}
            className="ml-3 shrink-0 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
          >
            <X size={16} />
          </button>
        </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function HardWordsCard() {
  const [hardWords, setHardWords] = useState<Array<{ word: string; meaning: string; accuracy: number }>>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/vocabulary/analytics')
      .then((r) => r.json())
      .then((d) => {
        setHardWords(d.hardWords || []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <GlassCard hover={false}>
      <h2 className="flex items-center gap-2 text-base font-semibold">
        <AlertTriangle size={18} className="text-red-500" />
        Top 10 Hardest Words
      </h2>
      {!loaded ? (
        <p className="mt-4 text-sm text-[var(--text-tertiary)]">Loading...</p>
      ) : hardWords.length === 0 ? (
        <p className="mt-4 text-sm text-[var(--text-tertiary)]">Review more words to see difficulty analytics.</p>
      ) : (
        <div className="mt-4 space-y-2">
          {hardWords.map((w, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg bg-[var(--bg-tertiary)]/50 px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium">{w.word}</span>
                <span className="ml-2 text-xs text-[var(--text-tertiary)]">{w.meaning}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                  <div
                    className={`h-full ${w.accuracy < 40 ? 'bg-red-500' : w.accuracy < 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${w.accuracy}%` }}
                  />
                </div>
                <span className="w-10 text-right text-xs font-medium text-[var(--text-secondary)]">{w.accuracy}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}

function strengthColor(idx: number, total: number): string {
  const ratio = (idx + 1) / total;
  if (ratio <= 0.33) return 'text-red-500';
  if (ratio <= 0.66) return 'text-amber-500';
  return 'text-emerald-500';
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then((d) => {
        setData(d.error ? null : d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const cefrTotal = data ? CEFR_ORDER.reduce((s, l) => s + (data.vocabulary?.byCEFR?.[l] || 0), 0) : 0;
  const cefrPcts = CEFR_ORDER.map((l) => ({
    level: l,
    count: data?.vocabulary?.byCEFR?.[l] || 0,
    pct: cefrTotal > 0 ? ((data?.vocabulary?.byCEFR?.[l] || 0) / cefrTotal) * 100 : 0,
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      <PageHeader
        title={getGreeting()}
        subtitle="Your German journey continues. Keep the momentum."
      />

      <ReminderBanner />

      {/* Row 1: Quick Stats */}
      <motion.div
        className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <GlassCard className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20">
              <Brain size={20} className="text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{loading ? '–' : data?.vocabulary?.totalWords ?? 0}</p>
              <p className="text-xs text-[var(--text-tertiary)]">words learned</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={item}>
          <GlassCard className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
              <Flame size={20} className="text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{loading ? '–' : data?.reviews?.streak ?? 0}</p>
              <p className="text-xs text-[var(--text-tertiary)]">day streak</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={item}>
          <GlassCard className="flex items-center justify-center">
            <ProgressRing
              progress={loading ? 0 : (data?.grammar?.completion ?? 0)}
              size={80}
              strokeWidth={6}
              label={loading ? '–' : `${data?.grammar?.completion ?? 0}%`}
              sublabel="Grammar"
            />
          </GlassCard>
        </motion.div>

        <motion.div variants={item}>
          <GlassCard className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
              <BookOpen size={20} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{loading ? '–' : data?.memoryStability ?? 0}</p>
              <p className="text-xs text-[var(--text-tertiary)]">memory index</p>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>

      {/* Row 2: CEFR Progress */}
      <motion.div className="mt-8" variants={container} initial="hidden" animate="show">
        <motion.div variants={item}>
          <GlassCard hover={false}>
            <h2 className="text-sm font-semibold text-[var(--text-secondary)]">CEFR Journey (A1 → B2)</h2>
            <div className="mt-3 flex h-4 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
              {cefrPcts.map(({ level, pct }) => (
                <motion.div
                  key={level}
                  className={level === 'A1' ? 'bg-emerald-500' : level === 'A2' ? 'bg-blue-500' : level === 'B1' ? 'bg-amber-500' : 'bg-purple-500'}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  title={`${level}: ${pct.toFixed(0)}%`}
                  style={{ minWidth: pct > 0 ? '4px' : 0 }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-[var(--text-tertiary)]">
              {CEFR_ORDER.map((l) => (
                <span key={l}>{l}: {data?.vocabulary?.byCEFR?.[l] ?? 0}</span>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>

      {/* Row 3: Vocabulary Breakdown */}
      <motion.div
        className="mt-8 grid gap-6 lg:grid-cols-2"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <GlassCard hover={false}>
            <h2 className="text-base font-semibold">Part of Speech</h2>
            <div className="mt-4 space-y-3">
              {Object.entries(data?.vocabulary?.byPOS ?? {}).map(([pos, count]) => {
                const total = Object.values(data?.vocabulary?.byPOS ?? {}).reduce((a, b) => a + b, 0);
                const pct = total > 0 ? (count / total) * 100 : 0;
                return (
                  <div key={pos} className="flex items-center gap-3">
                    <div className="w-20 shrink-0 text-xs text-[var(--text-secondary)] capitalize">{pos}</div>
                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                      <motion.div
                        className={`h-full ${POS_COLORS[pos] ?? 'bg-slate-400'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs font-medium">{count}</span>
                  </div>
                );
              })}
              {(!data?.vocabulary?.byPOS || Object.keys(data.vocabulary.byPOS).length === 0) && !loading && (
                <p className="text-sm text-[var(--text-tertiary)]">No vocabulary yet. Start by uploading words.</p>
              )}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={item}>
          <GlassCard hover={false}>
            <h2 className="text-base font-semibold">Gender (der/die/das)</h2>
            <div className="mt-4 flex gap-4">
              {(['masculine', 'feminine', 'neuter'] as const).map((g) => {
                const count = data?.vocabulary?.byGender?.[g] ?? 0;
                const total = Object.values(data?.vocabulary?.byGender ?? {}).reduce((a, b) => a + b, 0);
                const h = total > 0 ? Math.max(24, (count / total) * 120) : 24;
                return (
                  <div key={g} className="flex flex-1 flex-col items-center gap-2">
                    <motion.div
                      className={`w-full rounded-lg ${GENDER_COLORS[g]}`}
                      initial={{ height: 0 }}
                      animate={{ height: h }}
                      transition={{ duration: 0.5 }}
                      style={{ minHeight: 24 }}
                    />
                    <span className="text-xs font-medium">{GENDER_LABELS[g]}</span>
                    <span className="text-[11px] text-[var(--text-tertiary)]">{count}</span>
                  </div>
                );
              })}
            </div>
            {(!data?.vocabulary?.byGender || Object.values(data.vocabulary.byGender).every((v) => v === 0)) && !loading && (
              <p className="mt-2 text-sm text-[var(--text-tertiary)]">No nouns with gender yet.</p>
            )}
          </GlassCard>
        </motion.div>
      </motion.div>

      {/* Row 4: Recent Activity */}
      <motion.div
        className="mt-8 grid gap-6 lg:grid-cols-2"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <GlassCard hover={false}>
            <h2 className="text-base font-semibold">Exam History</h2>
            <div className="mt-4 space-y-2">
              {(data?.exams?.history ?? []).slice(0, 5).map((exam) => {
                const score = exam.totalScore != null && exam.maxScore != null && exam.maxScore > 0
                  ? Math.round((exam.totalScore / exam.maxScore) * 100)
                  : null;
                const color = score == null ? 'text-[var(--text-tertiary)]' : score >= 75 ? 'text-emerald-500' : score >= 60 ? 'text-amber-500' : 'text-red-500';
                return (
                  <div
                    key={exam.id}
                    className="flex items-center justify-between rounded-xl bg-[var(--bg-tertiary)]/50 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="level" level={exam.cefrLevel}>{exam.cefrLevel}</Badge>
                      <span className="text-xs text-[var(--text-secondary)]">
                        {new Date(exam.startedAt).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${color}`}>
                      {score != null ? `${score}%` : '–'}
                    </span>
                  </div>
                );
              })}
              {(!data?.exams?.history?.length) && !loading && (
                <p className="text-sm text-[var(--text-tertiary)]">No exams yet.</p>
              )}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={item}>
          <GlassCard hover={false}>
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <Sparkles size={18} className="text-amber-500" />
              AI Insights
            </h2>
            {data?.insights ? (
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Strengths</p>
                  <ul className="mt-1 space-y-1">
                    {data.insights.strengths.slice(0, 3).map((s, i) => (
                      <li key={i} className="text-sm text-[var(--text-secondary)]">• {s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-medium text-amber-600 dark:text-amber-400">Weaknesses</p>
                  <ul className="mt-1 space-y-1">
                    {data.insights.weaknesses.slice(0, 3).map((w, i) => (
                      <li key={i} className={`text-sm ${strengthColor(i, data.insights!.weaknesses.length)}`}>• {w}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-[var(--text-tertiary)]">
                Complete more reviews to unlock insights.
              </p>
            )}
          </GlassCard>
        </motion.div>
      </motion.div>

      {/* Row: Hard Words */}
      <motion.div className="mt-8" variants={container} initial="hidden" animate="show">
        <motion.div variants={item}>
          <HardWordsCard />
        </motion.div>
      </motion.div>

      {/* Row 5: Quick Actions */}
      <motion.div className="mt-8" variants={container} initial="hidden" animate="show">
        <motion.div variants={item}>
          <GlassCard hover={false}>
            <h2 className="text-base font-semibold">Quick Actions</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {[
                { label: 'Practice', icon: Brain, href: '/practice' },
                { label: 'Upload Words', icon: Upload, href: '/vocabulary' },
                { label: 'Grammar', icon: BookMarked, href: '/grammar' },
                { label: 'Chat', icon: MessageCircle, href: '/chat' },
                { label: 'Take Exam', icon: GraduationCap, href: '/exam' },
              ].map(({ label, icon: Icon, href }) => (
                <Link key={label} href={href}>
                  <motion.button
                    className="btn-secondary flex items-center gap-2"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Icon size={16} />
                    {label}
                    <ArrowRight size={14} />
                  </motion.button>
                </Link>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
