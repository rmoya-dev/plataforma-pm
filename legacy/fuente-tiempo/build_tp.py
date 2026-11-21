import re, sys, io
P='/home/claude/tp/'
app=open(P+'app_ec.js',encoding='utf8').read()
def rd(n): return open(P+'parts/'+n,encoding='utf8').read()
def between(s, a, b, include_a=True, include_b=False):
    i=s.index(a); j=s.index(b,i+len(a))
    return i, j
def rep(s, a, b, new, keep_b=True):
    i=s.index(a); j=s.index(b,i+len(a))
    return s[:i]+new+(s[j:] if keep_b else s[j+len(b):])
def sub1(s, old, new):
    assert s.count(old)==1, (s.count(old), old[:70])
    return s.replace(old,new)

# 1 icons
icons='''var PHASE_ICONS = {
  1: '<svg viewBox="0 0 32 32"><circle cx="11" cy="16" r="5"/><path d="M16 16h12M23 16v5M27 16v4"/></svg>',
  2: '<svg viewBox="0 0 32 32"><rect x="5" y="6" width="22" height="20" rx="3"/><path d="M10 16h8c0-3-2-5-4-5s-4 2-4 5 2 5 4 5c1.5 0 2.7-.6 3.5-1.6"/><path d="M21 12v-2M21 10h3"/></svg>',
  3: '<svg viewBox="0 0 32 32"><rect x="7" y="4" width="18" height="24" rx="3"/><rect x="10" y="7.5" width="12" height="5" rx="1"/><circle cx="12" cy="17" r="1.2" fill="currentColor" stroke="none"/><circle cx="16" cy="17" r="1.2" fill="currentColor" stroke="none"/><circle cx="20" cy="17" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="22" r="1.2" fill="currentColor" stroke="none"/><circle cx="16" cy="22" r="1.2" fill="currentColor" stroke="none"/><circle cx="20" cy="22" r="1.2" fill="currentColor" stroke="none"/></svg>',
  4: '<svg viewBox="0 0 32 32"><circle cx="12" cy="16" r="7"/><circle cx="20" cy="16" r="7"/></svg>',
  5: '<svg viewBox="0 0 32 32"><path d="M8 28V5"/><path d="M8 6h16l-4 5 4 5H8"/></svg>',
  6: '<svg viewBox="0 0 32 32"><path d="M9 4h10l6 6v18H9z"/><path d="M19 4v6h6"/><path d="M13 16h8M13 20h8"/><circle cx="21" cy="25" r="3.5" fill="currentColor" stroke="none"/></svg>'
};
'''
app=rep(app,"var PHASE_ICONS = {","var ICON_BOSS",icons)

# 2 phases
phases='''var PHASES = [
  {id:1, key:"despeja",  label:"Despeja",   sub:"Baja el exponente"},
  {id:2, key:"formula",  label:"Fórmula",   sub:"t = ln(A/P) / ln(1+i)"},
  {id:3, key:"calcula",  label:"Calcula",   sub:"Ejemplos 1 al 5"},
  {id:4, key:"duplica",  label:"Duplica",   sub:"Duplicar y triplicar"},
  {id:5, key:"meta",     label:"Meta",      sub:"¿Cuánto falta?"},
  {id:6, key:"dictamen", label:"Dictamen",  sub:"El informe final"}
];
'''
app=rep(app,"var PHASES = [","var STORAGE_KEY",phases)
app=sub1(app,"var MISSION_TOTALS = {techo:6, formula:6, calcula:6, valor:6, decide:5, dictamen:4};","var MISSION_TOTALS = {despeja:6, formula:6, calcula:6, duplica:6, meta:5, dictamen:4};")
app=sub1(app,'{min:480, name:"Maestro del Techo"}','{min:480, name:"Maestro del Tiempo"}')
# storage keys
app=app.replace('"ec-','"tp-')
app=sub1(app,'var ACTIVITY_ID = "continuo";','var ACTIVITY_ID = "tiempo";')

# 7 theory + series
app=rep(app,"var THEORY = {","function seriesKey(){",rd('theory.js')+"\n")
# 8 guided
i=app.index("    if(num === 3){\n      var body3")
j=app.index("  }\n}\n\nfunction phaseExtras(")
app=app[:i]+rd('guided.js')+app[j:]
# 9 extras
ex=rd('extras.js')
refl=ex[:ex.index("var GLOSSARY")]
glos=ex[ex.index("var GLOSSARY"):]
app=rep(app,"var REFLECT_PROMPTS = {","function reflectCard",refl)
app=rep(app,"var GLOSSARY = [","function glossaryBlock",glos)

# 11 phases region
old_pills=app[app.index("/* ---- Navegación por pastillas"):app.index("/* ---- Detector de ofertas exageradas")]
old_dict=app[app.index("/* Tarjeta «Dictamen del profesional»"):app.index("function renderPhase6")]
old_dict=old_dict.replace("Pensamiento Matemático · Interés compuesto continuo","Pensamiento Matemático · Cálculo del periodo de tiempo")
new_region=(rd('phases123.js')+"\n"+old_pills+"\n"+rd('phases456.js')+"\n"+old_dict+rd('phase6fn.js')+"\n")
i=app.index("/* ============================================================\n   Utilidades comunes de la actividad")
j=app.index("/* ============================================================\n   RESUMEN FINAL Y CONSTANCIA")
app=app[:i]+new_region+app[j:]

# 12 summary / map text
app=sub1(app,'"Completaste las seis fases de “Interés Compuesto Continuo: Descubre el techo, calcula y decide”, incluido el dictamen del Fondo de la Defensoría. Aquí tienes tu resumen, tus insignias y tu constancia de finalización."',
 '"Completaste las seis fases de “Interés Compuesto: Cálculo del periodo de tiempo”, incluido el dictamen del Fondo de la Defensoría. Aquí tienes tu resumen, tus insignias y tu constancia de finalización."')
app=sub1(app,"Misión: Interés Compuesto Continuo","Misión: Cálculo del periodo de tiempo")
app=sub1(app,"— Techo, Fórmula, Calcula, Retrocede, Decide y Dictamen — resolviendo '+total+' retos sobre capitalización continua, la fórmula M = C·e^(rt), cálculo de montos e intereses, valor presente, comparación de ofertas financieras y detección de promesas exageradas, aplicados a casos de Derecho y Psicología, incluido el dictamen final.",
 "— Despeja, Fórmula, Calcula, Duplica, Meta y Dictamen — resolviendo '+total+' retos sobre el cálculo del periodo de tiempo del interés compuesto, el despeje con logaritmos, la fórmula del tiempo, duplicar y triplicar una inversión, metas financieras y detección de promesas imposibles, aplicados a casos de Derecho y Psicología, incluido el dictamen final.")
app=sub1(app,"<h1>Interés Compuesto Continuo</h1>","<h1>Interés Compuesto: Cálculo del Periodo de Tiempo</h1>")
i=app.index("'<p class=\"lead\">Seis fases para entender qué pasa cuando")
j=app.index("'</div>' +",i)
app=app[:i]+"'<p class=\"lead\">Seis fases para responder una pregunta que todos nos hacemos: <strong>¿cuánto tiempo tarda mi dinero en llegar a mi meta?</strong> Baja el exponente con logaritmos, arma t = ln(A/P) / ln(1+i), calcula, duplica y triplica, alcanza metas (¡con una línea de vida!) y cierra con un dictamen. Casos de Derecho y Psicología, duelos «¿Quién llega primero?» con voto de la clase, duelo por equipos y retos relámpago con ranking.</p>' +\n    "+app[j:]
app=sub1(app,'<div class="hero-art"><svg viewBox="0 0 120 120"><path d="M4 100h112M12 8v104" opacity=".45"/><path d="M12 98C48 97 78 88 96 24" stroke-width="2.4"/><circle cx="96" cy="24" r="3.4" fill="currentColor" stroke="none"/><path d="M12 98H112" stroke-dasharray="3 5" opacity=".6"/></svg></div>',
 '<div class="hero-art"><svg viewBox="0 0 120 120"><path d="M34 14h52M34 106h52"/><path d="M40 14c0 28 20 32 20 46s-20 18-20 46M80 14c0 28-20 32-20 46s20 18 20 46" opacity=".8"/><path d="M48 96c6-6 18-6 24 0" stroke-width="2.4"/></svg></div>')
app=sub1(app,"Ya resolviste las siete fases.","Ya resolviste las seis fases.")

app=app.replace("duelo de bancos con voto de toda la clase","duelo «¿Quién llega primero?» con voto de toda la clase")
app=sub1(app,"  var r = Math.round(n * Math.pow(10,d)) / Math.pow(10,d);\n  if(Number.isInteger(r)) return String(r);\n  return String(r);","  var r = Math.round(n * Math.pow(10,d)) / Math.pow(10,d);\n  if(d === 2) return r.toFixed(2);\n  return String(r);")
assert app.count("'<div class=\"gl-item\"><strong>' + g.t + '</strong>")==1
app=app.replace("'<div class=\"gl-item\"><strong>' + g.t + '</strong>","'<div class=\"gl-item\"><strong>' + rich(g.t) + '</strong>")

# --- robustez: tiempo límite en las peticiones a la nube (una petición colgada no debe bloquear la cola de guardado)
_helper = """function fetchText(payload, ms){
  return new Promise(function(resolve, reject){
    var done = false, c = null;
    try{ c = (typeof AbortController !== "undefined") ? new AbortController() : null; }catch(e){ c = null; }
    var t = setTimeout(function(){ if(done) return; done = true; try{ if(c) c.abort(); }catch(e){} reject(new Error("timeout")); }, ms);
    var o = {method: "POST", headers: {"Content-Type": "text/plain;charset=utf-8"}, body: payload};
    if(c) o.signal = c.signal;
    fetch(SHEET_API_URL, o).then(function(r){ return r.text(); }).then(function(tx){ if(done) return; done = true; clearTimeout(t); resolve(tx); }).catch(function(e){ if(done) return; done = true; clearTimeout(t); reject(e); });
  });
}
"""
_a = 'function syncSaveToSheet(cb){'
assert app.count(_a) == 1
app = app.replace(_a, _helper + _a)
_old = """    fetch(SHEET_API_URL, {
      method: "POST",
      headers: {"Content-Type": "text/plain;charset=utf-8"},
      body: JSON.stringify({
        action: "save","""
assert app.count(_old) == 1
app = app.replace(_old, """    fetchText(JSON.stringify({
        action: "save",""")
_old2 = """        completadoEn: getCompletedAt() || ""
      })
    }).then(function(r){ return r.text(); }).then(function(t){"""
assert app.count(_old2) == 1
app = app.replace(_old2, """        completadoEn: getCompletedAt() || ""
      }), 30000).then(function(t){""")
_old3 = """    fetch(SHEET_API_URL, {method: "POST", headers: {"Content-Type": "text/plain;charset=utf-8"}, body: JSON.stringify(payload)})
      .then(function(r){ return r.text(); })"""
assert app.count(_old3) == 1
app = app.replace(_old3, """    fetchText(JSON.stringify(payload), 20000)""")

_o = """      syncSaveToSheet();
      goTo("map");
      pollOnce();"""
assert app.count(_o) == 1
app = app.replace(_o, """      syncSaveToSheet();
      if(route === "register") goTo("map"); else render();
      pollOnce();""")

# --- sala en vivo: sincronía entre docente y estudiantes
# 1) la práctica (segunda vez en la misma ronda) usa SIEMPRE el reloj del propio dispositivo
_o = "  if(!practice && flashPlayed(round)) practice = true;\n  qsec = qsec || DEFAULT_QSEC;"
assert app.count(_o) == 1
app = app.replace(_o, "  if(!practice && flashPlayed(round)){ practice = true; startAt = Date.now() + 1200; }   // práctica: reloj propio, no el de la sala\n  qsec = qsec || DEFAULT_QSEC;")
# 2) el desfase de reloj se calcula con la consulta más rápida de los últimos 2 minutos (menos error que la última)
_o = "        if(d && d.serverNow){ API.offset = d.serverNow - Math.round((t0 + t1) / 2); }"
assert app.count(_o) == 1
app = app.replace(_o, "        if(d && d.serverNow){ updateClockOffset(d.serverNow, t0, t1); }")
_o = "function serverNow(){ return Date.now() + API.offset; }"
assert app.count(_o) == 1
app = app.replace(_o, """var OFF_SAMPLES = [];
function updateClockOffset(sn, t0, t1){
  var rtt = Math.max(0, t1 - t0), off = sn - Math.round((t0 + t1) / 2);
  OFF_SAMPLES.push({off: off, rtt: rtt, at: t1});
  OFF_SAMPLES = OFF_SAMPLES.filter(function(x){ return t1 - x.at < 120000; }).slice(-12);
  var best = OFF_SAMPLES[0];
  OFF_SAMPLES.forEach(function(x){ if(x.rtt < best.rtt) best = x; });
  API.offset = best.off;
}
function serverNow(){ return Date.now() + API.offset; }""")
# 3) durante la ronda se consulta más seguido para que «Siguiente pregunta» llegue pronto
_o = "  if(route === \"live\") base = (LIVE && LIVE.playing && !LIVE.practice) ? 5000 : 4000;"
assert app.count(_o) == 1
app = app.replace(_o, "  var inRound = route === \"live\" && LIVE && LIVE.playing && !LIVE.practice;\n  if(route === \"live\") base = inRound ? 2500 : 4000;")
_o = "  var d = base * Math.pow(2, Math.min(pollFails, 4));"
assert app.count(_o) == 1
app = app.replace(_o, "  var d = base * Math.pow(2, Math.min(pollFails, inRound ? 1 : 4));   // en plena ronda el castigo por error es corto: no hay que perder el cambio de pregunta")
_o = 'document.addEventListener("visibilitychange", function(){ if(!document.hidden) saveRetryNow(); });'
assert app.count(_o) == 1
app = app.replace(_o, _o + '\ndocument.addEventListener("visibilitychange", function(){ if(!document.hidden && typeof pollSoon === "function" && route === "live") pollSoon(); });')
# 4) aviso al docente
_o = "En la última pregunta termina la ronda.</p>' +"
assert app.count(_o) == 1
app = app.replace(_o, "En la última pregunta termina la ronda. Los estudiantes ven el cambio en unos 2 a 4 segundos (su pantalla consulta a la sala cada pocos segundos).</p>' +")

# --- sala: quien ya jugó la ronda ve un botón de práctica (en vez de una pantalla muda) y una nota clara en práctica
_o = """      c4.innerHTML = '<h3>Ronda en curso</h3><p>Ya jugaste esta ronda. Espera a que termine para ver el ranking de la clase.</p>';
      liveHost.appendChild(c4);"""
assert app.count(_o) == 1
app = app.replace(_o, """      c4.innerHTML = '<h3>Ronda en curso</h3><p>Ya jugaste esta ronda en vivo, así que esta vez no suma XP. Puedes esperar a que termine para ver el ranking de la clase o practicarla ahora por tu cuenta (sin XP, a tu ritmo).</p>';
      var pbtn = el("button", "btn primary sm", "Practicar esta ronda ahora"); pbtn.type = "button";
      pbtn.addEventListener("click", function(){ beginPlay(st.round, Date.now() + 1200, true, qsecOf(st)); });
      c4.appendChild(pbtn);
      liveHost.appendChild(c4);""")
_o = """    wrapEl.appendChild(el("p", "progress-note", "Tómate tu tiempo: lee, analiza y responde cuando estés seguro/a."));"""
assert app.count(_o) == 1
app = app.replace(_o, _o + """
    if(practice) wrapEl.appendChild(el("p", "progress-note", "🧪 Modo práctica: no suma XP ni aparece en el ranking, y avanza con tu propio reloj."));""")

# --- avance ligado a la persona: el avance local ya no se hereda de otra persona que usó el mismo navegador/dispositivo
_o = 'var student = loadStudent();'
assert app.count(_o) == 1
app = app.replace(_o, _o + """
/* ---- Dueño del avance guardado en este dispositivo ---- */
var OWNER_KEY = "tp-mission-owner-v1";
function idKeyOf(name, carrera){ return String(name || "").trim().toLowerCase() + "|" + String(carrera || "").trim().toLowerCase(); }
function progressHasData(){
  for(var k in progress){ if(k.charAt(0) !== "_" || k === "_flash" || k === "_reflex" || k === "_ach" || k === "_racha" || k === "_pregunta" || k === "_av") return true; }
  return false;
}
function progressOwner(){
  var o = null; try{ o = localStorage.getItem(OWNER_KEY); }catch(e){}
  if(o) return o;
  return student ? idKeyOf(student.name, student.carrera) : "";
}
function setProgressOwner(k){ try{ localStorage.setItem(OWNER_KEY, k); }catch(e){} }
function resetLocalProgress(){
  progress = {};
  try{ localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(COMPLETED_KEY); localStorage.removeItem(RUN_KEY); localStorage.removeItem(SAVE_PENDING_KEY); }catch(e){}
  try{ SAVE_Q.pending = false; if(SAVE_Q.timer){ clearTimeout(SAVE_Q.timer); SAVE_Q.timer = null; } }catch(e){}
}
""")
_o = """    if(!apodo) apodo = firstNameOf(name);
    student = {name:name, carrera:carrera, apodo:apodo};"""
assert app.count(_o) == 1
app = app.replace(_o, """    if(name.split(/\\s+/).length < 2){
      errEl.style.display = "block";
      errEl.textContent = "Escribe tu nombre y al menos un apellido, para que tu avance no se mezcle con el de otra persona.";
      return;
    }
    if(!apodo) apodo = firstNameOf(name);
    var newId = idKeyOf(name, carrera);
    if(progressOwner() !== newId && (progressHasData() || localStorage_has(COMPLETED_KEY))) resetLocalProgress();
    setProgressOwner(newId);
    student = {name:name, carrera:carrera, apodo:apodo};""")
app = app.replace("function progressHasData(){", "function localStorage_has(k){ try{ return !!localStorage.getItem(k); }catch(e){ return false; } }\nfunction progressHasData(){",1)
_o = """'<p class="progress-note" style="margin:6px 0 0;">Tus compañeros solo verán este apodo (nunca tu nombre completo). Si lo dejas vacío usaremos tu primer nombre.</p>'+"""
assert app.count(_o) == 1
app = app.replace(_o, _o + """
    (isEdit ? '<p class="progress-note" style="margin:10px 0 0;">⚠️ Si cambias el <strong>nombre</strong> o la <strong>carrera</strong>, entrarás como otra persona: verás el avance guardado a ese nombre (o empezarás de cero), no el de este dispositivo. Para corregir solo el apodo, deja nombre y carrera como están.</p>' : '')+""")


# --- blindaje contra un Code.gs desactualizado (cae a otra actividad) y contra avance ajeno
_o = "function loadProgress(){\n  try{\n    var raw = localStorage.getItem(STORAGE_KEY);\n    if(raw) return JSON.parse(raw);"
assert app.count(_o) == 1
app = app.replace(_o, """/* Solo se aceptan retos que existen en ESTA actividad (d1-d6, f1-f6, k1-k6, u1-u6, m1-m5, j1-j4). Todo lo demás
   (fases o retos de otra actividad que llegaron por error de la nube) se descarta. */
function sanitizeProgress(p){
  var T = {despeja: ["d", 6], formula: ["f", 6], calcula: ["k", 6], duplica: ["u", 6], meta: ["m", 5], dictamen: ["j", 4]};
  var changed = false;
  if(!p || typeof p !== "object") return p;
  Object.keys(p).forEach(function(k){
    if(k.charAt(0) === "_"){
      if(k === "_flash" && p._flash && typeof p._flash === "object"){
        Object.keys(p._flash).forEach(function(r){ var n = parseInt(String(r).replace("r", ""), 10); if(!(n >= 1 && n <= 6)){ delete p._flash[r]; changed = true; } });
      }
      return;
    }
    var t = T[k];
    if(!t || !p[k] || typeof p[k] !== "object"){ delete p[k]; changed = true; return; }
    Object.keys(p[k]).forEach(function(id){
      var m = /^([a-z])([0-9]+)$/.exec(id), n = m ? parseInt(m[2], 10) : 0;
      if(!m || m[1] !== t[0] || n < 1 || n > t[1]){ delete p[k][id]; changed = true; }
    });
  });
  if(changed){ try{ Object.defineProperty(p, "__cleaned", {value: true, enumerable: false, configurable: true}); }catch(e){} }
  return p;
}
function loadProgress(){
  try{
    var raw = localStorage.getItem(STORAGE_KEY);
    if(raw) return sanitizeProgress(JSON.parse(raw));""")
# también se limpia lo que llega de la nube
_o = "    if(phaseKey.charAt(0) === \"_\") continue;\n    if(!progress[phaseKey]) progress[phaseKey] = {};"
assert app.count(_o) == 1
_o2 = "  return changed;\n}\n/* ---- Guardado en la nube con cola y reintentos"
assert app.count(_o2) == 1
app = app.replace(_o2, "  sanitizeProgress(progress);\n" + _o2)
# handshake con el servidor
_o = "var SAVE_Q = {busy: false, pending: false, fails: 0, timer: null, cbs: []};"
assert app.count(_o) == 1
app = app.replace(_o, _o + """
/* ---- Verificación del servidor: el Code.gs publicado debe conocer ESTA actividad ----
   Si el script publicado es una versión antigua, cae a otra hoja y mezcla datos entre actividades.
   Por eso no se guarda ni se carga nada en la nube hasta confirmar que responde como «tiempo». */
var BACKEND = {state: "", at: 0, waiting: [], busy: false};
var BACKEND_OLD_MSG = "⚠️ El servidor de la clase todavía no está actualizado (tu docente debe publicar el Code.gs nuevo). Tu avance se guarda en este dispositivo y subirá solo cuando esté listo.";
function backendCheck(cb){
  if(BACKEND.state === "ok"){ cb("ok"); return; }
  if(BACKEND.state === "old" && Date.now() - BACKEND.at < 30000){ cb("old"); return; }
  BACKEND.waiting.push(cb);
  if(BACKEND.busy) return;
  BACKEND.busy = true;
  var fin = function(st){
    BACKEND.busy = false; BACKEND.state = st; BACKEND.at = Date.now();
    var w = BACKEND.waiting; BACKEND.waiting = [];
    w.forEach(function(f){ try{ f(st); }catch(e){} });
  };
  try{
    fetchText(JSON.stringify({action: "ping", actividad: ACTIVITY_ID}), 15000).then(function(t){
      var d = null; try{ d = JSON.parse(t); }catch(e){}
      if(d && d.ok === true && d.act === ACTIVITY_ID) fin("ok");
      else if(d) fin("old");
      else fin("unknown");
    }).catch(function(){ fin("unknown"); });
  }catch(e){ fin("unknown"); }
}""")
# saveFlush: no escribe en la nube si no está verificado
_o = "  try{\n    fetchText(JSON.stringify({\n        action: \"save\","
assert app.count(_o) == 1
app = app.replace(_o, """  if(BACKEND.state !== "ok"){
    backendCheck(function(bs){
      if(bs === "ok"){ SAVE_Q.busy = false; saveFlush(); }
      else { failed(); if(bs === "old") setSaveChip(true, BACKEND_OLD_MSG); }
    });
    return;
  }
""" + _o)
# syncLoadFromSheet: no carga si no está verificado
_o = "function syncLoadFromSheet(name, carrera, done){\n  if(!sheetSyncConfigured()){ done(); return; }\n"
assert app.count(_o) == 1
app = app.replace(_o, _o + """  if(BACKEND.state !== "ok"){
    var gaveUp = false, g = setTimeout(function(){ gaveUp = true; done(); }, 6500);
    backendCheck(function(bs){
      clearTimeout(g);
      if(bs === "ok"){ if(gaveUp) loadRetryLater(name, carrera, 1); else syncLoadFromSheet(name, carrera, done); }
      else { if(bs === "old") setSaveChip(true, BACKEND_OLD_MSG); if(!gaveUp) done(); }
    });
    return;
  }
""")
# apiCall: rechaza respuestas de un script que no confirma la actividad
_o = "        if(d && d.ok === false){ if(onFail) onFail(d.error || \"error\"); return; }\n        if(onOk) onOk(d);"
assert app.count(_o) == 1
app = app.replace(_o, """        if(d && d.ok === false){ if(onFail) onFail(d.error === "actividad_desconocida" ? "version_antigua" : (d.error || "error")); return; }
        if(d && d.act !== ACTIVITY_ID){ BACKEND.state = "old"; BACKEND.at = Date.now(); if(onFail) onFail("version_antigua"); return; }
        if(onOk) onOk(d);""")
_o = '  if(err === "accion_desconocida") return'
assert app.count(_o) == 1
app = app.replace(_o, '  if(err === "version_antigua") return "⚠️ El Code.gs publicado es una versión ANTIGUA: no conoce esta actividad y mezcla datos de otra (por eso aparecen estudiantes de otra clase). En Apps Script pega el Code.gs nuevo y usa Implementar → Administrar implementaciones → lápiz → Versión: «Nueva versión» → Implementar.";\n' + _o)

app=app.replace('actividad: "continuo"','actividad: "tiempo"').replace('actividad:"continuo"','actividad:"tiempo"')
# 15 flash rounds
app=rep(app,"var FLASH_ROUNDS = [","/* ---- Pantalla de la sala ---- */",rd('live_rounds.js')+"\n")
# QDAY
app=rep(app,"var QDAY = [","function dayKey()",rd('qday.js'))
# duels
i=app.index("var DUELS = [")
j=app.index("function duelOnState(){")
app=app[:i]+rd('duels.js')+app[j:]
# banner / docente texts
app=sub1(app,"<strong>🥊 ¡Duelo Discreto vs. Continuo!</strong> Tu docente lanzó una votación: ¿cuál conviene más?","<strong>🥊 ¡Duelo «¿Quién llega primero?»!</strong> Tu docente lanzó una votación: ¿cuál alcanza antes la meta?")
app=sub1(app,"<h3>🥊 3 · Duelo Discreto vs. Continuo</h3>","<h3>🥊 3 · Duelo «¿Quién llega primero?»</h3>")
app=sub1(app,"lanza la votación (la clase decide cuál oferta conviene)","lanza la votación (la clase decide cuál oferta llega antes a la meta)")

# ACHS
app=sub1(app,'{id: "techo", ic: "🏔️", name: "Descubridor/a del techo", hint: "Completa la fase Descubre el techo.", ok: function(){ return phaseDone("techo", MISSION_TOTALS.techo); }}',
 '{id: "despeja", ic: "🔑", name: "Llave del exponente", hint: "Completa la fase Despeja.", ok: function(){ return phaseDone("despeja", MISSION_TOTALS.despeja); }}')
app=sub1(app,'hint: "Encuentra el error en Fórmula y en Valor presente.", ok: function(){ return isSolved("formula", "f6") && isSolved("valor", "v6"); }}',
 'hint: "Encuentra el error en Despeja y en Fórmula.", ok: function(){ return isSolved("despeja", "d6") && isSolved("formula", "f6"); }}')
app=sub1(app,'{id: "detector", ic: "🚩", name: "Detector/a de promesas", hint: "Resuelve el caso del detector de ofertas exageradas.", ok: function(){ return isSolved("decide", "x2"); }}',
 '{id: "detector", ic: "🚩", name: "Detector/a de promesas", hint: "Resuelve el caso del detector de promesas imposibles.", ok: function(){ return isSolved("dictamen", "j2"); }}')
app=sub1(app,'hint: "Vota en un duelo Discreto vs. Continuo."','hint: "Vota en un duelo «¿Quién llega primero?»."')
app=sub1(app,'hint: "Acierta qué banco conviene en un duelo."','hint: "Acierta qué oferta llega antes en un duelo."')
app=sub1(app,'{id: "maestro", ic: "👑", name: "Maestro/a del Interés", hint: "Completa las 6 fases."','{id: "maestro", ic: "👑", name: "Maestro/a del Tiempo", hint: "Completa las 6 fases."')
# viajero: nueva insignia (línea de vida)
app=sub1(app,'  {id: "banquero",','  {id: "viajero", ic: "⏳", name: "Viajero/a en el tiempo", hint: "Resuelve el reto de la edad de Sofía (Fase Meta).", ok: function(){ return isSolved("meta", "m5"); }},\n  {id: "banquero",')
app=sub1(app,'var b = el("button", "choice"); b.type = "button"; b.innerHTML = rich(q.o[oi]);','var b = el("button", "choice"); b.type = "button"; b.innerHTML = rich(q.o[oi]); if(window.__ICTEST) b.setAttribute("data-oi", oi);')
app=sub1(app,'if(/docente/i.test(String(location.hash || ""))){','if(window.__ICTEST){ window.__TP = {DESPEJA: DESPEJA, FORMULA: FORMULA, SERIES: (typeof SERIES !== "undefined" ? SERIES : null), GLOSSARY: GLOSSARY, REFLECT: REFLECT_PROMPTS, FLASH_ROUNDS: FLASH_ROUNDS, DUELS: DUELS, duelCalc: duelCalc, QDAY: QDAY, DICTAMEN: DICTAMEN, CALCULA: CALCULA, DUPLICA: DUPLICA, META: META, THEORY: THEORY, nper: nper, yrs: yrs}; }\nif(/docente/i.test(String(location.hash || ""))){')
open(P+'app_tp.js','w',encoding='utf8').write(app)
print("app_tp.js", len(app))

# HTML assembly (artifact version and sites version)
def mk(src, out, title):
    h=open(P+src,encoding='utf8').read()
    k=h.rindex('<script>')
    e=h.index('</script>',k)
    h=h[:k]+'<script>'+app+h[e:]
    h=sub1(h,'<title>Interés Compuesto Continuo: Descubre el techo, calcula y decide</title>','<title>'+title+'</title>')
    h=sub1(h,'<span class="mark">Interés Continuo</span>','<span class="mark">Interés: Tiempo</span>')
    h=sub1(h,'Pensamiento Matemático · Semana 12','Pensamiento Matemático · Semana 14')
    if not h.lstrip().startswith('<!doctype') and not h.lstrip().startswith('<meta charset'):
        h='<meta charset="utf-8">\n'+h
    open(P+out,'w',encoding='utf8').write(h)
    print(out,len(h))
mk('src_ec.html','tp.html','Interés Compuesto: Periodo de Tiempo')
mk('src_ec_sites.html','tp-sites.html','Interés Compuesto: Periodo de Tiempo')
