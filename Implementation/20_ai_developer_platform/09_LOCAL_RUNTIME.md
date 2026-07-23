# Local Runtime

> **Module**: 20_ai_developer_platform — Document 09  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Virtual Environment & Local Runtime Sandbox (로컬 런타임)

로컬 런타임(Local Runtime)은 개발자가 자신의 로컬 워크스테이션에서 신규 개발하거나 빌드한 AI 제품 인스턴스를 실제 운영 서버와 동일한 격리 수준으로 가동 및 시뮬레이션할 수 있도록 제어하는 **샌드박스 가상화 구동 계층**이다.

```
       [Developer Local PC]
                 │
                 ▼
       [가상환경 격리 스위치] (venv 또는 uv venv 구동 자동화)
                 │
                 ▼
       [의존성 빌드 린트] (pip install -r platform_libs/requirements.txt)
                 │
                 ▼
       [I/O 격리 감시 구동] (sys.path 격리 제어 및 data/ 스냅샷 생성)
                 │
                 ▼
       [Mock 서버 바인딩] (14_MOCK_SERVER 모의 DB & API 쿼리 전송)
```

---

## 2. Sandbox Runtime Execution & I/O Control (격리 및 제어)

- **가상 가동 디렉터리 동적 바인딩**:
  - `run.py` 실행 시작과 함께 프로세스의 현재 작업 디렉터리(`Cwd`)를 제품 폴더 루트로 즉시 고정하여, 외부 전역 파이썬 패키지나 상위 파일 시스템 영역으로의 비정상 쓰기 행위를 차단한다.
- **Python Path 정비**:
  - `sys.path` 최상단에 제품 고유의 `platform_libs/` 및 SDK 폴더를 명시적으로 끼워 넣어 플랫폼 라이브러리가 로컬 전역 패키지와 버전 충돌을 일으키지 않게 차단 격리한다.

---

## 3. Local Runtime Run Configuration (JSON)

런타임 구동 시 에코시스템이 생성 및 참조하는 런타임 메니페스트:

```json
{
  "runtime_id": "RUN_DEV_LOCAL_20260722_001",
  "product_id": "PROD_KIMCHI_BLOG_SAAS",
  "virtual_env_path": ".venv",
  "sandbox_enabled": true,
  "mapped_storage": {
    "posts_dir": "data/posts",
    "logs_dir": "data/logs",
    "catalog_db_path": "data/catalog.db"
  },
  "runtime_dependencies": [
    { "package": "pydantic", "version": "2.0.0" }
  ]
}
```
Ref: [Deployment Container Specifications](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/19_ai_product_ecosystem/08_DEPLOYMENT_CONTAINER.md)
