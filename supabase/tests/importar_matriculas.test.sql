-- Pruebas de importar_matriculas (H1). Usan la semilla ficticia de supabase/seed.sql.
begin;
select plan(8);

\set doc1  '''d0000000-0000-4000-8000-000000000001'''
\set doc2  '''d0000000-0000-4000-8000-000000000002'''
\set ana   '''e0000000-0000-4000-8000-000000000001'''
\set secA  '''c0000000-0000-4000-8000-000000000001'''

create function pg_temp.como(p_id uuid) returns void language sql as $$
  select set_config('request.jwt.claims', json_build_object('sub', p_id, 'role', 'authenticated')::text, true);
$$;

select pg_temp.como(:doc1);
set local role authenticated;

create temp table resultado as
select * from public.importar_matriculas(:secA, $$[
  {"correo": " T0000050@Ejemplo.test ", "nombres": "Persona Nueva Cincuenta", "grupo": "G1"},
  {"correo": "t0000001@ejemplo.test", "nombres": "Ana Prueba Uno", "grupo": "G2"},
  {"correo": "t0000005@ejemplo.test", "nombres": "Elena Ficticia"},
  {"correo": "alguien@gmail.com", "nombres": "Externa"}
]$$::jsonb);

select results_eq(
  'select correo_fila, resultado from resultado order by correo_fila',
  $$ values
    ('alguien@gmail.com', 'dominio_no_permitido'),
    ('t0000001@ejemplo.test', 'ya_estaba'),
    ('t0000005@ejemplo.test', 'en_otra_seccion'),
    ('t0000050@ejemplo.test', 'agregado') $$,
  'cada fila recibe su resultado'
);
select is(
  (select grupo_moodle from public.matriculas where correo = 't0000050@ejemplo.test'), 'G1',
  'la matrícula nueva guarda el grupo de Moodle como referencia'
);
select is(
  (select origen from public.matriculas where correo = 't0000050@ejemplo.test'), 'moodle',
  'la matrícula nueva queda marcada como importada de Moodle'
);
select is(
  (select grupo_moodle from public.matriculas where correo = 't0000001@ejemplo.test'), 'G2',
  'si ya estaba, se actualizan los datos de Moodle'
);
reset role;

select is(
  (select seccion_id::text from public.matriculas where correo = 't0000005@ejemplo.test'),
  'c0000000-0000-4000-8000-000000000003',
  'un estudiante de otra sección no se mueve'
);

select pg_temp.como(:doc2);
set local role authenticated;
select throws_ok(
  format($$ select * from public.importar_matriculas(%L, '[]'::jsonb) $$, :secA),
  '42501', 'sin_permiso', 'un docente no puede importar en la sección de otro'
);
reset role;

select pg_temp.como(:ana);
set local role authenticated;
select throws_ok(
  format($$ select * from public.importar_matriculas(%L, '[]'::jsonb) $$, :secA),
  '42501', 'sin_permiso', 'un estudiante no puede importar'
);
reset role;

select pg_temp.como(:doc1);
set local role authenticated;
select throws_ok(
  format($$ select * from public.importar_matriculas(%L, '{"no": "es una lista"}'::jsonb) $$, :secA),
  '22023', 'filas_invalidas', 'rechaza datos que no son una lista'
);
reset role;

select * from finish();
rollback;
