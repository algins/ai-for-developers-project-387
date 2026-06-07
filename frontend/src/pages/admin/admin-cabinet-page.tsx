import { useMemo } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { useAdminBookings, usePublicEventTypes } from '@/hooks/use-api'
import { useTranslation } from 'react-i18next'

export function AdminCabinetPage() {
  const { t } = useTranslation()
  const { data: eventTypesData } = usePublicEventTypes()
  const { data: bookingsData } = useAdminBookings()

  const eventTypesCount = eventTypesData?.items.length ?? 0
  const bookings = bookingsData?.items ?? []

  const chartData = useMemo(() => {
    const byDay = new Map<string, number>()
    for (const booking of bookings) {
      const dayKey = booking.startTime.slice(0, 10)
      byDay.set(dayKey, (byDay.get(dayKey) ?? 0) + 1)
    }

    const weekdayFormatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      timeZone: 'UTC',
    })

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    })

    const now = new Date()
    const startUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(startUtc + index * 24 * 60 * 60 * 1000)
      const dayKey = date.toISOString().slice(0, 10)
      return {
        id: dayKey,
        weekdayLabel: weekdayFormatter.format(date),
        dateLabel: dateFormatter.format(date),
        value: byDay.get(dayKey) ?? 0,
      }
    })
  }, [bookings])

  const maxOccupied = Math.max(...chartData.map((item) => item.value), 1)

  return (
    <section className="space-y-6">
      {/* Header row */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{t('admin.cabinet.heading')}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t('admin.cabinet.description')}</p>
      </div>

      <Card className="border bg-card p-6">
        <CardContent className="space-y-4 p-0">
          <p className="text-sm text-muted-foreground">{t('admin.cabinet.chart.description')}</p>

          <div className="rounded-lg border bg-muted/15 px-3 py-4">
            <div className="flex h-48 items-end gap-2">
              {chartData.map((item) => {
                const heightPercent = item.value === 0 ? 8 : Math.round((item.value / maxOccupied) * 100)

                return (
                  <div className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2" key={item.id}>
                    <span className="text-xs text-muted-foreground">{item.value}</span>
                    <div className="flex h-32 w-full items-end rounded-md bg-muted/70 px-1">
                      <div
                        className="w-full rounded-sm bg-primary"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground">{item.weekdayLabel}</span>
                    <span className="text-[11px] text-muted-foreground/90">{item.dateLabel}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">{t('admin.cabinet.chart.caption', { count: eventTypesCount })}</p>
        </CardContent>
      </Card>
    </section>
  )
}
