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
for(let i=0;i<14;i++){ await p.waitForTimeout(1000); const st=await p.evaluate(()=>({choices:document.querySelectorAll('.choice-grid .choice:not([disabled])').length, cards:document.querySelectorAll('.mission-card').length, ok:document.querySelectorAll('.choice.correct').length, inputs:document.querySelectorAll('input[data-expect]:not([disabled])').length, prog:localStorage.getItem('tp-mission-progress-v1')&&Object.keys(JSON.parse(localStorage.getItem('tp-mission-progress-v1')).despeja||{}).length})); console.log(T(),JSON.stringify(st)); }
await b.close(); })();
