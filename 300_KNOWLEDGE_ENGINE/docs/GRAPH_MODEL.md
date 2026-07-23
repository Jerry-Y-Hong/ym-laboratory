# YM-LAB Property Graph Model Technical Specification

> **Document Purpose**: Graph Model Specification  

---

## 1. Node & Edge Specification

- **Nodes**: `graph_nodes.json` (ID, Label, Attributes)
- **Edges**: `graph_edges.json` (Source, Target, Relation Type, Weight)
- **Allowed Relation Types**: `contains`, `depends_on`, `references`, `derived_from`, `implements`, `related_to`, `defines`, `owns`
