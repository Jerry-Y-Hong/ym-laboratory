"""
Blog Automation System — Phase 01
ContentGenerator: 김치 데이터 기반 블로그 포스트 초안 자동 생성기.

Platform Architecture 준수:
- AI Engine은 100_PLATFORM/130_AI_ENGINE/interface.py Mock 인터페이스를 사용한다.
- 실제 LLM 연동은 Post-MVP (Backlog 등록).
"""
import uuid
import logging
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Optional

logger = logging.getLogger("blog_automation.content_generator")


@dataclass
class BlogRequest:
    """블로그 포스트 생성 요청 데이터."""
    food_code: str
    food_name: str
    category: str
    target_keyword: str
    ingredients: list[str] = field(default_factory=list)
    nutrition: dict = field(default_factory=dict)
    recipe_steps: list[str] = field(default_factory=list)
    extra_context: str = ""


@dataclass
class BlogDraft:
    """생성된 블로그 포스트 초안."""
    post_id: str
    food_code: str
    title: str
    summary: str
    body: str
    nutrition_table: str
    cta_footer: str
    target_keyword: str
    created_at: str


class ContentGenerator:
    """
    김치 도메인 블로그 콘텐츠 자동 생성기.

    외부 LLM API 없이 동작하는 Rule-based Mock 생성기.
    실제 LLM 연동은 Post-MVP.
    """

    CTA_FOOTER_TEMPLATE = (
        "\n---\n\n"
        "## 🌿 더 알아보기\n\n"
        "YM-LAB의 **Q-Code 온톨로지 기반 약선 영양 지식 엔진**이 추천하는 {food_name} 관련 콘텐츠를 만나보세요.\n\n"
        "- 📌 관련 레시피 탐색하기\n"
        "- 📌 영양 성분 심층 분석\n"
        "- 📌 계절별 김치 추천 받기\n\n"
        "> *본 콘텐츠는 YM-LAB Blog Automation System v1.0이 자동 생성한 초안입니다.*\n"
    )

    def generate(self, request: BlogRequest) -> BlogDraft:
        """BlogRequest를 받아 BlogDraft를 반환한다."""
        post_id = str(uuid.uuid4())
        created_at = datetime.now(timezone.utc).isoformat()

        title = self._generate_title(request)
        summary = self._generate_summary(request)
        body = self._generate_body(request)
        nutrition_table = self._generate_nutrition_table(request)
        cta_footer = self.CTA_FOOTER_TEMPLATE.format(food_name=request.food_name)

        draft = BlogDraft(
            post_id=post_id,
            food_code=request.food_code,
            title=title,
            summary=summary,
            body=body,
            nutrition_table=nutrition_table,
            cta_footer=cta_footer,
            target_keyword=request.target_keyword,
            created_at=created_at,
        )
        logger.info(f"[ContentGenerator] Draft generated: post_id={post_id}, food_code={request.food_code}")
        return draft

    # ──────────────────────────────────────────────────────────────
    # Private helpers
    # ──────────────────────────────────────────────────────────────

    def _generate_title(self, req: BlogRequest) -> str:
        """SEO 타겟 키워드를 포함한 H1 제목을 생성한다."""
        if req.target_keyword and req.target_keyword not in req.food_name:
            return f"{req.food_name} 완벽 가이드: {req.target_keyword}부터 만드는 법까지"
        return f"{req.food_name} 완벽 가이드: 효능, 영양, 레시피 총정리"

    def _generate_summary(self, req: BlogRequest) -> str:
        """Executive Summary (150~200자)를 생성한다."""
        ingredient_preview = "·".join(req.ingredients[:3]) if req.ingredients else "신선한 재료"
        summary = (
            f"{req.food_name}은(는) 한국의 대표적인 {req.category} 식품입니다. "
            f"{ingredient_preview} 등 엄선된 재료로 만드는 {req.food_name}은(는) "
            f"풍부한 영양소와 유산균이 가득하여 건강한 식생활에 이상적입니다. "
            f"이 글에서는 {req.food_name}의 핵심 영양 정보와 만드는 법을 상세히 알아봅니다."
        )
        return summary

    def _generate_body(self, req: BlogRequest) -> str:
        """Main Body (H2/H3 구조, Markdown)를 생성한다."""
        sections = []

        # Section 1: 소개
        sections.append(f"## {req.food_name}이란?\n\n")
        sections.append(
            f"{req.food_name}은(는) 한국 전통 {req.category} 식품으로, "
            f"수백 년의 역사를 자랑합니다. "
            f"특유의 발효 과정을 통해 생성되는 유산균과 풍부한 비타민이 "
            f"현대인의 건강 관리에 큰 도움을 줍니다.\n\n"
        )
        if req.extra_context:
            sections.append(f"{req.extra_context}\n\n")

        # Section 2: 재료
        if req.ingredients:
            sections.append(f"## {req.food_name} 주요 재료\n\n")
            for ing in req.ingredients:
                sections.append(f"- **{ing}**\n")
            sections.append("\n")

        # Section 3: 레시피
        if req.recipe_steps:
            sections.append(f"## {req.food_name} 만드는 법\n\n")
            for i, step in enumerate(req.recipe_steps, 1):
                sections.append(f"### Step {i}\n\n{step}\n\n")

        # Section 4: 효능 요약
        sections.append(f"## {req.food_name}의 주요 효능\n\n")
        sections.append(
            f"- 🦠 **장 건강**: 풍부한 유산균으로 장내 미생물 균형을 유지합니다.\n"
            f"- 🛡️ **면역 강화**: 비타민 C와 항산화 성분이 면역 기능을 지원합니다.\n"
            f"- 🌿 **항염 효과**: 마늘·생강 등 천연 재료의 항균 성분이 포함되어 있습니다.\n"
            f"- ⚖️ **체중 관리**: 저칼로리 고섬유질 식품으로 포만감을 높여줍니다.\n\n"
        )

        return "".join(sections)

    def _generate_nutrition_table(self, req: BlogRequest) -> str:
        """Q-Code 영양 테이블 (Markdown)을 생성한다."""
        header = (
            f"## {req.food_name} 영양 성분표 (Q-Code 기준)\n\n"
            "| 영양소 | 함량 (100g 기준) | 비고 |\n"
            "| :--- | :--- | :--- |\n"
        )
        rows = []
        if req.nutrition:
            for nutrient, value in req.nutrition.items():
                rows.append(f"| {nutrient} | {value} | - |\n")
        else:
            # 기본값 (배추김치 기준 추정치)
            rows = [
                "| 에너지 | 18 kcal | |\n",
                "| 단백질 | 1.5 g | |\n",
                "| 지방 | 0.5 g | |\n",
                "| 탄수화물 | 3.6 g | |\n",
                "| 식이섬유 | 2.4 g | |\n",
                "| 비타민 C | 15.8 mg | |\n",
                "| 나트륨 | 498 mg | |\n",
                "| 유산균 | ≥ 10⁸ CFU/g | 발효 단계에 따라 다름 |\n",
            ]

        footer = (
            "\n> *영양 데이터 출처: YM-LAB Q-Code 온톨로지 지식 엔진 v1.0*\n"
        )
        return header + "".join(rows) + footer
