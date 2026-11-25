-- Semilla de desarrollo. SOLO DATOS FICTICIOS: nunca nombres, correos ni DNI reales.
-- Se carga con `npm run db:reset` en Supabase local; no se ejecuta en staging ni en producción.
-- Los correos usan el dominio ficticio ejemplo.test y códigos que no son DNI posibles (T0000001…).

insert into public.dominios_permitidos (dominio) values ('ejemplo.test');

-- Cuentas (el disparador al_crear_usuario crea sus perfiles).
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
)
select
  '00000000-0000-0000-0000-000000000000', u.id, 'authenticated', 'authenticated', u.correo, '', now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object('given_name', u.nombres, 'family_name', u.apellidos),
  now(), now(), '', '', '', ''
from (values
  ('a0000000-0000-4000-8000-000000000001'::uuid, 'admin@ejemplo.test',      'Administradora', 'Prueba'),
  ('d0000000-0000-4000-8000-000000000001'::uuid, 'docente.uno@ejemplo.test', 'Docente',        'Uno Ficticio'),
  ('d0000000-0000-4000-8000-000000000002'::uuid, 'docente.dos@ejemplo.test', 'Docente',        'Dos Ficticio'),
  ('e0000000-0000-4000-8000-000000000001'::uuid, 't0000001@ejemplo.test',    'Ana',            'Prueba Uno'),
  ('e0000000-0000-4000-8000-000000000002'::uuid, 't0000002@ejemplo.test',    'Bruno',          'Ensayo Dos'),
  ('e0000000-0000-4000-8000-000000000003'::uuid, 't0000003@ejemplo.test',    'Carla',          'Demo Tres'),
  ('e0000000-0000-4000-8000-000000000004'::uuid, 't0000004@ejemplo.test',    'Diego',          'Muestra Cuatro'),
  ('e0000000-0000-4000-8000-000000000005'::uuid, 't0000005@ejemplo.test',    'Elena',          'Ficticia Cinco'),
  ('e0000000-0000-4000-8000-000000000006'::uuid, 't0000006@ejemplo.test',    'Fabio',          'Simulado Seis')
) as u (id, correo, nombres, apellidos);

update public.perfiles set rol = 'administrador' where correo = 'admin@ejemplo.test';
update public.perfiles set rol = 'docente' where correo in ('docente.uno@ejemplo.test', 'docente.dos@ejemplo.test');
update public.perfiles set carrera = 'derecho' where correo in ('t0000001@ejemplo.test', 't0000002@ejemplo.test', 't0000005@ejemplo.test');
update public.perfiles set carrera = 'psicologia' where correo in ('t0000003@ejemplo.test', 't0000004@ejemplo.test');
-- t0000006 todavía no elige carrera (primer ingreso).

insert into public.periodos (id, nombre, inicio, fin, activo)
values ('b0000000-0000-4000-8000-000000000001', 'Periodo de prueba', '2026-01-05', '2026-04-30', true);

insert into public.secciones (id, periodo_id, docente_id, nombre) values
  ('c0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000001', 'Sección A (prueba)'),
  ('c0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000001', 'Sección B (prueba)'),
  ('c0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000002', 'Sección C (prueba)');

insert into public.matriculas (seccion_id, periodo_id, correo, origen) values
  ('c0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 't0000001@ejemplo.test', 'moodle'),
  ('c0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 't0000002@ejemplo.test', 'moodle'),
  ('c0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000001', 't0000003@ejemplo.test', 'moodle'),
  ('c0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000001', 't0000004@ejemplo.test', 'moodle'),
  ('c0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000001', 't0000005@ejemplo.test', 'moodle'),
  ('c0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000001', 't0000006@ejemplo.test', 'moodle'),
  -- Cargado desde Moodle pero todavía sin cuenta: se enlazará en su primer ingreso.
  ('c0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000001', 't0000007@ejemplo.test', 'moodle');
