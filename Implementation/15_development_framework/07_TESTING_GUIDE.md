# Testing Guide

> **Module**: 15_development_framework — Document 07  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Local Testing Procedures

YM-LAB PROJECT는 현재 **설계 단계에서 구현 시작 단계**로 전환 중이므로, 엄격한 커버리지 수치 강제(예: Coverage 70% 등) 대신 핵심적인 3대 테스트 계층(Unit Test, Integration Test, Verification Script)을 중심으로 정합성을 검증한다.

### 1.1 Unit Test (단위 테스트)
- **목적**: 개별 비즈니스 로직 함수, 데이터 가공 모듈의 기초 동작 검증.
- **방식**: 로컬 pytest 등을 활용하여 독립된 입력값에 대한 출력값을 검사한다.
- **격리**: 외부 API 연동 부는 Mocking 처리하여 순수 로컬 로직만 독립 검증한다.

### 1.2 Integration Test (통합 테스트)
- **목적**: 데이터베이스(catalog.db) 조회 및 로컬 JSON 데이터 원장 간의 상호작용 흐름 검증.
- **방식**: 실제 파일 I/O를 발생시켜 모듈 간 연계가 정상적으로 수행되는지 검사한다.

### 1.3 Verification Script (검증 스크립트)
- **목적**: 각 Phase의 산출물 전체가 사전에 합의된 요구사항 명세 및 아키텍처/거버넌스 규칙에 부합하는지 종합적으로 검사한다.
- **주기**: 로컬에서 변경된 코드를 Git에 커밋하기 전 필수로 실행한다.
- **합격 요건**: 단 하나의 오류도 없이 100% `PASS`를 만족해야 한다.

---

## 2. QA Checkpoints for New Implementations

신규 개발본에 대한 QA 4대 체크포인트:

```
[개발 완료 및 검증 시작]
          │
          ├──→ [Check 1: 코드 정적 검토] ──→ 코딩 표준 및 동결 파일 무단 수정 유무 확인
          │
          ├──→ [Check 2: Unit Test]       ──→ 로컬 단위 테스트 통과 확인
          │
          ├──→ [Check 3: Integration Test]──→ 로컬 파일 I/O 연계 통합 테스트 통과 확인
          │
          └──→ [Check 4: verify_*.py 실행]──→ 전용 검증 스크립트 100% PASS 확인
```
