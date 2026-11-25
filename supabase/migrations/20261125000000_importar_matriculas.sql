-- H1 · Importación de la lista de Moodle a una sección.
-- Reversión: supabase/rollbacks/20261125000000_importar_matriculas.down.sql
--
-- La docente sube el CSV en el navegador; aquí se valida y se carga fila por fila. Devuelve qué pasó con cada
-- correo para que la docente lo vea:
--   agregado              matriculado en esta sección
--   ya_estaba             ya estaba en esta sección (se actualizan nombre y grupo de Moodle)
--   en_otra_seccion       ya está en otra sección del mismo periodo (un estudiante, una sección: no se mueve)
--   dominio_no_permitido  el correo no es institucional

create function public.importar_matriculas(p_seccion uuid, p_filas jsonb)
returns table (correo_fila text, resultado text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_periodo uuid;
  v_fila jsonb;
  v_correo text;
  v_actual uuid;
begin
  if not (public.dicta_seccion(p_seccion) or public.es_admin()) then
    raise exception 'sin_permiso' using errcode = '42501';
  end if;
  if jsonb_typeof(p_filas) is distinct from 'array' or jsonb_array_length(p_filas) > 500 then
    raise exception 'filas_invalidas' using errcode = '22023';
  end if;

  select s.periodo_id into v_periodo from public.secciones s where s.id = p_seccion;

  for v_fila in select value from jsonb_array_elements(p_filas) loop
    v_correo := lower(trim(coalesce(v_fila ->> 'correo', '')));
    correo_fila := v_correo;

    if not public.dominio_permitido(v_correo) then
      resultado := 'dominio_no_permitido';
      return next;
      continue;
    end if;

    select m.seccion_id into v_actual
    from public.matriculas m
    where m.periodo_id = v_periodo and m.correo = v_correo;

    if v_actual is null then
      insert into public.matriculas (seccion_id, periodo_id, correo, nombres_moodle, grupo_moodle, origen)
      values (
        p_seccion, v_periodo, v_correo,
        nullif(left(trim(v_fila ->> 'nombres'), 160), ''),
        nullif(left(trim(v_fila ->> 'grupo'), 80), ''),
        'moodle'
      );
      resultado := 'agregado';
    elsif v_actual = p_seccion then
      update public.matriculas m
      set nombres_moodle = coalesce(nullif(left(trim(v_fila ->> 'nombres'), 160), ''), m.nombres_moodle),
          grupo_moodle = coalesce(nullif(left(trim(v_fila ->> 'grupo'), 80), ''), m.grupo_moodle)
      where m.periodo_id = v_periodo and m.correo = v_correo;
      resultado := 'ya_estaba';
    else
      resultado := 'en_otra_seccion';
    end if;
    return next;
  end loop;
end;
$$;

comment on function public.importar_matriculas(uuid, jsonb) is
  'Carga la lista de Moodle en una sección de la docente. Máximo 500 filas por llamada.';

revoke all on function public.importar_matriculas(uuid, jsonb) from public, anon, authenticated;
grant execute on function public.importar_matriculas(uuid, jsonb) to authenticated;

insert into public.meta_esquema (version, descripcion) values (3, 'Importación de la lista de Moodle (H1)');
