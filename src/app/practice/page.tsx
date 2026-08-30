'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { PageHeader } from '@/components/ui/page-header';
import { RatingButtons } from '@/components/practice/rating-buttons';
import {
  Brain,
  BookOpen,
  PenTool,
  Tag,
  Zap,
  Loader2,
  CheckCircle2,
  XCircle,
  Volume2,
  ArrowRight,
  Headphones,
  MessageSquareQuote,
} from 'lucide-react';
import { sfx } from '@/lib/sounds';
import { cn } from '@/lib/utils';

type PracticeMode = 'flashcard' | 'meaning' | 'sentence' | 'gender' | 'conjugation' | null;

interface UserWord {
  id: string;
  word: string;
  partOfSpeech: string;
  gender: string | null;
  pluralForm: string | null;
  conjugation: Record<string, string> | null;
  meaning: string;
  cefrLevel: string;
  exampleSentence: string | null;
}

const MODES: Array<{
  id: PracticeMode;
  title: string;
  description: string;
  icon: typeof Brain;
  color: string;
  bgColor: string;
}> = [
  {
    id: 'flashcard',
    title: 'Flashcard Review',
    description: 'Classic FSRS-based review',
    icon: Brain,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
  },
  {
    id: 'meaning',
    title: 'Meaning Recall',
    description: 'See German, type the English meaning',
    icon: BookOpen,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-500/10',
  },
  {
    id: 'sentence',
    title: 'Sentence Creation',
    description: 'Use the word in a sentence',
    icon: PenTool,
    color: 'text-purple-600',
    bgColor: 'bg-purple-500/10',
  },
  {
    id: 'gender',
    title: 'Gender Test',
    description: 'der/die/das for nouns only',
    icon: Tag,
    color: 'text-amber-600',
    bgColor: 'bg-amber-500/10',
  },
  {
    id: 'conjugation',
    title: 'Conjugation Drill',
    description: 'Conjugate verbs correctly',
    icon: Zap,
    color: 'text-red-600',
    bgColor: 'bg-red-500/10',
  },
];

function stripArticle(word: string): string {
  return word.replace(/^(der|die|das|ein|eine|einen|einem|einer)\s+/i, '').trim();
}

const PRONOUNS = ['ich', 'du', 'er', 'wir', 'ihr', 'sie'] as const;

function matchesMeaning(userInput: string, meaning: string): boolean {
  const normalized = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/[.,;:!?]/g, '');
  const u = normalized(userInput);
  const m = normalized(meaning);
  if (!u) return false;
  return m.includes(u) || u.includes(m) || m.split(/[,;]/).some((p) => p.trim().toLowerCase().includes(u));
}

export default function PracticePage() {
  const [mode, setMode] = useState<PracticeMode>(null);
  const [queue, setQueue] = useState<UserWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [reviewCount, setReviewCount] = useState(0);

  // Meaning mode
  const [meaningInput, setMeaningInput] = useState('');

  // Sentence mode
  const [sentenceInput, setSentenceInput] = useState('');

  // Gender mode
  const [genderInput, setGenderInput] = useState('');

  // Conjugation mode
  const [conjugationPronoun, setConjugationPronoun] = useState<string>('');
  const [conjugationInput, setConjugationInput] = useState('');

  const fetchQueue = useCallback(async () => {
    if (!mode) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/practice/queue?mode=${mode}&limit=10`);
      const data = await res.json();
      setQueue(data.words || []);
      setCurrentIndex(0);
      setRevealed(false);
      setAnswered(false);
      setCorrect(false);
      setMeaningInput('');
      setSentenceInput('');
      setGenderInput('');
      setConjugationInput('');
      if (!data.words || data.words.length === 0) {
        setSessionComplete(true);
      }
    } catch {
      setQueue([]);
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    if (mode) fetchQueue();
  }, [mode, fetchQueue]);

  const currentWord = queue[currentIndex];

  useEffect(() => {
    if (mode === 'conjugation' && currentWord) {
      setConjugationPronoun(PRONOUNS[Math.floor(Math.random() * PRONOUNS.length)]);
    }
  }, [mode, currentWord]);
  const progress = queue.length > 0 ? (currentIndex / queue.length) * 100 : 0;

  const handleRate = async (rating: 1 | 2 | 3 | 4) => {
    if (!currentWord || submitting) return;
    sfx.xp();

    setSubmitting(true);
    try {
      await fetch('/api/practice/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wordId: currentWord.id,
          rating,
          mode: mode || 'flashcard',
          correct,
        }),
      });
      setReviewCount((c) => c + 1);
    } catch {
      // continue
    }

    setSubmitting(false);
    setRevealed(false);
    setAnswered(false);
    setMeaningInput('');
    setSentenceInput('');
    setGenderInput('');
    setConjugationInput('');

    if (currentIndex + 1 < queue.length) {
      sfx.swoosh();
      setCurrentIndex((i) => i + 1);
    } else {
      sfx.complete();
      setSessionComplete(true);
    }
  };

  const handleReveal = () => {
    sfx.flip();
    setRevealed(true);
  };

  const handleCheckMeaning = () => {
    if (!currentWord) return;
    const ok = matchesMeaning(meaningInput, currentWord.meaning);
    setCorrect(ok);
    setAnswered(true);
    ok ? sfx.correct() : sfx.wrong();
  };

  const handleGenderCheck = () => {
    if (!currentWord || answered) return;
    const input = genderInput.trim().toLowerCase();
    const correctArticle = currentWord.gender === 'masculine' ? 'der' : currentWord.gender === 'feminine' ? 'die' : 'das';
    const ok = input === correctArticle;
    setCorrect(ok);
    setAnswered(true);
    ok ? sfx.correct() : sfx.wrong();
  };

  const handleCheckConjugation = () => {
    if (!currentWord || !conjugationPronoun) return;
    const conj = currentWord.conjugation;
    const expected = conj?.[conjugationPronoun]?.toLowerCase().trim();
    const user = conjugationInput.trim().toLowerCase();
    const ok = !!expected && expected === user;
    setCorrect(ok);
    setAnswered(true);
    ok ? sfx.correct() : sfx.wrong();
  };

  const handleSentenceSubmit = () => {
    setAnswered(true);
    setCorrect(true);
    sfx.tap();
  };

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    } catch {}
  }, []);

  // Auto-pronounce word when flashcard is displayed or word changes
  useEffect(() => {
    if (mode === 'flashcard' && currentWord && !sessionComplete) {
      const timer = setTimeout(() => {
        speak(currentWord.word);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [mode, currentWord, sessionComplete, speak]);

  if (mode === null) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
        <PageHeader title="Practice" subtitle="Choose a mode to start" />
        <Link href="/practice/words" onClick={() => sfx.tap()}>
          <motion.div
            className="mb-6 rounded-2xl border-2 border-dashed border-[var(--accent)]/40 bg-[var(--accent)]/5 p-6 transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)]/10"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-[var(--accent)]/20 p-3">
                <BookOpen size={28} className="text-[var(--accent)]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Practice the Word</h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Learn → Practice Test → Word Exam. Duolingo-style batch flow.
                </p>
              </div>
              <ArrowRight size={20} className="ml-auto text-[var(--accent)]" />
            </div>
          </motion.div>
        </Link>
        <Link href="/practice/listening" onClick={() => sfx.tap()}>
          <motion.div
            className="mb-6 rounded-2xl border-2 border-dashed border-purple-400/40 bg-purple-500/5 p-6 transition-colors hover:border-purple-500 hover:bg-purple-500/10"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-purple-500/20 p-3">
                <Headphones size={28} className="text-purple-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Listening Practice</h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  AI-generated German audio with background noise, subtitles &amp; Goethe-style questions.
                </p>
              </div>
              <ArrowRight size={20} className="ml-auto text-purple-500" />
            </div>
          </motion.div>
        </Link>
        <Link href="/practice/expressions" onClick={() => sfx.tap()}>
          <motion.div
            className="mb-6 rounded-2xl border-2 border-dashed border-teal-400/40 bg-teal-500/5 p-6 transition-colors hover:border-teal-500 hover:bg-teal-500/10"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-teal-500/20 p-3">
                <MessageSquareQuote size={28} className="text-teal-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Practice Expressions</h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Learn → Practice Test → Exam. Master fixed expressions, idioms &amp; phrases.
                </p>
              </div>
              <ArrowRight size={20} className="ml-auto text-teal-500" />
            </div>
          </motion.div>
        </Link>
        <motion.div
          className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.08 },
            },
          }}
        >
          {MODES.map((m) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <GlassCard
                  hover={true}
                  className="cursor-pointer"
                  onClick={() => { sfx.tap(); setMode(m.id); }}
                >
                  <div className={`inline-flex rounded-xl p-3 ${m.bgColor}`}>
                    <Icon size={24} className={m.color} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{m.title}</h3>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    {m.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[var(--accent)]">
                    Start <ArrowRight size={16} />
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            setMode(null);
            setQueue([]);
            setSessionComplete(false);
            setReviewCount(0);
          }}
          className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
        >
          ← Back
        </button>
        <PageHeader
          title={
            MODES.find((m) => m.id === mode)?.title || 'Practice'
          }
          subtitle={`${mode} mode`}
        />
      </div>

      {!sessionComplete && queue.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
            <span>
              {currentIndex + 1} / {queue.length}
            </span>
            <span>{reviewCount} reviewed</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
            <motion.div
              className="h-full rounded-full bg-[var(--accent)]"
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>
        </div>
      )}

      <div className="mt-10">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
              <p className="mt-4 text-sm text-[var(--text-secondary)]">
                Building your queue...
              </p>
            </motion.div>
          ) : sessionComplete ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-20"
            >
              <GlassCard hover={false} className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  <CheckCircle2 size={48} className="mx-auto text-emerald-500" />
                </motion.div>
                <h2 className="mt-4 text-xl font-semibold">Session Complete</h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  {reviewCount > 0
                    ? `You reviewed ${reviewCount} words. Great work!`
                    : 'No words available for this mode. Upload vocabulary first!'}
                </p>
                {queue.length === 0 && (
                  <Link href="/vocabulary" className="btn-primary mt-6 inline-flex">
                    Go to Vocabulary
                  </Link>
                )}
                {queue.length > 0 && (
                  <motion.button
                    className="btn-primary mt-6"
                    onClick={() => {
                      setSessionComplete(false);
                      setReviewCount(0);
                      fetchQueue();
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    New Session
                  </motion.button>
                )}
              </GlassCard>
            </motion.div>
          ) : currentWord ? (
            <motion.div
              key={currentWord.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              {/* Flashcard */}
              {mode === 'flashcard' && (
                <div className="mx-auto w-full max-w-lg">
                  <div className="flashcard-flip mx-auto w-full">
                    <div
                      className={`flashcard-inner relative transition-transform duration-500 cursor-pointer ${revealed ? 'flipped' : ''}`}
                      style={{ minHeight: 400 }}
                      onClick={() => !revealed && handleReveal()}
                    >
                      {/* ── CARD FRONT ── */}
                      <div className="flashcard-front absolute inset-0">
                        <div className="flex h-full flex-col justify-between rounded-[32px] border-2 border-black/[0.08] dark:border-white/[0.12] bg-[var(--bg-card)] p-6 sm:p-8 shadow-xl shadow-black/5 dark:shadow-black/20 text-center relative select-none">
                          {/* Top Badges & Sound Button */}
                          <div className="flex items-center justify-between w-full">
                            <div className="flex flex-wrap items-center gap-2">
                              {currentWord.partOfSpeech && (
                                <span className="rounded-full border border-purple-400/80 bg-purple-50 dark:bg-purple-950/40 px-3 py-1 text-xs font-black text-purple-600 dark:text-purple-300">
                                  {currentWord.partOfSpeech.charAt(0).toUpperCase() + currentWord.partOfSpeech.slice(1)}
                                </span>
                              )}
                              {currentWord.cefrLevel && (
                                <span className="rounded-full border border-emerald-500/80 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-xs font-black text-emerald-600 dark:text-emerald-300">
                                  {currentWord.cefrLevel}
                                </span>
                              )}
                              {currentWord.gender && (
                                <span
                                  className={cn(
                                    'rounded-full border px-3 py-1 text-xs font-black',
                                    currentWord.gender === 'masculine'
                                      ? 'border-blue-400/80 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300'
                                      : currentWord.gender === 'feminine'
                                        ? 'border-rose-400/80 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300'
                                        : 'border-amber-400/80 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300'
                                  )}
                                >
                                  {currentWord.gender === 'masculine'
                                    ? 'Masculine'
                                    : currentWord.gender === 'feminine'
                                      ? 'Feminine'
                                      : 'Neuter'}
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                speak(currentWord.word);
                              }}
                              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-tertiary)] hover:bg-[var(--accent)]/15 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all shadow-sm"
                              title="Pronounce"
                            >
                              <Volume2 size={20} />
                            </button>
                          </div>

                          {/* Center German Word & Article Tag */}
                          <div className="my-auto py-6 flex flex-col items-center">
                            <motion.h2
                              className="text-4xl sm:text-5xl font-black tracking-tight text-[var(--text-primary)]"
                              initial={{ scale: 0.95, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                            >
                              {currentWord.word}
                            </motion.h2>

                            {currentWord.gender && (
                              <span
                                className={cn(
                                  'mt-3 inline-flex items-center justify-center px-4 py-1 rounded-full border text-xs font-black',
                                  currentWord.gender === 'masculine'
                                    ? 'border-blue-400/80 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-300'
                                    : currentWord.gender === 'feminine'
                                      ? 'border-rose-400/80 bg-rose-50/50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-300'
                                      : 'border-amber-400/80 bg-amber-50/50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-300'
                                )}
                              >
                                {currentWord.gender === 'masculine' ? 'der' : currentWord.gender === 'feminine' ? 'die' : 'das'}
                              </span>
                            )}
                          </div>

                          {/* Example Box */}
                          {currentWord.exampleSentence ? (
                            <div className="w-full rounded-2xl border border-sky-200 dark:border-sky-800/60 bg-sky-50/80 dark:bg-sky-950/30 p-4 sm:p-5 text-left relative overflow-hidden">
                              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-sky-500 rounded-l" />
                              <span className="text-[10px] font-black uppercase tracking-wider text-sky-600 dark:text-sky-400">
                                EXAMPLE
                              </span>
                              <p className="mt-1 text-sm sm:text-base font-semibold italic text-[var(--text-primary)] leading-relaxed">
                                „{currentWord.exampleSentence}"
                              </p>
                            </div>
                          ) : (
                            <div className="h-6" />
                          )}

                          {/* Bottom Helper */}
                          <div className="mt-4 text-xs font-bold text-[var(--text-tertiary)]">
                            Tap to reveal meaning
                          </div>
                        </div>
                      </div>

                      {/* ── CARD BACK ── */}
                      <div className="flashcard-back absolute inset-0">
                        <div className="flex h-full flex-col justify-between rounded-[32px] border-2 border-[var(--accent)]/40 bg-[var(--bg-secondary)] p-6 sm:p-8 shadow-xl shadow-black/5 dark:shadow-black/20 text-center relative select-none">
                          {/* Top Badges & Sound Button */}
                          <div className="flex items-center justify-between w-full">
                            <div className="flex flex-wrap items-center gap-2">
                              {currentWord.partOfSpeech && (
                                <span className="rounded-full border border-purple-400/80 bg-purple-50 dark:bg-purple-950/40 px-3 py-1 text-xs font-black text-purple-600 dark:text-purple-300">
                                  {currentWord.partOfSpeech.charAt(0).toUpperCase() + currentWord.partOfSpeech.slice(1)}
                                </span>
                              )}
                              {currentWord.cefrLevel && (
                                <span className="rounded-full border border-emerald-500/80 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-xs font-black text-emerald-600 dark:text-emerald-300">
                                  {currentWord.cefrLevel}
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                speak(currentWord.word);
                              }}
                              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-tertiary)] hover:bg-[var(--accent)]/15 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all shadow-sm"
                              title="Pronounce"
                            >
                              <Volume2 size={20} />
                            </button>
                          </div>

                          {/* Center Meaning */}
                          <div className="my-auto py-4 flex flex-col items-center">
                            <p className="text-sm font-bold text-[var(--text-tertiary)]">
                              {currentWord.word}
                            </p>

                            <motion.h3
                              className="mt-1 text-3xl sm:text-4xl font-black text-[var(--accent)] tracking-tight"
                              initial={{ scale: 0.95 }}
                              animate={{ scale: 1 }}
                            >
                              {currentWord.meaning}
                            </motion.h3>

                            {/* Example Sentence Box */}
                            {currentWord.exampleSentence && (
                              <div className="mt-4 w-full rounded-2xl border border-sky-200 dark:border-sky-800/60 bg-sky-50/80 dark:bg-sky-950/30 p-3.5 text-left relative overflow-hidden max-w-md">
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-sky-500 rounded-l" />
                                <span className="text-[10px] font-black uppercase tracking-wider text-sky-600 dark:text-sky-400">
                                  EXAMPLE
                                </span>
                                <p className="mt-0.5 text-xs sm:text-sm font-semibold italic text-[var(--text-primary)]">
                                  „{currentWord.exampleSentence}"
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="mt-2 text-xs font-bold text-[var(--text-tertiary)]">
                            Select below how well you recalled this word:
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="mt-6 text-center text-xs font-bold text-[var(--text-tertiary)]">
                    Tap the card to flip
                  </p>
                </div>
              )}

              {/* Meaning Recall */}
              {mode === 'meaning' && (
                <GlassCard hover={false} className="text-center">
                  <h2 className="text-3xl font-semibold">{currentWord.word}</h2>
                  {currentWord.exampleSentence && (
                    <p className="mt-4 text-sm italic text-[var(--text-tertiary)]">
                      {currentWord.exampleSentence}
                    </p>
                  )}
                  <div className="mt-6">
                    <input
                      type="text"
                      placeholder="Type the English meaning..."
                      value={meaningInput}
                      onChange={(e) => setMeaningInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCheckMeaning()}
                      disabled={answered}
                      className="input-field w-full"
                    />
                    {!answered && (
                      <button
                        className="btn-primary mt-4"
                        onClick={handleCheckMeaning}
                      >
                        Check
                      </button>
                    )}
                  </div>
                </GlassCard>
              )}

              {/* Sentence Creation */}
              {mode === 'sentence' && (
                <GlassCard hover={false} className="text-center">
                  <h2 className="text-2xl font-semibold">{currentWord.word}</h2>
                  <p className="mt-2 text-sm text-[var(--text-tertiary)]">
                    {currentWord.meaning}
                  </p>
                  <div className="mt-6">
                    <input
                      type="text"
                      placeholder="Write a German sentence using this word..."
                      value={sentenceInput}
                      onChange={(e) => setSentenceInput(e.target.value)}
                      disabled={answered}
                      className="input-field w-full"
                    />
                    {!answered && (
                      <button
                        className="btn-primary mt-4"
                        onClick={handleSentenceSubmit}
                        disabled={!sentenceInput.trim()}
                      >
                        I did it
                      </button>
                    )}
                  </div>
                </GlassCard>
              )}

              {/* Gender Test */}
              {mode === 'gender' && (
                <GlassCard hover={false} className="text-center">
                  <p className="text-sm text-[var(--text-tertiary)]">What is the article?</p>
                  <h2 className="mt-4 text-3xl font-semibold">{stripArticle(currentWord.word)}</h2>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">({currentWord.meaning})</p>
                  <div className="mt-6">
                    <input
                      type="text"
                      placeholder="der / die / das"
                      value={genderInput}
                      onChange={(e) => setGenderInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !answered && handleGenderCheck()}
                      disabled={answered}
                      className="input-field mx-auto max-w-[200px] text-center text-lg"
                      autoFocus
                    />
                    {!answered && (
                      <button className="btn-primary mt-4" onClick={handleGenderCheck} disabled={!genderInput.trim()}>
                        Check
                      </button>
                    )}
                  </div>
                  {answered && (
                    <div className="mt-4">
                      {correct ? (
                        <p className="text-emerald-600 dark:text-emerald-400 font-medium">Correct!</p>
                      ) : (
                        <p className="text-red-600 dark:text-red-400">
                          Wrong. Correct: <strong>{currentWord.gender === 'masculine' ? 'der' : currentWord.gender === 'feminine' ? 'die' : 'das'} {stripArticle(currentWord.word)}</strong>
                        </p>
                      )}
                    </div>
                  )}
                </GlassCard>
              )}

              {/* Conjugation Drill */}
              {mode === 'conjugation' && (
                <GlassCard hover={false} className="text-center">
                  <h2 className="text-2xl font-semibold">{currentWord.word}</h2>
                  <p className="mt-2 text-lg text-[var(--text-secondary)]">
                    ({currentWord.meaning})
                  </p>
                  <p className="mt-4 text-xl font-medium">
                    {conjugationPronoun} → ?
                  </p>
                  <div className="mt-6">
                    <input
                      type="text"
                      placeholder="Conjugated form..."
                      value={conjugationInput}
                      onChange={(e) => setConjugationInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCheckConjugation()}
                      disabled={answered}
                      className="input-field w-full"
                    />
                    {!answered && (
                      <button
                        className="btn-primary mt-4"
                        onClick={handleCheckConjugation}
                      >
                        Check
                      </button>
                    )}
                  </div>
                  {answered && currentWord.conjugation && (
                    <p className="mt-4 text-sm text-[var(--text-secondary)]">
                      Correct: {currentWord.conjugation[conjugationPronoun] || '—'}
                    </p>
                  )}
                </GlassCard>
              )}

              {/* FSRS rating (after answer for meaning/gender/conjugation/sentence, after reveal for flashcard) */}
              <AnimatePresence>
                {((mode === 'flashcard' && revealed) ||
                  (mode !== 'flashcard' && answered)) && (
                  <motion.div
                    className="mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    {(mode === 'meaning' || mode === 'gender' || mode === 'conjugation') && (
                      <div className="mb-6 flex items-center justify-center gap-2">
                        {correct ? (
                          <CheckCircle2 size={24} className="text-emerald-500" />
                        ) : (
                          <XCircle size={24} className="text-red-500" />
                        )}
                        <span
                          className={
                            correct
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-red-600 dark:text-red-400'
                          }
                        >
                          {correct ? 'Correct!' : 'Incorrect'}
                        </span>
                      </div>
                    )}
                    <RatingButtons onRate={handleRate} disabled={submitting} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
