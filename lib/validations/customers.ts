import { z } from 'zod'

export const customerSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre es demasiado largo'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().min(1, 'El teléfono es requerido').max(20, 'El teléfono es demasiado largo'),
  notes: z.string().optional(),
})

export const createCustomerSchema = customerSchema

export const updateCustomerSchema = customerSchema.partial().extend({
  id: z.string().uuid('ID de cliente inválido'),
})

export type CustomerInput = z.infer<typeof customerSchema>
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>
