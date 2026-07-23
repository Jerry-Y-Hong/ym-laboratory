# Blog Automation System — Phase 01 Requirements

> **System**: Blog Automation System  
> **Phase**: 01 — Kimchi Blog Automation  
> **Version**: `v1.0`  
> **Status**: ACTIVE  
> **Baseline**: Platform Architecture (13_platform_architecture) + Phase 08 Blog Rules  

---

## 1. Mission

사람이 직접 글을 작성하지 않아도 **김치 블로그를 자동 운영**할 수 있는 기반 시스템을 구축한다.

Phase 01 범위는 **김치 도메인**에 한정된다. 다른 도메인은 현재 Phase에서 구현하지 않는다.

---

## 2. Functional Requirements

### FR-01: 콘텐츠 자동 생성

| ID | 요구사항 | 우선순위 |
| :--- | :--- | :--- |
| FR-01-1 | 김치 재료·레시피·영양 정보를 기반으로 블로그 포스트 초안을 자동 생성한다 | MUST |
| FR-01-2 | 포스트 구조: Title(H1) → Executive Summary → Main Body(H2/H3) → Q-Code 영양 테이블 → CTA Footer | MUST |
| FR-01-3 | 생성된 포스트는 Markdown 형식으로 저장한다 | MUST |
| FR-01-4 | 각 포스트는 고유 ID(UUID)와 생성 타임스탬프를 포함한다 | MUST |

### FR-02: SEO 최적화

| ID | 요구사항 | 우선순위 |
| :--- | :--- | :--- |
| FR-02-1 | 타겟 키워드 밀도를 1.5% 내외로 유지한다 | MUST |
| FR-02-2 | 메타 타이틀(60자 이내), 메타 디스크립션(160자 이내)을 자동 생성한다 | MUST |
| FR-02-3 | SEO 점수(0~100)를 산출하고 70점 이상만 발행 대기열에 등록한다 | MUST |
| FR-02-4 | 내부 링크(이미 발행된 관련 포스트) 자동 삽입 제안을 제공한다 | SHOULD |

### FR-03: 자동 발행 스케줄링

| ID | 요구사항 | 우선순위 |
| :--- | :--- | :--- |
| FR-03-1 | 일 2회(09:00 KST, 20:00 KST) 포스트를 자동 발행 대기열에 등록한다 | MUST |
| FR-03-2 | 발행 큐는 FIFO 순서로 처리한다 | MUST |
| FR-03-3 | 발행 실패 시 최대 3회 재시도 후 알림을 기록한다 | MUST |
| FR-03-4 | 스케줄 실행 이력을 JSON 파일로 저장한다 | MUST |

### FR-04: 포스트 저장소

| ID | 요구사항 | 우선순위 |
| :--- | :--- | :--- |
| FR-04-1 | 포스트를 DRAFT / QUEUED / PUBLISHED / FAILED 상태로 관리한다 | MUST |
| FR-04-2 | 포스트를 JSON 파일 기반 로컬 저장소에 저장한다 (DB 없이 동작) | MUST |
| FR-04-3 | 포스트 목록을 날짜·상태·카테고리 기준으로 조회할 수 있다 | MUST |
| FR-04-4 | 동일 food_code에 대한 중복 포스트 생성을 방지한다 | MUST |

---

## 3. Non-Functional Requirements

| ID | 요구사항 |
| :--- | :--- |
| NFR-01 | 외부 API(LLM, 블로그 플랫폼) 없이 독립적으로 동작 가능해야 한다 (Mock 모드 지원) |
| NFR-02 | 모든 모듈은 단독으로 import·실행 가능해야 한다 |
| NFR-03 | 모든 실행 결과는 로그 파일에 기록한다 |
| NFR-04 | Python 3.10+ 호환 |
| NFR-05 | 외부 라이브러리 의존은 최소화한다 (표준 라이브러리 우선) |

---

## 4. Scope Boundary

### In Scope (현재 Phase)
- 김치 도메인 블로그 콘텐츠 자동 생성
- SEO 최적화 엔진
- 포스트 포맷터 (Markdown)
- 자동 발행 스케줄러 (로컬 실행)
- 포스트 파일 기반 저장소

### Out of Scope (Backlog)
- 실제 블로그 플랫폼(WordPress, Naver Blog 등) 연동 → `06_backlog.md` 등록
- 이미지 자동 생성 → `06_backlog.md` 등록
- 댓글 자동 관리 → `06_backlog.md` 등록
- 다국어(한국어 외) 포스트 생성 → `06_backlog.md` 등록
- 김치 외 다른 도메인 → `06_backlog.md` 등록

---

## 5. Platform Architecture 연계

Platform Architecture (`13_platform_architecture`)에서 다음 서비스 인터페이스를 준수한다.

| Platform 서비스 | 연계 방식 |
| :--- | :--- |
| AI Engine | Mock 인터페이스(`130_AI_ENGINE/interface.py`) 사용. 실제 연동은 Post-MVP |
| Scheduler | 로컬 APScheduler 사용. Platform Scheduler 연동은 Post-MVP |
| File Storage | 로컬 JSON 파일 사용. Platform Storage 연동은 Post-MVP |
| Logging | `150_SHARED/logger.py` 표준 로거 사용 |

---

## 6. Data Sources

| 소스 | 설명 |
| :--- | :--- |
| `01_PHASE1_KIMCHI/01_KIMCHI_MASTER/` | 김치 종류별 마스터 데이터 |
| `01_PHASE1_KIMCHI/03_INGREDIENT_MASTER/` | 재료 마스터 |
| `01_PHASE1_KIMCHI/04_RECIPE_MASTER/` | 레시피 마스터 |
| `100_PLATFORM/140_AUTOMATION/` | 자동화 파이프라인 기반 컴포넌트 |
