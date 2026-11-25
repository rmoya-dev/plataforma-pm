import { describe, expect, it } from 'vitest';
import { leerCsvMoodle, partirCsv } from './moodle.ts';

// Datos ficticios: nunca DNI ni nombres reales.
const DOMINIOS = ['continental.edu.pe'];

describe('partirCsv', () => {
  it('respeta comillas, comillas escapadas y saltos de línea dentro de comillas', () => {
    expect(partirCsv('a,"b,c","d ""e""",\r\n"f\ng",h', ',')).toEqual([
      ['a', 'b,c', 'd "e"', ''],
      ['f\ng', 'h'],
    ]);
  });
});

describe('leerCsvMoodle', () => {
  it('lee el formato en español con punto y coma, BOM y nombre separado en dos columnas', () => {
    const csv =
      '﻿Nombre;Apellido(s);Dirección de correo;Grupos\r\n' +
      'Ana;Prueba Uno;T0000001@Continental.edu.pe;Grupo A\r\n' +
      'Bruno;Ensayo Dos;t0000002@continental.edu.pe;\r\n';
    expect(leerCsvMoodle(csv, DOMINIOS)).toEqual({
      ok: true,
      filas: [
        { correo: 't0000001@continental.edu.pe', nombres: 'Ana Prueba Uno', grupo: 'Grupo A' },
        { correo: 't0000002@continental.edu.pe', nombres: 'Bruno Ensayo Dos', grupo: null },
      ],
      problemas: [],
    });
  });

  it('lee el formato en inglés con comas y nombre completo', () => {
    const csv = 'Full name,Email address\n"Prueba, Carla",t0000003@continental.edu.pe\n';
    const r = leerCsvMoodle(csv, DOMINIOS);
    expect(r.ok && r.filas).toEqual([{ correo: 't0000003@continental.edu.pe', nombres: 'Prueba, Carla', grupo: null }]);
  });

  it('informa filas sin correo, de otro dominio o repetidas, e ignora filas vacías', () => {
    const csv = [
      'Nombre,Apellido(s),Correo',
      'Diego,Muestra,t0000004@continental.edu.pe',
      'Elena,Ficticia,',
      'Fabio,Simulado,fabio@gmail.com',
      ',,',
      'Diego,Muestra,T0000004@continental.edu.pe',
    ].join('\n');
    const r = leerCsvMoodle(csv, DOMINIOS);
    expect(r.ok && r.filas.map((f) => f.correo)).toEqual(['t0000004@continental.edu.pe']);
    expect(r.ok && r.problemas).toEqual([
      { linea: 3, motivo: 'sin correo' },
      { linea: 4, motivo: 'fabio@gmail.com: no es un correo institucional' },
      { linea: 6, motivo: 't0000004@continental.edu.pe: repetido en el archivo' },
    ]);
  });

  it('avisa si falta la columna del correo o el archivo está vacío', () => {
    expect(leerCsvMoodle('Nombre;Apellido(s)\nAna;Prueba', DOMINIOS)).toMatchObject({ ok: false });
    expect(leerCsvMoodle('   ', DOMINIOS)).toEqual({ ok: false, error: 'El archivo está vacío.' });
  });

  it('rechaza más de 500 estudiantes', () => {
    const filas = Array.from({ length: 501 }, (_, i) => `t${String(i).padStart(7, '0')}@continental.edu.pe`);
    expect(leerCsvMoodle(['Correo', ...filas].join('\n'), DOMINIOS)).toMatchObject({ ok: false });
  });
});
