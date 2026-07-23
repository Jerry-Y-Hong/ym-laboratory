# YM-LAB Knowledge Engine System Master Guide

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
