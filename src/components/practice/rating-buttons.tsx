'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RatingButtonsProps {
  onRate: (rating: 1 | 2 | 3 | 4) => void;
  disabled?: boolean;
}

const ratings = [
  {
    value: 1 as const,
    label: 'Again',
    sublabel: '<1 min',
    className: 'bg-[#FF4B4B] hover:bg-[#FF5C5C] border-b-4 border-[#D63333] active:border-b-0 active:translate-y-[4px]',
  },
  {
    value: 2 as const,
    label: 'Hard',
    sublabel: '~10 min',
    className: 'bg-[#FF9600] hover:bg-[#FFA51A] border-b-4 border-[#D97706] active:border-b-0 active:translate-y-[4px]',
  },
  {
    value: 3 as const,
    label: 'Good',
    sublabel: 'Optimal',
    className: 'bg-[#58CC02] hover:bg-[#61E002] border-b-4 border-[#46A302] active:border-b-0 active:translate-y-[4px]',
  },
  {
    value: 4 as const,
    label: 'Easy',
    sublabel: 'Extended',
    className: 'bg-[#1CB0F6] hover:bg-[#28BFFF] border-b-4 border-[#1899D6] active:border-b-0 active:translate-y-[4px]',
  },
];

export function RatingButtons({ onRate, disabled }: RatingButtonsProps) {
  return (
    <motion.div
      className="grid grid-cols-4 gap-2.5 sm:gap-3.5 max-w-lg mx-auto w-full"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25, delay: 0.1 }}
    >
      {ratings.map((r) => (
        <button
          key={r.value}
          onClick={() => onRate(r.value)}
          disabled={disabled}
          className={cn(
            'flex flex-col items-center justify-center rounded-2xl py-3 px-2 text-white font-black transition-all cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:brightness-105',
            r.className
          )}
        >
          <span className="text-xs sm:text-sm tracking-wide">{r.label}</span>
          <span className="mt-0.5 text-[10px] font-bold opacity-85">{r.sublabel}</span>
        </button>
      ))}
    </motion.div>
  );
}
