-- Pruebas de H1 (docs/MODELO_DATOS.md, sección 6). Usan la semilla ficticia de supabase/seed.sql.
-- Para actuar como una persona: se fija su identificador en request.jwt.claims y se cambia al rol authenticated.
begin;
select plan(36);

-- Identificadores de la semilla
\set admin   '''a0000000-0000-4000-8000-000000000001'''
\set doc1    '''d0000000-0000-4000-8000-000000000001'''
\set doc2    '''d0000000-0000-4000-8000-000000000002'''
\set ana     '''e0000000-0000-4000-8000-000000000001'''
\set fabio   '''e0000000-0000-4000-8000-000000000006'''
\set secA    '''c0000000-0000-4000-8000-000000000001'''
\set secC    '''c0000000-0000-4000-8000-000000000003'''
\set periodo '''b0000000-0000-4000-8000-000000000001'''

create function pg_temp.como(p_id uuid) returns void language sql as $$
  select set_config('request.jwt.claims', json_build_object('sub', p_id, 'role', 'authenticated')::text, true);
$$;

-- ---------------------------------------------------------------- Alta de cuentas
select is((select count(*)::int from public.perfiles), 9, 'cada cuenta de la semilla tiene su perfil');
select is((select rol::text from public.perfiles where id = :ana), 'estudiante', 'el rol por defecto es estudiante');
select is(
  (select estudiante_id from public.matriculas where correo = 't0000007@ejemplo.test'), null,
  'una matrícula de Moodle sin cuenta queda sin enlazar'
);

select throws_ok(
  $$ insert into auth.users (instance_id, id, aud, role, email) values
     ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'alguien@gmail.com') $$,
  '42501', 'dominio_no_permitido', 'no se crea una cuenta de un dominio no permitido'
);
select is(
  public.hook_antes_de_crear_usuario('{"user":{"email":"alguien@gmail.com"}}') -> 'error' ->> 'http_code', '403',
  'el hook de Auth rechaza otros dominios'
);
select is(
  public.hook_antes_de_crear_usuario('{"user":{"email":"12345678@continental.edu.pe"}}'), '{}'::jsonb,
  'el hook de Auth acepta el dominio institucional'
);

insert into auth.users (instance_id, id, aud, role, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-000000000000', 'e0000000-0000-4000-8000-000000000007', 'authenticated', 'authenticated',
   'T0000007@ejemplo.test', '{"given_name":"Gina","family_name":"Nueva Siete"}');
select is(
  (select estudiante_id from public.matriculas where correo = 't0000007@ejemplo.test'),
  'e0000000-0000-4000-8000-000000000007'::uuid,
  'al iniciar sesión por primera vez, el estudiante queda enlazado a su matrícula (sin importar mayúsculas)'
);

select throws_ok(
  format($$ insert into public.matriculas (seccion_id, periodo_id, correo) values (%L, %L, 't0000001@ejemplo.test') $$,
         :secC, :periodo),
  '23505', null, 'un estudiante no puede estar en dos secciones del mismo periodo'
);

-- ---------------------------------------------------------------- Estudiante: Ana (sección A)
select pg_temp.como(:ana);
set local role authenticated;

select is((select count(*)::int from public.perfiles), 1, 'el estudiante solo ve su propio perfil');
select is(
  (select count(*)::int from public.perfiles where correo = 't0000002@ejemplo.test'), 0,
  'el estudiante no puede leer el correo de un compañero'
);
select is((select count(*)::int from public.matriculas), 1, 'el estudiante solo ve su matrícula');
select is((select count(*)::int from public.secciones), 1, 'el estudiante solo ve su sección');
select throws_ok(
  $$ update public.perfiles set rol = 'administrador' where id = auth.uid() $$,
  '42501', null, 'el estudiante no puede cambiar su rol'
);
select throws_ok(
  $$ update public.perfiles set correo = 'otro@ejemplo.test' where id = auth.uid() $$,
  '42501', null, 'el estudiante no puede cambiar su correo'
);
select throws_ok(
  $$ update public.perfiles set carrera = 'psicologia' where id = auth.uid() $$,
  '42501', 'carrera_ya_elegida', 'el estudiante no puede cambiar la carrera que ya eligió'
);
select results_eq(
  format('select nombre_ranking from public.ranking_nombres(%L) order by 1', :secA),
  $$ values ('Ana P.'), ('Bruno E.') $$,
  'el ranking de su sección muestra nombre e inicial'
);
select is(
  (select count(*)::int from public.ranking_nombres(:secC)), 0,
  'el estudiante no ve el ranking de otra sección'
);
select throws_ok(
  $$ select public.asignar_rol('t0000002@ejemplo.test', 'docente') $$,
  '42501', 'solo_administrador', 'un estudiante no puede asignar roles'
);
select throws_ok(
  format($$ insert into public.matriculas (seccion_id, periodo_id, correo) values (%L, %L, 'x@ejemplo.test') $$,
         :secA, :periodo),
  '42501', null, 'un estudiante no puede matricular a nadie'
);
reset role;

-- ---------------------------------------------------------------- Estudiante sin carrera: Fabio
select pg_temp.como(:fabio);
set local role authenticated;
select lives_ok(
  $$ update public.perfiles set carrera = 'derecho', consentimiento_en = now() where id = auth.uid() $$,
  'en su primer ingreso el estudiante elige su carrera y da su consentimiento'
);
reset role;

-- ---------------------------------------------------------------- Docente 1 (secciones A y B)
select pg_temp.como(:doc1);
set local role authenticated;

select is((select count(*)::int from public.secciones), 2, 'el docente ve solo sus dos secciones');
select is((select count(*)::int from public.secciones where id = :secC), 0, 'el docente no ve la sección de otro docente');
select is((select count(*)::int from public.matriculas), 4, 'el docente ve solo las matrículas de sus secciones');
select is((select count(*)::int from public.perfiles), 5, 'el docente ve su perfil y el de sus 4 estudiantes');
select is(
  (select count(*)::int from public.perfiles where correo = 't0000005@ejemplo.test'), 0,
  'el docente no ve a los estudiantes de otro docente'
);
select throws_ok(
  format($$ insert into public.matriculas (seccion_id, periodo_id, correo) values (%L, %L, 'z@ejemplo.test') $$,
         :secC, :periodo),
  '42501', null, 'el docente no puede matricular en la sección de otro'
);
select throws_ok(
  format($$ update public.secciones set docente_id = %L where id = %L $$, :doc2, :secA),
  '42501', null, 'el docente no puede pasar su sección a otro docente'
);
select lives_ok(
  format($$ update public.perfiles set carrera = 'otra' where id = %L $$, :ana),
  'el docente puede corregir la carrera de su estudiante'
);
select throws_ok(
  format($$ update public.perfiles set consentimiento_en = now() where id = %L $$, :ana),
  '42501', 'consentimiento_ajeno', 'el docente no puede dar el consentimiento por el estudiante'
);
select lives_ok(
  format($$ insert into public.secciones (periodo_id, docente_id, nombre) values (%L, %L, 'Nueva (prueba)') $$,
         :periodo, :doc1),
  'el docente puede crear una sección a su nombre'
);
select throws_ok(
  format($$ insert into public.secciones (periodo_id, docente_id, nombre) values (%L, %L, 'Ajena (prueba)') $$,
         :periodo, :doc2),
  '42501', null, 'el docente no puede crear secciones a nombre de otro'
);
reset role;

-- ---------------------------------------------------------------- Docente 2 (sección C)
select pg_temp.como(:doc2);
set local role authenticated;
select is((select count(*)::int from public.secciones), 1, 'el segundo docente ve solo su sección');
select is((select count(*)::int from public.perfiles), 4, 'el segundo docente ve su perfil y el de sus 3 estudiantes con cuenta');
reset role;

-- ---------------------------------------------------------------- Administradora
select pg_temp.como(:admin);
set local role authenticated;
select is((select count(*)::int from public.secciones), 4, 'la administradora ve todas las secciones');
select throws_ok(
  $$ select public.asignar_rol('admin@ejemplo.test', 'estudiante') $$,
  '42501', 'no_puedes_cambiar_tu_propio_rol', 'la administradora no puede quitarse su propio rol'
);
reset role;

-- ---------------------------------------------------------------- Visitante anónimo
set local role anon;
select throws_ok('select count(*) from public.perfiles', '42501', null, 'un visitante anónimo no puede leer perfiles');
reset role;

select * from finish();
rollback;
