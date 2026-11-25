import { expect, test } from '@playwright/test';
import { revisarPagina, vigilarErrores } from './ayudas.ts';

test('la pantalla de ingreso carga sin errores, sin LaTeX crudo y sin desbordes', async ({ page }) => {
  const errores = vigilarErrores(page);
  await page.goto('/');

  await expect(page).toHaveTitle('Plataforma PM');
  await expect(page.getByRole('heading', { level: 1, name: 'Plataforma PM' })).toBeVisible();
  await expect(page.getByTestId('estado-servidor')).not.toHaveText('Consultando el servidor…');

  await revisarPagina(page);
  expect(errores).toEqual([]);
});

test('el tamaño de letra se puede ajustar', async ({ page }) => {
  await page.goto('/');
  const boton = page.getByRole('button', { name: 'Cambiar tamaño de letra' });
  await expect(boton).toHaveText('Aa');
  await boton.click();
  await expect(boton).toHaveText('Aa+');
  await expect(page.locator('html')).toHaveAttribute('data-tamano', 'grande');
});
