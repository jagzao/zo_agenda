import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useTenant } from '@/lib/context/TenantContext'
import { toast } from 'sonner'

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
  const { tenantId } = useTenant()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAppointments = async () => {
    if (!tenantId) {
      setLoading(false)
      return
    }

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
        .eq('tenant_id', tenantId)
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
      toast.error('Error al cargar citas', { description: err.message })
    } finally {
      setLoading(false)
    }
  }

  const createAppointment = async (data: Partial<Appointment>) => {
    if (!tenantId) {
      toast.error('Error', { description: 'No se pudo identificar el tenant' })
      throw new Error('No tenant ID')
    }

    try {
      const { error } = await supabase.from('appointments').insert([
        {
          tenant_id: tenantId,
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
      toast.success('Cita creada exitosamente')
      await fetchAppointments()
    } catch (err: any) {
      setError(err.message)
      toast.error('Error al crear cita', { description: err.message })
      throw err
    }
  }

  const updateAppointment = async (id: string, data: Partial<Appointment>) => {
    try {
      const updateData: any = {}
      if (data.serviceId !== undefined) updateData.service_id = data.serviceId
      if (data.staffId !== undefined) updateData.staff_id = data.staffId
      if (data.customerId !== undefined) updateData.customer_id = data.customerId
      if (data.startTime !== undefined) updateData.start_time = data.startTime
      if (data.endTime !== undefined) updateData.end_time = data.endTime
      if (data.status !== undefined) updateData.status = data.status
      if (data.notes !== undefined) updateData.notes = data.notes

      const { error } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', id)
        .eq('tenant_id', tenantId!)

      if (error) throw error
      toast.success('Cita actualizada exitosamente')
      await fetchAppointments()
    } catch (err: any) {
      setError(err.message)
      toast.error('Error al actualizar cita', { description: err.message })
      throw err
    }
  }

  const deleteAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)
        .eq('tenant_id', tenantId!)

      if (error) throw error
      toast.success('Cita eliminada exitosamente')
      await fetchAppointments()
    } catch (err: any) {
      setError(err.message)
      toast.error('Error al eliminar cita', { description: err.message })
      throw err
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [tenantId])

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
  const { tenantId } = useTenant()
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      if (!tenantId) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('active', true)
        .order('name', { ascending: true })

      setServices(data || [])
      setLoading(false)
    }
    fetchServices()
  }, [tenantId])

  return { services, loading }
}

export function useCustomers() {
  const { tenantId } = useTenant()
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!tenantId) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('tenant_id', tenantId)
        .in('role', ['customer', 'staff'])
        .order('name', { ascending: true })

      setCustomers(data || [])
      setLoading(false)
    }
    fetchCustomers()
  }, [tenantId])

  return { customers, loading }
}
