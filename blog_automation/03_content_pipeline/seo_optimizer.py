"""
Blog Automation System — Phase 01
SEOOptimizer: 블로그 포스트 초안의 SEO 지표 분석 및 최적화.

SEO 점수 100점 만점:
  - 타겟 키워드 제목 포함: +20
  - 키워드 밀도 1.0~2.0%: +20
  - 메타 디스크립션 생성 가능: +15
  - 본문 400자 이상: +15
  - H2 소제목 2개 이상: +15
  - 영양 테이블 존재: +15
"""
import re
import logging
from dataclasses import dataclass, field
from .content_generator import BlogDraft

logger = logging.getLogger("blog_automation.seo_optimizer")

SEO_PUBLISHABLE_THRESHOLD = 70


@dataclass
class SEOResult:
    """SEO 분석 결과."""
    post_id: str
    seo_score: int
    keyword_density: float
    meta_title: str
    meta_description: str
    title_has_keyword: bool
    h2_count: int
    body_char_count: int
    has_nutrition_table: bool
    issues: list[str] = field(default_factory=list)
    is_publishable: bool = False

    def __post_init__(self):
        self.is_publishable = self.seo_score >= SEO_PUBLISHABLE_THRESHOLD


class SEOOptimizer:
    """SEO 지표 분석 및 메타 태그 생성."""

    META_TITLE_MAX = 60
    META_DESC_MAX = 160
    KEYWORD_DENSITY_MIN = 1.0
    KEYWORD_DENSITY_MAX = 2.0
    BODY_MIN_CHARS = 400
    H2_MIN_COUNT = 2

    def analyze(self, draft: BlogDraft) -> SEOResult:
        """BlogDraft를 분석하여 SEOResult를 반환한다."""
        issues: list[str] = []
        score = 0

        full_text = " ".join([draft.title, draft.summary, draft.body])
        keyword = draft.target_keyword

        # 1. 타겟 키워드 제목 포함 (+20)
        title_has_keyword = keyword.lower() in draft.title.lower()
        if title_has_keyword:
            score += 20
        else:
            issues.append(f"제목에 타겟 키워드 '{keyword}'가 없습니다.")

        # 2. 키워드 밀도 (+20)
        keyword_density = self._calc_keyword_density(full_text, keyword)
        if self.KEYWORD_DENSITY_MIN <= keyword_density <= self.KEYWORD_DENSITY_MAX:
            score += 20
        elif keyword_density < self.KEYWORD_DENSITY_MIN:
            issues.append(f"키워드 밀도 부족: {keyword_density:.2f}% (최소 {self.KEYWORD_DENSITY_MIN}%)")
        else:
            issues.append(f"키워드 밀도 과다: {keyword_density:.2f}% (최대 {self.KEYWORD_DENSITY_MAX}%)")

        # 3. 메타 디스크립션 (+15)
        meta_description = self._generate_meta_description(draft.summary)
        if meta_description:
            score += 15
        else:
            issues.append("메타 디스크립션을 생성할 수 없습니다.")

        # 4. 본문 길이 (+15)
        body_char_count = len(draft.body.replace(" ", ""))
        if body_char_count >= self.BODY_MIN_CHARS:
            score += 15
        else:
            issues.append(f"본문 길이 부족: {body_char_count}자 (최소 {self.BODY_MIN_CHARS}자)")

        # 5. H2 소제목 수 (+15)
        h2_count = len(re.findall(r"^## .+", draft.body, re.MULTILINE))
        if h2_count >= self.H2_MIN_COUNT:
            score += 15
        else:
            issues.append(f"H2 소제목 부족: {h2_count}개 (최소 {self.H2_MIN_COUNT}개)")

        # 6. 영양 테이블 존재 (+15)
        has_nutrition_table = "영양 성분표" in draft.nutrition_table or "|" in draft.nutrition_table
        if has_nutrition_table:
            score += 15
        else:
            issues.append("Q-Code 영양 테이블이 없습니다.")

        meta_title = self._generate_meta_title(draft.title)

        result = SEOResult(
            post_id=draft.post_id,
            seo_score=score,
            keyword_density=round(keyword_density, 2),
            meta_title=meta_title,
            meta_description=meta_description,
            title_has_keyword=title_has_keyword,
            h2_count=h2_count,
            body_char_count=body_char_count,
            has_nutrition_table=has_nutrition_table,
            issues=issues,
        )

        logger.info(
            f"[SEOOptimizer] post_id={draft.post_id} | "
            f"score={score} | density={keyword_density:.2f}% | "
            f"publishable={result.is_publishable}"
        )
        if issues:
            logger.warning(f"[SEOOptimizer] issues={issues}")

        return result

    # ──────────────────────────────────────────────────────────────
    # Private helpers
    # ──────────────────────────────────────────────────────────────

    def _calc_keyword_density(self, text: str, keyword: str) -> float:
        """텍스트에서 키워드 밀도(%)를 계산한다."""
        if not keyword or not text:
            return 0.0
        clean_text = re.sub(r"[^\w\s]", "", text)
        words = clean_text.split()
        if not words:
            return 0.0
        keyword_lower = keyword.lower()
        keyword_count = sum(1 for w in words if keyword_lower in w.lower())
        return (keyword_count / len(words)) * 100

    def _generate_meta_title(self, title: str) -> str:
        """메타 타이틀을 60자 이내로 생성한다."""
        clean = re.sub(r"#+\s*", "", title).strip()
        return clean[:self.META_TITLE_MAX]

    def _generate_meta_description(self, summary: str) -> str:
        """메타 디스크립션을 160자 이내로 생성한다."""
        clean = summary.strip().replace("\n", " ")
        return clean[:self.META_DESC_MAX]
