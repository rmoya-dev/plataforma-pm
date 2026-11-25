import type { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { supabase } from './supabase.ts';

/** `undefined` mientras se consulta; `null` sin sesión. */
export function useSesion(): Session | null | undefined {
  const [sesion, setSesion] = useState<Session | null | undefined>(supabase ? undefined : null);

  useEffect(() => {
    if (!supabase) return;
    let vivo = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (vivo) setSesion(data.session);
    });
    const { data } = supabase.auth.onAuthStateChange((_evento, s) => setSesion(s));
    return () => {
      vivo = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return sesion;
}
