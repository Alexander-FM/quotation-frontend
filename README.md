# Quotation Frontend (HTML/CSS/JS/jQuery/Bootstrap)

Arquitectura ligera sin build, organizada por dominios y preparada para consumir el gateway en Kubernetes.

## Estructura

```
src/
  css/
    styles.css
  js/
    app/
      main.js
      router.js
      state.js
      utils.js
    config/
      env.js
    services/
      apiClient.js
      catalogService.js
      customerService.js
      employeeService.js
      materialService.js
      quotationService.js
  views/
    dashboard.html
    catalogs/
      items.html
      units.html
      factor-adjustments.html
    customers/
      list.html
    employees/
      list.html
    materials/
      list.html
    quotations/
      list.html
      detail.html
      modules.html
index.html
```

## Configuración

- Edita `src/js/config/env.js` y define `API_BASE_URL` del gateway.
- Asegura CORS habilitado en el gateway.

## Ejecutar localmente

Opción 1 (VS Code): extension Live Server.

Opción 2 (Node):

```bash
npx serve .
# o
npx http-server -p 5173
```

Luego abre `http://localhost:5173` (o el puerto que indique).

## Convenciones
- Dominios separados por carpeta en `views/` y servicios en `js/services/`.
- Router por hash carga vistas HTML en `#app`.
- Estilos mínimos en `css/styles.css`.
- Sin comentarios inline en código para mantener limpieza.
