import { expect, test } from '@playwright/test';
import {
  aceptarAvisoSiAparece,
  borrarDocente,
  correoNuevo,
  crearDocente,
  HAY_SERVIDOR,
  ingresar,
  revisarPagina,
  SEMILLA,
  servidor,
  vigilarErrores,
} from './ayudas.ts';

test.describe('administración (H1)', () => {
  test.skip(!HAY_SERVIDOR && !process.env.CI, 'Necesita Supabase local y E2E_SUPABASE_SECRET_KEY en .env');

  test('la administradora crea un periodo y agrega y quita a un docente', async ({ page }) => {
    const errores = vigilarErrores(page);
    const admin = await crearDocente('administrador');
    const periodo = `P-${Date.now().toString(36)}`;
    const nuevoDocente = correoNuevo('e2e-nuevo-doc');
    try {
      await ingresar(page, admin.correo);
      await aceptarAvisoSiAparece(page);
      const nav = page.getByRole('navigation', { name: 'Administración' });
      await expect(nav).toBeVisible();

      // Periodos
      await nav.getByRole('button', { name: 'Periodos' }).click();
      await expect(page.getByRole('heading', { name: 'Periodos', level: 2 })).toBeVisible();
      await page.getByRole('textbox', { name: 'Nombre', exact: true }).fill(periodo);
      await page.getByLabel('Inicio', { exact: true }).fill('2031-03-01');
      await page.getByLabel('Fin', { exact: true }).fill('2031-02-01');
      await page.getByRole('button', { name: 'Crear periodo' }).click();
      await expect(page.getByRole('alert')).toContainText('posterior');
      await page.getByLabel('Fin', { exact: true }).fill('2031-07-31');
      await page.getByRole('button', { name: 'Crear periodo' }).click();
      await expect(page.getByRole('list', { name: 'Periodos' })).toContainText(periodo);
      await revisarPagina(page);

      // Docentes
      await nav.getByRole('button', { name: 'Docentes' }).click();
      await page.getByRole('textbox', { name: 'Correo del docente' }).fill(nuevoDocente);
      await page.getByRole('button', { name: 'Agregar docente' }).click();
      await expect(page.getByRole('status').filter({ hasText: 'cuando ingrese por primera vez' })).toBeVisible();
      const lista = page.getByRole('list', { name: 'Docentes' });
      const fila = lista.getByRole('listitem').filter({ hasText: nuevoDocente });
      await expect(fila).toContainText('Pendiente');
      await revisarPagina(page);

      page.once('dialog', (d) => void d.accept());
      await fila.getByRole('button', { name: 'Quitar' }).click();
      await expect(fila).toHaveCount(0);

      // Sus propias secciones siguen en la primera pestaña.
      await nav.getByRole('button', { name: 'Mis secciones' }).click();
      await expect(page.getByRole('list', { name: 'Mis secciones' })).toContainText(admin.seccion);
      expect(errores).toEqual([]);
    } finally {
      await borrarDocente(admin);
      await servidor(`/rest/v1/periodos?nombre=eq.${encodeURIComponent(periodo)}`, { method: 'DELETE' });
      await servidor(`/rest/v1/docentes_autorizados?correo=eq.${encodeURIComponent(nuevoDocente)}`, {
        method: 'DELETE',
      });
    }
  });

  test('la administradora cambia el periodo activo', async ({ page }, info) => {
    // Cambia un dato compartido: se prueba en un solo tamaño para no chocar con las otras ejecuciones en paralelo.
    test.skip(info.project.name !== 'escritorio-1200-claro', 'Solo en un tamaño');
    const admin = await crearDocente('administrador');
    const periodo = `Activo-${Date.now().toString(36)}`;
    const [creado] = (await servidor('/rest/v1/periodos', {
      method: 'POST',
      body: JSON.stringify({ nombre: periodo, inicio: '2032-03-01', fin: '2032-07-31' }),
    })) as { id: string }[];
    try {
      await ingresar(page, admin.correo);
      await aceptarAvisoSiAparece(page);
      await page.getByRole('navigation', { name: 'Administración' }).getByRole('button', { name: 'Periodos' }).click();
      const fila = page.getByRole('list', { name: 'Periodos' }).getByRole('listitem').filter({ hasText: periodo });
      await fila.getByRole('button', { name: 'Marcar como activo' }).click();
      await expect(fila).toContainText('Activo');
      await expect(page.getByText('Activo', { exact: true })).toHaveCount(1);
    } finally {
      // Deja la semilla como estaba: se borra el periodo de prueba y se reactiva el de la semilla.
      await servidor(`/rest/v1/periodos?id=eq.${creado?.id}`, { method: 'DELETE' });
      await servidor(`/rest/v1/periodos?id=eq.${SEMILLA.periodo}`, {
        method: 'PATCH',
        body: JSON.stringify({ activo: true }),
      });
      await borrarDocente(admin);
    }
  });
});
