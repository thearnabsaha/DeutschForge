'use client';

import { useEffect, useState } from 'react';
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
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const vv = window.visualViewport;
    if (vv) {
      const threshold = 150;
      const onResize = () => {
        const heightDiff = window.innerHeight - vv.height;
        setKeyboardOpen(heightDiff > threshold);
      };
      vv.addEventListener('resize', onResize);
      return () => vv.removeEventListener('resize', onResize);
    }

    const onFocus = (e: FocusEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) {
        setKeyboardOpen(true);
      }
    };
    const onBlur = () => setKeyboardOpen(false);

    document.addEventListener('focusin', onFocus);
    document.addEventListener('focusout', onBlur);
    return () => {
      document.removeEventListener('focusin', onFocus);
      document.removeEventListener('focusout', onBlur);
    };
  }, []);

  const isHidden =
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/signup' ||
    (pathname.includes('/exam/') && pathname !== '/exam' && !pathname.startsWith('/exam/history'));

  if (isHidden || keyboardOpen) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[var(--bg-primary)]/95 backdrop-blur-xl lg:hidden"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        transform: 'translate3d(0,0,0)',
      }}
    >
      <div className="mx-auto flex h-14 max-w-lg items-stretch justify-around">
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
