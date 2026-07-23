# Configuration Guide

> **Module**: 15_development_framework — Document 05  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. Configuration & Settings Management

YM-LAB PROJECT는 환경별 독립적인 로컬 설정 실행 및 보안 토큰 격리를 위해 기본적인 설정(Configuration) 및 세팅(Settings) 표준을 적용한다.

- **비밀 정보 격리**: API Key, 개인 계정 정보, DB 로컬 물리 경로는 소스코드 내에 직접 하드코딩하지 않고 구성 설정을 통해 제어한다.
- **환경 변수 분리**: 로컬 머신 설정이나 가변 경로 등은 운영 체제의 환경 변수나 로컬 환경 설정 파일(Settings)을 통해 주입한다.

---

## 2. Standard Setting Parameters

YM-LAB 로컬 구동에 사용되는 주요 핵심 설정 및 파라미터 규격:

- `ENV`: 실행 환경 (예: `development`, `test`)
- `DATABASE_PATH`: 로컬 SQLite 데이터베이스 경로
- `LOG_LEVEL`: 실행 로깅 레벨 (예: `DEBUG`, `INFO`, `WARNING`, `ERROR`)

---

## 3. Configuration Access in Python

파이썬 코드 내에서 설정을 정의할 때, 단일 파일이나 단일 구현체(예: 특정 `config.py` 클래스)로 고정하지 않고 향후 확장성(예: `config/` 디렉터리 구조로의 확장)을 열어둔다.

### 3.1 Basic Settings Load Pattern
```python
import os

class ProjectSettings:
    """프로젝트 설정 클래스 예시 (향후 config/ 디렉터리로 구조 확장 가능)"""
    def __init__(self):
        self.env = os.getenv("ENV", "development")
        self.database_path = os.getenv("DATABASE_PATH", "data/catalog.db")
        self.log_level = os.getenv("LOG_LEVEL", "INFO")
```

- **유연성 확보**: 설정 관리 모듈은 시스템 시작 시점에 환경 변수나 로컬 설정 파일로부터 파라미터를 읽어들이며, 특정 라이브러리나 벤더에 강하게 결합되지 않도록 파이썬 표준 라이브러리 위주로 구현한다.
