'use client';

import { motion } from 'framer-motion';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
  className?: string;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = 'var(--accent)',
  label,
  sublabel,
  className = '',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(Math.max(progress, 0), 100) / 100) * circumference;

  // Scaled typography based on size to ensure text fits inside the circle without clipping
  const getTypography = () => {
    if (size <= 32) {
      return {
        labelStyle: { fontSize: '9px', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.05em' },
        hasSublabel: false,
      };
    }
    if (size <= 44) {
      return {
        labelStyle: { fontSize: '11px', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' },
        hasSublabel: false,
      };
    }
    if (size <= 72) {
      return {
        labelStyle: { fontSize: sublabel ? '13px' : '15px', fontWeight: 800, lineHeight: 1 },
        sublabelStyle: { fontSize: '9px', fontWeight: 600, lineHeight: 1, marginTop: '2px' },
        hasSublabel: !!sublabel,
      };
    }
    if (size <= 95) {
      return {
        labelStyle: { fontSize: sublabel ? '16px' : '18px', fontWeight: 800, lineHeight: 1 },
        sublabelStyle: { fontSize: '10px', fontWeight: 600, lineHeight: 1, marginTop: '3px' },
        hasSublabel: !!sublabel,
      };
    }
    return {
      labelStyle: { fontSize: sublabel ? '22px' : '26px', fontWeight: 900, lineHeight: 1 },
      sublabelStyle: { fontSize: '11px', fontWeight: 600, lineHeight: 1, marginTop: '4px' },
      hasSublabel: !!sublabel,
    };
  };

  const typo = getTypography();

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center px-1">
        {label && (
          <span
            style={typo.labelStyle}
            className="text-[var(--text-primary)] tabular-nums"
          >
            {label}
          </span>
        )}
        {typo.hasSublabel && sublabel && (
          <span
            style={typo.sublabelStyle}
            className="text-[var(--text-tertiary)] uppercase tracking-wider"
          >
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
