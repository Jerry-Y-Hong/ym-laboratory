# Product Module Registry

> **Module**: 18_ai_product_factory — Document 04  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Product Module Registry Architecture

제품 모듈 레지스트리(Product Module Registry)는 플랫폼 공통 서비스 모듈(Tier 1~4 SDK) 및 플러그인 에이전트의 위치, 지원 버전 명세, API 명명 정보를 종합 관리 및 배포하는 **플랫폼 중앙 자산 식별 디렉터리**이다.

```
       [Platform Common SDKs]       [Plug-in AI Agents]
                 │                           │
                 └─────────────┬─────────────┘
                               ▼
               [Product Module Registry 스캔]
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
     [Metadata Lookup]                     [Version Match Check]
  (Module ID, Classes, APIs)             (Minimum required versions)
```

---

## 2. Component Registries Specifications

레지스트리에 등록 관리되는 YM-LAB 대표 플랫폼 자산 리스트 규격:

### 2.1 Common SDK Modules (@ymlab/*)
- `MOD_110_API`: 외부 OpenAPI 호출 및 응답 파싱 클래스 모듈.
- `MOD_120_DB`: catalog.db SQLite 커넥션 타임아웃 및 세션 제어 라이브러리.
- `MOD_150_SHARED`: 공통 Custom Exception 및 Python Logging Standard 모듈.

### 2.2 Reusable Agent Swarms
- `planning_agent`, `content_generation_agent`, `media_agent`, `seo_agent`, `quality_validation_agent`, `publishing_preparation_agent`, `monitoring_logging_agent`.

---

## 3. Registry Manifest Schema (JSON)

레지스트리 목록과 각 버전 명세는 팩토리 빌더가 파싱할 수 있도록 아래 구조의 JSON 원장 파일(`registry.json`)로 구성 및 관리된다.

```json
{
  "registry_name": "ymlab_platform_module_registry",
  "version": "1.2.0",
  "modules": [
    {
      "module_id": "MOD_110_API",
      "package_name": "@ymlab/openapi-wrapper",
      "import_path": "platform.api.client",
      "version": "1.0.2",
      "dependencies": []
    },
    {
      "module_id": "MOD_120_DB",
      "package_name": "@ymlab/db-helper",
      "import_path": "platform.db.sqlite",
      "version": "1.1.0",
      "dependencies": []
    }
  ],
  "agents": [
    {
      "agent_id": "quality_validation_agent",
      "class_name": "QualityValidationAgent",
      "import_path": "orchestrator.agents.quality",
      "version": "1.0.0",
      "supported_models": ["gemini-1.5-flash", "claude-3-5-sonnet", "mock-model"]
    }
  ]
}
```

- **버전 정합성 검증**:
  - 블루프린트에 선언된 `version_spec`과 레지스트리 내 실제 모듈의 `version` 값을 세만틱 버저닝(Semantic Versioning) 규칙에 의거해 비교 분석하며, 의존성 충족이 안 될 시 제품 조립 빌드를 중단하고 차단 리포트를 생성한다.
Ref: [Development Naming Convention](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/15_development_framework/03_NAMING_CONVENTION.md)
