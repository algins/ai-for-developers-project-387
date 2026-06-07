import { QueryState } from '@/components/feedback/query-state'
import { BookingsPageSkeleton } from '@/components/feedback/skeletons'
import { Card, CardContent } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { useAdminBookings, usePublicEventTypes } from '@/hooks/use-api'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

function formatUtcDateTime(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  }).format(new Date(iso))
}

export function AdminBookingsPage() {
  const { t } = useTranslation()
  const { data, isLoading, error } = useAdminBookings()
  const { data: eventTypesData } = usePublicEventTypes()
  const items = data?.items ?? []
  const eventTypeNameById = useMemo(
    () => new Map((eventTypesData?.items ?? []).map((eventType) => [eventType.id, eventType.name])),
    [eventTypesData],
  )

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{t('nav.adminBookings')}</h2>
        <p className="text-sm text-muted-foreground">{t('admin.bookings.description')}</p>
      </div>

      <QueryState
        isLoading={isLoading}
        error={(error as Error) ?? null}
        loadingFallback={<BookingsPageSkeleton />}
      >
        <Card className="py-0">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-11 px-4 text-sm font-semibold text-foreground/90">
                    {t('admin.bookings.columns.eventType')}
                  </TableHead>
                  <TableHead className="h-11 px-4 text-sm font-semibold text-foreground/90">
                    {t('admin.bookings.columns.starts')}
                  </TableHead>
                  <TableHead className="h-11 px-4 text-sm font-semibold text-foreground/90">
                    {t('admin.bookings.columns.ends')}
                  </TableHead>
                  <TableHead className="h-11 px-4 text-sm font-semibold text-foreground/90">
                    {t('admin.bookings.columns.guest')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-4 py-3.5 text-center text-muted-foreground" colSpan={4}>
                      {t('common.noRecordsFound')}
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow className="hover:bg-muted/30" key={item.id}>
                      <TableCell className="px-4 py-3.5 text-sm font-medium">
                        {eventTypeNameById.get(item.eventTypeId) ?? t('common.unknown')}
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-muted-foreground">{formatUtcDateTime(item.startTime)}</TableCell>
                      <TableCell className="px-4 py-3.5 text-muted-foreground">{formatUtcDateTime(item.endTime)}</TableCell>
                      <TableCell className="px-4 py-3.5 text-muted-foreground">{item.guestName}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </QueryState>
    </section>
  )
}
