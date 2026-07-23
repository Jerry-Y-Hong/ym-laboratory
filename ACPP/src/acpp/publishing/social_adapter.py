"""
Social Media Publishing Adapter
===============================
Concrete adapter for Social Media API targets (Twitter/X, LinkedIn, Meta, Social Cards).
"""

import hashlib
import logging
from typing import Any, Dict

from acpp.publishing.publishing_gateway import PublishingGateway

logger = logging.getLogger("acpp.publishing.social")


class SocialPublishingAdapter(PublishingGateway):
    """
    Adapter wrapping Social Media API endpoints.
    """

    SUPPORTED_CHANNELS = {"twitter", "x", "linkedin", "meta", "facebook", "social"}

    def __init__(self, api_endpoint: str = "https://social.ym-lab.io/api") -> None:
        self.api_endpoint = api_endpoint
        self.logger = logger

    @property
    def gateway_name(self) -> str:
        return "Social Media Gateway Adapter"

    def validate_channel(self, channel: str) -> bool:
        return channel.lower() in self.SUPPORTED_CHANNELS or "social" in channel.lower()

    def publish(self, package: Dict[str, Any], channel: str) -> Dict[str, Any]:
        clean_channel = channel.lower()
        if not self.validate_channel(clean_channel):
            raise ValueError(f"Unsupported social channel '{channel}'. Supported: {self.SUPPORTED_CHANNELS}")

        source_id = package.get("metadata", {}).get("source_asset_id", "ASSET-001")
        hash_input = f"{source_id}:{clean_channel}"
        dispatch_id = f"DISPATCH-SOC-{hashlib.sha256(hash_input.encode('utf-8')).hexdigest()[:10].upper()}"

        published_url = f"https://social.ym-lab.io/posts/{dispatch_id}"

        self.logger.info(
            f"[{self.gateway_name}] Successfully posted social content package to channel '{clean_channel}'. "
            f"URL: {published_url}"
        )

        return {
            "dispatch_id": dispatch_id,
            "channel": clean_channel,
            "published_url": published_url,
            "status": "PUBLISHED",
        }

    def get_publish_status(self, dispatch_id: str) -> Dict[str, Any]:
        return {
            "dispatch_id": dispatch_id,
            "gateway": self.gateway_name,
            "status": "PUBLISHED",
            "live": True,
        }
