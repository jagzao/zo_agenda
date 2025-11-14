# 🎯 Guía de Ejecución: Datos de Prueba

## 📋 **QUÉ HACE ESTE SCRIPT**

El archivo `prisma/seed.sql` crea datos de prueba completos para que puedas probar inmediatamente el sistema:

### **Datos que se crearán:**

```
✅ 1 Tenant: "Clínica Demo"
✅ 4 Servicios:
   - Consulta General (30 min - $500)
   - Seguimiento (20 min - $350)
   - Primera Consulta (45 min - $750)
   - Terapia (60 min - $900)

✅ 6 Usuarios:
   - 2 Staff (doctores)
   - 4 Clientes (pacientes)

✅ 11 Citas:
   - 4 hoy (diferentes horarios)
   - 2 mañana
   - 2 próxima semana
   - 2 completadas (semana pasada)
   - 1 cancelada

✅ Disponibilidad:
   - Ambos doctores: Lun-Vie 9am-6pm
```

---

## 🚀 **PASO A PASO: EJECUTAR EL SCRIPT**

### **Paso 1: Ir a Supabase**
```
1. Abre: https://supabase.com/dashboard/project/jedryjmljffuvegggjmw
2. Click en "SQL Editor" en el menú lateral
```

### **Paso 2: Nueva Query**
```
1. Click en "New Query"
2. Dale un nombre: "Seed Data" (opcional)
```

### **Paso 3: Copiar el Script**
```
1. Abre el archivo: prisma/seed.sql
2. Selecciona TODO el contenido (Ctrl+A)
3. Copia (Ctrl+C)
```

### **Paso 4: Pegar y Ejecutar**
```
1. Pega en el SQL Editor de Supabase (Ctrl+V)
2. Click en "Run" (o Ctrl+Enter)
3. Espera 2-3 segundos...
```

### **Paso 5: Verificar Resultado**
```
Deberías ver al final:

✅ "Datos de prueba creados exitosamente!"

Y una tabla con el conteo:
- tenants: 1
- servicios: 4
- usuarios: 6
- citas: 11
- disponibilidad: 10
```

---

## ✅ **VERIFICACIÓN EN SUPABASE**

### **Opción 1: Table Editor**
```
1. Click en "Table Editor"
2. Verifica cada tabla:
   - tenants: 1 fila ("Clínica Demo")
   - services: 4 filas
   - users: 6 filas
   - appointments: 11 filas
   - availability: 10 filas
```

### **Opción 2: SQL Query**
```sql
-- Ejecuta esto para ver resumen
SELECT
  (SELECT COUNT(*) FROM tenants) as tenants,
  (SELECT COUNT(*) FROM services) as servicios,
  (SELECT COUNT(*) FROM users) as usuarios,
  (SELECT COUNT(*) FROM appointments) as citas;
```

---

## 🎨 **QUÉ VAS A VER EN EL CALENDARIO**

### **Hoy:**
```
10:00 - 10:30  | María González    | Consulta General  | ✅ Confirmada
11:30 - 11:50  | Carlos Pérez      | Seguimiento       | ⏳ Pendiente
14:00 - 14:45  | Ana Martínez      | Primera Consulta  | ✅ Confirmada
16:00 - 17:00  | Luis Rodríguez    | Terapia          | ⏳ Pendiente
```

### **Mañana:**
```
09:00 - 09:30  | María González    | Consulta General  | ✅ Confirmada
10:30 - 10:50  | Carlos Pérez      | Seguimiento       | ⏳ Pendiente
```

### **Próxima Semana:**
```
Lun 10:00      | Ana Martínez      | Terapia          | ✅ Confirmada
Mar 15:00      | Luis Rodríguez    | Primera Consulta  | ⏳ Pendiente
```

---

## 📊 **DETALLES DE LOS DATOS**

### **Servicios Creados:**

| Servicio | Duración | Precio | Color |
|----------|----------|--------|-------|
| Consulta General | 30 min | $500 | Azul |
| Seguimiento | 20 min | $350 | Verde |
| Primera Consulta | 45 min | $750 | Púrpura |
| Terapia | 60 min | $900 | Naranja |

### **Staff:**

| Nombre | Email | Especialidad |
|--------|-------|--------------|
| Dr. Juan Rodríguez | dr.rodriguez@demo.com | Medicina General |
| Dra. Laura García | dra.garcia@demo.com | Psicología |

### **Clientes:**

| Nombre | Email |
|--------|-------|
| María González | maria.gonzalez@email.com |
| Carlos Pérez | carlos.perez@email.com |
| Ana Martínez | ana.martinez@email.com |
| Luis Rodríguez | luis.rodriguez@email.com |

---

## 🔧 **TROUBLESHOOTING**

### **Error: "duplicate key value"**
```
✅ No te preocupes, significa que ya existen algunos datos
El script usa "WHERE NOT EXISTS" para evitar duplicados
Puedes ejecutarlo múltiples veces sin problema
```

### **Error: "violates foreign key constraint"**
```
⚠️ Esto significa que falta el tenant o usuarios
Solución:
1. Verifica que ejecutaste primero: prisma/init.sql
2. Si no, ejecuta init.sql primero, luego seed.sql
```

### **No veo las citas de "hoy"**
```
✅ El script usa NOW() para fechas relativas
Las citas se crean automáticamente para el día de hoy
Si lo ejecutas a las 11pm, algunas citas podrían estar en el pasado
```

### **Quiero empezar de cero**
```
En seed.sql, descomenta estas líneas al inicio:

DELETE FROM google_calendar_settings;
DELETE FROM availability;
DELETE FROM appointments;
DELETE FROM services;
DELETE FROM users;
DELETE FROM tenants;

Luego ejecuta el script completo
```

---

## 🎯 **DESPUÉS DE EJECUTAR**

### **1. Prueba el Calendario**
```bash
npm run dev
```

Ve a: http://localhost:3000/calendar

Deberías ver:
- ✅ Citas de colores en el calendario
- ✅ Click en cita → Popover con detalles
- ✅ Botones de quick action funcionando
- ✅ Drag & drop funcionando

### **2. Prueba Quick Actions**
```
Click en cualquier cita → Popover abierto

Botones disponibles:
✅ Confirmar (cambia a confirmada)
❌ Cancelar (cambia a cancelada)
📋 Duplicar (crea copia en +7 días)
📝 Editar (abre modal)
🗑️ Eliminar (con confirmación)
```

### **3. Crea una Nueva Cita**
```
1. Click en un slot vacío del calendario
2. Formulario abierto con hora pre-seleccionada
3. Selecciona:
   - Servicio: Consulta General
   - Staff: Dr. Juan Rodríguez
   - Cliente: María González
4. Click "Crear Cita"
5. ¡Aparece en el calendario!
```

---

## 📈 **STATS QUE VERÁS**

### **Dashboard (próximamente con datos reales):**
```
📊 Citas Hoy: 4
📅 Próximas Citas: 6
👥 Total Clientes: 4
```

### **Por Estado:**
```
✅ Confirmadas: 5
⏳ Pendientes: 4
✔️ Completadas: 2
❌ Canceladas: 1
```

---

## 💡 **TIPS**

### **Tip 1: Fechas Dinámicas**
```
El script usa NOW() y date_trunc()
Cada vez que ejecutes, las fechas se actualizan
Las citas siempre estarán "hoy", "mañana", etc.
```

### **Tip 2: Agregar Más Datos**
```
Puedes ejecutar el script múltiples veces
El WHERE NOT EXISTS previene duplicados
O modifica el script para agregar más variedad
```

### **Tip 3: Colores Personalizados**
```
Los servicios tienen colores HEX:
- #3b82f6 (azul)
- #10b981 (verde)
- #8b5cf6 (púrpura)
- #f59e0b (naranja)

Puedes cambiarlos en el script
```

---

## 🔄 **MANTENER DATOS FRESCOS**

### **Script para actualizar fechas:**
```sql
-- Mueve todas las citas futuras al día de hoy
UPDATE appointments
SET
  start_time = date_trunc('day', NOW()) + (start_time::time),
  end_time = date_trunc('day', NOW()) + (end_time::time)
WHERE start_time < NOW();
```

---

## 📞 **SOPORTE**

Si tienes problemas:
1. Verifica que ejecutaste `init.sql` primero
2. Revisa que tu conexión a Supabase funcione
3. Verifica que las tablas existen en Table Editor
4. Revisa los errores en el SQL Editor

---

## ✅ **CHECKLIST**

- [ ] Ejecuté `prisma/init.sql` (tablas creadas)
- [ ] Ejecuté `prisma/seed.sql` (datos creados)
- [ ] Verifiqué en Table Editor (hay datos)
- [ ] Actualicé `.env` con las API keys
- [ ] Ejecuté `npm run dev`
- [ ] Abrí `/calendar` y veo citas
- [ ] Probé click en cita (popover funciona)
- [ ] Probé drag & drop (mueve citas)
- [ ] Probé quick actions (confirmar/cancelar)
- [ ] Creé una nueva cita (modal funciona)

**Si todos están ✅ = ¡Sistema 100% funcional!** 🎉

---

**Archivo:** `prisma/seed.sql`
**Tiempo de ejecución:** ~2 segundos
**Resultado:** Sistema listo para usar con datos realistas
