"""
Database Dependency Provider
============================
Provides FastAPI dependency for injecting database sessions.
"""

from typing import Generator
from sqlalchemy.orm import Session

from acpp.db.session import get_session_factory


def get_db_session() -> Generator[Session, None, None]:
    """Yield a database session for FastAPI endpoint handlers."""
    factory = get_session_factory()
    session = factory()
    try:
        yield session
    finally:
        session.close()
