'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import {
  Play, Pause, RotateCcw, Subtitles,
  ChevronRight, CheckCircle2, XCircle, Clock, Headphones,
  BarChart3, Loader2, ArrowLeft, Zap,
} from 'lucide-react';
import { sfx } from '@/lib/sounds';
import { cn } from '@/lib/utils';
import { formatTime, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { ProgressRing } from '@/components/ui/progress-ring';
import { toast } from 'sonner';

// ── Ambient Noise System ────────────────────────────────────────────────────

type NoiseType = 'cafe' | 'train' | 'airport' | 'street';

class AmbientNoise {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private running = false;

  start(volume: number, type: NoiseType) {
    if (this.running) this.stop();
    this.ctx = new AudioContext();

    const sampleRate = this.ctx.sampleRate;
    const duration = 4;
    const bufferSize = sampleRate * duration;
    const buffer = this.ctx.createBuffer(2, bufferSize, sampleRate);

    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = buffer;
    this.noiseNode.loop = true;

    this.filterNode = this.ctx.createBiquadFilter();
    if (type === 'cafe') {
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.value = 800;
      this.filterNode.Q.value = 0.5;
    } else if (type === 'train') {
      this.filterNode.type = 'bandpass';
      this.filterNode.frequency.value = 200;
      this.filterNode.Q.value = 1.5;
    } else if (type === 'airport') {
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.value = 1200;
      this.filterNode.Q.value = 0.3;
    } else {
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.value = 600;
      this.filterNode.Q.value = 0.7;
    }

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = volume;

    this.noiseNode.connect(this.filterNode);
    this.filterNode.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);
    this.noiseNode.start();
    this.running = true;
  }

  stop() {
    try {
      this.noiseNode?.stop();
      this.noiseNode?.disconnect();
      this.filterNode?.disconnect();
      this.gainNode?.disconnect();
      this.ctx?.close();
    } catch {
      // ignore
    }
    this.running = false;
    this.ctx = null;
  }

  setVolume(v: number) {
    if (this.gainNode) this.gainNode.gain.value = v;
  }
}

// ── Constants ────────────────────────────────────────────────────────────────

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2'] as const;
type CefrLevel = (typeof CEFR_LEVELS)[number];

const DIFFICULTIES = [
  {
    id: 'very_easy' as const,
    label: 'Very Easy',
    description: 'Slow speech, no noise, subtitles ON',
    color: 'emerald',
  },
  {
    id: 'easy' as const,
    label: 'Easy',
    description: 'Slow speech, no noise, clear',
    color: 'blue',
  },
  {
    id: 'normal' as const,
    label: 'Normal',
    description: 'Normal speed, light noise',
    color: 'amber',
  },
  {
    id: 'hard' as const,
    label: 'Hard',
    description: 'Normal speed, moderate noise, no subtitles',
    color: 'orange',
  },
  {
    id: 'very_hard' as const,
    label: 'Very Hard',
    description: 'Fast speech, heavy noise, no subtitles',
    color: 'red',
  },
] as const;

type DifficultyId = (typeof DIFFICULTIES)[number]['id'];

const NOISE_VOLUMES: Record<DifficultyId, number> = {
  very_easy: 0,
  easy: 0,
  normal: 0.03,
  hard: 0.06,
  very_hard: 0.1,
};

const SUBTITLE_DEFAULTS: Record<DifficultyId, boolean> = {
  very_easy: true,
  easy: false,
  normal: false,
  hard: false,
  very_hard: false,
};

const SPEED_OPTIONS = [0.75, 1.0, 1.25] as const;

const DIFFICULTY_CARD_CLASSES: Record<DifficultyId, { border: string; bg: string; badge: string }> = {
  very_easy: {
    border: 'border-emerald-500',
    bg: 'bg-emerald-500/10',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  easy: {
    border: 'border-blue-500',
    bg: 'bg-blue-500/10',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  normal: {
    border: 'border-amber-500',
    bg: 'bg-amber-500/10',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  hard: {
    border: 'border-orange-500',
    bg: 'bg-orange-500/10',
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  },
  very_hard: {
    border: 'border-red-500',
    bg: 'bg-red-500/10',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
};

// ── Types ────────────────────────────────────────────────────────────────────

interface ListeningQuestion {
  question: string;
  options: string[];
  type: 'mcq' | 'short_answer';
}

interface GenerateResponse {
  attemptId: string;
  script: string;
  newWordsUsed: string[];
  questions: ListeningQuestion[];
  questionCount: number;
}

interface HistoryAttempt {
  id: string;
  cefrLevel: string;
  difficulty: string;
  score: number | null;
  maxScore: number | null;
  timeSpent: number | null;
  completedAt: string | null;
  createdAt: string;
}

interface HistoryResponse {
  attempts: HistoryAttempt[];
  totalAttempts: number;
  avgScore: number;
  byLevel: Record<string, { attempts: number; avgScore: number }>;
}

interface ResultItem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  type: string;
  userAnswer: number | string;
  correct: boolean;
}

// ── TTS Helper ────────────────────────────────────────────────────────────────

function speak(text: string, rate: number) {
  if (typeof window === 'undefined') return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'de-DE';
  u.rate = rate;
  speechSynthesis.speak(u);
}

// ── Main Component ────────────────────────────────────────────────────────────

type Phase = 'config' | 'listening' | 'questions' | 'results';
type Tab = 'practice' | 'history';

export default function ListeningPracticePage() {
  const [tab, setTab] = useState<Tab>('practice');
  const [phase, setPhase] = useState<Phase>('config');
  const [cefrLevel, setCefrLevel] = useState<CefrLevel>('A1');
  const [difficulty, setDifficulty] = useState<DifficultyId>('normal');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [script, setScript] = useState<string>('');
  const [newWordsUsed, setNewWordsUsed] = useState<string[]>([]);
  const [questions, setQuestions] = useState<ListeningQuestion[]>([]);

  const [speedIndex, setSpeedIndex] = useState(1);
  const [subtitlesOn, setSubtitlesOn] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<{ questionIndex: number; userAnswer: number | string }>>([]);
  const [shortAnswerInput, setShortAnswerInput] = useState('');

  const [results, setResults] = useState<{
    score: number;
    maxScore: number;
    xpEarned: number;
    percentage: number;
    results: ResultItem[];
  } | null>(null);

  const [history, setHistory] = useState<HistoryResponse | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Vocabulary selection
  const [vocabMode, setVocabMode] = useState<'all' | 'select'>('all');
  const [allWords, setAllWords] = useState<Array<{ id: string; word: string; meaning: string }>>([]);
  const [selectedWordIds, setSelectedWordIds] = useState<Set<string>>(new Set());
  const [vocabLoading, setVocabLoading] = useState(false);

  const ambientRef = useRef<AmbientNoise | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);

  const rate = SPEED_OPTIONS[speedIndex];

  const getNoiseVolume = () => NOISE_VOLUMES[difficulty];

  useEffect(() => {
    setSubtitlesOn(SUBTITLE_DEFAULTS[difficulty]);
  }, [difficulty]);

  const fetchVocabulary = useCallback(async () => {
    setVocabLoading(true);
    try {
      const res = await fetch('/api/vocabulary');
      const data = await res.json();
      const words = (data.words || []).map((w: { id: string; word: string; meaning: string }) => ({
        id: w.id,
        word: w.word,
        meaning: w.meaning,
      }));
      setAllWords(words);
      setSelectedWordIds(new Set(words.map((w: { id: string }) => w.id)));
    } catch {
      setAllWords([]);
    } finally {
      setVocabLoading(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      ambientRef.current?.stop();
      speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (phase !== 'questions') return;
    const interval = setInterval(() => setTimerSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [phase]);

  const handleGenerate = useCallback(async () => {
    if (vocabMode === 'select' && selectedWordIds.size === 0) {
      setError('Select at least one word');
      return;
    }
    setGenerating(true);
    setError(null);
    sfx.click();
    try {
      const payload: Record<string, unknown> = { cefrLevel, difficulty };
      if (vocabMode === 'select') {
        payload.selectedWordIds = Array.from(selectedWordIds);
      }
      const res = await fetch('/api/practice/listening/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      const gen = data as GenerateResponse;
      setAttemptId(gen.attemptId);
      setScript(gen.script);
      setNewWordsUsed(gen.newWordsUsed || []);
      setQuestions(gen.questions || []);
      setPhase('listening');
      setHasPlayedOnce(false);
      setAnswers([]);
      setCurrentQuestionIndex(0);
      setShortAnswerInput('');
      setResults(null);
      setTimerSeconds(0);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed');
      toast.error(e instanceof Error ? e.message : 'Generation failed');
    } finally {
      setGenerating(false);
    }
  }, [cefrLevel, difficulty, vocabMode, selectedWordIds]);

  const handlePlay = useCallback(() => {
    if (!script) return;
    sfx.click();
    const vol = getNoiseVolume();
    if (vol > 0 && !ambientRef.current) {
      const types: NoiseType[] = ['cafe', 'train', 'airport', 'street'];
      const type = types[Math.floor(Math.random() * types.length)];
      ambientRef.current = new AmbientNoise();
      ambientRef.current.start(vol, type);
    }
    setIsPlaying(true);
    speak(script, rate);
    setHasPlayedOnce(true);
  }, [script, rate, difficulty]);

  const handlePause = useCallback(() => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    const onEnd = () => setIsPlaying(false);
    if (typeof window !== 'undefined') {
      speechSynthesis.onvoiceschanged = () => {};
      const checkEnd = setInterval(() => {
        if (!speechSynthesis.speaking && isPlaying) {
          setIsPlaying(false);
        }
      }, 200);
      return () => clearInterval(checkEnd);
    }
  }, [isPlaying]);

  const handleReplay = useCallback(() => {
    handlePause();
    setTimeout(() => handlePlay(), 100);
  }, [handlePlay, handlePause]);

  const handleContinueToQuestions = useCallback(() => {
    sfx.click();
    ambientRef.current?.stop();
    speechSynthesis.cancel();
    setPhase('questions');
    setTimerSeconds(0);
  }, []);

  const handleAnswerMcq = useCallback((index: number) => {
    sfx.click();
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = { questionIndex: currentQuestionIndex, userAnswer: index };
    setAnswers(newAnswers);
  }, [answers, currentQuestionIndex]);

  const handleAnswerShort = useCallback((value: string) => {
    setShortAnswerInput(value);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = { questionIndex: currentQuestionIndex, userAnswer: value };
    setAnswers(newAnswers);
  }, [answers, currentQuestionIndex]);

  const handleNext = useCallback(() => {
    sfx.click();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
      const q = questions[currentQuestionIndex + 1];
      setShortAnswerInput(
        typeof answers[currentQuestionIndex + 1]?.userAnswer === 'string'
          ? String(answers[currentQuestionIndex + 1]?.userAnswer ?? '')
          : ''
      );
    } else {
      handleSubmit();
    }
  }, [currentQuestionIndex, questions.length, answers]);

  const handleSubmit = useCallback(async () => {
    if (!attemptId) return;
    sfx.click();
    const timeSpent = timerSeconds;
    try {
      const res = await fetch('/api/practice/listening/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId,
          answers: answers.map((a) => ({ questionIndex: a.questionIndex, userAnswer: a.userAnswer })),
          timeSpent,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submit failed');
      setResults(data);
      setPhase('results');
      sfx.complete();
      const correctCount = data.results?.filter((r: ResultItem) => r.correct).length ?? 0;
      for (let i = 0; i < correctCount; i++) {
        setTimeout(() => sfx.correct(), i * 80);
      }
      const wrongCount = (data.results?.length ?? 0) - correctCount;
      for (let i = 0; i < wrongCount; i++) {
        setTimeout(() => sfx.wrong(), correctCount * 80 + i * 80);
      }
      setTimeout(() => sfx.xp(), 200);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Submit failed');
    }
  }, [attemptId, answers, timerSeconds]);

  const handleTryAgain = useCallback(() => {
    sfx.click();
    setPhase('config');
    setAttemptId(null);
    setScript('');
    setQuestions([]);
    setResults(null);
    ambientRef.current?.stop();
  }, []);

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch('/api/practice/listening/history');
      const data = await res.json();
      if (res.ok) setHistory(data);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'history') fetchHistory();
  }, [tab, fetchHistory]);

  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const canContinue = hasPlayedOnce;
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const hasAnswered = currentAnswer !== undefined;
  const canNext = (currentQuestion?.type === 'mcq' && hasAnswered) ||
    (currentQuestion?.type === 'short_answer' && shortAnswerInput.trim().length > 0);

  // ── Render: History Tab ────────────────────────────────────────────────────

  if (tab === 'history') {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
        <PageHeader
          title="Listening Practice"
          subtitle="Hören üben"
          action={
            <button
              onClick={() => setTab('practice')}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
            >
              <ArrowLeft size={16} />
              Back to Practice
            </button>
          }
        />
        <div className="mt-6 flex gap-2 border-b border-[var(--border)] pb-2">
          <button
            onClick={() => setTab('practice')}
            className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--text-secondary)]"
          >
            Practice
          </button>
          <button
            onClick={() => setTab('history')}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
          >
            History
          </button>
        </div>
        {historyLoading ? (
          <div className="mt-12 flex justify-center">
            <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-6"
          >
            {history && (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  <GlassCard hover={false}>
                    <div className="flex items-center gap-3">
                      <BarChart3 size={24} className="text-[var(--accent)]" />
                      <div>
                        <p className="text-2xl font-semibold">{history.totalAttempts}</p>
                        <p className="text-xs text-[var(--text-secondary)]">Total Attempts</p>
                      </div>
                    </div>
                  </GlassCard>
                  <GlassCard hover={false}>
                    <div className="flex items-center gap-3">
                      <Headphones size={24} className="text-[var(--accent)]" />
                      <div>
                        <p className="text-2xl font-semibold">{history.avgScore}%</p>
                        <p className="text-xs text-[var(--text-secondary)]">Average Score</p>
                      </div>
                    </div>
                  </GlassCard>
                  <GlassCard hover={false}>
                    <div className="flex items-center gap-3">
                      <Zap size={24} className="text-amber-500" />
                      <div>
                        <p className="text-2xl font-semibold">
                          {Object.keys(history.byLevel || {}).length}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">Levels Practiced</p>
                      </div>
                    </div>
                  </GlassCard>
                </div>
                {history.byLevel && Object.keys(history.byLevel).length > 0 && (
                  <GlassCard hover={false}>
                    <h3 className="mb-4 text-sm font-semibold">Score by Level</h3>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(history.byLevel).map(([level, stats]) => (
                        <Badge key={level} level={level} variant="level">
                          {level}: {stats.avgScore}% ({stats.attempts} attempts)
                        </Badge>
                      ))}
                    </div>
                  </GlassCard>
                )}
                <GlassCard hover={false}>
                  <h3 className="mb-4 text-sm font-semibold">Recent Attempts</h3>
                  {(!history.attempts || history.attempts.length === 0) ? (
                    <p className="py-8 text-center text-[var(--text-secondary)]">
                      No attempts yet. Start practicing!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {history.attempts.map((a) => (
                        <div
                          key={a.id}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[var(--bg-tertiary)] p-4"
                        >
                          <div className="flex items-center gap-3">
                            <Badge level={a.cefrLevel} variant="level">{a.cefrLevel}</Badge>
                            <span className="text-xs text-[var(--text-secondary)]">{a.difficulty}</span>
                            <span className="text-xs text-[var(--text-tertiary)]">
                              {formatDate(a.completedAt || a.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {a.score ?? 0}/{a.maxScore ?? 0}
                            </span>
                            {a.timeSpent != null && (
                              <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                                <Clock size={12} />
                                {formatTime(a.timeSpent)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </GlassCard>
              </>
            )}
          </motion.div>
        )}
      </div>
    );
  }

  // ── Render: Practice Tab ────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
      <PageHeader
        title="Listening Practice"
        subtitle="Hören üben – Listen and answer"
        action={
          <button
            onClick={() => {
              sfx.click();
              setTab('history');
            }}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
          >
            <BarChart3 size={16} />
            History
          </button>
        }
      />

      <div className="mt-6 flex gap-2 border-b border-[var(--border)] pb-2">
        <button
          onClick={() => {
            sfx.click();
            setTab('practice');
          }}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium',
            tab === 'practice' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-secondary)]'
          )}
        >
          Practice
        </button>
        <button
          onClick={() => {
            sfx.click();
            setTab('history');
            fetchHistory();
          }}
          className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--text-secondary)]"
        >
          History
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* Phase 1: Configuration */}
        {phase === 'config' && (
          <motion.div
            key="config"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-8 space-y-8"
          >
            <div>
              <h2 className="mb-4 text-sm font-semibold text-[var(--text-secondary)]">CEFR Level</h2>
              <div className="flex flex-wrap gap-2">
                {CEFR_LEVELS.map((level) => (
                  <motion.button
                    key={level}
                    onClick={() => {
                      setCefrLevel(level);
                      sfx.click();
                    }}
                    className={cn(
                      'rounded-full px-5 py-2.5 text-sm font-medium transition-all',
                      cefrLevel === level
                        ? 'bg-[var(--accent)] text-white'
                        : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]/80'
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {level}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-sm font-semibold text-[var(--text-secondary)]">Difficulty</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {DIFFICULTIES.map((d) => {
                  const classes = DIFFICULTY_CARD_CLASSES[d.id];
                  return (
                    <motion.div
                      key={d.id}
                      onClick={() => {
                        setDifficulty(d.id);
                        sfx.click();
                      }}
                      className={cn(
                        'cursor-pointer rounded-2xl border-2 p-5 transition-all',
                        difficulty === d.id
                          ? `${classes.border} ${classes.bg}`
                          : 'border-transparent bg-[var(--bg-tertiary)]/50 hover:border-[var(--border)]'
                      )}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className={cn('mb-2 inline-flex rounded-lg px-2 py-0.5 text-xs font-medium', classes.badge)}>
                        {d.label}
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">{d.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-sm font-semibold text-[var(--text-secondary)]">Vocabulary</h2>
              <div className="flex gap-2 mb-4">
                <motion.button
                  onClick={() => { setVocabMode('all'); sfx.click(); }}
                  className={cn(
                    'rounded-xl px-5 py-2.5 text-sm font-medium transition-all',
                    vocabMode === 'all' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                  )}
                  whileTap={{ scale: 0.98 }}
                >
                  Use All My Words
                </motion.button>
                <motion.button
                  onClick={() => {
                    setVocabMode('select');
                    if (allWords.length === 0) fetchVocabulary();
                    sfx.click();
                  }}
                  className={cn(
                    'rounded-xl px-5 py-2.5 text-sm font-medium transition-all',
                    vocabMode === 'select' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                  )}
                  whileTap={{ scale: 0.98 }}
                >
                  Select Specific Words
                </motion.button>
              </div>

              <AnimatePresence>
                {vocabMode === 'select' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    {vocabLoading ? (
                      <div className="flex justify-center py-6">
                        <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
                      </div>
                    ) : allWords.length === 0 ? (
                      <p className="py-4 text-center text-sm text-[var(--text-tertiary)]">No vocabulary found. Upload words first.</p>
                    ) : (
                      <GlassCard hover={false}>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs text-[var(--text-tertiary)]">{selectedWordIds.size} / {allWords.length} selected</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedWordIds(new Set(allWords.map(w => w.id)))}
                              className="text-xs font-medium text-[var(--accent)]"
                            >
                              Select All
                            </button>
                            <button
                              onClick={() => setSelectedWordIds(new Set())}
                              className="text-xs font-medium text-[var(--text-tertiary)]"
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                        <div className="max-h-52 overflow-y-auto space-y-1 scrollbar-none">
                          {allWords.map((w) => (
                            <label
                              key={w.id}
                              className={cn(
                                'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                                selectedWordIds.has(w.id) ? 'bg-[var(--accent)]/10' : 'hover:bg-[var(--bg-tertiary)]'
                              )}
                            >
                              <input
                                type="checkbox"
                                checked={selectedWordIds.has(w.id)}
                                onChange={() => {
                                  const next = new Set(selectedWordIds);
                                  next.has(w.id) ? next.delete(w.id) : next.add(w.id);
                                  setSelectedWordIds(next);
                                }}
                                className="h-4 w-4 rounded accent-[var(--accent)]"
                              />
                              <span className="text-sm font-medium">{w.word}</span>
                              <span className="text-xs text-[var(--text-tertiary)]">{w.meaning}</span>
                            </label>
                          ))}
                        </div>
                      </GlassCard>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {error && (
              <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            <motion.button
              onClick={handleGenerate}
              disabled={generating || (vocabMode === 'select' && selectedWordIds.size === 0)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] py-4 text-lg font-semibold text-white shadow-lg transition-all hover:opacity-95 disabled:opacity-70"
              whileHover={!generating ? { scale: 1.01 } : {}}
              whileTap={!generating ? { scale: 0.99 } : {}}
            >
              {generating ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Headphones size={24} />
                  Start Listening
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Phase 2: Listening */}
        {phase === 'listening' && (
          <motion.div
            key="listening"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-8 space-y-6"
          >
            <GlassCard hover={false} className="flex flex-col items-center py-12">
              <motion.button
                onClick={isPlaying ? handlePause : handlePlay}
                className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-xl transition-all hover:opacity-90"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPlaying ? <Pause size={40} /> : <Play size={40} className="ml-1" />}
              </motion.button>
              <p className="mt-4 text-sm text-[var(--text-secondary)]">
                {isPlaying ? 'Playing...' : 'Tap to play'}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--text-secondary)]">Speed:</span>
                  {SPEED_OPTIONS.map((s, i) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSpeedIndex(i);
                        sfx.click();
                      }}
                      className={cn(
                        'rounded-full px-3 py-1.5 text-sm font-medium',
                        speedIndex === i
                          ? 'bg-[var(--accent)] text-white'
                          : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                      )}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    handleReplay();
                    sfx.click();
                  }}
                  className="flex items-center gap-2 rounded-xl bg-[var(--bg-tertiary)] px-4 py-2 text-sm font-medium hover:bg-[var(--bg-tertiary)]/80"
                >
                  <RotateCcw size={18} />
                  Replay
                </button>
                <button
                  onClick={() => {
                    setSubtitlesOn((v) => !v);
                    sfx.click();
                  }}
                  className={cn(
                    'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium',
                    subtitlesOn ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                  )}
                >
                  {subtitlesOn ? <Subtitles size={18} /> : <Subtitles size={18} />}
                  Subtitles {subtitlesOn ? 'ON' : 'OFF'}
                </button>
              </div>

              {subtitlesOn && script && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 w-full max-w-2xl rounded-xl bg-[var(--bg-tertiary)] p-6 text-center"
                >
                  <p className="text-base leading-relaxed text-[var(--text-primary)]">{script}</p>
                </motion.div>
              )}
            </GlassCard>

            {canContinue && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleContinueToQuestions}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] py-4 text-lg font-semibold text-white"
              >
                Continue to Questions
                <ChevronRight size={24} />
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Phase 3: Questions */}
        {phase === 'questions' && (
          <motion.div
            key="questions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-8 space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Clock size={16} />
                {formatTime(timerSeconds)}
              </div>
              <div className="h-2 flex-1 max-w-xs mx-4 rounded-full bg-[var(--border)] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[#409CFF]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="text-sm text-[var(--text-secondary)]">
                {currentQuestionIndex + 1} / {questions.length}
              </span>
            </div>

            <button
              onClick={handleReplay}
              className="flex items-center gap-2 rounded-xl bg-[var(--bg-tertiary)] px-4 py-2 text-sm font-medium hover:bg-[var(--bg-tertiary)]/80"
            >
              <RotateCcw size={18} />
              Replay Audio
            </button>

            <GlassCard hover={false} className="space-y-6">
              <AnimatePresence mode="wait">
                {currentQuestion && (
                  <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-lg font-semibold">{currentQuestion.question}</h3>

                    {currentQuestion.type === 'mcq' ? (
                      <div className="mt-6 space-y-3">
                        {currentQuestion.options.map((opt, i) => (
                          <motion.button
                            key={i}
                            onClick={() => handleAnswerMcq(i)}
                            className={cn(
                              'w-full rounded-2xl border-2 px-6 py-4 text-left text-base font-medium transition-all',
                              currentAnswer?.userAnswer === i
                                ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                                : 'border-transparent bg-[var(--bg-tertiary)] hover:border-[var(--border)]'
                            )}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            {opt}
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-6">
                        <input
                          type="text"
                          value={shortAnswerInput}
                          onChange={(e) => handleAnswerShort(e.target.value)}
                          placeholder="Type your answer..."
                          className="w-full rounded-2xl border-2 border-[var(--border)] bg-[var(--bg-tertiary)] px-6 py-4 text-base focus:border-[var(--accent)] focus:outline-none"
                        />
                      </div>
                    )}

                    <motion.button
                      onClick={handleNext}
                      disabled={!canNext}
                      className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] py-4 text-lg font-semibold text-white disabled:opacity-50"
                    >
                      {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Submit'}
                      <ChevronRight size={20} />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </motion.div>
        )}

        {/* Phase 4: Results */}
        {phase === 'results' && results && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-8 space-y-8"
          >
            <GlassCard hover={false} className="flex flex-col items-center py-10">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <ProgressRing
                  progress={results.percentage}
                  size={140}
                  label={`${results.score}/${results.maxScore}`}
                  sublabel={`${results.percentage}%`}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 flex items-center gap-2 rounded-xl bg-amber-500/20 px-6 py-3"
              >
                <Zap size={24} className="text-amber-500" />
                <span className="text-lg font-semibold">+{results.xpEarned} XP</span>
              </motion.div>
            </GlassCard>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Review</h3>
              {results.results.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GlassCard hover={false} className="space-y-3">
                    <p className="font-medium">{r.question}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {r.correct ? (
                          <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />
                        ) : (
                          <XCircle size={18} className="shrink-0 text-red-500" />
                        )}
                        <span className={cn(
                          'text-sm',
                          r.correct ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                        )}>
                          Your answer: {typeof r.userAnswer === 'number'
                            ? r.options[r.userAnswer]
                            : r.userAnswer}
                        </span>
                      </div>
                      {!r.correct && (
                        <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 size={18} className="shrink-0" />
                          Correct: {r.options[r.correctIndex]}
                        </div>
                      )}
                      <p className="text-sm text-[var(--text-secondary)]">{r.explanation}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            {script && (
              <GlassCard hover={false}>
                <h3 className="mb-4 text-lg font-semibold">Full Script</h3>
                <p className="leading-relaxed">
                  {script.split(/\s+/).map((word, i) => {
                    const clean = word.replace(/[.,;:!?]/g, '').toLowerCase();
                    const isNew = newWordsUsed.length > 0 && newWordsUsed.some((nw) => nw.toLowerCase() === clean);
                    return (
                      <span key={i}>
                        <span className={isNew ? 'rounded bg-amber-200/50 px-0.5 dark:bg-amber-700/40' : ''}>
                          {word}
                        </span>
                        {' '}
                      </span>
                    );
                  })}
                </p>
              </GlassCard>
            )}

            <div className="flex flex-wrap gap-4">
              <motion.button
                onClick={handleTryAgain}
                className="flex items-center gap-2 rounded-2xl bg-[var(--accent)] px-6 py-3 font-semibold text-white"
              >
                Try Again
              </motion.button>
              <Link
                href="/progress"
                className="flex items-center gap-2 rounded-2xl bg-[var(--bg-tertiary)] px-6 py-3 font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]/80"
              >
                View History
                <BarChart3 size={18} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
