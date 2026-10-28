import { useState } from 'react';
import { Link } from 'react-router-dom';
import { asset } from '../lib/asset';
import { copyText } from '../lib/cardText';
import { Divider } from '../components/Primitives';
import { NumberBadge } from '../components/Tag';

/** 배포 주소 — 누구나 접속 가능한 GitHub Pages (저장소 이름이 바뀌면 함께 수정) */
export const SITE_URL = 'https://jay0479-design.github.io/AI-board/';

/** 하단 공유 블록: QR + 주소 + 복사 버튼 */
function ShareBlock() {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    const ok = await copyText(SITE_URL);
    setCopied(ok);
    if (ok) window.setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="card mt-6 flex flex-col items-center gap-5 p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-7">
      <img src={asset('assets/share/site-qr.svg')} alt="사이트 접속 QR 코드" width={160} height={160} className="size-[160px] shrink-0 rounded-[12px] border border-surface-divider bg-white p-2" />
      <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center sm:items-start sm:text-left">
        <p className="t-title text-text-primary">휴대폰으로도 열어 보세요</p>
        <p className="t-body text-text-secondary">QR을 찍거나 아래 주소로 들어가면 누구나 볼 수 있어요. 링크는 자유롭게 공유해 주세요.</p>
        <div className="mt-1 flex w-full max-w-full flex-col items-center gap-2 sm:flex-row">
          <a href={SITE_URL} className="t-body-md min-w-0 max-w-full truncate rounded-full bg-surface-subtle px-4 py-2 text-text-primary hover:bg-surface-divider">
            {SITE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '')}
          </a>
          <button type="button" onClick={onCopy} className="shrink-0 rounded-full bg-black px-4 py-2 text-[14px] font-medium text-white hover:bg-text-secondary">
            {copied ? '✓ 복사됨' : '📋 주소 복사'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* Figma: 페이지 "👋 0. 보드 소개" (커버 245:1772는 요청으로 제외) */

const PAGES = [
  { n: 1, to: '/process', title: 'AI 프로세스 공유', desc: '내가 AI와 일한 순서를 카드 한 장으로. 이름별 섹션에 쌓아요.' },
  { n: 2, to: '/insights', title: 'AI 인사이트 리서치', desc: '새로 본 AI 소식과 스킬을 이미지 1장 + 한 줄로. 주기별 섹션으로 나눠요. 실 사용에 유용할수록 좋아요.' },
  { n: 3, to: '/knowhow', title: '우리팀 실무 노하우', desc: '실무에서 통한 팁을 간단하게 공유해요.' },
  { n: 4, to: '/questions', title: 'AI 질문 창구', desc: '모르는 것을 묻고, 공유해요. ' },
  { n: 5, to: '/radar', title: '프로젝트별 AI 스택 레이더', desc: '프로젝트마다 어떤 AI를 어느 단계에 쓰는지 표로 정리해요.' },
];

export default function HomePage() {
  return (
    <>
      <section className="container-page relative py-10 sm:py-14 lg:py-16">
        {/* 보드 소개 카드 (Figma 250:42, 1000×551, padding 36, gap 24) */}
        <div className="card flex flex-col gap-6 p-6 transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-[#b9c3e6] hover:shadow-[0_12px_32px_rgba(0,27,104,0.12)] sm:p-9">
          <div className="flex flex-col gap-2.5">
            <h1 className="t-h1">디자인팀 AI 활용 공유보드</h1>
            <p className="text-[15px] font-semibold leading-[1.5] tracking-[-0.16px] text-text-secondary sm:text-[16px]">
              팀원마다 다른 AI 활용 수준을 같은 눈높이로 맞추기 위한 보드입니다.
              <br />
              누가 어떤 AI를 어떤 순서로 써서 어떤 결과를 냈는지 한눈에 봅니다.
            </p>
          </div>

          <div className="flex flex-col gap-1 rounded-[8px] bg-accent-blue-bg px-4 py-3.5 t-body">
            <p className="font-semibold text-accent-blue-text">Figma 보드의 역할은 무엇인가요?</p>
            <p className="text-text-secondary">
              디자인팀 AI 활용 공유를 시각적으로 확인하는 보드입니다.
              <br />
              자세한 프롬프트 원문과 긴 설명은 <b className="font-bold">Notion에 정리하고</b> 카드에서 링크로 연결해요.
            </p>
          </div>

          <Divider />

          <div className="flex flex-col gap-2.5">
            <p className="t-title">페이지 목록</p>
            <ul className="flex flex-col gap-2.5">
              {PAGES.map((p) => (
                <li key={p.n}>
                  <Link to={p.to} className="group -mx-2 flex flex-col gap-1 rounded-[8px] px-2 py-1.5 transition-colors hover:bg-accent-blue-bg sm:flex-row sm:items-center sm:gap-3">
                    <span className="flex items-center gap-3">
                      <NumberBadge n={p.n} />
                      <span className="t-title w-[200px] group-hover:text-accent-blue-text">{p.title}</span>
                    </span>
                    <span className="t-body text-text-secondary pl-10 sm:pl-0">{p.desc}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 팀 일러스트 (Figma 249:1855, 283:11) — 설명 콜아웃(250:92)은 요청으로 제외 */}
        <div className="mt-5 flex justify-center lg:justify-end">
          <div className="relative w-[226px] shrink-0 lg:-mt-24">
            <img src={asset('assets/intro/team-illustration.png')} alt="디자인팀 캐릭터 일러스트" className="w-full" />
            <img src={asset('assets/intro/ai-sparkle.png')} alt="" className="absolute -right-2 -top-10 w-[54px] rotate-[8deg]" />
          </div>
        </div>

        {/* 하단 소개 영상 — 무음 자동 재생·반복 (원본 .mov를 H.264 mp4로 변환) */}
        <div className="card mt-8 overflow-hidden rounded-[20px] p-0 lg:mt-4">
          <video
            className="aspect-video w-full bg-black"
            src={asset('assets/intro/intro-video.mp4')}
            poster={asset('assets/intro/intro-video-poster.jpg')}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="디자인팀 AI 활용 공유보드 소개 영상"
          />
        </div>

        {/* 공유 블록 — 배포 주소 QR + 주소 복사 */}
        <ShareBlock />
      </section>
    </>
  );
}
