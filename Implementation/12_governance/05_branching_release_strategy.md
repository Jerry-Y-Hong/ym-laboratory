# Branching & Release Strategy

> **Module**: 12_governance — Governance Domain 05  
> **Version**: `v1.0`  
> **Status**: ACTIVE  

---

## 1. Purpose

YM-LAB PROJECT의 Git 브랜치 전략과 릴리즈 프로세스를 정의하여, 개발 → Staging → Production 전환을 안전하게 관리한다.

---

## 2. Branch Strategy (GitFlow 기반)

```
main                ← Production 배포 브랜치 (태그 기반 릴리즈)
  ├── release/v*    ← 릴리즈 준비 브랜치 (RC 테스트)
  ├── hotfix/*      ← 긴급 수정 브랜치
develop             ← 통합 개발 브랜치 (Sprint 베이스)
  ├── feature/*     ← 기능 개발 브랜치
  ├── bugfix/*      ← 버그 수정 브랜치
  └── refactor/*    ← 리팩토링 브랜치
```

---

## 3. Branch Naming Convention

| 브랜치 유형 | 형식 | 예시 |
| :--- | :--- | :--- |
| Feature | `feature/[sprint]-[US-ID]-[short-desc]` | `feature/s2-US001-qcode-rag` |
| Bugfix | `bugfix/[issue-id]-[short-desc]` | `bugfix/123-auth-token-expire` |
| Release | `release/v[MAJOR].[MINOR].[PATCH]` | `release/v1.0.0-rc1` |
| Hotfix | `hotfix/[CVE-or-issue]-[short-desc]` | `hotfix/CVE-2026-001-xss-fix` |
| Refactor | `refactor/[module]-[short-desc]` | `refactor/ai-engine-rag-pipeline` |

---

## 4. Sprint-to-Branch Lifecycle

| Sprint | Feature Branch Base | Merge Target | RC Branch |
| :--- | :--- | :--- | :--- |
| Sprint 1 | `feature/s1-*` | `develop` | `release/v0.1.0-rc1` |
| Sprint 2 | `feature/s2-*` | `develop` | `release/v0.2.0-rc1` |
| Sprint 3 | `feature/s3-*` | `develop` | `release/v0.3.0-rc1` |
| Sprint 4 | `feature/s4-*` | `develop` | `release/v0.4.0-rc1` |
| Sprint 5 | `feature/s5-*` | `develop` | `release/v0.5.0-rc1` |
| Sprint 6 | `feature/s6-*` | `develop` | `release/v1.0.0` |

---

## 5. Versioning (Semantic Versioning)

형식: `MAJOR.MINOR.PATCH[-PRE]`

| 구분 | 증가 조건 | 예시 |
| :--- | :--- | :--- |
| MAJOR | 하위 호환 불가 API 변경, 아키텍처 재설계 | `2.0.0` |
| MINOR | 신규 기능 추가 (하위 호환 유지) | `1.1.0` |
| PATCH | 버그 수정, 보안 패치 | `1.0.1` |
| PRE | 릴리즈 후보 | `1.0.0-rc1` |

---

## 6. Release Process

```
Step 1: develop 브랜치 freeze → release/vX.Y.Z 브랜치 분기
Step 2: QA 팀 RC 테스트 (Staging 72시간 관찰)
Step 3: 발견 버그 → bugfix/* → release/vX.Y.Z 병합
Step 4: Release Notes 작성 (CHANGELOG.md 업데이트)
Step 5: Tech Lead + CTO Approve → main 머지
Step 6: Git Tag 부여 (vX.Y.Z)
Step 7: Blue-Green 배포 실행
Step 8: Monitoring 24시간 관찰 → 완료 선언
```

---

## 7. Tag Policy

| 태그 유형 | 형식 | 용도 |
| :--- | :--- | :--- |
| Release | `vX.Y.Z` | Production 릴리즈 |
| RC | `vX.Y.Z-rcN` | 릴리즈 후보 |
| Hotfix | `vX.Y.Z-hotfix-N` | 긴급 패치 |
| Phase | `Phase-NN-Closed` | Phase 완료 고정 태그 |

---

## 8. Protected Branches

| 브랜치 | 보호 설정 |
| :--- | :--- |
| `main` | Force Push 금지, Linear History 강제, 리뷰 2인 + CI 통과 필수 |
| `develop` | Force Push 금지, CI 통과 필수 |
| `release/*` | CTO Approve 필수 |
