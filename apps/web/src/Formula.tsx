import katex from 'katex';
import { useMemo } from 'react';

/** Muestra una fórmula LaTeX con KaTeX. Todas las fórmulas de la plataforma pasan por aquí. */
export function Formula({ tex, bloque = false }: { tex: string; bloque?: boolean }) {
  const html = useMemo(
    () => katex.renderToString(tex, { displayMode: bloque, throwOnError: false, strict: 'warn' }),
    [tex, bloque],
  );
  const Etiqueta = bloque ? 'div' : 'span';
  return <Etiqueta className="formula" dangerouslySetInnerHTML={{ __html: html }} />;
}
