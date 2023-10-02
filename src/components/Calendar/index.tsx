import { useMemo, useState } from 'react'

import { CaretLeft, CaretRight } from 'phosphor-react'
import dayjs from 'dayjs'

import { getWeekDays } from '../../utils/get-week-days'

import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from './styles'

interface CalendarWeek {
  week: number
  days: Array<{
    date: dayjs.Dayjs
    disabled: boolean
  }>
}

type CalendarWeeks = CalendarWeek[]

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set('date', 1) // Pegando dia 1 do mes
  })

  function handlePreviousMonth() {
    const previousMonthDate = currentDate.subtract(1, 'month')

    setCurrentDate(previousMonthDate)
  }

  function handleNextMonth() {
    const previousMonthDate = currentDate.add(1, 'month')

    setCurrentDate(previousMonthDate)
  }

  const shortWeekDays = getWeekDays({ short: true })

  const currentMonth = currentDate.format('MMMM') // Mes por extenso
  const currentYear = currentDate.format('YYYY') // Ano por extenso

  // Array.from aqui eles estao criados arrays sem valores somente com o index
  const calendarWeeks = useMemo(() => {
    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, i) => {
      return currentDate.set('date', i + 1)
    })

    // Dia da semana do primeiro dia do mes / day == dia da semana / date é o dia
    const firstWeekDay = currentDate.get('day') // Sempre ira retornar quantos dias faltaram para preencher a linha da semana

    const previousMonthFillArray = Array.from({
      length: firstWeekDay,
    })
      .map((_, i) => {
        return currentDate.subtract(i + 1, 'day') // Pegando a data e voltado os dias da ultima semana do ultimo mes
      })
      .reverse()

    // Setando dia da data no ultimo do mes
    const lasDayInCurrentMonth = currentDate.set(
      'date',
      currentDate.daysInMonth(),
    )
    const lastWeekDay = lasDayInCurrentMonth.get('day')

    const nextMonthFildArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, i) => {
      return lasDayInCurrentMonth.add(i + 1, 'day')
    })

    const calendarDays = [
      ...previousMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
      ...daysInMonthArray.map((date) => {
        return { date, disabled: false }
      }),
      ...nextMonthFildArray.map((date) => {
        return { date, disabled: true }
      }),
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, original) => {
        // weeks = a informação que iremos manipular e retornar
        // _ = não ira ser utilizado mas é cada um dos dias dentro de calendarDays
        // i = index

        // Se ja chegou no fim de uma semana ou não, se o array ja foi completo com 7 itens
        // const weekHashEnded = i % 7 //  se o index for divisivel por 7, chegou no momento de quebrar a semana

        const isNewWeek = i % 7 === 0 // se o moudlo da divisao do index por 7 é igual a 0

        // Primeiro dia de uma nova semana
        if (isNewWeek) {
          weeks.push({
            week: i / 7 + 1,
            days: original.slice(i, i + 7),
          })
        }

        return weeks
      },
      [],
    )

    return calendarWeeks
  }, [currentDate])

  console.log(calendarWeeks)

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>

        <CalendarActions>
          <button onClick={handlePreviousMonth} title="Previous month">
            <CaretLeft />
          </button>
          <button onClick={handleNextMonth} title="Next month">
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>

      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((weekDay) => (
              <th key={weekDay}>{weekDay}.</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map(({ week, days }) => {
            return (
              <tr key={week}>
                {days.map(({ date, disabled }) => {
                  return (
                    <td key={date.toString()}>
                      <CalendarDay disabled={disabled}>
                        {date.get('date')}
                      </CalendarDay>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}
