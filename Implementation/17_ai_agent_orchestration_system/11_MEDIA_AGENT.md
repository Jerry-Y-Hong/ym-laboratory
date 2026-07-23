# Media Agent

> **Module**: 17_ai_agent_orchestration_system — Document 11  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Media Agent Specifications

미디어 에이전트(Media Agent)는 작성된 아티클 콘텐츠에 적합한 멀티미디어 자산(이미지, 동영상, 썸네일, 아이콘) 경로를 매핑하고, SEO 강화를 위한 대체 텍스트(alt) 및 교육적 보충 설명을 제공하는 캡션을 생성하여 삽입구를 자동 바인딩하는 에이전트이다.

```
                  ┌──────────────────────┐
                  │     Media Agent      │
                  └──────────┬───────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   [Inputs (Request)]                [Outputs (Response)]
 - content_id: 대상 콘텐츠 ID       - media_id: 매핑 관리 번호
 - q_code: 식재료 검색 코드          - assets_map: 썸네일, 본문 이미지,
 - draft_body: 원본 텍스트            동영상 경로 및 alt/caption 매핑 목록
```

---

## 2. Agent R&R (역할 및 책임)

- **자산 분류 배정**:
  - `q_code`를 기준으로 로컬 미디어 디렉터리를 스캔하거나 Mock 이미지 데이터베이스를 조회하여 해당 식재료에 매치되는 멀티미디어 파일 정보를 파악한다.
- **SEO Alt 태깅**:
  - 시각 장애인 접근성 및 검색 엔진 인덱싱을 지원하도록 맞춤형 alt 속성을 조합 생성한다.
- **인젝션 매핑**:
  - 원고의 주요 소단락 사이 등에 적정하게 미디어 태그(`![]()`)를 주입하여 최종 완성 원본 형태로 수정 보완한다.

---

## 3. Communication Interface Spec (JSON)

### 3.1 Input Schema
```json
{
  "run_id": "RUN_9c6e4251-404b-46e7-b7bd-36033c6938df",
  "command": "BIND_MEDIA",
  "params": {
    "content_id": "CNT_20260722_KIMCHI_001",
    "q_code": "Q_KIMCHI_001",
    "draft_body": "# 배추김치 영양성분\n본문 내용..."
  }
}
```

### 3.2 Output Schema
```json
{
  "status": "SUCCESS",
  "agent": "media_agent",
  "output": {
    "media_id": "MED_20260722_KIMCHI_001",
    "assets_map": {
      "thumbnail": {
        "path": "assets/media/kimchi/thumb_baechu.jpg",
        "alt": "배추김치 레시피 대표 썸네일"
      },
      "body_images": [
        {
          "path": "assets/media/kimchi/lacto_structure.png",
          "alt": "김치 유산균 구조 관찰 이미지",
          "caption": "배추김치의 유산균 구조"
        }
      ]
    },
    "modified_body": "# 배추김치 영양성분\n![대표 썸네일](assets/media/kimchi/thumb_baechu.jpg)\n본문 내용..."
  }
}
```
Ref: [Media Manager Document](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/16_blog_automation_system/04_MEDIA_MANAGER.md)
