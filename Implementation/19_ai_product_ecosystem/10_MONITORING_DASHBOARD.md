# Monitoring Dashboard

> **Module**: 19_ai_product_ecosystem — Document 10  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Unified Telemetry Dashboard (모니터링 대시보드 규격)

모니터링 대시보드(Monitoring Dashboard)는 에코시스템 하부에서 실행되는 개별 AI 제품 컨테이너의 Uptime, API 응답 지연 시간(Latency), 에러 발생률, 그리고 누적 LLM 토큰 사용 비용 메트릭을 실시간 수집 및 조회 화면에 맵핑하는 **관제 모니터링 시각 데이터 명세**이다.

```
       [08_DEPLOYMENT_CONTAINER 실행 로그 발생]
                         │
                         ▼
        [15_MONITORING_LOGGING_AGENT 수집]
                         │
                         ▼
       [Dashboard Telemetry ingestion API 인입]
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
    [정상 상태]                      [임계값 초과 상태]
 - 모니터링 지표 갱신            - 에러율 10% 돌파 등 감지
 - 대시보드 차트 전송            - 11_MAINTENANCE 경고 발령 및
                                   인간 지휘자 에스컬레이션 메일 발송
```

---

## 2. Telemetry Metrics & Visual Dimensions

대시보드 시각화 차트에 바인딩할 핵심 시계열 메트릭 정보:
- **System Health Status (Uptime)**: 각 에이전트 스케줄러의 살아있음(Heartbeat) 응답 주기 (5분 단위 갱신).
- **Latency Distribution**: 게이트웨이 요청부터 최종 마크다운 발행 준비 적재 완료까지의 실행 소요 밀리초(ms).
- **Error Count & Fail Rate**: 전체 기획/생성/검증 파이프라인 시도 횟수 대비 최종 FAILED 상태 전이율 (목표 한계선: < 5%).
- **Token Overage billing**: 당월 고객사 라이선스 쿼터 대비 실시간 사용량 게이지 바 시각화.

---

## 3. Telemetry Log Data Schema (JSON)

```json
{
  "timestamp": "2026-07-22T18:09:00+09:00",
  "dashboard_run_summary": {
    "active_products_count": 1,
    "total_calls_today": 120,
    "average_latency_seconds": 12.8,
    "system_error_rate": 0.02,
    "aggregated_token_cost_usd": 4.25
  },
  "products_status": [
    {
      "product_id": "PROD_KIMCHI_BLOG_SAAS",
      "status": "RUNNING",
      "last_heartbeat": "2026-07-22T18:08:55+09:00",
      "today_errors_count": 2
    }
  ]
}
```
Ref: [Monitoring & Logging Agent](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/17_ai_agent_orchestration_system/15_MONITORING_LOGGING_AGENT.md)
