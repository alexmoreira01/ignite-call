import '../lib/dayjs' // Carregar configs do dayjs

import { SessionProvider } from 'next-auth/react'
import { globalStyles } from '@/styles/global'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'
import type { AppProps } from 'next/app'

globalStyles() // Carregamos uma unica vez, caso fique no componente ira carregar toda vez

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
  )
}
