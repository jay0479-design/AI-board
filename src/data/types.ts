export type BadgeTone = 'blue' | 'orange' | 'green';
export type BoxTone = 'subtle' | 'green' | 'orange' | 'blue' | 'code';

export type ImageItem = { label?: string; src: string; alt?: string; figmaUrl?: string };
export type Box = { tone: BoxTone; title?: string; text: string };

export type Block =
  | {
      type: 'step';
      badge: string;
      badgeTone: BadgeTone;
      name: string;
      desc?: string;
      promptLabel?: string;
      boxLabel?: string;
      link?: { label: string; url?: string };
      prompt: string;
      images?: ImageItem[];
    }
  | { type: 'images'; items: ImageItem[] }
  | { type: 'section'; badge?: string; badgeTone?: BadgeTone; name?: string; desc?: string; boxes: Box[]; images?: ImageItem[] }
  | { type: 'text'; text: string };

export type ProcessCard = {
  nodeId: string;
  author: string;
  group?: string;
  order: number;
  template: 'skill-prompt-guide' | 'ai-recipe-v2' | 'other';
  title: string;
  subtitle?: string;
  metaChips?: string[];
  statusTag?: string;
  levelChip?: string;
  aiTags: string[];
  docTags?: string[];
  blocks: Block[];
};

export type ProcessSection = {
  author: string;
  sectionTitle: string;
  groups: { label?: string; cards: ProcessCard[] }[];
};

export type RadarCell = { text?: string; tags?: { label: string; kind: 'ai' | 'status' | 'doc' | 'other' }[]; link?: string };
export type RadarTable = {
  nodeId: string;
  author: string;
  title: string;
  subtitle: string;
  columns: string[];
  rows: { cells: RadarCell[] }[];
  footnote?: string;
};
