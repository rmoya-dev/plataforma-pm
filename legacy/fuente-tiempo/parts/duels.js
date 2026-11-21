var DUELS = [
  {id:"d1", title:"La tasa menor que llega antes", ctx:"Una pareja de abogados quiere duplicar los honorarios de su primer caso para comprar su oficina.", k:2,
   a:{name:"Banco Andino", r:0.06, n:1}, b:{name:"Banco del Sol", r:0.059, n:12}},
  {id:"d2", title:"Diaria contra anual", ctx:"Una psicóloga ahorra para equipar su consultorio y quiere duplicar su fondo. Una caja capitaliza todos los días; la otra solo una vez al año.", k:2,
   a:{name:"Caja Diaria", r:0.04, n:365}, b:{name:"Caja Anual", r:0.041, n:1}},
  {id:"d3", title:"Triplicar: ¿frecuencia o tasa?", ctx:"Un estudio jurídico guarda un fondo de capacitación y quiere triplicarlo.", k:3,
   a:{name:"Banco Trimestral", r:0.05, n:4}, b:{name:"Banco Anual", r:0.0505, n:1}},
  {id:"d4", title:"¿Importa cuánto inviertes?", ctx:"Dos amigas de Psicología quieren duplicar su dinero con exactamente la misma tasa y capitalización. Una invierte poco y la otra mucho.", k:2,
   a:{name:"Lucía", r:0.06, n:1, C:5000}, b:{name:"Marta", r:0.06, n:1, C:500000}},
  {id:"d5", title:"Misma tasa, distinta capitalización", ctx:"Una ONG de apoyo psicológico quiere duplicar su fondo de becas. Ambos bancos ofrecen la misma tasa anunciada.", k:2,
   a:{name:"Banco Anual", r:0.03, n:1}, b:{name:"Banco Mensual", r:0.03, n:12}},
  {id:"d6", title:"Fernando contra Julián (casos de tu guía)", ctx:"Dos inversionistas de tu guía de trabajo quieren duplicar su dinero.", k:2,
   a:{name:"Fernando", r:0.0408, n:2}, b:{name:"Julián", r:0.0402, n:12}}
];
var CAPNAME = {1: "anual", 2: "semestral", 3: "cuatrimestral", 4: "trimestral", 6: "bimestral", 12: "mensual", 24: "quincenal", 360: "diaria", 365: "diaria"};
function duelById(id){ for(var i = 0; i < DUELS.length; i++){ if(DUELS[i].id === id) return DUELS[i]; } return null; }
function goalWord(k){ return k === 2 ? "duplicar" : (k === 3 ? "triplicar" : "multiplicar por " + k); }
function offerTex(d, o){
  return "\\dfrac{\\ln " + d.k + "}{" + (o.n > 1 ? o.n + "\\," : "") + "\\ln\\left(1+\\tfrac{" + fmt(o.r, 4) + "}{" + o.n + "}\\right)}";
}
function duelCalc(d){
  var ta = yrs(d.k, d.a.r, d.a.n), tb = yrs(d.k, d.b.r, d.b.n);
  return {ta: ta, tb: tb, win: Math.abs(ta - tb) < 0.005 ? "c" : (ta < tb ? "a" : "b"), diff: Math.abs(ta - tb)};
}
function duelOfferHTML(o, d, letter, extraCls){
  return '<div class="duel-offer' + (extraCls || "") + '"><span class="duel-letter">' + letter + '</span><strong>' + escapeHtml(o.name) + '</strong>' +
    '<span class="duel-rate">' + fmt(o.r * 100, 3) + ' % anual</span><span class="duel-cap">capitalizable ' + CAPNAME[o.n] + '</span>' +
    (o.C ? '<span class="duel-cap">Capital: ' + sol(o.C, 0) + '</span>' : '') + '</div>';
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
  var h = '<div class="duel-card"><div class="duel-top"><span class="badge up"><span class="pulse-dot"></span> ' + (du.stage === "vote" ? "Votación abierta" : "Resultado") + '</span><h3>🥊 Duelo «¿Quién llega primero?»: ' + escapeHtml(d.title) + '</h3></div>' +
    '<p>' + rich(escapeHtml(d.ctx)) + ' Meta: <strong>' + goalWord(d.k) + '</strong> el capital.</p>' +
    '<div class="duel-vs">' + duelOfferHTML(d.a, d, "A") + '<span class="duel-x">VS</span>' + duelOfferHTML(d.b, d, "B") + '</div>';
  if(du.stage === "vote"){
    host._tfetch = null; host._cele = false;
    if(!mine){
      h += '<p class="progress-note" style="margin-top:12px;">Sin calculadora todavía: ¿cuál alcanza antes la meta? Tu voto cuenta para toda la clase.</p>' +
        '<div class="duel-btns"><button type="button" class="btn primary" data-v="a">Voto por A</button><button type="button" class="btn primary" data-v="b">Voto por B</button><button type="button" class="btn ghost" data-v="c">Tardan lo mismo</button></div>';
    } else {
      h += rich('<div class="reveal-box" style="margin-top:12px;">✅ Votaste por <strong>' + (mine === "a" ? "A · " + escapeHtml(d.a.name) : mine === "b" ? "B · " + escapeHtml(d.b.name) : "empate") + '</strong>. Ahora calcula tú mismo/a con $n\\,t=\\dfrac{\\ln k}{\\ln\\left(1+\\tfrac{r}{n}\\right)}$ y espera a que tu docente revele el resultado.</div>');
    }
  } else {
    var t = DUEL_TALLY[d.id], tot = t ? t.a + t.b + t.c : 0;
    var winName = cal.win === "a" ? d.a.name : cal.win === "b" ? d.b.name : "";
    h += '<div class="duel-result">' +
      '<div class="duel-m' + (cal.win === "a" ? " win" : "") + '"><span>A · ' + escapeHtml(d.a.name) + '</span><strong>' + fmt(cal.ta, 2) + ' años</strong></div>' +
      '<div class="duel-m' + (cal.win === "b" ? " win" : "") + '"><span>B · ' + escapeHtml(d.b.name) + '</span><strong>' + fmt(cal.tb, 2) + ' años</strong></div></div>' +
      '<p style="margin-top:10px;">' + (winName ? '🏆 Llega antes <strong>' + escapeHtml(winName) + '</strong>: ' + fmt(cal.diff * 12, 1) + ' meses antes (' + fmt(cal.diff, 2) + ' años).' : 'Tardan exactamente lo mismo.') +
      ' ' + rich(duelLesson(d, cal)) + '</p>' +
      '<div class="reveal-box">' + rich('$t_A=' + offerTex(d, d.a) + '$ · $t_B=' + offerTex(d, d.b) + '$') + '</div>';
    if(mine){
      var ok = mine === cal.win;
      h += '<p class="duel-verdict ' + (ok ? "ok" : "bad") + '">' + (ok ? "🎯 ¡Tu intuición acertó!" : "🤔 Esta vez la intuición falló: por eso se calcula.") + '</p>';
    }
    if(tot){
      h += '<h4 style="margin:12px 0 4px;">Así votó la clase (' + tot + ')</h4>' + [["a", "A · " + d.a.name], ["b", "B · " + d.b.name], ["c", "Tardan lo mismo"]].map(function(x){
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
  if(cal.win === "c") return "El capital no cambia el tiempo: $\\dfrac{kP}{P}=k$ se cancela. Solo importan la tasa y la frecuencia.";
  var wa = cal.win === "a" ? d.a : d.b, wb = cal.win === "a" ? d.b : d.a;
  if(wa.r === wb.r && wa.n !== wb.n) return "Con la misma tasa anunciada, llega antes la capitalización " + CAPNAME[wa.n] + " que la " + CAPNAME[wb.n] + ".";
  if(wa.r < wb.r) return "Ojo: ganó la oferta de tasa menor, porque capitaliza " + CAPNAME[wa.n] + " frente a " + CAPNAME[wb.n] + ".";
  return "Ganó la de mayor tasa: capitalizar más seguido no alcanzó a compensar la tasa menor. Compara siempre el tiempo real.";
}
