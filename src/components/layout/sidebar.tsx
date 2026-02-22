'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Brain,
  GraduationCap,
  BarChart3,
  Settings,
  Sun,
  Moon,
  Menu,
  X,
  Flame,
  BookOpen,
  MessageCircle,
  BookMarked,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/practice', label: 'Practice', icon: Brain },
  { href: '/chat', label: 'Chat', icon: MessageCircle },
  { href: '/vocabulary', label: 'Vocabulary', icon: BookOpen },
  { href: '/grammar', label: 'Grammar', icon: BookMarked },
  { href: '/exam', label: 'Exam', icon: GraduationCap },
  { href: '/progress', label: 'Progress', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isExamActive = pathname.includes('/exam/') && pathname !== '/exam';

  if (isExamActive) return null;

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed left-4 top-4 z-50 rounded-xl p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5 lg:hidden"
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen w-[260px] flex-col border-r py-6 lg:relative',
          'glass-subtle',
          'border-r-[var(--border)]'
        )}
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -260,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center gap-3 px-6 pb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)]">
            <Flame size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight">DeutschForge</h1>
            <p className="text-[11px] text-[var(--text-tertiary)]">Cognitive Mastery</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={cn(
                    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[var(--accent)] text-white'
                      : 'text-[var(--text-secondary)] hover:bg-black/[0.04] hover:text-[var(--text-primary)] dark:hover:bg-white/[0.04]'
                  )}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon
                    size={18}
                    className={cn(
                      'transition-colors',
                      isActive ? 'text-white' : 'text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]'
                    )}
                  />
                  {item.label}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-2 px-3">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          )}

          <div className="mx-3 border-t border-[var(--border)] pt-3">
            <p className="text-[11px] text-[var(--text-tertiary)]">
              CEFR Target: A1 → B2
            </p>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
