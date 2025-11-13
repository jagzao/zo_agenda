'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/AuthContext'
import Link from 'next/link'
import { LogOut, Calendar, Users, Settings, Briefcase, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const navigation = [
    { name: 'Calendario', href: '/calendar', icon: Calendar },
    { name: 'Citas', href: '/appointments', icon: Clock },
    { name: 'Servicios', href: '/services', icon: Briefcase },
    { name: 'Clientes', href: '/customers', icon: Users },
    { name: 'Configuración', href: '/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/calendar">
                <h1 className="text-xl font-bold text-blue-600">Zo Agenda</h1>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Side Navigation */}
        <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-4rem)] border-r">
          <nav className="p-4 space-y-1">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </motion.div>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
