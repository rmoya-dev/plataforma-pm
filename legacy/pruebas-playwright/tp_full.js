// Recorrido completo: registra, resuelve todos los retos (lee data-expect), revisa errores de consola y resultado final.
const { chromium } = require('playwright');
const { makeBackend } = require('./mock.js');
const FILE = process.env.HTML || '/home/claude/tp/tp.html';
const MOBILE = process.env.MOBILE === '1';
(async () => {
  const be = makeBackend(process.env.CODE_GS || '/home/claude/tp/Code.gs');
  const browser = await chromium.launch();
  const ctx = await browser.newContext(MOBILE ? { viewport: {width: 390, height: 844}, deviceScaleFactor: 1, isMobile: true, hasTouch: true } : { viewport: {width: 1200, height: 900} });
  await ctx.route('https://script.google.com/**', async route => {
    const body = route.request().postData() || '{}';
    route.fulfill({ status: 200, contentType: 'text/plain', headers: {'access-control-allow-origin': '*'}, body: be.post(body) });
  });
  if (FILE.includes('sites')) {
    // el HTML de Sites usa CDN: se sirve desde copias locales
    const fs = require('fs');
    const base = '/home/claude/tp/qa/';
    await ctx.route('https://cdn.jsdelivr.net/**', async route => {
      const u = route.request().url();
      if (process.env.NOCDN) return route.abort();
      let f = u.includes('katex.min.css') ? 'katex.css' : u.includes('katex.min.js') ? 'katex.js' : u.includes('jsxgraph') ? 'jsx.js' : u.includes('confetti') ? 'confetti.js' : null;
      if (f && fs.existsSync(base + f)) return route.fulfill({ status: 200, body: fs.readFileSync(base + f), contentType: f.endsWith('css') ? 'text/css' : 'application/javascript' });
      if (u.includes('/fonts/')) { const ff = base + 'fonts/' + u.split('/fonts/')[1]; if (fs.existsSync(ff)) return route.fulfill({ status: 200, body: fs.readFileSync(ff) }); }
      return route.abort();
    });
  }
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/fonts\.g|net::ERR/.test(m.text())) errors.push('CONSOLE ' + m.text()); });
  await page.addInitScript(() => { window.__ICTEST = true; });
  await page.addInitScript({ path: '/home/claude/tp/qa/rawscan.js' });
  await page.goto('file://' + FILE);
  await page.waitForSelector('#reg_name');
  await page.fill('#reg_name', 'Ana Prueba Quispe');
  await page.selectOption('#reg_carrera', 'Derecho');
  await page.click('#reg_submit');
  await page.waitForTimeout(800);
  const log = [];
  async function solvePhase(n) {
    // abre fase n desde el mapa
    await page.click('#btnMap'); await page.waitForTimeout(300);
    const sel = MOBILE ? '.phase-tile' : '.node-btn';
    const tiles = await page.$$(sel);
    const vis = [];
    for (const t of tiles) if (await t.isVisible()) vis.push(t);
    await vis[n - 1].click(); await page.waitForTimeout(500);
    for (let it = 0; it < 700; it++) { try {
      const done = await page.$('button[id$="_next"]:not(#pn_next):not(#wk_next), button[id$="_after"]');
      if (done && await done.isVisible()) { if (process.env.DUMP) { const t = await page.evaluate(() => { const c = document.body.cloneNode(true); c.querySelectorAll('script,style,.katex-html,svg,.calc-panel').forEach(e => e.remove()); c.querySelectorAll('.katex').forEach(k => { const a = k.querySelector('annotation'); k.replaceWith('$' + (a ? a.textContent : '') + '$'); }); c.querySelectorAll('details').forEach(d => d.setAttribute('open','')); return c.textContent.replace(/[ \t]+/g,' ').replace(/\n\s*\n+/g,'\n'); }); require('fs').writeFileSync('/home/claude/tp/qa/dump_f'+n+'.txt', t); } log.push('  [fase '+n+'] boton fin: '+(await done.getAttribute('id'))); await done.click(); await page.waitForTimeout(400); return true; }
      // detector
      const dets = await page.$$('.det-item[data-ex]');
      if (dets.length) {
        let acted = false;
        for (const d of dets) {
          const cls = await d.getAttribute('class');
          if (/ok/.test(cls)) continue;
          const ex = await d.getAttribute('data-ex');
          const btns = await d.$$('.det-actions button');
          if (btns.length === 2) { await btns[ex === '1' ? 1 : 0].click(); acted = true; await page.waitForTimeout(150); }
        }
        if (acted) { await page.waitForTimeout(1500); continue; }
      }
      const inp = await page.$('input[data-expect]:not([disabled])');
      if (inp && await inp.isVisible()) {
        const v = await inp.getAttribute('data-expect');
        await inp.fill((process.env.ROUND && Math.abs(Number(v)) >= 5) ? String(Math.round(Number(v) * 100) / 100) : String(Number(v)));
        const row = await inp.evaluateHandle(e => e.closest('.num-row'));
        await (await row.asElement().$('button.primary')).click();
        await page.waitForTimeout(1500);
        continue;
      }
      const choices = await page.$$('.choice-grid .choice:not([disabled])');
      if (choices.length) {
        let ok = false;
        for (let i = 0; i < choices.length && !ok; i++) {
          const cs = await page.$$('.choice-grid .choice:not([disabled])');
          if (!cs[i]) break;
          await cs[i].click(); await page.waitForTimeout(120);
          ok = !!(await page.$('.choice-grid .choice.correct'));
          if (!ok) await page.waitForTimeout(1100);
        }
        await page.waitForTimeout(1500);
        continue;
      }
      const nb = await page.$('button:has-text("Siguiente caso")');
      if (nb && await nb.isVisible()) { await nb.click(); await page.waitForTimeout(500); continue; }
      const lastNb = await page.$('button:has-text("Ir a Fase"), button:has-text("Ver tu resumen")');
      if (lastNb && await lastNb.isVisible()) { log.push('  [fase '+n+'] boton: '+(await lastNb.textContent())); await lastNb.click(); await page.waitForTimeout(400); return true; }
      await page.waitForTimeout(300);
    } catch (e) { await page.waitForTimeout(300); } }
    return false;
  }
  for (let n = 1; n <= 6; n++) {
    let ok = false; try { ok = await solvePhase(n); } catch(e) { log.push('fase '+n+' EXCEPCION '+String(e.message).split('\n')[0]); }
    const prog = await page.evaluate(() => JSON.parse(localStorage.getItem('tp-mission-progress-v1') || '{}'));
    log.push('fase ' + n + ': ' + (ok ? 'terminada' : 'ATASCADA') + ' ' + JSON.stringify(Object.fromEntries(Object.entries(prog).filter(([k]) => k[0] !== '_').map(([k, v]) => [k, Object.keys(v).length]))));
  }
  await page.click('#btnMap'); await page.waitForTimeout(400);
  const xp = await page.evaluate(() => document.querySelector('.xp-num') && document.querySelector('.xp-num').textContent);
  log.push('XP mapa: ' + xp);
  await page.screenshot({ path: '/home/claude/tp/qa/shot_map_final' + (MOBILE ? '_m' : '') + '.png' });
  const raw = await page.evaluate(() => [...new Set(window.__RAW || [])]); log.push('LATEX CRUDO: ' + (raw.length ? '\n   ' + raw.slice(0, 20).join('\n   ') : 'ninguno'));
  console.log(log.join('\n'));
  console.log('ERRORES:', errors.length ? '\n' + errors.slice(0, 15).join('\n') : 'ninguno');
  await browser.close();
})();
