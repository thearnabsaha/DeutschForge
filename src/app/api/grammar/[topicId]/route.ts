import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { grammarTopics } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ topicId: string }> }
) {
  try {
    const { topicId } = await params;
    const rows = await db
      .select()
      .from(grammarTopics)
      .where(eq(grammarTopics.id, topicId));

    const topic = rows[0];
    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    return NextResponse.json(topic);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
