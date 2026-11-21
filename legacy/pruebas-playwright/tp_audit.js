const { chromium } = require('playwright'); const fs = require('fs');
const { makeBackend } = require('./mock.js');
const FILES = ['/home/claude/tp/tp.html', '/home/claude/tp/tp-sites.html'];
const VPS = [[320, 640], [390, 844], [768, 1024], [1200, 900]];
const base = '/home/claude/tp/qa/';
const prog = { despeja: {d1:1,d2:1,d3:1,d4:1,d5:1,d6:1}, formula: {f1:1,f2:1,f3:1,f4:1,f5:1,f6:1}, calcula: {k1:1,k2:1,k3:1,k4:1,k5:1,k6:1}, duplica: {u1:1,u2:1,u3:1,u4:1,u5:1,u6:1}, meta: {m1:1,m2:1,m3:1,m4:1,m5:1}, dictamen: {j1:1,j2:1,j3:1,j4:1} };
(async () => {
  const browser = await chromium.launch(); const out = [];
  for (const F of FILES) for (const dark of [false, true]) for (const [w, h] of VPS) {
    const be = makeBackend('/home/claude/tp/Code.gs');
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: dark ? 'dark' : 'light', isMobile: w < 500, hasTouch: w < 500 });
    await ctx.route('https://script.google.com/**', r => r.fulfill({ status: 200, contentType: 'text/plain', headers: { 'access-control-allow-origin': '*' }, body: be.post(r.request().postData() || '{}') }));
    await ctx.route('https://cdn.jsdelivr.net/**', async route => { const u = route.request().url(); let f = u.includes('katex.min.css') ? 'katex.css' : u.includes('katex.min.js') ? 'katex.js' : u.includes('jsxgraph') ? 'jsx.js' : u.includes('confetti') ? 'confetti.js' : null; if (f) return route.fulfill({ status: 200, body: fs.readFileSync(base + f), contentType: f.endsWith('css') ? 'text/css' : 'application/javascript' }); if (u.includes('/fonts/')) { const ff = base + 'fonts/' + u.split('/fonts/')[1]; if (fs.existsSync(ff)) return route.fulfill({ status: 200, body: fs.readFileSync(ff) }); } return route.abort(); });
    const page = await ctx.newPage(); const errs = [];
    page.on('pageerror', e => errs.push('PE ' + e.message)); page.on('console', m => { if (m.type() === 'error' && !/fonts\.g|net::ERR|Failed to load resource/.test(m.text())) errs.push('CE ' + m.text().slice(0, 160)); });
    await page.addInitScript((p) => { window.__ICTEST = true; localStorage.setItem('tp-mission-student-v1', JSON.stringify({ name: 'Ana Prueba', carrera: 'Psicología', apodo: 'Ana' })); localStorage.setItem('tp-mission-progress-v1', JSON.stringify(p)); }, prog);
    await page.goto('file://' + F); await page.waitForTimeout(1200);
    const tag = `${F.includes('sites') ? 'SITES' : 'INLINE'} ${dark ? 'dark' : 'light'} ${w}px`;
    const chk = async (label) => {
      const r = await page.evaluate(() => ({
        kerr: document.querySelectorAll('.katex-error').length, kat: document.querySelectorAll('.katex').length,
        raw: (document.body.innerText.match(/\$[^$\n]{1,60}\$/g) || []).slice(0, 3),
        jxg: document.querySelectorAll('.JXGtext, svg.JXGtext, .jxgbox').length,
        ovf: document.documentElement.scrollWidth - window.innerWidth,
        wide: [...document.querySelectorAll('body *')].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.right > window.innerWidth + 2 && !e.closest('[style*="overflow"],.th-table,.tex-block,.calc-expr,.peek-body,.calc-steps,.rank-table,table') && getComputedStyle(e).position !== 'fixed'; }).slice(0, 3).map(e => e.tagName + '.' + (e.className && e.className.baseVal === undefined ? e.className : '') + ' r=' + Math.round(e.getBoundingClientRect().right)),
        hasK: typeof window.katex }));
      if (r.kerr || r.raw.length || r.ovf > 1 || r.wide.length) out.push(`${tag} ${label}: ` + JSON.stringify(r));
      return r;
    };
    await chk('mapa');
    const sel = w < 500 ? '.phase-tile' : '.node-btn';
    for (let n = 1; n <= 6; n++) {
      await page.click('#btnMap'); await page.waitForTimeout(250);
      const tiles = await page.$$(sel); const vis = []; for (const t of tiles) if (await t.isVisible()) vis.push(t);
      await vis[n - 1].click(); await page.waitForTimeout(900);
      // abre todos los details
      await page.evaluate(() => document.querySelectorAll('details').forEach(d => d.open = true)); await page.waitForTimeout(300);
      const r = await chk('fase ' + n);
      if (n === 1 && w === 1200) out.push(`${tag} info: katex=${r.kat} typeof=${r.hasK} jxg=${r.jxg}`);
      // mover los sliders del laboratorio
      const sliders = await page.$$('input[type=range]');
      for (const s of sliders) { try { await s.evaluate(e => { e.value = e.max; e.dispatchEvent(new Event('input', {bubbles: true})); }); await s.evaluate(e => { e.value = e.min; e.dispatchEvent(new Event('input', {bubbles: true})); }); } catch (e) {} }
      await page.waitForTimeout(200); await chk('fase ' + n + ' sliders');
    }
    // otras vistas
    for (const [lbl, selb] of [['ranking', '#btnRank'], ['sala', '#btnLive']]) { const b = await page.$(selb); if (b && await b.isVisible()) { await b.click(); await page.waitForTimeout(600); await chk(lbl); } }
    if (errs.length) out.push(`${tag} ERRORES: ` + [...new Set(errs)].slice(0, 5).join(' | '));
    await ctx.close();
  }
  console.log(out.length ? out.join('\n') : 'AUDIT OK'); await browser.close();
})();
