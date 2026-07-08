const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const BASE = process.env.MOCK_BASE_URL || 'http://127.0.0.1:8123';
const OUT_DIR = '/home/user/ym-laboratory/design-v1/tools';
const SCREEN_DIR = '/mnt/user-data/outputs/mock-verification-screens';
fs.mkdirSync(SCREEN_DIR, { recursive: true });

function result(page, name) {
  return { page, name, status: 'pass', details: '' };
}

async function capture(page, file) {
  const full = path.join(SCREEN_DIR, file);
  await page.screenshot({ path: full, fullPage: true });
  return full;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const tests = [];


  async function unlockIfNeeded(page, role) {
    const gate = page.locator('[data-access-gate]');
    if (await gate.count()) {
      const selector = role === 'admin' ? '[data-gate-enter-role="admin"]' : '[data-gate-enter-role="expert"]';
      if (await page.locator(selector).count()) {
        await page.locator(selector).click();
        await page.waitForLoadState('networkidle');
      }
    }
  }

  async function run(name, pageName, fn) {
    const context = await browser.newContext();
    const page = await context.newPage();
    const t = result(pageName, name);
    try {
      await page.goto(`${BASE}/${pageName}`, { waitUntil: 'networkidle' });
      await fn(page, t);
    } catch (e) {
      t.status = 'fail';
      t.details = e && e.message ? e.message : String(e);
      try { t.screenshot = await capture(page, `${pageName.replace('.html','')}_${name.replace(/\s+/g,'_')}.png`); } catch {}
    }
    tests.push(t);
    await context.close();
  }


  await run('01 일반 사용자 진입', '01-landing.html', async (page, t) => {
    await page.locator('[data-role-entry="consumer"]').click();
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (!/02-dashboard\.html$/.test(url)) throw new Error(`did not navigate to consumer flow: ${url}`);
  });

  await run('01 전문가 진입', '01-landing.html', async (page, t) => {
    await page.locator('[data-role-entry="expert"]').click();
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (!/09-standard-7axis\.html$/.test(url)) throw new Error(`did not navigate to expert flow: ${url}`);
  });

  await run('09 전문가 접근 가드', '09-standard-7axis.html', async (page, t) => {
    const gate = page.locator('[data-access-gate="expert"]');
    if (await gate.count() !== 1) throw new Error('expert gate not shown');
  });

  await run('14 운영 접근 가드', '14-crm-admin.html', async (page, t) => {
    const gate = page.locator('[data-access-gate="admin"]');
    if (await gate.count() !== 1) throw new Error('admin gate not shown');
  });

  await run('12 탭 클릭 반응', '12-rd-builder.html', async (page, t) => {
    await unlockIfNeeded(page, 'expert');
    const tabs = page.locator('.tabs .tab');
    await tabs.nth(1).click({ force: true });
    const activeText = await page.locator('.tabs .tab.active').textContent();
    if (!/2\) 검증/.test(activeText || '')) throw new Error(`active tab unchanged: ${activeText}`);
  });

  await run('12 다음 단계 버튼 반응', '12-rd-builder.html', async (page, t) => {
    await unlockIfNeeded(page, 'expert');
    await page.locator('[data-rd-next]').click();
    const lastRow = page.locator('.row-list .row').last().locator('span').nth(1);
    const text = await lastRow.textContent();
    if (!/등록 완료/.test(text || '')) throw new Error(`registration status unchanged: ${text}`);
  });

  await run('07 후기 등록 반영', '07-feedback.html', async (page, t) => {
    await page.locator('textarea').fill('자동 검증용 후기입니다.');
    await page.locator('[data-feedback-submit]').click();
    const btn = await page.locator('[data-feedback-submit]').textContent();
    if (!/등록 완료/.test(btn || '')) throw new Error(`button not updated: ${btn}`);
  });

  await run('13 참가 버튼 반응', '13-pro-community.html', async (page, t) => {
    await unlockIfNeeded(page, 'expert');
    await page.locator('[data-join-id]').first().click();
    const text = await page.locator('[data-join-id]').first().textContent();
    if (!/참가 완료/.test(text || '')) throw new Error(`join status unchanged: ${text}`);
  });

  await run('17 카테고리 전환', '17-mila-shop.html', async (page, t) => {
    await page.locator('[data-category-target="cat-fermentation"]').first().click();
    const hidden = await page.locator('#cat-fermentation').getAttribute('hidden');
    if (hidden !== null) throw new Error('fermentation detail still hidden');
  });

  await run('17 상품 상세 전환', '17-mila-shop.html', async (page, t) => {
    await page.locator('[data-product-target="prod-purplecarrot-oil"]').first().click();
    const panelText = await page.locator('#shop-product-detail-panel').textContent();
    if (!/자색당근 페이셜 오일/.test(panelText || '')) throw new Error('product detail not updated');
  });

  await run('03 체질 전환 반응', '03-query.html', async (page, t) => {
    await page.locator('#constitution-btn').click();
    const btnText = await page.locator('#constitution-btn').textContent();
    const titleText = await page.locator('#result-title').textContent();
    if (!/소양/.test(btnText || '') || !/소양/.test(titleText || '')) throw new Error(`constitution not switched: btn=${btnText}, title=${titleText}`);
  });

  await run('03 검색 결과 안내 반영', '03-query.html', async (page, t) => {
    await page.locator('#symptom-input').fill('목이 마르고 열감이 있어요');
    await page.locator('#search-btn').click();
    const note = await page.locator('#result-note').textContent();
    if (!/목이 마르고 열감이 있어요/.test(note || '')) throw new Error(`search note not updated: ${note}`);
  });

  await run('15 탭 클릭 반응', '15-rd-business.html', async (page, t) => {
    await unlockIfNeeded(page, 'expert');
    const tabs = page.locator('.tabs .tab');
    await tabs.nth(2).click({ force: true });
    const activeText = await page.locator('.tabs .tab.active').textContent();
    if (!/글로벌 파트너십/.test(activeText || '')) throw new Error(`active tab unchanged: ${activeText}`);
  });

  await run('16 만들기 버튼 이동', '16-mila-beauty.html', async (page, t) => {
    await page.locator('[data-add-cart="동충하초 마스크"]').click();
    await page.waitForTimeout(400);
    const url = page.url();
    if (!/17-mila-shop\.html(?:#.*)?$/.test(url)) throw new Error(`did not navigate to shop: ${url}`);
  });

  await run('08 만들기 링크 이동', '08-beauty.html', async (page, t) => {
    await page.locator('a.cta').first().click();
    await page.waitForLoadState('networkidle');
    const url = page.url();
    if (!/16-mila-beauty\.html$/.test(url)) throw new Error(`did not navigate to beauty page: ${url}`);
  });

  await run('02 탭 클릭 반응', '02-dashboard.html', async (page, t) => {
    const tabs = page.locator('.tabs .tab');
    await tabs.nth(1).click({ force: true });
    const activeText = await page.locator('.tabs .tab.active').textContent();
    if (!/기록/.test(activeText || '')) throw new Error(`active tab unchanged: ${activeText}`);
  });

  await run('10 탭 클릭 반응', '10-normalize-exceptions.html', async (page, t) => {
    await unlockIfNeeded(page, 'expert');
    const tabs = page.locator('.tabs .tab');
    await tabs.nth(1).click({ force: true });
    const activeText = await page.locator('.tabs .tab.active').textContent();
    if (!/동의어/.test(activeText || '')) throw new Error(`active tab unchanged: ${activeText}`);
  });

  await run('14 탭 클릭 반응', '14-crm-admin.html', async (page, t) => {
    await unlockIfNeeded(page, 'admin');
    const tabs = page.locator('.tabs .tab');
    await tabs.nth(2).click({ force: true });
    const activeText = await page.locator('.tabs .tab.active').textContent();
    if (!/VIP/.test(activeText || '')) throw new Error(`active tab unchanged: ${activeText}`);
  });

  await browser.close();

  const pass = tests.filter(t => t.status === 'pass').length;
  const fail = tests.filter(t => t.status === 'fail').length;

  const md = [];
  md.push('# YM Mock 브라우저 자동 검증 리포트');
  md.push('');
  md.push(`- 기준 URL: ${BASE}`);
  md.push(`- 총 테스트: ${tests.length}`);
  md.push(`- 통과: ${pass}`);
  md.push(`- 실패: ${fail}`);
  md.push('');
  md.push('## 결과');
  for (const t of tests) {
    md.push(`- [${t.status.toUpperCase()}] **${t.page}** · ${t.name}${t.details ? ` — ${t.details}` : ''}${t.screenshot ? ` — screenshot: ${t.screenshot}` : ''}`);
  }

  fs.writeFileSync(path.join(OUT_DIR, 'verification_behavior_latest.json'), JSON.stringify({ base: BASE, pass, fail, tests }, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, 'verification_behavior_latest.md'), md.join('\n') + '\n');

  console.log(path.join(OUT_DIR, 'verification_behavior_latest.md'));
  console.log(path.join(OUT_DIR, 'verification_behavior_latest.json'));
  console.log(`pass=${pass} fail=${fail}`);
})();
