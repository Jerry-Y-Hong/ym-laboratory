# README.md

## Template Governance Layer

`templates/` 디렉터리는 **Phase 전용 문서 템플릿**과 템플릿 관리 메타데이터를 중앙 집중식으로 보관합니다. 이 레이어는 모든 Phase가 동일한 형식을 따르도록 강제하고, 장기적인 문서 표준화·버전 관리를 지원합니다.

### 포함되는 파일
- `PHASE_WORK_INSTRUCTION_TEMPLATE.md`
- `PHASE_WALKTHROUGH_TEMPLATE.md`
- `PHASE_FINAL_REPORT_TEMPLATE.md`
- `PHASE_REVIEW_CHECKLIST_TEMPLATE.md`
- `README.md` (본 파일)
- `TEMPLATE_VERSION.md`
- `CHANGELOG.md`

### 운영 방침
1. **버전 관리**: 템플릿 변경 시 `TEMPLATE_VERSION.md`와 `CHANGELOG.md`를 업데이트하고, Git에 커밋하여 히스토리를 남깁니다.
2. **리뷰 프로세스**: 새로운 템플릿 추가·수정은 **Project Owner**와 **Compliance Auditor**의 승인 후 `main` 브랜치에 병합합니다.
3. **배포**: Phase 시작 시 CI/CD 파이프라인이 최신 템플릿을 복사해 해당 Phase 디렉터리에 배포합니다.
4. **접근 제한**: 템플릿 파일은 **읽기‑전용** 권한을 기본으로 하며, 템플릿 업데이트 권한은 지정된 관리자에게만 부여합니다.

---

*이 README는 템플릿 관리 레이어의 목적과 운영 원칙을 문서화합니다.*
