"""
ACPP Database Initializer
==========================
Script to create all tables and verify database connectivity.

Usage::

    python -m acpp.db.init_db
"""

from __future__ import annotations

import sys

from acpp.config.logging import configure_logging, get_logger
from acpp.config.settings import get_settings
from acpp.db.base import Base
from acpp.db.session import get_engine

# Ensure all models are imported so their metadata is registered
from acpp.models import (  # noqa: F401
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


def init_db() -> None:
    """Create all tables from the ORM metadata."""
    configure_logging()
    logger = get_logger("acpp.db.init")
    settings = get_settings()

    logger.info(
        "Initializing database",
        database_url=settings.database_url.split("@")[-1] if "@" in settings.database_url else settings.database_url,
        environment=settings.acpp_env.value,
    )

    engine = get_engine()
    Base.metadata.create_all(bind=engine)

    # Verify tables were created
    from sqlalchemy import inspect

    inspector = inspect(engine)
    tables = inspector.get_table_names()
    logger.info("Database initialized successfully", tables=tables, count=len(tables))

    expected_tables = {
        "knowledge_assets",
        "repository_index",
        "workflow_history",
        "agent_logs",
        "human_approval_tokens",
        "publishing_history",
        "analytics_metrics",
        "version_control_history",
        "audit_trail",
        "categories",
        "tags",
    }

    missing = expected_tables - set(tables)
    if missing:
        logger.error("Missing tables", missing=list(missing))
        sys.exit(1)

    logger.info("All 11 expected tables verified successfully [OK]")


if __name__ == "__main__":
    init_db()
