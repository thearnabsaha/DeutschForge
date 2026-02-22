import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userWords } from '@/lib/schema';
import { enrichWords } from '@/lib/groq';
import { DEFAULT_USER_ID } from '@/lib/utils';

function parseWords(wordsString: string): string[] {
  const raw = wordsString
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return Array.from(new Set(raw));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { words: wordsInput } = body;
    if (typeof wordsInput !== 'string') {
      return NextResponse.json({ success: false, error: 'words must be a string' }, { status: 400 });
    }
    const parsedWords = parseWords(wordsInput);
    if (parsedWords.length === 0) {
      return NextResponse.json({ success: false, error: 'No valid words provided' }, { status: 400 });
    }
    const enrichedWords = await enrichWords(parsedWords);
    if (enrichedWords.length === 0) {
      return NextResponse.json({ success: false, error: 'No words could be enriched' }, { status: 400 });
    }
    for (const w of enrichedWords) {
      await db.insert(userWords).values({
        userId: DEFAULT_USER_ID,
        word: w.word,
        partOfSpeech: w.part_of_speech,
        gender: w.gender,
        pluralForm: w.plural_form,
        conjugation: w.conjugation as Record<string, string> | null,
        meaning: w.meaning,
        cefrLevel: w.cefr_level,
        exampleSentence: w.example_sentence,
      });
    }
    return NextResponse.json({
      success: true,
      count: enrichedWords.length,
      words: enrichedWords,
    });
  } catch (error) {
    console.error('Vocabulary upload error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
