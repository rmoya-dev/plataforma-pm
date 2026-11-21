-- Revierte supabase/migrations/20261121010000_identidad_y_secciones.sql
delete from public.meta_esquema where version = 2;

drop trigger if exists al_crear_usuario on auth.users;

drop function if exists public.ranking_nombres(uuid);
drop function if exists public.asignar_rol(text, public.rol);

drop table if exists public.matriculas;
drop table if exists public.secciones;
drop table if exists public.periodos;
drop table if exists public.perfiles;
drop table if exists public.dominios_permitidos;

drop function if exists public.proteger_perfil();
drop function if exists public.validar_docente_de_seccion();
drop function if exists public.enlazar_matricula();
drop function if exists public.al_crear_usuario();
drop function if exists public.hook_antes_de_crear_usuario(jsonb);
drop function if exists public.dominio_permitido(text);
drop function if exists public.es_mi_estudiante(uuid);
drop function if exists public.esta_matriculado(uuid);
drop function if exists public.dicta_seccion(uuid);
drop function if exists public.es_docente();
drop function if exists public.es_admin();
drop function if exists public.mi_rol();

drop type if exists public.carrera;
drop type if exists public.rol;
