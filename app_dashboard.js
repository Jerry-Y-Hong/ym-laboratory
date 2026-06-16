// Mila Wellness B2C Dashboard (7-AXIS Chart)

function initDashboard() {
  let suffixRows = '행', suffixFunc = '종', suffixNorm = '개', suffixExcept = '건';
  if (currentLanguage === 'en') {
    suffixRows = ' Rows'; suffixFunc = ' Functions'; suffixNorm = ' Rules'; suffixExcept = ' Exceptions';
  } else if (currentLanguage === 'ja') {
    suffixRows = ' 行'; suffixFunc = ' 種'; suffixNorm = ' 個'; suffixExcept = ' 件';
  } else if (currentLanguage === 'ar') {
    suffixRows = ' صفوف'; suffixFunc = ' وظائف'; suffixNorm = ' قواعد'; suffixExcept = ' استثناءات';
  }
  document.getElementById('stat-master-rows').innerText = `${masterDb.length.toLocaleString()}${suffixRows}`;
  document.getElementById('stat-functions').innerText = `${standardFunctions.length}${suffixFunc}`;
  document.getElementById('stat-normalization').innerText = `${normalizationDict.length}${suffixNorm}`;
  document.getElementById('stat-exceptions').innerText = `${exceptionDict.length}${suffixExcept}`;

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

  // 7-axis local fallback mapping for robust translation
  const localAxisFallback = {
    '정화': { en: 'Purification', ja: '浄化', ar: 'التنقية' },
    '순환': { en: 'Circulation', ja: '循環', ar: 'الدورة الدموية' },
    '회복': { en: 'Recovery', ja: '回復', ar: 'الاستشفاء' },
    '보호': { en: 'Protection', ja: '保護', ar: 'الحماية' },
    '안정': { en: 'Stabilization', ja: '安定', ar: 'الاستقرار' },
    '흡수': { en: 'Absorption', ja: '吸収', ar: 'الامتصاص' },
    '완화': { en: 'Mitigation', ja: '緩和', ar: 'التخفيف' }
  };

  const axisToTranslationKey = {
    '정화': '해독',
    '보호': '면역',
    '흡수': '소화',
    '순환': '순환',
    '회복': '회복',
    '안정': '안정',
    '완화': '완화'
  };

  Object.entries(axisCounts).forEach(([axis, count]) => {
    try {
      const pct = ((count / maxVal) * 100).toFixed(0);
      const div = document.createElement('div');
      div.className = 'axis-bar-item';
      div.onclick = () => routeToAxis(axis);
      
      // 1. Try to fetch professional translation from the dictionary first
      const transKey = axisToTranslationKey[axis] || axis;
      let translatedAxisName = getTranslation(transKey, currentLanguage);
      
      // 2. Apply fallback if dictionary returns the key itself (meaning translation missing)
      if (currentLanguage !== 'ko' && (translatedAxisName === transKey || !translatedAxisName)) {
        if (localAxisFallback[axis]) {
          translatedAxisName = localAxisFallback[axis][currentLanguage] || axis;
        }
      }
      
      // 널/언디파인드 최종 가드
      translatedAxisName = translatedAxisName || axis;
      
      // 3. Format suffix based on language
      let translatedAxis = '';
      if (currentLanguage === 'ko') {
        translatedAxis = axis + " 계열";
      } else if (currentLanguage === 'en') {
        const nameStr = String(translatedAxisName);
        if (nameStr.includes('(') || nameStr.toLowerCase().includes('response')) {
          translatedAxis = nameStr;
        } else {
          translatedAxis = nameStr + " Axis";
        }
      } else if (currentLanguage === 'ja') {
        translatedAxis = String(translatedAxisName) + "系列";
      } else if (currentLanguage === 'ar') {
        translatedAxis = "محور " + String(translatedAxisName);
      } else {
        translatedAxis = String(translatedAxisName) + " 계열";
      }
      
      let mappingText = '';
      let titleText = '';
      
      const enAxis = (localAxisFallback[axis] && localAxisFallback[axis].en) || axis;
      const jaAxis = (localAxisFallback[axis] && localAxisFallback[axis].ja) || axis;
      const arAxis = (localAxisFallback[axis] && localAxisFallback[axis].ar) || axis;

      if (currentLanguage === 'en') {
        mappingText = `${count.toLocaleString()} mapped`;
        titleText = `Click to view standard functions for [${enAxis} Axis]`;
      } else if (currentLanguage === 'ja') {
        mappingText = `${count.toLocaleString()}件マッピング`;
        titleText = `クリックで [${jaAxis} 軸] の詳細標準機能一覧へ移動`;
      } else if (currentLanguage === 'ar') {
        mappingText = `${count.toLocaleString()} تعيينات`;
        titleText = `انقر لعرض وظائف [محور ${arAxis}] القياسية`;
      } else {
        mappingText = `${count.toLocaleString()}건 매핑`;
        titleText = `클릭 시 [${axis} 축] 상세 표준기능 목록으로 이동`;
      }
      
      div.setAttribute('title', titleText);
      div.innerHTML = `
        <div class="axis-bar-lbl">
          <span>${translatedAxis}</span>
          <span>${mappingText}</span>
        </div>
        <div class="axis-bar-track">
          <div class="axis-bar-fill" data-pct="${pct}"></div>
        </div>
      `;
      chartContainer.appendChild(div);
    } catch (loopErr) {
      console.error(`Error rendering chart for axis ${axis}:`, loopErr);
    }
  });

  setTimeout(animateDashboardBars, 100);
}

function animateDashboardBars() {
  document.querySelectorAll('.axis-bar-fill').forEach(fill => {
    const pct = fill.getAttribute('data-pct');
    fill.style.width = `${pct}%`;
  });
}