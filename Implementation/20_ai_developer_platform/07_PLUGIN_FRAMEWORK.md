# Plugin Framework

> **Module**: 20_ai_developer_platform — Document 07  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Agent Plugin Socket Interface Rules (플러그인 프레임워크)

플러그인 프레임워크(Plugin Framework)는 외부 개발자나 B2B 파트너사가 자신만의 독자적인 AI 에이전트를 구현하고, 이를 YM-LAB 워크플로우 엔진에 연동할 수 있도록 지원하는 **추상 부모 클래스 소켓 규격**이다.

```
       [YMLab Workflow Engine]
                  │ (JSON Message 호출)
                  ▼
         [AgentSocket 래퍼 계층]
                  │
                  ▼
        [BaseYMLabAgent 추상 상속]
                  │
       ┌──────────┴──────────┐
       ▼                     ▼
  [Custom Logic 1]      [Custom Logic 2]
(B2B 특화 SEO 분석)   (파트너 전용 이미지필터)
```

---

## 2. Plugin Abstraction & Registration Protocols

- **추상 상속 표준**:
  - 모든 플러그인 에이전트는 SDK 내의 `BaseYMLabAgent` 클래스를 반드시 상속하여 구현되어야 한다.
  - `execute` 추상 메소드를 오버라이드하여 공통 JSON 입력 메시지를 파싱 처리하고 동일 규격의 JSON 출력/에러 메시지를 리턴하도록 보장한다.
- **선언적 등록**:
  - 플러그인은 엔진 물리 소스를 침범하지 않고, 에코시스템 설정 파일(`plugins.json`)에 임포트 경로와 지원 커맨드를 선언 등록하여 가동된다.

---

## 3. Plugin Class Specification (Python SDK Abstract Example)

```python
from abc import ABC, abstractmethod

class BaseYMLabAgent(ABC):
    """모든 YM-LAB 에이전트 플러그인의 모태가 되는 추상 베이스 클래스"""
    def __init__(self, settings: dict):
        self.settings = settings

    @abstractmethod
    def execute(self, request_payload: dict) -> dict:
        """에이전트 실행 진입점.
        
        Args:
            request_payload (dict): 16_AGENT_PROTOCOL_INTERFACE 규격 JSON
            
        Returns:
            dict: SUCCESS/ERROR 규격 JSON 응답
        """
        pass

class CustomSEOAgent(BaseYMLabAgent):
    """B2B 파트너가 자체 구현한 커스텀 SEO 필터링 플러그인 예제"""
    def execute(self, request_payload: dict) -> dict:
        params = request_payload.get("params", {})
        body_text = params.get("draft_body", "")
        
        # 비즈니스 로직 수행...
        score = 95
        
        return {
            "status": "SUCCESS",
            "agent": "custom_seo_agent",
            "output": {
                "seo_score": score,
                "passed": True
            }
        }
```
Ref: [Agent Protocol Specification](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/17_ai_agent_orchestration_system/16_AGENT_PROTOCOL_INTERFACE.md)
