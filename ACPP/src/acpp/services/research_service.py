"""
Research Service Layer
======================
Service orchestrating Research Agent execution, local raw asset file persistence,
and database workflow execution logging.
"""

import json
import logging
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from sqlalchemy.orm import Session

from acpp.agents.research_agent import ResearchAgent
from acpp.config.settings import get_settings
from acpp.models.workflow_history import WorkflowHistory
from acpp.repositories.workflow_repository import WorkflowRepository
from acpp.schemas.research import (
    ResearchIngestRequest,
    ResearchIngestResponse,
    ResearchJobStatusResponse,
)

logger = logging.getLogger("acpp.services.research")


class ResearchService:
    """
    Business logic service for Research Agent operations.
    """

    def __init__(self, db_session: Session) -> None:
        self.db = db_session
        self.agent = ResearchAgent()
        self.workflow_repo = WorkflowRepository(db_session)
        self.settings = get_settings()

    def ingest_research(self, request: ResearchIngestRequest) -> ResearchIngestResponse:
        """
        Execute research ingestion, write payload file to repository/raw/,
        and record workflow history.
        """
        start_time = time.time()
        start_dt = datetime.now(timezone.utc)

        timestamp_str = start_dt.strftime("%Y%m%d%H%M%S")
        job_id = f"WF-RES-{timestamp_str}"

        logger.info(f"[ResearchService] Initiating job {job_id} for query='{request.query}'")

        # 1. Execute agent research pipeline
        payload = self.agent.execute_ingestion(request)

        raw_asset_id = payload["raw_asset_id"]
        items_count = payload["items_count"]
        credibility_avg = payload["average_credibility"]
        sha256_provenance_hash = payload["aggregate_sha256_provenance"]

        # 2. Persist JSON payload to repository/raw/YYYY/MM/
        now_utc = datetime.now(timezone.utc)
        year_str = now_utc.strftime("%Y")
        month_str = now_utc.strftime("%m")

        raw_dir = Path(self.settings.raw_dir) / year_str / month_str
        raw_dir.mkdir(parents=True, exist_ok=True)

        filename = f"{raw_asset_id}.json"
        full_file_path = raw_dir / filename
        relative_payload_path = f"repository/raw/{year_str}/{month_str}/{filename}"

        with open(full_file_path, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)

        # 3. Create workflow execution record in database
        end_dt = datetime.now(timezone.utc)
        wf_record = WorkflowHistory(
            workflow_run_id=job_id,
            workflow_name="RESEARCH_INGEST",
            tenant_id="default",
            current_state="INGESTED",
            status="COMPLETED",
            input_payload=request.model_dump_json(),
            output_payload=json.dumps({
                "job_id": job_id,
                "raw_asset_id": raw_asset_id,
                "payload_path": relative_payload_path,
                "sha256_provenance_hash": sha256_provenance_hash,
                "items_count": items_count,
                "credibility_avg": credibility_avg,
            }),
            started_at=start_dt,
            completed_at=end_dt,
        )
        self.workflow_repo.create(wf_record)

        logger.info(f"[ResearchService] Successfully completed job {job_id}, saved payload to {relative_payload_path}")

        return ResearchIngestResponse(
            job_id=job_id,
            status="COMPLETED",
            raw_asset_id=raw_asset_id,
            payload_path=relative_payload_path,
            sha256_provenance_hash=sha256_provenance_hash,
            items_count=items_count,
            credibility_avg=credibility_avg,
            created_at=end_dt,
        )

    def get_job_status(self, job_id: str) -> Optional[ResearchJobStatusResponse]:
        """
        Query workflow job execution status by ID.
        """
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

        return ResearchJobStatusResponse(
            job_id=record.workflow_run_id,
            agent_id=ResearchAgent.AGENT_ID,
            status=record.status,
            metrics=metrics,
            error_message=record.error_message,
            execution_time_ms=exec_time_ms,
        )
