# 📘 MFCO SYSTEM DESIGN BLUEPRINT v2.0
## (전역 시스템 설계 및 아키텍처 정의서)

본 설계서는 **MFCO(사용자 상태 기반 의미론적 추론 엔진)**의 전체 시스템 구조와 전역 설계 원칙을 설정합니다. 개별 코드 구현에 앞서 데이터 구조, 관계형 매핑, 그리고 추론 엔진의 전역 아키텍처를 정의하여 시스템의 일관성과 확장성을 보장합니다.

---

## 1. 아키텍처 철학 (Architectural Philosophy)

MFCO는 한의학 처방이나 질병 치료를 목적으로 하는 의학 시스템이 아닙니다. 
사용자가 일상에서 겪는 **신체 상태(State)**를 출발점으로 삼아, 상태를 유발하는 **원인(Cause)**을 추론하고, 이에 대응하는 **생리적 기능(Function)**을 매핑한 뒤, 적합한 **식재료(Ingredient)**와 **레시피(Recipe)**를 도출하여, 최종적으로 프랜차이즈 식당에서 실행 가능한 **약선 키트 업그레이드 식단**을 제안하는 **다층 의미 기반 추론 아키텍처**입니다.

### 전역 추론 파이프라인 (Global Inference Pipeline)
```
[User Expressed State]
       ⬇ (상태-원인 매핑 행렬)
[Root Cause]
       ⬇ (원인-역할 매핑 행렬)
[Role (군/신/좌/사)]
       ⬇ (역할-기능 매핑 행렬)
[Standard Function (SF001~SF025)]
       ⬇ (기능-식재료/키트 매핑)
[Yakseon Kit Module]  +  [Base Recipe]
       ⬇ (주방 조리 결합)
[Premium Upgraded Menu Recommendation]
```

---

## 2. 전역 분류 표준 (Global Classification Standards)

전체 시스템에서 사용하는 식재료, 레시피, 식단 포맷은 아래의 표준 분류 체계를 반드시 준수해야 합니다.

### A. 레시피 계층 분류 (Recipe Target Tiers)
* **`GENERAL` (일반 식사군)**: 의약품용 약재를 일절 포함하지 않고, 식품 공전에 등록된 순수 식품 원료로만 구성된 식사. 일반 대중 및 프랜차이즈 고객 대상.
* **`TONIC` (체질 보양군)**: 신체 기능 보강 및 피로 회복을 위해 식품용 순한 약용 한약재(인삼, 황기, 당귀 등)가 가미된 보양 식사.
* **`THERAPEUTIC` (환자/요양 식사군)**: 특정 건강 상태(예: 고혈압, 당뇨, 회복기 환자)를 위해 영양소 및 염도를 엄격하게 제한하거나 특정 기능성 성분이 고농도로 가미된 관리용 식사.

### B. 식단 포맷 분류 (Meal Formats)
* **`BANSANG_5` (5반상 식단)**: 밥, 국/탕, 김치 외 3가지 부식(나물, 구이 등)으로 구성된 일상적인 한식 상차림.
* **`BANSANG_10` (10반상 식단)**: 고급 연회나 정밀한 영양 관리를 위한 다채로운 부식 조화 식단.
* **`SPECIAL_SIGNATURE` (특선 단품요리)**: 삼계탕, 전복갈비찜, 장어구이 등 단일 메뉴 자체가 메인 보양 기능을 수행하는 특별 단품 메뉴.

### C. 메뉴 컴포넌트 분류 (Menu Component Categories)
* **`STAPLE` (주식류)**: 밥류, 죽류, 면류, 덮밥류 등 탄수화물 베이스의 메인 식사.
* **`SOUP_STEW` (탕류)**: 국, 탕, 찌개, 전골 등 육수 기반의 메뉴.
* **`MAIN_SIDE` (메인 부식류)**: 육류, 생선/해물류, 두부/콩류를 활용한 조림, 구이, 찜 등 단백질 중심의 주요 반찬.
* **`SUB_SIDE` (보조 부식류)**: 채소나물류, 볶음류, 장아찌, 김치, 샐러드 등 보조 반찬.

### D. 식재료 카테고리 분류 (Ingredient Categories)
* **`MEAT` (육류)**: 소고기, 돼지고기, 닭고기, 오리고기 등 육식 원료.
* **`FISH` (생선/해물류)**: 조기, 가자미, 가오리, 문어, 전복, 조개류, 게 등 수산물 원료.
* **`VEGETABLE` (채소/버섯류)**: 가지, 무, 미나리, 고사리, 표고버섯, 숙주 등 채식 원료.
* **`GRAIN` (곡류/콩류/견과류)**: 쌀, 보리, 율무, 검은콩, 참깨, 밤, 잣 등 탄수화물 및 식물성 단백질 원료.
* **`HERB` (한약재)**: 황기, 인삼, 당귀, 천궁, 숙지황, 복령 등 약용 식물 원료.
* **`OTHER` (기타)**: 우유, 달걀, 가공식품 등.

---

## 3. 관계형 통합 지식 베이스 설계 (`M04-00_UNIFIED_KNOWLEDGE_BASE.xlsx`)

다층 데이터를 효율적으로 결합하고 추적성을 유지하기 위해 하나의 엑셀 파일에 아래 3개의 논리 마스터 시트를 구축합니다.

### A. `INGREDIENT_MASTER` (식재료 및 약재 마스터)
모든 원료의 분류, 한의학적 기미론, 현대 과학적 성분 및 매핑된 기능 코드를 기록합니다.
* `INGREDIENT_ID`: 원료 고유 ID (`H0001~` 약재, `I0001~` 일반 식재료)
* `INGREDIENT_NAME`: 원료 국문명 (예: 황기, 가자미)
* `LATIN_NAME`: 학명 (예: *Astragalus membranaceus*)
* `ENGLISH_NAME`: 영문 표준명 (예: Milkvetch Root)
* `CATEGORY`: 식재료 카테고리 (MEAT, FISH, VEGETABLE 등)
* `ACTIVE_COMPOUNDS`: 주요 현대 활성/지표 성분 (예: Astragaloside IV, Decursin)
* `FIVE_ELEMENTS`: 오행 속성 (목, 화, 토, 금, 수)
* `ENERGY_PROPERTY`: 사기(四氣) 속성 (한, 량, 평, 온, 열)
* `TASTE_PROPERTY`: 오미(五味) 속성 (산, 고, 감, 신, 함, 담, 삽)
* `PRIMARY_SF_ID`: 1차 매핑 표준 기능 코드 (SF001 ~ SF025)
* `SECONDARY_SF_ID`: 2차 매핑 표준 기능 코드
* `TERTIARY_SF_ID`: 3차 매핑 표준 기능 코드
* `VERIFICATION_GRADE`: 임상/학술 검증 등급 (A, B, C)

### B. `RECIPE_MASTER` (레시피 마스터)
기본 한식 및 양식 레시피의 요리 정보 및 약선 키트 결합 여부를 관리합니다.
* `RECIPE_ID`: 레시피 고유 ID (`R0001~`)
* `RECIPE_NAME`: 요리명 (예: 가오리조림, 삼계탕)
* `MAIN_INGREDIENT`: 주 식재료명 (예: 가오리)
* `INGREDIENT_CATEGORY`: 주 식재료 분류 (FISH, MEAT, VEGETABLE 등)
* `MENU_COMPONENT`: 메뉴 컴포넌트 분류 (STAPLE, SOUP_STEW 등)
* `TARGET_TIER`: 레시피 계층 (GENERAL, TONIC, THERAPEUTIC)
* `MEAL_FORMAT`: 식단 포맷 (BANSANG_5, BANSANG_10, SPECIAL_SIGNATURE)
* `BASE_INGREDIENTS`: 기본 식재료 목록 (콤마 분할 텍스트)
* `COOKING_METHOD`: 표준 조리 방법 단계
* `COOKING_DESCRIPTION`: 조리 팁 및 상세 설명
* `DESCRIPTION`: 메뉴 설명
* `URL`: 레시피 출처 URL
* `UPGRADABLE`: 약선 키트 추가를 통한 프리미엄 업그레이드 가능 여부 (Yes/No)
* `MATCHED_YAKSEON_KIT_ID`: 기본 추천 매핑 약선 키트 ID (`K01 ~ K05`)

### C. `YAKSEON_KIT_MASTER` (프랜차이즈 모듈형 약선 키트 마스터)
실제 매장 주방에서 표준화된 원료로 바로 적용할 수 있는 액상 앰플 및 티백 필터 키트를 정의합니다.
* `KIT_ID`: 키트 고유 ID (`K01 ~ K05`)
* `KIT_NAME`: 키트 표준명 (예: 기력보강 앰플키트)
* `TARGET_ROOT_CAUSE_ID`: 타겟 근본 원인 코드 (`RC01 ~ RC05`)
* `TARGET_ROOT_CAUSE`: 타겟 근본 원인명 (예: 에너지부족)
* `TARGET_STANDARD_FUNCTION_IDS`: 타겟 표준 생리 기능 코드 리스트 (예: `SF012, SF022`)
* `TARGET_STANDARD_FUNCTIONS`: 타겟 표준 기능 설명
* `COMPOSITION`: 약재 구성 성분 및 중량 비율 (예: 황기 40%, 인삼 20%...)
* `DOSAGE_FORMAT`: 키트 제공 형태 (예: 10ml 액상 앰플, 15g 대형 티백)
* `FRANCHISE_KITCHEN_GUIDE`: 매장 조리원 매뉴얼 및 투입 타이밍 가이드
* `DESCRIPTION`: 제품 마케팅 및 기능 설명

---

## 4. 관계형 매핑 엔진 데이터 연계 (`04_MAPPING_ENGINE`)

추론 엔진 구동 및 검증을 위한 독립 행렬 파일들입니다. 이 파일들은 `M04-00` 통합 지식 베이스의 식재료와 기능을 서로 참조적 무결성(Referential Integrity)으로 연결합니다.

1. **`M04-03_ROOT_CAUSE_GROUP_MASTER_v1.0.xlsx`**: 근본 원인 5대 축 (`RC01~RC05`) 마스터
2. **`M04-04_STATE_MASTER_v1.0.xlsx`**: 18가지 신체상태군 (`ST-001~ST-018`) 마스터
3. **`M04-05_STATE_CAUSE_MAP_v1.0.xlsx` / `STATE_CAUSE_MATRIX`**: 상태 $\rightarrow$ 원인 변환 가중치 행렬
4. **`M04-06_CAUSE_ROLE_MAP_v1.0.xlsx` / `CAUSE_ROLE_MATRIX`**: 원인 $\rightarrow$ 역할(군, 신, 좌, 사) 매핑 행렬
5. **`M04-07_ROLE_FUNCTION_MAP_v1.0.xlsx` / `ROLE_FUNCTION_MATRIX`**: 역할 $\rightarrow$ 표준 생리 작용 기능 매핑 행렬
6. **`M04-08_CONSTITUTION_STATE_MATRIX_v1.0.xlsx`**: 사상체질별 상태 취약점 보정 행렬
7. **`M04-09_ORGAN_CAUSE_MATRIX_v1.0.xlsx`**: 장부(오장육부)별 원인 가중치 행렬
8. **`M04-10_ROLE_PRIORITY_RULE_MASTER_v1.0.xlsx`**: 처방 역할 우선순위 산출 룰

---

## 5. 프랜차이즈 주방 약선 키트 결합 워크플로우

매장(가맹점) 주방에서의 조리 동선 최적화 및 휴먼 에러 방지를 위해 약선 키트는 다음과 같은 표준 결합 프로세스를 가집니다.

```
[주문 접수: 상태 맞춤형 메뉴 선택]
        ⬇
[일반 베이스 메뉴 조리 시작 (예: R0003 가오리매운탕)]
        ⬇
[조리 중/후반 적시 타이밍에 지정된 약선 키트 투입]
   - K01 (기력보강): 조리 완료 5분 전 투입 (유효성분 추출 극대화)
   - K02 (순환온기): 소스 및 볶음유와 함께 최초 단계 투입
   - K03 (대사정화): 밑국물 우릴 때 최초 단계 투입
   - K04 (생기보호): 완성 직전 또는 식전/식후 캡슐 개별 제공 및 혼합
   - K05 (안심수면): 조리 완료 후 서빙 전 앰플 첨가 및 믹싱
        ⬇
[고객 서빙 및 태블릿/메뉴 카드를 통한 "약선 근거 정보" 노출]
```

---

## 6. 데이터 검증 및 감사 규칙 (Audit & Integrity Rules)

전체 지식 베이스와 매핑 행렬 구축 후, 다음 3가지 검증을 의무적으로 통과해야 합니다.
* **무결성 검사 (Referential Integrity)**: 레시피나 식재료 마스터에 지정된 모든 `SF_ID`는 표준 기능 인덱스(SF001~SF025)에 실제 존재하는 코드여야 합니다.
* **미분류 누락 검사 (Zero Unknowns Rule)**: 식재료 마스터 및 매핑 파일에 "미분류" 또는 결측치(`NaN`)가 없어야 합니다.
* **가중치 합 검사 (Weight Balance)**: 상태-원인 매핑 행렬의 가중치는 $0.0 \sim 1.0$ 범위를 유지하여 추론 계산의 오버플로우를 차단합니다.
