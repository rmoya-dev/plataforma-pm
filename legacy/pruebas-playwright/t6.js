const { chromium } = require('playwright'); const { makeBackend } = require('./mock.js');
(async()=>{ const b=await chromium.launch(); const be=makeBackend('/home/claude/tp/Code.gs'); const ctx=await b.newContext({viewport:{width:1200,height:900}});
await ctx.route('https://script.google.com/**', async r=>{ await new Promise(x=>setTimeout(x,5000)); r.fulfill({status:200,contentType:'text/plain',headers:{'access-control-allow-origin':'*'},body:be.post(r.request().postData()||'{}')}); });
const p=await ctx.newPage(); p.on('pageerror',e=>console.log('PE',e.message)); await p.addInitScript(()=>{window.__ICTEST=true;});
const t0=Date.now(); const T=()=>((Date.now()-t0)/1000).toFixed(1);
await p.goto('file:///home/claude/tp/tp.html'); await p.waitForSelector('#reg_name'); await p.fill('#reg_name','Lenta Prueba'); await p.selectOption('#reg_carrera','Derecho'); await p.click('#reg_submit');
for(let i=0;i<10;i++){ await p.waitForTimeout(1000); console.log(T(), 'btnMap visible', await p.isVisible('#btnMap').catch(()=>'x'), 'reg visible', await p.isVisible('#reg_name').catch(()=>'x')); }
await b.close(); })();
