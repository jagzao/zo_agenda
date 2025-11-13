# 📋 Plan de Trabajo - Zo Agenda Multi-Tenant

## ✅ FASE 1: SETUP INICIAL (COMPLETADO)

### Configuración Base
- ✅ Next.js 15 + React 19 + TypeScript
- ✅ Tailwind CSS + shadcn/ui
- ✅ Jotai (state management)
- ✅ Framer Motion (animations)
- ✅ react-big-calendar
- ✅ Estructura de directorios
- ✅ Configuración ESLint + Prettier
- ✅ Git repository setup

### Stack Implementado
```
Frontend:
├── Next.js 15.0.3
├── React 19
├── TypeScript 5.6.3
├── Tailwind CSS 3.4.14
└── shadcn/ui components

State & Animation:
├── Jotai 2.10.3
├── Framer Motion 11.11.17
└── react-big-calendar 1.15.0

Backend:
├── Supabase (PostgreSQL + Auth)
├── Prisma 5.22.0
├── GraphQL + Apollo
└── Google Calendar API

Deployment:
└── Vercel (Free Tier)
```

### Archivos Creados
```
├── app/
│   ├── (dashboard)/calendar/    ✅ Vista de calendario
│   ├── layout.tsx               ✅ Root layout
│   ├── page.tsx                 ✅ Homepage
│   └── globals.css              ✅ Estilos globales
├── components/
│   ├── ui/                      ✅ Button, Card, Input
│   └── calendar/                ✅ BigCalendar component
├── lib/
│   ├── supabase/                ✅ Client + Server
│   ├── graphql/                 ✅ Apollo client
│   ├── jotai/                   ✅ Atoms
│   └── utils.ts                 ✅ Utilidades
├── prisma/
│   └── schema.prisma            ✅ Schema multi-tenant
├── package.json                 ✅
├── tsconfig.json                ✅
├── tailwind.config.ts           ✅
├── next.config.ts               ✅
├── vercel.json                  ✅
├── README.md                    ✅ Documentación completa
└── .env.example                 ✅
```

---

## 🚀 PRÓXIMOS PASOS

### FASE 2: CONFIGURACIÓN DE SUPABASE (Siguiente)

**Prioridad: ALTA**

1. **Obtener credenciales de Supabase**
   - Ir a: https://supabase.com/dashboard/project/jedryjmljffuvegggjmw
   - Copiar:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
   - Actualizar archivo `.env`

2. **Activar extensiones en Supabase**
   ```sql
   -- Ir a Database > Extensions
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   CREATE EXTENSION IF NOT EXISTS "pg_graphql";
   ```

3. **Aplicar schema de Prisma**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Configurar Row Level Security (RLS)**
   - Crear policies para multi-tenancy
   - Proteger todas las tablas

---

### FASE 3: AUTENTICACIÓN & MULTI-TENANCY

**Prioridad: ALTA**

1. **Implementar Auth Flow**
   - Login page
   - Register page
   - Middleware de autenticación
   - Session management

2. **Tenant Resolution**
   - Middleware para detectar tenant
   - Context de tenant en app
   - Subdomain routing (opcional)

3. **RBAC (Role-Based Access Control)**
   - Admin: Full access
   - Staff: Manage appointments
   - Customer: Book appointments

---

### FASE 4: GRAPHQL API

**Prioridad: MEDIA**

1. **Apollo Server Setup**
   - Crear `/app/api/graphql/route.ts`
   - Definir schemas
   - Implementar resolvers

2. **Queries & Mutations**
   ```graphql
   # Queries
   - appointments(tenantId, staffId, date)
   - services(tenantId)
   - availability(staffId)

   # Mutations
   - createAppointment
   - updateAppointment
   - cancelAppointment
   - createService
   ```

3. **Code Generation**
   ```bash
   npm run codegen
   ```

---

### FASE 5: GOOGLE CALENDAR INTEGRATION

**Prioridad: ALTA** (Feature diferenciador)

1. **Google Cloud Setup**
   - Crear proyecto en Google Cloud Console
   - Activar Google Calendar API
   - Crear OAuth 2.0 credentials
   - Configurar consent screen

2. **OAuth Flow**
   - Implementar `/api/auth/google/callback`
   - Guardar tokens (encrypted) en DB
   - Refresh token logic

3. **Sincronización**
   - Push: Zo Agenda → Google Calendar
   - Pull: Google Calendar → Zo Agenda (webhooks)
   - Conflict resolution

4. **Webhooks**
   - Implementar `/api/webhooks/google`
   - Procesar notificaciones
   - Update appointments

---

### FASE 6: FEATURES DEL CALENDARIO

**Prioridad: ALTA**

1. **Componente de Calendario Completo**
   - Drag & drop para reagendar
   - Multi-view (día, semana, mes, agenda)
   - Filtros por staff, servicio, estado
   - Color coding por servicio

2. **Formulario de Citas**
   - Modal para crear/editar
   - Validación de conflictos
   - Selección de servicio, staff, cliente
   - Notas adicionales

3. **Disponibilidad**
   - Configurar horarios por día
   - Bloques de tiempo
   - Excepciones (días feriados)

---

### FASE 7: GESTIÓN DE DATOS

**Prioridad: MEDIA**

1. **Servicios**
   - CRUD completo
   - Configuración de duración
   - Precios
   - Colores

2. **Clientes**
   - Lista de clientes
   - Perfil del cliente
   - Historial de citas
   - Datos de contacto

3. **Staff**
   - Gestión de usuarios staff
   - Asignación de servicios
   - Configuración de disponibilidad

---

### FASE 8: DASHBOARD & ANALYTICS

**Prioridad: BAJA**

1. **Dashboard**
   - Citas de hoy
   - Próximas citas
   - Estadísticas rápidas
   - Actividad reciente

2. **Reportes**
   - Citas por período
   - Revenue por servicio
   - Performance por staff
   - Clientes recurrentes

3. **Exportación**
   - CSV
   - PDF
   - Excel

---

### FASE 9: NOTIFICACIONES

**Prioridad: MEDIA**

1. **Email Notifications**
   - Setup Resend (3K emails/mes gratis)
   - Templates:
     - Confirmación de cita
     - Recordatorio (24h antes)
     - Cancelación
     - Cambio de horario

2. **In-App Notifications**
   - Toast notifications
   - Bell icon con contador
   - Lista de notificaciones

---

### FASE 10: BOOKING PÚBLICO

**Prioridad: ALTA**

1. **Landing Page por Tenant**
   - `/book/[tenant]`
   - Mostrar servicios disponibles
   - Calendario de disponibilidad
   - Formulario de booking

2. **Public API**
   - Disponibilidad pública
   - Crear cita sin login
   - Confirmación por email

---

### FASE 11: OPTIMIZACIONES

**Prioridad: BAJA**

1. **Performance**
   - React Query caching
   - Optimistic updates
   - Code splitting
   - Image optimization

2. **SEO**
   - Metadata por página
   - Open Graph tags
   - Sitemap
   - Structured data

3. **Mobile**
   - Responsive design
   - Touch gestures
   - PWA (opcional)

---

### FASE 12: TESTING & QA

**Prioridad: MEDIA**

1. **Unit Tests**
   - Components
   - Utilities
   - Resolvers

2. **Integration Tests**
   - API endpoints
   - Database operations

3. **E2E Tests**
   - User flows
   - Booking process
   - Calendar interactions

---

### FASE 13: DEPLOYMENT

**Prioridad: ALTA** (cuando esté listo MVP)

1. **Vercel Setup**
   - Conectar repo
   - Configurar env vars
   - Deploy

2. **Domain**
   - Configurar dominio
   - SSL automático
   - Subdomain routing

3. **Monitoring**
   - Sentry (errors)
   - Vercel Analytics
   - Uptime monitoring

---

## 📊 CRONOGRAMA SUGERIDO

| Fase | Descripción | Tiempo Estimado | Prioridad |
|------|-------------|-----------------|-----------|
| ✅ 1 | Setup Inicial | 1 día | ✅ DONE |
| 2 | Supabase Config | 1 día | 🔴 NEXT |
| 3 | Auth & Multi-tenancy | 2-3 días | 🔴 HIGH |
| 4 | GraphQL API | 2-3 días | 🟡 MEDIUM |
| 5 | Google Calendar | 3-4 días | 🔴 HIGH |
| 6 | Features Calendario | 3-4 días | 🔴 HIGH |
| 7 | Gestión de Datos | 2-3 días | 🟡 MEDIUM |
| 8 | Dashboard | 2 días | 🟢 LOW |
| 9 | Notificaciones | 2 días | 🟡 MEDIUM |
| 10 | Booking Público | 2-3 días | 🔴 HIGH |
| 11 | Optimizaciones | 2-3 días | 🟢 LOW |
| 12 | Testing | 2-3 días | 🟡 MEDIUM |
| 13 | Deployment | 1 día | 🔴 HIGH |

**Total MVP: ~20-25 días de desarrollo**

---

## 🎯 FEATURES CLAVE PARA MVP

**Debe tener:**
1. ✅ Setup proyecto
2. ⏳ Auth multi-tenant
3. ⏳ CRUD de citas
4. ⏳ Calendario visual
5. ⏳ Google Calendar sync
6. ⏳ Booking público
7. ⏳ Notificaciones email

**Nice to have:**
- Dashboard analytics
- Reportes avanzados
- App móvil
- Pagos integrados

---

## 🔧 COMANDOS ÚTILES

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Prisma
npx prisma generate          # Generar Prisma Client
npx prisma db push           # Push schema a DB
npx prisma studio            # UI para ver DB

# GraphQL
npm run codegen              # Generar tipos

# Lint
npm run lint
npm run type-check

# Testing (cuando se agregue)
npm test
npm run test:e2e
```

---

## 🆘 PASOS INMEDIATOS

1. **Configurar Supabase**
   - Obtener credenciales
   - Actualizar `.env`
   - Aplicar schema

2. **Implementar Auth básico**
   - Login/Register
   - Protected routes

3. **Primera cita funcional**
   - CRUD básico
   - Mostrar en calendario

4. **Google Calendar**
   - OAuth setup
   - Sincronización básica

---

## 📝 NOTAS TÉCNICAS

### Cloudflare vs Vercel
- **Decisión:** Vercel
- **Razón:** Mejor integración con Next.js 15, Server Components optimizados
- **Costo:** $0/mes con 100GB bandwidth

### GraphQL vs REST
- **Decisión:** GraphQL
- **Razón:** Mejor para queries complejas, less over-fetching, type-safety
- **Supabase:** Tiene GraphQL nativo con `pg_graphql`

### SMS
- **Decisión:** NO implementar
- **Razón:** Costo innecesario para MVP, email suficiente

### CI/CD
- **Decisión:** Vercel Git Integration (no GitHub Actions)
- **Razón:** Evitar consumir minutos de otros proyectos

---

**Estado actual:** ✅ Fase 1 completada
**Siguiente paso:** 🔴 Configurar Supabase y aplicar schema
