import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { listeningAttempts } from '@/lib/schema';
import { eq, desc, and, isNotNull } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const attempts = await db.select({
      id: listeningAttempts.id,
      cefrLevel: listeningAttempts.cefrLevel,
      difficulty: listeningAttempts.difficulty,
      score: listeningAttempts.score,
      maxScore: listeningAttempts.maxScore,
      timeSpent: listeningAttempts.timeSpent,
      completedAt: listeningAttempts.completedAt,
      createdAt: listeningAttempts.createdAt,
    }).from(listeningAttempts)
      .where(and(
        eq(listeningAttempts.userId, session.id),
        isNotNull(listeningAttempts.completedAt)
      ))
      .orderBy(desc(listeningAttempts.createdAt))
      .limit(50);

    const totalAttempts = attempts.length;
    const avgScore = totalAttempts > 0
      ? Math.round(attempts.reduce((sum, a) => sum + ((a.score ?? 0) / (a.maxScore ?? 1)) * 100, 0) / totalAttempts)
      : 0;

    const byLevel: Record<string, { attempts: number; avgScore: number }> = {};
    for (const a of attempts) {
      if (!byLevel[a.cefrLevel]) byLevel[a.cefrLevel] = { attempts: 0, avgScore: 0 };
      byLevel[a.cefrLevel].attempts++;
      byLevel[a.cefrLevel].avgScore += ((a.score ?? 0) / (a.maxScore ?? 1)) * 100;
    }
    for (const level of Object.keys(byLevel)) {
      byLevel[level].avgScore = Math.round(byLevel[level].avgScore / byLevel[level].attempts);
    }

    return NextResponse.json({ attempts, totalAttempts, avgScore, byLevel });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
