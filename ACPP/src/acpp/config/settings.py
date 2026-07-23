"""
ACPP Settings – Pydantic Settings Model
========================================
Central settings object loaded from environment variables (.env) with
typed validation. Follows the ACPP_CONFIGURATION_STANDARD.md hierarchy.
"""

from __future__ import annotations

from enum import Enum
from pathlib import Path
from typing import Optional

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Environment(str, Enum):
    """Supported deployment environments."""

    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"


class LogLevel(str, Enum):
    """Supported log levels."""

    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"


class Settings(BaseSettings):
    """
    Master configuration for ACPP.

    Values are loaded from environment variables (highest priority),
    then from a `.env` file if present.  Field names map directly to
    the env-var names defined in `.env.example`.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── System ────────────────────────────────────────────────────────
    acpp_env: Environment = Field(
        default=Environment.DEVELOPMENT,
        description="Deployment environment.",
    )
    acpp_log_level: LogLevel = Field(
        default=LogLevel.INFO,
        description="Root logging level.",
    )
    acpp_tenant_id: str = Field(
        default="tenant-default",
        description="Multi-tenant identifier.",
    )

    # ── Database ──────────────────────────────────────────────────────
    database_url: str = Field(
        default="sqlite:///acpp_dev.db",
        description="SQLAlchemy connection URI.",
    )
    database_pool_size: int = Field(default=20, ge=1, le=100)
    database_max_overflow: int = Field(default=10, ge=0, le=50)
    database_echo: bool = Field(
        default=False,
        description="Echo SQL statements to stdout (debug only).",
    )

    # ── AI Engine Credentials ─────────────────────────────────────────
    openai_api_key: Optional[str] = Field(default=None)
    azure_openai_api_key: Optional[str] = Field(default=None)

    # ── Security ──────────────────────────────────────────────────────
    aaos_secret_key: str = Field(default="change-me")
    aegs_governance_gate_key: str = Field(default="change-me")

    # ── Server ────────────────────────────────────────────────────────
    host: str = Field(default="0.0.0.0")
    port: int = Field(default=8080, ge=1024, le=65535)

    # ── Paths ─────────────────────────────────────────────────────────
    repository_root: Path = Field(
        default=Path("repository"),
        description="Root path for the 4-tier knowledge repository.",
    )

    # ── Derived Properties ────────────────────────────────────────────
    @property
    def is_production(self) -> bool:
        return self.acpp_env == Environment.PRODUCTION

    @property
    def is_development(self) -> bool:
        return self.acpp_env == Environment.DEVELOPMENT

    @property
    def raw_dir(self) -> Path:
        return self.repository_root / "raw"

    @property
    def structured_dir(self) -> Path:
        return self.repository_root / "structured"

    @property
    def published_dir(self) -> Path:
        return self.repository_root / "published"

    @property
    def index_dir(self) -> Path:
        return self.repository_root / "index"

    @field_validator("database_url", mode="before")
    @classmethod
    def _validate_database_url(cls, v: str) -> str:
        if not v:
            raise ValueError("DATABASE_URL must not be empty")
        return v


# ── Singleton accessor ────────────────────────────────────────────────────────
_settings: Optional[Settings] = None


def get_settings() -> Settings:
    """Return the cached Settings singleton."""
    global _settings  # noqa: PLW0603
    if _settings is None:
        _settings = Settings()
    return _settings


def reset_settings() -> None:
    """Reset the cached settings (for testing)."""
    global _settings  # noqa: PLW0603
    _settings = None
