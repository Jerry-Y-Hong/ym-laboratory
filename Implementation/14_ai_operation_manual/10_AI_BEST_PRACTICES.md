# AI Best Practices

> **Module**: 14_ai_operation_manual — Document 10  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Overview

YM-LAB PROJECT 개발 과정에서 도출된 **할루시네이션 방어 수칙, 프롬프트 인젝션 로컬 안전 대책 및 AI 코딩 에러 극복 사례**를 제공한다.

---

## 2. Hallucination Mitigation (정합성 그라운딩)

AI가 존재하지 않는 식품 규격이나 영양 성분값을 지어내는 현상을 완벽히 차단하기 위한 3대 수칙:

1. **원천 데이터 참조 강제**:
   - 블로그 작성이나 AI 분석 시, AI 모델이 임의로 영양 성분을 예측해 쓰지 못하게 제약한다.
   - 반드시 `01_PHASE1_KIMCHI/01_KIMCHI_MASTER/` 또는 플랫폼 `120_DATABASE` 내의 실제 JSON/SQL 파일에서 쿼리해 온 구체적인 수치(에너지, 비타민 등)를 컨텍스트로 제공해야 한다.
2. **Q-Code 검증기 활용**:
   - 코드 생성 단계 이후, 정적 검증 파이프라인에서 Q-Code 문자열 형식을 확인하고 `catalog.db` 및 JSON 인덱스에 실존하는 코드인지 대조하는 로컬 파이썬 함수를 적용한다.

---

## 3. Local Prompt Injection Defense (로컬 보안 가이드)

AI가 제안한 소스코드를 로컬에서 병합·실행할 때 발생할 수 있는 시스템 오염 및 악성 스크립트 실행 위협을 방지한다.

- **임의 명령어 실행 차단 (No Arbitrary Execution)**:
  - AI가 파이썬 코드 내에서 `os.system()` 또는 `subprocess.Popen(..., shell=True)`를 사용해 임의의 셸 명령어를 실행하라고 제안할 경우, 이를 그대로 반영하지 않는다.
  - 외부 명령 실행이 필요한 경우 반드시 파이썬 표준 라이브러리 API(예: `shutil`, `os.path` 등)를 사용하는 방식으로 우회 구현한다.
- **API Key 격리**:
  - OpenAI, Anthropic, Gemini 등의 API 키는 절대 코드 내에 하드코딩하지 않으며, 로컬 `.env` 파일에 저장하고 `100_PLATFORM`의 `config.py` 설정을 경유하여 동적으로 불러온다.

---

## 4. Failure Restoration Examples (실무 에러 대처법)

### 4.1 AI가 생성한 순환 참조(Circular Import) 해결법
- **상황**: AI가 공유 컴포넌트 SDK를 상호 연결하다가 파이썬 모듈 간 순환 참조(`ImportError`)를 발생시킴.
- **해결책**:
  - 공유 라이브러리 간에는 직접 참조를 차단하고, `100_PLATFORM/150_SHARED/` 공통 라이브러리 또는 `__init__.py`에서 타입 힌트 수준(`TYPE_CHECKING`)으로만 의존하도록 역할을 축소하여 재구축한다.

### 4.2 JSON 데이터 파싱 실패 에러 대처법
- **상황**: ChatGPT/Claude API 응답으로 JSON 데이터를 받을 때 불필요한 대화 텍스트가 섞여 `json.JSONDecodeError`가 발생함.
- **해결책**:
  - 로컬 파이썬 로더에서 응답 텍스트에 백틱(```)이나 "json" 문자열이 있는지 정규식으로 걸러내고, 유효한 중괄호 `{}` 영역만 슬라이싱하여 파싱을 시도하는 방어 코드를 적용한다.
