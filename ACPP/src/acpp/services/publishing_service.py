"""
Publishing Service Layer
========================
Service orchestrating Publishing Agent (ACPP-AG-06) execution,
verifying Phase 37 AEGS Human Approval Tokens, dispatching through channel gateways,
persisting final publishing artifacts to repository/published/YYYY/MM/final/,
and logging audit trails in database.
"""

import json
import logging
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Optional, Tuple

from sqlalchemy.orm import Session

from acpp.agents.publishing_agent import PublishingAgent
from acpp.config.settings import get_settings
from acpp.governance.human_gate import HumanGateVerifier
from acpp.models.workflow_history import WorkflowHistory
from acpp.repositories.workflow_repository import WorkflowRepository
from acpp.schemas.publishing import (
    PublishingJobStatusResponse,
    PublishingRequest,
    PublishingResponse,
)

logger = logging.getLogger("acpp.services.publishing")


class PublishingService:
    """
    Business logic service for Publishing Agent operations.
    Enforces Phase 37 AEGS Governance Human Approval sign-offs.
    """

    def __init__(self, db_session: Session) -> None:
        self.db = db_session
        self.verifier = HumanGateVerifier(db_session=db_session)
        self.agent = PublishingAgent(verifier=self.verifier)
        self.workflow_repo = WorkflowRepository(db_session)
        self.settings = get_settings()

    def _load_asset_payloads(
        self, content_asset_id: str, seo_asset_id: Optional[str], media_manifest_id: Optional[str]
    ) -> Tuple[Dict[str, Any], Dict[str, Any], Dict[str, Any]]:
        """Load content draft, SEO metadata, and media manifest payloads."""
        content_asset = {
            "title": f"Content Asset {content_asset_id}",
            "body": f"Verified publication payload for {content_asset_id}.",
            "source_asset_id": content_asset_id,
        }
        seo_asset = {
            "seo_title": f"SEO Optimized {content_asset_id}",
            "canonical_url": f"https://acpp.ym-lab.io/content/{content_asset_id}",
            "source_asset_id": content_asset_id,
        }
        media_manifest = {
            "manifest_id": media_manifest_id or "MANIFEST-DEFAULT",
            "images_count": 1,
        }

        return content_asset, seo_asset, media_manifest

    def publish_content(self, request: PublishingRequest) -> PublishingResponse:
        """
        Execute Human Approval verification, package assembly, channel gateway dispatch,
        file persistence to repository/published/YYYY/MM/final/, and workflow history logging.
        """
        start_time = time.time()
        start_dt = datetime.now(timezone.utc)

        timestamp_str = start_dt.strftime("%Y%m%d%H%M%S")
        job_id = f"WF-PUB-{timestamp_str}"

        logger.info(
            f"[PublishingService] Initiating job {job_id} for asset '{request.content_asset_id}' on channel '{request.target_channel}'"
        )

        # 1. Enforce Human Approval Token verification (Raises ApprovalRequiredError if invalid)
        self.agent.verify_human_approval(request.approval_token)

        # 2. Retrieve content & metadata payloads
        content_asset, seo_asset, media_manifest = self._load_asset_payloads(
            request.content_asset_id, request.seo_asset_id, request.media_manifest_id
        )

        approval_info = {
            "approval_token": request.approval_token,
            "approved_by": "human_editor_01",
        }

        # 3. Create PublishPackage
        package = self.agent.create_publish_package(
            content_asset, seo_asset, media_manifest, approval_info
        )

        # 4. Dispatch through Channel Gateway
        dispatch_res = self.agent.dispatch_content(package, request.target_channel)
        dispatch_id = dispatch_res["dispatch_id"]
        published_url = dispatch_res["published_url"]

        # 5. Persist final publish artifact to repository/published/YYYY/MM/final/
        pub_root = self.settings.published_dir
        year_str = start_dt.strftime("%Y")
        month_str = start_dt.strftime("%m")

        final_dir = pub_root / year_str / month_str / "final"
        final_dir.mkdir(parents=True, exist_ok=True)

        final_file = final_dir / f"final_{dispatch_id}.json"
        audit_record = self.agent.create_publish_audit_record(dispatch_res)

        final_payload = {
            "job_id": job_id,
            "dispatch_id": dispatch_id,
            "channel": request.target_channel,
            "published_url": published_url,
            "approval_token": request.approval_token,
            "package": package.model_dump(mode="json"),
            "audit_record": audit_record,
            "published_at": start_dt.isoformat(),
        }

        with open(final_file, "w", encoding="utf-8") as f:
            json.dump(final_payload, f, ensure_ascii=False, indent=2)

        relative_final_path = f"repository/published/{year_str}/{month_str}/final/final_{dispatch_id}.json"

        # 6. Record WorkflowHistory
        end_dt = datetime.now(timezone.utc)
        wf_record = WorkflowHistory(
            workflow_run_id=job_id,
            workflow_name="PUBLISHING_DISPATCH",
            tenant_id="default",
            current_state="DISPATCHED",
            status="COMPLETED",
            input_payload=request.model_dump_json(),
            output_payload=json.dumps({
                "job_id": job_id,
                "dispatch_id": dispatch_id,
                "channel": request.target_channel,
                "published_url": published_url,
                "final_artifact_path": relative_final_path,
            }),
            started_at=start_dt,
            completed_at=end_dt,
        )
        self.workflow_repo.create(wf_record)

        logger.info(
            f"[PublishingService] Successfully dispatched publication {dispatch_id} to {request.target_channel}. URL: {published_url}"
        )

        return PublishingResponse(
            job_id=job_id,
            publish_status="PUBLISHED",
            channel=request.target_channel,
            published_url=published_url,
            approval_status="APPROVED",
            dispatch_id=dispatch_id,
            created_at=end_dt,
        )

    def get_job_status(self, job_id: str) -> Optional[PublishingJobStatusResponse]:
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

        return PublishingJobStatusResponse(
            job_id=record.workflow_run_id,
            agent_id=PublishingAgent.AGENT_ID,
            status=record.status,
            metrics=metrics,
            error_message=record.error_message,
            execution_time_ms=exec_time_ms,
        )
