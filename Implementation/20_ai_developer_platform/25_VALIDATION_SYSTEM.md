# Validation System

> **Module**: 20_ai_developer_platform — Document 25  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Automated Verification Checklists (검증 체계 명세)

검증 체계 명세(Validation System Specification)는 개발 중인 AI 제품 코드 형상 및 SDK 구현 적격성을 종합 진단하여, **프로덕션 릴리즈 전송 가능 여부를 최종 판정하는 팩토리 및 빌드 파이프라인의 핵심 검증 게이트웨이**이다.

```
       [WP-25: Platform Validation 실행]
                       │
                       ▼
    [1단계: 디렉터리 무결성 스캔] ──→ 22_PROJECT_STRUCTURE 규칙 대조
                       │
                       ▼
    [2단계: 의존성 패키지 분석] ──→ 16_PACKAGE_MANAGER 잠금 파일 체크
                       │
                       ▼
    [3단계: 린트 및 스타일 점검] ──→ Ruff 및 MyPy 정적 타이핑 린팅
                       │
                       ▼
    [4단계: 3-Tier 자동 테스트] ──→ 13_TESTING_FRAMEWORK 실행 (100% 합격)
                       │
                       ▼
       [최종 검증 리포트 JSON 파일 저장]
```

---

## 2. Validation Metrics & Passing Thresholds

- **파일 구조 합격 조건 (Structure Gate)**:
  - `run.py`, `config.json`, `verify_product.py` 및 `.gitignore`가 전부 감출되어야 합격이다.
- **Ruff Linter 및 MyPy 에러 제로**:
  - `pyproject.toml` 규칙에 의거한 타입 힌트 오류 및 PEP 8 문법 경고가 1건이라도 포착되면 즉시 릴리즈 파이프라인 빌드를 폭파 중단(`exit 1`)한다.
- **테스트 통과율 100%**:
  - 로컬 Mock 서버와 연동 구동한 에이전트 단위/통합 테스트 케이스가 전원 합격해야 한다.

---

## 3. Platform Validation Report Schema (JSON)

```json
{
  "developer_platform_validation_run_id": "DEV_VAL_20260722_001",
  "checked_at": "2026-07-22T18:15:00+09:00",
  "validation_status": "PASS",
  "scenarios": {
    "directory_integrity": "PASS",
    "naming_convention": "PASS",
    "dependency_integrity": "PASS",
    "sdk_consistency": "PASS",
    "cli_validation": "PASS",
    "testing_validation": "PASS",
    "build_validation": "PASS"
  },
  "errors_found": []
}
```

이 검증 체계 명세를 제품 생태계 폴더 내에 저장 보존함으로써, 새로운 B2B 파트너 인스턴스 전개 전 플랫폼의 건강도와 신뢰성을 상시 모니터링할 수 있는 귀중한 자산으로 삼는다.
Ref: [Validation Report Spec](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/19_ai_product_ecosystem/16_VALIDATION_REPORT.md)
