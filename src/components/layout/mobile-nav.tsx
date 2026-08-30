'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Brain,
  BookOpen,
  LayoutGrid,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/practice', label: 'Practice', icon: Brain },
  { href: '/vocabulary', label: 'Words', icon: BookOpen },
  { href: '/settings', label: 'More', icon: LayoutGrid },
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
          const isMore = tab.label === 'More';
          const isMoreActive =
            isMore &&
            (pathname === '/settings' ||
              pathname === '/vocabulary/book' ||
              pathname.startsWith('/vocabulary/book/') ||
              pathname === '/expressions' ||
              pathname === '/grammar' ||
              pathname.startsWith('/grammar/') ||
              pathname === '/exam' ||
              pathname.startsWith('/exam/') ||
              pathname === '/progress' ||
              pathname === '/chat' ||
              pathname.startsWith('/chat/'));

          const isActive =
            pathname === tab.href ||
            (tab.href === '/practice' && pathname.startsWith('/practice')) ||
            (tab.href === '/vocabulary' && pathname === '/vocabulary') ||
            isMoreActive;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 transition-colors',
                isActive
                  ? 'text-[var(--accent)]'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              )}
            >
              <tab.icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className={cn(
                'text-[11px] font-medium leading-tight',
                isActive && 'font-black'
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
