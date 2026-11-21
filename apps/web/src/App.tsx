import { VERSION_ESQUEMA_REQUERIDA, XP_BONO_FASE, XP_POR_RETO } from '@pm/engine';
import { useEffect, useState } from 'react';
import { Formula } from './Formula.tsx';
import { consultarServidor, type EstadoServidor } from './supabase.ts';

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
      return <>Sin conexión con el servidor. Puedes seguir en modo práctica.</>;
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

  return (
    <div className="pagina">
      <header className="cabecera">
        <h1>Plataforma PM</h1>
        <button type="button" className="boton" onClick={siguiente} aria-label="Cambiar tamaño de letra">
          {ETIQUETA_TAMANO[tamano]}
        </button>
      </header>

      <main>
        <section className="tarjeta">
          <h2>Hola, mundo</h2>
          <p>
            Este es el punto de partida de la plataforma del curso de Pensamiento Matemático. Aquí vivirán las
            certificaciones, la sala en vivo y los demás recursos, organizados por unidad y semana.
          </p>
          <p>Regla de XP del motor, migrada desde la versión actual:</p>
          <Formula
            bloque
            tex={`\\text{XP} = ${XP_POR_RETO}\\cdot\\text{retos} + ${XP_BONO_FASE}\\cdot\\text{fases completas}`}
          />
        </section>

        <p className={`estado ${ok ? 'estado-ok' : ''}`} role="status" data-testid="estado-servidor">
          <TextoEstado estado={estado} />
        </p>
      </main>
    </div>
  );
}
