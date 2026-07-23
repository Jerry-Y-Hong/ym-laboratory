"""
ACPP FastAPI Application Main Entrypoint
========================================
Initializes FastAPI application, loads configurations, registers middleware,
configures global exception handlers, and mounts API routers under ADF v3.1.
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from acpp.api.v1.router import api_router
from acpp.config.logging import configure_logging
from acpp.config.settings import get_settings
from acpp.core.exceptions import ACPPException
from acpp.db.init_db import init_db
from acpp.middleware.security import AAOSSecurityMiddleware
from acpp.middleware.tracing import TracingMiddleware
from acpp.schemas.common import APIErrorDetail, APIErrorResponse


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application startup and shutdown lifespan handler."""
    settings = get_settings()
    configure_logging()

    # Automatic database schema initialization on startup
    init_db()

    yield


def create_application() -> FastAPI:
    """FastAPI Application Factory."""
    settings = get_settings()

    app = FastAPI(
        title="AI Content Production Platform (ACPP)",
        description="Enterprise REST API Gateway & Micro-Agent Engine under ADF v3.1 Standards",
        version="3.1.0",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # ── Register Middleware ──────────────────────────────────────────
    app.add_middleware(TracingMiddleware)
    app.add_middleware(AAOSSecurityMiddleware)

    # ── Exception Handlers ───────────────────────────────────────────
    @app.exception_handler(ACPPException)
    async def acpp_exception_handler(request: Request, exc: ACPPException) -> JSONResponse:
        error_payload = APIErrorResponse(
            error=APIErrorDetail(
                code=exc.code,
                message=exc.message,
                details=exc.details,
            )
        )
        return JSONResponse(
            status_code=exc.status_code,
            content=error_payload.model_dump(),
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        error_payload = APIErrorResponse(
            error=APIErrorDetail(
                code="ACPP-ERR-4001",
                message="Invalid payload structure or validation error.",
                details={"errors": exc.errors()},
            )
        )
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content=error_payload.model_dump(),
        )

    @app.exception_handler(SQLAlchemyError)
    async def sqlalchemy_exception_handler(
        request: Request, exc: SQLAlchemyError
    ) -> JSONResponse:
        error_payload = APIErrorResponse(
            error=APIErrorDetail(
                code="ACPP-ERR-5000",
                message="Database execution error.",
                details={"error_type": exc.__class__.__name__},
            )
        )
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=error_payload.model_dump(),
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(
        request: Request, exc: Exception
    ) -> JSONResponse:
        error_payload = APIErrorResponse(
            error=APIErrorDetail(
                code="ACPP-ERR-5000",
                message="Unhandled internal runtime exception.",
                details={"detail": str(exc)},
            )
        )
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=error_payload.model_dump(),
        )

    # ── Register Routers ─────────────────────────────────────────────
    # Mount router both at root level and under /api/v1 prefix
    app.include_router(api_router, prefix="/api/v1")
    app.include_router(api_router)

    return app


app = create_application()
