"""
Test: Database Initialization
==============================
Verifies that all 11 tables are created correctly.
"""

from sqlalchemy import inspect

from acpp.db.base import Base


class TestDatabaseInit:
    """Verify the database schema is correctly instantiated."""

    def test_all_tables_created(self, engine):
        """All 11 expected tables must exist after create_all."""
        inspector = inspect(engine)
        tables = set(inspector.get_table_names())

        expected = {
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
        assert expected.issubset(tables), f"Missing tables: {expected - tables}"

    def test_knowledge_assets_columns(self, engine):
        """knowledge_assets table must have all required columns."""
        inspector = inspect(engine)
        columns = {col["name"] for col in inspector.get_columns("knowledge_assets")}
        required = {
            "asset_id",
            "qcode",
            "domain_code",
            "title",
            "version",
            "author_agent_id",
            "verification_score",
            "security_level",
            "file_path",
            "created_at",
            "updated_at",
            "is_deleted",
        }
        assert required.issubset(columns), f"Missing columns: {required - columns}"

    def test_workflow_history_columns(self, engine):
        """workflow_history table must have all required columns."""
        inspector = inspect(engine)
        columns = {col["name"] for col in inspector.get_columns("workflow_history")}
        required = {
            "workflow_run_id",
            "workflow_name",
            "tenant_id",
            "current_state",
            "status",
            "started_at",
        }
        assert required.issubset(columns), f"Missing columns: {required - columns}"

    def test_foreign_keys_exist(self, engine):
        """Key foreign key relationships must be defined."""
        inspector = inspect(engine)

        # repository_index → knowledge_assets
        fks = inspector.get_foreign_keys("repository_index")
        fk_tables = {fk["referred_table"] for fk in fks}
        assert "knowledge_assets" in fk_tables

        # agent_logs → workflow_history
        fks = inspector.get_foreign_keys("agent_logs")
        fk_tables = {fk["referred_table"] for fk in fks}
        assert "workflow_history" in fk_tables

    def test_indexes_exist(self, engine):
        """Important indexes must be present."""
        inspector = inspect(engine)
        indexes = inspector.get_indexes("knowledge_assets")
        index_names = {idx["name"] for idx in indexes}
        assert "idx_ka_domain_qcode" in index_names
