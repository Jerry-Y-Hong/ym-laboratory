# Lifecycle Management Guide

> **Module**: 18_ai_product_factory — Document 10  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Product Lifecycle Stages (수명 주기 관리 단계)

수명 주기 관리 가이드(Lifecycle Management Guide)는 제품 팩토리에서 생산되는 모든 지식 서비스 제품의 탄생(인큐베이팅)부터 활성화, 아카이빙 및 최종 폐기(Decommission)에 이르는 전 과정을 통제하는 규격 수칙이다.

```
  [블루프린트 기획 및 빌드] ──→ Incubating (시험 구동 및 팩토리 검증 진행)
                                  │
                                  ▼
   [Validation 100% 통과]   ──→ Active (공식 배포되어 서비스 실행 중)
                                  │
                                  ▼
[신버전 릴리즈 / 요구 소멸] ──→ Archived (실행 중지 후 ready_to_publish 백업 보존)
                                  │
                                  ▼
      [디스크 보존 연한 만료] ──→ Decommissioned (완전 영구 삭제)
```

---

## 2. Transition Rules (단계 전이 규칙)

- **Incubating → Active**:
  - `verify_product.py` 및 `scripts/verify_product_factory.py` 검증 보고서의 모든 항목이 에러율 0%로 `PASS` 판정을 받았을 때만 팩토리 엔진이 라이프사이클 플래그를 `Active`로 격상하며 정식 릴리즈 폴더로 배포를 실행한다.
- **Active → Archived**:
  - 동일 제품군에 대한 새로운 메이저/마이너 릴리즈가 등록되거나, 한식 교육 사업 계획 변경에 의해 해당 제품의 가동이 중단되면 즉시 상태를 `Archived`로 변경한다.
  - 이 단계에서는 해당 제품의 스케줄러 프로세스를 즉각 킬(Kill)하고, 디렉터리 전체를 zip 백업 번들 형태로 동결 보존 구역에 옮겨둔다.
- **Archived → Decommissioned**:
  - 아카이빙 등록 시점부터 최소 **1년**간의 소스 백업 보존 의무 연한을 가지며, 보존 기간이 지나면 리더(`Human Project Lead`)의 최종 승인을 거쳐 영구 삭제(`Decommissioned`)를 수행한다.

---

## 3. Lifecycle Status Schema (JSON)

```json
{
  "product_id": "PROD_KIMCHI_BLOG_SAAS",
  "lifecycle": {
    "current_stage": "archived",
    "transition_history": [
      { "stage": "incubating", "timestamp": "2026-07-22T18:04:00+09:00" },
      { "stage": "active", "timestamp": "2026-07-22T18:04:05+09:00" },
      { "stage": "archived", "timestamp": "2026-08-22T12:00:00+09:00" }
    ],
    "decommission_due_date": "2027-08-22T12:00:00+09:00"
  }
}
```
Ref: [Release Guide rollback](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/15_development_framework/09_RELEASE_GUIDE.md)
