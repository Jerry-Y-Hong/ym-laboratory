"""
ACPP Test Configuration (conftest.py)
======================================
Provides shared pytest fixtures for database testing:
- In-memory SQLite engine
- Transactional session with auto-rollback
- Pre-built factory helpers
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone, timedelta

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from acpp.db.base import Base
from acpp.models import (
    KnowledgeAsset,
    RepositoryIndex,
    WorkflowHistory,
    AgentExecution,
    ApprovalRecord,
    PublishingHistory,
    AnalyticsMetric,
    VersionHistory,
    AuditTrail,
    Category,
    Tag,
)


@pytest.fixture(scope="session")
def engine():
    """Create a session-scoped in-memory SQLite engine."""
    eng = create_engine(
        "sqlite:///:memory:",
        echo=False,
        connect_args={"check_same_thread": False},
    )
    Base.metadata.create_all(bind=eng)
    yield eng
    eng.dispose()


@pytest.fixture()
def session(engine):
    """
    Per-test transactional session that rolls back after each test.
    Ensures test isolation.
    """
    connection = engine.connect()
    transaction = connection.begin()
    sess = sessionmaker(bind=connection, expire_on_commit=False)()

    yield sess

    sess.close()
    transaction.rollback()
    connection.close()


# ── Factory helpers ───────────────────────────────────────────────────


def make_knowledge_asset(**overrides) -> KnowledgeAsset:
    """Create a KnowledgeAsset with sensible defaults."""
    uid = str(uuid.uuid4())[:8]
    defaults = {
        "asset_id": f"KA-TEST-{uid}",
        "qcode": f"Q-TEST-{uid}",
        "domain_code": "TEST",
        "title": f"Test Asset {uid}",
        "version": "v1.0.0",
        "author_agent_id": "ACPP-AG-02",
        "verification_score": 0.95,
        "security_level": "PUBLIC",
        "file_path": f"structured/assets/KA-TEST-{uid}.md",
    }
    defaults.update(overrides)
    return KnowledgeAsset(**defaults)


def make_workflow(**overrides) -> WorkflowHistory:
    """Create a WorkflowHistory with sensible defaults."""
    uid = str(uuid.uuid4())[:8]
    defaults = {
        "workflow_run_id": f"WF-{uid}",
        "workflow_name": "content_pipeline",
        "tenant_id": "tenant-default",
        "current_state": "INIT",
        "status": "RUNNING",
        "started_at": datetime.now(timezone.utc),
    }
    defaults.update(overrides)
    return WorkflowHistory(**defaults)


def make_category(**overrides) -> Category:
    """Create a Category with sensible defaults."""
    uid = str(uuid.uuid4())[:8]
    defaults = {
        "category_id": f"CAT-{uid}",
        "name": f"Category {uid}",
        "domain_code": "TEST",
    }
    defaults.update(overrides)
    return Category(**defaults)


def make_approval_record(workflow_run_id: str, **overrides) -> ApprovalRecord:
    """Create an ApprovalRecord with sensible defaults."""
    uid = str(uuid.uuid4())[:8]
    now = datetime.now(timezone.utc)
    defaults = {
        "token_id": f"TOK-{uid}",
        "workflow_run_id": workflow_run_id,
        "approver_user_id": "user-admin",
        "approval_status": "PENDING",
        "issued_at": now,
        "expires_at": now + timedelta(hours=24),
    }
    defaults.update(overrides)
    return ApprovalRecord(**defaults)
