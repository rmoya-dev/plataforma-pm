-- H1 · Administración: un solo periodo activo y alta de docentes por correo (también antes de su primer ingreso).
-- Reversión: supabase/rollbacks/20261125010000_administracion.down.sql

-- ---------------------------------------------------------------------------
-- Periodos: como máximo uno activo
-- ---------------------------------------------------------------------------
create unique index periodos_un_solo_activo on public.periodos (activo) where activo;

create function public.activar_periodo(p_periodo uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.es_admin() then
    raise exception 'solo_administrador' using errcode = '42501';
  end if;
  if not exists (select 1 from public.periodos where id = p_periodo) then
    raise exception 'periodo_no_encontrado' using errcode = 'P0002';
  end if;
  update public.periodos set activo = false where activo and id <> p_periodo;
  update public.periodos set activo = true where id = p_periodo;
end;
$$;

-- ---------------------------------------------------------------------------
-- Docentes autorizados antes de su primer ingreso
-- ---------------------------------------------------------------------------
create table public.docentes_autorizados (
  correo text primary key check (correo = lower(correo) and position('@' in correo) > 1),
  autorizado_en timestamptz not null default now()
);
comment on table public.docentes_autorizados is
  'Correos que reciben el rol docente al crear su cuenta. Los gestiona la administradora.';

alter table public.docentes_autorizados enable row level security;
create policy docentes_autorizados_admin on public.docentes_autorizados
  for all to authenticated using (public.es_admin()) with check (public.es_admin());
revoke all on public.docentes_autorizados from anon;

-- Al crear la cuenta: igual que antes, pero si el correo está autorizado nace con rol docente.
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

  insert into public.perfiles (id, correo, nombres, apellidos, rol)
  values (
    new.id,
    v_correo,
    trim(coalesce(v_meta ->> 'given_name', v_meta ->> 'full_name', v_meta ->> 'name', '')),
    trim(coalesce(v_meta ->> 'family_name', '')),
    case when exists (select 1 from public.docentes_autorizados d where d.correo = v_correo)
         then 'docente'::public.rol else 'estudiante'::public.rol end
  );

  update public.matriculas set estudiante_id = new.id where correo = v_correo;
  return new;
end;
$$;

-- Autoriza a un docente por correo. Devuelve 'asignado' (ya tenía cuenta), 'invitado' (aún no ingresa)
-- o 'ya_era_docente'.
create function public.autorizar_docente(p_correo text)
returns text
language plpgsql security definer set search_path = ''
as $$
declare
  v_correo text := lower(trim(coalesce(p_correo, '')));
begin
  if not public.es_admin() then
    raise exception 'solo_administrador' using errcode = '42501';
  end if;
  if not public.dominio_permitido(v_correo) then
    raise exception 'dominio_no_permitido' using errcode = '22023';
  end if;

  insert into public.docentes_autorizados (correo) values (v_correo) on conflict do nothing;

  if exists (select 1 from public.perfiles where correo = v_correo and rol in ('docente', 'administrador')) then
    return 'ya_era_docente';
  end if;
  update public.perfiles set rol = 'docente' where correo = v_correo and rol = 'estudiante';
  if found then
    return 'asignado';
  end if;
  return 'invitado';
end;
$$;

-- Quita el rol docente (o la invitación). No se permite si todavía tiene secciones.
create function public.quitar_docente(p_correo text)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_correo text := lower(trim(coalesce(p_correo, '')));
begin
  if not public.es_admin() then
    raise exception 'solo_administrador' using errcode = '42501';
  end if;
  if exists (
    select 1 from public.secciones s join public.perfiles p on p.id = s.docente_id where p.correo = v_correo
  ) then
    raise exception 'tiene_secciones' using errcode = '23503';
  end if;
  delete from public.docentes_autorizados where correo = v_correo;
  update public.perfiles set rol = 'estudiante' where correo = v_correo and rol = 'docente';
end;
$$;

-- Lista para la pantalla de administración: docentes activos y autorizados pendientes.
create function public.listar_docentes()
returns table (correo text, nombre text, estado text, secciones integer)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.es_admin() then
    raise exception 'solo_administrador' using errcode = '42501';
  end if;
  return query
    select p.correo,
           trim(p.nombres || ' ' || p.apellidos),
           'activo'::text,
           (select count(*)::integer from public.secciones s where s.docente_id = p.id)
    from public.perfiles p
    where p.rol = 'docente'
    union all
    select d.correo, ''::text, 'pendiente'::text, 0
    from public.docentes_autorizados d
    where not exists (select 1 from public.perfiles p where p.correo = d.correo)
    order by 3, 2, 1;
end;
$$;

revoke all on function public.activar_periodo(uuid), public.autorizar_docente(text),
  public.quitar_docente(text), public.listar_docentes()
  from public, anon, authenticated;
grant execute on function public.activar_periodo(uuid), public.autorizar_docente(text),
  public.quitar_docente(text), public.listar_docentes()
  to authenticated;

insert into public.meta_esquema (version, descripcion)
values (4, 'Administración: periodo activo y docentes autorizados (H1)');
