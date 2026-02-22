'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Calendar,
  TrendingUp,
  Brain,
  Loader2,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { GlassCard } from '@/components/ui/glass-card';
import { ProgressRing } from '@/components/ui/progress-ring';

interface ProgressData {
  totalReviews: number;
  averageRating: number;
  cardsByState: { state: number; count: number }[];
  recentActivity: { date: string; count: number }[];
  examHistory: { id: string; level: string; score: number; maxScore: number; date: string }[];
}

const stateLabels: Record<number, string> = {
  0: 'New',
  1: 'Learning',
  2: 'Review',
  3: 'Relearning',
};

const stateColors: Record<number, string> = {
  0: 'bg-gray-400',
  1: 'bg-amber-400',
  2: 'bg-emerald-400',
  3: 'bg-red-400',
};

export default function ProgressPage() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/progress')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  const totalByState = data?.cardsByState.reduce((sum, s) => sum + s.count, 0) || 1;
  const reviewCards = data?.cardsByState.find((s) => s.state === 2)?.count || 0;
  const masteryPct = Math.round((reviewCards / totalByState) * 100);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
      <PageHeader title="Progress" subtitle="Your learning analytics" />

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard hover={false} className="flex flex-col items-center">
            <ProgressRing
              progress={masteryPct}
              label={`${masteryPct}%`}
              sublabel="Mastery Rate"
            />
            <div className="mt-4 grid w-full grid-cols-2 gap-2">
              {(data?.cardsByState || []).map((s) => (
                <div key={s.state} className="flex items-center gap-2 text-xs">
                  <div className={`h-2 w-2 rounded-full ${stateColors[s.state]}`} />
                  <span className="text-[var(--text-secondary)]">
                    {stateLabels[s.state]}: {s.count}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <GlassCard hover={false}>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-[var(--accent)]" />
              <h2 className="text-base font-semibold">Review Activity (Last 14 Days)</h2>
            </div>
            <div className="mt-4 flex items-end gap-1.5" style={{ height: 120 }}>
              {(data?.recentActivity || []).map((day, i) => {
                const maxCount = Math.max(...(data?.recentActivity || []).map((d) => d.count), 1);
                const height = (day.count / maxCount) * 100;
                return (
                  <motion.div
                    key={day.date}
                    className="flex flex-1 flex-col items-center gap-1"
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <span className="text-[9px] text-[var(--text-tertiary)]">{day.count || ''}</span>
                    <div
                      className="w-full rounded-t-md bg-[var(--accent)] transition-all"
                      style={{ height: `${Math.max(height, 4)}%`, minHeight: 4, opacity: day.count ? 1 : 0.2 }}
                    />
                    <span className="text-[8px] text-[var(--text-tertiary)]">
                      {new Date(day.date).toLocaleDateString('de', { day: '2-digit' })}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <motion.div
        className="mt-6 grid gap-4 sm:grid-cols-2"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20">
            <TrendingUp size={20} className="text-[var(--accent)]" />
          </div>
          <div>
            <p className="text-2xl font-semibold">{data?.totalReviews || 0}</p>
            <p className="text-xs text-[var(--text-tertiary)]">Total Reviews</p>
          </div>
        </GlassCard>
        <GlassCard className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
            <Brain size={20} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-semibold">{data?.averageRating?.toFixed(1) || '–'}</p>
            <p className="text-xs text-[var(--text-tertiary)]">Avg. Rating (1-4)</p>
          </div>
        </GlassCard>
      </motion.div>

      {data?.examHistory && data.examHistory.length > 0 && (
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard hover={false}>
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-[var(--accent)]" />
              <h2 className="text-base font-semibold">Exam History</h2>
            </div>
            <div className="mt-4 space-y-2">
              {data.examHistory.map((e) => {
                const pct = Math.round((e.score / e.maxScore) * 100);
                return (
                  <div key={e.id} className="flex items-center gap-4 rounded-xl bg-[var(--bg-tertiary)] p-3">
                    <span className="text-sm font-medium">{e.level}</span>
                    <div className="flex-1">
                      <div className="h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
                        <div
                          className="h-full rounded-full bg-[var(--accent)]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-semibold">{pct}%</span>
                    <span className="text-xs text-[var(--text-tertiary)]">
                      {new Date(e.date).toLocaleDateString('de')}
                    </span>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
