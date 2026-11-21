/**
 * Cálculo de XP de una certificación.
 *
 * Reproduce la regla vigente del motor antiguo (`legacy/fuente-tiempo/app_tp.js`
 * y `legacy/backend/Code.gs`, `countProgress_`): 10 XP por reto resuelto y 25 XP
 * de bono por cada fase completa. Los retos resueltos por encima del total de la
 * fase no cuentan. Las rondas relámpago se suman aparte.
 */

export const XP_POR_RETO = 10;
export const XP_BONO_FASE = 25;

/** Cantidad de retos de cada fase, por clave de fase. */
export type TotalesPorFase = Readonly<Record<string, number>>;

/** Retos resueltos por fase: clave de fase → claves de reto resueltas. */
export type RetosResueltos = Readonly<Record<string, ReadonlySet<string> | readonly string[]>>;

export interface ResumenAvance {
  retos: number;
  totalRetos: number;
  fasesCompletas: number;
  totalFases: number;
  xp: number;
  xpMaximo: number;
}

function cantidad(valor: ReadonlySet<string> | readonly string[] | undefined): number {
  if (!valor) return 0;
  return valor instanceof Set ? valor.size : new Set(valor).size;
}

export function resumirAvance(totales: TotalesPorFase, resueltos: RetosResueltos): ResumenAvance {
  let retos = 0;
  let totalRetos = 0;
  let fasesCompletas = 0;
  const fases = Object.entries(totales);

  for (const [fase, total] of fases) {
    if (!Number.isInteger(total) || total < 0) {
      throw new RangeError(`Total inválido para la fase «${fase}»: ${total}`);
    }
    const hechos = Math.min(cantidad(resueltos[fase]), total);
    retos += hechos;
    totalRetos += total;
    if (hechos >= total) fasesCompletas += 1;
  }

  return {
    retos,
    totalRetos,
    fasesCompletas,
    totalFases: fases.length,
    xp: retos * XP_POR_RETO + fasesCompletas * XP_BONO_FASE,
    xpMaximo: totalRetos * XP_POR_RETO + fases.length * XP_BONO_FASE,
  };
}
