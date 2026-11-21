/**
 * ============================================================
 * Respaldo en la nube para las actividades de Pensamiento Matemático
 * ============================================================
 * Este script convierte una Hoja de cálculo de Google en un pequeño
 * backend compartido: guarda el avance de cada estudiante en cada
 * actividad (Parábola, Sistemas de Ecuaciones, y las que se agreguen
 * después) y se lo devuelve cuando vuelve a ingresar — así no se
 * pierde si cambia de dispositivo, borra el navegador, o Google Sites
 * recarga la página incrustada.
 *
 * Desde las actividades de Funciones Exponenciales, Crecimiento Poblacional, Interés Compuesto e Interés Continuo también ofrece:
 *   · DUELO POR EQUIPOS (promedio de puntos por carrera: Derecho vs Psicología),
 *   · DUELO DE BANCOS (votación de la clase lanzada por el docente) y avatar/racha en el ranking,
 *   · TIEMPO POR PREGUNTA elegido por el docente y RESULTADOS de la clase por pregunta,
 *   · REFLEXIONES que los estudiantes escriben al terminar cada fase (acción "reflections"),
 *   · RANKING de la clase (por XP, con apodo, nunca el nombre completo),
 *   · SALA EN VIVO para retos relámpago sincronizados (el docente abre la
 *     sala, ve cuántos estudiantes están conectados y da la señal de inicio),
 *   · tabulación de la "pregunta del día",
 *   · RITMO DE LA CLASE (el docente marca en qué fase/reto va el grupo) y
 *   · SEGUIMIENTO de la clase (tabla con el avance de cada estudiante).
 *
 * Cada actividad usa su PROPIA pestaña dentro de la misma Hoja, así
 * que puedes usar esta única URL de Apps Script para todas tus
 * actividades sin que se mezclen los datos.
 *
 * NO necesitas saber programar para instalarlo: sigue la guía
 * "Guia_respaldo_google_sheets.md" que viene junto a este archivo.
 * ============================================================
 */

// -------------------------------------------------------------
// Configuración por actividad. Para agregar una actividad nueva en
// el futuro, copia un bloque, cámbiale la clave (debe coincidir con
// el campo "actividad" que envía esa app) y ajusta MISSION_TOTALS
// para que coincida exactamente con el MISSION_TOTALS del HTML.
// -------------------------------------------------------------
var ACTIVITIES = {
  parabola: {
    sheetName: "Progreso", // se mantiene el nombre original para no romper el respaldo ya configurado
    totals: {
      experimenta: 6, comprueba: 2, calcula: 2, interpreta: 6,
      investiga: 8, desafio: 6, aplica: 6
    }
  },
  sistemas: {
    sheetName: "Progreso - Sistemas",
    totals: {
      clasifica: 7, verifica: 4, resuelve: 9, interpreta: 5,
      investiga: 8, desafio: 4, aplica: 6
    }
  },
  sistemas3: {
    sheetName: "Progreso - Sistemas 3D",
    totals: {
      clasifica: 7, verifica: 4, resuelve: 9, interpreta: 5,
      investiga: 8, desafio: 4, aplica: 6
    }
  },
  exponencial: {
    sheetName: "Progreso - Exponenciales",
    totals: {
      explora: 6, evalua: 5, grafica: 6, interpreta: 5,
      investiga: 8, desafio: 4, aplica: 5
    },
    flashRounds: 7   // una ronda relámpago por fase
  },
  poblacion: {
    sheetName: "Progreso - Crecimiento",
    totals: {
      explora: 6, evalua: 5, grafica: 6, interpreta: 5,
      investiga: 8, desafio: 4, aplica: 5
    },
    flashRounds: 7   // una ronda relámpago por fase
  },
  interes: {
    sheetName: "Progreso - Interés compuesto",
    totals: {
      simple: 6, formula: 6, capitaliza: 6, calcula: 6,
      casos: 5, valor: 5, dictamen: 4
    },
    flashRounds: 7   // una ronda relámpago por fase
  },
  continuo: {
    sheetName: "Progreso - Interés continuo",
    totals: {
      techo: 6, formula: 6, calcula: 6, valor: 6,
      decide: 5, dictamen: 4
    },
    flashRounds: 6   // una ronda relámpago por fase
  }
};

// -------------------------------------------------------------
// SALA EN VIVO (retos relámpago) y RANKING
// -------------------------------------------------------------
// PIN que usa el docente en la pantalla "Panel docente" de la app.
// ¡CÁMBIALO por uno tuyo antes de usarlo con tus estudiantes!
var TEACHER_PIN = "PIN-DE-EJEMPLO";

// Deben coincidir con el HTML: 5 preguntas de 12 segundos cada una.
var FLASH_Q_COUNT = 5;           // preguntas por ronda
var FLASH_QSEC_DEFAULT = 12;     // por compatibilidad: las actividades antiguas no envían el tiempo y usan 12 s por pregunta
function flashTotalMs_(st) { return ((st && st.qsec) || FLASH_QSEC_DEFAULT) * FLASH_Q_COUNT * 1000; }

// Instantes (ms) en que empieza cada pregunta y termina la ronda. Cada pregunta dura el tiempo elegido,
// salvo que el docente pulse "Siguiente pregunta" (st.adv[i] = momento en que adelantó la pregunta i).
function flashBounds_(st) {
  var q = ((st && st.qsec) || FLASH_QSEC_DEFAULT) * 1000, adv = (st && st.adv) || [];
  var b = [st.startAt];
  for (var i = 0; i < FLASH_Q_COUNT; i++) {
    var end = b[i] + q;
    if (adv[i] && adv[i] >= b[i] && adv[i] < end) end = adv[i];
    b.push(end);
  }
  return b;
}
// Pregunta en curso (0..4), -1 si aún es la cuenta regresiva, 5 si la ronda ya terminó.
function flashCurrentQ_(st, now) {
  var b = flashBounds_(st);
  if (now < b[0]) return -1;
  for (var i = 0; i < FLASH_Q_COUNT; i++) { if (now < b[i + 1]) return i; }
  return FLASH_Q_COUNT;
}
var FLASH_COUNTDOWN_MS = 12000;  // cuenta regresiva desde "¡Iniciar!"
var XP_PER_MISSION = 10;         // igual que en el HTML
var XP_PER_PHASE_BONUS = 25;     // igual que en el HTML
// Si una app antigua no envía "actividad", se asume "parabola" (compatibilidad).
var DEFAULT_ACTIVITY = "parabola";

function doGet(e) { return handle_(e); }
function doPost(e) { return handle_(e); }

function handle_(e) {
  try {
    var body = {};
    if (e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      body = e.parameter;
    }
    var actKey = (body.actividad && ACTIVITIES[body.actividad]) ? body.actividad : DEFAULT_ACTIVITY;
    var activity = ACTIVITIES[actKey];
    // Acciones de la sala en vivo: no necesitan abrir la hoja (más rápidas).
    if (body.action === "flashState") return flashState_(actKey, body);
    var sheet = getSheet_(activity.sheetName);
    if (body.action === "save") return saveRow_(sheet, body, activity.totals);
    if (body.action === "load") return loadRow_(sheet, body);
    if (body.action === "ranking") return json_(rankingData_(sheet, body, activity));
    if (body.action === "flashControl") return flashControl_(actKey, sheet, body, activity);
    if (body.action === "classProgress") return classProgress_(sheet, body, activity);
    if (body.action === "reflections") return reflections_(sheet, body);
    return json_({ ok: false, error: "accion_desconocida" });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function getSheet_(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow([
      "clave", "nombre", "carrera", "fases_completas",
      "misiones_completas", "certificado", "ultima_actualizacion",
      "progreso_json"
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function normalizeKey_(nombre, carrera) {
  return (nombre || "").toString().trim().toLowerCase() + "|" +
    (carrera || "").toString().trim().toLowerCase();
}

function countProgress_(progreso, missionTotals) {
  var misiones = 0, fasesCompletas = 0, totalFases = 0;
  for (var faseKey in missionTotals) {
    totalFases++;
    var total = missionTotals[faseKey];
    var solved = 0;
    var m = (progreso && progreso[faseKey]) || {};
    for (var k in m) { if (k.charAt(0) !== "_" && m[k]) solved++; }
    if (solved > total) solved = total;
    misiones += solved;
    if (solved >= total) fasesCompletas++;
  }
  var totalMisiones = 0;
  for (var k2 in missionTotals) totalMisiones += missionTotals[k2];
  return { misiones: misiones, totalMisiones: totalMisiones, fases: fasesCompletas, totalFases: totalFases };
}

// Guardar. Una fila que ya existe se actualiza sin candado (cada estudiante escribe en SU fila, así 30 guardados
// a la vez no hacen cola). Solo la creación de una fila nueva usa candado, para no duplicar estudiantes.
// Si el candado está ocupado responde "ocupado" y la página reintenta sola.
function saveRow_(sheet, body, missionTotals) {
  var key = normalizeKey_(body.nombre, body.carrera);
  var rowIndex = findRow_(sheet, key);
  if (rowIndex > 0) { writeRow_(sheet, body, missionTotals, key, rowIndex); return json_({ ok: true }); }
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(28000)) return json_({ ok: false, error: "ocupado" });
  try {
    rowIndex = findRow_(sheet, key);   // otro guardado pudo crearla mientras esperábamos
    writeRow_(sheet, body, missionTotals, key, rowIndex);
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function writeRow_(sheet, body, missionTotals, key, rowIndex) {
  var incoming = body.progreso || {};
  var merged = incoming;
  if (rowIndex > 0) {
    // Nunca se pierde avance: se une lo que ya estaba en la nube con lo que llega.
    var old = {};
    try { old = JSON.parse(sheet.getRange(rowIndex, 8).getValue()) || {}; } catch (e) { old = {}; }
    merged = mergeProgress_(old, incoming);
  }
  var counts = countProgress_(merged, missionTotals);
  var row = [
    key,
    body.nombre || "",
    body.carrera || "",
    counts.fases + "/" + counts.totalFases,
    counts.misiones + "/" + counts.totalMisiones,
    body.completadoEn ? "Sí" : "No",
    new Date(),
    JSON.stringify(merged)
  ];
  if (rowIndex === -1) {
    sheet.appendRow(row);
  } else {
    sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
  }
}

// Busca la fila de un estudiante leyendo solo la columna A (rápido aunque haya muchos estudiantes).
function findRow_(sheet, key) {
  var last = sheet.getLastRow();
  if (last < 2) return -1;
  var keys = sheet.getRange(2, 1, last - 1, 1).getValues();
  for (var i = 0; i < keys.length; i++) {
    if (keys[i][0] === key) return i + 2;
  }
  return -1;
}

function mergeProgress_(oldP, newP) {
  var out = {}, k, i;
  for (k in oldP) out[k] = oldP[k];
  for (k in newP) {
    var nv = newP[k], ov = out[k], o = {};
    if (k === "_flash" || k === "_pregunta") {
      // una ronda / una respuesta del día cuenta una sola vez: gana lo que ya estaba
      for (i in (ov || {})) o[i] = ov[i];
      for (i in (nv || {})) { if (!o[i]) o[i] = nv[i]; }
      out[k] = o;
    } else if (k === "_reflex") {
      for (i in (ov || {})) o[i] = ov[i];
      for (i in (nv || {})) {
        if (!o[i] || ((nv[i] && nv[i].at) || 0) > ((o[i] && o[i].at) || 0)) o[i] = nv[i];
      }
      out[k] = o;
    } else if (k === "_racha") {
      // días en que el estudiante entró y avanzó: se unen (nunca se pierde una racha por guardar desde otro dispositivo)
      var days = {}, list = [];
      var a1 = (ov && ov.d) || [], a2 = (nv && nv.d) || [];
      for (i = 0; i < a1.length; i++) days[a1[i]] = 1;
      for (i = 0; i < a2.length; i++) days[a2[i]] = 1;
      for (i in days) list.push(i);
      list.sort();
      out[k] = { d: list.slice(-60) };
    } else if (k === "_ach") {
      // insignias: se unen (gana la fecha más antigua de cada una)
      for (i in (ov || {})) o[i] = ov[i];
      for (i in (nv || {})) { if (!o[i] || nv[i] < o[i]) o[i] = nv[i]; }
      out[k] = o;
    } else if (k.charAt(0) === "_") {
      if (nv) out[k] = nv;
    } else if (nv && typeof nv === "object") {
      for (i in (ov || {})) o[i] = ov[i];
      for (i in nv) { if (nv[i]) o[i] = true; }
      out[k] = o;
    } else {
      out[k] = nv;
    }
  }
  return out;
}

function loadRow_(sheet, body) {
  var key = normalizeKey_(body.nombre, body.carrera);
  var rowIndex = findRow_(sheet, key);
  if (rowIndex < 0) return json_({ ok: true, found: false });
  var vals = sheet.getRange(rowIndex, 1, 1, 8).getValues()[0];
  var progreso = {};
  try { progreso = JSON.parse(vals[7]); } catch (e) {}
  return json_({
    ok: true,
    found: true,
    progreso: progreso,
    completadoEn: vals[5] === "Sí" ? String(vals[6]) : ""
  });
}


// ---------- Ranking ----------
function firstName_(nombre) {
  var t = (nombre || "").toString().trim().split(/\s+/)[0] || "Anónimo";
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
}

function flashTotal_(progreso) {
  var f = (progreso && progreso._flash) || {};
  var total = 0;
  for (var r in f) { if (f[r] && typeof f[r].pts === "number") total += f[r].pts; }
  return total;
}

// Lee la hoja UNA vez y guarda un resumen en caché por unos segundos: así el ranking, el panel
// docente y el seguimiento no recalculan todo por cada estudiante que pregunta.
var CLASS_CACHE_SECONDS = 5;
function classRows_(sheet, activity) {
  var cache = CacheService.getScriptCache();
  var ck = "cls_" + activity.sheetName;
  var raw = cache.get(ck);
  if (raw) { try { return JSON.parse(raw); } catch (e) {} }
  var data = sheet.getDataRange().getValues();
  var keys = Object.keys(activity.totals);
  var rows = [];
  for (var i = 1; i < data.length; i++) {
    var progreso = {};
    try { progreso = JSON.parse(data[i][7]) || {}; } catch (e) { progreso = {}; }
    var counts = countProgress_(progreso, activity.totals);
    var porFase = [], pendiente = keys.length + 1;
    for (var f = 0; f < keys.length; f++) {
      var m = progreso[keys[f]] || {}, n = 0;
      for (var q in m) { if (q.charAt(0) !== "_" && m[q]) n++; }
      n = Math.min(n, activity.totals[keys[f]]);
      porFase.push(n);
      if (n < activity.totals[keys[f]] && pendiente > keys.length) pendiente = f + 1;
    }
    var fr = {};
    var fl = progreso._flash || {};
    for (var r in fl) {
      if (fl[r] && typeof fl[r].pts === "number") fr[r] = { p: fl[r].pts, o: fl[r].ok || 0, c: fl[r].ch || null, t: fl[r].tm || 0 };
    }
    var ult = data[i][6];
    rows.push({
      k: data[i][0], n: String(data[i][1] || ""), c: String(data[i][2] || ""),
      a: (progreso._apodo || firstName_(data[i][1])).toString().slice(0, 16),
      v: (progreso._av && progreso._av.e ? String(progreso._av.e) : "").slice(0, 8),
      m: counts.misiones, f: counts.fases, pf: porFase, pe: pendiente,
      fl: flashTotal_(progreso), fr: fr, pq: progreso._pregunta || {},
      u: ult && ult.getTime ? ult.getTime() : 0
    });
  }
  try { cache.put(ck, JSON.stringify(rows), CLASS_CACHE_SECONDS); } catch (e) { /* demasiado grande: sin caché */ }
  return rows;
}

function rankingData_(sheet, body, activity) {
  var rows = classRows_(sheet, activity);
  var myKey = normalizeKey_(body.nombre, body.carrera);
  var ronda = body.ronda ? ("r" + parseInt(body.ronda, 10)) : null;
  var dayKey = body.dayKey ? String(body.dayKey) : null;
  var entries = [];
  var tally = { a: 0, b: 0, c: 0 };
  var choices = [];   // choices[pregunta][opción] = cuántos estudiantes la eligieron
  for (var i = 0; i < rows.length; i++) {
    var rw = rows[i];
    var xp = rw.m * XP_PER_MISSION + rw.f * XP_PER_PHASE_BONUS + rw.fl;
    var pts = -1, ok = 0, tm = 0;
    if (ronda && rw.fr[ronda]) {
      pts = rw.fr[ronda].p || 0;
      ok = rw.fr[ronda].o || 0;
      tm = rw.fr[ronda].t || 0;
      var chs = rw.fr[ronda].c;
      if (chs && chs.length) {
        for (var qi = 0; qi < chs.length; qi++) {
          if (!choices[qi]) choices[qi] = [0, 0, 0, 0, 0, 0];
          var oi = chs[qi];
          if (typeof oi === "number" && oi >= 0 && oi < 6) choices[qi][oi]++;
        }
      }
    }
    if (dayKey && rw.pq[dayKey]) {
      var v = rw.pq[dayKey];
      if (tally[v] !== undefined) tally[v]++;
    }
    entries.push({ key: rw.k, car: rw.c, apodo: rw.a, av: rw.v || "", xp: xp, pts: pts, ok: ok, tm: tm, fases: rw.f, misiones: rw.m });
  }
  if (ronda) {
    entries = entries.filter(function (x) { return x.pts >= 0; });
    // Orden de la ronda: más puntos; si empatan, más aciertos; si empatan, quien acertó en menos tiempo total; al final, el apodo.
    entries.sort(function (a, b) {
      var ta = a.tm > 0 ? a.tm : 1e12, tb = b.tm > 0 ? b.tm : 1e12;
      return b.pts - a.pts || b.ok - a.ok || ta - tb || (a.apodo < b.apodo ? -1 : 1);
    });
  } else {
    entries.sort(function (a, b) { return b.xp - a.xp || b.fases - a.fases || (a.apodo < b.apodo ? -1 : 1); });
  }
  var top = [], me = null;
  for (var j = 0; j < entries.length; j++) {
    var en = entries[j];
    var isMe = en.key === myKey;
    var row = { pos: j + 1, apodo: en.apodo, av: en.av, xp: en.xp, pts: en.pts, ok: en.ok, fases: en.fases, me: isMe };
    if (j < 10) top.push(row);
    if (isMe) me = row;
  }
  // Duelo por equipos: promedio por carrera (promedio, no suma, para que sea justo aunque un grupo sea más grande)
  var teams = {};
  for (var ti = 0; ti < entries.length; ti++) {
    var te = entries[ti], tk = (te.car === "Derecho" || te.car === "Psicología") ? te.car : "Otra";
    if (!teams[tk]) teams[tk] = { n: 0, sum: 0 };
    teams[tk].n++; teams[tk].sum += ronda ? te.pts : te.xp;
  }
  for (var tn in teams) { teams[tn].avg = teams[tn].n ? Math.round(10 * teams[tn].sum / teams[tn].n) / 10 : 0; delete teams[tn].sum; }
  var out = { ok: true, serverNow: new Date().getTime(), top: top, me: me, total: entries.length, tally: tally, choices: choices, teams: teams };
  if (ronda) out.expected = expectedPlayers_(rows, activity, ronda);
  return out;
}

// Cuántos estudiantes han jugado esta ronda (avisaron que jugaban mientras respondían). Sirve para mostrar
// «24 de 31 resultados» y que se entienda por qué el ranking aún se está completando.
function playerKey_(act, ronda, key) { return "pl_" + act + "_" + ronda + "_" + String(key).slice(0, 40); }
function expectedPlayers_(rows, activity, ronda) {
  try {
    var act = activity.sheetName, cache = CacheService.getScriptCache(), n = 0, keys = [];
    for (var i = 0; i < rows.length; i++) keys.push(playerKey_(act, ronda, rows[i].k));
    for (var j = 0; j < keys.length; j += 90) {
      var got = cache.getAll(keys.slice(j, j + 90));
      for (var kk in got) { if (got[kk]) n++; }
    }
    return n;
  } catch (e) { return 0; }
}

// ---------- Sala en vivo ----------
function flashStateKey_(act) { return "flash_state_" + act; }
function flashPingKey_(act) { return "flash_ping_" + act; }

function getFlashState_(act) {
  var cache = CacheService.getScriptCache();
  var raw = cache.get(flashStateKey_(act));
  if (!raw) {
    raw = PropertiesService.getScriptProperties().getProperty(flashStateKey_(act));
    if (raw) cache.put(flashStateKey_(act), raw, 21600);
  }
  var st = { status: "idle", round: 1, startAt: 0, openedAt: 0 };
  if (raw) { try { st = JSON.parse(raw); } catch (e) {} }
  // El "ritmo de la clase" caduca solo a las 8 horas (por si olvidas quitarlo).
  if (st.pace && new Date().getTime() - (st.pace.at || 0) > 8 * 3600 * 1000) { delete st.pace; }
  // Cierre automático: una ronda "en curso" caduca sola 90 s después de terminar.
  if (st.status === "running" && new Date().getTime() > flashBounds_(st)[FLASH_Q_COUNT] + 90000) {
    st.status = "idle";
  }
  return st;
}

function setFlashState_(act, st) {
  var raw = JSON.stringify(st);
  PropertiesService.getScriptProperties().setProperty(flashStateKey_(act), raw);
  CacheService.getScriptCache().put(flashStateKey_(act), raw, 21600);
}

// Cuenta cuántos estudiantes han "avisado presencia" en los últimos 90 s.
function touchPing_(act, key, prog) {
  var cache = CacheService.getScriptCache();
  var now = new Date().getTime();
  var map = {};
  try { map = JSON.parse(cache.get(flashPingKey_(act)) || "{}"); } catch (e) { map = {}; }
  // cada estudiante avisa que sigue conectado y, si está jugando, en qué pregunta va y si ya respondió
  if (key) map[key] = { t: now, p: prog || null };
  var count = 0;
  for (var k in map) {
    var t = typeof map[k] === "number" ? map[k] : (map[k] && map[k].t) || 0;
    if (now - t > 90000) { delete map[k]; } else { count++; }
  }
  cache.put(flashPingKey_(act), JSON.stringify(map), 300);
  return count;
}

// Cuántos están jugando y cuántos ya respondieron la pregunta en curso (para que el docente decida cuándo avanzar).
function playStats_(act, st, now) {
  var out = { qi: -1, playing: 0, answered: 0 };
  if (!st || st.status !== "running") return out;
  out.qi = flashCurrentQ_(st, now);
  var map = {};
  try { map = JSON.parse(CacheService.getScriptCache().get(flashPingKey_(act)) || "{}"); } catch (e) { map = {}; }
  for (var k in map) {
    var v = map[k];
    if (!v || typeof v !== "object" || !v.p || now - v.t > 30000) continue;
    if (v.p.r !== st.round) continue;
    out.playing++;
    if (v.p.q === out.qi && v.p.a === 1) out.answered++;
  }
  return out;
}

function flashState_(actKey, body) {
  var key = body.nombre ? normalizeKey_(body.nombre, body.carrera).slice(0, 40) : "";
  var prog = null;
  if (body.p && typeof body.p === "object") {
    prog = { r: parseInt(body.p.r, 10) || 0, q: parseInt(body.p.q, 10), a: body.p.a ? 1 : 0 };
  }
  var connected = touchPing_(actKey, key, prog);
  if (prog && prog.r && key) {
    try { CacheService.getScriptCache().put(playerKey_(ACTIVITIES[actKey].sheetName, "r" + prog.r, key), "1", 21600); } catch (e) {}
  }
  return json_({
    ok: true, serverNow: new Date().getTime(),
    state: getFlashState_(actKey), connected: connected
  });
}

function flashControl_(actKey, sheet, body, activity) {
  if (String(body.pin || "") !== TEACHER_PIN) return json_({ ok: false, error: "pin" });
  var st = getFlashState_(actKey);
  var now = new Date().getTime();
  var rounds = activity.flashRounds || 1;
  if (body.cmd === "open") {
    var r = Math.max(1, Math.min(rounds, parseInt(body.round, 10) || 1));
    // Tiempo por pregunta que elige el docente (30 a 300 s). Si no llega (actividad antigua), se usan 12 s.
    var q = parseInt(body.qsec, 10);
    q = q ? Math.max(30, Math.min(300, q)) : FLASH_QSEC_DEFAULT;
    st = { status: "lobby", round: r, startAt: 0, openedAt: now, qsec: q, pace: st.pace, duel: st.duel };
    setFlashState_(actKey, st);
  } else if (body.cmd === "start") {
    if (st.status === "lobby") {
      st.status = "running";
      st.startAt = now + FLASH_COUNTDOWN_MS;
      st.adv = [];
      setFlashState_(actKey, st);
    }
  } else if (body.cmd === "next") {
    // "Siguiente pregunta": el docente adelanta la pregunta en curso (la última pregunta termina la ronda).
    // Solo actúa si lo que vio el docente (from) sigue siendo la pregunta en curso: un doble toque no salta dos.
    if (st.status === "running" && now >= st.startAt) {
      var cq = flashCurrentQ_(st, now);
      var from = body.from === undefined ? cq : parseInt(body.from, 10);
      if (cq >= 0 && cq < FLASH_Q_COUNT && from === cq) {
        if (!st.adv) st.adv = [];
        for (var z = 0; z < FLASH_Q_COUNT; z++) { if (st.adv[z] === undefined) st.adv[z] = null; }
        st.adv[cq] = now;
        setFlashState_(actKey, st);
      }
    }
  } else if (body.cmd === "close") {
    st = { status: "idle", round: st.round, startAt: 0, openedAt: 0, qsec: st.qsec, pace: st.pace, duel: st.duel };
    setFlashState_(actKey, st);
  } else if (body.cmd === "pace") {
    // Ritmo de la clase: en qué fase (y reto) va el grupo. Lo ven todos los estudiantes.
    var totalFases = Object.keys(activity.totals).length;
    var ph = Math.max(1, Math.min(totalFases, parseInt(body.phase, 10) || 1));
    var ms = parseInt(body.mission, 10) || 0;
    st.pace = { phase: ph, mission: ms > 0 ? ms : 0, at: now };
    setFlashState_(actKey, st);
  } else if (body.cmd === "duel") {
    // Duelo de bancos: el docente lanza un duelo (id "d1".."dN"), la clase vota y luego él revela el cálculo.
    var stage = String(body.stage || "");
    if (stage === "off") { delete st.duel; }
    else if (stage === "vote" || stage === "reveal") {
      var did = String(body.id || "").replace(/[^a-z0-9]/gi, "").slice(0, 8);
      if (did) st.duel = { id: did, stage: stage, at: (st.duel && st.duel.id === did && st.duel.at) ? st.duel.at : now };
    }
    setFlashState_(actKey, st);
  } else if (body.cmd === "paceClear") {
    delete st.pace;
    setFlashState_(actKey, st);
  }
  var connected = touchPing_(actKey, "");
  var rk = rankingData_(sheet, { ronda: st.round, nombre: "", carrera: "", dayKey: st.duel ? st.duel.id : null }, activity);
  return json_({
    ok: true, serverNow: now, state: st, connected: connected, tally: rk.tally, teams: rk.teams,
    roundRanking: rk.top, played: rk.total, expected: rk.expected || 0, choices: rk.choices, play: playStats_(actKey, st, now)
  });
}

// ---------- Seguimiento de la clase (solo docente) ----------
function classProgress_(sheet, body, activity) {
  if (String(body.pin || "") !== TEACHER_PIN) return json_({ ok: false, error: "pin" });
  var src = classRows_(sheet, activity);
  var keys = Object.keys(activity.totals);
  var rows = src.map(function (r) {
    return {
      nombre: r.n, carrera: r.c, apodo: r.a, fases: r.f, misiones: r.m, porFase: r.pf, pendiente: r.pe,
      xp: r.m * XP_PER_MISSION + r.f * XP_PER_PHASE_BONUS + r.fl, ultima: r.u
    };
  });
  rows.sort(function (a, b) { return a.pendiente - b.pendiente || a.misiones - b.misiones || (a.nombre < b.nombre ? -1 : 1); });
  return json_({
    ok: true, serverNow: new Date().getTime(), rows: rows,
    totals: activity.totals, phases: keys, totalMisiones: countProgress_({}, activity.totals).totalMisiones
  });
}

// ---------- Reflexiones de los estudiantes (solo docente) ----------
// Cada estudiante guarda una frase al final de cada fase en progreso._reflex = { fase: {t, at} }.
function reflections_(sheet, body) {
  if (String(body.pin || "") !== TEACHER_PIN) return json_({ ok: false, error: "pin" });
  var data = sheet.getDataRange().getValues();
  var rows = [];
  for (var i = 1; i < data.length; i++) {
    var progreso = {};
    try { progreso = JSON.parse(data[i][7]); } catch (e) { progreso = {}; }
    var rf = progreso._reflex;
    if (!rf) continue;
    var items = [];
    for (var k in rf) {
      if (rf[k] && rf[k].t) items.push({ fase: k, t: String(rf[k].t).slice(0, 400), at: rf[k].at || 0 });
    }
    if (!items.length) continue;
    rows.push({
      nombre: String(data[i][1] || ""), carrera: String(data[i][2] || ""),
      apodo: (progreso._apodo || firstName_(data[i][1])).toString().slice(0, 16),
      items: items
    });
  }
  return json_({ ok: true, serverNow: new Date().getTime(), rows: rows });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
