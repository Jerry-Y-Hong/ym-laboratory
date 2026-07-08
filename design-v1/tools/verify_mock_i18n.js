const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const BASE_URL = process.env.MOCK_BASE_URL || 'http://127.0.0.1:8123';
const OUT_DIR = '/mnt/user-data/outputs/mock-i18n-verification';
fs.mkdirSync(OUT_DIR, { recursive: true });

const cases = [
  {
    page: '01-landing.html',
    checks: [
      { lang: 'en', selector: 'h1', expectedIncludes: 'A platform that separates Korean medicinal food experiences' },
      { lang: 'ja', selector: 'h1', expectedIncludes: '韓国の薬膳体験' },
      { lang: 'ar', selector: 'h1', expectedIncludes: 'منصة تفصل بين تجربة الأغذية العلاجية الكورية' }
    ]
  },
  {
    page: '09-standard-7axis.html',
    checks: [
      { lang: 'en', selector: 'h1', expectedIncludes: 'Research Standards and 7-Axis Framework' },
      { lang: 'ja', selector: 'h1', expectedIncludes: '研究基準と7軸体系' },
      { lang: 'ar', selector: 'h1', expectedIncludes: 'معايير البحث وإطار المحاور السبعة' }
    ]
  },
  {
    page: '14-crm-admin.html',
    checks: [
      { lang: 'en', selector: 'h1', expectedIncludes: 'Subscribers · Leads · Operations CRM' },
      { lang: 'ja', selector: 'h1', expectedIncludes: '購読者・リード・運営CRM' },
      { lang: 'ar', selector: 'h1', expectedIncludes: 'المشتركون · العملاء المحتملون · إدارة CRM' }
    ]
  },
  {
    page: '17-mila-shop.html',
    checks: [
      { lang: 'en', selector: 'h1', expectedIncludes: 'MILA Premium Shop' },
      { lang: 'ja', selector: 'h1', expectedIncludes: 'MILAプレミアムショップ' },
      { lang: 'ar', selector: 'h1', expectedIncludes: 'متجر MILA المميز' }
    ]
  }
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  try {
    for (const testCase of cases) {
      for (const check of testCase.checks) {
        const page = await browser.newPage({ viewport: { width: 1440, height: 2000 } });
        const result = { page: testCase.page, ...check, passed: false };
        try {
          await page.goto(`${BASE_URL}/${testCase.page}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
          await page.waitForFunction(() => !!window.YMDesignMock && typeof window.YMDesignMock.switchLanguage === 'function', null, { timeout: 120000 });
          await page.evaluate((lang) => window.YMDesignMock.switchLanguage(lang), check.lang);
          await page.waitForTimeout(200);
          const actual = (await page.locator(check.selector).first().textContent() || '').replace(/\s+/g, ' ').trim();
          const htmlLang = await page.evaluate(() => document.documentElement.lang);
          const dir = await page.evaluate(() => document.documentElement.dir || 'ltr');
          result.actual = actual;
          result.htmlLang = htmlLang;
          result.dir = dir;
          result.passed = actual.includes(check.expectedIncludes) && htmlLang === check.lang && (check.lang === 'ar' ? dir === 'rtl' : dir === 'ltr');
          if (!result.passed) {
            const shot = path.join(OUT_DIR, `${testCase.page.replace('.html','')}-${check.lang}.png`);
            await page.screenshot({ path: shot, fullPage: true });
            result.screenshot = shot;
          }
        } catch (err) {
          result.error = String(err && err.stack ? err.stack : err);
          const shot = path.join(OUT_DIR, `${testCase.page.replace('.html','')}-${check.lang}-error.png`);
          try { await page.screenshot({ path: shot, fullPage: true }); result.screenshot = shot; } catch {}
        } finally {
          await page.close();
        }
        results.push(result);
      }
    }
  } finally {
    await browser.close();
  }

  const summary = {
    baseUrl: BASE_URL,
    total: results.length,
    passed: results.filter(r => r.passed).length,
    failed: results.filter(r => !r.passed).length,
    results
  };
  const outFile = path.join(OUT_DIR, 'verify_mock_i18n.json');
  fs.writeFileSync(outFile, JSON.stringify(summary, null, 2));
  console.log(outFile);
  console.log(`pass=${summary.passed} fail=${summary.failed}`);
  if (summary.failed > 0) process.exit(1);
})();
