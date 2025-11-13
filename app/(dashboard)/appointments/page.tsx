'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function AppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const appointments = [
    {
      id: 1,
      customer: 'María González',
      service: 'Consulta General',
      date: '2024-11-15',
      time: '10:00 AM',
      status: 'confirmed',
      staff: 'Dr. Juan Pérez',
    },
    {
      id: 2,
      customer: 'Carlos Pérez',
      service: 'Seguimiento',
      date: '2024-11-15',
      time: '11:30 AM',
      status: 'pending',
      staff: 'Dr. Juan Pérez',
    },
    {
      id: 3,
      customer: 'Ana Martínez',
      service: 'Primera Consulta',
      date: '2024-11-15',
      time: '2:00 PM',
      status: 'confirmed',
      staff: 'Dra. Laura García',
    },
    {
      id: 4,
      customer: 'Luis Rodríguez',
      service: 'Control Mensual',
      date: '2024-11-16',
      time: '9:00 AM',
      status: 'cancelled',
      staff: 'Dr. Juan Pérez',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada'
      case 'pending':
        return 'Pendiente'
      case 'cancelled':
        return 'Cancelada'
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Citas</h1>
          <p className="text-gray-600 mt-1">Gestiona todas tus citas</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Cita
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por cliente, servicio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Citas</CardTitle>
          <CardDescription>
            {appointments.length} citas en total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {appointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{appointment.customer}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {getStatusText(appointment.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{appointment.service}</span>
                      <span>•</span>
                      <span>{appointment.staff}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{appointment.time}</p>
                    <p className="text-sm text-gray-600">{appointment.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
