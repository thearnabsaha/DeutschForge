import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  examTemplates,
  examTemplateSections,
  examAttempts,
  examSectionScores,
} from '@/lib/schema';
import { eq, asc } from 'drizzle-orm';
import { DEFAULT_USER_ID } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { cefrLevel } = (await request.json()) as { cefrLevel: string };

    const [template] = await db
      .select()
      .from(examTemplates)
      .where(eq(examTemplates.cefrLevel, cefrLevel))
      .limit(1);

    if (!template) {
      return NextResponse.json(
        { error: `No exam template found for ${cefrLevel}` },
        { status: 404 }
      );
    }

    const sections = await db
      .select()
      .from(examTemplateSections)
      .where(eq(examTemplateSections.templateId, template.id))
      .orderBy(asc(examTemplateSections.sortOrder));

    const [attempt] = await db
      .insert(examAttempts)
      .values({
        userId: DEFAULT_USER_ID,
        templateId: template.id,
        cefrLevel,
        status: 'in_progress',
      })
      .returning();

    if (!attempt) {
      return NextResponse.json({ error: 'Failed to create attempt' }, { status: 500 });
    }

    for (const sec of sections) {
      await db.insert(examSectionScores).values({
        attemptId: attempt.id,
        section: sec.section,
        maxScore: sec.maxScore,
      });
    }

    return NextResponse.json({ attemptId: attempt.id });
  } catch (error) {
    console.error('Exam start error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
