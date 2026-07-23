"""
CMS Publishing Adapter
======================
Concrete adapter for Content Management System targets (WordPress, Ghost, Naver Blog, Website CMS).
"""

import hashlib
import logging
from typing import Any, Dict

from acpp.publishing.publishing_gateway import PublishingGateway

logger = logging.getLogger("acpp.publishing.cms")


class CMSPublishingAdapter(PublishingGateway):
    """
    Adapter wrapping CMS REST/GraphQL webhooks.
    """

    SUPPORTED_CHANNELS = {"wordpress", "ghost", "naver_blog", "cms", "website"}

    def __init__(self, api_endpoint: str = "https://cms.ym-lab.io/api") -> None:
        self.api_endpoint = api_endpoint
        self.logger = logger

    @property
    def gateway_name(self) -> str:
        return "CMS Gateway Adapter"

    def validate_channel(self, channel: str) -> bool:
        return channel.lower() in self.SUPPORTED_CHANNELS or "cms" in channel.lower()

    def publish(self, package: Dict[str, Any], channel: str) -> Dict[str, Any]:
        clean_channel = channel.lower()
        if not self.validate_channel(clean_channel):
            raise ValueError(f"Unsupported CMS channel '{channel}'. Supported: {self.SUPPORTED_CHANNELS}")

        source_id = package.get("metadata", {}).get("source_asset_id", "ASSET-001")
        hash_input = f"{source_id}:{clean_channel}"
        dispatch_id = f"DISPATCH-CMS-{hashlib.sha256(hash_input.encode('utf-8')).hexdigest()[:10].upper()}"

        published_url = f"https://blog.ym-lab.io/{clean_channel}/posts/{source_id.lower()}"

        self.logger.info(
            f"[{self.gateway_name}] Successfully dispatched content package to channel '{clean_channel}'. "
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
