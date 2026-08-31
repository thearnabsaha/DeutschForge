import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { wordBatches, userWords } from '@/lib/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { enrichWords } from '@/lib/groq';

export const maxDuration = 60;

function parseWords(wordsString: string): string[] {
  const lines = wordsString.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const entries: string[] = [];
  for (const line of lines) {
    const segments = line.split(/[,;]+/).map((s) => s.trim()).filter(Boolean);
    for (const seg of segments) {
      if (seg.length > 0) entries.push(seg);
    }
  }
  // Deduplicate internal array preserving order
  return Array.from(new Set(entries));
}

function normalizeForComparison(word: string): string {
  return word.toLowerCase().replace(/^(der|die|das|ein|eine|einen|einem|einer|eines)\s+/i, '').trim();
}

// GET /api/vocabulary/sets - List all word sets for user
export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const [batches, allUserWords] = await Promise.all([
      db
        .select()
        .from(wordBatches)
        .where(eq(wordBatches.userId, session.id))
        .orderBy(desc(wordBatches.createdAt)),
      db
        .select()
        .from(userWords)
        .where(eq(userWords.userId, session.id))
        .orderBy(desc(userWords.createdAt)),
    ]);

    // Group words by batchId in-memory in 0ms
    const wordsByBatch = new Map<string, typeof allUserWords>();
    for (const word of allUserWords) {
      if (word.batchId) {
        const list = wordsByBatch.get(word.batchId) || [];
        list.push(word);
        wordsByBatch.set(word.batchId, list);
      }
    }

    const result = batches.map((b) => {
      const words = wordsByBatch.get(b.id) || [];
      const learnedCount = words.filter((w) => w.learned).length;
      return {
        id: b.id,
        name: b.name,
        wordCount: words.length,
        learnedCount,
        practiceUnlocked: b.practiceUnlocked,
        examUnlocked: b.examUnlocked,
        createdAt: b.createdAt,
        words,
      };
    });

    return NextResponse.json({ sets: result });
  } catch (error) {
    console.error('Error fetching word sets:', error);
    return NextResponse.json({ error: 'Failed to fetch word sets' }, { status: 500 });
  }
}

// POST /api/vocabulary/sets - Create a new word set from comma-separated words
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await request.json();
    const { name, words: wordsInput } = body;

    const setName = (name && typeof name === 'string' && name.trim().length > 0)
      ? name.trim()
      : `Word Set ${new Date().toLocaleDateString('de-DE')}`;

    if (typeof wordsInput !== 'string' || !wordsInput.trim()) {
      return NextResponse.json({ error: 'Please enter at least one German word' }, { status: 400 });
    }

    const parsedWords = parseWords(wordsInput);
    if (parsedWords.length === 0) {
      return NextResponse.json({ error: 'No valid words parsed from input' }, { status: 400 });
    }

    // 1. Fetch user's existing vocabulary to skip duplicates
    const existingRows = await db
      .select({ word: userWords.word })
      .from(userWords)
      .where(eq(userWords.userId, session.id));

    const existingNormalized = new Set(existingRows.map((r) => normalizeForComparison(r.word)));

    // 2. Filter out already-existing words
    const newWords = parsedWords.filter((w) => !existingNormalized.has(normalizeForComparison(w)));
    const skippedCount = parsedWords.length - newWords.length;

    if (newWords.length === 0) {
      return NextResponse.json(
        {
          error: `All ${parsedWords.length} word(s) already exist in your vocabulary.`,
          skipped: skippedCount,
        },
        { status: 400 }
      );
    }

    // 3. AI Enrichment with Groq
    let enrichedWords;
    try {
      enrichedWords = await enrichWords(newWords);
    } catch (enrichErr) {
      console.error('Enrichment failed:', enrichErr);
      const msg = enrichErr instanceof Error ? enrichErr.message : 'Unknown error';
      return NextResponse.json({ error: `Enrichment failed: ${msg}` }, { status: 500 });
    }

    if (!enrichedWords || enrichedWords.length === 0) {
      return NextResponse.json({ error: 'Failed to enrich words. Please try again.' }, { status: 400 });
    }

    // 4. Final duplicate guard after enrichment
    const deduped = enrichedWords.filter((w) => !existingNormalized.has(normalizeForComparison(w.word)));
    if (deduped.length === 0) {
      return NextResponse.json(
        { error: 'All words already exist in your vocabulary.', skipped: parsedWords.length },
        { status: 400 }
      );
    }

    // 5. Create Word Batch / Set
    const [batch] = await db
      .insert(wordBatches)
      .values({
        userId: session.id,
        name: setName,
        wordCount: deduped.length,
        learnedCount: 0,
      })
      .returning();

    // 6. Insert all enriched words into userWords linked to this batchId
    const createdWords = [];
    for (const w of deduped) {
      const [inserted] = await db
        .insert(userWords)
        .values({
          userId: session.id,
          word: w.word,
          partOfSpeech: w.part_of_speech,
          gender: w.gender ?? null,
          pluralForm: w.plural_form ?? null,
          conjugation: (w.conjugation as Record<string, string> | null) ?? null,
          meaning: w.meaning,
          cefrLevel: w.cefr_level ?? 'A1',
          exampleSentence: w.example_sentence ?? null,
          verbType: w.verb_type ?? null,
          auxiliaryType: w.auxiliary_type ?? null,
          presentForm: w.present_form ?? null,
          simplePast: w.simple_past ?? null,
          perfectForm: w.perfect_form ?? null,
          batchId: batch.id,
          learned: false,
        })
        .returning();
      createdWords.push(inserted);
    }

    return NextResponse.json({
      success: true,
      set: {
        ...batch,
        words: createdWords,
      },
      addedCount: deduped.length,
      skippedCount: parsedWords.length - deduped.length,
    });
  } catch (error) {
    console.error('Error creating word set:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
