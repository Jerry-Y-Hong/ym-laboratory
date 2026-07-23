"""
Image Agent Endpoints
====================
REST API routes for Image Agent (ACPP-AG-05) visual asset synthesis & status tracking.
"""

from fastapi import APIRouter, Depends, status

from acpp.core.exceptions import ImageJobNotFoundError
from acpp.dependencies.services import get_image_service
from acpp.schemas.image import (
    ImageGenerationRequest,
    ImageGenerationResponse,
    ImageJobStatusResponse,
)
from acpp.services.image_service import ImageService

router = APIRouter(tags=["Image Agent"])


@router.post(
    "/image/generate",
    response_model=ImageGenerationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Generate Visual Assets & Media Manifest",
    description="Trigger Image Agent (ACPP-AG-05) to synthesize visual prompts, invoke Image Engine Gateway (DALL-E 3), and build complete media manifest package.",
)
def generate_image(
    payload: ImageGenerationRequest,
    service: ImageService = Depends(get_image_service),
) -> ImageGenerationResponse:
    """
    Generate visual media assets for content.
    """
    return service.generate_image(payload)


@router.get(
    "/image/status/{job_id}",
    response_model=ImageJobStatusResponse,
    summary="Get Image Job Status",
    description="Retrieve execution status, metrics, and timestamps of an image synthesis workflow job.",
)
def get_image_job_status(
    job_id: str,
    service: ImageService = Depends(get_image_service),
) -> ImageJobStatusResponse:
    """
    Query workflow execution record status by job ID.
    """
    status_res = service.get_job_status(job_id)
    if not status_res:
        raise ImageJobNotFoundError(job_id)
    return status_res
