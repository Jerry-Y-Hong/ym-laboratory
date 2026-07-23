# Configuration System

> **Module**: 20_ai_developer_platform — Document 10  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Product Configuration Lifecycle Rules (설정 시스템)

설정 관리 시스템(Configuration System)은 제품 팩토리 및 개발자 CLI에 의해 양산 조립된 개별 지식 서비스들이 플랫폼 마스터 설정 파일(`config.json`)을 안전하게 읽어 들이고, 개발 단계(`development`) 및 운영 단계(`production`)에 맞게 **환경 변수를 동적으로 교체 주입받을 수 있도록 규제하는 설정 데이터 바인딩 헬퍼**이다.

```
       [Platform Core Settings 로드]
                     │
                     ▼
        [Environment Branching 분기] ──→ (development / production)
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
   [Development 환경]      [Production 환경]
 - Local catalog.db       - Cloud Postgres DB
 - Mock API 활성화        - Live LLM API 활성화
 - data/posts 로컬 쓰기     - CDN / ready_publish 배포
```

---

## 2. Configuration Parameters & Validation Schema

개발자 플랫폼 내의 `load_platform_config`가 판독하는 환경 설정 규격:
- **`system_env`**: `"development"`, `"sandbox"`, `"production"` 중 택일.
- **`database.sqlite_path`**: 로컬 온톨로지 DB 상대 경로.
- **`ai_orchestration.vendor`**: API 호출 벤더사 지정 (`"google"`, `"claude"`, `"mock"`).

---

## 3. PlatformSettings Python DataClass Spec

SDK가 제공하는 환경 설정 로더 데이터 클래스:

```python
import json
import os
from dataclasses import dataclass

@dataclass
class DatabaseSettings:
    sqlite_path: str
    timeout_seconds: float = 30.0

@dataclass
class StorageSettings:
    posts_directory: str
    failed_directory: str
    ready_directory: str

@dataclass
class DeveloperConfig:
    product_id: str
    system_env: str
    database: DatabaseSettings
    storage: StorageSettings

    @classmethod
    def load(cls, file_path: str) -> "DeveloperConfig":
        """로컬 config.json 파일을 직렬화 파싱하여 설정 인스턴스 반환"""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Config file not found at: {file_path}")
            
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        db_data = data.get("database", {})
        store_data = data.get("storage", {})
        
        return cls(
            product_id=data.get("product_id", "PROD_UNKNOWN"),
            system_env=data.get("system_env", "development"),
            database=DatabaseSettings(
                sqlite_path=db_data.get("sqlite_path", "data/catalog.db"),
                timeout_seconds=db_data.get("timeout_seconds", 30.0)
            ),
            storage=StorageSettings(
                posts_directory=store_data.get("posts_directory", "data/posts"),
                failed_directory=store_data.get("failed_directory", "data/failed"),
                ready_directory=store_data.get("ready_directory", "data/ready_to_publish")
            )
        )
```
Ref: [Configuration Specification Document](file:///g:/내%20드라이브/YM-LAB_PROJECT_/Implementation/18_ai_product_factory/05_CONFIGURATION_SPECIFICATION.md)
