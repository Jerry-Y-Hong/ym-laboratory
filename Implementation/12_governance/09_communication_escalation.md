# Communication & Escalation Protocol

> **Module**: 12_governance — Governance Domain 09  
> **Version**: `v1.0`  
> **Status**: ACTIVE  

---

## 1. Purpose

YM-LAB PROJECT 개발 팀의 소통 채널, 회의 구조, 보고 체계 및 이슈 에스컬레이션 절차를 정의한다.

---

## 2. Communication Channels

| 채널 | 플랫폼 | 용도 | SLA |
| :--- | :--- | :--- | :--- |
| **일반 소통** | Slack / Teams | 일상 개발 토론, 질문 | 업무시간 내 4시간 |
| **코드 리뷰** | GitHub PR | 코드 변경 검토 | 48시간 이내 |
| **이슈 트래킹** | GitHub Issues / Jira | 버그, 기능 요청 | 분류 24시간 이내 |
| **아키텍처 논의** | ARB 회의 | 설계 결정, ADR | 주 1회 정기 |
| **긴급 상황** | 전화 / PagerDuty | P0/P1 장애 | 즉시 |

---

## 3. Meeting Structure

| 회의 | 주기 | 참석자 | 목적 |
| :--- | :--- | :--- | :--- |
| **Daily Standup** | 매일 09:00 KST | 개발팀 전원 | 진행 현황, 블로커 공유 |
| **Sprint Planning** | Sprint 시작일 | 개발팀 + PO | Sprint 목표 및 태스크 배분 |
| **Sprint Review** | Sprint 마지막일 | 개발팀 + 이해관계자 | 데모, 결과 리뷰 |
| **Retrospective** | Sprint 마지막일 | 개발팀 | 개선점 도출 |
| **ARB Meeting** | 주 1회 (수) | ARB 멤버 | 아키텍처 검토, ADR 결정 |
| **Security Review** | 월 1회 | 보안팀 + Tech Lead | 보안 상태 점검 |
| **Stakeholder Report** | 월 1회 | CTO + 이해관계자 | 진척 현황 보고 |

---

## 4. Issue Escalation Matrix

| 이슈 유형 | Level 1 | Level 2 | Level 3 |
| :--- | :--- | :--- | :--- |
| 기술적 블로커 | 팀 리더 | Tech Lead | CTO |
| P0/P1 장애 | On-Call 엔지니어 | Engineering Lead | CTO |
| 보안 인시던트 | 보안 담당자 | CISO | CEO |
| 아키텍처 충돌 | ARB | CTO | CEO |
| 일정 지연 (> 20%) | Sprint Master | PO | CTO |
| 예산 초과 (> 10%) | 팀 리더 | 프로젝트 관리자 | CFO |

---

## 5. Escalation SLA

| 이슈 등급 | Level 1 응답 | Level 2 에스컬레이션 | Level 3 에스컬레이션 |
| :--- | :--- | :--- | :--- |
| **P0 장애** | 즉시 | 30분 내 | 1시간 내 |
| **P1 장애** | 1시간 내 | 4시간 내 | 8시간 내 |
| **기술 블로커** | 4시간 내 | 다음 날 | Sprint 내 |
| **일반 이슈** | 24시간 내 | 72시간 내 | 주간 리뷰 |

---

## 6. Status Reporting

### 주간 상태 보고 (매주 금요일)

- **포맷**: 표준 Status Report 템플릿
- **내용**: Sprint 진척율, 완료 태스크, 이슈/리스크, 다음 주 계획
- **배포**: Slack #status-update + 이해관계자 이메일

### 월간 경영 보고 (매월 마지막 주)

- **포맷**: Executive Summary (1페이지)
- **내용**: 주요 마일스톤 달성, KPI, 예산 현황, 리스크

---

## 7. On-Call Policy

| 항목 | 기준 |
| :--- | :--- |
| On-Call 주기 | 주간 순환 (월~일) |
| 응답 시간 | P0: 15분 / P1: 30분 |
| 보상 | On-Call 수당 지급 (사내 정책 준수) |
| 핸드오버 | 매주 월요일 09:00 인수인계 회의 |
