/* eslint-disable camelcase */
import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const username = String(req.query.username)
  const { date } = req.query

  // http://localhost:3333/api/users/alex-moreira/availability?date=2023-10-04

  if (!date) {
    return res.status(400).json({ message: 'Date no provided.' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User does not exist.' })
  }

  const referenceDate = dayjs(String(date))
  const isPastDate = referenceDate.endOf('day').isBefore(new Date()) // Se a data ja passou

  if (isPastDate) {
    return res.json({ possibleTimes: [], availableTimes: [] })
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  })

  if (!userAvailability) {
    return res.json({ possibleTimes: [], availableTimes: [] })
  }

  const { time_start_in_minutes, time_end_in_minutes } = userAvailability

  const startHour = time_start_in_minutes / 60 // 10 -> retorno / Convertendo o time_start que esta em minutos para horas
  const endHour = time_end_in_minutes / 60 // 18 -> retorno

  // [10, 11, 12, 13, 14, 15, 16, 17] => Horas disponiveis que devem ser retornadas
  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, i) => {
      return startHour + i // Mesmo não alterando os dados para retornar, ele ira percorrer o array e para cada posiçao ira crir uma hora adicionaondo mais 1
    },
  )

  // gte == greater than or equal
  // lte == menor ou igual

  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        // Procurando todos os registros entre esses dois intervalos de userAvailability
        gte: referenceDate.set('hour', startHour).toDate(),
        lte: referenceDate.set('hour', endHour).toDate(),
      },
    },
  })

  // [8, 9, 10] => possibleTimes
  // availableTimes vai passar por cada um validando se não existe nenhum blockedTimes registro na tabela onde os horarios escolhido bata com o agendamento
  const availableTimes = possibleTimes.filter((time) => {
    // Manter apenas quando não existe pelo menos um onde o valor seja a igual a time que é a hora possivel
    return !blockedTimes.some(
      (blockedTime) => blockedTime.date.getHours() === time,
    )
  })

  return res.json({ possibleTimes, availableTimes })
}
