import { NextRequest, NextResponse } from 'next/server';
import { speakingConversation } from '@/lib/groq';

export async function POST(request: NextRequest) {
  try {
    const { cefrLevel, task, history, userMessage } = (await request.json()) as {
      cefrLevel: string;
      task: string;
      history: Array<{ role: 'examiner' | 'candidate'; content: string }>;
      userMessage: string;
    };

    if (!cefrLevel || !task || !userMessage) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const response = await speakingConversation(cefrLevel, task, history || [], userMessage);
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Speaking error:', error);
    return NextResponse.json(
      { response: 'Entschuldigung, es gibt ein technisches Problem. Bitte versuchen Sie es erneut.' },
      { status: 200 }
    );
  }
}
