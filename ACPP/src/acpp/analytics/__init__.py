"""
Analytics Gateway Abstraction Layer
====================================
Provides vendor-neutral interface for post-publication telemetry analytics adapters.
"""

from acpp.analytics.analytics_gateway import AnalyticsGateway
from acpp.analytics.mock_analytics_adapter import MockAnalyticsAdapter

__all__ = ["AnalyticsGateway", "MockAnalyticsAdapter"]
