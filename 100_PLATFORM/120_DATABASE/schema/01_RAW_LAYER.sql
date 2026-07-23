-- =============================================================================
-- COMMON FOOD PLATFORM - 120_DATABASE: RAW LAYER SCHEMA
-- Specification: OpenAPI에서 수집한 원본(RAW) 데이터는 절대로 수정하지 않으며,
--               페이로드 SHA-256 해시값과 함께 수집 당시 상태 그대로 영구 보존합니다.
-- =============================================================================

CREATE TABLE IF NOT EXISTS RAW_API_PAYLOADS (
    raw_id VARCHAR(64) PRIMARY KEY,                   -- UUID 또는 SHA256 기반 원본 ID
    source_system VARCHAR(100) NOT NULL,              -- 예: 'RDA_NONGSARO_API'
    endpoint VARCHAR(200) NOT NULL,                   -- 예: 'food/detail'
    target_code VARCHAR(100) NOT NULL,                -- 요청한 식품/레시피 코드
    raw_payload TEXT NOT NULL,                        -- 수집된 원본 JSON/XML 텍스트 (절대 수정 불가)
    payload_hash VARCHAR(64) NOT NULL,                -- SHA-256 무결성 검증 해시
    ingested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- 수집 시각
    CONSTRAINT uk_raw_payload_hash UNIQUE (payload_hash)
);

CREATE INDEX IF NOT EXISTS idx_raw_source_target ON RAW_API_PAYLOADS(source_system, target_code);
CREATE INDEX IF NOT EXISTS idx_raw_ingested_at ON RAW_API_PAYLOADS(ingested_at);
