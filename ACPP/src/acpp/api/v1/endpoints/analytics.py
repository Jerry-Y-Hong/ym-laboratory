"""
Analytics Agent Endpoints
=========================
REST API routes for Analytics Agent (ACPP-AG-07) telemetry ingestion,
Content Effectiveness Index (CEI) reporting, and feedback loops.
"""

from fastapi import APIRouter, Depends, status

from acpp.core.exceptions import AnalyticsReportNotFoundError
from acpp.dependencies.services import get_analytics_service
from acpp.schemas.analytics import (
    AnalyticsResponse,
    TelemetryIngestRequest,
)
from acpp.services.analytics_service import AnalyticsService

router = APIRouter(tags=["Analytics Agent"])


@router.post(
    "/analytics/telemetry",
    response_model=AnalyticsResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit Telemetry Metrics & Trigger Feedback Loop",
    description="Trigger Analytics Agent (ACPP-AG-07) to ingest post-publication telemetry, compute Content Effectiveness Index (CEI), grade performance, and generate Knowledge Repository feedback signals.",
)
def process_telemetry(
    payload: TelemetryIngestRequest,
    service: AnalyticsService = Depends(get_analytics_service),
) -> AnalyticsResponse:
    """
    Ingest post-publication channel performance metrics and return CEI report.
    """
    return service.process_telemetry(payload)


@router.get(
    "/analytics/report/{content_asset_id}",
    response_model=AnalyticsResponse,
    summary="Get Analytics Report & CEI Score",
    description="Retrieve Content Effectiveness Index (CEI) report and repository feedback signal for a content asset.",
)
def get_analytics_report(
    content_asset_id: str,
    service: AnalyticsService = Depends(get_analytics_service),
) -> AnalyticsResponse:
    """
    Query analytics report by content asset ID.
    """
    report = service.get_analytics_report(content_asset_id)
    if not report:
        raise AnalyticsReportNotFoundError(content_asset_id)
    return report
