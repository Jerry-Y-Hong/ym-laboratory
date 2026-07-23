# Code Review Standards

> **Module**: 12_governance — Governance Domain 04  
> **Version**: `v1.0`  
> **Status**: ACTIVE  

---

## 1. Purpose

YM-LAB PROJECT의 모든 코드 변경 사항에 대한 리뷰 기준, 절차 및 품질 게이트를 정의한다.

---

## 2. Review Ownership

| 역할 | 책임 |
| :--- | :--- |
| **Author** | PR 작성, 자기 검토 후 리뷰어 지정 |
| **Reviewer 1** | 도메인 전문가 (기능/API 로직 검토) |
| **Reviewer 2** | 보안/인프라 담당자 (보안 및 성능 검토) |
| **Tech Lead** | 아키텍처 적합성 최종 승인 |

---

## 3. PR (Pull Request) 기준

### 3.1 PR 생성 요건

- **타이틀 형식**: `[TYPE] [SCOPE] : 변경 요약` (예: `[FEAT] [AI-ENGINE] : Q-Code RAG 파이프라인 초기 구현`)
- **TYPE 코드**:

| Code | Meaning |
| :--- | :--- |
| FEAT | 신규 기능 |
| FIX | 버그 수정 |
| REFACTOR | 리팩토링 (동작 변경 없음) |
| TEST | 테스트 추가/수정 |
| DOCS | 문서 작업 |
| INFRA | 인프라/IaC 변경 |
| HOTFIX | 긴급 수정 |
| CHORE | 빌드/설정 변경 |

### 3.2 PR 최소 포함 사항

- [ ] 변경 목적 및 배경 설명
- [ ] 관련 User Story / Issue 번호 링크
- [ ] 테스트 방법 및 결과 스크린샷(선택)
- [ ] Breaking Change 여부 명시
- [ ] 체크리스트 (DoD 기준 자기 점검)

---

## 4. Review Checklist

### 4.1 공통 검토 항목

- [ ] 요구사항과의 일치 여부
- [ ] 코딩 컨벤션 준수 (PEP8, ESLint)
- [ ] 명명 규칙 일관성
- [ ] 주석 및 문서화 적정성
- [ ] 중복 코드 제거 (DRY 원칙)
- [ ] 에러 핸들링 완전성

### 4.2 보안 검토 항목

- [ ] SQL Injection, XSS, CSRF 방어 확인
- [ ] 비밀키/자격증명 하드코딩 없음
- [ ] 인증/인가 로직 검증
- [ ] 입력값 검증 및 Sanitization

### 4.3 성능 검토 항목

- [ ] N+1 쿼리 없음
- [ ] 캐시 전략 적절성
- [ ] 비동기 처리 적합성
- [ ] 데이터베이스 인덱스 활용 여부

---

## 5. Review SLA

| 우선순위 | 리뷰 완료 목표 시간 |
| :--- | :--- |
| HOTFIX | 4시간 이내 |
| Sprint Critical | 24시간 이내 |
| 일반 FEAT/FIX | 48시간 이내 |
| DOCS/CHORE | 72시간 이내 |

---

## 6. Merge Policy

| 브랜치 | Merge 조건 |
| :--- | :--- |
| `main` ← `release/*` | CTO 승인 + 전체 CI PASS + QA 확인 |
| `develop` ← `feature/*` | Reviewer 2인 Approve + CI PASS |
| `hotfix/*` ← `main` | Tech Lead 승인 + 최소 1인 Approve |

---

## 7. Automated Gates (CI Blocking)

PR 머지를 위해 모든 Gate를 통과해야 한다.

```
[Gate 1] Lint & Format Check (Black, ESLint)
[Gate 2] Unit Test Suite (pytest / Jest) — 커버리지 ≥ 80%
[Gate 3] Security Scan (Trivy, OWASP ZAP)
[Gate 4] Build Check (Docker Build, Next.js Build)
[Gate 5] Integration Test (Staging ENV)
```
