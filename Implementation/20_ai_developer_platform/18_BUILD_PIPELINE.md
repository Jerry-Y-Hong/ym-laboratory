# Build Pipeline

> **Module**: 20_ai_developer_platform — Document 18  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Automated Build Pipeline Sequence (빌드 파이프라인)

빌드 파이프라인(Build Pipeline)은 로컬 터미널 명령(`ymlab-cli package`) 또는 CI/CD 자동화 러너 환경에서 제품 소스코드를 분석, 정적 테스트 및 보안 스캔을 가동하고 최종 번들 ZIP 아카이브를 빌드 출력하는 **E2E 검증 통과식 자동 빌드 파이프라인의 물리 순서**를 규정한다.

```
       [Developer Source Code Push / CLI 빌드 명령 호출]
                              │
                              ▼
        [Step 1: Code Quality 린트 및 스타일 체크] (21_CODE_STYLE)
                              │
                              ▼
           [Step 2: Security Static Scan] (17_SECURITY_SCANNING)
                              │
                              ▼
        [Step 3: 3-Tier Automated Tests 구동] (13_TESTING_FRAMEWORK)
                              │
         ┌────────────────────┴────────────────────┐
         ▼                                         ▼
   [Validation PASS]                         [Validation FAIL]
 - data/ 임시 파일 소거                     - 빌드 비정상 종료 (exit 1)
 - ZIP 압축 및 SHA-256 발행                - 에러 로그 리포트 출력
 - ready_to_publish/ 복제 전송
```

---

## 2. Artifact Generation & Cleanup Rules

- **정리 대상 격리 (Clean Gate)**:
  - 패키징 zip 압축 전, 빌드 스크립트는 반드시 `.venv/`, `__pycache__/`, `.pytest_cache/` 및 `data/posts/` 등 로컬 런타임 결과물 디렉터리를 완전히 소거(Rm)하여 패키지 무결성을 유지한다.
- **해시 바인딩**:
  - 압축 완료 직후 해당 ZIP 파일의 SHA-256 해시를 계산하고 번들 매니페스트 `package_manifest.json`을 원자적 생성 주입한다.

---

## 3. Build Manifest Output Schema (JSON)

```json
{
  "build_job_id": "BUILD_20260722_001",
  "product_id": "PROD_KIMCHI_BLOG_SAAS",
  "version": "1.0.0",
  "build_status": "success",
  "artifacts": {
    "zip_bundle": "data/ready_to_publish/PROD_KIMCHI_BLOG_SAAS_1.0.0.zip",
    "sha256": "2f65a18a994efb70f074d0e981dfebbd8019b882361cfb7b0bd192f15ff92f15"
  },
  "warnings": [],
  "finished_at": "2026-07-22T18:15:00+09:00"
}
```
Ref: [Packaging Specification](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/18_ai_product_factory/07_PACKAGING_SPECIFICATION.md)
