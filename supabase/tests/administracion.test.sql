-- Pruebas de administración (H1). Usan la semilla ficticia de supabase/seed.sql.
begin;
select plan(14);

\set admin   '''a0000000-0000-4000-8000-000000000001'''
\set doc1    '''d0000000-0000-4000-8000-000000000001'''
\set periodo '''b0000000-0000-4000-8000-000000000001'''

create function pg_temp.como(p_id uuid) returns void language sql as $$
  select set_config('request.jwt.claims', json_build_object('sub', p_id, 'role', 'authenticated')::text, true);
$$;

-- ---------------------------------------------------------------- Periodos
select pg_temp.como(:admin);
set local role authenticated;

insert into public.periodos (id, nombre, inicio, fin)
values ('b0000000-0000-4000-8000-000000000002', 'Segundo periodo de prueba', '2026-08-01', '2026-12-15');
select public.activar_periodo('b0000000-0000-4000-8000-000000000002');
select is(
  (select array_agg(nombre) from public.periodos where activo), array['Segundo periodo de prueba'],
  'al activar un periodo, los demás dejan de estar activos'
);
reset role;

select throws_ok(
  $$ update public.periodos set activo = true $$,
  '23505', null, 'la base de datos no admite dos periodos activos'
);

select pg_temp.como(:doc1);
set local role authenticated;
select throws_ok(
  format('select public.activar_periodo(%L)', :periodo),
  '42501', 'solo_administrador', 'un docente no puede activar periodos'
);
select throws_ok(
  $$ insert into public.periodos (nombre, inicio, fin) values ('Ajeno', '2027-01-01', '2027-02-01') $$,
  '42501', null, 'un docente no puede crear periodos'
);
reset role;

-- ---------------------------------------------------------------- Docentes
select pg_temp.como(:admin);
set local role authenticated;

select is(public.autorizar_docente(' Nueva.Docente@Ejemplo.test '), 'invitado', 'se puede autorizar a quien aún no ingresa');
select is(public.autorizar_docente('t0000006@ejemplo.test'), 'asignado', 'a quien ya tiene cuenta se le asigna el rol');
select is(public.autorizar_docente('docente.uno@ejemplo.test'), 'ya_era_docente', 'avisa si ya era docente');
select throws_ok(
  $$ select public.autorizar_docente('alguien@gmail.com') $$,
  '22023', 'dominio_no_permitido', 'solo se autorizan correos institucionales'
);
select results_eq(
  $$ select correo, estado from public.listar_docentes() where correo like 'nueva.docente%' or correo like 't0000006%' order by 1 $$,
  $$ values ('nueva.docente@ejemplo.test', 'pendiente'), ('t0000006@ejemplo.test', 'activo') $$,
  'la lista muestra docentes activos y pendientes'
);
select throws_ok(
  $$ select public.quitar_docente('docente.uno@ejemplo.test') $$,
  '23503', 'tiene_secciones', 'no se quita a un docente que todavía tiene secciones'
);
select lives_ok($$ select public.quitar_docente('t0000006@ejemplo.test') $$, 'se quita el rol a un docente sin secciones');
reset role;

select is(
  (select rol::text from public.perfiles where correo = 't0000006@ejemplo.test'), 'estudiante',
  'al quitarlo vuelve a ser estudiante'
);

-- Al ingresar por primera vez, la docente autorizada nace con rol docente.
insert into auth.users (instance_id, id, aud, role, email) values
  ('00000000-0000-0000-0000-000000000000', 'd0000000-0000-4000-8000-000000000099', 'authenticated', 'authenticated',
   'nueva.docente@ejemplo.test');
select is(
  (select rol::text from public.perfiles where correo = 'nueva.docente@ejemplo.test'), 'docente',
  'una docente autorizada recibe su rol en su primer ingreso'
);

select pg_temp.como(:doc1);
set local role authenticated;
select throws_ok(
  $$ select public.autorizar_docente('otra@ejemplo.test') $$,
  '42501', 'solo_administrador', 'un docente no puede autorizar docentes'
);
reset role;

select * from finish();
rollback;
