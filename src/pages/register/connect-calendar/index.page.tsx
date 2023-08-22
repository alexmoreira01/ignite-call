import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { api } from '@/lib/axios'
import { Container, Form, Header } from '../styles'

export default function Register() {

  // async function handleRegister(data: RegisterFormData) {

  // }

  return (
    <Container>
      <Header>
        <Heading as="strong">Conecte sua agenda!</Heading>
        <Text>
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos a medida em que são agendados
        </Text>

        <MultiStep size={4} currentStep={2} />
      </Header>

      <Button type="submit" >
        Próximo passo
        <ArrowRight />
      </Button>


    </Container>
  )
}
