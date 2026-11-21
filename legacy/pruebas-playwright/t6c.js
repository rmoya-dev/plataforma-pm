const { chromium } = require('playwright'); const { makeBackend } = require('./mock.js');
(async()=>{ const b=await chromium.launch(); const be=makeBackend('/home/claude/tp/Code.gs'); const ctx=await b.newContext({viewport:{width:1200,height:900}});
await ctx.route('https://script.google.com/**', async r=>{ await new Promise(x=>setTimeout(x,5000)); r.fulfill({status:200,contentType:'text/plain',headers:{'access-control-allow-origin':'*'},body:be.post(r.request().postData()||'{}')}); });
const p=await ctx.newPage(); p.on('pageerror',e=>console.log('PE',e.message)); await p.addInitScript(()=>{window.__ICTEST=true;});
const t0=Date.now(); const T=()=>((Date.now()-t0)/1000).toFixed(1);
await p.goto('file:///home/claude/tp/tp.html'); await p.waitForSelector('#reg_name'); await p.fill('#reg_name','Lenta Prueba'); await p.selectOption('#reg_carrera','Derecho'); await p.click('#reg_submit');
await p.waitForTimeout(6500);
await p.click('#btnMap'); await p.waitForTimeout(300); const tiles=await p.$$('.node-btn'); for(const t of tiles){ if(await t.isVisible()){ await t.click(); break; } }
await p.waitForTimeout(1000);
console.log(T(),'choices',(await p.$$('.choice-grid .choice')).length);
const cs=await p.$$('.choice-grid .choice'); await cs[0].click();
await p.waitForTimeout(2500);
for(let k=0;k<4;k++){ const c2=await p.$$('.choice-grid .choice:not([disabled])'); console.log(T(),'avail',c2.length); if(!c2.length) break; const txt=await c2[0].textContent(); await c2[0].click(); await p.waitForTimeout(300); const st=await p.evaluate(()=>({ok:document.querySelectorAll('.choice.correct').length,bad:document.querySelectorAll('.choice.wrong, .choice.incorrect').length, fb:(document.querySelector('.feedback, .fb')||{}).textContent})); console.log(T(),'clicked',txt.slice(0,30),JSON.stringify(st)); await p.waitForTimeout(1500); }
await b.close(); })();