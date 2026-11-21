var REFLECT_PROMPTS = {
  despeja: "¿Por qué una simple multiplicación o división no sirve para despejar el tiempo cuando está en el exponente? Explícalo con tus palabras y un ejemplo de tu carrera.",
  formula: "Al armar $t=\\dfrac{\\ln(A/P)}{\\ln(1+i)}$, ¿qué error es el más fácil de cometer (la tasa por periodo, la unidad, el «interés triple»…)? ¿Cómo lo evitarás?",
  calcula: "Al calcular los cinco ejemplos, ¿qué paso te costó más (el cociente, las teclas $\\ln$, convertir a años)? ¿Qué hiciste para resolverlo?",
  duplica: "¿Por qué el tiempo es el factor más poderoso en el interés compuesto? ¿Por qué los primeros años el dinero crece lento y al final se dispara?",
  meta: "Según lo que analizaste en la línea de vida, ¿a qué edad deberías empezar a invertir? Justifícalo con tus números.",
  dictamen: "En una o dos frases, redacta tu dictamen final: ¿qué oferta recomiendas, cuánto tiempo ahorra y qué advertirías? Cierra con una pregunta para la Semana 15 (crecimiento poblacional)."
};
var GLOSSARY = [
  {t: "Capital ($P$ o $C$)", d: "El dinero con el que empiezas: lo que depositas o debes al inicio.", ph: [1, 2, 3, 4]},
  {t: "Monto ($A$ o $M$)", d: "Todo lo que hay al final: capital más intereses. Siempre $A>P$ cuando el dinero crece.", ph: [1, 2, 3, 5]},
  {t: "Tasa por periodo ($i$)", d: "La tasa que realmente se aplica en cada capitalización. Si la tasa anual es nominal: $i=\\dfrac{r}{n}$.", ph: [2, 3, 4, 5, 6]},
  {t: "Frecuencia de capitalización ($n$)", d: "Cuántas veces al año se suman los intereses: anual $1$, semestral $2$, trimestral $4$, bimestral $6$, mensual $12$, quincenal $24$, diaria $365$.", ph: [2, 3, 4]},
  {t: "Logaritmo natural ($\\ln$)", d: "La operación inversa de $e^{x}$. En esta sesión sirve para «bajar» el exponente $t$. Tu calculadora tiene la tecla <span class=\"mono\">ln</span>.", ph: [1, 2, 3]},
  {t: "Propiedad del exponente", d: "$\\ln\\left(a^{x}\\right)=x\\cdot\\ln(a)$: permite pasar el exponente a multiplicar y despejarlo.", ph: [1, 2]},
  {t: "Cociente $A/P$", d: "Cuántas veces el capital es el monto final. Si «se duplica», $A/P=2$; si «se triplica», $3$; si el interés es el triple, $4$.", ph: [2, 3, 4]},
  {t: "Regla de oro de las unidades", d: "La unidad de $t$ es la misma que la de la tasa: tasa trimestral $\\Rightarrow$ trimestres; mensual $\\Rightarrow$ meses.", ph: [2, 3, 5]},
  {t: "Periodos y años", d: "Para pasar de periodos a años divide entre $n$: $t_{\\text{años}}=\\dfrac{\\text{periodos}}{n}$.", ph: [2, 3, 4, 5]},
  {t: "Factor $k$", d: "El número de veces que se multiplica el capital ($k=2$ duplicar, $k=3$ triplicar). El capital en soles se cancela.", ph: [4]},
  {t: "Interés triple del capital", d: "Significa $I=3P$, así que el monto es $A=P+3P=4P$ y se usa $\\ln 4$.", ph: [2, 3, 4]},
  {t: "Tiempo real", d: "El mínimo tiempo que permite una tasa para llegar a una meta. Una promesa más corta que ese tiempo es imposible.", ph: [6]},
  {t: "Promesa exagerada", d: "Una oferta que asegura llegar a la meta en menos tiempo del que permite su tasa.", ph: [6]},
  {t: "Redondeo", d: "Calcula con todos los decimales y redondea solo al final. Redondear $\\ln$ o $i$ antes cambia el resultado.", ph: [3, 4, 5]},
  {t: "Dictamen", d: "Tu conclusión razonada: qué opción conviene, con qué cifras, por qué y qué advertencias harías.", ph: [6]}
];
