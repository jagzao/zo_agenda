-- ============================================
-- Zo Agenda Multi-Tenant Database Schema
-- Execute this in Supabase SQL Editor
-- ============================================

-- Activate extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_graphql";

-- ============================================
-- TENANTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free',
  settings JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer',
  name TEXT,
  phone TEXT,
  avatar TEXT,
  profile JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS users_tenant_id_idx ON users(tenant_id);
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

-- ============================================
-- SERVICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  price DECIMAL(10,2),
  color TEXT DEFAULT '#3b82f6',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS services_tenant_id_idx ON services(tenant_id);

-- ============================================
-- APPOINTMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id),
  staff_id UUID NOT NULL REFERENCES users(id),
  customer_id UUID NOT NULL REFERENCES users(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  google_event_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS appointments_tenant_id_idx ON appointments(tenant_id);
CREATE INDEX IF NOT EXISTS appointments_staff_id_idx ON appointments(staff_id);
CREATE INDEX IF NOT EXISTS appointments_customer_id_idx ON appointments(customer_id);
CREATE INDEX IF NOT EXISTS appointments_start_time_idx ON appointments(start_time);

-- ============================================
-- AVAILABILITY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS availability_tenant_id_idx ON availability(tenant_id);
CREATE INDEX IF NOT EXISTS availability_staff_id_idx ON availability(staff_id);

-- ============================================
-- GOOGLE CALENDAR SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS google_calendar_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  calendar_id TEXT NOT NULL,
  sync_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- TRIGGER FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_availability_updated_at BEFORE UPDATE ON availability
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_google_calendar_settings_updated_at BEFORE UPDATE ON google_calendar_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_calendar_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for TENANTS
CREATE POLICY "Users can view their own tenant"
  ON tenants FOR SELECT
  USING (id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Admins can update their tenant"
  ON tenants FOR UPDATE
  USING (id IN (
    SELECT tenant_id FROM users
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- RLS Policies for USERS
CREATE POLICY "Users can view users in their tenant"
  ON users FOR SELECT
  USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Admins can manage users in their tenant"
  ON users FOR ALL
  USING (tenant_id IN (
    SELECT tenant_id FROM users
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- RLS Policies for SERVICES
CREATE POLICY "Users can view services in their tenant"
  ON services FOR SELECT
  USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Admins can manage services in their tenant"
  ON services FOR ALL
  USING (tenant_id IN (
    SELECT tenant_id FROM users
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- RLS Policies for APPOINTMENTS
CREATE POLICY "Users can view appointments in their tenant"
  ON appointments FOR SELECT
  USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Staff and admins can create appointments"
  ON appointments FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM users
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Staff and admins can update appointments"
  ON appointments FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM users
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Staff and admins can delete appointments"
  ON appointments FOR DELETE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM users
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- RLS Policies for AVAILABILITY
CREATE POLICY "Users can view availability in their tenant"
  ON availability FOR SELECT
  USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Staff can manage their own availability"
  ON availability FOR ALL
  USING (
    staff_id = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for GOOGLE CALENDAR SETTINGS
CREATE POLICY "Users can manage their own calendar settings"
  ON google_calendar_settings FOR ALL
  USING (user_id = auth.uid());

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================

-- Create a demo tenant
INSERT INTO tenants (slug, name, plan)
VALUES ('demo', 'Demo Clinic', 'free')
ON CONFLICT (slug) DO NOTHING;

COMMENT ON TABLE tenants IS 'Multi-tenant organizations';
COMMENT ON TABLE users IS 'Users with role-based access';
COMMENT ON TABLE services IS 'Services offered by each tenant';
COMMENT ON TABLE appointments IS 'Scheduled appointments';
COMMENT ON TABLE availability IS 'Staff availability schedule';
COMMENT ON TABLE google_calendar_settings IS 'Google Calendar sync settings per user';
