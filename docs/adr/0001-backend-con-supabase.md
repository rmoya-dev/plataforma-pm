# ADR-0001 — Backend con Supabase

- **Estado:** Aceptada (aprobada por la responsable el 2026-11-21)
- **Fecha:** 2026-11-21
- **Decide:** Flor Tapia

## Contexto
Se necesita autenticación institucional, tiempo real para la sala en vivo, aislamiento entre docentes y reportes por sección (registro auxiliar). El sistema actual usa Apps Script con Google Sheets y sondeo cada 2.5 s.

## Decisión
Usar Supabase (PostgreSQL, Auth, Realtime, Edge Functions) como backend único.

## Alternativas consideradas
Firebase (Auth + Firestore + Functions): más cercano al ecosistema Google, pero las funciones en servidor requieren el plan Blaze, la cuota diaria de lecturas es compartida y los reportes relacionales dan más trabajo. Seguir con Apps Script y Sheets: no resuelve el tiempo real ni la escala.

## Consecuencias
El plan gratuito permite 2 proyectos activos y se pausa tras 1 semana sin actividad: producción en plan Pro (≈ USD 25 al mes, a verificar) desde el piloto. El acceso a datos es SQL estándar, portable. Plan de ambientes: desarrollo local, 1 proyecto de pruebas, 1 de producción.
