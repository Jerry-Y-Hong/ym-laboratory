# AI Collaboration Guide

> **Module**: 14_ai_operation_manual — Document 07  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Overview

설계(Architecture), 구현(Implementation), 검증(QA) 등의 역할을 수행하는 AI 에이전트들의 상호 작용을 통제하고, 인간 프로젝트 리더가 검수하는 **인간 중심 검증(Human-in-the-Loop, HITL)** 절차를 정의한다.

---

## 2. Practical Human-in-the-Loop Checkpoints

역할 기반 AI가 제안한 소스코드 및 설계안은 인간 프로젝트 리더에 의해 아래 3대 체크포인트를 거쳐 수동 승인되어야 한다.

```
 [AI 에이전트의 제안안 수신]
             │
             ▼
[Check 1: Architecture AI 검수] ──→ 기존 Read-Only 파일 무단 훼손이 없는가?
             │
             ▼
[Check 2: QA AI 자가 진단 검수]   ──→ 로컬 verify_*.py 실행 시 PASS가 발생하는가?
             │
             ▼
[Check 3: 최종 릴리즈 승인]       ──→ PROJECT_STATUS.md 반영 및 브랜치 병합
```

### 2.1 Checkpoint 1: 설계 및 변경 영향 검수
- **인간 프로젝트 리더 행동**: `Architecture AI` 또는 `Review AI`가 제안한 코드 수정 영역이 프로젝트의 동결(Freeze) 정책을 침해하지 않는지 눈으로 확인한다.
- **통제 규칙**: 기존 🔒 Closed 상태의 Phase 파일들을 임의로 수정하려는 제안이 감지되면 즉시 해당 제안을 기각하고, 필요시 아이디어를 `06_backlog.md`에만 등록한다.

### 2.2 Checkpoint 2: 로컬 검증 실행 검수
- **인간 프로젝트 리더 행동**: `Implementation AI`가 구현하고 `QA AI`가 교정 보조한 코드를 로컬 환경에 적용한 후, 해당 모듈의 파이썬 검증 스크립트(예: `python YM-LAB_RECOVERY/scripts/verify_blog_automation_phase01.py`)를 터미널에서 직접 실행하여 100% 정상 작동함을 검증한다.

### 2.3 Checkpoint 3: 최종 승인 및 릴리즈
- **인간 프로젝트 리더 행동**: 검증 통과 완료 시 직접 `PROJECT_STATUS.md` 파일에 새로운 태그 버전 및 진행 단계를 표기하고 Git 브랜치를 머지한다.

---

## 3. Conflict Resolution between Logic Roles (역할 간 충돌 제어)

AI 역할들이 서로 다른 구현 방향을 제시하는 등 의견 충돌이 날 경우의 해결 정책:

- **규칙 1. 검증 통과 우선 정책**: `QA AI`의 버그 분석 결과를 반영하여 로컬 검증 스크립트(`verify_*.py`)가 성공하는 코드 버전을 최종 채택한다.
- **규칙 2. 복잡성 최소화 원칙**: `Review AI`가 추가적인 복잡한 외부 프레임워크나 가상의 플랫폼 인프라 도입을 유도하는 것보다, 파이썬 표준 라이브러리만을 활용하여 작성된 가장 단순한 구현본을 채택한다.
