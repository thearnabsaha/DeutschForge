'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';

interface ReviewSection {
  section: string;
  score: number | null;
  maxScore: number;
  answers: unknown;
  feedback: unknown;
  questionSnapshot: unknown;
  timeSpent: number | null;
  completedAt: string | null;
}

interface ReviewData {
  attempt: {
    id: string;
    cefrLevel: string;
    status: string;
    startedAt: string;
    completedAt: string | null;
  };
  template: { id: string; title: string; cefrLevel: string } | null;
  sections: ReviewSection[];
  summary: {
    totalScore: number;
    maxScore: number;
    percentage: number;
    totalTimeSpent: number;
    weakAreas: string[];
  };
}

const SECTION_ORDER = ['Lesen', 'Hören', 'Schreiben', 'Sprechen'];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function scoreColor(pct: number): string {
  if (pct >= 75) return 'text-emerald-500';
  if (pct >= 60) return 'text-amber-500';
  return 'text-red-500';
}

function barColor(pct: number): string {
  if (pct >= 75) return 'bg-emerald-500';
  if (pct >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}

export default function ExamReviewPage() {
  const params = useParams();
  const attemptId = params.attemptId as string;
  const [data, setData] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('Lesen');

  useEffect(() => {
    if (!attemptId) return;
    fetch(`/api/exam/${attemptId}/review`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) {
          setData(d);
          if (d.sections?.length > 0) {
            setActiveSection(d.sections[0].section);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [attemptId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 size={36} className="animate-spin text-[var(--accent)]" />
        <p className="mt-4 text-sm text-[var(--text-secondary)]">Loading exam review...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10 text-center">
        <p className="text-lg text-[var(--text-secondary)]">Exam review not found.</p>
        <Link href="/exam" className="btn-primary mt-6 inline-flex">
          Back to Exams
        </Link>
      </div>
    );
  }

  const currentSection = data.sections.find((s) => s.section === activeSection);
  const availableSections = data.sections.map((s) => s.section);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <Link
        href="/exam"
        className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]"
      >
        <ArrowLeft size={16} />
        Back to Exams
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <GlassCard hover={false}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold">
                {data.template?.title ?? 'Exam Review'}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="level" level={data.attempt.cefrLevel}>
                  {data.attempt.cefrLevel}
                </Badge>
                <span className="text-sm text-[var(--text-tertiary)]">
                  {new Date(data.attempt.startedAt).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-3xl font-bold ${scoreColor(data.summary.percentage)}`}>
                {data.summary.percentage}%
              </p>
              <p className="text-sm text-[var(--text-tertiary)]">
                {data.summary.totalScore} / {data.summary.maxScore}
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Score Bars */}
      <motion.div
        className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {data.sections.map((s) => {
          const pct = s.maxScore > 0 ? Math.round(((s.score ?? 0) / s.maxScore) * 100) : 0;
          return (
            <GlassCard key={s.section} hover={false} className="text-center">
              <p className="text-sm font-medium text-[var(--text-secondary)]">{s.section}</p>
              <p className={`mt-1 text-2xl font-bold ${scoreColor(pct)}`}>{pct}%</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                <motion.div
                  className={`h-full ${barColor(pct)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              {s.timeSpent != null && (
                <p className="mt-2 flex items-center justify-center gap-1 text-xs text-[var(--text-tertiary)]">
                  <Clock size={12} /> {formatTime(s.timeSpent)}
                </p>
              )}
            </GlassCard>
          );
        })}
      </motion.div>

      {/* Weak Areas */}
      {data.summary.weakAreas.length > 0 && (
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard hover={false} className="border-l-4 border-l-amber-500">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-500" />
              <div>
                <p className="font-medium">Weak Areas</p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Focus on: {data.summary.weakAreas.join(', ')}
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Section Tabs */}
      <div className="mt-8 flex flex-wrap gap-2">
        {availableSections.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              activeSection === s
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Section Detail */}
      <AnimatePresence mode="wait">
        {currentSection && (
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-6 space-y-4"
          >
            {(activeSection === 'Lesen' || activeSection === 'Hören') &&
              renderQuizReview(currentSection)}
            {activeSection === 'Schreiben' && renderWritingReview(currentSection)}
            {activeSection === 'Sprechen' && renderSpeakingReview(currentSection)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function renderQuizReview(section: ReviewSection) {
  const feedback = section.feedback as { results?: Array<{
    question: string;
    options?: string[];
    userAnswer: string;
    correctAnswer: string;
    correct: boolean;
    explanation: string;
  }> } | null;

  const results = feedback?.results ?? [];

  if (results.length === 0) {
    return (
      <GlassCard hover={false}>
        <p className="text-sm text-[var(--text-tertiary)]">No detailed review available for this section.</p>
      </GlassCard>
    );
  }

  return (
    <>
      {results.map((r, i) => (
        <GlassCard key={i} hover={false}>
          <div className="flex items-start gap-3">
            {r.correct ? (
              <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-500" />
            ) : (
              <XCircle size={20} className="mt-0.5 shrink-0 text-red-500" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[var(--text-primary)]">
                {i + 1}. {r.question}
              </p>
              {r.options && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {r.options.map((opt) => (
                    <span
                      key={opt}
                      className={`rounded-lg px-3 py-1 text-xs ${
                        opt === r.correctAnswer
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : opt === r.userAnswer && !r.correct
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'
                      }`}
                    >
                      {opt}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-3 space-y-1 text-sm">
                <p>
                  <span className="text-[var(--text-tertiary)]">Your answer: </span>
                  <span className={r.correct ? 'text-emerald-600' : 'text-red-600'}>
                    {r.userAnswer || '(no answer)'}
                  </span>
                </p>
                {!r.correct && (
                  <p>
                    <span className="text-[var(--text-tertiary)]">Correct: </span>
                    <span className="text-emerald-600 dark:text-emerald-400">{r.correctAnswer}</span>
                  </p>
                )}
                <p className="text-[var(--text-secondary)]">{r.explanation}</p>
              </div>
            </div>
          </div>
        </GlassCard>
      ))}
    </>
  );
}

function renderWritingReview(section: ReviewSection) {
  const feedback = section.feedback as {
    taskAchievement?: { score: number; feedback: string };
    coherence?: { score: number; feedback: string };
    vocabulary?: { score: number; feedback: string };
    grammar?: { score: number; feedback: string };
    overallFeedback?: string;
    corrections?: Array<{ original: string; corrected: string; explanation: string }>;
    error?: string;
  } | null;

  const answers = section.answers as { text?: string } | string | null;
  const userText = typeof answers === 'string' ? answers : answers?.text ?? '';

  const snapshot = section.questionSnapshot as { prompt?: string } | null;

  return (
    <>
      {snapshot?.prompt && (
        <GlassCard hover={false}>
          <p className="text-sm font-medium text-[var(--text-tertiary)]">Prompt</p>
          <p className="mt-2 text-[var(--text-primary)]">{snapshot.prompt}</p>
        </GlassCard>
      )}
      <GlassCard hover={false}>
        <p className="text-sm font-medium text-[var(--text-tertiary)]">Your Response</p>
        <p className="mt-2 whitespace-pre-wrap text-[var(--text-primary)]">{userText || '(empty)'}</p>
      </GlassCard>
      {feedback && !feedback.error && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {(['taskAchievement', 'coherence', 'vocabulary', 'grammar'] as const).map((key) => {
              const data = feedback[key];
              if (!data) return null;
              const labels: Record<string, string> = {
                taskAchievement: 'Task Achievement',
                coherence: 'Coherence',
                vocabulary: 'Vocabulary',
                grammar: 'Grammar',
              };
              return (
                <GlassCard key={key} hover={false}>
                  <p className="text-sm font-medium">{labels[key]}</p>
                  <p className="mt-1 text-2xl font-bold text-[var(--accent)]">{data.score}/25</p>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">{data.feedback}</p>
                </GlassCard>
              );
            })}
          </div>
          {feedback.overallFeedback && (
            <GlassCard hover={false}>
              <p className="text-sm font-medium">Overall Feedback</p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{feedback.overallFeedback}</p>
            </GlassCard>
          )}
          {feedback.corrections && feedback.corrections.length > 0 && (
            <GlassCard hover={false}>
              <p className="text-sm font-medium">Corrections</p>
              <div className="mt-3 space-y-3">
                {feedback.corrections.map((c, i) => (
                  <div key={i} className="rounded-lg bg-[var(--bg-tertiary)] p-3 text-sm">
                    <p>
                      <span className="text-red-500 line-through">{c.original}</span>
                      {' → '}
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">{c.corrected}</span>
                    </p>
                    <p className="mt-1 text-[var(--text-tertiary)]">{c.explanation}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </>
      )}
      {feedback?.error && (
        <GlassCard hover={false}>
          <p className="text-sm text-amber-600">{feedback.error}</p>
        </GlassCard>
      )}
    </>
  );
}

function renderSpeakingReview(section: ReviewSection) {
  const feedback = section.feedback as {
    conversation?: Array<{ role: string; content: string }>;
    feedback?: string;
  } | null;

  return (
    <>
      {feedback?.conversation && feedback.conversation.length > 0 && (
        <GlassCard hover={false}>
          <p className="text-sm font-medium">Conversation Transcript</p>
          <div className="mt-3 space-y-3">
            {feedback.conversation.map((msg, i) => (
              <div
                key={i}
                className={`rounded-lg p-3 text-sm ${
                  msg.role === 'examiner' || msg.role === 'assistant'
                    ? 'bg-[var(--bg-tertiary)]'
                    : 'ml-8 bg-[var(--accent)]/10'
                }`}
              >
                <p className="text-xs font-medium text-[var(--text-tertiary)]">
                  {msg.role === 'examiner' || msg.role === 'assistant' ? 'Examiner' : 'You'}
                </p>
                <p className="mt-1">{msg.content}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
      {feedback?.feedback && (
        <GlassCard hover={false}>
          <p className="text-sm font-medium">Feedback</p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">{feedback.feedback}</p>
        </GlassCard>
      )}
      {(!feedback?.conversation || feedback.conversation.length === 0) && !feedback?.feedback && (
        <GlassCard hover={false}>
          <p className="text-sm text-[var(--text-tertiary)]">No speaking review data available.</p>
        </GlassCard>
      )}
    </>
  );
}
