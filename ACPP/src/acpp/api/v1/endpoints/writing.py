"""
Writing Agent Endpoints
=======================
REST API routes for Writing Agent (ACPP-AG-03) content generation & status tracking.
"""

from fastapi import APIRouter, Depends, status

from acpp.core.exceptions import WritingJobNotFoundError
from acpp.dependencies.services import get_writing_service
from acpp.schemas.writing import (
    WritingJobStatusResponse,
    WritingRequest,
    WritingResponse,
)
from acpp.services.writing_service import WritingService

router = APIRouter(tags=["Writing Agent"])


@router.post(
    "/writing/generate",
    response_model=WritingResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Generate Multi-Channel Content Package",
    description="Trigger Writing Agent (ACPP-AG-03) to transform a Structured Knowledge Asset into multi-channel content drafts (Blog, HTML, Newsletter, Social, Technical Brief).",
)
def generate_content(
    payload: WritingRequest,
    service: WritingService = Depends(get_writing_service),
) -> WritingResponse:
    """
    Generate multi-channel content assets for a Knowledge Asset.
    """
    return service.generate_content(payload)


@router.get(
    "/writing/status/{job_id}",
    response_model=WritingJobStatusResponse,
    summary="Get Writing Job Status",
    description="Retrieve execution status, metrics, and timestamps of a content generation workflow job.",
)
def get_writing_job_status(
    job_id: str,
    service: WritingService = Depends(get_writing_service),
) -> WritingJobStatusResponse:
    """
    Query workflow execution record status by job ID.
    """
    status_res = service.get_job_status(job_id)
    if not status_res:
        raise WritingJobNotFoundError(job_id)
    return status_res
