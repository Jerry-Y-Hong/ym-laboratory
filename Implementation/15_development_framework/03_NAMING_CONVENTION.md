# Naming Convention

> **Module**: 15_development_framework — Document 03  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Directory and File Naming Rules

- **상위 카테고리 폴더**: 명확한 흐름을 나타내기 위해 숫자 번호와 스네이크 케이스를 결합한다.
  - 예: `01_PHASE1_KIMCHI`, `100_PLATFORM`, `12_governance`
- **구현 소스코드 파일**: 파이썬 표준 규격을 준수하여 소문자 스네이크 케이스(`snake_case`)를 강제한다.
  - 예: `content_generator.py`, `post_repository.py`
- **검증 스크립트 파일**: 반드시 `verify_` 접두사로 시작하며, 검증하려는 모듈의 명칭을 명시한다.
  - 예: `verify_blog_automation_phase01.py`
- **설계 및 거버넌스 문서**: 대문자 또는 숫자 번호와 스네이크 케이스로 작성하여 리포지토리 내에서 가독성을 보장한다.
  - 예: `01_DEVELOPMENT_STANDARD.md`, `01_AI_OPERATION_MANUAL.md`

---

## 2. Python Code Symbol Naming Rules

| 대상 | 표기법 | 예시 | 비고 |
| :--- | :--- | :--- | :--- |
| **클래스 (Class)** | 파스칼 케이스 (`PascalCase`) | `ContentGenerator`, `PostRepository` | 명사구 형태 지향 |
| **함수/메서드** | 소문자 스네이크 케이스 | `generate()`, `save_post()`, `exists_by_food_code()` | 동작을 나타내는 동사 접두사 권장 |
| **변수 / 매개변수** | 소문자 스네이크 케이스 | `food_code`, `target_keyword`, `is_publishable` | 직관적 명칭 사용 |
| **상수 (Constant)** | 대문자 스네이크 케이스 | `MAX_RETRY`, `SEO_PUBLISHABLE_THRESHOLD` | 모듈 최상위 선언 |
| **프라이빗 메서드** | 언더바 접두사 + 스네이크 | `_calc_keyword_density()`, `_load_index()` | 클래스 내부에서만 호출 |

---

## 3. Database Naming Rules (SQLite & JSON)

### 3.1 SQLite (catalog.db)
- YM-LAB PROJECT의 주 데이터베이스 파일인 `catalog.db` 내 테이블/컬럼 명명 규칙을 정의한다.
- **테이블명**: 복수 명사 사용을 지양하고 단수 명사 형태의 소문자 스네이크 케이스를 사용한다.
  - 예: `raw_payload`, `standard_food`, `knowledge_node`
- **기본키(PK)**: 테이블명 접두사 또는 의미 있는 코드 구조와 `_id`를 결합하여 명시한다.
  - 예: `raw_id`, `food_node_id`
- **외래키(FK)**: 대상 테이블의 기본키 명칭을 그대로 사용하여 추적성을 유지한다.

### 3.2 JSON 파일 및 속성명
- **파일명**: UUID 및 고유 식별 명칭을 스네이크 케이스로 결합한다.
  - 예: `{post_id}_{food_code}.md`, `index.json`
- **JSON 키값**: 소문자 스네이크 케이스를 사용하여 파이썬 딕셔너리 및 클래스 필드 바인딩 시 정렬되도록 관리한다.
  - 예: `"post_id"`, `"seo_score"`, `"created_at"`

---

## 4. Q-Code Naming Convention (온톨로지 코드)

Q-Code 식별 코드 체계는 약선 영양 지식의 고유한 논리 키값으로, 다음 구조를 준수한다.

```
Q_[FOOD_CATEGORY]_[INDEX]
```

- **구조 설명**: `Q_` 접두사로 시작하며, 대문자 식품 카테고리 약어와 3자리 숫자의 고유 인덱스를 조합한다.
- **예시**:
  - `Q_KIMCHI_001` (배추김치 코드)
  - `Q_INGREDIENT_042` (마늘 원재료 코드)
  - `Q_RECIPE_108` (특정 약선 레시피 코드)
