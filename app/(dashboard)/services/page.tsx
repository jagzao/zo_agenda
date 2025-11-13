'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, Clock, DollarSign } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const services = [
    {
      id: 1,
      name: 'Consulta General',
      description: 'Consulta médica general',
      duration: 30,
      price: 50,
      color: '#3b82f6',
      active: true,
    },
    {
      id: 2,
      name: 'Seguimiento',
      description: 'Consulta de seguimiento',
      duration: 20,
      price: 35,
      color: '#10b981',
      active: true,
    },
    {
      id: 3,
      name: 'Primera Consulta',
      description: 'Primera consulta con evaluación completa',
      duration: 45,
      price: 75,
      color: '#8b5cf6',
      active: true,
    },
    {
      id: 4,
      name: 'Control Mensual',
      description: 'Control mensual de rutina',
      duration: 15,
      price: 25,
      color: '#f59e0b',
      active: true,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Servicios</h1>
          <p className="text-gray-600 mt-1">Gestiona los servicios que ofreces</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Servicio
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar servicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: service.color }}
                  >
                    <span className="text-white font-bold text-lg">
                      {service.name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    Activo
                  </span>
                </div>
                <CardTitle className="mt-4">{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {service.duration} min
                  </div>
                  <div className="flex items-center font-semibold text-blue-600">
                    <DollarSign className="h-4 w-4" />
                    {service.price}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
