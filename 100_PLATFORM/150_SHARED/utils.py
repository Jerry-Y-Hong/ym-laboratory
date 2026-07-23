"""
Common Utilities for Platform Layer (Hashing, Timestamps, Formatting)
"""
import hashlib
import json
from datetime import datetime, timezone
from typing import Any, Dict

def calculate_hash(data: Any) -> str:
    """Calculates SHA-256 hash of arbitrary string or JSON data for payload integrity verification."""
    if isinstance(data, (dict, list)):
        serialized = json.dumps(data, sort_keys=True, ensure_ascii=False)
    else:
        serialized = str(data)
    return hashlib.sha256(serialized.encode('utf-8')).hexdigest()

def get_utc_now_iso() -> str:
    """Returns current UTC timestamp in ISO 8601 format."""
    return datetime.now(timezone.utc).isoformat()

def sanitize_raw_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Ensures raw payload is serializable and preserves raw structure."""
    if not isinstance(payload, dict):
        return {"raw_content": str(payload)}
    return payload
