import { expect, test } from '@playwright/test';
import {
  aceptarAvisoSiAparece,
  borrarDocente,
  correoNuevo,
  crearDocente,
  HAY_SERVIDOR,
  ingresar,
  revisarPagina,
  vigilarErrores,
} from './ayudas.ts';

test.describe('importar lista de Moodle (H1)', () => {
  test.skip(!HAY_SERVIDOR && !process.env.CI, 'Necesita Supabase local y E2E_SUPABASE_SECRET_KEY en .env');

  test('la docente importa el CSV, ve el resumen y puede quitar a un estudiante', async ({ page }) => {
    const errores = vigilarErrores(page);
    const docente = await crearDocente();
    const uno = correoNuevo('e2e-imp1');
    const dos = correoNuevo('e2e-imp2');
    // Formato de Moodle en español (punto y coma), con datos ficticios.
    const csv = [
      'Nombre;Apellido(s);Dirección de correo;Grupos',
      `Uno;Importado;${uno.toUpperCase()};G1`,
      `Dos;Importado;${dos};`,
      'Tres;Externo;tres@gmail.com;',
      `Uno;Importado;${uno};G1`,
      'Elena;Ficticia;t0000005@ejemplo.test;', // ya está en la Sección C de la semilla
    ].join('\r\n');

    try {
      await ingresar(page, docente.correo);
      await aceptarAvisoSiAparece(page);
      await page.getByRole('button', { name: new RegExp(docente.seccion) }).click();
      await expect(page.getByRole('heading', { name: docente.seccion })).toBeVisible();
      await expect(page.getByText('Todavía no hay estudiantes')).toBeVisible();

      await page.getByLabel('Archivo CSV de Moodle', { exact: true }).setInputFiles({
        name: 'participantes.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from('﻿' + csv, 'utf8'),
      });
      await expect(page.getByText('estudiantes listos para importar')).toContainText('3');
      await expect(page.getByText('Se omitirán 2 filas')).toBeVisible();
      await revisarPagina(page);

      await page.getByRole('button', { name: 'Importar 3 estudiantes' }).click();
      const resumen = page.getByRole('status').filter({ hasText: 'Importación terminada' });
      await expect(resumen).toContainText('2 agregados');
      await expect(resumen).toContainText('1 están en otra sección');

      const lista = page.getByRole('list', { name: 'Estudiantes de la sección' });
      await expect(lista.getByRole('listitem')).toHaveCount(2);
      await expect(lista).toContainText('Uno Importado');
      await expect(lista).toContainText('Aún no ingresa');
      await expect(lista).toContainText('G1');
      await expect(lista).not.toContainText('t0000005@ejemplo.test');
      await revisarPagina(page);

      page.once('dialog', (d) => void d.accept());
      await lista
        .getByRole('listitem')
        .filter({ hasText: 'Dos Importado' })
        .getByRole('button', { name: 'Quitar' })
        .click();
      await expect(lista.getByRole('listitem')).toHaveCount(1);

      await page.getByRole('button', { name: '← Mis secciones' }).click();
      await expect(page.getByRole('list', { name: 'Mis secciones' })).toContainText('1 estudiante');
      expect(errores).toEqual([]);
    } finally {
      await borrarDocente(docente);
    }
  });
});
