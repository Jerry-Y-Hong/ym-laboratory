-- =============================================================================
-- GLOBAL KIMCHI AI KNOWLEDGE PLATFORM - FULL DDL SCHEMA (PostgreSQL)
--
-- Status      : FROZEN
-- Version     : 1.0.0
-- Owner       : YM-LAB
-- Approved By : Architecture Review
-- Date        : 2026-07-20
--
-- Change Rule: All future schema modifications MUST follow the 6-Step Change Process
--              and be versioned as v1.1.0, v1.2.0, v2.0.0.
-- Architecture: MASTER (SSOT) -> AI_ENGINE -> CONTENT -> PUBLISH
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. BASE META MASTERS (Core SSOT)
-- =============================================================================

-- 1.1 LANGUAGE_MASTER
CREATE TABLE LANGUAGE_MASTER (
    language_code VARCHAR(10) PRIMARY KEY, -- ISO 639-1 (e.g., 'ko', 'en', 'ja', 'zh', 'es', 'fr')
    language_name_en VARCHAR(100) NOT NULL,
    language_name_native VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1.2 COUNTRY_MASTER
CREATE TABLE COUNTRY_MASTER (
    country_code VARCHAR(10) PRIMARY KEY, -- ISO 3166-1 alpha-2 (e.g., 'KR', 'US', 'JP', 'CN', 'DE')
    country_name_en VARCHAR(100) NOT NULL,
    default_language_code VARCHAR(10) REFERENCES LANGUAGE_MASTER(language_code),
    cultural_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1.3 LICENSE_MASTER
CREATE TABLE LICENSE_MASTER (
    license_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    license_code VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'CC-BY-4.0', 'PROPRIETARY', 'PUBLIC_DOMAIN'
    license_name VARCHAR(100) NOT NULL,
    terms_url TEXT,
    commercial_use_allowed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1.4 AUTHOR_MASTER (Author SSOT Data)
CREATE TABLE AUTHOR_MASTER (
    author_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_code VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'AI_CHEF_KIM', 'AI_DR_FERMENT'
    author_name VARCHAR(100) NOT NULL,
    persona_type VARCHAR(50) NOT NULL, -- 'AI_PERSONA', 'HUMAN_EDITOR', 'GUEST_EXPERT'
    bio TEXT,
    writing_style_prompt TEXT, -- Persona Configuration Data for AI Engine
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1.5 SOURCE_MASTER (Academic papers, Historical books)
CREATE TABLE SOURCE_MASTER (
    source_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_title VARCHAR(300) NOT NULL,
    author_or_editor VARCHAR(200),
    publication_year INT,
    source_type VARCHAR(50), -- 'HISTORICAL_BOOK', 'ACADEMIC_PAPER', 'GOVERNMENT_DOC', 'PATENT'
    isbn_or_doi VARCHAR(100),
    citation_text TEXT NOT NULL,
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1.6 TAG_MASTER
CREATE TABLE TAG_MASTER (
    tag_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tag_slug VARCHAR(100) UNIQUE NOT NULL,
    tag_category VARCHAR(50) -- 'HEALTH', 'DIET', 'SEASON', 'REGION', 'INGREDIENT'
);

-- =============================================================================
-- 2. DOMAIN CORE MASTERS (Pure SSOT)
-- =============================================================================

-- 2.1 CATEGORY_MASTER
CREATE TABLE CATEGORY_MASTER (
    category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_code VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'CAT_BAECHU', 'CAT_RADISH', 'CAT_WATER'
    parent_category_id UUID REFERENCES CATEGORY_MASTER(category_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2.2 NUTRITION_MASTER (Per 100g)
CREATE TABLE NUTRITION_MASTER (
    nutrition_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    calories_kcal NUMERIC(6,2),
    carbohydrates_g NUMERIC(6,2),
    protein_g NUMERIC(6,2),
    fat_g NUMERIC(6,2),
    sodium_mg NUMERIC(8,2),
    dietary_fiber_g NUMERIC(6,2),
    vitamin_c_mg NUMERIC(6,2),
    lactic_acid_bacteria_cfu_g BIGINT, -- e.g., 100000000 CFU/g
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2.3 KIMCHI_MASTER (Core SSOT)
CREATE TABLE KIMCHI_MASTER (
    kimchi_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kimchi_code VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'KIMCHI_PO GI_01'
    category_id UUID REFERENCES CATEGORY_MASTER(category_id),
    spiciness_level INT CHECK (spiciness_level BETWEEN 0 AND 5),
    salinity_level INT CHECK (salinity_level BETWEEN 0 AND 5),
    origin_region VARCHAR(100),
    seasonality VARCHAR(50), -- 'ALL_YEAR', 'WINTER', 'SPRING_SUMMER'
    nutrition_id UUID REFERENCES NUTRITION_MASTER(nutrition_id),
    is_standard_registered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2.4 INGREDIENT_MASTER
CREATE TABLE INGREDIENT_MASTER (
    ingredient_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ingredient_code VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'ING_NAPA_CABBAGE', 'ING_SAEWOOJEOT'
    ingredient_type VARCHAR(50) NOT NULL, -- 'MAIN', 'SUB', 'SEASONING', 'JEOTGAL'
    scientific_name VARCHAR(150),
    allergens VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2.5 RECIPE_MASTER
CREATE TABLE RECIPE_MASTER (
    recipe_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_code VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'RCP_TRADITIONAL_PO GI_01'
    kimchi_id UUID REFERENCES KIMCHI_MASTER(kimchi_id),
    difficulty_level VARCHAR(20), -- 'EASY', 'MEDIUM', 'HARD', 'MASTER'
    preparation_time_minutes INT,
    cooking_time_minutes INT,
    yield_servings INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2.6 FERMENTATION_MASTER
CREATE TABLE FERMENTATION_MASTER (
    fermentation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID REFERENCES RECIPE_MASTER(recipe_id),
    stage_name VARCHAR(50) NOT NULL, -- 'FRESH', 'EARLY', 'OPTIMAL', 'RIPENED', 'OVER_RIPENED'
    ideal_temperature_celsius NUMERIC(4,1),
    recommended_duration_days INT,
    dominant_bacteria VARCHAR(150), -- e.g., 'Leuconostoc mesenteroides', 'Lactobacillus plantarum'
    ph_level NUMERIC(3,2),
    acidity_percent NUMERIC(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2.7 HISTORY_MASTER
CREATE TABLE HISTORY_MASTER (
    history_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kimchi_id UUID REFERENCES KIMCHI_MASTER(kimchi_id),
    era_code VARCHAR(50), -- 'THREE_KINGDOMS', 'GORYEO', 'JOSEON_EARLY', 'JOSEON_LATE', 'MODERN'
    historical_year_start INT,
    historical_year_end INT,
    source_id UUID REFERENCES SOURCE_MASTER(source_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2.8 IMAGE_MASTER
CREATE TABLE IMAGE_MASTER (
    image_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_code VARCHAR(50) UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    cdn_url TEXT,
    width INT,
    height INT,
    mime_type VARCHAR(50),
    ai_prompt_used TEXT, -- Generation prompt if AI generated
    license_id UUID REFERENCES LICENSE_MASTER(license_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2.9 PAIRING_MASTER
CREATE TABLE PAIRING_MASTER (
    pairing_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kimchi_id UUID REFERENCES KIMCHI_MASTER(kimchi_id),
    paired_item_name_en VARCHAR(150) NOT NULL,
    pairing_category VARCHAR(50), -- 'FOOD', 'ALCOHOLIC_BEVERAGE', 'NON_ALCOHOLIC'
    flavor_harmony_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 3. I18N TABLES (Multilingual Extension Layer)
-- =============================================================================

CREATE TABLE TAG_MASTER_I18N (
    tag_id UUID REFERENCES TAG_MASTER(tag_id) ON DELETE CASCADE,
    language_code VARCHAR(10) REFERENCES LANGUAGE_MASTER(language_code),
    translated_tag_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (tag_id, language_code)
);

CREATE TABLE CATEGORY_MASTER_I18N (
    category_id UUID REFERENCES CATEGORY_MASTER(category_id) ON DELETE CASCADE,
    language_code VARCHAR(10) REFERENCES LANGUAGE_MASTER(language_code),
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    PRIMARY KEY (category_id, language_code)
);

CREATE TABLE KIMCHI_MASTER_I18N (
    kimchi_id UUID REFERENCES KIMCHI_MASTER(kimchi_id) ON DELETE CASCADE,
    language_code VARCHAR(10) REFERENCES LANGUAGE_MASTER(language_code),
    name VARCHAR(200) NOT NULL,
    summary TEXT,
    cultural_significance TEXT,
    PRIMARY KEY (kimchi_id, language_code)
);

CREATE TABLE INGREDIENT_MASTER_I18N (
    ingredient_id UUID REFERENCES INGREDIENT_MASTER(ingredient_id) ON DELETE CASCADE,
    language_code VARCHAR(10) REFERENCES LANGUAGE_MASTER(language_code),
    name VARCHAR(150) NOT NULL,
    description TEXT,
    substitution_tip TEXT, -- Substitutes for overseas readers
    PRIMARY KEY (ingredient_id, language_code)
);

CREATE TABLE RECIPE_STEP_I18N (
    step_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID REFERENCES RECIPE_MASTER(recipe_id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    language_code VARCHAR(10) REFERENCES LANGUAGE_MASTER(language_code),
    instruction TEXT NOT NULL,
    pro_tip TEXT,
    UNIQUE(recipe_id, step_number, language_code)
);

CREATE TABLE HISTORY_MASTER_I18N (
    history_id UUID REFERENCES HISTORY_MASTER(history_id) ON DELETE CASCADE,
    language_code VARCHAR(10) REFERENCES LANGUAGE_MASTER(language_code),
    title VARCHAR(200) NOT NULL,
    historical_summary TEXT NOT NULL,
    cultural_impact TEXT,
    PRIMARY KEY (history_id, language_code)
);

-- =============================================================================
-- 4. REFERENCE (JUNCTION) TABLES (Explicit Integrity Secured)
-- =============================================================================

CREATE TABLE KIMCHI_INGREDIENT_REF (
    kimchi_id UUID REFERENCES KIMCHI_MASTER(kimchi_id) ON DELETE CASCADE,
    ingredient_id UUID REFERENCES INGREDIENT_MASTER(ingredient_id),
    ingredient_role VARCHAR(50), -- 'ESSENTIAL', 'OPTIONAL', 'REGIONAL_VARIATION'
    standard_ratio_percent NUMERIC(5,2),
    PRIMARY KEY (kimchi_id, ingredient_id)
);

CREATE TABLE CONTENT_KIMCHI_REF (
    content_id UUID REFERENCES CONTENT_MASTER(content_id) ON DELETE CASCADE,
    kimchi_id UUID REFERENCES KIMCHI_MASTER(kimchi_id),
    PRIMARY KEY (content_id, kimchi_id)
);

CREATE TABLE CONTENT_RECIPE_REF (
    content_id UUID REFERENCES CONTENT_MASTER(content_id) ON DELETE CASCADE,
    recipe_id UUID REFERENCES RECIPE_MASTER(recipe_id),
    PRIMARY KEY (content_id, recipe_id)
);

CREATE TABLE CONTENT_HISTORY_REF (
    content_id UUID REFERENCES CONTENT_MASTER(content_id) ON DELETE CASCADE,
    history_id UUID REFERENCES HISTORY_MASTER(history_id),
    PRIMARY KEY (content_id, history_id)
);

CREATE TABLE CONTENT_IMAGE_REF (
    content_id UUID REFERENCES CONTENT_MASTER(content_id) ON DELETE CASCADE,
    image_id UUID REFERENCES IMAGE_MASTER(image_id),
    display_order INT DEFAULT 1,
    caption_override VARCHAR(300),
    PRIMARY KEY (content_id, image_id)
);

-- =============================================================================
-- 5. AI_ENGINE CONFIGURATION LAYER (Logical Configuration Data)
-- =============================================================================

CREATE TABLE AI_ENGINE_TEMPLATE (
    template_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_code VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'TMPL_BLOG_RECIPE_V1', 'TMPL_YT_SHORT_01'
    template_name VARCHAR(200) NOT NULL,
    target_channel VARCHAR(50) NOT NULL, -- 'BLOG', 'YOUTUBE_SHORT', 'YOUTUBE_LONG', 'EDUCATION', 'SNS', 'NEWSLETTER', 'EBOOK'
    system_prompt TEXT NOT NULL, -- Persona & Rule Configuration settings
    user_prompt_template TEXT NOT NULL, -- Prompt Configuration template
    required_masters TEXT[] NOT NULL, -- Rule Configuration selection rules
    output_schema JSONB NOT NULL, -- Validator Schema for LLM Structured Output
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 6. CONTENT DOMAIN & PUBLISHING LOGS
-- =============================================================================

CREATE TABLE CONTENT_MASTER (
    content_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_type VARCHAR(50) NOT NULL,
    title VARCHAR(500) NOT NULL,
    subtitle VARCHAR(500),
    summary TEXT,
    language_code VARCHAR(10) REFERENCES LANGUAGE_MASTER(language_code),
    target_country_code VARCHAR(10) REFERENCES COUNTRY_MASTER(country_code),
    author_id UUID REFERENCES AUTHOR_MASTER(author_id),
    template_id UUID REFERENCES AI_ENGINE_TEMPLATE(template_id),
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT', -- 'DRAFT', 'REVIEW', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED'
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE CONTENT_BODY (
    content_id UUID PRIMARY KEY REFERENCES CONTENT_MASTER(content_id) ON DELETE CASCADE,
    body_markdown TEXT,
    body_html TEXT,
    audio_script TEXT, -- Narration script for audio/video TTS
    seo_title VARCHAR(200),
    seo_description VARCHAR(500),
    seo_keywords TEXT[]
);

CREATE TABLE CONTENT_GENERATION_LOG (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID REFERENCES CONTENT_MASTER(content_id) ON DELETE CASCADE,
    model_name VARCHAR(100) NOT NULL, -- e.g., 'gemini-1.5-pro', 'gpt-4o', 'claude-3-5-sonnet'
    prompt_snapshot TEXT NOT NULL,
    parameters JSONB, -- temperature, top_p, seed
    token_usage JSONB, -- prompt_tokens, completion_tokens
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PUBLISHING_LOG (
    publishing_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID REFERENCES CONTENT_MASTER(content_id) ON DELETE CASCADE,
    channel_name VARCHAR(50) NOT NULL, -- 'WORDPRESS_BLOG', 'YOUTUBE', 'SUBSTACK', 'INSTAGRAM'
    external_post_id VARCHAR(200),
    external_url TEXT,
    publish_status VARCHAR(20) NOT NULL, -- 'SUCCESS', 'FAILED', 'PENDING'
    error_message TEXT,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
