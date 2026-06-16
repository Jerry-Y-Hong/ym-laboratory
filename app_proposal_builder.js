// Mila Wellness Dynamic Business Proposal Builder

// 7. 동적 사업 제안서 자동 생성기 (Dynamic Proposal Builder)
let generatedProposalMarkdown = '';

const proposalTemplates = {
  ko: `
# 🌿 K-약선요리 글로벌 진출 및 맞춤형 웰니스 협력 제안서
---
**수신:** [PartnerName] 귀중
**발신:** Nuri Laboratory | Mila Premium Wellness
**제안 협력 모델:** [ModelType]
**제안 협력 기간:** [Duration]

---

### 💡 Executive Summary
수천 년 한국 전통 한방 의학(Yakseon)의 지혜를 **AI 기반 추론 엔진**과 정량화 데이터로 설계한 K-웰니스 선도 플랫폼 Nuri Lab입니다. 본 제안서는 [PartnerName]과 함께 글로벌 시장을 선도하고 고부가가치 웰니스 비즈니스를 개척하기 위해 작성되었습니다. 

특히 [PartnerName]의 인프라와 Nuri Lab의 독자 특허인 **7-AXIS 약선 처방 엔진**을 연동하여, [EfficacyText] 기전을 핵심으로 하는 혁신적인 웰니스 식단/원물 밸류체인을 구축하고자 제안합니다.

---

### 📊 시장성 및 비즈니스 기회 (Market Opportunity)
1. **급성장하는 글로벌 아답토젠 및 웰니스 시장**: 2026년 3,200억 달러 규모로 고성장.
2. **K-Wellness 브랜드 위상 강화**: 한국 전통 약선은 세계적인 웰빙 열풍 및 한류(K-Food) 문화와 만나 최적의 성장 적기를 맞이하고 있습니다.
3. **규제 장벽 우회**: 밀키트 완제품 대신 **[ModelType]** 컴포넌트 공급 모델을 적용하여 수입 검역(Quarantine) 및 유관세 장벽을 쉽게 우회하고 높은 영업이익률을 달성합니다.

---

### 🔧 제안 협력 솔루션 (Proposed Solutions)
[Duration] 동안 공동 진행할 [ModelType] 기반 협력 과제입니다:

| 구성 요소 | 제안 및 명세 |
|---|---|
| **처방 엔진 연동** | Nuri Lab의 7-AXIS AI 알고리즘을 통한 개인 사상체질 맞춤형 배합 연동 |
| **핵심 타겟 기전** | **[EfficacyText]** 효능 극대화 및 생리 기전 1:N 매핑 |
| **원료 공급 가동** | HACCP/GMP 인증 저온 동결건조 분말 및 멸균 농축 분말 믹스 조달 |
| **인프라 상생** | 경희대 R&D 학술망 검증 완료 및 지자체 농가 연동 투명 이력 보증 |

---

### 💰 기대 수익 및 마일스톤 (Milestones)
- **1단계 (R&D & PoC)**: [PartnerName] 전용 커스텀 처방 배합 및 시제품 테스트 완료.
- **2단계 (글로벌 런칭)**: 타겟 시장을 대상으로 첫 시제품 공급 및 SaaS API 연동 개시.
- **3단계 (볼륨 확장)**: 공급 물량 확대 및 프랜차이즈 가맹망 연계, 연간 라이선스 전환.

---
### 📞 Call to Action
K-웰니스의 새로운 글로벌 표준을 함께 만들어가기를 고대합니다.

* **공식 문의처:** contact@nurilab.kr
* **온라인 오피스:** https://jerry-y-hong.github.io/sanYacho/
  `,

  en: `
# 🌿 K-Wellness Global Expansion & Customized Partnership Proposal
---
**To:** [PartnerName]
**From:** Nuri Laboratory | Mila Premium Wellness
**Cooperation Model:** [ModelType]
**Proposed Duration:** [Duration]

---

### 💡 Executive Summary
Nuri Laboratory is a pioneering K-Wellness intelligence platform that digitalizes thousands of years of traditional Korean herbal medicine (Yakseon) using our proprietary **7-AXIS Herbal Reasoning Engine**. 

We are pleased to submit this proposal to [PartnerName] to co-develop a high-value wellness pipeline. By integrating our patented Sasang constitutional matching engine with your network, we propose to build an innovative wellness value chain focused on the **[EfficacyText]** physiological mechanism.

---

### 📊 Market & Business Opportunity
1. **Booming Adaptogen & Wellness Economy**: Projecting USD 320 Billion globally by 2026.
2. **K-Wellness Synergy**: Authentic Eastern food therapy is experiencing unprecedented global consumer demand alongside the K-Culture wave.
3. **Quarantine Bypass**: Instead of fresh meals, adopting the **[ModelType]** component structure helps completely bypass international quarantine laws and tariffs, ensuring high profit margins.

---

### 🔧 Proposed Solutions
Over the proposed **[Duration]**, we suggest executing the following:

| Component | Specifications & Action Plans |
|---|---|
| **AI Reasoning Integration** | Integrate Nuri Lab 7-AXIS AI engine to calculate customized formulas in real time. |
| **Target Physiological Efficacy** | Focus on **[EfficacyText]** mechanism to deliver clinically verifiable health benefits. |
| **Supply Chain Execution** | Standardize import-cleared HACCP/GMP freeze-dried powders & low-temp liquid extracts. |
| **Academic Credentials** | Backed by KIOM (Korea Institute of Oriental Medicine) and Kyung Hee University R&D. |

---

### 💰 Milestones & Projections
- **Phase 1 (R&D & PoC)**: Co-design custom formulations for [PartnerName] and finalize recipe testings.
- **Phase 2 (Market Launch)**: Launch the first pilot batch and activate SaaS API integrations.
- **Phase 3 (Scaling)**: Expand supply volume to regional franchise branches and transition to annual subscriptions.

---
### 📞 Call to Action
Let us establish the global standard for personalized preventative nutrition together.

* **Inquiry:** contact@nurilab.kr
* **Website:** https://jerry-y-hong.github.io/sanYacho/
  `,

  ja: `
# 🌿 K-薬膳グローバル進出およびカスタマイズウェルネス提携提案書
---
**御中:** [PartnerName] 様
**差出:** Nuri Laboratory | Mila Premium Wellness
**ご提案モデル:** [ModelType]
**ご提案期間:** [Duration]

---

### 💡 エグゼクティブサマリー
Nuri Laboratoryは、数千年の韓国伝統薬膳（Yakseon）の叡智を、独自開発の**7軸AI薬膳推論エンジン**と国家標準データベースにより数値化・デジタル化したウェルネステック企業です。

本提案書は、[PartnerName]様のインフラと当社の特許技術を融合させ、グローバル市場で高付加価値なウェルネスビジネスを開拓するために作成されました。特に**[EfficacyText]**生理活性機序を核心テーマとした、革新的な薬膳食単・原料バリューチェーンの構築をご提案いたします。

---

### 📊 市場性およびビジネス機会
1. **急成長する健康食品市場**: グローバルアダプトゲン市場は2026年までに3,200億ドル規模に拡大見込み。
2. **K-Wellnessのブランド価値**: 伝統韓方薬膳は、世界的なウェルビーイングブームおよびK-Foodの人気と融合し、今まさに最適な進出時期を迎えています。
3. **検疫リスクのう回**: 生鮮ミールキットの代わりに**[ModelType]**による規格化コンポーネント供給を採用し、各国の動物・植物輸入検疫の壁をう回しつつ、高営業利益率を維持します。

---

### 🔧 ご提案ソリューション
[Duration]の期間中、共同で進める[ModelType]に基づく協業ロードマップです：

| 構成要素 | 具体的なご提案・スペック |
|---|---|
| **AI推論の連動** | Nuri Lab 7軸AIアルゴリズムによる個人の四象体質適合レシピのリアルタイム計算。 |
| **核心ターゲット効能** | **[EfficacyText]**の生理活性の最適化および検証。 |
| **規格原料の納品** | HACCP/GMP認定の低温真空凍結乾燥粉末および濃縮エキスの安定的供給。 |
| **産学・信頼性の確保** | 慶熙大韓医学R&Dおよび韓国韓医学研究院(KIOM)での学術データ検証。 |

---

### 💰 ロードマップおよびマ일ストーン
- **第1段階 (R&D & PoC)**: [PartnerName]様向けの専用カスタマイズ配合設計および試作調理テスト。
- **第2段階 (パイロット発売)**: ターゲット市場での初回生産分の納品およびSaaS API連携の開始。
- **第3段階 (スケールアップ)**: フランチャイズ加盟店舗への供給拡大および年間ライセンス購読モデルへの移行。

---
### 📞 お問い合わせ
K-Wellnessの新たなグローバル基準を共に創り出せることを期待しております。

* **窓口:** contact@nurilab.kr
* **ウェブ:** https://jerry-y-hong.github.io/sanYacho/
  `,

  ar: `
# 🌿 مقترح التوسع العالمي لـ K-Wellness والشراكة المخصصة
---
**إلى:** [PartnerName] الموقرين
**من:** Nuri Laboratory | Mila Premium Wellness
**نموذج التعاون المقترح:** [ModelType]
**مدة الشراكة المقترحة:** [Duration]

---

### 💡 الملخص التنفيذي
يسعدنا في Nuri Laboratory، المنصة الرائدة في مجال ذكاء العافية الكورية التي تقوم برقمنة حكمة الطب الكوري التقليدي عبر **محرك الاستدلال ذو المحاور السبعة (7-AXIS)**، أن نقدم هذا المقترح إلى [PartnerName].

نقترح بناء سلسلة قيمة مبتكرة للأغذية والعافية تركز على آلية **[EfficacyText]** الفسيولوجية، وذلك من خلال دمج خوارزمياتنا الحاصلة على براءات اختراع مع شبكتكم القوية.

---

### 📊 فرصة السوق والأعمال
1. **اقتصاد العافية المتنامي**: تشير التقديرات إلى أن سوق الأغذية الوظيفية العالمي سيصل إلى 320 مليار دولار بحلول عام 2026.
2. **تناغم K-Wellness**: يشهد الطلب على الأغذية الكورية التقليدية الصحية ارتفاعًا غير مسبوق عالميًا متماشيًا مع موجة الكي-ثقافة.
3. **تجاوز عقبات الحجر الصحي**: بدلاً من تصدير الوجبات الطازجة المعرضة للتلف، يساعد تبني نموذج **[ModelType]** في تجفيف وتجميد المكونات على تجاوز عقبات الحجر الجمركي بالكامل مع الحفاظ على هوامش ربح ممتازة.

---

### 🔧 الحلول المقترحة
على مدار فترة **[Duration]**، نقترح تنفيذ الحلول التالية:

| المكون | المواصفات وخطط العمل |
|---|---|
| **تكامل الذكاء الاصطناعي** | ربط محرك 7-AXIS لحساب التركيبات المخصصة للدستور الجسدي فورياً. |
| **الفعالية الفسيولوجية المستهدفة** | التركيز على آلية **[EfficacyText]** لتقديم فوائد صحية معتمدة. |
| **تأمين سلاسل الإمداد** | توفير مساحيق جافة معتمدة من HACCP/GMP ومستخلصات سائلة مركزة. |
| **الموثوقية الأكاديمية** | مدعوم بالأبحاث السريرية لمعهد الطب الكوري (KIOM) وجامعة كيونغ هي. |

---

### 💰 المعالم والتوقعات
- **المرحلة 1 (البحث والتحقق)**: تصميم تركيبات مخصصة لـ [PartnerName] وإكمال اختبارات الوصفات.
- **المرحلة 2 (الإطلاق التجريبي)**: توفير الدفعة التجريبية الأولى وتنشيط تكامل واجهة برمجة تطبيقات SaaS.
- **المرحلة 3 (التوسع)**: زيادة حجم التوريد وربطه بفروع الامتياز والتحول إلى اشتراك سنوي.

---
### 📞 تواصل معنا
تواصلوا معنا لتأسيس المعايير العالمية للعافية الشخصية معًا.

* **البريد الإلكتروني:** contact@nurilab.kr
* **الموقع الإلكتروني:** https://jerry-y-hong.github.io/sanYacho/
  `
};

const efficacyLocalizations = {
  respiratory: {
    ko: '호흡기 보호 및 기관지 건조 완화 (Respiratory Protection)',
    en: 'Respiratory protection & bronchodilator relief',
    ja: '呼吸器保護および肺乾燥の緩和 (Respiratory Protection)',
    ar: 'حماية الجهاز التنفسي وتخفيف جفاف الشعب الهوائية'
  },
  vitality: {
    ko: '만성 피로 개선 및 전신 기력 보충 (Restore Vitality)',
    en: 'Chronic fatigue recovery & total energy restoration',
    ja: '慢性疲労改善および全身の気力回復 (Restore Vitality)',
    ar: 'استعادة الطاقة ومكافحة التعب المزمن'
  },
  digestive: {
    ko: '위장 소화 기능 개선 및 건비위 (Digestive Wellness)',
    en: 'Stomach digestion enhancement & spleen regulation',
    ja: '胃腸消化機能改善および健脾胃 (Digestive Wellness)',
    ar: 'تعزيز الهضم وتنظيم وظائف المعدة والطحال'
  },
  joint: {
    ko: '근골격계 보호 및 관절 요통 완화 (Joint & Bone Strength)',
    en: 'Musculoskeletal protection & arthritis relief',
    ja: '筋骨格系保護および関節痛・腰痛の緩和 (Joint & Bone Strength)',
    ar: 'حماية الجهاز العضلي الهيكلي وتخفيف آلام المفاصل'
  },
  detox: {
    ko: '숙취 해소 및 간 기능 해독 보호 (Liver Protection & Detox)',
    en: 'Alcohol hangover relief & hepatoprotective detox',
    ja: '二日酔い解消および肝機能保護・解毒 (Liver Protection & Detox)',
    ar: 'تخفيف مخلفات الكحول وحماية الكبد من السموم'
  }
};

const modelLocalizations = {
  saas: {
    ko: 'IP & 처방 알고리즘 SaaS API 라이선싱',
    en: 'IP & Recipe Algorithm SaaS API Licensing',
    ja: 'IP＆処方アルゴリズムSaaS APIライセンス契約',
    ar: 'ترخيص واجهة برمجة تطبيقات خوارزمية SaaS للملكية الفكرية والوصفات'
  },
  source: {
    ko: '핵심 약리 원료 & 건식 소스 표준화 Component 모델',
    en: 'Standardized Dry Ingredient & Component Source Export',
    ja: '規格化伝統原料・乾燥調味料コンポーネントモデル',
    ar: 'تصدير المكونات الجافة الموحدة والصلصات القياسية'
  },
  d2c: {
    ko: 'D2C 글로벌 큐레이션 이커머스 쇼핑몰 연동',
    en: 'D2C Global Curated E-commerce Mall Integration',
    ja: 'D2CグローバルキュレーションECモール出店連携',
    ar: 'تكامل متجر التجارة الإلكترونية المنسق العالمي D2C'
  },
  academy: {
    ko: '미디어 쿠킹 클래스 & 글로벌 인증 아카데미 개설',
    en: 'Media Cooking Masterclass & Global Academy launch',
    ja: 'メディア料理教室＆グローバル認定アカデミー開設',
    ar: 'إطلاق دورات طهي تعليمية وأكاديمية معتمدة عالمياً'
  }
};

const durationLocalizations = {
  poc: {
    ko: '3개월 단기 기술 실증 (PoC)',
    en: '3-Month Proof of Concept (PoC)',
    ja: '3ヶ月短期技術実証 (PoC)',
    ar: 'إثبات المفاهيم (PoC) لمدة 3 أشهر'
  },
  '1y': {
    ko: '1개년 파일럿 파트너십 계약',
    en: '1-Year Pilot Partnership Agreement',
    ja: '1年間パイロットパートナーシップ契約',
    ar: 'اتفاقية شراكة تجريبية لمدة عام واحد'
  },
  '3y': {
    ko: '3개년 다각화 공동 사업화 (전략적 제휴)',
    en: '3-Year Strategic Commercialization Alliance',
    ja: '3年間多角化共同事業化（戦略的アライアンス）',
    ar: 'تحالف تجاري استراتيجي لمدة 3 سنوات'
  }
};

function generateDynamicProposal() {
  const partnerName = document.getElementById('builder-partner-name').value.trim() || '경희대학교 F&B R&D';
  const targetMarket = document.getElementById('builder-target-market').value;
  const coopModel = document.getElementById('builder-coop-model').value;
  const coopDuration = document.getElementById('builder-coop-duration').value;
  const focusEfficacy = document.getElementById('builder-focus-efficacy').value;

  const template = proposalTemplates[targetMarket] || proposalTemplates.ko;

  // Localized values based on the targetMarket selection
  const effText = (efficacyLocalizations[focusEfficacy] && efficacyLocalizations[focusEfficacy][targetMarket])
    || efficacyLocalizations[focusEfficacy].ko;
  const modelText = (modelLocalizations[coopModel] && modelLocalizations[coopModel][targetMarket])
    || modelLocalizations[coopModel].ko;
  const durationText = (durationLocalizations[coopDuration] && durationLocalizations[coopDuration][targetMarket])
    || durationLocalizations[coopDuration].ko;

  // Replacing tokens
  let proposal = template
    .replace(/\[PartnerName\]/g, partnerName)
    .replace(/\[ModelType\]/g, modelText)
    .replace(/\[Duration\]/g, durationText)
    .replace(/\[EfficacyText\]/g, effText);

  generatedProposalMarkdown = proposal;

  // Rendering
  const preview = document.getElementById('builder-proposal-preview');
  const resultContainer = document.getElementById('builder-result-container');
  if (preview && resultContainer) {
    preview.innerHTML = renderMarkdownToHtml(proposal);
    resultContainer.style.display = 'block';
    
    // Smooth scroll down to preview
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function copyProposalToClipboard() {
  if (!generatedProposalMarkdown) return;
  navigator.clipboard.writeText(generatedProposalMarkdown)
    .then(() => {
      alert(getTranslation('제안서 마크다운 텍스트가 클립보드에 복사되었습니다.', currentLanguage));
    })
    .catch(err => {
      console.error('Copy failed', err);
      alert(getTranslation('복사에 실패했습니다. 직접 드래그하여 복사해 주세요.', currentLanguage));
    });
}

function downloadProposalAsMarkdown() {
  if (!generatedProposalMarkdown) return;
  
  const partnerName = document.getElementById('builder-partner-name').value.trim() || 'Partner';
  const targetMarket = document.getElementById('builder-target-market').value;
  
  const filename = `proposal_${partnerName.replace(/[^a-zA-Z0-9가-힣]/g, '_')}_${targetMarket}.md`;
  
  const blob = new Blob([generatedProposalMarkdown], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

window.generateDynamicProposal = generateDynamicProposal;
window.copyProposalToClipboard = copyProposalToClipboard;
window.downloadProposalAsMarkdown = downloadProposalAsMarkdown;