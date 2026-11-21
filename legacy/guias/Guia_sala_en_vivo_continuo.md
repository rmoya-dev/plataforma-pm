# Guía rápida — Interés Compuesto Continuo (Semana 12): sala por fase, duelos, equipos, ritmo y seguimiento

## 1. Actualizar el respaldo (una sola vez; obligatorio)
1. En tu proyecto de Apps Script (el mismo de siempre) **reemplaza todo `Code.gs`** por el archivo nuevo.
2. **Cambia el PIN docente**: busca `var TEACHER_PIN = "PIN-DE-EJEMPLO";` y pon uno tuyo.
3. Guarda y luego **Implementar → Administrar implementaciones → ✏️ Editar → Versión: "Nueva versión" → Implementar.** La URL no cambia, así que no tocas los HTML. Si no creas la nueva versión, no aparecerán la actividad «continuo» ni el duelo por equipos.
4. La pestaña **"Progreso - Interés continuo"** se crea sola cuando el primer estudiante guarda avance. Las pestañas de las actividades anteriores no se tocan.

## 2. Publicar en Google Sites
Usa `interes-continuo-sites.html`: **Insertar → Insertar código → pestaña "Incorporar" → pega el contenido completo** (no el enlace). Ajusta el cuadro al ancho y alto máximos. También hay un enlace de Claude (Artifact) con la versión autónoma. Las fórmulas, las gráficas y el confeti se cargan desde internet (KaTeX, JSXGraph, canvas-confetti); si la red del aula los bloquea, la actividad sigue funcionando pero sin fórmulas bonitas, gráficas ni confeti.

## 3. Las 6 fases (33 retos, 480 XP + hasta 300 XP de relámpagos)
No hay repaso integrado ni simulacro: la evaluación queda para la Semana 13, como indicaste.
1. **Techo** (6): ¿qué pasa si capitalizas cada vez más seguido? S/ 1 000 al 8 % por 3 años: anual 1 259.71 … diaria 1 271.22 … continua 1 271.25. Laboratorio con la curva que se aplana contra el techo y barras comparativas. Mensaje honesto: ningún banco real capitaliza en cada instante.
2. **Fórmula** (6): $M=C\,e^{r\,t}$ (qué letra desaparece, exponente $r\cdot t$, tecla $e^{x}$, Ejemplo 1, ¿discreta o continua?, detective de errores). Tabla de $(1+1/n)^n \to e$.
3. **Calcula** (6): Ejemplo 2, Caso 2 (S/ 3 000 al 7.18 %), Caso 1 (S/ 20 000 al 1.15 % a 5, 15 y 20 años) y «la tasa pesa más que la frecuencia».
4. **Retrocede** (6): valor presente $C=M\,e^{-r\,t}$ (maestría, fianza, taller, reparación civil y detective «¿sumar o dividir?»). Incluye el recuadro **🔭 «Mirada a la Semana 14»** (opcional, sin nota) con el ejemplo de $\ln(2.25)/0.0685\approx11.84$ años.
5. **Decide** (5 casos): estudio Rojas (anual vs. continuo), **🚩 Detector de ofertas exageradas** (promesas posibles vs. imposibles según el techo $Ce^{rt}$), clínica Brújula (la tasa menor que gana), obligación a 6 años con valor presente y estudio de salud mental.
6. **Dictamen** (4 casos): reserva Quispe (mezcla anual/continua/mensual), clínica (valor presente continuo vs. anual), tasa efectiva anual $e^{r}-1$ y **jefe final «Fondo de la Defensoría»** con tarjeta de dictamen (nombre, carrera y fecha; copiar o imprimir). Termina con un puente breve a Semana 13 (logaritmos), 14 (tiempo de interés) y 15 (tasa poblacional).
Todo en soles (S/) y con casos de Derecho y Psicología. Se conservan: calculadora (ahora con tecla $e^{x}$), glosario, reflexión por fase, letra «Aa», volver a ejercicios anteriores, opciones al azar, guardado con reintentos.

## 4. Elementos juveniles (todo es opcional y el estudiante los controla)
- **📺 Temporada 2 de las mini-series**: «Valeria y el límite del dinero» (Derecho) y «La Clínica y el límite del dinero» (Psicología); un capítulo por fase.
- **🥊 Duelo «Discreto vs. Continuo»** con voto de la clase (sección 6) y **🚩 Detector de ofertas exageradas** (fase 5).
- **⚔️ Duelo por equipos Derecho vs. Psicología**: en el ranking de cada ronda, en el ranking general y en tu panel se muestra el **promedio por persona** de cada carrera (así es justo aunque un grupo sea más numeroso). Quienes eligen «Otra carrera» no entran al duelo, pero sí al ranking individual.
- Avatar, racha 🔥, **18 insignias** (nuevas: Descubridor/a del techo y Detector/a de promesas), confeti, sonidos (🔇 apagados por defecto) y modo oscuro.

## 5. Cómo dirigir un reto relámpago (una ronda por fase)
1. Panel docente (la app + `#docente` al final de la URL, o «Abrir el panel docente» al pie de **⚡ Sala**): sección **1 · Sala relámpago**. Elige la ronda (1 Techo … 6 Dictamen) y el tiempo por pregunta (1, 1½ o 2 min).
2. **«1 · Abrir sala y avisar»** y, cuando digas «¡Ya, empezamos!», **«2 · ¡Iniciar!»** (cuenta regresiva de 12 s).
3. **Puntaje:** cada acierto vale **6 XP + hasta 4 XP por rapidez**; máximo 10 por pregunta y 50 por ronda; fallar no resta. **Desempate:** gana quien acertó en menos tiempo total. El reloj es el de la sala.
4. Con **«⏭ Siguiente pregunta»** toda la clase avanza. Al final: ranking de la ronda, **barra del duelo por equipos** y **📊 Resultados por pregunta**. Antes de mostrar el ranking mira «X de Y resultados recibidos» y espera ~15 s si faltan.
5. **«Cerrar sala»** al terminar. Cada ronda suma una sola vez por estudiante.

## 6. Duelo «Discreto vs. Continuo» 🥊 (funciona con la sala cerrada o abierta)
Sección **3 · Duelo** del panel docente: elige un duelo, **«1 · Lanzar votación»** (votan A, B o «Empatan» sin calculadora), mira los votos y el cálculo correcto solo para ti, y **«2 · Revelar resultado»**. Los 6 duelos y su ganador:
| Duelo | Oferta A | Oferta B | Gana |
|---|---|---|---|
| D1 Un número más bajo que gana | 8 % anual | 7.9 % continuo (3 años) | **B** (+S/ 77.29 sobre S/ 10 000) |
| D2 Diaria contra continua | 6 % diaria | 6 % continua (5 años) | **B**, por apenas ~S/ 0.67 sobre S/ 20 000 |
| D3 El continuo no es magia | 5.2 % anual | 5.0 % continuo (10 años) | **A** |
| D4 Trimestral contra continua | 7.2 % trimestral | 7.0 % continuo (4 años) | **A** |
| D5 La tasa menor que gana | 12 % anual | 11.8 % continuo (2 años) | **B** |
| D6 Mensual contra continuo | 9.3 % mensual | 9.0 % continuo (6 años) | **A** |
Sugerencia: D1 al abrir la fase 2 o 3, D3 y D4 en la fase 5, D2 como cierre del techo. Todos terminan con la misma lección: compara montos finales o tasas efectivas, no el número del cartel.

## 7. Ritmo, seguimiento y reflexiones
- **2 · Ritmo de la clase:** marca fase y reto; los estudiantes ven «La clase va en Fase 3 · Reto 2» y quienes se atrasan tienen un botón para alcanzarla.
- **4 · Seguimiento:** tarjetas por estudiante (6 fases en verde/ámbar, retos, XP, última vez).
- **5 · Reflexiones:** cada fase termina con una frase opcional (sin nota); léelas por fase para abrir la conversación.

## 8. Cifras de tu guía que difieren del cálculo exacto (revísalas antes de clase)
La actividad usa siempre el cálculo exacto y, donde tu material redondea $e^{x}$, **acepta ambas cifras** y lo explica en el reto.
| Caso | En tu material | Cálculo exacto |
|---|---|---|
| Caso 1, S/ 20 000 al 1.15 % a 15 años | 23 765.28 | 23 765.44 |
| Caso 2, S/ 3 000 al 7.18 % a 1 año: monto / interés | 3 223.33 / 223.33 | 3 223.32 / 223.32 |
| Caso 3, valor presente de S/ 5 000 | 4 419.58 | 4 419.55 |
| Caso 4 / Ejemplo 6, valor presente | 2 570.48 | 2 570.53 |
| Diaria vs. continuo (S/ 1 000, 8 %, 3 años) | ≈ 0.04 | 0.03 |

**Importante:** no pude volver a leer el texto original de tu documento para los **Ejemplos 4–6 y Casos 3–5**, así que usé enunciados propios cuyos resultados coinciden con tus cifras (p. ej. S/ 5 000 a 6.17 % por 2 años → 4 419.55; S/ 3 000 a 5.15 % por 3 años → 2 570.53). Si en tu PPT los datos son otros, dímelo y los reemplazo.

## 9. Si la nube se cae en plena clase
- El avance queda guardado primero en el dispositivo; sale un aviso amarillo y la página reintenta sola. La nube nunca borra avance.
- Si una orden del panel no llega (p. ej. «Abrir sala»), vuelve a pulsar.
- Clases grandes (~40): que entren unos minutos antes. Tras una caída: que recarguen una vez y pulsa «Actualizar ahora» en el seguimiento.

## 10. Librerías usadas
**KaTeX** (fórmulas), **JSXGraph** (gráficas interactivas, incluida la convergencia hacia el techo) y **canvas-confetti** (confeti). Las barras comparativas, los sonidos (WebAudio) y el duelo por equipos están hechos sin librerías para mantener la página ligera en Google Sites.
