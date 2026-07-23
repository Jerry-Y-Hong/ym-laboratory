"""
Workflow Repository
====================
Domain-specific repository for WorkflowHistory CRUD with
status-based queries.
"""

from __future__ import annotations

from acpp.models.workflow_history import WorkflowHistory
from acpp.repositories.base_repository import BaseRepository, PaginatedResult


class WorkflowRepository(BaseRepository[WorkflowHistory]):
    """Repository for WorkflowHistory entities."""

    model = WorkflowHistory

    def find_by_status(
        self,
        status: str,
        *,
        page: int = 1,
        page_size: int = 20,
    ) -> PaginatedResult[WorkflowHistory]:
        """Return workflows filtered by status."""
        return self.paginate(
            page=page,
            page_size=page_size,
            filters={"status": status},
            order_by="started_at",
            order_dir="desc",
        )

    def find_running(self) -> PaginatedResult[WorkflowHistory]:
        """Return all currently running workflows."""
        return self.find_by_status("RUNNING")

    def find_failed(self) -> PaginatedResult[WorkflowHistory]:
        """Return all failed workflows."""
        return self.find_by_status("FAILED")
