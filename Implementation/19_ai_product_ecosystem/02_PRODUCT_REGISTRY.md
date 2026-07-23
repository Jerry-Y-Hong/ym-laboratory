# Product Registry

> **Module**: 19_ai_product_ecosystem — Document 02  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Product Registry Concept

제품 레지스트리(Product Registry)는 제품 팩토리에서 양산된 모든 활성 및 보관 상태의 AI 제품 메타데이터, 버전, 호환성 스펙, 번들 해시 목록을 종합 등재 및 관리하는 **에코시스템 중앙 카탈로그 원장**이다.

```
                  ┌──────────────────────┐
                  │   Product Registry   │
                  └──────────┬───────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   [Registration Input]              [Registry Record]
 - Product ZIP package             - product_id / version
 - Build SHA-256 hash              - category / status
 - Dependency blueprints           - archive_url / dependencies
```

---

## 2. Registry Registration Workflow (등록 워크플로우)

1. **제품 패키지 검출**: 팩토리가 배포 디렉터리(`ready_to_publish/`)에 최종 번들 ZIP과 패키지 매니페스트 JSON을 출력한다.
2. **무결성 체크**: 레지스트리 로더가 패키지의 SHA-256 해시 정합성을 검증한다.
3. **원장 등재**: 유효성 체크 통과 시, `registry_db.json` 또는 온프레미스 중앙 원장에 제품의 메타데이터 필드를 아래 구조로 직렬화하여 추가 보존한다.

---

## 3. Product Registry Record Schema (JSON)

```json
{
  "product_id": "PROD_KIMCHI_BLOG_SAAS",
  "version": "1.0.0",
  "category": "kimchi",
  "status": "active",
  "archive_metadata": {
    "filename": "PROD_KIMCHI_BLOG_SAAS_1.0.0.zip",
    "sha256": "2f65a18a994efb70f074d0e981dfebbd8019b882361cfb7b0bd192f15ff92f15",
    "size_bytes": 1048576,
    "archive_url": "data/ready_to_publish/PROD_KIMCHI_BLOG_SAAS_1.0.0.zip"
  },
  "compatibility": {
    "min_platform_version": "v1.2.0",
    "required_tier_modules": ["MOD_110_API", "MOD_120_DB"]
  },
  "registered_at": "2026-07-22T18:09:00+09:00"
}
```

이 원장은 후속 `Distribution Portal`과 `Marketplace`가 실시간 판매 및 다운로드 가능한 최신 활성 제품 목록을 동적 판독하여 사용자 화면에 전개할 수 있게 돕는 기초 메타데이터 소스로 작동한다.
Ref: [Module Registry Schema](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/18_ai_product_factory/04_PRODUCT_MODULE_REGISTRY.md)
