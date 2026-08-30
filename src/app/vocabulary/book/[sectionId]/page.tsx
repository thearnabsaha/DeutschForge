import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, BookOpen, Volume2 } from 'lucide-react';
import { BOOK_SECTIONS } from '@/lib/vocab-book';
import { PageHeader } from '@/components/ui/page-header';
import { GlassCard } from '@/components/ui/glass-card';

export async function generateStaticParams() {
  return BOOK_SECTIONS.map((section) => ({
    sectionId: section.id,
  }));
}

export function generateMetadata({ params }: { params: { sectionId: string } }) {
  const section = BOOK_SECTIONS.find((s) => s.id === params.sectionId);
  if (!section) return { title: 'Section Not Found' };
  return {
    title: `${section.name} - Vocabulary Book`,
    description: `Words from chapter ${section.number}: ${section.name}`,
  };
}

export default function SectionDetailsPage({ params }: { params: { sectionId: string } }) {
  const section = BOOK_SECTIONS.find((s) => s.id === params.sectionId);

  if (!section) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link 
          href="/vocabulary/book" 
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Vocabulary Book
        </Link>
      </div>

      <PageHeader
        title={`Chapter ${section.number}: ${section.name}`}
        subtitle={`${section.words.length} words in this section`}
      />

      <div className="mt-8">
        <GlassCard className="overflow-hidden">
          <div className="divide-y divide-[var(--border)]">
            {section.words.map((wordObj, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 hover:bg-[var(--bg-tertiary)]/30 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-baseline gap-3">
                    <span className="text-lg font-bold text-[var(--text-primary)]">
                      {wordObj.german}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-[var(--text-secondary)]">
                    {wordObj.english}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
