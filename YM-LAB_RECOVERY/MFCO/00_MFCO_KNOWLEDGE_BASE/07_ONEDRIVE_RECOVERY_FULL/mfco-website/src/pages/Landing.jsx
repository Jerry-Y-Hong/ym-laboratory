import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { KITS, SOLAR_TERMS_TODAY } from '../data/mfcoData';

const PORTALS = [
  {
    id: 'consumer',
    icon: '🌿',
    title: '일반인 포털',
    desc: 'AI가 당신의 증상을 분석하고 맞춤 약선 식단을 추천합니다.',
    link: '/consumer',
    color: '#4ade80',
  },
  {
    id: 'expert',
    icon: '🏥',
    title: '전문가 포털',
    desc: '한의사, 영양사를 위한 전문 진단 및 처방 도구.',
    link: '/expert',
    color: '#60a5fa',
  },
  {
    id: 'shop',
    icon: '🛒',
    title: '상점 포털',
    desc: '약선 키트를 구매하고 건강한 식생활을 시작하세요.',
    link: '/shop',
    color: '#f59e0b',
  },
  {
    id: 'saas',
    icon: '⚡',
    title: 'SaaS 포털',
    desc: 'MFCO API로 당신의 서비스에 약선 AI를 통합하세요.',
    link: '/saas',
    color: '#a78bfa',
  },
  {
    id: 'franchise',
    icon: '🏪',
    title: '프렌차이즈 포털',
    desc: 'MFCO 파트너가 되어 새로운 비즈니스를 시작하세요.',
    link: '/franchise',
    color: '#f87171',
  },
];

const STATS = [
  { value: '1,673종', label: '한약재' },
  { value: '18대', label: '증상 분석' },
  { value: '7개국어', label: '지원' },
  { value: '24절기', label: '연동' },
];

const STEPS = [
  { num: '01', icon: '🩺', title: '증상 선택', desc: '18가지 주요 증상 중 해당하는 것을 선택하세요.' },
  { num: '02', icon: '🤖', title: 'AI 분석', desc: 'AI가 체질과 장기 상태를 종합 분석합니다.' },
  { num: '03', icon: '🌿', title: '약선 추천', desc: '당신에게 최적화된 약선 키트와 레시피를 제안합니다.' },
];

export default function Landing() {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const utteranceRef = useRef(null);

  const [isPlayingDocent, setIsPlayingDocent] = useState(false);
  const [bgmPlaying, setBgmPlaying] = useState(false);

  const DOCENT_MENT = "안녕하세요. 개인 맞춤형 K-Medi 웰니스 푸드 플랫폼, MFCO에 오신 것을 환영합니다. 스마트 웨어러블 기기와 동의보감 지식베이스가 만나, 오늘 당신의 신체 상태에 꼭 맞는 약선 다이닝 코스를 제안합니다.";

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const toggleDocent = () => {
    if (isPlayingDocent) {
      window.speechSynthesis.cancel();
      setIsPlayingDocent(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(DOCENT_MENT);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.85; // 차분한 리추얼 속도
      utterance.pitch = 1.0;
      
      utterance.onend = () => {
        setIsPlayingDocent(false);
      };
      utterance.onerror = () => {
        setIsPlayingDocent(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlayingDocent(true);

      // BGM이 켜져있으면 잠시 볼륨을 줄이거나 멈춤
      if (bgmPlaying && audioRef.current) {
        audioRef.current.volume = 0.15;
      }
    }
  };

  const toggleBgm = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (bgmPlaying) {
      audio.pause();
      setBgmPlaying(false);
    } else {
      audio.volume = isPlayingDocent ? 0.15 : 0.4;
      audio.play().then(() => {
        setBgmPlaying(true);
      }).catch(err => {
        console.log("Audio play blocked: ", err);
      });
    }
  };

  // 도슨트 재생이 끝나면 BGM 볼륨 원래대로
  useEffect(() => {
    if (!isPlayingDocent && audioRef.current) {
      audioRef.current.volume = 0.4;
    }
  }, [isPlayingDocent]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.color = Math.random() > 0.6 ? '#c9a84c' : '#ffffff';
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < 120; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.save();
            ctx.globalAlpha = (1 - dist / 90) * 0.12;
            ctx.strokeStyle = '#c9a84c';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const getSolarTermDetail = () => {
    if (typeof SOLAR_TERMS_TODAY !== 'function') return { name: '소만', season: '여름', element: '화(火)' };
    const name = SOLAR_TERMS_TODAY();
    const seasonMap = {
      '입춘': { name, season: '봄', element: '목(木)' },
      '우수': { name, season: '봄', element: '목(木)' },
      '경칩': { name, season: '봄', element: '목(木)' },
      '춘분': { name, season: '봄', element: '목(木)' },
      '청명': { name, season: '봄', element: '목(木)' },
      '곡우': { name, season: '봄', element: '목(木)' },
      '입하': { name, season: '여름', element: '화(火)' },
      '소만': { name, season: '여름', element: '화(火)' },
      '망종': { name, season: '여름', element: '화(火)' },
      '하지': { name, season: '여름', element: '화(火)' },
      '소서': { name, season: '여름', element: '화(火)' },
      '대서': { name, season: '여름', element: '화(火)' },
      '입추': { name, season: '가을', element: '금(金)' },
      '처서': { name, season: '가을', element: '금(金)' },
      '백로': { name, season: '가을', element: '금(金)' },
      '추분': { name, season: '가을', element: '금(金)' },
      '한로': { name, season: '가을', element: '금(金)' },
      '상강': { name, season: '가을', element: '금(金)' },
      '입동': { name, season: '겨울', element: '수(水)' },
      '소설': { name, season: '겨울', element: '수(水)' },
      '대설': { name, season: '겨울', element: '수(水)' },
      '동지': { name, season: '겨울', element: '수(水)' },
      '소한': { name, season: '겨울', element: '수(水)' },
      '대한': { name, season: '겨울', element: '수(水)' }
    };
    return seasonMap[name] || { name, season: '여름', element: '화(火)' };
  };

  const solarTerm = getSolarTermDetail();

  return (
    <>
      <style>{`
        /* AUDIO WAVE ANIMATION */
        .audio-wave {
          display: inline-flex;
          align-items: flex-end;
          gap: 2px;
          height: 12px;
          margin-left: 4px;
        }
        .audio-wave span {
          width: 2px;
          height: 100%;
          background-color: var(--neon-gold);
          animation: wave 1s ease-in-out infinite;
        }
        .audio-wave span:nth-child(2) { animation-delay: 0.2s; }
        .audio-wave span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes wave {
          0%, 100% { height: 3px; }
          50% { height: 12px; }
        }

        /* BGM CONTROLLER */
        .bgm-controller {
          position: fixed;
          bottom: 2rem;
          left: 2rem;
          z-index: 100;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(201,168,76,0.25);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(0,0,0,0.4);
        }
        .bgm-controller:hover {
          background: rgba(201,168,76,0.1);
          border-color: var(--neon-gold);
          transform: scale(1.08);
        }
        .bgm-controller.playing {
          background: rgba(201,168,76,0.15);
          border-color: var(--neon-gold);
          box-shadow: 0 0 15px rgba(201,168,76,0.4);
          animation: pulse 2s infinite;
        }
        .bgm-icon {
          font-size: 1.25rem;
          color: var(--neon-gold);
        }
        .bgm-tooltip {
          position: absolute;
          left: 60px;
          background: rgba(0,0,0,0.8);
          border: 1px solid rgba(201,168,76,0.3);
          color: var(--neon-gold);
          padding: 0.25rem 0.60rem;
          border-radius: 6px;
          font-size: 0.7rem;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s;
        }
        .bgm-controller:hover .bgm-tooltip {
          opacity: 1;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }

        .landing-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: radial-gradient(ellipse at 30% 40%, rgba(201,168,76,0.08) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 70%, rgba(74,222,128,0.05) 0%, transparent 50%),
                      var(--bg-base);
          padding-top: 100px;
        }
        .landing-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 2rem;
          max-width: 900px;
          animation: fadeUp 0.9s ease both;
        }
        .hero-solar-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(201,168,76,0.12);
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 50px;
          padding: 0.4rem 1.2rem;
          font-size: 0.8rem;
          color: var(--neon-gold);
          margin-bottom: 1.5rem;
          letter-spacing: 0.05em;
        }
        .hero-title {
          font-family: var(--font-serif);
          font-size: clamp(2rem, 5vw, 4.5rem);
          line-height: 1.2;
          margin-bottom: 1.2rem;
          background: linear-gradient(135deg, #ffffff 0%, #c9a84c 50%, #f5d78e 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-subtitle {
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: rgba(255,255,255,0.65);
          margin-bottom: 2.5rem;
          font-family: var(--font-sans);
          line-height: 1.7;
        }
        .hero-cta-group {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .hero-scroll-hint {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255,255,255,0.35);
          font-size: 0.75rem;
          animation: float 2s ease-in-out infinite;
        }
        .hero-scroll-hint span {
          font-size: 1.2rem;
        }

        /* STATS BAR */
        .stats-bar {
          background: rgba(255,255,255,0.03);
          border-top: 1px solid rgba(201,168,76,0.15);
          border-bottom: 1px solid rgba(201,168,76,0.15);
          padding: 2rem 1rem;
        }
        .stats-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        .stat-item {
          text-align: center;
          animation: fadeUp 0.6s ease both;
        }
        .stat-value {
          font-family: var(--font-serif);
          font-size: 2.2rem;
          color: var(--neon-gold);
          display: block;
          line-height: 1;
        }
        .stat-label {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.5);
          margin-top: 0.4rem;
          letter-spacing: 0.05em;
        }

        /* PORTALS */
        .portals-section {
          padding: 6rem 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .section-title {
          font-family: var(--font-serif);
          font-size: clamp(1.6rem, 3vw, 2.5rem);
          color: #fff;
          margin-bottom: 0.75rem;
        }
        .section-sub {
          color: rgba(255,255,255,0.5);
          font-size: 0.95rem;
        }
        .portals-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1.25rem;
        }
        .portal-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 1.25rem;
          padding: 2rem 1.25rem;
          text-align: center;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .portal-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--portal-color, var(--neon-gold));
          opacity: 0;
          transition: opacity 0.3s;
        }
        .portal-card:hover {
          transform: translateY(-6px);
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.15);
        }
        .portal-card:hover::before {
          opacity: 1;
        }
        .portal-icon {
          font-size: 2.4rem;
          margin-bottom: 0.75rem;
          display: block;
          animation: float 3s ease-in-out infinite;
        }
        .portal-title {
          font-family: var(--font-serif);
          font-size: 1rem;
          color: #fff;
          margin-bottom: 0.5rem;
        }
        .portal-desc {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.6;
        }

        /* HOW IT WORKS */
        .how-section {
          padding: 6rem 1.5rem;
          background: rgba(255,255,255,0.02);
        }
        .how-inner {
          max-width: 900px;
          margin: 0 auto;
        }
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-top: 3rem;
          position: relative;
        }
        .steps-grid::before {
          content: '';
          position: absolute;
          top: 3rem;
          left: 16.67%;
          right: 16.67%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--neon-gold), transparent);
          opacity: 0.4;
        }
        .step-card {
          text-align: center;
          padding: 2rem 1rem;
          position: relative;
        }
        .step-num {
          font-size: 0.7rem;
          color: var(--neon-gold);
          letter-spacing: 0.15em;
          margin-bottom: 0.75rem;
          opacity: 0.7;
        }
        .step-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          display: block;
        }
        .step-title {
          font-family: var(--font-serif);
          font-size: 1.2rem;
          color: #fff;
          margin-bottom: 0.6rem;
        }
        .step-desc {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.7;
        }

        /* KIT PREVIEW */
        .kits-section {
          padding: 6rem 0 6rem 1.5rem;
        }
        .kits-inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        .kits-scroll {
          display: flex;
          gap: 1.25rem;
          overflow-x: auto;
          padding-bottom: 1rem;
          scrollbar-width: thin;
          scrollbar-color: var(--neon-gold) transparent;
          padding-right: 1.5rem;
          margin-top: 2rem;
        }
        .kit-preview-card {
          min-width: 240px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 1.25rem;
          padding: 1.75rem 1.5rem;
          flex-shrink: 0;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .kit-preview-card:hover {
          transform: translateY(-4px);
          border-color: rgba(201,168,76,0.3);
          background: rgba(201,168,76,0.05);
        }
        .kit-emoji {
          font-size: 2.5rem;
          margin-bottom: 0.75rem;
          display: block;
        }
        .kit-name {
          font-family: var(--font-serif);
          font-size: 1rem;
          color: #fff;
          margin-bottom: 0.4rem;
        }
        .kit-tagline {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.5);
          margin-bottom: 1rem;
          line-height: 1.5;
        }
        .kit-herbs {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }
        .herb-pill {
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 50px;
          padding: 0.2rem 0.6rem;
          font-size: 0.7rem;
          color: var(--neon-gold);
        }

        /* CTA BANNER */
        .cta-banner {
          padding: 5rem 1.5rem;
          background: radial-gradient(ellipse at center, rgba(201,168,76,0.12) 0%, transparent 70%);
          text-align: center;
        }
        .cta-banner-title {
          font-family: var(--font-serif);
          font-size: clamp(1.8rem, 4vw, 3rem);
          color: #fff;
          margin-bottom: 1rem;
        }
        .cta-banner-sub {
          color: rgba(255,255,255,0.55);
          margin-bottom: 2rem;
          font-size: 1rem;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @media (max-width: 768px) {
          .stats-inner { grid-template-columns: repeat(2, 1fr); }
          .portals-grid { grid-template-columns: 1fr 1fr; }
          .steps-grid { grid-template-columns: 1fr; }
          .steps-grid::before { display: none; }
        }
      `}</style>

      {/* HERO */}
      <section className="landing-hero">
        <canvas ref={canvasRef} className="landing-canvas" />
        <div className="hero-content">
          <div className="hero-solar-badge">
            <span>🌿</span>
            오늘의 절기: {solarTerm?.name || '소만'} · {solarTerm?.season || '여름'} · {solarTerm?.element || '화(火)'}
          </div>
          <h1 className="hero-title">AI가 설계하는<br />당신만의 약선 식단</h1>
          <p className="hero-subtitle">
            1,673종 한약재 데이터베이스 · 18대 증상 분석 · 24절기 맞춤 추천<br />
            동양 의학의 지혜와 AI 기술이 만나는 곳, MFCO
          </p>
          <div className="hero-cta-group">
            <Link to="/consumer" className="btn btn-primary">AI 진단 시작</Link>
            <button 
              onClick={toggleDocent} 
              className={`btn ${isPlayingDocent ? 'btn-primary' : 'btn-outline'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <span>{isPlayingDocent ? '⏹️ 해설 중단' : '🎧 소리로 듣는 약선 해설'}</span>
              {isPlayingDocent && (
                <span className="audio-wave">
                  <span />
                  <span />
                  <span />
                </span>
              )}
            </button>
            <Link to="/shop" className="btn btn-outline">키트 알아보기</Link>
          </div>
        </div>
        <div className="hero-scroll-hint">
          <span>↓</span>
          스크롤하여 더 보기
        </div>
      </section>

      {/* STATS BAR */}
      <section className="stats-bar">
        <div className="stats-inner">
          {STATS.map((s, i) => (
            <div className="stat-item" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="stat-value">{s.value}</span>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PORTAL CARDS */}
      <section className="portals-section">
        <div className="section-header">
          <div className="section-tag">포털 안내</div>
          <h2 className="section-title">당신에게 맞는 포털을 선택하세요</h2>
          <p className="section-sub">MFCO는 모든 사용자를 위한 맞춤형 서비스를 제공합니다</p>
        </div>
        <div className="portals-grid">
          {PORTALS.map(p => (
            <Link
              key={p.id}
              to={p.link}
              className="portal-card"
              style={{ '--portal-color': p.color }}
            >
              <span className="portal-icon">{p.icon}</span>
              <div className="portal-title">{p.title}</div>
              <p className="portal-desc">{p.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="how-inner">
          <div className="section-header">
            <div className="section-tag">사용 방법</div>
            <h2 className="section-title">3단계로 완성되는 맞춤 약선</h2>
          </div>
          <div className="steps-grid">
            {STEPS.map((s, i) => (
              <div className="step-card" key={i}>
                <div className="step-num">{s.num}</div>
                <span className="step-icon">{s.icon}</span>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KIT PREVIEW */}
      <section className="kits-section">
        <div className="kits-inner">
          <div className="section-header">
            <div className="section-tag">약선 키트</div>
            <h2 className="section-title">MFCO 시그니처 키트</h2>
            <p className="section-sub">전통 한약재의 과학적 배합으로 완성된 5가지 약선 키트</p>
          </div>
          <div className="kits-scroll">
            {KITS.map(kit => (
              <div className="kit-preview-card" key={kit.id}>
                <span className="kit-emoji">{kit.icon || '🌿'}</span>
                <div className="kit-name">{kit.name}</div>
                <p className="kit-tagline">{kit.tagline}</p>
                <div className="kit-herbs">
                  {(kit.composition || []).slice(0, 4).map((h, i) => (
                    <span className="herb-pill" key={i}>{h}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-banner">
        <h2 className="cta-banner-title">지금 바로 AI 진단을 시작해보세요</h2>
        <p className="cta-banner-sub">무료로 나에게 맞는 약선 식단을 확인하세요</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/consumer" className="btn btn-primary">무료 AI 진단</Link>
          <Link to="/saas" className="btn btn-outline">API 문서 보기</Link>
        </div>
      </section>
      {/* BGM CONTROLLER */}
      <div className={`bgm-controller ${bgmPlaying ? 'playing' : ''}`} onClick={toggleBgm}>
        <span className="bgm-icon">{bgmPlaying ? '🎵' : '🔇'}</span>
        <span className="bgm-tooltip">{bgmPlaying ? '힐링 BGM 끄기' : '힐링 BGM 켜기'}</span>
      </div>
      <audio 
        ref={audioRef} 
        src="https://commondatastorage.googleapis.com/codeskulptor-assets/Earsicons/Earsicon_bgm.mp3" 
        loop 
        preload="none" 
      />
    </>
  );
}
