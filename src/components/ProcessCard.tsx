import type { Block, ImageItem, ProcessCard as ProcessCardData } from '../data/types';
import { AiTag, DocTag, MetaChip, StatusTag } from './Tag';
import { CodeBox, Divider, ImageSlot, NoteBox, SectionHeader } from './Primitives';

/* Renders both Figma card templates: "Skill & Prompt Guide Template" (53:4) and "[추가] AI 레시피 카드 v2" (161:210).
 * Card: 740px wide · padding 28 · gap 20 · radius 16 · border #e5e5ed · shadow 0 2 4 rgba(0,0,0,.06) */

function ImageRow({ items: all }: { items: ImageItem[] }) {
  // 빈 플레이스홀더(src 없음)는 표시하지 않고, 채워진 이미지만 보여준다.
  const items = all.filter((i) => !!i.src);
  if (!items.length) return null;
  // Figma rows hold 2 slots side by side (Before / After, 시도 B / C). Chunk by 2.
  const rows: ImageItem[][] = [];
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));
  return (
    <div className="flex w-full flex-col gap-4">
      {rows.map((row, i) => (
        <div key={i} className="flex w-full flex-col gap-4 sm:flex-row">
          {row.map((img, j) => (
            <ImageSlot key={j} src={img.src || undefined} alt={img.alt ?? img.label ?? ''} label={img.label} ratio="334/188" />
          ))}
          {row.length === 1 && <div className="hidden flex-1 sm:block" aria-hidden />}
        </div>
      ))}
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'step':
      return (
        <section className="flex w-full flex-col gap-3">
          <SectionHeader badge={block.badge} tone={block.badgeTone} name={block.name} desc={block.desc} />
          {block.promptLabel && <p className="t-body-md text-text-secondary">{block.promptLabel}</p>}
          <CodeBox label={block.boxLabel ?? 'PROMPT'} link={block.link}>
            {block.prompt}
          </CodeBox>
          {block.images && block.images.length > 0 && <ImageRow items={block.images} />}
        </section>
      );
    case 'images':
      return <ImageRow items={block.items} />;
    case 'section':
      return (
        <section className="flex w-full flex-col gap-3">
          {(block.badge || block.name || block.desc) && <SectionHeader badge={block.badge} tone={block.badgeTone} name={block.name} desc={block.desc} />}
          {block.images && block.images.length > 0 && <ImageRow items={block.images} />}
          {block.boxes.map((box, i) =>
            box.tone === 'code' ? (
              <CodeBox key={i} label={box.title ?? null}>
                {box.text}
              </CodeBox>
            ) : (
              <NoteBox key={i} tone={box.tone} title={box.title}>
                {box.text}
              </NoteBox>
            ),
          )}
        </section>
      );
    case 'text':
      return <p className="t-body pre-wrap text-text-secondary">{block.text}</p>;
    default:
      return null;
  }
}

export default function ProcessCard({ card, id, onOpen }: { card: ProcessCardData; id?: string; onOpen?: (card: ProcessCardData) => void }) {
  const hasMeta = (card.metaChips && card.metaChips.length > 0) || card.statusTag || card.levelChip;
  const isRecipe = card.template === 'ai-recipe-v2';
  const clickable = !!onOpen;
  const open = () => onOpen?.(card);
  return (
    <article
      id={id}
      className={`relative flex w-full flex-col gap-5 rounded-[16px] border border-border-default bg-surface-card p-5 shadow-[var(--shadow-card-sm)] sm:p-7 ${
        clickable ? 'cursor-pointer transition-shadow hover:border-[#b9c3e6] hover:shadow-[0_6px_20px_rgba(0,27,104,0.10)]' : ''
      }`}
      data-node-id={card.nodeId}
      onClick={
        clickable
          ? (e) => {
              // 링크 클릭은 팝업을 열지 않는다
              if ((e.target as HTMLElement).closest('a')) return;
              open();
            }
          : undefined
      }
      onKeyDown={clickable ? (e) => { if (e.key === 'Enter' && e.target === e.currentTarget) open(); } : undefined}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : undefined}
      aria-label={clickable ? `${card.title} 줄글로 보기 · 복사` : undefined}
    >
      {clickable && (
        <span className="absolute right-4 top-4 rounded-full bg-surface-subtle px-2.5 py-1 text-[12px] font-medium text-text-secondary sm:right-5 sm:top-5">📋 줄글 · 복사</span>
      )}
      <header className={`flex flex-col gap-3 ${clickable ? 'pr-24' : ''}`}>
        {hasMeta && (
          <div className="flex flex-wrap items-center gap-2">
            {card.metaChips?.map((c) => (
              <MetaChip key={c}>{c}</MetaChip>
            ))}
            {card.statusTag && <StatusTag label={card.statusTag} />}
            {card.levelChip && <MetaChip tone="green">{card.levelChip}</MetaChip>}
          </div>
        )}
        <h3 className="t-h2 pre-wrap">{card.title}</h3>
        {card.subtitle && <p className="t-body pre-wrap text-text-tertiary">{card.subtitle}</p>}
        <div className="flex flex-wrap items-center gap-2">
          {isRecipe && <span className="t-body-md text-text-secondary">🤖 함께한 AI</span>}
          {card.aiTags.map((t) => (
            <AiTag key={t} label={t} />
          ))}
          {card.docTags?.map((t) => (
            <DocTag key={t} label={t} />
          ))}
        </div>
      </header>
      <Divider />
      {card.blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </article>
  );
}
