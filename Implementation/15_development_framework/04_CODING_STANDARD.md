# Coding Standard

> **Module**: 15_development_framework — Document 04  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Python Style Guide

YM-LAB PROJECT의 파이썬 코드는 공식 `PEP8` 가이드라인을 기반으로 하며, 다음 핵심 코딩 수칙을 엄격하게 적용한다.

- **들여쓰기(Indent)**: 공백(Space) 4칸을 사용한다. 탭(Tab) 사용을 금지한다.
- **최대 라인 길이**: 가독성을 위해 코드 라인은 최대 **79자** 이내로 제한하며, 독스트링(Docstring) 및 주석은 **72자** 이내로 줄 바꿈 처리한다.
- **인코딩**: 모든 소스 파일은 반드시 `UTF-8` 인코딩으로 저장해야 한다.
- **공백 및 바인딩**: 연산자 앞뒤로 공백 1칸을 삽입하되, 키워드 인자(Keyword Argument) 대입 시에는 공백을 생략한다.
  - 예: `def generate(food_code, timeout=10):`

---

## 2. Docstring Rules (문서화 표준)

모든 퍼블릭 클래스, 메서드 및 독립 실행 함수 상단에는 반드시 표준 트리플 쿼트(`"""`)를 이용한 Docstring을 기술하여야 한다.

### 2.1 표준 포맷 구조
- **첫 번째 라인**: 함수의 목적에 대한 간결한 단일 라인 요약 (동사로 시작).
- **본문**: 필요한 경우 동작에 대한 구체적인 메커니즘 설명.
- **매개변수 & 리턴**: `Args` 및 `Returns` 구문을 명확하게 명시.

### 2.2 Docstring 예시
```python
def generate(self, request: BlogRequest) -> BlogDraft:
    """
    김치 원재료 마스터 데이터를 기반으로 블로그 포스트 초안을 자동 생성한다.

    Args:
        request (BlogRequest): 블로그 포스트 생성을 위한 입력 요구 정보.

    Returns:
        BlogDraft: 생성 날짜 및 고유 ID가 부여된 포스트 초안 데이터 객체.
    """
    # 구현 내용...
```

---

## 3. Type Hinting Guide

동적 타입 파이썬의 한계를 극복하고 코드 정적 분석 정밀도를 향상시키기 위해, 신규 작성되는 모든 클래스 필드와 함수 시그니처에는 **Type Hinting을 필수로 작성**한다.

- **파라미터 및 리턴 타입**: 명시적으로 데이터 형식을 선언한다.
  - 예: `def parse_json(self, raw_text: str) -> dict:`
- **복합 타입 모듈 활용**: Python 3.10+ 표준에 맞춰 `list[str]`, `dict[str, Any]`, `Optional[int]` 등의 복합 타입을 적극 기술한다.
- **도메인 데이터 객체 (dataclass)**: 설정 정보나 데이터 DTO 객체 정의 시 `dataclass`를 사용하여 구조적 타입을 사전에 명확히 드러낸다.
  ```python
  from dataclasses import dataclass

  @dataclass
  class DBConfig:
      database_path: str
      timeout_seconds: int = 30
  ```
