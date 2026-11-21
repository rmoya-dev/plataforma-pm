
(function(){
"use strict";

/* ============================================================
   ESTADO Y PERSISTENCIA
============================================================ */
var PHASE_ICONS = {
  1: '<svg viewBox="0 0 32 32"><path d="M4 27h24"/><path d="M6 6v22"/><path d="M8 11h20" stroke-dasharray="2 3"/><path d="M7 25c6-1 9-6 12-10 3-3 6-4 9-4"/></svg>',
  2: '<svg viewBox="0 0 32 32"><rect x="5" y="6" width="22" height="20" rx="3"/><path d="M10 16h8c0-3-2-5-4-5s-4 2-4 5 2 5 4 5c1.5 0 2.7-.6 3.5-1.6"/><path d="M21 12v-2M21 10h3"/></svg>',
  3: '<svg viewBox="0 0 32 32"><rect x="7" y="4" width="18" height="24" rx="3"/><rect x="10" y="7.5" width="12" height="5" rx="1"/><circle cx="12" cy="17" r="1.2" fill="currentColor" stroke="none"/><circle cx="16" cy="17" r="1.2" fill="currentColor" stroke="none"/><circle cx="20" cy="17" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="22" r="1.2" fill="currentColor" stroke="none"/><circle cx="16" cy="22" r="1.2" fill="currentColor" stroke="none"/><circle cx="20" cy="22" r="1.2" fill="currentColor" stroke="none"/></svg>',
  4: '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="11"/><path d="M16 9v7l-5 3"/><path d="M3 9l3-3M3 9l5 0M3 9l0 5"/></svg>',
  5: '<svg viewBox="0 0 32 32"><path d="M16 4v24"/><path d="M6 10h20"/><path d="M6 10l-3.5 8a3.7 3.7 0 0 0 7 0z"/><path d="M26 10l-3.5 8a3.7 3.7 0 0 0 7 0z"/><line x1="10" y1="28" x2="22" y2="28"/></svg>',
  6: '<svg viewBox="0 0 32 32"><path d="M9 4h10l6 6v18H9z"/><path d="M19 4v6h6"/><path d="M13 16h8M13 20h8"/><circle cx="21" cy="25" r="3.5" fill="currentColor" stroke="none"/></svg>'
};
var ICON_BOSS = '<svg viewBox="0 0 32 32"><path d="M16 4l10 4v8c0 7-4.5 11-10 12-5.5-1-10-5-10-12V8z"/><path d="M12 16.5l3 3 5-6.5"/></svg>';
var ICON_BOLT = '<svg viewBox="0 0 32 32"><path d="M18 3L7 18h8l-2 11 11-15h-8z"/></svg>';
var ICON_MASTER = '<svg viewBox="0 0 32 32"><path d="M5 24h22l2-13-7 5-6-9-6 9-7-5z"/><line x1="7" y1="27" x2="25" y2="27"/></svg>';

/* ============================================================
   MASCOTA — "Sabio", el búho guía de la misión
   Ilustración original y propia (no un personaje con derechos de
   autor), dibujada en SVG con las variables de color del tema para
   que se adapte a modo claro/oscuro automáticamente. Aparece en
   cinco momentos: bienvenida, pista, acierto, reto difícil y
   constancia final.
============================================================ */
var MASCOT_ICONS = {
  welcome: '<svg viewBox="0 0 64 64" aria-hidden="true">'+
    '<path d="M20 20 L24 8 L28 20 Z" fill="var(--accent)"/>'+
    '<path d="M36 20 L40 8 L44 20 Z" fill="var(--accent)"/>'+
    '<path d="M9 24 l-2.6 3 3.4 4-4 4" fill="none" stroke="var(--gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>'+
    '<circle cx="32" cy="37" r="19" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>'+
    '<ellipse cx="16" cy="46" rx="5" ry="7" fill="var(--accent)" transform="rotate(18 16 46)"/>'+
    '<path d="M46 34 Q57 28 55 15" fill="none" stroke="var(--accent)" stroke-width="4.5" stroke-linecap="round"/>'+
    '<ellipse cx="55" cy="14" rx="5" ry="6.5" fill="var(--accent)" transform="rotate(-20 55 14)"/>'+
    '<circle cx="25" cy="35" r="6.4" fill="#FFF6E9"/><circle cx="40" cy="35" r="6.4" fill="#FFF6E9"/>'+
    '<circle cx="26.4" cy="35" r="3.2" fill="var(--ink)"/><circle cx="41.4" cy="35" r="3.2" fill="var(--ink)"/>'+
    '<circle cx="27.6" cy="33.5" r="1" fill="#fff"/><circle cx="42.6" cy="33.5" r="1" fill="#fff"/>'+
    '<path d="M29 43 L35 43 L32 48 Z" fill="var(--gold)"/>'+
    '<path d="M9 20 l1.5 3.4 3.4 1.5 -3.4 1.5 -1.5 3.4 -1.5 -3.4 -3.4 -1.5 3.4 -1.5 Z" fill="var(--accent-2)"/>'+
    '</svg>',
  hint: '<svg viewBox="0 0 64 64" aria-hidden="true">'+
    '<g transform="rotate(-7 32 37)">'+
    '<path d="M20 20 L24 8 L28 20 Z" fill="var(--accent)"/>'+
    '<path d="M36 20 L40 8 L44 20 Z" fill="var(--accent)"/>'+
    '<circle cx="32" cy="37" r="19" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>'+
    '<ellipse cx="17" cy="47" rx="5" ry="7" fill="var(--accent)" transform="rotate(15 17 47)"/>'+
    '<ellipse cx="27" cy="49" rx="5" ry="6.5" fill="var(--accent)" transform="rotate(60 27 49)"/>'+
    '<circle cx="25" cy="35" r="6.2" fill="#FFF6E9"/><circle cx="40" cy="35" r="6.2" fill="#FFF6E9"/>'+
    '<circle cx="23.6" cy="33.6" r="3" fill="var(--ink)"/><circle cx="38.6" cy="33.6" r="3" fill="var(--ink)"/>'+
    '<path d="M29 43 L35 43 L32 48 Z" fill="var(--gold)"/>'+
    '</g>'+
    '<circle cx="49" cy="14" r="7" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2"/>'+
    '<rect x="46.5" y="19.5" width="5" height="3" rx="1" fill="var(--gold)"/>'+
    '<path d="M49 5v3M56 10h3M42 10h3M54 5l-2 2M44 5l2 2" stroke="var(--gold)" stroke-width="1.6" stroke-linecap="round"/>'+
    '</svg>',
  correct: '<svg viewBox="0 0 64 64" aria-hidden="true">'+
    '<path d="M20 20 L24 8 L28 20 Z" fill="var(--accent)"/>'+
    '<path d="M36 20 L40 8 L44 20 Z" fill="var(--accent)"/>'+
    '<path d="M18 33 Q10 22 14 10" fill="none" stroke="var(--accent)" stroke-width="4.5" stroke-linecap="round"/>'+
    '<ellipse cx="14" cy="9" rx="5" ry="6.5" fill="var(--accent)" transform="rotate(20 14 9)"/>'+
    '<path d="M46 33 Q54 22 50 10" fill="none" stroke="var(--accent)" stroke-width="4.5" stroke-linecap="round"/>'+
    '<ellipse cx="50" cy="9" rx="5" ry="6.5" fill="var(--accent)" transform="rotate(-20 50 9)"/>'+
    '<circle cx="32" cy="37" r="19" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>'+
    '<path d="M20 34 Q25 29 30 34" fill="none" stroke="var(--ink)" stroke-width="2.6" stroke-linecap="round"/>'+
    '<path d="M34 34 Q39 29 44 34" fill="none" stroke="var(--ink)" stroke-width="2.6" stroke-linecap="round"/>'+
    '<path d="M29 43 L35 43 L32 48 Z" fill="var(--gold)"/>'+
    '<path d="M8 44 l1.4 3.2 3.2 1.4 -3.2 1.4 -1.4 3.2 -1.4 -3.2 -3.2 -1.4 3.2 -1.4 Z" fill="var(--gold)"/>'+
    '<path d="M55 44 l1.4 3.2 3.2 1.4 -3.2 1.4 -1.4 3.2 -1.4 -3.2 -3.2 -1.4 3.2 -1.4 Z" fill="var(--accent-2)"/>'+
    '</svg>',
  challenge: '<svg viewBox="0 0 64 64" aria-hidden="true">'+
    '<path d="M20 20 L24 8 L28 20 Z" fill="var(--accent)"/>'+
    '<path d="M36 20 L40 8 L44 20 Z" fill="var(--accent)"/>'+
    '<circle cx="32" cy="37" r="19" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>'+
    '<ellipse cx="24" cy="49" rx="6" ry="5" fill="var(--accent)" transform="rotate(-10 24 49)"/>'+
    '<ellipse cx="40" cy="49" rx="6" ry="5" fill="var(--accent)" transform="rotate(10 40 49)"/>'+
    '<line x1="20.5" y1="27.5" x2="27" y2="30" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"/>'+
    '<line x1="43.5" y1="27.5" x2="37" y2="30" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"/>'+
    '<circle cx="25" cy="35.5" r="5.6" fill="#FFF6E9"/><circle cx="40" cy="35.5" r="5.6" fill="#FFF6E9"/>'+
    '<circle cx="25" cy="35.5" r="3" fill="var(--ink)"/><circle cx="40" cy="35.5" r="3" fill="var(--ink)"/>'+
    '<path d="M29 43 L35 43 L32 48 Z" fill="var(--gold)"/>'+
    '<path d="M54 12 L49 26 L54.5 25 L48 40" fill="none" stroke="var(--gold)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'+
    '</svg>',
  certificate: '<svg viewBox="0 0 64 64" aria-hidden="true">'+
    '<path d="M20 20 L24 8 L28 20 Z" fill="var(--accent)"/>'+
    '<path d="M36 20 L40 8 L44 20 Z" fill="var(--accent)"/>'+
    '<circle cx="32" cy="37" r="19" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>'+
    '<path d="M16 13 L32 6 L48 13 L32 20 Z" fill="var(--ink)"/>'+
    '<path d="M40 15 L46 13 L46 21" fill="none" stroke="var(--gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'+
    '<circle cx="46" cy="22.5" r="2.2" fill="var(--gold)"/>'+
    '<path d="M20 34 Q25 29 30 34" fill="none" stroke="var(--ink)" stroke-width="2.6" stroke-linecap="round"/>'+
    '<path d="M34 34 Q39 29 44 34" fill="none" stroke="var(--ink)" stroke-width="2.6" stroke-linecap="round"/>'+
    '<path d="M29 43 L35 43 L32 48 Z" fill="var(--gold)"/>'+
    '<rect x="22" y="47" width="20" height="12" rx="2" fill="var(--surface)" stroke="var(--gold)" stroke-width="2"/>'+
    '<line x1="25" y1="51" x2="39" y2="51" stroke="var(--gold)" stroke-width="1.6" stroke-linecap="round"/>'+
    '<line x1="25" y1="55" x2="35" y2="55" stroke="var(--gold)" stroke-width="1.6" stroke-linecap="round"/>'+
    '</svg>'
};
function mascotBadge(pose, size, extraClass){
  var s = size || 56;
  return '<span class="mascot-badge'+(extraClass?" "+extraClass:"")+'" style="width:'+s+'px;height:'+s+'px;" aria-hidden="true">'+MASCOT_ICONS[pose]+'</span>';
}

var PHASES = [
  {id:1, key:"techo",    label:"Techo",     sub:"¿Hay un límite?"},
  {id:2, key:"formula",  label:"Fórmula",   sub:"M = C·e^(rt)"},
  {id:3, key:"calcula",  label:"Calcula",   sub:"Monto e interés"},
  {id:4, key:"valor",    label:"Retrocede", sub:"Valor presente"},
  {id:5, key:"decide",   label:"Decide",    sub:"Compara y detecta"},
  {id:6, key:"dictamen", label:"Dictamen",  sub:"El informe final"}
];

var STORAGE_KEY = "ec-mission-progress-v1";
function loadProgress(){
  try{
    var raw = localStorage.getItem(STORAGE_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){}
  return {};
}
function saveProgress(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }catch(e){}
}
var progress = loadProgress();
function markSolved(phaseKey, missionKey){
  var already = !!(progress[phaseKey] && progress[phaseKey][missionKey]);
  if(!progress[phaseKey]) progress[phaseKey] = {};
  progress[phaseKey][missionKey] = true;
  if(!already){
    var wasDone = phaseDone(phaseKey, MISSION_TOTALS[phaseKey]);
    var gained = XP_PER_MISSION;
    saveProgress();
    if(!wasDone && phaseDone(phaseKey, MISSION_TOTALS[phaseKey])) gained += XP_PER_PHASE_BONUS;
    if(typeof showXPToast === "function") showXPToast(gained);
  } else {
    saveProgress();
  }
  maybeStampCompletion();
  syncSaveToSheet();
  renderTopbar();
}
function isSolved(phaseKey, missionKey){
  return !!(progress[phaseKey] && progress[phaseKey][missionKey]);
}
function phaseCompleteCount(phaseKey, total){
  var p = progress[phaseKey] || {};
  var n = 0;
  for(var k in p){ if(k.charAt(0)!=="_" && p[k]) n++; }
  return Math.min(n, total);
}
function phaseDone(phaseKey, total){
  return phaseCompleteCount(phaseKey, total) >= total;
}
var MISSION_TOTALS = {techo:6, formula:6, calcula:6, valor:6, decide:5, dictamen:4};
function totalMissions(){
  var n=0; for(var k in MISSION_TOTALS) n+=MISSION_TOTALS[k]; return n;
}
function allPhasesDone(){
  return PHASES.every(function(ph){ return phaseDone(ph.key, MISSION_TOTALS[ph.key]); });
}

/* ---- XP, niveles e insignias coleccionables ---- */
var XP_PER_MISSION = 10, XP_PER_PHASE_BONUS = 25;
function flashXP(){
  var t = 0, f = progress._flash || {};
  for(var r in f){ if(f[r] && typeof f[r].pts === "number") t += f[r].pts; }
  return t;
}
function baseXP(){
  var xp = 0;
  PHASES.forEach(function(ph){
    xp += phaseCompleteCount(ph.key, MISSION_TOTALS[ph.key]) * XP_PER_MISSION;
    if(phaseDone(ph.key, MISSION_TOTALS[ph.key])) xp += XP_PER_PHASE_BONUS;
  });
  return xp;
}
function totalXP(){ return baseXP() + flashXP(); }
function maxXP(){ return totalMissions()*XP_PER_MISSION + PHASES.length*XP_PER_PHASE_BONUS; }
var LEVELS = [
  {min:0,   name:"Aprendiz"},
  {min:120, name:"Explorador"},
  {min:270, name:"Estratega"},
  {min:480, name:"Maestro del Techo"}
];
/* El último nivel (Maestro) exige haber completado las 6 fases, no solo juntar XP con relámpagos */
function levelFor(xp, allDone){
  var lv = LEVELS[0];
  for(var i=0;i<LEVELS.length;i++){ if(xp >= LEVELS[i].min && (i < LEVELS.length-1 || allDone)) lv = LEVELS[i]; }
  return lv;
}
function currentLevelInfo(xp){ return levelFor(xp, allPhasesDone()); }
function nextLevelInfo(xp){
  var i = LEVELS.indexOf(currentLevelInfo(xp));
  return LEVELS[i+1] || null;
}
function nextLevelText(xp){
  var nxt = nextLevelInfo(xp);
  if(!nxt) return " · ¡nivel máximo!";
  return nxt.min > xp ? " · faltan "+(nxt.min-xp)+" XP para "+nxt.name : " · completa las 6 fases para ser "+nxt.name;
}
function anyFlashPlayed(){ return flashXP() > 0 || (progress._flash && Object.keys(progress._flash).length > 0); }
function badgeChips(forceUnlocked){
  var chips = [];
  PHASES.forEach(function(ph){
    var unlocked = forceUnlocked || phaseDone(ph.key, MISSION_TOTALS[ph.key]);
    chips.push('<div class="badge-chip'+(unlocked?" unlocked":"")+'"><span class="badge-circle">'+PHASE_ICONS[ph.id]+'</span><span class="badge-label">'+ph.label+'</span></div>');
  });
  chips.push('<div class="badge-chip boss'+((forceUnlocked||isSolved("dictamen","j4"))?" unlocked":"")+'"><span class="badge-circle">'+ICON_BOSS+'</span><span class="badge-label">Jefe final</span></div>');
  chips.push('<div class="badge-chip boss'+((anyFlashPlayed())?" unlocked":"")+'"><span class="badge-circle">'+ICON_BOLT+'</span><span class="badge-label">Relámpago</span></div>');
  chips.push('<div class="badge-chip boss'+((forceUnlocked||allPhasesDone())?" unlocked":"")+'"><span class="badge-circle">'+ICON_MASTER+'</span><span class="badge-label">Maestro</span></div>');
  return chips.join("");
}
function renderXPPanel(parent, opts){
  opts = opts || {};
  var xp = totalXP(), max = maxXP();
  var lv = currentLevelInfo(xp), nxt = nextLevelInfo(xp);
  var pct = Math.min(100, Math.round(xp/max*100));
  var panel = el("div","xp-panel");
  panel.innerHTML =
    '<span class="xp-level">🏅 '+lv.name+'</span>'+
    '<div class="xp-track"><span class="xp-fill" style="width:'+pct+'%"></span></div>'+
    '<span class="xp-num">'+(xp<=max ? xp+' / '+max : xp)+' XP'+nextLevelText(xp)+'</span>';
  parent.appendChild(panel);
  if(opts.hideBadges) return;
  var badgeRow = el("div","badge-row");
  badgeRow.innerHTML = badgeChips(false);
  parent.appendChild(badgeRow);
}
function showXPToast(amount){
  var t = document.getElementById("xpToast");
  if(!t){
    t = document.createElement("div");
    t.id = "xpToast";
    t.className = "xp-toast";
    document.body.appendChild(t);
  }
  t.textContent = "+"+amount+" XP";
  t.classList.add("show");
  clearTimeout(t._hideTimer);
  t._hideTimer = setTimeout(function(){ t.classList.remove("show"); }, 1400);
}

/* ---- Respaldo en la nube (opcional, vía Google Sheets + Apps Script) ----
   Si tu profesor(a) configuró un backend de respaldo, pega aquí la URL de tu
   Apps Script Web App (termina en /exec). Si se deja como está, la app
   funciona igual que siempre, solo que sin respaldo en la nube: el progreso
   queda únicamente en este navegador (y sin ranking ni sala en vivo). */
var SHEET_API_URL = "https://script.google.com/macros/s/URL_DE_PRODUCCION_RETIRADA/exec";
function sheetSyncConfigured(){
  return typeof SHEET_API_URL === "string" && SHEET_API_URL.indexOf("https://") === 0;
}
function firstNameOf(n){
  var t = String(n || "").trim().split(/\s+/)[0] || "Anónimo";
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
}
function mergeRemoteProgress(remote){
  if(!remote || typeof remote !== "object") return false;
  var changed = false;
  if(typeof remote._apodo === "string" && remote._apodo && !progress._apodo){ progress._apodo = remote._apodo; changed = true; }
  for(var phaseKey in remote){
    var rv = remote[phaseKey];
    if(!rv || typeof rv !== "object") continue;
    if(phaseKey === "_flash"){
      if(!progress._flash) progress._flash = {};
      for(var r in rv){
        if(rv[r] && typeof rv[r].pts === "number" && !progress._flash[r]){ progress._flash[r] = rv[r]; changed = true; }
      }
      continue;
    }
    if(phaseKey === "_racha"){
      if(!progress._racha) progress._racha = {d: []};
      var have = {}; progress._racha.d.forEach(function(x){ have[x] = 1; });
      (rv.d || []).forEach(function(x){ if(!have[x]){ progress._racha.d.push(x); changed = true; } });
      progress._racha.d.sort(); progress._racha.d = progress._racha.d.slice(-60);
      continue;
    }
    if(phaseKey === "_av"){
      if(rv.e && !(progress._av && progress._av.e)){ progress._av = rv; changed = true; }
      continue;
    }
    if(phaseKey === "_ach"){
      if(!progress._ach) progress._ach = {};
      for(var ak in rv){ if(!progress._ach[ak]){ progress._ach[ak] = rv[ak]; changed = true; } }
      continue;
    }
    if(phaseKey === "_reflex"){
      if(!progress._reflex) progress._reflex = {};
      for(var rk in rv){
        if(rv[rk] && typeof rv[rk].t === "string" && (!progress._reflex[rk] || (rv[rk].at || 0) > (progress._reflex[rk].at || 0))){ progress._reflex[rk] = rv[rk]; changed = true; }
      }
      continue;
    }
    if(phaseKey === "_pregunta"){
      if(!progress._pregunta) progress._pregunta = {};
      for(var d in rv){ if(typeof rv[d] === "string" && !progress._pregunta[d]){ progress._pregunta[d] = rv[d]; changed = true; } }
      continue;
    }
    if(phaseKey.charAt(0) === "_") continue;
    if(!progress[phaseKey]) progress[phaseKey] = {};
    for(var missionKey in rv){
      if(rv[missionKey] && !progress[phaseKey][missionKey]){
        progress[phaseKey][missionKey] = true;
        changed = true;
      }
    }
  }
  return changed;
}
/* ---- Guardado en la nube con cola y reintentos ----
   Muchos estudiantes guardan a la vez (por ejemplo al terminar una ronda relámpago). Si el
   respaldo está ocupado o se cae la conexión, el avance queda seguro en este dispositivo y la
   página reintenta sola con esperas crecientes. Nada se pierde ni se bloquea la pantalla. */
var SAVE_PENDING_KEY = "ec-save-pending-v1";
var SAVE_Q = {busy: false, pending: false, fails: 0, timer: null, cbs: []};
function setSaveChip(show, text){
  var c = document.getElementById("saveChip");
  if(!show){ if(c) c.hidden = true; return; }
  if(!c){ c = document.createElement("div"); c.id = "saveChip"; c.className = "save-chip"; c.setAttribute("role", "status"); document.body.appendChild(c); }
  c.hidden = false; c.textContent = text;
}
function saveSetPending(v){ try{ if(v) localStorage.setItem(SAVE_PENDING_KEY, "1"); else localStorage.removeItem(SAVE_PENDING_KEY); }catch(e){} }
function saveHasPending(){ try{ return localStorage.getItem(SAVE_PENDING_KEY) === "1"; }catch(e){ return false; } }
function syncSaveToSheet(cb){
  if(!sheetSyncConfigured() || !student){ if(typeof cb === "function") cb(false); return; }
  if(typeof cb === "function") SAVE_Q.cbs.push(cb);
  SAVE_Q.pending = true; saveSetPending(true);
  if(SAVE_Q.timer || SAVE_Q.busy) return;
  // pequeña espera al azar: 30 personas guardando en el mismo segundo saturan el respaldo
  SAVE_Q.timer = setTimeout(saveFlush, 150 + Math.random() * 2200);
}
function saveDone(ok){
  var cbs = SAVE_Q.cbs; SAVE_Q.cbs = [];
  cbs.forEach(function(f){ try{ f(ok); }catch(e){} });
}
function saveFlush(){
  SAVE_Q.timer = null;
  if(SAVE_Q.busy || !student) return;
  SAVE_Q.busy = true; SAVE_Q.pending = false;
  var failed = function(){
    SAVE_Q.busy = false; SAVE_Q.pending = true; SAVE_Q.fails++;
    if(SAVE_Q.fails === 1) saveDone(false);   // quien esperaba (p. ej. el ranking) no se queda colgado
    if(SAVE_Q.fails >= 2) setSaveChip(true, "☁️ Sin conexión con la nube: tu avance está seguro en este dispositivo y se reintenta solo.");
    var wait = Math.min(60000, 3000 * Math.pow(2, Math.min(SAVE_Q.fails, 5))) + Math.random() * 2500;
    SAVE_Q.timer = setTimeout(saveFlush, wait);
  };
  try{
    fetch(SHEET_API_URL, {
      method: "POST",
      headers: {"Content-Type": "text/plain;charset=utf-8"},
      body: JSON.stringify({
        action: "save",
        actividad: "continuo",
        nombre: student.name,
        carrera: student.carrera,
        progreso: progress,
        completadoEn: getCompletedAt() || ""
      })
    }).then(function(r){ return r.text(); }).then(function(t){
      var d = null; try{ d = JSON.parse(t); }catch(e){}
      if(!d || d.ok !== true){ failed(); return; }
      SAVE_Q.busy = false; SAVE_Q.fails = 0;
      if(SAVE_Q.pending){ SAVE_Q.timer = setTimeout(saveFlush, 400); }
      else { saveSetPending(false); setSaveChip(false); }
      saveDone(true);
    }).catch(failed);
  }catch(e){ failed(); }
}
/* Si volvió el internet o la pestaña vuelve a estar visible, se reintenta enseguida lo que quedó pendiente */
function saveRetryNow(){
  if(!student || !sheetSyncConfigured()) return;
  if(SAVE_Q.pending || saveHasPending()){
    if(SAVE_Q.timer && !SAVE_Q.busy){ clearTimeout(SAVE_Q.timer); SAVE_Q.timer = null; }
    if(!SAVE_Q.busy){ SAVE_Q.pending = true; SAVE_Q.timer = setTimeout(saveFlush, 300 + Math.random() * 1500); }
  }
}
window.addEventListener("online", saveRetryNow);
document.addEventListener("visibilitychange", function(){ if(!document.hidden) saveRetryNow(); });
function syncLoadFromSheet(name, carrera, done){
  if(!sheetSyncConfigured()){ done(); return; }
  var finished = false;
  function finish(){ if(finished) return; finished = true; done(); }
  try{
    fetch(SHEET_API_URL, {
      method: "POST",
      headers: {"Content-Type": "text/plain;charset=utf-8"},
      body: JSON.stringify({action:"load", actividad:"continuo", nombre:name, carrera:carrera})
    }).then(function(r){ return r.json(); }).then(function(data){
      if(data && data.found && data.progreso){
        mergeRemoteProgress(data.progreso);
        saveProgress();
        if(data.completadoEn){
          try{ localStorage.setItem(COMPLETED_KEY, data.completadoEn); }catch(e){}
        }
      }
      finish();
    }).catch(function(){ finish(); loadRetryLater(name, carrera, 1); });
  }catch(e){ finish(); }
  setTimeout(finish, 6000); // nunca dejamos al estudiante esperando de más
}
/* Si la nube no respondió al entrar, se reintenta en silencio (8 s, 25 s, 60 s) para traer el avance guardado */
function loadRetryLater(name, carrera, n){
  if(n > 3) return;
  setTimeout(function(){
    try{
      fetch(SHEET_API_URL, {method: "POST", headers: {"Content-Type": "text/plain;charset=utf-8"}, body: JSON.stringify({action:"load", actividad:"continuo", nombre:name, carrera:carrera})})
        .then(function(r){ return r.json(); }).then(function(data){
          if(data && data.found && data.progreso && mergeRemoteProgress(data.progreso)){
            saveProgress(); renderTopbar(); if(route === "map") render();
          }
        }).catch(function(){ loadRetryLater(name, carrera, n + 1); });
    }catch(e){}
  }, n === 1 ? 8000 : (n === 2 ? 25000 : 60000));
}

/* ---- Registro del estudiante ---- */
var STUDENT_KEY = "ec-mission-student-v1";
function loadStudent(){
  try{
    var raw = localStorage.getItem(STUDENT_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){}
  return null;
}
function saveStudent(s){
  try{ localStorage.setItem(STUDENT_KEY, JSON.stringify(s)); }catch(e){}
}
var student = loadStudent();

/* ---- Fecha de finalización ---- */
var COMPLETED_KEY = "ec-mission-completed-v1";
function getCompletedAt(){
  try{ return localStorage.getItem(COMPLETED_KEY); }catch(e){ return null; }
}
function maybeStampCompletion(){
  if(allPhasesDone() && !getCompletedAt()){
    try{ localStorage.setItem(COMPLETED_KEY, new Date().toISOString()); }catch(e){}
  }
}

var route = "map";
function goTo(r){ route = r; render(); window.scrollTo({top:0, behavior:"smooth"}); }

/* ============================================================
   MATEMÁTICA
============================================================ */
function fmt(n, d){
  if(d===undefined) d = 2;
  if(Math.abs(n) < 1e-9) n = 0;
  var r = Math.round(n * Math.pow(10,d)) / Math.pow(10,d);
  if(Number.isInteger(r)) return String(r);
  return String(r);
}
/* ---- LaTeX (KaTeX) helpers ---- */
function K(tex){
  try{ return katex.renderToString(tex, {throwOnError:false, output:"htmlAndMathml", strict:false}); }
  catch(e){ return "<span>"+tex+"</span>"; }
}
function KB(tex){
  try{ return katex.renderToString(tex, {throwOnError:false, output:"htmlAndMathml", strict:false, displayMode:true}); }
  catch(e){ return "<span>"+tex+"</span>"; }
}
var ICON_STAR = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.6 6.2 6.7.5-5.1 4.4 1.6 6.6L12 16.9l-5.8 3.3 1.6-6.6-5.1-4.4 6.7-.5z"/></svg>';
function formulaCallout(tex, label){
  return '<div class="formula-callout"><div class="fc-tag">'+ICON_STAR+'<span>'+(label||"Fórmula clave")+'</span></div>'+KB("\\boldsymbol{"+tex+"}")+'</div>';
}
/* ============================================================
   UTILIDADES: texto enriquecido, números, calculadora, gráficas
============================================================ */
var REVIEW = false;          // true mientras se arma la vista "ver ejercicio y respuesta"
var uidSeq = 0;

/* $...$ dentro de un texto se dibuja con KaTeX (así nadie ve símbolos como ^) */
function rich(s){ return String(s).replace(/\$\$([^$]+)\$\$/g, function(m, t){ return KB(t); }).replace(/\$([^$]+)\$/g, function(m, t){ return K(t); }); }
function shuffleOrder(n){
  var a = [], i, j, t;
  for(i = 0; i < n; i++) a.push(i);
  for(i = n - 1; i > 0; i--){ j = Math.floor(Math.random() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
}
function parseNum(s){
  if(s === null || s === undefined) return NaN;
  var t = String(s).trim().replace(/[−–]/g, "-").replace(/[\s\u00a0\u202f]/g, "").replace(/^S\/\.?/i, "").replace(/%$/, "");
  if(t === "") return NaN;
  if(t.indexOf(",") >= 0 && t.indexOf(".") >= 0) t = t.replace(/,/g, "");        // 23,594.33 → 23594.33
  else if((t.match(/,/g) || []).length === 1) t = t.replace(",", ".");           // 23594,33 → 23594.33
  var v = Number(t);
  return isFinite(v) ? v : NaN;
}
/* Dinero con miles separados (espacio duro): sol(23594.328) → "S/ 23 594.33" */
function nsep(n, d){
  d = d === undefined ? 2 : d;
  var neg = n < 0, v = Math.abs(n).toFixed(d).split(".");
  var ip = v[0].replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
  return (neg ? "−" : "") + ip + (v[1] ? "." + v[1] : "");
}
function sol(n, d){ return "S/\u00a0" + nsep(n, d); }
/* Monto con interés compuesto: M = C (1 + r/n)^(n t) */
function Mcomp(C, r, n, t){ return C * Math.pow(1 + r / n, n * t); }
function Mcont(C, r, t){ return C * Math.exp(r * t); }
function pvCont(M, r, t){ return M * Math.exp(-r * t); }
function pvDisc(M, r, n, t){ return M / Math.pow(1 + r / n, n * t); }
function near(v, target, tol){ return !isNaN(v) && Math.abs(v - target) <= tol; }
function decTol(dec){ return 0.5 * Math.pow(10, -dec) + 1e-9; }

/* Campo numérico pensado para celular: teclado decimal + botón ± (el teclado numérico de iPhone no trae el signo menos) */
function numInputHTML(id, width, placeholder){
  return '<span class="num-wrap"><input type="text" inputmode="decimal" autocomplete="off" autocapitalize="off" spellcheck="false" data-ans="1" id="' + id + '" placeholder="' + (placeholder || "") + '" style="width:' + (width || 110) + 'px;">' +
    '<button type="button" class="pm-btn" data-pm="' + id + '" aria-label="Cambiar el signo (más o menos)">±</button></span>';
}
document.addEventListener("click", function(ev){
  var b = ev.target.closest && ev.target.closest(".pm-btn");
  if(!b) return;
  var inp = document.getElementById(b.getAttribute("data-pm"));
  if(!inp || inp.disabled) return;
  var v = inp.value.trim();
  inp.value = v.charAt(0) === "-" ? v.slice(1) : "-" + v;
  inp.dispatchEvent(new Event("input", {bubbles: true}));
});
var calcTarget = null;
document.addEventListener("focusin", function(ev){
  var t = ev.target;
  if(t && t.matches && t.matches("input[data-ans]")){
    calcTarget = t;
    var sheet = document.getElementById("calcSheet");
    if(sheet && !sheet.hidden) refreshCalcUse();
  }
  if(t && t.matches && t.matches("input[type=text]") && window.innerWidth < 700){
    var calcOpen = document.body.classList.contains("calc-open");
    setTimeout(function(){ try{ t.scrollIntoView({block: calcOpen ? "start" : "center", behavior: "smooth"}); }catch(e){} }, 250);
  }
});

function expTex(a, b, k, h){
  var s = "";
  var bs = fmt(b, 3), hs = h ? (h > 0 ? "x-" + fmt(h) : "x+" + fmt(-h)) : "x";
  var core = bs + "^{" + hs + "}";
  if(a === 1) s = core; else if(a === -1) s = "-" + core; else s = fmt(a, 3) + "\\cdot " + core;
  if(k > 0) s += "+" + fmt(k, 3); else if(k < 0) s += "-" + fmt(-k, 3);
  return "f(x)=" + s;
}

/* ---- Calculadora científica en pantalla (no hace falta teclado: el exponente se ve como exponente) ---- */
function calcNorm(s){
  return String(s).replace(/\s+/g, "").replace(/,/g, ".").replace(/×/g, "*").replace(/÷/g, "/").replace(/[−–]/g, "-").replace(/π/g, "pi").replace(/√/g, "sqrt");
}
function calcToTex(src){
  var s = calcNorm(src), out = "", st = [], i = 0;
  while(i < s.length){
    var rest = s.slice(i);
    if(rest.indexOf("^(") === 0){ out += "^{"; st.push("}"); i += 2; continue; }
    if(rest.charAt(0) === "^"){
      var mm = /^\^(-?(?:\d+\.?\d*|\.\d+|pi|e))/.exec(rest);
      if(mm){ out += "^{" + calcToTex(mm[1]) + "}"; i += mm[0].length; continue; }
      out += "^{}"; i++; continue;
    }
    if(rest.indexOf("sqrt(") === 0){ out += "\\sqrt{"; st.push("}"); i += 5; continue; }
    if(rest.indexOf("exp(") === 0){ out += "e^{"; st.push("}"); i += 4; continue; }
    if(rest.indexOf("ln(") === 0){ out += "\\ln\\left("; st.push("\\right)"); i += 3; continue; }
    if(rest.indexOf("log(") === 0){ out += "\\log\\left("; st.push("\\right)"); i += 4; continue; }
    if(rest.indexOf("pi") === 0){ out += "\\pi "; i += 2; continue; }
    var c = rest.charAt(0);
    if(c === "("){ out += "\\left("; st.push("\\right)"); i++; continue; }
    if(c === ")"){ if(st.length) out += st.pop(); i++; continue; }
    if(c === "*"){ out += "\\cdot "; i++; continue; }
    if(c === "/"){ out += "\\div "; i++; continue; }
    out += c; i++;
  }
  while(st.length) out += st.pop();
  return out || "\\ ";
}
function calcEval(src){
  var s = calcNorm(src);
  if(!s) return {empty: true};
  var open = 0, k;
  for(k = 0; k < s.length; k++){
    if(s.charAt(k) === "(") open++;
    else if(s.charAt(k) === ")"){ open--; if(open < 0) return {err: "Hay un paréntesis de cierre de más."}; }
  }
  s += new Array(open + 1).join(")");
  var toks = s.match(/\d+\.?\d*|\.\d+|pi|sqrt|exp|log|ln|e|[()+\-*\/^]/g) || [];
  if(toks.join("") !== s) return {err: "Hay un símbolo que no reconozco."};
  var pos = 0;
  function peek(){ return toks[pos]; }
  function fail(m){ throw new Error(m); }
  function isStart(t){ return t !== undefined && (/^[\d.]/.test(t) || t === "pi" || t === "e" || t === "(" || t === "sqrt" || t === "exp" || t === "ln" || t === "log"); }
  function atom(){
    var t = toks[pos++];
    if(t === undefined) fail("La operación está incompleta.");
    if(/^[\d.]/.test(t)) return parseFloat(t);
    if(t === "pi") return Math.PI;
    if(t === "e") return Math.E;
    if(t === "("){ var v = expr(); if(toks[pos++] !== ")") fail("Falta cerrar un paréntesis."); return v; }
    if(t === "sqrt" || t === "exp" || t === "ln" || t === "log"){
      if(toks[pos++] !== "(") fail("Después de esa función abre un paréntesis.");
      var a = expr(); if(toks[pos++] !== ")") fail("Falta cerrar un paréntesis.");
      if(t === "sqrt"){ if(a < 0) fail("No existe la raíz de un número negativo."); return Math.sqrt(a); }
      if(t === "exp") return Math.exp(a);
      if(a <= 0) fail("El logaritmo pide un número positivo.");
      return t === "log" ? Math.log(a) / Math.LN10 : Math.log(a);
    }
    fail("Hay algo fuera de lugar en la operación.");
  }
  function unaryExp(){ if(peek() === "-"){ pos++; return -unaryExp(); } if(peek() === "+"){ pos++; return unaryExp(); } return powr(); }
  function powr(){ var b = atom(); if(peek() === "^"){ pos++; var e = unaryExp(); return Math.pow(b, e); } return b; }
  function unary(){ if(peek() === "-"){ pos++; return -unary(); } if(peek() === "+"){ pos++; return unary(); } return powr(); }
  function term(){
    var v = unary();
    for(;;){
      var t = peek();
      if(t === "*"){ pos++; v *= unary(); }
      else if(t === "/"){ pos++; v /= unary(); }
      else if(isStart(t)){ v *= unary(); }
      else break;
    }
    return v;
  }
  function expr(){
    var v = term();
    for(;;){
      var t = peek();
      if(t === "+"){ pos++; v += term(); }
      else if(t === "-"){ pos++; v -= term(); }
      else break;
    }
    return v;
  }
  try{
    var val = expr();
    if(pos < toks.length) fail("Sobra algo al final de la operación.");
    if(!isFinite(val)) fail("Ese resultado no es un número real finito.");
    return {val: val};
  }catch(e){ return {err: e.message}; }
}

var calcState = {expr: "", ans: null, dec: 3};
function calcRound(v, dec){ return dec === "full" ? String(Number(v.toPrecision(12))) : v.toFixed(parseInt(dec, 10)); }
function buildCalcSheet(){
  var sheet = document.createElement("div");
  sheet.id = "calcSheet"; sheet.className = "calc-sheet"; sheet.hidden = true;
  sheet.setAttribute("role", "dialog"); sheet.setAttribute("aria-label", "Calculadora científica");
  var KEYS = [
    ["C", "clear", "fn"], ["⌫", "back", "fn"], ["(", "(", "op"], [")", ")", "op"], ["÷", "/", "op"],
    [K("x^{y}"), "^(", "fn"], [K("x^{2}"), "^(2)", "fn"], [K("\\sqrt{x}"), "sqrt(", "fn"], [K("e^{x}"), "exp(", "fn"], ["×", "*", "op"],
    ["7", "7"], ["8", "8"], ["9", "9"], [K("\\tfrac{1}{x}"), "1/(", "fn"], ["−", "-", "op"],
    ["4", "4"], ["5", "5"], ["6", "6"], ["π", "pi", "fn"], ["+", "+", "op"],
    ["1", "1"], ["2", "2"], ["3", "3"], ["(−)", "(-", "fn"], ["ANS", "ans", "fn"],
    ["0", "0"], [".", "."], ["log", "log(", "fn"], ["ln", "ln(", "fn"], ["=", "eq", "eq"]
  ];
  sheet.innerHTML =
    '<div class="calc-grip" id="calcGrip" role="button" tabindex="0" aria-label="Arrastra para mover la calculadora (también con las flechas del teclado)"><span class="grip-dots" aria-hidden="true">⠿ ⠿ ⠿</span><span class="grip-txt">Arrastra aquí para mover</span></div>' +
    '<div class="calc-top"><strong>🧮<span class="calc-title"> Calculadora</span></strong>' +
    '<div class="calc-top-r"><label title="Cuántos decimales mostrar"><span class="lbl-dec">Decimales</span><span class="lbl-dec-s">Dec.</span> <select id="calcDec"><option value="2">2</option><option value="3" selected>3</option><option value="4">4</option><option value="5">5</option><option value="full">todos</option></select></label>' +
    '<button type="button" class="btn sm ghost" id="calcGhost" aria-label="Hacer transparente la calculadora para ver lo que hay detrás" title="Transparente: ver lo que hay detrás">👁</button>' +
    '<button type="button" class="btn sm ghost" id="calcSize" aria-label="Cambiar el tamaño de la calculadora" title="Tamaño: compacta / normal / grande">⤢</button>' +
    '<button type="button" class="btn sm ghost" id="calcMin" aria-label="Minimizar o ampliar la calculadora" title="Minimizar / ampliar (también con doble toque en la barra)">▁</button>' +
    '<button type="button" class="btn sm ghost" id="calcDock" aria-label="Devolver a su lugar" title="Devolver a su lugar inicial">⤓</button>' +
    '<button type="button" class="btn sm ghost" id="calcClose" aria-label="Cerrar la calculadora">✕</button></div></div>' +
    '<div class="calc-tour" id="calcTour" hidden><strong>Cómo usarla en 3 pasos</strong><ol><li>Toca las teclas para escribir la operación (por ejemplo <span class="mono">1.02</span>, luego <strong>xʸ</strong>, luego <span class="mono">3</span> y <strong>)</strong>).</li><li>Mira el resultado debajo de la operación. Elige cuántos <strong>decimales</strong> quieres.</li><li>Toca tu campo de respuesta y luego <strong>Pasar al campo</strong>. Puedes <strong>arrastrarla</strong> para ver lo que hay detrás.</li></ol><button type="button" class="btn sm primary" id="calcTourOk">Entendido</button></div>' +
    '<div class="calc-display"><div class="calc-expr" id="calcExpr" aria-live="polite"></div><div class="calc-res" id="calcRes"></div></div>' +
    '<div class="calc-keys" id="calcKeys"></div>' +
    '<div class="calc-foot"><button type="button" class="btn primary" id="calcUse">Pasar al campo de respuesta ↩</button><span class="calc-hint" id="calcHint"></span></div>';
  document.body.appendChild(sheet);
  var keysEl = sheet.querySelector("#calcKeys");
  KEYS.forEach(function(k){
    var b = document.createElement("button");
    b.type = "button"; b.className = "ckey " + (k[2] || "num"); b.innerHTML = k[0];
    b.setAttribute("data-k", k[1]);
    keysEl.appendChild(b);
  });
  keysEl.addEventListener("click", function(ev){
    var b = ev.target.closest(".ckey"); if(!b) return;
    calcPress(b.getAttribute("data-k"));
  });
  sheet.querySelector("#calcClose").addEventListener("click", closeCalc);
  function minToggle(){ sheet.classList.toggle("min"); calcFixPadding(); calcClamp(); }
  sheet.querySelector("#calcMin").addEventListener("click", minToggle);
  sheet.querySelector("#calcGrip").addEventListener("dblclick", minToggle);
  sheet.querySelector("#calcGhost").addEventListener("click", function(){
    var on = sheet.classList.toggle("ghost");
    try{ localStorage.setItem(CALC_GHOST_KEY, on ? "1" : "0"); }catch(e){}
  });
  sheet.querySelector("#calcSize").addEventListener("click", function(){
    calcSize = (calcSize + 1) % 3;
    try{ localStorage.setItem(CALC_SIZE_KEY, String(calcSize)); }catch(e){}
    if(sheet.classList.contains("floating")) calcClamp();
    else if(window.innerWidth >= 720) calcApplyPos(sheet, {def: true});
  });
  sheet.querySelector("#calcDock").addEventListener("click", function(){
    calcSavePos(null);
    if(window.innerWidth >= 720) calcApplyPos(sheet, {def: true}); else calcApplyPos(sheet, null);
    calcFixPadding();
  });
  sheet.querySelector("#calcTourOk").addEventListener("click", function(){ sheet.querySelector("#calcTour").hidden = true; try{ localStorage.setItem("ec-calc-tour", "1"); }catch(e){} calcFixPadding(); calcClamp(); });
  calcInitDrag(sheet);
  sheet.querySelector("#calcDec").addEventListener("change", function(ev){ calcState.dec = ev.target.value; calcPaint(); });
  sheet.querySelector("#calcUse").addEventListener("click", calcUseResult);
  document.addEventListener("keydown", function(ev){
    if(sheet.hidden) return;
    var tg = ev.target && ev.target.tagName;
    if(tg === "INPUT" || tg === "TEXTAREA" || tg === "SELECT") return;
    var key = ev.key;
    if(/^[0-9.+\-*\/()]$/.test(key)){ calcPress(key); ev.preventDefault(); }
    else if(key === "^"){ calcPress("^("); ev.preventDefault(); }
    else if(key === "Enter" || key === "="){ calcPress("eq"); ev.preventDefault(); }
    else if(key === "Backspace"){ calcPress("back"); ev.preventDefault(); }
    else if(key === "Escape"){ closeCalc(); }
  });
  return sheet;
}
function calcPress(k){
  var s = calcState;
  if(k === "clear") s.expr = "";
  else if(k === "back"){
    var m = /(sqrt\(|exp\(|log\(|ln\(|\^\(|pi)$/.exec(s.expr);
    s.expr = m ? s.expr.slice(0, -m[0].length) : s.expr.slice(0, -1);
  }
  else if(k === "eq"){
    var r = calcEval(s.expr);
    if(r.val !== undefined){ s.ans = r.val; s.expr = String(Number(r.val.toPrecision(12))); }
  }
  else if(k === "ans"){ if(s.ans !== null) s.expr += String(Number(s.ans.toPrecision(12))); }
  else s.expr += k;
  calcPaint();
}
function calcPaint(){
  var ex = document.getElementById("calcExpr"), rs = document.getElementById("calcRes");
  if(!ex) return;
  ex.innerHTML = calcState.expr ? K(calcToTex(calcState.expr)) : '<span class="calc-ph">Toca las teclas para escribir tu operación</span>';
  var r = calcEval(calcState.expr);
  if(r.empty){ rs.innerHTML = ""; rs.className = "calc-res"; }
  else if(r.err){ rs.textContent = calcState.expr ? "…" : ""; rs.className = "calc-res soft"; rs.title = r.err; }
  else {
    var shown = calcRound(r.val, calcState.dec);
    var exact = String(Number(r.val.toPrecision(12)));
    rs.innerHTML = "= " + shown + (calcState.dec !== "full" && Number(shown) !== Number(exact) ? ' <span class="calc-exact">(exacto ≈ ' + exact + ')</span>' : "");
    rs.className = "calc-res ok";
  }
  ex.scrollLeft = ex.scrollWidth;
  refreshCalcUse();
}
function refreshCalcUse(){
  var btn = document.getElementById("calcUse"), hint = document.getElementById("calcHint");
  if(!btn) return;
  var ok = calcTarget && document.body.contains(calcTarget) && !calcTarget.disabled;
  btn.disabled = !ok || calcEval(calcState.expr).val === undefined;
  hint.innerHTML = ok ? 'Se pasará a: <strong>' + (calcTarget.getAttribute("aria-label") || "tu campo de respuesta") + '</strong>. Exponente: toca <strong>xʸ</strong>, escríbelo y cierra con <strong>)</strong>.' : 'Toca primero el campo de tu respuesta (la calculadora sigue abierta).';
}
function calcUseResult(){
  var r = calcEval(calcState.expr);
  if(r.val === undefined || !calcTarget || !document.body.contains(calcTarget)) return;
  calcTarget.value = calcRound(r.val, calcState.dec);
  calcTarget.dispatchEvent(new Event("input", {bubbles: true}));
  closeCalc();
  try{ calcTarget.scrollIntoView({block: "center", behavior: "smooth"}); }catch(e){}
}
/* ---- Posición de la calculadora: anclada abajo o flotante (se arrastra con el dedo o el mouse) ---- */
var CALC_POS_KEY = "ec-calc-pos-v1";
function calcLoadPos(){
  try{ var p = JSON.parse(localStorage.getItem(CALC_POS_KEY)); return p && typeof p.x === "number" && typeof p.y === "number" ? p : null; }catch(e){ return null; }
}
function calcSavePos(p){ try{ if(p) localStorage.setItem(CALC_POS_KEY, JSON.stringify(p)); else localStorage.removeItem(CALC_POS_KEY); }catch(e){} }
var CALC_SIZE_KEY = "ec-calc-size-v1", CALC_GHOST_KEY = "ec-calc-ghost-v1";
var calcSize = 1;   // 0 compacta · 1 normal · 2 grande (solo se nota en pantallas anchas)
try{ var cs0 = parseInt(localStorage.getItem(CALC_SIZE_KEY), 10); if(cs0 >= 0 && cs0 <= 2) calcSize = cs0; }catch(e){}
function calcWidth(){
  var vw = window.innerWidth;
  if(vw >= 720) return [272, 322, 400][calcSize];
  return Math.min(560, vw - 16);
}
/* Coloca la calculadora. p = {x, y} libre, o {def:true} = esquina inferior derecha (posición inicial en PC).
   Se permite empujarla casi fuera de la pantalla: solo debe quedar a la vista su barra de arrastre. */
function calcApplyPos(sheet, p){
  if(!p){
    sheet.classList.remove("floating", "compact");
    sheet.style.left = sheet.style.top = sheet.style.width = "";
    return;
  }
  var vw = window.innerWidth, vh = window.innerHeight;
  sheet.classList.add("floating");
  sheet.classList.remove("sz0", "sz1", "sz2"); sheet.classList.add("sz" + calcSize);
  var w = calcWidth();
  sheet.style.width = w + "px";
  // si es más alta que la ventana, se compacta sola (teclas más bajas, sin ayudas) para que quepa sin hacer zoom
  sheet.classList.remove("compact");
  if(sheet.offsetHeight > Math.max(300, vh * 0.72) && !sheet.classList.contains("min")) sheet.classList.add("compact");
  var h = sheet.offsetHeight;
  var x, y;
  if(p.def){ x = vw - w - 18; y = vh - h - 18; }
  else { x = p.x; y = p.y; }
  var wide = vw >= 720;   // en PC se puede empujar casi fuera de la pantalla; en celular se mantiene dentro
  var minX = wide ? -(w - 120) : 8, maxX = wide ? vw - 120 : Math.max(8, vw - w - 8), maxY = vh - 46;
  x = Math.max(minX, Math.min(maxX, x)); y = Math.max(0, Math.min(maxY, y));
  if(p.def){ x = Math.max(8, x); y = Math.max(8, y); }
  sheet.style.left = x + "px"; sheet.style.top = y + "px";
}
function calcClamp(){
  var sheet = document.getElementById("calcSheet");
  if(!sheet || sheet.hidden || !sheet.classList.contains("floating")) return;
  var r = sheet.getBoundingClientRect();
  calcApplyPos(sheet, {x: r.left, y: r.top});
}
function calcFixPadding(){
  var sheet = document.getElementById("calcSheet");
  if(!sheet || sheet.hidden || sheet.classList.contains("floating")){ document.body.style.paddingBottom = ""; return; }
  document.body.style.paddingBottom = (sheet.offsetHeight + 16) + "px";
}
function calcInitDrag(sheet){
  var grip = sheet.querySelector("#calcGrip");
  grip.addEventListener("pointerdown", function(ev){
    ev.preventDefault();
    var r = sheet.getBoundingClientRect();
    if(!sheet.classList.contains("floating")){ calcApplyPos(sheet, {x: r.left, y: r.top}); document.body.style.paddingBottom = ""; r = sheet.getBoundingClientRect(); }
    var offX = ev.clientX - r.left, offY = ev.clientY - r.top;
    try{ grip.setPointerCapture(ev.pointerId); }catch(e){}
    sheet.classList.add("dragging");
    function mv(e){ calcApplyPos(sheet, {x: e.clientX - offX, y: e.clientY - offY}); }
    function up(){
      grip.removeEventListener("pointermove", mv); grip.removeEventListener("pointerup", up); grip.removeEventListener("pointercancel", up);
      sheet.classList.remove("dragging");
      var r2 = sheet.getBoundingClientRect(); calcSavePos({x: r2.left, y: r2.top});
    }
    grip.addEventListener("pointermove", mv); grip.addEventListener("pointerup", up); grip.addEventListener("pointercancel", up);
  });
  grip.addEventListener("keydown", function(ev){
    var d = {ArrowLeft: [-24, 0], ArrowRight: [24, 0], ArrowUp: [0, -24], ArrowDown: [0, 24]}[ev.key];
    if(!d) return;
    ev.preventDefault();
    var r = sheet.getBoundingClientRect();
    calcApplyPos(sheet, {x: r.left + d[0], y: r.top + d[1]}); document.body.style.paddingBottom = "";
    var r2 = sheet.getBoundingClientRect(); calcSavePos({x: r2.left, y: r2.top});
  });
  window.addEventListener("resize", function(){ calcClamp(); calcFixPadding(); });
}
function openCalc(){
  var sheet = document.getElementById("calcSheet") || buildCalcSheet();
  sheet.hidden = false;
  document.body.classList.add("calc-open");
  var seen = false; try{ seen = !!localStorage.getItem("ec-calc-tour"); }catch(e){}
  sheet.querySelector("#calcTour").hidden = seen;
  var p = calcLoadPos();
  var ghost = false; try{ ghost = localStorage.getItem(CALC_GHOST_KEY) === "1"; }catch(e){}
  sheet.classList.toggle("ghost", ghost);
  if(p) calcApplyPos(sheet, p);
  else if(window.innerWidth >= 720) calcApplyPos(sheet, {def: true});   // en PC nace flotando en la esquina, sin tapar el ejercicio
  else calcApplyPos(sheet, null);
  calcFixPadding();
  calcPaint();
}
function closeCalc(){
  var sheet = document.getElementById("calcSheet");
  if(sheet) sheet.hidden = true;
  document.body.classList.remove("calc-open");
  document.body.style.paddingBottom = "";
}
function ensureCalcFab(){
  var fab = document.getElementById("calcFab");
  var show = student && ["register", "docente", "live", "ranking"].indexOf(route) < 0;
  if(!fab){
    fab = document.createElement("button");
    fab.type = "button"; fab.id = "calcFab"; fab.className = "calc-fab";
    fab.setAttribute("aria-label", "Abrir la calculadora científica");
    fab.innerHTML = '<span aria-hidden="true">🧮</span><span class="calc-fab-t">Calculadora</span>';
    fab.addEventListener("click", function(){ var sh = document.getElementById("calcSheet"); if(sh && !sh.hidden) closeCalc(); else openCalc(); });
    document.body.appendChild(fab);
  }
  fab.hidden = !show;
  if(!show) closeCalc();
}
function renderCalcButton(parent){
  var b = el("button", "btn sm", "🧮 Abrir la calculadora científica");
  b.type = "button"; b.addEventListener("click", openCalc);
  parent.appendChild(b);
  return b;
}

/* ---- Recorrido paso a paso (ejemplos guiados) ---- */
function stepWalk(parent, steps){
  var i = 0;
  var box = el("div", "walk");
  parent.appendChild(box);
  function draw(){
    var s = steps[i];
    box.innerHTML =
      '<div class="walk-dots">' + steps.map(function(_, j){ return '<span class="wd' + (j === i ? " on" : (j < i ? " done" : "")) + '"></span>'; }).join("") + '</div>' +
      '<div class="walk-step"><div class="walk-tag">' + s.title + '</div><div>' + rich(s.html) + '</div></div>' +
      '<div class="walk-nav"><button type="button" class="btn sm ghost" id="wk_prev"' + (i === 0 ? " disabled" : "") + '>← Anterior</button>' +
      '<span class="mono" style="font-size:.85rem;">' + (i + 1) + ' / ' + steps.length + '</span>' +
      '<button type="button" class="btn sm primary" id="wk_next"' + (i === steps.length - 1 ? " disabled" : "") + '>Siguiente →</button></div>';
    box.querySelector("#wk_prev").addEventListener("click", function(){ if(i > 0){ i--; draw(); } });
    box.querySelector("#wk_next").addEventListener("click", function(){ if(i < steps.length - 1){ i++; draw(); } });
  }
  draw();
  return box;
}

/* ---- Gráficas con JSXGraph (estilo GeoGebra) ---- */
var boardSeq = 0;
var LIVE_BOARDS = [];
function cssVar(name){
  var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || "#888";
}
/* Si el eje pasa muy cerca del borde, amplía el rango para que los números del eje no se recorten */
function padRange(r, frac){
  var lo = r[0], hi = r[1];
  if(lo <= 0 && hi > 0){
    var need = frac * (hi - lo);
    if(-lo < need) lo = -need;
  }
  return [lo, hi];
}
function setBox(bd, xmin, ymax, xmax, ymin){
  var y = padRange([ymin, ymax], 0.12), x = padRange([xmin, xmax], 0.2);
  try{ bd.board.setBoundingBox([x[0], y[1], x[1], y[0]], false); }catch(e){}
}
function ExpBoard(host, cfg){
  var wrap = el("div", "jxg-wrap");
  host.appendChild(wrap);
  if(typeof JXG === "undefined"){
    wrap.innerHTML = '<p class="progress-note" style="padding:14px;">No se pudo cargar la librería de gráficas (JSXGraph). Revisa tu conexión y recarga la página.</p>';
    return {update: function(){}, glider: null, board: null};
  }
  var id = "jxg" + (++boardSeq);
  var box = el("div", "jxg-box"); box.id = id;
  wrap.appendChild(box);
  var w = Math.max(240, wrap.clientWidth || 560);
  var h = cfg.height || Math.round(Math.min(340, Math.max(220, w * 0.58)));
  box.style.width = "100%"; box.style.height = h + "px";
  var xr = padRange(cfg.xr || [-4, 4], 0.2), yr = padRange(cfg.yr || [-1, 8], 0.12);
  var cInk = cssVar("--ink-soft"), cLine = cssVar("--line");
  var board = JXG.JSXGraph.initBoard(id, {
    boundingbox: [xr[0], yr[1], xr[1], yr[0]],
    axis: true, showCopyright: false, showNavigation: false,
    pan: {enabled: false}, zoom: {enabled: false}, keepAspectRatio: false,
    defaultAxes: {
      x: {strokeColor: cInk, highlight: false, ticks: {strokeColor: cLine, label: {offset: [0, -12]}}},
      y: {strokeColor: cInk, highlight: false, ticks: {strokeColor: cLine,
        // sin números negativos en el eje vertical (son solo margen y estorbaban junto al 0)
        generateLabelText: function(tick, zero){
          var v = tick.usrCoords[2] - zero.usrCoords[2];
          if(v < -1e-9) return "";
          return this.formatLabelText ? this.formatLabelText(v) : String(v);
        }}}
    }
  });
  var objs = {curves: [], hlines: [], points: []};
  (cfg.curves || []).forEach(function(c){
    var col = cssVar(c.color || "--accent");
    objs.curves.push(board.create("functiongraph", [c.f, xr[0], xr[1]], {
      strokeColor: col, strokeWidth: c.width || 3.4, highlight: false, dash: c.dash || 0, fixed: true
    }));
  });
  (cfg.hlines || []).forEach(function(l){
    var col = cssVar(l.color || "--formula");
    var yf = (typeof l.y === "function") ? l.y : function(){ return l.y; };
    objs.hlines.push(board.create("line", [[0, function(){ return yf(); }], [1, function(){ return yf(); }]], {
      strokeColor: col, strokeWidth: 2, dash: 2, highlight: false, fixed: true,
      straightFirst: true, straightLast: true, name: "", withLabel: false
    }));
  });
  (cfg.points || []).forEach(function(p){
    var xf = (typeof p.x === "function") ? p.x : function(){ return p.x; };
    var yf = (typeof p.y === "function") ? p.y : function(){ return p.y; };
    var col = cssVar(p.color || "--accent-2");
    objs.points.push(board.create("point", [function(){ return xf(); }, function(){ return yf(); }], {
      name: p.name || "", withLabel: !!p.name, size: p.size || 4, fixed: true,
      strokeColor: col, fillColor: col, highlight: false, showInfobox: false,
      label: {offset: [8, 10], strokeColor: cssVar("--ink"), fontSize: 13}
    }));
  });
  var glider = null;
  if(cfg.glider){
    var g = cfg.glider;
    var gc = cssVar(g.color || "--gold");
    glider = board.create("glider", [g.x0, (cfg.curves[g.curve || 0].f)(g.x0), objs.curves[g.curve || 0]], {
      size: 7, strokeColor: gc, fillColor: gc, name: "", withLabel: false, showInfobox: false
    });
    if(g.onDrag){ glider.on("drag", function(){ g.onDrag(glider.X(), glider.Y()); }); }
  }
  LIVE_BOARDS.push({board: board, box: box, wrap: wrap});
  return {board: board, glider: glider, update: function(){ try{ board.update(); }catch(e){} }};
}
function resizeBoards(){
  for(var i = LIVE_BOARDS.length - 1; i >= 0; i--){
    var rec = LIVE_BOARDS[i];
    if(!document.body.contains(rec.box)){
      try{ JXG.JSXGraph.freeBoard(rec.board); }catch(e){}
      LIVE_BOARDS.splice(i, 1);
      continue;
    }
    var w = rec.wrap.clientWidth;
    if(w > 0){
      var h = parseInt(rec.box.style.height, 10) || 260;
      try{ rec.board.resizeContainer(w, h, true); rec.board.fullUpdate(); }catch(e){}
    }
  }
}
window.addEventListener("resize", function(){ clearTimeout(resizeBoards._t); resizeBoards._t = setTimeout(resizeBoards, 150); });
window.addEventListener("orientationchange", function(){ setTimeout(resizeBoards, 350); });

/* ---- Misiones secuenciales: las resueltas se pueden volver a abrir (ejercicio + respuesta) ---- */
function runMissions(wrap, list, phaseKey, buildActive, doneHTML, nextRoute, nextLabel){
  function draw(){
    wrap.innerHTML = "";
    list.forEach(function(m, idx){
      var solved = isSolved(phaseKey, m.key);
      var active = !solved && list.slice(0, idx).every(function(mm){ return isSolved(phaseKey, mm.key); });
      var card = el("div", "mission-card" + (solved ? " solved" : "") + (active ? " active" : ""));
      if(solved){
        card.innerHTML = '<div class="mc-line"><h4>✓ ' + rich(m.tag + ' — ' + m.title) + '</h4>' +
          '<button type="button" class="btn sm ghost rv-btn" aria-expanded="false">Ver ejercicio y respuesta ▾</button></div><div class="rv-body" hidden></div>';
        var btn = card.querySelector(".rv-btn"), body = card.querySelector(".rv-body");
        btn.addEventListener("click", function(){
          var open = body.hidden;
          if(open && !body.getAttribute("data-built")){
            body.setAttribute("data-built", "1");
            REVIEW = true;
            try{ buildActive(body, m, idx, function(){}); }catch(e){ body.innerHTML = '<p class="progress-note">No se pudo mostrar este ejercicio.</p>'; }
            REVIEW = false;
          }
          body.hidden = !open;
          btn.setAttribute("aria-expanded", open ? "true" : "false");
          btn.textContent = open ? "Ocultar ▴" : "Ver ejercicio y respuesta ▾";
          if(open) setTimeout(resizeBoards, 60);
        });
        wrap.appendChild(card); return;
      }
      if(!active){ card.innerHTML = '<h4 style="opacity:.55;">🔒 ' + rich(m.tag + ' — ' + m.title) + '</h4>'; wrap.appendChild(card); return; }
      card.innerHTML = '<h4>🎯 ' + rich(m.tag + ' — ' + m.title) + '</h4>';
      wrap.appendChild(card);
      buildActive(card, m, idx, function(){
        markSolved(phaseKey, m.key);
        setTimeout(draw, 1300);
      });
    });
    if(list.every(function(m){ return isSolved(phaseKey, m.key); })){
      var done = el("div", "mission-card solved");
      done.innerHTML = '<h4>' + mascotBadge("correct", 28, "mascot-inline") + doneHTML.title + '</h4><p>' + rich(doneHTML.text) + '</p>' +
        '<button class="btn primary sm" id="' + phaseKey + '_next">' + nextLabel + '</button>';
      wrap.appendChild(done);
      done.querySelector("#" + phaseKey + "_next").addEventListener("click", function(){ goTo(nextRoute); });
    }
  }
  draw();
}

/* ---- Pregunta de opción múltiple: opciones en orden aleatorio, texto con LaTeX ---- */
function mcq(card, opts){
  if(opts.question) card.appendChild(el("p", null, rich(opts.question)));
  if(REVIEW){
    var g0 = el("div", "choice-grid");
    opts.options.forEach(function(txt, i){
      var b = el("button", "choice" + (i === opts.correct ? " correct" : "")); b.type = "button"; b.disabled = true; b.innerHTML = rich(txt); g0.appendChild(b);
    });
    card.appendChild(g0);
    card.appendChild(el("div", "reveal-box", "✅ <strong>Respuesta correcta.</strong> " + rich(opts.explain || "")));
    return g0;
  }
  var grid = el("div", "choice-grid");
  card.appendChild(grid);
  var fb = feedbackBox(card);
  var order = opts.fixed ? opts.options.map(function(_, i){ return i; }) : shuffleOrder(opts.options.length);
  order.forEach(function(oi){
    var btn = el("button", "choice"); btn.type = "button";
    btn.innerHTML = rich(opts.options[oi]);
    btn.addEventListener("click", function(){
      Array.prototype.forEach.call(grid.children, function(x){ x.disabled = true; });
      if(oi === opts.correct){
        btn.classList.add("correct");
        fb.ok("✅ " + (opts.explain || "¡Correcto!"));
        opts.onSolved();
      } else {
        btn.classList.add("incorrect");
        fb.bad(opts.wrong || "Todavía no. Vuelve a mirar la gráfica y la teoría de arriba, y prueba otra opción.");
        setTimeout(function(){
          Array.prototype.forEach.call(grid.children, function(x){ x.disabled = false; x.classList.remove("incorrect"); });
        }, 1000);
      }
    });
    grid.appendChild(btn);
  });
  return grid;
}

/* ---- Entrada numérica con tolerancia, pista y botón de calculadora ---- */
function numCheck(card, opts){
  if(REVIEW){
    var shown = opts.ansText || ('<span class="mono"><strong>' + fmt(opts.ans, opts.dec === undefined ? 2 : opts.dec) + '</strong></span>');
    card.appendChild(el("div", "reveal-box", "✅ <strong>Respuesta:</strong> " + rich(shown) + " — " + rich(opts.explain || "")));
    return {};
  }
  var row = el("div", "num-row");
  var inputId = "nc_" + (++uidSeq);
  row.innerHTML = '<div><label for="' + inputId + '" class="num-label">' + rich(opts.label || "Tu respuesta") + '</label>' + numInputHTML(inputId, 130) + '</div>' +
    '<button class="btn primary sm" type="button">Comprobar</button>' +
    '<button class="btn sm ghost" type="button" data-calc="1">🧮 Calculadora</button>';
  card.appendChild(row);
  var fb = feedbackBox(card);
  var tries = 0;
  var input = row.querySelector("input"), btn = row.querySelector("button.primary");
  if(window.__ICTEST) input.setAttribute("data-expect", String(opts.ans));
  input.setAttribute("aria-label", opts.label ? opts.label.replace(/\$[^$]*\$/g, "").replace(/<[^>]*>/g, "").trim() || "Tu respuesta" : "Tu respuesta");
  row.querySelector("[data-calc]").addEventListener("click", function(){ calcTarget = input; openCalc(); });
  function check(){
    var v = parseNum(input.value);
    if(isNaN(v)){ fb.bad("Escribe un número (puedes usar punto o coma decimal)."); return; }
    var tol = opts.tol !== undefined ? opts.tol : decTol(opts.dec === undefined ? 2 : opts.dec);
    if(Math.abs(v - opts.ans) <= tol){
      fb.ok("✅ " + (opts.explain || "¡Correcto!"));
      input.disabled = true; btn.disabled = true;
      opts.onSolved();
    } else {
      tries++;
      var msg = "Todavía no coincide.";
      if(tries >= 2 && opts.hint) msg += " 💡 " + opts.hint;
      else msg += " Revisa el exponente y el redondeo (" + (opts.dec === undefined ? 2 : opts.dec) + " decimales).";
      fb.bad(msg);
    }
  }
  btn.addEventListener("click", check);
  input.addEventListener("keydown", function(ev){ if(ev.key === "Enter") check(); });
  return {input: input, fb: fb};
}

/* ---- Tabla de valores y «ver la fórmula» opcional (para no mostrar siempre el modelo completo) ---- */
function dataTable(parent, t){
  var d = el("div"); d.style.cssText = "overflow-x:auto;margin:10px 0;";
  d.innerHTML = '<table class="datatable"><tr><th>' + (t.head || "x") + '</th>' + t.xs.map(function(x){ return "<td>" + x + "</td>"; }).join("") + '</tr><tr><th>' + (t.valHead || "Cantidad") + '</th>' + t.ys.map(function(y){ return "<td style=\"white-space:nowrap\">" + y.replace(/ /g, "\u00a0") + "</td>"; }).join("") + '</tr></table>';
  parent.appendChild(d);
  return d;
}
function modelPeek(parent, tex){
  var d = document.createElement("details");
  d.className = "peek";
  d.innerHTML = '<summary>🔍 Ver la fórmula del modelo (opcional)</summary><div class="tex-block">' + KB(tex) + '</div><p class="progress-note">No la necesitas para responder: la gráfica y la tabla bastan.</p>';
  parent.appendChild(d);
  return d;
}

/* ---- «Método B (opcional): con logaritmos» para las preguntas de «¿cuánto tarda?» ---- */
function logBoxHTML(n0, b, M){
  var ratio = M / n0, lr = Math.log(ratio) / Math.LN10, lb = Math.log(b) / Math.LN10, x = lr / lb;
  var f = '<p>Si ya viste logaritmos, hay un atajo exacto. Parte de $N_0\\cdot b^{x}=M$, divide entre $N_0$ y aplica $\\log$: $$x=\\dfrac{\\log\\left(M/N_0\\right)}{\\log(b)}$$</p>' +
    '<p>Aquí: $x=\\dfrac{\\log(' + fmt(M, 0) + '/' + fmt(n0, 0) + ')}{\\log(' + fmt(b, 4) + ')}=\\dfrac{\\log(' + fmt(ratio, 4) + ')}{\\log(' + fmt(b, 4) + ')}\\approx\\dfrac{' + fmt(lr, 4) + '}{' + fmt(lb, 4) + '}\\approx\\mathbf{' + fmt(x, 2) + '}$.</p>' +
    '<p>En la calculadora: <span class="mono">log ( ' + fmt(ratio, 4) + ' ) ÷ log ( ' + fmt(b, 4) + ' )</span>. Debe coincidir con lo que obtuviste probando y ajustando.</p>';
  return '<details class="peek logb"><summary>🧮 Método B (opcional): con logaritmos</summary><div class="peek-body">' + rich(f) + '</div></details>';
}

/* ============================================================
   TEORÍA POR FASE + NAVEGACIÓN ENTRE FASES + FRANJAS DE SALA/RITMO
============================================================ */
var THEORY = {
  1: {title: "📘 Teoría: ¿qué pasa si capitalizas cada vez más seguido?",
    html:
      '<p>En la Semana 11 aprendiste que, con la misma tasa, <strong>más capitalizaciones por año ($n$)</strong> dan más dinero. Pero el aumento se vuelve cada vez más pequeño:</p>' +
      '<div class="th-table"><table class="datatable"><tr><th>$n$</th><th>1</th><th>2</th><th>4</th><th>12</th><th>360</th><th>$\\infty$</th></tr><tr><th>Monto (S/ 1 000, 8 %, 3 años)</th><td>1 259.71</td><td>1 265.32</td><td>1 268.24</td><td>1 270.24</td><td>1 271.22</td><td><strong>1 271.25</strong></td></tr></table></div>' +
      '<ul class="th-list"><li>El monto <strong>sube pero se aplana</strong>: se acerca a un valor máximo, un <strong>techo</strong>.</li><li>Ese techo es el monto con <strong>capitalización continua</strong> (los intereses se suman en cada instante).</li><li>Capitalizar continuamente da apenas <strong>centavos</strong> más que hacerlo cada día.</li></ul>' +
      '<div class="reveal-box">💡 <strong>Mensaje honesto:</strong> ningún banco real capitaliza «en cada instante». El modelo continuo es el <strong>máximo teórico</strong>: sirve para comparar, para modelar y para detectar promesas imposibles.</div>'},
  2: {title: "📘 Teoría: la fórmula del interés continuo",
    html:
      '<p>Cuando $n$ crece sin límite, ' + "$\\left(1+\\dfrac{r}{n}\\right)^{n}$" + ' se acerca a $e^{r}$, donde <strong>$e\\approx2.71828$</strong> es una constante (como $\\pi$). El resultado:</p>' +
      '<div class="tex-block">$$M=C\\,e^{r\\cdot t}\\qquad\\qquad I=M-C$$</div>' +
      '<div class="th-table"><table class="datatable"><tr><th></th><th>Discreta</th><th>Continua</th></tr>' +
      '<tr><td style="text-align:left">Fórmula</td><td>$M=C\\left(1+\\dfrac{r}{n}\\right)^{n\\,t}$</td><td>$M=C\\,e^{r\\,t}$</td></tr>' +
      '<tr><td style="text-align:left">Datos</td><td style="text-align:left">$C,\\ r,\\ n,\\ t$</td><td style="text-align:left">$C,\\ r,\\ t$ (sin $n$)</td></tr>' +
      '<tr><td style="text-align:left">Palabra clave</td><td style="text-align:left">anual, semestral, trimestral, mensual, diaria</td><td style="text-align:left">«continua», «continuamente»</td></tr></table></div>' +
      '<ul class="th-list"><li>La tasa va <strong>en decimal</strong> ($5\\,\\%\\to0.05$).</li><li>El exponente es el <strong>producto</strong> $r\\cdot t$.</li><li>En la calculadora usa la tecla <strong>$e^{x}$</strong>.</li></ul>' +
      '<div class="reveal-box">💡 Si el enunciado no dice «continua», <strong>no</strong> uses $e$. La Semana 11 sigue vigente para las capitalizaciones por períodos.</div>'},
  3: {title: "📘 Método: calcula sin errores",
    html:
      '<ol class="th-list"><li><strong>Ordena los datos:</strong> $C$, $r$ (decimal), $t$.</li><li><strong>Exponente:</strong> $r\\cdot t$.</li><li><strong>Factor:</strong> $e^{r\\,t}$ con la tecla $e^{x}$, <u>sin redondear</u>.</li><li><strong>Monto:</strong> $M=C\\cdot e^{r\\,t}$ y, si piden interés, $I=M-C$.</li><li><strong>Redondea solo al final</strong> (2 decimales en soles).</li><li><strong>Revisa:</strong> ¿$M$ es mayor que $C$?</li></ol>' +
      '<div class="th-table"><table class="datatable"><tr><th>Error frecuente</th><th>Cómo evitarlo</th></tr>' +
      '<tr><td style="text-align:left">Usar la fórmula discreta cuando el enunciado dice «continua» (y al revés)</td><td style="text-align:left">Subraya la palabra clave del enunciado</td></tr>' +
      '<tr><td style="text-align:left">Escribir $r=5$ en vez de $0.05$</td><td style="text-align:left">Convierte siempre el porcentaje a decimal</td></tr>' +
      '<tr><td style="text-align:left">Sumar $r+t$ o usar solo $r$ como exponente</td><td style="text-align:left">El exponente es $r\\times t$</td></tr>' +
      '<tr><td style="text-align:left">Redondear $e^{r\\,t}$ antes de multiplicar</td><td style="text-align:left">Guarda todas las cifras y redondea al final</td></tr></table></div>'},
  4: {title: "📘 Método: valor presente continuo",
    html:
      '<p>¿Cuánto invertir <strong>hoy</strong> para llegar a una meta $M$? Se despeja $C$ de $M=C\\,e^{r\\,t}$:</p>' +
      '<div class="tex-block">$$C=\\dfrac{M}{e^{r\\cdot t}}=M\\,e^{-r\\cdot t}$$</div>' +
      '<ul class="th-list"><li>Para <strong>retroceder</strong> en el tiempo se <u>divide</u> (no se suma ni se multiplica).</li><li>El resultado debe ser <strong>menor</strong> que la meta: señal de alerta si te sale mayor.</li><li>Cuanto más lejos está la meta o mayor es la tasa, <strong>menos</strong> hay que depositar hoy.</li></ul>' +
      '<div class="reveal-box">💡 Truco de calculadora: para $e^{-0.18}$ escribe $e^{x}$, luego $($, el signo menos y $0.18$. O calcula $e^{0.18}$ y usa la tecla $\\frac{1}{x}$.</div>'},
  5: {title: "📘 Método: cómo decidir y detectar ofertas exageradas",
    html:
      '<ol class="th-list"><li><strong>Lee</strong> cada oferta: tasa, forma de capitalizar y tiempo.</li><li><strong>Elige la fórmula</strong> según la palabra clave (anual, mensual, continua…).</li><li><strong>Calcula</strong> el monto final de cada opción.</li><li><strong>Compara</strong> montos (no solo porcentajes) y halla la diferencia en soles.</li><li><strong>Recomienda</strong>: qué eliges, cuánto mejor es y por qué.</li></ol>' +
      '<div class="reveal-box">🚩 <strong>Detector de ofertas exageradas:</strong> con tasa $r$ y tiempo $t$, <u>nadie</u> puede prometerte más de $C\\,e^{r\\,t}$. Si la promesa lo supera, es exagerada.</div>' +
      '<p>Para comparar tasas con capitalizaciones distintas, pásalas a <strong>tasa efectiva anual</strong>: $\\text{TEA}=e^{r}-1$ para la continua. Ejemplo: $6\\,\\%$ continuo $\\Rightarrow\\ \\text{TEA}\\approx6.18\\,\\%$.</p>'},
  6: {title: "📘 Método: tu dictamen en 5 pasos",
    html:
      '<ol class="th-list"><li><strong>Lee</strong> las ofertas y los datos.</li><li><strong>Calcula</strong> con la fórmula correcta (monto, valor presente o tasa efectiva).</li><li><strong>Compara</strong> los resultados y halla la diferencia.</li><li><strong>Decide</strong> y justifica con cifras.</li><li><strong>Redacta</strong> el dictamen: recomendación + cifras + motivo, en 2 o 3 frases.</li></ol>' +
      '<div class="reveal-box">💡 El modelo continuo es un <strong>techo teórico</strong>: un buen profesional dice qué pueden decir los números y qué no. <strong>Próximos pasos:</strong> Semana 13, logaritmos (para despejar el exponente); Semana 14, tiempo de interés; Semana 15, tasa de crecimiento poblacional.</div>'}
};

/* ---- La serie, Temporada 2: continúan Valeria y Camila, un capítulo por fase ---- */
var SERIES = {
  d: {title: "T2 · Valeria y el límite del dinero", chars: "Valeria Rojas, abogada · Don Aurelio, su cliente · Mateo, su asistente",
    ch: [
      ["La promesa del banco", "Un año después del juicio, Don Aurelio vuelve con un folleto: «¡Capitalización continua! Su dinero crece sin parar». Valeria sonríe con cautela. «Sin parar, sí… pero ¿sin límite?». Esa noche prepara un experimento para demostrarlo.", "Pista: ¿qué pasa si capitalizas cada vez más seguido?"],
      ["Una letra nueva en el contrato", "El folleto trae una fórmula con una «e». Mateo duda: «¿Es una variable?». Valeria le muestra que es una constante, como $\\pi$, y que en esta fórmula desaparece una letra que antes era imprescindible.", "Pista: ¿qué dato ya no necesitas?"],
      ["Calculadora en mano", "Mateo aplica por error la fórmula anual a un depósito «continuo» y la diferencia en soles le cuesta un regaño amable. Hoy aprende a leer la palabra clave del enunciado y a usar la tecla $e^{x}$.", "Pista: subraya «continuamente» en el enunciado."],
      ["La fianza de mañana", "Un cliente necesita S/ 5 000 en 2 años para una fianza. Valeria le pregunta: «¿Cuánto debe depositar hoy?» y Mateo, nervioso, quiere sumar. «Para retroceder en el tiempo —dice ella— se divide».", "Pista: el depósito de hoy debe ser menor que la meta."],
      ["Los volantes de la esquina", "Defensa del Consumidor le pide a Valeria revisar cuatro volantes que prometen duplicar el dinero en pocos años con «capitalización continua». Ella toma su calculadora: «Todo tiene un techo».", "Pista: nadie supera $C\\,e^{r\\,t}$."],
      ["El dictamen del fondo", "La Defensoría vuelve a llamarla, esta vez con tres ofertas: diaria, continua y anual. Valeria entrega el caso a su equipo: «Hoy firmas tú». Y el equipo eres tú.", "¡Último capítulo!"]
    ]},
  p: {title: "T2 · La Clínica y el límite del dinero", chars: "Dra. Camila Torres, directora · Luis, practicante",
    ch: [
      ["El folleto que prometía demasiado", "Luis llega con un volante: «Capitalización continua: su dinero crece sin límite». Camila arquea una ceja. «Los pacientes también prometen cambios radicales en una semana… y rara vez ocurren». Propone comprobar el número.", "Pista: ¿existe un máximo?"],
      ["La famosa e", "Camila le explica a Luis que la $e$ de la fórmula no es una incógnita sino un número, 2.71828, que aparece cuando algo crece de forma continua. «Como una terapia constante frente a sesiones sueltas», bromea.", "Pista: en la continua desaparece $n$."],
      ["Cifras para la dirección", "Es lunes y la dirección pide cuánto tendrá el fondo de orientación en 4 años. Luis calcula, redondea al final y por fin acierta. Camila le recuerda: «Cuando el enunciado dice continuo, usa $e$».", "Pista: exponente $r\\cdot t$, sin redondear antes de tiempo."],
      ["La beca de Valeria", "Una estudiante de psicología necesita S/ 5 000 en 3 años para su maestría. Camila le pide a Luis calcular cuánto debe depositar hoy: «Menos de 5 000, ¿verdad?».", "Pista: valor presente = dividir."],
      ["¿Promesa posible o exagerada?", "Camila convierte la sala de reuniones en un «detector de mentiras financieras»: cada volante se prueba con el techo. «En terapia también hacemos eso: no aceptamos promesas imposibles».", "Pista: compara con el máximo."],
      ["El dictamen del fondo familiar", "La Defensoría invita de nuevo a la clínica a asesorar. Camila se lo cede a Luis: «Tú firmas». Y tú lo acompañas con tus cálculos.", "¡Último capítulo!"]
    ]}
};
function seriesKey(){
  if(student && student.carrera === "Psicología") return "p";
  if(student && student.carrera === "Derecho") return "d";
  var k = "d"; try{ k = localStorage.getItem("ec-series-v1") || "d"; }catch(e){}
  return k === "p" ? "p" : "d";
}
function seriesCard(app, num){
  var k = seriesKey(), S = SERIES[k], ch = S.ch[num - 1];
  if(!ch) return;
  var d = document.createElement("details");
  d.className = "series-card" + (k === "p" ? " psi" : "");
  var seen = false; try{ seen = localStorage.getItem("ec-series-seen-" + k + "-" + num) === "1"; }catch(e){}
  d.open = !seen;
  d.innerHTML = '<summary><span class="th-title">📺 ' + S.title + ' · Capítulo ' + num + ': ' + ch[0] + '</span></summary>' +
    '<div class="series-body"><p class="series-chars">' + S.chars + '</p><p>' + rich(ch[1]) + '</p><p class="series-hint">🔎 ' + rich(ch[2]) + '</p>' +
    (student && student.carrera === "Otra" ? '<button type="button" class="btn sm ghost" id="serSwitch">Cambiar a la serie de ' + (k === "d" ? "Psicología" : "Derecho") + '</button>' : "") + '</div>';
  app.appendChild(d);
  d.addEventListener("toggle", function(){ if(!d.open){ try{ localStorage.setItem("ec-series-seen-" + k + "-" + num, "1"); }catch(e){} } });
  var sw = d.querySelector("#serSwitch");
  if(sw) sw.addEventListener("click", function(ev){ ev.preventDefault(); try{ localStorage.setItem("ec-series-v1", k === "d" ? "p" : "d"); }catch(e){} goTo("phase" + num); });
}

/* Franjas dinámicas (sala en vivo y ritmo de la clase) que se refrescan con cada sondeo */
var STRIPS = [];
function registerStrip(box, kind, num){ STRIPS.push({box: box, kind: kind, num: num}); paintStrip(STRIPS[STRIPS.length - 1]); }
function renderStrips(){ STRIPS = STRIPS.filter(function(s){ return document.body.contains(s.box); }); STRIPS.forEach(paintStrip); }
function firstIncompletePhase(){
  for(var i = 0; i < PHASES.length; i++){ if(!phaseDone(PHASES[i].key, MISSION_TOTALS[PHASES[i].key])) return PHASES[i].id; }
  return PHASES.length + 1;
}
function phaseUnlocked(id){
  if(id <= 1) return true;
  var prev = PHASES[id - 2], me = PHASES[id - 1];
  return phaseDone(prev.key, MISSION_TOTALS[prev.key]) || phaseCompleteCount(me.key, MISSION_TOTALS[me.key]) > 0;
}
function paintStrip(s){
  var st = API.state, box = s.box;
  if(s.kind === "live"){
    var round = FLASH_ROUNDS[s.num - 1];
    var live = st && (st.status === "lobby" || st.status === "running");
    if(live && st.round === s.num){
      box.className = "strip live on";
      box.innerHTML = '<span class="pulse-dot"></span><span><strong>⚡ ¡Reto relámpago de esta fase en vivo!</strong> Tu docente abrió la sala.</span><button type="button" class="btn sm primary">Entrar ahora</button>';
      box.querySelector("button").addEventListener("click", function(){ goTo("live"); });
    } else if(live){
      box.className = "strip live";
      box.innerHTML = '<span>⚡ La sala está abierta con la ronda de la <strong>Fase ' + st.round + ' · ' + FLASH_ROUNDS[st.round - 1].short + '</strong>. Puedes entrar igual.</span><button type="button" class="btn sm">Ir a la sala</button>';
      box.querySelector("button").addEventListener("click", function(){ goTo("live"); });
    } else {
      var played = flashPlayed(s.num);
      box.className = "strip live off";
      box.innerHTML = '<span>⚡ <strong>Reto relámpago de esta fase:</strong> ' + (API.ok === false || !sheetSyncConfigured() ? 'sin conexión con la sala' : 'apagado (tu docente lo activa)') + (played ? ' · ya lo jugaste ✔' : '') + '</span><button type="button" class="btn sm ghost">Practicar solo</button>';
      box.querySelector("button").addEventListener("click", function(){ LIVE_PRACTICE = s.num; goTo("live"); });
    }
  } else if(s.kind === "pace"){
    var pace = st && st.pace;
    if(!pace){ box.className = "strip pace hidden"; box.innerHTML = ""; return; }
    var mine = firstIncompletePhase();
    var pname = PHASES[pace.phase - 1] ? PHASES[pace.phase - 1].label : "";
    var behind = mine < pace.phase;
    box.className = "strip pace" + (behind ? " behind" : "");
    var where = 'Fase ' + pace.phase + ' · ' + pname + (pace.mission ? ' · Reto ' + pace.mission : '');
    box.innerHTML = '<span>📍 <strong>La clase va en:</strong> ' + where + (behind ? ' — <em>te faltan ' + (pace.phase - mine) + ' fase(s) para alcanzarla.</em>' : (mine === pace.phase ? ' — ¡vas al ritmo!' : ' — vas adelantado, ¡genial!')) + '</span>' +
      (behind ? '<button type="button" class="btn sm primary">Ir a mi fase actual</button>' : '');
    var bb = box.querySelector("button");
    if(bb) bb.addEventListener("click", function(){ goTo("phase" + Math.min(mine, PHASES.length)); });
  }
}

/* Se llama desde phaseHeader(): ritmo de clase, navegación entre fases, sala en vivo y teoría */
function phaseExtrasBase(app, num){
  var pace = el("div", "strip pace hidden"); app.appendChild(pace); registerStrip(pace, "pace", num);

  var nav = el("div", "phase-nav");
  var prev = PHASES[num - 2], next = PHASES[num];
  nav.innerHTML =
    '<button type="button" class="btn sm ghost" id="pn_prev"' + (prev ? "" : " disabled") + '>← ' + (prev ? 'Fase ' + prev.id + ' · ' + prev.label : 'Inicio') + '</button>' +
    '<button type="button" class="btn sm ghost" id="pn_map">Mapa</button>' +
    '<button type="button" class="btn sm ghost" id="pn_next"' + (next && phaseUnlocked(next.id) ? "" : " disabled") + '>' + (next ? 'Fase ' + next.id + ' · ' + next.label + ' →' : 'Fin') + '</button>';
  app.appendChild(nav);
  nav.querySelector("#pn_prev").addEventListener("click", function(){ if(prev) goTo("phase" + prev.id); });
  nav.querySelector("#pn_map").addEventListener("click", function(){ goTo("map"); });
  nav.querySelector("#pn_next").addEventListener("click", function(){ if(next && phaseUnlocked(next.id)) goTo("phase" + next.id); });

  var live = el("div", "strip live off"); app.appendChild(live); registerStrip(live, "live", num);

  var th = THEORY[num];
  if(th){
    var d = document.createElement("details");
    d.className = "theory";
    var started = phaseCompleteCount(PHASES[num - 1].key, MISSION_TOTALS[PHASES[num - 1].key]) > 0;
    d.open = !started;
    d.innerHTML = '<summary><span class="th-title">' + rich(th.title) + '</span></summary><div class="theory-body">' + rich(th.html) + '</div>';
    app.appendChild(d);
    if(num === 3){
      var body3 = d.querySelector(".theory-body");
      body3.appendChild(el("h4", null, "Ejemplo guiado: el fondo del centro de orientación"));
      body3.appendChild(el("p", null, rich("Un centro deposita $S/\\,8\\,000$ al $6\\,\\%$ anual con capitalización continua durante $4$ años. ¿Cuánto tendrá?")));
      stepWalk(body3, [
        {title: "Paso 1 · Datos", html: "$C=8000$, $r=0.06$ (en decimal), $t=4$. No hay $n$: es continua."},
        {title: "Paso 2 · Exponente", html: "$r\\cdot t=0.06\\cdot4=$ <strong>$0.24$</strong>."},
        {title: "Paso 3 · Factor", html: "Tecla $e^{x}$: $e^{0.24}\\approx$ <strong>$1.271249$</strong> (guárdalo completo)."},
        {title: "Paso 4 · Calcula", html: "$M=8000\\cdot1.271249\\approx$ <strong>S/ 10 169.99</strong>."},
        {title: "Paso 5 · Revisa", html: "$M>C$ ✓ y el interés es $10\\,169.99-8\\,000=$ <strong>S/ 2 169.99</strong>. ¿Te suena el $0.24$? Es el mismo exponente de la Fase 1 ($8\\,\\%$ por $3$ años): a $6\\,\\%$ por $4$ años da lo mismo, porque lo único que importa es el producto $r\\cdot t$."}
      ]);
    }
    if(num === 4){
      var body = d.querySelector(".theory-body");
      body.appendChild(el("h4", null, "Ejemplo guiado: la maestría de Valeria"));
      body.appendChild(el("p", null, rich("Valeria necesita $S/\\,5\\,000$ dentro de $3$ años. El banco paga $6.13\\,\\%$ con capitalización continua. ¿Cuánto deposita hoy?")));
      stepWalk(body, [
        {title: "Paso 1 · Datos", html: "$M=5000$, $r=0.0613$, $t=3$. Se busca el <strong>capital</strong> $C$."},
        {title: "Paso 2 · Exponente", html: "$r\\cdot t=0.0613\\cdot3=$ <strong>$0.1839$</strong>."},
        {title: "Paso 3 · Divide", html: "$C=\\dfrac{5000}{e^{0.1839}}=\\dfrac{5000}{1.201896}\\approx$ <strong>S/ 4 160.10</strong>."},
        {title: "Paso 4 · Interpreta", html: "Con ese depósito alcanza su meta sin aportar más. Los intereses aportan $5000-4160.10\\approx$ <strong>S/ 839.90</strong>."}
      ]);
    }
  }
}

function phaseExtras(app, num){ phaseExtrasBase(app, num); if(typeof seriesCard === "function") seriesCard(app, num); if(typeof glossaryBlock === "function") glossaryBlock(app, num); }

/* ============================================================
   EXTRAS: reflexión de cierre por fase, glosario, letra grande
============================================================ */

/* ---- Reflexión de cierre (se guarda en la hoja y la lee la docente) ---- */
var REFLECT_PROMPTS = {
  techo: "Con tus palabras: ¿por qué capitalizar «infinitas veces» no da dinero infinito? Explícalo con la tabla de la Fase 1 y un ejemplo de tu carrera.",
  formula: "Al armar $M=C\\,e^{r\\,t}$, ¿qué error es el más fácil de cometer (usar la fórmula discreta, la tasa en decimal, el exponente $r\\cdot t$…)? ¿Cómo lo evitarás?",
  calcula: "Al calcular montos e intereses continuos, ¿qué paso te costó más (la tecla $e^{x}$, el exponente, el redondeo)? ¿Qué hiciste para resolverlo?",
  valor: "¿Para qué te sirve conocer el valor presente en tu vida (un ahorro, una deuda, una reparación civil, un fondo de tu futuro consultorio)?",
  decide: "Elige un caso de la fase: ¿por qué la oferta con el número más alto no siempre conviene? ¿Cómo usarías el detector de ofertas exageradas con un cliente o paciente?",
  dictamen: "En una o dos frases, redacta tu dictamen final: ¿qué opción recomiendas, por cuánto gana y qué advertirías? Cierra con una pregunta: ¿qué te falta aprender (logaritmos, tiempo)?"
};
function reflectCard(app, num){
  var ph = PHASES[num - 1];
  if(!ph || !REFLECT_PROMPTS[ph.key]) return;
  var d = document.createElement("details");
  d.className = "reflect-card";
  var saved = progress._reflex && progress._reflex[ph.key];
  d.open = !!saved || phaseDone(ph.key, MISSION_TOTALS[ph.key]);
  d.innerHTML = '<summary><span class="th-title">💬 Tu reflexión de la fase</span><span class="badge' + (saved ? ' up' : '') + '" id="rf_badge_' + ph.key + '">' + (saved ? 'guardada' : 'opcional') + '</span></summary>' +
    '<div class="reflect-body"><p>' + rich(REFLECT_PROMPTS[ph.key]) + '</p>' +
    '<textarea id="rf_t_' + ph.key + '" rows="4" maxlength="300" placeholder="Escribe aquí con tus palabras (máx. 300 caracteres)"></textarea>' +
    '<div class="reflect-row"><span class="progress-note" id="rf_n_' + ph.key + '">0/300</span><button type="button" class="btn sm primary" id="rf_b_' + ph.key + '">Guardar reflexión</button></div>' +
    '<p class="progress-note" id="rf_m_' + ph.key + '" style="margin:6px 0 0;">Tu docente podrá leerla. No tiene nota: sirve para pensar y conversar en clase.</p></div>';
  app.appendChild(d);
  var ta = d.querySelector("textarea"), cnt = d.querySelector("#rf_n_" + ph.key), btn = d.querySelector("#rf_b_" + ph.key), msg = d.querySelector("#rf_m_" + ph.key);
  ta.value = saved ? saved.t : "";
  function upd(){ cnt.textContent = ta.value.length + "/300"; }
  upd();
  ta.addEventListener("input", upd);
  btn.addEventListener("click", function(){
    var t = ta.value.trim().replace(/\s+/g, " ").slice(0, 300);
    if(t.length < 5){ msg.textContent = "Escribe al menos una frase para guardar."; return; }
    if(!progress._reflex) progress._reflex = {};
    progress._reflex[ph.key] = {t: t, at: Date.now()};
    saveProgress(); syncSaveToSheet();
    msg.textContent = "✅ Guardada. Puedes editarla cuando quieras.";
    var bd = d.querySelector("#rf_badge_" + ph.key); bd.textContent = "guardada"; bd.className = "badge up";
  });
}

/* ---- Glosario «¿Qué significa…?» ---- */
var GLOSSARY = [
  {t: "Capital ($C$)", d: "El dinero con el que empiezas: lo que depositas o debes al inicio.", ph: [1, 2, 3]},
  {t: "Tasa de interés ($r$)", d: "El porcentaje que se paga por usar el dinero durante un año. En la fórmula siempre va en decimal: $9\\,\\%\\to0.09$.", ph: [2, 3, 4]},
  {t: "Tiempo ($t$)", d: "La duración en años. Si te dan meses, divídelos entre $12$: $18$ meses $=1.5$ años.", ph: [2, 3, 4]},
  {t: "Monto ($M$)", d: "Todo lo que hay al final: capital más intereses. En el modelo continuo, $M=C\\,e^{r\\,t}$.", ph: [2, 3, 6]},
  {t: "Interés ganado ($I$)", d: "Solo la ganancia, sin el capital: $I=M-C$.", ph: [3]},
  {t: "Capitalización", d: "El momento en que los intereses ya ganados se suman al capital. Puede ser anual, mensual, diaria… o continua.", ph: [1, 2]},
  {t: "Capitalización continua", d: "El caso límite en que los intereses se suman en cada instante. No hay $n$: se usa $M=C\\,e^{r\\,t}$.", ph: [1, 2, 3, 5]},
  {t: "Techo del interés continuo", d: "El máximo monto que se puede alcanzar con tasa $r$ y tiempo $t$ sin importar cuántas veces se capitalice: $C\\,e^{r\\,t}$.", ph: [1, 5]},
  {t: "Número $e$", d: "Constante $e\\approx2.71828$ que aparece cuando algo crece de forma continua. En tu calculadora está la tecla $e^{x}$.", ph: [1, 2, 3]},
  {t: "Exponente $r\\cdot t$", d: "El producto de la tasa (decimal) por el tiempo en años. Es lo único que entra a $e^{x}$.", ph: [2, 3, 4]},
  {t: "Rendimientos decrecientes", d: "Capitalizar más seguido ayuda cada vez menos: el monto sube pero se aplana hacia el techo.", ph: [1]},
  {t: "Valor presente continuo", d: "Cuánto necesitas hoy para llegar a una meta: $C=M\\,e^{-r\\,t}=\\dfrac{M}{e^{r\\,t}}$. Siempre es menor que $M$.", ph: [4, 5, 6]},
  {t: "Tasa efectiva anual (TEA)", d: "La tasa con capitalización anual que da el mismo resultado en un año. Para una tasa continua: $\\text{TEA}=e^{r}-1$.", ph: [5, 6]},
  {t: "Tasa nominal", d: "La tasa «de cartel» que anuncia una oferta. Por sí sola no dice cuánto rinde: depende de cómo se capitaliza.", ph: [5, 6]},
  {t: "Oferta exagerada", d: "Una promesa de monto final mayor que el techo $C\\,e^{r\\,t}$: imposible con esa tasa y ese tiempo.", ph: [5]},
  {t: "Redondeo", d: "Calcula con todos los decimales y redondea solo al final, a céntimos. Redondear $e^{r\\,t}$ antes cambia el resultado.", ph: [3, 4]},
  {t: "Dictamen", d: "Tu conclusión razonada: qué opción conviene, cuánto gana, por qué y qué advertencias harías.", ph: [5, 6]}
];
function glossaryBlock(app, num){
  var items = GLOSSARY.filter(function(g){ return g.ph.indexOf(num) >= 0; });
  if(!items.length) return;
  var d = document.createElement("details");
  d.className = "glossary";
  d.innerHTML = '<summary><span class="th-title">📖 ¿Qué significa…? <span class="gl-count">' + items.length + (items.length === 1 ? ' término' : ' términos') + ' de esta fase</span></span></summary>' +
    '<div class="gl-body">' + items.map(function(g){ return '<div class="gl-item"><strong>' + g.t + '</strong><span>' + rich(g.d) + '</span></div>'; }).join("") + '</div>';
  app.appendChild(d);
}

/* ---- Letra grande: Aa (normal → grande → muy grande), se recuerda en el navegador ---- */
var FONT_KEY = "ec-fontsize-v1", FONT_LABELS = ["Aa", "Aa+", "Aa++"];
function applyFontSize(n){
  var h = document.documentElement;
  h.classList.remove("fs1", "fs2");
  if(n === 1) h.classList.add("fs1"); else if(n === 2) h.classList.add("fs2");
  var b = document.getElementById("btnFont");
  if(b){ b.textContent = FONT_LABELS[n]; b.title = ["Tamaño de letra: normal", "Tamaño de letra: grande", "Tamaño de letra: muy grande"][n]; }
}
function initFontSize(){
  var n = 0;
  try{ n = parseInt(localStorage.getItem(FONT_KEY), 10) || 0; }catch(e){}
  if(n < 0 || n > 2) n = 0;
  applyFontSize(n);
  var b = document.getElementById("btnFont");
  if(b) b.addEventListener("click", function(){
    n = (n + 1) % 3; applyFontSize(n);
    try{ localStorage.setItem(FONT_KEY, String(n)); }catch(e){}
  });
}

/* ============================================================
   TOPBAR / DOTS
============================================================ */
function renderTopbar(){
  var track = document.getElementById("dotTrack");
  track.innerHTML = "";
  PHASES.forEach(function(ph){
    var d = document.createElement("span");
    var cls = "dot";
    if(phaseDone(ph.key, MISSION_TOTALS[ph.key])) cls += " done";
    if(route === "phase"+ph.id) cls += " current";
    d.className = cls;
    d.title = "Fase "+ph.id+": "+ph.label;
    track.appendChild(d);
  });
  var tag = document.getElementById("studentTag");
  if(student && student.name){
    tag.hidden = false;
    tag.innerHTML = "Hola, "+escapeHtml(student.name)+" <button type=\"button\" id=\"editStudentBtn\">editar</button>";
    document.getElementById("editStudentBtn").addEventListener("click", function(){ goTo("register"); });
  } else {
    tag.hidden = true;
  }
}
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; });
}
document.getElementById("btnMap").addEventListener("click", function(){ goTo(student ? "map" : "register"); });
document.getElementById("btnLive").addEventListener("click", function(){ goTo(student ? "live" : "register"); });
document.getElementById("btnRank").addEventListener("click", function(){ goTo(student ? "ranking" : "register"); });

/* ============================================================
   RENDER RAIZ
============================================================ */
function render(){
  var app = document.getElementById("app");
  if(!student && route !== "register" && route !== "docente"){ route = "register"; }
  STRIPS = [];
  renderTopbar();
  ensureCalcFab();
  schedulePoll();
  renderLiveBanner();
  stopLiveTimer();
  if(route === "register"){ app.innerHTML = ""; renderRegister(app); return; }
  if(route === "map"){ app.innerHTML = ""; renderMap(app); return; }
  if(route === "summary"){ app.innerHTML = ""; renderSummary(app); return; }
  if(route === "live"){ app.innerHTML = ""; renderLive(app); return; }
  if(route === "ranking"){ app.innerHTML = ""; renderRanking(app); return; }
  if(route === "docente"){ app.innerHTML = ""; renderDocente(app); return; }
  var m = /^phase(\d)$/.exec(route);
  if(m){
    var n = m[1];
    app.innerHTML = "";
    var fn = PHASE_RENDERERS[n];
    if(typeof fn === "function"){ fn(app); if(typeof reflectCard === "function") reflectCard(app, parseInt(n, 10)); }
    else app.innerHTML = "<p>Fase en construcción.</p>";
  }
}

/* ============================================================
   REGISTRO DEL ESTUDIANTE
============================================================ */
function renderRegister(app){
  var wrap = el("div","register-wrap");
  var isEdit = !!student;
  wrap.innerHTML =
    (isEdit
      ? '<div class="register-icon"><svg viewBox="0 0 32 32"><path d="M2 12l14-6 14 6-14 6z"/><path d="M9 15.5v6c0 1.9 3.1 3.5 7 3.5s7-1.6 7-3.5v-6"/><path d="M28 12v8"/></svg></div>'
      : mascotBadge("welcome", 74, "mascot-welcome")) +
    '<span class="eyebrow" style="color:var(--accent); font-family:var(--font-mono); text-transform:uppercase; letter-spacing:.1em; font-size:.88rem; font-weight:600;">Pensamiento Matemático</span>'+
    '<h1>'+(isEdit ? "Editar tus datos" : "Antes de empezar")+'</h1>'+
    '<p style="color:var(--ink-soft);">'+(isEdit
      ? "Regístrate para que tu progreso quede a tu nombre. Al terminar las seis fases podrás descargar tu constancia."
      : "¡Hola! Soy <strong>Sabio</strong>, tu búho guía en esta misión. Regístrate para que tu progreso quede a tu nombre y compitas en el ranking de la clase — al terminar las seis fases podrás descargar tu constancia.")+'</p>'+
    '<label for="reg_name">Nombre completo</label>'+
    '<input type="text" id="reg_name" placeholder="Ej. María Fernanda Quispe" autocomplete="name" value="'+(student? escapeHtml(student.name):'')+'">'+
    '<label for="reg_carrera">Carrera</label>'+
    '<select id="reg_carrera">'+
      '<option value="Derecho"'+(student&&student.carrera==="Derecho"?" selected":"")+'>Derecho</option>'+
      '<option value="Psicología"'+(student&&student.carrera==="Psicología"?" selected":"")+'>Psicología</option>'+
      '<option value="Otra"'+(student&&student.carrera==="Otra"?" selected":"")+'>Otra carrera</option>'+
    '</select>'+
    '<label for="reg_apodo">Apodo para el ranking <span style="font-weight:400;color:var(--ink-faint);">(opcional)</span></label>'+
    '<input type="text" id="reg_apodo" maxlength="14" placeholder="Ej. Lex_Luz, Psico_Mar..." autocomplete="off" value="'+(student&&student.apodo? escapeHtml(student.apodo):'')+'">'+
    '<p class="progress-note" style="margin:6px 0 0;">Tus compañeros solo verán este apodo (nunca tu nombre completo). Si lo dejas vacío usaremos tu primer nombre.</p>'+
    '<div style="margin-top:20px;"><button class="btn primary" id="reg_submit" style="width:100%;">'+(isEdit?"Guardar cambios":"Comenzar la misión →")+'</button></div>'+
    '<p class="progress-note" id="reg_error" style="color:var(--danger); display:none; margin-top:10px;"></p>';
  app.appendChild(wrap);
  document.getElementById("reg_submit").addEventListener("click", function(){
    var name = document.getElementById("reg_name").value.trim();
    var carrera = document.getElementById("reg_carrera").value;
    var apodo = document.getElementById("reg_apodo").value.trim().replace(/[<>&"']/g, "").slice(0, 14);
    var errEl = document.getElementById("reg_error");
    if(!name){
      errEl.style.display = "block";
      errEl.textContent = "Por favor escribe tu nombre para continuar.";
      return;
    }
    if(!apodo) apodo = firstNameOf(name);
    student = {name:name, carrera:carrera, apodo:apodo};
    saveStudent(student);
    function afterLoad(){
      progress._apodo = apodo;
      saveProgress();
      syncSaveToSheet();
      goTo("map");
      pollOnce();
    }
    if(sheetSyncConfigured()){
      var btn = document.getElementById("reg_submit");
      btn.disabled = true;
      btn.textContent = "Cargando tu progreso...";
    }
    syncLoadFromSheet(name, carrera, afterLoad);
  });
}

/* ============================================================
   MAPA DE MISIÓN
============================================================ */
function renderMap(app){
  var hero = document.createElement("div");
  hero.className = "hero";
  hero.innerHTML =
    '<div class="hero-text">' +
    '<span class="eyebrow">Misión · Pensamiento Matemático</span>' +
    '<h1>Interés Compuesto Continuo</h1>' +
    '<p class="lead">Seis fases para entender qué pasa cuando el interés se capitaliza en cada instante: descubre el techo del crecimiento, arma M = C·e<sup>rt</sup>, calcula montos, retrocede en el tiempo, decide entre ofertas (¡y detecta las exageradas!) y cierra con un dictamen. Casos de Derecho y Psicología, duelos Discreto vs. Continuo con voto de la clase, duelo por equipos y retos relámpago con ranking.</p>' +
    '</div>' +
    '<div class="hero-art"><svg viewBox="0 0 120 120"><path d="M4 100h112M12 8v104" opacity=".45"/><path d="M12 98C48 97 78 88 96 24" stroke-width="2.4"/><circle cx="96" cy="24" r="3.4" fill="currentColor" stroke="none"/><path d="M12 98H112" stroke-dasharray="3 5" opacity=".6"/></svg></div>';
  app.appendChild(hero);

  renderXPPanel(app);
  renderMapExtras(app);

  if(allPhasesDone()){
    var banner = el("div","mission-card solved");
    banner.style.marginBottom = "18px";
    banner.innerHTML = '<h4>'+mascotBadge("correct", 28, "mascot-inline")+'🎓 Misión completa — tu constancia te espera</h4>'+
      '<p>Ya resolviste las siete fases. Ve tu resumen y descarga tu constancia con tu nombre.</p>'+
      '<button class="btn primary sm" id="map_summary">Ver resumen y constancia →</button>';
    app.appendChild(banner);
    banner.querySelector("#map_summary").addEventListener("click", function(){ goTo("summary"); });
  }

  var phaseInfo = PHASES.map(function(ph, i){
    var total = MISSION_TOTALS[ph.key];
    var done = phaseCompleteCount(ph.key, total);
    var complete = done >= total;
    return {ph:ph, total:total, done:done, complete:complete};
  });
  phaseInfo.forEach(function(info, i){
    var prevDone = i===0 ? true : phaseInfo[i-1].complete;
    info.locked = !prevDone && !info.complete && info.done===0;
  });

  var curvyOuter = document.createElement("div");
  curvyOuter.className = "map-curvy";
  app.appendChild(curvyOuter);

  var wrap = document.createElement("div");
  wrap.className = "map-wrap";
  var W = 1000, H = 360;
  var nodesXY = [];
  var n = PHASES.length;
  for(var i=0;i<n;i++){
    var t = i/(n-1); // 0..1
    var x = 70 + t*(W-140);
    var xu = (t-0.5)*2; // -1..1
    var y = H-70 - (1-xu*xu) * (H-160);
    nodesXY.push({x:x,y:y});
  }
  var pathD = "M "+nodesXY[0].x+" "+nodesXY[0].y+" ";
  for(i=1;i<n;i++){
    var prev = nodesXY[i-1], cur = nodesXY[i];
    var mx = (prev.x+cur.x)/2;
    pathD += "C "+mx+" "+prev.y+", "+mx+" "+cur.y+", "+cur.x+" "+cur.y+" ";
  }
  var CHECK_ICON = '<svg viewBox="0 0 32 32"><path d="M6 17l7 7 13-15"/></svg>';
  var LOCK_ICON = '<svg viewBox="0 0 32 32"><rect x="8" y="14" width="16" height="12" rx="2"/><path d="M11 14v-3a5 5 0 0 1 10 0v3"/></svg>';
  function nodeIconHTML(ph, complete, locked){
    if(complete) return CHECK_ICON;
    if(locked) return LOCK_ICON;
    return PHASE_ICONS[ph.id];
  }
  var inner = el("div","map-inner");
  inner.innerHTML = '<svg class="map-svg" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
    '<defs><linearGradient id="pathGrad" x1="0" y1="0" x2="1" y2="0">' +
    '<stop offset="0%" stop-color="var(--accent)"/><stop offset="100%" stop-color="var(--accent-2)"/>' +
    '</linearGradient></defs>' +
    '<path d="'+pathD+'" fill="none" stroke="url(#pathGrad)" stroke-width="4" stroke-dasharray="1 14" stroke-linecap="round" opacity=".55"/>' +
    '</svg>';
  wrap.appendChild(inner);

  phaseInfo.forEach(function(info, i){
    var ph=info.ph, done=info.done, total=info.total, complete=info.complete, locked=info.locked;
    var pct = Math.round(done/total*100);
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "node-btn" + (complete?" done":"") + (locked?" locked":"");
    btn.style.left = (nodesXY[i].x/W*100)+"%";
    btn.style.top = (nodesXY[i].y/H*100)+"%";
    btn.innerHTML = '<span class="node-circle">'+nodeIconHTML(ph,complete,locked)+'<span class="node-num">'+ph.id+'</span></span>' +
      '<div class="node-label">'+ph.label+'</div>' +
      '<div class="node-sub">'+ph.sub+' · '+done+'/'+total+'</div>' +
      '<div class="node-mini-bar"><span style="width:'+pct+'%"></span></div>';
    btn.disabled = locked;
    btn.addEventListener("click", function(){ goTo("phase"+ph.id); });
    inner.appendChild(btn);
  });
  curvyOuter.appendChild(wrap);

  var note = document.createElement("p");
  note.className = "progress-note";
  note.style.marginTop = "14px";
  note.textContent = "Tu progreso se guarda en este navegador. Completa una fase para desbloquear la siguiente (o explora libremente).";
  curvyOuter.appendChild(note);

  // --- Versión en lista para pantallas angostas ---
  var list = el("div","map-list");
  phaseInfo.forEach(function(info){
    var ph=info.ph, done=info.done, total=info.total, complete=info.complete, locked=info.locked;
    var pct = Math.round(done/total*100);
    var tile = document.createElement("button");
    tile.type = "button";
    tile.className = "phase-tile" + (complete?" done":"") + (locked?" locked":"");
    tile.disabled = locked;
    tile.innerHTML =
      '<span class="node-circle" style="'+(complete?'background:linear-gradient(155deg, var(--ok-soft), var(--surface));border-color:var(--ok);color:var(--ok);':'')+'">'+nodeIconHTML(ph,complete,locked)+'<span class="node-num">'+ph.id+'</span></span>'+
      '<span class="tile-text"><div class="node-label">'+ph.label+'</div><div class="node-sub">'+ph.sub+' · '+done+'/'+total+'</div><div class="node-mini-bar"><span style="width:'+pct+'%"></span></div></span>'+
      '<span class="chev">'+(locked?"":"→")+'</span>';
    tile.addEventListener("click", function(){ goTo("phase"+ph.id); });
    list.appendChild(tile);
  });
  app.appendChild(list);

  var note2 = document.createElement("p");
  note2.className = "progress-note";
  note2.style.marginTop = "14px";
  note2.textContent = "Tu progreso se guarda en este navegador. Completa una fase para desbloquear la siguiente (o explora libremente).";
  list.appendChild(note2);
}

/* ============================================================
   UTILIDADES DE UI COMPARTIDAS
============================================================ */
function el(tag, cls, html){
  var e = document.createElement(tag);
  if(cls) e.className = cls;
  if(html!==undefined) e.innerHTML = html;
  return e;
}
function phaseHeader(app, num, title, subtitle){
  var head = el("div","phase-head");
  head.innerHTML = '<div class="phase-head-row">' +
    '<span class="phase-head-icon">'+(PHASE_ICONS[num]||"")+'</span>' +
    '<div><span class="eyebrow" style="color:var(--accent)">Fase '+num+'</span><h2>'+rich(title)+'</h2></div>' +
    '</div>' +
    '<p style="color:var(--ink-soft)">'+rich(subtitle)+'</p>';
  app.appendChild(head);
  if(typeof phaseExtras === "function") phaseExtras(app, num);
}
function feedbackBox(parent){
  var f = el("div","feedback");
  parent.appendChild(f);
  return {
    ok: function(msg){
      f.className = "feedback show ok";
      if(typeof msg === "string" && msg.indexOf("💡") === 0){
        f.innerHTML = '<span class="mascot-hint-row">'+mascotBadge("hint")+'<span>'+rich(msg)+'</span></span>';
      } else {
        f.innerHTML = rich(msg);
      }
    },
    bad: function(msg){ f.className = "feedback show bad"; f.innerHTML = rich(msg); },
    clear: function(){ f.className = "feedback"; f.innerHTML=""; }
  };
}

/* ============================================================
   Utilidades comunes de la actividad «Interés compuesto continuo»
============================================================ */
var CAPS = [
  {n: 1, name: "Anual"}, {n: 2, name: "Semestral"}, {n: 3, name: "Cuatrimestral"}, {n: 4, name: "Trimestral"},
  {n: 6, name: "Bimestral"}, {n: 12, name: "Mensual"}, {n: 360, name: "Diaria"}
];
function solTex(n, d){ return nsep(n, d).replace(/[  ]/g, "\\,"); }
function missionBody(card, m, solved, label){
  if(m.story) card.appendChild(el("p", null, rich(m.story)));
  if(m.table) dataTable(card, m.table);
  if(m.opts) mcq(card, {question: m.q, options: m.opts, correct: m.correct, explain: m.explain, onSolved: solved});
  else {
    card.appendChild(el("p", null, rich(m.prompt)));
    numCheck(card, {label: m.label || label || "Respuesta", ans: m.ans, dec: m.dec, tol: m.tol, hint: m.hint, explain: m.explain, onSolved: solved});
  }
}

/* ============================================================
   FASE 1 — DESCUBRE EL TECHO (¿qué pasa si capitalizas cada vez más seguido?)
============================================================ */
var T0 = {C: 1000, r: 0.08, t: 3};
var T_ROWS = [
  {n: 1, name: "Anual"}, {n: 2, name: "Semestral"}, {n: 4, name: "Trimestral"}, {n: 12, name: "Mensual"}, {n: 360, name: "Diaria"}
].map(function(x){ x.M = Mcomp(T0.C, T0.r, x.n, T0.t); return x; });
var T_CONT = Mcont(T0.C, T0.r, T0.t);
var TECHO = [
  {key:"t1", tag:"Reto 1 de 6", title:"El punto de partida: capitalización anual",
   story:"La cooperativa <strong>Horizonte</strong> te propone un experimento: depositar <strong>S/ 1 000</strong> al <strong>8 % anual</strong> durante <strong>3 años</strong> y comparar qué pasa si capitaliza cada vez más seguido. Empezamos con el caso base: capitalización <em>anual</em> ($n=1$).",
   prompt:"Calcula el monto $M=1000\\,(1.08)^{3}$ (S/, 2 decimales).",
   ans:T_ROWS[0].M, dec:2, hint:"$1.08^{3}=1.259712$. Multiplícalo por $1000$.",
   explain:"$M=1000\\,(1.08)^{3}\\approx$ <strong>S/ 1 259.71</strong>. Este es el monto con $n=1$: el «piso» de nuestro experimento."},
  {key:"t2", tag:"Reto 2 de 6", title:"Capitalizar todos los días",
   story:"Ahora la cooperativa capitaliza <strong>diariamente</strong> ($n=360$): mismo capital, misma tasa y mismos 3 años. La base es $1+\\dfrac{0.08}{360}$ y el exponente $360\\cdot3=1\\,080$.",
   prompt:"Calcula el monto con capitalización diaria (S/, 2 decimales). <em>No redondees la base.</em>",
   ans:T_ROWS[4].M, dec:2, hint:"$M=1000\\left(1+\\dfrac{0.08}{360}\\right)^{1080}$. Guarda la base con todas las cifras (tecla $x^{y}$).",
   explain:"$M=1000\\left(1+\\dfrac{0.08}{360}\\right)^{1080}\\approx$ <strong>S/ 1 271.22</strong>. Pasar de anual a diaria te dio unos <strong>S/ 11.51</strong> más."},
  {key:"t3", tag:"Reto 3 de 6", title:"Lee la tabla: ¿hacia dónde van los montos?",
   story:"Mira cómo cambia el monto cuando $n$ aumenta (mismo capital, tasa y tiempo):",
   table:{head:"Capitalización", xs:T_ROWS.map(function(r){ return r.name; }), ys:T_ROWS.map(function(r){ return nsep(r.M, 2); }), valHead:"Monto (S/)"},
   q:"¿Qué ocurre con el monto a medida que capitalizamos más veces al año?",
   opts:["Sube, pero cada vez menos: se va acercando a un valor máximo","Sube siempre lo mismo en cada paso","Sube sin límite y llega a ser enorme","Baja, porque la tasa se reparte en más partes"], correct:0,
   explain:"Los saltos son <strong>cada vez más pequeños</strong>: $+5.61$, $+2.92$, $+2.00$, $+0.98$. El monto crece pero se «aplana»: se acerca a un <strong>techo</strong>. Ese techo es el interés compuesto continuo."},
  {key:"t4", tag:"Reto 4 de 6", title:"¿Cuánto ganó el último esfuerzo?",
   story:"Capitalizar <strong>mensual</strong> ($n=12$) deja S/ " + nsep(T_ROWS[3].M, 2) + ". Capitalizar <strong>diario</strong> ($n=360$) deja S/ " + nsep(T_ROWS[4].M, 2) + ".",
   prompt:"¿Cuántos soles más da la capitalización diaria que la mensual? (S/, 2 decimales)",
   ans:T_ROWS[4].M - T_ROWS[3].M, dec:2, hint:"Resta los dos montos de la tabla: $1271.22-1270.24$ (trabaja con más decimales si puedes).",
   explain:"Solo <strong>S/ " + nsep(T_ROWS[4].M - T_ROWS[3].M, 2) + "</strong> más, a cambio de capitalizar 30 veces más seguido. Los rendimientos <em>decrecen</em>: hay un límite natural."},
  {key:"t5", tag:"Reto 5 de 6", title:"El techo en el gráfico",
   story:"El gráfico de abajo muestra el monto $M$ según $n$ (eje horizontal). La línea punteada es el <strong>techo</strong> al que se acerca la curva.",
   board:true,
   q:"Si pudieras capitalizar «infinitas veces» (cada instante), ¿cuánto dinero ganarías?",
   opts:["Un monto finito: el techo de la gráfica, unos S/ 1 271.25","Una cantidad infinita: nunca dejaría de crecer","Exactamente lo mismo que con capitalización anual","S/ 0: el interés se anularía"], correct:0,
   explain:"El monto se acerca al techo $1000\\,e^{0.24}\\approx$ <strong>S/ 1 271.25</strong>. Capitalizar cada instante da apenas unos <strong>centavos</strong> más que hacerlo cada día: el interés continuo es un <em>límite</em>, no una máquina de dinero infinito."},
  {key:"t6", tag:"Reto 6 de 6", title:"Detector de promesas (Derecho)",
   story:"Una financiera anuncia: «Con nuestra <strong>capitalización continua</strong>, su dinero crecerá sin límite». Eres asesor/a legal de un cliente que dudaba en firmar.",
   q:"¿Qué le dices?",
   opts:["Es publicidad engañosa: el crecimiento continuo tiene techo $Ce^{rt}$ y depende de la tasa y del tiempo","Es cierto: continuo significa infinito","Es indiferente: continuo y anual son idénticos","Que firme: la tasa es lo de menos"], correct:0,
   explain:"Capitalizar continuamente <strong>no multiplica</strong> la tasa. El máximo posible con tasa $r$ y tiempo $t$ es $Ce^{rt}$. Aquí 8 % durante 3 años: tope de 1.2712 veces el capital. Un buen profesional <em>desconfía de las promesas ilimitadas</em> (¡más en la fase 5!)."}
];

function renderPhase1(app){
  phaseHeader(app, 1, "Descubre el techo: ¿y si capitalizas sin parar?",
    "En la Semana 11 vimos que capitalizar más seguido da más dinero. Hoy llevamos esa idea al extremo y descubrimos que existe un <strong>techo</strong>. Experimenta primero y luego demuestra lo que descubriste.");

  var lab = el("div", "panel");
  lab.innerHTML = '<h3>🔬 Laboratorio: la carrera hacia el techo</h3>' +
    '<p>La curva <span style="color:var(--accent);font-weight:700;">violeta</span> es el monto según el número $n$ de capitalizaciones por año. La línea <span style="color:var(--formula);font-weight:700;">punteada</span> es el techo. Mueve el control de $n$ y mira qué tan cerca queda.</p>'.replace(/\$([^$]+)\$/g, function(m, t){ return K(t); });
  app.appendChild(lab);
  var L = {c: 1000, r: 8, t: 3, n: 4};
  function Mn(x){ return L.c * Math.pow(1 + L.r / 100 / x, x * L.t); }
  function ceil(){ return Mcont(L.c, L.r / 100, L.t); }
  var bh = el("div"); lab.appendChild(bh);
  var bd = ExpBoard(bh, {xr: [1, 60], yr: [0, 1400], curves: [{f: Mn}], hlines: [{y: ceil, color: "--formula"}],
    points: [{x: function(){ return L.n; }, y: function(){ return Mn(L.n); }, name: "", color: "--gold", size: 6}]});
  var ctl = el("div", "slider-grid");
  ctl.innerHTML =
    '<div class="slider-row"><label for="p1_n">Capitalizaciones por año <strong>n</strong> = <span class="slider-val" id="p1_nv">4</span></label><input type="range" id="p1_n" min="1" max="60" step="1" value="4"></div>' +
    '<div class="slider-row"><label for="p1_c">Capital <strong>C</strong> = <span class="slider-val" id="p1_cv">S/ 1 000</span></label><input type="range" id="p1_c" min="200" max="5000" step="100" value="1000"></div>' +
    '<div class="slider-row"><label for="p1_r">Tasa anual <strong>r</strong> = <span class="slider-val" id="p1_rv">8</span> %</label><input type="range" id="p1_r" min="1" max="20" step="1" value="8"></div>' +
    '<div class="slider-row"><label for="p1_t">Tiempo <strong>t</strong> = <span class="slider-val" id="p1_tv">3</span> años</label><input type="range" id="p1_t" min="1" max="10" step="1" value="3"></div>';
  lab.appendChild(ctl);
  var bars = el("div", "cap-bars"); lab.appendChild(bars);
  var read = el("div", "lab-readout"); lab.appendChild(read);
  function labRead(){
    var m1 = Mn(1), gap = Math.max(ceil() - m1, 0.01), top = ceil() + gap * 0.25, lo = m1 - gap * 0.2;
    setBox(bd, 1, top, 60, lo); bd.update();
    var rows = CAPS.filter(function(c){ return [1, 2, 4, 12, 360].indexOf(c.n) >= 0; }).map(function(c){ return {name: c.name + " <small>n=" + c.n + "</small>", M: Mcomp(L.c, L.r / 100, c.n, L.t)}; });
    rows.push({name: "Continua <small>n→∞</small>", M: ceil()});
    var hi = ceil(), base = rows[0].M;
    bars.innerHTML = rows.map(function(v, i){
      var w = hi > base ? Math.max(4, Math.round((v.M - base) / (hi - base) * 100)) : 4;
      return '<div class="cap-row"><span class="cap-name">' + v.name + '</span><span class="cap-track"><span class="cap-fill c' + (i === rows.length - 1 ? 6 : i) + '" style="width:' + w + '%"></span></span><span class="cap-val">' + sol(v.M) + '</span></div>';
    }).join("");
    read.innerHTML = 'Con <strong>n = ' + L.n + '</strong>: ' + sol(Mn(L.n)) + ' · Techo: <strong>' + sol(ceil()) + '</strong> · Te faltan <strong>' + sol(ceil() - Mn(L.n)) + '</strong> para tocarlo.' +
      (L.n >= 30 ? ' <span class="badge up">¡casi en el techo!</span>' : '');
  }
  [["n", 1], ["c", 1], ["r", 1], ["t", 1]].forEach(function(a){
    ctl.querySelector("#p1_" + a[0]).addEventListener("input", function(ev){
      L[a[0]] = parseFloat(ev.target.value);
      document.getElementById("p1_" + a[0] + "v").textContent = a[0] === "c" ? sol(L.c, 0) : L[a[0]];
      labRead();
    });
  });
  labRead();
  lab.appendChild(el("div", "reveal-box", "💡 <strong>Tip:</strong> sube $n$ y observa cómo la curva se vuelve casi plana. Después de $n=30$ casi no hay diferencia: ese «casi» es el techo del interés continuo.".replace(/\$([^$]+)\$/g, function(m, t){ return K(t); })));

  var wrap = el("div"); wrap.style.marginTop = "20px"; app.appendChild(wrap);
  runMissions(wrap, TECHO, "techo", function(card, m, idx, solved){
    if(m.board){
      if(m.story) card.appendChild(el("p", null, rich(m.story)));
      var hh = el("div"); card.appendChild(hh);
      ExpBoard(hh, {xr: [1, 60], yr: [1200, 1290], height: 200,
        curves: [{f: function(x){ return T0.C * Math.pow(1 + T0.r / x, x * T0.t); }}], hlines: [{y: T_CONT, color: "--formula"}]});
      mcq(card, {question: m.q, options: m.opts, correct: m.correct, explain: m.explain, onSolved: solved});
      return;
    }
    missionBody(card, m, solved, "Respuesta (S/)");
  }, {title: "🏁 Fase 1 completa", text: "Descubriste que capitalizar más seguido ayuda, pero con <strong>rendimientos decrecientes</strong>: existe un techo. Ahora vamos a ponerle nombre y fórmula a ese techo: $M=C\\,e^{r\\,t}$."},
  "phase2", "Ir a Fase 2 →");
}

/* ============================================================
   FASE 2 — LA FÓRMULA  M = C · e^(r·t)
============================================================ */
var FORMULA = [
  {key:"f1", tag:"Reto 1 de 6", title:"¿Qué letra desaparece?",
   story:"Al llevar $n\\to\\infty$ en $M=C\\left(1+\\dfrac{r}{n}\\right)^{n\\,t}$ se obtiene el modelo continuo $M=C\\,e^{r\\,t}$, donde $e\\approx2.71828$ es una constante, como $\\pi$.",
   q:"Comparando las dos fórmulas, ¿qué dato <strong>ya no se necesita</strong> en la continua?",
   opts:["$n$, el número de capitalizaciones por año","$C$, el capital","$r$, la tasa","$t$, el tiempo"], correct:0,
   explain:"En el modelo continuo se capitaliza «en cada instante», así que ya no preguntamos <em>cuántas veces</em> al año. Solo importan <strong>$C$, $r$ y $t$</strong>."},
  {key:"f2", tag:"Reto 2 de 6", title:"El exponente es $r\\cdot t$ (Psicología)",
   story:"Un centro psicológico invierte <strong>S/ 25 000</strong> al <strong>5 % anual</strong> con capitalización continua durante <strong>3 años</strong>. Recuerda: la tasa va en <strong>decimal</strong>.",
   prompt:"Calcula el exponente $r\\cdot t$ (2 decimales).",
   ans:0.15, dec:2, hint:"$r=5\\,\\%=0.05$ y $t=3$: multiplica $0.05\\cdot3$.",
   explain:"$r\\cdot t=0.05\\cdot3=$ <strong>0.15</strong>. Error típico: usar $r=5$ (que daría $15$) o sumar $r+t$ en vez de multiplicar."},
  {key:"f3", tag:"Reto 3 de 6", title:"La tecla $e^{x}$ de tu calculadora",
   story:"El factor de crecimiento es $e^{r\\,t}=e^{0.15}$. Abre la calculadora y usa la tecla <strong>$e^{x}$</strong> (aparece como <span class=\"mono\">exp(</span>): escribe <span class=\"mono\">0.15</span> y cierra el paréntesis).",
   prompt:"Calcula $e^{0.15}$ (5 decimales).",
   ans:Math.exp(0.15), dec:5, hint:"Pulsa $e^{x}$, escribe $0.15$, cierra con $)$ y $=$. Debe dar un número un poco mayor que $1$.",
   explain:"$e^{0.15}\\approx$ <strong>1.16183</strong>: el dinero se multiplica por 1.16183 en 3 años (un 16.18 % de crecimiento total)."},
  {key:"f4", tag:"Reto 4 de 6", title:"Ejemplo 1: el fondo del centro psicológico",
   story:"Con los mismos datos ($C=25\\,000$, $r=5\\,\\%$, $t=3$ años), arma $M=25000\\,e^{0.15}$.",
   prompt:"Calcula el monto $M$ (S/, 2 decimales).",
   ans:Mcont(25000, 0.05, 3), dec:2, hint:"Multiplica $25000$ por el factor $e^{0.15}\\approx1.161834$ (guárdalo completo).",
   explain:"$M=25000\\,e^{0.15}\\approx$ <strong>S/ 29 045.86</strong>. El interés ganado es $I=M-C\\approx$ S/ 4 045.86."},
  {key:"f5", tag:"Reto 5 de 6", title:"¿Discreta o continua? Lee bien el enunciado",
   story:"Cuatro depósitos: <strong>(a)</strong> «capitalizado trimestralmente», <strong>(b)</strong> «capitalizado continuamente», <strong>(c)</strong> «capitalizado cada mes», <strong>(d)</strong> «interés simple».",
   q:"¿En cuál se usa $M=C\\,e^{r\\,t}$?",
   opts:["Solo en (b): «capitalizado continuamente»","En (a) y (c): capitalizan muchas veces","En todas","En (d): el simple es el más sencillo"], correct:0,
   explain:"La palabra clave es <strong>«continuamente»</strong> (o «de forma continua»). Trimestral y mensual usan $M=C\\left(1+\\frac{r}{n}\\right)^{nt}$ con $n=4$ y $n=12$; el simple usa $C(1+rt)$."},
  {key:"f6", tag:"Reto 6 de 6", title:"Detective: ¿qué error cometió el asistente? (Derecho)",
   story:"El estudio jurídico deposita <strong>S/ 25 000</strong> al <strong>5 %</strong> con capitalización <strong>continua</strong> por <strong>3 años</strong>. Su asistente escribe: $M=25000\\,(1.05)^{3}\\approx28\\,940.63$.",
   q:"¿Cuál es el error?",
   opts:["Usó la fórmula de capitalización anual; el enunciado pide $M=25000\\,e^{0.05\\cdot3}$","Debió usar $r=5$ en lugar de $0.05$","Debió restar el capital al final","No hay error"], correct:0,
   explain:"La fórmula $C(1+r)^{t}$ es de capitalización <strong>anual</strong>. Como el enunciado dice «continua», la correcta es $25000\\,e^{0.15}\\approx29\\,045.86$: el asistente dejó de recibir <strong>S/ 105.23</strong> en el dictamen."}
];

function renderPhase2(app){
  phaseHeader(app, 2, "La fórmula: $M=C\\,e^{r\\,t}$",
    "Una sola fórmula, tres datos ($C$, $r$, $t$) y una tecla nueva en tu calculadora. Aprende de dónde sale, cómo se arma y en qué se suele fallar.");

  var lab = el("div", "panel");
  lab.innerHTML = '<h3>🧩 Laboratorio: arma la fórmula paso a paso</h3>' +
    '<p>Elige los datos de una inversión y mira cómo se reemplazan en ' + K("M=C\\,e^{r\\,t}") + '.</p>';
  app.appendChild(lab);
  var L = {c: 25000, r: 5, t: 3};
  var ctl = el("div", "slider-grid");
  ctl.innerHTML =
    '<div class="slider-row"><label for="p2_c">Capital <strong>C</strong> = <span class="slider-val" id="p2_cv">S/ 25 000</span></label><input type="range" id="p2_c" min="1000" max="100000" step="1000" value="25000"></div>' +
    '<div class="slider-row"><label for="p2_r">Tasa anual <strong>r</strong> = <span class="slider-val" id="p2_rv">5</span> %</label><input type="range" id="p2_r" min="1" max="20" step="0.25" value="5"></div>' +
    '<div class="slider-row"><label for="p2_t">Tiempo <strong>t</strong> = <span class="slider-val" id="p2_tv">3</span> años</label><input type="range" id="p2_t" min="1" max="20" step="1" value="3"></div>';
  lab.appendChild(ctl);
  var steps = el("div", "lab-readout"); lab.appendChild(steps);
  function labRead(){
    var r = L.r / 100, rt = r * L.t, f = Math.exp(rt), M = L.c * f, Md = L.c * Math.pow(1 + r, L.t);
    steps.innerHTML =
      '<div class="calc-steps">' +
      '<div><span class="cs-n">1</span> Tasa en decimal: ' + K("r=\\dfrac{" + fmt(L.r, 2) + "}{100}=" + fmt(r, 4)) + '</div>' +
      '<div><span class="cs-n">2</span> Exponente: ' + K("r\\cdot t=" + fmt(r, 4) + "\\cdot" + L.t + "=" + fmt(rt, 4)) + '</div>' +
      '<div><span class="cs-n">3</span> Factor: ' + K("e^{" + fmt(rt, 4) + "}\\approx" + fmt(f, 6)) + '</div>' +
      '<div><span class="cs-n">4</span> Monto: ' + K("M=" + solTex(L.c, 0) + "\\cdot" + fmt(f, 6) + "\\approx" + solTex(M, 2)) + '</div>' +
      '<div><span class="cs-n">5</span> Interés ganado: ' + K("I=M-C\\approx" + solTex(M - L.c, 2)) + '</div></div>' +
      '<p class="progress-note" style="margin-top:8px;">Para comparar: con capitalización <em>anual</em> tendrías ' + sol(Md) + ' (el continuo gana ' + sol(M - Md) + ' más).</p>';
  }
  ["c", "r", "t"].forEach(function(k){
    ctl.querySelector("#p2_" + k).addEventListener("input", function(ev){
      L[k] = parseFloat(ev.target.value);
      document.getElementById("p2_" + k + "v").textContent = k === "c" ? sol(L.c, 0) : L[k];
      labRead();
    });
  });
  labRead();

  var eb = el("div", "panel");
  eb.innerHTML = '<h3>🧪 ¿De dónde sale la «e»?</h3><p>Es el número al que se acerca ' + K("\\left(1+\\dfrac{1}{n}\\right)^{n}") + ' cuando $n$ crece. Compruébalo:</p>'.replace(/\$([^$]+)\$/g, function(m, t){ return K(t); });
  var ns = [1, 10, 100, 1000, 10000, 1000000];
  dataTable(eb, {head: "n", xs: ns.map(function(n){ return nsep(n, 0); }), ys: ns.map(function(n){ return fmt(Math.pow(1 + 1 / n, n), 5); }), valHead: "(1+1/n)^n"});
  eb.appendChild(el("p", "progress-note", "Con $n=1\\,000\\,000$ ya casi no cambia: se estabiliza en <strong>$e\\approx2.71828$</strong>. Por eso ese número aparece cuando el interés se capitaliza en cada instante.".replace(/\$([^$]+)\$/g, function(m, t){ return K(t); })));
  app.appendChild(eb);

  var wrap = el("div"); wrap.style.marginTop = "20px"; app.appendChild(wrap);
  runMissions(wrap, FORMULA, "formula", function(card, m, idx, solved){ missionBody(card, m, solved, "Respuesta"); },
    {title: "🏁 Fase 2 completa", text: "Ya sabes armar $M=C\\,e^{r\\,t}$: tasa en decimal, exponente <strong>$r\\cdot t$</strong> y tecla $e^{x}$ sin redondear antes de tiempo. Ahora toca <strong>calcular montos e intereses</strong> en situaciones de la vida real."},
    "phase3", "Ir a Fase 3 →");
}

/* ============================================================
   FASE 3 — CALCULA HACIA ADELANTE (montos e intereses)
============================================================ */
function contQ(key, n, title, story, C, rPct, t, ask, tol, extraNote){
  var M = Mcont(C, rPct / 100, t), I = M - C, rt = rPct / 100 * t;
  return {key: key, tag: "Reto " + n + " de 6", title: title, story: story, C: C, r: rPct, t: t, ask: ask, ans: ask === "I" ? I : M, dec: 2, tol: tol,
    steps: [
      "<strong>Tasa en decimal:</strong> $r=\\dfrac{" + fmt(rPct, 2) + "}{100}=" + fmt(rPct / 100, 5) + "$.",
      "<strong>Exponente:</strong> $r\\cdot t=" + fmt(rPct / 100, 5) + "\\cdot" + t + "=" + fmt(rt, 5) + "$.",
      "<strong>Factor:</strong> con la tecla $e^{x}$ calcula $e^{" + fmt(rt, 5) + "}\\approx" + fmt(Math.exp(rt), 6) + "$ (no lo redondees).",
      "<strong>Monto:</strong> $M=" + solTex(C, 0) + "\\cdot" + fmt(Math.exp(rt), 6) + "$." + (ask === "I" ? " Al final resta el capital: $I=M-C$." : "")
    ],
    hint: "Calcula primero $r\\cdot t$, luego $e^{r\\,t}$ con la tecla $e^{x}$ (sin redondear) y multiplica por $C$." + (ask === "I" ? " Recuerda restar el capital al final." : ""),
    explain: "$M=" + solTex(C, 0) + "\\,e^{" + fmt(rt, 5) + "}\\approx$ <strong>" + sol(M) + "</strong>" + (ask === "I" ? " y el interés es $I=M-C\\approx$ <strong>" + sol(I) + "</strong>." : ".") + (extraNote ? " " + extraNote : "")};
}
var CALCULA = [
  contQ("k1", 1, "Ejemplo 2: el fondo de orientación", "Un centro de orientación psicológica deposita <strong>S/ 8 000</strong> al <strong>6 % anual</strong> con capitalización <strong>continua</strong> durante <strong>4 años</strong>. ¿Cuál es el monto?", 8000, 6, 4, "M"),
  contQ("k2", 2, "Caso 2: un año de reserva (Derecho)", "Un estudio jurídico reserva <strong>S/ 3 000</strong> al <strong>7.18 % anual</strong>, capitalización <strong>continua</strong>, durante <strong>1 año</strong>. ¿Cuál es el <strong>interés</strong> ganado?", 3000, 7.18, 1, "I", 0.011,
    "Si tu material muestra 223.33, es la misma respuesta con un redondeo distinto de $e^{x}$: aquí se acepta cualquiera de las dos."),
  contQ("k3", 3, "Caso 1: ahorro a 5 años", "Una asociación de familias deposita <strong>S/ 20 000</strong> al <strong>1.15 % anual</strong> con capitalización <strong>continua</strong>. ¿Cuál es el monto a los <strong>5 años</strong>?", 20000, 1.15, 5, "M"),
  contQ("k4", 4, "Caso 1: ahorro a 15 años", "Los mismos <strong>S/ 20 000</strong> al <strong>1.15 %</strong> continuo. ¿Cuál es el monto a los <strong>15 años</strong>?", 20000, 1.15, 15, "M", 0.2,
    "Si tu material dice 23 765.28, es la misma cifra con $e^{x}$ redondeado: aquí aceptamos ambas."),
  contQ("k5", 5, "Caso 1: a 20 años", "Los mismos <strong>S/ 20 000</strong> al <strong>1.15 %</strong> continuo. ¿Cuánto <strong>interés</strong> habrán generado en <strong>20 años</strong>?", 20000, 1.15, 20, "I"),
  {key:"k6", tag:"Reto 6 de 6", title:"¿Qué pesa más: la tasa o la frecuencia?",
   story:"Con <strong>S/ 20 000</strong> a <strong>5 años</strong>: el <strong>Banco A</strong> paga <strong>6 % anual</strong> capitalizado <strong>anualmente</strong> y el <strong>Banco B</strong> paga <strong>5.8 %</strong> capitalizado <strong>continuamente</strong>. Calcula mentalmente la idea: B capitaliza «lo máximo posible».",
   q:"¿Cuál da más dinero a los 5 años?",
   opts:["El Banco A: su tasa es mayor y eso pesa más que la frecuencia","El Banco B: continuo siempre gana","Empatan","No se puede saber sin conocer el nombre del banco"], correct:0,
   explain:"$M_A=20000\\,(1.06)^{5}\\approx" + solTex(Mcomp(20000, 0.06, 1, 5), 2) + "$ y $M_B=20000\\,e^{0.29}\\approx" + solTex(Mcont(20000, 0.058, 5), 2) + "$. A gana por <strong>" + sol(Mcomp(20000, 0.06, 1, 5) - Mcont(20000, 0.058, 5)) + "</strong>. <em>Capitalizar continuamente no compensa una tasa menor</em>: primero mira la tasa, luego la frecuencia."}
];

function renderPhase3(app){
  phaseHeader(app, 3, "Calcula hacia adelante: montos e intereses",
    "Aquí se entrena el hábito de un buen profesional: ordenar los datos, calcular sin redondear antes de tiempo y revisar si el resultado tiene sentido.");

  var lab = el("div", "panel");
  lab.innerHTML = '<h3>📈 Laboratorio: ¿cuánto se separa el continuo del anual?</h3>' +
    '<p>La curva <span style="color:var(--accent);font-weight:700;">violeta</span> es el crecimiento continuo y la <span style="color:var(--gold);font-weight:700;">dorada</span> el anual con la misma tasa. Al principio van juntas; con el tiempo se separan.</p>';
  app.appendChild(lab);
  var L = {c: 20000, r: 6, t: 15};
  var bh = el("div"); lab.appendChild(bh);
  function cont(x){ return L.c * Math.exp(L.r / 100 * x); }
  function anual(x){ return L.c * Math.pow(1 + L.r / 100, x); }
  var bd = ExpBoard(bh, {xr: [0, 30], yr: [0, 100000], curves: [{f: anual, color: "--gold"}, {f: cont}],
    points: [{x: function(){ return L.t; }, y: function(){ return anual(L.t); }, color: "--gold", size: 6}, {x: function(){ return L.t; }, y: function(){ return cont(L.t); }, color: "--accent", size: 6}]});
  var ctl = el("div", "slider-grid");
  ctl.innerHTML =
    '<div class="slider-row"><label for="p3_c">Capital <strong>C</strong> = <span class="slider-val" id="p3_cv">S/ 20 000</span></label><input type="range" id="p3_c" min="1000" max="100000" step="1000" value="20000"></div>' +
    '<div class="slider-row"><label for="p3_r">Tasa anual <strong>r</strong> = <span class="slider-val" id="p3_rv">6</span> %</label><input type="range" id="p3_r" min="1" max="20" step="0.5" value="6"></div>' +
    '<div class="slider-row"><label for="p3_t">Tiempo <strong>t</strong> = <span class="slider-val" id="p3_tv">15</span> años</label><input type="range" id="p3_t" min="1" max="30" step="1" value="15"></div>';
  lab.appendChild(ctl);
  var read = el("div", "lab-readout"); lab.appendChild(read);
  function labRead(){
    var a = anual(L.t), c = cont(L.t), top = c * 1.12;
    setBox(bd, 0, top, Math.max(L.t, 2), -top * 0.07); bd.update();
    read.innerHTML = 'A los <strong>' + L.t + ' años</strong>: <span style="color:var(--gold);font-weight:700;">anual ' + sol(a) + '</span> · <span style="color:var(--accent);font-weight:700;">continuo ' + sol(c) + '</span><br>' +
      'El continuo gana <strong>' + sol(c - a) + '</strong> más (' + fmt((c / a - 1) * 100, 2) + ' % extra). Sube la <strong>tasa</strong> y verás que esa ventaja crece mucho más rápido que subiendo el tiempo.';
  }
  ["c", "r", "t"].forEach(function(k){
    ctl.querySelector("#p3_" + k).addEventListener("input", function(ev){
      L[k] = parseFloat(ev.target.value);
      document.getElementById("p3_" + k + "v").textContent = k === "c" ? sol(L.c, 0) : L[k];
      labRead();
    });
  });
  labRead();

  var tools = el("div", "panel");
  tools.innerHTML = '<h3>🧮 Receta en 4 pasos</h3>' +
    '<ol class="th-list"><li>Pasa la tasa a <strong>decimal</strong> ($r$).</li><li>Calcula el <strong>exponente</strong> $r\\cdot t$.</li><li>Aplica la tecla <strong>$e^{x}$</strong> sin redondear.</li><li>Multiplica por $C$ y <strong>redondea solo al final</strong>.</li></ol>' +
    '<p>Abre la calculadora científica (también está en el botón flotante). Tiene la tecla $e^{x}$ y puedes pasar el resultado directo a tu respuesta.</p>';
  tools.innerHTML = tools.innerHTML.replace(/\$([^$]+)\$/g, function(m, t){ return K(t); });
  renderCalcButton(tools);
  app.appendChild(tools);

  var wrap = el("div"); wrap.style.marginTop = "20px"; app.appendChild(wrap);
  runMissions(wrap, CALCULA, "calcula", function(card, m, idx, solved){
    if(m.opts){ missionBody(card, m, solved); return; }
    card.appendChild(el("p", null, rich(m.story)));
    var chips = el("div", "given-chips");
    chips.innerHTML = '<span class="gchip">Capital <strong>' + sol(m.C, 0) + '</strong></span><span class="gchip">Tasa <strong>' + fmt(m.r, 2) + ' %</strong> anual</span><span class="gchip">Capitaliza <strong>continuamente</strong></span><span class="gchip">Tiempo <strong>' + m.t + (m.t === 1 ? ' año' : ' años') + '</strong></span>';
    card.appendChild(chips);
    var fx = el("div", "tex-block"); fx.innerHTML = KB("M=C\\,e^{r\\cdot t}"); card.appendChild(fx);
    if(!REVIEW){
      var d = document.createElement("details"); d.className = "peek";
      d.innerHTML = '<summary>🧭 Guía paso a paso (opcional)</summary><div class="peek-body"><ol class="th-list">' + m.steps.map(function(s){ return "<li>" + rich(s) + "</li>"; }).join("") + '</ol></div>';
      card.appendChild(d);
    }
    numCheck(card, {label: m.ask === "I" ? "Interés $I$ (S/, 2 decimales)" : "Monto $M$ (S/, 2 decimales)", ans: m.ans, dec: 2, tol: m.tol, hint: m.hint, explain: m.explain, onSolved: solved});
  }, {title: "🏁 Fase 3 completa", text: "Calculas montos e intereses continuos sin tropezar con el redondeo y sabes que <strong>la tasa pesa más que la frecuencia</strong>. Ahora viene lo contrario: <strong>retroceder en el tiempo</strong> (¿cuánto invertir hoy?)."},
  "phase4", "Ir a Fase 4 →");
}

/* ---- Navegación por pastillas entre ejercicios (para volver a los anteriores) ---- */
function navPills(parent, n, firstOpen, cur, isDone, onPick, prefix){
  var row = el("div", "case-pills");
  row.setAttribute("role", "navigation"); row.setAttribute("aria-label", "Ir a otro ejercicio");
  for(var i = 0; i < n; i++){
    (function(i){
      var b = document.createElement("button");
      b.type = "button";
      var done = isDone(i), locked = i > firstOpen;
      b.className = "cpill" + (i === cur ? " cur" : "") + (done ? " done" : "") + (locked ? " locked" : "");
      b.textContent = (done ? "✓ " : (locked ? "🔒 " : "")) + (prefix || "") + (i + 1);
      b.disabled = locked;
      b.setAttribute("aria-label", (prefix || "Ejercicio ") + (i + 1) + (done ? " (resuelto)" : locked ? " (bloqueado)" : ""));
      b.addEventListener("click", function(){ onPick(i); });
      row.appendChild(b);
    })(i);
  }
  parent.appendChild(row);
  return row;
}

/* ============================================================
   MOTOR DE CASOS CON DECISIÓN (fases 5 y 6)
   Cada caso: pasos interactivos (mcq / num) y un dictamen final.
============================================================ */
function runCases(app, cfg){
  var list = cfg.cases, pk = cfg.phaseKey;
  function firstOpen(){
    for(var i = 0; i < list.length; i++){ if(!isSolved(pk, list[i].key)) return i; }
    return list.length;
  }
  var idx = firstOpen(), step = 0, maxStep = 0;
  function enterCase(i){
    idx = i; step = 0; maxStep = 0;
    if(i < list.length && isSolved(pk, list[i].key)){ step = list[i].steps.length; maxStep = step; }
  }
  enterCase(idx);
  var container = el("div"); app.appendChild(container);
  function goStep(n){ step = n; renderCase(); }
  function advance(to){ maxStep = Math.max(maxStep, to); step = to; renderCase(); }
  function withReview(flag, fn){ var old = REVIEW; REVIEW = flag; try{ fn(); } finally { REVIEW = old; } }

  function renderCase(){
    container.innerHTML = "";
    navPills(container, list.length, Math.min(firstOpen(), list.length - 1), Math.min(idx, list.length - 1),
      function(i){ return isSolved(pk, list[i].key); }, function(i){ enterCase(i); renderCase(); }, "Caso ");
    if(idx >= list.length){
      var done = el("div", "mission-card solved");
      done.innerHTML = '<h4>' + mascotBadge("correct", 28, "mascot-inline") + cfg.doneTitle + '</h4><p>' + rich(cfg.doneText) + '</p>' +
        '<button class="btn primary sm" id="' + pk + '_after">' + cfg.nextLabel + '</button>';
      container.appendChild(done);
      done.querySelector("#" + pk + "_after").addEventListener("click", function(){ goTo(cfg.nextRoute); });
      return;
    }
    var cs = list[idx], nSteps = cs.steps.length;
    var isReview = step < maxStep;
    var card = el("div", "panel" + (cs.boss ? " boss-panel" : ""));
    card.innerHTML = '<h3 style="color:' + (cs.boss ? "var(--gold)" : "var(--accent)") + '">' + cs.emoji + ' ' + cs.context + (cs.boss ? ' 🏆' : '') + '</h3>' +
      '<p style="color:var(--ink-soft);">Caso ' + (idx + 1) + ' de ' + list.length + (cs.boss ? ' · ¡tu prueba final!' : '') + '</p>' +
      '<p>' + rich(cs.story) + '</p>' + (cs.offers ? offersHTML(cs.offers) : "");
    container.appendChild(card);

    var stepper = el("div", "stepper"); card.appendChild(stepper);
    cs.steps.concat([{label: "Dictamen"}]).forEach(function(s, i){
      var pill = document.createElement("button");
      pill.type = "button";
      pill.className = "step-pill" + (i === step ? " on" : "") + (i < maxStep ? " done" : "");
      pill.textContent = s.label; pill.disabled = i > maxStep;
      pill.addEventListener("click", function(){ goStep(i); });
      stepper.appendChild(pill);
    });
    var body = el("div"); card.appendChild(body);

    if(step < nSteps){
      var s = cs.steps[step];
      var isLast = step === nSteps - 1;
      var after = function(){
        if(isLast){ if(!isSolved(pk, cs.key)) markSolved(pk, cs.key); }
        setTimeout(function(){ advance(step + 1); }, 1300);
      };
      if(s.kind === "detect"){
        body.appendChild(el("p", null, "<strong>" + rich(s.q) + "</strong>"));
        detectStep(body, s, after, isReview);
      } else if(s.kind === "mcq"){
        body.appendChild(el("p", null, "<strong>" + rich(s.q) + "</strong>"));
        withReview(isReview, function(){ mcq(body, {options: s.opts, correct: s.correct, explain: s.explain, onSolved: after}); });
      } else {
        body.appendChild(el("p", null, rich(s.prompt)));
        if(!isReview){ var tl = el("div"); body.appendChild(tl); renderCalcButton(tl); }
        withReview(isReview, function(){ numCheck(body, {label: s.label2 || "Respuesta (S/)", ans: s.ans, dec: s.dec === undefined ? 2 : s.dec, tol: s.tol, hint: s.hint, explain: s.explain, onSolved: after, ansText: s.ansText}); });
      }
    } else {
      var v = el("div", "mission-card solved" + (cs.boss ? " boss-panel" : "")); v.style.marginBottom = "14px";
      v.innerHTML = '<h4>' + (cs.boss ? mascotBadge("certificate", 32, "mascot-inline") + '🏆 Dictamen del jefe final' : '⚖️ Dictamen') + '</h4><p>' + rich(cs.verdict) + '</p>';
      body.appendChild(v);
      if(cs.boss && typeof dictamenCard === "function") dictamenCard(body, cs);
      var nb = el("button", "btn primary sm", idx === list.length - 1 ? cfg.nextLabel : "Siguiente caso →"); nb.type = "button";
      nb.addEventListener("click", function(){
        if(idx >= list.length - 1){ goTo(cfg.nextRoute); return; }
        enterCase(idx + 1); renderCase(); window.scrollTo({top: 0, behavior: "smooth"});
      });
      body.appendChild(nb);
    }
    var nav = el("div", "step-nav");
    var pb = el("button", "btn ghost sm", "← Anterior"); pb.type = "button"; pb.disabled = step === 0;
    pb.addEventListener("click", function(){ if(step > 0) goStep(step - 1); });
    nav.appendChild(pb);
    if(isReview && step < nSteps){
      var nx = el("button", "btn primary sm", "Siguiente →"); nx.type = "button";
      nx.addEventListener("click", function(){ goStep(step + 1); });
      nav.appendChild(nx);
    } else nav.appendChild(el("span"));
    card.appendChild(nav);
  }
  renderCase();
}
/* Tarjetas «Opción A / Opción B» con los datos de cada oferta */
function offersHTML(offers){
  return '<div class="offers">' + offers.map(function(o){
    return '<div class="offer"><span class="offer-tag">' + o.tag + '</span><strong>' + o.name + '</strong><span>' + rich(o.desc) + '</span></div>';
  }).join("") + '</div>';
}
function mcqStep(label, q, good, bad, explain){
  var opts = [good].concat(bad);
  return {label: label, kind: "mcq", q: q, opts: opts, correct: 0, explain: explain};
}
function numStep(label, prompt, ans, dec, hint, explain, label2){
  return {label: label, kind: "num", prompt: prompt, ans: ans, dec: dec, hint: hint, explain: explain, label2: label2};
}


/* ---- Detector de ofertas exageradas: el estudiante marca cada promesa como posible o exagerada ---- */
function detectStep(body, s, after, isReview){
  var items = s.items, state = items.map(function(){ return null; });
  var box = el("div", "detector");
  body.appendChild(box);
  var fb = feedbackBox(body);
  function paint(){
    box.innerHTML = "";
    items.forEach(function(it, i){
      var row = el("div", "det-item" + (state[i] === true ? " ok" : (state[i] === "bad" ? " no" : "")));
      var max = it.C * Math.exp(it.r / 100 * it.t);
      row.innerHTML = '<div class="det-claim"><span class="det-n">' + (i + 1) + '</span><span>' + rich(it.text) + '</span></div>';
      if(window.__ICTEST) row.setAttribute("data-ex", it.exagerada ? "1" : "0");
      var act = el("div", "det-actions");
      if(isReview || state[i] === true){
        act.innerHTML = '<span class="det-res ' + (it.exagerada ? "no" : "ok") + '">' + (it.exagerada ? "🚩 Exagerada" : "✅ Posible") + ' · máximo ' + sol(max) + '</span>';
      } else {
        [["ok", "✅ Posible"], ["no", "🚩 Exagerada"]].forEach(function(b){
          var btn = el("button", "btn sm ghost", b[1]); btn.type = "button";
          btn.addEventListener("click", function(){
            var guessEx = b[0] === "no";
            if(guessEx === it.exagerada){
              state[i] = true; paint();
              if(state.every(function(v){ return v === true; })){
                fb.ok("✅ " + (s.explain || "¡Detector perfecto!"));
                after();
              } else fb.clear();
            } else {
              state[i] = "bad"; paint();
              fb.bad("Revisa el máximo posible: $C\\,e^{r\\,t}=" + solTex(it.C, 0) + "\\,e^{" + fmt(it.r / 100 * it.t, 3) + "}\\approx" + solTex(max, 2) + "$. ¿La promesa lo supera?");
              setTimeout(function(){ state[i] = null; paint(); }, 1500);
            }
          });
          act.appendChild(btn);
        });
      }
      row.appendChild(act);
      box.appendChild(row);
    });
  }
  paint();
  if(isReview) box.appendChild(el("div", "reveal-box", "✅ " + rich(s.explain || "")));
}

/* ============================================================
   FASE 4 — RETROCEDE EN EL TIEMPO (valor presente continuo)
============================================================ */
var V_EJ4 = {M: 5000, r: 6.13, t: 3}, V_C3 = {M: 5000, r: 6.17, t: 2}, V_C5 = {M: 6000, r: 5.08, t: 1}, V_REP = {M: 30000, r: 4, t: 5}, V_C4 = {M: 3000, r: 5.15, t: 3};
function pvQ(key, n, title, story, o, ask, tol, extraNote){
  var C = pvCont(o.M, o.r / 100, o.t), rt = o.r / 100 * o.t;
  return {key: key, tag: "Reto " + n + " de 6", title: title, story: story, prompt: ask, ans: C, dec: 2, tol: tol,
    hint: "Calcula $r\\cdot t=" + fmt(rt, 5) + "$, luego $e^{-" + fmt(rt, 5) + "}$ (tecla $e^{x}$ con signo menos) y multiplica por $" + solTex(o.M, 0) + "$. También sirve dividir: $\\dfrac{" + solTex(o.M, 0) + "}{e^{" + fmt(rt, 5) + "}}$.",
    explain: "$C=" + solTex(o.M, 0) + "\\,e^{-" + fmt(rt, 5) + "}\\approx$ <strong>" + sol(C) + "</strong>. Hoy basta depositar menos que la meta: el banco pone la diferencia (" + sol(o.M - C) + ")." + (extraNote ? " " + extraNote : ""),
    label: "Depósito de hoy $C$ (S/)"};
}
var VALOR = [
  {key:"v1", tag:"Reto 1 de 6", title:"¿Hacia adelante o hacia atrás?",
   story:"Hasta ahora conocías el capital y calculabas el monto. Una clienta dice: «Necesito <strong>S/ 5 000</strong> dentro de <strong>3 años</strong> para pagar mi maestría. ¿Cuánto debo depositar <strong>hoy</strong>?». El banco capitaliza <strong>continuamente</strong>.",
   q:"¿Qué se busca y cómo se calcula?",
   opts:["El capital $C$ (valor presente): $C=M\\,e^{-r\\,t}$, es decir, <strong>se divide</strong> entre $e^{r\\,t}$","El monto $M$: se multiplica por $e^{r\\,t}$","El capital $C$: se <strong>suma</strong> $e^{r\\,t}$ al monto","La tasa $r$: se multiplica la meta por el tiempo"], correct:0,
   explain:"Despejando $C$ de $M=C\\,e^{r\\,t}$ queda $C=\\dfrac{M}{e^{r\\,t}}=M\\,e^{-r\\,t}$. Para <strong>retroceder</strong> en el tiempo se divide (o se usa exponente negativo)."},
  pvQ("v2", 2, "Ejemplo 4: la maestría de Valeria", "Valeria necesita <strong>S/ 5 000</strong> dentro de <strong>3 años</strong> para su maestría en Psicología Clínica. Su banco paga <strong>6.13 % anual</strong> con capitalización <strong>continua</strong>.", V_EJ4, "¿Cuánto debe depositar hoy? (S/, 2 decimales)"),
  pvQ("v3", 3, "Caso 3: la fianza (Derecho)", "Un abogado debe tener <strong>S/ 5 000</strong> en <strong>2 años</strong> para una fianza. La cooperativa paga <strong>6.17 % anual</strong>, capitalización <strong>continua</strong>.", V_C3, "¿Cuánto debe depositar hoy? (S/, 2 decimales)", 0.04, "Si en tu material aparece 4 419.58, es la misma respuesta con $e^{x}$ redondeado: aquí aceptamos ambas."),
  pvQ("v4", 4, "Caso 5: el taller de un año", "Un colegio quiere reunir <strong>S/ 6 000</strong> en <strong>1 año</strong> para un taller de habilidades socioemocionales. Tasa: <strong>5.08 % anual</strong>, capitalización <strong>continua</strong>.", V_C5, "¿Cuánto debe depositar hoy? (S/, 2 decimales)"),
  pvQ("v5", 5, "La reparación civil (Derecho)", "Un estudio debe pagar <strong>S/ 30 000</strong> de reparación civil dentro de <strong>5 años</strong>. Invierte hoy al <strong>4 % anual</strong>, capitalización <strong>continua</strong>.", V_REP, "¿Cuánto debe depositar hoy? (S/, 2 decimales)"),
  {key:"v6", tag:"Reto 6 de 6", title:"Detective: ¿sumar o dividir?", detective:true,
   story:"Mariana necesita <strong>S/ 3 000</strong> en <strong>3 años</strong> (tasa <strong>5.15 %</strong> continua). Su compañero calcula $3000\\,e^{0.1545}\\approx3\\,502$ y dice: «deposita S/ 3 502». Ella desconfía: ¡tendría que depositar <em>más</em> de lo que necesita!",
   prompt:"Corrige el error y calcula el depósito correcto de hoy (S/, 2 decimales).",
   ans:pvCont(V_C4.M, V_C4.r / 100, V_C4.t), dec:2, tol:0.06, label:"Depósito de hoy $C$ (S/)",
   hint:"Para retroceder hay que <strong>dividir</strong> entre $e^{0.1545}$ (o multiplicar por $e^{-0.1545}$), no multiplicar.",
   explain:"$C=3000\\,e^{-0.1545}\\approx$ <strong>S/ 2 570.53</strong>. Señal de alerta: si pides valor presente, el depósito debe ser <em>menor</em> que la meta. (Si tu guía muestra 2 570.48, es la misma cifra con $e^{x}$ redondeado.)"}
];

function lnBox(parent){
  var d = document.createElement("details");
  d.className = "peek ln-box";
  d.innerHTML = '<summary>🔭 Mirada a la Semana 14 (opcional, no se califica)</summary><div class="peek-body">' + rich(
    '<p>Hasta aquí conocías el tiempo $t$ y buscabas $M$ o $C$. ¿Y si preguntamos <strong>cuánto tiempo tarda</strong>? Necesitamos «deshacer» la $e$: para eso existe el <strong>logaritmo natural</strong> $\\ln$ (tecla <span class="mono">ln</span> de tu calculadora).</p>' +
    '<p><strong>Ejemplo:</strong> S/ 20 000 al $6.85\\,\\%$ continuo. ¿Cuándo llegan a S/ 45 000?</p>' +
    '<p>$45000=20000\\,e^{0.0685\\,t}\;\\Rightarrow\;2.25=e^{0.0685\\,t}\;\\Rightarrow\;t=\\dfrac{\\ln(2.25)}{0.0685}\\approx\\mathbf{' + fmt(Math.log(2.25) / 0.0685, 2) + '}$ años.</p>' +
    '<p class="progress-note">Es solo una mirada: la Semana 13 (logaritmos) y la 14 (tiempo de interés) lo trabajan a fondo. Aquí no hay nada que calcular.</p>') + '</div>';
  parent.appendChild(d);
}

function renderPhase4(app){
  phaseHeader(app, 4, "Retrocede en el tiempo: ¿cuánto invertir hoy?",
    "El modelo continuo también funciona <strong>hacia atrás</strong>: si conoces tu meta y la tasa, puedes calcular cuánto depositar hoy. Es la pregunta de cualquier asesor financiero.");

  var lab = el("div", "panel");
  lab.innerHTML = '<h3>🎯 Laboratorio: ¿cuánto invertir hoy?</h3><p>Fija una meta y mira cómo el valor de hoy <strong>baja</strong> cuanto más lejos está la meta. La curva muestra el depósito necesario según el plazo.</p>';
  app.appendChild(lab);
  var L = {m: 100000, r: 6, t: 8};
  var bh = el("div"); lab.appendChild(bh);
  function pv(x){ return L.m * Math.exp(-L.r / 100 * x); }
  var bd = ExpBoard(bh, {xr: [0, 30], yr: [0, 100000], curves: [{f: pv}], hlines: [{y: function(){ return L.m; }, color: "--formula"}],
    points: [{x: function(){ return L.t; }, y: function(){ return pv(L.t); }, color: "--gold", size: 6}]});
  var ctl = el("div", "slider-grid");
  ctl.innerHTML =
    '<div class="slider-row"><label for="p4_m">Meta <strong>M</strong> = <span class="slider-val" id="p4_mv">S/ 100 000</span></label><input type="range" id="p4_m" min="10000" max="500000" step="10000" value="100000"></div>' +
    '<div class="slider-row"><label for="p4_r">Tasa anual = <span class="slider-val" id="p4_rv">6</span> %</label><input type="range" id="p4_r" min="1" max="15" step="0.5" value="6"></div>' +
    '<div class="slider-row"><label for="p4_t">Plazo = <span class="slider-val" id="p4_tv">8</span> años</label><input type="range" id="p4_t" min="1" max="30" step="1" value="8"></div>';
  lab.appendChild(ctl);
  var out = el("div", "lab-readout"); lab.appendChild(out);
  function labRead(){
    var C = pv(L.t);
    setBox(bd, 0, L.m * 1.12, 30, -L.m * 0.07); bd.update();
    out.innerHTML = K("C=M\\,e^{-r\\,t}") + '<br>Para tener <strong>' + sol(L.m, 0) + '</strong> en ' + L.t + ' años necesitas depositar hoy <strong>' + sol(C) + '</strong> (' + Math.round(C / L.m * 100) + ' % de la meta).<br>El banco aporta <strong>' + sol(L.m - C) + '</strong> en intereses. La línea punteada es la meta.';
  }
  ["m", "r", "t"].forEach(function(k){
    ctl.querySelector("#p4_" + k).addEventListener("input", function(ev){
      L[k] = parseFloat(ev.target.value);
      document.getElementById("p4_" + k + "v").textContent = k === "m" ? sol(L.m, 0) : L[k];
      labRead();
    });
  });
  labRead();
  lnBox(lab);

  var wrap = el("div"); wrap.style.marginTop = "20px"; app.appendChild(wrap);
  runMissions(wrap, VALOR, "valor", function(card, m, idx, solved){
    if(m.opts){ missionBody(card, m, solved); return; }
    card.appendChild(el("p", null, rich(m.story)));
    if(!REVIEW && !m.detective){
      var d = document.createElement("details"); d.className = "peek";
      d.innerHTML = '<summary>🧭 Guía paso a paso (opcional)</summary><div class="peek-body"><ol class="th-list"><li>Pasa la tasa a decimal.</li><li>Calcula $r\\cdot t$.</li><li>Calcula $e^{-r\\,t}$ (o $e^{r\\,t}$ y divide).</li><li>Multiplica por la meta $M$.</li></ol></div>'.replace(/\$([^$]+)\$/g, function(mm, t){ return K(t); });
      card.appendChild(d);
    }
    card.appendChild(el("p", null, rich(m.prompt)));
    numCheck(card, {label: m.label, ans: m.ans, dec: m.dec, tol: m.tol, hint: m.hint, explain: m.explain, onSolved: solved});
  }, {title: "🏁 Fase 4 completa", text: "Ya proyectas hacia adelante <em>y hacia atrás</em>: $C=M\\,e^{-r\\,t}$. Ahora llega lo más parecido a tu vida profesional: <strong>comparar ofertas y decidir</strong>, incluso detectar las que prometen demasiado."},
  "phase5", "Ir a Fase 5 →");
}

/* ============================================================
   FASE 5 — DECIDE (comparar, detectar ofertas exageradas, valor presente)
============================================================ */
var DEC1 = {C: 40000, r: 0.06, t: 10};
var DEC3 = {C: 18000, t: 4};
var DEC4 = {M: 80000, r: 0.05, t: 6, offer: 55000};
var DEC5 = {C: 25000, r: 0.055, t: 3};
var DETECT_ITEMS = [
  {C: 10000, r: 5, t: 4, text: "«Deposita <strong>S/ 10 000</strong> al 5 % <em>continuo</em> y en <strong>4 años</strong> tendrás <strong>S/ 12 000</strong>.»", exagerada: false},
  {C: 10000, r: 6, t: 5, text: "«Con el 6 % <em>continuo</em>, tus <strong>S/ 10 000</strong> se <strong>duplican</strong> (S/ 20 000) en <strong>5 años</strong>.»", exagerada: true},
  {C: 10000, r: 8, t: 10, text: "«Con el 8 % <em>continuo</em>, en <strong>10 años</strong> tus <strong>S/ 10 000</strong> llegan a <strong>S/ 22 000</strong>.»", exagerada: false},
  {C: 10000, r: 3, t: 20, text: "«Al 3 % <em>continuo</em>, tus <strong>S/ 10 000</strong> llegan a <strong>S/ 20 000</strong> en <strong>20 años</strong>.»", exagerada: true}
];
var DECIDE = [
  {key:"x1", emoji:"⚖️", context:"Estudio Rojas: ¿anual o continuo?",
   story:"El estudio jurídico <strong>Rojas &amp; Asociados</strong> reserva <strong>S/ 40 000</strong> para un sistema de gestión documental durante <strong>10 años</strong>. Dos entidades anuncian la <strong>misma tasa</strong> del <strong>6 %</strong>, pero capitalizan distinto.",
   offers:[{tag:"A", name:"Banco A", desc:"6 % anual · capitaliza <strong>anualmente</strong>"}, {tag:"B", name:"Banco B", desc:"6 % anual · capitaliza <strong>continuamente</strong>"}],
   steps:[
     mcqStep("1. Lee", "¿Cuál es la fórmula del Banco B?", "$M=40000\\,e^{0.06\\cdot10}=40000\\,e^{0.6}$", ["$M=40000\\,(1.06)^{10}$","$M=40000\\,e^{0.06+10}$","$M=40000\\left(1+\\dfrac{0.06}{10}\\right)^{10}$"], "«Continuamente» pide $M=C\\,e^{r\\,t}$ con $r\\cdot t=0.06\\cdot10=0.6$. La fórmula $(1.06)^{10}$ es la del Banco A."),
     numStep("2. Banco A", "Calcula el monto con el <strong>Banco A</strong> (capitalización anual).", Mcomp(DEC1.C, DEC1.r, 1, DEC1.t), 2, "$1.06^{10}\\approx1.790848$; multiplica por $40000$.", "$M_A=40000\\,(1.06)^{10}\\approx$ <strong>S/ 71 633.91</strong>."),
     numStep("3. Banco B", "Calcula el monto con el <strong>Banco B</strong> (continuo).", Mcont(DEC1.C, DEC1.r, DEC1.t), 2, "$e^{0.6}\\approx1.822119$; multiplica por $40000$.", "$M_B=40000\\,e^{0.6}\\approx$ <strong>S/ 72 884.75</strong>."),
     mcqStep("4. Decide", "¿Qué le recomiendas al estudio?", "El Banco B: gana " + sol(Mcont(DEC1.C, DEC1.r, DEC1.t) - Mcomp(DEC1.C, DEC1.r, 1, DEC1.t)) + " más con la misma tasa anunciada", ["El Banco A: capitalizar poco es más seguro","Es indiferente: ambos anuncian 6 %","El Banco B, pero solo gana unos S/ 12"], "$72\\,884.75-71\\,633.91=$ <strong>S/ 1 250.84</strong> a favor de B. Con la misma tasa nominal, capitalizar continuamente da el máximo.")
   ],
   verdict:"Dictamen: <strong>Banco B (continuo)</strong>. A igual tasa anunciada, termina con S/ 72 884.75 frente a S/ 71 633.91 (<strong>+S/ 1 250.84</strong>). Aun así, ningún banco real capitaliza «de verdad» en cada instante: el continuo marca el <em>techo</em>."},
  {key:"x2", emoji:"🚩", context:"Detector de ofertas exageradas",
   story:"La oficina de <strong>Defensa del Consumidor</strong> recibió volantes de cooperativas que prometen ganancias con capitalización continua. Tu trabajo: separar lo <strong>posible</strong> de lo <strong>exagerado</strong>. Pista: nadie puede superar el techo $C\\,e^{r\\,t}$.",
   steps:[
     mcqStep("1. Lee", "¿Cómo sabes si una promesa de monto final es posible?", "Si no supera el máximo $C\\,e^{r\\,t}$ de la capitalización continua", ["Si la cooperativa tiene buena publicidad","Si el monto prometido es un número redondo","Si el contrato es largo"], "El modelo continuo es el <strong>límite</strong> de todas las capitalizaciones: con tasa $r$ y tiempo $t$ ningún banco puede dar más de $C\\,e^{r\\,t}$ (a menos que mienta o cobre en otro lado)."),
     numStep("2. Calcula", "¿Cuál es el <strong>monto máximo</strong> de S/ 10 000 al 6 % continuo en 5 años?", Mcont(10000, 0.06, 5), 2, "$e^{0.3}\\approx1.349859$; multiplica por $10000$.", "$M=10000\\,e^{0.3}\\approx$ <strong>S/ 13 498.59</strong>: ni de lejos los S/ 20 000 prometidos.", "Máximo (S/) ="),
     {label: "3. Detecta", kind: "detect", q: "Marca cada promesa del volante como posible o exagerada (S/ 10 000 de capital en todas).", items: DETECT_ITEMS,
      explain: "Las promesas 1 y 3 caben bajo el techo ($12\\,214$ y $22\\,255$); la 2 (máx. $13\\,499$) y la 4 (máx. $18\\,221$) <strong>superan el techo</strong>."},
     mcqStep("4. Decide", "Un cliente quiere invertir por la promesa 2 («se duplican en 5 años al 6 %»). ¿Qué le dices?", "Que es exagerada: aun con capitalización continua el máximo es unos S/ 13 499; pida el contrato y desconfíe", ["Que invierta: la capitalización continua duplica todo","Que invierta si la oferta es de una cooperativa","Que no importa la tasa, solo el nombre"], "Para <strong>duplicar</strong> en 5 años hace falta $e^{5r}=2$, es decir $r\\approx13.9\\,\\%$ continuo, no 6 %. (Eso lo calcularás con $\\ln$ en la Semana 14.)")
   ],
   verdict:"Dictamen: las promesas 2 y 4 son <strong>exageradas</strong>: superan el techo $C\\,e^{r\\,t}$. Un profesional del Derecho o de la Psicología que asesora a otras personas <em>verifica el máximo posible</em> antes de creer una promesa de rentabilidad."},
  {key:"x3", emoji:"🧠", context:"Clínica Brújula: la tasa más baja que gana",
   story:"La clínica psicológica <strong>Brújula</strong> invertirá <strong>S/ 18 000</strong> durante <strong>4 años</strong>. <strong>Opción A:</strong> 7 % anual capitalizado <em>anualmente</em>. <strong>Opción B:</strong> 6.8 % anual capitalizado <em>continuamente</em>. Parece que A es mejor porque su número es más alto… ¿lo es?",
   offers:[{tag:"A", name:"Opción A", desc:"7 % anual · capitalización anual"}, {tag:"B", name:"Opción B", desc:"6.8 % anual · capitalización continua"}],
   steps:[
     mcqStep("1. Predice", "Antes de calcular, ¿qué debes comparar?", "Los montos finales de A y de B (tasa y forma de capitalizar a la vez)", ["Solo el número más alto: 7 % le gana a 6.8 %","Solo la forma de capitalizar","Nada: son iguales"], "La tasa nominal sola no decide: importan <strong>tasa y capitalización juntas</strong>."),
     numStep("2. Opción A", "Calcula el monto de la <strong>opción A</strong>.", Mcomp(DEC3.C, 0.07, 1, DEC3.t), 2, "$18000\\,(1.07)^{4}$.", "$M_A=18000\\,(1.07)^{4}\\approx$ <strong>S/ 23 594.33</strong>."),
     numStep("3. Opción B", "Calcula el monto de la <strong>opción B</strong>.", Mcont(DEC3.C, 0.068, DEC3.t), 2, "$r\\cdot t=0.068\\cdot4=0.272$ y luego $18000\\,e^{0.272}$.", "$M_B=18000\\,e^{0.272}\\approx$ <strong>S/ 23 626.57</strong>."),
     mcqStep("4. Decide", "¿Qué conviene a la clínica?", "La B: aunque su tasa anunciada es menor, termina con " + sol(Mcont(DEC3.C, 0.068, DEC3.t) - Mcomp(DEC3.C, 0.07, 1, DEC3.t)) + " más", ["La A: 7 % es mayor que 6.8 %","Son idénticas","La A, por " + sol(100)], "$23\\,626.57-23\\,594.33=$ <strong>S/ 32.24</strong> a favor de B. Una tasa continua del $6.8\\,\\%$ equivale a una tasa anual de $e^{0.068}-1\\approx7.04\\,\\%$: ¡mayor que 7 %! (En la fase 6 la llamaremos <em>tasa efectiva</em>.)")
   ],
   verdict:"Dictamen: <strong>opción B</strong>. Aunque anuncia 6.8 % frente a 7 %, el crecimiento continuo equivale a ≈ 7.04 % anual y deja S/ 32.24 más. <em>Compara siempre montos finales, no solo porcentajes anunciados.</em>"},
  {key:"x4", emoji:"⚖️", context:"La obligación a seis años: ¿aceptar el pago adelantado?",
   story:"Un cliente de tu estudio debe recibir <strong>S/ 80 000</strong> dentro de <strong>6 años</strong>. La contraparte le ofrece pagar <strong>hoy S/ 55 000</strong> y cerrar el asunto. El dinero hoy puede invertirse al <strong>5 % anual</strong> con capitalización <strong>continua</strong>.",
   offers:[{tag:"Datos", name:"Obligación", desc:"S/ 80 000 en 6 años · 5 % continuo"}, {tag:"Oferta", name:"Pago adelantado", desc:"S/ 55 000 hoy"}],
   steps:[
     mcqStep("1. Plantea", "Para comparar S/ 55 000 de hoy con S/ 80 000 de dentro de 6 años, ¿qué calculas?", "El <strong>valor presente</strong> de los S/ 80 000: $C=80000\\,e^{-0.05\\cdot6}$", ["El monto de los S/ 55 000: $55000\\,e^{0.3}$ y se suma a 80 000","La resta $80000-55000$","El doble de 55 000"], "Para comparar dinero en fechas distintas se lleva todo al <strong>mismo momento</strong>. Aquí, traer a hoy los S/ 80 000."),
     numStep("2. Valor presente", "Calcula cuánto valen <strong>hoy</strong> los S/ 80 000 de dentro de 6 años.", pvCont(DEC4.M, DEC4.r, DEC4.t), 2, "$e^{-0.3}\\approx0.740818$; multiplica por $80000$.", "$C=80000\\,e^{-0.3}\\approx$ <strong>S/ 59 265.46</strong>."),
     numStep("3. Diferencia", "¿Cuántos soles <strong>menos</strong> ofrece la contraparte respecto al valor presente?", pvCont(DEC4.M, DEC4.r, DEC4.t) - DEC4.offer, 2, "Resta $55000$ al valor presente que hallaste.", "$59\\,265.46-55\\,000=$ <strong>S/ 4 265.46</strong> de pérdida para tu cliente."),
     mcqStep("4. Decide", "¿Qué recomiendas?", "No aceptar: S/ 55 000 hoy valen menos que la obligación; negociar al menos cerca de S/ 59 265", ["Aceptar: recibir dinero hoy siempre conviene","Aceptar: 55 000 es más de la mitad de 80 000","Indiferente: ambos son lo mismo"], "Un descuento es razonable solo si no supera lo que el dinero ganaría en el tiempo. Aquí piden un descuento <strong>mayor</strong> al valor presente.")
   ],
   verdict:"Dictamen: <strong>no aceptar</strong> la oferta de S/ 55 000. El valor presente de la obligación es S/ 59 265.46: aceptar implicaría perder S/ 4 265.46 de valor. Contraoferta sugerida: alrededor de S/ 59 000."},
  {key:"x5", emoji:"🧠⚖️", context:"El estudio de salud mental mientras llegan los permisos",
   story:"Un equipo de investigación recibe <strong>S/ 25 000</strong> para un estudio sobre salud mental en adolescentes, pero los permisos tardan <strong>3 años</strong>. El banco paga <strong>5.5 % anual</strong> con capitalización <strong>continua</strong>. Los instrumentos de evaluación cuestan <strong>S/ 4 000</strong> más de lo presupuestado.",
   offers:[{tag:"Datos", name:"Depósito", desc:"S/ 25 000 · 5.5 % continuo · 3 años"}],
   steps:[
     numStep("1. Lee", "Calcula el exponente $r\\cdot t$.", 0.165, 3, "Tasa en decimal $0.055$ por $3$ años.", "$r\\cdot t=0.055\\cdot3=0.165$.", "$r\\cdot t$ ="),
     numStep("2. Monto", "Calcula el monto $M$ al cabo de los 3 años.", Mcont(DEC5.C, DEC5.r, DEC5.t), 2, "$25000\\,e^{0.165}$.", "$M=25000\\,e^{0.165}\\approx$ <strong>S/ 29 484.83</strong>."),
     numStep("3. Interés", "Calcula el <strong>interés generado</strong> $I=M-C$.", Mcont(DEC5.C, DEC5.r, DEC5.t) - DEC5.C, 2, "Resta los S/ 25 000 iniciales al monto.", "$I\\approx$ <strong>S/ 4 484.83</strong>: dinero que «se gana solo» durante la espera."),
     mcqStep("4. Decide", "¿Alcanza el interés para cubrir los S/ 4 000 extra de los instrumentos?", "Sí: alcanza y sobran unos S/ 484.83", ["No: faltan unos S/ 484.83","Justo: S/ 4 000 exactos","No se puede saber"], "$4\\,484.83-4\\,000=$ <strong>S/ 484.83</strong> de sobra. (Con capitalización trimestral habrías ganado unos S/ 33 menos: el continuo es el máximo.)")
   ],
   verdict:"Dictamen: el depósito genera <strong>S/ 4 484.83</strong> de interés en 3 años, suficiente para cubrir los instrumentos (S/ 4 000) con S/ 484.83 de margen. Esperar la autorización <em>no fue tiempo perdido</em>: el dinero trabajó."}
];

function renderPhase5(app){
  phaseHeader(app, 5, "Decide: compara, detecta y asesora",
    "Ahora te toca asesorar. Cada caso trae datos, cálculos y un dictamen. Aquí aparece también el <strong>detector de ofertas exageradas</strong>: ¿promesa posible o publicidad engañosa?");
  runCases(app, {cases: DECIDE, phaseKey: "decide",
    doneTitle: "🏁 Fase 5 completa", doneText: "Ya comparas ofertas, detectas promesas que superan el techo y decides con valor presente. Solo falta el <strong>dictamen final</strong>: casos completos con la tasa efectiva y un jefe final.",
    nextRoute: "phase6", nextLabel: "Ir a Fase 6 →"});
}
var PHASE_RENDERERS = {1:renderPhase1, 2:renderPhase2, 3:renderPhase3, 4:renderPhase4, 5:renderPhase5, 6:renderPhase6};

/* ============================================================
   FASE 6 — DICTAMEN (casos integrales + jefe final)
============================================================ */
var J1 = {C: 80000, t: 6};
var J2 = {M: 45000, r: 0.072, t: 5};
var J3 = {C: 50000, t: 8};
var J4 = {C: 150000, t: 8};
var JA = Mcomp(J1.C, 0.062, 1, J1.t), JB = Mcont(J1.C, 0.06, J1.t), JC = Mcomp(J1.C, 0.059, 12, J1.t);
var PA = pvCont(J2.M, J2.r, J2.t), PB = pvDisc(J2.M, J2.r, 1, J2.t);
var TEA_D = Math.exp(0.06) - 1, TEA_E = 0.0615;
var KD = Mcont(J3.C, 0.06, J3.t), KE = Mcomp(J3.C, TEA_E, 1, J3.t);
var BA = Mcomp(J4.C, 0.045, 360, J4.t), BB = Mcont(J4.C, 0.0455, J4.t), BC = Mcomp(J4.C, 0.047, 1, J4.t);
var DICTAMEN = [
  {key:"j1", emoji:"⚖️", context:"Reserva para la familia Quispe (reparación civil)",
   story:"Una abogada debe invertir <strong>S/ 80 000</strong> de una reparación civil durante <strong>6 años</strong>. Tres entidades responden. Cuidado: la que capitaliza «continuamente» <em>no siempre</em> es la mejor.",
   offers:[{tag:"A", name:"Caja Andina", desc:"6.2 % anual · capitaliza <strong>anualmente</strong>"}, {tag:"B", name:"Cooperativa Sol", desc:"6.0 % anual · capitaliza <strong>continuamente</strong>"}, {tag:"C", name:"Banco Nuevo", desc:"5.9 % anual · capitaliza <strong>mensualmente</strong>"}],
   steps:[
     mcqStep("1. Predice", "Antes de calcular: ¿cuál modelo usarás en cada oferta?", "A: $C(1+r)^{t}$ · B: $C\\,e^{r\\,t}$ · C: $C\\left(1+\\frac{r}{12}\\right)^{12t}$", ["Las tres con $C\\,e^{r\\,t}$","Las tres con $C(1+r)^{t}$","A con $e^{r\\,t}$ y B con $(1+r)^{t}$"], "Cada oferta dice cómo capitaliza: <strong>anual</strong> → $(1+r)^{t}$; <strong>continua</strong> → $e^{r\\,t}$; <strong>mensual</strong> → $\\left(1+\\frac{r}{12}\\right)^{12t}$."),
     numStep("2. Oferta A", "Calcula el monto de la <strong>Caja Andina</strong> (A).", JA, 2, "$M=80000\\,(1.062)^{6}$.", "$M_A\\approx$ <strong>" + sol(JA) + "</strong>."),
     numStep("3. Oferta B", "Calcula el monto de la <strong>Cooperativa Sol</strong> (B, continua).", JB, 2, "$r\\cdot t=0.06\\cdot6=0.36$ y luego $80000\\,e^{0.36}$.", "$M_B=80000\\,e^{0.36}\\approx$ <strong>" + sol(JB) + "</strong>."),
     numStep("4. Oferta C", "Calcula el monto del <strong>Banco Nuevo</strong> (C, mensual).", JC, 2, "Mensual: base $1+\\frac{0.059}{12}$ sin redondear, exponente $72$.", "$M_C=80000\\left(1+\\dfrac{0.059}{12}\\right)^{72}\\approx$ <strong>" + sol(JC) + "</strong>."),
     mcqStep("5. Dictamina", "¿Qué recomiendas?", "La Caja Andina (A): su tasa más alta compensa que capitalice una sola vez al año", ["La Cooperativa Sol (B): el continuo siempre gana","El Banco Nuevo (C): capitaliza mensualmente","Cualquiera: las tres rinden lo mismo"], "A rinde " + sol(JA) + ", B " + sol(JB) + " y C " + sol(JC) + ". La mejor es A, por " + sol(JA - JB) + " sobre B. <strong>Continuar la capitalización no compensa una tasa menor.</strong>")
   ],
   verdict:"Dictamen: se recomienda la <strong>Caja Andina</strong>. A 6 años, la reparación civil llegaría a " + sol(JA) + ", frente a " + sol(JB) + " (Cooperativa Sol, continua) y " + sol(JC) + " (Banco Nuevo). <em>Una tasa nominal mayor puede ganarle a una mayor frecuencia de capitalización, aun la continua.</em>"},
  {key:"j2", emoji:"🧠", context:"Clínica Brújula: equipos para dentro de 5 años",
   story:"La clínica necesitará <strong>S/ 45 000</strong> dentro de <strong>5 años</strong> para renovar sus equipos de evaluación. El banco ofrece <strong>7.2 % anual</strong>; la gerencia duda entre capitalización <strong>continua</strong> y <strong>anual</strong>. ¿Cuánto debe depositar hoy en cada caso?",
   offers:[{tag:"A", name:"Capitalización continua", desc:"7.2 % anual · $C=M\\,e^{-r\\,t}$"}, {tag:"B", name:"Capitalización anual", desc:"7.2 % anual · $C=\\dfrac{M}{(1+r)^{t}}$"}],
   steps:[
     mcqStep("1. Plantea", "Se conoce la meta $M$ y se busca el depósito de hoy. ¿Cómo se calcula con capitalización continua?", "$C=M\\,e^{-r\\,t}$: se <strong>divide</strong> la meta entre $e^{r\\,t}$", ["$C=M\\,e^{r\\,t}$","$C=M-r\\,t$","$C=\\dfrac{M}{r\\,t}$"], "Retroceder en el tiempo es <strong>dividir</strong> entre el factor de crecimiento."),
     numStep("2. Opción A", "Calcula el depósito de hoy con capitalización <strong>continua</strong>.", PA, 2, "$r\\cdot t=0.072\\cdot5=0.36$ y $C=45000\\,e^{-0.36}$.", "$C_A=45000\\,e^{-0.36}\\approx$ <strong>" + sol(PA) + "</strong>."),
     numStep("3. Opción B", "Calcula el depósito de hoy con capitalización <strong>anual</strong>.", PB, 2, "$C=\\dfrac{45000}{(1.072)^{5}}$.", "$C_B=\\dfrac{45000}{(1.072)^{5}}\\approx$ <strong>" + sol(PB) + "</strong>."),
     mcqStep("4. Dictamina", "¿Qué opción conviene a la clínica?", "La continua (A): necesita depositar menos hoy, unos " + sol(PB - PA) + " menos", ["La anual (B): es más simple de entender","Las dos exigen el mismo depósito","La anual, porque exige menos capital"], "Con capitalización continua el dinero crece más rápido, así que <strong>se necesita menos capital hoy</strong> para llegar a la misma meta.")
   ],
   verdict:"Dictamen: la clínica debe elegir la <strong>capitalización continua</strong> (si existiera la oferta). Para reunir S/ 45 000 en 5 años depositaría " + sol(PA) + ", unos " + sol(PB - PA) + " menos que con capitalización anual."},
  {key:"j3", emoji:"🧠⚖️", context:"Centro Integral: ¿qué tasa anual «equivale» al 6 % continuo?",
   story:"El Centro Integral de Atención Familiar recibió dos ofertas por una donación de <strong>S/ 50 000</strong> a <strong>8 años</strong>: el <strong>Banco Delta</strong> paga <strong>6 % continuo</strong> y el <strong>Banco Eco</strong> paga <strong>6.15 % anual</strong> (capitalización anual). Para comparar necesitas la <strong>tasa efectiva anual</strong> del continuo: $\\text{TEA}=e^{r}-1$.",
   offers:[{tag:"A", name:"Banco Delta", desc:"6 % anual · capitalización <strong>continua</strong>"}, {tag:"B", name:"Banco Eco", desc:"6.15 % anual · capitalización <strong>anual</strong>"}],
   steps:[
     mcqStep("1. Lee", "¿Qué significa «tasa efectiva anual» del 6 % continuo?", "La tasa con capitalización <strong>anual</strong> que produciría el mismo monto en un año: $e^{0.06}-1$", ["La tasa que se divide entre 12","El 6 % sin cambios","El 6 % multiplicado por el tiempo"], "Comparar tasas con capitalizaciones distintas se vuelve fácil si las pasas todas a <strong>tasa efectiva anual</strong>."),
     numStep("2. TEA", "Calcula la TEA del Banco Delta, en porcentaje (2 decimales).", TEA_D * 100, 2, "$e^{0.06}\\approx1.061837$; resta $1$ y multiplica por $100$.", "$\\text{TEA}=e^{0.06}-1\\approx0.0618$, es decir <strong>6.18 %</strong> anual.", "TEA (%) ="),
     mcqStep("3. Compara", "Comparando 6.18 % con 6.15 %, ¿qué banco rinde más?", "El Banco Delta (continuo), aunque por muy poco", ["El Banco Eco, porque 6.15 es mayor que 6","El Banco Eco, porque capitaliza anualmente","Rinden exactamente lo mismo"], "Los números <em>anunciados</em> (6 y 6.15) engañan; las <strong>tasas efectivas</strong> (6.18 y 6.15) permiten comparar de verdad."),
     numStep("4. En soles", "¿Cuántos soles <strong>más</strong> deja el Banco Delta que el Banco Eco al cabo de 8 años con S/ 50 000?", KD - KE, 2, "Delta: $50000\\,e^{0.48}$. Eco: $50000\\,(1.0615)^{8}$. Resta.", "Delta: $50000\\,e^{0.48}\\approx" + solTex(KD, 2) + "$ · Eco: $50000\\,(1.0615)^{8}\\approx" + solTex(KE, 2) + "$ → diferencia <strong>" + sol(KD - KE) + "</strong>.")
   ],
   verdict:"Dictamen: el <strong>Banco Delta</strong> (6 % continuo, TEA 6.18 %) supera al Banco Eco (6.15 % anual) por " + sol(KD - KE) + " en 8 años. Un buen informe compara <em>tasas efectivas</em>, no los porcentajes que cada banco pone en el cartel."},
  {key:"j4", emoji:"🏆", boss:true, context:"Jefe final: el Fondo de la Defensoría",
   story:"La Defensoría invertirá <strong>S/ 150 000</strong> durante <strong>8 años</strong> para un programa de asistencia legal y psicológica a familias. Te piden un dictamen sobre tres ofertas. <strong>Tu informe decide.</strong>",
   offers:[{tag:"A", name:"Banco Diario", desc:"4.5 % anual · capitaliza <strong>diariamente</strong> ($n=360$)"}, {tag:"B", name:"Banco Continuo", desc:"4.55 % anual · capitaliza <strong>continuamente</strong>"}, {tag:"C", name:"Banco Anual", desc:"4.7 % anual · capitaliza <strong>anualmente</strong>"}],
   steps:[
     numStep("1. Lee", "En la oferta B, ¿cuánto vale el exponente $r\\cdot t$?", 0.364, 3, "$0.0455\\cdot8$.", "$r\\cdot t=0.0455\\cdot8=0.364$ y $e^{0.364}\\approx1.43907$.", "$r\\cdot t$ ="),
     numStep("2. Oferta A", "Calcula el monto del <strong>Banco Diario</strong>.", BA, 2, "Base $1+\\dfrac{0.045}{360}=1.000125$ (guárdala completa), exponente $2880$.", "$M_A\\approx$ <strong>" + sol(BA) + "</strong>."),
     numStep("3. Oferta B", "Calcula el monto del <strong>Banco Continuo</strong>.", BB, 2, "$150000\\,e^{0.364}$.", "$M_B=150000\\,e^{0.364}\\approx$ <strong>" + sol(BB) + "</strong>."),
     numStep("4. Oferta C", "Calcula el monto del <strong>Banco Anual</strong>.", BC, 2, "$150000\\,(1.047)^{8}$.", "$M_C=150000\\,(1.047)^{8}\\approx$ <strong>" + sol(BC) + "</strong>."),
     mcqStep("5. Dictamina", "¿Qué oferta recomiendas?", "El Banco Anual (C): su tasa más alta le da el mayor monto, " + sol(BC), ["El Banco Continuo (B): capitaliza al máximo","El Banco Diario (A): capitaliza todos los días","Las tres son equivalentes"], "C: " + sol(BC) + " · B: " + sol(BB) + " · A: " + sol(BA) + ". La mayor frecuencia (A, B) no compensa una tasa menor."),
     mcqStep("6. Redacta", "Elige la conclusión mejor redactada para el informe.", "Se recomienda el Banco Anual: a 8 años acumula " + sol(BC) + ", " + sol(BC - BB) + " más que el Banco Continuo y " + sol(BC - BA) + " más que el Banco Diario; la decisión se basa en montos finales.", ["Se recomienda el Banco Continuo porque capitaliza en cada instante.","Se recomienda el Banco Diario porque capitaliza todos los días.","Se recomienda cualquiera; la diferencia no importa."], "Un buen dictamen indica <strong>qué se recomienda, con qué cifras y por qué</strong>.")
   ],
   verdict:"Dictamen del jefe final: <strong>Banco Anual</strong>. Acumula " + sol(BC) + " en 8 años, frente a " + sol(BB) + " (Banco Continuo) y " + sol(BA) + " (Banco Diario). Ni el «continuo» ni la mayor frecuencia ganan por sí solos: gana la combinación que produce el <strong>mayor monto final</strong>, y aquí la tasa pesó más.",
   decision:"Se recomienda invertir los S/ 150 000 en el Banco Anual (4.7 % anual, capitalización anual): a 8 años acumula " + sol(BC) + ", " + sol(BC - BB) + " más que el Banco Continuo y " + sol(BC - BA) + " más que el Banco Diario."}
];

/* Tarjeta «Dictamen del profesional» para copiar o imprimir */
function dictamenCard(body, cs){
  var d = new Date();
  var fecha = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
  var card = el("div", "dictamen");
  var who = student ? student.name : "Estudiante";
  var carr = student ? (student.carrera === "Otra" ? "Pensamiento Matemático" : student.carrera) : "";
  card.innerHTML = '<div class="dic-seal">⚖️</div><div class="dic-head"><strong>DICTAMEN DEL PROFESIONAL</strong><span>Pensamiento Matemático · Interés compuesto continuo</span></div>' +
    '<p class="dic-case">' + cs.context.replace("Jefe final: ", "") + '</p><p>' + escapeHtml(cs.decision) + '</p>' +
    '<div class="dic-sign"><span>' + escapeHtml(who) + '</span><small>' + escapeHtml(carr) + ' · ' + fecha + '</small></div>';
  body.appendChild(card);
  var row = el("div", "dic-actions");
  var cp = el("button", "btn sm", "📋 Copiar mi dictamen"); cp.type = "button";
  var pr = el("button", "btn sm ghost", "🖨️ Imprimir / guardar PDF"); pr.type = "button";
  row.appendChild(cp); row.appendChild(pr); body.appendChild(row);
  var txt = "DICTAMEN DEL PROFESIONAL — " + cs.context.replace("Jefe final: ", "") + "\n" + cs.decision + "\n— " + who + " (" + carr + "), " + fecha;
  cp.addEventListener("click", function(){
    function done(){ cp.textContent = "✅ Copiado"; setTimeout(function(){ cp.textContent = "📋 Copiar mi dictamen"; }, 2000); }
    try{ navigator.clipboard.writeText(txt).then(done, function(){ fallbackCopy(txt); done(); }); }catch(e){ fallbackCopy(txt); done(); }
  });
  pr.addEventListener("click", function(){ document.body.classList.add("print-dictamen"); card.classList.add("print-me"); window.print(); setTimeout(function(){ document.body.classList.remove("print-dictamen"); card.classList.remove("print-me"); }, 500); });
}
function fallbackCopy(t){
  var ta = document.createElement("textarea"); ta.value = t; ta.style.cssText = "position:fixed;opacity:0;"; document.body.appendChild(ta); ta.select();
  try{ document.execCommand("copy"); }catch(e){}
  document.body.removeChild(ta);
}

function renderPhase6(app){
  phaseHeader(app, 6, "Dictamen: de los números a la decisión",
    "Aquí integras todo: lees las ofertas, calculas montos, valor presente y tasa efectiva, y redactas un dictamen como lo haría un profesional del Derecho o de la Psicología. El último caso es el jefe final.");
  runCases(app, {cases: DICTAMEN, phaseKey: "dictamen",
    doneTitle: "🏁 Misión completa", doneText: "Calculaste con $e^{r\\,t}$, retrocediste en el tiempo, detectaste ofertas exageradas, comparaste tasas efectivas y emitiste dictámenes profesionales — incluido el del Fondo de la Defensoría. En la Semana 13 estudiarás logaritmos, la herramienta que te falta para despejar el <strong>tiempo</strong>.",
    nextRoute: "summary", nextLabel: "Ver tu resumen y constancia →"});
}

/* ============================================================
   RESUMEN FINAL Y CONSTANCIA
============================================================ */
function renderSummary(app){
  var allDone = allPhasesDone();

  var hero = el("div","hero");
  hero.innerHTML = '<div class="hero-text"><span class="eyebrow">'+(allDone?"Misión completa":"Resumen de progreso")+'</span>'+
    '<h1>'+(allDone ? "🎓 ¡Lo lograste, "+escapeHtml(student.name)+"!" : "Todavía te faltan fases por completar")+'</h1>'+
    '<p class="lead">'+(allDone
      ? "Completaste las seis fases de “Interés Compuesto Continuo: Descubre el techo, calcula y decide”, incluido el dictamen del Fondo de la Defensoría. Aquí tienes tu resumen, tus insignias y tu constancia de finalización."
      : "Vuelve al mapa de misión para terminar las fases pendientes; cuando completes las seis (incluido el dictamen del Fondo de la Defensoría), tu constancia aparecerá aquí.")+'</p></div>'+
    '<div class="hero-art">'+(allDone ? mascotBadge("certificate", 120) : '<svg viewBox="0 0 32 32"><path d="M9 5h14v6a7 7 0 0 1-14 0z"/><path d="M9 7H5a4.5 4.5 0 0 0 4.5 6.5"/><path d="M23 7h4a4.5 4.5 0 0 1-4.5 6.5"/><line x1="16" y1="18.5" x2="16" y2="24"/><line x1="10.5" y1="28" x2="21.5" y2="28"/><line x1="16" y1="24" x2="16" y2="28"/></svg>')+'</div>';
  app.appendChild(hero);

  renderXPPanel(app);

  var total = totalMissions();
  var solved = PHASES.reduce(function(sum,ph){ return sum + phaseCompleteCount(ph.key, MISSION_TOTALS[ph.key]); }, 0);

  var statGrid = el("div","stat-grid");
  PHASES.forEach(function(ph){
    var d = phaseCompleteCount(ph.key, MISSION_TOTALS[ph.key]);
    var t = MISSION_TOTALS[ph.key];
    var tile = el("div","stat-tile");
    tile.innerHTML = '<div class="num">'+(d>=t?"✓":d+"/"+t)+'</div><div class="lbl">'+ph.label+'</div>';
    statGrid.appendChild(tile);
  });
  var totalTile = el("div","stat-tile");
  totalTile.style.borderColor = "var(--accent)";
  totalTile.innerHTML = '<div class="num">'+solved+'/'+total+'</div><div class="lbl">Retos totales</div>';
  statGrid.appendChild(totalTile);
  app.appendChild(statGrid);

  if(!allDone){
    var back = el("div","center-actions");
    back.innerHTML = '<button class="btn primary" id="sum_map">Volver al mapa de misión</button>';
    app.appendChild(back);
    back.querySelector("#sum_map").addEventListener("click", function(){ goTo("map"); });
    return;
  }

  var completedAt = getCompletedAt();
  var dateStr = "";
  try{
    dateStr = new Date(completedAt || Date.now()).toLocaleDateString("es-PE", {day:"numeric", month:"long", year:"numeric"});
  }catch(e){ dateStr = ""; }

  var printBar = el("div","center-actions no-print");
  printBar.innerHTML = '<button class="btn primary" id="sum_print">🖨️ Guardar como PDF / imprimir</button>'+
    '<button class="btn ghost" id="sum_map2">Volver al mapa de misión</button>';
  app.appendChild(printBar);
  printBar.querySelector("#sum_print").addEventListener("click", function(){ window.print(); });
  printBar.querySelector("#sum_map2").addEventListener("click", function(){ goTo("map"); });

  var cert = el("div","cert-card");
  cert.id = "certCard";
  var carreraTxt = student.carrera === "Otra" ? "Pensamiento Matemático" : student.carrera;
  cert.innerHTML =
    '<div class="cert-inner">'+
      '<div class="cert-seal">'+mascotBadge("certificate", 60)+'</div>'+
      '<div class="cert-eyebrow">Constancia de finalización</div>'+
      '<div class="cert-title">Misión: Interés Compuesto Continuo</div>'+
      '<div class="cert-role">Se certifica que</div>'+
      '<div class="cert-name">'+escapeHtml(student.name)+'</div>'+
      '<div class="cert-role">estudiante de '+escapeHtml(carreraTxt)+'</div>'+
      '<p class="cert-body">completó exitosamente las seis fases del curso de Pensamiento Matemático — Techo, Fórmula, Calcula, Retrocede, Decide y Dictamen — resolviendo '+total+' retos sobre capitalización continua, la fórmula M = C·e^(rt), cálculo de montos e intereses, valor presente, comparación de ofertas financieras y detección de promesas exageradas, aplicados a casos de Derecho y Psicología, incluido el dictamen final. Nivel alcanzado: '+currentLevelInfo(totalXP()).name+'.</p>'+
      '<div class="cert-sig">Curso de Pensamiento Matemático</div>'+
      '<div class="cert-date">'+(dateStr||"")+'</div>'+
    '</div>';
  app.appendChild(cert);

  var badgesPanel = el("div","panel no-print"); badgesPanel.style.marginTop="18px";
  badgesPanel.innerHTML = '<h3>Tu vitrina de insignias</h3>';
  var badgeRow = el("div","badge-row");
  badgeRow.innerHTML = badgeChips(true);
  badgesPanel.appendChild(badgeRow);
  app.appendChild(badgesPanel);
}


/* ============================================================
   SALA EN VIVO · RANKING · PREGUNTA DEL DÍA
   (usan el mismo Apps Script de respaldo; si no hay conexión,
    la app sigue funcionando y estas secciones avisan con calma)
============================================================ */
var ACTIVITY_ID = "continuo";
var API = {offset: 0, state: null, connected: 0, ok: null};
var RANK = {data: null, at: 0};
var LIVE_PRACTICE = 0;     // si > 0, al abrir la sala se inicia la práctica de esa ronda
var DEFAULT_QSEC = 120;  // segundos por pregunta si el docente no elige otro (la docente puede elegir 60, 90 o 120)
var FLASH_COUNT = 5;     // preguntas por ronda
var XP_BASE_OK = 6;        // XP por acierto
var XP_SPEED_MAX = 4;      // XP extra por rapidez: 4 si respondes al instante, bajando hasta 0 al cumplirse la ventana
var SPEED_WINDOW_MS = 60000; // la ventana de rapidez es el menor valor entre el tiempo de la pregunta y 60 s
var RUN_KEY = "ec-live-run-v1";
function speedBonus(ms, qms){
  var w = Math.min(qms, SPEED_WINDOW_MS);
  if(!(ms >= 0)) return 0;
  return Math.max(0, Math.min(XP_SPEED_MAX, Math.round(XP_SPEED_MAX * (1 - ms / w))));
}
function qsecOf(st){ return (st && st.qsec) || DEFAULT_QSEC; }
function flashTotalMs(st){ return qsecOf(st) * FLASH_COUNT * 1000; }
/* Momentos en que empieza cada pregunta y termina la ronda. Si el docente pulsa «Siguiente pregunta»,
   st.adv[i] guarda cuándo adelantó la pregunta i; así todos pasan a la siguiente a la vez. */
function flashBounds(st){
  var q = qsecOf(st) * 1000, adv = (st && st.adv) || [], b = [st.startAt];
  for(var i = 0; i < FLASH_COUNT; i++){
    var end = b[i] + q;
    if(adv[i] && adv[i] >= b[i] && adv[i] < end) end = adv[i];
    b.push(end);
  }
  return b;
}
function fmtDur(sec){
  if(sec % 60 === 0) return (sec / 60) + " min";
  if(sec > 60 && sec % 30 === 0) return Math.floor(sec / 60) + "½ min";
  return sec + " s";
}
function mmss(ms){
  var t = Math.max(0, Math.ceil(ms / 1000)), m = Math.floor(t / 60), x = t % 60;
  return m + ":" + (x < 10 ? "0" : "") + x;
}

function apiCall(payload, onOk, onFail){
  if(!sheetSyncConfigured()){ if(onFail) onFail("sin_backend"); return; }
  payload.actividad = ACTIVITY_ID;
  var t0 = Date.now();
  try{
    fetch(SHEET_API_URL, {method: "POST", headers: {"Content-Type": "text/plain;charset=utf-8"}, body: JSON.stringify(payload)})
      .then(function(r){ return r.text(); })
      .then(function(txt){
        var d = null;
        try{ d = JSON.parse(txt); }catch(e){ API.ok = false; if(onFail) onFail("respuesta_invalida"); return; }
        var t1 = Date.now();
        if(d && d.serverNow){ API.offset = d.serverNow - Math.round((t0 + t1) / 2); }
        API.ok = true;
        if(d && d.ok === false){ if(onFail) onFail(d.error || "error"); return; }
        if(onOk) onOk(d);
      })
      .catch(function(){ API.ok = false; if(onFail) onFail("red"); });
  }catch(e){ if(onFail) onFail("red"); }
}
function connErrorText(err){
  if(err === "pin") return "PIN incorrecto.";
  if(err === "sin_backend") return "Esta página no tiene configurada la dirección del respaldo (SHEET_API_URL).";
  if(err === "respuesta_invalida") return "El respaldo respondió algo que no es la sala (suele ser una página de permisos de Google o un error del script). Revisa que la implementación sea «Aplicación web», con acceso «Cualquier persona», y que hayas guardado y creado una Nueva versión.";
  if(err === "accion_desconocida") return "El Code.gs publicado es una versión antigua. Pega el archivo nuevo e implementa una Nueva versión.";
  if(err === "red") return "El navegador no pudo comunicarse con el respaldo (sin internet, bloqueado por la red/extensión, o la URL del script no es la de la implementación activa).";
  return "El respaldo respondió con un error: " + String(err).slice(0, 160);
}
function serverNow(){ return Date.now() + API.offset; }

/* ---- Sondeo de la sala (lento en segundo plano, rápido dentro de la sala) ---- */
var pollTimer = null, pollBusy = false, pollFails = 0;
function pollOnce(){
  if(!student || document.hidden || pollBusy) return;
  pollBusy = true;
  var payload = {action: "flashState", nombre: student.name, carrera: student.carrera};
  if(LIVE && LIVE.playing && !LIVE.practice && LIVE.shown >= 0){   // el docente ve cuántos ya respondieron la pregunta en curso
    payload.p = {r: LIVE.round, q: LIVE.shown, a: LIVE.answered[LIVE.shown] !== undefined ? 1 : 0};
  }
  apiCall(payload, function(d){
    pollBusy = false; pollFails = 0;
    API.state = d.state; API.connected = d.connected || 0;
    renderLiveBanner();
    if(typeof renderStrips === "function") renderStrips();
    if(typeof duelOnState === "function") duelOnState();
    if(route === "live" && typeof liveOnState === "function") liveOnState();
  }, function(){ pollBusy = false; pollFails++; });
}
/* Cuánto esperar entre consultas. Con 30+ estudiantes, consultar cada 3 s durante una ronda larga satura el respaldo:
   en la sala se consulta cada ~5 s solo mientras se espera; durante el juego el reloj local alcanza (cada ~30 s solo avisamos que seguimos conectados).
   Si hay errores se espera cada vez más (hasta 60 s) para no empeorar la saturación. */
function nextPollDelay(){
  var base;
  if(route === "live") base = (LIVE && LIVE.playing && !LIVE.practice) ? 5000 : 4000;
  else base = 20000;
  var d = base * Math.pow(2, Math.min(pollFails, 4));
  return Math.min(60000, d) + Math.random() * Math.min(base * 0.3, 4000);
}
function pollSoon(){ setTimeout(pollOnce, 500 + Math.random() * 3500); }   // repartido en unos segundos para no juntar a toda la clase en el mismo instante
function schedulePoll(){
  clearTimeout(pollTimer);
  pollTimer = setTimeout(function(){ pollOnce(); schedulePoll(); }, nextPollDelay());
}
function renderLiveBanner(){
  var b = document.getElementById("liveBanner");
  var st = API.state;
  var flashOn = st && (st.status === "lobby" || st.status === "running");
  var duelOn = st && st.duel && st.duel.stage === "vote" && !(progress._pregunta && progress._pregunta[st.duel.id]);
  var active = student && (flashOn || duelOn) && route !== "live" && route !== "docente";
  if(!active){ if(b) b.hidden = true; return; }
  if(!b){
    b = document.createElement("div"); b.id = "liveBanner"; b.className = "live-banner";
    document.body.appendChild(b);
  }
  b.hidden = false;
  if(flashOn){
    var r = FLASH_ROUNDS[(st.round || 1) - 1];
    b.innerHTML = '<span class="pulse-dot"></span><span><strong>⚡ ¡Reto relámpago en vivo!</strong> ' + (r ? r.title : "") + ' — tu docente abrió la sala.</span>' +
      '<button type="button" class="btn sm primary" id="liveBannerGo">Entrar a la sala</button>';
  } else {
    b.innerHTML = '<span class="pulse-dot"></span><span><strong>🥊 ¡Duelo Discreto vs. Continuo!</strong> Tu docente lanzó una votación: ¿cuál conviene más?</span>' +
      '<button type="button" class="btn sm primary" id="liveBannerGo">Votar ahora</button>';
  }
  b.querySelector("#liveBannerGo").addEventListener("click", function(){ goTo("live"); });
}

/* ---- Banco de preguntas relámpago: una ronda por fase (el texto admite $...$ = LaTeX) ---- */
var FLASH_ROUNDS = [
  {id:1, short:"Techo", title:"Fase 1 · Descubre el techo", qs:[
    {q:"$\\text{S/}\\,1\\,000$ al $8\\,\\%$ anual durante $3$ años, capitalizado <em>anualmente</em>. ¿Monto?", o:["S/ 1 259.71","S/ 1 240.00","S/ 1 271.25"], c:0, why:"$1000\\,(1.08)^{3}=1259.71$. Los S/ 1 240 serían con interés simple y los S/ 1 271.25 con capitalización continua."},
    {q:"Misma tasa y mismo plazo: al aumentar $n$ (capitalizaciones por año), el monto…", o:["Sube, pero cada vez menos","Sube siempre lo mismo","Baja"], c:0, why:"Los rendimientos son decrecientes: la curva se aplana hacia un techo."},
    {q:"Si capitalizaras «infinitas veces», el monto llegaría a…", o:["Un valor finito: el techo $C\\,e^{r\\,t}$","Infinito","Cero"], c:0, why:"El límite existe y es finito: $C\\,e^{r\\,t}$. No hay ganancia infinita."},
    {q:"Para S/ 1 000, $8\\,\\%$, $3$ años: la capitalización continua frente a la diaria da…", o:["Solo unos centavos más","Unos S/ 50 más","Unos S/ 100 más"], c:0, why:"Diaria: S/ 1 271.22; continua: S/ 1 271.25. La diferencia es de unos 3 céntimos."},
    {q:"¿Qué banco real capitaliza exactamente en cada instante?", o:["Ninguno: el modelo continuo es un límite teórico","Todos los bancos","Solo los bancos grandes"], c:0, why:"En la práctica se capitaliza diaria o mensualmente; el continuo es el máximo teórico y un buen modelo."}
  ]},
  {id:2, short:"Fórmula", title:"Fase 2 · La fórmula $M=C\\,e^{r\\,t}$", qs:[
    {q:"En $M=C\\,e^{r\\,t}$, ¿qué dato de la fórmula discreta <strong>ya no aparece</strong>?", o:["$n$, las capitalizaciones por año","El capital $C$","El tiempo $t$"], c:0, why:"Al capitalizar en cada instante ya no se cuenta cuántas veces: desaparece $n$."},
    {q:"Una tasa de $4\\,\\%$ anual se escribe en la fórmula como…", o:["$r=0.04$","$r=4$","$r=0.4$"], c:0, why:"$4\\,\\%=\\dfrac{4}{100}=0.04$."},
    {q:"$r=5\\,\\%$ y $t=3$ años. ¿Cuánto vale el exponente $r\\cdot t$?", o:["$0.15$","$15$","$8.05$"], c:0, why:"$0.05\\cdot3=0.15$. El exponente es un producto, no una suma."},
    {q:"Aproximadamente, ¿cuánto es $e^{0.15}$?", o:["$1.1618$","$1.1500$","$0.1500$"], c:0, why:"Con la tecla $e^{x}$ se obtiene $1.161834\\ldots$, el factor de crecimiento en 3 años al 5 %."},
    {q:"¿En cuál enunciado se usa $M=C\\,e^{r\\,t}$?", o:["«capitalizado continuamente»","«capitalizado trimestralmente»","«con interés simple»"], c:0, why:"La palabra clave es «continuamente». Trimestral usa $n=4$ y el simple usa $C(1+rt)$."}
  ]},
  {id:3, short:"Calcula", title:"Fase 3 · Calcula montos e intereses", qs:[
    {q:"$\\text{S/}\\,1\\,000$ al $10\\,\\%$ anual capitalizable <em>continuamente</em> durante $1$ año. ¿Monto?", o:["S/ 1 105.17","S/ 1 100.00","S/ 1 010.00"], c:0, why:"$1000\\,e^{0.1}=1105.17$. Con capitalización anual serían S/ 1 100."},
    {q:"$\\text{S/}\\,2\\,000$ al $5\\,\\%$ continuo durante $2$ años. ¿Monto?", o:["S/ 2 210.34","S/ 2 200.00","S/ 2 100.00"], c:0, why:"$2000\\,e^{0.1}=2210.34$."},
    {q:"$\\text{S/}\\,10\\,000$ al $3\\,\\%$ continuo durante $10$ años. ¿Monto?", o:["S/ 13 498.59","S/ 13 000.00","S/ 13 439.16"], c:0, why:"$r\\cdot t=0.3$ y $10000\\,e^{0.3}=13498.59$. Los S/ 13 439.16 serían con capitalización anual."},
    {q:"En la pregunta anterior, ¿cuánto fue el interés ganado?", o:["S/ 3 498.59","S/ 13 498.59","S/ 3 000.00"], c:0, why:"$I=M-C=13498.59-10000=3498.59$."},
    {q:"Si redondeas $e^{r\\,t}$ a dos decimales antes de multiplicar por $C$…", o:["El resultado final puede cambiar en soles","Nunca pasa nada","El monto siempre sube"], c:0, why:"Calcula con todos los decimales y redondea solo el resultado final."}
  ]},
  {id:4, short:"Valor", title:"Fase 4 · Retrocede en el tiempo", qs:[
    {q:"Al despejar $C$ de $M=C\\,e^{r\\,t}$ queda…", o:["$C=M\\,e^{-r\\,t}$","$C=M\\,e^{r\\,t}$","$C=M-r\\,t$"], c:0, why:"$C$ multiplica a $e^{r\\,t}$, así que pasa dividiendo: $C=\\dfrac{M}{e^{r\\,t}}=M\\,e^{-r\\,t}$."},
    {q:"Necesitas $\\text{S/}\\,10\\,000$ dentro de $2$ años y el banco paga $5\\,\\%$ continuo. ¿Cuánto depositas hoy?", o:["S/ 9 048.37","S/ 11 051.71","S/ 9 000.00"], c:0, why:"$10000\\,e^{-0.1}=9048.37$."},
    {q:"Calculas un valor presente y te sale <em>mayor</em> que la meta. Probablemente…", o:["Multiplicaste en vez de dividir","Está perfecto","Falta sumar el interés"], c:0, why:"Retroceder en el tiempo da un depósito <strong>menor</strong> que la meta; si no, revisa el signo del exponente."},
    {q:"Si la tasa sube (misma meta y plazo), el depósito de hoy…", o:["Baja","Sube","No cambia"], c:0, why:"Con mayor tasa el dinero crece más rápido, así que se necesita menos hoy."},
    {q:"Meta de $\\text{S/}\\,20\\,000$ en $5$ años al $6\\,\\%$ continuo. ¿Depósito de hoy?", o:["S/ 14 816.36","S/ 26 997.18","S/ 14 000.00"], c:0, why:"$20000\\,e^{-0.3}=14816.36$."}
  ]},
  {id:5, short:"Decide", title:"Fase 5 · Decide y detecta", qs:[
    {q:"Un volante promete que S/ 1 000 se convierten en S/ 2 000 en $5$ años al $6\\,\\%$ continuo. Es…", o:["Exagerada: el máximo es S/ 1 349.86","Posible: es capitalización continua","Posible: 6 % es alta"], c:0, why:"El techo es $1000\\,e^{0.3}=1349.86$. Nadie puede prometer más con esa tasa y plazo."},
    {q:"¿Cuál es la tasa efectiva anual de un $6\\,\\%$ continuo?", o:["$\\approx6.18\\,\\%$","$6.00\\,\\%$","$\\approx7.00\\,\\%$"], c:0, why:"$\\text{TEA}=e^{0.06}-1\\approx0.0618$."},
    {q:"Banco A: $6\\,\\%$ anual capitalizado anualmente. Banco B: $6\\,\\%$ continuo. Con el mismo capital y $10$ años…", o:["B deja más dinero","A deja más dinero","Dejan lo mismo"], c:0, why:"$e^{0.6}=1.8221$ frente a $1.06^{10}=1.7908$: gana B."},
    {q:"Banco A: $6\\,\\%$ anual. Banco B: $5.8\\,\\%$ continuo. A $5$ años…", o:["A deja más dinero","B deja más dinero porque es continuo","Dejan lo mismo"], c:0, why:"$1.06^{5}=1.3382$ frente a $e^{0.29}=1.3364$. Una tasa mayor puede ganarle al continuo."},
    {q:"Para comparar ofertas con capitalizaciones distintas conviene…", o:["Calcular montos finales o tasas efectivas","Mirar solo el porcentaje del cartel","Elegir la que dice «continua»"], c:0, why:"Los montos finales (o las tasas efectivas anuales) ponen todas las ofertas en la misma vara."}
  ]},
  {id:6, short:"Dictamen", title:"Fase 6 · Dictamen: el informe final", qs:[
    {q:"Un dictamen financiero responsable debe…", o:["Mostrar el cálculo, comparar alternativas y justificar la recomendación","Dar solo el resultado final","Esconder los supuestos"], c:0, why:"Quien lee tu dictamen debe poder verificarlo: cálculo + comparación + razón."},
    {q:"Fondo de reparación: $\\text{S/}\\,20\\,000$ al $4\\,\\%$ continuo durante $3$ años. ¿Monto?", o:["S/ 22 549.94","S/ 22 497.28","S/ 22 400.00"], c:0, why:"$20000\\,e^{0.12}=22549.94$. Los S/ 22 497.28 serían con capitalización anual."},
    {q:"En la pregunta anterior, ¿cuánto más deja el continuo que la capitalización anual?", o:["Unos S/ 52.66","Unos S/ 500","Nada"], c:0, why:"$22549.94-22497.28=52.66$: poco, porque el continuo es solo el techo de la capitalización."},
    {q:"El modelo continuo es útil porque…", o:["Marca el máximo teórico y permite comparar y detectar promesas imposibles","Todos los bancos lo usan tal cual","Elimina la tasa de interés"], c:0, why:"Es un límite: sirve para modelar, comparar y desconfiar de lo que lo supera."},
    {q:"Para despejar el <em>tiempo</em> en $M=C\\,e^{r\\,t}$ necesitarás…", o:["Logaritmos (Semana 13)","Solo sumar","Una raíz cuadrada"], c:0, why:"Hay que «deshacer» la $e$: ese es el trabajo del logaritmo natural."}
  ]}
];

/* ---- Pantalla de la sala ---- */
var LIVE = {playing: false};
var liveHost = null, liveTimer = null;

function flashPlayed(round){ return !!(progress._flash && progress._flash["r" + round]); }
function stopLiveTimer(){ clearInterval(liveTimer); liveTimer = null; }

function renderLive(app){
  stopLiveTimer();
  LIVE = {playing: false};
  var head = el("div", "phase-head");
  head.innerHTML = '<div class="phase-head-row"><span class="phase-head-icon">⚡</span><div><span class="eyebrow" style="color:var(--accent)">Sala en vivo</span><h2>Retos relámpago</h2></div></div>' +
    '<p style="color:var(--ink-soft)">Cada fase tiene su ronda de 5 preguntas para analizar con calma (tu docente elige 1, 1½ o 2 minutos por pregunta). Cuanto antes aciertes, más XP ganas. ¡Y a veces habrá un duelo de bancos con voto de toda la clase!</p>';
  app.appendChild(head);
  var duelH = el("div", "duel-host"); duelH.hidden = true; app.appendChild(duelH); paintDuel(duelH);
  liveHost = el("div"); app.appendChild(liveHost);
  var foot = el("p", "progress-note"); foot.style.marginTop = "18px";
  foot.innerHTML = '¿Eres docente? <button type="button" class="linklike" id="goDocente">Abrir el panel docente</button>';
  app.appendChild(foot);
  foot.querySelector("#goDocente").addEventListener("click", function(){ goTo("docente"); });
  pollOnce();
  var pr = LIVE_PRACTICE; LIVE_PRACTICE = 0;
  if(pr){ beginPlay(pr, Date.now() + 2500, true, DEFAULT_QSEC); }
  else liveDraw();
}
function liveOnState(){ if(!LIVE.playing && !LIVE.finished) liveDraw(); }

function rulesHTML(st){
  var q = qsecOf(st);
  return '<ul class="rules-list"><li><strong>5 preguntas</strong> de <strong>' + fmtDur(q) + '</strong> cada una (' + fmtDur(q * FLASH_COUNT) + ' en total), todas a la vez.</li>' +
    '<li>Cada acierto vale <strong>' + XP_BASE_OK + ' XP</strong> y puedes ganar hasta <strong>+' + XP_SPEED_MAX + ' XP extra por rapidez</strong>: cuanto antes aciertes, más puntos (máximo ' + (XP_BASE_OK + XP_SPEED_MAX) + ' XP por pregunta). Si fallas, no restas.</li>' +
    '<li>Si dos personas empatan en puntos, gana quien acertó en menos tiempo total.</li>' +
    '<li>Al terminar verás la explicación de cada pregunta y qué eligió el resto de la clase.</li>' +
    '<li>Cada ronda suma una sola vez a tu XP y a tu posición en el ranking.</li></ul>';
}
function liveDraw(){
  if(!liveHost || !document.body.contains(liveHost)) return;
  stopLiveTimer();
  liveHost.innerHTML = "";
  var st = API.state;
  if(!sheetSyncConfigured() || API.ok === false){
    var c0 = el("div", "panel");
    c0.innerHTML = '<h3>No hay conexión con la sala</h3><p>La sala en vivo necesita internet y el respaldo en la nube. Puedes <strong>practicar solo</strong> mientras tanto: no suma XP, pero te prepara.</p>';
    liveHost.appendChild(c0);
    practiceButtons(c0);
    return;
  }
  if(!st || st.status === "idle"){
    var c1 = el("div", "panel live-idle");
    c1.innerHTML = '<div class="live-hero">' + mascotBadge("hint", 70) + '<div><h3>La sala está cerrada</h3><p>Tu docente la abrirá cuando empiece el reto. Esta pantalla se actualiza sola; también te avisaremos con un letrero en la parte de arriba aunque estés en otra sección.</p></div></div>';
    liveHost.appendChild(c1);
    var played = FLASH_ROUNDS.filter(function(r){ return flashPlayed(r.id); });
    if(played.length){
      var pl = el("p", "progress-note"); pl.innerHTML = "Rondas que ya jugaste: " + played.map(function(r){ return "<strong>R" + r.id + "</strong> (" + progress._flash["r" + r.id].pts + " XP)"; }).join(" · ");
      c1.appendChild(pl);
    }
    practiceButtons(c1);
    return;
  }
  var round = FLASH_ROUNDS[(st.round || 1) - 1];
  if(st.status === "lobby"){
    var c2 = el("div", "panel live-lobby");
    c2.innerHTML = '<div class="live-hero">' + mascotBadge("welcome", 74) + '<div><span class="badge up"><span class="pulse-dot"></span> Sala abierta</span><h3>' + round.title + '</h3>' +
      '<p>Ya estás dentro. <strong>' + (API.connected || 1) + '</strong> persona(s) conectada(s). Cuando tu docente diga <em>«¡Ya, empezamos!»</em> verás una cuenta regresiva de 3-2-1 en esta pantalla.</p></div></div>' + rulesHTML(st) +
      (flashPlayed(st.round) ? '<div class="reveal-box">Ya jugaste esta ronda: esta vez será práctica y no volverá a sumar XP.</div>' : '');
    liveHost.appendChild(c2);
    return;
  }
  // running
  var now = serverNow();
  if(now < st.startAt){
    var c3 = el("div", "panel live-count");
    c3.innerHTML = '<p class="progress-note" style="text-align:center;">' + round.title + '</p><div class="count-big" id="countBig">…</div><p style="text-align:center;" id="countTxt">¡Prepárate!</p>';
    liveHost.appendChild(c3);
    var bigEl = c3.querySelector("#countBig");
    liveTimer = setInterval(function(){
      var rem = st.startAt - serverNow();
      if(rem <= 0){ stopLiveTimer(); beginPlay(st.round, st.startAt, false, qsecOf(st)); return; }
      var secs = Math.ceil(rem / 1000);
      bigEl.textContent = secs <= 3 ? String(secs) : "⏳ " + secs;
      bigEl.className = "count-big" + (secs <= 3 ? " go" : "");
      c3.querySelector("#countTxt").textContent = secs <= 3 ? "¡Ya casi!" : "Comienza en " + secs + " s";
    }, 100);
    return;
  }
  if(now < flashBounds(st)[FLASH_COUNT]){
    if(flashPlayed(st.round)){
      var c4 = el("div", "panel");
      c4.innerHTML = '<h3>Ronda en curso</h3><p>Ya jugaste esta ronda. Espera a que termine para ver el ranking de la clase.</p>';
      liveHost.appendChild(c4);
      return;
    }
    beginPlay(st.round, st.startAt, false, qsecOf(st));
    return;
  }
  var c5 = el("div", "panel");
  c5.innerHTML = '<h3>La ronda terminó</h3><p>Mira cómo quedó la clase y repasa cada pregunta.</p>';
  liveHost.appendChild(c5);
  showRoundRanking(c5, st.round, flashPlayed(st.round) ? progress._flash["r" + st.round].ch : null);
}

function practiceButtons(parent){
  var box = el("div", "practice-row");
  box.innerHTML = '<p style="margin:10px 0 6px;font-weight:600;flex-basis:100%;">Practicar solo (sin XP):</p>';
  FLASH_ROUNDS.forEach(function(r){
    var b = el("button", "btn sm ghost", "F" + r.id + " · " + r.short + (flashPlayed(r.id) ? " ✔" : "")); b.type = "button";
    b.addEventListener("click", function(){ beginPlay(r.id, Date.now() + 2500, true, DEFAULT_QSEC); });
    box.appendChild(b);
  });
  parent.appendChild(box);
}

/* ---- Juego: la pregunta en pantalla depende solo del reloj ---- */
function beginPlay(round, startAt, practice, qsec){
  stopLiveTimer();
  if(!practice && flashPlayed(round)) practice = true;
  qsec = qsec || DEFAULT_QSEC;
  var QMS = qsec * 1000;
  var qs = FLASH_ROUNDS[round - 1].qs;
  var chosen = qs.map(function(){ return -1; });
  LIVE = {playing: true, round: round, startAt: startAt, practice: practice, pts: 0, ok: 0, answered: {}, shown: -1, ch: chosen, qs: qs, rt: qs.map(function(){ return -1; }), gain: {}};
  liveHost.innerHTML = "";
  var orders = qs.map(function(q){ return shuffleOrder(q.o.length); });   // cada estudiante ve las opciones en otro orden
  // Si recargó la página a mitad de la ronda, se recuperan sus respuestas (mismas opciones, mismo orden)
  if(!practice){
    try {
      var sv = JSON.parse(localStorage.getItem(RUN_KEY) || "null");
      if(sv && sv.round === round && sv.startAt === startAt && sv.who === student.name && sv.orders && sv.orders.length === qs.length){
        orders = sv.orders; LIVE.ch = sv.ch; LIVE.rt = sv.rt; LIVE.pts = sv.pts; LIVE.ok = sv.ok; LIVE.gain = sv.gain || {};
        Object.keys(sv.answered || {}).forEach(function(k){ LIVE.answered[k] = sv.answered[k]; });
      }
    } catch(e) {}
  }
  function runSave(){
    if(practice) return;
    try { localStorage.setItem(RUN_KEY, JSON.stringify({round: round, startAt: startAt, who: student.name, orders: orders, answered: LIVE.answered, ch: LIVE.ch, rt: LIVE.rt, pts: LIVE.pts, ok: LIVE.ok, gain: LIVE.gain})); } catch(e) {}
  }
  var wrapEl = el("div", "panel live-play"); liveHost.appendChild(wrapEl);
  wrapEl.innerHTML = '<p class="progress-note" style="text-align:center;">' + FLASH_ROUNDS[round - 1].title + (practice ? ' · práctica' : '') + '</p><div class="count-big">⏳</div><p style="text-align:center;">¡Prepárate! La primera pregunta aparece enseguida.</p>';
  var pIdx = -1;   // solo en práctica: pregunta actual (avanza sola al agotarse el tiempo o con el botón)
  function nowMs(){ return practice ? Date.now() : serverNow(); }
  function boundsNow(){
    var st = API.state;
    var adv = (!practice && st && st.status === "running" && st.round === round && st.startAt === startAt && st.adv) ? st.adv : [];
    return flashBounds({startAt: startAt, qsec: qsec, adv: adv});
  }
  function curIndex(){
    var t = nowMs() - startAt;
    if(practice){ if(t < 0) return -1; if(pIdx < 0) pIdx = 0; return pIdx; }
    var tt = nowMs(), b = boundsNow(), i = FLASH_COUNT;
    if(tt < b[0]) return -1;
    for(var k = 0; k < FLASH_COUNT; k++){ if(tt < b[k + 1]){ i = k; break; } }
    return Math.max(i, LIVE.shown);   // nunca se retrocede, aunque se pierda un dato de la sala
  }
  var qBegan = {};   // inicio real de cada pregunta (en práctica puede adelantarse)
  function drawQuestion(i){
    wrapEl.innerHTML = "";
    if(practice && !qBegan[i]) qBegan[i] = nowMs();
    var q = qs[i];
    var top = el("div", "play-top");
    top.innerHTML = '<span class="badge">Fase ' + round + (practice ? " · práctica" : "") + '</span>' +
      '<span class="mono">Pregunta ' + (i + 1) + '/' + qs.length + '</span><span class="mono" id="timeLeft">⏱ ' + mmss(QMS) + '</span><span class="mono">⭐ ' + LIVE.pts + ' XP</span>';
    wrapEl.appendChild(top);
    var bar = el("div", "time-track"); bar.innerHTML = '<span class="time-fill" id="timeFill"></span>'; wrapEl.appendChild(bar);
    wrapEl.appendChild(el("h3", "play-q", rich(q.q)));
    wrapEl.appendChild(el("p", "progress-note", "Tómate tu tiempo: lee, analiza y responde cuando estés seguro/a."));
    if(!practice && nowMs() < startAt + i * QMS - 800){ var sk = el("p", "progress-note", "⏭ Tu docente pasó a la siguiente pregunta."); sk.style.fontWeight = "600"; wrapEl.appendChild(sk); }
    var grid = el("div", "choice-grid");
    function showAnswered(i, oi, gain, ms){
      var good = oi === q.c;
      Array.prototype.forEach.call(grid.children, function(x, xi){ x.disabled = true; if(orders[i][xi] === q.c) x.classList.add("correct"); else if(orders[i][xi] === oi) x.classList.add("incorrect"); });
      var f = el("div", "feedback show " + (good ? "ok" : "bad"));
      var sp = good ? gain - XP_BASE_OK : 0;
      f.innerHTML = (good ? "✅ +" + gain + " XP" + (sp > 0 ? ' <span style="opacity:.85">(' + XP_BASE_OK + ' + ' + sp + ' por rapidez · ' + (ms / 1000).toFixed(1) + ' s)</span>' : "") + " · " : "❌ ") + rich(q.why) + ' <span style="opacity:.8">' + (practice ? "" : "Espera la siguiente pregunta; el tiempo sigue corriendo para toda la clase.") + '</span>';
      wrapEl.appendChild(f);
      if(practice && i < qs.length - 1){
        var nx = el("button", "btn primary sm", "Siguiente pregunta →"); nx.type = "button"; nx.style.marginTop = "10px";
        nx.addEventListener("click", function(){ pIdx = i + 1; });
        wrapEl.appendChild(nx);
      } else if(practice){
        var fin = el("button", "btn primary sm", "Ver resultado"); fin.type = "button"; fin.style.marginTop = "10px";
        fin.addEventListener("click", function(){ finishPlay(); });
        wrapEl.appendChild(fin);
      }
    }
    orders[i].forEach(function(oi){
      var b = el("button", "choice"); b.type = "button"; b.innerHTML = rich(q.o[oi]);
      b.addEventListener("click", function(){
        if(LIVE.answered[i] !== undefined) return;
        var good = oi === q.c;
        var began = practice ? (qBegan[i] || nowMs()) : boundsNow()[i];
        var ms = Math.max(0, nowMs() - began);   // tiempo desde que apareció la pregunta (reloj de la sala)
        var gain = good ? XP_BASE_OK + speedBonus(ms, QMS) : 0;
        LIVE.answered[i] = oi; LIVE.ch[i] = oi; LIVE.rt[i] = Math.round(ms); LIVE.gain[i] = gain; LIVE.pts += gain; if(good) LIVE.ok++;
        runSave();
        showAnswered(i, oi, gain, ms);
        top.children[3].textContent = "⭐ " + LIVE.pts + " XP";
        if(!practice) pollSoon();   // avisa enseguida que ya respondiste
      });
      grid.appendChild(b);
    });
    wrapEl.appendChild(grid);
    if(LIVE.answered[i] !== undefined) showAnswered(i, LIVE.answered[i], LIVE.gain[i] || 0, LIVE.rt[i]);   // pregunta ya respondida antes de recargar
  }
  liveTimer = setInterval(function(){
    var i = curIndex();
    if(i >= qs.length){ finishPlay(); return; }
    if(i < 0) return;
    if(i !== LIVE.shown){ LIVE.shown = i; drawQuestion(i); }
    var began = practice ? (qBegan[i] || nowMs()) : boundsNow()[i];
    var spent = nowMs() - began;
    if(practice && spent >= QMS){ pIdx = i + 1; return; }
    var left = 1 - spent / QMS;
    var fill = document.getElementById("timeFill");
    if(fill){ fill.style.width = Math.max(0, Math.min(100, left * 100)) + "%"; fill.className = "time-fill" + (left < 0.2 ? " low" : ""); }
    var tl = document.getElementById("timeLeft"); if(tl) tl.textContent = "⏱ " + mmss(QMS - spent);
  }, 250);
}
function finishPlay(){
  stopLiveTimer();
  var L = LIVE;
  LIVE = {playing: false, finished: true};
  liveHost.innerHTML = "";
  var card = el("div", "panel live-result");
  card.innerHTML = '<div class="live-hero">' + mascotBadge(L.ok >= 4 ? "correct" : "hint", 70) + '<div><h3>' + (L.practice ? "Práctica terminada" : "¡Ronda terminada!") + '</h3>' +
    '<p><strong>' + L.ok + '</strong> de ' + FLASH_COUNT + ' aciertos · <strong>' + L.pts + ' XP</strong>' + (L.ok && !L.practice ? ' <span class="progress-note">(incluye bono de rapidez)</span>' : "") + (L.practice ? ' <span class="badge">modo práctica: no suma XP</span>' : "") + '</p></div></div>';
  liveHost.appendChild(card);
  if(!L.practice){
    if(!progress._flash) progress._flash = {};
    var tm = 0; L.ch.forEach(function(c, i){ if(c === L.qs[i].c && L.rt[i] >= 0) tm += L.rt[i]; });
    progress._flash["r" + L.round] = {pts: L.pts, ok: L.ok, ch: L.ch, rt: L.rt, tm: tm, at: Date.now()};
    try { localStorage.removeItem(RUN_KEY); } catch(e) {}
    saveProgress();
    if(typeof showXPToast === "function") showXPToast(L.pts);
    renderTopbar();
    var savingNote = el("p", "progress-note", "Guardando tu resultado…"); card.appendChild(savingNote);
    syncSaveToSheet(function(ok){
      savingNote.textContent = ok ? "✅ Resultado guardado." : "Tu resultado está guardado en este dispositivo y se subirá a la nube en cuanto haya conexión.";
      showRoundRanking(card, L.round, L.ch, true);
    });
  } else {
    reviewBlock(card, L.round, L.ch, null);
  }
  var back = el("div", "center-actions"); back.style.marginTop = "14px";
  back.innerHTML = '<button class="btn primary" type="button" id="liveBack">Volver al mapa</button> <button class="btn ghost" type="button" id="liveRank">Ver ranking general</button>';
  card.appendChild(back);
  back.querySelector("#liveBack").addEventListener("click", function(){ goTo("map"); });
  back.querySelector("#liveRank").addEventListener("click", function(){ goTo("ranking"); });
}

/* ---- Revisión de la ronda: respuesta correcta, explicación y qué eligió la clase ---- */
function choiceBars(q, counts, mine){
  var total = 0; (counts || []).forEach(function(n, i){ if(i < q.o.length) total += n; });
  var h = '<div class="rv-opts">';
  q.o.forEach(function(txt, oi){
    var n = counts ? (counts[oi] || 0) : 0;
    var pct = total ? Math.round(100 * n / total) : 0;
    var cls = "rv-opt" + (oi === q.c ? " right" : "") + (mine === oi ? " mine" : "");
    h += '<div class="' + cls + '"><div class="rv-bar" style="width:' + (counts ? pct : 0) + '%"></div><div class="rv-txt"><span class="rv-letter">' + "ABCDEF".charAt(oi) + '</span><span class="rv-label">' + rich(txt) + '</span>' +
      (oi === q.c ? ' <span class="badge up">correcta</span>' : '') + (mine === oi ? ' <span class="badge">tu respuesta</span>' : '') +
      (counts ? '<span class="rv-pct">' + pct + ' %</span>' : '') + '</div></div>';
  });
  return h + '</div>' + (counts && total ? '<p class="progress-note" style="margin:4px 0 0;">' + total + ' estudiante(s) respondieron esta pregunta.</p>' : '');
}
function reviewBlock(parent, round, mineCh, choices){
  var qs = FLASH_ROUNDS[round - 1].qs;
  var box = el("div", "review-box"); box.style.marginTop = "16px";
  box.innerHTML = '<h4>🔎 Revisemos cada pregunta</h4><p class="progress-note" style="margin-top:0;">' + (choices ? 'Las barras muestran qué eligió la clase. ' : '') + 'Un error que muchos comparten suele ser una buena pista de qué conviene repasar.</p>';
  qs.forEach(function(q, i){
    var mine = mineCh && typeof mineCh[i] === "number" && mineCh[i] >= 0 ? mineCh[i] : null;
    var d = document.createElement("details"); d.className = "rv-q";
    var ok = mine === q.c;
    d.innerHTML = '<summary><span class="rv-mark ' + (mine === null ? "na" : ok ? "ok" : "bad") + '">' + (mine === null ? "–" : ok ? "✔" : "✘") + '</span> Pregunta ' + (i + 1) + '</summary>' +
      '<div class="rv-body"><p class="rv-q-text">' + rich(q.q) + '</p>' + choiceBars(q, choices ? choices[i] : null, mine) +
      '<div class="reveal-box">💡 ' + rich(q.why) + '</div></div>';
    if(mine !== null && !ok) d.open = true;
    box.appendChild(d);
  });
  parent.appendChild(box);
}

/* ---- Duelo por equipos: promedio de Derecho vs Psicología (el promedio evita que gane el equipo más numeroso) ---- */
function teamBarHTML(teams, unit){
  var D = teams && teams["Derecho"], P = teams && teams["Psicología"];
  if(!D || !P || !D.n || !P.n) return '<div class="team-duel"><h4>⚔️ Duelo por equipos: Derecho vs. Psicología</h4><p class="progress-note" style="margin:0;">Aparecerá cuando haya estudiantes de ambas carreras con puntaje.</p></div>';
  var tot = D.avg + P.avg, pd = tot > 0 ? Math.round(D.avg / tot * 100) : 50;
  var lead = Math.abs(D.avg - P.avg) < 0.05 ? "" : (D.avg > P.avg ? "Derecho" : "Psicología");
  return '<div class="team-duel"><h4>⚔️ Duelo por equipos: Derecho vs. Psicología</h4>' +
    '<div class="team-row"><span class="team-name tm-d' + (lead === "Derecho" ? " lead" : "") + '">⚖️ Derecho</span><span class="team-bar"><span class="tm-fill-d" style="width:' + pd + '%"></span><span class="tm-fill-p" style="width:' + (100 - pd) + '%"></span></span><span class="team-name tm-p' + (lead === "Psicología" ? " lead" : "") + '">🧠 Psicología</span></div>' +
    '<div class="team-nums"><span><strong>' + D.avg + '</strong> ' + (unit || "pts") + ' por persona · ' + D.n + ' jugando</span><span><strong>' + P.avg + '</strong> ' + (unit || "pts") + ' por persona · ' + P.n + ' jugando</span></div>' +
    '<p class="progress-note" style="margin:6px 0 0;">' + (lead ? '🏆 Va ganando <strong>' + lead + '</strong>.' : 'Empate técnico.') + ' Se compara el <strong>promedio</strong> por persona, no el total, para que sea justo si un grupo es más numeroso.</p></div>';
}
function rankTableHTML(rows, mode){
  if(!rows || !rows.length) return '<p class="progress-note">Todavía no hay puntajes registrados.</p>';
  var h = '<div style="overflow-x:auto;"><table class="rank-table"><thead><tr><th>#</th><th>Apodo</th>' + (mode === "round" ? '<th>Aciertos</th><th>Puntos</th>' : '<th>Nivel</th><th>XP</th>') + '</tr></thead><tbody>';
  rows.forEach(function(r){
    var medal = r.pos === 1 ? "🥇" : r.pos === 2 ? "🥈" : r.pos === 3 ? "🥉" : r.pos;
    h += '<tr class="' + (r.me ? "me" : "") + '"><td>' + medal + '</td><td>' + (r.av ? '<span class="rk-av">' + escapeHtml(r.av) + '</span> ' : '') + escapeHtml(r.apodo) + (r.me ? ' <span class="badge up">tú</span>' : "") + '</td>' +
      (mode === "round" ? '<td>' + r.ok + '/' + FLASH_COUNT + '</td><td>' + r.pts + '</td>' : '<td>' + levelFor(r.xp, r.fases >= PHASES.length).name + '</td><td>' + r.xp + '</td>') + '</tr>';
  });
  return h + '</tbody></table></div>';
}
function showRoundRanking(parent, round, mineCh, expectMe){
  var box = el("div"); box.style.marginTop = "14px"; parent.appendChild(box);
  var rv = el("div"); parent.appendChild(rv);
  box.innerHTML = '<p class="progress-note">Cargando el ranking de la ronda…</p>';
  var tries = 0, t0 = Date.now(), timer = null, shownReview = false;
  function load(){
    clearTimeout(timer);
    if(!document.body.contains(box)) return;
    apiCall({action: "ranking", ronda: round, nombre: student.name, carrera: student.carrera}, function(d){
      if(!document.body.contains(box)) return;
      var total = d.total || 0, expected = Math.max(d.expected || 0, total);
      var missingMe = expectMe && !d.me;
      var incomplete = missingMe || (expected > total);
      // Mientras falten resultados, el ranking se vuelve a pedir solo (hasta ~90 s) para que todos terminen viendo lo mismo
      var auto = incomplete && Date.now() - t0 < 90000;
      if(auto){ tries++; timer = setTimeout(load, 8000 + Math.random() * 3000); }
      var mine = d.me ? '<p style="margin:8px 0;">Tu posición en esta ronda: <strong>#' + d.me.pos + ' de ' + total + '</strong></p>' : (missingMe ? '<p class="progress-note">Actualizando tu posición…</p>' : "");
      var prog = expected > 0 ? '<p class="progress-note" style="margin:4px 0 8px;">' + (incomplete ? '⏳ Faltan resultados por llegar: ' : '✅ ') + '<strong>' + total + ' de ' + expected + '</strong> resultado(s) recibidos.' +
        (auto ? ' El ranking se actualiza solo; <strong>las posiciones pueden cambiar</strong> hasta que lleguen todos.' : incomplete ? ' Pulsa «Actualizar» en unos segundos; quien no terminó la ronda no aparece.' : ' Este es el ranking completo.') + '</p>' : "";
      box.innerHTML = '<h4>🏆 Ranking de la ronda</h4>' + mine + prog + teamBarHTML(d.teams, "pts") + rankTableHTML(d.top, "round") + '<button type="button" class="btn sm ghost" id="rr_refresh">Actualizar</button>';
      box.querySelector("#rr_refresh").addEventListener("click", function(){ t0 = Date.now(); load(); });
      rv.innerHTML = ""; reviewBlock(rv, round, mineCh, d.choices && d.choices.length ? d.choices : null);
    }, function(){
      box.innerHTML = '<p class="progress-note">No se pudo cargar el ranking ahora mismo.</p><button type="button" class="btn sm ghost" id="rr_retry">Reintentar</button>';
      box.querySelector("#rr_retry").addEventListener("click", load);
      rv.innerHTML = ""; reviewBlock(rv, round, mineCh, null);
    });
  }
  load();
}

/* ---- Ranking general ---- */
function fetchRanking(cb){
  apiCall({action: "ranking", nombre: student.name, carrera: student.carrera, dayKey: dayKey()}, function(d){
    RANK = {data: d, at: Date.now()}; if(cb) cb(d);
  }, function(){ if(cb) cb(null); });
}
function renderRanking(app){
  var head = el("div", "phase-head");
  head.innerHTML = '<div class="phase-head-row"><span class="phase-head-icon">🏆</span><div><span class="eyebrow" style="color:var(--accent)">Ranking de la clase</span><h2>Tabla de posiciones</h2></div></div>' +
    '<p style="color:var(--ink-soft)">Se ordena por XP (retos resueltos + bonos de fase + retos relámpago). Solo se muestran apodos, nunca nombres completos.</p>';
  app.appendChild(head);
  var xpNow = totalXP(), lv = currentLevelInfo(xpNow), nxt = nextLevelInfo(xpNow);
  var mine = el("div", "panel");
  mine.innerHTML = '<h3>Tu estado</h3><div class="stat-grid" style="margin:8px 0 0;">' +
    '<div class="stat-tile"><div class="num">' + xpNow + '</div><div class="lbl">XP totales</div></div>' +
    '<div class="stat-tile"><div class="num" style="font-size:1.15rem;">' + lv.name + '</div><div class="lbl">Tu nivel' + nextLevelText(xpNow) + '</div></div>' +
    '<div class="stat-tile"><div class="num" id="rk_pos">…</div><div class="lbl">Tu posición</div></div></div>';
  app.appendChild(mine);
  var tbl = el("div", "panel"); tbl.style.marginTop = "16px"; app.appendChild(tbl);
  tbl.innerHTML = '<p class="progress-note">Cargando ranking…</p>';
  var timer = null;
  function load(){
    fetchRanking(function(d){
      if(!document.body.contains(tbl)) return;
      if(!d){ tbl.innerHTML = '<p class="progress-note">No se pudo cargar el ranking (¿sin conexión?). Tu progreso sigue guardado en este navegador.</p><button class="btn sm" type="button" id="rk_retry">Reintentar</button>'; tbl.querySelector("#rk_retry").addEventListener("click", load); return; }
      var pos = d.me ? "#" + d.me.pos + " / " + d.total : "—";
      var pe = document.getElementById("rk_pos"); if(pe) pe.textContent = pos;
      tbl.innerHTML = teamBarHTML(d.teams, "XP") + '<h3>Top 10</h3>' + rankTableHTML(d.top, "xp") +
        (d.me && d.me.pos > 10 ? '<p style="margin-top:8px;">Tú vas en el puesto <strong>#' + d.me.pos + '</strong> de ' + d.total + ' con ' + d.me.xp + ' XP.</p>' : "") +
        '<button class="btn sm ghost" type="button" id="rk_refresh" style="margin-top:8px;">Actualizar</button>';
      tbl.querySelector("#rk_refresh").addEventListener("click", load);
    });
  }
  load();
  clearInterval(renderRanking._t);
  renderRanking._t = setInterval(function(){ if(route === "ranking" && !document.hidden) load(); else if(route !== "ranking") clearInterval(renderRanking._t); }, 30000);
}

/* ---- Panel docente (solo con PIN): sala por fase, ritmo de la clase y seguimiento ---- */
var DOC = {pin: ""};
function agoText(ms){
  if(!ms) return "—";
  var m = Math.round((serverNow() - ms) / 60000);
  if(m < 1) return "ahora";
  if(m < 60) return "hace " + m + " min";
  var h = Math.round(m / 60);
  if(h < 24) return "hace " + h + " h";
  return "hace " + Math.round(h / 24) + " d";
}
function renderDocente(app){
  var head = el("div", "phase-head");
  head.innerHTML = '<div class="phase-head-row"><span class="phase-head-icon">🎛️</span><div><span class="eyebrow" style="color:var(--accent)">Panel docente</span><h2>Controla la clase</h2></div></div>' +
    '<p style="color:var(--ink-soft)">Solo tú (con el PIN) abres y cierras la sala relámpago de cada fase y marcas el ritmo de la clase. Los estudiantes solo participan. El PIN está en tu archivo Code.gs.</p>';
  app.appendChild(head);
  var box = el("div", "panel"); app.appendChild(box);
  if(!DOC.pin){
    box.innerHTML = '<label for="doc_pin" style="font-weight:600;">PIN del docente</label><div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:6px;"><input type="password" id="doc_pin" autocomplete="off" style="padding:10px 12px;border:1.5px solid var(--line);border-radius:8px;background:var(--surface);color:var(--ink);font-size:1.05rem;"><button type="button" class="btn primary" id="doc_go">Entrar</button></div><p class="progress-note" id="doc_err" style="color:var(--danger);display:none;margin-top:8px;"></p>';
    function tryPin(){
      var pin = box.querySelector("#doc_pin").value;
      apiCall({action: "flashControl", cmd: "status", pin: pin}, function(){ DOC.pin = pin; goTo("docente"); }, function(err){
        var e = box.querySelector("#doc_err"); e.style.display = "block";
        e.textContent = connErrorText(err);
      });
    }
    box.querySelector("#doc_go").addEventListener("click", tryPin);
    box.querySelector("#doc_pin").addEventListener("keydown", function(ev){ if(ev.key === "Enter") tryPin(); });
    return;
  }
  var selStyle = 'width:100%;padding:10px;border:1.5px solid var(--line);border-radius:8px;background:var(--surface);color:var(--ink);font-size:1rem;';
  var phaseOpts = FLASH_ROUNDS.map(function(r){ return '<option value="' + r.id + '">' + r.title + '</option>'; }).join("");
  box.innerHTML =
    '<h3>⚡ 1 · Sala relámpago</h3>' +
    '<div class="doc-grid"><div><label for="doc_round" style="font-weight:600;">Ronda (una por fase)</label><select id="doc_round" style="' + selStyle + '">' + phaseOpts + '</select></div>' +
    '<div><label for="doc_qsec" style="font-weight:600;">Tiempo por pregunta</label><select id="doc_qsec" style="' + selStyle + '">' +
      '<option value="60">1 minuto (ronda de 5 min)</option><option value="90">1½ minutos (ronda de 7½ min)</option><option value="120" selected>2 minutos (ronda de 10 min)</option></select></div></div>' +
    '<div class="doc-status" id="doc_status" style="margin-top:12px;">Cargando…</div>' +
    '<div class="doc-btns"><button class="btn" type="button" id="doc_open">1 · Abrir sala y avisar</button>' +
    '<button class="btn primary" type="button" id="doc_start">2 · ¡Iniciar! (cuenta regresiva 12 s)</button>' +
    '<button class="btn ghost" type="button" id="doc_close">Cerrar sala</button></div>' +
    '<div class="doc-live" id="doc_live" hidden></div>' +
    '<div class="doc-btns"><button class="btn" type="button" id="doc_next" disabled>⏭ Siguiente pregunta</button></div>' +
    '<p class="progress-note" style="margin-top:6px;" id="doc_next_note" hidden>Úsalo cuando casi todos hayan respondido: toda la clase pasa a la siguiente pregunta (verán la explicación de las que respondieron). En la última pregunta termina la ronda.</p>' +
    '<p class="progress-note" style="margin-top:8px;">El tiempo se elige al abrir la sala. Cada acierto vale 6 XP + hasta 4 XP por rapidez; en empate gana quien acertó en menos tiempo.</p>' +
    '<div id="doc_rank" style="margin-top:16px;"></div><div id="doc_res" style="margin-top:16px;"></div>';
  var pace = el("div", "panel"); pace.style.marginTop = "16px"; app.appendChild(pace);
  pace.innerHTML =
    '<h3>📍 2 · Ritmo de la clase</h3>' +
    '<p style="color:var(--ink-soft);margin-top:0;">Marca en qué fase y reto va el grupo. Los estudiantes lo ven en cada fase («La clase va en Fase 3 · Reto 2») y quienes van atrasados reciben un botón para alcanzarla.</p>' +
    '<div class="doc-grid"><div><label for="pc_phase" style="font-weight:600;">Fase</label><select id="pc_phase" style="' + selStyle + '">' +
      PHASES.map(function(ph){ return '<option value="' + ph.id + '">Fase ' + ph.id + ' · ' + ph.label + '</option>'; }).join("") + '</select></div>' +
    '<div><label for="pc_mis" style="font-weight:600;">Reto / ejercicio (opcional)</label><input type="number" id="pc_mis" min="0" max="9" placeholder="Ej. 2" inputmode="numeric" style="' + selStyle + '"></div></div>' +
    '<div class="doc-btns"><button class="btn primary" type="button" id="pc_set">📍 Marcar ritmo</button><button class="btn ghost" type="button" id="pc_clear">Quitar marca</button></div>' +
    '<p class="progress-note" id="pc_now" style="margin-top:10px;">Ritmo actual: sin marcar.</p>';
  var dp = el("div", "panel"); dp.style.marginTop = "16px"; app.appendChild(dp);
  dp.innerHTML =
    '<h3>🥊 3 · Duelo Discreto vs. Continuo</h3>' +
    '<p style="color:var(--ink-soft);margin-top:0;">Elige un duelo, lanza la votación (la clase decide cuál oferta conviene), mira cuántos votaron cada opción y luego revela el cálculo. Funciona aunque la sala relámpago esté cerrada.</p>' +
    '<label for="du_sel" style="font-weight:600;">Duelo</label><select id="du_sel" style="' + selStyle + '">' + DUELS.map(function(d){ return '<option value="' + d.id + '">' + d.id.toUpperCase() + ' · ' + d.title + '</option>'; }).join("") + '</select>' +
    '<div class="doc-btns"><button class="btn primary" type="button" id="du_vote">1 · Lanzar votación</button><button class="btn" type="button" id="du_rev">2 · Revelar resultado</button><button class="btn ghost" type="button" id="du_off">Cerrar duelo</button></div>' +
    '<div class="doc-status" id="du_state" style="margin-top:10px;">Sin duelo activo.</div><div id="du_tally"></div>';
  var prog = el("div", "panel"); prog.style.marginTop = "16px"; app.appendChild(prog);
  prog.innerHTML = '<h3>👥 4 · Seguimiento de la clase</h3><div id="pg_body"><p class="progress-note">Cargando…</p></div>' +
    '<button class="btn sm ghost" type="button" id="pg_refresh" style="margin-top:8px;">Actualizar ahora</button>';

  var refl = el("div", "panel"); refl.style.marginTop = "16px"; app.appendChild(refl);
  refl.innerHTML = '<h3>💬 5 · Reflexiones de los estudiantes</h3><p style="color:var(--ink-soft);margin-top:0;">Al terminar cada fase, cada estudiante escribe una frase. Aquí las lees, por fase, para abrir el siguiente momento de clase.</p>' +
    '<label for="rf_phase" style="font-weight:600;">Fase</label><select id="rf_phase" style="' + selStyle + '"><option value="all">Todas</option>' +
    PHASES.map(function(ph){ return '<option value="' + ph.key + '">Fase ' + ph.id + ' · ' + ph.label + '</option>'; }).join("") + '</select>' +
    '<div class="doc-btns"><button class="btn sm" type="button" id="rf_load">Cargar reflexiones</button></div><div id="rf_body" style="margin-top:12px;"><p class="progress-note">Pulsa «Cargar reflexiones».</p></div>';
  var reflData = null;
  function paintRefl(){
    var host = refl.querySelector("#rf_body");
    if(!reflData){ return; }
    var want = refl.querySelector("#rf_phase").value, h = "", n = 0;
    PHASES.forEach(function(ph){
      if(want !== "all" && want !== ph.key) return;
      var items = [];
      reflData.rows.forEach(function(r){ r.items.forEach(function(it){ if(it.fase === ph.key) items.push({who: r.apodo || r.nombre, full: r.nombre, t: it.t}); }); });
      if(!items.length) return;
      n += items.length;
      h += '<h4 style="margin:12px 0 6px;">Fase ' + ph.id + ' · ' + ph.label + ' <span class="badge">' + items.length + '</span></h4>' +
        items.map(function(it){ return '<div class="rf-item"><span class="rf-who">' + escapeHtml(it.full) + '</span><span>' + escapeHtml(it.t) + '</span></div>'; }).join("");
    });
    host.innerHTML = n ? h : '<p class="progress-note">Todavía no hay reflexiones para esta selección.</p>';
  }
  function loadRefl(){
    apiCall({action: "reflections", pin: DOC.pin}, function(d){ reflData = d; paintRefl(); },
      function(){ refl.querySelector("#rf_body").innerHTML = '<p class="progress-note">No se pudo cargar (¿pegaste y volviste a implementar el Code.gs más reciente?).</p>'; });
  }
  refl.querySelector("#rf_load").addEventListener("click", loadRefl);
  refl.querySelector("#rf_phase").addEventListener("change", paintRefl);

  var lastState = null, lastPlay = null, sendBusy = false, sendFails = 0;
  function send(cmd, extra){
    var isStatus = cmd === "status";
    if(isStatus && sendBusy) return;   // no apilar consultas si la anterior sigue en camino
    var payload = {action: "flashControl", cmd: cmd, pin: DOC.pin, round: parseInt(box.querySelector("#doc_round").value, 10)};
    for(var k in (extra || {})) payload[k] = extra[k];
    if(isStatus) sendBusy = true;
    apiCall(payload, function(d){ sendBusy = false; sendFails = 0; paint(d); }, function(err){
      sendBusy = false; sendFails++;
      var st = box.querySelector("#doc_status");
      if(st) st.innerHTML = "⚠️ " + escapeHtml(connErrorText(err)) + (isStatus ? "" : " <strong>La orden no llegó: vuelve a pulsar el botón.</strong>") + (sendFails > 1 ? "<br>Reintentando solo…" : "");
    });
  }
  function paint(d){
    if(!document.body.contains(box)) return;
    var st = d.state; lastState = st;
    var label = {idle: "Cerrada", lobby: "Abierta (esperando inicio)", running: "En curso"}[st.status] || st.status;
    box.querySelector("#doc_status").innerHTML = 'Estado: <strong>' + label + '</strong> · ' + FLASH_ROUNDS[st.round - 1].title +
      (st.status !== "idle" ? '<br>⏱ <strong>' + fmtDur(qsecOf(st)) + '</strong> por pregunta · ronda de ' + fmtDur(qsecOf(st) * FLASH_COUNT) : '') +
      '<br>Conectados: <strong>' + d.connected + '</strong>';
    var sel = box.querySelector("#doc_round");
    if(st.status !== "idle" || !sel._touched) sel.value = st.round;
    var qsel = box.querySelector("#doc_qsec");
    if(st.status !== "idle" && st.qsec && !qsel._touched) qsel.value = String(st.qsec);
    box.querySelector("#doc_start").disabled = st.status !== "lobby";
    box.querySelector("#doc_rank").innerHTML = '<h4>🏆 Ranking de la ronda ' + st.round + ' (' + d.played + (d.expected > d.played ? ' de ' + d.expected : '') + ' resultados recibidos)</h4>' + (d.expected > d.played ? '<p class="progress-note" style="margin:0 0 6px;">⏳ Aún llegan resultados: este ranking cambia hasta completarse. Espera ~15 s antes de mostrarlo a la clase.</p>' : '') + teamBarHTML(d.teams, "pts") + rankTableHTML(d.roundRanking, "round");
    lastPlay = d.play || null;
    paintResults(st.round, d.choices, d.played);
    paintLive();
    var pn = pace.querySelector("#pc_now");
    if(st.pace){
      var ph = PHASES[st.pace.phase - 1];
      pn.innerHTML = '📍 Ritmo actual: <strong>Fase ' + st.pace.phase + ' · ' + (ph ? ph.label : "") + (st.pace.mission ? ' · Reto ' + st.pace.mission : '') + '</strong> (marcado ' + agoText(st.pace.at) + ').';
    } else pn.textContent = "Ritmo actual: sin marcar.";
    paintProgress();
    paintDuelDoc(st.duel || null, d.tally);
  }
  function paintResults(round, choices, played){
    var host = box.querySelector("#doc_res");
    var qs = FLASH_ROUNDS[round - 1].qs;
    if(!choices || !choices.length || !played){ host.innerHTML = '<h4>📊 Resultados por pregunta</h4><p class="progress-note">Aparecerán aquí cuando los estudiantes terminen la ronda.</p>'; return; }
    var h = '<h4>📊 Resultados por pregunta (ronda ' + round + ')</h4><p class="progress-note" style="margin-top:0;">Mira qué opción eligió la clase: una incorrecta muy elegida señala qué repasar.</p>';
    qs.forEach(function(q, i){
      var counts = choices[i] || [], tot = 0; counts.forEach(function(n, k){ if(k < q.o.length) tot += n; });
      var pc = tot ? Math.round(100 * (counts[q.c] || 0) / tot) : 0;
      h += '<details class="rv-q"' + (tot && pc < 60 ? ' open' : '') + '><summary><span class="rv-mark ' + (pc >= 60 ? "ok" : "bad") + '">' + pc + '%</span> Pregunta ' + (i + 1) + ' · ' + (counts[q.c] || 0) + '/' + tot + ' acertaron</summary><div class="rv-body"><p class="rv-q-text">' + rich(q.q) + '</p>' + choiceBars(q, counts, -1) + '</div></details>';
    });
    host.innerHTML = h;
  }
  function paintLive(){
    var st = lastState, nx = box.querySelector("#doc_next"), lv = box.querySelector("#doc_live"), note = box.querySelector("#doc_next_note");
    if(!nx || !lv) return;
    if(!st || st.status !== "running"){ lv.hidden = true; note.hidden = true; nx.disabled = true; nx.textContent = "⏭ Siguiente pregunta"; return; }
    note.hidden = false; lv.hidden = false;
    var now = serverNow(), b = flashBounds(st);
    if(now < b[0]){ lv.innerHTML = '⏳ Cuenta regresiva: <strong>' + Math.ceil((b[0] - now) / 1000) + ' s</strong>'; nx.disabled = true; return; }
    var qi = FLASH_COUNT;
    for(var k = 0; k < FLASH_COUNT; k++){ if(now < b[k + 1]){ qi = k; break; } }
    if(qi >= FLASH_COUNT){ lv.innerHTML = '🏁 <strong>La ronda terminó.</strong> Mira el ranking y los resultados por pregunta; cierra la sala cuando quieras.'; nx.disabled = true; nx.textContent = "⏭ Siguiente pregunta"; return; }
    var same = lastPlay && lastPlay.qi === qi;
    lv.innerHTML = 'Pregunta <strong>' + (qi + 1) + '/' + FLASH_COUNT + '</strong> · ⏱ quedan <strong>' + mmss(b[qi + 1] - now) + '</strong> · Ya respondieron <strong>' + (same ? lastPlay.answered : "…") + '</strong> de <strong>' + (same ? lastPlay.playing : "…") + '</strong> jugando';
    nx.disabled = !!nx._cool;
    nx.dataset.q = String(qi);
    nx.textContent = qi === FLASH_COUNT - 1 ? "🏁 Terminar la ronda" : "⏭ Siguiente pregunta (pasar a la " + (qi + 2) + ")";
  }
  box.querySelector("#doc_next").addEventListener("click", function(ev){
    var nx = ev.currentTarget;
    nx._cool = true; nx.disabled = true; setTimeout(function(){ nx._cool = false; paintLive(); }, 1800);
    send("next", {from: parseInt(nx.dataset.q, 10)});
  });
  box.querySelector("#doc_round").addEventListener("change", function(ev){ ev.target._touched = true; });
  box.querySelector("#doc_qsec").addEventListener("change", function(ev){ ev.target._touched = true; });
  box.querySelector("#doc_open").addEventListener("click", function(){ send("open", {qsec: parseInt(box.querySelector("#doc_qsec").value, 10) || DEFAULT_QSEC}); });
  box.querySelector("#doc_start").addEventListener("click", function(){ send("start"); });
  box.querySelector("#doc_close").addEventListener("click", function(){ send("close"); });
  pace.querySelector("#pc_set").addEventListener("click", function(){
    var ph = parseInt(pace.querySelector("#pc_phase").value, 10);
    var sel = box.querySelector("#doc_round"); if(lastState && lastState.status === "idle"){ sel.value = ph; sel._touched = true; }
    send("pace", {phase: ph, mission: parseInt(pace.querySelector("#pc_mis").value, 10) || 0});
  });
  pace.querySelector("#pc_clear").addEventListener("click", function(){ send("paceClear"); });

  function paintDuelDoc(du, tally){
    var stEl = dp.querySelector("#du_state"), tl = dp.querySelector("#du_tally");
    if(!du){ stEl.innerHTML = "Sin duelo activo."; tl.innerHTML = ""; return; }
    var d = duelById(du.id);
    if(!d){ stEl.textContent = "Duelo desconocido."; return; }
    var cal = duelCalc(d), t = tally || {a: 0, b: 0, c: 0}, tot = t.a + t.b + t.c;
    stEl.innerHTML = 'Duelo <strong>' + d.id.toUpperCase() + '</strong> · ' + escapeHtml(d.title) + ' · etapa: <strong>' + (du.stage === "vote" ? "votando" : "resultado revelado") + '</strong>' +
      '<br>Cálculo (solo para ti): A = ' + sol(cal.ma, 2) + ' · B = ' + sol(cal.mb, 2) + ' · conviene <strong>' + (cal.win === "a" ? d.a.name : d.b.name) + '</strong>.';
    var rows = [["a", d.a.name], ["b", d.b.name], ["c", "Empatan / no sé"]].map(function(x){
      var n = t[x[0]] || 0, pct = tot ? Math.round(100 * n / tot) : 0;
      return '<div class="vote-row"><span>' + escapeHtml(x[1]) + '</span><span class="vote-bar"><span style="width:' + pct + '%"></span></span><span class="mono">' + n + ' · ' + pct + '%</span></div>';
    }).join("");
    tl.innerHTML = '<h4 style="margin:12px 0 4px;">Votos de la clase (' + tot + ')</h4>' + rows;
  }
  dp.querySelector("#du_vote").addEventListener("click", function(){ send("duel", {stage: "vote", id: dp.querySelector("#du_sel").value}); });
  dp.querySelector("#du_rev").addEventListener("click", function(){ send("duel", {stage: "reveal", id: dp.querySelector("#du_sel").value}); });
  dp.querySelector("#du_off").addEventListener("click", function(){ send("duel", {stage: "off"}); });

  var progData = null, progBusy = false;
  function paintProgress(){
    var host = prog.querySelector("#pg_body");
    if(!progData){ return; }
    var rows = progData.rows, pc = lastState && lastState.pace ? lastState.pace.phase : 0;
    var behind = 0;
    var cards = rows.map(function(r){
      var late = pc && r.pendiente < pc; if(late) behind++;
      var cells = r.porFase.map(function(n, i){
        var tot = progData.totals[progData.phases[i]];
        var cls = n >= tot ? "pd done" : (n > 0 ? "pd part" : "pd");
        return '<span class="' + cls + '" title="Fase ' + (i + 1) + ': ' + n + '/' + tot + '">' + (i + 1) + '</span>';
      }).join("");
      return '<div class="sg-card' + (late ? " late" : "") + '"><div class="sg-name"><strong>' + escapeHtml(r.nombre) + '</strong><span class="progress-note">' + escapeHtml(r.carrera) + '</span></div>' +
        '<div class="pd-row">' + cells + '</div>' +
        '<div class="sg-meta"><span>Retos <strong>' + r.misiones + '/' + progData.totalMisiones + '</strong></span><span><strong>' + r.xp + '</strong> XP</span><span>' + agoText(r.ultima) + '</span></div></div>';
    }).join("");
    host.innerHTML = '<p style="margin:0 0 8px;"><strong>' + rows.length + '</strong> estudiante(s) registrados' + (pc ? ' · <strong>' + behind + '</strong> por detrás de la Fase ' + pc + ' (resaltados)' : '') + '.</p>' +
      '<div class="sg-grid">' + cards + '</div>' +
      '<p class="progress-note">Cuadros 1–6 = fases: verde completa · ámbar en curso. Los datos llegan cuando cada estudiante avanza (se guardan en la nube).</p>';
  }
  function loadProgress2(){
    if(progBusy) return;
    progBusy = true;
    apiCall({action: "classProgress", pin: DOC.pin}, function(d){ progBusy = false; progData = d; paintProgress(); },
      function(err){ progBusy = false; if(progData) return;   // si ya había datos, se conservan en pantalla
        prog.querySelector("#pg_body").innerHTML = '<p class="progress-note">⚠️ No se pudo cargar el seguimiento. ' + escapeHtml(connErrorText(err)) + '</p>'; });
  }
  prog.querySelector("#pg_refresh").addEventListener("click", loadProgress2);
  send("status");
  loadProgress2();
  clearInterval(renderDocente._t); clearInterval(renderDocente._t2); clearInterval(renderDocente._t3);
  var tick = 0;
  renderDocente._t = setInterval(function(){
    if(route !== "docente"){ clearInterval(renderDocente._t); return; }
    tick++;
    // durante una ronda se consulta más seguido (para ver cuántos respondieron); en reposo, cada ~5 s
    var running = lastState && lastState.status === "running";
    if(!document.hidden && (running || tick % 2 === 0)) send("status");
  }, 2500);
  renderDocente._t3 = setInterval(function(){ if(route !== "docente"){ clearInterval(renderDocente._t3); return; } paintLive(); }, 1000);
  renderDocente._t2 = setInterval(function(){ if(route !== "docente"){ clearInterval(renderDocente._t2); return; } if(!document.hidden) loadProgress2(); }, 15000);
}

/* ---- Pregunta del día ---- */
var QDAY = [
  {q:"Una cooperativa anuncia: «Capitalización continua: tu dinero crece sin parar». ¿Qué haces?", o:{a:"Pido el cálculo del monto máximo", b:"Firmo: suena moderno", c:"Comparo con otras ofertas primero"},
   r:"Crecer sin parar sí, crecer sin límite no. S/ 1 000 al $8\\,\\%$ durante $3$ años tienen un techo de " + sol(Mcont(1000, 0.08, 3), 2) + " aunque se capitalice «en cada instante»."},
  {q:"Un banco paga $6\\,\\%$ continuo y otro $6.1\\,\\%$ anual. ¿Cuál te parece mejor?", o:{a:"El de 6.1 % anual", b:"El de 6 % continuo", c:"Calculo las tasas efectivas"},
   r:"El $6\\,\\%$ continuo equivale a ≈ " + ((Math.exp(0.06) - 1) * 100).toFixed(2) + " % anual: ¡supera al $6.1\\,\\%$! Pero con $6\\,\\%$ continuo frente a $6.2\\,\\%$ anual ya ganaría el anual."},
  {q:"Tu primer sueldo: ¿empiezas a ahorrar S/ 100 desde ya o esperas diez años? (supón $6\\,\\%$ continuo)", o:{a:"Desde ya, aunque sea poco", b:"Cuando gane más", c:"Prefiero invertir en mis estudios"},
   r:"S/ 100 durante $40$ años llegan a " + sol(Mcont(100, 0.06, 40), 2) + "; si esperas $10$ años, solo a " + sol(Mcont(100, 0.06, 30), 2) + ". El tiempo es el ingrediente más caro del interés."},
  {q:"Una financiera cobra $36\\,\\%$ anual con capitalización continua. ¿Debería la ley limitar ese tipo de intereses?", o:{a:"Sí, para proteger al deudor", b:"No, es libertad de contrato", c:"Depende del tipo de préstamo"},
   r:"Una deuda de S/ 1 000 llegaría en $3$ años a " + sol(Mcont(1000, 0.36, 3), 2) + ": casi el triple. Entender el cálculo es el primer paso para opinar con argumentos sobre usura y tasas máximas."},
  {q:"Alguien te promete duplicar tu dinero en $5$ años al $6\\,\\%$ continuo. ¿Le crees?", o:{a:"No: suena exagerado", b:"Sí, es continuo", c:"Pido el contrato y calculo"},
   r:"El techo para S/ 1 000 sería " + sol(Mcont(1000, 0.06, 5), 2) + ", no S/ 2 000. Para duplicar en 5 años haría falta una tasa continua cercana al $13.9\\,\\%$. El detector de ofertas exageradas sirve en la vida real."},
  {q:"Mejorar un hábito $1\\,\\%$ cada día de forma «continua» (estudiar, dormir, practicar). ¿Crees que funciona?", o:{a:"Sí: lo pequeño se acumula", b:"Es solo una frase motivacional", c:"Funciona, pero con altibajos"},
   r:"Como analogía, $e^{0.01\\cdot365}\\approx" + Math.exp(3.65).toFixed(1) + "$ frente a $1.01^{365}\\approx" + Math.pow(1.01, 365).toFixed(1) + "$: casi lo mismo. Pero es solo una analogía: las personas no crecen siempre al mismo ritmo, y está bien."},
  {q:"Una clínica necesita S/ 20 000 en $5$ años y el banco paga $6\\,\\%$ continuo. ¿Cuánto crees que debe depositar hoy?", o:{a:"Unos S/ 10 000", b:"Unos S/ 15 000", c:"Unos S/ 19 000"},
   r:"$20000\\,e^{-0.3}=" + sol(pvCont(20000, 0.06, 5), 2) + "$. El valor presente siempre es menor que la meta, pero menos de lo que muchos creen."},
  {q:"Tu cliente debe cobrar S/ 10 000 dentro de $4$ años y le ofrecen pagarle hoy la mitad. Con $5\\,\\%$ continuo, ¿aceptas por él?", o:{a:"Sí, dinero hoy es mejor", b:"No, vale bastante más", c:"Negocio una cifra intermedia"},
   r:"El valor presente es " + sol(pvCont(10000, 0.05, 4), 2) + ". Aceptar S/ 5 000 sería perder unos " + sol(pvCont(10000, 0.05, 4) - 5000, 2) + " de valor. Negociar cerca del valor presente es lo razonable."}
];
function dayKey(){
  var d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function todaysQuestion(){
  var d = new Date();
  var n = Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 86400000);
  return QDAY[n % QDAY.length];
}
function renderQDay(parent){
  var q = todaysQuestion(), dk = dayKey();
  var card = el("div", "panel qday");
  parent.appendChild(card);
  function draw(){
    var mine = progress._pregunta && progress._pregunta[dk];
    card.innerHTML = '<h3>💬 Pregunta del día</h3><p style="font-weight:600;">' + rich(q.q) + '</p>';
    if(!mine){
      var g = el("div", "choice-grid");
      ["a", "b", "c"].forEach(function(k){
        var b = el("button", "choice", rich(q.o[k])); b.type = "button";
        b.addEventListener("click", function(){
          if(!progress._pregunta) progress._pregunta = {};
          progress._pregunta[dk] = k; saveProgress(); syncSaveToSheet();
          draw();
          fetchRanking(function(){ if(document.body.contains(card)) draw(); });
        });
        g.appendChild(b);
      });
      card.appendChild(g);
    } else {
      var tally = RANK.data && RANK.data.tally, tot = tally ? (tally.a + tally.b + tally.c) : 0;
      var html = "";
      ["a", "b", "c"].forEach(function(k){
        var pct = tot ? Math.round(tally[k] / tot * 100) : null;
        html += '<div class="vote-row' + (k === mine ? " mine" : "") + '"><span>' + q.o[k] + (k === mine ? " ✔" : "") + '</span>' +
          (pct !== null ? '<span class="vote-bar"><span style="width:' + pct + '%"></span></span><span class="mono">' + pct + '%</span>' : "") + '</div>';
      });
      card.innerHTML += html + '<div class="reveal-box" style="margin-top:12px;">' + mascotBadge("hint", 30, "mascot-inline") + ' ' + rich(q.r) + '</div>' +
        (tot ? '<p class="progress-note">' + tot + ' estudiante(s) han respondido hoy. No hay respuesta "correcta": lo importante es argumentarla.</p>' : '<p class="progress-note">No hay respuesta "correcta": lo importante es argumentarla en voz alta con tu grupo.</p>');
    }
  }
  draw();
  return draw;
}

/* ---- Tarjetas de la sala y del ranking en el mapa ---- */
function renderMapExtras(app){
  var pc = el("div", "strip pace hidden"); app.appendChild(pc); registerStrip(pc, "pace", 0);
  var duelH = el("div", "duel-host"); duelH.hidden = true; app.appendChild(duelH); paintDuel(duelH);
  if(typeof youthMapPanel === "function") youthMapPanel(app);
  var row = el("div", "extras-grid"); app.appendChild(row);
  var qdraw = renderQDay(row);
  var live = el("div", "panel live-card");
  var xpNow = totalXP(), lv = currentLevelInfo(xpNow);
  live.innerHTML = '<h3>⚡ Sala en vivo y ranking</h3>' +
    '<p id="mx_status">Cuando tu docente abra la sala, aparecerá un aviso aquí y arriba.</p>' +
    '<p style="margin:0 0 10px;"><strong>' + lv.name + '</strong> · <span class="mono">' + xpNow + ' XP</span> · tu posición: <strong id="mx_pos">…</strong></p>' +
    '<div style="display:flex;gap:10px;flex-wrap:wrap;"><button type="button" class="btn primary sm" id="mx_live">Ir a la sala</button><button type="button" class="btn sm" id="mx_rank">Ver ranking</button></div>';
  row.appendChild(live);
  live.querySelector("#mx_live").addEventListener("click", function(){ goTo("live"); });
  live.querySelector("#mx_rank").addEventListener("click", function(){ goTo("ranking"); });
  function paintStatus(){
    var st = API.state, m = document.getElementById("mx_status");
    if(!m) return;
    if(st && st.status === "lobby") m.innerHTML = '<span class="badge up"><span class="pulse-dot"></span> Sala abierta</span> ¡Entra ahora!';
    else if(st && st.status === "running") m.innerHTML = '<span class="badge up"><span class="pulse-dot"></span> Ronda en curso</span> ¡Entra ahora!';
  }
  paintStatus();
  fetchRanking(function(d){
    if(!document.body.contains(live)) return;
    var p = document.getElementById("mx_pos");
    if(p) p.textContent = (d && d.me) ? "#" + d.me.pos + " de " + d.total : "—";
    paintStatus();
    if(progress._pregunta && progress._pregunta[dayKey()]) qdraw();
  });
}

/* ============================================================
   DUELO DE BANCOS · la clase vota, el docente revela el cálculo
   (usa el mismo mecanismo de voto que la pregunta del día)
============================================================ */
var DUELS = [
  {id:"d1", title:"Un número más bajo que gana", ctx:"Una pareja de abogados invierte los honorarios de su primer caso para comprar su oficina.", C:10000, t:3,
   a:{name:"Banco Andino", r:0.08, n:1}, b:{name:"Banco del Sol", r:0.079, n:0}},
  {id:"d2", title:"Diaria contra continua: ¿cuánto las separa?", ctx:"Una psicóloga ahorra para equipar su consultorio. Dos entidades prometen la misma tasa, pero capitalizan distinto.", C:20000, t:5,
   a:{name:"Caja Diaria", r:0.06, n:360}, b:{name:"Financiera Continua", r:0.06, n:0}},
  {id:"d3", title:"El continuo no es magia", ctx:"Un estudio jurídico guarda un fondo de capacitación. Una oferta es continua; la otra tiene una tasa algo mayor, pero anual.", C:10000, t:10,
   a:{name:"Banco Anual", r:0.052, n:1}, b:{name:"Banco Continuo", r:0.05, n:0}},
  {id:"d4", title:"Trimestral contra continua", ctx:"Una clínica de salud mental separa un fondo de becas para pacientes sin recursos.", C:15000, t:4,
   a:{name:"Caja Trimestral", r:0.072, n:4}, b:{name:"Caja Continua", r:0.07, n:0}},
  {id:"d5", title:"La tasa menor que gana", ctx:"Una indemnización de S/ 30 000 se deposita mientras se resuelve una apelación de 2 años.", C:30000, t:2,
   a:{name:"Banco Litigio", r:0.12, n:1}, b:{name:"Banco Expediente", r:0.118, n:0}},
  {id:"d6", title:"Mensual contra continua", ctx:"Una ONG de apoyo psicológico ahorra durante 6 años para abrir una nueva sede.", C:8000, t:6,
   a:{name:"Banco Comunitario", r:0.093, n:12}, b:{name:"Banco Digital", r:0.09, n:0}}
];
var CAPNAME = {0: "continua", 1: "anual", 2: "semestral", 3: "cuatrimestral", 4: "trimestral", 6: "bimestral", 12: "mensual", 360: "diaria"};
function duelById(id){ for(var i = 0; i < DUELS.length; i++){ if(DUELS[i].id === id) return DUELS[i]; } return null; }
function offerM(C, o, t){ return o.n === 0 ? Mcont(C, o.r, t) : Mcomp(C, o.r, o.n, t); }
function offerTex(C, o, t){
  var c = nsep(C, 0).replace(/[\u00a0 ]/g, "\\,");
  return o.n === 0 ? c + "\\,e^{" + fmt(o.r * t, 4) + "}" : c + "\\left(1+\\tfrac{" + o.r + "}{" + o.n + "}\\right)^{" + (o.n * t) + "}";
}
function duelCalc(d){
  var ma = offerM(d.C, d.a, d.t), mb = offerM(d.C, d.b, d.t);
  return {ma: ma, mb: mb, win: Math.abs(ma - mb) < 0.005 ? "c" : (ma > mb ? "a" : "b"), diff: Math.abs(ma - mb)};
}
function duelOfferHTML(o, d, letter, extraCls){
  return '<div class="duel-offer' + (extraCls || "") + '"><span class="duel-letter">' + letter + '</span><strong>' + escapeHtml(o.name) + '</strong>' +
    '<span class="duel-rate">' + (o.r * 100).toFixed(o.r * 100 % 1 === 0 ? 0 : 1) + ' % anual</span><span class="duel-cap">' + (o.n === 0 ? "capitalización continua" : "capitalizable " + CAPNAME[o.n]) + '</span></div>';
}
var DUEL_TALLY = {};
function fetchDuelTally(id, cb){
  apiCall({action: "ranking", nombre: student.name, carrera: student.carrera, dayKey: id}, function(d){ DUEL_TALLY[id] = d.tally || {a: 0, b: 0, c: 0}; if(cb) cb(); }, function(){ if(cb) cb(); });
}
function paintDuel(host){
  var du = API.state && API.state.duel;
  host._dsig = du ? du.id + ":" + du.stage : "";
  var d = du ? duelById(du.id) : null;
  if(!d){ host.hidden = true; host.innerHTML = ""; return; }
  host.hidden = false;
  var cal = duelCalc(d), mine = progress._pregunta && progress._pregunta[d.id];
  var h = '<div class="duel-card"><div class="duel-top"><span class="badge up"><span class="pulse-dot"></span> ' + (du.stage === "vote" ? "Votación abierta" : "Resultado") + '</span><h3>🥊 Duelo Discreto vs. Continuo: ' + escapeHtml(d.title) + '</h3></div>' +
    '<p>' + rich(escapeHtml(d.ctx)) + ' Capital: <strong>' + sol(d.C, 0) + '</strong> · Plazo: <strong>' + d.t + ' años</strong>.</p>' +
    '<div class="duel-vs">' + duelOfferHTML(d.a, d, "A") + '<span class="duel-x">VS</span>' + duelOfferHTML(d.b, d, "B") + '</div>';
  if(du.stage === "vote"){
    host._tfetch = null; host._cele = false;
    if(!mine){
      h += '<p class="progress-note" style="margin-top:12px;">Sin calculadora todavía: ¿cuál crees que deja más dinero? Tu voto cuenta para toda la clase.</p>' +
        '<div class="duel-btns"><button type="button" class="btn primary" data-v="a">Voto por A</button><button type="button" class="btn primary" data-v="b">Voto por B</button><button type="button" class="btn ghost" data-v="c">Empatan</button></div>';
    } else {
      h += '<div class="reveal-box" style="margin-top:12px;">✅ Votaste por <strong>' + (mine === "a" ? "A · " + escapeHtml(d.a.name) : mine === "b" ? "B · " + escapeHtml(d.b.name) : "empate") + '</strong>. Ahora calcula tú mismo/a con la fórmula que corresponda ($M=C\\left(1+\\tfrac{r}{n}\\right)^{n\\,t}$ o $M=C\\,e^{r\\,t}$) y espera a que tu docente revele el resultado.</div>';
    }
  } else {
    var t = DUEL_TALLY[d.id], tot = t ? t.a + t.b + t.c : 0;
    var winName = cal.win === "a" ? d.a.name : cal.win === "b" ? d.b.name : "";
    h += '<div class="duel-result">' +
      '<div class="duel-m' + (cal.win === "a" ? " win" : "") + '"><span>A · ' + escapeHtml(d.a.name) + '</span><strong>' + sol(cal.ma, 2) + '</strong></div>' +
      '<div class="duel-m' + (cal.win === "b" ? " win" : "") + '"><span>B · ' + escapeHtml(d.b.name) + '</span><strong>' + sol(cal.mb, 2) + '</strong></div></div>' +
      '<p style="margin-top:10px;">' + (winName ? '🏆 Conviene <strong>' + escapeHtml(winName) + '</strong>: deja <strong>' + sol(cal.diff, 2) + '</strong> más.' : 'Dejan el mismo monto.') +
      ' ' + rich(duelLesson(d, cal)) + '</p>' +
      '<div class="reveal-box">' + rich('$M_A=' + offerTex(d.C, d.a, d.t) + '$ · $M_B=' + offerTex(d.C, d.b, d.t) + '$') + '</div>';
    if(mine){
      var ok = mine === cal.win;
      h += '<p class="duel-verdict ' + (ok ? "ok" : "bad") + '">' + (ok ? "🎯 ¡Tu intuición acertó!" : "🤔 Esta vez la intuición falló: por eso se calcula.") + '</p>';
    }
    if(tot){
      h += '<h4 style="margin:12px 0 4px;">Así votó la clase (' + tot + ')</h4>' + [["a", "A · " + d.a.name], ["b", "B · " + d.b.name], ["c", "Empatan"]].map(function(x){
        var pct = Math.round(100 * (t[x[0]] || 0) / tot);
        return '<div class="vote-row' + (x[0] === mine ? " mine" : "") + '"><span>' + escapeHtml(x[1]) + (x[0] === mine ? " ✔" : "") + '</span><span class="vote-bar"><span style="width:' + pct + '%"></span></span><span class="mono">' + pct + '%</span></div>';
      }).join("");
    }
  }
  h += '</div>';
  host.innerHTML = h;
  Array.prototype.forEach.call(host.querySelectorAll("[data-v]"), function(b){
    b.addEventListener("click", function(){
      if(!progress._pregunta) progress._pregunta = {};
      if(progress._pregunta[d.id]) return;
      progress._pregunta[d.id] = b.getAttribute("data-v");
      saveProgress(); syncSaveToSheet();
      if(typeof youthOnVote === "function") youthOnVote(d.id);
      renderLiveBanner();
      Array.prototype.forEach.call(document.querySelectorAll(".duel-host"), paintDuel);
    });
  });
  if(du.stage === "reveal"){
    if(mine && mine === cal.win && !host._cele && typeof youthOnDuelWin === "function"){ host._cele = true; youthOnDuelWin(d.id); }
    if(!host._tfetch || host._tfetch !== d.id){
      host._tfetch = d.id;
      setTimeout(function(){ fetchDuelTally(d.id, function(){ if(document.body.contains(host) && API.state && API.state.duel && API.state.duel.id === d.id) { var s = host._dsig; paintDuel(host); host._dsig = s; } }); }, 1200 + Math.random() * 2500);
    }
  }
}
function duelLesson(d, cal){
  if(cal.win === "c") return "";
  var wa = cal.win === "a" ? d.a : d.b, wb = cal.win === "a" ? d.b : d.a;
  var cont = wa.n === 0 || wb.n === 0;
  if(wa.r === wb.r && wa.n !== wb.n) return "Con la misma tasa nominal rinde más la capitalización " + CAPNAME[wa.n] + " que la " + CAPNAME[wb.n] + (wa.n === 0 ? ": el continuo es el techo, pero aquí la ventaja es mínima." : ".");
  if(cont && wa.n === 0) return "Ojo: ganó la oferta de tasa menor porque capitaliza de forma continua. Su tasa efectiva anual es $e^{r}-1$, mayor que la del número anunciado.";
  if(cont) return "Ganó la de mayor tasa: capitalizar de forma continua no alcanzó a compensar la tasa menor. Compara siempre montos finales o tasas efectivas.";
  if(wa.r < wb.r) return "Ojo: ganó la oferta de tasa menor, porque capitaliza " + CAPNAME[wa.n] + " frente a " + CAPNAME[wb.n] + ".";
  return "Ganó la de mayor tasa: capitalizar más seguido no alcanzó a compensar la tasa menor.";
}
function duelOnState(){
  var du = API.state && API.state.duel;
  var sig = du ? du.id + ":" + du.stage : "";
  renderLiveBanner();
  Array.prototype.forEach.call(document.querySelectorAll(".duel-host"), function(h){ if(h._dsig !== sig) paintDuel(h); });
}

/* ============================================================
   ELEMENTOS JUVENILES: confeti, sonidos (apagados por defecto),
   modo oscuro, avatar, racha diaria e insignias coleccionables
============================================================ */
var YOUTH_KEY = "ec-youth-v1";
var YP = {sound: false, theme: "auto"};
try{ var _yp = JSON.parse(localStorage.getItem(YOUTH_KEY) || "null"); if(_yp){ YP.sound = !!_yp.sound; YP.theme = (_yp.theme === "dark" || _yp.theme === "light") ? _yp.theme : "auto"; } }catch(e){}
function youthSavePrefs(){ try{ localStorage.setItem(YOUTH_KEY, JSON.stringify(YP)); }catch(e){} }
function reducedMotion(){ try{ return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } }

/* ---- Confeti (librería canvas-confetti; si no carga, simplemente no aparece) ---- */
function fireConfetti(kind){
  if(reducedMotion() || typeof window.confetti !== "function") return;
  var colors = ["#6802C1", "#B77CF2", "#F2A93B", "#2FBF71", "#FF8FA3"];
  try{
    if(kind === "big"){
      window.confetti({particleCount: 110, spread: 85, origin: {y: 0.35}, colors: colors, zIndex: 120});
      setTimeout(function(){ window.confetti({particleCount: 70, angle: 60, spread: 60, origin: {x: 0, y: 0.6}, colors: colors, zIndex: 120}); window.confetti({particleCount: 70, angle: 120, spread: 60, origin: {x: 1, y: 0.6}, colors: colors, zIndex: 120}); }, 250);
    } else {
      window.confetti({particleCount: 36, spread: 60, startVelocity: 28, origin: {y: 0.75}, colors: colors, zIndex: 120, scalar: 0.9});
    }
  }catch(e){}
}

/* ---- Sonidos con WebAudio (sin archivos); solo suenan si el estudiante los activa ---- */
var AUDIO = {ctx: null};
function playSound(kind){
  if(!YP.sound) return;
  try{
    var AC = window.AudioContext || window.webkitAudioContext; if(!AC) return;
    if(!AUDIO.ctx) AUDIO.ctx = new AC();
    var ctx = AUDIO.ctx; if(ctx.state === "suspended") ctx.resume();
    var seq = {ok: [[660, 0], [880, 0.09]], level: [[523, 0], [659, 0.1], [784, 0.2], [1047, 0.3]], badge: [[784, 0], [988, 0.1], [1319, 0.2]], tick: [[600, 0]], bad: [[220, 0]]}[kind] || [[600, 0]];
    seq.forEach(function(n){
      var o = ctx.createOscillator(), g = ctx.createGain(), t0 = ctx.currentTime + n[1];
      o.type = kind === "bad" ? "sawtooth" : "sine"; o.frequency.value = n[0];
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.16, t0 + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.2);
      o.connect(g); g.connect(ctx.destination); o.start(t0); o.stop(t0 + 0.22);
    });
  }catch(e){}
}

/* ---- Modo oscuro / claro ---- */
function effectiveDark(){
  if(YP.theme === "dark") return true;
  if(YP.theme === "light") return false;
  try{ return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches); }catch(e){ return false; }
}
function applyYouthPrefs(){
  var h = document.documentElement;
  if(YP.theme === "auto") h.removeAttribute("data-theme"); else h.setAttribute("data-theme", YP.theme);
  var bt = document.getElementById("btnTheme"), bs = document.getElementById("btnSound");
  if(bt){ bt.textContent = effectiveDark() ? "☀️" : "🌙"; bt.title = effectiveDark() ? "Cambiar a modo claro" : "Cambiar a modo oscuro"; bt.setAttribute("aria-label", bt.title); }
  if(bs){ bs.textContent = YP.sound ? "🔊" : "🔇"; bs.title = YP.sound ? "Sonidos activados (toca para silenciar)" : "Sonidos apagados (toca para activar)"; bs.setAttribute("aria-label", bs.title); bs.setAttribute("aria-pressed", YP.sound ? "true" : "false"); }
}

/* ---- Avatar ---- */
var AVATARS = ["🦉", "🦊", "🐼", "🦁", "🐯", "🐙", "🦄", "🐸", "🐧", "🦋", "🐺", "🐨", "🦅", "🐬", "🤖", "🧠", "⚖️", "🔮", "🚀", "🌟", "🎯", "🎧", "🍀", "🔥"];
function hashStr(s){ var h = 0; for(var i = 0; i < s.length; i++){ h = (h * 31 + s.charCodeAt(i)) >>> 0; } return h; }
function avatarOf(){
  if(progress._av && progress._av.e) return progress._av.e;
  return AVATARS[hashStr((student && student.name) || "x") % AVATARS.length];
}
function ensureAvatar(){
  if(!student || (progress._av && progress._av.e)) return;
  progress._av = {e: avatarOf(), at: Date.now()};
  saveProgress();
}
function openAvatarPicker(){
  var old = document.getElementById("avModal"); if(old) old.remove();
  var m = document.createElement("div"); m.id = "avModal"; m.className = "av-modal"; m.setAttribute("role", "dialog"); m.setAttribute("aria-label", "Elige tu avatar");
  m.innerHTML = '<div class="av-box"><h3>Elige tu avatar</h3><p class="progress-note" style="margin:0 0 10px;">Aparece junto a tu apodo en el ranking de la clase.</p><div class="av-grid">' +
    AVATARS.map(function(e){ return '<button type="button" class="av-opt' + (e === avatarOf() ? " on" : "") + '" data-e="' + e + '" aria-label="Avatar ' + e + '">' + e + '</button>'; }).join("") +
    '</div><div style="text-align:right;margin-top:12px;"><button type="button" class="btn sm" id="avClose">Cerrar</button></div></div>';
  document.body.appendChild(m);
  function close(){ m.remove(); }
  m.addEventListener("click", function(ev){
    if(ev.target === m || ev.target.id === "avClose"){ close(); return; }
    var b = ev.target.closest ? ev.target.closest(".av-opt") : null;
    if(!b) return;
    progress._av = {e: b.getAttribute("data-e"), at: Date.now(), p: 1};
    saveProgress(); syncSaveToSheet(); playSound("tick");
    close(); renderTopbar(); if(route === "map") render();
  });
}

/* ---- Racha diaria ---- */
function youthTouchDay(){
  if(!student) return;
  var k = dayKey();
  if(!progress._racha) progress._racha = {d: []};
  var d = progress._racha.d;
  if(d.indexOf(k) < 0){ d.push(k); d.sort(); progress._racha.d = d.slice(-60); saveProgress(); }
}
function dayAdd(k, n){
  var p = k.split("-"), dt = new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10) + n);
  return dt.getFullYear() + "-" + String(dt.getMonth() + 1).padStart(2, "0") + "-" + String(dt.getDate()).padStart(2, "0");
}
function streakCount(){
  var d = (progress._racha && progress._racha.d) || [];
  if(!d.length) return 0;
  var set = {}; d.forEach(function(x){ set[x] = 1; });
  var k = dayKey();
  if(!set[k]) k = dayAdd(k, -1);   // si hoy aún no avanzó, la racha de ayer sigue viva
  var n = 0;
  while(set[k]){ n++; k = dayAdd(k, -1); }
  return n;
}

/* ---- Insignias coleccionables (se calculan a partir del progreso, así también funcionan al cambiar de dispositivo) ---- */
function flashList(){ var f = progress._flash || {}, a = []; for(var r in f){ if(f[r] && typeof f[r].pts === "number") a.push(f[r]); } return a; }
var ACHS = [
  {id: "primer", ic: "👣", name: "Primer paso", hint: "Resuelve tu primer reto.", ok: function(){ return totalMissionsDone() >= 1; }},
  {id: "formula", ic: "🧩", name: "Arquitecto/a de fórmulas", hint: "Completa la fase Fórmula.", ok: function(){ return phaseDone("formula", MISSION_TOTALS.formula); }},
  {id: "techo", ic: "🏔️", name: "Descubridor/a del techo", hint: "Completa la fase Descubre el techo.", ok: function(){ return phaseDone("techo", MISSION_TOTALS.techo); }},
  {id: "detective", ic: "🕵️", name: "Cazador/a de errores", hint: "Encuentra el error en Fórmula y en Valor presente.", ok: function(){ return isSolved("formula", "f6") && isSolved("valor", "v6"); }},
  {id: "detector", ic: "🚩", name: "Detector/a de promesas", hint: "Resuelve el caso del detector de ofertas exageradas.", ok: function(){ return isSolved("decide", "x2"); }},
  {id: "calculista", ic: "🧮", name: "Calculista", hint: "Completa la fase Calcula.", ok: function(){ return phaseDone("calcula", MISSION_TOTALS.calcula); }},
  {id: "pensador", ic: "💬", name: "Pensador/a", hint: "Guarda una reflexión al cerrar una fase.", ok: function(){ return !!(progress._reflex && Object.keys(progress._reflex).length); }},
  {id: "opinante", ic: "🗳️", name: "Voz de la clase", hint: "Responde la pregunta del día.", ok: function(){ return !!(progress._pregunta && Object.keys(progress._pregunta).some(function(k){ return /^\d{4}-/.test(k); })); }},
  {id: "duelista", ic: "🥊", name: "Duelista", hint: "Vota en un duelo Discreto vs. Continuo.", ok: function(){ return !!(progress._pregunta && Object.keys(progress._pregunta).some(function(k){ return /^d\d+$/.test(k); })); }},
  {id: "ojo", ic: "🎯", name: "Ojo de águila", hint: "Acierta qué banco conviene en un duelo.", ok: function(){
    var p = progress._pregunta || {};
    return DUELS.some(function(d){ return p[d.id] && p[d.id] === duelCalc(d).win; });
  }},
  {id: "reflejos", ic: "⚡", name: "Reflejos", hint: "Juega tu primera ronda relámpago.", ok: function(){ return flashList().length >= 1; }},
  {id: "veloz", ic: "🚀", name: "Dedos veloces", hint: "Acierta una pregunta relámpago en menos de 8 segundos.", ok: function(){
    var f = progress._flash || {};
    for(var k in f){
      var r = FLASH_ROUNDS[parseInt(String(k).slice(1), 10) - 1];
      if(!r || !f[k] || !f[k].ch || !f[k].rt) continue;
      for(var i = 0; i < r.qs.length; i++){ if(f[k].ch[i] === r.qs[i].c && f[k].rt[i] >= 0 && f[k].rt[i] < 8000) return true; }
    }
    return false;
  }},
  {id: "perfecta", ic: "💯", name: "Ronda perfecta", hint: "Acierta las 5 preguntas de una ronda.", ok: function(){ return flashList().some(function(f){ return f.ok >= FLASH_COUNT; }); }},
  {id: "tormenta", ic: "🌩️", name: "Tormenta", hint: "Juega 3 rondas relámpago.", ok: function(){ return flashList().length >= 3; }},
  {id: "racha3", ic: "🔥", name: "Racha de 3 días", hint: "Avanza 3 días seguidos.", ok: function(){ return streakCount() >= 3; }},
  {id: "estilo", ic: "🎭", name: "Con estilo", hint: "Elige tu propio avatar.", ok: function(){ return !!(progress._av && progress._av.p); }},
  {id: "banquero", ic: "🏛️", name: "Dictamen aprobado", hint: "Resuelve el caso final del Fondo de la Defensoría.", ok: function(){ return isSolved("dictamen", "j4"); }},
  {id: "maestro", ic: "👑", name: "Maestro/a del Interés", hint: "Completa las 6 fases.", ok: function(){ return allPhasesDone(); }}
];
function totalMissionsDone(){
  var n = 0; PHASES.forEach(function(ph){ n += phaseCompleteCount(ph.key, MISSION_TOTALS[ph.key]); }); return n;
}
function achUnlocked(id){ return !!(progress._ach && progress._ach[id]); }
function achToast(a){
  var t = document.createElement("div"); t.className = "ach-toast"; t.setAttribute("role", "status");
  t.innerHTML = '<span class="ach-ic">' + a.ic + '</span><span><strong>¡Insignia desbloqueada!</strong><br>' + a.name + '</span>';
  document.body.appendChild(t);
  requestAnimationFrame(function(){ t.classList.add("show"); });
  setTimeout(function(){ t.classList.remove("show"); setTimeout(function(){ t.remove(); }, 400); }, 3600);
}
var YSTATE = {queue: [], busy: false, level: null, ready: false, checking: false};
function achShowNext(){
  if(YSTATE.busy || !YSTATE.queue.length) return;
  YSTATE.busy = true;
  var a = YSTATE.queue.shift();
  achToast(a); playSound("badge"); fireConfetti("small");
  setTimeout(function(){ YSTATE.busy = false; achShowNext(); }, 4000);
}
function youthCheck(silent){
  if(!student || YSTATE.checking) return;
  YSTATE.checking = true;
  try{
    var changed = false;
    if(!(progress._av && progress._av.e)){ progress._av = {e: avatarOf(), at: Date.now()}; changed = true; }
    ACHS.forEach(function(a){
      if(achUnlocked(a.id)) return;
      var ok = false; try{ ok = a.ok(); }catch(e){}
      if(!ok) return;
      if(!progress._ach) progress._ach = {};
      progress._ach[a.id] = Date.now(); changed = true;
      if(!silent){ YSTATE.queue.push(a); }
    });
    var lv = currentLevelInfo(totalXP()).name;
    if(YSTATE.level && lv !== YSTATE.level && !silent){
      var names = LEVELS.map(function(x){ return x.name; });
      if(names.indexOf(lv) > names.indexOf(YSTATE.level)){ youthLevelUp(lv); }
    }
    YSTATE.level = lv;
    if(changed){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }catch(e){} syncSaveToSheet(); }
  }finally{ YSTATE.checking = false; }
  achShowNext();
}
function youthLevelUp(name){
  var t = document.createElement("div"); t.className = "ach-toast level"; t.setAttribute("role", "status");
  t.innerHTML = '<span class="ach-ic">🏅</span><span><strong>¡Subiste de nivel!</strong><br>Ahora eres ' + name + '</span>';
  document.body.appendChild(t);
  requestAnimationFrame(function(){ t.classList.add("show"); });
  setTimeout(function(){ t.classList.remove("show"); setTimeout(function(){ t.remove(); }, 400); }, 3800);
  playSound("level"); fireConfetti("big");
}
function youthOnVote(){ youthTouchDay(); playSound("tick"); setTimeout(function(){ youthCheck(false); }, 50); }
function youthOnDuelWin(id){
  var k = "ec-duelwin-" + id, seen = false;
  try{ seen = !!sessionStorage.getItem(k); sessionStorage.setItem(k, "1"); }catch(e){}
  if(!seen){ playSound("level"); fireConfetti("big"); }
}

/* ---- Panel del mapa: avatar, racha, nivel e insignias ---- */
function youthMapPanel(app){
  youthCheck(true);
  var xp = totalXP(), lv = currentLevelInfo(xp), st = streakCount();
  var got = ACHS.filter(function(a){ return achUnlocked(a.id); }).length;
  var p = el("div", "panel youth-panel");
  p.innerHTML = '<div class="yp-head"><button type="button" class="yp-av" id="ypAv" aria-label="Cambiar avatar" title="Cambiar avatar">' + avatarOf() + '<span class="yp-edit">✎</span></button>' +
    '<div class="yp-info"><strong>' + escapeHtml((student && student.apodo) || firstNameOf(student ? student.name : "")) + '</strong><span>' + lv.name + ' · ' + xp + ' XP</span></div>' +
    '<div class="yp-streak' + (st ? " on" : "") + '" title="Días seguidos avanzando"><span class="flame">🔥</span><strong>' + st + '</strong><span>' + (st === 1 ? "día" : "días") + '</span></div></div>' +
    '<details class="ach-det"><summary>🎖️ Mis insignias <span class="badge">' + got + ' / ' + ACHS.length + '</span></summary>' +
    '<div class="ach-grid">' + ACHS.map(function(a){
      var on = achUnlocked(a.id);
      return '<div class="ach' + (on ? " on" : "") + '" tabindex="0" title="' + escapeHtml(on ? a.name : a.hint) + '"><span class="ach-c">' + (on ? a.ic : "🔒") + '</span><span class="ach-n">' + a.name + '</span><span class="ach-h">' + (on ? "¡Lograda!" : a.hint) + '</span></div>';
    }).join("") + '</div></details>';
  app.appendChild(p);
  p.querySelector("#ypAv").addEventListener("click", openAvatarPicker);
}

/* ---- Conexión con el resto de la app ---- */
function initYouth(){
  applyYouthPrefs();
  var bt = document.getElementById("btnTheme"), bs = document.getElementById("btnSound");
  if(bt) bt.addEventListener("click", function(){ YP.theme = effectiveDark() ? "light" : "dark"; youthSavePrefs(); applyYouthPrefs(); });
  if(bs) bs.addEventListener("click", function(){ YP.sound = !YP.sound; youthSavePrefs(); applyYouthPrefs(); if(YP.sound) playSound("ok"); });
  try{ if(window.matchMedia) window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyYouthPrefs); }catch(e){}
  // saveProgress: cada vez que se guarda el avance se revisan insignias y nivel (sin molestar mientras se escribe)
  var _sp = saveProgress;
  saveProgress = function(){ _sp(); if(YSTATE.ready) setTimeout(function(){ youthCheck(false); }, 30); };
  // markSolved: sonido, confeti y racha al resolver un reto nuevo
  var _ms = markSolved;
  markSolved = function(pk, mk){
    var had = isSolved(pk, mk), was = phaseDone(pk, MISSION_TOTALS[pk]);
    _ms(pk, mk);
    if(had) return;
    youthTouchDay(); playSound("ok"); fireConfetti("small");
    if(!was && phaseDone(pk, MISSION_TOTALS[pk])){ setTimeout(function(){ fireConfetti("big"); playSound("level"); }, 350); }
  };
  // la barra superior muestra avatar y racha
  var _rt = renderTopbar;
  renderTopbar = function(){
    _rt();
    var tag = document.getElementById("studentTag");
    if(!tag || tag.hidden || !student) return;
    var st = streakCount();
    tag.innerHTML = '<button type="button" class="tb-av" id="tbAv" aria-label="Cambiar avatar" title="Cambiar avatar">' + avatarOf() + '</button>' +
      '<span class="tb-name">' + escapeHtml(student.apodo || firstNameOf(student.name)) + '</span>' + (st ? ' <span class="tb-streak" title="Días seguidos avanzando">🔥' + st + '</span>' : '') +
      ' <button type="button" id="editStudentBtn">editar</button>';
    document.getElementById("editStudentBtn").addEventListener("click", function(){ goTo("register"); });
    document.getElementById("tbAv").addEventListener("click", openAvatarPicker);
  };
  if(student){ ensureAvatar(); youthTouchDay(); youthCheck(true); }
  YSTATE.ready = true;
  renderTopbar();
}



initFontSize();
initYouth();
if(/docente/i.test(String(location.hash || ""))){ goTo("docente"); }
else { goTo(student ? "map" : "register"); }
if(student){ pollOnce(); if(sheetSyncConfigured()) syncSaveToSheet(); }   // reenvía a la nube lo que haya quedado en este dispositivo
})();
