var THEORY = {
  1: {title: "📘 Teoría: ¿cómo se «baja» un exponente?",
    html:
      '<p>En la <strong>Semana 11</strong> conocías el tiempo $t$ y calculabas el monto: $A=P(1+r)^{t}$. Hoy la pregunta es la contraria: <strong>¿cuánto tiempo tarda?</strong> El problema es que $t$ quedó atrapado en el exponente.</p>' +
      '<div class="reveal-box">🔑 En la <strong>Semana 13</strong> aprendiste la herramienta justa: el logaritmo es la operación inversa de la exponenciación. La propiedad clave es $\\ln\\left(a^{x}\\right)=x\\cdot\\ln(a)$: <strong>baja el exponente</strong> para que puedas despejarlo.</div>' +
      '<ol class="th-list"><li><strong>Aísla la potencia:</strong> divide entre $P$ para tener $(1+r)^{t}=\\dfrac{A}{P}$.</li><li><strong>Aplica $\\ln$</strong> a ambos lados: $\\ln\\left[(1+r)^{t}\\right]=\\ln\\left(\\dfrac{A}{P}\\right)$.</li><li><strong>Baja el exponente:</strong> $t\\cdot\\ln(1+r)=\\ln\\left(\\dfrac{A}{P}\\right)$.</li><li><strong>Despeja:</strong> $t=\\dfrac{\\ln(A/P)}{\\ln(1+r)}$.</li></ol>' +
      '<p>¿Por qué no basta una división o una resta? Porque $t$ no está «pegado» al número: está <em>arriba</em>, como exponente. Solo el logaritmo puede bajarlo.</p>' +
      '<div class="reveal-box">💡 <strong>Mensaje clave:</strong> en el interés compuesto el dinero crece <strong>lento al inicio y acelerado al final</strong>. Por eso el tiempo es tan poderoso.</div>'},
  2: {title: "📘 Teoría: la fórmula del tiempo",
    html:
      '<p>Se parte del monto compuesto y se despeja $t$ con logaritmos:</p>' +
      '<div class="tex-block">$$t=\\frac{\\ln\\left(\\dfrac{A}{P}\\right)}{\\ln(1+r)}\\qquad\\text{o con }n\\text{ capitalizaciones al año:}\\qquad n\\cdot t=\\frac{\\ln\\left(\\dfrac{M}{C}\\right)}{\\ln\\left(1+\\dfrac{r}{n}\\right)}$$</div>' +
      '<div class="th-table"><table class="datatable"><tr><th>Símbolo</th><th>Significado</th><th>Observación clave</th></tr>' +
      '<tr><td>$A$ o $M$</td><td style="text-align:left">Monto final</td><td style="text-align:left">Debe cumplirse $A>P$ en crecimiento</td></tr>' +
      '<tr><td>$P$ o $C$</td><td style="text-align:left">Capital inicial</td><td style="text-align:left">«Se duplica» $\\Rightarrow A=2P$; «se triplica» $\\Rightarrow A=3P$</td></tr>' +
      '<tr><td>$r$</td><td style="text-align:left">Tasa <strong>por periodo</strong>, en decimal</td><td style="text-align:left"><strong>Regla de oro:</strong> la unidad de $t$ es la unidad de la tasa</td></tr>' +
      '<tr><td>$n$</td><td style="text-align:left">Capitalizaciones por año</td><td style="text-align:left">Anual 1 · semestral 2 · trimestral 4 · bimestral 6 · mensual 12 · quincenal 24 · diaria 365</td></tr></table></div>' +
      '<ul class="th-list"><li>Si la tasa es <strong>5 % trimestral</strong>, el resultado sale en <strong>trimestres</strong>.</li><li>Si te dan una tasa anual con $n$ capitalizaciones, el resultado sale en <strong>periodos</strong> y luego pasas a años: $t_{\\text{años}}=\\dfrac{\\text{periodos}}{n}$.</li></ul>'},
  3: {title: "📘 Método: calcula el tiempo sin errores",
    html:
      '<ol class="th-list"><li><strong>Ordena los datos:</strong> $P$, $A$ (o el factor $k$) y la tasa por periodo.</li><li><strong>Tasa por periodo:</strong> $r$ en decimal; si es nominal anual, divide entre $n$.</li><li><strong>Cociente:</strong> $\\dfrac{A}{P}$ (con todos los decimales).</li><li><strong>Calcula</strong> $\\ln\\left(\\dfrac{A}{P}\\right)$ y $\\ln(1+r)$ y <strong>divide</strong>.</li><li><strong>Unidad:</strong> el resultado está en los periodos de la tasa; si piden años, divide entre $n$.</li><li><strong>Revisa:</strong> numerador y denominador positivos si $A>P$.</li></ol>' +
      '<div class="th-table"><table class="datatable"><tr><th>Error frecuente</th><th>Cómo evitarlo</th></tr>' +
      '<tr><td style="text-align:left">Escribir «25.74 años» cuando son 25.74 <strong>trimestres</strong></td><td style="text-align:left">Anota siempre la unidad y conviértela al final</td></tr>' +
      '<tr><td style="text-align:left">Usar $0.0635$ en el denominador cuando capitaliza trimestralmente</td><td style="text-align:left">Divide la tasa anual entre $n$: $0.0635/4$</td></tr>' +
      '<tr><td style="text-align:left">«Interés triple» y usar $\\ln 3$</td><td style="text-align:left">Si $I=3P$ entonces $A=4P$: usa $\\ln 4$</td></tr>' +
      '<tr><td style="text-align:left">Escribir $\\ln(M/C)=\\dfrac{\\ln M}{\\ln C}$</td><td style="text-align:left">Es $\\ln M-\\ln C$, o calcula el cociente primero</td></tr></table></div>'},
  4: {title: "📘 Método: duplicar y triplicar",
    html:
      '<p>Cuando el enunciado dice «se duplica» o «se triplica», <strong>no necesitas el capital en soles</strong>: $A=kP$ y al dividir queda $\\dfrac{kP}{P}=k$.</p>' +
      '<div class="tex-block">$$n\\cdot t=\\frac{\\ln(k)}{\\ln\\left(1+\\dfrac{r}{n}\\right)}\\qquad k=2\\ (\\text{duplicar}),\\ k=3\\ (\\text{triplicar}),\\ k=4\\ (\\text{interés triple})$$</div>' +
      '<div class="reveal-box">💬 No importa si inviertes S/ 100 o S/ 1 000 000: <strong>el tiempo depende solo de la tasa y de la frecuencia</strong>. El capital se cancela.</div>' +
      '<div class="th-table"><table class="datatable"><tr><th>Caso</th><th>Capital</th><th>Tasa anual</th><th>Capitaliza</th><th>Duplicar</th><th>Triplicar</th></tr>' +
      '<tr><td>1</td><td>40 000</td><td>3.25 %</td><td>anual</td><td>21.67 años</td><td>34.35 años</td></tr>' +
      '<tr><td>2</td><td>80 000</td><td>4.08 %</td><td>semestral</td><td>34.32 sem.</td><td>54.40 sem.</td></tr>' +
      '<tr><td>3</td><td>120 000</td><td>5.02 %</td><td>trimestral</td><td>55.58 trim.</td><td>88.09 trim.</td></tr>' +
      '<tr><td>4</td><td>150 000</td><td>3.02 %</td><td>bimestral</td><td>138.06 bim.</td><td>218.82 bim.</td></tr>' +
      '<tr><td>5</td><td>90 000</td><td>4.02 %</td><td>mensual</td><td>207.26 meses</td><td>328.49 meses</td></tr>' +
      '<tr><td>6</td><td>50 000</td><td>2.08 %</td><td>diaria</td><td>12 163.75 días</td><td>19 279.08 días</td></tr></table></div>' +
      '<p class="progress-note">Estos son los Casos 1 al 6 de tu guía (montos en soles). Las unidades cambian, pero el patrón es el mismo: $\\ln(k)$ entre $\\ln(1+r/n)$.</p>'},
  5: {title: "📘 Método: ¿cuánto falta para mi meta?",
    html:
      '<p>Aquí sí conoces los montos: tienes $P$ hoy y quieres llegar a $A$. Es el caso general de la fórmula del tiempo.</p>' +
      '<ol class="th-list"><li><strong>Identifica</strong> capital, meta, tasa y cómo capitaliza.</li><li><strong>Tasa por periodo:</strong> $i=r/n$.</li><li><strong>Periodos:</strong> $\\dfrac{\\ln(A/P)}{\\ln(1+i)}$.</li><li><strong>Años:</strong> periodos entre $n$.</li><li><strong>Interpreta:</strong> ¿es un plazo realista para tu meta?</li></ol>' +
      '<div class="reveal-box">🧠 <strong>Pregunta para pensar:</strong> si el dinero crece lento al inicio y rápido al final, ¿a qué edad conviene empezar a ahorrar? En el laboratorio de esta fase tienes una <strong>línea de vida</strong> para comprobarlo.</div>'},
  6: {title: "📘 Método: tu dictamen en 5 pasos",
    html:
      '<ol class="th-list"><li><strong>Lee</strong> las ofertas y la meta.</li><li><strong>Calcula</strong> el tiempo de cada una con la tasa por periodo correcta.</li><li><strong>Convierte</strong> todo a la misma unidad (años) para poder comparar.</li><li><strong>Decide:</strong> gana la oferta que llega antes (o la promesa se revela exagerada).</li><li><strong>Redacta</strong> recomendación + cifras + motivo.</li></ol>' +
      '<div class="reveal-box">🚩 <strong>Detector de promesas imposibles:</strong> si una oferta dice «duplica tu dinero en 2 años» con 6 % anual, calcula el tiempo real: $\\dfrac{\\ln 2}{\\ln 1.06}\\approx11.9$ años. Cuando lo prometido es mucho menor, es exagerado.</div>' +
      '<p><strong>Próximo paso (Semana 15):</strong> el mismo despeje, ahora con personas en lugar de soles: crecimiento poblacional y Prueba de Desarrollo 4.</p>'}
};

/* ---- La serie, Temporada 3: Valeria y Camila, un capítulo por fase ---- */
var SERIES = {
  d: {title: "T3 · Valeria y el reloj del dinero", chars: "Valeria Rojas, abogada · Don Aurelio, su cliente · Mateo, su asistente",
    ch: [
      ["La pregunta al revés", "Don Aurelio entra al estudio con una duda: «Valeria, ya sé cuánto tendré en 5 años. Pero ¿cuántos años necesito para llegar a 50 000?». Mateo busca la fórmula… y descubre que el tiempo está atrapado en un exponente. «Hoy usamos logaritmos», sonríe Valeria.", "Pista: ¿qué operación baja un exponente?"],
      ["La unidad manda", "Mateo calcula 25.74 y escribe «años». Valeria arquea una ceja: «¿Años o trimestres?». El error cuesta una tarde de correcciones y una lección que nunca olvidará: la unidad del resultado es la de la tasa.", "Pista: la tasa por periodo decide la unidad."],
      ["Calculadora en mano", "Con el cociente, dos logaritmos y una división, Mateo resuelve cinco casos seguidos. Valeria le recuerda dos trampas: la tasa anual se divide entre $n$ y el redondeo va solo al final.", "Pista: $\\ln(M/C)$ no es $\\ln M/\\ln C$."],
      ["Duplicar, triplicar", "Un cliente pregunta: «¿Cuánto tarda en duplicarse mi dinero?». Valeria le dice que no necesita saber cuánto invierte. «¿Por qué?», pregunta él. «Porque el capital se cancela».", "Pista: $\\dfrac{2P}{P}=2$."],
      ["La meta de Don Aurelio", "Don Aurelio quiere comprar un terreno pequeño. Valeria calcula años, convierte trimestres a años y le muestra en la línea de vida qué pasa si empieza hoy o dentro de diez años.", "Pista: el tiempo trabaja a tu favor."],
      ["El dictamen del fondo", "La Defensoría quiere saber cuál de tres ofertas alcanza antes la meta del programa. Valeria entrega el caso a su equipo: «Hoy firmas tú». Y el equipo eres tú.", "¡Último capítulo!"]
    ]},
  p: {title: "T3 · La Clínica y el reloj del dinero", chars: "Dra. Camila Torres, directora · Luis, practicante",
    ch: [
      ["¿Cuánto tiempo falta?", "Luis llega con una planilla: «Sé cuánto tendrá el fondo en 4 años, pero la dirección pregunta cuándo llegará a 60 000». Camila sonríe: «Es la misma pregunta de un paciente: ¿cuánto falta para mejorar? Primero hay que despejar el tiempo».", "Pista: el logaritmo baja el exponente."],
      ["Ponerle unidad al resultado", "Luis obtiene 36 y escribe «años». Camila le recuerda que la tasa era quincenal. «Una terapia de 36 sesiones semanales no son 36 años», bromea. Luis corrige: 36 quincenas son 1.5 años.", "Pista: periodos entre $n$ da años."],
      ["Cifras para la dirección", "Es lunes y la dirección pide plazos exactos. Luis arma el cociente, usa $\\ln$ dos veces y divide. Camila lo observa: «Calcula primero, redondea después».", "Pista: sin redondear antes de tiempo."],
      ["Duplicar el fondo de becas", "La clínica quiere duplicar su fondo de becas. «¿Cuánto debemos invertir?», pregunta Luis. «No importa: el tiempo para duplicar no depende de la cantidad», responde Camila.", "Pista: el capital se cancela."],
      ["La meta de la beca", "Una estudiante de psicología necesita reunir su beca. Camila le muestra la línea de vida: empezar a ahorrar a los 20 o a los 30 cambia la edad a la que llega a su meta y cuánto dinero tendrá a los 60. «El tiempo es el aliado más grande», dice.", "Pista: lento al inicio, rápido al final."],
      ["El dictamen del fondo familiar", "La Defensoría invita de nuevo a la clínica a asesorar sobre tres ofertas de ahorro. Camila se lo cede a Luis: «Tú firmas». Y tú lo acompañas con tus cálculos.", "¡Último capítulo!"]
    ]}
};
