# Definition of Done (DoD)

> **Module**: 12_governance — Governance Domain 02  
> **Version**: `v1.0`  
> **Status**: ACTIVE  
> **Authority**: Engineering Lead

---

## 1. Purpose

모든 개발 산출물의 완료(Done) 기준을 명확히 정의하여, 품질 일관성과 릴리즈 신뢰성을 보장한다.

---

## 2. DoD by Artifact Type

### 2.1 Feature (기능 개발)

- [ ] 기능 요구사항 100% 구현
- [ ] 단위 테스트 작성 완료 (커버리지 ≥ 80%)
- [ ] 통합 테스트 통과
- [ ] 코드 리뷰 최소 2인 Approve
- [ ] 린트/포맷 검사 통과 (Black, ESLint)
- [ ] API 문서 업데이트 (Swagger/OpenAPI)
- [ ] 성능 기준 충족 (API Latency < 200ms P95)
- [ ] 보안 취약점 스캔 PASS (Trivy / OWASP ZAP)
- [ ] PR 머지 → `develop` 브랜치

### 2.2 Database Schema (DB 스키마)

- [ ] DDL 스크립트 작성 및 마이그레이션 스크립트 포함
- [ ] 롤백 스크립트(`down.sql`) 동반 제출
- [ ] 스키마 리뷰 완료 (DBA 또는 Tech Lead 1인)
- [ ] Staging DB 마이그레이션 테스트 PASS
- [ ] ERD 또는 Graph Schema 다이어그램 업데이트

### 2.3 API Endpoint (API 엔드포인트)

- [ ] OpenAPI Spec 작성 완료
- [ ] 인증/인가 로직 구현 (OAuth2 / JWT)
- [ ] Rate Limit 및 Error Response 표준화 적용
- [ ] API 통합 테스트 PASS (Pytest / Jest)
- [ ] API 변경 사항 Changelog 업데이트

### 2.4 Frontend Component (프론트엔드)

- [ ] 컴포넌트 Storybook 등록
- [ ] 크로스 브라우저 호환성 검증 (Chrome, Firefox, Safari)
- [ ] 반응형 디자인 검증 (Mobile / Tablet / Desktop)
- [ ] 접근성 기준 충족 (WCAG 2.1 AA)
- [ ] E2E 테스트 PASS (Playwright)

### 2.5 Infrastructure / IaC (인프라)

- [ ] Terraform Plan 검토 완료
- [ ] Staging 환경 적용 및 검증 완료
- [ ] 보안 그룹 / 네트워크 정책 검토
- [ ] 비용 추정 업데이트
- [ ] Runbook 업데이트

### 2.6 Sprint Completion (스프린트 완료)

- [ ] 스프린트 내 모든 User Story Done 기준 충족
- [ ] 회귀 테스트 전체 PASS
- [ ] Staging 환경 배포 완료
- [ ] Sprint Review 수행 완료
- [ ] Sprint Retrospective 수행 완료

---

## 3. Release DoD (릴리즈 완료 기준)

| 항목 | 기준 |
| :--- | :--- |
| 테스트 커버리지 | 전체 ≥ 80% |
| CI/CD 파이프라인 | 전체 PASS |
| 보안 취약점 | 고/중 등급 0건 |
| SLA 충족 | 가용성 99.99% (Staging 72시간 관찰) |
| DRP 검증 | Failover 시나리오 PASS |
| 문서 동기화 | API Docs, Architecture Docs 최신화 완료 |
| Recovery Baseline | SHA-256 갱신 완료 |

---

## 4. DoD 거부 기준 (Not Done)

다음 조건 중 하나라도 해당되면 Done으로 인정하지 않는다.

- 테스트 미작성 또는 커버리지 미달
- 코드 리뷰 미수행
- 보안 스캔 미통과
- API 문서 미업데이트
- 성능 기준 미달 (P95 > 200ms)
