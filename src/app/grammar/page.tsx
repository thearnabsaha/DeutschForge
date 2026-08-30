'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { ProgressRing } from '@/components/ui/progress-ring';
import {
  BookOpen,
  ChevronRight,
  Search,
  CheckCircle2,
  Circle,
  Clock,
  Zap,
  Award,
  Sparkles,
  Layers,
  GraduationCap,
  Star,
  Flame,
} from 'lucide-react';
import {
  ALL_GRAMMAR_CHAPTERS,
  GRAMMAR_CHAPTERS_BY_LEVEL,
  type GrammarChapter,
} from '@/lib/grammar-data';
import {
  loadGrammarProgress,
  loadPracticeProgress,
  toggleChapterComplete,
  computeGrammarStats,
  type GrammarProgress,
  type PracticeProgress,
} from '@/lib/grammar-progress';
import { PRACTICE_MAP } from '@/lib/grammar-practice-data';

const LEVELS = [
  { id: 'A0', label: 'A0', title: 'Grundlagen', desc: 'Pronunciation, Alphabet & Numbers', color: '#F59E0B' },
  { id: 'A1', label: 'A1', title: 'Beginner', desc: 'Pronouns, Cases, Modal Verbs & Perfekt', color: '#A855F7' },
  { id: 'A2', label: 'A2', title: 'Elementary', desc: 'Two-Way Prepositions, Reflexives & Passive', color: '#1CB0F6' },
  { id: 'B1', label: 'B1', title: 'Intermediate', desc: 'Konjunktiv II, Complex Clauses & Advanced Grammar', color: '#22C55E' },
] as const;

function getDifficultyBadge(diff?: 'easy' | 'medium' | 'hard') {
  switch (diff) {
    case 'hard':
      return <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">Hard</Badge>;
    case 'medium':
      return <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">Medium</Badge>;
    default:
      return <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">Easy</Badge>;
  }
}

export default function GrammarPage() {
  const [activeLevel, setActiveLevel] = useState<string>('A1');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'uncompleted'>('all');

  const [grammarProgress, setGrammarProgress] = useState<GrammarProgress>({ chapters: {} });
  const [practiceProgress, setPracticeProgress] = useState<PracticeProgress>({ chapters: {} });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setGrammarProgress(loadGrammarProgress());
    setPracticeProgress(loadPracticeProgress());
    setMounted(true);
  }, []);

  const stats = useMemo(() => {
    return computeGrammarStats(grammarProgress, practiceProgress);
  }, [grammarProgress, practiceProgress]);

  const levelChapters = useMemo(() => {
    return GRAMMAR_CHAPTERS_BY_LEVEL[activeLevel] || [];
  }, [activeLevel]);

  const levelCompletedCount = useMemo(() => {
    return levelChapters.filter((c) => grammarProgress.chapters[c.id]?.completedAt != null).length;
  }, [levelChapters, grammarProgress]);

  const levelPct = levelChapters.length > 0 ? Math.round((levelCompletedCount / levelChapters.length) * 100) : 0;

  const filteredChapters = useMemo(() => {
    return levelChapters.filter((ch) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        ch.title.toLowerCase().includes(q) ||
        ch.subtitle.toLowerCase().includes(q) ||
        (ch.rule && ch.rule.toLowerCase().includes(q)) ||
        (ch.tags && ch.tags.some((t) => t.toLowerCase().includes(q)));

      const matchesDiff = difficultyFilter === 'all' || (ch.difficulty || 'easy') === difficultyFilter;

      const isDone = grammarProgress.chapters[ch.id]?.completedAt != null;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'completed' && isDone) ||
        (statusFilter === 'uncompleted' && !isDone);

      return matchesSearch && matchesDiff && matchesStatus;
    });
  }, [levelChapters, searchQuery, difficultyFilter, statusFilter, grammarProgress]);

  const handleToggleComplete = (e: React.MouseEvent, chapterId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleChapterComplete(chapterId);
    setGrammarProgress(loadGrammarProgress());
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="German Grammar Masterclass"
        subtitle="64 comprehensive chapters across A0, A1, A2, and B1 with clear rules, tables, 10-level practice drills, and AI tutoring."
      />

      {/* ─── Hero Overview Bento Grid ─── */}
      <motion.div
        className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <GlassCard hover={false} className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold">{ALL_GRAMMAR_CHAPTERS.length}</p>
            <p className="text-xs text-[var(--text-tertiary)]">Total Chapters</p>
          </div>
        </GlassCard>

        <GlassCard hover={false} className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.completed} <span className="text-sm font-normal text-[var(--text-tertiary)]">/ {stats.total}</span></p>
            <p className="text-xs text-[var(--text-tertiary)]">Chapters Completed</p>
          </div>
        </GlassCard>

        <GlassCard hover={false} className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Award size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.totalPracticeLevelsPassed}</p>
            <p className="text-xs text-[var(--text-tertiary)]">Practice Levels Passed</p>
          </div>
        </GlassCard>

        <GlassCard hover={false} className="flex items-center justify-center">
          <ProgressRing
            progress={stats.completionPct}
            size={76}
            strokeWidth={6}
            color="#A855F7"
            label={`${stats.completionPct}%`}
            sublabel="Mastery"
          />
        </GlassCard>
      </motion.div>

      {/* ─── Level Navigation Tabs ─── */}
      <div className="mt-8 flex flex-wrap gap-2 sm:gap-3">
        {LEVELS.map((lvl) => {
          const isActive = activeLevel === lvl.id;
          const chapters = GRAMMAR_CHAPTERS_BY_LEVEL[lvl.id] || [];
          const done = chapters.filter((c) => grammarProgress.chapters[c.id]?.completedAt != null).length;
          const pct = chapters.length > 0 ? Math.round((done / chapters.length) * 100) : 0;

          return (
            <button
              key={lvl.id}
              onClick={() => setActiveLevel(lvl.id)}
              className={`group relative flex flex-1 min-w-[140px] items-center justify-between gap-3 rounded-2xl p-3.5 sm:p-4 text-left transition-all border ${
                isActive
                  ? 'bg-[var(--bg-secondary)] border-[var(--accent)] shadow-lg shadow-[var(--accent)]/10 ring-2 ring-[var(--accent)]/20'
                  : 'bg-[var(--bg-secondary)]/60 border-[var(--border)] hover:border-[var(--text-tertiary)]/40 hover:bg-[var(--bg-secondary)]'
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex h-6 items-center rounded-lg px-2 text-xs font-black"
                    style={{ backgroundColor: `${lvl.color}20`, color: lvl.color }}
                  >
                    {lvl.label}
                  </span>
                  <span className="font-bold text-sm text-[var(--text-primary)]">{lvl.title}</span>
                </div>
                <p className="mt-1 text-[11px] text-[var(--text-tertiary)] truncate">
                  {chapters.length} chapters · {done} done
                </p>
              </div>
              <ProgressRing
                progress={pct}
                size={34}
                strokeWidth={4}
                color={lvl.color}
                label={`${pct}%`}
              />
            </button>
          );
        })}
      </div>

      {/* ─── Search & Filters ─── */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeLevel} grammar topics, rules, or tags...`}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]/80 py-2.5 pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Difficulty Filter */}
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value as any)}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] focus:border-[var(--accent)] focus:outline-none"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] focus:border-[var(--accent)] focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="uncompleted">Incomplete</option>
          </select>
        </div>
      </div>

      {/* ─── Chapter Bento Grid ─── */}
      <div className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
            Showing {filteredChapters.length} of {levelChapters.length} {activeLevel} Chapters ({levelPct}% Completed)
          </p>
        </div>

        <AnimatePresence mode="popLayout">
          {filteredChapters.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-dashed border-[var(--border)] py-16 text-center"
            >
              <BookOpen size={40} className="mx-auto text-[var(--text-tertiary)]" />
              <p className="mt-3 text-base font-semibold">No matching grammar chapters</p>
              <p className="mt-1 text-sm text-[var(--text-tertiary)]">Try adjusting your search query or filters.</p>
            </motion.div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {filteredChapters.map((ch, idx) => {
                const isCompleted = grammarProgress.chapters[ch.id]?.completedAt != null;
                const hasPractice = !!PRACTICE_MAP[ch.id];
                const practiceLevels = practiceProgress.chapters[ch.id] || [];
                const passedCount = practiceLevels.filter((lvl) => lvl.passed).length;

                return (
                  <motion.div
                    key={ch.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: idx * 0.02 }}
                    className="h-full"
                  >
                    <Link href={`/grammar/${ch.id}`} className="group block h-full">
                      <GlassCard
                        className={`relative flex h-full flex-col justify-between p-5 transition-all group-hover:border-[var(--accent)]/50 group-hover:shadow-md ${
                          isCompleted ? 'border-emerald-500/30 bg-emerald-500/[0.03]' : ''
                        }`}
                      >
                        <div>
                          {/* Top row: Number, Difficulty, Completed toggle */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="rounded-lg bg-[var(--bg-tertiary)] px-2.5 py-1 text-xs font-bold text-[var(--text-secondary)]">
                                Ch. {ch.number}
                              </span>
                              {getDifficultyBadge(ch.difficulty)}
                              {ch.estimatedMinutes && (
                                <span className="flex items-center gap-1 text-[11px] text-[var(--text-tertiary)]">
                                  <Clock size={12} />
                                  {ch.estimatedMinutes}m
                                </span>
                              )}
                            </div>

                            {/* Mark complete toggle */}
                            <button
                              onClick={(e) => handleToggleComplete(e, ch.id)}
                              title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                              className={`rounded-full p-1.5 transition-all ${
                                isCompleted
                                  ? 'text-emerald-500 hover:bg-emerald-500/10'
                                  : 'text-[var(--text-tertiary)] hover:text-emerald-500 hover:bg-[var(--bg-tertiary)]'
                              }`}
                            >
                              {isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                            </button>
                          </div>

                          {/* Title & Subtitle */}
                          <div className="mt-3">
                            <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                              {ch.title}
                            </h3>
                            <p className="mt-1 text-xs font-medium text-[var(--text-secondary)] leading-snug">
                              {ch.subtitle}
                            </p>
                          </div>

                          {/* Rule / Key takeaway preview */}
                          {ch.rule && (
                            <div className="mt-3 rounded-xl bg-[var(--bg-tertiary)]/70 p-2.5 text-xs text-[var(--text-secondary)] line-clamp-2 border border-[var(--border)]/50">
                              <span className="font-semibold text-[var(--text-primary)]">Rule: </span>
                              {ch.rule}
                            </div>
                          )}

                          {/* Theory snippet fallback */}
                          {!ch.rule && ch.explanation && (
                            <p className="mt-2.5 text-xs text-[var(--text-tertiary)] line-clamp-2">
                              {ch.explanation}
                            </p>
                          )}
                        </div>

                        {/* Bottom Row: Practice status & Arrow */}
                        <div className="mt-4 flex items-center justify-between border-t border-[var(--border)]/60 pt-3">
                          <div className="flex items-center gap-2">
                            {hasPractice && (
                              <div className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                                <Star size={12} className="fill-amber-500 text-amber-500" />
                                <span>{passedCount}/10 Levels</span>
                              </div>
                            )}
                            <span className="text-[11px] text-[var(--text-tertiary)]">
                              {ch.examples.length} examples · {ch.exercises.length} drills
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-xs font-bold text-[var(--accent)] group-hover:translate-x-0.5 transition-transform">
                            <span>Open</span>
                            <ChevronRight size={16} />
                          </div>
                        </div>
                      </GlassCard>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
