import { useState } from 'react';
import { BookOpen, Award, Compass, MessageSquare, Play, HelpCircle, CheckCircle, ArrowRight } from 'lucide-react';

const COURSES = [
  {
    id: 'CR-01',
    title: '동방의학 사상체질 생리학 기초',
    title_en: 'Fundamentals of Sasang Physiology',
    instructor: '이선우 한의학 박사',
    duration: '12강 (총 6시간)',
    desc: '소음인, 소양인, 태음인, 태양인의 체질별 장부 허실과 생리적 특성을 파악하고, 일상 증상에 대입하는 한의학 기초 원리를 배웁니다.',
    desc_en: 'Learn the principles of the four Sasang constitutions, organ vulnerabilities, and basic eastern physiology.',
    level: '초급 (Basic)',
    enrolled: 1240,
    rating: 4.9
  },
  {
    id: 'CR-02',
    title: '약용산야초 기미(氣味) 화학 및 시너지 기전',
    title_en: 'Yakseon Flavor Chemistry & Synergy Rules',
    instructor: '김은지 식품영양학 교수',
    duration: '16강 (총 8시간)',
    desc: '산야초의 한방 기미 속성(사기오미)과 현대 화학적 활성 성분(사포닌, 데쿠르신 등)의 상호작용 및 조리 가열 시 활성화 시너지를 과학적으로 입증하는 방법을 탐구합니다.',
    desc_en: 'Explore the chemical synergy between traditional herb properties and modern bio-active compounds.',
    level: '중급 (Intermediate)',
    enrolled: 820,
    rating: 4.8
  },
  {
    id: 'CR-03',
    title: '피부 외용제(Topical) 및 다이어트 기능성 보조제 조제학',
    title_en: 'Formulation for Outer Ointments & Supplements',
    instructor: 'Dr. Marcus Vance (R&D Director)',
    duration: '20강 (총 10시간)',
    desc: '병풀, 의이인 등 핵심 허브 원료를 생체, 분말, 농축액 등으로 가공하여 피부 장벽 연고(외용제) 및 다이어트 캡슐로 조제하는 웰니스 실무 공정을 습득합니다.',
    desc_en: 'Master the formulation process of topical creams and capsules using bio-active medicinal herbs.',
    level: '고급 (Advanced)',
    enrolled: 510,
    rating: 4.9
  }
];

const CLINICAL_CASES = [
  {
    id: 'CASE-01',
    title: 'Case 1: 만성 불면증 및 신경 불안정을 겪는 40대 남성',
    symptoms: ['ST-002 (수면 장애)', 'ST-007 (신경 불안정)'],
    constitution: 'SY (소양인)',
    weakOrgan: 'HEART (심장)',
    difficulty: 'Normal',
    desc: '환자는 최근 야근 후 가슴 두근거림과 조급증으로 인해 불면을 겪고 있습니다. 혀는 붉고 맥은 빠릅니다.',
    solution: {
      kit: 'K05', // 안심안정
      herb: '산조인',
      form: 'FORM_POWDER' // 분말 제형을 통해 안신 기능 흡수
    }
  },
  {
    id: 'CASE-02',
    title: 'Case 2: 만성적인 소화불량 및 상열하한(오한)을 겪는 30대 여성',
    symptoms: ['ST-005 (소화불량)', 'ST-017 (체온오한)'],
    constitution: 'SE (소음인)',
    weakOrgan: 'SPLEEN (비장)',
    difficulty: 'Hard',
    desc: '환자는 찬 음식을 먹으면 즉시 체하고 손발이 항상 차갑다고 호소합니다. 비위 기능 강화와 온기 순환이 시급합니다.',
    solution: {
      kit: 'K01', // 기력보강 (황기/인삼 건비 작용)
      herb: '황기',
      form: 'FORM_DRIED' // 건조 약재 우림
    }
  }
];

export default function Forum() {
  const [activeTab, setActiveTab] = useState('courses');
  const [activeCase, setActiveCase] = useState(CLINICAL_CASES[0]);
  const [caseAnswers, setCaseAnswers] = useState({ kit: '', herb: '', form: '' });
  const [caseResult, setCaseResult] = useState(null);

  // Q&A 포럼 모의 글 작성 상태
  const [forumPosts, setForumPosts] = useState([
    { id: 1, author: 'Pierre (France)', title: 'How does Astragalus raw raw form affect the aroma compared to dried?', date: '10분 전', replies: 3 },
    { id: 2, author: 'Dr. Zhang (Singapore)', title: 'Topical Centella Asiatica ointment (외용제) safety limits in EU cosmetic regulations.', date: '1시간 전', replies: 7 },
    { id: 3, author: 'Yuki (Japan)', title: '소음인의 비위 기능 강화 시 백출과 창출의 표준 기능 차이점에 관하여.', date: '3시간 전', replies: 5 }
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');

  const submitPost = (e) => {
    e.preventDefault();
    if (!newTitle || !newAuthor) return;
    const newPost = {
      id: forumPosts.length + 1,
      author: newAuthor,
      title: newTitle,
      date: '방금 전',
      replies: 0
    };
    setForumPosts([newPost, ...forumPosts]);
    setNewTitle('');
    setNewAuthor('');
  };

  const checkCaseSolution = () => {
    const isKitCorrect = caseAnswers.kit === activeCase.solution.kit;
    const isHerbCorrect = caseAnswers.herb.trim() === activeCase.solution.herb;
    const isFormCorrect = caseAnswers.form === activeCase.solution.form;

    if (isKitCorrect && isHerbCorrect && isFormCorrect) {
      setCaseResult({
        success: true,
        message: '✅ 정답입니다! 처방하신 키트, 약재, 그리고 제형의 조화가 환자의 체질과 오장육부 허실에 완벽히 부합하여 극대화된 R&D 치유 시너지를 발휘합니다.'
      });
    } else {
      setCaseResult({
        success: false,
        message: `❌ 오답입니다. 힌트: 이 환자는 ${activeCase.constitution} 체질이며 ${activeCase.weakOrgan === 'HEART' ? '심신 안정' : '보기 건비'} 기능이 필요합니다. 적합한 키트는 '${activeCase.solution.kit}'이고, 핵심 약재는 '${activeCase.solution.herb}'입니다.`
      });
    }
  };

  return (
    <div className="forum-page">
      {/* Hero */}
      <section className="forum-hero">
        <div className="container">
          <div className="section-tag"><Compass size={14} /> Global Education & Forum</div>
          <h1>동방의학 & 약선 R&D 글로벌 포럼</h1>
          <p className="section-desc">전 세계 한의사, 조리 연구가, 헬스케어 R&D 엔지니어들이 동방의학을 활용한 웰니스 식재료와 외용제를 연구하고 토론하는 학술 교육 플랫폼입니다.</p>
        </div>
      </section>

      {/* Tabs */}
      <div className="forum-tabs-bar">
        <div className="container">
          <div className="forum-tabs">
            {[
              { id: 'courses', label: 'R&D 전문 강좌', icon: <BookOpen size={15}/> },
              { id: 'cases', label: '임상 시뮬레이션 케이스', icon: <Award size={15}/> },
              { id: 'discussion', label: '학술 토론 및 Q&A', icon: <MessageSquare size={15}/> },
            ].map(t => (
              <button key={t.id} className={`forum-tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        {/* Tab 1: Courses */}
        {activeTab === 'courses' && (
          <div className="grid-3">
            {COURSES.map(c => (
              <div key={c.id} className="card course-card">
                <div className="course-level-badge">{c.level}</div>
                <h3 className="course-title">{c.title}</h3>
                <h4 className="course-title-en">{c.title_en}</h4>
                
                <div className="course-meta">
                  <span>강사: <strong>{c.instructor}</strong></span>
                  <span>분량: {c.duration}</span>
                </div>
                
                <p className="course-desc">{c.desc}</p>
                
                <div className="course-footer">
                  <span className="course-rating">⭐ {c.rating} ({c.enrolled}명 수강)</span>
                  <button className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Play size={12} fill="currentColor" /> 강좌 보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Clinical Cases */}
        {activeTab === 'cases' && (
          <div className="grid-2">
            <div className="card">
              <h4>🎯 임상 매칭 테스트 케이스 선택</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 20 }}>의학적 가상 증례를 읽고 알맞은 약선 키트, 약재, 가공 제형을 처방해 보세요.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {CLINICAL_CASES.map(c => (
                  <div
                    key={c.id}
                    className={`case-select-item ${activeCase.id === c.id ? 'active' : ''}`}
                    onClick={() => { setActiveCase(c); setCaseAnswers({ kit: '', herb: '', form: '' }); setCaseResult(null); }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.9rem' }}>{c.title}</strong>
                      <span className={`badge ${c.difficulty === 'Normal' ? 'badge-blue' : 'badge-purple'}`} style={{ fontSize: '0.65rem' }}>{c.difficulty}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6, lineClamp: 2 }}>{c.desc}</p>
                  </div>
                ))}
              </div>

              {/* Case Details Box */}
              <div className="case-details-box">
                <h5>증례 리포트</h5>
                <p>{activeCase.desc}</p>
                <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                  <span className="badge badge-gold">체질: {activeCase.constitution}</span>
                  <span className="badge badge-purple">약한 장부: {activeCase.weakOrgan}</span>
                  {activeCase.symptoms.map((s, idx) => (
                    <span key={idx} className="badge badge-blue">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="card" style={{ borderColor: 'var(--border-accent)' }}>
              <h4>🩺 R&D 처방 입력기</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 24 }}>이 환자를 치유하기 위한 시너지 약선을 처방해 주세요.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="form-label">1. 약선 키트 추천</label>
                  <select
                    className="input"
                    value={caseAnswers.kit}
                    onChange={e => setCaseAnswers({ ...caseAnswers, kit: e.target.value })}
                  >
                    <option value="">키트 선택...</option>
                    <option value="K01">K01 기력보강 에센스키트</option>
                    <option value="K02">K02 순환온기 분말키트</option>
                    <option value="K03">K03 대사정화 티백키트</option>
                    <option value="K04">K04 재생보호 분말키트</option>
                    <option value="K05">K05 안심안정 에센스키트</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">2. 핵심 약재 처방 (예: 황기, 당귀, 산조인, 병풀 등)</label>
                  <input
                    className="input"
                    placeholder="약재명 입력..."
                    value={caseAnswers.herb}
                    onChange={e => setCaseAnswers({ ...caseAnswers, herb: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">3. 최적 가공 제형(Form) 선택 (효능 시너지 고려)</label>
                  <select
                    className="input"
                    value={caseAnswers.form}
                    onChange={e => setCaseAnswers({ ...caseAnswers, form: e.target.value })}
                  >
                    <option value="">제형 선택...</option>
                    <option value="FORM_RAW">생체/원물 (Aroma 극대화)</option>
                    <option value="FORM_DRIED">건조본초 (서서히 유출)</option>
                    <option value="FORM_POWDER">미세분말 (전체 흡수율 극대화)</option>
                    <option value="FORM_EXTRACT">고농축액 (수용성 고분자 농축)</option>
                  </select>
                </div>

                <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={checkCaseSolution}>
                  처방 전송 및 시뮬레이터 가동
                </button>

                {caseResult && (
                  <div className={`case-result-alert ${caseResult.success ? 'success' : 'fail'}`}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      {caseResult.success ? <CheckCircle size={18} style={{ flexShrink: 0 }} /> : <HelpCircle size={18} style={{ flexShrink: 0 }} />}
                      <p style={{ fontSize: '0.82rem', lineHeight: 1.5, margin: 0 }}>{caseResult.message}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Discussion */}
        {activeTab === 'discussion' && (
          <div className="grid-2" style={{ gap: '2rem' }}>
            <div className="card">
              <h4>💬 최근 올라온 학술 질문 목록</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 20 }}>전 세계 R&D 연구원들과 조리 연구가들이 올린 최근 교류 내역입니다.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {forumPosts.map(p => (
                  <div key={p.id} className="forum-post-item">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>👤 {p.author}</span>
                      <span>{p.date}</span>
                    </div>
                    <h5 style={{ margin: '8px 0', fontSize: '0.88rem', color: '#fff' }}>{p.title}</h5>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.72rem', color: 'var(--neon-gold)', fontWeight: 600 }}>
                      <span>답변수: {p.replies}개</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h4>✍️ 신규 학술 포스트 등록</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 20 }}>연구 내용, 규제 인증, 조제법에 관해 해외 커뮤니티에 질문해 보세요.</p>
              
              <form onSubmit={submitPost} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label className="form-label">작성자 정보 (국가/소속)</label>
                  <input
                    className="input"
                    placeholder="예: Pierre (France / Pharmacist)"
                    value={newAuthor}
                    onChange={e => setNewAuthor(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">질문 제목 / 연구 주제</label>
                  <input
                    className="input"
                    placeholder="질문 제목 입력..."
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end', marginTop: 10 }}>
                  질문 등록하기 <ArrowRight size={14} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .forum-page { padding-top: 68px; min-height: 100vh; background: var(--bg-base); }
        .forum-hero { padding: 60px 0 40px; background: linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-base) 100%); border-bottom: 1px solid var(--border-subtle); }
        .forum-hero h1 { font-family: var(--font-serif); font-size: clamp(1.8rem, 3vw, 2.8rem); margin: 12px 0 16px; }
        .forum-tabs-bar { background: var(--bg-surface); border-bottom: 1px solid var(--border-subtle); position: sticky; top: 68px; z-index: 100; }
        .forum-tabs { display: flex; gap: 0; overflow-x: auto; }
        .forum-tab { display: flex; align-items: center; gap: 8px; padding: 16px 24px; font-size: 0.88rem; font-weight: 500; color: var(--text-muted); background: none; border: none; border-bottom: 2px solid transparent; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .forum-tab:hover { color: var(--text-primary); }
        .forum-tab.active { color: var(--neon-gold); border-bottom-color: var(--neon-gold); }

        /* Course Cards */
        .course-card { display: flex; flex-direction: column; justify-content: space-between; min-height: 380px; }
        .course-level-badge { align-self: flex-start; background: var(--neon-gold-dim); color: var(--neon-gold); font-size: 0.65rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
        .course-title { font-family: var(--font-serif); font-size: 1.15rem; color: #fff; margin-bottom: 4px; }
        .course-title-en { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 16px; }
        .course-meta { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary); border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px; margin-bottom: 12px; }
        .course-desc { font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; margin-bottom: auto; }
        .course-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px; margin-top: 16px; }
        .course-rating { font-size: 0.72rem; color: var(--text-secondary); }

        /* Cases */
        .case-select-item { background: rgba(255,255,255,0.02); border: 1.5px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 16px; cursor: pointer; transition: all 0.2s; }
        .case-select-item:hover { background: rgba(255,255,255,0.04); border-color: rgba(201,168,76,0.3); }
        .case-select-item.active { background: rgba(201,168,76,0.08); border-color: var(--neon-gold); }
        .case-details-box { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 16px; margin-top: 20px; }
        .case-details-box h5 { margin-top: 0; color: #fff; font-size: 0.88rem; margin-bottom: 8px; }
        .case-details-box p { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; margin: 0; }
        .form-label { display: block; font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 6px; font-weight: 600; }
        .case-result-alert { border-radius: 8px; padding: 12px 16px; margin-top: 16px; animation: fadeUp 0.3s ease; }
        .case-result-alert.success { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); color: var(--neon-green); }
        .case-result-alert.fail { background: rgba(244,63,94,0.1); border: 1px solid rgba(244,63,94,0.3); color: #f43f5e; }

        /* Discussion Forum */
        .forum-post-item { background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.05); padding: 14px 4px; transition: all 0.2s; }
        .forum-post-item:hover { background: rgba(255,255,255,0.03); padding-left: 8px; }
      `}</style>
    </div>
  );
}
