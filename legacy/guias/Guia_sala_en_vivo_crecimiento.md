# Guía rápida — Crecimiento Poblacional (Semana 10): sala por fase, ritmo de la clase, seguimiento y reflexiones

## 1. Actualizar el respaldo (una sola vez; obligatorio para esta actividad)
1. Abre tu proyecto de Apps Script (el mismo que ya usas) y **reemplaza todo el contenido de `Code.gs`** por el archivo nuevo.
2. **Cambia el PIN docente**: busca la línea `var TEACHER_PIN = "PIN-DE-EJEMPLO";` y pon uno tuyo. Solo quien tenga el PIN puede abrir la sala, marcar el ritmo y ver el seguimiento y las reflexiones.
   **Esta versión del `Code.gs` es nueva** (tiempo por pregunta, resultados de la clase por pregunta y reflexiones): vuelve a pegarlo e implementa una **nueva versión**, o esas funciones no aparecerán.
3. Guarda. Luego: **Implementar → Administrar implementaciones → ✏️ Editar → Versión: "Nueva versión" → Implementar.** (La URL no cambia, así que no tocas los HTML.)
4. La pestaña **"Progreso - Crecimiento"** de tu hoja se crea sola cuando el primer estudiante guarda avance. (Las pestañas de las actividades anteriores no se tocan.)

## 2. Publicar en Google Sites
Usa `crecimiento-poblacional-sites.html`: en Google Sites, **Insertar → Insertar código → pestaña "Incorporar" → pega el contenido completo** (no el enlace). Ajusta el cuadro al ancho y alto máximos. Funciona bien en celular.

## 3. Quién controla qué (usuario principal y participantes)
- **Docente (con PIN):** abre y cierra la sala de cada fase, da la señal de inicio, marca el ritmo de la clase y ve el seguimiento. Entra con la app + `#docente` al final de la URL (o el enlace «Abrir el panel docente» al pie de **⚡ Sala en vivo**).
- **Estudiantes:** solo participan. No pueden abrir ni cerrar la sala. Cuando la sala está apagada pueden **practicar solo** la ronda de su fase (sin XP).

## 4. Cómo dirigir un reto relámpago (una ronda por fase)
1. En el panel docente, sección **1 · Sala relámpago**, elige la ronda (cada ronda corresponde a una fase: 1 Explora, 2 Evalúa, 3 Grafica, 4 Interpreta, 5 Investiga, 6 Desafío, 7 Aplica). Cada actividad tiene su propia sala: abrir la de Crecimiento no afecta la de Exponenciales.
2. Elige el **tiempo por pregunta**: **1 minuto, 1½ minutos o 2 minutos** (por defecto 2). Una ronda dura entonces 5, 7½ o 10 minutos. El tiempo se fija al abrir la sala. Pulsa **«1 · Abrir sala y avisar»**. En la pantalla de la fase de cada estudiante aparece una franja morada **«¡Reto relámpago de esta fase en vivo!»** con el botón *Entrar ahora* (y un letrero también si están en otra pantalla). Verás cuántos hay **conectados**.
3. Dilo en voz alta: *«Ya, empezamos»* y pulsa **«2 · ¡Iniciar!»**. Cuenta regresiva de 12 s y 5 preguntas, todas a la vez, con el tiempo que elegiste (se ve un reloj mm:ss). **Puntaje:** cada acierto vale **6 XP + hasta 4 XP por rapidez** (4 si responden al instante, bajando hasta 0 al cumplirse 60 s o el tiempo de la pregunta, si es menor). Máximo 10 XP por pregunta, 50 por ronda; fallar no resta. **Desempate:** gana quien acertó en menos tiempo total. El tiempo se mide con el reloj de la sala, no con el del celular. Cada estudiante ve las opciones en **otro orden** y, al responder, lee la explicación mientras corre el tiempo de la clase.
4. Al terminar verás el **ranking de la ronda** y, debajo, **📊 Resultados por pregunta**: qué porcentaje eligió cada opción (la correcta en verde). Si una opción incorrecta fue muy elegida, ese es el punto para repasar en voz alta. Los estudiantes ven la misma revisión en su pantalla (su respuesta, la correcta, la explicación y el % de la clase). Pulsa **«Cerrar sala»**. Cada ronda suma una sola vez por estudiante.
   - **Antes de mostrar el ranking a la clase** mira el encabezado de tu panel: dice «24 de 31 resultados recibidos». Si faltan, espera unos 15 s y se completa solo. Los estudiantes ven lo mismo («Faltan resultados por llegar… las posiciones pueden cambiar») y su pantalla se actualiza sola hasta que llegan todos.
5. **Control durante la ronda:** debajo de los botones verás la pregunta en curso, el tiempo que queda y **cuántos ya respondieron** («Ya respondieron 28 de 31 jugando»). Cuando casi todos terminaron, pulsa **«⏭ Siguiente pregunta»** y toda la clase pasa a la siguiente (a quien no alcanzó a responder le cuenta como sin respuesta, y verá la explicación en la revisión final). En la última pregunta el botón dice **«🏁 Terminar la ronda»** y todos pasan a sus resultados. Los estudiantes ven el aviso «Tu docente pasó a la siguiente pregunta». Los cambios les llegan en unos 5 s. Un doble toque no salta dos preguntas.
6. Quien practica solo (sin sala) tiene 2 min por pregunta y un botón **«Siguiente pregunta»**; no suma XP.

## 5. Ritmo de la clase
En **2 · Ritmo de la clase** elige la fase (y el reto, si quieres) y pulsa **«Marcar ritmo»**. Los estudiantes ven en cada fase: *«La clase va en Fase 3 · Reto 2»*. Si alguien va atrasado ve cuántas fases le faltan y un botón **«Ir a mi fase actual»**. La marca caduca sola a las 8 horas, o la quitas con **«Quitar marca»**.

## 6. Seguimiento de la clase
En **3 · Seguimiento** ves a cada estudiante registrado: sus 7 fases (verde = completa, ámbar = en curso), retos resueltos, XP y cuándo avanzó por última vez. Si marcaste un ritmo, los que van por detrás quedan **resaltados en rojo**. Se muestra en **tarjetas** (funciona bien en el celular) y se actualiza cada 20 s. Solo muestra a quienes ya se registraron y guardaron avance.

## 6b. Reflexiones
Al final de cada fase los estudiantes tienen la tarjeta **💬 Tu reflexión de la fase** (una frase de hasta 300 caracteres, sin nota). En **4 · Reflexiones** pulsa *Cargar reflexiones*, elige la fase y léelas con nombre: buenas semillas para abrir la conversación en clase.

## 7. Qué incluye para los estudiantes
- **Calculadora científica en pantalla** (botón flotante 🧮): teclas para potencias, cuadrado, cubo, raíz, 1/x, π, (−), **log y ln** y paréntesis; **se puede mover**: arrástrala desde la barra superior (con el dedo o el mouse); en PC nace pequeña (≈ 400 px de alto) en la esquina, se compacta sola en pantallas bajas y puedes empujarla casi fuera de la pantalla. Botones: 👁 la vuelve transparente para ver lo que hay detrás (al pasar el mouse se aclara), ⤢ cambia el tamaño (compacta / normal / grande), ▁ la minimiza (también con doble clic en la barra) y ⤓ la devuelve a su lugar. Recuerda posición y tamaño, y trae un mini-tutorial la primera vez; el exponente se ve como exponente, nunca como «^». Un botón pasa el resultado al campo de respuesta. Cada campo numérico trae un botón **±** (el teclado numérico del celular no trae el signo menos).
- **Volver atrás:** cada ejercicio resuelto tiene «Ver ejercicio y respuesta»; en las fases con casos hay pastillas (Caso 1, 2, 3…) para regresar y revisarlos.
- **Fórmulas en LaTeX** en todas partes y **alternativas en orden aleatorio**.
- **Teoría plegable** al inicio de cada fase y, en la Fase 6, un **método** (construir N₀·bˣ y hallar «cuánto tarda» probando y ajustando, sin logaritmos), dos ejemplos guiados y hasta 3 pistas por reto. Las situaciones se leen con **tablas y gráficas** primero; las fórmulas largas (curva con tope) quedan como «Ver la fórmula (opcional)». El jefe final es el peritaje de una represa piscícola.
- **Logaritmo opcional:** en la teoría de la Fase 6 y en los ejercicios de «¿cuánto tarda?» (duplicar la ciudad, el rumor y los casos de la Fase 7) hay un recuadro plegable **«Método B: con logaritmos»** con la fórmula y el cálculo con los números del caso. El método de prueba y ajuste sigue siendo el principal; el logaritmo es un atajo para quien ya lo conoce.
- **Letra grande:** el botón **Aa** de la barra superior cambia el tamaño del texto (normal, grande, muy grande) y lo recuerda.
- **Glosario «¿Qué significa…?»** plegable en cada fase, con los términos de esa fase en lenguaje cotidiano.
- **Simulador de política pública** en la Fase 3 (un juzgado y su carga de expedientes): mueven la tasa, la ampliación y el retraso, y ven cuánto tiempo tiene la autoridad para actuar.
- Los gráficos muestran siempre los números de los ejes.
- **Diseño pensado para celular** (botones grandes, nada se sale de la pantalla).

## 8. Si la nube se cae en plena clase (qué hace ahora la actividad)
- **El avance no se pierde:** todo queda guardado primero en el dispositivo del estudiante. Si la nube no responde, sale un aviso amarillo («Sin conexión con la nube…») y la página **reintenta sola** con esperas crecientes. Al volver la conexión, o al reabrir la página en el mismo dispositivo, el avance se sube solo.
- **La nube nunca borra avance:** al guardar, `Code.gs` une lo que ya estaba con lo nuevo (retos resueltos, rondas relámpago, reflexiones). Un guardado con menos avance, por ejemplo desde un dispositivo vacío, ya no pisa el anterior.
- **Menos consultas:** durante el juego los estudiantes ya no consultan cada 3 s (el reloj corre en su pantalla). En la espera consultan cada ~4 s y en las demás pantallas cada ~20 s. Tu panel consulta cada 5 s (estado) y cada 15 s (seguimiento).
- **Mensajes claros:** si el panel docente no conecta, ahora dice por qué (página de permisos, versión antigua del script, sin internet, etc.).
- **Si una orden no llega** (por ejemplo «Abrir sala»), el panel lo avisa: vuelve a pulsar el botón.
- **Para clases grandes:** pide que entren a la sala unos minutos antes (así no registran todos en el mismo segundo) y, si tienes dos secciones, abre la sala en horarios distintos.
- **Después de una caída:** pide que recarguen la página una vez (con la versión nueva) para que suban lo pendiente; luego pulsa «Actualizar ahora» en el seguimiento.

## 8b. ¿Por qué cada estudiante veía un ranking distinto? (corregido)
En la clase del 13 de octubre cada pantalla mostró otra tabla. Las causas probables, todas ya atendidas en esta versión:
- **Cada quien miraba una «foto» en un momento distinto.** El ranking se arma con los resultados que ya llegaron a la nube; quien terminó primero lo vio con pocos resultados y quien terminó después con más. Ahora el ranking dice «X de Y resultados» y se refresca solo hasta completarse.
- **Los guardados se encolaban.** Con 30+ estudiantes guardando a la vez, la nube atendía uno por uno y algunos resultados llegaban con segundos de retraso. `saveRow_` ya no usa candado para quien ya tiene fila.
- **Había muchísimos empates** (todos con 10 XP por acierto) y el orden entre empatados era arbitrario. Ahora hay puntaje por rapidez y desempate por tiempo total.
- **Recargar a mitad de ronda reiniciaba las respuestas** en ese dispositivo. Ahora se recuperan (mismas opciones, mismo orden, mismos puntos).

## 9. Notas
- Si el respaldo no responde, la app sigue funcionando; solo se pierde la sala, el ranking y el seguimiento.
- Apps Script gratuito admite unas 30 ejecuciones a la vez; la versión nueva está pensada para ~40 estudiantes en la misma sala.
- Para futuras certificaciones se puede reutilizar el mismo Apps Script: cada actividad usa su propia pestaña.
