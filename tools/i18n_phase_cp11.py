from pathlib import Path

p = Path('/home/user/ym-laboratory/design-v1/mock/mock-common.js')
text = p.read_text(encoding='utf-8')

insert_after = "  const STORAGE_KEY = 'ym_design_mock_state_v1';\n"
i18n_block = r'''
  const LANG_KEY = 'ym_design_mock_lang_v1';
  const TEXTS = {
    '① 메인랜딩 — YM Laboratory': { en: '① Main Landing — YM Laboratory', ja: '① メインランディング — YM Laboratory', ar: '① الصفحة الرئيسية — YM Laboratory' },
    '② 대시보드 — YM Laboratory': { en: '② Dashboard — YM Laboratory', ja: '② ダッシュボード — YM Laboratory', ar: '② لوحة المعلومات — YM Laboratory' },
    '③ AI 약선 처방실 — YM Laboratory': { en: '③ AI Prescription Studio — YM Laboratory', ja: '③ AI薬膳処方室 — YM Laboratory', ar: '③ استوديو الوصفات بالذكاء الاصطناعي — YM Laboratory' },
    '④ 약선 비법서 — YM Laboratory': { en: '④ Medicinal Recipe Guide — YM Laboratory', ja: '④ 薬膳ガイド — YM Laboratory', ar: '④ دليل الوصفات العلاجية — YM Laboratory' },
    '⑤ 약선 문화원 — YM Laboratory': { en: '⑤ Medicinal Food Culture — YM Laboratory', ja: '⑤ 薬膳文化院 — YM Laboratory', ar: '⑤ مركز ثقافة الغذاء العلاجي — YM Laboratory' },
    '⑥ 전통발효 · 향토음식 — YM Laboratory': { en: '⑥ Traditional Fermentation · Local Cuisine — YM Laboratory', ja: '⑥ 伝統発酵・郷土料理 — YM Laboratory', ar: '⑥ التخمير التقليدي · المطبخ المحلي — YM Laboratory' },
    '⑦ 사용자 의견 · 후기 — YM Laboratory': { en: '⑦ Feedback & Reviews — YM Laboratory', ja: '⑦ フィードバック・レビュー — YM Laboratory', ar: '⑦ الآراء والمراجعات — YM Laboratory' },
    '⑧ 뷰티 진단 — YM Laboratory': { en: '⑧ Beauty Diagnosis — YM Laboratory', ja: '⑧ ビューティー診断 — YM Laboratory', ar: '⑧ تشخيص الجمال — YM Laboratory' },
    '⑨ 표준기능 & 7축 분류 — YM Laboratory': { en: '⑨ Standards & 7-Axis Classification — YM Laboratory', ja: '⑨ 標準機能＆7軸分類 — YM Laboratory', ar: '⑨ المعايير وتصنيف المحاور السبعة — YM Laboratory' },
    '⑩ 데이터 정규화 · 예외 관리 — YM Laboratory': { en: '⑩ Data Normalization · Exception Control — YM Laboratory', ja: '⑩ データ正規化・例外管理 — YM Laboratory', ar: '⑩ تطبيع البيانات · إدارة الاستثناءات — YM Laboratory' },
    '⑪ 데이터 매핑 흐름 뷰어 — YM Laboratory': { en: '⑪ Data Mapping Flow Viewer — YM Laboratory', ja: '⑪ データマッピングフロービューア — YM Laboratory', ar: '⑪ عارض تدفق ربط البيانات — YM Laboratory' },
    '⑫ 공동연구 설계기 — YM Laboratory': { en: '⑫ Joint Research Builder — YM Laboratory', ja: '⑫ 共同研究設計ツール — YM Laboratory', ar: '⑫ مصمم البحث المشترك — YM Laboratory' },
    '⑬ 전문가 커뮤니티 — YM Laboratory': { en: '⑬ Expert Community — YM Laboratory', ja: '⑬ 専門家コミュニティ — YM Laboratory', ar: '⑬ مجتمع الخبراء — YM Laboratory' },
    '⑭ 구독자 · CRM 센터 — YM Laboratory': { en: '⑭ Subscribers · CRM Center — YM Laboratory', ja: '⑭ 購読者・CRMセンター — YM Laboratory', ar: '⑭ المشتركين · مركز CRM — YM Laboratory' },
    '⑮ R&D 협력 & 비즈니스 — YM Laboratory': { en: '⑮ R&D Partnership & Business — YM Laboratory', ja: '⑮ R&D協力＆ビジネス — YM Laboratory', ar: '⑮ شراكات البحث والتطوير والأعمال — YM Laboratory' },
    '⑯ MILA 뷰티 — YM Laboratory': { en: '⑯ MILA Beauty — YM Laboratory', ja: '⑯ MILAビューティー — YM Laboratory', ar: '⑯ MILA بيوتي — YM Laboratory' },
    '⑰ MILA 프리미엄 숍 — YM Laboratory': { en: '⑰ MILA Premium Shop — YM Laboratory', ja: '⑰ MILAプレミアムショップ — YM Laboratory', ar: '⑰ متجر MILA المميز — YM Laboratory' },
    '메인랜딩': { en: 'Main Landing', ja: 'メインランディング', ar: 'الصفحة الرئيسية' },
    '대시보드': { en: 'Dashboard', ja: 'ダッシュボード', ar: 'لوحة المعلومات' },
    'AI 처방실': { en: 'AI Prescription', ja: 'AI処方室', ar: 'وصفات الذكاء الاصطناعي' },
    '약선 비법서': { en: 'Recipe Guide', ja: '薬膳ガイド', ar: 'دليل الوصفات' },
    '약선 문화원': { en: 'Culture Archive', ja: '文化アーカイブ', ar: 'أرشيف الثقافة' },
    '전통발효': { en: 'Fermentation', ja: '伝統発酵', ar: 'التخمير' },
    '피드백': { en: 'Feedback', ja: 'フィードバック', ar: 'الملاحظات' },
    '뷰티 자가진단': { en: 'Beauty Self Check', ja: 'ビューティー自己診断', ar: 'تشخيص الجمال الذاتي' },
    '7축 표준': { en: '7-Axis Standard', ja: '7軸標準', ar: 'معيار 7 محاور' },
    '정규화·예외': { en: 'Normalization & Exceptions', ja: '正規化・例外', ar: 'التطبيع والاستثناءات' },
    '매핑 뷰어': { en: 'Mapping Viewer', ja: 'マッピングビューア', ar: 'عارض الربط' },
    '공동연구 설계기': { en: 'Research Builder', ja: '共同研究設計ツール', ar: 'مصمم البحث' },
    '전문가 네트워크': { en: 'Expert Network', ja: '専門家ネットワーク', ar: 'شبكة الخبراء' },
    '운영 CRM': { en: 'Operations CRM', ja: '運営CRM', ar: 'إدارة CRM' },
    '공동연구 협력': { en: 'Research Partnership', ja: '共同研究協力', ar: 'شراكة البحث' },
    '일반 사용자': { en: 'General User', ja: '一般ユーザー', ar: 'مستخدم عام' },
    '전문가': { en: 'Expert', ja: '専門家', ar: 'خبير' },
    '운영자': { en: 'Operator', ja: '運営者', ar: 'مشغّل' },
    'NURI · 약선': { en: 'NURI · Medicinal Food', ja: 'NURI・薬膳', ar: 'NURI · الأغذية العلاجية' },
    'MILA 뷰티': { en: 'MILA Beauty', ja: 'MILAビューティー', ar: 'MILA بيوتي' },
    'MILA 숍': { en: 'MILA Shop', ja: 'MILAショップ', ar: 'متجر MILA' },
    '역할별로 바로 들어가기': { en: 'Enter by Role', ja: '役割別に入る', ar: 'الدخول حسب الدور' },
    '연구·글로벌 협업 구조': { en: 'Research & Global Collaboration', ja: '研究・グローバル協業構造', ar: 'هيكل البحث والتعاون العالمي' },
    '오늘의 추천': { en: "Today's Picks", ja: '今日のおすすめ', ar: 'اختيارات اليوم' },
    '둘러보기': { en: 'Browse', ja: '見る', ar: 'استكشاف' },
    '일반 사용자 시작 화면': { en: 'Consumer Entry Screen', ja: '一般ユーザー開始画面', ar: 'شاشة دخول المستهلك' },
    '여기는 소비자용 첫 화면입니다.': { en: 'This is the first screen for consumers.', ja: 'ここは消費者向けの最初の画面です。', ar: 'هذه هي الشاشة الأولى للمستهلكين.' },
    '처방 · 루틴 · 발효 · 뷰티 · 구매만 먼저 열리고, 전문가/운영 화면은 아래 별도 진입 버튼이나 접근 가드를 통해서만 들어갑니다.': { en: 'Prescription, routine, fermentation, beauty, and shopping open first. Expert and operator screens are entered only through dedicated buttons or the access gate below.', ja: '処方・ルーティン・発酵・ビューティー・購入が先に開き、専門家・運営画面は下の専用ボタンまたはアクセスガード経由でのみ入れます。', ar: 'تُفتح أولاً شاشات الوصفات والروتين والتخمير والجمال والشراء، أما شاشات الخبراء والمشغلين فلا يمكن دخولها إلا عبر الأزرار المخصصة أو بوابة الوصول أدناه.' },
    '전문가 모드 진입': { en: 'Enter Expert Mode', ja: '専門家モードへ', ar: 'الدخول إلى وضع الخبير' },
    '운영자 모드 진입': { en: 'Enter Operator Mode', ja: '運営者モードへ', ar: 'الدخول إلى وضع المشغّل' },
    '한국의 약선 경험과 전문가 협업 구조를,': { en: 'A platform that separates Korean medicinal food experiences and expert collaboration,', ja: '韓国の薬膳体験と専門家協業構造を、', ar: 'منصة تفصل بين تجربة الأغذية العلاجية الكورية وبنية تعاون الخبراء،' },
    '한 화면에서 분리해 보여주는 플랫폼': { en: 'on one screen by role', ja: 'ひとつの画面で役割別に分けて見せるプラットフォーム', ar: 'وتعرضها على شاشة واحدة بحسب الدور' },
    'YM Laboratory는 일반 사용자에게는 체질 진단·루틴·구매 흐름을, 전문가와 운영자에게는 기준·검증·협업 흐름을 분리해서 보여줍니다. 이제 어떤 역할로 보는지에 따라 메뉴와 진입 흐름이 달라집니다.': { en: 'YM Laboratory separates constitution diagnosis, routine, and shopping for consumers from standards, validation, and collaboration for experts and operators. Menus and entry flow now change by role.', ja: 'YM Laboratoryは、一般ユーザー向けの体質診断・ルーティン・購入フローと、専門家・運営者向けの基準・検証・協業フローを分けて表示します。役割に応じてメニューと導線が変わります。', ar: 'يفصل YM Laboratory بين تدفق التشخيص والروتين والشراء للمستهلكين، وبين تدفق المعايير والتحقق والتعاون للخبراء والمشغلين. وتتغير القوائم ومسارات الدخول بحسب الدور.' },
    '일반 사용자 흐름 시작 →': { en: 'Start Consumer Flow →', ja: '一般ユーザーフロー開始 →', ar: 'ابدأ مسار المستهلك ←' },
    '체질 진단 · 루틴 · 구매 흐름': { en: 'Diagnosis · Routine · Purchase Flow', ja: '体質診断・ルーティン・購入フロー', ar: 'التشخيص · الروتين · مسار الشراء' },
    '대시보드, AI 처방실, 전통발효, 뷰티, MILA 숍 중심으로 바로 확인합니다.': { en: 'Go straight into Dashboard, AI Prescription, Fermentation, Beauty, and the MILA Shop.', ja: 'ダッシュボード、AI処方室、伝統発酵、ビューティー、MILAショップをすぐ確認できます。', ar: 'ادخل مباشرة إلى لوحة المعلومات والوصفات بالذكاء الاصطناعي والتخمير والجمال ومتجر MILA.' },
    '누구나 바로 이용 가능': { en: 'Open to everyone', ja: '誰でもすぐ利用可能', ar: 'متاح للجميع فورًا' },
    '일반 사용자로 보기 →': { en: 'View as Consumer →', ja: '一般ユーザーとして見る →', ar: 'العرض كمستهلك →' },
    '기준 · 검증 · 공동연구 흐름': { en: 'Standards · Validation · Research Flow', ja: '基準・検証・共同研究フロー', ar: 'المعايير · التحقق · مسار البحث' },
    '7축 표준, 정규화, 매핑, 공동연구, 전문가 네트워크 중심으로 들어갑니다.': { en: 'Enter through 7-Axis standards, normalization, mapping, joint research, and the expert network.', ja: '7軸標準、正規化、マッピング、共同研究、専門家ネットワークを中心に入ります。', ar: 'ادخل عبر معايير المحاور السبعة والتطبيع والربط والبحث المشترك وشبكة الخبراء.' },
    '직접 URL 진입 시 접근 가드 표시': { en: 'Access gate appears on direct URL entry', ja: 'URL直接入力時はアクセスガードを表示', ar: 'تظهر بوابة الوصول عند الدخول المباشر بالرابط' },
    '전문가 화면으로 보기 →': { en: 'View Expert Workspace →', ja: '専門家画面を見る →', ar: 'عرض مساحة الخبير →' },
    '구독 · VIP · 캠페인 운영 흐름': { en: 'Subscription · VIP · Campaign Flow', ja: '購読・VIP・キャンペーン運営フロー', ar: 'مسار الاشتراكات · VIP · الحملات' },
    '운영 CRM, 이탈위험 관리, 캠페인 실행, 매출 관리를 전용으로 확인합니다.': { en: 'Open a dedicated view for operations CRM, churn-risk control, campaign execution, and revenue tracking.', ja: '運営CRM、離脱リスク管理、キャンペーン実行、売上管理を専用に確認します。', ar: 'اعرض لوحة مخصصة لإدارة CRM ومخاطر التسرب وتنفيذ الحملات ومتابعة الإيرادات.' },
    '운영 전용 가드 후 진입': { en: 'Operator-only gate before entry', ja: '運営専用ガード後に入場', ar: 'بوابة خاصة بالمشغّل قبل الدخول' },
    '운영자 화면으로 보기 →': { en: 'View Operator Workspace →', ja: '運営者画面を見る →', ar: 'عرض مساحة المشغّل →' },
    '내 활동 대시보드': { en: 'My Activity Dashboard', ja: 'マイアクティビティダッシュボード', ar: 'لوحة نشاطي' },
    '일반 사용자가 진단 이후 바로 이어서 쓰는 화면입니다. 오늘 할 일, 기록, 주문·구독, 후기를 한 흐름에서 관리합니다.': { en: 'A consumer screen used right after diagnosis. It manages today’s tasks, logs, orders, subscriptions, and reviews in one flow.', ja: '診断直後に一般ユーザーが続けて使う画面です。今日のタスク、記録、注文・購読、レビューを一つの流れで管理します。', ar: 'هذه شاشة يستخدمها المستهلك مباشرة بعد التشخيص. وتدير مهام اليوم والسجلات والطلبات والاشتراكات والمراجعات في تدفق واحد.' },
    '증상 기반 약선 처방 시작': { en: 'Start Symptom-Based Prescription', ja: '症状ベースの薬膳処方を開始', ar: 'ابدأ الوصفة العلاجية حسب الأعراض' },
    '텍스트·음성·사진 중 편한 방식으로 입력하면, 증상 해석부터 체질 흐름 정리, 레시피·원료·상품 제안까지 한 번에 이어지는 약선 처방을 제공합니다.': { en: 'Enter by text, voice, or photo, and receive a connected medicinal-food prescription from symptom interpretation to constitution flow, recipes, ingredients, and products.', ja: 'テキスト・音声・写真のいずれかで入力すると、症状解釈から体質整理、レシピ・原料・商品提案まで一度につながる薬膳処方を提供します。', ar: 'أدخل بالنص أو الصوت أو الصورة، وستحصل على وصفة غذائية علاجية متصلة تبدأ بتحليل الأعراض وتصل إلى نوع البنية والوصفات والمكونات والمنتجات.' },
    '약선 레시피 아카이브': { en: 'Medicinal Recipe Archive', ja: '薬膳レシピアーカイブ', ar: 'أرشيف الوصفات العلاجية' },
    '체질·증상·계절 기준으로 약선 레시피를 탐색하고, 이후 처방·발효·상품 연결로 이어질 수 있도록 정리한 레시피 아카이브입니다.': { en: 'A recipe archive organized so users can explore medicinal recipes by constitution, symptoms, and season, then continue into prescription, fermentation, and product links.', ja: '体質・症状・季節で薬膳レシピを探し、その後の処方・発酵・商品連携へつながるよう整理したアーカイブです。', ar: 'أرشيف منظم يتيح استكشاف الوصفات العلاجية بحسب البنية والأعراض والموسم، ثم الانتقال إلى الوصفات العلاجية والتخمير والمنتجات.' },
    '절기 · 지역 · 향토음식 아카이브': { en: 'Season · Region · Local Food Archive', ja: '節気・地域・郷土料理アーカイブ', ar: 'أرشيف المواسم والمناطق والأطعمة المحلية' },
    '절기 흐름과 지역 향토음식을 함께 보며, 한국 식문화 자산이 약선·발효·프리미엄 레시피로 이어지는 배경을 이해하는 아카이브입니다.': { en: 'An archive that explains how Korean food culture assets connect to medicinal food, fermentation, and premium recipes through seasonal flow and regional dishes.', ja: '節気の流れと地域の郷土料理を通して、韓国の食文化資産が薬膳・発酵・プレミアムレシピへつながる背景を理解するアーカイブです。', ar: 'أرشيف يشرح كيف ترتبط أصول الثقافة الغذائية الكورية بالأغذية العلاجية والتخمير والوصفات المميزة عبر المواسم والأطباق المحلية.' },
    '전통발효 · 원료 · 제품 연결': { en: 'Traditional Fermentation · Ingredient · Product Flow', ja: '伝統発酵・原料・製品連結', ar: 'ربط التخمير التقليدي بالمكونات والمنتجات' },
    '전통주, 장류, 발효청, 식초, 발효액, 프리미엄 소금과 조미 라인을 한곳에서 보고, 전통발효가 원료·레시피·상품으로 이어지는 흐름을 함께 확인합니다.': { en: 'See traditional liquor, sauces, fermented syrups, vinegar, extracts, premium salt, and seasoning lines in one place, and follow how fermentation connects ingredients, recipes, and products.', ja: '伝統酒、醤類、発酵シロップ、酢、発酵液、プレミアム塩・調味ラインを一か所で見ながら、伝統発酵が原料・レシピ・商品へつながる流れを確認します。', ar: 'اعرض المشروبات التقليدية والصلصات والعصائر المخمرة والخل والمستخلصات والملح المميز وخطوط التوابل في مكان واحد، وتتبّع كيف يربط التخمير المكونات بالوصفات والمنتجات.' },
    '구매자 후기 · 사용 경험': { en: 'Buyer Reviews · Usage Experience', ja: '購入者レビュー・使用体験', ar: 'مراجعات المشترين وتجربة الاستخدام' },
    '실사용자의 구매 후 변화, 발효 진행 기록, 루틴 적용 경험을 모아 다음 구매와 재처방 판단의 근거로 활용합니다.': { en: 'Collects post-purchase changes, fermentation progress, and routine-use experiences to support the next purchase and renewed prescription decisions.', ja: '購入後の変化、発酵進行記録、ルーティン適用体験を集め、次の購入や再処方判断の根拠に活用します。', ar: 'يجمع التغيّرات بعد الشراء وتقدّم التخمير وتجارب تطبيق الروتين لدعم قرار الشراء التالي وتجديد الوصفة.' },
    '뷰티 자가진단 · 맞춤 처방': { en: 'Beauty Self Check · Personalized Guidance', ja: 'ビューティー自己診断・カスタム提案', ar: 'التشخيص الذاتي للجمال · التوجيه المخصص' },
    '피부·모발·컨디션을 빠르게 진단한 뒤, MILA 뷰티 라인과 연결되는 맞춤 루틴·원료·제품 방향을 제안합니다.': { en: 'Quickly assess skin, hair, and condition, then suggest routines, ingredients, and product directions connected to the MILA Beauty line.', ja: '肌・毛髪・コンディションを素早く診断し、MILAビューティーラインにつながるルーティン・原料・製品の方向性を提案します。', ar: 'قيّم البشرة والشعر والحالة بسرعة، ثم احصل على روتين ومكونات واتجاهات منتجات مرتبطة بخط MILA Beauty.' },
    '연구 기준과 7축 체계': { en: 'Research Standards and 7-Axis Framework', ja: '研究基準と7軸体系', ar: 'معايير البحث وإطار المحاور السبعة' },
    '이 화면은 일반 사용자 구매 화면이 아니라 전문가용 기준 화면입니다. YM Laboratory는 체질·증상·원료·조리·계절·주의·근거를 하나의 공통 언어로 정리한 7축 기준 체계를 운영합니다.': { en: 'This is not a consumer shopping screen but an expert standards screen. YM Laboratory runs a 7-axis system that organizes constitution, symptoms, ingredients, cooking, season, cautions, and evidence into one common language.', ja: 'この画面は一般ユーザーの購入画面ではなく、専門家向けの基準画面です。YM Laboratoryは、体質・症状・原料・調理・季節・注意・根拠を一つの共通言語に整理した7軸基準体系を運用しています。', ar: 'هذه ليست شاشة تسوق للمستهلك بل شاشة معايير للخبراء. يدير YM Laboratory نظامًا من 7 محاور ينظم البنية والأعراض والمكونات والطهي والموسم والتحذيرات والأدلة ضمن لغة مشتركة واحدة.' },
    '데이터 정규화 · 예외 관리': { en: 'Data Normalization · Exception Control', ja: 'データ正規化・例外管理', ar: 'تطبيع البيانات · إدارة الاستثناءات' },
    '원료명, 동의어, 품질, 원산지, 기준값을 표준화하고 예외 케이스를 별도로 관리하는 내부 운영 페이지입니다.': { en: 'An internal operations page that standardizes ingredient names, synonyms, quality, origin, and baseline values while managing exceptions separately.', ja: '原料名、同義語、品質、原産地、基準値を標準化し、例外ケースを別管理する内部運営ページです。', ar: 'صفحة تشغيل داخلية تقوم بتوحيد أسماء المكونات والمرادفات والجودة والمنشأ والقيم المرجعية مع إدارة الحالات الاستثنائية بشكل منفصل.' },
    '데이터 매핑 흐름 뷰어': { en: 'Data Mapping Flow Viewer', ja: 'データマッピングフロービューア', ar: 'عارض تدفق ربط البيانات' },
    '원시 입력 → 표준화 → 7축 분류 → 점수화 → 최종 처방. 각 단계 결과를 단계별로 클릭하면 들어가 볼 수 있습니다.': { en: 'Raw input → normalization → 7-axis classification → scoring → final prescription. Click each stage to inspect its output.', ja: '生入力 → 標準化 → 7軸分類 → スコア化 → 最終処方。各段階の結果をクリックして確認できます。', ar: 'إدخال خام ← تطبيع ← تصنيف 7 محاور ← تقييم ← وصفة نهائية. يمكنك النقر على كل مرحلة لفحص نتيجتها.' },
    '전문가 · 셰프 · 크리에이터 네트워크': { en: 'Expert · Chef · Creator Network', ja: '専門家・シェフ・クリエイターネットワーク', ar: 'شبكة الخبراء والطهاة والمبدعين' },
    'YM Laboratory는 약선 전문요리사, 산야초/심마니 네트워크, 연구자, 유튜버와의 협업을 통해 레시피와 프리미엄 제품을 함께 확장합니다. 이 페이지는 향후 해외 셰프·요리학교·커뮤니티와 연결될 글로벌 협업 허브의 시작점입니다.': { en: 'YM Laboratory expands recipes and premium products together with medicinal chefs, herbal foraging networks, researchers, and creators. This page is the starting point of a global collaboration hub that can later connect overseas chefs, culinary schools, and communities.', ja: 'YM Laboratoryは薬膳専門シェフ、山野草ネットワーク、研究者、クリエイターとの協業でレシピとプレミアム商品を拡張します。このページは将来、海外シェフ・料理学校・コミュニティとつながるグローバル協業ハブの出発点です。', ar: 'يوسع YM Laboratory وصفاته ومنتجاته المميزة بالتعاون مع طهاة الأغذية العلاجية وشبكات الأعشاب والباحثين وصنّاع المحتوى. وهذه الصفحة هي نقطة البداية لمركز تعاون عالمي يمكن أن يرتبط لاحقًا بالطهاة والمدارس المجتمعات الدولية.' },
    '구독자 · 리드 · 운영 CRM': { en: 'Subscribers · Leads · Operations CRM', ja: '購読者・リード・運営CRM', ar: 'المشتركون · العملاء المحتملون · إدارة CRM' },
    '운영자가 구독, 이탈위험, VIP, 캠페인을 관리하는 전용 화면입니다. 일반 사용자 루틴 화면과 분리된 운영 흐름으로 정리했습니다.': { en: 'A dedicated screen for operators to manage subscriptions, churn risk, VIPs, and campaigns. It is organized as an operations flow separate from the consumer routine view.', ja: '運営者が購読、離脱リスク、VIP、キャンペーンを管理する専用画面です。一般ユーザーのルーティン画面とは分離した運営フローとして整理しました。', ar: 'هذه شاشة مخصصة للمشغّلين لإدارة الاشتراكات ومخاطر التسرب وVIP والحملات. وقد تم تنظيمها كتدفق تشغيل منفصل عن شاشة روتين المستخدم العام.' },
    '공동연구 · 글로벌 파트너십': { en: 'Joint Research · Global Partnerships', ja: '共同研究・グローバルパートナーシップ', ar: 'البحث المشترك · الشراكات العالمية' },
    'YM Laboratory는 대학, 연구기관, 전문 셰프, 산지 네트워크, 브랜드, 호텔, 글로벌 커뮤니티와 함께 한국의 약선·발효·산야초 자산을 레시피·상품·교육·수출 구조로 확장할 수 있는 협업 라인을 설계합니다.': { en: 'YM Laboratory designs collaboration lines with universities, research institutes, chefs, sourcing networks, brands, hotels, and global communities to expand Korean medicinal food, fermentation, and wild herb assets into recipes, products, education, and exports.', ja: 'YM Laboratoryは大学、研究機関、専門シェフ、産地ネットワーク、ブランド、ホテル、グローバルコミュニティと共に、韓国の薬膳・発酵・山野草資産をレシピ・商品・教育・輸出へ拡張する協業ラインを設計します。', ar: 'يصمم YM Laboratory مسارات تعاون مع الجامعات والمؤسسات البحثية والطهاة وشبكات التوريد والعلامات التجارية والفنادق والمجتمعات العالمية لتوسيع أصول الأغذية العلاجية الكورية والتخمير والأعشاب البرية إلى وصفات ومنتجات وتعليم وتصدير.' },
    'MILA 프리미엄 숍': { en: 'MILA Premium Shop', ja: 'MILAプレミアムショップ', ar: 'متجر MILA المميز' },
    '일반 사용자가 실제로 둘러보고 담고 결제 흐름을 확인하는 구매 화면입니다. 한방 화장, 전통발효, 정기배송, VIP 상품까지 하나의 숍에서 연결하되, 전문가 기준은 별도 흐름으로 분리해 보여줍니다.': { en: 'A purchase screen where consumers can browse, add items, and follow checkout flow. Herbal beauty, traditional fermentation, subscriptions, and VIP products are connected in one shop while expert standards remain in a separate flow.', ja: '一般ユーザーが実際に見て、カートに入れ、決済フローを確認する購入画面です。韓方化粧品、伝統発酵、定期配送、VIP商品を一つのショップでつなぎつつ、専門家基準は別フローに分けて見せます。', ar: 'هذه شاشة شراء يمكن للمستهلك فيها التصفح والإضافة إلى السلة ومتابعة الدفع. يتم جمع التجميل العشبي والتخمير التقليدي والاشتراكات ومنتجات VIP في متجر واحد، بينما تبقى معايير الخبراء في تدفق منفصل.' },
    '카테고리': { en: 'Categories', ja: 'カテゴリ', ar: 'الفئات' },
    '카테고리 상세': { en: 'Category Details', ja: 'カテゴリ詳細', ar: 'تفاصيل الفئة' },
    '상품 상세': { en: 'Product Details', ja: '商品詳細', ar: 'تفاصيل المنتج' },
    '한방 화장 라인': { en: 'Herbal Beauty Line', ja: '韓方ビューティーライン', ar: 'خط التجميل العشبي' },
    '발효 라이프': { en: 'Fermentation Life', ja: '発酵ライフ', ar: 'حياة التخمير' },
    '정기배송 키트': { en: 'Subscription Kits', ja: '定期配送キット', ar: 'حِزم الاشتراك' },
    'VIP 한정': { en: 'VIP Exclusive', ja: 'VIP限定', ar: 'حصري VIP' },
    '상세 보기 →': { en: 'View Details →', ja: '詳細を見る →', ar: 'عرض التفاصيل →' },
    '바로가기 →': { en: 'Open →', ja: '開く →', ar: 'فتح →' },
    '만들기 →': { en: 'Make It →', ja: '作る →', ar: 'اصنعه →' },
    '연구 기준과 7축 체계': { en: 'Research Standards and 7-Axis Framework', ja: '研究基準と7軸体系', ar: 'معايير البحث وإطار المحاور السبعة' },
    '국제 협업을 위한 7축 기준': { en: '7-Axis Standards for Global Collaboration', ja: '国際協業のための7軸基準', ar: 'معايير 7 محاور للتعاون الدولي' },
    '이 프레임이 필요한 이유': { en: 'Why This Framework Matters', ja: 'このフレームが必要な理由', ar: 'لماذا هذا الإطار مهم' },
    '예외 케이스 관리 (12)': { en: 'Exception Cases (12)', ja: '例外ケース管理 (12)', ar: 'إدارة الحالات الاستثنائية (12)' },
    '현재 처리 흐름': { en: 'Current Processing Flow', ja: '現在の処理フロー', ar: 'تدفق المعالجة الحالي' },
    '최근 매핑 결과': { en: 'Recent Mapping Results', ja: '最近のマッピング結果', ar: 'أحدث نتائج الربط' },
    '공동연구 단계 체크': { en: 'Joint Research Stage Check', ja: '共同研究段階チェック', ar: 'فحص مراحل البحث المشترك' },
    '네트워크 확장 축': { en: 'Network Expansion Axes', ja: 'ネットワーク拡張軸', ar: 'محاور توسيع الشبكة' },
    '운영 캠페인 (활성 2)': { en: 'Operations Campaigns (2 Active)', ja: '運営キャンペーン（2件稼働）', ar: 'حملات التشغيل (2 نشطة)' },
    '글로벌 확장 로드맵': { en: 'Global Expansion Roadmap', ja: 'グローバル拡張ロードマップ', ar: 'خارطة التوسع العالمية' },
    '오늘의 컨디션': { en: "Today's Condition", ja: '今日のコンディション', ar: 'حالة اليوم' },
    '오늘의 추천 루틴': { en: "Today's Recommended Routine", ja: '今日のおすすめルーティン', ar: 'روتين اليوم المقترح' },
    'MILA 라인 제품': { en: 'MILA Line Products', ja: 'MILAライン製品', ar: 'منتجات خط MILA' },
    '신뢰·협업 연결': { en: 'Trust & Collaboration Links', ja: '信頼・協業リンク', ar: 'روابط الثقة والتعاون' },
    '일반 사용자 화면으로 이동': { en: 'Go to Consumer Screen', ja: '一般ユーザー画面へ移動', ar: 'الانتقال إلى شاشة المستهلك' },
    '메인으로 이동': { en: 'Go to Main', ja: 'メインへ移動', ar: 'الانتقال إلى الرئيسية' },
    '전문가 전용 화면입니다.': { en: 'This screen is for experts only.', ja: 'この画面は専門家専用です。', ar: 'هذه الشاشة مخصصة للخبراء فقط.' },
    '운영자 전용 화면입니다.': { en: 'This screen is for operators only.', ja: 'この画面は運営者専用です。', ar: 'هذه الشاشة مخصصة للمشغّلين فقط.' },
    '현재 모드': { en: 'Current mode', ja: '現在モード', ar: 'الوضع الحالي' },
    '인증되지 않음': { en: 'Not authenticated', ja: '未認証', ar: 'غير موثّق' },
    '이 화면은 구독, 이탈위험, VIP, 캠페인을 관리하는 운영자 전용 흐름입니다.': { en: 'This is an operator-only flow for managing subscriptions, churn risk, VIPs, and campaigns.', ja: 'この画面は購読、離脱リスク、VIP、キャンペーンを管理する運営者専用フローです。', ar: 'هذا مسار خاص بالمشغّلين لإدارة الاشتراكات ومخاطر التسرب وVIP والحملات.' },
    '이 화면은 일반 사용자 구매 흐름이 아니라 기준·검증·협업을 다루는 전문가 전용 흐름입니다.': { en: 'This is an expert-only flow for standards, validation, and collaboration rather than consumer shopping.', ja: 'この画面は一般ユーザーの購入フローではなく、基準・検証・協業を扱う専門家専用フローです。', ar: 'هذا مسار خاص بالخبراء للمعايير والتحقق والتعاون وليس للتسوق الاستهلاكي.' },
    '운영자 접근 코드': { en: 'Operator access code', ja: '運営者アクセスコード', ar: 'رمز وصول المشغّل' },
    '전문가 접근 코드': { en: 'Expert access code', ja: '専門家アクセスコード', ar: 'رمز وصول الخبير' },
    '코드 인증 후 들어가기': { en: 'Enter with Code Verification', ja: 'コード認証で入る', ar: 'الدخول بعد التحقق من الرمز' },
    '배포 환경에서는 서버 세션과 접근 코드를 통해 진입합니다.': { en: 'In deployment, entry is controlled by server session and access code.', ja: '配布環境ではサーバーセッションとアクセスコードで入場します。', ar: 'في بيئة النشر، يتم الدخول عبر جلسة الخادم ورمز الوصول.' },
    '접근 코드를 입력해 주세요.': { en: 'Please enter the access code.', ja: 'アクセスコードを入力してください。', ar: 'الرجاء إدخال رمز الوصول.' },
    '인증에 실패했습니다.': { en: 'Authentication failed.', ja: '認証に失敗しました。', ar: 'فشل التحقق.' },
    '운영자 인증이 필요합니다.': { en: 'Operator authentication is required.', ja: '運営者認証が必要です。', ar: 'مطلوب توثيق المشغّل.' },
    '전문가 인증이 필요합니다.': { en: 'Expert authentication is required.', ja: '専門家認証が必要です。', ar: 'مطلوب توثيق الخبير.' },
    '로컬 전문가 진입': { en: 'Local Expert Entry', ja: 'ローカル専門家入場', ar: 'دخول محلي للخبير' },
    '로컬 운영자 진입': { en: 'Local Operator Entry', ja: 'ローカル運営者入場', ar: 'دخول محلي للمشغّل' },
    '후기 내용을 입력해 주세요.': { en: 'Please enter your review.', ja: 'レビュー内容を入力してください。', ar: 'الرجاء إدخال المراجعة.' },
    '등록 완료 ✓': { en: 'Submitted ✓', ja: '登録完了 ✓', ar: 'تم الإرسال ✓' },
    '후기가 저장되었습니다.': { en: 'Your review has been saved.', ja: 'レビューが保存されました。', ar: 'تم حفظ المراجعة.' },
    '항목이 장바구니에 담겼습니다.': { en: 'has been added to the cart.', ja: 'がカートに追加されました。', ar: 'تمت إضافته إلى السلة.' },
    '장바구니가 비어 있습니다.': { en: 'Your cart is empty.', ja: 'カートが空です。', ar: 'السلة فارغة.' },
    '모의 결제가 완료되었습니다.': { en: 'Mock checkout has been completed.', ja: 'モック決済が完了しました。', ar: 'اكتملت عملية الدفع التجريبية.' },
    'R&D 등록 단계까지 진행되었습니다.': { en: 'Advanced to the R&D registration stage.', ja: 'R&D登録段階まで進みました。', ar: 'تم التقدم إلى مرحلة تسجيل البحث والتطوير.' },
    '다음 단계로 이동했습니다.': { en: 'Moved to the next stage.', ja: '次の段階へ移動しました。', ar: 'تم الانتقال إلى المرحلة التالية.' },
    '참가 →': { en: 'Join →', ja: '参加 →', ar: 'انضم →' },
    '참가 완료 ✓': { en: 'Joined ✓', ja: '参加完了 ✓', ar: 'تم الانضمام ✓' },
    '프로그램 참가가 완료되었습니다.': { en: 'You have joined the program.', ja: 'プログラム参加が完了しました。', ar: 'تم الانضمام إلى البرنامج.' },
    '이미 참가한 프로그램입니다.': { en: 'You have already joined this program.', ja: 'すでに参加済みのプログラムです。', ar: 'لقد انضممت إلى هذا البرنامج بالفعل.' },
    '1) 초안': { en: '1) Draft', ja: '1) 下書き', ar: '1) مسودة' },
    '2) 검증': { en: '2) Validation', ja: '2) 検証', ar: '2) تحقق' },
    '3) 임상': { en: '3) Clinical', ja: '3) 臨床', ar: '3) سريري' },
    '4) 등록': { en: '4) Register', ja: '4) 登録', ar: '4) تسجيل' },
    '표준 DB 등록 완료 ✓': { en: 'Standard DB Registered ✓', ja: '標準DB登録完了 ✓', ar: 'تم تسجيل قاعدة البيانات القياسية ✓' },
    '다음 단계 →': { en: 'Next Step →', ja: '次の段階 →', ar: 'الخطوة التالية →' },
    '검증': { en: 'Validation', ja: '検証', ar: 'التحقق' },
    '기록': { en: 'Logs', ja: '記録', ar: 'السجلات' },
    '주문·구독': { en: 'Orders · Subscription', ja: '注文・購読', ar: 'الطلبات · الاشتراك' },
    '후기': { en: 'Reviews', ja: 'レビュー', ar: 'المراجعات' },
    '전체 구독자': { en: 'All Subscribers', ja: '全購読者', ar: 'كل المشتركين' },
    '이탈 위험': { en: 'Churn Risk', ja: '離脱リスク', ar: 'خطر التسرب' },
    'VIP': { en: 'VIP', ja: 'VIP', ar: 'VIP' },
    '신규': { en: 'New', ja: '新規', ar: 'جديد' },
    '이슈 발생': { en: 'Issues', ja: '問題発生', ar: 'مشكلات' },
    'KO': { en: 'KO', ja: 'KO', ar: 'KO' },
    'EN': { en: 'EN', ja: 'EN', ar: 'EN' },
    'JA': { en: 'JA', ja: 'JA', ar: 'JA' },
    'AR': { en: 'AR', ja: 'AR', ar: 'AR' }
  };
  let currentLanguage = localStorage.getItem(LANG_KEY) || 'ko';
  const originalTextMap = new WeakMap();
  let originalDocumentTitle = '';

  function t(key, lang) {
    const code = lang || currentLanguage || 'ko';
    if (!key || code === 'ko') return key;
    const entry = TEXTS[key];
    return entry && entry[code] ? entry[code] : key;
  }

  function getCurrentLanguage() {
    return currentLanguage || 'ko';
  }

  function setCurrentLanguage(lang) {
    currentLanguage = ['ko', 'en', 'ja', 'ar'].includes(lang) ? lang : 'ko';
    localStorage.setItem(LANG_KEY, currentLanguage);
    return currentLanguage;
  }

  function preserveTextNode(node) {
    if (!originalTextMap.has(node)) originalTextMap.set(node, node.nodeValue);
    return originalTextMap.get(node);
  }

  function translatedNodeValue(original, translated) {
    const match = String(original).match(/^(\s*)(.*?)(\s*)$/s);
    if (!match) return translated;
    return `${match[1]}${translated}${match[3]}`;
  }

  function applyDirection(lang) {
    const rtl = lang === 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.body.classList.toggle('rtl', rtl);
  }

  function enhanceLanguageControls() {
    if (!document.getElementById('ym-lang-style')) {
      const style = document.createElement('style');
      style.id = 'ym-lang-style';
      style.textContent = `.chip[data-lang-switch]{cursor:pointer}.chip[data-lang-switch].active{background:linear-gradient(135deg,#3b84f6,#49cda6)!important;color:#fff!important;border-color:transparent!important}body.rtl{direction:rtl}body.rtl .topbar,body.rtl .page-index,body.rtl .row-list .row,body.rtl .tabs,body.rtl .grid{direction:rtl}`;
      document.head.appendChild(style);
    }
    document.querySelectorAll('.topbar .right .chip').forEach((chip) => {
      const label = (chip.textContent || '').trim();
      const code = label.toLowerCase();
      if (!['ko', 'en', 'ja', 'ar'].includes(code)) return;
      chip.dataset.langSwitch = code;
      chip.setAttribute('role', 'button');
      chip.setAttribute('tabindex', '0');
      chip.onclick = () => switchLanguage(code);
      chip.onkeydown = (evt) => {
        if (evt.key === 'Enter' || evt.key === ' ') {
          evt.preventDefault();
          switchLanguage(code);
        }
      };
      chip.classList.toggle('active', code === currentLanguage);
    });
  }

  function translateTextNodes() {
    if (!originalDocumentTitle) originalDocumentTitle = document.title;
    document.title = t(originalDocumentTitle, currentLanguage);
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node || !node.parentElement) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (parent.closest('script, style, textarea')) return NodeFilter.FILTER_REJECT;
        if (!String(node.nodeValue || '').trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let node;
    while ((node = walker.nextNode())) {
      const original = preserveTextNode(node);
      const key = String(original).replace(/\s+/g, ' ').trim();
      if (!key) continue;
      const translated = t(key, currentLanguage);
      node.nodeValue = currentLanguage === 'ko' ? original : translatedNodeValue(original, translated);
    }
  }

  function applyI18n() {
    enhanceLanguageControls();
    applyDirection(currentLanguage);
    translateTextNodes();
    document.querySelectorAll('.topbar .right .chip[data-lang-switch]').forEach((chip) => {
      chip.classList.toggle('active', chip.dataset.langSwitch === currentLanguage);
    });
  }

  function switchLanguage(lang) {
    setCurrentLanguage(lang);
    renderRdStep();
    renderCommunity();
    updateCartUI();
    if (document.getElementById('ym-access-gate')) {
      renderAccessGate(getRequiredRole());
    }
    applyI18n();
  }

  function getTranslation(key, lang) {
    return t(key, lang);
  }
'''
text = text.replace(insert_after, insert_after + i18n_block, 1)

replacements = {
"return '₩' + Number(value || 0).toLocaleString('ko-KR');": "const locale = currentLanguage === 'en' ? 'en-US' : currentLanguage === 'ja' ? 'ja-JP' : currentLanguage === 'ar' ? 'ar-EG' : 'ko-KR';\n    return '₩' + Number(value || 0).toLocaleString(locale);",
"toast(name + ' 항목이 장바구니에 담겼습니다.');": "toast(name + ' ' + t('항목이 장바구니에 담겼습니다.'));",
"toast('후기 내용을 입력해 주세요.');": "toast(t('후기 내용을 입력해 주세요.'));",
"button.textContent = '등록 완료 ✓';": "button.textContent = t('등록 완료 ✓');",
"toast('후기가 저장되었습니다.');": "toast(t('후기가 저장되었습니다.'));",
"return { ok: false, message: data && data.message ? data.message : '접근 코드가 올바르지 않습니다.' };": "return { ok: false, message: data && data.message ? data.message : t('접근 코드를 입력해 주세요.') };",
"return { ok: false, message: '인증 서버에 연결하지 못했습니다.' };": "return { ok: false, message: 'Authentication server unavailable.' };",
"const title = requiredRole === 'admin' ? '운영자 전용 화면입니다.' : '전문가 전용 화면입니다.';": "const title = requiredRole === 'admin' ? t('운영자 전용 화면입니다.') : t('전문가 전용 화면입니다.');",
"      ? '이 화면은 구독, 이탈위험, VIP, 캠페인을 관리하는 운영자 전용 흐름입니다.'\n      : '이 화면은 일반 사용자 구매 흐름이 아니라 기준·검증·협업을 다루는 전문가 전용 흐름입니다.';": "      ? t('이 화면은 구독, 이탈위험, VIP, 캠페인을 관리하는 운영자 전용 흐름입니다.')\n      : t('이 화면은 일반 사용자 구매 흐름이 아니라 기준·검증·협업을 다루는 전문가 전용 흐름입니다.');",
"    const roleHint = currentRole ? `현재 모드: ${currentRole === 'consumer' ? '일반 사용자' : currentRole === 'expert' ? '전문가' : '운영자'}` : '현재 모드: 인증되지 않음';": "    const roleLabel = currentRole === 'consumer' ? t('일반 사용자') : currentRole === 'expert' ? t('전문가') : currentRole === 'admin' ? t('운영자') : t('인증되지 않음');\n    const roleHint = `${t('현재 모드')}: ${roleLabel}`;",
"      ? `${requiredRole === 'expert' ? '<button type=\\\"button\\\" class=\\\"gate-btn primary\\\" data-gate-enter-role=\\\"expert\\\">로컬 전문가 진입</button>' : ''}${requiredRole === 'admin' ? '<button type=\\\"button\\\" class=\\\"gate-btn primary\\\" data-gate-enter-role=\\\"admin\\\">로컬 운영자 진입</button>' : ''}`": "      ? `${requiredRole === 'expert' ? `<button type=\\\"button\\\" class=\\\"gate-btn primary\\\" data-gate-enter-role=\\\"expert\\\">${t('로컬 전문가 진입')}</button>` : ''}${requiredRole === 'admin' ? `<button type=\\\"button\\\" class=\\\"gate-btn primary\\\" data-gate-enter-role=\\\"admin\\\">${t('로컬 운영자 진입')}</button>` : ''}`",
"      : `<div style=\\\"margin-top:10px\\\"><input class=\\\"gate-input\\\" data-gate-code type=\\\"password\\\" placeholder=\\\"${requiredRole === 'admin' ? '운영자 접근 코드' : '전문가 접근 코드'}\\\" /></div><div class=\\\"gate-row\\\"><button type=\\\"button\\\" class=\\\"gate-btn primary\\\" data-gate-submit>코드 인증 후 들어가기</button></div><div class=\\\"gate-help\\\">배포 환경에서는 서버 세션과 접근 코드를 통해 진입합니다.</div><div class=\\\"gate-error\\\" data-gate-error></div>`;": "      : `<div style=\\\"margin-top:10px\\\"><input class=\\\"gate-input\\\" data-gate-code type=\\\"password\\\" placeholder=\\\"${requiredRole === 'admin' ? t('운영자 접근 코드') : t('전문가 접근 코드')}\\\" /></div><div class=\\\"gate-row\\\"><button type=\\\"button\\\" class=\\\"gate-btn primary\\\" data-gate-submit>${t('코드 인증 후 들어가기')}</button></div><div class=\\\"gate-help\\\">${t('배포 환경에서는 서버 세션과 접근 코드를 통해 진입합니다.')}</div><div class=\\\"gate-error\\\" data-gate-error></div>`;",
"        <div class=\"gate-badge\">${requiredRole === 'admin' ? '운영자 전용' : '전문가 전용'} · 접근 가드 활성</div>": "        <div class=\"gate-badge\">${requiredRole === 'admin' ? t('운영자') : t('전문가')} · Access Gate</div>",
"          <button type=\"button\" class=\"gate-btn secondary\" data-gate-go-consumer>일반 사용자 화면으로 이동</button>\n          <button type=\"button\" class=\"gate-btn secondary\" data-gate-go-home>메인으로 이동</button>": "          <button type=\"button\" class=\"gate-btn secondary\" data-gate-go-consumer>${t('일반 사용자 화면으로 이동')}</button>\n          <button type=\"button\" class=\"gate-btn secondary\" data-gate-go-home>${t('메인으로 이동')}</button>",
"        if (errorEl) errorEl.textContent = '접근 코드를 입력해 주세요.';": "        if (errorEl) errorEl.textContent = t('접근 코드를 입력해 주세요.');",
"        if (errorEl) errorEl.textContent = result.message || '인증에 실패했습니다.';": "        if (errorEl) errorEl.textContent = result.message || t('인증에 실패했습니다.');",
"    const tabLabels = ['1) 초안', '2) 검증', '3) 임상', '4) 등록'];": "    const tabLabels = [t('1) 초안'), t('2) 검증'), t('3) 임상'), t('4) 등록')];",
"      button.textContent = step >= 5 ? '표준 DB 등록 완료 ✓' : '다음 단계 →';": "      button.textContent = step >= 5 ? t('표준 DB 등록 완료 ✓') : t('다음 단계 →');",
"    toast(state.rdStep >= 5 ? 'R&D 등록 단계까지 진행되었습니다.' : '다음 단계로 이동했습니다.');": "    toast(state.rdStep >= 5 ? t('R&D 등록 단계까지 진행되었습니다.') : t('다음 단계로 이동했습니다.'));",
"      link.textContent = joined ? '참가 완료 ✓' : '참가 →';": "      link.textContent = joined ? t('참가 완료 ✓') : t('참가 →');",
"        const match = meta.textContent.match(/참가\\s*(\\d+)명/);\n        if (match) meta.textContent = meta.textContent.replace(match[0], '참가 ' + (Number(match[1]) + 1) + '명');": "        const match = meta.textContent.match(/(\\d+)/);\n        if (match) meta.textContent = meta.textContent.replace(/.*?(\\d+).*/, `${t('참가 →').replace(' →','')} ${Number(match[1]) + 1}명`);",
"      toast('프로그램 참가가 완료되었습니다.');": "      toast(t('프로그램 참가가 완료되었습니다.'));",
"      toast('이미 참가한 프로그램입니다.');": "      toast(t('이미 참가한 프로그램입니다.'));",
"      toast('장바구니가 비어 있습니다.');": "      toast(t('장바구니가 비어 있습니다.'));",
"    toast('모의 결제가 완료되었습니다.');": "    toast(t('모의 결제가 완료되었습니다.'));",
"    logoutRole": "    logoutRole,\n    switchLanguage,\n    getTranslation,\n    getCurrentLanguage,\n    applyI18n",
"    renderCommunity();\n    if (!allowed) {\n      toast(getRequiredRole() === 'admin' ? '운영자 인증이 필요합니다.' : '전문가 인증이 필요합니다.');\n    }": "    renderCommunity();\n    applyI18n();\n    if (!allowed) {\n      toast(getRequiredRole() === 'admin' ? t('운영자 인증이 필요합니다.') : t('전문가 인증이 필요합니다.'));\n    }"
}
for old, new in replacements.items():
    text = text.replace(old, new)

p.write_text(text, encoding='utf-8')
print('cp11 i18n patch applied')
