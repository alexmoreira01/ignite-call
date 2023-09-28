import { Avatar, Heading, Text } from '@ignite-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { prisma } from '../../../lib/prisma'
import { ScheduleForm } from './ScheduleForm'
import { Container, UserHeader } from './styles'

interface ScheduleProps {
  user: {
    name: string
    bio: string
    avatarUrl: string
  }
}

export default function Schedule({ user }: ScheduleProps) {
  return (
    <Container>
      <UserHeader>
        <Avatar src={user.avatarUrl} />
        <Heading>{user.name}</Heading>
        <Text>{user.bio}</Text>
      </UserHeader>

      <ScheduleForm />
    </Container>
  )
}

// Quando temos uma pagina no nest que é estatica e temos um paramentro que é dinamico que nesse caso vem da url, obrigatoriamente precisamos criar esse meotdodo
// Ao rodar o build ele vai automaticamente gerar toda as paginas estaticas, e nesse momemento ele não tera os parametros, com esse metodos pode se passa-los,
// nesse caso sera vazio para não ser gerado na build, somente quando acessar a pagina

/// porque precisamos gerar uma pagina estatica por usuario
// Precisamos informar esse metodo para o nest, para ele saber de quais usuarios nos queremos gerar paginas estaticas no momento da build

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking', // Quando tentar acessar uma pagina que não foig gerado, ele ira buscar dos dados no banco ira gerar a pagina e quando estiver pronto ira mostrar
  }
}

// Page static
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username)

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user: {
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
      },
    },
    revalidate: 60 * 60 * 24, // 1 day
  }
}
