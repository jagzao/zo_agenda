# 🗓️ Zo Agenda - Multi-Tenant Digital Appointment System

Sistema de agenda digital multi-tenant de nivel empresarial con integración a Google Calendar.

## 🚀 Stack Tecnológico

### Frontend
- **Next.js 15** - React framework con App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Componentes UI de alta calidad
- **Jotai** - State management
- **Framer Motion** - Animaciones fluidas
- **react-big-calendar** - Componente de calendario

### Backend & Database
- **Supabase** - PostgreSQL + Auth + Real-time
- **Prisma** - ORM type-safe
- **GraphQL** - API con Apollo Client/Server
- **Google Calendar API** - Sincronización bidireccional

### DevOps
- **Vercel** - Hosting y deployments
- **GitHub** - Version control
- **ESLint + Prettier** - Code quality

## 📋 Características

### Multi-Tenancy
- ✅ Aislamiento completo por tenant
- ✅ Row Level Security (RLS) en Supabase
- ✅ Subdominios por organización
- ✅ Configuración personalizada por tenant

### Gestión de Citas
- ✅ Calendario visual interactivo
- ✅ Vistas: Día, Semana, Mes, Agenda
- ✅ Drag & drop para reagendar
- ✅ Detección de conflictos
- ✅ Estados: Pendiente, Confirmado, Cancelado

### Google Calendar
- ✅ OAuth 2.0 authentication
- ✅ Sincronización bidireccional
- ✅ Webhooks para updates en tiempo real
- ✅ Multi-calendario por staff

### Servicios
- ✅ Servicios personalizados
- ✅ Duración y precios configurables
- ✅ Colores para identificación visual

### Usuarios
- ✅ Roles: Admin, Staff, Customer
- ✅ Autenticación con Supabase Auth
- ✅ Disponibilidad por día/hora

## 🛠️ Setup Local

### Prerrequisitos
- Node.js >= 18.17.0
- npm o yarn
- Cuenta de Supabase
- Cuenta de Google Cloud (para Calendar API)

### Instalación

1. **Clonar repositorio**
```bash
git clone <repo-url>
cd zo_agenda
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:
- Supabase URL y keys (desde https://supabase.com/dashboard)
- Google Calendar credentials
- Database URL

4. **Setup Supabase**

Activa extensiones en Supabase Dashboard:
```sql
-- Ir a Database > Extensions
pg_graphql
uuid-ossp
```

5. **Generar Prisma Client y migrar DB**
```bash
npx prisma generate
npx prisma db push
```

6. **Correr en desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
zo_agenda/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth routes (login, register)
│   ├── (dashboard)/         # Dashboard protegido
│   │   ├── calendar/        # Vista de calendario
│   │   ├── appointments/    # Gestión de citas
│   │   ├── services/        # Servicios
│   │   ├── customers/       # Clientes
│   │   └── settings/        # Configuración + Google Calendar
│   ├── (public)/            # Rutas públicas
│   │   └── book/[tenant]/   # Booking público por tenant
│   └── api/
│       ├── graphql/         # GraphQL endpoint
│       └── webhooks/        # Webhooks (Google Calendar)
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── calendar/            # Componentes de calendario
│   ├── appointments/        # Componentes de citas
│   └── google-sync/         # Google Calendar sync UI
├── lib/
│   ├── supabase/           # Supabase clients
│   ├── graphql/            # GraphQL schemas & resolvers
│   ├── google-calendar/    # Google API integration
│   ├── jotai/              # Atoms (state)
│   └── utils/              # Utilidades
├── prisma/
│   └── schema.prisma       # Database schema
└── public/                 # Assets estáticos
```

## 🗄️ Database Schema

### Entidades Principales
- **Tenants** - Organizaciones
- **Users** - Usuarios (admin, staff, customer)
- **Services** - Servicios ofrecidos
- **Appointments** - Citas agendadas
- **Availability** - Disponibilidad del staff
- **GoogleCalendarSettings** - Config de sincronización

Ver `prisma/schema.prisma` para detalles completos.

## 🔐 Seguridad

- Row Level Security (RLS) activado en todas las tablas
- JWT tokens con tenant_id en claims
- Validación de entrada con Zod
- XSS protection con React
- HTTPS obligatorio en producción

## 🚀 Deployment

### Vercel (Recomendado)

1. **Push a GitHub**
```bash
git add .
git commit -m "Initial setup"
git push origin main
```

2. **Conectar a Vercel**
- Ir a [vercel.com](https://vercel.com)
- Import repository
- Configurar environment variables
- Deploy!

3. **Variables de entorno en Vercel**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

## 📝 Scripts Disponibles

```bash
npm run dev          # Desarrollo (localhost:3000)
npm run build        # Build producción
npm run start        # Start producción
npm run lint         # Lint con ESLint
npm run type-check   # TypeScript check
```

## 🔄 Google Calendar Integration

### Setup

1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Crear nuevo proyecto
3. Activar Google Calendar API
4. Crear OAuth 2.0 credentials
5. Agregar redirect URI: `http://localhost:3000/api/auth/google/callback`
6. Copiar Client ID y Secret a `.env`

### Flujo de Sincronización

```
Usuario → Conecta Google Calendar → OAuth Flow
↓
Tokens guardados en DB (encrypted)
↓
Cita creada en Zo Agenda → Push a Google Calendar
↓
Evento editado en Google → Webhook → Update en Zo Agenda
```

## 🎨 shadcn/ui Components

Agregar nuevos componentes:
```bash
npx shadcn-ui@latest add [component-name]
```

## 📊 GraphQL

### Generar tipos de GraphQL
```bash
npm run codegen
```

Esto genera tipos TypeScript desde tus schemas GraphQL.

## 🤝 Contribución

1. Fork el proyecto
2. Crea feature branch (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push a branch (`git push origin feature/amazing-feature`)
5. Abre Pull Request

## 📄 Licencia

MIT

## 🆘 Soporte

- Issues: GitHub Issues
- Docs: Ver `/docs`
- Email: support@zoagenda.com

---

**Desarrollado con ❤️ usando Next.js 15, React 19, Supabase y mejores prácticas**
