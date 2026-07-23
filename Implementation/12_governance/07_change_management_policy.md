# Change Management Policy

> **Module**: 12_governance — Governance Domain 07  
> **Version**: `v1.0`  
> **Status**: ACTIVE  

---

## 1. Purpose

YM-LAB PROJECT의 모든 변경(코드, 인프라, 설계)에 대한 관리 절차를 정의하여, 변경으로 인한 위험을 최소화하고 서비스 안정성을 유지한다.

---

## 2. Change Classification

| 유형 | 정의 | 예시 |
| :--- | :--- | :--- |
| **Standard Change** | 사전 승인된 반복 변경, 위험 낮음 | 패키지 패치 업데이트, 로그 설정 변경 |
| **Normal Change** | 일반적인 계획 변경, ARB 검토 필요 | 신규 기능 배포, API 버전 업 |
| **Emergency Change** | 긴급 대응 변경, 즉시 실행 후 사후 승인 | 보안 취약점 패치, 서비스 장애 복구 |
| **Major Change** | 아키텍처 수준 변경, ACR 필수 | DB 마이그레이션, 기술 스택 교체 |

---

## 3. Change Request (CR) Process

### Normal / Major Change

```
[1] CR 제출 (Change Author)
    ↓
[2] 영향도 분석 (24시간 이내)
    - 영향받는 서비스 목록
    - 예상 다운타임 (있는 경우)
    - 롤백 계획 명시
    ↓
[3] ARB 검토 및 승인
    - Standard: Tech Lead 1인
    - Normal: ARB 다수결
    - Major: ARB 만장일치 + CTO 승인
    ↓
[4] 변경 실행 (Change Window 내)
    ↓
[5] 변경 검증 (배포 후 모니터링 30분)
    ↓
[6] CR 완료 처리 및 문서 업데이트
```

### Emergency Change

```
[1] 긴급 승인 (CTO 또는 보안책임자 전화/메신저 즉시 승인)
    ↓
[2] 즉시 실행
    ↓
[3] 사후 CR 제출 (48시간 이내)
    ↓
[4] Post-Mortem 작성 (72시간 이내)
```

---

## 4. Change Window Policy

| 환경 | 허용 Change Window | 금지 기간 |
| :--- | :--- | :--- |
| **Production** | 화~목 03:00~05:00 KST | 금~월, 공휴일, 이벤트 기간 |
| **Staging** | 평일 언제든 | 없음 |
| **Development** | 제한 없음 | 없음 |

---

## 5. Rollback Policy

| 변경 유형 | 롤백 기준 | 롤백 방법 |
| :--- | :--- | :--- |
| Application | 에러율 > 1% 또는 P95 Latency > 500ms | Blue-Green: Traffic Switch |
| Database | 데이터 손상 감지 또는 마이그레이션 실패 | `down.sql` 실행 |
| Infrastructure | 클러스터 불안정 또는 노드 장애 | Terraform State Rollback |
| Configuration | 설정 오류로 인한 서비스 불가 | ConfigMap 이전 버전 적용 |

**롤백 목표 시간 (RTO)**: 30분 이내

---

## 6. Change Log Requirements

모든 변경 완료 후 다음을 기록한다.

- 변경 일시 (KST)
- 변경 유형 및 CR 번호
- 변경 내용 요약
- 담당자
- 영향받은 서비스 및 검증 결과
- 롤백 여부 (롤백 시 사유 포함)

---

## 7. Freeze Period (변경 금지 기간)

다음 기간에는 Emergency Change를 제외한 모든 Production 변경을 금지한다.

- 주요 이벤트 D-3 ~ D+1 (마케팅 캠페인, 서비스 론칭 등)
- 연말연시 (12/24 ~ 1/2)
- 분기 결산일 전후 3일
