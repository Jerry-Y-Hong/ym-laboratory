# Shared Memory

> **Module**: 17_ai_agent_orchestration_system — Document 04  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Shared Memory Architecture

공유 메모리(Shared Memory)는 워크플로우에 결합된 개별 에이전트들이 생성한 결과 데이터를 임시 저장하고, 다음 단계 에이전트가 이를 조회해 연속 가공할 수 있도록 지원하는 **메모리 기반 중간 자산 캐시 스페이스**이다.

```
       [Planning Agent] ──→ 기획 매니페스트 저장 ──→ [Shared Memory]
                                                         │ (Read)
                                                         ▼
       [Generation Agent] ←── 기획안 수신 조회 ───────────┘
```

---

## 2. Shared Memory Caching Data Structures

공유 메모리는 런타임에 파이썬 딕셔너리(`dict`) 형태의 인메모리 저장소로 관리되며, 오케스트레이션 Run 완료 후에는 `data/runs/{run_id}_memory.json` 파일에 저장되어 분석용으로 남겨진다.

### 2.1 Memory Payload Structures
- `planning_data`: 식재료 명칭, 기획 핵심 키워드, 타겟 그룹
- `retrieved_knowledge`: `catalog.db` 쿼리를 통해 바인딩된 영양 성분 수치 텍스트
- `generated_content`: 생성된 마크다운 텍스트 및 메타프론트매터
- `media_data`: 썸네일, 이미지 캡션 및 alt 바인딩 목록
- `seo_report`: SEO 밀도 및 구조 점검 최종 유효성 보고서
- `validation_report`: 5대 관문 최종 정합성 유효 검증 보고서

---

## 3. Shared Memory R/W Rules & Locking Prevention

- **쓰기 격리 (Write Isolation)**:
  - 오직 현재 활성화 상태인 에이전트만이 본인의 전용 메모리 키값(예: `generated_content`)에만 값을 쓸 수 있다. 다른 에이전트 영역의 데이터를 무단 수정하는 덮어쓰기 침해는 금지된다.
- **읽기 전용 공유**:
  - 다른 단계 에이전트는 이미 쓰여진 공유 메모리 데이터를 읽을(Read) 수만 있으며, 참조 시 복사본(`copy.deepcopy()`)을 전달받아 메모리 훼손을 차단한다.
- **안전한 JSON 디스크 동기화 (Disk Sync)**:
  - 인메모리 데이터를 디스크에 직렬화 영속화할 때는 원자적 덮어쓰기 방식을 고수하여 로컬 디스크 I/O 오류로 인한 큐 파일 깨짐을 전면 예방한다.
