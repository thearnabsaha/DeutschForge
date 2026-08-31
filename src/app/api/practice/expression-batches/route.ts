import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { expressionBatches, userExpressions } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const [batches, allUserExpressions] = await Promise.all([
      db
        .select()
        .from(expressionBatches)
        .where(eq(expressionBatches.userId, session.id))
        .orderBy(desc(expressionBatches.createdAt)),
      db
        .select()
        .from(userExpressions)
        .where(eq(userExpressions.userId, session.id))
        .orderBy(desc(userExpressions.createdAt)),
    ]);

    const exprsByBatch = new Map<string, typeof allUserExpressions>();
    for (const expr of allUserExpressions) {
      if (expr.batchId) {
        const list = exprsByBatch.get(expr.batchId) || [];
        list.push(expr);
        exprsByBatch.set(expr.batchId, list);
      }
    }

    const result = batches.map((b) => {
      const expressions = exprsByBatch.get(b.id) || [];
      const learnedCount = expressions.filter((e) => e.learned).length;
      return { ...b, learnedCount, expressions };
    });

    return NextResponse.json({ batches: result });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
