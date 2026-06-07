// Nuri Laboratory & Mila Portal Application Controller Logic
let engine = null;
let masterDb = [];
let standardFunctions = [];
let normalizationDict = [];
let exceptionDict = [];

// New Downloaded Library Datasets
let recipesDb = [];
let holidaysDb = [];
let seasonalDb = [];
let diseasesDb = [];
let currentWikiCategory = "ALL";

// Subscribers and CRM states
let subscribersDb = [];
let pendingSubscriber = null;

// Pagination and Filtering State
let filteredMasterDb = [];
let browserPage = 1;
const browserPageSize = 20;

// Current Active Axis & Step
let activeAxis = '정화';
let activeFlowStep = 1;
let activeDiseaseIndex = null;

// Persona State (gateway, recipe, workspace)
let currentPersona = 'gateway';
let lastInferenceResult = null;

// ─── 7축 보정 및 역해결용 정규화 헬퍼 함수 ─────────────────────────
function getResolved7Axis(stdFunc, originalAxis) {
  if (originalAxis && originalAxis.trim() !== "") {
    return originalAxis.trim();
  }
  if (!stdFunc) return "보호";

  const f = stdFunc.trim();

  // 1. 표준기능목록 캐시에서 우선 매치 검사
  const matched = standardFunctions.find(item => item.표준기능 === f);
  if (matched && matched["7축"]) {
    return matched["7축"];
  }

  // 2. 키워드 기반 매핑
  if (f.includes('해독') || f.includes('항산화') || f.includes('염증') || f.includes('살충') || f.includes('기생충') || f.includes('구충') || f.includes('정화')) return '정화';
  if (f.includes('혈류') || f.includes('순환') || f.includes('통락') || f.includes('지혈') || f.includes('출혈') || f.includes('맥')) return '순환';
  if (f.includes('회복') || f.includes('보충') || f.includes('생기') || f.includes('재생') || f.includes('조직')) return '회복';
  if (f.includes('면역') || f.includes('보호') || f.includes('위장') || f.includes('간보호') || f.includes('신장보호') || f.includes('시각보호') || f.includes('명목') || f.includes('눈')) return '보호';
  if (f.includes('안정') || f.includes('진정') || f.includes('신경') || f.includes('수면')) return '안정';
  if (f.includes('소화') || f.includes('흡수') || f.includes('건비') || f.includes('비위')) return '흡수';
  if (f.includes('통증') || f.includes('완화') || f.includes('지통') || f.includes('경련') || f.includes('진해') || f.includes('기침') || f.includes('해열') || f.includes('진통') || f.includes('부종')) return '완화';

  // 3. 커스텀 단어 가드
  if (f.includes('가래제거') || f.includes('거담')) return '정화';
  if (f.includes('비뇨배출') || f.includes('이뇨')) return '정화';
  if (f.includes('설사완화') || f.includes('배변촉진') || f.includes('장관')) return '정화';
  if (f.includes('유산방지') || f.includes('안태')) return '보호';
  if (f.includes('감염관리')) return '보호';
  if (f.includes('근골강화')) return '회복';

  return "보호";
}

// 일반 사용자용 어려운 생리/기전 한글 번역 사전
const translationMap = {
  "bone metabolism support": "뼈 건강 강화 및 골다공증 예방 도움",
  "osteoblast activation": "뼈 생성 세포 재생 활성화",
  "neuroinflammation modulation": "신경 통증 완화 및 염증 억제",
  "cox-2 inhibition": "소염 작용 및 열성 통증 완화",
  "hepatoprotective": "간 세포 보호 및 해독 촉진",
  "ros reduction": "몸속 독소 배출 및 항산화 효과",
  "gaba modulation": "뇌 신경 안정 및 불안 스트레스 완화",
  "neural stabilization": "신경 안정 및 숙면 지원",
  "anti-inflammatory": "항염증 및 붓기 제거",
  "antioxidant": "노화 예방 및 활력 세포 증진",
  "digestive aid": "소화 불량 해소 및 위장 보호",
  "immune system enhancement": "면역력 강화 및 병증 저항력 향상",
  "nervous system regulation": "신경계 밸런스 유지 및 조절",
  "joint protection": "관절 연골 마모 방지 및 튼튼화",
  "anti-fatigue": "피로 회복 및 전신 체력 충전",
  "근골강화": "뼈와 근육을 튼튼하게 강화",
  "신경염증조절": "신경 염증 완화 및 진통",
  "간보호": "간 건강 보호 및 피로해소",
  "수면안정": "불면 해소 및 쾌적한 숙면",
  "장건강": "위장 보호 및 배변 촉진",
  "혈류개선": "혈액 순환 원활 및 뭉친 피 거름",
  "해독/항산화": "몸속 노폐물 배출 및 노화 방지",
  "항염": "염증 가라앉히기 및 해열",
  "호흡기보호": "목 건조 완화 및 기침 억제",
  "면역회복": "기력 보충 및 전신 면역력 증진"
};

function translateTerm(term) {
  if (!term) return "-";
  if (currentPersona !== 'recipe') return term; // 전문가 모드에서는 오리지널 학술어 그대로 노출
  
  const lower = term.toLowerCase().trim();
  if (translationMap[lower]) return translationMap[lower];
  
  // 부분 매치 번역 시도
  for (const [eng, kor] of Object.entries(translationMap)) {
    if (lower.includes(eng.toLowerCase())) {
      return kor;
    }
  }
  return term;
}

document.addEventListener('DOMContentLoaded', async () => {
  console.log("Nuri Laboratory App controller initializing...");
  
  // 1. Initialize Prescribing Engine
  engine = new MatrixEngine();
  const engineLoaded = await engine.init('./data/');
  if (engineLoaded) {
    console.log("✅ AI 처방 엔진 부팅 완료 (1,793행 마스터 DB 적재)");
  } else {
    console.error("❌ AI 처방 엔진 로드 실패");
  }

  // 2. Load Datasets for UI
  await loadPortalData();

  // Initialize and check subscribers
  initSubscribers();
  const currentSub = localStorage.getItem('nuri_current_subscriber');
  if (currentSub) {
    unlockPlatformGateway();
  }

  // 3. Setup Initial UI states
  initDashboard();
  initBrowser();
  initAxisExplorer();
  initRulesTables();
  selectFlowStep(1);
  
  // 신규 대도서관 백과사전 초기화
  initRecipesWiki();
  initCultureWiki();

  // R&D 검색창 바깥 클릭 시 드롭다운 닫기
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('rnd-search-results');
    const input = document.getElementById('rnd-search-input');
    if (dropdown && input && !dropdown.contains(e.target) && e.target !== input) {
      dropdown.style.display = 'none';
    }
  });
  
  // URL 해시 감지 및 라우팅 작동
  handleUrlRouting();
  window.addEventListener('hashchange', handleUrlRouting);
});

// ─── Persona Gateway & Routing ──────────────────────────────────
function enterPlatform(persona) {
  currentPersona = persona;
  document.body.className = `persona-${persona === 'workspace' ? 'pro' : persona}`;
  
  // Show Main App Screen, Hide Gateway
  document.getElementById('gateway-screen').style.display = 'none';
  document.getElementById('main-app-screen').style.display = 'grid';
  
  // Update UI texts depending on Persona
  localizePersonaUi();

  // Redirect if currently on an expert tab in recipe mode
  const activeTab = document.querySelector('.tab-content.active');
  if (persona === 'recipe' && activeTab && activeTab.classList.contains('expert-only')) {
    switchTab('tab-dashboard');
  } else if (activeTab) {
    switchTab(activeTab.id);
  } else {
    switchTab('tab-dashboard');
  }

  // Refresh dynamic bars and wikis
  initDashboard();
  renderBrowserTable();
  initRecipesWiki();
  
  // Update URL hash
  window.location.hash = `#${persona}`;
}

function returnToGateway() {
  currentPersona = 'gateway';
  document.body.className = 'gateway-active';
  
  document.getElementById('gateway-screen').style.display = 'flex';
  document.getElementById('main-app-screen').style.display = 'none';
  
  window.location.hash = '';
}

function togglePersona() {
  if (currentPersona === 'recipe') {
    enterPlatform('workspace');
  } else if (currentPersona === 'workspace') {
    enterPlatform('recipe');
  }
}

function handleUrlRouting() {
  const hash = window.location.hash;
  const currentSub = localStorage.getItem('nuri_current_subscriber');
  
  if (hash === '#recipe' || hash === '#workspace') {
    if (!currentSub) {
      window.location.hash = '';
      returnToGateway();
      return;
    }
    
    if (hash === '#recipe') {
      enterPlatform('recipe');
    } else {
      enterPlatform('workspace');
    }
  } else {
    returnToGateway();
  }
}

// ─── Subscribers & CRM Management ──────────────────────────────────
function initSubscribers() {
  const stored = localStorage.getItem('nuri_subscribers');
  if (stored) {
    subscribersDb = JSON.parse(stored);
  } else {
    subscribersDb = [
      {
        id: "SUB-00001",
        name: "김민수",
        email: "minsu@gmail.com",
        role: "founder",
        constitution: "태음인",
        concern: "관절통",
        signupDate: "2026-06-01 10:20:00"
      },
      {
        id: "SUB-00002",
        name: "이지혜",
        email: "jihye.lee@naver.com",
        role: "researcher",
        constitution: "소음인",
        concern: "수족냉증",
        signupDate: "2026-06-02 14:15:30"
      },
      {
        id: "SUB-00003",
        name: "박지원",
        email: "jiwon_park@daum.net",
        role: "medical",
        constitution: "소양인",
        concern: "기력 보충",
        signupDate: "2026-06-03 09:05:12"
      },
      {
        id: "SUB-00004",
        name: "최윤서",
        email: "yoonseo_c@gmail.com",
        role: "general",
        constitution: "태양인",
        concern: "마른 기침",
        signupDate: "2026-06-04 17:40:00"
      },
      {
        id: "SUB-00005",
        name: "정성우",
        email: "sungwoo.j@hanmail.net",
        role: "founder",
        constitution: "태음인",
        concern: "숙취 해소",
        signupDate: "2026-06-05 11:30:45"
      },
      {
        id: "SUB-00006",
        name: "한아름",
        email: "areum_han@naver.com",
        role: "general",
        constitution: "소음인",
        concern: "소화 촉진",
        signupDate: "2026-06-06 08:12:10"
      }
    ];
    localStorage.setItem('nuri_subscribers', JSON.stringify(subscribersDb));
  }
}

function unlockPlatformGateway() {
  const lockOverlay = document.getElementById('gateway-lock-overlay');
  if (lockOverlay) {
    lockOverlay.style.display = 'none';
  }
  
  const optionsContainer = document.getElementById('gateway-options-container');
  if (optionsContainer) {
    optionsContainer.style.filter = 'none';
    optionsContainer.style.pointerEvents = 'auto';
    optionsContainer.style.opacity = '1';
  }

  // 기존 구독자가 재방문 시: 웰컴백 배너 표시
  const currentSub = JSON.parse(localStorage.getItem('nuri_current_subscriber') || 'null');
  if (currentSub) {
    const subFormHeader = document.getElementById('gateway-subscription-section');
    if (subFormHeader) {
      subFormHeader.innerHTML = `
        <div style="text-align:center; padding:30px 24px;">
          <div style="margin-bottom:16px; display:flex; justify-content:center;"><img src="logo.png" alt="Logo" style="width:60px; height:60px; object-fit:contain; border-radius:15px; filter:drop-shadow(0 0 10px var(--primary-glow));"></div>
          <div class="event-pill" style="margin: 0 auto 16px;"><i class="fa-solid fa-circle-check"></i> 구독 회원 인증 완료</div>
          <h2 style="font-family:'Outfit',sans-serif; font-size:1.35rem; color:#fff; font-weight:700; margin:0 0 8px;">
            ${currentSub.name} 님, 환영합니다!
          </h2>
          <p style="font-size:0.85rem; color:var(--text-muted); margin:0 0 6px;">${currentSub.id} · ${currentSub.constitution}</p>
          <p style="font-size:0.82rem; color:var(--text-secondary); margin:0 0 24px; line-height:1.5;">
            Mila &amp; Nuri Lab 플랫폼의 모든 기능을 자유롭게 이용하실 수 있습니다.
          </p>
          <div style="display:flex; flex-direction:column; gap:10px;">
            <button class="btn btn-primary btn-large" style="width:100%; font-weight:700; padding:14px;" onclick="enterPlatform('recipe')">
              <i class="fa-solid fa-heart"></i> Mila 웰빙 레시피실 입장
            </button>
            <button class="btn btn-accent" style="width:100%; font-weight:700; padding:12px;" onclick="enterPlatform('workspace')">
              <i class="fa-solid fa-laptop-medical"></i> Nuri Lab R&amp;D 워크스페이스 입장
            </button>
            <button class="btn btn-outline" style="width:100%; font-size:0.8rem; padding:10px; margin-top:4px;" onclick="logoutAndReset()">
              <i class="fa-solid fa-right-from-bracket"></i> 다른 계정으로 재가입
            </button>
          </div>
        </div>`;
    }
  }
}

function handleSubscribeSubmit(event) {
  event.preventDefault();
  
  const name = document.getElementById('sub-name').value.trim();
  const email = document.getElementById('sub-email').value.trim();
  const role = document.getElementById('sub-role').value;
  const constitution = document.getElementById('sub-constitution').value;
  const concern = document.getElementById('sub-concern').value;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("올바른 이메일 주소 형식을 입력해주세요.");
    return;
  }
  
  const existingSub = subscribersDb.find(sub => sub.email.toLowerCase() === email.toLowerCase());
  if (existingSub) {
    // 이미 등록된 이메일 → 기존 계정으로 재입장 처리
    pendingSubscriber = existingSub;
    localStorage.setItem('nuri_current_subscriber', JSON.stringify(existingSub));
    unlockPlatformGateway();
    return;
  }
  
  const nextNum = subscribersDb.length + 1;
  const subId = `SUB-${String(nextNum).padStart(5, '0')}`;
  
  const now = new Date();
  const signupDate = now.getFullYear() + '-' + 
    String(now.getMonth() + 1).padStart(2, '0') + '-' + 
    String(now.getDate()).padStart(2, '0') + ' ' + 
    String(now.getHours()).padStart(2, '0') + ':' + 
    String(now.getMinutes()).padStart(2, '0') + ':' + 
    String(now.getSeconds()).padStart(2, '0');
    
  const newSub = {
    id: subId,
    name,
    email,
    role,
    constitution,
    concern,
    signupDate
  };
  
  subscribersDb.push(newSub);
  localStorage.setItem('nuri_subscribers', JSON.stringify(subscribersDb));
  
  pendingSubscriber = newSub;
  
  document.getElementById('pass-name-display').innerText = `${name} 님`;
  document.getElementById('pass-no-display').innerText = `NURI-${now.getFullYear()}-${String(nextNum).padStart(5, '0')}`;
  
  const roleLabels = {
    'general': '일반 사용자',
    'founder': '예비 창업자',
    'researcher': '요리 연구가',
    'medical': '의료/한의학 전문가'
  };
  document.getElementById('pass-role-display').innerText = roleLabels[role] || role;
  document.getElementById('pass-const-display').innerText = constitution;
  document.getElementById('pass-concern-display').innerText = concern;
  document.getElementById('pass-date-display').innerText = signupDate.split(' ')[0];
  
  const passModal = document.getElementById('pass-modal');
  if (passModal) {
    passModal.classList.add('open');
  }
}

function closePassModal() {
  const passModal = document.getElementById('pass-modal');
  if (passModal) {
    passModal.classList.remove('open');
  }
}

function enterPlatformWithPass() {
  if (pendingSubscriber) {
    localStorage.setItem('nuri_current_subscriber', JSON.stringify(pendingSubscriber));
  }
  
  unlockPlatformGateway();
  closePassModal();
  
  if (pendingSubscriber) {
    const role = pendingSubscriber.role;
    if (role === 'general') {
      enterPlatform('recipe');
    } else {
      enterPlatform('workspace');
    }
  } else {
    enterPlatform('recipe');
  }
}

// ─── 관리자 인증 및 입장 ─────────────────────────────────────────
const ADMIN_PASSWORD = 'nuri2026';   // ← 관리자 비밀번호 (필요시 변경)

function openAdminModal() {
  const modal = document.getElementById('admin-modal');
  const input = document.getElementById('admin-pw-input');
  const errEl = document.getElementById('admin-pw-error');
  if (modal) modal.classList.add('open');
  if (input) { input.value = ''; setTimeout(() => input.focus(), 150); }
  if (errEl) errEl.style.display = 'none';
}

function closeAdminModal() {
  const modal = document.getElementById('admin-modal');
  if (modal) modal.classList.remove('open');
}

function submitAdminLogin() {
  const input = document.getElementById('admin-pw-input');
  const errEl = document.getElementById('admin-pw-error');
  const pw = input ? input.value : '';

  if (pw !== ADMIN_PASSWORD) {
    if (errEl) errEl.style.display = 'block';
    if (input) { input.value = ''; input.focus(); }
    return;
  }

  // 관리자 세션 생성
  const adminProfile = {
    id: 'ADMIN-00000',
    name: '관리자',
    email: 'admin@nurilab.kr',
    role: 'admin',
    constitution: '일반',
    concern: '플랫폼 운영',
    signupDate: new Date().toISOString().slice(0, 19).replace('T', ' ')
  };
  localStorage.setItem('nuri_current_subscriber', JSON.stringify(adminProfile));
  pendingSubscriber = adminProfile;

  closeAdminModal();
  unlockPlatformGateway();

  // 관리자는 항상 전문가(workspace) 모드로 진입
  enterPlatform('workspace');
}

// ─── 로그아웃 / 다른 계정 재가입 ─────────────────────────────────
function logoutAndReset() {
  localStorage.removeItem('nuri_current_subscriber');
  pendingSubscriber = null;
  location.reload();
}


function renderCrmDashboard(filterText = "") {
  const totalSubscribers = subscribersDb.length;
  const query = filterText.toLowerCase().trim();
  const filteredList = subscribersDb.filter(sub => {
    return (
      sub.name.toLowerCase().includes(query) ||
      sub.email.toLowerCase().includes(query) ||
      sub.concern.toLowerCase().includes(query) ||
      sub.constitution.toLowerCase().includes(query) ||
      sub.role.toLowerCase().includes(query)
    );
  });
  
  filteredList.sort((a, b) => new Date(b.signupDate) - new Date(a.signupDate));
  
  document.getElementById('crm-total-subscribers').innerText = `${totalSubscribers} 명`;
  
  const b2bCount = subscribersDb.filter(sub => sub.role !== 'general').length;
  const b2bRatio = totalSubscribers > 0 ? ((b2bCount / totalSubscribers) * 100).toFixed(0) : 0;
  document.getElementById('crm-target-ratio').innerText = `${b2bRatio} %`;
  
  const concernCounts = {};
  subscribersDb.forEach(sub => {
    concernCounts[sub.concern] = (concernCounts[sub.concern] || 0) + 1;
  });
  let topConcern = "-";
  let maxConcernCount = 0;
  Object.entries(concernCounts).forEach(([c, cnt]) => {
    if (cnt > maxConcernCount) {
      maxConcernCount = cnt;
      topConcern = c;
    }
  });
  document.getElementById('crm-top-concern').innerText = topConcern;
  
  const constCounts = {};
  subscribersDb.forEach(sub => {
    constCounts[sub.constitution] = (constCounts[sub.constitution] || 0) + 1;
  });
  let topConst = "-";
  let maxConstCount = 0;
  Object.entries(constCounts).forEach(([c, cnt]) => {
    if (cnt > maxConstCount) {
      maxConstCount = cnt;
      topConst = c;
    }
  });
  document.getElementById('crm-top-constitution').innerText = topConst;
  
  const tbody = document.getElementById('crm-table-body');
  if (tbody) {
    tbody.innerHTML = '';
    if (filteredList.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center; padding: 30px; color: var(--text-muted);">
            조회된 구독자 가입 내역이 없습니다.
          </td>
        </tr>
      `;
      return;
    }
    
    const roleLabels = {
      'general': '<span class="badge" style="background:rgba(16,185,129,0.1); color:#10b981; border:1px solid #10b981;">일반 사용자</span>',
      'founder': '<span class="badge" style="background:rgba(245,158,11,0.1); color:#f59e0b; border:1px solid #f59e0b;">예비 창업자</span>',
      'researcher': '<span class="badge" style="background:rgba(139,92,246,0.1); color:#8b5cf6; border:1px solid #8b5cf6;">요리 연구가</span>',
      'medical': '<span class="badge" style="background:rgba(59,130,246,0.1); color:#3b82f6; border:1px solid #3b82f6;">의료/한의학</span>'
    };
    
    filteredList.forEach(sub => {
      tbody.innerHTML += `
        <tr style="border-bottom:1px solid var(--border-glass);">
          <td style="padding:12px 16px; font-size:0.82rem; color:var(--text-muted);">${sub.signupDate}</td>
          <td style="padding:12px 16px; font-size:0.82rem; font-family:\'Outfit\',sans-serif; color:var(--primary); font-weight:600;">${sub.id}</td>
          <td style="padding:12px 16px; font-size:0.85rem; color:#fff; font-weight:600;">${sub.name}</td>
          <td style="padding:12px 16px; font-size:0.82rem; color:var(--text-secondary);">${sub.email}</td>
          <td style="padding:12px 16px; font-size:0.82rem;">${roleLabels[sub.role] || sub.role}</td>
          <td style="padding:12px 16px; font-size:0.82rem; color:#fff; font-weight:500;">${sub.constitution}</td>
          <td style="padding:12px 16px; font-size:0.82rem; color:var(--primary); font-weight:500;">${sub.concern}</td>
          <td style="padding:12px 16px; font-size:0.82rem; text-align:center;">
            <button class="btn btn-outline btn-xsmall" onclick="deleteSubscriber('${sub.id}')" style="border-color:#ef4444; color:#ef4444;">
              <i class="fa-solid fa-trash-can"></i> 삭제
            </button>
          </td>
        </tr>
      `;
    });
  }
}

function handleCrmSearch() {
  const query = document.getElementById('crm-search-input').value;
  renderCrmDashboard(query);
}

function deleteSubscriber(id) {
  if (confirm("정말로 이 구독자 기록을 삭제하시겠습니까?")) {
    subscribersDb = subscribersDb.filter(sub => sub.id !== id);
    localStorage.setItem('nuri_subscribers', JSON.stringify(subscribersDb));
    
    const currentSub = localStorage.getItem('nuri_current_subscriber');
    if (currentSub) {
      const parsed = JSON.parse(currentSub);
      if (parsed.id === id) {
        localStorage.removeItem('nuri_current_subscriber');
        alert("현재 접속 중인 사용자 프로필이 삭제되었습니다. 게이트웨이로 돌아갑니다.");
        returnToGateway();
        return;
      }
    }
    
    renderCrmDashboard(document.getElementById('crm-search-input').value);
  }
}

function exportCrmData(format) {
  if (subscribersDb.length === 0) {
    alert("내보낼 구독자 데이터가 없습니다.");
    return;
  }
  
  let text = "";
  if (format === 'json') {
    text = JSON.stringify(subscribersDb, null, 2);
  } else {
    text = "\\ufeff가입일시,고유번호,이름,이메일,역할군,사상체질,건강관심사\\n";
    subscribersDb.forEach(sub => {
      text += `"${sub.signupDate}","${sub.id}","${sub.name}","${sub.email}","${sub.role}","${sub.constitution}","${sub.concern}"\\n`;
    });
  }
  
  const blob = new Blob([text], { type: format === 'json' ? 'application/json' : 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `nuri_subscribers_crm_export.${format}`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function localizePersonaUi() {
  const badge = document.getElementById('app-persona-badge');
  const subtitle = document.getElementById('platform-subtitle-text');
  
  const dashTitle = document.getElementById('dashboard-title-text');
  const dashDesc = document.getElementById('dashboard-desc-text');
  
  const axisTitle = document.getElementById('axis-title-lbl');
  const axisDesc = document.getElementById('axis-desc-lbl');
  
  const queryTitle = document.getElementById('query-title-text');
  const queryDesc = document.getElementById('query-desc-text');
  
  const browserTitle = document.getElementById('browser-title-text');
  const browserDesc = document.getElementById('browser-desc-text');
  
  const emptyLbl = document.getElementById('query-empty-lbl');
  
  if (currentPersona === 'recipe') {
    // 일반 모드일 때는 전문가 모드로 이동을 유도하도록 골드 컬러 전문가 버튼 노출
    badge.innerText = "전문가 R&D 모드로";
    badge.className = "persona-tag to-expert";
    subtitle.innerText = "Mila 웰빙 건강 포털";
    
    dashTitle.innerText = "가정용 건강 대시보드";
    dashDesc.innerText = "동의보감·본초강목의 지혜를 내 부엌으로 가져오는 일상 건강 밸런스";
    
    axisTitle.innerText = "몸을 이롭게 하는 7대 건강 계열";
    axisDesc.innerText = "신체 활력을 조율하고 지탱하기 위해 구성된 7대 신체 작용 계열입니다.";
    
    queryTitle.innerText = "1단계 맞춤 약선 처방실";
    queryDesc.innerText = "내 체질과 절기, 불편한 증상을 고려해 해가 되지 않는 안전한 맞춤 보양식을 창안합니다.";
    
    browserTitle.innerText = "건강 식재료 백과사전";
    browserDesc.innerText = "우리 밥상에 올라가는 다양한 약재 및 식품들의 상세 성미와 섭취 팁 가이드";
    
    emptyLbl.innerText = "내 몸 맞춤 건강 추천 결과";
    
    document.getElementById('menu-query-txt').innerText = "내 몸 맞춤 추천실";
    document.getElementById('menu-browser-txt').innerText = "식재료 백과사전";
    
    document.getElementById('stat-exceptions-lbl').innerText = "식재료 궁합 경고 가드";
    document.getElementById('formulation-role-lbl').innerHTML = '<i class="fa-solid fa-mortar-pestle"></i> 보양식 식재료 조합 (주재료 및 부재료 비율)';
    document.getElementById('cooking-steps-lbl').innerHTML = '<i class="fa-solid fa-fire-burner"></i> 가정용 약선 가마솥 조리법';
  } else {
    // 전문가 R&D 모드일 때는 일반 모드로 돌아갈 수 있도록 그린 컬러 일반 버튼 노출
    badge.innerText = "일반 사용자 모드로";
    badge.className = "persona-tag to-general";
    subtitle.innerText = "Nuri Laboratory R&D Workspace";
    
    dashTitle.innerText = "의약식품 온톨로지 대시보드";
    dashDesc.innerText = "황제내경·동의보감 고전과 농촌진흥청 국가표준식품 데이터를 융합한 원료 기전 분석 엔진";
    
    axisTitle.innerText = "7대 표준축 (7-AXIS) 구성 체계";
    axisDesc.innerText = "한방 원물 약리 작용을 현대 생리학적 기전과 매핑시키기 위해 설계된 7가지 최상위 분류 축입니다.";
    
    queryTitle.innerText = "AI 동적 약선 처방실 (Matrix Engine)";
    queryDesc.innerText = "1,793행 온톨로지의 실시간 점수화(Scoring) 연산을 통한 사상 체질 및 절기 부합형 맞춤 약선 처방 설계";
    
    browserTitle.innerText = "마스터 코어 DB 브라우저";
    browserDesc.innerText = "Nuri Lab 정형화 식재료 1,793행 고속 다차원 검색 및 현대 생리 활성/생화학 기전(Mechanism) 분석";
    
    emptyLbl.innerText = "맞춤 약선 추천 결과";
    
    document.getElementById('menu-query-txt').innerText = "AI 약선 처방실";
    document.getElementById('menu-browser-txt').innerText = "마스터 DB 브라우저";
    
    document.getElementById('stat-exceptions-lbl').innerText = "다중매핑 예외 규칙";
    document.getElementById('formulation-role-lbl').innerHTML = '<i class="fa-solid fa-mortar-pestle"></i> 군신좌사(君臣佐使) 약리 배합 설계';
    document.getElementById('cooking-steps-lbl').innerHTML = '<i class="fa-solid fa-fire-burner"></i> 순차적 약선 대류 및 조리 시퀀서';
  }
}

// ─── Data Loading ───────────────────────────────────────────────
async function loadPortalData() {
  try {
    const fetchJson = async (url) => {
      const res = await fetch(`./data/${url}?t=${Date.now()}`);
      if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
      return await res.json();
    };

    masterDb = await fetchJson('mfco_master_core_db.json');
    standardFunctions = await fetchJson('mfco_standard_function_index.json');
    normalizationDict = await fetchJson('mfco_normalization_dictionary.json');
    exceptionDict = await fetchJson('mfco_exception_dictionary.json');
    
    // 신규 자료 로드
    recipesDb = await fetchJson('yakseon_recipes.json').catch(() => []);
    
    // 기능주 및 입가심 차/숭늉 가상 데이터 추가 주입
    const virtualRecipes = [
      {
        "요리명": "식전 약선 홍화주(기능주)",
        "주재료": "전통청주(100ml)",
        "부재료 및 약재": "홍화(5g), 당귀(5g), 감초(2g)",
        "주요효능": "식전에 소량 섭취하여 혈액 순환을 활성화하고 위장 온기를 돋워 식사 흡수 효율을 도움.",
        "기미 및 귀경": "기미: 온성(溫性), 신맛(辛味) 및 감맛(甘味). 귀경: 심경, 간경, 위경.",
        "조리 방법 요약": "전통 곡주에 홍화와 당귀를 침출하여 연하게 우려낸 기능성 약용주.",
        "카테고리": "양념",
        "출처": 106
      },
      {
        "요리명": "입가심용 홍화차",
        "주재료": "물(500ml)",
        "부재료 및 약재": "홍화(3g), 감초(1g), 박하(1g)",
        "주요효능": "식후 입안을 개운하게 정화하고 체내 어혈을 제거하여 혈행을 원활히 돕는 입가심 차.",
        "기미 및 귀경": "기미: 평성(平성) 또는 약간 서늘함, 고맛(苦味) 및 감맛(甘味). 귀경: 심경, 간경.",
        "조리 방법 요약": "따뜻한 물에 홍화와 감초, 박하잎을 살짝 온침하여 개운하게 우려 입가심용으로 낸다.",
        "카테고리": "양념",
        "출처": 107
      },
      {
        "요리명": "전통 구수 숭늉",
        "주재료": "누룽지(50g)",
        "부재료 및 약재": "물(1L)",
        "주요효능": "식사 후 위장을 따뜻하게 덮어주고 전신 소화 작용을 보조하며 속을 편안히 다스리는 입가심 음료.",
        "기미 및 귀경": "기미: 온성(溫性), 감맛(甘味) 및 담맛(담미). 귀경: 비경, 위경.",
        "조리 방법 요약": "솥 바닥의 누룽지에 물을 붓고 구수한 맛이 우러나올 때까지 푹 끓인다.",
        "카테고리": "양념",
        "출처": 108
      },
      {
        "요리명": "황기 두부 된장찌개",
        "주재료": "두부(200g), 된장(50g)",
        "부재료 및 약재": "황기(10g), 대추(5g), 애호박, 표고버섯, 대파",
        "주요효능": "황기의 원기 보강 효능과 된장의 소화 촉진 효능이 결합하여 만성 피로 및 비위 약화 개선.",
        "기미 및 귀경": "기미: 온성(溫性), 감맛(甘味) 및 짠맛(鹹味). 귀경: 비경, 위경.",
        "조리 방법 요약": "황기를 끓여 약수를 내고, 그 약수에 된장을 풀어 두부와 버섯, 호박을 넣고 자작하게 찌개를 끓인다.",
        "카테고리": "국물",
        "출처": 109
      },
      {
        "요리명": "산사 버섯 고추장찌개",
        "주재료": "표고버섯(100g), 돼지고기(100g)",
        "부재료 및 약재": "산사(10g), 고추장(40g), 감자, 애호박, 파, 마늘",
        "주요효능": "산사의 위장 소화 촉진 효능과 매콤한 고추장 성분이 비위를 따뜻하게 하고 소화를 돕는 찌개.",
        "기미 및 귀경": "기미: 온성(溫性), 신맛(酸味) 및 맵고 단맛. 위경, 간경.",
        "조리 방법 요약": "냄비에 돼지고기와 고추장을 볶다 산사 약수를 붓고 감자와 버섯을 넣어 푹 끓여낸다.",
        "카테고리": "국물",
        "출처": 110
      },
      {
        "요리명": "산약 동태 비지찌개",
        "주재료": "동태살(150g), 콩비지(200g)",
        "부재료 및 약재": "산약(마, 15g), 김치, 대파, 마늘, 고춧가루",
        "주요효능": "신장을 보하고 뼈를 튼튼히 하며, 콩비지의 단백질과 동태의 담백한 맛이 어우러진 보양 비지찌개.",
        "기미 및 귀경": "기미: 평성(平性), 감맛(甘味). 신경, 비경.",
        "조리 방법 요약": "뚝배기에 김치와 동태를 볶다가 비지와 산약(마) 가루를 섞어 자작하게 지져낸다.",
        "카테고리": "국물",
        "출처": 111
      }
    ];

    virtualRecipes.forEach(vr => {
      if (!recipesDb.some(r => r.요리명 === vr.요리명)) {
        recipesDb.push(vr);
      }
    });
    
    // 요리종류 카테고리 주입
    recipesDb.forEach(r => {
      r.category = r.카테고리 || getRecipeCategory(r.요리명);
    });

    holidaysDb = await fetchJson('yakseon_holidays.json').catch(() => []);
    seasonalDb = await fetchJson('yakseon_seasonal_24terms.json').catch(() => []);
    diseasesDb = await fetchJson('yakseon_disease_mapping.json').catch(() => []);
    window.ingredientsHerbologyList = await fetchJson('yakseon_ingredients_herbology.json').catch(() => []);
    window.ingredientsNutritionMap = await fetchJson('yakseon_ingredients_nutrition.json').catch(() => ({}));
    window.bioactiveBenefits = await fetchJson('yakseon_bioactive_benefits.json').catch(() => ({}));

    console.log("UI Datasets loaded: masterDb", masterDb.length, "recipes", recipesDb.length, "holidays", holidaysDb.length, "herbology", window.ingredientsHerbologyList.length, "nutrition", Object.keys(window.ingredientsNutritionMap).length);
  } catch (err) {
    console.error("Failed to load portal datasets:", err);
  }
}

// 요리명 기준 한식 5대 카테고리 분류 헬퍼
function getRecipeCategory(name) {
  const mapping = {
    "하수오밥": "주식",
    "지구자 동태탕": "국물",
    "홍합 스파게티": "주식",
    "닭장 떡국": "국물",
    "사군자 닭개장": "국물",
    "묵은지 된장조림": "반찬",
    "쑥 부침개": "부식",
    "팔진 오골계탕": "국물",
    "마·고구마 튀김": "부식",
    "약선 구기자 무나물": "반찬",
    "마·복 팥칼국수": "주식",
    "사물 미니족발": "부식",
    "은이 배숙갱": "양념",
    "갈지 콩나물 북어국": "국물",
    "돼지고기 무국": "국물",
    "매생이 굴국": "국물"
  };
  return mapping[name] || "기타";
}

// 요리 및 주재료명 분석 기반 한식 세부 카테고리(복합 밥류, 메인 탕류 등) 분류기
function getGranularCategory(recipe) {
  if (!recipe) return "기타";
  const name = recipe.요리명 || "";
  const baseCategory = recipe.카테고리 || recipe.category || getRecipeCategory(name);
  
  if (baseCategory === "주식") {
    if (name.includes("죽") || name.includes("면") || name.includes("국수") || name.includes("수제비") || name.includes("만두") || name.includes("스파게티") || name.includes("수단") || name.includes("옹심이")) {
      return "주식_죽면";
    }
    // 하수오밥, 보양밥, 기장밥, 현미밥, 팥밥 등 영양 재료/한약재가 첨가된 복합 밥류
    if (name.includes("밥") || name.includes("범벅") || name.includes("단자") || name.includes("경단")) {
      return "주식_복합";
    }
    return "주식_일반";
  }
  
  if (baseCategory === "국물") {
    // 탕류 중 식사의 메인이 되는 요리 (오골계탕, 동태탕, 닭개장, 갈비탕, 도가니탕, 백숙, 삼계탕, 육개장, 곰탕, 흑염소탕, 오리전골 등)
    if (name.includes("탕") || name.includes("전골") || name.includes("백숙") || name.includes("개장") || name.includes("곰탕") || name.includes("찌개")) {
      return "국물_메인";
    }
    return "국물_일반";
  }
  
  return baseCategory; // "부식", "반찬", "양념", "기타"
}


// ─── Navigation ──────────────────────────────────────────────────
function switchTab(tabId) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(el => {
    el.classList.remove('active');
  });
  // Show target tab
  const target = document.getElementById(tabId);
  if (target) target.classList.add('active');

  // Activate nav item
  document.querySelectorAll('.nav-item').forEach(btn => {
    const clickAttr = btn.getAttribute('onclick');
    if (clickAttr && clickAttr.includes(tabId)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Special triggers on tab switch
  if (tabId === 'tab-dashboard') {
    animateDashboardBars();
  } else if (tabId === 'tab-recipes-rnd') {
    updateRndAnalysis();
  } else if (tabId === 'tab-subscribers') {
    renderCrmDashboard();
  } else if (tabId === 'tab-ecosystem') {
    showEcosystemDetails('eco-platform');
  } else if (tabId === 'tab-shop') {
    renderShopProducts();
    updateCartUI();
    // 쇼핑몰 탭에서는 장바구니 FAB 표시 (항목 있을 때)
    const totalQty = shopCart.reduce(function(s,c){ return s+c.qty; }, 0);
    const fab = document.getElementById('cart-fab');
    if (fab) fab.style.display = totalQty > 0 ? 'flex' : 'none';
  }
}

// ─── Tab 1: Dashboard ────────────────────────────────────────────
function initDashboard() {
  document.getElementById('stat-master-rows').innerText = `${masterDb.length.toLocaleString()} 행`;
  document.getElementById('stat-functions').innerText = `${standardFunctions.length} 종`;
  document.getElementById('stat-normalization').innerText = `${normalizationDict.length} 개`;
  document.getElementById('stat-exceptions').innerText = `${exceptionDict.length} 건`;

  // Compute 7-Axis Distribution from Master Core DB with Normalization Fallback
  const axisCounts = { '정화': 0, '완화': 0, '흡수': 0, '회복': 0, '순환': 0, '보호': 0, '안정': 0 };
  
  // 1. 표준기능 -> 7축 매핑 캐시 생성
  const funcToAxis = {};
  standardFunctions.forEach(item => {
    funcToAxis[item.표준기능] = item["7축"];
  });

  // 2. 용어 정규화 사전 -> 표준기능/7축 매핑 캐시 생성 (결결된 7축 보정 반영)
  const normMap = {};
  normalizationDict.forEach(item => {
    if (item.원문효능) {
      normMap[item.원문효능] = {
        axis: getResolved7Axis(item.표준기능, item["7축"]),
        stdFunc: item.표준기능
      };
    }
  });

  // 3. 마스터 DB 레코드 순회 집계
  masterDb.forEach(row => {
    let axes = new Set();
    
    // 1순위: 표준기능목록의 각 기능 매핑 및 하이브리드 보정
    (row.표준기능목록 || []).forEach(f => {
      if (f) {
        const ax = getResolved7Axis(f, null);
        if (ax) axes.add(ax);
      }
    });
    
    // 2순위: 원본효능 값을 용어 정규화 사전에 매칭하여 역추적
    (row.효능목록 || []).forEach(orig => {
      if (orig && normMap[orig]) {
        let ax = normMap[orig].axis;
        if (ax) axes.add(ax);
      }
    });

    // 집계 반영
    axes.forEach(axis => {
      if (axisCounts.hasOwnProperty(axis)) {
        axisCounts[axis]++;
      }
    });
  });

  const chartContainer = document.getElementById('axis-chart-container');
  chartContainer.innerHTML = '';
  
  const maxVal = Math.max(...Object.values(axisCounts), 1);

  Object.entries(axisCounts).forEach(([axis, count]) => {
    const pct = ((count / maxVal) * 100).toFixed(0);
    const div = document.createElement('div');
    div.className = 'axis-bar-item';
    div.onclick = () => routeToAxis(axis);
    div.setAttribute('title', `클릭 시 [${axis} 축] 상세 표준기능 목록으로 이동`);
    div.innerHTML = `
      <div class="axis-bar-lbl">
        <span>${axis} 계열</span>
        <span>${count.toLocaleString()}건 매핑</span>
      </div>
      <div class="axis-bar-track">
        <div class="axis-bar-fill" data-pct="${pct}"></div>
      </div>
    `;
    chartContainer.appendChild(div);
  });

  setTimeout(animateDashboardBars, 100);
}

function animateDashboardBars() {
  document.querySelectorAll('.axis-bar-fill').forEach(fill => {
    const pct = fill.getAttribute('data-pct');
    fill.style.width = `${pct}%`;
  });
}

// ─── Tab 2: AI Prescribing ──────────────────────────────────────
function toggleCustomInput() {
  const select = document.getElementById('symptom-select');
  const customInput = document.getElementById('custom-symptom');
  customInput.style.display = select.value === 'CUSTOM' ? 'block' : 'none';
}

function logConsole(msg) {
  const consoleBox = document.getElementById('engine-console');
  if (consoleBox) {
    consoleBox.innerHTML += `\n> ${msg}`;
    consoleBox.scrollTop = consoleBox.scrollHeight;
  }
}

function runInference() {
  const select = document.getElementById('symptom-select');
  let symptom = select.value;
  if (symptom === 'CUSTOM') {
    symptom = document.getElementById('custom-symptom').value.trim() || '일반';
  }
  const constitution = document.getElementById('constitution-select').value;
  const season = document.getElementById('season-select').value;

  logConsole(`Inference Triggered: [Symptom: ${symptom}, Constitution: ${constitution}, Season: ${season}]`);

  const result = engine.generateDynamicRecipe(symptom, constitution, season);
  lastInferenceResult = result; // 복사를 위해 보존

  const emptyView = document.getElementById('query-empty');
  const resultView = document.getElementById('query-result');

  if (result.status !== "SUCCESS") {
    emptyView.style.display = 'flex';
    resultView.style.display = 'none';
    logConsole(`❌ 추론 실패: ${result.message}`);
    alert(result.message);
    return;
  }

  // Hide empty state and show results
  emptyView.style.display = 'none';
  resultView.style.display = 'block';
  
  // Set Title & Heritage
  document.getElementById('res-recipe-name').innerText = result.recipe_name;
  
  // 병증 매핑 정보가 다운로드 데이터베이스에 있으면 보조 요약 렌더링
  let diseaseNote = '';
  const dInfo = diseasesDb.find(d => d.병증.includes(symptom) || symptom.includes(d.병증));
  if (dInfo) {
    diseaseNote = ` | 한방 원인: ${dInfo["원인 및 증상"]} | 주의: ${dInfo["주의 사항"]}`;
  }
  document.getElementById('res-heritage').innerText = `문헌 근거: ${result.heritage_source || '동의보감 방제학 근본 기반'}${diseaseNote}`;
  logConsole(`✅ 동적 배합 창안 성공: ${result.recipe_name}`);

  // 1. Render Gun-Sin-Jwa-Sa Cards
  const compGrid = document.getElementById('res-comp-grid');
  compGrid.innerHTML = '';
  result.composition.forEach(item => {
    let cardClass = 'gun';
    if (item.role.includes('신약')) cardClass = 'sin';
    else if (item.role.includes('좌약')) cardClass = 'jwa';
    else if (item.role.includes('사약')) cardClass = 'sa';

    // 일반 모드에서는 군신좌사 명칭을 주재료/부재료로 순화
    let roleText = item.role;
    if (currentPersona === 'recipe') {
      if (item.role.includes('군약')) roleText = '주재료(Chief)';
      else if (item.role.includes('신약')) roleText = '부재료(Assistant)';
      else if (item.role.includes('좌약')) roleText = '조화재료';
      else if (item.role.includes('사약')) roleText = '양념/사양재료';
    }

    const card = document.createElement('div');
    card.className = `comp-card ${cardClass}`;
    card.innerHTML = `
      <span class="comp-role-badge">${roleText} (${item.ratio})</span>
      <div class="comp-name" style="cursor:pointer; " onclick="showRndRowDetailByName('${item.name.replace(/'/g, "\\\\'")}')" class="clickable-text" title="클릭 시 약재 상세 정보 팝업">${item.name} <small style="color:var(--text-muted); font-size:0.8rem;">${item.weight}</small></div>
      <div class="comp-desc">
        <p><strong>성미:</strong> ${item.nature_taste || '평(平)'}</p>
        <p style="margin-top: 4px;"><strong>효능기전:</strong> ${translateTerm(item.efficacy)}</p>
        <p style="margin-top: 4px; font-size:0.72rem; color:var(--primary);">💡 ${item.cooking_recommendation}</p>
      </div>
    `;
    compGrid.appendChild(card);
  });

  // 2. Render Safeguard Warnings and Synergies
  const safeContainer = document.getElementById('res-safe-container');
  safeContainer.innerHTML = '';
  const warnings = result.safeguard.warnings;
  const synergies = result.safeguard.synergies;

  if (warnings.length === 0 && synergies.length === 0) {
    safeContainer.innerHTML = `<p style="font-size:0.85rem; color:var(--text-muted);">감지된 상극 독성 반응 또는 유의한 시너지 조합이 없습니다. 안전한 일반 약선식입니다.</p>`;
  } else {
    const list = document.createElement('div');
    list.className = 'alert-card-flow';
    
    warnings.forEach(w => {
      list.innerHTML += `
        <div class="alert-item warn">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <div>
            <strong>상극 배합 검출: <span style="cursor:pointer; " onclick="showRndRowDetailByName('${w.a.replace(/'/g, "\\\\'")}')" class="clickable-text">${w.a}</span> - <span style="cursor:pointer; " onclick="showRndRowDetailByName('${w.b.replace(/'/g, "\\\\'")}')" class="clickable-text">${w.b}</span></strong>
            <p style="font-size: 0.78rem; margin-top:2px; opacity:0.8;">${w.desc} (안전 가드로 인해 레시피가 안전한 약재로 교체 보정되었습니다.)</p>
          </div>
        </div>
      `;
    });

    synergies.forEach(s => {
      list.innerHTML += `
        <div class="alert-item syn">
          <i class="fa-solid fa-star"></i>
          <div>
            <strong>궁합 시너지 매칭: <span style="cursor:pointer; " onclick="showRndRowDetailByName('${s.a.replace(/'/g, "\\\\'")}')" class="clickable-text">${s.a}</span> - <span style="cursor:pointer; " onclick="showRndRowDetailByName('${s.b.replace(/'/g, "\\\\'")}')" class="clickable-text">${s.b}</span></strong>
            <p style="font-size: 0.78rem; margin-top:2px; opacity:0.8;">${s.desc} (성분 흡수율 및 생체 시너지 극대화)</p>
          </div>
        </div>
      `;
    });
    safeContainer.appendChild(list);
  }

  // 3. Render Cooking Steps
  const stepsContainer = document.getElementById('res-cooking-steps');
  stepsContainer.innerHTML = '';
  result.cooking_steps.forEach(step => {
    const li = document.createElement('li');
    li.className = 'cooking-step-item';
    li.innerText = step;
    stepsContainer.appendChild(li);
  });
}

// ─── Tab 3: Master DB Browser ────────────────────────────────────
function initBrowser() {
  filteredMasterDb = [...masterDb];
  
  // Populate Standard Function Filter Dropdown
  const dropdown = document.getElementById('filter-standard-func');
  dropdown.innerHTML = '<option value="">기능 분류 전체</option>';
  
  const funcs = [...new Set(masterDb.flatMap(row => row.표준기능목록 || []).filter(Boolean))].sort();
  funcs.forEach(f => {
    dropdown.innerHTML += `<option value="${f}">${f}</option>`;
  });

  renderBrowserTable();
}

function handleSearch() {
  const query = document.getElementById('browser-search-input').value.toLowerCase();
  const selectedFunc = document.getElementById('filter-standard-func').value;

  filteredMasterDb = masterDb.filter(row => {
    // 새 구조: 배열 필드를 join해서 검색
    const 효능str   = (row.효능목록    || []).join(' ');
    const 기능str   = (row.표준기능목록 || []).join(' ');
    const 생리str   = (row.생리작용목록 || []).join(' ');
    const 기전str   = (row.작용기전목록 || []).join(' ');
    const 질환str   = (row.연결질환목록 || []).join(' ');

    const matchQuery =
      (row["식재료/약재"] || "").toLowerCase().includes(query) ||
      효능str.toLowerCase().includes(query) ||
      기능str.toLowerCase().includes(query) ||
      생리str.toLowerCase().includes(query) ||
      기전str.toLowerCase().includes(query) ||
      질환str.toLowerCase().includes(query);

    const matchFunc = !selectedFunc ||
      (row.표준기능목록 || []).some(f => f === selectedFunc);

    return matchQuery && matchFunc;
  });

  browserPage = 1;
  renderBrowserTable();
}

function renderBrowserTable() {
  const tbody = document.getElementById('browser-table-body');
  tbody.innerHTML = '';

  const total = filteredMasterDb.length;
  document.getElementById('browser-records-count').innerText = `총 ${total.toLocaleString()}건 조회됨`;

  if (total === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--text-muted); padding:30px;">조회 결과가 없습니다.</td></tr>';
    document.getElementById('browser-pagination').innerHTML = '';
    return;
  }

  const startIdx = (browserPage - 1) * browserPageSize;
  const pageItems = filteredMasterDb.slice(startIdx, startIdx + browserPageSize);

  pageItems.forEach(row => {
    const tr = document.createElement('tr');
    tr.dataset.name = row["식재료/약재"];

    // 효능 태그 목록
    const 효능Tags = (row.효능목록 || []).map(e =>
      `<span style="display:inline-block;background:rgba(255,255,255,0.08);border-radius:4px;
        padding:1px 6px;margin:1px;font-size:0.78rem;">${e}</span>`
    ).join('');

    // 표준기능 배지 목록
    const 기능Tags = (row.표준기능목록 || []).filter(Boolean).map(f =>
      `<span class="badge badge-synergy" style="font-size:0.72rem;margin:1px;">${f}</span>`
    ).join('');

    // 연결질환: 빈칸 제외하고 unique
    const 질환List = [...new Set((row.연결질환목록 || []).filter(Boolean))].join(' | ');

    // 조리권장: 빈칸 제외하고 unique
    const 조리List = [...new Set((row.조리권장목록 || []).filter(Boolean))].join(' / ');

    // 생리작용 (expert-only)
    const 생리List = (row.생리작용목록 || []).filter(Boolean).join(', ');
    const 기전List = (row.작용기전목록 || []).filter(Boolean).join(', ');

    tr.innerHTML = `
      <td style="font-weight:700;color:var(--primary);vertical-align:top;white-space:nowrap;">
        ${row["식재료/약재"] || ""}
      </td>
      <td style="vertical-align:top;">${효능Tags}</td>
      <td style="vertical-align:top;">${기능Tags}</td>
      <td class="expert-only" style="vertical-align:top;font-size:0.8rem;">${생리List}</td>
      <td class="expert-only" style="vertical-align:top;font-size:0.8rem;">${기전List}</td>
      <td style="vertical-align:top;font-size:0.85rem;">${질환List}</td>
      <td style="vertical-align:top;font-size:0.85rem;">${조리List}</td>
    `;
    tr.addEventListener('click', () => showRowDetail(row));
    tbody.appendChild(tr);
  });

  renderPagination(total);
}

function renderPagination(total) {
  const container = document.getElementById('browser-pagination');
  container.innerHTML = '';

  const totalPages = Math.ceil(total / browserPageSize);
  const maxButtons = 5; // Show max 5 page buttons at once
  
  let startPage = Math.max(1, browserPage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);
  
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  // Prev Button
  if (browserPage > 1) {
    const btn = document.createElement('button');
    btn.className = 'page-btn';
    btn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    btn.addEventListener('click', () => { browserPage--; renderBrowserTable(); });
    container.appendChild(btn);
  }

  // Page numbers
  for (let i = startPage; i <= endPage; i++) {
    const btn = document.createElement('button');
    btn.className = `page-btn ${i === browserPage ? 'active' : ''}`;
    btn.innerText = i;
    btn.addEventListener('click', () => { browserPage = i; renderBrowserTable(); });
    container.appendChild(btn);
  }

  // Next Button
  if (browserPage < totalPages) {
    const btn = document.createElement('button');
    btn.className = 'page-btn';
    btn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    btn.addEventListener('click', () => { browserPage++; renderBrowserTable(); });
    container.appendChild(btn);
  }
}

// ─── Tab 4: Standard Functions & 7-Axis Map ──────────────────────
function initAxisExplorer() {
  const axes = ['정화', '완화', '흡수', '회복', '순환', '보호', '안정'];
  const navPanel = document.getElementById('axis-nav-panel');
  navPanel.innerHTML = '';

  axes.forEach(axis => {
    const btn = document.createElement('button');
    btn.className = `axis-nav-btn ${axis === activeAxis ? 'active' : ''}`;
    btn.innerHTML = `<i class="fa-solid fa-yin-yang" style="margin-right:8px; font-size:0.85rem;"></i> ${axis} 축`;
    btn.addEventListener('click', () => {
      activeAxis = axis;
      document.querySelectorAll('.axis-nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderAxisDetail();
    });
    navPanel.appendChild(btn);
  });

  renderAxisDetail();
}

function renderAxisDetail() {
  document.getElementById('axis-detail-title').innerText = `🎯 ${activeAxis} 축(Axis) 소속 표준기능 목록`;
  const grid = document.getElementById('axis-functions-grid');
  grid.innerHTML = '';

  const matchedFuncs = standardFunctions.filter(item => item["7축"] === activeAxis);

  matchedFuncs.forEach(item => {
    const card = document.createElement('div');
    card.className = 'function-detail-card';
    card.onclick = () => routeToBrowserWithFilter(item.표준기능);
    card.setAttribute('title', `클릭 시 [${item.표준기능}]이 필터링된 마스터 DB 브라우저로 이동`);
    card.style.cursor = 'pointer';
    card.innerHTML = `
      <span class="badge badge-synergy" style="margin-bottom:8px;">${item.SF_ID}</span>
      <h4>${item.표준기능}</h4>
      <p>${item.설명 || '기전적 세부 정의 준비 중'}</p>
    `;
    grid.appendChild(card);
  });
}

// ─── Tab 5: Normalization & Exceptions ───────────────────────────
function initRulesTables() {
  renderNormalizationTable();

  const exceptionTbody = document.getElementById('exception-table-body');
  exceptionTbody.innerHTML = '';
  exceptionDict.forEach(item => {
    exceptionTbody.innerHTML += `
      <tr>
        <td style="font-weight:700; color:var(--gun-color);">${item.원문효능}</td>
        <td><span class="badge badge-synergy">${item.기능1}</span></td>
        <td><span class="badge badge-synergy">${item.기능2}</span></td>
        <td style="color:var(--text-muted); font-size:0.75rem;">${item.구분}</td>
      </tr>
    `;
  });
}

function filterNormalization() {
  const q = document.getElementById('norm-search').value.toLowerCase();
  renderNormalizationTable(q);
}

function renderNormalizationTable(query = '') {
  const tbody = document.getElementById('norm-table-body');
  tbody.innerHTML = '';

  const filtered = normalizationDict.filter(item => {
    const resolvedAxis = getResolved7Axis(item.표준기능, item["7축"]);
    return (item.원문효능 || "").toLowerCase().includes(query) ||
           (item.표준기능 || "").toLowerCase().includes(query) ||
           (resolvedAxis || "").toLowerCase().includes(query);
  });

  filtered.forEach(item => {
    const resolvedAxis = getResolved7Axis(item.표준기능, item["7축"]);
    tbody.innerHTML += `
      <tr>
        <td style="font-weight:700; color:var(--primary);">${item.원문효능}</td>
        <td>${item.표준기능}</td>
        <td><span class="badge badge-synergy" style="opacity:0.85;">${resolvedAxis}</span></td>
      </tr>
    `;
  });
}

// ─── Tab 6: Phase 2 Flow Visualizer ──────────────────────────────
function selectFlowStep(stepNum) {
  activeFlowStep = stepNum;
  document.querySelectorAll('.flow-step').forEach(el => el.classList.remove('active'));
  document.getElementById(`step${stepNum}`).classList.add('active');

  const card = document.getElementById('flow-card-display');
  card.innerHTML = '';

  if (!diseasesDb || diseasesDb.length === 0) {
    card.innerHTML = `<p style="text-align:center; padding:20px; color:var(--text-muted);">병증 매핑 데이터를 불러올 수 없습니다.</p>`;
    return;
  }

  // 6대 병증 매핑 연쇄 구조 동적 구축
  const stepMeta = {
    1: {
      title: "1단계: 신체 상태 벡터 측정 (Physical State Vector)",
      desc: "환자가 자각하는 임상 증상 및 신체 상태 데이터로, 플랫폼의 기초 분석 입력 데이터입니다. 카드를 클릭하면 5단계 상세 추론 연쇄를 볼 수 있습니다.",
      getNodes: () => diseasesDb.map((d, idx) => ({
        idx: idx,
        diseaseName: d["병증"],
        code: `ST-${String(idx + 1).padStart(3, '0')}`,
        title: d["병증"],
        desc: d["원인 및 증상"].substring(0, 45) + "..."
      }))
    },
    2: {
      title: "2단계: 기전적 근본 원인 도출 (Root Cause Vector)",
      desc: "신체 상태를 유발하는 기전적/생리학적 근본 원인을 한방 병리설과 현대 생리 기전 관점에서 도출합니다. 카드를 클릭하면 상세 명세가 팝업됩니다.",
      getNodes: () => diseasesDb.map((d, idx) => {
        let causeTitle = "기혈 음양 허약";
        if (d["병증"].includes("냉증")) causeTitle = "양기 허약 및 한사 정체";
        else if (d["병증"].includes("기침")) causeTitle = "폐열 음분 손상 및 조사 침범";
        else if (d["병증"].includes("숙취")) causeTitle = "아세트알데히드 정체 및 부종";
        else if (d["병증"].includes("관절")) causeTitle = "풍한습 사기 침범 및 연골 손상";
        else if (d["병증"].includes("소화")) causeTitle = "비위 기허 및 소화액 분비 저하";
        else if (d["병증"].includes("기력")) causeTitle = "에너지 고갈 및 전신 기혈 양허";
        
        return {
          idx: idx,
          diseaseName: d["병증"],
          code: `RC-${String(idx + 1).padStart(3, '0')}`,
          title: causeTitle,
          desc: d["원인 및 증상"].length > 55 ? d["원인 및 증상"].substring(0, 52) + "..." : d["원인 및 증상"]
        };
      })
    },
    3: {
      title: "3단계: 처방 조제 역할군 결정 (Formulation Roles)",
      desc: "체질과 원인에 맞는 치료 배합을 위해 대표 약선 요리의 군신좌사(君臣佐使) 기획 설계를 확정합니다. 카드를 클릭하면 상세 명세가 팝업됩니다.",
      getNodes: () => diseasesDb.map((d, idx) => {
        let roleTitle = "군약/신약 설계";
        let roleDesc = "";
        
        if (d["병증"].includes("냉증")) {
          roleTitle = `${d["대표 약선 요리"].split(',')[0]} (군: 양고기, 신: 생강)`;
          roleDesc = "양고기를 군약으로 체온을 올리고 생강을 신약으로 배합해 온양 보온 효과를 냅니다.";
        } else if (d["병증"].includes("기침")) {
          roleTitle = `${d["대표 약선 요리"].split(',')[0]} (군: 배, 신: 맥문동)`;
          roleDesc = "배를 군약으로 보습 작용을 하고 맥문동을 신약으로 삼아 진해 윤폐를 유도합니다.";
        } else if (d["병증"].includes("숙취")) {
          roleTitle = `${d["대표 약선 요리"].split(',')[0]} (군: 복어, 신: 지구자)`;
          roleDesc = "복어를 군약으로 이수 대사를 돕고 지구자를 신약으로 삼아 간의 주독 해독을 보완합니다.";
        } else if (d["병증"].includes("관절")) {
          roleTitle = `${d["대표 약선 요리"].split(',')[0]} (군: 도가니, 신: 우슬)`;
          roleDesc = "도가니를 군약으로 관절을 보하고 우슬을 신약으로 하여 통증 제어와 기혈 순환을 도모합니다.";
        } else if (d["병증"].includes("소화")) {
          roleTitle = `${d["대표 약선 요리"].split(',')[0]} (군: 산약, 신: 백출)`;
          roleDesc = "산약을 군약으로 위 점막을 보하고 백출을 신약으로 하여 소화기의 흡수력을 향상시킵니다.";
        } else if (d["병증"].includes("기력")) {
          roleTitle = `${d["대표 약선 요리"].split(',')[0]} (군: 오골계, 신: 황기)`;
          roleDesc = "오골계를 군약으로 영양을 채우고 황기/인삼을 신약으로 삼아 전신의 기를 대보합니다.";
        }

        return {
          idx: idx,
          diseaseName: d["병증"],
          code: `ROLE-${String(idx + 1).padStart(3, '0')}`,
          title: roleTitle,
          desc: roleDesc
        };
      })
    },
    4: {
      title: "4단계: 정규화 표준기능 매핑 (Standard Function)",
      desc: "각 역할군 해결에 필수적으로 매치되는 정규화 표준 기능(SF) 코드를 매핑하여 연결합니다. 카드를 클릭하면 상세 명세가 팝업됩니다.",
      getNodes: () => diseasesDb.map((d, idx) => {
        let code = "SF012";
        let sfTitle = "체력회복 (보기익기)";
        let sfDesc = "에너지 세포 생성을 촉진해 피로감 개선";
        
        if (d["병증"].includes("냉증")) {
          code = "SF013";
          sfTitle = "말초순환개선 (온양구한)";
          sfDesc = "손발의 혈액 순환을 활성화하고 복부의 냉기 해소";
        } else if (d["병증"].includes("기침")) {
          code = "SF025";
          sfTitle = "진해 (윤폐지해)";
          sfDesc = "기관지 점막 윤활 작용과 보습을 통한 기침 완화";
        } else if (d["병증"].includes("숙취")) {
          code = "SF008";
          sfTitle = "주독해소 (간기능안정)";
          sfDesc = "아세트알데히드 해독을 활성화하고 부종 및 주독 해소";
        } else if (d["병증"].includes("관절")) {
          code = "SF018";
          sfTitle = "관절강화 (보간신강근골)";
          sfDesc = "연골 조직 및 관절 주변의 뼈와 인대 강화";
        } else if (d["병증"].includes("소화")) {
          code = "SF015";
          sfTitle = "위장보호 (비위보호)";
          sfDesc = "위 내부 보호 및 소화액 분비 정상화 유도";
        }

        return {
          idx: idx,
          diseaseName: d["병증"],
          code: code,
          title: sfTitle,
          desc: sfDesc
        };
      })
    },
    5: {
      title: "5단계: 최종 한방 식재료 사상 (Active Herb Mapping)",
      desc: "표준 기능과 사상체질, 절기 등에 부합하는 최적의 무독성 A등급 천연 약용 원재료 목록을 결정합니다. 카드를 클릭하면 상세 명세가 팝업됩니다.",
      getNodes: () => diseasesDb.map((d, idx) => {
        const herbs = d["권장 식품 및 약재"].split(',').slice(0, 3).map(h => h.trim()).join(', ');
        return {
          idx: idx,
          diseaseName: d["병증"],
          code: `H-${String(idx + 1).padStart(3, '0')}`,
          title: herbs,
          desc: `권장 약용원료: ${d["권장 식품 및 약재"].length > 55 ? d["권장 식품 및 약재"].substring(0, 52) + "..." : d["권장 식품 및 약재"]}`
        };
      })
    }
  };

  const info = stepMeta[stepNum];

  const nodesHtml = info.getNodes().map(n => {
    let nodeClass = "flow-node-item";
    let highlightTitle = "";
    let clickAction = "";

    if (activeDiseaseIndex !== null) {
      if (n.idx === activeDiseaseIndex) {
        nodeClass += " active-tracked";
      } else {
        nodeClass += " inactive";
      }
    }

    // 단계별 전진 클릭 액션 및 툴팁 바인딩
    if (activeFlowStep === 1) {
      clickAction = `clickFlowCard(${n.idx}, 1)`;
      highlightTitle = `클릭 시 [${n.diseaseName}]을 선택하여 2단계(원인)로 자동 전진 추적합니다`;
    } else if (activeFlowStep === 2) {
      clickAction = `clickFlowCard(${n.idx}, 2)`;
      highlightTitle = `클릭 시 [${n.diseaseName}]을 선택하여 3단계(처방역할)로 자동 전진 추적합니다`;
    } else if (activeFlowStep === 3) {
      clickAction = `clickFlowCard(${n.idx}, 3)`;
      highlightTitle = `클릭 시 [${n.diseaseName}]을 선택하여 4단계(표준기능)로 자동 전진 추적합니다`;
    } else if (activeFlowStep === 4) {
      clickAction = `clickFlowCard(${n.idx}, 4)`;
      highlightTitle = `클릭 시 [${n.diseaseName}]을 선택하여 5단계(약재매핑)로 자동 전진 추적합니다`;
    } else if (activeFlowStep === 5) {
      clickAction = `clickFlowCard(${n.idx}, 5)`;
      highlightTitle = `클릭 시 [${n.diseaseName}] 최종 다차원 추론 명세서 팝업`;
    }

    return `
      <div class="${nodeClass}" onclick="${clickAction}" style="cursor:pointer;" title="${highlightTitle}">
        <span class="node-code">${n.code}</span>
        <div class="node-title">${n.title}</div>
        <div class="node-desc">${n.desc}</div>
      </div>
    `;
  }).join('');

  card.innerHTML = `
    <h3>${info.title}</h3>
    <p>${info.desc}</p>
    <div class="flow-node-visual">
      ${nodesHtml}
    </div>
  `;
}

function showFlowMappingDetail(idx) {
  const d = diseasesDb[idx];
  if (!d) return;

  const overlay = document.getElementById('detail-modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');
  
  if (!overlay || !title || !body) return;

  title.innerHTML = `<i class="fa-solid fa-network-wired"></i> [${d["병증"]}] 다차원 온톨로지 매핑 추론 명세서`;

  // 1~5단계 단계별 데이터 계산
  const stCode = `ST-${String(idx + 1).padStart(3, '0')}`;
  const rcCode = `RC-${String(idx + 1).padStart(3, '0')}`;
  const roleCode = `ROLE-${String(idx + 1).padStart(3, '0')}`;
  
  // 기전 원인
  let causeTitle = "기혈 음양 허약";
  if (d["병증"].includes("냉증")) causeTitle = "양기 허약 및 한사 정체";
  else if (d["병증"].includes("기침")) causeTitle = "폐열 음분 손상 및 조사 침범";
  else if (d["병증"].includes("숙취")) causeTitle = "아세트알데히드 정체 및 부종";
  else if (d["병증"].includes("관절")) causeTitle = "풍한습 사기 침범 및 연골 손상";
  else if (d["병증"].includes("소화")) causeTitle = "비위 기허 및 소화액 분비 저하";
  else if (d["병증"].includes("기력")) causeTitle = "에너지 고갈 및 전신 기혈 양허";

  // 역할군
  let roleTitle = "군약/신약 설계";
  let roleDesc = "";
  if (d["병증"].includes("냉증")) {
    roleTitle = `${d["대표 약선 요리"].split(',')[0]} (군: 양고기, 신: 생강)`;
    roleDesc = "양고기를 군약으로 체온을 올리고 생강을 신약으로 배합해 온양 보온 효과를 냅니다.";
  } else if (d["병증"].includes("기침")) {
    roleTitle = `${d["대표 약선 요리"].split(',')[0]} (군: 배, 신: 맥문동)`;
    roleDesc = "배를 군약으로 보습 작용을 하고 맥문동을 신약으로 삼아 진해 윤폐를 유도합니다.";
  } else if (d["병증"].includes("숙취")) {
    roleTitle = `${d["대표 약선 요리"].split(',')[0]} (군: 복어, 신: 지구자)`;
    roleDesc = "복어를 군약으로 이수 대사를 돕고 지구자를 신약으로 삼아 간의 주독 해독을 보완합니다.";
  } else if (d["병증"].includes("관절")) {
    roleTitle = `${d["대표 약선 요리"].split(',')[0]} (군: 도가니, 신: 우슬)`;
    roleDesc = "도가니를 군약으로 관절을 보하고 우슬을 신약으로 하여 통증 제어와 기혈 순환을 도모합니다.";
  } else if (d["병증"].includes("소화")) {
    roleTitle = `${d["대표 약선 요리"].split(',')[0]} (군: 산약, 신: 백출)`;
    roleDesc = "산약을 군약으로 위 점막을 보하고 백출을 신약으로 하여 소화기의 흡수력을 향상시킵니다.";
  } else if (d["병증"].includes("기력")) {
    roleTitle = `${d["대표 약선 요리"].split(',')[0]} (군: 오골계, 신: 황기)`;
    roleDesc = "오골계를 군약으로 영양을 채우고 황기/인삼을 신약으로 삼아 전신의 기를 대보합니다.";
  }

  // 표준 기능
  let sfCode = "SF012";
  let sfTitle = "체력회복 (보기익기)";
  let sfDesc = "에너지 세포 생성을 촉진해 피로감 개선";
  if (d["병증"].includes("냉증")) {
    sfCode = "SF013";
    sfTitle = "말초순환개선 (온양구한)";
    sfDesc = "손발의 혈액 순환을 활성화하고 복부의 냉기 해소";
  } else if (d["병증"].includes("기침")) {
    sfCode = "SF025";
    sfTitle = "진해 (윤폐지해)";
    sfDesc = "기관지 점막 윤활 작용과 보습을 통한 기침 완화";
  } else if (d["병증"].includes("숙취")) {
    sfCode = "SF008";
    sfTitle = "주독해소 (간기능안정)";
    sfDesc = "아세트알데히드 해독을 활성화하고 부종 및 주독 해소";
  } else if (d["병증"].includes("관절")) {
    sfCode = "SF018";
    sfTitle = "관절강화 (보간신강근골)";
    sfDesc = "연골 조직 및 관절 주변의 뼈와 인대 강화";
  } else if (d["병증"].includes("소화")) {
    sfCode = "SF015";
    sfTitle = "위장보호 (비위보호)";
    sfDesc = "위 내부 보호 및 소화액 분비 정상화 유도";
  }

  body.innerHTML = `
    <div class="flow-detail-modal-body" style="color:#fff; display:flex; flex-direction:column; gap:20px;">
      <p style="font-size:0.88rem; color:var(--text-muted); line-height:1.5; margin-bottom:10px; border-bottom:1px solid var(--border-glass); padding-bottom:10px;">
        임상 신체 증상에서 출발하여 약물 동태학 및 본초학적 매핑에 이르는 다차원 추론 연쇄 상세 명세입니다.
      </p>
      
      <div class="mapping-timeline" style="display:flex; flex-direction:column; gap:20px; position:relative; padding-left:20px; border-left:2px dashed var(--primary); margin-left: 10px;">
        
        <!-- Step 1 -->
        <div class="timeline-step" style="position:relative;">
          <div style="position:absolute; left:-26px; top:4px; width:10px; height:10px; border-radius:50%; background:var(--primary); border: 2px solid var(--card-bg);"></div>
          <div style="font-size:0.75rem; font-weight:700; color:var(--primary);">${stCode} • 1단계 신체 상태 (Physical State)</div>
          <div style="font-size:1.05rem; font-weight:800; margin:4px 0; color:#fff;">${d["병증"]}</div>
          <div style="font-size:0.82rem; color:var(--text-muted); line-height:1.4;">${d["원인 및 증상"]}</div>
        </div>

        <!-- Step 2 -->
        <div class="timeline-step" style="position:relative;">
          <div style="position:absolute; left:-26px; top:4px; width:10px; height:10px; border-radius:50%; background:var(--primary); border: 2px solid var(--card-bg);"></div>
          <div style="font-size:0.75rem; font-weight:700; color:var(--primary);">${rcCode} • 2단계 기전 원인 (Root Cause)</div>
          <div style="font-size:1.05rem; font-weight:800; margin:4px 0; color:#fff;">${causeTitle}</div>
          <div style="font-size:0.82rem; color:var(--text-muted); line-height:1.4;">세포 생리학 및 장부변증에 따른 생리 기능 저하의 핵심 메커니즘을 도출합니다.</div>
        </div>

        <!-- Step 3 -->
        <div class="timeline-step" style="position:relative;">
          <div style="position:absolute; left:-26px; top:4px; width:10px; height:10px; border-radius:50%; background:var(--primary); border: 2px solid var(--card-bg);"></div>
          <div style="font-size:0.75rem; font-weight:700; color:var(--primary);">${roleCode} • 3단계 처방 역할군 (Formulation Roles)</div>
          <div style="font-size:1.05rem; font-weight:800; margin:4px 0; color:#fff;">${roleTitle}</div>
          <div style="font-size:0.82rem; color:var(--text-muted); line-height:1.4;">${roleDesc}</div>
        </div>

        <!-- Step 4 -->
        <div class="timeline-step" style="position:relative;">
          <div style="position:absolute; left:-26px; top:4px; width:10px; height:10px; border-radius:50%; background:var(--primary); border: 2px solid var(--card-bg);"></div>
          <div style="font-size:0.75rem; font-weight:700; color:var(--primary);">${sfCode} • 4단계 표준 계통 기능 (Standard Function)</div>
          <div style="font-size:1.05rem; font-weight:800; margin:4px 0; color:#fff;">${sfTitle}</div>
          <div style="font-size:0.82rem; color:var(--text-muted); line-height:1.4;">${sfDesc}</div>
        </div>

        <!-- Step 5 -->
        <div class="timeline-step" style="position:relative;">
          <div style="position:absolute; left:-26px; top:4px; width:10px; height:10px; border-radius:50%; background:var(--sa-color); border: 2px solid var(--card-bg);"></div>
          <div style="font-size:0.75rem; font-weight:700; color:var(--sa-color);">H-00${idx + 1} • 5단계 최종 활성 약재 (Active Herb Mapping)</div>
          <div style="font-size:1.05rem; font-weight:800; margin:4px 0; color:var(--sa-color);">
            ${(d["권장 식품 및 약재"] || "").split(',').map(h => {
              const clean = h.trim();
              if (!clean) return "";
              return `<span class="clickable-text" style="color:var(--sa-color); cursor:pointer; " onclick="showRndRowDetailByName('${clean.replace(/'/g, "\\\\'")}')" title="클릭 시 [${clean}] 약재 상세 정보 팝업">${clean}</span>`;
            }).filter(Boolean).join(', ')}
          </div>
          <div style="font-size:0.82rem; color:var(--text-muted); line-height:1.4;">추천 대표 요리: <strong style="color:var(--primary); cursor:pointer; " onclick="closeModal(); routeToRecipeWiki('${(d["대표 약선 요리"] || "").split(',')[0].replace(/'/g, "\\\\'")}')" title="클릭 시 요리 비법서 탭으로 이동 및 검색">${d["대표 약선 요리"]}</strong> (요리 효능: ${d["요리 효능"]})</div>
        </div>

      </div>

      <div style="background:rgba(212,175,55,0.05); border:1px solid rgba(212,175,55,0.2); border-radius:8px; padding:12px 15px; font-size:0.82rem; line-height:1.5; color:#ddd; margin-top:10px;">
        <strong style="color:var(--accent); display:block; margin-bottom:4px;"><i class="fa-solid fa-triangle-exclamation"></i> 복용 및 R&D 조리 시 주의 사항</strong>
        ${d["주의 사항"]}
      </div>
    </div>
  `;

  overlay.classList.add('open');
}

// ─── Modal & Detail View ──────────────────────────────────────────
function showRowDetail(row) {
  const overlay = document.getElementById('detail-modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  title.innerText = `🌿 ${row["식재료/약재"]} 상세 정보`;

  // 다운로드한 51종 본초학 데이터셋에서 원물 상세 매핑 시도
  const herbology = ingredientsHerbologyMap(row["식재료/약재"]);

  let herbologyHtml = '';
  if (herbology) {
    herbologyHtml = `
      <div class="modal-section" style="border-top:1px solid var(--border-glass); padding-top:15px; margin-top:15px;">
        <h4><i class="fa-solid fa-mortar-pestle"></i> [약선본초학] 전통 본초학 활용법 및 식재료 특징</h4>
        <p style="margin-bottom:8px;"><strong>성미 (성질과 맛):</strong> ${herbology["성미 (성질과 맛)"] || herbology["성미"] || "-"}</p>
        <p style="margin-bottom:8px;"><strong>한약명/이명:</strong> ${herbology["이명/한약명"] || "-"}</p>
        <p style="margin-bottom:8px;"><strong>약선 활용 및 추천 레시피:</strong> ${herbology["약선 배합 및 요리법"] || herbology["약선 배합 및 요리법"] || "-"}</p>
        <p style="margin-bottom:8px; color:var(--gun-color);"><strong>⚠️ 복용 시 주의사항:</strong> ${herbology["주의사항"] || "특이 독성 없음 (안전)"}</p>
        <p><strong>권장 섭취량 및 보관법:</strong> ${herbology["권장 섭취량/보관법"] || "-"}</p>
      </div>
    `;
  }

  // 일반인 모드에서는 기전 필드를 숨기거나 한글로 대접합니다.
  const isGeneral = (currentPersona === 'recipe');
  
  // 배열 데이터 정리
  const 생리배열 = [...new Set((row.생리작용목록 || []).filter(Boolean))];
  const 기전배열 = [...new Set((row.작용기전목록 || []).filter(Boolean))];
  const 생리List = 생리배열.join(', ') || "-";
  const 기전List = 기전배열.join(', ') || "-";
  const translated생리 = 생리배열.map(translateTerm).join(', ') || "-";

  const actionSectionHtml = isGeneral 
    ? `
      <div class="modal-section">
        <h4>현대의학적 신체 효과</h4>
        <p style="font-weight:600; color:var(--primary);">${translated생리}</p>
      </div>
    ` 
    : `
      <div class="modal-section">
        <h4>현대의학적 생리 작용 (Physiological Action)</h4>
        <p style="font-weight:600; color:var(--accent);">${생리List}</p>
      </div>
      <div class="modal-section">
        <h4>작용 기전 (Mechanism)</h4>
        <p>${기전List}</p>
      </div>
    `;

  const 효능Tags = (row.효능목록 || []).map(e => 
    `<span style="display:inline-block;background:rgba(255,255,255,0.08);border-radius:4px;padding:2px 8px;margin:2px;font-size:0.85rem;">${e}</span>`
  ).join('') || "-";

  const 기능Tags = (row.표준기능목록 || []).filter(Boolean).map(f => 
    `<span class="badge badge-synergy" style="font-size:0.85rem;margin:2px;">${f}</span>`
  ).join('') || "-";

  const 질환List = [...new Set((row.연결질환목록 || []).filter(Boolean))].join(', ') || "-";
  const 조리List = [...new Set((row.조리권장목록 || []).filter(Boolean))].join(' / ') || "일반 탕/식재료 조리 적합";

  body.innerHTML = `
    <div class="modal-section">
      <h4>식재료 분류명</h4>
      <p style="font-size:1.25rem; font-weight:700; color:var(--primary);">${row["식재료/약재"]}</p>
    </div>
    
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
      <div class="modal-section">
        <h4>원본 한방 효능</h4>
        <div style="margin-top:4px;">${효능Tags}</div>
      </div>
      <div class="modal-section">
        <h4>표준 조절 기능</h4>
        <div style="margin-top:4px;">${기능Tags}</div>
      </div>
    </div>

    ${actionSectionHtml}

    <div class="modal-section">
      <h4>주요 연결질환</h4>
      <p>${질환List}</p>
    </div>

    <div class="modal-section">
      <h4>조리 및 섭취 권장 사항</h4>
      <p style="color:var(--sa-color); font-weight:600;">🥣 ${조리List}</p>
    </div>

    ${herbologyHtml}
  `;

  overlay.classList.add('open');
}

function ingredientsHerbologyMap(name) {
  // 전역 로딩된 본초학 데이터배열에서 정확히 또는 포함 매치 시도
  if (!window.ingredientsHerbologyList) return null;
  return window.ingredientsHerbologyList.find(h => h.식재료명 === name || name.includes(h.식재료명) || h.식재료명.includes(name)) || 
         masterDb.find(h => h["식재료/약재"] === name);
}

function closeModal() {
  const modal = document.getElementById('detail-modal');
  if (modal) {
    modal.classList.remove('open');
    modal.style.display = '';
  }
}

// ─── 전체 플랫폼 교차 인터랙션 & 라우팅 헬퍼 함수 ───────────────────
function showRndRowDetailByName(name) {
  if (!name) return;
  const cleanName = name.replace(/[\(].*?[\)]/g, '').trim(); // 괄호 중량 제거
  
  // 마스터 DB에서 정확히 또는 포함으로 검색
  let row = masterDb.find(h => h["식재료/약재"] === cleanName || cleanName.includes(h["식재료/약재"]));
  if (!row) {
    // 부분 매칭 시도
    row = masterDb.find(h => h["식재료/약재"] && (h["식재료/약재"].includes(cleanName) || cleanName.includes(h["식재료/약재"])));
  }
  
  if (row) {
    showRowDetail(row);
  } else {
    // 본초학 데이터에서만 찾은 경우 가상 행 조립하여 보여주기
    const herbology = window.ingredientsHerbologyList && window.ingredientsHerbologyList.find(h => h.식재료명 === cleanName || cleanName.includes(h.식재료명));
    if (herbology) {
      const mockRow = {
        "식재료/약재": herbology.식재료명,
        "효능목록": [herbology["주요 효능"] || "정보 준비중"],
        "표준기능목록": ["기타조율"],
        "생리작용목록": ["정보 준비중"],
        "작용기전목록": ["정보 준비중"],
        "연결질환목록": ["만성피로"],
        "조리권장목록": [herbology["약선 배합 및 요리법"] || "탕제 권장"]
      };
      showRowDetail(mockRow);
    } else {
      console.warn(`[showRndRowDetailByName] "${cleanName}" 식재료 데이터를 DB에서 찾을 수 없습니다.`);
      alert(`"${cleanName}"에 대한 상세 약리/기전 DB 정보가 준비 중입니다.`);
    }
  }
}

function routeToAxis(axis) {
  if (!axis) return;
  // 표준기능 & 7축 분류 탭으로 전환
  switchTab('tab-index');
  // 전역 상태 갱신 및 렌더링
  activeAxis = axis;
  
  // 버튼 active 상태 강제 조절
  document.querySelectorAll('.axis-nav-btn').forEach(btn => {
    if (btn.innerText.includes(axis)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  renderAxisDetail();
  
  // 스크롤 상단으로 이동
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function routeToBrowserWithFilter(stdFunc) {
  if (!stdFunc) return;
  // 마스터 DB 브라우저 탭으로 전환
  switchTab('tab-browser');
  
  // 필터 셀렉트박스 설정
  const filterSelect = document.getElementById('filter-standard-func');
  if (filterSelect) {
    // 해당 옵션이 있는지 체크하고 없으면 동적으로 하나 임시 생성
    let hasOption = false;
    for (let i = 0; i < filterSelect.options.length; i++) {
      if (filterSelect.options[i].value === stdFunc) {
        filterSelect.selectedIndex = i;
        hasOption = true;
        break;
      }
    }
    if (!hasOption) {
      const opt = document.createElement('option');
      opt.value = stdFunc;
      opt.innerText = stdFunc;
      filterSelect.appendChild(opt);
      filterSelect.value = stdFunc;
    }
  }
  
  // 검색창 비우고 검색 핸들러 트리거
  const searchInput = document.getElementById('browser-search-input');
  if (searchInput) searchInput.value = '';
  
  handleSearch();
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function routeToRecipeWiki(foodName) {
  if (!foodName) return;
  // 단어 뒤의 괄호나 조사 정리
  const cleanFood = foodName.split('(')[0].replace(/등$/, '').trim();
  
  // 약선 요리 비법서 탭으로 전환
  switchTab('tab-recipes-wiki');
  
  // 카테고리 필터 '전체 요리'로 초기화
  const allBtn = document.querySelector(".wiki-category-filter-bar button");
  filterRecipesByCategory('ALL', allBtn);
  
  // 검색창 값 채우기
  const searchInput = document.getElementById('recipe-wiki-search');
  if (searchInput) {
    searchInput.value = cleanFood;
  }
  
  filterRecipesWiki();
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function routeToPrescribeeWithSeason(season) {
  if (!season) return;
  // AI 약선 처방실 탭으로 전환
  switchTab('tab-query');
  
  // 절기 선택
  const seasonSelect = document.getElementById('season-select');
  if (seasonSelect) {
    for (let i = 0; i < seasonSelect.options.length; i++) {
      if (seasonSelect.options[i].value === season || seasonSelect.options[i].text.includes(season)) {
        seasonSelect.selectedIndex = i;
        break;
      }
    }
  }
  
  logConsole(`[System] 전통 문화원 연동 활성화: 절기 조건이 [${season}] 절기로 동기화 설정되었습니다. 증상을 선택해 레시피를 창안해보세요.`);
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── 매핑 프로세스 뷰어 병증 추적 모드 제어 함수 ──────────────────
function selectFlowDisease(idx) {
  clickFlowCard(idx, 1);
}

function clickFlowCard(idx, stepNum) {
  const d = diseasesDb[idx];
  if (!d) return;

  activeDiseaseIndex = idx;

  // 추적 바 노출 및 레이블 세팅
  const trackerBar = document.getElementById('flow-tracker-bar');
  const nameEl = document.getElementById('flow-tracked-disease-name');
  if (trackerBar && nameEl) {
    nameEl.innerText = d["병증"];
    trackerBar.style.display = 'flex';
  }

  if (stepNum === 5) {
    showFlowMappingDetail(idx);
    selectFlowStep(5);
  } else {
    selectFlowStep(stepNum + 1);
  }

  console.log(`[Flow Tracker] 병증 추적 전환 및 단계 이동: ${d["병증"]} (순번: ${idx}, 단계: ${stepNum} -> ${stepNum === 5 ? 5 : stepNum + 1})`);
}

function viewCurrentFlowDetail() {
  if (activeDiseaseIndex === null) {
    alert("먼저 추적할 신체상태 병증 카드를 클릭하세요.");
    return;
  }
  showFlowMappingDetail(activeDiseaseIndex);
}

function clearFlowTracking() {
  activeDiseaseIndex = null;

  // 추적 바 숨김
  const trackerBar = document.getElementById('flow-tracker-bar');
  if (trackerBar) {
    trackerBar.style.display = 'none';
  }

  // 뷰 리프레시
  selectFlowStep(activeFlowStep);

  console.log(`[Flow Tracker] 병증 추적 모드 해제. 전체 모드 복귀.`);
}

// ─── Tab 7: 약선 요리 비법서 렌더링 (일반인 & 요리연구가 공용) ───
function initRecipesWiki() {
  renderRecipesWiki();
}

function renderRecipesWiki(query = '') {
  const container = document.getElementById('recipes-wiki-container');
  if (!container) return;
  container.innerHTML = '';
  
  const filtered = recipesDb.filter(r => {
    const matchQuery = 
      (r.요리명 || "").toLowerCase().includes(query) ||
      (r.주재료 || "").toLowerCase().includes(query) ||
      (r.주요효능 || r.주요_효능 || "").toLowerCase().includes(query);
      
    const matchCategory = currentWikiCategory === "ALL" || r.category === currentWikiCategory;
    
    return matchQuery && matchCategory;
  });
  
  if (filtered.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:var(--text-muted); padding:40px;">조회된 약선 레시피가 없습니다.</p>`;
    return;
  }
  
  filtered.forEach(r => {
    const card = document.createElement('div');
    card.className = 'glass-panel recipe-wiki-card';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.justifyContent = 'space-between';
    
    // 요리연구가 모드일 때 '기미 및 귀경' 상세 데이터 및 R&D 시뮬레이터 연동 불러오기 단추 추가
    let proSection = '';
    if (currentPersona === 'workspace') {
      const gimi = r["기미 및 귀경"] || r["기미"] || "정보 준비중";
      const escapedName = r.요리명.replace(/'/g, "\\'");
      proSection = `
        <div class="recipe-pro-badge-section" style="margin-top:12px; padding-top:12px; border-top:1px dashed var(--border-glass);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <small style="color:var(--primary); font-weight:700;"><i class="fa-solid fa-yin-yang"></i> [요리연구가 R&D] 기미 및 귀경</small>
            <button class="btn btn-accent btn-xsmall" onclick="loadRecipeToRnd('${escapedName}')">
              <i class="fa-solid fa-flask-vial"></i> R&D 설계기로 가져가기
            </button>
          </div>
          <p style="font-size:0.78rem; color:var(--text-main); margin-top:2px;">${gimi}</p>
        </div>
      `;
    }
    
    const citationBadge = r.ancient_citation 
      ? `<span class="badge badge-citation" style="font-size:0.65rem; background:rgba(245, 158, 11, 0.15); color:var(--sa-color); border:1px solid rgba(245, 158, 11, 0.3); margin-left: 6px;" title="${r.ancient_context || ''}"><i class="fa-solid fa-scroll"></i> ${r.ancient_citation}</span>` 
      : '';
      
    let contextHtml = '';
    if (r.ancient_context) {
      contextHtml = `
        <div style="font-size:0.75rem; color:var(--text-secondary); background:rgba(245, 158, 11, 0.03); border-left: 2px solid var(--sa-color); padding: 6px 10px; border-radius: 0 6px 6px 0; margin-bottom: 12px; font-style: italic;">
          <strong>전통 문헌 고증:</strong> ${r.ancient_context}
        </div>
      `;
    }

    card.innerHTML = `
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <h3 style="margin:0; font-size:1.15rem; color:var(--primary); font-family:'Outfit',sans-serif;">${r.요리명}</h3>
          <div>
            <span class="badge badge-synergy" style="font-size:0.65rem;">보양 메뉴</span>
            ${citationBadge}
          </div>
        </div>
        <p style="font-size:0.82rem; line-height:1.5; margin-bottom:12px; color:var(--text-main);">${r.주요효능 || r.주요_효능 || ""}</p>
        ${contextHtml}
        
        <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:6px;">
          <strong>주재료:</strong> <span style="color:var(--text-main);">${r.주재료}</span>
        </div>
        <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:12px;">
          <strong>부재료 및 한약재:</strong> <span style="color:var(--text-main);">${r["부재료 및 약재"] || r["부재료"] || "-"}</span>
        </div>
      </div>
      
      <div>
        <div class="recipe-cooking-summary" style="background:rgba(0,0,0,0.18); padding:10px; border-radius:8px; border: 1px solid var(--border-glass);">
          <small style="font-weight:700; color:var(--sa-color); display:block; margin-bottom:4px;"><i class="fa-solid fa-kitchen-set"></i> 전통 조리 시퀀스</small>
          <p style="font-size:0.75rem; line-height:1.4; color:var(--text-main);">${r["조리 방법 요약"] || r["조리방법"] || ""}</p>
        </div>
        ${proSection}
      </div>
    `;
    container.appendChild(card);
  });
}

function filterRecipesWiki() {
  const query = document.getElementById('recipe-wiki-search').value.toLowerCase();
  renderRecipesWiki(query);
}

function filterRecipesByCategory(category, btn) {
  currentWikiCategory = category;
  
  // 버튼 active 클래스 제어
  document.querySelectorAll('.wiki-category-filter-bar button').forEach(b => {
    b.classList.remove('active');
  });
  if (btn) btn.classList.add('active');
  
  const query = document.getElementById('recipe-wiki-search').value.toLowerCase();
  renderRecipesWiki(query);
}

// ─── Tab 8: 약선 문화원 (명절 & 24절기 아카이브) ───
function initCultureWiki() {
  // 1. 24절기 양생 가이드 렌더링
  const seasonsContainer = document.getElementById('culture-seasons-container');
  if (seasonsContainer) {
    seasonsContainer.innerHTML = '';
    if (seasonalDb.length === 0) {
      seasonsContainer.innerHTML = `<p style="color:var(--text-muted); font-size:0.85rem;">절기 정보가 준비 중입니다.</p>`;
    } else {
      seasonalDb.forEach(s => {
        // 음식명을 콤마 단위로 분할하여 링크 스팬으로 조립
        const foodList = (s["제철 음식 및 약선 요리"] || "").split(',').map(f => {
          const clean = f.trim();
          if (!clean) return "";
          return `<span class="culture-food-link" onclick="event.stopPropagation(); routeToRecipeWiki('${clean.replace(/'/g, "\\\\'")}')" title="요리 비법서에서 [${clean}] 검색">${clean}</span>`;
        }).filter(Boolean).join(', ');

        seasonsContainer.innerHTML += `
          <div class="culture-item-box" style="background:rgba(255,255,255,0.01); border:1px solid var(--border-glass); border-radius:10px; padding:15px; margin-bottom:12px; cursor:pointer;" onclick="routeToPrescribeeWithSeason('${s.절기}')" title="클릭 시 AI 처방실 절기 [${s.절기}] 조건 동기화 및 이동">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <strong style="color:var(--primary); font-size:1.05rem;">🍂 ${s.절기}</strong>
              <small style="color:var(--text-muted);">${s["기후 및 자연 현상"] || ""}</small>
            </div>
            <p style="font-size:0.8rem; line-height:1.5; color:var(--text-main); margin-bottom:6px;"><strong>제철 보양 음식:</strong> ${foodList || "-"}</p>
            <p style="font-size:0.78rem; line-height:1.5; color:var(--text-muted);"><strong>양생(養生) 건강수칙:</strong> ${s["계절별 양생법 (건강 관리)"]}</p>
          </div>
        `;
      });
    }
  }

  // 2. 전통 세시 명절 렌더링
  const holidaysContainer = document.getElementById('culture-holidays-container');
  if (holidaysContainer) {
    holidaysContainer.innerHTML = '';
    if (holidaysDb.length === 0) {
      holidaysContainer.innerHTML = `<p style="color:var(--text-muted); font-size:0.85rem;">명절 정보가 준비 중입니다.</p>`;
    } else {
      holidaysDb.forEach(h => {
        // 음식명을 콤마 단위로 분할하여 링크 스팬으로 조립
        const holidayFoodList = (h["대표 음식"] || "").split(',').map(f => {
          const clean = f.trim();
          if (!clean) return "";
          return `<span class="culture-food-link" onclick="event.stopPropagation(); routeToRecipeWiki('${clean.replace(/'/g, "\\\\'")}')" title="요리 비법서에서 [${clean}] 검색">${clean}</span>`;
        }).filter(Boolean).join(', ');

        holidaysContainer.innerHTML += `
          <div class="culture-item-box" style="background:rgba(255,255,255,0.01); border:1px solid var(--border-glass); border-radius:10px; padding:15px; margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <strong style="color:var(--sa-color); font-size:1.05rem;">🏮 ${h["명절 이름"]} (${h["날짜 (음력)"]})</strong>
              <small style="color:var(--text-muted);">${h["관련 속담 및 설화"] ? h["관련 속담 및 설화"].split(',')[0] : ""}</small>
            </div>
            <p style="font-size:0.8rem; line-height:1.5; color:var(--text-main); margin-bottom:6px;"><strong>대표 세시 절식:</strong> ${holidayFoodList || "-"}</p>
            <p style="font-size:0.78rem; line-height:1.5; color:var(--text-muted);"><strong>명절 풍속:</strong> ${h["민속 놀이 및 풍습"]}</p>
          </div>
        `;
      });
    }
  }
}

// ─── Tab 2: Export 배합 데이터 내보내기 ──────────────────────────────────
function exportFormula(format) {
  if (!lastInferenceResult) {
    alert("먼저 맞춤 레시피를 생성(추론)해주세요.");
    return;
  }
  
  let text = "";
  if (format === 'json') {
    text = JSON.stringify(lastInferenceResult, null, 2);
  } else {
    // CSV
    text = "\ufeff역할,원재료명,배합비율,중량,성미,효능기전,조리권장\n";
    lastInferenceResult.composition.forEach(i => {
      text += `"${i.role}","${i.name}","${i.ratio}","${i.weight}","${i.nature_taste}","${i.efficacy}","${i.cooking_recommendation}"\n`;
    });
  }
  
  navigator.clipboard.writeText(text).then(() => {
    alert(`성공: 배합 데이터가 ${format.toUpperCase()} 형태로 클립보드에 안전하게 복사되었습니다.`);
  }).catch(err => {
    console.error("클립보드 복사 에러:", err);
    alert("복사에 실패했습니다. 권한을 확인해주세요.");
  });
}

// ─── Tab 3: Export 조회 데이터 테이블 내보내기 ──────────────────────────────────
function exportBrowserTable() {
  if (filteredMasterDb.length === 0) {
    alert("내보낼 조회 데이터가 존재하지 않습니다.");
    return;
  }
  
  let csvContent = "\ufeff식재료/약재,원본효능,표준기능,생리작용,작용기전,연결질환,조리권장\n";
  filteredMasterDb.forEach(row => {
    const 효능 = (row.효능목록 || []).join(' | ');
    const 기능 = (row.표준기능목록 || []).filter(Boolean).join(' | ');
    const 생리 = (row.생리작용목록 || []).filter(Boolean).join(' | ');
    const 기전 = (row.작용기전목록 || []).filter(Boolean).join(' | ');
    const 질환 = [...new Set((row.연결질환목록 || []).filter(Boolean))].join(' | ');
    const 조리 = [...new Set((row.조리권장목록 || []).filter(Boolean))].join(' | ');

    csvContent += `"${row["식재료/약재"] || ""}","${효능}","${기능}","${생리}","${기전}","${질환}","${조리}"\n`;
  });
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "nuri_lab_database_export.csv");
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ─── Tab 7: 약선 신메뉴 R&D 설계기 (Yakseon Blender & Simulator) ───
let rndIngredients = []; // { name, role, weight, cost }
let batchMultiplier = 1;

// R&D 식재료 검색 자동완성
function handleRndSearch() {
  const query = document.getElementById('rnd-search-input').value.toLowerCase().trim();
  const dropdown = document.getElementById('rnd-search-results');
  
  if (!query) {
    dropdown.style.display = 'none';
    return;
  }

  // 마스터 DB에서 중복 없이 고유 식재료 매칭 (최대 8개)
  const results = [];
  const seen = new Set();
  
  for (const row of masterDb) {
    const name = row["식재료/약재"];
    if (name && name.toLowerCase().includes(query) && !seen.has(name)) {
      seen.add(name);
      results.push({
        name: name,
        func: (row.표준기능목록 || [])[0] || (row.효능목록 || [])[0] || "한방 원료"
      });
      if (results.length >= 8) break;
    }
  }

  if (results.length === 0) {
    dropdown.innerHTML = `<div class="search-dropdown-item" style="color:var(--text-muted);">검색 결과가 없습니다.</div>`;
  } else {
    dropdown.innerHTML = results.map(item => `
      <div class="search-dropdown-item" onclick="selectRndSearchItem('${item.name.replace(/'/g, "\\'")}')">
        <span>🌿 <strong>${item.name}</strong></span>
        <span class="item-func">${item.func}</span>
      </div>
    `).join('');
  }
  dropdown.style.display = 'block';
}

function selectRndSearchItem(name) {
  document.getElementById('rnd-search-input').value = '';
  document.getElementById('rnd-search-results').style.display = 'none';
  
  addIngredientToRnd(name);
}

function addIngredientToRnd(name, role = "군약(君藥)", weight = 20, cost = 15) {
  // 중복 체크
  if (rndIngredients.some(i => i.name === name)) {
    alert(`"${name}"은(는) 이미 배합표에 추가되어 있습니다.`);
    return;
  }

  rndIngredients.push({
    name: name,
    role: role,
    weight: parseFloat(weight) || 20,
    cost: parseFloat(cost) || 15
  });

  updateRndAnalysis();
}

function removeRndIngredient(index) {
  rndIngredients.splice(index, 1);
  updateRndAnalysis();
}

function clearRndFormula() {
  if (confirm("현재 배합표의 모든 식재료를 삭제하시겠습니까?")) {
    rndIngredients = [];
    updateRndAnalysis();
  }
}

function changeRndScale(scale) {
  batchMultiplier = scale;
  
  // 버튼 active 상태 갱신
  document.querySelectorAll('.batch-scale-wrapper button').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.getElementById(`btn-scale-${scale}`);
  if (activeBtn) activeBtn.classList.add('active');

  renderRndIngredientsTable();
  updateRndCost();
}

// 원료 배합 리스트 테이블 렌더링
function renderRndIngredientsTable() {
  const tbody = document.getElementById('rnd-ingredients-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const weightHeader = document.getElementById('rnd-weight-header');
  if (weightHeader) {
    weightHeader.innerText = batchMultiplier > 1 ? `배합 중량 (총 ${batchMultiplier}인분)` : "배합 중량 (1인분)";
  }

  const formatSelect = document.getElementById('rnd-serving-format');
  const isMultiDish = formatSelect && formatSelect.value !== 'single';

  if (rndIngredients.length === 0) {
    const emptyMsg = isMultiDish
      ? "배합된 원료가 없습니다. 하단의 식단 플래너에서 개별 요리를 배치해주세요."
      : "배합된 원료가 없습니다. 상단의 검색창에서 식재료를 검색하여 추가하세요.";
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:30px;">${emptyMsg}</td></tr>`;
    return;
  }

  const selectDisabled = isMultiDish ? "disabled" : "";
  const inputReadonly = isMultiDish ? "readonly style='background:rgba(255,255,255,0.01); color:var(--text-muted); cursor:not-allowed; border-color:transparent;'" : "";

  rndIngredients.forEach((item, index) => {
    const scaledWeight = (item.weight * batchMultiplier).toFixed(1);
    const tr = document.createElement('tr');
    
    const removeBtnHtml = isMultiDish
      ? `<button class="rnd-row-remove" style="color:var(--text-muted); cursor:not-allowed;" title="식단 플래너에 의해 자동 합산 및 잠금됨" disabled><i class="fa-solid fa-lock"></i></button>`
      : `<button class="rnd-row-remove" onclick="removeRndIngredient(${index})"><i class="fa-solid fa-trash-can"></i></button>`;

    tr.innerHTML = `
      <td style="font-weight:700; color:var(--primary); cursor:pointer; " onclick="showRndRowDetailByName('${item.name.replace(/'/g, "\\\\'")}')" class="clickable-text" title="클릭 시 약재 상세 정보 팝업">${item.name}</td>
      <td>
        <select ${selectDisabled} onchange="updateRndIngredientProperty(${index}, 'role', this.value)" style="width:100%;">
          <option value="군약(君藥)" ${item.role === "군약(君藥)" ? "selected" : ""}>군약 [주식/메인주재료] (Chief)</option>
          <option value="신약(臣藥)" ${item.role === "신약(臣藥)" ? "selected" : ""}>신약 [보조부식/주부재료] (Minister)</option>
          <option value="좌약(佐藥)" ${item.role === "좌약(佐藥)" ? "selected" : ""}>좌약 [약성보강/한약재] (Assistant)</option>
          <option value="사약(使藥)" ${item.role === "사약(使藥)" ? "selected" : ""}>사약 [조미료/향료/양념] (Envoy)</option>
        </select>
      </td>
      <td>
        <div style="display:flex; align-items:center; gap:5px;">
          <input type="number" ${inputReadonly} value="${(item.weight * batchMultiplier).toFixed(0)}" min="1" max="1000000" onchange="updateRndIngredientProperty(${index}, 'weight', this.value / batchMultiplier)" style="width:70px;">
          <span style="font-size:0.8rem; color:var(--text-muted);">g</span>
        </div>
      </td>
      <td>
        <input type="number" ${inputReadonly} value="${item.cost}" min="0" max="10000" onchange="updateRndIngredientProperty(${index}, 'cost', this.value)" style="width:80px;"> 원
      </td>
      <td style="text-align:center;">
        ${removeBtnHtml}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function updateRndIngredientProperty(index, prop, value) {
  if (rndIngredients[index]) {
    if (prop === 'weight' || prop === 'cost') {
      rndIngredients[index][prop] = parseFloat(value) || 0;
    } else {
      rndIngredients[index][prop] = value;
    }
    updateRndAnalysis();
  }
}

// 괄호 바깥의 콤마를 기준으로 스플릿하는 유틸리티 함수
function splitByCommaOutsideParens(str) {
  if (!str) return [];
  const result = [];
  let current = "";
  let depth = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '(' || char === '[' || char === '{') {
      depth++;
      current += char;
    } else if (char === ')' || char === ']' || char === '}') {
      depth = Math.max(0, depth - 1);
      current += char;
    } else if (char === ',' && depth === 0) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  if (current.trim()) {
    result.push(current.trim());
  }
  return result;
}

// 16종 레시피를 파싱하여 R&D 시뮬레이터에 로드
function loadRecipeToRnd(recipeName) {
  const recipe = recipesDb.find(r => r.요리명 === recipeName);
  if (!recipe) {
    alert("레시피 데이터를 찾을 수 없습니다.");
    return;
  }

  // 초기화
  rndIngredients = [];
  batchMultiplier = 1;
  document.querySelectorAll('.batch-scale-wrapper button').forEach(btn => btn.classList.remove('active'));
  document.getElementById('btn-scale-1').classList.add('active');

  // 재료를 배합표에 안전하게 추가하는 보조 함수
  function tryAddIngredient(rawName, role, weight, cost) {
    const name = rawName.trim();
    if (!name) return;

    // 만약 마스터 DB에 있는 식재료명이면 바로 추가
    const existsInDb = masterDb.some(r => r["식재료/약재"] === name);
    if (existsInDb) {
      rndIngredients.push({ name, role, weight, cost });
      return;
    }

    // 마스터 DB에 없는데 복합 한약재 괄호식 형태인 경우 (예: "사군자탕(백출, 감초, 복령, 인삼)")
    const subMatch = name.match(/^([^\(]+)\(([^)]+)\)/);
    if (subMatch) {
      const parentName = subMatch[1].trim();
      const childText = subMatch[2];
      
      // 만약 부모 이름 자체가 마스터 DB에 등록되어 있으면 부모 이름으로 추가
      if (masterDb.some(r => r["식재료/약재"] === parentName)) {
        rndIngredients.push({ name: parentName, role, weight, cost });
        return;
      }

      // 그렇지 않다면 괄호 안의 하위 재료들을 콤마로 스플릿해서 개별 추가 시도
      const children = childText.split(',').map(c => c.trim()).filter(Boolean);
      let addedAny = false;
      children.forEach(child => {
        // 하위 재료에 숫자/중량이 표기되어 있을 수 있음
        const childMatch = child.match(/^([^\s\(\d]+)(?:\s*\(?(\d+)g\)?)?/);
        if (childMatch) {
          const cName = childMatch[1].trim();
          const cWeight = childMatch[2] ? parseFloat(childMatch[2]) : Math.round(weight / children.length);
          if (masterDb.some(r => r["식재료/약재"] === cName)) {
            rndIngredients.push({ name: cName, role, weight: cWeight, cost });
            addedAny = true;
          }
        }
      });

      if (addedAny) return;
    }

    // 최종 매칭이 없어도 일단 추가
    rndIngredients.push({ name, role, weight, cost });
  }

  // 1. 주재료 파싱
  if (recipe.주재료) {
    const rawMain = splitByCommaOutsideParens(recipe.주재료);
    rawMain.forEach(m => {
      const match = m.match(/^([^\(]+)(?:\(([^)]+)\))?/);
      if (match) {
        const rawName = match[1].trim();
        const weightStr = match[2] || "";
        let weight = 50; // 기본값
        const numMatch = weightStr.match(/(\d+)/);
        if (numMatch) weight = parseFloat(numMatch[1]);
        
        tryAddIngredient(rawName, "군약(君藥)", weight, 12);
      }
    });
  }

  // 2. 부재료 및 약재 파싱
  if (recipe["부재료 및 약재"] || recipe["부재료"]) {
    const subText = recipe["부재료 및 약재"] || recipe["부재료"];
    const rawSub = splitByCommaOutsideParens(subText);
    rawSub.forEach((s, idx) => {
      const match = s.match(/^([^\(]+)(?:\(([^)]+)\))?/);
      if (match) {
        const rawName = match[1].trim();
        const weightStr = match[2] || "";
        let weight = 20; // 기본값
        const numMatch = weightStr.match(/(\d+)/);
        if (numMatch) weight = parseFloat(numMatch[1]);

        let role = "신약(臣藥)";
        if (idx === 0) role = "신약(臣藥)";
        else if (idx <= 2) role = "좌약(佐藥)";
        else role = "사약(使藥)";

        tryAddIngredient(rawName, role, weight, 18);
      }
    });
  }

  // 중복 식재료 정리 (동일 재료 병합)
  const merged = [];
  const seen = {};
  rndIngredients.forEach(item => {
    if (seen[item.name]) {
      seen[item.name].weight += item.weight;
    } else {
      seen[item.name] = item;
      merged.push(item);
    }
  });
  rndIngredients = merged;

  // 요리 종류 자동 선택 연동
  const dishCategory = getGranularCategory(recipe);
  const selectEl = document.getElementById('rnd-dish-category');
  if (selectEl) {
    selectEl.value = dishCategory;
  }

  // 탭 전환 및 강제 업데이트
  switchTab('tab-recipes-rnd');
  updateRndAnalysis();
  logConsole(`📂 약선 레시피 [${recipeName}] 데이터 고도화 파싱 완료. 동일 원재료 자동 병합 및 탕제(복합 방제) 내역 개별 약재로 해체/추출 완료.`);
}

// ─── 식사 구성 R&D 식단 플래너 데이터 및 제어 로직 ────────────────────────────────
const plannerSlotConfigs = {
  "bansang_5": {
    title: "5첩 반상 차림 구성 R&D 플래너",
    groups: [
      {
        name: "기본 구성 (밥, 국, 찌개)",
        slots: [
          { id: "slot-rice", label: "진지 (밥류)", category: "주식" },
          { id: "slot-soup", label: "갱 (탕/국류)", category: "국물" },
          { id: "slot-stew", label: "조치 (찌개류)", category: "국물" }
        ]
      },
      {
        name: "5첩 찬류 (Side Dishes)",
        slots: [
          { id: "slot-side1", label: "찬 1 (나물류)", category: "반찬" },
          { id: "slot-side2", label: "찬 2 (조림류)", category: "반찬" },
          { id: "slot-side3", label: "찬 3 (무침류)", category: "반찬" },
          { id: "slot-side4", label: "찬 4 (전/부침류)", category: "부식" },
          { id: "slot-side5", label: "찬 5 (마른반찬/생채)", category: "반찬" }
        ]
      },
      {
        name: "양념 및 후식 (Condiments & Dessert)",
        slots: [
          { id: "slot-sauce", label: "양념/후식 (종가양념/음청)", category: "양념" }
        ]
      }
    ]
  },
  "bansang_7": {
    title: "7첩 반상 차림 구성 R&D 플래너",
    groups: [
      {
        name: "기본 구성 (밥, 국, 찌개, 찜)",
        slots: [
          { id: "slot-rice", label: "진지 (밥류)", category: "주식" },
          { id: "slot-soup", label: "갱 (탕/국류)", category: "국물" },
          { id: "slot-stew", label: "조치 (찌개류)", category: "국물" },
          { id: "slot-steamed", label: "찜/선 요리", category: "부식" }
        ]
      },
      {
        name: "7첩 찬류 (Side Dishes)",
        slots: [
          { id: "slot-side1", label: "찬 1 (나물류)", category: "반찬" },
          { id: "slot-side2", label: "찬 2 (조림류)", category: "반찬" },
          { id: "slot-side3", label: "찬 3 (무침류)", category: "반찬" },
          { id: "slot-side4", label: "찬 4 (생채류)", category: "반찬" },
          { id: "slot-side5", label: "찬 5 (전/부침류)", category: "부식" },
          { id: "slot-side6", label: "찬 6 (구이/튀김류)", category: "부식" },
          { id: "slot-side7", label: "찬 7 (장아찌류)", category: "반찬" }
        ]
      },
      {
        name: "양념 및 후식 (Condiments & Dessert)",
        slots: [
          { id: "slot-sauce", label: "양념/후식 (종가양념/음청)", category: "양념" }
        ]
      }
    ]
  },
  "bansang_10": {
    title: "10첩 반상 차림 구성 R&D 플래너",
    groups: [
      {
        name: "기본 구성 (밥, 국, 찌개, 찜, 전골)",
        slots: [
          { id: "slot-rice", label: "진지 (밥류)", category: "주식" },
          { id: "slot-soup", label: "갱 (탕/국류)", category: "국물" },
          { id: "slot-stew", label: "조치 (찌개류)", category: "국물" },
          { id: "slot-steamed", label: "찜 요리", category: "부식" },
          { id: "slot-hotpot", label: "전골 요리", category: "국물" }
        ]
      },
      {
        name: "10첩 찬류 (Side Dishes)",
        slots: [
          { id: "slot-side1", label: "찬 1 (나물류)", category: "반찬" },
          { id: "slot-side2", label: "찬 2 (생채류)", category: "반찬" },
          { id: "slot-side3", label: "찬 3 (조림류)", category: "반찬" },
          { id: "slot-side4", label: "찬 4 (구이류)", category: "부식" },
          { id: "slot-side5", label: "찬 5 (전/부침)", category: "부식" },
          { id: "slot-side6", label: "찬 6 (튀김류)", category: "부식" },
          { id: "slot-side7", label: "찬 7 (편육/회)", category: "부식" },
          { id: "slot-side8", label: "찬 8 (장아찌류)", category: "반찬" },
          { id: "slot-side9", label: "찬 9 (젓갈류)", category: "반찬" },
          { id: "slot-side10", label: "찬 10 (마른반찬)", category: "반찬" }
        ]
      },
      {
        name: "양념 및 후식 (Condiments & Dessert)",
        slots: [
          { id: "slot-sauce", label: "양념/후식 (종가양념/음청)", category: "양념" }
        ]
      }
    ]
  },
  "bansang_15": {
    title: "15첩 대형 반상 구성 R&D 플래너",
    groups: [
      {
        name: "기본 구성 (밥, 국, 찌개 2종, 찜, 전골)",
        slots: [
          { id: "slot-rice", label: "진지 (밥류)", category: "주식" },
          { id: "slot-soup", label: "갱 (탕/국류)", category: "국물" },
          { id: "slot-stew1", label: "토장조치 (찌개)", category: "국물" },
          { id: "slot-stew2", label: "맑은조치 (찌개)", category: "국물" },
          { id: "slot-steamed", label: "찜 요리", category: "부식" },
          { id: "slot-hotpot", label: "전골 요리", category: "국물" }
        ]
      },
      {
        name: "15첩 찬류 (Side Dishes)",
        slots: Array.from({ length: 15 }, (_, i) => ({
          id: `slot-side${i+1}`,
          label: `찬 ${i+1} (${i % 3 === 0 ? '나물/무침' : i % 3 === 1 ? '전/부침' : '생채/장아찌'})`,
          category: i % 3 === 1 ? "부식" : "반찬"
        }))
      },
      {
        name: "양념 및 후식 (Condiments & Dessert)",
        slots: [
          { id: "slot-sauce", label: "양념/후식 (종가양념/음청)", category: "양념" }
        ]
      }
    ]
  },
  "bansang_20": {
    title: "20첩 명품 수라상 구성 R&D 플래너",
    groups: [
      {
        name: "기본 구성 (수라 2종, 국 2종, 찌개 2종, 찜, 전골)",
        slots: [
          { id: "slot-rice1", label: "흰수라 (쌀밥)", category: "주식" },
          { id: "slot-rice2", label: "홍반 (팥밥)", category: "주식" },
          { id: "slot-soup1", label: "갱 (미역국)", category: "국물" },
          { id: "slot-soup2", label: "곰탕 (고기탕)", category: "국물" },
          { id: "slot-stew1", label: "토장조치", category: "국물" },
          { id: "slot-stew2", label: "젓국조치", category: "국물" },
          { id: "slot-steamed", label: "찜 요리", category: "부식" },
          { id: "slot-hotpot", label: "전골 요리", category: "국물" }
        ]
      },
      {
        name: "20첩 찬류 (Side Dishes)",
        slots: Array.from({ length: 20 }, (_, i) => ({
          id: `slot-side${i+1}`,
          label: `찬 ${i+1} (${i % 3 === 0 ? '나물/조림' : i % 3 === 1 ? '전/구이' : '장아찌/생채'})`,
          category: i % 3 === 1 ? "부식" : "반찬"
        }))
      },
      {
        name: "양념 및 후식 (Condiments & Dessert)",
        slots: [
          { id: "slot-sauce", label: "양념/후식 (종가양념/음청)", category: "양념" }
        ]
      }
    ]
  },
  "course_hanjeong": {
    title: "한정식 코스 요리 R&D 플래너 (3단계 식사 흐름)",
    groups: [
      {
        name: "1단계: 식전 코스 (Pre-Meal Appetizers & Drinks)",
        slots: [
          { id: "slot-pre-porridge", label: "식전 죽/미음", category: "주식" },
          { id: "slot-pre-salad", label: "식전 샐러드/생채", category: "반찬" },
          { id: "slot-pre-drink", label: "식전 기능주/차류", category: "양념" }
        ]
      },
      {
        name: "2단계: 메인 식사 (Main Meal Courses)",
        slots: [
          { id: "slot-main-dish", label: "메인 보양 요리", category: "국물" },
          { id: "slot-main-rice", label: "약선 진지(밥/죽)", category: "주식" },
          { id: "slot-main-soup", label: "찌개/국류", category: "국물" },
          { id: "slot-main-sides", label: "주요 반찬류(전/조림)", category: "부식" }
        ]
      },
      {
        name: "3단계: 식후 코스 (Post-Meal Refreshers & Teas)",
        slots: [
          { id: "slot-post-mouth", label: "식후 입가심(숭늉/홍화차)", category: "양념" },
          { id: "slot-post-tea", label: "꽃차 및 허브류 차", category: "양념" },
          { id: "slot-post-dessert", label: "전통 디저트/정과류", category: "양념" }
        ]
      }
    ]
  }
};

// R&D 식사 구성 형태 변경 이벤트 핸들러
function handleServingFormatChange() {
  const selectEl = document.getElementById('rnd-serving-format');
  const format = selectEl ? selectEl.value : 'single';
  
  const searchWrap = document.getElementById('rnd-search-box-wrap');
  const plannerPanel = document.getElementById('rnd-multi-dish-planner');
  const catWrap = document.querySelector('.rnd-dish-category-wrap');
  
  if (format === 'single') {
    if (searchWrap) searchWrap.style.display = 'block';
    if (plannerPanel) plannerPanel.style.display = 'none';
    if (catWrap) catWrap.style.display = 'block';
    
    // 단품 모드 전환 시 기존 배합 초기화
    clearRndFormula();
  } else {
    if (searchWrap) searchWrap.style.display = 'none';
    if (plannerPanel) plannerPanel.style.display = 'block';
    if (catWrap) catWrap.style.display = 'none';
    
    // 플래너 슬롯 렌더링
    renderPlannerSlots(format);
  }
}

// 동적 플래너 슬롯 생성 및 렌더링
function renderPlannerSlots(format) {
  const container = document.getElementById('planner-slots-container');
  if (!container) return;
  container.innerHTML = '';
  
  const config = plannerSlotConfigs[format];
  if (!config) return;
  
  const titleEl = document.getElementById('planner-title');
  if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-folder-tree"></i> ${config.title}`;
  
  config.groups.forEach(group => {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'planner-slot-group';
    groupDiv.innerHTML = `<div class="planner-slot-group-title"><i class="fa-regular fa-folder-open"></i> ${group.name}</div>`;
    
    group.slots.forEach(slot => {
      const slotDiv = document.createElement('div');
      slotDiv.className = 'planner-slot-item';
      
      // 카테고리에 속하는 레시피 필터링
      let slotRecipes = recipesDb.filter(r => r.category === slot.category);
      
      // 국물 카테고리인 경우 세부 카테고리 분기 처리 (탕, 찌개, 전골 메뉴 분리)
      if (slot.category === "국물") {
        if (slot.id.includes("soup")) {
          // 탕/국류: 전골이나 찌개가 아닌 일반 국/탕류
          slotRecipes = slotRecipes.filter(r => 
            !r.요리명.includes("전골") && 
            !r.요리명.includes("찌개") && 
            !r.요리명.includes("찌게") && 
            !r.요리명.includes("조치")
          );
        } else if (slot.id.includes("stew")) {
          // 찌개류(조치): 요리명에 찌개, 찌게, 조치, 조림 등이 들어가거나, 없는 경우 찌개처럼 먹을 수 있는 보조 국물류로 폴백
          const stewRecipes = slotRecipes.filter(r => 
            r.요리명.includes("찌개") || 
            r.요리명.includes("찌게") || 
            r.요리명.includes("조치") || 
            r.요리명.includes("조림")
          );
          if (stewRecipes.length > 0) {
            slotRecipes = stewRecipes;
          } else {
            // 국류와 찌개 대용 요리들 매칭
            slotRecipes = slotRecipes.filter(r => r.요리명.includes("국") || r.요리명.includes("지리") || r.요리명.includes("찌개"));
          }
        } else if (slot.id.includes("hotpot")) {
          // 전골 요리: 요리명에 전골이 들어가거나, 또는 전골이 없으면 메인 보양 탕류를 전골 대용으로 폴백 노출
          const hotpotRecipes = slotRecipes.filter(r => r.요리명.includes("전골"));
          if (hotpotRecipes.length > 0) {
            slotRecipes = hotpotRecipes;
          } else {
            slotRecipes = slotRecipes.filter(r => r.요리명.includes("탕") || r.요리명.includes("백숙"));
          }
        }
      }
      
      // 반찬 카테고리인 경우 세부 카테고리 분기 처리 (나물, 조림, 무침, 생채, 장아찌, 젓갈, 마른반찬 분리)
      if (slot.category === "반찬") {
        const label = slot.label || "";
        if (label.includes("나물")) {
          // 나물류: 요리명에 나물, 볶음 등이 들어가고 무침, 생채, 장아찌, 조림, 콩자반이 들어가지 않는 정통 숙채/볶음나물
          slotRecipes = slotRecipes.filter(r => 
            (r.요리명.includes("나물") || r.요리명.includes("볶음")) &&
            !r.요리명.includes("무침") &&
            !r.요리명.includes("생채") &&
            !r.요리명.includes("조림") &&
            !r.요리명.includes("장아찌") &&
            !r.요리명.includes("콩자반")
          );
        } else if (label.includes("조림")) {
          // 조림류: 요리명에 조림, 자반, 콩자반이 들어간 요리
          slotRecipes = slotRecipes.filter(r => 
            r.요리명.includes("조림") || 
            r.요리명.includes("자반") ||
            r.요리명.includes("콩자반")
          );
        } else if (label.includes("무침")) {
          // 무침류: 요리명에 무침이 들어가고 생채나 나물이 포함되지 않는 순수 무침류
          slotRecipes = slotRecipes.filter(r => 
            r.요리명.includes("무침") &&
            !r.요리명.includes("생채") &&
            !r.요리명.includes("나물")
          );
        } else if (label.includes("생채")) {
          // 생채류: 요리명에 생채, 오이, 생즙, 겉절이가 들어가고 익힌 나물이 아닌 요리
          slotRecipes = slotRecipes.filter(r => 
            (r.요리명.includes("생채") || r.요리명.includes("오이") || r.요리명.includes("생즙") || r.요리명.includes("겉절이")) &&
            !r.요리명.includes("나물")
          );
        } else if (label.includes("장아찌")) {
          // 장아찌류: 요리명에 장아찌가 들어간 요리
          slotRecipes = slotRecipes.filter(r => 
            r.요리명.includes("장아찌")
          );
        } else if (label.includes("젓갈")) {
          // 젓갈류: 요리명에 젓갈이 들어가거나, 없는 경우 젓갈처럼 먹을 수 있는 절임류(장아찌)로 폴백
          const jeotgalRecipes = slotRecipes.filter(r => r.요리명.includes("젓갈") || r.요리명.includes("젓"));
          if (jeotgalRecipes.length > 0) {
            slotRecipes = jeotgalRecipes;
          } else {
            slotRecipes = slotRecipes.filter(r => r.요리명.includes("장아찌"));
          }
        } else if (label.includes("마른반찬")) {
          // 마른반찬: 요리명에 멸치, 자반 등이 들어간 요리
          slotRecipes = slotRecipes.filter(r => 
            r.요리명.includes("멸치") || 
            r.요리명.includes("자반") ||
            r.요리명.includes("자반")
          );
        }
      }
      
      let optionsHtml = `<option value="">[선택 안 함]</option>`;
      slotRecipes.forEach(r => {
        optionsHtml += `<option value="${r.요리명}">${r.요리명}</option>`;
      });
      
      slotDiv.innerHTML = `
        <span class="planner-slot-label">${slot.label}</span>
        <select id="${slot.id}" class="planner-slot-select" onchange="loadPlannerRecipesToBlender()">
          ${optionsHtml}
        </select>
      `;
      groupDiv.appendChild(slotDiv);
    });
    
    container.appendChild(groupDiv);
  });
  
  // 최초 연동
  loadPlannerRecipesToBlender();
}

// 선택된 모든 슬롯의 요리 재료들을 파싱하여 R&D 배합표에 취합
function loadPlannerRecipesToBlender() {
  const formatSelect = document.getElementById('rnd-serving-format');
  const format = formatSelect ? formatSelect.value : 'single';
  if (format === 'single') return;
  
  const config = plannerSlotConfigs[format];
  if (!config) return;
  
  // 배합표 리스트 초기화
  rndIngredients = [];
  
  // 모든 슬롯의 선택 값 취합
  config.groups.forEach(group => {
    group.slots.forEach(slot => {
      const selectEl = document.getElementById(slot.id);
      if (selectEl && selectEl.value) {
        const recipeName = selectEl.value;
        const recipe = recipesDb.find(r => r.요리명 === recipeName);
        if (recipe) {
          parseRecipeIngredientsToTemp(recipe);
        }
      }
    });
  });
  
  // 동일 성분 중량 합산 및 병합
  const merged = [];
  const seen = {};
  rndIngredients.forEach(item => {
    if (seen[item.name]) {
      seen[item.name].weight += item.weight;
    } else {
      seen[item.name] = { ...item };
      merged.push(seen[item.name]);
    }
  });
  rndIngredients = merged;
  
  // R&D 분석 실행 및 테이블 업데이트
  updateRndAnalysis();
}

// 레시피 재료를 임시로 파싱해 추가하는 보조 헬퍼 함수
function parseRecipeIngredientsToTemp(recipe) {
  function tryAddTempIngredient(rawName, role, weight, cost) {
    const name = rawName.trim();
    if (!name) return;

    // 마스터 DB에 있는 식재료명이면 추가
    const existsInDb = masterDb.some(r => r["식재료/약재"] === name);
    if (existsInDb) {
      rndIngredients.push({ name, role, weight, cost });
      return;
    }

    // 복합 한약재 괄호식 형태 분해 (예: "사군자탕(백출, 감초, 복령, 인삼)")
    const subMatch = name.match(/^([^\(]+)\(([^)]+)\)/);
    if (subMatch) {
      const parentName = subMatch[1].trim();
      const childText = subMatch[2];
      
      if (masterDb.some(r => r["식재료/약재"] === parentName)) {
        rndIngredients.push({ name: parentName, role, weight, cost });
        return;
      }

      const children = childText.split(',').map(c => c.trim()).filter(Boolean);
      let addedAny = false;
      children.forEach(child => {
        const childMatch = child.match(/^([^\s\(\d]+)(?:\s*\(?(\d+)g\)?)?/);
        if (childMatch) {
          const cName = childMatch[1].trim();
          const cWeight = childMatch[2] ? parseFloat(childMatch[2]) : Math.round(weight / children.length);
          if (masterDb.some(r => r["식재료/약재"] === cName)) {
            rndIngredients.push({ name: cName, role, weight: cWeight, cost });
            addedAny = true;
          }
        }
      });

      if (addedAny) return;
    }

    // 최종 매칭이 없어도 일단 추가
    rndIngredients.push({ name, role, weight, cost });
  }

  // 1. 주재료 파싱
  if (recipe.주재료) {
    const rawMain = splitByCommaOutsideParens(recipe.주재료);
    rawMain.forEach(m => {
      const match = m.match(/^([^\(]+)(?:\(([^)]+)\))?/);
      if (match) {
        const rawName = match[1].trim();
        const weightStr = match[2] || "";
        let weight = 50;
        const numMatch = weightStr.match(/(\d+)/);
        if (numMatch) weight = parseFloat(numMatch[1]);
        
        tryAddTempIngredient(rawName, "군약(君藥)", weight, 12);
      }
    });
  }

  // 2. 부재료 및 약재 파싱
  if (recipe["부재료 및 약재"] || recipe["부재료"]) {
    const subText = recipe["부재료 및 약재"] || recipe["부재료"];
    const rawSub = splitByCommaOutsideParens(subText);
    rawSub.forEach((s, idx) => {
      const match = s.match(/^([^\(]+)(?:\(([^)]+)\))?/);
      if (match) {
        const rawName = match[1].trim();
        const weightStr = match[2] || "";
        let weight = 20;
        const numMatch = weightStr.match(/(\d+)/);
        if (numMatch) weight = parseFloat(numMatch[1]);

        let role = "신약(臣藥)";
        if (idx === 0) role = "신약(臣藥)";
        else if (idx <= 2) role = "좌약(佐藥)";
        else role = "사약(使藥)";

        tryAddTempIngredient(rawName, role, weight, 18);
      }
    });
  }
}

// 실시간 비즈니스 원가 계산
function updateRndCost() {
  let totalCost = 0;
  rndIngredients.forEach(item => {
    totalCost += item.weight * item.cost * batchMultiplier;
  });
  
  const costLbl = document.getElementById('rnd-cost-lbl');
  if (costLbl) {
    costLbl.innerText = batchMultiplier > 1 ? `총 R&D 생산 원가 (${batchMultiplier}인분):` : "1인분 추정 원가:";
  }
  
  const costVal = document.getElementById('rnd-total-cost');
  if (costVal) {
    costVal.innerText = Math.round(totalCost).toLocaleString();
  }
}

// AI 약성 향상 시너지 부스터 추천 매칭 규칙
const synergyBoosterMap = {
  "인삼": [
    { name: "대추", desc: "인삼의 비위 기력 보강 효능을 극대화하고 소화를 촉진합니다." },
    { name: "황기", desc: "보기(補氣) 작용을 함께 강화하여 전신 면역력을 증진시킵니다." }
  ],
  "맥문동": [
    { name: "오미자", desc: "진액 생성을 극대화하여 마른 기침을 다스리는 최적의 궁합입니다." },
    { name: "천문동", desc: "기관지 점막 윤활 및 기침/가래 완화 약성을 증대합니다." }
  ],
  "하수오": [
    { name: "구기자", desc: "간과 신장의 정혈을 함께 보해 노화 방지 효능을 증폭합니다." },
    { name: "검정콩", desc: "신장을 튼튼히 하고 모발 건강을 돕는 전통 배합입니다." }
  ],
  "산약": [
    { name: "백출", desc: "비장과 위장 소화기를 한층 더 건실하게 만듭니다." },
    { name: "복령", desc: "습을 제거하고 마음을 안정시키는 안신 효능을 돕습니다." }
  ],
  "당귀": [
    { name: "천궁", desc: "기혈 순환을 돕고 보혈(피를 채움) 효과를 극대화합니다." },
    { name: "숙지황", desc: "정혈을 크게 보충하여 허약 체질 개선에 좋습니다." }
  ],
  "지구자": [
    { name: "갈화", desc: "주독(酒毒) 해소 및 알코올 해독 속도를 높이는 최상의 조합입니다." },
    { name: "갈근", desc: "목 뒤 뭉침을 풀고 숙취로 인한 갈증을 해소합니다." }
  ],
  "상기생": [
    { name: "우슬", desc: "관절통과 척추 요통을 다스리며 뼈와 힘줄을 튼튼히 합니다." },
    { name: "오가피", desc: "체내 풍습(독소 및 습기)을 내보내 관절 건강을 돕습니다." }
  ],
  "은이버섯": [
    { name: "백합", desc: "폐를 촉촉하게 자양하고 만성 염증성 기침을 완화합니다." }
  ],
  "구기자": [
    { name: "국화", desc: "간의 열을 내리고 눈을 밝게 하는 명목(明目) 시너지를 냅니다." }
  ],
  "황기": [
    { name: "당귀", desc: "기혈을 동시에 보강하여 기력 회복 속도를 배가합니다." }
  ]
};

function updateSynergyBooster() {
  const container = document.getElementById('rnd-booster-container');
  if (!container) return;
  container.innerHTML = '';

  if (rndIngredients.length === 0) {
    container.innerHTML = `<p style="font-size:0.82rem; color:var(--text-muted); text-align:center; margin: 10px 0;">원재료를 1개 이상 배합표에 추가하면 약성 향상 제안이 활성화됩니다.</p>`;
    return;
  }

  const currentNames = new Set(rndIngredients.map(i => i.name));
  const recommendations = [];

  rndIngredients.forEach(item => {
    const suggestions = synergyBoosterMap[item.name];
    if (suggestions) {
      suggestions.forEach(s => {
        if (!currentNames.has(s.name) && !recommendations.some(r => r.name === s.name)) {
          recommendations.push({
            trigger: item.name,
            name: s.name,
            desc: s.desc
          });
        }
      });
    }
  });

  if (recommendations.length === 0) {
    container.innerHTML = `<p style="font-size:0.82rem; color:var(--primary); text-align:center; margin: 10px 0;"><i class="fa-solid fa-circle-check"></i> 현재 배합은 이미 뛰어난 독자적 상생 밸런스를 확보하고 있습니다.</p>`;
    return;
  }

  recommendations.slice(0, 3).forEach(rec => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'booster-item';
    itemDiv.innerHTML = `
      <div style="flex:1; padding-right:10px;">
        <span style="font-weight:700; color:var(--sa-color); cursor:pointer; " onclick="showRndRowDetailByName('${rec.name.replace(/'/g, "\\\\'")}')" class="clickable-text" title="클릭 시 약재 상세 정보 팝업"><i class="fa-solid fa-angles-up"></i> ${rec.name}</span> 
        <small style="color:var(--text-muted); font-size:0.75rem;">(배합원료: <span style="cursor:pointer; " onclick="showRndRowDetailByName('${rec.trigger.replace(/'/g, "\\\\'")}')" class="clickable-text">${rec.trigger}</span> 보완)</small>
        <p style="margin-top:2px; font-size:0.75rem; color:var(--text-main); line-height:1.4;">${rec.desc}</p>
      </div>
      <button class="booster-add-btn" onclick="addIngredientToRnd('${rec.name.replace(/'/g, "\\\\'")}', '좌약(佐藥)', 10, 20)">추가</button>
    `;
    container.appendChild(itemDiv);
  });
}

// 실시간 한방 / 과학 융합 통합 R&D 분석 연산
function updateRndAnalysis() {
  renderRndIngredientsTable();
  updateRndCost();
  updateSynergyBooster();

  // 1. 칠정배합 검증 (MatrixEngine 이용)
  const safeContainer = document.getElementById('rnd-safe-container');
  if (safeContainer) {
    safeContainer.innerHTML = '';
    
    // MatrixEngine의 checkChiljeongCompounding 호출을 위해 임시 객체 배열 매핑
    const mappingInput = rndIngredients.map(i => ({ name: i.name }));
    const result = engine.checkChiljeongCompounding(mappingInput);
    
    if (result.warnings.length === 0 && result.synergies.length === 0) {
      safeContainer.innerHTML = `<p style="font-size:0.82rem; color:var(--text-muted); text-align:center; margin: 10px 0;">감지된 상극 독성 반응 또는 유의한 궁합 시너지가 없습니다.</p>`;
    } else {
      const listDiv = document.createElement('div');
      listDiv.className = 'alert-card-flow';
      
      result.warnings.forEach(w => {
        listDiv.innerHTML += `
          <div class="alert-item warn" style="padding:10px 14px;">
            <i class="fa-solid fa-triangle-exclamation" style="margin-top:2px;"></i>
            <div>
              <strong>상극 배합 검출: <span style="cursor:pointer; " onclick="showRndRowDetailByName('${w.a.replace(/'/g, "\\\\'")}')" class="clickable-text">${w.a}</span> - <span style="cursor:pointer; " onclick="showRndRowDetailByName('${w.b.replace(/'/g, "\\\\'")}')" class="clickable-text">${w.b}</span></strong>
              <p style="font-size: 0.75rem; margin-top:2px; opacity:0.85;">${w.desc} (주의: 상업용 조리 시 중량 차등 또는 우회 성분 교체를 고려하십시오.)</p>
            </div>
          </div>
        `;
      });

      result.synergies.forEach(s => {
        listDiv.innerHTML += `
          <div class="alert-item syn" style="padding:10px 14px;">
            <i class="fa-solid fa-star" style="margin-top:2px;"></i>
            <div>
              <strong>궁합 시너지 매칭: <span style="cursor:pointer; " onclick="showRndRowDetailByName('${s.a.replace(/'/g, "\\\\'")}')" class="clickable-text">${s.a}</span> - <span style="cursor:pointer; " onclick="showRndRowDetailByName('${s.b.replace(/'/g, "\\\\'")}')" class="clickable-text">${s.b}</span></strong>
              <p style="font-size: 0.75rem; margin-top:2px; opacity:0.85;">${s.desc} (체내 흡수율 및 약성 향상 시너지가 극대화됩니다.)</p>
            </div>
          </div>
        `;
      });
      safeContainer.appendChild(listDiv);
    }
  }

  // 2. 성미귀경 오행 분포 계산 및 렌더링
  const natureCounts = { "온성/열성": 0, "평성": 0, "한성/량성": 0 };
  const tasteCounts = { "단맛(감)": 0, "매운맛(신)": 0, "쓴맛(고)": 0, "신맛(산)": 0, "짠맛(함)": 0 };
  const meridianCounts = { "비경": 0, "위경": 0, "간경": 0, "신경": 0, "폐경": 0, "심경": 0 };

  let totalWeight = 0;
  let totalCalories = 0;
  let totalCarbs = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalFiber = 0;
  let totalSodium = 0;
  let detectedBioactives = new Set();

  rndIngredients.forEach(item => {
    // 마스터 DB에서 해당 재료의 속성 매치
    const row = masterDb.find(r => r["식재료/약재"] === item.name);
    const herbology = window.ingredientsHerbologyList && window.ingredientsHerbologyList.find(h => h.식재료명 === item.name || item.name.includes(h.식재료명));
    
    // 현대 영양 매핑 감지
    if (window.ingredientsNutritionMap) {
      const nutri = window.ingredientsNutritionMap[item.name] || window.ingredientsNutritionMap[Object.keys(window.ingredientsNutritionMap).find(k => item.name.includes(k) || k.includes(item.name))];
      if (nutri) {
        const ratio = item.weight / 10.0; // JSON 데이터는 10g당 함량 기준
        totalCalories += (nutri.calories || 0) * ratio;
        totalCarbs += (nutri.carbohydrates || 0) * ratio;
        totalProtein += (nutri.protein || 0) * ratio;
        totalFat += (nutri.fat || 0) * ratio;
        totalFiber += (nutri.fiber || 0) * ratio;
        totalSodium += (nutri.sodium || 0) * ratio;
        
        if (nutri.bioactive_compounds) {
          nutri.bioactive_compounds.forEach(comp => detectedBioactives.add(comp));
        }
      }
    }

    const descText = (row ? (row.설명목록 || []).join(" ") : "") + " " + (herbology ? herbology["성미 (성질과 맛)"] : "");
    const origEffText = (row ? (row.효능목록 || []).join(", ") : "");
    
    // 가중치 계산 (군약: 3, 신약: 2, 좌약/사약: 1)
    let weightFactor = 1;
    if (item.role.includes("군약")) weightFactor = 3;
    else if (item.role.includes("신약")) weightFactor = 2;
    
    // 조리배율과 중량이 반영된 실질 중량 가중치
    const scaledItemWeight = item.weight * batchMultiplier;
    const itemFactor = weightFactor * scaledItemWeight;
    
    totalWeight += scaledItemWeight;

    // 성질 파싱
    if (descText.includes("따뜻") || descText.includes("온(溫)") || descText.includes("열(熱)")) {
      natureCounts["온성/열성"] += itemFactor;
    } else if (descText.includes("차가") || descText.includes("한(寒)") || descText.includes("서늘") || descText.includes("량(凉)")) {
      natureCounts["한성/량성"] += itemFactor;
    } else {
      natureCounts["평성"] += itemFactor;
    }

    // 맛 파싱
    if (descText.includes("달다") || descText.includes("감(甘)")) tasteCounts["단맛(감)"] += itemFactor;
    if (descText.includes("맵다") || descText.includes("신(辛)")) tasteCounts["매운맛(신)"] += itemFactor;
    if (descText.includes("쓰다") || descText.includes("고(苦)")) tasteCounts["쓴맛(고)"] += itemFactor;
    if (descText.includes("시다") || descText.includes("산(酸)")) tasteCounts["신맛(산)"] += itemFactor;
    if (descText.includes("짜다") || descText.includes("함(鹹)")) tasteCounts["짠맛(함)"] += itemFactor;

    // 귀경 파싱
    const targetMeridians = ["간경", "심경", "비경", "위경", "폐경", "신경"];
    targetMeridians.forEach(m => {
      if (descText.includes(m) || origEffText.includes(m) || (herbology && herbology["약선 배합 및 요리법"] && herbology["약선 배합 및 요리법"].includes(m))) {
        meridianCounts[m] += itemFactor;
      }
    });
  });

  // UI 렌더링 - 사기(성질)
  const natureContainer = document.getElementById('rnd-nature-balance');
  if (natureContainer) {
    natureContainer.innerHTML = '';
    const totalNature = Object.values(natureCounts).reduce((a, b) => a + b, 0) || 1;
    Object.entries(natureCounts).forEach(([n, count]) => {
      const pct = ((count / totalNature) * 100).toFixed(0);
      let color = '#10b981'; // 평성
      if (n.includes('온')) color = '#f59e0b'; // 온성
      else if (n.includes('한')) color = '#3b82f6'; // 한성
      
      natureContainer.innerHTML += `
        <div class="balance-progress-item">
          <div class="balance-progress-lbl">
            <span>${n}</span>
            <span>${pct}%</span>
          </div>
          <div class="balance-progress-track">
            <div class="balance-progress-fill" style="width:${pct}%; background:${color};"></div>
          </div>
        </div>
      `;
    });
  }
  // UI 렌더링 - 오미(맛)
  const tasteContainer = document.getElementById('rnd-taste-balance');
  if (tasteContainer) {
    tasteContainer.innerHTML = '';
    const totalTaste = Object.values(tasteCounts).reduce((a, b) => a + b, 0) || 1;
    Object.entries(tasteCounts).forEach(([t, count]) => {
      const pct = ((count / totalTaste) * 100).toFixed(0);
      tasteContainer.innerHTML += `
        <div class="balance-progress-item">
          <div class="balance-progress-lbl">
            <span>${t}</span>
            <span>${pct}%</span>
          </div>
          <div class="balance-progress-track">
            <div class="balance-progress-fill" style="width:${pct}%; background:var(--primary);"></div>
          </div>
        </div>
      `;
    });
  }

  // UI 렌더링 - 귀경
  const meridianContainer = document.getElementById('rnd-meridian-balance');
  if (meridianContainer) {
    meridianContainer.innerHTML = '';
    const maxMeridian = Math.max(...Object.values(meridianCounts), 1);
    Object.entries(meridianCounts).forEach(([m, count]) => {
      const isHeavy = count > 0 && count === maxMeridian;
      meridianContainer.innerHTML += `
        <span class="meridian-badge ${isHeavy ? 'heavy' : ''}">
          ${m} (${Math.round(count).toLocaleString()}점)
        </span>
      `;
    });
  }

  // 3. 기대 생리활성 및 7대 반응 축(7-AXIS) 예측
  const axisScores = { '정화': 0, '완화': 0, '흡수': 0, '회복': 0, '순환': 0, '보호': 0, '안정': 0 };
  const funcToAxis = {};
  standardFunctions.forEach(item => {
    funcToAxis[item.표준기능] = item["7축"];
  });

  rndIngredients.forEach(item => {
    const row = masterDb.find(r => r["식재료/약재"] === item.name);
    if (row) {
      let axes = new Set();
      (row.표준기능목록 || []).forEach(f => {
        if (f) {
          const ax = getResolved7Axis(f, null);
          if (ax) axes.add(ax);
        }
      });

      let weightFactor = 1;
      if (item.role.includes("군약")) weightFactor = 3;
      else if (item.role.includes("신약")) weightFactor = 2;

      // 조리배율과 중량이 반영된 실질 중량 가중치
      const scaledItemWeight = item.weight * batchMultiplier;
      const itemFactor = weightFactor * scaledItemWeight;

      axes.forEach(axis => {
        if (axisScores.hasOwnProperty(axis)) {
          axisScores[axis] += itemFactor;
        }
      });
    }
  });

  const axisContainer = document.getElementById('rnd-axis-progress-container');
  if (axisContainer) {
    axisContainer.innerHTML = '';
    const totalAxisScore = Object.values(axisScores).reduce((a, b) => a + b, 0) || 1;
    
    Object.entries(axisScores).forEach(([axis, score]) => {
      const pct = ((score / totalAxisScore) * 100).toFixed(0);
      if (score > 0) {
        axisContainer.innerHTML += `
          <div class="rnd-axis-item">
            <div class="rnd-axis-lbl">
              <span>${axis} 계열</span>
              <span>${pct}% (가중치 ${Math.round(score).toLocaleString()}점)</span>
            </div>
            <div class="rnd-axis-track">
              <div class="rnd-axis-fill" style="width:${pct}%;"></div>
            </div>
          </div>
        `;
      }
    });

    if (axisContainer.innerHTML === '') {
      axisContainer.innerHTML = `<p style="font-size:0.82rem; color:var(--text-muted); text-align:center;">7대 축 분류를 예측할 수 있는 식재료가 없습니다.</p>`;
    }
  }

  // 4-2. 현대 과학 영양 및 생리활성 성분 렌더링
  const caloriesEl = document.getElementById('rnd-nutri-calories');
  if (caloriesEl) {
    caloriesEl.innerText = Math.round(totalCalories);
    document.getElementById('rnd-nutri-sodium').innerText = Math.round(totalSodium);
    document.getElementById('rnd-nutri-val-carbs').innerText = totalCarbs.toFixed(1);
    document.getElementById('rnd-nutri-val-protein').innerText = totalProtein.toFixed(1);
    document.getElementById('rnd-nutri-val-fat').innerText = totalFat.toFixed(1);
    document.getElementById('rnd-nutri-val-fiber').innerText = totalFiber.toFixed(1);

    const totalMacros = totalCarbs + totalProtein + totalFat;
    let carbsPct = 0, proteinPct = 0, fatPct = 0;
    if (totalMacros > 0) {
      carbsPct = Math.round((totalCarbs / totalMacros) * 100);
      proteinPct = Math.round((totalProtein / totalMacros) * 100);
      fatPct = 100 - carbsPct - proteinPct; // 합계가 정확히 100%가 되도록 조정
      if (fatPct < 0) fatPct = 0;
    }

    document.getElementById('rnd-nutri-pct-carbs').innerText = carbsPct;
    document.getElementById('rnd-nutri-pct-protein').innerText = proteinPct;
    document.getElementById('rnd-nutri-pct-fat').innerText = fatPct;

    // 프로그레스 바 너비 업데이트
    const barCarbs = document.getElementById('rnd-nutri-bar-carbs');
    const barProtein = document.getElementById('rnd-nutri-bar-protein');
    const barFat = document.getElementById('rnd-nutri-bar-fat');
    if (barCarbs && barProtein && barFat) {
      if (totalMacros > 0) {
        barCarbs.style.width = `${carbsPct}%`;
        barProtein.style.width = `${proteinPct}%`;
        barFat.style.width = `${fatPct}%`;
      } else {
        barCarbs.style.width = '33.3%';
        barProtein.style.width = '33.3%';
        barFat.style.width = '33.3%';
      }
    }
  }

  // 4-3. 생리활성 물질 태그 렌더링
  const bioactiveContainer = document.getElementById('rnd-bioactive-container');
  if (bioactiveContainer) {
    bioactiveContainer.innerHTML = '';
    if (detectedBioactives.size === 0) {
      bioactiveContainer.innerHTML = '<span style="font-size:0.82rem; color:var(--text-muted); padding:4px 0;">원료를 1개 이상 추가 시 활성 물질 목록이 계산됩니다.</span>';
    } else {
      detectedBioactives.forEach(comp => {
        const tag = document.createElement('span');
        tag.className = 'bioactive-tag';
        tag.style.cssText = 'background:rgba(16,185,129,0.08); color:var(--primary); border:1px solid rgba(16,185,129,0.3); border-radius:12px; padding:3px 10px; font-size:0.75rem; font-weight:600; cursor:pointer; transition: all 0.2s ease;';
        tag.innerHTML = `<i class="fa-solid fa-seedling" style="margin-right:4px;"></i>${comp}`;
        tag.onclick = () => showBioactiveBenefit(comp);
        tag.onmouseover = () => { tag.style.background = 'rgba(16,185,129,0.2)'; tag.style.borderColor = 'var(--primary)'; };
        tag.onmouseout = () => { tag.style.background = 'rgba(16,185,129,0.1)'; tag.style.borderColor = 'rgba(16,185,129,0.3)'; };
        bioactiveContainer.appendChild(tag);
      });
    }
  }

  // 4-4. 전통 발효주 & 음청류 페어링 추천 렌더링
  const pairingContainer = document.getElementById('rnd-pairing-container');
  if (pairingContainer) {
    pairingContainer.innerHTML = '';
    if (rndIngredients.length === 0) {
      pairingContainer.innerHTML = '<p style="font-size:0.82rem; color:var(--text-muted); margin:0;">원재료를 추가하여 배합 설계를 진행하면, 페어링이 추천됩니다.</p>';
    } else {
      const dishSelect = document.getElementById('rnd-dish-category');
      const dishCategoryVal = dishSelect ? dishSelect.value : "기타";
      
      let matchedLiquorName = "안동 유기농 노랑 국화차 (30g)";
      let matchedLiquorPrice = "18,000원";
      let matchedLiquorIcon = "🍵";
      let matchedLiquorDesc = "머리를 맑게 하고 위장 소화 흡수를 향기롭게 감싸주는 유기농 국화송이차입니다.";

      if (dishCategoryVal.includes("국물_메인") || dishCategoryVal === "부식") {
        matchedLiquorName = "청명 진맥 청주 (500ml)";
        matchedLiquorPrice = "32,000원";
        matchedLiquorIcon = "🍶";
        matchedLiquorDesc = "보리 누룩으로 빚어 육류의 느끼한 맛을 개운하게 씻어주고 소화를 촉진하는 맑은 청주입니다.";
      } else if (natureCounts["온성/열성"] > natureCounts["한성/량성"]) {
        matchedLiquorName = "지리산 안신 연잎 꽃차 (30g)";
        matchedLiquorPrice = "22,000원";
        matchedLiquorIcon = "🌸";
        matchedLiquorDesc = "따뜻한 성질의 음식 뒤에 마음을 차분히 가라앉히고 번열을 제거하는 안신(安神) 꽃차입니다.";
      } else if (natureCounts["한성/량성"] > natureCounts["온성/열성"]) {
        matchedLiquorName = "홍화 보양 백세주 (375ml)";
        matchedLiquorPrice = "24,000원";
        matchedLiquorIcon = "🍶";
        matchedLiquorDesc = "서늘한 음식의 성질을 온화하게 덮어주고 기혈의 미세 순환을 돕는 보양주입니다.";
      }

      pairingContainer.innerHTML = `
        <div style="font-size:1.8rem; line-height:1; display:flex; align-items:center;">${matchedLiquorIcon}</div>
        <div style="flex:1;">
          <h4 style="font-size:0.85rem; font-weight:700; color:#fff; margin:0 0 2px;">${matchedLiquorName}</h4>
          <p style="font-size:0.75rem; color:var(--text-muted); margin:0;">${matchedLiquorDesc}</p>
        </div>
        <div style="text-align:right;">
          <div style="font-size:0.85rem; font-weight:800; color:var(--primary);">${matchedLiquorPrice}</div>
          <button class="btn btn-outline btn-xsmall" style="margin-top:4px; padding:2px 8px; font-size:0.7rem;" onclick="switchTab('tab-shop')">상점 구매</button>
        </div>
      `;
    }
  }

  // 4. 창업용 약선 마케팅 컨셉 문구(Claims) 생성
  const marketingBox = document.getElementById('rnd-marketing-output');
  if (marketingBox) {
    if (rndIngredients.length === 0) {
      marketingBox.innerText = "원재료를 추가하여 배합 설계를 진행하면, 스토리가 자동으로 조립됩니다.";
      return;
    }

    const dishSelect = document.getElementById('rnd-dish-category');
    const dishCategoryVal = dishSelect ? dishSelect.value : "기타";
    
    // 요리 종류 한글명 번역
    const categoryNames = {
      "주식_일반": "주식 (일반 밥류)",
      "주식_복합": "주식 (약선 보양 복합밥류)",
      "주식_죽면": "주식 (죽 / 미음 / 면 / 수제비 / 만두)",
      "국물_메인": "국물 (메인 보양 탕 / 백숙 / 전골류)",
      "국물_일반": "국물 (일반 국 / 찌개류)",
      "반찬": "반찬 (나물 / 생채 / 무침 / 장아찌 / 일반조림)",
      "부식": "부식 (전 / 구이 / 튀김 / 주요 육류·어류 요리)",
      "양념": "양념 (조미료 / 전통 음청 / 후식 디저트류)",
      "기타": "기타 요리"
    };
    const dishCategoryName = categoryNames[dishCategoryVal] || "약선 요리";

    const gunItem = rndIngredients.find(i => i.role.includes("군약")) || rndIngredients[0];
    const sinItem = rndIngredients.find(i => i.role.includes("신약")) || rndIngredients[1];
    const jwaItem = rndIngredients.find(i => i.role.includes("좌약"));
    const saItem = rndIngredients.find(i => i.role.includes("사약"));
    
    // 주요 7대 축 결과 추출
    const sortedAxes = Object.entries(axisScores).filter(([_, s]) => s > 0).sort((a, b) => b[1] - a[1]);
    const mainAxis = sortedAxes.length > 0 ? sortedAxes[0][0] : "종합 조율";

    // 지배적 기미(성질) 추출
    const sortedNature = Object.entries(natureCounts).sort((a, b) => b[1] - a[1]);
    const mainNature = sortedNature[0][0];

    const formatSelect = document.getElementById('rnd-serving-format');
    const servingFormat = formatSelect ? formatSelect.value : 'single';

    let claimText = "";
    
    if (servingFormat.startsWith("bansang_")) {
      const cheopNames = {
        "bansang_5": "5첩 반상 보양 정식",
        "bansang_7": "7첩 반상 보양 정식",
        "bansang_10": "10첩 명품 반상 정식",
        "bansang_15": "15첩 대형 약선 궁중반상",
        "bansang_20": "20첩 명품 수라 보양상"
      };
      const cheopName = cheopNames[servingFormat] || "전통 약선 반상 차림";
      
      claimText = `[Nuri Lab R&D 전통 반상 차림 마케팅 컨셉]\n\n`;
      claimText += `본 식단은 한국 전통 식문화의 정수인 [${cheopName}] 형태로 구성된 균형 잡힌 명품 약선 차림새입니다.\n\n`;
      claimText += `한방 성미학적 [${mainNature}] 기운을 지배적으로 띠고 있어 체내 오행 기운을 조화롭게 조율하며, 현대 영양학적 생리 활성 지표인 [${mainAxis}] 작용을 극대화하도록 원료들이 과학적으로 배합되었습니다.\n\n`;
      claimText += `식재료 간의 약성 상극(칠정배합)을 실시간 회피하고, 중복 원료를 유기적으로 병합/조율하여 여러 요리들이 밥상 위에서 서로의 흡수율을 돕고 시너지를 일으키도록 구성된 것이 본 식단 R&D의 최대 강점입니다.\n\n`;
      claimText += `프랜차이즈 한정식 전문점이나 프리미엄 웰빙 급식/밀키트 시장에서 "귀한 분을 대접하는 전통 [${cheopName}]"이라는 고부가가치 건강 스토리텔링으로 고급화 브랜딩을 전개하기에 최적의 조합입니다.`;
    } else if (servingFormat === "course_hanjeong") {
      const prePorridgeVal = document.getElementById('slot-pre-porridge') ? document.getElementById('slot-pre-porridge').value : '';
      const preSaladVal = document.getElementById('slot-pre-salad') ? document.getElementById('slot-pre-salad').value : '';
      const preDrinkVal = document.getElementById('slot-pre-drink') ? document.getElementById('slot-pre-drink').value : '';
      
      const mainDishVal = document.getElementById('slot-main-dish') ? document.getElementById('slot-main-dish').value : '';
      const mainRiceVal = document.getElementById('slot-main-rice') ? document.getElementById('slot-main-rice').value : '';
      const mainSoupVal = document.getElementById('slot-main-soup') ? document.getElementById('slot-main-soup').value : '';
      const mainSidesVal = document.getElementById('slot-main-sides') ? document.getElementById('slot-main-sides').value : '';
      
      const postMouthVal = document.getElementById('slot-post-mouth') ? document.getElementById('slot-post-mouth').value : '';
      const postTeaVal = document.getElementById('slot-post-tea') ? document.getElementById('slot-post-tea').value : '';
      const postDessertVal = document.getElementById('slot-post-dessert') ? document.getElementById('slot-post-dessert').value : '';
      
      claimText = `[Nuri Lab R&D 약선 한정식 코스 요리 마케팅 컨셉]\n\n`;
      claimText += `본 코스는 식사의 시작부터 마감까지 인체의 약리 작용 흐름(Dining Flow)을 3단계로 과학적 설계한 프리미엄 약선 한정식 다이닝 코스입니다.\n\n`;
      
      claimText += `1️⃣ [식전 코스 (Pre-Meal)]: `;
      let preStory = [];
      if (prePorridgeVal) preStory.push(`비위를 조율하는 '${prePorridgeVal}'`);
      if (preSaladVal) preStory.push(`신선한 약성의 '${preSaladVal}'`);
      if (preDrinkVal) preStory.push(`식욕을 돋우고 혈행을 활성화하는 '${preDrinkVal}'`);
      claimText += preStory.length > 0 ? preStory.join(", ") + " 등을 배치하여 식사 전 소화액 분비와 위장 온난화를 부스팅합니다.\n" : "입안을 정화하고 위장을 따뜻하게 하여 입맛을 돋웁니다.\n";
      
      claimText += `2️⃣ [메인 식사 (Main Meal)]: `;
      let mainStory = [];
      if (mainDishVal) mainStory.push(`원기를 크게 보하는 핵심 보양 요리인 '${mainDishVal}'`);
      if (mainRiceVal) mainStory.push(`영양 뼈대가 되는 '${mainRiceVal}'`);
      if (mainSoupVal) mainStory.push(`국물 조화인 '${mainSoupVal}'`);
      if (mainSidesVal) mainStory.push(`찬으로 곁들이는 '${mainSidesVal}'`);
      claimText += mainStory.length > 0 ? mainStory.join(", ") + " 등을 융합하여 기혈(氣血)을 대보(大補)하고 핵심 약성을 집중적으로 체내에 공급합니다.\n" : "고단백 영양소와 핵심 본초 성분을 체내에 집중 공급합니다.\n";
      
      claimText += `3️⃣ [식후 코스 (Post-Meal)]: `;
      let postStory = [];
      if (postMouthVal) postStory.push(`식후 깔끔하게 입안을 정화하는 입가심 '${postMouthVal}'`);
      if (postTeaVal) postStory.push(`은은하게 마음을 안정시키는 꽃차/허브차인 '${postTeaVal}'`);
      if (postDessertVal) postStory.push(`전통 정취의 '${postDessertVal}'`);
      claimText += postStory.length > 0 ? postStory.join(", ") + " 등을 매칭하여 소화 흡수를 촉진하고 전신 심신을 편안히 가라앉히며(안신) 완벽한 식사 여정을 매듭짓습니다.\n\n" : "입가심 및 후식 차로 속을 편안하게 덮어 마감합니다.\n\n";
      
      claimText += `이 3단계 코스 요리는 성미학적 [${mainNature}] 기질을 지니며, 신체 표준 7축 반응 중 [${mainAxis}] 계열의 생리 지표를 강화하여 프리미엄 코스 파인 다이닝 및 헬스케어 한정식 시장에서 독보적인 기획력을 자랑할 것입니다.`;
    } else {
      claimText = `[Nuri Lab R&D 보양 메뉴 마케팅 컨셉]\n\n`;
      if (dishCategoryVal === "국물_메인") {
        claimText += `본 메뉴는 단순한 보조 국물이 아닌, 든든한 식사로서의 한 끼 중심이 되는 [${dishCategoryName}] 전문 보양식 요리로 기획되었습니다.\n\n`;
      } else if (dishCategoryVal === "주식_복합") {
        claimText += `본 메뉴는 백미 위주의 평범한 식단을 넘어 다양한 천연 원물과 약재를 과학적으로 융합한 프리미엄 [${dishCategoryName}]으로 설계되었습니다.\n\n`;
      } else {
        claimText += `본 메뉴는 한방 성미학적 [${mainNature}] 기운과 현대 영양 생리학을 융합하여 설계된 [${dishCategoryName}] 카테고리의 전문 약선식입니다.\n\n`;
      }
      claimText += `- 주식/메인주재료(군약)인 '${gunItem.name}'의 고유 효능을 중심 뼈대로 구축하고, `;
      
      if (sinItem) {
        claimText += `주요 부재료(신약)인 '${sinItem.name}'을 배합하여 맛과 보조 약리 작용을 조화롭게 이끌어냈습니다. `;
      }
      
      if (jwaItem || saItem) {
        claimText += `또한, `;
        if (jwaItem) claimText += `약성보강 약재(좌약)인 '${jwaItem.name}'으로 보양 효과를 배가하고, `;
        if (saItem) claimText += `조미/향료/양념(사약)인 '${saItem.name}'을 써서 약성의 조화로운 섭취와 기미의 균형을 완성했습니다.`;
      }

      claimText += `\n\n이로써 전통 배합 비율을 준수하고 현대 과학의 [${mainAxis}] 활성 지표를 극대화한 기능성 처방 설계가 완성되었습니다.\n`;
      claimText += `프랜차이즈 가맹점이나 프리미엄 밀키트 시장에서 "식재료의 약성과 기미귀경을 극대화하여 몸의 [${mainAxis}] 작용을 돕는 현대인 맞춤형 [${dishCategoryName}]"이란 스토리로 상업화와 브랜딩 마케팅을 전개하기에 적합합니다.`;
    }

    marketingBox.innerText = claimText;
  }
}

// 마케팅 문구 복사
function copyMarketingClaim() {
  const text = document.getElementById('rnd-marketing-output').innerText;
  if (text.includes("자동으로 조립됩니다")) {
    alert("먼저 배합을 완성해주세요.");
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    alert("성공: 창업용 마케팅 컨셉 문구가 클립보드에 복사되었습니다.");
  });
}

// R&D 배합 데이터 파일 내보내기
function exportRndData(format) {
  if (rndIngredients.length === 0) {
    alert("내보낼 배합 데이터가 존재하지 않습니다.");
    return;
  }

  let text = "";
  if (format === 'json') {
    const exportObj = {
      formula_name: "Yakseon R&D Custom Menu",
      batch_multiplier: batchMultiplier,
      total_cost: document.getElementById('rnd-total-cost').innerText + "원",
      ingredients: rndIngredients.map(i => ({
        name: i.name,
        role: i.role,
        weight_1x: i.weight + "g",
        weight_scaled: (i.weight * batchMultiplier) + "g",
        unit_cost: i.cost + "원/g"
      })),
      marketing_claim: document.getElementById('rnd-marketing-output').innerText
    };
    text = JSON.stringify(exportObj, null, 2);
  } else {
    // CSV
    text = "\ufeff원재료명,역할,1인분중량(g),총배합중량(g),단가 메모(원/g),배율\n";
    rndIngredients.forEach(i => {
      text += `"${i.name}","${i.role}","${i.weight}","${i.weight * batchMultiplier}","${i.cost}","${batchMultiplier}x"\n`;
    });
  }

  const blob = new Blob([text], { type: format === 'json' ? 'application/json' : 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `yakseon_rnd_export.${format}`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ─── Classical Sources Guide Modal ──────────────────────────────
function showGuide(type) {
  const titleEl = document.getElementById('guide-modal-title');
  const bodyEl = document.getElementById('guide-modal-body');
  
  if (!titleEl || !bodyEl) return;
  
  let title = "";
  let html = "";
  
  switch(type) {
    case 'neiging':
      title = "황제내경(黃帝內經) — 동양 의학의 원형";
      html = `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-yin-yang"></i> 문헌 소개</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              <strong>황제내경</strong>은 약 2천 년 전에 저술된 동양 의학의 최고 고전이자 한의학의 시조로 꼽히는 서적입니다. 인체의 생리 체계가 자연의 섭리(음양오행)와 어떻게 동기화되는지 규명하며, 신체 음양의 조화 및 양생법(생명력을 기르는 생활 예방 의학)의 철학적·의학적 뼈대를 완성했습니다.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:8px;">
            <h4 style="color:var(--primary); margin:0; font-size:0.95rem;"><i class="fa-solid fa-circle-nodes"></i> Nuri Lab 연계 및 동적 작동 기능</h4>
            <ul style="margin:0; padding-left:20px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px;">
              <li><strong>오행 성미(性味) 분포 시각화:</strong> 본 플랫폼의 R&D 설계기에서 배합된 모든 원료들의 한방 성질(따뜻함/차가움)과 다섯 가지 맛(단맛, 신맛, 쓴맛, 매운맛, 짠맛)의 실시간 누적 분포도를 실시간으로 연산하여 차트로 가시화합니다.</li>
              <li><strong>사상 체질 맞춤형 가중치 산출:</strong> 환자의 사상 체질(소음, 소양, 태음, 태양)에 따라 비위가 차거나(소음인), 신장 기능이 부족하거나(소양인) 등 개별 생리 활성 기전에 따라 최적의 추천 배합 점수에 가점(+25점)을 동적으로 반영하는 엔진의 기초 뼈대로 쓰입니다.</li>
            </ul>
          </div>
        </div>
      `;
      break;
    case 'bogam':
      title = "동의보감(東醫寶鑑) — 실용 임상과 양생의 집대성";
      html = `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-book-medical"></i> 문헌 소개</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              <strong>동의보감</strong>은 조선시대의 의성 허준이 선조와 광해군의 어명에 의해 편찬한 세계적인 의학 백과사전으로, 유네스코 세계기록유산에 등재되어 있습니다. 단순한 치료법을 넘어 일상의 섭식(식문화)과 약재의 조화를 통해 병을 미연에 방지하는 예방 양생 의학의 가치를 실증적으로 담아냈습니다.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:8px;">
            <h4 style="color:var(--primary); margin:0; font-size:0.95rem;"><i class="fa-solid fa-circle-nodes"></i> Nuri Lab 연계 및 동적 작동 기능</h4>
            <ul style="margin:0; padding-left:20px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px;">
              <li><strong>칠정배합(상극) 세이프티 가드:</strong> 동의보감의 약재 처방 궁합 원칙에 따라 생화학적 충돌이나 독성 유발 우려가 있는 상극 조합(예: 인삼과 여로, 꿀과 파 등)을 AI 엔진이 실시간 모니터링하여 경고하고 대체 가능한 보조 원료를 안내합니다.</li>
              <li><strong>군신좌사(君臣佐使) 배합율 연산:</strong> R&D 설계기에서 배합된 원료들의 역할을 군약(주효능), 신약(보조효능), 좌약(조절/부작용완화), 사약(조화/인도)으로 세분화하고, 이에 따라 생리 작용 기여 가중치(3점/2점/1점)를 계산하여 효능 백분율을 예측합니다.</li>
            </ul>
          </div>
        </div>
      `;
      break;
    case 'bongcho':
      title = "본초강목(本草綱目) — 천연물 성미학의 백과사전";
      html = `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-mortar-pestle"></i> 문헌 소개</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              <strong>본초강목</strong>은 중국 명나라 시대 학자 이시진이 30년에 걸쳐 저술한 방대한 본초학(약용 천연물학) 전문 연구서입니다. 식물, 동물, 광물 등 수천 종의 자연 원물의 상세 성미와 인체 흡수 경로(귀경), 한방 임상 효능을 가장 체계적으로 집대성한 서적입니다.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:8px;">
            <h4 style="color:var(--primary); margin:0; font-size:0.95rem;"><i class="fa-solid fa-circle-nodes"></i> Nuri Lab 연계 및 동적 작동 기능</h4>
            <ul style="margin:0; padding-left:20px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px;">
              <li><strong>귀경(歸經) 오행 밸런스 측정:</strong> 본초강목에 등재된 원료 고유의 작용 장부(간장, 심장, 비장, 위장, 폐장, 신장 등) 정보를 R&D 배합 데이터에서 역파싱하여, 조리된 음식이 신체의 어느 장부에 지배적으로 흡수되고 약리적 영향을 미치는지 점수화해 요약합니다.</li>
              <li><strong>AI 시너지 부스터 추천 엔진:</strong> 본초의 상생 보완 원리에 의거하여, 현재 설계한 레시피의 부족한 기미를 채우거나 맛과 시너지를 극대화해주는 2~3종의 보완 원재료를 R&D 대시보드 내에 실시간 추천 피드로 제공합니다.</li>
            </ul>
          </div>
        </div>
      `;
      break;
    case 'korea':
      title = "한국한의학연구원 및 국가표준식품 데이터";
      html = `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-microscope"></i> 표준 데이터 소개</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              한국한의학연구원(KIOM)의 표준 정보 체계와 농촌진흥청 국가표준식품영양성분표 데이터를 디지털로 융합한 최신 국가 표준 기반 정량화 데이터입니다. 고전문헌 속의 고풍스럽거나 모호한 표기어들을 과학적으로 계량화하여 실제 조리와 R&D에 오차 없이 즉시 가용할 수 있도록 규격화했습니다.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:8px;">
            <h4 style="color:var(--primary); margin:0; font-size:0.95rem;"><i class="fa-solid fa-circle-nodes"></i> Nuri Lab 연계 및 동적 작동 기능</h4>
            <ul style="margin:0; padding-left:20px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px;">
              <li><strong>효능 용어 정규화 사전 (93종):</strong> 동의보감 등 옛 한글/한문 효능 표현(예: 건비위, 사화)을 고정된 현대 영양학적 생리 조절 지표로 통일 매핑하여 신뢰도 높은 처방 연산을 수행합니다.</li>
              <li><strong>7-AXIS 기대 활성 작용 계산:</strong> 1,793행 마스터 온톨로지를 역해결하여 신체의 7대 반응 축(정화, 완화, 흡수, 회복, 순환, 보호, 안정) 기여율을 정량화된 수치와 퍼센트(%)로 변환하여 비즈니스 Claims 마케팅 문구로 자동 합성합니다.</li>
            </ul>
          </div>
        </div>
      `;
      break;
    case 'microbes':
      title = "전통 발효 미생물학 (Fermentation Microbes)";
      html = `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-virus"></i> 한식의 감칠맛과 약성을 빚는 전통 균주</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              전통 발효식품의 약리 작용은 유기물질을 분해하고 유익한 대사산물을 만드는 <strong>전통 발효 미생물</strong>의 활동에서 비롯됩니다.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:10px; font-size:0.88rem;">
            <div>
              <strong style="color:#fff;"><i class="fa-solid fa-circle-check" style="color:var(--primary);"></i> 고초균 (Bacillus subtilis):</strong>
              <p style="margin:3px 0 0 16px; color:var(--text-secondary);">청국장과 된장의 주역균으로, 콩 단백질을 고분자 펩타이드로 쪼개어 장내 유해균을 억제하고 혈전을 분해하며 면역 활성을 돕습니다.</p>
            </div>
            <div>
              <strong style="color:#fff;"><i class="fa-solid fa-circle-check" style="color:var(--primary);"></i> 황국균 (Aspergillus oryzae):</strong>
              <p style="margin:3px 0 0 16px; color:var(--text-secondary);">전통 간장·된장 메주에서 전분과 단백질을 단맛 나는 포도당과 감칠맛 아미노산으로 전환시켜 영양 흡수율을 극대화합니다.</p>
            </div>
            <div>
              <strong style="color:#fff;"><i class="fa-solid fa-circle-check" style="color:var(--primary);"></i> 가양주 효모 (Saccharomyces cerevisiae):</strong>
              <p style="margin:3px 0 0 16px; color:var(--text-secondary);">전통주(우리술) 발효의 핵심으로 포도당을 에탄올과 천연 탄산, 풍부한 비타민 B군 및 유기산으로 전환시킵니다.</p>
            </div>
            <div>
              <strong style="color:#fff;"><i class="fa-solid fa-circle-check" style="color:var(--primary);"></i> 유산균 (Leuconostoc mesenteroides):</strong>
              <p style="margin:3px 0 0 16px; color:var(--text-secondary);">김치 발효 초기에 시원한 탄산미와 천연 젖산을 생성하여 부패균을 차단하고 장벽 면역을 보강합니다.</p>
            </div>
          </div>
        </div>
      `;
      break;
    case 'afaci':
      title = "AFACI 아시아 식품성분 데이터베이스";
      html = `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-globe"></i> 아시아 농식품 기술협력 협의회 표준규격</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              <strong>AFACI(아시아농식품기술협력협의회)</strong>는 아시아 국가 간 식품 자원의 영양성분 데이터를 공유하고 기후변화에 대응하기 위한 다국적 공동 DB 프로젝트입니다.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:8px;">
            <h4 style="color:var(--primary); margin:0; font-size:0.92rem;"><i class="fa-solid fa-circle-nodes"></i> Nuri Lab 벤치마크 설계 반영</h4>
            <ul style="margin:0; padding-left:20px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px; font-size:0.88rem;">
              <li><strong>국제 정규화 규격 준수:</strong> Nuri Lab의 1,793행 마스터 DB는 AFACI가 권장하는 아시아 농식품 분류 체계를 기반으로 하여 해외 허브/차류 및 약용 식재료의 영양 프로필(10g 환산단위)을 통일성 있게 적재하였습니다.</li>
              <li><strong>수출 비즈니스 지원:</strong> B2B R&D 설계기에서 105종 약선 레시피 및 배합비를 해외 웰니스 식자재 및 밀키트 수출 포맷으로 변환(JSON/CSV 내보내기)할 때, 글로벌 호환 규격으로 데이터를 자동 조율합니다.</li>
            </ul>
          </div>
        </div>
      `;
      break;
    case 'sikpumbogam':
      title = "약선본초 식품보감 (51종 핵심 식재료)";
      html = `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-mortar-pestle"></i> 전통 본초학과 현대 영양학의 융합 사전</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              <strong>약선본초 식품보감</strong>은 고전 의학 문헌(동의보감, 본초강목)에 기록된 전통 약성(藥性) 지표와 농촌진흥청 국가표준식품영양성분 DB(10판)를 1:1로 결합한 누리랩의 핵심 식재료 사전입니다.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; font-size:0.88rem; color:var(--text-secondary);">
            <p style="margin:0 0 10px 0;">
              플랫폼에 등재된 <strong>인삼, 황기, 당귀, 우슬, 맥문동, 칡, 둥굴레, 하수오</strong> 등 대표적인 51종 한방 약용 식재료에 대하여 다음 지표가 완벽하게 동적 설계되어 있습니다.
            </p>
            <ul style="margin:0; padding-left:20px; display:flex; flex-direction:column; gap:5px;">
              <li><strong>한열온량(寒熱溫涼):</strong> 온난/냉각의 한방적 성질 조율 지수</li>
              <li><strong>오미(五味) 및 귀경(歸經):</strong> 단맛, 쓴맛 등과 작용 장부 매핑</li>
              <li><strong>과학적 기능 성분:</strong> 사포닌(진세노사이드), 데쿠르신, 이눌린 등 실시간 매핑</li>
              <li><strong>10g 단위 미세 칼로리/영양소 수치:</strong> 소식 및 한방 대사 제어용 가중치</li>
            </ul>
          </div>
        </div>
      `;
      break;
    case 'monthly-ing':
      title = "이달의 추천 절기 식재료 (6월 망종·하지)";
      html = `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-sun"></i> 절기(夏至)에 순응하는 보양 약선</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              여름의 기운이 절정에 달하는 6월(망종·하지)에는 급격한 기온 상승으로 체외는 뜨거워지나 속(비위)은 차가워지기 쉬우며 수분 손실이 큽니다.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; display:flex; flex-direction:column; gap:10px; font-size:0.88rem;">
            <div>
              <strong style="color:#fff;"><span style="color:var(--primary);">🌾 보리, 율무 (맥류):</span></strong>
              <span style="color:var(--text-secondary);">몸속의 과도한 열을 내리고 소화 흡수를 도와 활력을 채웁니다. (태음인 시너지)</span>
            </div>
            <div>
              <strong style="color:#fff;"><span style="color:var(--primary);">🧄 햇마늘:</span></strong>
              <span style="color:var(--text-secondary);">성질이 따뜻하여 배앓이를 막고 저하된 비위의 소화 효소 분비를 촉진합니다. (소음인 시너지)</span>
            </div>
            <div>
              <strong style="color:#fff;"><span style="color:var(--primary);">🟢 매실:</span></strong>
              <span style="color:var(--text-secondary);">강력한 해독, 살균 기능으로 여름철 배탈·식중독을 예방하고 진액을 늘려 갈증을 끕니다.</span>
            </div>
            <div>
              <strong style="color:#fff;"><span style="color:var(--primary);">🥬 두릅, 취나물, 미나리:</span></strong>
              <span style="color:var(--text-secondary);">춘곤증 이후 쌓인 열독을 내보내며 풍부한 칼륨 and 미네랄로 전해질 균형을 지켜줍니다.</span>
            </div>
          </div>
        </div>
      `;
      break;
    case 'sauce':
      title = "전통 한식 양념장 및 발효 기미 설계";
      html = `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <h4 style="color:var(--primary); margin-bottom:6px; font-size:1.05rem;"><i class="fa-solid fa-mortar-pestle"></i> 약성을 보완하고 독성을 제어하는 비법 양념</h4>
            <p style="margin:0; text-align:justify; color:var(--text-main);">
              전통 약선 조리에서 **한식 양념장(Condiments)**은 단순한 조미료를 넘어, 주재료의 찬 기운이나 약리적 독성을 중화하고(상예·상살) 소화율을 극대화하는 중추적인 역할을 담당합니다.
            </p>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:10px; padding:15px; font-size:0.88rem; color:var(--text-secondary);">
            <ul style="margin:0; padding-left:20px; display:flex; flex-direction:column; gap:6px;">
              <li><strong>황기 3년 숙성 된장:</strong> 대두 단백질이 완전 발효되어 소화 장벽을 지키고, 황기의 보기(원기 보충) 성분과 결합하여 비위를 보합니다.</li>
              <li><strong>산사 고추장:</strong> 소화를 활성화하는 산사와 매콤하고 따뜻한 성질의 고추장이 결합하여 위장 온난화 작용을 돕습니다.</li>
              <li><strong>양념 R&D 활용:</strong> R&D 플래너의 <strong style="color:var(--primary);">양념/후식 (slot-sauce)</strong> 슬롯을 통해 이러한 약리 조율용 비법 양념장과 종가 전통 간장을 배합비에 결합하여 완결성 있는 메뉴를 설계할 수 있습니다.</li>
            </ul>
          </div>
        </div>
      `;
      break;
    case 'diet-eval':
      {
        const currentUser = JSON.parse(localStorage.getItem('nuri_current_subscriber') || 'null');
        const userConstitution = currentUser ? currentUser.constitution : '미지정';
        const userName = currentUser ? currentUser.name : '방문자';
        const userConcern = currentUser ? currentUser.concern : '건강 증진';
        
        let constitutionAdvice = "";
        if (userConstitution === '소음인') {
          constitutionAdvice = "비위가 차고 소화 기능이 약해지기 쉬우므로 따뜻한 성질의 인삼, 대추, 황기, 생강 등을 식단에 적극 활용하여 온열 조율과 보기 작용을 강화해야 합니다. 찬 성질의 밀가루나 날음식은 멀리하는 것이 좋습니다.";
        } else if (userConstitution === '소양인') {
          constitutionAdvice = "체내에 속열이 쌓이기 쉽고 신장 기능이 약해지기 쉬우므로, 서늘한 성질의 보리, 녹차, 구기자, 미꾸라지 등을 섭취하여 열을 내리고 음분을 보강해 주는 것이 이롭습니다. 매운 고추장이나 닭고기 등 뜨거운 성질의 과다 섭취는 피하는 것이 좋습니다.";
        } else if (userConstitution === '태음인') {
          constitutionAdvice = "호흡기 및 폐 기능이 다소 약하며 체내에 노폐물(습담)이 정체되기 쉬운 체질입니다. 맥문동, 오미자, 율무, 도라지 등을 섭취하여 폐를 윤택하게 하고 수분 대사를 원활하게 해 주어 노폐물 배출을 촉진하는 식단이 권장됩니다.";
        } else if (userConstitution === '태양인') {
          constitutionAdvice = "간 기능이 부족하고 기운이 상부로 솟구치기 쉬운 기질입니다. 기운을 아래로 내리고 간을 보해주는 오가피, 모과, 메밀, 겨우살이(상기생) 등을 위주로 담백하고 부드러운 식단을 구성하시는 것이 건강 유지에 필수적입니다.";
        } else {
          constitutionAdvice = "신체의 전반적인 기혈 순환과 소화 기능 밸런스를 고르게 유지하기 위해 계절 제철 약선 식재료를 골고루 섭취하시길 권장합니다.";
        }
        
        title = "가입자 식생활 및 사상 체질 평가서";
        html = `
          <div style="display:flex; flex-direction:column; gap:16px;">
            <div style="background:linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(245,158,11,0.08) 100%); border:1px solid var(--primary); border-radius:12px; padding:15px; display:flex; flex-direction:column; gap:6px;">
              <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Nuri Lab Wellness Pass Info</div>
              <div style="font-size:1.25rem; font-weight:800; color:#fff;">${userName} 회원님</div>
              <div style="font-size:0.88rem; color:var(--primary); font-weight:700;"><i class="fa-solid fa-yin-yang"></i> 사상 체질: <span style="font-size:1rem; text-decoration:underline;">${userConstitution}</span></div>
              <div style="font-size:0.82rem; color:var(--text-secondary);"><i class="fa-solid fa-circle-info"></i> 주요 관심사: ${userConcern}</div>
            </div>
            <div>
              <h4 style="color:var(--primary); margin:0 0 6px 0; font-size:0.95rem;"><i class="fa-solid fa-notes-medical"></i> 사상의학 섭식 처방 가이드</h4>
              <p style="margin:0; text-align:justify; color:var(--text-main); font-size:0.88rem; line-height:1.6;">
                ${constitutionAdvice}
              </p>
            </div>
          </div>
        `;
      }
      break;
  }
  
  titleEl.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${title}`;
  bodyEl.innerHTML = html;
  
  const modal = document.getElementById('guide-modal');
  if (modal) {
    modal.classList.add('open');
  }
}

function triggerRdaAction(action) {
  if (['microbes', 'afaci', 'sikpumbogam', 'monthly-ing', 'sauce'].includes(action)) {
    showGuide(action);
    return;
  }
  
  switch (action) {
    case 'local-food':
      switchTab('tab-recipes-wiki');
      const searchInput1 = document.getElementById('recipes-wiki-search');
      if (searchInput1) {
        searchInput1.value = '전통';
        searchInput1.dispatchEvent(new Event('input'));
      }
      break;
    case 'jongga':
      switchTab('tab-recipes-wiki');
      const searchInput2 = document.getElementById('recipes-wiki-search');
      if (searchInput2) {
        searchInput2.value = '종가';
        searchInput2.dispatchEvent(new Event('input'));
      }
      break;
    case 'kimchi':
      switchTab('tab-recipes-wiki');
      const searchInput3 = document.getElementById('recipes-wiki-search');
      if (searchInput3) {
        searchInput3.value = '김치';
        searchInput3.dispatchEvent(new Event('input'));
      }
      break;
    case 'liquor':
      switchTab('tab-shop');
      const shopPills = document.querySelectorAll('.shop-filter-pill');
      let liquorPill = null;
      shopPills.forEach(p => {
        if (p.getAttribute('data-cat') === 'yakseon-liquor') {
          liquorPill = p;
        }
      });
      setShopCategory(liquorPill, 'yakseon-liquor');
      break;
    case 'standard-db':
      switchTab('tab-browser');
      break;
    case 'bioactive':
      switchTab('tab-browser');
      const browserInput1 = document.getElementById('browser-search-input');
      if (browserInput1) {
        browserInput1.value = '사포닌';
        browserInput1.dispatchEvent(new Event('input'));
      }
      break;
    case 'benefits':
      switchTab('tab-browser');
      const browserInput2 = document.getElementById('browser-search-input');
      if (browserInput2) {
        browserInput2.value = '보기';
        browserInput2.dispatchEvent(new Event('input'));
      }
      break;
    case 'diet-eval':
      showGuide('diet-eval');
      break;
    case 'menugen':
      switchTab('tab-recipes-rnd');
      break;
    case 'custom-diet':
      switchTab('tab-recipes-wiki');
      break;
  }
}
window.triggerRdaAction = triggerRdaAction;
window.showGuide = showGuide;

function closeGuideModal() {
  const modal = document.getElementById('guide-modal');
  if (modal) {
    modal.classList.remove('open');
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── MILA 프리미엄 숍 MODULE ────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

let shopCart = [];
let shopCurrentCategory = 'all';

const SHOP_PRODUCTS = [
  // ── 전통 주류 ──
  {
    id:'liq-01', category:'yakseon-liquor', categoryLabel:'전통 약선 주류', emoji:'🍶',
    name:'오미자 수제 정제 막걸리', subname:'Five-Berry Premium Makgeolli',
    desc:'강원도 산기슭 청정 오미자를 직접 누룩에 발효하여 빚은 프리미엄 탁주. 부드러운 산미와 깊은 단맛이 균형을 이루는 웰니스 막걸리.',
    price:28000, unit:'750ml / 1병',
    constitution:['소음인','태음인'], constitutionLabel:'Warm — 소음인·태음인 체질 시너지', constitutionType:'warm',
    badge:'수제 발효', stock:48,
    image:'omija_makgeolli.png',
    nutrition: { serving: '100ml당', energy: '110 kcal', carbs: '12g', protein: '1.5g', fat: '0g', sodium: '5.0mg' },
    rdLinkage: { functions: ['SF016 진액생성 (오미자)', 'SF020 순환개선 (전통발효)'], axes: ['안정', '순환'] },
    brewingGuide: '차갑게 보관 후 가볍게 흔들어 잔에 따라 음용하십시오. (음용 권장 온도: 4~6℃)',
    warning: '알코올 도수 8% 제품으로 과도한 음용을 피하고, 임산부 및 미성년자는 섭취할 수 없습니다.'
  },
  {
    id:'liq-02', category:'yakseon-liquor', categoryLabel:'전통 약선 주류', emoji:'🍶',
    name:'황국 전통 약주 (菊花釀)', subname:'Chrysanthemum Heritage Yakju',
    desc:'황금빛 국화꽃과 구기자를 넣어 저온 숙성한 양조식 약주. 간기능 보호와 안정 효능으로 동의보감에 수록된 처방 주류.',
    price:45000, unit:'500ml / 1병',
    constitution:['소양인','태음인'], constitutionLabel:'Cool — 소양인·태음인 체질 시너지', constitutionType:'cool',
    badge:'동의보감 처방', stock:22,
    nutrition: { serving: '100ml당', energy: '130 kcal', carbs: '8g', protein: '0.4g', fat: '0g', sodium: '3.0mg' },
    rdLinkage: { functions: ['SF024 간보호 (국화)', 'SF023 신경안정 (구기자)'], axes: ['보호', '안정'] },
    brewingGuide: '상온이나 약간 서늘하게(10℃) 한 뒤, 국화꽃의 향을 음미하며 천천히 마십니다.',
    warning: '꽃 알레르기가 있는 분은 섭취 전 성분을 확인하십시오.'
  },
  {
    id:'liq-03', category:'yakseon-liquor', categoryLabel:'전통 약선 주류', emoji:'🍶',
    name:'홍삼 침출 프리미엄 소주', subname:'Red Ginseng Infused Premium Soju',
    desc:'6년근 홍삼을 45일간 순쌀 소주에 침출한 한방 기운 보양 증류주. 기력 보충 및 면역 활성화에 탁월.',
    price:62000, unit:'360ml / 1병',
    constitution:['소음인','태양인'], constitutionLabel:'Warm — 소음인·태양인 체질 시너지', constitutionType:'warm',
    badge:'6년근 홍삼', stock:15,
    nutrition: { serving: '50ml당', energy: '120 kcal', carbs: '1.2g', protein: '0g', fat: '0g', sodium: '0.5mg' },
    rdLinkage: { functions: ['SF012 보기 (원기회복)', 'SF005 면역력강화 (홍삼사포닌)'], axes: ['회복', '보호'] },
    brewingGuide: '작은 소주잔에 따라 한 번에 마시기보다 입안에 살짝 머금어 향을 느끼며 마십니다.',
    warning: '고혈압 환자나 몸에 열이 매우 많은 분은 하루 2잔 이하 섭취를 권장합니다.'
  },
  // ── 고급 쌀류 ──
  {
    id:'rice-01', category:'grain-bean', categoryLabel:'곡류 & 두류', emoji:'🌾',
    name:'오대산 유기농 백미 (특등품)', subname:'Odaesan Premium Organic White Rice',
    desc:'강원도 오대산 해발 700m 이상 청정 지역 유기농 쌀. 밥맛의 찰기와 윤기가 남다르며 소화 흡수율이 높아 약선 요리의 기본재.',
    price:38000, unit:'5kg / 1포',
    constitution:['소음인','태음인','소양인','태양인'], constitutionLabel:'전 체질 — 기본 보양 곡물', constitutionType:'neutral',
    badge:'유기농 인증', stock:80,
    nutrition: { serving: '10g (취반 전 기준)', energy: '35 kcal', carbs: '7.8g', protein: '0.6g', fat: '0.1g', sodium: '0.2mg' },
    rdLinkage: { functions: ['SF015 비위보호 (소화증진)', 'SF012 보기 (기력보강)'], axes: ['보호', '회복'] },
    brewingGuide: '깨끗이 씻은 후 물에 30분 불려 가마솥 혹은 압력솥에 밥을 지으십시오.',
    warning: '직사광선을 피하고 통풍이 잘되는 서늘한 곳이나 냉장 보관하십시오.'
  },
  {
    id:'rice-02', category:'grain-bean', categoryLabel:'곡류 & 두류', emoji:'🌾',
    name:'적미·흑미 블렌드 잡곡세트', subname:'Red & Black Mixed Grain Set',
    desc:'항산화 안토시아닌이 풍부한 토종 적미와 흑미 황금 비율 혼합. 혈중 순환 개선과 진액 보충에 도움.',
    price:42000, unit:'3kg / 1세트',
    constitution:['소양인','태음인'], constitutionLabel:'Cool — 소양인·태음인 체질 시너지', constitutionType:'cool',
    badge:'토종 잡곡', stock:35,
    nutrition: { serving: '10g (취반 전 기준)', energy: '36 kcal', carbs: '7.7g', protein: '0.7g', fat: '0.2g', sodium: '0.1mg' },
    rdLinkage: { functions: ['SF020 순환개선 (안토시아닌)', 'SF016 진액생성 (영양보충)'], axes: ['순환', '정화'] },
    brewingGuide: '백미와 잡곡을 7:3의 비율로 혼합하여 밥을 지으면 찰기와 영양이 조화를 이룹니다.',
    warning: '소화력이 극도로 떨어진 소음인은 잡곡 비율을 10% 이하로 줄여 드시는 것이 좋습니다.'
  },
  // ── 전통 수제 장류 ──
  {
    id:'paste-01', category:'paste-condiment', categoryLabel:'발효 & 조미료', emoji:'🏺',
    name:'전통 3년 숙성 된장 (옹기 항아리)', subname:'Traditional 3-Year Aged Doenjang',
    desc:'100% 국산 대두로 메주를 빚어 전통 옹기에 3년 자연 발효한 된장. 깊은 감칠맛과 풍부한 프로바이오틱스.',
    price:55000, unit:'500g / 1옹기',
    constitution:['소음인','태음인'], constitutionLabel:'Warm — 소음인·태음인 체질 시너지', constitutionType:'warm',
    badge:'3년 자연 발효', stock:30,
    nutrition: { serving: '10g 기준', energy: '15 kcal', carbs: '1.6g', protein: '1.2g', fat: '0.5g', sodium: '320mg' },
    rdLinkage: { functions: ['SF015 비위보호 (유산균)', 'SF006 항산화 (대두발효성분)'], axes: ['보호', '정화'] },
    brewingGuide: '찌개나 국을 끓일 때 불을 끄기 5분 전에 된장을 풀어 끓여야 유익균 손실을 최소화합니다.',
    warning: '염도가 있으므로 고혈압이나 신장 질환자는 과다 섭취에 주의하고 조리 시 양을 조절하십시오.'
  },
  {
    id:'paste-02', category:'paste-condiment', categoryLabel:'발효 & 조미료', emoji:'🏺',
    name:'청양 수제 고추장 (전통 방식)', subname:'Cheongyang Hand-Made Gochujang',
    desc:'청양 고춧가루와 찹쌀 발효물로 만든 수제 고추장. 대사 활성화와 소화 촉진에 도움.',
    price:38000, unit:'500g / 1단지',
    constitution:['소음인','태양인'], constitutionLabel:'Warm — 소음인·태양인 체질 시너지', constitutionType:'warm',
    badge:'수제 전통', stock:45,
    nutrition: { serving: '10g 기준', energy: '22 kcal', carbs: '4.8g', protein: '0.6g', fat: '0.1g', sodium: '280mg' },
    rdLinkage: { functions: ['SF015 비위보호 (소화촉진)', 'SF020 순환개선 (캡사이신)'], axes: ['순환', '정화'] },
    brewingGuide: '무침 요리나 찌개 조림의 양념 베이스로 적절히 환산하여 조리에 사용하십시오.',
    warning: '위염, 위궤양이 있거나 소양인 체질 중 위열이 높은 분은 과다 섭취를 삼가십시오.'
  },
  {
    id:'paste-03', category:'paste-condiment', categoryLabel:'발효 & 조미료', emoji:'🏺',
    name:'전통 조선 간장 (2년 저온 숙성)', subname:'Traditional Joseon Soy Sauce',
    desc:'콩 단일 원료로 2년 이상 자연 숙성. 나트륨 낮고 아미노산 풍부 — 혈압 조절과 신장 기능 보호.',
    price:48000, unit:'500ml / 1병',
    constitution:['소양인','태음인'], constitutionLabel:'Cool — 소양인·태음인 체질 시너지', constitutionType:'cool',
    badge:'2년 저온 숙성', stock:28,
    nutrition: { serving: '10ml 기준', energy: '6 kcal', carbs: '0.8g', protein: '0.7g', fat: '0g', sodium: '680mg' },
    rdLinkage: { functions: ['SF025 신장보호 (체액조절)', 'SF020 순환개선 (혈행안정)'], axes: ['보호', '순환'] },
    brewingGuide: '국물 요리의 간을 맞추거나 나물 무침의 밑간용 조미료로 극소량 사용합니다.',
    warning: '나트륨 함량이 높으므로 1회 조리 시 15ml(1큰술) 이내 사용을 권장합니다.'
  },
  // ── 특선 약초류 ──
  {
    id:'herb-01', category:'herb-veg', categoryLabel:'약초 & 채소/버섯류', emoji:'🌿',
    name:'강원 야생 황기 (黃芪)', subname:'Premium Astragalus Root (Hwanggi)',
    desc:'해발 600m 이상 청정 지역 야생 황기. 기력 보충·면역 강화의 으뜸 약재. 삼계탕, 보양탕의 핵심 본초.',
    price:32000, unit:'100g / 건초',
    constitution:['소음인','태음인'], constitutionLabel:'Warm — 소음인·태음인 체질 시너지', constitutionType:'warm',
    badge:'야생 채취', stock:50,
    nutrition: { serving: '10g 기준', energy: '28 kcal', carbs: '6.2g', protein: '0.8g', fat: '0.1g', sodium: '1.5mg' },
    rdLinkage: { functions: ['SF012 보기 (원기충전)', 'SF005 면역력강화 (다당체)'], axes: ['회복', '보호'] },
    brewingGuide: '황기 20g에 물 1L를 붓고 약불에서 40분간 달여 차로 마시거나 삼계탕 조리 시 넣어 우려냅니다.',
    warning: '몸에 열이 많고 얼굴이 붉은 소양인 체질이나 급성 염증성 질환자는 피하시는 것이 좋습니다.'
  },
  {
    id:'herb-02', category:'herb-veg', categoryLabel:'약초 & 채소/버섯류', emoji:'🌿',
    name:'지리산 구기자 (枸杞子)', subname:'Jirisan Premium Goji Berry',
    desc:'지리산 청정 계곡 주변 토종 구기자. 간신 보양, 눈 기능 개선, 노화 방지에 탁월.',
    price:28000, unit:'100g / 건조',
    constitution:['소양인','태음인'], constitutionLabel:'Cool — 소양인·태음인 체질 시너지', constitutionType:'cool',
    badge:'토종 지리산', stock:60,
    nutrition: { serving: '10g 기준', energy: '32 kcal', carbs: '5.8g', protein: '1.2g', fat: '0.4g', sodium: '8.2mg' },
    rdLinkage: { functions: ['SF025 신장보호 (정액보충)', 'SF024 간보호 (피로회복)'], axes: ['보호', '회복'] },
    brewingGuide: '물 1L에 가볍게 볶은 구기자 15g을 넣고 30분간 끓여 식후 차로 음용하십시오.',
    warning: '대변이 묽거나 설사가 잦은 분은 구기자의 서늘한 성질로 인해 설사가 심해질 수 있습니다.'
  },
  // ── 국산 차류 ──
  {
    id:'tea-01', category:'tea-drink', categoryLabel:'전통차 & 음료류', emoji:'🍵',
    name:'보성 야생 녹차 (우전 등급)', subname:'Boseong Wild Green Tea — Ujeon Grade',
    desc:'전남 보성 첫물 찻잎 4월 우전 등급. 카테킨과 테아닌 함량 최고치 — 항산화와 정신 집중력 강화에 최적.',
    price:68000, unit:'50g / 금속 캔',
    constitution:['소양인','태양인'], constitutionLabel:'Cool — 소양인·태양인 체질 시너지', constitutionType:'cool',
    badge:'우전 1등급', stock:20,
    nutrition: { serving: '2g (1회 우림 기준)', energy: '1 kcal', carbs: '0.2g', protein: '0.1g', fat: '0g', sodium: '0.0mg' },
    rdLinkage: { functions: ['SF006 항산화 (카테킨)', 'SF023 신경안정 (테아닌)'], axes: ['정화', '안정'] },
    brewingGuide: '70~80℃로 식힌 따뜻한 물 150ml에 녹찻잎 2g을 넣고 1분 30초간 우려내어 음용합니다.',
    warning: '카페인 성분이 들어있으므로 불면증이 있거나 카페인에 예민한 분은 늦은 저녁 음용을 피하십시오.'
  },
  {
    id:'tea-02', category:'tea-drink', categoryLabel:'전통차 & 음료류', emoji:'🍵',
    name:'황차 (黃茶) — 구증구포 제다', subname:'Korean Yellow Tea — 9x Steamed',
    desc:'전통 구증구포 방식으로 만든 황차. 소화 촉진과 혈당 조절, 위장 안정에 탁월.',
    price:82000, unit:'50g / 전통 포장',
    constitution:['소음인','태음인'], constitutionLabel:'Warm — 소음인·태음인 체질 시너지', constitutionType:'warm',
    badge:'구증구포', stock:18,
    nutrition: { serving: '2g (1회 우림 기준)', energy: '2 kcal', carbs: '0.3g', protein: '0.1g', fat: '0g', sodium: '0.0mg' },
    rdLinkage: { functions: ['SF015 비위보호 (소화안정)', 'SF020 순환개선 (혈당조절)'], axes: ['보호', '순환'] },
    brewingGuide: '85~90℃의 뜨거운 물 200ml에 황차 2.5g을 넣고 2분간 우려 마십니다. 여러 번 재우림이 가능합니다.',
    warning: '공복에 너무 많이 마시면 속이 쓰릴 수 있으니 식후 30분에 마시는 것을 권장합니다.'
  },
  // ── 허브·꽃차 ──
  {
    id:'htea-01', category:'tea-drink', categoryLabel:'전통차 & 음료류', emoji:'🌸',
    name:'한라산 야생 민들레 꽃차', subname:'Hallasan Wild Dandelion Flower Tea',
    desc:'청정 한라산 야생 민들레를 손으로 채취하여 저온 건조한 꽃차. 간열 해소, 이뇨 작용, 소화 개선.',
    price:24000, unit:'30g / 한지 포장',
    constitution:['소양인','태양인'], constitutionLabel:'Cool — 소양인·태양인 체질 시너지', constitutionType:'cool',
    badge:'한라산 야생', stock:40,
    nutrition: { serving: '2g (1회 우림 기준)', energy: '1 kcal', carbs: '0.2g', protein: '0.0g', fat: '0.0g', sodium: '0.1mg' },
    rdLinkage: { functions: ['SF024 간보호 (열독제거)', 'SF015 비위보호 (소염작용)'], axes: ['보호', '정화'] },
    brewingGuide: '100℃의 끓는 물 150ml에 건조 꽃송이 2~3개를 띄우고 꽃이 활짝 피어날 때(3분)까지 우려 마십니다.',
    warning: '차가운 성질이 강하므로 아랫배가 차거나 위장이 얇아 설사가 잦은 분은 장복을 피하십시오.'
  },
  {
    id:'htea-02', category:'tea-drink', categoryLabel:'전통차 & 음료류', emoji:'🌸',
    name:'제주 한방 쑥차 (삼년쑥)', subname:'Jeju 3-Year Aged Mugwort Tea',
    desc:'3년간 저장 숙성한 제주 쑥으로 만든 따뜻한 쑥차. 냉체질 개선, 위장 온열, 여성 생리 불순 완화.',
    price:22000, unit:'30g / 한지 포장',
    constitution:['소음인','태음인'], constitutionLabel:'Warm — 소음인·태음인 체질 시너지', constitutionType:'warm',
    badge:'3년 숙성', stock:55,
    nutrition: { serving: '2g (1회 우림 기준)', energy: '2 kcal', carbs: '0.4g', protein: '0.1g', fat: '0g', sodium: '0.2mg' },
    rdLinkage: { functions: ['SF020 순환개선 (온열활혈)', 'SF015 비위보호 (위장온난)'], axes: ['순환', '회복'] },
    brewingGuide: '90℃ 온수 200ml에 건조 쑥잎 2g을 넣고 2분간 우려냅니다. 은은한 쑥 향과 쌉싸름한 맛이 특징입니다.',
    warning: '체내에 열이 가득 차 마른기침을 하거나 얼굴 홍조가 심한 분은 주의하여 음용하십시오.'
  },
  // ── 간편 영양식 ──
  {
    id:'nutr-01', category:'prepared-meal', categoryLabel:'약선 조리식품', emoji:'🥗',
    name:'약선 조식 영양 죽 세트 (5종)', subname:'Medicinal Morning Porridge Set',
    desc:'흑임자죽, 잣죽, 호박죽, 단호박죽, 팥죽 — 아침을 대신하는 프리미엄 약선 죽 5종 세트.',
    price:52000, unit:'5종 × 2인분',
    constitution:['소음인','태음인'], constitutionLabel:'Warm — 소음인·태음인 체질 시너지', constitutionType:'warm',
    badge:'조식 대용', stock:38,
    nutrition: { serving: '1팩 (150g 기준)', energy: '125 kcal', carbs: '25g', protein: '4.2g', fat: '1.1g', sodium: '180mg' },
    rdLinkage: { functions: ['SF015 비위보호 (장내안정)', 'SF012 보기 (기력충전)'], axes: ['보호', '회복'] },
    brewingGuide: '팩 그대로 끓는 물에 5분간 중탕하거나, 전자레인지 용기에 덜어 2분간 데워 따뜻하게 섭취하십시오.',
    warning: '전자레인지 조리 시 봉지째 직접 가열하지 마시고 반드시 전용 용기에 덜어 조리하십시오.'
  },
  {
    id:'nutr-02', category:'prepared-meal', categoryLabel:'약선 조리식품', emoji:'🥗',
    name:'독서·정신노동 집중 약선 에너지바', subname:'Cognitive Wellness Energy Bar',
    desc:'황기, 인삼, 맥문동, 오미자를 천연 견과류와 배합한 K-식물성 에너지바. 독서·정신노동 후 안정식.',
    price:36000, unit:'6개입 / 1박스',
    constitution:['소양인','소음인'], constitutionLabel:'Neutral — 소음인·소양인 체질 시너지', constitutionType:'neutral',
    badge:'집중력 증진', stock:72,
    nutrition: { serving: '1개 (35g 기준)', energy: '145 kcal', carbs: '22g', protein: '3.5g', fat: '4.8g', sodium: '45mg' },
    rdLinkage: { functions: ['SF012 보기 (원기회복)', 'SF023 신경안정 (스트레스완화)'], axes: ['회복', '안정'] },
    brewingGuide: '바쁜 일상 중 간식으로, 혹은 운동 및 정신노동 전후로 1개씩 꼭꼭 씹어서 물과 함께 섭취하십시오.',
    warning: '견과류가 함유되어 있어 견과류 알레르기가 있으신 분은 섭취에 각별한 주의가 필요합니다.'
  },
];

function setShopCategory(btn, cat) {
  shopCurrentCategory = cat;
  document.querySelectorAll('.shop-filter-pill').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderShopProducts();
}

function renderShopProducts() {
  const grid = document.getElementById('shop-product-grid');
  if (!grid) return;

  const currentUser = JSON.parse(localStorage.getItem('nuri_current_subscriber') || 'null');
  const userConstitution = currentUser ? currentUser.constitution : null;
  const filterActive = document.getElementById('constitution-filter-toggle') ? document.getElementById('constitution-filter-toggle').checked : false;
  const isMember = !!currentUser;

  const toggleWrap = document.getElementById('constitution-toggle-wrap');
  if (toggleWrap) {
    toggleWrap.style.display = (userConstitution && userConstitution !== '일반') ? 'flex' : 'none';
  }

  let products = SHOP_PRODUCTS;
  if (shopCurrentCategory !== 'all') {
    products = products.filter(p => p.category === shopCurrentCategory);
  }
  if (filterActive && userConstitution && userConstitution !== '일반') {
    products = products.filter(p => p.constitution.includes(userConstitution));
  }

  if (products.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted);"><i class="fa-solid fa-box-open" style="font-size:3rem;margin-bottom:16px;display:block;opacity:0.4;"></i><p>해당 조건의 상품이 없습니다.</p></div>';
    return;
  }

  grid.innerHTML = products.map(function(p) {
    const isMatch = userConstitution && userConstitution !== '일반' && p.constitution.includes(userConstitution);
    const memberPrice = isMember ? Math.round(p.price * 0.9) : p.price;
    const inCart = shopCart.find(c => c.product.id === p.id);
    const cartQty = inCart ? inCart.qty : 0;

    const constitutionBadgeHtml = isMatch
      ? '<span class="shop-constitution-badge ' + p.constitutionType + '"><i class="fa-solid fa-yin-yang"></i> ' + p.constitutionLabel + '</span>'
      : '';

    const priceHtml = isMember
      ? '<span class="shop-original-price">₩' + p.price.toLocaleString() + '</span><span class="shop-price">₩' + memberPrice.toLocaleString() + '</span><span class="shop-discount-badge">멤버십 10% 할인</span>'
      : '<span class="shop-price">₩' + memberPrice.toLocaleString() + '</span>';

    const actionHtml = cartQty > 0
      ? '<div class="shop-qty-control"><button class="qty-btn" onclick="updateCartQty(\'' + p.id + '\',' + (cartQty-1) + ')">−</button><span class="qty-display">' + cartQty + '</span><button class="qty-btn" onclick="updateCartQty(\'' + p.id + '\',' + (cartQty+1) + ')">+</button></div>'
      : '<button class="btn btn-primary shop-add-btn" onclick="addToCart(\'' + p.id + '\')"><i class="fa-solid fa-cart-plus"></i> 담기</button>';

    return '<div class="shop-product-card' + (isMatch ? ' constitution-match' : '') + '" onclick="openProductDetail(\'' + p.id + '\')">' +
      '<div class="shop-card-header"><span class="shop-cat-emoji">' + p.emoji + '</span>' +
      '<div class="shop-badges"><span class="shop-cat-label">' + p.categoryLabel + '</span><span class="shop-handmade-badge">' + p.badge + '</span></div>' +
      constitutionBadgeHtml + '</div>' +
      '<div class="shop-card-body"><h3 class="shop-product-name">' + p.name + '</h3>' +
      '<p class="shop-product-subname">' + p.subname + '</p>' +
      '<p class="shop-product-desc">' + p.desc + '</p></div>' +
      '<div class="shop-card-footer" onclick="event.stopPropagation()"><div class="shop-price-block">' + priceHtml + '<span class="shop-unit">' + p.unit + '</span></div>' +
      '<div class="shop-cart-action">' + actionHtml + '</div></div></div>';
  }).join('');
}

function addToCart(productId) {
  const product = SHOP_PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const existing = shopCart.find(c => c.product.id === productId);
  if (existing) { existing.qty++; } else { shopCart.push({ product: product, qty: 1 }); }
  updateCartUI();
  renderShopProducts();
  const fab = document.getElementById('cart-fab');
  if (fab) { fab.classList.add('cart-fab-pulse'); setTimeout(function(){ fab.classList.remove('cart-fab-pulse'); }, 600); }
}

function updateCartQty(productId, newQty) {
  if (newQty <= 0) {
    shopCart = shopCart.filter(c => c.product.id !== productId);
  } else {
    const item = shopCart.find(c => c.product.id === productId);
    if (item) item.qty = newQty;
  }
  updateCartUI();
  renderShopProducts();
  renderCartDrawer();
}

function updateCartUI() {
  const totalQty = shopCart.reduce(function(s, c){ return s + c.qty; }, 0);
  const badge = document.getElementById('cart-fab-badge');
  const fab = document.getElementById('cart-fab');
  if (badge) badge.textContent = totalQty;
  if (fab) fab.style.display = totalQty > 0 ? 'flex' : 'none';
  renderCartDrawer();
}

function renderCartDrawer() {
  const list = document.getElementById('cart-items-list');
  const emptyMsg = document.getElementById('cart-empty-msg');
  const footer = document.getElementById('cart-footer');
  const discountRow = document.getElementById('cart-discount-row');
  if (!list) return;
  const currentUser = JSON.parse(localStorage.getItem('nuri_current_subscriber') || 'null');
  const isMember = !!currentUser;

  if (shopCart.length === 0) {
    if (emptyMsg) emptyMsg.style.display = 'flex';
    list.innerHTML = '';
    if (footer) footer.style.display = 'none';
    return;
  }
  if (emptyMsg) emptyMsg.style.display = 'none';
  if (footer) footer.style.display = 'block';

  let subtotal = 0;
  list.innerHTML = shopCart.map(function(item) {
    const p = item.product, qty = item.qty;
    const unitPrice = isMember ? Math.round(p.price * 0.9) : p.price;
    const lineTotal = unitPrice * qty;
    subtotal += lineTotal;
    return '<div class="cart-item">' +
      '<div class="cart-item-info"><span class="cart-item-emoji">' + p.emoji + '</span>' +
      '<div><div class="cart-item-name">' + p.name + '</div>' +
      '<div style="font-size:0.75rem;color:var(--text-muted);">' + p.unit + '</div></div></div>' +
      '<div class="cart-item-controls">' +
      '<div class="shop-qty-control" style="transform:scale(0.85);">' +
      '<button class="qty-btn" onclick="updateCartQty(\'' + p.id + '\',' + (qty-1) + ')">−</button>' +
      '<span class="qty-display">' + qty + '</span>' +
      '<button class="qty-btn" onclick="updateCartQty(\'' + p.id + '\',' + (qty+1) + ')">+</button></div>' +
      '<span class="cart-item-price">₩' + lineTotal.toLocaleString() + '</span>' +
      '<button class="cart-item-remove" onclick="updateCartQty(\'' + p.id + '\',0)" title="삭제"><i class="fa-solid fa-xmark"></i></button>' +
      '</div></div>';
  }).join('');

  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  const discountEl = document.getElementById('cart-discount');
  if (subtotalEl) subtotalEl.textContent = '₩' + subtotal.toLocaleString();

  if (isMember) {
    const originalSubtotal = shopCart.reduce(function(s, item){ return s + item.product.price * item.qty; }, 0);
    const discount = originalSubtotal - subtotal;
    if (discountRow) discountRow.style.display = 'flex';
    if (discountEl) discountEl.textContent = '-₩' + discount.toLocaleString();
  } else {
    if (discountRow) discountRow.style.display = 'none';
  }
  if (totalEl) totalEl.textContent = '₩' + subtotal.toLocaleString();
}

function toggleCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  if (!drawer) return;
  renderCartDrawer();
  drawer.classList.toggle('open');
  if (overlay) overlay.classList.toggle('open');
  document.body.classList.toggle('drawer-open');
}

function openCheckoutModal() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  if (drawer) drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  document.body.classList.remove('drawer-open');

  const currentUser = JSON.parse(localStorage.getItem('nuri_current_subscriber') || 'null');
  const isMember = !!currentUser;
  const userName = currentUser ? currentUser.name : '';
  const userEmail = currentUser ? currentUser.email : '';

  const subtotal = shopCart.reduce(function(s, item) {
    const unitPrice = isMember ? Math.round(item.product.price * 0.9) : item.product.price;
    return s + unitPrice * item.qty;
  }, 0);

  const itemsHtml = shopCart.map(function(item) {
    const p = item.product, qty = item.qty;
    const unitPrice = isMember ? Math.round(p.price * 0.9) : p.price;
    return '<div class="checkout-item-row"><span>' + p.emoji + ' ' + p.name + ' × ' + qty + '</span><span>₩' + (unitPrice * qty).toLocaleString() + '</span></div>';
  }).join('');

  const memberBadgeHtml = isMember
    ? '<div class="checkout-item-row" style="color:#10b981;font-size:0.82rem;"><span><i class="fa-solid fa-tag"></i> 멤버십 10% 할인 적용</span><span></span></div>'
    : '';

  const body = document.getElementById('checkout-modal-body');
  body.innerHTML =
    '<div class="checkout-form">' +
    '<div class="checkout-section-title"><i class="fa-solid fa-user"></i> 주문자 정보</div>' +
    '<div class="checkout-grid">' +
    '<div class="control-group"><label>이름 (실명)</label><input type="text" id="co-name" value="' + userName + '" placeholder="홍길동" style="width:100%;padding:10px;background:rgba(0,0,0,0.3);border:1px solid var(--border-glass);border-radius:8px;color:#fff;"></div>' +
    '<div class="control-group"><label>이메일</label><input type="email" id="co-email" value="' + userEmail + '" placeholder="example@gmail.com" style="width:100%;padding:10px;background:rgba(0,0,0,0.3);border:1px solid var(--border-glass);border-radius:8px;color:#fff;"></div>' +
    '</div>' +
    '<div class="checkout-section-title" style="margin-top:20px;"><i class="fa-solid fa-truck"></i> 배송 정보</div>' +
    '<div class="checkout-grid">' +
    '<div class="control-group" style="grid-column:span 2;"><label>수령인 이름</label><input type="text" id="co-receiver" value="' + userName + '" placeholder="수령인 이름" style="width:100%;padding:10px;background:rgba(0,0,0,0.3);border:1px solid var(--border-glass);border-radius:8px;color:#fff;"></div>' +
    '<div class="control-group" style="grid-column:span 2;"><label>연락처</label><input type="tel" id="co-phone" placeholder="010-0000-0000" style="width:100%;padding:10px;background:rgba(0,0,0,0.3);border:1px solid var(--border-glass);border-radius:8px;color:#fff;"></div>' +
    '<div class="control-group" style="grid-column:span 2;"><label>배송 주소</label><input type="text" id="co-address" placeholder="서울특별시 강남구..." style="width:100%;padding:10px;background:rgba(0,0,0,0.3);border:1px solid var(--border-glass);border-radius:8px;color:#fff;"></div>' +
    '<div class="control-group" style="grid-column:span 2;"><label>배송 메모 (선택)</label><input type="text" id="co-memo" placeholder="예: 문 앞에 놓아주세요" style="width:100%;padding:10px;background:rgba(0,0,0,0.3);border:1px solid var(--border-glass);border-radius:8px;color:#fff;"></div>' +
    '</div>' +
    '<div class="checkout-section-title" style="margin-top:20px;"><i class="fa-solid fa-receipt"></i> 주문 상품 확인</div>' +
    '<div class="checkout-order-items">' + itemsHtml + memberBadgeHtml +
    '<div class="checkout-item-row checkout-total-row"><span>최종 결제 금액</span><span style="font-size:1.3rem;font-weight:800;color:var(--primary);">₩' + subtotal.toLocaleString() + '</span></div>' +
    '</div>' +
    '<button class="btn btn-primary" style="width:100%;margin-top:20px;padding:15px;font-size:1.05rem;font-weight:700;" onclick="submitOrder()">' +
    '<i class="fa-solid fa-check-circle"></i> 주문 완료하기</button></div>';

  document.getElementById('checkout-modal').classList.add('open');
}

function closeCheckoutModal() {
  const m = document.getElementById('checkout-modal');
  if (m) m.classList.remove('open');
}

function submitOrder() {
  const name = (document.getElementById('co-name') || {}).value || '';
  const email = (document.getElementById('co-email') || {}).value || '';
  const receiver = (document.getElementById('co-receiver') || {}).value || '';
  const phone = (document.getElementById('co-phone') || {}).value || '';
  const address = (document.getElementById('co-address') || {}).value || '';

  if (!name.trim() || !email.trim() || !receiver.trim() || !phone.trim() || !address.trim()) {
    alert('모든 필수 항목을 입력해 주세요.');
    return;
  }

  const orderNo = 'NL-' + Date.now().toString().slice(-8);
  const currentUser = JSON.parse(localStorage.getItem('nuri_current_subscriber') || 'null');
  const isMember = !!currentUser;
  const subtotal = shopCart.reduce(function(s, item) {
    const unitPrice = isMember ? Math.round(item.product.price * 0.9) : item.product.price;
    return s + unitPrice * item.qty;
  }, 0);
  const now = new Date();
  const dateStr = now.toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' });

  const itemsHtml = shopCart.map(function(item) {
    const p = item.product, qty = item.qty;
    const unitPrice = isMember ? Math.round(p.price * 0.9) : p.price;
    return '<div class="receipt-row" style="font-size:0.85rem;"><span>' + p.emoji + ' ' + p.name + ' × ' + qty + '</span><span>₩' + (unitPrice * qty).toLocaleString() + '</span></div>';
  }).join('');

  const memberNoteHtml = isMember
    ? '<div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);border-radius:8px;padding:10px 14px;margin-top:10px;font-size:0.82rem;color:#10b981;display:flex;align-items:center;gap:8px;"><i class="fa-solid fa-tag"></i> 멤버십 10% 특별 할인이 적용되었습니다.</div>'
    : '';

  const body = document.getElementById('checkout-modal-body');
  body.innerHTML =
    '<div class="order-receipt">' +
    '<div class="receipt-header">' +
    '<div class="receipt-logo" style="display:flex;align-items:center;justify-content:center;gap:8px;"><img src="logo.png" alt="Logo" style="width:24px; height:24px; object-fit:contain; border-radius:6px;"> Nuri Lab × Mila Shop</div>' +
    '<div class="receipt-check"><i class="fa-solid fa-circle-check" style="color:#10b981;font-size:3rem;"></i></div>' +
    '<h2 style="color:#fff;margin:12px 0 4px;font-family:Outfit,sans-serif;">주문이 완료되었습니다!</h2>' +
    '<p style="color:var(--text-muted);font-size:0.88rem;">웰니스 에너지가 곧 배송됩니다 ✨</p>' +
    '</div>' +
    '<div class="receipt-body">' +
    '<div class="receipt-row"><span>주문 번호</span><span style="font-weight:700;color:var(--primary);">' + orderNo + '</span></div>' +
    '<div class="receipt-row"><span>주문 일시</span><span>' + dateStr + '</span></div>' +
    '<div class="receipt-row"><span>주문자</span><span>' + name + '</span></div>' +
    '<div class="receipt-row"><span>이메일</span><span>' + email + '</span></div>' +
    '<div class="receipt-row" style="border-top:1px dashed rgba(255,255,255,0.1);margin-top:10px;padding-top:10px;"><span>배송 주소</span><span style="text-align:right;max-width:200px;">' + address + '</span></div>' +
    '<div style="margin-top:16px;background:rgba(0,0,0,0.2);border-radius:10px;padding:12px;border:1px solid var(--border-glass);">' +
    itemsHtml +
    '<div class="receipt-row" style="border-top:1px solid rgba(255,255,255,0.1);margin-top:10px;padding-top:10px;font-weight:800;font-size:1.05rem;"><span>최종 결제</span><span style="color:var(--primary);">₩' + subtotal.toLocaleString() + '</span></div>' +
    '</div>' +
    memberNoteHtml +
    '</div>' +
    '<button class="btn btn-outline" style="width:100%;margin-top:20px;font-weight:600;" onclick="closeCheckoutAndReset()"><i class="fa-solid fa-shop"></i> 계속 쇼핑하기</button>' +
    '</div>';

  shopCart = [];
  updateCartUI();
}

function closeCheckoutAndReset() {
  closeCheckoutModal();
  renderShopProducts();
}

function showBioactiveBenefit(compName) {
  const desc = (window.bioactiveBenefits && window.bioactiveBenefits[compName]) || "천연 유기 화합물로서 신체 신진대사 및 면역 기능을 조절하는 건강 유효 성분입니다.";
  alert(`🧬 [${compName}] 의 과학적 생리 효능:\n\n${desc}`);
}
window.showBioactiveBenefit = showBioactiveBenefit;

// ═══════════════════════════════════════════════════════════════════════════
// ─── MILA 통합 영양/약리 진단서 (MenuGen) MODULE ─────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

function generateDiagnosisReportText() {
  const currentUser = JSON.parse(localStorage.getItem('nuri_current_subscriber') || 'null');
  const subscriberName = currentUser ? currentUser.name : '방문자';
  const subscriberEmail = currentUser ? currentUser.email : 'N/A';
  const userConstitution = currentUser ? currentUser.constitution : '일반';
  
  const formatSelect = document.getElementById('rnd-serving-format');
  const format = formatSelect ? formatSelect.value : 'single';
  const config = plannerSlotConfigs[format];
  
  const cheopNames = {
    "single": "단품 요리 개발",
    "bansang_5": "5첩 반상 차림",
    "bansang_7": "7첩 반상 차림",
    "bansang_10": "10첩 반상 차림",
    "bansang_15": "15첩 대형 반상 차림",
    "bansang_20": "20첩 명품 수라상",
    "course_hanjeong": "한정식 코스 요리"
  };
  const dietName = cheopNames[format] || "기타 약선 식단";
  
  const selectedDishes = [];
  if (config) {
    config.groups.forEach(group => {
      group.slots.forEach(slot => {
        const selectEl = document.getElementById(slot.id);
        if (selectEl && selectEl.value) {
          selectedDishes.push({
            slotLabel: slot.label,
            recipeName: selectEl.value
          });
        }
      });
    });
  }

  let totalCalories = 0;
  let totalCarbs = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalFiber = 0;
  let totalSodium = 0;
  let totalWeight = 0;
  let detectedBioactives = new Set();
  
  const natureCounts = { "온성/열성": 0, "평성": 0, "한성/량성": 0 };
  const tasteCounts = { "단맛(감)": 0, "매운맛(신)": 0, "쓴맛(고)": 0, "신맛(산)": 0, "짠맛(함)": 0 };
  const meridianCounts = { "비경": 0, "위경": 0, "간경": 0, "신경": 0, "폐경": 0, "심경": 0 };
  const axisScores = { '정화': 0, '완화': 0, '흡수': 0, '회복': 0, '순환': 0, '보호': 0, '안정': 0 };

  rndIngredients.forEach(item => {
    const row = masterDb.find(r => r["식재료/약재"] === item.name);
    const herbology = window.ingredientsHerbologyList && window.ingredientsHerbologyList.find(h => h.식재료명 === item.name || item.name.includes(h.식재료명));
    
    if (window.ingredientsNutritionMap) {
      const nutri = window.ingredientsNutritionMap[item.name] || window.ingredientsNutritionMap[Object.keys(window.ingredientsNutritionMap).find(k => item.name.includes(k) || k.includes(item.name))];
      if (nutri) {
        const ratio = item.weight / 10.0;
        totalCalories += (nutri.calories || 0) * ratio;
        totalCarbs += (nutri.carbohydrates || 0) * ratio;
        totalProtein += (nutri.protein || 0) * ratio;
        totalFat += (nutri.fat || 0) * ratio;
        totalFiber += (nutri.fiber || 0) * ratio;
        totalSodium += (nutri.sodium || 0) * ratio;
        if (nutri.bioactive_compounds) {
          nutri.bioactive_compounds.forEach(comp => detectedBioactives.add(comp));
        }
      }
    }
    
    const descText = (row ? (row.설명목록 || []).join(" ") : "") + " " + (herbology ? herbology["성미 (성질과 맛)"] : "");
    const origEffText = (row ? (row.효능목록 || []).join(", ") : "");
    
    let weightFactor = 1;
    if (item.role.includes("군약")) weightFactor = 3;
    else if (item.role.includes("신약")) weightFactor = 2;
    
    const scaledItemWeight = item.weight * batchMultiplier;
    const itemFactor = weightFactor * scaledItemWeight;
    totalWeight += scaledItemWeight;
    
    if (descText.includes("따뜻") || descText.includes("온(溫)") || descText.includes("열(熱)")) {
      natureCounts["온성/열성"] += itemFactor;
    } else if (descText.includes("차가") || descText.includes("한(寒)") || descText.includes("서늘") || descText.includes("량(凉)")) {
      natureCounts["한성/량성"] += itemFactor;
    } else {
      natureCounts["평성"] += itemFactor;
    }
    
    if (descText.includes("달다") || descText.includes("감(甘)")) tasteCounts["단맛(감)"] += itemFactor;
    if (descText.includes("맵다") || descText.includes("신(辛)")) tasteCounts["매운맛(신)"] += itemFactor;
    if (descText.includes("쓰다") || descText.includes("고(苦)")) tasteCounts["쓴맛(고)"] += itemFactor;
    if (descText.includes("시다") || descText.includes("산(酸)")) tasteCounts["신맛(산)"] += itemFactor;
    if (descText.includes("짜다") || descText.includes("함(鹹)")) tasteCounts["짠맛(함)"] += itemFactor;
    
    const targetMeridians = ["간경", "심경", "비경", "위경", "폐경", "신경"];
    targetMeridians.forEach(m => {
      if (descText.includes(m) || origEffText.includes(m) || (herbology && herbology["약선 배합 및 요리법"] && herbology["약선 배합 및 요리법"].includes(m))) {
        meridianCounts[m] += itemFactor;
      }
    });

    if (row) {
      let axes = new Set();
      (row.표준기능목록 || []).forEach(f => {
        if (f) {
          const ax = getResolved7Axis(f, null);
          if (ax) axes.add(ax);
        }
      });
      axes.forEach(axis => {
        if (axisScores.hasOwnProperty(axis)) {
          axisScores[axis] += itemFactor;
        }
      });
    }
  });
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' });
  
  let dishesText = "";
  selectedDishes.forEach(d => {
    dishesText += `   - ${d.slotLabel}: ${d.recipeName}\n`;
  });
  
  const totalMacros = totalCarbs + totalProtein + totalFat;
  let carbsPct = 0, proteinPct = 0, fatPct = 0;
  if (totalMacros > 0) {
    carbsPct = Math.round((totalCarbs / totalMacros) * 100);
    proteinPct = Math.round((totalProtein / totalMacros) * 100);
    fatPct = 100 - carbsPct - proteinPct;
  }
  
  const totalNature = Object.values(natureCounts).reduce((a, b) => a + b, 0) || 1;
  const natureText = Object.entries(natureCounts)
    .map(([n, count]) => `${n} (${((count / totalNature) * 100).toFixed(0)}%)`)
    .join(", ");
    
  const totalTaste = Object.values(tasteCounts).reduce((a, b) => a + b, 0) || 1;
  const tasteText = Object.entries(tasteCounts)
    .map(([t, count]) => `${t} (${((count / totalTaste) * 100).toFixed(0)}%)`)
    .join(", ");
    
  const meridianText = Object.entries(meridianCounts)
    .map(([m, count]) => `${m} (${Math.round(count)}점)`)
    .join(", ");
    
  const totalAxisScore = Object.values(axisScores).reduce((a, b) => a + b, 0) || 1;
  let axisText = "";
  Object.entries(axisScores).forEach(([axis, score]) => {
    if (score > 0) {
      axisText += `   - ${axis} 계열: ${((score / totalAxisScore) * 100).toFixed(0)}% (가중치 ${Math.round(score)}점)\n`;
    }
  });
  
  let bioactiveText = "";
  if (detectedBioactives.size > 0) {
    detectedBioactives.forEach(comp => {
      const desc = (window.bioactiveBenefits && window.bioactiveBenefits[comp]) || "천연 유기 화합물로서 신체의 생리적 활성을 돕습니다.";
      bioactiveText += `   - ${comp}: ${desc}\n`;
    });
  } else {
    bioactiveText = "   - 검출된 유효 물질 없음 (원료 배합 필요)\n";
  }
  
  let sasangResult = "보통 (Balanced)";
  let sasangAdvice = "본 식단은 남녀노소 체질에 관계없이 균형 잡힌 기미와 오행 귀경 밸런스를 갖추고 있어 일상 건강식으로 훌륭합니다.";
  
  if (userConstitution === '소음인') {
    const warmRatio = natureCounts["온성/열성"] / totalNature;
    if (warmRatio > 0.4) {
      sasangResult = "우수 (Excellent)";
      sasangAdvice = "본 식단은 따뜻한 성질(온성/열성)의 식재료가 지배적이며, 소화 기능과 체온 유지를 보완하여 비위가 차고 기력이 약해지기 쉬운 소음인 체질에 최상의 조화를 이룹니다.";
    } else {
      sasangResult = "주의 (Caution)";
      sasangAdvice = "본 식단은 서늘한 성질의 재료 비중이 높아 소음인 체질의 소화력 저하나 냉증을 유발할 수 있으니, 따뜻한 성질의 대추차나 생강차를 곁들이시거나 조리 시 마늘/생강의 배합 비중을 늘리는 것을 권장합니다.";
    }
  } else if (userConstitution === '소양인') {
    const coolRatio = natureCounts["한성/량성"] / totalNature;
    if (coolRatio > 0.4) {
      sasangResult = "우수 (Excellent)";
      sasangAdvice = "본 식단은 서늘한 성질(한성/량성)의 식재료가 적절히 배합되어 있어 체내의 과도한 열을 내리고 신장 기운을 보강해 비위열성이 강한 소양인 체질에 매우 유익합니다.";
    } else {
      sasangResult = "주의 (Caution)";
      sasangAdvice = "본 식단은 따뜻한 성질의 재료가 많아 소양인 체질의 내부 번열을 가중할 수 있으니, 참기름/오이/녹두 등 서늘한 식재료를 보강하거나 식후에 보성 녹차나 민들레차를 곁들이시는 것이 좋습니다.";
    }
  } else if (userConstitution === '태음인') {
    const hasTaeuminHerbs = rndIngredients.some(i => ["율무", "칡", "산약", "도라지", "맥문동", "구기자", "더덕", "표고버섯"].includes(i.name));
    if (hasTaeuminHerbs) {
      sasangResult = "우수 (Excellent)";
      sasangAdvice = "본 식단에는 태음인의 폐 기능을 보호하고 체내 습담(노폐물)을 배출하는 데 탁월한 본초(율무, 도라지, 산약 등)가 함유되어 있어 태음인의 기혈 정체와 호흡기 보양에 시너지가 훌륭합니다.";
    } else {
      sasangResult = "보통 (Good)";
      sasangAdvice = "본 식단은 무난한 성향이나, 태음인의 호흡기 면역과 기혈 정체를 예방하기 위해 맥문동차나 도라지나물 등의 찬을 추가 구성하시는 것을 권장합니다.";
    }
  } else if (userConstitution === '태양인') {
    const hasTaeyangminHerbs = rndIngredients.some(i => ["오가피", "메밀", "국화", "겨우살이"].includes(i.name));
    if (hasTaeyangminHerbs) {
      sasangResult = "우수 (Excellent)";
      sasangAdvice = "본 식단은 기운을 하강시키고 간을 보하는 식재료(오가피, 메밀 등)가 어우러져 간 기운이 약하고 상기되기 쉬운 태양인 체질에 아주 적합합니다.";
    } else {
      sasangResult = "보통 (Good)";
      sasangAdvice = "본 식단은 일반적인 구성을 띠고 있으나, 기운이 솟구치기 쉬운 태양인을 위해 식후 안동 국화차나 모과차를 매칭하여 간열을 내리는 조절이 이롭습니다.";
    }
  }
  
  const dishSelect = document.getElementById('rnd-dish-category');
  const dishCategoryVal = dishSelect ? dishSelect.value : "기타";
  let matchedLiquorName = "안동 유기농 노랑 국화차 (30g)";
  let matchedLiquorDesc = "머리를 맑게 하고 위장 소화 흡수를 향기롭게 감싸주는 유기농 국화송이차입니다.";

  if (dishCategoryVal.includes("국물_메인") || dishCategoryVal === "부식") {
    matchedLiquorName = "청명 진맥 청주 (500ml)";
    matchedLiquorDesc = "보리 누룩으로 빚어 육류의 느끼한 맛을 개운하게 씻어주고 소화를 촉진하는 맑은 청주입니다.";
  } else if (natureCounts["온성/열성"] > natureCounts["한성/량성"]) {
    matchedLiquorName = "지리산 안신 연잎 꽃차 (30g)";
    matchedLiquorDesc = "따뜻한 성질의 음식 뒤에 마음을 차분히 가라앉히고 번열을 제거하는 안신(安神) 꽃차입니다.";
  } else if (natureCounts["한성/량성"] > natureCounts["온성/열성"]) {
    matchedLiquorName = "홍화 보양 백세주 (375ml)";
    matchedLiquorDesc = "서늘한 음식의 성질을 온화하게 덮어주고 기혈의 미세 순환을 돕는 보양주입니다.";
  }

  const marketingClaim = document.getElementById('rnd-marketing-output') ? document.getElementById('rnd-marketing-output').innerText : '';

  let text = `============================================================
       Nuri Laboratory × Mila Wellness Diet Diagnosis
                   [통합 영양/약리 진단서]
============================================================
■ 발행 일시: ${dateStr}
■ 대상 고객: ${subscriberName} 님 (${userConstitution} / ${currentUser ? currentUser.role : '방문자'})
■ 식단 유형: ${dietName} (MenuGen Report)
■ 식단 구성:
${dishesText}
------------------------------------------------------------
1. 통합 영양성분 분석 (Nutritional Profile)
------------------------------------------------------------
- 총 열량: ${Math.round(totalCalories)} kcal
- 탄수화물: ${totalCarbs.toFixed(1)}g (${carbsPct}%)
- 단백질: ${totalProtein.toFixed(1)}g (${proteinPct}%)
- 지방: ${totalFat.toFixed(1)}g (${fatPct}%)
- 식이섬유: ${totalFiber.toFixed(1)}g
- 나트륨: ${Math.round(totalSodium)} mg
------------------------------------------------------------
2. 오행 성미귀경 분석 (Five Elements & Meridians)
------------------------------------------------------------
- 성질 분포: ${natureText}
- 맛 분포: ${tasteText}
- 주요 귀경 장부: ${meridianText}
------------------------------------------------------------
3. 7대 반응 축(7-AXIS) 기대 생리활성 기여율
------------------------------------------------------------
${axisText}
------------------------------------------------------------
4. 주요 생리활성 유효 물질 (Bioactive Compounds)
------------------------------------------------------------
${bioactiveText}
------------------------------------------------------------
5. 사상 체질 궁합 & 양생 어드바이스
------------------------------------------------------------
[${userConstitution} 적합도: ${sasangResult}]
- ${sasangAdvice}
------------------------------------------------------------
6. 추천 발효주 & 음청류 페어링
------------------------------------------------------------
[${matchedLiquorName}]
- ${matchedLiquorDesc}
------------------------------------------------------------
7. 비즈니스 마케팅 스토리텔링 컨셉 (Claims)
------------------------------------------------------------
${marketingClaim}
============================================================
           Nuri Laboratory (C) All Rights Reserved
============================================================`;

  return text;
}

function openDiagnosisModal() {
  const formatSelect = document.getElementById('rnd-serving-format');
  const format = formatSelect ? formatSelect.value : 'single';
  const config = plannerSlotConfigs[format];
  
  const selectedDishes = [];
  if (config && format !== 'single') {
    config.groups.forEach(group => {
      group.slots.forEach(slot => {
        const selectEl = document.getElementById(slot.id);
        if (selectEl && selectEl.value) {
          selectedDishes.push({
            slotLabel: slot.label,
            recipeName: selectEl.value
          });
        }
      });
    });
  }

  if (selectedDishes.length === 0 && format !== 'single') {
    alert("진단서 발행을 위해 식단 슬롯에 최소 하나의 요리를 배치해 주세요.");
    return;
  }

  // Generate the text report
  const reportText = generateDiagnosisReportText();
  window.currentDiagnosisReportText = reportText; // Cache it globally for downloading

  // Generate the HTML content
  const currentUser = JSON.parse(localStorage.getItem('nuri_current_subscriber') || 'null');
  const subscriberName = currentUser ? currentUser.name : '방문자';
  const userConstitution = currentUser ? currentUser.constitution : '일반';
  
  // Calculate values
  let totalCalories = 0, totalCarbs = 0, totalProtein = 0, totalFat = 0, totalFiber = 0, totalSodium = 0;
  let totalWeight = 0;
  let detectedBioactives = new Set();
  const natureCounts = { "온성/열성": 0, "평성": 0, "한성/량성": 0 };
  const tasteCounts = { "단맛(감)": 0, "매운맛(신)": 0, "쓴맛(고)": 0, "신맛(산)": 0, "짠맛(함)": 0 };
  const meridianCounts = { "비경": 0, "위경": 0, "간경": 0, "신경": 0, "폐경": 0, "심경": 0 };
  const axisScores = { '정화': 0, '완화': 0, '흡수': 0, '회복': 0, '순환': 0, '보호': 0, '안정': 0 };

  rndIngredients.forEach(item => {
    const row = masterDb.find(r => r["식재료/약재"] === item.name);
    const herbology = window.ingredientsHerbologyList && window.ingredientsHerbologyList.find(h => h.식재료명 === item.name || item.name.includes(h.식재료명));
    
    if (window.ingredientsNutritionMap) {
      const nutri = window.ingredientsNutritionMap[item.name] || window.ingredientsNutritionMap[Object.keys(window.ingredientsNutritionMap).find(k => item.name.includes(k) || k.includes(item.name))];
      if (nutri) {
        const ratio = item.weight / 10.0;
        totalCalories += (nutri.calories || 0) * ratio;
        totalCarbs += (nutri.carbohydrates || 0) * ratio;
        totalProtein += (nutri.protein || 0) * ratio;
        totalFat += (nutri.fat || 0) * ratio;
        totalFiber += (nutri.fiber || 0) * ratio;
        totalSodium += (nutri.sodium || 0) * ratio;
        if (nutri.bioactive_compounds) {
          nutri.bioactive_compounds.forEach(comp => detectedBioactives.add(comp));
        }
      }
    }
    
    const descText = (row ? (row.설명목록 || []).join(" ") : "") + " " + (herbology ? herbology["성미 (성질과 맛)"] : "");
    const origEffText = (row ? (row.효능목록 || []).join(", ") : "");
    
    let weightFactor = 1;
    if (item.role.includes("군약")) weightFactor = 3;
    else if (item.role.includes("신약")) weightFactor = 2;
    
    const scaledItemWeight = item.weight * batchMultiplier;
    const itemFactor = weightFactor * scaledItemWeight;
    totalWeight += scaledItemWeight;
    
    if (descText.includes("따뜻") || descText.includes("온(溫)") || descText.includes("열(熱)")) natureCounts["온성/열성"] += itemFactor;
    else if (descText.includes("차가") || descText.includes("한(寒)") || descText.includes("서늘") || descText.includes("량(凉)")) natureCounts["한성/량성"] += itemFactor;
    else natureCounts["평성"] += itemFactor;
    
    if (descText.includes("달다") || descText.includes("감(甘)")) tasteCounts["단맛(감)"] += itemFactor;
    if (descText.includes("맵다") || descText.includes("신(辛)")) tasteCounts["매운맛(신)"] += itemFactor;
    if (descText.includes("쓰다") || descText.includes("고(苦)")) tasteCounts["쓴맛(고)"] += itemFactor;
    if (descText.includes("시다") || descText.includes("산(酸)")) tasteCounts["신맛(산)"] += itemFactor;
    if (descText.includes("짜다") || descText.includes("함(鹹)")) tasteCounts["짠맛(함)"] += itemFactor;
    
    const targetMeridians = ["간경", "심경", "비경", "위경", "폐경", "신경"];
    targetMeridians.forEach(m => {
      if (descText.includes(m) || origEffText.includes(m) || (herbology && herbology["약선 배합 및 요리법"] && herbology["약선 배합 및 요리법"].includes(m))) {
        meridianCounts[m] += itemFactor;
      }
    });

    if (row) {
      let axes = new Set();
      (row.표준기능목록 || []).forEach(f => {
        if (f) {
          const ax = getResolved7Axis(f, null);
          if (ax) axes.add(ax);
        }
      });
      axes.forEach(axis => {
        if (axisScores.hasOwnProperty(axis)) {
          axisScores[axis] += itemFactor;
        }
      });
    }
  });

  const totalMacros = totalCarbs + totalProtein + totalFat;
  let carbsPct = 0, proteinPct = 0, fatPct = 0;
  if (totalMacros > 0) {
    carbsPct = Math.round((totalCarbs / totalMacros) * 100);
    proteinPct = Math.round((totalProtein / totalMacros) * 100);
    fatPct = 100 - carbsPct - proteinPct;
    if (fatPct < 0) fatPct = 0;
  }

  const totalNature = Object.values(natureCounts).reduce((a, b) => a + b, 0) || 1;
  const totalTaste = Object.values(tasteCounts).reduce((a, b) => a + b, 0) || 1;

  let sasangResult = "보통 (Balanced)";
  let sasangAdvice = "본 식단은 남녀노소 체질에 관계없이 균형 잡힌 기미와 오행 귀경 밸런스를 갖추고 있어 일상 건강식으로 훌륭합니다.";
  let badgeColor = "rgba(255, 255, 255, 0.1)";
  let textColor = "#fff";
  
  if (userConstitution === '소음인') {
    const warmRatio = natureCounts["온성/열성"] / totalNature;
    if (warmRatio > 0.4) {
      sasangResult = "우수 (Excellent)";
      sasangAdvice = "본 식단은 따뜻한 성질(온성/열성)의 식재료가 지배적이며, 소화 기능과 체온 유지를 보완하여 비위가 차고 기력이 약해지기 쉬운 소음인 체질에 최상의 조화를 이룹니다.";
      badgeColor = "rgba(245, 158, 11, 0.15)";
      textColor = "#f59e0b";
    } else {
      sasangResult = "주의 (Caution)";
      sasangAdvice = "본 식단은 서늘한 성질의 재료 비중이 높아 소음인 체질의 소화력 저하나 냉증을 유발할 수 있으니, 따뜻한 성질의 대추차나 생강차를 곁들이시거나 조리 시 마늘/생강의 배합 비중을 늘리는 것을 권장합니다.";
      badgeColor = "rgba(239, 68, 68, 0.15)";
      textColor = "#ef4444";
    }
  } else if (userConstitution === '소양인') {
    const coolRatio = natureCounts["한성/량성"] / totalNature;
    if (coolRatio > 0.4) {
      sasangResult = "우수 (Excellent)";
      sasangAdvice = "본 식단은 서늘한 성질(한성/량성)의 식재료가 적절히 배합되어 있어 체내의 과도한 열을 내리고 신장 기운을 보강해 비위열성이 강한 소양인 체질에 매우 유익합니다.";
      badgeColor = "rgba(59, 130, 246, 0.15)";
      textColor = "#3b82f6";
    } else {
      sasangResult = "주의 (Caution)";
      sasangAdvice = "본 식단은 따뜻한 성질의 재료가 많아 소양인 체질의 내부 번열을 가중할 수 있으니, 참기름/오이/녹두 등 서늘한 식재료를 보강하거나 식후에 보성 녹차나 민들레차를 곁들이시는 것이 좋습니다.";
      badgeColor = "rgba(239, 68, 68, 0.15)";
      textColor = "#ef4444";
    }
  } else if (userConstitution === '태음인') {
    const hasTaeuminHerbs = rndIngredients.some(i => ["율무", "칡", "산약", "도라지", "맥문동", "구기자", "더덕", "표고버섯"].includes(i.name));
    if (hasTaeuminHerbs) {
      sasangResult = "우수 (Excellent)";
      sasangAdvice = "본 식단에는 태음인의 폐 기능을 보호하고 체내 습담(노폐물)을 배출하는 데 탁월한 본초(율무, 도라지, 산약 등)가 함유되어 있어 태음인의 기혈 정체와 호흡기 보양에 시너지가 훌륭합니다.";
      badgeColor = "rgba(16, 185, 129, 0.15)";
      textColor = "#10b981";
    } else {
      sasangResult = "보통 (Good)";
      sasangAdvice = "본 식단은 무난한 성향이나, 태음인의 호흡기 면역과 기혈 정체를 예방하기 위해 맥문동차나 도라지나물 등의 찬을 추가 구성하시는 것을 권장합니다.";
      badgeColor = "rgba(255, 255, 255, 0.1)";
      textColor = "#fff";
    }
  } else if (userConstitution === '태양인') {
    const hasTaeyangminHerbs = rndIngredients.some(i => ["오가피", "메밀", "국화", "겨우살이"].includes(i.name));
    if (hasTaeyangminHerbs) {
      sasangResult = "우수 (Excellent)";
      sasangAdvice = "본 식단은 기운을 하강시키고 간을 보하는 식재료(오가피, 메밀 등)가 어우러져 간 기운이 약하고 상기되기 쉬운 태양인 체질에 아주 적합합니다.";
      badgeColor = "rgba(16, 185, 129, 0.15)";
      textColor = "#10b981";
    } else {
      sasangResult = "보통 (Good)";
      sasangAdvice = "본 식단은 일반적인 구성을 띠고 있으나, 기운이 솟구치기 쉬운 태양인을 위해 식후 안동 국화차나 모과차를 매칭하여 간열을 내리는 조절이 이롭습니다.";
      badgeColor = "rgba(255, 255, 255, 0.1)";
      textColor = "#fff";
    }
  }

  const dishSelect = document.getElementById('rnd-dish-category');
  const dishCategoryVal = dishSelect ? dishSelect.value : "기타";
  let matchedLiquorName = "안동 유기농 노랑 국화차 (30g)";
  let matchedLiquorDesc = "머리를 맑게 하고 위장 소화 흡수를 향기롭게 감싸주는 유기농 국화송이차입니다.";
  let matchedLiquorIcon = "🍵";

  if (dishCategoryVal.includes("국물_메인") || dishCategoryVal === "부식") {
    matchedLiquorName = "청명 진맥 청주 (500ml)";
    matchedLiquorDesc = "보리 누룩으로 빚어 육류의 느끼한 맛을 개운하게 씻어주고 소화를 촉진하는 맑은 청주입니다.";
    matchedLiquorIcon = "🍶";
  } else if (natureCounts["온성/열성"] > natureCounts["한성/량성"]) {
    matchedLiquorName = "지리산 안신 연잎 꽃차 (30g)";
    matchedLiquorDesc = "따뜻한 성질의 음식 뒤에 마음을 차분히 가라앉히고 번열을 제거하는 안신(安神) 꽃차입니다.";
    matchedLiquorIcon = "🌸";
  } else if (natureCounts["한성/량성"] > natureCounts["온성/열성"]) {
    matchedLiquorName = "홍화 보양 백세주 (375ml)";
    matchedLiquorDesc = "서늘한 음식의 성질을 온화하게 덮어주고 기혈의 미세 순환을 돕는 보양주입니다.";
    matchedLiquorIcon = "🍶";
  }

  const cheopNames = {
    "single": "단품 요리 개발",
    "bansang_5": "5첩 반상 차림",
    "bansang_7": "7첩 반상 차림",
    "bansang_10": "10첩 반상 차림",
    "bansang_15": "15첩 대형 반상 차림",
    "bansang_20": "20첩 명품 수라상",
    "course_hanjeong": "한정식 코스 요리"
  };
  const dietName = cheopNames[format] || "기타 약선 식단";
  
  let dishesHtml = "";
  selectedDishes.forEach(d => {
    dishesHtml += `
      <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); border-radius:10px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center; font-size:0.85rem; margin-bottom: 4px;">
        <span style="color:var(--text-muted); font-weight:600;">${d.slotLabel}</span>
        <span style="color:#fff; font-weight:700;"><i class="fa-solid fa-utensils" style="margin-right:6px; color:var(--primary);"></i>${d.recipeName}</span>
      </div>
    `;
  });

  let bioactivesHtml = "";
  if (detectedBioactives.size > 0) {
    detectedBioactives.forEach(comp => {
      const desc = (window.bioactiveBenefits && window.bioactiveBenefits[comp]) || "신체 건강을 조율하는 천연 화합물입니다.";
      bioactivesHtml += `
        <div style="margin-bottom:8px; display:flex; flex-direction:column; gap:2px;">
          <span style="font-weight:700; color:var(--primary); font-size:0.85rem;"><i class="fa-solid fa-seedling" style="margin-right:4px;"></i>${comp}</span>
          <p style="margin:0; font-size:0.78rem; color:var(--text-secondary);">${desc}</p>
        </div>
      `;
    });
  } else {
    bioactivesHtml = `<div style="text-align:center; color:var(--text-muted); font-size:0.8rem; padding:10px 0;">배합 식재료의 영양 성분이 연산되지 않았습니다.</div>`;
  }

  let axisHtml = "";
  Object.entries(axisScores).forEach(([axis, score]) => {
    if (score > 0) {
      const pct = ((score / totalAxisScore) * 100).toFixed(0);
      axisHtml += `
        <div style="margin-bottom:10px;">
          <div style="display:flex; justify-content:space-between; font-size:0.78rem; margin-bottom:3px; font-weight:600;">
            <span style="color:#fff;">${axis} 작용</span>
            <span style="color:var(--primary);">${pct}% (${Math.round(score)}점)</span>
          </div>
          <div style="height:6px; background:rgba(255,255,255,0.05); border-radius:3px; overflow:hidden;">
            <div style="height:100%; width:${pct}%; background:var(--primary); border-radius:3px;"></div>
          </div>
        </div>
      `;
    }
  });

  const now = new Date();
  const dateStr = now.toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' });

  const html = `
    <div style="display:flex; flex-direction:column; gap:24px; font-family:'Outfit', sans-serif;">
      
      <!-- Top Overview Header -->
      <div style="background:linear-gradient(135deg, rgba(6, 78, 59, 0.15) 0%, rgba(120, 53, 15, 0.1) 100%); border:1px solid var(--border-glass); border-radius:14px; padding:16px; display:flex; flex-direction:column; gap:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.95rem; font-weight:800; color:#fff; display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-folder-tree" style="color:var(--primary);"></i> ${dietName}</span>
          <span style="font-size:0.75rem; background:rgba(255,255,255,0.06); padding:3px 8px; border-radius:8px; color:var(--text-muted); font-weight:600;">${dateStr}</span>
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; font-size:0.8rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top:10px;">
          <div><span style="color:var(--text-muted);">수진 회원:</span> <strong style="color:#fff; margin-left:4px;">${subscriberName} 님</strong></div>
          <div><span style="color:var(--text-muted);">진단 체질:</span> <strong style="color:var(--sa-color); margin-left:4px;">${userConstitution}</strong></div>
        </div>
      </div>

      <!-- Selected Dishes -->
      <div>
        <h3 style="font-size:0.95rem; color:var(--primary); margin:0 0 10px 0; display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-utensils"></i> 식단 구성 요리 배치</h3>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${dishesHtml}
        </div>
      </div>

      <!-- Sasang Constitution Compatibility -->
      <div style="border: 2px solid var(--primary); border-radius:14px; background: rgba(16, 185, 129, 0.02); padding:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <h3 style="font-size:0.95rem; color:#fff; margin:0; display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-yin-yang" style="color:var(--primary);"></i> 사상 체질 적합도</h3>
          <span style="font-size:0.8rem; font-weight:800; padding:4px 10px; border-radius:20px; background:${badgeColor}; color:${textColor}; border:1px solid ${textColor}; text-shadow: 0 0 8px ${textColor};">${sasangResult}</span>
        </div>
        <p style="margin:0; font-size:0.82rem; color:var(--text-secondary); line-height:1.5; text-align:justify;">
          ${sasangAdvice}
        </p>
      </div>

      <!-- Nutrition Profile -->
      <div>
        <h3 style="font-size:0.95rem; color:var(--primary); margin:0 0 10px 0; display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-chart-pie"></i> 통합 영양성분 분석</h3>
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px; margin-bottom:14px;">
          <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.04); border-radius:10px; padding:10px; text-align:center;">
            <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">총 열량</div>
            <div style="font-size:1.15rem; font-weight:800; color:var(--primary);">${Math.round(totalCalories)} <span style="font-size:0.75rem; font-weight:500;">kcal</span></div>
          </div>
          <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.04); border-radius:10px; padding:10px; text-align:center;">
            <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">나트륨</div>
            <div style="font-size:1.15rem; font-weight:800; color:var(--primary);">${Math.round(totalSodium)} <span style="font-size:0.75rem; font-weight:500;">mg</span></div>
          </div>
          <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.04); border-radius:10px; padding:10px; text-align:center;">
            <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">식이섬유</div>
            <div style="font-size:1.15rem; font-weight:800; color:var(--primary);">${totalFiber.toFixed(1)} <span style="font-size:0.75rem; font-weight:500;">g</span></div>
          </div>
        </div>
        
        <!-- Macro balance bars -->
        <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.04); border-radius:12px; padding:14px;">
          <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); margin-bottom:8px;">
            <span>탄수화물 (${totalCarbs.toFixed(1)}g)</span>
            <span>단백질 (${totalProtein.toFixed(1)}g)</span>
            <span>지방 (${totalFat.toFixed(1)}g)</span>
          </div>
          <div style="height:8px; background:rgba(255,255,255,0.05); border-radius:4px; overflow:hidden; display:flex;">
            <div style="width:${carbsPct}%; background:#3b82f6; height:100%;" title="탄수화물 ${carbsPct}%"></div>
            <div style="width:${proteinPct}%; background:#10b981; height:100%;" title="단백질 ${proteinPct}%"></div>
            <div style="width:${fatPct}%; background:#f59e0b; height:100%;" title="지방 ${fatPct}%"></div>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.72rem; color:var(--text-secondary); margin-top:6px;">
            <span style="display:flex; align-items:center; gap:4px;"><span style="display:inline-block; width:8px; height:8px; background:#3b82f6; border-radius:50%;"></span>탄 ${carbsPct}%</span>
            <span style="display:flex; align-items:center; gap:4px;"><span style="display:inline-block; width:8px; height:8px; background:#10b981; border-radius:50%;"></span>단 ${proteinPct}%</span>
            <span style="display:flex; align-items:center; gap:4px;"><span style="display:inline-block; width:8px; height:8px; background:#f59e0b; border-radius:50%;"></span>지 ${fatPct}%</span>
          </div>
        </div>
      </div>

      <!-- Traditional Properties & Five Elements -->
      <div style="display:grid; grid-template-columns: 1fr 1.2fr; gap:16px;">
        <div>
          <h3 style="font-size:0.9rem; color:var(--primary); margin:0 0 8px 0; display:flex; align-items:center; gap:6px;"><i class="fa-solid fa-temperature-half"></i> 한방 성미(性味)</h3>
          <div style="font-size:0.75rem; color:var(--text-secondary); line-height:1.5; display:flex; flex-direction:column; gap:6px;">
            <div><strong>성질 분포:</strong><br>${Object.entries(natureCounts).map(([n, count]) => `${n}: ${((count / totalNature) * 100).toFixed(0)}%`).join(", ")}</div>
            <div><strong>오미 분포:</strong><br>${Object.entries(tasteCounts).map(([t, count]) => `${t.split("(")[0]}: ${((count / totalTaste) * 100).toFixed(0)}%`).join(", ")}</div>
          </div>
        </div>
        <div>
          <h3 style="font-size:0.9rem; color:var(--primary); margin:0 0 8px 0; display:flex; align-items:center; gap:6px;"><i class="fa-solid fa-heart-pulse"></i> 오행 귀경(歸經)</h3>
          <div style="display:flex; flex-wrap:wrap; gap:6px;">
            ${Object.entries(meridianCounts).map(([m, count]) => {
              const maxVal = Math.max(...Object.values(meridianCounts), 1);
              const isHeavy = count > 0 && count === maxVal;
              return `<span style="font-size:0.72rem; padding:2px 8px; border-radius:6px; background:${isHeavy ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255,255,255,0.03)'}; color:${isHeavy ? 'var(--sa-color)' : 'var(--text-secondary)'}; border:1px solid ${isHeavy ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255,255,255,0.06)'}; font-weight:${isHeavy ? '700' : '500'};">${m} (${Math.round(count)}점)</span>`;
            }).join("")}
          </div>
        </div>
      </div>

      <!-- 7-AXIS physiological expectations -->
      <div>
        <h3 style="font-size:0.95rem; color:var(--primary); margin:0 0 10px 0; display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-shield-halved"></i> 7대 반응 축 기대 생리활성</h3>
        <div style="background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.03); border-radius:12px; padding:14px; display:flex; flex-direction:column; gap:10px;">
          ${axisHtml}
        </div>
      </div>

      <!-- Bioactive Compounds -->
      <div>
        <h3 style="font-size:0.95rem; color:var(--primary); margin:0 0 10px 0; display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-flask"></i> 검출 천연 유효 성분</h3>
        <div style="background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.03); border-radius:12px; padding:14px; max-height:200px; overflow-y:auto; display:flex; flex-direction:column; gap:12px;">
          ${bioactivesHtml}
        </div>
      </div>

      <!-- Traditional Beverage Pairing -->
      <div style="background: rgba(245, 158, 11, 0.02); border:1px dashed rgba(245, 158, 11, 0.3); border-radius:14px; padding:16px; display:flex; gap:14px; align-items:center;">
        <div style="font-size:2rem; line-height:1; display:flex; align-items:center; justify-content:center;">${matchedLiquorIcon}</div>
        <div style="flex:1;">
          <span style="font-size:0.7rem; color:var(--sa-color); font-weight:700; text-transform:uppercase; letter-spacing:1px; display:block; margin-bottom:2px;"><i class="fa-solid fa-star"></i> 추천 명품 페어링</span>
          <strong style="font-size:0.85rem; color:#fff; display:block; margin-bottom:2px;">${matchedLiquorName}</strong>
          <p style="font-size:0.78rem; color:var(--text-secondary); margin:0; line-height:1.4;">${matchedLiquorDesc}</p>
        </div>
      </div>

    </div>
  `;

  const bodyEl = document.getElementById('diagnosis-modal-body');
  if (bodyEl) {
    bodyEl.innerHTML = html;
  }

  const modal = document.getElementById('diagnosis-modal');
  if (modal) {
    modal.classList.add('open');
  }
}

function closeDiagnosisModal() {
  const modal = document.getElementById('diagnosis-modal');
  if (modal) {
    modal.classList.remove('open');
  }
}

function downloadDiagnosisFile() {
  const text = window.currentDiagnosisReportText;
  if (!text) {
    alert("진단서 정보가 없습니다.");
    return;
  }
  const blob = new Blob(["\ufeff" + text], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "mila_diet_diagnosis.txt");
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Expose modal control functions globally
window.openDiagnosisModal = openDiagnosisModal;
window.closeDiagnosisModal = closeDiagnosisModal;
window.downloadDiagnosisFile = downloadDiagnosisFile;
window.generateDiagnosisReportText = generateDiagnosisReportText;


/* ==========================================================================
   Mila Shop Detail Modal & Platform Ecosystem Functions
   ========================================================================== */

let detailProductQty = 1;

function openProductDetail(productId) {
  const p = SHOP_PRODUCTS.find(item => item.id === productId);
  if (!p) return;

  detailProductQty = 1; // reset qty to 1

  const body = document.getElementById('product-detail-body');
  if (!body) return;

  const currentUser = JSON.parse(localStorage.getItem('nuri_current_subscriber') || 'null');
  const userConstitution = currentUser ? currentUser.constitution : null;
  const isMember = !!currentUser;
  const memberPrice = isMember ? Math.round(p.price * 0.9) : p.price;

  const isMatch = userConstitution && userConstitution !== '일반' && p.constitution.includes(userConstitution);

  // Define constitution synergy text
  const matchExplanation = getConstitutionExplanation(p.constitutionType, p.name);

  // Formulate links for R&D
  const rdLinkHtml = `
    <div style="display:flex; flex-direction:column; gap:8px;">
      <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
        <span style="font-size:0.75rem; color:var(--text-secondary); width:85px; font-weight:600;">연계 표준기능:</span>
        ${p.rdLinkage.functions.map(fn => `<span class="badge-tag green-glow-hover" style="font-size:0.7rem; padding:1px 6px; cursor:pointer;" onclick="closeProductDetailModal(); switchTab('tab-index'); searchStandardFunction('${fn.split(' ')[0]}');">${fn}</span>`).join(' ')}
      </div>
      <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-top:4px;">
        <span style="font-size:0.75rem; color:var(--text-secondary); width:85px; font-weight:600;">표출 7대 반응축:</span>
        ${p.rdLinkage.axes.map(ax => `<span class="badge-tag gold-glow-hover" style="font-size:0.7rem; padding:1px 6px; border-color:#f59e0b; color:#f59e0b; cursor:pointer;" onclick="closeProductDetailModal(); switchTab('tab-index'); selectAxisTab('${ax}');">${ax}</span>`).join(' ')}
      </div>
    </div>
  `;

  // Build full html
  body.innerHTML = `
    <div style="display:grid; grid-template-columns: 1fr 1.2fr; gap:24px; align-items:start;">
      <!-- Left Column: Visuals & Pricing -->
      <div style="display:flex; flex-direction:column; gap:16px;">
        <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:20px; display:flex; justify-content:center; align-items:center; position:relative; overflow:hidden; aspect-ratio: 1.1 / 1;">
          ${p.image 
            ? `<img src="${p.image}" alt="${p.name}" style="max-width:100%; max-height:100%; object-fit:contain; filter: drop-shadow(0 0 15px rgba(245,158,11,0.2));">` 
            : `<span style="font-size:8rem;">${p.emoji}</span>`
          }
        </div>
        <div>
          <h3 style="font-size:1.3rem; font-weight:800; color:#fff; margin:0;">${p.name}</h3>
          <div style="font-size:0.75rem; color:var(--text-muted); font-family:'Outfit', sans-serif; margin-bottom:8px;">${p.subname}</div>
          <div style="display:flex; align-items:baseline; gap:8px;">
            ${isMember 
              ? `<span style="font-size:0.85rem; text-decoration:line-through; color:var(--text-muted);">₩${p.price.toLocaleString()}</span>
                 <span style="font-size:1.25rem; font-weight:800; color:var(--primary);">₩${memberPrice.toLocaleString()}</span>
                 <span style="font-size:0.7rem; background:rgba(245,158,11,0.08); color:var(--primary); border:1px solid var(--primary); padding:1px 6px; border-radius:4px; font-weight:700;">10% 회원가</span>`
              : `<span style="font-size:1.25rem; font-weight:800; color:var(--primary);">₩${p.price.toLocaleString()}</span>`
            }
          </div>
          <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:6px;">용량/규격: ${p.unit} | 매장 재고: ${p.stock}개</div>
        </div>
        <!-- Quantity selector & Add to Cart button -->
        <div style="display:flex; gap:10px; margin-top:10px; align-items:center;">
          <div style="display:flex; align-items:center; border:1px solid rgba(255,255,255,0.12); border-radius:6px; background:rgba(0,0,0,0.3); overflow:hidden;">
            <button onclick="decreaseDetailQty('${p.id}')" style="background:transparent; border:none; color:#fff; padding:8px 14px; cursor:pointer; font-weight:700; transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">−</button>
            <span id="detail-qty-display" style="padding:0 8px; font-weight:800; min-width:24px; text-align:center; font-family:'Outfit',sans-serif;">1</span>
            <button onclick="increaseDetailQty('${p.id}')" style="background:transparent; border:none; color:#fff; padding:8px 14px; cursor:pointer; font-weight:700; transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">+</button>
          </div>
          <button class="btn btn-primary" onclick="addFromDetailToCart('${p.id}')" style="flex:1; font-weight:700; height:40px;"><i class="fa-solid fa-cart-shopping"></i> 장바구니 담기</button>
        </div>
      </div>

      <!-- Right Column: Scientific & Medical properties -->
      <div style="display:flex; flex-direction:column; gap:16px;">
        <!-- Product Description -->
        <div class="panel glass-panel" style="padding:15px; margin:0; background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.05);">
          <h4 style="margin:0 0 8px; font-size:0.8rem; color:var(--primary); font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">📋 상품 개요</h4>
          <p style="color:var(--text-secondary); font-size:0.82rem; margin:0; line-height:1.5;">${p.desc}</p>
        </div>

        <!-- Sasang constitution match -->
        <div class="panel glass-panel" style="padding:15px; margin:0; background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.05); border-left:3px solid ${p.constitutionType === 'warm' ? '#f59e0b' : p.constitutionType === 'cool' ? '#10b981' : '#a78bfa'};">
          <h4 style="margin:0 0 8px; font-size:0.8rem; color:${p.constitutionType === 'warm' ? '#f59e0b' : p.constitutionType === 'cool' ? '#10b981' : '#a78bfa'}; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">☯️ 사상 체질 궁합 & 양생 피드백</h4>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
            <span class="badge" style="background:${p.constitutionType === 'warm' ? 'rgba(245,158,11,0.08)' : p.constitutionType === 'cool' ? 'rgba(16,185,129,0.08)' : 'rgba(167,139,250,0.08)'}; color:${p.constitutionType === 'warm' ? '#f59e0b' : p.constitutionType === 'cool' ? '#10b981' : '#a78bfa'}; border:1px solid ${p.constitutionType === 'warm' ? '#f59e0b' : p.constitutionType === 'cool' ? '#10b981' : '#a78bfa'}; padding:2px 6px; border-radius:4px; font-size:0.65rem; font-weight:700;">
              ${p.constitutionType.toUpperCase()}
            </span>
            <span style="font-size:0.8rem; font-weight:700; color:#fff;">시너지 체질: ${p.constitution.join(', ')}</span>
          </div>
          <p style="color:var(--text-secondary); font-size:0.82rem; margin:0; line-height:1.5;">${matchExplanation}</p>
        </div>

        <!-- National standard nutrition facts (RDA) -->
        <div class="panel glass-panel" style="padding:15px; margin:0; background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.05);">
          <h4 style="margin:0 0 8px; font-size:0.8rem; color:var(--primary); font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">📊 농촌진흥청 국가표준 영양성분 정보 (10개정판 규격)</h4>
          <table style="width:100%; border-collapse:collapse; font-size:0.75rem; text-align:left;">
            <thead>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.08); color:var(--text-muted);">
                <th style="padding:4px 0;">영양소 분류 (Nutrient)</th>
                <th style="padding:4px 0; text-align:right;">기준량 (${p.nutrition.serving}) 당 함량</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding:5px 0; color:var(--text-secondary);">에너지 (Energy)</td>
                <td style="padding:5px 0; text-align:right; color:#fff; font-weight:700;">${p.nutrition.energy}</td>
              </tr>
              <tr style="border-top:1px solid rgba(255,255,255,0.03);">
                <td style="padding:5px 0; color:var(--text-secondary);">탄수화물 (Carbohydrate)</td>
                <td style="padding:5px 0; text-align:right; color:#fff; font-weight:700;">${p.nutrition.carbs}</td>
              </tr>
              <tr style="border-top:1px solid rgba(255,255,255,0.03);">
                <td style="padding:5px 0; color:var(--text-secondary);">단백질 (Protein)</td>
                <td style="padding:5px 0; text-align:right; color:#fff; font-weight:700;">${p.nutrition.protein}</td>
              </tr>
              <tr style="border-top:1px solid rgba(255,255,255,0.03);">
                <td style="padding:5px 0; color:var(--text-secondary);">지질 (Fat)</td>
                <td style="padding:5px 0; text-align:right; color:#fff; font-weight:700;">${p.nutrition.fat}</td>
              </tr>
              <tr style="border-top:1px solid rgba(255,255,255,0.03);">
                <td style="padding:5px 0; color:var(--text-secondary);">나트륨 (Sodium)</td>
                <td style="padding:5px 0; text-align:right; color:#fff; font-weight:700;">${p.nutrition.sodium}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- R&D Mapping Linkage -->
        <div class="panel glass-panel" style="padding:15px; margin:0; background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.05);">
          <h4 style="margin:0 0 8px; font-size:0.8rem; color:var(--primary); font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">🧬 Nuri Lab R&D 생리 기전 연계 (온톨로지 매핑)</h4>
          ${rdLinkHtml}
        </div>

        <!-- Brewing/Preparation Guide & Safety Precautions -->
        <div class="panel glass-panel" style="padding:15px; margin:0; background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.05);">
          <h4 style="margin:0 0 8px; font-size:0.8rem; color:var(--primary); font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">💡 복용 가이드 & 주의사항</h4>
          <div style="display:flex; flex-direction:column; gap:6px; font-size:0.8rem; line-height:1.5;">
            <div style="color:var(--text-secondary);"><strong>음용/복용법:</strong> ${p.brewingGuide}</div>
            <div style="color:#f87171; background:rgba(248,113,113,0.05); padding:6px 10px; border-radius:6px; border:1px solid rgba(248,113,113,0.1); margin-top:2px;">
              <strong>⚠️ 주의사항:</strong> ${p.warning}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const modal = document.getElementById('product-detail-modal');
  if (modal) modal.classList.add('open');
}

function closeProductDetailModal() {
  const modal = document.getElementById('product-detail-modal');
  if (modal) modal.classList.remove('open');
}

function increaseDetailQty(productId) {
  detailProductQty++;
  const el = document.getElementById('detail-qty-display');
  if (el) el.innerText = detailProductQty;
}

function decreaseDetailQty(productId) {
  if (detailProductQty <= 1) return;
  detailProductQty--;
  const el = document.getElementById('detail-qty-display');
  if (el) el.innerText = detailProductQty;
}

function addFromDetailToCart(productId) {
  const product = SHOP_PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  
  const existing = shopCart.find(c => c.product.id === productId);
  if (existing) {
    existing.qty += detailProductQty;
  } else {
    shopCart.push({ product: product, qty: detailProductQty });
  }

  updateCartUI();
  renderShopProducts();
  closeProductDetailModal();
  
  // Open floating cart drawer to directly show the cart state
  openCartDrawer();

  // Pulse cart FAB
  const fab = document.getElementById('cart-fab');
  if (fab) {
    fab.classList.add('cart-fab-pulse');
    setTimeout(function(){ fab.classList.remove('cart-fab-pulse'); }, 600);
  }
}

function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  if (!drawer) return;
  renderCartDrawer();
  drawer.classList.add('open');
  if (overlay) overlay.classList.add('open');
  document.body.classList.add('drawer-open');
}

function getConstitutionExplanation(type, productName) {
  if (type === 'warm') {
    return '이 제품은 온양성(Warm) 원물을 기반으로 하여, 태생적으로 비위 기능이 차고 맥이 약해 손발이 시리기 쉬운 <strong>소음인</strong>과 순환 정체로 담음이 생기기 쉬운 <strong>태음인</strong>의 기혈 기립을 돕고 말초 혈행을 촉진하는 약리 기전을 보조합니다.';
  } else if (type === 'cool') {
    return '이 제품은 서늘한 성질(Cool)의 자연물을 함유하고 있어, 선천적으로 상체열이 많고 화(火)가 울체되기 쉬운 <strong>소양인</strong>과 폐대간소하여 기가 위로 치밀어 오르기 쉬운 <strong>태양인</strong>의 중추열을 내리고 간음(肝陰)을 보하며 마음을 하강시켜 뇌파를 안정시킵니다.';
  } else {
    return '본 제품은 평(平)하고 중용을 이루는 중성(Neutral) 성미를 띠고 있어, 4대 사상 체질(소음인, 소양인, 태음인, 태양인) 누구에게나 치우침 없이 흡수되며 일상의 원기를 온화하게 보해주는 기본 양생 식품입니다.';
  }
}

// Search standard functions from product detail page
function searchStandardFunction(keyword) {
  const input = document.getElementById('index-search-input');
  if (input) {
    input.value = keyword;
    // Trigger input event to run search
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
  }
}

// Select axis tab from product detail page
function selectAxisTab(axisName) {
  // Try to find the tab pill matching the axis
  const pills = document.querySelectorAll('.axis-tab-pill');
  pills.forEach(pill => {
    if (pill.innerText.includes(axisName)) {
      pill.click();
    }
  });
}

// showEcosystemDetails for B2B Ecosystem Network Diagram
function showEcosystemDetails(nodeId) {
  const panel = document.getElementById('eco-detail-panel');
  if (!panel) return;

  // Highlight clicked node, remove highlight from others
  document.querySelectorAll('.eco-node').forEach(el => el.classList.remove('active-node'));
  const clicked = document.querySelector(`[onclick="showEcosystemDetails('${nodeId}')"]`);
  if (clicked) clicked.classList.add('active-node');

  let html = '';
  if (nodeId === 'eco-academia') {
    html = `
      <h3 style="color:var(--accent); margin-top:0; font-size:1.05rem; font-weight:700; display:flex; align-items:center; gap:8px;">
        <i class="fa-solid fa-graduation-cap"></i> 🔬 학술 & 임상 연구망 (KIOM & Universities)
      </h3>
      <p style="margin:10px 0; font-size:0.82rem; color:var(--text-secondary); line-height:1.5;">
        경희대학교 한의과대학 자문단과 공동으로 한방 처방의 오행(五行)·성미(性味)귀경 분석 표준안을 정립했습니다. 또한 <strong>한국한의학연구원(KIOM)</strong>의 표준 고전 문헌 온톨로지 지표를 결합하여, 동의보감과 본초강목 등 4대 한방 고전에 수록된 기질 조절 작용 수식이 Matrix Engine 추론 알고리즘 상에서 과학적으로 정밀 연산될 수 있도록 학술적 정당성을 확보해 줍니다.
      </p>
      <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
        <span class="badge" style="background:rgba(5,150,105,0.08); color:var(--accent); border:1px solid var(--accent); padding:2px 8px; border-radius:4px; font-size:0.7rem; font-weight:700;">동의보감 고증 완료</span>
        <span class="badge" style="background:rgba(5,150,105,0.08); color:var(--accent); border:1px solid var(--accent); padding:2px 8px; border-radius:4px; font-size:0.7rem; font-weight:700;">KIOM 데이터 얼라이언스</span>
      </div>
    `;
  } else if (nodeId === 'eco-platform') {
    html = `
      <h3 style="color:var(--primary); margin-top:0; font-size:1.05rem; font-weight:700; display:flex; align-items:center; gap:8px;">
        <i class="fa-solid fa-cpu"></i> 🧬 Nuri Lab AI 추론 엔진 (Matrix Engine)
      </h3>
      <p style="margin:10px 0; font-size:0.82rem; color:var(--text-secondary); line-height:1.5;">
        식단 영양/약리 추천 및 군신좌사 배합기, 7-AXIS 생리반응 예측 알고리즘의 <strong>중추 추론기</strong>입니다. 1,793행 마스터 DB를 기반으로 하며 환자의 사상 체질과 호흡기/관절/비위 등 신체 병증 키워드를 런타임에 다차원 결합하여, 부작용(상극/상반 안전 가드)을 사전 회피하고 최적의 양생 성분을 배정하여 마케팅 문구(Claims)까지 실시간 연산 출력해 냅니다.
      </p>
      <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
        <span class="badge" style="background:rgba(245,158,11,0.08); color:var(--primary); border:1px solid var(--primary); padding:2px 8px; border-radius:4px; font-size:0.7rem; font-weight:700;">7-AXIS 실시간 연산</span>
        <span class="badge" style="background:rgba(245,158,11,0.08); color:var(--primary); border:1px solid var(--primary); padding:2px 8px; border-radius:4px; font-size:0.7rem; font-weight:700;">칠정배합 예외 감지 99.8%</span>
      </div>
    `;
  } else if (nodeId === 'eco-supply') {
    html = `
      <h3 style="color:#f59e0b; margin-top:0; font-size:1.05rem; font-weight:700; display:flex; align-items:center; gap:8px;">
        <i class="fa-solid fa-warehouse"></i> 🏭 청정 원물 산지 직송망 & 자연산 채취 협력망
      </h3>
      <p style="margin:10px 0; font-size:0.82rem; color:var(--text-secondary); line-height:1.5;">
        의성 유기농 홍화, 풍기 인삼 등 전국 12개 청정 산지 지자체 농가와의 직송 공급망을 구축하여 최고 등급의 원물을 조달하고, 깊은 산속에서 무공해 야생 본초를 채취하는 전통 채취인(심마니) 공동체와의 협력망을 통해 고가치의 원재료를 안정적으로 연계 수급합니다. 이후 8대 협력 GMP/HACCP 인증 제약 및 한방 제조 인프라를 통해 위탁 가공하며 유통 투명성을 보증합니다.
      </p>
      <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
        <span class="badge" style="background:rgba(245,158,11,0.08); color:#f59e0b; border:1px solid #f59e0b; padding:2px 8px; border-radius:4px; font-size:0.7rem; font-weight:700;">산지 직송 & 자연산 채취 연동</span>
        <span class="badge" style="background:rgba(245,158,11,0.08); color:#f59e0b; border:1px solid #f59e0b; padding:2px 8px; border-radius:4px; font-size:0.7rem; font-weight:700;">GMP/HACCP 위탁 생산</span>
      </div>
    `;
  } else if (nodeId === 'eco-b2c') {
    html = `
      <h3 style="color:#10b981; margin-top:0; font-size:1.05rem; font-weight:700; display:flex; align-items:center; gap:8px;">
        <i class="fa-solid fa-store"></i> 🛒 B2C Mila Premium Wellness Shop (직영 유통)
      </h3>
      <p style="margin:10px 0; font-size:0.82rem; color:var(--text-secondary); line-height:1.5;">
        일반 소비자와 웰니스 회원들이 자신의 체질(사상 체질) 큐레이션을 바탕으로 프리미엄 전통 발효 식품, 웰니스 주류 및 차류를 신뢰하고 간편 구매하는 <strong>플랫폼 직접 커머스 채널</strong>입니다. 가입자 체질 기반 10% 자동 할인 특전을 제공하며, 상품 거래액의 15%~20%가 플랫폼 운영 수수료 매출로 연결되어 안정적이고 높은 B2C 현금 마진을 확보합니다.
      </p>
      <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
        <span class="badge" style="background:rgba(16,185,129,0.08); color:#10b981; border:1px solid #10b981; padding:2px 8px; border-radius:4px; font-size:0.7rem; font-weight:700;">커머스 유통 수수료 15~20%</span>
        <span class="badge" style="background:rgba(16,185,129,0.08); color:#10b981; border:1px solid #10b981; padding:2px 8px; border-radius:4px; font-size:0.7rem; font-weight:700;">1:1 체질 매칭 유통 채널</span>
      </div>
    `;
  } else if (nodeId === 'eco-b2b') {
    html = `
      <h3 style="color:#a78bfa; margin-top:0; font-size:1.05rem; font-weight:700; display:flex; align-items:center; gap:8px;">
        <i class="fa-solid fa-building"></i> 💼 B2B 프랜차이즈 가맹 & 밀키트 R&D 구독 모델
      </h3>
      <p style="margin:10px 0; font-size:0.82rem; color:var(--text-secondary); line-height:1.5;">
        가맹 본부(Mila F&B, 메디푸드 정기구독) 및 외부 HMR 밀키트 개발사들이 플랫폼 내의 <strong>약선 R&D 설계기</strong> 및 <strong>식단 R&D 플래너</strong>를 사용하여 대형 조리 배비 비율 및 원가를 자동 환산합니다. 가맹점 규모 및 월간 배합 시뮬레이션 트래픽 수치에 따라 월 정액 기반의 API 사용료와 라이선스 구독 패스를 징수하는 고수익 B2B SaaS 사업 모델입니다.
      </p>
      <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
        <span class="badge" style="background:rgba(167,139,250,0.08); color:#a78bfa; border:1px solid #a78bfa; padding:2px 8px; border-radius:4px; font-size:0.7rem; font-weight:700;">B2B SaaS 월 구독료 모델</span>
        <span class="badge" style="background:rgba(167,139,250,0.08); color:#a78bfa; border:1px solid #a78bfa; padding:2px 8px; border-radius:4px; font-size:0.7rem; font-weight:700;">프랜차이즈 배합 스케일러 라이선스</span>
      </div>
    `;
  }
  
  panel.innerHTML = html;
  panel.style.display = 'block';
}
