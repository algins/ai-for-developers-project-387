import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { QueryState } from '@/components/feedback/query-state'
import { BookingsPageSkeleton } from '@/components/feedback/skeletons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { usePublicEventTypes } from '@/hooks/use-api'

export function AdminEventTypesPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data, isLoading, error } = usePublicEventTypes()
  const items = data?.items ?? []

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{t('nav.adminEventTypes')}</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">{t('admin.eventTypes.description')}</p>
        </div>
        <Button
          className="cursor-pointer px-4"
          onClick={() => navigate('/admin/event-types/create')}
          size="lg"
          type="button"
          variant="outline"
        >
          <Plus className="size-4" />
          {t('admin.eventTypes.actions.create')}
        </Button>
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
                    {t('admin.eventTypes.columns.name')}
                  </TableHead>
                  <TableHead className="h-11 px-4 text-sm font-semibold text-foreground/90">
                    {t('admin.eventTypes.columns.duration')}
                  </TableHead>
                  <TableHead className="h-11 px-4 text-sm font-semibold text-foreground/90">
                    {t('admin.eventTypes.columns.description')}
                  </TableHead>
                  <TableHead className="h-11 px-4 text-sm font-semibold text-foreground/90">
                    {t('admin.eventTypes.columns.bookings')}
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
                      <TableCell className="px-4 py-3.5 font-medium">{item.name}</TableCell>
                      <TableCell className="px-4 py-3.5 text-muted-foreground">
                        {t('admin.eventTypes.values.durationMinutes', { minutes: item.durationMinutes })}
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-muted-foreground">
                        {item.description || t('common.dash')}
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-muted-foreground">
                        {item.bookingCount}
                      </TableCell>
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
