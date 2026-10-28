import { Callout, CodeBox, PageHeader } from '../components/Primitives';
import { asset } from '../lib/asset';
import { fill, type PromptLine } from '../components/PromptPanel';
import { AuthorSection, GuideSection, PromptToggle } from '../components/Sections';
import { AiTag, StatusTag } from '../components/Tag';

/* Figma: 페이지 "📍 2. AI 인사이트 리서치"
 *  - 섹션 "가이드를 복사해서 사용하세요": 템플릿 보드(195:829) + 설명(195:773) + 프롬프트(317:583)
 *  - 트렌드 분석 프롬프트 (399:293)
 *  - 섹션 "정현영": 인사이트 모음(195:1285) */

function ResearchCard({ author, date, avatar, topic, body, links }: { author: string; date: string; avatar: string; topic: string; body: React.ReactNode; links: { label: string; url?: string }[] }) {
  return (
    <div className="flex w-full flex-col gap-3 rounded-[16px] border border-border-default bg-surface-card px-5 py-4">
      <div className="flex items-center gap-2">
        <img src={avatar} alt="" className="size-6 rounded-full" />
        <span className="t-body-md flex-1 text-text-primary">{author}</span>
        <span className="t-body text-text-tertiary">{date}</span>
      </div>
      <p className="t-title">{topic}</p>
      <div className="t-body pre-wrap text-text-secondary">{body}</div>
      <div className="flex flex-col gap-0.5 rounded-[6px] bg-surface-subtle p-3 t-body text-accent-blue-text">
        {links.map((l) => (
          <p key={l.label}>
            🔗{' '}
            {l.url ? (
              <a href={l.url} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:opacity-80">
                {l.label}
              </a>
            ) : (
              l.label
            )}
          </p>
        ))}
      </div>
    </div>
  );
}

function InsightSnapCard({ title, date, oneLiner, media }: { title: string; date: string; oneLiner: string; media?: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-3 rounded-[16px] border border-border-default bg-surface-card px-5 py-4">
      <div className="flex items-center gap-2 t-body">
        <span className="t-title flex-1">{title}</span>
        <span className="text-text-tertiary">{date}</span>
      </div>
      <div className="w-full overflow-hidden rounded-[20px] bg-surface-divider" style={{ aspectRatio: '685/385' }}>
        {media}
      </div>
      <p className="t-body text-text-secondary">{oneLiner}</p>
    </div>
  );
}

function CaseEntry({ owner, text }: { owner: string; text: string }) {
  return (
    <div className="flex w-full items-center gap-3 rounded-[12px] border border-border-default bg-surface-card px-5 py-4 t-body">
      <span className="font-medium text-accent-blue-text">{owner}</span>
      <span className="flex-1 text-text-secondary">{text}</span>
    </div>
  );
}

function MdTemplateCard({ title, desc, code }: { title: string; desc: string; code: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-3 rounded-[16px] border border-border-default bg-surface-card p-5 shadow-[var(--shadow-card-sm)]">
      <p className="t-h3">{title}</p>
      <p className="t-body text-text-secondary">{desc}</p>
      <CodeBox label={null} className="gap-0 px-4 py-3">
        {code}
      </CodeBox>
    </div>
  );
}

/* Board shell: Bi-weekly AI Insights Board (877 wide · px 56 · pt 48 · pb 56 · gap 40 · radius 16) */
function Board({ children }: { children: React.ReactNode }) {
  return <div className="flex w-full flex-col gap-10 rounded-[16px] bg-white px-5 pb-10 pt-8 sm:px-10 lg:px-14 lg:pb-14 lg:pt-12">{children}</div>;
}

const PROMPT_FILL: PromptLine[] = [
  [fill('[복사한 보드 링크]')],
  [],
  ['위 피그마 프레임은 내가 복사한 AI 인사이트 보드야. Figma MCP로 아래 내용을 각 칸에 채워줘.'],
  [],
  ['이름: ', fill('[내 이름] '), '  날짜: 오늘'],
  ['리서치 주제: ', fill('[예: Figma MCP로 시안 뽑아본 결과]')],
  ['발견한 것: ', fill('[자유롭게 3~5문장. 무엇을 써봤고, 뭐가 좋았고, 뭐가 아쉬웠는지]')],
  ['참고 링크: ', fill('[있으면]')],
  ['실전 적용: ', fill('[프로젝트명 + 어느 단계에서 어떻게 썼는지. 없으면 "없음"]')],
  ['쓴 프롬프트: ', fill('[있으면 그대로 붙이기]')],
  [],
  ['채우는 방식'],
  ['- 리서치 카드: 주제 한 줄, 핵심 인사이트 2~3줄, 링크'],
  ['- 신규 AI 사용 리서치: 제목 + 한 줄 소감. 이미지는 내가 직접 넣을 테니 비워둬'],
  ['- 실전 적용 사례: AI 태그·상태 태그를 내용에 맞게 고르고, 담당자·프로젝트 한 줄·사용 가이드·프롬프트 채우기. "없음"이면 이 블록은 건드리지 마'],
  [],
  ['규칙'],
  ['- 링크로 준 프레임만 수정하고, 가이드 템플릿과 다른 사람 카드는 건드리지 마'],
  ['- 내가 적지 않은 내용은 지어내지 마'],
  ['- 끝나면 채운 문구를 텍스트로도 보여줘'],
];

const PROMPT_TREND: PromptLine[] = [
  [fill('[2026년 9월 30일]'), ' 현재를 기준으로, UX/UI 디자이너가 실무에서 활용할 가치가 높은 최신 AI 트렌드를 조사하고 분석해줘.'],
  [],
  ['단순히 유명한 AI 서비스나 기능을 나열하지 말고, 실제 UX/UI 디자인 업무 방식이 어떻게 변화하고 있는지를 중심으로 조사해줘.'],
  [],
  ['특히 다음 영역을 중점적으로 분석해줘.'],
  [],
  ['1. UX/UI 디자인 프로세스에서 AI가 가장 빠르게 도입되고 있는 영역'],
  ['   - UX 리서치'],
  ['   - 사용자 데이터 분석'],
  ['   - 아이디어 발산 및 컨셉 설계'],
  ['   - 와이어프레임'],
  ['   - UI 디자인'],
  ['   - 디자인 시스템'],
  ['   - 프로토타이핑'],
  ['   - 사용자 테스트'],
  ['   - 디자인 QA'],
  ['   - 개발 핸드오프'],
  [],
  ['2. 최근 주목받고 있는 AI 기반 디자인 워크플로우'],
  ['   - Figma AI 및 Figma 관련 AI 기능'],
  ['   - Claude / Claude Code'],
  ['   - ChatGPT'],
  ['   - Cursor 및 AI 코딩 도구'],
  ['   - MCP(Model Context Protocol)'],
  ['   - Vibe Coding / Vibe Design'],
  ['   - 디자인 → 코드 자동화'],
  ['   - 생성형 UI'],
  ['   - AI Agent 기반 디자인 자동화'],
  ['   - 멀티모달 AI를 활용한 디자인 작업'],
  [],
  ['3. 기존 UX/UI 디자이너의 업무 방식과 비교했을 때'],
  ['   - AI가 대체하거나 자동화하고 있는 작업'],
  ['   - AI 덕분에 중요도가 높아지고 있는 디자이너 역량'],
  ['   - 앞으로 디자이너가 직접 해야 할 판단 영역'],
  ['   - 디자이너와 개발자의 역할 경계가 어떻게 변화하고 있는지'],
  [],
  ['4. 현재 실무에서 실제로 활용도가 높은 사례를 조사해줘.'],
  ['단순한 실험이나 데모가 아니라, 실제 제품 디자인 및 디자인 조직에서 활용할 수 있는 수준인지 구분해서 설명해줘.'],
  [],
  ['5. 각 트렌드마다 아래 기준으로 평가해줘.'],
  ['   - 현재 실무 활용도'],
  ['   - UX/UI 디자이너에게 미치는 영향'],
  ['   - 학습 우선순위'],
  ['   - 도입 난이도'],
  ['   - 향후 1~2년 내 중요도'],
  ['   - 실제 업무에서 활용할 수 있는 구체적인 예시'],
  [],
  ['6. 특히 “지금 UX/UI 디자이너가 배워두면 가장 효과적인 AI 활용 방식”을 도출해줘.'],
  [],
  ['예를 들어 단순 이미지 생성보다는'],
  [],
  ['Figma + AI,'],
  ['Figma + MCP,'],
  ['Claude Code + Figma,'],
  ['AI 기반 프로토타이핑,'],
  ['디자인 시스템 자동화,'],
  ['디자인 → 코드 변환,'],
  ['AI Agent 기반 디자인 QA'],
  [],
  ['처럼 실제 디자인 생산성을 크게 높일 수 있는 워크플로우를 우선적으로 조사해줘.'],
  [],
  ['조사 결과는 다음 구조로 정리해줘.'],
  [],
  ['① 현재 UX/UI 분야 AI 트렌드 핵심 요약  '],
  ['② 가장 중요한 AI 트렌드 TOP 5~10  '],
  ['③ 각 트렌드가 실제 디자인 업무에 미치는 변화  '],
  ['④ 현재 바로 적용 가능한 AI 도구 및 워크플로우  '],
  ['⑤ 기존 디자인 프로세스 → AI 기반 디자인 프로세스 비교  '],
  ['⑥ UX/UI 디자이너가 지금부터 학습해야 할 AI 역량  '],
  ['⑦ 2027년까지 UX/UI 디자인 업무가 어떻게 변화할지 전망  '],
  ['⑧ 실무자가 바로 시도해볼 수 있는 AI 활용 실험 5~10개'],
  [],
  ['조사 시 최근 자료를 우선적으로 활용하고, 가능하면 2026년 자료를 중심으로 분석해줘.'],
  [],
  ['Figma, Anthropic, OpenAI, Google, Adobe 등 공식 발표나 공식 문서를 우선 참고하고, 디자인 업계 사례나 전문가 분석도 함께 비교해줘.'],
  [],
  ['과장된 AI 마케팅이나 단순한 미래 예측은 제외하고, 실제 UX/UI 디자이너의 생산성·디자인 품질·협업 방식에 영향을 줄 가능성이 높은 내용을 중심으로 판단해줘.'],
  [],
  ['최종 결과는 “10년 이상 경력의 UX/UI 디자이너가 앞으로 어떤 AI 역량을 확보해야 경쟁력을 유지할 수 있는가?”라는 관점에서 실무적으로 분석해줘.'],
];

export default function InsightsPage() {
  return (
    <div className="container-page flex flex-col gap-10 py-8 sm:py-10 lg:gap-14 lg:py-12">
      <PageHeader eyebrow="PAGE 2" title="AI 인사이트 리서치" subtitle="새로 본 AI 소식과 스킬을 이미지 1장 + 한 줄로. 주기별 섹션으로 나눠요. 실 사용에 유용할수록 좋아요." />

      {/* ───────── 가이드 섹션 ───────── */}
      <GuideSection title="가이드" desc="설명과 프롬프트 (빈 템플릿 보드는 제외)">
        {/* 설명 (195:773) + 프롬프트 토글 (317:583) + 트렌드 분석 프롬프트 (399:293) */}
        <div className="flex flex-col gap-4">
          <Callout>내가 찾은 최신 인사이트를 공유해요. 실무 사용에 적합하면 하단 카드에 추가합니다.</Callout>
          <PromptToggle title="프롬프트 (직접 채울 시간이 없을 경우 클로드 코드에 요청하세요.)" lines={PROMPT_FILL} />
          <PromptToggle
            title={
              <>
                트렌드 분석 프롬프트 <span className="font-normal text-white/60">(뉴스레터 같은 원리)</span>
              </>
            }
            lines={PROMPT_TREND}
          />
        </div>
      </GuideSection>

      {/* ───────── 정현영 섹션 (195:1285) ───────── */}
      <AuthorSection title="정현영">
        <div className="card max-w-[877px] overflow-hidden rounded-[16px] p-0">
          <Board>
            <div className="flex flex-col gap-5">
              <h2 className="t-h1 text-[#14141f]">AI 인사이트</h2>
              <ResearchCard
                author="정현영"
                date="2026.09.02"
                avatar={asset('assets/insights/avatar-jhy.svg')}
                topic="클로드 스킬을 공유드립니다."
                body="Claude의 AI스러운 UX를 자연스럽게 변형해주는 스킬"
                links={[
                  { label: '깃 허브 링크 바로가기', url: 'https://discuss.pytorch.kr/t/im-not-ai-ai-claude-code/10666#p-20398-github-im-not-ai-github-7' },
                  { label: '노션 링크 바로가기', url: 'https://app.notion.com/p/3cae60cf04cc806088ddf319bdf7195b' },
                  { label: '원본 자료 링크 바로가기', url: 'https://discuss.pytorch.kr/t/im-not-ai-ai-claude-code/10666#p-20398-github-im-not-ai-github-7' },
                ]}
              />
            </div>

            <div className="flex flex-col gap-5">
              <h3 className="t-h2">신규 AI 사용 리서치</h3>
              <div className="rounded-[12px] bg-surface-group p-4 sm:p-5">
                <InsightSnapCard
                  title="인사이트 제목"
                  date="2026.09.02"
                  oneLiner="평소 AI가 쓴 것같은 번역투를 스킬 하나로 자연스럽게 수정할 수 있어서 실무에 잘 사용할 수 있었습니다."
                  media={
                    <div className="flex size-full items-center justify-between gap-3 p-[3.5%]">
                      <div className="flex h-full w-[51.6%] flex-col items-center gap-[3%] bg-white">
                        <img src={asset('assets/insights/im-not-ai-1.png')} alt="im-not-ai 스킬 소개" className="w-full object-cover" style={{ aspectRatio: '984/570' }} />
                        <img src={asset('assets/insights/im-not-ai-2.png')} alt="" className="w-[76%] object-cover object-left" style={{ aspectRatio: '251/49' }} />
                        <img src={asset('assets/insights/im-not-ai-3.png')} alt="" className="w-[76%] object-cover object-top" style={{ aspectRatio: '251/84' }} />
                      </div>
                      <div className="h-full w-[46%] overflow-hidden">
                        <img src={asset('assets/insights/im-not-ai-4.png')} alt="클로드 스킬 공유 노션 페이지" className="size-full object-cover object-left-top" />
                      </div>
                    </div>
                  }
                />
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <h3 className="t-h2">실전 적용 사례 _ AI별 아카이브</h3>
              <div className="flex flex-col gap-4 rounded-[10px] border border-border-soft bg-white px-4 py-5">
                <div className="flex flex-wrap gap-4">
                  <AiTag label="Claude" />
                  <StatusTag label="실무적용" />
                </div>
                <CaseEntry owner="정현영" text="BIBX 리뉴얼 프로젝트 장표 시안 글 작성" />
                <MdTemplateCard
                  title="사용 가이드"
                  desc="작업중인 클로드 코드에 한번 등록해놓으면 자연어로 명령해도 모두 적용이 됩니다."
                  code={'[피그마 링크(node-id 포함)]\n해당 가이드를 분석하여 전문 BX 디자이너 관점으로 장표 내용을 보충 작성합니다.\n/im_not_ai 스킬을 사용하여 윤문을 다듬어주세요.'}
                />
              </div>
            </div>
          </Board>
        </div>
      </AuthorSection>
    </div>
  );
}
