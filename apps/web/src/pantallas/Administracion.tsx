import type { SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState, type FormEvent } from 'react';
import {
  activarPeriodo,
  autorizarDocente,
  correoPermitido,
  crearPeriodo,
  listarDocentes,
  pareceCorreoDeEstudiante,
  periodosCompletos,
  quitarDocente,
  type DocenteListado,
  type PeriodoCompleto,
  type ResultadoAutorizacion,
} from '../datos.ts';
import { DOMINIOS_PERMITIDOS } from '../supabase.ts';

function mensajeDe(e: unknown, porDefecto: string): string {
  return e instanceof Error ? e.message : porDefecto;
}

const FECHA = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const fecha = (iso: string) => FECHA.format(new Date(`${iso}T00:00:00Z`));

// ---------------------------------------------------------------- Periodos

export function Periodos({ sb }: { sb: SupabaseClient }) {
  const [periodos, setPeriodos] = useState<PeriodoCompleto[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const recargar = () => setVersion((v) => v + 1);

  useEffect(() => {
    let vivo = true;
    periodosCompletos(sb).then(
      (p) => {
        if (!vivo) return;
        setPeriodos(p);
        setError(null);
      },
      (e: unknown) => {
        if (vivo) setError(mensajeDe(e, 'No se pudieron cargar los periodos.'));
      },
    );
    return () => {
      vivo = false;
    };
  }, [sb, version]);

  async function activar(p: PeriodoCompleto) {
    try {
      await activarPeriodo(sb, p.id);
      recargar();
    } catch (e) {
      setError(mensajeDe(e, 'No se pudo activar el periodo.'));
    }
  }

  return (
    <>
      <section className="tarjeta" aria-labelledby="titulo-periodos">
        <h2 id="titulo-periodos">Periodos</h2>
        <p className="nota">
          El periodo activo es el que se propone al crear secciones. Solo puede haber uno activo a la vez.
        </p>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        {periodos === null ? (
          <p>Cargando…</p>
        ) : periodos.length === 0 ? (
          <p>Todavía no hay periodos.</p>
        ) : (
          <ul className="lista" aria-label="Periodos">
            {periodos.map((p) => (
              <li key={p.id} className="lista-item">
                <span className="lista-titulo">
                  {p.nombre} {p.activo && <span className="insignia">Activo</span>}
                </span>
                <span className="nota">
                  {fecha(p.inicio)} – {fecha(p.fin)}
                </span>
                {!p.activo && (
                  <div className="acciones">
                    <button type="button" className="boton" onClick={() => void activar(p)}>
                      Marcar como activo
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
      <NuevoPeriodo sb={sb} onCreado={recargar} />
    </>
  );
}

function NuevoPeriodo({ sb, onCreado }: { sb: SupabaseClient; onCreado: () => void }) {
  const [nombre, setNombre] = useState('');
  const [inicio, setInicio] = useState('');
  const [fin, setFin] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ ok: boolean; texto: string } | null>(null);

  async function crear(e: FormEvent) {
    e.preventDefault();
    if (fin <= inicio) {
      setMensaje({ ok: false, texto: 'La fecha de fin debe ser posterior a la de inicio.' });
      return;
    }
    setGuardando(true);
    setMensaje(null);
    try {
      await crearPeriodo(sb, { nombre, inicio, fin });
      setMensaje({ ok: true, texto: `Periodo «${nombre.trim()}» creado.` });
      setNombre('');
      setInicio('');
      setFin('');
      onCreado();
    } catch (err) {
      setMensaje({ ok: false, texto: mensajeDe(err, 'No se pudo crear el periodo.') });
    } finally {
      setGuardando(false);
    }
  }

  return (
    <section className="tarjeta" aria-labelledby="titulo-nuevo-periodo">
      <h3 id="titulo-nuevo-periodo">Nuevo periodo</h3>
      <form onSubmit={(e) => void crear(e)}>
        <label htmlFor="periodo-nombre" className="etiqueta">
          Nombre
        </label>
        <input
          id="periodo-nombre"
          className="campo"
          placeholder="Por ejemplo, 2027-I"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          maxLength={40}
          required
        />
        <div className="fila-campos">
          <div>
            <label htmlFor="periodo-inicio" className="etiqueta">
              Inicio
            </label>
            <input
              id="periodo-inicio"
              className="campo"
              type="date"
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="periodo-fin" className="etiqueta">
              Fin
            </label>
            <input
              id="periodo-fin"
              className="campo"
              type="date"
              value={fin}
              onChange={(e) => setFin(e.target.value)}
              required
            />
          </div>
        </div>
        {mensaje && (
          <p className={mensaje.ok ? 'exito' : 'error'} role={mensaje.ok ? 'status' : 'alert'}>
            {mensaje.texto}
          </p>
        )}
        <button
          type="submit"
          className="boton boton-principal boton-ancho"
          disabled={guardando || !nombre.trim() || !inicio || !fin}
        >
          {guardando ? 'Creando…' : 'Crear periodo'}
        </button>
      </form>
    </section>
  );
}

// ---------------------------------------------------------------- Docentes

const TEXTO_AUTORIZACION: Record<ResultadoAutorizacion, string> = {
  asignado: 'ya tiene cuenta: desde ahora es docente.',
  invitado: 'será docente cuando ingrese por primera vez.',
  ya_era_docente: 'ya era docente.',
};

export function Docentes({ sb }: { sb: SupabaseClient }) {
  const [docentes, setDocentes] = useState<DocenteListado[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const recargar = () => setVersion((v) => v + 1);

  useEffect(() => {
    let vivo = true;
    listarDocentes(sb).then(
      (d) => {
        if (!vivo) return;
        setDocentes(d);
        setError(null);
      },
      (e: unknown) => {
        if (vivo) setError(mensajeDe(e, 'No se pudo cargar la lista de docentes.'));
      },
    );
    return () => {
      vivo = false;
    };
  }, [sb, version]);

  async function quitar(d: DocenteListado) {
    if (!window.confirm(`¿Quitar el acceso de docente a ${d.nombre || d.correo}?`)) return;
    try {
      await quitarDocente(sb, d.correo);
      recargar();
    } catch (e) {
      setError(mensajeDe(e, 'No se pudo quitar al docente.'));
    }
  }

  return (
    <>
      <section className="tarjeta" aria-labelledby="titulo-docentes">
        <h2 id="titulo-docentes">Docentes</h2>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        {docentes === null ? (
          <p>Cargando…</p>
        ) : docentes.length === 0 ? (
          <p>Todavía no hay docentes.</p>
        ) : (
          <ul className="lista" aria-label="Docentes">
            {docentes.map((d) => (
              <li key={d.correo} className="lista-item">
                <span className="lista-titulo">{d.nombre || d.correo}</span>
                {d.nombre && <span className="nota correo">{d.correo}</span>}
                <span className="nota">
                  {d.estado === 'pendiente'
                    ? 'Pendiente: aún no ingresa'
                    : `${d.secciones} ${d.secciones === 1 ? 'sección' : 'secciones'}`}
                </span>
                <div className="acciones">
                  <button type="button" className="boton" onClick={() => void quitar(d)}>
                    Quitar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <AutorizarDocente sb={sb} onAutorizado={recargar} />
    </>
  );
}

function AutorizarDocente({ sb, onAutorizado }: { sb: SupabaseClient; onAutorizado: () => void }) {
  const [correo, setCorreo] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ ok: boolean; texto: string } | null>(null);
  const dominio = DOMINIOS_PERMITIDOS[0] ?? 'continental.edu.pe';

  async function autorizar(e: FormEvent) {
    e.preventDefault();
    const limpio = correo.trim().toLowerCase();
    if (!correoPermitido(limpio, DOMINIOS_PERMITIDOS)) {
      setMensaje({ ok: false, texto: `Usa un correo institucional (@${dominio}).` });
      return;
    }
    if (
      pareceCorreoDeEstudiante(limpio) &&
      !window.confirm('Ese correo tiene forma de correo de estudiante (DNI). ¿Seguro que es de un docente?')
    ) {
      return;
    }
    setGuardando(true);
    setMensaje(null);
    try {
      const r = await autorizarDocente(sb, limpio);
      setMensaje({ ok: true, texto: `${limpio} ${TEXTO_AUTORIZACION[r]}` });
      setCorreo('');
      onAutorizado();
    } catch (err) {
      setMensaje({ ok: false, texto: mensajeDe(err, 'No se pudo autorizar.') });
    } finally {
      setGuardando(false);
    }
  }

  return (
    <section className="tarjeta" aria-labelledby="titulo-autorizar">
      <h3 id="titulo-autorizar">Agregar docente</h3>
      <p className="nota">
        Escribe su correo institucional. Si todavía no ha ingresado, será docente en cuanto ingrese por primera vez.
      </p>
      <form onSubmit={(e) => void autorizar(e)}>
        <label htmlFor="docente-correo" className="etiqueta">
          Correo del docente
        </label>
        <input
          id="docente-correo"
          className="campo"
          type="email"
          inputMode="email"
          autoComplete="off"
          placeholder={`nombre@${dominio}`}
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        {mensaje && (
          <p className={mensaje.ok ? 'exito' : 'error'} role={mensaje.ok ? 'status' : 'alert'}>
            {mensaje.texto}
          </p>
        )}
        <button type="submit" className="boton boton-principal boton-ancho" disabled={guardando || !correo.trim()}>
          {guardando ? 'Guardando…' : 'Agregar docente'}
        </button>
      </form>
    </section>
  );
}
