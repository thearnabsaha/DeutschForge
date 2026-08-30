import { z } from 'zod';

// Word enrichment from Groq AI
export const enrichedWordSchema = z.object({
  word: z.string(),
  part_of_speech: z.preprocess(
    (v) => (typeof v === 'string' ? v.toLowerCase().trim() : 'other'),
    z.enum(['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'pronoun', 'article', 'other']).catch('other')
  ),
  gender: z.preprocess(
    (v) => {
      if (typeof v !== 'string') return null;
      const lower = v.toLowerCase().trim();
      if (lower.startsWith('m') || lower === 'der') return 'masculine';
      if (lower.startsWith('f') || lower === 'die') return 'feminine';
      if (lower.startsWith('n') || lower === 'das') return 'neuter';
      return null;
    },
    z.enum(['masculine', 'feminine', 'neuter']).nullable().catch(null)
  ),
  plural_form: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() ? v.trim() : null),
    z.string().nullable().catch(null)
  ),
  conjugation: z.preprocess(
    (v) => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, string>) : null),
    z.record(z.string(), z.string()).nullable().catch(null)
  ),
  meaning: z.preprocess(
    (v) => (typeof v === 'string' ? v.trim() : String(v || '')),
    z.string().catch('')
  ),
  cefr_level: z.preprocess(
    (v) => {
      if (typeof v !== 'string') return 'A1';
      const u = v.toUpperCase().trim();
      if (['A1', 'A2', 'B1', 'B2'].includes(u)) return u;
      if (u.startsWith('B2') || u.startsWith('C')) return 'B2';
      if (u.startsWith('B')) return 'B1';
      if (u.startsWith('A2')) return 'A2';
      return 'A1';
    },
    z.enum(['A1', 'A2', 'B1', 'B2']).catch('A1')
  ),
  example_sentence: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() ? v.trim() : null),
    z.string().nullable().catch(null)
  ),
  verb_type: z.preprocess(
    (v) => {
      if (typeof v !== 'string') return null;
      const l = v.toLowerCase().trim();
      if (l.includes('irregular') || l.includes('unregelmäßig') || l.includes('strong')) return 'irregular';
      if (l.includes('mixed') || l.includes('gemischt')) return 'mixed';
      if (l.includes('regular') || l.includes('regelmäßig') || l.includes('weak')) return 'regular';
      return null;
    },
    z.enum(['regular', 'irregular', 'mixed']).nullable().catch(null)
  ),
  auxiliary_type: z.preprocess(
    (v) => {
      if (typeof v !== 'string') return null;
      const l = v.toLowerCase().trim();
      if (l.includes('sein')) return 'sein';
      if (l.includes('haben')) return 'haben';
      return null;
    },
    z.enum(['haben', 'sein']).nullable().catch(null)
  ),
  present_form: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() ? v.trim() : null),
    z.string().nullable().catch(null)
  ),
  simple_past: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() ? v.trim() : null),
    z.string().nullable().catch(null)
  ),
  perfect_form: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() ? v.trim() : null),
    z.string().nullable().catch(null)
  ),
});

export const enrichedWordsResponseSchema = z.object({
  words: z.array(enrichedWordSchema),
});

export type EnrichedWord = z.infer<typeof enrichedWordSchema>;

// Expression enrichment from Groq AI
export const enrichedExpressionSchema = z.object({
  expression: z.string(),
  meaning: z.preprocess(
    (v) => (typeof v === 'string' ? v.trim() : String(v || '')),
    z.string().catch('')
  ),
  literal_translation: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() ? v.trim() : null),
    z.string().nullable().catch(null)
  ),
  register: z.preprocess(
    (v) => (typeof v === 'string' ? v.toLowerCase().trim() : null),
    z.enum(['formal', 'informal', 'neutral', 'colloquial', 'slang']).nullable().catch(null)
  ),
  cefr_level: z.preprocess(
    (v) => {
      if (typeof v !== 'string') return 'A1';
      const u = v.toUpperCase().trim();
      if (['A1', 'A2', 'B1', 'B2'].includes(u)) return u;
      return 'A1';
    },
    z.enum(['A1', 'A2', 'B1', 'B2']).catch('A1')
  ),
  example_sentence: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() ? v.trim() : null),
    z.string().nullable().catch(null)
  ),
  usage_note: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() ? v.trim() : null),
    z.string().nullable().catch(null)
  ),
  category: z.preprocess(
    (v) => (typeof v === 'string' ? v.toLowerCase().trim() : null),
    z.enum(['greeting', 'farewell', 'polite', 'idiom', 'collocation', 'proverb', 'filler', 'connector', 'other']).nullable().catch(null)
  ),
});

export const enrichedExpressionsResponseSchema = z.object({
  expressions: z.array(enrichedExpressionSchema),
});

export type EnrichedExpression = z.infer<typeof enrichedExpressionSchema>;

// Bulk upload input
export const bulkUploadSchema = z.object({
  words: z.string().min(1, 'At least one word is required'),
});

// Grammar assessment submission
export const grammarSubmissionSchema = z.object({
  topicId: z.string(),
  answers: z.array(z.object({
    exerciseId: z.string(),
    userAnswer: z.string(),
  })),
});

// Chat message
export const chatMessageSchema = z.object({
  sessionId: z.string().optional(),
  message: z.string().min(1),
  cefrLevel: z.string().default('A1'),
});

// Chat response from AI
export const chatResponseSchema = z.object({
  reply: z.string(),
  translation: z.string(),
  corrections: z.array(z.object({
    original: z.string(),
    corrected: z.string(),
    rule: z.string(),
  })),
});

export type ChatResponse = z.infer<typeof chatResponseSchema>;

// Listening exercise from AI
export const listeningQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).min(2),
  correct_index: z.number().int().min(0),
  explanation: z.string(),
  type: z.enum(['mcq', 'short_answer']).default('mcq'),
});

export const listeningExerciseSchema = z.object({
  level: z.enum(['A1', 'A2', 'B1', 'B2']),
  script: z.string(),
  new_words_used: z.array(z.string()),
  questions: z.array(listeningQuestionSchema).min(1),
});

export type ListeningExercise = z.infer<typeof listeningExerciseSchema>;
export type ListeningQuestion = z.infer<typeof listeningQuestionSchema>;
