'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    router.push('/dashboard')
  }

  const signUp = async (email: string, password: string, name: string) => {
    // Step 1: Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })
    if (error) throw error
    if (!data.user) throw new Error('No se pudo crear el usuario')

    // Step 2: Create tenant for this user
    const tenantSlug = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-')
    const { data: tenantData, error: tenantError } = await supabase
      .from('tenants')
      .insert({
        name: `${name}'s Clinic`,
        slug: `${tenantSlug}-${Date.now()}`,
        settings: {},
      })
      .select()
      .single()

    if (tenantError) {
      console.error('Error creating tenant:', tenantError)
      throw new Error('Error al crear el espacio de trabajo')
    }

    // Step 3: Create user record in users table
    const { error: userError } = await supabase.from('users').insert({
      id: data.user.id,
      tenant_id: tenantData.id,
      email: email,
      name: name,
      role: 'admin', // First user is admin
    })

    if (userError) {
      console.error('Error creating user record:', userError)
      throw new Error('Error al crear el perfil de usuario')
    }

    router.push('/dashboard')
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
