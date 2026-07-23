# Publishing Preparation Agent

> **Module**: 17_ai_agent_orchestration_system — Document 14  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Publishing Preparation Agent Specifications

발행 준비 에이전트(Publishing Preparation Agent)는 품질 검증을 완벽하게 마친 콘텐츠 파일과 관련 미디어/메타데이터를 로컬 선입선출(FIFO) 대기열 큐 파일에 적재하고 스케줄 주기에 맞춰 최종 발행 격리 폴더(`ready_to_publish/`)에 격리 복사하여 배포 준비를 완료하는 에이전트이다.

```
                  ┌──────────────────────────────┐
                  │ Publishing Prep Agent        │
                  └──────────────┬───────────────┘
                                 │
            ┌────────────────────┴────────────────────┐
            ▼                                         ▼
   [Inputs (Request)]                        [Outputs (Response)]
 - content_id: 검증 통과 콘텐츠 ID          - queue_status: 대기열 적재 여부
 - file_path: 마크다운 파일 물리 경로      - ready_file_path: 최종 발행 준비
 - q_code: 온톨로지 코드                      경로 (data/ready_to_publish/...)
```

---

## 2. Agent R&R (역할 및 책임)

- **큐 안전 쓰기 및 트랜잭션**:
  - `publish_queue.json` 파일을 열어 새로운 적격 아이템 객체를 푸시하고 임시 쓰기 규칙을 준수하여 덮어쓴다.
- **Ready 영역 배포**:
  - 큐 스케줄러 배치 구동 시, 큐 헤드의 대기 중인 마크다운 파일과 메타 JSON 데이터를 `data/ready_to_publish/` 폴더로 물리 복사하고 원본 소스의 무결성을 동결 보관한다.

---

## 3. Communication Interface Spec (JSON)

### 3.1 Input Schema
```json
{
  "run_id": "RUN_9c6e4251-404b-46e7-b7bd-36033c6938df",
  "command": "PREPARE_PUBLISH",
  "params": {
    "content_id": "CNT_20260722_KIMCHI_001",
    "q_code": "Q_KIMCHI_001",
    "file_path": "data/posts/Q_KIMCHI_001_CNT_20260722_KIMCHI_001.md"
  }
}
```

### 3.2 Output Schema
```json
{
  "status": "SUCCESS",
  "agent": "publishing_preparation_agent",
  "output": {
    "queue_status": "enqueued",
    "ready_file_path": "data/ready_to_publish/Q_KIMCHI_001_CNT_20260722_KIMCHI_001.md"
  }
}
```
Ref: [Publishing Manager Document](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/16_blog_automation_system/07_PUBLISHING_MANAGER.md)
