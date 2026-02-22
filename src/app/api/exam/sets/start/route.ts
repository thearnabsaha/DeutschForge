import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  examSets, examTemplates, examTemplateSections, examAttempts, examSectionScores,
  userExamSetSnapshots,
} from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { getStaticSet, EXAM_STRUCTURE } from '@/lib/exam-data';
import { callGroq } from '@/lib/groq';

async function ensureExamSet(level: string, setNumber: number): Promise<string> {
  const [existing] = await db.select({ id: examSets.id })
    .from(examSets)
    .where(and(eq(examSets.cefrLevel, level), eq(examSets.setNumber, setNumber)))
    .limit(1);

  if (existing) return existing.id;

  const staticData = getStaticSet(level, setNumber);
  if (staticData) {
    const [set] = await db.insert(examSets).values({
      cefrLevel: level,
      setNumber,
      isStatic: true,
      lesenSection: staticData.lesen,
      hoerenSection: staticData.hoeren,
      schreibenSection: staticData.schreiben,
      sprechenSection: staticData.sprechen,
      timeLimit: staticData.timeLimit,
      totalMarks: staticData.totalMarks,
    }).returning({ id: examSets.id });
    return set.id;
  }

  const generatedSet = await generateDynamicExamSet(level, setNumber);
  const [set] = await db.insert(examSets).values({
    cefrLevel: level,
    setNumber,
    isStatic: false,
    lesenSection: generatedSet.lesen,
    hoerenSection: generatedSet.hoeren,
    schreibenSection: generatedSet.schreiben,
    sprechenSection: generatedSet.sprechen,
    timeLimit: generatedSet.timeLimit,
    totalMarks: generatedSet.totalMarks,
  }).returning({ id: examSets.id });
  return set.id;
}

async function generateDynamicExamSet(level: string, setNumber: number) {
  const structure = EXAM_STRUCTURE[level] || EXAM_STRUCTURE['A1'];

  const prompt = `Generate a complete Goethe-Zertifikat ${level} exam (Set #${setNumber}).

Return a JSON object with this EXACT structure:
{
  "lesen": {
    "passages": [
      {
        "title": "Passage title",
        "text": "Full German reading text...",
        "questions": [
          {
            "id": "q1",
            "text": "Question in German",
            "options": ["A", "B", "C", "D"],
            "correctAnswer": "B",
            "explanation": "English explanation",
            "type": "multiple_choice"
          }
        ]
      }
    ]
  },
  "hoeren": {
    "dialogues": [
      {
        "title": "Dialogue title",
        "script": "Full German dialogue/monologue script...",
        "questions": [
          {
            "id": "h1",
            "text": "Question in German",
            "options": ["A", "B", "C"],
            "correctAnswer": "A",
            "explanation": "English explanation",
            "type": "multiple_choice"
          }
        ]
      }
    ]
  },
  "schreiben": {
    "prompts": [
      {
        "id": "s1",
        "type": "${level === 'A1' ? 'informal_message' : level === 'A2' ? 'informal_email' : level === 'B1' ? 'formal_email' : 'argumentation'}",
        "situation": "Situation description in German",
        "task": "Writing task in German",
        "points": ["Point 1", "Point 2", "Point 3"],
        "wordLimit": ${level === 'A1' ? 40 : level === 'A2' ? 60 : level === 'B1' ? 120 : 200}
      }
    ]
  },
  "sprechen": {
    "tasks": [
      {
        "id": "sp1",
        "type": "${level === 'A1' ? 'self_introduction' : level === 'A2' ? 'discussion' : 'presentation'}",
        "topic": "Topic in German",
        "instructions": "Instructions in German",
        "talkingPoints": ["Point 1", "Point 2", "Point 3"]
      }
    ]
  }
}

RULES:
- ${level} level: Lesen needs 2 passages with 4-5 questions each
- ${level} level: Hören needs 2 dialogues/monologues with 3-5 questions each
- ${level} level: Schreiben needs 1-2 writing prompts
- ${level} level: Sprechen needs 2-3 speaking tasks
- All texts and questions must be in German
- Explanations in English
- Each question needs a unique id
- Match Goethe-Institut format for ${level}
${level === 'A1' ? '- Use simple present tense, basic vocabulary, short texts about daily life' : ''}
${level === 'A2' ? '- Use simple past tense, daily situations, medium-length texts' : ''}
${level === 'B1' ? '- Use opinion-based texts, formal/informal register, complex situations' : ''}
${level === 'B2' ? '- Use argumentative texts, nuanced opinions, academic/professional contexts' : ''}
- type field for questions must be "multiple_choice" or "true_false"
- For true_false questions, options must be ["Richtig", "Falsch"]`;

  const completion = await callGroq({
    messages: [
      { role: 'system', content: 'You are a Goethe-Institut certified exam creator. Generate authentic German language exam content. Return ONLY valid JSON.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.8,
    max_tokens: 4000,
    response_format: { type: 'json_object' },
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error('No AI response for exam generation');

  const parsed = JSON.parse(raw);

  if (!parsed.lesen?.passages || !parsed.hoeren?.dialogues || !parsed.schreiben?.prompts || !parsed.sprechen?.tasks) {
    throw new Error('Invalid exam format from AI');
  }

  return {
    cefrLevel: level,
    setNumber,
    lesen: parsed.lesen,
    hoeren: parsed.hoeren,
    schreiben: parsed.schreiben,
    sprechen: parsed.sprechen,
    timeLimit: structure.totalTime,
    totalMarks: structure.totalMarks,
  };
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { cefrLevel, setNumber } = await req.json();

    if (!['A1', 'A2', 'B1', 'B2'].includes(cefrLevel)) {
      return NextResponse.json({ error: 'Invalid CEFR level' }, { status: 400 });
    }
    if (typeof setNumber !== 'number' || setNumber < 1 || setNumber > 100) {
      return NextResponse.json({ error: 'Set number must be 1–100' }, { status: 400 });
    }

    const examSetId = await ensureExamSet(cefrLevel, setNumber);

    await db.insert(userExamSetSnapshots).values({
      userId: session.id,
      cefrLevel,
      setNumber,
      examSetId,
    }).onConflictDoNothing();

    let [template] = await db.select()
      .from(examTemplates)
      .where(eq(examTemplates.cefrLevel, `${cefrLevel}_SET_${setNumber}`))
      .limit(1);

    if (!template) {
      const [examSet] = await db.select().from(examSets).where(eq(examSets.id, examSetId));
      if (!examSet) return NextResponse.json({ error: 'Exam set not found' }, { status: 500 });

      const structure = EXAM_STRUCTURE[cefrLevel] || EXAM_STRUCTURE['A1'];

      [template] = await db.insert(examTemplates).values({
        title: `${cefrLevel} – Set ${setNumber}`,
        cefrLevel: `${cefrLevel}_SET_${setNumber}`,
      }).returning();

      const sections = [
        { section: 'LESEN', time: structure.lesenTime, marks: structure.lesenMarks, content: { passages: examSet.lesenSection?.passages || [] }, sort: 0 },
        { section: 'HOEREN', time: structure.hoerenTime, marks: structure.hoerenMarks, content: { dialogues: examSet.hoerenSection?.dialogues || [] }, sort: 1 },
        { section: 'SCHREIBEN', time: structure.schreibenTime, marks: structure.schreibenMarks, content: { prompts: examSet.schreibenSection?.prompts || [] }, sort: 2 },
        { section: 'SPRECHEN', time: structure.sprechenTime, marks: structure.sprechenMarks, content: { tasks: examSet.sprechenSection?.tasks || [] }, sort: 3 },
      ];

      for (const sec of sections) {
        await db.insert(examTemplateSections).values({
          templateId: template.id,
          section: sec.section,
          timeMinutes: sec.time,
          instructions: `${cefrLevel} ${sec.section} – Set ${setNumber}`,
          content: sec.content,
          maxScore: sec.marks,
          sortOrder: sec.sort,
        });
      }
    }

    const [attempt] = await db.insert(examAttempts).values({
      userId: session.id,
      templateId: template.id,
      cefrLevel,
      setNumber,
      status: 'in_progress',
    }).returning();

    const templateSections = await db.select().from(examTemplateSections)
      .where(eq(examTemplateSections.templateId, template.id));

    for (const sec of templateSections) {
      await db.insert(examSectionScores).values({
        attemptId: attempt.id,
        section: sec.section,
        maxScore: sec.maxScore,
      });
    }

    return NextResponse.json({ attemptId: attempt.id });
  } catch (error) {
    console.error('Exam set start error:', error);
    const msg = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
