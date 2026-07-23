# Version Manager

> **Module**: 20_ai_developer_platform — Document 17  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. SDK & Agent Version Control Rules (버전 관리)

버전 관리(Version Manager)는 개발자가 생산하는 SDK, 커스텀 플러그인 에이전트 및 완제품 서비스의 버전 흐름을 일관되게 기록하고 추적하기 위해 **유의적 버전(Semantic Versioning) 표기법 및 Git 태깅 거버넌스를 결합 제어하는 표준 규정**이다.

```
       [신규 기능/패치 코딩 완료]
                   │
                   ▼
     [SemVer 규칙에 의한 버전 증분 결정] (MAJOR.MINOR.PATCH)
                   │
                   ▼
     [ymlab-cli version bump 구동] ──→ version_history.json 에 이력 기입
                   │
                   ▼
      [Git Tagging 및 브랜치 격리] ──→ release-vX.Y.Z 자동 생성 및 커밋 해시 잠금
```

---

## 2. SemVer Application Standards & Git Tagging

- **`MAJOR` / `MINOR` / `PATCH` 적용 기준**:
  - `MAJOR`: SDK 인터페이스 추상 메소드 프로토콜 규격이 변경되어 하위 컴포넌트 붕괴가 발생할 시.
  - `MINOR`: 신규 에이전트 플러그인 유형이 추가되거나 SDK 헬퍼 함수가 증설되었을 시.
  - `PATCH`: 단순 린트 오류 수정, 로깅 텍스트 변경 등 단순 버그 핫픽스 시.
- **Git Release Tagging**:
  - 릴리즈 브랜치 생성 시점에 커밋 해시에 버전 태그(`vX.Y.Z`)를 영구 마킹하여, 배포 포털이 추후 특정 패치 시점으로 롤백을 안전하게 가동할 수 있도록 기틀을 다진다.

---

## 3. Product Version History Registry (JSON)

```json
{
  "product_id": "PROD_KIMCHI_BLOG_SAAS",
  "version_history": [
    {
      "version": "1.0.0",
      "commit": "a8f276cd82b8a7b8e8f81a7b88df18903c6938df",
      "date": "2026-07-22T18:15:00+09:00",
      "author": "YMLAB_DEV_TEAM",
      "notes": "김치 블로그 자동화 솔루션 최초 양산 버전 릴리즈"
    }
  ]
}
```
Ref: [Version Management Specification](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/18_ai_product_factory/09_VERSION_MANAGEMENT_SPECIFICATION.md)
