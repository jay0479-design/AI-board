# Figma 재추출 데이터 (2026-11-04)

- `cards_raw.json` — 페이지 「📍 1. AI 프로세스 공유」 카드 42장의 텍스트(use_figma로 componentProperties·텍스트 레이어 추출)
- `radar_raw.json` — 페이지 「📍 5. 프로젝트별 AI 스택 레이더」 표 5개의 행
- `build_data.py` — 위 두 파일 + `exports/<nodeId>.png`(download_assets 2x 카드 내보내기)로 `src/data/process/*.json`, `src/data/radar/*.json`, `public/assets/process/<nodeId>/N.png`를 생성

사용: `python3 build_data.py <저장소 루트>` (PIL 필요). 카드 슬롯 좌표(SLOTS)는 Figma 「Image Slot」 인스턴스의 카드 기준 좌표입니다.
