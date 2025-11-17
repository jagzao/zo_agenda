import { z } from 'zod'

export const serviceSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre es demasiado largo'),
  description: z.string().optional(),
  duration: z.number().int().min(5, 'La duración mínima es 5 minutos').max(480, 'La duración máxima es 8 horas'),
  price: z.number().min(0, 'El precio no puede ser negativo'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color inválido (debe ser formato hex: #RRGGBB)').optional(),
  isActive: z.boolean().default(true),
})

export const createServiceSchema = serviceSchema

export const updateServiceSchema = serviceSchema.partial().extend({
  id: z.string().uuid('ID de servicio inválido'),
})

export type ServiceInput = z.infer<typeof serviceSchema>
export type CreateServiceInput = z.infer<typeof createServiceSchema>
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>
