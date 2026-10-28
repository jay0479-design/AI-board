# 디자인팀 AI 활용 공유보드 — 프로젝트 가이드 (CLAUDE.md)

이 파일은 **어느 PC에서든 저장소를 받아 AI(Claude Code · Cursor 등)로 바로 수정 작업을 이어가기 위한 단일 컨텍스트 문서**입니다.
작업을 시작하기 전에 AI는 이 파일을 먼저 읽고, 아래의 「지켜야 할 결정 사항」을 바꾸지 않은 채 요청을 수행합니다.
새로운 결정·규칙이 생기면 이 파일을 함께 갱신하고 커밋하세요.

---

## 1. 프로젝트 한눈에 보기

| 항목 | 내용 |
|---|---|
| 이름 | 디자인팀 AI 활용 공유보드 (GC메디아이 디자인팀) |
| 무엇 | Figma 보드 「AI 활용 공유 보드」를 그대로 옮긴 반응형 웹사이트 |
| 원본 Figma | 파일 키 `egZ9c39su3qGZLQjMvKM33` (보드 본체) · 발표 장표 `TX22qnJGWHuaOKsPiNfepj` |
| 배포 주소 | https://jay0479-design.github.io/AI-board/ (GitHub Pages, master 푸시 시 자동 배포) |
| 저장소 | https://github.com/jay0479-design/AI-board (public) |
| 스택 | Vite 5 · React 18 · TypeScript(strict) · react-router-dom 6 · Tailwind CSS v4 |
| 서체 | Pretendard (CDN) |
| 상태 | 제작 중(미완성) 버전을 내용 확인용으로 배포한 상태 |

---

## 2. 새 PC에서 시작하기

```bash
git clone https://github.com/jay0479-design/AI-board.git
cd AI-board
npm install
npm run dev        # http://localhost:5173  (같은 Wi-Fi 기기에서는 터미널의 Network 주소)
```

- Node 20 이상 권장 (GitHub Actions도 Node 20으로 빌드).
- Claude Code 데스크톱 앱이면 `.claude/launch.json`의 **web** 설정으로 미리보기를 켤 수 있습니다.
  (`labviewer-proto` 항목은 특정 PC 전용 경로라 다른 PC에서는 무시하세요.)

### 자주 쓰는 명령

| 명령 | 역할 |
|---|---|
| `npm run dev` | 개발 서버 (`--host` 포함, 모바일 접속 가능) |
| `npm run build` | `tsc -b` 타입체크 + `vite build` + `dist/404.html` 복사(SPA 새로고침 대응) |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run typecheck` | 타입만 검사 |
| `MSYS_NO_PATHCONV=1 VITE_BASE=/AI-board/ npm run build` | 배포와 같은 하위 경로로 빌드 (Git Bash) |

---

## 3. 폴더 구조와 역할

```
index.html                 # 제목·파비콘(/favicon.svg, 별 모양)·Pretendard 링크
vite.config.ts             # base = process.env.VITE_BASE ?? '/', react + tailwindcss 플러그인, 포트 5173
src/
  main.tsx                 # <BrowserRouter basename={import.meta.env.BASE_URL}>
  App.tsx                  # 라우트 6개 + NotFound
  index.css                # 디자인 토큰(@theme) · @layer base(keep-all, overflow-wrap) · @layer components(t-h1… .card .pre-wrap .container-page)
  lib/
    tags.ts                # 태그 색상(AI 툴 16종 · 실행 상태 · 첨부문서 · 질문 상태) = Figma 변수 값, resolveTag()
    asset.ts               # asset('assets/…') → BASE_URL을 붙인 정적 파일 경로 (하위 경로 배포 필수)
    cardText.ts            # cardToText(card) 줄글 변환 · copyText() 클립보드(+폴백)
    answers.ts             # useAnswers(questionId): 질문 답변을 localStorage('ai-board.answers.v1')에 저장
  components/
    Layout.tsx             # 상단 고정 내비(6개 메뉴, 모바일 햄버거) · 푸터
    Tag.tsx                # AiTag · StatusTag · DocTag · QuestionStatusTag · MetaChip · Badge · NumberBadge
    Primitives.tsx         # SectionHeader · NoteBox · CodeBox(PROMPT) · ImageSlot · Callout(검정 박스) · Divider · PageHeader
    PromptPanel.tsx        # 검정 프롬프트 패널 (강조 #d8ff74 / 채울 칸 #ffb3b4)
    Sections.tsx           # GuideSection(<details>, 기본 접힘) · AuthorSection(작성자 pill) · PromptToggle(검정 토글)
    ProcessCard.tsx        # 프로세스 카드 렌더러 (JSON 블록 기반, onOpen으로 클릭 시 팝업)
    CardTextModal.tsx      # 카드 줄글 팝업 + 📋 복사 버튼
  pages/
    HomePage.tsx           # 소개 카드(호버 효과) · 페이지 목록 링크 · 팀 일러스트 · 하단 소개 영상(무음 자동재생)
    ProcessPage.tsx        # 가이드 섹션 + 작성자 섹션 4개(스크롤 스파이 앵커 바) + CardTextModal
    InsightsPage.tsx       # 가이드(채우기/트렌드 분석 프롬프트 토글) + 정현영 인사이트 보드
    KnowhowPage.tsx        # Showcase 그라데이션 + Pro-Tip 카드
    QuestionsPage.tsx      # 가이드 + 질문 카드 2장 + 답변 작성 폼(AnswerForm)
    RadarPage.tsx          # 작성자 탭 4개 + 표(min-w 1100)
  data/
    types.ts               # ProcessCard / Block / Box / ImageItem / RadarTable 타입 (아래 4절 참고)
    process/
      index.ts             # import.meta.glob으로 *-*.json 카드 자동 수집, SECTION_ORDER(정현영→이주희→이미애→하소진)
      index.<작성자>.json   # 작성자별 카드 순서 (배열 또는 {sectionTitle, groups:[{label, files}]})
      <nodeId>.json        # 카드 1장 = 파일 1개 (Figma 노드 ID, 예: 446-1214.json) — 총 36장
    radar/
      index.json           # 작성자 탭 순서
      <작성자>.json         # 레이더 표 1개
public/
  favicon.svg
  assets/                  # Figma 원본 이미지·SVG, 프로세스 카드 이미지, _figma.png(QA 비교용)
  assets/intro/            # intro-video.mp4 (H.264 1280×720 무음) + 포스터
docs/mobile-qr.png         # 로컬 Network 주소 QR (PC IP 바뀌면 재생성)
docs/site-qr.png           # 배포 주소 QR
.github/workflows/deploy.yml  # master 푸시 → 빌드(VITE_BASE=/AI-board/) → GitHub Pages
.claude/launch.json        # 미리보기 서버 설정 (web / preview-pages)
```

---

## 4. 데이터 편집 방법 (가장 자주 하는 수정)

컴포넌트는 손대지 않고 **JSON만 추가·수정**하면 화면에 반영됩니다.

### 4-1. 프로세스 카드 추가
1. `src/data/process/<nodeId>.json` 생성 (파일명은 `숫자-숫자.json` 형식이어야 glob에 잡힘).
2. 같은 작성자의 `index.<작성자>.json`에 파일명을 원하는 순서로 추가.
   - 단순 배열: `["446-1214.json", "420-204.json"]`
   - 그룹형(이미애): `{ "sectionTitle": "...", "groups": [{ "label": "Group · ①", "files": [...] }] }`
3. 새 작성자라면 `src/data/process/index.ts`의 `SECTION_ORDER`에 추가.
4. 이미지는 `public/assets/process/…`에 넣고 JSON에는 `"src": "assets/process/파일명"`처럼 **앞에 / 없이** 적습니다 (asset()이 BASE_URL을 붙임).

카드 JSON 최소 형태:
```json
{
  "nodeId": "446:1214",
  "author": "정현영",
  "order": 1,
  "template": "skill-prompt-guide",
  "title": "카드 제목",
  "subtitle": "한 줄 요약",
  "aiTags": ["Claude Code"],
  "docTags": ["📎 HTML"],
  "blocks": [
    { "type": "step", "badge": "STEP 1", "badgeTone": "blue", "name": "단계 이름", "desc": "설명",
      "promptLabel": "프롬프트", "boxLabel": "PROMPT", "prompt": "프롬프트 본문",
      "link": { "label": "전체 프롬프트 · Notion ↗", "url": "https://..." },
      "images": [{ "label": "Before", "src": "assets/process/xxx.png" }] },
    { "type": "section", "badge": "결과", "badgeTone": "green", "boxes": [{ "tone": "green", "title": "결과", "text": "…" }] },
    { "type": "images", "items": [{ "src": "assets/process/yyy.png" }] },
    { "type": "text", "text": "자유 텍스트" }
  ]
}
```
- `template`: `skill-prompt-guide` | `ai-recipe-v2` | `other`
- `badgeTone`: `blue` | `orange` | `green` · `Box.tone`: `subtle` | `green` | `orange` | `blue` | `code`
- `aiTags`/`docTags`/`statusTag` 문자열은 `src/lib/tags.ts`의 라벨과 일치해야 색이 붙습니다. 없는 라벨은 회색으로 표시됩니다.
- `src`가 빈 문자열인 이미지는 렌더되지 않습니다(빈 칸 숨김 규칙).

### 4-2. 레이더 표 행 추가
`src/data/radar/<작성자>.json`의 `rows`에 `{ "cells": [ {"text": "2026"}, {"text": "10"}, {"text": "담당자"}, {"text": "프로젝트명"}, {"tags": [{"label": "진행중", "kind": "status"}]}, {"tags": [{"label": "Claude Code", "kind": "ai"}]} ] }` 형태로 추가. 열 순서는 `columns`와 같아야 합니다. 새 작성자는 `index.json`에 이름 추가.

### 4-3. 질문·노하우·인사이트
이 세 페이지의 카드는 아직 JSON이 아니라 각 `pages/*.tsx` 안에 직접 적혀 있습니다. 카드를 추가할 때는 같은 파일의 기존 카드 블록을 복제해서 수정하세요. (JSON화는 향후 과제)

### 4-4. Figma에서 새 카드 뽑아오기
Figma MCP가 연결돼 있으면: `create_session(fileKey)` → `get_design_context(nodeId)` 로 구조를 읽고 위 JSON 스키마로 옮김 → 이미지는 `download_assets`로 `public/assets/process/`에 저장. QA용으로 `get_screenshot` 결과를 `_figma.png`로 같이 두는 관례입니다.

---

## 5. 지켜야 할 결정 사항 (사용자가 직접 요청한 것 — 임의로 되돌리지 말 것)

**메인(/)**
- 커버 영역(「GC메디아이 / AI 활용 인사이트 / 공유 보드」), v0.1 버전 칩, IN PROGRESS 라벨, 「디자인팀 2026.9.9」, 「하단 페이지 목록에서…」 안내 콜아웃은 모두 **삭제된 상태**를 유지.
- 사이트 이름은 **「디자인팀 AI 활용 공유보드」** (헤더·푸터·`<title>`·소개 카드 h1 동일).
- 소개 카드에는 호버 효과(살짝 떠오름 + 테두리 #b9c3e6 + 그림자).
- 맨 아래 소개 영상: `autoPlay muted loop playsInline`, 소리 없음.
- 영상 아래 **공유 블록(`ShareBlock`)**: 배포 주소 QR(`public/assets/share/site-qr.svg`) + 주소 + 「주소 복사」 버튼. 주소 상수는 `SITE_URL`(HomePage.tsx). 저장소 이름이 바뀌면 QR·SITE_URL·VITE_BASE를 함께 갱신.

**모든 페이지 공통**
- 복사용 프롬프트는 전부 **`PromptToggle`(검정 토글, 기본 접힘)** 안에.
- 작성자가 없는 안내·템플릿·프롬프트는 **「가이드」 섹션(`GuideSection`)**, 사람이 만든 카드는 **「작성자」 섹션(`AuthorSection`)** 으로 분리.
- 가이드 섹션은 **모든 페이지에서 기본 접힘**.
- 비어 있는 템플릿 카드(프로세스 56:19 · 인사이트 195:829 · 질문 217:40 · 노하우 CTA 64:102)와 카드 안의 빈 Before/After 이미지 칸은 **표시하지 않음**.
- 줄바꿈: `word-break: keep-all` + `overflow-wrap: anywhere` 전역 적용. 단어 중간 끊김 금지.

**프로세스(/process)**
- 카드를 클릭하면 **줄글 팝업(`CardTextModal`)** 이 뜨고 「복사」 버튼으로 클립보드 복사. 카드 안의 링크 클릭은 팝업을 열지 않음.

**레이더(/radar)**
- 표 하단의 「2026 이름」 같은 footnote 태그는 **제거된 상태** 유지.

**질문(/questions)**
- 답변을 적어서 올릴 수 있는 폼이 있음. 저장은 현재 브라우저 localStorage(같은 브라우저에서만 보임). Figma에 있던 예시 답변은 `placeholder: true`로 표시되고, 실제 답변이 올라오면 숨김.

**파비콘**
- 별 모양 SVG (`public/favicon.svg`).

---

## 6. 코드 규칙

- 정적 파일 경로는 반드시 `asset('assets/…')`로 감쌉니다. `/assets/…`를 직접 쓰면 GitHub Pages(하위 경로 `/AI-board/`)에서 깨집니다.
- 라우터 링크는 `<Link to="/process">`처럼 루트 기준으로 쓰고, `basename`이 알아서 붙습니다.
- 색·라운드·그림자는 `src/index.css`의 `@theme` 토큰(`text-text-primary`, `bg-surface-card`, `rounded-card` 등)을 사용. 새 색이 필요하면 토큰을 추가하고 Figma 변수명과 맞춥니다.
- 전역 `a { color: inherit }` 같은 기본 스타일은 반드시 `@layer base` 안에 (밖에 두면 Tailwind 유틸리티를 덮어써 글자가 사라진 적 있음).
- 타이포 유틸: `.t-h1 .t-h2 .t-h3 .t-title .t-body .t-body-md`, 여러 줄 텍스트는 `.pre-wrap`.
- 카드 폭 740px 기준 2열 그리드, 컨테이너 최대 1280px(`.container-page`).
- 커밋 메시지는 한국어 한 줄 요약 (예: `파비콘·카드 줄글 복사 팝업·소개 영상·네이밍 변경`).
- 수정 후에는 `npm run build`가 에러 없이 끝나는지 확인하고 커밋합니다.

---

## 7. 배포

- `master`에 푸시 → `.github/workflows/deploy.yml` 실행 → 약 1~2분 뒤 https://jay0479-design.github.io/AI-board/ 갱신.
- 워크플로가 `VITE_BASE=/AI-board/`를 넣어 빌드합니다. **저장소 이름을 바꾸면 이 값도 바꿔야 합니다.**
- 빌드 후 `dist/index.html`을 `dist/404.html`로 복사해 새로고침·딥링크가 동작합니다.
- 배포 결과를 로컬에서 미리 보려면 하위 경로 빌드 후 `.claude/launch.json`의 **preview-pages** (http://localhost:4173/AI-board/).
- 저장소가 public이라 링크를 아는 누구나 볼 수 있습니다.
- QR 재생성(docs/site-qr.png 1024px, public/assets/share/site-qr.{png,svg}): `node -e "const q=require('qrcode'),u='https://jay0479-design.github.io/AI-board/';q.toFile('docs/site-qr.png',u,{width:1024,margin:2});q.toFile('public/assets/share/site-qr.png',u,{width:512,margin:1});q.toFile('public/assets/share/site-qr.svg',u,{type:'svg',margin:1})"`

---

## 8. 환경별 주의사항 (Windows에서 겪은 것)

- Git Bash에서 `VITE_BASE=/AI-board/`가 `C:/Program Files/Git/AI-board/`로 바뀜 → 앞에 `MSYS_NO_PATHCONV=1`.
- `python`은 Microsoft Store 스텁이라 안 됨 → 스크립트는 `node -e` 사용.
- `curl`이 exit 35(schannel 인증서 폐기 확인 실패) → `curl --ssl-no-revoke` 또는 PowerShell `Invoke-WebRequest`.
- 한글 경로·따옴표가 들어간 bash heredoc은 파싱 실패할 수 있음 → 파일 작성은 에디터/Write 도구로.
- 모바일에서 개발 서버 접속 시 Windows 방화벽의 Node.js 허용 필요.
- 영상 변환: `.mov(HEVC)`는 Chrome에서 안 나오므로 `ffmpeg-static`으로 H.264 mp4 변환
  `ffmpeg -i 원본.mov -an -vf "scale='min(1280,iw)':-2" -c:v libx264 -crf 26 -pix_fmt yuv420p -movflags +faststart public/assets/intro/intro-video.mp4`
  (ffmpeg 경로: `node -e "console.log(require('ffmpeg-static'))"`)

---

## 9. 아직 안 된 것 · 확인 필요

- 질문 답변은 localStorage뿐이라 **팀 전체 공유가 안 됨**. Supabase/Notion API 등 백엔드 연결이 필요 (제안만 됨, 미구현).
- 「🙋 나도 궁금해요」「👍 도움됐어요」 카운트는 정적 표시(Figma에 투표 기능 정의 없음).
- 일부 프로세스 카드의 「전체 프롬프트 · Notion ↗」 칩은 Figma에 URL이 없어 비활성.
- 이미애·이주희 섹션의 Before/After는 Figma에서도 빈 플레이스홀더.
- 질문·노하우·인사이트 페이지의 카드를 JSON 데이터로 분리하는 작업.
- Figma 발표 장표(`TX22qnJGWHuaOKsPiNfepj`, 슬라이드 「07 / SITE · QR」)의 QR 이미지가 배포 주소를 가리키는지 미확인. 다르면 `docs/site-qr.png`로 교체.

---

## 10. 작업 이력 (요약)

| 날짜 | 내용 |
|---|---|
| 2026-10-28 | Figma 보드 분석 → React+TS+Tailwind v4로 전체 페이지 구현 (프로세스 카드 36장 JSON 추출, 레이더 표 4개) |
| 2026-10-28 | 메인 정리(버전/상태/날짜/커버/콜아웃 삭제), 프롬프트 토글화, 가이드/작성자 섹션 분리, 빈 템플릿·빈 이미지 칸 제거, 레이더 footnote 제거, 줄바꿈 수정, 가이드 기본 접힘, 질문 답변 폼 |
| 2026-10-28 | 별 파비콘, 프로세스 카드 클릭 → 줄글 복사 팝업, 메인 하단 소개 영상(무음), 이름 「디자인팀 AI 활용 공유보드」, 소개 카드 호버 |
| 2026-10-29 | 모바일 접속(`--host`) + QR, GitHub Pages 자동 배포, 배포 주소 QR |
| 2026-10-29 | Figma 장표에 「제작 중 · 내용 확인용 배포」 안내 문구 작성, 이 CLAUDE.md 추가 |

---

## 11. AI에게 수정 요청할 때 (바이브코딩 팁)

- 요청 예: 「정현영 프로세스에 카드 추가해줘, 제목은 …, STEP 2개」 → 4-1 절차로 JSON만 추가.
- 요청 예: 「레이더 하소진 표에 10월 프로젝트 한 줄 추가」 → 4-2.
- 요청 예: 「홈 소개 문구 바꿔줘」 → `src/pages/HomePage.tsx`.
- 요청 예: 「태그 색 바꿔줘」 → `src/lib/tags.ts`.
- 큰 변경 전에는 5절의 결정 사항과 충돌하지 않는지 확인하고, 충돌하면 사용자에게 먼저 물어봅니다.
- 끝나면 `npm run build` → 한국어 커밋 → `git push origin master` (자동 배포).
