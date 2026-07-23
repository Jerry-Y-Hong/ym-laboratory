# Gateway Integration

> **Module**: 19_ai_product_ecosystem — Document 09  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. API Gateway Integration Routing

게이트웨이 연동(Gateway Integration)은 외부 파트너 클라이언트가 제품군의 API 및 에이전트 서비스 엔드포인트에 진입할 때 요청을 받아 **라이선스를 확인하고, 처리율을 제한(Rate Limiting)하며, 목표 제품 컨테이너로 안전하게 프록시 라우팅하는 단일 관문**이다.

```
       [Partner Client API 호출] (POST /api/v1/recipes)
                   │
                   ▼
  [Step 1: License Auth Engine] ──→ 만료일 및 활성 여부 체크
                   │
                   ▼
  [Step 2: Rate Limiting Guard] ──→ IP/키별 처리율 점검 (429 차단 분기)
                   │
                   ▼
   [Step 3: Dynamic Dispatcher] ──→ products/kimchi_blog_saas/run.py 연동
                   │
                   ▼
         [Client 응답 데이터 반환]
```

---

## 2. API Endpoint Layout & Rate Limiting Rules

게이트웨이가 제어하는 표준 API 엔드포인트 구조:
- `/api/v1/products`: 현재 라이선스로 다운로드/사용 가능한 활성 제품 카탈로그 목록 쿼리.
- `/api/v1/execute/{product_id}`: 특정 AI 에이전트 오케스트레이션 실행 요청 트리거.

### Rate Limiting (처리 한계율)
- **Standard Tier**: 동일 라이선스 키당 최대 **분당 10회 (10 RPM)** 및 **일간 1,000회 (1,000 RPD)** 호출로 엄격하게 제어한다. 초과 요청 시 `HTTP 429 Too Many Requests` 상태를 리턴하여 LLM API 폭탄 비용 유발을 방지한다.

---

## 3. Dynamic Gateway Schema (JSON)

```json
{
  "gateway_rules": {
    "listen_port": 8000,
    "environment": "development",
    "timeout_seconds": 30.0,
    "cors_origins": ["localhost:3000", "ymlab.com"],
    "endpoints": [
      {
        "path": "/api/v1/execute/PROD_KIMCHI_BLOG_SAAS",
        "methods": ["POST"],
        "target_container_path": "products/kimchi_blog_saas/run.py",
        "rate_limit_rpm": 10,
        "licensing_required": true
      }
    ]
  }
}
```
Ref: [Agent Protocol Specification](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/17_ai_agent_orchestration_system/16_AGENT_PROTOCOL_INTERFACE.md)
