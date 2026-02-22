import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { reminders, wordReviewLogs, userWords } from '@/lib/schema';
import { eq, and, desc, lte, sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const userId = session.id;
    const now = new Date();

    // Check missed days
    const recentReviews = await db
      .select({ date: sql<string>`date(${wordReviewLogs.reviewedAt})` })
      .from(wordReviewLogs)
      .where(eq(wordReviewLogs.userId, userId))
      .groupBy(sql`date(${wordReviewLogs.reviewedAt})`)
      .orderBy(desc(sql`date(${wordReviewLogs.reviewedAt})`))
      .limit(7);

    const reviewDates = recentReviews.map((r) => r.date);
    let missedDays = 0;
    if (reviewDates.length > 0) {
      const today = now.toISOString().split('T')[0];
      const yesterday = new Date(now.getTime() - 86400000).toISOString().split('T')[0];
      if (!reviewDates.includes(today) && !reviewDates.includes(yesterday)) {
        missedDays = 2;
      }
    }

    if (missedDays >= 2) {
      const existing = await db
        .select()
        .from(reminders)
        .where(and(eq(reminders.userId, userId), eq(reminders.type, 'missed_days'), eq(reminders.read, false)))
        .limit(1);
      if (existing.length === 0) {
        await db.insert(reminders).values({
          userId,
          type: 'missed_days',
          message: "You've missed 2 days of practice! Your streak is at risk. Jump back in now!",
        });
      }
    }

    // Check overdue cards
    const overdueCount = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(userWords)
      .where(and(eq(userWords.userId, userId), lte(userWords.nextReview, now)));
    const overdue = overdueCount[0]?.count ?? 0;

    if (overdue >= 10) {
      const existing = await db
        .select()
        .from(reminders)
        .where(and(eq(reminders.userId, userId), eq(reminders.type, 'overdue_cards'), eq(reminders.read, false)))
        .limit(1);
      if (existing.length === 0) {
        await db.insert(reminders).values({
          userId,
          type: 'overdue_cards',
          message: `You have ${overdue} overdue words waiting for review. Don't let them slip!`,
        });
      }
    }

    // Return unread reminders
    const unread = await db
      .select()
      .from(reminders)
      .where(and(eq(reminders.userId, userId), eq(reminders.read, false)))
      .orderBy(desc(reminders.createdAt));

    return NextResponse.json({ reminders: unread, count: unread.length });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const { reminderId } = await req.json();

    await db
      .update(reminders)
      .set({ read: true })
      .where(and(eq(reminders.id, reminderId), eq(reminders.userId, session.id)));

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
