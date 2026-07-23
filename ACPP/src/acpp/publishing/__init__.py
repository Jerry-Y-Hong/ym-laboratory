"""
Publishing Channel Gateway Abstraction Layer
==============================================
Provides vendor-neutral interface for CMS and Social channel publishing adapters.
"""

from acpp.publishing.cms_adapter import CMSPublishingAdapter
from acpp.publishing.publishing_gateway import PublishingGateway
from acpp.publishing.social_adapter import SocialPublishingAdapter

__all__ = ["PublishingGateway", "CMSPublishingAdapter", "SocialPublishingAdapter"]
