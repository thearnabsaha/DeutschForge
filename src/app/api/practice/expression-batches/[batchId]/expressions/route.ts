import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userExpressions, expressionBatches } from '@/lib/schema';
import { eq, and, sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { enrichExpressions } from '@/lib/groq';

function normalizeForComparison(expr: string): string {
  return expr.toLowerCase().trim();
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const { batchId } = await params;

    const batch = await db.select().from(expressionBatches)
      .where(and(eq(expressionBatches.id, batchId), eq(expressionBatches.userId, session.id)));
    if (batch.length === 0) return NextResponse.json({ error: 'Batch not found' }, { status: 404 });

    const { expressions: exprsInput } = await req.json();
    if (typeof exprsInput !== 'string' || !exprsInput.trim()) {
      return NextResponse.json({ error: 'Expressions string required' }, { status: 400 });
    }

    const lines = exprsInput.split(/\n+/).map((l: string) => l.trim()).filter(Boolean);
    const parsed: string[] = [];
    for (const line of lines) {
      parsed.push(line);
    }
    const unique = Array.from(new Set(parsed));
    if (unique.length === 0) return NextResponse.json({ error: 'No valid expressions' }, { status: 400 });

    const existingRows = await db.select({ expression: userExpressions.expression })
      .from(userExpressions)
      .where(eq(userExpressions.userId, session.id));
    const existingNormalized = new Set(existingRows.map((r) => normalizeForComparison(r.expression)));

    const newExprs = unique.filter((e) => !existingNormalized.has(normalizeForComparison(e)));
    if (newExprs.length === 0) {
      return NextResponse.json({ error: 'All expressions already exist', added: 0, skipped: unique.length }, { status: 400 });
    }

    const enriched = await enrichExpressions(newExprs);
    if (enriched.length === 0) return NextResponse.json({ error: 'Enrichment failed' }, { status: 500 });

    const deduped = enriched.filter((e) => !existingNormalized.has(normalizeForComparison(e.expression)));
    if (deduped.length === 0) {
      return NextResponse.json({ error: 'All expressions already exist', added: 0 }, { status: 400 });
    }

    for (const e of deduped) {
      await db.insert(userExpressions).values({
        userId: session.id,
        expression: e.expression,
        meaning: e.meaning,
        literalTranslation: e.literal_translation,
        register: e.register,
        cefrLevel: e.cefr_level,
        exampleSentence: e.example_sentence,
        usageNote: e.usage_note,
        category: e.category,
        batchId,
      });
    }

    await db.update(expressionBatches)
      .set({ expressionCount: sql`${expressionBatches.expressionCount} + ${deduped.length}` })
      .where(eq(expressionBatches.id, batchId));

    return NextResponse.json({ success: true, added: deduped.length, skipped: unique.length - newExprs.length + (enriched.length - deduped.length) });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
