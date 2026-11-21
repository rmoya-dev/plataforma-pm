-- H0 · Esquema inicial (vacío).
-- Solo registra la versión del esquema para el contrato versionado entre front y servidor
-- (docs/PLATAFORMA_UNIFICADA.md, sección 5.1, punto 8). Las tablas del curso llegan en H1.
-- Reversión: supabase/rollbacks/20261121000000_esquema_inicial.down.sql

create table public.meta_esquema (
  version integer primary key check (version > 0),
  descripcion text not null,
  aplicada_en timestamptz not null default now()
);

comment on table public.meta_esquema is 'Versiones del esquema aplicadas. El front compara la mayor con la que necesita.';

-- Nadie lee la tabla directamente: RLS activada y sin políticas.
alter table public.meta_esquema enable row level security;

insert into public.meta_esquema (version, descripcion) values (1, 'Esquema inicial vacío (H0)');

create function public.version_esquema()
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(max(version), 0) from public.meta_esquema;
$$;

comment on function public.version_esquema() is 'Versión vigente del esquema. Pública: no expone datos.';

revoke all on function public.version_esquema() from public;
grant execute on function public.version_esquema() to anon, authenticated;
