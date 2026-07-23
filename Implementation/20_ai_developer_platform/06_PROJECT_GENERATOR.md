# Project Generator

> **Module**: 20_ai_developer_platform — Document 06  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Project Generator Subsystem Architecture

프로젝트 생성기(Project Generator)는 CLI 명령(`ymlab-cli init`) 실행에 반응하여, `Template Library`의 불변 뼈대 디렉터리 형상을 목적지에 생성하고, 지정된 블루프린트 매니페스트 정보를 템플릿 엔진으로 주입 렌더링하여 **즉각 빌드 및 실행 가능한 완전한 독립 AI 제품 코드를 조립 완수하는 실행기 모듈**이다.

```
       [ymlab-cli init blueprint.json 실행]
                       │
                       ▼
    [블루프린트 정합성 및 의존 모듈 버전 분석]
                       │
                       ▼
       [Template Library 폴더 트리 원자적 복제]
                       │
                       ▼
     [Template Engine 렌더링 파일 순차 관통]
                       │
                       ▼
    [의존 라이브러리(platform_libs/) 링크 전개]
                       │
                       ▼
    [생성 완료 로그 및 verify_product.py 자가 린트 가동]
```

---

## 2. Skeleton Folder Setup & Module Dispatching (조립 수칙)

- **디렉터리 복제 무결성**:
  - 생성기는 타겟 폴더가 이미 비어있지 않은 경우 덮어쓰기 유실 경고를 알리며 실행을 중단한다.
  - 생성된 디바이스 내에 `.gitignore` 템플릿을 함께 배치하여 생성된 `data/` 파일들이 메인 공유 Git 트리에 무단 등재되지 않도록 개발 샌드박스 보안 격리를 수행한다.
- **모듈 디스패칭**:
  - `Product Module Registry`의 버전 데이터베이스를 쿼리하여 적격한 공통 모듈(@ymlab/*) 패키지 파일을 신규 생성된 제품 디렉터리 내의 `platform_libs/` 폴더로 물리적 복제 또는 심볼릭 배치한다.

---

## 3. Assembled Entrypoint (run.py Template)

생성기가 템플릿 엔진을 거쳐 최종 렌더링 조립해 내는 `run.py` 실행 제어 코드의 동적 구조 표준:

```python
import os
import sys

# 런타임 가상 가동 경로 설정
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(BASE_DIR)
sys.path.insert(0, os.path.join(BASE_DIR, 'platform_libs'))

from ymlab.config.loader import load_platform_config
from ymlab.agent.base import AgentSocket
from ymlab.db.connection import SafeDBConnector

def main():
    print("[RUN] Launching product: {{product_id}} (Version: {{version}})")
    config = load_platform_config("config.json")
    
    # 1. 에이전트 소켓 세션 가동
    # {{agent_workflow_calls_placeholder}}
    # 아래는 템플릿 렌더링에 의해 순차 조립된 실행부 예시
    print("[RUN] Sequential workflow executing: planning -> knowledge -> content_gen")
    
if __name__ == "__main__":
    main()
```
Ref: [Generation Workflow Spec](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/18_ai_product_factory/06_GENERATION_WORKFLOW.md)
