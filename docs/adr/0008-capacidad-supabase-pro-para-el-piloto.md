# ADR-0008 — Capacidad de Supabase Pro para el piloto

- **Estado:** Aceptada (aprobada por la responsable el 2026-11-21)
- **Fecha:** 2026-11-21
- **Decide:** Flor Tapia

## Contexto
El piloto tendrá de 5 a 10 docentes y de 300 a 500 estudiantes, con hasta 300 estudiantes a la vez en sala y 1 000 como meta de diseño (sección 3.2). ADR-0001 y D14 fijan producción en el plan Pro de Supabase. Hay que comprobar que sus cuotas alcanzan.

## Cifras oficiales (consultadas el 21/11/2026)
Fuentes: [precios](https://supabase.com/pricing), [límites de Realtime](https://supabase.com/docs/guides/realtime/limits), [copias de seguridad](https://supabase.com/docs/guides/platform/backups), [cómputo y disco](https://supabase.com/docs/guides/platform/compute-and-disk), [límites de Edge Functions](https://supabase.com/docs/guides/functions/limits). La página de precios advierte que pueden cambiar.

| Recurso | Pro | Gratuito (comparación) |
|---|---|---|
| Precio | desde USD 25/mes; incluye USD 10/mes de cómputo (una instancia Micro) | USD 0 |
| Pausa por inactividad | **Nunca** | Tras 1 semana sin actividad |
| Conexiones simultáneas de Realtime (pico) | 500 incluidas, luego USD 10 por cada 1 000 | 200 |
| Mensajes de Realtime por segundo | 500 | 100 |
| Mensajes de Realtime por mes | 5 millones, luego USD 2,50 por millón | 2 millones |
| Canales por conexión | 100 | 100 |
| Mensajes de presencia por segundo | 50 | 20 |
| Base de datos | 8 GB de disco, luego USD 0,125 por GB | 500 MB |
| Usuarios activos al mes | 100 000 | 50 000 |
| Invocaciones de Edge Functions | 2 millones/mes, luego USD 2 por millón | 500 000 |
| Límite de una Edge Function | 400 s de reloj, 2 s de CPU, 256 MB | 150 s de reloj |
| Copias de seguridad | Diarias, se conservan 7 días | No incluidas |
| Recuperación a un instante (PITR) | Complemento: ≈ USD 100/mes por 7 días (reemplaza las copias diarias) | No disponible |
| Cómputo Micro | 1 GB RAM; 60 conexiones directas; 200 clientes en el *pooler* | — |
| Tope de gasto | Activado por defecto; al desactivarlo se paga el exceso | — |

Los límites de Realtime se pueden ampliar pidiéndolo a soporte o desactivando el tope de gasto (la columna «Pro sin tope de gasto» indica 10 000 conexiones y 2 500 mensajes por segundo).

## Análisis frente al piloto
- **Conexiones simultáneas (500).** Cada pestaña abierta de un estudiante o docente es una conexión. 300 en sala cabe con margen. El caso límite es que varias secciones tengan clase a la misma hora (por ejemplo 10 secciones × 45 = 450): cabe, pero cerca del límite. La meta de 1 000 **no cabe** con el tope de gasto activado.
- **Mensajes por segundo (500).** La sala solo emite eventos de la docente (abrir, iniciar, siguiente pregunta, cerrar). Un evento a 300 estudiantes son 300 mensajes entregados en ese segundo: cabe. Las respuestas **no** viajan por Realtime: van a la función `submit_answer` (ADR-0004), así no consumen esta cuota.
- **Presencia (50 mensajes por segundo).** Si 300 estudiantes entran a la vez y cada uno publica su presencia, se supera el límite. Diseño para H3: la presencia la publica solo la docente; el conteo de conectados sale de la base de datos o de un canal agregado, no de la presencia individual.
- **Mensajes al mes (5 millones).** Estimación holgada: 500 estudiantes × 16 semanas × 2 rondas × 50 eventos ≈ 0,8 millones. Cabe.
- **Edge Functions (2 millones).** 500 estudiantes × (33 retos × 8 certificaciones × 3 intentos + 50 respuestas de rondas) ≈ 0,4 millones al año. Cabe.
- **Base de datos (8 GB) y usuarios (100 000).** Muy por encima de lo necesario.
- **Conexiones a la base (Micro).** El front no se conecta directamente a la base; las funciones usan el *pooler* (200 clientes). Cabe.
- **Copias de seguridad.** 7 días de copias diarias bastan para el piloto. No se contrata PITR. Además se hará una exportación semanal con `supabase db dump`, guardada fuera de Supabase (plan de recuperación, hito de operación).

## Decisión
1. Producción en **Supabase Pro con cómputo Micro y tope de gasto activado** durante el piloto. Costo esperado: **USD 25/mes**.
2. La sala en vivo se diseña para no depender de la presencia individual de cada estudiante (ver análisis).
3. Antes de pasar de unas 450 conexiones simultáneas previstas (o de la meta de 1 000), se revisa esta ADR: desactivar el tope de gasto (USD 10 por cada 1 000 conexiones extra) o pedir el aumento a soporte.
4. Ambiente de pruebas (`staging`) en un proyecto gratuito: se acepta que se pause tras una semana sin uso; se reactiva a mano antes de probar.
5. Prueba de carga de H3: 300 clientes simulados y además un escenario de 450 en varias salas a la vez.

## Alternativas consideradas
- **Plan gratuito en producción:** se pausa tras una semana y solo admite 200 conexiones. Descartado.
- **Pro con PITR desde el inicio:** USD 100/mes adicionales; no se justifica con «empezar de cero» (D16) y copias diarias de 7 días.
- **Cómputo mayor que Micro:** no hace falta mientras el front no abra conexiones directas a la base.

## Consecuencias
- El costo se mantiene en USD 25/mes mientras no se superen 500 conexiones simultáneas.
- Hay que vigilar el pico de conexiones en el panel de uso de Supabase durante el piloto.
- Si Supabase cambia los precios o límites, se actualiza esta ADR (riesgo R7).
