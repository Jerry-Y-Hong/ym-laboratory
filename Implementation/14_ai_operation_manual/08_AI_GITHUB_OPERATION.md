# AI GitHub Operation

> **Module**: 14_ai_operation_manual — Document 08  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Overview

역할 기반 AI(Role-Based AI)들과 협업하여 생산된 코드를 Git 리포지토리에 커밋하고 GitHub Pull Request(PR)를 작성하는 **Git 형상 관리 및 개발 실무 지침**을 정의한다.

---

## 2. Git Branching Strategy

- **기능 개발 브랜치**: 개발진은 AI를 활용해 새로운 기능을 개발할 때 `main` 또는 `dev` 브랜치로부터 기능 단위 브랜치를 생성한다.
  - 브랜치 예시: `feat/kimchi-blog-pipeline`, `fix/post-repository-bug`
- **베이스 보호**: `main` 브랜치에 대해 직접 푸시(Direct Push)하는 행위는 제한되며, 모든 병합은 로컬에서 검증을 마친 후 PR을 경유해야 한다.

---

## 3. Commit Message Standards (Conventional Commits)

AI 역할의 변경 성격에 맞춰 아래와 같은 Conventional Commits 명명 표준을 준수하여 커밋을 생성한다.

| 커밋 Type | 연관 AI 역할 | 용도 | 예시 |
| :--- | :--- | :--- | :--- |
| **feat** | Implementation AI | 신규 기능 코드 추가 | `feat(blog): add automated content generator` |
| **fix** | QA AI | 버그 수정 코드 반영 | `fix(repo): patch duplicate food_code exception` |
| **docs** | Documentation AI | 문서, README, 마크다운 추가 | `docs(manual): write workflow specification` |
| **refactor**| Review AI | 코드 정리, 린트 오류 수정 | `refactor(shared): remove circular dependency import` |

### 3.1 세부 본문 작성 규칙
커밋 메시지 본문에는 다음 정보를 선택적으로 기재하여 추적성을 유지한다.
- `Related requirements`: 요구사항 명세서(`01_requirements.md`) 상의 ID 명시 (예: `FR-01`).
- `Verified by`: 로컬에서 성공을 확인한 검증 스크립트 파일명 명시 (예: `verify_blog_automation_phase01.py`).

---

## 4. Manual Pull Request Checklist (수동 PR 검수 기준)

병합(Merge) 요청 전에 인간 프로젝트 리더가 수동으로 검증해야 하는 체크리스트:

- [ ] AI 에이전트가 제안한 임의의 셸 실행 코드(`os.system` 등)가 필터링되었는가?
- [ ] YM-LAB PROJECT의 기존 동결(Closed)된 Phase 폴더 내의 산출물이 훼손되지 않았는가?
- [ ] 로컬 터미널 환경에서 `python YM-LAB_RECOVERY/scripts/verify_*.py` 스크립트를 수동 구동하여 `ALL PASS`를 달성하였는가?
- [ ] 새로운 외부 라이브러리(pip packages)가 정식 절차 없이 추가되지 않았는가?
- [ ] 변경된 설계 및 백로그 내용이 `06_backlog.md`에 정상 기록되었는가?
