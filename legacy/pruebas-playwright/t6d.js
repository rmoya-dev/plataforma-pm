const { chromium } = require('playwright'); const { makeBackend } = require('./mock.js');
(async()=>{ const b=await chromium.launch(); const be=makeBackend('/home/claude/tp/Code.gs'); const ctx=await b.newContext({viewport:{width:1200,height:900}});
const DELAY=+process.env.DELAY||5000;
await ctx.route('https://script.google.com/**', async r=>{ await new Promise(x=>setTimeout(x,DELAY)); r.fulfill({status:200,contentType:'text/plain',headers:{'access-control-allow-origin':'*'},body:be.post(r.request().postData()||'{}')}); });
const p=await ctx.newPage(); p.on('pageerror',e=>console.log('PE',e.message)); await p.addInitScript(()=>{window.__ICTEST=true;});
const t0=Date.now(); const T=()=>((Date.now()-t0)/1000).toFixed(1);
await p.goto('file:///home/claude/tp/tp.html'); await p.waitForSelector('#reg_name'); await p.fill('#reg_name','Lenta Prueba'); await p.selectOption('#reg_carrera','Derecho'); await p.click('#reg_submit'); await p.waitForTimeout(800);
await p.click('#btnMap'); await p.waitForTimeout(300); for(const t of await p.$$('.node-btn')){ if(await t.isVisible()){ await t.click(); break; } } await p.waitForTimeout(800);
const prog=()=>p.evaluate(()=>{const o=JSON.parse(localStorage.getItem('tp-mission-progress-v1')||'{}'); return Object.keys(o.despeja||{}).length;});
for(let it=0; it<12; it++){
  const cs=await p.$$('.choice-grid .choice:not([disabled])'); const inp=await p.$('input[data-expect]:not([disabled])');
  console.log(T(),'it',it,'choices',cs.length,'input',!!inp,'prog',await prog());
  if(inp){ await inp.fill(String(Number(await inp.getAttribute('data-expect')))); const row=await inp.evaluateHandle(e=>e.closest('.num-row')); await (await row.asElement().$('button.primary')).click(); await p.waitForTimeout(1200); continue; }
  let solved=false; for(let i=0;i<cs.length&&!solved;i++){ const c2=await p.$$('.choice-grid .choice:not([disabled])'); if(!c2[i]) break; await c2[i].click(); await p.waitForTimeout(200); solved=!!(await p.$('.choice-grid .choice.correct')); console.log('   click',i,'correct?',solved); if(!solved) await p.waitForTimeout(1200); }
  await p.waitForTimeout(1200);
}
await b.close(); })();
