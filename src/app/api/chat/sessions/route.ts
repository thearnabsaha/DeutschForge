import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { conversationSessions } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { DEFAULT_USER_ID } from '@/lib/utils';

export async function GET() {
  try {
    const sessions = await db
      .select()
      .from(conversationSessions)
      .where(eq(conversationSessions.userId, DEFAULT_USER_ID))
      .orderBy(desc(conversationSessions.createdAt));

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Chat sessions error:', error);
    return NextResponse.json({ sessions: [] });
  }
}
