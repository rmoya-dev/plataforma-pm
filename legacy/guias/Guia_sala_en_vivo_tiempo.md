# Guía rápida — Interés Compuesto: Cálculo del Periodo de Tiempo (Semana 14): sala por fase, duelos, equipos, ritmo y seguimiento

## 1. Actualizar el respaldo (una sola vez; obligatorio)
1. En tu proyecto de Apps Script (el mismo de siempre) **reemplaza todo `Code.gs`** por el archivo nuevo.
2. **Cambia el PIN docente**: busca `var TEACHER_PIN = "PIN-DE-EJEMPLO";` y pon uno tuyo.
3. Guarda y luego **Implementar → Administrar implementaciones → ✏️ Editar → Versión: "Nueva versión" → Implementar.** La URL no cambia, así que no tocas los HTML. Si no creas la nueva versión, no aparecerá la actividad «tiempo».
4. La pestaña **"Progreso - Interés tiempo"** se crea sola cuando el primer estudiante guarda avance. Las pestañas de las actividades anteriores no se tocan.

## 2. Publicar en Google Sites
Usa `interes-tiempo-sites.html`: **Insertar → Insertar código → pestaña "Incorporar" → pega el contenido completo** (no el enlace). Ajusta el cuadro al ancho y alto máximos. También hay un enlace de Claude (Artifact) con la versión autónoma. Las fórmulas, las gráficas y el confeti se cargan desde internet (KaTeX, JSXGraph, canvas-confetti); si la red del aula los bloquea, la actividad sigue funcionando pero sin fórmulas bonitas, gráficas ni confeti.

## 3. Las 6 fases (33 retos, 480 XP + hasta 300 XP de relámpagos)
No hay repaso de semanas anteriores: solo el avance de la Semana 14. Niveles: Aprendiz, Explorador (120 XP), Estratega (270 XP) y Maestro del Tiempo (480 XP, exige las 6 fases).
1. **Despeja** (6): ¿cuánto tarda mi dinero? Bajar el exponente con logaritmos. Laboratorio con la curva, la meta y el punto $t^*$; comprueba que cambiar el capital no cambia el tiempo.
2. **Fórmula** (6): $t=\dfrac{\ln(A/P)}{\ln(1+r)}$ y $n\,t=\dfrac{\ln(M/C)}{\ln(1+r/n)}$. Laboratorio «arma la fórmula» y regla de oro de las unidades (periodos ÷ $n$ = años).
3. **Calcula** (6): Ejemplos 1 al 5 de tu guía más un reto de ln contra log. Incluye un ejemplo guiado paso a paso (S/ 30 000 → S/ 40 000 al 4 %: 7.33 años) y un laboratorio que compara periodos y años según la capitalización.
4. **Duplica y triplica** (6): el capital se cancela. Casos 1, 2 y 6 de tu guía (duplicar 21.67 años, triplicar 34.35, semestres 34.32, diaria 33.33 años), Mario contra Julián y una tabla maestra de los Casos 1 al 6.
5. **Meta** (5): Casos 7 y 8 (25.74 trimestres = 6.44 años; 5.10 semestres), clínica Brújula (S/ 20 000 → S/ 30 000 al 4.5 % trimestral) y el laboratorio **«Línea de vida»**: ¿a qué edad empiezo? (empezar 10 años tarde cuesta más de lo que parece).
6. **Dictamen** (4): consignación judicial (A 5.4 % anual, B 5.35 % mensual, C 5.3 % semestral), **🚩 Detector de promesas imposibles** (5 promesas: son posibles la 1 y la 3), ejecución de sentencia (S/ 30 000 → S/ 45 000 al 4.8 % mensual: 8.46 años, no alcanza en 8) y **jefe final «Fondo de la Defensoría»** con tarjeta de dictamen (nombre, carrera y fecha; copiar o imprimir). Termina con el puente a la Semana 15 (crecimiento poblacional y Prueba de Desarrollo 4).
Todo en soles (S/) y con casos de Derecho y Psicología. Se conservan: calculadora, glosario (15 términos), reflexión por fase con las preguntas de metacognición de tu PPT, letra «Aa», volver a ejercicios anteriores, opciones al azar y guardado con reintentos.

## 4. Elementos juveniles (todo es opcional y el estudiante los controla)
- **📺 Temporada 3 de las mini-series**: «Valeria y el reloj del dinero» (Derecho) y «La Clínica y el reloj del dinero» (Psicología); un capítulo por fase.
- **🥊 Duelo «¿Quién llega primero?»** con voto de la clase (sección 6) y **🚩 Detector de promesas imposibles** (fase 6).
- **🧭 Línea de vida** (fase 5): ¿a qué edad empiezo?
- **⚔️ Duelo por equipos Derecho vs. Psicología**: se compara el **promedio por persona** (justo aunque un grupo sea más numeroso). Quienes eligen «Otra carrera» no entran al duelo, pero sí al ranking individual.
- Avatar, racha 🔥, **19 insignias**, confeti, sonidos (🔇 apagados por defecto) y modo oscuro.

## 5. Cómo dirigir un reto relámpago (una ronda por fase)
1. Panel docente (la app + `#docente` al final de la URL, o «Abrir el panel docente» al pie de **⚡ Sala**): sección **1 · Sala relámpago**. Elige la ronda (1 Despeja … 6 Dictamen) y el tiempo por pregunta (1, 1½ o 2 min).
2. **«1 · Abrir sala y avisar»** y, cuando digas «¡Ya, empezamos!», **«2 · ¡Iniciar!»** (cuenta regresiva de 12 s).
3. **Puntaje:** cada acierto vale **6 XP + hasta 4 XP por rapidez**; máximo 10 por pregunta y 50 por ronda; fallar no resta. **Desempate:** gana quien acertó en menos tiempo total.
4. Con **«⏭ Siguiente pregunta»** toda la clase avanza. Al final: ranking de la ronda, **barra del duelo por equipos** y **📊 Resultados por pregunta**. Antes de mostrar el ranking mira «X de Y resultados recibidos» y espera ~15 s si faltan.
5. **«Cerrar sala»** al terminar. Cada ronda suma una sola vez por estudiante.
6. **Sincronía:** los relojes de la sala usan la hora del servidor, no la del celular, así que un dispositivo con la hora mal puesta no se desfasa. Cuando pulsas «⏭ Siguiente pregunta», los estudiantes lo ven en unos **2 a 4 segundos** (consultan a la sala cada ~2.5 s durante la ronda).
7. **Si pruebas la sala con tu propio usuario de estudiante:** cada ronda cuenta una sola vez por persona. La segunda vez que entras a la **misma ronda** (aunque la abras de nuevo) se abre en **modo práctica**: va a tu ritmo, no suma XP y el docente no te ve como «jugando». Para repetir la prueba completa usa **otra ronda** o **otro nombre de estudiante**.

## 6. Duelo «¿Quién llega primero?» 🥊 (funciona con la sala cerrada o abierta)
Sección **3 · Duelo** del panel docente: elige un duelo, **«1 · Lanzar votación»** (votan A, B o «Tardan lo mismo» sin calculadora), mira los votos y el cálculo correcto solo para ti, y **«2 · Revelar resultado»**. Gana quien llega antes a la meta:
| Duelo | Oferta A | Oferta B | Tiempos | Gana |
|---|---|---|---|---|
| D1 La tasa menor que llega antes (duplicar) | 6 % anual | 5.9 % mensual | 11.90 vs. 11.78 años | **B** |
| D2 Diaria contra anual (duplicar) | 4 % diaria | 4.1 % anual | 17.33 vs. 17.25 años | **B** |
| D3 Triplicar: ¿frecuencia o tasa? | 5 % trimestral | 5.05 % anual | 22.11 vs. 22.30 años | **A** |
| D4 ¿Importa cuánto inviertes? | Lucía, S/ 5 000 al 6 % anual | Marta, S/ 500 000 al 6 % anual | 11.90 vs. 11.90 años | **Empate** (el capital se cancela) |
| D5 Misma tasa, distinta capitalización | 3 % anual | 3 % mensual | 23.45 vs. 23.13 años | **B** |
| D6 Fernando contra Julián (Casos de tu guía) | 4.08 % semestral | 4.02 % mensual | 17.16 vs. 17.27 años | **A** |
Sugerencia: D4 al abrir la fase 4, D1 y D5 en la fase 2 o 3, D3 y D6 como cierre. Todos terminan con la misma lección: compara el tiempo calculado, no el número del cartel.

## 7. Ritmo, seguimiento y reflexiones
- **2 · Ritmo de la clase:** marca fase y reto; los estudiantes ven «La clase va en Fase 3 · Reto 2» y quienes se atrasan tienen un botón para alcanzarla.
- **4 · Seguimiento:** tarjetas por estudiante (6 fases en verde/ámbar, retos, XP, última vez).
- **5 · Reflexiones:** cada fase termina con una frase opcional (sin nota); léelas por fase para abrir la conversación.

## 8. Cifras de tu material que conviene revisar
La actividad usa el cálculo exacto y, donde tu material redondea, **acepta ambas cifras** y lo explica.
| Caso | En tu material | Cálculo exacto |
|---|---|---|
| Ejemplo 4 (meses) | 16.55 | 16.58 (se aceptan 16.55 y 16.58) |
| Ejemplo 2 (años) | 7.33 | 7.33 aceptado con tolerancia de ±0.012 |
| Caso 6 (diaria, 33.33 años) | n = 365 y n = 360 dan el mismo resultado en años | la actividad lo muestra como nota |
Nota: «interés triple» se resuelve con $\ln 4$ (el monto es 4 veces el capital). Los números de los Ejemplos 1 al 5 y de los Casos 1 al 8 fueron recalculados uno por uno.

## 9. Si la nube se cae en plena clase
- El avance queda guardado primero en el dispositivo; sale un aviso amarillo y la página reintenta sola. La nube nunca borra avance.
- Si una orden del panel no llega (p. ej. «Abrir sala»), vuelve a pulsar.
- Clases grandes (~40): que entren unos minutos antes. Tras una caída: que recarguen una vez y pulsa «Actualizar ahora» en el seguimiento.

## 10. Librerías usadas
**KaTeX** (fórmulas), **JSXGraph** (gráficas interactivas: curva con meta y líneas ×2 ×3) y **canvas-confetti** (confeti). Las barras comparativas, los sonidos (WebAudio) y el duelo por equipos están hechos sin librerías para mantener la página ligera en Google Sites.

## 11. Cómo se probó (revisión a fondo)
- **Recorrido completo automatizado** (33 de 33 retos, 480 de 480 XP) en escritorio y en celular, en la versión autónoma y en la de Google Sites con las librerías reales, y también con las librerías **bloqueadas** (sin fórmulas bonitas, pero todo funciona).
- **Cifras:** recalculé con un programa aparte cada respuesta de los retos, las rondas relámpago, las preguntas del día, la tabla maestra y los 6 duelos; coinciden con tu guía (salvo lo del punto 8).
- **Fórmulas y diseño:** sin LaTeX sin formatear ni desbordes laterales en 320, 390, 768 y 1200 px, en modo claro y oscuro.
- **Fallos simulados:** internet caído, servidor lento (5 s), servidor que no responde, respuestas de error o página de permisos de Google, red intermitente, internet que se corta y vuelve, almacenamiento del navegador bloqueado, recarga a mitad de fase, mismo estudiante en otro dispositivo (recupera su avance), nombres largos con emoji, números con coma, doble clic y entradas inválidas. En todos los casos el estudiante sigue trabajando y su avance se guarda en el dispositivo y se envía solo cuando vuelve la conexión (cada envío tiene tiempo límite para que una conexión colgada no frene los demás).
- **Sala en vivo:** varios estudiantes, ranking, duelo por equipos, duelo con voto y empate, panel docente con PIN incorrecto y con la nube caída.
- Todo se probó con tu `Code.gs` real y una hoja simulada, **no** con tu hoja de Google: haz una prueba corta con 2 o 3 celulares antes de la clase.
- En la versión de Claude (Artifact) el botón «Guardar como PDF / imprimir» no funciona (el visor no permite imprimir); en Google Sites sí.


## 12. Si un estudiante ve fases «ya hechas» que no hizo

**Causa:** el avance se guardaba en el navegador sin asociarlo a una persona. Si dos estudiantes usaban el mismo celular o computadora (o un estudiante cambiaba su nombre con «editar»), el segundo heredaba lo del primero y eso se enviaba a la hoja con su nombre.

**Corregido en esta versión:** cada dispositivo recuerda de quién es el avance. Al registrarse (o editar) con **otro nombre o carrera**, el avance local se borra y se carga solo lo que haya en la nube a ese nombre. Cambiar solo el apodo no borra nada. Además se pide **nombre y al menos un apellido** para que dos «Juan» no compartan fila.

**Filas ya contaminadas en la hoja** («Progreso - Interés tiempo»): la fila se identifica por *nombre|carrera*. Para reiniciar a un estudiante, borra su fila (o vacía la columna del progreso); al volver a entrar empezará de cero. Si dos personas usaron el mismo nombre, dile a una que se registre con su nombre completo.


## 13. Aparecen estudiantes de días atrás o fases «ya hechas»: publica bien el Code.gs

**Causa más probable (la principal):** el Code.gs que está *publicado* en Google es una versión antigua que no conoce la actividad «tiempo». Ese script, cuando no reconoce la actividad, usa por defecto la hoja de la actividad de parábolas («Progreso»). Por eso el panel muestra 7 cuadros y 36 retos (eso es de parábolas, esta actividad tiene 6 fases y 33 retos) y aparecen estudiantes de hace 13 a 36 días: son los de la otra actividad. Si un estudiante tenía el mismo nombre y carrera en esa hoja, la app le traía su avance anterior.

**Importante:** pegar el código en el editor de Apps Script **no basta**; hay que publicar una versión nueva:

1. Apps Script → pega el `Code.gs` nuevo completo (reemplaza todo) → guardar.
2. **Implementar → Administrar implementaciones →** lápiz ✏️ de la implementación activa → **Versión: «Nueva versión» → Implementar.** (La URL no cambia.)
3. Abre el panel docente: el «Seguimiento de la clase» debe mostrar **6 cuadros** por estudiante y **/33** retos.

**Blindaje de esta versión:** la app ahora verifica que el script responda como «tiempo». Si es una versión antigua, **no carga ni guarda nada en la nube**, el estudiante sigue trabajando en su dispositivo con un aviso, y el panel docente muestra el motivo en rojo. Apenas publiques el script nuevo, el avance local sube solo. Además la app descarta cualquier fase o reto que no pertenezca a esta actividad.

**Limpiar la hoja «Progreso» (parábolas):** en Apps Script, selecciona la función `revisarMezclaTiempo` y pulsa Ejecutar (no cambia nada; en Ver → Registros verás qué filas se limpiarían). Si te parece bien, ejecuta `limpiarMezclaTiempo`: quita de esa hoja solo lo de «tiempo» (fases despeja, fórmula, duplica, meta, dictamen y los retos k1–k6) y conserva lo de parábolas. Las filas que queden sin ningún avance de parábola puedes borrarlas a mano.
