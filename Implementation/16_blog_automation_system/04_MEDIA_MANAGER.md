# Media Manager

> **Module**: 16_blog_automation_system — Document 04  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Media Asset Pipeline Overview

미디어 관리자(Media Manager)는 단순 이미지를 넘어 동영상, 썸네일, 교육용 아이콘 등 아티클 및 멀티미디어 교육 자산 전반을 식재료 온톨로지에 매핑하여 배치하며, SEO 강화를 위한 대체 텍스트(alt) 최적화를 자동화한다.

```
[초안 콘텐츠 식별] (Blog, Cardnews, Newsletter 등)
         │
         ▼
[필요 미디어 자산 목록 조회] ──→ 이미지, 동영상, 썸네일 경로 추출
         │
         ▼
[미디어별 대체 설명(alt) 생성] ──→ 미디어 유형에 맞춤화된 SEO 태그 매핑
         │
         ▼
[자산 삽입구 바인딩]          ──→ 마크다운 미디어 태그 및 JSON 슬라이드 결합
```

---

## 2. Multi-Media Asset Classifications

시스템이 관리하는 4대 코어 미디어 카테고리 규격:

- **이미지 (Image)**: 한식 조리 사진 및 영양소 다이어그램. (`alt` 속성 강제)
- **동영상 (Video)**: 한식 교육 조리 가이드 클립. (재생 경로 및 캡션 바인딩)
- **썸네일 (Thumbnail)**: 블로그 및 SNS 업로드용 메인 타일 이미지. (크기 규격화)
- **아이콘 (Icon)**: 영양 성분별 직관적인 시각 인디케이터 배지.

---

## 3. Media Mapping Metadata Schema (JSON)

```json
{
  "media_id": "MED_20260722_KIMCHI_001",
  "q_code": "Q_KIMCHI_001",
  "assets": {
    "thumbnail": {
      "path": "assets/media/kimchi/thumb_baechu.jpg",
      "alt": "배추김치 레시피 대표 썸네일"
    },
    "body_images": [
      {
        "path": "assets/media/kimchi/lacto_structure.png",
        "alt": "김치 유산균 현미경 사진 - 락토바실러스 구조",
        "caption": "김치 발효 7일차의 유산균 관찰"
      }
    ],
    "video": {
      "path": "assets/media/kimchi/cook_guide.mp4",
      "duration_seconds": 180,
      "caption": "염도 1.2%의 저염 김치 조리 동영상 가이드"
    }
  },
  "created_at": "2026-07-22T17:48:00+09:00"
}
```

이 규칙은 썸네일 규격 검증 및 비디오 경로 바인딩 로직을 모듈형 클래스 형태로 분리하고, Q-Code 기반으로 폴더를 격리 관리(`assets/media/{category}/`)함으로써 다변화되는 멀티미디어 자산을 로컬 환경에서 충돌 없이 질서정형하게 보존한다.
