# Quotation Frontend Angular

Sistema administrativo de cotizaciones desarrollado con Angular 13 y PrimeNG para consumir microservicios en Kubernetes.

## 🏗️ Arquitectura

```
src/app/
├── core/services/        # Servicios HTTP para gateway
│   ├── catalog.service.ts
│   ├── customer.service.ts
│   ├── employee.service.ts
│   ├── material.service.ts
│   └── quotation.service.ts
├── features/             # Módulos con lazy loading
│   ├── dashboard/
│   ├── catalogs/         # Items, Unidades, Factores
│   ├── customers/
│   ├── employees/
│   ├── materials/
│   └── quotations/
└── app.component.ts      # Layout con menubar y sidebar
```

## ⚙️ Stack Tecnológico

- Angular 13.3.0
- PrimeNG 13.4.1 (componentes UI)
- PrimeIcons 5.0.0
- PrimeFlex 3.2.1 (utilidades CSS)
- TypeScript + SCSS

## 🚀 Instalación y Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar API

Edita `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'https://tu-gateway-k8s.com'
};
```

### 3. Ejecutar desarrollo

```bash
ng serve
```

Abre http://localhost:4200

## 📦 Servicios Implementados

| Servicio | Endpoints |
|----------|-----------|
| **CatalogService** | `/catalogs/items`, `/catalogs/units`, `/catalogs/factor-adjustments` |
| **CustomerService** | CRUD `/customers` |
| **EmployeeService** | CRUD `/employees` |
| **MaterialService** | CRUD `/materials` |
| **QuotationService** | CRUD `/quotations` + detalles, módulos, subitems |

## 🎨 Componentes PrimeNG Usados

- `p-table` - Tablas con paginación y ordenamiento
- `p-dialog` - Formularios modales
- `p-toolbar` - Barras de acción
- `p-toast` - Notificaciones
- `p-menubar` / `p-panelMenu` - Navegación

## 📝 Comandos Útiles

```bash
# Crear componente
ng generate component features/catalogs/mi-comp --skip-tests

# Build producción
ng build --configuration production

# Ejecutar tests
ng test
```

## 🔐 Autenticación (Pendiente)

Para JWT, implementa:
1. `AuthService` en `core/services/`
2. `HttpInterceptor` para token automático
3. Guard para proteger rutas

## 📱 Responsive

PrimeFlex proporciona:
- `col-12` → 100% móvil
- `md:col-6` → 50% tablet  
- `lg:col-3` → 25% desktop

## 📋 Próximos Pasos

- [ ] Formularios reactivos con validaciones
- [ ] Interceptor de errores HTTP
- [ ] Autenticación JWT
- [ ] Detalle de cotización con subitems
- [ ] Exportar a PDF/Excel

## 📚 Recursos

- [Angular 13](https://v13.angular.io/docs)
- [PrimeNG 13](https://v13.primefaces.org/primeng/showcase)
- [PrimeFlex](https://www.primefaces.org/primeflex/)

---

**Proyecto generado con Angular CLI 13.3.0**
