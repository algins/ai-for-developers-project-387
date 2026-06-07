import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'

import { AppShell } from '@/components/layout/app-shell'

const HomePage = lazy(() => import('@/pages/public/home-page').then((module) => ({ default: module.HomePage })))
const EventTypePage = lazy(() =>
  import('@/pages/public/event-type-page').then((module) => ({ default: module.EventTypePage })),
)
const BookingConfirmationPage = lazy(() =>
  import('@/pages/public/booking-confirmation-page').then((module) => ({ default: module.BookingConfirmationPage })),
)
const AdminCabinetPage = lazy(() =>
  import('@/pages/admin/admin-cabinet-page').then((module) => ({ default: module.AdminCabinetPage })),
)
const AdminOwnerPage = lazy(() =>
  import('@/pages/admin/owner-page').then((module) => ({ default: module.AdminOwnerPage })),
)
const AdminEventTypesPage = lazy(() =>
  import('@/pages/admin/event-types-page').then((module) => ({ default: module.AdminEventTypesPage })),
)
const AdminEventTypeCreatePage = lazy(() =>
  import('@/pages/admin/event-type-create-page').then((module) => ({ default: module.AdminEventTypeCreatePage })),
)
const AdminBookingsPage = lazy(() =>
  import('@/pages/admin/bookings-page').then((module) => ({ default: module.AdminBookingsPage })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/shared/not-found-page').then((module) => ({ default: module.NotFoundPage })),
)

function App() {
  const { t } = useTranslation()

  return (
    <AppShell>
      <Suspense fallback={<div className="p-4">{t('common.loading')}</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/event-types/:eventTypeId" element={<EventTypePage />} />
          <Route path="/booking/confirmation/:bookingId" element={<BookingConfirmationPage />} />

          <Route path="/admin" element={<AdminCabinetPage />} />
          <Route path="/owner/profile" element={<AdminOwnerPage />} />
          <Route path="/admin/event-types" element={<AdminEventTypesPage />} />
          <Route path="/admin/event-types/create" element={<AdminEventTypeCreatePage />} />
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AppShell>
  )
}

export default App
