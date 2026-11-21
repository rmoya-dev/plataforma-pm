var QDAY = [
  {q:"¿Cuánto tiempo crees que tarda tu dinero en duplicarse si lo dejas en el banco al $6\\,\\%$ anual (capitalización anual)?", o:{a:"Unos 6 años", b:"Unos 12 años", c:"Unos 20 años"},
   r:"Son unos " + fmt(yrs(2, 0.06, 1), 2) + " años: $\\dfrac{\\ln 2}{\\ln 1.06}$. Y recuerda: ¡da lo mismo si inviertes S/ 100 o S/ 1 000 000!"},
  {q:"S/ 1 000 al $6\\,\\%$ anual. ¿El dinero crece rápido o lento al principio?", o:{a:"Rápido al principio", b:"Lento al principio y rápido al final", c:"Igual todos los años"},
   r:"El primer año gana " + sol(60, 2) + "; el año 10, " + sol(1000 * Math.pow(1.06, 9) * 0.06, 2) + "; el año 30, " + sol(1000 * Math.pow(1.06, 29) * 0.06, 2) + ". Crece lento al inicio y acelerado al final."},
  {q:"¿Qué termina con más al cabo de 30 años: S/ 5 000 hoy, o S/ 8 000 que invertirás dentro de 10 años (20 años de plazo)? Supón $6\\,\\%$ anual.", o:{a:"Los S/ 5 000 de hoy", b:"Los S/ 8 000 de dentro de 10 años", c:"Terminan igual"},
   r:"S/ 5 000 durante 30 años llegan a " + sol(5000 * Math.pow(1.06, 30), 2) + "; S/ 8 000 durante 20 años, a " + sol(8000 * Math.pow(1.06, 20), 2) + ". Empezar antes, aunque sea con menos, gana."},
  {q:"Tienes S/ 10 000 y quieres comprar algo de S/ 15 000. Con $5\\,\\%$ anual, ¿cuántos años esperas?", o:{a:"Unos 3 años", b:"Unos 8 años", c:"Unos 15 años"},
   r:"$\\dfrac{\\ln 1.5}{\\ln 1.05}\\approx" + fmt(Math.log(1.5) / Math.log(1.05), 2) + "$ años: unos 8 años y 4 meses."},
  {q:"Alguien te promete duplicar tu dinero en <strong>1 año</strong> con una «capitalización especial» al $5\\,\\%$ anual. ¿Le crees?", o:{a:"No: suena exagerado", b:"Sí: dice «especial»", c:"Calculo el tiempo real"},
   r:"Con $5\\,\\%$ anual capitalizado diariamente tardaría " + fmt(yrs(2, 0.05, 365), 2) + " años; para duplicar en 1 año haría falta cerca de $100\\,\\%$ anual. El detector de promesas imposibles sirve en la vida real."},
  {q:"Una deuda crece al $2\\,\\%$ mensual y no se paga. ¿En cuánto tiempo se duplica?", o:{a:"Unos 12 meses", b:"Unos 35 meses", c:"Unos 50 meses"},
   r:"$\\dfrac{\\ln 2}{\\ln 1.02}\\approx" + fmt(nper(2, 0.02, 1), 2) + "$ meses: casi tres años. Entender este cálculo ayuda a opinar con argumentos sobre usura y tasas máximas."},
  {q:"Mejoras $1\\,\\%$ cada semana en tu rendimiento de estudio (como analogía). ¿Cuándo lo duplicas?", o:{a:"En unas 20 semanas", b:"En unas 70 semanas", c:"Nunca"},
   r:"$\\dfrac{\\ln 2}{\\ln 1.01}\\approx" + fmt(nper(2, 0.01, 1), 2) + "$ semanas, más de un año. Es solo una analogía: las personas no crecen siempre al mismo ritmo, y está bien."},
  {q:"¿A qué edad empezarías a ahorrar S/ 3 000 (una sola vez) al $6\\,\\%$ anual, pensando en tener dinero a los 65 años?", o:{a:"A los 20", b:"A los 30", c:"Cuando gane más"},
   r:"A los 65 tendrías " + sol(3000 * Math.pow(1.06, 45), 0) + " si empiezas a los 20; " + sol(3000 * Math.pow(1.06, 35), 0) + " a los 30 y " + sol(3000 * Math.pow(1.06, 25), 0) + " a los 40. El tiempo es el ingrediente más caro del interés."}
];
