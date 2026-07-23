# Database Standard

> **Module**: 15_development_framework — Document 06  
> **Version**: `v1.0`  
> **Status**: ✅ ACTIVE  

---

## 1. SQLite Database Standard (catalog.db)

YM-LAB PROJECT의 핵심 구조적 정합성을 관리하는 로컬 SQLite 데이터베이스(`catalog.db`)의 관리 표준을 수립한다.

### 1.1 Connection & Session Management
- **단일 연결 원칙**: SQLite의 로컬 파일 잠금(Locking) 특성으로 인한 동시 쓰기 잠금 에러를 회피하기 위해, 하나의 스레드 또는 프로세스 내에서는 하나의 DB Connection 세션만을 재사용하여 순차 실행하도록 보장한다.
- **연결 타임아웃**: 동시성 대기로 인한 오류 방지를 위해 연결 시 최소 **30초** 이상의 `timeout` 속성을 명시한다.
  - 예: `sqlite3.connect(db_path, timeout=30.0)`
- **자동 자원 해제**: 파이썬 `with` 콘텍스트 매니저를 사용하여 트랜잭션 종료 시 커서 및 연결 자원이 즉시 close 되도록 보장한다.

### 1.2 Table Isolation & Data Constraints
- **기본 키와 인덱스 강제**: 모든 테이블은 고유한 Primary Key를 소유해야 하며, 잦은 검색 대상 필드(예: `food_code`, `post_id`)에는 반드시 Index를 명시하여 검색 속도를 유지한다.
- **스키마 불변성**: 이미 완료된 Phase의 00_DATABASE_SCHEMA_DDL.sql 파일 스키마는 수정할 수 없으며, 변경은 Additive 방식으로 신규 테이블 생성에 한해서만 허용된다.

---

## 2. JSON Storage Standard

데이터 구조가 유동적이거나 대규모 계층 구조를 보존해야 하는 경우(예: 로컬 포스트 목록 등), SQLite 대신 JSON 파일 저장 방식을 우선 적용한다.

- **인덱스-원장 분리 아키텍처**:
  - `data/posts/index.json`처럼 데이터의 메타정보(ID, 상태, 날짜)만 간략히 기록한 **인덱스 파일**을 단일 유지한다.
  - 실제 대용량 파일 데이터는 `{id}_{code}.md` 또는 `{id}.json` 형태로 물리적으로 분리하여 저장한다.
  - 인덱스를 먼저 스캔하고 필요한 원장 파일만을 특정하여 디스크에서 로드하도록 구현하여 성능 저하를 방지한다.
- **안전한 JSON 쓰기 (Safe Write)**:
  - 파일 쓰기 도중 에러가 나서 파일이 깨지는 현상을 방지하기 위해, 먼저 임시 파일(`.tmp`)에 데이터를 쓰고 완벽히 닫힌 직후 원래 파일명으로 원자적 덮어쓰기(`os.replace`) 처리하는 패턴을 지향한다.

---

## 3. Transaction & ACID Rules for Local I/O

- **Auto-Commit 방지**: 쓰기 및 수정 트랜잭션 수행 시에는 반드시 명시적인 `commit()` 명령을 사용하며, 예외 발생 시 `rollback()` 처리를 하도록 try-except-finally 구조를 유지한다.
- **동작 불변성**: 디스크 여유 공간 부족이나 권한 에러 등으로 쓰기 실패 시, 작업 대상 데이터의 유실이 발생하지 않도록 캐시에서 해당 세션 정보를 롤백하고 로그를 남긴다.
