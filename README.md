# Plataforma PM

Plataforma del curso de **Pensamiento Matemático**: certificaciones interactivas, sala en vivo y demás recursos del curso. Especificación: [`docs/PLATAFORMA_UNIFICADA.md`](docs/PLATAFORMA_UNIFICADA.md). Instrucciones para Claude Code: [`CLAUDE.md`](CLAUDE.md).

## Estructura

| Carpeta | Contenido |
|---|---|
| `apps/web` | Front-end (React + TypeScript + Vite) y pruebas e2e (Playwright) |
| `packages/engine` | Motor de certificaciones: lógica pura, con pruebas unitarias (Vitest) |
| `content/` | Contenido de las certificaciones (lo edita solo la administradora) |
| `supabase/` | Configuración local, migraciones, reversiones (`rollbacks/`), semilla ficticia y pruebas de base de datos |
| `docs/` | Especificación, ADR, backlog y revisiones |
| `legacy/` | Código anterior, **solo referencia** |

## Requisitos
Node 22 o superior y Docker Desktop encendido.

## Primer uso

```powershell
npm install
```

```powershell
npm run db:start
```

Copia `.env.example` como `.env` y pon en `VITE_SUPABASE_PUBLISHABLE_KEY` la `PUBLISHABLE_KEY` que muestra `npm run db:status`.

```powershell
npm run dev
```

Abre http://localhost:5173. Debe decir «Conectado · esquema v1».

> Supabase local usa los puertos **556xx** (API en 55621, Studio en 55623) para no chocar con otros proyectos locales.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta el front en modo desarrollo |
| `npm run typecheck` · `npm run lint` · `npm run format:check` | Tipos, lint y formato |
| `npm test` | Pruebas unitarias |
| `npm run e2e` | Pruebas e2e a 320, 390 y 1200 px, en claro y oscuro |
| `npm run db:reset` | Borra la base local y aplica migraciones y semilla |
| `npx supabase test db` | Pruebas de base de datos (pgTAP) |
| `npm run db:stop` | Apaga Supabase local |

## Reglas
- Nunca subas secretos (`.env` está ignorado) ni datos reales de estudiantes.
- Todo cambio por *pull request* con *Conventional Commits*.
