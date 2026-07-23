# AI Role Definition

> **Module**: 14_ai_operation_manual — Document 03  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Overview

YM-LAB PROJECT의 지휘를 담당하는 인간 프로젝트 리더(Human Project Lead)와 확장 가능한 **핵심 AI 역할(Core Roles)**의 명확한 R&R(Roles and Responsibilities)을 명세한다.

---

## 2. Human Project Lead

- **역할**: 프로젝트 리더 및 최종 의사결정권자.
- **책임**: 비즈니스 목표 설정, 아키텍처 동결(Freeze) 보호 및 최종 코드 릴리즈 승인.
- **핵심 행동**:
  - AI 역할군이 산출한 코드와 문서의 타당성 및 규칙 준수 여부 최종 승인.
  - 로컬 환경에서 테스트 케이스 정의 및 테스트 실행.
- **최종 결정권**: AI의 모든 가이드라인 및 코드 제안에 대한 거부 및 재수정 요구권 보유.

---

## 3. Core Roles (Expandable)

> **Assignment Rule**:  
> Any LLM or AI Agent can be assigned to any role according to capability, availability and project requirements.

### 3.1 Architecture AI (아키텍처 설계 비서)
- **책임**: 모듈 구조 및 의존성 관계 설계 보조.
- **산출물**: 파일 레이아웃 제안, DDL 설계 초안, ADR 명세.

### 3.2 Implementation AI (코드 구현 비서)
- **책임**: 설계 규격에 부합하는 기능 코드 및 단위 테스트 스위트 작성 보조.
- **산출물**: Python 기능 함수, pytest 단위 테스트 코드.

### 3.3 Review AI (거버넌스 리뷰 비서)
- **책임**: 코딩 규칙 및 아키텍처 동결 준수 검토 보조.
- **산출물**: 소스코드 스타일 피드백 코멘트, 의존성 관계 적합성 검사 의견.

### 3.4 QA AI (품질 검증 비서)
- **책임**: 로컬 검증 실패 원인 파악 및 디버깅 보조.
- **산출물**: 디버깅 로그 분석 보고서, 자가 치유(Self-Healing) 방안.

### 3.5 Documentation AI (산출물 문서화 비서)
- **책임**: 산출물 문서들의 가독성, 추적성 및 포맷 완성도 제어 보조.
- **산출물**: 요구사항 명세서, README 파일, 완료 마스터 보고서.

### 3.6 Future Extension Roles (확장 역할 예시)
- **Research AI**: 약선 도메인 및 문헌 자료 분석 R&R.
- **Automation AI**: 파이프라인 데이터 검증 및 모니터링 R&R.
- **Security AI**: 소스코드 정적 분석 및 보안 취약점 식별 R&R.
- **Testing AI**: 통합 테스트 및 부하 시나리오 수립 R&R.
- **Translation AI**: 번역 자산 다국어 교차 대조 R&R.

---

## 4. Escalation Rules

역할 수행 중 오류가 발생할 경우의 대처 정책은 다음과 같다.

1. **Implementation AI 기능 에러 발생 시**:
   - 1차: 개발자가 에러 로그를 QA AI 역할에 주입하여 원인 분석 및 자가 수정(Self-Fix) 시도.
   - 2차: 자가 수정이 연속 3회 이상 실패할 경우, AI 사용을 일시 중단하고 인간 프로젝트 리더가 직접 코드를 디버깅하여 수동 수정.
2. **Review AI의 아키텍처 위반 경고 발생 시**:
   - 즉시 구현 작업을 일시 중단하고, 변경 사항이 동결 아키텍처에 위배될 경우 해당 변경 제안을 기각하고 `06_backlog.md`에만 백로그로 기록한다.
