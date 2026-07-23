# Version Management Specification

> **Module**: 18_ai_product_factory — Document 09  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Product Semantic Versioning Standards (시맨틱 버저닝)

버전 관리 명세(Version Management Specification)는 양산되는 AI 제품군들의 독립적인 라이프사이클을 추적 및 통제하기 위해 유의적 버전(Semantic Versioning) 표기 규칙 및 배포 형상 추적 기준을 정의한다.

```
v[MAJOR].[MINOR].[PATCH]
```

- **MAJOR (주 버전)**: 제품의 핵심 블루프린트 요구 스키마가 크게 바뀌어 하위 호환성이 완전히 깨지거나 아키텍처 토폴로지가 대개편될 시 변경.
- **MINOR (부 버전)**: 신규 기능 모듈(예: 새로운 Media Agent 포맷 추가)이 연동되어 검증을 마쳤을 때 변경.
- **PATCH (수정 버전)**: 제품 고유의 텍스트 템플릿 수정, 설정 경로 오타 정정 등 기능적 추가 없이 단순 버그 핫픽스 시 변경.

---

## 2. Git Release Branching & Tagging (브랜치 및 태그 제어)

- **독립 릴리즈 브랜치 격리**:
  - 각 제품군은 main 공유 브랜치와 독립된 자체 릴리즈 브랜치(`release-{product_id}-vX.Y.Z`)를 생성해 형상을 관리한다.
  - 타 제품 코드와의 간섭을 피하기 위해 Git Subtree 또는 별도의 모듈 디렉터리 경로 격리 정책을 채택한다.
- **버전 태깅 강제**:
  - 팩토리가 패키징 및 배포를 승인한 완료 지점에는 반드시 `git tag -a {product_id}-vX.Y.Z -m "release metadata"` 태그를 마킹하여 변경 시점의 영구적 추적성을 보장한다.

---

## 3. Version Tracking Registry (JSON)

팩토리 엔진 및 배포 로더가 버전 형상을 관리하기 위해 참조하는 버전 이력 데이터 구조:

```json
{
  "product_id": "PROD_KIMCHI_BLOG_SAAS",
  "releases": [
    {
      "version": "1.0.0",
      "tag": "PROD_KIMCHI_BLOG_SAAS-v1.0.0",
      "commit_hash": "a8f276cd82b8a7b8e8f81a7b88df18903c6938df",
      "status": "active",
      "released_at": "2026-07-22T18:04:00+09:00"
    }
  ]
}
```
Ref: [Release Guide](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/15_development_framework/09_RELEASE_GUIDE.md)
