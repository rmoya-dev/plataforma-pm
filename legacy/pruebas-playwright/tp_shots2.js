const { chromium } = require('playwright'); const { makeBackend } = require('./mock.js');
(async () => {
  const be = makeBackend('/home/claude/tp/Code.gs'); const browser = await chromium.launch();
  for (const mobile of [true, false]) {
    const ctx = await browser.newContext(mobile ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } : { viewport: { width: 1200, height: 900 } });
    await ctx.route('https://script.google.com/**', r => r.fulfill({ status: 200, contentType: 'text/plain', headers: { 'access-control-allow-origin': '*' }, body: be.post(r.request().postData() || '{}') }));
    const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
    const prog = { despeja: {d1:1,d2:1,d3:1,d4:1,d5:1,d6:1}, formula: {f1:1,f2:1,f3:1,f4:1,f5:1,f6:1}, calcula: {k1:1,k2:1,k3:1,k4:1,k5:1,k6:1}, duplica: {u1:1,u2:1,u3:1,u4:1,u5:1,u6:1}, meta: {m1:1,m2:1,m3:1,m4:1,m5:1}, dictamen: {j1:1,j2:1,j3:1,j4:1} };
    await page.addInitScript((p) => { window.__ICTEST = true; localStorage.setItem('tp-mission-student-v1', JSON.stringify({ name: 'Ana Prueba Quispe', carrera: 'Derecho', apodo: 'Ana' })); localStorage.setItem('tp-mission-progress-v1', JSON.stringify(p)); }, prog);
    await page.goto('file:///home/claude/tp/tp.html'); await page.waitForTimeout(1500);
    const s = mobile ? 'm' : 'd';
    await page.screenshot({ path: `z_map_${s}.png`, fullPage: true });
    const b = await page.$('#map_summary'); if (b) { await b.click(); await page.waitForTimeout(1200); await page.screenshot({ path: `z_sum_${s}.png`, fullPage: true }); }
    await page.click('#btnRank'); await page.waitForTimeout(1500); await page.screenshot({ path: `z_rank_${s}.png`, fullPage: true });
    await page.click('#btnLive'); await page.waitForTimeout(1200); await page.screenshot({ path: `z_live_${s}.png`, fullPage: true });
    // fase 6 con dictamen completo (jefe final)
    await page.click('#btnMap'); await page.waitForTimeout(300); const tiles = await page.$$(mobile ? '.phase-tile' : '.node-btn'); const vis = []; for (const t of tiles) if (await t.isVisible()) vis.push(t); await vis[5].click(); await page.waitForTimeout(1200); await page.screenshot({ path: `z_p6_${s}.png`, fullPage: true });
    console.log(s, 'errores:', errs.length ? errs : 'ninguno'); await ctx.close();
  }
  await browser.close();
})();
