import type { ProcessCard, ProcessSection } from '../types';

/* All card JSON files extracted from Figma page "📍 1. AI 프로세스 공유" */
const cardModules = import.meta.glob<{ default: ProcessCard }>('./*-*.json', { eager: true });
const indexModules = import.meta.glob<{ default: unknown }>('./index.*.json', { eager: true });

const cardsByFile: Record<string, ProcessCard> = {};
for (const [path, mod] of Object.entries(cardModules)) {
  cardsByFile[path.replace('./', '')] = mod.default;
}

type IndexShape = string[] | { sectionTitle?: string; files?: string[]; groups?: { label: string; files: string[] }[] };

function indexFor(author: string): IndexShape | undefined {
  const entry = Object.entries(indexModules).find(([p]) => p.endsWith(`index.${author}.json`));
  return entry?.[1].default as IndexShape | undefined;
}

/** Section order and titles exactly as the Figma sections (top → bottom). */
const SECTION_ORDER: { author: string; fallbackTitle: string }[] = [
  { author: '정현영', fallbackTitle: '정현영' },
  { author: '이주희', fallbackTitle: '이주희' },
  { author: '이미애', fallbackTitle: '이미애___작업중입니다 🚀🚀' },
  { author: '하소진', fallbackTitle: '하소진 - 작업중🚧' },
];

function pick(files: string[]): ProcessCard[] {
  return files.map((f) => cardsByFile[f]).filter(Boolean);
}

export const processSections: ProcessSection[] = SECTION_ORDER.map(({ author, fallbackTitle }) => {
  const idx = indexFor(author);
  if (!idx) {
    // index missing → fall back to every card of this author sorted by order
    const cards = Object.values(cardsByFile)
      .filter((c) => c.author === author)
      .sort((a, b) => a.order - b.order);
    return { author, sectionTitle: fallbackTitle, groups: [{ cards }] };
  }
  if (Array.isArray(idx)) return { author, sectionTitle: fallbackTitle, groups: [{ cards: pick(idx) }] };
  if (idx.groups) return { author, sectionTitle: idx.sectionTitle ?? fallbackTitle, groups: idx.groups.map((g) => ({ label: g.label, cards: pick(g.files) })) };
  return { author, sectionTitle: idx.sectionTitle ?? fallbackTitle, groups: [{ cards: pick(idx.files ?? []) }] };
});

export const processCardCount = processSections.reduce((n, s) => n + s.groups.reduce((m, g) => m + g.cards.length, 0), 0);
