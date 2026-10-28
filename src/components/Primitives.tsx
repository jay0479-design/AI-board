import type { ReactNode } from 'react';
import { Badge, type BadgeTone } from './Tag';

/** Section header row: badge + bold name + gray description */
export function SectionHeader({ badge, tone, name, desc }: { badge?: string; tone?: BadgeTone; name?: ReactNode; desc?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      {badge && <Badge tone={tone}>{badge}</Badge>}
      {name && <span className="t-title text-text-primary">{name}</span>}
      {desc && <span className="t-body text-text-tertiary">{desc}</span>}
    </div>
  );
}

export type BoxTone = 'subtle' | 'green' | 'orange' | 'blue' | 'code';
const BOX_BG: Record<BoxTone, string> = {
  subtle: 'bg-surface-subtle',
  green: 'bg-accent-green-bg-soft',
  orange: 'bg-accent-orange-bg-soft',
  blue: 'bg-accent-blue-bg',
  code: 'bg-surface-code',
};
const BOX_TITLE: Record<BoxTone, string> = {
  subtle: 'text-text-secondary',
  green: 'text-accent-green-text',
  orange: 'text-accent-orange-text',
  blue: 'text-accent-blue-text',
  code: 'text-text-code-label',
};

/** Colored note box (결과 / 팁 / 실패 기록 / Note Box) */
export function NoteBox({ tone = 'subtle', title, children, className = '' }: { tone?: BoxTone; title?: ReactNode; children: ReactNode; className?: string }) {
  const isCode = tone === 'code';
  return (
    <div className={`flex w-full flex-col gap-2 rounded-[8px] p-4 ${BOX_BG[tone]} ${className}`}>
      {title && <p className={`t-body-md ${BOX_TITLE[tone]}`}>{title}</p>}
      <div className={`t-body pre-wrap ${isCode ? 'text-text-code' : 'text-text-secondary'}`}>{children}</div>
    </div>
  );
}

/** Dark PROMPT code box with optional link pill (Code Snippet Box) */
export function CodeBox({ label = 'PROMPT', link, children, className = '' }: { label?: string | null; link?: { label: string; url?: string } | null; children: ReactNode; className?: string }) {
  return (
    <div className={`flex w-full flex-col gap-3 rounded-[8px] bg-surface-code p-4 ${className}`}>
      {(label || link) && (
        <div className="flex items-center justify-between gap-2">
          <span className="t-body-md text-text-code-label">{label}</span>
          {link &&
            (link.url ? (
              <a href={link.url} target="_blank" rel="noreferrer" className="rounded-full bg-surface-card px-3 py-1 text-[14px] font-medium text-text-primary hover:bg-surface-subtle">
                {link.label}
              </a>
            ) : (
              <span className="rounded-full bg-surface-card px-3 py-1 text-[14px] font-medium text-text-primary">{link.label}</span>
            ))}
        </div>
      )}
      <div className="t-body pre-wrap text-text-code">{children}</div>
    </div>
  );
}

/** 16:9 image slot — gray placeholder when empty */
export function ImageSlot({ src, alt = '', label, ratio = '16/9', className = '', fit = 'cover' }: { src?: string; alt?: string; label?: ReactNode; ratio?: string; className?: string; fit?: 'cover' | 'contain' }) {
  return (
    <div className={`flex min-w-0 flex-1 flex-col gap-2 ${className}`}>
      {label && <p className="t-body-md text-text-secondary">{label}</p>}
      <div className="w-full overflow-hidden rounded-[20px] bg-surface-divider" style={{ aspectRatio: ratio }}>
        {src ? <img src={src} alt={alt} className={`size-full ${fit === 'cover' ? 'object-cover' : 'object-contain'}`} loading="lazy" /> : null}
      </div>
    </div>
  );
}

/** Black "설명" callout used on every page (bg black, radius 12, 20px bold white) */
export function Callout({ children, className = '', align = 'left' }: { children: ReactNode; className?: string; align?: 'left' | 'center' }) {
  return (
    <div className={`rounded-[12px] bg-black px-5 py-2.5 text-white ${align === 'center' ? 'text-center' : ''} ${className}`}>
      <div className="text-[16px] font-bold leading-[1.5] tracking-[-0.2px] sm:text-[20px]">{children}</div>
    </div>
  );
}

/** Divider */
export function Divider({ className = '' }: { className?: string }) {
  return <div className={`h-px w-full bg-surface-divider ${className}`} />;
}

/** Page hero header used above each board */
export function PageHeader({ eyebrow, title, subtitle, children }: { eyebrow?: ReactNode; title: ReactNode; subtitle?: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      {eyebrow && <p className="t-body-md text-accent-blue-text">{eyebrow}</p>}
      <h1 className="t-h1 text-text-primary">{title}</h1>
      {subtitle && <p className="t-body text-text-secondary pre-wrap">{subtitle}</p>}
      {children}
    </div>
  );
}
