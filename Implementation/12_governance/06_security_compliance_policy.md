# Security & Compliance Policy

> **Module**: 12_governance — Governance Domain 06  
> **Version**: `v1.0`  
> **Status**: ACTIVE  

---

## 1. Purpose

YM-LAB PROJECT의 보안 기준, 규정 준수 요건 및 데이터 보호 정책을 정의한다.

---

## 2. Security Principles

| 원칙 | 설명 |
| :--- | :--- |
| **Zero Trust** | 내부망도 신뢰하지 않음. 모든 접근 검증 필수 |
| **Defense in Depth** | 다계층 보안 (네트워크 → 애플리케이션 → 데이터) |
| **Least Privilege** | 최소 권한 원칙. 필요한 권한만 부여 |
| **Shift Left Security** | 개발 초기부터 보안 내재화 (DevSecOps) |

---

## 3. Authentication & Authorization

| 항목 | 표준 |
| :--- | :--- |
| 사용자 인증 | OAuth2 + JWT (Access Token 15분, Refresh Token 30일) |
| API 인증 | API Key + HMAC-SHA256 서명 |
| 관리자 인증 | MFA(Multi-Factor Authentication) 필수 |
| 세션 관리 | Redis 기반 세션, 비활성 30분 자동 만료 |
| 비밀번호 정책 | bcrypt hashing (cost factor 12 이상) |

---

## 4. Data Protection

| 데이터 분류 | 처리 기준 |
| :--- | :--- |
| **PUBLIC** | 일반 열람 허용, 캐싱 가능 |
| **INTERNAL** | 인증된 사용자만 접근 가능 |
| **CONFIDENTIAL** | 역할 기반 접근 제어 (RBAC), 감사 로그 필수 |
| **RESTRICTED** | 암호화 저장 필수, 접근 시 알림 발송 |

### 암호화 기준

- **저장 데이터**: AES-256-GCM
- **전송 데이터**: TLS 1.3 (최소 1.2 이상)
- **API Key**: AES-256 암호화 저장, 마스킹 표시
- **개인정보**: 가명처리 또는 암호화 (GDPR/PIPA 준수)

---

## 5. Compliance Requirements

| 규정 | 적용 범위 | 주요 요건 |
| :--- | :--- | :--- |
| **GDPR** | EU 사용자 데이터 | 동의 관리, 삭제권, 이동권 |
| **PIPA (개인정보보호법)** | 한국 사용자 데이터 | 개인정보 처리방침, 제3자 제공 동의 |
| **HIPAA** | 건강정보 (해당 시) | 건강정보 암호화, 접근 감사 |
| **ISO 27001** | 정보보안 관리 | 위험 평가, ISMS 운영 |

---

## 6. Vulnerability Management

| 등급 | CVSS 점수 | 패치 목표 |
| :--- | :--- | :--- |
| **CRITICAL** | 9.0~10.0 | 24시간 이내 |
| **HIGH** | 7.0~8.9 | 72시간 이내 |
| **MEDIUM** | 4.0~6.9 | 7일 이내 |
| **LOW** | 0.1~3.9 | Sprint 사이클 내 |

### 취약점 스캔 주기

- **Container Image**: PR 단위 자동 스캔 (Trivy)
- **웹 애플리케이션**: 주 1회 DAST (OWASP ZAP)
- **의존성 패키지**: 일 1회 자동 스캔 (Dependabot)
- **침투 테스트**: 분기 1회 (외부 전문 업체)

---

## 7. Incident Response

```
탐지(Detect) → 분류(Classify) → 격리(Contain) → 근절(Eradicate) → 복구(Recover) → 사후분석(Post-Mortem)
```

| 단계 | 목표 시간 |
| :--- | :--- |
| 탐지 | 자동 알림 즉시 (Prometheus/Grafana) |
| 분류 | 30분 이내 |
| 격리 | CRITICAL: 1시간 / HIGH: 4시간 |
| 복구 | RTO: 4시간 이내 |
| 사후분석 | 48시간 이내 보고서 작성 |

---

## 8. Secret Management

- 모든 비밀키/자격증명은 **Vault** (HashiCorp) 또는 **K8s Secret** (암호화) 사용
- 소스코드 내 하드코딩 절대 금지
- `.env` 파일은 `.gitignore`에 포함, 절대 커밋 금지
- 90일마다 API Key/Secret 순환(Rotation) 의무
