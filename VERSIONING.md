# 버전 관리 규칙 cleavage

## 현재 버전: v2.10.6

## 규칙
파일을 수정할 때마다 `index.html`의 버전 번호를 올린다.

| 변경 규모 | 예시 | 버전 처리 |
|---|---|---|
| 버그 수정, 번역 수정, 소소한 UI 조정 | 약재 번역 오류 수정 | `2.10.6` → `2.10.7` (패치) |
| 새 기능, 탭 추가, 데이터 추가 | 새 탭 추가 | `2.10.x` → `2.11.0` (마이너) |
| 전체 구조 변경 | 엔진 교체 | `2.x.x` → `3.0.0` (메이저) |

## 수정 위치
`d:\antigravity\mfco-site\index.html` 내 다음 7개 줄:
```html
<link rel="stylesheet" href="style.css?v=2.10.6">
<script src="engine.js?v=2.10.6"></script>
<script src="app_core.js?v=2.10.6"></script>
<script src="app_dashboard.js?v=2.10.6"></script>
<script src="app_traditional.js?v=2.10.6"></script>
<script src="app_b2b.js?v=2.10.6"></script>
<script src="app_proposal_builder.js?v=2.10.6"></script>
<script src="app_beauty.js?v=2.10.6"></script>
```

## 변경 이력
| 버전 | 날짜 | 내용 |
|---|---|---|
| v2.10.6 | 2026-06-22 | 전통 발효/향토 요리명 의역(Heotjesabab ➡️ Ritual-Style Bibimbap 등) 및 버전 번들 갱신 |
| v2.10.5 | 2026-06-22 | 수육(Suyuk ➡️ Boiled Pork Slices) 및 씨간장(sui-ganjang ➡️ Heritage Master Soy Sauce) 의역 교정 반영 |
| v2.10.4 | 2026-06-22 | 영어 레시피 및 백과사전 DB 내 한글 발음 직역 표기(Donggulle, Hwangjeong, Jocheong 등)를 고품질 영어 학명/속명으로 일괄 갱신 |
| v2.10.3 | 2026-06-22 | 게이트웨이 화면에 '게스트로 바로 둘러보기 (Explore as Guest)' 진입 버튼 제공 및 다국어 지원 |
| v2.10.2 | 2026-06-22 | 다국어 번역 사전(JSON) 호출 시 브라우저 캐시 무효화 파라미터 강제 동기화 (?v=2.10.2) |
| v2.10.1 | 2026-06-22 | 게이트웨이(웰컴 랜딩) 화면 전체 다국어 번역 지원 및 입력창 플레이스홀더 i18n 처리 |
| v2.10.0 | 2026-06-22 | Sasang Constitution Mini-Quiz 컨트롤러 복원 및 i18n 번역 가다듬기 |
| v2.9.9 | 2026-06-22 | RTL 모드에서의 전역 언어 표시 바 정렬 밀림 현상 방지 고정 조치 |
| v2.9.2 | 2026-06-22 | 약재 번역 27개 수정, i18n 누락 15개 추가, 버전 체계 통일 |
| v2.9.1 | 이전 | Beauty 탭 추가, 다국어 확장 |
