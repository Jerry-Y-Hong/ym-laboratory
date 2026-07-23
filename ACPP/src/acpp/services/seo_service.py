"""
SEO Service Layer
=================
Service orchestrating SEO Agent (ACPP-AG-04) execution,
persisting SEO metadata packages to repository/published/YYYY/MM/seo/,
and logging execution state to database.
"""

import json
import logging
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Optional

from sqlalchemy.orm import Session

from acpp.agents.seo_agent import SEOAgent
from acpp.config.settings import get_settings
from acpp.models.workflow_history import WorkflowHistory
from acpp.repositories.workflow_repository import WorkflowRepository
from acpp.schemas.seo import (
    SEOJobStatusResponse,
    SEOOptimizationRequest,
    SEOOptimizationResponse,
)

logger = logging.getLogger("acpp.services.seo")


class SEOService:
    """
    Business logic service for SEO Agent operations.
    """

    def __init__(self, db_session: Session) -> None:
        self.db = db_session
        self.agent = SEOAgent()
        self.workflow_repo = WorkflowRepository(db_session)
        self.settings = get_settings()

    def _load_content_asset_data(self, asset_id: str, raw_text: Optional[str]) -> Dict[str, Any]:
        """Attempt to load source content asset text or fallback to defaults."""
        pub_root = self.settings.published_dir
        matches = list(pub_root.glob(f"**/*{asset_id}*.*"))
        body_text = raw_text or ""
        title = f"Content Asset ({asset_id})"

        if matches:
            try:
                with open(matches[0], "r", encoding="utf-8") as f:
                    file_content = f.read()
                    if file_content.strip():
                        body_text = file_content
            except Exception as e:
                logger.warning(f"Failed to read published asset file {matches[0]}: {e}")

        if not body_text:
            body_text = (
                f"Comprehensive empirical report for {asset_id}. "
                f"Detailed research investigation covering fermentation kinetics, "
                f"microbial population dynamics, and temperature curve optimizations."
            )

        return {
            "title": title,
            "body": body_text,
        }

    def optimize_content(self, request: SEOOptimizationRequest) -> SEOOptimizationResponse:
        """
        Execute SEO optimization pipeline, save SEO package to repository/published/YYYY/MM/seo/,
        and record workflow history in database.
        """
        start_time = time.time()
        start_dt = datetime.now(timezone.utc)

        timestamp_str = start_dt.strftime("%Y%m%d%H%M%S")
        job_id = f"WF-SEO-{timestamp_str}"

        logger.info(
            f"[SEOService] Initiating job {job_id} for content asset '{request.content_asset_id}' / Q-Code '{request.q_code}'"
        )

        content_data = self._load_content_asset_data(request.content_asset_id, request.raw_text)
        opt_result = self.agent.optimize_content(content_data, request)

        optimized_asset_id = opt_result["optimized_asset_id"]
        seo_metadata = opt_result["metadata"]
        seo_score = opt_result["seo_score"]
        readability_score = opt_result["readability_score"]

        # Persist SEO package JSON to repository/published/YYYY/MM/seo/
        pub_root = self.settings.published_dir
        year_str = start_dt.strftime("%Y")
        month_str = start_dt.strftime("%m")

        seo_dir = pub_root / year_str / month_str / "seo"
        seo_dir.mkdir(parents=True, exist_ok=True)

        filename = f"{optimized_asset_id}.json"
        full_file_path = seo_dir / filename

        seo_payload = {
            "job_id": job_id,
            "optimized_asset_id": optimized_asset_id,
            "source_content_asset_id": request.content_asset_id,
            "q_code": request.q_code,
            "seo_score": seo_score,
            "readability_score": readability_score,
            "readability_details": opt_result["readability_details"],
            "keyword_details": opt_result["keyword_details"],
            "metadata": seo_metadata.model_dump(mode="json"),
            "published_at": start_dt.isoformat(),
        }

        with open(full_file_path, "w", encoding="utf-8") as f:
            json.dump(seo_payload, f, ensure_ascii=False, indent=2)

        relative_seo_path = f"repository/published/{year_str}/{month_str}/seo/{filename}"

        # Record WorkflowHistory
        end_dt = datetime.now(timezone.utc)
        wf_record = WorkflowHistory(
            workflow_run_id=job_id,
            workflow_name="SEO_OPTIMIZATION",
            tenant_id="default",
            current_state="SEO_OPTIMIZED",
            status="COMPLETED",
            input_payload=request.model_dump_json(),
            output_payload=json.dumps({
                "job_id": job_id,
                "optimized_asset_id": optimized_asset_id,
                "seo_score": seo_score,
                "readability_score": readability_score,
                "seo_path": relative_seo_path,
            }),
            started_at=start_dt,
            completed_at=end_dt,
        )
        self.workflow_repo.create(wf_record)

        logger.info(f"[SEOService] SEO optimization complete for job {job_id}. Score: {seo_score}")

        return SEOOptimizationResponse(
            job_id=job_id,
            optimized_asset_id=optimized_asset_id,
            seo_score=seo_score,
            readability_score=readability_score,
            metadata=seo_metadata,
            optimization_status="COMPLETED",
            created_at=end_dt,
        )

    def get_job_status(self, job_id: str) -> Optional[SEOJobStatusResponse]:
        """Query workflow job status by run ID."""
        record = self.workflow_repo.get_by_id(job_id)
        if not record:
            return None

        exec_time_ms = 0.0
        if record.started_at and record.completed_at:
            exec_time_ms = round((record.completed_at - record.started_at).total_seconds() * 1000, 2)

        metrics = {}
        if record.output_payload:
            try:
                metrics = json.loads(record.output_payload)
            except Exception:
                pass

        return SEOJobStatusResponse(
            job_id=record.workflow_run_id,
            agent_id=SEOAgent.AGENT_ID,
            status=record.status,
            metrics=metrics,
            error_message=record.error_message,
            execution_time_ms=exec_time_ms,
        )
