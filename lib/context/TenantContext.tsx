'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'
import { supabase } from '@/lib/supabase/client'

interface Tenant {
  id: string
  name: string
  slug: string
  settings: any
  createdAt: Date
}

interface TenantContextType {
  tenant: Tenant | null
  tenantId: string | null
  loading: boolean
  error: string | null
  refreshTenant: () => Promise<void>
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTenant = async () => {
    if (!user) {
      setTenant(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Get user's tenant_id from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', user.id)
        .single()

      if (userError) throw userError
      if (!userData?.tenant_id) {
        throw new Error('Usuario no tiene tenant asignado')
      }

      // Get tenant details
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', userData.tenant_id)
        .single()

      if (tenantError) throw tenantError
      if (!tenantData) {
        throw new Error('Tenant no encontrado')
      }

      setTenant({
        id: tenantData.id,
        name: tenantData.name,
        slug: tenantData.slug,
        settings: tenantData.settings,
        createdAt: new Date(tenantData.created_at),
      })
    } catch (err) {
      console.error('Error fetching tenant:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTenant()
  }, [user])

  const value = {
    tenant,
    tenantId: tenant?.id || null,
    loading,
    error,
    refreshTenant: fetchTenant,
  }

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenant debe ser usado dentro de TenantProvider')
  }
  return context
}
