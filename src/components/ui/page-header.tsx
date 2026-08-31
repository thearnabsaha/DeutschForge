'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <motion.div
      className="flex items-start justify-between gap-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm font-medium text-[var(--text-secondary)]">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0 flex items-center">{action}</div>}
    </motion.div>
  );
}
