# Publishing Manager

> **Module**: 16_blog_automation_system — Document 07  
> **Version**: `v1.1`  
> **Status**: ✅ ACTIVE  

---

## 1. Publishing Preparation Role (발행 준비 역할 한정)

발행 관리자(Publishing Manager)는 외부 특정 블로그나 SNS 플랫폼 API와의 다이렉트 업로드 연동을 수행하지 않는다. 이는 플랫폼 종속성이 크고 외부 인증 만료 위험이 존재하기 때문이다. 

따라서 본 모듈은 품질 검증을 모두 마친 완제품 콘텐츠를 로컬 대기열(FIFO JSON Queue)에 적재하고, **발행 준비(Publishing Preparation)** 상태로 안전하게 영속 관리하는 데 그 역할을 한정한다.

```
[Validator 통과 콘텐츠 접수]
             │
             ▼
[발행 준비 적재 (FIFO 큐)] ──→ data/publish_queue.json 갱신 (Safe Write)
             │
             ▼
[정시 스케줄 배치 스캔]     ──→ 하루 2회 (KST 09:00, 20:00) 적격 대기 파일 선출
             │
             ▼
  [출력 디렉터리 배포]      ──→ data/ready_to_publish/ 격리 폴더에 마크다운 복사
             │
             ▼
   [최종 발행 완료 대기]    ──→ 플랫폼 연계 모듈이 ready_to_publish 폴더 스캔 후 연동
```

---

## 2. FIFO Preparation Queue & Scheduler Time Cycles

- **발행 적격 선출 주기**:
  - 오전 **09:00** 및 저녁 **20:00**에 배치 스케줄러가 구동되어, 대기열의 헤드(Head)에 위치한 콘텐츠를 `ready_to_publish` 영역으로 복사한다.
- **재시도 버퍼 (Retry Buffer)**:
  - 파일 쓰기 지연 등으로 발행 준비 영역 복사가 불완전해진 경우, 재시도 횟수(`retry_count`)를 1 증가시키고 다시 큐의 앞에 배치한다.
  - 최대 재시도 횟수(예: `MAX_RETRY_COUNT = 3`)를 초과하는 영속성 쓰기 오류가 발생하면 상태를 `failed`로 변경하고 큐에서 제외한 뒤 `Human Project Lead`에게 알림을 송신한다.

---

## 3. Preparation Queue Metadata Schema (JSON)

```json
{
  "queue_name": "kimchi_blog_publish_queue",
  "items": [
    {
      "content_id": "CNT_20260722_KIMCHI_001",
      "q_code": "Q_KIMCHI_001",
      "file_path": "data/posts/Q_KIMCHI_001_CNT_20260722_KIMCHI_001.md",
      "status": "ready_to_publish",
      "retry_count": 0,
      "priority": 1,
      "added_at": "2026-07-22T17:48:00+09:00"
    }
  ]
}
```

- **안전한 격리 설계**:
  - 외부로 전송될 최종 파일들은 `data/ready_to_publish/` 격리 폴더에 정형화된 메타데이터 파일과 함께 보관되어, 외부 송신기가 안전하게 가져갈 수 있도록 원자적 파일 처리를 완수한다.
