"""
Service Injection Dependencies
================================
Provides FastAPI dependencies for instantiating business service layers.
"""

from fastapi import Depends
from sqlalchemy.orm import Session

from acpp.dependencies.database import get_db_session
from acpp.services.knowledge_service import KnowledgeService
from acpp.services.repository_service import RepositoryService


def get_knowledge_service(
    session: Session = Depends(get_db_session),
) -> KnowledgeService:
    """Inject KnowledgeService instance."""
    return KnowledgeService(session)


def get_repository_service(
    session: Session = Depends(get_db_session),
) -> RepositoryService:
    """Inject RepositoryService instance."""
    return RepositoryService(session)
