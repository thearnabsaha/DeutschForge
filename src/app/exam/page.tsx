'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GraduationCap, Clock, BookOpen, Headphones, PenTool, MessageCircle, ArrowRight, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';

const levels = [
  { value: 'A1', label: 'A1', desc: 'Beginner – basic phrases & greetings', color: 'border-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { value: 'A2', label: 'A2', desc: 'Elementary – daily routines & needs', color: 'border-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { value: 'B1', label: 'B1', desc: 'Intermediate – opinions & experiences', color: 'border-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { value: 'B2', label: 'B2', desc: 'Upper-intermediate – complex arguments', color: 'border-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
];

const sections = [
  { icon: BookOpen, label: 'Lesen', desc: 'Reading comprehension', time: '25 min' },
  { icon: Headphones, label: 'Hören', desc: 'Listening comprehension', time: '20 min' },
  { icon: PenTool, label: 'Schreiben', desc: 'Written expression', time: '30 min' },
  { icon: MessageCircle, label: 'Sprechen', desc: 'Oral expression prep', time: '15 min' },
];

export default function ExamSetupPage() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<string>('A1');
  const [starting, setStarting] = useState(false);

  const handleStart = async () => {
    setStarting(true);
    try {
      const res = await fetch('/api/exam/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cefrLevel: selectedLevel }),
      });
      const data = await res.json();
      if (data.attemptId) {
        router.push(`/exam/${data.attemptId}/lesen`);
      }
    } catch {
      setStarting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
      <PageHeader
        title="Goethe-Zertifikat Simulator"
        subtitle="Full mock exam experience"
      />

      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard hover={false}>
          <h2 className="text-base font-semibold">Select Your Level</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {levels.map((l) => (
              <motion.button
                key={l.value}
                onClick={() => setSelectedLevel(l.value)}
                className={cn(
                  'flex flex-col items-center rounded-2xl border-2 p-4 transition-all',
                  selectedLevel === l.value
                    ? `${l.color} ${l.bg} shadow-md`
                    : 'border-transparent bg-[var(--bg-tertiary)] hover:border-[var(--border)]'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-2xl font-bold">{l.label}</span>
                <span className="mt-1 text-center text-[10px] text-[var(--text-tertiary)]">
                  {l.desc}
                </span>
              </motion.button>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard hover={false}>
          <h2 className="text-base font-semibold">Exam Structure</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            The Goethe-Zertifikat {selectedLevel} consists of four modules:
          </p>
          <div className="mt-4 space-y-3">
            {sections.map((s, i) => (
              <motion.div
                key={s.label}
                className="flex items-center gap-4 rounded-xl p-3 bg-[var(--bg-tertiary)]"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-secondary)]">
                  <s.icon size={18} className="text-[var(--accent)]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{s.label}</p>
                  <p className="text-[11px] text-[var(--text-tertiary)]">{s.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                  <Clock size={12} />
                  {s.time}
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      <motion.div
        className="mt-8 flex justify-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          onClick={handleStart}
          disabled={starting}
          className="btn-primary px-8 py-3 text-base"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {starting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <GraduationCap size={18} />
          )}
          {starting ? 'Preparing Exam...' : 'Begin Exam'}
          {!starting && <ArrowRight size={16} />}
        </motion.button>
      </motion.div>
    </div>
  );
}
