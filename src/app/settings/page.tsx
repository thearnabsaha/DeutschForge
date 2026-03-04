'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Save,
  Loader2,
  Check,
  Sun,
  Moon,
  Monitor,
  Eye,
  Palette,
  Contrast,
  User,
  Target,
  LogOut,
  AlertTriangle,
  Trash2,
  RotateCcw,
  Volume2,
  VolumeX,
  Snowflake,
  Flame,
  Smartphone,
  Sparkles,
  TreePine,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/ui/page-header';
import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { setMuted, isMuted } from '@/lib/sounds';

const levels = ['A1', 'A2', 'B1', 'B2'] as const;
type ThemeId = 'light' | 'dark' | 'system' | 'high-contrast' | 'minimal' | 'colorful' | 'dark-nord' | 'dark-warm' | 'amoled' | 'dark-duo' | 'dark-purple';

const themes: Array<{
  id: ThemeId;
  label: string;
  icon: typeof Sun;
  preview: string;
  group: 'light' | 'dark';
}> = [
  { id: 'system', label: 'System', icon: Monitor, preview: 'bg-gradient-to-r from-white to-[#1c1c1e] border border-[var(--border)]', group: 'light' },
  { id: 'light', label: 'Light', icon: Sun, preview: 'bg-white border border-[var(--border)]', group: 'light' },
  { id: 'high-contrast', label: 'High Contrast', icon: Contrast, preview: 'bg-white border-2 border-black', group: 'light' },
  { id: 'minimal', label: 'Minimal', icon: Eye, preview: 'bg-[#fafafa] border border-gray-200', group: 'light' },
  { id: 'colorful', label: 'Colorful', icon: Palette, preview: 'bg-[#f0faf0] border-2 border-[#58cc02]', group: 'light' },
  { id: 'dark', label: 'Dark', icon: Moon, preview: 'bg-[#1c1c1e] border border-white/10', group: 'dark' },
  { id: 'dark-nord', label: 'Nord', icon: Snowflake, preview: 'bg-[#2e3440] border border-[#88c0d0]/30', group: 'dark' },
  { id: 'dark-warm', label: 'Warm', icon: Flame, preview: 'bg-[#1a1412] border border-[#e8a44a]/20', group: 'dark' },
  { id: 'amoled', label: 'AMOLED', icon: Smartphone, preview: 'bg-black border border-white/5', group: 'dark' },
  { id: 'dark-duo', label: 'Duolingo', icon: TreePine, preview: 'bg-[#131f24] border border-[#58cc02]/20', group: 'dark' },
  { id: 'dark-purple', label: 'Purple', icon: Sparkles, preview: 'bg-[#13111c] border border-[#a78bfa]/20', group: 'dark' },
];

type ResetType = 'vocabulary' | 'progress' | 'hard';

const resetConfig: Record<ResetType, { title: string; description: string; color: string; icon: typeof Trash2 }> = {
  vocabulary: {
    title: 'Reset Vocabulary',
    description: 'Deletes all uploaded words and batches. Keeps account and progress.',
    color: 'text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 border-amber-500/30',
    icon: Trash2,
  },
  progress: {
    title: 'Reset Progress',
    description: 'Clears review logs, exam history, XP, and analytics. Keeps vocabulary.',
    color: 'text-orange-600 dark:text-orange-400 hover:bg-orange-500/10 border-orange-500/30',
    icon: RotateCcw,
  },
  hard: {
    title: 'Hard Reset',
    description: 'Deletes vocabulary, progress, exams, analytics, and word batches. Account remains.',
    color: 'text-red-600 dark:text-red-400 hover:bg-red-500/10 border-red-500/30',
    icon: AlertTriangle,
  },
};

export default function SettingsPage() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [name, setName] = useState('Learner');
  const [targetLevel, setTargetLevel] = useState('A1');
  const [themeChoice, setThemeChoice] = useState<ThemeId>('system');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [dailyGoal, setDailyGoal] = useState(20);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [resetModal, setResetModal] = useState<ResetType | null>(null);
  const [resetInput, setResetInput] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

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
        setSoundEnabled(data.soundEnabled ?? true);
        setDailyGoal(data.dailyGoal ?? 20);
        if (data.theme) setTheme(data.theme);
        setMuted(!(data.soundEnabled ?? true));
      })
      .catch(() => {});
  }, [router, setTheme]);

  useEffect(() => {
    if (!mounted) return;
    setSoundEnabled(!isMuted());
  }, [mounted]);

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
          dailyGoal,
          soundEnabled,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleThemeSelect = (id: ThemeId) => {
    setThemeChoice(id);
    setTheme(id);
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: id }),
    }).catch(() => {});
  };

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    setMuted(!enabled);
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ soundEnabled: enabled }),
    }).catch(() => {});
  };

  const handleResetConfirm = async (type: ResetType) => {
    if (resetInput !== 'RESET') return;
    setResetLoading(true);
    try {
      const res = await fetch('/api/settings/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, confirmation: 'RESET' }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Reset failed');
        return;
      }
      toast.success('Reset completed successfully');
      setResetModal(null);
      setResetInput('');
      window.location.reload();
    } catch {
      toast.error('Reset failed');
    } finally {
      setResetLoading(false);
    }
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

            <div className="mt-6 space-y-6">
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)]">Light</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {themes.filter((t) => t.group === 'light').map((t) => {
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
                        <div className={cn('h-10 w-full rounded-xl', t.preview)} aria-hidden />
                        <div className="flex items-center gap-2">
                          <Icon size={16} className={isActive ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'} />
                          <span className="text-xs font-medium">{t.label}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)]">Dark</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {themes.filter((t) => t.group === 'dark').map((t) => {
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
                        <div className={cn('h-10 w-full rounded-xl', t.preview)} aria-hidden />
                        <div className="flex items-center gap-2">
                          <Icon size={16} className={isActive ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'} />
                          <span className="text-xs font-medium">{t.label}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Sound Effects */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.06 }}
        >
          <GlassCard hover={false}>
            <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] p-4">
              <div className="flex items-center gap-3">
                {soundEnabled ? (
                  <Volume2 size={20} className="text-[var(--text-tertiary)]" />
                ) : (
                  <VolumeX size={20} className="text-[var(--text-tertiary)]" />
                )}
                <div>
                  <p className="text-sm font-medium">Sound Effects</p>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    Correct, incorrect, and completion sounds
                  </p>
                </div>
              </div>
              <motion.button
                onClick={() => handleSoundToggle(!soundEnabled)}
                className={cn(
                  'relative h-8 w-14 rounded-full transition-colors',
                  soundEnabled ? 'bg-[var(--accent)]' : 'bg-[var(--bg-tertiary)]'
                )}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="absolute top-1 h-6 w-6 rounded-full bg-white shadow"
                  animate={{ x: soundEnabled ? 24 : 2 }}
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

        {/* Reset System */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <GlassCard hover={false}>
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <AlertTriangle size={18} className="text-[var(--danger)]" />
              Reset System
            </h2>
            <p className="mt-1 text-xs text-[var(--text-tertiary)]">
              Irreversible actions. Confirm carefully.
            </p>
            <div className="mt-4 space-y-3">
              {(Object.keys(resetConfig) as ResetType[]).map((type) => {
                const config = resetConfig[type];
                const Icon = config.icon;
                return (
                  <motion.button
                    key={type}
                    onClick={() => setResetModal(type)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors',
                      config.color
                    )}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Icon size={20} />
                    <div>
                      <p className="font-medium">{config.title}</p>
                      <p className="text-xs opacity-90">{config.description}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
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

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {resetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => !resetLoading && setResetModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-[var(--bg-primary)] p-6 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[var(--danger)]/20 p-3">
                  <AlertTriangle size={24} className="text-[var(--danger)]" />
                </div>
                <h3 className="text-lg font-semibold">Confirm {resetConfig[resetModal].title}</h3>
              </div>
              <p className="mt-4 text-sm text-[var(--text-secondary)]">
                {resetConfig[resetModal].description}
              </p>
              <p className="mt-4 text-sm font-medium text-[var(--text-secondary)]">
                Type <span className="font-mono font-bold text-[var(--danger)]">RESET</span> to confirm:
              </p>
              <input
                type="text"
                value={resetInput}
                onChange={(e) => setResetInput(e.target.value)}
                placeholder="RESET"
                className="input-field mt-2 w-full"
                disabled={resetLoading}
              />
              <div className="mt-6 flex gap-3">
                <motion.button
                  onClick={() => setResetModal(null)}
                  disabled={resetLoading}
                  className="btn-secondary flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={() => handleResetConfirm(resetModal)}
                  disabled={resetInput !== 'RESET' || resetLoading}
                  className="btn-primary flex-1 bg-[var(--danger)] hover:bg-[var(--danger)]/90 disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {resetLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    'Confirm'
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
