# 디자인팀 AI 활용 공유보드 — 웹사이트

Figma 「AI 활용 공유 보드」(`egZ9c39su3qGZLQjMvKM33`)를 Figma MCP로 분석해 React + TypeScript + Tailwind CSS v4로 구현한 반응형 웹사이트입니다.

## 실행 / 빌드

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # dist/ 생성 (tsc 타입체크 + vite build)
npm run preview    # 빌드 결과 미리보기
```

## 라우트 ↔ Figma 페이지

| 라우트 | Figma 페이지 | 구현 내용 |
|---|---|---|
| `/` | 👋 0. 보드 소개 | 보드 소개 카드, 페이지 목록(각 페이지로 링크), 팀 일러스트 (커버·설명 콜아웃은 요청으로 제외) |
| `/process` | 📍 1. AI 프로세스 공유 | 가이드 섹션(카드 만들기 안내, 템플릿 카드, 설명 2종, Claude Code 프롬프트) + 작성자 섹션 4개(정현영 9 · 이주희 13 · 이미애 11(그룹 4개) · 하소진 3 = 36장) |
| `/insights` | 📍 2. AI 인사이트 리서치 | 템플릿 보드 + 설명 + 채우기 프롬프트, 트렌드 분석 프롬프트(아코디언), 정현영 인사이트 모음 |
| `/knowhow` | 📍 3. 우리팀 실무 노하우 | The Showcase(그라데이션 + Blob) · Pro-Tip 카드 2장 · Add Yours CTA |
| `/questions` | 📍 4. AI 질문 창구 | 질문 카드 만들기 가이드, 템플릿 질문 카드, 설명 2종, 정현영 질문 카드 2장 |
| `/radar` | 📍 5. 프로젝트별 AI 스택 레이더 | 작성자 탭 4개(정현영 19행 · 이주희 14행 · 이미애 20행 · 하소진 4행) |

`🧩 Design System Components` 페이지는 컴포넌트 보드이므로 라우트로 만들지 않고 `src/lib/tags.ts`, `src/components/*`의 디자인 토큰/공통 컴포넌트로 구현했습니다. `---` 페이지 2개는 빈 구분 페이지입니다. 숨김 처리된 `[구버전]` 프레임 3개는 제외했습니다.

## 구조

```
src/
  index.css            # 디자인 토큰(@theme): 색상·서체·라운드·그림자, 타이포 유틸(t-h1…)
  lib/tags.ts          # Label/Tag 색상 변수 (AI 툴 16종 · 실행 상태 · 첨부문서 · 질문 상태)
  components/
    Layout.tsx         # 헤더 내비게이션(데스크톱/모바일) · 푸터
    Tag.tsx            # AiTag · StatusTag · DocTag · QuestionStatusTag · MetaChip · Badge · NumberBadge
    Primitives.tsx     # SectionHeader · NoteBox · CodeBox(PROMPT) · ImageSlot · Callout · Divider · PageHeader
    PromptPanel.tsx    # 검정 프롬프트 박스 (#d8ff74 / 채울 칸 #ffb3b4)
    ProcessCard.tsx    # Skill & Prompt Guide 템플릿 / AI 레시피 카드 v2 렌더러 (JSON 데이터 기반)
  pages/               # Home · Process · Insights · Knowhow · Questions · Radar · NotFound
  data/
    types.ts           # ProcessCard / RadarTable 타입
    process/*.json     # 카드 36장 (Figma에서 추출, nodeId 기준 파일명) + index.<작성자>.json
    radar/*.json       # 작성자별 레이더 표
public/assets/         # Figma 원본 에셋(이미지·SVG) + QA용 _figma.png 스크린샷
```

## 원본과 다르게 처리한 부분

- (요청 반영) 커버의 v0.1 버전 칩과 IN PROGRESS 라벨은 제거했습니다.
- (요청 반영) 복사용 프롬프트는 모두 접힘 기본 토글(`PromptToggle`)로 표시합니다.
- (요청 반영) 작성자가 없는 안내·프롬프트는 「가이드」 섹션, 사람 카드는 「작성자」 섹션으로 나눴습니다. 빈 템플릿(프로세스 템플릿 카드 56:19, 인사이트 템플릿 보드 195:829, 질문 템플릿 카드 217:40, 노하우 CTA 64:102)과 카드 안의 빈 Before/After 칸은 표시하지 않습니다.

- Figma 보드는 가로로 넓게 펼쳐진 캔버스이므로, 웹에서는 최대 1280px 컨테이너 안에 세로 흐름으로 재배치했습니다(카드 폭 740px 기준 2열 그리드).
- 레이더 페이지의 작성자별 표 4개는 탭으로 전환합니다. 프로세스 페이지는 작성자 앵커 바(스크롤 스파이)를 추가했습니다.
- 트렌드 분석 프롬프트(약 80줄)는 접었다 펼치는 아코디언으로 제공합니다.
- 상태 태그의 8px 점(SVG)은 CSS 원으로 대체했습니다(색상 동일).
- 서체: Pretendard(CDN), 커버의 Noto Sans KR · Roboto · Inter는 Google Fonts.

- (요청 반영) 가이드 섹션은 모든 페이지에서 기본 접힘(`GuideSection` = `<details>`)입니다.
- (요청 반영) 보드 소개 페이지 하단에 소개 영상을 무음 자동 재생·반복으로 넣었습니다. 원본 `.mov`(HEVC)는 브라우저 호환을 위해 `ffmpeg-static`으로 H.264 mp4(1280×720, 무음)로 변환했습니다: `node -e "console.log(require('ffmpeg-static'))"`로 ffmpeg 경로를 얻은 뒤 `ffmpeg -i 원본.mov -an -vf "scale='min(1280,iw)':-2" -c:v libx264 -crf 26 -pix_fmt yuv420p -movflags +faststart public/assets/intro/intro-video.mp4`.
- (요청 반영) 프로세스 카드를 클릭하면 카드 내용을 줄글로 보여주는 팝업(`CardTextModal`)이 열리고 「복사」 버튼으로 클립보드에 복사됩니다. 변환 규칙은 `src/lib/cardText.ts`에 있습니다.
- (요청 반영) 질문 카드에 답변 작성 폼을 추가했습니다. 답변은 `src/lib/answers.ts`를 통해 브라우저 localStorage(`ai-board.answers.v1`)에 저장되며, 같은 브라우저에서만 보입니다. 팀 전체가 공유하려면 백엔드(예: Supabase, Notion API) 연결이 필요합니다.

## 확인이 필요한 항목

- 프로세스 카드의 「전체 프롬프트 · Notion ↗」 칩은 Figma에 링크 URL이 없어 비활성 칩으로 표시됩니다.
- 질문 카드의 「🙋 나도 궁금해요」「👍 도움됐어요」 카운트는 정적 표시입니다(실제 투표 기능은 Figma에 정의되지 않음).
- 「내 노하우 자랑하기」 CTA, 「➕ 새 AI 사례가 생기면」 힌트는 Figma 보드 조작 안내 문구를 그대로 두었습니다.
- 정현영 카드 「의사랑 프로모션 메인 배너 · 3D 에셋 제작」의 After 이미지는 Figma에서 이미지 위에 텍스트 레이어를 얹은 합성입니다. 웹에는 기본 이미지만 표시됩니다.
- 이미애·이주희 섹션의 Before/After 칸은 Figma에서도 빈 플레이스홀더라 회색 칸으로 표시됩니다.
