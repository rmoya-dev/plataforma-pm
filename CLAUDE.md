# CLAUDE.md — Plataforma de Pensamiento Matemático (PM)

Instrucciones para Claude Code. Léelas completas antes de tocar nada.

## 1. Qué es este proyecto
Una plataforma web única para el curso de **Pensamiento Matemático** (Universidad Continental; 16 semanas, 4 unidades; estudiantes de Derecho y Psicología). Reúne todos los recursos del curso —las «certificaciones» interactivas, el Tutor PM, el juego de los bancos y otras iniciativas— organizados por unidad y semana. Es **multidocente**: cada docente tiene sus propias secciones y estudiantes y no ve los de otro.

La especificación completa está en `docs/PLATAFORMA_UNIFICADA.md` (v0.7). **Esa es la fuente de verdad.** Si algo aquí y allá difiere, gana el documento; avisa a la responsable y corrige este archivo.

## 2. Orden de lectura
1. `docs/PLATAFORMA_UNIFICADA.md` (secciones 3, 5, 7, 8, 10, 13).
2. `docs/adr/` (decisiones tomadas; no las reabras sin una nueva ADR).
3. `legacy/` (código existente, **solo referencia**: ver sección 6).

## 3. Decisiones ya tomadas (resumen)
- Backend: **Supabase** (PostgreSQL + Auth + Realtime + Edge Functions). Front: **React + TypeScript + Vite (PWA)**, hosting estático (Cloudflare Pages). Repositorio **público** en GitHub (sin secretos ni datos de estudiantes), CI con GitHub Actions. Pruebas: Vitest + Playwright.
- Inicio de sesión: **Google con la cuenta institucional**, restringido al dominio de la Universidad; respaldo por enlace de correo. Importación opcional de la lista de Moodle (CSV con nombres y correos).
- Roles: administrador (al inicio, Flor), docente, estudiante. Seguridad por fila (RLS): el estudiante solo ve lo suyo; **el docente solo ve sus secciones**.
- El contenido es **código** (carpeta `content/`), editado solo por la administradora. Los docentes eligen qué activar por sección. No hay editor visual en el MVP.
- Cada actividad es **formativa** o **calificada**, por sección. En las calificadas y en las rondas en vivo **la respuesta correcta nunca viaja al navegador**: la valida una función en servidor.
- Alcance: solo el curso de Pensamiento Matemático. Fuera: tutor APA, AulaSegura, SARA, Notion/UTEA.
- Primera certificación a migrar: **«Periodo de Tiempo»** (Unidad 04, Semana 14). Datos históricos: empezar de cero.
- Los servicios se crean con la cuenta personal de la responsable y se transferirán después (ver ADR-0006 y riesgo R10).

## 4. Cómo trabajar (metodología)
- Iteraciones de 2 semanas; tablero en GitHub Projects; `docs/BACKLOG.md` refleja el estado.
- `main` protegida; todo cambio por *pull request*; *Conventional Commits*; versionado semántico.
- **Definición de «terminado»:** código revisado; pruebas unitarias y e2e en verde; sin LaTeX crudo ni errores de consola; probado a 320, 390 y 1200 px en claro y oscuro; documentación y `BACKLOG.md` actualizados; migraciones de base de datos incluidas y reversibles.
- Una decisión de arquitectura nueva = una ADR en `docs/adr/` (plantilla en `docs/adr/0000-plantilla.md`).
- **Nunca** guardes secretos en el repositorio. Usa variables de entorno y `.env.example`. Nunca uses la cuenta de producción para pruebas: desarrollo local con la CLI de Supabase.
- No cargues datos reales de estudiantes en desarrollo ni en pruebas.
- Antes de afirmar un límite o precio de un servicio, verifícalo en su documentación oficial.

## 5. Requisitos de producto que la responsable ya fijó (no negociables)
- Interfaz en **español** y pensada para **celular primero** (muchos estudiantes usan el teléfono). Modo oscuro, tamaño de letra ajustable.
- **Todas las fórmulas en LaTeX** (KaTeX). Nunca el símbolo `^` como potencia en el texto.
- Alternativas de los retos en **orden aleatorio**; poder **volver a ejercicios y respuestas anteriores**; **teoría y método paso a paso** en las fases difíciles.
- Casos y problemas alineados a **Derecho y Psicología**; montos en **soles**.
- Diseño pedagógico claro, con criterios de UX/UI: didáctico, sin sobrecargar.
- Retos relámpago: el **tiempo por pregunta lo elige la docente** (1, 1½ o 2 minutos; la idea es analizar, no responder rápido). La **docente controla** la sala y el ritmo; los estudiantes solo participan. Calculadora flotante que se pueda mover.
- Funciona con mala conexión: guardado diferido con reintentos; modo práctica sin conexión para actividades formativas.
- Ranking con **nombre e inicial del apellido** (p. ej. «María Q.»), tomados de la cuenta institucional; nunca nombres completos. No se pide apodo (D18).
- Privacidad (Ley 29733): datos mínimos (nombre, correo, avance), aviso de privacidad y consentimiento.

## 6. Cómo usar `legacy/`
Es código que **funciona hoy** y que se migrará; no se edita ni se despliega desde ahí.
- `legacy/certificaciones-html/`: las 8 certificaciones (HTML de Google Sites) y la versión autónoma de «Periodo de Tiempo».
- `legacy/fuente-tiempo/`: fuente de «Periodo de Tiempo» (`app_tp.js`, módulos de contenido en `parts/`, `build_tp.py`, plantillas). Es la **base del motor nuevo**.
- `legacy/backend/Code.gs`: lógica vigente de sala, ranking, duelos y progreso (Apps Script). Reimplementarla sobre Supabase. `Code_ec.antiguo.gs` es la versión antigua, solo referencia.
- `legacy/pruebas-playwright/`: 26 scripts (más `data.json`) y un simulador del backend. Úsalos como **criterios de aceptación**: la certificación «Periodo de Tiempo» sobre el motor nuevo debe dar **33/33 retos y 480/480 XP** en escritorio y celular, sin LaTeX crudo ni errores. Las librerías se instalan con npm: JSXGraph 1.9.2 y canvas-confetti 1.9.3 como en legacy; KaTeX en la 0.19 (la 0.16.11 de legacy tiene un aviso de seguridad, ver `docs/REVISION_LEGACY.md`). **Los scripts usan rutas absolutas del entorno anterior (`/home/claude/tp/...`) y copias locales de esas librerías: adáptalas.** Algunos (`dbg*.js`, `t6*.js`) son de depuración; los relevantes son `tp_full.js`, `tp_live.js`, `tp_audit.js`, `tp_robust.js`, `tp_sync.js`, `tp_owner.js`, `tp_old.js` y `mock.js`.
- `legacy/guias/`: guías de uso de la sala en vivo por certificación.
- Cuando la responsable entregue el **juego de los bancos** y el **Tutor PM**, irán a `legacy/juego-bancos/` y `legacy/tutor-pm/`.

Lecciones aprendidas que el diseño nuevo debe evitar (con evidencia): motor copiado y parcheado por certificación; despliegue manual que dejó un backend antiguo en producción; pruebas que contaminaron datos reales; identidad por nombre escrito a mano; sala en vivo por sondeo.

## 7. Primera tarea: hito H0 (fundamentos)
1. Crear la estructura del monorepo: `apps/web`, `packages/engine`, `content/`, `supabase/`, `docs/`, `legacy/`, `.github/workflows/`.
2. Configurar TypeScript, Vite, lint, formato, Vitest y Playwright.
3. CI en GitHub Actions: tipos, lint, unitarias y e2e (con un «hola mundo»).
4. Supabase local con la CLI (Docker): esquema inicial vacío, migraciones y semilla con **datos ficticios**.
5. Verificar las cuotas vigentes de Supabase Pro (conexiones en tiempo real simultáneas, copias de seguridad) frente a 300–500 estudiantes y anotarlas en una ADR.
6. Convertir las decisiones de `docs/PLATAFORMA_UNIFICADA.md` sección 10 en ADR (ya hay borradores en `docs/adr/`; revísalos y ajústalos).
7. Actualizar `docs/BACKLOG.md` y abrir el tablero.

**Criterio de salida de H0:** CI verde, `npm run dev` levanta el front con Supabase local, y las ADR están aprobadas por la responsable.

## 8. Lo que no debes hacer
- No migres certificaciones antes de cerrar H0 y H1.
- No reutilices proyectos de Firebase/Supabase de otras iniciativas de la responsable.
- No agregues funcionalidades fuera del alcance (sección 3 y 13 del documento) sin una ADR.
- No inventes datos pedagógicos (retos, respuestas, textos de teoría): los aporta la responsable o se migran desde `legacy/` y se verifican con las pruebas.

## 9. Datos pendientes de la responsable (pregunta cuando los necesites)
Mapa de unidades y semanas; código del Tutor PM y del juego de los bancos; fecha de inicio del piloto; nombre de la plataforma y subdominio; política de retención de datos y responsable del tratamiento. (Ver sección 13 del documento.)
