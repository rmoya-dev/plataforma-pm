const { chromium } = require('playwright');
const { makeBackend } = require('./mock.js');
const HTML = '/home/claude/tp/tp.html';
const res = []; const ok = (n, c, x) => res.push((c ? 'OK   ' : 'FALLA') + ' ' + n + (x ? ' :: ' + x : ''));
(async () => {
  const browser = await chromium.launch();
  const be = makeBackend('/home/claude/tp/Code.gs');
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 } });
  await ctx.route('https://script.google.com/**', r => r.fulfill({ status: 200, contentType: 'text/plain', headers: { 'access-control-allow-origin': '*' }, body: be.post(r.request().postData() || '{}') }));
  await ctx.route('https://cdn.jsdelivr.net/**', async route => { const u = route.request().url(); const f = u.includes('katex.min.css') ? 'katex.css' : u.includes('katex.min.js') ? 'katex.js' : u.includes('jsxgraph') && u.endsWith('.js') ? 'jsx.js' : u.includes('confetti') ? 'confetti.js' : null; if (!f) return route.abort(); route.fulfill({ path: '/home/claude/tp/qa/' + f, contentType: f.endsWith('css') ? 'text/css' : 'application/javascript' }); });
  const page = await ctx.newPage(); const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.addInitScript(() => { window.__ICTEST = true; });
  const prog = () => page.evaluate(() => JSON.parse(localStorage.getItem('tp-mission-progress-v1') || '{}'));
  const cnt = p => Object.entries(p).filter(([k]) => k[0] !== '_').reduce((a, [, v]) => a + Object.keys(v).length, 0);
  async function reg(name, car, apodo) {
    await page.waitForSelector('#reg_name');
    await page.fill('#reg_name', name); await page.selectOption('#reg_carrera', car); if (apodo !== undefined) await page.fill('#reg_apodo', apodo);
    await page.click('#reg_submit'); await page.waitForTimeout(1200);
  }
  // A se registra y resuelve retos (se siembra progreso en la sala de A como lo haría el juego)
  await page.goto('file://' + HTML);
  await reg('Ana Prueba Quispe', 'Derecho');
  await page.evaluate(() => { const p = JSON.parse(localStorage.getItem('tp-mission-progress-v1')); p.despeja = { d1: true, d2: true, d3: true, d4: true, d5: true, d6: true }; p.formula = { f1: true }; localStorage.setItem('tp-mission-progress-v1', JSON.stringify(p)); localStorage.setItem('tp-mission-completed-v1', '2026-01-01'); });
  await page.reload(); await page.waitForTimeout(800);
  be.post(JSON.stringify({action:'save',actividad:'tiempo',nombre:'Ana Prueba Quispe',carrera:'Derecho',progreso:await prog()}));
  ok('A: tiene su avance local', cnt(await prog()) === 7, String(cnt(await prog())));
  // 1) Se cambia a otra persona en el mismo dispositivo (editar -> otro nombre)
  await page.click('#editStudentBtn'); await reg('Beto Segundo Rojas', 'Psicología');
  let p = await prog();
  ok('B: no hereda el avance de A', cnt(p) === 0, JSON.stringify(Object.keys(p)));
  ok('B: no hereda la constancia de A', await page.evaluate(() => !localStorage.getItem('tp-mission-completed-v1')));
  // lo que quedó en la hoja: A conserva lo suyo y B no tiene nada de A
  await page.waitForTimeout(800);
  const rowsA = be.dump ? be.dump() : null;
  // 2) Cambia solo el apodo: conserva avance
  await page.evaluate(() => { const p = JSON.parse(localStorage.getItem('tp-mission-progress-v1')); p.despeja = { d1: true }; localStorage.setItem('tp-mission-progress-v1', JSON.stringify(p)); });
  await page.reload(); await page.waitForTimeout(800);
  await page.click('#editStudentBtn'); await reg('Beto Segundo Rojas', 'Psicología', 'Betito');
  ok('B cambia solo apodo: conserva avance', cnt(await prog()) === 1, String(cnt(await prog())));
  // 3) Vuelve A: recupera lo suyo desde la nube y nada de B
  await page.click('#editStudentBtn'); await reg('Ana Prueba Quispe', 'Derecho');
  await page.waitForTimeout(1200);
  p = await prog();
  ok('A vuelve: se restaura solo lo de A desde la nube', !!p.despeja && Object.keys(p.despeja).length === 6 && !!p.formula && Object.keys(p.formula).length === 1, JSON.stringify(p.despeja && Object.keys(p.despeja)));
  // 4) Dispositivo con avance pero sin registro y sin dueño (herencia vieja): el nuevo estudiante empieza limpio
  await page.evaluate(() => { localStorage.removeItem('tp-mission-student-v1'); localStorage.removeItem('tp-mission-owner-v1'); });
  await page.reload(); await page.waitForTimeout(600);
  await reg('Carla Nueva Diaz', 'Derecho');
  ok('C (sin dueño previo): empieza limpia', cnt(await prog()) === 0, String(cnt(await prog())));
  // 5) Nombre de una sola palabra se rechaza
  await page.click('#editStudentBtn'); await page.fill('#reg_name', 'Carla'); await page.click('#reg_submit'); await page.waitForTimeout(300);
  ok('Nombre de una palabra: mensaje de error', await page.isVisible('#reg_error') && /apellido/.test(await page.textContent('#reg_error')));
  ok('Sin errores de JS', errs.length === 0, errs.join(' | '));
  console.log(res.join('\n')); await browser.close();
})();
