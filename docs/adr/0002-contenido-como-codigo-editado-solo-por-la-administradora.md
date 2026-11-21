# ADR-0002 — Contenido como código, editado solo por la administradora

- **Estado:** Aceptada (aprobada por la responsable el 2026-11-21)
- **Fecha:** 2026-11-21
- **Decide:** Flor Tapia

## Contexto
Los retos, la teoría y las series se escriben hoy dentro de cada HTML. La responsable será la única autora de contenido durante el MVP.

## Decisión
El contenido de cada certificación vive en `content/<clave>/` como archivos tipados, separado del motor. Los docentes solo activan recursos por sección. No hay editor visual en el MVP.

## Alternativas consideradas
Editor visual en la app (más trabajo, se evalúa después del piloto); docentes autores de retos (requiere moderación y control de calidad).

## Consecuencias
Los cambios de contenido pasan por pull request y CI. La clave de respuestas se separa del enunciado desde el diseño del formato (necesario para ADR-0004).
