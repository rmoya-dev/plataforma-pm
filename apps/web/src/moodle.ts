/**
 * Lectura del CSV de participantes exportado de Moodle.
 *
 * Moodle exporta el correo y los nombres (a veces en «Nombre» y «Apellido(s)», a veces en un solo campo) y,
 * si el aula los tiene, los grupos. Los encabezados pueden venir en español o en inglés y el separador puede ser
 * coma, punto y coma (Excel en español) o tabulación. Todo se procesa en el navegador; al servidor solo viajan
 * correo, nombre y grupo.
 */

import { correoPermitido } from './datos.ts';

export const MAXIMO_FILAS = 500;

export interface FilaMoodle {
  correo: string;
  nombres: string;
  grupo: string | null;
}

export interface Problema {
  linea: number;
  motivo: string;
}

export type LecturaMoodle = { ok: true; filas: FilaMoodle[]; problemas: Problema[] } | { ok: false; error: string };

/** Quita tildes y espacios extra para comparar encabezados. */
function normalizar(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

/** Elige el separador que más aparece fuera de comillas en la primera línea. */
function detectarSeparador(primeraLinea: string): string {
  const conteo: Record<string, number> = { ',': 0, ';': 0, '\t': 0 };
  let entreComillas = false;
  for (const c of primeraLinea) {
    if (c === '"') entreComillas = !entreComillas;
    else if (!entreComillas && c in conteo) conteo[c] = (conteo[c] ?? 0) + 1;
  }
  return Object.entries(conteo).sort((a, b) => b[1] - a[1])[0]?.[0] ?? ',';
}

/** CSV según RFC 4180: comillas dobles, comillas escapadas ("") y saltos de línea dentro de comillas. */
export function partirCsv(texto: string, separador: string): string[][] {
  const filas: string[][] = [];
  let fila: string[] = [];
  let campo = '';
  let entreComillas = false;

  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (entreComillas) {
      if (c === '"') {
        if (texto[i + 1] === '"') {
          campo += '"';
          i++;
        } else {
          entreComillas = false;
        }
      } else {
        campo += c;
      }
    } else if (c === '"') {
      entreComillas = true;
    } else if (c === separador) {
      fila.push(campo);
      campo = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && texto[i + 1] === '\n') i++;
      fila.push(campo);
      filas.push(fila);
      fila = [];
      campo = '';
    } else {
      campo += c;
    }
  }
  if (campo !== '' || fila.length > 0) {
    fila.push(campo);
    filas.push(fila);
  }
  return filas;
}

interface Columnas {
  correo: number;
  nombreCompleto: number;
  nombres: number;
  apellidos: number;
  grupo: number;
}

function ubicarColumnas(encabezados: string[]): Columnas {
  const h = encabezados.map(normalizar);
  const buscar = (prueba: (x: string) => boolean) => h.findIndex(prueba);
  return {
    correo: buscar((x) => x.includes('correo') || x.includes('email') || x.includes('e-mail') || x === 'mail'),
    nombreCompleto: buscar((x) => x === 'nombre completo' || x === 'full name' || x === 'nombres y apellidos'),
    nombres: buscar((x) => x === 'nombre' || x === 'nombres' || x === 'first name' || x === 'firstname'),
    apellidos: buscar((x) => x.startsWith('apellido') || x === 'surname' || x === 'last name' || x === 'lastname'),
    grupo: buscar((x) => x.startsWith('grupo') || x === 'group' || x === 'groups'),
  };
}

export function leerCsvMoodle(texto: string, dominios: readonly string[]): LecturaMoodle {
  // Excel antepone una marca de orden de bytes (BOM, U+FEFF) al guardar en UTF-8.
  const limpio = texto.charCodeAt(0) === 0xfeff ? texto.slice(1) : texto;
  const primera = limpio.split(/\r?\n/, 1)[0] ?? '';
  if (!primera.trim()) return { ok: false, error: 'El archivo está vacío.' };

  const filas = partirCsv(limpio, detectarSeparador(primera));
  const [encabezados = [], ...datos] = filas;
  const col = ubicarColumnas(encabezados);
  if (col.correo < 0) {
    return {
      ok: false,
      error: 'No encontramos la columna del correo. Exporta la lista de Moodle incluyendo el correo.',
    };
  }

  const leidas: FilaMoodle[] = [];
  const problemas: Problema[] = [];
  const vistos = new Set<string>();
  const celda = (fila: string[], i: number) => (i >= 0 ? (fila[i] ?? '').trim() : '');

  datos.forEach((fila, i) => {
    const linea = i + 2; // la 1 es el encabezado
    if (fila.every((c) => c.trim() === '')) return;
    const correo = celda(fila, col.correo).toLowerCase();
    if (!correo) {
      problemas.push({ linea, motivo: 'sin correo' });
      return;
    }
    if (!correoPermitido(correo, dominios)) {
      problemas.push({ linea, motivo: `${correo}: no es un correo institucional` });
      return;
    }
    if (vistos.has(correo)) {
      problemas.push({ linea, motivo: `${correo}: repetido en el archivo` });
      return;
    }
    vistos.add(correo);
    const nombres =
      celda(fila, col.nombreCompleto) ||
      [celda(fila, col.nombres), celda(fila, col.apellidos)].filter(Boolean).join(' ');
    leidas.push({ correo, nombres, grupo: celda(fila, col.grupo) || null });
  });

  if (leidas.length > MAXIMO_FILAS) {
    return {
      ok: false,
      error: `El archivo tiene ${leidas.length} estudiantes; el máximo por sección es ${MAXIMO_FILAS}.`,
    };
  }
  return { ok: true, filas: leidas, problemas };
}
