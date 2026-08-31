import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { conversationSessions } from '@/lib/schema';
import { eq, desc, and } from 'drizzle-orm';
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

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const all = searchParams.get('all') === 'true';

    if (all) {
      await db
        .delete(conversationSessions)
        .where(eq(conversationSessions.userId, userId));
      return NextResponse.json({ success: true, message: 'All chat history deleted' });
    }

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId or all=true required' }, { status: 400 });
    }

    await db
      .delete(conversationSessions)
      .where(
        and(
          eq(conversationSessions.id, sessionId),
          eq(conversationSessions.userId, userId)
        )
      );

    return NextResponse.json({ success: true, message: 'Chat deleted' });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    console.error('Delete chat error:', error);
    return NextResponse.json({ error: 'Failed to delete chat' }, { status: 500 });
  }
}
