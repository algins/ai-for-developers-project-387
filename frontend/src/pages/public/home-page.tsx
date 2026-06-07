import { CalendarDays } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { QueryState } from '@/components/feedback/query-state'
import { HomePageSkeleton } from '@/components/feedback/skeletons'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { usePublicEventTypes } from '@/hooks/use-api'
import { cn } from '@/lib/utils'

export function HomePage() {
  const { t } = useTranslation()
  const { data, isLoading, error } = usePublicEventTypes()
  const items = data?.items ?? []
  const location = useLocation()
  const navigate = useNavigate()
  const handledToastLocationKeyRef = useRef<string | null>(null)

  // Show booking details in a toast if redirected from booking
  useEffect(() => {
    const booking = location.state?.booking
    if (booking) {
      // React Strict Mode can run effects twice in development; guard by location key.
      if (handledToastLocationKeyRef.current === location.key) {
        return
      }
      handledToastLocationKeyRef.current = location.key

      toast.success(t('public.eventType.toasts.created'))
      // Clear state so toast doesn't repeat
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.key, location.state, t, navigate, location.pathname])

  return (
    <section className="space-y-6">
      <QueryState
        isLoading={isLoading}
        error={(error as Error) ?? null}
        isEmpty={!isLoading && items.length === 0}
        emptyText={t('public.home.empty')}
        loadingFallback={<HomePageSkeleton />}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <Card
              key={item.id}
              className="group border bg-card p-6 hover:bg-muted/30"
            >
              <CardContent className="flex flex-col gap-4 p-0">
                {/* Top row: title + badge */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {item.name}
                  </span>
                  <Badge
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-xs font-normal',
                      item.nextAvailableSlot
                        ? 'border border-green-200 bg-green-100 text-green-700'
                        : 'border border-red-200 bg-red-100 text-red-700',
                    )}
                    variant="secondary"
                  >
                    {item.nextAvailableSlot
                      ? t('public.home.available')
                      : t('public.home.fullyBooked')}
                  </Badge>
                </div>

                {/* Big value */}
                <div className="text-3xl font-bold tracking-tight">
                  {item.durationMinutes}
                  <span className="ml-1 text-lg font-medium text-muted-foreground">{t('public.home.minutesUnit')}</span>
                </div>

                {/* Description / action */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>

                {/* Bottom link */}
                <Link
                  className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                  to={`/event-types/${item.id}`}
                >
                  <CalendarDays className="h-3.5 w-3.5" />
                  {t('public.home.openSlots')}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </QueryState>
    </section>
  )
}
