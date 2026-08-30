'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import {
  Loader2,
  BookOpen,
  PenLine,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  AlertTriangle,
  Lightbulb,
  Check,
  ChevronRight,
  MessageSquare,
  Lock,
  Trophy,
  Star,
  Clock,
  Mic,
  Copy,
  CheckCheck,
  HelpCircle,
  Award,
  Flame,
} from 'lucide-react';
import { sfx } from '@/lib/sounds';
import {
  getGrammarChapterById,
  ALL_GRAMMAR_CHAPTERS,
  type GrammarChapter,
  type GrammarTable,
} from '@/lib/grammar-data';
import {
  getPracticeForChapter,
  type ChapterPractice,
  type MCQQuestion,
} from '@/lib/grammar-practice-data';
import {
  loadGrammarProgress,
  loadPracticeProgress,
  recordChapterVisit,
  toggleChapterComplete,
  recordExercise,
  recordLevelAttempt,
  getLevelState,
  type GrammarProgress,
  type PracticeProgress,
  type LevelResult,
} from '@/lib/grammar-progress';

const TABS = [
  { id: 'theory', label: 'Theory & Rules', icon: BookOpen },
  { id: 'examples', label: 'Examples & Audio', icon: Volume2 },
  { id: 'drills', label: 'Quick Drills', icon: PenLine },
  { id: 'practice', label: '10-Level Practice', icon: Trophy },
  { id: 'speaking', label: 'Speaking Drills', icon: Mic },
  { id: 'ai', label: 'AI Tutor', icon: Sparkles },
] as const;

type TabId = (typeof TABS)[number]['id'];

function speakGerman(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'de-DE';
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

export default function GrammarTopicPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topicId as string;

  const [chapter, setChapter] = useState<GrammarChapter | null>(null);
  const [practiceData, setPracticeData] = useState<ChapterPractice | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('theory');

  const [grammarProgress, setGrammarProgress] = useState<GrammarProgress>({ chapters: {} });
  const [practiceProgress, setPracticeProgress] = useState<PracticeProgress>({ chapters: {} });

  // ─── Quick Drills State ───
  const [drillRevealed, setDrillRevealed] = useState<Record<number, boolean>>({});

  // ─── 10-Level Practice State ───
  const [selectedLevelIdx, setSelectedLevelIdx] = useState<number>(0);
  const [currentQIdx, setCurrentQIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [levelScore, setLevelScore] = useState<number>(0);
  const [levelCompleted, setLevelCompleted] = useState<boolean>(false);

  // ─── AI Prompt Copy State ───
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  useEffect(() => {
    if (!topicId) return;
    const ch = getGrammarChapterById(topicId);
    if (ch) {
      setChapter(ch);
      setPracticeData(getPracticeForChapter(ch.id) || null);
      recordChapterVisit(ch.id);
      setGrammarProgress(loadGrammarProgress());
      setPracticeProgress(loadPracticeProgress());
    }
  }, [topicId]);

  const isCompleted = useMemo(() => {
    if (!chapter) return false;
    return grammarProgress.chapters[chapter.id]?.completedAt != null;
  }, [chapter, grammarProgress]);

  const handleToggleComplete = () => {
    if (!chapter) return;
    toggleChapterComplete(chapter.id);
    setGrammarProgress(loadGrammarProgress());
    sfx.complete();
  };

  const handleCopyAiPrompt = () => {
    if (!chapter?.aiPrompt) return;
    navigator.clipboard.writeText(chapter.aiPrompt);
    setCopiedPrompt(true);
    sfx.click();
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleLaunchChat = () => {
    if (!chapter?.aiPrompt) return;
    try {
      sessionStorage.setItem('pending_ai_prompt', chapter.aiPrompt);
    } catch {}
    router.push('/chat');
  };

  // ─── 10-Level Practice Handlers ───
  const currentLevelQuestions: MCQQuestion[] = useMemo(() => {
    if (!practiceData || !practiceData.levels[selectedLevelIdx]) return [];
    return practiceData.levels[selectedLevelIdx];
  }, [practiceData, selectedLevelIdx]);

  const currentQ: MCQQuestion | undefined = currentLevelQuestions[currentQIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOpt(idx);
    sfx.click();
  };

  const handleCheckAnswer = () => {
    if (selectedOpt === null || !currentQ || isAnswerSubmitted) return;
    const isCorrect = selectedOpt === currentQ.answer;
    setIsAnswerSubmitted(true);

    if (isCorrect) {
      setLevelScore((prev) => prev + 1);
      sfx.correct();
    } else {
      sfx.wrong();
    }
  };

  const handleNextQuestion = () => {
    if (currentQIdx < currentLevelQuestions.length - 1) {
      setCurrentQIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnswerSubmitted(false);
      sfx.swoosh();
    } else {
      finishLevel();
    }
  };

  const finishLevel = () => {
    if (!chapter) return;
    const finalScore = levelScore;
    setLevelCompleted(true);

    recordLevelAttempt(chapter.id, selectedLevelIdx, finalScore);
    setPracticeProgress(loadPracticeProgress());

    if (finalScore >= 7) {
      sfx.levelUp();
    } else {
      sfx.wrong();
    }

    // Also record attempt in backend
    fetch(`/api/grammar/${chapter.id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        levelIndex: selectedLevelIdx,
        score: finalScore,
        maxScore: currentLevelQuestions.length,
      }),
    }).catch(() => {});
  };

  const handleRestartLevel = () => {
    setCurrentQIdx(0);
    setSelectedOpt(null);
    setIsAnswerSubmitted(false);
    setLevelScore(0);
    setLevelCompleted(false);
  };

  const handleSelectLevel = (idx: number) => {
    if (!chapter) return;
    const state = getLevelState(chapter.id, idx, practiceProgress);
    if (state === 'locked') return;

    setSelectedLevelIdx(idx);
    setCurrentQIdx(0);
    setSelectedOpt(null);
    setIsAnswerSubmitted(false);
    setLevelScore(0);
    setLevelCompleted(false);
    sfx.click();
  };

  if (!chapter) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <Loader2 size={36} className="mx-auto animate-spin text-[var(--accent)]" />
        <p className="mt-4 text-sm font-semibold text-[var(--text-secondary)]">Loading grammar chapter...</p>
        <Link href="/grammar" className="btn-3d btn-duo-secondary mt-6 inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Grammar
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ─── Breadcrumb & Top Bar ─── */}
      <div className="mb-6">
        <Link
          href="/grammar"
          className="mb-4 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
        >
          <ArrowLeft size={16} />
          Back to all Grammar Chapters
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-[var(--accent)]/15 px-2.5 py-0.5 text-xs font-black text-[var(--accent)] border border-[var(--accent)]/30">
                Ch. {chapter.number}
              </span>
              <Badge variant="level" level={chapter.cefrLevel || 'A1'}>
                {chapter.cefrLevel || 'A1'}
              </Badge>
              {chapter.difficulty && (
                <span className="text-xs font-bold text-[var(--text-tertiary)] capitalize">
                  • {chapter.difficulty}
                </span>
              )}
              {chapter.estimatedMinutes && (
                <span className="flex items-center gap-1 text-xs font-medium text-[var(--text-tertiary)]">
                  • <Clock size={12} /> {chapter.estimatedMinutes} min
                </span>
              )}
            </div>

            <h1 className="mt-2 text-2xl sm:text-3xl font-black text-[var(--text-primary)] leading-tight">
              {chapter.title}
            </h1>
            <p className="mt-1 text-sm font-medium text-[var(--text-secondary)]">
              {chapter.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={handleToggleComplete}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`btn-3d flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all border ${
                isCompleted
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                  : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-emerald-500 hover:text-emerald-500'
              }`}
            >
              <CheckCircle2 size={18} className={isCompleted ? 'fill-white text-emerald-500' : ''} />
              <span>{isCompleted ? 'Completed' : 'Mark as Done'}</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* ─── Navigation Tabs (Duolingo Style) ─── */}
      <div className="mb-6 flex overflow-x-auto gap-1.5 rounded-2xl bg-[var(--bg-secondary)] p-1.5 border border-[var(--border)] scrollbar-none shadow-sm">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                sfx.click();
              }}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                isActive
                  ? 'bg-[var(--accent)] text-white shadow-md shadow-[var(--accent)]/20'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.id === 'practice' && practiceData && (
                <span className="rounded-full bg-amber-400 px-1.5 py-0.2 text-[10px] font-black text-black">
                  10
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ─── Tab Contents ─── */}
      <AnimatePresence mode="wait">
        {/* ═══ 1. THEORY & RULES ═══ */}
        {activeTab === 'theory' && (
          <motion.div
            key="theory"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Rule Callout Banner */}
            {chapter.rule && (
              <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent p-5 sm:p-6 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  <Lightbulb size={18} />
                  <span>The Fundamental Rule</span>
                </div>
                <p className="mt-2.5 text-base sm:text-lg font-bold text-[var(--text-primary)] leading-relaxed">
                  {chapter.rule}
                </p>
              </div>
            )}

            {/* Overview / Explanation Card */}
            {chapter.explanation && (
              <GlassCard hover={false} className="p-6">
                <h2 className="text-base font-extrabold text-[var(--text-primary)]">Explanation & Concept</h2>
                <p className="mt-2.5 text-sm font-medium text-[var(--text-secondary)] leading-relaxed">
                  {chapter.explanation}
                </p>
              </GlassCard>
            )}

            {/* Theory Breakdown Sections */}
            {chapter.theory?.map((section, idx) => (
              <GlassCard key={idx} hover={false} className="p-6">
                <h3 className="text-base font-extrabold text-[var(--text-primary)]">{section.heading}</h3>
                <div className="mt-3 text-sm font-medium text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                  {section.body}
                </div>
              </GlassCard>
            ))}

            {/* Grammar Reference Table */}
            {chapter.table && (
              <div className="grammar-table-container shadow-sm">
                <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-tertiary)]/50">
                  <h3 className="text-sm font-extrabold text-[var(--text-primary)]">Grammar Reference Table</h3>
                </div>
                <table className="grammar-table">
                  <thead>
                    <tr>
                      {chapter.table.headers.map((h, i) => (
                        <th key={i}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {chapter.table.rows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className={cIdx === 0 ? 'font-bold text-[var(--text-primary)]' : ''}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Important Notes */}
            {chapter.notes && chapter.notes.length > 0 && (
              <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-5 sm:p-6 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Key Observations & Pro-Tips
                </h3>
                <ul className="mt-3 space-y-2.5 text-sm text-[var(--text-secondary)]">
                  {chapter.notes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                      <span className="font-medium leading-relaxed">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Common Mistakes to Avoid */}
            {chapter.mistakes && chapter.mistakes.length > 0 && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 sm:p-6 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-400">
                  <AlertTriangle size={16} />
                  <span>Common Mistakes (Häufige Fehler)</span>
                </div>
                <ul className="mt-3 space-y-2.5 text-sm text-[var(--text-secondary)]">
                  {chapter.mistakes.map((m, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-red-500 font-extrabold">✗</span>
                      <span className="font-medium leading-relaxed">{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Summary Box */}
            {chapter.summary && (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 sm:p-6 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={16} />
                  <span>Chapter Summary</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-[var(--text-primary)] leading-relaxed">
                  {chapter.summary}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* ═══ 2. EXAMPLES & AUDIO ═══ */}
        {activeTab === 'examples' && (
          <motion.div
            key="examples"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
              Listen and repeat to internalize native sentence rhythm ({chapter.examples.length} sentences)
            </p>

            <div className="grid gap-3">
              {chapter.examples.map((ex, idx) => (
                <GlassCard key={idx} hover={false} className="btn-3d flex items-center justify-between gap-4 p-4 sm:p-5">
                  <div className="min-w-0 flex-1">
                    <p className="text-base sm:text-lg font-black text-[var(--text-primary)] leading-snug">{ex.de}</p>
                    <p className="mt-1 text-xs sm:text-sm font-medium text-[var(--text-secondary)]">{ex.en}</p>
                  </div>

                  <button
                    onClick={() => speakGerman(ex.de)}
                    className="btn-3d flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)] text-white hover:brightness-105 transition-all shadow-md"
                    title="Pronounce German audio"
                  >
                    <Volume2 size={20} />
                  </button>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ 3. QUICK DRILLS ═══ */}
        {activeTab === 'drills' && (
          <motion.div
            key="drills"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
              Test your recall on the core concepts of this chapter ({chapter.exercises.length} drills)
            </p>

            <div className="space-y-4">
              {chapter.exercises.map((ex, idx) => {
                const promptText = (ex as any).prompt || (ex as any).question || `Question ${idx + 1}`;
                const answerText = ex.answer;
                const isRevealed = drillRevealed[idx] ?? false;

                return (
                  <GlassCard key={idx} hover={false} className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <span className="rounded-md bg-[var(--bg-tertiary)] px-2 py-0.5 text-[11px] font-black text-[var(--text-tertiary)]">
                          Drill #{idx + 1}
                        </span>
                        <p className="mt-2 text-base font-extrabold text-[var(--text-primary)] leading-snug">
                          {promptText}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setDrillRevealed((prev) => ({ ...prev, [idx]: !prev[idx] }));
                          sfx.click();
                        }}
                        className="btn-3d btn-duo-secondary text-xs shrink-0 self-start"
                      >
                        {isRevealed ? 'Hide Answer' : 'Show Answer'}
                      </button>
                    </div>

                    {isRevealed && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 size={14} />
                          <span>Correct Answer:</span>
                        </div>
                        <p className="mt-1 text-base font-black text-[var(--text-primary)]">{answerText}</p>
                      </motion.div>
                    )}
                  </GlassCard>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ═══ 4. 10-LEVEL PRACTICE (TROPHY DRILLS) ═══ */}
        {activeTab === 'practice' && (
          <motion.div
            key="practice"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {!practiceData ? (
              <GlassCard hover={false} className="py-12 text-center">
                <Trophy size={40} className="mx-auto text-[var(--text-tertiary)]" />
                <p className="mt-3 text-base font-bold">10-Level Practice Not Available</p>
                <p className="mt-1 text-xs text-[var(--text-tertiary)]">This chapter focuses primarily on phonetics & basic foundation drills.</p>
              </GlassCard>
            ) : (
              <>
                {/* Level Ladder Selector (3D Duolingo Ladder) */}
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 sm:p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-xs font-black uppercase tracking-wider text-[var(--text-tertiary)]">
                      Level Ladder (10 Questions Each · Score ≥ 70% to Unlock Next)
                    </span>
                  </div>

                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                    {Array.from({ length: 10 }).map((_, idx) => {
                      const state = getLevelState(chapter.id, idx, practiceProgress);
                      const isSelected = selectedLevelIdx === idx;
                      const res = practiceProgress.chapters[chapter.id]?.[idx];

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectLevel(idx)}
                          disabled={state === 'locked'}
                          className={`btn-3d relative flex flex-col items-center justify-center rounded-xl p-2.5 transition-all text-xs font-black ${
                            isSelected
                              ? 'bg-[var(--accent)] text-white border-2 border-[var(--accent-hover)] ring-2 ring-[var(--accent)]/30'
                              : state === 'passed'
                              ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                              : state === 'unlocked'
                              ? 'border border-[var(--border)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:border-[var(--accent)]'
                              : 'opacity-40 bg-[var(--bg-tertiary)]/40 text-[var(--text-tertiary)] cursor-not-allowed'
                          }`}
                        >
                          {state === 'locked' ? (
                            <Lock size={14} className="mb-0.5" />
                          ) : state === 'passed' ? (
                            <Check size={14} className="mb-0.5" />
                          ) : (
                            <Star size={14} className="mb-0.5" />
                          )}
                          <span>L{idx + 1}</span>
                          {res && res.bestScore > 0 && (
                            <span className="text-[9px] opacity-80">{res.bestScore}/10</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Level Practice Quiz View */}
                {levelCompleted ? (
                  <GlassCard hover={false} className="p-8 text-center">
                    <div className="flex justify-center">
                      {levelScore >= 7 ? (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                          <Trophy size={42} />
                        </div>
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/15 text-amber-500">
                          <RotateCcw size={42} />
                        </div>
                      )}
                    </div>

                    <h3 className="mt-4 text-2xl font-black text-[var(--text-primary)]">
                      {levelScore >= 7 ? 'Level Mastered! 🎉' : 'Keep Practicing!'}
                    </h3>
                    <p className="mt-1.5 text-sm font-semibold text-[var(--text-secondary)]">
                      You scored <span className="font-extrabold text-[var(--text-primary)]">{levelScore}</span> out of{' '}
                      {currentLevelQuestions.length} ({Math.round((levelScore / currentLevelQuestions.length) * 100)}%)
                    </p>

                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      <button
                        onClick={handleRestartLevel}
                        className="btn-3d btn-duo-secondary flex items-center gap-2"
                      >
                        <RotateCcw size={16} />
                        <span>Retry Level {selectedLevelIdx + 1}</span>
                      </button>

                      {levelScore >= 7 && selectedLevelIdx < 9 && (
                        <button
                          onClick={() => handleSelectLevel(selectedLevelIdx + 1)}
                          className="btn-3d btn-duo-primary flex items-center gap-2"
                        >
                          <span>Next Level ({selectedLevelIdx + 2})</span>
                          <ChevronRight size={16} />
                        </button>
                      )}
                    </div>
                  </GlassCard>
                ) : currentQ ? (
                  <GlassCard hover={false} className="p-6 sm:p-7">
                    {/* Progress indicator */}
                    <div className="mb-4 flex items-center justify-between text-xs font-bold text-[var(--text-tertiary)]">
                      <span>
                        Level {selectedLevelIdx + 1} · Question {currentQIdx + 1} of {currentLevelQuestions.length}
                      </span>
                      <span className="rounded-md bg-[var(--bg-tertiary)] px-2 py-0.5 font-black text-[var(--text-primary)]">
                        Score: {levelScore}
                      </span>
                    </div>

                    <div className="mb-6 h-2.5 w-full overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[var(--accent)] to-emerald-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQIdx + 1) / currentLevelQuestions.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>

                    {/* Question Text */}
                    <div className="mb-6">
                      <h3 className="text-lg sm:text-xl font-black text-[var(--text-primary)] leading-snug">
                        {currentQ.q}
                      </h3>
                    </div>

                    {/* Options Grid (3D Duolingo Choice Buttons) */}
                    <div className="grid gap-3">
                      {currentQ.options.map((opt, optIdx) => {
                        const isSelected = selectedOpt === optIdx;
                        const isCorrectOpt = currentQ.answer === optIdx;

                        let btnClass = 'border-[var(--border)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)]';

                        if (isAnswerSubmitted) {
                          if (isCorrectOpt) {
                            btnClass = 'border-emerald-500 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold border-2';
                          } else if (isSelected && !isCorrectOpt) {
                            btnClass = 'border-red-500 bg-red-500/20 text-red-700 dark:text-red-300 font-bold border-2';
                          } else {
                            btnClass = 'opacity-40 border-[var(--border)] bg-[var(--bg-secondary)]';
                          }
                        } else if (isSelected) {
                          btnClass = 'border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)] font-bold border-2';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(optIdx)}
                            disabled={isAnswerSubmitted}
                            className={`btn-3d flex items-center justify-between rounded-xl p-4 text-left text-sm font-semibold transition-all ${btnClass}`}
                          >
                            <span>{opt}</span>
                            {isAnswerSubmitted && isCorrectOpt && <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />}
                            {isAnswerSubmitted && isSelected && !isCorrectOpt && <XCircle size={18} className="text-red-500 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation Box */}
                    {isAnswerSubmitted && currentQ.explanation && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4"
                      >
                        <p className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          Explanation
                        </p>
                        <p className="mt-1 text-sm font-medium text-[var(--text-secondary)]">{currentQ.explanation}</p>
                      </motion.div>
                    )}

                    {/* Action Bar */}
                    <div className="mt-6 flex items-center justify-end gap-3">
                      {!isAnswerSubmitted ? (
                        <button
                          onClick={handleCheckAnswer}
                          disabled={selectedOpt === null}
                          className="btn-3d btn-duo-primary disabled:opacity-50"
                        >
                          Check Answer
                        </button>
                      ) : (
                        <button
                          onClick={handleNextQuestion}
                          className="btn-3d btn-duo-primary flex items-center gap-2"
                        >
                          <span>{currentQIdx < currentLevelQuestions.length - 1 ? 'Next Question' : 'Finish Level'}</span>
                          <ChevronRight size={16} />
                        </button>
                      )}
                    </div>
                  </GlassCard>
                ) : null}
              </>
            )}
          </motion.div>
        )}

        {/* ═══ 5. SPEAKING DRILLS ═══ */}
        {activeTab === 'speaking' && (
          <motion.div
            key="speaking"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
              Oral Fluency Prompts & Speaking Challenges
            </p>

            <div className="grid gap-3">
              {chapter.speakingPrompts.map((prompt, idx) => (
                <GlassCard key={idx} hover={false} className="btn-3d flex items-start gap-4 p-4 sm:p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <Mic size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-black text-[var(--text-tertiary)]">Prompt #{idx + 1}</span>
                    <p className="mt-1 text-base font-bold text-[var(--text-primary)] leading-relaxed">
                      {prompt}
                    </p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ 6. AI TUTOR ═══ */}
        {activeTab === 'ai' && (
          <motion.div
            key="ai"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border-2 border-purple-500/30 bg-purple-500/10 p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500 text-white shadow-lg shadow-purple-500/25">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[var(--text-primary)]">Interactive AI Tutor Drill</h3>
                  <p className="text-xs font-medium text-[var(--text-secondary)]">
                    Practice this exact chapter interactively with conversational corrections and custom pedagogical drills.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 sm:p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[var(--text-tertiary)]">
                    Pedagogical Drill Prompt
                  </span>
                  <button
                    onClick={handleCopyAiPrompt}
                    className="flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] hover:underline"
                  >
                    {copiedPrompt ? <CheckCheck size={14} /> : <Copy size={14} />}
                    <span>{copiedPrompt ? 'Copied!' : 'Copy Prompt'}</span>
                  </button>
                </div>
                <p className="text-xs font-mono text-[var(--text-secondary)] whitespace-pre-line leading-relaxed">
                  {chapter.aiPrompt}
                </p>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={handleLaunchChat}
                  className="btn-3d btn-duo-primary text-sm font-extrabold"
                >
                  <MessageSquare size={16} />
                  <span>Start AI Chat Session</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
