'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PenTool, ArrowRight, Loader2 } from 'lucide-react';
import { ExamTimer } from '@/components/exam/exam-timer';
import { useTimer } from '@/hooks/use-timer';

interface SchreibenSection {
  instructions: string;
  timeMinutes: number;
  prompt: string;
  hints: string[];
  minWords: number;
}

export default function SchreibenPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.attemptId as string;

  const [section, setSection] = useState<SchreibenSection | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await fetch(`/api/exam/${attemptId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'SCHREIBEN', answers: { text } }),
      });
      router.push(`/exam/${attemptId}/sprechen`);
    } catch {
      setSubmitting(false);
    }
  }, [attemptId, text, router, submitting]);

  const totalSeconds = (section?.timeMinutes ?? 30) * 60;
  const { remaining, progress } = useTimer({
    key: `exam-${attemptId}-SCHREIBEN`,
    totalSeconds,
    onExpire: handleSubmit,
    autoStart: !!section,
  });

  useEffect(() => {
    fetch(`/api/exam/${attemptId}/section?section=SCHREIBEN`)
      .then((r) => r.json())
      .then((data) => {
        setSection(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [attemptId]);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

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

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
            <PenTool size={20} className="text-emerald-500" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Schreiben – Writing</h1>
            <p className="text-xs text-[var(--text-tertiary)]">
              AI-graded using CEFR rubrics
            </p>
          </div>
        </div>
        <ExamTimer remainingSeconds={remaining} progressPercent={progress * 100} />
      </div>

      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="card-surface rounded-2xl p-6">
          <p className="text-sm text-[var(--text-secondary)]">
            {section.instructions}
          </p>

          <div className="mt-4 rounded-xl bg-[var(--bg-tertiary)] p-5">
            <h2 className="text-base font-semibold">Aufgabe (Task)</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-primary)]">
              {section.prompt}
            </p>
            {section.hints.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium text-[var(--text-tertiary)]">Include:</p>
                <ul className="mt-1 list-inside list-disc space-y-0.5">
                  {section.hints.map((h, i) => (
                    <li key={i} className="text-sm text-[var(--text-secondary)]">{h}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-6">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Schreiben Sie hier Ihre Antwort..."
              className="input-field min-h-[280px] resize-y font-sans text-base leading-relaxed"
              spellCheck
              lang="de"
            />
            <div className="mt-2 flex items-center justify-between text-xs text-[var(--text-tertiary)]">
              <span>
                {wordCount} word{wordCount !== 1 ? 's' : ''}
                {section.minWords > 0 && ` (min. ${section.minWords})`}
              </span>
              <span className={wordCount >= section.minWords ? 'text-emerald-500' : 'text-amber-500'}>
                {wordCount >= section.minWords ? 'Minimum reached' : `${section.minWords - wordCount} more needed`}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 flex justify-end">
        <motion.button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-primary"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
          Next: Sprechen
          <ArrowRight size={16} />
        </motion.button>
      </div>
    </div>
  );
}
