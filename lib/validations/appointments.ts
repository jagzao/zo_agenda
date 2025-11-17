import { z } from 'zod'

export const appointmentSchema = z.object({
  serviceId: z.string().uuid('Debe seleccionar un servicio válido'),
  staffId: z.string().uuid('Debe seleccionar un profesional válido'),
  customerId: z.string().uuid('Debe seleccionar un cliente válido'),
  startTime: z.date({
    required_error: 'La fecha de inicio es requerida',
  }),
  endTime: z.date({
    required_error: 'La fecha de fin es requerida',
  }),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed'], {
    required_error: 'El estado es requerido',
  }),
  notes: z.string().optional(),
}).refine(
  (data) => data.endTime > data.startTime,
  {
    message: 'La hora de fin debe ser posterior a la hora de inicio',
    path: ['endTime'],
  }
)

export const createAppointmentSchema = appointmentSchema

export const updateAppointmentSchema = appointmentSchema.partial().extend({
  id: z.string().uuid('ID de cita inválido'),
})

export type AppointmentInput = z.infer<typeof appointmentSchema>
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>
