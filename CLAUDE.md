# CLAUDE.md — GymProAngular

> Este archivo es leído automáticamente por Claude Code al iniciar cualquier sesión.
> Contiene todo el contexto del proyecto, convenciones y la integración con Jira.

---

## 🏋️ Proyecto

**Nombre:** GymProAngular — Sistema de Gestión de Gimnasio  
**Objetivo:** Aplicación web para control integral de gimnasios (clientes, membresías, entrenamientos, inventario, ventas, equipamiento)  
**Tipo:** Proyecto de bootcamp individual — Digital Harbor Bolivia  
**Timeline:** 4 sprints × 2 semanas = 2 meses (meta: completar en 1 mes)

---

## 🛠 Stack Técnico

| Capa        | Tecnología                                               |
|-------------|----------------------------------------------------------|
| Backend     | NestJS + TypeORM + PostgreSQL                            |
| Frontend    | Angular 17+ (standalone) + Angular Material + Angular CDK |
| Auth        | JWT + Passport + bcrypt (salt 12) + reCAPTCHA v2         |
| Formularios | Angular Reactive Forms + Validators                      |
| Gráficos    | ng2-charts + Chart.js                                    |
| PDF         | pdfmake (generado en NestJS, descargado como blob)       |
| HTTP        | Angular HttpClient + Interceptors funcionales            |
| DevOps      | Docker + docker-compose + Kubernetes + Railway + Vercel  |
| Tests       | Jest (NestJS) + Karma/Jasmine (Angular)                  |

---

## 📁 Estructura del Proyecto

```
gymPro/
├── backend/                    # NestJS
│   ├── src/
│   │   ├── auth/               # JWT, guards, login, registro, captcha
│   │   ├── clientes/
│   │   ├── membresias/
│   │   ├── planes-membresia/
│   │   ├── entrenadores/
│   │   ├── ejercicios/
│   │   ├── planes-entrenamiento/
│   │   ├── inventario/         # productos + lotes
│   │   ├── ventas/
│   │   ├── equipamiento/
│   │   ├── reportes/
│   │   ├── dashboard/
│   │   ├── log-acceso/
│   │   └── shared/             # pipes, guards, decorators globales
│   ├── Dockerfile
│   └── .env.example
├── frontend/                   # Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/           # interceptors, guards, auth.service
│   │   │   ├── shared/         # componentes reutilizables, pipes
│   │   │   ├── layout/         # shell, sidenav, toolbar
│   │   │   ├── pages/
│   │   │   │   ├── login/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── clientes/
│   │   │   │   ├── membresias/
│   │   │   │   ├── entrenamiento/
│   │   │   │   ├── inventario/
│   │   │   │   ├── ventas/
│   │   │   │   ├── equipamiento/
│   │   │   │   ├── reportes/
│   │   │   │   └── log-acceso/
│   │   │   └── app.config.ts   # providers standalone
│   │   └── environments/
│   │       ├── environment.ts
│   │       └── environment.prod.ts
│   └── Dockerfile
├── k8s/
│   ├── namespace.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── postgres-deployment.yaml
│   ├── postgres-pvc.yaml
│   ├── configmap.yaml
│   └── secret.yaml
├── docker-compose.yml
├── .env.example
└── CLAUDE.md                   ← este archivo
```

---

## 🔗 Integración Jira

**Site:** `alvmauri534.atlassian.net`  
**Cloud ID:** `7630af83-9754-41bc-b4ea-89653136eeb5`  
**Proyecto:** `GMA` (GymProAngular)  
**URL Base API:** `https://api.atlassian.com/ex/jira/7630af83-9754-41bc-b4ea-89653136eeb5/rest/api/3`

### Configurar credenciales (una sola vez)

```bash
export JIRA_EMAIL="alvmauri534@gmail.com"
export JIRA_API_TOKEN="<tu-token-aquí>"
# Genera el token en: https://id.atlassian.com/manage-profile/security/api-tokens
```

### Comandos curl útiles para Claude Code

```bash
# Ver estado de una historia
curl -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  "https://api.atlassian.com/ex/jira/7630af83-9754-41bc-b4ea-89653136eeb5/rest/api/3/issue/GMA-26" \
  | jq '.fields.status.name'

# Ver transiciones disponibles de un issue (obtener IDs)
curl -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  "https://api.atlassian.com/ex/jira/7630af83-9754-41bc-b4ea-89653136eeb5/rest/api/3/issue/GMA-26/transitions" \
  | jq '.transitions[] | {id, name}'

# Mover issue a In Progress
curl -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  -X POST -H "Content-Type: application/json" \
  -d '{"transition": {"id": "21"}}' \
  "https://api.atlassian.com/ex/jira/7630af83-9754-41bc-b4ea-89653136eeb5/rest/api/3/issue/GMA-26/transitions"
```

> **Nota para Claude Code:** Siempre obtén los IDs de transición con el GET antes de transicionar.
> Los IDs varían por proyecto — no asumir que "21" = In Progress.

---

## 🌿 Convenciones Git

```bash
# Ramas — siempre incluir el issue key
feature/GMA-26-login-jwt-captcha
feature/GMA-30-crud-clientes
fix/GMA-27-bcrypt-salt
chore/GMA-39-docker-setup

# Commits — issue key al inicio
git commit -m "GMA-26: Implementar AuthModule con estrategia JWT y CAPTCHA"
git commit -m "GMA-30: CRUD clientes con eliminación lógica y paginación"

# PR description
# Closes GMA-26
```

**Ramas del repositorio:**
- `main` → producción (solo merge desde `develop`)
- `develop` → integración
- `feature/GMA-XX-descripcion` → desarrollo de historias

---

## ✅ Cómo verificar una historia de usuario

Cuando el usuario diga **"revisa GMA-XX"** o **"verifica GMA-XX"**, Claude Code debe:

1. Leer el código relevante de los archivos del proyecto
2. Comparar contra los criterios de aceptación listados abajo
3. Reportar qué criterios pasan ✓ y cuáles faltan ✗
4. Si todos pasan → preguntar si transiciona el issue a **Done** en Jira
5. Si faltan criterios → indicar exactamente qué falta, sin rodeos

---

## 📋 Backlog Completo — Criterios de Aceptación

### 🗂 Setup inicial (prerequisito de Sprint 1)

---

#### SETUP-BE · Inicializar proyecto NestJS
**Archivos clave:** `backend/src/app.module.ts`, `backend/src/shared/`, `backend/.env`

**Criterios:**
- [ ] `npm run start:dev` arranca sin errores
- [ ] Módulos separados por dominio (auth, clientes, membresias, etc.)
- [ ] TypeORM configurado con `TypeOrmModule.forRootAsync` y `ConfigService`
- [ ] Variables de entorno con `@nestjs/config`, nunca hardcodeadas
- [ ] `synchronize: false` — usar migraciones siempre
- [ ] `GET /health` retorna `{ status: 'ok' }`

---

#### SETUP-FE · Inicializar proyecto Angular standalone
**Archivos clave:** `frontend/src/app/app.config.ts`, `frontend/src/app/core/`

**Criterios:**
- [ ] `ng serve` arranca sin errores en `localhost:4200`
- [ ] Proyecto en modo standalone (sin NgModules en páginas)
- [ ] `provideRouter` con lazy loading configurado en `app.config.ts`
- [ ] `provideHttpClient(withInterceptors([authInterceptor]))` configurado
- [ ] `provideAnimations()` y `provideCharts(withDefaultRegisterables())` presentes
- [ ] `environments/environment.ts` con `apiUrl: 'http://localhost:3000'`
- [ ] `environments/environment.prod.ts` con la URL del backend en Railway

---

#### SETUP-DB · Migraciones TypeORM
**Archivos clave:** `backend/src/**/**.entity.ts`, `backend/src/migrations/`

**Criterios:**
- [ ] `npm run migration:run` ejecuta sin errores
- [ ] Todas las tablas existen en PostgreSQL (verificar con `\dt`)
- [ ] Entidades: CLIENTE, PLAN_MEMBRESIA, MEMBRESIA, ENTRENADOR, PLAN_ENTRENAMIENTO, EJERCICIO, RUTINA_DIA, RUTINA_EJERCICIO, PRODUCTO, LOTE, VENTA, VENTA_DETALLE, EQUIPO_GYM, MOVIMIENTO_EQUIPO, USUARIO, LOG_ACCESO
- [ ] Índices en todas las claves foráneas
- [ ] Columnas de fecha con `timezone: true` (Bolivia = UTC-4)
- [ ] Script de seed con datos de prueba: `npm run seed`

---

### Sprint 1 — Autenticación y Clientes

---

#### GMA-26 · HU-01: Login con JWT y CAPTCHA
**Archivos clave:** `backend/src/auth/`, `frontend/src/app/pages/login/`

**Criterios:**
- [ ] `POST /auth/login` recibe `{ email, password, captchaToken }` y retorna `{ accessToken }`
- [ ] Backend valida el token de reCAPTCHA contra `https://www.google.com/recaptcha/api/siteverify` antes de procesar
- [ ] CAPTCHA fallido retorna `400` con mensaje `"CAPTCHA inválido"`
- [ ] JWT payload contiene: `userId`, `email`, `rol`
- [ ] `accessToken` expira en 8h
- [ ] Máximo 5 intentos fallidos → usuario bloqueado 15 minutos
- [ ] Widget reCAPTCHA v2 visible en el formulario Angular
- [ ] CAPTCHA se resetea luego de intento fallido
- [ ] Token almacenado en `sessionStorage` (nunca `localStorage`)
- [ ] Formulario con `ReactiveFormsModule`, validaciones en tiempo real

---

#### GMA-27 · HU-02: Registro con fortaleza de contraseña
**Archivos clave:** `backend/src/auth/dto/register.dto.ts`, `frontend/src/app/shared/password-strength/`

**Criterios:**
- [ ] Indicador visual en tiempo real: DÉBIL (rojo) / INTERMEDIO (amarillo) / FUERTE (verde)
- [ ] DÉBIL: menos de 8 chars o solo letras
- [ ] INTERMEDIO: letras + números, mínimo 8 chars
- [ ] FUERTE: letras + números + símbolo + mínimo 8 chars
- [ ] `bcrypt` con salt rounds = 12 antes de guardar en PostgreSQL
- [ ] Backend rechaza contraseñas débiles con `400` (validar con `@Matches()` en el DTO)
- [ ] `passwordMatchValidator` en el `FormGroup` para confirmar contraseña
- [ ] Email único — error `409` descriptivo si ya existe
- [ ] Rol asignable al crear: `ADMIN` o `RECEPCIONISTA`

---

#### GMA-28 · HU-03: Log de acceso automático
**Archivos clave:** `backend/src/log-acceso/`, `frontend/src/app/pages/log-acceso/`

**Criterios:**
- [ ] Al login exitoso se registra: `usuario_id`, `ip`, `evento='INGRESO'`, `browser`, `fecha_hora`
- [ ] Al logout se registra: `usuario_id`, `ip`, `evento='SALIDA'`, `browser`, `fecha_hora`
- [ ] IP extraída con `X-Forwarded-For` primero, fallback a `req.ip`
- [ ] Registro async (no bloquea la respuesta del login)
- [ ] `GET /log-acceso?page=1&limit=10&usuarioId=&fechaDesde=&fechaHasta=`
- [ ] Solo rol `ADMIN` puede acceder al endpoint y a la pantalla
- [ ] Tabla Angular con `mat-table`, `mat-paginator` y `mat-sort`
- [ ] Registros de solo lectura (no hay DELETE)

---

#### GMA-29 · HU-04: Control de acceso por roles
**Archivos clave:** `backend/src/auth/guards/`, `frontend/src/app/core/guards/`

**Criterios:**
- [ ] Roles definidos: `ADMIN`, `RECEPCIONISTA`
- [ ] `JwtAuthGuard` + `RolesGuard` aplicados en todos los controladores del backend
- [ ] `AuthGuard` (CanActivate) en rutas Angular — redirige a `/login` si no hay token
- [ ] `RoleGuard` en rutas restringidas — redirige a `/403` si el rol no es suficiente
- [ ] Menú lateral generado dinámicamente desde el rol del token (no hardcodeado en HTML)
- [ ] Interceptor HTTP maneja el error `401` redirigiendo a `/login` automáticamente
- [ ] Pantalla `/403` con mensaje claro y botón de regreso

---

#### GMA-30 · HU-05: CRUD clientes con eliminación lógica
**Archivos clave:** `backend/src/clientes/`, `frontend/src/app/pages/clientes/`

**Criterios:**
- [ ] `GET /clientes?page=1&limit=10&activo=true&search=` → `{ data, total, page, limit }`
- [ ] `POST /clientes` con validaciones: nombre (req), apellido (req), email (formato + único), teléfono (numérico)
- [ ] `PATCH /clientes/:id` para editar datos
- [ ] `PATCH /clientes/:id/desactivar` → `activo = false` (nunca `DELETE` físico)
- [ ] `PATCH /clientes/:id/reactivar` → `activo = true` (solo ADMIN)
- [ ] Tabla Angular con `mat-table`, `mat-paginator`, búsqueda en tiempo real
- [ ] Clientes inactivos visualmente distinguidos
- [ ] Formulario con `ReactiveFormsModule` y `Validators` de Angular
- [ ] Backend con `@IsEmail()`, `@IsNotEmpty()` en DTOs con `class-validator`

---

#### GMA-31 · HU-06: Perfil unificado del cliente
**Archivos clave:** `backend/src/clientes/clientes.controller.ts`, `frontend/src/app/pages/clientes/perfil/`

**Criterios:**
- [ ] `GET /clientes/:id/perfil` retorna en una sola llamada: datos personales, membresía activa (con `diasRestantes`), plan de entrenamiento activo, últimas 5 ventas
- [ ] `diasRestantes` calculado en el backend (nunca en el frontend)
- [ ] Vista Angular con tabs: Datos / Membresía / Entrenamiento / Compras
- [ ] Indicador visual de membresía: ACTIVA (verde) / VENCIDA (rojo) / SIN MEMBRESÍA (gris)
- [ ] Botones de acceso rápido para "Renovar membresía" y "Nueva venta"

---

### Sprint 2 — Membresías, Entrenamiento, Inventario y Equipos

---

#### GMA-32 · HU-07: CRUD de membresías y planes
**Archivos clave:** `backend/src/membresias/`, `backend/src/planes-membresia/`, `frontend/src/app/pages/membresias/`

**Criterios:**
- [ ] CRUD `PLAN_MEMBRESIA` con eliminación lógica; precio decimal positivo; duración entero positivo
- [ ] No se puede desactivar plan con membresías `ACTIVA` → error `409`
- [ ] `POST /membresias` calcula `fecha_fin = fecha_inicio + duracion_dias` en el backend
- [ ] Estado calculado: `ACTIVA` (fecha_fin >= hoy), `VENCIDA` (fecha_fin < hoy), `CANCELADA`
- [ ] `PATCH /membresias/:id/cancelar` disponible
- [ ] Badge visual por estado con colores
- [ ] Lista de membresías próximas a vencer (≤ 7 días) con alerta visual
- [ ] `mat-datepicker` con fecha mínima = hoy

---

#### GMA-33 · HU-08: Planes de entrenamiento y rutinas
**Archivos clave:** `backend/src/planes-entrenamiento/`, `backend/src/ejercicios/`, `frontend/src/app/pages/entrenamiento/`

**Criterios:**
- [ ] CRUD `ENTRENADOR` con eliminación lógica
- [ ] CRUD `EJERCICIO` con grupo muscular (enum), descripción y `video_url` validado con `@IsUrl()` si se ingresa
- [ ] Filtro de ejercicios por grupo muscular en el frontend
- [ ] CRUD `PLAN_ENTRENAMIENTO`: nombre, objetivo, cliente, entrenador, fechas, activo
- [ ] Construcción de `RUTINA_DIA`: día de la semana, nombre, orden (único dentro del plan)
- [ ] Asignación de ejercicios a rutina: series (int+), repeticiones (int+), descanso_segundos, peso_kg, notas, orden
- [ ] Botones ▲▼ para reordenar ejercicios dentro de la rutina
- [ ] Vista con `mat-expansion-panel` por día

---

#### GMA-34 · HU-09: Inventario con lotes y ventas FIFO
**Archivos clave:** `backend/src/inventario/`, `backend/src/ventas/`, `frontend/src/app/pages/inventario/`, `frontend/src/app/pages/ventas/`

**Criterios:**
- [ ] CRUD `PRODUCTO` con eliminación lógica; `codigo_barras` único
- [ ] Registro de `LOTE` por producto; stock total = suma de `cantidad_disponible` de lotes activos
- [ ] Alerta si `cantidad_disponible <= stock_minimo` o lote vence en ≤ 30 días
- [ ] `POST /ventas` descuenta del lote más antiguo no vencido (FIFO: `fecha_compra ASC`)
- [ ] Toda la lógica de venta en una **transacción TypeORM** (`QueryRunner`)
- [ ] No se permite vender más cantidad que el stock disponible
- [ ] Tipos de pago: `EFECTIVO`, `QR`, `TARJETA`
- [ ] `PATCH /ventas/:id/anular` revierte el stock
- [ ] Formulario de nueva venta tipo carrito con total automático
- [ ] Historial de ventas con filtro por fecha y cliente

---

#### GMA-35 · HU-10: CRUD de equipos y movimientos
**Archivos clave:** `backend/src/equipamiento/`, `frontend/src/app/pages/equipamiento/`

**Criterios:**
- [ ] CRUD `EQUIPO_GYM` con eliminación lógica (estado = `BAJA`, nunca DELETE físico)
- [ ] Estados: `DISPONIBLE`, `EN_MANTENIMIENTO`, `BAJA` con semáforo visual
- [ ] `cantidad_disponible <= cantidad_total` validado en backend
- [ ] Alerta si `proximo_mantenimiento <= hoy + 7 días`
- [ ] Registro de `MOVIMIENTO_EQUIPO`: tipo, cantidad, motivo, número_factura, fechas
- [ ] `RETIRO` reduce `cantidad_disponible`; `RETORNO` la aumenta
- [ ] `fecha_estimada_retorno` obligatorio en tipo `RETIRO`
- [ ] Historial de movimientos por equipo en panel expandible

---

### Sprint 3 — Reportes, Dashboard y Estadísticas

---

#### GMA-36 · HU-11: Dashboard con KPIs y gráficos estadísticos
**Archivos clave:** `backend/src/dashboard/`, `frontend/src/app/pages/dashboard/`

**Criterios:**
- [ ] `GET /dashboard/stats` retorna todos los datos agregados en una sola llamada
- [ ] Tarjetas KPI: clientes activos, membresías activas, ventas del mes, equipos en mantenimiento
- [ ] BarChart: membresías nuevas por mes (últimos 6 meses) — `ng2-charts`
- [ ] PieChart: distribución de clientes por plan de membresía activo
- [ ] LineChart: ingresos por ventas de productos por mes
- [ ] BarChart horizontal: top 5 productos más vendidos
- [ ] `[responsive]="true"` en todos los gráficos
- [ ] `provideCharts(withDefaultRegisterables())` en `app.config.ts`
- [ ] Solo `ADMIN` ve el dashboard completo; `RECEPCIONISTA` ve solo KPIs básicos
- [ ] Carga en menos de 2 segundos

---

#### GMA-37 · HU-12: Reporte PDF de membresías con filtros
**Archivos clave:** `backend/src/reportes/membresias.controller.ts`, `frontend/src/app/pages/reportes/`

**Criterios:**
- [ ] `GET /reportes/membresias?fechaDesde=&fechaHasta=&estado=&planId=` retorna datos filtrados
- [ ] PDF generado en el **backend** con `pdfmake`, enviado como stream con `Content-Type: application/pdf`
- [ ] Frontend descarga con `responseType: 'blob'` en `HttpClient`
- [ ] PDF incluye: encabezado con nombre del sistema + fecha de generación, tabla de membresías, totales al pie
- [ ] Nombre del archivo: `membresias_YYYY-MM-DD.pdf`
- [ ] Botón "Descargar PDF" visible en la vista de membresías

---

#### GMA-38 · HU-13: Reportes PDF de ventas, inventario y log de acceso
**Archivos clave:** `backend/src/reportes/`, `frontend/src/app/pages/reportes/`

**Criterios:**
- [ ] `GET /reportes/ventas` → PDF con ventas, resumen por producto, total por tipo de pago
- [ ] `GET /reportes/inventario` → PDF con stock actual; productos en rojo (bajo stock) y naranja (por vencer)
- [ ] `GET /reportes/log-acceso` → PDF con tabla de eventos de acceso
- [ ] Todos los PDFs generados en el backend con `pdfmake`
- [ ] Encabezado uniforme: nombre del sistema, nombre del reporte, fecha de generación
- [ ] Servicio Angular reutilizable `PdfDownloadService.download(endpoint, filename)`
- [ ] Página Reportes con tabs: Membresías / Ventas / Inventario / Log de Acceso

---

### Sprint 4 — Infraestructura y Despliegue

---

#### GMA-39 · HU-14: Dockerización completa con Docker Compose
**Archivos clave:** `Dockerfile` (backend), `Dockerfile` (frontend), `docker-compose.yml`, `nginx.conf`

**Criterios:**
- [ ] `Dockerfile` backend: multi-stage (build con `tsc` + production con solo `dist/`)
- [ ] `Dockerfile` frontend: multi-stage (build con `ng build` + serve con `nginx:alpine`)
- [ ] `docker-compose.yml` con 3 servicios: `backend`, `frontend`, `postgres`
- [ ] `docker-compose up -d` levanta el stack completo sin errores
- [ ] App accesible en `localhost:4200` (frontend) y `localhost:3000` (backend)
- [ ] Variables vía `.env` (nunca hardcodeadas en `docker-compose.yml`)
- [ ] `.env.example` con todas las variables documentadas
- [ ] Volumen persistente para PostgreSQL
- [ ] `.dockerignore` excluye `node_modules`, `dist`, `.env`

---

#### GMA-40 · HU-15: Manifiestos Kubernetes
**Archivos clave:** `k8s/`

**Criterios:**
- [ ] `k8s/namespace.yaml` con namespace `gympro`
- [ ] `k8s/backend-deployment.yaml` + `k8s/backend-service.yaml` (ClusterIP)
- [ ] `k8s/frontend-deployment.yaml` + `k8s/frontend-service.yaml` (NodePort o LoadBalancer)
- [ ] `k8s/postgres-deployment.yaml` + `k8s/postgres-pvc.yaml`
- [ ] `k8s/configmap.yaml` para vars no sensibles; `k8s/secret.yaml` para passwords y JWT_SECRET (valores en base64)
- [ ] `livenessProbe` y `readinessProbe` en el Deployment del backend
- [ ] `resources.requests` y `resources.limits` definidos en todos los Deployments
- [ ] `kubectl apply -f k8s/` levanta todo el sistema sin errores

---

#### GMA-41 · HU-16: Despliegue en plataforma gratuita
**Archivos clave:** `frontend/src/environments/environment.prod.ts`, README

**Criterios:**
- [ ] Backend NestJS desplegado en Railway o Render con URL pública estable
- [ ] Frontend Angular desplegado en Vercel o Netlify con build automático desde GitHub
- [ ] PostgreSQL en Supabase o Railway
- [ ] `environment.prod.ts` apunta a la URL real del backend
- [ ] Variables sensibles configuradas en la plataforma, nunca en el repo
- [ ] CORS en NestJS configurado para aceptar la URL del frontend en producción
- [ ] Sistema completo funcional desde la URL pública

---

#### GMA-42 · HU-17: Repositorio GitHub organizado con README
**Archivos clave:** `README.md`, `.gitignore`

**Criterios:**
- [ ] Estructura clara: `/backend`, `/frontend`, `/k8s`, `/docs`
- [ ] `.gitignore` excluye `.env`, `node_modules`, `dist`
- [ ] `README.md` incluye: descripción, stack, instrucciones locales, Docker, URL de producción, imagen del diagrama ER
- [ ] Ramas configuradas: `main`, `develop`, feature branches por historia
- [ ] Commits con convención: `feat:`, `fix:`, `docs:`, `chore:` + issue key
- [ ] URL del repo y URL de producción enviadas al docente vía Telegram

---

## 🤖 Comandos para Claude Code

```bash
# Verificar una historia
"revisa GMA-26"
"verifica si GMA-30 cumple los criterios"

# Ver progreso
"qué historias están pendientes del sprint 1"
"muéstrame el progreso del proyecto"

# Transicionar en Jira
"marca GMA-26 como done en Jira"
"mueve GMA-30 a in progress"

# Implementar
"implementa GMA-26 — login JWT y CAPTCHA"
"ayúdame con la historia GMA-34"
```

---

## 🚀 Comandos frecuentes

```bash
# ── Backend ──────────────────────────────────────────────────────────────
cd backend
npm run start:dev
npm run migration:generate -- src/migrations/NombreMig
npm run migration:run
npm run migration:revert
npm run seed
npm run test
npm run test -- --testPathPattern=auth

# ── Frontend Angular ──────────────────────────────────────────────────────
cd frontend
ng serve
ng serve --open
ng build
ng generate component pages/x --standalone
ng test

# ── Docker ────────────────────────────────────────────────────────────────
docker-compose up -d
docker-compose up --build
docker-compose down
docker-compose down -v
docker-compose logs backend -f
docker-compose ps

# ── Kubernetes ────────────────────────────────────────────────────────────
kubectl apply -f k8s/
kubectl get pods -n gympro
kubectl logs deploy/backend -n gympro
kubectl delete -f k8s/

# ── Jira ──────────────────────────────────────────────────────────────────
curl -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  "https://api.atlassian.com/ex/jira/7630af83-9754-41bc-b4ea-89653136eeb5/rest/api/3/issue/GMA-26/transitions" \
  | jq '.transitions[] | {id, name}'
```

---

*Última actualización: generado desde claude.ai — Digital Harbor Bolivia Bootcamp*
