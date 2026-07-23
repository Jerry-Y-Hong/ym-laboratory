"""
Publishing Agent Endpoints
==========================
REST API routes for Publishing Agent (ACPP-AG-06) channel dispatch & status tracking.
Enforces AEGS Phase 37 Human Approval Token verification.
"""

from fastapi import APIRouter, Depends, status

from acpp.core.exceptions import PublishingJobNotFoundError
from acpp.dependencies.services import get_publishing_service
from acpp.schemas.publishing import (
    PublishingJobStatusResponse,
    PublishingRequest,
    PublishingResponse,
)
from acpp.services.publishing_service import PublishingService

router = APIRouter(tags=["Publishing Agent"])


@router.post(
    "/publishing/publish",
    response_model=PublishingResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Publish Content Package",
    description="Trigger Publishing Agent (ACPP-AG-06) to verify Phase 37 AEGS Human Approval Token and dispatch content package to target channel.",
)
def publish_content(
    payload: PublishingRequest,
    service: PublishingService = Depends(get_publishing_service),
) -> PublishingResponse:
    """
    Dispatch verified content package to external CMS or Social media channel.
    """
    return service.publish_content(payload)


@router.get(
    "/publishing/status/{job_id}",
    response_model=PublishingJobStatusResponse,
    summary="Get Publishing Job Status",
    description="Retrieve execution status, metrics, and timestamps of a publishing dispatch workflow job.",
)
def get_publishing_job_status(
    job_id: str,
    service: PublishingService = Depends(get_publishing_service),
) -> PublishingJobStatusResponse:
    """
    Query workflow execution record status by job ID.
    """
    status_res = service.get_job_status(job_id)
    if not status_res:
        raise PublishingJobNotFoundError(job_id)
    return status_res
