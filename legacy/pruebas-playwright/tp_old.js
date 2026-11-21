const { chromium } = require('playwright');
const { makeBackend } = require('./mock.js');
const HTML = '/home/claude/tp/tp.html';
const res = []; const ok = (n, c, x) => res.push((c ? 'OK   ' : 'FALLA') + ' ' + n + (x ? ' :: ' + x : ''));
(async () => {
  const browser = await chromium.launch();
  // Code_ec.gs = script ANTIGUO (no conoce «tiempo»: cae a otra hoja)
  const oldBe = makeBackend('/home/claude/tp/Code_ec.gs');
  const newBe = makeBackend('/home/claude/tp/Code.gs');
  let be = oldBe;
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 } });
  await ctx.route('https://script.google.com/**', r => r.fulfill({ status: 200, contentType: 'text/plain', headers: { 'access-control-allow-origin': '*' }, body: be.post(r.request().postData() || '{}') }));
  await ctx.route('https://cdn.jsdelivr.net/**', async route => { const u = route.request().url(); const f = u.includes('katex.min.css') ? 'katex.css' : u.includes('katex.min.js') ? 'katex.js' : u.includes('jsxgraph') && u.endsWith('.js') ? 'jsx.js' : u.includes('confetti') ? 'confetti.js' : null; if (!f) return route.abort(); route.fulfill({ path: '/home/claude/tp/qa/' + f, contentType: f.endsWith('css') ? 'text/css' : 'application/javascript' }); });
  // el script antiguo ya tiene estudiantes de otra actividad guardados (parabola)
  oldBe.post(JSON.stringify({ action: 'save', nombre: 'Ana Prueba Quispe', carrera: 'Derecho', progreso: { calcula: { c1: true, c2: true }, investiga: { i1: true }, _flash: { r7: { pts: 40, ok: 5, ch: 'x', rt: 1, tm: 1, at: 1 } } } }));
  const sheetsBefore = JSON.stringify(Object.keys(oldBe.sheets).map(k => [k, oldBe.sheets[k].getDataRange().getValues().length]));
  const page = await ctx.newPage(); const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.addInitScript(() => { window.__ICTEST = true; });
  const prog = () => page.evaluate(() => JSON.parse(localStorage.getItem('tp-mission-progress-v1') || '{}'));
  await page.goto('file://' + HTML); await page.waitForSelector('#reg_name');
  await page.fill('#reg_name', 'Ana Prueba Quispe'); await page.selectOption('#reg_carrera', 'Derecho'); await page.click('#reg_submit'); await page.waitForTimeout(2500);
  let p = await prog();
  ok('Script antiguo: NO se trae avance de otra actividad', !p.calcula && !p.investiga, JSON.stringify(Object.keys(p)));
  ok('Script antiguo: avisa que el servidor no está actualizado', /todavía no está actualizado/.test(await page.evaluate(() => (document.getElementById('saveChip') || {}).textContent || '')));
  // resuelve un reto: queda local, no se escribe en la nube
  await page.evaluate(() => { const q = JSON.parse(localStorage.getItem('tp-mission-progress-v1')); q.despeja = { d1: true, d2: true }; localStorage.setItem('tp-mission-progress-v1', JSON.stringify(q)); });
  await page.reload(); await page.waitForTimeout(1500);
  const rowsAfter = JSON.stringify(Object.keys(oldBe.sheets).map(k => [k, oldBe.sheets[k].getDataRange().getValues().length]));
  ok('Script antiguo: no se escribió nada nuevo en sus hojas', sheetsBefore === rowsAfter, sheetsBefore + ' -> ' + rowsAfter);
  // Flor publica el script nuevo: lo local sube solo
  be = newBe;
  await page.evaluate(() => { /* fuerza reintento */ window.dispatchEvent(new Event('online')); });
  await page.waitForTimeout(100);
  // un guardado nuevo: vuelve a verificar (caduca el «old» a los 30 s; se simula con otra pestaña limpia)
  const page2 = await ctx.newPage(); await page2.addInitScript(() => { window.__ICTEST = true; });
  await page2.goto('file://' + HTML); await page2.evaluate(() => localStorage.removeItem('tp-mission-student-v1')); await page2.reload(); await page2.waitForSelector('#reg_name');
  await page2.fill('#reg_name', 'Ana Prueba Quispe'); await page2.selectOption('#reg_carrera', 'Derecho'); await page2.click('#reg_submit'); await page2.waitForTimeout(2500);
  const sh = newBe.sheets['Progreso - Interés tiempo'];
  ok('Script nuevo: verifica y guarda en la hoja «Interés tiempo»', !!sh && sh.getDataRange().getValues().length >= 2);
  ok('Script nuevo: no hay aviso de servidor desactualizado', !/todavía no está actualizado/.test(await page2.evaluate(() => (document.getElementById('saveChip') || {}).textContent || '')));
  // limpieza de avance ajeno ya guardado en el navegador
  await page2.evaluate(() => { localStorage.setItem('tp-mission-progress-v1', JSON.stringify({ calcula: { c1: true, c2: true, k1: true }, investiga: { i1: true }, despeja: { d1: true, x9: true }, _flash: { r7: { pts: 9 }, r2: { pts: 5 } } })); });
  await page2.reload(); await page2.waitForTimeout(800);
  const q = await page2.evaluate(() => JSON.parse(localStorage.getItem('tp-mission-progress-v1')));
  ok('Limpieza local: se descartan fases/retos/rondas ajenos y se conservan los propios', !q.investiga && JSON.stringify(q.calcula) === '{"k1":true}' && JSON.stringify(q.despeja) === '{"d1":true}' && !q._flash.r7 && !!q._flash.r2, JSON.stringify(q));
  ok('Sin errores de JS', errs.length === 0, errs.join('|'));
  console.log(res.join('\n')); await browser.close();
})();
