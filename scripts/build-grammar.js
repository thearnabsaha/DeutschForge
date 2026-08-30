const fs = require('fs');
const path = require('path');

const srcDir = '/Users/thearnabsaha/.gemini/antigravity-ide/brain/9be77ce1-f405-425f-a7f6-b7fad787ad7f/scratch/deutschforge3/packages/mobile/lib';
const destDir = path.join(__dirname, '..', 'src', 'lib');

// 1. grammar-practice-data.ts
const practiceDataRaw = fs.readFileSync(path.join(srcDir, 'grammarPracticeData.ts'), 'utf8');
const practiceDataAppend = `\n
export const PRACTICE_MAP: Record<string, ChapterPractice> = Object.fromEntries(
  PRACTICE_DATA.map((p) => [p.chapterId, p])
);

export function getPracticeForChapter(chapterId: string): ChapterPractice | undefined {
  return PRACTICE_MAP[chapterId];
}
`;
fs.writeFileSync(path.join(destDir, 'grammar-practice-data.ts'), practiceDataRaw + practiceDataAppend, 'utf8');
console.log('Successfully wrote grammar-practice-data.ts');

// 2. grammar-data.ts
let grammarDataRaw = fs.readFileSync(path.join(srcDir, 'grammarData.ts'), 'utf8');

// Ensure GrammarChapter interface includes cefrLevel and color
grammarDataRaw = grammarDataRaw.replace(
  'aiPrompt: string;',
  'aiPrompt: string;\n  cefrLevel?: string;\n  color?: string;'
);

const grammarDataAppend = `\n
// ─── Enriched Exports & Mappings ─────────────────────────────────────────────

export const ALL_GRAMMAR_CHAPTERS: GrammarChapter[] = [
  ...A0_GRAMMAR_CHAPTERS.map((c) => ({ ...c, cefrLevel: 'A0', color: c.color || '#F59E0B', icon: c.icon || '🔤' })),
  ...GRAMMAR_CHAPTERS.map((c) => ({ ...c, cefrLevel: 'A1', color: c.color || '#A855F7', icon: c.icon || '📘' })),
  ...A2_GRAMMAR_CHAPTERS.map((c) => ({ ...c, cefrLevel: 'A2', color: c.color || '#1CB0F6', icon: c.icon || '📗' })),
  ...B1_GRAMMAR_CHAPTERS.map((c) => ({ ...c, cefrLevel: 'B1', color: c.color || '#22C55E', icon: c.icon || '📙' })),
];

export const GRAMMAR_TOPICS = ALL_GRAMMAR_CHAPTERS;

export const GRAMMAR_CHAPTERS_BY_LEVEL: Record<string, GrammarChapter[]> = {
  A0: ALL_GRAMMAR_CHAPTERS.filter((c) => c.cefrLevel === 'A0'),
  A1: ALL_GRAMMAR_CHAPTERS.filter((c) => c.cefrLevel === 'A1'),
  A2: ALL_GRAMMAR_CHAPTERS.filter((c) => c.cefrLevel === 'A2'),
  B1: ALL_GRAMMAR_CHAPTERS.filter((c) => c.cefrLevel === 'B1'),
};

export const GRAMMAR_TOPIC_MAP: Record<string, GrammarChapter> = Object.fromEntries(
  ALL_GRAMMAR_CHAPTERS.map((c) => [c.id, c])
);

// Backward-compatible aliases for legacy topic IDs
const legacyMap: Record<string, string> = {
  'g01-pronouns-present': 'ch01',
  'g02-articles-cases': 'ch02',
  'g03-nominative-accusative': 'ch10',
  'g04-dative-case': 'ch13',
  'g05-modal-verbs': 'ch17',
  'g06-separable-verbs': 'ch18',
  'g07-negation-nicht-kein': 'ch09',
  'g08-past-perfekt': 'ch22',
};

for (const [legacyId, mappedId] of Object.entries(legacyMap)) {
  if (GRAMMAR_TOPIC_MAP[mappedId]) {
    GRAMMAR_TOPIC_MAP[legacyId] = { ...GRAMMAR_TOPIC_MAP[mappedId], id: legacyId };
  }
}

export function getGrammarChapterById(id: string): GrammarChapter | undefined {
  return GRAMMAR_TOPIC_MAP[id] || ALL_GRAMMAR_CHAPTERS.find((c) => c.id === id);
}
`;

fs.writeFileSync(path.join(destDir, 'grammar-data.ts'), grammarDataRaw + grammarDataAppend, 'utf8');
console.log('Successfully wrote grammar-data.ts with updated interface');
