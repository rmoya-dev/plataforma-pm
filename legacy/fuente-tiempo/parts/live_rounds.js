var FLASH_ROUNDS = [
  {id:1, short:"Despeja", title:"Fase 1 · Despeja el exponente", qs:[
    {q:"Para despejar $t$ de $(1.05)^{t}=1.5$ necesitas…", o:["Aplicar logaritmo a ambos lados","Dividir $1.5$ entre $1.05$","Restar $1.05$ a $1.5$"], c:0, why:"El tiempo está en el exponente: solo el logaritmo lo «baja»."},
    {q:"$\\ln\\left(a^{x}\\right)$ es igual a…", o:["$x\\cdot\\ln(a)$","$\\ln(a)^{x}$","$x+\\ln(a)$"], c:0, why:"La propiedad del exponente: pasa a multiplicar."},
    {q:"Aproximadamente, $\\ln(2)$ vale…", o:["$0.6931$","$2.0000$","$1.3863$"], c:0, why:"$\\ln 2\\approx0.6931$. El valor $1.3863$ es $\\ln 4$."},
    {q:"$\\ln\\left(\\dfrac{M}{C}\\right)$ es igual a…", o:["$\\ln(M)-\\ln(C)$","$\\dfrac{\\ln(M)}{\\ln(C)}$","$\\ln(M)+\\ln(C)$"], c:0, why:"El logaritmo de un cociente es una resta de logaritmos."},
    {q:"Para duplicar con $(1.04)^{t}=2$, el tiempo es…", o:["$t=\\dfrac{\\ln 2}{\\ln 1.04}\\approx" + fmt(Math.log(2) / Math.log(1.04), 2) + "$ años","$t=\\dfrac{2}{1.04}\\approx1.92$","$t=2-1.04=0.96$"], c:0, why:"$t=\\dfrac{\\ln 2}{\\ln 1.04}=\\dfrac{0.6931}{0.0392}\\approx17.67$ años."}
  ]},
  {id:2, short:"Fórmula", title:"Fase 2 · La fórmula del tiempo", qs:[
    {q:"La fórmula del tiempo es…", o:["$t=\\dfrac{\\ln(A/P)}{\\ln(1+r)}$","$t=\\dfrac{A/P}{1+r}$","$t=\\ln(A/P)\\cdot\\ln(1+r)$"], c:0, why:"Cociente de dos logaritmos: el de la razón $A/P$ entre el de $1+r$."},
    {q:"Con una tasa de $5\\,\\%$ <em>trimestral</em>, el resultado de $t$ queda en…", o:["Trimestres","Años","Meses"], c:0, why:"Regla de oro: la unidad de $t$ es la de la tasa."},
    {q:"Una tasa de $24\\,\\%$ anual capitalizable mensualmente da una tasa por periodo de…", o:["$0.02$","$0.24$","$0.20$"], c:0, why:"$i=\\dfrac{0.24}{12}=0.02$ por mes."},
    {q:"Si el interés ganado es el <strong>triple</strong> del capital, el monto final es…", o:["$4P$","$3P$","$2P$"], c:0, why:"$A=P+I=P+3P=4P$: se usa $\\ln 4$."},
    {q:"Si el dinero «se duplica», el cociente $\\dfrac{A}{P}$ vale…", o:["$2$","$1$","$P$"], c:0, why:"$A=2P$, así que $\\dfrac{A}{P}=2$."}
  ]},
  {id:3, short:"Calcula", title:"Fase 3 · Calcula el tiempo", qs:[
    {q:"S/ 1 000 pasan a S/ 1 500 con $5\\,\\%$ anual (capitalización anual). ¿Cuántos años?", o:[fmt(Math.log(1.5) / Math.log(1.05), 2) + " años", "7.50 años", "30.00 años"], c:0, why:"$\\dfrac{\\ln 1.5}{\\ln 1.05}\\approx8.31$ años."},
    {q:"S/ 1 000 pasan a S/ 1 200 con $2\\,\\%$ <em>mensual</em>. ¿Cuántos meses?", o:[fmt(Math.log(1.2) / Math.log(1.02), 2) + " meses", "10.00 meses", "20.00 meses"], c:0, why:"$\\dfrac{\\ln 1.2}{\\ln 1.02}\\approx9.21$ meses."},
    {q:"Un resultado de $18$ trimestres equivale a…", o:["$4.5$ años","$18$ años","$72$ años"], c:0, why:"$18\\div4=4.5$ años."},
    {q:"S/ 25 000 pasan a S/ 30 387.66 con $5\\,\\%$ trimestral. ¿Cuántos trimestres?", o:["$4$","$5$","$1.2155$"], c:0, why:"$\\dfrac{\\ln 1.2155}{\\ln 1.05}=4$ trimestres (1 año)."},
    {q:"En $\\dfrac{\\ln(A/P)}{\\ln(1+i)}$, usar $\\ln$ o $\\log$ (la misma tecla arriba y abajo) da…", o:["El mismo resultado","Resultados distintos","Solo sirve $\\ln$"], c:0, why:"El cambio de base se cancela en el cociente."}
  ]},
  {id:4, short:"Duplica", title:"Fase 4 · Duplica y triplica", qs:[
    {q:"Para <strong>duplicar</strong> el capital, el cociente $\\dfrac{A}{P}$ es…", o:["$2$","$1$","$2P$"], c:0, why:"$\\dfrac{2P}{P}=2$: el capital se cancela."},
    {q:"Misma tasa y capitalización: invertir S/ 100 o S/ 100 000 para duplicar tarda…", o:["Lo mismo: el capital se cancela","Menos con S/ 100 000","Menos con S/ 100"], c:0, why:"El tiempo depende solo de la tasa y de la frecuencia."},
    {q:"Duplicar con $3.25\\,\\%$ anual (capitalización anual) tarda unos…", o:[fmt(yrs(2, 0.0325, 1), 2) + " años", "30.77 años", "34.35 años"], c:0, why:"$\\dfrac{\\ln 2}{\\ln 1.0325}\\approx21.67$ años. Los $34.35$ años son para triplicar."},
    {q:"Triplicar tarda… que duplicar (misma tasa).", o:["Más, pero no el triple","Menos","Lo mismo"], c:0, why:"$\\ln 3\\approx1.10$ y $\\ln 2\\approx0.69$: aproximadamente $1.58$ veces."},
    {q:"$34.32$ semestres equivalen a…", o:["$17.16$ años","$34.32$ años","$68.64$ años"], c:0, why:"Semestres $\\div2$ = años."}
  ]},
  {id:5, short:"Meta", title:"Fase 5 · Alcanza tu meta", qs:[
    {q:"S/ 8 000 → S/ 12 000 con $6.35\\,\\%$ anual capitalizable trimestralmente. ¿Cuántos trimestres?", o:["$25.74$","$6.44$","$37.50$"], c:0, why:"$\\dfrac{\\ln 1.5}{\\ln 1.015875}\\approx25.74$ trimestres."},
    {q:"$25.74$ trimestres son aproximadamente…", o:["$6.44$ años","$25.74$ años","$103$ años"], c:0, why:"$25.74\\div4=6.44$ años."},
    {q:"Con $8.025\\,\\%$ anual capitalizable semestralmente, la tasa por periodo es…", o:["$0.040125$","$0.08025$","$0.0201$"], c:0, why:"$i=\\dfrac{0.08025}{2}=0.040125$ por semestre."},
    {q:"Misma tasa y mismo capital, pero una meta más lejana: el tiempo…", o:["Aumenta","Disminuye","No cambia"], c:0, why:"Hay que crecer más, así que se necesita más tiempo."},
    {q:"A los $60$ años tendrás más dinero si empiezas a invertir…", o:["Más joven: el tiempo trabaja a tu favor","Más tarde, para arriesgar menos","Da igual cuándo empieces"], c:0, why:"El dinero crece lento al inicio y rápido al final: cada año extra al comienzo vale mucho."}
  ]},
  {id:6, short:"Dictamen", title:"Fase 6 · Dictamen: el informe final", qs:[
    {q:"Un volante promete duplicar en $2$ años con $6\\,\\%$ anual (capitalización anual). Es…", o:["Exagerada: el tiempo real es unos " + fmt(yrs(2, 0.06, 1), 1) + " años","Posible: es una financiera","Posible: $6\\,\\%$ es una tasa alta"], c:0, why:"$\\dfrac{\\ln 2}{\\ln 1.06}\\approx11.9$ años. Prometer menos tiempo del que permite la tasa es exagerado."},
    {q:"Para duplicar: A) $6\\,\\%$ anual (capitaliza una vez al año) o B) $5.9\\,\\%$ capitalizable mensualmente. ¿Quién llega primero?", o:["B, con unos " + fmt(yrs(2, 0.059, 12), 2) + " años","A, con unos " + fmt(yrs(2, 0.06, 1), 2) + " años","Empatan"], c:0, why:"B tarda " + fmt(yrs(2, 0.059, 12), 2) + " años y A " + fmt(yrs(2, 0.06, 1), 2) + ": la capitalización mensual compensa su tasa algo menor."},
    {q:"Para comparar ofertas con capitalizaciones distintas conviene…", o:["Calcular el tiempo real (o el monto final) de cada una","Mirar solo el porcentaje del cartel","Elegir la que capitaliza más veces"], c:0, why:"Hay que ponerlas en la misma vara: años hasta la meta."},
    {q:"Un dictamen responsable debe…", o:["Mostrar el cálculo, comparar alternativas y justificar la recomendación","Dar solo el resultado final","Esconder los supuestos"], c:0, why:"Quien lee tu dictamen debe poder verificarlo: cálculo + comparación + razón."},
    {q:"La Semana 15 trabajará…", o:["Crecimiento poblacional (el mismo despeje, con personas en lugar de soles)","Interés simple","Funciones cuadráticas"], c:0, why:"Mismo despeje logarítmico aplicado a demografía, biología y la Prueba de Desarrollo 4."}
  ]}
];
