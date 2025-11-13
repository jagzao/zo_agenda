'use client'

import { motion } from 'framer-motion'
import { Check, X, Copy, Edit, Trash2, Clock, User, DollarSign } from 'lucide-react'
import { Appointment } from '@/lib/hooks/useAppointments'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface AppointmentTooltipProps {
  appointment: Appointment
  onConfirm: () => void
  onCancel: () => void
  onDuplicate: () => void
  onEdit: () => void
  onDelete: () => void
}

export function AppointmentTooltip({
  appointment,
  onConfirm,
  onCancel,
  onDuplicate,
  onEdit,
  onDelete,
}: AppointmentTooltipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-lg shadow-xl border p-4 min-w-[300px] max-w-[400px]"
    >
      {/* Header */}
      <div className="mb-3">
        <h3 className="font-semibold text-lg">{appointment.service?.name || 'Servicio'}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
          <Clock className="h-4 w-4" />
          <span>
            {format(appointment.startTime, "HH:mm", { locale: es })} -{' '}
            {format(appointment.endTime, "HH:mm", { locale: es })}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <span className="font-medium">Cliente:</span>
          <span>{appointment.customer?.name || appointment.customer?.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <span className="font-medium">Staff:</span>
          <span>{appointment.staff?.name || appointment.staff?.email}</span>
        </div>
        {appointment.service?.price && (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Precio:</span>
            <span>${appointment.service.price}</span>
          </div>
        )}
        {appointment.notes && (
          <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
            <span className="font-medium">Notas:</span> {appointment.notes}
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            appointment.status === 'confirmed'
              ? 'bg-green-100 text-green-700'
              : appointment.status === 'cancelled'
              ? 'bg-red-100 text-red-700'
              : appointment.status === 'completed'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {appointment.status === 'confirmed'
            ? 'Confirmada'
            : appointment.status === 'cancelled'
            ? 'Cancelada'
            : appointment.status === 'completed'
            ? 'Completada'
            : 'Pendiente'}
        </span>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        {appointment.status !== 'confirmed' && appointment.status !== 'completed' && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onConfirm()
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition text-xs font-medium"
          >
            <Check className="h-3 w-3" />
            Confirmar
          </button>
        )}
        {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onCancel()
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs font-medium"
          >
            <X className="h-3 w-3" />
            Cancelar
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDuplicate()
          }}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-xs font-medium"
        >
          <Copy className="h-3 w-3" />
          Duplicar
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
          className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded hover:bg-gray-600 transition text-xs font-medium"
        >
          <Edit className="h-3 w-3" />
          Editar
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-xs font-medium"
        >
          <Trash2 className="h-3 w-3" />
          Eliminar
        </button>
      </div>
    </motion.div>
  )
}
