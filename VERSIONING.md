# 버전 관리 규칙

## 현재 버전: v2.10.0

## 규칙
파일을 수정할 때마다 `index.html`의 버전 번호를 올린다.

| 변경 규모 | 예시 | 버전 처리 |
|---|---|---|
| 버그 수정, 번역 수정, 소소한 UI 조정 | 약재 번역 오류 수정 | `2.10.0` → `2.10.1` (패치) |
| 새 기능, 탭 추가, 데이터 추가 | 새 탭 추가 | `2.9.x` → `2.10.0` (마이너) |
| 전체 구조 변경 | 엔진 교체 | `2.x.x` → `3.0.0` (메이저) |

## 수정 위치
`d:\antigravity\mfco-site\index.html` 내 다음 7개 줄:

```html
<link rel="stylesheet" href="style.css?v=X.X.X">
<script src="engine.js?v=X.X.X"></script>
<script src="app_core.js?v=X.X.X"></script>
<script src="app_dashboard.js?v=X.X.X"></script>
<script src="app_traditional.js?v=X.X.X"></script>
<script src="app_b2b.js?v=X.X.X"></script>
<script src="app_proposal_builder.js?v=X.X.X"></script>
<script src="app_beauty.js?v=X.X.X"></script>
```

## 변경 이력
| 버전 | 날짜 | 내용 |
|---|---|---|
| v2.10.0 | 2026-06-22 | Sasang Constitution Mini-Quiz 컨트롤러 복원 및 i18n 번역 가다듬기 |
| v2.9.9 | 2026-06-22 | RTL 모드에서의 전역 언어 표시 바 정렬 밀림 현상 방지 고정 조치 |
| v2.9.2 | 2026-06-22 | 약재 번역 27개 수정, i18n 누락 15개 추가, 버전 체계 통일 |
| v2.9.1 | 이전 | Beauty 탭 추가, 다국어 확장 |
