import { useState, useMemo } from 'react';
import { RECIPES, KITS, FRANCHISE_BENEFITS } from '../data/mfcoData';

const JOIN_STEPS = [
  {
    num: '01',
    icon: '📞',
    title: '상담 신청',
    desc: '온라인 문의 또는 전화로 초기 상담을 신청하세요. 전담 매니저가 배치됩니다.',
  },
  {
    num: '02',
    icon: '✍️',
    title: '계약 체결',
    desc: '프렌차이즈 계약 후 가맹비 납부 및 입지 선정 컨설팅을 진행합니다.',
  },
  {
    num: '03',
    icon: '🚀',
    title: '교육 & 오픈',
    desc: '집중 교육 프로그램 이수 후 그랜드 오픈. 초기 마케팅을 본사가 지원합니다.',
  },
];

const COST_TABLE = [
  { item: '가맹비', amount: '₩10,000,000', note: '가맹 계약 체결 시 (현재 사전 예약 시 50% 감면)' },
  { item: '교육비', amount: '₩3,000,000', note: '본사 조리 및 체질 진단 시스템 기본 2주 교육 과정' },
  { item: '인테리어 비용', amount: '₩55,000,000', note: '평당 180만원 기준, 30평 매장 예시' },
  { item: '약선 초도 물품비', amount: '₩5,000,000', note: 'MFCO 5대 약선 추출 키트 및 포장재' },
  { item: '홍보 마케팅비', amount: '무상 지원', note: '오픈 3개월간 본사 온라인 타겟 마케팅 지원' },
];

const EXPERT_DIRECTORY = {
  '서울': [
    { type: '한의원', name: '경희강남약선한의원', doctor: '이재훈 원장', spec: '사상체질의학 & 약선 식단 처방 전문', tel: '02-543-XXXX', address: '서울 강남구 테헤란로 124', tags: ['체질 보정', '외용제 처방'] },
    { type: '전문가', name: '최경순 약선식료연구소', doctor: '최경순 소장', spec: '궁중 약선 요리 복원 및 프랜차이즈 레시피 컨설팅 30년', tel: '02-345-XXXX', address: '서울 서초구 서초중앙로 85', tags: ['레시피 감수', '메뉴 조리'] },
    { type: '인증기관', name: '한국한의학연구원(KIOM) 협력분석원', doctor: '김민우 박사', spec: '약선 식품 기능성 정량 분석 및 저염 약선 인증 공인 기관', tel: '02-868-XXXX', address: '서울 분원 & 대전 본원', tags: ['기능성 공인', '저염 인증'] }
  ],
  '경기': [
    { type: '한의원', name: '광교 웰니스동방한의원', doctor: '정혜인 원장', spec: '소화기 해독 및 다이어트 처방 전문', tel: '031-234-XXXX', address: '경기 수원시 영통구 광교중앙로', tags: ['비위 강화', '다이어트 처방'] },
    { type: '전문가', name: '한국약선조리협회 경기지부', doctor: '박명수 조리명인', spec: '대형 약선 가맹점 조리 실무 및 위생 가이드라인 정립', tel: '031-890-XXXX', address: '경기 성남시 분당구', tags: ['조리 교육', '운영 지도'] },
    { type: '인증기관', name: '경기 바이오식품 평가원', doctor: '최동현 센터장', spec: '유기농 한약재 및 약초 추출 성분 검사 대행', tel: '031-789-XXXX', address: '경기 수원시 영통구', tags: ['성분 검사', '친환경 매칭'] }
  ],
  '부산': [
    { type: '한의원', name: '해운대 한방바이오클리닉', doctor: '박건우 원장', spec: '피부 면역 및 아토피 외용고(외용제) 특화 처방', tel: '051-740-XXXX', address: '부산 해운대구 마린시티', tags: ['피부 활성', '외용제 제형'] },
    { type: '전문가', name: '부산약선연구회', doctor: '임선영 요리연구가', spec: '해조류 특화 약선 메뉴(톳국, 굴죽 등) 가맹 전파', tel: '051-550-XXXX', address: '부산 동래구', tags: ['해조류 메뉴', '가맹 전파'] },
    { type: '인증기관', name: '부산대학교 바이오의학 연구단', doctor: '강태석 박사', spec: '임상 영양 시험 및 동방의학 기반 식단 검증', tel: '051-510-XXXX', address: '부산 금정구 부산대학로', tags: ['임상 영양', '식단 검증'] }
  ],
  '인천': [
    { type: '한의원', name: '송도 동방성장한의원', doctor: '윤서진 원장', spec: '소아 면역 및 청소년 보조식품 맞춤 가이드', tel: '032-830-XXXX', address: '인천 연수구 송도동', tags: ['소아 면역', '보조제 매칭'] },
    { type: '전문가', name: '서해안 약초 협동조합', doctor: '장만복 이사장', spec: '인천/서해 지역 강천마, 삽주뿌리 정제 공급망', tel: '032-440-XXXX', address: '인천 중구', tags: ['산야초 공급', '천연 원물'] }
  ],
  '대구': [
    { type: '한의원', name: '대구 약령시 약선한의원', doctor: '최영호 원장', spec: '300년 전통 대구약령시 한약재 조제 및 맥파 처방', tel: '053-255-XXXX', address: '대구 중구 남성로 (약전골목)', tags: ['전통 조제', '맥파 처방'] },
    { type: '전문가', name: '대구약선요리 보존회', doctor: '김을순 명인', spec: '약령시 한약재 연동 정통 한방 소반 차림 연구', tel: '053-760-XXXX', address: '대구 수성구', tags: ['정통 소반', '약령시 연계'] }
  ]
};

const DEFAULT_EXPERTS = [
  { type: '한의원', name: 'MFCO 바이오 R&D 한의의원', doctor: '김민성 원장', spec: '사상체질 진단 및 약선 복합 시너지 처방', tel: '1588-XXXX', address: '전국 지정 협력망', tags: ['체질 진단', '약선 감수'] },
  { type: '전문가', name: '대한약선음식연구소', doctor: '이약선 소장', spec: '약선 프렌차이즈 시그니처 메뉴 감수 및 교육', tel: '02-123-XXXX', address: '서울 중구', tags: ['메뉴 교육', '창업 지도'] }
];

export default function Franchise() {
  const [formData, setFormData] = useState({
    name: '', phone: '', region: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  // --- Menu Startup Ideation Tool State ---
  const [filterConstitution, setFilterConstitution] = useState('ALL');
  const [filterBenefit, setFilterBenefit] = useState('ALL');
  const [filterMargin, setFilterMargin] = useState('ALL');
  const [filterDifficulty, setFilterDifficulty] = useState('ALL');
  const [filterTime, setFilterTime] = useState('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // Selected recipe detail modal state
  const [selectedMenuDetail, setSelectedMenuDetail] = useState(null);

  // Compute live properties for 1,000 recipes database
  const processedRecipes = useMemo(() => {
    return (RECIPES || []).map(r => {
      const hash = r.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      
      // Determine prices and margin based on id hash
      const salePrice = 12000 + (hash % 9) * 2000; // ₩12,000 ~ ₩28,000
      const costPrice = 3000 + (hash % 5) * 500;  // ₩3,000 ~ ₩5,000
      const margin = Math.round((1 - costPrice / salePrice) * 100);
      
      // Difficulty mapping
      const diffs = ['쉬움', '보통', '어려움'];
      const difficulty = diffs[hash % diffs.length];
      
      // Prep time mapping
      const times = [15, 30, 45, 60, 90];
      const prepTime = times[hash % times.length];
      
      // Target constitution
      let constitution = '공통';
      if (r.tags.includes('소음인')) constitution = '소음인';
      else if (r.tags.includes('소양인')) constitution = '소양인';
      else if (r.tags.includes('태음인')) constitution = '태음인';
      else if (r.tags.includes('태양인')) constitution = '태양인';
      
      // Target benefit based on kit
      let benefit = '기타 웰빙';
      if (r.kit === 'K01') benefit = '기력/피로회복';
      else if (r.kit === 'K02') benefit = '면역강화/혈행';
      else if (r.kit === 'K03') benefit = '해독/체중조절';
      else if (r.kit === 'K04') benefit = '항산화/생기';
      else if (r.kit === 'K05') benefit = '안심/진정';
      
      return {
        ...r,
        salePrice,
        costPrice,
        margin,
        difficulty,
        prepTime,
        constitution,
        benefit
      };
    });
  }, []);

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    return processedRecipes.filter(r => {
      // Keyword search
      if (searchKeyword && !r.name.toLowerCase().includes(searchKeyword.toLowerCase()) && !r.ingredients.toLowerCase().includes(searchKeyword.toLowerCase())) {
        return false;
      }
      // Constitution filter
      if (filterConstitution !== 'ALL' && r.constitution !== filterConstitution) {
        return false;
      }
      // Benefit filter
      if (filterBenefit !== 'ALL' && r.benefit !== filterBenefit) {
        return false;
      }
      // Margin filter
      if (filterMargin !== 'ALL') {
        const minMargin = parseInt(filterMargin);
        if (r.margin < minMargin) return false;
      }
      // Difficulty filter
      if (filterDifficulty !== 'ALL' && r.difficulty !== filterDifficulty) {
        return false;
      }
      // Prep Time filter
      if (filterTime !== 'ALL') {
        if (filterTime === '30' && r.prepTime > 30) return false;
        if (filterTime === '60' && r.prepTime > 60) return false;
      }
      return true;
    });
  }, [processedRecipes, searchKeyword, filterConstitution, filterBenefit, filterMargin, filterDifficulty, filterTime]);

  // Page index for search result (limit to 12 initially, with load more)
  const [visibleCount, setVisibleCount] = useState(6);
  const visibleRecipes = filteredRecipes.slice(0, visibleCount);

  // Region matched experts based on selected region in inquiry form
  const matchedExperts = useMemo(() => {
    if (!formData.region) return DEFAULT_EXPERTS;
    return EXPERT_DIRECTORY[formData.region] || DEFAULT_EXPERTS;
  }, [formData.region]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <style>{`
        .franchise-page {
          min-height: 100vh;
          padding-top: 100px;
          background: var(--bg-base);
          color: #fff;
        }

        /* HERO */
        .franchise-hero {
          position: relative;
          padding: 6rem 1.5rem 5rem;
          text-align: center;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 30%, rgba(248,113,113,0.05) 0%, transparent 50%);
        }
        .franchise-hero::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent);
        }
        .franchise-hero h1 {
          font-family: var(--font-serif);
          font-size: clamp(2.2rem, 6vw, 4.2rem);
          color: #fff;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }
        .franchise-hero h1 em {
          font-style: normal;
          background: linear-gradient(135deg, var(--neon-gold), #f5d78e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .franchise-hero p {
          color: rgba(255,255,255,0.65);
          font-size: 1.1rem;
          max-width: 650px;
          margin: 0 auto 3rem;
          line-height: 1.8;
        }
        .hero-stats-row {
          display: flex;
          gap: 3.5rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 3.5rem;
        }
        .hero-stat-item {
          text-align: center;
        }
        .hero-stat-value {
          font-family: var(--font-serif);
          font-size: 2rem;
          color: var(--neon-gold);
          display: block;
          font-weight: 700;
        }
        .hero-stat-label {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.45);
          margin-top: 0.3rem;
        }
        .prep-badge {
          display: inline-block;
          background: rgba(248,113,113,0.1);
          border: 1px solid rgba(248,113,113,0.25);
          border-radius: 50px;
          padding: 0.35rem 1rem;
          font-size: 0.75rem;
          color: #f87171;
          margin-bottom: 1.5rem;
        }

        /* SEARCH ENGINE SECTION */
        .ideator-section {
          padding: 6rem 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .ideator-box {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 1.5rem;
          padding: 2.5rem;
          margin-top: 3rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .ideator-filters {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
          margin-top: 1.5rem;
        }
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .filter-group label {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .filter-group select, .filter-group input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.5rem;
          padding: 0.7rem 0.9rem;
          color: #fff;
          font-size: 0.85rem;
          transition: all 0.2s;
        }
        .filter-group select:focus, .filter-group input:focus {
          outline: none;
          border-color: var(--neon-gold);
          background: rgba(255,255,255,0.08);
        }
        .filter-group select option {
          background: #0f0f12;
          color: #fff;
        }
        .keyword-search-bar {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .keyword-search-bar input {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          color: #fff;
          font-size: 0.9rem;
        }
        
        .results-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
          margin-bottom: 1.5rem;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
        }
        .results-summary strong {
          color: var(--neon-gold);
        }

        .ideator-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .ideator-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 1.25rem;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .ideator-card:hover {
          transform: translateY(-5px);
          border-color: rgba(201,168,76,0.3);
          background: rgba(255,255,255,0.05);
          box-shadow: 0 10px 25px rgba(201,168,76,0.05);
        }
        .ideator-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        .card-icon {
          font-size: 2.2rem;
          background: rgba(255,255,255,0.04);
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .margin-badge {
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.3);
          color: #10b981;
          font-size: 0.75rem;
          padding: 0.25rem 0.6rem;
          border-radius: 50px;
          font-weight: 600;
        }
        .card-body h3 {
          font-family: var(--font-serif);
          font-size: 1.2rem;
          color: #fff;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }
        .card-desc {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.6;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-bottom: 1.25rem;
        }
        .card-tag {
          font-size: 0.68rem;
          padding: 0.15rem 0.5rem;
          border-radius: 0.25rem;
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.6);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .card-tag.constitution {
          background: rgba(6,182,212,0.1);
          border-color: rgba(6,182,212,0.2);
          color: #06b6d4;
        }
        .card-tag.benefit {
          background: rgba(245,158,11,0.1);
          border-color: rgba(245,158,11,0.2);
          color: var(--neon-gold);
        }
        .card-pricing {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 1rem;
          margin-top: auto;
        }
        .price-label {
          color: rgba(255,255,255,0.4);
        }
        .price-val {
          color: #fff;
          font-weight: 600;
        }
        .card-action-btn {
          width: 100%;
          margin-top: 1rem;
          padding: 0.6rem 0;
          font-size: 0.8rem;
          text-align: center;
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.3);
          color: var(--neon-gold);
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .card-action-btn:hover {
          background: var(--neon-gold);
          color: #000;
          font-weight: 600;
        }

        .load-more-container {
          text-align: center;
          margin-top: 3rem;
        }

        /* MODAL DETAIL SHEET */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(5px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .modal-content {
          background: #121216;
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 1.5rem;
          max-width: 650px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
          padding: 2.5rem;
          position: relative;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }
        .modal-close {
          position: absolute;
          top: 1.5rem; right: 1.5rem;
          background: none; border: none;
          color: rgba(255,255,255,0.4);
          font-size: 1.5rem;
          cursor: pointer;
          transition: color 0.2s;
        }
        .modal-close:hover { color: #fff; }
        
        .modal-header-row {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding-bottom: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .modal-title-box h2 {
          font-family: var(--font-serif);
          font-size: 1.6rem;
          color: #fff;
          margin-bottom: 0.35rem;
        }
        
        .modal-specs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .modal-spec-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 0.75rem;
          padding: 0.85rem;
          text-align: center;
        }
        .modal-spec-lbl {
          font-size: 0.7rem;
          color: rgba(255,255,255,0.4);
          display: block;
          margin-bottom: 0.2rem;
        }
        .modal-spec-val {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--neon-gold);
        }
        .modal-spec-val.margin {
          color: #10b981;
        }

        .nutrition-bar-chart {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 0.75rem;
          padding: 1.25rem;
          margin-bottom: 1.5rem;
        }
        .nutrition-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
        }
        .nutrition-lbl { color: rgba(255,255,255,0.5); }
        .nutrition-val { color: #fff; font-weight: 600; }
        
        .formulation-tip-box {
          background: rgba(201,168,76,0.06);
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 0.75rem;
          padding: 1.25rem;
          font-size: 0.85rem;
          line-height: 1.6;
          color: rgba(255,255,255,0.8);
        }
        .formulation-tip-box strong {
          color: var(--neon-gold);
          display: block;
          margin-bottom: 0.4rem;
        }

        /* REGION MAPPER */
        .expert-directory-section {
          padding: 6rem 1.5rem;
          background: rgba(255,255,255,0.01);
          border-top: 1px solid rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .expert-directory-inner {
          max-width: 1000px;
          margin: 0 auto;
        }
        .expert-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-top: 2.5rem;
        }
        .expert-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 1.25rem;
          padding: 1.75rem;
          transition: all 0.2s;
        }
        .expert-card:hover {
          border-color: rgba(201,168,76,0.3);
          background: rgba(255,255,255,0.05);
        }
        .expert-type-badge {
          display: inline-block;
          font-size: 0.65rem;
          padding: 0.2rem 0.5rem;
          border-radius: 0.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }
        .expert-type-badge.한의원 {
          background: rgba(6,182,212,0.1);
          color: #06b6d4;
          border: 1px solid rgba(6,182,212,0.2);
        }
        .expert-type-badge.전문가 {
          background: rgba(139,92,246,0.1);
          color: #8b5cf6;
          border: 1px solid rgba(139,92,246,0.2);
        }
        .expert-type-badge.인증기관 {
          background: rgba(16,185,129,0.1);
          color: #10b981;
          border: 1px solid rgba(16,185,129,0.2);
        }
        .expert-name {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: #fff;
          margin-bottom: 0.25rem;
        }
        .expert-doctor {
          font-size: 0.85rem;
          color: var(--neon-gold);
          margin-bottom: 0.75rem;
          display: block;
        }
        .expert-spec {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.6;
          margin-bottom: 1rem;
          min-height: 2.8rem;
        }
        .expert-tel {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.35);
          display: block;
          margin-bottom: 0.2rem;
        }
        .expert-addr {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.35);
        }

        /* BENEFITS */
        .benefits-section {
          padding: 6rem 1.5rem;
          max-width: 1100px;
          margin: 0 auto;
        }
        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-top: 3rem;
        }
        .benefit-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 1.25rem;
          padding: 2rem 1.5rem;
          transition: all 0.3s ease;
        }
        .benefit-card:hover {
          background: rgba(255,255,255,0.07);
          transform: translateY(-4px);
          border-color: rgba(201,168,76,0.2);
        }
        .benefit-icon {
          font-size: 2.2rem;
          margin-bottom: 0.75rem;
          display: block;
        }
        .benefit-title {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          color: #fff;
          margin-bottom: 0.5rem;
        }
        .benefit-desc {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.6;
        }

        /* JOIN TIMELINE */
        .join-section {
          padding: 6rem 1.5rem;
          background: rgba(255,255,255,0.02);
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .join-inner {
          max-width: 900px;
          margin: 0 auto;
        }
        .timeline {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-top: 3rem;
          position: relative;
        }
        .timeline::before {
          content: '';
          position: absolute;
          top: 2.5rem;
          left: 16.67%;
          right: 16.67%;
          height: 2px;
          background: linear-gradient(90deg, var(--neon-gold), rgba(201,168,76,0.3), var(--neon-gold));
          opacity: 0.4;
        }
        .timeline-item {
          text-align: center;
          position: relative;
        }
        .timeline-circle {
          width: 5rem;
          height: 5rem;
          background: rgba(201,168,76,0.1);
          border: 2px solid rgba(201,168,76,0.3);
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
          position: relative;
          z-index: 1;
          transition: all 0.3s;
        }
        .timeline-item:hover .timeline-circle {
          background: rgba(201,168,76,0.2);
          border-color: var(--neon-gold);
          box-shadow: 0 0 20px rgba(201,168,76,0.2);
        }
        .timeline-step-num {
          font-size: 0.65rem;
          color: var(--neon-gold);
          opacity: 0.7;
          letter-spacing: 0.1em;
        }
        .timeline-icon { font-size: 1.5rem; }
        .timeline-title {
          font-family: var(--font-serif);
          font-size: 1.15rem;
          color: #fff;
          margin-bottom: 0.5rem;
        }
        .timeline-desc {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.6;
        }

        /* COST TABLE */
        .cost-section {
          padding: 6rem 1.5rem;
          background: rgba(255,255,255,0.02);
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .cost-inner {
          max-width: 800px;
          margin: 0 auto;
        }
        .cost-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 2rem;
          font-size: 0.9rem;
        }
        .cost-table thead th {
          padding: 0.75rem 1.25rem;
          text-align: left;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.08em;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .cost-table tbody tr {
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: background 0.2s;
        }
        .cost-table tbody tr:hover {
          background: rgba(255,255,255,0.03);
        }
        .cost-table tbody td {
          padding: 1rem 1.25rem;
          color: rgba(255,255,255,0.75);
        }
        .cost-table tbody td:first-child { color: #fff; font-weight: 500; }
        .cost-table tbody td:nth-child(2) { color: var(--neon-gold); }
        .cost-table tbody td:last-child {
          color: rgba(255,255,255,0.4);
          font-size: 0.8rem;
        }
        .cost-note {
          margin-top: 1.25rem;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.3);
          line-height: 1.6;
        }

        /* INQUIRY FORM */
        .inquiry-section {
          padding: 6rem 1.5rem;
          max-width: 700px;
          margin: 0 auto;
        }
        .inquiry-title {
          font-family: var(--font-serif);
          font-size: 2.2rem;
          color: #fff;
          margin-bottom: 0.75rem;
          text-align: center;
        }
        .inquiry-sub {
          color: rgba(255,255,255,0.45);
          text-align: center;
          margin-bottom: 2.5rem;
          font-size: 0.9rem;
          line-height: 1.6;
        }
        .inquiry-form {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }
        .iform-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .iform-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .iform-field label {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.5);
        }
        .iform-field input,
        .iform-field select,
        .iform-field textarea {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          color: #fff;
          font-size: 0.9rem;
          font-family: var(--font-sans);
          transition: border-color 0.2s;
        }
        .iform-field input:focus,
        .iform-field select:focus,
        .iform-field textarea:focus {
          outline: none;
          border-color: rgba(201,168,76,0.4);
        }
        .iform-field select option { background: #0f0f12; }
        .iform-field textarea { resize: vertical; min-height: 110px; }
        .prep-notice {
          background: rgba(248,113,113,0.06);
          border: 1px solid rgba(248,113,113,0.2);
          border-radius: 1rem;
          padding: 1.25rem 1.5rem;
          text-align: center;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
          margin-top: 2rem;
        }
        .prep-notice strong { color: #f87171; }
        .submit-success-fr {
          background: rgba(201,168,76,0.08);
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 1rem;
          padding: 2.5rem;
          text-align: center;
          color: var(--neon-gold);
          font-size: 0.95rem;
          line-height: 1.7;
          border-color: var(--neon-gold);
        }

        @media (max-width: 992px) {
          .ideator-filters { grid-template-columns: repeat(3, 1fr); }
          .ideator-grid { grid-template-columns: repeat(2, 1fr); }
          .expert-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .benefits-grid { grid-template-columns: 1fr 1fr; }
          .timeline { grid-template-columns: 1fr; }
          .timeline::before { display: none; }
          .iform-row { grid-template-columns: 1fr; }
          .hero-stats-row { gap: 1.5rem; }
          .ideator-filters { grid-template-columns: 1fr 1fr; }
          .ideator-box { padding: 1.5rem; }
        }
        @media (max-width: 600px) {
          .ideator-grid { grid-template-columns: 1fr; }
          .expert-grid { grid-template-columns: 1fr; }
          .ideator-filters { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .benefits-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="franchise-page">
        {/* HERO */}
        <div className="franchise-hero">
          <div className="prep-badge">🔔 현재 가맹점 모집 준비 중</div>
          <h1>
            MFCO <em>프렌차이즈</em><br />
            파트너가 되세요
          </h1>
          <p>
            1,000종 한방 약선 레시피 데이터베이스와 실시간 AI 체질 진단기 탑재.<br />
            동방의학의 과학화를 통한 차세대 건강 웰빙 F&B 시장을 선점하십시오.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#ideator" className="btn btn-primary">창업 메뉴 설계기</a>
            <a href="#inquiry" className="btn btn-outline">가맹 사전 예약</a>
          </div>
          <div className="hero-stats-row">
            <div className="hero-stat-item">
              <span className="hero-stat-value">준비중</span>
              <div className="hero-stat-label">가맹점 수</div>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-value">65% ~ 85%</span>
              <div className="hero-stat-label">평균 마진율</div>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-value">1,000종</span>
              <div className="hero-stat-label">탑재 약선 레시피</div>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-value">7개국</span>
              <div className="hero-stat-label">글로벌 교육 & 다국어</div>
            </div>
          </div>
        </div>

        {/* 1. MENU STARTUP IDEATION TOOL */}
        <div className="ideator-section" id="ideator">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div className="section-tag">Menu Startup Ideation Tool</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#fff', marginBottom: '0.5rem' }}>
              약선 창업 메뉴 아이디어 검색기
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem', maxWidth: '650px', margin: '0 auto' }}>
              MFCO 1,000종 마스터 레시피에서 예상 마진율, 조리 난이도, 타겟 체질 및 효능 필터를 조합하여 최적의 가맹점 시그니처 메뉴를 기획해 보세요.
            </p>
          </div>

          <div className="ideator-box">
            {/* Keyword Search */}
            <div className="keyword-search-bar">
              <input 
                type="text" 
                placeholder="식재료 또는 요리명 검색 (예: 톳, 장어, 인삼, 전복, 죽...)" 
                value={searchKeyword}
                onChange={e => {
                  setSearchKeyword(e.target.value);
                  setVisibleCount(6);
                }}
              />
            </div>

            {/* Filter grid */}
            <div className="ideator-filters">
              <div className="filter-group">
                <label>타겟 체질</label>
                <select value={filterConstitution} onChange={e => { setFilterConstitution(e.target.value); setVisibleCount(6); }}>
                  <option value="ALL">전체 체질</option>
                  <option value="소음인">소음인 (소화기 허약)</option>
                  <option value="소양인">소양인 (신장 기능 보강)</option>
                  <option value="태음인">태음인 (호흡기/기관지)</option>
                  <option value="태양인">태양인 (간 해독 강화)</option>
                  <option value="공통">공통체질 (조화 식단)</option>
                </select>
              </div>

              <div className="filter-group">
                <label>타겟 효능</label>
                <select value={filterBenefit} onChange={e => { setFilterBenefit(e.target.value); setVisibleCount(6); }}>
                  <option value="ALL">전체 효능</option>
                  <option value="기력/피로회복">기력/피로회복 (K01)</option>
                  <option value="면역강화/혈행">면역강화/혈행 (K02)</option>
                  <option value="해독/체중조절">해독/체중조절 (K03)</option>
                  <option value="항산화/생기">항산화/생기 (K04)</option>
                  <option value="안심/진정">안심/진정 (K05)</option>
                </select>
              </div>

              <div className="filter-group">
                <label>목표 마진율</label>
                <select value={filterMargin} onChange={e => { setFilterMargin(e.target.value); setVisibleCount(6); }}>
                  <option value="ALL">전체 마진</option>
                  <option value="65">65% 이상</option>
                  <option value="75">75% 이상</option>
                  <option value="80">80% 이상</option>
                </select>
              </div>

              <div className="filter-group">
                <label>조리 난이도</label>
                <select value={filterDifficulty} onChange={e => { setFilterDifficulty(e.target.value); setVisibleCount(6); }}>
                  <option value="ALL">전체 난이도</option>
                  <option value="쉬움">쉬움</option>
                  <option value="보통">보통</option>
                  <option value="어려움">어려움</option>
                </select>
              </div>

              <div className="filter-group">
                <label>조리 시간</label>
                <select value={filterTime} onChange={e => { setFilterTime(e.target.value); setVisibleCount(6); }}>
                  <option value="ALL">전체 시간</option>
                  <option value="30">30분 이내</option>
                  <option value="60">60분 이내</option>
                </select>
              </div>
            </div>

            {/* Results count info */}
            <div className="results-summary">
              <div>
                총 <strong>{filteredRecipes.length}</strong>개의 창업 추천 메뉴 매칭됨
              </div>
              {filteredRecipes.length > 0 && (
                <div>
                  (상위 {Math.min(filteredRecipes.length, visibleCount)}개 출력 중)
                </div>
              )}
            </div>

            {/* Results Grid */}
            <div className="ideator-grid">
              {visibleRecipes.map((r, i) => (
                <div className="ideator-card" key={r.id + '-' + i}>
                  <div>
                    <div className="ideator-card-header">
                      <div className="card-icon">{r.icon}</div>
                      <span className="margin-badge">마진 {r.margin}%</span>
                    </div>
                    <div className="card-body">
                      <h3>{r.name}</h3>
                      <p className="card-desc">{r.description || `${r.name}은(는) ${r.ingredients}를 활용한 프리미엄 약선 메뉴입니다.`}</p>
                      
                      <div className="card-tags">
                        <span className="card-tag constitution">{r.constitution}</span>
                        <span className="card-tag benefit">{r.benefit}</span>
                        <span className="card-tag">{r.difficulty}</span>
                        <span className="card-tag">{r.prepTime}분</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="card-pricing">
                      <div>
                        <span className="price-label">원가: </span>
                        <span className="price-val">₩{r.costPrice.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="price-label">권장가: </span>
                        <span className="price-val" style={{ color: 'var(--neon-gold)' }}>
                          ₩{r.salePrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <button className="card-action-btn" onClick={() => setSelectedMenuDetail(r)}>
                      시그니처 상세 분석 리포트 →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredRecipes.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'rgba(255,255,255,0.3)' }}>
                🔍 설정한 필터 조건에 매칭되는 레시피가 없습니다. 다른 조건을 선택해 보세요.
              </div>
            )}

            {filteredRecipes.length > visibleCount && (
              <div className="load-more-container">
                <button 
                  className="btn btn-outline" 
                  onClick={() => setVisibleCount(prev => prev + 6)}
                >
                  더 많은 창업 메뉴 불러오기 ({filteredRecipes.length - visibleCount}개 남음)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 2. MENU DETAILS MODAL */}
        {selectedMenuDetail && (
          <div className="modal-overlay" onClick={() => setSelectedMenuDetail(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedMenuDetail(null)}>×</button>
              
              <div className="modal-header-row">
                <div className="card-icon" style={{ fontSize: '3rem', width: '4.5rem', height: '4.5rem' }}>
                  {selectedMenuDetail.icon}
                </div>
                <div className="modal-title-box">
                  <span className="section-tag" style={{ marginBottom: '0.25rem', display: 'inline-block' }}>
                    MFCO Premium Signature Menu
                  </span>
                  <h2>{selectedMenuDetail.name}</h2>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                    기본 식재료: {selectedMenuDetail.ingredients}
                  </span>
                </div>
              </div>

              <h4 style={{ fontFamily: 'var(--font-serif)', color: '#fff', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
                가맹 창업 수익성 분석
              </h4>
              <div className="modal-specs-grid">
                <div className="modal-spec-card">
                  <span className="modal-spec-lbl">권장 판매가</span>
                  <span className="modal-spec-val">₩{selectedMenuDetail.salePrice.toLocaleString()}</span>
                </div>
                <div className="modal-spec-card">
                  <span className="modal-spec-lbl">식재료 원가</span>
                  <span className="modal-spec-val">₩{selectedMenuDetail.costPrice.toLocaleString()}</span>
                </div>
                <div className="modal-spec-card">
                  <span className="modal-spec-lbl">수익율 (마진)</span>
                  <span className="modal-spec-val margin">{selectedMenuDetail.margin}%</span>
                </div>
              </div>

              <h4 style={{ fontFamily: 'var(--font-serif)', color: '#fff', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
                6대 영양성분 및 안전 가이드
              </h4>
              <div className="nutrition-bar-chart">
                <div className="nutrition-item">
                  <span className="nutrition-lbl">에너지 (Calories)</span>
                  <span className="nutrition-val">{selectedMenuDetail.nutrition.kcal} kcal</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-lbl">탄수화물 (Carbohydrates)</span>
                  <span className="nutrition-val">{selectedMenuDetail.nutrition.carbo} g</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-lbl">단백질 (Protein)</span>
                  <span className="nutrition-val">{selectedMenuDetail.nutrition.protein} g</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-lbl">지방 (Fat)</span>
                  <span className="nutrition-val">{selectedMenuDetail.nutrition.fat} g</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-lbl">나트륨 (Sodium)</span>
                  <span className="nutrition-val" style={{ color: selectedMenuDetail.nutrition.sodium > 800 ? '#f87171' : '#10b981' }}>
                    {selectedMenuDetail.nutrition.sodium} mg {selectedMenuDetail.nutrition.sodium > 800 && '(경고: 고나트륨 제한식 적용 요망)'}
                  </span>
                </div>
              </div>

              <h4 style={{ fontFamily: 'var(--font-serif)', color: '#fff', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
                가공 제형 및 기미 약성 강화 팁
              </h4>
              <div className="formulation-tip-box">
                <strong>[제형-효능 시너지 가이드]</strong>
                본 메뉴를 <strong>{selectedMenuDetail.name}</strong>로 가맹점에 출하할 시, 약선 키트 <strong>{selectedMenuDetail.kit}</strong>를 적용합니다.
                <br /><br />
                - <strong>생체/원물 가공 시</strong>: 본 재료의 방향성 에센셜 아로마가 보존되어 신경안정 및 소화 흡수율이 12% 향상됩니다.
                <br />
                - <strong>건조본말화(Powder) 가공 시</strong>: 수분대사를 담당하는 사상자, 복령의 침강 성분이 농축되어 비위 벽의 보호력이 증가합니다.
                <br />
                - <strong>농축액(Extract) 가공 시</strong>: 황기, 인삼의 수용성 다당류가 완전 추출되어 면역활성 효과가 즉시 발휘됩니다.
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem' }}>
                <a 
                  href="#inquiry" 
                  className="btn btn-primary" 
                  style={{ flex: 1, textAlign: 'center' }}
                  onClick={() => {
                    setFormData(p => ({
                      ...p,
                      message: `[시그니처 메뉴 문의] ${selectedMenuDetail.name} (마진 ${selectedMenuDetail.margin}%, 키트 ${selectedMenuDetail.kit}) 메뉴를 활용한 매장 창업에 대한 상세 수익 분석 및 매칭 상담을 신청합니다.`
                    }));
                    setSelectedMenuDetail(null);
                  }}
                >
                  이 메뉴로 상담 문의 신청
                </a>
                <button 
                  className="btn btn-outline" 
                  onClick={() => setSelectedMenuDetail(null)}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. EXPERT & CLINIC COOP DIRECTORY */}
        <div className="expert-directory-section">
          <div className="expert-directory-inner">
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <div className="section-tag">Coop Network</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#fff', marginBottom: '0.5rem' }}>
                지역 전문가 & 자문 클리닉 네트워크
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto' }}>
                아래 사전 가맹 양식에서 희망하시는 <strong>관심 지역</strong>을 선택하면, 해당 지부의 협력 한의의사 자문단, 메뉴 감수 요리연구가, 성분 인증 기관이 실시간으로 매칭 연동됩니다.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
              <span style={{ fontSize: '0.85rem', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', padding: '0.5rem 1.25rem', borderRadius: '50px', color: 'var(--neon-gold)' }}>
                {formData.region ? `선택된 지역: [${formData.region}] 연동망 가동 중` : '아래 가맹 신청 폼에서 지역을 선택하여 인프라 연동을 활성화해 보세요.'}
              </span>
            </div>

            <div className="expert-grid">
              {matchedExperts.map((exp, idx) => (
                <div className="expert-card" key={idx}>
                  <span className={`expert-type-badge ${exp.type}`}>{exp.type}</span>
                  <div className="expert-name">{exp.name}</div>
                  <span className="expert-doctor">{exp.doctor}</span>
                  <p className="expert-spec">{exp.spec}</p>
                  
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                    <span className="expert-tel">📞 문의: {exp.tel}</span>
                    <span className="expert-addr">📍 위치: {exp.address}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.75rem' }}>
                    {exp.tags.map((t, tid) => (
                      <span key={tid} style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', padding: '0.15rem 0.4rem', borderRadius: '0.25rem' }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BENEFITS */}
        <div className="benefits-section" id="benefits">
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div className="section-tag">가맹 혜택</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#fff', marginBottom: '0.5rem' }}>
              MFCO 가맹점 특별 혜택
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>
              바이오 테크놀로지와 F&B 비즈니스를 결합한 체계적인 성장 가이드를 제시합니다.
            </p>
          </div>
          <div className="benefits-grid">
            {FRANCHISE_BENEFITS.map((b, i) => (
              <div className="benefit-card" key={i}>
                <span className="benefit-icon">{b.icon || '✦'}</span>
                <div className="benefit-title">{b.title}</div>
                <p className="benefit-desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* HOW TO JOIN */}
        <div className="join-section">
          <div className="join-inner">
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <div className="section-tag">가입 절차</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#fff', marginBottom: '0.5rem' }}>
                가맹 신청 3단계
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>
                사전 등록 후 본사의 철저한 입지 분석과 시스템 교육을 거쳐 오픈합니다.
              </p>
            </div>
            <div className="timeline">
              {JOIN_STEPS.map((s, i) => (
                <div className="timeline-item" key={i}>
                  <div className="timeline-circle">
                    <div className="timeline-step-num">{s.num}</div>
                    <div className="timeline-icon">{s.icon}</div>
                  </div>
                  <div className="timeline-title">{s.title}</div>
                  <p className="timeline-desc">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COST TABLE */}
        <div className="cost-section">
          <div className="cost-inner">
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <div className="section-tag">창업 비용</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#fff', marginBottom: '0.5rem' }}>
                초기 투자 비용 안내
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>
                투명하고 합리적인 비용 구성으로 창업자의 성공적인 출발을 보장합니다.
              </p>
            </div>
            <table className="cost-table">
              <thead>
                <tr>
                  <th>항목</th>
                  <th>금액</th>
                  <th>비고</th>
                </tr>
              </thead>
              <tbody>
                {COST_TABLE.map((row, i) => (
                  <tr key={i}>
                    <td>{row.item}</td>
                    <td>{row.amount}</td>
                    <td>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="cost-note">
              ※ 위 비용은 30평 기준 예시이며, 실제 창업 비용은 입지 여건 및 매장 크기에 따라 일부 변동될 수 있습니다.<br />
              ※ 현재 브랜드 론칭 기념 가맹점 사전 가입 혜택 프로모션이 적용되어 특별 할인가로 진행됩니다.
            </p>
          </div>
        </div>

        {/* INQUIRY FORM */}
        <div className="inquiry-section" id="inquiry">
          <div className="section-tag" style={{ textAlign: 'center', marginBottom: '1rem' }}>가맹 신청</div>
          <h2 className="inquiry-title">가맹 문의 및 사전 상담</h2>
          <p className="inquiry-sub">
            사전 상담을 접수하시면, 선택하신 지역의 전담 지역 전문가 연동 클리닉 정보와 함께<br />
            1:1 약선 F&B 비즈니스 컨설팅 포트폴리오를 제공해 드립니다.
          </p>

          {submitted ? (
            <div className="submit-success-fr">
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✦</div>
              <strong style={{ display: 'block', marginBottom: '0.75rem', fontSize: '1.2rem' }}>가맹 사전 신청이 완료되었습니다!</strong>
              <span style={{ display: 'block', marginBottom: '1rem' }}>
                {formData.name}님, 소중한 파트너 신청에 감사드립니다.
              </span>
              선택하신 <strong>[{formData.region}]</strong> 지역 담당자와 매칭된 전문가 자문단이<br />
              영업일 기준 24시간 이내에 <strong>{formData.phone}</strong> 번호로 직접 연락드리겠습니다.
            </div>
          ) : (
            <form className="inquiry-form" onSubmit={handleSubmit}>
              <div className="iform-row">
                <div className="iform-field">
                  <label>성함 *</label>
                  <input
                    type="text"
                    placeholder="홍길동"
                    required
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div className="iform-field">
                  <label>연락처 *</label>
                  <input
                    type="tel"
                    placeholder="010-0000-0000"
                    required
                    value={formData.phone}
                    onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                  />
                </div>
              </div>
              <div className="iform-row">
                <div className="iform-field">
                  <label>관심 창업 지역 (전문가 연동망 매칭) *</label>
                  <select
                    required
                    value={formData.region}
                    onChange={e => setFormData(p => ({ ...p, region: e.target.value }))}
                  >
                    <option value="">지역을 선택해 주세요 (전문가 매칭)</option>
                    <option value="서울">서울 (강남/강북 전역)</option>
                    <option value="경기">경기 (성남/수원/일산)</option>
                    <option value="인천">인천 (송도/부평)</option>
                    <option value="부산">부산 (해운대/동래)</option>
                    <option value="대구">대구 (중구/수성구)</option>
                  </select>
                </div>
                <div className="iform-field">
                  <label>희망 창업 형태</label>
                  <select>
                    <option value="Standard">일반 약선 F&B 다이닝</option>
                    <option value="Premium">프리미엄 한방 보양 전문점</option>
                    <option value="TopicalCafe">식단 & 이너뷰티 외용제 결합형 카페</option>
                    <option value="ShopInShop">기존 F&B 매장 내 숍인숍 형태</option>
                  </select>
                </div>
              </div>
              <div className="iform-field">
                <label>상담 문의 내용</label>
                <textarea
                  placeholder="창업 경험 유무, 매장 희망 크기, 또는 분석기에서 관심 있게 보신 요리를 기반으로 질문을 작성해 주세요..."
                  value={formData.message}
                  onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                가맹 사전 신청 및 자문단 매칭 신청 →
              </button>
            </form>
          )}

          <div className="prep-notice">
            <strong>📢 사전 가입 우선권 혜택</strong><br />
            정식 가맹 사업 출범 전 사전 예약을 완료하시는 파트너들께는 가맹비 50% 할인 및 2년간 MFCO AI 진단 라이선스 독점 탑재권이 무상 제공됩니다.
          </div>
        </div>
      </div>
    </>
  );
}
