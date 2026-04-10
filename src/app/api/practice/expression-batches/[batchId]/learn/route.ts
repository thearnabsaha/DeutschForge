import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userExpressions, expressionBatches, users } from '@/lib/schema';
import { eq, and, sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const { batchId } = await params;
    const { expressionId } = await req.json();

    if (!expressionId) return NextResponse.json({ error: 'expressionId required' }, { status: 400 });

    await db
      .update(userExpressions)
      .set({ learned: true })
      .where(and(eq(userExpressions.id, expressionId), eq(userExpressions.userId, session.id)));

    await db
      .update(users)
      .set({ xp: sql`${users.xp} + 10` })
      .where(eq(users.id, session.id));

    const batchExprs = await db
      .select()
      .from(userExpressions)
      .where(
        and(eq(userExpressions.batchId, batchId), eq(userExpressions.userId, session.id))
      );
    const allLearned = batchExprs.every((e) => e.learned);

    if (allLearned) {
      await db
        .update(expressionBatches)
        .set({ practiceUnlocked: true, learnedCount: batchExprs.length })
        .where(eq(expressionBatches.id, batchId));
    } else {
      const learnedCount = batchExprs.filter((e) => e.learned).length;
      await db
        .update(expressionBatches)
        .set({ learnedCount })
        .where(eq(expressionBatches.id, batchId));
    }

    return NextResponse.json({ success: true, allLearned, xpEarned: 10 });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
