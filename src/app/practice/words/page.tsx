'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { cn } from '@/lib/utils';
import {
  Lock,
  CheckCircle2,
  Volume2,
  Loader2,
  ArrowLeft,
  BookOpen,
  PenLine,
  Pencil,
  Trash2,
  Plus,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { sfx } from '@/lib/sounds';

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
  verbType: string | null;
  auxiliaryType: string | null;
  presentForm: string | null;
  simplePast: string | null;
  perfectForm: string | null;
  learned: boolean;
  batchId: string | null;
}

interface WordBatch {
  id: string;
  userId: string;
  name: string;
  wordCount: number;
  learnedCount: number;
  practiceUnlocked: boolean;
  examUnlocked: boolean;
  createdAt: string;
  words: UserWord[];
}

type FlowMode = 'list' | 'learn' | 'practice' | 'exam' | 'select_words' | 'filters' | 'gender_drill' | 'plural_drill';
type QuestionType = 'meaning' | 'gender' | 'verb_tense' | 'fill_blank' | 'plural';
type DirectionFilter = 'de_to_en' | 'en_to_de' | 'both';
type FormatFilter = 'words' | 'sentence' | 'mixed';
type GrammarFilter = 'gender' | 'plural' | 'verb' | 'mixed_grammar';

const PRONOUNS = ['ich', 'du', 'er', 'wir', 'ihr', 'sie'] as const;
const TENSES = [
  { key: 'Perfekt', getAnswer: (w: UserWord) => w.perfectForm },
  { key: 'Präteritum', getAnswer: (w: UserWord) => w.simplePast },
  { key: 'Präsens', getAnswer: (w: UserWord, pronoun?: string) => (pronoun && w.conjugation ? w.conjugation[pronoun] : null) },
] as const;

function stripArticle(word: string): string {
  return word.replace(/^(der|die|das|ein|eine|einen|einem|einer)\s+/i, '').trim();
}

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

function normalizeAnswer(s: string): string {
  return s.trim().toLowerCase().replace(/[.,;:!?]/g, '');
}

interface QuestionFilters {
  direction: DirectionFilter;
  format: FormatFilter;
  grammar: GrammarFilter;
}

function getQuestionForWord(
  word: UserWord,
  filters?: QuestionFilters
): { type: QuestionType; prompt: string; correctAnswer: string } | null {
  let types: QuestionType[] = [];
  if (filters?.grammar === 'gender' && word.partOfSpeech === 'noun' && word.gender) {
    types = ['gender'];
  } else if (filters?.grammar === 'plural' && word.partOfSpeech === 'noun' && word.pluralForm) {
    return { type: 'plural', prompt: word.word, correctAnswer: word.pluralForm };
  } else if (filters?.grammar === 'verb' && word.partOfSpeech === 'verb') {
    if (word.perfectForm || word.simplePast || word.conjugation) types = ['verb_tense'];
  } else {
    if (word.meaning) types.push('meaning');
    if (word.partOfSpeech === 'noun' && word.gender) types.push('gender');
    if (word.partOfSpeech === 'verb' && (word.perfectForm || word.simplePast || word.conjugation)) types.push('verb_tense');
    if (word.exampleSentence && word.word) types.push('fill_blank');
  }

  if (filters?.format === 'words') types = types.filter((t) => t !== 'fill_blank');
  else if (filters?.format === 'sentence') types = types.filter((t) => t === 'fill_blank');
  if (types.length === 0) return { type: 'meaning', prompt: word.word, correctAnswer: word.meaning };

  const type = types[Math.floor(Math.random() * types.length)];

  if (type === 'meaning') {
    const deToEn = filters?.direction === 'de_to_en' || (filters?.direction === 'both' && Math.random() > 0.5);
    return deToEn
      ? { type: 'meaning', prompt: word.word, correctAnswer: word.meaning }
      : { type: 'meaning', prompt: word.meaning, correctAnswer: word.word };
  }
  if (type === 'gender') {
    const article = word.gender === 'masculine' ? 'der' : word.gender === 'feminine' ? 'die' : 'das';
    return { type: 'gender', prompt: stripArticle(word.word), correctAnswer: article };
  }
  if (type === 'verb_tense') {
    const tense = TENSES[Math.floor(Math.random() * TENSES.length)];
    if (tense.key === 'Präsens') {
      const pronoun = PRONOUNS[Math.floor(Math.random() * PRONOUNS.length)];
      const ans = tense.getAnswer(word, pronoun);
      if (ans) return { type: 'verb_tense', prompt: `${word.word} - ${tense.key} (${pronoun})`, correctAnswer: ans };
    } else {
      const ans = tense.getAnswer(word);
      if (ans) return { type: 'verb_tense', prompt: `${word.word} - ${tense.key}`, correctAnswer: ans };
    }
    return { type: 'meaning', prompt: word.word, correctAnswer: word.meaning };
  }
  if (type === 'fill_blank') {
    const blanked = (word.exampleSentence || '').replace(new RegExp(word.word, 'gi'), '___');
    return { type: 'fill_blank', prompt: blanked, correctAnswer: word.word };
  }
  return { type: 'meaning', prompt: word.word, correctAnswer: word.meaning };
}

function checkAnswer(type: QuestionType, userAnswer: string, correctAnswer: string): boolean {
  const u = normalizeAnswer(userAnswer);
  const c = normalizeAnswer(correctAnswer);
  if (type === 'meaning') return matchesMeaning(userAnswer, correctAnswer);
  if (type === 'plural') return u === c;
  return u === c;
}

export default function PracticeWordsPage() {
  const [batches, setBatches] = useState<WordBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [flowMode, setFlowMode] = useState<FlowMode>('list');
  const [selectedBatch, setSelectedBatch] = useState<WordBatch | null>(null);

  // Learn flow
  const [learnIndex, setLearnIndex] = useState(0);
  const [xpFloat, setXpFloat] = useState<number | null>(null);

  // Practice flow
  const [practiceWords, setPracticeWords] = useState<UserWord[]>([]);
  const [practiceQuestions, setPracticeQuestions] = useState<Array<{ type: QuestionType; prompt: string; correctAnswer: string }>>([]);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceInput, setPracticeInput] = useState('');
  const [practiceAnswered, setPracticeAnswered] = useState(false);
  const [practiceCorrect, setPracticeCorrect] = useState(false);
  const [practiceCorrectCount, setPracticeCorrectCount] = useState(0);
  const [practiceComplete, setPracticeComplete] = useState(false);

  // Exam flow
  const [examWords, setExamWords] = useState<UserWord[]>([]);
  const [examQuestions, setExamQuestions] = useState<Array<{ word: UserWord; type: QuestionType; prompt: string; correctAnswer: string }>>([]);
  const [examIndex, setExamIndex] = useState(0);
  const [examInput, setExamInput] = useState('');
  const [examAnswers, setExamAnswers] = useState<Array<{ wordId: string; type: string; userAnswer: string; correctAnswer: string; correct: boolean }>>([]);
  const [examTimeLeft, setExamTimeLeft] = useState(60);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examResult, setExamResult] = useState<{
    score: number;
    maxScore: number;
    xpEarned: number;
    vocabAccuracy: number | null;
    genderAccuracy: number | null;
    verbAccuracy: number | null;
    answers: Array<{ wordId: string; type: string; userAnswer: string; correctAnswer: string; correct: boolean }>;
  } | null>(null);

  // Word selection & filters
  const [selectedWordIds, setSelectedWordIds] = useState<Set<string>>(new Set());
  const [directionFilter, setDirectionFilter] = useState<DirectionFilter>('both');
  const [formatFilter, setFormatFilter] = useState<FormatFilter>('mixed');
  const [grammarFilter, setGrammarFilter] = useState<GrammarFilter>('mixed_grammar');
  const [useAiQuestions, setUseAiQuestions] = useState(false);
  const [pendingMode, setPendingMode] = useState<'practice' | 'exam'>('practice');

  // Batch management
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null);
  const [editingBatchName, setEditingBatchName] = useState('');
  const [deleteConfirmBatch, setDeleteConfirmBatch] = useState<WordBatch | null>(null);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('');
  const [addWordsBatch, setAddWordsBatch] = useState<WordBatch | null>(null);
  const [addWordsInput, setAddWordsInput] = useState('');
  const [addWordsLoading, setAddWordsLoading] = useState(false);

  // Gender & Plural drill
  const [drillWords, setDrillWords] = useState<UserWord[]>([]);
  const [drillIndex, setDrillIndex] = useState(0);
  const [drillInput, setDrillInput] = useState('');
  const [drillAnswered, setDrillAnswered] = useState(false);
  const [drillCorrect, setDrillCorrect] = useState(false);
  const [drillCorrectCount, setDrillCorrectCount] = useState(0);
  const [drillComplete, setDrillComplete] = useState(false);
  const [aiQuestionLoading, setAiQuestionLoading] = useState(false);
  const [aiGeneratedQuestion, setAiGeneratedQuestion] = useState<{
    question: string;
    correct_answer: string;
    explanation?: string;
  } | null>(null);

  const fetchBatches = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/practice/batches');
      const data = await res.json();
      setBatches(data.batches || []);
    } catch {
      setBatches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  // Fetch AI question when in practice with AI mode
  useEffect(() => {
    if (
      flowMode !== 'practice' ||
      !useAiQuestions ||
      !practiceWords[practiceIndex] ||
      practiceComplete
    ) {
      setAiGeneratedQuestion(null);
      return;
    }
    const word = practiceWords[practiceIndex];
    setAiQuestionLoading(true);
    setAiGeneratedQuestion(null);
    fetch('/api/practice/generate-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wordId: word.id,
        word: word.word,
        meaning: word.meaning,
        partOfSpeech: word.partOfSpeech,
        gender: word.gender,
        conjugation: word.conjugation,
        pluralForm: word.pluralForm,
        questionType: grammarFilter,
        direction: directionFilter,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        setAiGeneratedQuestion({
          question: data.question || word.word,
          correct_answer: data.correct_answer || word.meaning,
          explanation: data.explanation,
        });
      })
      .catch(() => {
        const fallback = getQuestionForWord(word, filters);
        setAiGeneratedQuestion(
          fallback
            ? { question: fallback.prompt, correct_answer: fallback.correctAnswer }
            : { question: word.word, correct_answer: word.meaning }
        );
      })
      .finally(() => setAiQuestionLoading(false));
  }, [flowMode, useAiQuestions, practiceIndex, practiceWords, practiceComplete, grammarFilter, directionFilter]);

  // Exam timer
  useEffect(() => {
    if (flowMode !== 'exam' || examSubmitted || examQuestions.length === 0) return;
    const t = setInterval(() => {
      setExamTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [flowMode, examSubmitted, examQuestions.length]);

  const handleExamSubmit = useCallback(async () => {
    if (examSubmitted || !selectedBatch) return;
    setExamSubmitted(true);

    const currentQ = examQuestions[examIndex];
    const userAns = examInput.trim();
    const correct = currentQ ? checkAnswer(currentQ.type, userAns, currentQ.correctAnswer) : false;
    const newAnswers = [...examAnswers];
    if (currentQ) {
      newAnswers.push({
        wordId: currentQ.word.id,
        type: currentQ.type,
        userAnswer: userAns,
        correctAnswer: currentQ.correctAnswer,
        correct,
      });
    }

    for (let i = examIndex + 1; i < examQuestions.length; i++) {
      const q = examQuestions[i];
      newAnswers.push({
        wordId: q.word.id,
        type: q.type,
        userAnswer: '',
        correctAnswer: q.correctAnswer,
        correct: false,
      });
    }

    const timeSpent = 60 - examTimeLeft;
    try {
      const res = await fetch(`/api/practice/batches/${selectedBatch.id}/exam`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: newAnswers, timeSpent }),
      });
      const data = await res.json();
      setExamResult({
        score: data.score ?? 0,
        maxScore: data.maxScore ?? 0,
        xpEarned: data.xpEarned ?? 0,
        vocabAccuracy: data.vocabAccuracy ?? null,
        genderAccuracy: data.genderAccuracy ?? null,
        verbAccuracy: data.verbAccuracy ?? null,
        answers: newAnswers,
      });
      sfx.complete();
    } catch {
      setExamResult({
        score: newAnswers.filter((a) => a.correct).length,
        maxScore: newAnswers.length,
        xpEarned: 0,
        vocabAccuracy: null,
        genderAccuracy: null,
        verbAccuracy: null,
        answers: newAnswers,
      });
    }
  }, [examSubmitted, selectedBatch, examIndex, examInput, examQuestions, examAnswers, examTimeLeft]);

  // Auto-submit exam when timer expires
  useEffect(() => {
    if (flowMode === 'exam' && examTimeLeft === 0 && !examSubmitted && selectedBatch && examQuestions.length > 0) {
      handleExamSubmit();
    }
  }, [flowMode, examTimeLeft, examSubmitted, selectedBatch, examQuestions.length, handleExamSubmit]);

  const startLearn = (batch: WordBatch) => {
    if (!batch.words.length) return;
    setSelectedBatch(batch);
    setFlowMode('learn');
    setLearnIndex(0);
    setXpFloat(null);
  };

  const filters: QuestionFilters = { direction: directionFilter, format: formatFilter, grammar: grammarFilter };

  const startPractice = (batch: WordBatch) => {
    if (!batch.practiceUnlocked) return;
    setSelectedBatch(batch);
    setSelectedWordIds(new Set(batch.words.map((w) => w.id)));
    setPendingMode('practice');
    setFlowMode('select_words');
  };

  const startExam = (batch: WordBatch) => {
    if (!batch.examUnlocked) return;
    setSelectedBatch(batch);
    setSelectedWordIds(new Set(batch.words.map((w) => w.id)));
    setPendingMode('exam');
    setFlowMode('select_words');
  };

  const proceedFromSelectWords = () => {
    if (!selectedBatch) return;
    const selected = selectedBatch.words.filter((w) => selectedWordIds.has(w.id));
    if (selected.length === 0) return;
    setFlowMode('filters');
  };

  const proceedFromFilters = async () => {
    if (!selectedBatch) return;
    const selected = selectedBatch.words.filter((w) => selectedWordIds.has(w.id));
    if (selected.length === 0) return;
    const shuffled = [...selected].sort(() => Math.random() - 0.5);
    const unlearned = selected.filter((w) => !w.learned);
    const toUse = pendingMode === 'practice' && unlearned.length > 0 ? unlearned : selected;
    const shuffledToUse = [...toUse].sort(() => Math.random() - 0.5);

    if (pendingMode === 'practice') {
      const pairs = shuffledToUse
        .map((w) => ({ word: w, q: getQuestionForWord(w, filters) }))
        .filter((p): p is { word: UserWord; q: { type: QuestionType; prompt: string; correctAnswer: string } } => p.q !== null);
      if (pairs.length === 0) return;
      setPracticeWords(pairs.map((p) => p.word));
      setPracticeQuestions(pairs.map((p) => p.q));
      setPracticeIndex(0);
      setPracticeInput('');
      setPracticeAnswered(false);
      setPracticeCorrectCount(0);
      setPracticeComplete(false);
      setFlowMode('practice');
    } else {
      const questions: Array<{ word: UserWord; type: QuestionType; prompt: string; correctAnswer: string }> = [];
      for (const w of shuffled) {
        const q = getQuestionForWord(w, filters);
        if (q) questions.push({ word: w, ...q });
      }
      setExamWords(shuffled);
      setExamQuestions(questions);
      setExamIndex(0);
      setExamInput('');
      setExamAnswers([]);
      setExamTimeLeft(60);
      setExamSubmitted(false);
      setExamResult(null);
      setFlowMode('exam');
    }
  };

  const startGenderDrill = (batch: WordBatch) => {
    const nouns = batch.words.filter((w) => w.partOfSpeech === 'noun' && w.gender);
    if (nouns.length === 0) return;
    setSelectedBatch(batch);
    setDrillWords([...nouns].sort(() => Math.random() - 0.5));
    setDrillIndex(0);
    setDrillInput('');
    setDrillAnswered(false);
    setDrillCorrectCount(0);
    setDrillComplete(false);
    setFlowMode('gender_drill');
  };

  const startPluralDrill = (batch: WordBatch) => {
    const nouns = batch.words.filter((w) => w.partOfSpeech === 'noun' && w.pluralForm);
    if (nouns.length === 0) return;
    setSelectedBatch(batch);
    setDrillWords([...nouns].sort(() => Math.random() - 0.5));
    setDrillIndex(0);
    setDrillInput('');
    setDrillAnswered(false);
    setDrillCorrectCount(0);
    setDrillComplete(false);
    setFlowMode('plural_drill');
  };

  const handleBatchRename = async (batchId: string, newName: string) => {
    try {
      await fetch(`/api/practice/batches/${batchId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() }),
      });
      setEditingBatchId(null);
      fetchBatches();
      sfx.correct();
    } catch {
      toast.error('Failed to rename');
    }
  };

  const handleBatchDelete = async (batch: WordBatch) => {
    if (deleteConfirmInput !== 'RESET') return;
    try {
      await fetch(`/api/practice/batches/${batch.id}`, { method: 'DELETE' });
      setDeleteConfirmBatch(null);
      setDeleteConfirmInput('');
      fetchBatches();
      setFlowMode('list');
      setSelectedBatch(null);
      toast.success('Batch deleted');
      sfx.complete();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleAddWords = async () => {
    if (!addWordsBatch || !addWordsInput.trim()) return;
    setAddWordsLoading(true);
    try {
      const res = await fetch(`/api/practice/batches/${addWordsBatch.id}/words`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words: addWordsInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setAddWordsBatch(null);
      setAddWordsInput('');
      fetchBatches();
      toast.success(`Added ${data.added ?? 0} words`);
      sfx.complete();
    } catch {
      toast.error('Failed to add words');
    } finally {
      setAddWordsLoading(false);
    }
  };

  const handleLearnNext = async () => {
    if (!selectedBatch) return;
    const word = selectedBatch.words[learnIndex];
    if (!word) return;

    sfx.xp();
    setXpFloat(Date.now());

    try {
      await fetch(`/api/practice/batches/${selectedBatch.id}/learn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wordId: word.id }),
      });
    } catch {}

    if (learnIndex + 1 >= selectedBatch.words.length) {
      sfx.complete();
      setTimeout(() => {
        setFlowMode('list');
        setSelectedBatch(null);
        fetchBatches();
      }, 1500);
    } else {
      sfx.swoosh();
      setLearnIndex((i) => i + 1);
      setXpFloat(null);
    }
  };

  const handlePracticeCheck = () => {
    const correctAnswer =
      useAiQuestions && aiGeneratedQuestion
        ? aiGeneratedQuestion.correct_answer
        : practiceQuestions[practiceIndex]?.correctAnswer;
    if (!correctAnswer) return;

    const correct = useAiQuestions && aiGeneratedQuestion
      ? matchesMeaning(practiceInput, correctAnswer) || normalizeAnswer(practiceInput) === normalizeAnswer(correctAnswer)
      : checkAnswer(practiceQuestions[practiceIndex]!.type, practiceInput, correctAnswer);
    setPracticeCorrect(correct);
    setPracticeAnswered(true);
    correct ? sfx.correct() : sfx.wrong();
    if (correct) setPracticeCorrectCount((c) => c + 1);
  };

  const handlePracticeNext = async () => {
    const correctCount = practiceCorrectCount + (practiceCorrect ? 1 : 0);
    if (practiceIndex + 1 >= practiceWords.length) {
      try {
        await fetch(`/api/practice/batches/${selectedBatch!.id}/practice`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correctCount, totalCount: practiceWords.length }),
        });
      } catch {}
      const pct = correctCount / practiceWords.length;
      if (pct >= 0.7) sfx.levelUp();
      setPracticeComplete(true);
    } else {
      setPracticeIndex((i) => i + 1);
      setPracticeInput('');
      setPracticeAnswered(false);
      sfx.swoosh();
    }
  };

  const speak = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'de-DE';
    u.rate = 0.85;
    speechSynthesis.speak(u);
  };

  const genderColor = (g: string | null) => {
    if (!g) return '';
    if (g === 'masculine') return 'text-blue-600 dark:text-blue-400';
    if (g === 'feminine') return 'text-pink-600 dark:text-pink-400';
    return 'text-amber-600 dark:text-amber-400';
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
      <AnimatePresence mode="wait">
        {flowMode === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PageHeader
              title="Practice the Word"
              subtitle="Learn → Practice → Exam"
            />

            {loading ? (
              <div className="mt-10 flex flex-col items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
                <p className="mt-4 text-sm text-[var(--text-secondary)]">Loading batches...</p>
              </div>
            ) : batches.length === 0 ? (
              <motion.div
                className="mt-10 rounded-2xl border border-dashed border-[var(--border)] py-16 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <BookOpen size={48} className="mx-auto text-[var(--text-tertiary)]" />
                <p className="mt-4 text-[var(--text-secondary)]">No word batches yet</p>
                <p className="mt-1 text-sm text-[var(--text-tertiary)]">
                  Add words in Vocabulary to create batches
                </p>
              </motion.div>
            ) : (
              <motion.div
                className="mt-10 space-y-6"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
              >
                {batches.map((batch, i) => (
                  <motion.div
                    key={batch.id}
                    variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                    className="group"
                  >
                    <GlassCard hover={false} className="overflow-hidden">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0 flex-1">
                          {editingBatchId === batch.id ? (
                            <input
                              type="text"
                              value={editingBatchName}
                              onChange={(e) => setEditingBatchName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleBatchRename(batch.id, editingBatchName);
                                if (e.key === 'Escape') setEditingBatchId(null);
                              }}
                              onBlur={() => editingBatchId && handleBatchRename(batch.id, editingBatchName)}
                              className="input-field w-full text-lg font-semibold"
                              autoFocus
                            />
                          ) : (
                            <h3 className="text-lg font-semibold">{batch.name}</h3>
                          )}
                          <p className="mt-1 text-sm text-[var(--text-secondary)]">
                            {batch.learnedCount} / {batch.wordCount} words ·{' '}
                            {new Date(batch.createdAt).toLocaleDateString('de-DE')}
                          </p>
                          <div className="mt-3 h-2 w-full max-w-[200px] overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[#5856D6]"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(batch.learnedCount / batch.wordCount) * 100}%`,
                              }}
                              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
                            <motion.button
                              onClick={() => {
                                setEditingBatchId(batch.id);
                                setEditingBatchName(batch.name);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                              whileTap={{ scale: 0.98 }}
                            >
                              <Pencil size={14} />
                              Rename
                            </motion.button>
                            <motion.button
                              onClick={() => setDeleteConfirmBatch(batch)}
                              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--danger)] hover:bg-[var(--danger)]/10"
                              whileTap={{ scale: 0.98 }}
                            >
                              <Trash2 size={14} />
                              Delete
                            </motion.button>
                            <motion.button
                              onClick={() => setAddWordsBatch(batch)}
                              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--accent)] hover:bg-[var(--accent)]/10"
                              whileTap={{ scale: 0.98 }}
                            >
                              <Plus size={14} />
                              Add Words
                            </motion.button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <motion.button
                            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
                            onClick={() => startLearn(batch)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                              background: 'var(--accent)',
                              color: 'white',
                            }}
                          >
                            {batch.learnedCount >= batch.wordCount ? (
                              <CheckCircle2 size={18} />
                            ) : (
                              <BookOpen size={18} />
                            )}
                            Learn
                          </motion.button>
                          <motion.button
                            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                              batch.practiceUnlocked
                                ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border)]'
                                : 'cursor-not-allowed bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] opacity-60'
                            }`}
                            onClick={() => batch.practiceUnlocked && startPractice(batch)}
                            disabled={!batch.practiceUnlocked}
                            whileHover={batch.practiceUnlocked ? { scale: 1.02 } : undefined}
                            whileTap={batch.practiceUnlocked ? { scale: 0.98 } : undefined}
                          >
                            {batch.practiceUnlocked ? (
                              <PenLine size={18} />
                            ) : (
                              <Lock size={18} />
                            )}
                            Practice
                          </motion.button>
                          <motion.button
                            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                              batch.examUnlocked
                                ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border)]'
                                : 'cursor-not-allowed bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] opacity-60'
                            }`}
                            onClick={() => batch.examUnlocked && startExam(batch)}
                            disabled={!batch.examUnlocked}
                            whileHover={batch.examUnlocked ? { scale: 1.02 } : undefined}
                            whileTap={batch.examUnlocked ? { scale: 0.98 } : undefined}
                          >
                            {batch.examUnlocked ? (
                              <CheckCircle2 size={18} />
                            ) : (
                              <Lock size={18} />
                            )}
                            Exam
                          </motion.button>
                          {batch.words.some((w) => w.partOfSpeech === 'noun' && w.gender) && (
                            <motion.button
                              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border)]"
                              onClick={() => startGenderDrill(batch)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Gender Drill
                            </motion.button>
                          )}
                          {batch.words.some((w) => w.partOfSpeech === 'noun' && w.pluralForm) && (
                            <motion.button
                              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border)]"
                              onClick={() => startPluralDrill(batch)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Plural Drill
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {flowMode === 'select_words' && selectedBatch && (
          <motion.div
            key="select_words"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <button
              onClick={() => { setFlowMode('list'); setSelectedBatch(null); }}
              className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <GlassCard hover={false}>
              <h2 className="text-lg font-semibold">Select words to practice</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Choose which words to include in your {pendingMode} session
              </p>
              <div className="mt-4 flex gap-2">
                <motion.button
                  onClick={() => setSelectedWordIds(new Set(selectedBatch.words.map((w) => w.id)))}
                  className="btn-secondary text-sm"
                  whileTap={{ scale: 0.98 }}
                >
                  Select All
                </motion.button>
                <motion.button
                  onClick={() => setSelectedWordIds(new Set())}
                  className="btn-secondary text-sm"
                  whileTap={{ scale: 0.98 }}
                >
                  Deselect All
                </motion.button>
              </div>
              <div className="mt-4 max-h-64 overflow-y-auto rounded-xl border border-[var(--border)] p-4">
                <div className="flex flex-col gap-2">
                  {selectedBatch.words.map((w) => (
                    <label
                      key={w.id}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-[var(--bg-tertiary)]"
                    >
                      <input
                        type="checkbox"
                        checked={selectedWordIds.has(w.id)}
                        onChange={(e) => {
                          const next = new Set(selectedWordIds);
                          if (e.target.checked) next.add(w.id);
                          else next.delete(w.id);
                          setSelectedWordIds(next);
                        }}
                        className="h-5 w-5 rounded border-[var(--border)]"
                      />
                      <span className="font-medium">{w.word}</span>
                      <span className="text-sm text-[var(--text-secondary)]">— {w.meaning}</span>
                    </label>
                  ))}
                </div>
              </div>
              {selectedWordIds.size === 0 && (
                <p className="mt-3 text-sm text-[var(--danger)]">Select at least one word</p>
              )}
              <motion.button
                className="btn-primary mt-4"
                onClick={proceedFromSelectWords}
                disabled={selectedWordIds.size === 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue
              </motion.button>
            </GlassCard>
          </motion.div>
        )}

        {flowMode === 'filters' && selectedBatch && (
          <motion.div
            key="filters"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <button
              onClick={() => setFlowMode('select_words')}
              className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <GlassCard hover={false}>
              <h2 className="text-lg font-semibold">Practice filters</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Customize how questions appear
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs font-medium text-[var(--text-secondary)]">Direction</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(['de_to_en', 'en_to_de', 'both'] as const).map((d) => (
                      <motion.button
                        key={d}
                        onClick={() => setDirectionFilter(d)}
                        className={cn(
                          'rounded-xl px-4 py-2 text-sm font-medium transition-all',
                          directionFilter === d
                            ? 'bg-[var(--accent)] text-white'
                            : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
                        )}
                        whileTap={{ scale: 0.98 }}
                      >
                        {d === 'de_to_en' ? 'German → English' : d === 'en_to_de' ? 'English → German' : 'Both'}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--text-secondary)]">Format</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(['words', 'sentence', 'mixed'] as const).map((f) => (
                      <motion.button
                        key={f}
                        onClick={() => setFormatFilter(f)}
                        className={cn(
                          'rounded-xl px-4 py-2 text-sm font-medium transition-all',
                          formatFilter === f
                            ? 'bg-[var(--accent)] text-white'
                            : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
                        )}
                        whileTap={{ scale: 0.98 }}
                      >
                        {f === 'words' ? 'Words Only' : f === 'sentence' ? 'Sentence Fill-in' : 'Mixed'}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--text-secondary)]">Grammar focus</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(['gender', 'plural', 'verb', 'mixed_grammar'] as const).map((g) => (
                      <motion.button
                        key={g}
                        onClick={() => setGrammarFilter(g)}
                        className={cn(
                          'rounded-xl px-4 py-2 text-sm font-medium transition-all',
                          grammarFilter === g
                            ? 'bg-[var(--accent)] text-white'
                            : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
                        )}
                        whileTap={{ scale: 0.98 }}
                      >
                        {g === 'gender' ? 'Gender (der/die/das)' : g === 'plural' ? 'Plural' : g === 'verb' ? 'Verb Conjugation' : 'Mixed'}
                      </motion.button>
                    ))}
                  </div>
                </div>
                {pendingMode === 'practice' && (
                  <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-4">
                    <Sparkles size={20} className="text-[var(--accent)]" />
                    <div>
                      <p className="font-medium">AI Questions</p>
                      <p className="text-xs text-[var(--text-secondary)]">Generate unique questions with AI</p>
                    </div>
                    <motion.button
                      onClick={() => setUseAiQuestions(!useAiQuestions)}
                      className={cn(
                        'relative h-8 w-14 rounded-full transition-colors',
                        useAiQuestions ? 'bg-[var(--accent)]' : 'bg-[var(--bg-tertiary)]'
                      )}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.span
                        className="absolute top-1 h-6 w-6 rounded-full bg-white shadow"
                        animate={{ x: useAiQuestions ? 24 : 2 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        style={{ left: 0 }}
                      />
                    </motion.button>
                  </div>
                )}
              </div>

              <motion.button
                className="btn-primary mt-6"
                onClick={proceedFromFilters}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start {pendingMode === 'practice' ? 'Practice' : 'Exam'}
              </motion.button>
            </GlassCard>
          </motion.div>
        )}

        {flowMode === 'learn' && selectedBatch && (
          <motion.div
            key="learn"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <button
              onClick={() => {
                setFlowMode('list');
                setSelectedBatch(null);
              }}
              className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <div className="mb-6 flex items-center gap-4 text-sm">
              <span className="shrink-0 text-[var(--text-tertiary)]">
                {learnIndex + 1} / {selectedBatch.words.length}
              </span>
              <div className="h-2 min-w-0 flex-1 max-w-[200px] overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                <motion.div
                  layoutId="learn-progress"
                  className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[#5856D6]"
                  animate={{
                    width: `${((learnIndex + 1) / selectedBatch.words.length) * 100}%`,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              </div>
            </div>

            {learnIndex < selectedBatch.words.length ? (
              <motion.div
                key={selectedBatch.words[learnIndex]?.id}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 0 }}
                className="flashcard-flip"
              >
                <GlassCard hover={false} className="relative overflow-hidden">
                  {xpFloat && (
                    <motion.span
                      className="absolute right-6 top-6 text-sm font-bold text-[var(--accent)]"
                      initial={{ opacity: 1, y: 0 }}
                      animate={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.8 }}
                    >
                      +10 XP
                    </motion.span>
                  )}
                  <div className="flex flex-col items-center text-center">
                    <motion.h2
                      className="text-4xl font-bold tracking-tight"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      {selectedBatch.words[learnIndex]?.word}
                    </motion.h2>
                    <p className="mt-4 text-lg text-[var(--text-secondary)]">
                      {selectedBatch.words[learnIndex]?.meaning}
                    </p>
                    {selectedBatch.words[learnIndex]?.exampleSentence && (
                      <p className="mt-3 text-sm italic text-[var(--text-tertiary)]">
                        „{selectedBatch.words[learnIndex]?.exampleSentence}"
                      </p>
                    )}
                    {selectedBatch.words[learnIndex]?.gender && (
                      <Badge
                        className={`mt-3 ${genderColor(selectedBatch.words[learnIndex]?.gender ?? null)}`}
                      >
                        {selectedBatch.words[learnIndex]?.gender === 'masculine'
                          ? 'der'
                          : selectedBatch.words[learnIndex]?.gender === 'feminine'
                            ? 'die'
                            : 'das'}
                      </Badge>
                    )}
                    {selectedBatch.words[learnIndex]?.partOfSpeech === 'verb' && (
                      <div className="mt-4 w-full max-w-sm overflow-hidden rounded-xl border border-[var(--border)]">
                        <table className="w-full text-left text-sm">
                          <tbody>
                            {selectedBatch.words[learnIndex]?.presentForm && (
                              <tr>
                                <td className="border-b border-[var(--border)] px-4 py-2 text-[var(--text-tertiary)]">Präsens</td>
                                <td className="border-b border-[var(--border)] px-4 py-2">{selectedBatch.words[learnIndex]?.presentForm}</td>
                              </tr>
                            )}
                            {selectedBatch.words[learnIndex]?.simplePast && (
                              <tr>
                                <td className="border-b border-[var(--border)] px-4 py-2 text-[var(--text-tertiary)]">Präteritum</td>
                                <td className="border-b border-[var(--border)] px-4 py-2">{selectedBatch.words[learnIndex]?.simplePast}</td>
                              </tr>
                            )}
                            {selectedBatch.words[learnIndex]?.perfectForm && (
                              <tr>
                                <td className="px-4 py-2 text-[var(--text-tertiary)]">Perfekt</td>
                                <td className="px-4 py-2">{selectedBatch.words[learnIndex]?.perfectForm}</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                    <button
                      onClick={() => speak(selectedBatch.words[learnIndex]?.word ?? '')}
                      className="mt-6 rounded-full p-3 transition-colors hover:bg-[var(--bg-tertiary)]"
                    >
                      <Volume2 size={24} className="text-[var(--accent)]" />
                    </button>
                    <motion.button
                      className="btn-primary mt-6"
                      onClick={handleLearnNext}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Next
                    </motion.button>
                  </div>
                </GlassCard>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-16"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  <CheckCircle2 size={64} className="text-[var(--success)]" />
                </motion.div>
                <h2 className="mt-6 text-2xl font-bold">All words learned!</h2>
                <p className="mt-2 text-[var(--text-secondary)]">Practice Test unlocked!</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {flowMode === 'practice' && selectedBatch && (
          <motion.div
            key="practice"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <button
              onClick={() => {
                setFlowMode('list');
                setSelectedBatch(null);
              }}
              className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            {!practiceComplete ? (
              <>
                <div className="mb-6 flex items-center justify-between text-sm">
                  <span className="text-[var(--text-tertiary)]">
                    {practiceIndex + 1} / {practiceWords.length}
                  </span>
                  <span className="text-[var(--accent)] font-medium">
                    {practiceCorrectCount} correct
                  </span>
                </div>
                <div className="h-2 mb-6 w-full overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[#5856D6]"
                    animate={{
                      width: `${((practiceIndex + 1) / practiceWords.length) * 100}%`,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                </div>

                {(practiceQuestions[practiceIndex] || aiGeneratedQuestion) && (
                  <motion.div
                    key={practiceWords[practiceIndex]?.id ?? practiceIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <GlassCard hover={false}>
                      {aiQuestionLoading ? (
                        <div className="flex flex-col items-center py-12">
                          <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
                          <p className="mt-4 text-sm text-[var(--text-secondary)]">Generating question...</p>
                        </div>
                      ) : (() => {
                        const q = useAiQuestions && aiGeneratedQuestion
                          ? {
                              type: 'meaning' as QuestionType,
                              prompt: aiGeneratedQuestion.question,
                              correctAnswer: aiGeneratedQuestion.correct_answer,
                            }
                          : practiceQuestions[practiceIndex];
                        if (!q) return null;
                        return (
                          <>
                            <p className="text-sm text-[var(--text-tertiary)]">
                              {useAiQuestions && aiGeneratedQuestion ? 'Answer the question' : (
                                <>
                                  {q.type === 'meaning' && 'What does this mean?'}
                                  {q.type === 'gender' && 'What is the article?'}
                                  {q.type === 'verb_tense' && 'Type the correct form'}
                                  {q.type === 'fill_blank' && 'Fill in the blank'}
                                </>
                              )}
                            </p>
                            <h2 className="mt-4 text-2xl font-semibold">{q.prompt}</h2>
                            {aiGeneratedQuestion?.explanation && (
                              <p className="mt-2 text-xs text-[var(--text-tertiary)] italic">
                                {aiGeneratedQuestion.explanation}
                              </p>
                            )}
                            <div className="mt-6">
                              <input
                                type="text"
                                placeholder="Your answer..."
                                value={practiceInput}
                                onChange={(e) => setPracticeInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !practiceAnswered && handlePracticeCheck()}
                                disabled={practiceAnswered}
                                className="input-field w-full"
                                autoFocus
                              />
                              {!practiceAnswered ? (
                                <motion.button
                                  className="btn-primary mt-4"
                                  onClick={handlePracticeCheck}
                                  disabled={!practiceInput.trim()}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  Check
                                </motion.button>
                              ) : (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="mt-4 flex items-center gap-3"
                                >
                                  <div
                                    className={`flex items-center gap-2 font-medium ${
                                      practiceCorrect
                                        ? 'text-[var(--success)]'
                                        : 'text-[var(--danger)]'
                                    }`}
                                  >
                                    {practiceCorrect ? (
                                      <CheckCircle2 size={20} />
                                    ) : (
                                      <span className="text-lg">✗</span>
                                    )}
                                    {practiceCorrect ? 'Correct!' : `Correct: ${q.correctAnswer}`}
                                  </div>
                                  <motion.button
                                    className="btn-primary"
                                    onClick={handlePracticeNext}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    Next
                                  </motion.button>
                                </motion.div>
                              )}
                            </div>
                          </>
                        );
                      })()}
                    </GlassCard>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-16"
              >
                <GlassCard hover={false} className="max-w-md text-center">
                  <h2 className="text-xl font-bold">Practice Complete!</h2>
                  <p className="mt-2 text-[var(--text-secondary)]">
                    {practiceCorrectCount} / {practiceWords.length} correct
                  </p>
                  {practiceCorrectCount / practiceWords.length >= 0.7 && (
                    <p className="mt-2 text-sm font-medium text-[var(--success)]">Exam unlocked!</p>
                  )}
                  <motion.button
                    className="btn-primary mt-6"
                    onClick={() => {
                      setFlowMode('list');
                      setSelectedBatch(null);
                      fetchBatches();
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back to Batches
                  </motion.button>
                </GlassCard>
              </motion.div>
            )}
          </motion.div>
        )}

        {flowMode === 'exam' && selectedBatch && (
          <motion.div
            key="exam"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {!examSubmitted ? (
              <>
                <button
                  onClick={() => {
                    if (confirm('Abandon exam?')) {
                      setFlowMode('list');
                      setSelectedBatch(null);
                    }
                  }}
                  className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <ArrowLeft size={18} />
                  Back
                </button>

                <div
                  className={`mb-6 flex items-center justify-center gap-2 rounded-xl py-4 text-2xl font-bold ${
                    examTimeLeft <= 10 ? 'bg-[var(--danger)]/20 text-[var(--danger)]' : 'bg-[var(--bg-tertiary)]'
                  }`}
                >
                  <span>{Math.floor(examTimeLeft / 60)}:{(examTimeLeft % 60).toString().padStart(2, '0')}</span>
                </div>

                {examQuestions[examIndex] && (
                  <GlassCard hover={false}>
                    <p className="text-sm text-[var(--text-tertiary)]">
                      {examIndex + 1} / {examQuestions.length}
                    </p>
                    <h2 className="mt-4 text-2xl font-semibold">{examQuestions[examIndex].prompt}</h2>
                    <input
                      type="text"
                      placeholder="Your answer..."
                      value={examInput}
                      onChange={(e) => setExamInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (examIndex + 1 < examQuestions.length) {
                            setExamAnswers([
                              ...examAnswers,
                              {
                                wordId: examQuestions[examIndex].word.id,
                                type: examQuestions[examIndex].type,
                                userAnswer: examInput.trim(),
                                correctAnswer: examQuestions[examIndex].correctAnswer,
                                correct: checkAnswer(
                                  examQuestions[examIndex].type,
                                  examInput,
                                  examQuestions[examIndex].correctAnswer
                                ),
                              },
                            ]);
                            setExamInput('');
                            setExamIndex((i) => i + 1);
                          } else {
                            handleExamSubmit();
                          }
                        }
                      }}
                      className="input-field mt-6 w-full"
                      autoFocus
                    />
                    <motion.button
                      className="btn-primary mt-4"
                      onClick={() => {
                        if (examIndex + 1 < examQuestions.length) {
                          setExamAnswers([
                            ...examAnswers,
                            {
                              wordId: examQuestions[examIndex].word.id,
                              type: examQuestions[examIndex].type,
                              userAnswer: examInput.trim(),
                              correctAnswer: examQuestions[examIndex].correctAnswer,
                              correct: checkAnswer(
                                examQuestions[examIndex].type,
                                examInput,
                                examQuestions[examIndex].correctAnswer
                              ),
                            },
                          ]);
                          setExamInput('');
                          setExamIndex((i) => i + 1);
                        } else {
                          handleExamSubmit();
                        }
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {examIndex + 1 < examQuestions.length ? 'Next' : 'Submit'}
                    </motion.button>
                  </GlassCard>
                )}
              </>
            ) : examResult ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <GlassCard hover={false} className="text-center">
                  <h2 className="text-2xl font-bold">Exam Complete!</h2>
                  <p className="mt-2 text-4xl font-bold text-[var(--accent)]">
                    {examResult.score} / {examResult.maxScore}
                  </p>
                  <motion.span
                    className="mt-2 inline-block text-sm font-medium text-[var(--success)]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    +{examResult.xpEarned} XP
                  </motion.span>
                  <div className="mt-6 flex flex-wrap justify-center gap-4">
                    {examResult.vocabAccuracy != null && (
                      <Badge>Vocabulary: {Math.round(examResult.vocabAccuracy)}%</Badge>
                    )}
                    {examResult.genderAccuracy != null && (
                      <Badge>Gender: {Math.round(examResult.genderAccuracy)}%</Badge>
                    )}
                    {examResult.verbAccuracy != null && (
                      <Badge>Verbs: {Math.round(examResult.verbAccuracy)}%</Badge>
                    )}
                  </div>
                </GlassCard>
                <GlassCard hover={false}>
                  <h3 className="mb-4 font-semibold">Results</h3>
                  <div className="space-y-3">
                    {examResult.answers.map((a, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between rounded-lg px-4 py-3 ${
                          a.correct ? 'bg-[var(--success)]/10' : 'bg-[var(--danger)]/10'
                        }`}
                      >
                        <span className="text-sm">
                          Your answer: <strong>{a.userAnswer || '(empty)'}</strong>
                        </span>
                        <span className="flex items-center gap-2 text-sm">
                          {a.correct ? (
                            <CheckCircle2 size={18} className="text-[var(--success)]" />
                          ) : (
                            <span className="text-[var(--danger)]">✗</span>
                          )}
                          {!a.correct && (
                            <span className="text-[var(--text-secondary)]">Correct: {a.correctAnswer}</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
                <motion.button
                  className="btn-primary"
                  onClick={() => {
                    setFlowMode('list');
                    setSelectedBatch(null);
                    fetchBatches();
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Back to Batches
                </motion.button>
              </motion.div>
            ) : null}
          </motion.div>
        )}

        {(flowMode === 'gender_drill' || flowMode === 'plural_drill') && selectedBatch && (
          <motion.div
            key={flowMode}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <button
              onClick={() => { setFlowMode('list'); setSelectedBatch(null); }}
              className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <ArrowLeft size={18} />
              Back
            </button>
            {!drillComplete ? (
              <>
                <div className="mb-6 flex items-center justify-between text-sm">
                  <span className="text-[var(--text-tertiary)]">
                    {drillIndex + 1} / {drillWords.length}
                  </span>
                  <span className="text-[var(--accent)] font-medium">{drillCorrectCount} correct</span>
                </div>
                <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[#5856D6]"
                    animate={{ width: `${((drillIndex + 1) / drillWords.length) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                </div>
                <GlassCard hover={false}>
                  <p className="text-sm text-[var(--text-tertiary)]">
                    {flowMode === 'gender_drill' ? 'What is the article?' : 'Type the plural form'}
                  </p>
                  <h2 className="mt-4 text-2xl font-semibold">
                    {flowMode === 'gender_drill'
                      ? stripArticle(drillWords[drillIndex]?.word ?? '')
                      : drillWords[drillIndex]?.word}
                  </h2>
                  <div className="mt-6">
                    <input
                      type="text"
                      placeholder="Your answer..."
                      value={drillInput}
                      onChange={(e) => setDrillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !drillAnswered) {
                          const word = drillWords[drillIndex];
                          if (!word) return;
                          const correct =
                            flowMode === 'gender_drill'
                              ? ['der', 'die', 'das'].includes(drillInput.trim().toLowerCase()) &&
                                (word.gender === 'masculine' ? 'der' : word.gender === 'feminine' ? 'die' : 'das') ===
                                  drillInput.trim().toLowerCase()
                              : normalizeAnswer(drillInput) === normalizeAnswer(word.pluralForm ?? '');
                          setDrillCorrect(correct);
                          setDrillAnswered(true);
                          correct ? (sfx.correct(), setDrillCorrectCount((c) => c + 1)) : sfx.wrong();
                        }
                      }}
                      disabled={drillAnswered}
                      className="input-field w-full"
                      autoFocus
                    />
                    {!drillAnswered ? (
                      <motion.button
                        className="btn-primary mt-4"
                        onClick={() => {
                          const word = drillWords[drillIndex];
                          if (!word) return;
                          const correct =
                            flowMode === 'gender_drill'
                              ? ['der', 'die', 'das'].includes(drillInput.trim().toLowerCase()) &&
                                (word.gender === 'masculine' ? 'der' : word.gender === 'feminine' ? 'die' : 'das') ===
                                  drillInput.trim().toLowerCase()
                              : normalizeAnswer(drillInput) === normalizeAnswer(word.pluralForm ?? '');
                          setDrillCorrect(correct);
                          setDrillAnswered(true);
                          correct ? (sfx.correct(), setDrillCorrectCount((c) => c + 1)) : sfx.wrong();
                        }}
                        disabled={!drillInput.trim()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Check
                      </motion.button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 flex items-center gap-3"
                      >
                        <div
                          className={`flex items-center gap-2 font-medium ${
                            drillCorrect ? 'text-[var(--success)]' : 'text-[var(--danger)]'
                          }`}
                        >
                          {drillCorrect ? (
                            <CheckCircle2 size={20} />
                          ) : (
                            <span className="text-lg">✗</span>
                          )}
                          {drillCorrect
                            ? 'Correct!'
                            : `Correct: ${
                                flowMode === 'gender_drill'
                                  ? drillWords[drillIndex]?.gender === 'masculine'
                                    ? 'der'
                                    : drillWords[drillIndex]?.gender === 'feminine'
                                      ? 'die'
                                      : 'das'
                                  : drillWords[drillIndex]?.pluralForm
                              }`}
                        </div>
                        <motion.button
                          className="btn-primary"
                          onClick={() => {
                            if (drillIndex + 1 >= drillWords.length) {
                              sfx.complete();
                              setDrillComplete(true);
                            } else {
                              setDrillIndex((i) => i + 1);
                              setDrillInput('');
                              setDrillAnswered(false);
                              sfx.swoosh();
                            }
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {drillIndex + 1 >= drillWords.length ? 'Finish' : 'Next'}
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                </GlassCard>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-16"
              >
                <GlassCard hover={false} className="max-w-md text-center">
                  <h2 className="text-xl font-bold">
                    {flowMode === 'gender_drill' ? 'Gender Drill' : 'Plural Drill'} Complete!
                  </h2>
                  <p className="mt-2 text-[var(--text-secondary)]">
                    {drillCorrectCount} / {drillWords.length} correct
                  </p>
                  <motion.button
                    className="btn-primary mt-6"
                    onClick={() => {
                      setFlowMode('list');
                      setSelectedBatch(null);
                      fetchBatches();
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back to Batches
                  </motion.button>
                </GlassCard>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteConfirmBatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setDeleteConfirmBatch(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-[var(--bg-primary)] p-6 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle size={24} className="text-[var(--danger)]" />
                <h3 className="text-lg font-semibold">Delete batch</h3>
              </div>
              <p className="mt-4 text-sm text-[var(--text-secondary)]">
                This will permanently delete &quot;{deleteConfirmBatch.name}&quot; and all its words. Type RESET to confirm.
              </p>
              <input
                type="text"
                value={deleteConfirmInput}
                onChange={(e) => setDeleteConfirmInput(e.target.value)}
                placeholder="RESET"
                className="input-field mt-4 w-full"
              />
              <div className="mt-6 flex gap-3">
                <motion.button
                  onClick={() => { setDeleteConfirmBatch(null); setDeleteConfirmInput(''); }}
                  className="btn-secondary flex-1"
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={() => handleBatchDelete(deleteConfirmBatch)}
                  disabled={deleteConfirmInput !== 'RESET'}
                  className="btn-primary flex-1 bg-[var(--danger)] hover:bg-[var(--danger)]/90 disabled:opacity-50"
                  whileTap={{ scale: 0.98 }}
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add words modal */}
      <AnimatePresence>
        {addWordsBatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => !addWordsLoading && setAddWordsBatch(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-[var(--bg-primary)] p-6 shadow-xl"
            >
              <h3 className="text-lg font-semibold">Add words to {addWordsBatch.name}</h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Enter German words (one per line or comma-separated)
              </p>
              <textarea
                value={addWordsInput}
                onChange={(e) => setAddWordsInput(e.target.value)}
                placeholder="Haus, Buch, gehen..."
                className="input-field mt-4 min-h-[120px] w-full resize-none"
                disabled={addWordsLoading}
              />
              <div className="mt-6 flex gap-3">
                <motion.button
                  onClick={() => { setAddWordsBatch(null); setAddWordsInput(''); }}
                  disabled={addWordsLoading}
                  className="btn-secondary flex-1"
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleAddWords}
                  disabled={!addWordsInput.trim() || addWordsLoading}
                  className="btn-primary flex-1 disabled:opacity-50"
                  whileTap={{ scale: 0.98 }}
                >
                  {addWordsLoading ? <Loader2 size={18} className="animate-spin" /> : 'Add Words'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
