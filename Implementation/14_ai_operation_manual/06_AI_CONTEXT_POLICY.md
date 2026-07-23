# AI Context Policy

> **Module**: 14_ai_operation_manual — Document 06  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Overview

역할 기반 AI(Role-Based AI)들과 대화할 때 발생하는 불필요한 토큰 낭비를 예방하고 할루시네이션을 차단하기 위한 **컨텍스트 구성 규칙 및 역할별 프롬프트 구조**를 정의한다.

---

## 2. Token Optimization Guidelines (로컬)

1. **역할 단위 컨텍스트 제한**:
   - `Implementation AI`와 코딩 대화 시에는 마케팅 기획서나 미사용 DB 스키마 등의 비핵심 텍스트를 입력하지 않는다.
   - `Review AI`에게는 전체 소스코드 대신 현재 커밋할 수정한 코드의 `git diff` 내용 위주로 입력한다.
2. **최신 상태 정보 동기화**:
   - AI 에이전트에게 프롬프트를 보낼 때, 첫 문장에는 항상 [PROJECT_STATUS.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/PROJECT_STATUS.md) 파일 내의 `Build Date`, `Tag`, `Current Stage` 정보를 주입하여 AI가 프로젝트의 현재 작업 단계 기준을 혼동하지 않게 통제한다.

---

## 3. Role-Based Prompt Templates

각 역할에 맞춰 제공되는 추천 프롬프트 골격은 다음과 같다.

### 3.1 Implementation AI용 프롬프트 골격
```markdown
# [Role]
당신은 YM-LAB PROJECT의 Implementation AI입니다. 
파이썬 표준 라이브러리만을 활용해 단순하고 명확한 코드를 작성합니다.

# [Context]
- 현재 스테이지: [PROJECT_STATUS.md의 Current Stage 정보]
- 구현 대상 파일: `blog_automation/03_content_pipeline/content_generator.py`
- 관련 규칙: Phase 08 Blog Automation Rules

# [Task]
주어진 김치 원재료 목록에 대해 블로그 포스트 Markdown 텍스트를 반환하는 함수를 구현해 주십시오.
```

### 3.2 QA AI용 프롬프트 골격
```markdown
# [Role]
당신은 YM-LAB PROJECT의 QA AI입니다.
로컬 테스트 검증 터미널 로그의 에러를 추적하고 수정 제안을 제공합니다.

# [Context]
- 테스트 명령어: `python YM-LAB_RECOVERY/scripts/verify_blog_automation_phase01.py`
- 터미널 에러 출력:
"""
[FAIL] 7. PostRepository CRUD & Status
AssertionError: test-user-001 not found
"""

# [Task]
위 에러 로그를 분석하여, `post_repository.py` 내의 검증 코드나 목업 데이터를 수정할 수 있는 디버깅 코드를 제안하십시오.
```
