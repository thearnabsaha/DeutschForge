import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  examAttempts,
  examTemplateSections,
} from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { attemptId: string } }
) {
  try {
    const { attemptId } = params;
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section') as
      | 'LESEN'
      | 'HOEREN'
      | 'SCHREIBEN'
      | 'SPRECHEN';

    if (!section) {
      return NextResponse.json(
        { error: 'Missing section param' },
        { status: 400 }
      );
    }

    const [attempt] = await db
      .select()
      .from(examAttempts)
      .where(eq(examAttempts.id, attemptId))
      .limit(1);

    if (!attempt) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    }

    const [templateSection] = await db
      .select()
      .from(examTemplateSections)
      .where(
        and(
          eq(examTemplateSections.templateId, attempt.templateId),
          eq(examTemplateSections.section, section)
        )
      )
      .limit(1);

    if (!templateSection) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    const content = templateSection.content as Record<string, unknown>;

    return NextResponse.json({
      ...content,
      instructions: templateSection.instructions,
      timeMinutes: templateSection.timeMinutes,
    });
  } catch (error) {
    console.error('Exam section error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
