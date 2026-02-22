'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Settings,
  Save,
  Loader2,
  Check,
  Sun,
  Moon,
  Monitor,
  Eye,
  Download,
  Upload,
  User,
  Target,
  LogOut,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/ui/page-header';
import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';

const levels = ['A1', 'A2', 'B1', 'B2'] as const;
const themes = [
  { id: 'light' as const, label: 'Light', icon: Sun, preview: 'bg-white border border-[var(--border)]' },
  { id: 'dark' as const, label: 'Dark', icon: Moon, preview: 'bg-[#1c1c1e] border border-white/10' },
  { id: 'system' as const, label: 'System', icon: Monitor, preview: 'bg-gradient-to-r from-white to-[#1c1c1e] border border-[var(--border)]' },
];

export default function SettingsPage() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [name, setName] = useState('Learner');
  const [targetLevel, setTargetLevel] = useState('A1');
  const [themeChoice, setThemeChoice] = useState<'light' | 'dark' | 'system'>('system');
  const [focusMode, setFocusMode] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(20);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => {
        if (r.status === 401) {
          router.push('/login');
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setName(data.name || 'Learner');
        setTargetLevel(data.targetLevel || 'A1');
        setThemeChoice(data.theme || 'system');
        setFocusMode(data.focusMode ?? false);
        setDailyGoal(data.dailyGoal ?? 20);
        if (data.theme) setTheme(data.theme);
      })
      .catch(() => {});
  }, [router]);

  useEffect(() => {
    if (!mounted) return;
    if (focusMode) {
      document.body.classList.add('focus-mode');
    } else {
      document.body.classList.remove('focus-mode');
    }
    return () => document.body.classList.remove('focus-mode');
  }, [focusMode, mounted]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          targetLevel,
          theme: themeChoice,
          focusMode,
          dailyGoal,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // handle error silently
    } finally {
      setSaving(false);
    }
  };

  const handleThemeSelect = (id: 'light' | 'dark' | 'system') => {
    setThemeChoice(id);
    setTheme(id);
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: id }),
    }).catch(() => {});
  };

  const handleFocusToggle = (enabled: boolean) => {
    setFocusMode(enabled);
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ focusMode: enabled }),
    }).catch(() => {});
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch {}
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <PageHeader
        title="Settings"
        subtitle="Configure your learning experience"
        action={
          <motion.button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : saved ? (
              <Check size={16} />
            ) : (
              <Save size={16} />
            )}
            {saved ? 'Saved!' : 'Save'}
          </motion.button>
        }
      />

      <div className="mt-8 space-y-8">
        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <GlassCard hover={false}>
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <User size={18} className="text-[var(--accent)]" />
              Profile
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  Display Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field mt-2"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  Target CEFR Level
                </label>
                <div className="mt-2 flex gap-2">
                  {levels.map((l) => (
                    <motion.button
                      key={l}
                      onClick={() => setTargetLevel(l)}
                      className={cn(
                        'rounded-xl px-5 py-2.5 text-sm font-medium transition-all',
                        targetLevel === l
                          ? 'bg-[var(--accent)] text-white shadow-md'
                          : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-black/[0.04] dark:hover:bg-white/[0.04]'
                      )}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {l}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Theme */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <GlassCard hover={false}>
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <Sun size={18} className="text-[var(--accent)]" />
              Theme
            </h2>

            <div className="mt-6 grid grid-cols-3 gap-4">
              {themes.map((t) => {
                const Icon = t.icon;
                const isActive = themeChoice === t.id;
                return (
                  <motion.button
                    key={t.id}
                    onClick={() => handleThemeSelect(t.id)}
                    className={cn(
                      'flex flex-col items-center gap-3 rounded-2xl border-2 p-4 transition-all',
                      isActive
                        ? 'border-[var(--accent)] bg-[var(--accent)]/5'
                        : 'border-[var(--border)] hover:border-[var(--accent)]/50'
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className={cn('h-12 w-full rounded-xl', t.preview)}
                      aria-hidden
                    />
                    <div className="flex items-center gap-2">
                      <Icon size={18} className={isActive ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'} />
                      <span className="text-sm font-medium">{t.label}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between rounded-2xl border border-[var(--border)] p-4">
              <div className="flex items-center gap-3">
                <Eye size={20} className="text-[var(--text-tertiary)]" />
                <div>
                  <p className="text-sm font-medium">Focus Mode</p>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    Clean exam-style interface, minimal distractions
                  </p>
                </div>
              </div>
              <motion.button
                onClick={() => handleFocusToggle(!focusMode)}
                className={cn(
                  'relative h-8 w-14 rounded-full transition-colors',
                  focusMode ? 'bg-[var(--accent)]' : 'bg-[var(--bg-tertiary)]'
                )}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="absolute top-1 h-6 w-6 rounded-full bg-white shadow"
                  animate={{ x: focusMode ? 24 : 2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  style={{ left: 0 }}
                />
              </motion.button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Daily Goal */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <GlassCard hover={false}>
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <Target size={18} className="text-[var(--accent)]" />
              Daily Goal
            </h2>
            <p className="mt-1 text-xs text-[var(--text-tertiary)]">
              Target number of reviews per day
            </p>
            <div className="mt-4 flex items-center gap-4">
              <input
                type="range"
                min={5}
                max={100}
                step={5}
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="h-2 flex-1 appearance-none rounded-full bg-[var(--bg-tertiary)] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent)]"
              />
              <input
                type="number"
                min={5}
                max={200}
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Math.min(200, Math.max(5, Number(e.target.value) || 20)))}
                className="input-field w-20 text-center"
              />
            </div>
            <p className="mt-2 text-xs text-[var(--text-tertiary)]">{dailyGoal} reviews/day</p>
          </GlassCard>
        </motion.div>

        {/* Data */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <GlassCard hover={false}>
            <h2 className="text-base font-semibold">Data</h2>
            <p className="mt-1 text-xs text-[var(--text-tertiary)]">
              Export or import your vocabulary and progress
            </p>
            <div className="mt-4 flex gap-3">
              <motion.button
                className="btn-secondary flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {}}
              >
                <Download size={16} />
                Export
              </motion.button>
              <motion.button
                className="btn-secondary flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {}}
              >
                <Upload size={16} />
                Import
              </motion.button>
            </div>
            <p className="mt-2 text-[11px] text-[var(--text-tertiary)]">
              Placeholder — functionality coming soon
            </p>
          </GlassCard>
        </motion.div>

        {/* Account */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <GlassCard hover={false}>
            <h2 className="text-base font-semibold">Account</h2>
            <p className="mt-1 text-xs text-[var(--text-tertiary)]">
              Sign out of your account
            </p>
            <motion.button
              onClick={handleLogout}
              className="mt-4 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--danger)] transition-colors hover:bg-[var(--danger)]/10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut size={16} />
              Log Out
            </motion.button>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
