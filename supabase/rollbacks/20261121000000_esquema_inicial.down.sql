-- Revierte supabase/migrations/20261121000000_esquema_inicial.sql
drop function if exists public.version_esquema();
drop table if exists public.meta_esquema;
