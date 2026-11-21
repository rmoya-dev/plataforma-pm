# Plataforma unificada de certificaciones de aprendizaje
### Propuesta técnica, metodología y plan de trabajo — v0.7 (lista para entregar a Claude Code)

| | |
|---|---|
| **Autora / responsable de producto** | Flor Tapia |
| **Estado del documento** | Decisiones D1 a D14 y D16 resueltas; D15 (Tutor PM) a la espera del código (sección 10). Quedan **supuestos y datos por aportar** (sección 13) que no bloquean el hito H0. Documento listo para entregar a Claude Code junto con el paquete `plataforma-pm-handoff` (sección 14). |
| **Fecha** | 21 de noviembre de 2026 |
| **Alcance** | **Solo el curso de Pensamiento Matemático** (16 semanas, 4 unidades; Derecho y Psicología). Una herramienta general donde viven **todos los recursos del curso organizados por unidad y semana**: las certificaciones, el **Tutor PM**, el juego de los bancos y otras iniciativas complementarias. **Multidocente:** cada docente tiene sus propias secciones y estudiantes. |
| **Fuera de alcance** | Tutor de citas APA, AulaSegura, SARA y los cursos en Notion (UTEA). No forman parte de esta iniciativa. |

---

## 1. Resumen ejecutivo

Hoy existen **8 «certificaciones» interactivas** de Pensamiento Matemático (parábola, sistemas 2D, sistemas 3D, exponenciales, crecimiento poblacional, interés compuesto, interés continuo, periodo de tiempo) y se incorporará el **Tutor PM** (herramienta propia del curso, cuyo código aportará la responsable). Cada certificación es un archivo HTML independiente de entre 115 KB y 1.9 MB, publicado pegando código en Google Sites, que guarda su progreso en una hoja de Google Sheets a través de **un único Code.gs compartido**.

Esa arquitectura nos permitió avanzar rápido, pero ya muestra costos que crecen con cada iniciativa nueva: el motor está **copiado y parcheado** en cada certificación, cualquier cambio exige **re-pegar código en Sites**, no hay ambientes de prueba separados de producción, y la identidad del estudiante es un nombre escrito a mano. En las últimas semanas esto produjo fallas reales (sección 2.3).

**Propuesta:** pasar de «N páginas independientes» a **una plataforma con un motor único y las certificaciones como contenido (datos)**, con repositorio versionado, pruebas automáticas, ambientes separados e inicio de sesión institucional. Google Sites queda como portal fino que solo incrusta la plataforma y **no vuelve a tocarse** cuando hay cambios.

**Recomendación de pila (sección 5):** front-end en React + TypeScript + Vite publicado en hosting estático gratuito; base de datos, autenticación y tiempo real con Supabase (PostgreSQL); matrícula importada desde Moodle; Tutor PM como módulo (su pila de IA se define al recibir el código); desarrollo con Claude Code, GitHub, CI y pruebas con Playwright. Costo del MVP: **USD 0**. Costo recomendado para operar con estudiantes reales de forma estable: **≈ USD 25 al mes** (plan Pro de Supabase) más dominio propio opcional.

La Universidad ya extrae nombres y correos desde el aula virtual Moodle y los sube a otras plataformas, por lo que **los datos pueden residir dentro o fuera de la Universidad** (decisión D1). Aun así se mantienen buenas prácticas: aviso de privacidad, consentimiento y recolección mínima (riesgo R1).

---

## 2. Diagnóstico de la situación actual

### 2.1 Inventario

| Certificación | Clave en Code.gs | Fases / retos | Rondas relámpago |
|---|---|---|---|
| Parábola | `parabola` | 7 fases / 36 retos | no |
| Sistemas de ecuaciones 2D | `sistemas` | 7 fases / 43 retos | no |
| Sistemas 3D | `sistemas3` | 7 fases / 43 retos | no |
| Funciones exponenciales | `exponencial` | 7 fases / 39 retos | 7 |
| Crecimiento poblacional | `poblacion` | 7 fases / 39 retos | 7 |
| Interés compuesto | `interes` | 7 fases / 38 retos | 7 |
| Interés continuo | `continuo` | 6 fases / 33 retos | 6 |
| Periodo de tiempo | `tiempo` | 6 fases / 33 retos | 6 |
| Tutor PM | por definir (código pendiente de entrega) | — | — |

**Capacidades comunes ya construidas** (y que la plataforma debe conservar): mapa de misión por fases con desbloqueo secuencial; retos con alternativas en orden aleatorio, teoría paso a paso y fórmulas en LaTeX; calculadora científica flotante; progreso con XP, niveles e insignias; registro por nombre, carrera y apodo; **sala de retos relámpago** controlada por la docente con PIN, ranking, duelo por equipos Derecho vs. Psicología y duelos con voto de la clase; panel docente de seguimiento; reflexiones por fase; constancia descargable; modo oscuro, tamaño de letra y diseño para celular; guardado con cola y reintentos ante mala conectividad.

**Tamaño del código:** el motor de la última certificación tiene ≈ 3 900 líneas de JavaScript y el backend ≈ 690 líneas de Apps Script, más 26 scripts de prueba (Playwright) y un archivo de datos que hoy viven fuera de cualquier repositorio.

### 2.2 Cómo se construye hoy

1. Se toma el código de la certificación anterior (`app_ec.js`).
2. Un script (`build_tp.py`) **reemplaza bloques de texto** con los contenidos nuevos y aplica parches a mano.
3. Se genera un HTML por certificación (versión Sites y versión autónoma).
4. Se **pega** en Google Sites y se actualiza el `Code.gs` en Apps Script, publicando una nueva versión.

### 2.3 Problemas observados (con evidencia de este proyecto)

| # | Problema | Evidencia reciente | Causa de fondo |
|---|---|---|---|
| P1 | **Duplicación del motor**: cada certificación es una copia modificada de la anterior | 8 HTML con motores casi idénticos; una corrección debe repetirse 8 veces | No hay un núcleo compartido; el contenido y el motor están mezclados |
| P2 | **Despliegue manual y sin control de versiones** | Un `Code.gs` antiguo seguía publicado: la certificación «tiempo» cayó en la hoja de parábolas y mostró estudiantes de otra actividad | Pegar código ≠ publicar; no hay verificación de versión ni de contrato entre front y back |
| P3 | **Sin ambientes separados** | Las pruebas de la docente quedaron guardadas en la hoja real de estudiantes | Un solo ambiente (producción) |
| P4 | **Identidad débil** | Estudiantes que heredaban el avance de otra persona; nombres de una sola palabra que colisionan | La identidad es texto libre, no una cuenta |
| P5 | **Tiempo real por sondeo (polling)** | Desfase entre lo que ve la docente y el estudiante; se mitigó a 2–4 s con consultas cada 2.5 s | Apps Script no ofrece conexiones persistentes |
| P6 | **Datos en una hoja con un JSON por fila** | Difícil de analizar; limpiar mezclas requiere scripts ad hoc | Google Sheets no es una base de datos relacional |
| P7 | **Escalabilidad limitada** | ≈ 13 consultas por segundo con 40 estudiantes en ronda; con cientos de estudiantes se acerca a los límites de ejecuciones simultáneas de Apps Script | Arquitectura pensada para un aula, no para una institución |
| P8 | **Pruebas y documentación dispersas** | 26 scripts de prueba sin integración continua; el conocimiento está en el chat | No hay repositorio, CI ni documentación versionada |

---

## 3. Requisitos

### 3.1 Funcionales (resumen)

- **RF-01** Catálogo de certificaciones; cada una definida como contenido (fases, retos, teoría, glosario, duelos, rondas), sin tocar el motor.
- **RF-02** Inicio de sesión con cuenta institucional; un estudiante = una identidad única.
- **RF-03** Progreso por estudiante y por certificación, con XP, insignias, racha y constancia.
- **RF-04** Sala en vivo controlada por la docente (rondas, duelos, ranking, equipos) con sincronía menor a 1 s.
- **RF-05** Panel docente: seguimiento por fase, reflexiones, control de ritmo, exportación a Excel/CSV.
- **RF-06** Módulo **Tutor PM** integrado (funcionalidad exacta por definir al recibir su código).
- **RF-07** Gestión de secciones y periodos del curso de Pensamiento Matemático (por ejemplo, Derecho y Psicología, semestre 2026-II).
- **RF-08** Funcionamiento en celular y con conexión inestable (PWA, guardado diferido).
- **RF-09** Incrustable en Google Sites y, a futuro, en el aula virtual Moodle (enlace o herramienta externa LTI 1.3, a confirmar con la configuración de la Universidad).
- **RF-10** Importación de la matrícula desde Moodle (archivo CSV con nombres y correos) para crear las cuentas y asignar sección.
- **RF-11** Arquitectura de módulos: nuevas iniciativas complementarias del curso (Tutor PM, juego de los bancos y otras) se agregan como módulos sin modificar el motor.
- **RF-12** **Roles y multidocencia:** administrador (al inicio, Flor), docente y estudiante. Cada docente ve y gestiona únicamente sus secciones, estudiantes y avances; el administrador da de alta a los docentes y les delega permisos por niveles.
- **RF-13** **Estructura del curso:** 4 unidades y 16 semanas; cada recurso (certificación, tutor, juego, etc.) se ubica en una unidad y semana, y la docente decide cuáles activa para su sección.
- **RF-14** **Reportes y registro auxiliar:** el avance, la participación y los resultados quedan registrados por estudiante para que la docente calcule notas (exportación a Excel/CSV por sección, unidad y semana).
- **RF-15** **Acceso con correo institucional (cuentas Google de la Universidad):** el estudiante inicia sesión con su cuenta de la Universidad. Opcionalmente, la docente puede pre-cargar la lista de la sección exportada de Moodle (nombres, correos y otros campos) para que el registro auxiliar quede completo.
- **RF-16** **Actividades formativas y calificadas:** cada actividad tiene un modo, que la docente marca por sección. En las **calificadas**, las respuestas correctas no viajan al navegador: el servidor valida cada respuesta y registra el puntaje.

### 3.2 No funcionales (modelo de calidad ISO/IEC 25010)

| Atributo | Meta propuesta |
|---|---|
| Disponibilidad | 99 % en horario de clases; degradación elegante sin conexión |
| Rendimiento | Carga inicial menor a 3 s en 4G; propagación de eventos en vivo menor a 1 s |
| Capacidad | Piloto con **5 a 10 docentes y 300 a 500 estudiantes**; hasta 300 estudiantes simultáneos en sala; 1 000 como meta de diseño |
| Seguridad | Autenticación institucional, autorización por rol y por fila en la base de datos, secretos solo en servidor |
| Privacidad | Cumplimiento de la Ley 29733 de Protección de Datos Personales; minimización de datos; en los rankings solo nombre e inicial del apellido (D18) |
| Mantenibilidad | Un cambio de contenido no exige tocar el motor; cobertura de pruebas en el núcleo |
| Usabilidad / accesibilidad | Móvil primero; contraste y tamaño de letra ajustables; lenguaje claro |
| Portabilidad de datos | Todo el avance exportable en formatos abiertos |

---

## 4. Opciones evaluadas

| Opción | Descripción | Ventajas | Desventajas |
|---|---|---|---|
| **A. Seguir como hoy, ordenado** | Sites + Apps Script, pero con repositorio, `clasp` y un motor compartido | Costo cero; datos en Google Workspace; menor cambio | Persisten P2 en parte, P5, P6 y P7; Sites sigue siendo el punto de pegado |
| **B. Todo dentro de Apps Script** | Web app servida por `HtmlService`, con TypeScript, `clasp` y empaquetado | Un solo despliegue; identidad del dominio con `Session`; datos en Workspace | Rendimiento y latencia de `google.script.run`; sin tiempo real; límites de ejecución; iframe restringido |
| **C. Web app propia + Supabase** *(recomendada)* | Front estático + PostgreSQL + Auth + Realtime + funciones en servidor | Tiempo real nativo; SQL y BI; seguridad a nivel de fila; ambientes; escalable; gratis para empezar | Datos fuera de Google Workspace (decisión de la Universidad); más piezas que operar |
| **D. Web app propia + Firebase** | Front estático + Firestore + Auth | Muy integrado con Google; buen tiempo real | La cuota gratuita de lecturas se agota rápido con salas en vivo; modelo NoSQL menos cómodo para analítica; funciones requieren plan de pago |
| **E. Moodle propio** | Aula virtual con complementos | Ecosistema LMS completo | Gran costo de operación y mantenimiento; no resuelve la interactividad de las certificaciones; es un proyecto distinto |

**Lectura de cifras públicas** (consultadas el 21/11/2026):

- **Supabase, plan gratuito:** 500 MB de base de datos, 50 000 usuarios activos mensuales, 200 conexiones simultáneas en tiempo real y 100 mensajes por segundo. **Los proyectos gratuitos se pausan tras 1 semana sin actividad.** El plan Pro parte en USD 25 al mes. Fuentes: [precios](https://supabase.com/pricing) y [límites de Realtime](https://supabase.com/docs/guides/realtime/limits).
- **Firebase, plan Spark:** 50 000 lecturas y 20 000 escrituras de documentos por día; 100 conexiones simultáneas en Realtime Database; las Cloud Functions no figuran con cupo gratuito. Fuente: [precios de Firebase](https://firebase.google.com/pricing). Una ronda en vivo con decenas de estudiantes consume buena parte de ese cupo diario.
- **Cloudflare Pages, plan gratuito:** 500 compilaciones al mes y hasta 20 000 archivos por sitio. Fuente: [límites de Pages](https://developers.cloudflare.com/pages/platform/limits).
- **Apps Script:** no pude leer hoy la página de cuotas de Google; la cifra que recuerdo (≈ 30 ejecuciones simultáneas por usuario y 6 minutos por ejecución) **debe verificarse** en la [documentación oficial](https://developers.google.com/apps-script/guides/services/quotas) antes de basar una decisión en ella.

---

### 4.1 Sobre el límite de «proyectos» (consulta de la responsable)

- **Un solo proyecto basta para todos los docentes y unidades.** No se crea un proyecto por docente ni por unidad: los datos se separan por docente dentro de la misma base (multiinquilino) y la seguridad impide que un docente vea a los estudiantes de otro.
- **Firebase:** no existen «subproyectos»; un proyecto puede contener varias *apps* (web, Android, iOS), hasta 30 por proyecto. Según su preguntas frecuentes, en el plan gratuito (Spark) la cuota de creación de proyectos es «pequeña (normalmente alrededor de 5 a 10)», y los entornos (desarrollo, pruebas, producción) se separan en proyectos distintos. Fuente: [Firebase — preguntas frecuentes](https://firebase.google.com/support/faq/).
- **Supabase:** el plan gratuito permite **2 proyectos activos**. Si el límite de «dos proyectos» que recuerdas viene de ahí, aplica a Supabase y no a Firebase.
- **Plan de ambientes para ahorrar proyectos:** *desarrollo* en la computadora con emuladores locales (sin proyecto en la nube), un proyecto de *pruebas* y un proyecto de *producción*. Los proyectos que ya tengas para otras cosas **no deben reutilizarse**: mezclar datos de otras iniciativas en el mismo proyecto reproduciría el problema P3.

## 5. Arquitectura propuesta (opción C: Supabase, decidida en D9)

```
Estudiante / Docente  (celular o PC)
        │  https
        ▼
┌──────────────────────────────┐        ┌───────────────────────────────┐
│ Google Sites (portal fino)   │ iframe │ Front-end (React + TS + Vite) │
│  solo incrusta la plataforma │ ─────► │  PWA · motor único de         │
└──────────────────────────────┘        │  certificaciones · KaTeX ·    │
                                        │  JSXGraph                     │
                                        └──────────────┬────────────────┘
                                                       │ supabase-js
                    ┌──────────────────────────────────┼─────────────────────────┐
                    ▼                                  ▼                         ▼
          Auth (Google, dominio           PostgreSQL + RLS               Realtime (WebSocket)
          @continental.edu.pe)            progreso, rondas, equipos      sala en vivo, ranking
                                                       │
                                                       ▼
                                          Edge Functions (servidor)
                                          · Tutor PM (IA, por definir)
                                          · Calificación de rondas (anti-trampa)
                                          · Exportaciones
```

### 5.1 Decisiones de diseño clave

1. **Certificación = contenido.** Cada certificación vive en `content/<clave>/` como archivos tipados (fases, retos, teoría, glosario, duelos, rondas). El motor los interpreta. Los retos con lógica especial (gráficas interactivas, calculadoras de caso) se declaran como **componentes registrados**, no como código pegado.
2. **Identidad = cuenta institucional.** Se elimina el «nombre|carrera» como clave. Nombre y correo salen de la cuenta institucional; no se pide apodo. En el ranking se muestra el nombre y la inicial del apellido (D18).
3. **Modelo de datos con multidocencia.** Entidades previstas: `perfiles` (con rol), `docentes`, `unidades` (4), `semanas` (16), `recursos` (certificaciones, tutor, juegos), `secciones` (pertenecen a un docente), `matriculas`, `certificaciones`, `intentos_reto`, `progreso_fase`, `rondas`, `respuestas_ronda`, `duelos`, `votos`, `reflexiones`, `eventos` (analítica). El detalle va en un documento de modelo de datos (hito H1).
4. **Seguridad por docente y por fila.** El estudiante solo lee y escribe lo suyo; **cada docente accede solo a sus secciones y estudiantes**; el administrador ve todo; el ranking se expone mediante vistas que solo muestran nombre e inicial del apellido.
5. **Tiempo real por suscripción**, no por sondeo: la docente publica el evento «siguiente pregunta» y todos lo reciben por WebSocket. Se conserva el reloj del servidor para sincronizar.
6. **El servidor califica lo que cuenta para la nota.** Hoy la puntuación la calcula el navegador y las respuestas correctas viajan en el código. En las **rondas en vivo** y en las **actividades calificadas** la respuesta correcta se guarda en una tabla inaccesible para el estudiante y una función en servidor (`submit_answer`) valida y puntúa. Las actividades **formativas** pueden seguir validando en el navegador, para que practiquen sin conexión.
7. **Ambientes:** desarrollo local con la CLI de Supabase (Docker), `staging` y `producción`. Las pruebas de la docente nunca tocan producción.
8. **Contrato versionado:** el front declara la versión de esquema que requiere y el servidor la verifica al iniciar (evita repetir el problema P2).
9. **Módulo Tutor PM:** se integra como un módulo más. Cuando se reciba su código se decide si corre en el navegador o en una función en servidor; cualquier clave de un servicio de IA se guarda como secreto en servidor, nunca en el front-end. Debe definirse qué datos se envían y si se guardan (riesgo R3).
10. **Matrícula desde Moodle:** la docente exporta nombres y correos desde Moodle y los importa a la plataforma; así se crean las cuentas y se evita el registro libre por nombre. A futuro, LTI 1.3 permitiría abrir la plataforma desde Moodle e incluso devolver notas al libro de calificaciones.
11. **Exportación abierta:** CSV/Excel y conexión de solo lectura a la base para Power BI o Looker Studio.

### 5.2 Pila tecnológica

| Capa | Elección | Costo | Alternativa |
|---|---|---|---|
| Lenguaje | TypeScript | Gratis | — |
| Front-end | React + Vite, PWA | Gratis | Svelte |
| Matemática | KaTeX, JSXGraph (ya en uso) | Gratis | — |
| Hosting estático | Cloudflare Pages | Gratis | Firebase Hosting, GitHub Pages |
| Backend Supabase (Postgres, Auth, Realtime, Edge Functions) — **decidido en D9** | Gratis en desarrollo → ≈ USD 25/mes en producción | Firebase |
| IA del Tutor PM | Por definir al recibir el código | Por definir | — |
| Repositorio y CI | GitHub (repositorio público, D19) + GitHub Actions | Gratis | GitLab |
| Pruebas | Vitest (unitarias), Playwright (extremo a extremo) | Gratis | — |
| Errores en producción | Sentry (plan gratuito) | Gratis | — |
| Desarrollo asistido | Claude Code | Ya disponible | — |
| Dominio propio | Opcional | ≈ USD 10–15 al año | Subdominio gratuito |

---

## 6. Metodología de trabajo

Propuesta ligera pero verificable, pensada para un equipo pequeño y para poder **presentar evidencia** en una convocatoria institucional.

- **Ciclo:** Scrum ligero con iteraciones de 2 semanas y tablero Kanban en GitHub Projects. Cada iteración termina con una demo y una nota de versión.
- **Control de versiones:** rama `main` protegida; cambios por *pull request*; mensajes con *Conventional Commits*; versionado semántico (`1.0.0`).
- **Documentación viva en el repositorio** (`/docs`): visión, requisitos, **registros de decisiones de arquitectura (ADR)**, modelo de datos, plan de pruebas, guía de operación, `CHANGELOG.md`, `ROADMAP.md`, `BACKLOG.md` y `RIESGOS.md`. Este documento es el punto de partida.
- **Definición de «terminado» (DoD):** código revisado; pruebas unitarias y e2e en verde; sin LaTeX crudo ni errores de consola; probado en 320, 390 y 1200 px, en modo claro y oscuro; documentación actualizada; migración de base de datos incluida y reversible.
- **Calidad automática (CI):** en cada *pull request* se ejecutan tipos, lint, pruebas unitarias y e2e (reescribiendo en Playwright Test lo que comprueban los scripts ya escritos), y una verificación de que todos los retos tienen respuesta numérica correcta.
- **Gestión de riesgos y de cambios:** matriz de riesgos revisada cada iteración; decisiones de arquitectura solo mediante ADR.
- **Evidencia pedagógica (para el nivel nacional):** definir desde el inicio qué se medirá (participación, avance por fase, aciertos por reto, permanencia en sesión, percepción de estudiantes) y recoger los datos con consentimiento, de modo que el piloto pueda reportar resultados.

---

## 7. Plan por hitos

| Hito | Objetivo | Criterio de salida |
|---|---|---|
| **H0 — Fundamentos** | Repositorio, estructura del monorepo, CI, ambientes, ADR de las decisiones de la sección 10 | CI verde con un «hola mundo»; decisiones aprobadas |
| **H1 — Modelo de datos, roles y seguridad** | Esquema, roles (administrador / docente / estudiante), multidocencia, autenticación con correo institucional, datos de prueba | Pruebas de seguridad: un estudiante no lee datos de otro y **un docente no ve las secciones de otro** |
| **H2 — Motor único** | Extraer el motor de «tiempo» (el más reciente) y separar contenido de lógica | La certificación «tiempo» funciona idéntica a la actual (33/33 retos, 480/480 XP) sobre el motor nuevo |
| **H3 — Sala en vivo en tiempo real** | Rondas, duelos, ranking y equipos por Realtime; calificación en servidor | Sincronía menor a 1 s con 300 clientes simulados |
| **H4 — Migración de certificaciones** | Convertir las otras 7 a contenido (los datos históricos no se migran: D16) | Las 8 certificaciones en la plataforma |
| **H4b — Estructura del curso** | Unidades y semanas; ubicar cada recurso (incluido el juego de los bancos) y activarlo por sección | La docente arma su sección y ve el curso por unidad y semana |
| **H5 — Tutor PM** | Integrar el Tutor PM como módulo | Casos de prueba definidos con la docente; funciona dentro de la plataforma |
| **H6 — Panel docente, registro auxiliar y analítica** | Seguimiento, registro auxiliar para notas, exportación, tablero de BI | Docente obtiene el registro auxiliar por sección sin tocar la base |
| **H6b — Publicación en Moodle** *(deseable)* | Enlace desde el aula virtual y, si es sencillo, LTI 1.3 | Recurso publicado en el aula virtual según la política de la Universidad |
| **H7 — Piloto** | Un curso real con estudiantes, medición y ajustes | Informe de piloto con indicadores |
| **H8 — Propuesta institucional** | Dossier para la Universidad (ver sección 11) | Documento y demo listos |

Los tiempos se estiman en H0 con el equipo disponible; **no se comprometen fechas en este borrador.**

---

## 8. Backlog inicial

### 8.1 Avances (lo ya construido y validado)

- [x] Ocho certificaciones de Pensamiento Matemático con fases, retos, teoría paso a paso y fórmulas en LaTeX.
- [x] Progreso con XP, niveles, insignias, racha, reflexiones y constancia.
- [x] Sala de retos relámpago controlada por la docente (PIN), ranking, duelo por equipos y duelos con voto.
- [x] Guardado con cola y reintentos; funcionamiento con red inestable.
- [x] Panel docente de seguimiento de la clase.
- [x] Sincronía de la sala mejorada (reloj del servidor, consultas cada 2.5 s) y modo práctica para quien repite una ronda.
- [x] Avance ligado a la persona en cada dispositivo y descarte de datos ajenos a la actividad.
- [x] Verificación de que el servidor publicado corresponde a la actividad; funciones de reparación de datos mezclados.
- [x] Batería de pruebas automáticas (Playwright): recorrido completo en escritorio y celular, sala en vivo, robustez de red, aislamiento entre estudiantes.
- [x] Auditoría de la certificación «tiempo»: 33/33 retos, 480/480 XP, sin LaTeX crudo, sin desbordes a 320, 390, 768 y 1200 px.

### 8.2 Pendientes

**Cimientos**
- [ ] Crear la organización/cuentas (GitHub, Supabase, Cloudflare) y registrar la titularidad y el plan de transferencia (ADR-0006).
- [ ] Aprobar las decisiones de la sección 10 y registrarlas como ADR.
- [ ] Crear el repositorio y la estructura de monorepo (`apps/web`, `packages/engine`, `content/*`, `supabase/`, `docs/`).
- [ ] Configurar CI (tipos, lint, unitarias, e2e) y ambientes local / staging / producción.
- [ ] Mover los scripts de prueba relevantes al repositorio y adaptarlos al motor nuevo.

**Datos y seguridad**
- [ ] Función `submit_answer` y tabla de claves de respuesta fuera del alcance del estudiante (calificadas y rondas en vivo).
- [ ] Modo formativo / calificado por actividad y por sección (RF-16).
- [ ] Roles y multidocencia: administrador, docente, estudiante; alta de docentes y permisos delegables.
- [ ] Pruebas de aislamiento entre docentes.
- [ ] Importación de matrícula desde Moodle (CSV de nombres y correos).
- [ ] Modelo de datos y migraciones.
- [ ] Políticas RLS y pruebas de seguridad.
- [ ] Autenticación con Google restringida al dominio institucional.
- [ ] Plan de transición: las hojas de Sheets quedan como archivo (D16) y el Apps Script de producción se retira al entrar en uso la plataforma.
- [ ] Aviso de privacidad y consentimiento informado.

**Motor y contenido**
- [ ] Mapear las 8 certificaciones, el juego de los bancos y otros recursos a las 4 unidades y 16 semanas (**requiere información de la docente**).
- [ ] Incorporar el juego de los bancos como módulo.
- [ ] Extraer y modularizar el motor; definir el formato de contenido tipado.
- [ ] Componentes registrados para retos interactivos (gráficas, laboratorios).
- [ ] Convertir las 8 certificaciones a contenido.

**Sala en vivo**
- [ ] Canales Realtime, reloj de servidor, reconexión automática.
- [ ] Calificación de rondas en servidor.
- [ ] Prueba de carga con 300 clientes simulados.

**Tutor PM**
- [ ] Recibir el código del Tutor PM y documentar su funcionamiento.
- [ ] Definir casos de prueba y la forma de integración como módulo.
- [ ] Política de datos del tutor (qué se envía a servicios de IA, si los hay, y qué se guarda).

**Docente y analítica**
- [ ] Registro auxiliar por sección, unidad y semana (exportable).
- [ ] Panel por sección, exportación CSV/Excel, conexión a Power BI.

**Calidad y operación**
- [ ] Sentry, respaldos y plan de recuperación.
- [ ] Guía de operación y de soporte a estudiantes.

---

## 9. Riesgos

| ID | Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|---|
| R1 | Inconformidad con el tratamiento de datos personales (Ley 29733) aunque la Universidad ya permita su uso en otras plataformas | Baja | Alto | Aviso de privacidad y consentimiento; datos mínimos (nombre, correo, avance); en rankings solo nombre e inicial; acceso por rol; el sistema queda portable por si hubiera que cambiar de proveedor |
| R2 | El plan gratuito de Supabase pausa el proyecto tras 1 semana sin uso y no es adecuado para producción | Alta | Medio | Plan Pro (≈ USD 25/mes) para producción; el gratuito solo para desarrollo |
| R3 | Si el Tutor PM usa un servicio de IA de terceros, se envían textos de estudiantes | Media | Medio | Definirlo al recibir el código; minimizar y anonimizar; consentimiento; revisar condiciones del proveedor |
| R4 | Migrar 8 certificaciones consume más tiempo del previsto | Media | Medio | Migrar primero «tiempo»; automatizar la extracción de contenido; priorizar por uso |
| R5 | Dependencia de una sola persona para el mantenimiento (**aceptado para el piloto**, D6) | Media | Alto | Documentación en repositorio, ADR, CI y automatización; designar un segundo responsable **antes de ampliar** más allá del piloto |
| R10 | Datos personales de 300 a 500 estudiantes alojados en cuentas personales mientras no hay aprobación institucional (D13) | Media | Alto | Recoger solo nombre, correo y avance; aviso de privacidad y consentimiento; no usar la cuenta personal para otros fines; lista de verificación de transferencia a una organización (ver ADR-0006); informar a la Universidad antes del piloto |
| R11 | Pasar actividades calificadas a validación en servidor aumenta el esfuerzo de migración (hoy las respuestas están en el código de cada certificación) | Alta | Medio | Diseñar el formato de contenido con la clave de respuestas separada desde H2; migrar primero «Periodo de Tiempo» |
| R6 | Falla de conectividad durante una clase en vivo | Alta | Medio | Modo práctica local, cola de guardado, reconexión; plan B de la docente |
| R8 | Fuga de datos entre docentes (un docente ve estudiantes de otro) | Baja | Alto | Reglas de seguridad por docente y pruebas automáticas de aislamiento en CI |
| R9 | Con Firebase, funciones en servidor requieren plan de pago (Blaze, con tarjeta) y la cuota diaria de lecturas del plan gratuito se comparte entre todos los docentes | Media | Medio | Alerta de presupuesto; ranking agregado para reducir lecturas; evaluar Supabase (D9) |
| R7 | Cambios de precio o límites de los servicios gratuitos | Media | Bajo | Código portable (PostgreSQL estándar); evitar acoplamiento propietario |

---

## 10. Decisiones (registro; cada una se formaliza como ADR)

| ID | Decisión | Opciones | Recomendación | Quién decide |
|---|---|---|---|---|
| D1 | ¿Dónde residen los datos? | Dentro / fuera de la Universidad | **Resuelta:** pueden residir dentro o fuera. Se mantiene aviso de privacidad y consentimiento | Flor |
| D2 | ¿Con qué certificación se prueba primero el motor nuevo? | — | **Resuelta:** Periodo de Tiempo (la más reciente); las demás se migran una por una cuando la primera funcione | Flor |
| D3 | ¿Qué iniciativa complementaria se integra primero? | — | **Resuelta:** Tutor PM (código por recibir); luego el juego de los bancos y otras por unidad | Flor |
| D4 | ¿Dominio propio? | — | **Resuelta:** subdominio propio sin costo por ahora | Flor |
| D5 | ¿AulaSegura, SARA, tutor APA y Notion? | — | **Resuelta:** fuera; la plataforma es solo del curso de Pensamiento Matemático | Flor |
| D6 | ¿Quién es el segundo responsable técnico? | — | **Resuelta (provisional):** solo Flor con Claude Code durante el piloto; el riesgo R5 se acepta y se designa un segundo responsable antes de ampliar | Flor |
| D7 | ¿Cómo inician sesión los estudiantes? | — | **Resuelta:** con correo institucional; la lista de Moodle (nombres, correos y otros campos) se puede importar para el registro auxiliar | Flor |
| D8 | ¿Se publica en Moodle? | — | **Resuelta (no urgente):** deseable por política de la Universidad; se hace si resulta sencillo (hito H6b) | Flor |
| D9 | ¿Backend: Firebase o Supabase? | Firebase (Auth + Firestore + Functions) / Supabase (Postgres + Auth + Realtime) | **Resuelta: Supabase.** Se conserva el comparativo de abajo como registro de la decisión | Flor |
| D10 | ¿Quién crea y edita los contenidos? | Solo administradora / editor visual / cualquier docente | **Resuelta:** solo la administradora; el contenido vive en el repositorio (contenido como código). Los docentes eligen qué activar. Editor visual: evaluar después del piloto | Flor |
| D11 | ¿Cómo se usan los resultados en la nota? | Formativo / parte de la nota / ambos | **Resuelta:** ambos, por actividad (RF-16). Las calificadas se validan en servidor | Flor |
| D12 | ¿Qué proveedor de cuentas tiene la Universidad? | Google / Microsoft / mixto | **Resuelta:** Google. Inicio de sesión con Google restringido al dominio institucional; enlace por correo como respaldo | Flor |
| D13 | ¿En qué cuentas se crean GitHub, Supabase y hosting? | Personal / proyecto nuevo / institucional | **Resuelta:** cuenta personal de Flor con transferencia posterior (riesgo R10; ver ADR-0006). *Nota del analista: se recomendó una cuenta nueva del proyecto porque facilita la transferencia; la decisión de la responsable prevalece* | Flor |
| D14 | ¿Escala del piloto? | Solo mis secciones / 5 a 10 docentes / despliegue amplio | **Resuelta:** 5 a 10 docentes y 300 a 500 estudiantes. Implica multidocencia desde el inicio y **plan Pro de Supabase desde el piloto** | Flor |
| D15 | ¿Qué es el Tutor PM? | Chatbot con IA / reglas / por definir | **Pendiente de código:** se define al recibirlo (costo por uso, privacidad y dónde corre) | Flor |
| D16 | ¿Qué se hace con los datos históricos de las hojas? | Empezar de cero / migrar resultados / migrar todo | **Resuelta:** empezar de cero; las hojas quedan como archivo | Flor |
| D17 | ¿Se mantiene el bono por rapidez en las rondas relámpago (hasta 4 de 10 XP por pregunta)? | Mantener / quitar / configurable por sección | **Resuelta:** se mantiene como está en la versión actual | Flor |
| D18 | ¿Qué nombre muestra el ranking, ahora que los datos salen de la cuenta institucional y no se pide apodo? | Nombre + inicial / nombre completo / solo primer nombre | **Resuelta:** nombre y la inicial del apellido (p. ej. «María Q.»); nunca el nombre completo. Se elimina el apodo | Flor |
| D19 | ¿Repositorio privado o público? | Privado / público | **Resuelta:** público, para poder proteger `main` sin costo. Antes de publicarlo se retiraron de `legacy/` la URL del Apps Script de producción y el PIN docente; nunca se suben secretos ni datos de estudiantes | Flor |

**D9 — Comparativo que sustenta la decisión (Supabase)**

| Criterio | Firebase | Supabase |
|---|---|---|
| Ecosistema Google y cuenta institucional | Muy natural | Funciona con Google, pero es un proveedor aparte |
| Costo del piloto | Gratis en Spark; **funciones en servidor requieren Blaze (tarjeta)** | Gratis; en producción ≈ USD 25/mes (el plan gratuito se pausa tras 1 semana sin uso) |
| Lecturas diarias | 50 000 por día en Spark, compartidas por todos los docentes | Sin tope diario de lecturas; límites por conexiones (200) y mensajes |
| Registro auxiliar y reportes por sección | Más trabajo: consultas limitadas y agregaciones a mano | SQL directo; conexión a Power BI |
| Aislamiento entre docentes | Reglas de seguridad por documento | Seguridad por fila en SQL, más fácil de probar |
| Salir del proveedor en el futuro | Más acoplado | PostgreSQL estándar, portable |
| Proyectos | Cuota ≈ 5–10 en Spark | 2 activos en el plan gratuito |

**Lectura:** ambas sirven para un piloto con pocos docentes. Supabase encaja mejor con el registro auxiliar, los reportes y la multidocencia; Firebase encaja mejor si se prioriza permanecer en el ecosistema Google y se acepta activar Blaze. Se eligió Supabase por el registro auxiliar, los reportes por sección, el aislamiento entre docentes y la portabilidad. **Consecuencias a gestionar:** el plan gratuito permite 2 proyectos activos (plan: 1 de pruebas y 1 de producción, desarrollo en local) y se pausa tras una semana sin actividad (producción en plan Pro, ≈ USD 25 al mes, antes de operar con estudiantes).

---

## 11. Estructura sugerida del dossier para la iniciativa institucional

1. Problema y contexto (engagement y práctica en sesiones virtuales de matemática).
2. Solución y diferenciales (motor único, sala en vivo, tutor con IA, analítica docente).
3. Evidencia del piloto (indicadores definidos en la sección 6).
4. Arquitectura, seguridad y protección de datos (secciones 3, 5 y 9).
5. Escalabilidad y costos (sección 5.2 y plan de capacidad).
6. Hoja de ruta y equipo.
7. Demostración.

---

## 12. Cómo usar este documento

Este archivo es la **fuente de verdad inicial**. Al aprobar cada decisión de la sección 10 se crea un ADR en `docs/adr/` y se actualizan las secciones 5 y 8. El estado de las tareas se mueve a `BACKLOG.md` en el repositorio, con la misma estructura de 8.1 y 8.2.

## 13. Supuestos y datos por aportar (no bloquean H0)

| # | Dato o supuesto | Quién | Cuándo se necesita |
|---|---|---|---|
| 1 | **Mapa del curso:** unidad y semana de cada certificación, del juego de los bancos y de otros recursos | Flor | Hito H4b |
| 2 | **Código del Tutor PM** y descripción de su funcionamiento | Flor | Hito H5 |
| 3 | **Fecha de inicio del piloto** y calendario de ciclos (para planificar hitos) | Flor | Al terminar H0 |
| 4 | **Campos que exporta Moodle** (nombre, correo, ¿código de estudiante?, ¿sección?) y quién tiene permiso de exportarlos | Flor | Hito H1 |
| 5 | **Nombre de la plataforma y subdominio** | Flor | Antes del piloto |
| 6 | **Política de retención de datos y responsable del tratamiento** (Ley 29733) según la Universidad | Flor con la Universidad | Antes del piloto |
| 7 | Verificar cuotas de **Supabase Pro** (conexiones en tiempo real simultáneas, copias de seguridad) frente a 300 a 500 estudiantes | Analista | Hito H0 |
| 8 | Verificar cuotas actuales de **Apps Script** (no pude leer la página de Google) si se conserva algún componente | Analista | Si aplica |

## 14. Entrega a Claude Code

**¿Hay que pasar el código de las iniciativas a Claude Code?** Sí, pero no dentro de este documento. Este MD es la **especificación**; el código existente va **en el repositorio**, en una carpeta de referencia `legacy/`, para que Claude Code lo lea, lo ejecute y lo migre. Lo que ya existe y hay que entregar:

- Las 8 certificaciones en HTML (y la versión autónoma de «Periodo de Tiempo»).
- El código fuente de «Periodo de Tiempo» (`app_tp.js`, los módulos de contenido en `parts/` y el script de construcción) y el motor anterior.
- El `Code.gs` vigente y el antiguo, como referencia de la lógica de sala, ranking y duelos.
- Las pruebas automáticas de Playwright (26 scripts y un archivo de datos) y el simulador del backend, que sirven de **criterios de aceptación** del motor nuevo.
- Las guías de uso de la sala en vivo.

El **juego de los bancos** y el **Tutor PM** se agregarán a `legacy/` cuando los tengas, en carpetas propias. Basta con copiarlos al repositorio; no hay que escribir nada en este MD.

**Paquete preparado:** la carpeta `plataforma-pm-handoff` (`CLAUDE.md` con las instrucciones del proyecto, `docs/` con este MD y los ADR, y `legacy/` con el código). Orden de trabajo recomendado para Claude Code: leer `CLAUDE.md`, luego este documento y los ADR; ejecutar el hito H0; y registrar cada avance en `docs/BACKLOG.md` y cada decisión nueva como ADR.

## 15. Registro de cambios

| Versión | Fecha | Cambios |
|---|---|---|
| 0.1 | 21/11/2026 | Primer borrador: diagnóstico, opciones, arquitectura, metodología, hitos, backlog y riesgos. |
| 0.7 | 21/11/2026 | ADR-0001 a ADR-0008 aprobados. Nuevas decisiones D17 (se mantiene el bono por rapidez), D18 (ranking con nombre e inicial; sin apodo) y D19 (repositorio público). |
| 0.6 | 21/11/2026 | Correcciones de H0: número real de scripts de prueba (26 y un archivo de datos); H4 y el backlog ya no hablan de migrar datos de Sheets (D16); se agregan la revisión técnica de `legacy/` (`docs/REVISION_LEGACY.md`) y ADR-0008 (capacidad de Supabase Pro). |
| 0.5 | 21/11/2026 | Se resuelven D6 (provisional), D10 a D14 y D16; D15 queda a la espera del código del Tutor PM. Se agregan RF-16 (actividades formativas y calificadas con validación en servidor), los riesgos R10 y R11, la sección 13 (supuestos y datos por aportar) y la sección 14 (entrega a Claude Code). Se ajusta la capacidad del piloto a 5 a 10 docentes y 300 a 500 estudiantes. |
| 0.4 | 21/11/2026 | Se resuelve D9: backend Supabase. Queda abierta solo D6, que no bloquea el hito H0. |
| 0.3 | 21/11/2026 | Se resuelven D2, D4, D7 y D8. Se incorpora el modelo **multidocente** (RF-12), la estructura de 4 unidades y 16 semanas (RF-13), el registro auxiliar (RF-14) y el acceso con correo institucional (RF-15); el juego de los bancos se suma como recurso. Se agrega la sección 4.1 sobre límites de proyectos, el riesgo R8 y R9, los hitos H4b y H6b y la decisión **D9 (Firebase o Supabase)** con comparativo. |
| 0.2 | 21/11/2026 | La responsable decide: datos pueden residir dentro o fuera de la Universidad (D1); alcance solo Pensamiento Matemático con Tutor PM en lugar de tutor APA (D3, D5); se agregan matrícula desde Moodle (RF-10), arquitectura modular (RF-11) y decisiones D7 y D8. |

*Fuentes consultadas el 21/11/2026:* [Supabase — precios](https://supabase.com/pricing), [Supabase — límites de Realtime](https://supabase.com/docs/guides/realtime/limits), [Firebase — precios](https://firebase.google.com/pricing), [Cloudflare Pages — límites](https://developers.cloudflare.com/pages/platform/limits), [Firebase — preguntas frecuentes](https://firebase.google.com/support/faq/), [Apps Script — cuotas](https://developers.google.com/apps-script/guides/services/quotas).
