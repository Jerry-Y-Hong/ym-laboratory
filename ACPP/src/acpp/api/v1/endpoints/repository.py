"""
Repository Endpoint Router
===========================
Defines GET /repository/status endpoint.
"""

from fastapi import APIRouter, Depends

from acpp.dependencies.services import get_repository_service
from acpp.schemas.repository import RepositoryStatusResponse
from acpp.services.repository_service import RepositoryService

router = APIRouter(tags=["Repository"])


@router.get(
    "/repository/status",
    response_model=RepositoryStatusResponse,
    summary="Repository Status Check",
    description="Retrieve operational status of the Knowledge Repository, database connection state, and storage stats.",
)
def get_repository_status(
    service: RepositoryService = Depends(get_repository_service),
) -> RepositoryStatusResponse:
    status_data = service.get_status()
    return RepositoryStatusResponse.model_validate(status_data)
