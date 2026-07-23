# SDK Architecture

> **Module**: 20_ai_developer_platform — Document 03  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. YM-LAB Platform SDK Components (SDK 아키텍처)

YM-LAB 플랫폼 SDK(Developer SDK)는 개발자가 파이썬 개발 환경에서 YM-LAB의 데이터베이스, API 게이트웨이, 에이전트 오케스트레이션 엔진을 한 줄의 모듈 임포트(`import ymlab`)만으로 안전하게 호출 및 연동할 수 있도록 감싸서 제공하는 **추상 클래스 라이브러리 인터페이스**이다.

```
                         ┌──────────────────────┐
                         │      ymlab SDK       │
                         └──────────┬───────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
   [ymlab.db]                  [ymlab.agent]               [ymlab.api]
(SQLite Safe Connection)   (Abstract Agent Socket)    (Gateway Request Wrapper)
```

---

## 2. Library Modules & Wrappers

- **`ymlab.db`**:
  - `catalog.db` 연결을 리소스 누수 없이 제어하는 with-closing 컨텍스트 매니저 래퍼를 제공한다.
  - 데이터 쿼리 수행 시 SQLite 락 지연 타임아웃을 `PlatformSettings`와 연동하여 자동으로 적용해 준다.
- **`ymlab.agent`**:
  - 에이전트 소켓 메시지(`16_AGENT_PROTOCOL_INTERFACE.md`) 통신을 위한 규격화된 입출력 파서 및 `BaseAgent` 추상 부모 클래스를 제공한다.
- **`ymlab.api`**:
  - API 게이트웨이에 라이선스 키 및 토큰을 실어 에코시스템 API를 단발 호출할 수 있게 돕는 HTTP Client 래퍼 클래스를 제공한다.

---

## 3. SDK Python Module Entrypoint Spec

```python
# ymlab/__init__.py
"""YM-LAB AI Developer Platform SDK Core Library"""

from .db.connection import SafeDBConnector
from .agent.base import BaseAgent, AgentSocket
from .api.client import EcosystemClient
from .config.loader import load_platform_config

__all__ = [
    "SafeDBConnector",
    "BaseAgent",
    "AgentSocket",
    "EcosystemClient",
    "load_platform_config"
]
```

- **설계 제약 사항**:
  - SDK 라이브러리 내부 소스는 에이전트 개별 비즈니스 로직(예: 김치 재료 감별 등)을 하드 코딩해 포함하지 않는다. 오직 오케스트레이션 통신 수송, 라이선스 체크, DB 연결 안전 관리 등 순수 인프라적 제어 계층만 래핑 보증한다.
Ref: [Agent Protocol Specification](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/17_ai_agent_orchestration_system/16_AGENT_PROTOCOL_INTERFACE.md)
