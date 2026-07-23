# YM‑LAB 아키텍처 거버넌스 – Phase Freeze 관리 정책
**PHASE_FREEZE_MANAGEMENT_POLICY**

**Document ID**
ADF-GOV-001

**Document Owner**
Architecture Governance Board

**Authority**
ADF v3.1

**Classification**
Architecture Governance Standard

**Status**
Closed & Frozen
*버전 v3.1 – 2026‑07‑22*

---

### 1️⃣ 목적
이 정책은 YM‑LAB의 모든 **Phase**(단계)가 **Closed & Frozen**(폐쇄·동결) 상태를 가질 때, 해당 상태를 **정형화된 절차**로 관리하도록 정의합니다.
- **Closed & Frozen** 은 기본 상태이며, **영구적인 수정 금지** 를 의미하지 않습니다.
- 문서 오류 수정, 추적성(Traceability) 보강, 아키텍처 개선 등 필요에 따라 **재오픈(Reopen)** 이 가능합니다.

---

### 2️⃣ 재오픈 가능 조건

| 번호 | 구분 | 재오픈 사유(예시) |
|------|------|-------------------|
| 1 | **문서 오류** | 오탈자, 누락된 섹션, 형식 오류, 잘못된 그림·표, 참고문헌 누락 등 |
| 2 | **추적성 개선** | **Reference** 누락, **Architecture‑to‑Deliverable** 매핑 부재, **Dependency** 매핑 누락, 전체 추적성 결함 |
| 3 | **아키텍처 결정 업데이트** | 새로운 아키텍처 패턴 도입, 경계 명확화, 최신 기술 적용, 향후 호환성 문제 해결 |
| 4 | **거버넌스·컴플라이언스** | 내부 거버넌스 변경, 규제·법률 개정, 감사 결과 반영, 보안 정책 업데이트 |
| 5 | **향후 호환성** | 차기 플랫폼 릴리즈와의 충돌, 핵심 컴포넌트 폐기 예정, 다른 Phase에 미치는 영향 분석 |

> 위 조건 중 **하나**라도 충족하면 재오픈이 허용됩니다. 

---

### 3️⃣ 재오픈 절차

1. **재오픈 요청서 작성**
   - **양식**: *Appendix A – Reopen Request Form* (아래에 한글 양식 포함)
   - **첨부**: 오류·갭을 증명하는 자료(스크린샷, 로그, 리뷰 코멘트 등)

2. **아키텍처 리뷰보드(ARB) 승인**
   - ARB 구성원: **아키텍트, 품질 담당자, PM**
   - 회의에서 **요청 사유, 영향 범위, 수정 계획** 검토 → **승인(YES/NO)**

3. **수정 작업**
   - 승인된 내용에 따라 **문서·아키텍처**를 수정
   - 수정 내용은 **버전 히스토리**에 명시 (예: `v3.2.1‑reopen‑2026‑07‑22`)

4. **재인증(Certification)**
   - 수정 후 **재검증**(Self‑Review → Validation) 수행
   - 검증 결과 **PASS** 시 **Closed & Frozen** 상태로 다시 전환

5. **기록 보관**
   - 최종 **Master Report**에 **재오픈 기록**(날짜, 담당자, 사유, 결과) 삽입
   - Version History에도 동일 내용 반영

---

### 4️⃣ 재오픈 요청서 (Appendix A) – 한글 양식

```markdown
# 재오픈 요청서

## 1. 기본 정보
- **Phase 명** : 
- **현재 버전** : 
- **요청 일시** : YYYY‑MM‑DD HH:MM
- **요청자** : (이름 / 부서)

## 2. 재오픈 사유 (다중 선택)
- [ ] 문서 오류
- [ ] 추적성 개선
- [ ] 아키텍처 결정 업데이트
- [ ] 거버넌스·컴플라이언스
- [ ] 향후 호환성

## 3. 상세 설명
- **문제·갭 상세** (예시, 스크린샷, 로그 등)
- **비즈니스/기술 영향**
- **수정 방식** (예: 문서 교정, 매핑 추가, 아키텍처 다이어그램 수정 등)

## 4. 영향 범위
- **연관 Phase/컴포넌트** : 
- **예상 일정** : (시작 – 종료)

## 5. 검토·승인
| 담당자 | 역할 | 서명 | 날짜 |
|--------|------|------|------|
| 아키텍트 | 검토 |  |  |
| 품질 담당 | 검증 |  |  |
| PM | 최종 승인 |  |  |
```

---

### 5️⃣ 검증 체크리스트 (재인증 시 사용)

| 체크항목 | 내용 | PASS/FAIL |
|----------|------|-----------|
| **문서 품질** | 오탈자·포맷·구조 모두 정상 | |
| **추적성** | 모든 Reference·Dependency·Architecture‑to‑Deliverable 매핑 완전 | |
| **Architecture 일관성** | 기존 표준(ADF v3.1)과 어긋남 없음 | |
| **거버넌스** | 최신 정책·규제와 부합 | |
| **테스트·검증** | 자동·수동 검증 모두 PASS | |

---

### 6️⃣ FAQ (자주 묻는 질문)

| 질문 | 답변 |
|------|------|
| **Closed & Frozen 상태에서도 버그 수정이 가능한가요?** | 네. 버그가 **문서·아키텍처 수준**에 해당한다면 위 재오픈 절차를 따라야 합니다. |
| **재오픈 요청을 보류하면 어떻게 되나요?** | ARB에서 **거절** 되면 현재 상태를 유지하고, 새로운 사유가 생길 때 다시 요청합니다. |
| **재오픈 후에도 기존 버전 히스토리를 보존해야 하나요?** | 반드시 보존합니다. 새 버전 번호와 **reopen** 표시를 추가합니다. |
| **다른 팀이 만든 Phase를 재오픈해도 되나요?** | 해당 Phase의 **소유 팀**과 **PM**의 동의를 얻은 뒤 ARB에 제출합니다. |

---

### 7️⃣ 적용 범위
- **모든 Phase**(예: Phase 23 AERP, Phase 24 AEIP 등)
- **Master Report**(최종 보고서)와 **Version History** 문서에 적용
- **ADF v3.1** 표준을 따르는 모든 신규 Phase에도 동일 정책 적용

---

### 8️⃣ 정책 개정 이력

| 버전 | 일자 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| v1.0 | 2025‑12‑01 | 김민수 | 최초 제정 |
| v2.0 | 2026‑03‑15 | 이지현 | 추적성 항목 추가 |
| **v3.0** | **2026‑07‑22** | **안드로이드(AI)** | 재오픈 절차 상세화, 체크리스트·FAQ 포함 |
| **v3.1** | **2026‑07‑22** | **안드로이드(AI)** | Architecture Governance enhancement, Document Metadata, Definitions, Exception Policy, Governance Metrics, Document Hierarchy |
---

### Freeze Authority
- **Freeze Owner**: Architecture Governance Board (AGB) – final authority to place a Phase in Closed & Frozen.
- **Reopen Approver**: AGB Chair + Phase Owner.
- **Reject Reopen**: AGB majority vote.
- **Certification Sign‑off**: Chief Architecture Officer (CAO).
- **Archive Custodian**: Documentation Team.

### Freeze Classification
| Level | Name | Scope | Approval | Impact |
|------|------|-------|----------|--------|
| 1 | Document Freeze | All documentation only | Document Owner | Minor – no runtime impact |
| 2 | Architecture Freeze | Architectural diagrams & decisions | Architecture Review Board | Medium – design changes limited |
| 3 | Runtime Freeze | Deployment pipelines & runtime configs | Ops Lead | High – service disruption possible |
| 4 | Governance Freeze | Governance policies & compliance artifacts | Governance Committee | Critical – legal/compliance risk |
| 5 | Enterprise Freeze | All phases across the enterprise | Executive Steering Committee | Enterprise‑wide – strategic impact |

### Definitions
- **Closed & Frozen**: Phase가 공식적으로 잠겨 있어 일상적인 변경이 금지된 기본 상태이며, 공식 절차를 통해서만 재오픈이 가능함.
- **Reopen**: 위 조건을 만족해 Closed & Frozen 상태를 해제하고 수정·업데이트를 수행하는 절차.
- **Re‑Certification**: Reopen 후 적용된 변경 사항을 검증·인증하고 다시 Closed & Frozen 로 전환하는 과정.
- **Architecture Debt**: 현재 아키텍처 설계·구현에서 인지된 미해결 기술 부채.
- **Architecture Decision Record (ADR)**: 주요 아키텍처 선택을 기록하는 문서 형식.

### Architecture Decision Requirement (ADR)
Every Re‑open Request must reference an ADR and include:
- **ADR ID** (e.g., ADR‑0001)
- **Decision** – concise statement of the architectural choice.
- **Reason** – why the decision was taken.
- **Impact** – affected components & downstream effects.
- **Status** – Approved / Deferred / Rejected.

### Architecture Risk Assessment
Re‑open submissions must contain a risk matrix with the following categories:
- **Architecture Risk** – structural or design weaknesses.
- **Semantic Risk** – terminology or model inconsistencies.
- **Integration Risk** – interfaces with other Phases.
- **Dependency Risk** – external libraries/services.
- **Expansion Risk** – scalability & future‑growth concerns.
- **Overall Risk Level** – Low / Medium / High.

### Architecture Debt Review
Document any existing or newly introduced technical debt:
- **Known Debt** – previously recorded.
- **New Debt** – introduced by the change.
- **Resolved Debt** – items eliminated.
- **Debt Status** – Open / Mitigated / Closed.

### Architecture Principle Compliance
Validate compliance with the following ADF v3.1 principles:
- AI-First
- Autonomous
- Enterprise Brain
- Declarative Architecture
- Traceability
- Closed & Frozen as baseline
- Single Source of Truth
- Explainability
- Extensibility
- Security & Privacy

### Exception Policy
- **Emergency Reopen**: Critical Security Issue, Legal Compliance, Data Loss, Enterprise Outage 등 긴급 상황 발생 시 즉시 재오픈 가능.
- 이러한 경우 사후에 Architecture Governance Board 가 검토·승인 절차를 수행함.

### Governance Metrics
- **Average Reopen Time**: 재오픈 요청부터 재인증 완료까지 평균 소요 시간.
- **Re‑Certification Success Rate**: 재인증 성공 비율.
- **Audit Findings**: 최근 감사에서 발견된 이슈 수.
- **Outstanding Architecture Debt**: 현재 미해결 부채 항목 수.
- **Governance Compliance Rate**: 정책 및 절차 준수율.

### Document Hierarchy
```
ADF
│
└─ Architecture Governance
   │
   └─ Phase Freeze Management Standard
      │
      └─ Phase
         │
         └─ Master Report
            │
            └─ Deliverables
```

### Re‑Certification Validation Matrix
| Validation Category | Required | Method |
|---------------------|----------|--------|
| Architecture Validation | ✔ | ARB review |
| Documentation Validation | ✔ | Document audit |
| Semantic Validation | ✔ | Terminology checklist |
| Governance Validation | ✔ | Compliance sign‑off |
| Risk Validation | ✔ | Risk matrix review |
| Debt Validation | ✔ | Debt register check |
| Principle Compliance | ✔ | Principle checklist |
| ADR Validation | ✔ | ADR reference check |

### Master Report Update Requirement
When a Phase is reopened, the Master Report must be updated with:
- **Version History** entry (date, author, description).
- **Architecture Decision Summary** (ADR details).
- **Architecture Risk Summary** (risk matrix).
- **Architecture Debt** section.
- **Principle Compliance** statement.
- **Certification Result**.

### Audit Trail
Maintain a complete audit log for every reopen cycle:
- **Reopen Date**
- **Requester**
- **Reviewer(s)**
- **Approver**
- **Reason**
- **Affected Documents**
- **Certification Result**
- **Change Log** (git commit hash if applicable)

### Final Governance Statement
> **This policy is the official Freeze Governance Standard of YM‑LAB. All current and future Phases shall adhere to ADF v3.1 governance requirements.**

---

> **요약**
> - **Closed & Frozen** 은 기본 상태이며, 필요 시 위 **재오픈 조건**을 충족하면 언제든 열 수 있습니다.
> - **재오픈** → **수정** → **재인증** → **Closed & Frozen** 순서로 진행합니다.
> - 모든 절차와 결과는 **Master Report**와 **Version History**에 기록해 투명성을 유지합니다.

---


