# 150_SHARED (공통 레이어)

## 개요
`150_SHARED` 모듈은 공통 식품 플랫폼 전체(`110_API`, `120_DATABASE`, `130_AI_ENGINE`, `140_AUTOMATION`)에서 공유하는 구조화 로깅, 커스텀 예외 체계, 및 암호화 해싱 유틸리티를 제공합니다.

## 모듈 구성
- `logger.py`: 표준 출력 및 파일 로그 기록을 위한 공통 로깅 구조 (`setup_logger`)
- `exceptions.py`: 계층별 예외 체계 (`PlatformBaseException`, `APIException`, `DatabaseException`, `RawDataIntegrityException`)
- `utils.py`: SHA-256 페이로드 해시 계산 (`calculate_hash`), ISO 8601 타임스탬프 (`get_utc_now_iso`)
