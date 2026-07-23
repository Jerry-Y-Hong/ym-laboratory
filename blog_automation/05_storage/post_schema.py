"""
Blog Automation System — Phase 01
PostSchema: 포스트 상태 및 레코드 스키마 정의.
"""
from dataclasses import dataclass, field, asdict
from enum import Enum
from typing import Optional
import json


class PostStatus(Enum):
    DRAFT = "DRAFT"
    QUEUED = "QUEUED"
    PUBLISHED = "PUBLISHED"
    FAILED = "FAILED"


@dataclass
class PostRecord:
    """포스트 저장소 레코드."""
    post_id: str
    food_code: str
    food_name: str
    title: str
    filename: str
    seo_score: int
    status: PostStatus = PostStatus.DRAFT
    created_at: str = ""
    queued_at: Optional[str] = None
    published_at: Optional[str] = None
    failed_reason: Optional[str] = None
    retry_count: int = 0

    def to_dict(self) -> dict:
        d = asdict(self)
        d["status"] = self.status.value
        return d

    @classmethod
    def from_dict(cls, data: dict) -> "PostRecord":
        data = dict(data)
        data["status"] = PostStatus(data["status"])
        return cls(**data)

    def to_json(self) -> str:
        return json.dumps(self.to_dict(), ensure_ascii=False, indent=2)
