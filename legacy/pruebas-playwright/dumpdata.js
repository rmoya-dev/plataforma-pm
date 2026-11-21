const { chromium } = require('playwright'); const fs=require('fs');
(async()=>{ const b=await chromium.launch(); const p=await (await b.newContext()).newPage(); await p.addInitScript(()=>{window.__ICTEST=true;});
await p.route('https://**', r=>r.abort());
await p.goto('file:///home/claude/tp/tp.html'); await p.waitForTimeout(800);
const data=await p.evaluate(()=>{ const T=window.__TP; const out={}; for(const k of ['DESPEJA','FORMULA','CALCULA','DUPLICA','META','DICTAMEN']){ out[k]=(T[k]||[]).map(m=>{ const o={}; for(const f in m){ const v=m[f]; o[f]= typeof v==='function' ? '[fn]' : v; } return o; }); }
 out.FLASH=T.FLASH_ROUNDS; out.QDAY=T.QDAY; out.THEORY=T.THEORY; out.SERIES=T.SERIES; out.REFLECT=T.REFLECT; out.GLOSS=T.GLOSSARY; out.DUELS=T.DUELS; return out; });
fs.writeFileSync('data.json', JSON.stringify(data,null,1)); console.log(Object.keys(data).map(k=>k+':'+(Array.isArray(data[k])?data[k].length:typeof data[k])).join(' ')); await b.close(); })();
