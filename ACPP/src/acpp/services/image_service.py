"""
Image Service Layer
===================
Service orchestrating Image Agent (ACPP-AG-05) execution, invoking Image Engine Gateway,
persisting Media Manifests & image metadata to repository/media/YYYY/MM/,
and logging execution state to database.
"""

import json
import logging
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Optional

from sqlalchemy.orm import Session

from acpp.agents.image_agent import ImageAgent
from acpp.config.settings import get_settings
from acpp.image_engine.dalle_adapter import DalleImageAdapter
from acpp.image_engine.image_engine_gateway import ImageEngineGateway
from acpp.models.workflow_history import WorkflowHistory
from acpp.repositories.workflow_repository import WorkflowRepository
from acpp.schemas.image import (
    ImageGenerationRequest,
    ImageGenerationResponse,
    ImageJobStatusResponse,
)

logger = logging.getLogger("acpp.services.image")


class ImageService:
    """
    Business logic service for Image Agent operations.
    """

    def __init__(
        self, db_session: Session, gateway: Optional[ImageEngineGateway] = None
    ) -> None:
        self.db = db_session
        self.gateway = gateway or DalleImageAdapter()
        self.agent = ImageAgent(gateway=self.gateway)
        self.workflow_repo = WorkflowRepository(db_session)
        self.settings = get_settings()

    def _load_content_asset_data(self, asset_id: str) -> Dict[str, Any]:
        """Attempt to load source content asset metadata from published/structured repositories."""
        pub_root = self.settings.published_dir
        matches = list(pub_root.glob(f"**/*{asset_id}*.*"))
        title = f"Visual Asset for {asset_id}"
        summary = "Empirical research content."

        if matches:
            try:
                with open(matches[0], "r", encoding="utf-8") as f:
                    file_text = f.read()
                    lines = [line.strip() for line in file_text.splitlines() if line.strip()]
                    if lines:
                        title = lines[0].replace("#", "").strip()
                    if len(lines) > 1:
                        summary = " ".join(lines[1:4])
            except Exception as e:
                logger.warning(f"Failed to read asset file {matches[0]}: {e}")

        return {
            "title": title,
            "summary": summary,
        }

    def generate_image(self, request: ImageGenerationRequest) -> ImageGenerationResponse:
        """
        Execute visual prompt synthesis and image gateway generation,
        save media manifest & image records to repository/media/YYYY/MM/,
        and record workflow execution in database.
        """
        start_time = time.time()
        start_dt = datetime.now(timezone.utc)

        timestamp_str = start_dt.strftime("%Y%m%d%H%M%S")
        job_id = f"WF-IMG-{timestamp_str}"

        logger.info(
            f"[ImageService] Initiating job {job_id} for content asset '{request.content_asset_id}' / Q-Code '{request.q_code}'"
        )

        content_data = self._load_content_asset_data(request.content_asset_id)
        primary_asset, manifest = self.agent.generate_visual_asset(content_data, request)

        # Persist media manifest JSON to repository/media/YYYY/MM/manifests/
        repo_root = Path(self.settings.repository_root)
        year_str = start_dt.strftime("%Y")
        month_str = start_dt.strftime("%m")

        media_base = repo_root / "media" / year_str / month_str
        manifests_dir = media_base / "manifests"
        images_dir = media_base / "images"
        manifests_dir.mkdir(parents=True, exist_ok=True)
        images_dir.mkdir(parents=True, exist_ok=True)

        manifest_file = manifests_dir / f"manifest_{primary_asset.asset_id}.json"
        manifest_payload = manifest.model_dump(mode="json")

        with open(manifest_file, "w", encoding="utf-8") as f:
            json.dump(manifest_payload, f, ensure_ascii=False, indent=2)

        relative_manifest_path = f"repository/media/{year_str}/{month_str}/manifests/manifest_{primary_asset.asset_id}.json"

        # Record WorkflowHistory
        end_dt = datetime.now(timezone.utc)
        wf_record = WorkflowHistory(
            workflow_run_id=job_id,
            workflow_name="IMAGE_SYNTHESIS",
            tenant_id="default",
            current_state="MEDIA_GENERATED",
            status="COMPLETED",
            input_payload=request.model_dump_json(),
            output_payload=json.dumps({
                "job_id": job_id,
                "image_asset_id": primary_asset.asset_id,
                "engine": primary_asset.engine,
                "manifest_path": relative_manifest_path,
                "total_media_count": len(manifest.images) + len(manifest.thumbnails) + len(manifest.social_variants),
            }),
            started_at=start_dt,
            completed_at=end_dt,
        )
        self.workflow_repo.create(wf_record)

        logger.info(f"[ImageService] Visual asset generation complete for job {job_id}. ID: {primary_asset.asset_id}")

        return ImageGenerationResponse(
            job_id=job_id,
            image_asset_id=primary_asset.asset_id,
            prompt=primary_asset.prompt,
            generation_status="COMPLETED",
            image_metadata=primary_asset,
            media_manifest=manifest,
        )

    def get_job_status(self, job_id: str) -> Optional[ImageJobStatusResponse]:
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

        return ImageJobStatusResponse(
            job_id=record.workflow_run_id,
            agent_id=ImageAgent.AGENT_ID,
            status=record.status,
            metrics=metrics,
            error_message=record.error_message,
            execution_time_ms=exec_time_ms,
        )
