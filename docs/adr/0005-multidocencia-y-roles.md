# ADR-0005 — Multidocencia y roles

- **Estado:** Aceptada (aprobada por la responsable el 2026-11-21)
- **Fecha:** 2026-11-21
- **Decide:** Flor Tapia

## Contexto
Cada docente debe tener sus secciones y estudiantes sin verse entre sí; la administradora delega permisos por niveles.

## Decisión
Roles: administrador, docente, estudiante. Entidades: docentes, secciones (de un docente), matrículas, unidades, semanas, recursos. Seguridad por fila para aislar a cada docente; pruebas automáticas de aislamiento en CI.

## Alternativas consideradas
Un proyecto por docente (inviable por cuotas y operación).

## Consecuencias
Una sola base multiinquilino. Riesgo de fuga entre docentes (R8) mitigado con pruebas de seguridad en H1.
