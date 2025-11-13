'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Calendar as CalendarIcon, Users, Clock } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const stats = [
    {
      name: 'Citas Hoy',
      value: '8',
      icon: CalendarIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Próximas Citas',
      value: '24',
      icon: Clock,
      color: 'bg-green-500',
    },
    {
      name: 'Total Clientes',
      value: '142',
      icon: Users,
      color: 'bg-purple-500',
    },
  ]

  const upcomingAppointments = [
    {
      id: 1,
      customer: 'María González',
      service: 'Consulta General',
      time: '10:00 AM',
      status: 'confirmed',
    },
    {
      id: 2,
      customer: 'Carlos Pérez',
      service: 'Seguimiento',
      time: '11:30 AM',
      status: 'pending',
    },
    {
      id: 3,
      customer: 'Ana Martínez',
      service: 'Primera Consulta',
      time: '2:00 PM',
      status: 'confirmed',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-1">Bienvenido de vuelta</p>
        </div>
        <Link href="/calendar">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Cita
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Próximas Citas</CardTitle>
          <CardDescription>Citas agendadas para hoy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{appointment.customer}</p>
                    <p className="text-sm text-gray-600">{appointment.service}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">{appointment.time}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {appointment.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/appointments">
              <Button variant="outline">Ver Todas las Citas</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
