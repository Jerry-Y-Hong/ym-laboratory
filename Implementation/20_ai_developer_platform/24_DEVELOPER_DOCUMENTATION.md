# Developer Documentation

> **Module**: 20_ai_developer_platform — Document 24  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Automated Documentation Generation System (개발자 문서화)

개발자 문서화(Developer Documentation)는 SDK 소스코드의 파이썬 독스트링(Docstrings) 및 REST API 게이트웨이 엔드포인트 명세를 해독하여, **추가 문서 타이핑 작업 없이 규격화된 개발자 지식 포털용 HTML/마크다운 문서를 자동 렌더링 발행해 주는 문서화 파이프라인 인프라**이다.

```
       [SDK 소스코드 작성 / API 엔드포인트 변경]
                           │
                           ▼
          [Sphinx / Swagger 자동 추출기 작동]
                           │
         ┌─────────────────┴─────────────────┐
         ▼                                   ▼
  [Python Docstrings]                [Swagger OpenAPI Specs]
 (Sphinx autodoc 추출)              ( FastAPI router.json 추출)
         │                                   │
         └─────────────────┬─────────────────┘
                           ▼
            [개발자 지식 포털에 API 문서 연동 릴리즈]
```

---

## 2. Python Docstring Standards (Sphinx & Ruff Format)

모든 SDK 및 플러그인 에이전트 클래스 작성 시 준수해야 하는 파이썬 독스트링 명세 규칙:
- **Google Style Docstring**:
  ```python
  def execute(self, request_payload: dict) -> dict:
      """에이전트 실행 코어 진입점.
      
      Args:
          request_payload (dict): 호출 요청 JSON 데이터
          
      Returns:
          dict: SUCCESS 또는 ERROR 상태의 JSON 데이터
      
      Raises:
          KeyError: 필수 쿼리 매개변수 누락 시 발생
      """
  ```

---

## 3. Swagger OpenAPI Spec Extraction Rules

- ** FastAPI Router 연동**:
  - API 게이트웨이의 라우터 코드 수정 시, CI/CD 파이프라인이 게이트웨이를 백그라운드로 1회 띄우고 `/openapi.json` 파일을 자동 인출하여 `Distribution Portal`의 레퍼런스 페이지에 스웨거 화면을 실시간 업데이트한다.
- **문서화 린트 수칙**:
  - 문서 추출기가 클래스 및 메서드에 독스트링이 누락된 항목을 감지하면 빌드 경고(`WARNING`) 로그를 남기고 컴파일러가 해당 항목을 미완성 경고 태그로 마킹하여 개발 포털에 올린다.
Ref: [Ecosystem API Specification](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/19_ai_product_ecosystem/15_ECOSYSTEM_API.md)
