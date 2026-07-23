import { useState } from 'react';
import { SAAS_PLANS } from '../data/mfcoData';

const DEFAULT_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '₩0',
    period: '/월',
    desc: '개인 프로젝트 및 탐색용',
    features: ['월 1,000 API 호출', '기본 약재 분석', '7개국어 지원', '커뮤니티 지원', '기본 문서 접근'],
    cta: '무료 시작',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₩89,000',
    period: '/월',
    desc: '스타트업 및 중소 서비스용',
    features: ['월 50,000 API 호출', '고급 증상 분석 AI', '24절기 연동', '사상체질 분석', '이메일 지원', 'SLA 99.5%'],
    cta: 'Pro 시작',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '문의',
    period: '',
    desc: '대규모 서비스 맞춤 솔루션',
    features: ['무제한 API 호출', '전용 서버 옵션', '커스텀 모델 학습', '전담 매니저', '24/7 지원', 'SLA 99.99%'],
    cta: '문의하기',
    popular: false,
  },
];

const CODE_EXAMPLES = {
  Python: `import requests

API_KEY = "your_mfco_api_key"
BASE_URL = "https://api.mfco.ai/v1"

# 증상 분석 요청
response = requests.post(
  f"{BASE_URL}/analyze",
  headers={"Authorization": f"Bearer {API_KEY}"},
  json={
    "symptoms": ["피로", "소화불량", "불면"],
    "constitution": "TE",
    "solar_term": "소만"
  }
)

result = response.json()
print(f"추천 키트: {result['kit']['name']}")
print(f"구성 약재: {result['kit']['composition']}")`,

  JavaScript: `const MFCO_API_KEY = 'your_mfco_api_key';

async function analyzeSymptoms(symptoms, constitution) {
  const response = await fetch('https://api.mfco.ai/v1/analyze', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${MFCO_API_KEY}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      symptoms,
      constitution,
      solar_term: getCurrentSolarTerm(),
      lang: 'ko'
    }),
  });

  const result = await response.json();
  return result.kit;
}

// 사용 예시
const kit = await analyzeSymptoms(
  ['피로', '소화불량'],
  'TE'
);
console.log('추천 키트:', kit.name);`,

  curl: `# MFCO API - 증상 분석 요청
curl -X POST https://api.mfco.ai/v1/analyze \\
  -H "Authorization: Bearer your_mfco_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "symptoms": ["피로", "소화불량", "불면"],
    "constitution": "TE",
    "solar_term": "소만",
    "lang": "ko"
  }'

# 응답 예시:
# {
#   "kit": {
#     "id": "K01",
#     "name": "활력 회복 키트",
#     "composition": ["황기", "인삼", "당귀"],
#     "match_score": 0.87
#   }
# }`,
};

const USE_CASES = [
  { icon: '🏥', title: '한의원', desc: '환자 체질 분석 및 맞춤 처방 보조 시스템 구축' },
  { icon: '💊', title: '건강기능식품', desc: '개인화된 건강기능식품 추천 서비스 제공' },
  { icon: '🏨', title: '병원/클리닉', desc: '통합 건강 관리 플랫폼에 약선 AI 통합' },
  { icon: '📱', title: '헬스케어앱', desc: '모바일 헬스케어 앱에 약선 추천 기능 탑재' },
];

const API_STATS = [
  { value: '50M+', label: 'API 월간 호출수' },
  { value: '94.2%', label: '증상 분석 정확도' },
  { value: '7개국어', label: '다국어 지원' },
  { value: '1,673종', label: '한약재 데이터베이스' },
];

const PLAN_NAME_KO = {
  free: '무료 체험 플랜',
  pro: '프로 비즈니스 플랜',
  enterprise: '대기업 맞춤 솔루션',
};

export default function Saas() {
  const [activeTab, setActiveTab] = useState('Python');
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const plans = SAAS_PLANS && SAAS_PLANS.length > 0 ? SAAS_PLANS : DEFAULT_PLANS;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <style>{`
        .saas-page {
          min-height: 100vh;
          padding-top: 100px;
          background: var(--bg-base);
        }

        /* HERO */
        .saas-hero {
          padding: 5rem 1.5rem 4rem;
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        .saas-hero-text h1 {
          font-family: var(--font-serif);
          font-size: clamp(1.8rem, 3vw, 2.8rem);
          color: #fff;
          line-height: 1.3;
          margin-bottom: 1rem;
        }
        .saas-hero-text h1 em {
          font-style: normal;
          background: linear-gradient(135deg, var(--neon-gold), #f5d78e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .saas-hero-text p {
          color: rgba(255,255,255,0.55);
          line-height: 1.7;
          margin-bottom: 2rem;
          font-size: 0.95rem;
        }
        .saas-hero-btns {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .code-preview {
          background: #0a0a0d;
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 1.25rem;
          overflow: hidden;
          font-family: 'Fira Code', 'Courier New', monospace;
          font-size: 0.78rem;
        }
        .code-preview-header {
          background: rgba(255,255,255,0.04);
          padding: 0.75rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .code-dot { width: 10px; height: 10px; border-radius: 50%; }
        .code-preview-body {
          padding: 1.25rem;
          color: rgba(255,255,255,0.75);
          line-height: 1.7;
          white-space: pre;
          overflow-x: auto;
        }
        .code-keyword { color: #c792ea; }
        .code-string { color: #c3e88d; }
        .code-comment { color: rgba(255,255,255,0.3); }
        .code-func { color: #82aaff; }

        /* STATS STRIP */
        .saas-stats {
          background: rgba(255,255,255,0.02);
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 2.5rem 1.5rem;
        }
        .saas-stats-inner {
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          text-align: center;
        }
        .saas-stat-value {
          font-family: var(--font-serif);
          font-size: 2rem;
          color: var(--neon-gold);
          display: block;
        }
        .saas-stat-label {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.45);
          margin-top: 0.3rem;
        }

        /* PRICING */
        .pricing-section {
          padding: 6rem 1.5rem;
          max-width: 1100px;
          margin: 0 auto;
        }
        .pricing-section .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .pricing-section .section-title {
          font-family: var(--font-serif);
          font-size: 2rem;
          color: #fff;
          margin-bottom: 0.5rem;
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          align-items: start;
        }
        .pricing-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 1.5rem;
          padding: 2.25rem;
          position: relative;
          transition: transform 0.3s;
        }
        .pricing-card:hover { transform: translateY(-4px); }
        .pricing-card.popular {
          background: rgba(201,168,76,0.06);
          border-color: var(--neon-gold);
          box-shadow: 0 0 40px rgba(201,168,76,0.12);
        }
        .popular-badge {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--neon-gold);
          color: #000;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 0.3rem 1rem;
          border-radius: 50px;
          letter-spacing: 0.08em;
          white-space: nowrap;
        }
        .plan-name {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.1em;
          margin-bottom: 0.5rem;
        }
        .plan-price {
          font-family: var(--font-serif);
          font-size: 2.5rem;
          color: #fff;
          line-height: 1;
          margin-bottom: 0.25rem;
        }
        .plan-price .period {
          font-size: 1rem;
          color: rgba(255,255,255,0.4);
          font-family: var(--font-sans);
        }
        .plan-desc {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.45);
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .plan-features {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .plan-features li {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.7);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .plan-features li::before {
          content: '✓';
          color: var(--neon-gold);
          font-weight: 700;
          flex-shrink: 0;
        }
        .plan-cta {
          width: 100%;
        }

        /* API SHOWCASE */
        .api-showcase {
          padding: 6rem 1.5rem;
          background: rgba(255,255,255,0.02);
        }
        .api-showcase-inner {
          max-width: 1000px;
          margin: 0 auto;
        }
        .code-tabs {
          display: flex;
          gap: 0.25rem;
          margin-bottom: 0;
          background: rgba(255,255,255,0.04);
          border-radius: 1rem 1rem 0 0;
          padding: 0.5rem;
          border: 1px solid rgba(255,255,255,0.08);
          border-bottom: none;
        }
        .code-tab {
          background: transparent;
          border: none;
          border-radius: 0.6rem;
          padding: 0.5rem 1.25rem;
          font-size: 0.82rem;
          color: rgba(255,255,255,0.45);
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Fira Code', monospace;
        }
        .code-tab:hover { color: #fff; }
        .code-tab.active {
          background: rgba(201,168,76,0.15);
          color: var(--neon-gold);
        }
        .code-display {
          background: #050508;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 0 0 1rem 1rem;
          padding: 2rem;
          font-family: 'Fira Code', 'Courier New', monospace;
          font-size: 0.82rem;
          color: rgba(255,255,255,0.8);
          line-height: 1.8;
          overflow-x: auto;
          white-space: pre;
          min-height: 280px;
        }

        /* USE CASES */
        .usecases-section {
          padding: 6rem 1.5rem;
          max-width: 1100px;
          margin: 0 auto;
        }
        .usecases-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          margin-top: 2.5rem;
        }
        .usecase-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 1.25rem;
          padding: 1.75rem 1.25rem;
          text-align: center;
          transition: all 0.3s;
        }
        .usecase-card:hover {
          background: rgba(255,255,255,0.07);
          transform: translateY(-4px);
          border-color: rgba(201,168,76,0.2);
        }
        .usecase-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
        .usecase-title {
          font-family: var(--font-serif);
          font-size: 1rem;
          color: #fff;
          margin-bottom: 0.4rem;
        }
        .usecase-desc {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.6;
        }

        /* CONTACT FORM */
        .contact-section {
          padding: 6rem 1.5rem;
          background: rgba(255,255,255,0.02);
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .contact-inner {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }
        .contact-title {
          font-family: var(--font-serif);
          font-size: 2rem;
          color: #fff;
          margin-bottom: 0.75rem;
        }
        .contact-sub {
          color: rgba(255,255,255,0.5);
          margin-bottom: 2.5rem;
          font-size: 0.9rem;
        }
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          text-align: left;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .form-field label {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.5);
        }
        .form-field input,
        .form-field textarea {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          color: #fff;
          font-size: 0.9rem;
          font-family: var(--font-sans);
          transition: border-color 0.2s;
        }
        .form-field input:focus,
        .form-field textarea:focus {
          outline: none;
          border-color: rgba(201,168,76,0.4);
        }
        .form-field textarea { resize: vertical; min-height: 100px; }
        .submit-success {
          background: rgba(74,222,128,0.1);
          border: 1px solid rgba(74,222,128,0.3);
          border-radius: 1rem;
          padding: 1.5rem;
          text-align: center;
          color: #4ade80;
          font-size: 0.95rem;
        }

        @media (max-width: 768px) {
          .saas-hero { grid-template-columns: 1fr; gap: 2rem; }
          .saas-stats-inner { grid-template-columns: repeat(2, 1fr); }
          .pricing-grid { grid-template-columns: 1fr; }
          .usecases-grid { grid-template-columns: repeat(2, 1fr); }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="saas-page">
        {/* HERO */}
        <div className="saas-hero">
          <div className="saas-hero-text">
            <div className="section-tag">SaaS 플랫폼</div>
            <h1>MFCO API로<br />당신의 서비스를<br /><em>고도화하세요</em></h1>
            <p>
              1,673종 한약재 데이터베이스와 18대 증상 AI 분석을 RESTful API로 제공합니다.
              몇 줄의 코드로 약선 AI를 당신의 서비스에 통합하세요.
            </p>
            <div className="saas-hero-btns">
              <button className="btn btn-primary">무료로 시작하기</button>
              <button className="btn btn-outline">API 문서 보기</button>
            </div>
          </div>
          <div className="code-preview">
            <div className="code-preview-header">
              <div className="code-dot" style={{ background: '#ff5f57' }} />
              <div className="code-dot" style={{ background: '#febc2e' }} />
              <div className="code-dot" style={{ background: '#28c840' }} />
              <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
                mfco_api.py
              </span>
            </div>
            <div className="code-preview-body">
{`<span class="code-keyword">import</span> requests

response = requests.<span class="code-func">post</span>(
  <span class="code-string">"https://api.mfco.ai/v1/analyze"</span>,
  json={
    <span class="code-string">"symptoms"</span>: [<span class="code-string">"피로"</span>, <span class="code-string">"불면"</span>],
    <span class="code-string">"constitution"</span>: <span class="code-string">"TE"</span>
  }
)
<span class="code-comment"># → 활력 회복 키트 (94.2% 일치)</span>`}
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="saas-stats">
          <div className="saas-stats-inner">
            {API_STATS.map((s, i) => (
              <div key={i}>
                <span className="saas-stat-value">{s.value}</span>
                <div className="saas-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PRICING */}
        <div className="pricing-section">
          <div className="section-header">
            <div className="section-tag">요금제</div>
            <h2 className="section-title">투명한 가격 정책</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>
              무료로 시작해서 필요에 따라 업그레이드하세요
            </p>
          </div>
          <div className="pricing-grid">
            {plans.map(plan => (
              <div key={plan.id} className={`pricing-card${plan.popular ? ' popular' : ''}`}>
                {plan.popular && <div className="popular-badge">✦ 추천 플랜</div>}
                <div className="plan-name">{PLAN_NAME_KO[plan.id] || plan.name?.toUpperCase()}</div>
                <div className="plan-price">
                  {plan.price}
                  {plan.period && <span className="period">{plan.period}</span>}
                </div>
                <div className="plan-desc">{plan.desc || plan.description || ''}</div>
                <ul className="plan-features">
                  {(plan.features || []).map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                <button
                  className={`btn plan-cta${plan.popular ? ' btn-primary' : ' btn-outline'}`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* API SHOWCASE */}
        <div className="api-showcase">
          <div className="api-showcase-inner">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div className="section-tag">API 예제</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#fff', marginBottom: '0.5rem' }}>
                간단한 통합, 강력한 기능
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>
                원하는 언어로 바로 시작하세요
              </p>
            </div>
            <div className="code-tabs">
              {Object.keys(CODE_EXAMPLES).map(tab => (
                <button
                  key={tab}
                  className={`code-tab${activeTab === tab ? ' active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="code-display">{CODE_EXAMPLES[activeTab]}</div>
          </div>
        </div>

        {/* USE CASES */}
        <div className="usecases-section">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div className="section-tag">활용 사례</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#fff' }}>
              다양한 산업에서 활용되는 MFCO API
            </h2>
          </div>
          <div className="usecases-grid">
            {USE_CASES.map((u, i) => (
              <div className="usecase-card" key={i}>
                <div className="usecase-icon">{u.icon}</div>
                <div className="usecase-title">{u.title}</div>
                <p className="usecase-desc">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CONTACT FORM */}
        <div className="contact-section">
          <div className="contact-inner">
            <div className="section-tag">맞춤 기업 상담 신청</div>
            <h2 className="contact-title">1:1 엔터프라이즈 맞춤형 상담</h2>
            <p className="contact-sub">
              대규모 서비스를 위한 맞춤형 대용량 약선 API 솔루션이 필요하신가요?<br />
              전문 매니저가 신속하게 맞춤 제안을 안내해 드립니다.
            </p>
            {submitted ? (
              <div className="submit-success">
                ✓ 문의가 접수되었습니다. 영업일 기준 1-2일 내로 연락드리겠습니다.
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-field">
                    <label>이름 *</label>
                    <input
                      type="text"
                      placeholder="홍길동"
                      required
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div className="form-field">
                    <label>이메일 *</label>
                    <input
                      type="email"
                      placeholder="hong@company.com"
                      required
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="form-field">
                  <label>회사명</label>
                  <input
                    type="text"
                    placeholder="(주) 헬스케어"
                    value={formData.company}
                    onChange={e => setFormData(p => ({ ...p, company: e.target.value }))}
                  />
                </div>
                <div className="form-field">
                  <label>문의 내용 *</label>
                  <textarea
                    placeholder="필요한 기능과 예상 사용량을 알려주세요..."
                    required
                    value={formData.message}
                    onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                  문의 보내기 →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
