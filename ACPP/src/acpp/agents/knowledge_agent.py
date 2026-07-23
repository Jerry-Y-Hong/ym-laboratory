"""
Knowledge Agent (ACPP-AG-02) Core Module
=========================================
Parses raw research payloads, extracts factual claims, assigns Q-Code indexes,
generates 1536-dimensional vector embeddings, and formats SSOT Knowledge Assets.
"""

import hashlib
import json
import logging
import math
from datetime import datetime, timezone
from typing import Any, Dict, List, Tuple

from acpp.schemas.knowledge_structuring import (
    KnowledgeClaim,
    KnowledgeStructureRequest,
)

logger = logging.getLogger("acpp.agents.knowledge")


class KnowledgeAgent:
    """
    Knowledge Agent (ACPP-AG-02)
    Structures raw research into SSOT Knowledge Assets with Q-Codes and Vector Embeddings.
    """

    AGENT_ID = "ACPP-AG-02"
    AGENT_NAME = "Knowledge Agent"
    EMBEDDING_DIM = 1536

    def __init__(self) -> None:
        self.logger = logger

    @staticmethod
    def generate_qcode(prefix: str, sequence_num: int = 1) -> str:
        """Generate formatted Q-Code identifier (e.g., Q-KIM-FERM-001)."""
        clean_prefix = prefix.strip().upper()
        if not clean_prefix.startswith("Q-"):
            clean_prefix = f"Q-{clean_prefix}"
        return f"{clean_prefix}-{sequence_num:03d}"

    @staticmethod
    def generate_vector_embedding(text: str, dim: int = 1536) -> List[float]:
        """
        Generate deterministic normalized float vector embedding (1536-dim).
        Simulates text-embedding-3-large embedding vector generation.
        """
        seed_hash = hashlib.sha256(text.encode("utf-8")).digest()
        raw_vector = []
        for i in range(dim):
            byte_val = seed_hash[i % len(seed_hash)]
            val = math.sin((byte_val + i) * 0.1)
            raw_vector.append(val)

        # Normalize vector to unit length
        magnitude = math.sqrt(sum(x * x for x in raw_vector))
        if magnitude == 0:
            return [0.0] * dim
        return [round(x / magnitude, 6) for x in raw_vector]

    def extract_claims(self, items: List[Dict[str, Any]]) -> List[KnowledgeClaim]:
        """Extract structured factual claims from raw research items."""
        claims = []
        for idx, item in enumerate(items, 1):
            title = item.get("title", f"Item {idx}")
            content = item.get("content", "")
            url = item.get("url")
            credibility = item.get("credibility_score", 0.8)

            claim_id = f"CLM-{idx:03d}"
            statement = f"{title}: {content[:120]}..." if len(content) > 120 else f"{title}: {content}"

            claims.append(
                KnowledgeClaim(
                    claim_id=claim_id,
                    statement=statement,
                    confidence_score=credibility,
                    citation_url=url,
                )
            )
        return claims

    def format_markdown(self, metadata: Dict[str, Any], claims: List[KnowledgeClaim], summary: str) -> str:
        """
        Format Knowledge Asset as Markdown with YAML frontmatter.
        """
        yaml_lines = [
            "---",
            f"asset_id: \"{metadata['asset_id']}\"",
            f"qcode: \"{metadata['qcode']}\"",
            f"domain_code: \"{metadata['domain_code']}\"",
            f"title: \"{metadata['title']}\"",
            f"author_agent_id: \"{self.AGENT_ID}\"",
            f"verification_score: {metadata['verification_score']}",
            f"created_at: \"{metadata['created_at']}\"",
            "security_level: \"PUBLIC\"",
            "---",
            "",
            f"# {metadata['title']}",
            "",
            "## Executive Summary",
            summary,
            "",
            "## Structured Claims & Empirical Evidence",
        ]

        for claim in claims:
            citation_str = f" ([Source]({claim.citation_url}))" if claim.citation_url else ""
            yaml_lines.append(
                f"- **[{claim.claim_id}]** {claim.statement} (Confidence: {claim.confidence_score}){citation_str}"
            )

        return "\n".join(yaml_lines)

    def execute_structuring(
        self, raw_payload: Dict[str, Any], request: KnowledgeStructureRequest
    ) -> Dict[str, Any]:
        """
        Execute raw research to structured SSOT knowledge asset conversion.
        """
        self.logger.info(f"[{self.AGENT_ID}] Structuring raw asset '{request.raw_asset_id}'")

        items = raw_payload.get("items", [])
        avg_credibility = raw_payload.get("average_credibility", 0.85)
        raw_query = raw_payload.get("query", "Domain Knowledge")

        title = request.title or f"Structured Synthesis of {raw_query}"
        qcode = self.generate_qcode(request.qcode_prefix, sequence_num=1)

        now_utc = datetime.now(timezone.utc)
        timestamp_str = now_utc.strftime("%Y%m%d%H%M%S")
        asset_id = f"KA-{request.domain_code.upper()}-{timestamp_str}"

        claims = self.extract_claims(items)
        summary = f"Synthesized knowledge asset based on {len(items)} empirical research sources for {raw_query}."
        vector = self.generate_vector_embedding(f"{title} {summary} {qcode}", dim=self.EMBEDDING_DIM)

        metadata = {
            "asset_id": asset_id,
            "qcode": qcode,
            "domain_code": request.domain_code,
            "title": title,
            "verification_score": avg_credibility,
            "created_at": now_utc.isoformat(),
        }

        markdown_content = self.format_markdown(metadata, claims, summary)

        json_payload = {
            "asset_id": asset_id,
            "qcode": qcode,
            "domain_code": request.domain_code,
            "title": title,
            "summary": summary,
            "verification_score": avg_credibility,
            "author_agent_id": self.AGENT_ID,
            "claims": [c.model_dump(mode="json") for c in claims],
            "embedding": vector,
            "created_at": now_utc.isoformat(),
        }

        return {
            "metadata": metadata,
            "markdown_content": markdown_content,
            "json_payload": json_payload,
            "claims_count": len(claims),
            "vector_dim": len(vector),
        }
