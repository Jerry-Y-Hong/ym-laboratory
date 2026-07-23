# Logging Framework

> **Module**: 20_ai_developer_platform — Document 12  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Python Logging Standard compliance (로깅 프레임워크)

로깅 프레임워크(Logging Framework)는 개발 표준(Phase 15 `04_LOGGING_STANDARD.md`)에 의거하여, 에코시스템 및 개별 에이전트들의 모든 가동 이벤트를 **파이썬 표준 로깅 모듈(`logging`) 인터페이스를 기반으로 수집·출력 및 물리 파일에 영속화하는 로깅 시스템**이다.

```
                  [Agent 실행 로그 메세지]
                             │
                             ▼
     [logging.Logger (ymlab_logger) 수집 인터페이스]
                             │
         ┌───────────────────┴───────────────────┐
         ▼                                       ▼
  [Console Handler]                     [File Handler]
 (DEBUG/INFO 표준 출력)                 (WARNING/ERROR 영속화)
                                                 │
                                                 ▼
                                        [Log Rotation 기동]
                              (10MB 단위 분할 및 data/logs/ 보관)
```

---

## 2. Logger Levels & Formatting Rules

개발자 플랫폼 내에서 가동되는 공통 로거 설정:
- **로그 레벨**:
  - `DEBUG`: 에이전트 소켓 JSON 메시지 전문, DB 연결 성공 여부.
  - `INFO`: 워크플로우 엔진 상태 전이 (`INIT` -> `RUNNING` -> `COMPLETED`).
  - `WARNING`: 에이전트 API 일시적 타임아웃, 재시도(Retry) 기동.
  - `ERROR`: 3회 재시도 초과 실패, 백트래킹 제한 2회 초과 시 에스컬레이션 로그.
- **로그 포맷**:
  ```text
  %(asctime)s [%(levelname)s] (%(name)s:%(lineno)d) - %(message)s
  ```

---

## 3. Logger Python Class Spec

SDK가 제공하는 공통 로깅 초기화 코드 예시:

```python
import logging
import os
from logging.handlers import RotatingFileHandler

def get_ymlab_logger(name: str) -> logging.Logger:
    """RotatingFileHandler가 적용된 YM-LAB 표준 로거 인스턴스 반환"""
    logger = logging.getLogger(name)
    if logger.hasHandlers():
        return logger
        
    logger.setLevel(logging.DEBUG)
    
    # 1. Console Handler
    c_handler = logging.StreamHandler()
    c_handler.setLevel(logging.INFO)
    c_format = logging.Formatter('%(asctime)s [%(levelname)s] %(name)s - %(message)s')
    c_handler.setFormatter(c_format)
    logger.addHandler(c_handler)
    
    # 2. File Handler (Safe rotation)
    os.makedirs("data/logs", exist_ok=True)
    f_handler = RotatingFileHandler(
        "data/logs/orchestration.log",
        maxBytes=10 * 1024 * 1024,  # 10MB
        backupCount=5,
        encoding="utf-8"
    )
    f_handler.setLevel(logging.WARNING)
    f_format = logging.Formatter('%(asctime)s [%(levelname)s] (%(name)s:%(lineno)d) - %(message)s')
    f_handler.setFormatter(f_format)
    logger.addHandler(f_handler)
    
    return logger
```
Ref: [Development Logging Standard](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/15_development_framework/04_LOGGING_STANDARD.md)
