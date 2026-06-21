/**
 * app_beauty.js — 피부·다이어트 탭 v3.1.0
 * 내복용(內服, 먹는 처방) + 외부용(外用, 바르는 처방) 이중 처방 및 연동 시스템
 */

/* global getTranslation, setShopCategory, switchTab, enterPlatform, currentLanguage, currentPersona, handleRndSearch, renderShopProducts, shopCurrentCategory */

'use strict';

// ─── 전역 상태 ───────────────────────────────────────────
let beautyData = null;
let beautySelectedConcerns = [];
let beautySelectedGoals    = [];
let beautyQuizCurrentStep = -1; // -1: Not started, 0~2: In progress, 3: Completed
let beautyQuizAnswers = [];
let beautyCurrentSubProgram = 'skin'; // 'skin' | 'diet'

const BEAUTY_QUIZ_QUESTIONS = [
  {
    q_ko: "평소 추위와 더위 중 어느 쪽을 더 심하게 느끼시나요? (신체 온도 반응)",
    q_en: "Do you feel colder or hotter compared to others? (Heat/Cold Tolerance)",
    q_ja: "普段、寒さと暑さのどちらをより強く感じますか？ (寒熱反応)",
    q_ar: "هل تشعر بالبرد أم بالحرارة أكثر مقارنة بالآخرين؟",
    options: [
      { 
        text_ko: "❄️ 추위를 많이 타고 따뜻한 음식을 좋아해요.", 
        text_en: "❄️ Sensitive to cold, prefer warm food/drinks.",
        text_ja: "❄️ 寒がりで 温かい食べ物が好きです。",
        text_ar: "❄️ أشعر بالبرد سريعاً وأفضل الأطعمة الدافئة.",
        type: "soeum" 
      },
      { 
        text_ko: "🔥 더위를 참기 힘들고 시원한 음식을 선호해요.", 
        text_en: "🔥 Sensitive to heat, prefer cool food/drinks.",
        text_ja: "🔥 暑がりで 冷たい食べ物が好きです。",
        text_ar: "🔥 لا أتحمل الحرارة وأفضل الأطعمة والمشروبات الباردة.",
        type: "soyang" 
      },
      { 
        text_ko: "💦 추위/더위 둘 다 타며, 특히 땀을 비 오듯 많이 흘려요.", 
        text_en: "💦 Feel both, but sweat heavily especially in summer.",
        text_ja: "💦 暑さ寒さ両方苦手で、特にたくさん汗をかきます。",
        text_ar: "💦 أشعر بالثنائي، وأعرق بغزارة خاصة في الصيف.",
        type: "taeeum" 
      },
      { 
        text_ko: "⚡ 더위를 많이 타며, 얼굴과 머리 쪽으로 열감이 몰려요.", 
        text_en: "⚡ Sensitive to heat, with hot flashes in face and head.",
        text_ja: "⚡ 暑がりで、特に顔や頭에 열(熱)이 こもる感じがします。",
        text_ar: "⚡ أشعر بالحرارة كثيراً، وتتركز السخونة في الرأس والوجه.",
        type: "taeyang" 
      }
    ]
  },
  {
    q_ko: "식사 후 소화 상태나 위장(비위) 기능은 어떤 편인가요? (소화 기능)",
    q_en: "How is your digestion and stomach function after eating?",
    q_ja: "食後の消化状態や胃腸機能はどのような感じですか？",
    q_ar: "كيف هي حالة الهضم ووظيفة المعدة بعد تناول الطعام؟",
    options: [
      { 
        text_ko: "🤢 위장이 약해 소화가 잘 안 되거나 잘 얹혀요.", 
        text_en: "🤢 Weak stomach, frequent indigestion or bloating.",
        text_ja: "🤢 胃腸이 약해 消化不良になりやすいです。",
        text_ar: "🤢 معدتي ضعيفة، وأعاني كثيراً من عسر الهضم أو الانتفاخ.",
        type: "soeum" 
      },
      { 
        text_ko: "😋 소화력이 좋고 쉽게 배가 고파져요.", 
        text_en: "😋 Excellent digestion, feel hungry quickly.",
        text_ja: "😋 消化力が良く、すぐにお腹が空きます。",
        text_ar: "😋 هضم ممتاز وأشعر بالجوع سريعاً.",
        type: "soyang" 
      },
      { 
        text_ko: "🍖 식욕이 매우 왕성하고 무엇이든 가리지 않고 잘 먹어요.", 
        text_en: "🍖 Strong appetite, eat anything without trouble.",
        text_ja: "🍖 食欲旺盛で、好き嫌いなく何でもよく食べます。",
        text_ar: "🍖 شهية قوية للغاية، وآكل أي شيء دون مشاكل.",
        type: "taeeum" 
      },
      { 
        text_ko: "🤢 소화는 되지만 자주 메스껍거나 게우는 느낌이 있어요.", 
        text_en: "🤢 Digestion is okay, but sometimes feel nauseous.",
        text_ja: "🤢 消化はできますが、たまに吐き気がすることがあります。",
        text_ar: "🤢 الهضم طبيعي، لكن أحياناً أشعر بالغثيان.",
        type: "taeyang" 
      }
    ]
  },
  {
    q_ko: "평소 신체 골격(체격)이나 땀을 흘렸을 때의 컨디션은 어떠한가요? (체격 및 땀 분비)",
    q_en: "What is your body frame type and how do you feel after sweating?",
    q_ja: "普段の体格や、汗をかいたときのコンディションはどうですか？",
    q_ar: "ما هو نمط بنيتك الجسدية وكيف تشعر بعد التعرّق؟",
    options: [
      { 
        text_ko: "🏃 상체에 비해 하체가 발달했고, 땀을 흘리면 쉽게 피곤해요.", 
        text_en: "🏃 Underdeveloped chest but solid hips, feel fatigued after sweating.",
        text_ja: "🏃 上半身より下半身が発達していて、汗をかくと疲れやすいです。",
        text_ar: "🏃 الجزء السفلي متطور مقارنة بالعلوي، وأشعر بالتعب بعد التعرّق.",
        type: "soeum" 
      },
      { 
        text_ko: "🤸 어깨/가슴이 발달하고 하체가 왜소해요, 땀이 별로 없어요.", 
        text_en: "🤸 Broad shoulders/chest but weak hips, do not sweat much.",
        text_ja: "🤸 肩や胸が発達していて下半身が細めです。汗はあまりかきません。",
        text_ar: "🤸 الكتف والصدر متطوران لكن الجزء السفلي ضعيف، ولا أعرق كثيراً.",
        type: "soyang" 
      },
      { 
        text_ko: "🏋️ 골격이 크고 허리가 튼튼하며, 땀을 흘리면 오히려 개운해요.", 
        text_en: "🏋️ Large frame, strong waist, feel refreshed after sweating.",
        text_ja: "🏋️ 体格が良く腰回りがしっかりしていて、汗をかくとすっきりします。",
        text_ar: "🏋️ بنية جسدية ضخمة وخصر قوي, وأشعر بالنشاط والراحة بعد التعرّق.",
        type: "taeeum" 
      },
      { 
        text_ko: "🚶 목덜미가 굵고 튼튼하지만, 다리가 약해 오래 걷기 힘들어요.", 
        text_en: "🚶 Strong neck/upper body but weak legs, hard to walk long.",
        text_ja: "🚶 首回りが太くてしっかりしていますが、脚が弱く長く歩けません。",
        text_ar: "🚶 الرقبة عريضة وقوية، لكن الساقين ضعيفتان ويصعب المشي طويلاً.",
        type: "taeyang" 
      }
    ]
  }
];

const CONCERN_META = {
  acne: { 
    icon: '🔴', 
    label_ko: '여드름 · 트러블', 
    label_en: 'Acne & Blemishes', 
    label_ja: 'ニキビ・吹き出物', 
    label_ar: 'حب الشباب',
    desc_ko: '피지 과다 분비 및 염증성 피부 트러블 완화',
    desc_en: 'Soothe excess sebum and inflammatory skin trouble',
    desc_ja: '過剰な皮脂分泌と炎症性トラブルの緩和',
    desc_ar: 'تهدئة الإفرازات الدهنية الزائدة والتهابات البشرة'
  },
  dryness: { 
    icon: '💧', 
    label_ko: '건조 · 민감',     
    label_en: 'Dryness & Sensitivity', 
    label_ja: '乾燥・敏感肌', 
    label_ar: 'الجفاف والحساسية',
    desc_ko: '진액 부족으로 인한 가려움, 각질 및 건조함 개선',
    desc_en: 'Relieve dryness, itchiness & restore hydration',
    desc_ja: '津液不足によるかゆみ、角質および乾燥の改善',
    desc_ar: 'تخفيف الجفاف والحكة واستعادة الرطوبة المفقودة'
  },
  pigmentation: { 
    icon: '🌑', 
    label_ko: '색소 · 칙칙함',   
    label_en: 'Pigmentation & Dullness', 
    label_ja: 'シミ・くすみ', 
    label_ar: 'التصبغات والبشرة الباهتة',
    desc_ko: '기미, 주근깨 및 어두운 피부 톤의 맑은 미백',
    desc_en: 'Brighten dark spots, freckles & uneven skin tone',
    desc_ja: 'しみ、そばかすおよび暗い肌トーンの清らかな美白',
    desc_ar: 'تفتيح البقع الداكنة والنمش وتوحيد لون البشرة'
  },
  aging: { 
    icon: '⏳', 
    label_ko: '노화 · 주름',     
    label_en: 'Aging & Wrinkles', 
    label_ja: '老化・しわ', 
    label_ar: 'الشيخوخة والتجاعيد',
    desc_ko: '피부 탄력 저하, 잔주름 및 노화 세포 재생',
    desc_en: 'Target skin elasticity, fine lines & cell renewal',
    desc_ja: '肌の弾力低下、小じわおよび老化細胞の再生',
    desc_ar: 'استهداف مرونة البشرة والتجاعيد وتجديد الخلايا'
  },
  edema: { 
    icon: '🌊', 
    label_ko: '부종 · 순환',     
    label_en: 'Puffiness & Circulation', 
    label_ja: 'むくみ・血行', 
    label_ar: 'الانتفاخ والدورة الدموية',
    desc_ko: '얼굴 붓기 및 림프 순환 정체로 인한 부종 완화',
    desc_en: 'Reduce facial puffiness & improve lymph circulation',
    desc_ja: '顔のむくみおよびリンパ循環の滞りによる浮腫の緩和',
    desc_ar: 'تقليل انتفاخ الوجه وتحسين الدورة الليمفاوية'
  },
  brightening: { 
    icon: '✨', 
    label_ko: '미백 · 광채',     
    label_en: 'Brightening & Radiance', 
    label_ja: '美白・輝き', 
    label_ar: 'التفتيح والإشراق',
    desc_ko: '칙칙한 안색을 맑고 화사하게 생기 부여',
    desc_en: 'Restore vibrant radiance & clear complexion',
    desc_ja: 'くすんだ肌色を清らかで華やかに活力を付与',
    desc_ar: 'إعادة النضارة المشرقة للبشرة الباهتة وتفتيحها'
  },
};

const GOAL_META = {
  weightloss: { 
    icon: '⚖️', 
    label_ko: '체중 감량',    
    label_en: 'Weight Loss', 
    label_ja: '体重減量', 
    label_ar: 'خسارة الوزن',
    desc_ko: '체지방 연소 촉진 및 체중 조절을 위한 식이 조절',
    desc_en: 'Promote fat burn & dietary weight control',
    desc_ja: '体脂肪燃焼促進および体重調節のための食事調節',
    desc_ar: 'تعزيز حرق الدهون والتحكم في الوزن عن طريق الغذاء'
  },
  muscle: { 
    icon: '💪', 
    label_ko: '근력 · 체형 유지', 
    label_en: 'Muscle & Body Tone', 
    label_ja: '筋力・体型維持', 
    label_ar: 'القوة العضلية',
    desc_ko: '근손실 방지 및 체형 유지를 위한 고단백 양생',
    desc_en: 'Maintain body tone & high-protein nourishment',
    desc_ja: '筋損失防止および体型維持のための高タンパク養生',
    desc_ar: 'الحفاظ على قوام الجسم وتغذيته بالبروتينات العالية'
  },
  bloating: { 
    icon: '🫧', 
    label_ko: '부종 제거',     
    label_en: 'Bloating & Edema', 
    label_ja: 'むくみ解消', 
    label_ar: 'إزالة الانتفاخ',
    desc_ko: '체내 수분 대사 원활 및 신체 붓기 조속 해소',
    desc_en: 'Soothe swelling & enhance water metabolism',
    desc_ja: '体内の水分代謝の円滑化および浮腫の速やかな解消',
    desc_ar: 'تحسين عملية تصريف المياه وتخفيف التورم العام'
  },
  metabolism: { 
    icon: '🔥', 
    label_ko: '대사 촉진',     
    label_en: 'Metabolism Boost', 
    label_ja: '代謝促進', 
    label_ar: 'تعزيز الأيض',
    desc_ko: '체온 상승 및 기초 대사량 활성화',
    desc_en: 'Enhance basal metabolism & warm body core',
    desc_ja: '体温上昇および基礎代謝量の活性化',
    desc_ar: 'زيادة معدل الأيض الأساسي وتدفئة مركز الجسم'
  },
};

const CONSTITUTION_MAP = {
  soyang: '소양인', soeum: '소음인', taeeum: '태음인', taeyang: '태양인',
};

const BEAUTY_BRIDGE_META = {
  skin: {
    soyang: {
      ko: "소양인은 위장의 과열로 피지가 쉽게 분비됩니다. 체내 열을 식히고 순환을 돕는 [소양인 다이어트 케어] 프로그램 식단을 병행하시면, 피부 트러블의 근본적인 예방에 시너지 효과를 낼 수 있습니다.",
      en: "Soyang-in has excess stomach heat, leading to easy sebum secretion. Combining the cooling [Soyang Diet Care] program meal plan will synergize for root prevention of skin troubles.",
      ja: "少陽人は胃の過熱により皮脂が分泌されやすいです。体内の熱을 식히고 순환을 돕는 「少陽人ダイエットケア」の食事法を並行すると, 根本的な予防にシナジー効果を発揮します。",
      ar: "شخص السويانغ يعاني من حرارة معدية زائدة تؤدي لإفراز دهني سهل. الجمع بين حمية [السويانغ للعناية بالوزن] سيساعد على الوقاية الجذرية.",
      btn_ko: "👉 다이어트 처방 제안 보기",
      btn_en: "👉 View Diet Care Proposals",
      btn_ja: "👉 ダイエット処方提案を見る",
      btn_ar: "👉 عرض مقترحات رعاية الحمية"
    },
    soeum: {
      ko: "소음인은 위장 기능이 차가워지면 혈액 순환이 저하되어 안색이 어두워지기 쉽습니다. 몸을 따뜻하게 하고 위장을 보호하는 [소음인 다이어트 케어] 양생법을 병행하시면 피부 탄력과 생기 복원에 도움이 됩니다.",
      en: "Soeum-in easily gets cold stomach, lowering circulation and dulling complexion. Combining [Soeum Diet Care] to warm and protect the stomach helps restore skin elasticity and vitality.",
      ja: "少陰人は胃腸が冷えると血行が低下し、顔色がくすみやすくなります。体を温め胃腸を保護する「少陰人ダイエットケア」を並行すると, 弾力と生気の回復に役立ちます。",
      ar: "شخص السويم يعاني من برودة المعدة وضعف الدورة الدموية. الجمع بين [السويم للعناية بالوزن] يساعد في استعادة مرونة البشرة وحيويتها.",
      btn_ko: "👉 다이어트 처방 제안 보기",
      btn_en: "👉 View Diet Care Proposals",
      btn_ja: "👉 ダイエット処方提案を見る",
      btn_ar: "👉 عرض مقترحات رعاية الحمية"
    },
    taeeum: {
      ko: "태음인은 수분 대사가 정체되면 피부가 탁해지고 부종이 생기기 쉽습니다. 기혈 순환을 돕고 노폐물을 배출하는 [태음인 다이어트 케어]를 병행하시면 피부 톤 개선과 부종 완화에 시너지를 낼 수 있습니다.",
      en: "Taeeum-in easily accumulates water, leading to dull skin and edema. Combining [Taeeum Diet Care] to boost circulation and expel waste will synergize skin tone improvement and swelling relief.",
      ja: "太陰人は水分代謝が滞ると肌がくすみ、浮腫が生じやすくなります. 気血의 순환을 돕고 노폐물을 배출하는 「太陰人ダイエットケア」を並行すると, トーン改善と浮腫緩和にシナジーを発揮します。",
      ar: "شخص التايوم يعاني من احتباس السوائل وتراكم الفضلات. الجمع بين [التايوم للعناية بالوزن] يساعد في تحسين لون البشرة وتقليل الانتفاخ.",
      btn_ko: "👉 다이어트 처방 제안 보기",
      btn_en: "👉 View Diet Care Proposals",
      btn_ja: "👉 ダイエット処方提案を見る",
      btn_ar: "👉 عرض مقترحات رعاية الحمية"
    },
    taeyang: {
      ko: "태양인은 기운이 위로 솟구쳐 오르면 얼굴에 건조함이나 붉은 기가 생기기 쉽습니다. 기운을 아래로 내리고 진액 흡수를 돕는 [태양인 다이어트 케어]를 병행하시면 피부 안정이 더욱 빨라집니다.",
      en: "Taeyang-in suffers from rising energy, causing facial dryness or redness. Combining [Taeyang Diet Care] to bring energy down and absorb fluids will accelerate skin soothing.",
      ja: "太陽人は気が上기하면, 얼굴에 건조함이나 붉은 기가 생기기 쉽습니다. 기운을 아래로 내리고 진액의 흡수를 돕는 「太陽人ダイエットケア」を並行すると, 피부 안정이 더욱 빨라집니다.",
      ar: "شخص التايانغ يعاني من صعود الطاقة، مما يسبب جفاف أو احمرار الوجه. الجمع بين [التايانغ للعناية بالوزن] لإنزال الطاقة سيساعد في تهدئة البشرة بشكل أسرع.",
      btn_ko: "👉 다이어트 처방 제안 보기",
      btn_en: "👉 View Diet Care Proposals",
      btn_ja: "👉 다이어트 처방 제안 보기",
      btn_ar: "👉 عرض مقترحات رعاية الحمية"
    }
  },
  diet: {
    soyang: {
      ko: "소양인이 식단을 급격히 조절하면 체내 진액(수분)이 함께 마르기 쉬워 피부가 푸석해질 수 있습니다. 진액을 보충해 주는 [소양인 피부 케어] 처방을 참고하셔서 건조함 없는 탄탄한 다이어트를 완성해 보세요.",
      en: "If Soyang-in cuts diet drastically, bodily fluids dry out easily, making skin dry/rough. Refer to [Soyang Skin Care] to replenish moisture for a healthy diet without dryness.",
      ja: "少陽人が食事制限を急激に行うと、体内の津液（水分）が乾きやすく肌がカサつく原因になります. 津液을 보충해 주는 「少陽人スキンケア」処方を参考に, 乾燥のない健康的なダイエットを完成させましょう.",
      ar: "إذا قلل شخص السويانغ طعامه فجأة، تجف سوائل جسمه وتصبح بشرته جافة. راجع [السويانغ للعناية بالبشرة] لترطيب البشرة وحمايتها.",
      btn_ko: "👉 피부 진정 처방 보기",
      btn_en: "👉 View Skin Care Prescription",
      btn_ja: "👉 스킨케어 처방 보기",
      btn_ar: "👉 عرض وصفة العناية بالبشرة"
    },
    soeum: {
      ko: "소음인은 영양 섭취가 부족해지면 피부 장벽이 쉽게 약화되고 각질이 발생할 수 있습니다. 위장을 보호하고 피부에 보습을 주는 [소음인 피부 케어] 처방을 병행하여 맑은 탄력을 유지해 보세요.",
      en: "Soeum-in easily suffers from a weakened skin barrier and flakiness when nutrients run low. Combine [Soeum Skin Care] to protect the stomach and hydrate skin for clear elasticity.",
      ja: "少陰人は栄養摂取が不足すると肌バリアが弱まり, 각질이 발생할 수 있습니다. 위장을 보호하고 피부에 보습을 주는 「少陰人スキンケア」処方を並行し, 透明感のある弾力を維持してください.",
      ar: "شخص السويم يعاني من ضعف حاجز البشرة عند قلة التغذية. اجمع بين [السويم للعناية بالبشرة] لحماية المعدة وترطيب البشرة.",
      btn_ko: "👉 피부 진정 처방 보기",
      btn_en: "👉 View Skin Care Prescription",
      btn_ja: "👉 스킨케어 처방 보기",
      btn_ar: "👉 عرض وصفة العناية بالبشرة"
    },
    taeeum: {
      ko: "태음인은 다이어트 시 체내 노폐물이 배출되는 과정에서 피부 트러블이 올라올 수 있습니다. 기혈 순환과 독소 배출을 돕는 [태음인 피부 케어]를 함께 관리해 주시면 매끄러운 바디 라인과 피부를 동시에 가질 수 있습니다.",
      en: "Taeeum-in may experience skin breakouts as waste is expelled during diet. Combine [Taeeum Skin Care] to support blood circulation and detoxification for smooth body line and skin.",
      ja: "太陰人はダイエット中に老廃物が排出される過程で、肌トラブルが浮き出ることがあります. 기혈 순환과 독소 배출을 돕는 「太陰人スキンケア」を同時に管理し, 滑らかなラインと美肌を手に入れましょう.",
      ar: "شخص التايوم قد يعاني من طفح جلدي أثناء طرد السموم في الحمية. اجمع بين [التايوم للعناية بالبشرة] لتنشيط الدورة وتطهير الجسم.",
      btn_ko: "👉 피부 진정 처방 보기",
      btn_en: "👉 View Skin Care Prescription",
      btn_ja: "👉 스킨케어 처방 보기",
      btn_ar: "👉 عرض وصفة العناية بالبشرة"
    },
    taeyang: {
      ko: "태양인은 다이어트로 기운이 지나치게 소모되면 피부가 극도로 예민해질 수 있습니다. 상승하는 열을 가라앉히고 피부를 보호하는 [태양인 피부 케어] 처방을 병행해 보세요.",
      en: "Taeyang-in's skin can become extremely sensitive when energy is depleted from dieting. Combine [Taeyang Skin Care] to cool down rising heat and protect the skin barrier.",
      ja: "太陽人はダイエットにより気が消耗しすぎると, 肌が極度に敏感になることがあります. 상승하는 열을 가라앉히고 피부를 보호하는 「太陽人皮膚ケア」処方を並行してみてください.",
      ar: "شخص التايانغ تصبح بشرته حساسة للغاية عند استنفاد الطاقة في الحمية. اجمع بين [التايانغ للعناية بالبشرة] لتبريد الحرارة وحماية البشرة.",
      btn_ko: "👉 피부 진정 처방 보기",
      btn_en: "👉 View Skin Care Prescription",
      btn_ja: "👉 스킨케어 처방 보기",
      btn_ar: "👉 عرض وصفة العناية بالبشرة"
    }
  }
};

function renderBeautyBridgeCard(constitution, currentProgram) {
  const lang = typeof currentLanguage !== 'undefined' ? currentLanguage : 'ko';
  const meta = BEAUTY_BRIDGE_META[currentProgram] && BEAUTY_BRIDGE_META[currentProgram][constitution];
  if (!meta) return '';

  const text = meta[lang] || meta.ko;
  const btnText = meta[`btn_${lang}`] || meta.btn_ko;
  const targetProgram = currentProgram === 'skin' ? 'diet' : 'skin';
  const title = currentProgram === 'skin' 
    ? (lang === 'ko' ? '💡 체질 맞춤형 다이어트 시너지 가이드' : lang === 'ja' ? '💡 体質別ダイエット相乗効果ガイド' : lang === 'ar' ? '💡 دليل تآزر النظام الغذائي الدستوري' : '💡 Constitutional Diet Synergy Guide') 
    : (lang === 'ko' ? '💡 다이어트 중 피부 장벽 보호 가이드' : lang === 'ja' ? '💡 ダイエット中の肌バリア保護ガイド' : lang === 'ar' ? '💡 حماية حاجز البشرة أثناء الحمية' : '💡 Skin Barrier Protection During Diet');

  return `
    <div class="beauty-bridge-card glass-panel" style="margin-top: 30px; padding: 22px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); display: flex; flex-direction: column; gap: 12px; align-items: flex-start; text-align: left; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);">
      <div style="font-weight: 800; font-size: 0.92rem; color: var(--accent); display: flex; align-items: center; gap: 6px;">
        <span>${title}</span>
      </div>
      <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.6; margin: 0; word-break: keep-all;">${text}</p>
      <button class="btn btn-outline" onclick="switchBeautyProgram('${targetProgram}')" style="font-size: 0.78rem; padding: 8px 16px; border-radius: 8px; font-weight: 700; align-self: flex-start; margin-top: 4px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: #fff; transition: all 0.2s;">
        <span>${btnText}</span>
      </button>
    </div>
  `;
}

// ─── 초기화 ──────────────────────────────────────────────
async function initBeautyTab() {
  if (!beautyData) {
    try {
      const res = await fetch('data/yakseon_beauty_diet.json');
      beautyData = await res.json();
    } catch (e) {
      console.error('Beauty data load failed:', e);
      return;
    }
  }
  renderBeautyStep1();
}

// ─── STEP 1: 체질 확인 & 고민 선택 ───────────────────────
function renderBeautyStep1() {
  const section = document.getElementById('tab-beauty');
  if (!section) return;

  const lang = typeof currentLanguage !== 'undefined' ? currentLanguage : 'ko';
  const constitution = getDetectedConstitution();
  const hasSelection = beautyCurrentSubProgram === 'skin' ? beautySelectedConcerns.length > 0 : beautySelectedGoals.length > 0;

  section.innerHTML = `
    <div class="beauty-container">
      <!-- 헤더 -->
      <div class="beauty-header glass-panel">
        <div class="beauty-header-icon">🌸</div>
        <div>
          <h2 class="beauty-title" data-i18n="beauty_tab_title">${getTranslation('beauty_tab_title', lang)}</h2>
          <p class="beauty-subtitle" data-i18n="beauty_tab_subtitle">${getTranslation('beauty_tab_subtitle', lang)}</p>
        </div>
      </div>
 
      <!-- 프로그램 모드 전환 탭 스위처 -->
      <div class="beauty-program-switcher glass-panel">
        <button class="switcher-btn skin-btn ${beautyCurrentSubProgram === 'skin' ? 'active' : ''}" onclick="switchBeautyProgram('skin')">
          <span data-i18n="beauty_program_skin">${getTranslation('beauty_program_skin', lang)}</span>
        </button>
        <button class="switcher-btn diet-btn ${beautyCurrentSubProgram === 'diet' ? 'active' : ''}" onclick="switchBeautyProgram('diet')">
          <span data-i18n="beauty_program_diet">${getTranslation('beauty_program_diet', lang)}</span>
        </button>
      </div>
 
      <!-- 체질 표시 배너 -->
      ${renderConstitutionBanner(constitution, lang)}
 
      <!-- 체질 자가진단 퀴즈 영역 -->
      <div id="beauty-quiz-card-wrapper" style="margin-bottom: 24px;"></div>
 
      ${beautyCurrentSubProgram === 'skin' ? `
      <!-- 피부 고민 선택 -->
      <div class="beauty-section glass-panel">
        <div class="beauty-section-label">
          <span class="beauty-section-icon">💎</span>
          <span data-i18n="beauty_skin_concern">${getTranslation('beauty_skin_concern', lang)}</span>
          <span class="beauty-section-hint" data-i18n="beauty_multiselect_hint">${getTranslation('beauty_multiselect_hint', lang)}</span>
        </div>
        <div class="concern-grid">
          ${Object.entries(CONCERN_META).map(([key, meta]) => {
            const isSelected = beautySelectedConcerns.includes(key);
            const label = getTranslation(meta[`label_${lang}`] || meta.label_ko, lang);
            const desc = getTranslation(meta[`desc_${lang}`] || meta.desc_ko, lang);
            return `
              <button class="concern-card ${isSelected ? 'selected' : ''}" id="concern-${key}" onclick="toggleConcern('${key}')">
                <div class="card-header-beauty">
                  <span class="concern-icon">${meta.icon}</span>
                  <span class="select-indicator"></span>
                </div>
                <div class="card-body-beauty">
                  <span class="concern-label">${label}</span>
                  <p class="concern-desc">${desc}</p>
                </div>
              </button>
            `;
          }).join('')}
        </div>
      </div>
      ` : `
      <!-- 다이어트 목표 선택 -->
      <div class="beauty-section glass-panel">
        <div class="beauty-section-label">
          <span class="beauty-section-icon">🎯</span>
          <span data-i18n="beauty_diet_goal">${getTranslation('beauty_diet_goal', lang)}</span>
          <span class="beauty-section-hint" data-i18n="beauty_multiselect_hint">${getTranslation('beauty_multiselect_hint', lang)}</span>
        </div>
        <div class="goal-grid">
          ${Object.entries(GOAL_META).map(([key, meta]) => {
            const isSelected = beautySelectedGoals.includes(key);
            const label = getTranslation(meta[`label_${lang}`] || meta.label_ko, lang);
            const desc = getTranslation(meta[`desc_${lang}`] || meta.desc_ko, lang);
            return `
              <button class="goal-card ${isSelected ? 'selected' : ''}" id="goal-${key}" onclick="toggleGoal('${key}')">
                <div class="card-header-beauty">
                  <span class="goal-icon">${meta.icon}</span>
                  <span class="select-indicator"></span>
                </div>
                <div class="card-body-beauty">
                  <span class="goal-label">${label}</span>
                  <p class="goal-desc">${desc}</p>
                </div>
              </button>
            `;
          }).join('')}
        </div>
      </div>
      `}
 
      <!-- 분석 버튼 -->
      <div class="beauty-action-area">
        <button class="beauty-analyze-btn ${hasSelection ? 'ready' : ''}" onclick="analyzeBeauty()" id="beauty-analyze-btn">
          <span class="btn-icon">✨</span>
          <span data-i18n="beauty_analyze_btn">${getTranslation('beauty_analyze_btn', lang)}</span>
        </button>
      </div>
 
      <!-- 결과 영역 -->
      <div id="beauty-result-area" class="beauty-result-area hidden"></div>
    </div>
  `;

  // 체질 배너 체질 변경 이벤트
  const constitutionSelect = document.getElementById('beauty-constitution-select');
  if (constitutionSelect) {
    constitutionSelect.addEventListener('change', function(e) {
      localStorage.setItem('mfco_constitution', e.target.value);
      renderBeautyStep1();
      const resultArea = document.getElementById('beauty-result-area');
      if (resultArea && !resultArea.classList.contains('hidden')) {
        analyzeBeauty();
      }
    });
  }
}

function renderConstitutionBanner(constitution, lang) {
  const constitutionOptions = Object.entries(CONSTITUTION_MAP).map(([key, label]) => {
    const locLabel = getTranslation(label, lang);
    return `<option value="${key}" ${constitution === key ? 'selected' : ''}>${locLabel}</option>`;
  }).join('');

  const found = constitution && CONSTITUTION_MAP[constitution];
  const localizedConsName = found ? getTranslation(CONSTITUTION_MAP[constitution], lang) : getTranslation('체질 미진단', lang);

  const quizBtnText = found ? getTranslation('체질 다시 진단하기', lang) : getTranslation('💡 내 체질 잘 모르겠음: 30초 자가진단', lang);

  return `
    <div class="beauty-constitution-banner glass-panel ${found ? 'found' : 'not-found'}">
      <div class="constitution-banner-left">
        <span class="constitution-banner-icon">${found ? '🧬' : '❓'}</span>
        <div>
          <div class="constitution-banner-label" data-i18n="beauty_constitution_label">${getTranslation('beauty_constitution_label', lang)}</div>
          <div class="constitution-banner-value" style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
            <span>${localizedConsName}</span>
            <button class="beauty-quiz-trigger-btn" onclick="startBeautyQuiz()" style="background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.4); color: #93c5fd; padding: 4px 10px; border-radius: 6px; font-size: 0.72rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; vertical-align: middle;">
              <span>${quizBtnText}</span>
            </button>
          </div>
        </div>
      </div>
      <div class="constitution-banner-right">
        <label class="constitution-change-label" data-i18n="beauty_change_constitution">${getTranslation('beauty_change_constitution', lang)}</label>
        <select id="beauty-constitution-select" class="constitution-select">
          ${constitutionOptions}
          ${!found ? `<option value="" selected disabled>-- ${getTranslation('선택', lang)} --</option>` : ''}
        </select>
      </div>
    </div>
  `;
}

function getDetectedConstitution() {
  try {
    let raw = null;
    const currentSub = JSON.parse(localStorage.getItem('nuri_current_subscriber') || 'null');
    if (currentSub && currentSub.constitution) {
      raw = currentSub.constitution;
    }
    if (!raw) {
      raw = localStorage.getItem('mfco_constitution');
    }
    
    if (raw) {
      raw = raw.trim();
      if (raw === '소음인' || raw.toLowerCase() === 'soeum') return 'soeum';
      if (raw === '소양인' || raw.toLowerCase() === 'soyang') return 'soyang';
      if (raw === '태음인' || raw.toLowerCase() === 'taeeum') return 'taeeum';
      if (raw === '태양인' || raw.toLowerCase() === 'taeyang') return 'taeyang';
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

// ─── 선택 토글 ────────────────────────────────────────────
function toggleConcern(key) {
  const btn = document.getElementById(`concern-${key}`);
  const idx = beautySelectedConcerns.indexOf(key);
  if (idx === -1) {
    beautySelectedConcerns.push(key);
    if (btn) btn.classList.add('selected');
  } else {
    beautySelectedConcerns.splice(idx, 1);
    if (btn) btn.classList.remove('selected');
  }
  updateAnalyzeButton();
}

function toggleGoal(key) {
  const btn = document.getElementById(`goal-${key}`);
  const idx = beautySelectedGoals.indexOf(key);
  if (idx === -1) {
    beautySelectedGoals.push(key);
    if (btn) btn.classList.add('selected');
  } else {
    beautySelectedGoals.splice(idx, 1);
    if (btn) btn.classList.remove('selected');
  }
  updateAnalyzeButton();
}

function updateAnalyzeButton() {
  const btn = document.getElementById('beauty-analyze-btn');
  if (!btn) return;
  const hasSelection = beautyCurrentSubProgram === 'skin' ? beautySelectedConcerns.length > 0 : beautySelectedGoals.length > 0;
  btn.classList.toggle('ready', hasSelection);
}

// ─── 분석 실행 ────────────────────────────────────────────
function analyzeBeauty() {
  const selectEl = document.getElementById('beauty-constitution-select');
  const constitution = (selectEl && selectEl.value) || getDetectedConstitution();

  const lang = typeof currentLanguage !== 'undefined' ? currentLanguage : 'ko';

  if (!constitution) {
    alert(getTranslation('먼저 체질을 선택해 주세요.', lang));
    return;
  }
  if (beautyCurrentSubProgram === 'skin' && beautySelectedConcerns.length === 0) {
    alert(getTranslation('피부 고민을 하나 이상 선택해 주세요.', lang));
    return;
  }
  if (beautyCurrentSubProgram === 'diet' && beautySelectedGoals.length === 0) {
    alert(getTranslation('다이어트 목표를 하나 이상 선택해 주세요.', lang));
    return;
  }

  const resultArea = document.getElementById('beauty-result-area');
  if (resultArea) {
    resultArea.classList.remove('hidden');
    resultArea.innerHTML = renderBeautyResult(constitution);
    resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ─── 결과 렌더링 ──────────────────────────────────────────
function renderBeautyResult(constitution) {
  const lang = typeof currentLanguage !== 'undefined' ? currentLanguage : 'ko';
  const skinData  = beautyData.skin[constitution];
  const dietData  = beautyData.diet[constitution];
  const consLabel = getTranslation(CONSTITUTION_MAP[constitution] || constitution, lang);
  const skinChar = skinData ? skinData.skin_character : '';
  const localizedSkinChar = getTranslation(skinChar, lang);

  let outputHtml = '';

  if (beautyCurrentSubProgram === 'skin') {
    // Skin Care results (Internal 🍵 + External 🧴 for Skin Care only)
    const hasInternal = beautySelectedConcerns.length > 0;
    const hasExternal = beautySelectedConcerns.some(c => skinData && skinData[c] && skinData[c]['외치']);

    let internalHtml = '';
    if (hasInternal) {
      const concernItems = beautySelectedConcerns.map(concern => {
        const data = skinData && skinData[concern];
        if (!data || !data['내치']) return '';
        return renderConcernInternalPrescription(concern, data['내치'], lang);
      }).filter(html => html !== '').join('');

      if (concernItems) {
        internalHtml = `
          <div class="beauty-result-block internal-block">
            <div class="result-block-header">
              <span class="block-header-icon">🍵</span>
              <div>
                <h4 class="block-header-title" data-i18n="beauty_internal_title">${getTranslation('beauty_internal_title', lang)}</h4>
                <p class="block-header-subtitle" data-i18n="beauty_internal_subtitle">${getTranslation('beauty_internal_subtitle', lang)}</p>
              </div>
            </div>
            <div class="prescription-grid-beauty">
              ${concernItems}
            </div>
          </div>
        `;
      }
    }

    let externalHtml = '';
    if (hasExternal) {
      const externalItems = beautySelectedConcerns.map(concern => {
        const data = skinData && skinData[concern];
        if (!data || !data['외치']) return '';
        return renderConcernExternalPrescription(concern, data['외치'], lang);
      }).filter(html => html !== '').join('');

      if (externalItems) {
        externalHtml = `
          <div class="beauty-result-block external-block">
            <div class="result-block-header">
              <span class="block-header-icon">🧴</span>
              <div>
                <h4 class="block-header-title" data-i18n="beauty_external_title">${getTranslation('beauty_external_title', lang)}</h4>
                <p class="block-header-subtitle" data-i18n="beauty_external_subtitle">${getTranslation('beauty_external_subtitle', lang)}</p>
              </div>
            </div>
            <div class="prescription-grid-beauty">
              ${externalItems}
            </div>
          </div>
        `;
      }
    }

    outputHtml = `
      ${internalHtml}
      ${externalHtml}
    `;
  } else {
    // Diet Care results (Diet Goals only)
    const goalItems = beautySelectedGoals.map(goal => {
      const data = dietData && dietData[goal];
      if (!data) return '';
      return renderGoalInternalPrescription(goal, data, lang);
    }).filter(html => html !== '').join('');

    outputHtml = `
      <div class="beauty-result-block diet-block">
        <div class="result-block-header">
          <span class="block-header-icon">🏃</span>
          <div>
            <h4 class="block-header-title" data-i18n="beauty_diet_result_title">${getTranslation('beauty_diet_result_title', lang)}</h4>
            <p class="block-header-subtitle" data-i18n="beauty_diet_result_subtitle">${getTranslation('beauty_diet_result_subtitle', lang)}</p>
          </div>
        </div>
        <div class="prescription-grid-beauty">
          ${goalItems}
        </div>
      </div>
    `;
  }

  const bridgeHtml = renderBeautyBridgeCard(constitution, beautyCurrentSubProgram);

  return `
    <div class="beauty-result-wrapper glass-panel">
      <!-- 결과 헤더 -->
      <div class="result-header">
        <div class="result-header-left">
          <span class="result-header-badge">${consLabel}</span>
          <h3 class="result-header-title" data-i18n="beauty_result_title">${getTranslation('beauty_result_title', lang)}</h3>
          <p class="result-header-desc">${localizedSkinChar}</p>
        </div>
        <button class="result-reset-btn" onclick="resetBeautyAnalysis()">
          🔄 <span data-i18n="beauty_reset_btn">${getTranslation('beauty_reset_btn', lang)}</span>
        </button>
      </div>

      ${outputHtml}
      ${bridgeHtml}
    </div>
  `;
}

function renderIngredientsList(ingredients, lang) {
  return ingredients.map((ing, i) => {
    const locName = getTranslation(ing.name, lang);
    const locEffect = getTranslation(ing.effect, lang);
    const locTip = getTranslation(ing.tip, lang);
    
    return `
      <div class="ingredient-badge-beauty">
        <div class="ingredient-rank-beauty">${i + 1}</div>
        <div class="ingredient-info-beauty">
          <div class="ingredient-name-beauty">
            <span class="ing-name-txt">${locName}</span>
            <div class="ingredient-actions-beauty">
              <button class="ing-btn shop-btn" onclick="linkToShopFromBeauty('${ing.name}')" title="${getTranslation('K-Food 숍에서 검색', lang)}">🛒</button>
              <button class="ing-btn rnd-btn" onclick="linkToRndFromBeauty('${ing.name}')" title="${getTranslation('R&D 설계실로 연동', lang)}">🔬</button>
            </div>
          </div>
          <div class="ingredient-effect-beauty">${locEffect}</div>
          <div class="ingredient-tip-beauty">💡 ${locTip}</div>
        </div>
      </div>
    `;
  }).join('');
}

function renderConcernInternalPrescription(concern, internal, lang) {
  const meta = CONCERN_META[concern];
  const label = getTranslation(meta[`label_${lang}`] || meta.label_ko, lang);
  const localizedReason = getTranslation(internal.reason, lang);

  let recipeHtml = '';
  if (internal.recipe) {
    const rName = getTranslation(internal.recipe.name, lang);
    const rEffect = getTranslation(internal.recipe.effect, lang);
    const rTime = getTranslation(internal.recipe.time, lang);
    const rServings = getTranslation(internal.recipe.servings, lang);
    const rIngList = internal.recipe.ingredients_list.map(item => getTranslation(item, lang)).join(', ');
    const rStepsHtml = internal.recipe.steps.map(step => `<li>${getTranslation(step, lang)}</li>`).join('');

    recipeHtml = `
      <div class="beauty-sub-card recipe-sub-card">
        <div class="sub-card-header">🍲 <span data-i18n="beauty_recipe_title">약선 레시피</span>: <strong>${rName}</strong></div>
        <div class="sub-card-meta">
          <span>⏱ ${rTime}</span>
          <span>👥 ${rServings}</span>
        </div>
        <div class="recipe-ingredients">
          <strong><span data-i18n="beauty_recipe_ingredients">재료</span>:</strong> ${rIngList}
        </div>
        <ol class="recipe-steps">
          ${rStepsHtml}
        </ol>
        <div class="recipe-effect">✨ ${rEffect}</div>
      </div>
    `;
  }

  let teaHtml = '';
  if (internal.tea) {
    const tName = getTranslation(internal.tea.name, lang);
    const tIngList = internal.tea.ingredients_list.map(item => getTranslation(item, lang)).join(', ');
    const tMethod = getTranslation(internal.tea.method, lang);
    const tEffect = getTranslation(internal.tea.effect, lang);

    teaHtml = `
      <div class="beauty-sub-card tea-sub-card">
        <div class="sub-card-header">🍵 <span data-i18n="beauty_tea_title">약선차</span>: <strong>${tName}</strong></div>
        <div class="tea-ingredients"><strong><span data-i18n="beauty_tea_ingredients">재료</span>:</strong> ${tIngList}</div>
        <div class="tea-method"><strong><span data-i18n="beauty_tea_method">방법</span>:</strong> ${tMethod}</div>
        <div class="tea-effect">✨ ${tEffect}</div>
      </div>
    `;
  }

  let avoidHtml = '';
  if (internal.avoid && internal.avoid.length > 0) {
    const avoidLabels = internal.avoid.map(item => getTranslation(item, lang));
    avoidHtml = `
      <div class="avoid-section">
        <div class="avoid-title">⚠️ <span data-i18n="beauty_avoid_ingredients">피해야 할 식재료</span></div>
        <div class="avoid-badges">
          ${avoidLabels.map(lbl => `<span class="avoid-badge">${lbl}</span>`).join('')}
        </div>
      </div>
    `;
  }

  return `
    <div class="prescription-card glass-panel">
      <div class="prescription-card-header">
        <span class="prescription-icon">${meta.icon}</span>
        <span class="prescription-title">${label}</span>
      </div>
      
      <div class="internal-reason">
        <span class="reason-icon">💡</span>
        <p>${localizedReason}</p>
      </div>

      <div class="ingredients-section">
        <h5 class="section-title-small" data-i18n="beauty_top_ingredients_title">추천 약선 식재료</h5>
        <div class="ingredients-list-beauty">
          ${renderIngredientsList(internal.ingredients, lang)}
        </div>
      </div>

      ${recipeHtml}
      ${teaHtml}
      ${avoidHtml}
    </div>
  `;
}

function renderGoalInternalPrescription(goal, data, lang) {
  const meta = GOAL_META[goal];
  const label = getTranslation(meta[`label_${lang}`] || meta.label_ko, lang);
  const locPrinciple = getTranslation(data.key_principle, lang);
  const locReason = getTranslation(data.reason, lang);

  let mealPlanHtml = '';
  if (data.meal_plan) {
    mealPlanHtml = `
      <div class="beauty-sub-card meal-plan-sub-card">
        <div class="sub-card-header">📋 <span data-i18n="beauty_meal_plan_title">권장 식단 예시</span></div>
        <div class="meal-plan-grid-beauty">
          ${Object.entries(data.meal_plan).map(([time, menu]) => `
            <div class="meal-plan-item-beauty">
              <div class="meal-time-beauty">${getTranslation(time, lang)}</div>
              <div class="meal-menu-beauty">${getTranslation(menu, lang)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  let exerciseHtml = '';
  if (data.exercise_tip) {
    exerciseHtml = `
      <div class="exercise-tip-section">
        <span class="exercise-tip-icon">🏃</span>
        <p>${getTranslation(data.exercise_tip, lang)}</p>
      </div>
    `;
  }

  let avoidHtml = '';
  if (data.avoid && data.avoid.length > 0) {
    const avoidLabels = data.avoid.map(item => getTranslation(item, lang));
    avoidHtml = `
      <div class="avoid-section">
        <div class="avoid-title">⚠️ <span data-i18n="beauty_avoid_title">피해야 할 것</span></div>
        <div class="avoid-badges">
          ${avoidLabels.map(lbl => `<span class="avoid-badge">${lbl}</span>`).join('')}
        </div>
      </div>
    `;
  }

  return `
    <div class="prescription-card diet-card glass-panel">
      <div class="prescription-card-header">
        <span class="prescription-icon">${meta.icon}</span>
        <span class="prescription-title">${label}</span>
      </div>

      <div class="diet-principle">
        <strong data-i18n="beauty_diet_principle">핵심 원칙</strong>
        <p>${locPrinciple}</p>
      </div>
      
      <div class="internal-reason">
        <span class="reason-icon">💡</span>
        <p>${locReason}</p>
      </div>

      <div class="ingredients-section">
        <h5 class="section-title-small" data-i18n="beauty_diet_ingredients_title">권장 식재료</h5>
        <div class="ingredients-list-beauty">
          ${renderIngredientsList(data.ingredients, lang)}
        </div>
      </div>

      ${mealPlanHtml}
      ${exerciseHtml}
      ${avoidHtml}
    </div>
  `;
}

function renderConcernExternalPrescription(concern, external, lang) {
  const meta = CONCERN_META[concern];
  const label = getTranslation(meta[`label_${lang}`] || meta.label_ko, lang);
  
  const items = [];

  if (external.mask) {
    const name = getTranslation(external.mask.name, lang);
    const ingList = external.mask.ingredients_list.map(item => getTranslation(item, lang)).join(', ');
    const method = getTranslation(external.mask.method, lang);
    const freq = getTranslation(external.mask.frequency, lang);
    const effect = getTranslation(external.mask.effect, lang);

    items.push(`
      <div class="external-item-card">
        <div class="external-item-header-beauty">
          <span class="external-item-icon-beauty">🧖</span>
          <div>
            <div class="external-item-type-beauty" data-i18n="beauty_mask_label">한방 팩 · 마스크 처방</div>
            <div class="external-item-name-beauty">${name}</div>
          </div>
        </div>
        <div class="external-item-body">
          <p class="external-text"><strong><span data-i18n="beauty_recipe_ingredients">재료</span>:</strong> ${ingList}</p>
          <p class="external-text"><strong><span data-i18n="beauty_usage_method">사용방법</span>:</strong> ${method}</p>
          <p class="external-text"><strong><span data-i18n="beauty_usage_frequency">권장빈도</span>:</strong> <span class="freq-badge">${freq}</span></p>
          <div class="external-item-effect">✨ ${effect}</div>
          ${renderShopLinkForIngredients(external.mask.ingredients_list, lang)}
        </div>
      </div>
    `);
  }

  if (external.toner) {
    const name = getTranslation(external.toner.name, lang);
    const ingList = external.toner.ingredients_list.map(item => getTranslation(item, lang)).join(', ');
    const method = getTranslation(external.toner.method, lang);
    const freq = getTranslation(external.toner.frequency, lang);
    const effect = getTranslation(external.toner.effect, lang);

    items.push(`
      <div class="external-item-card">
        <div class="external-item-header-beauty">
          <span class="external-item-icon-beauty">💧</span>
          <div>
            <div class="external-item-type-beauty" data-i18n="beauty_toner_label">화장수 · 토너 처방</div>
            <div class="external-item-name-beauty">${name}</div>
          </div>
        </div>
        <div class="external-item-body">
          <p class="external-text"><strong><span data-i18n="beauty_recipe_ingredients">재료</span>:</strong> ${ingList}</p>
          <p class="external-text"><strong><span data-i18n="beauty_usage_method">사용방법</span>:</strong> ${method}</p>
          <p class="external-text"><strong><span data-i18n="beauty_usage_frequency">권장빈도</span>:</strong> <span class="freq-badge">${freq}</span></p>
          <div class="external-item-effect">✨ ${effect}</div>
          ${renderShopLinkForIngredients(external.toner.ingredients_list, lang)}
        </div>
      </div>
    `);
  }

  if (external.oil) {
    const name = getTranslation(external.oil.name, lang);
    const ingList = external.oil.ingredients_list.map(item => getTranslation(item, lang)).join(', ');
    const method = getTranslation(external.oil.method, lang);
    const freq = getTranslation(external.oil.frequency, lang);
    const effect = getTranslation(external.oil.effect, lang);

    items.push(`
      <div class="external-item-card">
        <div class="external-item-header-beauty">
          <span class="external-item-icon-beauty">🧪</span>
          <div>
            <div class="external-item-type-beauty" data-i18n="beauty_oil_label">오일 · 크림 처방</div>
            <div class="external-item-name-beauty">${name}</div>
          </div>
        </div>
        <div class="external-item-body">
          <p class="external-text"><strong><span data-i18n="beauty_recipe_ingredients">재료</span>:</strong> ${ingList}</p>
          <p class="external-text"><strong><span data-i18n="beauty_usage_method">사용방법</span>:</strong> ${method}</p>
          <p class="external-text"><strong><span data-i18n="beauty_usage_frequency">권장빈도</span>:</strong> <span class="freq-badge">${freq}</span></p>
          <div class="external-item-effect">✨ ${effect}</div>
          ${renderShopLinkForIngredients(external.oil.ingredients_list, lang)}
        </div>
      </div>
    `);
  }

  return `
    <div class="prescription-card external-presc-card glass-panel">
      <div class="prescription-card-header">
        <span class="prescription-icon">${meta.icon}</span>
        <span class="prescription-title">${label}</span>
      </div>
      <div class="external-items-grid">
        ${items.join('')}
      </div>
    </div>
  `;
}

function renderShopLinkForIngredients(ingredients, lang) {
  if (!ingredients || ingredients.length === 0) return '';
  const mainIngredient = ingredients[0];
  const cleanIng = mainIngredient.replace(/\s*\d+(g|큰술|작은술|컵|ml|큰술|작은술)/gi, '').trim();
  const btnLabel = getTranslation('K-Food 숍에서 재료 구매하기', lang);
  return `
    <div class="shop-link-area-beauty">
      <button class="shop-link-btn-beauty" onclick="linkToShopFromBeauty('${cleanIng}')">
        🛒 <span>${btnLabel}</span>
      </button>
    </div>
  `;
}

// ─── 숍 연동 ──────────────────────────────────────────────
function linkToShopFromBeauty(keyword) {
  const allCategoryPill = document.querySelector('.shop-filter-pill[data-cat="all"]');
  if (allCategoryPill && typeof setShopCategory === 'function') {
    setShopCategory(allCategoryPill, 'all');
  } else {
    if (typeof shopCurrentCategory !== 'undefined') shopCurrentCategory = 'all';
    document.querySelectorAll('.shop-filter-pill').forEach(p => p.classList.remove('active'));
    if (allCategoryPill) allCategoryPill.classList.add('active');
  }

  switchTab('tab-shop');
  const cleanKeyword = keyword.replace(/\s*\d+(g|큰술|작은술|컵|ml|큰술|작은술)/gi, '').trim();

  setTimeout(() => {
    const searchInput = document.getElementById('shop-search-input');
    if (searchInput) {
      searchInput.value = cleanKeyword;
      if (typeof renderShopProducts === 'function') {
        renderShopProducts();
      }
    }
  }, 300);
}

// ─── R&D 설계실 연동 ──────────────────────────────────────────────
function linkToRndFromBeauty(keyword) {
  const currentSub = JSON.parse(localStorage.getItem('nuri_current_subscriber') || 'null');
  const isExpert = currentSub && (currentSub.role === 'admin' || currentSub.role === 'researcher' || currentSub.role === 'founder' || currentSub.role === 'medical');
  
  const lang = typeof currentLanguage !== 'undefined' ? currentLanguage : 'ko';

  if (!isExpert) {
    alert(getTranslation("이 기능은 R&D 워크스페이스 권한이 있는 연구원 및 파트너사 전용입니다.", lang));
    return;
  }
  
  if (typeof currentPersona !== 'undefined' && currentPersona !== 'workspace') {
    if (typeof enterPlatform === 'function') {
      enterPlatform('workspace');
    }
  }
  
  switchTab('tab-recipes-rnd');
  const cleanKeyword = keyword.replace(/\s*\d+(g|큰술|작은술|컵|ml|큰술|작은술)/gi, '').trim();

  setTimeout(() => {
    const input = document.getElementById('rnd-search-input');
    if (input) {
      input.value = cleanKeyword;
      if (typeof handleRndSearch === 'function') {
        handleRndSearch();
      }
    }
  }, 300);
}

// ─── 초기화 리셋 ──────────────────────────────────────────
function resetBeautyAnalysis() {
  beautySelectedConcerns = [];
  beautySelectedGoals    = [];
  renderBeautyStep1();
}

// ─── 피부·다이어트 체질 자가진단 퀴즈 (신체 증상 기반) ───
function startBeautyQuiz() {
  beautyQuizCurrentStep = 0;
  beautyQuizAnswers = [];
  renderBeautyQuizStep();
}

function answerBeautyQuiz(type) {
  beautyQuizAnswers.push(type);
  if (beautyQuizCurrentStep < BEAUTY_QUIZ_QUESTIONS.length - 1) {
    beautyQuizCurrentStep++;
    renderBeautyQuizStep();
  } else {
    const detected = getBeautyQuizResult();
    showBeautyQuizResult(detected);
  }
}

function getBeautyQuizResult() {
  const counts = { soeum: 0, soyang: 0, taeeum: 0, taeyang: 0 };
  beautyQuizAnswers.forEach(ans => {
    if (counts[ans] !== undefined) {
      counts[ans]++;
    }
  });
  
  let maxKey = 'soeum';
  let maxVal = -1;
  for (const [key, val] of Object.entries(counts)) {
    if (val > maxVal) {
      maxVal = val;
      maxKey = key;
    }
  }
  return maxKey;
}

function renderBeautyQuizStep() {
  const container = document.getElementById('beauty-quiz-card-wrapper');
  if (!container) return;

  const lang = typeof currentLanguage !== 'undefined' ? currentLanguage : 'ko';
  const qObj = BEAUTY_QUIZ_QUESTIONS[beautyQuizCurrentStep];
  const qText = qObj[`q_${lang}`] || qObj.q_ko;
  const progressText = `QUESTION ${beautyQuizCurrentStep + 1} OF ${BEAUTY_QUIZ_QUESTIONS.length}`;

  const optionsHtml = qObj.options.map((opt, idx) => {
    const text = opt[`text_${lang}`] || opt.text_ko;
    return `
      <button class="quiz-option-btn-beauty" onclick="answerBeautyQuiz('${opt.type}')">
        <span>${text}</span>
      </button>
    `;
  }).join('');

  container.innerHTML = `
    <div class="beauty-quiz-card glass-panel" style="padding: 22px; border-radius: 16px; border: 1px solid rgba(59, 130, 246, 0.3); background: rgba(10, 15, 30, 0.95); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4); animation: fadeIn 0.3s ease-out; margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-size: 0.72rem; color: var(--accent); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">${progressText}</span>
        <button onclick="closeBeautyQuiz()" style="background: none; border: none; color: var(--text-muted); font-size: 1.1rem; cursor: pointer; line-height: 1;">✕</button>
      </div>
      <h4 style="font-size: 0.95rem; color: #fff; font-weight: 700; margin-bottom: 16px; line-height: 1.5; text-align: left;">${qText}</h4>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${optionsHtml}
      </div>
    </div>
  `;
}

function closeBeautyQuiz() {
  beautyQuizCurrentStep = -1;
  const container = document.getElementById('beauty-quiz-card-wrapper');
  if (container) container.innerHTML = '';
}

function showBeautyQuizResult(detected) {
  const container = document.getElementById('beauty-quiz-card-wrapper');
  if (!container) return;

  const lang = typeof currentLanguage !== 'undefined' ? currentLanguage : 'ko';
  const localizedConsName = getTranslation(CONSTITUTION_MAP[detected], lang);
  
  let descText = "";
  if (detected === "soeum") {
    descText = getTranslation("귀하는 위장 소화 기능이 취약하고 몸이 차가워지기 쉬운 소음인 성향이 강합니다. 따뜻하고 위장을 보강하는 약선 처방이 적합합니다.", lang);
  } else if (detected === "soyang") {
    descText = getTranslation("귀하는 위장에 열이 많고 신장 기능이 상대적으로 취약한 소양인 성향이 강합니다. 몸의 상체 열을 내리고 진액을 보충하는 서늘한 처방이 적합합니다.", lang);
  } else if (detected === "taeeum") {
    descText = getTranslation("귀하는 전반적으로 체격이 튼튼하나 호흡기계가 약하고 수분 정체가 오기 쉬운 태음인 성향이 강합니다. 기혈 순환을 돕고 노폐물을 배출하는 약선이 좋습니다.", lang);
  } else if (detected === "taeyang") {
    descText = getTranslation("귀하는 기운이 위로 솟구치고 다리가 다소 약해지기 쉬운 태양인 성향이 강합니다. 기운을 아래로 내리고 맑게 흡수하는 담백한 약선이 처방됩니다.", lang);
  }

  container.innerHTML = `
    <div class="beauty-quiz-card glass-panel" style="padding: 24px; border-radius: 16px; border: 1px solid var(--primary); background: rgba(10, 35, 28, 0.95); text-align: center; box-shadow: 0 8px 32px rgba(16, 185, 129, 0.25); animation: fadeIn 0.3s ease-out; margin-bottom: 20px;">
      <div style="font-size: 2.2rem; margin-bottom: 12px;">🌿</div>
      <h4 style="font-size: 1.15rem; color: var(--primary); font-weight: 800; margin-bottom: 8px;">
        ${getTranslation("진단 완료: ", lang)} ${localizedConsName}
      </h4>
      <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 18px; max-width: 400px; margin-left: auto; margin-right: auto; text-align: center;">
        ${descText}
      </p>
      <div style="display: flex; gap: 10px; justify-content: center;">
        <button class="btn btn-primary" onclick="applyBeautyQuizResult('${detected}')" style="font-size: 0.82rem; padding: 10px 20px; font-weight: 700; border-radius: 8px;">
          ${getTranslation("체질 적용 및 처방 받기", lang)}
        </button>
        <button class="btn btn-outline" onclick="startBeautyQuiz()" style="font-size: 0.82rem; padding: 10px 16px; border-radius: 8px;">
          ${getTranslation("다시 진단", lang)}
        </button>
      </div>
    </div>
  `;
}

function applyBeautyQuizResult(detected) {
  localStorage.setItem('mfco_constitution', detected);
  
  try {
    const currentSub = JSON.parse(localStorage.getItem('nuri_current_subscriber') || 'null');
    if (currentSub) {
      currentSub.constitution = CONSTITUTION_MAP[detected];
      localStorage.setItem('nuri_current_subscriber', JSON.stringify(currentSub));
    }
  } catch (e) {
    console.error(e);
  }

  closeBeautyQuiz();
  renderBeautyStep1();
  analyzeBeauty();
}

function switchBeautyProgram(program) {
  beautyCurrentSubProgram = program;
  beautySelectedConcerns = [];
  beautySelectedGoals = [];
  const resultArea = document.getElementById('beauty-result-area');
  if (resultArea) {
    resultArea.classList.add('hidden');
    resultArea.innerHTML = '';
  }
  renderBeautyStep1();
}

// Bind to window object for access from HTML onclick attributes
window.startBeautyQuiz = startBeautyQuiz;
window.answerBeautyQuiz = answerBeautyQuiz;
window.applyBeautyQuizResult = applyBeautyQuizResult;
window.closeBeautyQuiz = closeBeautyQuiz;
window.switchBeautyProgram = switchBeautyProgram;

