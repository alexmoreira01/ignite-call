import { globalCss } from '@ignite-ui/react'

export const globalStyles = globalCss({
  '*': {
    boxSizing: 'border-box',
    padding: 0,
    margin: 0,
  },

  body: {
    backgroundColor: '$gray900', // Cor de fundo da aplicação
    color: '$gray100', // cor de texto
    '-webkit-font-smoothing': 'antialiased',
  },
})
