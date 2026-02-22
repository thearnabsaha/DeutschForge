import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { wordBatches, userWords, wordBatchExams, wordReviewLogs, questionSnapshots } from '@/lib/schema';
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

    await db.update(wordBatches)
      .set({ name: name.trim() })
      .where(and(eq(wordBatches.id, batchId), eq(wordBatches.userId, session.id)));

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

    const words = await db.select({ id: userWords.id }).from(userWords)
      .where(and(eq(userWords.batchId, batchId), eq(userWords.userId, session.id)));
    const wordIds = words.map(w => w.id);

    if (wordIds.length > 0) {
      await db.delete(questionSnapshots).where(and(
        eq(questionSnapshots.userId, session.id),
        inArray(questionSnapshots.wordId, wordIds)
      ));
      await db.delete(wordReviewLogs).where(and(
        eq(wordReviewLogs.userId, session.id),
        inArray(wordReviewLogs.wordId, wordIds)
      ));
    }

    await db.delete(wordBatchExams).where(and(
      eq(wordBatchExams.batchId, batchId),
      eq(wordBatchExams.userId, session.id)
    ));

    await db.delete(userWords).where(and(
      eq(userWords.batchId, batchId),
      eq(userWords.userId, session.id)
    ));

    await db.delete(wordBatches).where(and(
      eq(wordBatches.id, batchId),
      eq(wordBatches.userId, session.id)
    ));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
