import { expect, type Page } from '@playwright/test';

// Valores de Supabase LOCAL (ver .env.example). Nunca apuntan a staging ni a producción.
export const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? '';
const CLAVE_SECRETA = process.env.E2E_SUPABASE_SECRET_KEY ?? '';
const MAILPIT_URL = process.env.E2E_MAILPIT_URL ?? 'http://127.0.0.1:55624';

/** Las pruebas de acceso necesitan Supabase local levantado y la clave secreta local en .env. */
export const HAY_SERVIDOR = SUPABASE_URL.startsWith('http://127.0.0.1') && CLAVE_SECRETA !== '';

/** IDs de la semilla ficticia (supabase/seed.sql). */
export const SEMILLA = {
  periodo: 'b0000000-0000-4000-8000-000000000001',
  seccionA: 'c0000000-0000-4000-8000-000000000001',
  nombreSeccionA: 'Sección A (prueba)',
  docenteUno: 'docente.uno@ejemplo.test',
} as const;

/** Correo ficticio único para cada prueba. */
export function correoNuevo(prefijo: string): string {
  return `${prefijo}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}@ejemplo.test`;
}

/** Operación con la clave secreta local (prepara o limpia datos de prueba; se salta la RLS). */
export async function servidor(ruta: string, init: RequestInit = {}): Promise<unknown> {
  const r = await fetch(`${SUPABASE_URL}${ruta}`, {
    ...init,
    headers: {
      apikey: CLAVE_SECRETA,
      Authorization: `Bearer ${CLAVE_SECRETA}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...init.headers,
    },
  });
  if (!r.ok) throw new Error(`${init.method ?? 'GET'} ${ruta}: ${r.status} ${await r.text()}`);
  const texto = await r.text();
  return texto ? JSON.parse(texto) : null;
}

export async function matricular(correo: string, seccionId: string = SEMILLA.seccionA): Promise<void> {
  await servidor('/rest/v1/matriculas', {
    method: 'POST',
    body: JSON.stringify({ seccion_id: seccionId, periodo_id: SEMILLA.periodo, correo, origen: 'manual' }),
  });
}

export interface DocentePrueba {
  id: string;
  correo: string;
  seccion: string;
}

/**
 * Crea una docente ficticia propia de la prueba, con una sección suya.
 * (Cada prueba usa su cuenta: si varias pidieran enlace para la misma cuenta a la vez, se invalidarían entre sí.)
 */
export async function crearDocente(): Promise<DocentePrueba> {
  const correo = correoNuevo('e2e-doc');
  const usuario = (await servidor('/auth/v1/admin/users', {
    method: 'POST',
    body: JSON.stringify({
      email: correo,
      email_confirm: true,
      user_metadata: { given_name: 'Docente', family_name: 'Prueba' },
    }),
  })) as { id: string };
  await servidor(`/rest/v1/perfiles?id=eq.${usuario.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ rol: 'docente' }),
  });
  const seccion = `Propia ${correo.slice(8, 20)}`;
  await servidor('/rest/v1/secciones', {
    method: 'POST',
    body: JSON.stringify({ periodo_id: SEMILLA.periodo, docente_id: usuario.id, nombre: seccion }),
  });
  return { id: usuario.id, correo, seccion };
}

export async function borrarDocente(d: DocentePrueba): Promise<void> {
  await servidor(`/rest/v1/secciones?docente_id=eq.${d.id}`, { method: 'DELETE' });
  await servidor(`/auth/v1/admin/users/${d.id}`, { method: 'DELETE' });
}

/** Espera el correo con el enlace de ingreso en Mailpit y devuelve el enlace. */
async function enlaceDeIngreso(correo: string): Promise<string> {
  let enlace = '';
  await expect
    .poll(
      async () => {
        const r = await fetch(`${MAILPIT_URL}/api/v1/search?query=${encodeURIComponent(`to:"${correo}"`)}`);
        const { messages } = (await r.json()) as { messages: { ID: string }[] };
        const id = messages[0]?.ID;
        if (!id) return '';
        const m = (await (await fetch(`${MAILPIT_URL}/api/v1/message/${id}`)).json()) as { HTML: string; Text: string };
        const coincidencia = /https?:\/\/[^\s"'<>]+\/auth\/v1\/verify[^\s"'<>]+/.exec(m.HTML || m.Text);
        enlace = coincidencia ? coincidencia[0].replaceAll('&amp;', '&') : '';
        return enlace;
      },
      { timeout: 15_000, message: `no llegó el correo de ingreso a ${correo}` },
    )
    .not.toBe('');
  return enlace;
}

/** Ingresa con el enlace por correo, como lo haría una persona. */
export async function ingresar(page: Page, correo: string): Promise<void> {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Correo institucional', exact: true }).fill(correo);
  await page.getByRole('button', { name: 'Enviarme un enlace' }).click();
  await expect(page.getByText('Revisa tu correo.')).toBeVisible();
  await page.goto(await enlaceDeIngreso(correo));
}

/** Acepta el aviso de privacidad si aparece (las cuentas de la semilla pueden haberlo aceptado antes). */
export async function aceptarAvisoSiAparece(page: Page): Promise<void> {
  const titulo = page.getByRole('heading', { name: 'Aviso de privacidad' });
  const siguiente = page.getByRole('heading', { name: /^Hola,|^¿Qué carrera|^Todavía no estás/ });
  await expect(titulo.or(siguiente).first()).toBeVisible();
  if (await titulo.isVisible()) {
    await page.getByRole('checkbox', { name: /Leí el aviso/ }).check();
    await page.getByRole('button', { name: 'Continuar' }).click();
  }
}

/** Revisa que no haya desplazamiento horizontal ni LaTeX sin renderizar. */
export async function revisarPagina(page: Page): Promise<void> {
  const desborde = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(desborde, 'desplazamiento horizontal').toBeLessThanOrEqual(0);
  const crudo = await page.evaluate(() => {
    const c = document.body.cloneNode(true) as HTMLElement;
    c.querySelectorAll('.katex, script, style').forEach((n) => n.remove());
    return (c.textContent ?? '').match(/\\[a-zA-Z]+|\$[^$\s][^$]*\$|\^/g) ?? [];
  });
  expect(crudo, 'LaTeX sin renderizar').toEqual([]);
}

/** Junta los errores de consola y de página para comprobar que no haya ninguno. */
export function vigilarErrores(page: Page): string[] {
  const errores: string[] = [];
  page.on('pageerror', (e) => errores.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') errores.push(`console: ${m.text()}`);
  });
  return errores;
}
