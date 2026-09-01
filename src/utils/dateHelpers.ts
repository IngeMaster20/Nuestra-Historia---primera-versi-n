import { format, differenceInCalendarDays } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatLongDate(iso: string): string {
  return format(new Date(iso), "d 'de' MMMM 'de' yyyy", { locale: es })
}

export function formatShortDate(iso: string): string {
  return format(new Date(iso), 'd MMM yyyy', { locale: es })
}

/** Días que faltan para la próxima ocurrencia anual de una fecha (cumpleaños, aniversario, etc). */
export function daysUntilNextOccurrence(iso: string): number {
  const today = new Date()
  const original = new Date(iso)
  let next = new Date(today.getFullYear(), original.getMonth(), original.getDate())
  if (next < today) {
    next = new Date(today.getFullYear() + 1, original.getMonth(), original.getDate())
  }
  return differenceInCalendarDays(next, today)
}
