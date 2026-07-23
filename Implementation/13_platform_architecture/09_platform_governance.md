# Platform Governance

> **Module**: 13_platform_architecture — Document 09  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Purpose

Platform 수준의 거버넌스 정책을 정의한다.  
Platform Governance는 `Implementation/12_governance/`의 개발 Governance를 계승하되, Platform 특유의 다중 제품 운영 환경에 맞게 확장한다.

---

## 2. Platform Governance Domains

| 도메인 | 정의 문서 | 요약 |
| :--- | :--- | :--- |
| Version Policy | 본 문서 §3 | Platform/Product/SDK 버전 관리 원칙 |
| API Governance | 본 문서 §4 | API 표준, 수명 주기, Breaking Change |
| Security Governance | 본 문서 §5 | 보안 표준, 취약점 관리, 컴플라이언스 |
| Quality Governance | 본 문서 §6 | 품질 기준, 테스트 정책 |
| Release Governance | 본 문서 §7 | 배포 절차, 롤아웃 전략 |
| Dependency Governance | 본 문서 §8 | 외부 의존성 관리 |

---

## 3. Version Policy

### 3.1 Platform Versioning

| 구분 | 형식 | 예시 |
| :--- | :--- | :--- |
| Platform 전체 | `Platform vX.Y` | `Platform v1.0`, `Platform v2.0` |
| 개별 서비스 | `platform-{service}:vX.Y.Z` | `platform-auth:1.3.2` |
| API 버전 | `v{N}` (URL Path) | `v1`, `v2` |

### 3.2 Version Compatibility Matrix

| Platform 버전 | 지원 API 버전 | 지원 SDK 버전 | EOS |
| :--- | :--- | :--- | :--- |
| Platform v1.x | API v1 | SDK v1.x, v2.x | TBD |
| Platform v2.x | API v1 (Deprecated), v2 | SDK v2.x, v3.x | Platform v1.x + 24개월 |

### 3.3 SDK Version Lifecycle

| 단계 | 기간 | 지원 수준 |
| :--- | :--- | :--- |
| **Current** | 무기한 | 신규 기능 + 버그 수정 + 보안 패치 |
| **Maintenance** | 12개월 | 버그 수정 + 보안 패치만 |
| **End of Life** | - | 지원 없음. 마이그레이션 필수 |

---

## 4. API Governance

### 4.1 API Change Review Board (ACRB)

모든 Breaking Change API 변경은 ACRB 검토를 통과해야 한다.

| 역할 | 책임 |
| :--- | :--- |
| **API Owner** | 변경 제안 작성, Impact Analysis |
| **Platform Lead** | 기술 타당성 검토 |
| **Product Representatives** | 각 Product 영향도 평가 |
| **Security Lead** | 보안 영향도 검토 |

### 4.2 API Change SLA

| 변경 유형 | ACRB 검토 기간 | 공지 선행 기간 |
| :--- | :--- | :--- |
| Non-Breaking | 3영업일 | 없음 (릴리즈 노트만) |
| Deprecation 공지 | 5영업일 | 12개월 전 |
| Major Version 업 | 10영업일 | 12개월 전 |
| Emergency Security Fix | 즉시 (사후 ACRB) | 사후 공지 |

### 4.3 API Registry

모든 Platform API는 중앙 API Registry에 등록 의무.

- **Registry URL**: `https://api-registry.ymlab.io/` (내부)
- **포함 정보**: OpenAPI Spec, 버전 이력, Deprecation 일정, 사용 통계

---

## 5. Security Governance

### 5.1 Platform Security Standards

`Implementation/12_governance/06_security_compliance_policy.md`를 기반으로 Platform 수준 확장:

| 추가 Platform 보안 요건 | 내용 |
| :--- | :--- |
| **멀티테넌트 격리 감사** | 분기 1회 테넌트 데이터 격리 침투 테스트 |
| **Platform API 보안 스캔** | 모든 API 엔드포인트 DAST 주 1회 |
| **SDK 보안 스캔** | SDK 패키지 배포 전 SAST 필수 |
| **Product Onboarding 보안 리뷰** | 신규 Product 런칭 전 Platform Security Review 필수 |

### 5.2 Compliance by Product

| Product | 주요 컴플라이언스 | Platform 제공 지원 |
| :--- | :--- | :--- |
| Blog SaaS | GDPR, PIPA | 동의 관리 API, 삭제권 API |
| MFCO SaaS | GDPR, PIPA, 식품안전법 | 데이터 감사 로그 |
| Smart Farm | IoT 보안 가이드라인 | 디바이스 인증 서비스 (확장) |
| Knowledge SaaS | GDPR, 연구 데이터 보호법 | 익명처리 API |
| Recipe AI | GDPR, PIPA, HIPAA (건강정보) | 암호화 스토리지 |
| Edu Platform | GDPR, PIPA, COPPA (미성년자) | 연령 인증 API |

---

## 6. Quality Governance

### 6.1 Platform Service Quality Gates

| 게이트 | 기준 | 측정 |
| :--- | :--- | :--- |
| Availability | ≥ 99.99% (Tier 1), ≥ 99.9% (Tier 2~3) | Prometheus Uptime |
| Latency P95 | < 200ms (REST), < 3초 (AI) | Grafana |
| Error Rate | < 0.1% | Prometheus |
| Test Coverage | ≥ 80% (Platform), ≥ 90% (Shared SDK) | CI 보고서 |

### 6.2 Product Quality Baseline

Platform에 온보딩되는 모든 Product는 다음 최소 품질 기준을 충족해야 한다.

- 단위 테스트 커버리지 ≥ 70%
- E2E 핵심 플로우 100% 커버
- Lighthouse 점수 ≥ 85
- 보안 취약점 HIGH/CRITICAL 0건

---

## 7. Release Governance

### 7.1 Platform Release Train

| 주기 | 릴리즈 내용 |
| :--- | :--- |
| 격주 (Sprint 동기화) | Non-Breaking 기능 추가, 버그 수정 |
| 분기 | Minor 버전 업 (신규 서비스 또는 기능 세트) |
| 연 1~2회 | Major 버전 업 (Breaking Change 통합 릴리즈) |
| 수시 | 보안 패치 (Emergency Change 절차) |

### 7.2 Product Release Independence

- Product는 Platform Release Train과 무관하게 독립 배포 가능
- 단, Platform Major 버전 업 시 Product는 12개월 내 마이그레이션 의무

### 7.3 Canary Rollout Policy

| 단계 | 트래픽 비율 | 관찰 시간 |
| :--- | :--- | :--- |
| Canary 1% | 1% | 1시간 |
| Canary 10% | 10% | 4시간 |
| Canary 50% | 50% | 12시간 |
| Full Rollout | 100% | - |

**자동 롤백 조건**: 에러율 > 1% 또는 P95 Latency > 500ms

---

## 8. Dependency Governance

### 8.1 External Library Approval

신규 외부 라이브러리 추가 시:

1. 라이선스 확인 (MIT, Apache 2.0, BSD 허용 / GPL 금지)
2. 보안 취약점 이력 확인 (CVE 검색)
3. 유지보수 활성도 확인 (최근 6개월 내 커밋)
4. ARB 승인 필요 (Shared Component, Platform 서비스 추가 시)

### 8.2 Dependency Audit Schedule

| 대상 | 주기 | 도구 |
| :--- | :--- | :--- |
| npm 패키지 | 일 1회 자동 | Dependabot |
| Python 패키지 | 일 1회 자동 | Dependabot |
| Container Base Image | 주 1회 | Trivy |
| 전체 Dependency Tree | 분기 1회 | 수동 감사 |

### 8.3 Platform 외부 의존성 목록

| 서비스 | 외부 의존 | 대체 가능 여부 |
| :--- | :--- | :--- |
| Auth | OAuth2 Provider (Google, Kakao) | ✅ 제거 가능 (내부 인증만 사용) |
| AI Engine | LLM API (OpenAI / Anthropic) | ✅ 교체 가능 (추상화 계층 존재) |
| Billing | Stripe | 조건부 (대안: Portone) |
| Notification | AWS SES, Twilio | ✅ 교체 가능 (추상화 계층 존재) |
| Storage | AWS S3 / MinIO | ✅ 교체 가능 (MinIO 자체 호스팅) |
