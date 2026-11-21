# BACKLOG

Estado vivo del proyecto. Se actualiza en cada iteración (ver `docs/PLATAFORMA_UNIFICADA.md`, sección 8, para el detalle).

## Hecho
- [x] 8 certificaciones de Pensamiento Matemático (código en `legacy/`).
- [x] Auditoría de «Periodo de Tiempo»: 33/33 retos, 480/480 XP, sin LaTeX crudo, sin desbordes a 320/390/768/1200 px.
- [x] Sala en vivo, ranking, duelos, panel docente (versión Apps Script).
- [x] Batería de pruebas Playwright (26 scripts y `data.json`) y simulador de backend.
- [x] Especificación v0.5 y decisiones D1 a D14 y D16.

## H0 Fundamentos — cerrado (21/11/2026), salvo la lista de transferencia
- [x] Revisión técnica de `legacy/` → `docs/REVISION_LEGACY.md`
- [x] Estructura del monorepo (`apps/web`, `packages/engine`, `content/`, `supabase/`, `docs/`, `legacy/`, `.github/workflows/`)
- [x] TypeScript, Vite, ESLint, Prettier, Vitest y Playwright (320/390/1200 px, claro y oscuro)
- [x] Supabase local con migración inicial reversible, semilla ficticia y pruebas pgTAP (puertos 556xx)
- [x] `npm run dev` levanta el front conectado a Supabase local (verificación de versión de esquema)
- [x] Verificar cuotas de Supabase Pro frente a 300–500 estudiantes → ADR-0008
- [x] Correcciones de la especificación (v0.6)
- [x] Workflow de CI escrito (tipos, lint, formato, unitarias, base de datos, e2e)
- [x] Repositorio `rmoya-dev/plataforma-pm` creado y CI en verde en GitHub (21/11/2026); se recrea **público** con historial limpio (D19)
- [x] Repositorio público con historial limpio y `main` protegida (PR obligatorio + CI en verde) (21/11/2026)
- [x] Tablero abierto: https://github.com/users/rmoya-dev/projects/1 (un issue por hito)
- [x] ADR-0001 a ADR-0008 aprobados (21/11/2026)
- [x] I2: el bono por rapidez se mantiene (D17)
- [x] I3: el ranking muestra nombre e inicial del apellido; sin apodo (D18)
- [x] Cuentas de Supabase y Cloudflare creadas por la responsable (21/11/2026)
- [ ] Lista de verificación de transferencia de cuentas (ADR-0006) — issue #1

## Siguiente
- [ ] H1 — Modelo de datos, roles, multidocencia, autenticación y pruebas de aislamiento
- [ ] H2 — Motor único con «Periodo de Tiempo» (criterio: 33/33 y 480/480); PWA
- [ ] H3 — Sala en vivo en tiempo real y calificación en servidor
- [ ] H4 — Migrar las otras 7 certificaciones, una por una
- [ ] H4b — Estructura del curso (4 unidades, 16 semanas)
- [ ] H5 — Tutor PM · H6 — Panel docente y registro auxiliar · H6b — Moodle · H7 — Piloto · H8 — Dossier

## Por aportar por la responsable
Mapa de unidades y semanas · código del Tutor PM y del juego de los bancos · fecha de inicio del piloto · nombre y subdominio · política de retención de datos.
