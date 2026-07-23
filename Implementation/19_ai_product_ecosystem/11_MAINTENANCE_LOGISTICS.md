# Maintenance Logistics

> **Module**: 19_ai_product_ecosystem — Document 11  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Hotpatching, DRP, and Rollback Logistics (유지보수 물류)

유지보수 물류(Maintenance Logistics)는 서비스 중인 AI 제품 인스턴스에 치명적 결함(LLM 파서 깨짐 등)이 발생했을 때, 무중단으로 패치를 배포 전송하고 장애 시 백업 데이터를 바탕으로 **재해 복구 계획(DRP)을 작동시키는 시스템 백업/복구 운영 수칙**이다.

```
       [치명적 서비스 장애 감지] (모니터링 대시보드 경보)
                         │
                         ▼
        [1단계: DRP Failover 가동] ──→ 가용 백업 인스턴스로 게이트 라우팅 우회
                         │
                         ▼
         [2단계: Hotpatch 핫패치 빌드] ──→ 팩토리가 핫픽스 번들 생산 (PATCH v1.0.1)
                         │
                         ▼
  [3단계: Staging 배포 및 자체 검증] ──→ verify_product.py 통과 확인
                         │
                         ▼
       [4단계: Production 패키지 스왑] ──→ 롤링 업데이트 기법으로 라이브 소스 교체
```

---

## 2. Backup & Recovery Operations (백업 및 무결성 복원)

- **원장 DB 및 큐 파일 정기 백업**:
  - `data/catalog.db` 및 각 제품의 `publish_queue.json`은 매일 자정 스케줄러에 의해 `data/backup/{YYYYMMDD}/` 격리 아카이브 폴더로 자동 압축 보관된다.
- **안전한 쓰기 DRP 기법 (Safe-Write DRP)**:
  - 백업 복원 시 직접 덮어쓰지 않고, 임시 복원 파일(`catalog.db.tmp`)을 먼저 생성해 무결성을 대조한 뒤 파일 교체를 수행하여 복원 프로세스 중 발생할 수 있는 데이터 파일 영구 깨짐을 원천 방지한다.
- **롤백 지침**:
  - 패치 업데이트 후 오작동 감지 시, 배포기는 즉시 이전 안정 빌드 버전(v1.0.0)의 번들 ZIP 복사본을 압축 해제해 서비스를 5초 이내에 롤백 완료한다.

---

## 3. Maintenance Run Checklist (JSON)

유지보수 및 백업 이력을 기록 및 통제하기 위해 보존하는 JSON 스키마:

```json
{
  "maintenance_run_id": "MNT_20260722_001",
  "product_id": "PROD_KIMCHI_BLOG_SAAS",
  "action_type": "daily_backup",
  "backup_archive_path": "data/backup/20260722/PROD_KIMCHI_BLOG_SAAS_backup.zip",
  "sha256": "8f276cd82b8a7b8e8f81a7b88df18903c6938df3c6938df7c0bd192f15ff92f15",
  "status": "success",
  "timestamp": "2026-07-22T23:59:59+09:00"
}
```
Ref: [Release Guide rollback](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/15_development_framework/09_RELEASE_GUIDE.md)
