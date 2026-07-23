# Product Isolation

> **Module**: 13_platform_architecture — Document 08  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Purpose

각 Product가 독립 배포, 독립 버전 관리, 독립 테스트, 독립 장애 격리를 달성하면서도 Platform 공통 서비스를 재사용하는 격리 전략을 정의한다.

---

## 2. Isolation Dimensions

| 격리 차원 | 목표 | 구현 방법 |
| :--- | :--- | :--- |
| **배포 격리** | 독립 배포 가능 | 별도 K8s Namespace, 독립 CI/CD Pipeline |
| **버전 격리** | 독립 버전 관리 | 별도 Git Repository (또는 Monorepo Package) |
| **테스트 격리** | 독립 테스트 가능 | Platform 서비스 Mock/Stub, 독립 Test DB |
| **장애 격리** | 독립 장애 격리 | Circuit Breaker, 독립 Health Check |
| **데이터 격리** | 테넌트 데이터 격리 | Row-Level Security (PostgreSQL), Namespace 분리 |
| **네트워크 격리** | 제품 간 직접 통신 차단 | K8s Network Policy |
| **리소스 격리** | 리소스 경합 방지 | K8s ResourceQuota, LimitRange |

---

## 3. Kubernetes Namespace Strategy

```
Namespace: platform          ← 16개 Platform 서비스 (Tier 1~4)
Namespace: blog-saas         ← Blog Automation SaaS
Namespace: mfco-saas         ← MFCO SaaS
Namespace: smartfarm-saas   ← Smart Farm SaaS
Namespace: knowledge-saas   ← Knowledge SaaS
Namespace: recipe-ai         ← Recipe AI
Namespace: edu-platform      ← Education Platform
Namespace: shared-infra      ← PostgreSQL, Neo4j, Qdrant, Redis, Kafka
Namespace: observability     ← Prometheus, Grafana, Loki
```

**Network Policy**: Product Namespace → `platform` Namespace (API만 허용)  
Product Namespace 간 직접 통신 절대 금지 (K8s NetworkPolicy로 차단)

---

## 4. CI/CD Isolation

각 Product는 독립적인 CI/CD 파이프라인을 가진다.

```
Product: blog-saas
├── .github/workflows/blog-saas-ci.yml    ← PR 단위 테스트
├── .github/workflows/blog-saas-deploy.yml ← 배포 (Staging/Production)
└── helm/blog-saas/                        ← Helm Chart

Product: mfco-saas
├── .github/workflows/mfco-saas-ci.yml
└── helm/mfco-saas/
```

**배포 독립성**: 한 Product 배포가 다른 Product에 영향을 주지 않는다.

---

## 5. Data Isolation (Multitenancy)

### 5.1 PostgreSQL Row-Level Security (RLS)

```sql
-- 테넌트 격리 예시
CREATE POLICY tenant_isolation ON users
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

### 5.2 Product DB Schema Separation

| Product | DB Schema |
| :--- | :--- |
| Platform | `platform_*` (auth, users, billing, audit 등) |
| Blog SaaS | `blog_*` |
| MFCO SaaS | `mfco_*` |
| Smart Farm | `smartfarm_*` |
| Knowledge SaaS | `knowledge_*` |
| Recipe AI | `recipe_*` |
| Edu Platform | `edu_*` |

**규칙**: Product는 자신의 스키마만 접근 가능. Platform 스키마 직접 쿼리 금지.

---

## 6. Fault Isolation

### 6.1 Circuit Breaker Pattern

모든 Product-to-Platform API 호출에 Circuit Breaker를 적용한다.

```python
# Python 예시 (tenacity)
from tenacity import retry, stop_after_attempt, wait_exponential, CircuitBreaker

@retry(stop=stop_after_attempt(3), wait=wait_exponential())
async def call_platform_ai(prompt: str):
    return await platform_ai_client.generate(prompt)
```

### 6.2 Timeout Policy

| 호출 유형 | Timeout |
| :--- | :--- |
| Platform REST API (동기) | 5초 |
| Platform AI API (동기) | 30초 |
| Platform AI API (스트리밍) | 120초 |
| Internal Platform 서비스 간 | 3초 |
| 외부 API (Stripe 등) | 10초 |

### 6.3 Graceful Degradation

| Platform 서비스 장애 | Product 대응 |
| :--- | :--- |
| AI Engine 장애 | 캐시된 결과 반환 또는 "AI 기능 일시 중단" 안내 |
| Notification 장애 | 이메일 큐에 저장, 복구 후 재발송 |
| Search 장애 | 기본 DB 검색으로 Fallback |
| Billing 장애 | 기존 구독 상태 유지 (장애 중 결제 차단, 서비스 중단 없음) |

---

## 7. Version Independence

### 7.1 Product-Platform API 버전 독립

```yaml
# 각 Product의 platform-api-version 설정 (Helm values.yaml)
platform:
  api_version: v1       # Product가 사용하는 Platform API 버전
  ai_api_version: v1
```

Product는 Platform API Major 버전이 올라가도 자신이 준비되기 전까지 구버전을 사용할 수 있다. (Deprecation 12개월 보장)

### 7.2 Shared Component 버전 고정

```json
// package.json
{
  "dependencies": {
    "@ymlab/design-system": "^2.3.0",   // 마이너/패치만 자동 업데이트
    "@ymlab/api-sdk": "^1.5.0",
    "@ymlab/ai-sdk": "~1.2.0"            // 패치만 자동 업데이트
  }
}
```

---

## 8. Test Isolation

### 8.1 Platform Service Mocking

각 Product의 단위/통합 테스트에서 Platform 서비스는 Mock으로 대체한다.

```python
# pytest fixture 예시
@pytest.fixture
def mock_platform_auth():
    with patch('ymlab_sdk.auth.verify_token') as mock:
        mock.return_value = {'user_id': 'test-user-001', 'tenant_id': 'test-tenant'}
        yield mock
```

### 8.2 Test DB Isolation

```yaml
# CI 환경 테스트 DB (Docker Compose)
services:
  test-db:
    image: postgres:16
    environment:
      POSTGRES_DB: blog_saas_test
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
```

---

## 9. Product Isolation Checklist

Product 온보딩 및 배포 전 다음 체크리스트를 충족해야 한다.

- [ ] 독립 K8s Namespace 생성 완료
- [ ] Network Policy 설정 완료 (다른 Product Namespace 격리)
- [ ] 독립 CI/CD Pipeline 구성 완료
- [ ] Product 전용 DB Schema 분리 완료
- [ ] Circuit Breaker 적용 완료 (Platform API 호출 전체)
- [ ] Timeout 정책 적용 완료
- [ ] Graceful Degradation 시나리오 테스트 완료
- [ ] Platform API 버전 고정 완료 (`values.yaml`)
- [ ] Shared Component 버전 고정 완료 (`package.json`)
- [ ] Mock 기반 독립 테스트 실행 가능 확인
- [ ] ResourceQuota, LimitRange 설정 완료
