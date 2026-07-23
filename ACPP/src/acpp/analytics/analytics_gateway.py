"""
Analytics Gateway Interface
===========================
Abstract Base Class defining the vendor-neutral contract for telemetry analytics providers.
"""

from abc import ABC, abstractmethod
from typing import Any, Dict


class AnalyticsGateway(ABC):
    """
    Vendor-neutral interface for external telemetry and post-publication metrics providers
    (Google Analytics, Search Console, Social Analytics, CMS Analytics).
    """

    @property
    @abstractmethod
    def gateway_name(self) -> str:
        """Return gateway provider name."""
        pass

    @abstractmethod
    def collect_metrics(self, content_id: str, channel: str) -> Dict[str, Any]:
        """Collect raw telemetry metrics from channel endpoint."""
        pass

    @abstractmethod
    def normalize_metrics(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize metrics to standard telemetry schema."""
        pass

    @abstractmethod
    def validate_metrics(self, data: Dict[str, Any]) -> bool:
        """Validate telemetry data bounds and completeness."""
        pass
