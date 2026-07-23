# ACPP Sprint 01 – Repository & Database Foundation

## Overview
This repository contains the production-ready source code for **Sprint 01** of the **AI Content Production Platform (ACPP)**, built on **AI Enterprise (ADF v3.1)** standards.

## Project Structure
```text
src/
├── acpp/
│   ├── config/
│   │   ├── settings.py          # Pydantic Settings & Environment Loader
│   │   └── logging.py           # structlog JSON/Console Logging
│   ├── db/
│   │   ├── base.py              # Declarative Base & Mixins (UUID, Timestamps, SoftDelete)
│   │   ├── session.py           # SQLAlchemy Engine & Transactional Session Factory
│   │   └── init_db.py           # Database Initializer & Table Inspector
│   ├── models/                  # 11 Production ORM Models
│   │   ├── knowledge_asset.py   # SSOT Knowledge Assets
│   │   ├── repository_index.py  # Vector Indexing & Embeddings
│   │   ├── workflow_history.py  # Pipeline Execution Tracking
│   │   ├── agent_execution.py   # Agent Execution Logs (agent_logs)
│   │   ├── approval_record.py   # AEGS Governance Approval Tokens
│   │   ├── publishing_history.py# Multi-channel Dispatch Receipts
│   │   ├── analytics_metric.py  # CEI Telemetry Metrics
│   │   ├── version_history.py   # Asset Delta Tracking
│   │   ├── audit_trail.py       # Immutable Cryptographic Audit Bus
│   │   ├── category.py          # Domain Category Taxonomy Tree
│   │   └── tag.py               # Asset Entity Tags
│   └── repositories/            # Generic & Domain Repositories
│       ├── base_repository.py   # Generic CRUD, Pagination, Search & Filtering
│       ├── knowledge_asset_repository.py
│       ├── workflow_repository.py
│       └── category_repository.py
├── alembic/                      # Database Migration Pipeline
│   ├── env.py
│   └── versions/
│       └── 001_initial_schema.py# Full Upgrade/Downgrade DDL Migration
├── tests/                        # Automated Pytest Suite
│   ├── test_db_init.py          # Database Schema & Constraint Tests
│   ├── test_models.py           # Model Creation & Relationship Tests
│   ├── test_repositories.py     # Repository CRUD, Search & Pagination Tests
│   └── test_settings.py         # Configuration & Env Loading Tests
├── alembic.ini                   # Alembic Config
├── pyproject.toml                # Project Dependencies & Tooling Config
└── README.md
```

## Running the Project & Verification

### 1. Environment Setup
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -e ".[dev]"
```

### 2. Initialize Database
```bash
python -m acpp.db.init_db
```

### 3. Run Database Migrations
```bash
alembic upgrade head
```

### 4. Run Automated Test Suite
```bash
pytest
```
