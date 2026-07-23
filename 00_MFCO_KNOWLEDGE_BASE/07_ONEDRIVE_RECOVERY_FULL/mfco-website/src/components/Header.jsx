import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp, LANGUAGES } from '../context/AppContext';
import { ShoppingCart, Globe, Menu, X, Zap } from 'lucide-react';

const NAV_LINKS = [
  { path: '/', label: '홈', label_en: 'Home' },
  { path: '/consumer', label: '일반인', label_en: 'Consumer' },
  { path: '/professional', label: '전문가', label_en: 'Professional' },
  { path: '/shop', label: '상점', label_en: 'Shop' },
  { path: '/saas', label: 'SaaS', label_en: 'SaaS' },
  { path: '/franchise', label: '프렌차이즈', label_en: 'Franchise' },
  { path: '/forum', label: '교육 포럼', label_en: 'Forum' },
];

export default function Header() {
  const { lang, setLang, cartTotal } = useApp();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const currentLang = LANGUAGES.find(l => l.code === lang);

  return (
    <header className="header">
      <div className="header-inner container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <div className="logo-icon">
            <Zap size={18} strokeWidth={2.5} />
          </div>
          <span className="logo-text">MFCO</span>
          <span className="logo-tag">AI</span>
        </Link>

        {/* Nav Desktop */}
        <nav className="header-nav">
          {NAV_LINKS.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {lang === 'en' ? link.label_en : link.label}
            </Link>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="header-actions">
          {/* Language Picker */}
          <div className="lang-picker" style={{ position: 'relative' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setLangOpen(!langOpen)}>
              <Globe size={15} />
              <span>{currentLang?.flag}</span>
            </button>
            {langOpen && (
              <div className="lang-dropdown">
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    className={`lang-item ${lang === l.code ? 'active' : ''}`}
                    onClick={() => { setLang(l.code); setLangOpen(false); }}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/shop" className="cart-btn">
            <ShoppingCart size={18} />
            {cartTotal > 0 && <span className="cart-badge">{cartTotal}</span>}
          </Link>

          {/* CTA */}
          <Link to="/consumer" className="btn btn-primary btn-sm">
            {lang === 'en' ? 'Start AI Diagnosis' : 'AI 진단 시작'}
          </Link>

          {/* Mobile menu toggle */}
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="mobile-nav">
          {NAV_LINKS.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {lang === 'en' ? link.label_en : link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          background: rgba(3, 7, 18, 0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-subtle);
        }
        .header-inner { height: 68px; display: flex; align-items: center; gap: 32px; }
        .header-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; }
        .logo-icon {
          width: 34px; height: 34px; border-radius: 10px;
          background: linear-gradient(135deg, var(--neon-gold), #d97706);
          display: flex; align-items: center; justify-content: center;
          color: #030712;
        }
        .logo-text { font-family: var(--font-sans); font-weight: 800; font-size: 1.2rem; color: var(--text-primary); letter-spacing: -0.03em; }
        .logo-tag { font-size: 0.65rem; font-weight: 700; color: var(--neon-gold); background: var(--neon-gold-dim); padding: 2px 6px; border-radius: 4px; letter-spacing: 0.08em; }
        .header-nav { display: flex; align-items: center; gap: 4px; flex: 1; }
        .nav-link { padding: 6px 14px; border-radius: 8px; font-size: 0.88rem; font-weight: 500; color: var(--text-secondary); transition: all 0.2s; text-decoration: none; }
        .nav-link:hover { color: var(--text-primary); background: var(--bg-card); }
        .nav-link.active { color: var(--neon-gold); background: var(--neon-gold-dim); }
        .header-actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .cart-btn { position: relative; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 10px; background: var(--bg-card); border: 1px solid var(--border-card); color: var(--text-secondary); transition: all 0.2s; }
        .cart-btn:hover { color: var(--neon-gold); border-color: var(--border-accent); }
        .cart-badge { position: absolute; top: -6px; right: -6px; width: 18px; height: 18px; border-radius: 50%; background: var(--neon-gold); color: #030712; font-size: 0.65rem; font-weight: 700; display: flex; align-items: center; justify-content: center; }
        .lang-dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: var(--bg-card); border: 1px solid var(--border-card); border-radius: var(--radius-md); padding: 8px; min-width: 150px; z-index: 1001; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
        .lang-item { display: flex; align-items: center; gap: 8px; width: 100%; padding: 8px 12px; border-radius: 8px; background: none; border: none; color: var(--text-secondary); font-size: 0.88rem; cursor: pointer; transition: all 0.15s; }
        .lang-item:hover { background: var(--bg-card-hover); color: var(--text-primary); }
        .lang-item.active { color: var(--neon-gold); background: var(--neon-gold-dim); }
        .mobile-menu-btn { display: none; background: none; border: none; color: var(--text-secondary); cursor: pointer; padding: 4px; }
        .mobile-nav { display: none; flex-direction: column; gap: 4px; padding: 12px 24px 16px; border-top: 1px solid var(--border-subtle); background: var(--bg-surface); }
        .mobile-nav-link { padding: 10px 16px; border-radius: 8px; font-size: 0.95rem; font-weight: 500; color: var(--text-secondary); text-decoration: none; }
        .mobile-nav-link.active { color: var(--neon-gold); background: var(--neon-gold-dim); }
        @media (max-width: 900px) {
          .header-nav { display: none; }
          .mobile-menu-btn { display: flex; }
          .mobile-nav { display: flex; }
        }
        @media (max-width: 480px) {
          .btn.btn-primary.btn-sm { display: none; }
        }
      `}</style>
    </header>
  );
}
