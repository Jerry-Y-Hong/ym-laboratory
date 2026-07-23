"""
Publishing Gateway Interface
============================
Abstract Base Class defining the vendor-neutral contract for channel publishing gateways.
"""

from abc import ABC, abstractmethod
from typing import Any, Dict


class PublishingGateway(ABC):
    """
    Vendor-neutral interface for external publishing channels (CMS, Social, Newsletters).
    """

    @property
    @abstractmethod
    def gateway_name(self) -> str:
        """Return gateway provider name."""
        pass

    @abstractmethod
    def validate_channel(self, channel: str) -> bool:
        """Validate whether channel identifier is supported by gateway."""
        pass

    @abstractmethod
    def publish(self, package: Dict[str, Any], channel: str) -> Dict[str, Any]:
        """
        Execute dispatch call to target publishing channel.
        Returns normalized dispatch result dict:
        {
          "dispatch_id": str,
          "channel": str,
          "published_url": str,
          "status": str
        }
        """
        pass

    @abstractmethod
    def get_publish_status(self, dispatch_id: str) -> Dict[str, Any]:
        """Query dispatch status."""
        pass
