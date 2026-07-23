# Code Style Guide

> **Module**: 20_ai_developer_platform — Document 21  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. PEP 8 Python Compliance & Typing Standards (코드 스타일 가이드)

코드 스타일 가이드는 YM-LAB 플랫폼 개발에 참여하는 모든 개발자 및 AI 에이전트 생성 스켈레톤 코드가 **일관성 있는 코드 품질을 유지하고 정적 린터(Ruff, MyPy) 테스트를 오류 없이 통과하기 위한 문법적 표준 규칙**을 정의한다.

```
       [코드 작성 및 저장 이벤트 발생]
                      │
                      ▼
     [Step 1: Code Formatting] ──→ Black / Ruff Format 가동 (PEP 8 자동 교정)
                      │
                      ▼
       [Step 2: Type Linting]    ──→ Type Annotations 형식 확인 (MyPy 대조)
                      │
                      ▼
       [Step 3: Naming Convention]──→ snake_case, PascalCase 명명 검증
                      │
                      ▼
            [Build Pipeline 빌드 통과]
```

---

## 2. Coding Conventions & Lint Rules

- **명명 규칙 (Naming Standard)**:
  - 변수, 함수, 메서드 명칭: 소문자 언더스코어 (`snake_case`).
  - 클래스 및 타입 명칭: 대문자 시작 카멜케이스 (`PascalCase`).
  - 상수 필드: 전체 대문자 언더스코어 (`UPPER_CASE_WITH_UNDERSCORES`).
- **타입 어노테이션 강제**:
  - SDK 함수 및 에이전트 클래스의 모든 퍼블릭 API 인터페이스는 인수(Arguments) 및 반환 타입(Return Types) 힌팅을 생략할 수 없으며, MyPy 린트 통과를 의무화한다.
- **Ruff 스타일 가이드라인**:
  - 한 줄의 최대 길이는 120자 제한.

---

## 3. Platform `pyproject.toml` Lint Configuration

```toml
[tool.ruff]
line-length = 120
target-version = "py310"

[tool.ruff.lint]
select = [
    "E",   # pycodestyle errors
    "W",   # pycodestyle warnings
    "F",   # pyflakes
    "I",   # isort
    "C90", # mccabe complexity
]
ignore = ["E501"] # line-length warnings (handled by formatter)

[tool.mypy]
python_version = "3.10"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
```
Ref: [Naming Convention Master Guide](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/15_development_framework/03_NAMING_CONVENTION.md)
