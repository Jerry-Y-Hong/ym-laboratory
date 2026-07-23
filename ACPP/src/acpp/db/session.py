"""
ACPP Database Session Factory
==============================
Creates the SQLAlchemy engine and scoped session factory from
application settings.
"""

from __future__ import annotations

from contextlib import contextmanager
from typing import Generator, Optional

from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import Session, sessionmaker

from acpp.config.settings import get_settings

# ── Module-level singletons ──────────────────────────────────────────────────
_engine: Optional[Engine] = None
_session_factory: Optional[sessionmaker[Session]] = None


def get_engine() -> Engine:
    """
    Return (and lazily create) the global SQLAlchemy Engine.

    The engine is configured from ``Settings.database_url`` and pool
    parameters defined in ``.env``.
    """
    global _engine  # noqa: PLW0603
    if _engine is None:
        settings = get_settings()
        connect_args: dict = {}

        # SQLite needs check_same_thread=False for multi-threaded use
        if settings.database_url.startswith("sqlite"):
            connect_args["check_same_thread"] = False

        _engine = create_engine(
            settings.database_url,
            echo=settings.database_echo,
            pool_pre_ping=True,
            connect_args=connect_args,
            # Pool settings only apply to non-SQLite engines
            **(
                {
                    "pool_size": settings.database_pool_size,
                    "max_overflow": settings.database_max_overflow,
                }
                if not settings.database_url.startswith("sqlite")
                else {}
            ),
        )
    return _engine


def get_session_factory() -> sessionmaker[Session]:
    """Return (and lazily create) the global session factory."""
    global _session_factory  # noqa: PLW0603
    if _session_factory is None:
        _session_factory = sessionmaker(
            bind=get_engine(),
            autocommit=False,
            autoflush=False,
            expire_on_commit=False,
        )
    return _session_factory


@contextmanager
def get_session() -> Generator[Session, None, None]:
    """
    Context manager that yields a transactional DB session.

    Usage::

        with get_session() as session:
            session.add(my_model)
            # auto-committed on clean exit, rolled back on exception
    """
    factory = get_session_factory()
    session = factory()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def reset_engine() -> None:
    """Dispose engine and clear singletons (for testing)."""
    global _engine, _session_factory  # noqa: PLW0603
    if _engine is not None:
        _engine.dispose()
    _engine = None
    _session_factory = None
