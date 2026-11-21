// Ejecuta el Code.gs REAL con una hoja de cálculo simulada en memoria.
const vm = require('vm'), fs = require('fs');
function makeBackend(codePath, patch){
  let src = fs.readFileSync(codePath, 'utf8');
  if(patch) src = patch(src);
  const sheets = {};
  function mkSheet(name){
    const rows = [];
    return {
      _rows: rows, name,
      getLastRow(){ return rows.length; },
      getDataRange(){ return { getValues(){ return rows.map(r => r.slice()); } }; },
      appendRow(r){ rows.push(r.slice()); },
      setFrozenRows(){},
      getRange(r, c, nr, nc){
        return {
          getValue(){ return (rows[r-1] || [])[c-1]; },
          getValues(){ const out=[]; for(let i=0;i<(nr||1);i++){ const row=rows[r-1+i]||[]; const o=[]; for(let j=0;j<(nc||1);j++) o.push(row[c-1+j] === undefined ? "" : row[c-1+j]); out.push(o);} return out; },
          setValues(v){ for(let i=0;i<v.length;i++){ if(!rows[r-1+i]) rows[r-1+i]=[]; for(let j=0;j<v[i].length;j++) rows[r-1+i][c-1+j]=v[i][j]; } },
          setValue(v){ if(!rows[r-1]) rows[r-1]=[]; rows[r-1][c-1]=v; }
        };
      }
    };
  }
  const cacheMap = new Map(), props = {};
  const ctx = {
    console, Logger: { log(m){ (ctx.__log = ctx.__log || []).push(m); } },
    SpreadsheetApp: { getActiveSpreadsheet(){ return { getSheetByName(n){ return sheets[n] || null; }, insertSheet(n){ return sheets[n] = mkSheet(n); } }; } },
    CacheService: { getScriptCache(){ return {
      get(k){ const e = cacheMap.get(k); if(!e) return null; if(e.exp < Date.now()){ cacheMap.delete(k); return null; } return e.v; },
      put(k, v, ttl){ cacheMap.set(k, { v: String(v), exp: Date.now() + (ttl || 600) * 1000 }); },
      getAll(ks){ const o={}; ks.forEach(k=>{ const e = cacheMap.get(k); if(e && e.exp >= Date.now()) o[k]=e.v; }); return o; } }; } },
    PropertiesService: { getScriptProperties(){ return { getProperty(k){ return props[k] === undefined ? null : props[k]; }, setProperty(k,v){ props[k]=v; } }; } },
    LockService: { getScriptLock(){ return { tryLock(){ return true; }, releaseLock(){} }; } },
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput(t){ return { _t: t, setMimeType(){ return this; }, getContent(){ return t; } }; } },
    Utilities: { sleep(){} }
  };
  vm.createContext(ctx);
  vm.runInContext(src, ctx);
  return {
    sheets, ctx,
    post(bodyStr){
      const out = ctx.doPost({ postData: { contents: bodyStr }, parameter: {} });
      return out.getContent ? out.getContent() : out._t;
    }
  };
}
module.exports = { makeBackend };
