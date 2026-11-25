import type { SupabaseClient } from '@supabase/supabase-js';
import { useState, type FormEvent } from 'react';
import { correoPermitido } from '../datos.ts';
import { DOMINIOS_PERMITIDOS, GOOGLE_HABILITADO } from '../supabase.ts';

type Estado = { tipo: 'listo' } | { tipo: 'enviando' } | { tipo: 'enviado' } | { tipo: 'error'; mensaje: string };

const DOMINIO = DOMINIOS_PERMITIDOS[0] ?? 'continental.edu.pe';

export function Ingreso({ sb }: { sb: SupabaseClient }) {
  const [correo, setCorreo] = useState('');
  const [estado, setEstado] = useState<Estado>({ tipo: 'listo' });

  async function enviarEnlace(e: FormEvent) {
    e.preventDefault();
    if (!correoPermitido(correo, DOMINIOS_PERMITIDOS)) {
      setEstado({ tipo: 'error', mensaje: `Usa tu correo institucional (@${DOMINIO}).` });
      return;
    }
    setEstado({ tipo: 'enviando' });
    const { error } = await sb.auth.signInWithOtp({
      email: correo.trim().toLowerCase(),
      options: { emailRedirectTo: window.location.origin },
    });
    setEstado(error ? { tipo: 'error', mensaje: error.message } : { tipo: 'enviado' });
  }

  async function ingresarConGoogle() {
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin, queryParams: { hd: DOMINIO, prompt: 'select_account' } },
    });
    if (error) setEstado({ tipo: 'error', mensaje: error.message });
  }

  return (
    <section className="tarjeta" aria-labelledby="titulo-ingreso">
      <h2 id="titulo-ingreso">Ingresa con tu correo institucional</h2>

      {GOOGLE_HABILITADO && (
        <>
          <button type="button" className="boton boton-principal boton-ancho" onClick={() => void ingresarConGoogle()}>
            Ingresar con Google
          </button>
          <p className="separador">o recibe un enlace en tu correo</p>
        </>
      )}

      {estado.tipo === 'enviado' ? (
        <div className="aviso aviso-ok" role="status">
          <p>
            <strong>Revisa tu correo.</strong> Te enviamos un enlace para ingresar. Ábrelo en este mismo dispositivo.
          </p>
          <button type="button" className="boton" onClick={() => setEstado({ tipo: 'listo' })}>
            Usar otro correo
          </button>
        </div>
      ) : (
        <form onSubmit={(e) => void enviarEnlace(e)} noValidate>
          <label htmlFor="correo" className="etiqueta">
            Correo institucional
          </label>
          <input
            id="correo"
            className="campo"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={`tu-correo@${DOMINIO}`}
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            aria-invalid={estado.tipo === 'error'}
            aria-describedby={estado.tipo === 'error' ? 'error-ingreso' : undefined}
            required
          />
          {estado.tipo === 'error' && (
            <p id="error-ingreso" className="error" role="alert">
              {estado.mensaje}
            </p>
          )}
          <button type="submit" className="boton boton-principal boton-ancho" disabled={estado.tipo === 'enviando'}>
            {estado.tipo === 'enviando' ? 'Enviando…' : 'Enviarme un enlace'}
          </button>
        </form>
      )}
    </section>
  );
}
