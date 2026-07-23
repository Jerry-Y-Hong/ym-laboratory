# API_SPECIFICATION.md

## 전체 API 개요
Phase 34 에서는 **Enterprise API** 집합을 정의하여 AI 직원, 워크플로, 모니터링, 학습 등 모든 구성 요소가 통일된 인터페이스를 통해 통신하도록 합니다. 아래는 주요 API 카테고리와 엔드포인트 예시입니다.

## 1. REST API
- **Base URL**: `https://api.company.com/aedw/v1`
- **인증**: Bearer 토큰 (JWT) – AERP 인증 서비스에서 발급.
- **공통 헤더**: `Content-Type: application/json`, `X-Request-ID`

### 엔드포인트 예시
| 카테고리 | 메서드 | 경로 | 설명 |
|----------|------|------|------|
| **Agent Registry** | `POST` | `/agents` | 새 에이전트 등록. |
| | `GET` | `/agents/{agentId}` | 에이전트 상세 조회. |
| | `PUT` | `/agents/{agentId}` | 에이전트 정보 업데이트. |
| **Task API** | `POST` | `/tasks` | 작업 생성·큐에 삽입. |
| | `GET` | `/tasks/{taskId}` | 작업 상태 조회. |
| | `PATCH` | `/tasks/{taskId}` | 작업 진행 업데이트(예: `status=completed`). |
| **Monitoring API** | `GET` | `/metrics/kpi` | KPI 메트릭 전체 조회. |
| | `GET` | `/metrics/kpi/{kpiName}` | 특정 KPI 상세. |
| **Learning API** | `POST` | `/learning/feedback` | 피드백 데이터 전송. |
| | `GET` | `/learning/knowledge` | 현재 지식 베이스 조회. |
| **Collaboration API** | `POST` | `/collab/message` | 에이전트 간 메시지 전송. |
| | `POST` | `/collab/approval` | 승인 요청 생성. |
| | `PATCH` | `/collab/approval/{requestId}` | 승인 응답 업데이트. |

## 2. Internal API (AERP 연계)
- **gRPC** 기반 고성능 서비스 호출 (예: `ComputeService`, `ModelService`).
- 서비스 정의는 `proto/aedw/*.proto` 에 위치.

## 3. Runtime API
- **Agent Runtime Bindings**: 에이전트가 AERP 런타임에 바인딩할 때 사용하는 API (`/runtime/bind`, `/runtime/unbind`).
- **Health Check**: `/runtime/health` – 에이전트 상태 확인.

## 4. Registry API
- **Discovery**: `/registry/discover?role=Developer` – 역할 기반 에이전트 탐색.
- **Versioning**: `/registry/versions/{agentId}` – 버전 히스토리 조회.

## 5. Security & Governance API
- **Policy Evaluation**: `/security/policy/evaluate` – 요청에 대한 정책 검사.
- **Audit Log**: `/security/audit` – 감사 로그 전송.

## 6. Error Handling & Standards
- **표준 오류 코드**: `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `422 Unprocessable Entity`, `500 Internal Server Error`.
- **오류 응답 포맷**: `{ "error": "CODE", "message": "설명", "details": { … } }`

---
*위 내용은 초기 골격이며, 실제 구현 시 상세 스키마와 인증·인가 정책을 추가합니다.*
