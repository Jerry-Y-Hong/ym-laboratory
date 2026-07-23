import { useState } from 'react';
import { KITS, SHOP_PRODUCTS } from '../data/mfcoData';
import { useApp } from '../context/AppContext';

const FILTER_TABS = ['전체', '약선키트', '자연산 산야초', '전통주', '명인장류', '명품곡물', '웰니스기기'];

const ALL_PRODUCTS = [...(KITS || []), ...(SHOP_PRODUCTS || [])];


const FEATURED_RECIPES = [
  {
    icon: '🍲',
    name: '황기 삼계탕',
    kit: 'K01',
    desc: '활력 회복에 좋은 황기와 인삼이 어우러진 전통 삼계탕 레시피',
    time: '90분',
    servings: '2인분',
  },
  {
    icon: '🫖',
    name: '구기자 홍삼 차',
    kit: 'K02',
    desc: '항산화 효과의 구기자와 홍삼이 조화로운 건강 차',
    time: '10분',
    servings: '1인분',
  },
  {
    icon: '🥣',
    name: '연자육 죽',
    kit: 'K03',
    desc: '마음을 안정시키는 연자육이 들어간 부드러운 죽',
    time: '30분',
    servings: '2인분',
  },
];

export default function Shop() {
  const [activeFilter, setActiveFilter] = useState('전체');
  const [cartOpen, setCartOpen] = useState(false);
  const [addedItem, setAddedItem] = useState(null);

  const { addToCart, cart } = useApp ? useApp() : { addToCart: () => {}, cart: [] };

  const filteredProducts = ALL_PRODUCTS.filter(product => {
    if (activeFilter === '전체') return true;
    return product.category === activeFilter;
  });

  const cartTotal = (cart || []).reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);
  const cartCount = (cart || []).reduce((sum, item) => sum + (item.qty || 1), 0);

  const handleAddToCart = (product) => {
    addToCart && addToCart(product);
    setAddedItem(product.id);
    setCartOpen(true);
    setTimeout(() => setAddedItem(null), 1500);
  };


  return (
    <>
      <style>{`
        .shop-page {
          min-height: 100vh;
          padding-top: 100px;
          background: var(--bg-base);
        }

        /* HERO */
        .shop-hero {
          padding: 4rem 1.5rem 3rem;
          text-align: center;
          background: radial-gradient(ellipse at center top, rgba(201,168,76,0.1) 0%, transparent 60%);
          position: relative;
          overflow: hidden;
        }
        .shop-hero::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--neon-gold), transparent);
          opacity: 0.4;
        }
        .shop-hero-title {
          font-family: var(--font-serif);
          font-size: clamp(1.8rem, 4vw, 3.5rem);
          background: linear-gradient(135deg, #fff 30%, var(--neon-gold) 70%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.75rem;
        }
        .shop-hero-sub {
          color: rgba(255,255,255,0.5);
          font-size: 1rem;
          margin-bottom: 1.5rem;
        }

        /* CART FAB */
        .cart-fab {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 100;
          background: var(--neon-gold);
          color: #000;
          border: none;
          border-radius: 50px;
          padding: 0.75rem 1.5rem;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 24px rgba(201,168,76,0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .cart-fab:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 32px rgba(201,168,76,0.5);
        }
        .cart-badge {
          background: #000;
          color: var(--neon-gold);
          border-radius: 50%;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 800;
        }

        /* CART SIDEBAR */
        .cart-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 200;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s;
        }
        .cart-overlay.open {
          opacity: 1;
          pointer-events: all;
        }
        .cart-sidebar {
          position: fixed;
          top: 0;
          right: 0;
          width: 380px;
          max-width: 95vw;
          height: 100vh;
          background: #0f0f12;
          border-left: 1px solid rgba(201,168,76,0.2);
          z-index: 300;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
          display: flex;
          flex-direction: column;
        }
        .cart-sidebar.open { transform: translateX(0); }
        .cart-sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .cart-sidebar-header h3 {
          font-family: var(--font-serif);
          font-size: 1.3rem;
          color: #fff;
        }
        .cart-close-btn {
          background: rgba(255,255,255,0.06);
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          color: #fff;
          cursor: pointer;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .cart-close-btn:hover { background: rgba(255,255,255,0.12); }
        .cart-items {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 1.5rem;
        }
        .cart-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .cart-item-icon { font-size: 1.8rem; }
        .cart-item-info { flex: 1; }
        .cart-item-name {
          font-size: 0.9rem;
          color: #fff;
          margin-bottom: 0.2rem;
        }
        .cart-item-price {
          font-size: 0.82rem;
          color: var(--neon-gold);
        }
        .cart-empty {
          text-align: center;
          padding: 3rem 1rem;
          color: rgba(255,255,255,0.3);
          font-size: 0.9rem;
        }
        .cart-footer {
          padding: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .cart-total {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          font-size: 0.95rem;
          color: rgba(255,255,255,0.7);
        }
        .cart-total strong { color: var(--neon-gold); font-size: 1.1rem; }

        /* FILTER TABS */
        .shop-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }
        .filter-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }
        .filter-tab {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50px;
          padding: 0.5rem 1.25rem;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          transition: all 0.2s;
          font-family: var(--font-sans);
        }
        .filter-tab:hover {
          background: rgba(255,255,255,0.09);
          color: #fff;
        }
        .filter-tab.active {
          background: rgba(201,168,76,0.15);
          border-color: var(--neon-gold);
          color: var(--neon-gold);
        }

        /* KIT CARDS GRID */
        .kits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 5rem;
        }
        .kit-shop-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 1.5rem;
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .kit-shop-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--neon-gold), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .kit-shop-card:hover {
          transform: translateY(-6px);
          background: rgba(255,255,255,0.06);
          border-color: rgba(201,168,76,0.25);
        }
        .kit-shop-card:hover::after { opacity: 1; }
        .kit-shop-emoji {
          font-size: 3.5rem;
          margin-bottom: 1rem;
          display: block;
          text-align: center;
          animation: float 3.5s ease-in-out infinite;
        }
        .kit-type-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50px;
          padding: 0.2rem 0.7rem;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.5);
        }
        .kit-shop-name {
          font-family: var(--font-serif);
          font-size: 1.15rem;
          color: #fff;
          margin-bottom: 0.4rem;
          text-align: center;
        }
        .kit-shop-tagline {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.5);
          text-align: center;
          margin-bottom: 1.25rem;
          line-height: 1.5;
          flex: 1;
        }
        .kit-herb-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-bottom: 1.25rem;
          justify-content: center;
        }
        .herb-pill {
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 50px;
          padding: 0.2rem 0.6rem;
          font-size: 0.7rem;
          color: var(--neon-gold);
        }
        .kit-shop-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .kit-price {
          font-size: 1.3rem;
          font-weight: 700;
          color: #fff;
        }
        .kit-price span {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.4);
          font-weight: 400;
        }
        .add-to-cart-btn {
          background: var(--neon-gold);
          color: #000;
          border: none;
          border-radius: 50px;
          padding: 0.6rem 1.1rem;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          font-family: var(--font-sans);
        }
        .add-to-cart-btn:hover {
          background: #f5d78e;
          transform: scale(1.04);
        }
        .add-to-cart-btn.added {
          background: #4ade80;
        }

        /* FEATURED RECIPES */
        .featured-section {
          padding: 4rem 0;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .featured-title {
          font-family: var(--font-serif);
          font-size: 1.8rem;
          color: #fff;
          margin-bottom: 0.5rem;
        }
        .featured-sub {
          color: rgba(255,255,255,0.45);
          font-size: 0.9rem;
          margin-bottom: 2rem;
        }
        .featured-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        .featured-recipe-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 1.25rem;
          padding: 1.75rem 1.5rem;
          transition: all 0.3s;
        }
        .featured-recipe-card:hover {
          background: rgba(255,255,255,0.07);
          transform: translateY(-3px);
        }
        .recipe-icon { font-size: 2rem; margin-bottom: 0.75rem; }
        .recipe-name {
          font-family: var(--font-serif);
          font-size: 1rem;
          color: #fff;
          margin-bottom: 0.4rem;
        }
        .recipe-desc {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.5;
          margin-bottom: 0.75rem;
        }
        .recipe-meta {
          display: flex;
          gap: 0.75rem;
          font-size: 0.72rem;
          color: rgba(255,255,255,0.35);
        }

        .shop-disclaimer {
          margin-top: 5rem;
          padding: 2rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(201,168,76,0.15);
          border-radius: 1.25rem;
          text-align: center;
        }
        .disclaimer-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--neon-gold);
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
        }
        .disclaimer-text {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.4);
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @media (max-width: 768px) {
          .kits-grid { grid-template-columns: 1fr 1fr; }
          .featured-grid { grid-template-columns: 1fr; }
          .cart-sidebar { width: 100vw; }
        }
        @media (max-width: 480px) {
          .kits-grid { grid-template-columns: 1fr; }
        }

        /* WILD HERB CERTIFICATION */
        .wild-herb-cert {
          background: linear-gradient(135deg, rgba(201,168,76,0.12) 0%, rgba(16,185,129,0.06) 100%);
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          margin-bottom: 1rem;
          text-align: left;
        }
        .cert-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 0.4rem;
        }
        .cert-icon {
          font-size: 0.95rem;
        }
        .cert-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--neon-gold);
          letter-spacing: 0.05em;
        }
        .cert-body {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.4;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .cert-no {
          font-family: monospace;
          color: rgba(255,255,255,0.7);
        }
        .cert-collector {
          color: #a7f3d0;
        }
        .cert-features {
          font-style: italic;
          color: rgba(255,255,255,0.4);
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 0.25rem;
          margin-top: 0.25rem;
        }

        /* PRODUCT SPEC BADGES */
        .product-details-spec {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-bottom: 1rem;
          justify-content: center;
        }
        .spec-badge {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 4px;
          padding: 0.15rem 0.45rem;
          font-size: 0.72rem;
          color: rgba(255,255,255,0.7);
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
        }
      `}</style>

      <div className="shop-page">
        {/* HERO */}
        <div className="shop-hero">
          <div className="section-tag">엔스트라 프리미엄 웰니스 스토어</div>
          <h1 className="shop-hero-title">Enstra Premium Wellness Mall</h1>
          <p className="shop-hero-sub">야생 자연산 산야초부터 하이엔드 전통 발효가 빚어낸 명품 셀렉션</p>
        </div>

        {/* CART FAB */}
        {cartCount > 0 && (
          <button className="cart-fab" onClick={() => setCartOpen(true)}>
            🛒 장바구니
            <span className="cart-badge">{cartCount}</span>
          </button>
        )}

        {/* CART SIDEBAR */}
        <div className={`cart-overlay${cartOpen ? ' open' : ''}`} onClick={() => setCartOpen(false)} />
        <div className={`cart-sidebar${cartOpen ? ' open' : ''}`}>
          <div className="cart-sidebar-header">
            <h3>🛒 장바구니</h3>
            <button className="cart-close-btn" onClick={() => setCartOpen(false)}>✕</button>
          </div>
          <div className="cart-items">
            {(!cart || cart.length === 0) ? (
              <div className="cart-empty">장바구니가 비어있습니다<br /><br />😊 마음에 드는 프리미엄 상품을 담아보세요</div>
            ) : (
              cart.map((item, i) => (
                <div className="cart-item" key={i}>
                  <span className="cart-item-icon">{item.icon || '🌿'}</span>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">₩{(item.price || 0).toLocaleString()} <span style={{fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)'}}>x {item.qty || 1}</span></div>
                  </div>
                </div>
              ))
            )}
          </div>
          {cart && cart.length > 0 && (
            <div className="cart-footer">
              <div className="cart-total">
                <span>합계</span>
                <strong>₩{cartTotal.toLocaleString()}</strong>
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }}>결제하기 →</button>
            </div>
          )}
        </div>

        {/* MAIN */}
        <div className="shop-inner">
          {/* FILTER TABS */}
          <div className="filter-tabs">
            {FILTER_TABS.map(tab => (
              <button
                key={tab}
                className={`filter-tab${activeFilter === tab ? ' active' : ''}`}
                onClick={() => setActiveFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* PRODUCT CARDS */}
          <div className="kits-grid">
            {filteredProducts.map(product => (
              <div className="kit-shop-card" key={product.id}>
                <span className="kit-type-badge">{product.category}</span>
                <span className="kit-shop-emoji">{product.icon || '🌿'}</span>
                <div className="kit-shop-name">{product.name}</div>
                <p className="kit-shop-tagline">{product.tagline}</p>
                
                {/* 자연산 산야초 전용 자연산 인증마크 및 채취인 정보 */}
                {product.category === '자연산 산야초' && product.details && (
                  <div className="wild-herb-cert">
                    <div className="cert-header">
                      <span className="cert-icon">🏅</span>
                      <span className="cert-title">자연산 인증 완료</span>
                    </div>
                    <div className="cert-body">
                      <div className="cert-no">인증번호: {product.details.certNo}</div>
                      <div className="cert-collector">전문 채취인: {product.details.collector}</div>
                      <div className="cert-features">{product.details.features}</div>
                    </div>
                  </div>
                )}

                {/* 상품 스펙 상세 정보 배지 */}
                {product.category !== '자연산 산야초' && product.details && (
                  <div className="product-details-spec">
                    {product.details.abv && <span className="spec-badge">🍶 도수 {product.details.abv}</span>}
                    {product.details.maker && <span className="spec-badge">👤 명인/제조 {product.details.maker}</span>}
                    {product.details.aging && <span className="spec-badge">🏺 숙성 {product.details.aging}</span>}
                    {product.details.origin && <span className="spec-badge">📍 산지 {product.details.origin}</span>}
                    {product.details.grade && <span className="spec-badge">🌾 등급 {product.details.grade}</span>}
                    {product.details.sensors && <span className="spec-badge">💍 {product.details.sensors}</span>}
                    {product.details.battery && <span className="spec-badge">🔋 {product.details.battery}</span>}
                    {product.details.connection && <span className="spec-badge">🔌 {product.details.connection}</span>}
                  </div>
                )}

                <div className="kit-herb-pills">
                  {(product.composition || []).map((h, i) => (
                    <span className="herb-pill" key={i}>{h}</span>
                  ))}
                </div>
                
                <div className="kit-shop-footer">
                  <div className="kit-price">
                    ₩{(product.price || 0).toLocaleString()}
                    <span> / {product.format || '1박스'}</span>
                  </div>
                  <button
                    className={`add-to-cart-btn${addedItem === product.id ? ' added' : ''}`}
                    onClick={() => handleAddToCart(product)}
                  >
                    {addedItem === product.id ? '✓ 담김' : '장바구니 담기'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* FEATURED RECIPES */}
          <div className="featured-section">
            <div className="section-tag">추천 레시피</div>
            <h2 className="featured-title">전통과 현대가 빚은 요리 처방</h2>
            <p className="featured-sub">MFCO 프리미엄 웰니스 제품을 활용한 전통 약선 레시피</p>
            <div className="featured-grid">
              {FEATURED_RECIPES.map((r, i) => (
                <div className="featured-recipe-card" key={i}>
                  <div className="recipe-icon">{r.icon}</div>
                  <div className="recipe-name">{r.name}</div>
                  <p className="recipe-desc">{r.desc}</p>
                  <div className="recipe-meta">
                    <span>⏱ {r.time}</span>
                    <span>👥 {r.servings}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LEGAL DISCLAIMER */}
          <div className="shop-disclaimer">
            <div className="disclaimer-title">⚠️ 법적 고지 및 안내 (Legal Disclaimer)</div>
            <p className="disclaimer-text">
              본 제품은 질병의 예방 및 치료를 목적으로 하는 의약품이나 건강기능식품이 아니며,
              동의보감 및 약선 기미론의 지식을 기반으로 사용자의 건강한 식생활 조절을 돕는 일반 식품 조리용 키트(부재료) 및 전통 식품 셀렉션입니다.
              원료의 특성 및 체질별 상충 관계는 한방 지식베이스에 근거하며, 개인의 신체 반응에 따라 차이가 있을 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
