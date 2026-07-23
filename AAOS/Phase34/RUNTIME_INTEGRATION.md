# RUNTIME_INTEGRATION.md

## Phase 33 Runtime 연계 설계

### 1. 연계 아키텍처
- **AERP Core** (AI Enterprise Runtime Platform) 은 중앙 서비스 레이어로 존재합니다.
- **Phase 34 워크포스 컴포넌트**(Agent Registry, Task Distribution Engine, Collaboration Protocol 등)는 AERP의 **서비스 바인딩 포인트**에 연결됩니다.
- **데이터 플로우**: 사용자 요청 → Task Distribution Engine → AI Employee (Agent) → AERP Compute/Model 서비스 → 결과 반환 → Monitoring & Learning 파이프라인.

### 2. 런타임 바인딩(Runtime Binding)
- 각 AI Employee는 **`/runtime/bind`** API 를 통해 자신이 사용할 컴퓨팅 플레인, 스토리지, 모델 엔드포인트를 선언합니다.
- 바인딩 정보는 **Agent Registry**에 기록되어, 필요 시 **`/runtime/unbind`** 로 해제 가능합니다.
- 바인딩 단계에서 **보안 토큰**(JWT)과 **역할 기반 권한(RBAC)** 검증이 수행됩니다.

### 3. 서비스 매핑(Service Mapping)
| 워크포스 컴포넌트 | 매핑되는 AERP 서비스 | 설명 |
|-------------------|----------------------|------|
| AI Employee | Compute Service, Model Service | 작업 실행 및 모델 추론 수행 |
| Task Distribution Engine | Queue Service (Pub/Sub) | 작업 큐 관리 및 스케줄링 |
| Collaboration Protocol | Messaging Service (Pub/Sub) | 에이전트 간/인간-에이전트 메시징 |
| Learning Pipeline | Knowledge Store (BigQuery/Firestore) | 피드백·경험 저장 및 모델 재학습 |
| Monitoring Framework | Metrics Service (Cloud Monitoring) | KPI 수집·대시보드 제공 |

### 4. 실행 흐름(Execution Flow)
1. **요청 수신** – 외부 시스템 또는 사용자 UI 가 `/api/tasks` 로 작업을 제출.
2. **작업 분배** – Task Distribution Engine 이 역할·역량·가용성을 고려해 AI Employee 에 할당.
3. **런타임 바인딩** – AI Employee 가 `/runtime/bind` 로 필요한 AERP 리소스 선언.
4. **작업 수행** – Compute/Model 서비스에서 실제 연산 실행.
5. **결과 반환** – 결과는 `/api/tasks/{id}` 로 조회 가능하며, Monitoring 에 이벤트 전송.
6. **피드백·학습** – 결과와 메타데이터가 Learning Pipeline 으로 흐름.
7. **감사 로그** – 모든 단계는 **Security & Governance** 정책에 따라 로그 기록.

### 5. 의존성 구조(Dependency Structure)
- **AERP** → **Phase 34**: Phase 33에서 제공하는 서비스 (Compute, Model, Storage 등) 를 재사용.
- **Phase 34** → **AERP**: 새로운 서비스 (Task Queue, Collaboration Bus) 를 AERP에 플러그인 형태로 등록.
- **외부 시스템** (예: ERP, CRM) 은 API Gateway 를 통해 **REST** 로 연계되며, 인증은 동일 토큰 체계 사용.

---
*위 내용은 초안이며, 상세 인터페이스 스펙과 시퀀스 다이어그램은 추후 추가됩니다.*
