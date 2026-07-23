# Configuration

> **Module**: 16_blog_automation_system — Document 11  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Unified Configuration File (config.json)

블로그 자동화 파이프라인의 유연한 제어 및 확장 환경 전환을 위해, 런타임 매개변수와 시스템 위치를 단일 JSON 설정 파일(`config.json`)을 통해 동적으로 격리 정의한다.

```
                  [config.json 로드]
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
   [모델 선택 정의]    [경로 설정 로드]    [프롬프트 파라미터]
   (Gemini, Claude)   (SQLite, JSON)      (Temperature 등)
```

---

## 2. Configuration Schema & Variables

YM-LAB 로컬 구동용 표준 설정 스키마 정의:

### 2.1 Model Selection (모델 선택)
- 사용 환경 및 예산에 따른 런타임 AI 엔진 모델 정의.
  - `active_vendor`: `"anthropic"` / `"google"` / `"openai"` / `"mock"`
  - `active_model`: `"claude-3-5-sonnet"` / `"gemini-1.5-pro"` / `"mock-model"`

### 2.2 Path Configuration & SQLite Location (경로 설정 및 DB 위치)
- 데이터 저장 물리 경로 및 `catalog.db` 위치 지정.
  - `sqlite_db_path`: `"data/catalog.db"` (약선 온톨로지 DB의 로컬 경로)
  - `output_post_dir`: `"data/posts/"` (생성된 마크다운 초안 위치)
  - `queue_json_path`: `"data/publish_queue.json"` (FIFO 대기열 큐 파일 경로)

### 2.3 Prompt Settings & Extensions (프롬프트 및 확장 옵션)
- 세부 텍스트 가공 속성 및 타 식품군 확장 설정.
  - `temperature`: `0.2` (할루시네이션 최소화를 위한 낮은 다양성 설정 권장)
  - `supported_categories`: `["kimchi", "rice", "mushroom"]` (다카테고리 허용 목록)

---

## 3. Configuration Schema Example (config.json)

```json
{
  "system_env": "development",
  "database": {
    "sqlite_path": "data/catalog.db",
    "timeout_seconds": 30.0
  },
  "storage": {
    "posts_directory": "data/posts",
    "failed_directory": "data/failed",
    "queue_file": "data/publish_queue.json"
  },
  "ai_orchestration": {
    "vendor": "google",
    "model": "gemini-1.5-flash",
    "temperature": 0.1,
    "max_tokens": 4096
  },
  "pipeline_settings": {
    "sandbox_mode": true,
    "max_retries": 3,
    "categories": ["kimchi"]
  }
}
```

이 설정 정보는 파이썬 런타임 시작 시 설정 클래스(`settings.py` 등)로 파싱되며, 하드코딩 없이 동작 경로 및 AI 모델 정보를 동적 교체할 수 있는 유연성을 제공한다.
