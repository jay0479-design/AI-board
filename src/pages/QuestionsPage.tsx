import { useState, type FormEvent, type ReactNode } from 'react';
import { Callout, Divider, NoteBox, PageHeader, SectionHeader } from '../components/Primitives';
import { fill } from '../components/PromptPanel';
import { AuthorSection, GuideSection, PromptToggle } from '../components/Sections';
import { AnyTag, MetaChip, NumberBadge, QuestionStatusTag } from '../components/Tag';
import { useAnswers } from '../lib/answers';

/* Figma: 페이지 "📍 4. AI 질문 창구"
 *  - 섹션 "질문 이렇게 남겨요": 가이드(212:53) · 템플릿 카드(217:40) · Copy Hint(217:101) · 설명(223:166, 223:168)
 *  - 섹션 "정현영": 질문 카드 2장 (217:102, 317:514) */

type Answer = { who: string; date: string; helpful: string; text: string; placeholder?: boolean };

/** 답변 작성 폼 — 이름 + 답변을 적어 올린다 (브라우저 localStorage 저장) */
function AnswerForm({ onSubmit }: { onSubmit: (who: string, text: string) => void }) {
  const [who, setWho] = useState('');
  const [text, setText] = useState('');
  const canPost = who.trim().length > 0 && text.trim().length > 0;
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!canPost) return;
    onSubmit(who, text);
    setText('');
  };
  return (
    <form onSubmit={submit} className="flex w-full flex-col gap-2 rounded-[8px] border border-dashed border-[#b9c3e6] bg-white p-4">
      <p className="t-body-md text-text-secondary">✍️ 답변 남기기</p>
      <input
        value={who}
        onChange={(e) => setWho(e.target.value)}
        placeholder="이름"
        maxLength={30}
        className="w-full rounded-[6px] border border-border-default bg-surface-subtle px-3 py-2 t-body text-text-primary outline-none placeholder:text-text-tertiary focus:border-accent-blue-text sm:max-w-[200px]"
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="답변 내용. 짧아도, 링크만이라도 좋아요."
        rows={3}
        maxLength={2000}
        className="w-full resize-y rounded-[6px] border border-border-default bg-surface-subtle px-3 py-2 t-body text-text-primary outline-none placeholder:text-text-tertiary focus:border-accent-blue-text"
      />
      <div className="flex items-center justify-between gap-2">
        <span className="text-[12px] text-text-tertiary">이 브라우저에만 저장됩니다</span>
        <button
          type="submit"
          disabled={!canPost}
          className="rounded-[6px] bg-accent-navy px-4 py-1.5 text-[14px] font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          답변 올리기
        </button>
      </div>
    </form>
  );
}
type Question = {
  nodeId: string;
  asker: string;
  date: string;
  status: string;
  meToo: string;
  title: string;
  body: ReactNode;
  topics: string[];
  topicsHint?: string;
  ask: { desc?: string; lines: string[] };
  tried?: { desc?: string; text: ReactNode };
  answers: { desc?: string; items: Answer[]; emptyHint?: string };
  done?: { desc?: string; text: string };
};

function QuestionCard({ q }: { q: Question }) {
  const posted = useAnswers(q.nodeId);
  // 올린 답변이 생기면 Figma의 빈 답변 칸(placeholder)은 숨긴다.
  const figmaAnswers = posted.answers.length > 0 ? q.answers.items.filter((a) => !a.placeholder) : q.answers.items;
  return (
    <article className="flex w-full flex-col gap-5 rounded-[12px] border border-border-default bg-surface-card p-5 shadow-[var(--shadow-card-sm)] sm:p-7" data-node-id={q.nodeId}>
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <MetaChip>{q.asker}</MetaChip>
          <MetaChip>{q.date}</MetaChip>
          <QuestionStatusTag label={q.status} />
          <MetaChip tone="orange">{q.meToo}</MetaChip>
        </div>
        <h3 className="t-h2">{q.title}</h3>
        <p className="t-body pre-wrap text-text-secondary">{q.body}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="t-body-md text-text-secondary">🏷️ 관련 주제</span>
          {q.topics.map((t) => (
            <AnyTag key={t} label={t} />
          ))}
          {q.topicsHint && <span className="t-body text-text-tertiary">{q.topicsHint}</span>}
        </div>
      </header>
      <Divider />
      <section className="flex flex-col gap-3">
        <SectionHeader badge="ASK" tone="blue" name="🤔 이런 걸 알고 싶어요" desc={q.ask.desc} />
        <NoteBox tone="subtle">{q.ask.lines.join('\n')}</NoteBox>
      </section>
      {q.tried && (
        <section className="flex flex-col gap-3">
          <SectionHeader badge="TRIED" tone="orange" name="🧪 내가 해 본 것 · 참고한 것" desc={q.tried.desc} />
          <NoteBox tone="orange">{q.tried.text}</NoteBox>
        </section>
      )}
      <section className="flex flex-col gap-3">
        <SectionHeader badge="A" tone="green" name="💬 답변" desc={q.answers.desc} />
        {figmaAnswers.map((a, i) => (
          <div key={i} className="flex w-full flex-col gap-2 rounded-[8px] bg-surface-subtle p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <MetaChip tone="white">{a.who}</MetaChip>
                <MetaChip tone="white">{a.date}</MetaChip>
              </div>
              <MetaChip tone="white">{a.helpful}</MetaChip>
            </div>
            <p className="t-body text-text-primary">{a.text}</p>
          </div>
        ))}
        {posted.answers.map((a) => (
          <div key={a.id} className="flex w-full flex-col gap-2 rounded-[8px] bg-surface-subtle p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <MetaChip tone="white">👤 {a.who}</MetaChip>
                <MetaChip tone="white">📅 {a.date}</MetaChip>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => posted.helpful(a.id)} className="rounded-[6px] bg-surface-card px-3 py-1 t-body-md text-text-secondary hover:bg-accent-green-bg hover:text-accent-green-text">
                  👍 도움됐어요 {a.helpful}
                </button>
                <button type="button" onClick={() => posted.remove(a.id)} aria-label="답변 삭제" className="rounded-[6px] px-2 py-1 text-[13px] text-text-tertiary hover:bg-surface-card hover:text-text-secondary">
                  삭제
                </button>
              </div>
            </div>
            <p className="t-body pre-wrap text-text-primary">{a.text}</p>
          </div>
        ))}
        {q.answers.emptyHint && <p className="t-body text-text-tertiary">{q.answers.emptyHint}</p>}
        <AnswerForm onSubmit={posted.add} />
      </section>
      {q.done && (
        <section className="flex flex-col gap-3">
          <SectionHeader badge="DONE" tone="green" name="🎉 해결됐어요" desc={q.done.desc} />
          <NoteBox tone="green">{q.done.text}</NoteBox>
        </section>
      )}
      <p className="t-body text-text-tertiary">해결되면 상태를 ✅로 바꿔요.</p>
    </article>
  );
}

const QUESTIONS: Question[] = [
  {
    nodeId: '217:102',
    asker: '👤 정현영',
    date: '📅 2026.09.09',
    status: '🙋 답변 기다려요',
    meToo: '🙋 나도 궁금해요 0',
    title: 'AI로 만든 산출물, 어떻게 관리하세요?',
    body: 'HTML로 완료한 작업을 Figma에도 넣는지, 넣으면 실제 파일과 어떻게 맞추는지 궁금해요.\n누가 이어받아도 바로 일할 수 있게 하고 싶어요.',
    topics: ['Claude', '📎 HTML'],
    ask: { lines: ['① 산출물은 어디에 두나요?', '② Figma와 실제 파일은 어떻게 맞추나요?', '③ 이관할 때 확정된 시안 컴포넌트는 피그마에 보관하는지?'] },
    tried: {
      text: '피그마 컨퍼런스에서 카카오는 "AI로 만드는 것"보다 "AI로 만든 뒤"를 더 신경 쓴다고 해요.\n누가 이어받아도 바로 쓸 수 있게 파일을 정리하고 기록을 남기는 거예요.\n우리도 이런 마무리 습관이 필요할까요?',
    },
    answers: { items: [{ who: '👤 답변 기다리는 중', date: '📅 2026.09.09', helpful: '👍 도움됐어요 0', text: '첫 답변을 남겨 주세요.', placeholder: true }] },
  },
  {
    nodeId: '317:514',
    asker: '👤 정현영',
    date: '📅 2026.09.16',
    status: '🙋 답변 기다려요',
    meToo: '🙋 나도 궁금해요 0',
    title: '디자인팀 여러분은 클로드 코드로 어떤 업무를 하고 계세요?',
    body: '저는 홈페이지 시안과 Figma 컴포넌트 정리에 클로드 코드를 쓰고 있어요. \n다른 분들은 어떤 일에 어떻게 쓰시는지 궁금해서, 서로 방식을 비교해 보면 좋을 것 같아요.',
    topics: ['Claude Code', 'Figma MCP'],
    ask: {
      lines: ['① 클로드 코드로 주로 어떤 업무를 하시나요? (시안·리서치·문서 정리·코드 등)', '② 가장 효과가 좋았던 활용법이나 프롬프트가 있다면 무엇인가요?', '③ 써 보니 불편했거나 손으로 하는 게 더 나았던 순간은 언제였나요?'],
    },
    answers: { items: [{ who: '👤 답변자 이름', date: '📅 2026.09.09', helpful: '👍 도움됐어요 1', text: '답변 내용. 짧아도, 본인의 노하우면 환영입니다. 링크만이라도 좋아요.', placeholder: true }] },
  },
];

const TILES = [
  { n: 1, title: '카드 복사', desc: '오른쪽 카드를 복제해서 내 이름 섹션에 두기' },
  { n: 2, title: '질문 쓰기', desc: '제목은 한 문장. 알고 싶은 것을 자유롭게 작성하세요.' },
  { n: 3, title: '답변 달기', desc: '답변 칸을 복제해서 추가해요.' },
  { n: 4, title: '상태 바꾸기', desc: '질문상태에 따라 Status Tag를 바꿔요.', tag: '✅ 해결' },
];

export default function QuestionsPage() {
  return (
    <div className="container-page flex flex-col gap-10 py-8 sm:py-10 lg:gap-14 lg:py-12">
      <PageHeader eyebrow="PAGE 4" title="AI 질문 창구" subtitle="모르는 것을 묻고, 공유해요." />

      {/* ───────── 가이드: 질문 이렇게 남겨요 ───────── */}
      <GuideSection title="가이드" desc="질문 이렇게 남겨요">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:items-start">
          <div className="flex flex-col gap-5">
            {/* 가이드 카드 (212:53) */}
            <div className="card flex flex-col gap-5 rounded-[12px] p-5 sm:p-7">
              <div className="flex flex-col gap-2">
                <h3 className="t-h1">나의 AI 질문 카드 만들기</h3>
                <p className="t-body text-text-secondary">모르는 건 서로 질문하고 공유해요. 답은 짧아도 좋아요.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {TILES.map((t) => (
                  <div key={t.n} className="flex flex-col gap-2 rounded-[8px] bg-surface-subtle p-4">
                    <NumberBadge n={t.n} />
                    <p className="t-title">{t.title}</p>
                    {t.tag && <QuestionStatusTag label={t.tag} className="self-start" />}
                    <p className="t-body pre-wrap text-text-secondary">{t.desc}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2.5 rounded-[8px] bg-surface-subtle px-4 py-3.5">
                <p className="t-body-md">✅ 우리 약속</p>
                <div className="flex flex-wrap gap-2">
                  {['질문자 이름은 섹션으로', '링크 하나도 답변이에요', '나도 궁금해요가 많을수록 팀에 유용해요'].map((r) => (
                    <span key={r} className="rounded-[6px] bg-white px-2.5 py-1 t-body-md text-accent-green-text">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 xl:sticky xl:top-32">
            {/* 설명 (223:168) + 프롬프트 토글 — 빈 템플릿 카드(217:40)와 복사 안내는 요청으로 제외 */}
            <Callout>
              질문이 길어지면 클로드 코드에 복사한 카드 링크를 보낸 후 정리를 요청하세요.
              <br />
              <span className="font-normal">
                괄호 <span className="text-accent-fill">‘[ ]’</span> 는 각자 내용을 채워주세요. 나온 결과에서 빠진 내용은 직접 고칩니다.
              </span>
            </Callout>
            <PromptToggle
              title="프롬프트 (카드 링크를 보내고 정리를 요청하세요)"
              lines={[
                [fill('[카드 링크] '), '이 카드에 Figma MCP로 채워줘. '],
                ['제목 한 문장·배경·알고 싶은 것 3개로 정리하고, 이름은 ', fill('[이름]'), ', 날짜는 오늘로. 이 카드만 수정해. '],
                ['질문: ', fill('[질문 내용]')],
              ]}
            />
          </div>
        </div>
      </GuideSection>

      {/* ───────── 정현영 섹션 ───────── */}
      <AuthorSection title="정현영" count={QUESTIONS.length}>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:items-start">
          {QUESTIONS.map((q) => (
            <QuestionCard key={q.nodeId} q={q} />
          ))}
        </div>
      </AuthorSection>
    </div>
  );
}
