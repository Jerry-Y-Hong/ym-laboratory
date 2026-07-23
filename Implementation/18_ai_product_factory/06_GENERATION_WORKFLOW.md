# Generation Workflow

> **Module**: 18_ai_product_factory — Document 06  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Product Generation Workflow Sequence

제품 생성 워크플로우(Product Generation Workflow)는 선언적 블루프린트 분석부터 폴더 복사, 의존성 모듈 조립, 실행기 생성으로 이어지는 **자동화 빌드 파이프라인의 물리 실행 순서**를 정의한다.

```
       [WP-06: Product Generation 시작]
                     │
                     ▼
  [Step 1: Blueprint Loader]  ──→ json 명세 파싱 및 무결성 검증
                     │
                     ▼
  [Step 2: Template Copier]   ──→ product_template 폴더 구조 디스크 복제
                     │
                     ▼
  [Step 3: Dependency Linker] ──→ 레지스트리에서 MOD 및 Agent 코어 연계
                     │
                     ▼
  [Step 4: Config Injector]   ──→ 로컬 격리 경로 및 모델 매핑 JSON 주입
                     │
                     ▼
  [Step 5: Code Assembler]    ──→ run.py 진입점 스크립트 빌드
                     │
                     ▼
   [Step 6: Factory Validator]──→ verify_product.py 구동으로 빌드 확인
```

---

## 2. Dependency Resolution & Build Assembly Rules

- **의존 모듈 링크**:
  - 팩토리 엔진은 블루프린트에 선언된 의존 모듈(`dependencies`)이 `registry.json`에 등록되어 있는지 전수 확인하고, 해당 모듈 패키지의 물리 경로 링크를 생성 대상 제품 폴더의 `platform_libs/` 폴더 하위에 심볼릭 링크 또는 코드 사본 형태로 안전하게 격리 배치한다.
- **실행 진입점(run.py) 조립**:
  - `run.py` 실행 파일 내에는 블루프린트에 정의된 에이전트 오케스트레이션 DAG 호출 시퀀스가 텍스트 템플릿 엔진을 통해 자동으로 주입되어 조립 완성된다.

---

## 3. Product Generation Manifest Schema (JSON)

생성 완료 시 팩토리가 생성하여 보존하는 제품 생성 이력 매니페스트 구조:

```json
{
  "generation_run_id": "GEN_20260722_001",
  "blueprint_id": "BP_KIMCHI_BLOG_SAAS",
  "target_directory": "products/kimchi_blog_saas",
  "build_status": "success",
  "timestamp": "2026-07-22T18:04:00+09:00",
  "assembled_modules": [
    { "module_id": "MOD_110_API", "version": "1.0.2" },
    { "module_id": "MOD_120_DB", "version": "1.1.0" }
  ],
  "validation_result": "PASS"
}
```
Ref: [Directory Structure Template](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/15_development_framework/02_DIRECTORY_STRUCTURE.md)
