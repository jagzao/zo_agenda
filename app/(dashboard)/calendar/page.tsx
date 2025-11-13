'use client'

import { useState } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useAppointments, Appointment } from '@/lib/hooks/useAppointments'
import { AppointmentModal } from '@/components/appointments/AppointmentModal'
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
  const { appointments, loading, updateAppointment, createAppointment } = useAppointments()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null)

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
      // Get tenant from user or use a default
      await createAppointment({
        ...data,
        tenantId: user?.user_metadata?.tenant_id || 'demo', // You'll need to set this properly
      })
    }
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
          <p className="text-gray-600 mt-1">Gestiona tus citas con drag & drop</p>
        </div>
        <Button onClick={() => {
          setSelectedAppointment(null)
          setSelectedSlot(new Date())
          setModalOpen(true)
        }}>
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
                opacity: 0.8,
                border: '0',
                display: 'block',
                cursor: 'pointer',
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
