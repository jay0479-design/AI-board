import type { Block, ProcessCard } from '../data/types';

/** 프로세스 카드를 복사하기 좋은 줄글(plain text)로 변환한다. */
export function cardToText(card: ProcessCard): string {
  const out: string[] = [];
  const push = (s?: string) => {
    if (s && s.trim()) out.push(s);
  };

  push(`# ${card.title}`);
  push(card.subtitle);
  const meta: string[] = [];
  if (card.metaChips?.length) meta.push(card.metaChips.join(' · '));
  if (card.statusTag) meta.push(`상태: ${card.statusTag}`);
  if (card.levelChip) meta.push(card.levelChip);
  if (meta.length) push(meta.join(' · '));
  const tags = [...card.aiTags, ...(card.docTags ?? [])];
  if (tags.length) push(`함께한 AI: ${tags.join(', ')}`);
  out.push('');

  for (const b of card.blocks) {
    out.push(...blockToLines(b));
    out.push('');
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function blockToLines(b: Block): string[] {
  const lines: string[] = [];
  switch (b.type) {
    case 'step': {
      lines.push(`[${b.badge}] ${b.name}${b.desc ? ` — ${b.desc}` : ''}`);
      if (b.promptLabel) lines.push(b.promptLabel);
      if (b.link?.label) lines.push(`${b.link.label}${b.link.url ? ` (${b.link.url})` : ''}`);
      lines.push(`${b.boxLabel ?? 'PROMPT'}:`);
      lines.push(...b.prompt.split('\n').map((l) => `  ${l}`));
      for (const img of b.images ?? []) {
        if (img.src) lines.push(`(이미지${img.label ? ` · ${img.label}` : ''})`);
      }
      break;
    }
    case 'section': {
      const head = [b.badge ? `[${b.badge}]` : '', b.name ?? '', b.desc ? `— ${b.desc}` : ''].filter(Boolean).join(' ');
      if (head) lines.push(head);
      for (const img of b.images ?? []) {
        if (img.src) lines.push(`(이미지${img.label ? ` · ${img.label}` : ''})`);
      }
      for (const box of b.boxes) {
        if (box.title) lines.push(box.title);
        lines.push(...box.text.split('\n').map((l) => `  ${l}`));
      }
      break;
    }
    case 'images': {
      for (const img of b.items) {
        if (img.src) lines.push(`(이미지${img.label ? ` · ${img.label}` : ''})`);
      }
      break;
    }
    case 'text':
      lines.push(b.text);
      break;
  }
  return lines;
}

/** 클립보드 복사 (HTTPS/localhost가 아니면 textarea 폴백) */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
