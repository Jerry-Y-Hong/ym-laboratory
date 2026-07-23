# Product Blueprint Specification

> **Module**: 18_ai_product_factory — Document 02  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Product Blueprint Concept

제품 블루프린트(Product Blueprint)는 새로운 AI 지식 서비스의 요구사항, 종속 모듈 목록, 스케줄링 옵션 및 에이전트 워크플로우 결합 방식을 선언적 텍스트 형식으로 기술한 **제품 제조 규격 정의서**이다.

```
                   ┌──────────────────────────┐
                   │    Product Blueprint     │
                   └────────────┬─────────────┘
                                │
         ┌──────────────────────┼──────────────────────┐
         ▼                      ▼                      ▼
  [Product Metadata]    [Module Registry Link]  [Workflow Engine Map]
(ID, Name, Version)      (Required Tier SDKs)     (Agent Swarm Dags)
```

---

## 2. Blueprint Schema Details

- **제품 식별 필드**: 제품의 고유 번호, 버전 정보 등을 기술한다.
- **모듈 바인딩 명세**: `100_PLATFORM` 하부 공통 패키지 중 인젝션할 Tier 코드 명세.
- **워크플로우 라우팅**: 오케스트레이션 엔진이 판독하여 순차 수행할 DAG 단계 맵.

---

## 3. Blueprint Manifest Specification (YAML/JSON)

팩토리 엔진이 파싱할 수 있도록 아래 구조의 JSON 규격을 표준으로 지정한다.

```json
{
  "blueprint_id": "BP_KIMCHI_BLOG_SAAS",
  "product_name": "김치 블로그 자동화 서비스",
  "version": "1.0.0",
  "category": "kimchi",
  "dependencies": {
    "platform_modules": [
      { "module_id": "MOD_110_API", "version_spec": ">=1.0.0" },
      { "module_id": "MOD_120_DB", "version_spec": ">=1.0.0" }
    ],
    "orchestrated_agents": [
      "planning_agent",
      "content_generation_agent",
      "media_agent",
      "seo_agent",
      "quality_validation_agent",
      "publishing_preparation_agent"
    ]
  },
  "runtime_settings": {
    "execution_mode": "sandbox",
    "schedule_cron": "0 9,20 * * *",
    "config_file": "config.json"
  }
}
```

- **다카테고리 식품군 확장성**:
  - `mushroom-saas` 등 신규 식재료 제품군 추가 시, 이 블루프린트 파일 하나만 생성(`BP_MUSHROOM_SAAS`)하고 `category`와 `dependencies` 필드 세팅을 변경 등록해 주면 팩토리 엔진이 새로운 모듈들을 감지하여 별도의 코드 수정 없이 신규 제품 디렉터리 형상을 조립 및 자동 완성해 낸다.
