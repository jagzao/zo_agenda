'use client'

import { BigCalendar } from '@/components/calendar/BigCalendar'
import { useState } from 'react'

export default function CalendarPage() {
  const [appointments] = useState([
    {
      id: '1',
      title: 'Cita de ejemplo',
      start: new Date(2024, 10, 15, 10, 0),
      end: new Date(2024, 10, 15, 11, 0),
      resource: { color: '#10b981' },
    },
  ])

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Calendario</h2>
        <p className="text-gray-600">Gestiona tus citas y disponibilidad</p>
      </div>

      <BigCalendar
        appointments={appointments}
        onSelectEvent={(event) => console.log('Selected:', event)}
        onSelectSlot={(slot) => console.log('Slot:', slot)}
      />
    </div>
  )
}
