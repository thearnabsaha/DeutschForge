'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckCircle2, Plus, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Section {
  id: string;
  number: number;
  name: string;
  wordCount: number;
  wordsPreview: string[];
  isAdded: boolean;
}

interface BookGridProps {
  initialSections: Section[];
}

export default function BookGrid({ initialSections }: BookGridProps) {
  const router = useRouter();
  const [sections, setSections] = useState(initialSections);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async (sectionId: string) => {
    setLoadingId(sectionId);
    setError(null);
    try {
      const res = await fetch('/api/vocabulary/book/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionId }),
      });
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to add section');
      }

      // Update state to reflect added
      setSections(sections.map(s => s.id === sectionId ? { ...s, isAdded: true } : s));
      
      // Refresh router so Next.js invalidates cache
      router.refresh();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoadingId(null);
    }
  };

  const addedCount = sections.filter(s => s.isAdded).length;
  const progress = Math.round((addedCount / sections.length) * 100) || 0;

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
          {error}
        </div>
      )}

      {/* Progress Bar */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[var(--accent)]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Book Progress</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                {addedCount} of {sections.length} sections added
              </p>
            </div>
          </div>
          <div className="text-3xl font-black text-[var(--accent)]">{progress}%</div>
        </div>
        <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-3 overflow-hidden border border-[var(--border)]">
          <div 
            className="bg-[var(--accent)] h-3 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </GlassCard>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => {
          const isExpanded = expandedId === section.id;
          const isLoading = loadingId === section.id;

          return (
            <GlassCard key={section.id} className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:border-[var(--accent)]/50">
              <div className="p-5 flex-grow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center justify-center font-bold text-[var(--text-primary)]">
                    {section.number}
                  </div>
                  {section.isAdded ? (
                    <Badge className="flex items-center gap-1 bg-green-500/20 text-green-400">
                      <CheckCircle2 className="w-3 h-3" />
                      Added
                    </Badge>
                  ) : (
                    <Badge>{section.wordCount} words</Badge>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">{section.name}</h3>
                
                <button 
                  onClick={() => setExpandedId(isExpanded ? null : section.id)}
                  className="text-xs text-[var(--accent)]/80 hover:text-[var(--accent)] flex items-center gap-1 mt-2 transition-colors"
                >
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  Preview words
                </button>
                
                {isExpanded && (
                  <div className="mt-3 text-sm text-[var(--text-secondary)] italic bg-[var(--bg-tertiary)]/50 p-3 rounded-lg border border-[var(--border)]">
                    {section.wordsPreview.join(', ')}...
                  </div>
                )}
              </div>
              
              <div className="p-4 pt-0 mt-auto">
                <button
                  onClick={() => handleAdd(section.id)}
                  disabled={section.isAdded || isLoading}
                  className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
                    section.isAdded 
                      ? 'bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20' 
                      : 'btn-primary'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Adding...
                    </>
                  ) : section.isAdded ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      In your sets
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Add to vocabulary
                    </>
                  )}
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
