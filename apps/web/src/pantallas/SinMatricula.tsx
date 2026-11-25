export function SinMatricula({ onReintentar }: { onReintentar: () => void }) {
  return (
    <section className="tarjeta" aria-labelledby="titulo-sin-matricula">
      <h2 id="titulo-sin-matricula">Todavía no estás en ninguna sección</h2>
      <p>
        Pide a tu docente que te agregue a su sección con tu correo institucional. Cuando lo haga, vuelve a esta página.
      </p>
      <button type="button" className="boton" onClick={onReintentar}>
        Volver a comprobar
      </button>
    </section>
  );
}
