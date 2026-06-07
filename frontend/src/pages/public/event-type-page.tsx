import { zodResolver } from '@hookform/resolvers/zod'
import type { TFunction } from 'i18next'
import { Calendar, Clock, User } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { QueryState } from '@/components/feedback/query-state'
import { EventTypePageSkeleton } from '@/components/feedback/skeletons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateBooking, usePublicEventTypes, usePublicSlots } from '@/hooks/use-api'
import { formatUtc } from '@/lib/date'
import type { Slot } from '@/types/api'

function createBookingSchema(t: TFunction) {
  return z.object({
    guestName: z
      .string()
      .min(1, t('public.eventType.validation.guestNameRequired'))
      .max(255, t('public.eventType.validation.guestNameMax', { max: 255 })),
    guestEmail: z.string().email(t('public.eventType.validation.guestEmailInvalid')),
    startTime: z.string().min(1, t('public.eventType.validation.startTimeRequired')),
  })
}

type BookingFormData = z.infer<ReturnType<typeof createBookingSchema>>

function getDayKey(value: string) {
  return value.slice(0, 10)
}

function formatDayCaption(value: string) {
  const d = new Date(value)
  return new Intl.DateTimeFormat('en-US', { weekday: 'short', day: 'numeric', timeZone: 'UTC' }).format(d)
}

function formatTimeValue(value: string) {
  const d = new Date(value)
  const hours = d.getUTCHours().toString().padStart(2, '0')
  const minutes = d.getUTCMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

export function EventTypePage() {
  const { t } = useTranslation()
  const { eventTypeId } = useParams()
  const navigate = useNavigate()
  const createBooking = useCreateBooking()
  const eventTypesQuery = usePublicEventTypes()
  const bookingSchema = createBookingSchema(t)

  const eventType = useMemo(
    () => eventTypesQuery.data?.items.find((item) => item.id === eventTypeId),
    [eventTypesQuery.data?.items, eventTypeId],
  )

  const slotsQuery = usePublicSlots(eventType?.durationMinutes ?? 30)

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guestName: '',
      guestEmail: '',
      startTime: '',
    },
  })

  const slots = useMemo(() => slotsQuery.data?.items ?? [], [slotsQuery.data?.items])
  const [manualDayKey, setManualDayKey] = useState<string | null>(null)

  const dayKeys = useMemo(() => {
    const keys = new Set(slots.map((slot) => getDayKey(slot.startTime)))
    return Array.from(keys).sort((a, b) => a.localeCompare(b))
  }, [slots])

  const selectedDayKey = manualDayKey && dayKeys.includes(manualDayKey) ? manualDayKey : dayKeys[0] ?? null

  const slotsByDay = useMemo(() => {
    return slots.reduce<Record<string, Slot[]>>((acc, slot) => {
      const key = getDayKey(slot.startTime)
      const list = acc[key] ?? []
      list.push(slot)
      acc[key] = list
      return acc
    }, {})
  }, [slots])

  const selectedDaySlots = selectedDayKey ? slotsByDay[selectedDayKey] ?? [] : []
  const selectedStartTime = useWatch({ control: form.control, name: 'startTime' })

  const onSubmit = form.handleSubmit(async (values) => {
    if (!eventTypeId) {
      return
    }

    try {
      const booking = await createBooking.mutateAsync({
        eventTypeId,
        guestName: values.guestName,
        guestEmail: values.guestEmail,
        startTime: values.startTime,
      })
      navigate('/', { state: { booking } })
    } catch (error) {
      const message = error instanceof Error ? error.message : t('public.eventType.toasts.createFailed')
      toast.error(message)
    }
  })

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{eventType?.name ?? t('public.eventType.fallbackName')}</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {eventType?.description ?? t('public.eventType.fallbackDescription')}
        </p>
      </div>
      <QueryState
        isLoading={slotsQuery.isLoading}
        error={(slotsQuery.error as Error) ?? null}
        isEmpty={!slotsQuery.isLoading && slots.length === 0}
        emptyText={t('public.eventType.emptySlots')}
        loadingFallback={<EventTypePageSkeleton />}
      >
        <form className="grid gap-4 xl:grid-cols-[280px_1fr_300px] w-full" onSubmit={onSubmit}>
          <Card className="border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4 text-muted-foreground" />
                {t('public.eventType.guestDetails')}
              </CardTitle>
              <CardDescription>
                {t('public.eventType.guestDetailsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="guestName">{t('public.eventType.labels.guestName')}</Label>
                <Input id="guestName" placeholder={t('public.eventType.placeholders.guestName')} {...form.register('guestName')} />
                {form.formState.errors.guestName && (
                  <p className="text-sm text-destructive">{form.formState.errors.guestName.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="guestEmail">{t('public.eventType.labels.guestEmail')}</Label>
                <Input
                  id="guestEmail"
                  placeholder={t('public.eventType.placeholders.guestEmail')}
                  type="email"
                  {...form.register('guestEmail')}
                />
                {form.formState.errors.guestEmail && (
                  <p className="text-sm text-destructive">{form.formState.errors.guestEmail.message}</p>
                )}
              </div>
              <input type="hidden" {...form.register('startTime')} />
              {form.formState.errors.startTime && (
                <p className="text-sm text-destructive">{form.formState.errors.startTime.message}</p>
              )}
            </CardContent>
          </Card>

          <Card className="border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {t('public.eventType.calendarTitle')}
              </CardTitle>
              <CardDescription>{t('public.eventType.calendarDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-5">
                {dayKeys.map((dayKey) => {
                  const isActive = dayKey === selectedDayKey
                  const availableCount = (slotsByDay[dayKey] ?? []).filter((slot) => slot.isAvailable).length
                  return (
                    <button
                      key={dayKey}
                      className={`rounded-md border px-2.5 py-2 text-left text-sm cursor-pointer ${
                        isActive
                          ? 'border-primary/50 bg-primary/10 text-primary'
                          : 'border-border/80 bg-background hover:border-primary/30 hover:bg-muted/70'
                      }`}
                      onClick={() => setManualDayKey(dayKey)}
                      type="button"
                    >
                      <p className="font-semibold">{formatDayCaption(dayKey)}</p>
                      <p className="text-xs text-muted-foreground">{t('public.eventType.daySlots', { count: availableCount })}</p>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {t('public.eventType.slotStatus')}
              </CardTitle>
              <CardDescription>
                {selectedDayKey ? formatUtc(selectedDayKey) : t('public.eventType.noDaySelected')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {selectedDaySlots.map((slot) => {
                  const isSelected = selectedStartTime === slot.startTime
                  return (
                    <button
                      key={slot.startTime}
                      className={`flex w-full items-center justify-between rounded-md border px-2.5 py-2 text-sm ${
                        slot.isAvailable
                          ? isSelected
                            ? 'border-primary/40 bg-primary/10 text-primary cursor-pointer'
                            : 'border-border bg-background hover:border-primary/30 hover:bg-muted/70 cursor-pointer'
                          : 'cursor-not-allowed border-border/70 bg-muted/40 text-muted-foreground'
                      }`}
                      disabled={!slot.isAvailable}
                      onClick={() => form.setValue('startTime', slot.startTime, { shouldDirty: true, shouldValidate: true })}
                      type="button"
                    >
                      <span>
                        {formatTimeValue(slot.startTime)} - {formatTimeValue(slot.endTime)}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        {slot.isAvailable ? t('public.eventType.utc') : ''}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="pt-3">
                <Button className="w-full cursor-pointer" disabled={createBooking.isPending || !selectedStartTime} type="submit">
                  {createBooking.isPending ? t('public.eventType.actions.booking') : t('public.eventType.actions.continue')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </QueryState>
    </section>
  )
}
