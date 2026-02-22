import { NextRequest, NextResponse } from 'next/server';
import { gradeWriting } from '@/lib/groq';

export async function POST(request: NextRequest) {
  try {
    const { cefrLevel, prompt, response } = (await request.json()) as {
      cefrLevel: string;
      prompt: string;
      response: string;
    };

    if (!cefrLevel || !prompt || !response) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const grade = await gradeWriting({ cefrLevel, prompt, response });
    return NextResponse.json(grade);
  } catch (error) {
    console.error('Grade writing error:', error);
    return NextResponse.json(
      { error: 'Failed to grade writing. Ensure GROQ_API_KEY is set.' },
      { status: 500 }
    );
  }
}
