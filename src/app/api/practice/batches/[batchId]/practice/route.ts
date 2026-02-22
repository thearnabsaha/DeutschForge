import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { wordBatches, users } from '@/lib/schema';
import { eq, sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const { batchId } = await params;

    const { correctCount, totalCount } = await req.json();

    const correct = correctCount ?? 0;
    const total = totalCount ?? 0;
    const xpEarned = correct * 10;

    // Award XP
    await db
      .update(users)
      .set({ xp: sql`${users.xp} + ${xpEarned}` })
      .where(eq(users.id, session.id));

    // Unlock exam when practice test is completed (regardless of score)
    const passed = total > 0 && correct / total >= 0.7;
    await db
      .update(wordBatches)
      .set({ examUnlocked: true })
      .where(eq(wordBatches.id, batchId));

    return NextResponse.json({ success: true, xpEarned, passed, examUnlocked: true });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
