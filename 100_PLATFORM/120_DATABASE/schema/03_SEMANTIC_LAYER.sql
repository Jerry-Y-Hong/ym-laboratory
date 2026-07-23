-- =============================================================================
-- COMMON FOOD PLATFORM - 120_DATABASE: SEMANTIC LAYER SCHEMA
-- Specification: AI 가공, 시맨틱 검색, 그래프 관계 표현을 위한 AI 전용 데이터 레이어
-- =============================================================================

-- 1. Knowledge Graph Nodes
CREATE TABLE IF NOT EXISTS SEM_FOOD_KNOWLEDGE_NODES (
    node_id VARCHAR(64) PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,                 -- 예: 'FOOD', 'RECIPE', 'INGREDIENT', 'NUTRIENT'
    entity_id VARCHAR(64) NOT NULL,                   -- STD 계층의 PK 참조
    canonical_name VARCHAR(200) NOT NULL,
    metadata_json TEXT,                               -- 추가 메타데이터
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Knowledge Graph Relations
CREATE TABLE IF NOT EXISTS SEM_FOOD_RELATIONS (
    relation_id VARCHAR(64) PRIMARY KEY,
    source_node_id VARCHAR(64) REFERENCES SEM_FOOD_KNOWLEDGE_NODES(node_id) ON DELETE CASCADE,
    target_node_id VARCHAR(64) REFERENCES SEM_FOOD_KNOWLEDGE_NODES(node_id) ON DELETE CASCADE,
    relation_type VARCHAR(50) NOT NULL,               -- 예: 'HAS_RECIPE', 'CONTAINS_NUTRIENT', 'DERIVED_FROM'
    weight NUMERIC(4, 2) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. AI Vector Embeddings Storage
CREATE TABLE IF NOT EXISTS SEM_FOOD_EMBEDDINGS (
    embedding_id VARCHAR(64) PRIMARY KEY,
    node_id VARCHAR(64) REFERENCES SEM_FOOD_KNOWLEDGE_NODES(node_id) ON DELETE CASCADE,
    model_name VARCHAR(100) NOT NULL,                 -- 예: 'text-embedding-3-large'
    vector_data TEXT NOT NULL,                        -- Vector Data representation
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sem_node_type ON SEM_FOOD_KNOWLEDGE_NODES(entity_type);
CREATE INDEX IF NOT EXISTS idx_sem_rel_source ON SEM_FOOD_RELATIONS(source_node_id);
CREATE INDEX IF NOT EXISTS idx_sem_rel_target ON SEM_FOOD_RELATIONS(target_node_id);
