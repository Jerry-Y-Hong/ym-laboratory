# Configuration System

> **Module**: 17_ai_agent_orchestration_system — Document 06  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Agent Configuration Architecture

에이전트 설정 시스템(Configuration System)은 전체 파이프라인의 에이전트 매개변수, 사용 AI 모델 벤더 정보, 실행 환경 설정을 `config.json`과 동적으로 연계하여 파싱 및 주입(Dependency Injection)하는 환경 설정 구조이다.

```
                    [config.json 로드]
                             │
                             ▼
                 [Settings 로더 클래스 파싱]
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
   [엔진 실행 환경]     [에이전트 벤더 맵]   [디스크 저장소 경로]
 (dev, sandbox 등)     (google, claude)     (data/ ready_to/ 등)
```

---

## 2. Configuration Mappings & Variables

설정 클래스가 런타임에 판독하는 핵심 환경 매개변수 규격:

### 2.1 Agent to Vendor Models
- 에이전트 종류별로 개별적인 AI 모델 라우팅을 매핑할 수 있도록 유연성을 제공한다.
  - `planning_agent_model`: `"gemini-1.5-flash"`
  - `generation_agent_model`: `"claude-3-5-sonnet"`
  - `validation_agent_model`: `"mock-model"` (로컬 팩트체크 용)

### 2.2 Storage Paths & Timeouts
- 데이터 영속성 I/O 및 SQLite 지연 한계 타임아웃 세팅.
  - `sqlite_db_path`: `"data/catalog.db"`
  - `db_timeout`: `30.0` (SQLite 잠금 회피 타임아웃 초)
  - `ready_publish_dir`: `"data/ready_to_publish/"`

---

## 3. Configuration Parsed Class Design (Python)

```python
import json
import os
from dataclasses import dataclass, field

@dataclass
class AgentConfig:
    vendor: str
    model: str
    temperature: float = 0.1
    max_tokens: int = 4096

@dataclass
class PlatformSettings:
    system_env: str = "development"
    db_path: str = "data/catalog.db"
    timeout: float = 30.0
    posts_dir: str = "data/posts"
    ready_dir: str = "data/ready_to_publish"
    agents: dict[str, AgentConfig] = field(default_factory=dict)

    @classmethod
    def load_from_file(cls, filepath: str) -> "PlatformSettings":
        """config.json 파일을 파싱하여 설정 인스턴스를 주입한다."""
        if not os.path.exists(filepath):
            return cls()  # 기본값 반환
            
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        # 에이전트별 매핑 가공
        agents_map = {}
        for k, v in data.get("agents_config", {}).items():
            agents_map[k] = AgentConfig(
                vendor=v.get("vendor", "mock"),
                model=v.get("model", "mock-model"),
                temperature=v.get("temperature", 0.1)
            )
            
        return cls(
            system_env=data.get("system_env", "development"),
            db_path=data.get("database", {}).get("sqlite_path", "data/catalog.db"),
            timeout=data.get("database", {}).get("timeout_seconds", 30.0),
            posts_dir=data.get("storage", {}).get("posts_directory", "data/posts"),
            ready_dir=data.get("storage", {}).get("ready_directory", "data/ready_to_publish"),
            agents=agents_map
        )
```

이 구조는 설정 모듈의 위치(예: 단일 파일 또는 향후 `config/` 디렉터리 구성으로의 구조 확장)에 영향을 받지 않도록 추상화되며, 오케스트레이션 엔진이 환경 변수를 안전하게 주입받는 통로로 활약한다.
