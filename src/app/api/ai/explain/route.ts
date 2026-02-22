import { NextRequest, NextResponse } from 'next/server';
import { explainGrammar } from '@/lib/groq';

export async function POST(request: NextRequest) {
  try {
    const { sentence, error, cefrLevel } = (await request.json()) as {
      sentence: string;
      error: string;
      cefrLevel: string;
    };

    if (!sentence || !error) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const explanation = await explainGrammar(sentence, error, cefrLevel || 'A1');
    return NextResponse.json({ explanation });
  } catch (err) {
    console.error('Explain error:', err);
    return NextResponse.json(
      { explanation: 'Unable to generate explanation. Please ensure your GROQ_API_KEY is configured.' },
      { status: 200 }
    );
  }
}
