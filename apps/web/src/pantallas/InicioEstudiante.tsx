import { NOMBRE_CARRERA, nombreCorto, type Perfil, type Seccion } from '../datos.ts';

export function InicioEstudiante({ perfil, secciones }: { perfil: Perfil; secciones: Seccion[] }) {
  return (
    <section className="tarjeta" aria-labelledby="titulo-inicio">
      <h2 id="titulo-inicio">Hola, {nombreCorto(perfil)}</h2>
      <dl className="datos">
        <dt>Tu sección</dt>
        <dd>{secciones.map((s) => s.nombre).join(', ')}</dd>
        {perfil.carrera && (
          <>
            <dt>Carrera</dt>
            <dd>{NOMBRE_CARRERA[perfil.carrera]}</dd>
          </>
        )}
      </dl>
      <p className="nota">Aquí aparecerán tus certificaciones y recursos del curso, organizados por unidad y semana.</p>
    </section>
  );
}
