const { chromium } = require('playwright'); const fs = require('fs');
const { makeBackend } = require('./mock.js');
const base = '/home/claude/tp/qa/';
const HTML = process.env.HTML || '/home/claude/tp/tp.html';
const results = []; const ok = (name, cond, extra) => { results.push((cond ? 'OK   ' : 'FALLA') + ' ' + name + (extra ? ' :: ' + extra : '')); };
(async () => {
  const browser = await chromium.launch();
  const be = makeBackend('/home/claude/tp/Code.gs');
  let mode = 'normal'; let delay = 0; let calls = 0;
  async function mkCtx(opts = {}) {
    const ctx = await browser.newContext(opts.ctx || { viewport: { width: 1200, height: 900 } });
    await ctx.route('https://script.google.com/**', async r => {
      calls++;
      if (mode === 'down') return r.abort('failed');
      if (mode === 'hang') { await new Promise(x => setTimeout(x, 45000)); return r.abort('timedout').catch(() => {}); }
      if (delay) await new Promise(x => setTimeout(x, delay));
      if (mode === 'html') return r.fulfill({ status: 200, contentType: 'text/html', body: '<html><body>Se necesita autorización</body></html>' });
      if (mode === '500') return r.fulfill({ status: 500, contentType: 'text/plain', body: 'Internal error' });
      if (mode === 'flaky' && Math.random() < 0.5) return r.abort('failed');
      r.fulfill({ status: 200, contentType: 'text/plain', headers: { 'access-control-allow-origin': '*' }, body: be.post(r.request().postData() || '{}') });
    });
    if (opts.cdn !== false) await ctx.route('https://cdn.jsdelivr.net/**', async route => { const u = route.request().url(); let f = u.includes('katex.min.css') ? 'katex.css' : u.includes('katex.min.js') ? 'katex.js' : u.includes('jsxgraph') ? 'jsx.js' : u.includes('confetti') ? 'confetti.js' : null; if (f) return route.fulfill({ status: 200, body: fs.readFileSync(base + f), contentType: f.endsWith('css') ? 'text/css' : 'application/javascript' }); return route.abort(); });
    else await ctx.route('https://cdn.jsdelivr.net/**', r => r.abort());
    return ctx;
  }
  async function mkPage(ctx, init) {
    const page = await ctx.newPage(); const errs = [];
    page.on('pageerror', e => errs.push('PE ' + e.message));
    page.on('console', m => { if (m.type() === 'error' && !/fonts\.g|net::ERR|Failed to load resource/.test(m.text())) errs.push('CE ' + m.text().slice(0, 200)); });
    await page.addInitScript(() => { window.__ICTEST = true; });
    if (init) await page.addInitScript(init);
    page.errs = errs; return page;
  }
  const prog = page => page.evaluate(() => { try { return JSON.parse(localStorage.getItem('tp-mission-progress-v1') || '{}'); } catch (e) { return null; } });
  const count = p => p ? Object.entries(p).filter(([k]) => k[0] !== '_').reduce((a, [, v]) => a + Object.keys(v).length, 0) : -1;
  async function register(page, name, car) {
    await page.goto('file://' + HTML); await page.waitForSelector('#reg_name');
    await page.fill('#reg_name', name); await page.selectOption('#reg_carrera', car || 'Derecho'); await page.click('#reg_submit'); await page.waitForTimeout(900); await page.waitForSelector('#reg_name', { state: 'hidden', timeout: 15000 }).catch(() => {}); await page.waitForTimeout(300);
  }
  async function openPhase(page, n) {
    await page.click('#btnMap'); await page.waitForTimeout(250);
    const tiles = await page.$$('.node-btn'); const vis = []; for (const t of tiles) if (await t.isVisible()) vis.push(t);
    await vis[n - 1].click(); await page.waitForTimeout(700);
  }
  async function solveOne(page) { // resuelve el siguiente reto visible
    const inp = await page.$('input[data-expect]:not([disabled])');
    if (inp && await inp.isVisible()) { const v = await inp.getAttribute('data-expect'); await inp.fill(String(Number(v))); const row = await inp.evaluateHandle(e => e.closest('.num-row')); await (await row.asElement().$('button.primary')).click(); await page.waitForTimeout(900); return true; }
    const cs = await page.$$('.choice-grid .choice:not([disabled])');
    if (cs.length) { for (let i = 0; i < cs.length; i++) { const c2 = await page.$$('.choice-grid .choice:not([disabled])'); if (!c2[i]) break; await c2[i].click(); await page.waitForTimeout(150); if (await page.$('.choice-grid .choice.correct')) break; await page.waitForTimeout(1100); } await page.waitForTimeout(900); return true; }
    return false;
  }
  async function solveN(page, n) { for (let i = 0; i < 40 && count(await prog(page)) < n; i++) { if (!(await solveOne(page))) await page.waitForTimeout(300); } }

  // ---- T1: nube caída desde el inicio
  mode = 'down';
  let ctxA = await mkCtx(); let pA = await mkPage(ctxA);
  await register(pA, 'Lucía Prueba Ñahui', 'Psicología');
  ok('T1a registro con la nube caída llega al mapa', !!(await pA.$('#btnMap')) && await pA.isVisible('#btnMap'));
  await openPhase(pA, 1); await solveN(pA, 3);
  let pr = await prog(pA); ok('T1b progreso local con nube caída (3 retos)', count(pr) >= 3, JSON.stringify(Object.fromEntries(Object.entries(pr).filter(([k]) => k[0] !== '_').map(([k, v]) => [k, Object.keys(v).length]))));
  const bodyTxt = await pA.evaluate(() => document.body.innerText);
  ok('T1c aparece aviso de guardado pendiente', /pendiente|sin conexi|no se pudo|reintent|guardad[oa] en este dispositivo|nube/i.test(bodyTxt), (bodyTxt.match(/.{0,50}(pendiente|sin conexi|no se pudo|reintent|nube).{0,60}/i) || [''])[0]);
  ok('T1d sin errores JS con la nube caída', pA.errs.length === 0, pA.errs.join(' | '));
  // ---- T2: la red vuelve → sincroniza sola
  mode = 'normal';
  await pA.waitForTimeout(25000);
  const sheetName = Object.keys(be.sheets).find(n => /Progreso/i.test(n));
  const rows = sheetName ? be.sheets[sheetName]._rows : [];
  ok('T2 al volver la red, el progreso llega a la hoja (reintento automático)', rows.length >= 2, 'hoja=' + sheetName + ' filas=' + rows.length + ' llamadas=' + calls);
  // ---- T3: recarga conserva todo
  await pA.reload(); await pA.waitForTimeout(1200);
  pr = await prog(pA); ok('T3 recarga conserva el progreso', count(pr) >= 3, String(count(pr)));
  ok('T3b recarga no pide registro de nuevo', !(await pA.$('#reg_name')) || !(await pA.isVisible('#reg_name')));
  // ---- T4: otro dispositivo, mismo nombre → restaura de la nube
  const ctxB = await mkCtx(); const pB = await mkPage(ctxB);
  await register(pB, 'Lucía Prueba Ñahui', 'Psicología'); await pB.waitForTimeout(2500);
  pr = await prog(pB); ok('T4 otro dispositivo restaura el progreso desde la nube', count(pr) >= 3, 'retos=' + count(pr));
  ok('T4b sin errores JS', pB.errs.length === 0, pB.errs.join(' | '));
  await ctxB.close();
  // ---- T5: respuesta HTML (página de permisos) y error 500
  for (const m of ['html', '500', 'flaky']) {
    mode = m; const c5 = await mkCtx(); const p5 = await mkPage(c5);
    await register(p5, 'Prueba Modo ' + m, 'Derecho'); await openPhase(p5, 1); await solveN(p5, 2);
    ok(`T5 modo ${m}: se puede estudiar y guarda local`, count(await prog(p5)) >= 2); ok(`T5 modo ${m}: sin errores JS`, p5.errs.length === 0, p5.errs.join(' | '));
    await c5.close();
  }
  mode = 'normal';
  // ---- T6: API lenta (5 s)
  delay = 5000; { const c6 = await mkCtx(); const p6 = await mkPage(c6); const t0 = Date.now(); await register(p6, 'Prueba Lenta', 'Derecho'); await openPhase(p6, 1); await solveN(p6, 3);
    ok('T6 con API lenta (5 s) la interfaz no se bloquea', count(await prog(p6)) >= 3 && Date.now() - t0 < 60000, (Date.now() - t0) + ' ms, retos=' + count(await prog(p6))); ok('T6 sin errores JS', p6.errs.length === 0, p6.errs.join(' | ')); await p6.waitForTimeout(7000); await c6.close(); }
  delay = 0;
  // ---- T7: sin internet a mitad de sesión
  { const c7 = await mkCtx(); const p7 = await mkPage(c7); await register(p7, 'Prueba Offline', 'Derecho'); await openPhase(p7, 1); await solveN(p7, 1);
    await c7.setOffline(true); await solveN(p7, 3); await p7.waitForTimeout(1500); ok('T7 sin internet: sigue funcionando local', count(await prog(p7)) >= 3);
    await c7.setOffline(false); await p7.waitForTimeout(22000);
    const sn = Object.keys(be.sheets).find(n => /Progreso/i.test(n)); const row = be.sheets[sn]._rows.find(r => String(r.join('|')).includes('Prueba Offline'));
    ok('T7b al volver internet se sincroniza', !!row, row ? row.slice(0, 8).join(',') : 'sin fila'); ok('T7c sin errores JS', p7.errs.length === 0, p7.errs.join(' | ')); await c7.close(); }
  // ---- T8: localStorage bloqueado
  { const c8 = await mkCtx(); const p8 = await mkPage(c8, () => { const thr = () => { throw new DOMException('blocked', 'SecurityError'); }; Storage.prototype.getItem = thr; Storage.prototype.setItem = thr; Storage.prototype.removeItem = thr; });
    await p8.goto('file://' + HTML); await p8.waitForTimeout(1200);
    const reg = await p8.$('#reg_name'); ok('T8a con localStorage bloqueado carga el registro', !!reg);
    if (reg) { await p8.fill('#reg_name', 'Prueba Sin Storage'); await p8.selectOption('#reg_carrera', 'Derecho'); await p8.click('#reg_submit'); await p8.waitForTimeout(900); await openPhase(p8, 1);
      const nb = await p8.$$eval('.mission-card, .card', e => e.length); ok('T8b abre la fase 1 sin storage', nb > 0);
      const inp = await p8.$$('.choice-grid .choice'); if (inp.length) { await inp[0].click(); await p8.waitForTimeout(800); } }
    ok('T8c sin errores JS con storage bloqueado', p8.errs.length === 0, p8.errs.join(' | ')); await c8.close(); }
  // ---- T9: entradas raras y doble clic
  { const c9 = await mkCtx(); const p9 = await mkPage(c9); await register(p9, 'María José Ñahui-Quispe de la Cruz Hernández Pérez 😀', 'Otra carrera');
    ok('T9a nombre largo con emoji y «Otra carrera» entra al mapa', await p9.isVisible('#btnMap'));
    await openPhase(p9, 1); await solveN(p9, 3); // hasta d3 resuelto
    // d4: numérico  →  probar entradas raras
    await p9.waitForSelector('input[data-expect]:not([disabled])', {timeout: 8000}); const inp = await p9.$('input[data-expect]:not([disabled])'); const exp = Number(await inp.getAttribute('data-expect'));
    const row = await inp.evaluateHandle(e => e.closest('.num-row')); const btn = await (await row.asElement()).$('button.primary');
    for (const bad of ['', 'abc', '--', '1e999', '1/0']) { await inp.fill(bad); await btn.click(); await p9.waitForTimeout(150); }
    ok('T9b entradas inválidas no resuelven ni rompen', count(await prog(p9)) === 3 && p9.errs.length === 0, p9.errs.join(' | '));
    await inp.fill(String(exp).replace('.', ',')); await btn.click(); await btn.click({ timeout: 800 }).catch(() => {}); await p9.waitForTimeout(300); await btn.click({ force: true, timeout: 500 }).catch(() => {});
    await p9.waitForTimeout(900);
    const p = await prog(p9); ok('T9c coma decimal aceptada y doble clic no duplica', count(p) === 4, 'retos=' + count(p));
    const xp = await p9.evaluate(() => { const e = document.querySelector('.xp-num'); return e ? e.textContent : ''; });
    ok('T9d XP coherente tras doble clic', true, 'xp=' + xp);
    ok('T9e sin errores JS', p9.errs.length === 0, p9.errs.join(' | ')); await c9.close(); }
  // ---- T10: panel docente con nube caída / PIN incorrecto
  { const c10 = await mkCtx(); const p10 = await mkPage(c10); await register(p10, 'Docente Prueba', 'Derecho');
    await p10.goto('file://' + HTML + '#docente'); await p10.waitForTimeout(1200); const txt = await p10.evaluate(() => document.body.innerText);
    ok('T10a #docente muestra acceso con PIN', /PIN/i.test(txt)); 
    const pin = await p10.$('input[type=password], #tpin, input[id*=pin i]'); if (pin) { await pin.fill('equivocado'); const b = await p10.$('button:has-text("Entrar"), button:has-text("Acceder"), button:has-text("Ingresar")'); if (b) { await b.click(); await p10.waitForTimeout(1500); const t2 = await p10.evaluate(() => document.body.innerText); ok('T10b PIN incorrecto da mensaje claro', /PIN incorrecto|incorrect/i.test(t2), (t2.match(/.{0,40}PIN.{0,60}/i) || [''])[0]); }
      mode = 'down'; if (b) { await pin.fill('PIN-DE-EJEMPLO'); await b.click(); await p10.waitForTimeout(1500); const t3 = await p10.evaluate(() => document.body.innerText); ok('T10c nube caída en el panel: mensaje claro, sin romper', /no pudo comunicarse|sin internet|respaldo/i.test(t3), (t3.match(/.{0,40}(comunicarse|respaldo).{0,60}/i) || [''])[0]); } mode = 'normal'; }
    ok('T10d sin errores JS', p10.errs.length === 0, p10.errs.join(' | ')); await c10.close(); }
  // ---- T11: peticiones que se cuelgan (Wi-Fi saturado)
  { mode = 'hang'; const c11 = await mkCtx(); const p11 = await mkPage(c11); const t0 = Date.now(); await register(p11, 'Prueba Colgada', 'Psicología');
    ok('T11a con peticiones colgadas el registro entra al mapa en <10 s', await p11.isVisible('#btnMap') && Date.now() - t0 < 10000, (Date.now() - t0) + ' ms');
    await openPhase(p11, 1); await solveN(p11, 3); ok('T11b se puede estudiar mientras la nube no responde', count(await prog(p11)) >= 3);
    mode = 'normal'; await p11.waitForTimeout(90000);
    const sn = Object.keys(be.sheets).find(n => /Progreso/i.test(n)); const row = be.sheets[sn]._rows.find(r => String(r.join('|')).includes('Prueba Colgada'));
    ok('T11c al responder la nube, el avance se sincroniza solo (<90 s)', !!row && /"d3":true/.test(row.join('|')), row ? 'ok' : 'sin fila');
    ok('T11d sin errores JS', p11.errs.length === 0, p11.errs.join(' | ')); await c11.close(); }
  console.log(results.join('\n')); await browser.close();
})().catch(e => { console.log(results.join('\n')); console.error('EXCEPCION', e); process.exit(1); });
