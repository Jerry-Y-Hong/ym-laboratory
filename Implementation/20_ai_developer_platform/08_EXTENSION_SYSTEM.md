# Extension System

> **Module**: 20_ai_developer_platform — Document 08  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Pipeline Extensions & Custom Modules (확장 시스템)

확장 시스템(Extension System)은 개발자가 플랫폼의 코어 비즈니스 라이프사이클 흐름을 해치지 않으면서, **동영상/카드뉴스 등 새로운 미디어 인코더 모듈, 외부 채널 스케줄러 링크 및 커스텀 로컬 파일 핸들러 등을 안전하게 확장 바인딩(Injection)하기 위해 마련된 시스템**이다.

```
       [Workflow Execution 라이프사이클 훅 발생]
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
  [Pre-Step Hook]                 [Post-Step Hook]
 (실행 직전 확장 차단 체크)      (실행 직후 미디어 변환 필터)
         │                               │
         ▼                               ▼
   [Custom Handler]                 [Custom Encoder]
(IP/보안 필터링 등)               (HTML -> PDF 변환 링크 등)
```

---

## 2. Media Manager Extensions & Custom Schedulers

- **미디어 가공 가변성**:
  - `Media Agent`에 타사 이미지 합성엔진 및 HTML-to-PDF/HTML-to-CardNews 변환기를 모듈 플러그형으로 탑재할 수 있도록 미디어 인터페이스 훅(`media_encoder_hook`)을 제공한다.
- **커스텀 스케줄러 링크**:
  - `main_scheduler.py` 실행 시점에 개발자가 원하는 텔레그램 알림 스크립트나 로컬 큐 스와퍼 핸들러를 주입하여 런타임 수명 주기 중 특정 시점에 자동 트리거되도록 라이프사이클 이벤트를 분배한다.

---

## 3. Extension Hook Spec (Python Example)

```python
class YMLabExtensionManager:
    """플랫폼 실행 주기 전반의 확장 이벤트를 버퍼링 처리하는 매니저"""
    _hooks = {}

    @classmethod
    def register_hook(cls, event_name: str, handler_func):
        """특정 이벤트 시점에 실행될 커스텀 핸들러 함수를 등록"""
        if event_name not in cls._hooks:
            cls._hooks[event_name] = []
        cls._hooks[event_name].append(handler_func)

    @classmethod
    def trigger_hook(cls, event_name: str, context_data: dict):
        """이벤트 발생 시 등록된 핸들러들을 순차 호출하여 데이터 가공"""
        if event_name in cls._hooks:
            for handler in cls._hooks[event_name]:
                context_data = handler(context_data)
        return context_data
```

이 확장 매니저 설계를 통해, 플랫폼의 코어 오케스트레이션 엔진 코드를 한 줄도 수정하지 않은 상태에서 B2B 고객사의 다양한 이기종 결제/알림 채널 연동 요구사항을 손쉽게 커버할 수 있도록 보장한다.
Ref: [Media Manager Spec](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/16_blog_automation_system/04_MEDIA_MANAGER.md)
