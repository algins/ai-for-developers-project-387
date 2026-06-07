import { CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocation, useParams } from 'react-router-dom'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatUtc } from '@/lib/date'
import type { Booking } from '@/types/api'

interface LocationState {
  booking?: Booking
}

export function BookingConfirmationPage() {
  const { t } = useTranslation()
  const { bookingId } = useParams()
  const location = useLocation()
  const state = location.state as LocationState
  const booking = state?.booking
  const unknown = t('common.unknown')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
          {t('public.bookingConfirmation.title')}
        </CardTitle>
        <CardDescription>
          {t('public.bookingConfirmation.bookingIdLabel')} <span className="font-mono">{bookingId}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          {t('public.bookingConfirmation.guestLabel')} <strong>{booking?.guestName ?? unknown}</strong>
        </p>
        <p>
          {t('public.bookingConfirmation.emailLabel')} <strong>{booking?.guestEmail ?? unknown}</strong>
        </p>
        <p>
          {t('public.bookingConfirmation.startTimeLabel')} <strong>{booking?.startTime ? formatUtc(booking.startTime) : unknown}</strong>
        </p>
      </CardContent>
    </Card>
  )
}
