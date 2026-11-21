import { expect, test } from '@playwright/test';

test('la portada carga sin errores, sin LaTeX crudo y sin desbordes', async ({ page }) => {
  const errores: string[] = [];
  page.on('pageerror', (e) => errores.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') errores.push(`console: ${m.text()}`);
  });

  await page.goto('/');

  await expect(page).toHaveTitle('Plataforma PM');
  await expect(page.getByRole('heading', { level: 1, name: 'Plataforma PM' })).toBeVisible();
  await expect(page.getByTestId('estado-servidor')).not.toHaveText('Consultando el servidor…');

  // La fórmula se renderizó con KaTeX.
  await expect(page.locator('.formula .katex').first()).toBeVisible();

  // LaTeX crudo: comandos de LaTeX o signos de dólar visibles fuera de KaTeX.
  const crudo = await page.evaluate(() => {
    const c = document.body.cloneNode(true) as HTMLElement;
    c.querySelectorAll('.katex, script, style').forEach((n) => n.remove());
    return (c.textContent ?? '').match(/\\[a-zA-Z]+|\$[^$\s][^$]*\$|\^/g) ?? [];
  });
  expect(crudo, 'LaTeX sin renderizar').toEqual([]);

  // Sin desplazamiento horizontal de la página.
  const desborde = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(desborde).toBeLessThanOrEqual(0);

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
