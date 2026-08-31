import { redirect } from 'next/navigation';
import { eq, like, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { wordBatches } from '@/lib/schema';
import { getCurrentUserId } from '@/lib/get-user';
import { BOOK_SECTIONS } from '@/lib/vocab-book';
import { PageHeader } from '@/components/ui/page-header';
import BookGrid from './book-grid';

export const metadata = {
  title: 'Vocabulary Book - Moin Moin',
  description: 'Browse and add curated A1/A2 vocabulary sections',
};

export default async function VocabularyBookPage() {
  let userId: string;
  try {
    userId = await getCurrentUserId();
  } catch (e) {
    redirect('/login');
  }

  // Get all book batches this user has added
  const userBatches = await db
    .select({ name: wordBatches.name })
    .from(wordBatches)
    .where(
      and(
        eq(wordBatches.userId, userId),
        like(wordBatches.name, 'Book: %')
      )
    );

  const addedSectionNames = new Set(userBatches.map((b) => b.name.replace('Book: ', '')));

  // Create a serializable array of sections with added status
  const sectionsWithStatus = BOOK_SECTIONS.map((section) => ({
    id: section.id,
    number: section.number,
    name: section.name,
    wordCount: section.words.length,
    wordsPreview: section.words.slice(0, 5).map(w => w.german),
    isAdded: addedSectionNames.has(section.name),
  }));

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <PageHeader
        title="Vocabulary Book"
        subtitle="Browse 28 curated A1/A2 vocabulary sections and add them to your learning list."
      />
      
      <div className="mt-8">
        <BookGrid initialSections={sectionsWithStatus} />
      </div>
    </div>
  );
}
