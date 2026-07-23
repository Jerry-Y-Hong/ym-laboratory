# Sample Project

> **Module**: 20_ai_developer_platform — Document 23  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. YM-LAB Sample Project Overview

샘플 프로젝트(Sample Project)는 개발자 및 파트너사의 신속한 온보딩과 학습을 돕기 위해, **배추김치(Q_KIMCHI_001) 식재료 정보 RAG 기획 및 아티클 자동 생성을 완벽하게 시뮬레이션할 수 있는 모의 독립 구현체 코드 구조 명세**이다.

```
       [sample_kimchi_service/ (샘플 구조 루트)]
                       │
       ├── config.json (로컬 Mock 환경 설정 파일)
       ├── verify_product.py (자가 진단 스크립트)
       ├── run.py (가상 가동 진입 스크립트)
       └── platform_libs/ (ymlab SDK 설치 모의 라이브러리)
```

---

## 2. Sample Code Base Spec (모의 작동 구현부)

### 2.1 Sample `config.json`
```json
{
  "product_id": "PROD_MOCK_KIMCHI",
  "system_env": "development",
  "database": {
    "sqlite_path": "data/catalog.db",
    "timeout_seconds": 30.0
  },
  "storage": {
    "posts_directory": "data/posts",
    "failed_directory": "data/failed",
    "ready_directory": "data/ready_to_publish",
    "queue_file": "data/publish_queue.json"
  }
}
```

### 2.2 Sample `run.py`
```python
import os
import sys

# 샌드박스 가상 런타임 제어
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(BASE_DIR, 'platform_libs'))

from ymlab.db.connection import SafeDBConnector
from ymlab.agent.base import BaseAgent

class MockArticleAgent(BaseAgent):
    """모의 아티클 생성 에이전트 샘플 클래스"""
    def execute(self, request_payload: dict) -> dict:
        q_code = request_payload.get("params", {}).get("q_code", "Q_KIMCHI_001")
        
        # 1. catalog.db 모의 안전 조회
        with SafeDBConnector("data/catalog.db") as conn:
            # 쿼리 시뮬레이션
            nutrition_data = "나트륨 630mg, 칼륨 220mg, 식이섬유 1.8g"
            
        # 2. 마크다운 본문 조합
        title = "배추김치의 한식 영양 성분 균형 분석"
        markdown_body = f"# {title}\n배추김치({q_code})의 영양 정보는 {nutrition_data} 입니다."
        
        return {
            "status": "SUCCESS",
            "agent": "mock_article_agent",
            "output": {
                "title": title,
                "draft_body": markdown_body
            }
        }

if __name__ == "__main__":
    agent = MockArticleAgent({"env": "dev"})
    res = agent.execute({"params": {"q_code": "Q_KIMCHI_001"}})
    print(f"[SAMPLE] Agent Execution Result: {res['status']}")
    print(f"[SAMPLE] Output Draft:\n{res['output']['draft_body']}")
```
Ref: [Local Development Environment](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/20_ai_developer_platform/08_LOCAL_DEVELOPMENT_ENVIRONMENT.md) (Linked for context)
