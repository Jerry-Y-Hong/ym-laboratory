# 글로벌 김치 AI 지식 플랫폼 (Global Kimchi AI Knowledge Platform)
## 엔터프라이즈 구현 가이드라인 (Implementation Guide)

```
Status      : FROZEN
Version     : 1.0.0
Owner       : YM-LAB
Approved By : Architecture Review
Date        : 2026-07-20
```

> [!IMPORTANT]
> **ARCHITECTURE-DRIVEN IMPLEMENTATION RULE (구현 절대 지침)**  
> 본 가이드라인은 **Architecture Freeze v1.0.0** 명세서와 실제 소스코드 및 데이터베이스 마이그레이션을 연결하는 **구현 지침서(Bridge Document)**입니다. 개발팀은 본 문서의 프로젝트 구조, 네이밍 규칙, 마이그레이션 및 보안 규정을 엄격히 준수하여 구현을 진행합니다.

---

### 1. 프로젝트 폴더 및 패키지 구조 (Package & Directory Structure)

도메인 주도 설계(DDD) 및 Layered Architecture 원칙에 따라 백엔드 애플리케이션 구조를 구성합니다.

```
src/
├── main/
│   ├── java/com/ymlab/kimchi/ (or src/com/ymlab/kimchi/ for TypeScript/Python)
│   │   ├── config/                # Database, Security, CORS, OpenAPI Configuration
│   │   ├── domain/                # Core SSOT Master Domain & Content Domain
│   │   │   ├── master/            # KIMCHI, CATEGORY, INGREDIENT, RECIPE, HISTORY, etc.
│   │   │   │   ├── entity/
│   │   │   │   ├── repository/
│   │   │   │   └── service/
│   │   │   ├── content/           # CONTENT_MASTER, BODY, REF
│   │   │   └── aiengine/          # Configuration Layer (Template, Prompt, Persona, Rule)
│   │   ├── engine/                # AI_ENGINE Execution Layer
│   │   │   ├── builder/           # Prompt Builder
│   │   │   ├── rule/              # Rule Engine
│   │   │   ├── validator/         # 6-Point Integrated Validator Service
│   │   │   └── adapter/           # Pluggable LLM Adapters (Gemini, Claude, OpenAI)
│   │   ├── publishing/            # Multi-channel Publishing Pipeline
│   │   │   ├── queue/             # Async Publishing Queue & Worker
│   │   │   ├── adapter/           # WordPress, YouTube, Substack, Social Adapters
│   │   │   └── log/               # PUBLISHING_LOG Service
│   │   └── api/                   # RESTful Controllers & DTO Envelopes
│   │       ├── v1/
│   │       │   ├── master/
│   │       │   ├── content/
│   │       │   ├── ai/
│   │       │   └── publishing/
│   │       └── dto/
│   └── resources/
│       ├── db/migration/          # SQL DDL & Migration Scripts (V1__initial_schema.sql)
│       └── application.yml        # Application Environment Configurations
└── test/                          # Unit & Integration Tests
```

---

### 2. 코딩 규칙 및 네이밍 컨벤션 (Coding & Naming Conventions)

#### 2.1 데이터베이스 & DDL
- **테이블명**: 대문자 뱀체(`SNAKE_CASE`), 복수형 피하기 (`KIMCHI_MASTER`, `CONTENT_BODY`)
- **컬럼명**: 소문자 뱀체(`snake_case`) (`kimchi_id`, `spiciness_level`, `created_at`)
- **기본키(PK)**: `[entity_name]_id` UUID 포맷 적용 (`kimchi_id`, `content_id`)
- **외래키(FK)**: 참조하는 PK 컬럼명과 100% 동일하게 지정

#### 2.2 클래스 및 소스코드
- **Class/Interface**: 파스칼 케이스(`PascalCase`) (`KimchiMasterService`, `IPromptBuilder`)
- **Method/Variable**: 카멜 케이스(`camelCase`) (`generateContent()`, `targetKimchiId`)
- **Constant**: 대문자 뱀체 (`MAX_RETRY_COUNT = 3`)
- **DTO**: 명확한 역할 표명 (`KimchiMasterSingleResponse`, `AIGenerateExecutionRequest`)

---

### 3. 브랜치 전략 (Git Flow)

안정적인 버전 관리와 CI/CD 배포를 위해 **Git Flow** 표준을 채택합니다.

```
main (FROZEN / Production Tag Release: v1.0.0)
  ▲
  │ (Release Merge)
release/v1.0.0
  ▲
  │ (Develop Integration)
develop
  ├── feature/master-api-implementation
  ├── feature/ai-engine-prompt-builder
  └── feature/publishing-wordpress-adapter
```

- `main`: 프로덕션 배포 브랜치 (태깅 필수: `v1.0.0`, `v1.1.0`)
- `release/*`: 릴리즈 검증 및 QA 전용 브랜치
- `develop`: 개발 통합 메인 브랜치
- `feature/*`: 기능별 개별 개발 브랜치 (`feature/issue-number-feature-name`)
- `hotfix/*`: 프로덕션 버그 긴급 수정 브랜치

---

### 4. DB 마이그레이션 규칙 (Database Migration Rules)

- **형상 관리 도구**: Flyway 또는 Liquibase 적용
- **스크립트 명명 규칙**: `V{Version}__{Description}.sql`
  - 예: `V1.0.0__initial_schema_frozen.sql` (최초 DDL 스크립트)
  - 예: `V1.0.1__insert_kimchi_seed_data.sql` (초기 시드 데이터)
- **금지 사항**: 이미 커밋된 Migration 파일 수정 절대 금지 (새로운 버전 스크립트로 추가)

---

### 5. 테스트 규칙 (Testing Strategy)

- **Unit Test**: 서비스 및 도메인 로직 커버리지 최소 80% 이상 확보 (`MockLLMAdapter` 활용)
- **Integration Test**: DB Testcontainers 또는 In-Memory H2/PostgreSQL 연동 테스트
- **Contract Test**: `IValidator` 및 `ILLMAdapter` 인터페이스 모의 테스트
- **LLM Test Isolation**: 테스트 환경 실행 시 실시간 LLM API 호출을 금지하고 `MockLLMAdapter` 사용

---

### 6. CI/CD 파이프라인 및 환경 변수 관리

#### 6.1 CI/CD 기본 원칙
- 모든 PR(Pull Request) 생성 시 자동 빌드 및 Unit Test 패스 필수
- `develop` Merge 시 Staging 자동 배포
- `main` Merge 및 Tag 생성 시 Production 배포

#### 6.2 환경 변수 (Environment Variables) 관리
.env 파일 및 Cloud Secret Manager를 통해 보안 키를 분리 관리하며, 소스코드 저장소 커밋을 절대 금지합니다.

```bash
# DB Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kimchi_db
DB_USERNAME=kimchi_app
DB_PASSWORD=${SECRET_DB_PASSWORD}

# LLM API Keys (Secret Manager Key Vault)
GEMINI_API_KEY=${SECRET_GEMINI_KEY}
OPENAI_API_KEY=${SECRET_OPENAI_KEY}
CLAUDE_API_KEY=${SECRET_CLAUDE_KEY}

# JWT Secret
JWT_SECRET_KEY=${SECRET_JWT_SIGNING_KEY}
```

---

### 7. 보안 원칙 (Security & Compliance Rules)

1. **인증 및 권한 부여**: Bearer JWT 기반 API 인증 및 에디터/관리자 RBAC(Role-Based Access Control) 적용.
2. **API Key 보안**: 시스템 간 및 외부 Publisher 어댑터 연동 시 `X-API-KEY` 전송 및 IP Whitelisting 적용.
3. **OWASP Top 10 방어**: SQL Injection (Prepared Statements 사용), XSS (Markdown HTML Sanitization) 사전 차단.
4. **LLM Prompt Injection 방지**: 외부 입력값을 프롬프트에 직접 결합할 때 Validator 규칙을 적용하여 악의적 지시문 차단.

---

### 8. Phase 2: Implementation 로드맵 실행 가이드

#### Phase 2.1: Infrastructure & DB Setup
- PostgreSQL DB 인스턴스 할당
- `V1.0.0__initial_schema_frozen.sql` (DDL) 실행 및 Index/FK 확인
- `KIMCHI_MASTER`, `CATEGORY_MASTER` 초기 Seed Data SQL 작성 및 투입

#### Phase 2.2: Backend Skeleton & Domain Layer
- 프로젝트 생성 (Spring Boot / NestJS / FastAPI 중 선택)
- 15종 Core MASTER 엔티티 및 Repository 구현
- RESTful Controller Envelopes 구축

#### Phase 2.3: AI_ENGINE MVP
- `IPromptBuilder` (Mustache/Jinja2 프롬프트 컴파일러) 구현
- `IRuleEngine` 및 `IValidator` (JSON Schema & SEO 검증 모듈) 구축
- `ILLMAdapter` (Gemini Flash / OpenAI Pluggable Adapter) 구현

#### Phase 2.4: Publisher Adapter MVP & Admin Console
- WordPress REST API 어댑터 구현
- Admin Console 웹 UI (Master 관리, AI 설정, 콘텐츠 승인, 발행 관리) 구현
