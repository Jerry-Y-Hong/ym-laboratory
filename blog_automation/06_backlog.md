# Backlog — Blog Automation System Phase 01

> **목적**: 현재 Phase 01 범위를 벗어나는 아이디어를 기록한다.  
> **규칙**: Backlog에 등록된 항목은 현재 Phase에서 구현하지 않는다.  

---

## 1. 플랫폼 연동 (Post-MVP)

| ID | 아이디어 | 관련 Phase 기준 |
| :--- | :--- | :--- |
| BL-001 | WordPress / Naver Blog REST API 실제 연동 | Phase 08 03_Blog Publishing_Workflow.md |
| BL-002 | Tistory API 연동 자동 발행 | Phase 08 |
| BL-003 | Platform Scheduler Service 연동 (APScheduler → platform-scheduler) | Platform Architecture 2.14 |
| BL-004 | Platform File Storage 연동 (로컬 JSON → platform-storage) | Platform Architecture 2.12 |
| BL-005 | Platform AI Engine 실제 LLM 연동 (Mock → platform-ai) | Platform Architecture 2.4 |

## 2. 콘텐츠 고도화

| ID | 아이디어 | 비고 |
| :--- | :--- | :--- |
| BL-006 | AI 이미지 자동 생성 (DALL-E, Stable Diffusion) 및 포스트 삽입 | Phase 08 08_IMAGE_PROMPT_MASTER 참조 |
| BL-007 | 비디오(YouTube Shorts) 스크립트 자동 생성 | 신규 기능 |
| BL-008 | 계절·날씨 기반 동적 콘텐츠 추천 | 신규 기능 |
| BL-009 | 독자 Q&A 자동 생성 섹션 (FAQ Schema 포함) | SEO 강화 |

## 3. 다도메인 확장

| ID | 아이디어 | 비고 |
| :--- | :--- | :--- |
| BL-010 | 김치 외 다른 발효 식품(된장, 고추장) 도메인 확장 | Phase 01 완료 후 검토 |
| BL-011 | 영어·일본어·중국어 다국어 포스트 자동 번역·발행 | Platform Architecture 07_frontend_strategy i18n 참조 |
| BL-012 | 약선 레시피 블로그 도메인 별도 시스템 | Recipe AI Product 연관 |

## 4. 운영·모니터링

| ID | 아이디어 | 비고 |
| :--- | :--- | :--- |
| BL-013 | 발행 성과 분석 대시보드 (조회수, CTR, 체류 시간) | Platform Architecture 2.10 Monitoring |
| BL-014 | 포스트 성과 기반 자동 콘텐츠 재생성 (A/B Testing) | 신규 기능 |
| BL-015 | 댓글 자동 모니터링 및 응답 생성 | AI Engine 활용 |
| BL-016 | 구독자 이메일 뉴스레터 자동 발송 | Platform Architecture 2.8 Notification |

## 5. SEO 고도화

| ID | 아이디어 | 비고 |
| :--- | :--- | :--- |
| BL-017 | Google Search Console API 연동 (실제 검색 노출 데이터) | 외부 API |
| BL-018 | 내부 링크 자동 삽입 (발행된 포스트 간 자동 연결) | FR-02-4 SHOULD 항목 |
| BL-019 | 경쟁 키워드 분석 및 콘텐츠 갭 자동 탐지 | AI 기반 SEO 전략 |
