# Validation Framework

> **Module**: 17_ai_agent_orchestration_system — Document 07  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Validation Framework Overview

검증 프레임워크(Validation Framework)는 개별 에이전트가 실행 전후로 주고받는 데이터 메시지의 규격과 상태 적격성을 엄격히 통제하는 **보안 및 스키마 검증 수호 계층**이다.

```
       [에이전트 실행 시작]
                │
                ▼
  [Step 1: Pre-Execution Check]  ──→ 공유 메모리 필수 데이터 존재성 확인
                │
                ▼
      [에이전트 실행 완료]
                │
                ▼
 [Step 2: Post-Execution Check]  ──→ 에이전트 출력 JSON 스키마 유효성 검증
                │
                ▼
       [다음 에이전트로 진행]
```

---

## 2. Agent Output Schema Enforcement (스키마 수호 제약)

각 에이전트 실행 후 반환하는 출력 데이터는 `16_AGENT_PROTOCOL_INTERFACE.md`에 규정된 에이전트별 전용 JSON 스키마 필드를 완벽하게 충족해야 한다.

- **Pre-Check (사전 검증)**:
  - 예: `Content Generation Agent` 실행 전, `Shared Memory` 내에 `planning_data` 및 `retrieved_knowledge` 데이터가 정확히 준비되어 있는지 판별한다. 누락 시 에이전트 실행을 원천 차단하고 엔진에 에러를 인계한다.
- **Post-Check (사후 검증)**:
  - 예: `Media Agent` 실행 후, 반환값 내에 `thumbnail` 객체 및 `body_images` 목록이 존재하며 `alt` 속성이 문자열 형식으로 채워졌는지 유효성을 검사한다.

---

## 3. Sandboxed Local Isolation Rules (보안 샌드박스 수칙)

- **파일 시스템 R/W 통제**:
  - 임의의 외부 디렉터리에 대한 무단 접근 및 임의 스크립트 다운로드/실행을 엄격히 제한한다.
  - 모든 파일 쓰기 및 캐시 영속화는 `PlatformSettings`에 정의된 로컬 `data/` 임시 샌드박스 영역 내에서만 안전하게 실행되도록 경로 격리를 강제한다.
- **외부 런타임 차단**:
  - 에이전트 실행 로직 내에 로컬 터미널 명령을 통한 임의의 서브프로세스(`subprocess.run`) 실행을 금지하여, 악성 패키지가 시스템에 불시 유입되는 보안 취약점을 차단한다.
- **인터페이스 입력 검사**:
  - 에이전트의 입력으로 들어오는 문자열(예: 식재료 검색용 키워드)에 SQL Injection이나 Command Injection 유발 특수문자(예: `;`, `'`, `|`)가 포함되어 있는지 정적 필터링을 수행한다.
