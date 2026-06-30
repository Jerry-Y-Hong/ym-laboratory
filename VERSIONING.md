# 버전 관리 규칙 cleavage

## 현재 버전: v2.10.19

## 규칙
파일을 수정할 때마다 `index.html`의 버전 번호를 올린다.

| 변경 규모 | 예시 | 버전 처리 |
|---|---|---|
| 버그 수정, 번역 수정, 소소한 UI 조정 | 약재 번역 오류 수정 | `2.10.19` → `2.10.20` (패치) |
| 새 기능, 탭 추가, 데이터 추가 | 새 탭 추가 | `2.10.x` → `2.11.0` (마이너) |
| 전체 구조 변경 | 엔진 교체 | `2.x.x` → `3.0.0` (메이저) |

## 수정 위치
`d:\antigravity\mfco-site\index.html` 내 다음 7개 줄:
```html
<link rel="stylesheet" href="style.css?v=2.10.19">
<script src="engine.js?v=2.10.19"></script>
<script src="app_core.js?v=2.10.19"></script>
<script src="app_dashboard.js?v=2.10.19"></script>
<script src="app_traditional.js?v=2.10.19"></script>
<script src="app_b2b.js?v=2.10.19"></script>
<script src="app_proposal_builder.js?v=2.10.19"></script>
<script src="app_beauty.js?v=2.10.19"></script>
```

## 변경 이력
| 버전 | 날짜 | 내용 |
|---|---|---|
| v2.10.19 | 2026-06-30 | 약재 백과사전 내 고유명(오갈피, 가시오갈피, 쇠무릎, 투구꽃 뿌리)의 번역 연동 및 백부자의 비정상 기계 번역 교정 |
| v2.10.18 | 2026-06-22 | 처방 설계실 하단의 R&D 개발자용 배합 데이터 내보내기(Export) 서브 컨트롤 패널의 타이틀 및 복사 버튼 다국어 번역 연동 |
| v2.10.17 | 2026-06-22 | 좌측 상단 워크스페이스 진입 뱃지/버튼을 B2B/관리자 워크스페이스(B2B/Admin Workspace)로 변경 및 다국어 연동 |
| v2.10.16 | 2026-06-22 | CRM 마케팅 자동화 캠페인 설계기 및 서브패널 헤더/필터 번역 사전 등록 및 영문화 적용 |
| v2.10.15 | 2026-06-22 | 구독자 & CRM 센터(tab-subscribers) 탭을 최고 관리자(Admin) 외의 계정에는 비노출(Hidden) 처리하는 보안 규칙 보완 |
| v2.10.14 | 2026-06-22 | 전문가 모드 대시보드 통계 카드 지표 라벨 영문화(Stabilized Unique Natural Ingredients 등) |
| v2.10.13 | 2026-06-22 | Nuri Lab 브랜드 스토리 및 특허 정보 모달 내의 HTML 번역 바인딩 구조 결함 교정 |
| v2.10.12 | 2026-06-22 | 전문가 모드(관리자 인증) 팝업 내 모든 국문 텍스트 영문화(Admin Certification 등) 연동 |
| v2.10.11 | 2026-06-22 | 뷰티/다이어트 탭의 '💡 내 체질 잘 모르겠음: 30초 자가진단' 버튼 및 재진단 텍스트 영문화 연동 |
| v2.10.10 | 2026-06-22 | 뷰티/다이어트 탭의 '체질 미진단'(Constitution Undiagnosed) 및 '--선택--' 다국어 리소스 등록 |
| v2.10.9 | 2026-06-22 | '화학적 상호작용 검사 결과' 영문화(Chemical Interaction Test Results) 및 번역 태그 바인딩 |
| v2.10.8 | 2026-06-22 | 독활, 동과자, 사삼, 보기건비, 보중익기 등 기계적 오역/직역 36개 항목 일괄 고품질 영문화 교정 |
| v2.10.7 | 2026-06-22 | 구자(guja ➡️ Leek Seeds), 지구자(earther ➡️ Oriental Raisin Tree Fruit) 오역 수정 및 캐시 갱신 |
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
