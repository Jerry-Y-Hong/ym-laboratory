# Product Factory Architecture

> **Module**: 18_ai_product_factory — Document 01  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Product Factory Concept & Workflow (제품 팩토리 아키텍처)

YM-LAB AI 제품 팩토리(AI Product Factory)는 신규 식품 제품군(B2C/B2B 서비스)을 개발할 때 매번 바닥부터 구현하지 않고, 표준 정의 명세서인 **블루프린트(Blueprint)**를 판독하여 표준 **제품 템플릿(Product Template)** 구조 위에 **공통 플랫폼 모듈(Common Modules)** 및 **에이전트 조립체(Agent swarm)**를 동적 결합하여 완제품 코드로 자동 빌드·패키징 및 배포하는 일관된 양산 체계 아키텍처이다.

```
       [신규 제품 블루프린트 로드] (JSON/YAML 선언)
                      │
                      ▼
[WP-01: Product Factory Engine] ──→ 03_PRODUCT_TEMPLATE 구조 복사
                      │
                      ▼
[WP-04: Module Assembly] ──→ 플랫폼 공통 모듈(@ymlab/*) 및 에이전트 결합
                      │
                      ▼
[WP-05: Product Generation] ──→ data/ 격리 런타임 및 실행기 자동 구성
                      │
                      ▼
[WP-07: Product Packaging] ──→ Manifest 발행 및 ready_to_publish/ 패킹
```

---

## 2. Platform Component Interaction (서브시스템 관계)

1. **Blueprint Loader**: 제품 구성 명세서(`blueprint.json`)를 판독하여 필요한 의존 모듈과 스케줄 정보를 파싱한다.
2. **Template Generator**: 개발 표준(Phase 15) 구조를 가진 소스코드 기본 스켈레톤 트리 구조를 디스크 샌드박스 영역에 복제한다.
3. **Module Assembler**: `04_PRODUCT_MODULE_REGISTRY`에 등록된 공유 클래스(OpenAPI 래퍼, SQLite DB 헬퍼, 로깅 등)를 연동 및 소켓 형태로 에이전트들과 주입 바인딩한다.
4. **Validation Agent Swarm**: `11_VALIDATION_REPORT` 설계에 기초하여 빌드 완료된 제품 코드 형상의 정합성과 테스트 코드를 자동 구동하고 통과 유무를 가린다.
5. **Packager & Publisher**: 최종 완성본 마크다운 문서 및 파이썬 바이너리 번들을 배포 대기 디렉터리에 아카이브 패킹한다.

---

## 3. Technology & Framework Agnostic Design (도메인/기술 독립 설계)

- **선언적 양산 (Declarative Production)**:
  - 새로운 식품 분류군(예: `smartfarm-saas` 등) 추가 시 소스코드 구조를 직접 타이핑해 짜지 않고, 블루프린트 설정 파일에 모듈 속성만 명시하여 즉각적으로 구성을 변경할 수 있어 에러율을 0%에 수렴하게 조율한다.
- **아키텍처 프레임워크 안정성 규칙**:
  - 모델 벤더사 변경이나 외부 API 포맷 변동이 있을 시 제품 팩토리 레지스트리(`04_PRODUCT_MODULE_REGISTRY`) 내부의 공통 래퍼 컴포넌트 한 곳만 수정 및 릴리즈 태깅하면, 이를 공유하는 모든 양산 제품의 코드가 형상 변경 없이 자동으로 업데이트되도록 견고하게 설계된다:
    > *The operating framework must remain stable even if AI models, tools or vendors are replaced in the future.*
- **로컬 샌드박스 보안 격리**:
  - 제품 팩토리 동작은 리포지토리의 원본 무결성 영역(`YM-LAB_RECOVERY` 대상 파일군 등)을 침범할 수 없으며 오직 `data/factory/` 디렉터리 내의 임시 격리 샌드박스 내에서만 생성 조립되도록 격리 제어된다.
Ref: [Orchestration Architecture Document](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/17_ai_agent_orchestration_system/01_ORCHESTRATION_ARCHITECTURE.md)
