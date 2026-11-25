import type { SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState, type ChangeEvent } from 'react';
import {
  elegirCarrera,
  estudiantesDeSeccion,
  importarMatriculas,
  NOMBRE_CARRERA,
  quitarMatricula,
  type Carrera,
  type EstudianteSeccion,
  type ResultadoImportacion,
  type SeccionConConteo,
} from '../datos.ts';
import { leerCsvMoodle, type FilaMoodle, type Problema } from '../moodle.ts';
import { DOMINIOS_PERMITIDOS } from '../supabase.ts';

export function SeccionDetalle({
  sb,
  seccion,
  onVolver,
}: {
  sb: SupabaseClient;
  seccion: SeccionConConteo;
  onVolver: () => void;
}) {
  const [estudiantes, setEstudiantes] = useState<EstudianteSeccion[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const recargar = () => setVersion((v) => v + 1);

  useEffect(() => {
    let vivo = true;
    estudiantesDeSeccion(sb, seccion.id).then(
      (e) => {
        if (!vivo) return;
        setEstudiantes(e);
        setError(null);
      },
      (e: unknown) => {
        if (vivo) setError(e instanceof Error ? e.message : 'No se pudo cargar la lista.');
      },
    );
    return () => {
      vivo = false;
    };
  }, [sb, seccion.id, version]);

  async function cambiarCarrera(est: EstudianteSeccion, carrera: Carrera) {
    if (!est.estudianteId) return;
    try {
      await elegirCarrera(sb, est.estudianteId, carrera);
      recargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cambiar la carrera.');
    }
  }

  async function quitar(est: EstudianteSeccion) {
    if (!window.confirm(`¿Quitar a ${est.nombre} de la sección?`)) return;
    try {
      await quitarMatricula(sb, est.matriculaId);
      recargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo quitar al estudiante.');
    }
  }

  return (
    <>
      <button type="button" className="boton" onClick={onVolver}>
        ← Mis secciones
      </button>

      <section className="tarjeta" aria-labelledby="titulo-seccion">
        <h2 id="titulo-seccion">{seccion.nombre}</h2>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <h3>Estudiantes {estudiantes && `(${estudiantes.length})`}</h3>
        {estudiantes === null ? (
          <p>Cargando…</p>
        ) : estudiantes.length === 0 ? (
          <p>Todavía no hay estudiantes. Importa la lista de Moodle.</p>
        ) : (
          <ul className="lista" aria-label="Estudiantes de la sección">
            {estudiantes.map((est) => (
              <li key={est.matriculaId} className="lista-item">
                <span className="lista-titulo">{est.nombre}</span>
                <span className="nota correo">{est.correo}</span>
                <span className="nota">
                  {est.estudianteId ? 'Ya ingresó' : 'Aún no ingresa'}
                  {est.grupo && ` · ${est.grupo}`}
                </span>
                <div className="acciones">
                  {est.estudianteId && (
                    <label className="nota">
                      Carrera{' '}
                      <select
                        className="campo campo-corto"
                        value={est.carrera ?? ''}
                        onChange={(e) => void cambiarCarrera(est, e.target.value as Carrera)}
                        aria-label={`Carrera de ${est.nombre}`}
                      >
                        {!est.carrera && (
                          <option value="" disabled>
                            Sin elegir
                          </option>
                        )}
                        {(Object.keys(NOMBRE_CARRERA) as Carrera[]).map((c) => (
                          <option key={c} value={c}>
                            {NOMBRE_CARRERA[c]}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  <button type="button" className="boton" onClick={() => void quitar(est)}>
                    Quitar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ImportarMoodle sb={sb} seccionId={seccion.id} onImportado={recargar} />
    </>
  );
}

const TEXTO_RESULTADO: Record<ResultadoImportacion, string> = {
  agregado: 'agregados',
  ya_estaba: 'ya estaban en la sección',
  en_otra_seccion: 'están en otra sección de este periodo (no se movieron)',
  dominio_no_permitido: 'no tienen correo institucional',
};

type EstadoImportacion =
  | { tipo: 'inicio' }
  | { tipo: 'error'; mensaje: string }
  | { tipo: 'vista'; archivo: string; filas: FilaMoodle[]; problemas: Problema[] }
  | { tipo: 'importando' }
  | { tipo: 'hecho'; resultados: { correo: string; resultado: ResultadoImportacion }[] };

function ImportarMoodle({
  sb,
  seccionId,
  onImportado,
}: {
  sb: SupabaseClient;
  seccionId: string;
  onImportado: () => void;
}) {
  const [estado, setEstado] = useState<EstadoImportacion>({ tipo: 'inicio' });

  async function leerArchivo(e: ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    e.target.value = '';
    if (!archivo) return;
    if (archivo.size > 2_000_000) {
      setEstado({ tipo: 'error', mensaje: 'El archivo es demasiado grande (máximo 2 MB).' });
      return;
    }
    const lectura = leerCsvMoodle(await archivo.text(), DOMINIOS_PERMITIDOS);
    setEstado(
      lectura.ok
        ? { tipo: 'vista', archivo: archivo.name, filas: lectura.filas, problemas: lectura.problemas }
        : { tipo: 'error', mensaje: lectura.error },
    );
  }

  async function importar(filas: FilaMoodle[]) {
    setEstado({ tipo: 'importando' });
    try {
      const resultados = await importarMatriculas(sb, seccionId, filas);
      setEstado({ tipo: 'hecho', resultados });
      onImportado();
    } catch (e) {
      setEstado({ tipo: 'error', mensaje: e instanceof Error ? e.message : 'No se pudo importar la lista.' });
    }
  }

  return (
    <section className="tarjeta" aria-labelledby="titulo-importar">
      <h3 id="titulo-importar">Importar lista de Moodle</h3>
      <p className="nota">
        Descarga desde Moodle la lista de participantes de tu aula en formato CSV. Debe incluir el correo; el nombre y
        el grupo son opcionales. El archivo se lee en tu navegador.
      </p>
      <label htmlFor="archivo-moodle" className="etiqueta">
        Archivo CSV de Moodle
      </label>
      <input
        id="archivo-moodle"
        className="campo"
        type="file"
        accept=".csv,text/csv"
        onChange={(e) => void leerArchivo(e)}
        disabled={estado.tipo === 'importando'}
      />

      {estado.tipo === 'error' && (
        <p className="error" role="alert">
          {estado.mensaje}
        </p>
      )}

      {estado.tipo === 'vista' && (
        <div className="aviso" role="status">
          <p>
            <strong>{estado.filas.length}</strong> estudiantes listos para importar desde «{estado.archivo}».
          </p>
          {estado.problemas.length > 0 && (
            <>
              <p>Se omitirán {estado.problemas.length} filas:</p>
              <ul className="nota">
                {estado.problemas.slice(0, 10).map((p) => (
                  <li key={p.linea}>
                    Línea {p.linea}: {p.motivo}
                  </li>
                ))}
                {estado.problemas.length > 10 && <li>… y {estado.problemas.length - 10} más.</li>}
              </ul>
            </>
          )}
          <div className="acciones">
            <button
              type="button"
              className="boton boton-principal"
              disabled={estado.filas.length === 0}
              onClick={() => void importar(estado.filas)}
            >
              Importar {estado.filas.length} estudiantes
            </button>
            <button type="button" className="boton" onClick={() => setEstado({ tipo: 'inicio' })}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {estado.tipo === 'importando' && <p role="status">Importando…</p>}

      {estado.tipo === 'hecho' && <ResumenImportacion resultados={estado.resultados} />}
    </section>
  );
}

function ResumenImportacion({ resultados }: { resultados: { correo: string; resultado: ResultadoImportacion }[] }) {
  const grupos = (Object.keys(TEXTO_RESULTADO) as ResultadoImportacion[])
    .map((r) => ({ r, correos: resultados.filter((x) => x.resultado === r).map((x) => x.correo) }))
    .filter((g) => g.correos.length > 0);
  return (
    <div className="aviso aviso-ok" role="status">
      <p>
        <strong>Importación terminada.</strong>
      </p>
      <ul>
        {grupos.map((g) => (
          <li key={g.r}>
            {g.correos.length} {TEXTO_RESULTADO[g.r]}
            {g.r === 'en_otra_seccion' && <span className="nota correo">: {g.correos.join(', ')}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
