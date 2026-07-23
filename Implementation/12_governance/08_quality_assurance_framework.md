# Quality Assurance Framework

> **Module**: 12_governance — Governance Domain 08  
> **Version**: `v1.0`  
> **Status**: ACTIVE  

---

## 1. Purpose

YM-LAB PROJECT의 전체 품질 보증(QA) 체계를 정의하여, 제품의 기능, 성능, 보안 품질을 Sprint → RC → Production 전 단계에서 체계적으로 검증한다.

---

## 2. QA Strategy (테스트 피라미드)

```
         /\
        /  \  E2E Tests (10%)
       /----\  ← Playwright / Cypress
      /      \
     / Integ  \ Integration Tests (30%)
    /  Tests   \ ← Pytest / Jest
   /------------\
  /  Unit Tests  \ Unit Tests (60%)
 /________________\ ← Pytest / Jest / Vitest
```

---

## 3. Test Coverage Requirements

| 계층 | 최소 커버리지 | 도구 |
| :--- | :--- | :--- |
| 단위 테스트 | ≥ 80% | Pytest (Python), Jest (TypeScript) |
| 통합 테스트 | 주요 API 엔드포인트 100% | Pytest + HTTPx |
| E2E 테스트 | 핵심 사용자 플로우 100% | Playwright |
| 성능 테스트 | 주요 엔드포인트 Load Test | k6 |
| 보안 테스트 | OWASP Top 10 전항목 | OWASP ZAP |

---

## 4. Test Environments

| 환경 | 목적 | 테스트 유형 |
| :--- | :--- | :--- |
| **Local** | 개발자 자체 검증 | 단위 테스트 |
| **CI** | PR 단위 자동화 | 단위 + 통합 테스트 |
| **Staging** | RC 검증 | 통합 + E2E + 성능 + 보안 |
| **Production** | 운영 모니터링 | Smoke Test + Canary |

---

## 5. Performance Requirements

| 지표 | 기준 | 측정 방법 |
| :--- | :--- | :--- |
| API Response Time (P50) | < 100ms | k6 / Prometheus |
| API Response Time (P95) | < 200ms | k6 / Prometheus |
| API Response Time (P99) | < 500ms | k6 / Prometheus |
| Throughput | > 1,000 RPS (목표) | k6 |
| Error Rate | < 0.1% | Prometheus |
| AI RAG 응답 | < 3초 (P95) | Custom Metric |

---

## 6. Sprint QA Gate

각 Sprint 완료 전 QA Gate를 통과해야 한다.

| Sprint | QA Gate 항목 |
| :--- | :--- |
| Sprint 1 | DB DDL 마이그레이션 PASS, 스키마 Lint PASS |
| Sprint 2 | API 단위/통합 테스트 PASS, AI 에이전트 응답 검증 |
| Sprint 3 | Web UI E2E PASS, OAuth2 인증 플로우 PASS |
| Sprint 4 | SDK 빌드 PASS, 파트너 API 통합 테스트 PASS |
| Sprint 5 | CI/CD 파이프라인 전체 PASS, IaC Linting PASS |
| Sprint 6 | Full Regression PASS, SLA 관찰 72시간 PASS, DRP 시뮬레이션 PASS |

---

## 7. Bug Severity Classification

| 등급 | 정의 | 해결 기한 |
| :--- | :--- | :--- |
| **P0 (Blocker)** | 서비스 전체 다운, 데이터 손실 | 4시간 이내 |
| **P1 (Critical)** | 핵심 기능 불가, 다수 사용자 영향 | 24시간 이내 |
| **P2 (Major)** | 기능 일부 불가, 우회 가능 | Sprint 내 |
| **P3 (Minor)** | UI 오류, 경미한 오작동 | 다음 Sprint |
| **P4 (Trivial)** | 철자 오류, 스타일 이슈 | 백로그 관리 |

---

## 8. QA Documentation Requirements

- 각 Sprint 완료 시 **Test Execution Report** 작성
- RC 단계 **QA Sign-Off Sheet** 작성 (QA Lead 서명)
- P0/P1 버그 해결 시 **Root Cause Analysis (RCA)** 작성
- Production 배포 후 24시간 **Post-Deployment Report** 작성
