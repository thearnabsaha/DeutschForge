import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { grammarAttempts } from '@/lib/schema';
import { getGrammarChapterById } from '@/lib/grammar-data';
import { getCurrentUserId } from '@/lib/get-user';

interface AnswerInput {
  exerciseId?: string | number;
  prompt?: string;
  userAnswer: string;
}

function normalizeAnswer(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:'"«»]/g, '')
    .replace(/\s+/g, ' ');
}

function answersMatch(user: string, correct: string): boolean {
  const normUser = normalizeAnswer(user);
  const normCorrect = normalizeAnswer(correct);
  if (normUser === normCorrect) return true;

  // Check if correct has alternative options separated by / or |
  const options = normCorrect.split(/[/|]/).map((o) => o.trim());
  return options.some((opt) => opt === normUser);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ topicId: string }> }
) {
  try {
    const userId = await getCurrentUserId();
    const { topicId } = await params;
    const body = await request.json();

    const chapter = getGrammarChapterById(topicId);
    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    // Check if it's a practice level submission
    if (typeof body.levelIndex === 'number' && typeof body.score === 'number') {
      const maxScore = body.maxScore ?? 10;
      await db.insert(grammarAttempts).values({
        userId,
        topicId: chapter.id,
        score: body.score,
        maxScore,
        answers: body.answers ?? [],
      });

      return NextResponse.json({
        success: true,
        levelIndex: body.levelIndex,
        score: body.score,
        maxScore,
        passed: body.score >= Math.round(maxScore * 0.7),
      });
    }

    // Normal chapter exercises
    const answersInput: AnswerInput[] = body.answers ?? [];
    if (!Array.isArray(answersInput) || answersInput.length === 0) {
      return NextResponse.json({ error: 'answers array required' }, { status: 400 });
    }

    const exercises = chapter.exercises ?? [];
    let score = 0;
    const results: Array<{
      exerciseId: string | number;
      question: string;
      userAnswer: string;
      correctAnswer: string;
      correct: boolean;
      explanation: string;
    }> = [];

    const answerRows: Array<{ exerciseId: string; userAnswer: string; correct: boolean }> = [];

    exercises.forEach((ex, idx) => {
      const submitted =
        answersInput.find(
          (a) =>
            a.exerciseId === (ex as any).id ||
            a.exerciseId === idx ||
            a.prompt === ex.prompt ||
            a.prompt === (ex as any).question
        ) || answersInput[idx];

      const userAns = submitted?.userAnswer ?? '';
      const prompt = ex.prompt || (ex as any).question || `Exercise ${idx + 1}`;
      const correctAns = ex.answer || '';
      const isCorrect = answersMatch(userAns, correctAns);

      if (isCorrect) score += 1;

      results.push({
        exerciseId: (ex as any).id || idx,
        question: prompt,
        userAnswer: userAns,
        correctAnswer: correctAns,
        correct: isCorrect,
        explanation: (ex as any).hint || '',
      });

      answerRows.push({
        exerciseId: String((ex as any).id || idx),
        userAnswer: userAns,
        correct: isCorrect,
      });
    });

    const maxScore = Math.max(exercises.length, 1);

    await db.insert(grammarAttempts).values({
      userId,
      topicId: chapter.id,
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
