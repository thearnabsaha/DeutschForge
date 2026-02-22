import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  conversationSessions,
  conversationMessages,
} from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { chatWithCorrections } from '@/lib/groq';
import { getCurrentUserId } from '@/lib/get-user';

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const body = (await request.json()) as {
      sessionId?: string;
      message: string;
      cefrLevel?: string;
    };

    const { sessionId, message, cefrLevel = 'A1' } = body;

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    let activeSessionId = sessionId;

    if (!activeSessionId) {
      const [newSession] = await db
        .insert(conversationSessions)
        .values({
          userId,
          cefrLevel,
          messageCount: 0,
        })
        .returning();

      if (!newSession) {
        return NextResponse.json(
          { error: 'Failed to create session' },
          { status: 500 }
        );
      }
      activeSessionId = newSession.id;
    }

    await db.insert(conversationMessages).values({
      sessionId: activeSessionId,
      role: 'user',
      content: message.trim(),
    });

    const sessionMessages = await db
      .select({ role: conversationMessages.role, content: conversationMessages.content })
      .from(conversationMessages)
      .where(eq(conversationMessages.sessionId, activeSessionId))
      .orderBy(conversationMessages.createdAt);

    const history = sessionMessages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, content: m.content }));

    const { reply, translation, corrections } = await chatWithCorrections(
      cefrLevel,
      history.slice(0, -1),
      message.trim()
    );

    await db.insert(conversationMessages).values({
      sessionId: activeSessionId,
      role: 'assistant',
      content: reply,
      translation,
      corrections: corrections || [],
    });

    const [session] = await db
      .select()
      .from(conversationSessions)
      .where(eq(conversationSessions.id, activeSessionId))
      .limit(1);

    if (session) {
      await db
        .update(conversationSessions)
        .set({
          messageCount: session.messageCount + 2,
          cefrLevel,
        })
        .where(eq(conversationSessions.id, activeSessionId));
    }

    return NextResponse.json({
      sessionId: activeSessionId,
      reply,
      translation,
      corrections: corrections || [],
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
}
