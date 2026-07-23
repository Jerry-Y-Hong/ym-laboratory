# KIMCHI_MASTER_REVIEW

**문서 종류:** 검토 및 평가 보고서 (Separate Review Document)  
**대상 문서:** [KIMCHI_MASTER_SPEC.md](file:///g:/%EB%82%B4%20%EB%93%9C%EB%9D%BC%EC%9D%B4%EB%B8%8C/YM-LAB_PROJECT_/01_PHASE1_KIMCHI/01_KIMCHI_MASTER/KIMCHI_MASTER_SPEC.md) (버전 1.1)  
**소유:** YM-LAB  
**작성일:** 2026-07-20  

본 문서는 `KIMCHI_MASTER_SPEC.md` 기술 사양서에서 분리된 비사양 성격의 품질 평가, 개선 권장사항 및 변경 이력(Changelog)을 별도로 관리하기 위해 작성되었습니다.

---

## 1. Changelog (변경 이력)

| 항목 | 변경 내용 | 목적 |
|---|---|---|
| 문서 메타데이터 | 버전을 `1.1`로 변경하고 최종 검토일을 추가했다. | 개선 이력 추적 |
| Purpose | `Concept Hub` 역할과 전문 MASTER의 소유 범위를 더 명확히 했다. | 아키텍처 오해 방지 |
| Scope | 포함/제외 범위를 세분화하고 향후 MASTER 예시를 보강했다. | 확장성과 경계 명확화 |
| Design Principles | 삭제 정책, compatibility 원칙을 추가했다. | 장기 유지보수성 강화 |
| Database Structure | 공개 조건과 무결성 규칙을 보강했다. | publish gate와 FK 안정성 강화 |
| Field Definitions | 일부 FK 표기를 일관되게 backtick 처리하고 `workflow_status` enum 전체 값을 명시했다. | 용어 및 형식 일관성 개선 |
| Junction Rules | 공개 가능한 연결의 active target 조건을 명시했다. | 관계 무결성 강화 |
| Naming Rules | enum value 변경 금지 원칙을 추가했다. | 자동화와 API 안정성 확보 |
| ID Rules | 공개 이력이 있는 ID의 물리 삭제 금지 규칙을 추가했다. | 참조 안정성 확보 |
| Future Expansion Strategy | migration 및 compatibility 항목을 추가했다. | 향후 변경 관리 기준 마련 |
| QA Checklist | Concept Hub, FK, migration 검증 항목을 추가했다. | 검수 품질 향상 |

---

## 2. Recommended Future Improvements (권장되는 향후 개선 사항)

다음 항목은 이번 버전의 물리적 사양 구조에는 직접 적용하지 않으며, 향후 필요성 검토 및 별도 승인 단계를 거쳐 단계적으로 진행할 것을 권장합니다.

1. **공통 `CONTROLLED_VOCABULARY_MASTER` 또는 vocabulary registry 설계**
   - 각 마스터 테이블에서 사용하는 코드값과 범주형(Controlled) 변수들의 정의를 표준화하여 일관된 유효성 검증을 보장합니다.
2. **`REGION_MASTER`와 `SOURCE_MASTER` 우선 설계**
   - 지리적 기원 정보와 텍스트의 출처 고증 데이터를 효율적으로 다루기 위해 연관 마스터를 가장 먼저 구체화합니다.
3. **`RIGHTS_MASTER`와 `IMAGE_MASTER`의 권리 상태 연동 규칙 정의**
   - 이미지 자산과 콘텐츠 저작권을 일관되게 확인하고 법적 리스크를 자동 차단하는 메커니즘을 정의합니다.
4. **Field-level audit log 또는 변경 이력(Change History) 구조 설계**
   - 주요 지식 데이터의 변경 히스토리를 추적하기 위해 필드 단위의 수정 내역 기록 테이블을 구성합니다.
5. **중복 해결 가이드(Duplicate Resolution Guide) 작성**
   - 유사하거나 중복된 김치 개념이 등록되려고 할 때 병합, 보관, 연결을 판단하는 편집팀 가이드라인을 제공합니다.
6. **Public API response schema 별도 SPEC 작성**
   - 프론트엔드 및 타 서비스 연동을 위한 외부 노출용 API 명세를 마스터 스펙과 분리하여 상세 정의합니다.
7. **AI Search Document Schema와 Embedding Metadata SPEC 분리**
   - AI 전용 인덱싱 스키마와 벡터 임베딩 생성 기준을 독립적인 파생 데이터 파이프라인 명세로 설계합니다.

---

## 3. Overall Quality Assessment (종합 품질 평가)

**종합 평가 점수:** 92 / 100

### 3.1 강점
- **아키텍처 명확성:** `KIMCHI_MASTER`를 핵심 식별 정보만 소유하는 `Concept Hub`로 유지하는 아키텍처 원칙이 확고히 유지되고 있습니다.
- **관계 구조 안정성:** 다대다(M:N) 관계 처리를 위한 연결(Junction) 테이블 구조 및 네이밍, ID 발급 규칙의 일관성이 높습니다.
- **운영 안정성:** 공개 조건(Publish Gate), 무결성 규칙(Integrity Constraint), 삭제 제한 정책, 그리고 마이그레이션 호환성 기준이 체계적으로 보강되어 있어 실제 시스템 구축 및 장기 유지보수 관점에서 실용성이 뛰어납니다.

### 3.2 개선 기회 및 리스크 요인
- **연관 마스터의 미정의 상태:** `KIMCHI_MASTER` 자체의 구조적 완성도는 우수하나, 기원 지역(`REGION_MASTER`), 상세 출처(`SOURCE_MASTER`), 권리 관계(`RIGHTS_MASTER`) 등 확장 대상 마스터가 아직 기획 단계에 있습니다.
- **해결 방안:** 이는 본 마스터 스펙의 설계적 한계가 아니며, 차후 마스터 설계 단계에서 본 스펙이 정의한 확장 계약(Junction Table 규칙 및 ID 규칙)에 발맞추어 개별 명세서로 구체화되어야 합니다.
