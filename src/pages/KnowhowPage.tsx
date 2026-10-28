import { AiTag } from '../components/Tag';
import { AuthorSection } from '../components/Sections';

/* Figma: 페이지 "📍 3. 우리팀 실무 노하우" › The Showcase (62:16, 1280×908) */

function ProTipCard({ author, title, tags, recipeLabel, recipe, media }: { author: string; title: React.ReactNode; tags: string[]; recipeLabel: string; recipe: React.ReactNode; media: React.ReactNode }) {
  return (
    <article className="flex w-full flex-col gap-4 rounded-[16px] border border-border-default bg-surface-card p-5 shadow-[var(--shadow-card-sm)]">
      <p className="t-body-md text-text-primary">{author}</p>
      <h3 className="t-h3 pre-wrap">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <AiTag key={t} label={t} />
        ))}
      </div>
      <div className="flex flex-col gap-2 rounded-[8px] bg-surface-subtle p-4">
        <p className="t-body-md text-text-secondary">{recipeLabel}</p>
        <div className="t-body text-text-primary">{recipe}</div>
      </div>
      <div className="w-full overflow-hidden rounded-[20px] bg-surface-divider" style={{ aspectRatio: '328/185' }}>
        {media}
      </div>
    </article>
  );
}

export default function KnowhowPage() {
  return (
    <div className="container-page py-8 sm:py-10 lg:py-12">
      <section
        className="relative overflow-hidden rounded-[24px] px-5 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-[72px]"
        style={{ backgroundImage: 'linear-gradient(144.65deg, #f6f5ff 0%, #fff9f1 71.429%)' }}
      >
        {/* Blobs (blurred circles) */}
        <img src="/assets/knowhow/blob-3.svg" alt="" className="pointer-events-none absolute -left-[300px] -top-[240px] w-[640px] max-w-none" />
        <img src="/assets/knowhow/blob-2.svg" alt="" className="pointer-events-none absolute -top-[280px] right-[-120px] w-[700px] max-w-none" />
        <img src="/assets/knowhow/blob-1.svg" alt="" className="pointer-events-none absolute left-[30%] top-0 w-[620px] max-w-none" />

        <div className="relative flex flex-col gap-10">
          <header className="flex flex-col gap-3">
            <p className="t-body-md text-accent-blue-text">TIP</p>
            <h1 className="t-h1">우리 팀 실무 노하우</h1>
            <p className="t-body text-text-secondary">실무 중 발견한 효율화 팁, 툴 연동 노하우를 가볍게 작성해보아요</p>
          </header>

          <AuthorSection title="정현영" count={2}>
          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
            {/* Pro-Tip Card 1 (64:16) */}
            <ProTipCard
              author="정현영 매니저의 꿀팁 🍯"
              title={
                <>Gemini Gems와 NotebookLM을 연동한 디스크립션 없는 기획 문서 뼈대 잡기</>
              }
              tags={['Gemini', 'NotebookLM']}
              recipeLabel="프로세스 정리"
              recipe={
                <>
                  <p>• UI 화면 구조화 · 레이아웃 배치 — NotebookLM 요약을 Gems에 넣어 화면 목록과 정보 구조를 먼저 뽑습니다.</p>
                  <p>• 비주얼 고도화 — 뽑힌 구조를 Figma MCP로 옮겨 컴포넌트를 붙입니다.</p>
                </>
              }
              media={
                <div className="relative size-full">
                  <img src="/assets/knowhow/notebooklm-1.png" alt="NotebookLM 노트북 목록 화면" className="absolute left-0 top-0 h-full w-[58%] object-cover object-left-top" />
                  <img src="/assets/knowhow/notebooklm-2.png" alt="노트북 선택 메뉴" className="absolute right-0 top-0 h-full w-1/2 object-cover object-left-top" />
                  <div className="absolute right-[-3%] top-[39%] h-[20%] w-[51%] rounded-[8px] border-[3px] border-[red]" aria-hidden />
                </div>
              }
            />

            {/* Pro-Tip Card 2 (631:24) */}
            <ProTipCard
              author="정현영 매니저의 꿀팁 🍯"
              title={
                <>Claude 예약 작업으로 매일 08:00 글로벌 디자인 브리핑 자동 수신</>
              }
              tags={['Claude']}
              recipeLabel="설정 레시피 (한 번만)"
              recipe={
                <>
                  <p>
                    • 프로젝트에 리서치 지침을 넣고, 대화창에 <span className="text-accent-green-text">"매일 08:00(Asia/Seoul)에 이 프롬프트로 예약 작업 만들어 줘" + 프롬프트.</span>
                  </p>
                  <p>• 자동 승인·푸시 알림 ON → 즉시 실행으로 briefings/ 문서 생성 확인.</p>
                  <p>• 팀은 알림 첫 문장만 읽고, 근거가 필요할 때 프로젝트 문서를 엽니다.</p>
                  <p>• AI 인사이트 리서치 페이지를 채우기 쉬워집니다</p>
                </>
              }
              media={
                <div className="flex size-full flex-col gap-2 bg-[#f5f2f0] px-3.5 py-3">
                  <p className="text-[12px] font-semibold leading-[1.45] text-[#1c1c1f]">예약 작업 1개 → 매일 자동</p>
                  <div className="flex min-h-0 flex-1 gap-1.5">
                    {[
                      ['STEP 1', '프로젝트\n진입'],
                      ['STEP 2', '예약 작업\n생성'],
                      ['STEP 3', '승인·알림\nON'],
                      ['STEP 4', '테스트\n실행'],
                    ].map(([s, t]) => (
                      <div key={s} className="flex min-w-0 flex-1 flex-col gap-1 rounded-[8px] border border-[#e3e0db] bg-white p-2">
                        <p className="text-[9px] font-semibold leading-[1.45] text-[#3b4fd9]">{s}</p>
                        <p className="whitespace-pre-line text-[11px] font-medium leading-[1.45] text-[#1c1c1f]">{t}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-[6px] bg-[#1f1f21] px-2.5 py-1.5">
                    <p className="text-[10px] font-medium leading-[1.45] text-white">08:00 Asia/Seoul · 3~5건 · 저장 + 푸시</p>
                  </div>
                </div>
              }
            />

          </div>
          </AuthorSection>

          {/* Add Yours CTA (64:102)는 빈 자리 안내라 요청으로 제외 */}
        </div>
      </section>
    </div>
  );
}
