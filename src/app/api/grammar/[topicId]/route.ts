import { NextRequest, NextResponse } from 'next/server';
import { getGrammarChapterById } from '@/lib/grammar-data';
import { getPracticeForChapter } from '@/lib/grammar-practice-data';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ topicId: string }> }
) {
  try {
    const { topicId } = await params;
    const chapter = getGrammarChapterById(topicId);

    if (!chapter) {
      return NextResponse.json({ error: 'Grammar chapter not found' }, { status: 404 });
    }

    const practice = getPracticeForChapter(chapter.id);

    return NextResponse.json({
      ...chapter,
      hasPractice: !!practice,
      practiceLevelCount: practice ? practice.levels.length : 0,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
