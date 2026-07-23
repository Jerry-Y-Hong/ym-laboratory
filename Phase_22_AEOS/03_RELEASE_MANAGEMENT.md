# 03_RELEASE_MANAGEMENT.md

## Overview
AEOS의 릴리즈 관리 정책과 절차를 정의한다. 릴리즈는 **계획 → 빌드 → 검증 → 배포 → 검증** 5단계로 진행되며, 각 단계는 ADF v2.0의 **Release Automation** 가이드와 일치한다.

## Release Policy
- **버전 체계**: `v<major>.<minor>.<patch>` (예: `v3.0.0`)
- **승인 권한**: `Release Manager`와 `Architect Agent`가 최종 승인.
- **배포 대상**: `Production`, `Staging`, `Development` 환경별 배포 전략 정의.

## Release Process Steps
1. **Planning** – Release Scope 정의, Impact 분석.
2. **Build** – CI 파이프라인을 통해 아티팩트 생성.
3. **Verification** – 자동 테스트(Phase 22 Deliverable)와 수동 검증.
4. **Deployment** – `11_POLICY_ENGINE.md`와 연계된 정책에 따라 배포.
5. **Post‑Deployment Validation** – 모니터링 지표 검증 후 `12_MASTER_REPORT.md`에 기록.

## References
- 09_RELEASE_AUTOMATION.md (Phase 21) – 기존 릴리즈 자동화 흐름
- 10_AI_OPERATION_AGENT.md (Phase 22) – 배포 자동화 에이전트 연계
- 11_POLICY_ENGINE.md (Phase 22) – 정책 적용 검증

*본문 내에서도 필요 시 다른 Deliverable을 교차 참조한다.*
