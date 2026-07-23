import { useState, useEffect } from 'react';
import { STATES, CONSTITUTIONS, ORGANS, KITS, SOLAR_TERMS_TODAY, RECIPES } from '../data/mfcoData';
import { MFCOInferenceEngine } from '../utils/mfcoInference';
import { ShoppingCart, RefreshCw, Layers, Award, Heart, ShieldAlert, Sparkles } from 'lucide-react';

const engine = new MFCOInferenceEngine();

const LANG_LABELS = {
  ko: '한국어',
  en: 'English',
  zh: '中文',
  ja: '日本語',
};

const COURSE_STORYTELLING = {
  appetizer: {
    title: '1단계: 개위 (開胃 - 식전 차)',
    desc: '비위(脾胃)의 기운을 흔들어 깨우는 단계입니다. 가벼운 죽과 함께 신맛이 감도는 개위차를 마셔 침샘을 자극하고 소화액 분비를 유도하여, 이후 들어올 음식을 편안하게 받아들일 수 있도록 몸을 든든히 예비합니다.',
  },
  entree: {
    title: '2단계: 통락 (通絡 - 전채 요리)',
    desc: '경락의 기혈 순환을 열어주는 전채 요리 단계입니다. 가벼운 나물무침과 활혈(活血) 작용이 있는 전, 냉채류를 통해 몸속의 막힌 기운을 사방으로 통하게 해 기혈의 순환을 한 단계 촉진합니다.',
  },
  main: {
    title: '3단계: 보양 (補養 - 본식 요리)',
    desc: '오장육부(五臟六腑)의 중심에 직접적인 기력과 영양을 채우는 코스의 정수입니다. 따뜻한 영양밥과 뜨거운 보양 국/탕, 든든한 육류/수산물 메인 요리 및 명품 저염 김치가 완벽히 어우러져 근본 기혈과 골격을 단단하게 채워줍니다.',
  },
  dessert: {
    title: '4단계: 수렴 (收斂 - 다반 디저트)',
    desc: '식사를 마친 후 소화 과정에서 생긴 열과 활성 에너지를 차분히 감싸 안고 심신을 평온하게 다듬어주는 마무리 단계입니다. 안신(安心) 작용이 풍부한 리추얼 한방 차를 즐기며 오늘의 미식 치유를 몸소 완결합니다.',
  },
};

export default function Consumer() {
  const [step, setStep] = useState(1);
  const [selectedStates, setSelectedStates] = useState([]);
  const [constitution, setConstitution] = useState(null);
  const [selectedOrgan, setSelectedOrgan] = useState(null);
  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [chupCount, setChupCount] = useState(5); // Default 5-Bansang/Chup
  const [lang, setLang] = useState('ko');
  
  // Results
  const [inferenceResult, setInferenceResult] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' (Soban) or 'course'
  const [selectedBowl, setSelectedBowl] = useState(null); // Clicked bowl details

  // Wearable Device Connection Simulated States
  const [syncing, setSyncing] = useState(false);
  const [wearableSynced, setWearableSynced] = useState(false);

  const solarTerm = engine.getSolarTermByDate(dateStr) || SOLAR_TERMS_TODAY();

  // Run or update inference when configuration changes
  useEffect(() => {
    if (step === 5 && selectedStates.length > 0) {
      // Find organ English code
      const organObj = ORGANS.find(o => o.id === selectedOrgan);
      const organCode = organObj ? organObj.code : null;

      const result = engine.inferRecipeUpgrade(
        selectedStates,
        constitution,
        organCode,
        dateStr,
        chupCount
      );
      setInferenceResult(result);
      if (result && result.recipe) {
        setSelectedBowl(result.recipe);
      }
    }
  }, [step, chupCount, selectedStates, constitution, selectedOrgan, dateStr]);

  const toggleState = (id) => {
    setSelectedStates(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    setStep(5);
  };

  const reset = () => {
    setStep(1);
    setSelectedStates([]);
    setConstitution(null);
    setSelectedOrgan(null);
    setChupCount(5);
    setInferenceResult(null);
    setViewMode('table');
    setSelectedBowl(null);
    setWearableSynced(false);
  };

  // Simulating 1-second Wearable Sync
  const handleWearableSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setWearableSynced(true);
      
      // Auto fill biomarker parameters
      setSelectedStates(['ST-002', 'ST-007']); // 수면계 + 정서계
      setConstitution('SE'); // 소음인
      setSelectedOrgan('비'); // 비장 약화
      
      // Fast forward to Result (Step 5)
      setStep(5);
    }, 1000);
  };

  const progress = ((step - 1) / 4) * 100;

  // Render brassware dishes in traditional circular layout on Soban
  const renderSobanDishes = () => {
    if (!inferenceResult || !inferenceResult.mealSet) return null;
    const { mealSet } = inferenceResult;

    // Core items: Staple (밥), Soup (국), Stew (찌개), Sauce (종지)
    // Side dishes: sides (N items)
    const sides = mealSet.sides || [];
    
    // Calculate polar coordinates for side dishes in a circle
    const radius = 105; // radius in px
    const centerX = 175; // center in px
    const centerY = 175; // center in px

    return (
      <div className="soban-wood-table">
        {/* Core Item 1: Sauce Condiment (종지) - Center */}
        {mealSet.sauce && (
          <div 
            className={`brass-bowl bowl-sauce ${selectedBowl?.id === mealSet.sauce.id ? 'highlighted' : ''}`}
            onClick={() => setSelectedBowl(mealSet.sauce)}
            style={{ left: `${centerX - 35}px`, top: `${centerY - 35}px` }}
          >
            <span className="bowl-emoji">{mealSet.sauce.icon || '🏺'}</span>
            <span className="bowl-name">{mealSet.sauce.name}</span>
            <span className="bowl-badge">간장종지</span>
          </div>
        )}

        {/* Core Item 2: Staple Rice (밥) - Bottom Left */}
        {mealSet.staple && (
          <div 
            className={`brass-bowl bowl-staple ${selectedBowl?.id === mealSet.staple.id ? 'highlighted' : ''}`}
            onClick={() => setSelectedBowl(mealSet.staple)}
            style={{ left: '60px', top: '230px' }}
          >
            <span className="bowl-emoji">{mealSet.staple.icon || '🍚'}</span>
            <span className="bowl-name">{mealSet.staple.name}</span>
            <span className="bowl-badge">주식 (밥)</span>
          </div>
        )}

        {/* Core Item 3: Soup (국) - Bottom Right */}
        {mealSet.soup && (
          <div 
            className={`brass-bowl bowl-soup ${selectedBowl?.id === mealSet.soup.id ? 'highlighted' : ''}`}
            onClick={() => setSelectedBowl(mealSet.soup)}
            style={{ left: '200px', top: '230px' }}
          >
            <span className="bowl-emoji">{mealSet.soup.icon || '🍲'}</span>
            <span className="bowl-name">{mealSet.soup.name}</span>
            <span className="bowl-badge">탕 / 국</span>
          </div>
        )}

        {/* Core Item 4: Stew (찌개/조치) - Top Right (If 7+ Chup) */}
        {mealSet.stew && (
          <div 
            className={`brass-bowl bowl-stew ${selectedBowl?.id === mealSet.stew.id ? 'highlighted' : ''}`}
            onClick={() => setSelectedBowl(mealSet.stew)}
            style={{ left: '230px', top: '80px' }}
          >
            <span className="bowl-emoji">{mealSet.stew.icon || '🍲'}</span>
            <span className="bowl-name">{mealSet.stew.name}</span>
            <span className="bowl-badge">찌개 / 조치</span>
          </div>
        )}

        {/* Dynamic Side Dishes (Chup dishes arranged circularly) */}
        {sides.map((side, index) => {
          // Compute angle for each side dish (distribute in arc around center)
          // Adjust start/end angles to avoid overlap with bottom Rice/Soup area
          const numSides = sides.length;
          const startAngle = -Math.PI * 0.7;
          const endAngle = Math.PI * 0.95;
          const angleRange = endAngle - startAngle;
          const angle = startAngle + (index / Math.max(numSides - 1, 1)) * angleRange;
          
          const x = centerX + radius * Math.cos(angle) - 40;
          const y = centerY + radius * Math.sin(angle) - 40;

          return (
            <div 
              key={side.id || index}
              className={`brass-dish ${selectedBowl?.id === side.id ? 'highlighted' : ''}`}
              onClick={() => setSelectedBowl(side)}
              style={{ left: `${x}px`, top: `${y}px` }}
            >
              <span className="dish-emoji">{side.icon || '🥗'}</span>
              <span className="dish-name">{side.name.slice(0, 8)}</span>
              <span className="dish-badge">첩찬 {index + 1}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <style>{`
        .consumer-page {
          min-height: 100vh;
          padding-top: 100px;
          padding-bottom: 5rem;
          background: var(--bg-base);
          color: var(--text-primary);
        }
        .consumer-inner {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        /* WIZARD PROGRESS */
        .progress-wrap { margin-bottom: 2.5rem; }
        .progress-labels { display: flex; justify-content: space-between; margin-bottom: 0.6rem; font-size: 0.8rem; color: var(--text-muted); }
        .progress-bar-track { height: 4px; background: rgba(255,255,255,0.06); border-radius: 4px; overflow: hidden; }
        .progress-bar-fill { height: 100%; background: linear-gradient(90deg, var(--neon-gold) 0%, #fbbf24 100%); transition: width 0.4s ease; }
        .step-indicator { font-size: 0.8rem; color: var(--neon-gold); font-weight: 600; margin-top: 0.6rem; }

        /* STEP GENERAL HEADERS */
        .step-header { margin-bottom: 2.2rem; }
        .step-header h2 { font-family: var(--font-serif); font-size: 2.1rem; color: #fff; margin-bottom: 0.6rem; }
        .step-header p { color: var(--text-muted); font-size: 0.95rem; }

        /* WEARABLE SYNC BANNER */
        .wearable-sync-banner {
          background: rgba(255,255,255,0.02);
          border: 1px dashed rgba(201,168,76,0.25);
          border-radius: 1.25rem;
          padding: 1.5rem;
          margin-bottom: 2.2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          backdrop-filter: blur(8px);
        }
        .wearable-info h4 { font-family: var(--font-serif); font-size: 1.15rem; color: #fff; margin-bottom: 4px; }
        .wearable-info p { font-size: 0.8rem; color: var(--text-muted); }
        .sync-btn {
          border: 1px solid var(--neon-gold);
          background: var(--neon-gold-dim);
          color: var(--neon-gold);
          font-weight: 700;
          font-size: 0.85rem;
          padding: 0.65rem 1.35rem;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(201,168,76,0.1);
          white-space: nowrap;
        }
        .sync-btn:hover { background: var(--neon-gold); color: #000; transform: translateY(-1px); }

        /* GRID/CARD SELECTIONS */
        .symptoms-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.8rem; margin-bottom: 2.5rem; }
        .symptom-card {
          background: var(--bg-card);
          border: 1px solid var(--border-card);
          border-radius: 1rem;
          padding: 1.1rem;
          cursor: pointer;
          transition: all 0.25s;
          display: flex;
          gap: 0.8rem;
        }
        .symptom-card:hover { border-color: rgba(201,168,76,0.4); transform: translateY(-2px); }
        .symptom-card.selected { background: var(--neon-gold-dim); border-color: var(--neon-gold); box-shadow: 0 0 15px rgba(201,168,76,0.1); }
        .symptom-icon { font-size: 1.6rem; }
        .symptom-name { font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 3px; }
        .symptom-desc { font-size: 0.76rem; color: var(--text-muted); line-height: 1.4; }

        .constitution-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 2.5rem; }
        .constitution-card {
          background: var(--bg-card);
          border: 1px solid var(--border-card);
          border-radius: 1.25rem;
          padding: 1.8rem;
          cursor: pointer;
          transition: all 0.25s;
          text-align: center;
        }
        .constitution-card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.2); }
        .constitution-card.selected { border-width: 2px; }
        .constitution-name { font-family: var(--font-serif); font-size: 1.6rem; color: #fff; margin-bottom: 4px; }
        .constitution-desc { font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; }

        .organs-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.8rem; margin-bottom: 2.5rem; }
        .organ-btn {
          background: var(--bg-card);
          border: 1px solid var(--border-card);
          border-radius: 1rem;
          padding: 1.25rem 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
          color: #fff;
        }
        .organ-btn:hover { border-color: rgba(255,255,255,0.2); transform: translateY(-2px); }
        .organ-btn.selected { border-color: var(--neon-gold); background: var(--neon-gold-dim); }
        .organ-icon { font-size: 1.8rem; display: block; margin-bottom: 6px; }
        .organ-name { font-size: 0.85rem; font-weight: 700; }

        .solar-card {
          background: radial-gradient(circle at top right, rgba(201,168,76,0.1) 0%, rgba(201,168,76,0.02) 100%);
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 1.25rem;
          padding: 2.2rem;
          margin-bottom: 2rem;
        }
        .solar-name { font-family: var(--font-serif); font-size: 2.4rem; color: var(--neon-gold); margin-bottom: 0.4rem; }
        .solar-meta { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.2rem; }
        .solar-desc { font-size: 0.95rem; line-height: 1.7; color: var(--text-secondary); }

        .date-picker-wrap { margin-top: 1.5rem; }
        .date-picker-wrap label { display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 6px; }
        .date-picker-wrap input { background: var(--bg-card); border: 1px solid var(--border-card); border-radius: 8px; padding: 0.6rem 1rem; color: #fff; width: 100%; max-width: 250px; }

        /* RESULT VIEW CONTROLS */
        .result-layout { display: grid; grid-template-columns: 1fr 380px; gap: 2rem; margin-top: 2rem; }
        .view-controls { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-subtle); }
        .control-group { display: flex; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); padding: 3px; border-radius: 50px; }
        .control-btn { border: none; background: none; color: var(--text-muted); font-size: 0.8rem; font-weight: 700; padding: 0.5rem 1.2rem; border-radius: 50px; cursor: pointer; transition: all 0.2s; }
        .control-btn.active { background: var(--neon-gold); color: #000; }

        /* NUTRITION AND LIMITS */
        .nutrition-dashboard {
          background: rgba(255,255,255,0.01);
          border: 1px solid var(--border-card);
          border-radius: 1.25rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        .nutrition-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem; text-align: center; }
        .nut-stat h5 { font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
        .nut-stat p { font-size: 1.2rem; font-weight: 700; color: #fff; }
        .nutrition-limits-monitor { margin-top: 1.2rem; border-top: 1px dashed rgba(255,255,255,0.06); padding-top: 1rem; }
        .limit-bar { height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; margin-top: 6px; }
        .limit-fill { height: 100%; border-radius: 3px; }

        /* TRADITIONAL SOBAN TABLE VISUALIZATION */
        .soban-wood-table {
          width: 350px;
          height: 350px;
          border-radius: 50%;
          background: radial-gradient(circle at center, #271f16 0%, #110c08 85%, #050403 100%);
          border: 10px solid #8c6b3e;
          box-shadow: inset 0 0 25px rgba(0,0,0,0.9), 0 20px 45px rgba(0,0,0,0.7);
          margin: 0 auto;
          position: relative;
          z-index: 5;
        }
        .brass-bowl {
          position: absolute;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: linear-gradient(135deg, #dfc699 0%, #a8854c 60%, #6e5020 100%);
          box-shadow: 0 4px 8px rgba(0,0,0,0.5), inset 0 1px 3px rgba(255,255,255,0.4);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 6px;
          color: #2b1f0c;
          cursor: pointer;
          transition: all 0.25s ease;
          border: 1px solid #cfae74;
        }
        .brass-bowl:hover { transform: scale(1.08); box-shadow: 0 0 12px rgba(255,255,255,0.6), 0 6px 12px rgba(0,0,0,0.4); }
        .brass-bowl.highlighted { box-shadow: 0 0 18px var(--neon-gold), 0 6px 12px rgba(0,0,0,0.4); border-color: #fff; transform: scale(1.05); }
        .brass-bowl .bowl-emoji { font-size: 1.4rem; margin-bottom: 2px; }
        .brass-bowl .bowl-name { font-size: 0.58rem; font-weight: 700; line-height: 1.2; max-width: 60px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
        .brass-bowl .bowl-badge { position: absolute; bottom: -8px; background: #261c10; color: #dfbe96; border: 1px solid #8c6b3e; font-size: 0.52rem; padding: 1px 4px; border-radius: 6px; white-space: nowrap; font-weight: 700; }

        .brass-dish {
          position: absolute;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f7f3eb 0%, #d8cdb4 100%);
          border: 1.5px solid #c5b597;
          box-shadow: 0 3px 6px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.6);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 4px;
          color: #3b2c18;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .brass-dish:hover { transform: scale(1.08); box-shadow: 0 0 10px rgba(255,255,255,0.7), 0 4px 8px rgba(0,0,0,0.4); }
        .brass-dish.highlighted { box-shadow: 0 0 15px var(--neon-gold), 0 4px 8px rgba(0,0,0,0.4); border-color: var(--neon-gold); transform: scale(1.05); }
        .brass-dish .dish-emoji { font-size: 1.15rem; margin-bottom: 1px; }
        .brass-dish .dish-name { font-size: 0.52rem; font-weight: 700; line-height: 1.1; max-width: 50px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
        .brass-dish .dish-badge { position: absolute; bottom: -8px; background: #3b2d18; color: #d8cdb4; font-size: 0.48rem; padding: 0.5px 3px; border-radius: 4px; white-space: nowrap; font-weight: 700; }

        .soban-teas-panel { display: flex; gap: 1rem; margin-top: 2rem; border-top: 1px dashed rgba(133,106,71,0.25); padding-top: 1.5rem; justify-content: space-between; }
        .tea-flanker { flex: 1; display: flex; align-items: center; gap: 0.8rem; padding: 0.8rem; background: rgba(0,0,0,0.2); border: 1px solid rgba(133,106,71,0.3); border-radius: 12px; }
        .tea-flanker.active { border-color: var(--neon-gold); background: rgba(201,168,76,0.03); }
        .tea-icon { font-size: 1.8rem; }
        .tea-meta h6 { font-size: 0.65rem; color: var(--neon-gold); text-transform: uppercase; letter-spacing: 0.05em; }
        .tea-meta p { font-size: 0.82rem; font-weight: 700; color: #fff; margin-top: 2px; }

        /* INTERACTION DRAWER */
        .detail-drawer { background: var(--bg-card); border: 1px solid var(--border-card); border-radius: 1.25rem; padding: 1.8rem; align-self: start; }
        .detail-header { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.8rem; }
        .detail-icon { font-size: 2.2rem; }
        .detail-title h4 { font-family: var(--font-serif); font-size: 1.2rem; color: #fff; }
        .detail-title p { font-size: 0.72rem; color: var(--neon-gold); font-weight: 700; text-transform: uppercase; }
        .detail-desc { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; }
        .detail-nut-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; text-align: center; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px; margin-top: 1rem; }
        .detail-nut h6 { font-size: 0.62rem; color: var(--text-muted); }
        .detail-nut p { font-size: 0.82rem; font-weight: 700; color: #fff; margin-top: 2px; }

        /* TIMELINE Dinning View */
        .timeline-view { display: flex; flex-direction: column; gap: 2rem; position: relative; margin-top: 1rem; }
        .timeline-view::before { content: ''; position: absolute; left: 24px; top: 0; bottom: 0; width: 1.5px; background: rgba(201,168,76,0.15); }
        .timeline-node { display: flex; gap: 1.5rem; position: relative; }
        .node-bullet { width: 50px; height: 50px; border-radius: 50%; background: #110e0a; border: 2.5px solid var(--neon-gold); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0; z-index: 2; box-shadow: 0 0 10px rgba(201,168,76,0.2); }
        .node-body { flex: 1; background: rgba(255,255,255,0.01); border: 1px solid var(--border-card); border-radius: 1.25rem; padding: 1.5rem; }
        .node-step-title { font-family: var(--font-serif); font-size: 1.1rem; color: var(--neon-gold); margin-bottom: 4px; }
        .node-step-desc { font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1rem; background: rgba(255,255,255,0.02); border-left: 2px solid var(--neon-gold); padding: 6px 10px; border-radius: 0 4px 4px 0; }
        .node-dish { display: flex; align-items: center; gap: 0.8rem; padding: 0.8rem; background: rgba(0,0,0,0.15); border-radius: 10px; border: 1px solid rgba(255,255,255,0.04); }
        .node-dish-icon { font-size: 1.4rem; }
        .node-dish-name { font-size: 0.82rem; font-weight: 700; color: #fff; }
        .node-dish-meta { font-size: 0.72rem; color: var(--text-muted); margin-top: 2px; }

        /* LANG SELECTOR */
        .lang-bar { display: flex; gap: 6px; margin-bottom: 1rem; justify-content: flex-end; }
        .lang-pill { background: rgba(255,255,255,0.04); border: 1px solid var(--border-card); border-radius: 50px; padding: 4px 12px; font-size: 0.75rem; color: var(--text-muted); cursor: pointer; transition: all 0.2s; }
        .lang-pill.active { background: var(--neon-gold-dim); border-color: var(--neon-gold); color: var(--neon-gold); }

        .step-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 2.5rem; }
      `}</style>

      <div className="consumer-page">
        <div className="consumer-inner">
          
          {step < 5 && (
            <div className="progress-wrap">
              <div className="progress-labels">
                <span>증상 진단</span>
                <span>사상 체질</span>
                <span>장부 허실</span>
                <span>24절기</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="step-indicator">단계 {step} / 4</div>
            </div>
          )}

          {/* STEP 1: SYMPTOMS & WEARABLE */}
          {step === 1 && (
            <div>
              <div className="wearable-sync-banner">
                <div className="wearable-info">
                  <h4>⌚ 바이오 메디컬 스마트 디바이스 연동</h4>
                  <p>갤럭시 링 또는 애플워치를 연동하면, 자율신경계(HRV) 피로도와 수면 패턴 및 체질 프로필이 자동으로 감지 및 적용됩니다.</p>
                </div>
                <button className="sync-btn" onClick={handleWearableSync} disabled={syncing}>
                  {syncing ? '동기화 중...' : '1초 제로클릭 동기화'}
                </button>
              </div>

              <div className="step-header">
                <h2>현재 불편하시거나 관리하고 싶으신 증상은 무엇입니까?</h2>
                <p>18가지 표준 상태 분류 중에서 일상적으로 겪는 증상을 모두 선택하세요 (복수 선택 가능)</p>
                
                {/* 1단계 AI 도우미 말풍선 */}
                <div style={{ margin: '1rem 0', padding: '1.1rem', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '0.75rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', lineHeight: '1.6' }}>
                  💡 <strong>AI 진단 팁</strong>: 현재 본인의 몸 상태에서 가장 관리가 필요한 부위를 선택해 주세요. 피로도가 심하면 <strong>에너지계</strong>, 잠이 부족하면 <strong>수면계</strong>, 가려움이나 건조가 고민이면 <strong>피부계</strong>를 복수 선택하실 수 있습니다. 잘 모르시겠다면 상단 우측의 <strong>'1초 제로클릭 동기화'</strong> 버튼을 눌러 바이오 헬스 디바이스 연동 데이터를 자동 입력받아 보세요.
                </div>
              </div>

              <div className="symptoms-grid">
                {STATES.map(s => (
                  <div 
                    key={s.id}
                    className={`symptom-card ${selectedStates.includes(s.id) ? 'selected' : ''}`}
                    onClick={() => toggleState(s.id)}
                  >
                    <span className="symptom-icon">{s.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div className="symptom-name">{s.name}</div>
                      <div className="symptom-desc">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="step-nav">
                <div />
                <button className="btn btn-primary" onClick={() => setStep(2)} disabled={selectedStates.length === 0}>
                  다음 단계 →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CONSTITUTION */}
          {step === 2 && (
            <div>
              <div className="step-header">
                <h2>사상 체질(Sasang Constitution)을 선택해 주세요</h2>
                <p>체질의 취약점 보정 가중치(γ = 0.4)가 추론 엔진에 자동 계산됩니다. 체질을 모르시면 건너뛰거나 공통을 선택하세요.</p>
                
                {/* 2단계 AI 동적 체질 추천 말풍선 */}
                <div style={{ margin: '1rem 0', padding: '1.1rem', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '0.75rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', lineHeight: '1.6' }}>
                  💡 <strong>AI 체질 매칭 가이드</strong>: 
                  {selectedStates.includes('ST-002') && <span>이전 단계에서 <strong>수면계</strong>를 선택하셨습니다. 불면과 예민함은 몸이 차가운 <strong>소음인(So-Eum)</strong>이나 열이 위로 뻗치는 <strong>소양인(So-Yang)</strong>에게 다발하므로 해당 체질 선택을 권장합니다. </span>}
                  {selectedStates.includes('ST-005') && <span>이전 단계에서 <strong>소화계</strong>를 선택하셨습니다. 비위 소화기 기능이 가장 냉해지기 쉬운 <strong>소음인(So-Eum)</strong> 선택을 적극 권장합니다. </span>}
                  {selectedStates.includes('ST-006') && <span>이전 단계에서 <strong>피부계</strong>를 선택하셨습니다. 피부 수분막 방출 조절이 약해 피부 트러블이 잦은 <strong>태음인(Tae-Eum)</strong> 선택을 권장합니다. </span>}
                  <span>본인의 정확한 체질을 모른다면 우측 하단의 <strong>'체질 모름 / 관계없음'</strong> 카드를 클릭하고 진행하셔도 무방하며, 이 경우 가중치 보정 없는 공통 처방으로 연결됩니다.</span>
                </div>
              </div>

              <div className="constitution-grid">
                {CONSTITUTIONS.map(c => (
                  <div
                    key={c.id}
                    className={`constitution-card ${constitution === c.id ? 'selected' : ''}`}
                    style={{ borderColor: constitution === c.id ? c.color : undefined, background: constitution === c.id ? c.color + '15' : undefined }}
                    onClick={() => setConstitution(c.id)}
                  >
                    <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 12 }}>{c.icon}</span>
                    <div className="constitution-name" style={{ color: c.color }}>{c.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8 }}>{c.en}</div>
                    <div className="constitution-desc">{c.desc}</div>
                  </div>
                ))}
                
                {/* 체질 모름/관계없음 카드 추가 */}
                <div
                  className={`constitution-card ${constitution === null ? 'selected' : ''}`}
                  style={{ borderColor: constitution === null ? 'var(--neon-gold)' : undefined, background: constitution === null ? 'rgba(201,168,76,0.08)' : undefined }}
                  onClick={() => setConstitution(null)}
                >
                  <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 12 }}>🌱</span>
                  <div className="constitution-name" style={{ color: 'var(--neon-gold)' }}>체질 모름 / 관계없음</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8 }}>General / Common</div>
                  <div className="constitution-desc">사상체질에 관계없이 증상 및 절기 기반의 일반 약선 처방을 받습니다.</div>
                </div>
              </div>

              <div className="step-nav">
                <button className="btn btn-outline" onClick={() => setStep(1)}>← 이전 단계</button>
                <button className="btn btn-primary" onClick={() => setStep(3)}>
                  다음 단계 →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ORGANS */}
          {step === 3 && (
            <div>
              <div className="step-header">
                <h2>특히 취약하거나 한의사에게 소견을 받은 약한 장부가 있습니까?</h2>
                <p>오장(五臟) 허실 보정 가중치(δ = 0.5)를 통해 추론의 정밀도가 상승합니다.</p>
                
                {/* 1단계 증상에 기반한 동적 한의학 추천 안내판 */}
                {selectedStates.includes('ST-006') && (
                  <div style={{ margin: '1.25rem 0', padding: '1rem', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: '0.75rem', fontSize: '0.88rem', color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    📢 <strong>[피부계 연동 안내]</strong> 동방의학의 <em>폐주피모(肺主皮毛)</em> 이론에 따라, 피부 장벽 조절을 위해 <strong>폐 (肺)</strong> 장부 보정을 추천합니다.
                  </div>
                )}
                {selectedStates.includes('ST-002') && (
                  <div style={{ margin: '1.25rem 0', padding: '1rem', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: '0.75rem', fontSize: '0.88rem', color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    📢 <strong>[수면계 연동 안내]</strong> 동방의학의 <em>심주신명(心主神明)</em> 이론에 따라, 뇌파를 진정시키고 숙면을 유도하기 위해 정신을 관장하는 <strong>심 (心)</strong> 장부 보정을 추천합니다.
                  </div>
                )}
                {!selectedStates.includes('ST-006') && !selectedStates.includes('ST-002') && selectedStates.includes('ST-005') && (
                  <div style={{ margin: '1.25rem 0', padding: '1rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '0.75rem', fontSize: '0.88rem', color: 'var(--neon-gold)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    📢 <strong>[소화계 연동 안내]</strong> 소화기 기운 보호를 위해 비위 기능을 관장하는 <strong>비 (脾)</strong> 장부 보정을 추천합니다.
                  </div>
                )}
                {!selectedStates.includes('ST-006') && !selectedStates.includes('ST-002') && !selectedStates.includes('ST-005') && selectedStates.includes('ST-007') && (
                  <div style={{ margin: '1.25rem 0', padding: '1rem', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '0.75rem', fontSize: '0.88rem', color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    📢 <strong>[정서계 연동 안내]</strong> 스트레스 및 자율신경 조절을 위해 <strong>간 (肝)</strong> 장부 보정을 추천합니다.
                  </div>
                )}
                
                {/* 3단계 장부 선택 생략(무선택)을 위한 친절한 설명 팁 추가 */}
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem', lineHeight: '1.5' }}>
                  💡 <strong>선택 가이드</strong>: 상단에 안내된 <strong>[추천]</strong> 장부를 선택하시거나, 본인의 약한 장부를 자유롭게 고르시면 됩니다. 특별히 약한 장부가 없거나 선택을 원치 않으시면, 아무것도 클릭하지 않은 상태로 바로 우측 하단의 <strong>'다음 단계 →'</strong>를 눌러 건너뛰실 수 있습니다.
                </div>
              </div>

              <div className="organs-row">
                {ORGANS.map(o => {
                  // 동적 추천 조건
                  let isRecommended = false;
                  if (o.id === '폐' && selectedStates.includes('ST-006')) isRecommended = true;
                  if (o.id === '비' && selectedStates.includes('ST-005')) isRecommended = true;
                  if (o.id === '간' && selectedStates.includes('ST-007')) isRecommended = true;
                  if (o.id === '신' && selectedStates.includes('ST-001')) isRecommended = true;
                  if (o.id === '심' && selectedStates.includes('ST-003')) isRecommended = true;

                  return (
                    <div
                      key={o.id}
                      className={`organ-btn ${selectedOrgan === o.id ? 'selected' : ''}`}
                      style={{ 
                        position: 'relative',
                        border: isRecommended && selectedOrgan !== o.id ? '1.5px dashed var(--neon-gold)' : undefined,
                        boxShadow: isRecommended && selectedOrgan !== o.id ? '0 0 12px rgba(201,168,76,0.15)' : undefined
                      }}
                      onClick={() => setSelectedOrgan(selectedOrgan === o.id ? null : o.id)}
                    >
                      {isRecommended && (
                        <span style={{ 
                          position: 'absolute', 
                          top: '-8px', 
                          left: '50%', 
                          transform: 'translateX(-50%)', 
                          background: 'var(--neon-gold)', 
                          color: '#000', 
                          fontSize: '0.58rem', 
                          fontWeight: 800, 
                          padding: '1px 5px', 
                          borderRadius: '4px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          whiteSpace: 'nowrap'
                        }}>
                          추천
                        </span>
                      )}
                      <span className="organ-icon">{o.icon}</span>
                      <div className="organ-name">{o.name}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{o.en}</div>
                    </div>
                  );
                })}
              </div>

              <div className="step-nav">
                <button className="btn btn-outline" onClick={() => setStep(2)}>← 이전 단계</button>
                <button className="btn btn-primary" onClick={() => setStep(4)}>
                  다음 단계 →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SOLAR TERMS */}
          {step === 4 && (
            <div>
              <div className="step-header">
                <h2>현재의 절기 및 계절성 공명 연동</h2>
                <p>자연의 기운과 동화되는 계절 공명 보정(β = 0.3)을 위해 날짜를 확인하세요.</p>
                
                {/* 4단계 AI 도우미 말풍선 추가 */}
                <div style={{ margin: '1rem 0', padding: '1.1rem', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '0.75rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', lineHeight: '1.6' }}>
                  💡 <strong>AI 절기 안내</strong>: 계절 절기 분석은 몸이 자연의 기후 변화에 동화될 수 있도록 그 절기에 필요한 영양군을 보충해 줍니다. 오늘 날짜를 기준으로 절기가 이미 계산되어 대기 중이므로, 날짜 수정이 특별히 필요 없다면 바로 하단의 <strong>'AI 맞춤 약선 처방 실행'</strong> 버튼을 클릭하시면 됩니다.
                </div>
              </div>

              <div className="solar-card">
                <div className="solar-name">🌿 절기: {solarTerm}</div>
                <div className="solar-meta">24절기 기준 식재료 및 기능 공명 매칭 활성화</div>
                <div className="solar-desc">
                  현재 절기는 한열(寒熱) 조습(燥濕)이 전이되는 시기입니다. 이 절기에 몸의 해독과 면역 장벽을 지키기 위한 계절 최적화 약선 원료 가점이 추가 적용됩니다.
                </div>
              </div>

              <div className="date-picker-wrap">
                <label>진단 날짜 선택</label>
                <input type="date" value={dateStr} onChange={e => setDateStr(e.target.value)} />
              </div>

              <div className="step-nav">
                <button className="btn btn-outline" onClick={() => setStep(3)}>← 이전 단계</button>
                <button className="btn btn-primary" onClick={handleFinish}>
                  AI 맞춤 약선 처방 실행
                </button>
              </div>
            </div>
          )}

          {/* RESULT STAGE (STEP 5) */}
          {step === 5 && inferenceResult && (
            <div>
              {/* Language Switcher */}
              <div className="lang-bar">
                {Object.entries(LANG_LABELS).map(([code, label]) => (
                  <button
                    key={code}
                    className={`lang-pill ${lang === code ? 'active' : ''}`}
                    onClick={() => setLang(code)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="step-header">
                <div className="section-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={12} fill="currentColor" /> R&D AI 처방 완료
                </div>
                <h2>당신을 위한 약선 다이닝 포트폴리오</h2>
                <p>
                  증상({selectedStates.length}종), 체질({constitution}), 장부({selectedOrgan || '없음'}), 절기({solarTerm})를 종합하여 산출된 1,000종 레시피 연동 최적 식사 세트입니다.
                </p>
              </div>

              {/* Advanced View & Bansang Level Select Controls */}
              <div className="view-controls">
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--neon-gold)' }}>반상 차림첩 선택:</span>
                  <div className="control-group">
                    {[
                      { key: 3, label: '3첩(실속)' },
                      { key: 5, label: '5첩(보통)' },
                      { key: 7, label: '7첩(보양)' },
                      { key: 9, label: '9첩(귀빈)' },
                      { key: 12, label: '12첩(수라)' }
                    ].map(opt => (
                      <button
                        key={opt.key}
                        className={`control-btn ${chupCount === opt.key ? 'active' : ''}`}
                        onClick={() => setChupCount(opt.key)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="control-group">
                  <button className={`control-btn ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}>
                    전통 한 상 차림 (소반)
                  </button>
                  <button className={`control-btn ${viewMode === 'course' ? 'active' : ''}`} onClick={() => setViewMode('course')}>
                    4단계 서빙 코스
                  </button>
                </div>
              </div>

              {/* Dynamic Nutrition Dashboard with Warnings */}
              <div className="nutrition-dashboard">
                <div className="nutrition-grid">
                  <div className="nut-stat">
                    <h5>총 칼로리</h5>
                    <p style={{ color: 'var(--neon-gold)' }}>{Math.round(inferenceResult.totalNutrients.kcal)} kcal</p>
                  </div>
                  <div className="nut-stat">
                    <h5>탄수화물</h5>
                    <p>{Math.round(inferenceResult.totalNutrients.carbo)} g</p>
                  </div>
                  <div className="nut-stat">
                    <h5>단백질</h5>
                    <p style={{ color: 'var(--neon-green)' }}>{Math.round(inferenceResult.totalNutrients.protein)} g</p>
                  </div>
                  <div className="nut-stat">
                    <h5>지방</h5>
                    <p>{Math.round(inferenceResult.totalNutrients.fat)} g</p>
                  </div>
                  <div className="nut-stat">
                    <h5>나트륨 누적</h5>
                    <p style={{ color: '#f43f5e' }}>{Math.round(inferenceResult.totalNutrients.sodium)} mg</p>
                  </div>
                </div>

                <div className="nutrition-limits-monitor">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <span>일일 권장 나트륨 상한 대비 비율</span>
                    <span style={{ color: inferenceResult.totalNutrients.sodium > 1200 ? '#f43f5e' : 'var(--neon-green)', fontWeight: 700 }}>
                      {inferenceResult.totalNutrients.sodium > 1200 ? '⚠️ 나트륨 상한 초과! 7첩 이하 반상 또는 저나트륨 메뉴 구성을 권장합니다.' : '🟢 안전한 수준의 나트륨 섭취 범위'}
                    </span>
                  </div>
                  <div className="limit-bar">
                    <div 
                      className="limit-fill" 
                      style={{ 
                        width: `${Math.min((inferenceResult.totalNutrients.sodium / 2000) * 100, 100)}%`, 
                        background: inferenceResult.totalNutrients.sodium > 1200 ? '#f43f5e' : 'var(--neon-green)' 
                      }} 
                    />
                  </div>
                </div>
              </div>

              <div className="result-layout">
                {/* Visualizer Panel (Soban Table / Course) */}
                <div className="card" style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 480 }}>
                  {viewMode === 'table' ? (
                    <div>
                      {renderSobanDishes()}
                      
                      {/* Teas flankers */}
                      <div className="soban-teas-panel">
                        {inferenceResult.mealSet.appetizer && (
                          <div className={`tea-flanker ${selectedBowl?.id === inferenceResult.mealSet.appetizer.id ? 'active' : ''}`} onClick={() => setSelectedBowl(inferenceResult.mealSet.appetizer)}>
                            <span className="tea-icon">{inferenceResult.mealSet.appetizer.icon}</span>
                            <div className="tea-meta">
                              <h6>식전 개위차 (식욕/소화 자극)</h6>
                              <p>{inferenceResult.mealSet.appetizer.name}</p>
                            </div>
                          </div>
                        )}
                        {inferenceResult.mealSet.dessert && (
                          <div className={`tea-flanker ${selectedBowl?.id === inferenceResult.mealSet.dessert.id ? 'active' : ''}`} onClick={() => setSelectedBowl(inferenceResult.mealSet.dessert)}>
                            <span className="tea-icon">{inferenceResult.mealSet.dessert.icon}</span>
                            <div className="tea-meta">
                              <h6>식후 수렴차 (안정/이완)</h6>
                              <p>{inferenceResult.mealSet.dessert.name}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="timeline-view" style={{ width: '100%' }}>
                      {/* Step 1 Appetizer */}
                      {inferenceResult.mealSet.appetizer && (
                        <div className="timeline-node">
                          <div className="node-bullet">🍷</div>
                          <div className="node-body">
                            <div className="node-step-title">{COURSE_STORYTELLING.appetizer.title}</div>
                            <div className="node-step-desc">{COURSE_STORYTELLING.appetizer.desc}</div>
                            <div className="node-dish" onClick={() => setSelectedBowl(inferenceResult.mealSet.appetizer)}>
                              <span className="node-dish-icon">{inferenceResult.mealSet.appetizer.icon}</span>
                              <div>
                                <div className="node-dish-name">{inferenceResult.mealSet.appetizer.name}</div>
                                <div className="node-dish-meta">나트륨 {inferenceResult.mealSet.appetizer.nutrition?.sodium}mg | {inferenceResult.mealSet.appetizer.nutrition?.kcal} kcal</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 2 Entree */}
                      {inferenceResult.mealSet.sides.length > 0 && (
                        <div className="timeline-node">
                          <div className="node-bullet">🥗</div>
                          <div className="node-body">
                            <div className="node-step-title">{COURSE_STORYTELLING.entree.title}</div>
                            <div className="node-step-desc">{COURSE_STORYTELLING.entree.desc}</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {inferenceResult.mealSet.sides.slice(0, Math.ceil(chupCount / 2)).map(s => (
                                <div className="node-dish" key={s.id} onClick={() => setSelectedBowl(s)}>
                                  <span className="node-dish-icon">{s.icon}</span>
                                  <div>
                                    <div className="node-dish-name">{s.name}</div>
                                    <div className="node-dish-meta">{s.nutrition?.kcal} kcal | 나트륨 {s.nutrition?.sodium}mg</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 3 Main */}
                      <div className="timeline-node">
                        <div className="node-bullet">🍲</div>
                        <div className="node-body">
                          <div className="node-step-title">{COURSE_STORYTELLING.main.title}</div>
                          <div className="node-step-desc">{COURSE_STORYTELLING.main.desc}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {inferenceResult.mealSet.staple && (
                              <div className="node-dish" onClick={() => setSelectedBowl(inferenceResult.mealSet.staple)}>
                                <span className="node-dish-icon">{inferenceResult.mealSet.staple.icon}</span>
                                <div>
                                  <div className="node-dish-name">{inferenceResult.mealSet.staple.name}</div>
                                  <div className="node-dish-meta">주식 | {inferenceResult.mealSet.staple.nutrition?.kcal} kcal</div>
                                </div>
                              </div>
                            )}
                            {inferenceResult.mealSet.soup && (
                              <div className="node-dish" onClick={() => setSelectedBowl(inferenceResult.mealSet.soup)}>
                                <span className="node-dish-icon">{inferenceResult.mealSet.soup.icon}</span>
                                <div>
                                  <div className="node-dish-name">{inferenceResult.mealSet.soup.name}</div>
                                  <div className="node-dish-meta">보양탕 | 나트륨 {inferenceResult.mealSet.soup.nutrition?.sodium}mg</div>
                                </div>
                              </div>
                            )}
                            {inferenceResult.mealSet.stew && (
                              <div className="node-dish" onClick={() => setSelectedBowl(inferenceResult.mealSet.stew)}>
                                <span className="node-dish-icon">{inferenceResult.mealSet.stew.icon}</span>
                                <div>
                                  <div className="node-dish-name">{inferenceResult.mealSet.stew.name}</div>
                                  <div className="node-dish-meta">찌개/조치 | 나트륨 {inferenceResult.mealSet.stew.nutrition?.sodium}mg</div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Step 4 Dessert */}
                      {inferenceResult.mealSet.dessert && (
                        <div className="timeline-node">
                          <div className="node-bullet">🍵</div>
                          <div className="node-body">
                            <div className="node-step-title">{COURSE_STORYTELLING.dessert.title}</div>
                            <div className="node-step-desc">{COURSE_STORYTELLING.dessert.desc}</div>
                            <div className="node-dish" onClick={() => setSelectedBowl(inferenceResult.mealSet.dessert)}>
                              <span className="node-dish-icon">{inferenceResult.mealSet.dessert.icon}</span>
                              <div>
                                <div className="node-dish-name">{inferenceResult.mealSet.dessert.name}</div>
                                <div className="node-dish-meta">디저트차 | {inferenceResult.mealSet.dessert.nutrition?.kcal} kcal</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Interactive Drawer (Dishes details) */}
                <div className="detail-drawer">
                  {selectedBowl ? (
                    <div>
                      <div className="detail-header">
                        <span className="detail-icon">{selectedBowl.icon}</span>
                        <div className="detail-title">
                          <h4>{selectedBowl.name}</h4>
                          <p>{selectedBowl.id ? '식단 구성 요리' : '반상 기본찬'}</p>
                        </div>
                      </div>
                      
                      <div style={{ marginTop: 12 }}>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>주요 구성 재료</div>
                        <p style={{ fontSize: '0.82rem', marginTop: 4, color: '#fff' }}>
                          {Array.isArray(selectedBowl.ingredients) 
                            ? selectedBowl.ingredients.join(', ') 
                            : typeof selectedBowl.ingredients === 'string'
                              ? selectedBowl.ingredients
                              : selectedBowl.base_ingredients || '전통 발효 원재료'}
                        </p>
                      </div>

                      {selectedBowl.cooking_method && (
                        <div style={{ marginTop: 14 }}>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>약선 조리 지침 및 권장법</div>
                          <p style={{ fontSize: '0.8rem', marginTop: 4, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {selectedBowl.cooking_method}
                          </p>
                        </div>
                      )}

                      <div className="detail-nut-grid">
                        <div className="detail-nut">
                          <h6>칼로리</h6>
                          <p>{selectedBowl.nutrition?.kcal || 0} kcal</p>
                        </div>
                        <div className="detail-nut">
                          <h6>단백질</h6>
                          <p>{selectedBowl.nutrition?.protein || 0} g</p>
                        </div>
                        <div className="detail-nut">
                          <h6>나트륨</h6>
                          <p style={{ color: '#f43f5e' }}>{selectedBowl.nutrition?.sodium || 0} mg</p>
                        </div>
                      </div>

                      {/* Display Efficacy/Synergy comments */}
                      <div style={{ marginTop: 16, background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.2)', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--neon-gold)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Heart size={12} fill="currentColor" /> 한의학적 기미 배합 평정
                        </div>
                        <p style={{ fontSize: '0.78rem', marginTop: 4, color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                          {selectedBowl.sensory?.temperature === '온(Warm)' 
                            ? '🔥 온열 성질의 식재료가 기혈 순환을 도우며 몸의 냉기를 몰아냅니다.'
                            : selectedBowl.sensory?.temperature === '량(Cool)'
                              ? '❄️ 맑고 시원한 기운의 식재료가 신체의 과잉된 열감을 해독하고 대사를 촉진합니다.'
                              : '🌱 평이한 성질의 식재료로 장기에 부담을 주지 않고 기력을 충실하게 축적해 줍니다.'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-muted)', textAlign: 'center', paddingTop: 60 }}>
                       bowls/dishes를 클릭하면 상세 의학적 조리 가이드와 영양 팩트가 노출됩니다.
                    </div>
                  )}
                </div>
              </div>

              {/* 피부계 증상 선택 시 외용처방 섹션 렌더링 */}
              {selectedStates.includes('ST-006') && (
                <div className="card" style={{ marginTop: '2rem', padding: '2rem', border: '1px solid rgba(6, 182, 212, 0.25)', background: 'radial-gradient(ellipse at top right, rgba(6, 182, 212, 0.08) 0%, rgba(0, 0, 0, 0) 70%)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '2rem' }}>🧴</span>
                    <div>
                      <span className="section-tag" style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', borderColor: 'rgba(6, 182, 212, 0.25)', marginBottom: '0.15rem', display: 'inline-block' }}>
                        Bio-Topical Prescription
                      </span>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#fff', margin: 0 }}>
                        동방의학 바이오 외용처방 가이드
                      </h3>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    한의학의 <strong>폐주피모(肺主皮毛)</strong> 원리에 따라, 섭취하는 약선 요리(톳국, 굴죽 등)로 체내 대사 해독을 유도함과 동시에, 외부 피부 장벽에 직접 작용하여 염증과 가려움을 다스리는 <strong>외용고(처방제)</strong>의 병용을 권장합니다.
                  </p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <h4 style={{ fontSize: '0.95rem', color: 'var(--neon-gold)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        🌿 외용제 원료 비율 (Formulation)
                      </h4>
                      <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li><strong>병풀(Centella) 생체 추출물 (40%)</strong>: 활성 마데카소사이드 성분이 콜라겐 합성과 세포막 재생을 유도.</li>
                        <li><strong>사상자(Cnidium) 미세 건조분말 (30%)</strong>: 가려움증을 유발하는 알레르기 수용체 활성을 강력 억제.</li>
                        <li><strong>황기(Astragalus) 농축액 (20%)</strong>: 진액을 고정하는 작용(고표)으로 피부 표면 수분막 형성.</li>
                        <li><strong>천연 올리브 오일 & 밀랍 베이스 (10%)</strong>: 천연 캐리어 오일로 흡수율 극대화.</li>
                      </ul>
                    </div>
                    
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <h4 style={{ fontSize: '0.95rem', color: '#06b6d4', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        ⚙️ 홈 조제 및 사용 가이드
                      </h4>
                      <ol style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <li><strong>에센스 추출</strong>: 병풀 생체 원물을 저온(60℃ 이하)에서 천천히 우려내 활성 성분의 열 파괴를 방지합니다.</li>
                        <li><strong>분말 블렌딩</strong>: 건조된 사상자를 믹서로 매우 미세하게 제분한 뒤 올리브유와 밀랍 베이스에 부드럽게 섞어 연고상으로 만듭니다.</li>
                        <li><strong>안팎 시너지 케어</strong>: 하루에 추천 약선 톳국을 1회 식사로 드시고, 아침/저녁 세안 후 건조한 트러블 피부 부위에 외용고를 얇게 도포하여 두드려 흡수시킵니다.</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {/* 수면계 증상 선택 시 아로마/슬립 외용처방 섹션 렌더링 */}
              {selectedStates.includes('ST-002') && (
                <div className="card" style={{ marginTop: '2rem', padding: '2rem', border: '1px solid rgba(244, 63, 94, 0.25)', background: 'radial-gradient(ellipse at top right, rgba(244, 63, 94, 0.08) 0%, rgba(0, 0, 0, 0) 70%)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '2rem' }}>🌙</span>
                    <div>
                      <span className="section-tag" style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', borderColor: 'rgba(244, 63, 94, 0.25)', marginBottom: '0.15rem', display: 'inline-block' }}>
                        Bio-Aroma Sleep Prescription
                      </span>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#fff', margin: 0 }}>
                        동방의학 아로마 수면 외용처방 가이드
                      </h3>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    한의학의 <strong>심주신명(心主神明)</strong> 이론에 근거하여, 복용하는 약선 음식을 통해 심신을 자양함과 동시에, 후각 수용체와 피부 혈자리 자극을 통해 자율신경계(HRV)의 과도한 흥분을 가라앉히고 부교감 신경을 활성화하는 <strong>아로마/슬립 외용 오일 밤</strong> 병용을 권장합니다.
                  </p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <h4 style={{ fontSize: '0.95rem', color: 'var(--neon-gold)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        🌿 슬립 오일 원료 비율 (Sleep Balm Formulation)
                      </h4>
                      <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li><strong>산조인(Ziziphi Semen) 오일 (40%)</strong>: GABA 수용체 활성을 자극하여 수면 깊이를 늘림.</li>
                        <li><strong>용안육 & 원지 추출 정유 (30%)</strong>: 불면으로 인한 건망증 및 불안, 뇌파(Alpha wave) 활성 증진.</li>
                        <li><strong>대추 에센셜 아로마 오일 (20%)</strong>: 특유의 온화하고 단 향이 긴장된 심박수를 안정시킴.</li>
                        <li><strong>천연 시어버터 & 코코넛 캐리어 베이스 (10%)</strong>: 피부 도포용 에몰리언트 기제.</li>
                      </ul>
                    </div>
                    
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <h4 style={{ fontSize: '0.95rem', color: '#f43f5e', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        ⚙️ 자조 처방 및 수면 도포법
                      </h4>
                      <ol style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <li><strong>홈 조제법</strong>: 산조인을 살짝 볶아 천연 시어버터 베이스와 함께 저온 혼합한 뒤 용안육/대추 아로마 오일을 첨가하여 고형 밤(Balm) 형태로 굳힙니다.</li>
                        <li><strong>수면 유도 혈자리 도포</strong>: 취침 30분 전, 관자놀이(태양혈) 및 귀 뒤쪽 아래의 <strong>안면혈(安眠穴)</strong> 부위에 손가락으로 부드럽게 둥글리며 도포합니다.</li>
                        <li><strong>식단 시너지</strong>: 저녁 식사로 처방된 연자육죽이나 안심안정 차를 드신 후 본 슬립 아로마를 활용하여 안팎의 심신 릴랙스를 이끌어 냅니다.</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Buttons */}
              <div className="step-nav" style={{ marginTop: '3rem' }}>
                <button className="btn btn-outline" onClick={reset}>
                  다시 진단하기
                </button>
                <a href="/shop" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <ShoppingCart size={15} /> 추천 약선 키트 주문
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
