import type { ReactNode } from 'react';

/**
 * 프롬프트 박스 (Figma: "프롬프트 (직접 채울 시간이 없을 경우 클로드 코드에 요청하세요.)")
 * bg black · radius 12 · Pretendard Light 16 · 기본색 #d8ff74 · 사용자가 채울 [ ] 부분은 #ffb3b4
 */
export type Seg = string | { t: string; tone: 'note' | 'fill' | 'white' | 'bold' };
export type PromptLine = Seg[];

const TONE: Record<string, string> = {
  note: 'text-accent-note',
  fill: 'text-accent-fill',
  white: 'text-white',
  bold: 'text-white font-bold',
};

export function PromptText({ lines, tone = 'note' }: { lines: PromptLine[]; tone?: 'note' | 'white' }) {
  return (
    <div className={`text-[14px] font-light leading-[1.5] tracking-[-0.16px] sm:text-[16px] ${TONE[tone]} pre-wrap`}>
      {lines.map((line, i) => (
        <p key={i} className="m-0 min-h-[1.5em]">
          {line.length === 0
            ? '​'
            : line.map((seg, j) =>
                typeof seg === 'string' ? <span key={j}>{seg}</span> : <span key={j} className={TONE[seg.tone]}>{seg.t}</span>,
              )}
        </p>
      ))}
    </div>
  );
}

export function PromptPanel({ title, lines, children, className = '' }: { title?: ReactNode; lines?: PromptLine[]; children?: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[12px] bg-black px-5 py-4 sm:px-6 sm:py-5 ${className}`}>
      {title && <p className="mb-3 text-[13px] font-semibold tracking-[-0.1px] text-white/60">{title}</p>}
      {lines && <PromptText lines={lines} />}
      {children}
    </div>
  );
}

/** "[ ]" 채우기 표기 helper */
export const fill = (t: string): Seg => ({ t, tone: 'fill' });
