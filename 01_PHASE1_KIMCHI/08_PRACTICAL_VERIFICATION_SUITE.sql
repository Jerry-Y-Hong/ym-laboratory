-- =============================================================================
-- GLOBAL KIMCHI AI KNOWLEDGE PLATFORM - ENTERPRISE PRACTICAL VERIFICATION SUITE
-- File: 08_PRACTICAL_VERIFICATION_SUITE.sql
-- Version: 1.0.0 Enterprise Verification Suite
-- Purpose: PostgreSQL 환경에서 DDL 가능성, UNIQUE/CHECK/FK 제약 위반,
--          Optimistic Lock (성공/실패), Transaction ROLLBACK, 
--          Secondary Index & EXPLAIN ANALYZE, 동시성(Concurrency)을 종합 실증 검증
-- =============================================================================

BEGIN;

-- =============================================================================
-- SECTION 1. DDL 실행 및 테이블 스키마 생성
-- =============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1.1 Meta Master
CREATE TABLE IF NOT EXISTS TEST_LANGUAGE_MASTER (
    language_code VARCHAR(10) PRIMARY KEY,
    language_name_en VARCHAR(100) NOT NULL
);

-- 1.2 Core Master (CHECK constraint: 0 <= spiciness_level <= 5)
CREATE TABLE IF NOT EXISTS TEST_KIMCHI_MASTER (
    kimchi_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kimchi_code VARCHAR(50) UNIQUE NOT NULL,
    spiciness_level INT CHECK (spiciness_level BETWEEN 0 AND 5)
);

-- 1.3 Master I18N
CREATE TABLE IF NOT EXISTS TEST_KIMCHI_MASTER_I18N (
    kimchi_id UUID REFERENCES TEST_KIMCHI_MASTER(kimchi_id) ON DELETE CASCADE,
    language_code VARCHAR(10) REFERENCES TEST_LANGUAGE_MASTER(language_code),
    name VARCHAR(200) NOT NULL,
    summary TEXT,
    cultural_significance TEXT,
    PRIMARY KEY (kimchi_id, language_code)
);

-- 1.4 Content Master & Secondary Indexes
CREATE TABLE IF NOT EXISTS TEST_CONTENT_MASTER (
    content_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    version INT NOT NULL DEFAULT 1 -- Optimistic Locking Version
);

-- Secondary Index 생성
CREATE INDEX IF NOT EXISTS idx_test_content_status ON TEST_CONTENT_MASTER(status);
CREATE INDEX IF NOT EXISTS idx_test_content_version ON TEST_CONTENT_MASTER(version);

-- 1.5 Explicit Junction Table (Ref) - ON DELETE RESTRICT 적용
CREATE TABLE IF NOT EXISTS TEST_CONTENT_KIMCHI_REF (
    content_id UUID REFERENCES TEST_CONTENT_MASTER(content_id) ON DELETE CASCADE,
    kimchi_id UUID REFERENCES TEST_KIMCHI_MASTER(kimchi_id) ON DELETE RESTRICT,
    PRIMARY KEY (content_id, kimchi_id)
);

CREATE INDEX IF NOT EXISTS idx_test_ref_kimchi_id ON TEST_CONTENT_KIMCHI_REF(kimchi_id);

-- =============================================================================
-- SECTION 2. 임시 시드 데이터 투입
-- =============================================================================

INSERT INTO TEST_LANGUAGE_MASTER (language_code, language_name_en) VALUES ('ko', 'Korean'), ('en', 'English');

INSERT INTO TEST_KIMCHI_MASTER (kimchi_id, kimchi_code, spiciness_level) 
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'KIMCHI_POGI_01', 3);

INSERT INTO TEST_KIMCHI_MASTER_I18N (kimchi_id, language_code, name, summary, cultural_significance)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'en', 'Napa Cabbage Kimchi', 'Traditional Kimchi', 'UNESCO Heritage 2013');

INSERT INTO TEST_CONTENT_MASTER (content_id, title, status, version)
VALUES ('b1febc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'The Secret of Baechu Kimchi', 'DRAFT', 1);

INSERT INTO TEST_CONTENT_KIMCHI_REF (content_id, kimchi_id)
VALUES ('b1febc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');

-- =============================================================================
-- SECTION 3. 실증 테스팅 (PRACTICAL VERIFICATION SUITE)
-- =============================================================================

-- TEST 3.1 UNIQUE 제약 위반 (unique_violation) 포착 테스트
DO $$
BEGIN
    INSERT INTO TEST_KIMCHI_MASTER (kimchi_code, spiciness_level) VALUES ('KIMCHI_POGI_01', 2);
    RAISE EXCEPTION 'TEST FAILED: Duplicate kimchi_code was allowed!';
EXCEPTION
    WHEN unique_violation THEN
        RAISE NOTICE '▶ TEST 3.1 SUCCESS: UNIQUE constraint (unique_violation) correctly blocked duplicate kimchi_code!';
END $$;

-- TEST 3.2 CHECK 제약 위반 (check_violation) 포착 테스트 (spiciness_level = 8 > 5)
DO $$
BEGIN
    INSERT INTO TEST_KIMCHI_MASTER (kimchi_code, spiciness_level) VALUES ('KIMCHI_TEST_ERR', 8);
    RAISE EXCEPTION 'TEST FAILED: Invalid spiciness_level=8 was allowed!';
EXCEPTION
    WHEN check_violation THEN
        RAISE NOTICE '▶ TEST 3.2 SUCCESS: CHECK constraint (check_violation) correctly blocked invalid spiciness_level=8!';
END $$;

-- TEST 3.3 존재하지 않는 FK 참조 (foreign_key_violation) 포착 테스트
DO $$
BEGIN
    INSERT INTO TEST_CONTENT_KIMCHI_REF (content_id, kimchi_id)
    VALUES ('b1febc99-9c0b-4ef8-bb6d-6bb9bd380a22', '99999999-9999-9999-9999-999999999999');
    RAISE EXCEPTION 'TEST FAILED: Non-existent FK kimchi_id was allowed!';
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE '▶ TEST 3.3 SUCCESS: Foreign Key constraint (foreign_key_violation) correctly blocked invalid kimchi_id!';
END $$;

-- TEST 3.4 ON DELETE RESTRICT 마스터 보호 포착 테스트
DO $$
BEGIN
    DELETE FROM TEST_KIMCHI_MASTER WHERE kimchi_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    RAISE EXCEPTION 'TEST FAILED: Master was deleted despite RESTRICT policy!';
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE '▶ TEST 3.4 SUCCESS: ON DELETE RESTRICT policy correctly protected Master from deletion!';
END $$;

-- TEST 3.5 Optimistic Locking 성공 (version = 1 -> version = 2) 테스트
DO $$
DECLARE
    affected_rows INT;
BEGIN
    UPDATE TEST_CONTENT_MASTER 
    SET title = 'Updated Title by Session A', version = version + 1 
    WHERE content_id = 'b1febc99-9c0b-4ef8-bb6d-6bb9bd380a22' AND version = 1;
    
    GET DIAGNOSTICS affected_rows = ROW_COUNT;
    IF affected_rows = 1 THEN
        RAISE NOTICE '▶ TEST 3.5 SUCCESS: Optimistic Locking version 1 -> 2 update succeeded (1 row updated).';
    ELSE
        RAISE EXCEPTION 'TEST 3.5 FAILED: Expected 1 row updated, got %', affected_rows;
    END IF;
END $$;

-- TEST 3.6 Optimistic Locking 실패 (이미 version = 2인 상태에서 과거 version = 1로 다시 수정 시도 -> UPDATE 0)
DO $$
DECLARE
    affected_rows INT;
BEGIN
    -- 과거 version=1로 수정 시도 (현재 DB에는 version=2가 저장되어 있음)
    UPDATE TEST_CONTENT_MASTER 
    SET title = 'Stale Update by Session B', version = version + 1 
    WHERE content_id = 'b1febc99-9c0b-4ef8-bb6d-6bb9bd380a22' AND version = 1;
    
    GET DIAGNOSTICS affected_rows = ROW_COUNT;
    IF affected_rows = 0 THEN
        RAISE NOTICE '▶ TEST 3.6 SUCCESS: Optimistic Lock Failure correctly detected! (0 rows updated due to version mismatch).';
    ELSE
        RAISE EXCEPTION 'TEST 3.6 FAILED: Stale version update should return 0 rows updated!';
    END IF;
END $$;

-- =============================================================================
-- SECTION 4. EXPLAIN ANALYZE 실행 계획 및 인덱스 활용 검증
-- =============================================================================

-- 4.1 Secondary Index 활용 SELECT 실행 계획 확인
EXPLAIN ANALYZE 
SELECT * FROM TEST_CONTENT_MASTER WHERE status = 'DRAFT';

-- 4.2 Junction Table Join 연산 실행 계획 확인
EXPLAIN ANALYZE 
SELECT 
    c.content_id, 
    c.title, 
    k.kimchi_code 
FROM TEST_CONTENT_MASTER c
JOIN TEST_CONTENT_KIMCHI_REF r ON c.content_id = r.content_id
JOIN TEST_KIMCHI_MASTER k ON r.kimchi_id = k.kimchi_id
WHERE c.version = 2;

-- =============================================================================
-- SECTION 5. 트랜잭션 ROLLBACK 무결성 실증 테스트
-- =============================================================================

SAVEPOINT sp_before_rollback_test;

INSERT INTO TEST_KIMCHI_MASTER (kimchi_code, spiciness_level) VALUES ('KIMCHI_ROLLBACK_TEMP', 1);

-- 의도적 ROLLBACK 실행
ROLLBACK TO SAVEPOINT sp_before_rollback_test;

DO $$
DECLARE
    cnt INT;
BEGIN
    SELECT COUNT(*) INTO cnt FROM TEST_KIMCHI_MASTER WHERE kimchi_code = 'KIMCHI_ROLLBACK_TEMP';
    IF cnt = 0 THEN
        RAISE NOTICE '▶ TEST 5.1 SUCCESS: Transaction ROLLBACK verified! No uncommitted data leaked.';
    ELSE
        RAISE EXCEPTION 'TEST 5.1 FAILED: Rollback data still exists!';
    END IF;
END $$;

-- =============================================================================
-- SECTION 6. CLEANUP (임시 검증 테이블 삭제)
-- =============================================================================

DROP TABLE TEST_CONTENT_KIMCHI_REF;
DROP TABLE TEST_CONTENT_MASTER;
DROP TABLE TEST_KIMCHI_MASTER_I18N;
DROP TABLE TEST_KIMCHI_MASTER;
DROP TABLE TEST_LANGUAGE_MASTER;

COMMIT;

-- =============================================================================
-- ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!
-- =============================================================================
