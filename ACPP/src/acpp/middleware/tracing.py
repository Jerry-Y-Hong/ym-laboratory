"""
Tracing Middleware
===================
Propagates X-Request-ID and X-Correlation-ID across HTTP request lifecycles.
"""

import uuid
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response


class TracingMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        request_id = request.headers.get("X-Request-ID") or f"req-{uuid.uuid4().hex[:12]}"
        correlation_id = request.headers.get("X-Correlation-ID") or f"corr-{uuid.uuid4().hex[:12]}"

        request.state.request_id = request_id
        request.state.correlation_id = correlation_id

        response = await call_next(request)

        response.headers["X-Request-ID"] = request_id
        response.headers["X-Correlation-ID"] = correlation_id
        return response
