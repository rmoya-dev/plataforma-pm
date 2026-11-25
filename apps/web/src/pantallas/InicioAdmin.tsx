import type { SupabaseClient } from '@supabase/supabase-js';
import { useState } from 'react';
import type { Perfil } from '../datos.ts';
import { Docentes, Periodos } from './Administracion.tsx';
import { InicioDocente } from './InicioDocente.tsx';

const PESTANAS = [
  { id: 'secciones', texto: 'Mis secciones' },
  { id: 'periodos', texto: 'Periodos' },
  { id: 'docentes', texto: 'Docentes' },
] as const;
type Pestana = (typeof PESTANAS)[number]['id'];

/** La administradora ve sus secciones (como docente) y además la gestión de periodos y docentes. */
export function InicioAdmin({ sb, perfil }: { sb: SupabaseClient; perfil: Perfil }) {
  const [pestana, setPestana] = useState<Pestana>('secciones');

  return (
    <>
      <nav className="pestanas" aria-label="Administración">
        {PESTANAS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`boton pestana ${pestana === p.id ? 'pestana-activa' : ''}`}
            aria-current={pestana === p.id ? 'page' : undefined}
            onClick={() => setPestana(p.id)}
          >
            {p.texto}
          </button>
        ))}
      </nav>
      {pestana === 'secciones' && <InicioDocente sb={sb} perfil={perfil} />}
      {pestana === 'periodos' && <Periodos sb={sb} />}
      {pestana === 'docentes' && <Docentes sb={sb} />}
    </>
  );
}
