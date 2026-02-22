import { NextRequest, NextResponse } from 'next/server';
import { eq, desc, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { userWords } from '@/lib/schema';
import { getCurrentUserId } from '@/lib/get-user';

type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'preposition' | 'conjunction' | 'other';
type Gender = 'masculine' | 'feminine' | 'neuter';
type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2';

interface Analytics {
  totalWords: number;
  byPartOfSpeech: Record<PartOfSpeech, number>;
  byGender: Record<Gender, number>;
  byCefrLevel: Record<CefrLevel, number>;
  mastered: number;
}

function normalizePos(pos: string): PartOfSpeech {
  const p = pos?.toLowerCase();
  if (p === 'noun') return 'noun';
  if (p === 'verb') return 'verb';
  if (p === 'adjective') return 'adjective';
  if (p === 'preposition') return 'preposition';
  if (p === 'conjunction') return 'conjunction';
  return 'other';
}

function normalizeGender(g: string | null): Gender | null {
  if (!g) return null;
  const lower = g.toLowerCase();
  if (lower === 'masculine') return 'masculine';
  if (lower === 'feminine') return 'feminine';
  if (lower === 'neuter') return 'neuter';
  return null;
}

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    const rows = await db
      .select()
      .from(userWords)
      .where(eq(userWords.userId, userId))
      .orderBy(desc(userWords.createdAt));

    const analytics: Analytics = {
      totalWords: rows.length,
      byPartOfSpeech: {
        noun: 0,
        verb: 0,
        adjective: 0,
        preposition: 0,
        conjunction: 0,
        other: 0,
      },
      byGender: {
        masculine: 0,
        feminine: 0,
        neuter: 0,
      },
      byCefrLevel: {
        A1: 0,
        A2: 0,
        B1: 0,
        B2: 0,
      },
      mastered: 0,
    };

    for (const row of rows) {
      const pos = normalizePos(row.partOfSpeech);
      analytics.byPartOfSpeech[pos] = (analytics.byPartOfSpeech[pos] ?? 0) + 1;

      const gender = normalizeGender(row.gender);
      if (gender) {
        analytics.byGender[gender] = (analytics.byGender[gender] ?? 0) + 1;
      }

      const level = row.cefrLevel as CefrLevel;
      if (['A1', 'A2', 'B1', 'B2'].includes(level)) {
        analytics.byCefrLevel[level] = (analytics.byCefrLevel[level] ?? 0) + 1;
      }

      const state = row.state ?? 0;
      const stability = row.stability ?? 0;
      if (state >= 2 && stability >= 21) {
        analytics.mastered += 1;
      }
    }

    const verbs = rows.filter(w => w.partOfSpeech === 'verb');
    const verbBreakdown = {
      total: verbs.length,
      regular: verbs.filter(w => w.verbType === 'regular').length,
      irregular: verbs.filter(w => w.verbType === 'irregular').length,
      mixed: verbs.filter(w => w.verbType === 'mixed').length,
      haben: verbs.filter(w => w.auxiliaryType === 'haben').length,
      sein: verbs.filter(w => w.auxiliaryType === 'sein').length,
    };

    return NextResponse.json({ words: rows, analytics, verbBreakdown });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    console.error('Vocabulary GET error:', error);
    return NextResponse.json({ words: [], analytics: null }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id parameter' }, { status: 400 });
    }
    await db
      .delete(userWords)
      .where(and(eq(userWords.id, id), eq(userWords.userId, userId)));
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    console.error('Vocabulary DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Delete failed' }, { status: 500 });
  }
}
