import { expect, test } from '@playwright/test';
import {
  aceptarAvisoSiAparece,
  borrarDocente,
  crearDocente,
  correoNuevo,
  HAY_SERVIDOR,
  ingresar,
  matricular,
  revisarPagina,
  SEMILLA,
  vigilarErrores,
} from './ayudas.ts';

test.describe('acceso (H1)', () => {
  // En la CI nunca se saltan: si falta el servidor, deben fallar.
  test.skip(!HAY_SERVIDOR && !process.env.CI, 'Necesita Supabase local y E2E_SUPABASE_SECRET_KEY en .env');

  test('rechaza un correo que no es institucional', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('textbox', { name: 'Correo institucional', exact: true }).fill('alguien@gmail.com');
    await page.getByRole('button', { name: 'Enviarme un enlace' }).click();
    await expect(page.getByRole('alert')).toContainText('Usa tu correo institucional');
  });

  test('estudiante matriculado: aviso, carrera y su sección', async ({ page }) => {
    const errores = vigilarErrores(page);
    const correo = correoNuevo('e2e-est');
    await matricular(correo);

    await ingresar(page, correo);

    await expect(page.getByRole('heading', { name: 'Aviso de privacidad' })).toBeVisible();
    await revisarPagina(page);
    const continuar = page.getByRole('button', { name: 'Continuar' });
    await expect(continuar).toBeDisabled();
    await page.getByRole('checkbox', { name: /Leí el aviso/ }).check();
    await continuar.click();

    await expect(page.getByRole('heading', { name: '¿Qué carrera estudias?' })).toBeVisible();
    await revisarPagina(page);
    await page.getByRole('radio', { name: 'Psicología' }).check();
    await page.getByRole('button', { name: 'Confirmar' }).click();

    await expect(page.getByRole('heading', { name: /^Hola,/ })).toBeVisible();
    await expect(page.getByText(SEMILLA.nombreSeccionA)).toBeVisible();
    await expect(page.getByText('Psicología')).toBeVisible();
    // El correo (que en producción contiene el DNI) no se muestra en pantalla.
    await expect(page.getByText(correo)).toHaveCount(0);
    await revisarPagina(page);

    // Al volver a entrar ya no se piden el aviso ni la carrera.
    await page.reload();
    await expect(page.getByRole('heading', { name: /^Hola,/ })).toBeVisible();

    await page.getByRole('button', { name: 'Salir' }).click();
    await expect(page.getByRole('heading', { name: 'Ingresa con tu correo institucional' })).toBeVisible();
    expect(errores).toEqual([]);
  });

  test('estudiante sin matrícula: se le pide hablar con su docente', async ({ page }) => {
    const errores = vigilarErrores(page);
    await ingresar(page, correoNuevo('e2e-sin'));
    await aceptarAvisoSiAparece(page);
    await page.getByRole('radio', { name: 'Derecho' }).check();
    await page.getByRole('button', { name: 'Confirmar' }).click();
    await expect(page.getByRole('heading', { name: 'Todavía no estás en ninguna sección' })).toBeVisible();
    await revisarPagina(page);
    expect(errores).toEqual([]);
  });

  test('docente: ve solo sus secciones y crea una nueva', async ({ page }) => {
    const errores = vigilarErrores(page);
    const docente = await crearDocente();
    const nombre = `Nueva ${docente.correo.slice(8, 20)}`;
    try {
      await ingresar(page, docente.correo);
      await aceptarAvisoSiAparece(page);

      const lista = page.getByRole('list', { name: 'Mis secciones' });
      await expect(lista).toContainText(docente.seccion);
      // Las secciones de otros docentes (semilla) no aparecen.
      await expect(lista).not.toContainText('Sección A (prueba)');
      await expect(lista).not.toContainText('Sección C (prueba)');
      await revisarPagina(page);

      await page.getByRole('textbox', { name: 'Nombre de la sección' }).fill(nombre);
      await page.getByRole('button', { name: 'Crear sección' }).click();
      await expect(page.getByRole('status').filter({ hasText: 'creada' })).toBeVisible();
      await expect(lista).toContainText(nombre);
      expect(errores).toEqual([]);
    } finally {
      await borrarDocente(docente);
    }
  });
});
