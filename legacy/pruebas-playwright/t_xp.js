const { chromium } = require('playwright');
(async()=>{ const b=await chromium.launch(); const ctx=await b.newContext({viewport:{width:900,height:900}}); const p=await ctx.newPage();
await p.addInitScript(()=>{window.__ICTEST=true; localStorage.setItem('tp-mission-student-v1', JSON.stringify({name:'Ana',carrera:'Derecho',apodo:'Ana'})); localStorage.setItem('tp-mission-progress-v1', JSON.stringify({despeja:{d1:1,d2:1,d3:1,d4:1,d5:1,d6:1},formula:{f1:1,f2:1,f3:1}}));});
await p.route('https://**',r=>r.abort()); await p.goto('file:///home/claude/tp/tp.html'); await p.waitForTimeout(1500);
console.log(await p.evaluate(()=>{ const out=[]; document.querySelectorAll('[class*=xp]').forEach(e=>{ const cs=getComputedStyle(e); out.push(e.className+' w='+Math.round(e.getBoundingClientRect().width)+' bg='+cs.backgroundColor+' style='+(e.getAttribute('style')||'')); }); return out.join('\n'); }));
await p.screenshot({path:'t_xp.png',clip:{x:0,y:250,width:900,height:150}}); await b.close(); })();
