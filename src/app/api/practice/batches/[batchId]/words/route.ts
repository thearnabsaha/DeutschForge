import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userWords, wordBatches } from '@/lib/schema';
import { eq, and, sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { enrichWords } from '@/lib/groq';

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

    const parsed = wordsInput.split(/[\n,]+/).map((s: string) => s.trim()).filter(Boolean);
    const unique = Array.from(new Set(parsed));
    if (unique.length === 0) return NextResponse.json({ error: 'No valid words' }, { status: 400 });

    const enriched = await enrichWords(unique);
    if (enriched.length === 0) return NextResponse.json({ error: 'Enrichment failed' }, { status: 500 });

    for (const w of enriched) {
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
      .set({ wordCount: sql`${wordBatches.wordCount} + ${enriched.length}` })
      .where(eq(wordBatches.id, batchId));

    return NextResponse.json({ success: true, added: enriched.length });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
