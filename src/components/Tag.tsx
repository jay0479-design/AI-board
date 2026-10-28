import type { ReactNode } from 'react';
import { resolveTag, STATUS_TAGS, QUESTION_STATUS_TAGS, type TagKind } from '../lib/tags';

type BaseProps = { label: string; className?: string };

/** Label / Tag · AI 툴 — 6px radius, 12/4 padding, Medium 14 */
export function AiTag({ label, className = '' }: BaseProps) {
  const { color } = resolveTag(label);
  return (
    <span
      className={`inline-flex items-center rounded-[6px] px-3 py-1 t-body-md whitespace-nowrap ${className}`}
      style={{ background: color.bg, color: color.text }}
    >
      {label}
    </span>
  );
}

/** Label / Tag · 첨부문서 — bordered */
export function DocTag({ label, className = '' }: BaseProps) {
  const { color } = resolveTag(label);
  const text = label.startsWith('📎') ? label : `📎 ${label}`;
  return (
    <span
      className={`inline-flex items-center rounded-[6px] border px-3 py-1 t-body-md whitespace-nowrap ${className}`}
      style={{ background: color.bg, color: color.text, borderColor: color.text }}
    >
      {text}
    </span>
  );
}

/** Label / Tag · 실행 상태 — pill with 8px dot */
export function StatusTag({ label, className = '' }: BaseProps) {
  const color = STATUS_TAGS[label] ?? STATUS_TAGS['진행중'];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 t-body-md whitespace-nowrap ${className}`}
      style={{ background: color.bg, color: color.text }}
    >
      <span className="size-2 rounded-full" style={{ background: color.text }} aria-hidden />
      {label}
    </span>
  );
}

/** Label / Tag · 질문 상태 — pill with dot */
export function QuestionStatusTag({ label, className = '' }: BaseProps) {
  const color = QUESTION_STATUS_TAGS[label] ?? QUESTION_STATUS_TAGS['🙋 답변 기다려요'];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 t-body-md whitespace-nowrap ${className}`}
      style={{ background: color.bg, color: color.text }}
    >
      <span className="size-2 rounded-full" style={{ background: color.text }} aria-hidden />
      {label}
    </span>
  );
}

/** Generic tag that picks the right visual by label (radar table cells, question topics). */
export function AnyTag({ label, kind }: { label: string; kind?: TagKind }) {
  const resolved = kind ?? resolveTag(label).kind;
  if (resolved === 'status') return <StatusTag label={label} />;
  if (resolved === 'question') return <QuestionStatusTag label={label} />;
  if (resolved === 'doc' || label.startsWith('📎')) return <DocTag label={label} />;
  return <AiTag label={label} />;
}

/** Small gray meta chip (👤 이름, 📅 날짜) */
export function MetaChip({ children, tone = 'subtle' }: { children: ReactNode; tone?: 'subtle' | 'white' | 'orange' | 'green' }) {
  const cls =
    tone === 'white'
      ? 'bg-surface-card text-text-secondary'
      : tone === 'orange'
        ? 'bg-accent-orange-bg text-accent-orange-text'
        : tone === 'green'
          ? 'bg-accent-green-bg text-accent-green-text'
          : 'bg-surface-subtle text-text-secondary';
  return <span className={`inline-flex items-center gap-2 rounded-[6px] px-3 py-1 t-body-md whitespace-nowrap ${cls}`}>{children}</span>;
}

export type BadgeTone = 'blue' | 'orange' | 'green';
/** Section step badge: STEP 1 / TIP / ASK ... */
export function Badge({ children, tone = 'blue' }: { children: ReactNode; tone?: BadgeTone }) {
  const cls =
    tone === 'orange'
      ? 'bg-accent-orange-bg text-accent-orange-text'
      : tone === 'green'
        ? 'bg-accent-green-bg text-accent-green-text'
        : 'bg-accent-blue-bg text-accent-blue-text';
  return <span className={`inline-flex items-center rounded-[4px] px-2 py-1 t-body-md whitespace-nowrap ${cls}`}>{children}</span>;
}

/** Navy number badge (28px circle) */
export function NumberBadge({ n }: { n: number | string }) {
  return (
    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-navy text-[14px] font-bold text-white">
      {n}
    </span>
  );
}
