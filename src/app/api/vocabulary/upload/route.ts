import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userWords, wordBatches } from '@/lib/schema';
import { enrichWords } from '@/lib/groq';
import { getCurrentUserId } from '@/lib/get-user';

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
    let enrichedWords;
    try {
      enrichedWords = await enrichWords(parsedWords);
    } catch (enrichErr) {
      console.error('Enrichment failed:', enrichErr);
      const msg = enrichErr instanceof Error ? enrichErr.message : 'Unknown enrichment error';
      return NextResponse.json({ success: false, error: `Enrichment failed: ${msg}` }, { status: 500 });
    }
    if (enrichedWords.length === 0) {
      return NextResponse.json({ success: false, error: 'AI could not process the words. Please try again.' }, { status: 400 });
    }
    const [batch] = await db.insert(wordBatches).values({
      userId,
      name: `Batch ${new Date().toLocaleDateString('de-DE')}`,
      wordCount: enrichedWords.length,
    }).returning();
    for (const w of enrichedWords) {
      await db.insert(userWords).values({
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
      });
    }
    return NextResponse.json({
      success: true,
      count: enrichedWords.length,
      words: enrichedWords,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    console.error('Vocabulary upload error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
