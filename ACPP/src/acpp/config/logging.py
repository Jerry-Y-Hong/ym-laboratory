"""
ACPP Logging Configuration
===========================
Configures structlog with JSON output for production and rich
console output for development. Follows ADF v3.1 observability
requirements.
"""

from __future__ import annotations

import logging
import sys

import structlog

from acpp.config.settings import Environment, get_settings


def configure_logging() -> None:
    """
    Configure structlog and stdlib logging based on current settings.

    - **Production**: JSON structured output for log aggregators.
    - **Development**: Rich, coloured console output.
    """
    settings = get_settings()
    log_level = getattr(logging, settings.acpp_log_level.value, logging.INFO)

    # ── Shared processors ─────────────────────────────────────────────
    shared_processors: list[structlog.types.Processor] = [
        structlog.contextvars.merge_contextvars,
        structlog.stdlib.add_log_level,
        structlog.stdlib.add_logger_name,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.UnicodeDecoder(),
    ]

    if settings.acpp_env == Environment.PRODUCTION:
        # JSON for production log pipelines
        renderer: structlog.types.Processor = structlog.processors.JSONRenderer()
    else:
        # Pretty console for development
        renderer = structlog.dev.ConsoleRenderer(colors=True)

    structlog.configure(
        processors=[
            *shared_processors,
            structlog.stdlib.ProcessorFormatter.wrap_for_formatter,
        ],
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

    formatter = structlog.stdlib.ProcessorFormatter(
        processors=[
            structlog.stdlib.ProcessorFormatter.remove_processors_meta,
            renderer,
        ],
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)

    root_logger = logging.getLogger()
    root_logger.handlers.clear()
    root_logger.addHandler(handler)
    root_logger.setLevel(log_level)

    # Quiet noisy third-party loggers
    logging.getLogger("sqlalchemy.engine").setLevel(
        logging.DEBUG if settings.database_echo else logging.WARNING
    )
    logging.getLogger("alembic").setLevel(logging.INFO)


def get_logger(name: str) -> structlog.stdlib.BoundLogger:
    """Return a named structlog logger instance."""
    return structlog.get_logger(name)
