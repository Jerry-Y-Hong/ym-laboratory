"""
Mock Analytics Provider Adapter
===============================
Concrete adapter implementing AnalyticsGateway for telemetry ingestion and testing.
"""

import logging
from typing import Any, Dict

from acpp.analytics.analytics_gateway import AnalyticsGateway

logger = logging.getLogger("acpp.analytics.mock")


class MockAnalyticsAdapter(AnalyticsGateway):
    """
    Mock adapter for telemetry ingestion.
    Simulates Google Analytics / Social Media analytics provider response normalization.
    """

    def __init__(self, api_endpoint: str = "https://analytics.ym-lab.io/api") -> None:
        self.api_endpoint = api_endpoint
        self.logger = logger

    @property
    def gateway_name(self) -> str:
        return "Mock Analytics Gateway Adapter"

    def validate_metrics(self, data: Dict[str, Any]) -> bool:
        """Validate telemetry metric ranges."""
        if not isinstance(data, dict):
            return False
        if data.get("views", 0) < 0 or data.get("clicks", 0) < 0:
            return False
        return True

    def collect_metrics(self, content_id: str, channel: str) -> Dict[str, Any]:
        """Collect simulated raw channel telemetry metrics."""
        self.logger.info(f"[{self.gateway_name}] Collecting telemetry for '{content_id}' on channel '{channel}'")
        return {
            "content_asset_id": content_id,
            "channel": channel,
            "raw_views": 1250,
            "raw_clicks": 180,
            "raw_engagement_ratio": 0.144,
            "raw_conversion_ratio": 0.048,
            "raw_shares": 30,
            "raw_retention_ratio": 0.78,
        }

    def normalize_metrics(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize raw provider fields into standard ACPP telemetry format."""
        views = raw_data.get("views") or raw_data.get("raw_views") or 0
        clicks = raw_data.get("clicks") or raw_data.get("raw_clicks") or 0
        eng_rate = raw_data.get("engagement_rate") or raw_data.get("raw_engagement_ratio") or 0.10
        conv_rate = raw_data.get("conversion_rate") or raw_data.get("raw_conversion_ratio") or 0.03
        shares = raw_data.get("shares") or raw_data.get("raw_shares") or 0
        ret_rate = raw_data.get("retention_rate") or raw_data.get("raw_retention_ratio") or 0.70

        return {
            "content_asset_id": raw_data.get("content_asset_id", "ASSET-001"),
            "channel": raw_data.get("channel", "cms"),
            "views": int(views),
            "clicks": int(clicks),
            "engagement_rate": float(eng_rate),
            "conversion_rate": float(conv_rate),
            "shares": int(shares),
            "retention_rate": float(ret_rate),
        }
