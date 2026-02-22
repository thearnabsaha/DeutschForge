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
  verb_type: z.enum(['regular', 'irregular', 'mixed']).nullable().optional(),
  auxiliary_type: z.enum(['haben', 'sein']).nullable().optional(),
  present_form: z.string().nullable().optional(),
  simple_past: z.string().nullable().optional(),
  perfect_form: z.string().nullable().optional(),
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
