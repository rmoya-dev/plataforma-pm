-- Pruebas de base de datos (pgTAP). Se ejecutan con `npx supabase test db`.
begin;
select plan(3);

select is(public.version_esquema(), 3, 'la versión del esquema es 3');

set local role anon;
select is(public.version_esquema(), 3, 'un visitante anónimo puede leer la versión');
-- RLS sin políticas: la consulta no falla, pero no devuelve ninguna fila.
select is_empty(
  'select * from public.meta_esquema',
  'un visitante anónimo no ve filas de la tabla'
);

select * from finish();
rollback;
