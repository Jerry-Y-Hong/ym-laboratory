# YM-LAB Knowledge Query Engine

---

## Query Processing Flow
1. **User Query Input**: 자연어 기반 건강/영양 질의 수신.
2. **Semantic Extraction**: Q-Code 시맨틱 엔티티 추출.
3. **Hybrid RAG Execution**: Vector Store 검색 + Neo4j Property Graph 경로 탐색.
4. **Response Synthesis**: 검증된 약선 처방 지식 합성.
