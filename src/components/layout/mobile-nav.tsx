'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Brain,
  BookOpen,
  GraduationCap,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/practice', label: 'Practice', icon: Brain },
  { href: '/vocabulary', label: 'Words', icon: BookOpen },
  { href: '/exam', label: 'Exam', icon: GraduationCap },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  const isHidden =
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/signup' ||
    (pathname.includes('/exam/') && pathname !== '/exam' && !pathname.startsWith('/exam/history'));

  if (isHidden) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="mx-auto flex h-16 max-w-lg items-stretch justify-around">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors',
                isActive
                  ? 'text-[var(--accent)]'
                  : 'text-[var(--text-tertiary)]'
              )}
            >
              <tab.icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
              <span className={cn(
                'text-[10px] font-medium leading-tight',
                isActive && 'font-semibold'
              )}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
