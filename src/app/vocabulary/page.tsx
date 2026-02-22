'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { Plus, Loader2, Trash2, BookOpen, Search, Filter } from 'lucide-react';
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
  state: number;
  stability: number;
}

interface Analytics {
  totalWords: number;
  byPartOfSpeech: { noun: number; verb: number; adjective: number; preposition: number; conjunction: number; other: number };
  byGender: { masculine: number; feminine: number; neuter: number };
  byCefrLevel: { A1: number; A2: number; B1: number; B2: number };
  mastered: number;
}

const POS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'noun', label: 'Nouns' },
  { value: 'verb', label: 'Verbs' },
  { value: 'adjective', label: 'Adjectives' },
  { value: 'preposition', label: 'Prepositions' },
  { value: 'conjunction', label: 'Conjunctions' },
  { value: 'other', label: 'Other' },
];

export default function VocabularyPage() {
  const [words, setWords] = useState<UserWord[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [wordsInput, setWordsInput] = useState('');
  const [posFilter, setPosFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchWords = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vocabulary');
      const data = await res.json();
      setWords(data.words || []);
      setAnalytics(data.analytics || null);
    } catch {
      setWords([]);
      setAnalytics(null);
      toast.error('Failed to load vocabulary');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  const handleUpload = async () => {
    const trimmed = wordsInput.trim();
    if (!trimmed) {
      toast.error('Please enter at least one word');
      return;
    }
    setUploading(true);
    try {
      const res = await fetch('/api/vocabulary/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Upload failed');
        return;
      }
      sfx.streak();
      toast.success(`Successfully added ${data.count} word${data.count !== 1 ? 's' : ''}`);
      setWordsInput('');
      await fetchWords();
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/vocabulary?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Word removed');
        await fetchWords();
      } else {
        toast.error('Failed to delete word');
      }
    } catch {
      toast.error('Failed to delete word');
    }
  };

  const filteredWords = words
    .filter((w) => posFilter === 'all' || w.partOfSpeech.toLowerCase() === posFilter)
    .filter(
      (w) =>
        !searchQuery ||
        w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.meaning.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const analyticsRows = analytics
    ? [
        { label: 'Total Words Learned', count: analytics.totalWords },
        { label: 'Nouns', count: analytics.byPartOfSpeech.noun },
        { label: 'Verbs', count: analytics.byPartOfSpeech.verb },
        { label: 'Adjectives', count: analytics.byPartOfSpeech.adjective },
        { label: 'Prepositions', count: analytics.byPartOfSpeech.preposition },
        { label: 'Conjunctions', count: analytics.byPartOfSpeech.conjunction },
        { label: 'Masculine Nouns', count: analytics.byGender.masculine },
        { label: 'Feminine Nouns', count: analytics.byGender.feminine },
        { label: 'Neuter Nouns', count: analytics.byGender.neuter },
      ]
    : [];

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
      <PageHeader
        title="Vocabulary"
        subtitle="Build and manage your personal word library"
      />

      {/* A. Upload Section */}
      <motion.section
        className="mt-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <GlassCard hover={false}>
          <div className="flex items-center gap-2">
            <Plus size={18} className="text-[var(--accent)]" />
            <h2 className="text-base font-semibold">Add Words</h2>
          </div>
          <textarea
            value={wordsInput}
            onChange={(e) => setWordsInput(e.target.value)}
            placeholder="Enter German words, one per line or comma-separated..."
            className="mt-4 min-h-[120px] w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            disabled={uploading}
          />
          <motion.button
            className="btn-primary mt-4 flex items-center gap-2"
            onClick={handleUpload}
            disabled={uploading}
            whileHover={!uploading ? { scale: 1.02 } : undefined}
            whileTap={!uploading ? { scale: 0.98 } : undefined}
          >
            {uploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Enriching...
              </>
            ) : (
              <>
                <Plus size={18} />
                Enrich & Add
              </>
            )}
          </motion.button>
        </GlassCard>
      </motion.section>

      {/* B. Word Library */}
      <motion.section
        className="mt-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-[var(--accent)]" />
          <h2 className="text-base font-semibold">Word Library</h2>
        </div>

        {loading ? (
          <div className="mt-6 flex flex-col items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
            <p className="mt-4 text-sm text-[var(--text-secondary)]">Loading vocabulary...</p>
          </div>
        ) : (
          <>
            {/* Analytics Cards */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {analyticsRows.map((row, i) => (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GlassCard className="flex items-center justify-between" hover={false}>
                    <span className="text-sm text-[var(--text-secondary)]">{row.label}</span>
                    <span className="text-xl font-semibold text-[var(--text-primary)]">
                      {row.count}
                    </span>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            {/* Filter + Word List */}
            <div className="mt-8">
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 sm:max-w-xs">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
                  />
                  <input
                    type="text"
                    placeholder="Search words or meanings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] py-2 pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Filter size={16} className="text-[var(--text-tertiary)]" />
                  <span className="text-sm text-[var(--text-secondary)]">Part of speech:</span>
                  {POS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setPosFilter(opt.value)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        posFilter === opt.value
                          ? 'bg-[var(--accent)] text-white'
                          : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {filteredWords.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="rounded-2xl border border-dashed border-[var(--border)] py-12 text-center text-sm text-[var(--text-tertiary)]"
                    >
                      {words.length === 0
                        ? 'No words yet. Add some German words above to get started!'
                        : `No ${posFilter === 'all' ? '' : posFilter + ' '}words match the filter.`}
                    </motion.div>
                  ) : (
                    filteredWords.map((word, idx) => (
                      <motion.div
                        key={word.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: idx * 0.02 }}
                      >
                        <GlassCard className="group relative">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-lg font-semibold text-[var(--text-primary)]">
                                  {word.word}
                                </span>
                                <Badge>{word.partOfSpeech}</Badge>
                                {word.gender && (
                                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                    {word.gender}
                                  </Badge>
                                )}
                                <Badge variant="level" level={word.cefrLevel}>
                                  {word.cefrLevel}
                                </Badge>
                              </div>
                              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                                {word.meaning}
                              </p>
                              {word.exampleSentence && (
                                <p className="mt-2 text-sm italic text-[var(--text-tertiary)]">
                                  „{word.exampleSentence}"
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => handleDelete(word.id)}
                              className="flex-shrink-0 rounded-lg p-2 text-[var(--text-tertiary)] opacity-60 transition-opacity hover:bg-red-500/10 hover:text-red-500 hover:opacity-100"
                              aria-label="Delete word"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </GlassCard>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </>
        )}
      </motion.section>
    </div>
  );
}
