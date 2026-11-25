import { VERSION_ESQUEMA_REQUERIDA } from '@pm/engine';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { cargarPerfil, darConsentimiento, elegirCarrera, misSecciones, type Perfil, type Seccion } from './datos.ts';
import { AvisoPrivacidad } from './pantallas/AvisoPrivacidad.tsx';
import { ElegirCarrera } from './pantallas/ElegirCarrera.tsx';
import { InicioDocente } from './pantallas/InicioDocente.tsx';
import { InicioEstudiante } from './pantallas/InicioEstudiante.tsx';
import { Ingreso } from './pantallas/Ingreso.tsx';
import { SinMatricula } from './pantallas/SinMatricula.tsx';
import { useSesion } from './sesion.ts';
import { consultarServidor, supabase, type EstadoServidor } from './supabase.ts';

const TAMANOS = ['normal', 'grande', 'muy-grande'] as const;
type Tamano = (typeof TAMANOS)[number];
const ETIQUETA_TAMANO: Record<Tamano, string> = { normal: 'Aa', grande: 'Aa+', 'muy-grande': 'Aa++' };
const CLAVE_TAMANO = 'pm-tamano-letra';

function leerTamano(): Tamano {
  try {
    const v = localStorage.getItem(CLAVE_TAMANO);
    return TAMANOS.includes(v as Tamano) ? (v as Tamano) : 'normal';
  } catch {
    return 'normal';
  }
}

function TextoEstado({ estado }: { estado: EstadoServidor | null }) {
  if (!estado) return <>Consultando el servidor…</>;
  switch (estado.tipo) {
    case 'sin-configurar':
      return <>Servidor sin configurar: copia `.env.example` como `.env`.</>;
    case 'sin-conexion':
      return <>Sin conexión con el servidor.</>;
    case 'conectado':
      return estado.version === VERSION_ESQUEMA_REQUERIDA ? (
        <>Conectado · esquema v{estado.version}</>
      ) : (
        <>
          El servidor tiene el esquema v{estado.version} y esta versión necesita la v{VERSION_ESQUEMA_REQUERIDA}.
        </>
      );
  }
}

export function App() {
  const [estado, setEstado] = useState<EstadoServidor | null>(null);
  const [tamano, setTamano] = useState<Tamano>(leerTamano);
  const sesion = useSesion();

  useEffect(() => {
    void consultarServidor().then(setEstado);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.tamano = tamano;
    try {
      localStorage.setItem(CLAVE_TAMANO, tamano);
    } catch {
      /* almacenamiento no disponible: se usa el tamaño solo en esta visita */
    }
  }, [tamano]);

  const siguiente = () => setTamano(TAMANOS[(TAMANOS.indexOf(tamano) + 1) % TAMANOS.length] ?? 'normal');
  const ok = estado?.tipo === 'conectado' && estado.version === VERSION_ESQUEMA_REQUERIDA;
  const salir = () => void supabase?.auth.signOut();

  return (
    <div className="pagina">
      <header className="cabecera">
        <h1>Plataforma PM</h1>
        <div className="acciones">
          <button type="button" className="boton" onClick={siguiente} aria-label="Cambiar tamaño de letra">
            {ETIQUETA_TAMANO[tamano]}
          </button>
          {sesion && (
            <button type="button" className="boton" onClick={salir}>
              Salir
            </button>
          )}
        </div>
      </header>

      <main>
        {!supabase ? null : sesion === undefined ? (
          <p className="tarjeta">Cargando…</p>
        ) : sesion === null ? (
          <Ingreso sb={supabase} />
        ) : (
          <ConSesion sb={supabase} sesion={sesion} onSalir={salir} />
        )}
      </main>

      <footer>
        <p className={`estado ${ok ? 'estado-ok' : ''}`} role="status" data-testid="estado-servidor">
          <TextoEstado estado={estado} />
        </p>
      </footer>
    </div>
  );
}

type Carga =
  { tipo: 'cargando' } | { tipo: 'error'; mensaje: string } | { tipo: 'listo'; perfil: Perfil; secciones: Seccion[] };

function ConSesion({ sb, sesion, onSalir }: { sb: SupabaseClient; sesion: Session; onSalir: () => void }) {
  const [carga, setCarga] = useState<Carga>({ tipo: 'cargando' });
  const id = sesion.user.id;

  const [version, setVersion] = useState(0);
  const recargar = () => setVersion((v) => v + 1);

  useEffect(() => {
    let vivo = true;
    Promise.all([cargarPerfil(sb, id), misSecciones(sb)]).then(
      ([perfil, secciones]) => {
        if (!vivo) return;
        setCarga(
          perfil
            ? { tipo: 'listo', perfil, secciones }
            : { tipo: 'error', mensaje: 'No encontramos tu perfil. Cierra sesión e inténtalo de nuevo.' },
        );
      },
      (e: unknown) => {
        if (vivo)
          setCarga({ tipo: 'error', mensaje: e instanceof Error ? e.message : 'No se pudo cargar tu información.' });
      },
    );
    return () => {
      vivo = false;
    };
  }, [sb, id, version]);

  if (carga.tipo === 'cargando') return <p className="tarjeta">Cargando…</p>;
  if (carga.tipo === 'error')
    return (
      <p className="tarjeta error" role="alert">
        {carga.mensaje}
      </p>
    );

  const { perfil, secciones } = carga;

  if (!perfil.consentimiento_en) {
    return (
      <AvisoPrivacidad
        onAceptar={async () => {
          await darConsentimiento(sb, id);
          recargar();
        }}
        onSalir={onSalir}
      />
    );
  }

  if (perfil.rol === 'docente' || perfil.rol === 'administrador') {
    return <InicioDocente sb={sb} perfil={perfil} />;
  }

  if (!perfil.carrera) {
    return (
      <ElegirCarrera
        onElegir={async (c) => {
          await elegirCarrera(sb, id, c);
          recargar();
        }}
      />
    );
  }

  if (secciones.length === 0) {
    return <SinMatricula onReintentar={recargar} />;
  }

  return <InicioEstudiante perfil={perfil} secciones={secciones} />;
}
