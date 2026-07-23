# Template Engine

> **Module**: 20_ai_developer_platform — Document 05  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Project Template Engine Mechanism (템플릿 엔진)

템플릿 엔진(Template Engine)은 블루프린트에 정의된 제품 식별 메타데이터, 타겟 식재료(Q-Code) 도메인 범위 및 사용 에이전트 목록을 바탕으로, **표준 파일 및 소스코드 내부에 적절한 변수를 텍스트 치환 기법으로 안전하게 렌더링 주입하여 맞춤형 제품 디렉터리 형상을 조립해 내는 동적 양산 렌더러**이다.

```
       [blueprint.json 메타 정보 입력] (category: kimchi, product_name 등)
                     │
                     ▼
        [Template Engine 변수 파싱] ──→ Template Context 딕셔너리 생성
                     │
                     ▼
       [Template Skeleton 파일 스캔] ──→ run.py, config.json 렌더링 대기
                     │
                     ▼
     [Safe Replacement 변수 치환] ──→ {{product_name}} -> "배추김치 블로그 SaaS"
                     │
                     ▼
        [격리 Staging 대상 디렉터리에 물리 저장 파일 출력]
```

---

## 2. Token Formatting & Variables Rendering Rules

템플릿 엔진이 렌더링 파일 내부에서 감지 및 치환하는 마크업 토큰 스펙:
- `{{product_id}}`: 제품을 유일 식별하는 영문 대문자 ID 바인딩.
- `{{q_code}}`: 식재료 온톨로지 조회용 Q-Code 키 바인딩.
- `{{agent_workflow_calls}}`: `run.py` 진입점에 주입될 오케스트레이션 엔진 에이전트 실행 시퀀스 구문.

---

## 3. Dynamic Template Renderer Implementation (Python Template Spec)

```python
import os

class YMLabTemplateRenderer:
    """텍스트 파일 내부의 이중 중괄호 템플릿 변수를 정규식 치환하는 엔진"""
    def __init__(self, context: dict):
        self.context = context

    def render_string(self, template_str: str) -> str:
        """문자열 내의 템플릿 토큰을 context 값으로 치환하여 반환"""
        rendered = template_str
        for key, val in self.context.items():
            token = "{{" + str(key) + "}}"
            rendered = rendered.replace(token, str(val))
        return rendered

    def render_file(self, src_path: str, dest_path: str):
        """소스 템플릿 파일을 읽어 렌더링 결과를 원자적으로 새 파일에 저장"""
        with open(src_path, "r", encoding="utf-8") as f:
            template_content = f.read()
            
        rendered_content = self.render_string(template_content)
        
        # Safe Write 원자적 교체 기법 적용
        tmp_path = dest_path + ".tmp"
        with open(tmp_path, "w", encoding="utf-8") as f:
            f.write(rendered_content)
            
        os.replace(tmp_path, dest_path)
```
- **렌더링 유효 검사 제약**:
  - 파일 치환 후 렌더링되지 않고 텍스트 파일 내에 유실 보존된 `{{` 또는 `}}` 토큰이 남아있는지 정적 분석을 구동하며, 잔존 미치환 토큰 발견 시 빌드 오류를 발령하여 오작동을 원천 예방한다.
Ref: [Product Template Specification](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/18_ai_product_factory/03_PRODUCT_TEMPLATE_SPECIFICATION.md)
