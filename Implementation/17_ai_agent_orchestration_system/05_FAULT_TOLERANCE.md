# Fault Tolerance Policy

> **Module**: 17_ai_agent_orchestration_system — Document 05  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Retry Policy & Exception Fallback (에이전트별 예외 복구 지침)

오케스트레이션 시스템 구동 중, 하부 개별 에이전트 단계에서 에러나 품질 미달이 감지될 경우 시스템이 급격히 크래시 종료되는 것을 막기 위한 예외 복구 및 복탄성(Resilience) 정책을 준수한다.

- **에이전트별 개별 타임아웃**:
  - LLM API를 사용하는 `Content Generation Agent` 등은 최대 **30초** 이내에 미응답 시 타임아웃 예외를 발생시키고 자체 복구를 기동한다.
- **재시도 정책 (Retry Rule)**:
  - 일시적 네트워크 에러나 호출 제한 발생 시 최대 **3회**까지 재시도를 수행하되, 재시도 간격에 점진적 대기 시간(Exponential Backoff: 1초, 2초, 4초)을 부여하여 시스템 부하를 방지한다.
- **기본값 Fallback**:
  - 미디어 관리나 번역 에이전트 등에서 최종 오류 발생 시, 샌드박스 안정성을 위해 빈 리스트나 디폴트 이미지 캡션을 자동 리턴하여 파이프라인 흐름을 깨지 않고 유지한다.

---

## 2. Backtracking Workflow & Action (백트래킹 상태 전이)

검증 및 품질 게이트 통과 실패 시, 단순히 에러 처리를 하고 죽는 대신 이전 유효했던 설계 단계로 **되돌아가서(Backtracking) 재수정**을 시도하는 복원 루프를 수행한다.

```
       [Quality Validation Agent 검증 실패]
                       │
                       ▼
    [실패 로그 분석 및 수정 지시서 작성]
                       │
                       ▼ (Backtrack Route)
   [Content Generation Agent 단계로 롤백 전이]
                       │
                       ▼
       [보완된 프롬프트로 재생성 재시도]
```

- **백트래킹 제한 수칙**:
  - 롤백 재작업 수행은 최대 **2회**로 제한한다. 2회 초과 시 무한 루프에 빠지는 현상을 차단하고, 파이프라인 전체 실행 상태를 `FAILED`로 전이한 뒤 종료한다.

---

## 3. Human Escalation Rules (인간 리더 개입 게이트)

오케스트레이션 엔진이 자가 복구할 수 없는 상태에 도달한 경우, 인간 지휘자(`Human Project Lead`)의 수동 조치 단계로 에스컬레이션(Escalation) 전파한다.

- **에스컬레이션 조건**:
  - 에이전트 3회 재시도 실패 및 백트래킹 2회 초과 시.
  - `catalog.db` 연결 불가능 또는 디바이스 쓰기 권한 차단 등의 시스템 원천 에러 발생 시.
- **보고 메시지 규격**:
  - 에러 로그에는 발생 지점 에이전트명, Run ID, 입력되었던 대상 Q-Code, 상세 Exception Traceback 정보가 JSON 구조로 포함되어 기록되어야 하며, 관리자 콘솔이나 특정 에러 메일함에 경고 로그로 즉각 인계한다.
