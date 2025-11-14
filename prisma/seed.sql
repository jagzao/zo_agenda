-- ============================================
-- SCRIPT DE DATOS DE PRUEBA - Zo Agenda
-- ============================================
-- Este script crea datos de ejemplo para probar el sistema
-- Ejecutar en: Supabase SQL Editor

-- ============================================
-- LIMPIAR DATOS ANTERIORES (opcional)
-- ============================================
-- PRECAUCIÓN: Esto eliminará TODOS los datos
-- Descomenta solo si quieres empezar de cero

-- DELETE FROM google_calendar_settings;
-- DELETE FROM availability;
-- DELETE FROM appointments;
-- DELETE FROM services;
-- DELETE FROM users;
-- DELETE FROM tenants;

-- ============================================
-- 1. CREAR TENANT DEMO
-- ============================================
INSERT INTO tenants (id, slug, name, plan, settings, created_at)
VALUES (
  gen_random_uuid(),
  'demo',
  'Clínica Demo',
  'pro',
  '{"timezone": "America/Mexico_City", "currency": "MXN"}',
  NOW()
)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name, plan = EXCLUDED.plan;

-- ============================================
-- 2. CREAR SERVICIOS
-- ============================================
INSERT INTO services (id, tenant_id, name, description, duration_minutes, price, color, active)
SELECT
  gen_random_uuid(),
  (SELECT id FROM tenants WHERE slug = 'demo'),
  'Consulta General',
  'Consulta médica general con revisión completa',
  30,
  500.00,
  '#3b82f6',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM services
  WHERE name = 'Consulta General'
  AND tenant_id = (SELECT id FROM tenants WHERE slug = 'demo')
);

INSERT INTO services (id, tenant_id, name, description, duration_minutes, price, color, active)
SELECT
  gen_random_uuid(),
  (SELECT id FROM tenants WHERE slug = 'demo'),
  'Seguimiento',
  'Consulta de seguimiento para pacientes recurrentes',
  20,
  350.00,
  '#10b981',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM services
  WHERE name = 'Seguimiento'
  AND tenant_id = (SELECT id FROM tenants WHERE slug = 'demo')
);

INSERT INTO services (id, tenant_id, name, description, duration_minutes, price, color, active)
SELECT
  gen_random_uuid(),
  (SELECT id FROM tenants WHERE slug = 'demo'),
  'Primera Consulta',
  'Primera consulta con evaluación completa y plan de tratamiento',
  45,
  750.00,
  '#8b5cf6',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM services
  WHERE name = 'Primera Consulta'
  AND tenant_id = (SELECT id FROM tenants WHERE slug = 'demo')
);

INSERT INTO services (id, tenant_id, name, description, duration_minutes, price, color, active)
SELECT
  gen_random_uuid(),
  (SELECT id FROM tenants WHERE slug = 'demo'),
  'Terapia',
  'Sesión de terapia especializada',
  60,
  900.00,
  '#f59e0b',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM services
  WHERE name = 'Terapia'
  AND tenant_id = (SELECT id FROM tenants WHERE slug = 'demo')
);

-- ============================================
-- 3. CREAR USUARIOS (STAFF)
-- ============================================
INSERT INTO users (id, tenant_id, email, role, name, phone, profile)
SELECT
  gen_random_uuid(),
  (SELECT id FROM tenants WHERE slug = 'demo'),
  'dr.rodriguez@demo.com',
  'staff',
  'Dr. Juan Rodríguez',
  '+52 55 1234 5678',
  '{"specialty": "Medicina General", "years_experience": 10}'
WHERE NOT EXISTS (
  SELECT 1 FROM users
  WHERE email = 'dr.rodriguez@demo.com'
);

INSERT INTO users (id, tenant_id, email, role, name, phone, profile)
SELECT
  gen_random_uuid(),
  (SELECT id FROM tenants WHERE slug = 'demo'),
  'dra.garcia@demo.com',
  'staff',
  'Dra. Laura García',
  '+52 55 2345 6789',
  '{"specialty": "Psicología", "years_experience": 8}'
WHERE NOT EXISTS (
  SELECT 1 FROM users
  WHERE email = 'dra.garcia@demo.com'
);

-- ============================================
-- 4. CREAR USUARIOS (CLIENTES)
-- ============================================
INSERT INTO users (id, tenant_id, email, role, name, phone, profile)
SELECT
  gen_random_uuid(),
  (SELECT id FROM tenants WHERE slug = 'demo'),
  'maria.gonzalez@email.com',
  'customer',
  'María González',
  '+52 55 3456 7890',
  '{"preferred_time": "morning", "allergies": "ninguna"}'
WHERE NOT EXISTS (
  SELECT 1 FROM users
  WHERE email = 'maria.gonzalez@email.com'
);

INSERT INTO users (id, tenant_id, email, role, name, phone, profile)
SELECT
  gen_random_uuid(),
  (SELECT id FROM tenants WHERE slug = 'demo'),
  'carlos.perez@email.com',
  'customer',
  'Carlos Pérez',
  '+52 55 4567 8901',
  '{"preferred_time": "afternoon"}'
WHERE NOT EXISTS (
  SELECT 1 FROM users
  WHERE email = 'carlos.perez@email.com'
);

INSERT INTO users (id, tenant_id, email, role, name, phone, profile)
SELECT
  gen_random_uuid(),
  (SELECT id FROM tenants WHERE slug = 'demo'),
  'ana.martinez@email.com',
  'customer',
  'Ana Martínez',
  '+52 55 5678 9012',
  '{"preferred_time": "morning"}'
WHERE NOT EXISTS (
  SELECT 1 FROM users
  WHERE email = 'ana.martinez@email.com'
);

INSERT INTO users (id, tenant_id, email, role, name, phone, profile)
SELECT
  gen_random_uuid(),
  (SELECT id FROM tenants WHERE slug = 'demo'),
  'luis.rodriguez@email.com',
  'customer',
  'Luis Rodríguez',
  '+52 55 6789 0123',
  '{"preferred_time": "afternoon"}'
WHERE NOT EXISTS (
  SELECT 1 FROM users
  WHERE email = 'luis.rodriguez@email.com'
);

-- ============================================
-- 5. CREAR CITAS - HOY
-- ============================================
-- Cita 1: Hoy 10:00 - Confirmada
INSERT INTO appointments (tenant_id, service_id, staff_id, customer_id, start_time, end_time, status, notes)
SELECT
  (SELECT id FROM tenants WHERE slug = 'demo'),
  (SELECT id FROM services WHERE name = 'Consulta General' LIMIT 1),
  (SELECT id FROM users WHERE email = 'dr.rodriguez@demo.com'),
  (SELECT id FROM users WHERE email = 'maria.gonzalez@email.com'),
  date_trunc('day', NOW()) + INTERVAL '10 hours',
  date_trunc('day', NOW()) + INTERVAL '10 hours 30 minutes',
  'confirmed',
  'Primera vez del paciente'
WHERE NOT EXISTS (
  SELECT 1 FROM appointments
  WHERE start_time = date_trunc('day', NOW()) + INTERVAL '10 hours'
  AND customer_id = (SELECT id FROM users WHERE email = 'maria.gonzalez@email.com')
);

-- Cita 2: Hoy 11:30 - Pendiente
INSERT INTO appointments (tenant_id, service_id, staff_id, customer_id, start_time, end_time, status, notes)
SELECT
  (SELECT id FROM tenants WHERE slug = 'demo'),
  (SELECT id FROM services WHERE name = 'Seguimiento' LIMIT 1),
  (SELECT id FROM users WHERE email = 'dr.rodriguez@demo.com'),
  (SELECT id FROM users WHERE email = 'carlos.perez@email.com'),
  date_trunc('day', NOW()) + INTERVAL '11 hours 30 minutes',
  date_trunc('day', NOW()) + INTERVAL '11 hours 50 minutes',
  'pending',
  'Control mensual'
WHERE NOT EXISTS (
  SELECT 1 FROM appointments
  WHERE start_time = date_trunc('day', NOW()) + INTERVAL '11 hours 30 minutes'
);

-- Cita 3: Hoy 14:00 - Confirmada
INSERT INTO appointments (tenant_id, service_id, staff_id, customer_id, start_time, end_time, status, notes)
SELECT
  (SELECT id FROM tenants WHERE slug = 'demo'),
  (SELECT id FROM services WHERE name = 'Primera Consulta' LIMIT 1),
  (SELECT id FROM users WHERE email = 'dra.garcia@demo.com'),
  (SELECT id FROM users WHERE email = 'ana.martinez@email.com'),
  date_trunc('day', NOW()) + INTERVAL '14 hours',
  date_trunc('day', NOW()) + INTERVAL '14 hours 45 minutes',
  'confirmed',
  'Referida por médico familiar'
WHERE NOT EXISTS (
  SELECT 1 FROM appointments
  WHERE start_time = date_trunc('day', NOW()) + INTERVAL '14 hours'
);

-- Cita 4: Hoy 16:00 - Pendiente
INSERT INTO appointments (tenant_id, service_id, staff_id, customer_id, start_time, end_time, status, notes)
SELECT
  (SELECT id FROM tenants WHERE slug = 'demo'),
  (SELECT id FROM services WHERE name = 'Terapia' LIMIT 1),
  (SELECT id FROM users WHERE email = 'dra.garcia@demo.com'),
  (SELECT id FROM users WHERE email = 'luis.rodriguez@email.com'),
  date_trunc('day', NOW()) + INTERVAL '16 hours',
  date_trunc('day', NOW()) + INTERVAL '17 hours',
  'pending',
  'Sesión semanal'
WHERE NOT EXISTS (
  SELECT 1 FROM appointments
  WHERE start_time = date_trunc('day', NOW()) + INTERVAL '16 hours'
);

-- ============================================
-- 6. CREAR CITAS - MAÑANA
-- ============================================
-- Cita 5: Mañana 09:00
INSERT INTO appointments (tenant_id, service_id, staff_id, customer_id, start_time, end_time, status)
SELECT
  (SELECT id FROM tenants WHERE slug = 'demo'),
  (SELECT id FROM services WHERE name = 'Consulta General' LIMIT 1),
  (SELECT id FROM users WHERE email = 'dr.rodriguez@demo.com'),
  (SELECT id FROM users WHERE email = 'maria.gonzalez@email.com'),
  date_trunc('day', NOW()) + INTERVAL '1 day 9 hours',
  date_trunc('day', NOW()) + INTERVAL '1 day 9 hours 30 minutes',
  'confirmed'
WHERE NOT EXISTS (
  SELECT 1 FROM appointments
  WHERE start_time = date_trunc('day', NOW()) + INTERVAL '1 day 9 hours'
);

-- Cita 6: Mañana 10:30
INSERT INTO appointments (tenant_id, service_id, staff_id, customer_id, start_time, end_time, status)
SELECT
  (SELECT id FROM tenants WHERE slug = 'demo'),
  (SELECT id FROM services WHERE name = 'Seguimiento' LIMIT 1),
  (SELECT id FROM users WHERE email = 'dr.rodriguez@demo.com'),
  (SELECT id FROM users WHERE email = 'carlos.perez@email.com'),
  date_trunc('day', NOW()) + INTERVAL '1 day 10 hours 30 minutes',
  date_trunc('day', NOW()) + INTERVAL '1 day 10 hours 50 minutes',
  'pending'
WHERE NOT EXISTS (
  SELECT 1 FROM appointments
  WHERE start_time = date_trunc('day', NOW()) + INTERVAL '1 day 10 hours 30 minutes'
);

-- ============================================
-- 7. CREAR CITAS - PRÓXIMA SEMANA
-- ============================================
-- Lunes próxima semana
INSERT INTO appointments (tenant_id, service_id, staff_id, customer_id, start_time, end_time, status)
SELECT
  (SELECT id FROM tenants WHERE slug = 'demo'),
  (SELECT id FROM services WHERE name = 'Terapia' LIMIT 1),
  (SELECT id FROM users WHERE email = 'dra.garcia@demo.com'),
  (SELECT id FROM users WHERE email = 'ana.martinez@email.com'),
  date_trunc('week', NOW()) + INTERVAL '1 week 10 hours',
  date_trunc('week', NOW()) + INTERVAL '1 week 11 hours',
  'confirmed'
WHERE NOT EXISTS (
  SELECT 1 FROM appointments
  WHERE start_time = date_trunc('week', NOW()) + INTERVAL '1 week 10 hours'
);

-- Martes próxima semana
INSERT INTO appointments (tenant_id, service_id, staff_id, customer_id, start_time, end_time, status)
SELECT
  (SELECT id FROM tenants WHERE slug = 'demo'),
  (SELECT id FROM services WHERE name = 'Primera Consulta' LIMIT 1),
  (SELECT id FROM users WHERE email = 'dr.rodriguez@demo.com'),
  (SELECT id FROM users WHERE email = 'luis.rodriguez@email.com'),
  date_trunc('week', NOW()) + INTERVAL '1 week 1 day 15 hours',
  date_trunc('week', NOW()) + INTERVAL '1 week 1 day 15 hours 45 minutes',
  'pending'
WHERE NOT EXISTS (
  SELECT 1 FROM appointments
  WHERE start_time = date_trunc('week', NOW()) + INTERVAL '1 week 1 day 15 hours'
);

-- ============================================
-- 8. CREAR CITAS - SEMANA PASADA (COMPLETADAS)
-- ============================================
INSERT INTO appointments (tenant_id, service_id, staff_id, customer_id, start_time, end_time, status)
SELECT
  (SELECT id FROM tenants WHERE slug = 'demo'),
  (SELECT id FROM services WHERE name = 'Consulta General' LIMIT 1),
  (SELECT id FROM users WHERE email = 'dr.rodriguez@demo.com'),
  (SELECT id FROM users WHERE email = 'maria.gonzalez@email.com'),
  date_trunc('day', NOW()) - INTERVAL '2 days' + INTERVAL '10 hours',
  date_trunc('day', NOW()) - INTERVAL '2 days' + INTERVAL '10 hours 30 minutes',
  'completed'
WHERE NOT EXISTS (
  SELECT 1 FROM appointments
  WHERE start_time = date_trunc('day', NOW()) - INTERVAL '2 days' + INTERVAL '10 hours'
);

INSERT INTO appointments (tenant_id, service_id, staff_id, customer_id, start_time, end_time, status, notes)
SELECT
  (SELECT id FROM tenants WHERE slug = 'demo'),
  (SELECT id FROM services WHERE name = 'Seguimiento' LIMIT 1),
  (SELECT id FROM users WHERE email = 'dra.garcia@demo.com'),
  (SELECT id FROM users WHERE email = 'carlos.perez@email.com'),
  date_trunc('day', NOW()) - INTERVAL '3 days' + INTERVAL '14 hours',
  date_trunc('day', NOW()) - INTERVAL '3 days' + INTERVAL '14 hours 20 minutes',
  'completed',
  'Evolución positiva'
WHERE NOT EXISTS (
  SELECT 1 FROM appointments
  WHERE start_time = date_trunc('day', NOW()) - INTERVAL '3 days' + INTERVAL '14 hours'
);

-- ============================================
-- 9. CITA CANCELADA
-- ============================================
INSERT INTO appointments (tenant_id, service_id, staff_id, customer_id, start_time, end_time, status, notes)
SELECT
  (SELECT id FROM tenants WHERE slug = 'demo'),
  (SELECT id FROM services WHERE name = 'Terapia' LIMIT 1),
  (SELECT id FROM users WHERE email = 'dra.garcia@demo.com'),
  (SELECT id FROM users WHERE email = 'luis.rodriguez@email.com'),
  date_trunc('day', NOW()) - INTERVAL '1 day' + INTERVAL '16 hours',
  date_trunc('day', NOW()) - INTERVAL '1 day' + INTERVAL '17 hours',
  'cancelled',
  'Cancelado por el paciente'
WHERE NOT EXISTS (
  SELECT 1 FROM appointments
  WHERE start_time = date_trunc('day', NOW()) - INTERVAL '1 day' + INTERVAL '16 hours'
);

-- ============================================
-- 10. AVAILABILITY (Disponibilidad del staff)
-- ============================================
-- Dr. Rodríguez - Lunes a Viernes 9:00-18:00
INSERT INTO availability (tenant_id, staff_id, day_of_week, start_time, end_time)
SELECT
  (SELECT id FROM tenants WHERE slug = 'demo'),
  (SELECT id FROM users WHERE email = 'dr.rodriguez@demo.com'),
  day,
  '09:00',
  '18:00'
FROM generate_series(1, 5) AS day
WHERE NOT EXISTS (
  SELECT 1 FROM availability
  WHERE staff_id = (SELECT id FROM users WHERE email = 'dr.rodriguez@demo.com')
);

-- Dra. García - Lunes a Viernes 10:00-19:00
INSERT INTO availability (tenant_id, staff_id, day_of_week, start_time, end_time)
SELECT
  (SELECT id FROM tenants WHERE slug = 'demo'),
  (SELECT id FROM users WHERE email = 'dra.garcia@demo.com'),
  day,
  '10:00',
  '19:00'
FROM generate_series(1, 5) AS day
WHERE NOT EXISTS (
  SELECT 1 FROM availability
  WHERE staff_id = (SELECT id FROM users WHERE email = 'dra.garcia@demo.com')
);

-- ============================================
-- VERIFICACIÓN
-- ============================================
SELECT '✅ Datos de prueba creados exitosamente!' AS mensaje;

-- Verificar conteos
SELECT
  (SELECT COUNT(*) FROM tenants WHERE slug = 'demo') AS tenants,
  (SELECT COUNT(*) FROM services WHERE tenant_id = (SELECT id FROM tenants WHERE slug = 'demo')) AS servicios,
  (SELECT COUNT(*) FROM users WHERE tenant_id = (SELECT id FROM tenants WHERE slug = 'demo')) AS usuarios,
  (SELECT COUNT(*) FROM appointments WHERE tenant_id = (SELECT id FROM tenants WHERE slug = 'demo')) AS citas,
  (SELECT COUNT(*) FROM availability WHERE tenant_id = (SELECT id FROM tenants WHERE slug = 'demo')) AS disponibilidad;

-- Mostrar resumen
SELECT
  '📊 RESUMEN DE DATOS' AS tipo,
  'Tenant: Clínica Demo' AS detalle
UNION ALL
SELECT '👥 Usuarios',
  '2 staff + 4 clientes = 6 usuarios'
UNION ALL
SELECT '💼 Servicios',
  '4 servicios activos'
UNION ALL
SELECT '📅 Citas',
  'Hoy: 4 | Mañana: 2 | Próxima semana: 2 | Completadas: 2 | Canceladas: 1'
UNION ALL
SELECT '⏰ Disponibilidad',
  'Lun-Vie configurado para ambos doctores';
