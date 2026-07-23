"""
RepositoryService
==================
Business logic layer for Knowledge Repository status checks and diagnostic statistics.
"""

from typing import Dict, Any
from sqlalchemy import text
from sqlalchemy.orm import Session

from acpp.models.category import Category
from acpp.models.knowledge_asset import KnowledgeAsset
from acpp.models.workflow_history import WorkflowHistory


class RepositoryService:
    """Service for querying Knowledge Repository health, counts, and engine stats."""

    def __init__(self, session: Session) -> None:
        self.session = session

    def get_status(self) -> Dict[str, Any]:
        """Perform system checks and return repository operational state."""
        db_connected = False
        try:
            self.session.execute(text("SELECT 1"))
            db_connected = True
        except Exception:
            db_connected = False

        total_assets = 0
        total_categories = 0
        total_workflows = 0

        if db_connected:
            try:
                total_assets = (
                    self.session.query(KnowledgeAsset)
                    .filter(KnowledgeAsset.is_deleted == False)
                    .count()
                )
                total_categories = self.session.query(Category).count()
                total_workflows = self.session.query(WorkflowHistory).count()
            except Exception:
                pass

        return {
            "status": "ONLINE" if db_connected else "OFFLINE",
            "database_connected": db_connected,
            "total_knowledge_assets": total_assets,
            "total_categories": total_categories,
            "total_workflows": total_workflows,
            "storage_engine": {
                "raw_dir": "repository/raw",
                "structured_dir": "repository/structured",
                "published_dir": "repository/published",
                "index_dir": "repository/index",
            },
        }
