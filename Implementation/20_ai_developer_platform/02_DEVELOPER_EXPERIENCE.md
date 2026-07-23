# Developer Experience

> **Module**: 20_ai_developer_platform — Document 02  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Developer Experience (DX) Core Principles

개발자 경험(Developer Experience) 가이드는 YM-LAB 에코시스템 위에서 애플리케이션을 빌드하는 B2B 파트너 및 사내 개발자가 **최소한의 복잡도로 안전하게 제품을 빌드하고 검증**할 수 있도록 보장하는 설계 철학 및 행동 양식을 규정한다.

```
       [초기 진입 장벽 제거] (ymlab-cli 기반 퀵스타트 제공)
                 │
                 ▼
       [로컬 샌드박스 안정성] (API 키 소모 없는 Mock 시뮬레이션)
                 │
                 ▼
      [선언적 개발 지향 (DX)] (블루프린트 정의만으로 자동 아웃라인 빌드)
                 │
                 ▼
         [빠른 에러 피드백] (자동 린터 및 팩트체크 검증 즉시 리포트)
```

---

## 2. Onboarding Workflow & Portals

1. **포털 등록 및 API 키 발급**: 개발자는 포털 웹에 접속하여 B2B 파트너 계정을 등록하고, 로컬 디버깅 및 API 게이트웨이 호출용 라이선스 개발 키(`LIC_DEV_xxxx`)를 즉각 발급받는다.
2. **CLI 설치 및 기동**: 로컬 터미널에서 패키지를 설치한 뒤 `ymlab-cli init` 명령어로 즉각 개발 환경 세팅을 완수한다.
3. **샘플 로드**: 기본 제공되는 배추김치 샘플 프로젝트 구조를 판독하고 모듈 구성을 학습한다.

---

## 3. Telemetry Tracking for Developers (DX 감사로그)

- **디버그 세션 메트릭**:
  - 로컬 구동 시 에이전트의 호출 횟수, API 지연율 및 모의 에러 스택 정보를 실시간 추적하여 `data/logs/dev_telemetry.json` 파일에 로깅한다.
- **불필요한 디바이스 훼손 방지**:
  - 로컬 테스트 실행 시 원본 `YM-LAB_RECOVERY` Baseline 파일군에 대한 원천적인 변경 감시 경고 시스템을 연계하여 개발 중인 제품이 레포지토리의 원본 무결성을 침해하지 않도록 DX 관점의 안전 가이드를 제공한다.
Ref: [Ecosystem Architecture](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/19_ai_product_ecosystem/01_ECOSYSTEM_ARCHITECTURE.md)
