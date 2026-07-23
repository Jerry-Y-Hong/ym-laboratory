# Deployment Guide

> **Module**: 18_ai_product_factory — Document 08  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Local Ready-to-Publish Deployment Procedures

배포 가이드(Deployment Guide)는 제품 팩토리 엔진에 의해 빌드 및 패키징 완료된 제품 번들을 최종 로컬 스테이징 및 프로덕션 환경 채널에 안전하게 배포 이식하는 단계를 명세한다.

```
      [Packaging Specification 아카이브 수신]
                        │
                        ▼
   [배포 대상 환경 판독] ──→ config.json (development / production)
                        │
                        ▼
    [대상 격리 경로 정비] ──→ data/ready_to_publish/ 격리 폴더 조회
                        │
                        ▼
[Staging 바이너리 압축 해제] ──→ 지정된 서비스 폴더에 소스 전개
                        │
                        ▼
     [서비스 정합성 확인] ──→ verify_product.py 구동 확인
```

---

## 2. Sandbox Isolation & Local Channel Sync (채널 동기화)

- **경로 격리 보장**:
  - 배포 실행기는 타제품 디렉터리의 데이터를 지우거나 덮어쓸 수 없으며, 오직 `ready_to_publish/` 영역에 준비된 ZIP 번들을 목표 환경 경로(`g:\내 드라이브\YM-LAB_PROJECT_\products\{product_name}\`)로만 압축 해제 및 동기화한다.
- **SQLite DB 안전 복제**:
  - 배포 대상 환경에 온톨로지 지식 DB가 이미 존재하는 경우 덮어쓰지 않고, `catalog.db` 구조적 마이그레이션 DDL을 구동해 구조 스키마만 추가 주입하여 기존 로컬 실측 데이터셋의 유실을 방지한다.

---

## 3. Deployment Manifest (JSON)

배포 실행 시 주입 및 기록되는 배포 완료 매크로 명세:

```json
{
  "deploy_run_id": "DEP_20260722_001",
  "product_id": "PROD_KIMCHI_BLOG_SAAS",
  "version": "1.0.0",
  "target_channel": "local_staging",
  "deployed_directory": "products/kimchi_blog_saas",
  "status": "active",
  "completed_at": "2026-07-22T18:04:00+09:00"
}
```

이 매니페스트를 최종 배포 지점에 보존함으로써, 현재 배포된 제품군의 실시간 버전을 모니터링 시스템이 즉각 파악하여 가동 상태를 감시할 수 있게 한다.
Ref: [Publishing Manager Boundary](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/16_blog_automation_system/07_PUBLISHING_MANAGER.md)
