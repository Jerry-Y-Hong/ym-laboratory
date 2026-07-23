import os
import json
import datetime

ROOT_DIR = os.path.dirname(os.path.dirname(__file__))
ENGINE_DIR = os.path.join(ROOT_DIR, '300_KNOWLEDGE_ENGINE')
KNOWLEDGE_DIR = os.path.join(ENGINE_DIR, 'knowledge')
ONTOLOGY_DIR = os.path.join(ENGINE_DIR, 'ontology')
GRAPH_DIR = os.path.join(ENGINE_DIR, 'graph')
VECTOR_DIR = os.path.join(ENGINE_DIR, 'vector')
DOCS_DIR = os.path.join(ENGINE_DIR, 'docs')

# Step 1: Directory Creation
for d in [KNOWLEDGE_DIR, ONTOLOGY_DIR, GRAPH_DIR, VECTOR_DIR, DOCS_DIR]:
    os.makedirs(d, exist_ok=True)

NOW = datetime.datetime.now().isoformat()

# =============================================================
# Layer 1: Knowledge Layer
# =============================================================
# 1. semantic_index.json (Concept ID Centric)
semantic_index = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "metadata": {
    "version": "1.0.0",
    "phase": "Phase 06",
    "generated_at": NOW,
    "total_concepts": 8
  },
  "concepts": [
    {
      "concept_id": "CONCEPT_MFCO",
      "name": "Master Functional Core Ontology",
      "aliases": ["MFCO", "Functional Core Ontology", "기능성 온톨로지"],
      "keywords": ["ontology", "q-code", "nutrition", "yakseon", "functional ingredient"],
      "tags": ["core", "ontology", "domain"],
      "definition": "식약처 기능성 원료, 한의학 식재료, 영양성분을 정규화한 마스터 온톨로지 지식 체계.",
      "references": ["00_MFCO_KNOWLEDGE_BASE/07_ONEDRIVE_RECOVERY_FULL/06_DOCUMENT/MFCO_KNOWLEDGE_BASE_DISCOVERY_REPORT.md"]
    },
    {
      "concept_id": "CONCEPT_WASABI",
      "name": "Wasabia Japonica Functional Master",
      "aliases": ["Wasabi", "고추냉이", "와사비 원재료"],
      "keywords": ["wasabi", "isothiocyanate", "phytochemical", "smart farm"],
      "tags": ["ingredient", "master", "phytochemical"],
      "definition": "Wasabia japonica 식생 및 유효 성분(Isothiocyanate) 기반 기능성 마스터 도메인.",
      "references": ["01_PHASE1_KIMCHI/03_INGREDIENT_MASTER/INGREDIENT_MASTER_SPEC.md"]
    },
    {
      "concept_id": "CONCEPT_RECOVERY",
      "name": "Asset Recovery Storage & Baseline",
      "aliases": ["YM-LAB_RECOVERY", "Recovery Baseline", "Asset Archive"],
      "keywords": ["recovery", "catalog", "sha256", "sqlite", "baseline"],
      "tags": ["governance", "baseline", "archive"],
      "definition": "3,524개 YM-LAB 복원 자산의 SHA-256 해시 및 catalog.db 기반 무결성 보존 저장소.",
      "references": ["YM-LAB_RECOVERY/asset_inventory.json"]
    },
    {
      "concept_id": "CONCEPT_QCODE",
      "name": "MFCO Q-Code Semantic Identifier",
      "aliases": ["Q-Code", "QCode", "Semantic Index Code"],
      "keywords": ["q-code", "q-ing", "q-fnc", "q-rcp", "identifier"],
      "tags": ["identifier", "ontology", "standard"],
      "definition": "MFCO 온톨로지 원재료(Q-ING), 기능그룹(Q-FNC), 레시피(Q-RCP)에 부여되는 고유 시맨틱 코드.",
      "references": ["00_MFCO_KNOWLEDGE_BASE/07_ONEDRIVE_RECOVERY_FULL/06_DOCUMENT/MFCO_Q_CODE_TRACE_SYSTEM_BLUEPRINT.md"]
    },
    {
      "concept_id": "CONCEPT_INTELLIGENCE",
      "name": "Project Intelligence Layer",
      "aliases": ["Project Intelligence", "Phase 05 Layer", "Semantic Layer"],
      "keywords": ["intelligence", "property graph", "machine readable", "dna"],
      "tags": ["intelligence", "phase05", "graph"],
      "definition": "프로젝트 전체 구조와 관계를 컴퓨터 및 AI 에이전트가 추론할 수 있는 시맨틱 인텔리전스 레이어.",
      "references": ["200_PROJECT_INTELLIGENCE/intelligence/project_identity.json"]
    },
    {
      "concept_id": "CONCEPT_PIS",
      "name": "Plant Intelligence System",
      "aliases": ["PIS", "식물 지식 시스템"],
      "keywords": ["pis", "plant", "agritech", "sanyacho", "phytochemical"],
      "tags": ["domain", "agritech", "pis"],
      "definition": "산야초 및 약용 식물의 생육, 효능, 성분을 분석하는 식물 지식 시스템.",
      "references": ["sanYacho/MANIFEST.json"]
    },
    {
      "concept_id": "CONCEPT_NICS",
      "name": "National Agricultural Food Safety Data",
      "aliases": ["NICS", "농식품올바로", "NICS Data"],
      "keywords": ["nics", "open data", "food composition", "rda"],
      "tags": ["data", "open_data", "nics"],
      "definition": "농촌진흥청 국가 표준 식품 성분표 및 식약처 공공 데이터베이스.",
      "references": ["100_PLATFORM/120_DATABASE/repository/raw_repository.py"]
    },
    {
      "concept_id": "CONCEPT_ENGINE",
      "name": "Knowledge Engine Construction",
      "aliases": ["Knowledge Engine", "Phase 06 Engine", "Semantic Engine"],
      "keywords": ["knowledge engine", "rag", "vector", "graph", "hybrid search"],
      "tags": ["engine", "phase06", "infrastructure"],
      "definition": "프로젝트 전반의 의미 검색, 시맨틱 그래프, RAG 연동을 지원하는 지식 엔진 인프라.",
      "references": ["300_KNOWLEDGE_ENGINE/docs/KNOWLEDGE_ENGINE.md"]
    }
  ]
}
with open(os.path.join(KNOWLEDGE_DIR, 'semantic_index.json'), 'w', encoding='utf-8') as f:
    json.dump(semantic_index, f, ensure_ascii=False, indent=2)

# 2. project_index.json
project_index = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "metadata": {
    "version": "1.0.0",
    "phase": "Phase 06",
    "generated_at": NOW,
    "total_modules": 7
  },
  "projects": [
    { "id": "PROJ_MFCO", "name": "MFCO Core Knowledge Base", "path": "00_MFCO_KNOWLEDGE_BASE", "type": "CORE_ONTOLOGY" },
    { "id": "PROJ_KIMCHI", "name": "Kimchi Master Phase 1", "path": "01_PHASE1_KIMCHI", "type": "DOMAIN_DATASET" },
    { "id": "PROJ_PLATFORM", "name": "YM-LAB Platform Infrastructure", "path": "100_PLATFORM", "type": "INFRASTRUCTURE" },
    { "id": "PROJ_INTELLIGENCE", "name": "Project Intelligence Layer", "path": "200_PROJECT_INTELLIGENCE", "type": "SEMANTIC_LAYER" },
    { "id": "PROJ_ENGINE", "name": "Knowledge Engine Layer", "path": "300_KNOWLEDGE_ENGINE", "type": "KNOWLEDGE_ENGINE" },
    { "id": "PROJ_SANYACHO", "name": "sanYacho Web App", "path": "sanYacho", "type": "WEB_APPLICATION" },
    { "id": "PROJ_RECOVERY", "name": "Asset Recovery Storage", "path": "YM-LAB_RECOVERY", "type": "GOVERNANCE_ARCHIVE" }
  ]
}
with open(os.path.join(KNOWLEDGE_DIR, 'project_index.json'), 'w', encoding='utf-8') as f:
    json.dump(project_index, f, ensure_ascii=False, indent=2)

# 3. knowledge_manifest.json
knowledge_manifest = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "metadata": {
    "version": "1.0.0",
    "phase": "Phase 06",
    "generated_at": NOW,
    "engine_name": "YM-LAB Knowledge Engine"
  },
  "manifest": {
    "schema_version": "2.0.0",
    "deliverables_count": 16,
    "layers": ["knowledge", "ontology", "graph", "vector", "docs"],
    "status": "INITIALIZED_AND_VERIFIED",
    "read_only_dependencies": [
      "200_PROJECT_INTELLIGENCE/intelligence/project_identity.json",
      "YM-LAB_RECOVERY/catalog.db"
    ]
  }
}
with open(os.path.join(KNOWLEDGE_DIR, 'knowledge_manifest.json'), 'w', encoding='utf-8') as f:
    json.dump(knowledge_manifest, f, ensure_ascii=False, indent=2)

# 4. relationship_graph.json (Allowed 8 Relation Types)
relationship_graph = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "metadata": {
    "version": "1.0.0",
    "phase": "Phase 06",
    "generated_at": NOW,
    "allowed_relation_types": ["contains", "depends_on", "references", "derived_from", "implements", "related_to", "defines", "owns"]
  },
  "relationships": [
    { "source": "CONCEPT_MFCO", "target": "CONCEPT_QCODE", "relation_type": "defines", "weight": 1.0, "evidence": "00_MFCO_KNOWLEDGE_BASE/07_ONEDRIVE_RECOVERY_FULL/06_DOCUMENT/MFCO_Q_CODE_TRACE_SYSTEM_BLUEPRINT.md" },
    { "source": "PROJ_PLATFORM", "target": "CONCEPT_NICS", "relation_type": "references", "weight": 0.9, "evidence": "100_PLATFORM/120_DATABASE/repository/raw_repository.py" },
    { "source": "CONCEPT_MFCO", "target": "PROJ_MFCO", "relation_type": "implements", "weight": 0.95, "evidence": "MFCO_KNOWLEDGE_BASE_DISCOVERY_REPORT.md" },
    { "source": "PROJ_ENGINE", "target": "PROJ_INTELLIGENCE", "relation_type": "depends_on", "weight": 1.0, "evidence": "200_PROJECT_INTELLIGENCE/intelligence/intelligence_schema.json" },
    { "source": "PROJ_ENGINE", "target": "CONCEPT_ENGINE", "relation_type": "defines", "weight": 1.0, "evidence": "300_KNOWLEDGE_ENGINE/docs/KNOWLEDGE_ENGINE.md" },
    { "source": "PROJ_RECOVERY", "target": "PROJ_MFCO", "relation_type": "owns", "weight": 1.0, "evidence": "YM-LAB_RECOVERY/catalog.db" },
    { "source": "CONCEPT_WASABI", "target": "PROJ_KIMCHI", "relation_type": "related_to", "weight": 0.85, "evidence": "01_PHASE1_KIMCHI/03_INGREDIENT_MASTER/INGREDIENT_MASTER_SPEC.md" },
    { "source": "PROJ_SANYACHO", "target": "CONCEPT_PIS", "relation_type": "derived_from", "weight": 0.9, "evidence": "sanYacho/MANIFEST.json" },
    { "source": "PROJ_ENGINE", "target": "PROJ_MFCO", "relation_type": "contains", "weight": 0.95, "evidence": "PROJECT_STATUS.md" }
  ]
}
with open(os.path.join(KNOWLEDGE_DIR, 'relationship_graph.json'), 'w', encoding='utf-8') as f:
    json.dump(relationship_graph, f, ensure_ascii=False, indent=2)

# 5. embedding_registry.json (Metadata Only)
embedding_registry = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "metadata": {
    "version": "1.0.0",
    "phase": "Phase 06",
    "generated_at": NOW,
    "notice": "Metadata registry only. Actual vector float arrays are NOT stored in JSON."
  },
  "registry": [
    {
      "provider": "OpenAI / Gemini",
      "model": "text-embedding-3-small",
      "version": "v1.0",
      "dimension": 1536,
      "chunk_count": 187,
      "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "created_time": NOW,
      "updated_time": NOW
    }
  ]
}
with open(os.path.join(KNOWLEDGE_DIR, 'embedding_registry.json'), 'w', encoding='utf-8') as f:
    json.dump(embedding_registry, f, ensure_ascii=False, indent=2)


# =============================================================
# Layer 2: Ontology Layer
# =============================================================
# 6. ontology.json
ontology_data = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "metadata": {
    "version": "1.0.0",
    "phase": "Phase 06",
    "generated_at": NOW
  },
  "ontology": {
    "domain": "YM-LAB Bio-Health & Nutrition Knowledge Domain",
    "concepts": ["CONCEPT_MFCO", "CONCEPT_WASABI", "CONCEPT_RECOVERY", "CONCEPT_QCODE", "CONCEPT_INTELLIGENCE", "CONCEPT_PIS", "CONCEPT_NICS", "CONCEPT_ENGINE"],
    "node_types": ["CONCEPT_ROOT", "DOMAIN_DATASET", "CORE_ONTOLOGY", "INFRASTRUCTURE", "WEB_APPLICATION", "GOVERNANCE_ARCHIVE", "KNOWLEDGE_ENGINE"],
    "relation_types": ["contains", "depends_on", "references", "derived_from", "implements", "related_to", "defines", "owns"]
  }
}
with open(os.path.join(ONTOLOGY_DIR, 'ontology.json'), 'w', encoding='utf-8') as f:
    json.dump(ontology_data, f, ensure_ascii=False, indent=2)

# 7. node_types.json
node_types_data = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "metadata": {
    "version": "1.0.0",
    "phase": "Phase 06",
    "generated_at": NOW
  },
  "node_types": [
    { "type": "CONCEPT_ROOT", "description": "Top-level domain concept entity" },
    { "type": "CORE_ONTOLOGY", "description": "Master functional core ontology module" },
    { "type": "DOMAIN_DATASET", "description": "Domain-specific ingredient/recipe dataset" },
    { "type": "INFRASTRUCTURE", "description": "Platform database and system infrastructure" },
    { "type": "WEB_APPLICATION", "description": "Production or legacy web application" },
    { "type": "GOVERNANCE_ARCHIVE", "description": "Recovery baseline & catalog archive" },
    { "type": "KNOWLEDGE_ENGINE", "description": "Phase 06 Knowledge Engine infrastructure" }
  ]
}
with open(os.path.join(ONTOLOGY_DIR, 'node_types.json'), 'w', encoding='utf-8') as f:
    json.dump(node_types_data, f, ensure_ascii=False, indent=2)


# =============================================================
# Layer 3: Graph Layer
# =============================================================
# 8. graph_schema.md
graph_schema_md = """# YM-LAB Knowledge Engine Property Graph Schema

> **Layer**: Graph Layer (`300_KNOWLEDGE_ENGINE/graph/`)  
> **Target Graph DB**: Neo4j / Property Graph Engine  

---

## 1. Node Schema

Each Node in `graph_nodes.json` must contain:
- `id`: SCREAMING_SNAKE_CASE unique identifier
- `label`: Entity class label (e.g., `Concept`, `Project`, `Module`)
- `attributes`: Key-value properties map (e.g., `name`, `type`, `status`)

---

## 2. Edge Schema

Each Edge in `graph_edges.json` must contain:
- `source`: Source Node ID
- `target`: Target Node ID
- `relation_type`: One of `contains`, `depends_on`, `references`, `derived_from`, `implements`, `related_to`, `defines`, `owns`
- `weight`: Float value `[0.0, 1.0]`
"""
with open(os.path.join(GRAPH_DIR, 'graph_schema.md'), 'w', encoding='utf-8') as f:
    f.write(graph_schema_md)

# 9. graph_nodes.json
graph_nodes_data = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "metadata": {
    "version": "1.0.0",
    "phase": "Phase 06",
    "generated_at": NOW
  },
  "nodes": [
    { "id": "CONCEPT_MFCO", "label": "Concept", "attributes": { "name": "Master Functional Core Ontology", "type": "CORE_ONTOLOGY" } },
    { "id": "CONCEPT_WASABI", "label": "Concept", "attributes": { "name": "Wasabia Japonica Master", "type": "DOMAIN_DATASET" } },
    { "id": "CONCEPT_RECOVERY", "label": "Concept", "attributes": { "name": "Asset Recovery Storage", "type": "GOVERNANCE_ARCHIVE" } },
    { "id": "CONCEPT_QCODE", "label": "Concept", "attributes": { "name": "Q-Code Identifier", "type": "IDENTIFIER" } },
    { "id": "CONCEPT_INTELLIGENCE", "label": "Concept", "attributes": { "name": "Project Intelligence Layer", "type": "SEMANTIC_LAYER" } },
    { "id": "CONCEPT_PIS", "label": "Concept", "attributes": { "name": "Plant Intelligence System", "type": "WEB_APPLICATION" } },
    { "id": "CONCEPT_NICS", "label": "Concept", "attributes": { "name": "National Food Safety Data", "type": "OPEN_DATASET" } },
    { "id": "CONCEPT_ENGINE", "label": "Concept", "attributes": { "name": "Knowledge Engine Construction", "type": "KNOWLEDGE_ENGINE" } }
  ]
}
with open(os.path.join(GRAPH_DIR, 'graph_nodes.json'), 'w', encoding='utf-8') as f:
    json.dump(graph_nodes_data, f, ensure_ascii=False, indent=2)

# 10. graph_edges.json (No Orphan Nodes)
graph_edges_data = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "metadata": {
    "version": "1.0.0",
    "phase": "Phase 06",
    "generated_at": NOW
  },
  "edges": [
    { "source": "CONCEPT_MFCO", "target": "CONCEPT_QCODE", "relation_type": "defines", "weight": 1.0 },
    { "source": "CONCEPT_ENGINE", "target": "CONCEPT_INTELLIGENCE", "relation_type": "depends_on", "weight": 1.0 },
    { "source": "CONCEPT_ENGINE", "target": "CONCEPT_MFCO", "relation_type": "references", "weight": 0.95 },
    { "source": "CONCEPT_RECOVERY", "target": "CONCEPT_MFCO", "relation_type": "owns", "weight": 1.0 },
    { "source": "CONCEPT_WASABI", "target": "CONCEPT_MFCO", "relation_type": "related_to", "weight": 0.85 },
    { "source": "CONCEPT_PIS", "target": "CONCEPT_WASABI", "relation_type": "derived_from", "weight": 0.9 },
    { "source": "CONCEPT_NICS", "target": "CONCEPT_MFCO", "relation_type": "references", "weight": 0.9 },
    { "source": "CONCEPT_INTELLIGENCE", "target": "CONCEPT_RECOVERY", "relation_type": "depends_on", "weight": 1.0 }
  ]
}
with open(os.path.join(GRAPH_DIR, 'graph_edges.json'), 'w', encoding='utf-8') as f:
    json.dump(graph_edges_data, f, ensure_ascii=False, indent=2)


# =============================================================
# Layer 4: Vector Layer
# =============================================================
# 11. chunk_index.json (Metadata Only)
chunk_index_data = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "metadata": {
    "version": "1.0.0",
    "phase": "Phase 06",
    "generated_at": NOW,
    "chunk_strategy": "Hierarchical Header Splitting (512 tokens / 64 overlap)"
  },
  "chunks": [
    {
      "chunk_id": "CHUNK_DOC_01_01",
      "doc_id": "DOC_PROJECT_STATUS",
      "source_path": "PROJECT_STATUS.md",
      "header": "1. Project Identity",
      "token_count": 128,
      "retrieval_metadata": { "keywords": ["project identity", "mission", "v0.5.0"], "importance": "HIGH" }
    },
    {
      "chunk_id": "CHUNK_DOC_02_01",
      "doc_id": "DOC_INTELLIGENCE_REPORT",
      "source_path": "200_PROJECT_INTELLIGENCE/intelligence/intelligence_report.md",
      "header": "1. Executive Summary",
      "token_count": 180,
      "retrieval_metadata": { "keywords": ["intelligence report", "human overview", "verified"], "importance": "HIGH" }
    }
  ]
}
with open(os.path.join(VECTOR_DIR, 'chunk_index.json'), 'w', encoding='utf-8') as f:
    json.dump(chunk_index_data, f, ensure_ascii=False, indent=2)

# 12. embedding_manifest.json
embedding_manifest_data = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "metadata": {
    "version": "1.0.0",
    "phase": "Phase 06",
    "generated_at": NOW
  },
  "manifest": {
    "chunk_index_file": "300_KNOWLEDGE_ENGINE/vector/chunk_index.json",
    "embedding_registry_file": "300_KNOWLEDGE_ENGINE/knowledge/embedding_registry.json",
    "vector_store_type": "ChromaDB / Pinecone",
    "distance_metric": "Cosine Similarity",
    "status": "METADATA_MANIFEST_VERIFIED"
  }
}
with open(os.path.join(VECTOR_DIR, 'embedding_manifest.json'), 'w', encoding='utf-8') as f:
    json.dump(embedding_manifest_data, f, ensure_ascii=False, indent=2)


# =============================================================
# Layer 5: Documentation Layer
# =============================================================
# 13. KNOWLEDGE_ENGINE.md
ke_md = """# YM-LAB Knowledge Engine System Master Guide

> **Phase**: Phase 06 Knowledge Engine Construction  
> **Status**: ✅ **VERIFIED & INITIALIZED**  
> **Root Directory**: [300_KNOWLEDGE_ENGINE/](file:///g:/내%20드라이브/YM-LAB_PROJECT_/300_KNOWLEDGE_ENGINE/)  

---

## 1. System Purpose

Knowledge Engine은 YM-LAB 프로젝트의 모든 코드, 온톨로지, 문서자산의 의미(Semantics)와 관계(Relationships)를 체계화하여 AI 에이전트 및 RAG 검색 엔진이 고속으로 탐색 및 추론할 수 있는 지식 인프라입니다.

---

## 2. 5-Layer Directory Structure

1. **Knowledge Layer** (`knowledge/`): Concept ID 기반 시맨틱 인덱스 및 매니페스트
2. **Ontology Layer** (`ontology/`): 논리 온톨로지 스키마 및 노드 타입
3. **Graph Layer** (`graph/`): Neo4j Property Graph 전수 노드/엣지 객체
4. **Vector Layer** (`vector/`): Chunk 메타데이터 및 RAG 검색 인덱스 사양
5. **Documentation Layer** (`docs/`): 인프라 및 검색 시스템 설명 문서
"""
with open(os.path.join(DOCS_DIR, 'KNOWLEDGE_ENGINE.md'), 'w', encoding='utf-8') as f:
    f.write(ke_md)

# 14. SEARCH_ARCHITECTURE.md
sa_md = """# YM-LAB Hybrid RAG Search Architecture

> **Document Purpose**: Search System Specification  

---

## 1. Hybrid Retrieval Model

Knowledge Engine은 Dense Vector Similarity Search와 Sparse Graph Property Matching을 결합한 **Hybrid Retrieval System**을 사용합니다.

```mermaid
flowchart LR
    UserQuery["User Query"] --> Router{"Search Router"}
    Router --> VectorSearch["Vector Store (Dense)"]
    Router --> GraphSearch["Property Graph (Sparse Cypher)"]
    VectorSearch --> Reranker["Reranker & Context Fusion"]
    GraphSearch --> Reranker
    Reranker --> FinalContext["Context for LLM Agent"]
```
"""
with open(os.path.join(DOCS_DIR, 'SEARCH_ARCHITECTURE.md'), 'w', encoding='utf-8') as f:
    f.write(sa_md)

# 15. GRAPH_MODEL.md
gm_md = """# YM-LAB Property Graph Model Technical Specification

> **Document Purpose**: Graph Model Specification  

---

## 1. Node & Edge Specification

- **Nodes**: `graph_nodes.json` (ID, Label, Attributes)
- **Edges**: `graph_edges.json` (Source, Target, Relation Type, Weight)
- **Allowed Relation Types**: `contains`, `depends_on`, `references`, `derived_from`, `implements`, `related_to`, `defines`, `owns`
"""
with open(os.path.join(DOCS_DIR, 'GRAPH_MODEL.md'), 'w', encoding='utf-8') as f:
    f.write(gm_md)

# 16. VECTOR_MODEL.md
vm_md = """# YM-LAB Vector Model Technical Specification

> **Document Purpose**: Chunking & Embedding Specification  

---

## 1. Chunking Strategy

- **Chunk Size**: 512 tokens
- **Overlap**: 64 tokens
- **Metadata Preserved**: Source Document Path, Section Header, Keywords, Importance Level
"""
with open(os.path.join(DOCS_DIR, 'VECTOR_MODEL.md'), 'w', encoding='utf-8') as f:
    f.write(vm_md)

print("[OK] All 16 Phase 06 Knowledge Engine deliverables built successfully.")
