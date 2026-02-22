'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Headphones, Play, Pause, ArrowRight, Loader2, RotateCcw } from 'lucide-react';
import { ExamTimer } from '@/components/exam/exam-timer';
import { useTimer } from '@/hooks/use-timer';
import { cn } from '@/lib/utils';

interface HoerenQuestion {
  id: string;
  text: string;
  options: string[];
}

interface HoerenTask {
  title: string;
  transcript: string;
  script?: string;
  maxReplays: number;
  questions: HoerenQuestion[];
}

interface HoerenSection {
  instructions: string;
  timeMinutes: number;
  tasks?: HoerenTask[];
  dialogues?: Array<{
    title: string;
    script: string;
    questions: HoerenQuestion[];
  }>;
}

export default function HoerenPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.attemptId as string;

  const [section, setSection] = useState<HoerenSection | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [playingTask, setPlayingTask] = useState<number | null>(null);
  const [replayCounts, setReplayCounts] = useState<Record<number, number>>({});
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    speechSynthesis.cancel();
    setSubmitting(true);
    try {
      await fetch(`/api/exam/${attemptId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'HOEREN', answers }),
      });
      router.push(`/exam/${attemptId}/schreiben`);
    } catch {
      setSubmitting(false);
    }
  }, [attemptId, answers, router, submitting]);

  const totalSeconds = (section?.timeMinutes ?? 20) * 60;
  const { remaining, progress } = useTimer({
    key: `exam-${attemptId}-HOEREN`,
    totalSeconds,
    onExpire: handleSubmit,
    autoStart: !!section,
  });

  useEffect(() => {
    fetch(`/api/exam/${attemptId}/section?section=HOEREN`)
      .then((r) => r.json())
      .then((data) => {
        if (data.dialogues && !data.tasks) {
          data.tasks = data.dialogues.map((d: { title: string; script: string; questions: HoerenQuestion[] }) => ({
            title: d.title,
            transcript: d.script,
            maxReplays: 3,
            questions: d.questions,
          }));
        }
        if (data.tasks) {
          data.tasks = data.tasks.map((t: HoerenTask) => ({
            ...t,
            transcript: t.transcript || t.script || '',
            maxReplays: t.maxReplays || 3,
          }));
        }
        setSection(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [attemptId]);

  const playAudio = (taskIndex: number, text: string, maxReplays: number) => {
    const currentReplays = replayCounts[taskIndex] || 0;
    if (currentReplays >= maxReplays) return;

    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = 0.8;
    utterance.onstart = () => setPlayingTask(taskIndex);
    utterance.onend = () => {
      setPlayingTask(null);
      setReplayCounts((c) => ({ ...c, [taskIndex]: (c[taskIndex] || 0) + 1 }));
    };
    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    speechSynthesis.cancel();
    setPlayingTask(null);
  };

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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-900/20">
            <Headphones size={20} className="text-purple-500" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Hören – Listening</h1>
            <p className="text-xs text-[var(--text-tertiary)]">
              Listen carefully, limited replays available
            </p>
          </div>
        </div>
        <ExamTimer remainingSeconds={remaining} progressPercent={progress * 100} />
      </div>

      <p className="mt-4 text-sm text-[var(--text-secondary)]">
        {section.instructions}
      </p>

      <div className="mt-6 space-y-8">
        {(section.tasks || []).map((task, ti) => {
          const replaysUsed = replayCounts[ti] || 0;
          const replaysLeft = task.maxReplays - replaysUsed;
          const isPlaying = playingTask === ti;

          return (
            <motion.div
              key={ti}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ti * 0.15 }}
            >
              <div className="card-surface rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold">{task.title}</h2>
                  <div className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                    <RotateCcw size={12} />
                    {replaysLeft} replay{replaysLeft !== 1 ? 's' : ''} left
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <motion.button
                    onClick={() => isPlaying ? stopAudio() : playAudio(ti, task.transcript, task.maxReplays)}
                    disabled={replaysLeft <= 0 && !isPlaying}
                    className={cn(
                      'flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all',
                      isPlaying
                        ? 'bg-red-500 text-white'
                        : replaysLeft > 0
                          ? 'bg-[var(--accent)] text-white'
                          : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'
                    )}
                    whileHover={replaysLeft > 0 || isPlaying ? { scale: 1.03 } : {}}
                    whileTap={replaysLeft > 0 || isPlaying ? { scale: 0.97 } : {}}
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    {isPlaying ? 'Stop' : 'Play Audio'}
                  </motion.button>

                  {isPlaying && (
                    <motion.div
                      className="flex gap-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {[0, 1, 2, 3, 4].map((i) => (
                        <motion.div
                          key={i}
                          className="h-4 w-1 rounded-full bg-[var(--accent)]"
                          animate={{ scaleY: [0.3, 1, 0.3] }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.6,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </div>

                <div className="mt-5 space-y-3">
                  {task.questions.map((q, qi) => (
                    <div key={q.id} className="rounded-xl bg-[var(--bg-tertiary)] p-4">
                      <p className="text-sm font-medium">
                        {ti + 1}.{qi + 1} {q.text}
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
          );
        })}
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
          Next: Schreiben
          <ArrowRight size={16} />
        </motion.button>
      </div>
    </div>
  );
}
