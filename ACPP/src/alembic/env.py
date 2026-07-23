"""
Alembic Environment Configuration
===================================
Configures Alembic to use ACPP's SQLAlchemy models and database
connection from Settings.
"""

from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool

from alembic import context

# ── Import ACPP models so Alembic metadata knows about all tables ─────
from acpp.db.base import Base
from acpp.models import (  # noqa: F401 – imported for side-effect
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

# ── Alembic Config ────────────────────────────────────────────────────
config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Target metadata for autogenerate
target_metadata = Base.metadata


def _get_url() -> str:
    """
    Resolve the database URL.

    Priority:
    1. DATABASE_URL environment variable
    2. alembic.ini sqlalchemy.url
    """
    import os

    return os.environ.get("DATABASE_URL", config.get_main_option("sqlalchemy.url", ""))


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode (generates SQL script)."""
    url = _get_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode (executes against the DB)."""
    configuration = config.get_section(config.config_ini_section, {})
    configuration["sqlalchemy.url"] = _get_url()

    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
