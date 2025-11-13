'use client'

import { useState } from 'react'
import { Calendar, dateFnsLocalizer, Components } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { format, parse, startOfWeek, getDay, addDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Plus, Check, X, Copy, Edit, Trash2 } from 'lucide-react'
import { useAppointments, Appointment } from '@/lib/hooks/useAppointments'
import { AppointmentModal } from '@/components/appointments/AppointmentModal'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import { useAuth } from '@/lib/auth/AuthContext'

const locales = {
  es: es,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const DragAndDropCalendar = withDragAndDrop(Calendar)

export default function CalendarPage() {
  const { user } = useAuth()
  const { appointments, loading, updateAppointment, createAppointment, deleteAppointment } =
    useAppointments()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null)
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null)

  const events = appointments.map((apt) => ({
    id: apt.id,
    title: `${apt.customer?.name || 'Cliente'} - ${apt.service?.name || 'Servicio'}`,
    start: apt.startTime,
    end: apt.endTime,
    resource: {
      appointment: apt,
      color: apt.service?.color || '#3b82f6',
    },
  }))

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedAppointment(null)
    setSelectedSlot(start)
    setModalOpen(true)
  }

  const handleSelectEvent = (event: any) => {
    setSelectedAppointment(event.resource.appointment)
    setSelectedSlot(null)
    setModalOpen(true)
  }

  const handleEventDrop = async ({ event, start, end }: any) => {
    try {
      await updateAppointment(event.id, {
        startTime: start,
        endTime: end,
      })
    } catch (error) {
      console.error('Error updating appointment:', error)
    }
  }

  const handleEventResize = async ({ event, start, end }: any) => {
    try {
      await updateAppointment(event.id, {
        startTime: start,
        endTime: end,
      })
    } catch (error) {
      console.error('Error resizing appointment:', error)
    }
  }

  const handleSave = async (data: Partial<Appointment>) => {
    if (selectedAppointment) {
      await updateAppointment(selectedAppointment.id, data)
    } else {
      await createAppointment({
        ...data,
        tenantId: user?.user_metadata?.tenant_id || 'demo',
      })
    }
  }

  // Quick Actions
  const handleConfirm = async (appointment: Appointment) => {
    await updateAppointment(appointment.id, { status: 'confirmed' })
  }

  const handleCancel = async (appointment: Appointment) => {
    await updateAppointment(appointment.id, { status: 'cancelled' })
  }

  const handleDuplicate = async (appointment: Appointment) => {
    const newStartTime = addDays(appointment.startTime, 7) // 1 semana después
    const duration = appointment.endTime.getTime() - appointment.startTime.getTime()
    const newEndTime = new Date(newStartTime.getTime() + duration)

    await createAppointment({
      ...appointment,
      tenantId: appointment.tenantId,
      startTime: newStartTime,
      endTime: newEndTime,
      status: 'pending',
    })
  }

  const handleDelete = async (appointment: Appointment) => {
    if (confirm('¿Estás seguro de eliminar esta cita?')) {
      await deleteAppointment(appointment.id)
    }
  }

  // Custom Event Component with Quick Actions
  const EventComponent = ({ event }: any) => {
    const appointment = event.resource.appointment
    const [isOpen, setIsOpen] = useState(false)

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            className="h-full w-full p-1 overflow-hidden"
            onMouseEnter={() => setHoveredEvent(event.id)}
            onMouseLeave={() => setHoveredEvent(null)}
          >
            <div className="text-xs font-medium truncate">{event.title}</div>
            <div className="text-[10px] opacity-80 truncate">
              {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" onClick={(e) => e.stopPropagation()}>
          <div className="p-4">
            {/* Header */}
            <div className="mb-3">
              <h3 className="font-semibold text-lg">{appointment.service?.name || 'Servicio'}</h3>
              <div className="text-sm text-gray-600 mt-1">
                {format(appointment.startTime, "HH:mm", { locale: es })} -{' '}
                {format(appointment.endTime, "HH:mm", { locale: es })}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4 text-sm">
              <div>
                <span className="font-medium">Cliente:</span>{' '}
                {appointment.customer?.name || appointment.customer?.email}
              </div>
              <div>
                <span className="font-medium">Staff:</span>{' '}
                {appointment.staff?.name || appointment.staff?.email}
              </div>
              {appointment.service?.price && (
                <div>
                  <span className="font-medium">Precio:</span> ${appointment.service.price}
                </div>
              )}
            </div>

            {/* Status */}
            <div className="mb-4">
              <span
                className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
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
            <div className="grid grid-cols-2 gap-2">
              {appointment.status !== 'confirmed' && appointment.status !== 'completed' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleConfirm(appointment)
                    setIsOpen(false)
                  }}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition text-xs font-medium"
                >
                  <Check className="h-3 w-3" />
                  Confirmar
                </button>
              )}
              {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCancel(appointment)
                    setIsOpen(false)
                  }}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs font-medium"
                >
                  <X className="h-3 w-3" />
                  Cancelar
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDuplicate(appointment)
                  setIsOpen(false)
                }}
                className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-xs font-medium"
              >
                <Copy className="h-3 w-3" />
                Duplicar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsOpen(false)
                  setSelectedAppointment(appointment)
                  setModalOpen(true)
                }}
                className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition text-xs font-medium"
              >
                <Edit className="h-3 w-3" />
                Editar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(appointment)
                  setIsOpen(false)
                }}
                className="col-span-2 flex items-center justify-center gap-1 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-xs font-medium"
              >
                <Trash2 className="h-3 w-3" />
                Eliminar
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  const components: Components = {
    event: EventComponent,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Calendario</h1>
          <p className="text-gray-600 mt-1">
            Click para ver acciones rápidas • Arrastra para reagendar
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedAppointment(null)
            setSelectedSlot(new Date())
            setModalOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Cita
        </Button>
      </div>

      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <DragAndDropCalendar
          localizer={localizer}
          events={events}
          components={components}
          startAccessor="start"
          endAccessor="end"
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
          selectable
          resizable
          defaultView="week"
          views={['month', 'week', 'day', 'agenda']}
          culture="es"
          style={{ height: '700px' }}
          messages={{
            next: 'Siguiente',
            previous: 'Anterior',
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            agenda: 'Agenda',
            date: 'Fecha',
            time: 'Hora',
            event: 'Evento',
            noEventsInRange: 'No hay citas en este rango',
            showMore: (total) => `+ Ver más (${total})`,
          }}
          eventPropGetter={(event) => {
            const backgroundColor = event.resource?.color || '#3b82f6'
            return {
              style: {
                backgroundColor,
                borderRadius: '5px',
                opacity: hoveredEvent === event.id ? 0.95 : 0.8,
                border: '0',
                display: 'block',
                cursor: 'pointer',
                transition: 'opacity 0.2s',
              },
            }
          }}
        />
      </motion.div>

      {/* Modal */}
      <AppointmentModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedAppointment(null)
          setSelectedSlot(null)
        }}
        onSave={handleSave}
        appointment={selectedAppointment}
        initialDate={selectedSlot || undefined}
      />
    </div>
  )
}
