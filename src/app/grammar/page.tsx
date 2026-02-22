'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Loader2, BookOpen, ChevronRight } from 'lucide-react';

type TopicRow = {
  id: string;
  cefrLevel: string;
  title: string;
  slug: string;
  description: string;
  bestScore: number | null;
  bestMaxScore: number | null;
  attemptCount: number;
};

type TopicsByLevel = Record<string, TopicRow[]>;

const LEVELS = ['A1', 'A2', 'B1', 'B2'] as const;

export default function GrammarPage() {
  const [topics, setTopics] = useState<TopicsByLevel>({ A1: [], A2: [], B1: [], B2: [] });
  const [activeLevel, setActiveLevel] = useState<string>('A1');
  const [loading, setLoading] = useState(true);

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/grammar');
      const data = await res.json();
      setTopics(data.topics ?? { A1: [], A2: [], B1: [], B2: [] });
    } catch {
      setTopics({ A1: [], A2: [], B1: [], B2: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const completionPct = (level: string): number => {
    const arr = topics[level] ?? [];
    if (arr.length === 0) return 0;
    const attempted = arr.filter((t) => t.attemptCount > 0).length;
    return Math.round((attempted / arr.length) * 100);
  };

  const cards = (topics[activeLevel] ?? []) as TopicRow[];

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
      <PageHeader
        title="Grammar"
        subtitle="Master German grammar by CEFR level with theory, examples, and exercises"
      />

      {/* Level tabs */}
      <motion.div
        className="mt-8 flex flex-wrap gap-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {LEVELS.map((level) => (
          <button
            key={level}
            onClick={() => setActiveLevel(level)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              activeLevel === level
                ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/25'
                : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
            }`}
          >
            <span>{level}</span>
            <ProgressRing
              progress={completionPct(level)}
              size={28}
              strokeWidth={4}
              color={activeLevel === level ? 'rgba(255,255,255,0.9)' : 'var(--accent)'}
            />
          </button>
        ))}
      </motion.div>

      {loading ? (
        <div className="mt-12 flex flex-col items-center justify-center py-24">
          <Loader2 size={36} className="animate-spin text-[var(--accent)]" />
          <p className="mt-4 text-sm text-[var(--text-secondary)]">Loading grammar topics...</p>
        </div>
      ) : (
        <motion.section
          className="mt-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-6 flex items-center gap-2">
            <span className="text-sm text-[var(--text-tertiary)]">
              {completionPct(activeLevel)}% of {activeLevel} topics attempted
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <AnimatePresence mode="wait">
              {cards.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-2 rounded-2xl border border-dashed border-[var(--border)] py-16 text-center"
                >
                  <BookOpen size={40} className="mx-auto text-[var(--text-tertiary)]" />
                  <p className="mt-4 text-sm text-[var(--text-secondary)]">
                    No grammar topics yet. Run the seed script to add content.
                  </p>
                </motion.div>
              ) : (
                cards.map((topic, idx) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link href={`/grammar/${topic.id}`}>
                      <GlassCard className="group relative flex cursor-pointer flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                                {topic.title}
                              </h3>
                              <Badge variant="level" level={topic.cefrLevel}>
                                {topic.cefrLevel}
                              </Badge>
                            </div>
                            <p className="mt-2 line-clamp-2 text-sm text-[var(--text-secondary)]">
                              {topic.description}
                            </p>
                          </div>
                          <ChevronRight
                            size={20}
                            className="flex-shrink-0 text-[var(--text-tertiary)] transition-transform group-hover:translate-x-1"
                          />
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          {topic.attemptCount > 0 && topic.bestMaxScore != null && topic.bestMaxScore > 0 && (
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                              Best: {Math.round((topic.bestScore ?? 0) / topic.bestMaxScore * 100)}%
                            </Badge>
                          )}
                          <Badge>
                            {topic.attemptCount} attempt{topic.attemptCount !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </GlassCard>
                    </Link>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      )}
    </div>
  );
}
