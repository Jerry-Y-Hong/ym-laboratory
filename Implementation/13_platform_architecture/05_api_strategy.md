# API Strategy

> **Module**: 13_platform_architecture — Document 05  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Overview

YM-LAB Platform의 API 설계 원칙, 버전 관리, 수명 주기, 하위 호환성 정책을 정의한다.  
모든 Platform API는 API First 원칙에 따라 설계되며, OpenAPI 3.1 Spec이 Single Source of Truth이다.

---

## 2. API Categories

### 2.1 REST API (Platform Public API)

- **용도**: Product 및 외부 개발자가 사용하는 공개 API
- **Base URL**: `https://api.ymlab.io/api/platform/v{N}/`
- **인증**: Bearer JWT (OAuth2)
- **표준**: OpenAPI 3.1 Spec, JSON:API 또는 표준 JSON
- **응답 형식**:
  ```json
  {
    "data": { ... },
    "meta": { "version": "v1", "timestamp": "ISO8601" },
    "errors": []
  }
  ```

### 2.2 AI Service API (AI Engine API)

- **용도**: AI 에이전트, RAG, 임베딩, 생성형 AI 호출
- **Base URL**: `https://api.ymlab.io/api/platform/v1/ai/`
- **특이사항**: Streaming 지원 (SSE), 비동기 작업 지원 (Job ID 패턴)
- **인증**: Bearer JWT + AI API Key 이중 인증
- **Rate Limit**: 사용자 등급별 차등 (Free: 10 RPM, Pro: 100 RPM, Enterprise: 무제한)

### 2.3 Internal API (Platform 내부 서비스 간 통신)

- **용도**: Platform 서비스 간 내부 호출
- **Base URL**: `http://platform-{service}.platform.svc.cluster.local/`
- **인증**: mTLS (Mutual TLS) + Service Account Token
- **규칙**: 외부 노출 금지, API Gateway 미경유, Kubernetes Network Policy로 격리

### 2.4 External API (외부 서비스 연동)

- **용도**: Platform이 외부 서비스(Stripe, LLM 등)를 호출
- **관리**: Platform Service 내부에서만 직접 호출
- **Circuit Breaker**: 모든 외부 API 호출에 Resilience4j / tenacity 적용
- **Fallback**: 외부 API 장애 시 캐시 또는 Graceful Degradation

---

## 3. API Versioning Policy

### 3.1 URL Path Versioning

```
https://api.ymlab.io/api/platform/v1/auth/login
https://api.ymlab.io/api/platform/v2/auth/login   ← Breaking Change 시 버전 업
```

### 3.2 Version Lifecycle

| 단계 | 설명 | 기간 |
| :--- | :--- | :--- |
| **Active** | 현재 지원 버전. 신규 기능 추가 가능 | 무기한 |
| **Deprecated** | 지원 종료 예고. 마이그레이션 안내 발송 | 최소 12개월 |
| **Sunset** | 지원 종료. 호출 시 `410 Gone` 반환 | - |

### 3.3 Versioning Rules

| 변경 유형 | 버전 처리 |
| :--- | :--- |
| 신규 필드 추가 (하위 호환) | 마이너 버전 업 (기록만) |
| 필드 삭제 또는 타입 변경 | Major 버전 업 (v1 → v2) |
| 엔드포인트 추가 | 버전 변경 없음 |
| 엔드포인트 삭제 | Deprecate → Sunset 절차 |
| 인증 방식 변경 | Major 버전 업 필수 |

---

## 4. API Design Standards

### 4.1 Resource Naming

```
# 리소스: 복수 명사
GET    /api/platform/v1/users          ← 목록
GET    /api/platform/v1/users/{id}     ← 단건
POST   /api/platform/v1/users          ← 생성
PUT    /api/platform/v1/users/{id}     ← 전체 수정
PATCH  /api/platform/v1/users/{id}     ← 부분 수정
DELETE /api/platform/v1/users/{id}     ← 삭제

# 동작: 동사를 사용하는 경우 (Command 패턴)
POST /api/platform/v1/auth/logout
POST /api/platform/v1/ai/generate
POST /api/platform/v1/workflow/{id}/cancel
```

### 4.2 HTTP Status Codes

| 코드 | 의미 | 사용 조건 |
| :--- | :--- | :--- |
| 200 OK | 성공 | GET, PUT, PATCH 성공 |
| 201 Created | 생성 성공 | POST 성공, `Location` 헤더 포함 |
| 204 No Content | 성공 (응답 없음) | DELETE 성공 |
| 400 Bad Request | 요청 오류 | 유효성 검사 실패 |
| 401 Unauthorized | 미인증 | 토큰 없음 또는 만료 |
| 403 Forbidden | 권한 없음 | 인증 완료, 권한 부족 |
| 404 Not Found | 리소스 없음 | 존재하지 않는 리소스 |
| 409 Conflict | 충돌 | 중복 리소스 생성 시도 |
| 422 Unprocessable | 처리 불가 | 비즈니스 규칙 위반 |
| 429 Too Many Req | Rate Limit 초과 | `Retry-After` 헤더 포함 |
| 500 Server Error | 서버 오류 | 내부 오류 (스택 미노출) |

### 4.3 Pagination Standard

```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 500,
    "total_pages": 25
  },
  "links": {
    "self": "/api/platform/v1/users?page=1",
    "next": "/api/platform/v1/users?page=2",
    "prev": null
  }
}
```

### 4.4 Error Response Standard

```json
{
  "errors": [
    {
      "code": "VALIDATION_ERROR",
      "field": "email",
      "message": "올바른 이메일 형식이 아닙니다.",
      "detail": "Provided value 'notanemail' is not a valid email address."
    }
  ],
  "meta": {
    "request_id": "req_abc123",
    "timestamp": "2026-07-22T05:00:00Z"
  }
}
```

---

## 5. Backward Compatibility Policy

- **Non-Breaking Changes**: 응답 필드 추가, 선택적 요청 파라미터 추가 → 즉시 배포 가능
- **Breaking Changes**: 필드 제거, 타입 변경, 엔드포인트 삭제 → Major 버전 업 + 12개월 Deprecation 기간
- **Client 영향 최소화**: 클라이언트는 알 수 없는 필드를 무시(ignore unknown fields) 해야 함
- **Sunset 사전 통지**: Deprecation 발표 후 이메일·대시보드·응답 헤더(`Deprecation`, `Sunset`)로 3중 공지

---

## 6. API Lifecycle Management

```
[설계] OpenAPI Spec 작성 → 리뷰 (ARB)
    ↓
[개발] 코드 생성 (Spec-First) → 단위/통합 테스트
    ↓
[배포] Staging 검증 → API Gateway 등록
    ↓
[운영] 사용량 모니터링 → Rate Limit 튜닝
    ↓
[Deprecation] 공지 → 12개월 병행 지원
    ↓
[Sunset] 410 Gone 반환
```

---

## 7. API Security Requirements

| 요건 | 적용 방법 |
| :--- | :--- |
| 인증 강제 | API Gateway에서 JWT 검증 플러그인 전역 적용 |
| HTTPS Only | TLS 1.3 강제, HTTP → HTTPS 리디렉션 |
| CORS 정책 | Allowlist 기반 (와일드카드 금지) |
| Rate Limiting | API Gateway 레벨 + Service 레벨 이중 적용 |
| Input Validation | Pydantic / Zod 스키마 검증 강제 |
| Output Sanitization | 민감 정보 필터링 (비밀번호, 토큰 마스킹) |
