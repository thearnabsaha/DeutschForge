import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { grammarTopics, grammarAttempts } from '@/lib/schema';
import { eq, asc } from 'drizzle-orm';
import { DEFAULT_USER_ID } from '@/lib/utils';

export async function GET() {
  try {
    const topics = await db
      .select()
      .from(grammarTopics)
      .orderBy(asc(grammarTopics.cefrLevel), asc(grammarTopics.sortOrder));

    const attempts = await db
      .select()
      .from(grammarAttempts)
      .where(eq(grammarAttempts.userId, DEFAULT_USER_ID));

    const grouped: Record<string, unknown[]> = { A1: [], A2: [], B1: [], B2: [] };
    for (const t of topics) {
      const topicAttempts = attempts.filter((a) => a.topicId === t.id);
      const bestAttempt = topicAttempts.sort((a, b) => b.score - a.score)[0];
      const arr = grouped[t.cefrLevel] as unknown[];
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
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
