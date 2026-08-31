import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { wordBatches, userWords } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const [batches, allUserWords] = await Promise.all([
      db
        .select()
        .from(wordBatches)
        .where(eq(wordBatches.userId, session.id))
        .orderBy(desc(wordBatches.createdAt)),
      db
        .select()
        .from(userWords)
        .where(eq(userWords.userId, session.id))
        .orderBy(desc(userWords.createdAt)),
    ]);

    const wordsByBatch = new Map<string, typeof allUserWords>();
    for (const word of allUserWords) {
      if (word.batchId) {
        const list = wordsByBatch.get(word.batchId) || [];
        list.push(word);
        wordsByBatch.set(word.batchId, list);
      }
    }

    const result = batches.map((b) => {
      const words = wordsByBatch.get(b.id) || [];
      const learnedCount = words.filter((w) => w.learned).length;
      return { ...b, learnedCount, words };
    });

    return NextResponse.json({ batches: result });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
