// Upgraded MFCO Data Wrapper — Connects Compiled JSON database with React Pages
import mfcoJson from './mfcoData.json';

// Parse raw composition string helper
function parseComposition(compStr) {
  const herbNames = [];
  const herbPcts = [];
  if (!compStr) return { names: [], details: [] };
  
  const parts = compStr.split(',');
  parts.forEach(p => {
    const nameMatch = p.match(/^\s*(.+?)\s*\(/);
    const pctMatch = p.match(/(\d+)%/);
    if (nameMatch) {
      const name = nameMatch[1].trim();
      herbNames.push(name);
      if (pctMatch) {
        herbPcts.push({ name, pct: parseInt(pctMatch[1]) });
      }
    } else {
      const nameOnly = p.trim().split(' ')[0];
      if (nameOnly) {
        herbNames.push(nameOnly);
        herbPcts.push({ name: nameOnly, pct: 20 });
      }
    }
  });
  return { names: herbNames, details: herbPcts };
}

// 1. Module Kits
export const KITS = mfcoJson.kits.map(k => {
  const colors = {
    'K01': { color: '--neon-green', colorHex: '#10b981', icon: '⚡', tagline: '기력·소화·피로회복', category: '약선키트' },
    'K02': { color: '--neon-rose', colorHex: '#f43f5e', icon: '🔥', tagline: '혈행·온기·경락', category: '약선키트' },
    'K03': { color: '--neon-blue', colorHex: '#06b6d4', icon: '💧', tagline: '해독·대사·이수', category: '약선키트' },
    'K04': { color: '--neon-gold', colorHex: '#f59e0b', icon: '🛡️', tagline: '피부 생기·이너뷰티·항산화', category: '약선키트' },
    'K05': { color: '--neon-purple', colorHex: '#8b5cf6', icon: '🌙', tagline: '안심·수면·진정', category: '약선키트' }
  };
  const extra = colors[k.id] || { color: '--neon-gold', colorHex: '#f59e0b', icon: '🌱', tagline: '웰빙 앰플', category: '약선키트' };
  const parsed = parseComposition(k.composition_desc);

  return {
    id: k.id,
    code: k.id,
    name: k.name,
    physical_form: k.physical_form,
    target_root_cause_id: k.target_root_cause_id,
    target_root_cause: k.target_root_cause,
    target_sf_ids: k.target_sf_ids,
    functions: k.functions,
    composition_desc: k.composition_desc,
    format: k.format,
    kitchen_guide: k.kitchen_guide,
    description: k.description,
    composition: parsed.names,
    herbs: parsed.details,
    ...extra,
    target_states: k.id === 'K01' ? ['ST-001', 'ST-005', 'ST-008'] :
                   k.id === 'K02' ? ['ST-003', 'ST-009', 'ST-017', 'ST-018'] :
                   k.id === 'K03' ? ['ST-004', 'ST-005', 'ST-010', 'ST-015', 'ST-016'] :
                   k.id === 'K04' ? ['ST-006', 'ST-012', 'ST-013'] :
                   k.id === 'K05' ? ['ST-002', 'ST-007', 'ST-011'] : [],
    root_cause: k.target_root_cause_id
  };
});

// 2. State Clusters (18)
export const STATES = mfcoJson.states;

// 3. Sasang Constitutions (4)
export const CONSTITUTIONS = [
  { id: 'SE', name: '소음인', en: 'So-Eum', desc: '차갑고 내향적, 소화기 취약', color: '#06b6d4', icon: '🌊' },
  { id: 'SY', name: '소양인', en: 'So-Yang', desc: '열이 많고 활동적, 신장 취약', color: '#f59e0b', icon: '🔥' },
  { id: 'TE', name: '태음인', en: 'Tae-Eum', desc: '체격 크고 꼼꼼함, 폐 취약', color: '#10b981', icon: '🌍' },
  { id: 'TY', name: '태양인', en: 'Tae-Yang', desc: '창의적이고 독립적, 간 취약', color: '#8b5cf6', icon: '⚡' },
];

// 4. Five Organs (5)
export const ORGANS = [
  { id: '간', name: '간 (肝)', en: 'Liver', icon: '🟢', code: 'LIVER' },
  { id: '심', name: '심 (心)', en: 'Heart', icon: '❤️', code: 'HEART' },
  { id: '비', name: '비 (脾)', en: 'Spleen', icon: '🟡', code: 'SPLEEN' },
  { id: '폐', name: '폐 (肺)', en: 'Lung', icon: '🔵', code: 'LUNG' },
  { id: '신', name: '신 (腎)', en: 'Kidney', icon: '🟣', code: 'KIDNEY' },
];

// 5. Recipes (1,000 compiled recipes)
export const RECIPES = mfcoJson.recipes.map(r => {
  const hash = r.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = ['#10b981', '#f43f5e', '#06b6d4', '#f59e0b', '#8b5cf6'];
  const image_color = colors[hash % colors.length];
  
  // Custom icons based on menu component
  let icon = '🥣';
  if (r.menu_component === 'TEA') icon = '🍵';
  else if (r.menu_component === 'SOUP_STEW') icon = '🍲';
  else if (r.menu_component === 'MAIN_SIDE') icon = '🍳';
  else if (r.menu_component === 'SUB_SIDE') icon = '🥗';
  else if (r.name.includes('밥')) icon = '🍚';
  else if (r.name.includes('죽')) icon = '🥣';
  else if (r.name.includes('생선') || r.name.includes('어') || r.name.includes('조림')) icon = '🐟';
  else if (r.name.includes('고기') || r.name.includes('닭') || r.name.includes('육')) icon = '🍗';

  // Compose Tags for Consumer Page Filtering
  const tags = [];
  if (r.structure === 'SINGLE') tags.push('SINGLE');
  if (r.menu_component === 'STAPLE') tags.push('STAPLE');
  if (r.menu_component === 'SOUP_STEW') tags.push('SOUP');
  if (r.menu_component === 'MAIN_SIDE' || r.menu_component === 'SUB_SIDE') tags.push('SIDE_DISH');
  if (r.menu_component === 'TEA') tags.push('TEA');
  
  const seasons = ['봄', '여름', '가을', '겨울'];
  tags.push(seasons[hash % seasons.length]);
  
  const constitutions = ['소음인', '소양인', '태음인', '태양인', '공통'];
  const constMatch = constitutions[hash % constitutions.length];
  tags.push(constMatch);
  
  // Sensory factors mapping for R&D canvas
  const sweet = (hash % 5) + 1;
  const sour = ((hash + 2) % 4);
  const bitter = r.kit === 'K01' || r.kit === 'K05' ? ((hash % 3) + 2) : ((hash + 1) % 3);
  const pungent = ((hash + 4) % 4);
  const salty = r.menu_component === 'TEA' ? 0 : ((hash % 3) + 1.5);
  const umami = r.menu_component === 'TEA' ? 0 : ((hash % 3) + 3);
  
  const tempMap = {
    'K01': '온(Warm)',
    'K02': '온(Warm)',
    'K03': '량(Cool)',
    'K04': '평(Neutral)',
    'K05': '평(Neutral)'
  };
  const temp = tempMap[r.kit] || '평(Neutral)';

  return {
    id: r.id,
    kit: r.kit,
    name: r.name,
    franchise_name: `MFCO Premium ${r.name}`,
    name_en: r.name, // Will be translated dynamically
    image_color,
    icon,
    ingredients: r.base_ingredients,
    tags,
    course_step: r.course_step,
    nutrition: {
      kcal: Math.round(r.nutrition.kcal || 180),
      carbo: Math.round(r.nutrition.carbo || 30),
      protein: Math.round(r.nutrition.protein || 10),
      fat: Math.round(r.nutrition.fat || 4),
      sodium: Math.round(r.nutrition.sodium || 280)
    },
    sensory: {
      sweet,
      sour,
      bitter,
      pungent,
      salty,
      umami,
      temperature: temp,
      color_ratios: {
        green: (hash % 4) * 10 + 10,
        red: ((hash + 2) % 3) * 10 + 10,
        yellow: ((hash + 1) % 4) * 10 + 20,
        white: ((hash + 3) % 3) * 10 + 30,
        black: ((hash + 4) % 3) * 10
      }
    },
    cooking_method: r.cooking_method,
    cooking_description: r.cooking_description,
    description: r.description,
    url: r.url,
    upgradable: r.upgradable,
    matched_kit: r.kit
  };
});

// 6. Herbs Database (484 unique herbs with complete ontology)
export const HERBS = mfcoJson.herbs;

// 7. General Ingredients Database (126 foods with nutrient mapping)
export const INGREDIENTS = mfcoJson.ingredients;

// 8. 24 Solar Terms Matrices
export const SEASON_TERMS = mfcoJson.season_terms;

// 9. Multilingual Translation Registry
export const TRANSLATIONS = mfcoJson.translations;

// Real 24 Solar Terms Calculator
export const SOLAR_TERMS_TODAY = () => {
  const now = new Date();
  const md = `${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  const map = {
    '02-04': '입춘', '02-19': '우수', '03-06': '경칩', '03-21': '춘분',
    '04-05': '청명', '04-20': '곡우', '05-06': '입하', '05-21': '소만',
    '06-06': '망종', '06-21': '하지', '07-07': '소서', '07-23': '대서',
    '08-07': '입추', '08-23': '처서', '09-08': '백로', '09-23': '추분',
    '10-08': '한로', '10-23': '상강', '11-07': '입동', '11-22': '소설',
    '12-07': '대설', '12-22': '동지', '01-06': '소한', '01-20': '대한',
  };
  const dates = Object.keys(map).sort();
  let term = '동지';
  for (const d of dates) {
    if (md >= d) term = map[d];
  }
  return term;
};

// 10. API Plans
export const SAAS_PLANS = [
  {
    id: 'free', name: 'Free', price: '무료', price_en: 'Free',
    color: '#475569',
    features: ['월 100회 API 호출', '기본 5대 키트 추론', '한국어 전용', '커뮤니티 지원'],
    cta: '무료 시작',
  },
  {
    id: 'pro', name: 'Pro', price: '₩99,000', price_en: '$79',
    color: '#f59e0b', popular: true,
    features: ['월 10,000회 API 호출', '7개국어 다국어 출력', '484종 한약재 & 1,793개 효능 DB 연계', '24절기 추론 연동', '이메일 지원'],
    cta: 'Pro 시작하기',
  },
  {
    id: 'enterprise', name: 'Enterprise', price: '문의', price_en: 'Contact',
    color: '#8b5cf6',
    features: ['무제한 API 호출', '화이트라벨 브랜딩', '전용 서버/SLA 보장', '맞춤 키트 설계', '전담 지원팀'],
    cta: 'Enterprise 문의',
  },
];

// 11. Franchise Benefits
export const FRANCHISE_BENEFITS = [
  { icon: '🤖', title: 'AI 추천 시스템', desc: '체질·증상 기반 AI가 최적 메뉴를 자동 추천' },
  { icon: '📦', title: '5대 약선 키트', desc: '검증된 한방 키트로 차별화된 메뉴 구성' },
  { icon: '🌐', title: '7개국어 지원', desc: '외국인 고객도 완벽히 대응하는 다국어 POS' },
  { icon: '📊', title: '실시간 분석', desc: '매장별 판매 데이터 및 추천 정확도 대시보드' },
  { icon: '🎓', title: '전문 교육', desc: '약선 메뉴 조리법 및 고객 상담 정기 교육' },
  { icon: '💰', title: '합리적 수익', desc: '낮은 초기 투자, 높은 마진의 프렌차이즈 모델' },
];

// 12. Shop Products
export const SHOP_PRODUCTS = [
  {
    id: 'P09', code: 'P09',
    name: '자연산 강원도 야생 홍선삼',
    name_en: 'Wild Gangwon Red Ginseng',
    price: 120000,
    category: '자연산 산야초',
    format: '1뿌리',
    icon: '🌿',
    tagline: '전문 심마니가 직접 채굴한 100% 야생 산삼',
    composition: ['야생홍선삼', '사포닌', '천연면역'],
    details: {
      origin: '강원도 홍천 깊은 산속 야생 지대',
      collector: '김창식 전문 채취인 (심마니)',
      certNo: 'K-WILD-2026-009A',
      features: '극대화된 면역 회복 및 생기 순환'
    },
    color: '--neon-green', colorHex: '#10b981',
  },
  {
    id: 'P10', code: 'P10',
    name: '자연산 소백산 야생 백출 원물',
    name_en: 'Wild Sobaeksan Atractylodes',
    price: 35000,
    category: '자연산 산야초',
    format: '150g',
    icon: '🌱',
    tagline: '전통 자연 건조 방식으로 정제한 삽주 뿌리 원물',
    composition: ['야생백출', '건비', '소화위벽보호'],
    details: {
      origin: '소백산 청정 야생 지대',
      collector: '이동수 전문 채취인 (심마니)',
      certNo: 'K-WILD-2026-010B',
      features: '위장막 보호 및 건비 작용의 정수'
    },
    color: '--neon-green', colorHex: '#10b981',
  },
  {
    id: 'P01', code: 'P01',
    name: '감홍로 명인 셀렉션',
    name_en: 'Gamhongro Master Selection',
    price: 75000,
    category: '전통주',
    format: '400ml / 40도',
    icon: '🍶',
    tagline: '계피, 진피, 감초 등 한방 약재가 함유된 최고급 증류주',
    composition: ['증류주', '계피', '진피', '감초'],
    details: {
      abv: '40%',
      maker: '이기숙 식품명인',
      features: '혈행 순환 활성화 및 복부 냉증 완화'
    },
    color: '--neon-rose', colorHex: '#f43f5e',
  },
  {
    id: 'P02', code: 'P02',
    name: '이화주 명인 백련향',
    name_en: 'Ihwaju Master Selection',
    price: 38000,
    category: '전통주',
    format: '400g / 8도',
    icon: '🍶',
    tagline: '숟가락으로 떠먹는 요구르트 형태의 전통 약선 탁주',
    composition: ['탁주', '유기농쌀', '천연효소'],
    details: {
      abv: '8%',
      maker: '백련향 명인',
      features: '풍부한 천연 효소와 아미노산으로 비위 기능 보강'
    },
    color: '--neon-rose', colorHex: '#f43f5e',
  },
  {
    id: 'P03', code: 'P03',
    name: '기순도 명인 전통 씨간장',
    name_en: 'Master Ki Soon-do Artisanal Soy Sauce',
    price: 45000,
    category: '명인장류',
    format: '250ml',
    icon: '🏺',
    tagline: '360년 종가 전통 방식으로 내려온 명인의 발효 씨간장',
    composition: ['씨간장', '전통발효', '저염감칠맛'],
    details: {
      aging: '5년 이상 자연 숙성 씨간장',
      maker: '기순도 식품명인',
      features: '인공 감미료 없는 깊은 아미노산 감칠맛(우마미)'
    },
    color: '--neon-gold', colorHex: '#f59e0b',
  },
  {
    id: 'P04', code: 'P04',
    name: '영평사 구운 죽염 고추장',
    name_en: 'Yeongpyeongsa Bamboo Salt Gochujang',
    price: 32000,
    category: '명인장류',
    format: '500g',
    icon: '🏺',
    tagline: '아홉 번 구운 죽염과 전통 사찰식 숙성 발효 고추장',
    composition: ['고추장', '구운죽염', '사찰발효'],
    details: {
      origin: '공주 영평사 사찰 제조',
      maker: '영평사 스님들',
      features: '신체 정화 작용 및 항염 효과가 뛰어난 웰니스 고추장'
    },
    color: '--neon-gold', colorHex: '#f59e0b',
  },
  {
    id: 'P05', code: 'P05',
    name: '철원 유기농 오대쌀',
    name_en: 'Cheorwon Organic Odae Rice',
    price: 28000,
    category: '명품곡물',
    format: '4kg',
    icon: '🌾',
    tagline: '철원 평야의 청정 우림수로 수확한 최고급 유기농 오대쌀',
    composition: ['오대쌀', '유기농인증', '고찰기'],
    details: {
      origin: '강원도 철원 평야 청정 지대',
      grade: '특등 유기농',
      features: '우수한 찰기 및 소화 흡수율로 체질 맞춤 위벽 보호'
    },
    color: '--neon-blue', colorHex: '#06b6d4',
  },
  {
    id: 'P06', code: 'P06',
    name: '약선 발아 찰보리',
    name_en: 'Sprouted Sticky Barley',
    price: 18000,
    category: '명품곡물',
    format: '2kg',
    icon: '🌾',
    tagline: '식이섬유와 가바(GABA) 성분이 보존된 영양 가득 발아 보리',
    composition: ['찰보리', '발아곡물', '가바(GABA)'],
    details: {
      origin: '국산 100% 농가 수확',
      features: '당 흡수를 늦춰 가드레일 식단을 구성하기 위한 명품 곡물'
    },
    color: '--neon-blue', colorHex: '#06b6d4',
  },
  {
    id: 'P07', code: 'P07',
    name: '엔스트라 스마트 링 (ST-002)',
    name_en: 'Enstra Smart Ring',
    price: 380000,
    category: '웰니스기기',
    format: '웨어러블 링 (블랙/실버)',
    icon: '💍',
    tagline: '자율신경(HRV) 변이도, 수면, 스트레스 실시간 스마트 링',
    composition: ['스마트헬스', 'HRV측정', '앱자동연동'],
    details: {
      sensors: '광학 PPG 센서, 온도 센서, 3축 가속도계',
      battery: '1회 완충 시 최장 7일 연속 사용',
      features: '손가락 맥박 측정 정보로 MFCO AI 모바일 앱과 1초 연동'
    },
    color: '--neon-purple', colorHex: '#8b5cf6',
  },
  {
    id: 'P08', code: 'P08',
    name: '맥파 광혈류(PPG) 측정 센서',
    name_en: 'Pulse Wave PPG Sensor',
    price: 120000,
    category: '웰니스기기',
    format: '블루투스 센서 기기',
    icon: '🔌',
    tagline: '10초 만에 스트레스 및 혈관 탄성 상태를 측정하는 헬스 디바이스',
    composition: ['PPG센서', '맥파측정', '블루투스'],
    details: {
      connection: 'Bluetooth 5.0 무선 통출',
      features: '스트레스 및 누적 피로도 정보를 측정하여 앱에 무선 송출'
    },
    color: '--neon-purple', colorHex: '#8b5cf6',
  }
];
