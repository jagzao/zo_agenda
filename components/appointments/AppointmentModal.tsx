'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useServices, useCustomers, Appointment } from '@/lib/hooks/useAppointments'
import { format } from 'date-fns'
import { appointmentSchema } from '@/lib/validations/appointments'
import { toast } from 'sonner'
import { z } from 'zod'

interface AppointmentModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: Partial<Appointment>) => Promise<void>
  appointment?: Appointment | null
  initialDate?: Date
}

export function AppointmentModal({ open, onClose, onSave, appointment, initialDate }: AppointmentModalProps) {
  const { services } = useServices()
  const { customers } = useCustomers()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    serviceId: appointment?.serviceId || '',
    staffId: appointment?.staffId || '',
    customerId: appointment?.customerId || '',
    startTime: appointment?.startTime || initialDate || new Date(),
    endTime: appointment?.endTime || new Date(),
    status: appointment?.status || 'pending' as 'pending' | 'confirmed' | 'cancelled' | 'completed',
    notes: appointment?.notes || '',
  })

  useEffect(() => {
    if (appointment) {
      setFormData({
        serviceId: appointment.serviceId,
        staffId: appointment.staffId,
        customerId: appointment.customerId,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        notes: appointment.notes || '',
      })
    } else if (initialDate) {
      setFormData(prev => ({
        ...prev,
        startTime: initialDate,
        endTime: new Date(initialDate.getTime() + 30 * 60000), // +30 min default
      }))
    }
  }, [appointment, initialDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validate form data
    try {
      appointmentSchema.parse(formData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
        toast.error('Error de validación', {
          description: 'Por favor revisa los campos del formulario',
        })
        return
      }
    }

    setLoading(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Error saving appointment:', error)
      // Error toast is already shown in the hook
    } finally {
      setLoading(false)
    }
  }

  const staff = customers.filter(c => c.role === 'staff')

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{appointment ? 'Editar Cita' : 'Nueva Cita'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="service">Servicio *</Label>
            <Select
              value={formData.serviceId}
              onValueChange={(value) => setFormData({ ...formData, serviceId: value })}
              required
            >
              <SelectTrigger className={errors.serviceId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Seleccionar servicio" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} ({service.duration_minutes} min - ${service.price})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.serviceId && <p className="text-sm text-red-600">{errors.serviceId}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff">Staff *</Label>
            <Select
              value={formData.staffId}
              onValueChange={(value) => setFormData({ ...formData, staffId: value })}
              required
            >
              <SelectTrigger className={errors.staffId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Seleccionar staff" />
              </SelectTrigger>
              <SelectContent>
                {staff.map((person) => (
                  <SelectItem key={person.id} value={person.id}>
                    {person.name || person.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.staffId && <p className="text-sm text-red-600">{errors.staffId}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer">Cliente *</Label>
            <Select
              value={formData.customerId}
              onValueChange={(value) => setFormData({ ...formData, customerId: value })}
              required
            >
              <SelectTrigger className={errors.customerId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Seleccionar cliente" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name || customer.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.customerId && <p className="text-sm text-red-600">{errors.customerId}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Fecha y hora inicio *</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={format(formData.startTime, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: new Date(e.target.value) })
                }
                className={errors.startTime ? 'border-red-500' : ''}
                required
              />
              {errors.startTime && <p className="text-sm text-red-600">{errors.startTime}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Hora fin *</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={format(formData.endTime, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: new Date(e.target.value) })
                }
                className={errors.endTime ? 'border-red-500' : ''}
                required
              />
              {errors.endTime && <p className="text-sm text-red-600">{errors.endTime}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="confirmed">Confirmada</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
                <SelectItem value="completed">Completada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notas adicionales..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : appointment ? 'Actualizar' : 'Crear Cita'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
