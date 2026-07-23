# YM-LAB Knowledge Engine Property Graph Schema

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
