'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useTenant } from '@/lib/context/TenantContext'
import { startOfDay, endOfDay, addDays } from 'date-fns'

interface DashboardStats {
  todayAppointments: number
  upcomingAppointments: number
  totalCustomers: number
}

interface UpcomingAppointment {
  id: string
  customer: {
    name: string
  }
  service: {
    name: string
  }
  startTime: Date
  status: string
}

export function useDashboardStats() {
  const { tenantId } = useTenant()
  const [stats, setStats] = useState<DashboardStats>({
    todayAppointments: 0,
    upcomingAppointments: 0,
    totalCustomers: 0,
  })
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    if (!tenantId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const today = new Date()
      const todayStart = startOfDay(today)
      const todayEnd = endOfDay(today)

      // Get today's appointments count
      const { count: todayCount, error: todayError } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenantId)
        .gte('start_time', todayStart.toISOString())
        .lte('start_time', todayEnd.toISOString())

      if (todayError) throw todayError

      // Get upcoming appointments count (next 7 days)
      const { count: upcomingCount, error: upcomingError } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenantId)
        .gte('start_time', today.toISOString())
        .lte('start_time', addDays(today, 7).toISOString())

      if (upcomingError) throw upcomingError

      // Get total customers count
      const { count: customersCount, error: customersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenantId)
        .eq('role', 'customer')

      if (customersError) throw customersError

      // Get upcoming appointments details (today only, max 5)
      const { data: upcomingData, error: upcomingDataError } = await supabase
        .from('appointments')
        .select(`
          id,
          start_time,
          status,
          service:services(name),
          customer:users!customer_id(name)
        `)
        .eq('tenant_id', tenantId)
        .gte('start_time', todayStart.toISOString())
        .lte('start_time', todayEnd.toISOString())
        .order('start_time', { ascending: true })
        .limit(5)

      if (upcomingDataError) throw upcomingDataError

      setStats({
        todayAppointments: todayCount || 0,
        upcomingAppointments: upcomingCount || 0,
        totalCustomers: customersCount || 0,
      })

      setUpcomingAppointments(
        (upcomingData || []).map((apt: any) => ({
          id: apt.id,
          customer: apt.customer,
          service: apt.service,
          startTime: new Date(apt.start_time),
          status: apt.status,
        }))
      )
    } catch (err) {
      console.error('Error fetching dashboard stats:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [tenantId])

  return {
    stats,
    upcomingAppointments,
    loading,
    error,
    refresh: fetchStats,
  }
}
