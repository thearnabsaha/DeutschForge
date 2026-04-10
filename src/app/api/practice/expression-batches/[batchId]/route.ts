import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { expressionBatches, userExpressions, expressionBatchExams, expressionReviewLogs } from '@/lib/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const { batchId } = await params;
    const { name } = await req.json();

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    await db.update(expressionBatches)
      .set({ name: name.trim() })
      .where(and(eq(expressionBatches.id, batchId), eq(expressionBatches.userId, session.id)));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const { batchId } = await params;

    const exprs = await db.select({ id: userExpressions.id }).from(userExpressions)
      .where(and(eq(userExpressions.batchId, batchId), eq(userExpressions.userId, session.id)));
    const exprIds = exprs.map(e => e.id);

    if (exprIds.length > 0) {
      await db.delete(expressionReviewLogs).where(and(
        eq(expressionReviewLogs.userId, session.id),
        inArray(expressionReviewLogs.expressionId, exprIds)
      ));
    }

    await db.delete(expressionBatchExams).where(and(
      eq(expressionBatchExams.batchId, batchId),
      eq(expressionBatchExams.userId, session.id)
    ));

    await db.delete(userExpressions).where(and(
      eq(userExpressions.batchId, batchId),
      eq(userExpressions.userId, session.id)
    ));

    await db.delete(expressionBatches).where(and(
      eq(expressionBatches.id, batchId),
      eq(expressionBatches.userId, session.id)
    ));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
