import { cn } from '@/lib/utils';

const levelColors: Record<string, string> = {
  A1: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  A2: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  B1: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  B2: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'level';
  level?: string;
  className?: string;
}

export function Badge({ children, variant = 'default', level, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-medium',
        variant === 'level' && level ? levelColors[level] : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]',
        className
      )}
    >
      {children}
    </span>
  );
}
