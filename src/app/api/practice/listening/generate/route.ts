import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userWords, listeningAttempts } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { generateListeningExercise } from '@/lib/groq';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { cefrLevel, difficulty } = await req.json();

    if (!['A1', 'A2', 'B1', 'B2'].includes(cefrLevel)) {
      return NextResponse.json({ error: 'Invalid CEFR level' }, { status: 400 });
    }
    if (!['very_easy', 'easy', 'normal', 'hard', 'very_hard'].includes(difficulty)) {
      return NextResponse.json({ error: 'Invalid difficulty' }, { status: 400 });
    }

    const words = await db.select({ word: userWords.word })
      .from(userWords)
      .where(eq(userWords.userId, session.id));

    const vocabulary = words.map(w => w.word);
    if (vocabulary.length === 0) {
      return NextResponse.json({ error: 'Upload some vocabulary first to use listening practice' }, { status: 400 });
    }

    const exercise = await generateListeningExercise(cefrLevel, difficulty, vocabulary);

    const [attempt] = await db.insert(listeningAttempts).values({
      userId: session.id,
      cefrLevel,
      difficulty,
      script: exercise.script,
      newWordsUsed: exercise.new_words_used,
      questions: exercise.questions.map(q => ({
        question: q.question,
        options: q.options,
        correctIndex: q.correct_index,
        explanation: q.explanation,
        type: q.type,
      })),
    }).returning();

    return NextResponse.json({
      attemptId: attempt.id,
      script: exercise.script,
      newWordsUsed: exercise.new_words_used,
      questions: exercise.questions.map(q => ({
        question: q.question,
        options: q.options,
        type: q.type,
      })),
      questionCount: exercise.questions.length,
    });
  } catch (error) {
    console.error('Listening generate error:', error);
    const message = error instanceof Error ? error.message : 'Generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
