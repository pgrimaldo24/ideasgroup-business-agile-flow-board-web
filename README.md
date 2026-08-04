# AgileFlowBoard — Frontend

Aplicación web para la gestión de proyectos ágiles: administración de proyectos, configuración del flujo de trabajo por columnas y tablero kanban con sincronización en tiempo real.

Este repositorio contiene el **frontend en Angular 17**. El backend (.NET 8) se distribuye por separado.

---

## Stack

| Componente | Tecnología |
|---|---|
| Framework | Angular 17.3 (standalone components) |
| Lenguaje | TypeScript 5.4 |
| Estilos | SCSS |
| Componentes UI | PrimeNG 17 + plantilla Sakai |
| Drag & drop | Angular CDK |
| Tiempo real | SignalR (cliente JavaScript) |
| Pruebas | Karma + Jasmine |

---

## Requisitos previos

- **Node.js** `^18.13.0` o `^20.9.0` (rango soportado por Angular 17)
- **npm** 9 o superior

---

## Instalación y ejecución

```bash
npm install          # instala dependencias
npm start            # servidor de desarrollo en http://localhost:4200/
npm run build        # build de producción en dist/agile-flow-board
npm test             # pruebas unitarias
```

---

## Dependencias del proyecto

Todas las versiones se instalaron **fijadas explícitamente**, no con `latest`. Los paquetes del ecosistema PrimeNG y SignalR tienen versiones más recientes que se instalan sin error de compilación pero pertenecen a generaciones posteriores y fallan en tiempo de ejecución o de estilos con Angular 17.

### Producción

| Paquete | Versión | Propósito | Por qué esta versión |
|---|---|---|---|
| `primeng` | 17.18.15 | Librería de componentes UI | Última release de la línea 17. PrimeNG 18+ introduce cambios incompatibles con Angular 17 |
| `primeicons` | 7.0.0 | Set de iconos usado por PrimeNG y Sakai | La v8 acompaña a PrimeNG 18+ y cambia nomenclatura de clases |
| `primeflex` | 3.3.1 | Utilidades CSS del layout Sakai | La v4 reescribe el sistema de utilidades para PrimeNG 18+ |
| `@angular/cdk` | 17.3.10 | Drag & drop del tablero kanban | Alineada con el major de Angular instalado |
| `@microsoft/signalr` | 8.0.29 | Cliente del canal de tiempo real | Serie 8.x para emparejar con el servidor .NET 8 |

Dependencias heredadas del andamiaje de Angular CLI: `@angular/{animations,common,compiler,core,forms,platform-browser,platform-browser-dynamic,router}` 17.3, `rxjs` 7.8, `tslib` 2.3, `zone.js` 0.14.

### Desarrollo

`@angular/cli` y `@angular-devkit/build-angular` 17.3.17, `@angular/compiler-cli` 17.3, `typescript` 5.4, `karma` 6.4 con `karma-jasmine` / `karma-coverage` / `karma-chrome-launcher`, `jasmine-core` 5.1.

### Dependencias descartadas y su motivo

| Paquete | Motivo del descarte |
|---|---|
| `chart.js` | Lo arrastra la plantilla Sakai únicamente para sus páginas de demostración, que se eliminan del proyecto. Sumaría peso al bundle sin uso real |
| `xlsx` / `exceljs` | Los reportes PDF y Excel se generan en el backend a partir de un único DTO. El frontend solo descarga el archivo resultante |
| `file-saver` | La descarga se resuelve con la API nativa `Blob` + `URL.createObjectURL`, lo que además permite leer la cabecera `Content-Disposition` para obtener el nombre de archivo real |

---

## Decisiones técnicas tomadas hasta el momento

**Drag & drop con Angular CDK en lugar de las directivas de PrimeNG.** El CDK ofrece listas conectadas mediante `cdkDropListGroup`, y las utilidades `moveItemInArray` / `transferArrayItem` entregan los índices de origen y destino ya calculados, que son la entrada directa del algoritmo de posicionamiento de tareas. Incluye además soporte de teclado. Las directivas `pDraggable` / `pDroppable` de PrimeNG requieren gestionar manualmente la conexión entre listas.

**SignalR como canal de tiempo real.** Justificación y alternativas descartadas se documentan al implementarse.

**Generación de reportes en el backend.** El frontend actúa solo como consumidor de la descarga, manteniendo una única fuente de datos para ambos formatos.

---

## Nota de seguridad sobre dependencias

`npm audit --omit=dev` reporta 10 vulnerabilidades de severidad alta, todas localizadas en **`@angular/core` 17.3.12** (XSS vía i18n, bypass de sanitización de namespaces, DOM clobbering en hidratación). No provienen de las librerías añadidas al proyecto.

La única corrección disponible es actualizar a Angular 22, lo que contradice el stack obligatorio del ejercicio. Se verificó que ninguno de los vectores aplica a la superficie de esta aplicación: no se emplea i18n en atributos, ni renderizado dinámico de componentes desde entrada de usuario, ni hidratación con SSR.

---

## Declaración de uso de asistentes de IA

Se utiliza **Claude Code (Anthropic)** como asistente durante el desarrollo. Su alcance y las áreas específicas en las que intervino se detallan en esta sección conforme avanza el proyecto.

Hasta el momento: análisis del enunciado, selección y verificación de compatibilidad de versiones de dependencias, y redacción de este README.

---

## Estado del desarrollo

- [x] Andamiaje del proyecto Angular 17
- [x] Instalación y verificación de dependencias
- [ ] Integración de la plantilla Sakai y providers base
- [ ] Configuración externa por archivos de entorno
- [ ] Autenticación: login, guard de ruta e interceptor JWT
- [ ] Gestión de proyectos (CRUD, paginación y filtro en servidor)
- [ ] Columnas configurables del flujo de trabajo
- [ ] Gestión de tareas
- [ ] Tablero kanban con drag & drop y actualización optimista
- [ ] Sincronización en tiempo real
- [ ] Descarga de reportes PDF y Excel
- [ ] Pruebas unitarias
- [ ] Dockerización con nginx

---

## Pendiente de documentar

Secciones que se completan a medida que se implementan:

- Arquitectura del frontend y justificación de la separación por capas
- Tecnología de tiempo real elegida y alternativas descartadas
- Estrategia de índices de ordenamiento de tareas y columnas
- Patrón aplicado en la exportación dual PDF / Excel
- Diagrama del modelo de base de datos
- Instrucciones de ejecución con Docker Compose
