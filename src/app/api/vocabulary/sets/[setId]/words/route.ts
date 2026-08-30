import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userWords, wordBatches } from '@/lib/schema';
import { eq, and, sql } from 'drizzle-orm';
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
  return Array.from(new Set(entries));
}

function normalizeForComparison(word: string): string {
  return word.toLowerCase().replace(/^(der|die|das|ein|eine|einen|einem|einer|eines)\s+/i, '').trim();
}

// POST /api/vocabulary/sets/[setId]/words - Append comma-separated words to an existing set
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ setId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const { setId } = await params;

    const [batch] = await db
      .select()
      .from(wordBatches)
      .where(and(eq(wordBatches.id, setId), eq(wordBatches.userId, session.id)));

    if (!batch) return NextResponse.json({ error: 'Word set not found' }, { status: 404 });

    const body = await req.json();
    const { words: wordsInput } = body;

    if (typeof wordsInput !== 'string' || !wordsInput.trim()) {
      return NextResponse.json({ error: 'Please enter at least one word' }, { status: 400 });
    }

    const parsedWords = parseWords(wordsInput);
    if (parsedWords.length === 0) {
      return NextResponse.json({ error: 'No valid words parsed from input' }, { status: 400 });
    }

    // 1. Fetch user's existing words to prevent duplicates
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

    // 3. AI Enrichment
    let enrichedWords;
    try {
      enrichedWords = await enrichWords(newWords);
    } catch (enrichErr) {
      console.error('Enrichment failed:', enrichErr);
      const msg = enrichErr instanceof Error ? enrichErr.message : 'Unknown error';
      return NextResponse.json({ error: `Enrichment failed: ${msg}` }, { status: 500 });
    }

    if (!enrichedWords || enrichedWords.length === 0) {
      return NextResponse.json({ error: 'Failed to enrich words' }, { status: 400 });
    }

    // 4. Final duplicate guard after enrichment
    const deduped = enrichedWords.filter((w) => !existingNormalized.has(normalizeForComparison(w.word)));
    if (deduped.length === 0) {
      return NextResponse.json(
        { error: 'All words already exist in your vocabulary', skipped: parsedWords.length },
        { status: 400 }
      );
    }

    // 5. Insert new words into set
    const insertedWords = [];
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
          batchId: setId,
          learned: false,
        })
        .returning();
      insertedWords.push(inserted);
    }

    // Update batch word count
    await db
      .update(wordBatches)
      .set({ wordCount: sql`${wordBatches.wordCount} + ${deduped.length}` })
      .where(eq(wordBatches.id, setId));

    return NextResponse.json({
      success: true,
      addedWords: insertedWords,
      addedCount: deduped.length,
      skippedCount: parsedWords.length - deduped.length,
    });
  } catch (error) {
    console.error('Error adding words to set:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
