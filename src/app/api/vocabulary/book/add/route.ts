import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userWords, wordBatches } from '@/lib/schema';
import { getCurrentUserId } from '@/lib/get-user';
import { BOOK_SECTIONS } from '@/lib/vocab-book';

function deduceLinguisticData(german: string) {
  let partOfSpeech = 'other';
  let gender = null;
  const lower = german.toLowerCase();

  if (lower.startsWith('der ')) {
    partOfSpeech = 'noun';
    gender = 'masculine';
  } else if (lower.startsWith('die ')) {
    partOfSpeech = 'noun';
    gender = 'feminine';
  } else if (lower.startsWith('das ')) {
    partOfSpeech = 'noun';
    gender = 'neuter';
  } else if (german.match(/^[A-ZÄÖÜ]/)) {
    // Nouns in German are capitalized
    partOfSpeech = 'noun';
  }

  return { partOfSpeech, gender };
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const body = await request.json();
    const { sectionId } = body;

    if (!sectionId || typeof sectionId !== 'string') {
      return NextResponse.json({ success: false, error: 'Valid sectionId is required' }, { status: 400 });
    }

    const section = BOOK_SECTIONS.find(s => s.id === sectionId);
    if (!section) {
      return NextResponse.json({ success: false, error: 'Section not found' }, { status: 404 });
    }

    // Check if the user already added this batch recently (optional, but good for UX)
    // We can rely on the frontend disabling the button, but we'll insert a batch anyway.
    const [batch] = await db.insert(wordBatches).values({
      userId,
      name: `Book: ${section.name}`,
      wordCount: section.words.length,
    }).returning();

    const insertRows = section.words.map((w) => {
      const { partOfSpeech, gender } = deduceLinguisticData(w.german);
      
      return {
        userId,
        word: w.german,
        partOfSpeech,
        gender,
        meaning: w.english,
        cefrLevel: 'A1', // Book sections are A1/A2, we can default to A1
        batchId: batch.id,
      };
    });

    const DB_INSERT_BATCH = 50;
    for (let i = 0; i < insertRows.length; i += DB_INSERT_BATCH) {
      await db.insert(userWords).values(insertRows.slice(i, i + DB_INSERT_BATCH));
    }

    return NextResponse.json({
      success: true,
      count: insertRows.length,
      batchId: batch.id,
      sectionId: section.id,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    console.error('Book section add error:', error);
    return NextResponse.json({ success: false, error: 'Failed to add section' }, { status: 500 });
  }
}
