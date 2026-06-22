// Mila Wellness Core Application (State, I18n, Global Events)

// Nuri Laboratory & Mila Portal Application Controller Logic
let engine = null;
let masterDb = [];
let standardFunctions = [];
let normalizationDict = [];
let exceptionDict = [];

const modernNamesMap = {
  "가자": "가자",
  "갈근": "칡뿌리",
  "갈화": "칡꽃",
  "감국": "감국",
  "감송향": "감송나무 뿌리",
  "감수": "감수 뿌리",
  "감초": "감초",
  "감초밀자": "감초밀자",
  "강향": "강향단향",
  "강활": "강활",
  "강황": "강황(울금)",
  "개자": "갓 씨앗",
  "갱미": "멥쌀",
  "건강": "말린 생강",
  "건율": "말린 밤",
  "건칠": "옻나무 진액",
  "검인": "가시연꽃 씨",
  "견우자": "나팔꽃 씨",
  "결명자": "결명자",
  "경천": "경천",
  "계관화": "맨드라미 꽃",
  "계내금": "닭 모래주머니 속껍질",
  "계지": "계피나무 어린가지",
  "계혈등": "밀화등",
  "고량강": "량강",
  "고련피": "고련피",
  "고목": "고목",
  "고본": "고본",
  "고삼": "도둑놈의지팡이(고삼)",
  "고추": "고추",
  "곡기생": "겨우살이",
  "곡아": "벼 싹",
  "곡정초": "곡정초",
  "곤포": "다시마",
  "골담초근": "골담초 뿌리",
  "골쇄보": "넉줄고사리 뿌리",
  "과체": "과체",
  "곽향": "배초향(방아잎)",
  "관동화": "머위 꽃봉오리",
  "관중": "관중",
  "괄루근": "하늘타리 뿌리(천화분)",
  "괄루인": "하늘타리 씨",
  "광곽향": "패초향",
  "광금전초": "광금전초",
  "괴각": "회화나무 열매",
  "괴화": "회화나무 꽃",
  "교이": "조청(엿)",
  "구기자": "구기자",
  "구맥": "구맥",
  "구자": "구자",
  "구절초": "구절초",
  "구척": "금모구척",
  "국화": "국화",
  "권백": "권백",
  "권삼": "권삼",
  "귀전우": "귀전우",
  "귀판": "귀판",
  "귤핵": "귤핵",
  "금박": "금박",
  "금앵자": "금앵자",
  "금은화": "인동덩굴 꽃",
  "금전초": "금전초",
  "급성자": "급성자",
  "길경": "도라지",
  "길초근": "쥐오줌풀 뿌리",
  "나도근": "나도근",
  "낙석등": "낙석등",
  "낭독": "낭독",
  "내복자": "내복자",
  "노감석": "노감석",
  "노근": "갈대뿌리",
  "노로통": "노로통",
  "노봉방": "노봉방",
  "노회": "노회",
  "녹각": "녹각",
  "녹각교": "녹각교",
  "녹두": "녹두",
  "녹반": "녹반",
  "녹용": "녹용",
  "녹제초": "녹제초",
  "뇌환": "뇌환",
  "누고": "누고",
  "누로": "누로",
  "능소화": "능소화",
  "단삼": "단삼",
  "담죽엽": "참대 잎",
  "당귀": "당귀",
  "당삼": "만삼",
  "당약": "당약",
  "대계": "엉겅퀴",
  "대극": "대극",
  "대두황권": "콩나물 말린 것",
  "대복피": "빈랑나무 껍질",
  "대산": "마늘",
  "대자석": "대자석",
  "대조": "대추",
  "대청엽": "대청엽",
  "대풍자": "대풍자",
  "대황": "대황",
  "대황주증": "대황주증",
  "대황초자": "대황초자",
  "대황초탄": "대황초탄",
  "도인": "복숭아씨",
  "독활": "땅두릅",
  "동과자": "겨울수박 씨",
  "동과피": "겨울수박 껍질",
  "동규자": "아욱 씨",
  "동충하초": "동충하초",
  "두시": "약누룩(청국장)",
  "두충": "두충나무",
  "두충엽": "두충엽",
  "등심초": "등심초",
  "마발": "마발",
  "마인": "마인",
  "마전자": "마전자",
  "마치현": "마치현",
  "마편초": "마편초",
  "마황": "마황",
  "마황근": "마황근",
  "만형자": "만형자",
  "망초": "망초",
  "매괴화": "매괴화",
  "맥문동": "맥문동",
  "맥아": "보리 엿기름",
  "맹충": "맹충",
  "면실자": "면실자",
  "모과": "모과",
  "모근": "모근",
  "모려": "굴 껍질",
  "목근피": "목근피",
  "목단피": "모란 뿌리껍질",
  "목별자": "목별자",
  "목적": "목적",
  "목통": "목통",
  "목향": "목향",
  "몰약": "몰약나무 진액",
  "무이": "느릅나무 열매",
  "문합": "문합",
  "밀몽화": "밀몽화",
  "밀타승": "밀타승",
  "박하": "박하",
  "반대해": "반대해",
  "반묘": "반묘",
  "반변련": "반변련",
  "반지련": "반지련",
  "반하": "끼무릇(반하)",
  "반하생강백반제": "반하생강백반제",
  "방기": "댕댕이덩굴 뿌리",
  "방풍": "방풍나물 뿌리",
  "백강잠": "누에 말린 것",
  "백과": "은행",
  "백굴채": "애기똥풀",
  "백급": "자란 뿌리",
  "백단향": "단향",
  "백두구": "백두구 열매",
  "백두옹": "할미꽃 뿌리",
  "백렴": "백렴",
  "백미": "백미",
  "백반": "백반",
  "백부근": "백부근",
  "백부자": "백부자",
  "백선피": "백선피",
  "백수오": "백하수오",
  "백자인": "측백나무 씨앗",
  "백전": "백전",
  "백지": "구릿대 뿌리",
  "백초상": "백초상",
  "백출": "삽주(백출)",
  "백편두": "까치콩",
  "백합": "참나리(백합)",
  "백화사": "백화사",
  "백화사설초": "뱀딸기풀(백운풀)",
  "번사엽": "번사엽",
  "번홍화": "번홍화",
  "별갑": "자라 등껍질",
  "보골지": "개구리발톱 씨",
  "보두": "보두",
  "복령": "복령버섯",
  "복분자": "복분자",
  "복신": "복신",
  "봉밀": "봉밀",
  "부소맥": "부소맥",
  "부자": "바꽃 뿌리 가공품(부자)",
  "부평": "부평",
  "비자": "비자나무 열매",
  "비파엽": "비파나무 잎",
  "비해": "비해",
  "빈랑자": "빈랑나무 열매",
  "사간": "사간",
  "사과락": "사과락",
  "사군자": "사군자",
  "사삼": "더덕",
  "사상자": "사상자",
  "사원자": "사원자",
  "사인": "사인",
  "사태": "사태",
  "사향": "사향",
  "산내": "산내",
  "산두근": "산두근",
  "산사": "산사나무 열매",
  "산수유": "산수유",
  "산약": "마",
  "산자고": "산자고",
  "산조인": "산조인(멧대추씨)",
  "산초": "초피/산초",
  "삼릉": "삼릉",
  "삼백초": "삼백초",
  "삼칠": "삼칠",
  "상기생": "겨우살이",
  "상륙": "상륙",
  "상백피": "뽕나무 뿌리껍질",
  "상산": "상산",
  "상심자": "오디",
  "상엽": "뽕잎",
  "상지": "뽕나무 가지",
  "상표초": "상표초",
  "생강": "생강",
  "생지황": "생지황",
  "서장경": "서장경",
  "석결명": "석결명",
  "석고": "석고",
  "석곡": "석곡",
  "석류피": "석류피",
  "석위": "석위",
  "석유황": "석유황",
  "석종유": "석종유",
  "석창포": "석창포",
  "선모": "선모",
  "선복화": "선복화",
  "선퇴": "선퇴",
  "섬서": "섬서",
  "섬수": "섬수",
  "세신": "세신",
  "소계": "조뱅이",
  "소목": "소목나무",
  "소합향": "소합향",
  "속단": "한속단",
  "속수자": "속수자",
  "송화분": "송화가루",
  "쇄양": "쇄양",
  "수오등": "수오등",
  "수질": "수질",
  "숙지황": "숙지황",
  "승마": "승마",
  "시체": "시체",
  "시호": "시호",
  "신곡": "누룩",
  "신근초": "신근초",
  "신이": "목련 꽃봉오리",
  "아교": "아교(당나귀가죽)",
  "아마인": "아마인",
  "아위": "아위",
  "아출": "아출",
  "안식향": "안식향",
  "애엽": "쑥",
  "야명사": "야명사",
  "양제근": "소리쟁이 뿌리",
  "어성초": "약모밀",
  "여로": "여로",
  "여정실": "여정실",
  "여지핵": "여지핵",
  "연교": "개나리 열매",
  "연자심": "연자심",
  "연자육": "연꽃 씨",
  "연전초": "연전초",
  "영양각": "영양각",
  "영지": "영지버섯",
  "예지자": "예지자",
  "오가피": "오갈피",
  "오공": "오공",
  "오령지": "오령지",
  "오매": "매실 그을린 것",
  "오미자": "오미자",
  "오배자": "붉나무 벌레집",
  "오수유": "오수유 열매",
  "오약": "오약 뿌리",
  "옥죽": "둥굴레",
  "옥촉서예": "옥촉서예",
  "와릉자": "와릉자",
  "와송": "와송",
  "왕불류행": "왕불류행",
  "요사": "요사",
  "용골": "화석 뼈",
  "용규": "용규",
  "용뇌": "용뇌",
  "용담": "용담",
  "용아초": "용아초",
  "용안육": "용안 열매",
  "우담": "우담",
  "우방자": "우방자",
  "우슬": "쇠무릎",
  "우절": "우절",
  "우황": "우황",
  "욱리인": "욱리인",
  "운대자": "운대자",
  "운모": "운모",
  "울금": "강황 뿌리줄기(울금)",
  "웅담": "웅담",
  "원지": "원지 뿌리",
  "원화": "원화",
  "위령선": "으아리 뿌리",
  "위릉채": "위릉채",
  "유기노": "유기노",
  "유백피": "느릅나무 뿌리껍질",
  "유향": "유향나무 진액",
  "육계": "계피",
  "육두구": "육두구 씨앗",
  "육종용": "육종용",
  "율초": "율초",
  "은박": "은박",
  "은시호": "은시호",
  "은행엽": "은행잎",
  "음양곽": "삼지구엽초",
  "의이인": "율무",
  "익모초": "익모초",
  "익지": "익지",
  "인동": "인동덩굴 꽃(금은화)",
  "인삼": "인삼",
  "인진호": "사철쑥",
  "자근": "자근",
  "자단향": "자단향",
  "자석": "자석",
  "자석영": "자석영",
  "자소엽": "차즈기 잎",
  "자소자": "차즈기 씨앗",
  "자연동": "자연동",
  "자오가": "가시오갈피",
  "자완": "자완",
  "자충": "자충",
  "자화지정": "자화지정",
  "작약": "작약",
  "잠사": "잠사",
  "장뇌": "장뇌",
  "저담": "저담",
  "저령": "저령버섯",
  "저마근": "모시풀 뿌리",
  "저백피": "가죽나무 뿌리껍질",
  "저실자": "꾸지나무 열매",
  "적석지": "적석지",
  "적소두": "붉은 팥",
  "전갈": "전갈",
  "전호": "바디나물 뿌리",
  "절패모": "중국패모",
  "접골목": "딱총나무",
  "정공등": "정공등",
  "정력자": "정력자",
  "정류": "정류",
  "정향": "정향나무 꽃봉오리",
  "제니": "제니",
  "제조": "제조",
  "조각자": "조릿대 가시",
  "조구등": "낚시돌풀 가지",
  "조협": "조각자나무 열매",
  "종려피": "종려피",
  "주사": "광물 주사",
  "죽력": "대나무 기름",
  "죽여": "대나무 속껍질",
  "지각": "탱자 껍질",
  "지골피": "구기자나무 뿌리껍질",
  "지구자": "지구자",
  "지룡": "지렁이",
  "지모": "지모 뿌리",
  "지부자": "댑싸리 씨앗",
  "지실": "어린 탱자",
  "지유": "오이풀 뿌리",
  "지황": "생지황",
  "진교": "진교",
  "진주": "진주",
  "진피": "귤껍질",
  "질려자": "질려자",
  "차엽": "차엽",
  "차전자": "질경이 씨앗",
  "차전초": "질경이",
  "창이자": "도꼬마리 열매",
  "창출": "삽주(창출)",
  "천궁": "천궁",
  "천남성": "천남성 덩이줄기",
  "천년건": "천년건",
  "천련자": "천련자",
  "천마": "천마 뿌리",
  "천문동": "천문동 뿌리",
  "천산갑": "천산갑",
  "천오": "바꽃 뿌리(천오)",
  "천초근": "천초근",
  "천축황": "천축황",
  "천패모": "천패모",
  "청대": "청대",
  "청상자": "청상자",
  "청피": "풋귤 껍질",
  "청호": "개똥쑥",
  "초과": "초과 열매",
  "초두구": "초두구 씨",
  "초오": "투구꽃 뿌리(초오)",
  "촉규화": "촉규화",
  "총백": "대파 흰 뿌리",
  "충위자": "충위자",
  "측백엽": "측백나무 잎",
  "치자": "치자나무 열매",
  "침향": "침향나무 수지",
  "택란": "쉽싸리",
  "택사": "택사",
  "토목향": "토목향",
  "토복령": "청미래덩굴 뿌리",
  "토사자": "새삼 씨",
  "통초": "통탈목 줄기",
  "파극천": "파극천 뿌리",
  "파두": "파두 씨앗",
  "판람근": "숭람 뿌리",
  "팔각회향": "팔각향",
  "패란": "패란",
  "패장": "패장",
  "편축": "편축",
  "포공영": "민들레",
  "포황": "포황",
  "피마자": "피마자",
  "필발": "필발",
  "필징가": "필징가",
  "하고초": "꿀풀",
  "하수오": "적하수오",
  "하엽": "연잎",
  "학슬": "학슬",
  "한련초": "한련초",
  "한수석": "한수석",
  "합개": "합개",
  "합환피": "합환피",
  "해구신": "해구신",
  "해금사": "해금사",
  "해동피": "해동피",
  "해마": "해마",
  "해방풍": "해방풍",
  "해백": "해백",
  "해부석": "해부석",
  "해삼": "해삼",
  "해조": "톳/모자반",
  "해표초": "갑오징어 뼈",
  "해풍등": "해풍등",
  "행인": "살구씨",
  "향부자": "방동사니 뿌리",
  "향유": "향유",
  "현삼": "현삼 뿌리",
  "현초": "현초",
  "현호색": "현호색",
  "혈갈": "혈갈",
  "형개": "형개",
  "형개초탄": "형개초탄",
  "호도": "호두",
  "호동루": "호동루",
  "호로파": "호로파 씨앗",
  "호박": "호박/보석 호박",
  "호이초": "호이초",
  "호장근": "호장근 뿌리",
  "호황련": "호황련",
  "홍삼": "홍삼",
  "홍화": "잇꽃",
  "화피": "화피",
  "활석": "활석",
  "황금": "속썩은풀(황금)",
  "황기": "황기",
  "황련": "깽깽이풀(황련)",
  "황련주자": "황련주자",
  "황백": "황벽나무 껍질",
  "황백염자": "황백염자",
  "황정": "둥굴레(황정)",
  "회향": "펜넬(회향)",
  "후박": "후박나무 껍질",
  "후추": "후추",
  "흑두": "검은콩",
  "흑지마": "검은깨",
  "희렴": "진득찰",
};


// New Downloaded Library Datasets
let recipesDb = [];
let holidaysDb = [];
let seasonalDb = [];
let diseasesDb = [];
let currentWikiCategory = "ALL";
let isAcademicOpen = false;
let isAudioPlaying = false;
let audioCurrentTime = 0;
let audioDuration = 75;
let audioTimer = null;
let slideInterval = null;

// Multilingual i18n Localization state
let currentLanguage = 'ko';
let lastWeatherInfo = null; // Store last weather details to re-run on language change
// ─── Shop & Modal UI Localizations (Antigravity AI) ────────────────
const shopI18n = {
  cartAdd: { ko: '담기', en: 'Add', ja: '入れる', ar: 'إضافة' },
  membershipDiscount: { ko: '멤버십 10% 할인', en: '10% Member Discount', ja: 'メンバーシップ10%割引', ar: 'خصم 10% للمشتركين' },
  memberPriceLabel: { ko: '10% 회원가', en: '10% Member Price', ja: '10% 会員価格', ar: 'سعر المشترك 10%' },
  capacitySpec: { ko: '용량/규격', en: 'Size/Spec', ja: '容量/規格', ar: 'الحجم/المواصفات' },
  stockLabel: { ko: '매장 재고', en: 'Store Stock', ja: '店舗在庫', ar: 'مخزون المتجر' },
  qtyUnit: { ko: '개', en: 'pcs', ja: '個', ar: 'قطع' },
  noProduct: { ko: '해당 조건의 상품이 없습니다.', en: 'No products match the selected criteria.', ja: '該当する条件の商品がありません。', ar: 'لا توجد منتجات تطابق المعايير المحددة.' },
  cartBtn: { ko: '장바구니 담기', en: 'Add to Cart', ja: 'カートに入れる', ar: 'إضافة إلى السلة' },
  nutrientLabel: { ko: '영양소 분류 (Nutrient)', en: 'Nutrient Category', ja: '栄養素分類', ar: 'فئة المغذيات' },
  servingAmount: { ko: '당 함량', en: 'Amount per serving', ja: '当たり含有量', ar: 'الكمية لكل حصة' },
  rdaTitle: { ko: '농촌진흥청 국가표준 영양성분 정보 (10개정판 규격)', en: 'RDA National Standard Nutrition Facts (10th Ed.)', ja: '農村振興庁 国家標準栄養成分情報', ar: 'حقائق التغذية المعيارية الوطنية (RDA)' },
  synergyTitle: { ko: '☯️ 사상 체질 궁합 & 양생 피드백', en: '☯️ Sasang Constitution Synergy & Feedback', ja: '☯️ 四象体質相性＆養生フィードバック', ar: '☯️ تآزر الدستور الجسدي والتعليقات' },
  synergyConstitution: { ko: '시너지 체질', en: 'Synergy Constitutions', ja: '相乗効果体質', ar: 'الدساتير المتآزرة' },
  rdOntologyTitle: { ko: '🧬 Nuri Lab R&D 생리 기전 연계 (온톨로지 매핑)', en: '🧬 Nuri Lab R&D Physiological Mechanism (Ontology Mapping)', ja: '🧬 Nuri Lab R&D 生理機序連携', ar: '🧬 ربط الآلية الفسيولوجية للبحث والتطوير' },
  rdStdFunc: { ko: '연계 표준기능', en: 'Linked Functions', ja: '連携標準機能', ar: 'الوظائف المرتبطة' },
  rdAxis: { ko: '표출 7대 반응축', en: 'Expressed 7-AXIS', ja: '表出7軸反応', ar: 'المحاور السبعة المعبر عنها' },
  guideWarningTitle: { ko: '💡 복용 가이드 & 주의사항', en: '💡 Intake Guide & Precautions', ja: '💡 服用ガイド＆注意事項', ar: '💡 دليل الاستهلاك والاحتياطات' },
  intakeMethod: { ko: '음용/복용법', en: 'Usage/Preparation', ja: '飲用/服用方法', ar: 'طريقة الاستخدام/التحضير' },
  modalWarningLabel: { ko: '⚠️ 주의사항', en: '⚠️ Precautions', ja: '⚠️ 注意事項', ar: '⚠️ الاحتياطات' },
  energy: { ko: '에너지 (Energy)', en: 'Energy', ja: 'エネルギー', ar: 'الطاقة' },
  carbs: { ko: '탄수화물 (Carbohydrate)', en: 'Carbohydrate', ja: '炭水化物', ar: 'الكربوهيدرات' },
  protein: { ko: '단백질 (Protein)', en: 'Protein', ja: 'タンパク質', ar: 'البروتين' },
  fat: { ko: '지질 (Fat)', en: 'Fat', ja: '脂質', ar: 'الدهون' },
  sodium: { ko: '나트륨 (Sodium)', en: 'Sodium', ja: 'ナトリウム', ar: 'الصوديوم' },
  productSummaryTitle: { ko: '📋 상품 개요', en: '📋 Product Overview', ja: '📋 商品概要', ar: '📋 نظرة عامة على المنتج' },
  cartDrawerTitle: { ko: '🛒 장바구니', en: '🛒 Shopping Cart', ja: '🛒 ショッピングカート', ar: '🛒 سلة التسوق' },
  valueGuarantee: { ko: '⭐ MILA 프리미엄 가치 보증 (Value Guarantee)', en: '⭐ MILA Premium Value Guarantee', ja: '⭐ MILA プレミアム価値保証', ar: '⭐ ضمان ميلا للقيمة المميزة' }
};

function getShopTxt(key, lang = currentLanguage) {
  if (shopI18n[key]) {
    return shopI18n[key][lang] || shopI18n[key].ko;
  }
  return key;
}

const guideI18n = {
  neiging: {
    title: {
      ko: "황제내경(黃帝內經) — 동양 의학의 원형",
      en: "Huangdi Neijing (Yellow Emperor's Inner Canon) — Archetype of Eastern Medicine",
      ja: "黄帝内経（こうていだいけい） — 東洋医学の原典",
      ar: "هوانغدي نيجينغ (كتاب الإمبراطور الأصفر الداخلي) — نموذج الطب الشرقي"
    },
    html: {
      ko: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-yin-yang"></i> 문헌 소개</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              <strong>황제내경</strong>은 약 2천 년 전에 저술된 동양 의학의 최고 고전이자 한의학의 시조로 꼽히는 서적입니다. 인체의 생리 체계가 자연의 섭리(음양오행)와 어떻게 동기화되는지 규명하며, 신체 음양의 조화 및 양생법(생명력을 기르는 생활 예방 의학)의 철학적·의학적 뼈대를 완성했습니다.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:8px;">
            <h4 style="color:var(--primary); margin:0; font-size:0.95rem;"><i class="fa-solid fa-circle-nodes"></i> Nuri Lab 연계 및 동적 작동 기능</h4>
            <ul style="margin:0; padding-left:20px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px;">
              <li><strong>오행 성미(性味) 분포 시각화:</strong> 본 플랫폼의 R&D 설계기에서 배합된 모든 원료들의 한방 성질(따뜻함/차가움)과 다섯 가지 맛(단맛, 신맛, 쓴맛, 매운맛, 짠맛)의 실시간 누적 분포도를 실시간으로 연산하여 차트로 가시화합니다.</li>
              <li><strong>사상 체질 맞춤형 가중치 산출:</strong> 환자의 사상 체질(소음, 소양, 태음, 태양)에 따라 비위가 차거나(소음인), 신장 기능이 부족하거나(소양인) 등 개별 생리 활성 기전에 따라 최적의 추천 배합 점수에 가점(+25점)을 동적으로 반영하는 엔진의 기초 뼈대로 쓰입니다.</li>
            </ul>
          </div>
        </div>
      `,
      en: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-yin-yang"></i> Introduction</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              The <strong>Huangdi Neijing</strong>, compiled about 2,000 years ago, is the oldest and most fundamental classic of Eastern medicine. It illustrates how the human body's physiological systems synchronize with natural principles (Yin-Yang and Five Elements), establishing the philosophical and medical foundation of bodily harmony and Yangsheng (life-nourishing preventive medicine).
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:8px;">
            <h4 style="color:var(--primary); margin:0; font-size:0.95rem;"><i class="fa-solid fa-circle-nodes"></i> Nuri Lab Integration & Dynamic Function</h4>
            <ul style="margin:0; padding-left:20px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px;">
              <li><strong>Five Elements & Nature Visualization:</strong> Real-time calculation and chart visualization of the cumulative thermal properties (Warm/Cool) and five tastes (Sweet, Sour, Bitter, Spicy, Salty) of all materials blended in the R&D Designer.</li>
              <li><strong>Sasang Constitutional Weights:</strong> Serves as the foundation for dynamically applying weights (+25 points) to recipe recommendations based on the user's specific constitution (Soeumin, Soyangmin, Taeumin, Taeyangmin) and its physiological tendencies.</li>
            </ul>
          </div>
        </div>
      `,
      ja: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-yin-yang"></i> 文献紹介</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              <strong>黄帝内経</strong>は約2000年前に著された東洋医学の最高古典であり、韓医学の始祖とされる書物です。人体の生理体系が自然の摂理（陰陽五行）とどのように同期するかを究明し、身体の陰陽調和および養生法（生命力を育む生活予防医学）の哲学・医学的骨組みを完成させました。
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:8px;">
            <h4 style="color:var(--primary); margin:0; font-size:0.95rem;"><i class="fa-solid fa-circle-nodes"></i> Nuri Lab連携および動的動作機能</h4>
            <ul style="margin:0; padding-left:20px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px;">
              <li><strong>五行・性味分布の可視化：</strong>R&D設計ツールで配合されたすべての原料の五行性質（温・冷）と五味（甘・酸・苦・辛・塩）の蓄積分布をリアルタイムで演算し、グラフ化します。</li>
              <li><strong>四象体質別重みの算出：</strong>少陰人、少陽人、太陰人、太陽人といったユーザーの体質に応じ、それぞれの生理活性機序に基づいて最適な推奨配合スコアに加点（+25点）を動的に反映するエンジンの基礎となります。</li>
            </ul>
          </div>
        </div>
      `,
      ar: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-yin-yang"></i> مقدمة</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              يعد كتاب <strong>هوانغدي نيجينغ</strong>، الذي تم تجميعه منذ حوالي 2000 عام، أقدم وأهم كلاسيكيات الطب الشرقي. ويوضح كيف تتزامن الأنظمة الفسيولوجية لجسم الإنسان مع المبادئ الطبيعية (ين-يانغ والعناصر الخمسة)، مما يضع الأساس الفلسفي والطبي للتناغم الجسدي واليانغشينغ (الطب الوقائي المغذي للحياة).
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:8px;">
            <h4 style="color:var(--primary); margin:0; font-size:0.95rem;"><i class="fa-solid fa-circle-nodes"></i> تكامل نوري لاب والوظائف الديناميكية</h4>
            <ul style="margin:0; padding-left:20px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px;">
              <li><strong>تصور طبيعة العناصر الخمسة:</strong> حساب فوري وعرض بياني للخصائص الحرارية التراكمية (دافئ/بارد) والمذاقات الخمسة (حلو، حامض، مر، حار، مالح) لجميع المواد الممزوجة في مصمم البحث والتطوير.</li>
              <li><strong>أوزان دستور ساسانغ الجسدي:</strong> يعمل كأساس لتطبيق أوزان ديناميكية (+25 نقطة) على توصيات الوصفات بناءً على دستور المستخدم المحدد (سومين، سويانغمين، تيومين، تيانغمين) وميوله الفسيولوجية.</li>
            </ul>
          </div>
        </div>
      `
    }
  },
  bogam: {
    title: {
      ko: "동의보감(東醫寶鑑) — 실용 임상과 양생의 집대성",
      en: "Dongui Bogam — Encyclopedia of Clinical & Life-Nourishing Practice",
      ja: "東医宝鑑（とういほうかん） — 実用臨床と養生の集大成",
      ar: "دونغوي بوغام — موسوعة الممارسة السريرية والمغذية للحياة"
    },
    html: {
      ko: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-book-medical"></i> 문헌 소개</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              <strong>동의보감</strong>은 조선시대의 의성 허준이 편찬한 세계적인 의학 백과사전으로, 유네스코 세계기록유산에 등재되어 있습니다. 단순한 치료법을 넘어 일상의 섭식(식문화)과 약재의 조화를 통해 병을 미연에 방지하는 예방 양생 의학의 가치를 실증적으로 담아냈습니다.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:8px;">
            <h4 style="color:var(--primary); margin:0; font-size:0.95rem;"><i class="fa-solid fa-circle-nodes"></i> Nuri Lab 연계 및 동적 작동 기능</h4>
            <ul style="margin:0; padding-left:20px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px;">
              <li><strong>칠정배합(상극) 세이프티 가드:</strong> 동의보감의 약재 처방 궁합 원칙에 따라 생화학적 충돌이나 독성 유발 우려가 있는 상극 조합(예: 인삼과 여로, 꿀과 파 등)을 AI 엔진이 실시간 모니터링하여 경고하고 대체 가능한 보조 원료를 안내합니다.</li>
              <li><strong>군신좌사(君臣佐使) 배합율 연산:</strong> R&D 설계기에서 배합된 원료들의 역할을 군약(주효능), 신약(보조효능), 좌약(조절/부작용완화), 사약(조화/인도)으로 세분화하고, 이에 따라 생리 작용 기여 가중치(3점/2점/1점)를 계산하여 효능 백분율을 예측합니다.</li>
            </ul>
          </div>
        </div>
      `,
      en: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-book-medical"></i> Introduction</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              The <strong>Dongui Bogam</strong> is a world-renowned medical encyclopedia compiled by Heo Jun in the Joseon Dynasty, registered in the UNESCO Memory of the World. Beyond simple therapeutics, it practically captures the value of preventive lifestyle medicine through daily diet and herbal harmony.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:8px;">
            <h4 style="color:var(--primary); margin:0; font-size:0.95rem;"><i class="fa-solid fa-circle-nodes"></i> Nuri Lab Integration & Dynamic Function</h4>
            <ul style="margin:0; padding-left:20px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px;">
              <li><strong>Herbal Safety Guard:</strong> Monitors biochemical conflicts and toxic herbal interactions (e.g. ginseng & veratrum, honey & green onions) in real-time based on Dongui Bogam principles, warning the user and suggesting safe alternatives.</li>
              <li><strong>Jun-Chen-Zuo-Shi Ratio Calculator:</strong> Segregates blended materials into Sovereign, Minister, Assistant, and Courier roles, calculating weight ratios (3/2/1 points) to predict physiological efficacy percentages.</li>
            </ul>
          </div>
        </div>
      `,
      ja: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-book-medical"></i> 文献紹介</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              <strong>東医宝鑑</strong>は朝鮮時代の名医・許浚（ホ・ジュン）が編纂した世界的な医学百科事典で、ユネスコ世界記録遺産に登録されています。単なる治療法を超え、日常の食習慣と薬材の調和を通じて病を未然に防ぐ予防養生医学の価値を実証的に捉えています。
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:8px;">
            <h4 style="color:var(--primary); margin:0; font-size:0.95rem;"><i class="fa-solid fa-circle-nodes"></i> Nuri Lab連携および動的動作機能</h4>
            <ul style="margin:0; padding-left:20px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px;">
              <li><strong>七情配合（相克）セーフティガード：</strong>薬材の相性原則に基づき、生化学的衝突や毒性誘発の恐れがある相克の組み合わせ（例：人参とレイロウ、蜂蜜とネギなど）をAIエンジンがリアルタイム監視し、代替可能な原料を案内します。</li>
              <li><strong>君臣佐使配合比率演算：</strong>R&D設計ツールで配合された原料の役割を君薬（主効能）、臣薬（補助効能）、佐薬（調和・副作用緩和）、使薬（導入）に細分化し、貢献寄与重みを計算し効能比率を予測します。</li>
            </ul>
          </div>
        </div>
      `,
      ar: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-book-medical"></i> مقدمة</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              تعد موسوعة <strong>دونغوي بوغام</strong> الطبية العالمية الشهيرة التي جمعها هيو جون في عصر مملكة جوسون، ومسجلة في سجل ذاكرة العالم لليونسكو. وتتجاوز العلاجات البسيطة لترسم قيمة الطب الوقائي اليومي من خلال الغذاء وتناغم الأعشاب.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:8px;">
            <h4 style="color:var(--primary); margin:0; font-size:0.95rem;"><i class="fa-solid fa-circle-nodes"></i> تكامل نوري لاب والوظائف الديناميكية</h4>
            <ul style="margin:0; padding-left:20px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px;">
              <li><strong>حارس السلامة العشبية:</strong> يراقب التفاعلات والتعارضات الحيوية للأعشاب (مثل الجينسينغ وفيراترم، العسل والبصل الأخضر) في الوقت الفعلي بناءً على مبادئ دونغوي بوغام، وينبه المستخدم مع اقتراح بدائل آمنة.</li>
              <li><strong>حساب صيغة السيد-الوزير-المساعد-الرسول:</strong> يصنف المكونات إلى أدوار سيادية ووزارية ومساعدة ورسول، ويحسب نسب المساهمة (3/2/1 نقطة) للتنبؤ بنسبة الفعالية الفسيولوجية.</li>
            </ul>
          </div>
        </div>
      `
    }
  },
  bongcho: {
    title: {
      ko: "본초강목(本草綱目) — 천연물 성미학의 백과사전",
      en: "Bencao Gangmu (Compendium of Materia Medica) — Encyclopedia of Natural Substance Pharmacology",
      ja: "本草綱目（ほんぞうこうもく） — 天然物性味学の百科事典",
      ar: "بينكاو غانغمو (موجز المواد الطبية) — موسوعة علم صيدلة المواد الطبيعية"
    },
    html: {
      ko: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-mortar-pestle"></i> 문헌 소개</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              <strong>본초강목</strong>은 학자 이시진이 30년에 걸쳐 저술한 방대한 본초학(약용 천연물학) 전문 연구서입니다. 식물, 동물, 광물 등 수천 종의 자연 원물의 상세 성미와 인체 흡수 경로(귀경), 한방 임상 효능을 가장 체계적으로 집대성한 서적입니다.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:8px;">
            <h4 style="color:var(--primary); margin:0; font-size:0.95rem;"><i class="fa-solid fa-circle-nodes"></i> Nuri Lab 연계 및 동적 작동 기능</h4>
            <ul style="margin:0; padding-left:20px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px;">
              <li><strong>귀경(歸經) 오행 밸런스 측정:</strong> 본초강목에 등재된 원료 고유의 작용 장부(간장, 심장, 비장, 위장, 폐장, 신장 등) 정보를 R&D 배합 데이터에서 역파싱하여, 조리된 음식이 신체의 어느 장부에 지배적으로 흡수되고 약리적 영향을 미치는지 점수화해 요약합니다.</li>
              <li><strong>AI 시너지 부스터 추천 엔진:</strong> 본초의 상생 보완 원리에 의거하여, 현재 설계한 레시피의 부족한 기미를 채우거나 맛과 시너지를 극대화해주는 2~3종의 보완 원재료를 R&D 대시보드 내에 실시간 추천 피드로 제공합니다.</li>
            </ul>
          </div>
        </div>
      `,
      en: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-mortar-pestle"></i> Introduction</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              The <strong>Bencao Gangmu</strong> is a monumental research compendium on herbal medicine compiled by Li Shizhen over 30 years. It systematically catalogues thousands of plants, animals, and minerals alongside their specific properties, channel tropism (absorption routes), and clinical effects.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:8px;">
            <h4 style="color:var(--primary); margin:0; font-size:0.95rem;"><i class="fa-solid fa-circle-nodes"></i> Nuri Lab Integration & Dynamic Function</h4>
            <ul style="margin:0; padding-left:20px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px;">
              <li><strong>Channel Tropism Balance:</strong> Extracts channel tropism (target organs like Liver, Heart, Spleen, Stomach, Lungs, Kidneys) from R&D blend ratios, scoring and summarizing which organs the food will dominantly nourish.</li>
              <li><strong>AI Synergy Booster:</strong> Evaluates missing thermal or taste characteristics in the current recipe and suggests 2-3 botanical supplements to maximize synergy.</li>
            </ul>
          </div>
        </div>
      `,
      ja: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-mortar-pestle"></i> 文献紹介</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              <strong>本草綱目</strong>は明代の学者・李時珍が30年を費やして著した膨大な本草学（薬用天然物学）専門研究書です。植物、動物、鉱物など数千種の天然素材の詳細な性味、人体への吸収経路（帰経）、臨床的効能を体系的に集大成したものです。
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:8px;">
            <h4 style="color:var(--primary); margin:0; font-size:0.95rem;"><i class="fa-solid fa-circle-nodes"></i> Nuri Lab連携および동적動作機能</h4>
            <ul style="margin:0; padding-left:20px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px;">
              <li><strong>帰経五行バランス測定：</strong>本草綱目に登載された原料固有の作用臓器（肝、心、脾、胃、肺、腎など）情報をR&D配合比から抽出し、摂取された食物が身体のどの臓器に支配的影響を与えるかを数値化します。</li>
              <li><strong>AIシナジーブースターエンジン：</strong>本草の相生補完原理に依拠し、設計中のレシピで不足している気味を補ったり、効能を最大化する2〜3種の原料素材を推奨フィードで提供します。</li>
            </ul>
          </div>
        </div>
      `,
      ar: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-mortar-pestle"></i> مقدمة</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              يعد كتاب <strong>بينكاو غانغمو</strong> مرجعًا بحثيًا ضخمًا في الطب العشبي جمعه لي شي تشن على مدى 30 عامًا. ويصنف بشكل منهجي آلاف النباتات والحيوانات والمعادن إلى جانب خصائصها المحددة وتوجيه قنواتها (مسارات الامتصاص) وتأثيراتها السريرية.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:8px;">
            <h4 style="color:var(--primary); margin:0; font-size:0.95rem;"><i class="fa-solid fa-circle-nodes"></i> تكامل نوري لاب والوظائف الديناميكية</h4>
            <ul style="margin:0; padding-left:20px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px;">
              <li><strong>توجيه القنوات العشبية:</strong> يستخرج القنوات المستهدفة (الأعضاء مثل الكبد والقلب والطحال والمعدة والرئتين والكلى) من نسب المزيج، ويحسب نقاط الأعضاء التي سيغذيها الطعام بشكل أساسي.</li>
              <li><strong>معزز التآزر الذكي:</strong> يقيم الخصائص الحرارية أو المذاقات المفقودة في الوصفة الحالية ويقترح 2-3 مكملات عشبية لتعظيم التآزر.</li>
            </ul>
          </div>
        </div>
      `
    }
  },
  korea: {
    title: {
      ko: "한국한의학연구원 및 국가표준식품 데이터",
      en: "KIOM & National Standard Food Nutrition Facts Data",
      ja: "韓国韓医学研究院＆国家標準食品栄養成分データ",
      ar: "بيانات معهد الطب الشرعي الكوري وحقائق التغذية الوطنية"
    },
    html: {
      ko: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-microscope"></i> 표준 데이터 소개</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              한국한의학연구원(KIOM)의 표준 정보 체계와 농촌진흥청 국가표준식품영양성분표 데이터를 디지털로 융합한 최신 국가 표준 기반 정량화 데이터입니다. 고전문헌 속의 고풍스럽거나 모호한 표기어들을 과학적으로 계량화하여 실제 조리와 R&D에 오차 없이 즉시 가용할 수 있도록 규격화했습니다.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:8px;">
            <h4 style="color:var(--primary); margin:0; font-size:0.95rem;"><i class="fa-solid fa-circle-nodes"></i> Nuri Lab 연계 및 동적 작동 기능</h4>
            <ul style="margin:0; padding-left:20px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px;">
              <li><strong>효능 용어 정규화 사전 (93종):</strong> 동의보감 등 옛 한글/한문 효능 표현(예: 건비위, 사화)을 고정된 현대 영양학적 생리 조절 지표로 통일 매핑하여 신뢰도 높은 처방 연산을 수행합니다.</li>
              <li><strong>7-AXIS 기대 활성 작용 계산:</strong> 1,793행 마스터 온톨로지를 역해결하여 신체의 7대 반응 축(정화, 완화, 흡수, 회복, 순환, 보호, 안정) 기여율을 정량화된 수치와 퍼센트(%)로 변환하여 비즈니스 Claims 마케팅 문구로 자동 합성합니다.</li>
            </ul>
          </div>
        </div>
      `,
      en: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-microscope"></i> Standard Data Introduction</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              State-of-the-art quantified data integrating the standard informatics of the Korea Institute of Oriental Medicine (KIOM) and the Rural Development Administration (RDA) National Standard Food Composition Table. Obsolete or ambiguous expressions in ancient classics are digitized and calibrated for zero-error B2B product R&D.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:8px;">
            <h4 style="color:var(--primary); margin:0; font-size:0.95rem;"><i class="fa-solid fa-circle-nodes"></i> Nuri Lab Integration & Dynamic Function</h4>
            <ul style="margin:0; padding-left:20px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px;">
              <li><strong>Normalization Glossary (93 items):</strong> Maps traditional expressions (e.g. Geonbiwi, Sahwa) to standard modern physiological regulation indexes for highly reliable formulation outputs.</li>
              <li><strong>7-AXIS Expected Activity Calculation:</strong> Evaluates the 1,793-row master ontology to calculate and translate contribution rates for the body's 7 main response axes (Cleanse, Ease, Absorb, Restore, Circulate, Shield, Calm) into marketing claims.</li>
            </ul>
          </div>
        </div>
      `,
      ja: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-microscope"></i> 標準データの紹介</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              韓国韓医学研究院（KIOM）の標準情報体系と、農村振興庁の国家標準食品栄養成分表データをデジタル融合した、最新の国家標準基盤の定量化データです。古典文献の中の曖昧な表記語を科学的に計量化し、実際の調理や製品開発に誤差なく即時活用できるよう規格化しました。
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:8px;">
            <h4 style="color:var(--primary); margin:0; font-size:0.95rem;"><i class="fa-solid fa-circle-nodes"></i> Nuri Lab連携および動적動作機能</h4>
            <ul style="margin:0; padding-left:20px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px;">
              <li><strong>効能用語正規化辞書 (93種)：</strong>昔の伝統医学用語の表記（例：健脾胃、瀉火など）を現代の栄養学的な生理調節指標へ統一マッピングし、信頼度の高い処方計算を行います。</li>
              <li><strong>7軸期待活性作用計算：</strong>1,793行のマスターオントロジーを解析し、身体の7大反応軸（浄化、緩和、吸収、回復、循環、保護、安定）寄与率を数値とパーセンテージ（%）に変換し、マーケティングクレイムを自動合成します。</li>
            </ul>
          </div>
        </div>
      `,
      ar: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-microscope"></i> مقدمة البيانات المعيارية</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              بيانات كمية متطورة تدمج المعلوماتية المعيارية لمعهد الطب الشرعي الكوري (KIOM) وجدول تكوين الأغذية الوطني التابع لإدارة التطوير الريفي (RDA). تتم رقمنة التعبيرات الغامضة في الكلاسيكيات القديمة ومعايرتها لضمان خلو البحث والتطوير من الأخطاء.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:8px;">
            <h4 style="color:var(--primary); margin:0; font-size:0.95rem;"><i class="fa-solid fa-circle-nodes"></i> تكامل نوري لاب والوظائف الديناميكية</h4>
            <ul style="margin:0; padding-left:20px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px;">
              <li><strong>قاموس التقييس (93 عنصرًا):</strong> يربط التعبيرات التقليدية بمؤشرات التنظيم الفسيولوجي الحديثة للحصول على مخرجات صياغة موثوقة للغاية.</li>
              <li><strong>حساب النشاط المتوقع للمحاور السبعة:</strong> يقيم الأنطولوجيا الرئيسية المكونة من 1793 صفًا لحساب وتحويل معدلات المساهمة في محاور الاستجابة السبعة الرئيسية (التطهير، التخفيف، الامتصاص، الاستعادة، الدوران، الحماية، الاستقرار) إلى مطالبات تسويقية.</li>
            </ul>
          </div>
        </div>
      `
    }
  },
  microbes: {
    title: {
      ko: "전통 발효 미생물학 (Fermentation Microbes)",
      en: "Traditional Fermentation Microbiology",
      ja: "伝統発酵微生物学",
      ar: "ميكروبيولوجيا التخمير التقليدية"
    },
    html: {
      ko: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-virus"></i> 한식의 감칠맛과 약성을 빚는 전통 균주</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              전통 발효식품의 약리 작용은 유기물질을 분해하고 유익한 대사산물을 만드는 <strong>전통 발효 미생물</strong>의 활동에서 비롯됩니다.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:10px; font-size:0.88rem;">
            <div>
              <strong style="color:#fff;"><i class="fa-solid fa-circle-check" style="color:var(--primary);"></i> 고초균 (Bacillus subtilis):</strong>
              <p style="margin:3px 0 0 16px; color:var(--text-secondary);">청국장과 된장의 주역균으로, 콩 단백질을 고분자 펩타이드로 쪼개어 장내 유해균을 억제하고 혈전을 분해하며 면역 활성을 돕습니다.</p>
            </div>
            <div>
              <strong style="color:#fff;"><i class="fa-solid fa-circle-check" style="color:var(--primary);"></i> 황국균 (Aspergillus oryzae):</strong>
              <p style="margin:3px 0 0 16px; color:var(--text-secondary);">전통 간장·된장 메주에서 전분과 단백질을 단맛 나는 포도당과 감칠맛 아미노산으로 전환시켜 영양 흡수율을 극대화합니다.</p>
            </div>
            <div>
              <strong style="color:#fff;"><i class="fa-solid fa-circle-check" style="color:var(--primary);"></i> 가양주 효모 (Saccharomyces cerevisiae):</strong>
              <p style="margin:3px 0 0 16px; color:var(--text-secondary);">전통주(우리술) 발효의 핵심으로 포도당을 에탄올과 천연 탄산, 풍부한 비타민 B군 및 유기산으로 전환시킵니다.</p>
            </div>
            <div>
              <strong style="color:#fff;"><i class="fa-solid fa-circle-check" style="color:var(--primary);"></i> 유산균 (Leuconostoc mesenteroides):</strong>
              <p style="margin:3px 0 0 16px; color:var(--text-secondary);">김치 발효 초기에 시원한 탄산미와 천연 젖산을 생성하여 부패균을 차단하고 장벽 면역을 보강합니다.</p>
            </div>
          </div>
        </div>
      `,
      en: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-virus"></i> Core Strains Crafting Taste & Medicinal Efficacy</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              The health benefits of traditional fermented foods arise from the active metabolism of **beneficial microorganisms** that degrade organic matter and generate therapeutic metabolites.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:10px; font-size:0.88rem;">
            <div>
              <strong style="color:#fff;"><i class="fa-solid fa-circle-check" style="color:var(--primary);"></i> Bacillus subtilis (Hay Bacillus):</strong>
              <p style="margin:3px 0 0 16px; color:var(--text-secondary);">The key strain in cheonggukjang and doenjang. Degrades soy proteins into peptides, suppressing gut pathogens, dissolving blood clots, and bolstering immunity.</p>
            </div>
            <div>
              <strong style="color:#fff;"><i class="fa-solid fa-circle-check" style="color:var(--primary);"></i> Aspergillus oryzae (Koji Mold):</strong>
              <p style="margin:3px 0 0 16px; color:var(--text-secondary);">Converts starches and proteins in soy ferment blocks into glucose and amino acids, maximizing nutritional bio-availability.</p>
            </div>
            <div>
              <strong style="color:#fff;"><i class="fa-solid fa-circle-check" style="color:var(--primary);"></i> Saccharomyces cerevisiae (Brewer's Yeast):</strong>
              <p style="margin:3px 0 0 16px; color:var(--text-secondary);">Central to traditional spirits fermentation, converting sugars to ethanol, natural carbonic acid, B-complex vitamins, and organic acids.</p>
            </div>
            <div>
              <strong style="color:#fff;"><i class="fa-solid fa-circle-check" style="color:var(--primary);"></i> Leuconostoc mesenteroides (Lactic Acid Bacteria):</strong>
              <p style="margin:3px 0 0 16px; color:var(--text-secondary);">Generates carbonation and natural lactic acid in early kimchi fermentation, blocking pathogens and reinforcing gut lining immunity.</p>
            </div>
          </div>
        </div>
      `,
      ja: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-virus"></i> 韓国食の旨味と薬理作用を醸し出す伝統菌株</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              伝統発酵食品の健康的な役割は、有機物質を分解して有益な代謝産物を生み出す**伝統発酵微生物**の活動から得られます。
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:10px; font-size:0.88rem;">
            <div>
              <strong style="color:#fff;"><i class="fa-solid fa-circle-check" style="color:var(--primary);"></i> 枯草菌 (Bacillus subtilis):</strong>
              <p style="margin:3px 0 0 16px; color:var(--text-secondary);">チョングッチャンや味噌（テンジャン）の主役菌。大豆タンパク質をアミノ酸・ペプチドに分解し、腸内悪玉菌を抑制し血栓を分解します。</p>
            </div>
            <div>
              <strong style="color:#fff;"><i class="fa-solid fa-circle-check" style="color:var(--primary);"></i> 黄麹菌 (Aspergillus oryzae):</strong>
              <p style="margin:3px 0 0 16px; color:var(--text-secondary);">伝統醤油や味噌のメジュ（麹ブロック）において、デンプンやタンパク質を甘みのあるブドウ糖や旨味アミノ酸に変換し、栄養吸収率を最大化します。</p>
            </div>
            <div>
              <strong style="color:#fff;"><i class="fa-solid fa-circle-check" style="color:var(--primary);"></i> 伝統酒酵母 (Saccharomyces cerevisiae):</strong>
              <p style="margin:3px 0 0 16px; color:var(--text-secondary);">マッコリや伝統酒発酵の中核であり、ブドウ糖をエタノールと炭酸、豊富なビタミンB群や有機酸へ転換します。</p>
            </div>
            <div>
              <strong style="color:#fff;"><i class="fa-solid fa-circle-check" style="color:var(--primary);"></i> 乳酸菌 (Leuconostoc mesenteroides):</strong>
              <p style="margin:3px 0 0 16px; color:var(--text-secondary);">キムチ発酵初期に爽やかな炭酸味と天然乳酸を生成し、腐敗菌を遮断し、腸壁免疫を補強します。</p>
            </div>
          </div>
        </div>
      `,
      ar: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-virus"></i> سلالات رئيسية تصنع النكهة والفعالية الطبية</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              تنشأ الفوائد الصحية للأطعمة المخمرة التقليدية من النشاط الأيضي **للكائنات الحية الدقيقة المفيدة** التي تكسر المواد العضوية وتنتج نواتج علاجية.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:10px; font-size:0.88rem;">
            <div>
              <strong style="color:#fff;"><i class="fa-solid fa-circle-check" style="color:var(--primary);"></i> العصوية الرقيقة (Bacillus subtilis):</strong>
              <p style="margin:3px 0 0 16px; color:var(--text-secondary);">السلالة الرئيسية في تشيونغغوكجانغ ودوينجانغ. تكسر بروتينات الصويا إلى ببتيدات، وتثبط مسببات الأمراض المعوية، وتذوب جلطات الدم، وتعزز المناعة.</p>
            </div>
            <div>
              <strong style="color:#fff;"><i class="fa-solid fa-circle-check" style="color:var(--primary);"></i> أسبرجيلس أوريزا (عفن كوجي):</strong>
              <p style="margin:3px 0 0 16px; color:var(--text-secondary);">يحول النشويات والبروتينات في كتل تخمير الصويا إلى جلوكوز وأحماض أمينية، مما يعزز الامتصاص الغذائي.</p>
            </div>
            <div>
              <strong style="color:#fff;"><i class="fa-solid fa-circle-check" style="color:var(--primary);"></i> خميرة الخباز (Saccharomyces cerevisiae):</strong>
              <p style="margin:3px 0 0 16px; color:var(--text-secondary);">محورية في تخمير المشروبات التقليدية، حيث تحول السكريات إلى إيثانول وحمض كربونيك طبيعي وفيتامينات ب المركبة وأحماض عضوية.</p>
            </div>
            <div>
              <strong style="color:#fff;"><i class="fa-solid fa-circle-check" style="color:var(--primary);"></i> البكتيريا الملبنة (Leuconostoc mesenteroides):</strong>
              <p style="margin:3px 0 0 16px; color:var(--text-secondary);">تنتج الغازات وحمض اللبنيك الطبيعي في المراحل الأولى لتخمير الكيمتشي، مما يمنع مسببات الأمراض ويعزز مناعة جدار الأمعاء.</p>
            </div>
          </div>
        </div>
      `
    }
  },
  afaci: {
    title: {
      ko: "AFACI 아시아 식품성분 데이터베이스",
      en: "AFACI Asian Food Composition Database",
      ja: "AFACI アジア食品成分データベース",
      ar: "قاعدة بيانات تركيب الأغذية الآسيوية (AFACI)"
    },
    html: {
      ko: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-globe"></i> 아시아 농식품 기술협력 협의회 표준규격</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              <strong>AFACI(아시아농식품기술협력협의회)</strong>는 아시아 국가 간 식품 자원의 영양성분 데이터를 공유하고 기후변화에 대응하기 위한 다국적 공동 DB 프로젝트입니다.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:8px;">
            <h4 style="color:var(--primary); margin:0; font-size:0.92rem;"><i class="fa-solid fa-circle-nodes"></i> Nuri Lab 벤치마크 설계 반영</h4>
            <ul style="margin:0; padding-left:20px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px; font-size:0.88rem;">
              <li><strong>국제 정규화 규격 준수:</strong> Nuri Lab의 1,793행 마스터 DB는 AFACI가 권장하는 아시아 농식품 분류 체계를 기반으로 하여 해외 허브/차류 및 약용 식재료의 영양 프로필(10g 환산단위)을 통일성 있게 적재하였습니다.</li>
              <li><strong>수출 비즈니스 지원:</strong> B2B R&D 설계기에서 105종 약선 레시피 및 배합비를 해외 웰니스 식자재 및 밀키트 수출 포맷으로 변환(JSON/CSV 내보내기)할 때, 글로벌 호환 규격으로 데이터를 자동 조율합니다.</li>
            </ul>
          </div>
        </div>
      `,
      en: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-globe"></i> Asian Food & Agriculture Cooperation Initiative</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              <strong>AFACI</strong> is a multinational cooperative database project aimed at sharing nutritional composition data of food resources across Asian countries and addressing climate change.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:8px;">
            <h4 style="color:var(--primary); margin:0; font-size:0.92rem;"><i class="fa-solid fa-circle-nodes"></i> Nuri Lab Design Benchmark</h4>
            <ul style="margin:0; padding-left:20px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px; font-size:0.88rem;">
              <li><strong>International Standards:</strong> Nuri Lab's 1,793-row master DB is aligned with the AFACI classification system, capturing the nutritional profiles (standardized per 10g) of herbs, teas, and botanical ingredients.</li>
              <li><strong>Export Business Support:</strong> When exporting B2B R&D formulations and recipes in JSON/CSV formats, data is automatically standardized to global food informatics codes.</li>
            </ul>
          </div>
        </div>
      `,
      ja: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-globe"></i> アジア農食品技術協力協議会標準規格</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              <strong>AFACI(アジア農食品技術協力協議会)</strong>はアジア諸国間で食品資源の栄養成分データを共有し、気候変動に対応するための多国籍共同DBプロジェクトです。
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:8px;">
            <h4 style="color:var(--primary); margin:0; font-size:0.92rem;"><i class="fa-solid fa-circle-nodes"></i> Nuri Lab設計反映</h4>
            <ul style="margin:0; padding-left:20px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px; font-size:0.88rem;">
              <li><strong>国際規格準拠：</strong>Nuri Labの1,793行のマスターDBは、AFACIが推奨するアジアの農食品分類体系に基づき、海外のハーブや健康茶類の栄養成分を10g換算で統一的に積載しています。</li>
              <li><strong>輸出ビジネス支援：</strong>レシピ配合比などを輸出フォーマット（JSON/CSV）で出力する際、自動でグローバル互換コードへ調整されます。</li>
            </ul>
          </div>
        </div>
      `,
      ar: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-globe"></i> مبادرة التعاون الزراعي والغذائي الآسيوي</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              تعد <strong>AFACI</strong> مشروع قاعدة بيانات تعاوني متعدد الجنسيات يهدف إلى مشاركة بيانات التركيب الغذائي لموارد الأغذية عبر البلدان الآسيوية ومعالجة تغير المناخ.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:8px;">
            <h4 style="color:var(--primary); margin:0; font-size:0.92rem;"><i class="fa-solid fa-circle-nodes"></i> معيار تصميم نوري لاب</h4>
            <ul style="margin:0; padding-left:20px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px; font-size:0.88rem;">
              <li><strong>المعايير الدولية:</strong> تتماشى قاعدة البيانات الرئيسية لنوري لاب المكونة من 1793 صفًا مع نظام تصنيف AFACI، وتلتقط الملامح الغذائية (المعيارية لكل 10 جرام) للأعشاب والشاي والمكونات النباتية.</li>
              <li><strong>دعم أعمال التصدير:</strong> عند تصدير تركيبات البحث والتطوير والوصفات بصيغ JSON/CSV، يتم توحيد البيانات تلقائيًا لتتوافق مع رموز المعلوماتية الغذائية العالمية.</li>
            </ul>
          </div>
        </div>
      `
    }
  },
  sikpumbogam: {
    title: {
      ko: "약선본초 식품보감 (51종 핵심 식재료)",
      en: "Yakseon Materia Medica (51 Core Ingredients)",
      ja: "薬膳本草食品宝鑑 (51種核心食材)",
      ar: "ياكسون ماتيريا ميديكا (51 مكوناً رئيسياً)"
    },
    html: {
      ko: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-mortar-pestle"></i> 전통 본초학과 현대 영양학의 융합 사전</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              <strong>약선본초 식품보감</strong>은 고전 의학 문헌(동의보감, 본초강목)에 기록된 전통 약성(藥性) 지표와 농촌진흥청 국가표준식품영양성분 DB(10판)를 1:1로 결합한 누리랩의 핵심 식재료 사전입니다.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; font-size:0.88rem; color:var(--text-secondary);">
            <p style="margin:0 0 10px 0;">
              플랫폼에 등재된 <strong>인삼, 황기, 당귀, 우슬, 맥문동, 칡, 둥굴레, 하수오</strong> 등 대표적인 51종 한방 약용 식재료에 대하여 다음 지표가 완벽하게 동적 설계되어 있습니다.
            </p>
            <ul style="margin:0; padding-left:20px; display:flex; flex-direction:column; gap:5px;">
              <li><strong>한열온량(寒熱溫涼):</strong> 온난/냉각의 한방적 성질 조율 지수</li>
              <li><strong>오미(五味) 및 귀경(歸經):</strong> 단맛, 쓴맛 등과 작용 장부 매핑</li>
              <li><strong>과학적 기능 성분:</strong> 사포닌(진세노사이드), 데쿠르신, 이눌린 등 실시간 매핑</li>
              <li><strong>10g 단위 미세 칼로리/영양소 수치:</strong> 소식 및 한방 대사 제어용 가중치</li>
            </ul>
          </div>
        </div>
      `,
      en: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-mortar-pestle"></i> Fusion of Traditional Herbology & Modern Nutrition</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              The <strong>Yakseon Food Dictionary</strong> is Nuri Lab's flagship directory merging traditional herbal properties recorded in ancient literature (Dongui Bogam, Bencao Gangmu) with the RDA National Standard Food Composition Database.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; font-size:0.88rem; color:var(--text-secondary);">
            <p style="margin:0 0 10px 0;">
              Covers 51 representative botanical ingredients including **ginseng, astragalus, angelica, achyranthes, liriope, arrowroot, Solomon's seal, and fleeceflower**, detailing:
            </p>
            <ul style="margin:0; padding-left:20px; display:flex; flex-direction:column; gap:5px;">
              <li><strong>Cold & Hot Properties:</strong> Traditional thermal balance index (Cold/Cool/Warm/Hot/Neutral)</li>
              <li><strong>Five Tastes & Channels:</strong> Mappings of tastes (Sweet, Bitter, etc.) to target organs</li>
              <li><strong>Active Bio-compounds:</strong> Saponin (ginsenosides), decursin, inulin mappings</li>
              <li><strong>10g Standard Nutrients:</strong> Caloric and macronutrient weights for metabolism control</li>
            </ul>
          </div>
        </div>
      `,
      ja: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-mortar-pestle"></i> 伝統本草学と現代栄養学の融合事典</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              <strong>薬膳本草食品宝鑑</strong>は古典医学文献（東医宝鑑、本草綱目）に記録された伝統的な薬性指標と、農村振興庁の国家標準食品栄養成分DBを1:1で結合した、Nuri Labの中核をなす食材事典です。
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; font-size:0.88rem; color:var(--text-secondary);">
            <p style="margin:0 0 10px 0;">
              プラットフォームに登録されている<strong>人参、黄耆、当帰、牛膝、麦門冬、葛根、アマドコロ、何首烏</strong>など代表的な51種の薬用食材に対し、以下のデータが完全に設計されています。
            </p>
            <ul style="margin:0; padding-left:20px; display:flex; flex-direction:column; gap:5px;">
              <li><strong>寒熱温涼：</strong>温・冷の漢方的性質を調律する指標</li>
              <li><strong>五味および帰経：</strong>甘味、苦味などと作用臓器のマッピング</li>
              <li><strong>科学的機能成分：</strong>サポニン（ジンセノサイド）、デクリン、イヌリンなどのリアルタイム抽出</li>
              <li><strong>10g単位の栄養素数値：</strong>伝統大謝制御用の計算基準</li>
            </ul>
          </div>
        </div>
      `,
      ar: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-mortar-pestle"></i> دمج علم الأعشاب التقليدي والتغذية الحديثة</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              يعد <strong>قاموس ياكسون الغذائي</strong> الدليل الرئيسي لنوري لاب الذي يدمج الخصائص العشبية التقليدية المسجلة في المؤلفات القديمة (دونغوي بوغام، بينكاو غانغمو) مع قاعدة بيانات تركيب الأغذية الوطنية لـ RDA.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; font-size:0.88rem; color:var(--text-secondary);">
            <p style="margin:0 0 10px 0;">
              يغطي 51 مكونًا نباتيًا تمثيليًا بما في ذلك **الجينسينغ والقتاد والأنجليكا والأكيرانتس والليريوب وجذر السهم وختم سليمان وزهرة الصوف**، موضحًا بالتفصيل:
            </p>
            <ul style="margin:0; padding-left:20px; display:flex; flex-direction:column; gap:5px;">
              <li><strong>الخصائص الباردة والساخنة:</strong> مؤشر التوازن الحراري التقليدي (بارد/بارد/دافئ/حار/معتدل)</li>
              <li><strong>المذاقات الخمسة والقنوات:</strong> خرائط المذاقات (حلو، مر، إلخ) للأعضاء المستهدفة</li>
              <li><strong>المركبات الحيوية النشطة:</strong> السابونين (جينسينوسيدات)، الديكورسين، وخرائط الإينولين</li>
              <li><strong>المغذيات المعيارية لـ 10 جرام:</strong> أوزان السعرات الحرارية والمغذيات الكبيرة للتحكم في التمثيل الغذائي</li>
            </ul>
          </div>
        </div>
      `
    }
  },
  "monthly-ing": {
    title: {
      ko: "이달의 추천 절기 식재료 (6월 망종·하지)",
      en: "Recommended Seasonal Ingredients (June Solar Terms)",
      ja: "今月の推奨節気食材 (6月 芒種・夏至)",
      ar: "المكونات الموسمية الموصى بها (يونيو)"
    },
    html: {
      ko: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-sun"></i> 절기(夏至)에 순응하는 보양 약선</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              여름의 기운이 절정에 달하는 6월(망종·하지)에는 급격한 기온 상승으로 체외는 뜨거워지나 속(비위)은 차가워지기 쉬우며 수분 손실이 큽니다.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:10px; font-size:0.88rem;">
            <div>
              <strong style="color:#fff;"><span style="color:var(--primary);">🌾 보리, 율무 (맥류):</span></strong>
              <span style="color:var(--text-secondary);">몸속의 과도한 열을 내리고 소화 흡수를 도와 활력을 채웁니다. (태음인 시너지)</span>
            </div>
            <div>
              <strong style="color:#fff;"><span style="color:var(--primary);">🧄 햇마늘:</span></strong>
              <span style="color:var(--text-secondary);">성질이 따뜻하여 배앓이를 막고 저하된 비위의 소화 효소 분비를 촉진합니다. (소음인 시너지)</span>
            </div>
            <div>
              <strong style="color:#fff;"><span style="color:var(--primary);">🟢 매실:</span></strong>
              <span style="color:var(--text-secondary);">강력한 해독, 살균 기능으로 여름철 배탈·식중독을 예방하고 진액을 늘려 갈증을 끕니다.</span>
            </div>
            <div>
              <strong style="color:#fff;"><span style="color:var(--primary);">🥬 두릅, 취나물, 미나리:</span></strong>
              <span style="color:var(--text-secondary);">춘곤증 이후 쌓인 열독을 내보내며 풍부한 칼륨 및 미네랄로 전해질 균형을 지켜줍니다.</span>
            </div>
          </div>
        </div>
      `,
      en: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-sun"></i> Harmony with June Solar Terms (Mangjong & Haji)</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              In June, as summer heat peaks, the body surface becomes warm but internal organs tend to cool down, causing fluid loss and digestive sluggishness.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:10px; font-size:0.88rem;">
            <div>
              <strong style="color:#fff;"><span style="color:var(--primary);">🌾 Barley & Coix Seed (Grains):</span></strong>
              <span style="color:var(--text-secondary);">Cool down excess internal heat, promote digestion, and boost energy. (Taeumin Synergy)</span>
            </div>
            <div>
              <strong style="color:#fff;"><span style="color:var(--primary);">🧄 Fresh Garlic:</span></strong>
              <span style="color:var(--text-secondary);">Possesses warm properties to prevent abdominal chills and stimulate digestive enzymes. (Soeumin Synergy)</span>
            </div>
            <div>
              <strong style="color:#fff;"><span style="color:var(--primary);">🟢 Green Plum (Maesil):</span></strong>
              <span style="color:var(--text-secondary);">Strong detox and antibacterial effects. Prevents stomach upsets and replenishes body fluids.</span>
            </div>
            <div>
              <strong style="color:#fff;"><span style="color:var(--primary);">🥬 Herbal Greens (Aralia, Water Dropwort):</span></strong>
              <span style="color:var(--text-secondary);">Clear accumulated thermal toxins, offering potassium and essential minerals for electrolyte balance.</span>
            </div>
          </div>
        </div>
      `,
      ja: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-sun"></i> 夏至（はじ）に順応する滋養薬膳</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              夏の気がピークに達する6月（芒種・夏至）は、急激な気温上昇により体表は熱くなりますが、お腹（胃腸）は冷えやすく、水分損失が大きくなります。
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:10px; font-size:0.88rem;">
            <div>
              <strong style="color:#fff;"><span style="color:var(--primary);">🌾 大麦、ハトムギ (麦類)：</span></strong>
              <span style="color:var(--text-secondary);">体内の過度な熱を下げ、消化吸収を助けて活力を満たします。（太陰人シナジー）</span>
            </div>
            <div>
              <strong style="color:#fff;"><span style="color:var(--primary);">🧄 新にんにく：</span></strong>
              <span style="color:var(--text-secondary);">温性を帯びており、腹痛を防ぎ、低下した胃腸の消化酵素分泌を促進します。（少陰人シナジー）</span>
            </div>
            <div>
              <strong style="color:#fff;"><span style="color:var(--primary);">🟢 梅の実 (メシル)：</span></strong>
              <span style="color:var(--text-secondary);">強力な解毒・抗菌作用で夏の下痢や食中毒を予防し、喉の渇きを解消します。</span>
            </div>
            <div>
              <strong style="color:#fff;"><span style="color:var(--primary);">🥬 山菜 (タラノキ、セリなど)：</span></strong>
              <span style="color:var(--text-secondary);">体に溜まった熱毒を排出し、豊富なカリウムとミネラルで電解質バランスを保ちます。</span>
            </div>
          </div>
        </div>
      `,
      ar: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-sun"></i> التناغم مع شروط يونيو الشمسية</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              في شهر يونيو، مع ذروة حرارة الصيف، يصبح سطح الجسم دافئًا ولكن الأعضاء الداخلية تميل إلى البرودة، مما يسبب فقدان السوائل وخمول الهضم.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:10px; font-size:0.88rem;">
            <div>
              <strong style="color:#fff;"><span style="color:var(--primary);">🌾 الشعير وبذور كواكس (الحبوب):</span></strong>
              <span style="color:var(--text-secondary);">تبريد حرارة الجسم الداخلية الزائدة، وتعزيز الهضم، وزيادة الطاقة. (تآزر تيومين)</span>
            </div>
            <div>
              <strong style="color:#fff;"><span style="color:var(--primary);">🧄 الثوم الطازج:</span></strong>
              <span style="color:var(--text-secondary);">يمتلك خصائص دافئة لمنع قشعريرة البطن وتحفيز إنزيمات الهضم. (تآزر سومين)</span>
            </div>
            <div>
              <strong style="color:#fff;"><span style="color:var(--primary);">🟢 البرقوق الأخضر (ميسيل):</span></strong>
              <span style="color:var(--text-secondary);">تأثيرات قوية لإزالة السموم ومضادات البكتيريا. يمنع اضطرابات المعدة ويجدد سوائل الجسم.</span>
            </div>
            <div>
              <strong style="color:#fff;"><span style="color:var(--primary);">🥬 الخضروات العشبية (أراليا، كرفس الماء):</span></strong>
              <span style="color:var(--text-secondary);">تزيل السموم الحرارية المتراكمة، وتوفر البوتاسيوم والمعادن الأساسية لتوازن الكهاريج.</span>
            </div>
          </div>
        </div>
      `
    }
  },
  sauce: {
    title: {
      ko: "전통 한식 양념장 및 발효 기미 설계",
      en: "Traditional Condiment Formulation & Fermentation Properties",
      ja: "伝統韓国調味料＆発酵気味設計",
      ar: "تركيبة التوابل التقليدية وخصائص التخمير"
    },
    html: {
      ko: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-mortar-pestle"></i> 약성을 보완하고 독성을 제어하는 비법 양념</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              전통 약선 조리에서 **한식 양념장(Condiments)**은 단순한 조미료를 넘어, 주재료의 찬 기운이나 약리적 독성을 중화하고(상예·상살) 소화율을 극대화하는 중추적인 역할을 담당합니다.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; font-size:0.88rem; color:var(--text-secondary);">
            <ul style="margin:0; padding-left:20px; display:flex; flex-direction:column; gap:6px;">
              <li><strong>황기 3년 숙성 된장:</strong> 대두 단백질이 완전 발효되어 소화 장벽을 지키고, 황기의 보기(원기 보충) 성분과 결합하여 비위를 보합니다.</li>
              <li><strong>산사 고추장:</strong> 소화를 활성화하는 산사와 매콤하고 따뜻한 성질의 고추장이 결합하여 위장 온난화 작용을 돕습니다.</li>
              <li><strong>양념 R&D 활용:</strong> R&D 플래너의 <strong style="color:var(--primary);">양념/후식 (slot-sauce)</strong> 슬롯을 통해 이러한 약리 조율용 비법 양념장과 종가 전통 간장을 배합비에 결합하여 완결성 있는 메뉴를 설계할 수 있습니다.</li>
            </ul>
          </div>
        </div>
      `,
      en: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-mortar-pestle"></i> Secret Seasonings to Balance Efficacy & Manage Toxicity</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              In traditional Yakseon cooking, **Korean Condiments** act as critical therapeutic modulators, neutralizing cold energies or toxic side effects of primary ingredients while maximizing absorption.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; font-size:0.88rem; color:var(--text-secondary);">
            <ul style="margin:0; padding-left:20px; display:flex; flex-direction:column; gap:6px;">
              <li><strong>3-Year Aged Doenjang:</strong> Fully fermented soy proteins protect digestion, combining with astragalus to tonify qi and stomach.</li>
              <li><strong>Hawthorn Gochujang:</strong> Digestion-stimulating hawthorn berry extract combines with warm chili paste to gently warm the stomach.</li>
              <li><strong>Condiment R&D Usage:</strong> Use the <strong style="color:var(--primary);">Condiment/Dessert (slot-sauce)</strong> slot in the R&D Planner to incorporate heritage soy sauces and medicinal condiments into your recipes.</li>
            </ul>
          </div>
        </div>
      `,
      ja: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-mortar-pestle"></i> 薬性を補い毒性を制御する秘伝の調味料</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              伝統的な薬膳調理において、**韓国伝統調味料**は単なる味付けを超えて、主材料の強い冷えや薬理的な毒性を中和し、消化率を極大化する中枢的役割を担当します。
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; font-size:0.88rem; color:var(--text-secondary);">
            <ul style="margin:0; padding-left:20px; display:flex; flex-direction:column; gap:6px;">
              <li><strong>黄耆3年熟成味噌：</strong>大豆タンパクが完全発酵して胃腸を保護し、黄耆の補気（元気補給）成分と結合して胃腸を養います。</li>
              <li><strong>山査（サンサ）コチュジャン：</strong>消化を活性化する山査子と温性のコチュジャンが結合し、胃腸の温熱作用を助けます。</li>
              <li><strong>調味料R&Dの活用：</strong>R&Dプランナーの<strong style="color:var(--primary);">調味/デザート（slot-sauce）</strong>スロットを通じて、秘伝の薬理調味料や伝統醤油を配合に組み込み、完成度の高いメニューを設計できます。</li>
            </ul>
          </div>
        </div>
      `,
      ar: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-mortar-pestle"></i> توابل سرية لموازنة الفعالية وإدارة السمية</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              في طهي ياكسون التقليدي، تعمل **التوابل الكورية** كعوامل علاجية بالغة الأهمية، حيث تحيد الطاقات الباردة أو الآثار الجانبية السامة للمكونات الأساسية مع تعظيم الامتصاص.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; font-size:0.88rem; color:var(--text-secondary);">
            <ul style="margin:0; padding-left:20px; display:flex; flex-direction:column; gap:6px;">
              <li><strong>دوينجانغ معتق بثلاث سنوات:</strong> بروتينات صويا مخمرة بالكامل تحمي الهضم، وتندمج مع القتاد لتقوية تشي والمعدة.</li>
              <li><strong>غوتشوجانغ الزعرور:</strong> مستخلص ثمار الزعرور المحفز للهضم يندمج مع معجون الفلفل الحار الدافئ لتدفئة المعدة بلطف.</li>
              <li><strong>استخدام توابل البحث والتطوير:</strong> استخدم فتحة <strong style="color:var(--primary);">التوابل/الحلوى (slot-sauce)</strong> في مخطط البحث والتطوير لدمج صلصة الصويا التراثية والتوابل الطبية في وصفاتك.</li>
            </ul>
          </div>
        </div>
      `
    }
  }
};

function getLocalizedCookingStep(step, lang) {
  if (!lang || lang === 'ko') return step;
  
  if (step.includes('[준비]')) {
    const startIdx = step.indexOf('(');
    const endIdx = step.lastIndexOf(')');
    let listStr = '';
    if (startIdx !== -1 && endIdx !== -1) {
      const listContent = step.slice(startIdx + 1, endIdx);
      listStr = listContent.split(',').map(item => {
        const trimmed = item.trim();
        const lastSpaceIdx = trimmed.lastIndexOf(' ');
        if (lastSpaceIdx === -1) {
          return getTranslation(trimmed, lang);
        }
        const name = trimmed.slice(0, lastSpaceIdx).trim();
        const weight = trimmed.slice(lastSpaceIdx + 1).trim();
        return `${getTranslation(name, lang)} ${getTranslation(weight, lang)}`;
      }).join(', ');
    }
    
    if (lang === 'en') return `[Prep] Wash and prepare all ingredients. (${listStr})`;
    if (lang === 'ja') return `[準備] 食材をきれいに洗って準備します。 (${listStr})`;
    if (lang === 'ar') return `[التحضير] غسل المكونات وتحضيرها. (${listStr})`;
  }
  
  if (step.includes('장시간 충분히 먼저 달여') || step.includes('먼저 달여')) {
    let listStr = '';
    const pattern = /중\s+(.*?)\s+은|중\s+(.*?)\s+는/;
    const match = step.match(pattern);
    if (match) {
      const rawList = match[1] || match[2] || '';
      listStr = rawList.split(',').map(name => getTranslation(name.trim(), lang)).join(', ');
    }
    
    const stepNumMatch = step.match(/\[(\d+)단계\]/);
    const stepNum = stepNumMatch ? stepNumMatch[1] : '1';
    
    if (lang === 'en') return `[Step ${stepNum}] Decoct ${listStr} in water over high heat first, then reduce to low heat and simmer for 40 minutes.`;
    if (lang === 'ja') return `[${stepNum}段階] 薬材のうち ${listStr} は 水に入れて強火で沸騰させ、弱火に落として約40分間、十分に先に煎じます。`;
    if (lang === 'ar') return `[الخطوة ${stepNum}] يُغلى ${listStr} في الماء على نار عالية أولاً، ثم تُخفض الحرارة ويُطهى لمدة 40 دقيقة.`;
  }
  
  if (step.includes('추가로 끓여') || step.includes('추가로 끓여서')) {
    let listStr = '';
    const pattern = /식재료인\s+(.*?)\s+을|식재료인\s+(.*?)\s+를/;
    const match = step.match(pattern);
    if (match) {
      const rawList = match[1] || match[2] || '';
      listStr = rawList.split(',').map(name => getTranslation(name.trim(), lang)).join(', ');
    }
    
    const stepNumMatch = step.match(/\[(\d+)단계\]/);
    const stepNum = stepNumMatch ? stepNumMatch[1] : '2';
    
    if (lang === 'en') return `[Step ${stepNum}] Add the remaining ingredients (${listStr}) into the broth and boil for another 15-20 minutes.`;
    if (lang === 'ja') return `[${stepNum}段階] 抽出されたスープに残りの食材 ${listStr} を入れて、約15〜20分間追加で煮込み、香りと効能を調和させます。`;
    if (lang === 'ar') return `[الخطوة ${stepNum}] تُضاف المكونات المتبقية (${listStr}) إلى المرق وتُغلى لمدة 15-20 دقيقة أخرى.`;
  }
  
  if (step.includes('[완성]')) {
    if (lang === 'en') return `[Done] Serve the warm herbal tea, divided into morning and evening portions.`;
    if (lang === 'ja') return `[完成] 完成した薬膳スープを温めて、朝・夕に分けてお召し上がりください。`;
    if (lang === 'ar') return `[جاهز] يُقدم شاي الأعشاب الدافئ مقسماً على مرتين صباحاً ومساءً.`;
  }
  
  return step;
}

let recipesDbLocalized = {};
let traditionalDbLocalized = {};
let recipesDbKo = [];
let traditionalDbKo = [];
let translationDictionary = {};

// Subscribers and CRM states
let subscribersDb = [];
let pendingSubscriber = null;
let supplySourcesDb = [];
let visitorSuggestionsDb = [];
let communityPostsDb = [];
let currentCrmSubTab = 'subtab-leads';
let currentCrmSourceFilter = 'all';
let currentCommunityFilter = 'all';

// Pagination and Filtering State
let filteredMasterDb = [];
let browserPage = 1;
const browserPageSize = 20;

// Current Active Axis & Step
let activeAxis = '정화';
let activeFlowStep = 1;
let activeDiseaseIndex = null;
let activeTabId = 'tab-dashboard';

// Persona State (gateway, recipe, workspace)
let currentPersona = 'gateway';
let lastInferenceResult = null;
let lastRecommendedRecipe = null;

// ─── 7축 보정 및 역해결용 정규화 헬퍼 함수 ─────────────────────────
function getResolved7Axis(stdFunc, originalAxis) {
  if (originalAxis && originalAxis.trim() !== "") {
    return originalAxis.trim();
  }
  if (!stdFunc) return "보호";

  const f = stdFunc.trim();

  // 1. 표준기능목록 캐시에서 우선 매치 검사
  const matched = standardFunctions.find(item => item.표준기능 === f);
  if (matched && matched["7축"]) {
    return matched["7축"];
  }

  // 2. 키워드 기반 매핑
  if (f.includes('해독') || f.includes('항산화') || f.includes('염증') || f.includes('살충') || f.includes('기생충') || f.includes('구충') || f.includes('정화')) return '정화';
  if (f.includes('혈류') || f.includes('순환') || f.includes('통락') || f.includes('지혈') || f.includes('출혈') || f.includes('맥')) return '순환';
  if (f.includes('회복') || f.includes('보충') || f.includes('생기') || f.includes('재생') || f.includes('조직')) return '회복';
  if (f.includes('면역') || f.includes('보호') || f.includes('위장') || f.includes('간보호') || f.includes('신장보호') || f.includes('시각보호') || f.includes('명목') || f.includes('눈')) return '보호';
  if (f.includes('안정') || f.includes('진정') || f.includes('신경') || f.includes('수면')) return '안정';
  if (f.includes('소화') || f.includes('흡수') || f.includes('건비') || f.includes('비위')) return '흡수';
  if (f.includes('통증') || f.includes('완화') || f.includes('지통') || f.includes('경련') || f.includes('진해') || f.includes('기침') || f.includes('해열') || f.includes('진통') || f.includes('부종')) return '완화';

  // 3. 커스텀 단어 가드
  if (f.includes('가래제거') || f.includes('거담')) return '정화';
  if (f.includes('비뇨배출') || f.includes('이뇨')) return '정화';
  if (f.includes('설사완화') || f.includes('배변촉진') || f.includes('장관')) return '정화';
  if (f.includes('유산방지') || f.includes('안태')) return '보호';
  if (f.includes('감염관리')) return '보호';
  if (f.includes('근골강화')) return '회복';

  return "보호";
}

function getModernName(classicalName, lang = currentLanguage) {
  if (!classicalName) return "";
  const modernKo = modernNamesMap[classicalName] || classicalName;
  if (!lang || lang === 'ko') {
    return modernKo;
  }
  const translated = getTranslation(modernKo, lang);
  if (translated !== modernKo) {
    return translated;
  }
  return getTranslation(classicalName, lang);
}

// ─── 다국어 번역 및 i18n 연동 헬퍼 함수 ─────────────────────────
function getTranslation(key, lang) {
  if (!key) return "";
  const targetLang = lang || 'ko';
  
  const additionalMap = {
    "방문자": { en: "Visitor", ja: "訪問者", ar: "زائر" },
    "웰빙 회원": { en: "Wellbeing Member", ja: "ウェلビーイング会員", ar: "عضو العافية" },
    "일반 체질": { en: "General Constitution", ja: "一般体質", ar: "الدستور العام" },
    "전신 건강 관리": { en: "General Health Care", ja: "全身健康管理", ar: "الرعاية الصحية العامة" },
    "서울특별시 (기본값)": { en: "Seoul (Default)", ja: "ソウル特別市 (デフォルト)", ar: "سيول (افتراضي)" },
    "자동 측정 위치": { en: "Auto-detected Location", ja: "自動測定位置", ar: "الموقع المكتشف تلقائيًا" },
    "위치 미확인": { en: "Location Unverified", ja: "位置未確認", ar: "الموقع غير مؤكد" },
    "기상 데이터 분석중...": { en: "Analyzing weather...", ja: "기상 데이터 분석중...", ar: "جاري تحليل الطقس..." },
    "위치 정보 로드 중...": { en: "Loading location...", ja: "위치 정보 로드 중...", ar: "جاري تحميل الموقع..." },
    "날씨": { en: "Weather", ja: "天気", ar: "الطقس" },
    "황제내경, 동의보감, 본초강목 및 농진청 데이터를 기반으로 환자 상태에 맞는 최적의 보양식 처방을 창안합니다.": {
      en: "Based on Huangdi Neijing, Donguibogam, Bencao Gangmu, and RDA standard food data, we formulate the optimal wellness medicinal food recipe tailored to the patient's condition.",
      ja: "皇帝内経、東医宝鑑、本草綱目、および農村振興庁のデータを基に、患者の状態に合わせた最適な薬膳処方を作り出します。",
      ar: "بناءً على هوانغدي نيجينغ، ودونغ أوي بو غام، وبنشاو غانغمو، وبيانات الغذاء القياسية الصادرة عن إدارة التنمية الريفية، نقوم بتركيب وصفة الطعام الطبي المثالية المصممة خصيصاً لحالة المريض."
    },
    "오골계": { en: "Black Chicken", ja: "烏骨鶏", ar: "دجاج أسود" },
    "팔진탕(숙지황 10g)": { en: "Paljin-tang (with 10g Rehmannia)", ja: "八珍湯(熟地黄 10g)", ar: "بالجين تانغ (مع 10 جرام ريهمانيا)" },
    "당귀": { en: "Angelica Root (Danggui)", ja: "当帰", ar: "دونغ كواي" },
    "백작약": { en: "White Peony Root", ja: "白芍薬", ar: "جذر الفاوانيا البيضاء" },
    "천궁": { en: "Chuanxiong", ja: "川芎", ar: "كوان شيونغ" },
    "인삼": { en: "Ginseng", ja: "高麗人参", ar: "الجينسنغ" },
    "숙지황": { en: "Rehmannia Root", ja: "熟地黄", ar: "ريهمانيا" },
    "오골계 1마리": { en: "1 Black Chicken", ja: "烏骨鶏 1羽", ar: "دجاجة سوداء واحدة" },
    "오골계(1마리)": { en: "Black Chicken (1 whole)", ja: "烏骨鶏(1羽)", ar: "دجاج أسود (دجاجة كاملة)" },
    "1마리": { en: "1 whole", ja: "1羽", ar: "دجاجة كاملة" },
    "적당량": { en: "Moderate Amount", ja: "適量", ar: "كمية معتدلة" },
    "식료 보양": { en: "Dietary Nourishment", ja: "食療補養", ar: "التغذية الغذائية" },
    "기본 조리법": { en: "Basic Preparation", ja: "基本調理法", ar: "طريقة التحضير الأساسية" },
    "약선 배합": { en: "Medicinal Pairing", ja: "薬膳配合", ar: "الاقتران الدوائي" },
    "기혈(氣血)을 쌍보하여 극도의 허약 체질을 개선하고 출산 후 보양 + 생리불순 + 빈혈 완화": {
      en: "Nourishes both Qi & Blood, improves extreme weakness, provides postpartum recovery, regulates menstruation & relieves anemia",
      ja: "気血を補って極度の虚弱体質を改善し、出産後の保養・月経不順・貧血を緩和します",
      ar: "يغذي طاقة تشي والدم، ويحسن الضعف الشديد، ويساعد على التعافي بعد الولادة، وينظم الدورة الشهرية ويخفف فقر الدم"
    }
  };

  const cleanKey = key.trim();
  if (additionalMap[cleanKey] && additionalMap[cleanKey][targetLang]) {
    return additionalMap[cleanKey][targetLang];
  }

  if (key === '현대명') {
    const map = {
      ko: '현대명',
      en: 'Common Name',
      ja: '現代名',
      ar: 'الاسم الحديث'
    };
    return map[targetLang] || map.ko;
  }
  
  if (!translationDictionary) return key;

  // 1. Direct root key lookup (for globally registered UI labels)
  if (translationDictionary[key] && !key.startsWith('category_') && key !== 'meta') {
    const item = translationDictionary[key];
    if (targetLang === 'ko') {
      return item.ko || key;
    }
    if (targetLang === 'en') {
      const persona = currentPersona || 'recipe';
      if (persona === 'workspace' && item.en_academic) {
        return item.en_academic;
      }
      if (persona === 'recipe' && item.en_consumer) {
        return item.en_consumer;
      }
      return item.en || item.en_academic || item.en_consumer || item.ko || key;
    }
    return item[targetLang] || item.ko || key;
  }
  
  for (const catName in translationDictionary) {
    if (catName.startsWith('category_')) {
      const category = translationDictionary[catName];
      if (category[key]) {
        const item = category[key];
        if (targetLang === 'ko') {
          return item.ko || key;
        }
        if (targetLang === 'en') {
          const persona = currentPersona || 'recipe';
          if (persona === 'workspace' && item.en_academic) {
            return item.en_academic;
          }
          if (persona === 'recipe' && item.en_consumer) {
            return item.en_consumer;
          }
          return item.en || item.en_academic || item.en_consumer || item.ko || key;
        }
        return item[targetLang] || item.ko || key;
      }
    }
  }
  return key;
}

function getLocalizedNatureTaste(text, lang) {
  if (!lang || lang === 'ko') return text;
  if (!text) return '';
  
  const dict = {
    "따뜻": { en: "Warm", ja: "温性", ar: "دافئ" },
    "온(溫)": { en: "Warm", ja: "温", ar: "دافئ" },
    "온성": { en: "Warm", ja: "温性", ar: "دافئ" },
    "차가": { en: "Cold", ja: "寒性", ar: "بارد" },
    "한(寒)": { en: "Cold", ja: "寒", ar: "بارد" },
    "한성": { en: "Cold", ja: "寒性", ar: "بارد" },
    "서늘": { en: "Cool", ja: "涼性", ar: "بارد قليلاً" },
    "량(凉)": { en: "Cool", ja: "涼", ar: "بارد قليلاً" },
    "평(平)": { en: "Neutral", ja: "平性", ar: "متعادل" },
    "평성": { en: "Neutral", ja: "平性", ar: "متعادل" },
    "평하다": { en: "Neutral", ja: "平性", ar: "متعادل" },
    "평": { en: "Neutral", ja: "平性", ar: "متعادل" },
    "차": { en: "Cold", ja: "寒性", ar: "بارد" },
    "시원": { en: "Cool", ja: "涼性", ar: "بارد قليلاً" },
    "뜨겁": { en: "Hot", ja: "熱", ar: "حار" },
    "열(熱)": { en: "Hot", ja: "熱", ar: "حار" },
    "달": { en: "Sweet", ja: "甘味", ar: "حلو" },
    "감(甘)": { en: "Sweet", ja: "甘", ar: "حلو" },
    "단맛": { en: "Sweet", ja: "甘味", ar: "حلو" },
    "쓰": { en: "Bitter", ja: "苦味", ar: "مر" },
    "고(苦)": { en: "Bitter", ja: "苦", ar: "مر" },
    "쓴맛": { en: "Bitter", ja: "苦味", ar: "مر" },
    "맵": { en: "Spicy", ja: "辛味", ar: "حار (توابل)" },
    "신(辛)": { en: "Spicy", ja: "辛", ar: "حار" },
    "매운맛": { en: "Spicy", ja: "辛味", ar: "حار" },
    "시": { en: "Sour", ja: "酸味", ar: "حامض" },
    "산(酸)": { en: "Sour", ja: "酸", ar: "حامض" },
    "신맛": { en: "Sour", ja: "酸味", ar: "حامض" },
    "짜": { en: "Salty", ja: "塩味", ar: "مالح" },
    "함(咸)": { en: "Salty", ja: "咸", ar: "مالح" },
    "짠맛": { en: "Salty", ja: "塩味", ar: "مالح" },
    "떫": { en: "Astringent", ja: "渋味", ar: "قابض" },
    "삽(澀)": { en: "Astringent", ja: "渋", ar: "قابض" },
    "떫은맛": { en: "Astringent", ja: "渋味", ar: "قابض" }
  };

  let natures = [];
  let tastes = [];

  ["따뜻", "온(溫)", "온성", "차가", "한(寒)", "한성", "서늘", "량(凉)", "평(平)", "평성", "평하다", "평", "차", "시원", "뜨겁", "열(熱)"].forEach(k => {
    if (text.includes(k)) natures.push(dict[k][lang]);
  });

  ["달", "감(甘)", "단맛", "쓰", "고(苦)", "쓴맛", "맵", "신(辛)", "매운맛", "시", "산(酸)", "신맛", "짜", "함(咸)", "짠맛", "떫", "삽(澀)", "떫은맛"].forEach(k => {
    if (text.includes(k)) tastes.push(dict[k][lang]);
  });

  natures = [...new Set(natures)];
  tastes = [...new Set(tastes)];

  const natureStr = natures.join(', ');
  const tasteStr = tastes.join(', ');

  if (lang === 'en') {
    let res = '';
    if (natureStr) res += `Nature: ${natureStr}`;
    if (tasteStr) {
      if (res) res += ' / ';
      res += `Taste: ${tasteStr}`;
    }
    let meridians = [];
    if (text.includes('심경')) meridians.push('Heart');
    if (text.includes('간경')) meridians.push('Liver');
    if (text.includes('위경')) meridians.push('Stomach');
    if (text.includes('폐경')) meridians.push('Lung');
    if (text.includes('신경')) meridians.push('Kidney');
    if (text.includes('비경')) meridians.push('Spleen');
    if (meridians.length > 0) {
      if (res) res += ' / ';
      res += `Meridians: ${meridians.join(', ')}`;
    }
    return res || text;
  }
  if (lang === 'ja') {
    let res = '';
    if (natureStr) res += `性質: ${natureStr}`;
    if (tasteStr) {
      if (res) res += ' / ';
      res += `味: ${tasteStr}`;
    }
    let meridians = [];
    if (text.includes('심경')) meridians.push('心経');
    if (text.includes('간경')) meridians.push('肝経');
    if (text.includes('위경')) meridians.push('胃経');
    if (text.includes('폐경')) meridians.push('肺経');
    if (text.includes('신경')) meridians.push('腎経');
    if (text.includes('비경')) meridians.push('脾経');
    if (meridians.length > 0) {
      if (res) res += ' / ';
      res += `帰経: ${meridians.join(', ')}`;
    }
    return res || text;
  }
  if (lang === 'ar') {
    let res = '';
    if (natureStr) res += `الطبيعة: ${natureStr}`;
    if (tasteStr) {
      if (res) res += ' / ';
      res += `الطعم: ${tasteStr}`;
    }
    let meridians = [];
    if (text.includes('심경')) meridians.push('القلب');
    if (text.includes('간경')) meridians.push('الكبد');
    if (text.includes('위경')) meridians.push('المعدة');
    if (text.includes('폐경')) meridians.push('الرئة');
    if (text.includes('신경')) meridians.push('الكلى');
    if (text.includes('비경')) meridians.push('الطحال');
    if (meridians.length > 0) {
      if (res) res += ' / ';
      res += `المسارات: ${meridians.join(', ')}`;
    }
    return res || text;
  }
  return text;
}

function getLocalizedEfficacy(text, lang) {
  if (!lang || lang === 'ko') return text;
  if (!text) return '';

  const transMap = {
    "가래완화": { en: "Resolve Phlegm", ja: "痰の緩和", ar: "تخفيف البلغم" },
    "기침완화": { en: "Relieve Cough", ja: "咳の緩和", ar: "تخفيف السعال" },
    "수분대사조절": { en: "Regulate Fluid Metabolism", ja: "水分代謝調節", ar: "تنظيم استقلاب السوائل" },
    "호흡개선": { en: "Improve Respiration", ja: "呼吸改善", ar: "تحسين التنفس" },
    "가려움완화": { en: "Relieve Itching", ja: "痒みの緩和", ar: "تخفيف الحكة" },
    "간기능개선": { en: "Improve Liver Function", ja: "간기능개선", ar: "تحسين وظائف الكبد" },
    "원기회복": { en: "Restore Vitality", ja: "元気回復", ar: "استعادة الحيوية" },
    "간보호": { en: "Protect Liver", ja: "간보호", ar: "حماية الكبد" },
    "갈증완화": { en: "Relieve Thirst", ja: "渇きの緩和", ar: "تخفيف العطش" },
    "감기완화": { en: "Relieve Cold", ja: "風邪の緩和", ar: "تخفيف نزلات البرد" },
    "냉증완화": { en: "Relieve Coldness", ja: "冷え症の緩和", ar: "تخفيف البرودة" },
    "발열완화": { en: "Relieve Fever", ja: "発熱の緩和", ar: "تخفيف الحمى" },
    "독소제거": { en: "Remove Toxins", ja: "독소제거", ar: "إزالة السموم" },
    "강근골": { en: "Strengthen Bones/Muscles", ja: "筋骨を強くする", ar: "تقوية العظام والعضلات" },
    "강기": { en: "Lower Qi", ja: "降気", ar: "خفض طاقة تشي" },
    "거담": { en: "Resolve Phlegm", ja: "去痰", ar: "إزالة البلغم" },
    "거습": { en: "Remove Dampness", ja: "去湿", ar: "إزالة الرطوبة" },
    "청열": { en: "Clear Heat", ja: "清熱", ar: "تطهير الحرارة" },
    "보기": { en: "Tonify Qi", ja: "補気", ar: "تقوية طاقة تشي" },
    "보혈": { en: "Tonify Blood", ja: "補血", ar: "تقوية الدم" },
    "소식": { en: "Promote Digestion", ja: "消食", ar: "تعزيز الهضم" },
    "개위": { en: "Improve Appetite", ja: "開胃", ar: "تحسين الشهية" },
    "지통": { en: "Relieve Pain", ja: "止痛", ar: "تخفيف الألم" },
    "지구": { en: "Relieve Vomiting", ja: "止嘔", ar: "تخفيف القيء" },
    "화담": { en: "Transform Phlegm", ja: "化痰", ar: "تحويل البلغم" },
    "이뇨": { en: "Promote Urination", ja: "利尿", ar: "إدرار البول" },
    "안태": { en: "Prevent Miscarriage", ja: "安胎", ar: "منع الإجهاض" },
    "온중": { en: "Warm the Middle", ja: "温中", ar: "تدفئة الوسط" },
    "위장강화": { en: "Strengthen Stomach", ja: "위장강화", ar: "تقوية المعدة" },
    "소화촉진": { en: "Promote Digestion", ja: "消化促進", ar: "تعزيز الهضم" },
    "장운동개선": { en: "Improve Bowel Movement", ja: "장운동개선", ar: "추진력" },
    "장건강": { en: "Gut Health", ja: "장건강", ar: "안녕" },
    "식욕촉진": { en: "Stimulate Appetite", ja: "식욕촉진", ar: "식욕" },
    "혈액순환개선": { en: "Improve Blood Circulation", ja: "혈액순환개선", ar: "혈류" },
    "면역력강화": { en: "Strengthen Immunity", ja: "면역력강화", ar: "면역" },
    "체액보충": { en: "Generate Fluids", ja: "体液の補充", ar: "تجديد سوائل الجسم" },
    "통증완화": { en: "Relieve Pain", ja: "痛みの緩和", ar: "تخفيف الألم" },
    "기력보충": { en: "Replenish Vitality", ja: "気力の補充", ar: "تعويض 에너지" },
    "약성조화": { en: "Harmonize Herbs", ja: "薬性の調和", ar: "تنسيق خصائص الأعشاب" },
    "정신안정": { en: "Calm the Mind", ja: "精神の安定", ar: "تهدئة الأعصاب" },
    "진액생성": { en: "Generate Fluids", ja: "津液の生成", ar: "توليد سوائل الجسم" },
    "소화보조": { en: "Aid Digestion", ja: "消化補助", ar: "مساعد الهضم" },
    "어혈제거": { en: "Remove Blood Stasis", ja: "瘀血の除去", ar: "إزالة الدم 정체" },
    "수족냉증완화": { en: "Relieve Cold Hands/Feet", ja: "手足의 냉증 완화", ar: "تخفيف برودة اليدين والقدمين" },
    "수족냉증개선": { en: "Improve Cold Hands/Feet", ja: "手足의 냉증 개선", ar: "تحسين برودة اليدين والقدمين" },
    "대보원기": { en: "Greatly Tonify Qi", ja: "大補元気", ar: "تقوية الطاقة الكلية" },
    "복맥고탈": { en: "Restore Pulse & Save from Collapse", ja: "脈を復し虚脱을 救う", ar: "استعادة النبض والإنقاذ من الانهيار" },
    "생진양혈": { en: "Generate Fluids & Nourish Blood", ja: "生津養血", ar: "توليد السوائل وتغذية الدم" },
    "온비지사": { en: "Warm Spleen to Stop Diarrhea", ja: "温脾止瀉", ar: "تدفئة الطحال لوقف الإسهال" },
    "온중건비": { en: "Warm Middle & Strengthen Spleen", ja: "温中健脾", ar: "تدفئة الوسط وتقوية الطحال" },
    "행기지통": { en: "Promote Qi & Relieve Pain", ja: "行気止痛", ar: "تحريك الطاقة وتخفيف الألم" },
    "화위지구": { en: "Harmonize Stomach to Stop Vomiting", ja: "和胃止嘔", ar: "موازنة المعدة لوقف القيء" },
    "해표산한": { en: "Relieve Exterior & Dispel Cold", ja: "解表散寒", ar: "تخفيف البرد الخارجي" },
    "온폐지해": { en: "Warm Lungs to Relieve Cough", ja: "温肺止咳", ar: "تدفئة الرئتين لوقف السعال" },
    "선폐평천": { en: "Diffuse Lungs & Calm Wheezing", ja: "宣肺平喘", ar: "تهوية الرئتين وتخفيف الربو" },
    "보폐익신": { en: "Nourish Lungs & Tonify Kidneys", ja: "補肺益腎", ar: "تغذية الرئتين وتقوية الكلى" },
    "익신고정": { en: "Nourish Kidneys & Consolidate Essence", ja: "益腎固精", ar: "تقوية الكلى وتثبيت الجوهر" },
    "안태작용": { en: "Prevent Miscarriage", ja: "安胎作用", ar: "منع الإجهاض" },
    "건비지사": { en: "Strengthen Spleen to Stop Diarrhea", ja: "健脾止瀉", ar: "تقوية الطحال لوقف الإسهال" },
    "청간명목": { en: "Clear Liver & Brighten Eyes", ja: "清肝明目", ar: "تطهير الكبد وتوضيح البصر" },
    "거풍이습": { en: "Dispel Wind & Drain Dampness", ja: "祛風利湿", ar: "طرد الرياح وتصريف الرطوبة" },
    "허리강화": { en: "Strengthen Waist", ja: "腰の強化", ar: "تقوية الخصر" },
    "활력증진": { en: "Vitality Boost", ja: "活力増進", ar: "تعزيز الحيوية" },
    "근골강화": { en: "Strengthen Bones/Muscles", ja: "筋骨の強化", ar: "تقوية العظام/العضلات" },
    "호흡기보호": { en: "Respiratory Protection", ja: "呼吸器保護", ar: "حماية الجهاز التنفسي" },
    "기력회복": { en: "Restore Vitality", ja: "気力回復", ar: "استعادة الحيوية" }
  };

  let parts = [text];
  const delimiters = ['+', ',', ' 및 ', '/'];
  for (const delim of delimiters) {
    let nextParts = [];
    for (const p of parts) {
      nextParts = nextParts.concat(p.split(delim));
    }
    parts = nextParts;
  }

  const translatedParts = parts.map(p => {
    const trimmed = p.trim();
    if (!trimmed) return '';
    if (transMap[trimmed]) return transMap[trimmed][lang];
    return getTranslation(trimmed, lang);
  }).filter(p => p.length > 0);

  return translatedParts.join(' + ');
}

function getLocalizedCooking(text, lang) {
  if (!lang || lang === 'ko') return text;
  if (!text) return '';

  const transMap = {
    "일반 조리": { en: "General Cooking", ja: "一般調理", ar: "طهي عام" },
    "쪼개어 넣음": { en: "Add Split", ja: "割り入れる", ar: "إضافة مقسمة" },
    "발효/죽 적합": { en: "Suitable for Fermentation/Porridge", ja: "発酵・お粥に適する", ar: "مناسب للتخمير/الثريد" },
    "장시간 끓임": { en: "Boil for Long Time", ja: "長時間煮沸", ar: "غلي لفترة طويلة" },
    "물에 달여 섭취": { en: "Decoct in Water", ja: "水で煎じて摂取", ar: "مغلي بالماء" },
    "차로 우려 마심": { en: "Brew as Tea", ja: "茶として煎じる", ar: "يغلي كشاي" },
    "생으로 사용": { en: "Use Raw", ja: "生で使用", ar: "يستخدم نيئاً" },
    "따뜻한 탕 적합": { en: "Suitable for Warm Decoction", ja: "温かい湯に適する", ar: "مناسب للمغلي الدافئ" },
    "비가열/추출 적합": { en: "Suitable for Cold Extraction", ja: "非加熱・抽出に適する", ar: "مناسب للاستخلاص البارد" },
    "수프/차 적합": { en: "Suitable for Soup/Tea", ja: "スープ・お茶に適する", ar: "مناسب للحساء/الشاي" },
    "온탕 적합": { en: "Suitable for Warm Brew", ja: "温湯に適する", ar: "مناسب للنقع الدافئ" },
    "장시간 탕 적합": { en: "Suitable for Long Boiling", ja: "長時間煮沸に適する", ar: "مناسب للغلي الطويل" },
    "저온조리 권장": { en: "Low-Temperature Cooking Recommended", ja: "低温調理推奨", ar: "يوصى بالطهي في درجة حرارة منخفضة" },
    "차/죽 적합": { en: "Suitable for Tea/Porridge", ja: "茶・お粥に適する", ar: "مناسب للشاي/الثريد" },
    "추출탕 적합": { en: "Suitable for Decoction Extraction", ja: "抽出湯に適する", ar: "مناسب للاستخلاص بالغلي" },
    "탕/농축 적합": { en: "Suitable for Decoction/Concentrate", ja: "湯・濃縮に適する", ar: "مناسب للمغلي/المركز" }
  };

  const trimmed = text.trim();
  if (transMap[trimmed]) return transMap[trimmed][lang];
  return getTranslation(trimmed, lang);
}

function getLocalizedRecipeName(result, lang) {
  if (!lang || lang === 'ko') return result.recipe_name;
  
  const gun = result.composition.find(i => i.role.includes('군약') || i.role.includes('Chief') || i.role.includes('Gun'));
  const sin = result.composition.find(i => i.role.includes('신약') || i.role.includes('Assistant') || i.role.includes('Minister'));
  const gunName = gun ? getTranslation(gun.name, lang) : '';
  const sinName = sin ? getTranslation(sin.name, lang) : '';
  
  const constitution = result.query.constitution;
  const constName = getTranslation(constitution, lang);
  
  if (lang === 'en') {
    let base = `${gunName} & ${sinName} Herbal Tea`;
    if (constitution && constitution !== 'General') {
      base += ` (${constName})`;
    }
    return base;
  } else if (lang === 'ja') {
    let base = `${gunName}${sinName}薬膳`;
    if (constitution && constitution !== 'General') {
      base += ` (${constName})`;
    }
    return base;
  } else if (lang === 'ar') {
    let base = `شاي الأعشاب ${gunName} و ${sinName}`;
    if (constitution && constitution !== 'General') {
      base += ` (${constName})`;
    }
    return base;
  }
  return result.recipe_name;
}

function getLocalizedCookingStep(step, lang) {
  if (!lang || lang === 'ko') return step;
  
  if (step.includes('[준비]')) {
    const startIdx = step.indexOf('(');
    const endIdx = step.lastIndexOf(')');
    let listStr = '';
    if (startIdx !== -1 && endIdx !== -1) {
      const listContent = step.slice(startIdx + 1, endIdx);
      listStr = listContent.split(',').map(item => {
        const parts = item.trim().split(' ');
        const name = parts[0];
        const weight = parts[1] || '';
        return `${getTranslation(name, lang)} ${weight}`;
      }).join(', ');
    }
    
    if (lang === 'en') return `[Prep] Wash and prepare all ingredients. (${listStr})`;
    if (lang === 'ja') return `[準備] 食材をきれいに洗って準備します。 (${listStr})`;
    if (lang === 'ar') return `[التحضير] غسل المكونات وتحضيرها. (${listStr})`;
  }
  
  if (step.includes('장시간 충분히 먼저 달여') || step.includes('먼저 달여')) {
    let listStr = '';
    const pattern = /중\\s+(.*?)\\s+은|중\\s+(.*?)\\s+는/;
    const match = step.match(pattern);
    if (match) {
      const rawList = match[1] || match[2] || '';
      listStr = rawList.split(',').map(name => getTranslation(name.trim(), lang)).join(', ');
    }
    
    const stepNumMatch = step.match(/\\[(\\d+)단계\\]/);
    const stepNum = stepNumMatch ? stepNumMatch[1] : '1';
    
    if (lang === 'en') return `[Step ${stepNum}] Decoct ${listStr} in water over high heat first, then reduce to low heat and simmer for 40 minutes.`;
    if (lang === 'ja') return `[${stepNum}段階] 薬材のうち ${listStr} は水に入れて強火で沸騰させ、弱火に落として約40分間十分に煎じます。`;
    if (lang === 'ar') return `[الخطوة ${stepNum}] يُغلى ${listStr} في الماء على نار عالية أولاً، ثم تُخفض الحرارة ويُطهى لمدة 40 دقيقة.`;
  }
  
  if (step.includes('추가로 끓여') || step.includes('추가로 끓여서')) {
    let listStr = '';
    const pattern = /식재료인\\s+(.*?)\\s+을|식재료인\\s+(.*?)\\s+를/;
    const match = step.match(pattern);
    if (match) {
      const rawList = match[1] || match[2] || '';
      listStr = rawList.split(',').map(name => getTranslation(name.trim(), lang)).join(', ');
    }
    
    const stepNumMatch = step.match(/\\[(\\d+)단계\\]/);
    const stepNum = stepNumMatch ? stepNumMatch[1] : '2';
    
    if (lang === 'en') return `[Step ${stepNum}] Add the remaining ingredients (${listStr}) into the broth and boil for another 15-20 minutes.`;
    if (lang === 'ja') return `[${stepNum}段階] 抽出されたスープに残りの食材 ${listStr} を入れ、約15〜20分간追加で煮て仕上げます。`;
    if (lang === 'ar') return `[الخطوة ${stepNum}] تُضاف المكونات المتبقية (${listStr}) إلى المرق وتُغلى لمدة 15-20 دقيقة أخرى.`;
  }
  
  if (step.includes('[완성]')) {
    if (lang === 'en') return `[Done] Serve the warm herbal tea, divided into morning and evening portions.`;
    if (lang === 'ja') return `[完成] 完成した薬膳スープ를 온めて、朝・夕に分けてお召し上がりください。`;
    if (lang === 'ar') return `[جاهز] يُقدم شاي الأعشاب الدافئ مقسماً على مرتين صباحاً ومساءً.`;
  }
  
  return step;
}

function getRecipeImage(recipeName) {
  let imgSrc = 'tea-01.png'; // default
  if (!recipeName) return imgSrc;
  const name = recipeName.toLowerCase();
  
  if (name.includes('막걸리') || name.includes('makgeolli') || name.includes('omija')) {
    imgSrc = 'omija_makgeolli.png';
  } else if (name.includes('소주') || name.includes('인삼주') || name.includes('홍삼주') || name.includes('soju') || name.includes('ginseng soju')) {
    imgSrc = 'liq-03.png';
  } else if (name.includes('주') || name.includes('술') || name.includes('약주') || name.includes('국화주') || name.includes('liq') || name.includes('wine')) {
    imgSrc = 'liq-02.png';
  } else if (name.includes('죽') || name.includes('미음') || name.includes('porridge') || name.includes('gruel')) {
    imgSrc = 'nutr-01.png';
  } else if (name.includes('밥') || name.includes('솥밥') || name.includes('rice')) {
    imgSrc = 'rice-01.png';
  } else if (name.includes('된장') || name.includes('doenjang')) {
    imgSrc = 'paste-01.png';
  } else if (name.includes('고추장') || name.includes('gochujang')) {
    imgSrc = 'paste-02.png';
  } else if (name.includes('간장') || name.includes('ganjang')) {
    imgSrc = 'paste-03.png';
  } else if (name.includes('산사') || name.includes('구기자') || name.includes('오미자') || name.includes('schisandra') || name.includes('goji') || name.includes('hawthorn')) {
    imgSrc = 'herb-02.png';
  } else if (name.includes('인삼') || name.includes('백출') || name.includes('황기') || name.includes('당귀') || name.includes('맥문동') || name.includes('ginseng') || name.includes('astragalus') || name.includes('angelica')) {
    imgSrc = 'herb-01.png';
  } else if (name.includes('민들레') || name.includes('dandelion')) {
    imgSrc = 'htea-01.png';
  } else if (name.includes('쑥') || name.includes('mugwort')) {
    imgSrc = 'htea-02.png';
  } else if (name.includes('녹차') || name.includes('green tea')) {
    imgSrc = 'tea-01.png';
  } else if (name.includes('황차') || name.includes('hwangcha')) {
    imgSrc = 'tea-02.png';
  }
  return imgSrc;
}

function updateRecipeImage(recipeName) {
  const imgEl = document.getElementById('res-recipe-image');
  if (!imgEl) return;
  const imgSrc = getRecipeImage(recipeName);
  imgEl.style.backgroundImage = `url('./${imgSrc}')`;
}

function showRecipeDetail(recipe) {
  const overlay = document.getElementById('detail-modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');
  if (!overlay || !title || !body) return;

  const lang = currentLanguage;
  const lr = getLocalizedRecipe(recipe, lang);

  // Localized Labels
  const labels = {
    title: { ko: '상세 정보', en: 'Details', ja: '詳細情報', ar: 'تفاصيل' },
    mainIng: { ko: '주재료', en: 'Main Ingredients', ja: '主材料', ar: 'المكونات الرئيسية' },
    subIng: { ko: '부재료 및 한약재', en: 'Sub-ingredients & Herbs', ja: '副材料および薬材', ar: 'المكونات الفرعية والأعشاب' },
    efficacy: { ko: '주요 효능', en: 'Main Efficacy & Benefits', ja: '主な効能と効果', ar: 'الفوائد والفعالية الرئيسية' },
    gimi: { ko: '기미 및 귀경', en: 'Properties & Meridians', ja: '기미 및 귀경 (性味と帰経)', ar: 'الطبيعة والمذاق ومسارات الطاقة' },
    cooking: { ko: '전통 조리 시퀀스', en: 'Traditional Cooking Sequence', ja: '伝統적調理シーケンス', ar: 'خطوات الطهي التقليدي' },
    gogeung: { ko: '전통 문헌 고증', en: 'Historical Authenticity', ja: '伝統文献の考証 (고증)', ar: 'التوثيق التاريخي للمصدر' },
    source: { ko: '고조리서 출처', en: 'Classical Literature Source', ja: '古調理書出典', ar: 'مصدر كتب الطهي القديمة' }
  };

  const t = (lblKey) => (labels[lblKey][lang] || labels[lblKey].ko);

  title.innerText = lang === 'ko' ? `📖 ${recipe.요리명} 상세 정보` : `📖 ${recipe.요리명} (${lr.요리명}) 상세 정보`;

  // Image topping thumbnail logic for multilingual mode
  let imgHtml = '';
  if (lang !== 'ko') {
    const imgSrc = getRecipeImage(recipe.요리명);
    imgHtml = `
      <div class="recipe-detail-thumb-wrapper" style="width: 100%; height: 180px; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 4px 15px rgba(0,0,0,0.4); position: relative; margin-bottom: 15px;">
        <div style="width: 100%; height: 100%; background-image: url('./${imgSrc}'); background-size: cover; background-position: center; transition: all 0.5s ease;"></div>
        <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(12,18,32,0.95), transparent); padding: 12px 16px; display: flex; align-items: flex-end; justify-content: space-between;">
          <span style="font-size: 0.78rem; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.5px; background: rgba(0,0,0,0.4); padding: 2px 8px; border-radius: 4px; border: 1px solid var(--border-glass);">
            ${lr.category || lr.카테고리 || 'Recipe'}
          </span>
        </div>
      </div>
    `;
  }

  // Historical citation / context card design refactoring (고증 카드 디자인 리팩토링)
  let heritageHtml = '';
  if (lr.ancient_citation || lr.ancient_context) {
    const citation = lr.ancient_citation || '동의보감(Donguibogam)';
    const context = lr.ancient_context || '';
    
    heritageHtml = `
      <div class="recipe-heritage-card" style="position: relative; background: rgba(245, 158, 11, 0.03); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: 12px; padding: 16px; margin-bottom: 15px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.05); overflow: hidden;">
        <div style="position: absolute; right: 12px; top: 12px; font-size: 2.2rem; color: rgba(245, 158, 11, 0.05); pointer-events: none;">
          <i class="fa-solid fa-scroll"></i>
        </div>
        <h4 style="margin-top:0; margin-bottom:8px; font-size:0.85rem; color:var(--sa-color); display:flex; align-items:center; gap:8px; text-transform: none;">
          <i class="fa-solid fa-scroll" style="color:var(--sa-color);"></i>
          <span>${t('gogeung')}</span>
        </h4>
        <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 6px; font-style: italic; line-height: 1.5;">
          "${context}"
        </p>
        <div style="font-size: 0.72rem; color: var(--sa-color); font-weight: 700; text-align: right; margin-top: 4px; border-top: 1px dashed rgba(245, 158, 11, 0.15); padding-top: 6px;">
          <i class="fa-solid fa-bookmark"></i> ${t('source')}: ${citation}
        </div>
      </div>
    `;
  }

  body.innerHTML = `
    ${imgHtml}
    
    ${heritageHtml}

    <div class="modal-section" style="margin-bottom: 15px;">
      <h4 style="color: var(--primary);"><i class="fa-solid fa-circle-info"></i> ${t('mainIng')}</h4>
      <p style="font-size: 0.95rem; font-weight: 600; color: #fff; background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-glass);">
        ${lr.주재료}
      </p>
    </div>

    <div class="modal-section" style="margin-bottom: 15px;">
      <h4 style="color: var(--primary);"><i class="fa-solid fa-seedling"></i> ${t('subIng')}</h4>
      <p style="font-size: 0.92rem; color: var(--text-main); background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-glass);">
        ${lr["부재료 및 약재"] || lr["부재료"] || "-"}
      </p>
    </div>

    <div class="modal-section" style="margin-bottom: 15px;">
      <h4 style="color: var(--primary);"><i class="fa-solid fa-heart-pulse"></i> ${t('efficacy')}</h4>
      <p style="font-size: 0.92rem; color: var(--text-main); line-height: 1.5;">
        ${lr.주요효능 || lr.주요_효능 || ""}
      </p>
    </div>

    <div class="modal-section" style="margin-bottom: 15px;">
      <h4 style="color: var(--primary);"><i class="fa-solid fa-compass"></i> ${t('gimi')}</h4>
      <p style="font-size: 0.92rem; color: var(--text-main); font-weight: 500;">
        ${lr["기미 및 귀경"] || lr["기미"] || "정보 준비중"}
      </p>
    </div>

    <div class="modal-section" style="margin-bottom: 5px;">
      <h4 style="color: var(--sa-color);"><i class="fa-solid fa-kitchen-set"></i> ${t('cooking')}</h4>
      <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--border-glass); border-radius: 10px; padding: 14px; font-size: 0.9rem; line-height: 1.6; color: var(--text-main);">
        ${lr["조리 방법 요약"] || lr["조리방법"] || ""}
      </div>
    </div>
  `;

  overlay.classList.add('open');
}

window.showRecipeDetail = showRecipeDetail;

function getLocalizedRecipe(recipe, lang) {
  if (!recipe) return null;
  if (!lang || lang === 'ko') return recipe;
  
  const locList = recipesDbLocalized[lang];
  if (!locList) return recipe;
  
  const locRecipe = locList.find(r => r.출처 === recipe.출처);
  if (locRecipe) {
    return { ...recipe, ...locRecipe };
  }
  return recipe;
}

function getLocalizedEncyclopediaItem(item, lang) {
  if (!item) return null;
  if (!lang || lang === 'ko') return item;
  
  const locList = traditionalDbLocalized[lang];
  if (!locList) return item;
  
  const locItem = locList.find(i => i.id === item.id);
  if (locItem) {
    return { ...item, ...locItem };
  }
  return item;
}

function switchLanguage(lang) {
  currentLanguage = lang;
  
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.getElementById(`lang-btn-${lang}`);
  if (activeBtn) activeBtn.classList.add('active');
  
  if (lang === 'ar') {
    document.body.classList.add('rtl');
  } else {
    document.body.classList.remove('rtl');
  }
  
  if (lang === 'ko') {
    recipesDb = [...recipesDbKo];
    window.traditionalDb = [...traditionalDbKo];
  } else {
    recipesDb = [...(recipesDbLocalized[lang] || recipesDbKo)];
    window.traditionalDb = [...(traditionalDbLocalized[lang] || traditionalDbKo)];
  }
  
  // category 속성이 유실되지 않도록 재주입
  recipesDb.forEach(r => {
    if (!r.category) {
      r.category = r.카테고리 || getRecipeCategory(r.요리명);
    }
  });
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translated = getTranslation(key, lang);
    if (translated) {
      const hasIcon = el.querySelector('i');
      if (hasIcon) {
        Array.from(el.childNodes).forEach(node => {
          if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '') {
            node.nodeValue = translated;
          }
        });
      } else {
        el.textContent = translated;
      }
    }
  });

  // Translate placeholder attributes (input fields)
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const phKey = el.getAttribute('data-i18n-placeholder');
    const translatedPh = getTranslation(phKey, lang);
    if (translatedPh) {
      el.setAttribute('placeholder', translatedPh);
    }
  });

  // Translate title attributes
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const titleKey = el.getAttribute('data-i18n-title');
    const translatedTitle = getTranslation(titleKey, lang);
    if (translatedTitle) {
      el.setAttribute('title', translatedTitle);
    }
  });
  
  // Re-run unlockPlatformGateway to translate the welcome card if it's visible
  const currentSub = localStorage.getItem('nuri_current_subscriber');
  if (currentSub) {
    unlockPlatformGateway();
  }

  if (lastWeatherInfo) {
    updateWeatherWidget(lastWeatherInfo.season, lastWeatherInfo.weather, lastWeatherInfo.temp, lastWeatherInfo.location);
  }

  localizePersonaUi();
  initDashboard();
  renderRecipesWiki();
  initCultureWiki();
  renderTraditionalList();
  renderTraditionalOverview();
  renderBrowserTable();
  renderShopProducts();
  
  if (typeof initBeautyTab === 'function') {
    initBeautyTab();
    const resultArea = document.getElementById('beauty-result-area');
    if (resultArea && !resultArea.classList.contains('hidden')) {
      analyzeBeauty();
    }
  }
  
  if (currentPersona === 'workspace') {
    updateRndAnalysis();
  }

  // Re-render the last active result/recipe in the new language
  if (lastInferenceResult) {
    runInference();
  } else if (lastRecommendedRecipe) {
    const rName = lastRecommendedRecipe.recipeName;
    const rSeason = lastRecommendedRecipe.season;
    const rWeather = lastRecommendedRecipe.weather;
    const idx = recipesDbKo.findIndex(r => r.요리명 === rName);
    if (idx !== -1) {
      const recipe = recipesDb[idx];
      renderRecipeToResult(recipe, rSeason, rWeather);
    }
  }
  
  console.log(`[i18n] Language switched to: ${lang.toUpperCase()}`);
}


// 일반 사용자용 어려운 생리/기전 한글 번역 사전
const translationMap = {
  "bone metabolism support": "뼈 건강 강화 및 골다공증 예방 도움",
  "osteoblast activation": "뼈 생성 세포 재생 활성화",
  "neuroinflammation modulation": "신경 통증 완화 및 염증 억제",
  "cox-2 inhibition": "소염 작용 및 열성 통증 완화",
  "hepatoprotective": "간 세포 보호 및 해독 촉진",
  "ros reduction": "몸속 독소 배출 및 항산화 효과",
  "gaba modulation": "뇌 신경 안정 및 불안 스트레스 완화",
  "neural stabilization": "신경 안정 및 숙면 지원",
  "anti-inflammatory": "항염증 및 붓기 제거",
  "antioxidant": "노화 예방 및 활력 세포 증진",
  "digestive aid": "소화 불량 해소 및 위장 보호",
  "immune system enhancement": "면역력 강화 및 병증 저항력 향상",
  "nervous system regulation": "신경계 밸런스 유지 및 조절",
  "joint protection": "관절 연골 마모 방지 및 튼튼화",
  "anti-fatigue": "피로 회복 및 전신 체력 충전",
  "근골강화": "뼈와 근육을 튼튼하게 강화",
  "신경염증조절": "신경 염증 완화 및 진통",
  "간보호": "간 건강 보호 및 피로해소",
  "수면안정": "불면 해소 및 쾌적한 숙면",
  "장건강": "위장 보호 및 배변 촉진",
  "혈류개선": "혈액 순환 원활 및 뭉친 피 거름",
  "해독/항산화": "몸속 노폐물 배출 및 노화 방지",
  "항염": "염증 가라앉히기 및 해열",
  "호흡기보호": "목 건조 완화 및 기침 억제",
  "면역회복": "기력 보충 및 전신 면역력 증진"
};

function translateTerm(term, lang = currentLanguage) {
  if (!term) return "-";
  if (!lang || lang === 'ko') {
    if (currentPersona !== 'recipe') return term;
    const lower = term.toLowerCase().trim();
    if (translationMap[lower]) return translationMap[lower];
    for (const [eng, kor] of Object.entries(translationMap)) {
      if (lower.includes(eng.toLowerCase())) {
        return kor;
      }
    }
    return term;
  }
  return getTranslation(term, lang);
}

document.addEventListener('DOMContentLoaded', async () => {
  console.log("Nuri Laboratory App controller initializing...");
  
  // 1. Initialize Prescribing Engine
  engine = new MatrixEngine();
  const engineLoaded = await engine.init('./data/');
  if (engineLoaded) {
    console.log("✅ AI 처방 엔진 부팅 완료 (1,793행 마스터 DB 적재)");
  } else {
    console.error("❌ AI 처방 엔진 로드 실패");
  }

  // 2. Load Datasets for UI
  await loadPortalData();

  // Initialize and check subscribers
  initSubscribers();
  const currentSub = localStorage.getItem('nuri_current_subscriber');
  if (currentSub) {
    unlockPlatformGateway();
  }

  // 3. Setup Initial UI states
  initDashboard();
  initBrowser();
  initAxisExplorer();
  initRulesTables();
  selectFlowStep(1);
  
  // 신규 대도서관 백과사전 초기화
  initRecipesWiki();
  initCultureWiki();

  // R&D 검색창 바깥 클릭 시 드롭다운 닫기
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('rnd-search-results');
    const input = document.getElementById('rnd-search-input');
    if (dropdown && input && !dropdown.contains(e.target) && e.target !== input) {
      dropdown.style.display = 'none';
    }
  });

  // 자동 계절 및 날씨 감지 실행
  detectCurrentSeasonAndWeather();

  const todaySeasonSelect = document.getElementById('today-season-select');
  const todayWeatherSelect = document.getElementById('today-weather-select');
  if (todaySeasonSelect) {
    todaySeasonSelect.addEventListener('change', () => {
      const s = todaySeasonSelect.value;
      const w = todayWeatherSelect.value;
      updateWeatherWidget(s, w);
    });
  }
  if (todayWeatherSelect) {
    todayWeatherSelect.addEventListener('change', () => {
      const s = todaySeasonSelect.value;
      const w = todayWeatherSelect.value;
      updateWeatherWidget(s, w);
    });
  }
  
  // 최초 기본 언어 번역 엔진 강제 가동 (정적 텍스트 다국어 동기화)
  switchLanguage(currentLanguage);

  // URL 해시 감지 및 라우팅 작동
  handleUrlRouting();
  window.addEventListener('hashchange', handleUrlRouting);
});

// ─── Persona Gateway & Routing ──────────────────────────────────
function enterPlatform(persona) {
  // If not subscribed yet, auto-generate a guest profile
  const currentSub = localStorage.getItem('nuri_current_subscriber');
  if (!currentSub) {
    const guestProfile = {
      id: 'GUEST-00000',
      name: '게스트',
      email: 'guest@nurilab.kr',
      role: persona === 'workspace' ? 'researcher' : 'general',
      constitution: '일반',
      concern: '전신 건강 관리',
      signupDate: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    localStorage.setItem('nuri_current_subscriber', JSON.stringify(guestProfile));
    pendingSubscriber = guestProfile;
  }

  currentPersona = persona;
  document.body.className = `persona-${persona === 'workspace' ? 'pro' : persona}`;
  
  // Show Main App Screen, Hide Gateway
  document.getElementById('gateway-screen').style.display = 'none';
  document.getElementById('main-app-screen').style.display = 'grid';
  
  // Update UI texts depending on Persona
  localizePersonaUi();

  // Redirect if currently on an expert tab in recipe mode
  const activeTab = document.querySelector('.tab-content.active');
  const currentUser = JSON.parse(localStorage.getItem('nuri_current_subscriber') || 'null');
  const isAdmin = currentUser && currentUser.role === 'admin';

  if (persona === 'recipe' && activeTab && (activeTab.classList.contains('expert-only') || activeTab.id === 'tab-subscribers')) {
    switchTab('tab-dashboard');
  } else if (activeTab && activeTab.id === 'tab-subscribers' && !isAdmin) {
    switchTab('tab-dashboard');
  } else if (activeTab) {
    switchTab(activeTab.id);
  }
  
  // Refresh dynamic bars and wikis
  initDashboard();
  renderBrowserTable();
  initRecipesWiki();
  
  // Update URL hash
  window.location.hash = `#${persona}`;
}

function handleWorkspaceEntry() {
  const currentSub = JSON.parse(localStorage.getItem('nuri_current_subscriber') || 'null');
  if (currentSub && (currentSub.role === 'admin' || currentSub.role === 'researcher' || currentSub.role === 'founder' || currentSub.role === 'medical')) {
    enterPlatform('workspace');
  } else {
    // 일반 구독자이거나 비로그인 게스트인 경우 관리자 비밀번호 검증 모달 열기
    openAdminModal();
  }
}
window.handleWorkspaceEntry = handleWorkspaceEntry;

function initSubscribers() {
  const stored = localStorage.getItem('nuri_subscribers');
  if (stored) {
    subscribersDb = JSON.parse(stored);
  } else {
    subscribersDb = [
      {
        id: "SUB-00001",
        name: "김민수",
        email: "minsu@gmail.com",
        role: "founder",
        constitution: "태음인",
        concern: "관절통",
        signupDate: "2026-06-01 10:20:00"
      },
      {
        id: "SUB-00002",
        name: "이지혜",
        email: "jihye.lee@naver.com",
        role: "researcher",
        constitution: "소음인",
        concern: "수족냉증",
        signupDate: "2026-06-02 14:15:30"
      },
      {
        id: "SUB-00003",
        name: "박지원",
        email: "jiwon_park@daum.net",
        role: "medical",
        constitution: "소양인",
        concern: "기력 보충",
        signupDate: "2026-06-03 09:05:12"
      },
      {
        id: "SUB-00004",
        name: "최윤서",
        email: "yoonseo_c@gmail.com",
        role: "general",
        constitution: "태양인",
        concern: "마른 기침",
        signupDate: "2026-06-04 17:40:00"
      },
      {
        id: "SUB-00005",
        name: "정성우",
        email: "sungwoo.j@hanmail.net",
        role: "founder",
        constitution: "태음인",
        concern: "숙취 해소",
        signupDate: "2026-06-05 11:30:45"
      },
      {
        id: "SUB-00006",
        name: "한아름",
        email: "areum_han@naver.com",
        role: "general",
        constitution: "소음인",
        concern: "소화 촉진",
        signupDate: "2026-06-06 08:12:10"
      }
    ];
    localStorage.setItem('nuri_subscribers', JSON.stringify(subscribersDb));
  }
}

function unlockPlatformGateway() {
  const lockOverlay = document.getElementById('gateway-lock-overlay');
  if (lockOverlay) {
    lockOverlay.style.display = 'none';
  }
  
  const optionsContainer = document.getElementById('gateway-options-container');
  if (optionsContainer) {
    optionsContainer.style.filter = 'none';
    optionsContainer.style.pointerEvents = 'auto';
    optionsContainer.style.opacity = '1';
  }

  // 기존 구독자가 재방문 시: 웰컴백 배너 표시
  let currentSub = JSON.parse(localStorage.getItem('nuri_current_subscriber') || 'null');
  if (currentSub && currentSub.name === '관리자') {
    currentSub.name = '방문자';
    localStorage.setItem('nuri_current_subscriber', JSON.stringify(currentSub));
  }
  if (currentSub) {
    const subFormHeader = document.getElementById('gateway-subscription-section');
    if (subFormHeader) {
      const lang = currentLanguage || 'ko';
      const certifiedText = getTranslation('구독 회원 인증 완료', lang);
      let localizedName = getTranslation(currentSub.name, lang);
      if (localizedName && localizedName.includes('관리자')) {
        localizedName = '방문자';
      }
      const welcomeText = getTranslation('환영합니다', lang).replace('{name}', localizedName);
      const logoutReset = getTranslation('다른 계정으로 재가입', lang);

      // Check if user has expert rights
      const isExpert = (currentSub.role === 'admin' || currentSub.role === 'researcher' || currentSub.role === 'founder' || currentSub.role === 'medical');

      if (isExpert) {
        // 관리자/전문가 로그인 상태: 듀얼 버튼 및 전문가 전용 배너 노출
        const subDesc = getTranslation('Mila & Nuri Lab 플랫폼의 모든 기능을 자유롭게 이용하실 수 있습니다.', lang);
        const enterRecipe = getTranslation('Mila 웰빙 레시피실 입장', lang);
        const enterWorkspace = getTranslation('Nuri Lab R&D 워크스페이스 입장', lang);

        subFormHeader.innerHTML = `
          <div style="text-align:center; padding:30px 24px;">
            <div style="margin-bottom:16px; display:flex; justify-content:center;"><img src="logo.png" alt="Logo" style="width:60px; height:60px; object-fit:contain; border-radius:15px; filter:drop-shadow(0 0 10px var(--primary-glow));"></div>
            <div class="event-pill" style="margin: 0 auto 16px; background: rgba(245, 158, 11, 0.12); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); font-weight: 700;"><i class="fa-solid fa-user-shield"></i> 전문가 인증 완료</div>
            <h2 style="font-family:'Outfit',sans-serif; font-size:1.35rem; color:#fff; font-weight:700; margin:0 0 8px;">
              ${welcomeText}
            </h2>
            <p style="font-size:0.85rem; color:var(--text-muted); margin:0 0 6px;">${currentSub.id} · ${getTranslation(currentSub.role, lang)}</p>
            <p style="font-size:0.82rem; color:var(--text-secondary); margin:0 0 24px; line-height:1.5;">
              ${subDesc}
            </p>
            <div style="display:flex; flex-direction:column; gap:10px;">
              <button class="btn btn-primary btn-large" style="width:100%; font-weight:700; padding:14px;" onclick="enterPlatform('recipe')">
                <i class="fa-solid fa-heart"></i> ${enterRecipe}
              </button>
              <button class="btn btn-accent" style="width:100%; font-weight:700; padding:12px;" onclick="handleWorkspaceEntry()">
                <i class="fa-solid fa-laptop-medical"></i> ${enterWorkspace}
              </button>
              <button class="btn btn-outline" style="width:100%; font-size:0.8rem; padding:10px; margin-top:4px;" onclick="logoutAndReset()">
                <i class="fa-solid fa-right-from-bracket"></i> ${logoutReset}
              </button>
            </div>
          </div>`;
      } else {
        // 일반 B2C 사용자 로그인 상태: R&D 버튼을 숨기고 일반 레시피실 입장 버튼만 강조하여 UI 단순화 및 혼선 방지
        const subDesc = "내 체질과 현재 절기에 맞는 건강 보양 처방식 및 친숙한 한글 식재료 요리 가이드를 탐색합니다.";
        const enterRecipe = getTranslation('Mila 웰빙 레시피실 입장', lang);

        subFormHeader.innerHTML = `
          <div style="text-align:center; padding:30px 24px;">
            <div style="margin-bottom:16px; display:flex; justify-content:center;"><img src="logo.png" alt="Logo" style="width:60px; height:60px; object-fit:contain; border-radius:15px; filter:drop-shadow(0 0 10px var(--primary-glow));"></div>
            <div class="event-pill" style="margin: 0 auto 16px;"><i class="fa-solid fa-circle-check"></i> ${certifiedText}</div>
            <h2 style="font-family:'Outfit',sans-serif; font-size:1.35rem; color:#fff; font-weight:700; margin:0 0 8px;">
              ${welcomeText}
            </h2>
            <p style="font-size:0.85rem; color:var(--text-muted); margin:0 0 6px;">${currentSub.id} · ${getTranslation(currentSub.constitution, lang)}</p>
            <p style="font-size:0.82rem; color:var(--text-secondary); margin:0 0 24px; line-height:1.5;">
              ${subDesc}
            </p>
            <div style="display:flex; flex-direction:column; gap:10px;">
              <button class="btn btn-primary btn-large" style="width:100%; font-weight:800; padding:15px; font-size: 0.95rem; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);" onclick="enterPlatform('recipe')">
                <i class="fa-solid fa-heart"></i> ${enterRecipe}
              </button>
              <button class="btn btn-outline" style="width:100%; font-size:0.8rem; padding:10px; margin-top:4px;" onclick="logoutAndReset()">
                <i class="fa-solid fa-right-from-bracket"></i> ${logoutReset}
              </button>
            </div>
          </div>`;
      }
    }
  }
}

// ─── Onboarding Wizard State & Logic ───
let wizardState = {
  currentStep: 1,
  name: '',
  email: '',
  constitution: '일반',
  concern: '기력 보충'
};

function handleInitialSubscribe(event) {
  event.preventDefault();
  
  const nameInput = document.getElementById('sub-name');
  const emailInput = document.getElementById('sub-email');
  if (!nameInput || !emailInput) return;
  
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("올바른 이메일 주소 형식을 입력해주세요.");
    return;
  }
  
  const existingSub = subscribersDb.find(sub => sub.email.toLowerCase() === email.toLowerCase());
  if (existingSub) {
    // 이미 등록된 이메일 → 기존 계정으로 재입장 처리 (바로 플랫폼 진입)
    pendingSubscriber = existingSub;
    localStorage.setItem('nuri_current_subscriber', JSON.stringify(existingSub));
    unlockPlatformGateway();
    enterPlatform(existingSub.role === 'general' ? 'recipe' : 'workspace');
    return;
  }
  
  // 신규 가입 → 온보딩 위저드 시작
  wizardState = {
    currentStep: 1,
    name: name,
    email: email,
    constitution: '일반',
    concern: '기력 보충'
  };
  
  const wizardNameInput = document.getElementById('wizard-name-input');
  if (wizardNameInput) {
    wizardNameInput.value = name;
  }
  
  const wizardModal = document.getElementById('wizard-modal');
  if (wizardModal) {
    wizardModal.style.display = 'flex';
  }
  showWizardStep(1);
}

function showWizardStep(step) {
  wizardState.currentStep = step;
  
  // Hide all steps
  for (let i = 1; i <= 5; i++) {
    const stepDiv = document.getElementById(`wizard-step-${i}`);
    if (stepDiv) {
      stepDiv.style.display = i === step ? 'block' : 'none';
    }
  }
  
  // Progress Bar
  const progressBar = document.getElementById('wizard-progress-bar');
  if (progressBar) {
    const pct = step === 1 ? 20 : step === 2 ? 40 : step === 3 ? 60 : step === 4 ? 80 : 100;
    progressBar.style.width = `${pct}%`;
  }
}

function nextWizardStep() {
  const current = wizardState.currentStep;
  if (current === 1) {
    const nameInput = document.getElementById('wizard-name-input');
    if (nameInput) {
      const val = nameInput.value.trim();
      if (!val) {
        alert("이름을 입력해주세요.");
        return;
      }
      wizardState.name = val;
    }
    showWizardStep(2);
  } else if (current === 2) {
    showWizardStep(3);
  } else if (current === 3) {
    showWizardStep(4);
    runWizardScanner();
  }
}

function prevWizardStep() {
  const current = wizardState.currentStep;
  if (current > 1) {
    showWizardStep(current - 1);
  }
}

function selectConstitution(constitution, elem) {
  wizardState.constitution = constitution;
  
  // Highlight card
  if (elem) {
    const step2 = document.getElementById('wizard-step-2');
    if (step2) {
      step2.querySelectorAll('.wizard-card').forEach(card => card.classList.remove('active'));
    }
    elem.classList.add('active');
  }
}

function selectConcern(concern, elem) {
  wizardState.concern = concern;
  
  // Highlight card
  if (elem) {
    const step3 = document.getElementById('wizard-step-3');
    if (step3) {
      step3.querySelectorAll('.wizard-card').forEach(card => card.classList.remove('active'));
    }
    elem.classList.add('active');
  }
}

function runWizardScanner() {
  const fill = document.getElementById('scanner-progress-fill');
  const pctText = document.getElementById('scanner-pct');
  if (!fill || !pctText) return;
  
  fill.style.width = '0%';
  pctText.innerText = '0%';
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += 5;
    if (progress > 100) progress = 100;
    
    fill.style.width = `${progress}%`;
    pctText.innerText = `${progress}%`;
    
    if (progress >= 100) {
      clearInterval(interval);
      
      // Save user to database
      const nextNum = subscribersDb.length + 1;
      const subId = `SUB-${String(nextNum).padStart(5, '0')}`;
      
      const now = new Date();
      const signupDate = now.getFullYear() + '-' + 
        String(now.getMonth() + 1).padStart(2, '0') + '-' + 
        String(now.getDate()).padStart(2, '0') + ' ' + 
        String(now.getHours()).padStart(2, '0') + ':' + 
        String(now.getMinutes()).padStart(2, '0') + ':' + 
        String(now.getSeconds()).padStart(2, '0');
      
      const newSub = {
        id: subId,
        name: wizardState.name,
        email: wizardState.email,
        role: 'general', // Default for B2C signup
        constitution: wizardState.constitution,
        concern: wizardState.concern,
        signupDate: signupDate
      };
      
      subscribersDb.push(newSub);
      localStorage.setItem('nuri_subscribers', JSON.stringify(subscribersDb));
      localStorage.setItem('mfco_constitution', wizardState.constitution);
      pendingSubscriber = newSub;
      
      // Populate step 5 pass card
      const passName = document.getElementById('wiz-pass-name');
      const passNo = document.getElementById('wiz-pass-no');
      const passConst = document.getElementById('wiz-pass-const');
      const passConcern = document.getElementById('wiz-pass-concern');
      const passDate = document.getElementById('wiz-pass-date');
      
      const lang = currentLanguage || 'ko';
      if (passName) {
        if (lang === 'en') {
          passName.innerText = `Mr./Ms. ${wizardState.name}`;
        } else if (lang === 'ja') {
          passName.innerText = `${wizardState.name} 様`;
        } else {
          passName.innerText = `${wizardState.name} 님`;
        }
      }
      if (passNo) passNo.innerText = `NURI-${now.getFullYear()}-${String(nextNum).padStart(5, '0')}`;
      if (passConst) passConst.innerText = getTranslation(wizardState.constitution, lang);
      if (passConcern) passConcern.innerText = getTranslation(wizardState.concern, lang);
      if (passDate) passDate.innerText = signupDate.split(' ')[0];
      
      showWizardStep(5);
    }
  }, 100);
}

function enterPlatformFromWizard() {
  if (pendingSubscriber) {
    localStorage.setItem('nuri_current_subscriber', JSON.stringify(pendingSubscriber));
  }
  
  const wizardModal = document.getElementById('wizard-modal');
  if (wizardModal) {
    wizardModal.style.display = 'none';
  }
  
  unlockPlatformGateway();
  enterPlatform('recipe');
}

function closePassModal() {
  const passModal = document.getElementById('pass-modal');
  if (passModal) {
    passModal.classList.remove('open');
  }
}

function enterPlatformWithPass() {
  enterPlatformFromWizard();
}

window.handleInitialSubscribe = handleInitialSubscribe;
window.showWizardStep = showWizardStep;
window.nextWizardStep = nextWizardStep;
window.prevWizardStep = prevWizardStep;
window.selectConstitution = selectConstitution;
window.selectConcern = selectConcern;
window.enterPlatformFromWizard = enterPlatformFromWizard;
window.closePassModal = closePassModal;
window.enterPlatformWithPass = enterPlatformWithPass;

// ─── 관리자 인증 및 입장 ─────────────────────────────────────────
const ADMIN_PASSWORD = 'nuri2026';   // ← 관리자 비밀번호 (필요시 변경)

function openAdminModal() {
  const modal = document.getElementById('admin-modal');
  const input = document.getElementById('admin-pw-input');
  const errEl = document.getElementById('admin-pw-error');
  if (modal) modal.classList.add('open');
  if (input) { input.value = ''; setTimeout(() => input.focus(), 150); }
  if (errEl) errEl.style.display = 'none';
}

function closeAdminModal() {
  const modal = document.getElementById('admin-modal');
  if (modal) modal.classList.remove('open');
}

function submitAdminLogin() {
  const input = document.getElementById('admin-pw-input');
  const errEl = document.getElementById('admin-pw-error');
  const pw = input ? input.value : '';

  if (pw !== ADMIN_PASSWORD) {
    if (errEl) errEl.style.display = 'block';
    if (input) { input.value = ''; input.focus(); }
    return;
  }

  // 관리자 세션 생성
  const adminProfile = {
    id: 'ADMIN-00000',
    name: '방문자',
    email: 'admin@nurilab.kr',
    role: 'admin',
    constitution: '일반',
    concern: '플랫폼 운영',
    signupDate: new Date().toISOString().slice(0, 19).replace('T', ' ')
  };
  localStorage.setItem('nuri_current_subscriber', JSON.stringify(adminProfile));
  pendingSubscriber = adminProfile;

  closeAdminModal();
  unlockPlatformGateway();

  // 관리자는 항상 전문가(workspace) 모드로 진입
  enterPlatform('workspace');
}

// ─── 로그아웃 / 다른 계정 재가입 ─────────────────────────────────
function logoutAndReset() {
  localStorage.removeItem('nuri_current_subscriber');
  pendingSubscriber = null;
  location.reload();
}


function renderCrmDashboard(filterText = "") {
  const totalSubscribers = subscribersDb.length;
  const query = filterText.toLowerCase().trim();
  const filteredList = subscribersDb.filter(sub => {
    return (
      sub.name.toLowerCase().includes(query) ||
      sub.email.toLowerCase().includes(query) ||
      sub.concern.toLowerCase().includes(query) ||
      sub.constitution.toLowerCase().includes(query) ||
      sub.role.toLowerCase().includes(query)
    );
  });
  
  filteredList.sort((a, b) => new Date(b.signupDate) - new Date(a.signupDate));
  
  document.getElementById('crm-total-subscribers').innerText = `${totalSubscribers} 명`;
  
  const b2bCount = subscribersDb.filter(sub => sub.role !== 'general').length;
  const b2bRatio = totalSubscribers > 0 ? ((b2bCount / totalSubscribers) * 100).toFixed(0) : 0;
  document.getElementById('crm-target-ratio').innerText = `${b2bRatio} %`;
  
  const concernCounts = {};
  subscribersDb.forEach(sub => {
    concernCounts[sub.concern] = (concernCounts[sub.concern] || 0) + 1;
  });
  let topConcern = "-";
  let maxConcernCount = 0;
  Object.entries(concernCounts).forEach(([c, cnt]) => {
    if (cnt > maxConcernCount) {
      maxConcernCount = cnt;
      topConcern = c;
    }
  });
  document.getElementById('crm-top-concern').innerText = topConcern;
  
  const constCounts = {};
  subscribersDb.forEach(sub => {
    constCounts[sub.constitution] = (constCounts[sub.constitution] || 0) + 1;
  });
  let topConst = "-";
  let maxConstCount = 0;
  Object.entries(constCounts).forEach(([c, cnt]) => {
    if (cnt > maxConstCount) {
      maxConstCount = cnt;
      topConst = c;
    }
  });
  document.getElementById('crm-top-constitution').innerText = topConst;
  
  const tbody = document.getElementById('crm-table-body');
  if (tbody) {
    tbody.innerHTML = '';
    if (filteredList.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center; padding: 30px; color: var(--text-muted);">
            조회된 구독자 가입 내역이 없습니다.
          </td>
        </tr>
      `;
      return;
    }
    
    const roleLabels = {
      'general': '<span class="badge" style="background:rgba(16,185,129,0.1); color:#10b981; border:1px solid #10b981;">일반 사용자</span>',
      'founder': '<span class="badge" style="background:rgba(245,158,11,0.1); color:#f59e0b; border:1px solid #f59e0b;">예비 창업자</span>',
      'researcher': '<span class="badge" style="background:rgba(139,92,246,0.1); color:#8b5cf6; border:1px solid #8b5cf6;">요리 연구가</span>',
      'medical': '<span class="badge" style="background:rgba(59,130,246,0.1); color:#3b82f6; border:1px solid #3b82f6;">의료/한의학</span>'
    };
    
    filteredList.forEach(sub => {
      // Calculate Lead Rating
      let score = 20; // Base email
      if (sub.role !== 'general') score += 40;
      else score += 10; // general has smaller weight for business leads
      if (sub.concern) score += 20;
      if (sub.constitution && sub.constitution !== '일반') score += 20;
      
      let ratingBadge = '';
      if (score >= 80) {
        ratingBadge = '<span class="badge" style="background:rgba(239,68,68,0.1); color:#f43f5e; border:1px solid #f43f5e; font-weight:700;">★ High (A)</span>';
      } else if (score >= 50) {
        ratingBadge = '<span class="badge" style="background:rgba(59,130,246,0.1); color:#3b82f6; border:1px solid #3b82f6; font-weight:600;">● Mid (B)</span>';
      } else {
        ratingBadge = '<span class="badge" style="background:rgba(156,163,175,0.1); color:#9ca3af; border:1px solid #9ca3af;">Low (C)</span>';
      }

      tbody.innerHTML += `
        <tr style="border-bottom:1px solid var(--border-glass);">
          <td style="padding:12px 16px; font-size:0.82rem; color:var(--text-muted);">${sub.signupDate}</td>
          <td style="padding:12px 16px; font-size:0.82rem; font-family:\'Outfit\',sans-serif; color:var(--primary); font-weight:600;">${sub.id}</td>
          <td style="padding:12px 16px; font-size:0.85rem; color:#fff; font-weight:600;">${sub.name}</td>
          <td style="padding:12px 16px; font-size:0.82rem; color:var(--text-secondary);">${sub.email}</td>
          <td style="padding:12px 16px; font-size:0.82rem;">${roleLabels[sub.role] || sub.role}</td>
          <td style="padding:12px 16px; font-size:0.82rem; color:#fff; font-weight:500;">${sub.constitution}</td>
          <td style="padding:12px 16px; font-size:0.82rem; color:var(--primary); font-weight:500;">${sub.concern}</td>
          <td style="padding:12px 16px; font-size:0.82rem;">${ratingBadge}</td>
          <td style="padding:12px 16px; font-size:0.82rem; text-align:center;">
            <button class="btn btn-outline btn-xsmall" onclick="deleteSubscriber('${sub.id}')" style="border-color:#ef4444; color:#ef4444;">
              <i class="fa-solid fa-trash-can"></i> 삭제
            </button>
          </td>
        </tr>
      `;
    });
  }
}

function handleCrmSearch() {
  const query = document.getElementById('crm-search-input').value;
  renderCrmDashboard(query);
}

function deleteSubscriber(id) {
  if (confirm("정말로 이 구독자 기록을 삭제하시겠습니까?")) {
    subscribersDb = subscribersDb.filter(sub => sub.id !== id);
    localStorage.setItem('nuri_subscribers', JSON.stringify(subscribersDb));
    
    const currentSub = localStorage.getItem('nuri_current_subscriber');
    if (currentSub) {
      const parsed = JSON.parse(currentSub);
      if (parsed.id === id) {
        localStorage.removeItem('nuri_current_subscriber');
        alert("현재 접속 중인 사용자 프로필이 삭제되었습니다. 게이트웨이로 돌아갑니다.");
        returnToGateway();
        return;
      }
    }
    
    renderCrmDashboard(document.getElementById('crm-search-input').value);
  }
}

function exportCrmData(format) {
  if (subscribersDb.length === 0) {
    alert("내보낼 구독자 데이터가 없습니다.");
    return;
  }
  
  let text = "";
  if (format === 'json') {
    text = JSON.stringify(subscribersDb, null, 2);
  } else {
    text = "\\ufeff가입일시,고유번호,이름,이메일,역할군,사상체질,건강관심사\\n";
    subscribersDb.forEach(sub => {
      text += `"${sub.signupDate}","${sub.id}","${sub.name}","${sub.email}","${sub.role}","${sub.constitution}","${sub.concern}"\\n`;
    });
  }
  
  const blob = new Blob([text], { type: format === 'json' ? 'application/json' : 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `nuri_subscribers_crm_export.${format}`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function localizePersonaUi() {
  const lang = currentLanguage || 'ko';
  const badge = document.getElementById('app-persona-badge');
  const subtitle = document.getElementById('platform-subtitle-text');
  
  const dashTitle = document.getElementById('dashboard-title-text');
  const dashDesc = document.getElementById('dashboard-desc-text');
  
  const axisTitle = document.getElementById('axis-title-lbl');
  const axisDesc = document.getElementById('axis-desc-lbl');
  
  const queryTitle = document.getElementById('query-title-text');
  const queryDesc = document.getElementById('query-desc-text');
  
  const browserTitle = document.getElementById('browser-title-text');
  const browserDesc = document.getElementById('browser-desc-text');
  
  const emptyLbl = document.getElementById('query-empty-lbl');
  
  const welcomeCard = document.getElementById('general-welcome-card');
  const metricsGrid = document.getElementById('dashboard-metrics-grid');
  
  const rdaTitle = document.getElementById('rda-title-text');
  const rdaDesc = document.getElementById('rda-desc-text');
  
  const generalHomeGrid = document.getElementById('general-home-grid');
  const expertSystemMonitor = document.getElementById('expert-system-monitor');
  const navDashboardTxt = document.querySelector(".nav-item[onclick*='tab-dashboard'] span");

  if (currentPersona === 'recipe') {
    // 일반 모드일 때는 전문가 모드로 이동을 유도하도록 골드 컬러 전문가 버튼 노출
    badge.innerText = getTranslation("전문가 R&D 모드로", lang);
    badge.className = "persona-tag to-expert";
    subtitle.innerText = getTranslation("Mila 웰빙 건강 포털", lang);
    
    dashTitle.innerText = getTranslation("가정용 건강 대시보드", lang);
    dashDesc.innerText = getTranslation("동의보감·본초강목의 지혜를 내 부엌으로 가져오는 일상 건강 밸런스", lang);
    
    axisTitle.innerText = getTranslation("몸을 이롭게 하는 7대 건강 계열", lang);
    axisDesc.innerText = getTranslation("신체 활력을 조율하고 지탱하기 위해 구성된 7대 신체 작용 계열입니다.", lang);
    
    queryTitle.innerText = getTranslation("내 몸 맞춤 건강 식재료 추천", lang);
    queryDesc.innerText = getTranslation("내 체질, 계절 절기, 그리고 현재 몸의 피로나 통증 증상을 선택하면, 상극 부작용을 사전에 회피한 이로운 자연 식재료 조합과 조리 가이드를 연산해 드립니다.", lang);
    
    browserTitle.innerText = getTranslation("건강 식재료 백과사전", lang);
    browserDesc.innerText = getTranslation("우리 밥상에 올라가는 다양한 약재 및 식품들의 상세 성미와 섭취 팁 가이드", lang);
    
    emptyLbl.innerText = getTranslation("내 몸 맞춤 건강 추천 결과", lang);
    
    document.getElementById('menu-query-txt').innerText = getTranslation("내 몸 맞춤 추천실", lang);
    document.getElementById('menu-browser-txt').innerText = getTranslation("식재료 백과사전", lang);
    document.getElementById('menu-traditional-txt').innerText = getTranslation("전통발효 & 향토음식", lang);
    
    const tradTitle = document.getElementById('traditional-title-text');
    const tradDesc = document.getElementById('traditional-desc-text');
    if (tradTitle) tradTitle.innerText = getTranslation("전통발효 & 향토음식 백과사전", lang);
    if (tradDesc) tradDesc.innerText = getTranslation("농촌진흥청 국가 표준 데이터와 Nuri Lab의 한방 약리/체질 온톨로지를 융합한 한식 웰빙 아카이브", lang);
    
    document.getElementById('stat-exceptions-lbl').innerText = getTranslation("식재료 궁합 경고 가드", lang);
    document.getElementById('formulation-role-lbl').innerHTML = '<i class="fa-solid fa-mortar-pestle"></i> ' + getTranslation('보양식 식재료 조합 (주재료 및 부재료 비율)', lang);
    document.getElementById('cooking-steps-lbl').innerHTML = '<i class="fa-solid fa-fire-burner"></i> ' + getTranslation('가정용 약선 가마솥 조리법', lang);
    
    if (rdaTitle) rdaTitle.innerHTML = '<i class="fa-solid fa-square-poll-horizontal"></i> ' + getTranslation('국가 표준 웰빙 건강 정보 센터', lang);
    if (rdaDesc) rdaDesc.innerText = getTranslation("농촌진흥청 '농식품올바로' 표준 식품 데이터와 연동된 맞춤형 건강 식단 및 전통 발효 식품 정보를 탐색하세요.", lang);

    // Show welcome card, hide metrics grid
    if (welcomeCard) welcomeCard.style.display = 'block';
    if (metricsGrid) metricsGrid.style.display = 'none';

    // Show general wellness grid widgets, hide expert system monitor
    if (generalHomeGrid) generalHomeGrid.style.display = 'grid';
    if (expertSystemMonitor) expertSystemMonitor.style.display = 'none';
    if (navDashboardTxt) navDashboardTxt.innerText = getTranslation("웰니스 홈", lang);

    if (typeof stopB2bTrafficSim === 'function') stopB2bTrafficSim();
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');

    // Populate personalized details from local storage
    const currentUser = JSON.parse(localStorage.getItem('nuri_current_subscriber') || 'null');
    if (currentUser) {
      const uName = currentUser.name || "웰빙 회원";
      const uConst = currentUser.constitution || "일반 체질";
      const uConcern = currentUser.concern || "전신 건강 관리";

      let finalName = getTranslation(uName, lang);
      if (lang === 'en') {
        if (finalName === '방문자' || finalName.trim() === '방문자' || finalName.includes('방문자')) {
          finalName = 'Visitor';
        } else if (finalName === '게스트' || finalName.trim() === '게스트' || finalName.includes('게스트')) {
          finalName = 'Guest';
        }
      }
      document.getElementById('welcome-user-name').innerText = finalName;
      
      const greetingPrefixEl = document.getElementById('welcome-user-greeting-prefix');
      const greetingSuffixEl = document.getElementById('welcome-user-greeting-suffix');
      if (greetingPrefixEl) greetingPrefixEl.innerText = getTranslation('안녕하세요', lang);
      if (greetingSuffixEl) greetingSuffixEl.innerText = getTranslation('님!', lang);

      document.getElementById('welcome-user-constitution').innerText = getTranslation(uConst, lang);
      document.getElementById('welcome-user-concern').innerText = getTranslation(uConcern, lang);
      
      // Determine personalized advice
      let tip = "체질에 부합하는 식습관을 통해 체내 면역 밸런스를 건강하게 조율해보세요.";
      const constVal = currentUser.constitution || "일반";
      if (constVal.includes("소음인")) {
        tip = "몸이 찬 기운에 노출되기 쉽고 소화기(비위) 기능이 연약하므로, 차가운 음식을 가급적 피하시고 성질이 따뜻한 <strong>인삼, 생강, 황기, 대추</strong>가 가미된 보양 음식이 몸에 매우 이롭습니다.";
      } else if (constVal.includes("소양인")) {
        tip = "체내에 불필요한 상체 열기가 많고 상대적으로 신장 기능이 약해지기 쉬우므로, 열성을 더하는 인삼 등 더운 약재는 삼가고 몸을 시원하게 식혀주는 <strong>맥문동, 구기자, 보리차, 알로에</strong> 등이 조화롭습니다.";
      } else if (constVal.includes("태음인")) {
        tip = "진액 순환이 잘 정체되어 습담이 생기기 쉽고 기관지나 호흡기 계통이 허해지기 쉬우므로, 호흡기를 튼튼히 보하고 습을 말려주는 <strong>율무, 오미자, 칡차, 맥문동, 도라지</strong>가 훌륭한 짝입니다.";
      } else if (constVal.includes("태양인")) {
        tip = "기운이 위로만 치솟고 밖으로 흩어지며 하체 기력이 낮아지기 쉬우므로, 솟구치는 기운을 아래로 차분히 내려주는 서늘한 성질의 <strong>오가피, 모과차, 메밀, 조개류</strong> 등이 잘 어울립니다.";
      }
      document.getElementById('welcome-constitution-tip').innerHTML = getTranslation(tip, lang);
    }
  } else {
    // 전문가 R&D 모드일 때는 일반 모드로 돌아갈 수 있도록 그린 컬러 일반 버튼 노출
    badge.innerText = getTranslation("일반 사용자 모드로", lang);
    badge.className = "persona-tag to-general";
    subtitle.innerText = getTranslation("Nuri Laboratory R&D Workspace", lang);
    
    dashTitle.innerText = getTranslation("의약식품 온톨로지 대시보드", lang);
    dashDesc.innerText = getTranslation("황제내경·동의보감 고전과 농촌진흥청 국가표준식품 데이터를 융합한 원료 기전 분석 엔진", lang);
    
    axisTitle.innerText = getTranslation("7대 표준축 (7-AXIS) 구성 체계", lang);
    axisDesc.innerText = getTranslation("한방 원물 약리 작용을 현대 생리학적 기전과 매핑시키기 위해 설계된 7가지 최상위 분류 축입니다.", lang);
    
    queryTitle.innerText = getTranslation("AI 동적 약선 처방실 (Matrix Engine)", lang);
    queryDesc.innerText = getTranslation("1,793행 온톨로지의 실시간 점수화(Scoring) 연산을 통한 사상 체질 및 절기 부합형 맞춤 약선 처방 설계", lang);
    
    browserTitle.innerText = getTranslation("마스터 코어 DB 브라우저", lang);
    browserDesc.innerText = getTranslation("Nuri Lab 정형화 식재료 1,793행 고속 다차원 검색 및 현대 생리 활성/생화학 기전(Mechanism) 분석", lang);
    
    emptyLbl.innerText = getTranslation("맞춤 약선 추천 결과", lang);
    
    document.getElementById('menu-query-txt').innerText = getTranslation("AI 약선 처방실", lang);
    document.getElementById('menu-browser-txt').innerText = getTranslation("마스터 DB 브라우저", lang);
    document.getElementById('menu-traditional-txt').innerText = getTranslation("R&D 전통식품 온톨로지", lang);
    
    const tradTitle = document.getElementById('traditional-title-text');
    const tradDesc = document.getElementById('traditional-desc-text');
    if (tradTitle) tradTitle.innerText = getTranslation("R&D 전통식품 온톨로지 센터", lang);
    if (tradDesc) tradDesc.innerText = getTranslation("농과원 전통발효식품 및 자생 미생물 유전자원 정보의 한방 약리 축 매핑 연구 작업소", lang);
    
    document.getElementById('stat-exceptions-lbl').innerText = getTranslation("다중매핑 예외 규칙", lang);
    document.getElementById('formulation-role-lbl').innerHTML = '<i class="fa-solid fa-mortar-pestle"></i> ' + getTranslation('군신좌사(君臣佐使) 약리 배합 설계', lang);
    document.getElementById('cooking-steps-lbl').innerHTML = '<i class="fa-solid fa-fire-burner"></i> ' + getTranslation('순차적 약선 대류 및 조리 시퀀서', lang);
    
    if (rdaTitle) rdaTitle.innerHTML = '<i class="fa-solid fa-square-poll-horizontal"></i> ' + getTranslation('국가 표준 RDA 농식품올바로 벤치마크 허브', lang);
    if (rdaDesc) rdaDesc.innerText = getTranslation("농촌진흥청 '농식품올바로'의 국가 표준 분류 체계를 Nuri Lab & Mila 플랫폼의 인터랙티브 기능과 1:1 결합 매핑한 통합 서비스 센터입니다.", lang);

    // Hide welcome card, show metrics grid
    if (welcomeCard) welcomeCard.style.display = 'none';
    if (metricsGrid) metricsGrid.style.display = 'grid';

    // Hide general home grid, show expert system monitor
    if (generalHomeGrid) generalHomeGrid.style.display = 'none';
    if (expertSystemMonitor) expertSystemMonitor.style.display = 'grid';
    if (navDashboardTxt) navDashboardTxt.innerText = getTranslation("R&D 대시보드", lang);

    if (typeof startB2bTrafficSim === 'function') startB2bTrafficSim();
    
    // 관리자(Admin) 권한 확인 후 회원 DB 메뉴 활성화
    const currentUser = JSON.parse(localStorage.getItem('nuri_current_subscriber') || 'null');
    const isAdmin = currentUser && currentUser.role === 'admin';
    document.querySelectorAll('.admin-only').forEach(el => {
      el.style.display = isAdmin ? 'block' : 'none';
    });
  }
}

async function loadPortalData() {
  try {
    const fetchJson = async (url) => {
      const separator = url.includes('?') ? '&' : '?';
      const res = await fetch(`./data/${url}${separator}t=${Date.now()}`);
      if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
      return await res.json();
    };

    masterDb = await fetchJson('mfco_master_core_db.json');
    standardFunctions = await fetchJson('mfco_standard_function_index.json');
    normalizationDict = await fetchJson('mfco_normalization_dictionary.json');
    exceptionDict = await fetchJson('mfco_exception_dictionary.json');
    
    // 다국어 i18n 번역 파일 및 로컬라이즈 데이터 패치
    translationDictionary = await fetchJson('translation_dictionary.json?v=2.10.15').catch(() => ({}));
    recipesDbLocalized = await fetchJson('yakseon_recipes_localized.json?v=2.10.15').catch(() => ({}));
    traditionalDbLocalized = await fetchJson('yakseon_traditional_encyclopedia_localized.json?v=2.10.15').catch(() => ({}));
    
    // 신규 자료 로드 (엔진에 이미 적재된 것이 있다면 재사용, 없으면 fetch)
    const baseRecipes = (engine && engine.modules && engine.modules.recipes) 
      ? engine.modules.recipes 
      : await fetchJson('yakseon_recipes.json').catch(() => []);
    
    recipesDb = [...baseRecipes];
    
    // 기능주 및 입가심 차/숭늉 가상 데이터 추가 주입
    const virtualRecipes = [
      {
        "요리명": "식전 약선 홍화주(기능주)",
        "주재료": "전통청주(100ml)",
        "부재료 및 약재": "홍화(5g), 당귀(5g), 감초(2g)",
        "주요효능": "식전에 소량 섭취하여 혈액 순환을 활성화하고 위장 온기를 돋워 식사 흡수 효율을 도움.",
        "기미 및 귀경": "기미: 온성(溫性), 신맛(辛味) 및 감맛(甘味). 귀경: 심경, 간경, 위경.",
        "조리 방법 요약": "전통 곡주에 홍화와 당귀를 침출하여 연하게 우려낸 기능성 약용주.",
        "카테고리": "양념",
        "출처": 106
      },
      {
        "요리명": "입가심용 홍화차",
        "주재료": "물(500ml)",
        "부재료 및 약재": "홍화(3g), 감초(1g), 박하(1g)",
        "주요효능": "식후 입안을 개운하게 정화하고 체내 어혈을 제거하여 혈행을 원활히 돕는 입가심 차.",
        "기미 및 귀경": "기미: 평성(平성) 또는 약간 서늘함, 고맛(苦味) 및 감맛(甘味). 귀경: 심경, 간경.",
        "조리 방법 요약": "따뜻한 물에 홍화와 감초, 박하잎을 살짝 온침하여 개운하게 우려 입가심용으로 낸다.",
        "카테고리": "양념",
        "출처": 107
      },
      {
        "요리명": "전통 구수 숭늉",
        "주재료": "누룽지(50g)",
        "부재료 및 약재": "물(1L)",
        "주요효능": "식사 후 위장을 따뜻하게 덮어주고 전신 소화 작용을 보조하며 속을 편안히 다스리는 입가심 음료.",
        "기미 및 귀경": "기미: 온성(溫性), 감맛(甘味) 및 담맛(담미). 귀경: 비경, 위경.",
        "조리 방법 요약": "솥 바닥의 누룽지에 물을 붓고 구수한 맛이 우러나올 때까지 푹 끓인다.",
        "카테고리": "양념",
        "출처": 108
      },
      {
        "요리명": "황기 두부 된장찌개",
        "주재료": "두부(200g), 된장(50g)",
        "부재료 및 약재": "황기(10g), 대추(5g), 애호박, 표고버섯, 대파",
        "주요효능": "황기의 원기 보강 효능과 된장의 소화 촉진 효능이 결합하여 만성 피로 및 비위 약화 개선.",
        "기미 및 귀경": "기미: 온성(溫性), 감맛(甘味) 및 짠맛(鹹味). 귀경: 비경, 위경.",
        "조리 방법 요약": "황기를 끓여 약수를 내고, 그 약수에 된장을 풀어 두부와 버섯, 호박을 넣고 자작하게 찌개를 끓인다.",
        "카테고리": "국물",
        "출처": 109
      },
      {
        "요리명": "산사 버섯 고추장찌개",
        "주재료": "표고버섯(100g), 돼지고기(100g)",
        "부재료 및 약재": "산사(10g), 고추장(40g), 감자, 애호박, 파, 마늘",
        "주요효능": "산사의 위장 소화 촉진 효능과 매콤한 고추장 성분이 비위를 따뜻하게 하고 소화를 돕는 찌개.",
        "기미 및 귀경": "기미: 온성(溫性), 신맛(酸味) 및 맵고 단맛. 위경, 간경.",
        "조리 방법 요약": "냄비에 돼지고기와 고추장을 볶다 산사 약수를 붓고 감자와 버섯을 넣어 푹 끓여낸다.",
        "카테고리": "국물",
        "출처": 110
      },
      {
        "요리명": "산약 동태 비지찌개",
        "주재료": "동태살(150g), 콩비지(200g)",
        "부재료 및 약재": "산약(마, 15g), 김치, 대파, 마늘, 고춧가루",
        "주요효능": "신장을 보하고 뼈를 튼튼히 하며, 콩비지의 단백질과 동태의 담백한 맛이 어우러진 보양 비지찌개.",
        "기미 및 귀경": "기미: 평성(平性), 감맛(甘味). 신경, 비경.",
        "조리 방법 요약": "뚝배기에 김치와 동태를 볶다가 비지와 산약(마) 가루를 섞어 자작하게 지져낸다.",
        "카테고리": "국물",
        "출처": 111
      }
    ];

    virtualRecipes.forEach(vr => {
      if (!recipesDb.some(r => r.요리명 === vr.요리명)) {
        recipesDb.push(vr);
      }
    });
    
    // 요리종류 카테고리 주입
    recipesDb.forEach(r => {
      r.category = r.카테고리 || getRecipeCategory(r.요리명);
    });

    holidaysDb = await fetchJson('yakseon_holidays.json').catch(() => []);
    
    seasonalDb = (engine && engine.modules && engine.modules.seasonal24Terms) 
      ? [...engine.modules.seasonal24Terms] 
      : await fetchJson('yakseon_seasonal_24terms.json').catch(() => []);
      
    diseasesDb = (engine && engine.modules && engine.modules.diseaseMapping) 
      ? [...engine.modules.diseaseMapping] 
      : await fetchJson('yakseon_disease_mapping.json').catch(() => []);
      
    window.ingredientsHerbologyList = (engine && engine.modules && engine.modules.ingredientsHerbology) 
      ? [...engine.modules.ingredientsHerbology] 
      : await fetchJson('yakseon_ingredients_herbology.json').catch(() => []);
      
    window.ingredientsNutritionMap = await fetchJson('yakseon_ingredients_nutrition.json').catch(() => ({}));
    window.bioactiveBenefits = await fetchJson('yakseon_bioactive_benefits.json').catch(() => ({}));
    window.traditionalDb = await fetchJson('yakseon_traditional_encyclopedia.json').catch(() => []);

    // B2B2C New Databases Sourcing
    supplySourcesDb = await fetchJson('yakseon_supply_sources.json').catch(() => []);
    
    const defaultSuggestions = await fetchJson('yakseon_visitor_suggestions.json').catch(() => []);
    
    let localSuggestions = [];
    try {
      localSuggestions = JSON.parse(localStorage.getItem('nuri_visitor_suggestions') || '[]');
    } catch(e) {
      console.warn("Failed to parse visitor suggestions from localStorage:", e);
    }
    
    visitorSuggestionsDb = [...defaultSuggestions];
    localSuggestions.forEach(ls => {
      if (!visitorSuggestionsDb.some(s => s.id === ls.id)) {
        visitorSuggestionsDb.push(ls);
      }
    });
    localStorage.setItem('nuri_visitor_suggestions', JSON.stringify(visitorSuggestionsDb));

    const defaultPosts = await fetchJson('yakseon_community_posts.json').catch(() => []);
    
    let localPosts = [];
    try {
      localPosts = JSON.parse(localStorage.getItem('nuri_community_posts') || '[]');
    } catch(e) {
      console.warn("Failed to parse community posts from localStorage:", e);
    }
    
    communityPostsDb = [...defaultPosts];
    localPosts.forEach(lp => {
      if (!communityPostsDb.some(p => p.id === lp.id)) {
        communityPostsDb.push(lp);
      }
    });
    localStorage.setItem('nuri_community_posts', JSON.stringify(communityPostsDb));

    // 다국어 ko 복사본 저장
    recipesDbKo = [...recipesDb];
    traditionalDbKo = [...window.traditionalDb];

    console.log("UI Datasets loaded: masterDb", masterDb.length, "recipes", recipesDb.length, "holidays", holidaysDb.length, "supplySources", supplySourcesDb.length, "suggestions", visitorSuggestionsDb.length, "communityPosts", communityPostsDb.length);
  } catch (err) {
    console.error("Failed to load portal datasets:", err);
  }
}

// 요리명 기준 한식 5대 카테고리 분류 헬퍼
function getRecipeCategory(name) {
  const mapping = {
    "하수오밥": "주식",
    "지구자 동태탕": "국물",
    "홍합 스파게티": "주식",
    "닭장 떡국": "국물",
    "사군자 닭개장": "국물",
    "묵은지 된장조림": "반찬",
    "쑥 부침개": "부식",
    "팔진 오골계탕": "국물",
    "마·고구마 튀김": "부식",
    "약선 구기자 무나물": "반찬",
    "마·복 팥칼국수": "주식",
    "사물 미니족발": "부식",
    "은이 배숙갱": "양념",
    "갈지 콩나물 북어국": "국물",
    "돼지고기 무국": "국물",
    "매생이 굴국": "국물"
  };
  return mapping[name] || "기타";
}

// 요리 및 주재료명 분석 기반 한식 세부 카테고리(복합 밥류, 메인 탕류 등) 분류기
function getGranularCategory(recipe) {
  if (!recipe) return "기타";
  const name = recipe.요리명 || "";
  const baseCategory = recipe.카테고리 || recipe.category || getRecipeCategory(name);
  
  if (baseCategory === "주식") {
    if (name.includes("죽") || name.includes("면") || name.includes("국수") || name.includes("수제비") || name.includes("만두") || name.includes("스파게티") || name.includes("수단") || name.includes("옹심이")) {
      return "주식_죽면";
    }
    // 하수오밥, 보양밥, 기장밥, 현미밥, 팥밥 등 영양 재료/한약재가 첨가된 복합 밥류
    if (name.includes("밥") || name.includes("범벅") || name.includes("단자") || name.includes("경단")) {
      return "주식_복합";
    }
    return "주식_일반";
  }
  
  if (baseCategory === "국물") {
    // 탕류 중 식사의 메인이 되는 요리 (오골계탕, 동태탕, 닭개장, 갈비탕, 도가니탕, 백숙, 삼계탕, 육개장, 곰탕, 흑염소탕, 오리전골 등)
    if (name.includes("탕") || name.includes("전골") || name.includes("백숙") || name.includes("개장") || name.includes("곰탕") || name.includes("찌개")) {
      return "국물_메인";
    }
    return "국물_일반";
  }
  
  return baseCategory; // "부식", "반찬", "양념", "기타"
}


// ─── Navigation ──────────────────────────────────────────────────
function switchTab(tabId) {
  // 관리자(Admin) 외에는 가입자 DB 탭 진입 원천 차단
  if (tabId === 'tab-subscribers') {
    const currentSub = JSON.parse(localStorage.getItem('nuri_current_subscriber') || 'null');
    if (!currentSub || currentSub.role !== 'admin') {
      alert("이 메뉴는 최고 관리자(Admin) 전용입니다. 일반 전문가 및 파트너사는 접근하실 수 없습니다.");
      return;
    }
  }
  activeTabId = tabId;
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(el => {
    el.classList.remove('active');
  });
  // Show target tab
  const target = document.getElementById(tabId);
  if (target) target.classList.add('active');

  // Activate nav item
  document.querySelectorAll('.nav-item').forEach(btn => {
    const clickAttr = btn.getAttribute('onclick');
    if (clickAttr && clickAttr.includes(tabId)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Special triggers on tab switch
  if (tabId === 'tab-dashboard') {
    animateDashboardBars();
  } else if (tabId === 'tab-recipes-rnd') {
    updateRndAnalysis();
  } else if (tabId === 'tab-subscribers') {
    renderCrmHub();
  } else if (tabId === 'tab-suggestions') {
    renderSuggestionsList();
  } else if (tabId === 'tab-community') {
    renderCommunityPosts();
  } else if (tabId === 'tab-ecosystem') {
    showEcosystemDetails('eco-platform');
  } else if (tabId === 'tab-shop') {
    renderShopProducts();
    updateCartUI();
    // 쇼핑몰 탭에서는 장바구니 FAB 표시 (항목 있을 때)
    const totalQty = shopCart.reduce(function(s,c){ return s+c.qty; }, 0);
    const fab = document.getElementById('cart-fab');
    if (fab) fab.style.display = totalQty > 0 ? 'flex' : 'none';
  } else if (tabId === 'tab-traditional') {
    window.currentTraditionalCategory = '전체';
    window.selectedTraditionalItem = null;
    renderTraditionalList();
    renderTraditionalOverview();
  } else if (tabId === 'tab-beauty') {
    if (typeof initBeautyTab === 'function') initBeautyTab();
  }
}

// ─── Tab 1: Dashboard ────────────────────────────────────────────


// ─── [MODULARIZE] DASHBOARD LOGIC MOVED TO app_dashboard.js ───



// ─── Tab 2: AI Prescribing ──────────────────────────────────────
function toggleCustomInput() {
  const select = document.getElementById('symptom-select');
  const customInput = document.getElementById('custom-symptom');
  customInput.style.display = select.value === 'CUSTOM' ? 'block' : 'none';
}

function logConsole(msg) {
  const consoleBox = document.getElementById('engine-console');
  if (consoleBox) {
    consoleBox.innerHTML += `\n> ${msg}`;
    consoleBox.scrollTop = consoleBox.scrollHeight;
  }
}

async function detectCurrentSeasonAndWeather() {
  // 1. Season detection based on date
  const month = new Date().getMonth() + 1;
  let detectedSeason = "봄";
  if (month >= 3 && month <= 5) detectedSeason = "봄";
  else if (month >= 6 && month <= 8) detectedSeason = "여름";
  else if (month >= 9 && month <= 11) detectedSeason = "가을";
  else detectedSeason = "겨울";

  const seasonSelect = document.getElementById('today-season-select');
  if (seasonSelect) {
    seasonSelect.value = detectedSeason;
  }

  // 2. Weather detection using open-meteo (Free, no API key required)
  const weatherSelect = document.getElementById('today-weather-select');
  if (!weatherSelect) return;

  logConsole(`자동 날씨 감지 가동 중...`);
  
  try {
    const getCoords = () => new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
    });

    let lat = 37.5665; // Seoul default
    let lon = 126.9780;

    try {
      const pos = await getCoords();
      lat = pos.coords.latitude;
      lon = pos.coords.longitude;
      logConsole(`위치 정보 획득 성공 (위도: ${lat.toFixed(2)}, 경도: ${lon.toFixed(2)})`);
    } catch (geoError) {
      logConsole(`브라우저 위치 권한 미허용/오류. IP 기반 위치 조회로 대체합니다.`);
      const ipRes = await fetch('https://ipapi.co/json/');
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        if (ipData.latitude && ipData.longitude) {
          lat = ipData.latitude;
          lon = ipData.longitude;
          logConsole(`IP 기반 위치 획득 성공: ${ipData.city || '알수없음'} (위도: ${lat.toFixed(2)}, 경도: ${lon.toFixed(2)})`);
        }
      }
    }

    // Fetch weather from open-meteo
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=weather_code,temperature_2m`);
    if (!weatherRes.ok) throw new Error("Weather API failed");
    const weatherData = await weatherRes.json();
    const currentWeather = weatherData.current;

    if (currentWeather) {
      const code = currentWeather.weather_code;
      const temp = currentWeather.temperature_2m;
      let detectedWeather = "맑음";

      if ([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code)) {
        detectedWeather = "비옴";
      } else if ([71, 73, 75, 77, 85, 86].includes(code)) {
        detectedWeather = "눈옴";
      } else if ([45, 48].includes(code)) {
        detectedWeather = "바람/황사";
      } else if (temp <= 0) {
        detectedWeather = "추움";
      } else if (temp >= 28) {
        detectedWeather = "더움";
      }

      weatherSelect.value = detectedWeather;
      logConsole(`현재 기온: ${temp}°C, WMO 코드: ${code} ➡️ 날씨 [${detectedWeather}] 자동 선택 완료!`);
      
      let locText = "자동 측정 위치";
      if (lat === 37.5665 && lon === 126.9780) {
        locText = "서울특별시 (기본값)";
      }
      updateWeatherWidget(detectedSeason, detectedWeather, temp, locText);
    }
  } catch (error) {
    console.error("Auto weather detection failed:", error);
    logConsole(`날씨 감지 중 오류 발생. 기본값 [맑음]으로 설정합니다.`);
    weatherSelect.value = "맑음";
    updateWeatherWidget(detectedSeason, "맑음", null, "위치 미확인");
  }
}

// 오늘 뭐 먹지? (계절 & 날씨별) 추천 맵 사전 정의
const todaySelectionMap = {
  "봄": {
    "맑음": "두릅 계란무침",
    "비옴": "쑥 부침개",
    "눈옴": "천궁 당귀 수제비",
    "바람/황사": "방풍나물 해독무침",
    "추움": "닭장 떡국",
    "더움": "달래 보혈생채"
  },
  "여름": {
    "맑음": "둥굴레 메밀밀쌈",
    "비옴": "당귀 해물파전",
    "눈옴": "의이인 시원미역국",
    "바람/황사": "은이 배숙갱",
    "추움": "당귀 활혈 삼계탕",
    "더움": "백작약 메밀국수"
  },
  "가을": {
    "맑음": "산약 보양경단",
    "비옴": "백합 연근전",
    "눈옴": "맥문동 보양 갈비탕",
    "바람/황사": "길경 감초 도라지탕",
    "추움": "복령 돼지감자 만두",
    "더움": "오미자 꿀화채"
  },
  "겨울": {
    "맑음": "구기자 대추차",
    "비옴": "복령 버섯전",
    "눈옴": "매생이 굴국",
    "바람/황사": "맥문동 약선만두",
    "추움": "우슬 도가니탕",
    "더움": "지구자 동태탕"
  }
};

function runTodayRecommendation() {
  const season = document.getElementById('today-season-select').value;
  const weather = document.getElementById('today-weather-select').value;

  const lang = currentLanguage;
  const locSeason = getTranslation(season, lang);
  const locWeather = getTranslation(weather, lang);
  if (lang === 'ko' || !lang) {
    logConsole(`오늘 뭐 먹지? 추천 요청: [계절: ${season}, 날씨: ${weather}]`);
  } else {
    const reqMsg = lang === 'en' ? 'What to Eat Today? Request' : lang === 'ja' ? '今日何食べる？推奨リクエスト' : 'ماذا نأكل اليوم؟ طلب التوصية';
    const seasonLbl = lang === 'en' ? 'Season' : lang === 'ja' ? '季節' : 'الموسم';
    const weatherLbl = lang === 'en' ? 'Weather' : lang === 'ja' ? '天気' : 'الطقس';
    logConsole(`${reqMsg}: [${seasonLbl}: ${locSeason}, ${weatherLbl}: ${locWeather}]`);
  }

  const recipeName = todaySelectionMap[season]?.[weather];
  if (!recipeName) {
    alert("해당 조합에 맞는 요리를 찾을 수 없습니다.");
    return;
  }

  // recipesDb에서 요리 조회 (로컬라이즈 및 한국어 매핑 양방향 지원)
  let recipe = recipesDb.find(r => r.요리명 === recipeName);
  
  if (!recipe) {
    // 1. 한국어 원본 DB에서 인덱스 조회 후 로컬라이즈 DB 매핑
    const idx = recipesDbKo.findIndex(r => r.요리명 === recipeName);
    if (idx !== -1 && recipesDb[idx]) {
      recipe = recipesDb[idx];
    }
  }

  if (!recipe) {
    // 2. 요리명을 번역 딕셔너리로 번역 후 로컬라이즈 DB에서 매칭
    const translatedName = getTranslation(recipeName, lang);
    if (translatedName && translatedName !== recipeName) {
      recipe = recipesDb.find(r => r.요리명 === translatedName || (r.요리명 && r.요리명.includes(translatedName)));
    }
  }

  if (!recipe) {
    // 3. 부분 검색 (로컬라이즈 DB)
    recipe = recipesDb.find(r => r.요리명 && (r.요리명.includes(recipeName) || recipeName.includes(r.요리명)));
  }

  if (!recipe) {
    // 4. 부분 검색 (한국어 원본 DB 인덱스 조회 후 매핑)
    const pIdx = recipesDbKo.findIndex(r => r.요리명 && (r.요리명.includes(recipeName) || recipeName.includes(r.요리명)));
    if (pIdx !== -1 && recipesDb[pIdx]) {
      recipe = recipesDb[pIdx];
    }
  }

  if (!recipe) {
    alert(`요리 데이터베이스에서 "${recipeName}"을 찾을 수 없습니다.`);
    return;
  }

  lastRecommendedRecipe = { recipeName, season, weather };
  lastInferenceResult = null;
  renderRecipeToResult(recipe, season, weather);
}

function renderRecipeToResult(recipe, season, weather) {
  const emptyView = document.getElementById('query-empty');
  const resultView = document.getElementById('query-result');

  emptyView.style.display = 'none';
  resultView.style.display = 'block';

  const lang = currentLanguage;
  const locRecipeName = getTranslation(recipe.요리명, lang);
  const locSeason = getTranslation(season, lang);
  const locWeather = getTranslation(weather, lang);
  
  let recSuffix = '';
  if (lang === 'ko') recSuffix = '날씨 추천';
  else if (lang === 'en') recSuffix = 'Weather Recommendation';
  else if (lang === 'ja') recSuffix = '天気推奨';
  else if (lang === 'ar') recSuffix = 'توصية الطقس';

  document.getElementById('res-recipe-name').innerText = `${locRecipeName} (${locSeason} & ${locWeather} ${recSuffix})`;
  
  const citation = recipe.ancient_citation || '전통 약선 조리서';
  const context = recipe.ancient_context || '체내 기운 조율 및 건강 증진용';
  const locCitation = getTranslation(citation, lang);
  const locContext = getTranslation(context, lang);
  const heritageLbl = getTranslation('문헌 근거:', lang);
  
  document.getElementById('res-heritage').innerText = `${heritageLbl} ${locCitation} | ${locContext}`;
  
  if (lang === 'ko' || !lang) {
    logConsole(`✅ 오늘 뭐 먹지? 추천 성공: ${recipe.요리명}`);
  } else {
    const successMsg = lang === 'en' ? 'Today\'s Recommendation successful' : lang === 'ja' ? '今日何食べる？推奨成功' : 'تمت التوصية اليوم بنجاح';
    logConsole(`✅ ${successMsg}: ${locRecipeName}`);
  }

  // 1. Render Ingredients as Gun/Sin Cards
  const compGrid = document.getElementById('res-comp-grid');
  compGrid.innerHTML = '';

  // 주재료 Card (Chief)
  const gunCard = document.createElement('div');
  gunCard.className = 'comp-card gun';
  
  const rawMain = recipe.주재료 || '';
  const mainParts = rawMain.split(',');
  const mainLocalized = mainParts.map(item => {
    const parts = item.trim().split('(');
    const name = parts[0].trim();
    const rest = parts[1] ? '(' + parts[1] : '';
    return `${getTranslation(name, lang)}${rest}`;
  }).join(', ');

  const mainRoleLabel = getTranslation('주재료(Chief)', lang);
  const natureTasteLabel = getTranslation('성미:', lang);
  const mainEfficacyLabel = getTranslation('효능기전:', lang);
  const mainNatureLocalized = getLocalizedNatureTaste(recipe["기미 및 귀경"] || '평(平)', lang);
  const mainEfficacyLocalized = getLocalizedEfficacy(recipe["주요 효능"], lang);

  gunCard.innerHTML = `
    <span class="comp-role-badge" style="background: rgba(239, 68, 68, 0.15); color: var(--gun-color);">${mainRoleLabel}</span>
    <div class="comp-name" style="cursor:pointer;" onclick="showRndRowDetailByName('${recipe.주재료.split('(')[0].replace(/'/g, "\\\\'")}')" title="${getTranslation('클릭 시 약재 상세 정보 팝업', lang)}">${mainLocalized}</div>
    <div class="comp-desc">
      <p><strong>${natureTasteLabel}</strong> ${mainNatureLocalized}</p>
      <p style="margin-top: 4px;"><strong>${mainEfficacyLabel}</strong> ${mainEfficacyLocalized}</p>
    </div>
  `;
  compGrid.appendChild(gunCard);

  // 부재료 및 약재 Card (Minister)
  if (recipe["부재료 및 약재"] && recipe["부재료 및 약재"].trim() !== "") {
    const sinCard = document.createElement('div');
    sinCard.className = 'comp-card sin';
    const firstSubIngredient = recipe["부재료 및 약재"].split(',')[0].split('(')[0].trim();
    
    const rawSub = recipe["부재료 및 약재"] || '';
    const subParts = rawSub.split(',');
    const subLocalized = subParts.map(item => {
      const parts = item.trim().split('(');
      const name = parts[0].trim();
      const rest = parts[1] ? '(' + parts[1] : '';
      return `${getTranslation(name, lang)}${rest}`;
    }).join(', ');

    const subRoleLabel = getTranslation('부재료 및 약재', lang);
    const subDescLabel = getTranslation('전통 약리적 효능 배합이 검증된 부재료 및 보양 약재 구성입니다.', lang);

    sinCard.innerHTML = `
      <span class="comp-role-badge" style="background: rgba(59, 130, 246, 0.15); color: var(--sin-color);">${subRoleLabel}</span>
      <div class="comp-name" style="cursor:pointer;" onclick="showRndRowDetailByName('${firstSubIngredient.replace(/'/g, "\\\\'")}')" title="${getTranslation('클릭 시 대표 부재료 상세 정보 팝업', lang)}">${subLocalized}</div>
      <div class="comp-desc">
        <p><strong>${getTranslation('조합 조화도:', lang) || '조합 조화도:'}</strong> ${subDescLabel}</p>
      </div>
    `;
    compGrid.appendChild(sinCard);
  }

  // 2. Render Safeguard
  const safeContainer = document.getElementById('res-safe-container');
  const safetyTitle = getTranslation('안전성 검증 완료', lang);
  const safetyDesc = getTranslation('이 요리는 일반 건강인을 위해 한의학 고전 문헌과 농식품올바로 데이터를 기준으로 설계된 안전한 일반 약선식입니다. 안심하고 섭취하셔도 좋습니다.', lang);
  
  safeContainer.innerHTML = `
    <div class="alert-card-flow">
      <div class="alert-item syn">
        <i class="fa-solid fa-circle-check"></i>
        <div>
          <strong>${safetyTitle}</strong>
          <p style="font-size: 0.78rem; margin-top:2px; opacity:0.8;">
            ${safetyDesc}
          </p>
        </div>
      </div>
    </div>
  `;

  // 3. Render Cooking Steps
  const stepsContainer = document.getElementById('res-cooking-steps');
  stepsContainer.innerHTML = '';

  const stepsText = recipe["조리 방법 요약"] || recipe["조리방법요약"] || "재료를 깨끗이 손질하여 조리 기법에 따라 끓이거나 볶아 섭취합니다.";
  const steps = stepsText.split(/\. |\.\n|\n/).map(s => s.trim()).filter(s => s.length > 0);
  steps.forEach((step, idx) => {
    const li = document.createElement('li');
    li.className = 'cooking-step-item';
    
    let stepPrefix = '';
    if (lang === 'ko') stepPrefix = `[${idx + 1}단계] `;
    else if (lang === 'en') stepPrefix = `[Step ${idx + 1}] `;
    else if (lang === 'ja') stepPrefix = `[${idx + 1}段階] `;
    else if (lang === 'ar') stepPrefix = `[الخطوة ${idx + 1}] `;

    const cleanStep = step.endsWith('.') ? step.slice(0, -1) : step;
    const localizedStep = getTranslation(cleanStep, lang);
    li.innerText = `${stepPrefix}${localizedStep}.`;
    stepsContainer.appendChild(li);
  });
  updateRecipeImage(recipe.요리명);
}

function runInference() {
  const lang = currentLanguage;
  const select = document.getElementById('symptom-select');
  let symptom = select.value;
  if (symptom === 'CUSTOM') {
    symptom = document.getElementById('custom-symptom').value.trim() || '일반';
  }

  // 오늘 뭐 먹지? 자동 감지 우회
  const cleanSymptom = symptom.toLowerCase().replace(/\s+/g, '');
  if (cleanSymptom.includes('오늘뭐먹지') || cleanSymptom.includes('뭐먹지') || cleanSymptom.includes('오늘머먹지') || cleanSymptom.includes('머먹지')) {
    if (lang === 'ko' || !lang) {
      logConsole(`> '오늘 뭐 먹지?' 질의가 감지되었습니다. 계절/날씨 맞춤형 추천으로 자동 전환합니다.`);
    } else {
      const autoMsg = lang === 'en' ? '> Query "What to Eat Today?" detected. Automatically switching to seasonal/weather-based recommendation.' : lang === 'ja' ? '> 「今日何食べる？」クエリが検出されました。季節/天気ベース의 권장으로 자동 전환합니다.' : '> تم الكشف عن استعلام "ماذا نأكل اليوم؟". التبديل التلقائي إلى التوصية المستندة إلى الموسم/الطقس.';
      logConsole(autoMsg);
    }
    runTodayRecommendation();
    return;
  }

  const constitution = document.getElementById('constitution-select').value;
  const season = document.getElementById('season-select').value;

  const locSymptom = getTranslation(symptom, lang);
  const locConstitution = getTranslation(constitution, lang);
  const locSeason = getTranslation(season, lang);
  if (lang === 'ko' || !lang) {
    logConsole(`Inference Triggered: [Symptom: ${symptom}, Constitution: ${constitution}, Season: ${season}]`);
  } else {
    const triggerMsg = lang === 'en' ? 'Inference Triggered' : lang === 'ja' ? '推論開始' : 'بدء الاستدلال';
    const symLbl = lang === 'en' ? 'Symptom' : lang === 'ja' ? '症状' : 'العرض';
    const constLbl = lang === 'en' ? 'Constitution' : lang === 'ja' ? '体質' : 'البنية';
    const seasonLbl = lang === 'en' ? 'Season' : lang === 'ja' ? '季節/節気' : 'الموسم';
    logConsole(`${triggerMsg}: [${symLbl}: ${locSymptom}, ${constLbl}: ${locConstitution}, ${seasonLbl}: ${locSeason}]`);
  }

  const result = engine.generateDynamicRecipe(symptom, constitution, season);
  lastInferenceResult = result; // 복사를 위해 보존
  lastRecommendedRecipe = null;

  const emptyView = document.getElementById('query-empty');
  const resultView = document.getElementById('query-result');

  if (result.status !== "SUCCESS") {
    emptyView.style.display = 'flex';
    resultView.style.display = 'none';
    logConsole(`❌ 추론 실패: ${result.message}`);
    alert(result.message);
    return;
  }

  // Hide empty state and show results
  emptyView.style.display = 'none';
  resultView.style.display = 'block';
  
  // Set Title & Heritage
  document.getElementById('res-recipe-name').innerText = getLocalizedRecipeName(result, lang);
  
  // 병증 매핑 정보가 다운로드 데이터베이스에 있으면 보조 요약 렌더링
  let diseaseNote = '';
  const dInfo = diseasesDb.find(d => d.병증.includes(symptom) || symptom.includes(d.병증));
  if (dInfo) {
    if (lang === 'ko' || !lang) {
      diseaseNote = ` | 한방 원인: ${dInfo["원인 및 증상"]} | 주의: ${dInfo["주의 사항"]}`;
    } else {
      const dKey = dInfo.병증;
      const transDisease = translationDictionary && translationDictionary['category_8_diseases'] && translationDictionary['category_8_diseases'][dKey];
      if (transDisease) {
        const causeLbl = lang === 'en' ? 'TCM Cause' : lang === 'ja' ? '漢方原因' : 'سبب الطب التقليدي';
        const warnLbl = lang === 'en' ? 'Caution' : lang === 'ja' ? '注意' : 'تنبيه';
        const causeVal = transDisease[`desc_${lang}`] || transDisease['desc_en'] || dInfo["원인 및 증상"];
        const warnVal = transDisease[`warn_${lang}`] || transDisease['warn_en'] || dInfo["주의 사항"];
        diseaseNote = ` | ${causeLbl}: ${causeVal} | ${warnLbl}: ${warnVal}`;
      } else {
        diseaseNote = ` | 한방 원인: ${dInfo["원인 및 증상"]} | 주의: ${dInfo["주의 사항"]}`;
      }
    }
  }

  let heritageSource = result.heritage_source;
  if (lang !== 'ko' && lang && result.heritage_source) {
    const basedOn = lang === 'en' ? 'Based on Donguibogam' : lang === 'ja' ? '東医宝鑑に基づく' : 'استناداً إلى دونغ أوي بو غام';
    const efficacyParts = result.heritage_source.split(' (')[0];
    const localizedParts = efficacyParts.split(',').map(p => getTranslation(p.trim(), lang)).join(', ');
    heritageSource = `${localizedParts} (${basedOn})`;
  } else if (!result.heritage_source) {
    heritageSource = getTranslation('동의보감 방제학 근본 기반', lang);
  }

  const heritageLbl = getTranslation('문헌 근거:', lang);
  document.getElementById('res-heritage').innerText = `${heritageLbl} ${heritageSource}${diseaseNote}`;
  if (lang === 'ko' || !lang) {
    logConsole(`✅ 동적 배합 창안 성공: ${result.recipe_name}`);
  } else {
    const successMsg = lang === 'en' ? 'Dynamic formulation generated successfully' : lang === 'ja' ? '動的配合の生成に成功しました' : 'تم إنشاء التركيبة الديناميكية بنجاح';
    logConsole(`✅ ${successMsg}: ${getLocalizedRecipeName(result, lang)}`);
  }

  // 1. Render Gun-Sin-Jwa-Sa Cards
  const compGrid = document.getElementById('res-comp-grid');
  compGrid.innerHTML = '';
  result.composition.forEach(item => {
    let cardClass = 'gun';
    if (item.role.includes('신약')) cardClass = 'sin';
    else if (item.role.includes('좌약')) cardClass = 'jwa';
    else if (item.role.includes('사약')) cardClass = 'sa';

    // 일반 모드에서는 군신좌사 명칭을 주재료/부재료로 순화
    let roleText = item.role;
    if (lang === 'ko') {
      if (currentPersona === 'recipe') {
        if (item.role.includes('군약')) roleText = '주재료(Chief)';
        else if (item.role.includes('신약')) roleText = '부재료(Assistant)';
        else if (item.role.includes('좌약')) roleText = '조화재료';
        else if (item.role.includes('사약')) roleText = '양념/사양재료';
      }
    } else {
      if (currentPersona === 'recipe') {
        if (item.role.includes('군약')) roleText = getTranslation('주재료(Chief)', lang);
        else if (item.role.includes('신약')) roleText = getTranslation('부재료(Assistant)', lang);
        else if (item.role.includes('좌약')) roleText = getTranslation('조화재료', lang);
        else if (item.role.includes('사약')) roleText = getTranslation('양념/사양재료', lang);
      } else {
        const rawRole = item.role.split('(')[0].trim();
        const locRole = getTranslation(rawRole, lang);
        const ratioText = item.role.split('(')[1] ? '(' + item.role.split('(')[1] : '';
        roleText = `${locRole}${ratioText}`;
      }
    }

    const localizedName = getTranslation(item.name, lang);
    const natureTasteLabel = getTranslation('성미:', lang);
    const efficacyLabel = getTranslation('효능기전:', lang);
    const localizedNature = getLocalizedNatureTaste(item.nature_taste, lang);
    const localizedEfficacy = getLocalizedEfficacy(item.efficacy, lang);
    const localizedCooking = getLocalizedCooking(item.cooking_recommendation, lang);

    const card = document.createElement('div');
    card.className = `comp-card ${cardClass}`;
    card.innerHTML = `
      <span class="comp-role-badge">${roleText} (${item.ratio})</span>
      <div class="comp-name" style="cursor:pointer; " onclick="showRndRowDetailByName('${item.name.replace(/'/g, "\\\\'")}')" class="clickable-text" title="${getTranslation('클릭 시 약재 상세 정보 팝업', lang)}">${localizedName} <small style="color:var(--text-muted); font-size:0.8rem;">${item.weight}</small></div>
      <div class="comp-desc">
        <p><strong>${natureTasteLabel}</strong> ${localizedNature || '평(平)'}</p>
        <p style="margin-top: 4px;"><strong>${efficacyLabel}</strong> ${localizedEfficacy}</p>
        <p style="margin-top: 4px; font-size:0.72rem; color:var(--primary);">💡 ${localizedCooking}</p>
      </div>
    `;
    compGrid.appendChild(card);
  });

  // 2. Render Safeguard Warnings and Synergies
  const safeContainer = document.getElementById('res-safe-container');
  safeContainer.innerHTML = '';
  const warnings = result.safeguard.warnings;
  const synergies = result.safeguard.synergies;

  if (warnings.length === 0 && synergies.length === 0) {
    const noSafeMsg = getTranslation('감지된 상극 독성 반응 또는 유의한 시너지 조합이 없습니다. 안전한 일반 약선식입니다.', lang);
    safeContainer.innerHTML = `<p style="font-size:0.85rem; color:var(--text-muted);">${noSafeMsg}</p>`;
  } else {
    const list = document.createElement('div');
    list.className = 'alert-card-flow';
    
    warnings.forEach(w => {
      const locA = getTranslation(w.a, lang);
      const locB = getTranslation(w.b, lang);
      const warnTitle = getTranslation('상극 배합 검출:', lang);
      const locDesc = getTranslation(w.desc, lang);
      const safeSuffix = getTranslation('(안전 가드로 인해 레시피가 안전한 약재로 교체 보정되었습니다.)', lang);

      list.innerHTML += `
        <div class="alert-item warn">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <div>
            <strong>${warnTitle} <span style="cursor:pointer; " onclick="showRndRowDetailByName('${w.a.replace(/'/g, "\\\\'")}')" class="clickable-text">${locA}</span> - <span style="cursor:pointer; " onclick="showRndRowDetailByName('${w.b.replace(/'/g, "\\\\'")}')" class="clickable-text">${locB}</span></strong>
            <p style="font-size: 0.78rem; margin-top:2px; opacity:0.8;">${locDesc} ${safeSuffix}</p>
          </div>
        </div>
      `;
    });

    synergies.forEach(s => {
      const locA = getTranslation(s.a, lang);
      const locB = getTranslation(s.b, lang);
      const synTitle = getTranslation('궁합 시너지 매칭:', lang);
      const locDesc = getTranslation(s.desc, lang);
      const synSuffix = getTranslation('(성분 흡수율 및 생체 시너지 극대화)', lang);

      list.innerHTML += `
        <div class="alert-item syn">
          <i class="fa-solid fa-star"></i>
          <div>
            <strong>${synTitle} <span style="cursor:pointer; " onclick="showRndRowDetailByName('${s.a.replace(/'/g, "\\\\'")}')" class="clickable-text">${locA}</span> - <span style="cursor:pointer; " onclick="showRndRowDetailByName('${s.b.replace(/'/g, "\\\\'")}')" class="clickable-text">${locB}</span></strong>
            <p style="font-size: 0.78rem; margin-top:2px; opacity:0.8;">${locDesc} ${synSuffix}</p>
          </div>
        </div>
      `;
    });
    safeContainer.appendChild(list);
  }

  // 3. Render Cooking Steps
  const stepsContainer = document.getElementById('res-cooking-steps');
  stepsContainer.innerHTML = '';
  result.cooking_steps.forEach(step => {
    const li = document.createElement('li');
    li.className = 'cooking-step-item';
    li.innerText = getLocalizedCookingStep(step, lang);
    stepsContainer.appendChild(li);
  });
  updateRecipeImage(result.recipe_name);
}

// ─── Tab 3: Master DB Browser ────────────────────────────────────
function initBrowser() {
  filteredMasterDb = [...masterDb];
  
  // Populate Standard Function Filter Dropdown
  const dropdown = document.getElementById('filter-standard-func');
  dropdown.innerHTML = '<option value="">기능 분류 전체</option>';
  
  const funcs = [...new Set(masterDb.flatMap(row => row.표준기능목록 || []).filter(Boolean))].sort();
  funcs.forEach(f => {
    dropdown.innerHTML += `<option value="${f}">${f}</option>`;
  });

  renderBrowserTable();
}

function handleSearch() {
  const query = document.getElementById('browser-search-input').value.toLowerCase();
  const selectedFunc = document.getElementById('filter-standard-func').value;

  filteredMasterDb = masterDb.filter(row => {
    // 새 구조: 배열 필드를 join해서 검색
    const 효능str   = (row.효능목록    || []).join(' ');
    const 기능str   = (row.표준기능목록 || []).join(' ');
    const 생리str   = (row.생리작용목록 || []).join(' ');
    const 기전str   = (row.작용기전목록 || []).join(' ');
    const 질환str   = (row.연결질환목록 || []).join(' ');

    const modernName = getModernName(row["식재료/약재"], currentLanguage) || "";
    const modernKo = getModernName(row["식재료/약재"], "ko") || "";

    const matchQuery =
      (row["식재료/약재"] || "").toLowerCase().includes(query) ||
      modernName.toLowerCase().includes(query) ||
      modernKo.toLowerCase().includes(query) ||
      효능str.toLowerCase().includes(query) ||
      기능str.toLowerCase().includes(query) ||
      생리str.toLowerCase().includes(query) ||
      기전str.toLowerCase().includes(query) ||
      질환str.toLowerCase().includes(query);

    const matchFunc = !selectedFunc ||
      (row.표준기능목록 || []).some(f => f === selectedFunc);

    return matchQuery && matchFunc;
  });

  browserPage = 1;
  renderBrowserTable();
}

function renderBrowserTable() {
  const tbody = document.getElementById('browser-table-body');
  tbody.innerHTML = '';

  const total = filteredMasterDb.length;
  document.getElementById('browser-records-count').innerText = `총 ${total.toLocaleString()}건 조회됨`;

  if (total === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:var(--text-muted); padding:30px;">조회 결과가 없습니다.</td></tr>';
    document.getElementById('browser-pagination').innerHTML = '';
    return;
  }

  const startIdx = (browserPage - 1) * browserPageSize;
  const pageItems = filteredMasterDb.slice(startIdx, startIdx + browserPageSize);

  pageItems.forEach(row => {
    const tr = document.createElement('tr');
    tr.dataset.name = row["식재료/약재"];

    // 효능 태그 목록
    const 효능Tags = (row.효능목록 || []).map(e =>
      `<span style="display:inline-block;background:rgba(255,255,255,0.08);border-radius:4px;
        padding:1px 6px;margin:1px;font-size:0.78rem;">${translateTerm(e, currentLanguage)}</span>`
    ).join('');

    // 표준기능 배지 목록
    const 기능Tags = (row.표준기능목록 || []).filter(Boolean).map(f =>
      `<span class="badge badge-synergy" style="font-size:0.72rem;margin:1px;">${translateTerm(f, currentLanguage)}</span>`
    ).join('');

    // 연결질환: 빈칸 제외하고 unique
    const 질환List = [...new Set((row.연결질환목록 || []).filter(Boolean))].map(d => translateTerm(d, currentLanguage)).join(' | ');

    // 조리권장: 빈칸 제외하고 unique
    const 조리List = [...new Set((row.조리권장목록 || []).filter(Boolean))].map(c => translateTerm(c, currentLanguage)).join(' / ');

    // 생리작용 (expert-only)
    const 생리List = (row.생리작용목록 || []).filter(Boolean).map(s => translateTerm(s, currentLanguage)).join(', ');
    const 기전List = (row.작용기전목록 || []).filter(Boolean).map(m => translateTerm(m, currentLanguage)).join(', ');

    tr.innerHTML = `
      <td style="font-weight:700;color:var(--primary);vertical-align:top;white-space:nowrap;">
        ${translateTerm(row["식재료/약재"], currentLanguage) || ""}
      </td>
      <td style="font-weight:600;color:var(--text-muted);vertical-align:top;white-space:nowrap;font-size:0.92rem;">
        ${getModernName(row["식재료/약재"], currentLanguage) || ""}
      </td>
      <td style="vertical-align:top;">${효능Tags}</td>
      <td style="vertical-align:top;">${기능Tags}</td>
      <td class="expert-only" style="vertical-align:top;font-size:0.8rem;">${생리List}</td>
      <td class="expert-only" style="vertical-align:top;font-size:0.8rem;">${기전List}</td>
      <td style="vertical-align:top;font-size:0.85rem;">${질환List}</td>
      <td style="vertical-align:top;font-size:0.85rem;">${조리List}</td>
    `;
    tr.addEventListener('click', () => showRowDetail(row));
    tbody.appendChild(tr);
  });

  renderPagination(total);
}

function renderPagination(total) {
  const container = document.getElementById('browser-pagination');
  container.innerHTML = '';

  const totalPages = Math.ceil(total / browserPageSize);
  const maxButtons = 5; // Show max 5 page buttons at once
  
  let startPage = Math.max(1, browserPage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);
  
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  // Prev Button
  if (browserPage > 1) {
    const btn = document.createElement('button');
    btn.className = 'page-btn';
    btn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    btn.addEventListener('click', () => { browserPage--; renderBrowserTable(); });
    container.appendChild(btn);
  }

  // Page numbers
  for (let i = startPage; i <= endPage; i++) {
    const btn = document.createElement('button');
    btn.className = `page-btn ${i === browserPage ? 'active' : ''}`;
    btn.innerText = i;
    btn.addEventListener('click', () => { browserPage = i; renderBrowserTable(); });
    container.appendChild(btn);
  }

  // Next Button
  if (browserPage < totalPages) {
    const btn = document.createElement('button');
    btn.className = 'page-btn';
    btn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    btn.addEventListener('click', () => { browserPage++; renderBrowserTable(); });
    container.appendChild(btn);
  }
}

// ─── Tab 4: Standard Functions & 7-Axis Map ──────────────────────
function initAxisExplorer() {
  const axes = ['정화', '완화', '흡수', '회복', '순환', '보호', '안정'];
  const navPanel = document.getElementById('axis-nav-panel');
  navPanel.innerHTML = '';

  axes.forEach(axis => {
    const btn = document.createElement('button');
    btn.className = `axis-nav-btn ${axis === activeAxis ? 'active' : ''}`;
    btn.innerHTML = `<i class="fa-solid fa-yin-yang" style="margin-right:8px; font-size:0.85rem;"></i> ${axis} 축`;
    btn.addEventListener('click', () => {
      activeAxis = axis;
      document.querySelectorAll('.axis-nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderAxisDetail();
    });
    navPanel.appendChild(btn);
  });

  renderAxisDetail();
}

function renderAxisDetail() {
  document.getElementById('axis-detail-title').innerText = `🎯 ${activeAxis} 축(Axis) 소속 표준기능 목록`;
  const grid = document.getElementById('axis-functions-grid');
  grid.innerHTML = '';

  const matchedFuncs = standardFunctions.filter(item => item["7축"] === activeAxis);

  matchedFuncs.forEach(item => {
    const card = document.createElement('div');
    card.className = 'function-detail-card';
    card.onclick = () => routeToBrowserWithFilter(item.표준기능);
    card.setAttribute('title', `클릭 시 [${item.표준기능}]이 필터링된 마스터 DB 브라우저로 이동`);
    card.style.cursor = 'pointer';
    card.innerHTML = `
      <span class="badge badge-synergy" style="margin-bottom:8px;">${item.SF_ID}</span>
      <h4>${item.표준기능}</h4>
      <p>${item.설명 || '기전적 세부 정의 준비 중'}</p>
    `;
    grid.appendChild(card);
  });
}

// ─── Tab 5: Normalization & Exceptions ───────────────────────────
function initRulesTables() {
  renderNormalizationTable();

  const exceptionTbody = document.getElementById('exception-table-body');
  exceptionTbody.innerHTML = '';
  exceptionDict.forEach(item => {
    exceptionTbody.innerHTML += `
      <tr>
        <td style="font-weight:700; color:var(--gun-color);">${item.원문효능}</td>
        <td><span class="badge badge-synergy">${item.기능1}</span></td>
        <td><span class="badge badge-synergy">${item.기능2}</span></td>
        <td style="color:var(--text-muted); font-size:0.75rem;">${item.구분}</td>
      </tr>
    `;
  });
}

function filterNormalization() {
  const q = document.getElementById('norm-search').value.toLowerCase();
  renderNormalizationTable(q);
}

function renderNormalizationTable(query = '') {
  const tbody = document.getElementById('norm-table-body');
  tbody.innerHTML = '';

  const filtered = normalizationDict.filter(item => {
    const resolvedAxis = getResolved7Axis(item.표준기능, item["7축"]);
    return (item.원문효능 || "").toLowerCase().includes(query) ||
           (item.표준기능 || "").toLowerCase().includes(query) ||
           (resolvedAxis || "").toLowerCase().includes(query);
  });

  filtered.forEach(item => {
    const resolvedAxis = getResolved7Axis(item.표준기능, item["7축"]);
    tbody.innerHTML += `
      <tr>
        <td style="font-weight:700; color:var(--primary);">${item.원문효능}</td>
        <td>${item.표준기능}</td>
        <td><span class="badge badge-synergy" style="opacity:0.85;">${resolvedAxis}</span></td>
      </tr>
    `;
  });
}

// ─── Tab 6: Phase 2 Flow Visualizer ──────────────────────────────
function selectFlowStep(stepNum) {
  activeFlowStep = stepNum;
  document.querySelectorAll('.flow-step').forEach(el => el.classList.remove('active'));
  document.getElementById(`step${stepNum}`).classList.add('active');

  const card = document.getElementById('flow-card-display');
  card.innerHTML = '';

  if (!diseasesDb || diseasesDb.length === 0) {
    card.innerHTML = `<p style="text-align:center; padding:20px; color:var(--text-muted);">병증 매핑 데이터를 불러올 수 없습니다.</p>`;
    return;
  }

  // 6대 병증 매핑 연쇄 구조 동적 구축
  const stepMeta = {
    1: {
      title: "1단계: 신체 상태 벡터 측정 (Physical State Vector)",
      desc: "환자가 자각하는 임상 증상 및 신체 상태 데이터로, 플랫폼의 기초 분석 입력 데이터입니다. 카드를 클릭하면 5단계 상세 추론 연쇄를 볼 수 있습니다.",
      getNodes: () => diseasesDb.map((d, idx) => ({
        idx: idx,
        diseaseName: d["병증"],
        code: `ST-${String(idx + 1).padStart(3, '0')}`,
        title: d["병증"],
        desc: d["원인 및 증상"].substring(0, 45) + "..."
      }))
    },
    2: {
      title: "2단계: 기전적 근본 원인 도출 (Root Cause Vector)",
      desc: "신체 상태를 유발하는 기전적/생리학적 근본 원인을 한방 병리설과 현대 생리 기전 관점에서 도출합니다. 카드를 클릭하면 상세 명세가 팝업됩니다.",
      getNodes: () => diseasesDb.map((d, idx) => {
        let causeTitle = "기혈 음양 허약";
        if (d["병증"].includes("냉증")) causeTitle = "양기 허약 및 한사 정체";
        else if (d["병증"].includes("기침")) causeTitle = "폐열 음분 손상 및 조사 침범";
        else if (d["병증"].includes("숙취")) causeTitle = "아세트알데히드 정체 및 부종";
        else if (d["병증"].includes("관절")) causeTitle = "풍한습 사기 침범 및 연골 손상";
        else if (d["병증"].includes("소화")) causeTitle = "비위 기허 및 소화액 분비 저하";
        else if (d["병증"].includes("기력")) causeTitle = "에너지 고갈 및 전신 기혈 양허";
        
        return {
          idx: idx,
          diseaseName: d["병증"],
          code: `RC-${String(idx + 1).padStart(3, '0')}`,
          title: causeTitle,
          desc: d["원인 및 증상"].length > 55 ? d["원인 및 증상"].substring(0, 52) + "..." : d["원인 및 증상"]
        };
      })
    },
    3: {
      title: "3단계: 처방 조제 역할군 결정 (Formulation Roles)",
      desc: "체질과 원인에 맞는 치료 배합을 위해 대표 약선 요리의 군신좌사(君臣佐使) 기획 설계를 확정합니다. 카드를 클릭하면 상세 명세가 팝업됩니다.",
      getNodes: () => diseasesDb.map((d, idx) => {
        let roleTitle = "군약/신약 설계";
        let roleDesc = "";
        
        if (d["병증"].includes("냉증")) {
          roleTitle = `${d["대표 약선 요리"].split(',')[0]} (군: 양고기, 신: 생강)`;
          roleDesc = "양고기를 군약으로 체온을 올리고 생강을 신약으로 배합해 온양 보온 효과를 냅니다.";
        } else if (d["병증"].includes("기침")) {
          roleTitle = `${d["대표 약선 요리"].split(',')[0]} (군: 배, 신: 맥문동)`;
          roleDesc = "배를 군약으로 보습 작용을 하고 맥문동을 신약으로 삼아 진해 윤폐를 유도합니다.";
        } else if (d["병증"].includes("숙취")) {
          roleTitle = `${d["대표 약선 요리"].split(',')[0]} (군: 복어, 신: 지구자)`;
          roleDesc = "복어를 군약으로 이수 대사를 돕고 지구자를 신약으로 삼아 간의 주독 해독을 보완합니다.";
        } else if (d["병증"].includes("관절")) {
          roleTitle = `${d["대표 약선 요리"].split(',')[0]} (군: 도가니, 신: 우슬)`;
          roleDesc = "도가니를 군약으로 관절을 보하고 우슬을 신약으로 하여 통증 제어와 기혈 순환을 도모합니다.";
        } else if (d["병증"].includes("소화")) {
          roleTitle = `${d["대표 약선 요리"].split(',')[0]} (군: 산약, 신: 백출)`;
          roleDesc = "산약을 군약으로 위 점막을 보하고 백출을 신약으로 하여 소화기의 흡수력을 향상시킵니다.";
        } else if (d["병증"].includes("기력")) {
          roleTitle = `${d["대표 약선 요리"].split(',')[0]} (군: 오골계, 신: 황기)`;
          roleDesc = "오골계를 군약으로 영양을 채우고 황기/인삼을 신약으로 삼아 전신의 기를 대보합니다.";
        }

        return {
          idx: idx,
          diseaseName: d["병증"],
          code: `ROLE-${String(idx + 1).padStart(3, '0')}`,
          title: roleTitle,
          desc: roleDesc
        };
      })
    },
    4: {
      title: "4단계: 정규화 표준기능 매핑 (Standard Function)",
      desc: "각 역할군 해결에 필수적으로 매치되는 정규화 표준 기능(SF) 코드를 매핑하여 연결합니다. 카드를 클릭하면 상세 명세가 팝업됩니다.",
      getNodes: () => diseasesDb.map((d, idx) => {
        let code = "SF012";
        let sfTitle = "체력회복 (보기익기)";
        let sfDesc = "에너지 세포 생성을 촉진해 피로감 개선";
        
        if (d["병증"].includes("냉증")) {
          code = "SF013";
          sfTitle = "말초순환개선 (온양구한)";
          sfDesc = "손발의 혈액 순환을 활성화하고 복부의 냉기 해소";
        } else if (d["병증"].includes("기침")) {
          code = "SF025";
          sfTitle = "진해 (윤폐지해)";
          sfDesc = "기관지 점막 윤활 작용과 보습을 통한 기침 완화";
        } else if (d["병증"].includes("숙취")) {
          code = "SF008";
          sfTitle = "주독해소 (간기능안정)";
          sfDesc = "아세트알데히드 해독을 활성화하고 부종 및 주독 해소";
        } else if (d["병증"].includes("관절")) {
          code = "SF018";
          sfTitle = "관절강화 (보간신강근골)";
          sfDesc = "연골 조직 및 관절 주변의 뼈와 인대 강화";
        } else if (d["병증"].includes("소화")) {
          code = "SF015";
          sfTitle = "위장보호 (비위보호)";
          sfDesc = "위 내부 보호 및 소화액 분비 정상화 유도";
        }

        return {
          idx: idx,
          diseaseName: d["병증"],
          code: code,
          title: sfTitle,
          desc: sfDesc
        };
      })
    },
    5: {
      title: "5단계: 최종 한방 식재료 사상 (Active Herb Mapping)",
      desc: "표준 기능과 사상체질, 절기 등에 부합하는 최적의 무독성 A등급 천연 약용 원재료 목록을 결정합니다. 카드를 클릭하면 상세 명세가 팝업됩니다.",
      getNodes: () => diseasesDb.map((d, idx) => {
        const herbs = d["권장 식품 및 약재"].split(',').slice(0, 3).map(h => h.trim()).join(', ');
        return {
          idx: idx,
          diseaseName: d["병증"],
          code: `H-${String(idx + 1).padStart(3, '0')}`,
          title: herbs,
          desc: `권장 약용원료: ${d["권장 식품 및 약재"].length > 55 ? d["권장 식품 및 약재"].substring(0, 52) + "..." : d["권장 식품 및 약재"]}`
        };
      })
    }
  };

  const info = stepMeta[stepNum];

  const nodesHtml = info.getNodes().map(n => {
    let nodeClass = "flow-node-item";
    let highlightTitle = "";
    let clickAction = "";

    if (activeDiseaseIndex !== null) {
      if (n.idx === activeDiseaseIndex) {
        nodeClass += " active-tracked";
      } else {
        nodeClass += " inactive";
      }
    }

    // 단계별 전진 클릭 액션 및 툴팁 바인딩
    if (activeFlowStep === 1) {
      clickAction = `clickFlowCard(${n.idx}, 1)`;
      highlightTitle = `클릭 시 [${n.diseaseName}]을 선택하여 2단계(원인)로 자동 전진 추적합니다`;
    } else if (activeFlowStep === 2) {
      clickAction = `clickFlowCard(${n.idx}, 2)`;
      highlightTitle = `클릭 시 [${n.diseaseName}]을 선택하여 3단계(처방역할)로 자동 전진 추적합니다`;
    } else if (activeFlowStep === 3) {
      clickAction = `clickFlowCard(${n.idx}, 3)`;
      highlightTitle = `클릭 시 [${n.diseaseName}]을 선택하여 4단계(표준기능)로 자동 전진 추적합니다`;
    } else if (activeFlowStep === 4) {
      clickAction = `clickFlowCard(${n.idx}, 4)`;
      highlightTitle = `클릭 시 [${n.diseaseName}]을 선택하여 5단계(약재매핑)로 자동 전진 추적합니다`;
    } else if (activeFlowStep === 5) {
      clickAction = `clickFlowCard(${n.idx}, 5)`;
      highlightTitle = `클릭 시 [${n.diseaseName}] 최종 다차원 추론 명세서 팝업`;
    }

    return `
      <div class="${nodeClass}" onclick="${clickAction}" style="cursor:pointer;" title="${highlightTitle}">
        <span class="node-code">${n.code}</span>
        <div class="node-title">${n.title}</div>
        <div class="node-desc">${n.desc}</div>
      </div>
    `;
  }).join('');

  card.innerHTML = `
    <h3>${info.title}</h3>
    <p>${info.desc}</p>
    <div class="flow-node-visual">
      ${nodesHtml}
    </div>
  `;
}

function showFlowMappingDetail(idx) {
  const d = diseasesDb[idx];
  if (!d) return;

  const overlay = document.getElementById('detail-modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');
  
  if (!overlay || !title || !body) return;

  title.innerHTML = `<i class="fa-solid fa-network-wired"></i> [${d["병증"]}] 다차원 온톨로지 매핑 추론 명세서`;

  // 1~5단계 단계별 데이터 계산
  const stCode = `ST-${String(idx + 1).padStart(3, '0')}`;
  const rcCode = `RC-${String(idx + 1).padStart(3, '0')}`;
  const roleCode = `ROLE-${String(idx + 1).padStart(3, '0')}`;
  
  // 기전 원인
  let causeTitle = "기혈 음양 허약";
  if (d["병증"].includes("냉증")) causeTitle = "양기 허약 및 한사 정체";
  else if (d["병증"].includes("기침")) causeTitle = "폐열 음분 손상 및 조사 침범";
  else if (d["병증"].includes("숙취")) causeTitle = "아세트알데히드 정체 및 부종";
  else if (d["병증"].includes("관절")) causeTitle = "풍한습 사기 침범 및 연골 손상";
  else if (d["병증"].includes("소화")) causeTitle = "비위 기허 및 소화액 분비 저하";
  else if (d["병증"].includes("기력")) causeTitle = "에너지 고갈 및 전신 기혈 양허";

  // 역할군
  let roleTitle = "군약/신약 설계";
  let roleDesc = "";
  if (d["병증"].includes("냉증")) {
    roleTitle = `${d["대표 약선 요리"].split(',')[0]} (군: 양고기, 신: 생강)`;
    roleDesc = "양고기를 군약으로 체온을 올리고 생강을 신약으로 배합해 온양 보온 효과를 냅니다.";
  } else if (d["병증"].includes("기침")) {
    roleTitle = `${d["대표 약선 요리"].split(',')[0]} (군: 배, 신: 맥문동)`;
    roleDesc = "배를 군약으로 보습 작용을 하고 맥문동을 신약으로 삼아 진해 윤폐를 유도합니다.";
  } else if (d["병증"].includes("숙취")) {
    roleTitle = `${d["대표 약선 요리"].split(',')[0]} (군: 복어, 신: 지구자)`;
    roleDesc = "복어를 군약으로 이수 대사를 돕고 지구자를 신약으로 삼아 간의 주독 해독을 보완합니다.";
  } else if (d["병증"].includes("관절")) {
    roleTitle = `${d["대표 약선 요리"].split(',')[0]} (군: 도가니, 신: 우슬)`;
    roleDesc = "도가니를 군약으로 관절을 보하고 우슬을 신약으로 하여 통증 제어와 기혈 순환을 도모합니다.";
  } else if (d["병증"].includes("소화")) {
    roleTitle = `${d["대표 약선 요리"].split(',')[0]} (군: 산약, 신: 백출)`;
    roleDesc = "산약을 군약으로 위 점막을 보하고 백출을 신약으로 하여 소화기의 흡수력을 향상시킵니다.";
  } else if (d["병증"].includes("기력")) {
    roleTitle = `${d["대표 약선 요리"].split(',')[0]} (군: 오골계, 신: 황기)`;
    roleDesc = "오골계를 군약으로 영양을 채우고 황기/인삼을 신약으로 삼아 전신의 기를 대보합니다.";
  }

  // 표준 기능
  let sfCode = "SF012";
  let sfTitle = "체력회복 (보기익기)";
  let sfDesc = "에너지 세포 생성을 촉진해 피로감 개선";
  if (d["병증"].includes("냉증")) {
    sfCode = "SF013";
    sfTitle = "말초순환개선 (온양구한)";
    sfDesc = "손발의 혈액 순환을 활성화하고 복부의 냉기 해소";
  } else if (d["병증"].includes("기침")) {
    sfCode = "SF025";
    sfTitle = "진해 (윤폐지해)";
    sfDesc = "기관지 점막 윤활 작용과 보습을 통한 기침 완화";
  } else if (d["병증"].includes("숙취")) {
    sfCode = "SF008";
    sfTitle = "주독해소 (간기능안정)";
    sfDesc = "아세트알데히드 해독을 활성화하고 부종 및 주독 해소";
  } else if (d["병증"].includes("관절")) {
    sfCode = "SF018";
    sfTitle = "관절강화 (보간신강근골)";
    sfDesc = "연골 조직 및 관절 주변의 뼈와 인대 강화";
  } else if (d["병증"].includes("소화")) {
    sfCode = "SF015";
    sfTitle = "위장보호 (비위보호)";
    sfDesc = "위 내부 보호 및 소화액 분비 정상화 유도";
  }

  body.innerHTML = `
    <div class="flow-detail-modal-body" style="color:#fff; display:flex; flex-direction:column; gap:20px;">
      <p style="font-size:0.88rem; color:var(--text-muted); line-height:1.5; margin-bottom:10px; border-bottom:1px solid var(--border-glass); padding-bottom:10px;">
        임상 신체 증상에서 출발하여 약물 동태학 및 본초학적 매핑에 이르는 다차원 추론 연쇄 상세 명세입니다.
      </p>
      
      <div class="mapping-timeline" style="display:flex; flex-direction:column; gap:20px; position:relative; padding-left:20px; border-left:2px dashed var(--primary); margin-left: 10px;">
        
        <!-- Step 1 -->
        <div class="timeline-step" style="position:relative;">
          <div style="position:absolute; left:-26px; top:4px; width:10px; height:10px; border-radius:50%; background:var(--primary); border: 2px solid var(--card-bg);"></div>
          <div style="font-size:0.75rem; font-weight:700; color:var(--primary);">${stCode} • 1단계 신체 상태 (Physical State)</div>
          <div style="font-size:1.05rem; font-weight:800; margin:4px 0; color:#fff;">${d["병증"]}</div>
          <div style="font-size:0.82rem; color:var(--text-muted); line-height:1.4;">${d["원인 및 증상"]}</div>
        </div>

        <!-- Step 2 -->
        <div class="timeline-step" style="position:relative;">
          <div style="position:absolute; left:-26px; top:4px; width:10px; height:10px; border-radius:50%; background:var(--primary); border: 2px solid var(--card-bg);"></div>
          <div style="font-size:0.75rem; font-weight:700; color:var(--primary);">${rcCode} • 2단계 기전 원인 (Root Cause)</div>
          <div style="font-size:1.05rem; font-weight:800; margin:4px 0; color:#fff;">${causeTitle}</div>
          <div style="font-size:0.82rem; color:var(--text-muted); line-height:1.4;">세포 생리학 및 장부변증에 따른 생리 기능 저하의 핵심 메커니즘을 도출합니다.</div>
        </div>

        <!-- Step 3 -->
        <div class="timeline-step" style="position:relative;">
          <div style="position:absolute; left:-26px; top:4px; width:10px; height:10px; border-radius:50%; background:var(--primary); border: 2px solid var(--card-bg);"></div>
          <div style="font-size:0.75rem; font-weight:700; color:var(--primary);">${roleCode} • 3단계 처방 역할군 (Formulation Roles)</div>
          <div style="font-size:1.05rem; font-weight:800; margin:4px 0; color:#fff;">${roleTitle}</div>
          <div style="font-size:0.82rem; color:var(--text-muted); line-height:1.4;">${roleDesc}</div>
        </div>

        <!-- Step 4 -->
        <div class="timeline-step" style="position:relative;">
          <div style="position:absolute; left:-26px; top:4px; width:10px; height:10px; border-radius:50%; background:var(--primary); border: 2px solid var(--card-bg);"></div>
          <div style="font-size:0.75rem; font-weight:700; color:var(--primary);">${sfCode} • 4단계 표준 계통 기능 (Standard Function)</div>
          <div style="font-size:1.05rem; font-weight:800; margin:4px 0; color:#fff;">${sfTitle}</div>
          <div style="font-size:0.82rem; color:var(--text-muted); line-height:1.4;">${sfDesc}</div>
        </div>

        <!-- Step 5 -->
        <div class="timeline-step" style="position:relative;">
          <div style="position:absolute; left:-26px; top:4px; width:10px; height:10px; border-radius:50%; background:var(--sa-color); border: 2px solid var(--card-bg);"></div>
          <div style="font-size:0.75rem; font-weight:700; color:var(--sa-color);">H-00${idx + 1} • 5단계 최종 활성 약재 (Active Herb Mapping)</div>
          <div style="font-size:1.05rem; font-weight:800; margin:4px 0; color:var(--sa-color);">
            ${(d["권장 식품 및 약재"] || "").split(',').map(h => {
              const clean = h.trim();
              if (!clean) return "";
              return `<span class="clickable-text" style="color:var(--sa-color); cursor:pointer; " onclick="showRndRowDetailByName('${clean.replace(/'/g, "\\\\'")}')" title="클릭 시 [${clean}] 약재 상세 정보 팝업">${clean}</span>`;
            }).filter(Boolean).join(', ')}
          </div>
          <div style="font-size:0.82rem; color:var(--text-muted); line-height:1.4;">추천 대표 요리: <strong style="color:var(--primary); cursor:pointer; " onclick="closeModal(); routeToRecipeWiki('${(d["대표 약선 요리"] || "").split(',')[0].replace(/'/g, "\\\\'")}')" title="클릭 시 요리 비법서 탭으로 이동 및 검색">${d["대표 약선 요리"]}</strong> (요리 효능: ${d["요리 효능"]})</div>
        </div>

      </div>

      <div style="background:rgba(212,175,55,0.05); border:1px solid rgba(212,175,55,0.2); border-radius:8px; padding:12px 15px; font-size:0.82rem; line-height:1.5; color:#ddd; margin-top:10px;">
        <strong style="color:var(--accent); display:block; margin-bottom:4px;"><i class="fa-solid fa-triangle-exclamation"></i> 복용 및 R&D 조리 시 주의 사항</strong>
        ${d["주의 사항"]}
      </div>
    </div>
  `;

  overlay.classList.add('open');
}

// ─── Modal & Detail View ──────────────────────────────────────────
function showRowDetail(row) {
  const overlay = document.getElementById('detail-modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  const lang = currentLanguage;
  const t = (key) => getTranslation(key, lang);
  
  const titleSuffix = {
    ko: '상세 정보',
    en: 'Detailed Information',
    ja: '詳細情報',
    ar: 'معلومات تفصيلية'
  };
  title.innerText = `🌿 ${t(row["식재료/약재"])} ${titleSuffix[lang] || titleSuffix.ko}`;

  // 다운로드한 51종 본초학 데이터셋에서 원물 상세 매핑 시도
  const herbology = ingredientsHerbologyMap(row["식재료/약재"]);

  let herbologyHtml = '';
  if (herbology) {
    const sectionTitle = {
      ko: '[약선본초학] 전통 본초학 활용법 및 식재료 특징',
      en: '[Yakseon Herbology] Traditional Herbal Practice & Ingredient Features',
      ja: '[薬膳本草学] 伝統本草学の活用法と食材の特徴',
      ar: '[علم الأعشاب ياكسون] الممارسة العشبية التقليدية وميزات المكونات'
    };
    const labelSeongmi = { ko: '성미 (성질과 맛)', en: 'Properties (Nature & Taste)', ja: '性味（性質と味）', ar: 'الخصائص (الطبيعة والمذاق)' };
    const labelHanyak = { ko: '한약명/이명', en: 'Herbal/Alternative Names', ja: '漢方名/異名', ar: 'الأسماء العشبية/البديلة' };
    const labelUsage = { ko: '약선 활용 및 추천 레시피', en: 'Yakseon Application & Recipes', ja: '薬膳活用＆おすすめレシピ', ar: 'تطبيقات ياكسون والوصفات الموصى بها' };
    const labelWarning = { ko: '⚠️ 복용 시 주의사항', en: '⚠️ Usage Precautions', ja: '⚠️ 服用の注意事項', ar: '⚠️ احتياطات الاستخدام' };
    const labelDosage = { ko: '권장 섭취량 및 보관법', en: 'Recommended Intake & Storage', ja: '推奨摂取量＆保管方法', ar: 'الجرعة الموصى بها وطريقة التخزين' };
    const toxicSafe = { ko: '특이 독성 없음 (안전)', en: 'No specific toxicity (Safe)', ja: '特異な毒性なし（安全）', ar: 'لا توجد سمية محددة (آمن)' };

    const valSeongmi = t(herbology["성미 (성질과 맛)"] || herbology["성미"] || "-");
    const valHanyak = t(herbology["이명/한약명"] || "-");
    const valUsage = t(herbology["약선 배합 및 요리법"] || "-");
    const valWarning = herbology["주의사항"] ? t(herbology["주의사항"]) : (toxicSafe[lang] || toxicSafe.ko);
    const valDosage = t(herbology["권장 섭취량/보관법"] || "-");

    herbologyHtml = `
      <div class="modal-section" style="border-top:1px solid var(--border-glass); padding-top:15px; margin-top:15px;">
        <h4><i class="fa-solid fa-mortar-pestle"></i> ${sectionTitle[lang] || sectionTitle.ko}</h4>
        <p style="margin-bottom:8px;"><strong>${labelSeongmi[lang] || labelSeongmi.ko}:</strong> ${valSeongmi}</p>
        <p style="margin-bottom:8px;"><strong>${labelHanyak[lang] || labelHanyak.ko}:</strong> ${valHanyak}</p>
        <p style="margin-bottom:8px;"><strong>${labelUsage[lang] || labelUsage.ko}:</strong> ${valUsage}</p>
        <p style="margin-bottom:8px; color:var(--gun-color);"><strong>${labelWarning[lang] || labelWarning.ko}:</strong> ${valWarning}</p>
        <p><strong>${labelDosage[lang] || labelDosage.ko}:</strong> ${valDosage}</p>
      </div>
    `;
  }

  // 일반인 모드에서는 기전 필드를 숨기거나 한글로 대접합니다.
  const isGeneral = (currentPersona === 'recipe');
  
  // 배열 데이터 정리
  const 생리배열 = [...new Set((row.생리작용목록 || []).filter(Boolean))];
  const 기전배열 = [...new Set((row.작용기전목록 || []).filter(Boolean))];
  const 생리List = 생리배열.map(x => translateTerm(x, lang)).join(', ') || "-";
  const 기전List = 기전배열.map(x => translateTerm(x, lang)).join(', ') || "-";
  const translated생리 = 생리배열.map(x => translateTerm(x, lang)).join(', ') || "-";

  const labelModernEffects = { ko: '현대의학적 신체 효과', en: 'Modern Medical Physiological Effects', ja: '現代医学的な身体効果', ar: 'التأثيرات الفسيولوجية الطبية الحديثة' };
  const labelModernPhysiology = { ko: '현대의학적 생리 작용 (Physiological Action)', en: 'Modern Medical Physiological Action', ja: '現代医学的な生理作用', ar: 'العمل الفسيولوجي الطبي الحديث' };
  const labelMechanism = { ko: '작용 기전 (Mechanism)', en: 'Mechanism of Action', ja: '作用機序', ar: 'آلية العمل' };

  const actionSectionHtml = isGeneral 
    ? `
      <div class="modal-section">
        <h4>${labelModernEffects[lang] || labelModernEffects.ko}</h4>
        <p style="font-weight:600; color:var(--primary);">${translated생리}</p>
      </div>
    ` 
    : `
      <div class="modal-section">
        <h4>${labelModernPhysiology[lang] || labelModernPhysiology.ko}</h4>
        <p style="font-weight:600; color:var(--accent);">${생리List}</p>
      </div>
      <div class="modal-section">
        <h4>${labelMechanism[lang] || labelMechanism.ko}</h4>
        <p>${기전List}</p>
      </div>
    `;

  const 효능Tags = (row.효능목록 || []).map(e => 
    `<span style="display:inline-block;background:rgba(255,255,255,0.08);border-radius:4px;padding:2px 8px;margin:2px;font-size:0.85rem;">${t(e)}</span>`
  ).join('') || "-";

  const 기능Tags = (row.표준기능목록 || []).filter(Boolean).map(f => 
    `<span class="badge badge-synergy" style="font-size:0.85rem;margin:2px;">${t(f)}</span>`
  ).join('') || "-";

  const 질환List = [...new Set((row.연결질환목록 || []).filter(Boolean))].map(x => t(x)).join(', ') || "-";
  
  const cookingDefault = { ko: '일반 탕/식재료 조리 적합', en: 'Suitable for general boiling/cooking', ja: '一般的な湯・食材調理に適する', ar: 'مناسب للغلي/الطهي العام' };
  const 조리List = [...new Set((row.조리권장목록 || []).filter(Boolean))].map(x => t(x)).join(' / ') || (cookingDefault[lang] || cookingDefault.ko);

  const labelModernName = { ko: '현대명/식재료명', en: 'Modern/Common Name', ja: '現代名/食材名', ar: 'الاسم الحديث/المشترك' };

  const labelClass = { ko: '식재료 분류명', en: 'Ingredient Category Name', ja: '食材分類名', ar: 'اسم فئة المكونات' };
  const labelTcm = { ko: '원본 한방 효능', en: 'Original TCM Efficacy', ja: '原文漢方効能', ar: 'فعالية الطب الصيني التقليدي الأصلية' };
  const labelStandard = { ko: '표준 조절 기능', en: 'Standard Regulatory Function', ja: '標準調節機能', ar: 'الوظيفة التنظيمية القياسية' };
  const labelDiseases = { ko: '주요 연결질환', en: 'Associated Conditions', ja: '主な関連疾患', ar: 'الحالات المرتبطة الرئيسية' };
  const labelCooking = { ko: '조리 및 섭취 권장 사항', en: 'Cooking & Intake Recommendations', ja: '調理＆摂取의 권장사항', ar: 'توصيات الطهي والاستهلاك' };

  body.innerHTML = `
    <div class="modal-section">
      <h4>${labelClass[lang] || labelClass.ko}</h4>
      <p style="font-size:1.25rem; font-weight:700; color:var(--primary);">
        ${t(row["식재료/약재"])}
        <span style="font-size:1.0rem; font-weight:normal; color:var(--text-muted); margin-left:12px; border-left: 2px solid var(--border-glass); padding-left: 12px;">
          <strong>${labelModernName[lang] || labelModernName.ko}:</strong> ${getModernName(row["식재료/약재"], lang)}
        </span>
      </p>
    </div>
    
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
      <div class="modal-section">
        <h4>${labelTcm[lang] || labelTcm.ko}</h4>
        <div style="margin-top:4px;">${효능Tags}</div>
      </div>
      <div class="modal-section">
        <h4>${labelStandard[lang] || labelStandard.ko}</h4>
        <div style="margin-top:4px;">${기능Tags}</div>
      </div>
    </div>

    ${actionSectionHtml}

    <div class="modal-section">
      <h4>${labelDiseases[lang] || labelDiseases.ko}</h4>
      <p>${질환List}</p>
    </div>

    <div class="modal-section">
      <h4>${labelCooking[lang] || labelCooking.ko}</h4>
      <p style="color:var(--sa-color); font-weight:600;">🥣 ${조리List}</p>
    </div>

    ${herbologyHtml}
  `;

  overlay.classList.add('open');
}

function ingredientsHerbologyMap(name) {
  // 전역 로딩된 본초학 데이터배열에서 정확히 또는 포함 매치 시도
  if (!window.ingredientsHerbologyList) return null;
  return window.ingredientsHerbologyList.find(h => h.식재료명 === name || name.includes(h.식재료명) || h.식재료명.includes(name) || (h["이명/한약명"] && h["이명/한약명"].includes(name))) || 
         masterDb.find(h => h["식재료/약재"] === name);
}

function closeModal() {
  const modal = document.getElementById('detail-modal');
  if (modal) {
    modal.classList.remove('open');
    modal.style.display = '';
  }
}

// ─── 전체 플랫폼 교차 인터랙션 & 라우팅 헬퍼 함수 ───────────────────
function showRndRowDetailByName(name) {
  if (!name) return;
  const cleanName = name.replace(/[\(].*?[\)]/g, '').trim(); // 괄호 중량 제거
  
  // 마스터 DB에서 정확히 또는 포함으로 검색
  let row = masterDb.find(h => h["식재료/약재"] === cleanName || cleanName.includes(h["식재료/약재"]));
  if (!row) {
    // 부분 매칭 시도
    row = masterDb.find(h => h["식재료/약재"] && (h["식재료/약재"].includes(cleanName) || cleanName.includes(h["식재료/약재"])));
  }
  
  if (row) {
    showRowDetail(row);
  } else {
    // 본초학 데이터에서만 찾은 경우 가상 행 조립하여 보여주기
    const herbology = window.ingredientsHerbologyList && window.ingredientsHerbologyList.find(h => h.식재료명 === cleanName || cleanName.includes(h.식재료명) || (h["이명/한약명"] && h["이명/한약명"].includes(cleanName)));
    if (herbology) {
      const mockRow = {
        "식재료/약재": herbology.식재료명,
        "효능목록": [herbology["주요 효능"] || "정보 준비중"],
        "표준기능목록": ["기타조율"],
        "생리작용목록": ["정보 준비중"],
        "작용기전목록": ["정보 준비중"],
        "연결질환목록": ["만성피로"],
        "조리권장목록": [herbology["약선 배합 및 요리법"] || "탕제 권장"]
      };
      showRowDetail(mockRow);
    } else {
      console.warn(`[showRndRowDetailByName] "${cleanName}" 식재료 데이터를 DB에서 찾을 수 없습니다.`);
      alert(`"${cleanName}"에 대한 상세 약리/기전 DB 정보가 준비 중입니다.`);
    }
  }
}

function routeToAxis(axis) {
  if (!axis) return;
  // 표준기능 & 7축 분류 탭으로 전환
  switchTab('tab-index');
  // 전역 상태 갱신 및 렌더링
  activeAxis = axis;
  
  // 버튼 active 상태 강제 조절
  document.querySelectorAll('.axis-nav-btn').forEach(btn => {
    if (btn.innerText.includes(axis)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  renderAxisDetail();
  
  // 스크롤 상단으로 이동
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function routeToBrowserWithFilter(stdFunc) {
  if (!stdFunc) return;
  // 마스터 DB 브라우저 탭으로 전환
  switchTab('tab-browser');
  
  // 필터 셀렉트박스 설정
  const filterSelect = document.getElementById('filter-standard-func');
  if (filterSelect) {
    // 해당 옵션이 있는지 체크하고 없으면 동적으로 하나 임시 생성
    let hasOption = false;
    for (let i = 0; i < filterSelect.options.length; i++) {
      if (filterSelect.options[i].value === stdFunc) {
        filterSelect.selectedIndex = i;
        hasOption = true;
        break;
      }
    }
    if (!hasOption) {
      const opt = document.createElement('option');
      opt.value = stdFunc;
      opt.innerText = stdFunc;
      filterSelect.appendChild(opt);
      filterSelect.value = stdFunc;
    }
  }
  
  // 검색창 비우고 검색 핸들러 트리거
  const searchInput = document.getElementById('browser-search-input');
  if (searchInput) searchInput.value = '';
  
  handleSearch();
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function routeToRecipeWiki(foodName) {
  if (!foodName) return;
  // 단어 뒤의 괄호나 조사 정리
  const cleanFood = foodName.split('(')[0].replace(/등$/, '').trim();
  
  // 약선 요리 비법서 탭으로 전환
  switchTab('tab-recipes-wiki');
  
  // 카테고리 필터 '전체 요리'로 초기화
  const allBtn = document.querySelector(".wiki-category-filter-bar button");
  filterRecipesByCategory('ALL', allBtn);
  
  // 검색창 값 채우기
  const searchInput = document.getElementById('recipe-wiki-search');
  if (searchInput) {
    searchInput.value = cleanFood;
  }
  
  filterRecipesWiki();
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function routeToPrescribeeWithSeason(season) {
  if (!season) return;
  // AI 약선 처방실 탭으로 전환
  switchTab('tab-query');
  
  // 절기 선택
  const seasonSelect = document.getElementById('season-select');
  if (seasonSelect) {
    for (let i = 0; i < seasonSelect.options.length; i++) {
      if (seasonSelect.options[i].value === season || seasonSelect.options[i].text.includes(season)) {
        seasonSelect.selectedIndex = i;
        break;
      }
    }
  }
  
  logConsole(`[System] 전통 문화원 연동 활성화: 절기 조건이 [${season}] 절기로 동기화 설정되었습니다. 증상을 선택해 레시피를 창안해보세요.`);
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── 매핑 프로세스 뷰어 병증 추적 모드 제어 함수 ──────────────────
function selectFlowDisease(idx) {
  clickFlowCard(idx, 1);
}

function clickFlowCard(idx, stepNum) {
  const d = diseasesDb[idx];
  if (!d) return;

  activeDiseaseIndex = idx;

  // 추적 바 노출 및 레이블 세팅
  const trackerBar = document.getElementById('flow-tracker-bar');
  const nameEl = document.getElementById('flow-tracked-disease-name');
  if (trackerBar && nameEl) {
    nameEl.innerText = d["병증"];
    trackerBar.style.display = 'flex';
  }

  if (stepNum === 5) {
    showFlowMappingDetail(idx);
    selectFlowStep(5);
  } else {
    selectFlowStep(stepNum + 1);
  }

  console.log(`[Flow Tracker] 병증 추적 전환 및 단계 이동: ${d["병증"]} (순번: ${idx}, 단계: ${stepNum} -> ${stepNum === 5 ? 5 : stepNum + 1})`);
}

function viewCurrentFlowDetail() {
  if (activeDiseaseIndex === null) {
    alert("먼저 추적할 신체상태 병증 카드를 클릭하세요.");
    return;
  }
  showFlowMappingDetail(activeDiseaseIndex);
}

function clearFlowTracking() {
  activeDiseaseIndex = null;

  // 추적 바 숨김
  const trackerBar = document.getElementById('flow-tracker-bar');
  if (trackerBar) {
    trackerBar.style.display = 'none';
  }

  // 뷰 리프레시
  selectFlowStep(activeFlowStep);

  console.log(`[Flow Tracker] 병증 추적 모드 해제. 전체 모드 복귀.`);
}

// ─── Tab 7: 약선 요리 비법서 렌더링 (일반인 & 요리연구가 공용) ───
function initRecipesWiki() {
  renderRecipesWiki();
}

function renderRecipesWiki(query = '') {
  const container = document.getElementById('recipes-wiki-container');
  if (!container) return;
  container.innerHTML = '';
  
  const filtered = recipesDb.filter(r => {
    const lr = getLocalizedRecipe(r, currentLanguage);
    const matchQuery = 
      (lr.요리명 || "").toLowerCase().includes(query) ||
      (lr.주재료 || "").toLowerCase().includes(query) ||
      (lr.주요효능 || lr.주요_효능 || "").toLowerCase().includes(query);
      
    const matchCategory = currentWikiCategory.toUpperCase() === "ALL" || 
                          r.category === currentWikiCategory || 
                          r.카테고리 === currentWikiCategory ||
                          r.ko_category === currentWikiCategory ||
                          (r.category && r.category.toLowerCase() === "staple" && currentWikiCategory === "주식") ||
                          (r.카테고리 && r.카테고리 === "주식" && currentWikiCategory === "주식") ||
                          (lr && (
                            lr.category === currentWikiCategory || 
                            lr.카테고리 === currentWikiCategory ||
                            lr.ko_category === currentWikiCategory ||
                            (lr.category && lr.category.toLowerCase() === "staple" && currentWikiCategory === "주식")
                          ));
    
    return matchQuery && matchCategory;
  });
  
  if (filtered.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:var(--text-muted); padding:40px;">${getTranslation('조회된 약선 레시피가 없습니다.', currentLanguage)}</p>`;
    return;
  }
  
  filtered.forEach(r => {
    const lr = getLocalizedRecipe(r, currentLanguage);
    const card = document.createElement('div');
    card.className = 'glass-panel recipe-wiki-card';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.justifyContent = 'space-between';
    card.style.cursor = 'pointer';
    
    card.addEventListener('click', (e) => {
      if (e.target.closest('button')) {
        return;
      }
      showRecipeDetail(r);
    });
    
    // 요리연구가 모드일 때 '기미 및 귀경' 상세 데이터 및 R&D 시뮬레이터 연동 불러오기 단추 추가
    let proSection = '';
    if (currentPersona === 'workspace') {
      const gimi = lr["기미 및 귀경"] || lr["기미"] || "정보 준비중";
      const escapedName = r.요리명.replace(/'/g, "\\'");
      proSection = `
        <div class="recipe-pro-badge-section" style="margin-top:12px; padding-top:12px; border-top:1px dashed var(--border-glass);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <small style="color:var(--primary); font-weight:700;"><i class="fa-solid fa-yin-yang"></i> [요리연구가 R&D] 기미 및 귀경</small>
            <button class="btn btn-accent btn-xsmall" onclick="loadRecipeToRnd('${escapedName}')">
              <i class="fa-solid fa-flask-vial"></i> R&D 설계기로 가져가기
            </button>
          </div>
          <p style="font-size:0.78rem; color:var(--text-main); margin-top:2px;">${gimi}</p>
        </div>
      `;
    }
    
    const citationBadge = lr.ancient_citation 
      ? `<span class="badge badge-citation" style="font-size:0.65rem; background:rgba(245, 158, 11, 0.15); color:var(--sa-color); border:1px solid rgba(245, 158, 11, 0.3); margin-left: 6px;" title="${lr.ancient_context || ''}"><i class="fa-solid fa-scroll"></i> ${lr.ancient_citation}</span>` 
      : '';
      
    let contextHtml = '';
    if (lr.ancient_context) {
      contextHtml = `
        <div style="font-size:0.75rem; color:var(--text-secondary); background:rgba(245, 158, 11, 0.03); border-left: 2px solid var(--sa-color); padding: 6px 10px; border-radius: 0 6px 6px 0; margin-bottom: 12px; font-style: italic;">
          <strong>${getTranslation('전통 문헌 고증', currentLanguage)}:</strong> ${lr.ancient_context}
        </div>
      `;
    }

    card.innerHTML = `
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <h3 style="margin:0; font-size:1.15rem; color:var(--primary); font-family:'Outfit',sans-serif;">${lr.요리명}</h3>
          <div>
            <span class="badge badge-synergy" style="font-size:0.65rem;">${getTranslation('보양 메뉴', currentLanguage)}</span>
            ${citationBadge}
          </div>
        </div>
        <p style="font-size:0.82rem; line-height:1.5; margin-bottom:12px; color:var(--text-main);">${lr.주요효능 || lr.주요_효능 || ""}</p>
        ${contextHtml}
        
        <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:6px;">
          <strong>${getTranslation('주재료', currentLanguage)}:</strong> <span style="color:var(--text-main);">${lr.주재료}</span>
        </div>
        <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:12px;">
          <strong>${getTranslation('부재료 및 한약재', currentLanguage)}:</strong> <span style="color:var(--text-main);">${lr["부재료 및 약재"] || lr["부재료"] || "-"}</span>
        </div>
      </div>
      
      <div>
        <div class="recipe-cooking-summary" style="background:rgba(0,0,0,0.18); padding:10px; border-radius:8px; border: 1px solid var(--border-glass);">
          <small style="font-weight:700; color:var(--sa-color); display:block; margin-bottom:4px;"><i class="fa-solid fa-kitchen-set"></i> ${getTranslation('전통 조리 시퀀스', currentLanguage)}</small>
          <p style="font-size:0.75rem; line-height:1.4; color:var(--text-main);">${lr["조리 방법 요약"] || lr["조리방법"] || ""}</p>
        </div>
        ${proSection}
      </div>
    `;
    container.appendChild(card);
  });
}

function filterRecipesWiki() {
  const query = document.getElementById('recipe-wiki-search').value.toLowerCase();
  renderRecipesWiki(query);
}
window.filterRecipesWiki = filterRecipesWiki;

function filterRecipesByCategory(category, btn) {
  currentWikiCategory = category;
  
  // 버튼 active 클래스 제어
  document.querySelectorAll('.wiki-category-filter-bar button').forEach(b => {
    b.classList.remove('active');
  });
  if (btn) btn.classList.add('active');
  
  const query = document.getElementById('recipe-wiki-search').value.toLowerCase();
  renderRecipesWiki(query);
}
window.filterRecipesByCategory = filterRecipesByCategory;

// ─── Tab 8: 약선 문화원 (명절 & 24절기 아카이브) ───
function initCultureWiki() {
  const lang = currentLanguage || 'ko';
  const isKo = lang === 'ko';

  const lbl = {
    seasonal_food: getTranslation('제철 보양 음식', lang),
    wellness:      getTranslation('양생(養生) 건강수칙', lang),
    festival_food: getTranslation('대표 세시 절식', lang),
    customs:       getTranslation('명절 풍속', lang),
    loading_s:     getTranslation('절기 정보가 준비 중입니다.', lang),
    loading_h:     getTranslation('명절 정보가 준비 중입니다.', lang),
  };

  // 1. 24절기 양생 가이드 렌더링
  const seasonsContainer = document.getElementById('culture-seasons-container');
  if (seasonsContainer) {
    seasonsContainer.innerHTML = '';
    if (seasonalDb.length === 0) {
      seasonsContainer.innerHTML = `<p style="color:var(--text-muted); font-size:0.85rem;">${lbl.loading_s}</p>`;
    } else {
      seasonalDb.forEach(s => {
        const name     = isKo ? s.절기 : (s.name_en || s.절기);
        const climate  = isKo ? (s["기후 및 자연 현상"] || '') : (s.climate_en || s["기후 및 자연 현상"] || '');
        const foodRaw  = isKo ? (s["제철 음식 및 약선 요리"] || '') : (s.food_en || s["제철 음식 및 약선 요리"] || '');
        const wellness = isKo ? (s["계절별 양생법 (건강 관리)"] || '') : (s.wellness_en || s["계절별 양생법 (건강 관리)"] || '');

        const foodList = foodRaw.split(',').map(f => {
          const clean = f.trim();
          if (!clean) return '';
          return `<span class="culture-food-link" onclick="event.stopPropagation(); routeToRecipeWiki('${clean.replace(/'/g, "\\'")}')">${clean}</span>`;
        }).filter(Boolean).join(', ');

        seasonsContainer.innerHTML += `
          <div class="culture-item-box" style="background:rgba(255,255,255,0.01); border:1px solid var(--border-glass); border-radius:10px; padding:15px; margin-bottom:12px; cursor:pointer;" onclick="routeToPrescribeeWithSeason('${s.절기}')">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <strong style="color:var(--primary); font-size:1.05rem;">🍂 ${name}</strong>
              <small style="color:var(--text-muted);">${climate}</small>
            </div>
            <p style="font-size:0.8rem; line-height:1.5; color:var(--text-main); margin-bottom:6px;"><strong>${lbl.seasonal_food}:</strong> ${foodList || '-'}</p>
            <p style="font-size:0.78rem; line-height:1.5; color:var(--text-muted);"><strong>${lbl.wellness}:</strong> ${wellness}</p>
          </div>
        `;
      });
    }
  }

  // 2. 전통 세시 명절 렌더링
  const holidaysContainer = document.getElementById('culture-holidays-container');
  if (holidaysContainer) {
    holidaysContainer.innerHTML = '';
    if (holidaysDb.length === 0) {
      holidaysContainer.innerHTML = `<p style="color:var(--text-muted); font-size:0.85rem;">${lbl.loading_h}</p>`;
    } else {
      holidaysDb.forEach(h => {
        const name    = isKo ? h["명절 이름"] : (h.name_en || h["명절 이름"]);
        const date    = isKo ? h["날짜 (음력)"] : (h.date_en || h["날짜 (음력)"]);
        const proverb = isKo ? (h["관련 속담 및 설화"] || '') : (h.proverb_en || h["관련 속담 및 설화"] || '');
        const foodRaw = isKo ? (h["대표 음식"] || '') : (h.food_en || h["대표 음식"] || '');
        const customs = isKo ? (h["민속 놀이 및 풍습"] || '') : (h.customs_en || h["민속 놀이 및 풍습"] || '');

        const holidayFoodList = foodRaw.split(',').map(f => {
          const clean = f.trim();
          if (!clean) return '';
          return `<span class="culture-food-link" onclick="event.stopPropagation(); routeToRecipeWiki('${clean.replace(/'/g, "\\'")}')">${clean}</span>`;
        }).filter(Boolean).join(', ');

        holidaysContainer.innerHTML += `
          <div class="culture-item-box" style="background:rgba(255,255,255,0.01); border:1px solid var(--border-glass); border-radius:10px; padding:15px; margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <strong style="color:var(--sa-color); font-size:1.05rem;">🏮 ${name} (${date})</strong>
              <small style="color:var(--text-muted);">${proverb ? proverb.split(',')[0] : ''}</small>
            </div>
            <p style="font-size:0.8rem; line-height:1.5; color:var(--text-main); margin-bottom:6px;"><strong>${lbl.festival_food}:</strong> ${holidayFoodList || '-'}</p>
            <p style="font-size:0.78rem; line-height:1.5; color:var(--text-muted);"><strong>${lbl.customs}:</strong> ${customs}</p>
          </div>
        `;
      });
    }
  }
}

// ─── Tab 2: Export 배합 데이터 내보내기 ──────────────────────────────────
function exportFormula(format) {
  if (!lastInferenceResult) {
    alert("먼저 맞춤 레시피를 생성(추론)해주세요.");
    return;
  }
  
  let text = "";
  if (format === 'json') {
    text = JSON.stringify(lastInferenceResult, null, 2);
  } else {
    // CSV
    text = "\ufeff역할,원재료명,배합비율,중량,성미,효능기전,조리권장\n";
    lastInferenceResult.composition.forEach(i => {
      text += `"${i.role}","${i.name}","${i.ratio}","${i.weight}","${i.nature_taste}","${i.efficacy}","${i.cooking_recommendation}"\n`;
    });
  }
  
  navigator.clipboard.writeText(text).then(() => {
    alert(`성공: 배합 데이터가 ${format.toUpperCase()} 형태로 클립보드에 안전하게 복사되었습니다.`);
  }).catch(err => {
    console.error("클립보드 복사 에러:", err);
    alert("복사에 실패했습니다. 권한을 확인해주세요.");
  });
}

// ─── Tab 3: Export 조회 데이터 테이블 내보내기 ──────────────────────────────────
function exportBrowserTable() {
  if (filteredMasterDb.length === 0) {
    alert("내보낼 조회 데이터가 존재하지 않습니다.");
    return;
  }
  
  let csvContent = "\ufeff식재료/약재,현대명,원본효능,표준기능,생리작용,작용기전,연결질환,조리권장\n";
  filteredMasterDb.forEach(row => {
    const modern = getModernName(row["식재료/약재"], currentLanguage) || "";
    const 효능 = (row.효능목록 || []).join(' | ');
    const 기능 = (row.표준기능목록 || []).filter(Boolean).join(' | ');
    const 생리 = (row.생리작용목록 || []).filter(Boolean).join(' | ');
    const 기전 = (row.작용기전목록 || []).filter(Boolean).join(' | ');
    const 질환 = [...new Set((row.연결질환목록 || []).filter(Boolean))].join(' | ');
    const 조리 = [...new Set((row.조리권장목록 || []).filter(Boolean))].join(' | ');

    csvContent += `"${row["식재료/약재"] || ""}","${modern}","${효능}","${기능}","${생리}","${기전}","${질환}","${조리}"\n`;
  });
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "nuri_lab_database_export.csv");
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ─── Tab 7: 약선 신메뉴 R&D 설계기 (Yakseon Blender & Simulator) ───
let rndIngredients = []; // { name, role, weight, cost }
let batchMultiplier = 1;

// R&D 식재료 검색 자동완성
function handleRndSearch() {
  const query = document.getElementById('rnd-search-input').value.toLowerCase().trim();
  const dropdown = document.getElementById('rnd-search-results');
  
  if (!query) {
    dropdown.style.display = 'none';
    return;
  }

  // 마스터 DB에서 중복 없이 고유 식재료 매칭 (최대 8개)
  const results = [];
  const seen = new Set();
  
  for (const row of masterDb) {
    const name = row["식재료/약재"];
    if (name && name.toLowerCase().includes(query) && !seen.has(name)) {
      seen.add(name);
      results.push({
        name: name,
        func: (row.표준기능목록 || [])[0] || (row.효능목록 || [])[0] || "한방 원료"
      });
      if (results.length >= 8) break;
    }
  }

  if (results.length === 0) {
    dropdown.innerHTML = `<div class="search-dropdown-item" style="color:var(--text-muted);">검색 결과가 없습니다.</div>`;
  } else {
    dropdown.innerHTML = results.map(item => `
      <div class="search-dropdown-item" onclick="selectRndSearchItem('${item.name.replace(/'/g, "\\'")}')">
        <span>🌿 <strong>${item.name}</strong></span>
        <span class="item-func">${item.func}</span>
      </div>
    `).join('');
  }
  dropdown.style.display = 'block';
}

function selectRndSearchItem(name) {
  document.getElementById('rnd-search-input').value = '';
  document.getElementById('rnd-search-results').style.display = 'none';
  
  addIngredientToRnd(name);
}

function addIngredientToRnd(name, role = "군약(君藥)", weight = 20, cost = 15) {
  // 중복 체크
  if (rndIngredients.some(i => i.name === name)) {
    alert(`"${name}"은(는) 이미 배합표에 추가되어 있습니다.`);
    return;
  }

  rndIngredients.push({
    name: name,
    role: role,
    weight: parseFloat(weight) || 20,
    cost: parseFloat(cost) || 15
  });

  updateRndAnalysis();
}

function removeRndIngredient(index) {
  rndIngredients.splice(index, 1);
  updateRndAnalysis();
}

function clearRndFormula() {
  if (confirm("현재 배합표의 모든 식재료를 삭제하시겠습니까?")) {
    rndIngredients = [];
    updateRndAnalysis();
  }
}

function changeRndScale(scale) {
  batchMultiplier = scale;
  
  // 버튼 active 상태 갱신
  document.querySelectorAll('.batch-scale-wrapper button').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.getElementById(`btn-scale-${scale}`);
  if (activeBtn) activeBtn.classList.add('active');

  renderRndIngredientsTable();
  updateRndCost();
}

// 원료 배합 리스트 테이블 렌더링
function renderRndIngredientsTable() {
  const tbody = document.getElementById('rnd-ingredients-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const weightHeader = document.getElementById('rnd-weight-header');
  if (weightHeader) {
    weightHeader.innerText = batchMultiplier > 1 ? `배합 중량 (총 ${batchMultiplier}인분)` : "배합 중량 (1인분)";
  }

  const formatSelect = document.getElementById('rnd-serving-format');
  const isMultiDish = formatSelect && formatSelect.value !== 'single';

  if (rndIngredients.length === 0) {
    const emptyMsg = isMultiDish
      ? "배합된 원료가 없습니다. 하단의 식단 플래너에서 개별 요리를 배치해주세요."
      : "배합된 원료가 없습니다. 상단의 검색창에서 식재료를 검색하여 추가하세요.";
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:30px;">${emptyMsg}</td></tr>`;
    return;
  }

  const selectDisabled = isMultiDish ? "disabled" : "";
  const inputReadonly = isMultiDish ? "readonly style='background:rgba(255,255,255,0.01); color:var(--text-muted); cursor:not-allowed; border-color:transparent;'" : "";

  rndIngredients.forEach((item, index) => {
    const scaledWeight = (item.weight * batchMultiplier).toFixed(1);
    const tr = document.createElement('tr');
    
    const removeBtnHtml = isMultiDish
      ? `<button class="rnd-row-remove" style="color:var(--text-muted); cursor:not-allowed;" title="식단 플래너에 의해 자동 합산 및 잠금됨" disabled><i class="fa-solid fa-lock"></i></button>`
      : `<button class="rnd-row-remove" onclick="removeRndIngredient(${index})"><i class="fa-solid fa-trash-can"></i></button>`;

    tr.innerHTML = `
      <td style="font-weight:700; color:var(--primary); cursor:pointer; " onclick="showRndRowDetailByName('${item.name.replace(/'/g, "\\\\'")}')" class="clickable-text" title="클릭 시 약재 상세 정보 팝업">${item.name}</td>
      <td>
        <select ${selectDisabled} onchange="updateRndIngredientProperty(${index}, 'role', this.value)" style="width:100%;">
          <option value="군약(君藥)" ${item.role === "군약(君藥)" ? "selected" : ""}>군약 [주식/메인주재료] (Chief)</option>
          <option value="신약(臣藥)" ${item.role === "신약(臣藥)" ? "selected" : ""}>신약 [보조부식/주부재료] (Minister)</option>
          <option value="좌약(佐藥)" ${item.role === "좌약(佐藥)" ? "selected" : ""}>좌약 [약성보강/한약재] (Assistant)</option>
          <option value="사약(使藥)" ${item.role === "사약(使藥)" ? "selected" : ""}>사약 [조미료/향료/양념] (Envoy)</option>
        </select>
      </td>
      <td>
        <div style="display:flex; align-items:center; gap:5px;">
          <input type="number" ${inputReadonly} value="${(item.weight * batchMultiplier).toFixed(0)}" min="1" max="1000000" onchange="updateRndIngredientProperty(${index}, 'weight', this.value / batchMultiplier)" style="width:70px;">
          <span style="font-size:0.8rem; color:var(--text-muted);">g</span>
        </div>
      </td>
      <td>
        <input type="number" ${inputReadonly} value="${item.cost}" min="0" max="10000" onchange="updateRndIngredientProperty(${index}, 'cost', this.value)" style="width:80px;"> 원
      </td>
      <td style="text-align:center;">
        ${removeBtnHtml}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function updateRndIngredientProperty(index, prop, value) {
  if (rndIngredients[index]) {
    if (prop === 'weight' || prop === 'cost') {
      rndIngredients[index][prop] = parseFloat(value) || 0;
    } else {
      rndIngredients[index][prop] = value;
    }
    updateRndAnalysis();
  }
}

// 괄호 바깥의 콤마를 기준으로 스플릿하는 유틸리티 함수
function splitByCommaOutsideParens(str) {
  if (!str) return [];
  const result = [];
  let current = "";
  let depth = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '(' || char === '[' || char === '{') {
      depth++;
      current += char;
    } else if (char === ')' || char === ']' || char === '}') {
      depth = Math.max(0, depth - 1);
      current += char;
    } else if (char === ',' && depth === 0) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  if (current.trim()) {
    result.push(current.trim());
  }
  return result;
}

// 16종 레시피를 파싱하여 R&D 시뮬레이터에 로드
function loadRecipeToRnd(recipeName) {
  let recipe = recipesDb.find(r => r.요리명 === recipeName);
  if (!recipe) {
    const idx = recipesDbKo.findIndex(r => r.요리명 === recipeName);
    if (idx !== -1 && recipesDb[idx]) {
      recipe = recipesDb[idx];
    }
  }
  if (!recipe) {
    const translatedName = getTranslation(recipeName, currentLanguage);
    if (translatedName && translatedName !== recipeName) {
      recipe = recipesDb.find(r => r.요리명 === translatedName || (r.요리명 && r.요리명.includes(translatedName)));
    }
  }
  if (!recipe) {
    recipe = recipesDb.find(r => r.요리명 && (r.요리명.includes(recipeName) || recipeName.includes(r.요리명)));
  }
  if (!recipe) {
    alert("레시피 데이터를 찾을 수 없습니다.");
    return;
  }

  // 초기화
  rndIngredients = [];
  batchMultiplier = 1;
  document.querySelectorAll('.batch-scale-wrapper button').forEach(btn => btn.classList.remove('active'));
  document.getElementById('btn-scale-1').classList.add('active');

  // 재료를 배합표에 안전하게 추가하는 보조 함수
  function tryAddIngredient(rawName, role, weight, cost) {
    const name = rawName.trim();
    if (!name) return;

    // 만약 마스터 DB에 있는 식재료명이면 바로 추가
    const existsInDb = masterDb.some(r => r["식재료/약재"] === name);
    if (existsInDb) {
      rndIngredients.push({ name, role, weight, cost });
      return;
    }

    // 마스터 DB에 없는데 복합 한약재 괄호식 형태인 경우 (예: "사군자탕(백출, 감초, 복령, 인삼)")
    const subMatch = name.match(/^([^\(]+)\(([^)]+)\)/);
    if (subMatch) {
      const parentName = subMatch[1].trim();
      const childText = subMatch[2];
      
      // 만약 부모 이름 자체가 마스터 DB에 등록되어 있으면 부모 이름으로 추가
      if (masterDb.some(r => r["식재료/약재"] === parentName)) {
        rndIngredients.push({ name: parentName, role, weight, cost });
        return;
      }

      // 그렇지 않다면 괄호 안의 하위 재료들을 콤마로 스플릿해서 개별 추가 시도
      const children = childText.split(',').map(c => c.trim()).filter(Boolean);
      let addedAny = false;
      children.forEach(child => {
        // 하위 재료에 숫자/중량이 표기되어 있을 수 있음
        const childMatch = child.match(/^([^\s\(\d]+)(?:\s*\(?(\d+)g\)?)?/);
        if (childMatch) {
          const cName = childMatch[1].trim();
          const cWeight = childMatch[2] ? parseFloat(childMatch[2]) : Math.round(weight / children.length);
          if (masterDb.some(r => r["식재료/약재"] === cName)) {
            rndIngredients.push({ name: cName, role, weight: cWeight, cost });
            addedAny = true;
          }
        }
      });

      if (addedAny) return;
    }

    // 최종 매칭이 없어도 일단 추가
    rndIngredients.push({ name, role, weight, cost });
  }

  // 1. 주재료 파싱
  if (recipe.주재료) {
    const rawMain = splitByCommaOutsideParens(recipe.주재료);
    rawMain.forEach(m => {
      const match = m.match(/^([^\(]+)(?:\(([^)]+)\))?/);
      if (match) {
        const rawName = match[1].trim();
        const weightStr = match[2] || "";
        let weight = 50; // 기본값
        const numMatch = weightStr.match(/(\d+)/);
        if (numMatch) weight = parseFloat(numMatch[1]);
        
        tryAddIngredient(rawName, "군약(君藥)", weight, 12);
      }
    });
  }

  // 2. 부재료 및 약재 파싱
  if (recipe["부재료 및 약재"] || recipe["부재료"]) {
    const subText = recipe["부재료 및 약재"] || recipe["부재료"];
    const rawSub = splitByCommaOutsideParens(subText);
    rawSub.forEach((s, idx) => {
      const match = s.match(/^([^\(]+)(?:\(([^)]+)\))?/);
      if (match) {
        const rawName = match[1].trim();
        const weightStr = match[2] || "";
        let weight = 20; // 기본값
        const numMatch = weightStr.match(/(\d+)/);
        if (numMatch) weight = parseFloat(numMatch[1]);

        let role = "신약(臣藥)";
        if (idx === 0) role = "신약(臣藥)";
        else if (idx <= 2) role = "좌약(佐藥)";
        else role = "사약(使藥)";

        tryAddIngredient(rawName, role, weight, 18);
      }
    });
  }

  // 중복 식재료 정리 (동일 재료 병합)
  const merged = [];
  const seen = {};
  rndIngredients.forEach(item => {
    if (seen[item.name]) {
      seen[item.name].weight += item.weight;
    } else {
      seen[item.name] = item;
      merged.push(item);
    }
  });
  rndIngredients = merged;

  // 요리 종류 자동 선택 연동
  const dishCategory = getGranularCategory(recipe);
  const selectEl = document.getElementById('rnd-dish-category');
  if (selectEl) {
    selectEl.value = dishCategory;
  }

  // 탭 전환 및 강제 업데이트
  switchTab('tab-recipes-rnd');
  updateRndAnalysis();
  logConsole(`📂 약선 레시피 [${recipeName}] 데이터 고도화 파싱 완료. 동일 원재료 자동 병합 및 탕제(복합 방제) 내역 개별 약재로 해체/추출 완료.`);
}

// ─── 식사 구성 R&D 식단 플래너 데이터 및 제어 로직 ────────────────────────────────
const plannerSlotConfigs = {
  "bansang_5": {
    title: "5첩 반상 차림 구성 R&D 플래너",
    groups: [
      {
        name: "기본 구성 (밥, 국, 찌개)",
        slots: [
          { id: "slot-rice", label: "진지 (밥류)", category: "주식" },
          { id: "slot-soup", label: "갱 (탕/국류)", category: "국물" },
          { id: "slot-stew", label: "조치 (찌개류)", category: "국물" }
        ]
      },
      {
        name: "5첩 찬류 (Side Dishes)",
        slots: [
          { id: "slot-side1", label: "찬 1 (나물류)", category: "반찬" },
          { id: "slot-side2", label: "찬 2 (조림류)", category: "반찬" },
          { id: "slot-side3", label: "찬 3 (무침류)", category: "반찬" },
          { id: "slot-side4", label: "찬 4 (전/부침류)", category: "부식" },
          { id: "slot-side5", label: "찬 5 (마른반찬/생채)", category: "반찬" }
        ]
      },
      {
        name: "양념 및 후식 (Condiments & Dessert)",
        slots: [
          { id: "slot-sauce", label: "양념/후식 (종가양념/음청)", category: "양념" }
        ]
      }
    ]
  },
  "bansang_7": {
    title: "7첩 반상 차림 구성 R&D 플래너",
    groups: [
      {
        name: "기본 구성 (밥, 국, 찌개, 찜)",
        slots: [
          { id: "slot-rice", label: "진지 (밥류)", category: "주식" },
          { id: "slot-soup", label: "갱 (탕/국류)", category: "국물" },
          { id: "slot-stew", label: "조치 (찌개류)", category: "국물" },
          { id: "slot-steamed", label: "찜/선 요리", category: "부식" }
        ]
      },
      {
        name: "7첩 찬류 (Side Dishes)",
        slots: [
          { id: "slot-side1", label: "찬 1 (나물류)", category: "반찬" },
          { id: "slot-side2", label: "찬 2 (조림류)", category: "반찬" },
          { id: "slot-side3", label: "찬 3 (무침류)", category: "반찬" },
          { id: "slot-side4", label: "찬 4 (생채류)", category: "반찬" },
          { id: "slot-side5", label: "찬 5 (전/부침류)", category: "부식" },
          { id: "slot-side6", label: "찬 6 (구이/튀김류)", category: "부식" },
          { id: "slot-side7", label: "찬 7 (장아찌류)", category: "반찬" }
        ]
      },
      {
        name: "양념 및 후식 (Condiments & Dessert)",
        slots: [
          { id: "slot-sauce", label: "양념/후식 (종가양념/음청)", category: "양념" }
        ]
      }
    ]
  },
  "bansang_10": {
    title: "10첩 반상 차림 구성 R&D 플래너",
    groups: [
      {
        name: "기본 구성 (밥, 국, 찌개, 찜, 전골)",
        slots: [
          { id: "slot-rice", label: "진지 (밥류)", category: "주식" },
          { id: "slot-soup", label: "갱 (탕/국류)", category: "국물" },
          { id: "slot-stew", label: "조치 (찌개류)", category: "국물" },
          { id: "slot-steamed", label: "찜 요리", category: "부식" },
          { id: "slot-hotpot", label: "전골 요리", category: "국물" }
        ]
      },
      {
        name: "10첩 찬류 (Side Dishes)",
        slots: [
          { id: "slot-side1", label: "찬 1 (나물류)", category: "반찬" },
          { id: "slot-side2", label: "찬 2 (생채류)", category: "반찬" },
          { id: "slot-side3", label: "찬 3 (조림류)", category: "반찬" },
          { id: "slot-side4", label: "찬 4 (구이류)", category: "부식" },
          { id: "slot-side5", label: "찬 5 (전/부침)", category: "부식" },
          { id: "slot-side6", label: "찬 6 (튀김류)", category: "부식" },
          { id: "slot-side7", label: "찬 7 (편육/회)", category: "부식" },
          { id: "slot-side8", label: "찬 8 (장아찌류)", category: "반찬" },
          { id: "slot-side9", label: "찬 9 (젓갈류)", category: "반찬" },
          { id: "slot-side10", label: "찬 10 (마른반찬)", category: "반찬" }
        ]
      },
      {
        name: "양념 및 후식 (Condiments & Dessert)",
        slots: [
          { id: "slot-sauce", label: "양념/후식 (종가양념/음청)", category: "양념" }
        ]
      }
    ]
  },
  "bansang_15": {
    title: "15첩 대형 반상 구성 R&D 플래너",
    groups: [
      {
        name: "기본 구성 (밥, 국, 찌개 2종, 찜, 전골)",
        slots: [
          { id: "slot-rice", label: "진지 (밥류)", category: "주식" },
          { id: "slot-soup", label: "갱 (탕/국류)", category: "국물" },
          { id: "slot-stew1", label: "토장조치 (찌개)", category: "국물" },
          { id: "slot-stew2", label: "맑은조치 (찌개)", category: "국물" },
          { id: "slot-steamed", label: "찜 요리", category: "부식" },
          { id: "slot-hotpot", label: "전골 요리", category: "국물" }
        ]
      },
      {
        name: "15첩 찬류 (Side Dishes)",
        slots: Array.from({ length: 15 }, (_, i) => ({
          id: `slot-side${i+1}`,
          label: `찬 ${i+1} (${i % 3 === 0 ? '나물/무침' : i % 3 === 1 ? '전/부침' : '생채/장아찌'})`,
          category: i % 3 === 1 ? "부식" : "반찬"
        }))
      },
      {
        name: "양념 및 후식 (Condiments & Dessert)",
        slots: [
          { id: "slot-sauce", label: "양념/후식 (종가양념/음청)", category: "양념" }
        ]
      }
    ]
  },
  "bansang_20": {
    title: "20첩 명품 수라상 구성 R&D 플래너",
    groups: [
      {
        name: "기본 구성 (수라 2종, 국 2종, 찌개 2종, 찜, 전골)",
        slots: [
          { id: "slot-rice1", label: "흰수라 (쌀밥)", category: "주식" },
          { id: "slot-rice2", label: "홍반 (팥밥)", category: "주식" },
          { id: "slot-soup1", label: "갱 (미역국)", category: "국물" },
          { id: "slot-soup2", label: "곰탕 (고기탕)", category: "국물" },
          { id: "slot-stew1", label: "토장조치", category: "국물" },
          { id: "slot-stew2", label: "젓국조치", category: "국물" },
          { id: "slot-steamed", label: "찜 요리", category: "부식" },
          { id: "slot-hotpot", label: "전골 요리", category: "국물" }
        ]
      },
      {
        name: "20첩 찬류 (Side Dishes)",
        slots: Array.from({ length: 20 }, (_, i) => ({
          id: `slot-side${i+1}`,
          label: `찬 ${i+1} (${i % 3 === 0 ? '나물/조림' : i % 3 === 1 ? '전/구이' : '장아찌/생채'})`,
          category: i % 3 === 1 ? "부식" : "반찬"
        }))
      },
      {
        name: "양념 및 후식 (Condiments & Dessert)",
        slots: [
          { id: "slot-sauce", label: "양념/후식 (종가양념/음청)", category: "양념" }
        ]
      }
    ]
  },
  "course_hanjeong": {
    title: "한정식 코스 요리 R&D 플래너 (3단계 식사 흐름)",
    groups: [
      {
        name: "1단계: 식전 코스 (Pre-Meal Appetizers & Drinks)",
        slots: [
          { id: "slot-pre-porridge", label: "식전 죽/미음", category: "주식" },
          { id: "slot-pre-salad", label: "식전 샐러드/생채", category: "반찬" },
          { id: "slot-pre-drink", label: "식전 기능주/차류", category: "양념" }
        ]
      },
      {
        name: "2단계: 메인 식사 (Main Meal Courses)",
        slots: [
          { id: "slot-main-dish", label: "메인 보양 요리", category: "국물" },
          { id: "slot-main-rice", label: "약선 진지(밥/죽)", category: "주식" },
          { id: "slot-main-soup", label: "찌개/국류", category: "국물" },
          { id: "slot-main-sides", label: "주요 반찬류(전/조림)", category: "부식" }
        ]
      },
      {
        name: "3단계: 식후 코스 (Post-Meal Refreshers & Teas)",
        slots: [
          { id: "slot-post-mouth", label: "식후 입가심(숭늉/홍화차)", category: "양념" },
          { id: "slot-post-tea", label: "꽃차 및 허브류 차", category: "양념" },
          { id: "slot-post-dessert", label: "전통 디저트/정과류", category: "양념" }
        ]
      }
    ]
  }
};

// R&D 식사 구성 형태 변경 이벤트 핸들러
function handleServingFormatChange() {
  const selectEl = document.getElementById('rnd-serving-format');
  const format = selectEl ? selectEl.value : 'single';
  
  const searchWrap = document.getElementById('rnd-search-box-wrap');
  const plannerPanel = document.getElementById('rnd-multi-dish-planner');
  const catWrap = document.querySelector('.rnd-dish-category-wrap');
  
  if (format === 'single') {
    if (searchWrap) searchWrap.style.display = 'block';
    if (plannerPanel) plannerPanel.style.display = 'none';
    if (catWrap) catWrap.style.display = 'block';
    
    // 단품 모드 전환 시 기존 배합 초기화
    clearRndFormula();
  } else {
    if (searchWrap) searchWrap.style.display = 'none';
    if (plannerPanel) plannerPanel.style.display = 'block';
    if (catWrap) catWrap.style.display = 'none';
    
    // 플래너 슬롯 렌더링
    renderPlannerSlots(format);
  }
}

// 동적 플래너 슬롯 생성 및 렌더링
function renderPlannerSlots(format) {
  const container = document.getElementById('planner-slots-container');
  if (!container) return;
  container.innerHTML = '';
  
  const config = plannerSlotConfigs[format];
  if (!config) return;
  
  const titleEl = document.getElementById('planner-title');
  if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-folder-tree"></i> ${config.title}`;
  
  config.groups.forEach(group => {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'planner-slot-group';
    groupDiv.innerHTML = `<div class="planner-slot-group-title"><i class="fa-regular fa-folder-open"></i> ${group.name}</div>`;
    
    group.slots.forEach(slot => {
      const slotDiv = document.createElement('div');
      slotDiv.className = 'planner-slot-item';
      
      // 카테고리에 속하는 레시피 필터링 (한국어 기준으로 필터링해야 이후 한글 키워드 체크가 작동함)
      let slotRecipes = recipesDbKo.filter(r => r.category === slot.category || r.카테고리 === slot.category);
      
      // 국물 카테고리인 경우 세부 카테고리 분기 처리 (탕, 찌개, 전골 메뉴 분리)
      if (slot.category === "국물") {
        if (slot.id.includes("soup")) {
          // 탕/국류: 전골이나 찌개가 아닌 일반 국/탕류
          slotRecipes = slotRecipes.filter(r => 
            !r.요리명.includes("전골") && 
            !r.요리명.includes("찌개") && 
            !r.요리명.includes("찌게") && 
            !r.요리명.includes("조치")
          );
        } else if (slot.id.includes("stew")) {
          // 찌개류(조치): 요리명에 찌개, 찌게, 조치, 조림 등이 들어가거나, 없는 경우 찌개처럼 먹을 수 있는 보조 국물류로 폴백
          const stewRecipes = slotRecipes.filter(r => 
            r.요리명.includes("찌개") || 
            r.요리명.includes("찌게") || 
            r.요리명.includes("조치") || 
            r.요리명.includes("조림")
          );
          if (stewRecipes.length > 0) {
            slotRecipes = stewRecipes;
          } else {
            // 국류와 찌개 대용 요리들 매칭
            slotRecipes = slotRecipes.filter(r => r.요리명.includes("국") || r.요리명.includes("지리") || r.요리명.includes("찌개"));
          }
        } else if (slot.id.includes("hotpot")) {
          // 전골 요리: 요리명에 전골이 들어가거나, 또는 전골이 없으면 메인 보양 탕류를 전골 대용으로 폴백 노출
          const hotpotRecipes = slotRecipes.filter(r => r.요리명.includes("전골"));
          if (hotpotRecipes.length > 0) {
            slotRecipes = hotpotRecipes;
          } else {
            slotRecipes = slotRecipes.filter(r => r.요리명.includes("탕") || r.요리명.includes("백숙"));
          }
        }
      }
      
      // 반찬 카테고리인 경우 세부 카테고리 분기 처리 (나물, 조림, 무침, 생채, 장아찌, 젓갈, 마른반찬 분리)
      if (slot.category === "반찬") {
        const label = slot.label || "";
        if (label.includes("나물")) {
          // 나물류: 요리명에 나물, 볶음 등이 들어가고 무침, 생채, 장아찌, 조림, 콩자반이 들어가지 않는 정통 숙채/볶음나물
          slotRecipes = slotRecipes.filter(r => 
            (r.요리명.includes("나물") || r.요리명.includes("볶음")) &&
            !r.요리명.includes("무침") &&
            !r.요리명.includes("생채") &&
            !r.요리명.includes("조림") &&
            !r.요리명.includes("장아찌") &&
            !r.요리명.includes("콩자반")
          );
        } else if (label.includes("조림")) {
          // 조림류: 요리명에 조림, 자반, 콩자반이 들어간 요리
          slotRecipes = slotRecipes.filter(r => 
            r.요리명.includes("조림") || 
            r.요리명.includes("자반") ||
            r.요리명.includes("콩자반")
          );
        } else if (label.includes("무침")) {
          // 무침류: 요리명에 무침이 들어가고 생채나 나물이 포함되지 않는 순수 무침류
          slotRecipes = slotRecipes.filter(r => 
            r.요리명.includes("무침") &&
            !r.요리명.includes("생채") &&
            !r.요리명.includes("나물")
          );
        } else if (label.includes("생채")) {
          // 생채류: 요리명에 생채, 오이, 생즙, 겉절이가 들어가고 익힌 나물이 아닌 요리
          slotRecipes = slotRecipes.filter(r => 
            (r.요리명.includes("생채") || r.요리명.includes("오이") || r.요리명.includes("생즙") || r.요리명.includes("겉절이")) &&
            !r.요리명.includes("나물")
          );
        } else if (label.includes("장아찌")) {
          // 장아찌류: 요리명에 장아찌가 들어간 요리
          slotRecipes = slotRecipes.filter(r => 
            r.요리명.includes("장아찌")
          );
        } else if (label.includes("젓갈")) {
          // 젓갈류: 요리명에 젓갈이 들어가거나, 없는 경우 젓갈처럼 먹을 수 있는 절임류(장아찌)로 폴백
          const jeotgalRecipes = slotRecipes.filter(r => r.요리명.includes("젓갈") || r.요리명.includes("젓"));
          if (jeotgalRecipes.length > 0) {
            slotRecipes = jeotgalRecipes;
          } else {
            slotRecipes = slotRecipes.filter(r => r.요리명.includes("장아찌"));
          }
        } else if (label.includes("마른반찬")) {
          // 마른반찬: 요리명에 멸치, 자반 등이 들어간 요리
          slotRecipes = slotRecipes.filter(r => 
            r.요리명.includes("멸치") || 
            r.요리명.includes("자반") ||
            r.요리명.includes("자반")
          );
        }
      }
      
      let optionsHtml = `<option value="">${getTranslation('[선택 안 함]', currentLanguage)}</option>`;
      slotRecipes.forEach(r => {
        const lr = getLocalizedRecipe(r, currentLanguage);
        optionsHtml += `<option value="${r.요리명}">${lr.요리명}</option>`;
      });
      
      slotDiv.innerHTML = `
        <span class="planner-slot-label">${slot.label}</span>
        <select id="${slot.id}" class="planner-slot-select" onchange="loadPlannerRecipesToBlender()">
          ${optionsHtml}
        </select>
      `;
      groupDiv.appendChild(slotDiv);
    });
    
    container.appendChild(groupDiv);
  });
  
  // 최초 연동
  loadPlannerRecipesToBlender();
}

// 선택된 모든 슬롯의 요리 재료들을 파싱하여 R&D 배합표에 취합
function loadPlannerRecipesToBlender() {
  const formatSelect = document.getElementById('rnd-serving-format');
  const format = formatSelect ? formatSelect.value : 'single';
  if (format === 'single') return;
  
  const config = plannerSlotConfigs[format];
  if (!config) return;
  
  // 배합표 리스트 초기화
  rndIngredients = [];
  
  // 모든 슬롯의 선택 값 취합
  config.groups.forEach(group => {
    group.slots.forEach(slot => {
      const selectEl = document.getElementById(slot.id);
      if (selectEl && selectEl.value) {
        const recipeName = selectEl.value;
        let recipe = recipesDb.find(r => r.요리명 === recipeName);
        if (!recipe) {
          const idx = recipesDbKo.findIndex(r => r.요리명 === recipeName);
          if (idx !== -1 && recipesDb[idx]) {
            recipe = recipesDb[idx];
          }
        }
        if (!recipe) {
          const translatedName = getTranslation(recipeName, currentLanguage);
          if (translatedName && translatedName !== recipeName) {
            recipe = recipesDb.find(r => r.요리명 === translatedName || (r.요리명 && r.요리명.includes(translatedName)));
          }
        }
        if (!recipe) {
          recipe = recipesDb.find(r => r.요리명 && (r.요리명.includes(recipeName) || recipeName.includes(r.요리명)));
        }
        if (recipe) {
          parseRecipeIngredientsToTemp(recipe);
        }
      }
    });
  });
  
  // 동일 성분 중량 합산 및 병합
  const merged = [];
  const seen = {};
  rndIngredients.forEach(item => {
    if (seen[item.name]) {
      seen[item.name].weight += item.weight;
    } else {
      seen[item.name] = { ...item };
      merged.push(seen[item.name]);
    }
  });
  rndIngredients = merged;
  
  // R&D 분석 실행 및 테이블 업데이트
  updateRndAnalysis();
}

// 레시피 재료를 임시로 파싱해 추가하는 보조 헬퍼 함수
function parseRecipeIngredientsToTemp(recipe) {
  function tryAddTempIngredient(rawName, role, weight, cost) {
    const name = rawName.trim();
    if (!name) return;

    // 마스터 DB에 있는 식재료명이면 추가
    const existsInDb = masterDb.some(r => r["식재료/약재"] === name);
    if (existsInDb) {
      rndIngredients.push({ name, role, weight, cost });
      return;
    }

    // 복합 한약재 괄호식 형태 분해 (예: "사군자탕(백출, 감초, 복령, 인삼)")
    const subMatch = name.match(/^([^\(]+)\(([^)]+)\)/);
    if (subMatch) {
      const parentName = subMatch[1].trim();
      const childText = subMatch[2];
      
      if (masterDb.some(r => r["식재료/약재"] === parentName)) {
        rndIngredients.push({ name: parentName, role, weight, cost });
        return;
      }

      const children = childText.split(',').map(c => c.trim()).filter(Boolean);
      let addedAny = false;
      children.forEach(child => {
        const childMatch = child.match(/^([^\s\(\d]+)(?:\s*\(?(\d+)g\)?)?/);
        if (childMatch) {
          const cName = childMatch[1].trim();
          const cWeight = childMatch[2] ? parseFloat(childMatch[2]) : Math.round(weight / children.length);
          if (masterDb.some(r => r["식재료/약재"] === cName)) {
            rndIngredients.push({ name: cName, role, weight: cWeight, cost });
            addedAny = true;
          }
        }
      });

      if (addedAny) return;
    }

    // 최종 매칭이 없어도 일단 추가
    rndIngredients.push({ name, role, weight, cost });
  }

  // 1. 주재료 파싱
  if (recipe.주재료) {
    const rawMain = splitByCommaOutsideParens(recipe.주재료);
    rawMain.forEach(m => {
      const match = m.match(/^([^\(]+)(?:\(([^)]+)\))?/);
      if (match) {
        const rawName = match[1].trim();
        const weightStr = match[2] || "";
        let weight = 50;
        const numMatch = weightStr.match(/(\d+)/);
        if (numMatch) weight = parseFloat(numMatch[1]);
        
        tryAddTempIngredient(rawName, "군약(君藥)", weight, 12);
      }
    });
  }

  // 2. 부재료 및 약재 파싱
  if (recipe["부재료 및 약재"] || recipe["부재료"]) {
    const subText = recipe["부재료 및 약재"] || recipe["부재료"];
    const rawSub = splitByCommaOutsideParens(subText);
    rawSub.forEach((s, idx) => {
      const match = s.match(/^([^\(]+)(?:\(([^)]+)\))?/);
      if (match) {
        const rawName = match[1].trim();
        const weightStr = match[2] || "";
        let weight = 20;
        const numMatch = weightStr.match(/(\d+)/);
        if (numMatch) weight = parseFloat(numMatch[1]);

        let role = "신약(臣藥)";
        if (idx === 0) role = "신약(臣藥)";
        else if (idx <= 2) role = "좌약(佐藥)";
        else role = "사약(使藥)";

        tryAddTempIngredient(rawName, role, weight, 18);
      }
    });
  }
}

// 실시간 비즈니스 원가 계산
function updateRndCost() {
  let totalCost = 0;
  rndIngredients.forEach(item => {
    totalCost += item.weight * item.cost * batchMultiplier;
  });
  
  const costLbl = document.getElementById('rnd-cost-lbl');
  if (costLbl) {
    costLbl.innerText = batchMultiplier > 1 ? `총 R&D 생산 원가 (${batchMultiplier}인분):` : "1인분 추정 원가:";
  }
  
  const costVal = document.getElementById('rnd-total-cost');
  if (costVal) {
    costVal.innerText = Math.round(totalCost).toLocaleString();
  }
}

// AI 약성 향상 시너지 부스터 추천 매칭 규칙
const synergyBoosterMap = {
  "인삼": [
    { name: "대추", desc: "인삼의 비위 기력 보강 효능을 극대화하고 소화를 촉진합니다." },
    { name: "황기", desc: "보기(補氣) 작용을 함께 강화하여 전신 면역력을 증진시킵니다." }
  ],
  "맥문동": [
    { name: "오미자", desc: "진액 생성을 극대화하여 마른 기침을 다스리는 최적의 궁합입니다." },
    { name: "천문동", desc: "기관지 점막 윤활 및 기침/가래 완화 약성을 증대합니다." }
  ],
  "하수오": [
    { name: "구기자", desc: "간과 신장의 정혈을 함께 보해 노화 방지 효능을 증폭합니다." },
    { name: "검정콩", desc: "신장을 튼튼히 하고 모발 건강을 돕는 전통 배합입니다." }
  ],
  "산약": [
    { name: "백출", desc: "비장과 위장 소화기를 한층 더 건실하게 만듭니다." },
    { name: "복령", desc: "습을 제거하고 마음을 안정시키는 안신 효능을 돕습니다." }
  ],
  "당귀": [
    { name: "천궁", desc: "기혈 순환을 돕고 보혈(피를 채움) 효과를 극대화합니다." },
    { name: "숙지황", desc: "정혈을 크게 보충하여 허약 체질 개선에 좋습니다." }
  ],
  "지구자": [
    { name: "갈화", desc: "주독(酒毒) 해소 및 알코올 해독 속도를 높이는 최상의 조합입니다." },
    { name: "갈근", desc: "목 뒤 뭉침을 풀고 숙취로 인한 갈증을 해소합니다." }
  ],
  "상기생": [
    { name: "우슬", desc: "관절통과 척추 요통을 다스리며 뼈와 힘줄을 튼튼히 합니다." },
    { name: "오가피", desc: "체내 풍습(독소 및 습기)을 내보내 관절 건강을 돕습니다." }
  ],
  "은이버섯": [
    { name: "백합", desc: "폐를 촉촉하게 자양하고 만성 염증성 기침을 완화합니다." }
  ],
  "구기자": [
    { name: "국화", desc: "간의 열을 내리고 눈을 밝게 하는 명목(明目) 시너지를 냅니다." }
  ],
  "황기": [
    { name: "당귀", desc: "기혈을 동시에 보강하여 기력 회복 속도를 배가합니다." }
  ]
};

function updateSynergyBooster() {
  const container = document.getElementById('rnd-booster-container');
  if (!container) return;
  container.innerHTML = '';

  if (rndIngredients.length === 0) {
    container.innerHTML = `<p style="font-size:0.82rem; color:var(--text-muted); text-align:center; margin: 10px 0;">원재료를 1개 이상 배합표에 추가하면 약성 향상 제안이 활성화됩니다.</p>`;
    return;
  }

  const currentNames = new Set(rndIngredients.map(i => i.name));
  const recommendations = [];

  rndIngredients.forEach(item => {
    const suggestions = synergyBoosterMap[item.name];
    if (suggestions) {
      suggestions.forEach(s => {
        if (!currentNames.has(s.name) && !recommendations.some(r => r.name === s.name)) {
          recommendations.push({
            trigger: item.name,
            name: s.name,
            desc: s.desc
          });
        }
      });
    }
  });

  if (recommendations.length === 0) {
    container.innerHTML = `<p style="font-size:0.82rem; color:var(--primary); text-align:center; margin: 10px 0;"><i class="fa-solid fa-circle-check"></i> 현재 배합은 이미 뛰어난 독자적 상생 밸런스를 확보하고 있습니다.</p>`;
    return;
  }

  recommendations.slice(0, 3).forEach(rec => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'booster-item';
    itemDiv.innerHTML = `
      <div style="flex:1; padding-right:10px;">
        <span style="font-weight:700; color:var(--sa-color); cursor:pointer; " onclick="showRndRowDetailByName('${rec.name.replace(/'/g, "\\\\'")}')" class="clickable-text" title="클릭 시 약재 상세 정보 팝업"><i class="fa-solid fa-angles-up"></i> ${rec.name}</span> 
        <small style="color:var(--text-muted); font-size:0.75rem;">(배합원료: <span style="cursor:pointer; " onclick="showRndRowDetailByName('${rec.trigger.replace(/'/g, "\\\\'")}')" class="clickable-text">${rec.trigger}</span> 보완)</small>
        <p style="margin-top:2px; font-size:0.75rem; color:var(--text-main); line-height:1.4;">${rec.desc}</p>
      </div>
      <button class="booster-add-btn" onclick="addIngredientToRnd('${rec.name.replace(/'/g, "\\\\'")}', '좌약(佐藥)', 10, 20)">추가</button>
    `;
    container.appendChild(itemDiv);
  });
}

// 실시간 한방 / 과학 융합 통합 R&D 분석 연산
function updateRndAnalysis() {
  renderRndIngredientsTable();
  updateRndCost();
  updateSynergyBooster();

  // 1. 칠정배합 검증 (MatrixEngine 이용)
  const safeContainer = document.getElementById('rnd-safe-container');
  if (safeContainer) {
    safeContainer.innerHTML = '';
    
    // MatrixEngine의 checkChiljeongCompounding 호출을 위해 임시 객체 배열 매핑
    const mappingInput = rndIngredients.map(i => ({ name: i.name }));
    const result = engine.checkChiljeongCompounding(mappingInput);
    
    if (result.warnings.length === 0 && result.synergies.length === 0) {
      safeContainer.innerHTML = `<p style="font-size:0.82rem; color:var(--text-muted); text-align:center; margin: 10px 0;">감지된 상극 독성 반응 또는 유의한 궁합 시너지가 없습니다.</p>`;
    } else {
      const listDiv = document.createElement('div');
      listDiv.className = 'alert-card-flow';
      
      result.warnings.forEach(w => {
        listDiv.innerHTML += `
          <div class="alert-item warn" style="padding:10px 14px;">
            <i class="fa-solid fa-triangle-exclamation" style="margin-top:2px;"></i>
            <div>
              <strong>상극 배합 검출: <span style="cursor:pointer; " onclick="showRndRowDetailByName('${w.a.replace(/'/g, "\\\\'")}')" class="clickable-text">${w.a}</span> - <span style="cursor:pointer; " onclick="showRndRowDetailByName('${w.b.replace(/'/g, "\\\\'")}')" class="clickable-text">${w.b}</span></strong>
              <p style="font-size: 0.75rem; margin-top:2px; opacity:0.85;">${w.desc} (주의: 상업용 조리 시 중량 차등 또는 우회 성분 교체를 고려하십시오.)</p>
            </div>
          </div>
        `;
      });

      result.synergies.forEach(s => {
        listDiv.innerHTML += `
          <div class="alert-item syn" style="padding:10px 14px;">
            <i class="fa-solid fa-star" style="margin-top:2px;"></i>
            <div>
              <strong>궁합 시너지 매칭: <span style="cursor:pointer; " onclick="showRndRowDetailByName('${s.a.replace(/'/g, "\\\\'")}')" class="clickable-text">${s.a}</span> - <span style="cursor:pointer; " onclick="showRndRowDetailByName('${s.b.replace(/'/g, "\\\\'")}')" class="clickable-text">${s.b}</span></strong>
              <p style="font-size: 0.75rem; margin-top:2px; opacity:0.85;">${s.desc} (체내 흡수율 및 약성 향상 시너지가 극대화됩니다.)</p>
            </div>
          </div>
        `;
      });
      safeContainer.appendChild(listDiv);
    }
  }

  // 2. 성미귀경 오행 분포 계산 및 렌더링
  const natureCounts = { "온성/열성": 0, "평성": 0, "한성/량성": 0 };
  const tasteCounts = { "단맛(감)": 0, "매운맛(신)": 0, "쓴맛(고)": 0, "신맛(산)": 0, "짠맛(함)": 0 };
  const meridianCounts = { "비경": 0, "위경": 0, "간경": 0, "신경": 0, "폐경": 0, "심경": 0 };

  let totalWeight = 0;
  let totalCalories = 0;
  let totalCarbs = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalFiber = 0;
  let totalSodium = 0;
  let detectedBioactives = new Set();

  rndIngredients.forEach(item => {
    // 마스터 DB에서 해당 재료의 속성 매치
    const row = masterDb.find(r => r["식재료/약재"] === item.name);
    const herbology = window.ingredientsHerbologyList && window.ingredientsHerbologyList.find(h => h.식재료명 === item.name || item.name.includes(h.식재료명) || (h["이명/한약명"] && h["이명/한약명"].includes(item.name)));
    
    // 현대 영양 매핑 감지
    if (window.ingredientsNutritionMap) {
      const nutri = window.ingredientsNutritionMap[item.name] || window.ingredientsNutritionMap[Object.keys(window.ingredientsNutritionMap).find(k => item.name.includes(k) || k.includes(item.name))];
      if (nutri) {
        const ratio = item.weight / 10.0; // JSON 데이터는 10g당 함량 기준
        totalCalories += (nutri.calories || 0) * ratio;
        totalCarbs += (nutri.carbohydrates || 0) * ratio;
        totalProtein += (nutri.protein || 0) * ratio;
        totalFat += (nutri.fat || 0) * ratio;
        totalFiber += (nutri.fiber || 0) * ratio;
        totalSodium += (nutri.sodium || 0) * ratio;
        
        if (nutri.bioactive_compounds) {
          nutri.bioactive_compounds.forEach(comp => detectedBioactives.add(comp));
        }
      }
    }

    const descText = (row ? (row.설명목록 || []).join(" ") : "") + " " + (herbology ? herbology["성미 (성질과 맛)"] : "");
    const origEffText = (row ? (row.효능목록 || []).join(", ") : "");
    
    // 가중치 계산 (군약: 3, 신약: 2, 좌약/사약: 1)
    let weightFactor = 1;
    if (item.role.includes("군약")) weightFactor = 3;
    else if (item.role.includes("신약")) weightFactor = 2;
    
    // 조리배율과 중량이 반영된 실질 중량 가중치
    const scaledItemWeight = item.weight * batchMultiplier;
    const itemFactor = weightFactor * scaledItemWeight;
    
    totalWeight += scaledItemWeight;

    // 성질 파싱
    if (descText.includes("따뜻") || descText.includes("온(溫)") || descText.includes("열(熱)")) {
      natureCounts["온성/열성"] += itemFactor;
    } else if (descText.includes("차가") || descText.includes("한(寒)") || descText.includes("서늘") || descText.includes("량(凉)")) {
      natureCounts["한성/량성"] += itemFactor;
    } else {
      natureCounts["평성"] += itemFactor;
    }

    // 맛 파싱
    if (descText.includes("달다") || descText.includes("감(甘)")) tasteCounts["단맛(감)"] += itemFactor;
    if (descText.includes("맵다") || descText.includes("신(辛)")) tasteCounts["매운맛(신)"] += itemFactor;
    if (descText.includes("쓰다") || descText.includes("고(苦)")) tasteCounts["쓴맛(고)"] += itemFactor;
    if (descText.includes("시다") || descText.includes("산(酸)")) tasteCounts["신맛(산)"] += itemFactor;
    if (descText.includes("짜다") || descText.includes("함(鹹)")) tasteCounts["짠맛(함)"] += itemFactor;

    // 귀경 파싱
    const targetMeridians = ["간경", "심경", "비경", "위경", "폐경", "신경"];
    targetMeridians.forEach(m => {
      if (descText.includes(m) || origEffText.includes(m) || (herbology && herbology["약선 배합 및 요리법"] && herbology["약선 배합 및 요리법"].includes(m))) {
        meridianCounts[m] += itemFactor;
      }
    });
  });

  // UI 렌더링 - 사기(성질)
  const natureContainer = document.getElementById('rnd-nature-balance');
  if (natureContainer) {
    natureContainer.innerHTML = '';
    const totalNature = Object.values(natureCounts).reduce((a, b) => a + b, 0) || 1;
    Object.entries(natureCounts).forEach(([n, count]) => {
      const pct = ((count / totalNature) * 100).toFixed(0);
      let color = '#10b981'; // 평성
      if (n.includes('온')) color = '#f59e0b'; // 온성
      else if (n.includes('한')) color = '#3b82f6'; // 한성
      
      natureContainer.innerHTML += `
        <div class="balance-progress-item">
          <div class="balance-progress-lbl">
            <span>${n}</span>
            <span>${pct}%</span>
          </div>
          <div class="balance-progress-track">
            <div class="balance-progress-fill" style="width:${pct}%; background:${color};"></div>
          </div>
        </div>
      `;
    });
  }
  // UI 렌더링 - 오미(맛)
  const tasteContainer = document.getElementById('rnd-taste-balance');
  if (tasteContainer) {
    tasteContainer.innerHTML = '';
    const totalTaste = Object.values(tasteCounts).reduce((a, b) => a + b, 0) || 1;
    Object.entries(tasteCounts).forEach(([t, count]) => {
      const pct = ((count / totalTaste) * 100).toFixed(0);
      tasteContainer.innerHTML += `
        <div class="balance-progress-item">
          <div class="balance-progress-lbl">
            <span>${t}</span>
            <span>${pct}%</span>
          </div>
          <div class="balance-progress-track">
            <div class="balance-progress-fill" style="width:${pct}%; background:var(--primary);"></div>
          </div>
        </div>
      `;
    });
  }

  // UI 렌더링 - 귀경
  const meridianContainer = document.getElementById('rnd-meridian-balance');
  if (meridianContainer) {
    meridianContainer.innerHTML = '';
    const maxMeridian = Math.max(...Object.values(meridianCounts), 1);
    Object.entries(meridianCounts).forEach(([m, count]) => {
      const isHeavy = count > 0 && count === maxMeridian;
      meridianContainer.innerHTML += `
        <span class="meridian-badge ${isHeavy ? 'heavy' : ''}">
          ${m} (${Math.round(count).toLocaleString()}점)
        </span>
      `;
    });
  }

  // 3. 기대 생리활성 및 7대 반응 축(7-AXIS) 예측
  const axisScores = { '정화': 0, '완화': 0, '흡수': 0, '회복': 0, '순환': 0, '보호': 0, '안정': 0 };
  const funcToAxis = {};
  standardFunctions.forEach(item => {
    funcToAxis[item.표준기능] = item["7축"];
  });

  rndIngredients.forEach(item => {
    const row = masterDb.find(r => r["식재료/약재"] === item.name);
    if (row) {
      let axes = new Set();
      (row.표준기능목록 || []).forEach(f => {
        if (f) {
          const ax = getResolved7Axis(f, null);
          if (ax) axes.add(ax);
        }
      });

      let weightFactor = 1;
      if (item.role.includes("군약")) weightFactor = 3;
      else if (item.role.includes("신약")) weightFactor = 2;

      // 조리배율과 중량이 반영된 실질 중량 가중치
      const scaledItemWeight = item.weight * batchMultiplier;
      const itemFactor = weightFactor * scaledItemWeight;

      axes.forEach(axis => {
        if (axisScores.hasOwnProperty(axis)) {
          axisScores[axis] += itemFactor;
        }
      });
    }
  });

  const axisContainer = document.getElementById('rnd-axis-progress-container');
  if (axisContainer) {
    axisContainer.innerHTML = '';
    const totalAxisScore = Object.values(axisScores).reduce((a, b) => a + b, 0) || 1;
    
    Object.entries(axisScores).forEach(([axis, score]) => {
      const pct = ((score / totalAxisScore) * 100).toFixed(0);
      if (score > 0) {
        axisContainer.innerHTML += `
          <div class="rnd-axis-item">
            <div class="rnd-axis-lbl">
              <span>${axis} 계열</span>
              <span>${pct}% (가중치 ${Math.round(score).toLocaleString()}점)</span>
            </div>
            <div class="rnd-axis-track">
              <div class="rnd-axis-fill" style="width:${pct}%;"></div>
            </div>
          </div>
        `;
      }
    });

    if (axisContainer.innerHTML === '') {
      axisContainer.innerHTML = `<p style="font-size:0.82rem; color:var(--text-muted); text-align:center;">7대 축 분류를 예측할 수 있는 식재료가 없습니다.</p>`;
    }
  }

  // 4-2. 현대 과학 영양 및 생리활성 성분 렌더링
  const caloriesEl = document.getElementById('rnd-nutri-calories');
  if (caloriesEl) {
    caloriesEl.innerText = Math.round(totalCalories);
    document.getElementById('rnd-nutri-sodium').innerText = Math.round(totalSodium);
    document.getElementById('rnd-nutri-val-carbs').innerText = totalCarbs.toFixed(1);
    document.getElementById('rnd-nutri-val-protein').innerText = totalProtein.toFixed(1);
    document.getElementById('rnd-nutri-val-fat').innerText = totalFat.toFixed(1);
    document.getElementById('rnd-nutri-val-fiber').innerText = totalFiber.toFixed(1);

    const totalMacros = totalCarbs + totalProtein + totalFat;
    let carbsPct = 0, proteinPct = 0, fatPct = 0;
    if (totalMacros > 0) {
      carbsPct = Math.round((totalCarbs / totalMacros) * 100);
      proteinPct = Math.round((totalProtein / totalMacros) * 100);
      fatPct = 100 - carbsPct - proteinPct; // 합계가 정확히 100%가 되도록 조정
      if (fatPct < 0) fatPct = 0;
    }

    document.getElementById('rnd-nutri-pct-carbs').innerText = carbsPct;
    document.getElementById('rnd-nutri-pct-protein').innerText = proteinPct;
    document.getElementById('rnd-nutri-pct-fat').innerText = fatPct;

    // 프로그레스 바 너비 업데이트
    const barCarbs = document.getElementById('rnd-nutri-bar-carbs');
    const barProtein = document.getElementById('rnd-nutri-bar-protein');
    const barFat = document.getElementById('rnd-nutri-bar-fat');
    if (barCarbs && barProtein && barFat) {
      if (totalMacros > 0) {
        barCarbs.style.width = `${carbsPct}%`;
        barProtein.style.width = `${proteinPct}%`;
        barFat.style.width = `${fatPct}%`;
      } else {
        barCarbs.style.width = '33.3%';
        barProtein.style.width = '33.3%';
        barFat.style.width = '33.3%';
      }
    }
  }

  // 4-3. 생리활성 물질 태그 렌더링
  const bioactiveContainer = document.getElementById('rnd-bioactive-container');
  if (bioactiveContainer) {
    bioactiveContainer.innerHTML = '';
    if (detectedBioactives.size === 0) {
      bioactiveContainer.innerHTML = '<span style="font-size:0.82rem; color:var(--text-muted); padding:4px 0;">원료를 1개 이상 추가 시 활성 물질 목록이 계산됩니다.</span>';
    } else {
      detectedBioactives.forEach(comp => {
        const tag = document.createElement('span');
        tag.className = 'bioactive-tag';
        tag.style.cssText = 'background:rgba(16,185,129,0.08); color:var(--primary); border:1px solid rgba(16,185,129,0.3); border-radius:12px; padding:3px 10px; font-size:0.75rem; font-weight:600; cursor:pointer; transition: all 0.2s ease;';
        tag.innerHTML = `<i class="fa-solid fa-seedling" style="margin-right:4px;"></i>${comp}`;
        tag.onclick = () => showBioactiveBenefit(comp);
        tag.onmouseover = () => { tag.style.background = 'rgba(16,185,129,0.2)'; tag.style.borderColor = 'var(--primary)'; };
        tag.onmouseout = () => { tag.style.background = 'rgba(16,185,129,0.1)'; tag.style.borderColor = 'rgba(16,185,129,0.3)'; };
        bioactiveContainer.appendChild(tag);
      });
    }
  }

  // 4-4. 전통 발효주 & 음청류 페어링 추천 렌더링
  const pairingContainer = document.getElementById('rnd-pairing-container');
  if (pairingContainer) {
    pairingContainer.innerHTML = '';
    if (rndIngredients.length === 0) {
      pairingContainer.innerHTML = '<p style="font-size:0.82rem; color:var(--text-muted); margin:0;">원재료를 추가하여 배합 설계를 진행하면, 페어링이 추천됩니다.</p>';
    } else {
      const dishSelect = document.getElementById('rnd-dish-category');
      const dishCategoryVal = dishSelect ? dishSelect.value : "기타";
      
      let matchedLiquorName = "안동 유기농 노랑 국화차 (30g)";
      let matchedLiquorPrice = "18,000원";
      let matchedLiquorIcon = "🍵";
      let matchedLiquorDesc = "머리를 맑게 하고 위장 소화 흡수를 향기롭게 감싸주는 유기농 국화송이차입니다.";

      if (dishCategoryVal.includes("국물_메인") || dishCategoryVal === "부식") {
        matchedLiquorName = "청명 진맥 청주 (500ml)";
        matchedLiquorPrice = "32,000원";
        matchedLiquorIcon = "🍶";
        matchedLiquorDesc = "보리 누룩으로 빚어 육류의 느끼한 맛을 개운하게 씻어주고 소화를 촉진하는 맑은 청주입니다.";
      } else if (natureCounts["온성/열성"] > natureCounts["한성/량성"]) {
        matchedLiquorName = "지리산 안신 연잎 꽃차 (30g)";
        matchedLiquorPrice = "22,000원";
        matchedLiquorIcon = "🌸";
        matchedLiquorDesc = "따뜻한 성질의 음식 뒤에 마음을 차분히 가라앉히고 번열을 제거하는 안신(安神) 꽃차입니다.";
      } else if (natureCounts["한성/량성"] > natureCounts["온성/열성"]) {
        matchedLiquorName = "홍화 보양 백세주 (375ml)";
        matchedLiquorPrice = "24,000원";
        matchedLiquorIcon = "🍶";
        matchedLiquorDesc = "서늘한 음식의 성질을 온화하게 덮어주고 기혈의 미세 순환을 돕는 보양주입니다.";
      }

      pairingContainer.innerHTML = `
        <div style="font-size:1.8rem; line-height:1; display:flex; align-items:center;">${matchedLiquorIcon}</div>
        <div style="flex:1;">
          <h4 style="font-size:0.85rem; font-weight:700; color:#fff; margin:0 0 2px;">${matchedLiquorName}</h4>
          <p style="font-size:0.75rem; color:var(--text-muted); margin:0;">${matchedLiquorDesc}</p>
        </div>
        <div style="text-align:right;">
          <div style="font-size:0.85rem; font-weight:800; color:var(--primary);">${matchedLiquorPrice}</div>
          <button class="btn btn-outline btn-xsmall" style="margin-top:4px; padding:2px 8px; font-size:0.7rem;" onclick="switchTab('tab-shop')">상점 구매</button>
        </div>
      `;
    }
  }

  // 4. 창업용 약선 마케팅 컨셉 문구(Claims) 생성
  const marketingBox = document.getElementById('rnd-marketing-output');
  if (marketingBox) {
    if (rndIngredients.length === 0) {
      marketingBox.innerText = "원재료를 추가하여 배합 설계를 진행하면, 스토리가 자동으로 조립됩니다.";
      return;
    }

    const dishSelect = document.getElementById('rnd-dish-category');
    const dishCategoryVal = dishSelect ? dishSelect.value : "기타";
    
    // 요리 종류 한글명 번역
    const categoryNames = {
      "주식_일반": "주식 (일반 밥류)",
      "주식_복합": "주식 (약선 보양 복합밥류)",
      "주식_죽면": "주식 (죽 / 미음 / 면 / 수제비 / 만두)",
      "국물_메인": "국물 (메인 보양 탕 / 백숙 / 전골류)",
      "국물_일반": "국물 (일반 국 / 찌개류)",
      "반찬": "반찬 (나물 / 생채 / 무침 / 장아찌 / 일반조림)",
      "부식": "부식 (전 / 구이 / 튀김 / 주요 육류·어류 요리)",
      "양념": "양념 (조미료 / 전통 음청 / 후식 디저트류)",
      "기타": "기타 요리"
    };
    const dishCategoryName = categoryNames[dishCategoryVal] || "약선 요리";

    const gunItem = rndIngredients.find(i => i.role.includes("군약")) || rndIngredients[0];
    const sinItem = rndIngredients.find(i => i.role.includes("신약")) || rndIngredients[1];
    const jwaItem = rndIngredients.find(i => i.role.includes("좌약"));
    const saItem = rndIngredients.find(i => i.role.includes("사약"));
    
    // 주요 7대 축 결과 추출
    const sortedAxes = Object.entries(axisScores).filter(([_, s]) => s > 0).sort((a, b) => b[1] - a[1]);
    const mainAxis = sortedAxes.length > 0 ? sortedAxes[0][0] : "종합 조율";

    // 지배적 기미(성질) 추출
    const sortedNature = Object.entries(natureCounts).sort((a, b) => b[1] - a[1]);
    const mainNature = sortedNature[0][0];

    const formatSelect = document.getElementById('rnd-serving-format');
    const servingFormat = formatSelect ? formatSelect.value : 'single';

    let claimText = "";
    
    if (servingFormat.startsWith("bansang_")) {
      const cheopNames = {
        "bansang_5": "5첩 반상 보양 정식",
        "bansang_7": "7첩 반상 보양 정식",
        "bansang_10": "10첩 명품 반상 정식",
        "bansang_15": "15첩 대형 약선 궁중반상",
        "bansang_20": "20첩 명품 수라 보양상"
      };
      const cheopName = cheopNames[servingFormat] || "전통 약선 반상 차림";
      
      claimText = `[Nuri Lab R&D 전통 반상 차림 마케팅 컨셉]\n\n`;
      claimText += `본 식단은 한국 전통 식문화의 정수인 [${cheopName}] 형태로 구성된 균형 잡힌 명품 약선 차림새입니다.\n\n`;
      claimText += `한방 성미학적 [${mainNature}] 기운을 지배적으로 띠고 있어 체내 오행 기운을 조화롭게 조율하며, 현대 영양학적 생리 활성 지표인 [${mainAxis}] 작용을 극대화하도록 원료들이 과학적으로 배합되었습니다.\n\n`;
      claimText += `식재료 간의 약성 상극(칠정배합)을 실시간 회피하고, 중복 원료를 유기적으로 병합/조율하여 여러 요리들이 밥상 위에서 서로의 흡수율을 돕고 시너지를 일으키도록 구성된 것이 본 식단 R&D의 최대 강점입니다.\n\n`;
      claimText += `프랜차이즈 한정식 전문점이나 프리미엄 웰빙 급식/밀키트 시장에서 "귀한 분을 대접하는 전통 [${cheopName}]"이라는 고부가가치 건강 스토리텔링으로 고급화 브랜딩을 전개하기에 최적의 조합입니다.`;
    } else if (servingFormat === "course_hanjeong") {
      const prePorridgeVal = document.getElementById('slot-pre-porridge') ? document.getElementById('slot-pre-porridge').value : '';
      const preSaladVal = document.getElementById('slot-pre-salad') ? document.getElementById('slot-pre-salad').value : '';
      const preDrinkVal = document.getElementById('slot-pre-drink') ? document.getElementById('slot-pre-drink').value : '';
      
      const mainDishVal = document.getElementById('slot-main-dish') ? document.getElementById('slot-main-dish').value : '';
      const mainRiceVal = document.getElementById('slot-main-rice') ? document.getElementById('slot-main-rice').value : '';
      const mainSoupVal = document.getElementById('slot-main-soup') ? document.getElementById('slot-main-soup').value : '';
      const mainSidesVal = document.getElementById('slot-main-sides') ? document.getElementById('slot-main-sides').value : '';
      
      const postMouthVal = document.getElementById('slot-post-mouth') ? document.getElementById('slot-post-mouth').value : '';
      const postTeaVal = document.getElementById('slot-post-tea') ? document.getElementById('slot-post-tea').value : '';
      const postDessertVal = document.getElementById('slot-post-dessert') ? document.getElementById('slot-post-dessert').value : '';
      
      claimText = `[Nuri Lab R&D 약선 한정식 코스 요리 마케팅 컨셉]\n\n`;
      claimText += `본 코스는 식사의 시작부터 마감까지 인체의 약리 작용 흐름(Dining Flow)을 3단계로 과학적 설계한 프리미엄 약선 한정식 다이닝 코스입니다.\n\n`;
      
      claimText += `1️⃣ [식전 코스 (Pre-Meal)]: `;
      let preStory = [];
      if (prePorridgeVal) preStory.push(`비위를 조율하는 '${prePorridgeVal}'`);
      if (preSaladVal) preStory.push(`신선한 약성의 '${preSaladVal}'`);
      if (preDrinkVal) preStory.push(`식욕을 돋우고 혈행을 활성화하는 '${preDrinkVal}'`);
      claimText += preStory.length > 0 ? preStory.join(", ") + " 등을 배치하여 식사 전 소화액 분비와 위장 온난화를 부스팅합니다.\n" : "입안을 정화하고 위장을 따뜻하게 하여 입맛을 돋웁니다.\n";
      
      claimText += `2️⃣ [메인 식사 (Main Meal)]: `;
      let mainStory = [];
      if (mainDishVal) mainStory.push(`원기를 크게 보하는 핵심 보양 요리인 '${mainDishVal}'`);
      if (mainRiceVal) mainStory.push(`영양 뼈대가 되는 '${mainRiceVal}'`);
      if (mainSoupVal) mainStory.push(`국물 조화인 '${mainSoupVal}'`);
      if (mainSidesVal) mainStory.push(`찬으로 곁들이는 '${mainSidesVal}'`);
      claimText += mainStory.length > 0 ? mainStory.join(", ") + " 등을 융합하여 기혈(氣血)을 대보(大補)하고 핵심 약성을 집중적으로 체내에 공급합니다.\n" : "고단백 영양소와 핵심 본초 성분을 체내에 집중 공급합니다.\n";
      
      claimText += `3️⃣ [식후 코스 (Post-Meal)]: `;
      let postStory = [];
      if (postMouthVal) postStory.push(`식후 깔끔하게 입안을 정화하는 입가심 '${postMouthVal}'`);
      if (postTeaVal) postStory.push(`은은하게 마음을 안정시키는 꽃차/허브차인 '${postTeaVal}'`);
      if (postDessertVal) postStory.push(`전통 정취의 '${postDessertVal}'`);
      claimText += postStory.length > 0 ? postStory.join(", ") + " 등을 매칭하여 소화 흡수를 촉진하고 전신 심신을 편안히 가라앉히며(안신) 완벽한 식사 여정을 매듭짓습니다.\n\n" : "입가심 및 후식 차로 속을 편안하게 덮어 마감합니다.\n\n";
      
      claimText += `이 3단계 코스 요리는 성미학적 [${mainNature}] 기질을 지니며, 신체 표준 7축 반응 중 [${mainAxis}] 계열의 생리 지표를 강화하여 프리미엄 코스 파인 다이닝 및 헬스케어 한정식 시장에서 독보적인 기획력을 자랑할 것입니다.`;
    } else {
      claimText = `[Nuri Lab R&D 보양 메뉴 마케팅 컨셉]\n\n`;
      if (dishCategoryVal === "국물_메인") {
        claimText += `본 메뉴는 단순한 보조 국물이 아닌, 든든한 식사로서의 한 끼 중심이 되는 [${dishCategoryName}] 전문 보양식 요리로 기획되었습니다.\n\n`;
      } else if (dishCategoryVal === "주식_복합") {
        claimText += `본 메뉴는 백미 위주의 평범한 식단을 넘어 다양한 천연 원물과 약재를 과학적으로 융합한 프리미엄 [${dishCategoryName}]으로 설계되었습니다.\n\n`;
      } else {
        claimText += `본 메뉴는 한방 성미학적 [${mainNature}] 기운과 현대 영양 생리학을 융합하여 설계된 [${dishCategoryName}] 카테고리의 전문 약선식입니다.\n\n`;
      }
      claimText += `- 주식/메인주재료(군약)인 '${gunItem.name}'의 고유 효능을 중심 뼈대로 구축하고, `;
      
      if (sinItem) {
        claimText += `주요 부재료(신약)인 '${sinItem.name}'을 배합하여 맛과 보조 약리 작용을 조화롭게 이끌어냈습니다. `;
      }
      
      if (jwaItem || saItem) {
        claimText += `또한, `;
        if (jwaItem) claimText += `약성보강 약재(좌약)인 '${jwaItem.name}'으로 보양 효과를 배가하고, `;
        if (saItem) claimText += `조미/향료/양념(사약)인 '${saItem.name}'을 써서 약성의 조화로운 섭취와 기미의 균형을 완성했습니다.`;
      }

      claimText += `\n\n이로써 전통 배합 비율을 준수하고 현대 과학의 [${mainAxis}] 활성 지표를 극대화한 기능성 처방 설계가 완성되었습니다.\n`;
      claimText += `프랜차이즈 가맹점이나 프리미엄 밀키트 시장에서 "식재료의 약성과 기미귀경을 극대화하여 몸의 [${mainAxis}] 작용을 돕는 현대인 맞춤형 [${dishCategoryName}]"이란 스토리로 상업화와 브랜딩 마케팅을 전개하기에 적합합니다.`;
    }

    marketingBox.innerText = claimText;
  }
}

// 마케팅 문구 복사
function copyMarketingClaim() {
  const text = document.getElementById('rnd-marketing-output').innerText;
  if (text.includes("자동으로 조립됩니다")) {
    alert("먼저 배합을 완성해주세요.");
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    alert("성공: 창업용 마케팅 컨셉 문구가 클립보드에 복사되었습니다.");
  });
}

// R&D 배합 데이터 파일 내보내기
function exportRndData(format) {
  if (rndIngredients.length === 0) {
    alert("내보낼 배합 데이터가 존재하지 않습니다.");
    return;
  }

  let text = "";
  if (format === 'json') {
    const exportObj = {
      formula_name: "Yakseon R&D Custom Menu",
      batch_multiplier: batchMultiplier,
      total_cost: document.getElementById('rnd-total-cost').innerText + "원",
      ingredients: rndIngredients.map(i => ({
        name: i.name,
        role: i.role,
        weight_1x: i.weight + "g",
        weight_scaled: (i.weight * batchMultiplier) + "g",
        unit_cost: i.cost + "원/g"
      })),
      marketing_claim: document.getElementById('rnd-marketing-output').innerText
    };
    text = JSON.stringify(exportObj, null, 2);
  } else {
    // CSV
    text = "\ufeff원재료명,역할,1인분중량(g),총배합중량(g),단가 메모(원/g),배율\n";
    rndIngredients.forEach(i => {
      text += `"${i.name}","${i.role}","${i.weight}","${i.weight * batchMultiplier}","${i.cost}","${batchMultiplier}x"\n`;
    });
  }

  const blob = new Blob([text], { type: format === 'json' ? 'application/json' : 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `yakseon_rnd_export.${format}`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ─── Classical Sources Guide Modal ──────────────────────────────
function showGuide(type) {
  const titleEl = document.getElementById('guide-modal-title');
  const bodyEl = document.getElementById('guide-modal-body');
  
  if (!titleEl || !bodyEl) return;
  
  const lang = currentLanguage;
  const t = (key) => getTranslation(key, lang);
  const ui = (key) => getShopTxt(key, lang);
  
  let title = "";
  let html = "";
  
  if (type === 'diet-eval') {
    const currentUser = JSON.parse(localStorage.getItem('nuri_current_subscriber') || 'null');
    const userConstitution = currentUser ? currentUser.constitution : '미지정';
    const userName = currentUser ? currentUser.name : '방문자';
    const userConcern = currentUser ? currentUser.concern : '건강 증진';
    
    let constitutionAdvice = "";
    if (userConstitution === '소음인') {
      const advice = {
        ko: "비위가 차고 소화 기능이 약해지기 쉬우므로 따뜻한 성질의 인삼, 대추, 황기, 생강 등을 식단에 적극 활용하여 온열 조율과 보기 작용을 강화해야 합니다. 찬 성질의 밀가루나 날음식은 멀리하는 것이 좋습니다.",
        en: "Since your digestion is naturally cool and delicate, you should actively integrate warm botanicals like Ginseng, Jujube, Astragalus, and Ginger into your diet to enhance metabolic warmth. Avoid cold foods or uncooked grains.",
        ja: "胃腸が冷えやすく消化機能が低下しやすいため、温性の人参、ナツメ、黄耆、生姜などを食生活に積極的に取り入れ、温熱調整と補気作用を強化してください。冷性の小麦粉や生ものは避けるのが良いでしょう。",
        ar: "نظرًا لأن عملية الهضم لديك باردة وحساسة بطبيعتها، يجب عليك دمج النباتات الدافئة مثل الجينسينغ والعناب والقتاد والزنجبيل بنشاط في نظامك الغذائي لتعزيز الدفء الأيضي. تجنب الأطعمة الباردة أو الحبوب غير المطبوخة."
      };
      constitutionAdvice = advice[lang] || advice.ko;
    } else if (userConstitution === '소양인') {
      const advice = {
        ko: "체내에 속열이 쌓이기 쉽고 신장 기능이 약해지기 쉬우므로, 서늘한 성질의 보리, 녹차, 구기자, 미꾸라지 등을 섭취하여 열을 내리고 음분을 보강해 주는 것이 이롭습니다. 매운 고추장이나 닭고기 등 뜨거운 성질의 과다 섭취는 피하는 것이 좋습니다.",
        en: "Since you tend to accumulate internal heat and have weaker kidney channels, it is beneficial to consume cooling ingredients like Barley, Green Tea, and Goji Berries to clear heat and nourish yin. Avoid excess spicy gochujang or hot chicken.",
        ja: "体内に熱がこもりやすく腎機能が低下しやすいため、涼性の麦、緑茶、クコの実などを摂取して熱を下げ、陰分を補うのが良いでしょう。辛いコチュジャンや鶏肉など温性の過剰摂取は避けることをお勧めします。",
        ar: "نظرًا لأنك تميل إلى تجميع الحرارة الداخلية ولديك قنوات كلى أضعف، فمن المفيد تناول المكونات المبردة مثل الشعير والشاي الأخضر وتوت غوجي لتصفية الحرارة وتغذية الين. تجنب تناول الغوتشوجانغ الحار أو الدجاج الساخن."
      };
      constitutionAdvice = advice[lang] || advice.ko;
    } else if (userConstitution === '태음인') {
      const advice = {
        ko: "호흡기 및 폐 기능이 다소 약하며 체내에 노폐물(습담)이 정체되기 쉬운 체질입니다. 맥문동, 오미자, 율무, 도라지 등을 섭취하여 폐를 윤택하게 하고 수분 대사를 원활하게 해 주어 노폐물 배출을 촉진하는 식단이 권장됩니다.",
        en: "You naturally have weaker respiratory channels and are prone to fluid retention (dampness). Ingredients like Liriope, Omija, Coix Seed, and Bellflower root are recommended to moisten the lungs and support waste elimination.",
        ja: "呼吸器や肺機能がやや弱く、体内に老廃物（湿痰）が滞りやすい体質です。麦門冬、五味子、ハトムギ、キキョウなどを摂取して肺を潤し、水分代謝を円滑にして老廃物の排出を促す食事が推奨されます。",
        ar: "لديك قنوات تنفسية أضعف بشكل طبيعي وأنت عرضة لاحتباس السوائل. يوصى بمكونات مثل الليريوب والأوميزا وبذور كواكس وجذر زهرة الجرس لترطيب الرئتين ودعم التخلص من الفضلات."
      };
      constitutionAdvice = advice[lang] || advice.ko;
    } else if (userConstitution === '태양인') {
      const advice = {
        ko: "간 기능이 부족하고 기운이 상부로 솟구치기 쉬운 기질입니다. 기운을 아래로 내리고 간을 보해주는 오가피, 모과, 메밀, 겨우살이(상기생) 등을 위주로 담백하고 부드러운 식단을 구성하시는 것이 건강 유지에 필수적입니다.",
        en: "You have weak liver channels and tend to experience rising qi (hyperactivity). It is essential to choose clean, light foods like Siberian Ginseng, Quince, Buckwheat, and Mistletoe to descend qi and nourish liver.",
        ja: "肝機能が不足し、気の上昇（のぼせ）が起こりやすい性質です。気を下ろし肝を補う五加皮、カリン、そば、ヤドリギなどを中心に、淡白で消化しやすい食事を構成することが健康維持に不可欠です。",
        ar: "لديك قنوات كبد ضعيفة وتميل إلى تجربة تشي الصاعد. من الضروري اختيار أطعمة نظيفة وخفيفة مثل جينسينغ سيبيريا والسفرجل والحنطة السوداء ودبق الطفيل لتنزيل تشي وتغذية الكبد."
      };
      constitutionAdvice = advice[lang] || advice.ko;
    } else {
      const advice = {
        ko: "신체의 전반적인 기혈 순환과 소화 기능 밸런스를 고르게 유지하기 위해 계절 제철 약선 식재료를 골고루 섭취하시길 권장합니다.",
        en: "To maintain overall balance of qi, blood circulation, and digestive health, we recommend consuming a diverse range of seasonal herbal wellness ingredients.",
        ja: "身体の全般的な気血循環と消化機能のバランスを均等に維持するため、季節ごとの旬の薬膳食材をバランスよく摂取することをお勧めします。",
        ar: "للحفاظ على التوازن العام للدورة الدموية والدم وصحة الجهاز الهضمي، نوصي بتناول مجموعة متنوعة من المكونات العشبية الموسمية."
      };
      constitutionAdvice = advice[lang] || advice.ko;
    }
    
    const labelCardTitle = { ko: "가입자 식생활 및 사상 체질 평가서", en: "Subscriber Diet & Sasang Constitution Report", ja: "購読者食生活＆四象体質評価書", ar: "تقرير النظام الغذائي ودستور ساسانغ للمشترك" };
    const labelPass = { ko: "Nuri Lab Wellness Pass Info", en: "Nuri Lab Wellness Pass Info", ja: "Nuri Lab Wellness Pass Info", ar: "معلومات بطاقة عافية نوري لاب" };
    const labelName = { ko: "회원님", en: "", ja: "様", ar: "المشترك" };
    const labelConstitution = { ko: "사상 체질", en: "Sasang Constitution", ja: "四象体質", ar: "دستور ساسانغ الجسدي" };
    const labelConcern = { ko: "주요 관심사", en: "Main Concern", ja: "主な関心事", ar: "الاهتمام الرئيسي" };
    const labelGuideHeader = { ko: "사상의학 섭식 처방 가이드", en: "Sasang Medicine Dietary Prescription Guide", ja: "四象医学の摂食処方ガイド", ar: "دليل الوصفات الغذائية لطب ساسانغ" };

    title = labelCardTitle[lang] || labelCardTitle.ko;
    html = `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <div style="background:linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(245,158,11,0.08) 100%); border:1px solid var(--primary); border-radius:12px; padding:15px; display:flex; flex-direction:column; gap:6px;">
          <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase;">${labelPass[lang] || labelPass.ko}</div>
          <div style="font-size:1.25rem; font-weight:800; color:#fff;">${lang === 'en' ? 'Member ' : ''}${userName}${labelName[lang] || labelName.ko}</div>
          <div style="font-size:0.88rem; color:var(--primary); font-weight:700;"><i class="fa-solid fa-yin-yang"></i> ${labelConstitution[lang] || labelConstitution.ko}: <span style="font-size:1rem; text-decoration:underline;">${t(userConstitution)}</span></div>
          <div style="font-size:0.82rem; color:var(--text-secondary);"><i class="fa-solid fa-circle-info"></i> ${labelConcern[lang] || labelConcern.ko}: ${t(userConcern)}</div>
        </div>
        <div>
          <h4 style="color:var(--primary); margin:0 0 6px 0; font-size:0.95rem;"><i class="fa-solid fa-notes-medical"></i> ${labelGuideHeader[lang] || labelGuideHeader.ko}</h4>
          <p style="margin:0; text-align:justify; color:var(--text-main); font-size:0.88rem; line-height:1.6;">
            ${constitutionAdvice}
          </p>
        </div>
      </div>
    `;
  } else {
    // Look up static translations
    const guide = guideI18n[type];
    if (guide) {
      title = guide.title[lang] || guide.title.ko;
      html = guide.html[lang] || guide.html.ko;
    }
  }
  
  titleEl.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${title}`;
  bodyEl.innerHTML = html;
  
  const modal = document.getElementById('guide-modal');
  if (modal) modal.classList.add('open');
}

function triggerRdaAction(action) {
  if (['microbes', 'afaci', 'sikpumbogam', 'monthly-ing', 'sauce'].includes(action)) {
    showGuide(action);
    return;
  }
  
  switch (action) {
    case 'local-food':
      switchTab('tab-recipes-wiki');
      const searchInput1 = document.getElementById('recipes-wiki-search');
      if (searchInput1) {
        searchInput1.value = '전통';
        searchInput1.dispatchEvent(new Event('input'));
      }
      break;
    case 'jongga':
      switchTab('tab-recipes-wiki');
      const searchInput2 = document.getElementById('recipes-wiki-search');
      if (searchInput2) {
        searchInput2.value = '종가';
        searchInput2.dispatchEvent(new Event('input'));
      }
      break;
    case 'kimchi':
      switchTab('tab-recipes-wiki');
      const searchInput3 = document.getElementById('recipes-wiki-search');
      if (searchInput3) {
        searchInput3.value = '김치';
        searchInput3.dispatchEvent(new Event('input'));
      }
      break;
    case 'liquor':
      switchTab('tab-shop');
      const shopPills = document.querySelectorAll('.shop-filter-pill');
      let liquorPill = null;
      shopPills.forEach(p => {
        if (p.getAttribute('data-cat') === 'yakseon-liquor') {
          liquorPill = p;
        }
      });
      setShopCategory(liquorPill, 'yakseon-liquor');
      break;
    case 'standard-db':
      switchTab('tab-browser');
      break;
    case 'bioactive':
      switchTab('tab-browser');
      const browserInput1 = document.getElementById('browser-search-input');
      if (browserInput1) {
        browserInput1.value = '사포닌';
        browserInput1.dispatchEvent(new Event('input'));
      }
      break;
    case 'benefits':
      switchTab('tab-browser');
      const browserInput2 = document.getElementById('browser-search-input');
      if (browserInput2) {
        browserInput2.value = '보기';
        browserInput2.dispatchEvent(new Event('input'));
      }
      break;
    case 'diet-eval':
      showGuide('diet-eval');
      break;
    case 'menugen':
      switchTab('tab-recipes-rnd');
      break;
    case 'custom-diet':
      switchTab('tab-recipes-wiki');
      break;
  }
}
window.triggerRdaAction = triggerRdaAction;
window.showGuide = showGuide;

function closeGuideModal() {
  const modal = document.getElementById('guide-modal');
  if (modal) {
    modal.classList.remove('open');
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── MILA 프리미엄 숍 MODULE ────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

let shopCart = [];
let shopCurrentCategory = 'all';

const SHOP_PRODUCTS = [
  // ── 전통 주류 ──
  {
    id:'liq-01', category:'yakseon-liquor', categoryLabel:'전통 약선 주류', emoji:'🍶',
    name:'오미자 수제 정제 막걸리', subname:'Five-Berry Premium Makgeolli',
    desc:'강원도 산기슭 청정 오미자를 직접 누룩에 발효하여 빚은 프리미엄 탁주. 부드러운 산미와 깊은 단맛이 균형을 이루는 웰니스 막걸리.',
    price:16000, unit:'750ml / 1병',
    constitution:['소음인','태음인'], constitutionLabel:'Warm — 소음인·태음인 체질 시너지', constitutionType:'warm',
    badge:'수제 발효', stock:48,
    image:'omija_makgeolli.png',
    nutrition: { serving: '100ml당', energy: '110 kcal', carbs: '12g', protein: '1.5g', fat: '0g', sodium: '5.0mg' },
    rdLinkage: { functions: ['SF016 진액생성 (오미자)', 'SF020 순환개선 (전통발효)'], axes: ['안정', '순환'] },
    brewingGuide: '차갑게 보관 후 가볍게 흔들어 잔에 따라 음용하십시오. (음용 권장 온도: 4~6℃)',
    warning: '알코올 도수 8% 제품으로 과도한 음용을 피하고, 임산부 및 미성년자는 섭취할 수 없습니다.',
    priceRationale: {
      ko: '인공 아스파탐과 보존료를 일절 첨가하지 않고 강원 청정 오미자와 전통 누룩만으로 빚어 수제 전통 옹기에서 발효한 소량 한정 생산 수제 탁주 공임입니다.',
      en: 'Small-batch handmade makgeolli brewed using clean Gangwon omija and traditional yeast without artificial sweeteners or preservatives.'
    }
  },
  {
    id:'liq-02', category:'yakseon-liquor', categoryLabel:'전통 약선 주류', emoji:'🍶',
    name:'황국 전통 약주 (菊花釀)', subname:'Chrysanthemum Heritage Yakju',
    desc:'황금빛 국화꽃과 구기자를 넣어 저온 숙성한 양조식 약주. 간기능 보호와 안정 효능으로 동의보감에 수록된 처방 주류.',
    price:28000, unit:'500ml / 1병',
    constitution:['소양인','태음인'], constitutionLabel:'Cool — 소양인·태음인 체질 시너지', constitutionType:'cool',
    badge:'동의보감 처방', stock:22,
    nutrition: { serving: '100ml당', energy: '130 kcal', carbs: '8g', protein: '0.4g', fat: '0g', sodium: '3.0mg' },
    rdLinkage: { functions: ['SF024 간보호 (국화)', 'SF023 신경안정 (구기자)'], axes: ['보호', '안정'] },
    brewingGuide: '상온이나 약간 서늘하게(10℃) 한 뒤, 국화꽃의 향을 음미하며 천천히 마십니다.',
    warning: '꽃 알레르기가 있는 분은 섭취 전 성분을 확인하십시오.',
    priceRationale: {
      ko: '건재 국화가 아닌 친환경 생국화와 지리산 구기자를 침출해 6개월간 저온 청정 숙성한 비용과 엄선된 한방 약재 원가 및 맑은 여과 수공이 포함된 가격입니다.',
      en: 'Features clean organic yellow chrysanthemums and Jirisan goji berries, aged at low temperature for 6 months with hand-filtration.'
    }
  },
  {
    id:'liq-03', category:'yakseon-liquor', categoryLabel:'전통 약선 주류', emoji:'🍶',
    name:'홍삼 침출 프리미엄 소주', subname:'Red Ginseng Infused Premium Soju',
    desc:'6년근 홍삼을 45일간 순쌀 소주에 침출한 한방 기운 보양 증류주. 기력 보충 및 면역 활성화에 탁월.',
    price:38000, unit:'360ml / 1병',
    constitution:['소음인','태양인'], constitutionLabel:'Warm — 소음인·태양인 체질 시너지', constitutionType:'warm',
    badge:'6년근 홍삼', stock:15,
    nutrition: { serving: '50ml당', energy: '120 kcal', carbs: '1.2g', protein: '0g', fat: '0g', sodium: '0.5mg' },
    rdLinkage: { functions: ['SF012 보기 (원기회복)', 'SF005 면역력강화 (홍삼사포닌)'], axes: ['회복', '보호'] },
    brewingGuide: '작은 소주잔에 따라 한 번에 마시기보다 입안에 살짝 머금어 향을 느끼며 마십니다.',
    warning: '고혈압 환자나 몸에 열이 매우 많은 분은 하루 2잔 이하 섭취를 권장합니다.',
    priceRationale: {
      ko: '희석식 화학 소주가 아닌 100% 국산 증류식 순쌀 소주에 6년근 금산 풍기 홍삼을 45일간 장기 침출해 침전물 없이 청정하게 거른 정성 공임이 반영되었습니다.',
      en: 'Crafted by long-term infusing premium 6-year-old red ginseng in 100% domestic distilled rice spirit for 45 days, with zero artificial additives.'
    }
  },
  // ── 고급 쌀류 ──
  {
    id:'rice-01', category:'grain-bean', categoryLabel:'곡류 & 두류', emoji:'🌾',
    name:'오대산 유기농 백미 (특등품)', subname:'Odaesan Premium Organic White Rice',
    desc:'강원도 오대산 해발 700m 이상 청정 지역 유기농 쌀. 밥맛의 찰기와 윤기가 남다르며 소화 흡수율이 높아 약선 요리의 기본재.',
    price:24000, unit:'5kg / 1포',
    constitution:['소음인','태음인','소양인','태양인'], constitutionLabel:'전 체질 — 기본 보양 곡물', constitutionType:'neutral',
    badge:'유기농 인증', stock:80,
    nutrition: { serving: '10g (취반 전 기준)', energy: '35 kcal', carbs: '7.8g', protein: '0.6g', fat: '0.1g', sodium: '0.2mg' },
    rdLinkage: { functions: ['SF015 비위보호 (소화증진)', 'SF012 보기 (기력보강)'], axes: ['보호', '회복'] },
    brewingGuide: '깨끗이 씻은 후 물에 30분 불려 가마솥 혹은 압력솥에 밥을 지으십시오.',
    warning: '직사광선을 피하고 통풍이 잘되는 서늘한 곳이나 냉장 보관하십시오.',
    priceRationale: {
      ko: '일반 백미 대비 오대산 해발 700m 청정 구역 유기농 무농약 인증 1등급 쌀로, 농가 상생 공정 무역 기준을 적용해 원가를 1.8배 우대 수매한 고품질 쌀입니다.',
      en: 'Certified organic grade-1 rice grown above 700m altitude in Odaesan, ensuring fair trade and eco-friendly farming standards.'
    }
  },
  {
    id:'rice-02', category:'grain-bean', categoryLabel:'곡류 & 두류', emoji:'🌾',
    name:'적미·흑미 블렌드 잡곡세트', subname:'Red & Black Mixed Grain Set',
    desc:'항산화 안토시아닌이 풍부한 토종 적미와 흑미 황금 비율 혼합. 혈중 순환 개선과 진액 보충에 도움.',
    price:22000, unit:'3kg / 1세트',
    constitution:['소양인','태음인'], constitutionLabel:'Cool — 소양인·태음인 체질 시너지', constitutionType:'cool',
    badge:'토종 잡곡', stock:35,
    nutrition: { serving: '10g (취반 전 기준)', energy: '36 kcal', carbs: '7.7g', protein: '0.7g', fat: '0.2g', sodium: '0.1mg' },
    rdLinkage: { functions: ['SF020 순환개선 (안토시아닌)', 'SF016 진액생성 (영양보충)'], axes: ['순환', '정화'] },
    brewingGuide: '백미와 잡곡을 7:3의 비율로 혼합하여 밥을 지으면 찰기와 영양이 조화를 이룹니다.',
    warning: '소화력이 극도로 떨어진 소음인은 잡곡 비율을 10% 이하로 줄여 드시는 것이 좋습니다.',
    priceRationale: {
      ko: '화학 비료 없이 재배한 토종 야생 적미와 흑미 원종을 수작업으로 선별하고 안토시아닌 영양 손실을 막기 위해 저온 보관해온 명품 잡곡 가격입니다.',
      en: 'Hand-sorted native wild red and black grains harvested with zero chemical fertilizers, preserved in cold storage to maintain high anthocyanin content.'
    }
  },
  // ── 전통 수제 장류 ──
  {
    id:'paste-01', category:'paste-condiment', categoryLabel:'발효 & 조미료', emoji:'🏺',
    name:'전통 3년 숙성 된장 (옹기 항아리)', subname:'Traditional 3-Year Aged Doenjang',
    desc:'100% 국산 대두로 메주를 빚어 전통 옹기에 3년 자연 발효한 된장. 깊은 감칠맛과 풍부한 프로바이오틱스.',
    price:29000, unit:'500g / 1옹기',
    constitution:['소음인','태음인'], constitutionLabel:'Warm — 소음인·태음인 체질 시너지', constitutionType:'warm',
    badge:'3년 자연 발효', stock:30,
    nutrition: { serving: '10g 기준', energy: '15 kcal', carbs: '1.6g', protein: '1.2g', fat: '0.5g', sodium: '320mg' },
    rdLinkage: { functions: ['SF015 비위보호 (유산균)', 'SF006 항산화 (대두발효성분)'], axes: ['보호', '정화'] },
    brewingGuide: '찌개나 국을 끓일 때 불을 끄기 5분 전에 된장을 풀어 끓여야 유익균 손실을 최소화합니다.',
    warning: '염도가 있으므로 고혈압이나 신장 질환자는 과다 섭취에 주의하고 조리 시 양을 조절하십시오.',
    priceRationale: {
      ko: '수입 대두나 단기 인공 발효가 아닌, 100% 국산 대두와 신안 천일염을 사용하여 지리산 전통 옹기 항아리에서 3년간 사계절을 자연 숙성 보관한 관리 노고가 담겼습니다.',
      en: 'Naturally aged for 3 years in traditional breathable earthenware jars using 100% Korean soybeans and premium sea salt.'
    }
  },
  {
    id:'paste-02', category:'paste-condiment', categoryLabel:'발효 & 조미료', emoji:'🏺',
    name:'청양 수제 고추장 (전통 방식)', subname:'Cheongyang Hand-Made Gochujang',
    desc:'청양 고춧가루와 찹쌀 발효물로 만든 수제 고추장. 대사 활성화와 소화 촉진에 도움.',
    price:23000, unit:'500g / 1단지',
    constitution:['소음인','태양인'], constitutionLabel:'Warm — 소음인·태양인 체질 시너지', constitutionType:'warm',
    badge:'수제 전통', stock:45,
    nutrition: { serving: '10g 기준', energy: '22 kcal', carbs: '4.8g', protein: '0.6g', fat: '0.1g', sodium: '280mg' },
    rdLinkage: { functions: ['SF015 비위보호 (소화촉진)', 'SF020 순환개선 (캡사이신)'], axes: ['순환', '정화'] },
    brewingGuide: '무침 요리나 찌개 조림의 양념 베이스로 적절히 환산하여 조리에 사용하십시오.',
    warning: '위염, 위궤양이 있거나 소양인 체질 중 위열이 높은 분은 과다 섭취를 삼가십시오.',
    priceRationale: {
      ko: '방부제나 물엿을 일절 배제하고 국내산 태양초 고춧가루와 찹쌀 발효액만으로 가마솥 가열 방식으로 졸여 만든 정통 수작업 한정 고추장입니다.',
      en: 'Handmade gochujang boiled down using Cheongyang sun-dried chili powder and sticky rice ferment without any starch syrup or preservatives.'
    }
  },
  {
    id:'paste-03', category:'paste-condiment', categoryLabel:'발효 & 조미료', emoji:'🏺',
    name:'전통 조선 간장 (2년 저온 숙성)', subname:'Traditional Joseon Soy Sauce',
    desc:'콩 단일 원료로 2년 이상 자연 숙성. 나트륨 낮고 아미노산 풍부 — 혈압 조절과 신장 기능 보호.',
    price:18000, unit:'500ml / 1병',
    constitution:['소양인','태음인'], constitutionLabel:'Cool — 소양인·태음인 체질 시너지', constitutionType:'cool',
    badge:'2년 저온 숙성', stock:28,
    nutrition: { serving: '10ml 기준', energy: '6 kcal', carbs: '0.8g', protein: '0.7g', fat: '0g', sodium: '680mg' },
    rdLinkage: { functions: ['SF025 신장보호 (체액조절)', 'SF020 순환개선 (혈행안정)'], axes: ['보호', '순환'] },
    brewingGuide: '국물 요리의 간을 맞추거나 나물 무침의 밑간용 조미료로 극소량 사용합니다.',
    warning: '나트륨 함량이 높으므로 1회 조리 시 15ml(1큰술) 이내 사용을 권장합니다.',
    priceRationale: {
      ko: '공장제 혼합 간장이 아닌 메주에서 직접 내린 간장 원액으로, 나트륨을 낮추는 전통 필터링 공정과 2년간의 저온 옹기 숙성 시간이 빚어낸 깊은 맛의 프리미엄 조미료입니다.',
      en: 'Genuine soy sauce extract naturally filtered from traditional meju blocks and aged for 2 years at low temperature with reduced sodium.'
    }
  },
  // ── 특선 약초류 ──
  {
    id:'herb-01', category:'herb-veg', categoryLabel:'약초 & 채소/버섯류', emoji:'🌿',
    name:'강원 야생 황기 (黃芪)', subname:'Premium Astragalus Root (Hwanggi)',
    desc:'해발 600m 이상 청정 지역 야생 황기. 기력 보충·면역 강화의 으뜸 약재. 삼계탕, 보양탕의 핵심 본초.',
    price:22000, unit:'100g / 건초',
    constitution:['소음인','태음인'], constitutionLabel:'Warm — 소음인·태음인 체질 시너지', constitutionType:'warm',
    badge:'야생 채취', stock:50,
    nutrition: { serving: '10g 기준', energy: '28 kcal', carbs: '6.2g', protein: '0.8g', fat: '0.1g', sodium: '1.5mg' },
    rdLinkage: { functions: ['SF012 보기 (원기충전)', 'SF005 면역력강화 (다당체)'], axes: ['회복', '보호'] },
    brewingGuide: '황기 20g에 물 1L를 붓고 약불에서 40분간 달여 차로 마시거나 삼계탕 조리 시 넣어 우려냅니다.',
    warning: '몸에 열이 많고 얼굴이 붉은 소양인 체질이나 급성 염증성 질환자는 피하시는 것이 좋습니다.',
    priceRationale: {
      ko: '일반 재배 황기가 아닌 강원도 산기슭 해발 600m 이상에서 야생 상태로 채취한 다년생 황기로, 진세노사이드 유사 유효 성분 함량이 최고 수준인 한정 약재입니다.',
      en: 'Wild-harvested hwanggi root gathered at high altitudes in Gangwon province, containing peak medicinal components compared to regular farmed roots.'
    }
  },
  {
    id:'herb-02', category:'herb-veg', categoryLabel:'약초 & 채소/버섯류', emoji:'🌿',
    name:'지리산 구기자 (枸杞子)', subname:'Jirisan Premium Goji Berry',
    desc:'지리산 청정 계곡 주변 토종 구기자. 간신 보양, 눈 기능 개선, 노화 방지에 탁월.',
    price:19000, unit:'100g / 건조',
    constitution:['소양인','태음인'], constitutionLabel:'Cool — 소양인·태음인 체질 시너지', constitutionType:'cool',
    badge:'토종 지리산', stock:60,
    nutrition: { serving: '10g 기준', energy: '32 kcal', carbs: '5.8g', protein: '1.2g', fat: '0.4g', sodium: '8.2mg' },
    rdLinkage: { functions: ['SF025 신장보호 (정액보충)', 'SF024 간보호 (피로회복)'], axes: ['보호', '회복'] },
    brewingGuide: '물 1L에 가볍게 볶은 구기자 15g을 넣고 30분간 끓여 식후 차로 음용하십시오.',
    warning: '대변이 묽거나 설사가 잦은 분은 구기자의 서늘한 성질로 인해 설사가 심해질 수 있습니다.',
    priceRationale: {
      ko: '지리산 산간 청정 지대에서 농약 없이 수작업으로 채취하여 색소나 화학 보존제를 사용하지 않고 태양광으로 저온 건조하여 영양을 살린 지리산 특산품입니다.',
      en: 'Pesticide-free wild goji berries hand-picked in Jirisan valleys and low-temperature sun-dried without any coloring or chemicals.'
    }
  },
  // ── 국산 차류 ──
  {
    id:'tea-01', category:'tea-drink', categoryLabel:'전통차 & 음료류', emoji:'🍵',
    name:'보성 야생 녹차 (우전 등급)', subname:'Boseong Wild Green Tea — Ujeon Grade',
    desc:'전남 보성 첫물 찻잎 4월 우전 등급. 카테킨과 테아닌 함량 최고치 — 항산화와 정신 집중력 강화에 최적.',
    price:38000, unit:'50g / 금속 캔',
    constitution:['소양인','태양인'], constitutionLabel:'Cool — 소양인·태양인 체질 시너지', constitutionType:'cool',
    badge:'우전 1등급', stock:20,
    nutrition: { serving: '2g (1회 우림 기준)', energy: '1 kcal', carbs: '0.2g', protein: '0.1g', fat: '0g', sodium: '0.0mg' },
    rdLinkage: { functions: ['SF006 항산화 (카테킨)', 'SF023 신경안정 (테아닌)'], axes: ['정화', '안정'] },
    brewingGuide: '70~80℃로 식힌 따뜻한 물 150ml에 녹찻잎 2g을 넣고 1분 30초간 우려내어 음용합니다.',
    warning: '카페인 성분이 들어있으므로 불면증이 있거나 카페인에 예민한 분은 늦은 저녁 음용을 피하십시오.',
    priceRationale: {
      ko: '일반 세작이나 대작이 아닌, 4월 20일 절기 곡우 전에 손으로 한 잎씩 채취해 가마솥에서 덖어낸 최상위 등급 우전(雨前) 100% 수제 어린 잎 차입니다.',
      en: '100% hand-picked first-flush baby tea leaves harvested before the spring rain (Ujeon grade) and roasted manually in iron cauldrons.'
    }
  },
  {
    id:'tea-02', category:'tea-drink', categoryLabel:'전통차 & 음료류', emoji:'🍵',
    name:'황차 (黃茶) — 구증구포 제다', subname:'Korean Yellow Tea — 9x Steamed',
    desc:'전통 구증구포 방식으로 만든 황차. 소화 촉진과 혈당 조절, 위장 안정에 탁월.',
    price:45000, unit:'50g / 전통 포장',
    constitution:['소음인','태음인'], constitutionLabel:'Warm — 소음인·태음인 체질 시너지', constitutionType:'warm',
    badge:'구증구포', stock:18,
    nutrition: { serving: '2g (1회 우림 기준)', energy: '2 kcal', carbs: '0.3g', protein: '0.1g', fat: '0g', sodium: '0.0mg' },
    rdLinkage: { functions: ['SF015 비위보호 (소화안정)', 'SF020 순환개선 (혈당조절)'], axes: ['보호', '순환'] },
    brewingGuide: '85~90℃의 뜨거운 물 200ml에 황차 2.5g을 넣고 2분간 우려 마십니다. 여러 번 재우림이 가능합니다.',
    warning: '공복에 너무 많이 마시면 속이 쓰릴 수 있으니 식후 30분에 마시는 것을 권장합니다.',
    priceRationale: {
      ko: '한 번에 덖지 않고 증기로 아홉 번 찌고 아홉 번 볕에 말리는 전통 구증구포(九蒸九曝) 공정을 거쳐 카페인을 낮추고 효소 발효 맛을 극대화한 명품 황차입니다.',
      en: 'Exquisite fermented yellow tea crafted through the traditional nine-times-steamed and nine-times-dried process to reduce caffeine.'
    }
  },
  // ── 허브·꽃차 ──
  {
    id:'htea-01', category:'tea-drink', categoryLabel:'전통차 & 음료류', emoji:'🌸',
    name:'한라산 야생 민들레 꽃차', subname:'Hallasan Wild Dandelion Flower Tea',
    desc:'청정 한라산 야생 민들레를 손으로 채취하여 저온 건조한 꽃차. 간열 해소, 이뇨 작용, 소화 개선.',
    price:15000, unit:'30g / 한지 포장',
    constitution:['소양인','태양인'], constitutionLabel:'Cool — 소양인·태양인 체질 시너지', constitutionType:'cool',
    badge:'한라산 야생', stock:40,
    nutrition: { serving: '2g (1회 우림 기준)', energy: '1 kcal', carbs: '0.2g', protein: '0.0g', fat: '0.0g', sodium: '0.1mg' },
    rdLinkage: { functions: ['SF024 간보호 (열독제거)', 'SF015 비위보호 (소염작용)'], axes: ['보호', '정화'] },
    brewingGuide: '100℃의 끓는 물 150ml에 건조 꽃송이 2~3개를 띄우고 꽃이 활짝 피어날 때(3분)까지 우려 마십니다.',
    warning: '차가운 성질이 강하므로 아랫배가 차거나 위장이 얇아 설사가 잦은 분은 장복을 피하십시오.',
    priceRationale: {
      ko: '오염 물질 없는 제주 한라산 중산간 지역의 깨끗한 야생 민들레 꽃송이만 엄선해 세척 후 이중 저온 건조하여 꽃 본연의 색과 비타민을 보존한 한정 수제 꽃차입니다.',
      en: 'Eco-friendly wild dandelion blossoms hand-harvested in Hallasan clean mid-mountain fields and dried at low temperatures.'
    }
  },
  {
    id:'htea-02', category:'tea-drink', categoryLabel:'전통차 & 음료류', emoji:'🌸',
    name:'제주 한방 쑥차 (삼년쑥)', subname:'Jeju 3-Year Aged Mugwort Tea',
    desc:'3년간 저장 숙성한 제주 쑥으로 만든 따뜻한 쑥차. 냉체질 개선, 위장 온열, 여성 생리 불순 완화.',
    price:14000, unit:'30g / 한지 포장',
    constitution:['소음인','태음인'], constitutionLabel:'Warm — 소음인·태음인 체질 시너지', constitutionType:'warm',
    badge:'3년 숙성', stock:55,
    nutrition: { serving: '2g (1회 우림 기준)', energy: '2 kcal', carbs: '0.4g', protein: '0.1g', fat: '0g', sodium: '0.2mg' },
    rdLinkage: { functions: ['SF020 순환개선 (온열활혈)', 'SF015 비위보호 (위장온난)'], axes: ['순환', '회복'] },
    brewingGuide: '90℃ 온수 200ml에 건조 쑥잎 2g을 넣고 2분간 우려냅니다. 은은한 쑥 향과 쌉싸름한 맛이 특징입니다.',
    warning: '체내에 열이 가득 차 마른기침을 하거나 얼굴 홍조가 심한 분은 주의하여 음용하십시오.',
    priceRationale: {
      ko: '해풍을 맞아 자란 제주 삼년쑥을 바닷바람에 3년간 자연 건조 숙성하여 강한 자극성 향을 없애고 위장을 따뜻하게 하는 온열 효능을 정제한 명품 한방 쑥차입니다.',
      en: 'Formulated with ocean-breeze-aged mugwort stored for 3 years to mellow its aroma and enrich its warming properties.'
    }
  },
  // ── 간편 영양식 ──
  {
    id:'nutr-01', category:'prepared-meal', categoryLabel:'약선 조리식품', emoji:'🥗',
    name:'약선 조식 영양 죽 세트 (5종)', subname:'Medicinal Morning Porridge Set',
    desc:'흑임자죽, 잣죽, 호박죽, 단호박죽, 팥죽 — 아침을 대신하는 프리미엄 약선 죽 5종 세트.',
    price:32000, unit:'5종 × 2인분',
    constitution:['소음인','태음인'], constitutionLabel:'Warm — 소음인·태음인 체질 시너지', constitutionType:'warm',
    badge:'조식 대용', stock:38,
    nutrition: { serving: '1팩 (150g 기준)', energy: '125 kcal', carbs: '25g', protein: '4.2g', fat: '1.1g', sodium: '180mg' },
    rdLinkage: { functions: ['SF015 비위보호 (장내안정)', 'SF012 보기 (기력충전)'], axes: ['보호', '회복'] },
    brewingGuide: '팩 그대로 끓는 물에 5분간 중탕하거나, 전자레인지 용기에 덜어 2분간 데워 따뜻하게 섭취하십시오.',
    warning: '전자레인지 조리 시 봉지째 직접 가열하지 마시고 반드시 전용 용기에 덜어 조리하십시오.',
    priceRationale: {
      ko: '정제 백설탕과 화학 합성 조미료를 일절 쓰지 않고 국산 잣, 단호박, 팥, 찹쌀 등 100% 친환경 농산물 원료와 한방 성미 배합을 완비한 5가지 프리미엄 건강 조식 세트입니다.',
      en: 'Made with 100% local organic ingredients including pine nuts, pumpkin, and red bean, without chemical flavors or refined sugars.'
    }
  },
  {
    id:'nutr-02', category:'prepared-meal', categoryLabel:'약선 조리식품', emoji:'🥗',
    name:'독서·정신노동 집중 약선 에너지바', subname:'Cognitive Wellness Energy Bar',
    desc:'황기, 인삼, 맥문동, 오미자를 천연 견과류와 배합한 K-식물성 에너지바. 독서·정신노동 후 안정식.',
    price:22000, unit:'6개입 / 1박스',
    constitution:['소양인','소음인'], constitutionLabel:'Neutral — 소음인·소양인 체질 시너지', constitutionType:'neutral',
    badge:'집중력 증진', stock:72,
    nutrition: { serving: '1개 (35g 기준)', energy: '145 kcal', carbs: '22g', protein: '3.5g', fat: '4.8g', sodium: '45mg' },
    rdLinkage: { functions: ['SF012 보기 (원기회복)', 'SF023 신경안정 (스트레스완화)'], axes: ['회복', '안정'] },
    brewingGuide: '바쁜 일상 중 간식으로, 혹은 운동 및 정신노동 전후로 1개씩 꼭꼭 씹어서 물과 함께 섭취하십시오.',
    warning: '견과류가 함유되어 있어 견과류 알레르기가 있으신 분은 섭취에 각별한 주의가 필요합니다.',
    priceRationale: {
      ko: '저렴한 밀가루나 인공 감미료 베이스가 아닌 국산 황기, 인삼, 오미자 배합 한방 추출물과 프리미엄 잣, 아몬드를 식물성 꿀로 뭉쳐 집중력 증진 연구에 근거한 기능성 건강 간식입니다.',
      en: 'Cognitive wellness snack containing local ginseng, hwanggi, and omija extracts blended with premium nuts and organic honey.'
    }
  },
  {
    id:'herb-03', category:'herb-veg', categoryLabel:'약초 & 채소/버섯류', emoji:'🍄',
    name:'친환경 건조 흰목이버섯 (백목이)', subname:'Organic Dried Tremella Mushroom',
    desc:'피부 수분 공급과 콜라겐 합성을 돕는 한방 미용의 핵심 흰목이버섯. 팩 조리 및 약선 요리용.',
    price:13000, unit:'80g / 건조',
    constitution:['소음인','소양인','태음인','태양인'], constitutionLabel:'전 체질 — 보습·미용 요재', constitutionType:'neutral',
    badge:'무농약 인증', stock:40,
    nutrition: { serving: '10g 기준', energy: '18 kcal', carbs: '4.2g', protein: '1.2g', fat: '0.1g', sodium: '2.0mg' },
    rdLinkage: { functions: ['SF016 진액생성 (보습)', 'SF006 항산화 (콜라겐보호)'], axes: ['보호', '정화'] },
    priceRationale: {
      ko: '중국 수입산이 아닌 무농약 인증 국산 건조 흰목이버섯으로, 깨끗한 참나무 톱밥 배지에서 재배하여 먼지와 불순물이 없고 피부 윤기를 돕는 점액 콜가겐 함량이 매우 높습니다.',
      en: 'Organic domestic dried Tremella mushrooms cultivated on oak sawdust blocks, ensuring clean quality and rich plant-based collagen.'
    }
  },
  {
    id:'herb-04', category:'herb-veg', categoryLabel:'약초 & 채소/버섯류', emoji:'🌿',
    name:'지리산 청정 건조 맥문동 (麥門冬)', subname:'Dried Liriope Platyphylla Root',
    desc:'음기를 보하고 호흡기와 피부 기관지를 촉촉하게 적셔주는 한방 약재. 토너 우림용 및 약선차용.',
    price:18000, unit:'150g / 건초',
    constitution:['소양인','태음인'], constitutionLabel:'Cool — 소양인·태음인 체질 시너지', constitutionType:'cool',
    badge:'지리산 특산', stock:30,
    nutrition: { serving: '10g 기준', energy: '24 kcal', carbs: '5.8g', protein: '0.6g', fat: '0.0g', sodium: '1.0mg' },
    rdLinkage: { functions: ['SF016 진액생성 (피부윤택)', 'SF025 신장보호 (음액보충)'], axes: ['보호', '안정'] },
    priceRationale: {
      ko: '중심부의 심(心)을 빼서 부작용(가슴 답답함 등)을 없애는 거심(去心) 법제 작업을 100% 수작업으로 마친 지리산 자생 일등 맥문동 뿌리 건초입니다.',
      en: 'Premium dried liriope root from Jirisan, with its inner core manually removed (de-cored) to eliminate mild side effects.'
    }
  },
  {
    id:'paste-04', category:'paste-condiment', categoryLabel:'발효 & 조미료', emoji:'🫗',
    name:'영주 전통 냉압착 참깨 오일 (참기름)', subname:'Traditional Cold-Pressed Sesame Oil',
    desc:'저온 냉압착 방식으로 참깨 고유의 비타민E와 불포화지방산을 살린 100% 전통 참깨 오일. 피부 마사지 및 조리용.',
    price:22000, unit:'250ml / 1병',
    constitution:['소음인','태음인','소양인','태양인'], constitutionLabel:'전 체질 — 영양·보습 오일', constitutionType:'neutral',
    badge:'전통 압착', stock:25,
    nutrition: { serving: '5ml 기준', energy: '45 kcal', carbs: '0g', protein: '0g', fat: '5.0g', sodium: '0mg' },
    rdLinkage: { functions: ['SF020 순환개선 (비타민E)', 'SF015 비위보호 (불포화지방)'], axes: ['순환', '보호'] },
    priceRationale: {
      ko: '고온에서 볶아 벤조피렌 발암물질 우려가 있는 시중 일반 참기름과 달리, 볶지 않고 저온에서 수차례 정밀 냉압착하여 참깨 씨앗 본연의 토코페롤 항산화 성분을 보존한 피부 마사지 겸용 명품 참깨 오일입니다.',
      en: 'Unroasted, low-temperature cold-pressed sesame oil containing high concentrations of natural tocopherols, suitable for cosmetic use.'
    }
  },
  {
    id:'paste-05', category:'paste-condiment', categoryLabel:'발효 & 조미료', emoji:'🧴',
    name:'제주 청정 냉압착 동백 씨앗 오일', subname:'Jeju Cold-Pressed Camellia Seed Oil',
    desc:'제주 야생 동백 씨앗을 냉압착하여 추출한 피부 장벽 강화용 멀티 오일. 페이셜 오일 및 헤어 보습용.',
    price:26000, unit:'50ml / 1스포이드병',
    constitution:['소음인','소양인','태음인','태양인'], constitutionLabel:'전 체질 — 천연 보습막', constitutionType:'neutral',
    badge:'100% 천연오일', stock:18,
    nutrition: { serving: '1회 도포(1ml) 기준', energy: '8 kcal', carbs: '0g', protein: '0g', fat: '0.9g', sodium: '0mg' },
    rdLinkage: { functions: ['SF006 항산화 (올레인산)', 'SF016 진액생성 (보습막형성)'], axes: ['보호', '정화'] },
    priceRationale: {
      ko: '제주 야생 동백나무 숲에서 떨어진 완숙 씨앗을 손으로 주워 모아 화학 정제 과정 없이 순수 압착 및 필터링만 거쳐 올레인산 함량이 85% 이상인 천연 100% 무독성 피부 영양 오일입니다.',
      en: '100% cold-pressed organic camellia seed oil harvested in Jeju wild forests, containing over 85% oleic acid for skin barrier reinforcement.'
    }
  },
  {
    id:'herb-05', category:'herb-veg', categoryLabel:'약초 & 채소/버섯류', emoji:'🌿',
    name:'경북 영주 야생 건조 당귀 (當歸)', subname:'Premium Dried Angelica Root',
    desc:'여성 건강과 혈액 순환, 피부 안색 개선에 으뜸인 전통 당귀 뿌리 건초. 보혈 및 한방 팩 베이스용.',
    price:19000, unit:'120g / 건초',
    constitution:['소음인','태음인'], constitutionLabel:'Warm — 소음인·태음인 체질 시너지', constitutionType:'warm',
    badge:'100% 국산', stock:35,
    nutrition: { serving: '10g 기준', energy: '30 kcal', carbs: '6.5g', protein: '0.8g', fat: '0.2g', sodium: '1.2mg' },
    rdLinkage: { functions: ['SF012 보기 (혈행개선)', 'SF020 순환개선 (안색개선)'], axes: ['회복', '순환'] },
    priceRationale: {
      ko: '중국산 및 수경재배 품종과 비교하여 유효성분인 데쿠르신(Decursin) 함량이 최대 5배 이상 높은 경북 영주산 3년근 야생 참당귀를 자연 건조한 한정 본초입니다.',
      en: 'Certified domestic Angelica gigas root containing high decursin content for improving blood circulation and skin tone.'
    }
  },
  {
    id:'herb-06', category:'herb-veg', categoryLabel:'약초 & 채소/버섯류', emoji:'🍒',
    name:'경산 황토대추 (특초 등급 건대추)', subname:'Gyeongsan Premium Dried Jujube (Daechu)',
    desc:'경산 황토에서 자란 달콤하고 살이 오른 특급 건대추. 비위 기력 보강 및 독성 중화용 기본 본초.',
    price:12000, unit:'200g / 1팩',
    constitution:['소음인','태음인','소양인','태양인'], constitutionLabel:'전 체질 — 조화·보혈 필수곡', constitutionType:'neutral',
    badge:'무농약 대추', stock:50,
    nutrition: { serving: '10g 기준', energy: '26 kcal', carbs: '6.4g', protein: '0.4g', fat: '0.1g', sodium: '0.8mg' },
    rdLinkage: { functions: ['SF015 비위보호 (소화보조)', 'SF012 보기 (기혈보충)'], axes: ['보호', '회복'] },
    priceRationale: {
      ko: '경산 황토림에서 수확한 무농약 인증 대추 중 크기가 가장 굵고 당도가 우수한 특초 등급만을 선별해 자연 통풍 건조하여 비타민 함량과 단맛을 최고조로 끌어올린 건대추입니다.',
      en: 'Highest-grade dried red dates grown in rich loess soil, containing premium vitamin C and natural sweetness without preservatives.'
    }
  }
]

function setShopCategory(btn, cat) {
  shopCurrentCategory = cat;
  document.querySelectorAll('.shop-filter-pill').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderShopProducts();
}

function filterShopProducts(keyword) {
  const input = document.getElementById('shop-search-input');
  if (input) {
    input.value = keyword;
  }
  renderShopProducts();
}
window.filterShopProducts = filterShopProducts;

function renderShopProducts() {
  const grid = document.getElementById('shop-product-grid');
  if (!grid) return;

  const currentUser = JSON.parse(localStorage.getItem('nuri_current_subscriber') || 'null');
  const userConstitution = currentUser ? currentUser.constitution : null;
  const filterActive = document.getElementById('constitution-filter-toggle') ? document.getElementById('constitution-filter-toggle').checked : false;
  const isMember = !!currentUser;

  const toggleWrap = document.getElementById('constitution-toggle-wrap');
  if (toggleWrap) {
    toggleWrap.style.display = (userConstitution && userConstitution !== '일반') ? 'flex' : 'none';
  }

  let products = SHOP_PRODUCTS;

  // Category filter
  if (shopCurrentCategory !== 'all') {
    products = products.filter(p => p.category === shopCurrentCategory);
  }

  // Constitution filter
  if (filterActive && userConstitution && userConstitution !== '일반') {
    products = products.filter(p => p.constitution.includes(userConstitution));
  }

  // Search filter
  const searchInput = document.getElementById('shop-search-input');
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  if (query) {
    products = products.filter(p => {
      const nameMatch = p.name && p.name.toLowerCase().includes(query);
      const subnameMatch = p.subname && p.subname.toLowerCase().includes(query);
      const descMatch = p.desc && p.desc.toLowerCase().includes(query);
      const rdMatch = p.rdLinkage && p.rdLinkage.functions && p.rdLinkage.functions.some(f => f.toLowerCase().includes(query));
      return nameMatch || subnameMatch || descMatch || rdMatch;
    });
  }

  if (products.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted);"><i class="fa-solid fa-box-open" style="font-size:3rem;margin-bottom:16px;display:block;opacity:0.4;"></i><p>' + getTranslation('해당 조건의 상품이 없습니다.', currentLanguage) + '</p></div>';
    return;
  }

  grid.innerHTML = products.map(function(p) {
    const isMatch = userConstitution && userConstitution !== '일반' && p.constitution.includes(userConstitution);
    const memberPrice = isMember ? Math.round(p.price * 0.9) : p.price;
    const inCart = shopCart.find(c => c.product.id === p.id);
    const cartQty = inCart ? inCart.qty : 0;

    const constitutionBadgeHtml = isMatch
      ? '<span class="shop-constitution-badge ' + p.constitutionType + '"><i class="fa-solid fa-yin-yang"></i> ' + getTranslation(p.constitutionLabel, currentLanguage) + '</span>'
      : '';

    const priceHtml = isMember
      ? '<span class="shop-original-price">₩' + p.price.toLocaleString() + '</span><span class="shop-price">₩' + memberPrice.toLocaleString() + '</span><span class="shop-discount-badge">' + getTranslation('멤버십 10% 할인', currentLanguage) + '</span>'
      : '<span class="shop-price">₩' + memberPrice.toLocaleString() + '</span>';

    const actionHtml = cartQty > 0
      ? '<div class="shop-qty-control"><button class="qty-btn" onclick="updateCartQty(\'' + p.id + '\',' + (cartQty-1) + ')">−</button><span class="qty-display">' + cartQty + '</span><button class="qty-btn" onclick="updateCartQty(\'' + p.id + '\',' + (cartQty+1) + ')">+</button></div>'
      : '<button class="btn btn-primary shop-add-btn" onclick="addToCart(\'' + p.id + '\')"><i class="fa-solid fa-cart-plus"></i> ' + getTranslation('담기', currentLanguage) + '</button>';

    return '<div class="shop-product-card' + (isMatch ? ' constitution-match' : '') + '" onclick="openProductDetail(\'' + p.id + '\')">' +
      '<div class="shop-card-header"><span class="shop-cat-emoji">' + p.emoji + '</span>' +
      '<div class="shop-badges"><span class="shop-cat-label">' + getTranslation(p.categoryLabel, currentLanguage) + '</span><span class="shop-handmade-badge">' + getTranslation(p.badge, currentLanguage) + '</span></div>' +
      constitutionBadgeHtml + '</div>' +
      '<div class="shop-card-body"><h3 class="shop-product-name">' + getTranslation(p.name, currentLanguage) + '</h3>' +
      '<p class="shop-product-subname">' + translateTerm(p.subname, currentLanguage) + '</p>' +
      '<p class="shop-product-desc">' + getTranslation(p.desc, currentLanguage) + '</p></div>' +
      '<div class="shop-card-footer" onclick="event.stopPropagation()"><div class="shop-price-block">' + priceHtml + '<span class="shop-unit">' + getTranslation(p.unit, currentLanguage) + '</span></div>' +
      '<div class="shop-cart-action">' + actionHtml + '</div></div></div>';
  }).join('');
}

function addToCart(productId) {
  const product = SHOP_PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const existing = shopCart.find(c => c.product.id === productId);
  if (existing) { existing.qty++; } else { shopCart.push({ product: product, qty: 1 }); }
  updateCartUI();
  renderShopProducts();
  const fab = document.getElementById('cart-fab');
  if (fab) { fab.classList.add('cart-fab-pulse'); setTimeout(function(){ fab.classList.remove('cart-fab-pulse'); }, 600); }
}

function updateCartQty(productId, newQty) {
  if (newQty <= 0) {
    shopCart = shopCart.filter(c => c.product.id !== productId);
  } else {
    const item = shopCart.find(c => c.product.id === productId);
    if (item) item.qty = newQty;
  }
  updateCartUI();
  renderShopProducts();
  renderCartDrawer();
}

function updateCartUI() {
  const totalQty = shopCart.reduce(function(s, c){ return s + c.qty; }, 0);
  const badge = document.getElementById('cart-fab-badge');
  const fab = document.getElementById('cart-fab');
  if (badge) badge.textContent = totalQty;
  if (fab) fab.style.display = totalQty > 0 ? 'flex' : 'none';
  renderCartDrawer();
}

function renderCartDrawer() {
  const list = document.getElementById('cart-items-list');
  const emptyMsg = document.getElementById('cart-empty-msg');
  const footer = document.getElementById('cart-footer');
  const discountRow = document.getElementById('cart-discount-row');
  if (!list) return;
  const currentUser = JSON.parse(localStorage.getItem('nuri_current_subscriber') || 'null');
  const isMember = !!currentUser;

  if (shopCart.length === 0) {
    if (emptyMsg) emptyMsg.style.display = 'flex';
    list.innerHTML = '';
    if (footer) footer.style.display = 'none';
    return;
  }
  if (emptyMsg) emptyMsg.style.display = 'none';
  if (footer) footer.style.display = 'block';

  let subtotal = 0;
  list.innerHTML = shopCart.map(function(item) {
    const p = item.product, qty = item.qty;
    const unitPrice = isMember ? Math.round(p.price * 0.9) : p.price;
    const lineTotal = unitPrice * qty;
    subtotal += lineTotal;
    return '<div class="cart-item">' +
      '<div class="cart-item-info"><span class="cart-item-emoji">' + p.emoji + '</span>' +
      '<div><div class="cart-item-name">' + translateTerm(p.name, currentLanguage) + '</div>' +
      '<div style="font-size:0.75rem;color:var(--text-muted);">' + translateTerm(p.unit, currentLanguage) + '</div></div></div>' +
      '<div class="cart-item-controls">' +
      '<div class="shop-qty-control" style="transform:scale(0.85);">' +
      '<button class="qty-btn" onclick="updateCartQty(\'' + p.id + '\',' + (qty-1) + ')">−</button>' +
      '<span class="qty-display">' + qty + '</span>' +
      '<button class="qty-btn" onclick="updateCartQty(\'' + p.id + '\',' + (qty+1) + ')">+</button></div>' +
      '<span class="cart-item-price">₩' + lineTotal.toLocaleString() + '</span>' +
      '<button class="cart-item-remove" onclick="updateCartQty(\'' + p.id + '\',0)" title="' + getTranslation('삭제', currentLanguage) + '"><i class="fa-solid fa-xmark"></i></button>' +
      '</div></div>';
  }).join('');

  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  const discountEl = document.getElementById('cart-discount');
  if (subtotalEl) subtotalEl.textContent = '₩' + subtotal.toLocaleString();

  if (isMember) {
    const originalSubtotal = shopCart.reduce(function(s, item){ return s + item.product.price * item.qty; }, 0);
    const discount = originalSubtotal - subtotal;
    if (discountRow) discountRow.style.display = 'flex';
    if (discountEl) discountEl.textContent = '-₩' + discount.toLocaleString();
  } else {
    if (discountRow) discountRow.style.display = 'none';
  }
  if (totalEl) totalEl.textContent = '₩' + subtotal.toLocaleString();
}

function toggleCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  if (!drawer) return;
  renderCartDrawer();
  drawer.classList.toggle('open');
  if (overlay) overlay.classList.toggle('open');
  document.body.classList.toggle('drawer-open');
}

function openCheckoutModal() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  if (drawer) drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  document.body.classList.remove('drawer-open');

  const currentUser = JSON.parse(localStorage.getItem('nuri_current_subscriber') || 'null');
  const isMember = !!currentUser;
  const userName = currentUser ? currentUser.name : '';
  const userEmail = currentUser ? currentUser.email : '';

  const subtotal = shopCart.reduce(function(s, item) {
    const unitPrice = isMember ? Math.round(item.product.price * 0.9) : item.product.price;
    return s + unitPrice * item.qty;
  }, 0);

  const itemsHtml = shopCart.map(function(item) {
    const p = item.product, qty = item.qty;
    const unitPrice = isMember ? Math.round(p.price * 0.9) : p.price;
    return '<div class="checkout-item-row"><span>' + p.emoji + ' ' + translateTerm(p.name, currentLanguage) + ' × ' + qty + '</span><span>₩' + (unitPrice * qty).toLocaleString() + '</span></div>';
  }).join('');

  const memberBadgeHtml = isMember
    ? '<div class="checkout-item-row" style="color:#10b981;font-size:0.82rem;"><span><i class="fa-solid fa-tag"></i> ' + getTranslation('멤버십 10% 할인 적용', currentLanguage) + '</span><span></span></div>'
    : '';

  const body = document.getElementById('checkout-modal-body');
  body.innerHTML =
    '<div class="checkout-form">' +
    '<div class="checkout-section-title"><i class="fa-solid fa-user"></i> ' + getTranslation('주문자 정보', currentLanguage) + '</div>' +
    '<div class="checkout-grid">' +
    '<div class="control-group"><label>' + getTranslation('이름 (실명)', currentLanguage) + '</label><input type="text" id="co-name" value="' + userName + '" placeholder="' + (currentLanguage === 'ko' ? '홍길동' : 'John Doe') + '" style="width:100%;padding:10px;background:rgba(0,0,0,0.3);border:1px solid var(--border-glass);border-radius:8px;color:#fff;"></div>' +
    '<div class="control-group"><label>' + getTranslation('이메일', currentLanguage) + '</label><input type="email" id="co-email" value="' + userEmail + '" placeholder="example@gmail.com" style="width:100%;padding:10px;background:rgba(0,0,0,0.3);border:1px solid var(--border-glass);border-radius:8px;color:#fff;"></div>' +
    '</div>' +
    '<div class="checkout-section-title" style="margin-top:20px;"><i class="fa-solid fa-truck"></i> ' + getTranslation('배송 정보', currentLanguage) + '</div>' +
    '<div class="checkout-grid">' +
    '<div class="control-group" style="grid-column:span 2;"><label>' + getTranslation('수령인 이름', currentLanguage) + '</label><input type="text" id="co-receiver" value="' + userName + '" placeholder="' + getTranslation('수령인 이름', currentLanguage) + '" style="width:100%;padding:10px;background:rgba(0,0,0,0.3);border:1px solid var(--border-glass);border-radius:8px;color:#fff;"></div>' +
    '<div class="control-group" style="grid-column:span 2;"><label>' + getTranslation('연락처', currentLanguage) + '</label><input type="tel" id="co-phone" placeholder="' + (currentLanguage === 'ko' ? '010-0000-0000' : '+1-000-000-0000') + '" style="width:100%;padding:10px;background:rgba(0,0,0,0.3);border:1px solid var(--border-glass);border-radius:8px;color:#fff;"></div>' +
    '<div class="control-group" style="grid-column:span 2;"><label>' + getTranslation('배송 주소', currentLanguage) + '</label><input type="text" id="co-address" placeholder="' + (currentLanguage === 'ko' ? '서울특별시 강남구...' : '123 Main St, New York...') + '" style="width:100%;padding:10px;background:rgba(0,0,0,0.3);border:1px solid var(--border-glass);border-radius:8px;color:#fff;"></div>' +
    '<div class="control-group" style="grid-column:span 2;"><label>' + getTranslation('배송 메모 (선택)', currentLanguage) + '</label><input type="text" id="co-memo" placeholder="' + getTranslation('예: 문 앞에 놓아주세요', currentLanguage) + '" style="width:100%;padding:10px;background:rgba(0,0,0,0.3);border:1px solid var(--border-glass);border-radius:8px;color:#fff;"></div>' +
    '</div>' +
    '<div class="checkout-section-title" style="margin-top:20px;"><i class="fa-solid fa-receipt"></i> ' + getTranslation('주문 상품 확인', currentLanguage) + '</div>' +
    '<div class="checkout-order-items">' + itemsHtml + memberBadgeHtml +
    '<div class="checkout-item-row checkout-total-row"><span>' + getTranslation('최종 결제 금액', currentLanguage) + '</span><span style="font-size:1.3rem;font-weight:800;color:var(--primary);">₩' + subtotal.toLocaleString() + '</span></div>' +
    '</div>' +
    '<button class="btn btn-primary" style="width:100%;margin-top:20px;padding:15px;font-size:1.05rem;font-weight:700;" onclick="submitOrder()">' +
    '<i class="fa-solid fa-check-circle"></i> ' + getTranslation('주문 완료하기', currentLanguage) + '</button></div>';

  document.getElementById('checkout-modal').classList.add('open');
}

function closeCheckoutModal() {
  const m = document.getElementById('checkout-modal');
  if (m) m.classList.remove('open');
}

function submitOrder() {
  const name = (document.getElementById('co-name') || {}).value || '';
  const email = (document.getElementById('co-email') || {}).value || '';
  const receiver = (document.getElementById('co-receiver') || {}).value || '';
  const phone = (document.getElementById('co-phone') || {}).value || '';
  const address = (document.getElementById('co-address') || {}).value || '';

  if (!name.trim() || !email.trim() || !receiver.trim() || !phone.trim() || !address.trim()) {
    alert(getTranslation('모든 필수 항목을 입력해 주세요.', currentLanguage));
    return;
  }

  const orderNo = 'NL-' + Date.now().toString().slice(-8);
  const currentUser = JSON.parse(localStorage.getItem('nuri_current_subscriber') || 'null');
  const isMember = !!currentUser;
  const subtotal = shopCart.reduce(function(s, item) {
    const unitPrice = isMember ? Math.round(item.product.price * 0.9) : item.product.price;
    return s + unitPrice * item.qty;
  }, 0);
  const now = new Date();
  
  let locale = 'ko-KR';
  if (currentLanguage === 'en') locale = 'en-US';
  else if (currentLanguage === 'ja') locale = 'ja-JP';
  else if (currentLanguage === 'ar') locale = 'ar-EG';
  const dateStr = now.toLocaleDateString(locale, { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' });

  const itemsHtml = shopCart.map(function(item) {
    const p = item.product, qty = item.qty;
    const unitPrice = isMember ? Math.round(p.price * 0.9) : p.price;
    return '<div class="receipt-row" style="font-size:0.85rem;"><span>' + p.emoji + ' ' + translateTerm(p.name, currentLanguage) + ' × ' + qty + '</span><span>₩' + (unitPrice * qty).toLocaleString() + '</span></div>';
  }).join('');

  const memberNoteHtml = isMember
    ? '<div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);border-radius:8px;padding:10px 14px;margin-top:10px;font-size:0.82rem;color:#10b981;display:flex;align-items:center;gap:8px;"><i class="fa-solid fa-tag"></i> ' + getTranslation('멤버십 10% 특별 할인이 적용되었습니다.', currentLanguage) + '</div>'
    : '';

  const body = document.getElementById('checkout-modal-body');
  body.innerHTML =
    '<div class="order-receipt">' +
    '<div class="receipt-header">' +
    '<div class="receipt-logo" style="display:flex;align-items:center;justify-content:center;gap:8px;"><img src="logo.png" alt="Logo" style="width:24px; height:24px; object-fit:contain; border-radius:6px;"> Nuri Lab × Mila Shop</div>' +
    '<div class="receipt-check"><i class="fa-solid fa-circle-check" style="color:#10b981;font-size:3rem;"></i></div>' +
    '<h2 style="color:#fff;margin:12px 0 4px;font-family:Outfit,sans-serif;">' + getTranslation('주문이 완료되었습니다!', currentLanguage) + '</h2>' +
    '<p style="color:var(--text-muted);font-size:0.88rem;">' + getTranslation('웰니스 에너지가 곧 배송됩니다 ✨', currentLanguage) + '</p>' +
    '</div>' +
    '<div class="receipt-body">' +
    '<div class="receipt-row"><span>' + getTranslation('주문 번호', currentLanguage) + '</span><span style="font-weight:700;color:var(--primary);">' + orderNo + '</span></div>' +
    '<div class="receipt-row"><span>' + getTranslation('주문 일시', currentLanguage) + '</span><span>' + dateStr + '</span></div>' +
    '<div class="receipt-row"><span>' + getTranslation('주문자', currentLanguage) + '</span><span>' + name + '</span></div>' +
    '<div class="receipt-row"><span>' + getTranslation('이메일', currentLanguage) + '</span><span>' + email + '</span></div>' +
    '<div class="receipt-row" style="border-top:1px dashed rgba(255,255,255,0.1);margin-top:10px;padding-top:10px;"><span>' + getTranslation('배송 주소', currentLanguage) + '</span><span style="text-align:right;max-width:200px;">' + address + '</span></div>' +
    '<div style="margin-top:16px;background:rgba(0,0,0,0.2);border-radius:10px;padding:12px;border:1px solid var(--border-glass);">' +
    itemsHtml +
    '<div class="receipt-row" style="border-top:1px solid rgba(255,255,255,0.1);margin-top:10px;padding-top:10px;font-weight:800;font-size:1.05rem;"><span>' + getTranslation('최종 결제', currentLanguage) + '</span><span style="color:var(--primary);">₩' + subtotal.toLocaleString() + '</span></div>' +
    '</div>' +
    memberNoteHtml +
    '</div>' +
    '<button class="btn btn-outline" style="width:100%;margin-top:20px;font-weight:600;" onclick="closeCheckoutAndReset()"><i class="fa-solid fa-shop"></i> ' + getTranslation('계속 쇼핑하기', currentLanguage) + '</button>' +
    '</div>';

  shopCart = [];
  updateCartUI();
}

function closeCheckoutAndReset() {
  closeCheckoutModal();
  renderShopProducts();
}

function showBioactiveBenefit(compName) {
  const desc = (window.bioactiveBenefits && window.bioactiveBenefits[compName]) || "천연 유기 화합물로서 신체 신진대사 및 면역 기능을 조절하는 건강 유효 성분입니다.";
  alert(`🧬 [${compName}] 의 과학적 생리 효능:\n\n${desc}`);
}
window.showBioactiveBenefit = showBioactiveBenefit;

// ═══════════════════════════════════════════════════════════════════════════
// ─── MILA 통합 영양/약리 진단서 (MenuGen) MODULE ─────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

function generateDiagnosisReportText() {
  const currentUser = JSON.parse(localStorage.getItem('nuri_current_subscriber') || 'null');
  const subscriberName = currentUser ? currentUser.name : '방문자';
  const subscriberEmail = currentUser ? currentUser.email : 'N/A';
  const userConstitution = currentUser ? currentUser.constitution : '일반';
  
  const formatSelect = document.getElementById('rnd-serving-format');
  const format = formatSelect ? formatSelect.value : 'single';
  const config = plannerSlotConfigs[format];
  
  const cheopNames = {
    "single": "단품 요리 개발",
    "bansang_5": "5첩 반상 차림",
    "bansang_7": "7첩 반상 차림",
    "bansang_10": "10첩 반상 차림",
    "bansang_15": "15첩 대형 반상 차림",
    "bansang_20": "20첩 명품 수라상",
    "course_hanjeong": "한정식 코스 요리"
  };
  const dietName = cheopNames[format] || "기타 약선 식단";
  
  const selectedDishes = [];
  if (config) {
    config.groups.forEach(group => {
      group.slots.forEach(slot => {
        const selectEl = document.getElementById(slot.id);
        if (selectEl && selectEl.value) {
          selectedDishes.push({
            slotLabel: slot.label,
            recipeName: selectEl.value
          });
        }
      });
    });
  }

  let totalCalories = 0;
  let totalCarbs = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalFiber = 0;
  let totalSodium = 0;
  let totalWeight = 0;
  let detectedBioactives = new Set();
  
  const natureCounts = { "온성/열성": 0, "평성": 0, "한성/량성": 0 };
  const tasteCounts = { "단맛(감)": 0, "매운맛(신)": 0, "쓴맛(고)": 0, "신맛(산)": 0, "짠맛(함)": 0 };
  const meridianCounts = { "비경": 0, "위경": 0, "간경": 0, "신경": 0, "폐경": 0, "심경": 0 };
  const axisScores = { '정화': 0, '완화': 0, '흡수': 0, '회복': 0, '순환': 0, '보호': 0, '안정': 0 };

  rndIngredients.forEach(item => {
    const row = masterDb.find(r => r["식재료/약재"] === item.name);
    const herbology = window.ingredientsHerbologyList && window.ingredientsHerbologyList.find(h => h.식재료명 === item.name || item.name.includes(h.식재료명) || (h["이명/한약명"] && h["이명/한약명"].includes(item.name)));
    
    if (window.ingredientsNutritionMap) {
      const nutri = window.ingredientsNutritionMap[item.name] || window.ingredientsNutritionMap[Object.keys(window.ingredientsNutritionMap).find(k => item.name.includes(k) || k.includes(item.name))];
      if (nutri) {
        const ratio = item.weight / 10.0;
        totalCalories += (nutri.calories || 0) * ratio;
        totalCarbs += (nutri.carbohydrates || 0) * ratio;
        totalProtein += (nutri.protein || 0) * ratio;
        totalFat += (nutri.fat || 0) * ratio;
        totalFiber += (nutri.fiber || 0) * ratio;
        totalSodium += (nutri.sodium || 0) * ratio;
        if (nutri.bioactive_compounds) {
          nutri.bioactive_compounds.forEach(comp => detectedBioactives.add(comp));
        }
      }
    }
    
    const descText = (row ? (row.설명목록 || []).join(" ") : "") + " " + (herbology ? herbology["성미 (성질과 맛)"] : "");
    const origEffText = (row ? (row.효능목록 || []).join(", ") : "");
    
    let weightFactor = 1;
    if (item.role.includes("군약")) weightFactor = 3;
    else if (item.role.includes("신약")) weightFactor = 2;
    
    const scaledItemWeight = item.weight * batchMultiplier;
    const itemFactor = weightFactor * scaledItemWeight;
    totalWeight += scaledItemWeight;
    
    if (descText.includes("따뜻") || descText.includes("온(溫)") || descText.includes("열(熱)")) {
      natureCounts["온성/열성"] += itemFactor;
    } else if (descText.includes("차가") || descText.includes("한(寒)") || descText.includes("서늘") || descText.includes("량(凉)")) {
      natureCounts["한성/량성"] += itemFactor;
    } else {
      natureCounts["평성"] += itemFactor;
    }
    
    if (descText.includes("달다") || descText.includes("감(甘)")) tasteCounts["단맛(감)"] += itemFactor;
    if (descText.includes("맵다") || descText.includes("신(辛)")) tasteCounts["매운맛(신)"] += itemFactor;
    if (descText.includes("쓰다") || descText.includes("고(苦)")) tasteCounts["쓴맛(고)"] += itemFactor;
    if (descText.includes("시다") || descText.includes("산(酸)")) tasteCounts["신맛(산)"] += itemFactor;
    if (descText.includes("짜다") || descText.includes("함(鹹)")) tasteCounts["짠맛(함)"] += itemFactor;
    
    const targetMeridians = ["간경", "심경", "비경", "위경", "폐경", "신경"];
    targetMeridians.forEach(m => {
      if (descText.includes(m) || origEffText.includes(m) || (herbology && herbology["약선 배합 및 요리법"] && herbology["약선 배합 및 요리법"].includes(m))) {
        meridianCounts[m] += itemFactor;
      }
    });

    if (row) {
      let axes = new Set();
      (row.표준기능목록 || []).forEach(f => {
        if (f) {
          const ax = getResolved7Axis(f, null);
          if (ax) axes.add(ax);
        }
      });
      axes.forEach(axis => {
        if (axisScores.hasOwnProperty(axis)) {
          axisScores[axis] += itemFactor;
        }
      });
    }
  });
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' });
  
  let dishesText = "";
  selectedDishes.forEach(d => {
    dishesText += `   - ${d.slotLabel}: ${d.recipeName}\n`;
  });
  
  const totalMacros = totalCarbs + totalProtein + totalFat;
  let carbsPct = 0, proteinPct = 0, fatPct = 0;
  if (totalMacros > 0) {
    carbsPct = Math.round((totalCarbs / totalMacros) * 100);
    proteinPct = Math.round((totalProtein / totalMacros) * 100);
    fatPct = 100 - carbsPct - proteinPct;
  }
  
  const totalNature = Object.values(natureCounts).reduce((a, b) => a + b, 0) || 1;
  const natureText = Object.entries(natureCounts)
    .map(([n, count]) => `${n} (${((count / totalNature) * 100).toFixed(0)}%)`)
    .join(", ");
    
  const totalTaste = Object.values(tasteCounts).reduce((a, b) => a + b, 0) || 1;
  const tasteText = Object.entries(tasteCounts)
    .map(([t, count]) => `${t} (${((count / totalTaste) * 100).toFixed(0)}%)`)
    .join(", ");
    
  const meridianText = Object.entries(meridianCounts)
    .map(([m, count]) => `${m} (${Math.round(count)}점)`)
    .join(", ");
    
  const totalAxisScore = Object.values(axisScores).reduce((a, b) => a + b, 0) || 1;
  let axisText = "";
  Object.entries(axisScores).forEach(([axis, score]) => {
    if (score > 0) {
      axisText += `   - ${axis} 계열: ${((score / totalAxisScore) * 100).toFixed(0)}% (가중치 ${Math.round(score)}점)\n`;
    }
  });
  
  let bioactiveText = "";
  if (detectedBioactives.size > 0) {
    detectedBioactives.forEach(comp => {
      const desc = (window.bioactiveBenefits && window.bioactiveBenefits[comp]) || "천연 유기 화합물로서 신체의 생리적 활성을 돕습니다.";
      bioactiveText += `   - ${comp}: ${desc}\n`;
    });
  } else {
    bioactiveText = "   - 검출된 유효 물질 없음 (원료 배합 필요)\n";
  }
  
  let sasangResult = "보통 (Balanced)";
  let sasangAdvice = "본 식단은 남녀노소 체질에 관계없이 균형 잡힌 기미와 오행 귀경 밸런스를 갖추고 있어 일상 건강식으로 훌륭합니다.";
  
  if (userConstitution === '소음인') {
    const warmRatio = natureCounts["온성/열성"] / totalNature;
    if (warmRatio > 0.4) {
      sasangResult = "우수 (Excellent)";
      sasangAdvice = "본 식단은 따뜻한 성질(온성/열성)의 식재료가 지배적이며, 소화 기능과 체온 유지를 보완하여 비위가 차고 기력이 약해지기 쉬운 소음인 체질에 최상의 조화를 이룹니다.";
    } else {
      sasangResult = "주의 (Caution)";
      sasangAdvice = "본 식단은 서늘한 성질의 재료 비중이 높아 소음인 체질의 소화력 저하나 냉증을 유발할 수 있으니, 따뜻한 성질의 대추차나 생강차를 곁들이시거나 조리 시 마늘/생강의 배합 비중을 늘리는 것을 권장합니다.";
    }
  } else if (userConstitution === '소양인') {
    const coolRatio = natureCounts["한성/량성"] / totalNature;
    if (coolRatio > 0.4) {
      sasangResult = "우수 (Excellent)";
      sasangAdvice = "본 식단은 서늘한 성질(한성/량성)의 식재료가 적절히 배합되어 있어 체내의 과도한 열을 내리고 신장 기운을 보강해 비위열성이 강한 소양인 체질에 매우 유익합니다.";
    } else {
      sasangResult = "주의 (Caution)";
      sasangAdvice = "본 식단은 따뜻한 성질의 재료가 많아 소양인 체질의 내부 번열을 가중할 수 있으니, 참기름/오이/녹두 등 서늘한 식재료를 보강하거나 식후에 보성 녹차나 민들레차를 곁들이시는 것이 좋습니다.";
    }
  } else if (userConstitution === '태음인') {
    const hasTaeuminHerbs = rndIngredients.some(i => ["율무", "칡", "산약", "도라지", "맥문동", "구기자", "더덕", "표고버섯"].includes(i.name));
    if (hasTaeuminHerbs) {
      sasangResult = "우수 (Excellent)";
      sasangAdvice = "본 식단에는 태음인의 폐 기능을 보호하고 체내 습담(노폐물)을 배출하는 데 탁월한 본초(율무, 도라지, 산약 등)가 함유되어 있어 태음인의 기혈 정체와 호흡기 보양에 시너지가 훌륭합니다.";
    } else {
      sasangResult = "보통 (Good)";
      sasangAdvice = "본 식단은 무난한 성향이나, 태음인의 호흡기 면역과 기혈 정체를 예방하기 위해 맥문동차나 도라지나물 등의 찬을 추가 구성하시는 것을 권장합니다.";
    }
  } else if (userConstitution === '태양인') {
    const hasTaeyangminHerbs = rndIngredients.some(i => ["오가피", "메밀", "국화", "겨우살이"].includes(i.name));
    if (hasTaeyangminHerbs) {
      sasangResult = "우수 (Excellent)";
      sasangAdvice = "본 식단은 기운을 하강시키고 간을 보하는 식재료(오가피, 메밀 등)가 어우러져 간 기운이 약하고 상기되기 쉬운 태양인 체질에 아주 적합합니다.";
    } else {
      sasangResult = "보통 (Good)";
      sasangAdvice = "본 식단은 일반적인 구성을 띠고 있으나, 기운이 솟구치기 쉬운 태양인을 위해 식후 안동 국화차나 모과차를 매칭하여 간열을 내리는 조절이 이롭습니다.";
    }
  }
  
  const dishSelect = document.getElementById('rnd-dish-category');
  const dishCategoryVal = dishSelect ? dishSelect.value : "기타";
  let matchedLiquorName = "안동 유기농 노랑 국화차 (30g)";
  let matchedLiquorDesc = "머리를 맑게 하고 위장 소화 흡수를 향기롭게 감싸주는 유기농 국화송이차입니다.";

  if (dishCategoryVal.includes("국물_메인") || dishCategoryVal === "부식") {
    matchedLiquorName = "청명 진맥 청주 (500ml)";
    matchedLiquorDesc = "보리 누룩으로 빚어 육류의 느끼한 맛을 개운하게 씻어주고 소화를 촉진하는 맑은 청주입니다.";
  } else if (natureCounts["온성/열성"] > natureCounts["한성/량성"]) {
    matchedLiquorName = "지리산 안신 연잎 꽃차 (30g)";
    matchedLiquorDesc = "따뜻한 성질의 음식 뒤에 마음을 차분히 가라앉히고 번열을 제거하는 안신(安神) 꽃차입니다.";
  } else if (natureCounts["한성/량성"] > natureCounts["온성/열성"]) {
    matchedLiquorName = "홍화 보양 백세주 (375ml)";
    matchedLiquorDesc = "서늘한 음식의 성질을 온화하게 덮어주고 기혈의 미세 순환을 돕는 보양주입니다.";
  }

  const marketingClaim = document.getElementById('rnd-marketing-output') ? document.getElementById('rnd-marketing-output').innerText : '';

  let text = `============================================================
       Nuri Laboratory × Mila Wellness Diet Diagnosis
                   [통합 영양/약리 진단서]
============================================================
■ 발행 일시: ${dateStr}
■ 대상 고객: ${subscriberName} 님 (${userConstitution} / ${currentUser ? currentUser.role : '방문자'})
■ 식단 유형: ${dietName} (MenuGen Report)
■ 식단 구성:
${dishesText}
------------------------------------------------------------
1. 통합 영양성분 분석 (Nutritional Profile)
------------------------------------------------------------
- 총 열량: ${Math.round(totalCalories)} kcal
- 탄수화물: ${totalCarbs.toFixed(1)}g (${carbsPct}%)
- 단백질: ${totalProtein.toFixed(1)}g (${proteinPct}%)
- 지방: ${totalFat.toFixed(1)}g (${fatPct}%)
- 식이섬유: ${totalFiber.toFixed(1)}g
- 나트륨: ${Math.round(totalSodium)} mg
------------------------------------------------------------
2. 오행 성미귀경 분석 (Five Elements & Meridians)
------------------------------------------------------------
- 성질 분포: ${natureText}
- 맛 분포: ${tasteText}
- 주요 귀경 장부: ${meridianText}
------------------------------------------------------------
3. 7대 반응 축(7-AXIS) 기대 생리활성 기여율
------------------------------------------------------------
${axisText}
------------------------------------------------------------
4. 주요 생리활성 유효 물질 (Bioactive Compounds)
------------------------------------------------------------
${bioactiveText}
------------------------------------------------------------
5. 사상 체질 궁합 & 양생 어드바이스
------------------------------------------------------------
[${userConstitution} 적합도: ${sasangResult}]
- ${sasangAdvice}
------------------------------------------------------------
6. 추천 발효주 & 음청류 페어링
------------------------------------------------------------
[${matchedLiquorName}]
- ${matchedLiquorDesc}
------------------------------------------------------------
7. 비즈니스 마케팅 스토리텔링 컨셉 (Claims)
------------------------------------------------------------
${marketingClaim}
============================================================
           Nuri Laboratory (C) All Rights Reserved
============================================================`;

  return text;
}

function openDiagnosisModal() {
  const formatSelect = document.getElementById('rnd-serving-format');
  const format = formatSelect ? formatSelect.value : 'single';
  const config = plannerSlotConfigs[format];
  
  const selectedDishes = [];
  if (config && format !== 'single') {
    config.groups.forEach(group => {
      group.slots.forEach(slot => {
        const selectEl = document.getElementById(slot.id);
        if (selectEl && selectEl.value) {
          selectedDishes.push({
            slotLabel: slot.label,
            recipeName: selectEl.value
          });
        }
      });
    });
  }

  if (selectedDishes.length === 0 && format !== 'single') {
    alert("진단서 발행을 위해 식단 슬롯에 최소 하나의 요리를 배치해 주세요.");
    return;
  }

  // Generate the text report
  const reportText = generateDiagnosisReportText();
  window.currentDiagnosisReportText = reportText; // Cache it globally for downloading

  // Generate the HTML content
  const currentUser = JSON.parse(localStorage.getItem('nuri_current_subscriber') || 'null');
  const subscriberName = currentUser ? currentUser.name : '방문자';
  const userConstitution = currentUser ? currentUser.constitution : '일반';
  
  // Calculate values
  let totalCalories = 0, totalCarbs = 0, totalProtein = 0, totalFat = 0, totalFiber = 0, totalSodium = 0;
  let totalWeight = 0;
  let detectedBioactives = new Set();
  const natureCounts = { "온성/열성": 0, "평성": 0, "한성/량성": 0 };
  const tasteCounts = { "단맛(감)": 0, "매운맛(신)": 0, "쓴맛(고)": 0, "신맛(산)": 0, "짠맛(함)": 0 };
  const meridianCounts = { "비경": 0, "위경": 0, "간경": 0, "신경": 0, "폐경": 0, "심경": 0 };
  const axisScores = { '정화': 0, '완화': 0, '흡수': 0, '회복': 0, '순환': 0, '보호': 0, '안정': 0 };

  rndIngredients.forEach(item => {
    const row = masterDb.find(r => r["식재료/약재"] === item.name);
    const herbology = window.ingredientsHerbologyList && window.ingredientsHerbologyList.find(h => h.식재료명 === item.name || item.name.includes(h.식재료명) || (h["이명/한약명"] && h["이명/한약명"].includes(item.name)));
    
    if (window.ingredientsNutritionMap) {
      const nutri = window.ingredientsNutritionMap[item.name] || window.ingredientsNutritionMap[Object.keys(window.ingredientsNutritionMap).find(k => item.name.includes(k) || k.includes(item.name))];
      if (nutri) {
        const ratio = item.weight / 10.0;
        totalCalories += (nutri.calories || 0) * ratio;
        totalCarbs += (nutri.carbohydrates || 0) * ratio;
        totalProtein += (nutri.protein || 0) * ratio;
        totalFat += (nutri.fat || 0) * ratio;
        totalFiber += (nutri.fiber || 0) * ratio;
        totalSodium += (nutri.sodium || 0) * ratio;
        if (nutri.bioactive_compounds) {
          nutri.bioactive_compounds.forEach(comp => detectedBioactives.add(comp));
        }
      }
    }
    
    const descText = (row ? (row.설명목록 || []).join(" ") : "") + " " + (herbology ? herbology["성미 (성질과 맛)"] : "");
    const origEffText = (row ? (row.효능목록 || []).join(", ") : "");
    
    let weightFactor = 1;
    if (item.role.includes("군약")) weightFactor = 3;
    else if (item.role.includes("신약")) weightFactor = 2;
    
    const scaledItemWeight = item.weight * batchMultiplier;
    const itemFactor = weightFactor * scaledItemWeight;
    totalWeight += scaledItemWeight;
    
    if (descText.includes("따뜻") || descText.includes("온(溫)") || descText.includes("열(熱)")) natureCounts["온성/열성"] += itemFactor;
    else if (descText.includes("차가") || descText.includes("한(寒)") || descText.includes("서늘") || descText.includes("량(凉)")) natureCounts["한성/량성"] += itemFactor;
    else natureCounts["평성"] += itemFactor;
    
    if (descText.includes("달다") || descText.includes("감(甘)")) tasteCounts["단맛(감)"] += itemFactor;
    if (descText.includes("맵다") || descText.includes("신(辛)")) tasteCounts["매운맛(신)"] += itemFactor;
    if (descText.includes("쓰다") || descText.includes("고(苦)")) tasteCounts["쓴맛(고)"] += itemFactor;
    if (descText.includes("시다") || descText.includes("산(酸)")) tasteCounts["신맛(산)"] += itemFactor;
    if (descText.includes("짜다") || descText.includes("함(鹹)")) tasteCounts["짠맛(함)"] += itemFactor;
    
    const targetMeridians = ["간경", "심경", "비경", "위경", "폐경", "신경"];
    targetMeridians.forEach(m => {
      if (descText.includes(m) || origEffText.includes(m) || (herbology && herbology["약선 배합 및 요리법"] && herbology["약선 배합 및 요리법"].includes(m))) {
        meridianCounts[m] += itemFactor;
      }
    });

    if (row) {
      let axes = new Set();
      (row.표준기능목록 || []).forEach(f => {
        if (f) {
          const ax = getResolved7Axis(f, null);
          if (ax) axes.add(ax);
        }
      });
      axes.forEach(axis => {
        if (axisScores.hasOwnProperty(axis)) {
          axisScores[axis] += itemFactor;
        }
      });
    }
  });

  const totalMacros = totalCarbs + totalProtein + totalFat;
  let carbsPct = 0, proteinPct = 0, fatPct = 0;
  if (totalMacros > 0) {
    carbsPct = Math.round((totalCarbs / totalMacros) * 100);
    proteinPct = Math.round((totalProtein / totalMacros) * 100);
    fatPct = 100 - carbsPct - proteinPct;
    if (fatPct < 0) fatPct = 0;
  }

  const totalNature = Object.values(natureCounts).reduce((a, b) => a + b, 0) || 1;
  const totalTaste = Object.values(tasteCounts).reduce((a, b) => a + b, 0) || 1;

  let sasangResult = "보통 (Balanced)";
  let sasangAdvice = "본 식단은 남녀노소 체질에 관계없이 균형 잡힌 기미와 오행 귀경 밸런스를 갖추고 있어 일상 건강식으로 훌륭합니다.";
  let badgeColor = "rgba(255, 255, 255, 0.1)";
  let textColor = "#fff";
  
  if (userConstitution === '소음인') {
    const warmRatio = natureCounts["온성/열성"] / totalNature;
    if (warmRatio > 0.4) {
      sasangResult = "우수 (Excellent)";
      sasangAdvice = "본 식단은 따뜻한 성질(온성/열성)의 식재료가 지배적이며, 소화 기능과 체온 유지를 보완하여 비위가 차고 기력이 약해지기 쉬운 소음인 체질에 최상의 조화를 이룹니다.";
      badgeColor = "rgba(245, 158, 11, 0.15)";
      textColor = "#f59e0b";
    } else {
      sasangResult = "주의 (Caution)";
      sasangAdvice = "본 식단은 서늘한 성질의 재료 비중이 높아 소음인 체질의 소화력 저하나 냉증을 유발할 수 있으니, 따뜻한 성질의 대추차나 생강차를 곁들이시거나 조리 시 마늘/생강의 배합 비중을 늘리는 것을 권장합니다.";
      badgeColor = "rgba(239, 68, 68, 0.15)";
      textColor = "#ef4444";
    }
  } else if (userConstitution === '소양인') {
    const coolRatio = natureCounts["한성/량성"] / totalNature;
    if (coolRatio > 0.4) {
      sasangResult = "우수 (Excellent)";
      sasangAdvice = "본 식단은 서늘한 성질(한성/량성)의 식재료가 적절히 배합되어 있어 체내의 과도한 열을 내리고 신장 기운을 보강해 비위열성이 강한 소양인 체질에 매우 유익합니다.";
      badgeColor = "rgba(59, 130, 246, 0.15)";
      textColor = "#3b82f6";
    } else {
      sasangResult = "주의 (Caution)";
      sasangAdvice = "본 식단은 따뜻한 성질의 재료가 많아 소양인 체질의 내부 번열을 가중할 수 있으니, 참기름/오이/녹두 등 서늘한 식재료를 보강하거나 식후에 보성 녹차나 민들레차를 곁들이시는 것이 좋습니다.";
      badgeColor = "rgba(239, 68, 68, 0.15)";
      textColor = "#ef4444";
    }
  } else if (userConstitution === '태음인') {
    const hasTaeuminHerbs = rndIngredients.some(i => ["율무", "칡", "산약", "도라지", "맥문동", "구기자", "더덕", "표고버섯"].includes(i.name));
    if (hasTaeuminHerbs) {
      sasangResult = "우수 (Excellent)";
      sasangAdvice = "본 식단에는 태음인의 폐 기능을 보호하고 체내 습담(노폐물)을 배출하는 데 탁월한 본초(율무, 도라지, 산약 등)가 함유되어 있어 태음인의 기혈 정체와 호흡기 보양에 시너지가 훌륭합니다.";
      badgeColor = "rgba(16, 185, 129, 0.15)";
      textColor = "#10b981";
    } else {
      sasangResult = "보통 (Good)";
      sasangAdvice = "본 식단은 무난한 성향이나, 태음인의 호흡기 면역과 기혈 정체를 예방하기 위해 맥문동차나 도라지나물 등의 찬을 추가 구성하시는 것을 권장합니다.";
      badgeColor = "rgba(255, 255, 255, 0.1)";
      textColor = "#fff";
    }
  } else if (userConstitution === '태양인') {
    const hasTaeyangminHerbs = rndIngredients.some(i => ["오가피", "메밀", "국화", "겨우살이"].includes(i.name));
    if (hasTaeyangminHerbs) {
      sasangResult = "우수 (Excellent)";
      sasangAdvice = "본 식단은 기운을 하강시키고 간을 보하는 식재료(오가피, 메밀 등)가 어우러져 간 기운이 약하고 상기되기 쉬운 태양인 체질에 아주 적합합니다.";
      badgeColor = "rgba(16, 185, 129, 0.15)";
      textColor = "#10b981";
    } else {
      sasangResult = "보통 (Good)";
      sasangAdvice = "본 식단은 일반적인 구성을 띠고 있으나, 기운이 솟구치기 쉬운 태양인을 위해 식후 안동 국화차나 모과차를 매칭하여 간열을 내리는 조절이 이롭습니다.";
      badgeColor = "rgba(255, 255, 255, 0.1)";
      textColor = "#fff";
    }
  }

  const dishSelect = document.getElementById('rnd-dish-category');
  const dishCategoryVal = dishSelect ? dishSelect.value : "기타";
  let matchedLiquorName = "안동 유기농 노랑 국화차 (30g)";
  let matchedLiquorDesc = "머리를 맑게 하고 위장 소화 흡수를 향기롭게 감싸주는 유기농 국화송이차입니다.";
  let matchedLiquorIcon = "🍵";

  if (dishCategoryVal.includes("국물_메인") || dishCategoryVal === "부식") {
    matchedLiquorName = "청명 진맥 청주 (500ml)";
    matchedLiquorDesc = "보리 누룩으로 빚어 육류의 느끼한 맛을 개운하게 씻어주고 소화를 촉진하는 맑은 청주입니다.";
    matchedLiquorIcon = "🍶";
  } else if (natureCounts["온성/열성"] > natureCounts["한성/량성"]) {
    matchedLiquorName = "지리산 안신 연잎 꽃차 (30g)";
    matchedLiquorDesc = "따뜻한 성질의 음식 뒤에 마음을 차분히 가라앉히고 번열을 제거하는 안신(安神) 꽃차입니다.";
    matchedLiquorIcon = "🌸";
  } else if (natureCounts["한성/량성"] > natureCounts["온성/열성"]) {
    matchedLiquorName = "홍화 보양 백세주 (375ml)";
    matchedLiquorDesc = "서늘한 음식의 성질을 온화하게 덮어주고 기혈의 미세 순환을 돕는 보양주입니다.";
    matchedLiquorIcon = "🍶";
  }

  const cheopNames = {
    "single": "단품 요리 개발",
    "bansang_5": "5첩 반상 차림",
    "bansang_7": "7첩 반상 차림",
    "bansang_10": "10첩 반상 차림",
    "bansang_15": "15첩 대형 반상 차림",
    "bansang_20": "20첩 명품 수라상",
    "course_hanjeong": "한정식 코스 요리"
  };
  const dietName = cheopNames[format] || "기타 약선 식단";
  
  let dishesHtml = "";
  selectedDishes.forEach(d => {
    dishesHtml += `
      <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); border-radius:10px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center; font-size:0.85rem; margin-bottom: 4px;">
        <span style="color:var(--text-muted); font-weight:600;">${d.slotLabel}</span>
        <span style="color:#fff; font-weight:700;"><i class="fa-solid fa-utensils" style="margin-right:6px; color:var(--primary);"></i>${d.recipeName}</span>
      </div>
    `;
  });

  let bioactivesHtml = "";
  if (detectedBioactives.size > 0) {
    detectedBioactives.forEach(comp => {
      const desc = (window.bioactiveBenefits && window.bioactiveBenefits[comp]) || "신체 건강을 조율하는 천연 화합물입니다.";
      bioactivesHtml += `
        <div style="margin-bottom:8px; display:flex; flex-direction:column; gap:2px;">
          <span style="font-weight:700; color:var(--primary); font-size:0.85rem;"><i class="fa-solid fa-seedling" style="margin-right:4px;"></i>${comp}</span>
          <p style="margin:0; font-size:0.78rem; color:var(--text-secondary);">${desc}</p>
        </div>
      `;
    });
  } else {
    bioactivesHtml = `<div style="text-align:center; color:var(--text-muted); font-size:0.8rem; padding:10px 0;">배합 식재료의 영양 성분이 연산되지 않았습니다.</div>`;
  }

  const totalAxisScore = Object.values(axisScores).reduce((a, b) => a + b, 0) || 1;
  let axisHtml = "";
  Object.entries(axisScores).forEach(([axis, score]) => {
    if (score > 0) {
      const pct = ((score / totalAxisScore) * 100).toFixed(0);
      axisHtml += `
        <div style="margin-bottom:10px;">
          <div style="display:flex; justify-content:space-between; font-size:0.78rem; margin-bottom:3px; font-weight:600;">
            <span style="color:#fff;">${axis} 작용</span>
            <span style="color:var(--primary);">${pct}% (${Math.round(score)}점)</span>
          </div>
          <div style="height:6px; background:rgba(255,255,255,0.05); border-radius:3px; overflow:hidden;">
            <div style="height:100%; width:${pct}%; background:var(--primary); border-radius:3px;"></div>
          </div>
        </div>
      `;
    }
  });

  const now = new Date();
  const dateStr = now.toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' });

  const html = `
    <div style="display:flex; flex-direction:column; gap:24px; font-family:'Outfit', sans-serif;">
      
      <!-- Top Overview Header -->
      <div style="background:linear-gradient(135deg, rgba(6, 78, 59, 0.15) 0%, rgba(120, 53, 15, 0.1) 100%); border:1px solid var(--border-glass); border-radius:14px; padding:16px; display:flex; flex-direction:column; gap:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.95rem; font-weight:800; color:#fff; display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-folder-tree" style="color:var(--primary);"></i> ${dietName}</span>
          <span style="font-size:0.75rem; background:rgba(255,255,255,0.06); padding:3px 8px; border-radius:8px; color:var(--text-muted); font-weight:600;">${dateStr}</span>
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; font-size:0.8rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top:10px;">
          <div><span style="color:var(--text-muted);">수진 회원:</span> <strong style="color:#fff; margin-left:4px;">${subscriberName} 님</strong></div>
          <div><span style="color:var(--text-muted);">진단 체질:</span> <strong style="color:var(--sa-color); margin-left:4px;">${userConstitution}</strong></div>
        </div>
      </div>

      <!-- Selected Dishes -->
      <div>
        <h3 style="font-size:0.95rem; color:var(--primary); margin:0 0 10px 0; display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-utensils"></i> 식단 구성 요리 배치</h3>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${dishesHtml}
        </div>
      </div>

      <!-- Sasang Constitution Compatibility -->
      <div style="border: 2px solid var(--primary); border-radius:14px; background: rgba(16, 185, 129, 0.02); padding:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <h3 style="font-size:0.95rem; color:#fff; margin:0; display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-yin-yang" style="color:var(--primary);"></i> 사상 체질 적합도</h3>
          <span style="font-size:0.8rem; font-weight:800; padding:4px 10px; border-radius:20px; background:${badgeColor}; color:${textColor}; border:1px solid ${textColor}; text-shadow: 0 0 8px ${textColor};">${sasangResult}</span>
        </div>
        <p style="margin:0; font-size:0.82rem; color:var(--text-secondary); line-height:1.5; text-align:justify;">
          ${sasangAdvice}
        </p>
      </div>

      <!-- Nutrition Profile -->
      <div>
        <h3 style="font-size:0.95rem; color:var(--primary); margin:0 0 10px 0; display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-chart-pie"></i> 통합 영양성분 분석</h3>
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px; margin-bottom:14px;">
          <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.04); border-radius:10px; padding:10px; text-align:center;">
            <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">총 열량</div>
            <div style="font-size:1.15rem; font-weight:800; color:var(--primary);">${Math.round(totalCalories)} <span style="font-size:0.75rem; font-weight:500;">kcal</span></div>
          </div>
          <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.04); border-radius:10px; padding:10px; text-align:center;">
            <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">나트륨</div>
            <div style="font-size:1.15rem; font-weight:800; color:var(--primary);">${Math.round(totalSodium)} <span style="font-size:0.75rem; font-weight:500;">mg</span></div>
          </div>
          <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.04); border-radius:10px; padding:10px; text-align:center;">
            <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">식이섬유</div>
            <div style="font-size:1.15rem; font-weight:800; color:var(--primary);">${totalFiber.toFixed(1)} <span style="font-size:0.75rem; font-weight:500;">g</span></div>
          </div>
        </div>
        
        <!-- Macro balance bars -->
        <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.04); border-radius:12px; padding:14px;">
          <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); margin-bottom:8px;">
            <span>탄수화물 (${totalCarbs.toFixed(1)}g)</span>
            <span>단백질 (${totalProtein.toFixed(1)}g)</span>
            <span>지방 (${totalFat.toFixed(1)}g)</span>
          </div>
          <div style="height:8px; background:rgba(255,255,255,0.05); border-radius:4px; overflow:hidden; display:flex;">
            <div style="width:${carbsPct}%; background:#3b82f6; height:100%;" title="탄수화물 ${carbsPct}%"></div>
            <div style="width:${proteinPct}%; background:#10b981; height:100%;" title="단백질 ${proteinPct}%"></div>
            <div style="width:${fatPct}%; background:#f59e0b; height:100%;" title="지방 ${fatPct}%"></div>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.72rem; color:var(--text-secondary); margin-top:6px;">
            <span style="display:flex; align-items:center; gap:4px;"><span style="display:inline-block; width:8px; height:8px; background:#3b82f6; border-radius:50%;"></span>탄 ${carbsPct}%</span>
            <span style="display:flex; align-items:center; gap:4px;"><span style="display:inline-block; width:8px; height:8px; background:#10b981; border-radius:50%;"></span>단 ${proteinPct}%</span>
            <span style="display:flex; align-items:center; gap:4px;"><span style="display:inline-block; width:8px; height:8px; background:#f59e0b; border-radius:50%;"></span>지 ${fatPct}%</span>
          </div>
        </div>
      </div>

      <!-- Traditional Properties & Five Elements -->
      <div style="display:grid; grid-template-columns: 1fr 1.2fr; gap:16px;">
        <div>
          <h3 style="font-size:0.9rem; color:var(--primary); margin:0 0 8px 0; display:flex; align-items:center; gap:6px;"><i class="fa-solid fa-temperature-half"></i> 한방 성미(性味)</h3>
          <div style="font-size:0.75rem; color:var(--text-secondary); line-height:1.5; display:flex; flex-direction:column; gap:6px;">
            <div><strong>성질 분포:</strong><br>${Object.entries(natureCounts).map(([n, count]) => `${n}: ${((count / totalNature) * 100).toFixed(0)}%`).join(", ")}</div>
            <div><strong>오미 분포:</strong><br>${Object.entries(tasteCounts).map(([t, count]) => `${t.split("(")[0]}: ${((count / totalTaste) * 100).toFixed(0)}%`).join(", ")}</div>
          </div>
        </div>
        <div>
          <h3 style="font-size:0.9rem; color:var(--primary); margin:0 0 8px 0; display:flex; align-items:center; gap:6px;"><i class="fa-solid fa-heart-pulse"></i> 오행 귀경(歸經)</h3>
          <div style="display:flex; flex-wrap:wrap; gap:6px;">
            ${Object.entries(meridianCounts).map(([m, count]) => {
              const maxVal = Math.max(...Object.values(meridianCounts), 1);
              const isHeavy = count > 0 && count === maxVal;
              return `<span style="font-size:0.72rem; padding:2px 8px; border-radius:6px; background:${isHeavy ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255,255,255,0.03)'}; color:${isHeavy ? 'var(--sa-color)' : 'var(--text-secondary)'}; border:1px solid ${isHeavy ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255,255,255,0.06)'}; font-weight:${isHeavy ? '700' : '500'};">${m} (${Math.round(count)}점)</span>`;
            }).join("")}
          </div>
        </div>
      </div>

      <!-- 7-AXIS physiological expectations -->
      <div>
        <h3 style="font-size:0.95rem; color:var(--primary); margin:0 0 10px 0; display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-shield-halved"></i> 7대 반응 축 기대 생리활성</h3>
        <div style="background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.03); border-radius:12px; padding:14px; display:flex; flex-direction:column; gap:10px;">
          ${axisHtml}
        </div>
      </div>

      <!-- Bioactive Compounds -->
      <div>
        <h3 style="font-size:0.95rem; color:var(--primary); margin:0 0 10px 0; display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-flask"></i> 검출 천연 유효 성분</h3>
        <div style="background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.03); border-radius:12px; padding:14px; max-height:200px; overflow-y:auto; display:flex; flex-direction:column; gap:12px;">
          ${bioactivesHtml}
        </div>
      </div>

      <!-- Traditional Beverage Pairing -->
      <div style="background: rgba(245, 158, 11, 0.02); border:1px dashed rgba(245, 158, 11, 0.3); border-radius:14px; padding:16px; display:flex; gap:14px; align-items:center;">
        <div style="font-size:2rem; line-height:1; display:flex; align-items:center; justify-content:center;">${matchedLiquorIcon}</div>
        <div style="flex:1;">
          <span style="font-size:0.7rem; color:var(--sa-color); font-weight:700; text-transform:uppercase; letter-spacing:1px; display:block; margin-bottom:2px;"><i class="fa-solid fa-star"></i> 추천 명품 페어링</span>
          <strong style="font-size:0.85rem; color:#fff; display:block; margin-bottom:2px;">${matchedLiquorName}</strong>
          <p style="font-size:0.78rem; color:var(--text-secondary); margin:0; line-height:1.4;">${matchedLiquorDesc}</p>
        </div>
      </div>

    </div>
  `;

  const bodyEl = document.getElementById('diagnosis-modal-body');
  if (bodyEl) {
    bodyEl.innerHTML = html;
  }

  const modal = document.getElementById('diagnosis-modal');
  if (modal) {
    modal.classList.add('open');
  }
}

function closeDiagnosisModal() {
  const modal = document.getElementById('diagnosis-modal');
  if (modal) {
    modal.classList.remove('open');
  }
}

function downloadDiagnosisFile() {
  const text = window.currentDiagnosisReportText;
  if (!text) {
    alert("진단서 정보가 없습니다.");
    return;
  }
  const blob = new Blob(["\ufeff" + text], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "mila_diet_diagnosis.txt");
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Expose modal control functions globally
window.openDiagnosisModal = openDiagnosisModal;
window.closeDiagnosisModal = closeDiagnosisModal;
window.downloadDiagnosisFile = downloadDiagnosisFile;
window.generateDiagnosisReportText = generateDiagnosisReportText;


/* ==========================================================================
   Mila Shop Detail Modal & Platform Ecosystem Functions
   ========================================================================== */

let detailProductQty = 1;

function openProductDetail(productId) {
  const p = SHOP_PRODUCTS.find(item => item.id === productId);
  if (!p) return;

  detailProductQty = 1; // reset qty to 1

  const body = document.getElementById('product-detail-body');
  if (!body) return;

  const currentUser = JSON.parse(localStorage.getItem('nuri_current_subscriber') || 'null');
  const userConstitution = currentUser ? currentUser.constitution : null;
  const isMember = !!currentUser;
  const memberPrice = isMember ? Math.round(p.price * 0.9) : p.price;

  const isMatch = userConstitution && userConstitution !== '일반' && p.constitution.includes(userConstitution);

  // Define constitution synergy text
  const matchExplanation = getConstitutionExplanation(p.constitutionType, p.name);

  // Formulate links for R&D
  const rdLinkHtml = `
    <div style="display:flex; flex-direction:column; gap:8px;">
      <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
        <span style="font-size:0.75rem; color:var(--text-secondary); width:85px; font-weight:600;">${getTranslation('rdStdFunc', currentLanguage)}:</span>
        ${p.rdLinkage.functions.map(fn => `<span class="badge-tag green-glow-hover" style="font-size:0.7rem; padding:1px 6px; cursor:pointer;" onclick="closeProductDetailModal(); switchTab('tab-index'); searchStandardFunction('${fn.split(' ')[0]}');">${translateTerm(fn, currentLanguage)}</span>`).join(' ')}
      </div>
      <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-top:4px;">
        <span style="font-size:0.75rem; color:var(--text-secondary); width:85px; font-weight:600;">${getTranslation('rdAxis', currentLanguage)}:</span>
        ${p.rdLinkage.axes.map(ax => `<span class="badge-tag gold-glow-hover" style="font-size:0.7rem; padding:1px 6px; border-color:#f59e0b; color:#f59e0b; cursor:pointer;" onclick="closeProductDetailModal(); switchTab('tab-index'); selectAxisTab('${ax}');">${translateTerm(ax, currentLanguage)}</span>`).join(' ')}
      </div>
    </div>
  `;

  // Build full html
  body.innerHTML = `
    <div style="display:grid; grid-template-columns: 1fr 1.2fr; gap:24px; align-items:start;">
      <!-- Left Column: Visuals & Pricing -->
      <div style="display:flex; flex-direction:column; gap:16px;">
        <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:20px; display:flex; justify-content:center; align-items:center; position:relative; overflow:hidden; aspect-ratio: 1.1 / 1;">
          ${p.image 
            ? `<img src="${p.image}" alt="${getTranslation(p.name, currentLanguage)}" style="max-width:100%; max-height:100%; object-fit:contain; filter: drop-shadow(0 0 15px rgba(245,158,11,0.2));">` 
            : `<span style="font-size:8rem;">${p.emoji}</span>`
          }
        </div>
        <div>
          <h3 style="font-size:1.3rem; font-weight:800; color:#fff; margin:0;">${getTranslation(p.name, currentLanguage)}</h3>
          <div style="font-size:0.75rem; color:var(--text-muted); font-family:'Outfit', sans-serif; margin-bottom:8px;">${translateTerm(p.subname, currentLanguage)}</div>
          <div style="display:flex; align-items:baseline; gap:8px;">
            ${isMember 
              ? `<span style="font-size:0.85rem; text-decoration:line-through; color:var(--text-muted);">₩${p.price.toLocaleString()}</span>
                 <span style="font-size:1.25rem; font-weight:800; color:var(--primary);">₩${memberPrice.toLocaleString()}</span>
                 <span style="font-size:0.7rem; background:rgba(245,158,11,0.08); color:var(--primary); border:1px solid var(--primary); padding:1px 6px; border-radius:4px; font-weight:700;">${getTranslation('memberPriceLabel', currentLanguage)}</span>`
              : `<span style="font-size:1.25rem; font-weight:800; color:var(--primary);">₩${p.price.toLocaleString()}</span>`
            }
          </div>
          <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:6px;">${getTranslation('capacitySpec', currentLanguage)}: ${getTranslation(p.unit, currentLanguage)} | ${getTranslation('stockLabel', currentLanguage)}: ${p.stock}${getTranslation('qtyUnit', currentLanguage)}</div>
        </div>
        <!-- Quantity selector & Add to Cart button -->
        <div style="display:flex; gap:10px; margin-top:10px; align-items:center;">
          <div style="display:flex; align-items:center; border:1px solid rgba(255,255,255,0.12); border-radius:6px; background:rgba(0,0,0,0.3); overflow:hidden;">
            <button onclick="decreaseDetailQty('${p.id}')" style="background:transparent; border:none; color:#fff; padding:8px 14px; cursor:pointer; font-weight:700; transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">−</button>
            <span id="detail-qty-display" style="padding:0 8px; font-weight:800; min-width:24px; text-align:center; font-family:'Outfit',sans-serif;">1</span>
            <button onclick="increaseDetailQty('${p.id}')" style="background:transparent; border:none; color:#fff; padding:8px 14px; cursor:pointer; font-weight:700; transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">+</button>
          </div>
          <button class="btn btn-primary" onclick="addFromDetailToCart('${p.id}')" style="flex:1; font-weight:700; height:40px;"><i class="fa-solid fa-cart-shopping"></i> ${getTranslation('cartBtn', currentLanguage)}</button>
        </div>
      </div>

      <!-- Right Column: Scientific & Medical properties -->
      <div style="display:flex; flex-direction:column; gap:16px;">
        <!-- Product Description -->
        <div class="panel glass-panel" style="padding:15px; margin:0; background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.05);">
          <h4 style="margin:0 0 8px; font-size:0.8rem; color:var(--primary); font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">${getTranslation('productSummaryTitle', currentLanguage)}</h4>
          <p style="color:var(--text-secondary); font-size:0.82rem; margin:0; line-height:1.5;">${getTranslation(p.desc, currentLanguage)}</p>
        </div>

        <!-- Premium Value Guarantee / Price Rationale -->
        ${p.priceRationale ? `
        <div class="panel glass-panel" style="padding:15px; margin:0; background:rgba(245,158,11,0.02); border:1px solid rgba(245,158,11,0.15); border-left:3px solid var(--primary);">
          <h4 style="margin:0 0 6px; font-size:0.8rem; color:var(--primary); font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">${getShopTxt('valueGuarantee', currentLanguage)}</h4>
          <p style="color:var(--text-secondary); font-size:0.8rem; margin:0; line-height:1.5; word-break:keep-all;">${p.priceRationale[currentLanguage] || p.priceRationale.ko}</p>
        </div>
        ` : ''}

        <!-- Sasang constitution match -->
        <div class="panel glass-panel" style="padding:15px; margin:0; background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.05); border-left:3px solid ${p.constitutionType === 'warm' ? '#f59e0b' : p.constitutionType === 'cool' ? '#10b981' : '#a78bfa'};">
          <h4 style="margin:0 0 8px; font-size:0.8rem; color:${p.constitutionType === 'warm' ? '#f59e0b' : p.constitutionType === 'cool' ? '#10b981' : '#a78bfa'}; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">${getTranslation('synergyTitle', currentLanguage)}</h4>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
            <span class="badge" style="background:${p.constitutionType === 'warm' ? 'rgba(245,158,11,0.08)' : p.constitutionType === 'cool' ? 'rgba(16,185,129,0.08)' : 'rgba(167,139,250,0.08)'}; color:${p.constitutionType === 'warm' ? '#f59e0b' : p.constitutionType === 'cool' ? '#10b981' : '#a78bfa'}; border:1px solid ${p.constitutionType === 'warm' ? '#f59e0b' : p.constitutionType === 'cool' ? '#10b981' : '#a78bfa'}; padding:2px 6px; border-radius:4px; font-size:0.65rem; font-weight:700;">
              ${p.constitutionType.toUpperCase()}
            </span>
            <span style="font-size:0.8rem; font-weight:700; color:#fff;">${getTranslation('synergyConstitution', currentLanguage)}: ${p.constitution.map(c => getTranslation(c, currentLanguage)).join(', ')}</span>
          </div>
          <p style="color:var(--text-secondary); font-size:0.82rem; margin:0; line-height:1.5;">${getTranslation(matchExplanation, currentLanguage)}</p>
        </div>

        <!-- National standard nutrition facts (RDA) -->
        <div class="panel glass-panel" style="padding:15px; margin:0; background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.05);">
          <h4 style="margin:0 0 8px; font-size:0.8rem; color:var(--primary); font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">${getTranslation('rdaTitle', currentLanguage)}</h4>
          <table style="width:100%; border-collapse:collapse; font-size:0.75rem; text-align:left;">
            <thead>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.08); color:var(--text-muted);">
                <th style="padding:4px 0;">${getTranslation('nutrientLabel', currentLanguage)}</th>
                <th style="padding:4px 0; text-align:right;">${getTranslation('servingAmount', currentLanguage)} (${p.nutrition.serving})</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding:5px 0; color:var(--text-secondary);">${getTranslation('energy', currentLanguage)}</td>
                <td style="padding:5px 0; text-align:right; color:#fff; font-weight:700;">${getTranslation(p.nutrition.energy, currentLanguage)}</td>
              </tr>
              <tr style="border-top:1px solid rgba(255,255,255,0.03);">
                <td style="padding:5px 0; color:var(--text-secondary);">${getTranslation('carbs', currentLanguage)}</td>
                <td style="padding:5px 0; text-align:right; color:#fff; font-weight:700;">${getTranslation(p.nutrition.carbs, currentLanguage)}</td>
              </tr>
              <tr style="border-top:1px solid rgba(255,255,255,0.03);">
                <td style="padding:5px 0; color:var(--text-secondary);">${getTranslation('protein', currentLanguage)}</td>
                <td style="padding:5px 0; text-align:right; color:#fff; font-weight:700;">${getTranslation(p.nutrition.protein, currentLanguage)}</td>
              </tr>
              <tr style="border-top:1px solid rgba(255,255,255,0.03);">
                <td style="padding:5px 0; color:var(--text-secondary);">${getTranslation('fat', currentLanguage)}</td>
                <td style="padding:5px 0; text-align:right; color:#fff; font-weight:700;">${getTranslation(p.nutrition.fat, currentLanguage)}</td>
              </tr>
              <tr style="border-top:1px solid rgba(255,255,255,0.03);">
                <td style="padding:5px 0; color:var(--text-secondary);">${getTranslation('sodium', currentLanguage)}</td>
                <td style="padding:5px 0; text-align:right; color:#fff; font-weight:700;">${getTranslation(p.nutrition.sodium, currentLanguage)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- R&D Mapping Linkage -->
        <div class="panel glass-panel" style="padding:15px; margin:0; background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.05);">
          <h4 style="margin:0 0 8px; font-size:0.8rem; color:var(--primary); font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">${getTranslation('rdOntologyTitle', currentLanguage)}</h4>
          ${rdLinkHtml}
        </div>

        <!-- Brewing/Preparation Guide & Safety Precautions -->
        <div class="panel glass-panel" style="padding:15px; margin:0; background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.05);">
          <h4 style="margin:0 0 8px; font-size:0.8rem; color:var(--primary); font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">${getTranslation('guideWarningTitle', currentLanguage)}</h4>
          <div style="display:flex; flex-direction:column; gap:6px; font-size:0.8rem; line-height:1.5;">
            <div style="color:var(--text-secondary);"><strong>${getTranslation('intakeMethod', currentLanguage)}:</strong> ${getTranslation(p.brewingGuide, currentLanguage)}</div>
            <div style="color:#f87171; background:rgba(248,113,113,0.05); padding:6px 10px; border-radius:6px; border:1px solid rgba(248,113,113,0.1); margin-top:2px;">
              <strong>${getTranslation('modalWarningLabel', currentLanguage)}:</strong> ${getTranslation(p.warning, currentLanguage)}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const modal = document.getElementById('product-detail-modal');
  if (modal) modal.classList.add('open');
}

function closeProductDetailModal() {
  const modal = document.getElementById('product-detail-modal');
  if (modal) modal.classList.remove('open');
}

function increaseDetailQty(productId) {
  detailProductQty++;
  const el = document.getElementById('detail-qty-display');
  if (el) el.innerText = detailProductQty;
}

function decreaseDetailQty(productId) {
  if (detailProductQty <= 1) return;
  detailProductQty--;
  const el = document.getElementById('detail-qty-display');
  if (el) el.innerText = detailProductQty;
}

function addFromDetailToCart(productId) {
  const product = SHOP_PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  
  const existing = shopCart.find(c => c.product.id === productId);
  if (existing) {
    existing.qty += detailProductQty;
  } else {
    shopCart.push({ product: product, qty: detailProductQty });
  }

  updateCartUI();
  renderShopProducts();
  closeProductDetailModal();
  
  // Open floating cart drawer to directly show the cart state
  openCartDrawer();

  // Pulse cart FAB
  const fab = document.getElementById('cart-fab');
  if (fab) {
    fab.classList.add('cart-fab-pulse');
    setTimeout(function(){ fab.classList.remove('cart-fab-pulse'); }, 600);
  }
}

function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  if (!drawer) return;
  renderCartDrawer();
  drawer.classList.add('open');
  if (overlay) overlay.classList.add('open');
  document.body.classList.add('drawer-open');
}

function getConstitutionExplanation(type, productName) {
  if (type === 'warm') {
    return '이 제품은 온양성(Warm) 원물을 기반으로 하여, 태생적으로 비위 기능이 차고 맥이 약해 손발이 시리기 쉬운 <strong>소음인</strong>과 순환 정체로 담음이 생기기 쉬운 <strong>태음인</strong>의 기혈 기립을 돕고 말초 혈행을 촉진하는 약리 기전을 보조합니다.';
  } else if (type === 'cool') {
    return '이 제품은 서늘한 성질(Cool)의 자연물을 함유하고 있어, 선천적으로 상체열이 많고 화(火)가 울체되기 쉬운 <strong>소양인</strong>과 폐대간소하여 기가 위로 치밀어 오르기 쉬운 <strong>태양인</strong>의 중추열을 내리고 간음(肝陰)을 보하며 마음을 하강시켜 뇌파를 안정시킵니다.';
  } else {
    return '본 제품은 평(平)하고 중용을 이루는 중성(Neutral) 성미를 띠고 있어, 4대 사상 체질(소음인, 소양인, 태음인, 태양인) 누구에게나 치우침 없이 흡수되며 일상의 원기를 온화하게 보해주는 기본 양생 식품입니다.';
  }
}

// Search standard functions from product detail page
function searchStandardFunction(keyword) {
  const input = document.getElementById('index-search-input');
  if (input) {
    input.value = keyword;
    // Trigger input event to run search
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
  }
}

// Select axis tab from product detail page
function selectAxisTab(axisName) {
  // Try to find the tab pill matching the axis
  const pills = document.querySelectorAll('.axis-tab-pill');
  pills.forEach(pill => {
    if (pill.innerText.includes(axisName)) {
      pill.click();
    }
  });
}

// showEcosystemDetails for B2B Ecosystem Network Diagram
function showEcosystemDetails(nodeId) {
  const panel = document.getElementById('eco-detail-panel');
  if (!panel) return;

  // Highlight clicked node, remove highlight from others
  document.querySelectorAll('.eco-node').forEach(el => el.classList.remove('active-node'));
  const clicked = document.querySelector(`[onclick="showEcosystemDetails('${nodeId}')"]`);
  if (clicked) clicked.classList.add('active-node');

  let html = '';
  if (nodeId === 'eco-academia') {
    html = `
      <h3 style="color:var(--accent); margin-top:0; font-size:1.05rem; font-weight:700; display:flex; align-items:center; gap:8px;">
        <i class="fa-solid fa-graduation-cap"></i> 🔬 학술 & 임상 연구망 (KIOM & Universities)
      </h3>
      <p style="margin:10px 0; font-size:0.82rem; color:var(--text-secondary); line-height:1.5;">
        경희대학교 한의과대학 자문단과 공동으로 한방 처방의 오행(五行)·성미(性味)귀경 분석 표준안을 정립했습니다. 또한 <strong>한국한의학연구원(KIOM)</strong>의 표준 고전 문헌 온톨로지 지표를 결합하여, 동의보감과 본초강목 등 4대 한방 고전에 수록된 기질 조절 작용 수식이 Matrix Engine 추론 알고리즘 상에서 과학적으로 정밀 연산될 수 있도록 학술적 정당성을 확보해 줍니다.
      </p>
      <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
        <span class="badge" style="background:rgba(5,150,105,0.08); color:var(--accent); border:1px solid var(--accent); padding:2px 8px; border-radius:4px; font-size:0.7rem; font-weight:700;">동의보감 고증 완료</span>
        <span class="badge" style="background:rgba(5,150,105,0.08); color:var(--accent); border:1px solid var(--accent); padding:2px 8px; border-radius:4px; font-size:0.7rem; font-weight:700;">KIOM 데이터 얼라이언스</span>
      </div>
    `;
  } else if (nodeId === 'eco-platform') {
    html = `
      <h3 style="color:var(--primary); margin-top:0; font-size:1.05rem; font-weight:700; display:flex; align-items:center; gap:8px;">
        <i class="fa-solid fa-cpu"></i> 🧬 Nuri Lab AI 추론 엔진 (Matrix Engine)
      </h3>
      <p style="margin:10px 0; font-size:0.82rem; color:var(--text-secondary); line-height:1.5;">
        식단 영양/약리 추천 및 군신좌사 배합기, 7-AXIS 생리반응 예측 알고리즘의 <strong>중추 추론기</strong>입니다. 1,793행 마스터 DB를 기반으로 하며 환자의 사상 체질과 호흡기/관절/비위 등 신체 병증 키워드를 런타임에 다차원 결합하여, 부작용(상극/상반 안전 가드)을 사전 회피하고 최적의 양생 성분을 배정하여 마케팅 문구(Claims)까지 실시간 연산 출력해 냅니다.
      </p>
      <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
        <span class="badge" style="background:rgba(245,158,11,0.08); color:var(--primary); border:1px solid var(--primary); padding:2px 8px; border-radius:4px; font-size:0.7rem; font-weight:700;">7-AXIS 실시간 연산</span>
        <span class="badge" style="background:rgba(245,158,11,0.08); color:var(--primary); border:1px solid var(--primary); padding:2px 8px; border-radius:4px; font-size:0.7rem; font-weight:700;">칠정배합 예외 감지 99.8%</span>
      </div>
    `;
  } else if (nodeId === 'eco-supply') {
    html = `
      <h3 style="color:#f59e0b; margin-top:0; font-size:1.05rem; font-weight:700; display:flex; align-items:center; gap:8px;">
        <i class="fa-solid fa-warehouse"></i> 🏭 청정 원물 산지 직송망 & 자연산 채취 협력망
      </h3>
      <p style="margin:10px 0; font-size:0.82rem; color:var(--text-secondary); line-height:1.5;">
        의성 유기농 홍화, 풍기 인삼 등 전국 12개 청정 산지 지자체 농가와의 직송 공급망을 구축하여 최고 등급의 원물을 조달하고, 깊은 산속에서 무공해 야생 본초를 채취하는 전통 채취인(심마니) 공동체와의 협력망을 통해 고가치의 원재료를 안정적으로 연계 수급합니다. 이후 8대 협력 GMP/HACCP 인증 제약 및 한방 제조 인프라를 통해 위탁 가공하며 유통 투명성을 보증합니다.
      </p>
      <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
        <span class="badge" style="background:rgba(245,158,11,0.08); color:#f59e0b; border:1px solid #f59e0b; padding:2px 8px; border-radius:4px; font-size:0.7rem; font-weight:700;">산지 직송 & 자연산 채취 연동</span>
        <span class="badge" style="background:rgba(245,158,11,0.08); color:#f59e0b; border:1px solid #f59e0b; padding:2px 8px; border-radius:4px; font-size:0.7rem; font-weight:700;">GMP/HACCP 위탁 생산</span>
      </div>
    `;
  } else if (nodeId === 'eco-b2c') {
    html = `
      <h3 style="color:#10b981; margin-top:0; font-size:1.05rem; font-weight:700; display:flex; align-items:center; gap:8px;">
        <i class="fa-solid fa-store"></i> 🛒 B2C Mila Premium Wellness Shop (직영 유통)
      </h3>
      <p style="margin:10px 0; font-size:0.82rem; color:var(--text-secondary); line-height:1.5;">
        일반 소비자와 웰니스 회원들이 자신의 체질(사상 체질) 큐레이션을 바탕으로 프리미엄 전통 발효 식품, 웰니스 주류 및 차류를 신뢰하고 간편 구매하는 <strong>플랫폼 직접 커머스 채널</strong>입니다. 가입자 체질 기반 10% 자동 할인 특전을 제공하며, 상품 거래액의 15%~20%가 플랫폼 운영 수수료 매출로 연결되어 안정적이고 높은 B2C 현금 마진을 확보합니다.
      </p>
      <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
        <span class="badge" style="background:rgba(16,185,129,0.08); color:#10b981; border:1px solid #10b981; padding:2px 8px; border-radius:4px; font-size:0.7rem; font-weight:700;">커머스 유통 수수료 15~20%</span>
        <span class="badge" style="background:rgba(16,185,129,0.08); color:#10b981; border:1px solid #10b981; padding:2px 8px; border-radius:4px; font-size:0.7rem; font-weight:700;">1:1 체질 매칭 유통 채널</span>
      </div>
    `;
  } else if (nodeId === 'eco-b2b') {
    html = `
      <h3 style="color:#a78bfa; margin-top:0; font-size:1.05rem; font-weight:700; display:flex; align-items:center; gap:8px;">
        <i class="fa-solid fa-building"></i> 💼 B2B 프랜차이즈 가맹 & 밀키트 R&D 구독 모델
      </h3>
      <p style="margin:10px 0; font-size:0.82rem; color:var(--text-secondary); line-height:1.5;">
        가맹 본부(Mila F&B, 메디푸드 정기구독) 및 외부 HMR 밀키트 개발사들이 플랫폼 내의 <strong>약선 R&D 설계기</strong> 및 <strong>식단 R&D 플래너</strong>를 사용하여 대형 조리 배비 비율 및 원가를 자동 환산합니다. 가맹점 규모 및 월간 배합 시뮬레이션 트래픽 수치에 따라 월 정액 기반의 API 사용료와 라이선스 구독 패스를 징수하는 고수익 B2B SaaS 사업 모델입니다. <span style="color:#3b82f6;">(현재 베타 버전 테스트 기간으로 한시적 100% 무료 제공 중입니다)</span>
      </p>
      <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
        <span class="badge" style="background:rgba(59,130,246,0.08); color:#3b82f6; border:1px solid #3b82f6; padding:2px 8px; border-radius:4px; font-size:0.7rem; font-weight:700;">베타 기간 무료 개방</span>
        <span class="badge" style="background:rgba(167,139,250,0.08); color:#a78bfa; border:1px solid #a78bfa; padding:2px 8px; border-radius:4px; font-size:0.7rem; font-weight:700;">프랜차이즈 배합 스케일러 라이선스</span>
      </div>
    `;
  }
  
  panel.innerHTML = html;
  panel.style.display = 'block';
}

// ─── B2B2C New Integrated Features ───────────────────────────────

// 1. Suggestions (B2C) Functions
function renderSuggestionsList() {
  const container = document.getElementById('suggestions-list-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  const sortedSuggestions = [...visitorSuggestionsDb].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  if (sortedSuggestions.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:40px; color:var(--text-muted); font-size:0.85rem;">
        <i class="fa-solid fa-face-smile" style="font-size:1.5rem; margin-bottom:10px; display:block;"></i>
        첫 번째 의견 제안자가 되어보세요!
      </div>
    `;
    return;
  }
  
  sortedSuggestions.forEach(sug => {
    container.innerHTML += `
      <div class="glass-panel" style="padding:16px; border:1px solid rgba(16,185,129,0.15); background:rgba(16,185,129,0.02); transition:transform 0.2s;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:6px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <strong style="color:#fff; font-size:0.85rem;">${sug.name} 님</strong>
            <span class="badge" style="background:rgba(16,185,129,0.12); color:#10b981; border:1px solid rgba(16,185,129,0.2); font-size:0.7rem; padding:2px 6px;">${sug.concern}</span>
          </div>
          <span style="font-size:0.7rem; color:var(--text-muted);">${sug.date}</span>
        </div>
        <p style="margin:0; font-size:0.82rem; color:var(--text-secondary); line-height:1.45; white-space:pre-wrap;">${sug.suggestion}</p>
      </div>
    `;
  });
}

function submitVisitorSuggestion(event) {
  event.preventDefault();
  
  const nameInput = document.getElementById('sug-input-name');
  const emailInput = document.getElementById('sug-input-email');
  const concernInput = document.getElementById('sug-input-concern');
  const textInput = document.getElementById('sug-input-text');
  
  if (!nameInput || !emailInput || !concernInput || !textInput) return;
  
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const concern = concernInput.value;
  const suggestion = textInput.value.trim();
  
  if (!name || !email || !suggestion) return;
  
  let maxNum = 0;
  visitorSuggestionsDb.forEach(s => {
    const match = s.id.match(/^SUG-(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  });
  const newId = `SUG-${String(maxNum + 1).padStart(4, '0')}`;
  
  const now = new Date();
  const dateStr = now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0') + ' ' +
    String(now.getHours()).padStart(2, '0') + ':' +
    String(now.getMinutes()).padStart(2, '0') + ':' +
    String(now.getSeconds()).padStart(2, '0');
    
  const newSug = {
    id: newId,
    name: name,
    email: email,
    concern: concern,
    suggestion: suggestion,
    date: dateStr
  };
  
  visitorSuggestionsDb.push(newSug);
  localStorage.setItem('nuri_visitor_suggestions', JSON.stringify(visitorSuggestionsDb));
  
  textInput.value = '';
  
  alert("의견 제안이 성공적으로 등록되었습니다. 감사합니다!");
  
  renderSuggestionsList();
}

// 2. Expert Community (B2B) Functions
function renderCommunityPosts() {
  const container = document.getElementById('community-posts-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  let list = communityPostsDb;
  if (currentCommunityFilter !== 'all') {
    list = communityPostsDb.filter(post => post.category === currentCommunityFilter);
  }
  
  const sortedPosts = [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  if (sortedPosts.length === 0) {
    container.innerHTML = `
      <div class="glass-panel" style="text-align:center; padding: 40px; color: var(--text-muted);">
        <i class="fa-solid fa-folder-open" style="font-size:2rem; margin-bottom:12px; display:block;"></i>
        해당 카테고리에 등록된 지식 공유글이 없습니다.
      </div>
    `;
    return;
  }
  
  const catLabels = {
    'academic': '<span class="badge" style="background:rgba(139,92,246,0.1); color:#a78bfa; border:1px solid #8b5cf6; font-size:0.72rem; padding:3px 8px;">🔬 학술연구</span>',
    'guide': '<span class="badge" style="background:rgba(16,185,129,0.1); color:#34d399; border:1px solid #10b981; font-size:0.72rem; padding:3px 8px;">🍳 조리가이드</span>',
    'coop': '<span class="badge" style="background:rgba(245,158,11,0.1); color:#fbbf24; border:1px solid #f59e0b; font-size:0.72rem; padding:3px 8px;">🤝 공동협력</span>'
  };
  
  sortedPosts.forEach(post => {
    container.innerHTML += `
      <div class="community-card glass-panel" style="padding:24px; border:1px solid rgba(255,255,255,0.06); transition: all 0.25s ease;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px; flex-wrap:wrap; gap:8px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
              ${catLabels[post.category] || post.category}
              <span style="font-size:0.75rem; color:var(--text-muted);"><i class="fa-solid fa-clock"></i> ${post.date}</span>
            </div>
            <h3 style="margin:0; font-size:1.05rem; color:#fff; font-weight:700; line-height:1.4;">${post.title}</h3>
          </div>
          <span style="font-size:0.75rem; color:var(--primary); font-weight:600; font-family:\'Outfit\',sans-serif;">${post.id}</span>
        </div>
        <p style="margin:0 0 16px; font-size:0.84rem; color:var(--text-secondary); line-height:1.55; white-space:pre-wrap;">${post.content}</p>
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.05); padding-top:12px;">
          <div style="display:flex; align-items:center; gap:8px; font-size:0.8rem; color:var(--text-muted);">
            <i class="fa-solid fa-user-doctor" style="color:var(--accent);"></i>
            <span>작성자: <strong style="color:var(--text-secondary);">${post.author}</strong></span>
          </div>
          <button class="btn btn-outline btn-xsmall" onclick="likePost('${post.id}')" style="font-size:0.72rem; padding:4px 10px;">
            <i class="fa-solid fa-heart" style="color:#ef4444; margin-right:4px;"></i> 공감하기
          </button>
        </div>
      </div>
    `;
  });
}

function filterPosts(cat, btn) {
  currentCommunityFilter = cat;
  const container = document.getElementById('community-cat-filters');
  if (container) {
    container.querySelectorAll('.btn').forEach(b => {
      b.classList.remove('active');
    });
  }
  if (btn) btn.classList.add('active');
  renderCommunityPosts();
}

function openPostModal() {
  const modal = document.getElementById('community-post-modal');
  if (modal) {
    modal.classList.add('open');
  }
}

function closePostModal() {
  const modal = document.getElementById('community-post-modal');
  if (modal) {
    modal.classList.remove('open');
  }
}

function submitCommunityPost(event) {
  event.preventDefault();
  
  const authorInput = document.getElementById('post-input-author');
  const catInput = document.getElementById('post-input-cat');
  const titleInput = document.getElementById('post-input-title');
  const contentInput = document.getElementById('post-input-content');
  
  if (!authorInput || !catInput || !titleInput || !contentInput) return;
  
  const author = authorInput.value.trim();
  const category = catInput.value;
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  
  if (!author || !title || !content) return;
  
  let maxNum = 0;
  communityPostsDb.forEach(p => {
    const match = p.id.match(/^POST-(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  });
  const newId = `POST-${String(maxNum + 1).padStart(4, '0')}`;
  
  const now = new Date();
  const dateStr = now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0') + ' ' +
    String(now.getHours()).padStart(2, '0') + ':' +
    String(now.getMinutes()).padStart(2, '0');
    
  const newPost = {
    id: newId,
    author: author,
    category: category,
    title: title,
    content: content,
    date: dateStr
  };
  
  communityPostsDb.push(newPost);
  localStorage.setItem('nuri_community_posts', JSON.stringify(communityPostsDb));
  
  authorInput.value = '';
  titleInput.value = '';
  contentInput.value = '';
  
  closePostModal();
  
  alert("학술/협력 정보 공유글이 성공적으로 등록되었습니다!");
  
  renderCommunityPosts();
}

function likePost(id) {
  alert("이 게시글에 공감하셨습니다!");
}

// 3. CRM Hub Functions (B2B)
function renderCrmHub() {
  renderCrmDashboard(document.getElementById('crm-search-input')?.value || "");
  renderCrmSources();
  renderCrmSuggestions();
}

function switchCrmSubTab(subTabId, btn) {
  // Update active state of button
  document.querySelectorAll('.crm-sub-tabs .btn').forEach(b => {
    b.classList.remove('active');
  });
  if (btn) btn.classList.add('active');

  // Switch visible panel
  document.querySelectorAll('.crm-sub-panel').forEach(p => {
    p.style.display = 'none';
  });
  
  const panelId = subTabId.replace('subtab-', 'crm-panel-');
  const targetPanel = document.getElementById(panelId);
  if (targetPanel) {
    targetPanel.style.display = 'block';
  }
}

function filterCrmSources(category, btn) {
  currentCrmSourceFilter = category;
  
  const container = document.getElementById('crm-sources-filters');
  if (container) {
    container.querySelectorAll('.btn').forEach(b => {
      b.classList.remove('active');
    });
  }
  if (btn) btn.classList.add('active');
  
  renderCrmSources();
}

function renderCrmSources() {
  const tbody = document.getElementById('crm-sources-table-body');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  let list = supplySourcesDb;
  if (currentCrmSourceFilter !== 'all') {
    list = supplySourcesDb.filter(item => item.category === currentCrmSourceFilter);
  }
  
  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding: 30px; color: var(--text-muted);">
          등록된 공급망 정보가 없습니다.
        </td>
      </tr>
    `;
    return;
  }
  
  const sourceCategoryLabels = {
    'ingredients': '<span class="badge" style="background:rgba(16,185,129,0.1); color:#10b981; border:1px solid #10b981;">🌿 원료 공급</span>',
    'mealkit': '<span class="badge" style="background:rgba(245,158,11,0.1); color:#f59e0b; border:1px solid #f59e0b;">🥗 밀키트 제조</span>',
    'technology': '<span class="badge" style="background:rgba(139,92,246,0.1); color:#8b5cf6; border:1px solid #8b5cf6;">🧬 기술 제공</span>',
    'education': '<span class="badge" style="background:rgba(59,130,246,0.1); color:#3b82f6; border:1px solid #3b82f6;">🎓 교육 정보</span>'
  };
  
  list.forEach(item => {
    tbody.innerHTML += `
      <tr style="border-bottom:1px solid var(--border-glass);">
        <td style="padding:12px 16px; font-size:0.82rem; font-family:\'Outfit\',sans-serif; color:var(--primary); font-weight:600;">${item.id}</td>
        <td style="padding:12px 16px; font-size:0.85rem; color:#fff; font-weight:600;">${item.name}</td>
        <td style="padding:12px 16px; font-size:0.82rem;">${sourceCategoryLabels[item.category] || item.category}</td>
        <td style="padding:12px 16px; font-size:0.82rem; color:var(--text-secondary); line-height:1.4;">
          <div style="font-weight:600; color:#fff;">${item.region}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${item.contact}</div>
        </td>
        <td style="padding:12px 16px; font-size:0.82rem; color:var(--text-secondary); line-height:1.4;">${item.description}</td>
        <td style="padding:12px 16px; font-size:0.82rem; color:var(--primary); font-weight:500;">${item.certification}</td>
        <td style="padding:12px 16px; font-size:0.82rem; color:#fff; font-weight:500;">${item.capacity}</td>
      </tr>
    `;
  });
}

function renderCrmSuggestions() {
  const tbody = document.getElementById('crm-feedback-table-body');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  const sortedSuggestions = [...visitorSuggestionsDb].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  if (sortedSuggestions.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding: 30px; color: var(--text-muted);">
          접수된 방문자 건의사항이 없습니다.
        </td>
      </tr>
    `;
    return;
  }
  
  sortedSuggestions.forEach(sug => {
    tbody.innerHTML += `
      <tr style="border-bottom:1px solid var(--border-glass);">
        <td style="padding:12px 16px; font-size:0.82rem; color:var(--text-muted);">${sug.date}</td>
        <td style="padding:12px 16px; font-size:0.85rem; color:#fff; font-weight:600;">${sug.name}</td>
        <td style="padding:12px 16px; font-size:0.82rem; color:var(--text-secondary);">${sug.email}</td>
        <td style="padding:12px 16px; font-size:0.82rem; color:var(--primary); font-weight:500;">${sug.concern}</td>
        <td style="padding:12px 16px; font-size:0.82rem; color:var(--text-secondary); line-height:1.4; white-space:pre-wrap;">${sug.suggestion}</td>
      </tr>
    `;
  });
}

function exportCrmSources(format) {
  if (supplySourcesDb.length === 0) {
    alert("내보낼 공급망 데이터가 없습니다.");
    return;
  }
  
  let text = "";
  if (format === 'json') {
    text = JSON.stringify(supplySourcesDb, null, 2);
  } else {
    text = "\ufeff고유 ID,업체/기관명,제공 분류,소재지,연락처,상세 역할 설명,주요 인증,공급 능력 (CAPA)\n";
    supplySourcesDb.forEach(item => {
      text += `"${item.id}","${item.name}","${item.category}","${item.region}","${item.contact}","${item.description.replace(/"/g, '""')}","${item.certification}","${item.capacity}"\n`;
    });
  }
  
  const blob = new Blob([text], { type: format === 'json' ? 'application/json' : 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `nuri_supply_sources_export.${format}`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportCrmSuggestions(format) {
  if (visitorSuggestionsDb.length === 0) {
    alert("내보낼 건의사항 데이터가 없습니다.");
    return;
  }
  
  let text = "";
  if (format === 'json') {
    text = JSON.stringify(visitorSuggestionsDb, null, 2);
  } else {
    text = "\ufeff접수 일시,이름,연락처 (이메일),관심사,제안 건의 내용\n";
    visitorSuggestionsDb.forEach(sug => {
      text += `"${sug.date}","${sug.name}","${sug.email}","${sug.concern}","${sug.suggestion.replace(/"/g, '""')}"\n`;
    });
  }
  
  const blob = new Blob([text], { type: format === 'json' ? 'application/json' : 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `nuri_visitor_suggestions_export.${format}`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ==========================================
// 🌐 K-약선요리 글로벌 진출 전략 제안서 연동 기능
// ==========================================

const FALLBACK_STRATEGY_MD = `# K-약선요리 글로벌 진출 다각화 및 비즈니스 전략 수립서

약선요리 완제품 밀키트는 신선도 유지, 콜드체인 물류비용, 그리고 국가별 엄격한 축산물·농산물 통관 규제(Quarantine)로 인해 직접 수출 장벽이 매우 높습니다. 

따라서 완제품 수출 대신 **원가율이 낮고 마진이 높으며 규제 장벽을 우회할 수 있는 지식재산권(IP), 핵심 원료 및 소스 표준화, 미디어 교육, D2C 커머스 모델**로 전환하는 것이 가장 실현 가능성이 높습니다. 본 문서에서는 이를 위한 구체적인 시장 조사 항목과 사업 전략 수립 방안을 다룹니다.

---

## 1. 4대 핵심 사업 모델 및 글로벌 전환 전략

\`\`\`mermaid
graph TD
    A[Mila K-Wellness Platform] --> B(1. IP & 알고리즘 SaaS)
    A --> C(2. 핵심 원물 및 건식 소스 표준화)
    A --> D(3. D2C 글로벌 이커머스)
    A --> E(4. 미디어 클래스 & 아카데미)

    B --> B1[현지 프랜차이즈 식단 설계 API 제공]
    C --> C1[농축 분말/액상 베이스 패키징 수출]
    D --> D1[상온 보존 전통차, 발효 소스 판매]
    E --> E1[동영상 조리법 + 글로벌 자격증 코스]
\`\`\`

### ① 레시피 노하우 및 알고리즘 라이선싱 (B2B SaaS / API)
*   **개념**: 현지 레스토랑, 급식 기업, 실버케어 시설이 Nuri Lab의 **7-AXIS 약선 추론 알고리즘 API**를 구독하여 현지 식재료와 결합한 맞춤 식단을 구성할 수 있도록 지원하는 모델입니다.
*   **전략**: 레시피 자체를 텍스트로 수출하는 것이 아니라, 현지인들의 체질과 현지 식자재 공급 상황에 맞게 칠정배합(상극 방지) 규칙을 자동 계산해 주는 **클라우드 연산 엔진**을 라이선싱합니다.

### ② 핵심 원물 및 건식 소스 표준화 (Ingredient Component Model)
*   **개념**: 완제품 밀키트 대신, 약선요리의 핵심 약리 효능을 내는 **동결건조 블록, 한방 육수 농축 액상/분말, 건식 소스 패키지**만 표준화하여 수출합니다.
*   **전략**: 수입국 현지에서 쉽게 구할 수 있는 신선육과 채소는 현지에서 조달하고, 맛과 약리 기능을 결정하는 핵심 베이스(예: '사군자탕 분말 베이스', '삼청 음청 믹스')만 한국에서 공급하여 관세 및 검역 통관을 쉽게 통과시킵니다.

### ③ 상온 보존 완제품 D2C 글로벌 쇼핑몰 (Global Cross-border E-commerce)
*   **개념**: 액상 파우치 차류, 건조 허브 티백, 전통 발효 천연 조미료(전통 장류) 등 상온 보관이 가능하고 유통기한이 1년 이상으로 긴 완제품 중심의 해외 직배송 및 현지 3PL 물류망 연동 쇼핑몰을 구축합니다.
*   **전략**: 글로벌 밀키트 배송망을 직접 구축하기보다, 프리미엄 웰빙 식품군을 큐레이션하여 Amazon 또는 현지 헬스푸드 스토어(예: Whole Foods Market) 입점 및 글로벌 D2C 채널을 타겟팅합니다.

### ④ 미디어 콘텐츠 기반 조리 교육 & 아카데미 (Edutech)
*   **개념**: 체질별 양생법, 전통 약리 조리 기법을 고화질 다국어 영상 및 가이드북으로 제작하고 온라인 아카데미(자격증 연계)를 개설합니다.
*   **전략**: 유튜브, 인스타그램 숏폼을 통한 바이럴 마케팅과 Udemy 등 글로벌 교육 플랫폼에 "K-Yakseon Masterclass"를 런칭하여 팬덤과 잠재적 B2B 구독 레드를 확보합니다.

---

## 2. 조사 및 전략 수립 방법론 (Action Plan)

이 다각화 모델을 정교화하기 위해 단계별로 수행해야 하는 조사 및 전략 수립 프로세스입니다.

### [1단계] 타겟 국가별 식약처 규제 및 통관 조사 (Regulatory Feasibility)
식재료와 건식 소스 수출의 성패는 통관 규제 해결에 달려 있습니다.
*   **조사 항목**:
    *   미국 FDA, 일본 후생노동성, 중동 Halal 가이드라인 분석.
    *   한약재 성분 중 식품 원료로 사용 가능한 품목과 불가한 품목 분류 (예: 인삼, 당귀, 감초의 식품 배합 한도 확인).
    *   완제품 소스의 멸균/살균 처리 기준(Retort 규격 등) 및 포장 표기법(Labeling) 규정 조사.
*   **수행 방법**: 한국농수산식품유통공사(aT), KOTRA 해외시장보고서 자료 분석 및 현지 관세사 조율.

### [2단계] 현지 식문화 매핑 및 표준 소스 개발 (R&D / Product-Market Fit)
한국인의 입맛에 맞는 한방 맛이 외국인에게는 거부감을 줄 수 있습니다.
*   **조사 항목**:
    *   타겟 국가의 주 소비 육류 및 조리 스타일 (예: 서구권의 오븐/그릴 조리 vs 아시아권의 볶음/탕 조리).
    *   서구권에서 선호하는 맛 프로필(감칠맛, 단맛의 선호도)과 거부감을 주는 한약 냄새의 완화 수준 연구.
*   **수행 방법**: 현지 한식당 연합 및 요리 학교 자문단과 협력하여, 한국식 약선 베이스를 스테이크 소스, 파스타 드레싱, 수프 베이스 등으로 변형 가능한 **하이브리드 조미 분말/소스 스펙 정립**.

### [3단계] B2B SaaS 및 미디어 플랫폼 아키텍처 기획 (Software Strategy)
*   **조사 항목**:
    *   해외 호텔 셰프, 병원 영양사, 웰니스 리조트 매니저가 식단 설계 시 겪는 애로사항 조사.
    *   글로벌 온라인 조리 강좌 수강료 수준 및 선호 플랫폼 UX 조사.
*   **수행 방법**: Nuri Lab의 Matrix Engine 추론 API를 영문화하고 외부 조리 시스템(POS, 주방 모니터)과 결합할 수 있는 통합 매뉴얼 작성.

---

## 3. 사업 기획서 초안 아키텍처 제안

사업 전략 수립 후 투자유치 및 파트너 발굴을 위해 작성할 **비즈니스 제안서(Pitch Deck)**의 필수 목차 구성안입니다.

1. **Executive Summary**: K-Food의 건강한 진화, 기술 기반 약선 IP 플랫폼
2. **The Problem**: 신선 메디푸드의 높은 물류 장벽과 국가별 농축산물 수입 통관 규제
3. **Our Solution**: 가볍고 확장성 높은 3대 핵심 모델
    * *Core 1*: 7-AXIS 약선 배합 AI 알고리즘 라이선싱 (API SaaS)
    * *Core 2*: 상온 수출이 가능한 표준 약리 건식 베이스 & 파우더 소스
    * *Core 3*: 글로벌 미디어 조리 아카데미 및 자격증 허브
4. **Market Size**: 글로벌 아답토젠 & 웰빙 대체 조미료 시장의 급성장세
5. **Business Model**: 알고리즘 구독료 + 원료 납품 마진 + 아카데미 교육비
6. **Milestones & Financials**: 1단계 연구개발 및 현지 규제 검증 -> 2단계 글로벌 이커머스 개시 -> 3단계 해외 B2B 프랜차이즈 연동 라이선싱 확장
`;

function renderFlowchartHTML(mermaidText) {
  return `
  <div class="strategy-flowchart" style="display:flex; flex-direction:column; align-items:center; margin: 30px 0; background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.05); padding:24px; border-radius:16px; box-shadow:inset 0 0 20px rgba(0,0,0,0.4);">
    <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:15px; font-weight:700;"><i class="fa-solid fa-diagram-project"></i> 글로벌 다각화 비즈니스 구조도</div>
    <div class="flow-root" style="display:flex; justify-content:center; width:100%;">
      <div class="flow-node root-node" style="background:rgba(16, 185, 129, 0.08); border:2px solid var(--primary); color:#fff; font-weight:800; padding:14px 24px; border-radius:12px; font-size:0.95rem; text-align:center; box-shadow:0 0 20px var(--primary-glow); display:flex; align-items:center; gap:8px;">
        <span style="font-size:1.2rem;">🧬</span> Mila K-Wellness Platform
      </div>
    </div>
    <div class="flow-connector-down" style="height: 25px; width: 2px; background: linear-gradient(to bottom, var(--primary), var(--text-muted)); margin: 5px 0;"></div>
    <div class="flow-branches" style="display:flex; gap:16px; justify-content:center; width:100%; flex-wrap:wrap; margin-top:5px;">
      
      <!-- Branch 1 -->
      <div class="flow-branch" style="display:flex; flex-direction:column; align-items:center; flex:1; min-width:200px; background:rgba(59,130,246,0.02); border:1px solid rgba(59,130,246,0.1); padding:16px; border-radius:12px; transition:all 0.3s; position:relative;" onmouseover="this.style.background='rgba(59,130,246,0.04)'; this.style.borderColor='rgba(59,130,246,0.3)';" onmouseout="this.style.background='rgba(59,130,246,0.02)'; this.style.borderColor='rgba(59,130,246,0.1)';">
        <div class="flow-node branch-node" style="background:rgba(59, 130, 246, 0.1); border:1px solid #3b82f6; color:#fff; font-weight:700; padding:10px 14px; border-radius:8px; font-size:0.82rem; text-align:center; display:flex; align-items:center; gap:6px; box-shadow:0 0 10px rgba(59, 130, 246, 0.15); width:100%; justify-content:center;">
          <span>💻</span> 1. IP & 알고리즘 SaaS
        </div>
        <div style="font-size:0.8rem; color:var(--text-muted); margin:8px 0;"><i class="fa-solid fa-arrow-down"></i></div>
        <div class="flow-node leaf-node" style="background:rgba(255,255,255,0.02); border:1px dashed rgba(255,255,255,0.15); color:var(--text-secondary); padding:8px 12px; border-radius:6px; font-size:0.75rem; text-align:center; min-height:48px; display:flex; align-items:center; justify-content:center; width:100%;">
          현지 프랜차이즈 식단 설계 API 제공
        </div>
      </div>

      <!-- Branch 2 -->
      <div class="flow-branch" style="display:flex; flex-direction:column; align-items:center; flex:1; min-width:200px; background:rgba(245,158,11,0.02); border:1px solid rgba(245,158,11,0.1); padding:16px; border-radius:12px; transition:all 0.3s; position:relative;" onmouseover="this.style.background='rgba(245,158,11,0.04)'; this.style.borderColor='rgba(245,158,11,0.3)';" onmouseout="this.style.background='rgba(245,158,11,0.02)'; this.style.borderColor='rgba(245,158,11,0.1)';">
        <div class="flow-node branch-node" style="background:rgba(245, 158, 11, 0.1); border:1px solid #f59e0b; color:#fff; font-weight:700; padding:10px 14px; border-radius:8px; font-size:0.82rem; text-align:center; display:flex; align-items:center; gap:6px; box-shadow:0 0 10px rgba(245, 158, 11, 0.15); width:100%; justify-content:center;">
          <span>🧪</span> 2. 핵심 원물 & 소스 표준화
        </div>
        <div style="font-size:0.8rem; color:var(--text-muted); margin:8px 0;"><i class="fa-solid fa-arrow-down"></i></div>
        <div class="flow-node leaf-node" style="background:rgba(255,255,255,0.02); border:1px dashed rgba(255,255,255,0.15); color:var(--text-secondary); padding:8px 12px; border-radius:6px; font-size:0.75rem; text-align:center; min-height:48px; display:flex; align-items:center; justify-content:center; width:100%;">
          농축 분말/액상 베이스 패키징 수출
        </div>
      </div>

      <!-- Branch 3 -->
      <div class="flow-branch" style="display:flex; flex-direction:column; align-items:center; flex:1; min-width:200px; background:rgba(16,185,129,0.02); border:1px solid rgba(16,185,129,0.1); padding:16px; border-radius:12px; transition:all 0.3s; position:relative;" onmouseover="this.style.background='rgba(16,185,129,0.04)'; this.style.borderColor='rgba(16,185,129,0.3)';" onmouseout="this.style.background='rgba(16,185,129,0.02)'; this.style.borderColor='rgba(16,185,129,0.1)';">
        <div class="flow-node branch-node" style="background:rgba(16, 185, 129, 0.1); border:1px solid var(--primary); color:#fff; font-weight:700; padding:10px 14px; border-radius:8px; font-size:0.82rem; text-align:center; display:flex; align-items:center; gap:6px; box-shadow:0 0 10px rgba(16, 185, 129, 0.15); width:100%; justify-content:center;">
          <span>🛒</span> 3. D2C 글로벌 이커머스
        </div>
        <div style="font-size:0.8rem; color:var(--text-muted); margin:8px 0;"><i class="fa-solid fa-arrow-down"></i></div>
        <div class="flow-node leaf-node" style="background:rgba(255,255,255,0.02); border:1px dashed rgba(255,255,255,0.15); color:var(--text-secondary); padding:8px 12px; border-radius:6px; font-size:0.75rem; text-align:center; min-height:48px; display:flex; align-items:center; justify-content:center; width:100%;">
          상온 보존 전통차, 발효 소스 판매
        </div>
      </div>

      <!-- Branch 4 -->
      <div class="flow-branch" style="display:flex; flex-direction:column; align-items:center; flex:1; min-width:200px; background:rgba(167,139,250,0.02); border:1px solid rgba(167,139,250,0.1); padding:16px; border-radius:12px; transition:all 0.3s; position:relative;" onmouseover="this.style.background='rgba(167,139,250,0.04)'; this.style.borderColor='rgba(167,139,250,0.3)';" onmouseout="this.style.background='rgba(167,139,250,0.02)'; this.style.borderColor='rgba(167,139,250,0.1)';">
        <div class="flow-node branch-node" style="background:rgba(167, 139, 250, 0.1); border:1px solid #a78bfa; color:#fff; font-weight:700; padding:10px 14px; border-radius:8px; font-size:0.82rem; text-align:center; display:flex; align-items:center; gap:6px; box-shadow:0 0 10px rgba(167, 139, 250, 0.15); width:100%; justify-content:center;">
          <span>🎓</span> 4. 미디어 클래스 & 아카데미
        </div>
        <div style="font-size:0.8rem; color:var(--text-muted); margin:8px 0;"><i class="fa-solid fa-arrow-down"></i></div>
        <div class="flow-node leaf-node" style="background:rgba(255,255,255,0.02); border:1px dashed rgba(255,255,255,0.15); color:var(--text-secondary); padding:8px 12px; border-radius:6px; font-size:0.75rem; text-align:center; min-height:48px; display:flex; align-items:center; justify-content:center; width:100%;">
          동영상 조리법 + 글로벌 자격증 코스
        </div>
      </div>

    </div>
  </div>
  `;
}

function parseInlineMarkdown(text) {
  let parsed = text.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#fff; font-weight:700;">$1</strong>');
  parsed = parsed.replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); padding:2px 6px; border-radius:4px; color:var(--primary); font-family:monospace; font-size:0.8rem;">$1</code>');
  return parsed;
}

function renderStrategyProposal(mdText) {
  const lines = mdText.split('\n');
  let html = '';
  let inList = false;
  let inMermaid = false;
  let mermaidText = '';

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    if (line.startsWith('```mermaid')) {
      inMermaid = true;
      mermaidText = '';
      continue;
    }
    if (inMermaid) {
      if (line.startsWith('```')) {
        inMermaid = false;
        html += renderFlowchartHTML(mermaidText);
        continue;
      }
      mermaidText += line + '\n';
      continue;
    }

    const listMatch = line.match(/^[\*\-]\s+(.*)$/);
    if (listMatch) {
      if (!inList) {
        html += '<ul style="margin: 10px 0 20px 20px; color: var(--text-secondary); line-height: 1.6; display: flex; flex-direction: column; gap: 8px;">';
        inList = true;
      }
      let content = parseInlineMarkdown(listMatch[1]);
      html += `<li>${content}</li>`;
      continue;
    } else {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
    }

    if (line === '') {
      continue;
    }

    if (line.startsWith('# ')) {
      html += `<h1 style="font-family:'Outfit', sans-serif; font-size: 1.8rem; font-weight:800; color: #fff; border-bottom: 2px solid rgba(255,255,255,0.05); padding-bottom: 12px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;"><i class="fa-solid fa-chart-line" style="color:var(--accent);"></i> ${line.slice(2)}</h1>`;
    } else if (line.startsWith('## ')) {
      html += `<h2 style="font-family:'Outfit', sans-serif; font-size: 1.35rem; font-weight:700; color: var(--primary); margin: 30px 0 15px; display: flex; align-items: center; gap: 8px; border-bottom: 1px dashed rgba(255,255,255,0.08); padding-bottom: 6px;"><i class="fa-solid fa-circle-chevron-right" style="font-size:1.1rem;"></i> ${line.slice(3)}</h2>`;
    } else if (line.startsWith('### ')) {
      let content = line.slice(4);
      let icon = '<i class="fa-solid fa-chevron-right" style="color:var(--accent); font-size:0.85rem;"></i>';
      if (content.includes('①')) icon = '<span style="color:#3b82f6; font-weight:900;">1️⃣</span>';
      else if (content.includes('②')) icon = '<span style="color:#f59e0b; font-weight:900;">2️⃣</span>';
      else if (content.includes('③')) icon = '<span style="color:#10b981; font-weight:900;">3️⃣</span>';
      else if (content.includes('④')) icon = '<span style="color:#a78bfa; font-weight:900;">4️⃣</span>';
      else if (content.includes('1단계')) icon = '<span class="step-badge" style="background:#ef4444; color:#fff; padding:2px 6px; border-radius:4px; font-size:0.7rem; font-weight:700; margin-right:5px;">Step 1</span>';
      else if (content.includes('2단계')) icon = '<span class="step-badge" style="background:#f59e0b; color:#fff; padding:2px 6px; border-radius:4px; font-size:0.7rem; font-weight:700; margin-right:5px;">Step 2</span>';
      else if (content.includes('3단계')) icon = '<span class="step-badge" style="background:#3b82f6; color:#fff; padding:2px 6px; border-radius:4px; font-size:0.7rem; font-weight:700; margin-right:5px;">Step 3</span>';
      
      html += `<h3 style="font-family:'Outfit', sans-serif; font-size: 1.1rem; font-weight:700; color: #fff; margin: 20px 0 10px; display: flex; align-items: center; gap: 8px;">${icon} ${content}</h3>`;
    } else if (line.startsWith('---')) {
      html += '<hr style="border:0; border-top: 1px solid rgba(255,255,255,0.05); margin: 25px 0;">';
    } else {
      let content = parseInlineMarkdown(line);
      html += `<p style="margin: 10px 0 15px; color: var(--text-secondary); font-size:0.9rem; line-height:1.6; text-align: justify;">${content}</p>`;
    }
  }

  if (inList) {
    html += '</ul>';
  }

  return html;
}

function openGlobalStrategyModal() {
  const modal = document.getElementById('global-strategy-modal');
  const body = document.getElementById('global-strategy-body');
  if (!modal || !body) return;

  modal.classList.add('open');
  body.innerHTML = '<div style="text-align:center; padding: 50px;"><i class="fa-solid fa-spinner fa-spin" style="font-size: 2rem; color: var(--accent);"></i><p style="margin-top:10px; color:var(--text-secondary);">전략 제안서 로딩 중...</p></div>';

  fetch('global_strategy_proposal.md')
    .then(res => {
      if (!res.ok) throw new Error('Network error');
      return res.text();
    })
    .then(text => {
      body.innerHTML = renderStrategyProposal(text);
    })
    .catch(err => {
      console.warn('Failed to fetch global_strategy_proposal.md, using fallback data:', err);
      body.innerHTML = renderStrategyProposal(FALLBACK_STRATEGY_MD);
    });
}

function closeGlobalStrategyModal() {
  const modal = document.getElementById('global-strategy-modal');
  if (modal) modal.classList.remove('open');
}

// Bind to window object for HTML access
window.openGlobalStrategyModal = openGlobalStrategyModal;
window.closeGlobalStrategyModal = closeGlobalStrategyModal;

// 웰니스 홈 실시간 날씨 위젯 업데이트
function updateWeatherWidget(season, weather, temp, location) {
  const iconEl = document.getElementById('weather-icon');
  const locEl = document.getElementById('weather-location');
  const tempStatusEl = document.getElementById('weather-temp-status');
  const foodEl = document.getElementById('weather-recommended-food');
  const tipEl = document.getElementById('weather-matching-tip');

  if (!iconEl || !locEl || !tempStatusEl || !foodEl || !tipEl) return;

  lastWeatherInfo = { season, weather, temp, location };

  const lang = currentLanguage || 'ko';

  // 날씨 아이콘 매핑
  const icons = {
    "맑음": "☀️",
    "비옴": "🌧️",
    "눈옴": "❄️",
    "바람/황사": "🌬️",
    "추움": "🥶",
    "더움": "🥵"
  };

  iconEl.innerText = icons[weather] || "☀️";
  locEl.innerText = getTranslation(location || "위치 미확인", lang);
  
  let tempText = temp !== null ? `${temp}°C` : "기온 정보 없음";
  if (lang === 'en') {
    tempText = temp !== null ? `${temp}°C` : "No temperature data";
  } else if (lang === 'ja') {
    tempText = temp !== null ? `${temp}°C` : "気温情報なし";
  } else if (lang === 'ar') {
    tempText = temp !== null ? `${temp}°C` : "لا توجد بيانات درجة الحرارة";
  }
  
  const locWeatherText = getTranslation(weather, lang);
  const weatherLabel = lang === 'en' ? 'Weather' : lang === 'ja' ? '天気' : lang === 'ar' ? 'الطقس' : '날씨';
  tempStatusEl.innerText = `${tempText} | ${weatherLabel} [${locWeatherText}]`;

  // 추천 요리명 가져오기
  const foodName = todaySelectionMap[season]?.[weather] || "보리";
  foodEl.innerText = getTranslation(foodName, lang);

  // 매칭 팁 커스텀 매핑
  const tips = {
    "봄": {
      "맑음": "기를 소통시키고 춘곤증을 해소하는 봄철 나물 요리입니다.",
      "비옴": "습기를 물리치고 비위에 기를 소통시키는 봄철 쑥부침개입니다.",
      "눈옴": "춘설의 갑작스러운 한기에 몸을 보하는 천궁과 당귀의 따뜻한 국물입니다.",
      "바람/황사": "황사 바람 미세먼지를 해독하고 호흡기를 보호하는 방풍나물입니다.",
      "추움": "꽃샘추위에 상한 위장을 데우고 기운을 보강하는 닭고기 요리입니다.",
      "더움": "갑자기 찾아온 더위에 몸의 기를 보호하는 나물 생채입니다."
    },
    "여름": {
      "맑음": "무더운 날씨에 체내 진액을 보충하고 열을 내려주는 메밀밀쌈입니다.",
      "비옴": "비 오는 날 몸에 머물기 쉬운 습기를 제거하고 기혈을 활성화하는 파전입니다.",
      "눈옴": "더위 속 이례적인 찬 바람에 몸의 기를 보호하는 시원한 미역국입니다.",
      "바람/황사": "고온 건조한 바람에 메마른 기관지를 촉촉하게 적셔주는 은이버섯 배숙입니다.",
      "추움": "여름 냉방병과 체온 저하를 막아주고 원기를 돋우는 한방 삼계탕입니다.",
      "더움": "폭염 속에 머리의 열을 내리고 피로를 풀어주는 시원한 메밀국수입니다."
    },
    "가을": {
      "맑음": "건조한 가을날 폐를 윤택하게 하고 신장을 보하는 든든한 산약 경단입니다.",
      "비옴": "비 오는 날 기운이 가라앉는 것을 방지하고 기혈 순환을 유도하는 백합 연근전입니다.",
      "눈옴": "초겨울 기습적인 눈에 폐와 기관지를 따뜻하게 보하는 도라지 갈비탕입니다.",
      "바람/황사": "건조한 가을바람으로부터 인후와 기관지를 보호하고 기침을 진정시키는 도라지탕입니다.",
      "추움": "쌀쌀한 바람에 상하기 쉬운 위장을 따뜻하게 보하고 기력을 돕는 복령 만두입니다.",
      "더움": "늦더위로 인한 갈증을 해소하고 진액을 생성하는 다섯 가지 맛의 오미자 화채입니다."
    },
    "겨울": {
      "맑음": "차가운 겨울날 혈액 순환을 돕고 몸을 속부터 따뜻하게 하는 구기자 대추차입니다.",
      "비옴": "겨울비에 몸이 눅눅하고 시릴 때 비위를 보호하고 기운을 돋우는 버섯전입니다.",
      "눈옴": "함박눈이 내릴 때 몸의 열을 지키고 피를 맑게 해주는 겨울 별미 매생이 굴국입니다.",
      "바람/황사": "겨울 황사와 건조한 공기로부터 목과 폐를 보호하는 도라지 만두입니다.",
      "추움": "한파 속에 관절과 뼈를 튼튼하게 하고 양기를 보충하는 뜨거운 도가니탕입니다.",
      "더움": "겨울철 실내 난방 열기로 답답해진 가슴을 시원하게 풀어주는 동태탕입니다."
    }
  };

  const rawTip = tips[season]?.[weather] || "현재 날씨 정보에 적합한 대표 식재료입니다. 클릭 시 상세 한방 효능 및 기전을 확인하실 수 있습니다.";
  tipEl.innerText = getTranslation(rawTip, lang);
}

// 사상 체질 초간단 자가진단 퀴즈
const quizQuestions = [
  {
    q: "평소 추위와 더위 중 어느 쪽을 더 심하게 느끼시나요?",
    options: [
      { text: "추위를 많이 타며 따뜻한 음료나 음식을 매우 선호한다", type: "소음인" },
      { text: "더위를 참지 못하며 겨울에도 시원한 음료를 즐겨 마신다", type: "소양인" },
      { text: "추위와 더위를 다 타지만, 여름에 특히 땀이 비 오듯 쏟아진다", type: "태음인" },
      { text: "더위를 아주 많이 타고, 특히 머리와 상체 쪽에 열감이 몰린다", type: "태양인" }
    ]
  },
  {
    q: "평소 소화 상태나 비위(위장) 기능은 어떠한가요?",
    options: [
      { text: "위장이 약해 소화가 자주 안 되거나 입이 짧은 편이다", type: "소음인" },
      { text: "소화력이 매우 뛰어나고 위장에 열이 많아 쉽게 허기진다", type: "소양인" },
      { text: "소화는 아주 잘 되며 식욕이 왕성하고 음식을 가리지 않는다", type: "태음인" },
      { text: "소화력은 보통이지만 가끔 목에 무언가 걸린 듯한 이물감이 든다", type: "태양인" }
    ]
  },
  {
    q: "자신의 체격이나 뼈대, 골격의 형태는 어떤 쪽에 속하나요?",
    options: [
      { text: "상체와 골격이 다소 왜소하고 균형 잡혔으나 뼈대가 가늘다", type: "소음인" },
      { text: "어깨와 가슴 부위가 발달한 반면 골반과 하체가 가냘프다", type: "소양인" },
      { text: "전반적으로 뼈대가 굵고 듬직하며 허리 부위가 튼튼하다", type: "태음인" },
      { text: "목덜미 기세가 좋고 머리가 크지만 허리 아래 다리가 약하다", type: "태양인" }
    ]
  }
];

let quizCurrentIndex = 0;
let quizAnswers = [];
let detectedConstitutionResult = "소음인";



// ─── [MODULARIZE] TRADITIONAL LOGIC MOVED TO app_traditional.js ───



// ─── B2C UX Simplification: Restored Helper Functions ───

function switchMediaTab(tab) {

const audioTabBtn = document.getElementById('media-tab-audio');

const videoTabBtn = document.getElementById('media-tab-video');

const audioContent = document.getElementById('media-content-audio');

const videoContent = document.getElementById('media-content-video');



if (!audioTabBtn || !videoTabBtn || !audioContent || !videoContent) return;



if (tab === 'audio') {

audioTabBtn.style.background = 'rgba(16, 185, 129, 0.15)';

audioTabBtn.style.borderColor = 'var(--primary)';

audioTabBtn.style.color = '#fff';



videoTabBtn.style.background = 'none';

videoTabBtn.style.borderColor = 'rgba(255, 255, 255, 0.1)';

videoTabBtn.style.color = 'var(--text-secondary)';



audioContent.style.display = 'flex';

videoContent.style.display = 'none';

} else {

videoTabBtn.style.background = 'rgba(16, 185, 129, 0.15)';

videoTabBtn.style.borderColor = 'var(--primary)';

videoTabBtn.style.color = '#fff';



audioTabBtn.style.background = 'none';

audioTabBtn.style.borderColor = 'rgba(255, 255, 255, 0.1)';

audioTabBtn.style.color = 'var(--text-secondary)';



audioContent.style.display = 'none';

videoContent.style.display = 'flex';



stopAudioDocent();

}

}

function moveSlide(n) {

const slides = document.querySelectorAll('.slider-slide');

if (slides.length === 0) return;

showSlide((currentSlideIndex + n + slides.length) % slides.length);

}

function selectSymptomCard(symptom, elem) {

const select = document.getElementById('symptom-select');

if (select) {

select.value = symptom;

select.dispatchEvent(new Event('change'));

}



// Highlight active card

const cards = document.querySelectorAll('.symptom-card');

cards.forEach(card => {

card.classList.remove('active');

card.style.borderColor = 'rgba(255, 255, 255, 0.06)';

card.style.background = 'rgba(255, 255, 255, 0.02)';

card.style.boxShadow = 'none';

});



if (elem) {

elem.classList.add('active');

elem.style.borderColor = 'var(--primary)';

elem.style.background = 'rgba(16, 185, 129, 0.08)';

elem.style.boxShadow = '0 0 15px var(--primary-glow)';

}



// Directly run inference on card click for premium interactive B2C feel

runInference();

}

function closeNuriStory() {

const modal = document.getElementById('nuri-story-modal');

if (modal) {

modal.style.display = 'none';

}

}

function currentSlide(n) {

showSlide(n);

startSlideShow(); // Reset timer

}

function toggleAudioDocent() {

if (isAudioPlaying) {

stopAudioDocent();

} else {

playAudioDocent();

}

}

function toggleAcademicDetails() {

const panel = document.getElementById('rnd-academic-details');

const icon = document.getElementById('toggle-academic-icon');

const btnText = document.querySelector('#toggle-academic-btn span');

if (!panel || !icon || !btnText) return;



isAcademicOpen = !isAcademicOpen;



if (isAcademicOpen) {

panel.style.maxHeight = panel.scrollHeight + "px";

icon.className = 'fa-solid fa-chevron-up';

btnText.innerText = getTranslation('🔬 R&D 한방 분석 상세 접기', currentLanguage);

} else {

panel.style.maxHeight = '0px';

icon.className = 'fa-solid fa-chevron-down';

btnText.innerText = getTranslation('🔬 R&D 한방 분석 상세 보기', currentLanguage);

}

}

function showNuriStory() {

const modal = document.getElementById('nuri-story-modal');

if (modal) {

modal.style.display = 'flex';

}

}

function playBrandVideo() {

const guideModal = document.getElementById('guide-modal');

const guideTitle = document.getElementById('guide-modal-title');

const guideBody = document.getElementById('guide-modal-body');



if (!guideModal || !guideTitle || !guideBody) return;



guideTitle.innerHTML = '<i class="fa-solid fa-circle-play"></i> Mila 브랜드 무비 상영관';

guideBody.innerHTML = '<div style="text-align: center; color: #fff;">' +

'<div style="position: relative; width: 100%; aspect-ratio: 16/9; background: #000; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 0 30px rgba(16,185,129,0.15);">' +

'<div style="font-size: 4rem; animation: float 3s infinite ease-in-out; margin-bottom: 15px;">🍲</div>' +

'<h3 style="margin: 0 0 8px; font-family: \'Outfit\', sans-serif; font-size: 1.25rem;">[Mila Brand Story Movie]</h3>' +

'<p style="font-size: 0.85rem; color: var(--text-muted); max-width: 400px; margin: 0 auto 20px;">' +

'"따뜻한 솥밥의 김이 모락모락 피어오르고, 정갈한 야생 국화차가 투명한 유리잔에 우려지는 아름다운 자연의 기운을 담았습니다."' +

'</p>' +

'<div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 6px; background: rgba(255,255,255,0.1);">' +

'<div style="width: 45%; height: 100%; background: var(--primary); animation: play-progress 10s infinite linear;"></div>' +

'</div>' +

'</div>' +

'<p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 15px; line-height: 1.6;">' +

'본 비디오는 Mila의 친환경 계약 재배 산지와 HACCP 표준 시설에서의 청결한 조리 가공 단계를 고화질 시네마틱 기법으로 소개합니다.' +

'</p>' +

'</div>' +

'<style>' +

'@keyframes play-progress {' +

'0% { width: 0%; }' +

'100% { width: 100%; }' +

'}' +

'</style>';



if (typeof openGuideModal === 'function') {

openGuideModal();

} else {

guideModal.classList.add('open');

}

}

function togglePersona() {

if (currentPersona === 'recipe') {

openAdminModal();

} else {

enterPlatform('recipe');

}

}

function showSlide(index) {

const slides = document.querySelectorAll('.slider-slide');

const dots = document.querySelectorAll('.slider-dots .dot');

if (slides.length === 0) return;



slides.forEach((slide, i) => {

slide.classList.remove('active', 'prev-slide', 'next-slide');



if (i === index) {

slide.classList.add('active');

} else if (i < index) {

slide.classList.add('prev-slide');

} else {

slide.classList.add('next-slide');

}

});



if (dots.length > 0) {

dots.forEach((dot, i) => {

if (i === index) dot.classList.add('active');

else dot.classList.remove('active');

});

}



currentSlideIndex = index;

}

function startSlideShow() {

if (slideInterval) clearInterval(slideInterval);

slideInterval = setInterval(() => {

moveSlide(1);

}, 5000);

}

function stopSlideShow() {

if (slideInterval) clearInterval(slideInterval);

}

function playAudioDocent() {

isAudioPlaying = true;

const playIcon = document.getElementById('audio-play-icon');

const wave = document.getElementById('audio-wave');

if (playIcon) playIcon.className = 'fa-solid fa-pause';

if (wave) wave.style.display = 'flex';



const currentUser = JSON.parse(localStorage.getItem('nuri_current_subscriber') || 'null');

const userName = currentUser ? currentUser.name : '고객';

const userConst = currentUser ? currentUser.constitution : '일반';



const statusText = document.getElementById('audio-status-text');

const timeText = document.getElementById('audio-time');

const transcriptBox = document.getElementById('audio-transcript-box');



if (statusText) {

statusText.innerText = '재생 중 (오디오 가이드)';

statusText.style.color = 'var(--primary)';

}



const lang = currentLanguage || 'ko';

const transcripts = [

{ time: 0, text: getTranslation("안녕하세요, Mila 웰니스 도슨트입니다. {name}님 반갑습니다.", lang).replace("{name}", userName) },

{ time: 5, text: getTranslation("오늘은 {constitution} 체질과 현재 절기에 맞춘 특별한 보양 해설을 들려드립니다.", lang).replace("{constitution}", getTranslation(userConst, lang)) },

{ time: 15, text: getTranslation("{constitution} 체질은 특히 체내 순환과 소화 기능 조율이 중요합니다.", lang).replace("{constitution}", getTranslation(userConst, lang)) },

{ time: 25, text: getTranslation("몸의 찬 기운을 몰아내고 따뜻한 온기를 채워주는 요리가 최적의 궁합이죠.", lang) },

{ time: 35, text: getTranslation("Mila 프리미엄 숍에 준비된 3년 숙성 된장과 홍삼 침출주를 눈여겨보세요.", lang) },

{ time: 48, text: getTranslation("이어서 인삼과 황기의 기력 보충 성분이 몸에 흡수되어 피로를 풀어줍니다.", lang) },

{ time: 60, text: getTranslation("가장 알맞은 섭취량과 음용 가이드에 맞춰 오늘 하루 건강을 채워보시기 바랍니다.", lang) },

{ time: 72, text: getTranslation("경청해 주셔서 감사합니다. 건강한 하루 되세요.", lang) }

];



audioTimer = setInterval(() => {

audioCurrentTime++;

if (audioCurrentTime >= audioDuration) {

stopAudioDocent();

audioCurrentTime = 0;

return;

}



if (timeText) {

const min = String(Math.floor(audioCurrentTime / 60)).padStart(2, '0');

const sec = String(audioCurrentTime % 60).padStart(2, '0');

const durationMin = String(Math.floor(audioDuration / 60)).padStart(2, '0');

const durationSec = String(audioDuration % 60).padStart(2, '0');

timeText.innerText = min + ":" + sec + " / " + durationMin + ":" + durationSec;

}



if (transcriptBox) {

const activeTranscript = [...transcripts].reverse().find(t => audioCurrentTime >= t.time);

if (activeTranscript) {

transcriptBox.innerHTML = '"' + activeTranscript.text + '"';

}

}

}, 1000);

}

function stopAudioDocent() {

isAudioPlaying = false;

const playIcon = document.getElementById('audio-play-icon');

const wave = document.getElementById('audio-wave');

if (playIcon) playIcon.className = 'fa-solid fa-play';

if (wave) wave.style.display = 'none';



const statusText = document.getElementById('audio-status-text');

if (statusText) {

statusText.innerText = '일시 정지됨';

statusText.style.color = 'var(--text-muted)';

}



if (audioTimer) {

clearInterval(audioTimer);

audioTimer = null;

}

}


function returnToGateway() {
  localStorage.removeItem('nuri_current_subscriber');
  localStorage.setItem('nuri_logged_out', 'true');
  pendingSubscriber = null;
  
  // Show Gateway, Hide Main App
  const gateway = document.getElementById('gateway-screen');
  const mainApp = document.getElementById('main-app-screen');
  if (gateway) gateway.style.display = 'block';
  if (mainApp) mainApp.style.display = 'none';
  
  const emailInput = document.getElementById('sub-email-input');
  const nameInput = document.getElementById('sub-name-input');
  if (emailInput) emailInput.value = '';
  if (nameInput) nameInput.value = '';
  
  currentPersona = 'gateway';
  document.body.className = '';
  
  location.reload();
}
window.returnToGateway = returnToGateway;

window.switchMediaTab = switchMediaTab;
window.moveSlide = moveSlide;
window.currentSlide = currentSlide;
window.selectSymptomCard = selectSymptomCard;
window.closeNuriStory = closeNuriStory;
window.showNuriStory = showNuriStory;
window.toggleAudioDocent = toggleAudioDocent;
window.playBrandVideo = playBrandVideo;
window.toggleAcademicDetails = toggleAcademicDetails;
window.togglePersona = togglePersona;

// ─── AI Marketing Automation System ───
function updateMarketingTargetCount() {
  const constFilter = document.getElementById('mkt-filter-const').value;
  const concernFilter = document.getElementById('mkt-filter-concern').value;
  
  let matches = subscribersDb || [];
  if (constFilter !== 'all') {
    matches = matches.filter(s => s.constitution.includes(constFilter));
  }
  if (concernFilter !== 'all') {
    matches = matches.filter(s => s.concern.includes(concernFilter));
  }
  
  const countEl = document.getElementById('mkt-target-count');
  if (countEl) {
    countEl.innerText = `${matches.length}명 매칭`;
  }
}

const mktTemplates = {
  custom: { subject: "", message: "" },
  seasonal: {
    subject: "[Mila 웰니스] {constitution}을 위한 절기별 맞춤 양생 식단 가이드",
    message: "안녕하세요, {name} 님.\n\n동의보감 및 칠정배합(상극 방지) 알고리즘 분석 결과, {constitution} 체질에 최적화된 절기 맞춤형 약선 레시피 가이드가 발행되었습니다.\n\n이번 주 섭취가 권장되는 핵심 한방 약재 조리법을 확인해 보세요!"
  },
  recipe: {
    subject: "[Mila R&D 신작] 특허 청구항 기반의 면역 활성 신제품 런칭 알림",
    message: "안녕하세요, {name} 님.\n\nNuri Lab R&D실에서 동결건조 공법으로 가공한 한방 기능성 식전주 '식전 약선 홍화주'와 입가심용 홍화차가 새로 추가되었습니다.\n\n체질별 추천 식단에서 바로 연동 레시피를 확인하세요."
  },
  promotion: {
    subject: "[Mila Premium] {constitution} 전용 웰니스 가이딩 무료 검진 쿠폰",
    message: "안녕하세요, {name} 님.\n\n{constitution} 맞춤 웰니스 파트너십 스파 및 리조트에서 사용 가능한 정량 진단 및 맞춤 약선 음료 시음 쿠폰이 발급되었습니다."
  }
};

function loadMarketingTemplate() {
  const tempVal = document.getElementById('mkt-template').value;
  const template = mktTemplates[tempVal] || mktTemplates.custom;
  
  const subEl = document.getElementById('mkt-subject');
  const msgEl = document.getElementById('mkt-message');
  if (subEl) subEl.value = template.subject;
  if (msgEl) msgEl.value = template.message;
}

function runMarketingCampaign() {
  const constFilter = document.getElementById('mkt-filter-const').value;
  const concernFilter = document.getElementById('mkt-filter-concern').value;
  const channel = document.getElementById('mkt-channel').value;
  const subjectTpl = document.getElementById('mkt-subject').value;
  const messageTpl = document.getElementById('mkt-message').value;
  
  const consoleLog = document.getElementById('mkt-console-log');
  if (!consoleLog) return;
  
  if (!subjectTpl || !messageTpl) {
    alert("캠페인 제목과 메시지 본문을 작성해 주세요.");
    return;
  }
  
  let matches = subscribersDb || [];
  if (constFilter !== 'all') {
    matches = matches.filter(s => s.constitution.includes(constFilter));
  }
  if (concernFilter !== 'all') {
    matches = matches.filter(s => s.concern.includes(concernFilter));
  }
  
  consoleLog.innerHTML = `[${new Date().toLocaleTimeString()}] [자동화] 캠페인 배칭 엔진 기동 중...\n`;
  consoleLog.innerHTML += `[${new Date().toLocaleTimeString()}] [자동화] 필터 분석: 체질=[${constFilter}], 관심사=[${concernFilter}], 채널=[${channel}]\n`;
  
  if (matches.length === 0) {
    consoleLog.innerHTML += `[${new Date().toLocaleTimeString()}] [경고] 매칭되는 가입자 대상이 없습니다. 필터를 조정하십시오.\n`;
    return;
  }
  
  consoleLog.innerHTML += `[${new Date().toLocaleTimeString()}] [자동화] 총 ${matches.length}명의 타깃 대상 추출 완료.\n`;
  consoleLog.innerHTML += `[${new Date().toLocaleTimeString()}] [자동화] 대기열 적재 완료. 마케팅 메일 전송 프로세스를 시작합니다...\n`;
  
  let idx = 0;
  function sendNext() {
    if (idx < matches.length) {
      const user = matches[idx];
      const name = user.name;
      const constitution = user.constitution;
      const email = user.email;
      
      const personalizedSubject = subjectTpl.replace(/{name}/g, name).replace(/{constitution}/g, constitution);
      const personalizedMessage = messageTpl.replace(/{name}/g, name).replace(/{constitution}/g, constitution);
      
      consoleLog.innerHTML += `[${new Date().toLocaleTimeString()}] [전송 대기] 대상자: ${name} (${email}) - ${constitution}\n`;
      
      setTimeout(() => {
        consoleLog.innerHTML += `<span style="color:#10b981;">[성공] ${name} 님께 발송 성공! (${channel === 'email' ? 'Email' : channel === 'sms' ? 'SMS' : 'App Push'})\n</span>`;
        consoleLog.scrollTop = consoleLog.scrollHeight;
        idx++;
        sendNext();
      }, 600);
    } else {
      consoleLog.innerHTML += `\n[${new Date().toLocaleTimeString()}] [완료] 총 ${matches.length}건의 타깃 마케팅 캠페인이 성공적으로 전송 완료되었습니다!`;
      consoleLog.scrollTop = consoleLog.scrollHeight;
    }
  }
  
  setTimeout(() => {
    sendNext();
  }, 500);
}

window.updateMarketingTargetCount = updateMarketingTargetCount;
window.loadMarketingTemplate = loadMarketingTemplate;
window.runMarketingCampaign = runMarketingCampaign;

// ─── Sasang Constitution Mini-Quiz Implementation ───

function startMiniQuiz() {
  quizCurrentIndex = 0;
  quizAnswers = [];
  const intro = document.getElementById('quiz-intro-section');
  const question = document.getElementById('quiz-question-section');
  const result = document.getElementById('quiz-result-section');
  if (intro) intro.style.display = 'none';
  if (question) question.style.display = 'block';
  if (result) result.style.display = 'none';
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const qNum = document.getElementById('quiz-q-num');
  const qText = document.getElementById('quiz-q-text');
  const container = document.getElementById('quiz-options-container');
  if (!qNum || !qText || !container) return;

  const currentQ = quizQuestions[quizCurrentIndex];
  qNum.innerText = `QUESTION ${quizCurrentIndex + 1} OF ${quizQuestions.length}`;
  qText.innerText = getTranslation(currentQ.q, currentLanguage);

  container.innerHTML = '';
  currentQ.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-outline';
    btn.style.width = '100%';
    btn.style.textAlign = 'left';
    btn.style.fontSize = '0.85rem';
    btn.style.padding = '10px 14px';
    btn.style.whiteSpace = 'normal';
    btn.style.wordBreak = 'break-all';
    btn.innerText = getTranslation(opt.text, currentLanguage);
    btn.onclick = () => selectQuizOption(opt.type);
    container.appendChild(btn);
  });
}

function selectQuizOption(type) {
  quizAnswers.push(type);
  if (quizCurrentIndex < quizQuestions.length - 1) {
    quizCurrentIndex++;
    renderQuizQuestion();
  } else {
    // Calculate result
    const counts = {};
    let maxCount = 0;
    let resultType = '소음인';
    quizAnswers.forEach(ans => {
      counts[ans] = (counts[ans] || 0) + 1;
      if (counts[ans] > maxCount) {
        maxCount = counts[ans];
        resultType = ans;
      }
    });
    detectedConstitutionResult = resultType;
    showQuizResult();
  }
}

function showQuizResult() {
  const question = document.getElementById('quiz-question-section');
  const result = document.getElementById('quiz-result-section');
  const rTitle = document.getElementById('quiz-result-title');
  const rDesc = document.getElementById('quiz-result-desc');

  if (question) question.style.display = 'none';
  if (result) result.style.display = 'block';

  if (rTitle) {
    rTitle.innerText = `${getTranslation('진단 결과', currentLanguage)}: ${getTranslation(detectedConstitutionResult, currentLanguage)}`;
  }
  if (rDesc) {
    let descKey = '';
    if (detectedConstitutionResult === '소음인') descKey = '소음인 (체온 저하가 잦고 비위 소화기가 약함)';
    else if (detectedConstitutionResult === '소양인') descKey = '소양인 (열감이 많고 신장/정혈이 부족함)';
    else if (detectedConstitutionResult === '태음인') descKey = '태음인 (체내 진액이 뭉치기 쉽고 호흡기가 약함)';
    else if (detectedConstitutionResult === '태양인') descKey = '태양인 (기운이 위로 솟구치기 쉬운 체질)';
    
    // Fallback if not found
    rDesc.innerText = getTranslation(descKey, currentLanguage) || descKey;
  }
}

function applyQuizResult() {
  const currentUser = JSON.parse(localStorage.getItem('nuri_current_subscriber') || 'null');
  if (currentUser) {
    currentUser.constitution = detectedConstitutionResult;
    localStorage.setItem('nuri_current_subscriber', JSON.stringify(currentUser));
  }
  
  // Update UI and trigger reload/refresh
  const userConstBadge = document.getElementById('user-const-badge');
  if (userConstBadge) {
    userConstBadge.innerText = getTranslation(detectedConstitutionResult, currentLanguage);
  }
  // Re-run inference and recipes
  if (typeof runInference === 'function') runInference();

  // Close or reset widget
  resetMiniQuiz();
  
  // Display alert
  alert(getTranslation('체질 진단 결과가 프로필에 성공적으로 적용되었습니다.', currentLanguage));
}

function resetMiniQuiz() {
  quizCurrentIndex = 0;
  quizAnswers = [];
  const intro = document.getElementById('quiz-intro-section');
  const question = document.getElementById('quiz-question-section');
  const result = document.getElementById('quiz-result-section');
  if (intro) intro.style.display = 'block';
  if (question) question.style.display = 'none';
  if (result) result.style.display = 'none';
}

window.startMiniQuiz = startMiniQuiz;
window.selectQuizOption = selectQuizOption;
window.applyQuizResult = applyQuizResult;
window.resetMiniQuiz = resetMiniQuiz;



