import { useState } from 'react';
import { NOMBRE_CARRERA, type Carrera } from '../datos.ts';

const OPCIONES: Carrera[] = ['derecho', 'psicologia', 'otra'];

export function ElegirCarrera({ onElegir }: { onElegir: (c: Carrera) => Promise<void> }) {
  const [carrera, setCarrera] = useState<Carrera | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirmar() {
    if (!carrera) return;
    setGuardando(true);
    setError(null);
    try {
      await onElegir(carrera);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar. Inténtalo de nuevo.');
      setGuardando(false);
    }
  }

  return (
    <section className="tarjeta" aria-labelledby="titulo-carrera">
      <h2 id="titulo-carrera">¿Qué carrera estudias?</h2>
      <p>La usamos para el duelo por equipos. Solo la eliges una vez; si te equivocas, avísale a tu docente.</p>
      <fieldset className="opciones">
        <legend className="solo-lector">Carrera</legend>
        {OPCIONES.map((c) => (
          <label key={c} className={`opcion ${carrera === c ? 'opcion-elegida' : ''}`}>
            <input type="radio" name="carrera" value={c} checked={carrera === c} onChange={() => setCarrera(c)} />
            <span>{NOMBRE_CARRERA[c]}</span>
          </label>
        ))}
      </fieldset>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <button
        type="button"
        className="boton boton-principal boton-ancho"
        disabled={!carrera || guardando}
        onClick={() => void confirmar()}
      >
        {guardando ? 'Guardando…' : 'Confirmar'}
      </button>
    </section>
  );
}
