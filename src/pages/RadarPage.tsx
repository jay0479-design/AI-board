import { useState } from 'react';
import { radarTables } from '../data/radar';
import type { RadarCell } from '../data/types';
import { AnyTag } from '../components/Tag';
import { PageHeader } from '../components/Primitives';

/* Figma: 페이지 "📍 5. 프로젝트별 AI 스택 레이더" — 작성자별 표 4개 (4:2, 508:5, 520:127, 618:2301)
 * Table: header bg #f2f2f7 · header text #40424f SemiBold 14 · row border-b #ededf2 · cell padding 16/14
 * column widths 90 / 80 / 130 / 250 / 160 / flex */

const COL_CLASS = ['w-[90px] text-center', 'w-[80px] text-center', 'w-[130px] text-center', 'w-[250px]', 'w-[160px]', 'min-w-[240px]'];

function Cell({ cell, colIndex }: { cell: RadarCell; colIndex: number }) {
  const isMeta = colIndex <= 2;
  return (
    <td className={`px-4 py-3.5 align-middle ${COL_CLASS[colIndex] ?? ''}`}>
      {cell.text && (
        <span className={`t-body whitespace-nowrap ${isMeta ? 'font-medium text-[#262633]' : 'text-text-secondary'}`}>
          {cell.link ? (
            <a href={cell.link} target="_blank" rel="noreferrer" className="underline underline-offset-2">
              {cell.text}
            </a>
          ) : (
            cell.text
          )}
        </span>
      )}
      {cell.tags && cell.tags.length > 0 && (
        <span className="flex flex-wrap gap-2">
          {cell.tags.map((t, i) => (
            <AnyTag key={i} label={t.label} kind={t.kind} />
          ))}
        </span>
      )}
    </td>
  );
}

export default function RadarPage() {
  const [active, setActive] = useState(0);
  const table = radarTables[active];

  return (
    <div className="container-page flex flex-col gap-6 py-8 sm:py-10 lg:py-12">
      <PageHeader eyebrow="RADAR" title={table?.title ?? '프로젝트별 AI 스택 레이더'} subtitle={table?.subtitle} />

      {/* 작성자 탭 (Figma에는 가로로 나란히 배치된 4개 표 → 웹에서는 탭으로 전환) */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="작성자">
        {radarTables.map((t, i) => (
          <button
            key={t.author}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`rounded-full px-4 py-1.5 text-[14px] font-medium tracking-[-0.14px] transition-colors ${
              i === active ? 'bg-accent-navy text-white' : 'bg-white text-text-secondary ring-1 ring-border-default hover:bg-surface-subtle'
            }`}
          >
            {t.author}
            <span className="ml-1.5 text-[12px] opacity-70">{t.rows.length}</span>
          </button>
        ))}
      </div>

      {table && (
        <section className="card flex flex-col rounded-[16px] p-4 sm:p-8 lg:p-12 lg:pt-10" aria-label={`${table.author} AI 스택 레이더`} data-node-id={table.nodeId}>
          <div className="-mx-4 overflow-x-auto sm:mx-0">
            <table className="w-full min-w-[1100px] border-collapse">
              <thead>
                <tr className="bg-[#f2f2f7]">
                  {table.columns.map((c, i) => (
                    <th key={c} className={`px-4 py-3.5 text-center t-title text-[#40424f] whitespace-nowrap ${COL_CLASS[i]?.replace('text-center', '') ?? ''}`}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, r) => (
                  <tr key={r} className="border-b border-[#ededf2] bg-white">
                    {row.cells.map((cell, c) => (
                      <Cell key={c} cell={cell} colIndex={c} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* 표 하단 "2026 <이름>" 태그(설명 440:914 등)는 요청으로 표시하지 않음 */}
        </section>
      )}
    </div>
  );
}
