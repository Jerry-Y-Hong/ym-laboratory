# 글로벌 김치 AI 지식 플랫폼 (Global Kimchi AI Knowledge Platform)
## 엔터프라이즈 API Design Guide (v1.0.0 Baseline)

```
Status      : FROZEN
Version     : 1.0.0
Owner       : YM-LAB
Approved By : Architecture Review
Date        : 2026-07-20
```

---

### 1. 개요 및 거버넌스 원칙

본 문서는 **Architecture Freeze v1.0.0** 및 엔터프라이즈 RESTful API 설계 표준에 따라 플랫폼의 모든 엔드포인트(Endpoint)가 지켜야 할 **공통 API 설계 가이드라인**입니다.

---

### 2. API 설계 7대 표준 원칙

#### 2.1 URI Naming Conventions
- Base Path: `/api/v1`
- 리소스명은 복수형 명사(Plural Nouns)를 사용하며, 케밥 케이스(kebab-case)를 준수합니다.
- 예시:
  - `GET /api/v1/kimchis` (김치 리스트 조회)
  - `GET /api/v1/kimchis/{kimchi_id}` (특정 김치 단건 조회)
  - `GET /api/v1/kimchis/{kimchi_id}/recipes` (김치의 레시피 목록 조회)

#### 2.2 HTTP Method 사용 원칙
| Method | 용도 | Idempotent (생등성) |
| :--- | :--- | :--- |
| **GET** | 리소스 조회 (Read) | Yes |
| **POST** | 신규 리소스 생성 (Create) / AI 실행 명령 (Action) | No |
| **PUT** | 리소스 전체 수정 (Replace) | Yes |
| **PATCH** | 리소스 부분 수정 (Partial Update) | No |
| **DELETE** | 리소스 삭제 (Delete) | Yes |

#### 2.3 Response 표준 형식 (Response Envelope)

##### 성공 응답 (Success Envelope)
```json
{
  "success": true,
  "code": "OK",
  "message": "Request processed successfully.",
  "data": { ... },
  "timestamp": "2026-07-20T21:55:00Z"
}
```

##### 목록 성공 응답 (Paginated Response)
```json
{
  "success": true,
  "code": "OK",
  "message": "List retrieved successfully.",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total_elements": 150,
    "total_pages": 8,
    "has_next": true
  },
  "timestamp": "2026-07-20T21:55:00Z"
}
```

##### 실패 응답 (Error Response)
```json
{
  "success": false,
  "code": "ERR_KIMCHI_NOT_FOUND",
  "message": "The requested Kimchi Master ID does not exist.",
  "errors": [
    {
      "field": "kimchi_id",
      "reason": "UUID '1234' is invalid or not registered."
    }
  ],
  "timestamp": "2026-07-20T21:55:00Z"
}
```

#### 2.4 Error Code 규칙
- `ERR_[DOMAIN]_[CAUSE]` 포맷 적용
- 예시:
  - `ERR_COMMON_INVALID_INPUT` (400 Bad Request)
  - `ERR_AUTH_UNAUTHORIZED` (401 Unauthorized)
  - `ERR_AUTH_FORBIDDEN` (403 Forbidden)
  - `ERR_KIMCHI_NOT_FOUND` (404 Not Found)
  - `ERR_AI_VALIDATION_FAILED` (422 Unprocessable Entity)
  - `ERR_PUBLISH_RATE_LIMIT` (429 Too Many Requests)
  - `ERR_SYSTEM_INTERNAL_ERROR` (500 Internal Server Error)

#### 2.5 Pagination & Sorting 규칙
- Query Parameter: `?page=1&limit=20&sort_by=created_at&sort_dir=desc`
- `limit` 기본값은 20, 최대값은 100으로 규제합니다.

#### 2.6 Authentication & Authorization
- **Bearer JWT**: 사용자 및 에디터 API 인증 (`Authorization: Bearer <token>`)
- **API Key**: 시스템 간 인터페이스 및 타 플랫폼 어댑터 인증 (`X-API-KEY: <key>`)
- **OAuth2**: 글로벌 소셜 플랫폼 및 서드파티 발행 연동 인증

#### 2.7 API Versioning Policy
- URL Path Versioning 채택: `/api/v1/...`
- Non-breaking changes (필드 추가 등)는 현재 버전인 `/v1` 유지.
- Breaking changes (필드 삭제, 서식 파괴) 시 6단계 RFC를 통과하여 `/api/v2`로 승격.
