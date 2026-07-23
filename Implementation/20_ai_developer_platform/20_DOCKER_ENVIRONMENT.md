# Docker Environment

> **Module**: 20_ai_developer_platform — Document 20  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Docker Multi-Stage Image Build Specs (도커 환경 규격)

도커 환경 규격(Docker Environment)은 로컬 샌드박스 런타임 및 클라우드/스테이징 배포 용도로 양산 제품군을 도커 컨테이너 이미지로 빌드하고 구동 제어하기 위해 **Dockerfile 및 Docker Compose 표준 설정을 정의하는 환경 명세**이다.

```
                  [Dockerfile Multi-Stage 빌드 시작]
                                  │
                                  ▼
      [Stage 1: Build-Stage] (의존성 패키지 다운로드 및 링커 연결)
                                  │
                                  ▼
      [Stage 2: Production] (가벼운 Alpine 베이스 이미지 복제)
                                  │
                                  ▼
      [임시 캐시/테스트 소스코드 소거 및 catalog.db 안전 주입]
                                  │
                                  ▼
      [비루트(Non-Root) 사용자 계정 적용 및 run.py ENTRYPOINT 선언]
```

---

## 2. Dockerfile Specification

플랫폼 표준 Dockerfile 예제:

```dockerfile
# 1단계: 빌드 및 종속성 해독
FROM python:3.10-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# 2단계: 경량 프로덕션 이미지 전개
FROM python:3.10-alpine
WORKDIR /app

# 비루트 사용자 설정으로 샌드박스 보안 강화
RUN addgroup -S ymlab && adduser -S ymlab -G ymlab
USER ymlab

# 빌드 산출물 격리 복사
COPY --from=builder /root/.local /home/ymlab/.local
COPY --chown=ymlab:ymlab . .

ENV PATH=/home/ymlab/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1

EXPOSE 8000
ENTRYPOINT ["python", "run.py"]
```

---

## 3. Docker Compose Environment Setup

다중 제품 샌드박스와 API 시뮬레이터, 대시보드 인프라를 로컬에서 연동 테스트하기 위한 `docker-compose.yml` 사양:

```yaml
version: '3.8'

services:
  api-simulator:
    image: ymlab/api-simulator:latest
    ports:
      - "8000:8000"
    environment:
      - ENV=development

  kimchi-blog-service:
    build:
      context: ./products/kimchi_blog_saas
      dockerfile: Dockerfile
    depends_on:
      - api-simulator
    environment:
      - GATEWAY_URL=http://api-simulator:8000
    volumes:
      - ./products/kimchi_blog_saas/data:/app/data
```
Ref: [Deployment Container](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/19_ai_product_ecosystem/08_DEPLOYMENT_CONTAINER.md)
