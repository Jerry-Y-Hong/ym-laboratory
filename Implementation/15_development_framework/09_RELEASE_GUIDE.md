# Release Guide

> **Module**: 15_development_framework — Document 09  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Versioning Standards (Semantic Versioning vX.Y.Z)

YM-LAB PROJECT는 유의적 버전(Semantic Versioning) 표기 규칙을 기반으로 마일스톤 및 릴리즈 버전을 선언한다.

```
v[MAJOR].[MINOR].[PATCH]
```

- **MAJOR (주 버전)**: YM-LAB PROJECT의 코어 설계 철학의 변화, 기존 Read-Only Phase 규칙의 구조적 대대적 리빌딩 시 변경.
- **MINOR (부 버전)**: 새로운 Phase 완료, 신규 식품 제품군(Product Family) 모듈이 온전히 추가되어 무결성 검증을 마쳤을 때 변경.
- **PATCH (수정 버전)**: 검증 스크립트 보완, README 오타 수정, 로컬 Mock 데이터 보완 등 단순 정합성 조정 시 변경.

---

## 2. Local Release Procedures

새로운 버전을 공식 배포하기 전, 개발자는 아래의 배포 준비 단계를 순차 수행하여야 한다.

```
 [릴리즈 대상 브랜치 준비] (main / release-X.Y.Z)
              │
              ▼
[Step 1: 로컬 전체 통합 테스트 수행] ──→ pytest 및 verify_*.py ALL PASS 확인
              │
              ▼
[Step 2: PROJECT_STATUS.md 버전 갱신]  ──→ Version, Tag, Current Stage 명시
              │
              ▼
[Step 3: walkthrough.md 보고서 작성]  ──→ 수정된 모듈, 테스트 내용 요약 기술
              │
              ▼
 [Step 4: 로컬 Git 커밋 & 버전 태깅] ──→ git tag -a vX.Y.Z -m "description"
              │
              ▼
  [Step 5: 리모트 푸시 및 PR 병합]   ──→ git push origin vX.Y.Z
```

---

## 3. Deployment Preparation and Artifacts

- **배포 아티팩트 목록**:
  - `blog_automation/` 등 구현 패키지 소스코드.
  - 갱신된 `PROJECT_STATUS.md` 및 `walkthrough.md`.
  - catalog.db 정합성 manifest 정보.
- **배포 전 무결성 확인**:
  배포 전 반드시 `verify_readonly.py`를 실행하여 3,524건의 Recovery 관리 대상 Baseline에 변조가 없는 상태인지 더블체크한다.
- **수동 롤백 준비**:
  배포 중 예기치 못한 I/O 에러나 DB 잠김 발생 시, 이전 버전 태그(`git checkout tags/vX.Y.Z-prev`)로 즉각 체크아웃하여 안정된 로컬 형상을 복원할 수 있는 롤백 시나리오를 숙지한다.
