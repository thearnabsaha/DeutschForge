import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { examSectionScores, examTemplateSections, examAttempts } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { gradeWriting } from '@/lib/groq';

export async function POST(req: Request, { params }: { params: { attemptId: string } }) {
  try {
    const { section, answers, timeSpent } = await req.json();
    const attemptId = params.attemptId;

    // Get the attempt to find templateId
    const [attempt] = await db.select().from(examAttempts).where(eq(examAttempts.id, attemptId));
    if (!attempt) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });

    // Get template section for correct answers
    const [templateSection] = await db
      .select()
      .from(examTemplateSections)
      .where(
        and(
          eq(examTemplateSections.templateId, attempt.templateId),
          eq(examTemplateSections.section, section)
        )
      );
    if (!templateSection) return NextResponse.json({ error: 'Section not found' }, { status: 404 });

    const content = templateSection.content as Record<string, unknown>;
    let score = 0;
    let feedback: Record<string, unknown> = {};

    if (section === 'Lesen' || section === 'LESEN') {
      // Grade reading: compare answers to correct answers in content
      const questions = (content.questions || []) as Array<{
        question: string;
        options?: string[];
        correctAnswer: string;
        explanation?: string;
      }>;
      const results: Array<{
        question: string;
        options?: string[];
        userAnswer: string;
        correctAnswer: string;
        correct: boolean;
        explanation: string;
      }> = [];
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const userAnswer =
          (answers as Record<string | number, unknown>)[i] ||
          (answers as Record<string | number, unknown>)[String(i)] ||
          '';
        const correct =
          String(userAnswer).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
        if (correct) score += templateSection.maxScore / questions.length;
        results.push({
          question: q.question,
          options: q.options,
          userAnswer: String(userAnswer),
          correctAnswer: q.correctAnswer,
          correct,
          explanation: q.explanation || `The correct answer is "${q.correctAnswer}".`,
        });
      }
      feedback = { results };
    } else if (section === 'Hören' || section === 'HOEREN') {
      // Same grading logic as Lesen
      const questions = (content.questions || []) as Array<{
        question: string;
        options?: string[];
        correctAnswer: string;
        explanation?: string;
      }>;
      const results: Array<{
        question: string;
        options?: string[];
        userAnswer: string;
        correctAnswer: string;
        correct: boolean;
        explanation: string;
      }> = [];
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const userAnswer =
          (answers as Record<string | number, unknown>)[i] ||
          (answers as Record<string | number, unknown>)[String(i)] ||
          '';
        const correct =
          String(userAnswer).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
        if (correct) score += templateSection.maxScore / questions.length;
        results.push({
          question: q.question,
          options: q.options,
          userAnswer: String(userAnswer),
          correctAnswer: q.correctAnswer,
          correct,
          explanation: q.explanation || `The correct answer is "${q.correctAnswer}".`,
        });
      }
      feedback = { results };
    } else if (section === 'Schreiben' || section === 'SCHREIBEN') {
      // AI grading via Groq
      try {
        const grade = await gradeWriting({
          cefrLevel: attempt.cefrLevel,
          prompt: (content.prompt as string) || '',
          response: String((answers as Record<string, unknown>)?.text || answers || ''),
        });
        score = grade.score;
        feedback = grade as unknown as Record<string, unknown>;
      } catch {
        score = 0;
        feedback = { error: 'AI grading failed', overallFeedback: 'Could not grade writing.' };
      }
    } else if (section === 'Sprechen' || section === 'SPRECHEN') {
      score = (answers as Record<string, unknown>)?.score as number ?? 0;
      feedback = {
        conversation: (answers as Record<string, unknown>)?.conversation ?? [],
        feedback: (answers as Record<string, unknown>)?.feedback ?? '',
      };
    }

    const roundedScore = Math.round(score * 100) / 100;

    // Save with question snapshot
    await db
      .insert(examSectionScores)
      .values({
        attemptId,
        section,
        score: roundedScore,
        maxScore: templateSection.maxScore,
        answers: answers as object,
        feedback: feedback as object,
        questionSnapshot: content as object,
        timeSpent: timeSpent ?? null,
        completedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [examSectionScores.attemptId, examSectionScores.section],
        set: {
          score: roundedScore,
          answers: answers as object,
          feedback: feedback as object,
          questionSnapshot: content as object,
          timeSpent: timeSpent ?? null,
          completedAt: new Date(),
        },
      });

    return NextResponse.json({
      success: true,
      score: roundedScore,
      maxScore: templateSection.maxScore,
      feedback,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
