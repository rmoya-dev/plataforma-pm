import type { SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState, type FormEvent } from 'react';
import {
  crearSeccion,
  nombreCorto,
  periodos as cargarPeriodos,
  seccionesDocente,
  type Perfil,
  type Periodo,
  type SeccionConConteo,
} from '../datos.ts';
import { SeccionDetalle } from './SeccionDetalle.tsx';

export function InicioDocente({ sb, perfil }: { sb: SupabaseClient; perfil: Perfil }) {
  const [secciones, setSecciones] = useState<SeccionConConteo[] | null>(null);
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const recargar = () => setVersion((v) => v + 1);

  useEffect(() => {
    let vivo = true;
    Promise.all([seccionesDocente(sb, perfil.id), cargarPeriodos(sb)]).then(
      ([s, p]) => {
        if (!vivo) return;
        setSecciones(s);
        setPeriodos(p);
        setError(null);
      },
      (e: unknown) => {
        if (vivo) setError(e instanceof Error ? e.message : 'No se pudieron cargar tus secciones.');
      },
    );
    return () => {
      vivo = false;
    };
  }, [sb, perfil.id, version]);

  const [abierta, setAbierta] = useState<SeccionConConteo | null>(null);
  const nombrePeriodo = (id: string) => periodos.find((p) => p.id === id)?.nombre ?? '';

  if (abierta) {
    return (
      <SeccionDetalle
        sb={sb}
        seccion={abierta}
        onVolver={() => {
          setAbierta(null);
          recargar();
        }}
      />
    );
  }

  return (
    <>
      <section className="tarjeta" aria-labelledby="titulo-docente">
        <h2 id="titulo-docente">Hola, {nombreCorto(perfil)}</h2>
        <p className="nota">{perfil.rol === 'administrador' ? 'Administradora' : 'Docente'}</p>
        <h3>Mis secciones</h3>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        {secciones === null ? (
          <p>Cargando…</p>
        ) : secciones.length === 0 ? (
          <p>Todavía no tienes secciones. Crea la primera abajo.</p>
        ) : (
          <ul className="lista" aria-label="Mis secciones">
            {secciones.map((s) => (
              <li key={s.id}>
                <button type="button" className="lista-item lista-boton" onClick={() => setAbierta(s)}>
                  <span className="lista-titulo">{s.nombre}</span>
                  <span className="nota">
                    {nombrePeriodo(s.periodo_id)} · {s.estudiantes} {s.estudiantes === 1 ? 'estudiante' : 'estudiantes'}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <NuevaSeccion sb={sb} perfil={perfil} periodos={periodos} onCreada={recargar} />
    </>
  );
}

function NuevaSeccion({
  sb,
  perfil,
  periodos,
  onCreada,
}: {
  sb: SupabaseClient;
  perfil: Perfil;
  periodos: Periodo[];
  onCreada: () => void;
}) {
  const [nombre, setNombre] = useState('');
  const [periodoId, setPeriodoId] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ ok: boolean; texto: string } | null>(null);

  const elegido = periodoId || periodos.find((p) => p.activo)?.id || periodos[0]?.id || '';

  async function crear(e: FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !elegido) return;
    setGuardando(true);
    setMensaje(null);
    try {
      await crearSeccion(sb, { periodo_id: elegido, docente_id: perfil.id, nombre });
      setMensaje({ ok: true, texto: `Sección «${nombre.trim()}» creada.` });
      setNombre('');
      onCreada();
    } catch (err) {
      setMensaje({ ok: false, texto: err instanceof Error ? err.message : 'No se pudo crear la sección.' });
    } finally {
      setGuardando(false);
    }
  }

  if (periodos.length === 0) {
    return (
      <section className="tarjeta">
        <h3>Nueva sección</h3>
        <p className="nota">Todavía no hay periodos. La administradora debe crear el periodo del semestre.</p>
      </section>
    );
  }

  return (
    <section className="tarjeta" aria-labelledby="titulo-nueva">
      <h3 id="titulo-nueva">Nueva sección</h3>
      <form onSubmit={(e) => void crear(e)}>
        <label htmlFor="periodo" className="etiqueta">
          Periodo
        </label>
        <select id="periodo" className="campo" value={elegido} onChange={(e) => setPeriodoId(e.target.value)}>
          {periodos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
        <label htmlFor="nombre-seccion" className="etiqueta">
          Nombre de la sección
        </label>
        <input
          id="nombre-seccion"
          className="campo"
          placeholder="Por ejemplo, NRC o «Derecho A»"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          maxLength={80}
          required
        />
        {mensaje && (
          <p className={mensaje.ok ? 'exito' : 'error'} role={mensaje.ok ? 'status' : 'alert'}>
            {mensaje.texto}
          </p>
        )}
        <button type="submit" className="boton boton-principal" disabled={guardando || !nombre.trim()}>
          {guardando ? 'Creando…' : 'Crear sección'}
        </button>
      </form>
    </section>
  );
}
