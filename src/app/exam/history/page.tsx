'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '@/components/ui/page-header';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import {
  History,
  Clock,
  ArrowRight,
  Loader2,
  BookOpen,
  Headphones,
  PenTool,
  MessageCircle,
  GraduationCap,
} from 'lucide-react';

interface ExamSection {
  section: string;
  score: number | null;
  maxScore: number;
  timeSpent: number | null;
  hasSnapshot: boolean;
}

interface ExamHistoryItem {
  id: string;
  cefrLevel: string;
  title: string;
  totalScore: number | null;
  maxScore: number | null;
  status: string;
  startedAt: string;
  completedAt: string | null;
  totalTime: number;
  sections: ExamSection[];
}

const SECTION_ICONS: Record<string, typeof BookOpen> = {
  Lesen: BookOpen,
  Hören: Headphones,
  Schreiben: PenTool,
  Sprechen: MessageCircle,
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return `Today at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  return d.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function scoreColor(pct: number): string {
  if (pct >= 75) return 'text-emerald-500';
  if (pct >= 60) return 'text-amber-500';
  return 'text-red-500';
}

function barColor(pct: number): string {
  if (pct >= 75) return 'bg-emerald-500';
  if (pct >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}

export default function ExamHistoryPage() {
  const [history, setHistory] = useState<ExamHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/exam/history')
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setHistory(d.history ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 size={36} className="animate-spin text-[var(--accent)]" />
        <p className="mt-4 text-sm text-[var(--text-secondary)]">Loading exam history...</p>
      </div>
    );
  }

  const totalExams = history.length;
  const completedExams = history.filter((h) => h.status === 'completed' && h.totalScore != null && h.maxScore != null);
  const avgScore = completedExams.length > 0
    ? Math.round(
        completedExams.reduce((s, h) => s + ((h.totalScore ?? 0) / (h.maxScore ?? 1)) * 100, 0) /
          completedExams.length
      )
    : 0;
  const bestScore = completedExams.length > 0
    ? Math.max(
        ...completedExams.map((h) =>
          h.maxScore && h.maxScore > 0 ? Math.round(((h.totalScore ?? 0) / h.maxScore) * 100) : 0
        )
      )
    : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <PageHeader
        title="Exam History"
        subtitle="Review your past exam attempts"
      />

      {/* Stats bar */}
      <motion.div
        className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard hover={false}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/10">
              <GraduationCap size={20} className="text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalExams}</p>
              <p className="text-sm text-[var(--text-tertiary)]">Exams taken</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard hover={false}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <span className="text-xl font-bold text-emerald-500">{avgScore}%</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{avgScore}%</p>
              <p className="text-sm text-[var(--text-tertiary)]">Average score</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard hover={false}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
              <span className="text-xl font-bold text-amber-500">{bestScore}%</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{bestScore}%</p>
              <p className="text-sm text-[var(--text-tertiary)]">Best score</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Exam list */}
      <div className="mt-8 space-y-4">
        {history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard hover={false} className="text-center py-16">
              <History size={48} className="mx-auto text-[var(--text-tertiary)]" />
              <p className="mt-4 text-lg font-medium text-[var(--text-primary)]">
                No exams taken yet.
              </p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Start your first exam!
              </p>
              <Link
                href="/exam"
                className="btn-primary mt-6 inline-flex items-center gap-2"
              >
                <GraduationCap size={18} />
                Start Exam
              </Link>
            </GlassCard>
          </motion.div>
        ) : (
          <AnimatePresence>
            {history.map((item, i) => {
              const pct =
                item.maxScore != null && item.maxScore > 0 && item.totalScore != null
                  ? Math.round((item.totalScore / item.maxScore) * 100)
                  : 0;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <GlassCard hover={false}>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="level" level={item.cefrLevel}>
                            {item.cefrLevel}
                          </Badge>
                          <h3 className="font-semibold truncate">{item.title}</h3>
                        </div>
                        <p className="mt-1 text-sm text-[var(--text-tertiary)]">
                          {formatDate(item.startedAt)}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span
                            className={`text-2xl font-bold ${scoreColor(pct)}`}
                          >
                            {item.status === 'completed' ? `${pct}%` : '—'}
                          </span>
                          <Badge
                            className={
                              item.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            }
                          >
                            {item.status === 'completed'
                              ? 'Completed'
                              : 'In Progress'}
                          </Badge>
                        </div>
                        {/* Section bars */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.sections.map((sec) => {
                            const Icon = SECTION_ICONS[sec.section] ?? BookOpen;
                            const secPct =
                              sec.maxScore > 0 && sec.score != null
                                ? (sec.score / sec.maxScore) * 100
                                : 0;
                            return (
                              <div
                                key={sec.section}
                                className="flex items-center gap-1.5"
                              >
                                <Icon size={12} className="text-[var(--text-tertiary)]" />
                                <div className="h-1.5 w-12 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                                  <motion.div
                                    className={`h-full ${barColor(secPct)}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${secPct}%` }}
                                    transition={{ duration: 0.4 }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {item.totalTime > 0 && (
                          <p className="mt-2 flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                            <Clock size={12} />
                            {formatTime(item.totalTime)}
                          </p>
                        )}
                      </div>
                      <Link
                        href={`/exam/${item.id}/review`}
                        className="btn-primary inline-flex items-center gap-2 shrink-0"
                      >
                        Review
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
