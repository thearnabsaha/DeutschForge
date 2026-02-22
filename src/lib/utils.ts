import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Guten Morgen';
  if (hour < 18) return 'Guten Tag';
  return 'Guten Abend';
}

export function levelToNumber(level: string): number {
  const map: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4 };
  return map[level] ?? 1;
}

export function scoreToGrade(score: number, max: number): string {
  const pct = (score / max) * 100;
  if (pct >= 90) return 'Sehr gut';
  if (pct >= 75) return 'Gut';
  if (pct >= 60) return 'Befriedigend';
  if (pct >= 50) return 'Ausreichend';
  return 'Nicht bestanden';
}

export function scoreToColor(score: number, max: number): string {
  const pct = (score / max) * 100;
  if (pct >= 75) return 'text-emerald-500';
  if (pct >= 60) return 'text-amber-500';
  return 'text-red-500';
}

export const DEFAULT_USER_ID = 'default-user';
