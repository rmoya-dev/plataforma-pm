const { chromium } = require('playwright');
const { makeBackend } = require('./mock.js');
(async () => {
  const be = makeBackend('/home/claude/tp/Code.gs', s => s.replace('Math.max(30, Math.min(300, q))', 'Math.max(3, Math.min(300, q))').replace('FLASH_COUNTDOWN_MS = 12000', 'FLASH_COUNTDOWN_MS = 3000'));
  const browser = await chromium.launch();
  const errors = [];
  async function mk(url, init) {
    const ctx = await browser.newContext({ viewport: { width: 420, height: 900 } });
    await ctx.route('https://script.google.com/**', r => r.fulfill({ status: 200, contentType: 'text/plain', headers: { 'access-control-allow-origin': '*' }, body: be.post(r.request().postData() || '{}') }));
    const p = await ctx.newPage();
    p.on('pageerror', e => errors.push('PAGEERROR ' + e.message));
    p.on('console', m => { if (m.type() === 'error' && !/fonts\.g|net::ERR/.test(m.text())) errors.push('CONSOLE ' + m.text().slice(0, 200)); });
    await p.addInitScript(() => { window.__ICTEST = true; });
    await p.addInitScript({ path: '/home/claude/tp/qa/rawscan.js' }); (global.__pages = global.__pages || []).push(p);
    await p.goto(url); return p;
  }
  const F = 'file:///home/claude/tp/tp.html';
  const students = [];
  for (const [n, c] of [['Lucia Derecho', 'Derecho'], ['Marco Psico', 'Psicología'], ['Rosa Derecho', 'Derecho']]) {
    const p = await mk(F);
    await p.waitForSelector('#reg_name'); await p.fill('#reg_name', n); await p.selectOption('#reg_carrera', c); await p.click('#reg_submit'); await p.waitForTimeout(800);
    students.push(p);
  }
  const teacher = await mk(F + '#docente');
  await teacher.waitForSelector('#doc_pin'); await teacher.fill('#doc_pin', 'PIN-DE-EJEMPLO'); await teacher.click('#doc_go');
  await teacher.waitForSelector('#doc_open'); await teacher.waitForTimeout(500);
  // ronda 4 con 4 s por pregunta
  await teacher.selectOption('#doc_round', '4');
  await teacher.evaluate(() => { const s = document.getElementById('doc_qsec'); const o = document.createElement('option'); o.value = '4'; o.textContent = '4 s'; s.appendChild(o); s.value = '4'; });
  await teacher.click('#doc_open'); await teacher.waitForTimeout(1500);
  for (const p of students) { await p.click('#btnLive'); await p.waitForTimeout(1500); }
  console.log('banner/estado estudiante 1:', (await students[0].textContent('#app')).replace(/\s+/g, ' ').slice(0, 220));
  await teacher.click('#doc_start');
  await teacher.waitForTimeout(4500);
  // cada estudiante responde las 5 preguntas: Lucia y Rosa aciertan, Marco falla en 2
  for (let q = 0; q < 5; q++) {
    for (let si = 0; si < students.length; si++) {
      const p = students[si];
      try {
        await p.waitForSelector('.play-q', { timeout: 6000 });
        const info = await p.evaluate(() => ({ r: document.querySelector('.play-top .badge').textContent, t: document.querySelector('.play-top .mono').textContent }));
        const rIdx = 3, qIdx = parseInt(info.t.match(/(\d+)\//)[1], 10) - 1;
        const c = await p.evaluate(([ri, qi]) => window.__TP.FLASH_ROUNDS[ri].qs[qi].c, [rIdx, qIdx]);
        const want = (si === 1 && (qIdx === 1 || qIdx === 3)) ? (c === 0 ? 1 : 0) : c;
        await p.click('.choice-grid .choice[data-oi="' + want + '"]');
      } catch (e) { errors.push('estudiante ' + si + ' pregunta ' + q + ': ' + String(e.message).split('\n')[0]); }
    }
    await teacher.waitForTimeout(1200);
    if (q < 4) { const nb = await teacher.$('#doc_next:not([disabled])'); if (nb) await nb.click(); await teacher.waitForTimeout(1500); }
  }
  await teacher.waitForTimeout(6000);
  for (const p of students) { await p.waitForTimeout(500); }
  console.log('resultado estudiante 1:', (await students[0].textContent('#app')).replace(/\s+/g, ' ').slice(0, 400));
  console.log('resultado estudiante 2:', (await students[1].textContent('#app')).replace(/\s+/g, ' ').slice(0, 300));
  console.log('docente ranking:', (await teacher.textContent('#doc_rank')).replace(/\s+/g, ' ').slice(0, 500));
  await students[0].screenshot({ path: '/home/claude/tp/qa/shot_live_result.png' });
  // duelo d4 (empate) y d1
  await teacher.selectOption('#du_sel', 'd4'); await teacher.click('#du_vote'); await teacher.waitForTimeout(1200);
  for (let si = 0; si < students.length; si++) { const p = students[si]; await p.click('#btnMap'); let b = null; try { b = await p.waitForSelector('.duel-host [data-v="c"]', { timeout: 25000 }); } catch (e) {} if (b) { await b.click(); } else errors.push('sin botón duelo en estudiante ' + si); }
  await students[0].waitForTimeout(500);
  await students[0].screenshot({ path: '/home/claude/tp/qa/shot_duel_vote.png' });
  await teacher.click('#du_rev'); await students[0].waitForSelector('.duel-result', { timeout: 25000 }).catch(() => errors.push('no llegó el resultado del duelo')); await students[0].waitForTimeout(4000);
  console.log('duelo estudiante 1:', (await students[0].textContent('.duel-host')).replace(/\s+/g, ' ').slice(0, 600));
  await students[0].screenshot({ path: '/home/claude/tp/qa/shot_duel_reveal.png' });
  // ranking con equipos
  await students[0].click('#btnRank'); await students[0].waitForTimeout(2500);
  console.log('ranking:', (await students[0].textContent('#app')).replace(/\s+/g, ' ').slice(0, 500));
  await students[0].screenshot({ path: '/home/claude/tp/qa/shot_rank.png' });
  { const all = new Set(); for (const pg of (global.__pages || [])) { try { (await pg.evaluate(() => window.__RAW || [])).forEach(x => all.add(x)); } catch (e) {} } console.log('LATEX CRUDO:', all.size ? '\n  ' + [...all].slice(0, 25).join('\n  ') : 'ninguno'); }
  console.log('ERRORES:', errors.length ? '\n' + errors.join('\n') : 'ninguno');
  await browser.close();
})();
