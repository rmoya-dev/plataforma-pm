# Guía rápida — Funciones Exponenciales (versión 2): sala por fase, ritmo de la clase y seguimiento

## 1. Actualizar el respaldo (una sola vez; es obligatorio en la v2)
1. Abre tu proyecto de Apps Script (el mismo que ya usas) y **reemplaza todo el contenido de `Code.gs`** por el archivo nuevo.
2. **Cambia el PIN docente**: busca la línea `var TEACHER_PIN = "PIN-DE-EJEMPLO";` y pon uno tuyo. Solo quien tenga el PIN puede abrir la sala, marcar el ritmo y ver el seguimiento.
3. Guarda. Luego: **Implementar → Administrar implementaciones → ✏️ Editar → Versión: "Nueva versión" → Implementar.** (La URL no cambia, así que no tocas los HTML.)
4. La pestaña **"Progreso - Exponenciales"** de tu hoja se crea sola cuando el primer estudiante guarda avance.

## 2. Publicar en Google Sites
Usa `exponenciales-mission-sites.html`: en Google Sites, **Insertar → Insertar código → pestaña "Incorporar" → pega el contenido completo** (no el enlace). Ajusta el cuadro al ancho y alto máximos. Funciona bien en celular.

## 3. Quién controla qué (usuario principal y participantes)
- **Docente (con PIN):** abre y cierra la sala de cada fase, da la señal de inicio, marca el ritmo de la clase y ve el seguimiento. Entra con la app + `#docente` al final de la URL (o el enlace «Abrir el panel docente» al pie de **⚡ Sala en vivo**).
- **Estudiantes:** solo participan. No pueden abrir ni cerrar la sala. Cuando la sala está apagada pueden **practicar solo** la ronda de su fase (sin XP).

## 4. Cómo dirigir un reto relámpago (una ronda por fase)
1. En el panel docente, sección **1 · Sala relámpago**, elige la ronda (cada ronda corresponde a una fase: 1 Explora, 2 Evalúa, 3 Grafica, 4 Interpreta, 5 Investiga, 6 Desafío, 7 Aplica).
2. Pulsa **«1 · Abrir sala y avisar»**. En la pantalla de la fase de cada estudiante aparece una franja morada **«¡Reto relámpago de esta fase en vivo!»** con el botón *Entrar ahora* (y un letrero también si están en otra pantalla). Verás cuántos hay **conectados**.
3. Dilo en voz alta: *«Ya, empezamos»* y pulsa **«2 · ¡Iniciar!»**. Cuenta regresiva y 5 preguntas de 12 s a la vez para todos. Cada estudiante ve las opciones en **otro orden**.
4. Al terminar verás el **ranking de la ronda**. Pulsa **«Cerrar sala»**. Cada ronda suma una sola vez por estudiante.

## 5. Ritmo de la clase
En **2 · Ritmo de la clase** elige la fase (y el reto, si quieres) y pulsa **«Marcar ritmo»**. Los estudiantes ven en cada fase: *«La clase va en Fase 3 · Reto 2»*. Si alguien va atrasado ve cuántas fases le faltan y un botón **«Ir a mi fase actual»**. La marca caduca sola a las 8 horas, o la quitas con **«Quitar marca»**.

## 6. Seguimiento de la clase
En **3 · Seguimiento** ves a cada estudiante registrado: sus 7 fases (verde = completa, ámbar = en curso), retos resueltos, XP y cuándo avanzó por última vez. Si marcaste un ritmo, los que van por detrás quedan **resaltados en rojo**. Se actualiza cada 20 s. Solo muestra a quienes ya se registraron y guardaron avance.

## 7. Qué cambió para los estudiantes en la v2
- **Calculadora científica en pantalla** (botón flotante 🧮): teclas para exponentes, raíz, e, ln, π, paréntesis; el exponente se ve como exponente, nunca como «^». Un botón pasa el resultado al campo de respuesta. Cada campo numérico trae un botón **±** (el teclado numérico del celular no trae el signo menos).
- **Volver atrás:** cada ejercicio resuelto tiene «Ver ejercicio y respuesta»; en las fases con casos hay pastillas (Caso 1, 2, 3…) para regresar y revisarlos.
- **Fórmulas en LaTeX** en todas partes y **alternativas en orden aleatorio**.
- **Teoría plegable** al inicio de cada fase y, en la Fase 6, un **método de 3 pasos**, un ejemplo guiado y hasta 3 pistas por reto.
- **Diseño pensado para celular** (botones grandes, nada se sale de la pantalla).

## 8. Notas
- Si el respaldo no responde, la app sigue funcionando; solo se pierde la sala, el ranking y el seguimiento.
- Sondeo liviano: cada 20 s en segundo plano y cada 3 s dentro de la sala. Ten presentes los límites gratuitos de Apps Script; para ~40 estudiantes alcanza.
- Para futuras certificaciones se puede reutilizar el mismo Apps Script: cada actividad usa su propia pestaña.
