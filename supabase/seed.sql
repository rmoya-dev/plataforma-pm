-- Semilla de desarrollo. SOLO DATOS FICTICIOS: nunca nombres ni correos reales de estudiantes.
-- Se carga con `npm run db:reset` en Supabase local; no se ejecuta en staging ni en producción.
--
-- H0: el esquema todavía no tiene tablas del curso. En H1 se agregarán aquí docentes, secciones y
-- estudiantes ficticios (por ejemplo, «Docente Prueba Uno», estudiante01@ejemplo.test).

select 'semilla H0 cargada' as aviso;
