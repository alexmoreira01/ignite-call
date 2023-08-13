import { globalStyles } from '@/styles/global'
import type { AppProps } from 'next/app'

globalStyles() // Carregamos uma unica vez, caso fique no componente ira carregar toda vez

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
