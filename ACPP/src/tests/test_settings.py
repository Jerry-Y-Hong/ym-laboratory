"""
Test: Configuration & Settings
================================
Verifies Settings loading, defaults, and validation.
"""

import os
import pytest

from acpp.config.settings import Settings, Environment, LogLevel, reset_settings


class TestSettings:
    """Verify Settings model behavior."""

    def setup_method(self):
        reset_settings()

    def test_default_values(self):
        """Settings should provide sensible defaults."""
        settings = Settings(
            database_url="sqlite:///test.db",
            _env_file=None,  # Don't read .env for tests
        )
        assert settings.acpp_env == Environment.DEVELOPMENT
        assert settings.acpp_log_level == LogLevel.INFO
        assert settings.acpp_tenant_id == "tenant-default"
        assert settings.database_pool_size == 20
        assert settings.database_max_overflow == 10
        assert settings.database_echo is False
        assert settings.port == 8080

    def test_is_production(self):
        settings = Settings(
            acpp_env=Environment.PRODUCTION,
            database_url="sqlite:///test.db",
            _env_file=None,
        )
        assert settings.is_production is True
        assert settings.is_development is False

    def test_is_development(self):
        settings = Settings(
            database_url="sqlite:///test.db",
            _env_file=None,
        )
        assert settings.is_development is True

    def test_repository_paths(self):
        from pathlib import Path

        settings = Settings(
            database_url="sqlite:///test.db",
            repository_root=Path("/data/repo"),
            _env_file=None,
        )
        assert settings.raw_dir == Path("/data/repo/raw")
        assert settings.structured_dir == Path("/data/repo/structured")
        assert settings.published_dir == Path("/data/repo/published")
        assert settings.index_dir == Path("/data/repo/index")

    def test_empty_database_url_rejected(self):
        with pytest.raises(Exception):
            Settings(database_url="", _env_file=None)

    def test_port_range_validation(self):
        """Port must be between 1024 and 65535."""
        with pytest.raises(Exception):
            Settings(
                database_url="sqlite:///test.db",
                port=80,
                _env_file=None,
            )
