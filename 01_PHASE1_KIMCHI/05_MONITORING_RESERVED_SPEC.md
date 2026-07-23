# 글로벌 김치 AI 지식 플랫폼 (Global Kimchi AI Knowledge Platform)
## 모니터링 및 관측 가능성 상세 설계 명세서 (Reserved Architecture)

```
Status      : RESERVED (Future Extension via RFC)
Version     : 1.0.0 Baseline
Owner       : YM-LAB
Approved By : Architecture Review
Date        : 2026-07-20
```

> [!IMPORTANT]
> **RESERVED ARCHITECTURE NOTICE**  
> 본 명세서는 **v1.0.0의 직접 구현 대상이 아니며**, 향후 엔터프라이즈 운영 및 대규모 관측 가능성(Observability) 확보를 위해 사전 정의된 **예약 아키텍처(Reserved Architecture)**입니다. 향후 **v1.1.0 이상의 버전에서 RFC 승인 절차를 거쳐 활성화**됩니다.

---

### 1. Overview (목적 및 범위)

본 명세서는 플랫폼의 **운영 관측 가능성 표준(Operational Observability Specification)**을 정의합니다. Step 5(AI Orchestrator)에서 발생시킨 비동기 도메인 이벤트와 Telemetry Hook 데이터(`emitCost`, `emitTrace` 등)를 수집, 저장, 분석, 경보(Alert) 및 감사(Audit)하는 엔터프라이즈 통합 모니터링 체계를 규정합니다.

---

### 2. Monitoring Architecture

```
┌──────────────────────────────────────────────────────────┐
│             AI_ENGINE & Publisher Adapters               │
└──────────────────────────────────────────────────────────┘
                             │
                             ▼ (Telemetry Hook)
┌──────────────────────────────────────────────────────────┐
│                   Metrics & Trace Collector              │
└──────────────────────────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│                   Monitoring Engine                      │
│        (Metrics Store / Log Aggregator / Tracing)        │
└──────────────────────────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Real-time       │ │ Alert &         │ │ Compliance      │
│ Dashboards      │ │ Notification    │ │ Audit Trail     │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

### 3. Metrics Catalog (표준 메트릭 카탈로그)

#### 3.1 AI Generation Metrics
- `ai_token_usage_total`: Prompt Tokens & Completion Tokens 사용 수량
- `ai_prompt_bytes`: LLM으로 전달된 프롬프트 크기 (Bytes)
- `ai_completion_bytes`: LLM으로부터 반환된 생성 텍스트 크기 (Bytes)
- `ai_generation_duration_seconds`: LLM 추론 소요 시간 (Latency)
- `ai_cost_usd_total`: 요청별/모델별 소비된 추정 비용 (USD)
- `ai_provider_request_count`: LLM Provider (Gemini, Claude, GPT-4o)별 호출 횟수

#### 3.2 Workflow Metrics
- `workflow_success_rate`: 전체 AI 생성 성공률 (%)
- `workflow_failure_rate`: 전체 AI 생성 실패율 (%)
- `workflow_retry_count`: LLM Timeout 또는 Re-prompt 재시도 횟수
- `workflow_queue_length`: Orchestrator 대기 큐 크기 (Queue Length)
- `workflow_processing_duration_seconds`: Step 1 ~ Step 5 전체 워크플로우 처리 시간

#### 3.3 Publishing Metrics
- `publishing_success_count`: 채널별(WordPress, YouTube, Substack) 발행 성공 건수
- `publishing_failure_count`: 채널별 발행 실패 건수
- `publishing_retry_count`: Publishing Queue 자동 재시도 횟수
- `publishing_external_api_latency_seconds`: 외부 플랫폼 API 응답 지연 시간

---

### 4. Logging Specification (구조화 로그 스펙)

모든 로그는 JSON 형태의 **구조화된 로그(Structured JSON Log)** 포맷으로 출력됩니다.

#### 4.1 Log Levels
- **`DEBUG`**: 프롬프트 조립 변수, 임시 JSON 뷰
- **`INFO`**: 워크플로우 상태 전이 (`PROMPT_BUILT`, `COMPLETED`), 발행 완료
- **`WARN`**: LLM Timeout 재시도, Validation 경고, Rate Limit 근접
- **`ERROR`**: 6대 Validation 실패, 외부 API 5xx 오류, Fallback Provider 전환
- **`FATAL`**: DB Connection 붕괴, 시스템 복구 불가 장애

#### 4.2 Standard Log Payload Structure
```json
{
  "@timestamp": "2026-07-20T21:59:00.000Z",
  "log_level": "INFO",
  "service_name": "ai-engine-service",
  "trace_id": "tr-9b1deb4d3b7d4c81",
  "span_id": "sp-4a2f8e1a",
  "request_id": "req-88401a2b",
  "workflow_id": "wf-c550e12d",
  "content_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  "kimchi_code": "KIMCHI_PO GI_01",
  "llm_provider": "gemini-1.5-pro",
  "duration_ms": 3450,
  "token_usage": {
    "prompt_tokens": 1250,
    "completion_tokens": 840,
    "total_tokens": 2090
  },
  "message": "AI content generation completed and validated successfully.",
  "error_code": null
}
```

---

### 5. Distributed Trace (분산 추적 명세)

분산 MSA 및 비동기 퍼블리싱 환경을 대비하여 W3C Trace Context 표준을 준수합니다.

- **`trace_id`**: 단일 요청의 End-to-End 전체 식별자 (API -> Orchestrator -> LLM -> Queue -> Publisher)
- **`span_id`**: 각 개별 작업 단위의 식별자 (e.g. Prompt Building Span, LLM Call Span)
- **`parent_span_id`**: 상위 작업의 Span ID (Parent-Child 관계 추적)

---

### 6. Alert Policy (경보 정책 Matrix)

| Alert Rule Name | Condition (조건) | Severity | Channel | Action / Recovery |
| :--- | :--- | :--- | :--- | :--- |
| **HighErrorRate** | AI Generation Error Rate > 5% (5m) | **Warning** | Slack / Email | Provider Status 확인 |
| **CriticalErrorRate** | AI Generation Error Rate > 10% (5m) | **Critical** | PagerDuty / SMS | Circuit Breaker 수동 개입 |
| **QueueBacklog** | Orchestration Queue Length > 100 | **Warning** | Slack | Worker Horizontal Scaling |
| **CostDailyLimitExceeded**| Daily Cumulative Cost > $100 USD | **Critical** | Email / Push | High-Cost LLM 호출 차단 |
| **ExternalAPITimeout** | Publishing External Latency > 10s | **Warning** | Slack | Publishing Queue Delay 조정 |

---

### 7. Dashboard Specification

실시간 모니터링 대시보드는 다음 8대 전용 패널(Panel)로 구성됩니다.

1. **System Health Panel**: CPU, Memory, DB Connection Pool, Storage Uptime
2. **AI Generation Panel**: TPS, 평균 생성 Latency, 성공/실패 비율
3. **Cost Analytics Panel**: 일별/월별 누적 소비 비용 및 LLM 모델별 비용 비중
4. **Provider Status Panel**: Gemini, Claude, GPT-4o 가동 상태 및 Latency 비교
5. **Queue Status Panel**: Orchestrator Queue 및 Publishing Queue 대기 건수
6. **Publishing Status Panel**: WordPress, YouTube, Substack 등 채널별 성공률
7. **Error Trend Panel**: Error Code별 실시간 발생 카운트 그래프
8. **Daily KPI Panel**: 일일 생성 콘텐츠 수, 발행 콘텐츠 수, 평균 토큰 사용량

---

### 8. Audit Specification (감사 로그 명세)

시스템 운영 감사(Audit) 로그는 보안 및 규정 준수를 위해 일반 모니터링 로그와 완전히 분리되어 영구 보존됩니다.

- **감사 대상 행위 (Auditable Actions)**:
  - `CONFIG_UPDATE`: Template, Prompt, Persona, Rule Configuration 변경
  - `PUBLISH_APPROVE`: 에디터의 콘텐츠 최종 발행 승인
  - `RFC_APPROVE`: 아키텍처 변경 요청(RFC) 승인
  - `ADR_REGISTER`: 신규 ADR 등록 및 업데이트
  - `SYSTEM_ADMIN_ACCESS`: 관리자 권한으로 시스템 설정 변경

---

### 9. SLI / SLO / SLA (운영 목표 수치)

| Indicator (항목) | SLI (측정 지표) | SLO (운영 목표) | SLA (최저 보장) |
| :--- | :--- | :--- | :--- |
| **Service Availability** | Successful API Uptime / Total Time | **99.9%** | 99.5% |
| **API Response Time** | GET /api/v1/kimchis Response Time | **< 500ms (p95)** | < 2,000ms |
| **AI Generation Time** | Single Content Generation Duration | **< 15sec (p90)** | < 30sec |
| **Publishing Success** | Successfully Published / Total Queue | **> 99.0%** | > 95.0% |

---

### 10. Future Technology Integration (연계 가능 대상)

본 명세서는 특정 상용/오픈소스 제품에 종속되지 않는 계층 아키텍처를 지향하며, 향후 아래의 기술 표준과 호환 연계됩니다.

- **OpenTelemetry**: 표준 SDK 기반 Metrics & Trace Context Propagation
- **Prometheus & Grafana**: Time-Series Metrics 저장 및 가시화 대시보드
- **ELK Stack / OpenSearch**: JSON 구조화 Log Aggregation & Full-Text Search
- **Cloud Monitoring**: Google Cloud Operations / AWS CloudWatch 연동
