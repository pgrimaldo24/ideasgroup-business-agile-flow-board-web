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
| `xlsx` / `exceljs` | Los reportes PDF y Excel se generan en el backend a partir de un único DTO y una única consulta. El frontend solo descarga el archivo resultante desde `GET /api/projects/{id}/reports/{format}` |
| `file-saver` | La descarga se resuelve con la API nativa `Blob` + `URL.createObjectURL` en `FileDownloadService`, lo que además permite leer la cabecera `Content-Disposition` para obtener el nombre de archivo real |

---

## Arquitectura del frontend

Arquitectura **hexagonal (puertos y adaptadores)** con un único hexágono central en `core/`. Las features son el adaptador de entrada; la infraestructura, el de salida.

```
src/
├─ environments/                      configuración externa (build-time)
└─ app/
   ├─ app/                            arranque: componente raíz, providers y rutas
   │  ├─ app.component.*              mínimo, solo aloja el router-outlet
   │  ├─ app.config.ts                composición de dependencias
   │  └─ app.routes.ts
   │
   ├─ core/
   │  ├─ domain/                      ← el hexágono: sin Angular, sin HttpClient
   │  │  ├─ models/                   Project, BoardColumn, KanbanTask, User
   │  │  └─ services/                 lógica pura (p. ej. task-ordering)
   │  ├─ application/
   │  │  ├─ ports/                    interfaces que el dominio necesita
   │  │  └─ use-cases/                orquestación de la lógica de negocio
   │  └─ infrastructure/              ← adaptadores concretos
   │     ├─ http/                     adaptadores REST
   │     ├─ signalr/                  adaptador de tiempo real
   │     ├─ interceptors/             JWT y manejo de 401
   │     ├─ guards/                   guard de sesión
   │     └─ config/                   token APP_CONFIG
   │
   ├─ layout/                         shell de Sakai
   │  └─ app-layout/  app-topbar/  app-sidebar/  app-menu/
   │
   ├─ features/                       ← adaptador de entrada: UI
   │  ├─ auth/login/
   │  ├─ projects/project-list/  projects/components/
   │  └─ board/  board/components/{column, task-card}/
   │
   └─ shared/                         reutilizable, sin conocer ninguna feature
      └─ ui/  directives/  pipes/  utils/
```

**Reglas de dependencia**

| Capa | Puede depender de | Regla |
|---|---|---|
| `core/domain` | nada | TypeScript puro, sin decoradores ni imports de Angular. Se prueba sin `TestBed` |
| `core/application` | `core/domain` | Define los puertos y los casos de uso. Depende de interfaces, nunca de implementaciones |
| `core/infrastructure` | `core/application`, `core/domain` | Implementa los puertos. Única capa que conoce URLs, DTOs y librerías externas |
| `features` | `core/application`, `shared` | Solo renderiza e invoca casos de uso. Nunca inyecta `HttpClient` ni contiene lógica de negocio |

La inversión de dependencias se materializa con tokens de inyección: un caso de uso declara que necesita un `ProjectRepositoryPort`, y en `app.config.ts` se enlaza ese token con el adaptador HTTP concreto. Sustituir el adaptador —o proveer uno falso en pruebas— no obliga a tocar el dominio.

Los componentes de `features/*/components/` se construyen como presentacionales puros (`@Input` / `@Output`, `OnPush`, sin inyectar servicios de negocio) para poder reutilizarse.

### Alias de importación

Definidos en `tsconfig.json` para evitar rutas relativas frágiles:

| Alias | Ruta |
|---|---|
| `@core/*` | `src/app/core/*` |
| `@layout/*` | `src/app/layout/*` |
| `@shared/*` | `src/app/shared/*` |
| `@features/*` | `src/app/features/*` |
| `@env/*` | `src/environments/*` |

### Rutas

Todas las features se cargan de forma diferida, generando un chunk independiente por página.

| Ruta | Destino |
|---|---|
| `/` | Redirige a `/projects` |
| `/auth/login` | Inicio de sesión |
| `/projects` | Listado de proyectos |
| `/projects/:projectId/board` | Tablero kanban del proyecto |
| `**` | Página 404 |

El router se registra con `withComponentInputBinding()`, de modo que `:projectId` se enlaza directamente al `@Input` del componente sin inyectar `ActivatedRoute`.

### Configuración externa

`src/environments/environment.ts` (producción) y `environment.development.ts` (desarrollo), intercambiados mediante `fileReplacements`. El valor se registra en el inyector a través del token `APP_CONFIG`, no se importa directamente en los servicios: así ningún componente ni servicio contiene direcciones embebidas y las pruebas pueden proveer otra configuración.

En producción las URLs son **relativas** (`/api`, `/hubs`) porque nginx hace de proxy hacia el backend; la misma imagen Docker sirve para cualquier entorno.

---

## Funcionalidad implementada

### Autenticación y sesión

Login contra `POST /api/auth/login`. El token JWT y su `expiresAtUtc` se guardan en `sessionStorage` (no `localStorage`: la sesión no debe sobrevivir al cierre de la pestaña) a través de `SessionStore`, que programa un `setTimeout` para cerrar la sesión exactamente cuando el token expira, sin esperar a que una petición falle con 401.

- `authGuard` / `guestGuard` protegen las rutas del tablero y bloquean el acceso a `/auth/login` con sesión activa.
- `authInterceptor` adjunta `Authorization: Bearer` a cada petición y, ante un 401 con sesión activa, cierra sesión y redirige al login.
- `withComponentInputBinding()` enlaza `:projectId` de la URL directamente al `@Input` del componente del tablero.

### Proyectos

CRUD parcial (crear y listar, según lo que exige el reto) contra `GET/POST /api/projects`, con paginación y filtro por nombre **resueltos en servidor** — el buscador del topbar aplica `debounceTime` y dispara la búsqueda contra la API, no filtra en el cliente.

### Columnas del flujo de trabajo

CRUD completo, sin nombres de fase fijos en el código: cada proyecto define las columnas que necesita desde la interfaz.

| Acción | Endpoint |
|---|---|
| Listar | `GET /api/projects/{projectId}/columns` |
| Crear | `POST /api/projects/{projectId}/columns` |
| Renombrar | `PUT /api/columns/{columnId}` |
| Eliminar | `DELETE /api/columns/{columnId}` |
| Reordenar | `PATCH /api/columns/{columnId}/reorder` |

Renombrado in-place (clic en el lápiz del header, confirma con Enter o al perder el foco), eliminación con diálogo de confirmación que traduce el 409 del backend ("columna con tareas") a un mensaje explícito, y reordenamiento por arrastre horizontal con actualización optimista.

### Tareas y tablero kanban

Alta desde el popup "Crear tarea" (`POST /api/columns/{columnId}/tasks`) y reordenamiento por arrastre — dentro de una columna o entre columnas — contra `PATCH /api/tasks/{taskId}/reorder`.

Las tareas de un proyecto **no** se cargan desde el campo `tasks` embebido en `BoardColumnDto`: ese campo llega vacío en la respuesta real del backend aunque el swagger lo documenta. En su lugar, `ColumnHttpAdapter.listByProject` pide primero las columnas y luego, por cada una, sus tareas con `GET /api/columns/{columnId}/tasks`, combinando ambas respuestas con `forkJoin`. Es la fuente de verdad explícita en vez de un campo anidado opcional.

### Drag & drop y actualización optimista

Angular CDK en lugar de las directivas de PrimeNG: `cdkDropListGroup` conecta listas automáticamente, y `CdkDragDrop` entrega el índice de destino ya calculado, que alimenta directamente `TaskOrderingService` (lógica pura en `core/domain/services/`, sin Angular, cubierta por pruebas unitarias — incluye el caso obligatorio del reto: cálculo de la nueva posición al reordenar).

Tanto el movimiento de tareas como el de columnas siguen el mismo patrón en `BoardStore`: se aplica el cambio al estado local de inmediato (optimista), se envía la petición, y si falla se restaura el snapshot previo y se muestra una alerta descartable. Las directivas `pDraggable` / `pDroppable` de PrimeNG se descartaron por requerir conexión manual entre listas.

### Tiempo real

SignalR (`@microsoft/signalr`) contra el hub `/hubs/board`, autenticado con el mismo JWT de la sesión vía `accessTokenFactory`. `BoardSignalrAdapter` traduce los eventos del servidor (`TaskCreated`, `TaskUpdated`, `TaskMoved`, `TaskDeleted`) a un modelo de dominio propio (`BoardRealtimeEvent`) antes de que lleguen a `BoardStore`, que nunca conoce SignalR directamente — solo el puerto `BoardRealtimePort`.

Al entrar al tablero, `BoardStore.connect()` se suscribe al grupo del proyecto (`SubscribeToBoard`) y se desuscribe (`UnsubscribeFromBoard`) al salir, evitando conexiones huérfanas.

Alternativas descartadas: WebSocket crudo (exige construir agrupación por proyecto y reconexión a mano) y Server-Sent Events (unidireccional, sin agrupación nativa). SignalR resuelve ambas de fábrica y empareja naturalmente con un backend .NET.

### Componentes reutilizables (`shared/ui/`)

`button`, `text-input`, `select-input`, `card`, `form-group`, `dialog`, `avatar`, `tag`. Todos presentacionales (`@Input`/`@Output`, `OnPush`), sin inyectar servicios de negocio. `text-input` y `select-input` implementan `ControlValueAccessor` para integrarse con Reactive Forms como cualquier control nativo.

### Generación de reportes

Descarga contra `GET /api/projects/{projectId}/reports/{format}`, con `format` en `pdf` o `xlsx`. El frontend actúa solo como consumidor: PDF y Excel se generan en el backend a partir de un único DTO y una única consulta, así que ambos formatos siempre reflejan los mismos datos.

- `ApiClient.getBlob()` pide la respuesta como `Blob` con acceso a cabeceras (`observe: 'response'`).
- `extractFileName()` (`core/infrastructure/http/report/content-disposition.util.ts`) parsea `Content-Disposition` — soporta `filename*=UTF-8''...` (RFC 5987, para nombres con acentos o espacios) y `filename="..."` simple, con un nombre de reserva (`reporte.pdf` / `reporte.xlsx`) si el backend no envía la cabecera. Lógica pura, cubierta por pruebas unitarias sin `TestBed`.
- `FileDownloadService` (`shared/utils/`) dispara la descarga real del blob mediante un enlace temporal (`URL.createObjectURL` + click + `URL.revokeObjectURL`), reutilizable para cualquier descarga futura de la aplicación.
- Dos botones independientes ("PDF" / "Excel") en el header del tablero, cada uno con su propio estado de carga; ambos se deshabilitan mientras cualquiera de los dos descarga, para evitar disparos simultáneos.

---

## Nota de seguridad sobre dependencias

`npm audit --omit=dev` reporta 10 vulnerabilidades de severidad alta, todas localizadas en **`@angular/core` 17.3.12** (XSS vía i18n, bypass de sanitización de namespaces, DOM clobbering en hidratación). No provienen de las librerías añadidas al proyecto.

La única corrección disponible es actualizar a Angular 22, lo que contradice el stack obligatorio del ejercicio. Se verificó que ninguno de los vectores aplica a la superficie de esta aplicación: no se emplea i18n en atributos, ni renderizado dinámico de componentes desde entrada de usuario, ni hidratación con SSR.

---

## Pruebas unitarias

39 pruebas (Karma + Jasmine), ejecutables con `npm test`:

| Suite | Qué cubre |
|---|---|
| `task-ordering.service.spec.ts` | Cálculo puro de la nueva posición al reordenar — misma columna, entre columnas, columna vacía, índice fuera de rango. Cubre el caso obligatorio del reto |
| `board.store.spec.ts` | Carga del tablero, creación/renombrado/eliminación/reorden de columnas con reversión ante error, creación y reorden de tareas, aplicación de eventos de tiempo real, filtro de búsqueda |
| `session.store.spec.ts` | Persistencia de sesión, expiración automática por `expiresAtUtc` |
| `auth.guard.spec.ts` | Bloqueo de rutas sin sesión válida |
| `content-disposition.util.spec.ts` | Extracción del nombre de archivo desde `Content-Disposition` en sus variantes, y el nombre de reserva cuando falta la cabecera |
| `app.component.spec.ts` | Arranque del componente raíz |

---

## Declaración de uso de asistentes de IA

Se utilizó **Claude Code (Anthropic)** como asistente durante todo el desarrollo. Alcance:

- Análisis del enunciado y planificación de la arquitectura hexagonal del frontend.
- Selección y verificación de compatibilidad de versiones de dependencias.
- Implementación de la estructura de carpetas, rutas, autenticación, CRUD de proyectos/columnas/tareas, tablero kanban con drag & drop, integración con SignalR y pruebas unitarias, siguiendo instrucciones y contratos de API (OpenAPI, endpoints de SignalR) proporcionados en cada paso.
- Redacción de este README.

Todas las decisiones de arquitectura, los contratos de API y las correcciones de comportamiento fueron dirigidas y validadas por el desarrollador en cada iteración.

---

## Estado del desarrollo

- [x] Andamiaje del proyecto Angular 17 y arquitectura hexagonal de carpetas
- [x] Instalación y verificación de dependencias
- [x] Configuración externa por archivos de entorno
- [x] Autenticación: login contra la API, guard de ruta, interceptor JWT y expiración automática de sesión
- [x] Shell de la aplicación: topbar, barra lateral y menú, con buscador y acción "Crear" contextuales a la página activa
- [x] Componentes reutilizables: botón, campo de texto, select, tarjeta, grupo de formulario, diálogo, avatar y etiqueta
- [x] Gestión de proyectos: listar con paginación y filtro en servidor, crear
- [x] Columnas configurables del flujo de trabajo: crear, renombrar, eliminar, reordenar
- [x] Gestión de tareas: crear, mover entre columnas
- [x] Tablero kanban con drag & drop, actualización optimista y reversión visible
- [x] Sincronización en tiempo real vía SignalR
- [x] Descarga de reportes PDF y Excel a partir de una única fuente de datos
- [x] Búsqueda de tareas por texto en el tablero (opcional)
- [x] Pruebas unitarias (39, incluida la del cálculo de posición)
- [ ] Edición y eliminación de proyectos
- [ ] Edición y eliminación de tareas desde el tablero
- [ ] Filtros por responsable y prioridad (opcional)
- [ ] Indicador de usuarios conectados (opcional)
- [ ] Dockerización con nginx
