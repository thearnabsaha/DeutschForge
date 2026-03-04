import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userWords, wordBatches } from '@/lib/schema';
import { eq, and, sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { enrichWords } from '@/lib/groq';

function normalizeForComparison(word: string): string {
  return word.toLowerCase().replace(/^(der|die|das|ein|eine|einen|einem|einer|eines)\s+/i, '').trim();
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const { batchId } = await params;

    const batch = await db.select().from(wordBatches)
      .where(and(eq(wordBatches.id, batchId), eq(wordBatches.userId, session.id)));
    if (batch.length === 0) return NextResponse.json({ error: 'Batch not found' }, { status: 404 });

    const { words: wordsInput } = await req.json();
    if (typeof wordsInput !== 'string' || !wordsInput.trim()) {
      return NextResponse.json({ error: 'Words string required' }, { status: 400 });
    }

    const lines = wordsInput.split(/\n+/).map((l: string) => l.trim()).filter(Boolean);
    const parsed: string[] = [];
    for (const line of lines) {
      const segs = line.split(/,/).map((s: string) => s.trim()).filter(Boolean);
      for (const seg of segs) parsed.push(seg);
    }
    const unique = Array.from(new Set(parsed));
    if (unique.length === 0) return NextResponse.json({ error: 'No valid words' }, { status: 400 });

    const existingRows = await db.select({ word: userWords.word })
      .from(userWords)
      .where(eq(userWords.userId, session.id));
    const existingNormalized = new Set(existingRows.map((r) => normalizeForComparison(r.word)));

    const newWords = unique.filter((w) => !existingNormalized.has(normalizeForComparison(w)));
    if (newWords.length === 0) {
      return NextResponse.json({ error: 'All words already exist in your vocabulary', added: 0, skipped: unique.length }, { status: 400 });
    }

    const enriched = await enrichWords(newWords);
    if (enriched.length === 0) return NextResponse.json({ error: 'Enrichment failed' }, { status: 500 });

    const deduped = enriched.filter((w) => !existingNormalized.has(normalizeForComparison(w.word)));
    if (deduped.length === 0) {
      return NextResponse.json({ error: 'All words already exist in your vocabulary', added: 0 }, { status: 400 });
    }

    for (const w of deduped) {
      await db.insert(userWords).values({
        userId: session.id,
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
        batchId,
      });
    }

    await db.update(wordBatches)
      .set({ wordCount: sql`${wordBatches.wordCount} + ${deduped.length}` })
      .where(eq(wordBatches.id, batchId));

    return NextResponse.json({ success: true, added: deduped.length, skipped: unique.length - newWords.length + (enriched.length - deduped.length) });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
