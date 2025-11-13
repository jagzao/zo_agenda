# 🔧 Configuración de Supabase - Guía Paso a Paso

## ⚠️ Problema de Conectividad

Debido a restricciones de red con el pooler de Supabase, vamos a crear las tablas directamente usando el **SQL Editor** del dashboard.

---

## 📋 PASO 1: Ir al SQL Editor

1. Ve a tu proyecto en Supabase:
   - URL: https://supabase.com/dashboard/project/jedryjmljffuvegggjmw

2. En el menú lateral, haz clic en:
   - **SQL Editor** (icono de base de datos)

---

## 📋 PASO 2: Ejecutar el Script SQL

1. Haz clic en **"New Query"** (nuevo query)

2. Copia TODO el contenido del archivo: `prisma/init.sql`

3. Pégalo en el editor SQL

4. Haz clic en **"Run"** o presiona `Ctrl + Enter`

5. Deberías ver un mensaje de éxito: ✅ **Success. No rows returned**

---

## ✅ PASO 3: Verificar las Tablas Creadas

En el menú lateral, haz clic en **"Table Editor"**

Deberías ver estas tablas:

```
✅ tenants
✅ users
✅ services
✅ appointments
✅ availability
✅ google_calendar_settings
```

---

## 🔐 PASO 4: Obtener API Keys

1. Ve a **Settings** → **API** en el menú lateral

2. Copia estas claves:

### 🟢 Project URL
```
https://jedryjmljffuvegggjmw.supabase.co
```

### 🟢 anon/public key
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZHJ5am1samZmdXZlZ2dnZ2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MzMxNzcsImV4cCI6MjA0NzEwOTE3N30...
```
(La que comienza con `eyJhbGci...`)

### 🔴 service_role key (Secret!)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZHJ5am1samZmdXZlZ2dnZ2p3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMTUzMzE3NywiZXhwIjoyMDQ3MTA5MTc3fQ...
```
(La segunda clave, más larga)

---

## 🔧 PASO 5: Actualizar .env Local

Actualiza tu archivo `.env` local con las claves correctas:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://jedryjmljffuvegggjmw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<pegar-anon-key-aqui>
SUPABASE_SERVICE_ROLE_KEY=<pegar-service-role-key-aqui>

# Database (ya está configurado)
DATABASE_URL="postgresql://postgres.jedryjmljffuvegggjmw:TSGmf_3G-rbLbz!@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

---

## 🧪 PASO 6: Probar la Conexión

Ejecuta en tu terminal:

```bash
npm run dev
```

Luego abre: http://localhost:3000

---

## 📊 Qué Se Creó

### Tablas

| Tabla | Descripción | Características |
|-------|-------------|-----------------|
| `tenants` | Organizaciones | Multi-tenancy base |
| `users` | Usuarios | Roles: admin, staff, customer |
| `services` | Servicios | Duración, precio, color |
| `appointments` | Citas | Estados, Google sync |
| `availability` | Disponibilidad | Horarios por día |
| `google_calendar_settings` | Config Google | Tokens OAuth |

### Características Implementadas

✅ **UUID automático** para todos los IDs
✅ **Timestamps** automáticos (created_at, updated_at)
✅ **Triggers** para actualizar updated_at
✅ **Índices** en columnas frecuentes
✅ **Foreign Keys** con CASCADE
✅ **Row Level Security (RLS)** activado
✅ **Políticas RLS** por tenant
✅ **Extensiones** uuid-ossp y pg_graphql

### Políticas RLS Creadas

**Seguridad Multi-Tenant:**
- ✅ Los usuarios solo ven datos de su tenant
- ✅ Solo admins pueden modificar configuración
- ✅ Staff puede gestionar citas
- ✅ Customers solo ven sus propias citas
- ✅ Cada usuario gestiona su propia config de Google Calendar

---

## 🔒 Seguridad

### RLS (Row Level Security)

Todas las tablas tienen RLS activado. Esto significa:

1. **Sin autenticación** → No se puede acceder a nada
2. **Usuario autenticado** → Solo ve datos de su tenant
3. **Admin** → Control total en su tenant
4. **Staff** → Gestión de citas y servicios
5. **Customer** → Solo sus propias citas

### Ejemplo de Política

```sql
-- Los usuarios solo ven citas de su tenant
CREATE POLICY "Users can view appointments in their tenant"
  ON appointments FOR SELECT
  USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));
```

---

## 📝 Tenant Demo

Se creó un tenant de demostración:

- **Slug:** `demo`
- **Nombre:** `Demo Clinic`
- **Plan:** `free`

Puedes usarlo para pruebas iniciales.

---

## 🐛 Troubleshooting

### Error: "relation does not exist"
- Verifica que ejecutaste el script SQL completo
- Chequea en Table Editor que las tablas existen

### Error: "permission denied"
- Verifica que RLS está configurado correctamente
- Asegúrate de estar autenticado en Supabase

### Error: "tenant_id not found"
- Crea un tenant primero
- Asigna usuarios a un tenant válido

---

## 🎯 Próximos Pasos

1. ✅ Tablas creadas
2. ✅ RLS configurado
3. ⏳ Implementar autenticación
4. ⏳ Crear primera UI de login
5. ⏳ CRUD de citas
6. ⏳ Integración Google Calendar

---

## 📚 Referencias

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL UUID Functions](https://www.postgresql.org/docs/current/functions-uuid.html)
- [Prisma with Supabase](https://www.prisma.io/docs/guides/database/supabase)

---

¡Las tablas están listas para usar! 🎉
