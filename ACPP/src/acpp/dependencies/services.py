"""
Service Injection Dependencies
================================
Provides FastAPI dependencies for instantiating business service layers.
"""

from fastapi import Depends
from sqlalchemy.orm import Session

from acpp.dependencies.database import get_db_session
from acpp.services.knowledge_service import KnowledgeService
from acpp.services.knowledge_structuring_service import KnowledgeStructuringService
from acpp.services.repository_service import RepositoryService
from acpp.services.research_service import ResearchService
from acpp.services.writing_service import WritingService


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


def get_research_service(
    session: Session = Depends(get_db_session),
) -> ResearchService:
    """Inject ResearchService instance."""
    return ResearchService(session)


def get_knowledge_structuring_service(
    session: Session = Depends(get_db_session),
) -> KnowledgeStructuringService:
    """Inject KnowledgeStructuringService instance."""
    return KnowledgeStructuringService(session)


def get_writing_service(
    session: Session = Depends(get_db_session),
) -> WritingService:
    """Inject WritingService instance."""
    return WritingService(session)



