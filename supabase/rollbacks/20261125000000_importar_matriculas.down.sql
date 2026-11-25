-- Revierte supabase/migrations/20261125000000_importar_matriculas.sql
delete from public.meta_esquema where version = 3;
drop function if exists public.importar_matriculas(uuid, jsonb);
