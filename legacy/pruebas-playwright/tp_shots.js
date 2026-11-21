const { chromium } = require('playwright');
const { makeBackend } = require('./mock.js');
const MOBILE = process.env.MOBILE !== '0';
(async () => {
  const be = makeBackend('/home/claude/tp/Code.gs');
  const browser = await chromium.launch();
  const ctx = await browser.newContext(MOBILE ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true } : { viewport: { width: 1200, height: 900 } });
  await ctx.route('https://script.google.com/**', r => r.fulfill({ status: 200, contentType: 'text/plain', headers: { 'access-control-allow-origin': '*' }, body: be.post(r.request().postData() || '{}') }));
  const page = await ctx.newPage(); const errors = [];
  page.on('pageerror', e => errors.push('PE ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/fonts\.g|net::ERR/.test(m.text())) errors.push('CE ' + m.text().slice(0, 200)); });
  const prog = { despeja: {d1:1,d2:1,d3:1,d4:1,d5:1,d6:1}, formula: {f1:1,f2:1,f3:1,f4:1,f5:1,f6:1}, calcula: {k1:1,k2:1,k3:1,k4:1,k5:1,k6:1}, duplica: {u1:1,u2:1,u3:1,u4:1,u5:1,u6:1}, meta: {m1:1,m2:1,m3:1,m4:1,m5:1}, dictamen: {j1:1} };
  await page.addInitScript((p) => { window.__ICTEST = true; localStorage.setItem('tp-mission-student-v1', JSON.stringify({ name: 'Ana Prueba', carrera: 'Psicología', apodo: 'Ana' })); localStorage.setItem('tp-mission-progress-v1', JSON.stringify(p)); }, prog);
  await page.goto('file:///home/claude/tp/tp.html'); await page.waitForTimeout(1500);
  const sfx = MOBILE ? '_m' : '_d';
  await page.screenshot({ path: `/home/claude/tp/qa/s_map${sfx}.png`, fullPage: true });
  const sel = MOBILE ? '.phase-tile' : '.node-btn';
  for (const n of [1, 2, 3, 4, 5, 6]) {
    await page.click('#btnMap'); await page.waitForTimeout(300);
    const tiles = await page.$$(sel); const vis = []; for (const t of tiles) if (await t.isVisible()) vis.push(t);
    await vis[n - 1].click(); await page.waitForTimeout(1200);
    await page.screenshot({ path: `/home/claude/tp/qa/s_p${n}${sfx}.png`, fullPage: true });
  }
  console.log('ERRORES:', errors.length ? errors.join('\n') : 'ninguno');
  await browser.close();
})();
