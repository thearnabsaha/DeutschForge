'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, Loader2 } from 'lucide-react';
import { ExamTimer } from '@/components/exam/exam-timer';
import { useTimer } from '@/hooks/use-timer';
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  text: string;
  options: string[];
  type: 'multiple_choice' | 'true_false';
}

interface LesenSection {
  instructions: string;
  timeMinutes: number;
  passages: Array<{
    title: string;
    text: string;
    questions: Question[];
  }>;
}

export default function LesenPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.attemptId as string;

  const [section, setSection] = useState<LesenSection | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await fetch(`/api/exam/${attemptId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'LESEN', answers }),
      });
      router.push(`/exam/${attemptId}/hoeren`);
    } catch {
      setSubmitting(false);
    }
  }, [attemptId, answers, router, submitting]);

  const totalSeconds = (section?.timeMinutes ?? 25) * 60;
  const { remaining, progress } = useTimer({
    key: `exam-${attemptId}-LESEN`,
    totalSeconds,
    onExpire: handleSubmit,
    autoStart: !!section,
  });

  useEffect(() => {
    fetch(`/api/exam/${attemptId}/section?section=LESEN`)
      .then((r) => r.json())
      .then((data) => {
        setSection(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [attemptId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (!section) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[var(--text-secondary)]">Section not found.</p>
      </div>
    );
  }

  const totalQuestions = section.passages.reduce((acc, p) => acc + p.questions.length, 0);
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20">
            <BookOpen size={20} className="text-[var(--accent)]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Lesen – Reading</h1>
            <p className="text-xs text-[var(--text-tertiary)]">
              {answeredCount}/{totalQuestions} answered
            </p>
          </div>
        </div>
        <ExamTimer remainingSeconds={remaining} progressPercent={progress * 100} />
      </div>

      <p className="mt-4 text-sm text-[var(--text-secondary)]">
        {section.instructions}
      </p>

      <div className="mt-6 space-y-8">
        {section.passages.map((passage, pi) => (
          <motion.div
            key={pi}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: pi * 0.1 }}
          >
            <div className="card-surface rounded-2xl p-6">
              <h2 className="text-base font-semibold">{passage.title}</h2>
              <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-secondary)]">
                {passage.text}
              </div>

              <div className="mt-6 space-y-4">
                {passage.questions.map((q, qi) => (
                  <div key={q.id} className="rounded-xl bg-[var(--bg-tertiary)] p-4">
                    <p className="text-sm font-medium">
                      {pi + 1}.{qi + 1} {q.text}
                    </p>
                    <div className="mt-3 space-y-2">
                      {q.options.map((opt, oi) => (
                        <label
                          key={oi}
                          className={cn(
                            'flex cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all',
                            answers[q.id] === opt
                              ? 'bg-[var(--accent)] text-white'
                              : 'bg-[var(--bg-secondary)] hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                          )}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            value={opt}
                            checked={answers[q.id] === opt}
                            onChange={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                            className="sr-only"
                          />
                          <span className={cn(
                            'flex h-5 w-5 items-center justify-center rounded-full border-2 text-[10px] font-bold',
                            answers[q.id] === opt
                              ? 'border-white text-white'
                              : 'border-[var(--border)] text-[var(--text-tertiary)]'
                          )}>
                            {String.fromCharCode(65 + oi)}
                          </span>
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <motion.button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-primary"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
          Next: Hören
          <ArrowRight size={16} />
        </motion.button>
      </div>
    </div>
  );
}
