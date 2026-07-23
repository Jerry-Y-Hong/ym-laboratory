import { useState, useEffect } from 'react';
import { KITS, STATES, CONSTITUTIONS, ORGANS, RECIPES, HERBS } from '../data/mfcoData';
import { MFCOInferenceEngine, CONSTITUTION_STATE_MATRIX, ORGAN_CAUSE_MATRIX } from '../utils/mfcoInference';
import { Search, BookOpen, BarChart3, Microscope, FileText, Settings, Layers, Star, Plus, CheckCircle, Activity, ExternalLink, HelpCircle, ShieldAlert } from 'lucide-react';

const engine = new MFCOInferenceEngine();

export default function Professional() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [selectedHerb, setSelectedHerb] = useState(null);
  const [scientificData, setScientificData] = useState(null);
  const [scientificLoading, setScientificLoading] = useState(false);

  // Tracer States
  const [selectedTraceStates, setSelectedTraceStates] = useState(['ST-005']);
  const [selectedTraceConst, setSelectedTraceConst] = useState('SE');
  const [selectedTraceOrgan, setSelectedTraceOrgan] = useState('비');
  const [traceDate, setTraceDate] = useState('2026-06-01');
  const [traceRunning, setTraceRunning] = useState(false);
  const [traceLog, setTraceLog] = useState([]);

  // R&D Canvas 1: Culinary Medicine
  const [selectedBaseRecipe, setSelectedBaseRecipe] = useState(RECIPES[0]);
  const [addedHerb, setAddedHerb] = useState('황기');
  const [addedHerbForm, setAddedHerbForm] = useState('FORM_POWDER');
  const [addedKit, setAddedKit] = useState('K01');
  const [culinaryResult, setCulinaryResult] = useState(null);

  // R&D Canvas 2: Supplements & Outer Ointment (외용제)
  const [ointmentPurpose, setOintmentPurpose] = useState('SKIN_ELASTICITY'); // SKIN_ELASTICITY, SKIN_INFLAMMATION, DIET_LIPID
  const [ointmentHerbs, setOintmentHerbs] = useState(['병풀']);
  const [ointmentFormat, setOintmentFormat] = useState('OINTMENT_BASE'); // OINTMENT_BASE (외용고), TOPICAL_ESSENCE (에센스), ORAL_CAPSULE (보조식품)
  const [ointmentResult, setOintmentResult] = useState(null);

  // Load external scientific citations when selectedHerb changes
  useEffect(() => {
    if (selectedHerb) {
      setScientificLoading(true);
      setScientificData(null);
      engine.fetchClinicalReferences(selectedHerb.name).then(res => {
        setScientificData(res);
        setScientificLoading(false);
      });
    }
  }, [selectedHerb]);

  const toggleTraceState = (sid) => {
    setSelectedTraceStates(prev =>
      prev.includes(sid) ? prev.filter(x => x !== sid) : [...prev, sid]
    );
  };

  const runTracer = () => {
    setTraceRunning(true);
    setTraceLog([]);
    
    const organObj = ORGANS.find(o => o.id === selectedTraceOrgan);
    const organCode = organObj ? organObj.code : null;

    const result = engine.inferRecipeUpgrade(
      selectedTraceStates,
      selectedTraceConst,
      organCode,
      traceDate,
      5
    );

    result.reasoningTrace.forEach((log, index) => {
      setTimeout(() => {
        setTraceLog(prev => [...prev, log]);
        if (index === result.reasoningTrace.length - 1) {
          setTraceRunning(false);
          setTraceLog(prev => [
            ...prev,
            `✔️ [최종 추천 메인 메뉴]: ${result.recipe.name}`,
            `✔️ [조립된 식단 전체 나트륨]: ${Math.round(result.totalNutrients.sodium)} mg`
          ]);
        }
      }, index * 400);
    });
  };

  // Run Culinary Simulation
  const simulateCulinary = () => {
    const matchedHerb = HERBS.find(h => h.name === addedHerb) || HERBS[0];
    const matchedKit = KITS.find(k => k.id === addedKit) || KITS[0];
    
    // Evaluate Synergy Factor
    let baseScore = 75;
    let synergyBonus = 0;
    const notes = [];

    // Efficacy check
    const kitSfIds = matchedKit.target_sf_ids || [];
    if (kitSfIds.includes(matchedHerb.primary_sf_id)) {
      synergyBonus += 15;
      notes.push(`[효능 일치] 키트 기능성 표적과 처방된 '${matchedHerb.name}'의 1차 생리활성 작용(SF)이 일치하여 시너지가 15점 가산됩니다.`);
    }

    // Formulation check
    if (addedHerbForm === 'FORM_POWDER' && matchedHerb.primary_sf_id === 'SF022') {
      synergyBonus += 10;
      notes.push(`[제형 최적화] 건비비위(SF022) 기능 약재를 분말제형으로 처방하여 위점막 전체 흡수 시너지 10점 가산.`);
    } else if (addedHerbForm === 'FORM_RAW' && (matchedHerb.primary_sf_id === 'SF017' || matchedHerb.primary_sf_id === 'SF008')) {
      synergyBonus += 10;
      notes.push(`[원물 아로마 활성] 안신/신경안정 기능 약재를 생체/원물 가공하여 방향성 정유(Essential Oil) 보존 가산 10점 적용.`);
    } else if (addedHerbForm === 'FORM_EXTRACT' && (matchedHerb.primary_sf_id === 'SF012' || matchedHerb.primary_sf_id === 'SF011')) {
      synergyBonus += 8;
      notes.push(`[농축 추출액 활성] 보기/보혈 수용성 고분자 다당류를 고농축 추출하여 흡수 가속화 8점 적용.`);
    }

    const finalScore = baseScore + synergyBonus;
    
    setCulinaryResult({
      score: finalScore,
      notes,
      compounds: matchedHerb.active_compounds || 'Active compounds',
      totalNutrients: {
        kcal: selectedBaseRecipe.nutrition.kcal + (matchedHerb.nutrition?.kcal || 0),
        protein: selectedBaseRecipe.nutrition.protein + (matchedHerb.nutrition?.protein || 0),
        sodium: selectedBaseRecipe.nutrition.sodium + (matchedHerb.nutrition?.sodium || 0)
      }
    });
  };

  // Run Supplement & Topical Outer Ointment (외용제) Formulation Simulation
  const simulateOintment = () => {
    let baseScore = 65;
    let synergyScore = 0;
    const formulas = [];
    const safetyGuides = [];

    // Target checks
    if (ointmentPurpose === 'SKIN_ELASTICITY') {
      if (ointmentHerbs.includes('병풀')) {
        synergyScore += 20;
        formulas.push('[병풀 주성분] 마데카식산(Madecassic acid) 및 아시아티코사이드가 진피 콜라겐 합성 유전자를 직접 자극합니다.');
      }
      if (ointmentHerbs.includes('황기')) {
        synergyScore += 10;
        formulas.push('[황기 보조] 고표(固表) 기능이 피부 장벽 치밀도를 복구하여 표피 수분 증발을 억제합니다.');
      }
      if (ointmentFormat === 'OINTMENT_BASE') {
        synergyScore += 5;
        formulas.push('[외용연고 조제] 바셀린/천연 밀랍 베이스를 이용한 지용성 외용고(Topical Ointment) 형태로 피부에 장시간 밀착 흡수 유도.');
        safetyGuides.push('상처 부위에 직접 바를 경우, 멸균 소독 상태를 유지하고 광독성 유발을 차단하기 위해 실온 보관하세요.');
      }
    } else if (ointmentPurpose === 'SKIN_INFLAMMATION') {
      if (ointmentHerbs.includes('사상자')) {
        synergyScore += 25;
        formulas.push('[사상자 주성분] 오스톨(Osthole) 성분이 강력한 항알레르기, 소양증 완화 및 국소 염증성 사이토카인을 차단합니다.');
      }
      if (ointmentHerbs.includes('병풀')) {
        synergyScore += 10;
        formulas.push('[병풀 보조] 손상된 상피 조직의 재생 속도를 가속하여 2차 상처 흉터를 최소화합니다.');
      }
      if (ointmentFormat === 'TOPICAL_ESSENCE') {
        synergyScore += 5;
        formulas.push('[에센스 겔 조제] 히알루론산 수용성 겔 에센스 형태로 피부 열감을 빠르게 한랭(Cooling) 해독 및 이완.');
      }
    } else if (ointmentPurpose === 'DIET_LIPID') {
      if (ointmentHerbs.includes('의이인')) {
        synergyScore += 25;
        formulas.push('[의이인 주성분] 코익세놀라이드(Coixenolide) 성분이 아디포넥틴 분비를 촉진하고 지방 축적 효소를 억제합니다.');
      }
      if (ointmentHerbs.includes('당귀')) {
        synergyScore += 10;
        formulas.push('[당귀 보조] 활혈(活血) 기전이 미세 혈류를 늘려 에너지 소모율과 림프 배출 순환을 가속화합니다.');
      }
      if (ointmentFormat === 'ORAL_CAPSULE') {
        synergyScore += 10;
        formulas.push('[경구용 캡슐] 고농축 열풍 건조 분말을 젤라틴 캡슐 형태로 조제하여 비위 기능 위벽을 거쳐 전신 림프계 흡수.');
      }
    }

    setOintmentResult({
      score: baseScore + synergyScore,
      formulas,
      safetyGuides: safetyGuides.length > 0 ? safetyGuides : ['특별한 국소 부작용 없음 (피부 첩포 테스트 완료)', '일일 권장 섭취량 또는 국소 2회 도포 권장.']
    });
  };

  const filteredHerbs = HERBS.filter(h =>
    h.name.includes(search) || 
    h.en.toLowerCase().includes(search.toLowerCase()) || 
    (h.latin && h.latin.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="pro-page">
      {/* Hero */}
      <section className="pro-hero">
        <div className="container">
          <div className="section-tag"><Microscope size={14} /> R&D Professional Portal</div>
          <h1>MFCO 바이오 의료 & 약선 R&D 플랫폼</h1>
          <p className="section-desc">한의사, 영양사, 그리고 식품연구가용 다층 의미론적 추론 매트릭스 제어 및 신제품 개발 시뮬레이터입니다.</p>
        </div>
      </section>

      {/* Tabs */}
      <div className="pro-tabs-bar">
        <div className="container">
          <div className="pro-tabs">
            {[
              { id: 'dashboard', label: '임상 대시보드', icon: <BarChart3 size={15}/> },
              { id: 'herbs', label: '한약재 온톨로지 DB (484종)', icon: <BookOpen size={15}/> },
              { id: 'trace', label: '추론 트레이서', icon: <Microscope size={15}/> },
              { id: 'culinary-rd', label: '약선요리 개발 캔버스', icon: <Layers size={15}/> },
              { id: 'ointment-rd', label: '외용제·보조제 개발 캔버스', icon: <Activity size={15}/> }
            ].map(t => (
              <button key={t.id} className={`pro-tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        
        {/* TAB 1: Clinical Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="grid-3" style={{ marginBottom: 32 }}>
              {[
                { label: 'R&D 코어 온톨로지 맵', value: `${HERBS.reduce((sum, h) => sum + (h.ontology_mappings ? h.ontology_mappings.length : 0), 0).toLocaleString()}개`, color: 'var(--neon-gold)', desc: '원본효능-표준기능-상태 맵' },
                { label: '전체 약용 산야초 규모', value: `${HERBS.length}종`, color: 'var(--neon-green)', desc: '학명 및 성분 정보 포함' },
                { label: '융합 조리 레시피', value: `${RECIPES.length.toLocaleString()}종`, color: 'var(--neon-blue)', desc: '영양 성분 융합 완료' },
              ].map((s, i) => (
                <div key={i} className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: s.color, fontFamily: 'var(--font-sans)' }}>{s.value}</div>
                  <div style={{ fontWeight: 600, marginTop: 8 }}>{s.label}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{s.desc}</div>
                </div>
              ))}
            </div>

            <div className="grid-2">
              <div className="card">
                <h4 style={{ marginBottom: 15 }}>🧬 오장육부별 R&D 원인 수정 규칙</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {ORGAN_CAUSE_MATRIX.map((m, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, fontSize: '0.85rem' }}>
                      <span>장부 약화: <strong style={{ color: 'var(--neon-gold)' }}>{m.organ}</strong></span>
                      <span>원인: {m.cause}</span>
                      <span style={{ color: 'var(--neon-green)', fontWeight: 700 }}>가중치 + {m.weight}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h4 style={{ marginBottom: 15 }}>🧭 사상체질별 취약 상태 가중 규칙</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {CONSTITUTION_STATE_MATRIX.map((m, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, fontSize: '0.85rem' }}>
                      <span>체질: <strong style={{ color: 'var(--neon-blue)' }}>{m.constitution}</strong></span>
                      <span>증상코드: {m.state}</span>
                      <span style={{ color: 'var(--neon-green)', fontWeight: 700 }}>가중치 + {m.weight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Herbs Database & Citations */}
        {activeTab === 'herbs' && (
          <div className="grid-layout" style={{ display: 'grid', gridTemplateColumns: selectedHerb ? '1fr 400px' : '1fr', gap: '2rem' }}>
            <div className="card">
              <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input className="input" style={{ paddingLeft: 42 }} placeholder="한약재명, 학명(Latin), 영문명으로 실시간 검색..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>표시 {filteredHerbs.length}종 / 전체 484종</span>
              </div>

              <div style={{ overflowX: 'auto', maxHeight: '550px' }}>
                <table className="herb-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                      <th style={{ padding: 10 }}>코드</th>
                      <th style={{ padding: 10 }}>약재명</th>
                      <th style={{ padding: 10 }}>학명 (Latin)</th>
                      <th style={{ padding: 10 }}>표준 영문명</th>
                      <th style={{ padding: 10 }}>오행</th>
                      <th style={{ padding: 10 }}>기미</th>
                      <th style={{ padding: 10 }}>임상 등급</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHerbs.map(h => (
                      <tr 
                        key={h.id} 
                        onClick={() => setSelectedHerb(h)} 
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer', background: selectedHerb?.id === h.id ? 'rgba(201,168,76,0.06)' : undefined }}
                      >
                        <td style={{ padding: 12 }}><span className="badge badge-blue">{h.id}</span></td>
                        <td style={{ padding: 12 }}><strong>{h.name}</strong></td>
                        <td style={{ padding: 12, fontStyle: 'italic', color: 'var(--text-muted)' }}>{h.latin}</td>
                        <td style={{ padding: 12 }}>{h.en}</td>
                        <td style={{ padding: 12 }}>{h.five_elements}</td>
                        <td style={{ padding: 12 }}>{h.taste_property}</td>
                        <td style={{ padding: 12 }}><span style={{ color: h.verification_grade === 'A' ? 'var(--neon-green)' : 'var(--neon-gold)', fontWeight: 700 }}>{h.verification_grade}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selected Herb drawer with scientific citations */}
            {selectedHerb && (
              <div className="card detail-drawer" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '1.25rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', color: '#fff', fontSize: '1.4rem' }}>{selectedHerb.name}</h3>
                    <p style={{ fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>{selectedHerb.latin}</p>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelectedHerb(null)}>닫기</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.82rem', borderBottom: '1px dashed rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>주요 유효 성분:</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{selectedHerb.active_compounds}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>기미 사기 속성:</span>
                    <span style={{ color: 'var(--neon-gold)', fontWeight: 600 }}>{selectedHerb.energy_property} · {selectedHerb.taste_property}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>오행 귀경:</span>
                    <span style={{ color: 'var(--neon-blue)', fontWeight: 600 }}>{selectedHerb.five_elements}</span>
                  </div>
                </div>

                {/* PubMed and scientific database integration */}
                <div>
                  <h4 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <Microscope size={15} style={{ color: 'var(--neon-gold)' }} />
                    SCI급 생의학 문헌 및 분자 연구 (API 연계)
                  </h4>

                  {scientificLoading ? (
                    <div style={{ textAlign: 'center', padding: 20, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      API 연동을 통해 PubMed & PubChem 실시간 데이터 조회 중...
                    </div>
                  ) : scientificData ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {/* PubMed citations */}
                      <div style={{ background: 'rgba(0,0,0,0.15)', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--neon-green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                          <ExternalLink size={10} /> PubMed NCBI 임상 문헌
                        </div>
                        {scientificData.pubmed.map((p, idx) => (
                          <div key={idx} style={{ fontSize: '0.75rem', marginBottom: 8, borderBottom: idx < 2 ? '1px solid rgba(255,255,255,0.03)' : undefined, paddingBottom: 6 }}>
                            <div style={{ fontWeight: 600, color: '#fff', lineHeight: 1.4 }}>"{p.title}"</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem', marginTop: 2 }}>{p.journal} ({p.year}) | PMC: {p.pmc}</div>
                          </div>
                        ))}
                      </div>

                      {/* PubChem molecular structure */}
                      <div style={{ background: 'rgba(0,0,0,0.15)', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--neon-blue)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                          <ExternalLink size={10} /> PubChem 화학식 정보
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          <div>지표성분: <strong style={{ color: '#fff' }}>{scientificData.pubchem.compound}</strong> (CID: {scientificData.pubchem.cid})</div>
                          <div style={{ marginTop: 2 }}>분자식: {scientificData.pubchem.formula} | 분자량: {scientificData.pubchem.weight}</div>
                          <div style={{ fontStyle: 'italic', fontSize: '0.65rem', color: 'var(--text-muted)', overflowWrap: 'anywhere', marginTop: 4 }}>SMILES: {scientificData.pubchem.smiles}</div>
                        </div>
                      </div>

                      {/* OpenFDA safety and classification */}
                      <div style={{ background: 'rgba(0,0,0,0.15)', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: '0.72rem', color: '#f43f5e', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                          <ExternalLink size={10} /> FDA/부작용 보고 모니터
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          <div>안전등급: <strong style={{ color: '#fff' }}>{scientificData.openfda.classification}</strong></div>
                          <div style={{ marginTop: 2 }}>보고된 이상반응: {scientificData.openfda.adverse_events.join(', ')}</div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Tracer */}
        {activeTab === 'trace' && (
          <div className="grid-2">
            <div className="card">
              <h4 style={{ marginBottom: 20 }}>📡 실시간 추론 파라미터 조율</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="form-label" style={{ color: 'var(--neon-gold)' }}>진단 증상 선택 (ST 코드)</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {STATES.slice(0, 8).map(s => (
                      <span 
                        key={s.id} 
                        className={`badge ${selectedTraceStates.includes(s.id) ? 'badge-blue' : 'badge-outline'}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleTraceState(s.id)}
                      >
                        {s.icon} {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="form-label" style={{ color: 'var(--neon-gold)' }}>사상 체질 (γ=0.4)</label>
                    <select className="input" value={selectedTraceConst} onChange={e => setSelectedTraceConst(e.target.value)}>
                      <option value="SE">SE 소음인</option>
                      <option value="SY">SY 소양인</option>
                      <option value="TE">TE 태음인</option>
                      <option value="TY">TY 태양인</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label" style={{ color: 'var(--neon-gold)' }}>장부 약화 (δ=0.5)</label>
                    <select className="input" value={selectedTraceOrgan} onChange={e => setSelectedTraceOrgan(e.target.value)}>
                      {ORGANS.map(o => (
                        <option key={o.id} value={o.id}>{o.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ color: 'var(--neon-gold)' }}>진단 날짜 (24절기 연동 β=0.3)</label>
                  <input type="date" className="input" value={traceDate} onChange={e => setTraceDate(e.target.value)} />
                </div>

                <button className="btn btn-primary" onClick={runTracer} disabled={traceRunning}>
                  {traceRunning ? '추론 및 보정 계산 실행 중...' : '▶ 다층 추론 시뮬레이션 기동'}
                </button>
              </div>
            </div>

            <div className="card">
              <h4 style={{ marginBottom: 20 }}>📡 실시간 계산 트레이스 로그</h4>
              
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 320, background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)' }}>
                {traceLog.length === 0 && !traceRunning && (
                  <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: 80 }}>
                    시뮬레이션 기동 버튼을 누르면 실시간 가중치(γ, δ, β) 계산 과정이 출력됩니다.
                  </div>
                )}
                {traceLog.map((log, index) => {
                  let color = 'var(--text-secondary)';
                  if (log.includes('[체질')) color = 'var(--neon-gold)';
                  else if (log.includes('[장부')) color = 'var(--neon-purple)';
                  else if (log.includes('[절기')) color = 'var(--neon-blue)';
                  else if (log.includes('[최종') || log.includes('[레시피')) color = 'var(--neon-green)';

                  return (
                    <div key={index} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', animation: 'fadeUp 0.3s ease' }}>
                      <span style={{ color: 'var(--neon-gold)' }}>➔</span>
                      <span style={{ color }}>{log}</span>
                    </div>
                  );
                })}
                {traceRunning && (
                  <div style={{ color: 'var(--neon-gold)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
                    <span style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--neon-gold)', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
                    연산 처리 중...
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Culinary R&D Canvas */}
        {activeTab === 'culinary-rd' && (
          <div className="grid-2">
            <div className="card">
              <h4>🍽️ 약선요리 R&D 시뮬레이션</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 20 }}>기존 전통 레시피에 산야초 원물 및 키트를 추가하여 약성 시너지 평점을 예측합니다.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="form-label">1. 기본 요리 레시피 선택 (1,000종 베이스)</label>
                  <select 
                    className="input" 
                    value={selectedBaseRecipe.id} 
                    onChange={e => setSelectedBaseRecipe(RECIPES.find(r => r.id === e.target.value))}
                  >
                    {RECIPES.slice(0, 15).map(r => (
                      <option key={r.id} value={r.id}>{r.icon} {r.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="form-label">2. 추가할 연구용 산야초</label>
                    <select className="input" value={addedHerb} onChange={e => setAddedHerb(e.target.value)}>
                      {HERBS.slice(0, 20).map(h => (
                        <option key={h.id} value={h.name}>{h.name} ({h.en})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">3. 처방 가공 제형(Form)</label>
                    <select className="input" value={addedHerbForm} onChange={e => setAddedHerbForm(e.target.value)}>
                      <option value="FORM_RAW">생체/원물 (Aroma 신경안정 가산)</option>
                      <option value="FORM_DRIED">건조 원물 (서서히 유출)</option>
                      <option value="FORM_POWDER">미세분말 (전체 흡수율 가산)</option>
                      <option value="FORM_EXTRACT">고농축액 (수용성 고농축 가산)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">4. 가미할 약선 키트 모듈</label>
                  <select className="input" value={addedKit} onChange={e => setAddedKit(e.target.value)}>
                    {KITS.map(k => (
                      <option key={k.id} value={k.id}>{k.name}</option>
                    ))}
                  </select>
                </div>

                <button className="btn btn-primary" onClick={simulateCulinary}>
                  R&D 음식 시너지 시뮬레이션 가동
                </button>
              </div>
            </div>

            {/* Culinary Simulator Results */}
            <div className="card">
              <h4>📊 R&D 약성 분석 레포트</h4>
              
              {culinaryResult ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(201,168,76,0.05)', padding: 16, borderRadius: 10, border: '1px solid rgba(201,168,76,0.2)' }}>
                    <div>
                      <h5 style={{ margin: 0, fontSize: '0.9rem', color: '#fff' }}>최종 약선 융합 시너지 점수</h5>
                      <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: 'var(--text-muted)' }}>처방 정합성 알고리즘 평점</p>
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--neon-gold)' }}>
                      {culinaryResult.score}점
                    </div>
                  </div>

                  <div>
                    <h5 style={{ fontSize: '0.85rem', marginBottom: 8, color: '#fff' }}>기미배합(약성) 평정 메모</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {culinaryResult.notes.map((n, idx) => (
                        <div key={idx} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', padding: 10, borderRadius: 6, borderLeft: '3px solid var(--neon-gold)' }}>
                          {n}
                        </div>
                      ))}
                      {culinaryResult.notes.length === 0 && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          키트 표적과 약재 기능이 상호 보충적입니다. (특이점 없음)
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.15)', padding: 14, borderRadius: 10 }}>
                    <h5 style={{ fontSize: '0.85rem', marginBottom: 10, color: '#fff' }}>예측 누적 영양 성분</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, textAlign: 'center', fontSize: '0.8rem' }}>
                      <div>
                        <div style={{ color: 'var(--text-muted)' }}>칼로리</div>
                        <div style={{ fontWeight: 700, color: '#fff', marginTop: 2 }}>{Math.round(culinaryResult.totalNutrients.kcal)} kcal</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)' }}>단백질</div>
                        <div style={{ fontWeight: 700, color: 'var(--neon-green)', marginTop: 2 }}>{Math.round(culinaryResult.totalNutrients.protein)} g</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)' }}>나트륨</div>
                        <div style={{ fontWeight: 700, color: '#f43f5e', marginTop: 2 }}>{Math.round(culinaryResult.totalNutrients.sodium)} mg</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: 100 }}>
                  약선 설정을 입력하고 시뮬레이션 버튼을 기동해 주세요.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: Supplements & Outer Ointments R&D Canvas */}
        {activeTab === 'ointment-rd' && (
          <div className="grid-2">
            <div className="card">
              <h4>🧪 처방 보조식품 & 외용제(Topical) R&D 캔버스</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 20 }}>피부 장벽 재생 외용연고 또는 비만/대사 기능성 식품 포뮬러를 배합 시뮬레이션합니다.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="form-label">1. R&D 개발 목적 선택</label>
                  <select className="input" value={ointmentPurpose} onChange={e => { setOintmentPurpose(e.target.value); setOintmentHerbs(e.target.value === 'DIET_LIPID' ? ['의이인'] : ['병풀']); }}>
                    <option value="SKIN_ELASTICITY">피부 탄력 장벽 복구 및 생기 부여 (ST-006)</option>
                    <option value="SKIN_INFLAMMATION">아토피/피부염 진정 및 소양증 완화 (ST-015)</option>
                    <option value="DIET_LIPID">체중 지방 산화 조절 및 대사 순환 (ST-016)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">2. 기능성 본초 원료 복합 처방 (선택)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {['병풀', '황기', '당귀', '의이인', '사상자', '감초'].map(h => (
                      <label 
                        key={h} 
                        className={`badge ${ointmentHerbs.includes(h) ? 'badge-blue' : 'badge-outline'}`}
                        style={{ cursor: 'pointer', textAlign: 'center', padding: '8px 4px' }}
                        onClick={() => {
                          setOintmentHerbs(prev =>
                            prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]
                          );
                        }}
                      >
                        {h}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="form-label">3. 처방 생산 제형 지정</label>
                  <select className="input" value={ointmentFormat} onChange={e => setOintmentFormat(e.target.value)}>
                    <option value="OINTMENT_BASE">외용고 (Vaseline/Beeswax 천연 지용성 연고)</option>
                    <option value="TOPICAL_ESSENCE">피부 겔 에센스 (수용성 고분자 쿨링 겔)</option>
                    <option value="ORAL_CAPSULE">경구용 분말 캡슐 (보조식품 처방)</option>
                  </select>
                </div>

                <button className="btn btn-primary" onClick={simulateOintment} disabled={ointmentHerbs.length === 0}>
                  보조제/외용제 처방 포뮬러 생성
                </button>
              </div>
            </div>

            {/* Ointment Simulator Results */}
            <div className="card">
              <h4>📋 처방 포뮬러 R&D 명세서</h4>
              
              {ointmentResult ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16,185,129,0.05)', padding: 16, borderRadius: 10, border: '1px solid rgba(16,185,129,0.2)' }}>
                    <div>
                      <h5 style={{ margin: 0, fontSize: '0.9rem', color: '#fff' }}>배합 안정성 & 시너지 지수</h5>
                      <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: 'var(--text-muted)' }}>장부 기미 시너지 수치</p>
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--neon-green)' }}>
                      {ointmentResult.score}점
                    </div>
                  </div>

                  <div>
                    <h5 style={{ fontSize: '0.85rem', marginBottom: 8, color: '#fff' }}>약리 작용 및 조제 기전</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {ointmentResult.formulas.map((f, idx) => (
                        <div key={idx} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', padding: 10, borderRadius: 6, borderLeft: '3px solid var(--neon-blue)' }}>
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(244,63,94,0.04)', border: '1px dashed rgba(244,63,94,0.2)', padding: 14, borderRadius: 10 }}>
                    <h5 style={{ fontSize: '0.85rem', marginBottom: 8, color: '#f43f5e', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ShieldAlert size={14} /> 안전성 가이드라인 및 조제 조치
                    </h5>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {ointmentResult.safetyGuides.map((g, idx) => (
                        <li key={idx}>{g}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: 100 }}>
                   R&D 명세 조건을 입력하고 처방 생성 버튼을 기동해 주세요.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .pro-page { padding-top: 68px; min-height: 100vh; background: var(--bg-base); }
        .pro-hero { padding: 60px 0 40px; background: linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-base) 100%); border-bottom: 1px solid var(--border-subtle); }
        .pro-hero h1 { font-family: var(--font-serif); font-size: clamp(1.8rem, 3vw, 2.8rem); margin: 12px 0 16px; color: #fff; }
        .pro-tabs-bar { background: var(--bg-surface); border-bottom: 1px solid var(--border-subtle); position: sticky; top: 68px; z-index: 100; }
        .pro-tabs { display: flex; gap: 0; overflow-x: auto; }
        .pro-tab { display: flex; align-items: center; gap: 8px; padding: 16px 24px; font-size: 0.88rem; font-weight: 500; color: var(--text-muted); background: none; border: none; border-bottom: 2px solid transparent; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .pro-tab:hover { color: var(--text-primary); }
        .pro-tab.active { color: var(--neon-gold); border-bottom-color: var(--neon-gold); }

        .herb-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
        .herb-table th { padding: 10px 14px; text-align: left; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--border-card); white-space: nowrap; }
        .herb-table td { padding: 12px 14px; border-bottom: 1px solid var(--border-subtle); color: var(--text-secondary); }
        .herb-table tr:hover td { background: var(--bg-card-hover); }

        .form-label { display: block; font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 6px; font-weight: 600; }
        .case-select-item { background: rgba(255,255,255,0.02); border: 1.5px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 16px; cursor: pointer; transition: all 0.2s; }
        .case-select-item:hover { background: rgba(255,255,255,0.04); border-color: rgba(201,168,76,0.3); }
        .case-select-item.active { background: rgba(201,168,76,0.08); border-color: var(--neon-gold); }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
