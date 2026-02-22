import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { wordBatches, userWords } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const batches = await db
      .select()
      .from(wordBatches)
      .where(eq(wordBatches.userId, session.id))
      .orderBy(desc(wordBatches.createdAt));

    const result = [];
    for (const b of batches) {
      const words = await db.select().from(userWords).where(eq(userWords.batchId, b.id));
      const learnedCount = words.filter((w) => w.learned).length;
      result.push({ ...b, learnedCount, words });
    }

    return NextResponse.json({ batches: result });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
