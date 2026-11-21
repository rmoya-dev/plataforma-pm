const { chromium } = require('playwright'); const fs=require('fs'); const { makeBackend } = require('./mock.js');
(async()=>{ const b=await chromium.launch(); const ctx=await b.newContext({viewport:{width:1200,height:900}}); const be=makeBackend('/home/claude/tp/Code.gs');
await ctx.route('https://script.google.com/**', r=>r.fulfill({status:200,contentType:'text/plain',headers:{'access-control-allow-origin':'*'},body:be.post(r.request().postData()||'{}')}));
const p=await ctx.newPage(); await p.addInitScript(()=>{window.__ICTEST=true; localStorage.setItem('tp-mission-student-v1', JSON.stringify({name:'Ana Prueba',carrera:'Psicología',apodo:'Ana'}));});
await p.goto('file:///home/claude/tp/tp.html'); await p.waitForTimeout(1000);
for(const n of [1,2,3,4,5,6]){ await p.click('#btnMap'); await p.waitForTimeout(200); const t=(await p.$$('.node-btn')); const v=[]; for(const x of t) if(await x.isVisible()) v.push(x); await v[n-1].click(); await p.waitForTimeout(700);
 await p.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));
 const r=await p.evaluate(()=>{ const out=[]; const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let n; while(n=w.nextNode()){ if(n.parentElement.closest('.katex,script,style,textarea')) continue; if(/\$[^$]{1,60}\$/.test(n.textContent)) out.push((n.parentElement.className||n.parentElement.tagName)+' :: '+n.textContent.slice(0,100)); } return out.slice(0,8); });
 console.log('fase',n,JSON.stringify(r)); }
await b.close(); })();
