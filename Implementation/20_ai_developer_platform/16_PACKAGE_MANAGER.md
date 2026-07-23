# Package Manager

> **Module**: 20_ai_developer_platform — Document 16  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Local Package Dependency Architecture (패키지 관리)

패키지 관리(Package Manager)는 양산되는 AI 제품군들이 개별적으로 의존하는 제3자 라이브러리(Pydantic, Pytest 등)와 플랫폼 공통 모듈(Tier 1~4 SDK)의 **물리 배치 경로, 버전 잠금 및 로컬 패키지 번들링을 규제하는 패키지 종속성 관리 수칙**이다.

```
                  ┌──────────────────────┐
                  │   Package Manager    │
                  └──────────┬───────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   [Third-Party PyPI]               [Local Platform libs]
 - pip / uv 의존성 락               - @ymlab/* 공통 패키지 복제
 - requirements.txt 파일 명세        - platform_libs/ 디렉터리 격리
            │                                 │
            └────────────────┬────────────────┘
                             ▼
              [최종 배포 ZIP 패키징 번들 완성]
```

---

## 2. Dependency Directory Layout & Lock enforcement

- **`platform_libs/` 폴더 내 의존성 전개**:
  - 각 AI 제품군은 로컬 시스템의 전역 파이썬 사이트-패키지(`site-packages`)와 완전히 차단 격리되어야 한다.
  - 외부 PyPI에서 다운로드한 바이너리와 공통 레지스트리 모듈은 제품 루트의 `platform_libs/` 하위로만 안전 배정 링크된다.
- **버전 잠금 규정**:
  - 제품 패키징 전, `requirements.txt` 또는 `pyproject.toml`에 명시된 버전 사양이 레지스트리의 호환 범위를 만족하는지 정적으로 교차 분석하여 불일치 발견 시 빌드를 전면 중단한다.

---

## 3. Dependency Lock Schema Example (JSON)

```json
{
  "product_id": "PROD_KIMCHI_BLOG_SAAS",
  "dependency_lock": {
    "python_version": ">=3.10",
    "third_party": {
      "pydantic": "2.5.2",
      "sqlite3": "builtin"
    },
    "platform_sdk": {
      "ymlab-sdk": "1.0.0",
      "import_checksum": "sha256_hash_here"
    }
  }
}
```
Ref: [Product Module Registry](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/18_ai_product_factory/04_PRODUCT_MODULE_REGISTRY.md)
