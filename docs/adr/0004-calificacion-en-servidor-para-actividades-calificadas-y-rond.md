# ADR-0004 — Calificación en servidor para actividades calificadas y rondas en vivo

- **Estado:** Aceptada (aprobada por la responsable el 2026-11-21)
- **Fecha:** 2026-11-21
- **Decide:** Flor Tapia

## Contexto
Hoy el navegador calcula el puntaje y las respuestas correctas viajan en el código; los resultados ahora pueden contar para la nota (decisión D11: ambos, por actividad).

## Decisión
Cada actividad se marca formativa o calificada por sección. En calificadas y rondas en vivo, las respuestas correctas se guardan en una tabla inaccesible al estudiante y la función `submit_answer` valida y puntúa. Las formativas pueden validar en el navegador.

## Alternativas consideradas
Validar todo en el navegador (inseguro para notas); validar todo en servidor (impide la práctica sin conexión).

## Consecuencias
Mayor esfuerzo de migración (riesgo R11). Se requiere diseñar el formato de contenido con la clave de respuestas separada.
