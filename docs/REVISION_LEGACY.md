# Revisión técnica de `legacy/`

**Fecha:** 21/11/2026 · **Alcance:** `legacy/backend/Code.gs`, `legacy/fuente-tiempo/` (`app_tp.js`, `parts/`, `build_tp.py`) y `legacy/pruebas-playwright/`.
**Propósito:** detectar temas técnicos que faltan o fallan en lo que ya funciona, para que el motor nuevo los conserve o los corrija. El criterio general es **migrar la funcionalidad tal como está y mejorar después**. Los puntos marcados como «corregir en la migración» no cambian lo que ve el estudiante.

Leyenda de prioridad: **A** = hay que resolverlo al migrar (afecta seguridad, notas o datos) · **M** = conviene resolverlo al migrar · **B** = mejora posterior.

## 1. Seguridad e integridad de las notas

| # | Hallazgo | Evidencia | Prioridad | Qué hace el motor nuevo |
|---|---|---|---|---|
| S1 | **Las respuestas correctas están en el código del navegador.** Cualquier estudiante puede verlas con las herramientas del navegador. | `ans:`, `c:` y `correct` en `DESPEJA`, `FORMULA`, `CALCULA`, etc. de `app_tp.js` | A | Ya previsto (ADR-0004): clave de respuestas separada del contenido y validación en servidor para actividades calificadas y rondas. |
| S2 | **El puntaje lo calcula el navegador y el servidor lo acepta sin verificar.** `save` recibe `progreso` completo; con una petición manual se puede marcar todo como resuelto o inflar los puntos de las rondas (`_flash.pts`). | `Code.gs` `writeRow_` / `mergeProgress_`; `app_tp.js` líneas ≈ 3014 | A | El servidor registra cada intento (`intentos_reto`) y calcula XP y puntos; el navegador solo muestra. |
| S3 | **PIN docente fijo y compartido** (`PIN-DE-EJEMPLO`), viaja en texto en cada petición y protege el panel con nombres completos y reflexiones. | `Code.gs` línea 108 | A | Se reemplaza por el rol «docente» con sesión de Google (ADR-0005); desaparece el PIN. |
| S4 | **Modo de prueba activable por cualquiera.** Si alguien escribe `window.__ICTEST = true` antes de cargar, la página pone las respuestas en atributos `data-expect`, `data-ex` y `data-oi`, y expone todo el contenido en `window.__TP`. | `app_tp.js` líneas 1193, 2420, 3008, 3897 | M | Los ganchos de prueba solo existen en la compilación de pruebas, nunca en producción. Las pruebas leen la clave desde `content/`, no desde el DOM. |
| S5 | **Identidad = «nombre\|carrera» escrito a mano.** Dos «María\|derecho» comparten avance; cambiar el nombre crea otra persona. | `normalizeKey_` | A | Ya previsto: cuenta institucional (ADR-0003). |
| S6 | La URL del Apps Script de producción está en 13 archivos del código antiguo. Cualquiera que la tenga puede escribir en la hoja real. | `SHEET_API_URL` | M | El código nuevo no la usa. Las pruebas nuevas no deben apuntar a ella. Se recomienda **retirar ese despliegue** cuando la plataforma nueva entre en uso. |
| S7 | El texto de estudiantes (apodo, reflexiones) **sí se escapa** antes de pintarlo (`escapeHtml`). Está bien. Pero el motor arma casi toda la interfaz con `innerHTML` y cadenas, lo que es frágil. | `app_tp.js` (> 100 usos de `innerHTML`) | B | React escapa por defecto; solo `rich()` (KaTeX) inyecta HTML, y solo desde contenido de la administradora. |

## 2. Multidocencia y escala

| # | Hallazgo | Evidencia | Prioridad | Qué hace el motor nuevo |
|---|---|---|---|---|
| E1 | **Una sola sala por actividad para todo el mundo.** El estado de la sala se guarda con la clave `flash_state_<actividad>`: si dos docentes abren «tiempo» a la vez, se pisan. | `flashStateKey_` | A | La sala pertenece a una **sección** (tabla `rondas` con `seccion_id`). |
| E2 | **Una sola hoja por actividad para todos los estudiantes.** El ranking, el duelo por equipos y el panel mezclan todas las secciones. | `classRows_` | A | Todo se filtra por sección con RLS (ADR-0005). |
| E3 | La sala funciona por **sondeo** (consultas cada pocos segundos) y la presencia se guarda en una caché de 5 min con un mapa JSON que se reescribe en cada consulta (se pierden pings con muchos estudiantes a la vez). | `touchPing_` | M | Realtime (canales + presencia) de Supabase. |
| E4 | El ranking de la ronda depende de que cada estudiante haya guardado; el «24 de 31 resultados» lo compensa. | `expectedPlayers_` | B | Con calificación en servidor, el resultado existe en cuanto se responde. |

## 3. Reglas que el motor nuevo debe conservar (contrato funcional)

Estas reglas se infieren del código y son las que hacen pasar las pruebas actuales. Deben quedar como pruebas unitarias del motor nuevo.

- **XP de la misión:** 10 por reto resuelto + 25 por fase completa. «Periodo de Tiempo»: 33 retos × 10 + 6 fases × 25 = **480 XP**. Las rondas relámpago suman aparte.
- **Totales por fase de «tiempo»:** despeja 6, formula 6, calcula 6, duplica 6, meta 5, dictamen 4.
- **Rondas relámpago:** 5 preguntas por ronda; una ronda por fase; cuenta regresiva de 12 s; acierto = 6 XP + hasta 4 XP por rapidez (ventana = mín(tiempo de la pregunta, 60 s)); fallar no resta; cada ronda cuenta **una sola vez** (gana el primer resultado).
- **«Siguiente pregunta» de la docente:** solo adelanta si la pregunta que vio la docente sigue en curso (un doble toque no salta dos). La ronda en curso caduca sola 90 s después de terminar.
- **Desempate del ranking de ronda:** puntos → aciertos → menor tiempo total → apodo. Ranking general: XP → fases → apodo. Top 10 + la posición propia.
- **Duelo por equipos:** **promedio** por carrera (no suma); quien no es de Derecho ni Psicología va a «Otra».
- **Unión de avance entre dispositivos:** un reto resuelto nunca se desmarca; insignias conservan la fecha más antigua; racha = unión de días (últimos 60); reflexiones: gana la más reciente.
- **Ritmo de la clase:** caduca a las 8 h.
- **Guardado:** cola con reintentos y espera exponencial (3 s a 60 s, con azar) y marca de «pendiente» en el dispositivo.

## 4. Inconsistencias encontradas

| # | Inconsistencia | Dónde | Propuesta |
|---|---|---|---|
| I1 | **Tiempo por pregunta:** el servidor acepta de 30 a 300 s y, si no llega el dato, usa **12 s**; el navegador usa 120 s por defecto y ofrece 60, 90 y 120. El requisito es 1, 1½ o 2 min. | `Code.gs` `FLASH_QSEC_DEFAULT`, `flashControl_`; `app_tp.js` `DEFAULT_QSEC` | El motor nuevo acepta **solo 60, 90 o 120 s** (restricción en la base de datos). |
| I2 | **Bono por rapidez vs. «la idea es analizar, no responder rápido».** Hasta 4 de los 10 XP por pregunta premian la velocidad. | `XP_SPEED_MAX` | **Resuelto (D17, 21/11/2026):** se mantiene como está. |
| I3 | Si el estudiante no pone apodo, el ranking muestra su **primer nombre**. Contradice «ranking con apodos, nunca nombres». | `firstName_`, `firstNameOf` | **Resuelto (D18, 21/11/2026):** sin apodo; el ranking muestra nombre e inicial del apellido de la cuenta institucional. |
| I4 | `README`/`CLAUDE.md` dicen 27 pruebas; la especificación dice 29. En la carpeta hay **26 scripts + `data.json`**. | `docs/PLATAFORMA_UNIFICADA.md` | Corregido en la especificación. |
| I5 | `build_tp.py` genera «tiempo» copiando el motor de «continuo» (`app_ec.js`) y **reemplazando texto**; usa rutas fijas `/home/claude/tp/`. No se puede volver a ejecutar aquí sin adaptarlo. | `build_tp.py` | No se reutiliza: el motor nuevo separa contenido y lógica (H2). Sirve para saber qué difiere entre certificaciones. |
| I6 | La guía y los comentarios hablan de 12 s por pregunta (versión antigua). | `Code.gs` línea 110, guías | Actualizar guías cuando se reescriban para la plataforma. |
| I7 | **KaTeX 0.16.11 tiene un aviso de seguridad** de severidad moderada ([GHSA-238p-pmpm-9mq7](https://github.com/advisories/GHSA-238p-pmpm-9mq7), corregido desde 0.18.2). | `npm audit` | El motor nuevo usa **KaTeX 0.19**. En H2 se comprueba con las pruebas que las fórmulas de «tiempo» se ven igual. JSXGraph 1.9.2 y canvas-confetti 1.9.3 se mantienen. |

## 5. Pruebas existentes

- **Valiosas como criterio de aceptación:** `tp_full.js` (recorrido completo y XP), `tp_audit.js`, `tp_live.js`, `tp_robust.js` (red inestable), `tp_sync.js`, `tp_owner.js` (aislamiento entre estudiantes en un mismo dispositivo), `tp_old.js` (servidor desactualizado) y `mock.js`, que ejecuta el `Code.gs` real con una hoja simulada (buena idea: el motor nuevo puede hacer lo mismo con Supabase local).
- **Dependen de detalles que cambiarán:** leen las respuestas del DOM (`data-expect`), interceptan `script.google.com`, buscan selectores concretos (`#reg_name`, `.node-btn`) y usan rutas `/home/claude/tp/`. Se reescribirán en TypeScript con Playwright Test, conservando **qué comprueban** (33/33, 480/480, sin LaTeX crudo, sin errores de consola, 320/390/1200 px).
- **Solo depuración, no se migran:** `dbg*.js`, `t6*.js`, `t10.js`, `t_rep.js`, `t_xp.js`, `tp_sync_dbg*.js`, `tp_shots*.js`, `dumpdata.js`, `rawscan.js` (este último sí se reutiliza: detecta LaTeX sin renderizar).

## 6. Lo que falta y no está en el código antiguo

- **Prueba de carga** de la sala (H3: 300 clientes).
- **Copias de seguridad** y plan de recuperación (hoy dependen de la hoja de Google).
- **Registro de errores** en producción (Sentry previsto).
- **Accesibilidad:** el motor tiene etiquetas `aria-label` en varios controles, pero no hay prueba automática (se propone `@axe-core/playwright` en CI).
- **Aviso de privacidad y consentimiento:** no existen en el código actual.

## 7. Resumen

Nada de lo encontrado obliga a cambiar el plan de la especificación: los puntos A ya estaban previstos en los ADR (identidad, roles, calificación en servidor). Los dos que **requieren una decisión de la responsable** son **I2** (bono por rapidez) e **I3** (qué mostrar si no hay apodo).
