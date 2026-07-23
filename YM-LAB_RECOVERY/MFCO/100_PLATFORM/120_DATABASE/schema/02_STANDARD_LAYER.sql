-- =============================================================================
-- COMMON FOOD PLATFORM - 120_DATABASE: STANDARD LAYER SCHEMA
-- Specification: RAW 계층 정제 후 모든 식품(김치 포함)이 사용할 수 있는
--               표준 관계형 데이터베이스 스키마
-- =============================================================================

-- 1. Standard Food Master
CREATE TABLE IF NOT EXISTS STD_FOOD_MASTER (
    food_id VARCHAR(64) PRIMARY KEY,
    food_code VARCHAR(100) UNIQUE NOT NULL,
    food_name_ko VARCHAR(200) NOT NULL,
    food_name_en VARCHAR(200),
    category_code VARCHAR(50),
    category_name VARCHAR(100),
    raw_id VARCHAR(64) REFERENCES RAW_API_PAYLOADS(raw_id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Standard Recipe Master
CREATE TABLE IF NOT EXISTS STD_RECIPE_MASTER (
    recipe_id VARCHAR(64) PRIMARY KEY,
    food_id VARCHAR(64) REFERENCES STD_FOOD_MASTER(food_id) ON DELETE RESTRICT,
    recipe_name VARCHAR(200) NOT NULL,
    cooking_time_minutes INT,
    difficulty_level VARCHAR(20),
    servings INT,
    raw_id VARCHAR(64) REFERENCES RAW_API_PAYLOADS(raw_id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Standard Nutrient Master
CREATE TABLE IF NOT EXISTS STD_NUTRIENT_MASTER (
    nutrient_id VARCHAR(64) PRIMARY KEY,
    food_id VARCHAR(64) REFERENCES STD_FOOD_MASTER(food_id) ON DELETE CASCADE,
    calories_kcal NUMERIC(8, 2),
    carbohydrates_g NUMERIC(8, 2),
    protein_g NUMERIC(8, 2),
    fat_g NUMERIC(8, 2),
    sodium_mg NUMERIC(8, 2),
    dietary_fiber_g NUMERIC(8, 2),
    raw_id VARCHAR(64) REFERENCES RAW_API_PAYLOADS(raw_id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_std_food_code ON STD_FOOD_MASTER(food_code);
CREATE INDEX IF NOT EXISTS idx_std_recipe_food ON STD_RECIPE_MASTER(food_id);
CREATE INDEX IF NOT EXISTS idx_std_nutrient_food ON STD_NUTRIENT_MASTER(food_id);
