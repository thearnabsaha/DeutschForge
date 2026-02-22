import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { grammarTopics, grammarAttempts } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUserId } from '@/lib/get-user';

interface AnswerInput {
  exerciseId: string;
  userAnswer: string;
}

function normalizeAnswer(s: string): string {
  return s.trim().toLowerCase();
}

function answersMatch(user: string, correct: string): boolean {
  return normalizeAnswer(user) === normalizeAnswer(correct);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ topicId: string }> }
) {
  try {
    const userId = await getCurrentUserId();
    const { topicId } = await params;
    const body = await request.json();
    const answersInput: AnswerInput[] = body.answers ?? [];
    if (!Array.isArray(answersInput) || answersInput.length === 0) {
      return NextResponse.json({ error: 'answers array required' }, { status: 400 });
    }

    const [topic] = await db
      .select()
      .from(grammarTopics)
      .where(eq(grammarTopics.id, topicId));

    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    const exercises = topic.exercises ?? [];
    const exerciseMap = new Map(exercises.map((e) => [e.id, e]));

    let score = 0;
    const results: Array<{
      exerciseId: string;
      question: string;
      userAnswer: string;
      correctAnswer: string;
      correct: boolean;
      explanation: string;
    }> = [];

    const answerRows: Array<{ exerciseId: string; userAnswer: string; correct: boolean }> = [];

    for (const { exerciseId, userAnswer } of answersInput) {
      const exercise = exerciseMap.get(exerciseId);
      const userAns = typeof userAnswer === 'string' ? userAnswer : String(userAnswer ?? '');
      const correctAns = exercise?.correctAnswer ?? '';
      const correct = answersMatch(userAns, correctAns);
      if (correct) score += 1;

      results.push({
        exerciseId,
        question: exercise?.question ?? '',
        userAnswer: userAns,
        correctAnswer: correctAns,
        correct,
        explanation: exercise?.explanation ?? '',
      });
      answerRows.push({ exerciseId, userAnswer: userAns, correct });
    }

    const maxScore = exercises.length;

    await db.insert(grammarAttempts).values({
      userId,
      topicId,
      score,
      maxScore,
      answers: answerRows,
    });

    return NextResponse.json({
      score,
      maxScore,
      results,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
