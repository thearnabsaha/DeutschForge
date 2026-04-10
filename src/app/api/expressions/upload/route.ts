import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { userExpressions, expressionBatches } from '@/lib/schema';
import { enrichExpressions } from '@/lib/groq';
import { getCurrentUserId } from '@/lib/get-user';

export const maxDuration = 120;

function parseExpressions(input: string): string[] {
  const lines = input.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const entries: string[] = [];
  for (const line of lines) {
    const segments = line.split(/(?<!\w),(?!\w)/).map((s) => s.trim()).filter(Boolean);
    for (const seg of segments) {
      entries.push(seg);
    }
  }
  return Array.from(new Set(entries));
}

function normalizeForComparison(expr: string): string {
  return expr.toLowerCase().trim();
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const body = await request.json();
    const { expressions: expressionsInput } = body;
    if (typeof expressionsInput !== 'string') {
      return NextResponse.json({ success: false, error: 'expressions must be a string' }, { status: 400 });
    }
    const parsed = parseExpressions(expressionsInput);
    if (parsed.length === 0) {
      return NextResponse.json({ success: false, error: 'No valid expressions provided' }, { status: 400 });
    }

    const existingRows = await db.select({ expression: userExpressions.expression })
      .from(userExpressions)
      .where(eq(userExpressions.userId, userId));
    const existingNormalized = new Set(existingRows.map((r) => normalizeForComparison(r.expression)));

    const newExprs = parsed.filter((e) => !existingNormalized.has(normalizeForComparison(e)));
    const skippedCount = parsed.length - newExprs.length;

    if (newExprs.length === 0) {
      return NextResponse.json({
        success: false,
        error: `All ${parsed.length} expression(s) already exist.`,
        skipped: skippedCount,
      }, { status: 400 });
    }

    let enriched;
    try {
      enriched = await enrichExpressions(newExprs);
    } catch (enrichErr) {
      console.error('Expression enrichment failed:', enrichErr);
      const msg = enrichErr instanceof Error ? enrichErr.message : 'Unknown enrichment error';
      return NextResponse.json({ success: false, error: `Enrichment failed: ${msg}` }, { status: 500 });
    }
    if (enriched.length === 0) {
      return NextResponse.json({ success: false, error: 'AI could not process the expressions. Please try again.' }, { status: 400 });
    }

    const deduped = enriched.filter((e) => !existingNormalized.has(normalizeForComparison(e.expression)));
    if (deduped.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'All expressions already exist.',
        skipped: enriched.length,
      }, { status: 400 });
    }

    const [batch] = await db.insert(expressionBatches).values({
      userId,
      name: `Batch ${new Date().toLocaleDateString('de-DE')}`,
      expressionCount: deduped.length,
    }).returning();

    const insertRows = deduped.map((e) => ({
      userId,
      expression: e.expression,
      meaning: e.meaning,
      literalTranslation: e.literal_translation,
      register: e.register,
      cefrLevel: e.cefr_level,
      exampleSentence: e.example_sentence,
      usageNote: e.usage_note,
      category: e.category,
      batchId: batch.id,
    }));

    const DB_INSERT_BATCH = 50;
    for (let i = 0; i < insertRows.length; i += DB_INSERT_BATCH) {
      await db.insert(userExpressions).values(insertRows.slice(i, i + DB_INSERT_BATCH));
    }
    return NextResponse.json({
      success: true,
      count: deduped.length,
      skipped: skippedCount + (enriched.length - deduped.length),
      expressions: deduped,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    console.error('Expression upload error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
