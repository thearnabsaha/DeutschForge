import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { conversationMessages, conversationSessions } from '@/lib/schema';
import { eq, and, asc } from 'drizzle-orm';
import { getCurrentUserId } from '@/lib/get-user';

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      );
    }

    const [session] = await db
      .select()
      .from(conversationSessions)
      .where(
        and(
          eq(conversationSessions.id, sessionId),
          eq(conversationSessions.userId, userId)
        )
      )
      .limit(1);

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    const rows = await db
      .select()
      .from(conversationMessages)
      .where(eq(conversationMessages.sessionId, sessionId))
      .orderBy(asc(conversationMessages.createdAt));

    const messages = rows.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      translation: m.translation,
      corrections: m.corrections,
      createdAt: m.createdAt,
    }));

    return NextResponse.json({ messages });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    console.error('Chat messages error:', error);
    return NextResponse.json({ messages: [] }, { status: 500 });
  }
}
