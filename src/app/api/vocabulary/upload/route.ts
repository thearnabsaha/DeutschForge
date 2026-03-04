import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { userWords, wordBatches } from '@/lib/schema';
import { enrichWords } from '@/lib/groq';
import { getCurrentUserId } from '@/lib/get-user';

export const maxDuration = 120;

function parseWords(wordsString: string): string[] {
  const lines = wordsString.split(/\n+/).map((l) => l.trim()).filter(Boolean);

  const entries: string[] = [];
  for (const line of lines) {
    const segments = line.split(/,/).map((s) => s.trim()).filter(Boolean);
    for (const seg of segments) {
      entries.push(seg);
    }
  }

  return Array.from(new Set(entries));
}

function normalizeForComparison(word: string): string {
  return word.toLowerCase().replace(/^(der|die|das|ein|eine|einen|einem|einer|eines)\s+/i, '').trim();
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const body = await request.json();
    const { words: wordsInput } = body;
    if (typeof wordsInput !== 'string') {
      return NextResponse.json({ success: false, error: 'words must be a string' }, { status: 400 });
    }
    const parsedWords = parseWords(wordsInput);
    if (parsedWords.length === 0) {
      return NextResponse.json({ success: false, error: 'No valid words provided' }, { status: 400 });
    }

    const existingRows = await db.select({ word: userWords.word })
      .from(userWords)
      .where(eq(userWords.userId, userId));
    const existingNormalized = new Set(existingRows.map((r) => normalizeForComparison(r.word)));

    const newWords = parsedWords.filter((w) => !existingNormalized.has(normalizeForComparison(w)));
    const skippedCount = parsedWords.length - newWords.length;

    if (newWords.length === 0) {
      return NextResponse.json({
        success: false,
        error: `All ${parsedWords.length} word(s) already exist in your vocabulary.`,
        skipped: skippedCount,
      }, { status: 400 });
    }

    let enrichedWords;
    try {
      enrichedWords = await enrichWords(newWords);
    } catch (enrichErr) {
      console.error('Enrichment failed:', enrichErr);
      const msg = enrichErr instanceof Error ? enrichErr.message : 'Unknown enrichment error';
      return NextResponse.json({ success: false, error: `Enrichment failed: ${msg}` }, { status: 500 });
    }
    if (enrichedWords.length === 0) {
      return NextResponse.json({ success: false, error: 'AI could not process the words. Please try again.' }, { status: 400 });
    }

    const deduped = enrichedWords.filter((w) => !existingNormalized.has(normalizeForComparison(w.word)));
    if (deduped.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'All words already exist in your vocabulary.',
        skipped: enrichedWords.length,
      }, { status: 400 });
    }

    const [batch] = await db.insert(wordBatches).values({
      userId,
      name: `Batch ${new Date().toLocaleDateString('de-DE')}`,
      wordCount: deduped.length,
    }).returning();

    const insertRows = deduped.map((w) => ({
      userId,
      word: w.word,
      partOfSpeech: w.part_of_speech,
      gender: w.gender,
      pluralForm: w.plural_form,
      conjugation: w.conjugation as Record<string, string> | null,
      meaning: w.meaning,
      cefrLevel: w.cefr_level,
      exampleSentence: w.example_sentence,
      verbType: w.verb_type ?? null,
      auxiliaryType: w.auxiliary_type ?? null,
      presentForm: w.present_form ?? null,
      simplePast: w.simple_past ?? null,
      perfectForm: w.perfect_form ?? null,
      batchId: batch.id,
    }));

    const DB_INSERT_BATCH = 50;
    for (let i = 0; i < insertRows.length; i += DB_INSERT_BATCH) {
      await db.insert(userWords).values(insertRows.slice(i, i + DB_INSERT_BATCH));
    }
    return NextResponse.json({
      success: true,
      count: deduped.length,
      skipped: skippedCount + (enrichedWords.length - deduped.length),
      words: deduped,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    console.error('Vocabulary upload error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
