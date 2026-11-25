# Modelo de datos, roles y seguridad — H1

- **Estado:** Aceptado (decisiones de la responsable del 21/11/2026, sección 7)
- **Fecha:** 2026-11-21
- **Alcance:** lo que necesita el hito H1: identidad, roles, periodos, secciones, matrícula e importación desde Moodle. Las tablas de avance, rondas y recursos llegan en H2, H3 y H4b, y se agregan a este documento entonces.

## 1. Datos de partida (confirmados por la responsable)

- Dominio institucional: **`@continental.edu.pe`**. Estudiantes y docentes usan cuentas Google de ese dominio.
- Moodle exporta el **correo** y los **nombres completos** del estudiante; los **grupos** solo si el aula los tiene configurados.
- El correo del estudiante es **`DNI@continental.edu.pe`**: el DNI hace de código de estudiante.

### Consecuencia: el correo es un dato sensible

Como el correo contiene el **DNI**, tratarlo como un identificador personal (Ley 29733):

1. **Nunca** se muestra a otros estudiantes (ranking, sala, duelos): ahí solo va el nombre y la inicial del apellido (D18).
2. Solo lo ven la propia persona, sus docentes y la administradora; aparece en el registro auxiliar porque la docente lo necesita para cruzar notas.
3. No se envía a servicios externos: el registro de errores (Sentry) y la analítica deben quitarlo.
4. Nunca va en una URL ni en un parámetro de consulta.
5. **Datos de prueba:** la semilla usa el dominio ficticio `@ejemplo.test` y números que no son DNI posibles (por ejemplo `T0000001`), para no inventar por accidente el DNI de una persona real.

## 2. Roles

| Rol | Quién | Cómo se asigna |
|---|---|---|
| `administrador` | Flor al inicio | Por migración/semilla en cada ambiente (no desde la interfaz) |
| `docente` | Docentes del curso | La administradora los da de alta por correo |
| `estudiante` | Todo el que entra con una cuenta del dominio | Por defecto en el primer inicio de sesión |

Un docente es también una cuenta `@continental.edu.pe` (sin formato DNI). Un correo con formato DNI nunca se promueve automáticamente a docente.

## 3. Tablas

| Tabla | Para qué | Campos principales |
|---|---|---|
| `perfiles` | Una fila por persona con cuenta (1:1 con `auth.users`) | `id` (= `auth.users.id`), `correo` (único, en minúsculas), `nombres`, `apellidos`, `rol`, `carrera` (`derecho`, `psicologia`, `otra`, o vacío), `consentimiento_en`, `creado_en` |
| `dominios_permitidos` | Dominios que pueden entrar | `dominio` (`continental.edu.pe` en producción; `ejemplo.test` solo en local) |
| `periodos` | Semestres | `id`, `nombre` (p. ej. «2026-II»), `inicio`, `fin`, `activo` |
| `secciones` | Grupo de clase de **un** docente | `id`, `periodo_id`, `docente_id`, `nombre` (p. ej. NRC o «Derecho A»), `creado_en` |
| `matriculas` | Quién está en qué sección (una sola por periodo) | `seccion_id`, `periodo_id`, `correo`, `estudiante_id` (vacío hasta que la persona inicie sesión), `nombres_moodle`, `grupo_moodle`, `origen` (`moodle` o `manual`), `creado_en` |

Además, la **función** `ranking_nombres(seccion)` devuelve solo `estudiante_id` y `nombre_ranking` («María Q.») a quien está matriculado en esa sección, la dicta o es administradora. El ranking nunca lee `perfiles` directamente. *(Se implementó como función y no como vista porque una vista no puede saltarse la seguridad por fila de `perfiles` de forma controlada.)*

### Cómo se nombra a la administradora en cada ambiente

El rol `administrador` no se puede asignar desde la interfaz. Después de que la responsable inicie sesión por primera vez en un ambiente (staging o producción), se ejecuta una vez en el editor SQL de ese proyecto de Supabase:

```sql
update public.perfiles set rol = 'administrador' where correo = '<correo institucional de la responsable>';
```

Desde entonces, la administradora da de alta a los docentes con `asignar_rol(correo, 'docente')`. En local, la semilla ya crea `admin@ejemplo.test`.

`unidades`, `semanas`, `recursos`, `intentos_reto`, `progreso_fase`, `rondas` y demás se agregan en sus hitos (H2, H3, H4b).

### Matrícula antes del primer inicio de sesión

La docente importa el CSV de Moodle **antes** de que los estudiantes entren. Por eso `matriculas` guarda el **correo** y no exige `estudiante_id`. Cuando un estudiante inicia sesión por primera vez, un disparador enlaza sus matrículas por correo. Así:

- Nadie se registra «a mano» con un nombre libre (lección aprendida P4).
- Un estudiante que entra sin estar en ninguna lista ve un aviso («Pide a tu docente que te agregue») y no entra a ninguna sección.

### Importación de la lista de Moodle (esquema v3)

La docente sube el CSV en su panel; el archivo se lee **en el navegador** (`apps/web/src/moodle.ts`) y al servidor solo viajan correo, nombre y grupo. La función `importar_matriculas(seccion, filas)` (máximo 500 filas) devuelve el resultado de cada correo:

| Resultado | Significado |
|---|---|
| `agregado` | Se matriculó en la sección |
| `ya_estaba` | Ya estaba en la sección; se actualizan nombre y grupo de Moodle |
| `en_otra_seccion` | Ya está en otra sección del mismo periodo: **no se mueve** (una sección por periodo) |
| `dominio_no_permitido` | No es un correo institucional |

Solo la docente de la sección o la administradora pueden importar.

### Nombre para el ranking

Google entrega el nombre y el apellido por separado (`given_name`, `family_name`). Se guardan en `nombres` y `apellidos`; `nombre_ranking` = primer nombre + inicial del primer apellido. Si el nombre de Moodle y el de Google difieren, gana el de Google (es el de la cuenta).

## 4. Inicio de sesión

1. **Google** con el parámetro `hd=continental.edu.pe` (solo ofrece cuentas del dominio).
2. Respaldo: **enlace por correo** (magic link) a la misma dirección institucional.
3. **Verificación en servidor**, porque `hd` se puede saltar desde el navegador: un *hook* de Supabase Auth («before user created») rechaza cualquier correo cuyo dominio no esté en `dominios_permitidos`.
4. Al crearse la cuenta, un disparador crea su fila en `perfiles` con rol `estudiante` y enlaza sus matrículas.
5. En el primer ingreso se muestra el **aviso de privacidad** y se pide el consentimiento (`consentimiento_en`). Sin consentimiento no se guarda avance. *(El texto del aviso lo aporta la responsable con la Universidad.)*

## 5. Seguridad por fila (RLS)

Funciones auxiliares (`security definer`, sin exponer datos): `es_admin()`, `es_docente()`, `dicta_seccion(seccion_id)`, `esta_matriculado(seccion_id)`.

| Tabla | Estudiante | Docente | Administradora |
|---|---|---|---|
| `perfiles` | Lee y edita **su** fila (solo `carrera` y consentimiento; nunca `rol` ni `correo`) | Lee los perfiles de estudiantes matriculados en **sus** secciones | Todo |
| `periodos` | Lee | Lee | Todo |
| `secciones` | Lee las secciones donde está matriculado | Lee y edita **sus** secciones; crea secciones a su nombre | Todo |
| `matriculas` | Lee **sus** matrículas | Todo dentro de **sus** secciones (incluida la importación) | Todo |
| `dominios_permitidos` | — | — | Todo |

Nadie puede cambiar su propio rol. Ningún estudiante puede leer el correo de otro.

## 6. Pruebas de aceptación de H1 (pgTAP y Playwright)

Con datos **ficticios**: 2 docentes, 3 secciones, 6 estudiantes.

1. Un estudiante no lee el perfil, el correo ni las matrículas de otro.
2. **Un docente no ve las secciones, matrículas ni estudiantes de otro docente** (criterio de salida de H1).
3. Un estudiante no puede cambiar su rol ni su correo.
4. Una cuenta de un dominio no permitido no se crea.
5. Importar un CSV de Moodle crea matrículas por correo; al iniciar sesión, el estudiante queda enlazado.
6. El ranking muestra «Nombre I.» y nunca el correo ni el apellido completo.
7. Todas las migraciones tienen su reversión y `supabase db reset` deja la base desde cero.
8. Un estudiante no puede quedar matriculado en dos secciones del mismo periodo.

## 7. Decisiones de la responsable (21/11/2026)

1. **Carrera:** el estudiante la elige una vez en su primer ingreso; la docente puede corregirla.
2. **Grupos de Moodle:** un CSV por sección; el grupo, si viene, se guarda solo como referencia (`grupo_moodle`) y la sección la elige la docente al importar.
3. **Un estudiante no puede estar en dos secciones a la vez.** Se impide en la base de datos: `matriculas` guarda también el `periodo_id` (debe coincidir con el de la sección) y hay una restricción única por (`periodo_id`, `correo`). Para cambiarlo de sección, la docente o la administradora mueve la matrícula; no se crea una segunda.
