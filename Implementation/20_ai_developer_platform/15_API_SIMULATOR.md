# API Simulator

> **Module**: 20_ai_developer_platform — Document 15  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Network API Simulation Framework (API 시뮬레이터)

API 시뮬레이터(API Simulator)는 에코시스템 API 엔드포인트(라이선스 인증, 스토어 구매 등)를 로컬에서 연동 테스트할 때, **외부 네트워크 통신망을 타지 않고 로컬 HTTP 통신 혹은 인메모리 요청 가로채기(Intercepting) 기법을 통해 실제 API와 동일하게 동작하도록 지원하는 시뮬레이터**이다.

```
       [Partner Client API 호출] (POST /api/v1/license/verify)
                  │
                  ▼
       [YMLab APISimulator가 요청 가로채기]
                  │
         ┌────────┴────────┐
         ▼                 ▼
   [200 OK 모의]     [401 Expired 모의]
 (정상 키 정보 반환)   (에러 코드와 가짜 traceback 반환)
```

---

## 2. API Schema Validation & Latency Injection (지연 주입)

- **스키마 강제 대조 (API Schema Check)**:
  - 시뮬레이터는 인입되는 JSON Body의 구조가 `15_ECOSYSTEM_API.md` 표준 스키마와 정밀히 일치하는지 스캔하며, 필수 필드 누락 시 실제와 동일하게 400 Bad Request 에러를 내뿜어 개발자가 조기에 클라이언트 코드를 디버깅할 수 있게 제어한다.
- **물리적 네트워크 지연 주입**:
  - 로컬 구동 시 비정상적으로 빠른 처리 속도 때문에 포착하지 못하는 경쟁 상태(Race Condition)를 디버깅하기 위해, 시뮬레이터는 강제 지연(`time.sleep` 등)을 주입해 런타임 경쟁 정합성을 테스트할 수 있게 해 준다.

---

## 3. Simulator Control Schema (JSON)

```json
{
  "api_simulator": {
    "intercept_enabled": true,
    "latency_seconds": 0.5,
    "default_response_codes": {
      "/api/v1/store": 200,
      "/api/v1/license/verify": 200
    }
  }
}
```
Ref: [Ecosystem API Specification](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/19_ai_product_ecosystem/15_ECOSYSTEM_API.md)
