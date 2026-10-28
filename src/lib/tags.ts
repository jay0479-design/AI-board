// Tag color tokens — 1:1 with Figma variables "Color/Tag/*"
export type TagColor = { bg: string; text: string; border?: string };

export const AI_TAGS: Record<string, TagColor> = {
  'Claude': { bg: '#f5e6dc', text: '#b3542e' },
  'Claude Code': { bg: '#f8dcc8', text: '#9a4320' },
  'ChatGPT': { bg: '#d9f2e6', text: '#0d8a6c' },
  'Gemini': { bg: '#dfeafb', text: '#1a66d0' },
  'Gemini Gems': { bg: '#dfeafb', text: '#1a66d0' },
  'NotebookLM': { bg: '#fff1cc', text: '#9a6b00' },
  'Perplexity': { bg: '#d0f0f4', text: '#0b6e80' },
  'Figma MCP': { bg: '#e8dff7', text: '#6c4fe0' },
  'Cursor': { bg: '#e0f2fe', text: '#0369a1' },
  'Midjourney': { bg: '#e4e4f0', text: '#43437e' },
  'Adobe Firefly': { bg: '#ffe4db', text: '#c7431a' },
  'Figma AI': { bg: '#fde4ec', text: '#b4255a' },
  'Kling AI': { bg: '#e9f5cf', text: '#4d7a12' },
  'Genspark': { bg: '#f4dcf7', text: '#8a1fa3' },
  'Grok': { bg: '#e4e7ec', text: '#2b3440' },
  'DeepSeek': { bg: '#ebead2', text: '#5f5c14' },
  'Manus': { bg: '#f5e6dc', text: '#b3542e' },
};

export const STATUS_TAGS: Record<string, TagColor> = {
  '진행중': { bg: '#fff4cc', text: '#8f6c00' },
  '리서치중': { bg: '#fff4cc', text: '#8f6c00' },
  '실무적용': { bg: '#dbeafe', text: '#1d4ed8' },
  '배포완료': { bg: '#dcfce7', text: '#15803d' },
};

export const DOC_TAGS: Record<string, TagColor> = {
  'Excel': { bg: '#e3f4e9', text: '#1d6f42' },
  'PowerPoint': { bg: '#fde8e0', text: '#c43e1c' },
  'Word': { bg: '#e1ecfb', text: '#185abd' },
  'PDF': { bg: '#fde2e2', text: '#b91c1c' },
  'Notion': { bg: '#efefef', text: '#1a1a24' },
  'GitHub': { bg: '#e6e8eb', text: '#24292f' },
  'HTML': { bg: '#fdfdfd', text: '#24292f' },
};

export const QUESTION_STATUS_TAGS: Record<string, TagColor> = {
  '🙋 답변 기다려요': { bg: '#fde8e0', text: '#c43e1c' },
  '💬 답변 진행 중': { bg: '#dbeafe', text: '#1d4ed8' },
  '✅ 해결됐어요': { bg: '#dcfce7', text: '#15803d' },
  '✅ 해결': { bg: '#dcfce7', text: '#15803d' },
};

const FALLBACK: TagColor = { bg: '#efefef', text: '#1a1a24' };

export type TagKind = 'ai' | 'status' | 'doc' | 'question' | 'other';

/** Resolve any tag label to its color. Handles "📎 Notion" doc tags and unknown labels. */
export function resolveTag(label: string): { color: TagColor; kind: TagKind } {
  const trimmed = label.trim();
  if (AI_TAGS[trimmed]) return { color: AI_TAGS[trimmed], kind: 'ai' };
  if (STATUS_TAGS[trimmed]) return { color: STATUS_TAGS[trimmed], kind: 'status' };
  if (QUESTION_STATUS_TAGS[trimmed]) return { color: QUESTION_STATUS_TAGS[trimmed], kind: 'question' };
  const doc = trimmed.replace(/^📎\s*/, '');
  if (DOC_TAGS[doc]) return { color: DOC_TAGS[doc], kind: 'doc' };
  const aiKey = Object.keys(AI_TAGS).find((k) => trimmed.toLowerCase().startsWith(k.toLowerCase()));
  if (aiKey) return { color: AI_TAGS[aiKey], kind: 'ai' };
  return { color: FALLBACK, kind: 'other' };
}
