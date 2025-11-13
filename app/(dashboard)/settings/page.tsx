'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-gray-600 mt-1">Configura tu cuenta y preferencias</p>
      </div>

      {/* Profile Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Actualiza tu información personal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input id="name" placeholder="Tu nombre" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="tu@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" type="tel" placeholder="+1 234-567-8900" />
            </div>
            <Button>Guardar Cambios</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Google Calendar Integration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Google Calendar
            </CardTitle>
            <CardDescription>
              Sincroniza tus citas con Google Calendar automáticamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-3">
                Al conectar Google Calendar, tus citas se sincronizarán automáticamente en
                ambas direcciones.
              </p>
              <Button variant="outline" className="w-full">
                Conectar Google Calendar
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tenant Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Organización</CardTitle>
            <CardDescription>Configuración de tu organización</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tenantName">Nombre de la organización</Label>
              <Input id="tenantName" placeholder="Mi Clínica" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenantSlug">Slug (URL única)</Label>
              <Input id="tenantSlug" placeholder="mi-clinica" />
              <p className="text-xs text-gray-500">
                URL pública: https://zoagenda.com/book/mi-clinica
              </p>
            </div>
            <Button>Guardar Cambios</Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
