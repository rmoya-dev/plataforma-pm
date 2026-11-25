import { useState } from 'react';

/**
 * Aviso de privacidad (Ley 29733).
 * BORRADOR: el texto definitivo lo aporta la responsable con la Universidad (docs/BACKLOG.md).
 */
export function AvisoPrivacidad({ onAceptar, onSalir }: { onAceptar: () => Promise<void>; onSalir: () => void }) {
  const [acepto, setAcepto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function continuar() {
    setGuardando(true);
    setError(null);
    try {
      await onAceptar();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar. Inténtalo de nuevo.');
      setGuardando(false);
    }
  }

  return (
    <section className="tarjeta" aria-labelledby="titulo-aviso">
      <p className="etiqueta-borrador">Borrador pendiente de aprobación por la Universidad</p>
      <h2 id="titulo-aviso">Aviso de privacidad</h2>
      <p>Para usar la plataforma del curso de Pensamiento Matemático guardamos solo lo necesario:</p>
      <ul>
        <li>tu nombre y tu correo institucional, que vienen de tu cuenta de la Universidad;</li>
        <li>tu carrera, para el duelo por equipos;</li>
        <li>tu avance en las actividades y tus respuestas.</li>
      </ul>
      <p>
        Tu docente ve tu nombre, tu correo y tu avance. Tus compañeros solo ven tu nombre y la inicial de tu apellido en
        el ranking; nunca tu correo.
      </p>
      <p>Puedes pedir a tu docente que corrija tus datos.</p>

      <label className="casilla">
        <input type="checkbox" checked={acepto} onChange={(e) => setAcepto(e.target.checked)} />
        <span>Leí el aviso y acepto el uso de mis datos para las actividades del curso.</span>
      </label>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="acciones">
        <button
          type="button"
          className="boton boton-principal"
          disabled={!acepto || guardando}
          onClick={() => void continuar()}
        >
          {guardando ? 'Guardando…' : 'Continuar'}
        </button>
        <button type="button" className="boton" onClick={onSalir}>
          No acepto, salir
        </button>
      </div>
    </section>
  );
}
