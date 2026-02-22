import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { generatePracticeQuestion } from '@/lib/groq';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await req.json();
    const {
      wordId,
      word,
      meaning,
      partOfSpeech,
      gender,
      conjugation,
      pluralForm,
      questionType,
      direction,
    } = body;

    if (!word || !meaning || !partOfSpeech) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await generatePracticeQuestion({
      wordId: wordId || '',
      word,
      meaning,
      partOfSpeech,
      gender: gender ?? null,
      conjugation: conjugation ?? null,
      pluralForm: pluralForm ?? null,
      questionType: questionType || 'meaning',
      direction: direction || 'both',
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Generate question error:', error);
    return NextResponse.json(
      { error: 'Failed to generate question' },
      { status: 500 }
    );
  }
}
