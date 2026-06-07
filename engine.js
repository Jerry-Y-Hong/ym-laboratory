/**
 * Sanyacho & MFCO Matrix Engine V2 (Advanced Dynamic Recipe Creator)
 * 
 * 오프라인 단독 구동형 다차원 약선 레시피 추론 및 창안 코어 엔진입니다.
 * 정형화된 약선 지식과 1,793행의 마스터 코어 DB를 결합하여 맞춤형 레시피를 실시간 합성합니다.
 */

class MatrixEngine {
    constructor() {
        this.modules = {
            classics: null,
            qa: null,
            formulas: null,
            ingredients: null,
            // 신규 약선 및 마스터 DB 모듈
            masterCoreDb: null,
            diseaseMapping: null,
            ingredientsHerbology: null,
            seasonal24Terms: null,
            recipes: null,
            traditionalHolidays: null,
            historyFeatures: null
        };
        // 환자 상태 벡터
        this.patientVector = {
            Heat: 0,
            Cold: 0,
            Dampness: 0,
            Spleen_Deficiency: 0,
            Lung_Deficiency: 0,
            Kidney_Deficiency: 0,
            Liver_Stagnation: 0
        };
    }

    // 1. JSON 모듈 비동기 로드 (기본 경로를 './data/'로 설정)
    async init(basePath = './data/') {
        console.log("MFCO Matrix Engine V2.5 booting...");
        try {
            const loadJson = async (file) => {
                const response = await fetch(`${basePath}${file}?t=${Date.now()}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return await response.json();
            };

            const [
                classics, qa, formulas, ingredients,
                masterCoreDb, diseaseMapping, ingredientsHerbology,
                seasonal24Terms, recipes, traditionalHolidays, historyFeatures
            ] = await Promise.all([
                loadJson('matrix_classics.json').catch(() => null),
                loadJson('matrix_qa.json').catch(() => null),
                loadJson('matrix_formulas.json').catch(() => null),
                loadJson('matrix_ingredients.json').catch(() => null),
                loadJson('mfco_master_core_db.json'),
                loadJson('yakseon_disease_mapping.json'),
                loadJson('yakseon_ingredients_herbology.json'),
                loadJson('yakseon_seasonal_24terms.json'),
                loadJson('yakseon_recipes.json'),
                loadJson('yakseon_traditional_holidays.json'),
                loadJson('yakseon_history_features.json')
            ]);

            this.modules.classics = classics;
            this.modules.qa = qa;
            this.modules.formulas = formulas;
            this.modules.ingredients = ingredients;
            
            this.modules.masterCoreDb = masterCoreDb;
            this.modules.diseaseMapping = diseaseMapping;
            this.modules.ingredientsHerbology = ingredientsHerbology;
            this.modules.seasonal24Terms = seasonal24Terms;
            this.modules.recipes = recipes;
            this.modules.traditionalHolidays = traditionalHolidays;
            this.modules.historyFeatures = historyFeatures;
            
            console.log("All MFCO Master Data & Yakseon Modules Loaded successfully! Total Core Rows:", this.modules.masterCoreDb.length);
            return true;
        } catch (error) {
            console.error("Failed to load MFCO matrix modules:", error);
            return false;
        }
    }

    // 2. 답변에 의한 상태 벡터 반영
    applyAnswerVector(vectorImpact) {
        for (const [key, val] of Object.entries(vectorImpact)) {
            if (this.patientVector[key] !== undefined) {
                this.patientVector[key] += val;
            } else {
                this.patientVector[key] = val;
            }
        }
        console.log("Updated Patient Vector:", this.patientVector);
    }

    // 3. 칠정배합 규칙 검사기 (Chiljeong Compounding Safeguard)
    checkChiljeongCompounding(ingredientsList) {
        const warnings = [];
        const synergies = [];
        
        // 금기 배합 사전 (상반/상오 관계)
        const contraindications = [
            { a: "인삼", b: "여로", type: "상반(相反)", desc: "인삼과 여로는 함께 배합하면 독성이 발생하거나 부작용이 큽니다." },
            { a: "감", b: "꽃게", type: "상반(相反)", desc: "감의 탄닌 성분과 꽃게의 단백질이 결합하여 위장 장애를 유발합니다." },
            { a: "복어", b: "형개", type: "상반(相反)", desc: "복어와 형개는 한의학적으로 배합을 금합니다." },
            { a: "복어", b: "감초", type: "상반(相反)", desc: "복어 조리 시 감초는 약효 상극으로 피하는 것이 좋습니다." },
            { a: "삼계탕", b: "마늘", type: "상오(相惡)", desc: "삼계탕 조리 시 마늘은 한의학적 궁합에 따라 피하도록 권장됩니다." },
            { a: "꿀", b: "파", type: "상반(相反)", desc: "꿀과 대파는 함께 먹으면 설사나 복통을 유발할 수 있습니다." }
        ];

        // 시너지 배합 사전 (상수/상사 관계)
        const synergyPairs = [
            { a: "인삼", b: "대추", type: "상사(相使)", desc: "대추가 인삼의 기력 보강 효능을 극대화하고 소화를 돕습니다." },
            { a: "은이버섯", b: "백합", type: "상수(相須)", desc: "폐를 촉촉하게 하고 음액을 보충하여 마른기침을 잡는 극강의 시너지입니다." },
            { a: "상기생", b: "쑥", type: "상수(相須)", desc: "간신을 보하고 근골을 튼튼하게 하는 관절통 최적의 시너지입니다." },
            { a: "생강", b: "양고기", type: "상사(相使)", desc: "생강이 양고기의 누린내를 잡고 온중(속을 따뜻하게 함) 효능을 강화합니다." }
        ];

        const names = ingredientsList.map(i => i.name);

        // 검사 수행
        for (let i = 0; i < names.length; i++) {
            for (let j = i + 1; j < names.length; j++) {
                const nameA = names[i];
                const nameB = names[j];

                // 상극 검사
                const bad = contraindications.find(p => 
                    (p.a === nameA && p.b === nameB) || (p.a === nameB && p.b === nameA)
                );
                if (bad) warnings.push(bad);

                // 시너지 검사
                const good = synergyPairs.find(p => 
                    (p.a === nameA && p.b === nameB) || (p.a === nameB && p.b === nameA)
                );
                if (good) synergies.push(good);
            }
        }

        return { warnings, synergies };
    }

    // 4. [AI 동적 레시피 창안] 추론 엔진
    generateDynamicRecipe(symptom, constitution = "General", season = "General") {
        console.log(`Generating dynamic recipe for [Symptom: ${symptom}, Constitution: ${constitution}, Season: ${season}]`);
        
        if (!this.modules.masterCoreDb) {
            return { status: "ERROR", message: "Master Core DB가 로드되지 않았습니다." };
        }

        // 4.1. 병증 매핑 규칙 검색 (없으면 텍스트 매칭 검색)
        let targetFunctions = [];
        let recommendedIngredientsFromDisease = [];
        const diseaseInfo = this.modules.diseaseMapping.find(d => d.병증.includes(symptom) || symptom.includes(d.병증));
        
        if (diseaseInfo) {
            targetFunctions = diseaseInfo["권장 식품 및 약재"] || diseaseInfo.권장식품및약재 || "";
            // 쉼표로 분리하여 권장 약재 추출
            recommendedIngredientsFromDisease = targetFunctions.split(',').map(s => s.trim());
        }

        // 4.2. 1,793행 마스터 DB 검색 및 점수화 (Scoring)
        const candidates = [];
        for (const row of this.modules.masterCoreDb) {
            let score = 0;
            const ingName = row["식재료/약재"];
            if (!ingName) continue;

            // 규칙 1: 병증 매핑에 권장된 식재료인 경우 점수 부여 (+50점 - 부분 일치 및 괄호 해제 지원)
            const isRecommended = recommendedIngredientsFromDisease.some(rec => 
                rec.includes(ingName) || ingName.includes(rec) || 
                (rec.includes("(") && rec.split("(")[0].trim() === ingName) ||
                (rec.includes("(") && rec.split("(")[1].replace(")", "").trim() === ingName)
            );
            if (isRecommended) {
                score += 50;
            }

            // 규칙 2: 표준기능 또는 원본효능 매칭 (배열 필드)
            const standardFunc = (row["표준기능목록"] || []).join(" ");
            const originalEff = (row["효능목록"] || []).join(" ");
            const associatedDis = (row["연결질환목록"] || []).join(" ");
            const desc = (row["설명목록"] || []).join(" ");

            // 증상 키워드 매칭 (공백 분할 검색 및 부분 일치 지원)
            let matchKeyword = false;
            const symParts = symptom.split(/[\s,]+/).filter(p => p.length >= 2);
            for (const sym of symParts) {
                if (standardFunc.includes(sym) || originalEff.includes(sym) || associatedDis.includes(sym) || desc.includes(sym)) {
                    matchKeyword = true;
                    break;
                }
            }
            if (standardFunc.includes(symptom) || originalEff.includes(symptom) || associatedDis.includes(symptom) || desc.includes(symptom)) {
                matchKeyword = true;
            }
            if (matchKeyword) {
                score += 30;
            }

            // 약선 본초 상세 정보가 있는 핵심 식재료인 경우 추가 점수 (+15점)
            const herbologyInfo = this.modules.ingredientsHerbology.find(h => h.식재료명 === ingName);
            if (herbologyInfo) {
                score += 15;
            }

            // 체질 필터 적용 (가중치 변별력 강화 위해 +25점 부여)
            if (constitution === "소음인") {
                // 따뜻하거나 온성 약재, 또는 소음인 적합 약재 (인삼, 생강, 대추, 계피, 황기, 당귀)
                const warmTerms = ["따뜻", "온(溫)", "열(熱)", "인삼", "생강", "대추", "계피", "황기", "당귀", "천궁"];
                const match = warmTerms.some(term => 
                    desc.includes(term) || 
                    ingName.includes(term) ||
                    (herbologyInfo && (
                        (herbologyInfo["성미 (성질과 맛)"] && herbologyInfo["성미 (성질과 맛)"].includes(term)) ||
                        (herbologyInfo["주요 효능"] && herbologyInfo["주요 효능"].includes(term))
                    ))
                );
                if (match) {
                    score += 25;
                }
            } else if (constitution === "소양인") {
                // 차갑거나 서늘한 성질, 또는 소양인 적합 약재 (구기자, 산수유, 숙지황, 보리, 배, 녹두, 오이, 석고)
                const coolTerms = ["차가", "한(寒)", "서늘", "량(凉)", "구기자", "산수유", "숙지황", "보리", "배", "녹두", "오이", "석고", "무", "두부", "복령", "택사"];
                const match = coolTerms.some(term => 
                    desc.includes(term) || 
                    ingName.includes(term) ||
                    (herbologyInfo && (
                        (herbologyInfo["성미 (성질과 맛)"] && herbologyInfo["성미 (성질과 맛)"].includes(term)) ||
                        (herbologyInfo["주요 효능"] && herbologyInfo["주요 효능"].includes(term))
                    ))
                );
                if (match) {
                    score += 25;
                }
            } else if (constitution === "태음인") {
                // 폐/호흡기를 돕고 습을 조절하는 태음인 약재 (맥문동, 오미자, 도라지, 황정, 밤, 잣, 율무, 더덕, 마, 산약, 의이인, 모과, 도가니, 소고기, 길경)
                const taeeuminTerms = ["폐", "호흡기", "기관지", "맥문동", "오미자", "도라지", "황정", "밤", "잣", "율무", "더덕", "마", "산약", "의이인", "모과", "도가니", "소고기", "길경"];
                const match = taeeuminTerms.some(term => 
                    desc.includes(term) || 
                    ingName.includes(term) ||
                    (herbologyInfo && (
                        (herbologyInfo["성미 (성질과 맛)"] && herbologyInfo["성미 (성질과 맛)"].includes(term)) ||
                        (herbologyInfo["주요 효능"] && herbologyInfo["주요 효능"].includes(term)) ||
                        (herbologyInfo["이명/한약명"] && herbologyInfo["이명/한약명"].includes(term))
                    ))
                );
                if (match) {
                    score += 25;
                }
            } else if (constitution === "태양인") {
                // 간을 보하고 기운을 내리는 맑은 성질의 태양인 약재 (오가피, 모과, 다래, 포도, 메밀, 조개, 낙지, 문어, 상기생, 겨우살이)
                const taeyangminTerms = ["간", "오가피", "모과", "다래", "포도", "메밀", "조개", "낙지", "문어", "상기생", "겨우살이"];
                const match = taeyangminTerms.some(term => 
                    desc.includes(term) || 
                    ingName.includes(term) ||
                    (herbologyInfo && (
                        (herbologyInfo["성미 (성질과 맛)"] && herbologyInfo["성미 (성질과 맛)"].includes(term)) ||
                        (herbologyInfo["주요 효능"] && herbologyInfo["주요 효능"].includes(term)) ||
                        (herbologyInfo["이명/한약명"] && herbologyInfo["이명/한약명"].includes(term))
                    ))
                );
                if (match) {
                    score += 25;
                }
            }

            // 절기 가중치 적용 (백로, 상강 등 절기 부합 식재료 가점 강화 +25점)
            const seasonalInfo = this.modules.seasonal24Terms.find(t => t.절기 === season);
            if (seasonalInfo) {
                const seasonalFoods = seasonalInfo["제철 음식 및 약선 요리"] || "";
                if (seasonalFoods.includes(ingName)) {
                    score += 25;
                }
            }

            if (score > 0) {
                candidates.push({
                    name: ingName,
                    score: score,
                    dbRow: row,
                    herbology: herbologyInfo || null
                });
            }
        }

        // 점수 기준 내림차순 정렬
        candidates.sort((a, b) => b.score - a.score);

        if (candidates.length === 0) {
            return {
                status: "NO_MATCH",
                message: "1,793행 마스터 데이터베이스에서 조건에 부합하는 식재료를 찾을 수 없습니다."
            };
        }

        // 4.3. 군신좌사(君臣佐使) 배합 설계 (Formulation)
        const formulation = {
            gun: null,  // 군약 (Chief, 50%)
            sin: null,  // 신약 (Minister, 30%)
            jwa: null,  // 좌약 (Assistant, 15%)
            sa: null    // 사약 (Envoy, 5%)
        };

        // 군약: 점수가 가장 높은 핵심 재료
        formulation.gun = candidates[0];

        // 신약: 군약과 다르고 점수가 2번째로 높은 재료
        formulation.sin = candidates.find(c => c.name !== formulation.gun.name) || null;

        // 좌약: 온도를 맞춰주거나 보조 작용을 하는 3번째 재료
        formulation.jwa = candidates.find(c => 
            c.name !== formulation.gun.name && 
            (!formulation.sin || c.name !== formulation.sin.name)
        ) || null;

        // 사약: 조화 작용을 하는 재료 (마스터 DB 혹은 본초학에서 대추, 생강, 감초 등 조화 성분 우선 선택)
        const envoys = ["대추", "생강", "감초", "대파뿌리", "꿀"];
        let matchedEnvoy = candidates.find(c => 
            envoys.includes(c.name) && 
            c.name !== formulation.gun.name && 
            (!formulation.sin || c.name !== formulation.sin.name) &&
            (!formulation.jwa || c.name !== formulation.jwa.name)
        );
        if (!matchedEnvoy && formulation.gun) {
            // 없으면 그냥 대추나 감초를 기본 사약 객체로 신규 생성
            matchedEnvoy = {
                name: "대추",
                score: 5,
                dbRow: { "식재료/약재": "대추", "표준기능목록": ["약성 조화"], "조리권장목록": ["쪼개어 넣음"], "Flavor목록": ["sweet"] },
                herbology: { "성미 (성질과 맛)": "따뜻하고 달다" }
            };
        }
        formulation.sa = matchedEnvoy || null;

        // 실제 처방 배합 어셈블리 리스트 생성
        const activeIngredients = [];
        if (formulation.gun) activeIngredients.push({ ...formulation.gun, role: "군약(君藥)", ratio: "50%", weight: "20g" });
        if (formulation.sin) activeIngredients.push({ ...formulation.sin, role: "신약(臣藥)", ratio: "30%", weight: "12g" });
        if (formulation.jwa) activeIngredients.push({ ...formulation.jwa, role: "좌약(佐藥)", ratio: "15%", weight: "6g" });
        if (formulation.sa) activeIngredients.push({ ...formulation.sa, role: "사약(使藥)", ratio: "5%", weight: "2g" });

        // 4.4. 칠정배합 가드 및 시너지 검사
        const compoundingResults = this.checkChiljeongCompounding(activeIngredients);

        // 상반(금기) 배합이 존재할 경우, 좌약이나 신약을 교체하는 가드 작동
        if (compoundingResults.warnings.length > 0) {
            console.warn("Toxicity Guard Triggered! Prohibited compounding detected:", compoundingResults.warnings);
            // 경고 품목이 있을 시, 좌약(jwa)을 차선책 후보로 대체
            const conflictNames = compoundingResults.warnings.map(w => [w.a, w.b]).flat();
            const safeJwa = candidates.find(c => 
                c.name !== formulation.gun.name && 
                (!formulation.sin || c.name !== formulation.sin.name) &&
                !conflictNames.includes(c.name)
            );
            if (safeJwa) {
                formulation.jwa = safeJwa;
                // 리스트 갱신
                activeIngredients[2] = { ...safeJwa, role: "좌약(佐藥)", ratio: "15%", weight: "6g" };
            }
        }

        // 4.5. 조리 순서 시퀀서 (조리권장 병합) 및 맛 프로필 산출
        const cookingSteps = [];
        const flavorProfile = {};
        
        // 끓이는 시간이나 조리법에 따라 조리 단계 빌드
        const getBoilVal = (i) => {
            if (i.dbRow.조리권장) return i.dbRow.조리권장;
            if (i.dbRow.조리권장목록 && Array.isArray(i.dbRow.조리권장목록)) {
                return i.dbRow.조리권장목록.filter(Boolean).join(" ");
            }
            return "";
        };
        const longBoil = activeIngredients.filter(i => {
            const val = getBoilVal(i);
            return val.includes("장시간") || val.includes("먼저");
        });
        const shortBoil = activeIngredients.filter(i => {
            const val = getBoilVal(i);
            return !val.includes("장시간") && !val.includes("먼저");
        });

        let stepNum = 1;
        cookingSteps.push(`[준비] 식재료를 깨끗이 씻어 준비합니다. (${activeIngredients.map(i => `${i.name} ${i.weight}`).join(', ')})`);
        
        if (longBoil.length > 0) {
            cookingSteps.push(`[${stepNum++}단계] 약재 중 ${longBoil.map(i => i.name).join(', ')}은 물에 넣고 센 불로 끓이다가 약불로 줄여 약 40분간 충분히 먼저 달여 줍니다. (조리권장 지침 준수)`);
        }
        if (shortBoil.length > 0) {
            cookingSteps.push(`[${stepNum++}단계] 추출된 약선 탕수에 나머지 식재료인 ${shortBoil.map(i => i.name).join(', ')}을 넣고 약 15~20분간 추가로 끓여 향과 효능을 조화시킵니다.`);
        }
        cookingSteps.push(`[완성] 완성된 약선 탕수를 따뜻하게 하여 아침·저녁으로 나누어 마십니다.`);

        // 맛 프로필 수치화
        activeIngredients.forEach(i => {
            const flavorStr = i.dbRow.Flavor || (i.dbRow.Flavor목록 && Array.isArray(i.dbRow.Flavor목록) ? i.dbRow.Flavor목록.filter(Boolean).join(",") : "");
            const flavors = (flavorStr || "mild").split(',').map(f => f.trim());
            flavors.forEach(f => {
                flavorProfile[f] = (flavorProfile[f] || 0) + (i.role === "군약(君藥)" ? 3 : i.role === "신약(臣藥)" ? 2 : 1);
            });
        });

        // 4.6. 작명 합성
        const recipeName = `${formulation.gun ? formulation.gun.name : ''}${formulation.sin ? ' ' + formulation.sin.name : ''} 약선${constitution !== "General" ? " (" + constitution + " 맞춤)" : ""}`;

        return {
            status: "SUCCESS",
            mode: "DYNAMIC_INFERENCE",
            query: { symptom, constitution, season },
            recipe_name: recipeName,
            composition: activeIngredients.map(i => ({
                name: i.name,
                role: i.role,
                ratio: i.ratio,
                weight: i.weight,
                nature_taste: i.herbology ? i.herbology["성미 (성질과 맛)"] : (i.dbRow.설명 || (i.dbRow.설명목록 && Array.isArray(i.dbRow.설명목록) ? i.dbRow.설명목록.filter(Boolean).join(" ") : "")),
                efficacy: (i.dbRow.표준기능목록 || i.dbRow.효능목록 || [])[0] || "",
                cooking_recommendation: i.dbRow.조리권장 || (i.dbRow.조리권장목록 || [])[0] || "일반 조리"
            })),
            cooking_steps: cookingSteps,
            flavor_profile: flavorProfile,
            safeguard: this.checkChiljeongCompounding(activeIngredients),
            heritage_source: formulation.gun ? (formulation.gun.dbRow.효능목록 || []).join(", ") + " (동의보감 근거)" : ""
        };
    }
}

// 글로벌 등록
if (typeof window !== 'undefined') {
    window.MatrixEngine = MatrixEngine;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MatrixEngine;
}
