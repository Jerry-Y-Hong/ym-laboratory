"""
SEO Agent (ACPP-AG-04) Core Module
===================================
Optimizes content assets for search engine discoverability, Flesch-Kincaid readability,
OpenGraph tags, and Schema.org Article JSON-LD structured data under ADF v3.1.
Strictly preserves source Q-Code references and source lineage.
"""

import logging
import re
from datetime import datetime, timezone
from typing import Any, Dict, List

from acpp.schemas.seo import SEOMetadata, SEOOptimizationRequest

logger = logging.getLogger("acpp.agents.seo")


class SEOAgent:
    """
    SEO Agent (ACPP-AG-04)
    Analyzes readability, keyword density, and generates structured metadata & JSON-LD schema.
    """

    AGENT_ID = "ACPP-AG-04"
    AGENT_NAME = "SEO Agent"
    VERSION = "v1.0.0"

    def __init__(self) -> None:
        self.logger = logger

    @staticmethod
    def _count_syllables_word(word: str) -> int:
        """Estimate syllable count in an English word."""
        word = word.lower().strip()
        if not word:
            return 1
        if len(word) <= 3:
            return 1
        word = re.sub(r'(?:[^laeiouy]|ed|es|e)$', '', word)
        word = re.sub(r'^y', '', word)
        syllables = len(re.findall(r'[aeiouy]{1,2}', word))
        return max(syllables, 1)

    def calculate_readability_score(self, content_text: str) -> Dict[str, Any]:
        """
        Calculate Flesch Reading Ease score, average sentence length, and word complexity.
        Flesch Reading Ease = 206.835 - (1.015 * ASL) - (84.6 * ASW)
        """
        if not content_text or not content_text.strip():
            return {
                "flesch_score": 70.0,
                "total_words": 0,
                "total_sentences": 1,
                "avg_sentence_length": 0.0,
                "avg_syllables_per_word": 1.0,
            }

        # Clean text
        clean_text = re.sub(r'#+|[*_`>-]', ' ', content_text)
        sentences = [s.strip() for s in re.split(r'[.!?]+', clean_text) if s.strip()]
        words = [w.strip() for w in re.findall(r'\b[a-zA-Z0-9]+\b', clean_text) if w.strip()]

        num_sentences = max(len(sentences), 1)
        num_words = max(len(words), 1)

        total_syllables = sum(self._count_syllables_word(w) for w in words)

        asl = num_words / num_sentences
        asw = total_syllables / num_words

        flesch_score = 206.835 - (1.015 * asl) - (84.6 * asw)
        clamped_score = min(max(round(flesch_score, 2), 0.0), 100.0)

        return {
            "flesch_score": clamped_score,
            "total_words": num_words,
            "total_sentences": num_sentences,
            "avg_sentence_length": round(asl, 2),
            "avg_syllables_per_word": round(asw, 2),
        }

    def analyze_keywords(self, content_text: str, target_keywords: List[str]) -> Dict[str, Any]:
        """Analyze primary/secondary keyword frequency and density."""
        text_lower = content_text.lower()
        words = re.findall(r'\b[a-zA-Z0-9-]+\b', text_lower)
        total_words = max(len(words), 1)

        keyword_counts = {}
        for kw in target_keywords:
            kw_clean = kw.lower().strip()
            count = len(re.findall(r'\b' + re.escape(kw_clean) + r'\b', text_lower))
            density = round((count / total_words) * 100, 2)
            keyword_counts[kw] = {"count": count, "density_percent": density}

        primary_kw = target_keywords[0] if target_keywords else "general"

        return {
            "primary_keyword": primary_kw,
            "keyword_metrics": keyword_counts,
            "total_words": total_words,
        }

    def generate_meta_description(self, content_text: str, max_length: int = 160) -> str:
        """Extract clean executive meta description under max length."""
        clean_text = re.sub(r'#+|[*_`>-]', ' ', content_text)
        clean_text = ' '.join(clean_text.split())
        if len(clean_text) <= max_length:
            return clean_text
        truncated = clean_text[:max_length - 3]
        return truncated.rsplit(' ', 1)[0] + "..."

    def generate_title_optimization(self, title: str, target_keywords: List[str]) -> str:
        """Optimize SEO title tag with primary target keyword."""
        clean_title = title.strip()
        if target_keywords:
            primary_kw = target_keywords[0].title()
            if primary_kw.lower() not in clean_title.lower():
                return f"{clean_title} | {primary_kw} Guide"
        return f"{clean_title} | ACPP Platform"

    def generate_open_graph_metadata(
        self, title: str, description: str, url: str
    ) -> Dict[str, Any]:
        """Generate OpenGraph protocol tags."""
        return {
            "og:title": title,
            "og:description": description,
            "og:type": "article",
            "og:url": url,
            "og:site_name": "AI Content Production Platform (ACPP)",
            "og:locale": "en_US",
        }

    def generate_json_ld_schema(
        self, title: str, description: str, keywords: List[str], q_code: str, source_id: str
    ) -> Dict[str, Any]:
        """Generate Schema.org Article JSON-LD structured data."""
        now_iso = datetime.now(timezone.utc).isoformat()
        return {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "description": description,
            "author": {
                "@type": "Organization",
                "name": "YM-LAB ACPP Micro-Agent Engine",
                "identifier": self.AGENT_ID,
            },
            "publisher": {
                "@type": "Organization",
                "name": "YM-LAB",
            },
            "keywords": keywords,
            "identifier": q_code,
            "citation": f"urn:acpp:knowledge:{source_id}",
            "datePublished": now_iso,
            "dateModified": now_iso,
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": f"https://acpp.ym-lab.io/assets/{source_id}",
            },
        }

    def optimize_content(
        self, content_asset: Dict[str, Any], request: SEOOptimizationRequest
    ) -> Dict[str, Any]:
        """
        Main SEO pipeline entrypoint.
        Processes content, calculates scores, builds metadata and Schema.org JSON-LD.
        """
        self.logger.info(
            f"[{self.AGENT_ID}] Optimizing content for asset '{request.content_asset_id}' / Q-Code '{request.q_code}'"
        )

        title = content_asset.get("title", "Structured Content Asset")
        body_text = content_asset.get("body") or request.raw_text or title

        target_kws = request.target_keywords or ["knowledge", "fermentation", "research"]

        readability_data = self.calculate_readability_score(body_text)
        kw_data = self.analyze_keywords(body_text, target_kws)

        seo_title = self.generate_title_optimization(title, target_kws)
        meta_desc = self.generate_meta_description(body_text, max_length=160)
        canonical_url = f"https://acpp.ym-lab.io/content/{request.content_asset_id}"

        og_data = self.generate_open_graph_metadata(seo_title, meta_desc, canonical_url)
        json_ld_data = self.generate_json_ld_schema(
            seo_title, meta_desc, target_kws, request.q_code, request.content_asset_id
        )

        # Calculate overall SEO composite score (0 - 100)
        readability_score = readability_data["flesch_score"]
        kw_density_score = min(sum(v["count"] for v in kw_data["keyword_metrics"].values()) * 10, 40.0)
        seo_composite_score = round(min(max(readability_score * 0.6 + kw_density_score + 20.0, 0.0), 100.0), 2)

        seo_metadata = SEOMetadata(
            title=seo_title,
            meta_description=meta_desc,
            keywords=target_kws,
            canonical_url=canonical_url,
            open_graph=og_data,
            json_ld=json_ld_data,
        )

        now_utc = datetime.now(timezone.utc)
        timestamp_str = now_utc.strftime("%Y%m%d%H%M%S")
        optimized_asset_id = f"SEO-{request.content_asset_id.replace('KA-', '').replace('RAW-', '')}-{timestamp_str}"

        return {
            "optimized_asset_id": optimized_asset_id,
            "seo_score": seo_composite_score,
            "readability_score": readability_score,
            "readability_details": readability_data,
            "keyword_details": kw_data,
            "metadata": seo_metadata,
            "optimized_body": body_text,
        }
