import { useEffect, useState } from 'react';
import ProcessCard from '../components/ProcessCard';
import { Callout, PageHeader } from '../components/Primitives';
import { NumberBadge } from '../components/Tag';
import { fill, type PromptLine } from '../components/PromptPanel';
import { AuthorSection, GuideSection, PromptToggle } from '../components/Sections';
import { processSections, processCardCount } from '../data/process';

/* Figma: 페이지 "📍 1. AI 프로세스 공유"
 *  - 가이드 섹션: 설명(169:134) · 설명(195:733) · 프롬프트(317:587)  (빈 템플릿 56:19, callout 193:732는 요청으로 제외)
 *  - 작성자 섹션: 정현영 · 이주희 · 이미애___작업중입니다 🚀🚀 · 하소진 - 작업중🚧 (총 36장, 숨김 [구버전] 제외) */

const TILES = [
  { n: 1, title: '카드 복사', desc: '오른쪽 카드를 복제해서 내 이름 섹션에 두기 (⌥ + 드래그)' },
  { n: 2, title: '빈칸 채우기', desc: '예시 글은 지우고 제목은 결과부터 입력하면 좋습니다.' },
  { n: 3, title: '태그 고르기', desc: '함께한 AI 및 도구를 선택하세요.' },
  { n: 4, title: '스크린샷 드래그', desc: '필요 시 회색 칸에 이미지를 넣어주세요.' },
];

const PROMPT: PromptLine[] = [
  ['[복사한 카드 링크]'],
  [],
  ['위 피그마 카드는 내가 복사한 프로세스 가이드 카드야. 지금 이 폴더에서 내가 한 작업을 돌아보고, Figma MCP로 카드를 채워줘.'],
  [],
  ['작업 이름: ', fill('[예: UBIST 종별 조정 팝업 디자인]')],
  ['사용한 AI: ', fill('[예: Claude Code, Figma MCP, Gemini]')],
  [],
  ['먼저 할 것'],
  ['- 이 폴더의 CLAUDE.md, 우리 대화 기록, 만든 파일을 훑어보고 내가 어떤 순서로 무엇을 했는지 ', fill('[2]'), '단계로 요약해줘'],
  ['- 각 단계에서 실제로 쓴 프롬프트를 찾아 대표 1개씩 골라줘. 길면 핵심만 5줄 안으로 줄여도 돼'],
  [],
  ['채우는 방식'],
  ['- 제목: 작업 이름'],
  ['- AI 태그: 내가 적은 도구로 바꿔줘. '],
  ['- STEP 1·2: 단계 이름은 내 작업에 맞게 바꾸고, 한 줄 설명 + 프롬프트'],
  ['- Before/After: 내가 직접 넣을 테니 비워둬. 비교 이미지가 없는 작업이면 꺼줘'],
  ['- TIP: 결과가 어땠는지 한 줄, 다음에 쓸 사람을 위한 팁 한 줄'],
  [],
  ['규칙'],
  ['- 링크로 준 카드만 수정하고, 가이드 원본과 다른 사람 카드는 건드리지 마'],
  ['- 기록에 없는 단계나 프롬프트를 지어내지 마. 못 찾으면 "확인 필요"라고 적어줘'],
  ['- 끝나면 채운 문구를 텍스트로도 보여줘'],
];

function slug(author: string) {
  return `author-${author}`;
}

export default function ProcessPage() {
  const [active, setActive] = useState('guide');

  // Scroll-spy: highlight the section currently in view
  useEffect(() => {
    const ids = ['guide', ...processSections.map((s) => slug(s.author))];
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-120px 0px -60% 0px', threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const pill = (id: string, label: string, count?: number) => (
    <a
      key={id}
      href={`#${id}`}
      className={`rounded-full px-3.5 py-1.5 text-[14px] font-medium tracking-[-0.14px] transition-colors ${
        active === id ? 'bg-accent-navy text-white' : 'bg-white text-text-secondary ring-1 ring-border-default hover:bg-surface-subtle'
      }`}
    >
      {label}
      {typeof count === 'number' && <span className="ml-1.5 text-[12px] opacity-70">{count}</span>}
    </a>
  );

  return (
    <div className="container-page flex flex-col gap-10 py-8 sm:py-10 lg:gap-14 lg:py-12">
      <PageHeader eyebrow="PAGE 1" title="AI 프로세스 공유" subtitle="내가 AI와 일한 순서를 카드 한 장으로. 이름별 섹션에 쌓아요." />

      {/* 섹션 내비게이션 (가이드 + 작성자) */}
      <div className="sticky top-14 z-30 -mx-4 border-b border-border-default bg-surface-page/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:top-16 lg:-mx-10 lg:px-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="t-title mr-2 text-text-secondary">
            섹션 <span className="text-text-tertiary">(카드 {processCardCount}장)</span>
          </span>
          {pill('guide', '가이드')}
          {processSections.map((s) => pill(slug(s.author), s.author, s.groups.reduce((n, g) => n + g.cards.length, 0)))}
        </div>
      </div>

      {/* ───────── 가이드 섹션 (우측 가이드를 복사해서 사용하세요) ───────── */}
      <GuideSection id="guide" title="가이드" desc="우측 가이드를 복사해서 사용하세요">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:items-start">
          {/* 좌: 설명 카드 (169:134) */}
          <div className="flex flex-col gap-5">
            <div className="card flex flex-col gap-5 p-5 sm:p-7">
              <div className="flex flex-col gap-2">
                <h3 className="t-h1">나의 AI 프로세스 카드 만들기</h3>
                <p className="t-body text-text-secondary">정답은 없어요. "내가 AI랑 이렇게 일했더니 됐다"를 레시피처럼 남기면 끝입니다.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {TILES.map((t) => (
                  <div key={t.n} className="flex flex-col gap-2 rounded-[8px] bg-surface-subtle p-4">
                    <NumberBadge n={t.n} />
                    <p className="t-title">{t.title}</p>
                    <p className="t-body pre-wrap text-text-secondary">{t.desc}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2.5 rounded-[8px] bg-surface-subtle px-4 py-3.5">
                <p className="t-body-md">✅ 이것만 지켜요</p>
                <div className="flex flex-wrap gap-2">
                  {['작업자 이름은 섹션으로', '프로세스 기록용으로 프롬프트는 간략하게 적어주세요', '실패한 시도도 좋아요'].map((r) => (
                    <span key={r} className="rounded-[6px] bg-white px-2.5 py-1 t-body-md text-accent-green-text">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 우: 설명 (195:733) + 프롬프트 토글 (317:587) */}
          <div className="flex flex-col gap-3 xl:sticky xl:top-32">
          <Callout>
            다음 가이드를 복사하여 AI에 연결 후 간략하게 프로세스 요약을 요청하세요.
            <br />
            <span className="font-normal">
              <span className="text-accent-fill">’[ ]’ </span>괄호는 직접 채우고 나온 결과물에서 미흡한 부분이나 누락된 프로세스는 직접 수정합니다.
              <br />
              이미지가 있다면 첨부하고 프롬프트에 추가하세요.
              <br />
              Manus, Codex, Claude Desktop 모두 피그마 MCP 연결이 가능합니다.
            </span>
          </Callout>
          <PromptToggle title="프롬프트 (직접 채울 시간이 없을 경우 클로드 코드에 요청하세요.)" lines={PROMPT} />
          </div>
        </div>
      </GuideSection>

      {/* ───────── 작성자 섹션 ───────── */}
      {processSections.map((section) => (
        <AuthorSection key={section.author} id={slug(section.author)} title={section.sectionTitle} count={section.groups.reduce((n, g) => n + g.cards.length, 0)}>
          {section.groups.map((g, gi) => (
            <div key={gi} className="flex flex-col gap-4">
              {g.label && <h3 className="t-h2 text-text-primary">{g.label}</h3>}
              <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
                {g.cards.map((card) => (
                  <ProcessCard key={card.nodeId} card={card} id={`card-${card.nodeId.replace(':', '-')}`} />
                ))}
              </div>
            </div>
          ))}
        </AuthorSection>
      ))}
    </div>
  );
}
