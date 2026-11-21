# Guía rápida — Interés Compuesto (Semana 11): sala por fase, duelo de bancos, ritmo, seguimiento y reflexiones

## 1. Actualizar el respaldo (una sola vez; obligatorio)
1. En tu proyecto de Apps Script (el mismo de siempre) **reemplaza todo `Code.gs`** por el archivo nuevo.
2. **Cambia el PIN docente**: busca `var TEACHER_PIN = "PIN-DE-EJEMPLO";` y pon uno tuyo.
3. Guarda y luego **Implementar → Administrar implementaciones → ✏️ Editar → Versión: "Nueva versión" → Implementar.** La URL no cambia, así que no tocas los HTML. Esta versión es nueva (duelo de bancos, avatar, racha, insignias): si no creas la nueva versión, esas funciones no aparecerán.
4. La pestaña **"Progreso - Interés compuesto"** se crea sola cuando el primer estudiante guarda avance. Las pestañas de actividades anteriores no se tocan.

## 2. Publicar en Google Sites
Usa `interes-compuesto-sites.html`: **Insertar → Insertar código → pestaña "Incorporar" → pega el contenido completo** (no el enlace). Ajusta el cuadro al ancho y alto máximos. También hay un enlace de Claude (Artifact) con la versión autónoma. Los gráficos y las fórmulas se cargan desde internet (KaTeX, JSXGraph y confeti); si la red del aula los bloquea, la actividad sigue funcionando pero sin fórmulas bonitas, gráficas ni confeti.

## 3. Las 7 fases (38 retos, 555 XP + hasta 350 XP de relámpagos)
1. **Descubre** (6): interés simple vs. compuesto, dos curvas, laboratorio.
2. **Fórmula** (6): $M=C\left(1+\frac{r}{n}\right)^{n\,t}$ armada paso a paso (tasa en decimal, $n$, exponente $n\,t$) y detective de errores.
3. **Capitaliza** (6): anual, semestral, cuatrimestral, trimestral, bimestral, mensual y diaria; barras comparativas y rendimientos decrecientes.
4. **Calcula** (6): montos e intereses con la calculadora (Tammy, estudio jurídico, Manuel, Marcos…).
5. **Decide** (5 casos): comparar ofertas de bancos y justificar la recomendación (Derecho y Psicología).
6. **Proyecta** (5): valor presente, hallar la tasa y diseñar una meta de ahorro.
7. **Dictamen** (4): informe final; el jefe final (Fondo de la Defensoría) genera una **tarjeta de dictamen** con nombre, carrera y fecha que pueden copiar o imprimir.
Todo en soles (S/) y con casos de Derecho y Psicología. Al final del Dictamen hay un puente muy breve hacia la Semana 12 (sin mostrar $e$ ni logaritmos).

## 4. Elementos juveniles (todo es opcional y el estudiante los controla)
- **🥊 Duelo de bancos con voto de la clase** (lo controlas tú, ver sección 6).
- **Avatar** (24 emojis, lo elige quien quiera; aparece junto a su apodo en el ranking), **racha de días seguidos** 🔥 y **16 insignias** (Primer paso, Cazador/a de errores, Dedos veloces, Ronda perfecta, Duelista, Ojo de águila, Racha de 3 días, Dictamen aprobado, Maestro/a del Interés…). Se calculan a partir del avance, así que se conservan si cambian de dispositivo. Están en el mapa dentro de «Mis insignias».
- **Casos como mini-series**: «El Caso del Fondo de Litigio» (Derecho) y «La Clínica que quería crecer» (Psicología). Cada fase abre un capítulo; quienes eligen «Otra carrera» pueden cambiar de serie.
- **Confeti** al resolver y al completar fases (no aparece si el dispositivo pide menos animación), **sonidos** con WebAudio (🔇 apagados por defecto; botón 🔊) y **modo oscuro** 🌙/☀️ (recuerdan la elección).
- Se mantiene todo lo de la actividad anterior: calculadora arrastrable, glosario, letra grande «Aa», reflexión por fase, volver a ejercicios anteriores, aleatorio de opciones, guardado con reintentos y recuperación de ronda al recargar.

## 5. Cómo dirigir un reto relámpago (una ronda por fase)
1. Panel docente (la app + `#docente` al final de la URL, o «Abrir el panel docente» al pie de **⚡ Sala**): sección **1 · Sala relámpago**. Elige la ronda (1 Descubre … 7 Dictamen) y el tiempo por pregunta (1, 1½ o 2 min).
2. **«1 · Abrir sala y avisar»**: a los estudiantes les sale un aviso para entrar; verás cuántos hay **conectados**. Cuando digas «¡Ya, empezamos!» pulsa **«2 · ¡Iniciar!»** (cuenta regresiva de 12 s).
3. **Puntaje:** cada acierto vale **6 XP + hasta 4 XP por rapidez** (4 si responden al instante, bajando a 0 al cumplirse 60 s o el tiempo de la pregunta si es menor). Máximo 10 XP por pregunta y 50 por ronda; fallar no resta. **Desempate:** gana quien acertó en menos tiempo total. El reloj es el de la sala, no el del celular.
4. Durante la ronda ves la pregunta en curso, el tiempo y **cuántos ya respondieron**; con **«⏭ Siguiente pregunta»** toda la clase avanza. Al final: ranking de la ronda y **📊 Resultados por pregunta** (porcentaje que eligió cada opción). Antes de mostrar el ranking mira «X de Y resultados recibidos» y espera unos 15 s si faltan.
5. **«Cerrar sala»** al terminar. Cada ronda suma una sola vez por estudiante.

## 6. Duelo de bancos 🥊 (nuevo; funciona con la sala cerrada o abierta)
1. En el panel docente, sección **3 · Duelo de bancos**, elige uno de los 6 duelos (D1 «La tasa más alta, ¿siempre gana?» … D6 «La capitalización diaria entra en juego») y pulsa **«1 · Lanzar votación»**. Los estudiantes reciben un aviso «¡Duelo de bancos! Votar ahora» con dos ofertas (A y B) y votan A, B o «Empatan» **sin calculadora**, por intuición.
2. Tú ves en vivo cuántos votaron cada opción, y también **el cálculo correcto solo para ti** (monto de A, monto de B, cuál conviene).
3. Pulsa **«2 · Revelar resultado»**: a todos les aparecen los dos montos, la diferencia en soles, el procedimiento, si su intuición acertó y cómo votó la clase. Quien acierta gana la insignia «Ojo de águila» (con confeti). Cierra con **«Cerrar duelo»**.
Sugerencia de uso: lanza el duelo D1 al abrir la fase 3, D3 en la fase 3 o 4, y D5/D6 antes del Dictamen. Los duelos más sorprendentes son D1, D2, D4 y D6 (gana la oferta de tasa menor o la de menos capitalizaciones, según el caso); D5 es una diferencia mínima.

## 7. Ritmo, seguimiento y reflexiones
- **2 · Ritmo de la clase:** marca fase y reto; los estudiantes ven «La clase va en Fase 3 · Reto 2» y quienes se atrasan tienen un botón para alcanzarla.
- **4 · Seguimiento:** tarjetas por estudiante (7 fases en verde/ámbar, retos, XP, última vez), con resaltado de quienes van detrás del ritmo.
- **5 · Reflexiones:** cada fase termina con una pregunta para escribir una frase (sin nota); léelas por fase con nombre para abrir la conversación.

## 8. Cifras de tu guía/PPT que difieren del cálculo exacto
La actividad usa siempre el cálculo exacto de la calculadora y, en la explicación de cada reto, avisa si la cifra de tu material es aproximada. Conviene que las revises antes de la clase:

| Caso | En tu material | Cálculo exacto |
|---|---|---|
| Investigación en salud mental (S/ 25 000, 5.5 % trimestral, 3 años): monto | ≈ 29 465 | 29 451.70 |
| Reserva de S/ 60 000, 7 % anual capitalizable mensualmente, 5 años | ≈ 85 069.57 | 85 057.52 |
| Estudio jurídico semestral (S/ 40 000, 6 %, 10 años) | 72 244.86 | 72 244.45 |
| Meta de S/ 200 000 (valor presente, caso de María) | ≈ 145 073.57 | 145 074.49 |
| Centro Integral, entidad B (5.8 % mensual, 8 años) | ≈ 80 090 | 79 432.31 |
La última es la única que cambia más que unos céntimos: con los datos de la actividad, la entidad A (6 % semestral) da 80 235.32 y la B 79 432.31 (A gana por S/ 803.01). Si tu PPT tenía otros datos para esa entidad, dímelo y lo ajusto.

## 9. Si la nube se cae en plena clase
- El avance queda guardado primero en el dispositivo; sale un aviso amarillo y la página reintenta sola. La nube nunca borra avance (une lo nuevo con lo anterior: retos, rondas, reflexiones, días de racha, insignias).
- Durante el juego casi no se consulta a la nube (el reloj corre en la pantalla); en espera cada ~4 s y en el resto cada ~20 s.
- Si una orden del panel no llega (p. ej. «Abrir sala»), avisa: vuelve a pulsar.
- Clases grandes (~40): pide que entren unos minutos antes; Apps Script gratuito admite unas 30 ejecuciones simultáneas y la versión está pensada para eso.
- Tras una caída: que recarguen la página una vez para subir lo pendiente y pulsa «Actualizar ahora» en el seguimiento.

## 10. Librerías usadas
**KaTeX** (fórmulas en LaTeX), **JSXGraph** (gráficas interactivas), **canvas-confetti** (confeti; ~25 KB). Las barras de capitalización, los sonidos (WebAudio) y los gráficos de votación están hechos sin librerías, para que la página siga ligera en Google Sites.
