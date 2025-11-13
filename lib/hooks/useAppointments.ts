import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export interface Appointment {
  id: string
  tenantId: string
  serviceId: string
  staffId: string
  customerId: string
  startTime: Date
  endTime: Date
  status: string
  notes?: string
  googleEventId?: string
  service?: {
    name: string
    color: string
    durationMinutes: number
    price: number
  }
  staff?: {
    name: string
    email: string
  }
  customer?: {
    name: string
    email: string
    phone?: string
  }
}

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          service:services(*),
          staff:users!staff_id(*),
          customer:users!customer_id(*)
        `)
        .order('start_time', { ascending: true })

      if (error) throw error

      setAppointments(
        data.map((apt: any) => ({
          ...apt,
          startTime: new Date(apt.start_time),
          endTime: new Date(apt.end_time),
        }))
      )
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createAppointment = async (data: Partial<Appointment>) => {
    try {
      const { error } = await supabase.from('appointments').insert([
        {
          tenant_id: data.tenantId,
          service_id: data.serviceId,
          staff_id: data.staffId,
          customer_id: data.customerId,
          start_time: data.startTime,
          end_time: data.endTime,
          status: data.status || 'pending',
          notes: data.notes,
        },
      ])

      if (error) throw error
      await fetchAppointments()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const updateAppointment = async (id: string, data: Partial<Appointment>) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({
          service_id: data.serviceId,
          staff_id: data.staffId,
          customer_id: data.customerId,
          start_time: data.startTime,
          end_time: data.endTime,
          status: data.status,
          notes: data.notes,
        })
        .eq('id', id)

      if (error) throw error
      await fetchAppointments()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const deleteAppointment = async (id: string) => {
    try {
      const { error } = await supabase.from('appointments').delete().eq('id', id)

      if (error) throw error
      await fetchAppointments()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  return {
    appointments,
    loading,
    error,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    refetch: fetchAppointments,
  }
}

export function useServices() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from('services').select('*').eq('active', true)
      setServices(data || [])
      setLoading(false)
    }
    fetchServices()
  }, [])

  return { services, loading }
}

export function useCustomers() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data } = await supabase
        .from('users')
        .select('*')
        .in('role', ['customer', 'staff'])
      setCustomers(data || [])
      setLoading(false)
    }
    fetchCustomers()
  }, [])

  return { customers, loading }
}
