# ADR-0006 — Cuentas del proyecto a nombre personal con transferencia posterior

- **Estado:** Aceptada (aprobada por la responsable el 2026-11-21)
- **Fecha:** 2026-11-21
- **Decide:** Flor Tapia

## Contexto
La responsable quiere empezar rápido y transferir a una organización cuando la Universidad lo apruebe.

## Decisión
GitHub, Supabase, Cloudflare y los demás servicios se crean con una cuenta personal de Gmail indicada por la responsable el 21/11/2026 (el registro de titularidad se guarda fuera del repositorio) y se transfieren después. (La recomendación del analista fue una cuenta nueva del proyecto, que facilita la transferencia; prevalece la decisión de la responsable.)

## Alternativas consideradas
Cuenta nueva del proyecto; cuentas institucionales de la Universidad (requieren aprobación de TI).

## Consecuencias
Riesgo R10: datos personales de estudiantes en cuentas personales. Mitigación: datos mínimos, aviso de privacidad y consentimiento, informar a la Universidad antes del piloto y mantener una lista de verificación de transferencia (repositorio, proyecto Supabase, dominio, secretos, facturación).
