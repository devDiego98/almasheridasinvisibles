import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatDate(timestamp: number): string {
  return format(new Date(timestamp), "d 'de' MMM 'de' yyyy", { locale: es })
}

export function formatTime(timestamp: number): string {
  return format(new Date(timestamp), 'HH:mm', { locale: es })
}
