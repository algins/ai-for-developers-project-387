import type { components } from '@/types/api.generated'

export type OwnerProfile = components['schemas']['OwnerProfile']
export type EventType = components['schemas']['EventType']
export type EventTypeList = { items: EventType[] }
export type Slot = components['schemas']['Slot']
export type SlotList = { items: Slot[] }
export type Booking = components['schemas']['Booking']
export type BookingList = { items: Booking[] }
export type CreateEventTypeRequest = components['schemas']['CreateEventTypeRequest']
export type CreateBookingRequest = components['schemas']['CreateBookingRequest']
export type ApiErrorPayload =
  | components['schemas']['BadRequestError']
  | components['schemas']['NotFoundError']
  | components['schemas']['ConflictError']

export class ApiError extends Error {
  readonly status: number
  readonly code?: ApiErrorPayload['code']

  constructor(message: string, status: number, code?: ApiErrorPayload['code']) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}
