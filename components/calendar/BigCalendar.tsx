'use client'

import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { motion } from 'framer-motion'
import 'react-big-calendar/lib/css/react-big-calendar.css'

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

interface Appointment extends Event {
  id: string
  title: string
  start: Date
  end: Date
  resource?: any
}

interface BigCalendarProps {
  appointments: Appointment[]
  onSelectEvent?: (event: Appointment) => void
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void
}

export function BigCalendar({ appointments, onSelectEvent, onSelectSlot }: BigCalendarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-[600px] bg-white rounded-lg shadow-sm p-4"
    >
      <Calendar
        localizer={localizer}
        events={appointments}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        selectable
        defaultView="week"
        views={['month', 'week', 'day', 'agenda']}
        culture="es"
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
            },
          }
        }}
      />
    </motion.div>
  )
}
