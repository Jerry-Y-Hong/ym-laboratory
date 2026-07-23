# 아키텍처 변경 관리 프로세스 (Architecture Change Process)
## Version Control & Governance Guide

```
Status      : FROZEN
Version     : 1.0.0
Owner       : YM-LAB
Approved By : Architecture Review
Date        : 2026-07-20
```

---

### 1. 개요 및 거버넌스 원칙 (Architecture-Driven Rule)

본 플랫폼은 **Architecture Freeze v1.0.0**에 따라, 다음 3대 최우선 거버넌스 원칙을 적용합니다.

1. **Architecture 기준 작성 (Single Source of Truth)**:
   - Architecture Freeze 이후, 모든 **DB Schema DDL, API 구현, AI_ENGINE 모듈 및 애플리케이션 서비스 코드**는 오직 본 Architecture 명세서를 절대 기준으로 작성됩니다.
2. **구현에 의한 임의 변경 절대 금지**:
   - 코딩 및 DB 마이그레이션 도중 임의로 Architecture나 DB 구조를 수정하거나 스키마를 편법 변경하는 행위는 엄격히 금지됩니다.
3. **RFC 승격 및 ADR 기록 절차 내재화**:
   - 구조적 수정이나 기능 확장이 필요한 경우, 먼저 **6단계 RFC 절차**를 통과하여 아키텍처 문서 버전을 승격(v1.0.0 → v1.1.0 등)시키고 **ADR(Architecture Decision Record)**을 작성한 후에만 구현에 착수합니다.

---

### 2. 아키텍처 변경 6단계 프로세스

RFC(Request for Change)는 아키텍처 변경 요청을 관리하고, ADR(Architecture Decision Record)은 "왜 이러한 아키텍처를 선택했는가"에 대한 근거와 맥락을 영구 기록합니다.

```
┌─────────────────────────────────────────────────────────────┐
│ ① RFC (Request for Change) 작성                             │
│   - 변경 배경, 목적, 제안 사양 작성                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ ② 영향도 분석 (Impact Analysis)                            │
│   - DB, API, AI_ENGINE, CONTENT, PUBLISH 5개 영역 정밀 평가  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ ③ 승인 (Approval)                                           │
│   - 데이터 아키텍트 및 프로젝트 관리자 승인                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ ④ Architecture Update & Version Up (v1.0.0 → v1.1.0)        │
│   - 명세서/DDL 업데이트 및 Semantic Versioning 적용          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ ⑤ ADR (Architecture Decision Record) 작성                   │
│   - 아키텍처 채택 사유, 맥락, 트레이드오프 영구 문서화        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ ⑥ Release                                                   │
│   - DDL 마이그레이션 및 프로덕션 서비스 배포                 │
└─────────────────────────────────────────────────────────────┘
```

---

### 3. Architecture Decision Record (ADR) 관리 체계

#### 3.1 RFC vs ADR 개념 비교

| 구분 | **RFC (Request for Change)** | **ADR (Architecture Decision Record)** |
| :--- | :--- | :--- |
| **목적** | 아키텍처 변경 요청 및 영향도 평가 | 의사결정의 이유, 맥락 및 트레이드오프 영구 기록 |
| **성격** | 변경 절차용 작업 문서 | 프로젝트 생애주기 동안 유지되는 영구 보존 기록 |
| **독립성** | 버전 변경 시 완결 처리 | 아키텍처 버전과 독립적으로 이력 누적 관리 |

#### 3.2 ADR 표준 템플릿 양식

```markdown
# ADR-0000: [의사결정 제목]

## Title
[ADR의 명확하고 간결한 제목]

## Status
Proposed | Accepted | Deprecated | Superseded by [ADR-XXXX]

## Context
- 기술적/비즈니스적 배경 및 해결하고자 한 문제
- 고려해야 했던 제약 조건

## Decision
- 최종 채택한 아키텍처 구조 및 설계 결정 사항

## Consequences
- **Positive Impact**: 채택으로 얻는 이점 및 이득
- **Negative Impact / Trade-offs**: 발생할 수 있는 부작용, 비용 또는 한계점

## Alternatives Considered
- 검토했으나 채택하지 않은 대안들과 거절 사유

## Reference RFC
- 관련 RFC 번호 (e.g., RFC-20260720-01)
```

#### 3.3 v1.0.0 Baseline ADR 초기 등록 이력 (Initial ADR Register)

| ADR ID | Decision Title (의사결정 제목) | Status | Key Context & Rationale Summary |
| :--- | :--- | :--- | :--- |
| **ADR-0001** | MASTER와 CONTENT를 분리한 이유 | **Accepted** | SSOT 순수성 보장 및 수천 개의 가변 콘텐츠 재생성 가능 구조 확립 |
| **ADR-0002** | I18N (다국어) 분리 테이블 채택 이유 | **Accepted** | 100개국 수평 확장을 위해 컬럼 폭발 방지 및 스키마 변경 없는 다국어 지원 |
| **ADR-0003** | AI_ENGINE Configuration Layer 도입 이유 | **Accepted** | AI 생성 규칙과 실제 실행 엔진을 분리하여 논리적 설정 유연성 확보 |
| **ADR-0004** | LLM Provider Independence 채택 이유 | **Accepted** | OpenAI, Claude, Gemini 등 특정 모델 종속성 제거 및 Pluggable LLM 교체 보장 |
| **ADR-0005** | Explicit Junction Table 채택 이유 | **Accepted** | Generic Polymorphic 참조의 RDBMS 외래키(FK) 손실 방지 및 정합성 보장 |
| **ADR-0006** | Publishing Queue 도입 이유 | **Accepted** | 멀티채널 배포 시 비동기 디스패치, Rate Limiting, 예약 발행 및 장애 재시도(Retry) 전담 |

---

### 4. 세부 단계별 수행 가이드

#### ① RFC (Request for Change) 작성
- 변경을 요청하는 이유, 목적, 구현하려는 신규 테이블/필드/파이프라인 변경 사양을 서식에 맞게 문서화합니다.

#### ② 5대 영역 영향도 분석 (Impact Analysis)
변경 사항이 전체 플랫폼에 미치는 파급 효과를 아래 5가지 영역으로 나누어 검토합니다:
1. **DB**: DDL 스키마, Index, Foreign Key, 데이터 마이그레이션 소요 여부
2. **API**: REST/GraphQL 엔드포인트 파괴적 변경(Breaking Change) 여부
3. **AI_ENGINE**: Configuration Layer, Execution Layer, LLM Provider 영향
4. **CONTENT**: 기존 생성된 콘텐츠 정합성 및 재생성 영향
5. **PUBLISH**: Publishing Queue, Publisher Adapter, Target Platform 영향

#### ③ 승인 (Approval)
- 영향도 분석 결과 데이터 정합성(SSOT)과 가동성에 문제가 없음이 확인되면 아키텍트의 승인을 득합니다.

#### ④ Version Up & Architecture Update
- **Minor Change (v1.0.0 → v1.1.0)**: 하위 호환 가능한 필드 추가, 인덱스 조정, 템플릿 규칙 개편.
- **Major Change (v1.0.0 → v2.0.0)**: 하위 호환 불가 파괴적 DDL 개편, 데이터 구조 재설계.

#### ⑤ ADR 작성 및 Change Log 기록
- 아키텍처 결정 배경을 ADR 서식에 작성하여 등록하고, `ARCHITECTURE.md` 및 `DDL.sql` 상단의 Version History 및 Change Log 테이블을 업데이트합니다.

#### ⑥ Release
- 최종 승인된 변경 사양을 프로덕션 DB 마이그레이션 및 파이프라인에 배포합니다.

---

### 5. 표준 RFC 템플릿 양식

```markdown
# [RFC-YYYYMMDD-01] 변경 요청서 제목

## 1. Request Overview
- **요청자**: 
- **요청 일자**: YYYY-MM-DD
- **목표 버전**: v1.0.0 → v1.1.0 (예시)

## 2. Proposed Changes (변경 제안 내용)
- 

## 3. Impact Analysis (5대 영역 영향도 평가)
- **DB**: 
- **API**: 
- **AI_ENGINE**: 
- **CONTENT**: 
- **PUBLISH**: 

## 4. Approval Status
- [ ] Approved by Lead Data Architect
- [ ] Approved by AI Engine Lead

## 5. Change Log & Release Plan
- **Change Log Description**: 
- **Target Release Date**: YYYY-MM-DD
```
