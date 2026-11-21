const { chromium } = require('playwright'); const { makeBackend } = require('./mock.js');
(async () => {
  const be = makeBackend('/home/claude/tp/Code.gs', s => s.replace('Math.max(30, Math.min(300, q))', 'Math.max(3, Math.min(300, q))').replace('FLASH_COUNTDOWN_MS = 12000', 'FLASH_COUNTDOWN_MS = 4000'));
  const browser = await chromium.launch(); const errors = []; const sleep = ms => new Promise(r => setTimeout(r, ms));
  async function mk(url, skew, name) {
    const ctx = await browser.newContext({ viewport: { width: 420, height: 900 } });
    await ctx.route('https://script.google.com/**', async r => { await sleep(300 + Math.random() * 600); const body = be.post(r.request().postData() || '{}'); await sleep(300 + Math.random() * 900); r.fulfill({ status: 200, contentType: 'text/plain', headers: { 'access-control-allow-origin': '*' }, body }); });
    const p = await ctx.newPage(); p.nm = name;
    p.on('pageerror', e => errors.push(name + ' PE ' + e.message));
    await p.addInitScript((sk) => { window.__ICTEST = true; if (sk) { const o = Date.now.bind(Date); Date.now = () => o() + sk; } }, skew);
    await p.goto(url); return p;
  }
  const F = 'file:///home/claude/tp/tp.html';
  const specs = [['Ana Sync', 'Derecho', 0], ['Beto Sync', 'Psicología', -40000], ['Cami Sync', 'Derecho', 25000]];
  const students = [];
  for (const [n, c, sk] of specs) { const p = await mk(F, sk, n); await p.waitForSelector('#reg_name'); await p.fill('#reg_name', n); await p.selectOption('#reg_carrera', c); await p.click('#reg_submit'); await p.waitForTimeout(2500); students.push(p); }
  const teacher = await mk(F + '#docente', 0, 'docente');
  await teacher.waitForSelector('#doc_pin'); await teacher.fill('#doc_pin', 'PIN-DE-EJEMPLO'); await teacher.click('#doc_go'); await teacher.waitForSelector('#doc_open');
  async function runRound(round, label) {
    await teacher.selectOption('#doc_round', String(round));
    await teacher.evaluate(() => { const s = document.getElementById('doc_qsec'); if (![...s.options].some(o => o.value === '20')) { const o = document.createElement('option'); o.value = '20'; o.textContent = '20 s'; s.appendChild(o); } s.value = '20'; });
    await teacher.click('#doc_open'); await teacher.waitForTimeout(1500);
    for (const p of students) { await p.click('#btnLive'); }
    await teacher.waitForTimeout(6000);
    await teacher.click('#doc_start');
    const t0 = Date.now();
    const qOf = async p => p.evaluate(() => { const m = document.querySelector('.play-top .mono'); const pr = document.querySelector('.play-top .badge'); return m ? m.textContent + '|' + (pr ? pr.textContent : '') : (document.querySelector('.count-big') ? 'cuenta' : '-'); }).catch(() => '?');
    if (label.includes('práctica')) { for (let k = 0; k < 14; k++) { await sleep(1000); console.log('   t+' + (k + 1) + 's', JSON.stringify(await students[1].evaluate(() => ({st: window.API && window.API.state && window.API.state.status, off: window.API && window.API.offset, hid: document.hidden, route: window.route, txt: document.querySelector('#app').innerText.replace(/\s+/g,' ').slice(200,330), fails: typeof pollFails !== 'undefined' ? pollFails : null, busy: typeof pollBusy !== 'undefined' ? pollBusy : null})))); } }
    // espera a que todos muestren pregunta 1
    const firstSeen = {};
    for (let k = 0; k < 150; k++) { for (const p of students) { if (firstSeen[p.nm]) continue; const q = await qOf(p); if (/Pregunta 1\//.test(q)) firstSeen[p.nm] = Date.now() - t0; } if (Object.keys(firstSeen).length === students.length) break; await sleep(200); }
    console.log(label, 'primera pregunta visible (ms desde "Iniciar"):', JSON.stringify(firstSeen));
    // el docente adelanta 3 veces y medimos cuánto tardan los estudiantes en cambiar
    for (let step = 2; step <= 4; step++) {
      await sleep(4000);
      const tc = Date.now(); await teacher.click('#doc_next:not([disabled])').catch(e => errors.push('next ' + e.message.split('\n')[0]));
      const seen = {};
      for (let k = 0; k < 120; k++) { for (const p of students) { if (seen[p.nm] !== undefined) continue; const q = await qOf(p); if (new RegExp('Pregunta ' + step + '/').test(q)) seen[p.nm] = Date.now() - tc; } if (Object.keys(seen).length === students.length) break; await sleep(150); }
      console.log(label, '→ pregunta', step, 'latencia docente→estudiante (ms):', JSON.stringify(seen));
    }
    return firstSeen;
  }
  await runRound(2, 'RONDA 2 (en vivo)');
  // cerrar y repetir la MISMA ronda: ahora todos ya jugaron → práctica; no debe quedarse en "Prepárate"
  await students[0].waitForTimeout(500);
  await teacher.click('#doc_close'); await teacher.waitForTimeout(1500);
  // los estudiantes no terminaron la ronda: marcamos como jugada para forzar práctica
  for (const p of students) await p.evaluate(() => { const pr = JSON.parse(localStorage.getItem('tp-mission-progress-v1') || '{}'); pr._flash = pr._flash || {}; pr._flash.r2 = pr._flash.r2 || { ch: [0, 0, 0, 0, 0], pts: 10, ok: 1 }; localStorage.setItem('tp-mission-progress-v1', JSON.stringify(pr)); });
  for (const p of students) { await p.reload(); await p.waitForTimeout(1500); }
  const fs2 = await runRound(2, 'RONDA 2 (repetida → práctica)');
  console.log('ERRORES:', errors.length ? '\n' + errors.join('\n') : 'ninguno');
  await browser.close();
})();
