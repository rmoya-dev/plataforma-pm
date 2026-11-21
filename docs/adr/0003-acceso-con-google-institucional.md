# ADR-0003 — Acceso con Google institucional

- **Estado:** Aceptada (aprobada por la responsable el 2026-11-21)
- **Fecha:** 2026-11-21
- **Decide:** Flor Tapia

## Contexto
La Universidad usa cuentas Google institucionales. La identidad actual (nombre escrito a mano) produjo avances mezclados.

## Decisión
Autenticación con Google restringida al dominio institucional; enlace por correo como respaldo; importación opcional de la lista de Moodle (CSV) para pre-registrar estudiantes y alimentar el registro auxiliar.

## Alternativas consideradas
Registro libre por nombre (descartado por colisiones); Microsoft (no aplica).

## Consecuencias
La identidad es única por cuenta. Hay que registrar la aplicación OAuth y verificar el dominio. Los docentes se dan de alta por invitación del administrador.
