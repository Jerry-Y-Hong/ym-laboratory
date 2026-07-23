# YM-LAB Hybrid RAG Search Architecture

> **Document Purpose**: Search System Specification  

---

## 1. Hybrid Retrieval Model

Knowledge Engine은 Dense Vector Similarity Search와 Sparse Graph Property Matching을 결합한 **Hybrid Retrieval System**을 사용합니다.

```mermaid
flowchart LR
    UserQuery["User Query"] --> Router{"Search Router"}
    Router --> VectorSearch["Vector Store Dense"]
    Router --> GraphSearch["Property Graph Sparse Cypher"]
    VectorSearch --> Reranker["Reranker and Context Fusion"]
    GraphSearch --> Reranker
    Reranker --> FinalContext["Context for LLM Agent"]
```
