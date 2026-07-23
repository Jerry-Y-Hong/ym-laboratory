# Project Structure

> **Module**: 16_blog_automation_system — Document 09  
> **Version**: `v1.1`  
> **Status**: ✅ ACTIVE  

---

## 1. Directory Structure Mapping (Phase 15 규격 준수)

개발 프레임워크(Phase 15) `02_DIRECTORY_STRUCTURE.md`에 명시된 신규 도메인/제품 모듈 설계 표준을 준수하여 설계한 **김치 블로그 자동화 모듈**의 실제 리포지토리 구성 방식은 다음과 같다.

```text
blog_automation/
│
├── 01_requirements.md             # 김치 블로그 자동화 시스템 요구사항 정의서
├── 02_system_design.md            # 모듈 인터페이스 및 설계 정의서
│
├── 03_content_pipeline/           # 로컬 파이썬 구현 패키지 (핵심 로직)
│   ├── __init__.py
│   ├── content_planner.py         # 02_CONTENT_PLANNER 대응 파이썬 코드
│   ├── content_generation_engine.py # 03_CONTENT_GENERATION_ENGINE 대응 파이썬 코드
│   ├── media_manager.py           # 04_MEDIA_MANAGER 대응 파이썬 코드
│   ├── seo_engine.py              # 05_SEO_ENGINE 대응 파이썬 코드
│   └── quality_validator.py       # 06_QUALITY_VALIDATOR 대응 파이썬 코드
│
├── 04_scheduler/                  # 로컬 실행기 및 스케줄러 패키지
│   ├── __init__.py
│   ├── blog_scheduler.py          # 정시 발행 스케줄러 구동부
│   └── pipeline_runner.py         # run_pipeline.py의 내부 호출 래퍼
│
├── 05_storage/                    # 로컬 파일 기반 입출력 제어기 패키지
│   ├── __init__.py
│   ├── post_repository.py         # 개별 마크다운 파일 입출력 (Safe Write 구현)
│   ├── post_schema.py             # DTO 데이터 정의 모델
│   └── publish_queue.py           # FIFO 큐 입출력 제어기
│
├── 06_backlog.md                  # 추후 고도화 예정 백로그 항목 리스트
├── config.json                    # 11_CONFIGURATION 대응 통합 설정 파일
├── run_pipeline.py                # 파이프라인 E2E 통합 실행 스크립트
├── data/                          # 로컬 샌드박스 런타임 데이터 디렉터리 (Git 제외)
│   ├── posts/                     # 생성된 마크다운 초안 포스트 저장소
│   ├── failed/                    # 검증 실패하여 격리된 초안 저장소
│   ├── ready_to_publish/          # 최종 발행 준비된 결과물 격리 폴더
│   └── publish_queue.json         # FIFO 대기열 정보 파일
└── README.md                      # 패키지 구동 가이드라인
```

---

## 2. Component Design & Import Rules

- **단방향 참조**:
  - `03_content_pipeline`은 타 도메인에 종속되지 않으며 오직 `100_PLATFORM` 공통 라이브러리 및 자체 `05_storage` 모듈에만 순차적으로 참조 의존한다.
- **로컬 격리**:
  - 생성 파일 및 큐 정보가 저장되는 `data/` 디렉터리는 리포지토리의 무결성을 훼손하지 않도록 `.gitignore`에 추가되어 로컬 머신 내부에서만 독립적으로 구동된다.
