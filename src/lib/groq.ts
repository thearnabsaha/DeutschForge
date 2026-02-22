import Groq from 'groq-sdk';
import {
  enrichedWordsResponseSchema,
  chatResponseSchema,
  type EnrichedWord,
  type ChatResponse,
} from './validations';

let groqInstance: Groq | null = null;

function getGroq(): Groq {
  if (!groqInstance) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY environment variable is not set');
    }
    groqInstance = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqInstance;
}

// ── MODEL CASCADE ────────────────────────────────────────────
// Ordered by capability. On 429 / 503 / rate-limit the next model is tried.
const MODEL_CASCADE = [
  'llama-3.3-70b-versatile',
  'llama-3.1-70b-versatile',
  'llama3-70b-8192',
  'mixtral-8x7b-32768',
  'llama-3.1-8b-instant',
  'llama3-8b-8192',
  'gemma2-9b-it',
] as const;

interface CallGroqParams {
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: 'json_object' };
}

function isRateLimitError(err: unknown): boolean {
  if (err && typeof err === 'object') {
    const e = err as { status?: number; statusCode?: number; error?: { type?: string }; message?: string };
    if (e.status === 429 || e.statusCode === 429) return true;
    if (e.status === 503 || e.statusCode === 503) return true;
    if (e.error?.type === 'rate_limit_exceeded') return true;
    if (typeof e.message === 'string' && /rate.?limit|429|too many|quota|capacity/i.test(e.message)) return true;
  }
  return false;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calls Groq chat completions with automatic model fallback.
 * On 429/503/rate-limit errors the next model in the cascade is tried.
 * Each model gets up to 2 attempts (with a brief backoff) before moving on.
 */
async function callGroq(
  params: CallGroqParams,
  opts?: { preferredModel?: string }
) {
  const groq = getGroq();
  const startIdx = opts?.preferredModel
    ? Math.max(0, MODEL_CASCADE.indexOf(opts.preferredModel as typeof MODEL_CASCADE[number]))
    : 0;

  let lastError: unknown;

  for (let mi = startIdx; mi < MODEL_CASCADE.length; mi++) {
    const model = MODEL_CASCADE[mi];
    const maxRetries = mi === startIdx ? 2 : 1;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const completion = await groq.chat.completions.create({
          ...params,
          model,
        });
        return completion;
      } catch (err: unknown) {
        lastError = err;
        if (isRateLimitError(err)) {
          const backoff = (attempt + 1) * 800;
          console.warn(`[Groq] 429 on ${model} (attempt ${attempt + 1}/${maxRetries}), backing off ${backoff}ms`);
          await sleep(backoff);
          if (attempt === maxRetries - 1) {
            console.warn(`[Groq] Exhausted retries for ${model}, falling back to next model`);
          }
          continue;
        }
        throw err;
      }
    }
  }

  throw lastError ?? new Error('All Groq models exhausted (rate limited)');
}

// ── WRITING GRADING ──────────────────────────────────────────

interface GradeWritingParams {
  cefrLevel: string;
  prompt: string;
  response: string;
}

interface WritingGrade {
  score: number;
  maxScore: number;
  taskAchievement: { score: number; feedback: string };
  coherence: { score: number; feedback: string };
  vocabulary: { score: number; feedback: string };
  grammar: { score: number; feedback: string };
  overallFeedback: string;
  corrections: Array<{ original: string; corrected: string; explanation: string }>;
}

export async function gradeWriting(params: GradeWritingParams): Promise<WritingGrade> {
  const completion = await callGroq({
    messages: [
      {
        role: 'system',
        content: `You are a certified Goethe-Institut examiner grading a ${params.cefrLevel} Schreiben (Writing) submission. Grade strictly according to CEFR ${params.cefrLevel} rubrics across four criteria: Task Achievement (25pts), Coherence & Cohesion (25pts), Vocabulary Range (25pts), Grammar Accuracy (25pts). Total max: 100. Return ONLY valid JSON with this exact structure:
{
  "score": <total>,
  "maxScore": 100,
  "taskAchievement": {"score": <0-25>, "feedback": "<specific feedback>"},
  "coherence": {"score": <0-25>, "feedback": "<specific feedback>"},
  "vocabulary": {"score": <0-25>, "feedback": "<specific feedback>"},
  "grammar": {"score": <0-25>, "feedback": "<specific feedback>"},
  "overallFeedback": "<2-3 sentences summarizing strengths and areas for improvement>",
  "corrections": [{"original": "<incorrect phrase>", "corrected": "<correct version>", "explanation": "<brief explanation in English>"}]
}`,
      },
      {
        role: 'user',
        content: `Prompt: ${params.prompt}\n\nStudent's response:\n${params.response}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 2000,
    response_format: { type: 'json_object' },
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error('Empty response from Groq');

  try {
    return JSON.parse(raw) as WritingGrade;
  } catch {
    throw new Error('Invalid JSON response from Groq');
  }
}

// ── SPEAKING CONVERSATION ────────────────────────────────────

interface SpeakingMessage {
  role: 'examiner' | 'candidate';
  content: string;
}

export async function speakingConversation(
  cefrLevel: string,
  task: string,
  history: SpeakingMessage[],
  userMessage: string
): Promise<string> {
  const messages: Array<{ role: 'system' | 'assistant' | 'user'; content: string }> = [
    {
      role: 'system',
      content: `You are a Goethe-Institut oral examiner conducting a ${cefrLevel} Sprechen (Speaking) exam. The current task: "${task}". Speak in German appropriate for ${cefrLevel} level. Ask follow-up questions, keep the conversation natural. If the candidate makes errors, do NOT correct them mid-conversation—just continue naturally. Keep responses concise (2-3 sentences max). Respond ONLY in German.`,
    },
    ...history.map((m) => ({
      role: (m.role === 'examiner' ? 'assistant' : 'user') as 'assistant' | 'user',
      content: m.content,
    })),
    { role: 'user', content: userMessage },
  ];

  const completion = await callGroq({
    messages,
    temperature: 0.7,
    max_tokens: 300,
  });

  return completion.choices[0]?.message?.content ?? 'Können Sie das bitte wiederholen?';
}

// ── GRAMMAR EXPLANATION ──────────────────────────────────────

export async function explainGrammar(
  sentence: string,
  error: string,
  cefrLevel: string
): Promise<string> {
  const completion = await callGroq({
    messages: [
      {
        role: 'system',
        content: `You are a German language tutor explaining grammar concepts at the ${cefrLevel} level. Use the Elaborative Interrogation technique: explain WHY the grammar rule works the way it does, connecting it to patterns the learner already knows. Be concise but thorough. Use both German examples and English explanations.`,
      },
      {
        role: 'user',
        content: `In this sentence: "${sentence}"\nI got this wrong: "${error}"\nExplain why the correct answer is what it is and help me understand the underlying grammar rule.`,
      },
    ],
    temperature: 0.4,
    max_tokens: 500,
  });

  return completion.choices[0]?.message?.content ?? 'Unable to generate explanation.';
}

// ── WORD ENRICHMENT ──────────────────────────────────────────

export async function enrichWords(words: string[]): Promise<EnrichedWord[]> {
  const wordsList = words.join(', ');

  const completion = await callGroq({
    messages: [
      {
        role: 'system',
        content: `You are a German language lexicography expert. For each German word, provide structured linguistic data. Return ONLY valid JSON matching this structure: { words: [{ word, part_of_speech (noun/verb/adjective/adverb/preposition/conjunction/pronoun/article/other), gender (masculine/feminine/neuter or null if not noun), plural_form (or null if not noun), conjugation (object with ich/du/er/wir/ihr/sie keys or null if not verb, present tense), meaning (English translation), cefr_level (A1/A2/B1/B2), example_sentence (simple German sentence using the word) }] }`,
      },
      {
        role: 'user',
        content: `Provide linguistic data for these German words: ${wordsList}`,
      },
    ],
    temperature: 0.2,
    max_tokens: 4000,
    response_format: { type: 'json_object' },
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    const result = enrichedWordsResponseSchema.safeParse(parsed);
    if (result.success) return result.data.words;
    return [];
  } catch {
    return [];
  }
}

// ── CHAT WITH CORRECTIONS ────────────────────────────────────

export async function chatWithCorrections(
  cefrLevel: string,
  history: Array<{ role: string; content: string }>,
  userMessage: string
): Promise<ChatResponse> {
  const messages: Array<{ role: 'system' | 'assistant' | 'user'; content: string }> = [
    {
      role: 'system',
      content: `You are a friendly German conversation partner at the ${cefrLevel} level. Respond naturally in German. You must return ONLY valid JSON: { reply: (your German response, 2-3 sentences), translation: (English translation of your reply), corrections: [{ original: (user's mistake), corrected: (correct form), rule: (brief grammar rule explanation) }] }. If the user made no mistakes, corrections should be empty array.`,
    },
    ...history.map((m) => ({
      role: m.role as 'assistant' | 'user',
      content: m.content,
    })),
    { role: 'user', content: userMessage },
  ];

  const completion = await callGroq({
    messages,
    temperature: 0.6,
    max_tokens: 1000,
    response_format: { type: 'json_object' },
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    return { reply: 'Entschuldigung, ich konnte nicht antworten.', translation: 'Sorry, I could not respond.', corrections: [] };
  }

  try {
    const parsed = JSON.parse(raw);
    const result = chatResponseSchema.safeParse(parsed);
    if (result.success) return result.data;
    return { reply: raw, translation: '', corrections: [] };
  } catch {
    return { reply: raw, translation: '', corrections: [] };
  }
}

// ── AI INSIGHTS ──────────────────────────────────────────────

interface GenerateInsightsData {
  totalReviews: number;
  correctRate: number;
  weakAreas: string[];
  examScores: Array<{ section: string; score: number }>;
}

interface InsightsResult {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export async function generateInsights(data: GenerateInsightsData): Promise<InsightsResult> {
  const fallback: InsightsResult = {
    strengths: ['Consistent practice'],
    weaknesses: ['Continue identifying weak areas through more exercises'],
    recommendations: ['Review weak areas regularly', 'Practice with varied exercises'],
  };

  const completion = await callGroq({
    messages: [
      {
        role: 'system',
        content: `You are a German learning coach. Analyze the learner's data and return ONLY valid JSON: { strengths: [string array of 2-4 strengths], weaknesses: [string array of 2-4 areas to improve], recommendations: [string array of 2-4 actionable study recommendations] }.`,
      },
      {
        role: 'user',
        content: `Analyze this learner data and provide insights:
- Total reviews completed: ${data.totalReviews}
- Correct answer rate: ${(data.correctRate * 100).toFixed(1)}%
- Weak areas: ${data.weakAreas.join(', ') || 'None specified'}
- Exam scores by section: ${JSON.stringify(data.examScores)}`,
      },
    ],
    temperature: 0.4,
    max_tokens: 1500,
    response_format: { type: 'json_object' },
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) return fallback;

  try {
    const parsed = JSON.parse(raw);
    const strengths = Array.isArray(parsed.strengths) ? parsed.strengths : fallback.strengths;
    const weaknesses = Array.isArray(parsed.weaknesses) ? parsed.weaknesses : fallback.weaknesses;
    const recommendations = Array.isArray(parsed.recommendations) ? parsed.recommendations : fallback.recommendations;
    return { strengths, weaknesses, recommendations };
  } catch {
    return fallback;
  }
}
