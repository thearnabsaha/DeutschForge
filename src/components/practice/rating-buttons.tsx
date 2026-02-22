'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RatingButtonsProps {
  onRate: (rating: 1 | 2 | 3 | 4) => void;
  disabled?: boolean;
}

const ratings = [
  { value: 1 as const, label: 'Again', sublabel: '<1 min', color: 'bg-red-500 hover:bg-red-600', ring: 'focus:ring-red-300' },
  { value: 2 as const, label: 'Hard', sublabel: '~10 min', color: 'bg-amber-500 hover:bg-amber-600', ring: 'focus:ring-amber-300' },
  { value: 3 as const, label: 'Good', sublabel: 'Optimal', color: 'bg-emerald-500 hover:bg-emerald-600', ring: 'focus:ring-emerald-300' },
  { value: 4 as const, label: 'Easy', sublabel: 'Extended', color: 'bg-blue-500 hover:bg-blue-600', ring: 'focus:ring-blue-300' },
];

export function RatingButtons({ onRate, disabled }: RatingButtonsProps) {
  return (
    <motion.div
      className="flex justify-center gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.15 }}
    >
      {ratings.map((r) => (
        <motion.button
          key={r.value}
          onClick={() => onRate(r.value)}
          disabled={disabled}
          className={cn(
            'flex flex-col items-center rounded-2xl px-5 py-3 text-white shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50',
            r.color,
            r.ring
          )}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-sm font-semibold">{r.label}</span>
          <span className="mt-0.5 text-[10px] opacity-80">{r.sublabel}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}
