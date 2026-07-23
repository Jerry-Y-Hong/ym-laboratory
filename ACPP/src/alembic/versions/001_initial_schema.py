"""ACPP initial schema – all 11 tables

Revision ID: 001_initial_schema
Revises: None
Create Date: 2026-07-23
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers
revision: str = "001_initial_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── 1. knowledge_assets ───────────────────────────────────────────
    op.create_table(
        "knowledge_assets",
        sa.Column("asset_id", sa.String(64), primary_key=True),
        sa.Column("qcode", sa.String(64), nullable=False, unique=True),
        sa.Column("domain_code", sa.String(32), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("version", sa.String(16), nullable=False, server_default="v1.0.0"),
        sa.Column("author_agent_id", sa.String(32), nullable=False),
        sa.Column("verification_score", sa.Numeric(3, 2), nullable=False, server_default="0.00"),
        sa.Column("security_level", sa.String(16), nullable=False, server_default="PUBLIC"),
        sa.Column("file_path", sa.String(512), nullable=False),
        sa.Column("summary", sa.Text, nullable=True),
        sa.Column("category_id", sa.String(64), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("is_deleted", sa.Boolean, server_default="false", nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.CheckConstraint(
            "verification_score >= 0.00 AND verification_score <= 1.00",
            name="ck_ka_verification_range",
        ),
        sa.CheckConstraint(
            "security_level IN ('PUBLIC', 'INTERNAL', 'RESTRICTED', 'CONFIDENTIAL')",
            name="ck_ka_security_level",
        ),
    )
    op.create_index("idx_ka_domain_qcode", "knowledge_assets", ["domain_code", "qcode"])
    op.create_index("idx_ka_qcode", "knowledge_assets", ["qcode"])
    op.create_index("idx_ka_domain", "knowledge_assets", ["domain_code"])
    op.create_index("idx_ka_is_deleted", "knowledge_assets", ["is_deleted"])

    # ── 2. categories ─────────────────────────────────────────────────
    op.create_table(
        "categories",
        sa.Column("category_id", sa.String(64), primary_key=True),
        sa.Column("name", sa.String(128), nullable=False),
        sa.Column("domain_code", sa.String(32), nullable=False),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("parent_id", sa.String(64), sa.ForeignKey("categories.category_id"), nullable=True),
        sa.Column("sort_order", sa.Integer, nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("is_deleted", sa.Boolean, server_default="false", nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("idx_cat_name", "categories", ["name"])
    op.create_index("idx_cat_domain", "categories", ["domain_code"])

    # ── 3. tags ───────────────────────────────────────────────────────
    op.create_table(
        "tags",
        sa.Column("tag_id", sa.String(64), primary_key=True),
        sa.Column("asset_id", sa.String(64), sa.ForeignKey("knowledge_assets.asset_id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(128), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("idx_tag_name", "tags", ["name"])
    op.create_index("idx_tag_asset", "tags", ["asset_id"])

    # ── 4. repository_index ───────────────────────────────────────────
    op.create_table(
        "repository_index",
        sa.Column("index_id", sa.String(64), primary_key=True),
        sa.Column("asset_id", sa.String(64), sa.ForeignKey("knowledge_assets.asset_id", ondelete="CASCADE"), nullable=False),
        sa.Column("qcode", sa.String(64), nullable=False),
        sa.Column("chunk_index", sa.Integer, nullable=False, server_default="0"),
        sa.Column("chunk_text", sa.Text, nullable=False),
        sa.Column("embedding", sa.Text, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("idx_repo_index_asset", "repository_index", ["asset_id"])

    # ── 5. workflow_history ───────────────────────────────────────────
    op.create_table(
        "workflow_history",
        sa.Column("workflow_run_id", sa.String(64), primary_key=True),
        sa.Column("workflow_name", sa.String(64), nullable=False),
        sa.Column("tenant_id", sa.String(32), nullable=False),
        sa.Column("current_state", sa.String(32), nullable=False),
        sa.Column("status", sa.String(16), nullable=False, server_default="RUNNING"),
        sa.Column("input_payload", sa.Text, nullable=True),
        sa.Column("output_payload", sa.Text, nullable=True),
        sa.Column("error_message", sa.Text, nullable=True),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("is_deleted", sa.Boolean, server_default="false", nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.CheckConstraint(
            "status IN ('RUNNING', 'PAUSED', 'COMPLETED', 'FAILED')",
            name="ck_wf_status",
        ),
    )
    op.create_index("idx_wf_status", "workflow_history", ["status", "started_at"])
    op.create_index("idx_wf_tenant", "workflow_history", ["tenant_id"])

    # ── 6. agent_logs ─────────────────────────────────────────────────
    op.create_table(
        "agent_logs",
        sa.Column("log_id", sa.String(64), primary_key=True),
        sa.Column("workflow_run_id", sa.String(64), sa.ForeignKey("workflow_history.workflow_run_id", ondelete="CASCADE"), nullable=False),
        sa.Column("agent_id", sa.String(32), nullable=False),
        sa.Column("action_name", sa.String(64), nullable=False),
        sa.Column("log_level", sa.String(8), nullable=False, server_default="INFO"),
        sa.Column("message", sa.Text, nullable=False),
        sa.Column("execution_time_ms", sa.Integer, nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.CheckConstraint(
            "log_level IN ('INFO', 'WARN', 'ERROR', 'DEBUG')",
            name="ck_agent_log_level",
        ),
    )
    op.create_index("idx_agent_logs_wf", "agent_logs", ["workflow_run_id", "agent_id"])

    # ── 7. human_approval_tokens ──────────────────────────────────────
    op.create_table(
        "human_approval_tokens",
        sa.Column("token_id", sa.String(64), primary_key=True),
        sa.Column("workflow_run_id", sa.String(64), sa.ForeignKey("workflow_history.workflow_run_id"), nullable=False),
        sa.Column("approver_user_id", sa.String(64), nullable=False),
        sa.Column("approval_status", sa.String(16), nullable=False, server_default="PENDING"),
        sa.Column("rejection_reason", sa.Text, nullable=True),
        sa.Column("issued_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.CheckConstraint(
            "approval_status IN ('PENDING', 'APPROVED', 'REJECTED')",
            name="ck_approval_status",
        ),
    )
    op.create_index("idx_approval_token_wf", "human_approval_tokens", ["workflow_run_id"])

    # ── 8. publishing_history ─────────────────────────────────────────
    op.create_table(
        "publishing_history",
        sa.Column("publication_id", sa.String(64), primary_key=True),
        sa.Column("workflow_run_id", sa.String(64), sa.ForeignKey("workflow_history.workflow_run_id"), nullable=False),
        sa.Column("approval_token_id", sa.String(64), sa.ForeignKey("human_approval_tokens.token_id"), nullable=False),
        sa.Column("channel_type", sa.String(32), nullable=False),
        sa.Column("target_url", sa.String(512), nullable=True),
        sa.Column("artifact_path", sa.String(512), nullable=True),
        sa.Column("status", sa.String(16), nullable=False, server_default="SUCCESS"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.CheckConstraint(
            "status IN ('SUCCESS', 'FAILED')",
            name="ck_pub_status",
        ),
    )
    op.create_index("idx_pub_hist_channel", "publishing_history", ["channel_type"])

    # ── 9. analytics_metrics ──────────────────────────────────────────
    op.create_table(
        "analytics_metrics",
        sa.Column("metric_id", sa.String(64), primary_key=True),
        sa.Column("publication_id", sa.String(64), sa.ForeignKey("publishing_history.publication_id", ondelete="CASCADE"), nullable=False),
        sa.Column("pageviews", sa.Integer, nullable=False, server_default="0"),
        sa.Column("dwell_time_seconds", sa.Integer, nullable=False, server_default="0"),
        sa.Column("social_shares", sa.Integer, nullable=False, server_default="0"),
        sa.Column("cei_score", sa.Numeric(5, 2), nullable=False, server_default="0.00"),
        sa.Column("feedback_recommendation", sa.Text, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.CheckConstraint(
            "cei_score >= 0.00 AND cei_score <= 100.00",
            name="ck_analytics_cei_range",
        ),
    )
    op.create_index("idx_analytics_cei", "analytics_metrics", ["cei_score"])

    # ── 10. version_control_history ───────────────────────────────────
    op.create_table(
        "version_control_history",
        sa.Column("version_id", sa.String(64), primary_key=True),
        sa.Column("asset_id", sa.String(64), sa.ForeignKey("knowledge_assets.asset_id", ondelete="CASCADE"), nullable=False),
        sa.Column("previous_version", sa.String(16), nullable=False),
        sa.Column("new_version", sa.String(16), nullable=False),
        sa.Column("change_summary", sa.Text, nullable=False),
        sa.Column("modified_by_agent_id", sa.String(32), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # ── 11. audit_trail ───────────────────────────────────────────────
    op.create_table(
        "audit_trail",
        sa.Column("audit_id", sa.String(64), primary_key=True),
        sa.Column("event_type", sa.String(64), nullable=False),
        sa.Column("actor_id", sa.String(64), nullable=False),
        sa.Column("target_resource_id", sa.String(64), nullable=False),
        sa.Column("payload_sha256", sa.String(64), nullable=False),
        sa.Column("previous_audit_hash", sa.String(64), nullable=False),
        sa.Column("details", sa.Text, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("idx_audit_event", "audit_trail", ["event_type"])
    op.create_index("idx_audit_actor", "audit_trail", ["actor_id"])


def downgrade() -> None:
    op.drop_table("audit_trail")
    op.drop_table("version_control_history")
    op.drop_table("analytics_metrics")
    op.drop_table("publishing_history")
    op.drop_table("human_approval_tokens")
    op.drop_table("agent_logs")
    op.drop_table("workflow_history")
    op.drop_table("repository_index")
    op.drop_table("tags")
    op.drop_table("categories")
    op.drop_table("knowledge_assets")
