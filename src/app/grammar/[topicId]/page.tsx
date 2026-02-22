'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import {
  Loader2,
  BookOpen,
  Lightbulb,
  PenLine,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import { sfx } from '@/lib/sounds';

type Example = { german: string; english: string; note?: string };

type Exercise = {
  id: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
};

type Topic = {
  id: string;
  cefrLevel: string;
  title: string;
  slug: string;
  description: string;
  theory: string;
  examples: Example[];
  exercises: Exercise[];
};

type ResultItem = {
  exerciseId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  correct: boolean;
  explanation: string;
};

const TABS = [
  { id: 'theory', label: 'Theory', icon: BookOpen },
  { id: 'examples', label: 'Examples', icon: Lightbulb },
  { id: 'practice', label: 'Practice', icon: PenLine },
] as const;

function renderTheory(text: string) {
  const paragraphs = text.split(/\n\n+/);
  return paragraphs.map((p, i) => {
    const parts: React.ReactNode[] = [];
    let remaining = p;
    let key = 0;
    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      if (boldMatch) {
        const idx = remaining.indexOf(boldMatch[0]);
        if (idx > 0) {
          parts.push(<span key={key++}>{remaining.slice(0, idx)}</span>);
        }
        parts.push(<strong key={key++} className="font-semibold">{boldMatch[1]}</strong>);
        remaining = remaining.slice(idx + boldMatch[0].length);
      } else {
        parts.push(<span key={key++}>{remaining}</span>);
        break;
      }
    }
    return (
      <p key={i} className="mb-4 leading-relaxed text-[var(--text-primary)]">
        {parts}
      </p>
    );
  });
}

export default function GrammarTopicPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topicId as string;

  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]['id']>('theory');

  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<{ score: number; maxScore: number; results: ResultItem[] } | null>(null);

  const fetchTopic = useCallback(async () => {
    if (!topicId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/grammar/${topicId}`);
      const data = await res.json();
      if (res.ok) setTopic(data);
      else setTopic(null);
    } catch {
      setTopic(null);
    } finally {
      setLoading(false);
    }
  }, [topicId]);

  useEffect(() => {
    fetchTopic();
  }, [fetchTopic]);

  const exercises = topic?.exercises ?? [];
  const currentExercise = exercises[currentExerciseIdx];
  const progress = exercises.length > 0 ? ((currentExerciseIdx + 1) / exercises.length) * 100 : 0;

  const handleAnswerChange = (value: string) => {
    if (currentExercise) {
      sfx.click();
      setAnswers((prev) => ({ ...prev, [currentExercise.id]: value }));
    }
  };

  const handleNext = () => {
    if (currentExerciseIdx < exercises.length - 1) {
      sfx.swoosh();
      setCurrentExerciseIdx((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentExerciseIdx > 0) setCurrentExerciseIdx((i) => i - 1);
  };

  const handleSubmit = async () => {
    if (!topic || exercises.length === 0) return;
    const answerList = exercises.map((e) => ({
      exerciseId: e.id,
      userAnswer: answers[e.id] ?? '',
    }));
    setSubmitting(true);
    try {
      const res = await fetch(`/api/grammar/${topicId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answerList }),
      });
      const data = await res.json();
      if (res.ok) {
        setResults({ score: data.score, maxScore: data.maxScore, results: data.results });
        const pct = data.maxScore > 0 ? data.score / data.maxScore : 0;
        pct >= 0.7 ? sfx.levelUp() : sfx.wrong();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleTryAgain = () => {
    setResults(null);
    setCurrentExerciseIdx(0);
    setAnswers({});
  };

  const canSubmit = exercises.every((e) => (answers[e.id] ?? '').trim() !== '');

  if (loading || !topic) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 size={36} className="animate-spin text-[var(--accent)]" />
          <p className="mt-4 text-sm text-[var(--text-secondary)]">
            {loading ? 'Loading...' : 'Topic not found'}
          </p>
          {!loading && !topic && (
            <Link href="/grammar" className="btn-primary mt-6">
              Back to Grammar
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
      <div className="mb-8">
        <Link
          href="/grammar"
          className="mb-4 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]"
        >
          <ArrowLeft size={16} />
          Back to Grammar
        </Link>
        <PageHeader
          title={topic.title}
          subtitle={topic.description}
        />
        <div className="mt-2 flex gap-2">
          <Badge variant="level" level={topic.cefrLevel}>
            {topic.cefrLevel}
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'theory' && (
          <motion.div
            key="theory"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <GlassCard hover={false} className="prose prose-invert max-w-none">
              {renderTheory(topic.theory)}
            </GlassCard>
          </motion.div>
        )}

        {activeTab === 'examples' && (
          <motion.div
            key="examples"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {(topic.examples ?? []).map((ex, i) => (
              <GlassCard key={i} hover={false}>
                <p className="text-lg font-medium text-[var(--text-primary)]">{ex.german}</p>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{ex.english}</p>
                {ex.note && (
                  <p className="mt-2 text-sm italic text-[var(--text-tertiary)]">{ex.note}</p>
                )}
              </GlassCard>
            ))}
            {(!topic.examples || topic.examples.length === 0) && (
              <GlassCard hover={false}>
                <p className="text-sm text-[var(--text-tertiary)]">No examples for this topic yet.</p>
              </GlassCard>
            )}
          </motion.div>
        )}

        {activeTab === 'practice' && (
          <motion.div
            key="practice"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {results ? (
              <div className="space-y-6">
                <GlassCard hover={false} className="text-center">
                  <h3 className="text-lg font-semibold">Your Score</h3>
                  <p className="mt-2 text-4xl font-bold text-[var(--accent)]">
                    {results.score} / {results.maxScore}
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {Math.round((results.score / results.maxScore) * 100)}%
                  </p>
                  <motion.button
                    className="btn-primary mt-6 flex items-center gap-2"
                    onClick={handleTryAgain}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RotateCcw size={18} />
                    Try Again
                  </motion.button>
                </GlassCard>

                <div className="space-y-4">
                  <h4 className="text-base font-semibold">Review Answers</h4>
                  {results.results.map((r, i) => (
                    <GlassCard key={i} hover={false}>
                      <p className="font-medium text-[var(--text-primary)]">{r.question}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {r.correct ? (
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <CheckCircle2 size={14} className="mr-1 inline" />
                            Correct
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                            <XCircle size={14} className="mr-1 inline" />
                            Incorrect
                          </Badge>
                        )}
                      </div>
                      {!r.correct && (
                        <>
                          <p className="mt-2 text-sm">
                            <span className="text-[var(--text-tertiary)]">Your answer:</span>{' '}
                            <span className="text-red-500">{r.userAnswer || '(empty)'}</span>
                          </p>
                          <p className="mt-1 text-sm">
                            <span className="text-[var(--text-tertiary)]">Correct answer:</span>{' '}
                            <span className="text-emerald-600 dark:text-emerald-400">{r.correctAnswer}</span>
                          </p>
                        </>
                      )}
                      <p className="mt-2 text-sm text-[var(--text-secondary)]">{r.explanation}</p>
                    </GlassCard>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
                  <motion.div
                    className="h-full bg-[var(--accent)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {currentExercise ? (
                  <GlassCard hover={false}>
                    <p className="mb-4 text-base font-medium text-[var(--text-primary)]">
                      {currentExercise.question}
                    </p>
                    {currentExercise.type === 'multiple_choice' ? (
                      <div className="space-y-2">
                        {(currentExercise.options ?? []).map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleAnswerChange(opt)}
                            className={`block w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                              (answers[currentExercise.id] ?? '') === opt
                                ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                                : 'border-[var(--border)] hover:bg-[var(--bg-tertiary)]'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={answers[currentExercise.id] ?? ''}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        placeholder="Type your answer..."
                        className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                      />
                    )}
                    <div className="mt-6 flex items-center justify-between">
                      <button
                        onClick={handlePrev}
                        disabled={currentExerciseIdx === 0}
                        className=" rounded-lg px-4 py-2 text-sm font-medium text-[var(--text-secondary)] disabled:opacity-50 hover:bg-[var(--bg-tertiary)]"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-[var(--text-tertiary)]">
                        {currentExerciseIdx + 1} / {exercises.length}
                      </span>
                      {currentExerciseIdx < exercises.length - 1 ? (
                        <button
                          onClick={handleNext}
                          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
                        >
                          Next
                        </button>
                      ) : (
                        <motion.button
                          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                          disabled={!canSubmit || submitting}
                          onClick={handleSubmit}
                          whileHover={!submitting && canSubmit ? { scale: 1.02 } : undefined}
                          whileTap={!submitting && canSubmit ? { scale: 0.98 } : undefined}
                        >
                          {submitting ? (
                            <>
                              <Loader2 size={16} className="mr-2 inline animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            'Submit'
                          )}
                        </motion.button>
                      )}
                    </div>
                  </GlassCard>
                ) : (
                  <GlassCard hover={false}>
                    <p className="text-[var(--text-tertiary)]">No exercises for this topic.</p>
                  </GlassCard>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
