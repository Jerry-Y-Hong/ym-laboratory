# Configuration Specification

> **Module**: 18_ai_product_factory — Document 05  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Product Configuration Binding Rules

설정 명세서(Configuration Specification)는 양산되는 개별 제품들이 공통 플랫폼의 전역 설정을 상속하되, 각 제품 디렉터리 내의 로컬 `config.json`을 통해 **동작 매개변수와 I/O 경로를 안전하게 격리 구성**하는 바인딩 규칙을 정의한다.

```
       [Platform Common Settings] (catalog.db 위치 등)
                   │
                   ▼ (Inherit & Merge)
         [Product Local config.json]
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
   [경로 격리 구성]     [에이전트 모델 설정]
 (posts_dir = data/)  (active_model = gemini)
```

---

## 2. Configuration Variables & Schemas

제품 생성 시 팩토리 빌더가 파싱하여 생성하는 local `config.json` 스펙:

### 2.1 Storage & Runtime Path Isolation (경로 격리)
- 각 제품의 입출력은 절대 공통 플랫폼이나 타 제품 폴더의 데이터 영역을 직접 건드리지 않아야 한다.
  - `posts_directory`: `"data/posts"`
  - `failed_directory`: `"data/failed"`
  - `ready_directory`: `"data/ready_to_publish"`
  - `queue_file`: `"data/publish_queue.json"`

### 2.2 Execution Parameters
- 에이전트 오케스트레이션 엔진 구동 속성 제어.
  - `sandbox_mode`: `true` (로컬 격리 보안 샌드박스 실행 보장)
  - `max_retries`: `3` (에이전트 API 에러 재시도 횟수)
  - `rollback_limit`: `2` (품질 검증 실패 시 백트래킹 제한 횟수)

---

## 3. Product Config Template

```json
{
  "product_id": "PROD_KIMCHI_BLOG_SAAS",
  "system_env": "development",
  "database": {
    "sqlite_path": "data/catalog.db",
    "timeout_seconds": 30.0
  },
  "storage": {
    "posts_directory": "data/posts",
    "failed_directory": "data/failed",
    "ready_directory": "data/ready_to_publish",
    "queue_file": "data/publish_queue.json"
  },
  "ai_orchestration": {
    "vendor": "google",
    "model": "gemini-1.5-flash",
    "temperature": 0.1
  }
}
```

이 설정 템플릿은 제품 빌드 단계에서 복사되어 제품 폴더 루트에 이식된다. 이를 통해 다카테고리로 확장 시, `database.sqlite_path` 또는 `ai_orchestration.model` 등의 필드를 로컬 런타임 요구에 맞춰 안전하게 변경 구성할 수 있다.
Ref: [Development Configuration Guide](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/15_development_framework/05_CONFIGURATION_GUIDE.md)
