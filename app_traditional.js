// Mila Wellness Traditional Fermented Foods (Wiki/Accordion)

// 카테고리 태그 설정 및 필터링
function setTraditionalCategory(category, element) {
  window.currentTraditionalCategory = category;
  
  // 버튼 active 토글
  document.querySelectorAll('.btn-filter-tag').forEach(btn => {
    btn.classList.remove('active');
  });
  
  if (element) {
    element.classList.add('active');
  }
  
  renderTraditionalList();
}

// 텍스트 필터 검색
function filterTraditionalList() {
  renderTraditionalList();
}

function renderTraditionalList() {
  const container = document.getElementById('traditional-list-container');
  const searchInput = document.getElementById('traditional-search-input');
  const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';
  
  if (!container) return;
  container.innerHTML = '';
  
  if (!window.traditionalDb || window.traditionalDb.length === 0) {
    container.innerHTML = `<div style="color:var(--text-muted); text-align:center; padding:30px; font-size:0.88rem;">${getTranslation('데이터베이스 로딩 실패 또는 자료가 없습니다.', currentLanguage)}</div>`;
    return;
  }
  
  const filtered = window.traditionalDb.filter(item => {
    const matchesCategory = window.currentTraditionalCategory === '전체' || item.category === window.currentTraditionalCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchVal) || 
                          (item.english_name && item.english_name.toLowerCase().includes(searchVal)) || 
                          item.description.toLowerCase().includes(searchVal);
    return matchesCategory && matchesSearch;
  });
  
  if (filtered.length === 0) {
    container.innerHTML = `<div style="color:var(--text-muted); text-align:center; padding:30px; font-size:0.88rem;">${getTranslation('검색 및 필터 조건에 부합하는 자료가 없습니다.', currentLanguage)}</div>`;
    return;
  }
  
  filtered.forEach(item => {
    const card = document.createElement('div');
    const isExpanded = window.selectedTraditionalItem && window.selectedTraditionalItem.id === item.id;
    card.className = `traditional-accordion-card ${isExpanded ? 'active' : ''}`;
    card.id = `trad-card-${item.id}`;
    
    // 조리 단계 HTML 빌드
    let stepsHtml = '';
    if (item.steps && item.steps.length > 0) {
      item.steps.forEach((step, idx) => {
        stepsHtml += `
          <div style="display:flex; gap:12px; align-items:flex-start; font-size:0.82rem; color:var(--text-secondary); line-height:1.5; margin-bottom:8px;">
            <span style="background:var(--primary); color:#fff; font-weight:700; width:18px; height:18px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:0.7rem;">${idx + 1}</span>
            <span>${translateTerm(step, currentLanguage)}</span>
          </div>
        `;
      });
    } else {
      stepsHtml = `<div style="color:var(--text-muted); font-size:0.8rem;">${getTranslation('상세 조리 단계 정보가 없는 발효 원물입니다.', currentLanguage)}</div>`;
    }
    
    // 탭별 콘텐츠 영역 정의
    const rdaTabStyle = window.currentTraditionalDetailTab === 'rda' ? 'display:block;' : 'display:none;';
    const milaTabStyle = window.currentTraditionalDetailTab === 'mila' ? 'display:block;' : 'display:none;';
    
    const rdaBtnClass = window.currentTraditionalDetailTab === 'rda' ? 'active' : '';
    const milaBtnClass = window.currentTraditionalDetailTab === 'mila' ? 'active' : '';

    card.innerHTML = `
      <!-- Accordion Header -->
      <div class="traditional-accordion-header" onclick="toggleTraditionalAccordion('${item.id}', event)">
        <div class="traditional-accordion-header-content">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
            <span class="badge" style="font-size:0.68rem; background:rgba(255,255,255,0.06); color:var(--text-muted); padding:2px 6px; border-radius:4px;">${getTranslation(item.category, currentLanguage)}</span>
            <span style="font-size:0.75rem; color:var(--text-muted); font-family:monospace;">${item.english_name || ''}</span>
          </div>
          <strong style="font-size:1.05rem; color:#fff; display:block; margin-bottom:4px;">${translateTerm(item.name, currentLanguage)}</strong>
          <p class="traditional-collapsed-desc">${translateTerm(item.description, currentLanguage)}</p>
        </div>
        <i class="fa-solid fa-chevron-down arrow-icon"></i>
      </div>
      
      <!-- Accordion Body (Slide-Down Details) -->
      <div class="traditional-accordion-body">
        <div class="traditional-accordion-content-inner">
          <p style="color: var(--text-secondary); font-size: 0.85rem; margin: 0; line-height: 1.6;">${translateTerm(item.description, currentLanguage)}</p>
          
          <!-- Inner Tab Switcher -->
          <div style="display: flex; background: rgba(0,0,0,0.25); border-radius: 8px; padding: 3px; border: 1px solid rgba(255,255,255,0.05); align-self: flex-start;">
            <button class="btn-sub-tab ${rdaBtnClass}" onclick="switchTraditionalInnerTab('${item.id}', 'rda', event)">${getTranslation('RDA 국가표준 레시피', currentLanguage)}</button>
            <button class="btn-sub-tab ${milaBtnClass}" onclick="switchTraditionalInnerTab('${item.id}', 'mila', event)">${getTranslation('Mila 웰빙 융합 분석', currentLanguage)}</button>
          </div>
          
          <!-- Tab 1: RDA Content -->
          <div id="inner-tab-rda-${item.id}" style="${rdaTabStyle}">
            <div style="margin-bottom: 16px; background: rgba(0,0,0,0.15); padding: 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.03);">
              <h4 style="margin: 0 0 8px; color: var(--primary); font-size: 0.82rem;"><i class="fa-solid fa-basket-shopping"></i> ${getTranslation('재료 및 배합 분량 (RDA 규격)', currentLanguage)}</h4>
              <p style="margin: 0; font-size: 0.8rem; color: #fff; line-height:1.5;">${translateTerm(item.ingredients, currentLanguage) || getTranslation('조절 및 발효 환경 정보 참고', currentLanguage)}</p>
            </div>
            <div>
              <h4 style="margin: 0 0 10px; color: var(--primary); font-size: 0.82rem;"><i class="fa-solid fa-fire-burner"></i> ${getTranslation('전통 조리 및 제조 시퀀스', currentLanguage)}</h4>
              <div style="display: flex; flex-direction: column; gap: 4px;">
                ${stepsHtml}
              </div>
            </div>
          </div>
          
          <!-- Tab 2: Mila Content -->
          <div id="inner-tab-mila-${item.id}" style="${milaTabStyle}">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 16px;">
              <div style="background: rgba(16, 185, 129, 0.04); border: 1px solid rgba(16, 185, 129, 0.15); border-radius: 10px; padding: 12px 15px;">
                <h4 style="margin: 0 0 6px; color: var(--primary); font-size: 0.8rem; display: flex; align-items: center; gap: 6px;"><i class="fa-solid fa-yin-yang"></i> ${getTranslation('사상 체질 연계 적합성', currentLanguage)}</h4>
                <strong style="font-size: 0.9rem; color: #fff; display: block; margin-bottom: 4px;">${translateTerm(item.sasang_relation, currentLanguage) || getTranslation('모든 체질 조화 가능 (평성)', currentLanguage)}</strong>
                <p style="margin: 0; font-size: 0.76rem; color: var(--text-secondary); line-height: 1.4;">${translateTerm(item.wellness_tip, currentLanguage) || getTranslation('체질 밸런스를 돕는 추천 조치입니다.', currentLanguage)}</p>
              </div>
              
              <div style="background: rgba(59, 130, 246, 0.04); border: 1px solid rgba(59, 130, 246, 0.15); border-radius: 10px; padding: 12px 15px;">
                <h4 style="margin: 0 0 6px; color: var(--accent); font-size: 0.8rem; display: flex; align-items: center; gap: 6px;"><i class="fa-solid fa-shield-halved"></i> ${getTranslation('장내 생리 활성 & 바이오 시너지', currentLanguage)}</h4>
                <p style="margin: 0; font-size: 0.76rem; color: var(--text-secondary); line-height: 1.4;">${translateTerm(item.bio_synergy, currentLanguage) || getTranslation('생리활성 및 미생물 대사 기능이 활발하게 작용합니다.', currentLanguage)}</p>
              </div>
            </div>
            
            <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); border-radius: 8px; padding: 12px; font-size: 0.76rem; color: var(--text-muted); line-height: 1.4;">
              <i class="fa-solid fa-circle-info" style="color:var(--primary); margin-right:4px;"></i> ${getTranslation('본 한방 약성 및 미생물 매핑 정보는 Nuri Lab Matrix Engine의 약리 분석 표준 가이드라인에 기초합니다.', currentLanguage)}
            </div>
          </div>
          
        </div>
      </div>
    `;
    
    container.appendChild(card);
  });
}

function toggleTraditionalAccordion(id, event) {
  // 이벤트 버블링 방지
  if (event) event.stopPropagation();

  const targetCard = document.getElementById(`trad-card-${id}`);
  if (!targetCard) return;

  const isActive = targetCard.classList.contains('active');

  // 모든 카드를 일단 닫음 (클래식 아코디언 동작)
  document.querySelectorAll('.traditional-accordion-card').forEach(card => {
    card.classList.remove('active');
  });

  if (!isActive) {
    targetCard.classList.add('active');
    // 선택된 전역 아이템 갱신
    window.selectedTraditionalItem = window.traditionalDb.find(i => i.id === id);
    
    // 펼쳐지는 카드의 내부 서브 탭을 현재 글로벌 상태와 즉시 동기화
    const tab = window.currentTraditionalDetailTab || 'rda';
    const rdaContent = document.getElementById(`inner-tab-rda-${id}`);
    const milaContent = document.getElementById(`inner-tab-mila-${id}`);
    if (rdaContent && milaContent) {
      if (tab === 'rda') {
        rdaContent.style.display = 'block';
        milaContent.style.display = 'none';
      } else {
        rdaContent.style.display = 'none';
        milaContent.style.display = 'block';
      }
    }
    
    // 버튼 스타일 동기화
    const buttons = document.querySelectorAll(`#trad-card-${id} .btn-sub-tab`);
    buttons.forEach(btn => {
      if (btn.getAttribute('onclick').includes(tab)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  } else {
    window.selectedTraditionalItem = null;
  }
}

// 아코디언 내부 서브 탭 전환
function switchTraditionalInnerTab(id, tab, event) {
  if (event) event.stopPropagation(); // 카드 닫히지 않게 차단
  
  window.currentTraditionalDetailTab = tab;
  
  const rdaContent = document.getElementById(`inner-tab-rda-${id}`);
  const milaContent = document.getElementById(`inner-tab-mila-${id}`);
  
  if (!rdaContent || !milaContent) return;
  
  // 렌더 탭 상태만 강제 동적 교체하고 버튼 토글을 즉각 반영
  if (tab === 'rda') {
    rdaContent.style.display = 'block';
    milaContent.style.display = 'none';
  } else {
    rdaContent.style.display = 'none';
    milaContent.style.display = 'block';
  }
  
  // 버튼들 스타일을 수동 갱신 (전체 리스트 다시 렌더링하면 스크롤이나 포커스가 튈 수 있으므로)
  const buttons = document.querySelectorAll(`#trad-card-${id} .btn-sub-tab`);
  buttons.forEach(btn => {
    if (btn.getAttribute('onclick').includes(tab)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// 더미 펑션 (기존 아티팩트 레거시 대응용)
function renderTraditionalOverview() {}

// Bind traditional functions to window object
window.setTraditionalCategory = setTraditionalCategory;
window.filterTraditionalList = filterTraditionalList;
window.renderTraditionalList = renderTraditionalList;
window.toggleTraditionalAccordion = toggleTraditionalAccordion;
window.switchTraditionalInnerTab = switchTraditionalInnerTab;
window.renderTraditionalOverview = renderTraditionalOverview;