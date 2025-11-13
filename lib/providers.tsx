'use client'

import { ApolloProvider } from '@apollo/client'
import { Provider as JotaiProvider } from 'jotai'
import { apolloClient } from '@/lib/graphql/client'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
    </JotaiProvider>
  )
}
