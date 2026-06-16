// Mila Wellness B2B Platform Ecosystem (Simulators/Charts/PitchDeck)

function switchEcoSubTab(panelId, btnElement) {
  const panels = document.querySelectorAll('.eco-sub-panel');
  panels.forEach(p => p.style.display = 'none');
  
  const target = document.getElementById(panelId);
  if (target) target.style.display = 'block';

  if (btnElement && btnElement.parentElement) {
    const buttons = btnElement.parentElement.querySelectorAll('button');
    buttons.forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
  }

  // If entering calculator, ensure values are updated
  if (panelId === 'eco-panel-calculator') {
    updateB2BCalculator();
  } else if (panelId === 'eco-panel-pitch') {
    // Initialise pitch deck slide & proposal content
    renderPitchSlides();
    const firstSegmentBtn = document.querySelector('[onclick*="renderSegmentedProposal"]');
    if (firstSegmentBtn) {
      firstSegmentBtn.click();
    }
  }
}
window.switchEcoSubTab = switchEcoSubTab;

// Simple Markdown parser to HTML
function renderMarkdownToHtml(md) {
  if (!md) return '';
  let html = md;
  
  // Escaping raw HTML tags to prevent XSS/breakage (except our parsed tags)
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold (**text**)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Headers (#, ##, ###)
  html = html.replace(/^### (.*?)$/gm, '<h4 style="color:var(--primary); margin-top:15px; margin-bottom:8px; font-size:1.02rem; font-weight:700;">$1</h4>');
  html = html.replace(/^## (.*?)$/gm, '<h3 style="color:var(--accent); margin-top:20px; margin-bottom:10px; font-size:1.18rem; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:5px; font-weight:700;">$1</h3>');
  html = html.replace(/^# (.*?)$/gm, '<h2 style="color:#fff; margin-top:25px; margin-bottom:15px; font-size:1.35rem; font-weight:800;">$1</h2>');

  // Horizontal Rules
  html = html.replace(/^---$/gm, '<hr style="border:0; border-top:1px solid rgba(255,255,255,0.08); margin:20px 0;">');

  // Bullet lists
  html = html.replace(/^\* (.*?)$/gm, '<li style="margin-left:20px; margin-bottom:4px; color:var(--text-secondary);">$1</li>');
  html = html.replace(/^- (.*?)$/gm, '<li style="margin-left:20px; margin-bottom:4px; color:var(--text-secondary);">$1</li>');

  // Tables
  const lines = html.split('\n');
  let inTable = false;
  let tableHtml = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableHtml = '<table style="width:100%; border-collapse:collapse; margin:15px 0; font-size:0.82rem; text-align:left; border:1px solid rgba(255,255,255,0.06);">';
      }
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      // Check for alignment/separator lines
      if (cells.every(c => c.startsWith('-') || c.startsWith(':'))) {
        continue;
      }
      const isHeader = !tableHtml.includes('<tbody>');
      if (isHeader && !tableHtml.includes('<thead>')) {
        tableHtml += '<thead><tr style="background:rgba(255,255,255,0.03); border-bottom:2px solid rgba(255,255,255,0.1);">';
        cells.forEach(c => {
          tableHtml += `<th style="padding:10px 12px; font-weight:700; color:#fff;">${c}</th>`;
        });
        tableHtml += '</tr></thead><tbody>';
      } else {
        tableHtml += '<tr style="border-bottom:1px solid rgba(255,255,255,0.04);">';
        cells.forEach(c => {
          tableHtml += `<td style="padding:8px 12px; color:var(--text-secondary);">${c}</td>`;
        });
        tableHtml += '</tr>';
      }
    } else {
      if (inTable) {
        inTable = false;
        tableHtml += '</tbody></table>';
        lines[i - 1] = tableHtml;
        tableHtml = '';
      }
    }
  }
  html = lines.join('\n');

  // Process line breaks
  html = html.replace(/\n\n/g, '<br><br>');

  return html;
}

// 2. 글로벌 전략 제안서 모달 연동
function openGlobalStrategyModal() {
  const modal = document.getElementById('global-strategy-modal');
  if (modal) modal.style.display = 'flex';
  
  const body = document.getElementById('global-strategy-body');
  if (!body) return;

  // Fetch from local server
  fetch('./global_strategy_proposal.md')
    .then(r => {
      if (!r.ok) throw new Error('Network error');
      return r.text();
    })
    .then(text => {
      body.innerHTML = renderMarkdownToHtml(text);
    })
    .catch(err => {
      console.warn("Proposal fetch failed, loading fallback data", err);
      // Fallback in case of local path issues
      body.innerHTML = `
        <h2 style="color:#fff;">K-약선요리 글로벌 진출 다각화 및 비즈니스 전략</h2>
        <hr style="border:0; border-top:1px solid rgba(255,255,255,0.08); margin:15px 0;">
        <p style="color:var(--text-secondary); line-height:1.6;">
          완제품 신선 밀키트는 통관 및 콜드체인 제약으로 직접 수출이 어렵습니다. 따라서 Nuri Lab은 <strong>4대 핵심 글로벌 전환 로드맵</strong>을 가동합니다.
        </p>
        <h3 style="color:var(--accent);">① 레시피 노하우 및 알고리즘 라이선싱 (B2B SaaS / API)</h3>
        <p style="color:var(--text-secondary);">현지 식재료와 결합한 7-AXIS 처방 알고리즘 연산 엔진 API 공급</p>
        <h3 style="color:var(--accent);">② 핵심 원물 및 건식 소스 표준화 (Ingredient Component)</h3>
        <p style="color:var(--text-secondary);">유관세/검역 규제가 없는 동결건조 블록 및 표준 소스 분말 공급</p>
        <h3 style="color:var(--accent);">③ 상온 보존 D2C 글로벌 쇼핑몰</h3>
        <p style="color:var(--text-secondary);">전통차, 장류 등 상온 유통이 1년 이상 가능한 완제품 해외 직배송</p>
        <h3 style="color:var(--accent);">④ 미디어 클래스 및 글로벌 아카데미 개설</h3>
        <p style="color:var(--text-secondary);">유튜브/온라인 강의 및 대학 연동 자격증 생태계 가동</p>
      `;
    });
}
function closeGlobalStrategyModal() {
  const modal = document.getElementById('global-strategy-modal');
  if (modal) modal.style.display = 'none';
}
window.openGlobalStrategyModal = openGlobalStrategyModal;
window.closeGlobalStrategyModal = closeGlobalStrategyModal;

// 3. 다자간 상생 생태계 관계도 노드 클릭
const ecoDetailsData = {
  'eco-academia': {
    title: { ko: '🔬 학술 & 임상 연구망 (Academia & Education)', en: '🔬 Academia & Clinical Research Network', ja: '🔬 学術＆臨床研究ネットワーク', ar: '🔬 شبكة البحث الأكاديمي والسريري' },
    desc: {
      ko: '경희대학교 한의과대학, 한국한의학연구원(KIOM), 대한약선학회 등과 협력하여 7-AXIS 추론 엔진의 학술적/생리학적 효능 검증을 공동 진행하고, 글로벌 인증 아카데미 교육 모델을 개발합니다.',
      en: 'Cooperating with Kyung Hee Univ. College of Korean Medicine, Korea Institute of Oriental Medicine (KIOM), and Korean Yakseon Society to validate the academic/physiological efficacy of the 7-AXIS reasoning engine, and develop global certified academy models.',
      ja: '慶熙大学韓医科大学、韓国韓医学研究院（KIOM）、大韓薬膳学会などと協力し、7軸推論エンジンの学術的・生理学的効能の共同検証を行い、グローバル認証アカデミー教育モデルを開発します。',
      desc: 'التعاون مع كلية الطب الكوري بجامعة كيونغ هي، والمعهد الكوري للطب الكوري (KIOM)، والجمعية الكورية للياكسيون للتحقق من الفعالية الأكاديمية والفسيولوجية لمحرك الاستدلال ذو المحاور السبعة، وتطوير نماذج أكاديمية عالمية معتمدة.'
    }
  },
  'eco-platform': {
    title: { ko: '🧬 Nuri Lab AI 추론 엔진 (IP SaaS Core)', en: '🧬 Nuri Lab AI Reasoning Engine', ja: '🧬 Nuri Lab AI推論エンジン', ar: '🧬 محرك الذكاء الاصطناعي نوري لاب' },
    desc: {
      ko: '본초강목, 황제내경의 전통 한의학 배합 규칙과 현대 생리학 기전을 결합하여, 입력된 개인 체질 및 증상 데이터에 따라 최적의 웰빙 레시피 성분비와 시너지 성미 조합을 실시간 연산하는 핵심 지식재산권(IP)입니다.',
      en: 'The core intellectual property (IP) combining classical formula rules of Bencao Gangmu/Neijing with modern physiological mechanisms to calculate optimal wellness recipe ratios and synergy taste profiles based on constitutional data in real time.',
      ja: '本草綱目、黄帝内経の伝統東洋医学配合規則と現代生理学機序を融合し、入力された個人体質および症状データに従って最適なウェルネスレシピ成分比と相乗効果をリアルタイム演算する核心知的財産（IP）です。',
      desc: 'الملكية الفكرية الأساسية التي تدمج قواعد التركيبة العشبية الكلاسيكية لكتاب بينكاو غانغمو/نيجينغ مع الآليات الفسيولوجية الحديثة لحساب نسب الوصفات المثالية للعافية وملفات تعريف التآزر بناءً على البيانات الدستورية في الوقت الفعلي.'
    }
  },
  'eco-supply': {
    title: { ko: '🏭 산지 공급 & GMP 가공망 (Supply Chain)', en: '🏭 Local Supply & GMP Processors', ja: '🏭 産地供給＆GMP加工網', ar: '🏭 الإمدادات المحلية وشبكة معالجة GMP' },
    desc: {
      ko: '전국 12대 지자체 우수 농가 작목반을 통해 고품질 한방 원재료를 안정적으로 수급하고, HACCP/GMP 인증 동결건조 블록 및 저온 감압 농축 추출 시설을 통해 글로벌 검역 기준을 만족하는 분말/액상 소스 성분을 생산합니다.',
      en: 'Secures high-quality herbal raw materials stably via 12 local agricultural cooperatives, producing standardized powders/liquid extracts through HACCP/GMP certified freeze-drying and low-temperature vacuum extraction facilities to meet global quarantine standards.',
      ja: '全国12の地方自治体の優秀農家作物クラスターを通じて高品質な東洋医学原料を安定して調達し、HACCP/GMP認証の真空凍結乾燥ブロックおよび低温減圧濃縮抽出施設を通じてグローバル検疫基準を満たす粉末・液状ソースを生産します。',
      desc: 'تأمين المواد الخام العشبية عالية الجودة بشكل مستقر عبر 12 تعاونية زراعية محلية، وإنتاج مساحيق/مستخلصات سائلة موحدة من خلال مرافق تجفيف بالتجميد واستخراج الفراغ منخفض الحرارة المعتمدة من HACCP/GMP لتلبية معايير الحجر الصحي العالمية.'
    }
  },
  'eco-b2c': {
    title: { ko: '🛒 Mila Premium Shop (Global Commerce)', en: '🛒 Mila Premium Shop', ja: '🛒 Milaプレミアムショップ', ar: '🛒 متجر ميلا الممتاز' },
    desc: {
      ko: '플랫폼 R&D에서 도출된 한방 큐레이션 제품(전통차, 천연 과립, 숙성 발효 장류)을 최종 소비자에게 직접 유통하는 D2C 글로벌 커머스망입니다. 국가표준 6대 영양 기준 및 칠정배합 안심 추천 알고리즘이 브라우저 상에 연동되어 있습니다.',
      en: 'The D2C global e-commerce network that distributes premium curated wellness products (traditional teas, granules, fermented pastes) directly to consumers. The RDA 6-class nutrition standard and herbal safety check algorithms are fully integrated into the store UI.',
      ja: 'プラットフォームR&Dから導き出された東洋医学キュレーション製品（伝統茶、天然顆粒、熟成発酵調味料）を最終消費者に直接流通させるD2Cグローバルコマース網です。国家標準6大栄養基準および七情配合安心推奨アルゴリズムがブラウザ上に連동しています。',
      desc: 'شبكة التجارة الإلكترونية العالمية D2C التي توزع منتجات العافية المنسقة المتميزة (الشاي التقليدي، الحبيبات، المعاجين المخمرة) مباشرة للمستهلكين. تم دمج معايير التغذية الوطنية المكونة من 6 فئات وخوارزميات فحص السلامة العشبية بالكامل في واجهة المتجر.'
    }
  },
  'eco-b2b': {
    title: { ko: '💼 B2B 프랜차이즈 및 가맹망 (B2B SaaS)', en: '💼 B2B Franchise & Menu Supply Chain', ja: '💼 B2Bフランチャイズ＆メニュー供給網', ar: '💼 فرع B2B لشبكة الامتياز وتوريد القوائم' },
    desc: {
      ko: '글로벌 웰니스 레스토랑, 케어 푸드 가맹망, 리조트 스파 등에 Mila의 표준화 소스 팩과 7-AXIS 식단 처방 SaaS API를 라이선싱하여, 전 세계 어느 지점에서나 동일한 퀄리티의 K-메디푸드 약선 요리를 고객에게 서빙할 수 있도록 가이딩합니다.',
      en: 'Licenses Mila\'s standardized sauce packs and 7-AXIS meal formulation SaaS API to global wellness restaurants, care food chains, and spa resorts, guiding them to serve K-Medifood Yakseon dishes with consistent quality worldwide.',
      ja: 'グローバルウェルネスレストラン、ケアフードチェーン、リゾートスパなどにMila의標準化ソースパックと7軸食生活処方SaaS APIをライセンスし、世界中どこでも同一クオリティのK-メディフード薬膳料理を顧客に提供できるようガイドします。',
      desc: 'ترخيص عبوات الصلصات الموحدة من ميلا وواجهة برمجة تطبيقات SaaS لتركيب الوجبات ذات السبعة محاور لمطاعم العافية العالمية وسلاسل الأغذية الصحية ومنتجع السبا، وتوجيههم لتقديم أطباق الكي-ميديفود ياكسيون بجودة متسقة في جميع أنحاء العالم.'
    }
  }
};

function showEcosystemDetails(nodeId) {
  const detailPanel = document.getElementById('eco-detail-panel');
  if (!detailPanel) return;

  const data = ecoDetailsData[nodeId];
  if (!data) return;

  const lang = currentLanguage || 'ko';
  const title = data.title[lang] || data.title.ko;
  const desc = data.desc[lang] || data.desc.ko || data.desc.en;

  // Active state highlighting
  document.querySelectorAll('.eco-node').forEach(node => {
    node.classList.remove('active-node');
    node.style.border = '1px solid rgba(255, 255, 255, 0.08)';
    node.style.background = 'rgba(255, 255, 255, 0.02)';
  });

  const activeNode = Array.from(document.querySelectorAll('.eco-node')).find(n => {
    const attr = n.getAttribute('onclick');
    return attr && attr.includes(nodeId);
  });
  if (activeNode) {
    activeNode.classList.add('active-node');
    activeNode.style.border = '1px solid var(--primary)';
    activeNode.style.background = 'rgba(16, 185, 129, 0.04)';
  }

  detailPanel.innerHTML = `
    <h3 style="color: var(--primary); font-size: 1rem; font-weight: 700; margin: 0 0 10px; display: flex; align-items: center; gap: 8px;">
      <i class="fa-solid fa-circle-check"></i> ${title}
    </h3>
    <p style="color: var(--text-main); font-size: 0.82rem; line-height: 1.6; margin: 0; text-align: justify;">
      ${desc}
    </p>
  `;
  detailPanel.style.display = 'block';
}
window.showEcosystemDetails = showEcosystemDetails;

// 4. 5대 투자군별 제안서 초안 렌더링
const segmentedProposals = {
  'edu': {
    title: { ko: '🔬 교육 기관 및 대학 제휴 제안서', en: '🔬 Educational & Academic Partnership Proposal', ja: '🔬 教育機関および大学連携提案書', ar: '🔬 مقترح شراكة المؤسسات التعليمية والأكاديمية' },
    content: {
      ko: '<h4>[트랙 3] 산학 학술 공동 연구 및 글로벌 아카데미 런칭</h4><p><strong>제휴 대상:</strong> 대구한의대학교 약선푸드테크비즈니스학과, 원광디지털대 한방건강약선학과, 경희대 F&B R&D</p><ul><li>Nuri Lab 7-AXIS 처방 알고리즘 정밀성에 대한 공동 한방/생리학적 임상 검증 수행.</li><li>"K-Yakseon Master" 온라인 아카데미 공동 런칭(자격증 연동) 및 글로벌 플랫폼 개설.</li><li>교육 수수료의 25~30% 배분 및 차세대 웰니스 메뉴 기술 고도화 국가 R&D 과제 수주.</li></ul>',
      en: '<h4>[Track 3] Academic Research & Global Academy Alliance</h4><p><strong>Partners:</strong> Daegu Haany Univ. Department of Foodtech, Wonkwang Digital Univ. Herbal Health Department, Kyung Hee Univ. R&D</p><ul><li>Co-validate clinical precision of the 7-AXIS reasoning engine.</li><li>Launch K-Yakseon Master certified online curriculum globally.</li><li>Collectively apply for government food-tech grants and share training profits.</li></ul>',
      ja: '<h4>【トラック3】産学学術共同研究＆グローバル薬膳アカデミー開設</h4><p><strong>提携対象：</strong>大邱韓医大学校薬膳フードテックビジネス学科、円光デジタル大学校韓方健康薬膳学科、慶熙大学F&B R&D</p><ul><li>7軸AI処方アルゴリズムの精密性に関する共同臨床・学術検証を実施。</li><li>「K-Yakseon Master」オンラインアカデミー共同開設（資格認定連動）。</li><li>教育事業の収益配分（25〜30%）および次世代ウェルネス技術高度化共同課題の受注。</li></ul>',
      ar: '<h4>[المسار 3] البحث الأكاديمي المشترك وإطلاق الأكاديمية العالمية</h4><p><strong>الشركاء:</strong> جامعة دايجو هاني، وجامعة وونكوانغ الرقمية، وجامعة كيونغ هي</p><ul><li>التحقق السريري المشترك من دقة الاستدلال ذو المحاور السبعة.</li><li>إطلاق منهج معتمد لـ K-Yakseon Master عبر الإنترنت على مستوى العالم.</li><li>تقاسم عائدات التدريب والتقدم بطلب للحصول على منح تكنولوجيا الأغذية الحكومية معًا.</li></ul>'
    }
  },
  'sup': {
    title: { ko: '🏭 원재료 & 가공 공급처 GMP 제휴 제안서', en: '🏭 Raw Material & Processing Supplier Partnership Proposal', ja: '🏭 原材料＆加工供給先GMP提携提案書', ar: '🏭 مقترح شراكة مع مورد المواد الخام ومعالجة GMP' },
    content: {
      ko: '<h4>[트랙 1] 천연물 동결건조 GMP/HACCP 공급망 표준 구축</h4><p><strong>제휴 대상:</strong> 프롬바이오, 주식회사 다움, 단정바이오 등 GMP 전문 가공사</p><ul><li>한약재 저온 진공 감압 공법(Brix 50%+) 및 진공 동결건조(-40℃ 이하)를 통한 120 Mesh 미세분말 규격화 생산.</li><li>초고압 HPP 및 감마선 멸균 가공을 적용하여 현지 국가 수입 통관 검역(Quarantine) 기준 100% 충족.</li><li>안정적인 고품질 특산 원재료의 연간 대량 소싱 및 독점 단가 공급망 구축.</li></ul>',
      en: '<h4>[Track 1] Natural Substance GMP/HACCP Processing Supply Chain</h4><p><strong>Partners:</strong> FromBio, Daum Co., Danjoung Bio, and herbal processors</p><ul><li>Produce 120 Mesh standard fine powders with -40℃ vacuum freeze-drying.</li><li>Meet strict quarantine rules via low-temperature vacuum extraction and HPP sterilization.</li><li>Secure long-term exclusive supply agreements for high-grade Korean botanicals.</li></ul>',
      ja: '<h4>【トラック1】天然物真空凍結乾燥GMP/HACCP供給ライン標準構築</h4><p><strong>提携対象：</strong>フロムバイオ、株式会社ダウム、丹精バイオなどGMP専門加工メーカー</p><ul><li>低温真空減圧製法および真空凍結乾燥（-40℃以下）による120メッシュ微細粉末の規格化生産。</li><li>超高圧HPPおよびガンマ線滅菌加工を導入し、現地の輸入通関検疫基準を100%達成。</li><li>安定した高品質特産素材の年間バルク調達および独占特別単価の適用。</li></ul>',
      ar: '<h4>[المسار 1] سلسلة توريد معالجة GMP/HACCP للمواد الطبيعية</h4><p><strong>الشركاء:</strong> FromBio، Daum Co.، Danjoung Bio، ومصنعي الأعشاب</p><ul><li>إنتاج مساحيق دقيقة قياسية 120 Mesh مع تجفيف بالتجميد بالتفريغ عند -40 درجة مئوية.</li><li>تلبية قواعد الحجر الصحي الصارمة من خلال التعقيم عالي الضغط HPP.</li><li>تأمين اتفاقيات توريد حصرية طويلة الأجل للمواد النباتية الكورية عالية الجودة.</li></ul>'
    }
  },
  'chef': {
    title: { ko: '👨‍🍳 요리 전문가 & 셰프 메뉴 R&D 제안서', en: '👨‍🍳 Culinary Experts & Chefs R&D Collaboration Proposal', ja: '👨‍🍳 料理専門家＆シェフ共同開発提案書', ar: '👨‍🍳 مقترح تعاون مع خبراء الطهي والطهاة للبحث والتطوير' },
    content: {
      ko: '<h4>[트랙 2] 맛 프로필 설계 및 약선 요리 레시피 블록 다각화</h4><p><strong>제휴 대상:</strong> (주)이앤에스, 하남소스, (주)서해식품 및 국내외 마스터 셰프</p><ul><li>천연 발효 곡물 효소 및 쓴맛을 배제한 대중적 글로벌 조미 분말 소스 배합 설계.</li><li>7-AXIS AI 알고리즘 배합비에 따른 건조 밀키트 및 농축 베이스 블록 규격화 시제품 공동 개발.</li><li>전통 장류 및 시즈닝 소스를 활용한 프리미엄 가맹용 시그니처 메뉴 마스터클래스 런칭.</li></ul>',
      en: '<h4>[Track 2] Culinary Formulation & Taste Profile Design for Global Markets</h4><p><strong>Partners:</strong> E&S, Hanam Sauce, Seohae Foods, and master chefs</p><ul><li>Formulate digestion-promoting grains enzymes and non-bitter seasoning dry bases.</li><li>Co-design standardized dry base blocks matching 7-AXIS AI calculations.</li><li>Establish signature wellness menus for franchise scaling and run chef masterclasses.</li></ul>',
      ja: '<h4>【トラック2】味プロファイル設計＆薬膳レシピブロックの多角化</h4><p><strong>提携対象：</strong>株式会社イーアンドエス、ハナムソース、株式会社西海食品および国内外マスターシェフ</p><ul><li>天然発酵穀物酵素および伝統原材料特有の苦味を抑えた大衆向けグローバル調味料ソースの共同配合。</li><li>7軸AIアルゴリズム配合比に基づく乾燥ミールキットおよび濃縮ブロック規格化試作の共同開発。</li><li>伝統発酵調味料とシーズニングを活用したプレミアムフランチャイズ向けシグネチャーメニューの共同開発。</li></ul>',
      ar: '<h4>[المسار 2] صياغة الطهي وتصميم النكهة للأسواق العالمية</h4><p><strong>الشركاء:</strong> E&S، Hanam Sauce، Seohae Foods، وكبار الطهاة</p><ul><li>صياغة إنزيمات الحبوب المعززة للهضم وقواعد التوابل الجافة غير المرة.</li><li>تصميم مشترك لقواعد جافة موحدة تطابق حسابات الذكاء الاصطناعي ذو المحاور السبعة.</li><li>تأسيس قوائم عافية مميزة لتوسيع نطاق الامتياز وتنظيم دورات تدريبية للطهاة.</li></ul>'
    }
  },
  'gov': {
    title: { ko: '🏛️ 정부 및 공공 기관 정책 과제 제안서', en: '🏛️ Government & Public Policy R&D Proposal', ja: '🏛️ 政府＆公共機関政策課題連動提案書', ar: '🏛️ مقترح ربط مهام السياسة الحكومية والعامة' },
    content: {
      ko: '<h4>[글로벌 진출] 국가 표준 데이터 인증 및 지역 작목반 유통 상생</h4><p><strong>제휴 대상:</strong> 농림축산식품부, 과학기술정보통신부, 전국 12대 작목반 지자체</p><ul><li>농진청 국가표준식품영양 데이터와 KIOM 표준 한의 온톨로지 융합 공인 플랫폼 가동 실증.</li><li>영주 홍삼, 안동 참마 등 지자체 농가의 우수 원물을 Mila 프리미엄 숍에 직접 입점 및 유통 가동.</li><li>글로벌 딥테크 육성 과제(TIPS), 식품수출 지원 및 K-Wellness 글로벌 실증 정부 과제 공동 수주.</li></ul>',
      en: '<h4>[Global Scaling] Government Policy & Organic Farms Integration</h4><p><strong>Partners:</strong> Ministry of Agriculture, MSIT, and local agricultural cooperatives</p><ul><li>Validate public platform combining KIOM ontology and RDA national nutrition DB.</li><li>Directly connect local farms (Yeongju Ginseng, Andong Yam, etc.) to Mila Shop.</li><li>Secure government funding (TIPS, foodtech export R&D grants) for global expansion.</li></ul>',
      ja: '<h4>【グローバル標準】国家標準データ認証および地方農産物協同組合流通連携</h4><p><strong>提携対象：</strong>農林畜産食品部、科学技術情報通信部、全国12の地方農協作物クラスター</p><ul><li>農村振興庁の国家標準食品栄養データとKIOMの韓方標準オントロジーを融合した公認プラットフォームの実証。</li><li>栄州紅参、安東山芋など、地方農家特産素材のMila Shop直接入店および流通拡大。</li><li>グローバルディープテック支援（TIPS）および食品輸出支援、K-Wellnessグローバル実証政府課題の共同受注。</li></ul>',
      ar: '<h4>[التوسع العالمي] سياسة الحكومة وتكامل المزارع العضوية</h4><p><strong>الشركاء:</strong> وزارة الزراعة، ووزارة العلوم وتكنولوجيا المعلومات والاتصالات، والتعاونيات الزراعية المحلية</p><ul><li>التحقق من المنصة العامة التي تجمع بين أنطولوجيا KIOM وقاعدة بيانات التغذية الوطنية لـ RDA.</li><li>ربط المزارع المحلية مباشرة بمتجر ميلا الممتاز.</li><li>تأمين التمويل الحكومي (منح تصدير تكنولوجيا الأغذية TIPS) للتوسع العالمي.</li></ul>'
    }
  },
  'vc': {
    title: { ko: '💸 투자 회사 및 VC Pre-Series A IR 제안서', en: '💸 Venture Capital Pre-Series A IR Proposal', ja: '💸 投資会社＆VC向けPre-Series A IR提案書', ar: '💸 مقترح شركة الاستثمار والمستشارين Pre-Series A IR' },
    content: {
      ko: '<h4>[Pre-Series A] 7-AXIS AI 기술 및 K-Wellness 글로벌 밸류체인</h4><p><strong>제휴 대상:</strong> 기관 투자사, 액셀러레이터 및 전문 벤처캐피탈(VC)</p><ul><li>모집 규모: Pre-Series A 투자 유치 15억 원 (TIPS 투자 연계 조건).</li><li>투자 자금 사용처: 특허 2종 등록 고도화 R&D 비용, 글로벌 크로스보더 쇼핑몰 다국어 마케팅 집행, 중동/일본 지사 구축 및 유통 파이프라인 개설.</li><li>회수 시나리오: 7축 알고리즘 고도화 후 글로벌 제약/유통 대기업 인수합병(M&A) 및 기술특례 코스닥 상장(IPO).</li></ul>',
      en: '<h4>[Pre-Series A] 7-AXIS AI Engine & Global Scaling Investment</h4><p><strong>Partners:</strong> Venture Capital, Accelerators, Institutional Investors</p><ul><li>Target Round: Pre-Series A USD 1.2M (Co-investment with TIPS).</li><li>Fund Allocation: AI algorithm R&D (registering 2 patents), global marketing for D2C cross-border shop, Middle East/Japan sales network.</li><li>Exit Strategy: M&A by multinational food/pharma giants or technology-specialized KOSDAQ IPO by Year 4.</li></ul>',
      ja: '<h4>【Pre-Series A】7軸AI技術およびK-Wellnessグローバルバリューチェーン</h4><p><strong>提携対象：</strong>機関投資家、アクセラレーターおよびベンチャーキャピタル（VC）</p><ul><li>募集規模：Pre-Series A 投資誘致1.5億円（TIPS投資連携条件）</li><li>投資用途：特許2件登録のR&D費用、グローバル越境EC多言語マーケティング、中東・日本支社構築および流通チャネル開拓。</li><li>回収シナリオ：7軸アルゴリズムの高度化後、グローバル製薬・流通大企業へのM&Aおよび技術特例コスダック上場(IPO)。</li></ul>',
      ar: '<h4>[Pre-Series A] محرك الذكاء الاصطناعي والاستثمار في التوسع العالمي</h4><p><strong>الشركاء:</strong> رأس المال المغامر، والمسرعات، والمستثمرون المؤسسيون</p><ul><li>الجولة المستهدفة: Pre-Series A بقيمة 1.2 مليون دولار.</li><li>تخصيص الأموال: ترقيات خوارزمية البحث والتطوير، والتسويق العالمي لمتجر D2C، وشبكة مبيعات الشرق الأوسط واليابان.</li><li>خطة الخروج: الاستحواذ أو الاكتتاب العام المتخصص بالتكنولوجيا في سوق كوسداك.</li></ul>'
    }
  }
};

function renderSegmentedProposal(segment, btnElement) {
  const previewBox = document.getElementById('eco-pitch-proposal-content');
  if (!previewBox) return;

  const data = segmentedProposals[segment];
  if (!data) return;

  const lang = currentLanguage || 'ko';
  const title = data.title[lang] || data.title.ko;
  const content = data.content[lang] || data.content.ko;

  // Toggle button class
  if (btnElement && btnElement.parentElement) {
    btnElement.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
  }

  previewBox.innerHTML = `
    <h3 style="color: var(--primary); font-size: 0.95rem; font-weight: 700; margin: 0 0 12px; display: flex; align-items: center; gap: 8px;">
      <i class="fa-solid fa-file-signature"></i> ${title}
    </h3>
    <div style="color: var(--text-main); font-size: 0.82rem; line-height: 1.6;">
      ${content}
    </div>
  `;
}
window.renderSegmentedProposal = renderSegmentedProposal;

// 5. IR 피치덱 슬라이드 쇼 기능
let currentPitchSlideIdx = 0;
const pitchSlidesData = [
  {
    title: { ko: "1. Executive Summary", en: "1. Executive Summary", ja: "1. エグゼクティブサマリー", ar: "1. الملخص التنفيذي" },
    bullets: {
      ko: ["K-Food의 건강한 진화, 기술 기반 약선 IP 플랫폼", "동의보감 기반 1,793종 천연물 온톨로지 데이터베이스 보유", "개인 사상체질 및 절기 연동 7-AXIS 맞춤 처방 엔진 가동"],
      en: ["Next-gen K-Wellness intelligence platform based on AI", "1,793 species natural substance ontology referenced from classic books", "Proprietary 7-AXIS herbal reasoning engine for personalized diets"],
      ja: ["K-Foodの健康な進化、技術ベースの薬膳IPプラットフォーム", "東医宝鑑に基づく1,793種の天然物オントロジーデータベースを保有", "個人四象体質および季節連動の7軸カスタマイズ処方エンジン"],
      ar: ["منصة ذكاء العافية الكورية القائمة على الذكاء الاصطناعي", "1,793 نوعًا من قواعد البيانات الأنطولوجية للمواد الطبيعية الكلاسيكية", "محرك الاستدلال ذو المحاور السبعة لتخصيص الوجبات الغذائية"]
    }
  },
  {
    title: { ko: "2. The Problem", en: "2. The Problem", ja: "2. 課題 (The Problem)", ar: "2. المشكلة" },
    bullets: {
      ko: ["완제품 신선 밀키트 수출 시 유통기한 및 통관 규제 장벽 발생", "국가별 농축산물 수입 검역(Quarantine) 통과가 극도로 어려움", "콜드체인 물류망 구축에 따른 초기 인프라 비용 부담 과중"],
      en: ["Fresh meal-kits face strict international quarantine and custom laws", "Short shelf life and high cold-chain shipping costs block direct exports", "Difficult to scale fresh physical products across different countries"],
      ja: ["生鮮ミールキット輸出時の短い賞味期限と通関・検疫の壁", "国ごとの農畜産물輸入規制（検疫）通過が極めて困難", "コールドチェーン物流網構築による初期インフラ費用の過重"],
      ar: ["تواجه الوجبات الطازجة قوانين حجر صحي وتخليص جمركي صارمة", "قصر مدة الصلاحية وتكاليف الشحن المبرد المرتفعة تمنع التصدير المباشر", "صعوبة توسيع نطاق المنتجات الطازجة المادية عبر بلدان مختلفة"]
    }
  },
  {
    title: { ko: "3. Our Solution", en: "3. Our Solution", ja: "3. 解決策 (Our Solution)", ar: "3. حلنا" },
    bullets: {
      ko: ["SaaS 알고리즘 API + 건식 원료/소스 표준화 부품 모델 전환", "완제품 대신 마진 높고 유관세 리스크 낮은 동결건조 블록/소스 공급", "현지 신선 원재료 조달 및 한국산 약리 컴포넌트 믹스 결합"],
      en: ["Pivot from physical meals to light-weight IP & Component models", "Export standardized dry powder packs & low-temperature extracts", "Combine local fresh meat/veg with import-cleared Korean wellness mix"],
      ja: ["SaaSアルゴリズムAPI＋乾燥原料・調味料の標準化コンポーネントモデルへ転換", "完成品ミールキットの代わりに、高マージン・低関税の凍結乾燥ブロックを供給", "現地の新鮮な素材と韓国産薬理コンポーネントミックスを融合"],
      ar: ["التحول من الوجبات المادية إلى نماذج برمجيات خفيفة ومكونات قياسية", "تصدير حزم المساحيق الجافة القياسية والمستخلصات منخفضة الحرارة", "دمج المنتجات الطازجة المحلية مع مزيج العافية الكوري المستورد"]
    }
  },
  {
    title: { ko: "4. Technology (IP)", en: "4. Technology (IP)", ja: "4. 技術力 (Technology IP)", ar: "4. التكنولوجيا والملكية الفكرية" },
    bullets: {
      ko: ["특허 출원 1: AI 기반 개인 맞춤형 약선 처방 추천 엔진", "특허 출원 2: 원격 분광 스펙트럼 비파괴 식재료 신선 품질 인증", "블록체인 연동 산지 신선도 추적 시스템 프로토타입 완비"],
      en: ["Patent 1: AI-powered Sasang constitution custom formulation engine", "Patent 2: Remote non-destructive spectral sensor for ingredient safety/grading", "Blockchain-backed crop origin traceability framework design ready"],
      ja: ["特許出願1：AIに基づく四象体質適合レシピ自動推薦システム", "特許出願2：遠隔分光スペクトル非破壊食材鮮度・品質認証システム", "ブロックチェーン連動の産地新鮮度追跡システムプロトタイプ完備"],
      ar: ["براءة الاختراع 1: محرك تركيب صيغ دستور ساسانغ بالذكاء الاصطناعي", "براءة الاختراع 2: مستشعر طيفي غير مدمر لسلامة المكونات وتصنيفها", "تصميم إطار عمل تتبع أصل المحاصيل المدعوم بالبلوكشين جاهز"]
    }
  },
  {
    title: { ko: "5. Eco Network", en: "5. Eco Network", ja: "5. パートナーシップ (Eco Network)", ar: "5. شبكة الشركاء" },
    bullets: {
      ko: ["학술/연구: 경희대 한방 R&D, KIOM 한의학 임상 검증", "제조/가공: HACCP/GMP 규격 진공 동결건조 분말 대량 양산망", "산지 연동: 전국 12대 친환경 작목반 계약 재배 투명성 확보"],
      en: ["Academia: Kyung Hee Univ. and KIOM clinical validation", "Manufacturing: HACCP/GMP-certified vacuum freeze-drying factories", "Farms: Contract farming with 12 organic agricultural cooperatives"],
      ja: ["学術・研究：慶熙大韓方R&D、KIOM韓医学臨床検証", "製造・加工：HACCP/GMP規格真空凍結乾燥粉末大量生産ライン", "産地連携：全国12のECO農家契約栽培による透明性確保"],
      ar: ["الأكاديميا: جامعة كيونغ هي والتحقق السريري لـ KIOM", "التصنيع: مصانع تجفيف بالتجميد معتمدة من HACCP/GMP", "المزارع: تعاقد زراعي مع 12 تعاونية زراعية عضوية"]
    }
  },
  {
    title: { ko: "6. Market Size", en: "6. Market Size", ja: "6. 市場規模 (Market Size)", ar: "6. حجم السوق" },
    bullets: {
      ko: ["글로벌 아답토젠 및 웰니스 푸드 시장: 2026년 3,200억 달러", "중동 아랍 할랄 기능성 웰빙 식품군: 연평균 7.8% 급성장세", "K-Food 글로벌 인기와 프리미엄 건강 식문화에 대한 결합 시점"],
      en: ["Global adaptogen & wellness food market: USD 320 Billion by 2026", "Middle East Halal functional/wellness segment: 7.8% annual growth", "Synergy window: K-Culture wave meets premium preventative nutrition"],
      ja: ["グローバルアダプトゲン＆ウェルネスフード市場：2026年 3,200億ドル", "中東ハラル機能性健康食品カテゴリ：年平均7.8%の急成長", "K-Foodのグローバル人気とプレミアム健康食文化が交差する時期"],
      ar: ["سوق الأغذية الوظيفية والعافية العالمي: 320 مليار دولار بحلول 2026", "قطاع الأغذية الحلال الوظيفية في الشرق الأوسط: نمو سنوي بنسبة 7.8%", "فرصة التآزر: موجة الكي-ثقافة تلتقي بالتغذية الوقائية الممتازة"]
    }
  },
  {
    title: { ko: "7. Business Model", en: "7. Business Model", ja: "7. 収益モデル (Business Model)", ar: "7. نموذج العمل" },
    bullets: {
      ko: ["알고리즘 SaaS: 프랜차이즈 및 웰니스 시설 월 구독 API 사용료", "원료 납품: 소스/동결건조 원료 컴포넌트 공급 마진", "D2C 수수료: Mila Shop 입점 농가 및 제조사 판매액 15~20% 수수료"],
      en: ["SaaS API subscription fees: monthly charge for wellness venues", "Ingredient margin: bulk standard powder sauce component supply", "D2C commission: 15-20% fee from Mila Shop partner sellers"],
      ja: ["SaaS月額ライセンス：加盟施設や飲食店向けAPI購読料", "原材料供給マージン：標準化されたソース・乾燥粉末の納品利益", "B2C手数料：Mila Shop入店農家・ブランドからの取引手数料15〜20%"],
      ar: ["رسوم اشتراك SaaS API: رسوم شهرية لأماكن العافية", "هامش المكونات: توريد مكونات صلصة المسحوق القياسية السائبة", "عمولة D2C: رسوم 15-20٪ من بائعي شركاء متجر ميلا"]
    }
  },
  {
    title: { ko: "8. Roadmap", en: "8. Roadmap", ja: "8. 로드맵 (Roadmap)", ar: "8. خارطة الطريق" },
    bullets: {
      ko: ["1단계(2026-H2): R&D 처방 정밀화 및 국내 산학 연계망 공인 검증", "2단계(2027-H1): 아시아/중동 타겟 현지 소량 가공 및 첫 수출 개시", "3단계(2027-H2): 글로벌 SaaS 구독 및 해외 제휴점 100개소 달성"],
      en: ["Phase 1 (2026-H2): Clinical verification and regional R&D alliance setup", "Phase 2 (2027-H1): Middle East & Asia trial processing and first export", "Phase 3 (2027-H2): SaaS platform expansion, reaching 100 overseas venues"],
      ja: ["1段階(2026-H2): R&D処方精密化および国内産学連携公認検証", "2단계(2027-H1): アジア/中東ターゲット現地加工および初輸出開始", "3단계(2027-H2): グローバルSaaS購読モデル本格化、海外提携店100店舗達成"],
      ar: ["المرحلة 1 (2026-H2): التحقق السريري وإعداد تحالف البحث والتطوير الإقليمي", "المرحلة 2 (2027-H1): معالجة تجريبية وتصدير أول للشرق الأوسط وآسيا", "المرحلة 3 (2027-H2): توسيع منصة SaaS، والوصول إلى 100 موقع في الخارج"]
    }
  },
  {
    title: { ko: "9. Exit Strategy", en: "9. Exit Strategy", ja: "9. エグジット (Exit Strategy)", ar: "9. استراتيجية الخروج" },
    bullets: {
      ko: ["글로벌 메디푸드/빅파마/종합식품기업 대상 원천 특허 라이선스 M&A", "AI 식단 처방 SaaS 기술성과 평가를 통한 코스닥 기술특례 상장(IPO)", "안정적 현금흐름 바탕 웰빙 테크 글로벌 탑티어 유니콘 도약"],
      en: ["M&A exit by global pharmaceutical or major food conglomerates", "Technology-specialized IPO on KOSDAQ stock market by Year 4", "Build consistent cash-flow to become a global wellness tech unicorn"],
      ja: ["グローバルメディフード/製薬/総合食品企業への技術M&Aエグジット", "AI食生活処方SaaS技術性評価によるコスダック技術特例上場(IPO)", "安定したキャッシュフローに基づくウェルビーイングテックユニコーン"],
      ar: ["الاستحواذ من قبل شركات الأدوية العالمية أو تكتلات الأغذية الكبرى", "الاكتتاب العام المتخصص بالتكنولوجيا في سوق كوسداك بحلول السنة الرابعة", "بناء تدفق نقدي متسق لتصبح شركة يونيكورن عالمية في تكنولوجيا العافية"]
    }
  }
];

function renderPitchSlides() {
  const container = document.getElementById('pitch-slides-container');
  const dotsContainer = document.getElementById('pitch-dots-container');
  if (!container || !dotsContainer) return;

  const lang = currentLanguage || 'ko';
  container.innerHTML = '';
  dotsContainer.innerHTML = '';

  pitchSlidesData.forEach((slide, idx) => {
    // slide element
    const slideDiv = document.createElement('div');
    slideDiv.className = `pitch-slide-card ${idx === currentPitchSlideIdx ? 'active' : ''}`;
    slideDiv.style.display = idx === currentPitchSlideIdx ? 'block' : 'none';
    slideDiv.style.background = 'rgba(15, 23, 42, 0.6)';
    slideDiv.style.border = '1px solid rgba(255, 255, 255, 0.08)';
    slideDiv.style.borderRadius = '10px';
    slideDiv.style.padding = '25px';
    slideDiv.style.minHeight = '180px';
    slideDiv.style.transition = 'all 0.3s ease';

    const titleText = slide.title[lang] || slide.title.ko;
    const bullets = slide.bullets[lang] || slide.bullets.ko;

    let listHtml = '<ul style="margin: 0; padding-left: 20px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 8px; font-size: 0.82rem; text-align: left;">';
    bullets.forEach(b => {
      listHtml += `<li style="line-height:1.4;">${b}</li>`;
    });
    listHtml += '</ul>';

    slideDiv.innerHTML = `
      <h3 style="color: var(--accent); font-size: 1.05rem; font-weight: 700; margin: 0 0 15px; text-align: left; display:flex; align-items:center; gap:8px;">
        <i class="fa-solid fa-play" style="font-size:0.75rem; color:var(--primary);"></i> ${titleText}
      </h3>
      ${listHtml}
    `;
    container.appendChild(slideDiv);

    // Indicator dot
    const dot = document.createElement('span');
    dot.className = `pitch-dot ${idx === currentPitchSlideIdx ? 'active' : ''}`;
    dot.style.display = 'inline-block';
    dot.style.width = '8px';
    dot.style.height = '8px';
    dot.style.borderRadius = '50%';
    dot.style.background = idx === currentPitchSlideIdx ? 'var(--accent)' : 'rgba(255, 255, 255, 0.2)';
    dot.style.cursor = 'pointer';
    dot.style.margin = '0 4px';
    dot.style.transition = 'all 0.2s';
    dot.onclick = () => goToPitchSlide(idx);
    dotsContainer.appendChild(dot);
  });
}
function prevPitchSlide() {
  currentPitchSlideIdx = (currentPitchSlideIdx - 1 + pitchSlidesData.length) % pitchSlidesData.length;
  renderPitchSlides();
}
function nextPitchSlide() {
  currentPitchSlideIdx = (currentPitchSlideIdx + 1) % pitchSlidesData.length;
  renderPitchSlides();
}
function goToPitchSlide(idx) {
  currentPitchSlideIdx = idx;
  renderPitchSlides();
}
window.renderPitchSlides = renderPitchSlides;
window.prevPitchSlide = prevPitchSlide;
window.nextPitchSlide = nextPitchSlide;
window.goToPitchSlide = goToPitchSlide;

// 6. B2B 수익 시뮬레이터 연산
function updateB2BCalculator() {
  const apiRange = document.getElementById('calc-api-range');
  const ingRange = document.getElementById('calc-ing-range');
  const consultCheck = document.getElementById('calc-consult-check');

  if (!apiRange || !ingRange) return;

  const apiCalls = parseInt(apiRange.value);
  const ingVolume = parseInt(ingRange.value);
  const hasConsulting = consultCheck ? consultCheck.checked : false;

  // Real-time text output update
  const perMonthText = currentLanguage === 'ko' ? ' /월' : (currentLanguage === 'ja' ? ' /月' : (currentLanguage === 'ar' ? ' /شهر' : ' /mo'));
  const kgPerMonthText = currentLanguage === 'ko' ? ' kg/월' : (currentLanguage === 'ja' ? ' kg/月' : (currentLanguage === 'ar' ? ' كجم/شهر' : ' kg/mo'));
  document.getElementById('calc-api-val').innerText = apiCalls.toLocaleString() + perMonthText;
  document.getElementById('calc-ing-val').innerText = ingVolume.toLocaleString() + kgPerMonthText;

  // API cost: standard is 50 krw, bulk is 30 krw
  let apiCost = 0;
  if (apiCalls <= 10000) {
    apiCost = apiCalls * 50;
  } else {
    apiCost = (10000 * 50) + ((apiCalls - 10000) * 30);
  }

  // Ingredients cost: 20,000 krw per kg
  const ingCost = ingVolume * 20000;

  // Consulting cost: 2,000,000 krw per month (packaged)
  const consultCost = hasConsulting ? 2000000 : 0;

  const subtotal = apiCost + ingCost + consultCost;

  // Combination discount (10%) if both active
  let discountRate = 0;
  if (apiCalls > 0 && ingVolume > 0) {
    discountRate += 10;
  }

  // Bulk discount
  let bulkDiscountRate = 0;
  if (ingVolume >= 2500) {
    bulkDiscountRate = 10;
  } else if (ingVolume >= 1000) {
    bulkDiscountRate = 5;
  }

  const discountAmount = Math.floor(subtotal * (discountRate / 100));
  const bulkDiscountAmount = Math.floor(ingCost * (bulkDiscountRate / 100));

  const totalCost = Math.max(0, subtotal - discountAmount - bulkDiscountAmount);

  // Write values to DOM
  document.getElementById('calc-api-cost').innerText = '₩' + apiCost.toLocaleString();
  document.getElementById('calc-ing-cost').innerText = '₩' + ingCost.toLocaleString();
  document.getElementById('calc-consult-cost').innerText = '₩' + consultCost.toLocaleString();

  document.getElementById('calc-subtotal').innerText = '₩' + subtotal.toLocaleString();
  document.getElementById('calc-discount-rate').innerText = '-' + discountRate + '% (₩' + discountAmount.toLocaleString() + ')';
  
  const bulkDiscountWrap = document.getElementById('calc-bulk-discount-wrap');
  if (bulkDiscountWrap) {
    if (bulkDiscountRate > 0) {
      bulkDiscountWrap.style.display = 'flex';
      document.getElementById('calc-bulk-discount').innerText = '-' + bulkDiscountRate + '% (₩' + bulkDiscountAmount.toLocaleString() + ')';
    } else {
      bulkDiscountWrap.style.display = 'none';
    }
  }

  document.getElementById('calc-total-cost').innerText = '₩' + totalCost.toLocaleString();

  // Draw Charts
  drawSVGChart(totalCost);
  drawDonutChart(apiCost, ingCost, consultCost);
}

function drawSVGChart(totalCost) {
  const svg = document.getElementById('calc-growth-chart');
  if (!svg) return;

  const baseVal = totalCost * 12; // Annualised
  const years = [baseVal, baseVal * 1.35, baseVal * 1.8, baseVal * 2.5, baseVal * 3.6];
  const maxVal = Math.max(...years, 10000000); // at least 10M scale
  const height = 160;
  const width = 340;
  const pad = 20;

  const points = years.map((val, idx) => {
    const x = pad + (idx * (width - 2 * pad) / (years.length - 1));
    const y = height - pad - (val * (height - 2 * pad) / maxVal);
    return { x, y, val };
  });

  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    pathD += ` L ${points[i].x} ${points[i].y}`;
  }

  let elements = `
    <!-- Grid lines -->
    <line x1="20" y1="20" x2="320" y2="20" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
    <line x1="20" y1="70" x2="320" y2="70" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
    <line x1="20" y1="120" x2="320" y2="120" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
    
    <!-- Trend Area Fill -->
    <path d="${pathD} L ${points[4].x} 140 L ${points[0].x} 140 Z" fill="url(#chart-grad)" opacity="0.15" />
    
    <!-- Trend Line -->
    <path d="${pathD}" fill="none" stroke="var(--primary)" stroke-width="3" stroke-linecap="round" />
    
    <!-- Gradients -->
    <defs>
      <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--primary)" />
        <stop offset="100%" stop-color="rgba(16,185,129,0)" />
      </linearGradient>
    </defs>
  `;

  points.forEach((p) => {
    let label = '';
    if (currentLanguage === 'en' || currentLanguage === 'ar') {
      if (p.val >= 100000000) {
        label = (p.val / 1000000).toFixed(0) + 'M';
      } else if (p.val >= 1000000) {
        label = (p.val / 1000000).toFixed(0) + 'M';
      } else if (p.val >= 1000) {
        label = (p.val / 1000).toFixed(0) + 'K';
      } else {
        label = p.val.toLocaleString();
      }
    } else if (currentLanguage === 'ja') {
      if (p.val >= 100000000) {
        label = (p.val / 100000000).toFixed(1) + '億';
      } else if (p.val >= 10000000) {
        label = (p.val / 10000000).toFixed(0) + '千万';
      } else if (p.val >= 10000) {
        label = (p.val / 10000).toFixed(0) + '万';
      } else {
        label = p.val.toLocaleString();
      }
    } else {
      if (p.val >= 100000000) {
        label = (p.val / 100000000).toFixed(1) + '억';
      } else if (p.val >= 10000000) {
        label = (p.val / 10000000).toFixed(0) + '천만';
      } else if (p.val >= 10000) {
        label = (p.val / 10000).toFixed(0) + '만';
      } else {
        label = p.val.toLocaleString();
      }
    }

    elements += `
      <circle cx="${p.x}" cy="${p.y}" r="4" fill="#0c1220" stroke="var(--primary)" stroke-width="2" />
      <text x="${p.x}" y="${p.y - 8}" fill="#e2e8f0" font-size="8" font-family="'Outfit'" text-anchor="middle" font-weight="600">${label}</text>
    `;
  });

  svg.innerHTML = elements;
}

function drawDonutChart(apiCost, ingCost, consultCost) {
  const chart = document.getElementById('calc-share-chart');
  const legend = document.getElementById('calc-share-legend');
  if (!chart || !legend) return;

  const total = apiCost + ingCost + consultCost;
  if (total === 0) {
    chart.style.background = 'rgba(255,255,255,0.05)';
    legend.innerHTML = `<span style="font-size:0.75rem; color:var(--text-muted);">${getTranslation("조건을 설정하면 요율이 계산됩니다.", currentLanguage)}</span>`;
    return;
  }

  const apiPct = Math.round((apiCost / total) * 100);
  const ingPct = Math.round((ingCost / total) * 100);
  const consultPct = 100 - apiPct - ingPct;

  chart.style.background = `conic-gradient(
    var(--primary) 0% ${apiPct}%,
    var(--accent) ${apiPct}% ${apiPct + ingPct}%,
    #3b82f6 ${apiPct + ingPct}% 100%
  )`;

  legend.innerHTML = `
    <div style="display:flex; align-items:center; gap:8px; font-size:0.75rem; color:#e2e8f0; margin-bottom:6px;">
      <span style="display:inline-block; width:10px; height:10px; background:var(--primary); border-radius:2px;"></span>
      <span style="flex:1;">${getTranslation("API SaaS 구독", currentLanguage)}</span>
      <strong>${apiPct}%</strong>
    </div>
    <div style="display:flex; align-items:center; gap:8px; font-size:0.75rem; color:#e2e8f0; margin-bottom:6px;">
      <span style="display:inline-block; width:10px; height:10px; background:var(--accent); border-radius:2px;"></span>
      <span style="flex:1;">${getTranslation("원료/소스 조달", currentLanguage)}</span>
      <strong>${ingPct}%</strong>
    </div>
    <div style="display:flex; align-items:center; gap:8px; font-size:0.75rem; color:#e2e8f0;">
      <span style="display:inline-block; width:10px; height:10px; background:#3b82f6; border-radius:2px;"></span>
      <span style="flex:1;">${getTranslation("R&D 컨설팅", currentLanguage)}</span>
      <strong>${consultPct}%</strong>
    </div>
  `;
}

function printB2BEstimate() {
  const apiCalls = document.getElementById('calc-api-range').value;
  const ingVol = document.getElementById('calc-ing-range').value;
  const hasConsult = document.getElementById('calc-consult-check').checked;
  
  const apiCost = document.getElementById('calc-api-cost').innerText;
  const ingCost = document.getElementById('calc-ing-cost').innerText;
  const consultCost = document.getElementById('calc-consult-cost').innerText;
  const discount = document.getElementById('calc-discount-rate').innerText;
  const total = document.getElementById('calc-total-cost').innerText;

  const printArea = document.getElementById('print-invoice-area');
  if (!printArea) return;

  printArea.innerHTML = `
    <div style="font-family:'Noto Sans KR', sans-serif; padding:40px; color:#1e293b; background:#ffffff; min-height:100vh; box-sizing:border-box;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #0f172a; padding-bottom:20px;">
        <div>
          <h1 style="margin:0; font-size:2rem; font-weight:900; color:#0f172a;">Nuri Laboratory</h1>
          <p style="margin:5px 0 0; color:#64748b; font-size:0.9rem;">Wellness Energy is ON | B2B Estimate Proposal</p>
        </div>
        <div style="text-align:right;">
          <h2 style="margin:0; font-size:1.6rem; color:#10b981;">${getTranslation("견 적 서", currentLanguage)}</h2>
          <p style="margin:5px 0 0; font-size:0.8rem; color:#64748b;">${getTranslation("발행일자", currentLanguage)}: ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
      
      <div style="margin-top:30px;">
        <h3 style="border-bottom:1px solid #cbd5e1; padding-bottom:8px; color:#0f172a;">${getTranslation("1. 서비스 이용조건", currentLanguage)}</h3>
        <table style="width:100%; border-collapse:collapse; margin-top:10px; font-size:0.9rem;">
          <tr style="border-bottom:1px solid #f1f5f9;">
            <td style="padding:10px 0; font-weight:700; width:220px; color:#334155;">${getTranslation("B2B 약선 추천 API 호출수:", currentLanguage)}</td>
            <td style="padding:10px 0; color:#0f172a;">${currentLanguage === 'ko' ? '월 ' + parseInt(apiCalls).toLocaleString() + ' 회' : (currentLanguage === 'ja' ? '月 ' + parseInt(apiCalls).toLocaleString() + ' 回' : (currentLanguage === 'ar' ? parseInt(apiCalls).toLocaleString() + ' استدعاء / شهر' : parseInt(apiCalls).toLocaleString() + ' calls / month'))}</td>
          </tr>
          <tr style="border-bottom:1px solid #f1f5f9;">
            <td style="padding:10px 0; font-weight:700; color:#334155;">${getTranslation("한방 약리 건식 원료 공급량:", currentLanguage)}</td>
            <td style="padding:10px 0; color:#0f172a;">${currentLanguage === 'ko' ? '월 ' + parseInt(ingVol).toLocaleString() + ' kg' : (currentLanguage === 'ja' ? '月 ' + parseInt(ingVol).toLocaleString() + ' kg' : (currentLanguage === 'ar' ? parseInt(ingVol).toLocaleString() + ' كجم / شهر' : parseInt(ingVol).toLocaleString() + ' kg / month'))}</td>
          </tr>
          <tr style="border-bottom:1px solid #f1f5f9;">
            <td style="padding:10px 0; font-weight:700; color:#334155;">${getTranslation("커스텀 식단 컨설팅 여부:", currentLanguage)}</td>
            <td style="padding:10px 0; color:#0f172a;">${hasConsult ? getTranslation('신청 (연간 패키지)', currentLanguage) : getTranslation('미신청', currentLanguage)}</td>
          </tr>
        </table>
      </div>

      <div style="margin-top:40px;">
        <h3 style="border-bottom:1px solid #cbd5e1; padding-bottom:8px; color:#0f172a;">${getTranslation("2. 예상 요금 명세 (월간)", currentLanguage)}</h3>
        <table style="width:100%; border-collapse:collapse; margin-top:10px; font-size:0.9rem; text-align:left;">
          <thead>
            <tr style="background:#f8fafc; border-bottom:2px solid #cbd5e1;">
              <th style="padding:12px; color:#0f172a;">${getTranslation("항목", currentLanguage)}</th>
              <th style="padding:12px; text-align:right; color:#0f172a;">${getTranslation("비용 (월)", currentLanguage)}</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid #f1f5f9;">
              <td style="padding:12px; color:#334155;">${getTranslation("1. API 엔진 라이선스 비용", currentLanguage)}</td>
              <td style="padding:12px; text-align:right; color:#0f172a;">${apiCost}</td>
            </tr>
            <tr style="border-bottom:1px solid #f1f5f9;">
              <td style="padding:12px; color:#334155;">${getTranslation("2. 건식 약리 원료 대량 공급 비용", currentLanguage)}</td>
              <td style="padding:12px; text-align:right; color:#0f172a;">${ingCost}</td>
            </tr>
            <tr style="border-bottom:1px solid #f1f5f9;">
              <td style="padding:12px; color:#334155;">${getTranslation("3. 식단 컨설팅 패키지 (월 분할)", currentLanguage)}</td>
              <td style="padding:12px; text-align:right; color:#0f172a;">${consultCost}</td>
            </tr>
            <tr style="border-bottom:1px solid #f1f5f9; font-weight:600; color:#10b981;">
              <td style="padding:12px;">${getTranslation("할인 혜택 (결합/대용량)", currentLanguage)}</td>
              <td style="padding:12px; text-align:right;">${discount}</td>
            </tr>
            <tr style="border-bottom:2px solid #0f172a; font-weight:800; font-size:1.15rem; background:#f0fdf4;">
              <td style="padding:16px; color:#0f172a;">${getTranslation("최종 합계 추정 요금", currentLanguage)}</td>
              <td style="padding:16px; text-align:right; color:#16a34a;">${total}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="margin-top:60px; font-size:0.8rem; color:#64748b; line-height:1.6;">
        <p>${getTranslation("※ 본 견적서는 대시보드 시뮬레이터로 생성된 간이 예상 요금표입니다.", currentLanguage)}</p>
        <p>${getTranslation("※ 구체적인 공급 약재 종류(녹용, 침향, 인삼 등 원재료 차이) 및 물류 통관 조건에 따라 공식 계약 체결 시 단가는 변동될 수 있습니다.", currentLanguage)}</p>
        <p>${getTranslation("※ 공식 파트너십 문의: ", currentLanguage)}<strong>contact@nurilab.kr</strong></p>
      </div>
    </div>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write('<html><head><title>Nuri Lab B2B Estimate</title></head><body>');
  printWindow.document.write(printArea.innerHTML);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
}
window.updateB2BCalculator = updateB2BCalculator;
window.printB2BEstimate = printB2BEstimate;

// B2B 트래픽 시뮬레이터 (R&D 대시보드 전용)
let b2bTrafficInterval = null;
let b2bTotalReqCount = 14831;

function startB2bTrafficSim() {
  if (b2bTrafficInterval) return; // 이미 실행 중

  const logBox = document.getElementById('b2b-traffic-log');
  const countEl = document.getElementById('b2b-req-count');
  if (!logBox) return;

  logBox.innerHTML = getTranslation("[SYSTEM] B2B API 실시간 커넥션 리스너 가동 완료.\n[SYSTEM] 대기열 대기 중...", currentLanguage);

  const apiMethods = ["GET", "POST", "PUT"];
  const apiPaths = ["/api/v2/formulate", "/api/v2/verify/chiljeong", "/api/v2/master/nutrition", "/api/v2/analyze/mechanism"];
  const mockClients = ["CJ_Wellness_Lab", "Ourhome_Rnd", "KGC_Ginseng_Brand", "Pulmuone_Greenfield", "Samsung_Bio_Wellness", "Seoul_Univ_Oriental_Med"];
  const mockConstitutions = ["소음인", "소양인", "태음인", "태양인", "일반"];

  b2bTrafficInterval = setInterval(() => {
    const randomMethod = apiMethods[Math.floor(Math.random() * apiMethods.length)];
    const randomPath = apiPaths[Math.floor(Math.random() * apiPaths.length)];
    const randomClient = mockClients[Math.floor(Math.random() * mockClients.length)];
    const randomConst = mockConstitutions[Math.floor(Math.random() * mockConstitutions.length)];
    const randomConstTranslated = getTranslation(randomConst, currentLanguage);
    const randMs = Math.floor(Math.random() * 45) + 12; // 12ms ~ 57ms

    b2bTotalReqCount += Math.floor(Math.random() * 3) + 1;
    if (countEl) {
      countEl.innerText = b2bTotalReqCount.toLocaleString();
    }

    const timestamp = new Date().toLocaleTimeString();
    let logMsg = `[${timestamp}] ${randomMethod} ${randomPath} - Client: ${randomClient} (${randomConstTranslated}) | Result: 200 OK | Latency: ${randMs}ms`;
    
    // 간혹 경고가 발생하는 로그 연출
    if (Math.random() < 0.1) {
      logMsg = `<span style="color:#ef4444;">[${timestamp}] WARN ${randomPath} - Client: ${randomClient} | ${getTranslation("상극 조합 감지(칠정 상반) ➡️ 엔진 자동 우회(좌사치환) 완료 [403 -> 200 Bypass]", currentLanguage)}</span>`;
    }

    logBox.innerHTML += `\n${logMsg}`;
    logBox.scrollTop = logBox.scrollHeight;

    // 콘솔 크기 조절
    const lines = logBox.innerHTML.split('\n');
    if (lines.length > 50) {
      logBox.innerHTML = lines.slice(lines.length - 50).join('\n');
    }
  }, 2500);
}

function stopB2bTrafficSim() {
  if (b2bTrafficInterval) {
    clearInterval(b2bTrafficInterval);
    b2bTrafficInterval = null;
  }
}

window.startB2bTrafficSim = startB2bTrafficSim;
window.stopB2bTrafficSim = stopB2bTrafficSim;