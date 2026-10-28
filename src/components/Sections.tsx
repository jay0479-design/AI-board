import type { ReactNode } from 'react';
import { PromptText, type PromptLine } from './PromptPanel';

/** 가이드 섹션 — 작성자가 없는 안내·프롬프트 묶음. 기본 접힘, 제목 줄을 누르면 펼쳐진다. */
export function GuideSection({ title = '가이드', desc, children, id, defaultOpen = false }: { title?: string; desc?: ReactNode; children: ReactNode; id?: string; defaultOpen?: boolean }) {
  return (
    <details
      id={id}
      open={defaultOpen}
      className="group/guide scroll-mt-32 rounded-[20px] border border-dashed border-[#b9c3e6] bg-white/60"
    >
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 p-4 sm:px-6 sm:py-5 lg:px-8 [&::-webkit-details-marker]:hidden">
        <span className="rounded-full bg-accent-blue-bg px-3 py-1 text-[13px] font-semibold tracking-[-0.1px] text-accent-blue-text">GUIDE</span>
        <span className="t-h2">{title}</span>
        {desc && <span className="t-body text-text-tertiary">{desc}</span>}
        <span className="ml-auto inline-flex items-center gap-1.5 text-[13px] font-medium text-text-secondary">
          <span className="group-open/guide:hidden">펼치기</span>
          <span className="hidden group-open/guide:inline">접기</span>
          <span className="inline-flex size-6 items-center justify-center rounded-full bg-accent-blue-bg text-[11px] text-accent-blue-text transition-transform group-open/guide:rotate-90" aria-hidden>
            ▶
          </span>
        </span>
      </summary>
      <div className="flex flex-col gap-5 border-t border-dashed border-[#b9c3e6] p-4 sm:p-6 lg:p-8">{children}</div>
    </details>
  );
}

/** 작성자 섹션 — Figma의 이름 섹션(정현영 · 이주희 …)과 1:1 */
export function AuthorSection({ title, count, children, id }: { title: string; count?: number; children: ReactNode; id?: string }) {
  return (
    <section id={id} aria-label={title} className="flex scroll-mt-32 flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-accent-navy px-3 py-1 text-[13px] font-semibold tracking-[-0.1px] text-white">작성자</span>
        <h2 className="t-h1">{title}</h2>
        {typeof count === 'number' && <span className="t-body text-text-tertiary">{count}장</span>}
      </div>
      {children}
    </section>
  );
}

/** 복사용 프롬프트 토글 — 기본 접힘, 펼치면 검정 프롬프트 박스 */
export function PromptToggle({ title, lines, children, defaultOpen = false }: { title: ReactNode; lines?: PromptLine[]; children?: ReactNode; defaultOpen?: boolean }) {
  return (
    <details className="group w-full rounded-[12px] bg-black text-white" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-3.5 sm:px-6 [&::-webkit-details-marker]:hidden">
        <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[12px] transition-transform group-open:rotate-90" aria-hidden>
          ▶
        </span>
        <span className="text-[15px] font-bold leading-[1.5] tracking-[-0.15px] sm:text-[16px]">{title}</span>
        <span className="ml-auto shrink-0 text-[13px] text-white/60 group-open:hidden">펼치기</span>
        <span className="ml-auto hidden shrink-0 text-[13px] text-white/60 group-open:inline">접기</span>
      </summary>
      <div className="border-t border-white/10 px-5 py-4 sm:px-6 sm:py-5">
        {lines && <PromptText lines={lines} />}
        {children}
      </div>
    </details>
  );
}
