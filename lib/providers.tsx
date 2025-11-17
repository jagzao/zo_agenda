'use client'

import { ApolloProvider } from '@apollo/client'
import { Provider as JotaiProvider } from 'jotai'
import { apolloClient } from '@/lib/graphql/client'
import { AuthProvider } from '@/lib/auth/AuthContext'
import { TenantProvider } from '@/lib/context/TenantContext'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <ApolloProvider client={apolloClient}>
        <AuthProvider>
          <TenantProvider>
            {children}
            <Toaster position="top-right" richColors />
          </TenantProvider>
        </AuthProvider>
      </ApolloProvider>
    </JotaiProvider>
  )
}
