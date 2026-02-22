'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { formatTime, cn } from '@/lib/utils';

interface ExamTimerProps {
  /** Total remaining seconds */
  remainingSeconds: number;
  /** Progress 0-100 (100 = full time left) */
  progressPercent: number;
}

export function ExamTimer({ remainingSeconds, progressPercent }: ExamTimerProps) {
  const isLow = remainingSeconds < 120;
  const isCritical = remainingSeconds < 30;

  return (
    <motion.div
      className={cn(
        'flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-sm font-medium',
        isCritical
          ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
          : isLow
            ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
            : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
      )}
      animate={isCritical ? { scale: [1, 1.02, 1] } : {}}
      transition={isCritical ? { repeat: Infinity, duration: 1 } : {}}
    >
      <Clock size={16} />
      <span>{formatTime(remainingSeconds)}</span>
      <div className="ml-2 h-1 w-16 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
        <motion.div
          className={cn(
            'h-full rounded-full',
            isCritical ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-[var(--accent)]'
          )}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
}
