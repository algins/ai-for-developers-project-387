import { apiClient } from '@/lib/api-client'
import type {
    Booking,
    BookingList,
    CreateBookingRequest,
    CreateEventTypeRequest,
    EventType,
    EventTypeList,
    OwnerProfile,
    Slot,
    SlotList,
} from '@/types/api'

export const publicApi = {
  listEventTypes: async () => {
    const { data } = await apiClient.get<EventType[]>('/event-types')
    return { items: data } satisfies EventTypeList
  },
  listSlots: async (durationMinutes: number) => {
    const { data } = await apiClient.get<Slot[]>('/slots', {
      params: { durationMinutes },
    })
    return { items: data } satisfies SlotList
  },
  createBooking: async (payload: CreateBookingRequest) => {
    const { data } = await apiClient.post<Booking>('/bookings', payload)
    return data
  },
}

export const adminApi = {
  getOwner: async () => {
    const { data } = await apiClient.get<OwnerProfile>('/calendar-owner')
    return data
  },
  createEventType: async (payload: CreateEventTypeRequest) => {
    const { data } = await apiClient.post<EventType>('/event-types', payload)
    return data
  },
  listUpcomingBookings: async () => {
    const { data } = await apiClient.get<Booking[]>('/bookings')
    return { items: data } satisfies BookingList
  },
}
