"""
Research Agent Endpoints
========================
REST API routes for Research Agent (ACPP-AG-01) ingestion & status tracking.
"""

from fastapi import APIRouter, Depends, status

from acpp.core.exceptions import ResearchJobNotFoundError
from acpp.dependencies.services import get_research_service
from acpp.schemas.research import (
    ResearchIngestRequest,
    ResearchIngestResponse,
    ResearchJobStatusResponse,
)
from acpp.services.research_service import ResearchService

router = APIRouter(tags=["Research Agent"])


@router.post(
    "/research/ingest",
    response_model=ResearchIngestResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Ingest Research Payload",
    description="Trigger Research Agent (ACPP-AG-01) to gather research, score source credibility, compute SHA-256 provenance hash, and persist raw payload.",
)
def ingest_research(
    payload: ResearchIngestRequest,
    service: ResearchService = Depends(get_research_service),
) -> ResearchIngestResponse:
    """
    Ingest research topic/seed URL and generate raw research payload.
    """
    return service.ingest_research(payload)


@router.get(
    "/research/status/{job_id}",
    response_model=ResearchJobStatusResponse,
    summary="Get Research Job Status",
    description="Retrieve execution status, metrics, and timestamps of a research ingestion workflow job.",
)
def get_research_job_status(
    job_id: str,
    service: ResearchService = Depends(get_research_service),
) -> ResearchJobStatusResponse:
    """
    Query workflow execution record status by job ID.
    """
    status_res = service.get_job_status(job_id)
    if not status_res:
        raise ResearchJobNotFoundError(job_id)
    return status_res

