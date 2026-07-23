# Product Template Specification

> **Module**: 18_ai_product_factory — Document 03  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Product Template Directory Skeleton (제품 템플릿 골격)

제품 템플릿(Product Template)은 블루프린트에 선언된 데이터 구조를 실체화하기 위해 복제되는 **표준 코드 스켈레톤 트리 구조**를 명세한다. 

개발 표준(Phase 15) `02_DIRECTORY_STRUCTURE.md` 가이드라인과 100% 정합하도록 자동 설계된다.

```text
product_template/ (팩토리 복제 대상 소스 스켈레톤)
│
├── 01_requirements.md             # 제품 요구사항 정의서 (블루프린트 메타 기반 자동 생성)
├── 02_system_design.md            # 제품 상세 인터페이스 설계 구조 기술서
│
├── 03_content_pipeline/           # 제품 고유 구현 파이프라인
│   ├── __init__.py
│   └── runner.py                  # 에이전트 소켓 메시지 처리 제어부
│
├── 04_scheduler/                  # 로컬 실행 스케줄러 래퍼
│   ├── __init__.py
│   └── main_scheduler.py          # 정시 배치 실행 런타임 제어부
│
├── 05_storage/                    # 로컬 샌드박스 입출력
│   ├── __init__.py
│   └── file_handler.py            # Safe Write 파일 쓰기 래퍼
│
├── config.json                    # 제품 설정 파일 (모델 및 경로 정보 바인딩)
├── run.py                         # 제품 실행 진입점 스크립트
├── verify_product.py              # 제품별 자체 적격성 린트 스크립트
└── data/                          # 런타임 데이터 격리 영역
    ├── output/                    # 산출 가공물 저장소
    ├── failed/                    # 검증 실패물 격리 보관소
    └── publish_queue.json         # FIFO 발행 큐 파일
```

---

## 2. Configuration & Scheduler Templates

- **스케줄러 설정**:
  - `04_scheduler/main_scheduler.py`는 설정의 `schedule_cron` 명세를 읽어들여 파이썬 `sched` 표준 라이브러리 기반 로컬 타이머 루프를 구성한다.
- **설정 바인딩**:
  - 제품 디렉터리 내에 생성되는 `config.json`은 공통 플랫폼 설정 규격(Phase 16 `11_CONFIGURATION.md`) 스키마를 상속받아, 제품 고유의 샌드박스 쓰기 경로로 재정비되어 주입된다.

---

## 3. Product Template Packaging Rules

- **템플릿 불변성**:
  - 템플릿의 핵심 디렉터리 명칭(`01_requirements`, `02_system_design`, `03_content_pipeline` 등)은 임의로 수정할 수 없으며, 모든 제품은 이 명명 규칙을 준수하여 생성되어야 팩토리 검증 스크립트가 적격성을 인지할 수 있다.
- **Git 무결성 보존**:
  - 제품 템플릿 내의 `data/` 폴더는 `.gitignore` 템플릿 파일이 함께 생성 및 복사되어 리포지토리의 원본 무결성을 침해하지 않도록 통제된다.
