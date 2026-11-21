-- H1 · Identidad, roles, periodos, secciones y matrículas.
-- Diseño: docs/MODELO_DATOS.md. Reversión: supabase/rollbacks/20261121010000_identidad_y_secciones.down.sql
--
-- Principios:
--   * El correo contiene el DNI (DNI@continental.edu.pe): nunca se expone a otros estudiantes.
--   * Cada docente ve solo sus secciones; el estudiante solo lo suyo; la administradora todo.
--   * Un estudiante tiene como máximo una matrícula por periodo.

-- ---------------------------------------------------------------------------
-- Tipos
-- ---------------------------------------------------------------------------
create type public.rol as enum ('administrador', 'docente', 'estudiante');
create type public.carrera as enum ('derecho', 'psicologia', 'otra');

-- ---------------------------------------------------------------------------
-- Tablas
-- ---------------------------------------------------------------------------
create table public.dominios_permitidos (
  dominio text primary key check (dominio = lower(dominio) and position('@' in dominio) = 0)
);
comment on table public.dominios_permitidos is 'Dominios de correo con los que se puede crear una cuenta.';

create table public.perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  correo text not null unique check (correo = lower(correo)),
  nombres text not null default '',
  apellidos text not null default '',
  rol public.rol not null default 'estudiante',
  carrera public.carrera,
  consentimiento_en timestamptz,
  creado_en timestamptz not null default now()
);
comment on table public.perfiles is 'Una fila por cuenta. El correo es sensible (contiene el DNI).';

create table public.periodos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  inicio date not null,
  fin date not null,
  activo boolean not null default false,
  check (fin > inicio)
);

create table public.secciones (
  id uuid primary key default gen_random_uuid(),
  periodo_id uuid not null references public.periodos (id) on delete restrict,
  docente_id uuid not null references public.perfiles (id) on delete restrict,
  nombre text not null check (length(trim(nombre)) > 0),
  creado_en timestamptz not null default now(),
  unique (periodo_id, nombre),
  unique (id, periodo_id)
);
create index secciones_docente_idx on public.secciones (docente_id);

create table public.matriculas (
  id uuid primary key default gen_random_uuid(),
  seccion_id uuid not null,
  periodo_id uuid not null,
  correo text not null check (correo = lower(correo) and position('@' in correo) > 1),
  estudiante_id uuid references public.perfiles (id) on delete set null,
  nombres_moodle text,
  grupo_moodle text,
  origen text not null default 'manual' check (origen in ('moodle', 'manual')),
  creado_en timestamptz not null default now(),
  -- La sección y el periodo deben coincidir.
  foreign key (seccion_id, periodo_id) references public.secciones (id, periodo_id) on delete cascade on update cascade,
  -- Una sola sección por periodo (decisión de la responsable, 21/11/2026).
  unique (periodo_id, correo)
);
create index matriculas_seccion_idx on public.matriculas (seccion_id);
create index matriculas_estudiante_idx on public.matriculas (estudiante_id);

-- ---------------------------------------------------------------------------
-- Funciones auxiliares de autorización (no exponen datos)
-- ---------------------------------------------------------------------------
create function public.mi_rol()
returns public.rol
language sql stable security definer set search_path = ''
as $$ select rol from public.perfiles where id = auth.uid(); $$;

create function public.es_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$ select coalesce(public.mi_rol() = 'administrador', false); $$;

create function public.es_docente()
returns boolean
language sql stable security definer set search_path = ''
as $$ select coalesce(public.mi_rol() = 'docente', false); $$;

create function public.dicta_seccion(p_seccion uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.secciones where id = p_seccion and docente_id = auth.uid()); $$;

create function public.esta_matriculado(p_seccion uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.matriculas where seccion_id = p_seccion and estudiante_id = auth.uid()); $$;

create function public.es_mi_estudiante(p_estudiante uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1
    from public.matriculas m
    join public.secciones s on s.id = m.seccion_id
    where m.estudiante_id = p_estudiante and s.docente_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- Alta de cuentas
-- ---------------------------------------------------------------------------
create function public.dominio_permitido(p_correo text)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.dominios_permitidos
    where dominio = lower(split_part(p_correo, '@', 2))
  ) and position('@' in coalesce(p_correo, '')) > 1;
$$;

-- Hook de Supabase Auth «before user created»: rechaza dominios no permitidos con un mensaje claro.
create function public.hook_antes_de_crear_usuario(event jsonb)
returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
begin
  if public.dominio_permitido(event -> 'user' ->> 'email') then
    return '{}'::jsonb;
  end if;
  return jsonb_build_object(
    'error', jsonb_build_object(
      'http_code', 403,
      'message', 'Usa tu correo institucional para ingresar.'
    )
  );
end;
$$;

-- Al crearse la cuenta: segunda verificación de dominio (por si el hook estuviera apagado),
-- creación del perfil y enlace con las matrículas que la docente ya cargó.
create function public.al_crear_usuario()
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

create trigger al_crear_usuario
  after insert on auth.users
  for each row execute function public.al_crear_usuario();

-- Al cargar una matrícula de alguien que ya tiene cuenta, se enlaza en el acto.
create function public.enlazar_matricula()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  new.correo := lower(trim(new.correo));
  if new.estudiante_id is null or tg_op = 'UPDATE' and new.correo is distinct from old.correo then
    new.estudiante_id := (select id from public.perfiles where correo = new.correo);
  end if;
  return new;
end;
$$;

create trigger enlazar_matricula
  before insert or update on public.matriculas
  for each row execute function public.enlazar_matricula();

-- ---------------------------------------------------------------------------
-- Reglas de negocio que RLS no cubre
-- ---------------------------------------------------------------------------
-- La sección solo puede pertenecer a una cuenta con rol docente o administrador.
create function public.validar_docente_de_seccion()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.perfiles where id = new.docente_id and rol in ('docente', 'administrador')
  ) then
    raise exception 'docente_no_valido' using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger validar_docente_de_seccion
  before insert or update of docente_id on public.secciones
  for each row execute function public.validar_docente_de_seccion();

-- Carrera: el estudiante la elige una sola vez; después solo la corrigen su docente o la administradora.
-- El consentimiento solo lo da la propia persona.
create function public.proteger_perfil()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if auth.uid() is null then
    return new; -- servidor / migraciones
  end if;
  if new.consentimiento_en is distinct from old.consentimiento_en and auth.uid() <> old.id then
    raise exception 'consentimiento_ajeno' using errcode = '42501';
  end if;
  if new.carrera is distinct from old.carrera
     and auth.uid() = old.id
     and old.carrera is not null
     and not public.es_admin() then
    raise exception 'carrera_ya_elegida' using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger proteger_perfil
  before update on public.perfiles
  for each row execute function public.proteger_perfil();

-- ---------------------------------------------------------------------------
-- Operaciones de la administradora
-- ---------------------------------------------------------------------------
create function public.asignar_rol(p_correo text, p_rol public.rol)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.es_admin() then
    raise exception 'solo_administrador' using errcode = '42501';
  end if;
  if lower(p_correo) = (select correo from public.perfiles where id = auth.uid()) then
    raise exception 'no_puedes_cambiar_tu_propio_rol' using errcode = '42501';
  end if;
  update public.perfiles set rol = p_rol where correo = lower(p_correo);
  if not found then
    raise exception 'cuenta_no_encontrada' using errcode = 'P0002';
  end if;
end;
$$;

-- Nombres para el ranking de una sección: solo «Nombre I.», nunca correo ni apellido completo (D18).
create function public.ranking_nombres(p_seccion uuid)
returns table (estudiante_id uuid, nombre_ranking text)
language sql stable security definer set search_path = ''
as $$
  select p.id,
         trim(split_part(trim(p.nombres), ' ', 1)
              || case when trim(p.apellidos) <> '' then ' ' || upper(left(trim(p.apellidos), 1)) || '.' else '' end)
  from public.matriculas m
  join public.perfiles p on p.id = m.estudiante_id
  where m.seccion_id = p_seccion
    and (public.esta_matriculado(p_seccion) or public.dicta_seccion(p_seccion) or public.es_admin());
$$;

-- ---------------------------------------------------------------------------
-- Seguridad por fila
-- ---------------------------------------------------------------------------
alter table public.dominios_permitidos enable row level security;
alter table public.perfiles enable row level security;
alter table public.periodos enable row level security;
alter table public.secciones enable row level security;
alter table public.matriculas enable row level security;

-- dominios_permitidos: solo la administradora.
create policy dominios_admin on public.dominios_permitidos
  for all to authenticated using (public.es_admin()) with check (public.es_admin());

-- perfiles
create policy perfiles_leer on public.perfiles
  for select to authenticated
  using (id = auth.uid() or public.es_admin() or public.es_mi_estudiante(id));
create policy perfiles_editar on public.perfiles
  for update to authenticated
  using (id = auth.uid() or public.es_admin() or public.es_mi_estudiante(id))
  with check (id = auth.uid() or public.es_admin() or public.es_mi_estudiante(id));

-- periodos
create policy periodos_leer on public.periodos
  for select to authenticated using (true);
create policy periodos_admin on public.periodos
  for all to authenticated using (public.es_admin()) with check (public.es_admin());

-- secciones
create policy secciones_leer on public.secciones
  for select to authenticated
  using (public.es_admin() or docente_id = auth.uid() or public.esta_matriculado(id));
create policy secciones_crear on public.secciones
  for insert to authenticated
  with check (public.es_admin() or (public.es_docente() and docente_id = auth.uid()));
create policy secciones_editar on public.secciones
  for update to authenticated
  using (public.es_admin() or docente_id = auth.uid())
  with check (public.es_admin() or docente_id = auth.uid());
create policy secciones_borrar on public.secciones
  for delete to authenticated
  using (public.es_admin() or docente_id = auth.uid());

-- matriculas
create policy matriculas_leer on public.matriculas
  for select to authenticated
  using (public.es_admin() or public.dicta_seccion(seccion_id) or estudiante_id = auth.uid());
create policy matriculas_gestionar on public.matriculas
  for all to authenticated
  using (public.es_admin() or public.dicta_seccion(seccion_id))
  with check (public.es_admin() or public.dicta_seccion(seccion_id));

-- ---------------------------------------------------------------------------
-- Permisos de columnas y funciones
-- ---------------------------------------------------------------------------
-- Nadie anónimo toca estas tablas.
revoke all on public.dominios_permitidos, public.perfiles, public.periodos, public.secciones, public.matriculas from anon;

-- perfiles: por la API solo se pueden cambiar la carrera y el consentimiento (el rol, con asignar_rol).
revoke insert, update, delete on public.perfiles from authenticated;
grant select on public.perfiles to authenticated;
grant update (carrera, consentimiento_en) on public.perfiles to authenticated;

-- Funciones: nada público por defecto.
revoke all on function
  public.mi_rol(), public.es_admin(), public.es_docente(), public.dicta_seccion(uuid),
  public.esta_matriculado(uuid), public.es_mi_estudiante(uuid), public.dominio_permitido(text),
  public.hook_antes_de_crear_usuario(jsonb), public.al_crear_usuario(), public.enlazar_matricula(),
  public.validar_docente_de_seccion(), public.proteger_perfil(),
  public.asignar_rol(text, public.rol), public.ranking_nombres(uuid)
  from public, anon, authenticated;

grant execute on function
  public.mi_rol(), public.es_admin(), public.es_docente(), public.dicta_seccion(uuid),
  public.esta_matriculado(uuid), public.es_mi_estudiante(uuid),
  public.asignar_rol(text, public.rol), public.ranking_nombres(uuid)
  to authenticated;

grant execute on function public.hook_antes_de_crear_usuario(jsonb) to supabase_auth_admin;

-- ---------------------------------------------------------------------------
-- Datos de configuración
-- ---------------------------------------------------------------------------
insert into public.dominios_permitidos (dominio) values ('continental.edu.pe');

insert into public.meta_esquema (version, descripcion)
values (2, 'Identidad, roles, periodos, secciones y matrículas (H1)');
