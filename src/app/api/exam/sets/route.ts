import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { examSets, examAttempts } from '@/lib/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const level = searchParams.get('level') || 'A1';

    const sets = await db.select({
      id: examSets.id,
      cefrLevel: examSets.cefrLevel,
      setNumber: examSets.setNumber,
      isStatic: examSets.isStatic,
      timeLimit: examSets.timeLimit,
      totalMarks: examSets.totalMarks,
    })
      .from(examSets)
      .where(eq(examSets.cefrLevel, level))
      .orderBy(examSets.setNumber);

    const existingSetNumbers = new Set(sets.map(s => s.setNumber));

    const attempts = await db.select({
      id: examAttempts.id,
      setNumber: examAttempts.setNumber,
      totalScore: examAttempts.totalScore,
      maxScore: examAttempts.maxScore,
      status: examAttempts.status,
      completedAt: examAttempts.completedAt,
    })
      .from(examAttempts)
      .where(and(
        eq(examAttempts.userId, session.id),
        eq(examAttempts.cefrLevel, level),
      ))
      .orderBy(desc(examAttempts.startedAt));

    const attemptsBySet: Record<number, Array<{
      id: string;
      totalScore: number | null;
      maxScore: number | null;
      status: string;
      completedAt: Date | null;
    }>> = {};

    for (const a of attempts) {
      const sn = a.setNumber ?? 0;
      if (!attemptsBySet[sn]) attemptsBySet[sn] = [];
      attemptsBySet[sn].push(a);
    }

    const grid = [];
    for (let i = 1; i <= 100; i++) {
      const exists = existingSetNumbers.has(i);
      const setAttempts = attemptsBySet[i] || [];
      const completed = setAttempts.filter(a => a.status === 'completed');
      const bestAttempt = completed.sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0))[0];

      grid.push({
        setNumber: i,
        exists,
        isStatic: exists && (sets.find(s => s.setNumber === i)?.isStatic ?? false),
        attemptCount: setAttempts.length,
        completedCount: completed.length,
        bestScore: bestAttempt?.totalScore ?? null,
        bestMaxScore: bestAttempt?.maxScore ?? null,
        bestPercentage: bestAttempt && bestAttempt.maxScore
          ? Math.round(((bestAttempt.totalScore ?? 0) / bestAttempt.maxScore) * 100)
          : null,
      });
    }

    return NextResponse.json({ level, sets: grid });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
