import { NextRequest, NextResponse } from 'next/server';
import { eq, desc, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { userExpressions } from '@/lib/schema';
import { getCurrentUserId } from '@/lib/get-user';

type Category = 'greeting' | 'farewell' | 'polite' | 'idiom' | 'collocation' | 'proverb' | 'filler' | 'connector' | 'other';
type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2';

interface Analytics {
  totalExpressions: number;
  byCategory: Record<Category, number>;
  byCefrLevel: Record<CefrLevel, number>;
  mastered: number;
}

function normalizeCategory(cat: string | null): Category {
  if (!cat) return 'other';
  const c = cat.toLowerCase();
  if (['greeting', 'farewell', 'polite', 'idiom', 'collocation', 'proverb', 'filler', 'connector'].includes(c)) return c as Category;
  return 'other';
}

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    const rows = await db
      .select()
      .from(userExpressions)
      .where(eq(userExpressions.userId, userId))
      .orderBy(desc(userExpressions.createdAt));

    const analytics: Analytics = {
      totalExpressions: rows.length,
      byCategory: { greeting: 0, farewell: 0, polite: 0, idiom: 0, collocation: 0, proverb: 0, filler: 0, connector: 0, other: 0 },
      byCefrLevel: { A1: 0, A2: 0, B1: 0, B2: 0 },
      mastered: 0,
    };

    for (const row of rows) {
      const cat = normalizeCategory(row.category);
      analytics.byCategory[cat] = (analytics.byCategory[cat] ?? 0) + 1;

      const level = row.cefrLevel as CefrLevel;
      if (['A1', 'A2', 'B1', 'B2'].includes(level)) {
        analytics.byCefrLevel[level] = (analytics.byCefrLevel[level] ?? 0) + 1;
      }

      if ((row.state ?? 0) >= 2 && (row.stability ?? 0) >= 21) {
        analytics.mastered += 1;
      }
    }

    return NextResponse.json({ expressions: rows, analytics });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    console.error('Expressions GET error:', error);
    return NextResponse.json({ expressions: [], analytics: null }, { status: 500 });
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
      .delete(userExpressions)
      .where(and(eq(userExpressions.id, id), eq(userExpressions.userId, userId)));
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    console.error('Expressions DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Delete failed' }, { status: 500 });
  }
}
