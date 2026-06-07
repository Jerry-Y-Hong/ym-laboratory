#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MFCO 마스터 DB 전항목 표준기능 기반 일괄 보완 스크립트
농진청DB 스타일 — 표준기능 → 생리작용/기전/연결질환/조리권장/Flavor 자동 채움
"""

import json, os, re

# ── 표준기능 → (생리작용EN, 기전EN, 연결질환KR, 조리권장KR, Flavor) 매핑 ──
FUNC_MAP = {
    # ① 회복계
    "체력회복":           ("Energy restoration & fatigue reduction",   "Mitochondrial ATP synthesis enhancement",          "만성피로, 기력저하",              "탕 / 죽 적합",          "mild sweet"),
    "조직회복":           ("Tissue repair & regeneration",              "Growth factor (EGF) pathway activation",           "피부 손상, 위 점막 손상",         "추출탕 적합",           "neutral herbal"),
    "혈액보충":           ("Hematopoiesis support",                     "Erythropoietin (EPO) pathway enhancement",         "빈혈, 혈색소 부족",               "탕 / 약선밥 적합",      "mild sweet earthy"),
    "근골강화":           ("Bone metabolism support",                   "Osteoblast activation & collagen synthesis",       "관절약화, 골다공증, 골감소",       "장시간 탕 적합",        "deep earthy"),
    "근력강화":           ("Skeletal muscle strengthening",             "mTOR/IGF-1 pathway activation",                    "근육감소, 만성피로, 하지무력",     "장시간 탕 / 죽 적합",  "deep earthy"),
    "근력강화 + 골격강화":("Musculoskeletal strengthening",             "Osteoblast + mTOR pathway co-activation",          "골다공증, 근육감소, 관절약화",     "장시간 탕 적합",        "deep earthy"),
    "골격강화":           ("Bone density enhancement",                  "Calcium absorption & osteoblast stimulation",      "골다공증, 골절 위험",             "탕 적합",               "neutral earthy"),
    "골절회복":           ("Fracture healing support",                  "Osteocalcin synthesis & BMP signaling",            "골절, 뼈 손상",                   "장시간 탕 적합",        "neutral herbal"),
    "면역회복":           ("Immune system restoration",                 "NK cell activation & cytokine balance",            "면역저하, 반복감염, 항암후 회복", "탕 / 추출 적합",        "mild bitter sweet"),
    "원기회복":           ("Vital energy restoration",                  "Adrenal axis regulation & HPA normalization",      "만성피로, 원기부족, 허약체질",     "탕 / 약선밥 적합",      "mild sweet"),
    "활력증진":           ("Vitality enhancement",                      "Dopaminergic & adrenergic pathway activation",     "무기력, 활력 저하",               "탕 / 죽 적합",          "warm sweet"),

    # ② 정화계
    "항염":               ("Anti-inflammatory",                         "NF-κB pathway inhibition",                        "만성염증, 관절불편, 피부 민감",   "저온조리 권장",         "cool herbal"),
    "해독":               ("Detoxification & antioxidant",              "Nrf2/ARE pathway activation",                     "간 피로, 산화 스트레스, 독소 노출","비가열/추출 적합",     "bitter herbal"),
    "해독/항산화":        ("Detoxification & antioxidant",              "Nrf2 activation & GSH synthesis",                  "간 피로, 산화 스트레스",          "비가열/추출 적합",      "bitter herbal"),
    "항염+출혈억제":      ("Anti-inflammatory & hemostasis",            "NF-κB inhibition & platelet aggregation",          "출혈성 염증, 치질, 상처",         "저온 / 탕 적합",        "cool bitter"),
    "출혈억제":           ("Hemostasis & bleeding control",             "Platelet aggregation & coagulation cascade",       "출혈, 코피, 치질, 자궁출혈",      "탕 / 볶음 적합",        "neutral astringent"),
    "감염관리":           ("Antimicrobial & infection control",         "Broad-spectrum bacteriostatic activity",           "반복 감염, 면역 저하, 학질",       "탕 적합",               "bitter cool"),
    "독소제거":           ("Toxin elimination",                         "Hepatic cytochrome P450 detox pathway",            "중독, 약물 독성, 간 부담",         "추출탕 적합",           "bitter herbal"),
    "수분배출":           ("Diuretic & fluid regulation",               "Renal tubular aquaporin upregulation",             "부종, 소변 불리, 습체",           "탕 / 죽 적합",          "bland neutral"),
    "비뇨배출":           ("Urinary diuresis",                          "Renal filtration enhancement",                    "소변 불리, 방광염, 요로결석",      "탕 / 추출 적합",        "bland cool"),
    "이뇨완화":           ("Urinary regulation",                        "Smooth muscle relaxation in urinary tract",        "배뇨통, 방광 자극",               "탕 적합",               "bland neutral"),
    "이뇨완화 + 배뇨개선":("Diuretic & urinary improvement",           "Renal filtration + smooth muscle relaxation",      "소변불리, 방광 불편",             "탕 적합",               "bland neutral"),
    "배뇨개선":           ("Urinary flow improvement",                  "Prostatic smooth muscle relaxation",               "전립선 비대, 배뇨 곤란",          "탕 적합",               "bland neutral"),
    "배뇨조절":           ("Urinary continence regulation",             "Sphincter muscle tone modulation",                 "요실금, 빈뇨, 야뇨증",            "탕 / 죽 적합",          "mild astringent"),
    "배변촉진":           ("Bowel movement promotion",                  "Intestinal peristalsis enhancement",               "변비, 장 운동 저하",              "생채 / 저온 조리",      "mild sweet bland"),
    "변비완화":           ("Constipation relief",                       "Osmotic laxative & peristalsis stimulation",       "만성 변비, 변비형 과민성 장",      "생채 / 추출 적합",      "sweet bland"),
    "배뇨완화 + 배뇨개선":("Urinary relief & improvement",             "Renal filtration + smooth muscle relaxation",      "소변불리, 방광불편",              "탕 적합",               "bland neutral"),

    # ③ 흡수계
    "소화개선":           ("Digestive enhancement",                     "Gastric acid secretion & enzyme activation",       "소화불량, 식욕부진, 복부팽만",    "죽 / 발효 적합",        "mild bitter"),
    "건비":               ("Spleen-strengthening & digestive support",  "Gut microbiome balance & mucin secretion",         "비위허약, 식욕부진, 만성 설사",   "죽 / 탕 적합",          "mild sweet"),
    "소화촉진":           ("Digestive stimulation",                     "Gastric motility & amylase activity enhancement", "소화불량, 식체, 급성 복통",       "죽 / 볶음 적합",        "warm spicy"),
    "장건강":             ("Gut health & microbiome support",           "Gut microbiome modulation & mucosal protection",   "과민성 장, 소화불량, 만성 설사",  "발효 / 죽 적합",        "mild earthy"),
    "위장강화":           ("Gastric mucosal protection",                "PGE2 production & gastric mucosal barrier",        "위염, 위궤양, 소화 불편",         "죽 / 탕 적합",          "mild bland"),
    "설사완화":           ("Antidiarrheal",                             "Intestinal water absorption & anti-secretory",     "급만성 설사, 과민성 장",          "볶음 / 죽 적합",        "astringent neutral"),
    "장건강 + 소화개선":  ("Gut health & digestive improvement",        "Gut microbiome + enzyme activation",               "소화불량, 장 민감",               "죽 / 발효 적합",        "mild sweet"),

    # ④ 안정계
    "신경안정":           ("Nervous system regulation",                 "GABA receptor modulation",                        "신경과민, 불안, 스트레스",         "차 / 죽 적합",          "mild bitter"),
    "수면안정":           ("Sleep quality improvement",                 "GABAergic neurotransmitter enhancement",           "불면증, 수면 얕음, 야간 각성",     "차 / 죽 적합",          "mild sweet"),
    "안신":               ("Mental calming & spirit stabilization",     "Serotonin pathway modulation",                    "불안, 심계항진, 가슴 두근거림",   "차 / 죽 적합",          "mild sweet"),
    "불안완화":           ("Anxiety reduction",                         "HPA axis normalization & cortisol regulation",    "불안장애, 스트레스, 가슴 답답",   "차 적합",               "mild floral"),
    "스트레스완화":       ("Stress relief",                             "Cortisol regulation & adaptogenic action",         "만성 스트레스, 번아웃",           "차 / 죽 적합",          "mild herbal"),

    # ⑤ 순환계
    "혈류개선":           ("Circulatory enhancement",                   "Vasodilation & platelet aggregation inhibition",   "말초 순환 저하, 수족냉증, 혈전",  "따뜻한 탕 적합",        "warm spicy"),
    "혈액순환":           ("Blood circulation improvement",             "Vasodilation & microcirculation enhancement",      "혈행 정체, 냉증, 근육 경직",       "탕 적합",               "warm earthy"),
    "혈액순환개선":       ("Blood circulation improvement",             "Nitric oxide production & vasodilation",           "혈행 정체, 수족냉증, 근육 경직",  "탕 적합",               "warm earthy"),
    "기순환":             ("Qi circulation improvement",                "Smooth muscle relaxation & autonomic balance",     "기체 (기 정체), 복부팽만, 무기력","탕 / 죽 적합",          "warm aromatic"),
    "통락":               ("Meridian channel unblocking",               "Neural signal conduction & microcirculation",      "저린 증상, 관절 굳음, 경락 폐색", "탕 적합",               "warm herbal"),
    "어혈제거":           ("Blood stasis resolution",                   "Fibrinolysis & platelet aggregation inhibition",   "어혈, 타박상, 월경통",            "탕 적합",               "warm bitter"),
    "혈압조절":           ("Blood pressure regulation",                 "ACE inhibition & vasodilation",                   "고혈압, 두통, 이명",              "저온조리 / 추출 적합",  "mild bitter"),
    "냉증완화":           ("Cold extremity relief",                     "Peripheral vasodilation & sympathetic modulation", "수족냉증, 체내 냉기",             "온탕 / 죽 적합",        "warm spicy"),

    # ⑥ 보호계
    "간보호":             ("Hepatoprotective",                          "ROS reduction & hepatocyte regeneration",          "간 피로, 지방간, 알코올성 간 손상","추출탕 적합",          "earthy bitter"),
    "신장보호":           ("Renoprotective",                            "Renal tubular oxidative stress reduction",         "신장 기능 저하, 단백뇨",          "추출탕 적합",           "bland neutral"),
    "간보호+신장보호":    ("Hepato-renoprotective",                     "Dual organ antioxidant protection",                "간신 허약, 대사 저하",            "추출탕 적합",           "earthy bitter"),
    "간보호+해열진통":    ("Hepatoprotective & antipyretic",            "ROS reduction & COX inhibition",                  "간 피로, 발열성 통증",            "탕 / 추출 적합",        "bitter cool"),
    "간보호+시각보호":    ("Hepato-visual protection",                  "Liver antioxidant + retinal protection",           "간 피로, 야맹증, 안구 건조",       "탕 / 추출 적합",        "earthy bitter"),
    "간기능개선":         ("Liver function improvement",                "ALT/AST reduction & bile secretion",              "간 기능 저하, 황달, 만성 피로",    "추출탕 적합",           "earthy bitter"),
    "신경염증조절":       ("Neuroinflammation modulation",              "COX-2 inhibition & microglial suppression",        "신경통, 관절 불편, 근육 긴장",    "온탕 적합",             "warm pungent"),
    "관절기능개선":       ("Joint function improvement",                "Collagen synthesis & synovial fluid regulation",   "관절통, 관절약화, 류마티스",       "탕 적합",               "deep earthy"),
    "호흡기보호":         ("Respiratory tract protection",              "Mucociliary clearance & anti-inflammatory",        "만성 기침, 건성 기침, 폐 건조",   "탕 / 죽 적합",          "mild bland"),
    "폐기능개선":         ("Pulmonary function improvement",            "Airway smooth muscle relaxation",                  "호흡 불편, 천식, 폐 기능 저하",   "탕 / 죽 적합",          "mild neutral"),
    "시각보호":           ("Visual protection",                         "Retinal antioxidant & photoreceptor protection",   "시력저하, 야맹증, 눈 피로",       "탕 / 차 적합",          "mild bitter"),
    "치아강화":           ("Dental strengthening",                      "Calcium metabolism & enamel protection",           "치아 약화, 잇몸 출혈",            "저온조리 적합",         "mild astringent"),
    "피부질환제거":       ("Dermatological treatment",                  "Keratinocyte regulation & anti-pruritic",          "습진, 두드러기, 피부 염증",       "저온 / 외용 적합",      "cool bitter"),
    "피부개선":           ("Skin health improvement",                   "Collagen synthesis & melanin suppression",         "피부 탄력 저하, 기미, 건조 피부", "비가열 / 추출 적합",    "mild sweet"),
    "탈모방지":           ("Hair loss prevention",                      "DHT inhibition & hair follicle stimulation",       "탈모, 모발 약화",                 "추출탕 / 차 적합",      "mild bitter"),
    "모발성장":           ("Hair growth promotion",                     "Wnt/β-catenin hair follicle activation",           "탈모, 모발 성장 저하",            "탕 / 추출 적합",        "mild bitter"),

    # ⑦ 완화계
    "통증완화":           ("Analgesic & pain relief",                   "Prostaglandin synthesis inhibition",               "관절통, 두통, 신경통, 근육통",    "온탕 적합",             "warm pungent"),
    "해열진통":           ("Antipyretic & analgesic",                   "Cyclooxygenase inhibition & fever center reset",   "발열, 두통, 근육통",              "탕 / 추출 적합",        "cool bitter"),
    "부종완화":           ("Anti-edema",                                "Lymphatic drainage & anti-inflammatory",           "부종, 림프 정체, 관절 붓기",       "탕 적합",               "bland neutral"),
    "경련완화":           ("Antispasmodic",                             "Smooth & skeletal muscle relaxation",              "경련, 떨림, 근육 수축",           "탕 / 죽 적합",          "neutral herbal"),
    "근육이완":           ("Muscle relaxation",                         "Calcium channel modulation & neuromuscular block", "근육 경직, 강직, 피로성 근육통",  "온탕 / 죽 적합",        "warm neutral"),
    "기침완화":           ("Cough suppression",                         "Central cough reflex inhibition",                  "기침, 기관지 과민, 만성 기침",    "탕 / 차 적합",          "mild bland"),
    "가래완화":           ("Expectorant & mucolytic",                   "Airway mucus viscosity reduction",                 "가래, 기관지 분비물 과다",         "탕 / 추출 적합",        "mild bitter"),
    "가래완화 + 기침완화":("Expectorant & antitussive",                 "Mucus reduction + cough reflex inhibition",        "기침 가래, 기관지염",             "탕 / 차 적합",          "mild bitter bland"),
    "가래완화 + 호흡개선":("Expectorant & bronchodilatory",             "Mucolytic + airway smooth muscle relaxation",      "가래 + 호흡 불편, 기관지천식",     "탕 / 추출 적합",        "mild bitter"),
    "기침완화 + 호흡개선":("Antitussive & bronchodilatory",             "COX inhibition + beta-2 agonist pathway",          "만성 기침, 천식, 호흡 불편",      "탕 / 죽 적합",          "mild neutral"),
    "가래완화 + 호흡개선 + 의식회복 + 정신각성":
                         ("Expectorant & cerebral activating",          "Mucolytic + acetylcholinesterase inhibition",      "가래, 의식 혼탁, 정신 혼미",       "추출탕 적합",           "pungent herbal"),
    "구토완화":           ("Antiemetic",                                 "5-HT3 receptor antagonism",                       "구역, 구토, 멀미",                "탕 / 죽 적합",          "warm neutral"),
    "소화개선 + 구토완화":("Digestive & antiemetic",                    "Gastric motility + 5-HT3 antagonism",              "소화 불량 + 구역",                "탕 / 죽 적합",          "warm neutral"),

    # ⑧ 체액 / 진액 보충계
    "체액보충":           ("Body fluid replenishment",                  "Aquaporin channel regulation & mucin production",  "구강 건조, 진액 부족, 폐 건조",   "죽 / 차 / 탕 적합",     "sweet bland"),
    "체액보충 + 위장강화":("Fluid replenishment & gastric support",     "Mucin secretion + gastric barrier protection",     "위 건조, 진액 부족, 위염",         "죽 / 탕 적합",          "sweet bland"),
    "체액보충 + 폐기능개선":("Fluid replenishment & pulmonary support", "Mucosal hydration + airway protection",            "폐 건조, 구강 건조, 기침",         "죽 / 차 적합",          "sweet bland"),
    "갈증완화":           ("Thirst relief",                             "Salivary gland stimulation & hydration",           "과도한 갈증, 진액 부족, 당뇨성 갈증","죽 / 차 적합",       "sweet cool"),
    "수분대사조절":       ("Fluid metabolism regulation",               "ADH pathway & aquaporin modulation",               "부종, 소변 불리, 체내 수분 불균형","탕 / 추출 적합",       "bland neutral"),
    "수분대사조절 + 부종완화":("Fluid metabolism & anti-edema",         "ADH modulation + lymphatic drainage",              "부종, 체액 정체",                 "탕 / 추출 적합",        "bland neutral"),
    "윤장":               ("Intestinal moistening",                     "Intestinal mucosal hydration & lubrication",       "건성 변비, 장 건조",              "생채 / 죽 적합",        "sweet bland"),
    "윤장 + 배변촉진":    ("Intestinal moistening & laxative",         "Mucosal hydration + peristalsis stimulation",      "변비, 건성 장",                   "생채 / 죽 적합",        "sweet bland"),

    # ⑨ 정신 / 인지계
    "정신기능개선":       ("Cognitive function improvement",            "Acetylcholinesterase inhibition & BDNF upregulation","기억력 저하, 집중력 감소, 인지 노화","차 / 추출 적합",  "mild bitter"),
    "의식회복 + 정신각성":("Consciousness restoration & alertness",     "Cholinergic activation & cerebral circulation",    "의식 혼탁, 졸림, 집중력 저하",     "차 / 추출 적합",        "pungent herbal"),
    "두통완화":           ("Headache relief",                           "Vasodilation & pain threshold elevation",          "편두통, 두통, 어지럼증",          "탕 / 차 적합",          "mild cool"),
    "어지럼증완화":       ("Vertigo & dizziness relief",                "Vestibular function regulation & circulation",      "어지럼증, 이명, 균형 저하",        "탕 / 차 적합",          "mild bland"),

    # ⑩ 여성/생식 기능계
    "생리순환개선":       ("Menstrual circulation improvement",         "Uterine smooth muscle tone & prostaglandin E2",    "월경불순, 월경통, 폐경 후 불편",  "따뜻한 탕 적합",        "warm sweet"),
    "생리순환개선 + 모유촉진":("Menstrual & lactation support",        "Uterine circulation + prolactin secretion",        "월경불순, 수유 부족",             "탕 / 죽 적합",          "warm sweet"),
    "자궁기능개선":       ("Uterine function improvement",              "Uterine contractility regulation & estrogen support","월경 불규칙, 불임 관련 체질 개선","탕 / 죽 적합",        "warm sweet"),
    "유산방지":           ("Miscarriage prevention",                    "Progesterone support & uterine muscle relaxation", "습관성 유산, 임신 중 복통",        "죽 / 탕 적합",          "mild sweet"),
    "모유촉진":           ("Lactation promotion",                       "Prolactin secretion enhancement",                  "수유 부족, 유관 폐색",            "탕 / 죽 적합",          "mild bland"),
    "분비물완화":         ("Abnormal discharge regulation",             "Vaginal microbiome balance & antimicrobial",       "냉대하, 과도한 질 분비물",         "탕 / 추출 적합",        "astringent neutral"),

    # ⑪ 항감염 / 해열계
    "항기생충":           ("Antiparasitic",                             "Parasite neurotoxin interference",                 "회충, 요충, 기생충 감염",         "볶음 / 탕 적합",        "bitter pungent"),
    "감기완화":           ("Common cold relief",                        "Antiviral & immune modulation",                   "감기 초기, 오한, 발열",            "온탕 / 탕 적합",        "warm pungent"),
    "발열완화":           ("Fever reduction",                           "Prostaglandin synthesis inhibition",               "발열, 고열, 염증성 발열",          "탕 / 추출 적합",        "cool bitter"),
    "해열진통 + 비뇨배출":("Antipyretic & diuretic",                   "COX inhibition + renal filtration enhancement",    "발열 + 소변 불리",                "탕 적합",               "cool bitter bland"),

    # ⑫ 기타 특수 기능계
    "혈당조절":           ("Blood glucose regulation",                  "GLUT4 translocation & insulin sensitivity",        "당뇨, 혈당 불안정, 인슐린 저항성","저온조리 / 추출 적합", "mild bitter"),
    "지질개선":           ("Lipid metabolism improvement",              "HMG-CoA reductase inhibition & LDL reduction",    "고지혈증, 동맥경화, 비만",         "저온조리 / 추출 적합",  "mild bitter"),
    "체중감소":           ("Body weight reduction",                     "Adipogenesis inhibition & thermogenesis",          "비만, 체지방 과다",               "저온 / 추출 적합",      "mild bitter bland"),
    "이뇨통림":           ("Diuresis & urinary tract clearing",         "Renal clearance & smooth muscle relaxation",       "소변 불리, 요로결석, 방광염",      "탕 적합",               "bland cool"),
    "지혈":               ("Hemostasis",                                "Coagulation factor activation",                   "출혈, 외상 출혈",                 "볶음 / 탕 적합",        "neutral astringent"),
    "항암":               ("Anticancer support",                        "Apoptosis induction & tumor angiogenesis inhibition","암 관련 체질 강화, 항암 후 회복","추출탕 적합",          "bitter herbal"),
    "통경락":             ("Meridian unblocking",                       "Neural signal pathway & microcirculation",         "경락 폐색, 저린 증상",            "탕 적합",               "warm herbal"),
    "소화촉진 + 활력증진":("Digestive & vitality enhancement",         "Gastric enzyme + adrenergic activation",           "소화 불량 + 피로",                "죽 / 탕 적합",          "warm spicy"),
    "소화촉진 + 활력증진 + 구토완화":
                         ("Digestive, vitality & antiemetic",           "Enzyme + adrenergic + 5-HT3 pathway",             "소화불량, 피로, 구역",            "죽 / 탕 적합",          "warm spicy"),
    "냉증완화 + 피부질환제거":
                         ("Cold relief & dermatological treatment",      "Vasodilation + keratinocyte regulation",          "냉증 + 습진, 피부 염증",          "온탕 / 외용 적합",      "warm pungent"),
    "감각기능개선":       ("Sensory function improvement",              "Neurotransmitter & receptor sensitivity restoration","무감각, 말초 신경 저하",          "탕 적합",               "mild pungent"),
    "산열해독":           ("Heat-clearing & detoxification",            "NF-κB inhibition & hepatic detox",                "열증, 독소 축적, 염증성 발열",     "탕 / 추출 적합",        "cool bitter"),
    "고름제거":           ("Pus drainage & antimicrobial",              "Neutrophil activity & antimicrobial peptide",      "화농, 종기, 농포",                "탕 적합",               "bitter cool"),
    "고름제거 + 염증완화":("Pus drainage & anti-inflammatory",          "Neutrophil activation + NF-κB inhibition",        "화농성 염증, 종기",               "탕 적합",               "bitter cool"),
    "결절완화":           ("Nodule & mass reduction",                   "Lymphatic drainage & fibroblast regulation",       "결절, 임파선 부종, 갑상선 결절",  "탕 적합",               "neutral herbal"),
    "결절완화 + 부종완화":("Nodule & edema reduction",                  "Lymphatic drainage & anti-inflammatory",           "임파선 결절, 부종",               "탕 적합",               "neutral herbal"),
    "조직재생":           ("Tissue regeneration",                       "Stem cell activation & growth factor signaling",  "창상, 궤양, 조직 손상",           "추출탕 / 외용 적합",    "neutral herbal"),
    "자양강장":           ("Tonic & adaptogenic",                       "HPA axis + adrenal gland support",                "전신 쇠약, 노화, 허약 체질",       "탕 / 죽 적합",          "mild sweet"),
    "건근장골":           ("Tendon & bone strengthening",               "Collagen cross-linking & bone mineral density",    "인대 약화, 골다공증, 근골 허약",  "장시간 탕 적합",        "deep earthy"),
    "생리기능개선":       ("Physiological function normalization",      "Endocrine & autonomic nervous system regulation",  "호르몬 불균형, 자율신경 실조",     "탕 / 죽 적합",          "mild neutral"),
    "코막힘완화":         ("Nasal congestion relief",                   "Vasoconstriction of nasal mucosa",                 "코막힘, 만성 비염, 알레르기",      "탕 / 차 적합",          "warm pungent"),
    "전립선기능개선":     ("Prostate function improvement",             "5α-reductase inhibition & DHT reduction",          "전립선 비대, 배뇨 곤란",          "탕 / 추출 적합",        "bland neutral"),
    "산후기능회복":       ("Postpartum recovery",                       "Uterine involution & hematopoiesis",               "산후 회복, 혈허, 기력 저하",       "탕 / 죽 적합",          "warm sweet"),
    "혈액보충 + 체액보충 + 출혈억제 + 혈액순환개선":
                         ("Hematopoietic & hemostatic",                 "EPO + coagulation + vasoactive pathway",           "빈혈, 출혈 후 회복",              "탕 / 죽 적합",          "mild sweet earthy"),
    "어혈제거 + 혈액순환개선":
                         ("Blood stasis resolution & circulation",       "Fibrinolysis + vasodilation",                     "어혈, 타박상, 만성 혈행 장애",     "탕 적합",               "warm bitter"),
}

# 표준기능 문자열에서 복합 기능 분해하여 가장 가까운 키 찾기
def find_best_func_key(func_str):
    """exact match → 부분 매치(첫 기능어 기반) 순으로 검색"""
    func_str = func_str.strip()
    if func_str in FUNC_MAP:
        return func_str
    # 첫 번째 '+' 앞의 주기능으로 매치
    first_part = func_str.split('+')[0].strip()
    if first_part in FUNC_MAP:
        return first_part
    # 부분 포함 검색
    for key in FUNC_MAP:
        if key in func_str or func_str in key:
            return key
    return None

def fill_record(r):
    """빈 필드만 채운다 (이미 있는 데이터는 보존)"""
    func = r.get('표준기능', '').strip()
    if not func:
        return r

    key = find_best_func_key(func)
    if not key:
        return r

    phys, mech, disease, cooking, flavor = FUNC_MAP[key]

    if not r.get('생리작용', '').strip():
        r['생리작용'] = phys
    if not r.get('작용기전', '').strip():
        r['작용기전'] = mech
    if not r.get('연결질환', '').strip():
        r['연결질환'] = disease
    if not r.get('조리권장', '').strip():
        r['조리권장'] = cooking
    if not r.get('Flavor', '').strip():
        r['Flavor'] = flavor
    return r


def main():
    data_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(data_dir, 'mfco_master_core_db.json')
    backup_path = os.path.join(data_dir, 'mfco_master_core_db.backup.json')

    with open(db_path, encoding='utf-8') as f:
        db = json.load(f)

    # 백업
    with open(backup_path, 'w', encoding='utf-8') as f:
        json.dump(db, f, ensure_ascii=False, indent=2)
    print(f'백업 완료: {backup_path}')

    before_filled = sum(1 for r in db if r.get('생리작용','').strip())
    print(f'보완 전 — 총 {len(db)}행, 생리작용 채워진 행: {before_filled}')

    # 일괄 보완
    db = [fill_record(r) for r in db]

    # 오가피 강근골/강근장골 통합: 강근장골로 표준기능 통일 (이전 세션 요청 사항)
    for r in db:
        if r.get('식재료/약재') == '오가피' and r.get('원본효능') == '강근골':
            r['표준기능'] = '근골강화'   # 이미 근골강화, 강근장골은 근력강화+골격강화로 별도 유지
        if r.get('원본효능') == '강근장골':
            r['표준기능'] = '근골강화'   # 강근장골 → 근골강화로 통합 (사용자 요청)
            key = find_best_func_key('근골강화')
            if key and not r.get('생리작용','').strip():
                p,m,d,c,fl = FUNC_MAP[key]
                r['생리작용'] = p; r['작용기전'] = m
                r['연결질환'] = d; r['조리권장'] = c; r['Flavor'] = fl

    after_filled = sum(1 for r in db if r.get('생리작용','').strip())
    print(f'보완 후 — 생리작용 채워진 행: {after_filled} (+{after_filled - before_filled}행)')

    # 여전히 비어있는 항목 리포트
    still_empty = [(r['식재료/약재'], r.get('표준기능','')) for r in db if not r.get('생리작용','').strip()]
    if still_empty:
        print(f'\n아직 미매핑 항목: {len(still_empty)}건')
        unique_funcs = sorted(set(f for _,f in still_empty if f))
        print('미매핑 표준기능:')
        for f in unique_funcs:
            print(f'  └ {f}')
    else:
        print('\n✅ 모든 항목 보완 완료!')

    # 저장
    with open(db_path, 'w', encoding='utf-8') as f:
        json.dump(db, f, ensure_ascii=False, indent=2)
    print(f'\n저장 완료: {db_path}')


if __name__ == '__main__':
    main()
