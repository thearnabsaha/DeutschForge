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
} from 'lucide-react';

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

const GENDER_OPTIONS = [
  { value: 'der', label: 'der', target: 'masculine' },
  { value: 'die', label: 'die', target: 'feminine' },
  { value: 'das', label: 'das', target: 'neuter' },
];

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
  const [genderChoice, setGenderChoice] = useState<string | null>(null);

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
      setGenderChoice(null);
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
    setGenderChoice(null);
    setConjugationInput('');

    if (currentIndex + 1 < queue.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setSessionComplete(true);
    }
  };

  const handleReveal = () => {
    setRevealed(true);
  };

  const handleCheckMeaning = () => {
    if (!currentWord) return;
    const ok = matchesMeaning(meaningInput, currentWord.meaning);
    setCorrect(ok);
    setAnswered(true);
  };

  const handleGenderChoice = (choice: string) => {
    if (!currentWord || genderChoice) return;
    const target = GENDER_OPTIONS.find((g) => g.value === choice)?.target;
    const ok = target === currentWord.gender;
    setGenderChoice(choice);
    setCorrect(ok);
    setAnswered(true);
  };

  const handleCheckConjugation = () => {
    if (!currentWord || !conjugationPronoun) return;
    const conj = currentWord.conjugation;
    const expected = conj?.[conjugationPronoun]?.toLowerCase().trim();
    const user = conjugationInput.trim().toLowerCase();
    const ok = !!expected && expected === user;
    setCorrect(ok);
    setAnswered(true);
  };

  const handleSentenceSubmit = () => {
    // Self-rate only - we don't grade, user decides
    setAnswered(true);
    setCorrect(true);
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
  };

  if (mode === null) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
        <PageHeader title="Practice" subtitle="Choose a mode to start" />
        <motion.div
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
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
                  onClick={() => setMode(m.id)}
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
                <div className="flashcard-flip mx-auto w-full max-w-lg">
                  <div
                    className={`flashcard-inner relative ${revealed ? 'flipped' : ''}`}
                    style={{ minHeight: 280 }}
                  >
                    <div
                      className="flashcard-front absolute inset-0 cursor-pointer"
                      onClick={() => !revealed && handleReveal()}
                    >
                      <div className="card-surface flex h-full flex-col items-center justify-center rounded-3xl p-8 text-center">
                        <motion.h2
                          className="text-3xl font-semibold tracking-tight"
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                        >
                          {currentWord.word}
                        </motion.h2>
                        {currentWord.exampleSentence && (
                          <p className="mt-4 text-sm italic text-[var(--text-tertiary)]">
                            {currentWord.exampleSentence}
                          </p>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speak(currentWord.word);
                          }}
                          className="mt-4 rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/5"
                        >
                          <Volume2 size={18} className="text-[var(--text-tertiary)]" />
                        </button>
                        <p className="mt-6 text-xs text-[var(--text-tertiary)]">
                          Tap to reveal
                        </p>
                      </div>
                    </div>
                    <div className="flashcard-back absolute inset-0">
                      <div className="card-surface flex h-full flex-col items-center justify-center rounded-3xl p-8 text-center">
                        <p className="text-sm text-[var(--text-tertiary)]">
                          {currentWord.word}
                        </p>
                        <motion.p
                          className="mt-2 text-2xl font-semibold text-[var(--accent)]"
                          initial={{ scale: 0.95 }}
                          animate={{ scale: 1 }}
                        >
                          {currentWord.meaning}
                        </motion.p>
                        {currentWord.exampleSentence && (
                          <p className="mt-3 text-sm italic text-[var(--text-tertiary)]">
                            {currentWord.exampleSentence}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
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
                  <h2 className="text-3xl font-semibold">{currentWord.word}</h2>
                  <p className="mt-2 text-sm text-[var(--text-tertiary)]">
                    Choose the correct article
                  </p>
                  <div className="mt-8 flex justify-center gap-4">
                    {GENDER_OPTIONS.map((g) => (
                      <motion.button
                        key={g.value}
                        onClick={() => handleGenderChoice(g.value)}
                        disabled={!!genderChoice}
                        className={`rounded-2xl px-6 py-3 text-lg font-semibold transition-all ${
                          genderChoice === g.value
                            ? g.target === currentWord.gender
                              ? 'bg-emerald-500 text-white'
                              : 'bg-red-500 text-white'
                            : 'bg-[var(--bg-tertiary)] hover:bg-[var(--border)]'
                        }`}
                        whileHover={!genderChoice ? { scale: 1.05 } : {}}
                        whileTap={!genderChoice ? { scale: 0.95 } : {}}
                      >
                        {g.label}
                      </motion.button>
                    ))}
                  </div>
                  {answered && (
                    <p className="mt-4 text-sm text-[var(--text-secondary)]">
                      Correct: {currentWord.gender === 'masculine' ? 'der' : currentWord.gender === 'feminine' ? 'die' : 'das'}
                    </p>
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
