import { describe, expect, it } from 'vitest';
import { resumirAvance } from './xp.ts';

// Totales de «Periodo de Tiempo» tal como están en legacy/backend/Code.gs (ACTIVITIES.tiempo.totals).
const TOTALES_TIEMPO = { despeja: 6, formula: 6, calcula: 6, duplica: 6, meta: 5, dictamen: 4 };

function todos(totales: Record<string, number>): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(totales).map(([fase, n]) => [fase, Array.from({ length: n }, (_, i) => `r${i + 1}`)]),
  );
}

describe('resumirAvance', () => {
  it('da 33 retos y 480 XP con «Periodo de Tiempo» completa (criterio de aceptación)', () => {
    const r = resumirAvance(TOTALES_TIEMPO, todos(TOTALES_TIEMPO));
    expect(r).toEqual({ retos: 33, totalRetos: 33, fasesCompletas: 6, totalFases: 6, xp: 480, xpMaximo: 480 });
  });

  it('empieza en cero sin avance', () => {
    const r = resumirAvance(TOTALES_TIEMPO, {});
    expect(r.xp).toBe(0);
    expect(r.xpMaximo).toBe(480);
  });

  it('suma el bono solo cuando la fase está completa', () => {
    const r = resumirAvance(TOTALES_TIEMPO, { despeja: ['a', 'b', 'c', 'd', 'e', 'f'], formula: ['a'] });
    expect(r.retos).toBe(7);
    expect(r.fasesCompletas).toBe(1);
    expect(r.xp).toBe(7 * 10 + 25);
  });

  it('no cuenta retos repetidos ni por encima del total de la fase', () => {
    const r = resumirAvance({ meta: 5 }, { meta: ['a', 'a', 'b', 'c', 'd', 'e', 'f', 'g'] });
    expect(r.retos).toBe(5);
    expect(r.xp).toBe(5 * 10 + 25);
  });

  it('rechaza totales inválidos', () => {
    expect(() => resumirAvance({ meta: -1 }, {})).toThrow(RangeError);
  });
});
