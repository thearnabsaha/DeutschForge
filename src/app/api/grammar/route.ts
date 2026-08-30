import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { grammarAttempts } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUserId } from '@/lib/get-user';
import { GRAMMAR_TOPICS } from '@/lib/grammar-data';

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    const topics = GRAMMAR_TOPICS;

    const attempts = await db
      .select()
      .from(grammarAttempts)
      .where(eq(grammarAttempts.userId, userId));

    const grouped: Record<string, unknown[]> = { A1: [], A2: [], B1: [], B2: [] };
    for (const t of topics) {
      const topicAttempts = attempts.filter((a) => a.topicId === t.id);
      const bestAttempt = topicAttempts.sort((a, b) => b.score - a.score)[0];
      const arr = grouped[t.cefrLevel || 'A1'] as unknown[];
      if (arr) {
        arr.push({
          ...t,
          bestScore: bestAttempt?.score ?? null,
          bestMaxScore: bestAttempt?.maxScore ?? null,
          attemptCount: topicAttempts.length,
        });
      }
    }

    return NextResponse.json({ topics: grouped });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
