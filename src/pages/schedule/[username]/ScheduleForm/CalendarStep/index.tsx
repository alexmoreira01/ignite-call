import { useEffect, useState } from 'react'
import { api } from '@/lib/axios'
import { Calendar } from '../../../../../components/Calendar'

import dayjs from 'dayjs'

import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from './styles'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'

interface Availability {
  possibleTimes: number[]
  availableTimes: number[]
}

interface CalendarStepProps {
  onSelectDateTime: (date: Date) => void
}

export function CalendarStep({ onSelectDateTime }: CalendarStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  // const [availability, setAvailability] = useState<Availability | null>(null)

  const router = useRouter()

  const isDateSelected = !!selectedDate // Transform in boolean
  const username = String(router.query.username)

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const describeDate = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null

  // 1- parametro => Chave da query - id - importante que contenha todos os parametros(O que ele esta enviando) possiveis da query pois se tera cache/ não se da o mesmo nome caso tenha outro parametro envolvido/dinamica
  // 2- parametro => Operção em si
  // Availability => Os dados retornados teram esse formato passados em <>
  // 3- parametro, apos a requisição => Pode se passar a opção de execução dela
  const { data: availability } = useQuery<Availability>(
    ['availability', selectedDateWithoutTime],
    async () => {
      const response = await api.get(`users/${username}/availability`, {
        params: {
          date: selectedDateWithoutTime,
        },
      })

      return response.data
    },
    {
      enabled: !!selectedDate, // Caso essa data exista / !! transforma em bollean
    },
  )

  // Antes
  // useEffect(() => {
  //   if (!selectedDate) {
  //     return
  //   }

  //   api
  //     .get(`users/${username}/availability`, {
  //       params: {
  //         date: dayjs(selectedDate).format('YYYY-MM-DD'),
  //       },
  //     })
  //     .then((response) => {
  //       setAvailability(response.data)
  //     })
  // }, [selectedDate, username])

  function handleSelectTime(hour: number) {
    const dateWithTime = dayjs(selectedDate)
      .set('hour', hour)
      .startOf('hour')
      .toDate()

    onSelectDateTime(dateWithTime)
  }

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay} <span>{describeDate}</span>
          </TimePickerHeader>

          <TimePickerList>
            {availability?.possibleTimes.map((hour) => {
              return (
                // Se o horario for menor que 10, ira preencher com 0 antes
                <TimePickerItem
                  key={hour}
                  onClick={() => handleSelectTime(hour)}
                  // Caso não exista ele estara disabled
                  disabled={!availability.availableTimes.includes(hour)}
                >
                  {String(hour).padStart(2, '0')}:00h
                </TimePickerItem>
              )
            })}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )
}
