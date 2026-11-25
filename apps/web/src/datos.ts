import type { SupabaseClient } from '@supabase/supabase-js';

export type Rol = 'administrador' | 'docente' | 'estudiante';
export type Carrera = 'derecho' | 'psicologia' | 'otra';

export const NOMBRE_CARRERA: Record<Carrera, string> = {
  derecho: 'Derecho',
  psicologia: 'Psicología',
  otra: 'Otra carrera',
};

export interface Perfil {
  id: string;
  nombres: string;
  apellidos: string;
  rol: Rol;
  carrera: Carrera | null;
  consentimiento_en: string | null;
}

export interface Periodo {
  id: string;
  nombre: string;
  activo: boolean;
}

export interface Seccion {
  id: string;
  nombre: string;
  periodo_id: string;
  docente_id: string;
}

export interface SeccionConConteo extends Seccion {
  estudiantes: number;
}

function falla(error: { message: string } | null): void {
  if (error) throw new Error(error.message);
}

/** Perfil de la persona con sesión. No se pide el correo: no hace falta en pantalla. */
export async function cargarPerfil(sb: SupabaseClient, id: string): Promise<Perfil | null> {
  const { data, error } = await sb
    .from('perfiles')
    .select('id, nombres, apellidos, rol, carrera, consentimiento_en')
    .eq('id', id)
    .maybeSingle();
  falla(error);
  return data as Perfil | null;
}

export async function darConsentimiento(sb: SupabaseClient, id: string): Promise<void> {
  const { error } = await sb.from('perfiles').update({ consentimiento_en: new Date().toISOString() }).eq('id', id);
  falla(error);
}

export async function elegirCarrera(sb: SupabaseClient, id: string, carrera: Carrera): Promise<void> {
  const { error } = await sb.from('perfiles').update({ carrera }).eq('id', id);
  falla(error);
}

/** Secciones visibles para la persona (la seguridad por fila decide cuáles). */
export async function misSecciones(sb: SupabaseClient): Promise<Seccion[]> {
  const { data, error } = await sb
    .from('secciones')
    .select('id, nombre, periodo_id, docente_id')
    .order('nombre', { ascending: true });
  falla(error);
  return (data ?? []) as Seccion[];
}

/** Secciones de la docente con cuántos estudiantes tiene cada una. */
export async function seccionesDocente(sb: SupabaseClient, docenteId: string): Promise<SeccionConConteo[]> {
  const { data, error } = await sb
    .from('secciones')
    .select('id, nombre, periodo_id, docente_id, matriculas(count)')
    .eq('docente_id', docenteId)
    .order('nombre', { ascending: true });
  falla(error);
  return ((data ?? []) as (Seccion & { matriculas: { count: number }[] })[]).map((s) => ({
    id: s.id,
    nombre: s.nombre,
    periodo_id: s.periodo_id,
    docente_id: s.docente_id,
    estudiantes: s.matriculas[0]?.count ?? 0,
  }));
}

export async function periodos(sb: SupabaseClient): Promise<Periodo[]> {
  const { data, error } = await sb.from('periodos').select('id, nombre, activo').order('inicio', { ascending: false });
  falla(error);
  return (data ?? []) as Periodo[];
}

export async function crearSeccion(
  sb: SupabaseClient,
  datos: { periodo_id: string; docente_id: string; nombre: string },
): Promise<void> {
  const { error } = await sb.from('secciones').insert({ ...datos, nombre: datos.nombre.trim() });
  if (error?.code === '23505') throw new Error('Ya existe una sección con ese nombre en el periodo.');
  falla(error);
}

/** Estudiante de una sección tal como lo ve su docente (la docente sí ve nombre completo y correo). */
export interface EstudianteSeccion {
  matriculaId: string;
  correo: string;
  nombre: string;
  grupo: string | null;
  estudianteId: string | null;
  carrera: Carrera | null;
}

export async function estudiantesDeSeccion(sb: SupabaseClient, seccionId: string): Promise<EstudianteSeccion[]> {
  const { data, error } = await sb
    .from('matriculas')
    .select('id, correo, nombres_moodle, grupo_moodle, estudiante_id, perfiles(nombres, apellidos, carrera)')
    .eq('seccion_id', seccionId);
  falla(error);
  type Fila = {
    id: string;
    correo: string;
    nombres_moodle: string | null;
    grupo_moodle: string | null;
    estudiante_id: string | null;
    perfiles: { nombres: string; apellidos: string; carrera: Carrera | null } | null;
  };
  return ((data ?? []) as unknown as Fila[])
    .map((f) => ({
      matriculaId: f.id,
      correo: f.correo,
      nombre:
        (f.perfiles ? `${f.perfiles.nombres} ${f.perfiles.apellidos}`.trim() : '') || f.nombres_moodle || f.correo,
      grupo: f.grupo_moodle,
      estudianteId: f.estudiante_id,
      carrera: f.perfiles?.carrera ?? null,
    }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
}

export type ResultadoImportacion = 'agregado' | 'ya_estaba' | 'en_otra_seccion' | 'dominio_no_permitido';

export async function importarMatriculas(
  sb: SupabaseClient,
  seccionId: string,
  filas: { correo: string; nombres: string; grupo: string | null }[],
): Promise<{ correo: string; resultado: ResultadoImportacion }[]> {
  const { data, error } = await sb.rpc('importar_matriculas', { p_seccion: seccionId, p_filas: filas });
  falla(error);
  return ((data ?? []) as { correo_fila: string; resultado: ResultadoImportacion }[]).map((r) => ({
    correo: r.correo_fila,
    resultado: r.resultado,
  }));
}

export async function quitarMatricula(sb: SupabaseClient, matriculaId: string): Promise<void> {
  const { error } = await sb.from('matriculas').delete().eq('id', matriculaId);
  falla(error);
}

/** «María Q.»: primer nombre e inicial del primer apellido (D18). */
export function nombreCorto(p: Pick<Perfil, 'nombres' | 'apellidos'>): string {
  const nombre = p.nombres.trim().split(/\s+/)[0] ?? '';
  const inicial = p.apellidos.trim().charAt(0).toUpperCase();
  return inicial ? `${nombre} ${inicial}.` : nombre;
}

/** Comprueba en el navegador que el correo sea de un dominio permitido (el servidor vuelve a verificarlo). */
export function correoPermitido(correo: string, dominios: readonly string[]): boolean {
  const c = correo.trim().toLowerCase();
  const [usuario, dominio, ...resto] = c.split('@');
  return !!usuario && !!dominio && resto.length === 0 && dominios.includes(dominio);
}
