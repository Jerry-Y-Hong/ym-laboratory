# Error Handling Guide

> **Module**: 15_development_framework — Document 08  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Exception Handling Architecture (예외 처리 설계)

YM-LAB PROJECT는 비정상적인 입력값이나 파일 누락 등으로 인해 최상위 호출 프로세스가 불시에 비정상 종료(Crash)되는 것을 방지하기 위해 예외 전파 차단 구조를 준수한다.

### 1.1 Custom Exceptions Definition
- 공통 플랫폼 레이어 `100_PLATFORM/150_SHARED/exceptions.py`에 정의된 예외 클래스를 상속받아 도메인별 예외를 계층화한다.
- 예외 예시:
  ```python
  class YMLabException(Exception):
      """YM-LAB 프로젝트 공통 최상위 예외"""
      pass

  class DataIngestionError(YMLabException):
      """데이터 수집 실패 시 예외"""
      pass
  ```

### 1.2 Graceful Degradation Rules (우아한 성능 저하)
- 특정 함수 내에서 에러가 발생한 경우, 전체 시스템을 셧다운하지 않고 기본값(Fallback 데이터)을 반환하거나, 에러 상태 코드를 응답 객체에 기록하여 호출부에 안전하게 리턴한다.
- 예시:
  ```python
  try:
      data = repo.load_data(code)
  except FileNotFoundError as exc:
      logger.warning(f"File not found for {code}. Falling back to empty data: {exc}")
      data = get_fallback_default()  # 기본 안전값 반환
  ```

---

## 2. Python Logging Standard (로깅 표준)

복잡한 구조화된 JSON 로그 형식 강제 대신, 파이썬 표준 라이브러리인 `logging` 모듈을 기본으로 활용하는 **Python Logging Standard**를 준수한다.

- **로그 메시지 작성**: 로그에는 에러 발생 위치, 에러 유형 및 관련 데이터의 key(예: `food_code`)를 명확하게 텍스트 형식으로 포함시킨다.
- **로그 레벨 기준**:
  - `DEBUG`: 상세 텍스트 정보 및 임시 스캔 로그.
  - `INFO`: 비즈니스 로직 시작/종료, 검증 통과 완료 알림.
  - `WARNING`: 파일 누락 시 Default 값 적용 등의 경고.
  - `ERROR`: 실행 도중 멈추거나 롤백이 일어난 치명적 오류.
- **민감정보 격리**: 시스템 계정 암호나 비밀 키 등은 로그에 노출되지 않도록 사전에 마스킹한다.
