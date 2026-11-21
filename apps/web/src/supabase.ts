import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const clavePublica = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

/** Cliente de Supabase, o `null` si faltan las variables de entorno (ver `.env.example`). */
export const supabase: SupabaseClient | null =
  url && clavePublica ? createClient(url, clavePublica, { auth: { persistSession: false } }) : null;

export type EstadoServidor =
  { tipo: 'sin-configurar' } | { tipo: 'sin-conexion'; detalle: string } | { tipo: 'conectado'; version: number };

/** Lee la versión del esquema que declara la base de datos (`public.version_esquema()`). */
export async function consultarServidor(): Promise<EstadoServidor> {
  if (!supabase) return { tipo: 'sin-configurar' };
  try {
    const { data, error } = await supabase.rpc('version_esquema');
    if (error) return { tipo: 'sin-conexion', detalle: error.message };
    return { tipo: 'conectado', version: Number(data) };
  } catch (e) {
    return { tipo: 'sin-conexion', detalle: e instanceof Error ? e.message : String(e) };
  }
}
