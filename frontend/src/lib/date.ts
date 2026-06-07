import i18next from 'i18next'

export function formatUtc(iso: string): string {
  const d = new Date(iso)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(d)
}

export function formatNextSlot(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  // Time is in UTC (server working hours are UTC)
  const hours = date.getUTCHours().toString().padStart(2, '0')
  const minutes = date.getUTCMinutes().toString().padStart(2, '0')
  const time = `${hours}:${minutes}`

  if (isSameDay(date, now)) {
    return `${i18next.t('common.today')} ${time}`
  }
  if (isSameDay(date, tomorrow)) {
    return `${i18next.t('common.tomorrow')} ${time}`
  }
  const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })
  const day = date.getUTCDate()
  return `${month} ${day} ${time}`
}
