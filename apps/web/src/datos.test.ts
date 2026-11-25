import { describe, expect, it } from 'vitest';
import { correoPermitido, nombreCorto } from './datos.ts';

describe('nombreCorto (D18)', () => {
  it('muestra el primer nombre y la inicial del primer apellido', () => {
    expect(nombreCorto({ nombres: 'María Fernanda', apellidos: 'quispe Rojas' })).toBe('María Q.');
  });
  it('sin apellido, solo el nombre', () => {
    expect(nombreCorto({ nombres: '  Ana ', apellidos: '' })).toBe('Ana');
  });
});

describe('correoPermitido', () => {
  const dominios = ['continental.edu.pe'];
  it('acepta el dominio institucional sin importar mayúsculas ni espacios', () => {
    expect(correoPermitido(' 12345678@Continental.edu.pe ', dominios)).toBe(true);
  });
  it('rechaza otros dominios y correos mal formados', () => {
    expect(correoPermitido('alguien@gmail.com', dominios)).toBe(false);
    expect(correoPermitido('@continental.edu.pe', dominios)).toBe(false);
    expect(correoPermitido('a@b@continental.edu.pe', dominios)).toBe(false);
    expect(correoPermitido('sin-arroba', dominios)).toBe(false);
  });
});
