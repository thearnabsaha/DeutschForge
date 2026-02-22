import { z } from 'zod';

// Word enrichment from Groq AI
export const enrichedWordSchema = z.object({
  word: z.string(),
  part_of_speech: z.enum(['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'pronoun', 'article', 'other']),
  gender: z.enum(['masculine', 'feminine', 'neuter']).nullable(),
  plural_form: z.string().nullable(),
  conjugation: z.record(z.string(), z.string()).nullable(),
  meaning: z.string(),
  cefr_level: z.enum(['A1', 'A2', 'B1', 'B2']),
  example_sentence: z.string(),
});

export const enrichedWordsResponseSchema = z.object({
  words: z.array(enrichedWordSchema),
});

export type EnrichedWord = z.infer<typeof enrichedWordSchema>;

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
