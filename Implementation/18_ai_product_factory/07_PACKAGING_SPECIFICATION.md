# Packaging Specification

> **Module**: 18_ai_product_factory — Document 07  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Product Packaging Flow & Specs

제품 패키징(Product Packaging)은 팩토리가 정상 조립하고 로컬 검증까지 완료한 제품 소스 형상을 **단일 배포 가능 아카이브 패키지(Bundle)**로 압축 및 직렬화 포맷화하는 절차이다.

```
       [Validation PASS 제품 형상 식별]
                       │
                       ▼
    [런타임 임시 데이터 제거] ──→ data/ 산출물 및 임시 파일 비우기
                       │
                       ▼
 [아카이빙 번들 파일 생성] ──→ zip / tar.gz 형식으로 파일 시스템 패킹
                       │
                       ▼
  [패키지 매니페스트 발행] ──→ SHA-256 해시값 및 메타데이터 정보 JSON 생성
                       │
                       ▼
       [ ready_to_publish/ 배포 영역 적재]
```

---

## 2. Archive Formats & Manifest Publishing

- **아카이브 번들**:
  - 제품 번들은 `ready_to_publish/{product_id}_{version}.zip` 파일로 단일 압축 보관한다.
  - 빌드 전 반드시 `data/posts/` 및 `data/logs/` 와 같은 로컬 캐시/로그 디바이스 데이터 파일들은 완전 삭제 처리하여, 소스 패키지가 비대해지거나 기 검증된 쓰레기 데이터가 함께 배포되는 것을 막는다.
- **SHA-256 해시 무결성**:
  - 패키징된 바이너리의 변조를 원천 차단하기 위해 해시 알고리즘을 구동하고 결과 값을 해시 메니페스트에 표기한다.

---

## 3. Product Package Manifest Schema (JSON)

```json
{
  "package_id": "PKG_KIMCHI_BLOG_SAAS_V1_0_0",
  "product_id": "PROD_KIMCHI_BLOG_SAAS",
  "version": "1.0.0",
  "archive_filename": "PROD_KIMCHI_BLOG_SAAS_1.0.0.zip",
  "sha256_hash": "2f65a18a994efb70f074d0e981dfebbd8019b882361cfb7b0bd192f15ff92f15",
  "packaged_at": "2026-07-22T18:04:00+09:00",
  "file_count": 42,
  "size_bytes": 1048576
}
```

이 매니페스트를 최종 빌드 패키지와 결합하여 `ready_to_publish/` 영역에 적재함으로써, 외부 배포 도구가 이 해시 정합성을 토대로 무결한 배포를 수행할 수 있게 보장한다.
Ref: [Release Guide](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/15_development_framework/09_RELEASE_GUIDE.md)
