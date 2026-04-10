import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { expressionBatches, userExpressions } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const batches = await db
      .select()
      .from(expressionBatches)
      .where(eq(expressionBatches.userId, session.id))
      .orderBy(desc(expressionBatches.createdAt));

    const result = [];
    for (const b of batches) {
      const expressions = await db.select().from(userExpressions).where(eq(userExpressions.batchId, b.id));
      const learnedCount = expressions.filter((e) => e.learned).length;
      result.push({ ...b, learnedCount, expressions });
    }

    return NextResponse.json({ batches: result });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
