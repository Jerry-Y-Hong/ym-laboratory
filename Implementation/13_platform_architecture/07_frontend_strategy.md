# Frontend Strategy

> **Module**: 13_platform_architecture — Document 07  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Overview

YM-LAB Platform의 프론트엔드 전략을 정의한다.  
모든 Product는 단일 Design System(`@ymlab/design-system`)을 공유하며, 각 Product는 독립적으로 배포되는 Next.js 14 애플리케이션이다.

---

## 2. Frontend Architecture Model

```
┌──────────────────────────────────────────────────────────────┐
│                   PLATFORM DESIGN SYSTEM                     │
│      @ymlab/design-system + @ymlab/ui-components             │
├──────────────────────────────────────────────────────────────┤
│                   PRODUCT FRONTENDS                          │
│  blog.ymlab.io │ mfco.ymlab.io │ farm.ymlab.io │ ...        │
│  (각 Product: Next.js 14, 독립 배포)                         │
├──────────────────────────────────────────────────────────────┤
│                   PLATFORM FRONTEND                          │
│  app.ymlab.io (통합 대시보드, SSO 진입점)                     │
│  admin.ymlab.io (Platform 관리자 콘솔)                        │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. Design System Specification

### 3.1 Design Tokens

| 카테고리 | 토큰 예시 |
| :--- | :--- |
| **Colors** | `--color-primary-500`, `--color-neutral-100`, `--color-success-600` |
| **Typography** | `--font-family-base: 'Pretendard'`, `--font-size-lg: 1.125rem` |
| **Spacing** | `--space-1: 4px`, `--space-4: 16px`, `--space-8: 32px` |
| **Shadow** | `--shadow-sm`, `--shadow-md`, `--shadow-xl` |
| **Border Radius** | `--radius-sm: 4px`, `--radius-md: 8px`, `--radius-full: 9999px` |
| **Animation** | `--duration-fast: 150ms`, `--easing-standard: cubic-bezier(...)` |

### 3.2 Color Palette (YM-LAB Brand)

| 역할 | 색상 | HEX |
| :--- | :--- | :--- |
| Primary (Brand) | 深緑 (Deep Green) | `#2D6A4F` |
| Secondary | 황금 (Golden) | `#F4A261` |
| Neutral | 회색 | `#6B7280` |
| Success | 녹색 | `#22C55E` |
| Warning | 황색 | `#EAB308` |
| Error | 적색 | `#EF4444` |
| Background (Light) | 흰색 | `#FAFAFA` |
| Background (Dark) | 짙은 회색 | `#111827` |

### 3.3 Typography

| 수준 | 크기 | 용도 |
| :--- | :--- | :--- |
| Display | 3rem / 2.25rem | 히어로 타이틀 |
| Heading 1 | 1.875rem | 페이지 제목 |
| Heading 2 | 1.5rem | 섹션 제목 |
| Heading 3 | 1.25rem | 카드 제목 |
| Body Large | 1.125rem | 본문 강조 |
| Body | 1rem | 일반 본문 |
| Caption | 0.75rem | 보조 텍스트 |

**기본 폰트**: Pretendard (한국어 우선), Inter (영문 보조)

---

## 4. Component Library Architecture

### 4.1 Component Hierarchy

```
Primitive (HTML Elements)
    ↓
Atomic Components (@ymlab/design-system)
  Button, Input, Badge, Tag, Avatar, Icon, Spinner
    ↓
Molecule Components (@ymlab/design-system)
  Card, Modal, Toast, Dropdown, Form, DataTable, Tabs
    ↓
Business Components (@ymlab/ui-components)
  NutritionChart, RecipeCard, UserProfile, PlanCard
    ↓
Page Templates (각 Product에서 구현)
  ProductSpecificPageLayout
```

### 4.2 Component API Standard

모든 컴포넌트는 다음 Props 패턴을 따른다.

```typescript
interface ComponentProps {
  // 필수 Props
  id: string;           // 접근성 및 테스트 식별자
  
  // 선택 Props
  className?: string;   // 추가 스타일링 (Tailwind 미사용, CSS Module 또는 인라인)
  'data-testid'?: string;  // E2E 테스트 식별자
  'aria-label'?: string;   // 접근성
  
  // 이벤트
  onClick?: (event: React.MouseEvent) => void;
}
```

---

## 5. Layout System

### 5.1 Grid System

- **12컬럼 그리드**: 데스크톱 기준
- **반응형 Breakpoints**:

| 이름 | 범위 | 컬럼 수 |
| :--- | :--- | :--- |
| Mobile (sm) | < 640px | 4컬럼 |
| Tablet (md) | 640px ~ 1024px | 8컬럼 |
| Desktop (lg) | 1024px ~ 1280px | 12컬럼 |
| Wide (xl) | > 1280px | 12컬럼 (max-width 제한) |

### 5.2 Product Layout Templates

| 레이아웃 | 용도 |
| :--- | :--- |
| `DashboardLayout` | 사이드바 + 헤더 + 콘텐츠 (대시보드, 관리 화면) |
| `AuthLayout` | 중앙 정렬 폼 (로그인, 회원가입) |
| `MarketingLayout` | 풀 폭 (랜딩 페이지, 홍보 페이지) |
| `ArticleLayout` | 좁은 중앙 폭 (블로그, 문서) |
| `AppLayout` | 최대 폭 콘텐츠 (서비스 화면) |

---

## 6. Responsive Design Policy

- **Mobile First**: 모바일 기준으로 스타일을 작성하고 확장
- **Touch Targets**: 최소 44px × 44px (WCAG 2.5.5)
- **Image Optimization**: Next.js `<Image>` 컴포넌트 강제 사용 (자동 WebP 변환)
- **Font Loading**: `next/font` 사용, FOUT 방지

---

## 7. Accessibility (접근성)

| 기준 | 요건 |
| :--- | :--- |
| **표준** | WCAG 2.1 AA |
| **키보드 내비게이션** | 모든 인터랙티브 요소 키보드 접근 가능 |
| **스크린 리더** | ARIA 레이블, 역할(role), 상태(aria-expanded 등) 필수 |
| **색상 대비** | 텍스트 최소 4.5:1, 대형 텍스트 3:1 이상 |
| **포커스 표시** | `focus-visible` 스타일 필수 |
| **자동 테스트** | axe-core 통합 (Jest + Playwright) |

---

## 8. Internationalization (i18n)

| 항목 | 표준 |
| :--- | :--- |
| **라이브러리** | `next-intl` |
| **지원 언어** | 한국어(ko), 영어(en), 일본어(ja), 중국어 간체(zh-Hans), 중국어 번체(zh-Hant) |
| **번역 파일** | `/locales/{locale}/common.json`, `/locales/{locale}/product-{name}.json` |
| **날짜 형식** | `Intl.DateTimeFormat` (locale 기반 자동) |
| **숫자/통화** | `Intl.NumberFormat` |
| **RTL 지원** | 향후 확장 고려 (아랍어, 히브리어 대비) |

---

## 9. Theme Support

| 테마 | 구현 방법 |
| :--- | :--- |
| **라이트 모드** | CSS Variables 기본값 |
| **다크 모드** | `prefers-color-scheme` + 사용자 수동 선택 |
| **Product 테마** | Design Token 오버라이드로 Product별 브랜드 색상 적용 |
| **테마 영속성** | LocalStorage + 서버 사이드 쿠키 |

---

## 10. Performance Standards

| 지표 | 목표 |
| :--- | :--- |
| LCP (Largest Contentful Paint) | < 2.5초 |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| Lighthouse Score | ≥ 90 (Performance, Accessibility, SEO) |
| Bundle Size (초기 로드) | < 200KB (gzip) |
