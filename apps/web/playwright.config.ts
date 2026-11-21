import { defineConfig, devices } from '@playwright/test';

const PUERTO = 5173;

// Anchos que exige la definición de «terminado»: 320, 390 y 1200 px, en claro y oscuro.
const ANCHOS = [
  { nombre: 'movil-320', width: 320, height: 640, movil: true },
  { nombre: 'movil-390', width: 390, height: 844, movil: true },
  { nombre: 'escritorio-1200', width: 1200, height: 900, movil: false },
] as const;
const ESQUEMAS = ['light', 'dark'] as const;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PUERTO}`,
    trace: 'retain-on-failure',
    locale: 'es-PE',
  },
  projects: ANCHOS.flatMap((a) =>
    ESQUEMAS.map((esquema) => ({
      name: `${a.nombre}-${esquema === 'light' ? 'claro' : 'oscuro'}`,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: a.width, height: a.height },
        isMobile: a.movil,
        hasTouch: a.movil,
        colorScheme: esquema,
      },
    })),
  ),
  webServer: {
    command: 'npm run dev',
    url: `http://localhost:${PUERTO}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
