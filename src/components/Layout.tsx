import { useEffect, useState } from 'react';
import { asset } from '../lib/asset';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

export const NAV = [
  { to: '/', label: '보드 소개', n: 0 },
  { to: '/process', label: 'AI 프로세스 공유', n: 1 },
  { to: '/insights', label: 'AI 인사이트 리서치', n: 2 },
  { to: '/knowhow', label: '우리팀 실무 노하우', n: 3 },
  { to: '/questions', label: 'AI 질문 창구', n: 4 },
  { to: '/radar', label: '프로젝트별 AI 스택 레이더', n: 5 },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border-default bg-white/90 backdrop-blur">
        <div className="container-page flex h-14 items-center justify-between gap-4 lg:h-16">
          <NavLink to="/" className="flex items-center gap-2 whitespace-nowrap">
            <img src={asset('assets/intro/ai-sparkle.png')} alt="" className="size-6 object-contain" />
            <span className="text-[15px] font-bold tracking-[-0.2px] text-text-primary">디자인팀 AI 활용 공유보드</span>
          </NavLink>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="페이지">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-[14px] font-medium tracking-[-0.14px] transition-colors ${
                    isActive ? 'bg-accent-navy text-white' : 'text-text-secondary hover:bg-surface-subtle hover:text-text-primary'
                  }`
                }
              >
                {item.n > 0 && <span className="text-[12px] opacity-70">{item.n}</span>}
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-[8px] text-text-primary hover:bg-surface-subtle lg:hidden"
            aria-label="메뉴 열기"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
        {open && (
          <nav className="border-t border-border-default bg-white lg:hidden" aria-label="페이지(모바일)">
            <div className="container-page flex flex-col py-2">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-[15px] font-medium ${isActive ? 'bg-accent-navy text-white' : 'text-text-primary'}`
                  }
                >
                  <span className="inline-flex size-6 items-center justify-center rounded-full bg-surface-subtle text-[12px] font-bold text-text-secondary">{item.n}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border-default bg-white">
        <div className="container-page flex flex-col gap-2 py-6 text-[13px] text-text-tertiary sm:flex-row sm:items-center sm:justify-between">
          <span>GC메디아이 디자인팀 · 디자인팀 AI 활용 공유보드</span>
          <span>원본: Figma「디자인팀 AI 활용 공유보드」</span>
        </div>
      </footer>
    </div>
  );
}
