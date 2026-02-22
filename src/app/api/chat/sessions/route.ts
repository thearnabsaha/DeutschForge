import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { conversationSessions } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { getCurrentUserId } from '@/lib/get-user';

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    const sessions = await db
      .select()
      .from(conversationSessions)
      .where(eq(conversationSessions.userId, userId))
      .orderBy(desc(conversationSessions.createdAt));

    return NextResponse.json({ sessions });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    console.error('Chat sessions error:', error);
    return NextResponse.json({ sessions: [] });
  }
}
