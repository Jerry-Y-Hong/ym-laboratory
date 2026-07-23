# Shared Component Policy

> **Module**: 13_platform_architecture — Document 06  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Purpose

모든 Product가 재사용하는 공통 컴포넌트의 정의, 범위, 버전 관리, 배포 정책을 정의한다.

---

## 2. Shared Component Catalog

### 2.1 Frontend Design System (`@ymlab/design-system`)

| 항목 | 내용 |
| :--- | :--- |
| **패키지명** | `@ymlab/design-system` |
| **기술** | React + TypeScript + CSS Variables |
| **포함 내용** | Design Tokens, Base Components, Layout System |
| **배포** | npm private registry |
| **소유 팀** | Platform Frontend Team |

**포함 컴포넌트:**
- Design Tokens (색상, 타이포그래피, 간격, 그림자, 애니메이션)
- Atomic Components (Button, Input, Badge, Tag, Avatar, Icon)
- Molecule Components (Card, Modal, Toast, Dropdown, Form, DataTable)
- Layout Components (Grid, Flex, Container, Sidebar, Header, Footer)
- Theme Provider (라이트/다크 모드, 커스텀 테마)

### 2.2 AI SDK (`@ymlab/ai-sdk`)

| 항목 | 내용 |
| :--- | :--- |
| **패키지명** | `@ymlab/ai-sdk` (Python: `ymlab-ai-sdk`) |
| **기술** | TypeScript / Python |
| **포함 내용** | AI Engine API 클라이언트, 스트리밍 지원, 에러 핸들링 |
| **배포** | npm + PyPI (private) |
| **소유 팀** | Platform AI Team |

**핵심 기능:**
```typescript
// TypeScript 예시
import { YMLabAI } from '@ymlab/ai-sdk';
const ai = new YMLabAI({ apiKey: '...' });
const result = await ai.generate({ prompt: '...', model: 'ymlab-v1' });
const stream = await ai.stream({ prompt: '...' });
```

### 2.3 API SDK (`@ymlab/api-sdk`)

| 항목 | 내용 |
| :--- | :--- |
| **패키지명** | `@ymlab/api-sdk` |
| **기술** | TypeScript (자동 생성: OpenAPI Generator) |
| **포함 내용** | 모든 Platform REST API 클라이언트 |
| **배포** | npm private registry |
| **소유 팀** | Platform API Team |

**생성 방식**: OpenAPI Spec → `openapi-generator-cli` → TypeScript Client 자동 생성  
**갱신 주기**: API 버전 변경 시 자동 재생성 (CI/CD 연동)

### 2.4 Common UI Components (`@ymlab/ui-components`)

| 항목 | 내용 |
| :--- | :--- |
| **패키지명** | `@ymlab/ui-components` |
| **기술** | React + TypeScript |
| **포함 내용** | 비즈니스 도메인 공통 UI (영양 차트, 레시피 카드 등) |
| **배포** | npm private registry |
| **소유 팀** | Platform Frontend Team |

### 2.5 Shared Utilities (`@ymlab/utils`)

| 항목 | 내용 |
| :--- | :--- |
| **패키지명** | `@ymlab/utils` (Python: `ymlab-utils`) |
| **기술** | TypeScript / Python |
| **포함 내용** | 날짜, 문자열, 숫자 포맷, 에러 코드, 상수 |
| **배포** | npm + PyPI (private) |

### 2.6 Shared Domain Models (`@ymlab/models`)

| 항목 | 내용 |
| :--- | :--- |
| **패키지명** | `@ymlab/models` (Python: `ymlab-models`) |
| **기술** | TypeScript (Zod) / Python (Pydantic) |
| **포함 내용** | User, Tenant, Product, QCode, Recipe, NutritionProfile |
| **배포** | npm + PyPI (private) |

### 2.7 Shared Configuration (`@ymlab/config`)

| 항목 | 내용 |
| :--- | :--- |
| **패키지명** | `@ymlab/config` |
| **기술** | TypeScript |
| **포함 내용** | 환경별 설정 로더, Feature Flag 클라이언트, Vault 연동 헬퍼 |
| **배포** | npm private registry |

### 2.8 Shared Validation (`@ymlab/validation`)

| 항목 | 내용 |
| :--- | :--- |
| **패키지명** | `@ymlab/validation` (Python: `ymlab-validation`) |
| **기술** | TypeScript (Zod) / Python (Pydantic) |
| **포함 내용** | 이메일, 전화번호, Q-Code, 영양소 범위 등 공통 검증 스키마 |
| **배포** | npm + PyPI (private) |

---

## 3. Versioning & Release Policy

### 3.1 Semantic Versioning

모든 Shared Component 패키지는 Semantic Versioning을 따른다.

| 변경 | 버전 처리 |
| :--- | :--- |
| 신규 컴포넌트/기능 추가 | Minor 버전 업 (`1.1.0`) |
| 하위 호환 불가 변경 | Major 버전 업 (`2.0.0`) |
| 버그 수정 | Patch 버전 업 (`1.0.1`) |
| 실험적 기능 | Pre-release (`1.1.0-beta.1`) |

### 3.2 Release Cadence

| 패키지 | 릴리즈 주기 |
| :--- | :--- |
| `design-system` | 격주 (Sprint 동기화) |
| `ai-sdk` | AI Engine API 변경 시 |
| `api-sdk` | Platform API 변경 시 자동 |
| 기타 (`utils`, `models`, `validation`) | 필요 시 수시 |

---

## 4. Shared Component Governance

| 규칙 | 내용 |
| :--- | :--- |
| **단일 소유 팀** | 각 패키지에는 반드시 소유 팀이 지정됨 |
| **Breaking Change 사전 공지** | Major 버전 업 4주 전 공지 + 마이그레이션 가이드 제공 |
| **Deprecation 정책** | 구버전 6개월 병행 지원 후 삭제 |
| **외부 의존성 제한** | 공유 컴포넌트는 검증된 외부 라이브러리만 사용 (ARB 승인 필요) |
| **테스트 커버리지** | 각 패키지 단위 테스트 커버리지 ≥ 90% |
| **Storybook 필수** | `design-system`, `ui-components`는 Storybook 문서화 필수 |
| **Changelog 필수** | 모든 패키지 CHANGELOG.md 유지 |

---

## 5. Component Dependency Graph

```
@ymlab/validation ←──────────────────────────────────────────┐
@ymlab/models    ←── @ymlab/api-sdk ←── Product (Frontend)  │
@ymlab/utils     ←── @ymlab/ai-sdk  ←── Product (Frontend)  │
                  └── @ymlab/config  ←── Product (Frontend)  │
@ymlab/design-system ←── @ymlab/ui-components ←── Product   │
                                                  └──────────┘

(Backend Python)
ymlab-models ←── ymlab-ai-sdk ←── Product (Backend)
ymlab-utils  ←── ymlab-validation ←── Product (Backend)
```

**규칙**: Shared Component 간 순환 의존 절대 금지
