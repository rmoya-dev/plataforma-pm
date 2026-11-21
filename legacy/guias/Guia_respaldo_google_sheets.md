# Cómo activar el respaldo en la nube (Google Sheets)

Esta guía te permite conectar tus actividades de Pensamiento Matemático — **"Domina la Parábola"** y **"Domina los Sistemas de Ecuaciones"** — a una sola Hoja de cálculo de Google, para que el avance de cada estudiante quede guardado ahí y no se pierda si cambian de dispositivo, se les borra el navegador, o Google Sites recarga la página incrustada.

Las dos actividades comparten el mismo script y la misma URL, pero cada una guarda su información en su **propia pestaña** dentro de la Hoja, así que los datos nunca se mezclan.

No necesitas saber programar. Toma unos 10 minutos, una sola vez.

> **¿Ya habías configurado esto para "Domina la Parábola"?** Puedes seguir usando la misma Hoja y la misma URL de Apps Script. Solo tienes que reemplazar el contenido de tu `Code.gs` por la nueva versión (Paso 2) — es compatible con lo que ya tenías: tu pestaña **"Progreso"** de la Parábola sigue funcionando exactamente igual, y la nueva actividad simplemente agrega una pestaña adicional. No hace falta crear una Hoja nueva ni volver a pegar la URL en `parabola-mission-google-sites.html`.

## Paso 1 — Crea la Hoja de cálculo

1. Ve a [sheets.google.com](https://sheets.google.com) y crea una hoja nueva en blanco.
2. Ponle un nombre, por ejemplo **"Pensamiento Matemático — Progreso"**.
3. No necesitas crear columnas ni nada más: el script las crea solo, y crea una pestaña nueva por cada actividad la primera vez que un estudiante guarda su avance en ella.

## Paso 2 — Abre el editor de Apps Script

1. Dentro de esa Hoja, ve al menú **Extensiones → Apps Script**.
2. Se abrirá una pestaña nueva con un archivo llamado `Código.gs` (o `Code.gs`).
3. Borra todo el contenido de ese archivo (incluso si ya tenías una versión anterior pegada ahí).
4. Abre el archivo **`Code.gs`** que te entregué junto con esta guía, copia todo su contenido y pégalo ahí.
5. Guarda con el ícono del disquete (o Ctrl+S / Cmd+S).

## Paso 3 — Publica el script como aplicación web

1. Arriba a la derecha, haz clic en **Implementar → Nueva implementación** (o, si ya tenías una implementación de la Parábola, en **Implementar → Gestionar implementaciones → editar (lápiz) → Nueva versión → Implementar**, para conservar la misma URL).
2. Si es tu primera vez: junto a "Selecciona el tipo", haz clic en el ícono de engranaje ⚙️ y elige **Aplicación web**.
3. Configura así:
   - **Ejecutar como:** Yo (tu cuenta de Google)
   - **Quién tiene acceso:** Cualquier usuario
4. Haz clic en **Implementar**.
5. Google te pedirá autorizar el script (es tu propio script, así que es seguro). Sigue el flujo: "Autorizar acceso" → elige tu cuenta → puede aparecer una advertencia de "app no verificada"; haz clic en "Avanzado" → "Ir a (nombre del proyecto), no seguro" → "Permitir".
6. Al terminar, te va a mostrar una **URL de la aplicación web** que termina en `/exec`. Cópiala completa (si ya tenías una URL de antes y solo actualizaste el código, la URL se mantiene igual).

> Importante: si en el futuro editas el código del script, los cambios **no se aplican solos** — tienes que volver a "Implementar → Gestionar implementaciones → editar (lápiz) → Nueva versión → Implementar" para que la URL tome el código actualizado.

## Paso 4 — Conecta esa URL con cada actividad

Repite esto en **cada** archivo HTML (`parabola-mission-google-sites.html` y `sistemas-mission-google-sites.html`) — ambos usan la misma URL:

1. Abre el archivo en un editor de texto simple (por ejemplo el Bloc de notas de Windows, TextEdit en modo texto plano de Mac, o directamente en Google Sites al editar el bloque de código).
2. Busca esta línea (aparece una sola vez, cerca del inicio del código de la aplicación):
   ```
   var SHEET_API_URL = "PEGA_AQUI_TU_URL_DE_APPS_SCRIPT";
   ```
3. Reemplaza el texto `PEGA_AQUI_TU_URL_DE_APPS_SCRIPT` por la URL que copiaste en el paso anterior, manteniendo las comillas. Por ejemplo:
   ```
   var SHEET_API_URL = "https://script.google.com/macros/s/AKfycb.../exec";
   ```
4. Guarda el archivo.
5. En Google Sites, edita el bloque de "Insertar código" donde tenías pegada esa actividad, borra todo el código anterior y pega el contenido actualizado del archivo completo.
6. Publica los cambios en Google Sites.

## Paso 5 — Pruébalo

1. Abre la página publicada de Google Sites (usa una ventana de incógnito para simular un estudiante nuevo).
2. Regístrate con un nombre de prueba y resuelve una misión cualquiera.
3. Vuelve a tu Hoja de cálculo: debería aparecer una fila nueva en la pestaña de esa actividad — **"Progreso"** para la Parábola, **"Progreso - Sistemas"** para Sistemas de Ecuaciones — con el nombre, la carrera y un resumen del avance.
4. Cierra esa ventana de incógnito, abre otra nueva, y regístrate **con el mismo nombre y la misma carrera**: la actividad debería recuperar automáticamente el avance que ya tenías (verás un mensaje breve de "Cargando tu progreso...").
5. Repite la prueba en la otra actividad para confirmar que cada una escribe en su propia pestaña.

## Cómo leer la Hoja de cálculo

Cada fila es un estudiante (identificado por nombre + carrera) dentro de la pestaña de esa actividad. Las columnas muestran:

- **fases_completas**: cuántas fases terminó de esa actividad (ej. `4/7`).
- **misiones_completas**: el detalle más fino — cuántos retos totales completó (43 en Sistemas de Ecuaciones, 36 en la Parábola).
- **certificado**: "Sí" si ya terminó todo y puede descargar su constancia.
- **ultima_actualizacion**: la fecha/hora del último guardado.
- **progreso_json**: el detalle completo (no hace falta leerlo, es el respaldo técnico que usa la app para restaurar el avance).

## Cosas a tener en cuenta

- **La identificación es por nombre + carrera, dentro de cada actividad.** Si dos estudiantes escriben su nombre distinto entre sesiones (por ejemplo "Ana" vs "Ana María"), el sistema los tratará como personas distintas y no va a "reconocerlos". Pídeles que siempre usen el mismo nombre completo.
- Si dos estudiantes tuvieran exactamente el mismo nombre y carrera, compartirían la misma fila (y el mismo avance) **dentro de esa actividad**. Si esto te preocupa para tu grupo, se puede ajustar para pedir también un código de estudiante — solo avísame y lo agrego.
- Si no configuras la URL (dejas el texto `PEGA_AQUI_TU_URL_DE_APPS_SCRIPT` tal como está) en alguno de los archivos, esa actividad sigue funcionando exactamente igual que antes, solo que sin este respaldo adicional.
- Este respaldo es independiente del guardado local del navegador: ambos siguen funcionando juntos, así que aunque falle la conexión a internet un momento, el estudiante no pierde lo que ya resolvió en esa sesión.
- Si más adelante agregas una tercera actividad, avísame: solo hay que sumar un bloque nuevo dentro de `Code.gs` (con su propio nombre de pestaña y su propio conteo de misiones) sin tocar las que ya tienes funcionando.
