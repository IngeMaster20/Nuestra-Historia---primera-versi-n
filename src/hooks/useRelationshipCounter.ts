import { useEffect, useState } from 'react'

interface Elapsed {
  years: number
  months: number
  days: number
}

function calculateElapsed(startDate: Date, now: Date): Elapsed {
  let years = now.getFullYear() - startDate.getFullYear()
  let months = now.getMonth() - startDate.getMonth()
  let days = now.getDate() - startDate.getDate()

  if (days < 0) {
    months -= 1
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    days += prevMonth.getDate()
  }
  if (months < 0) {
    years -= 1
    months += 12
  }
  return { years, months, days }
}

/** Cuenta el tiempo juntos desde una fecha de inicio, actualizado cada minuto. */
export function useRelationshipCounter(startDateIso: string | null) {
  const [elapsed, setElapsed] = useState<Elapsed | null>(null)

  useEffect(() => {
    if (!startDateIso) return
    const start = new Date(startDateIso)

    function tick() {
      setElapsed(calculateElapsed(start, new Date()))
    }
    tick()
    const interval = setInterval(tick, 60_000)
    return () => clearInterval(interval)
  }, [startDateIso])

  return elapsed
}
