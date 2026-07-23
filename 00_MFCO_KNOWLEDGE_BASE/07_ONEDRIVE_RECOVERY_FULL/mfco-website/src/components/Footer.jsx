import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

const Github = ({ size = 16, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-icon-sm"><Zap size={16} /></div>
              <span className="logo-text-sm">MFCO</span>
            </div>
            <p className="footer-desc">
              AI 기반 약선 키트 추천 플랫폼.<br />
              1,673종 한약재 DB × 사상체질 × 24절기<br />
              과학적 한방 식단의 새로운 기준.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-btn"><Github size={16} /></a>
              <a href="#" className="social-btn"><ExternalLink size={16} /></a>
            </div>
          </div>

          {/* Links */}
          <div className="footer-links-col">
            <h5>서비스</h5>
            <Link to="/consumer">일반인 포털</Link>
            <Link to="/professional">전문가 포털</Link>
            <Link to="/shop">온라인 상점</Link>
            <Link to="/saas">SaaS API</Link>
            <Link to="/franchise">프렌차이즈</Link>
          </div>

          <div className="footer-links-col">
            <h5>기술</h5>
            <a href="#">AI 추론 엔진</a>
            <a href="#">한약재 DB</a>
            <a href="#">다국어 번역 시스템</a>
            <a href="#">API 문서</a>
            <a href="#">오픈소스</a>
          </div>

          {/* Contact */}
          <div className="footer-contact">
            <h5>연락처</h5>
            <div className="contact-item"><Mail size={14} /><span>contact@mfco.ai</span></div>
            <div className="contact-item"><Phone size={14} /><span>02-0000-0000</span></div>
            <div className="contact-item"><MapPin size={14} /><span>서울특별시 강남구</span></div>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="text-muted" style={{ fontSize: '0.82rem' }}>
            © 2025 MFCO. All rights reserved. | AI Medicinal Food Curation & Optimization
          </span>
          <div className="footer-bottom-links">
            <a href="#">이용약관</a>
            <a href="#">개인정보처리방침</a>
          </div>
        </div>
      </div>

      <style>{`
        .footer { background: var(--bg-surface); border-top: 1px solid var(--border-subtle); padding: 64px 0 32px; margin-top: auto; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.2fr; gap: 48px; margin-bottom: 48px; }
        .footer-brand {}
        .footer-logo { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
        .logo-icon-sm { width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(135deg, var(--neon-gold), #d97706); display: flex; align-items: center; justify-content: center; color: #030712; }
        .logo-text-sm { font-weight: 800; font-size: 1.1rem; letter-spacing: -0.02em; }
        .footer-desc { font-size: 0.88rem; color: var(--text-muted); line-height: 1.8; margin-bottom: 20px; }
        .footer-socials { display: flex; gap: 8px; }
        .social-btn { width: 34px; height: 34px; border-radius: 8px; background: var(--bg-card); border: 1px solid var(--border-card); display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: all 0.2s; }
        .social-btn:hover { color: var(--neon-gold); border-color: var(--border-accent); }
        .footer-links-col { display: flex; flex-direction: column; gap: 10px; }
        .footer-links-col h5 { font-family: var(--font-sans); font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; }
        .footer-links-col a { font-size: 0.9rem; color: var(--text-secondary); text-decoration: none; transition: color 0.15s; }
        .footer-links-col a:hover { color: var(--neon-gold); }
        .footer-contact { display: flex; flex-direction: column; gap: 10px; }
        .footer-contact h5 { font-family: var(--font-sans); font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; }
        .contact-item { display: flex; align-items: center; gap: 8px; font-size: 0.88rem; color: var(--text-secondary); }
        .footer-bottom { display: flex; align-items: center; justify-content: space-between; padding-top: 24px; border-top: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 12px; }
        .footer-bottom-links { display: flex; gap: 20px; }
        .footer-bottom-links a { font-size: 0.82rem; color: var(--text-muted); text-decoration: none; }
        .footer-bottom-links a:hover { color: var(--text-secondary); }
        @media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 560px) { .footer-grid { grid-template-columns: 1fr; } .footer-bottom { flex-direction: column; align-items: flex-start; } }
      `}</style>
    </footer>
  );
}
