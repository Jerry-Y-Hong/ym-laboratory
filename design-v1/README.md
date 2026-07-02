# Design v1 — 13 페이지 mock 묶음

이 폴더는 사용자가 직접 검토할 수 있는 **읽기편함·구독성 개선 디자인 v1** 의 산출물입니다.

## 들어있는 것

| 파일 | 역할 |
|---|---|
| `tokens.css` | 색·타이포·여백·그리드 토큰 (모든 mock이 이걸 공유) |
| `mock/` | 13개 페이지 mock HTML (번호 매김, 가로형 데스크톱 메인) |
| `mock_mobile/` | 모바일 viewport 단축본 (③⑤⑥ 3페이지만 우선, 추후 확장) |

## 페이지-번호 → 의미

| # | 페이지 | 사용자 범위 | mock 파일 |
|---|---|---|---|
| ① | 메인랜딩 | 일반 | `mock/01-landing.html` |
| ② | 대시보드 | 일반 | `mock/02-dashboard.html` |
| ③ | AI 약선 처방실 | 일반 | `mock/03-query.html` |
| ④ | 약선 비법서 (위키) | 일반 | `mock/04-recipes-wiki.html` |
| ⑤ | 약선 문화원 (위키) | 일반 | `mock/05-culture-wiki.html` |
| ⑥ | 전통발효 · 향토음식 | 일반 | `mock/06-fermentation.html` |
| ⑦ | 사용자 의견 · 후기 | 일반 | `mock/07-feedback.html` |
| ⑧ | 뷰티 진단 | 일반 | `mock/08-beauty.html` |
| ⑨ | 쇼핑 · 결제 | 일반 | `mock/09-shop.html` |
| ⑩ | 전문가 임상 사례 | 전문가 | `mock/10-pro-clinical.html` |
| ⑪ | 전문가 처방 빌더 | 전문가 | `mock/11-pro-builder.html` |
| ⑫ | 전문가 어소시에이트 | 전문가 | `mock/12-pro-associate.html` |
| ⑬ | 경영진 KPI | 경영진 | `mock/13-exec.html` |

## 열어보는 법

각 HTML 파일을 더블클릭하면 브라우저에서 바로 렌더됩니다.
폰트·이미지는 외부 의존 없이 인라인/placeholder로 들어가 있어 오프라인에서도 100% 열립니다.

## 다음 단계

사용자가 이 mock 안에서 "이 페이지 이 부분만 바꿔줘" 같은 한 줄만 짚어주시면,
그 부분만 `index.html` + `style.css` 에 패치해서 같은 가지를 이어 푸시합니다.
