'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Volume2, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FlashcardProps {
  front: string;
  back: string;
  contextSentence?: string | null;
  cefrLevel: string;
  module: string;
  onReveal: () => void;
  revealed: boolean;
}

export function Flashcard({
  front,
  back,
  contextSentence,
  cefrLevel,
  module,
  onReveal,
  revealed,
}: FlashcardProps) {
  const [explaining, setExplaining] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);

  const handleExplain = async () => {
    if (explanation) return;
    setExplaining(true);
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: contextSentence || front, error: front, cefrLevel }),
      });
      const data = await res.json();
      setExplanation(data.explanation);
    } catch {
      setExplanation('Unable to load explanation. Check your API key.');
    } finally {
      setExplaining(false);
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="flashcard-flip mx-auto w-full max-w-lg">
      <motion.div
        className={cn('flashcard-inner relative', revealed && 'flipped')}
        style={{ minHeight: 320 }}
      >
        {/* Front */}
        <div
          className="flashcard-front absolute inset-0 cursor-pointer"
          onClick={() => !revealed && onReveal()}
        >
          <div className="card-surface flex h-full flex-col items-center justify-center rounded-3xl p-8 text-center">
            <div className="mb-4 flex items-center gap-2">
              <Badge variant="level" level={cefrLevel}>{cefrLevel}</Badge>
              <Badge>{module}</Badge>
            </div>
            <motion.h2
              className="text-3xl font-semibold tracking-tight"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {front}
            </motion.h2>
            {contextSentence && (
              <p className="mt-4 text-sm italic text-[var(--text-tertiary)]">
                {contextSentence}
              </p>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); speak(front); }}
              className="mt-4 rounded-full p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Pronounce"
            >
              <Volume2 size={18} className="text-[var(--text-tertiary)]" />
            </button>
            <p className="mt-6 text-xs text-[var(--text-tertiary)]">
              Tap to reveal answer
            </p>
          </div>
        </div>

        {/* Back */}
        <div className="flashcard-back absolute inset-0">
          <div className="card-surface flex h-full flex-col items-center justify-center rounded-3xl p-8 text-center">
            <div className="mb-4 flex items-center gap-2">
              <Badge variant="level" level={cefrLevel}>{cefrLevel}</Badge>
              <Badge>{module}</Badge>
            </div>
            <p className="text-sm text-[var(--text-tertiary)]">{front}</p>
            <motion.h2
              className="mt-2 text-3xl font-semibold tracking-tight text-[var(--accent)]"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {back}
            </motion.h2>
            {contextSentence && (
              <p className="mt-3 text-sm italic text-[var(--text-tertiary)]">
                {contextSentence}
              </p>
            )}
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => speak(back)}
                className="rounded-full p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                aria-label="Pronounce"
              >
                <Volume2 size={18} className="text-[var(--text-tertiary)]" />
              </button>
              <button
                onClick={handleExplain}
                disabled={explaining}
                className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              >
                <Lightbulb size={14} />
                {explaining ? 'Loading...' : 'Explain Why'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {explanation && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="card-surface rounded-2xl p-5">
              <div className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400">
                <Lightbulb size={16} />
                Grammar Insight
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-secondary)]">
                {explanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
