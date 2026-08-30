import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { wordBatches, userWords, wordBatchExams, wordReviewLogs, questionSnapshots } from '@/lib/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

// PATCH /api/vocabulary/sets/[setId] - Rename a word set
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ setId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const { setId } = await params;
    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Set name is required' }, { status: 400 });
    }

    await db
      .update(wordBatches)
      .set({ name: name.trim() })
      .where(and(eq(wordBatches.id, setId), eq(wordBatches.userId, session.id)));

    return NextResponse.json({ success: true, name: name.trim() });
  } catch (error) {
    console.error('Error renaming set:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/vocabulary/sets/[setId] - Delete a word set and its associated words
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ setId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const { setId } = await params;

    const words = await db
      .select({ id: userWords.id })
      .from(userWords)
      .where(and(eq(userWords.batchId, setId), eq(userWords.userId, session.id)));

    const wordIds = words.map((w) => w.id);

    if (wordIds.length > 0) {
      await db.delete(questionSnapshots).where(
        and(eq(questionSnapshots.userId, session.id), inArray(questionSnapshots.wordId, wordIds))
      );
      await db.delete(wordReviewLogs).where(
        and(eq(wordReviewLogs.userId, session.id), inArray(wordReviewLogs.wordId, wordIds))
      );
    }

    await db.delete(wordBatchExams).where(
      and(eq(wordBatchExams.batchId, setId), eq(wordBatchExams.userId, session.id))
    );

    await db.delete(userWords).where(
      and(eq(userWords.batchId, setId), eq(userWords.userId, session.id))
    );

    await db.delete(wordBatches).where(
      and(eq(wordBatches.id, setId), eq(wordBatches.userId, session.id))
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting set:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
