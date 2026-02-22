'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Clock, BookOpen, Headphones, PenTool, MessageCircle,
  ArrowRight, Loader2, CheckCircle2, Star,
} from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/page-header';
import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';
import { sfx } from '@/lib/sounds';

const LEVELS = [
  { value: 'A1', label: 'A1', desc: 'Beginner', color: 'border-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', accent: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-400/30' },
  { value: 'A2', label: 'A2', desc: 'Elementary', color: 'border-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', accent: 'text-blue-600 dark:text-blue-400', ring: 'ring-blue-400/30' },
  { value: 'B1', label: 'B1', desc: 'Intermediate', color: 'border-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', accent: 'text-amber-600 dark:text-amber-400', ring: 'ring-amber-400/30' },
  { value: 'B2', label: 'B2', desc: 'Upper-Intermediate', color: 'border-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20', accent: 'text-purple-600 dark:text-purple-400', ring: 'ring-purple-400/30' },
];

const SECTIONS = [
  { icon: BookOpen, label: 'Lesen', desc: 'Reading comprehension' },
  { icon: Headphones, label: 'Hören', desc: 'Listening comprehension' },
  { icon: PenTool, label: 'Schreiben', desc: 'Written expression' },
  { icon: MessageCircle, label: 'Sprechen', desc: 'Oral expression' },
];

interface SetInfo {
  setNumber: number;
  exists: boolean;
  isStatic: boolean;
  attemptCount: number;
  completedCount: number;
  bestScore: number | null;
  bestMaxScore: number | null;
  bestPercentage: number | null;
}

export default function ExamSetupPage() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState('A1');
  const [sets, setSets] = useState<SetInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState<number | null>(null);

  const fetchSets = useCallback(async (level: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/exam/sets?level=${level}`);
      const data = await res.json();
      setSets(data.sets || []);
    } catch {
      setSets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSets(selectedLevel);
  }, [selectedLevel, fetchSets]);

  const handleStart = async (setNumber: number) => {
    setStarting(setNumber);
    sfx.click();
    try {
      const res = await fetch('/api/exam/sets/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cefrLevel: selectedLevel, setNumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start');
      if (data.attemptId) {
        router.push(`/exam/${data.attemptId}/lesen`);
      }
    } catch (e) {
      console.error(e);
      setStarting(null);
    }
  };

  const levelConfig = LEVELS.find(l => l.value === selectedLevel)!;

  const scoreColor = (pct: number | null) => {
    if (pct === null) return '';
    if (pct >= 80) return 'text-emerald-500';
    if (pct >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const scoreBg = (pct: number | null) => {
    if (pct === null) return '';
    if (pct >= 80) return 'bg-emerald-500/10 border-emerald-500/30';
    if (pct >= 60) return 'bg-amber-500/10 border-amber-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Goethe-Zertifikat Simulator"
          subtitle="Choose a level and exam set to begin"
        />
        <Link
          href="/exam/history"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline shrink-0"
        >
          View History
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Level Selector */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {LEVELS.map((l) => (
            <motion.button
              key={l.value}
              onClick={() => { setSelectedLevel(l.value); sfx.click(); }}
              className={cn(
                'relative flex flex-col items-center rounded-2xl border-2 p-4 transition-all',
                selectedLevel === l.value
                  ? `${l.color} ${l.bg} shadow-md ring-4 ${l.ring}`
                  : 'border-transparent bg-[var(--bg-tertiary)] hover:border-[var(--border)]'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-2xl font-bold">{l.label}</span>
              <span className="mt-1 text-xs text-[var(--text-tertiary)]">{l.desc}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Structure Overview */}
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard hover={false}>
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap size={20} className={levelConfig.accent} />
            <h2 className="text-sm font-semibold">
              Goethe-Zertifikat {selectedLevel} Structure
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SECTIONS.map((s) => (
              <div key={s.label} className="flex items-center gap-3 rounded-xl bg-[var(--bg-tertiary)] p-3">
                <s.icon size={16} className="text-[var(--accent)] shrink-0" />
                <div>
                  <p className="text-xs font-medium">{s.label}</p>
                  <p className="text-[10px] text-[var(--text-tertiary)]">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Set Grid */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Exam Sets</h2>
          <span className="text-xs text-[var(--text-tertiary)]">
            {sets.filter(s => s.completedCount > 0).length} / {sets.length} completed
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.01 } } }}
          >
            <AnimatePresence>
              {sets.map((s) => (
                <motion.button
                  key={s.setNumber}
                  variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
                  onClick={() => handleStart(s.setNumber)}
                  disabled={starting !== null}
                  className={cn(
                    'group relative flex flex-col items-center justify-center rounded-xl border p-2.5 transition-all',
                    'min-h-[72px]',
                    s.completedCount > 0
                      ? scoreBg(s.bestPercentage)
                      : s.exists
                      ? 'border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent)] hover:shadow-md'
                      : 'border-dashed border-[var(--border)] bg-[var(--bg-tertiary)]/50 hover:border-[var(--accent)]/60 hover:bg-[var(--bg-secondary)]'
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {starting === s.setNumber ? (
                    <Loader2 size={16} className="animate-spin text-[var(--accent)]" />
                  ) : (
                    <>
                      <span className="text-sm font-bold">{s.setNumber}</span>
                      {s.completedCount > 0 ? (
                        <>
                          <CheckCircle2 size={12} className={cn('mt-0.5', scoreColor(s.bestPercentage))} />
                          <span className={cn('text-[9px] font-medium mt-0.5', scoreColor(s.bestPercentage))}>
                            {s.bestPercentage}%
                          </span>
                        </>
                      ) : s.attemptCount > 0 ? (
                        <Clock size={10} className="mt-0.5 text-amber-500" />
                      ) : s.exists ? (
                        <Star size={10} className="mt-0.5 text-[var(--text-tertiary)] opacity-40" />
                      ) : (
                        <span className="mt-0.5 text-[9px] text-[var(--text-tertiary)]">AI</span>
                      )}
                    </>
                  )}
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-[10px] text-[var(--text-tertiary)]">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded border border-[var(--border)] bg-[var(--bg-secondary)]" />
          <span>Pre-built</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded border border-dashed border-[var(--border)] bg-[var(--bg-tertiary)]/50" />
          <span>AI-generated on start</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={12} className="text-emerald-500" />
          <span>Completed (80%+)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={12} className="text-amber-500" />
          <span>Completed (60–79%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={12} className="text-red-500" />
          <span>Completed (&lt;60%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="text-amber-500" />
          <span>In progress</span>
        </div>
      </div>
    </div>
  );
}
