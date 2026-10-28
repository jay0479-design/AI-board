import { useEffect, useRef, useState } from 'react';
import type { ProcessCard } from '../data/types';
import { cardToText, copyText } from '../lib/cardText';

/** 카드를 줄글로 보여주고 복사할 수 있는 팝업 */
export default function CardTextModal({ card, onClose }: { card: ProcessCard | null; onClose: () => void }) {
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle');
  const textRef = useRef<HTMLTextAreaElement>(null);
  const text = card ? cardToText(card) : '';

  useEffect(() => {
    if (!card) return;
    setCopied('idle');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [card, onClose]);

  if (!card) return null;

  const doCopy = async () => {
    const ok = await copyText(text);
    setCopied(ok ? 'ok' : 'fail');
    if (!ok) textRef.current?.select();
    setTimeout(() => setCopied('idle'), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-6" onClick={onClose} role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="card-text-title"
        className="flex max-h-[92vh] w-full max-w-[860px] flex-col overflow-hidden rounded-t-[20px] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.25)] sm:rounded-[20px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 border-b border-border-default px-5 py-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold tracking-[-0.1px] text-accent-blue-text">카드 줄글 보기 · {card.author}</p>
            <h2 id="card-text-title" className="t-h3 truncate">
              {card.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={doCopy}
            className={`shrink-0 rounded-[8px] px-4 py-2 text-[14px] font-semibold transition-colors ${
              copied === 'ok' ? 'bg-accent-green-bg text-accent-green-text' : copied === 'fail' ? 'bg-accent-orange-bg text-accent-orange-text' : 'bg-accent-navy text-white hover:opacity-90'
            }`}
          >
            {copied === 'ok' ? '✓ 복사됨' : copied === 'fail' ? '직접 선택해 복사하세요' : '📋 복사'}
          </button>
          <button type="button" onClick={onClose} aria-label="닫기" className="shrink-0 rounded-[8px] px-2 py-2 text-[18px] leading-none text-text-tertiary hover:bg-surface-subtle hover:text-text-primary">
            ✕
          </button>
        </div>
        <textarea
          ref={textRef}
          readOnly
          value={text}
          aria-label="카드 내용 텍스트"
          className="min-h-[40vh] flex-1 resize-none bg-surface-subtle px-5 py-4 font-sans text-[14px] leading-[1.7] tracking-[-0.14px] text-text-primary outline-none sm:px-6"
          onFocus={(e) => e.currentTarget.select()}
        />
        <div className="flex items-center justify-between gap-3 border-t border-border-default px-5 py-3 text-[12px] text-text-tertiary sm:px-6">
          <span>텍스트를 클릭하면 전체 선택됩니다 · Esc로 닫기</span>
          <span>{text.length.toLocaleString()}자</span>
        </div>
      </div>
    </div>
  );
}
