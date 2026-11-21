const { chromium } = require('playwright');
const { makeBackend } = require('./mock.js');
(async()=>{
  const be = makeBackend('/home/claude/tp/Code.gs');
  const b = await chromium.launch(); const ctx = await b.newContext({viewport:{width:1200,height:900}});
  await ctx.route('https://script.google.com/**', r => r.fulfill({status:200,contentType:'text/plain',headers:{'access-control-allow-origin':'*'},body:be.post(r.request().postData()||'{}')}));
  const p = await ctx.newPage(); p.on('pageerror',e=>console.log('PE',e.message)); p.on('console',m=>{ if(m.type()==='error') console.log('CE',m.text().slice(0,200)); });
  await p.goto('file:///home/claude/tp/tp.html'); await p.waitForSelector('#reg_name');
  await p.fill('#reg_name','Ana'); await p.click('#reg_submit'); await p.waitForTimeout(1000);
  console.log(await p.evaluate(()=>Array.from(document.querySelectorAll('.node-btn,.phase-tile')).map(n=>n.className+'|'+n.disabled+'|'+(n.offsetParent!==null)).join('\n')));
  await p.screenshot({path:'dbg.png'});
  await b.close();
})();
