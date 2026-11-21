/* ============================================================
   FASE 4 — DUPLICA Y TRIPLICA (Casos 1 al 6 de la guía)
============================================================ */
var DUPLICA = [
  {key:"u1", tag:"Reto 1 de 6", title:"¿Importa cuánto inviertes? (el capital se cancela)",
   story:"Dos amigas de la facultad quieren duplicar su dinero con la misma tasa y la misma capitalización. Una invierte <strong>S/ 100</strong> y la otra <strong>S/ 1 000 000</strong>.",
   q:"¿Cuál tarda menos en duplicar su dinero?",
   opts:["Tardan lo mismo: al dividir $\\dfrac{2P}{P}=2$, el capital se cancela","La que invierte más, porque tiene más dinero trabajando","La que invierte menos, porque necesita menos","No se puede saber sin conocer el capital"], correct:0,
   explain:"El tiempo para duplicar depende <strong>solo de la tasa y de la frecuencia</strong>: $t=\\dfrac{\\ln 2}{\\ln(1+i)}$. El capital desaparece al dividir $\\dfrac{2P}{P}$. Es el mensaje clave de la sesión."},
  timeQ("u2", 2, 6, "Caso 1: Manuel duplica su inversión", "<strong>Manuel</strong> invierte <strong>S/ 40 000</strong> al <strong>3.25 % anual</strong> con capitalización anual. ¿En cuántos años <strong>se duplica</strong> su inversión?",
    {k: 2, i: 0.0325, n: 1, unit: "años", kTxt: "$A=2P$", rTxt: "3.25 % anual", tol: 0.012, label: "Tiempo (años, 2 decimales)",
     extra: "Observa que ni siquiera usamos los S/ 40 000."}),
  timeQ("u3", 3, 6, "Caso 1: Manuel triplica su inversión", "Con los mismos datos de Manuel (<strong>3.25 % anual</strong>, capitalización anual), ¿en cuántos años <strong>se triplica</strong> su dinero?",
    {k: 3, i: 0.0325, n: 1, unit: "años", kTxt: "$A=3P$", rTxt: "3.25 % anual", tol: 0.012, label: "Tiempo (años, 2 decimales)",
     extra: "Triplicar tarda más que duplicar, pero <em>no el triple</em>: la curva se acelera con el tiempo."}),
  timeQ("u4", 4, 6, "Caso 2: Fernando y los semestres", "<strong>Fernando</strong> invierte <strong>S/ 80 000</strong> al <strong>4.08 % anual capitalizable semestralmente</strong>. ¿En cuántos <strong>semestres</strong> se duplica su dinero?",
    {k: 2, i: 0.0408 / 2, nominal: 0.0408, n: 2, unit: "semestres", kTxt: "$A=2P$", rTxt: "4.08 % anual cap. semestral", tol: 0.012,
     extra: "En años: $34.32/2\\approx17.16$."}),
  {key:"u5", tag:"Reto 5 de 6", title:"Casos 4 y 5: ¿quién duplica primero?",
   story:"<strong>Mario</strong> invierte <strong>S/ 150 000</strong> al <strong>3.02 %</strong> capitalizable <em>bimestralmente</em>. <strong>Julián</strong> invierte <strong>S/ 90 000</strong> al <strong>4.02 %</strong> capitalizable <em>mensualmente</em>.",
   q:"¿Quién duplica primero su dinero?",
   opts:["Julián (unos " + fmt(yrs(2, 0.0402, 12), 2) + " años), aunque invierte menos","Mario (unos " + fmt(yrs(2, 0.0302, 6), 2) + " años), porque invierte más","Los dos al mismo tiempo","No se puede comparar"], correct:0,
   explain:"Mario: $\\dfrac{\\ln 2}{6\\ln(1+0.0302/6)}\\approx" + fmt(yrs(2, 0.0302, 6), 2) + "$ años (138.06 bimestres). Julián: $\\dfrac{\\ln 2}{12\\ln(1+0.0402/12)}\\approx" + fmt(yrs(2, 0.0402, 12), 2) + "$ años (207.26 meses). La <strong>tasa</strong> manda, no el capital."},
  timeQ("u6", 6, 6, "Caso 6: Marcos y la capitalización diaria", "<strong>Marcos</strong> invierte <strong>S/ 50 000</strong> al <strong>2.08 % anual capitalizable diariamente</strong> ($n=365$). ¿En cuántos <strong>años</strong> se duplica su dinero?",
    {k: 2, i: 0.0208 / 365, nominal: 0.0208, n: 365, unit: "días", ask: "years", kTxt: "$A=2P$", rTxt: "2.08 % anual cap. diaria", tol: 0.012, label: "Tiempo (años, 2 decimales)",
     hint: "$i=\\dfrac{0.0208}{365}$. Calcula primero los <strong>días</strong> ($\\approx12\\,163.75$) y luego divide entre $365$.",
     extra: "Si usas año comercial ($n=360$) salen 11 997.12 días, que también equivalen a 33.33 años: la convención no cambia el resultado en años."})
];

function renderPhase4(app){
  phaseHeader(app, 4, "Duplica y triplica: el capital se cancela",
    "Cuando la meta es «duplicar» o «triplicar», <strong>no necesitas saber cuánto dinero hay</strong>: solo la tasa y la frecuencia. Verás el patrón de los Casos 1 al 6 de tu guía.");

  var lab = el("div", "panel");
  lab.innerHTML = '<h3>⏱️ Laboratorio: ¿cuánto tarda en duplicarse y triplicarse?</h3>' +
    rich('<p>La curva muestra por cuánto se multiplica el capital con el tiempo. Las líneas punteadas son $\\times2$ y $\\times3$. Fíjate: <strong>lenta al inicio, acelerada al final</strong>.</p>');
  app.appendChild(lab);
  var L = {r: 6, n: 1};
  function g(x){ return Math.pow(1 + L.r / 100 / L.n, L.n * x); }
  var bh = el("div"); lab.appendChild(bh);
  var bd = ExpBoard(bh, {xr: [0, 80], yr: [0, 4.5], curves: [{f: g}], hlines: [{y: 2, color: "--formula"}, {y: 3, color: "--gold"}],
    points: [{x: function(){ return yrs(2, L.r / 100, L.n); }, y: 2, color: "--formula", size: 7}, {x: function(){ return yrs(3, L.r / 100, L.n); }, y: 3, color: "--gold", size: 7}]});
  var ctl = el("div", "slider-grid");
  ctl.innerHTML =
    '<div class="slider-row"><label for="p4_r">Tasa anual <strong>r</strong> = <span class="slider-val" id="p4_rv">6</span> %</label><input type="range" id="p4_r" min="2" max="15" step="0.25" value="6"></div>' +
    '<div class="slider-row"><label for="p4_n">Capitaliza</label><select id="p4_n">' + CAPS.map(function(c){ return '<option value="' + c.n + '">' + c.name + ' (n=' + c.n + ')</option>'; }).join("") + '</select></div>';
  lab.appendChild(ctl);
  var read = el("div", "lab-readout"); lab.appendChild(read);
  function labRead(){
    var t2 = yrs(2, L.r / 100, L.n), t3 = yrs(3, L.r / 100, L.n);
    setBox(bd, 0, 4.2, Math.max(t3 * 1.2, 6), -0.3); bd.update();
    read.innerHTML = rich('<span style="color:var(--formula);font-weight:700;">Duplicar:</span> ' + nsep(nper(2, L.r / 100, L.n), 2) + ' ' + PERIODNAME[L.n] + (L.n === 1 ? '' : ' ≈ <strong>' + fmt(t2, 2) + ' años</strong>') + '<br>' +
      '<span style="color:var(--gold);font-weight:700;">Triplicar:</span> ' + nsep(nper(3, L.r / 100, L.n), 2) + ' ' + PERIODNAME[L.n] + (L.n === 1 ? '' : ' ≈ <strong>' + fmt(t3, 2) + ' años</strong>') + '<br>' +
      'Triplicar tarda ' + fmt(t3 / t2, 2) + ' veces lo que duplicar (no el triple). Sube la <strong>tasa</strong> y verás que el tiempo baja mucho más que cambiando la capitalización.');
  }
  ctl.querySelector("#p4_r").addEventListener("input", function(ev){ L.r = parseFloat(ev.target.value); document.getElementById("p4_rv").textContent = fmt(L.r, 2); labRead(); });
  ctl.querySelector("#p4_n").addEventListener("change", function(ev){ L.n = parseInt(ev.target.value, 10); labRead(); });
  labRead();

  var table = el("div", "panel");
  table.innerHTML = '<h3>📋 La tabla maestra de tu guía (Casos 1 al 6)</h3><p class="progress-note">Las unidades cambian, el patrón no. Toca cada caso para ver su cálculo.</p>';
  var CASES = [[40000, 0.0325, 1, "Manuel"], [80000, 0.0408, 2, "Fernando"], [120000, 0.0502, 4, "Vanesa"], [150000, 0.0302, 6, "Mario"], [90000, 0.0402, 12, "Julián"], [50000, 0.0208, 365, "Marcos"]];
  var rows = CASES.map(function(c, i){
    return '<tr><td>' + (i + 1) + ' · ' + c[3] + '</td><td>' + nsep(c[0], 0) + '</td><td>' + fmt(c[1] * 100, 2) + ' %</td><td>' + CAPS.filter(function(x){ return x.n === c[2]; })[0].name + '</td><td>' + nsep(nper(2, c[1], c[2]), 2) + ' ' + PERIODNAME[c[2]] + '</td><td>' + nsep(nper(3, c[1], c[2]), 2) + ' ' + PERIODNAME[c[2]] + '</td><td><strong>' + fmt(yrs(2, c[1], c[2]), 2) + '</strong></td></tr>';
  }).join("");
  table.appendChild(el("div", null, '<style>.p4tb th,.p4tb td{padding:4px 5px!important;font-size:.76rem!important;}</style><div style="overflow-x:auto"><table class="datatable p4tb"><tr><th>Caso</th><th>Capital (S/)</th><th>Tasa</th><th>Capitaliza</th><th>Duplicar</th><th>Triplicar</th><th>Años (×2)</th></tr>' + rows + '</table></div>'));
  app.appendChild(table);

  var wrap = el("div"); wrap.style.marginTop = "20px"; app.appendChild(wrap);
  runMissions(wrap, DUPLICA, "duplica", function(card, m, idx, solved){
    if(m.opts){ missionBody(card, m, solved); return; }
    timeMissionBuilder(card, m, solved);
  }, {title: "🏁 Fase 4 completa", text: "Descubriste que <strong>el capital se cancela</strong> y que el tiempo para duplicar o triplicar depende solo de la tasa y de la frecuencia. Ahora aplicamos todo a <strong>metas concretas</strong>: ¿cuánto falta para llegar a lo que quiero?"},
  "phase5", "Ir a Fase 5 →");
}

/* ============================================================
   FASE 5 — META (alcanzar una meta financiera: Casos 7 y 8 + línea de vida)
============================================================ */
var M5 = {SOFIA: {age: 22, P: 4000, A: 20000, r: 0.065}};
var META = [
  timeQ("m1", 1, 5, "Caso 7: la meta de María", "<strong>María</strong> tiene <strong>S/ 8 000</strong> y quiere llegar a <strong>S/ 12 000</strong>. Su tasa es <strong>6.35 % anual capitalizable trimestralmente</strong>. ¿Cuántos <strong>trimestres</strong> necesita?",
    {P: 8000, A: 12000, i: 0.0635 / 4, nominal: 0.0635, n: 4, unit: "trimestres", rTxt: "6.35 % anual cap. trimestral", tol: 0.012}),
  {key:"m2", tag:"Reto 2 de 5", title:"Caso 7: pásalo a años",
   story:"María obtuvo <strong>25.74 trimestres</strong>. Su tutor le recuerda: «No escribas 25.74 años; eso sería un error de unidad».",
   prompt:"Convierte $25.74$ trimestres a años (2 decimales).", ans:25.74 / 4, dec:2, tol:0.012, label:"Tiempo (años)", hint:"Un año tiene $4$ trimestres: divide entre $4$.",
   explain:"$\\dfrac{25.74}{4}=$ <strong>6.44 años</strong>. Siempre: periodos $\\div\\,n$ = años."},
  timeQ("m3", 3, 5, "Caso 8: los certificados de Maricielo", "<strong>Maricielo</strong> tiene <strong>S/ 9 000</strong> en certificados de ahorro y quiere llegar a <strong>S/ 11 000</strong>. Tasa: <strong>8.025 % anual capitalizable semestralmente</strong>. ¿Cuántos <strong>semestres</strong>?",
    {P: 9000, A: 11000, i: 0.08025 / 2, nominal: 0.08025, n: 2, unit: "semestres", rTxt: "8.025 % anual cap. semestral", tol: 0.012, extra: "En años: $5.10/2\\approx2.55$."}),
  timeQ("m4", 4, 5, "La beca de la clínica (Psicología)", "La clínica <strong>Brújula</strong> tiene <strong>S/ 20 000</strong> para becas y quiere llegar a <strong>S/ 30 000</strong>. Tasa: <strong>4.5 % anual capitalizable trimestralmente</strong>. ¿En cuántos <strong>años</strong> alcanzará la meta?",
    {P: 20000, A: 30000, i: 0.045 / 4, nominal: 0.045, n: 4, unit: "trimestres", ask: "years", rTxt: "4.5 % anual cap. trimestral", tol: 0.012, label: "Tiempo (años, 2 decimales)"}),
  {key:"m5", tag:"Reto 5 de 5", title:"La edad de Sofía (Derecho)",
   story:"<strong>Sofía</strong>, estudiante de Derecho de <strong>22 años</strong>, invierte <strong>S/ 4 000</strong> al <strong>6.5 % anual</strong> con capitalización anual. Quiere llegar a <strong>S/ 20 000</strong> para abrir su estudio.",
   prompt:"¿Qué <strong>edad</strong> tendrá Sofía cuando alcance su meta? (2 decimales)", ans:M5.SOFIA.age + Math.log(M5.SOFIA.A / M5.SOFIA.P) / Math.log(1 + M5.SOFIA.r), dec:2, tol:0.02, label:"Edad (años)",
   hint:"Primero halla $t=\\dfrac{\\ln(20000/4000)}{\\ln(1.065)}=\\dfrac{\\ln 5}{\\ln 1.065}$ y súmale los $22$ años que ya tiene.",
   explain:"$t=\\dfrac{\\ln 5}{\\ln 1.065}\\approx25.56$ años, así que Sofía tendrá $22+25.56\\approx$ <strong>47.56 años</strong>. Si hubiera empezado a los 32, llegaría a los 57.56: <em>empezar antes</em> adelanta la meta."}
];

function renderPhase5(app){
  phaseHeader(app, 5, "Meta: ¿cuánto falta para llegar?",
    "Ya conoces el capital, la meta y la tasa. Ahora el tiempo es tu <strong>plazo real</strong>. Y una pregunta de fondo: ¿<strong>a qué edad</strong> conviene empezar a invertir?");

  var lab = el("div", "panel");
  lab.innerHTML = '<h3>🧭 Línea de vida: ¿a qué edad empiezo?</h3>' +
    rich('<p>La curva <span style="color:var(--accent);font-weight:700;">violeta</span> es empezar a la edad que elijas; la <span style="color:var(--gold);font-weight:700;">dorada</span>, esperar unos años. La línea punteada es tu meta. Mira qué pasa a los <strong>60 años</strong>.</p>');
  app.appendChild(lab);
  var L = {c: 5000, m: 40000, r: 8, age: 20, delay: 10}, RET = 60;
  function f(start){ return function(x){ return x < start ? 0 : L.c * Math.pow(1 + L.r / 100, x - start); }; }
  function tNeed(){ return Math.log(L.m / L.c) / Math.log(1 + L.r / 100); }
  var bh = el("div"); lab.appendChild(bh);
  var bd = ExpBoard(bh, {xr: [18, 120], yr: [0, 100000],
    curves: [{f: function(x){ return f(L.age + L.delay)(x); }, color: "--gold"}, {f: function(x){ return f(L.age)(x); }}],
    hlines: [{y: function(){ return L.m; }, color: "--formula"}],
    points: [{x: RET, y: function(){ return f(L.age + L.delay)(RET); }, color: "--gold", size: 6}, {x: RET, y: function(){ return f(L.age)(RET); }, color: "--accent", size: 6}]});
  var ctl = el("div", "slider-grid");
  ctl.innerHTML =
    '<div class="slider-row"><label for="p5_age">Empiezo a los <strong id="p5_agev">20</strong> años</label><input type="range" id="p5_age" min="18" max="40" step="1" value="20"></div>' +
    '<div class="slider-row"><label for="p5_delay">Si espero <strong id="p5_delayv">10</strong> años más…</label><input type="range" id="p5_delay" min="2" max="20" step="1" value="10"></div>' +
    '<div class="slider-row"><label for="p5_c">Capital <strong>P</strong> = <span class="slider-val" id="p5_cv">S/ 5 000</span></label><input type="range" id="p5_c" min="2000" max="20000" step="1000" value="5000"></div>' +
    '<div class="slider-row"><label for="p5_m">Meta <strong>A</strong> = <span class="slider-val" id="p5_mv">S/ 40 000</span></label><input type="range" id="p5_m" min="20000" max="100000" step="5000" value="40000"></div>' +
    '<div class="slider-row"><label for="p5_r">Tasa anual <strong>r</strong> = <span class="slider-val" id="p5_rv">8</span> %</label><input type="range" id="p5_r" min="5" max="12" step="0.5" value="8"></div>';
  lab.appendChild(ctl);
  var read = el("div", "lab-readout"); lab.appendChild(read);
  function labRead(){
    if(L.m <= L.c * 1.2){ read.innerHTML = '<p class="progress-note">Sube la meta o baja el capital: debe haber algo que crecer.</p>'; return; }
    var t = tNeed(), a60 = f(L.age)(RET), b60 = f(L.age + L.delay)(RET);
    setBox(bd, L.age - 2, Math.max(L.m * 1.3, a60 * 0.55), Math.min(L.age + L.delay + t * 1.25, 118), -L.m * 0.07); bd.update();
    read.innerHTML = rich(
      'Llegar a la meta toma <strong>' + fmt(t, 2) + ' años</strong>: empezando a los ' + L.age + ' llegas a los <strong>' + fmt(L.age + t, 1) + '</strong>; esperando ' + L.delay + ' años, a los <strong>' + fmt(L.age + L.delay + t, 1) + '</strong>.<br>' +
      'A los <strong>60 años</strong>: empezando a los ' + L.age + ' tendrías <strong>' + sol(a60, 0) + '</strong>; esperando, <strong>' + sol(b60, 0) + '</strong>. Esperar te cuesta <strong>' + sol(a60 - b60, 0) + '</strong> (tu dinero quedó ' + fmt(a60 / b60, 2) + ' veces más grande).');
  }
  var lblFmt = {age: function(v){ return v; }, delay: function(v){ return v; }, c: function(v){ return sol(v, 0); }, m: function(v){ return sol(v, 0); }, r: function(v){ return fmt(v, 1); }};
  ["age", "delay", "c", "m", "r"].forEach(function(k){
    ctl.querySelector("#p5_" + k).addEventListener("input", function(ev){
      L[k] = parseFloat(ev.target.value);
      document.getElementById("p5_" + k + "v").textContent = lblFmt[k](L[k]);
      labRead();
    });
  });
  labRead();
  lab.appendChild(el("div", "reveal-box", rich("💡 <strong>Pregunta para pensar:</strong> ¿a qué edad deberías empezar a invertir? Mueve «Si espero…» y observa que el tiempo para llegar a la meta es el mismo, pero <strong>llegas más tarde</strong> y a los 60 tienes mucho menos.")));

  var tools = el("div", "panel");
  tools.innerHTML = '<h3>🧮 Tu calculadora</h3><p>Usa las teclas <strong>ln</strong> y <strong>log</strong> y pasa el resultado a tu respuesta.</p>';
  renderCalcButton(tools);
  app.appendChild(tools);

  var wrap = el("div"); wrap.style.marginTop = "20px"; app.appendChild(wrap);
  runMissions(wrap, META, "meta", function(card, m, idx, solved){
    if(m.chips){ timeMissionBuilder(card, m, solved); return; }
    missionBody(card, m, solved);
  }, {title: "🏁 Fase 5 completa", text: "Calculas cuánto falta para una meta, conviertes periodos a años y entiendes por qué <strong>empezar antes</strong> pesa tanto. Solo falta el <strong>dictamen final</strong>: comparar ofertas por tiempo, detectar promesas imposibles y recomendar."},
  "phase6", "Ir a Fase 6 →");
}

var PHASE_RENDERERS = {1:renderPhase1, 2:renderPhase2, 3:renderPhase3, 4:renderPhase4, 5:renderPhase5, 6:renderPhase6};

/* ---- Detector de promesas imposibles: ¿el plazo prometido es posible con esa tasa? ---- */
function detectStep(body, s, after, isReview){
  var items = s.items, state = items.map(function(){ return null; });
  var box = el("div", "detector");
  body.appendChild(box);
  var fb = feedbackBox(body);
  function real(it){ return yrs(it.k, it.r / 100, it.n); }
  function isEx(it){ return it.years < real(it) - 0.005; }
  function paint(){
    box.innerHTML = "";
    items.forEach(function(it, i){
      var row = el("div", "det-item" + (state[i] === true ? " ok" : (state[i] === "bad" ? " no" : "")));
      var rl = real(it), ex = isEx(it);
      row.innerHTML = '<div class="det-claim"><span class="det-n">' + (i + 1) + '</span><span>' + rich(it.text) + '</span></div>';
      if(window.__ICTEST) row.setAttribute("data-ex", ex ? "1" : "0");
      var act = el("div", "det-actions");
      if(isReview || state[i] === true){
        act.innerHTML = '<span class="det-res ' + (ex ? "no" : "ok") + '">' + (ex ? "🚩 Exagerada" : "✅ Posible") + ' · tiempo real ≈ ' + fmt(rl, 2) + ' años (prometen ' + fmt(it.years, 2) + ')</span>';
      } else {
        [["ok", "✅ Posible"], ["no", "🚩 Exagerada"]].forEach(function(b){
          var btn = el("button", "btn sm ghost", b[1]); btn.type = "button";
          btn.addEventListener("click", function(){
            var guessEx = b[0] === "no";
            if(guessEx === ex){
              state[i] = true; paint();
              if(state.every(function(v){ return v === true; })){
                fb.ok("✅ " + (s.explain || "¡Detector perfecto!"));
                after();
              } else fb.clear();
            } else {
              state[i] = "bad"; paint();
              fb.bad("Calcula el tiempo real: $t=\\dfrac{\\ln(" + it.k + ")}{" + (it.n > 1 ? it.n + "\\," : "") + "\\ln\\left(1+\\frac{" + fmt(it.r / 100, 4) + "}{" + it.n + "}\\right)}\\approx" + fmt(rl, 2) + "$ años. ¿Lo prometido ("+ fmt(it.years, 2) +" años) es menor o mayor?");
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
function withTol(s, t){ s.tol = t; return s; }

/* ============================================================
   FASE 6 — DICTAMEN (casos integrales + jefe final)
============================================================ */
var J1 = {P: 60000, A: 90000, a: {r: 0.054, n: 1}, b: {r: 0.0535, n: 12}, c: {r: 0.053, n: 2}};
var J1A = yrs(1.5, J1.a.r, J1.a.n), J1B = yrs(1.5, J1.b.r, J1.b.n), J1C = yrs(1.5, J1.c.r, J1.c.n);
var DETECT_ITEMS = [
  {k: 2, r: 6, n: 1, years: 12, text: "«Con <strong>6 % anual</strong> (capitalización anual), tu dinero se <strong>duplica en 12 años</strong>.»"},
  {k: 3, r: 8, n: 1, years: 10, text: "«Con <strong>8 % anual</strong> (capitalización anual), tu dinero se <strong>triplica en 10 años</strong>.»"},
  {k: 2, r: 24, n: 12, years: 3, text: "«Con <strong>24 % anual capitalizable mensualmente</strong> (2 % mensual), tu dinero se <strong>duplica en 3 años</strong>.»"},
  {k: 2, r: 5, n: 365, years: 1, text: "«Con nuestra «capitalización especial» a <strong>5 % anual diario</strong>, tu dinero se <strong>duplica en 1 año</strong>.»"},
  {k: 2, r: 12, n: 12, years: 5, text: "«Con <strong>12 % anual capitalizable mensualmente</strong>, tu dinero se <strong>duplica en 5 años</strong>.»"}
];
var J3 = {P: 30000, A: 45000, r: 0.048, n: 12, plazo: 8};
var J3M = nper(1.5, J3.r, J3.n), J3Y = J3M / J3.n;
var J4 = {P: 150000, A: 250000, a: {r: 0.045, n: 365}, b: {r: 0.0462, n: 4}, c: {r: 0.0465, n: 1}};
var J4A = yrs(J4.A / J4.P, J4.a.r, J4.a.n), J4B = yrs(J4.A / J4.P, J4.b.r, J4.b.n), J4C = yrs(J4.A / J4.P, J4.c.r, J4.c.n);
var DICTAMEN = [
  {key:"j1", emoji:"⚖️", context:"Consignación judicial: ¿cuál llega antes a S/ 90 000?",
   story:"Una abogada debe consignar <strong>S/ 60 000</strong> y necesita llegar a <strong>S/ 90 000</strong> lo antes posible para pagar una reparación civil. Tres entidades responden. Cuidado: la tasa más alta <em>no siempre</em> gana.",
   offers:[{tag:"A", name:"Caja Andina", desc:"5.4 % anual · capitaliza <strong>anualmente</strong>"}, {tag:"B", name:"Cooperativa Sol", desc:"5.35 % anual · capitaliza <strong>mensualmente</strong>"}, {tag:"C", name:"Banco Nuevo", desc:"5.3 % anual · capitaliza <strong>semestralmente</strong>"}],
   steps:[
     mcqStep("1. Predice", "En la oferta B (mensual), ¿qué tasa por periodo usas y en qué unidad sale el resultado?", "$i=\\dfrac{0.0535}{12}\\approx0.004458$ por mes: el resultado sale en <strong>meses</strong>", ["$i=0.0535$: el resultado sale en años","$i=0.0535\\cdot12$: el resultado sale en meses","$i=\\dfrac{0.0535}{4}$: el resultado sale en trimestres"], "Mensual: $n=12$, así que $i=\\dfrac{r}{12}$ y el resultado queda en <strong>meses</strong>. Luego se divide entre $12$ para tener años y comparar."),
     withTol(numStep("2. Oferta A", "Calcula el tiempo con la <strong>Caja Andina</strong>, en años.", J1A, 2, "$t=\\dfrac{\\ln(1.5)}{\\ln(1.054)}$.", "$t_A=\\dfrac{\\ln 1.5}{\\ln 1.054}\\approx$ <strong>" + fmt(J1A, 2) + " años</strong>.", "Tiempo (años) ="), 0.012),
     withTol(numStep("3. Oferta B", "Calcula el tiempo con la <strong>Cooperativa Sol</strong>, en años (primero meses, luego $\\div12$).", J1B, 2, "Meses: $\\dfrac{\\ln 1.5}{\\ln(1+0.0535/12)}\\approx" + fmt(nper(1.5, J1.b.r, 12), 2) + "$; divide entre $12$.", "$t_B\\approx" + fmt(nper(1.5, J1.b.r, 12), 2) + "$ meses $=$ <strong>" + fmt(J1B, 2) + " años</strong>.", "Tiempo (años) ="), 0.012),
     withTol(numStep("4. Oferta C", "Calcula el tiempo con el <strong>Banco Nuevo</strong>, en años (semestres $\\div2$).", J1C, 2, "Semestres: $\\dfrac{\\ln 1.5}{\\ln(1+0.053/2)}$; divide entre $2$.", "$t_C\\approx" + fmt(nper(1.5, J1.c.r, 2), 2) + "$ semestres $=$ <strong>" + fmt(J1C, 2) + " años</strong>.", "Tiempo (años) ="), 0.012),
     mcqStep("5. Dictamina", "¿Qué entidad recomiendas?", "La Cooperativa Sol (B): llega antes (" + fmt(J1B, 2) + " años) aunque su tasa anunciada es menor que la de A", ["La Caja Andina (A): tiene la tasa más alta","El Banco Nuevo (C): capitaliza semestralmente","Las tres tardan lo mismo"], "A tarda " + fmt(J1A, 2) + " años, B " + fmt(J1B, 2) + " y C " + fmt(J1C, 2) + ". La capitalización mensual de B compensa su tasa algo menor. <strong>Compara siempre los tiempos reales.</strong>")
   ],
   verdict:"Dictamen: se recomienda la <strong>Cooperativa Sol</strong>. Alcanza los S/ 90 000 en " + fmt(J1B, 2) + " años, frente a " + fmt(J1A, 2) + " (Caja Andina) y " + fmt(J1C, 2) + " (Banco Nuevo). <em>Una capitalización más frecuente puede compensar una tasa anunciada ligeramente menor.</em>"},
  {key:"j2", emoji:"🚩", context:"Detector de promesas imposibles",
   story:"La clínica <strong>Brújula</strong> recibe volantes que prometen duplicar o triplicar el dinero en plazos muy cortos. La directora te pide separar lo <strong>posible</strong> de lo <strong>exagerado</strong>. Pista: calcula el tiempo real con la fórmula y compáralo con lo prometido.",
   steps:[
     mcqStep("1. Lee", "¿Cómo sabes si una promesa de plazo es posible?", "Calculo el <strong>tiempo real</strong> con $\\dfrac{\\ln k}{\\ln(1+i)}$: si lo prometido es <u>menor</u> que el real, es exagerada", ["Si el volante es de una cooperativa conocida","Si el plazo prometido es un número redondo","Si el contrato es largo"], "El tiempo real es el <strong>mínimo</strong> que permite esa tasa. Una promesa más corta que ese mínimo es imposible sin cobros ocultos o un engaño."),
     withTol(numStep("2. Calcula", "¿Cuántos años tarda realmente en <strong>duplicarse</strong> el dinero al <strong>6 % anual</strong> (capitalización anual)?", yrs(2, 0.06, 1), 2, "$t=\\dfrac{\\ln 2}{\\ln 1.06}=\\dfrac{0.693147}{0.058269}$.", "$t=\\dfrac{\\ln 2}{\\ln 1.06}\\approx$ <strong>11.90 años</strong>: una promesa de «duplicar en 12 años» es honesta; «en 5 años», no.", "Tiempo (años) ="), 0.012),
     {label: "3. Detecta", kind: "detect", q: "Marca cada promesa del volante como posible o exagerada.", items: DETECT_ITEMS,
      explain: "Las promesas 1 y 3 son <strong>posibles</strong> (tiempo real $11.90$ y $2.92$ años). La 2 (real $14.27$ años), la 4 (real $13.86$ años) y la 5 (real $5.81$ años) <strong>prometen menos tiempo del que permite la tasa</strong>."},
     mcqStep("4. Decide", "Un paciente quiere invertir sus ahorros en la promesa 4 («duplicar en 1 año al 5 % anual diario»). ¿Qué le dices?", "Que es exagerada: con esa tasa duplicar tarda unos 13.9 años; que pida el contrato y consulte con un asesor", ["Que invierta: «capitalización especial» suena avanzado","Que invierta una parte pequeña por si acaso","Que no importa el plazo prometido, solo la tasa"], "Para duplicar en 1 año se necesitaría una tasa de casi <strong>100 % anual</strong>. Quien asesora a otras personas verifica el <em>tiempo real</em> antes de creer una promesa.")
   ],
   verdict:"Dictamen: las promesas 2, 4 y 5 son <strong>exageradas</strong> porque piden menos tiempo del que permite su tasa. Un buen profesional del Derecho o de la Psicología calcula el tiempo real antes de recomendar o aceptar una oferta."},
  {key:"j3", emoji:"⚖️", context:"Ejecución de sentencia: ¿alcanza el plazo de 8 años?",
   story:"Una indemnización de <strong>S/ 30 000</strong> se consigna al <strong>4.8 % anual capitalizable mensualmente</strong>. La parte necesita que llegue a <strong>S/ 45 000</strong> antes de que venza el plazo de ejecución de <strong>8 años</strong>.",
   offers:[{tag:"Datos", name:"Consignación", desc:"S/ 30 000 → S/ 45 000 · 4.8 % mensual · plazo 8 años"}],
   steps:[
     mcqStep("1. Plantea", "¿Qué tasa por periodo y qué unidad usas?", "$i=\\dfrac{0.048}{12}=0.004$ por mes; el resultado sale en <strong>meses</strong>", ["$i=0.048$; el resultado sale en años","$i=\\dfrac{0.048}{4}$; sale en trimestres","$i=0.048\\cdot12$; sale en meses"], "Capitaliza mensualmente: $n=12$ y $i=\\dfrac{0.048}{12}=0.004$."),
     withTol(numStep("2. Meses", "Calcula cuántos <strong>meses</strong> tarda en llegar a S/ 45 000.", J3M, 2, "$\\dfrac{\\ln(1.5)}{\\ln(1.004)}$.", "$\\dfrac{\\ln 1.5}{\\ln 1.004}\\approx$ <strong>" + fmt(J3M, 2) + " meses</strong>.", "Meses ="), 0.03),
     withTol(numStep("3. Años", "Convierte a años.", J3Y, 2, "Divide los meses entre $12$.", "$\\dfrac{" + fmt(J3M, 2) + "}{12}\\approx$ <strong>" + fmt(J3Y, 2) + " años</strong>.", "Tiempo (años) ="), 0.012),
     mcqStep("4. Decide", "¿Llega a tiempo la consignación?", "No: tarda " + fmt(J3Y, 2) + " años, unos " + fmt((J3Y - J3.plazo) * 12, 1) + " meses más que el plazo de 8 años", ["Sí: llega antes de los 8 años","Justo en los 8 años","No se puede saber sin el nombre del banco"], "$" + fmt(J3Y, 2) + " > 8$ años. Faltan unos " + fmt((J3Y - J3.plazo) * 12, 1) + " meses: conviene negociar una tasa algo mayor o completar con un aporte.")
   ],
   verdict:"Dictamen: la consignación <strong>no alcanza</strong> los S/ 45 000 dentro del plazo de 8 años (necesita " + fmt(J3Y, 2) + " años). Se recomienda buscar una tasa mayor o un aporte adicional antes de que venza el plazo."},
  {key:"j4", emoji:"🏆", boss:true, context:"Jefe final: el Fondo de la Defensoría",
   story:"La Defensoría tiene <strong>S/ 150 000</strong> y necesita llegar a <strong>S/ 250 000</strong> para comprar una sede de asistencia legal y psicológica. Te piden un dictamen sobre tres ofertas. <strong>Tu informe decide.</strong>",
   offers:[{tag:"A", name:"Banco Diario", desc:"4.5 % anual · capitaliza <strong>diariamente</strong> ($n=365$)"}, {tag:"B", name:"Banco Trimestral", desc:"4.62 % anual · capitaliza <strong>trimestralmente</strong>"}, {tag:"C", name:"Banco Anual", desc:"4.65 % anual · capitaliza <strong>anualmente</strong>"}],
   steps:[
     numStep("1. Lee", "Calcula el cociente $\\dfrac{A}{P}$ de la meta (4 decimales).", 250000 / 150000, 4, "$250000/150000$.", "$\\dfrac{250000}{150000}=1.6667$: el fondo debe multiplicarse por $1.6667$.", "$A/P$ ="),
     withTol(numStep("2. Oferta A", "Calcula el tiempo con el <strong>Banco Diario</strong>, en años.", J4A, 2, "Días: $\\dfrac{\\ln(1.6667)}{\\ln(1+0.045/365)}$; divide entre $365$.", "$t_A\\approx" + fmt(nper(J4.A / J4.P, J4.a.r, 365), 1) + "$ días $=$ <strong>" + fmt(J4A, 2) + " años</strong>.", "Tiempo (años) ="), 0.012),
     withTol(numStep("3. Oferta B", "Calcula el tiempo con el <strong>Banco Trimestral</strong>, en años.", J4B, 2, "Trimestres: $\\dfrac{\\ln(1.6667)}{\\ln(1+0.0462/4)}$; divide entre $4$.", "$t_B\\approx" + fmt(nper(J4.A / J4.P, J4.b.r, 4), 2) + "$ trimestres $=$ <strong>" + fmt(J4B, 2) + " años</strong>.", "Tiempo (años) ="), 0.012),
     withTol(numStep("4. Oferta C", "Calcula el tiempo con el <strong>Banco Anual</strong>, en años.", J4C, 2, "$\\dfrac{\\ln(1.6667)}{\\ln(1.0465)}$.", "$t_C\\approx$ <strong>" + fmt(J4C, 2) + " años</strong>.", "Tiempo (años) ="), 0.012),
     mcqStep("5. Dictamina", "¿Qué oferta recomiendas?", "El Banco Trimestral (B): alcanza la meta primero, en " + fmt(J4B, 2) + " años", ["El Banco Anual (C): tiene la tasa nominal más alta","El Banco Diario (A): capitaliza todos los días","Las tres son equivalentes"], "B: " + fmt(J4B, 2) + " años · C: " + fmt(J4C, 2) + " · A: " + fmt(J4A, 2) + ". La tasa de C es mayor que la de B, pero B capitaliza más seguido y llega antes. La capitalización diaria de A no compensa una tasa de 4.5 %."),
     mcqStep("6. Redacta", "Elige la conclusión mejor redactada para el informe.", "Se recomienda el Banco Trimestral: alcanza los S/ 250 000 en " + fmt(J4B, 2) + " años, " + fmt((J4C - J4B) * 12, 1) + " meses antes que el Banco Anual y " + fmt((J4A - J4B) * 12, 1) + " meses antes que el Banco Diario; la decisión se basa en el tiempo real hasta la meta.", ["Se recomienda el Banco Anual porque tiene la tasa más alta.","Se recomienda el Banco Diario porque capitaliza todos los días.","Se recomienda cualquiera; el tiempo no importa."], "Un buen dictamen indica <strong>qué se recomienda, con qué cifras y por qué</strong>.")
   ],
   verdict:"Dictamen del jefe final: <strong>Banco Trimestral</strong>. Llega a los S/ 250 000 en " + fmt(J4B, 2) + " años, frente a " + fmt(J4C, 2) + " (Banco Anual) y " + fmt(J4A, 2) + " (Banco Diario). Ni la tasa nominal más alta ni la capitalización más frecuente ganan por sí solas: gana la combinación que alcanza la meta en <strong>menos tiempo</strong>.",
   decision:"Se recomienda invertir los S/ 150 000 en el Banco Trimestral (4.62 % anual, capitalización trimestral): alcanza la meta de S/ 250 000 en " + fmt(J4B, 2) + " años, " + fmt((J4C - J4B) * 12, 1) + " meses antes que el Banco Anual y " + fmt((J4A - J4B) * 12, 1) + " meses antes que el Banco Diario."}
];
