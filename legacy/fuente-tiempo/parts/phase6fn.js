function renderPhase6(app){
  phaseHeader(app, 6, "Dictamen: del cálculo a la decisión",
    "Aquí integras todo: lees las ofertas, calculas tiempos con la tasa por periodo correcta, detectas promesas imposibles y redactas un dictamen como lo haría un profesional del Derecho o de la Psicología. El último caso es el jefe final.");
  runCases(app, {cases: DICTAMEN, phaseKey: "dictamen",
    doneTitle: "🏁 Misión completa", doneText: "Despejaste el tiempo con logaritmos, cuidaste la unidad, calculaste duplicaciones y metas, detectaste promesas imposibles y emitiste dictámenes profesionales, incluido el del Fondo de la Defensoría. En la <strong>Semana 15</strong> usarás el mismo despeje con personas en lugar de soles: crecimiento poblacional.",
    nextRoute: "summary", nextLabel: "Ver tu resumen y constancia →"});
}
