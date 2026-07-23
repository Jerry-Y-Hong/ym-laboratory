"""
SEO Agent Endpoints
===================
REST API routes for SEO Agent (ACPP-AG-04) metadata optimization & status tracking.
"""

from fastapi import APIRouter, Depends, status

from acpp.core.exceptions import SEOJobNotFoundError
from acpp.dependencies.services import get_seo_service
from acpp.schemas.seo import (
    SEOJobStatusResponse,
    SEOOptimizationRequest,
    SEOOptimizationResponse,
)
from acpp.services.seo_service import SEOService

router = APIRouter(tags=["SEO Agent"])


@router.post(
    "/seo/optimize",
    response_model=SEOOptimizationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Optimize Content for SEO & Discoverability",
    description="Trigger SEO Agent (ACPP-AG-04) to analyze readability, compute keyword density, and generate OpenGraph & Schema.org Article JSON-LD metadata.",
)
def optimize_content(
    payload: SEOOptimizationRequest,
    service: SEOService = Depends(get_seo_service),
) -> SEOOptimizationResponse:
    """
    Optimize content asset and generate structured SEO metadata package.
    """
    return service.optimize_content(payload)


@router.get(
    "/seo/status/{job_id}",
    response_model=SEOJobStatusResponse,
    summary="Get SEO Job Status",
    description="Retrieve execution status, metrics, and timestamps of an SEO optimization workflow job.",
)
def get_seo_job_status(
    job_id: str,
    service: SEOService = Depends(get_seo_service),
) -> SEOJobStatusResponse:
    """
    Query workflow execution record status by job ID.
    """
    status_res = service.get_job_status(job_id)
    if not status_res:
        raise SEOJobNotFoundError(job_id)
    return status_res
