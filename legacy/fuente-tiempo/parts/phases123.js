/* ============================================================
   Utilidades comunes de la actividad «Cálculo del periodo de tiempo»
============================================================ */
var CAPS = [
  {n: 1, name: "Anual"}, {n: 2, name: "Semestral"}, {n: 4, name: "Trimestral"}, {n: 6, name: "Bimestral"},
  {n: 12, name: "Mensual"}, {n: 24, name: "Quincenal"}, {n: 365, name: "Diaria"}
];
var PERIODNAME = {1: "años", 2: "semestres", 4: "trimestres", 6: "bimestres", 12: "meses", 24: "quincenas", 365: "días"};
function solTex(n, d){ return nsep(n, d).replace(/[  ]/g, "\\,"); }
/* periodos que tarda en multiplicarse por k un capital con tasa anual r (decimal) capitalizada n veces al año */
function nper(k, r, n){ return Math.log(k) / Math.log(1 + r / n); }
function yrs(k, r, n){ return nper(k, r, n) / n; }
function missionBody(card, m, solved, label){
  if(m.story) card.appendChild(el("p", null, rich(m.story)));
  if(m.table) dataTable(card, m.table);
  if(m.opts) mcq(card, {question: m.q, options: m.opts, correct: m.correct, explain: m.explain, onSolved: solved});
  else {
    card.appendChild(el("p", null, rich(m.prompt)));
    numCheck(card, {label: m.label || label || "Respuesta", ans: m.ans, dec: m.dec, tol: m.tol, hint: m.hint, explain: m.explain, onSolved: solved});
  }
}
/* Reto numérico de «¿cuánto tiempo?» con guía paso a paso.
   o = {P, A | k, i (tasa por periodo, decimal), n (capitalizaciones por año, para pasar a años), nominal (tasa anual si la dan así), unit, ask: "per"|"years", tol, extra} */
function timeQ(key, n, tot, title, story, o){
  var ratio = o.k || (o.A / o.P);
  var iper = o.i;
  var per = Math.log(ratio) / Math.log(1 + iper), years = per / (o.n || 1);
  var ask = o.ask || "per";
  var lnR = Math.log(ratio), lnI = Math.log(1 + iper);
  var chips = [];
  if(o.P) chips.push('Capital <strong>' + sol(o.P, 0) + '</strong>');
  if(o.A) chips.push('Meta <strong>' + sol(o.A, Number.isInteger(o.A) ? 0 : 2) + '</strong>');
  if(o.kTxt) chips.push('Meta <strong>' + o.kTxt + '</strong>');
  chips.push('Tasa <strong>' + (o.rTxt || (fmt(iper * 100, 4) + ' %')) + '</strong>');
  var steps = [
    o.nominal ? "<strong>Tasa por periodo:</strong> $i=\\dfrac{r}{n}=\\dfrac{" + fmt(o.nominal, 5) + "}{" + o.n + "}=" + fmt(iper, 6) + "$." : "<strong>Tasa por periodo:</strong> ya viene por periodo: $i=" + fmt(iper, 6) + "$.",
    o.k ? "<strong>Cociente:</strong> $\\dfrac{A}{P}=" + o.k + "$." : "<strong>Cociente:</strong> $\\dfrac{A}{P}=\\dfrac{" + solTex(o.A, Number.isInteger(o.A) ? 0 : 2) + "}{" + solTex(o.P, 0) + "}=" + fmt(ratio, 6) + "$.",
    "<strong>Logaritmos:</strong> $\\ln(" + fmt(ratio, 6) + ")\\approx" + fmt(lnR, 6) + "$ y $\\ln(" + fmt(1 + iper, 6) + ")\\approx" + fmt(lnI, 6) + "$.",
    "<strong>Divide:</strong> $t=\\dfrac{" + fmt(lnR, 6) + "}{" + fmt(lnI, 6) + "}\\approx" + fmt(per, 2) + "$ " + o.unit + "." + (ask === "years" ? " Para pasar a años divide entre $n=" + o.n + "$: $" + fmt(per, 2) + "/" + o.n + "\\approx" + fmt(years, 2) + "$." : "")
  ];
  var ans = ask === "years" ? years : per;
  if(o.ansOverride !== undefined) ans = o.ansOverride;
  var unitTxt = ask === "years" ? "años" : o.unit;
  return {key: key, tag: "Reto " + n + " de " + tot, title: title, story: story, chips: chips, ans: ans, dec: 2, tol: (o.tol !== undefined ? o.tol : 0.012), steps: steps,
    label: o.label || ("Tiempo (" + unitTxt + ", 2 decimales)"),
    hint: o.hint || "Calcula por separado $\\ln\\left(\\dfrac{A}{P}\\right)$ y $\\ln(1+i)$ y divide." + (ask === "years" ? " Al final convierte los periodos a años dividiendo entre $n$." : " La respuesta queda en <strong>" + o.unit + "</strong>."),
    explain: "$t=\\dfrac{\\ln(" + fmt(ratio, 4) + ")}{\\ln(" + fmt(1 + iper, 6) + ")}\\approx$ <strong>" + fmt(ask === "years" ? years : per, 2) + " " + unitTxt + "</strong>" + (ask === "years" ? "" : (o.n && o.n > 1 && o.showYears !== false && !o.extra ? " (unos " + fmt(years, 2) + " años)" : "")) + "." + (o.extra ? " " + o.extra : "")};
}
function timeMissionBuilder(card, m, solved){
  card.appendChild(el("p", null, rich(m.story)));
  var chips = el("div", "given-chips");
  chips.innerHTML = m.chips.map(function(c){ return '<span class="gchip">' + rich(c) + '</span>'; }).join("");
  card.appendChild(chips);
  var fx = el("div", "tex-block"); fx.innerHTML = KB("t=\\dfrac{\\ln\\left(A/P\\right)}{\\ln(1+i)}"); card.appendChild(fx);
  if(!REVIEW){
    var d = document.createElement("details"); d.className = "peek";
    d.innerHTML = '<summary>🧭 Guía paso a paso (opcional)</summary><div class="peek-body"><ol class="th-list">' + m.steps.map(function(s){ return "<li>" + rich(s) + "</li>"; }).join("") + '</ol></div>';
    card.appendChild(d);
  }
  numCheck(card, {label: m.label, ans: m.ans, dec: m.dec, tol: m.tol, hint: m.hint, explain: m.explain, onSolved: solved});
}

/* ============================================================
   FASE 1 — DESPEJA (el logaritmo baja el exponente)
============================================================ */
var DESPEJA = [
  {key:"d1", tag:"Reto 1 de 6", title:"El tiempo atrapado en el exponente",
   story:"Don Aurelio tiene <strong>S/ 10 000</strong> y quiere llegar a <strong>S/ 15 000</strong>. Con una tasa anual de $5\\,\\%$ la ecuación es $10000\\,(1.05)^{t}=15000$, es decir $(1.05)^{t}=1.5$.",
   q:"¿Por qué no se puede despejar $t$ con una resta o una división?",
   opts:["Porque $t$ está en el exponente: hace falta el logaritmo, que lo «baja»","Porque falta el capital en la ecuación","Porque la tasa es muy pequeña","Sí se puede: basta dividir $1.5$ entre $1.05$"], correct:0,
   explain:"Si divides $1.5$ entre $1.05$ no obtienes $t$: el exponente no se «suelta» con operaciones comunes. El <strong>logaritmo</strong> es la operación inversa de la exponenciación y permite bajar $t$."},
  {key:"d2", tag:"Reto 2 de 6", title:"La propiedad que baja el exponente",
   story:"En la Semana 13 viste las propiedades de los logaritmos. Una de ellas es la herramienta clave para hoy.",
   q:"¿Cuál es la propiedad que permite despejar un exponente?",
   opts:["$\\ln\\left(a^{x}\\right)=x\\cdot\\ln(a)$","$\\ln(a+b)=\\ln(a)+\\ln(b)$","$\\ln\\left(a^{x}\\right)=\\ln(a)^{x}$","$\\ln(a\\cdot x)=a^{x}$"], correct:0,
   explain:"$\\ln\\left(a^{x}\\right)=x\\cdot\\ln(a)$: el exponente $x$ pasa a multiplicar. Así, $\\ln\\left[(1.05)^{t}\\right]=t\\cdot\\ln(1.05)$ y ya se puede despejar."},
  {key:"d3", tag:"Reto 3 de 6", title:"Tu primer logaritmo natural",
   story:"Abre la calculadora y busca la tecla <span class=\"mono\">ln</span>. Escribe <span class=\"mono\">ln(2)</span> y cierra el paréntesis.",
   prompt:"Calcula $\\ln(2)$ (4 decimales).", ans:Math.log(2), dec:4, hint:"Pulsa <span class=\"mono\">ln</span>, escribe $2$, cierra con $)$ y $=$. Debe dar menos que $1$.",
   explain:"$\\ln(2)\\approx$ <strong>0.6931</strong>. Es el número al que hay que elevar $e$ para obtener $2$. Lo volveremos a usar al <em>duplicar</em> un capital."},
  {key:"d4", tag:"Reto 4 de 6", title:"Despeja el exponente",
   story:"Resuelve $(1.1)^{t}=1.331$. Aplica $\\ln$ a ambos lados: $t\\cdot\\ln(1.1)=\\ln(1.331)$, así que $t=\\dfrac{\\ln(1.331)}{\\ln(1.1)}$.",
   prompt:"Calcula $t$ (2 decimales).", ans:3, dec:2, hint:"$\\ln(1.331)\\approx0.286$ y $\\ln(1.1)\\approx0.0953$. Divide el primero entre el segundo.",
   explain:"$t=\\dfrac{\\ln(1.331)}{\\ln(1.1)}=\\dfrac{0.286179}{0.095310}=$ <strong>3</strong>. ¡Comprobación: $1.1^{3}=1.331$!"},
  {key:"d5", tag:"Reto 5 de 6", title:"¿Cuándo se duplica? (primer vistazo)",
   story:"Un estudio jurídico deposita <strong>S/ 1 000</strong> al $4\\,\\%$ anual con capitalización anual. Quiere saber cuándo tendrá <strong>S/ 2 000</strong>: $(1.04)^{t}=2$.",
   prompt:"Calcula $t$ en años (2 decimales).", ans:Math.log(2) / Math.log(1.04), dec:2, tol:0.015, hint:"$t=\\dfrac{\\ln 2}{\\ln 1.04}=\\dfrac{0.693147}{0.039221}$.",
   explain:"$t=\\dfrac{\\ln 2}{\\ln 1.04}\\approx$ <strong>17.67 años</strong>. Más adelante verás que esto no depende de cuánto inviertas."},
  {key:"d6", tag:"Reto 6 de 6", title:"Detective: ¿qué error cometió el asistente? (Derecho)",
   story:"El estudio debe hallar $\\ln\\left(\\dfrac{30000}{25000}\\right)$. Su asistente escribe: «$\\dfrac{\\ln(30000)}{\\ln(25000)}\\approx\\dfrac{10.3090}{10.1266}\\approx1.0180$».",
   q:"¿Cuál es el error?",
   opts:["Aplicó mal la propiedad: $\\ln(M/C)=\\ln M-\\ln C\\approx0.1823$ (o se calcula el cociente $1.2$ y luego $\\ln(1.2)$)","No hay error: el logaritmo de un cociente es el cociente de logaritmos","Debió usar $\\log$ y no $\\ln$","Debió multiplicar los dos logaritmos"], correct:0,
   explain:"El logaritmo de un cociente es una <strong>resta</strong> de logaritmos: $\\ln(30000)-\\ln(25000)=0.1823=\\ln(1.2)$. El asistente obtuvo $1.0180$, que no tiene nada que ver. Truco: calcula primero $\\dfrac{M}{C}$ y aplica $\\ln$ una sola vez."}
];

function renderPhase1(app){
  phaseHeader(app, 1, "Despeja: ¿cuánto tarda mi dinero?",
    "En la Semana 11 calculabas cuánto dinero tendrías. Hoy invertimos la pregunta: <strong>¿cuánto tiempo hace falta?</strong> Y la herramienta que lo hace posible es el logaritmo de la Semana 13.");

  var lab = el("div", "panel");
  lab.innerHTML = '<h3>🔬 Laboratorio: encuentra el tiempo en la curva</h3>' +
    rich('<p>La curva <span style="color:var(--accent);font-weight:700;">violeta</span> es tu dinero creciendo. La línea <span style="color:var(--formula);font-weight:700;">punteada</span> es tu meta $A$. El <span style="color:var(--gold);font-weight:700;">punto dorado</span> marca <strong>cuándo</strong> se cruzan: ese es el tiempo $t$ que vamos a despejar.</p>');
  app.appendChild(lab);
  var L = {p: 10000, r: 5, k: 2};
  function tStar(){ return Math.log(L.k) / Math.log(1 + L.r / 100); }
  function Mx(x){ return L.p * Math.pow(1 + L.r / 100, x); }
  var bh = el("div"); lab.appendChild(bh);
  var bd = ExpBoard(bh, {xr: [0, 80], yr: [0, 30000], curves: [{f: Mx}], hlines: [{y: function(){ return L.p * L.k; }, color: "--formula"}],
    points: [{x: tStar, y: function(){ return L.p * L.k; }, color: "--gold", size: 7}]});
  var ctl = el("div", "slider-grid");
  ctl.innerHTML =
    '<div class="slider-row"><label for="p1_p">Capital <strong>P</strong> = <span class="slider-val" id="p1_pv">S/ 10 000</span></label><input type="range" id="p1_p" min="1000" max="100000" step="1000" value="10000"></div>' +
    '<div class="slider-row"><label for="p1_r">Tasa anual <strong>r</strong> = <span class="slider-val" id="p1_rv">5</span> %</label><input type="range" id="p1_r" min="2" max="15" step="0.5" value="5"></div>' +
    '<div class="slider-row"><label for="p1_k">La meta es <strong>k</strong> = <span class="slider-val" id="p1_kv">2</span> veces el capital</label><input type="range" id="p1_k" min="1.5" max="4" step="0.1" value="2"></div>';
  lab.appendChild(ctl);
  var read = el("div", "lab-readout"); lab.appendChild(read);
  function labRead(){
    var t = tStar(), A = L.p * L.k;
    setBox(bd, 0, A * 1.25, Math.max(t * 1.3, 6), -A * 0.07); bd.update();
    read.innerHTML = rich('Meta: $A=' + solTex(A, 0) + '$ &rarr; $t=\\dfrac{\\ln(' + fmt(L.k, 1) + ')}{\\ln(' + fmt(1 + L.r / 100, 3) + ')}\\approx' + fmt(t, 2) + '$ <strong>años</strong>.<br>' +
      'Comprobación: $P(1+r)^{t}=' + solTex(Mx(t), 2) + '$ ✔<br><span class="badge up">Prueba mover el capital: ¡el tiempo no cambia!</span>');
  }
  [["p", 1], ["r", 1], ["k", 1]].forEach(function(a){
    ctl.querySelector("#p1_" + a[0]).addEventListener("input", function(ev){
      L[a[0]] = parseFloat(ev.target.value);
      document.getElementById("p1_" + a[0] + "v").textContent = a[0] === "p" ? sol(L.p, 0) : fmt(L[a[0]], 1);
      labRead();
    });
  });
  labRead();

  var how = el("div", "panel");
  how.innerHTML = '<h3>🧩 Los 4 pasos para bajar el exponente</h3>' + rich('<ol class="th-list"><li>Aísla la potencia: $(1+r)^{t}=\\dfrac{A}{P}$.</li><li>Aplica $\\ln$ a ambos lados.</li><li>Baja el exponente: $t\\cdot\\ln(1+r)=\\ln\\left(\\dfrac{A}{P}\\right)$.</li><li>Divide: $t=\\dfrac{\\ln(A/P)}{\\ln(1+r)}$.</li></ol><p class="progress-note">Abre la calculadora (tiene las teclas <strong>ln</strong> y <strong>log</strong>) y usa los retos de abajo para practicar.</p>');
  renderCalcButton(how);
  app.appendChild(how);

  var wrap = el("div"); wrap.style.marginTop = "20px"; app.appendChild(wrap);
  runMissions(wrap, DESPEJA, "despeja", function(card, m, idx, solved){ missionBody(card, m, solved, "Respuesta"); },
    {title: "🏁 Fase 1 completa", text: "Ya sabes <strong>bajar un exponente</strong> con logaritmos: $t=\\dfrac{\\ln(A/P)}{\\ln(1+r)}$. Ahora vamos a armar la fórmula completa, cuidando la <strong>tasa por periodo</strong> y la <strong>unidad</strong> del resultado."},
    "phase2", "Ir a Fase 2 →");
}

/* ============================================================
   FASE 2 — LA FÓRMULA  t = ln(A/P) / ln(1+r)
============================================================ */
var FORMULA = [
  {key:"f1", tag:"Reto 1 de 6", title:"Elige el despeje correcto",
   story:"Parte de $A=P(1+r)^{t}$ y despeja $t$ siguiendo los pasos de la Fase 1.",
   q:"¿Cuál es la fórmula del tiempo?",
   opts:["$t=\\dfrac{\\ln\\left(A/P\\right)}{\\ln(1+r)}$","$t=\\dfrac{A/P}{1+r}$","$t=\\ln\\left(A/P\\right)\\cdot\\ln(1+r)$","$t=\\dfrac{\\ln(A)}{\\ln(P)\\cdot(1+r)}$"], correct:0,
   explain:"Se divide $A$ entre $P$, se aplica $\\ln$ y se baja el exponente: $t\\cdot\\ln(1+r)=\\ln(A/P)$. Por eso $t$ es el <strong>cociente de dos logaritmos</strong>."},
  {key:"f2", tag:"Reto 2 de 6", title:"La unidad manda (regla de oro)",
   story:"Una cooperativa paga <strong>5 % trimestral</strong>. Calculas $t=\\dfrac{\\ln(A/P)}{\\ln(1.05)}$ y obtienes $4$.",
   q:"¿En qué unidad queda ese resultado?",
   opts:["4 trimestres (1 año)","4 años","4 meses","4 días"], correct:0,
   explain:"<strong>Regla de oro:</strong> la unidad de $t$ es la misma que la de la tasa. Como la tasa es trimestral, $t=4$ son <strong>4 trimestres</strong>, o sea 1 año."},
  {key:"f3", tag:"Reto 3 de 6", title:"Ejemplo 1: arma el cociente",
   story:"Un estudio invierte <strong>S/ 25 000</strong> y obtiene <strong>S/ 30 387.66</strong>. Arma el cociente $\\dfrac{A}{P}$ que va dentro del logaritmo.",
   prompt:"Calcula $\\dfrac{A}{P}$ (4 decimales).", ans:30387.66 / 25000, dec:4, hint:"Divide $30387.66$ entre $25000$ con la calculadora.",
   explain:"$\\dfrac{30387.66}{25000}=$ <strong>1.2155</strong>. Es el factor por el que se multiplicó el capital (un 21.55 % más)."},
  {key:"f4", tag:"Reto 4 de 6", title:"Tasa por periodo (préstamo quincenal)",
   story:"Un préstamo cobra <strong>24.96 % anual capitalizable quincenalmente</strong> ($n=24$). La fórmula necesita la tasa <em>por quincena</em>, no la anual.",
   prompt:"Calcula la tasa por periodo $i=\\dfrac{r}{n}$ en decimal (4 decimales).", ans:0.2496 / 24, dec:4, hint:"Divide $0.2496$ entre $24$.",
   explain:"$i=\\dfrac{0.2496}{24}=$ <strong>0.0104</strong> por quincena. Es el valor que va en $\\ln(1+i)=\\ln(1.0104)$."},
  {key:"f5", tag:"Reto 5 de 6", title:"«El interés es el triple del capital»",
   story:"Un fondo de becas dice: «los intereses ganados serán el <strong>triple</strong> del capital». Entonces $I=3P$.",
   prompt:"¿Cuántas veces el capital es el monto final? Es decir, ¿cuánto vale $\\dfrac{A}{P}$?", ans:4, dec:0, hint:"El monto es capital más interés: $A=P+I=P+3P$.",
   explain:"$A=P+3P=4P$, así que $\\dfrac{A}{P}=$ <strong>4</strong> y se usa $\\ln 4$, <em>no</em> $\\ln 3$. Es el error más común del Ejemplo 3."},
  {key:"f6", tag:"Reto 6 de 6", title:"Detective: ¿qué olvidó Luis? (Psicología)",
   story:"La clínica quiere pasar de <strong>S/ 8 000 a S/ 12 000</strong> con <strong>6.35 % anual capitalizable trimestralmente</strong>. Luis calcula $\\dfrac{\\ln(1.5)}{\\ln(1.0635)}\\approx" + fmt(Math.log(1.5) / Math.log(1.0635), 2) + "$ y escribe «" + fmt(Math.log(1.5) / Math.log(1.0635), 2) + " trimestres».",
   q:"¿Cuál es el error?",
   opts:["No dividió la tasa anual entre $4$: debió usar $\\ln\\left(1+\\dfrac{0.0635}{4}\\right)$ y obtener $25.74$ trimestres","Debió usar la tasa en porcentaje, $6.35$","Debió multiplicar por el capital","No hay error"], correct:0,
   explain:"Con capitalización trimestral la tasa por periodo es $i=\\dfrac{0.0635}{4}=0.015875$. El resultado correcto es $\\dfrac{\\ln 1.5}{\\ln 1.015875}\\approx25.74$ <strong>trimestres</strong> ($\\approx6.44$ años)."}
];

function renderPhase2(app){
  phaseHeader(app, 2, "La fórmula: $t=\\dfrac{\\ln(A/P)}{\\ln(1+r)}$",
    "Una sola fórmula, pero con dos cuidados: usar la <strong>tasa por periodo</strong> y escribir bien la <strong>unidad</strong> del resultado. Arma la fórmula con tus propios datos.");

  var lab = el("div", "panel");
  lab.innerHTML = '<h3>🧩 Laboratorio: arma la fórmula paso a paso</h3><p>Elige un capital, una meta, una tasa anual y cómo capitaliza. Mira cómo se reemplazan los datos.</p>';
  app.appendChild(lab);
  var L = {p: 25000, a: 40000, r: 8, n: 4};
  var ctl = el("div", "slider-grid");
  ctl.innerHTML =
    '<div class="slider-row"><label for="p2_p">Capital <strong>P</strong> = <span class="slider-val" id="p2_pv">S/ 25 000</span></label><input type="range" id="p2_p" min="5000" max="100000" step="5000" value="25000"></div>' +
    '<div class="slider-row"><label for="p2_a">Meta <strong>A</strong> = <span class="slider-val" id="p2_av">S/ 40 000</span></label><input type="range" id="p2_a" min="6000" max="200000" step="1000" value="40000"></div>' +
    '<div class="slider-row"><label for="p2_r">Tasa anual <strong>r</strong> = <span class="slider-val" id="p2_rv">8</span> %</label><input type="range" id="p2_r" min="1" max="30" step="0.25" value="8"></div>' +
    '<div class="slider-row"><label for="p2_n">Capitaliza</label><select id="p2_n">' + CAPS.map(function(c){ return '<option value="' + c.n + '"' + (c.n === 4 ? " selected" : "") + '>' + c.name + ' (n=' + c.n + ')</option>'; }).join("") + '</select></div>';
  lab.appendChild(ctl);
  var steps = el("div", "lab-readout"); lab.appendChild(steps);
  function labRead(){
    if(L.a <= L.p){ steps.innerHTML = '<p class="progress-note">La meta debe ser <strong>mayor</strong> que el capital para que el dinero tenga que crecer. Sube la meta o baja el capital.</p>'; return; }
    var i = L.r / 100 / L.n, ratio = L.a / L.p, per = Math.log(ratio) / Math.log(1 + i), yy = per / L.n, pn = PERIODNAME[L.n];
    steps.innerHTML =
      '<div class="calc-steps">' +
      '<div><span class="cs-n">1</span> Tasa por periodo: ' + K("i=\\dfrac{r}{n}=\\dfrac{" + fmt(L.r / 100, 4) + "}{" + L.n + "}=" + fmt(i, 6)) + '</div>' +
      '<div><span class="cs-n">2</span> Cociente: ' + K("\\dfrac{A}{P}=\\dfrac{" + solTex(L.a, 0) + "}{" + solTex(L.p, 0) + "}=" + fmt(ratio, 4)) + '</div>' +
      '<div><span class="cs-n">3</span> Logaritmos: ' + K("\\ln(" + fmt(ratio, 4) + ")\\approx" + fmt(Math.log(ratio), 5) + "\\quad\\ln(1+i)\\approx" + fmt(Math.log(1 + i), 6)) + '</div>' +
      '<div><span class="cs-n">4</span> Periodos: ' + K("n\\,t=\\dfrac{" + fmt(Math.log(ratio), 5) + "}{" + fmt(Math.log(1 + i), 6) + "}\\approx" + fmt(per, 2)) + ' <strong>' + pn + '</strong></div>' +
      '<div><span class="cs-n">5</span> En años: ' + K("t=\\dfrac{" + fmt(per, 2) + "}{" + L.n + "}\\approx" + fmt(yy, 2)) + ' <strong>años</strong></div></div>' +
      '<p class="progress-note" style="margin-top:8px;">Fíjate: el resultado del paso 4 está en <strong>' + pn + '</strong>, no en años. Por eso el paso 5 existe.</p>';
  }
  ["p", "a", "r"].forEach(function(k){
    ctl.querySelector("#p2_" + k).addEventListener("input", function(ev){
      L[k] = parseFloat(ev.target.value);
      document.getElementById("p2_" + k + "v").textContent = k === "r" ? fmt(L.r, 2) : sol(L[k], 0);
      labRead();
    });
  });
  ctl.querySelector("#p2_n").addEventListener("change", function(ev){ L.n = parseInt(ev.target.value, 10); labRead(); });
  labRead();

  var gold = el("div", "panel");
  gold.innerHTML = '<h3>📏 Regla de oro: la unidad del resultado es la de la tasa</h3>';
  gold.appendChild(el("div", "th-table", rich('<style>.p2tb th,.p2tb td{padding:5px 6px!important;font-size:.8rem!important;}</style><table class="datatable p2tb"><tr><th>Dato de la tasa</th><th>Tasa por periodo $i$</th><th>Sale en…</th><th>Pasar a años</th></tr>' +
    '<tr><td>5 % trimestral</td><td>$0.05$</td><td>trimestres</td><td>dividir entre $4$</td></tr>' +
    '<tr><td>2 % mensual</td><td>$0.02$</td><td>meses</td><td>dividir entre $12$</td></tr>' +
    '<tr><td>4 % anual</td><td>$0.04$</td><td>años</td><td>ya está en años</td></tr>' +
    '<tr><td>24.96 % anual capitalizable quincenalmente</td><td>$\\dfrac{0.2496}{24}=0.0104$</td><td>quincenas</td><td>dividir entre $24$</td></tr></table>')));
  app.appendChild(gold);

  var wrap = el("div"); wrap.style.marginTop = "20px"; app.appendChild(wrap);
  runMissions(wrap, FORMULA, "formula", function(card, m, idx, solved){ missionBody(card, m, solved, "Respuesta"); },
    {title: "🏁 Fase 2 completa", text: "Ya armas $t=\\dfrac{\\ln(A/P)}{\\ln(1+i)}$ con la tasa por periodo correcta y sabes en qué unidad queda el resultado. Ahora toca <strong>calcular</strong> los cinco ejemplos del PPT."},
    "phase3", "Ir a Fase 3 →");
}

/* ============================================================
   FASE 3 — CALCULA EL TIEMPO (Ejemplos 1 al 5 del PPT)
============================================================ */
var CALCULA = [
  timeQ("k1", 1, 6, "Ejemplo 1: la tasa trimestral directa", "Un estudio jurídico invierte <strong>S/ 25 000</strong> y recibe <strong>S/ 30 387.66</strong> con una tasa de <strong>5 % trimestral</strong>. ¿Cuántos trimestres pasaron?",
    {P: 25000, A: 30387.66, i: 0.05, n: 4, unit: "trimestres", rTxt: "5 % trimestral", extra: "Eso equivale a <strong>1 año</strong> (4 trimestres)."}),
  timeQ("k2", 2, 6, "Ejemplo 2: capitalización anual", "Una clínica quiere pasar de <strong>S/ 30 000</strong> a <strong>S/ 40 000</strong> con una tasa de <strong>4 % anual</strong> (capitalización anual). ¿En cuántos años?",
    {P: 30000, A: 40000, i: 0.04, n: 1, unit: "años", rTxt: "4 % anual", tol: 0.012, label: "Tiempo (años, 2 decimales)"}),
  timeQ("k3", 3, 6, "Ejemplo 3: cuando el interés es el triple del capital", "Un fondo de becas promete que el <strong>interés será el triple del capital</strong> ($I=3P$) con una tasa de <strong>6 % anual</strong>. ¿Cuántos años necesita?",
    {k: 4, i: 0.06, n: 1, unit: "años", kTxt: "$A=4P$", rTxt: "6 % anual", tol: 0.012, label: "Tiempo (años, 2 decimales)",
     extra: "Recuerda: $I=3P\\Rightarrow A=P+3P=4P$, por eso se usa $\\ln 4$ y no $\\ln 3$."}),
  timeQ("k4", 4, 6, "Ejemplo 4: de tasa anual a mensual", "Se invierten <strong>S/ 25 000</strong> y se desea llegar a <strong>S/ 25 700</strong> con una tasa de <strong>2 % anual capitalizable mensualmente</strong>. ¿En cuántos <strong>meses</strong>?",
    {P: 25000, A: 25700, i: 0.02 / 12, nominal: 0.02, n: 12, unit: "meses", rTxt: "2 % anual cap. mensual", ansOverride: 16.565, tol: 0.04,
     extra: "El PPT de clase usa $\\log$ decimal y redondea $i\\approx0.00167$, y obtiene <strong>16.55</strong>; sin redondear $i$ sale <strong>16.58</strong> (≈ 1.38 años). Aquí aceptamos ambas.",
     hint: "$i=\\dfrac{0.02}{12}\\approx0.001667$. Calcula $\\ln(25700/25000)$ y $\\ln(1+i)$ y divide. Puedes usar $\\log$ o $\\ln$."}),
  timeQ("k5", 5, 6, "Ejemplo 5: liquidación de un préstamo quincenal", "Un préstamo de <strong>S/ 170 000</strong> se liquida con un pago único de <strong>S/ 246 722.68</strong>. La tasa es <strong>24.96 % anual capitalizable quincenalmente</strong>. ¿Cuántas <strong>quincenas</strong> duró?",
    {P: 170000, A: 246722.68, i: 0.2496 / 24, nominal: 0.2496, n: 24, unit: "quincenas", rTxt: "24.96 % anual cap. quincenal", extra: "En años: $36/24=1.5$ años."}),
  {key:"k6", tag:"Reto 6 de 6", title:"¿$\\ln$ o $\\log$? (Nota pedagógica del PPT)",
   story:"En el Ejemplo 4 el PPT de clase usa $\\log$ (decimal) en lugar de $\\ln$. Un compañero dice: «entonces mi resultado con $\\ln$ saldrá distinto».",
   q:"¿Qué le respondes?",
   opts:["Sale lo mismo: el cociente $\\dfrac{\\log(A/P)}{\\log(1+i)}$ no depende de la base, mientras uses la misma arriba y abajo","Sale distinto: $\\ln$ siempre da más","Con $\\log$ hay que multiplicar por $10$","Solo $\\ln$ está permitido"], correct:0,
   explain:"El cambio de base multiplica numerador y denominador por el mismo factor, y se cancela. Usa <strong>la misma tecla arriba y abajo</strong> y el resultado es idéntico."}
];

function renderPhase3(app){
  phaseHeader(app, 3, "Calcula el tiempo: los cinco ejemplos",
    "Aquí se entrena el hábito del buen profesional: ordenar datos, usar la tasa por periodo, calcular sin redondear antes de tiempo y <strong>escribir bien la unidad</strong>.");

  var lab = el("div", "panel");
  lab.innerHTML = '<h3>🌐 Laboratorio: ¿cambian los años si cambio la capitalización?</h3>' +
    rich('<p>Con la misma tasa anual y la misma meta, cambia el <strong>número de periodos</strong> pero los <strong>años</strong> casi no. Mueve los controles y compara.</p>');
  app.appendChild(lab);
  var L = {r: 6, k: 2};
  var ctl = el("div", "slider-grid");
  ctl.innerHTML =
    '<div class="slider-row"><label for="p3_r">Tasa anual <strong>r</strong> = <span class="slider-val" id="p3_rv">6</span> %</label><input type="range" id="p3_r" min="1" max="20" step="0.5" value="6"></div>' +
    '<div class="slider-row"><label for="p3_k">La meta es <strong>k</strong> = <span class="slider-val" id="p3_kv">2</span> veces el capital</label><input type="range" id="p3_k" min="1.2" max="4" step="0.1" value="2"></div>';
  lab.appendChild(ctl);
  var tb = el("div", "lab-readout"); lab.appendChild(tb);
  function labRead(){
    var rows = CAPS.map(function(c){
      var per = nper(L.k, L.r / 100, c.n);
      return '<tr><td style="text-align:left">' + c.name + ' <small>(n=' + c.n + ')</small></td><td>' + nsep(per, 2) + ' <small>' + PERIODNAME[c.n] + '</small></td><td><strong>' + fmt(per / c.n, 2) + '</strong></td></tr>';
    }).join("");
    tb.innerHTML = '<style>.p3tb th,.p3tb td{padding:5px 6px!important;font-size:.82rem!important;}</style><div style="overflow-x:auto"><table class="datatable p3tb"><tr><th>Capitaliz.</th><th>Periodos</th><th>Años</th></tr>' + rows + '</table></div>' +
      '<p class="progress-note" style="margin-top:8px;">Los periodos van desde ' + fmt(nper(L.k, L.r / 100, 1), 1) + ' hasta ' + nsep(nper(L.k, L.r / 100, 365), 0) + ': ¡mucha diferencia! Pero en <strong>años</strong> casi todo coincide. Por eso hay que anotar la unidad.</p>';
  }
  ["r", "k"].forEach(function(k){
    ctl.querySelector("#p3_" + k).addEventListener("input", function(ev){
      L[k] = parseFloat(ev.target.value);
      document.getElementById("p3_" + k + "v").textContent = fmt(L[k], 1);
      labRead();
    });
  });
  labRead();

  var tools = el("div", "panel");
  tools.innerHTML = '<h3>🧮 Receta en 5 pasos</h3>' +
    rich('<ol class="th-list"><li>Pasa la tasa a <strong>decimal por periodo</strong> ($i=r/n$ si es nominal).</li><li>Calcula el <strong>cociente</strong> $\\dfrac{A}{P}$ (o usa $k$).</li><li>Obtén $\\ln\\left(\\dfrac{A}{P}\\right)$ y $\\ln(1+i)$.</li><li><strong>Divide</strong> y anota la unidad.</li><li>Si piden años: periodos $\\div\\,n$.</li></ol>');
  renderCalcButton(tools);
  app.appendChild(tools);

  var wrap = el("div"); wrap.style.marginTop = "20px"; app.appendChild(wrap);
  runMissions(wrap, CALCULA, "calcula", function(card, m, idx, solved){
    if(m.opts){ missionBody(card, m, solved); return; }
    timeMissionBuilder(card, m, solved);
  }, {title: "🏁 Fase 3 completa", text: "Calculas el tiempo con tasa trimestral, anual, mensual y quincenal, y no tropiezas con el «interés triple». Ahora viene un caso muy usado: <strong>duplicar y triplicar</strong> una inversión sin conocer el capital."},
  "phase4", "Ir a Fase 4 →");
}
