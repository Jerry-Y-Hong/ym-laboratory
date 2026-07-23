# Content Generation Agent

> **Module**: 17_ai_agent_orchestration_system — Document 10  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Content Generation Agent Specifications

콘텐츠 생성 에이전트(Content Generation Agent)는 `Shared Memory`로부터 기획안 정보와 그라운딩 컨텍스트를 로드하고, 지정된 매체 속성(`media_type`)에 맞춰 블로그, 카드뉴스, 뉴스레터, e-book 등 한식 교육에 특화된 다형 매체 콘텐츠 초안을 작성하는 에이전트이다.

```
                  ┌─────────────────────────────┐
                  │  Content Generation Agent   │
                  └─────────────┬───────────────┘
                                │
            ┌───────────────────┴───────────────────┐
            ▼                                       ▼
   [Inputs (Request)]                      [Outputs (Response)]
 - plan_id: 기획 연계 ID                 - content_id: 고유 생성 번호
 - media_type: blog, cardnews 등         - media_type / title
 - grounded_context: RAG 수치 정보       - draft_body: 생성 원고 데이터
```

---

## 2. Agent R&R (역할 및 책임)

- **매체 최적화 포맷팅**:
  - `media_type`별 제약 사항(길이, 챕터 구성, 슬라이드 레이아웃)을 준수한 초안을 작성한다.
- **할루시네이션 원천 제어**:
  - 주입된 `grounded_context` 외의 영양 수치 임의 작성을 철저히 방지하는 프롬프트 제어를 적용한다.
- **출력 직렬화**:
  - 결과물을 구조화 마크다운 파일로 드라이브에 저장하고, 메타데이터 정보를 `Shared Memory`에 바인딩한다.

---

## 3. Communication Interface Spec (JSON)

### 3.1 Input Schema
```json
{
  "run_id": "RUN_9c6e4251-404b-46e7-b7bd-36033c6938df",
  "command": "GENERATE_DRAFT",
  "params": {
    "plan_id": "PLAN_20260722_KIMCHI_001",
    "media_type": "blog",
    "grounded_context": "배추김치(Q_KIMCHI_001)의 나트륨 수치는 630mg 입니다.",
    "core_keywords": ["배추김치 영양성분"]
  }
}
```

### 3.2 Output Schema
```json
{
  "status": "SUCCESS",
  "agent": "content_generation_agent",
  "output": {
    "content_id": "CNT_20260722_KIMCHI_001",
    "media_type": "blog",
    "title": "배추김치 영양성분과 나트륨 균형",
    "draft_body": "# 배추김치 영양성분과 나트륨 균형\n배추김치 100g 당 나트륨은 630mg 포함되어 있습니다.",
    "file_path": "data/posts/Q_KIMCHI_001_CNT_20260722_KIMCHI_001.md"
  }
}
```
