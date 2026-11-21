# legacy/

Código anterior de las certificaciones. **Solo referencia:** no se edita ni se despliega desde aquí (ver `CLAUDE.md`, sección 6).

## Cambios hechos al publicar el repositorio (21/11/2026)

Antes de hacer público el repositorio se retiraron dos datos de producción. Es la única modificación hecha a estos archivos:

| Dato | Se reemplazó por |
|---|---|
| Identificador del Apps Script de producción en `SHEET_API_URL` (13 archivos) | `URL_DE_PRODUCCION_RETIRADA` |
| PIN docente de `Code.gs`, guías y pruebas | `PIN-DE-EJEMPLO` |

Las pruebas antiguas interceptan `https://script.google.com/**`, así que siguen funcionando con el simulador `pruebas-playwright/mock.js`.

**Recomendación:** si el PIN real del Apps Script en producción sigue siendo el que traía la guía, cámbialo en el editor de Apps Script y vuelve a publicar. Cuando la plataforma nueva entre en uso, retira ese despliegue.
