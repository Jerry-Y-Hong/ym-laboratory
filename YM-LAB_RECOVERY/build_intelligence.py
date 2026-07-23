import os
import json
import datetime

OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), '200_PROJECT_INTELLIGENCE', 'intelligence')
os.makedirs(OUT_DIR, exist_ok=True)

NOW = datetime.datetime.now().isoformat()

# -------------------------------------------------------------
# TASK 01: document_index.json
# -------------------------------------------------------------
doc_index = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "meta": {
    "version": "1.0.0",
    "phase": "Phase 05",
    "generated_at": NOW,
    "total_documents": 19
  },
  "documents": [
    {
      "doc_id": "DOC_01",
      "title": "PROJECT_STATUS.md",
      "path": "PROJECT_STATUS.md",
      "purpose": "YM-LAB 프로젝트 전체 완료 이력 및 단계별 상태 통합 관리",
      "category": "Master Governance",
      "module": "Project Intelligence",
      "related_documents": ["RECOVERY_INDEX.md", "INTELLIGENCE_REPORT.md"],
      "related_technologies": ["Markdown", "Git"],
      "status": "ACTIVE",
      "importance": "CRITICAL"
    },
    {
      "doc_id": "DOC_02",
      "title": "RECOVERY_INDEX.md",
      "path": "YM-LAB_RECOVERY/RECOVERY_INDEX.md",
      "purpose": "Recovery 저장소 3,524개 파일 마스터 탐색 인덱스 및 모듈 가이드",
      "category": "Asset Index",
      "module": "Recovery",
      "related_documents": ["asset_inventory.json", "duplicate_report.md"],
      "related_technologies": ["SHA-256", "SQLite"],
      "status": "ACTIVE",
      "importance": "HIGH"
    },
    {
      "doc_id": "DOC_03",
      "title": "asset_inventory.json",
      "path": "YM-LAB_RECOVERY/asset_inventory.json",
      "purpose": "3,524개 복원 자산의 SHA-256 해시 및 Dual Classification 전수 메타데이터",
      "category": "Asset Inventory",
      "module": "Recovery",
      "related_documents": ["asset_inventory.schema.json", "project_classification.json"],
      "related_technologies": ["JSON Schema v2.0", "SHA-256"],
      "status": "ACTIVE",
      "importance": "CRITICAL"
    },
    {
      "doc_id": "DOC_04",
      "title": "asset_inventory.schema.json",
      "path": "YM-LAB_RECOVERY/schema/asset_inventory.schema.json",
      "purpose": "Asset Inventory 정식 JSON Schema Draft 2020-12 사양 정의",
      "category": "Schema Specification",
      "module": "Recovery",
      "related_documents": ["asset_inventory.json"],
      "related_technologies": ["JSON Schema Draft 2020-12"],
      "status": "ACTIVE",
      "importance": "HIGH"
    },
    {
      "doc_id": "DOC_05",
      "title": "project_classification.json",
      "path": "YM-LAB_RECOVERY/project_classification.json",
      "purpose": "유연한 프로젝트 정규식 분류 엔진 및 프로젝트 별 텍사노미 사양",
      "category": "Taxonomy Specification",
      "module": "Recovery",
      "related_documents": ["project_classification.schema.json", "unknown_asset_report.md"],
      "related_technologies": ["Regex Engine", "JSON Schema"],
      "status": "ACTIVE",
      "importance": "HIGH"
    },
    {
      "doc_id": "DOC_06",
      "title": "duplicate_report.md",
      "path": "YM-LAB_RECOVERY/duplicate_report.md",
      "purpose": "154건 중복 자산의 SHA-256 매칭 원본 추적 및 용량 분석 보고서",
      "category": "Audit Report",
      "module": "Recovery",
      "related_documents": ["asset_inventory.json"],
      "related_technologies": ["SHA-256 Exact Matching"],
      "status": "ACTIVE",
      "importance": "MEDIUM"
    },
    {
      "doc_id": "DOC_07",
      "title": "unknown_asset_report.md",
      "path": "YM-LAB_RECOVERY/unknown_asset_report.md",
      "purpose": "단일 키워드 오분류 108건 원인 규명 및 4대 그룹 재분류 제안 보고서",
      "category": "Audit Report",
      "module": "Recovery",
      "related_documents": ["project_classification.json"],
      "related_technologies": ["Path Depth Analysis"],
      "status": "ACTIVE",
      "importance": "MEDIUM"
    },
    {
      "doc_id": "DOC_08",
      "title": "recovery_improvement.md",
      "path": "YM-LAB_RECOVERY/recovery_improvement.md",
      "purpose": "단기(Phase 4), 중기(Phase 5), 장기(Phase 6+) 3단계 로드맵 수립",
      "category": "Roadmap Specification",
      "module": "Recovery",
      "related_documents": ["RECOVERY_INDEX.md"],
      "related_technologies": ["Architecture Roadmap"],
      "status": "ACTIVE",
      "importance": "HIGH"
    },
    {
      "doc_id": "DOC_09",
      "title": "MFCO_KNOWLEDGE_BASE_DISCOVERY_REPORT.md",
      "path": "MFCO_KNOWLEDGE_BASE_DISCOVERY_REPORT.md",
      "purpose": "MFCO 온톨로지 지식베이스 초기 발견 및 전수 조사 보고서",
      "category": "Domain Discovery",
      "module": "Knowledge Engine",
      "related_documents": ["M04-00_UNIFIED_KNOWLEDGE_BASE.xlsx"],
      "related_technologies": ["Ontology Discovery"],
      "status": "ARCHIVE",
      "importance": "HIGH"
    },
    {
      "doc_id": "DOC_10",
      "title": "02_STANDARD_LAYER.sql",
      "path": "100_PLATFORM/120_DATABASE/schema/02_STANDARD_LAYER.sql",
      "purpose": "YM-LAB 플랫폼 데이터베이스 표준 테이블 DDL 정의",
      "category": "Database Schema",
      "module": "Platform",
      "related_documents": ["standard_repository.py"],
      "related_technologies": ["SQL", "PostgreSQL", "SQLite"],
      "status": "ACTIVE",
      "importance": "CRITICAL"
    },
    {
      "doc_id": "DOC_11",
      "title": "standard_repository.py",
      "path": "100_PLATFORM/120_DATABASE/repository/standard_repository.py",
      "purpose": "표준 레이어 데이터 접근 파이썬 레포지토리 객체",
      "category": "Core Codebase",
      "module": "Platform",
      "related_documents": ["02_STANDARD_LAYER.sql"],
      "related_technologies": ["Python 3", "Repository Pattern"],
      "status": "ACTIVE",
      "importance": "HIGH"
    },
    {
      "doc_id": "DOC_12",
      "title": "raw_repository.py",
      "path": "100_PLATFORM/120_DATABASE/repository/raw_repository.py",
      "purpose": "NICS 농식품올바로 수집 원천 데이터 접근 레포지토리",
      "category": "Core Codebase",
      "module": "Platform",
      "related_documents": ["02_STANDARD_LAYER.sql"],
      "related_technologies": ["Python 3", "ETL Pipeline"],
      "status": "ACTIVE",
      "importance": "HIGH"
    },
    {
      "doc_id": "DOC_13",
      "title": "INGREDIENT_MASTER_SPEC.md",
      "path": "01_PHASE1_KIMCHI/03_INGREDIENT_MASTER/INGREDIENT_MASTER_SPEC.md",
      "purpose": "Phase 1 김치 원재료 마스터 항목 및 화학 성분 규격서",
      "category": "Domain Specification",
      "module": "Kimchi",
      "related_documents": ["RECIPE_MASTER_SPEC.md"],
      "related_technologies": ["Nutrient Mapping"],
      "status": "ACTIVE",
      "importance": "HIGH"
    },
    {
      "doc_id": "DOC_14",
      "title": "RECIPE_MASTER_SPEC.md",
      "path": "01_PHASE1_KIMCHI/04_RECIPE_MASTER/RECIPE_MASTER_SPEC.md",
      "purpose": "Phase 1 김치 레시피 조합 및 가공 표준 규격서",
      "category": "Domain Specification",
      "module": "Kimchi",
      "related_documents": ["INGREDIENT_MASTER_SPEC.md"],
      "related_technologies": ["Recipe Engine"],
      "status": "ACTIVE",
      "importance": "HIGH"
    },
    {
      "doc_id": "DOC_15",
      "title": "AUTOMATED_MARKET_FEASIBILITY_ENGINE_SPEC.md",
      "path": "00_MFCO_KNOWLEDGE_BASE/07_ONEDRIVE_RECOVERY_FULL/06_DOCUMENT/AUTOMATED_MARKET_FEASIBILITY_ENGINE_SPEC.md",
      "purpose": "자동화 시장 타당성 분석 엔진 설계 블루프린트",
      "category": "Engine Specification",
      "module": "Commercial",
      "related_documents": ["MFCO_Q_CODE_TRACE_SYSTEM_BLUEPRINT.md"],
      "related_technologies": ["Market Feasibility AI"],
      "status": "DRAFT",
      "importance": "MEDIUM"
    },
    {
      "doc_id": "DOC_16",
      "title": "App.jsx",
      "path": "00_MFCO_KNOWLEDGE_BASE/07_ONEDRIVE_RECOVERY_FULL/mfco-website/src/App.jsx",
      "purpose": "MFCO 웹 애플리케이션 메인 React 컴포넌트 및 라우팅",
      "category": "Frontend Application",
      "module": "Website",
      "related_documents": ["mfcoData.json", "mfcoInference.js"],
      "related_technologies": ["React", "Vite", "JavaScript"],
      "status": "ACTIVE",
      "importance": "HIGH"
    },
    {
      "doc_id": "DOC_17",
      "title": "mfcoData.json",
      "path": "00_MFCO_KNOWLEDGE_BASE/07_ONEDRIVE_RECOVERY_FULL/mfco-website/src/data/mfcoData.json",
      "purpose": "웹 서비스용 MFCO 온톨로지 데이터 정적 직렬화 파일",
      "category": "Data Asset",
      "module": "Website",
      "related_documents": ["mfcoInference.js"],
      "related_technologies": ["JSON", "Ontology Data Dump"],
      "status": "ACTIVE",
      "importance": "CRITICAL"
    },
    {
      "doc_id": "DOC_18",
      "title": "mfcoInference.js",
      "path": "00_MFCO_KNOWLEDGE_BASE/07_ONEDRIVE_RECOVERY_FULL/mfco-website/src/utils/mfcoInference.js",
      "purpose": "온톨로지 기반 약선 효능 및 식재료 궁합 추론 유틸리티 모듈",
      "category": "Inference Module",
      "module": "Website",
      "related_documents": ["mfcoData.json", "App.jsx"],
      "related_technologies": ["JavaScript", "Inference Algorithm"],
      "status": "ACTIVE",
      "importance": "HIGH"
    },
    {
      "doc_id": "DOC_19",
      "title": "sanYacho MANIFEST.json",
      "path": "sanYacho/MANIFEST.json",
      "purpose": "산야초 웹 프로젝트 독립 매니페스트 설정 파일",
      "category": "Application Manifest",
      "module": "Commercial",
      "related_documents": ["MANIFEST.json"],
      "related_technologies": ["Next.js", "Vercel"],
      "status": "ACTIVE",
      "importance": "MEDIUM"
    }
  ]
}
with open(os.path.join(OUT_DIR, 'document_index.json'), 'w', encoding='utf-8') as f:
    json.dump(doc_index, f, ensure_ascii=False, indent=2)

print('[OK] Task 01: document_index.json')

# -------------------------------------------------------------
# TASK 02: terminology.json
# -------------------------------------------------------------
terms_data = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "meta": {
    "version": "1.0.0",
    "phase": "Phase 05",
    "generated_at": NOW,
    "total_terms": 15
  },
  "terminology": [
    {
      "term": "MFCO",
      "definition": "Master Functional Core Ontology. 식약처 기능성 원료, 동의보감 한의학 식재료, 영양성분을 Q-Code 기반으로 정규화한 마스터 온톨로지.",
      "aliases": ["Master Core Ontology", "MFCO KB", "기능성 온톨로지"],
      "related_documents": ["document_index.json", "MFCO_KNOWLEDGE_BASE_DISCOVERY_REPORT.md"],
      "related_technologies": ["Ontology", "Q-Code", "Excel DB"],
      "related_concepts": ["Ontology", "Q-Code", "Inference Engine"]
    },
    {
      "term": "YM-LAB",
      "definition": "식품, 바이오, 한의학, IT 기술을 결합하여 영양 및 약선 융합 지식을 생성하는 최상위 연구 개발 생태계.",
      "aliases": ["YM-LAB PROJECT", "YM Laboratory", "YM Lab"],
      "related_documents": ["PROJECT_STATUS.md", "RECOVERY_INDEX.md"],
      "related_technologies": ["RAG", "Graph DB", "Agentic AI"],
      "related_concepts": ["Project Intelligence", "AI Context"]
    },
    {
      "term": "Recovery",
      "definition": "YM-LAB 산하 전 프로젝트 자산(3,524개)을 SHA-256 해시로 보존하고 catalog.db로 무결성을 유지하는 자산 관리 저장소.",
      "aliases": ["YM-LAB_RECOVERY", "Recovery Storage", "Baseline Archive"],
      "related_documents": ["RECOVERY_INDEX.md", "asset_inventory.json"],
      "related_technologies": ["SHA-256", "SQLite3", "Python"],
      "related_concepts": ["Baseline Preservation", "Canonical Asset"]
    },
    {
      "term": "Ontology",
      "definition": "식재료, 기능 성분, 질환 효능, 레시피 간 복합적 관계를 컴퓨터가 이해할 수 있는 그래프 및 인덱스로 표현하는 형식 지식 체계.",
      "aliases": ["지식 온톨로지", "도메인 온톨로지", "Knowledge Graph"],
      "related_documents": ["document_index.json", "concept_map.json"],
      "related_technologies": ["RDF", "OWL", "Graph DB", "Q-Code"],
      "related_concepts": ["Inference", "Term Dictionary"]
    },
    {
      "term": "Knowledge Engine",
      "definition": "구조화된 MFCO 온톨로지와 비구조화 문서를 결합하여 고차원 시맨틱 질의와 레시피 추천을 수행하는 지식 추론 엔진 (Phase 06).",
      "aliases": ["지식 엔진", "지식 추론 파이프라인"],
      "related_documents": ["INTELLIGENCE_REPORT.md"],
      "related_technologies": ["RAG", "Vector DB", "LLM Reasoning"],
      "related_concepts": ["Inference Engine", "Recipe Engine"]
    },
    {
      "term": "Story Engine",
      "definition": "개인화된 건강 상태 및 약선 레시피에 맞춰 맞춤형 스토리텔링 컨텐츠를 생성하는 스토리 생성 파이프라인.",
      "aliases": ["스토리텔링 엔진", "맞춤형 콘텐츠 엔진"],
      "related_documents": ["K_MEDI_EXPERIENTIAL_SIGNATURE_IDEAS.md"],
      "related_technologies": ["LLM Generation", "Prompt Engineering"],
      "related_concepts": ["Commercial Platform", "Recipe Engine"]
    },
    {
      "term": "Automation",
      "definition": "자산 발견, 무결성 검증, 스키마 변환 및 빌드 파이프라인을 인간의 개입 없이 자율 실행하는 자동화 인프라.",
      "aliases": ["AI Automation", "CI/CD Automation", "Autonomous Pipeline"],
      "related_documents": ["recovery_improvement.md", "task_graph.json"],
      "related_technologies": ["GitHub Actions", "Python Scripts", "Daemon Task"],
      "related_concepts": ["Task Graph", "Autonomous Agent"]
    },
    {
      "term": "AI Context",
      "definition": "AI 코딩 에이전트가 새로운 작업 세션에 진입할 때 프로젝트 구조, 용어, 개발 규칙을 즉각 파악하도록 돕는 인-메모리 시맨틱 페이로드.",
      "aliases": ["Context Payload", "Agent Briefing", "Agent Memory"],
      "related_documents": ["AI_CONTEXT.md", "ai_context.json"],
      "related_technologies": ["Markdown Prompt", "JSON Payload"],
      "related_concepts": ["Agent Pairing", "Project Intelligence"]
    },
    {
      "term": "PIS",
      "definition": "Plant Intelligence System. 산야초 및 약용 식물의 생육, 효능, 유효 성분 데이터를 시맨틱하게 수집 분석하는 식물 지식 시스템.",
      "aliases": ["식물 지식 시스템", "Plant Intelligence"],
      "related_documents": ["sanYacho MANIFEST.json"],
      "related_technologies": ["IoT Sensors", "Phytochemical Analysis"],
      "related_concepts": ["Smart Farm", "Wasabi"]
    },
    {
      "term": "Smart Farm",
      "definition": "고기능성 산야초 및 고부가가치 식물을 정밀 제어 환경에서 재배하는 ICT 스마트 융합 재배 시설.",
      "aliases": ["스마트팜", "정밀 재배 인프라"],
      "related_documents": ["document_index.json"],
      "related_technologies": ["IoT", "Environmental Control"],
      "related_concepts": ["PIS", "Wasabi"]
    },
    {
      "term": "Wasabi",
      "definition": "Wasabia japonica. YM-LAB의 주요 고부가가치 기능성 식물 연구 대상 및 원재료 마스터 도메인.",
      "aliases": ["고추냉이", "와사비 원재료"],
      "related_documents": ["INGREDIENT_MASTER_SPEC.md"],
      "related_technologies": ["Phytochemical Index", "Isothiocyanate Analysis"],
      "related_concepts": ["Smart Farm", "MFCO"]
    },
    {
      "term": "Vector DB",
      "definition": "문서, 온톨로지 코드, 도메인 지식을 고차원 임베딩 벡터로 전환하여 고속 유사도 검색을 지원하는 데이터베이스.",
      "aliases": ["벡터 데이터베이스", "Semantic Vector Index"],
      "related_documents": ["recovery_improvement.md", "INTELLIGENCE_REPORT.md"],
      "related_technologies": ["ChromaDB", "Pinecone", "OpenAI Embeddings"],
      "related_concepts": ["RAG", "Knowledge Engine"]
    },
    {
      "term": "Q-Code",
      "definition": "MFCO 온톨로지 내 원재료(Q-ING), 기능그룹(Q-FNC), 레시피(Q-RCP)에 부여되는 고유 식별 시맨틱 인덱스 코드.",
      "aliases": ["QCode", "Ontology Unique ID"],
      "related_documents": ["MFCO_Q_CODE_TRACE_SYSTEM_BLUEPRINT.md"],
      "related_technologies": ["Semantic Identifier"],
      "related_concepts": ["MFCO", "Ontology"]
    },
    {
      "term": "sanYacho",
      "definition": "산야초. 한의학 식재료 탐색 및 약선 레시피 서비스를 제공하는 Vercel 기반 프로덕션 웹 애플리케이션.",
      "aliases": ["산야초 웹", "sanYacho App"],
      "related_documents": ["sanYacho MANIFEST.json"],
      "related_technologies": ["Next.js", "Vercel", "TailwindCSS"],
      "related_concepts": ["Commercial Platform", "PIS"]
    },
    {
      "term": "NICS",
      "definition": "농식품올바로. 농촌진흥청 국가 표준 식품 성분표 및 식약처 식품 안전 공공 데이터베이스.",
      "aliases": ["농식품올바로", "NICS Data"],
      "related_documents": ["raw_repository.py"],
      "related_technologies": ["REST API", "Open Data"],
      "related_concepts": ["NICS_DATA", "Platform"]
    }
  ]
}
with open(os.path.join(OUT_DIR, 'terminology.json'), 'w', encoding='utf-8') as f:
    json.dump(terms_data, f, ensure_ascii=False, indent=2)

print('[OK] Task 02: terminology.json')

# -------------------------------------------------------------
# TASK 03: concept_map.json
# -------------------------------------------------------------
concept_map = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "meta": {
    "version": "1.0.0",
    "phase": "Phase 05",
    "generated_at": NOW,
    "primary_concept_flow": "MFCO -> Ontology -> Knowledge Base -> Inference -> Recipe Engine -> Commercial Platform"
  },
  "concept_flows": [
    {
      "flow_id": "FLOW_CORE_ONTOLOGY",
      "name": "Primary Domain Knowledge Progression",
      "steps": [
        { "order": 1, "concept": "MFCO", "role": "Raw Ontology Standardization & Q-Code Indexing" },
        { "order": 2, "concept": "Ontology", "role": "Semantic Knowledge Model & Term Dictionary Setup" },
        { "order": 3, "concept": "Knowledge Base", "role": "Unified Excel & Relational DB Persistence" },
        { "order": 4, "concept": "Inference", "role": "Multi-lingual Ingredient Compatibility Logic" },
        { "order": 5, "concept": "Recipe Engine", "role": "YakSeon Functional Synergy Recipe Generator" },
        { "order": 6, "concept": "Commercial Platform", "role": "B2C/B2B Web Application Deployment" }
      ]
    },
    {
      "flow_id": "FLOW_DATA_PIPELINE",
      "name": "Data Ingestion to Application Layer",
      "steps": [
        { "order": 1, "concept": "NICS Open Data", "role": "External Data Acquisition" },
        { "order": 2, "concept": "Platform Raw Layer", "role": "Raw Repository Persistence" },
        { "order": 3, "concept": "Standard Layer DDL", "role": "Relational Schema Mapping" },
        { "order": 4, "concept": "MFCO Normalization", "role": "Q-Code & Synergy Tagging" },
        { "order": 5, "concept": "Static JSON Dump", "role": "Web Data Serialization (mfcoData.json)" },
        { "order": 6, "concept": "React Application", "role": "User Interactive UX (mfco-website)" }
      ]
    }
  ]
}
with open(os.path.join(OUT_DIR, 'concept_map.json'), 'w', encoding='utf-8') as f:
    json.dump(concept_map, f, ensure_ascii=False, indent=2)

print('[OK] Task 03: concept_map.json')

# -------------------------------------------------------------
# TASK 04: project_graph.json & dependency_graph.json
# -------------------------------------------------------------
project_graph = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "meta": {
    "version": "1.0.0",
    "phase": "Phase 05",
    "generated_at": NOW,
    "node_count": 8,
    "edge_count": 17
  },
  "graph": {
    "nodes": [
      { "id": "YM-LAB", "label": "YM-LAB Ecosystem", "type": "ROOT_ECOSYSTEM" },
      { "id": "MFCO", "label": "Master Functional Core Ontology", "type": "CORE_ONTOLOGY" },
      { "id": "sanYacho", "label": "sanYacho Wild Plant Web App", "type": "STANDALONE_APP" },
      { "id": "NICS_DATA", "label": "농식품올바로 (NICS) Data", "type": "OPEN_DATASET" },
      { "id": "Platform", "label": "YM-LAB Platform Infrastructure", "type": "INFRASTRUCTURE" },
      { "id": "Recovery", "label": "YM-LAB Asset Recovery Storage", "type": "RECOVERY_CATALOG" },
      { "id": "Kimchi", "label": "Kimchi Master Phase 1", "type": "DOMAIN_DATASET" },
      { "id": "Website", "label": "MFCO Web Application (React/Vite)", "type": "FRONTEND_APP" }
    ],
    "edges": [
      { "source": "YM-LAB", "target": "MFCO", "relation": "CONTAINS" },
      { "source": "YM-LAB", "target": "sanYacho", "relation": "CONTAINS" },
      { "source": "YM-LAB", "target": "NICS_DATA", "relation": "CONTAINS" },
      { "source": "YM-LAB", "target": "Platform", "relation": "CONTAINS" },
      { "source": "YM-LAB", "target": "Recovery", "relation": "CONTAINS" },
      { "source": "YM-LAB", "target": "Kimchi", "relation": "CONTAINS" },
      { "source": "YM-LAB", "target": "Website", "relation": "CONTAINS" },
      { "source": "NICS_DATA", "target": "Platform", "relation": "FEEDS_RAW_DATA" },
      { "source": "Platform", "target": "MFCO", "relation": "PROVIDES_STANDARD_SCHEMA" },
      { "source": "MFCO", "target": "Website", "relation": "PROVIDES_ONTOLOGY_DATA" },
      { "source": "MFCO", "target": "Kimchi", "relation": "INCLUDES_SUBDOMAIN" },
      { "source": "Recovery", "target": "MFCO", "relation": "INDEXES_AND_PRESERVES" },
      { "source": "Recovery", "target": "sanYacho", "relation": "INDEXES_AND_PRESERVES" },
      { "source": "Recovery", "target": "NICS_DATA", "relation": "INDEXES_AND_PRESERVES" },
      { "source": "Recovery", "target": "Platform", "relation": "INDEXES_AND_PRESERVES" },
      { "source": "Recovery", "target": "Kimchi", "relation": "INDEXES_AND_PRESERVES" },
      { "source": "Recovery", "target": "Website", "relation": "INDEXES_AND_PRESERVES" }
    ]
  }
}
with open(os.path.join(OUT_DIR, 'project_graph.json'), 'w', encoding='utf-8') as f:
    json.dump(project_graph, f, ensure_ascii=False, indent=2)

dependency_graph = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "meta": {
    "version": "1.0.0",
    "phase": "Phase 05",
    "generated_at": NOW,
    "total_dependencies": 9
  },
  "dependencies": [
    { "id": "DEP_01", "type": "DATA_FLOW", "source": "NICS_DATA", "target": "Platform", "asset": "raw_repository.py" },
    { "id": "DEP_02", "type": "SCHEMA", "source": "Platform", "target": "MFCO", "asset": "02_STANDARD_LAYER.sql" },
    { "id": "DEP_03", "type": "CODE_MODULE", "source": "Platform", "target": "MFCO", "asset": "standard_repository.py" },
    { "id": "DEP_04", "type": "DATA_SPEC", "source": "Kimchi", "target": "MFCO", "asset": "INGREDIENT_MASTER_SPEC.md" },
    { "id": "DEP_05", "type": "DATA_SPEC", "source": "Kimchi", "target": "MFCO", "asset": "RECIPE_MASTER_SPEC.md" },
    { "id": "DEP_06", "type": "DATA_FEED", "source": "MFCO", "target": "Website", "asset": "mfcoData.json" },
    { "id": "DEP_07", "type": "CODE_MODULE", "source": "MFCO", "target": "Website", "asset": "mfcoInference.js" },
    { "id": "DEP_08", "type": "CATALOG", "source": "Recovery", "target": "ALL", "asset": "catalog.db" },
    { "id": "DEP_09", "type": "TAXONOMY", "source": "Recovery", "target": "ALL", "asset": "project_classification.json" }
  ]
}
with open(os.path.join(OUT_DIR, 'dependency_graph.json'), 'w', encoding='utf-8') as f:
    json.dump(dependency_graph, f, ensure_ascii=False, indent=2)

print('[OK] Task 04: project_graph.json & dependency_graph.json')

# -------------------------------------------------------------
# TASK 05: module_relationship.json
# -------------------------------------------------------------
module_rel = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "meta": {
    "version": "1.0.0",
    "phase": "Phase 05",
    "generated_at": NOW,
    "modules_count": 6
  },
  "modules": [
    { "name": "Recovery", "layer": "Infrastructure & Governance", "status": "COMPLETE" },
    { "name": "Project Intelligence", "layer": "Semantic Graph Layer", "status": "ACTIVE" },
    { "name": "Knowledge Engine", "layer": "Reasoning & Vector Layer", "status": "PLANNED_PHASE_06" },
    { "name": "Automation", "layer": "Pipeline Orchestration", "status": "PLANNED_PHASE_07" },
    { "name": "Agent", "layer": "Autonomous Agentic Ops", "status": "PLANNED_PHASE_08" },
    { "name": "Commercial", "layer": "B2C/B2B Platform Application", "status": "PRODUCTION" }
  ],
  "relationships": [
    { "upstream": "Recovery", "downstream": "Project Intelligence", "type": "PROVIDES_ASSET_INVENTORY" },
    { "upstream": "Project Intelligence", "downstream": "Knowledge Engine", "type": "PROVIDES_SEMANTIC_MODEL" },
    { "upstream": "Knowledge Engine", "downstream": "Automation", "type": "PROVIDES_REASONING_PIPELINE" },
    { "upstream": "Automation", "downstream": "Agent", "type": "PROVIDES_EXECUTABLE_TASKS" },
    { "upstream": "Agent", "downstream": "Commercial", "type": "PROVIDES_AUTONOMOUS_OPERATIONS" }
  ]
}
with open(os.path.join(OUT_DIR, 'module_relationship.json'), 'w', encoding='utf-8') as f:
    json.dump(module_rel, f, ensure_ascii=False, indent=2)

print('[OK] Task 05: module_relationship.json')

# -------------------------------------------------------------
# TASK 06: technology_stack.json
# -------------------------------------------------------------
tech_stack = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "meta": {
    "version": "1.0.0",
    "phase": "Phase 05",
    "generated_at": NOW
  },
  "technology_stack": {
    "languages": [
      { "name": "Python", "version": "3.11+", "usage": "ETL, Data Analytics, SQLite Integrity, Scripting" },
      { "name": "JavaScript", "version": "ES6+", "usage": "Frontend Application Logic, Inference Engine" },
      { "name": "TypeScript", "version": "5.0+", "usage": "Web App Type Definitions & React Components" },
      { "name": "SQL", "version": "ANSI SQL", "usage": "Database Schema DDL (02_STANDARD_LAYER.sql)" },
      { "name": "HTML5 / CSS3", "version": "W3C Standard", "usage": "Web Application Layout & Glassmorphism Styling" },
      { "name": "JSON / JSONX", "version": "Draft 2020-12", "usage": "Metadata, Catalogs, Graph Schemas" },
      { "name": "Markdown", "version": "GFM", "usage": "Documentation, Indexing, AI Context Payloads" }
    ],
    "frameworks": [
      { "name": "React", "version": "18.x", "usage": "MFCO Web Application Component Framework" },
      { "name": "Vite", "version": "5.x", "usage": "Frontend Build Tool & Dev Server" },
      { "name": "Next.js", "version": "14.x", "usage": "sanYacho Web Service Framework" }
    ],
    "libraries": [
      { "name": "sqlite3", "type": "Python Standard", "usage": "catalog.db Persistence & Query Engine" },
      { "name": "hashlib", "type": "Python Standard", "usage": "SHA-256 File Hash Computation" },
      { "name": "json / uuid / os / shutil", "type": "Python Standard", "usage": "Metadata & File Processing" }
    ],
    "databases": [
      { "name": "SQLite3", "type": "Relational File Database", "usage": "YM-LAB_RECOVERY/catalog.db" },
      { "name": "PostgreSQL", "type": "Relational Enterprise DB", "usage": "02_STANDARD_LAYER.sql DDL Target" },
      { "name": "JSON Store", "type": "Document Catalog", "usage": "asset_inventory.json, project_classification.json" }
    ],
    "ai_technologies": [
      { "name": "Gemini 3.6 Flash", "type": "LLM Model", "usage": "Codebase Analysis & Intelligence Generation" },
      { "name": "RAG (Retrieval-Augmented Generation)", "type": "Architecture", "usage": "Phase 06 Knowledge Search" },
      { "name": "Graph Property Network", "type": "Data Structure", "usage": "PROJECT_GRAPH, DEPENDENCY_GRAPH" },
      { "name": "Semantic Prompting", "type": "AI Interface", "usage": "AI_CONTEXT.md Session Payloads" }
    ],
    "dev_tools": [
      { "name": "Git", "type": "Version Control", "usage": "Repository History Management" },
      { "name": "PowerShell", "type": "Terminal Shell", "usage": "Script Execution & Environment Commands" },
      { "name": "npm / uv", "type": "Package Managers", "usage": "Node Dependencies & Python Virtual Envs" }
    ],
    "infrastructure": [
      { "name": "Vercel", "type": "Cloud Hosting", "usage": "sanYacho Web Production Deployment" },
      { "name": "Google Drive / GCS", "type": "Storage Infrastructure", "usage": "YM-LAB_PROJECT_ Local Workspace Storage" }
    ]
  }
}
with open(os.path.join(OUT_DIR, 'technology_stack.json'), 'w', encoding='utf-8') as f:
    json.dump(tech_stack, f, ensure_ascii=False, indent=2)

print('[OK] Task 06: technology_stack.json')

# -------------------------------------------------------------
# TASK 07: task_graph.json
# -------------------------------------------------------------
task_graph = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "meta": {
    "version": "1.0.0",
    "phase": "Phase 05",
    "generated_at": NOW,
    "workflow_name": "YM-LAB End-to-End Execution Task Graph"
  },
  "tasks": [
    { "task_id": "T01_RECOVERY", "name": "Recovery Baseline Integration", "phase": "Phase 03", "status": "COMPLETED" },
    { "task_id": "T02_INVENTORY", "name": "Asset Inventory Construction", "phase": "Phase 04-01", "status": "COMPLETED" },
    { "task_id": "T03_CLASSIFICATION", "name": "Taxonomy & Schema Definition", "phase": "Phase 04-03", "status": "COMPLETED" },
    { "task_id": "T04_INTELLIGENCE", "name": "Project Intelligence Layer", "phase": "Phase 05", "status": "ACTIVE" },
    { "task_id": "T05_KNOWLEDGE_ENGINE", "name": "Knowledge Engine & RAG Index", "phase": "Phase 06", "status": "PLANNED" },
    { "task_id": "T06_AUTOMATION", "name": "Pipeline & CI/CD Automation", "phase": "Phase 07", "status": "PLANNED" },
    { "task_id": "T07_AI_AGENT", "name": "Autonomous Agentic Operations", "phase": "Phase 08", "status": "PLANNED" }
  ],
  "edges": [
    { "from": "T01_RECOVERY", "to": "T02_INVENTORY" },
    { "from": "T02_INVENTORY", "to": "T03_CLASSIFICATION" },
    { "from": "T03_CLASSIFICATION", "to": "T04_INTELLIGENCE" },
    { "from": "T04_INTELLIGENCE", "to": "T05_KNOWLEDGE_ENGINE" },
    { "from": "T05_KNOWLEDGE_ENGINE", "to": "T06_AUTOMATION" },
    { "from": "T06_AUTOMATION", "to": "T07_AI_AGENT" }
  ]
}
with open(os.path.join(OUT_DIR, 'task_graph.json'), 'w', encoding='utf-8') as f:
    json.dump(task_graph, f, ensure_ascii=False, indent=2)

print('[OK] Task 07: task_graph.json')

# -------------------------------------------------------------
# TASK 08: knowledge_map.json
# -------------------------------------------------------------
knowledge_map = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "meta": {
    "version": "1.0.0",
    "phase": "Phase 05",
    "generated_at": NOW,
    "unified_pipeline": "Documents -> Concepts -> Modules -> Technologies -> Tasks -> Outputs"
  },
  "nodes_summary": {
    "documents": 19,
    "concepts": 15,
    "modules": 6,
    "technologies": 18,
    "tasks": 7,
    "outputs": 13
  },
  "chains": [
    {
      "chain_id": "CHAIN_01_MFCO",
      "document": "MFCO_KNOWLEDGE_BASE_DISCOVERY_REPORT.md",
      "concept": "MFCO / Q-Code Ontology",
      "module": "Knowledge Engine",
      "technology": "Python, SQLite3, JSON",
      "task": "T04_INTELLIGENCE",
      "output": "M04-00_UNIFIED_KNOWLEDGE_BASE.xlsx"
    },
    {
      "chain_id": "CHAIN_02_RECOVERY",
      "document": "RECOVERY_INDEX.md",
      "concept": "Recovery Baseline Preservation",
      "module": "Recovery",
      "technology": "SHA-256, SQLite3",
      "task": "T01_RECOVERY",
      "output": "catalog.db & asset_inventory.json"
    },
    {
      "chain_id": "CHAIN_03_WEBSITE",
      "document": "App.jsx",
      "concept": "Commercial Frontend UX",
      "module": "Website",
      "technology": "React, Vite, JavaScript",
      "task": "T07_AI_AGENT",
      "output": "mfco-website Build Artifacts"
    }
  ]
}
with open(os.path.join(OUT_DIR, 'knowledge_map.json'), 'w', encoding='utf-8') as f:
    json.dump(knowledge_map, f, ensure_ascii=False, indent=2)

print('[OK] Task 08: knowledge_map.json')

# -------------------------------------------------------------
# TASK 09: ai_context.json
# -------------------------------------------------------------
ai_context = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "meta": {
    "version": "1.0.0",
    "phase": "Phase 05",
    "generated_at": NOW
  },
  "ai_context": {
    "project_name": "YM-LAB PROJECT",
    "current_phase": "Phase 05 : Project Intelligence Layer",
    "completed_phases": ["Phase 00 Discovery", "Phase 01 Kimchi Master", "Phase 02 Unified KB", "Phase 03 Recovery Baseline", "Phase 04 Asset Management"],
    "next_phase": "Phase 06 : Knowledge Engine",
    "important_files": [
      "PROJECT_STATUS.md",
      "YM-LAB_RECOVERY/RECOVERY_INDEX.md",
      "YM-LAB_RECOVERY/asset_inventory.json",
      "YM-LAB_RECOVERY/project_classification.json",
      "200_PROJECT_INTELLIGENCE/intelligence/project_graph.json",
      "200_PROJECT_INTELLIGENCE/intelligence/dependency_graph.json",
      "200_PROJECT_INTELLIGENCE/intelligence/intelligence_report.md"
    ],
    "critical_rules": [
      "Recovery Baseline outputs are READ ONLY. Never modify catalog.db or baseline files.",
      "Generate UTF-8 formatted JSON with 2-space pretty formatting.",
      "Use clickable file links with file:/// scheme in Markdown.",
      "Maintain 100% SHA-256 data integrity across 3,524 files."
    ],
    "project_structure": {
      "root": "g:/내 드라이브/YM-LAB_PROJECT_",
      "sub_projects": ["00_MFCO_KNOWLEDGE_BASE", "01_PHASE1_KIMCHI", "100_PLATFORM", "sanYacho", "YM-LAB_RECOVERY", "200_PROJECT_INTELLIGENCE"]
    },
    "core_concepts": ["MFCO", "Q-Code", "Recovery Baseline", "Canonical Asset", "Project Intelligence Layer"],
    "module_summary": {
      "Recovery": "3,524 files verified baseline catalog",
      "Intelligence": "Project Graphs, Dependencies, Metadata & Knowledge Maps",
      "Knowledge_Engine": "Phase 06 RAG Vector Search & LLM Inference"
    },
    "technology_summary": "Python 3, JavaScript (React/Vite), SQLite3, PostgreSQL DDL, SHA-256, JSON Schema v2.0, Markdown",
    "knowledge_summary": "19 Key Documents, 15 Core Terms, 6 System Modules, 8 Project Nodes & 17 Graph Edges"
  }
}
with open(os.path.join(OUT_DIR, 'ai_context.json'), 'w', encoding='utf-8') as f:
    json.dump(ai_context, f, ensure_ascii=False, indent=2)

print('[OK] Task 09: ai_context.json')

# -------------------------------------------------------------
# TASK 10: project_timeline.json
# -------------------------------------------------------------
timeline = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "meta": {
    "version": "1.0.0",
    "phase": "Phase 05",
    "generated_at": NOW
  },
  "timeline": [
    { "phase": "Phase 00", "name": "Knowledge Base Discovery", "status": "COMPLETED", "target": "Initial Workspace & MFCO Asset Audit" },
    { "phase": "Phase 01", "name": "Kimchi Master Dataset", "status": "COMPLETED", "target": "Fermented Food Ingredient & Recipe Specs" },
    { "phase": "Phase 02", "name": "Master Knowledge Base Consolidation", "status": "COMPLETED", "target": "Unified Excel & Dictionary Setup" },
    { "phase": "Phase 03", "name": "Recovery Baseline Integration", "status": "COMPLETED", "target": "SHA-256 catalog.db & MANIFEST Generation" },
    { "phase": "Phase 04", "name": "Recovery Asset Management Upgrade", "status": "COMPLETED", "target": "Dual Taxonomy & JSON Schema v2.0" },
    { "phase": "Phase 05", "name": "Project Intelligence Layer", "status": "ACTIVE_COMPLETED", "target": "Project Graphs, Dependencies & Knowledge Maps" },
    { "phase": "Phase 06", "name": "Knowledge Engine Construction", "status": "PLANNED", "target": "Vector Search, Graph DB & RAG Inference" },
    { "phase": "Phase 07", "name": "Pipeline Automation", "status": "PLANNED", "target": "CI/CD Automation & Watchdog Tasks" },
    { "phase": "Phase 08", "name": "Commercial Platform Agent Ops", "status": "PLANNED", "target": "Autonomous Agentic Operations" }
  ]
}
with open(os.path.join(OUT_DIR, 'project_timeline.json'), 'w', encoding='utf-8') as f:
    json.dump(timeline, f, ensure_ascii=False, indent=2)

print('[OK] Task 10: project_timeline.json')

# -------------------------------------------------------------
# TASK 11: intelligence_schema.json
# -------------------------------------------------------------
intel_schema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "g:/내 드라이브/YM-LAB_PROJECT_/200_PROJECT_INTELLIGENCE/intelligence/intelligence_schema.json",
  "title": "YMLabIntelligenceLayerMasterSchema",
  "description": "Master JSON Schema for YM-LAB Project Intelligence Layer Entities, Graphs, Nodes, Edges, and Metadata (v1.0.0).",
  "type": "object",
  "version": "1.0.0",
  "required": [
    "$schema",
    "meta",
    "entity_types",
    "graph_model"
  ],
  "properties": {
    "$schema": { "type": "string", "format": "uri" },
    "meta": {
      "type": "object",
      "required": ["version", "phase", "generated_at"],
      "properties": {
        "version": { "type": "string", "pattern": "^[0-9]+\\.[0-9]+\\.[0-9]+$" },
        "phase": { "type": "string" },
        "generated_at": { "type": "string", "format": "date-time" }
      }
    },
    "entity_types": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "description"],
        "properties": {
          "name": { "type": "string" },
          "description": { "type": "string" }
        }
      }
    },
    "graph_model": {
      "type": "object",
      "required": ["node_types", "edge_relations"],
      "properties": {
        "node_types": { "type": "array", "items": { "type": "string" } },
        "edge_relations": { "type": "array", "items": { "type": "string" } }
      }
    }
  },
  "entity_types": [
    { "name": "DocumentIndex", "description": "Extracted document metadata and cross-references" },
    { "name": "TerminologyEntry", "description": "Domain term definitions, aliases and concepts" },
    { "name": "ConceptFlow", "description": "Semantic progression step in knowledge domain" },
    { "name": "ProjectNode", "description": "Sub-project entity in ecosystem graph" },
    { "name": "DependencyRelation", "description": "Directed data or code dependency" },
    { "name": "TechnologyItem", "description": "Language, framework or tool entry" },
    { "name": "WorkflowTask", "description": "Phase execution task node" }
  ],
  "graph_model": {
    "node_types": ["ROOT_ECOSYSTEM", "CORE_ONTOLOGY", "STANDALONE_APP", "OPEN_DATASET", "INFRASTRUCTURE", "RECOVERY_CATALOG", "DOMAIN_DATASET", "FRONTEND_APP"],
    "edge_relations": ["CONTAINS", "FEEDS_RAW_DATA", "PROVIDES_STANDARD_SCHEMA", "PROVIDES_ONTOLOGY_DATA", "INCLUDES_SUBDOMAIN", "INDEXES_AND_PRESERVES", "DEPENDS_ON", "UPSTREAM", "DOWNSTREAM"]
  }
}
with open(os.path.join(OUT_DIR, 'intelligence_schema.json'), 'w', encoding='utf-8') as f:
    json.dump(intel_schema, f, ensure_ascii=False, indent=2)

print('[OK] Task 11: intelligence_schema.json')

# -------------------------------------------------------------
# TASK 12: intelligence_report.md
# -------------------------------------------------------------
intel_report = """# YM-LAB PROJECT Intelligence Layer Master Report

> **Execution Layer**: Phase 05 Project Intelligence Layer (12 Tasks Completed)  
> **Output Location**: [200_PROJECT_INTELLIGENCE/intelligence/](file:///g:/내%20드라이브/YM-LAB_PROJECT_/200_PROJECT_INTELLIGENCE/intelligence/)  
> **Primary Inputs**: `PROJECT_STATUS.md`, `RECOVERY_INDEX.md`, `asset_inventory.json`, `project_classification.json`  

---

## 1. Executive Summary

YM-LAB PROJECT는 Phase 04-03 자산 관리 고도화 산출물을 기반으로, 전체 생태계를 AI가 세맨틱하게 이해하고 추론할 수 있는 **Project Intelligence Layer(프로젝트 인텔리전스 레이어)** 구축을 완료하였습니다.

본 단계는 단순 파일 관리를 넘어서, YM-LAB의 프로젝트 간 토폴로지, 의존성 매트릭스, 도메인 용어 사전, 세맨틱 개념 흐름, 기술 스택 및 작업 파이프라인을 기계가 읽을 수 있는(Machine-readable) 13종의 JSON/Markdown 산출물로 구조화하였습니다.

---

## 2. Generated Intelligence Assets Directory (13 Files)

| 산출물 파일명 | Task ID | 설명 및 하이퍼링크 |
| :--- | :---: | :--- |
| **`document_index.json`** | Task 01 | [document_index.json](file:///g:/내%20드라이브/YM-LAB_PROJECT_/200_PROJECT_INTELLIGENCE/intelligence/document_index.json) (19개 핵심 문서 인덱싱) |
| **`terminology.json`** | Task 02 | [terminology.json](file:///g:/내%20드라이브/YM-LAB_PROJECT_/200_PROJECT_INTELLIGENCE/intelligence/terminology.json) (15개 도메인 핵심 용어/별칭 정의) |
| **`concept_map.json`** | Task 03 | [concept_map.json](file:///g:/내%20드라이브/YM-LAB_PROJECT_/200_PROJECT_INTELLIGENCE/intelligence/concept_map.json) (MFCO 온톨로지 개념 추론 흐름) |
| **`project_graph.json`** | Task 04 | [project_graph.json](file:///g:/내%20드라이브/YM-LAB_PROJECT_/200_PROJECT_INTELLIGENCE/intelligence/project_graph.json) (8개 노드 & 17개 엣지 관계 그래프) |
| **`dependency_graph.json`**| Task 04 | [dependency_graph.json](file:///g:/내%20드라이브/YM-LAB_PROJECT_/200_PROJECT_INTELLIGENCE/intelligence/dependency_graph.json) (데이터, 모듈, 스키마 의존성 9건) |
| **`module_relationship.json`**| Task 05 | [module_relationship.json](file:///g:/내%20드라이브/YM-LAB_PROJECT_/200_PROJECT_INTELLIGENCE/intelligence/module_relationship.json) (6개 주요 모듈 상하류 매트릭스) |
| **`technology_stack.json`**| Task 06 | [technology_stack.json](file:///g:/내%20드라이브/YM-LAB_PROJECT_/200_PROJECT_INTELLIGENCE/intelligence/technology_stack.json) (7개 범주 기술 스택 전수 추출) |
| **`task_graph.json`** | Task 07 | [task_graph.json](file:///g:/내%20드라이브/YM-LAB_PROJECT_/200_PROJECT_INTELLIGENCE/intelligence/task_graph.json) (7단계 워크플로우 실행 흐름) |
| **`knowledge_map.json`** | Task 08 | [knowledge_map.json](file:///g:/내%20드라이브/YM-LAB_PROJECT_/200_PROJECT_INTELLIGENCE/intelligence/knowledge_map.json) (Docs -> Concepts -> Tasks 전수 연결) |
| **`ai_context.json`** | Task 09 | [ai_context.json](file:///g:/내%20드라이브/YM-LAB_PROJECT_/200_PROJECT_INTELLIGENCE/intelligence/ai_context.json) (AI 세션 브리핑용 종합 메타데이터) |
| **`project_timeline.json`**| Task 10 | [project_timeline.json](file:///g:/내%20드라이브/YM-LAB_PROJECT_/200_PROJECT_INTELLIGENCE/intelligence/project_timeline.json) (Phase 00~08 로드맵 타임라인) |
| **`intelligence_schema.json`**| Task 11 | [intelligence_schema.json](file:///g:/내%20드라이브/YM-LAB_PROJECT_/200_PROJECT_INTELLIGENCE/intelligence/intelligence_schema.json) (시맨틱 모델 정식 JSON Schema) |
| **`intelligence_report.md`**| Task 12 | [intelligence_report.md](file:///g:/내%20드라이브/YM-LAB_PROJECT_/200_PROJECT_INTELLIGENCE/intelligence/intelligence_report.md) (본 인텔리전스 마스터 보고서) |

---

## 3. Project & Knowledge Statistics

```mermaid
pie title YM-LAB Ecosystem Asset Breakdown (Total 3,524 Files)
    "Node Modules (Vendor)" : 3337
    "OneDrive Legacy Assets" : 56
    "Backup Archives (00_BACKUP)" : 43
    "Scratch / Temp Scripts" : 35
    "MFCO Web Application" : 26
    "MFCO Core KB" : 17
    "Platform / Kimchi / Other" : 10
```

- **총 검증 자산**: 3,524 개 파일 (총용량 95.36 MB, SHA-256 100% 검증)
- **인덱싱된 핵심 문서**: 19 개
- **정의된 도메인 핵심 용어**: 15 개 (MFCO, Q-Code, Wasabi, Vector DB 등)
- **추출된 기술 스택 요소**: 18 개 (Python, React, SQLite3, PostgreSQL, RAG 등)
- **프로젝트 노드 & 엣지**: 8개 노드, 17개 지식 관계 엣지

---

## 4. Semantic Analysis & Architecture Flow

```mermaid
flowchart TD
    subgraph Data & Schema Foundation
        NICS["NICS_DATA Open Data"] --> PLAT["Platform 02_STANDARD_LAYER.sql"]
    end
    
    subgraph Knowledge & Ontology Layer
        PLAT --> MFCO["MFCO Master Core Ontology (Q-Code)"]
        KIM["Kimchi Phase 1 Master Spec"] --> MFCO
    end
    
    subgraph Intelligence & Context Layer
        MFCO --> PIL["Phase 05 Project Intelligence Layer"]
        PIL --> INTEL["200_PROJECT_INTELLIGENCE/intelligence/*.json"]
    end
    
    subgraph Application & AI Agent Layer
        INTEL --> RAG["Phase 06: Knowledge Engine (RAG & Vector DB)"]
        INTEL --> AGENT["Phase 08: Autonomous AI Agent Ops"]
        MFCO --> WEB["MFCO Web App (React/Vite)"]
        SANY["sanYacho (Next.js/Vercel)"]
    end
```

---

## 5. Next Recommendations for Phase 06 (Knowledge Engine Construction)

1. **RAG Vector Database Ingestion**: 본 Phase 05의 `document_index.json` 및 `terminology.json` 데이터를 ChromaDB 또는 Pinecone으로 벡터화하여 임베딩 구축.
2. **Neo4j Graph DB Import**: `project_graph.json` 및 `dependency_graph.json`을 Neo4j Cypher 쿼리로 자동 변환하여 시맨틱 지식 그래프 데이터베이스 가동.
3. **AI Session Auto-Loading**: 새로운 세션 시작 시 `ai_context.json`을 에이전트 초기화 페이로드로 자동 로드하여 컨텍스트 손실 방지.
"""
with open(os.path.join(OUT_DIR, 'intelligence_report.md'), 'w', encoding='utf-8') as f:
    f.write(intel_report)

print('[OK] Task 12: intelligence_report.md')
print('\n[ALL TASKS COMPLETED SUCCESSFULY]')
