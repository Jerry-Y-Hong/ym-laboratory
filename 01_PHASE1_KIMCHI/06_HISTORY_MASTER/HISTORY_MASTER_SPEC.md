# HISTORY_MASTER_SPEC

**버전:** 1.0  
**상태:** 정식 기술 사양서 (Release Ready)  
**소유:** YM-LAB  
**최종 검토:** 2026-07-20  

## 1. 목적 (Purpose)

본 사양서는 YM-LAB 김치 지식 플랫폼의 역사적 문헌 기록, 시대별 변천사, 기원 설화, 역사적 사료 고증 지식을 독립적으로 관리하는 `HISTORY_MASTER` 데이터베이스의 기술 규격을 정의한다.

`HISTORY_MASTER`는 다음 표준 역할을 수행하여야 한다 (MUST).
1. 김치의 역사적 기록, 시대별 기원설, 고문헌 관련 지식 개념의 고유 식별 및 정체성 정의
2. 삼국시대, 고려시대, 조선시대, 근현대 등 시대별 식문화 변천사 및 고증 문헌 메타데이터 원천 소유
3. `KIMCHI_MASTER`를 포함한 타 MASTER 데이터베이스에 표준 역사 식별자(`history_id`) 및 연결(Junction Table) 규격 제공

## 2. 범위 (Scope)

### 2.1 포함 범위 (In-Scope)
본 사양서는 다음 항목의 데이터 규격 및 제약 조건을 규정한다 (SHALL).
- 역사 지식 고유 식별자(`history_id`), 대표 명칭(`canonical_name_ko`), URL slug 및 시대 구분 코드(`historical_period_code`)
- 출처 고문헌 명칭(`source_document_name_ko`), 추정 시기(`estimated_century`), 주장 범위 코드(`claim_scope_code`)
- 역사적 핵심 특징 요약(`distinguishing_feature_ko`) 및 공식 한국어 역사 요약문(`canonical_summary_ko`)
- 검증 상태(`verification_status`), 노출 범위(`public_visibility`), 워크플로우 상태(`workflow_status`) 메타데이터
- 다국어 역사 표시명(`HISTORY_LOCALIZATION`) 및 역사 별칭/검색어(`HISTORY_ALIAS`)
- `KIMCHI_MASTER`와의 역사 맥락 매핑 관계(`KIMCHI_HISTORY` Junction Table)

### 2.2 제외 범위 (Out-of-Scope)
다음 항목은 본 사양서의 범위에서 제외하며, KIMCHI_MASTER가 직접 소유할 수 없다 (MUST NOT).
- 김치 개념 개별 레코드의 대표 정체성 및 메타데이터 (`KIMCHI_MASTER` 소유)
- 식재료 고유 속성 및 재료 분류 체계 (`INGREDIENT_MASTER` 소유)
- 구체적인 조리 순서, 단계별 지침 및 식재료 투입 정량 (`RECIPE_MASTER` 소유)
- 발효 조건, 산도, 염도 등 화학적 측정치 (`FERMENTATION_MASTER` 소유)
- 현대 대중적 스토리텔링 원고 및 홍보/에세이 본문 (`STORY_MASTER` 소유)
- 참고 문헌 출처 전문 및 라이선스 정보 (LEVEL 3 `SOURCE_MASTER` / `LICENSE_MASTER` 소유)

## 3. 설계 원칙 (Design Principles)

1. **역사 기록 단위 유일성:** 하나의 레코드는 독립되고 고증 가능한 하나의 역사적 기록/변천사 개념만 정의하여야 한다 (MUST).
2. **최소 소유권 (Minimal Ownership):** `HISTORY_MASTER`는 역사적 기록의 정체성, 시대 구분, 고증 문헌명, 기원 주장 범위, 고증 메타데이터만 직접 소유하여야 한다 (MUST).
3. **단일 소유권 (Single Ownership) & SSOT:** 역사적 고증 정보는 오직 `HISTORY_MASTER`만 소유한다 (SHALL). 타 MASTER에서 역사 서술을 이중 저장하는 것을 금지하며 (MUST NOT), 외래키(FK)와 Junction Table로만 상호 연결하여야 한다 (MUST).
4. **Junction Table 분리:** 타 MASTER와의 다대다(M:N) 매핑은 전용 Junction Table(`KIMCHI_HISTORY` 등)로 분리하여야 한다 (MUST). 김치 마스터 내 직접 역사 본문 저장을 금지한다 (MUST NOT).
5. **한국어 기준 및 다국어 확장:** 기준 언어는 한국어(`ko-KR`)로 정의한다 (SHALL). 번역 및 현지화 텍스트는 `HISTORY_LOCALIZATION`에서 독립 관리하여야 한다 (MUST).
6. **Publish Gate 준수:** [7. 공개 조건 (Publish Gate)](#7-공개-조건-publish-gate)의 제약 조건을 전수 충족하는 레코드에 한하여 외부 노출을 허용하여야 한다 (MUST).
7. **통제된 어휘 (Controlled Vocabulary) 준수:** 시대 구분, 주장 범위 등 상태값은 임의 텍스트 입력을 금지하며 (MUST NOT), 지정된 Enum/Code 규격을 따라야 한다 (MUST).
8. **불변 식별자 (Immutable ID):** 기본 식별자(`history_id`)는 명칭 및 시대 구분 변경과 독립적으로 영구 유지되어야 한다 (MUST).
9. **소프트 삭제 (Soft Delete):** 사용 이력이 존재하는 레코드의 물리 삭제를 금지한다 (MUST NOT). 비활성화 시 `workflow_status = archived`로 전이하여야 한다 (MUST).
10. **하위 호환성 (Backward Compatibility):** 식별자, 테이블명, 필드명, Enum 값의 무단 변경을 금지하며 (MUST NOT), 스키마 변경 시 하위 호환성을 보장하여야 한다 (MUST).

## 4. 데이터 소유권 매트릭스 (Ownership Matrix)

| 정보 영역 (Domain) | 책임 소유자 (Owner MASTER) | 소유 및 관리 범위 |
| :--- | :--- | :--- |
| **History Identity (역사 정체성)** | `HISTORY_MASTER` | `history_id`, 공식 한국어명, slug, 시대 구분, 출처 문헌명, 추정 시기, 주장 범위, 검증/운영 메타데이터 |
| **History Localization** | `HISTORY_LOCALIZATION` | 언어별 역사 표시명, 언어별 요약 설명, 번역 검토 상태 |
| **History Alias** | `HISTORY_ALIAS` | 역사적 명칭 별칭, 이명, 고문헌 표기, 로마자 표기, 검색 키워드 |
| **Kimchi History Relation** | `KIMCHI_HISTORY` | `KIMCHI_MASTER`와 `HISTORY_MASTER` 간 역사적 맥락 매핑 (`origin`, `timeline`, `regional` 등) 및 `claim_scope` |
| **Source Citation (문헌 출처)** | `SOURCE_MASTER` (LEVEL 3) | 고문헌 원문, 연구 논문, 출처 URL, 저자 정보 등 상세 증빙 자료 |

## 5. 데이터베이스 구조 (Database Structure)

### 5.1 논리 테이블 정의 (Logical Tables)

| Table | 역할 | Primary Key |
|---|---|---|
| `HISTORY_MASTER` | 역사적 기록 및 기원 고증 지식을 관리하는 중심 테이블 | `history_id` |
| `HISTORY_LOCALIZATION` | 역사 지식의 언어별 표시명 및 설명 관리 | (`history_id`, `language_code`) |
| `HISTORY_ALIAS` | 역사 명칭 별칭, 고문헌 표기, 검색어 관리 | `alias_id` |
| `KIMCHI_HISTORY` | `KIMCHI_MASTER`와의 역사 맥락 매핑 Junction Table | `kimchi_history_id` |

## 6. 레코드 생명주기 (Lifecycle)

- **전이 순서:** 레코드는 `draft` → `in_review` → `approved` → `published` → `archived` 순서로 전이하여야 한다 (MUST).
- **반려 처리:** `in_review` 단계에서 반려 시 `rejected` 상태로 전이하며, 외부 노출을 금지한다 (MUST NOT).
- **보관 처리:** `published` 레코드는 물리 삭제할 수 없으며 (MUST NOT), `archived` 상태로 전이하여야 한다 (MUST). 레코드 대체 시 `replacement_history_id`에 대체 식별자를 기재하여야 한다 (MUST).

## 7. 공개 조건 (Publish Gate)

`public_visibility = public` 설정을 위해 다음 조건 전수를 동시에 충족하여야 한다 (MUST).
1. `Publish` 필수 지정 필드 전수 입력 완료
2. `verification_status = verified`
3. `workflow_status = published`
4. `source_document_name_ko` 또는 근거 문헌 정보 명시 완료
5. `localization_status = approved`인 `ko-KR` `HISTORY_LOCALIZATION` 레코드 1개 이상 존재

## 8. 데이터 무결성 규칙 (Integrity Rules)

- **출처 명시성:** 공개 상태(`workflow_status = published`)인 레코드는 고증 출처(`source_document_name_ko`)를 반드시 포함하여야 한다 (MUST).
- **순환 참조 금지:** `replacement_history_id`는 자기 참조 및 순환 참조를 금지한다 (MUST NOT).
- **보관 타임스탬프:** `workflow_status = archived` 전이 시 `archived_at` 타임스탬프 입력은 필수이다 (MUST).

## 9. 필드 명세 (Field Definitions)

### 9.1 `HISTORY_MASTER`

| Field Name | Type / Format | Required | 제약 및 규격 |
|---|---|---:|---|
| `history_id` | string, `HIS-######` | Create | 기본 키(PK). 영구 불변 고유 식별자. |
| `canonical_name_ko` | Unicode text | Create | 역사 지식 개념의 공식 한국어 명칭. |
| `canonical_slug` | lowercase ASCII slug | Create | URL/API용 표준 slug. 공개 후 변경 금지. |
| `historical_period_code` | controlled code | Create | 시대 구분 코드 (`pre_three_kingdoms`, `three_kingdoms`, `goryeo`, `joseon_early`, `joseon_late`, `modern`, `unknown`). |
| `source_document_name_ko` | short Unicode text | Publish | 주요 고증 출처 문헌명 (예: 임원경제지, 동국세시기). |
| `estimated_century` | short Unicode text | Optional | 추정 발생/기록 시기 (예: 17세기 후반, 19세기 초). |
| `claim_scope_code` | controlled code | Publish | 역사적 주장 범위 코드 (`national`, `regional`, `ingredient_origin`, `recipe_origin`, `cultural_tradition`, `disputed`). |
| `distinguishing_feature_ko` | short Unicode text | Publish | 역사적 기록의 핵심 특징 요약. |
| `canonical_summary_ko` | plain Unicode text | Publish | 공식 한국어 역사 요약문. AI 인덱싱 및 기본 표기용. |
| `verification_status` | enum: `unverified`, `researching`, `verified`, `disputed` | Create | 사실 검증 상태. 공개 시 `verified` 필수. |
| `workflow_status` | enum: `draft`, `in_review`, `approved`, `published`, `archived`, `rejected` | Create | Lifecycle 상태. 기본값 `draft`. |
| `public_visibility` | enum: `private`, `internal`, `public` | Create | 외부 노출 범위. `public` 설정 시 [7. 공개 조건 (Publish Gate)](#7-공개-조건-publish-gate) 충족 필수. |
| `created_at` | ISO 8601 UTC timestamp | Create | 레코드 생성 시각. |
| `created_by` | user/service identifier | Create | 레코드 생성 주체 식별자. |
| `updated_at` | ISO 8601 UTC timestamp | Create | 레코드 최종 수정 시각. |
| `updated_by` | user/service identifier | Create | 레코드 최종 수정 주체 식별자. |
| `record_version` | positive integer | Create | 낙관적 잠금용 버전 번호. 변경 시 1씩 증가. |
| `archived_at` | ISO 8601 UTC timestamp | Optional | 보관 처리 시각 (`workflow_status = archived` 시 필수). |
| `replacement_history_id` | self-FK to `HISTORY_MASTER` | Optional | 대체/통합 대상 `history_id` (자기 참조 및 순환 금지). |
| `internal_note` | private text | Optional | 내부 편집 메모 (외부 API 비노출). |

### 9.2 `HISTORY_LOCALIZATION`

| Field Name | Type / Format | Required | 제약 및 규격 |
|---|---|---:|---|
| `history_id` | FK to `HISTORY_MASTER` | Create | 대상 역사 지식 FK (복합 PK). |
| `language_code` | BCP 47 tag | Create | 언어/로케일 코드 (`ko-KR`, `en`, `ja` 등) (복합 PK). |
| `localized_name` | Unicode text | Create | 승인된 언어별 표시명. |
| `short_description` | plain Unicode text | Publish | 언어별 요약 설명 텍스트. |
| `localization_status` | enum: `draft`, `reviewed`, `approved` | Create | 번역 검토 상태. 서빙 시 `approved` 필수. |
| `translated_by` | user/service identifier | Optional | 번역 생성 주체 식별자. |
| `reviewed_by` | user identifier | Optional | 번역 검수자 식별자 (`approved` 시 필수). |
| `updated_at` | ISO 8601 UTC timestamp | Create | 레코드 최종 수정 시각. |

### 9.3 `HISTORY_ALIAS`

| Field Name | Type / Format | Required | 제약 및 규격 |
|---|---|---:|---|
| `alias_id` | string, `HAL-######` | Create | 역사 별칭 불변 기본 키(PK). |
| `history_id` | FK to `HISTORY_MASTER` | Create | 연관 역사 지식 FK. |
| `language_code` | BCP 47 tag | Create | 별칭 언어 코드. |
| `alias_text` | Unicode text | Create | 고문헌 표기, 옛 이름, 음역 텍스트. |
| `normalized_alias` | normalized text | Create | 검색 및 중복 검증용 정규화 텍스트. |
| `alias_type` | enum: `alternate_name`, `historical_spelling`, `romanization`, `search_term` | Create | 별칭 유형 구분 Enum. |
| `status` | enum: `active`, `deprecated` | Create | 별칭 사용 상태 Enum. |

### 9.4 Junction Table 규격 (`KIMCHI_HISTORY`)

`KIMCHI_MASTER`와의 매핑 관계는 아래 규격을 준수하여야 한다 (MUST).

| Common Field | Type / Format | Required | 제약 및 규격 |
|---|---|---:|---|
| `kimchi_history_id` | string, `KHS-######` | Create | 불변 기본 키(PK). |
| `kimchi_id` | FK to `KIMCHI_MASTER` | Create | 중심 김치 FK. |
| `history_id` | FK to `HISTORY_MASTER` | Create | 연관 역사 지식 FK. |
| `relation_type` | controlled code | Create | 관계 유형 (`origin`, `timeline`, `regional`, `ingredient_history`, `reference`). |
| `claim_scope` | short Unicode text | Optional | 역사적 주장 범위 세부 설명. |
| `display_order` | non-negative integer | Create | 표출 순서 (기본값 `0`). |
| `link_status` | enum: `active`, `inactive` | Create | 관계 사용 여부 Enum. |
| `created_at` / `updated_at` | ISO 8601 UTC timestamps | Create | 생성 및 수정 시각. |

## 10. 관계 다이어그램 (Relationship Diagram)

```mermaid
erDiagram
    HISTORY_MASTER ||--o{ HISTORY_LOCALIZATION : "표시"
    HISTORY_MASTER ||--o{ HISTORY_ALIAS : "검색_해결"
    HISTORY_MASTER ||--o{ KIMCHI_HISTORY : "역사_맥락_연결"
    KIMCHI_MASTER ||--o{ KIMCHI_HISTORY : "제공"
```

## 11. 명명 규칙 (Naming Rules)

- **테이블명:** 영문 대문자 `SNAKE_CASE`를 적용하여야 한다 (MUST) (`HISTORY_MASTER`).
- **필드명:** 영문 소문자 `snake_case`를 적용하여야 한다 (MUST) (`history_id`).
- **식별자/외래키:** `*_id` 접미사를 사용하여야 한다 (MUST).
- **통제 어휘 코드:** `*_code` 접미사를 사용하여야 한다 (MUST).
- **타임스탬프:** `*_at` 접미사를 사용하여야 하며 (MUST), ISO 8601 UTC 포맷을 준수하여야 한다 (MUST).
- **언어 코드:** BCP 47 표준을 준수하여야 한다 (MUST) (예: `ko-KR`, `en-US`).
- **Slug:** 영문 소문자 ASCII 및 하이픈(`-`)만 허용한다 (MUST).
- **데이터 포맷:** Plain text 저장을 원칙으로 하며 (MUST), HTML 태그 저장을 금지한다 (MUST NOT).
- **Enum 값:** 영문 소문자 ASCII를 사용하여야 하며 (MUST), 임의 변경을 금지한다 (MUST NOT).

## 12. 식별자 규칙 (ID Rules)

| Entity | Pattern | Example | 규칙 |
|---|---|---|---|
| History | `HIS-######` | `HIS-000001` | 순차 발급, zero-padding, 불변, 재사용 금지 |
| History alias | `HAL-######` | `HAL-000001` | 레코드별 불변 PK |
| Kimchi history link | `KHS-######` | `KHS-000001` | 김치 역사 매핑 불변 PK |

- **시맨틱 정보 포함 금지:** ID에 시대, 문헌명, 날짜 등 의미 정보를 포함할 수 없다 (MUST NOT).
- **발급 시점:** 레코드 저장 확정 시 발급하며, 누락 번호의 재사용을 금지한다 (MUST NOT).
- **물리 삭제 금지:** 외부 참조/공개 이력이 있는 ID는 물리 삭제를 금지하고 (MUST NOT), `archived` 상태로 보존하여야 한다 (MUST).

## 13. 미래 확장 전략 (Future Expansion Strategy)

### 13.1 SOURCE_MASTER 및 LICENSE_MASTER 연동 규격
- 본 `HISTORY_MASTER`는 향후 LEVEL 3 공통 마스터인 `SOURCE_MASTER`(사료 전문 및 참고문헌 마스터) 및 `LICENSE_MASTER`(저작권/라이선스 마스터)와 연결되어 역사 사료의 학술적 고증 증빙 자료를 정밀 확장한다.

### 13.2 마이그레이션 및 호환성
- **하위 호환 변경:** 선택 필드(Optional field) 추가는 호환 변경으로 처리한다.
- **파괴적 변경 (Breaking Change):** 필수 필드, ID 규격, Enum 값, 테이블명 변경 시 마이그레이션 계획 및 롤백 정책 수립을 의무화한다 (MUST).

## 14. QA 체크리스트 (QA Checklist)

모든 검사 항목은 객관적으로 즉시 검증 가능(Pass/Fail)하여야 한다 (MUST).

- [ ] **[소유성 검증]** 파일명이 `HISTORY_MASTER_SPEC.md`이며 위치가 `01_PHASE1_KIMCHI/06_HISTORY_MASTER/`에 존재하는가?
- [ ] **[단일 개념 검증]** 하나의 레코드가 정확히 하나의 역사적 기록/변천사 개념만 정의하고 있는가?
- [ ] **[출처 명시 검증]** 공개 상태의 역사 레코드에 고증 출처 문헌명(`source_document_name_ko`)이 명시되어 있는가?
- [ ] **[Junction Table 검증]** `KIMCHI_MASTER`와의 다대다 매핑이 `KIMCHI_HISTORY` 연결 테이블로 분리되어 있는가?
- [ ] **[ID 규격 검증]** 모든 PK/FK가 지정된 Prefix 및 6자리 Zero-padding 규칙(`HIS-######`, `HAL-######`, `KHS-######` 등)을 준수하는가?
- [ ] **[무결성 검증]** 모든 외래키(FK) 참조 대상 레코드가 실제 존재하며 active/publishable 상태인가?
- [ ] **[Publish Gate 검증]** 공개 역사 레코드가 `Publish` 필수 필드 입력, `ko-KR` approved localization, `verification_status = verified`, `workflow_status = published`, `public_visibility = public` 조건을 충족하는가?
- [ ] **[동시성 검증]** 데이터 수정 시 `record_version` 및 `updated_at` 타임스탬프가 최신화되는가?
