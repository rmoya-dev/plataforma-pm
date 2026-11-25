-- Revierte supabase/migrations/20261125010000_administracion.sql
delete from public.meta_esquema where version = 4;

drop function if exists public.listar_docentes();
drop function if exists public.quitar_docente(text);
drop function if exists public.autorizar_docente(text);
drop function if exists public.activar_periodo(uuid);

-- Versión anterior de al_crear_usuario (20261121010000_identidad_y_secciones.sql).
create or replace function public.al_crear_usuario()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  v_correo text := lower(new.email);
  v_meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  if not public.dominio_permitido(v_correo) then
    raise exception 'dominio_no_permitido' using errcode = '42501';
  end if;

  insert into public.perfiles (id, correo, nombres, apellidos)
  values (
    new.id,
    v_correo,
    trim(coalesce(v_meta ->> 'given_name', v_meta ->> 'full_name', v_meta ->> 'name', '')),
    trim(coalesce(v_meta ->> 'family_name', ''))
  );

  update public.matriculas set estudiante_id = new.id where correo = v_correo;
  return new;
end;
$$;

drop table if exists public.docentes_autorizados;
drop index if exists public.periodos_un_solo_activo;
