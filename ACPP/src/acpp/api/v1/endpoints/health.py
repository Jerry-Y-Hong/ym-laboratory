"""
Health Endpoint Router
=======================
Defines GET /health system status endpoint.
"""

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from acpp.config.settings import get_settings
from acpp.dependencies.database import get_db_session
from acpp.schemas.health import HealthCheckResponse

router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    response_model=HealthCheckResponse,
    summary="Application Health Check",
    description="Returns platform operational status, version, environment, and database connectivity.",
)
def get_health(session: Session = Depends(get_db_session)) -> HealthCheckResponse:
    settings = get_settings()
    db_status = "DISCONNECTED"

    try:
        session.execute(text("SELECT 1"))
        db_status = "CONNECTED"
    except Exception:
        db_status = "ERROR"

    return HealthCheckResponse(
        status="HEALTHY" if db_status == "CONNECTED" else "DEGRADED",
        version="v3.1.0",
        environment=settings.acpp_env.value if hasattr(settings.acpp_env, "value") else str(settings.acpp_env),
        database_status=db_status,
        details={
            "tenant_id": settings.acpp_tenant_id,
            "host": settings.host,
            "port": settings.port,
        },
    )
