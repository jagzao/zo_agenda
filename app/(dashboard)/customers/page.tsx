'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, Mail, Phone } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const customers = [
    {
      id: 1,
      name: 'María González',
      email: 'maria@example.com',
      phone: '+1 234-567-8901',
      totalAppointments: 12,
      lastVisit: '2024-11-10',
    },
    {
      id: 2,
      name: 'Carlos Pérez',
      email: 'carlos@example.com',
      phone: '+1 234-567-8902',
      totalAppointments: 8,
      lastVisit: '2024-11-12',
    },
    {
      id: 3,
      name: 'Ana Martínez',
      email: 'ana@example.com',
      phone: '+1 234-567-8903',
      totalAppointments: 5,
      lastVisit: '2024-11-08',
    },
    {
      id: 4,
      name: 'Luis Rodríguez',
      email: 'luis@example.com',
      phone: '+1 234-567-8904',
      totalAppointments: 15,
      lastVisit: '2024-11-13',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-gray-600 mt-1">Gestiona tu base de clientes</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {customers.map((customer, index) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {customer.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{customer.name}</CardTitle>
                    <CardDescription className="mt-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm mt-1">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </div>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-600">Total de citas</p>
                    <p className="text-xl font-bold text-blue-600">
                      {customer.totalAppointments}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Última visita</p>
                    <p className="text-sm font-medium">{customer.lastVisit}</p>
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
