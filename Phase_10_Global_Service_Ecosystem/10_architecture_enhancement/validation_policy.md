# YM-LAB Production Validation Framework Policy Specification

> **Phase**: Phase 10 Supplement Verification Framework Extension  
> **Status**: ✅ **ACTIVE & PRODUCTION READY**  
> **Target Location**: [10_architecture_enhancement/validation_policy.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Phase_10_Global_Service_Ecosystem/10_architecture_enhancement/validation_policy.md)  

---

## 1. Severity Classification Rules

검증 프레임워크는 모든 진단 결과를 다음 5단계 Severity 등급으로 분류합니다.

| Severity Level | Definition | Impact & Action Required |
| :--- | :--- | :--- |
| **PASS** | 성공적인 검증 통과 | 시스템 정상 작동 |
| **INFO** | 참고 메타데이터 정보 | 옵션 항목 누락 또는 정보성 알림 |
| **WARNING** | 권장사항 미준수 (Non-blocking) | 하위 호환성 경고 또는 Deprecated 구성 요소 |
| **ERROR** | 기능적 불일치 또는 링킹 오류 | Broken Link, 필수 세션 헤더 미비 등 |
| **CRITICAL** | 시스템 치명적 오류 (Blocking) | 필수 파일 누락, 무단 수정, UTF-8 파싱 오류 |

---

## 2. Exit Code Policy

DevSecOps 및 CI/CD 파이프라인 연동을 위한 검증기 종료 코드(Exit Code) 정책입니다.

| Exit Code | Severity Status | Description | CI/CD Pipeline Action |
| :---: | :--- | :--- | :--- |
| **0** | **PASS** / **INFO** | 모든 검증 성공 | 파이프라인 통과 (Success) |
| **1** | **WARNING** | 경고 발생 (Non-blocking) | 파이프라인 통과 및 알림 발송 (Pass with Warning) |
| **2** | **ERROR** | 오류 발생 (Blocking) | 파이프라인 중단 (Build Fail) |
| **3** | **CRITICAL** | 치명적 오류 발생 (Blocking) | 파이프라인 즉시 차단 (Immediate Rollback) |

---

## 3. Auto Fix Suggestion Engine Guidelines

오류 발생 시 자동 수정 가이드는 다음 5개 필수 필드를 포함하여 반환합니다.

- **Issue**: 발생한 개별 문제 요약
- **Cause**: 문제의 근본 원인 (Root Cause) 분석
- **Recommended Action**: 문제 해결을 위한 단계별 수행 권장사항
- **Related File**: 수정 대상 파일의 절대 경로
- **Expected Result**: 수정 적용 후 기대되는 성공적 검증 상태

---

## 4. Machine-Readable Metrics Policy
CI/CD 시스템과의 유기적 연동을 위하여 다음 2종의 기계 가독형 JSON 결과물을 실시간 생성합니다.
- [verification_metrics.json](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Phase_10_Global_Service_Ecosystem/10_architecture_enhancement/verification_metrics.json): 개별 검증 항목별 결과 및 Auto Fix Suggestion 상세 JSON.
- [verification_statistics.json](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Phase_10_Global_Service_Ecosystem/10_architecture_enhancement/verification_statistics.json): Total, Pass, Info, Warn, Error, Critical 카테고리 통계 및 Success Rate JSON.
