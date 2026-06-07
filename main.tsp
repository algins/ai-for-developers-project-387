import "@typespec/http";

using Http;

@service(#{ title: "Calendar Booking Service API" })
namespace CalendarBooking;

model OwnerProfile {
  @pattern("^[0-9a-fA-F-]{36}$")
  id: string;
  @minLength(1)
  @maxLength(255)
  name: string;
  @format("email")
  email: string;
}

model EventType {
  @pattern("^[0-9a-fA-F-]{36}$")
  id: string;
  @minLength(1)
  @maxLength(100)
  name: string;
  @maxLength(1000)
  description: string;
  @minValue(5)
  @maxValue(480)
  durationMinutes: int32;
  @minValue(0)
  bookingCount: int32;
  nextAvailableSlot?: utcDateTime;
}

model Slot {
  startTime: utcDateTime;
  endTime: utcDateTime;
  isAvailable: boolean;
}

model Booking {
  @pattern("^[0-9a-fA-F-]{36}$")
  id: string;
  @pattern("^[0-9a-fA-F-]{36}$")
  eventTypeId: string;
  @minLength(1)
  @maxLength(255)
  guestName: string;
  @format("email")
  guestEmail: string;
  startTime: utcDateTime;
  endTime: utcDateTime;
  createdAt: utcDateTime;
}

model CreateEventTypeRequest {
  @minLength(1)
  @maxLength(100)
  name: string;
  @maxLength(1000)
  description: string;
  @minValue(5)
  @maxValue(480)
  durationMinutes: int32;
}

model CreateBookingRequest {
  @pattern("^[0-9a-fA-F-]{36}$")
  eventTypeId: string;
  @minLength(1)
  @maxLength(255)
  guestName: string;
  @format("email")
  guestEmail: string;
  startTime: utcDateTime;
}

@error
model BadRequestError {
  @statusCode
  statusCode: 400;
  code: "BAD_REQUEST";
  message: string;
}

@error
model NotFoundError {
  @statusCode
  statusCode: 404;
  code: "NOT_FOUND";
  message: string;
}

@error
model ConflictError {
  @statusCode
  statusCode: 409;
  code: "CONFLICT";
  message: string;
}

alias ServiceError = BadRequestError | NotFoundError | ConflictError;

model CreatedEventTypeResponse {
  @statusCode
  statusCode: 201;
  @body
  body: EventType;
}

model CreatedBookingResponse {
  @statusCode
  statusCode: 201;
  @body
  body: Booking;
}

@tag("Admin")
interface AdminApi {
  @doc("Get the predefined owner profile used in the admin application.")
  @route("/calendar-owner")
  @get
  getOwnerProfile(): OwnerProfile | ServiceError;

  @doc("Create a new event type for the predefined calendar owner.")
  @route("/event-types")
  @post
  createEventType(@body body: CreateEventTypeRequest): CreatedEventTypeResponse | ServiceError;

  @doc("Get upcoming bookings across all event types for the owner.")
  @route("/bookings")
  @get
  listUpcomingBookings(): Booking[] | ServiceError;
}

@tag("Public")
interface PublicApi {
  @doc("List public event types available for booking.")
  @route("/event-types")
  @get
  listEventTypes(): EventType[] | ServiceError;

  @doc("Get owner's available slots in the next 14 days from now. Returned slots are only free slots.")
  @route("/slots")
  @get
  listAvailableSlots(@query durationMinutes?: int32): Slot[] | ServiceError;

  @doc("Create a booking on a free slot in the 14-day booking window. A slot cannot be booked twice, even for different event types.")
  @route("/bookings")
  @post
  createBooking(@body body: CreateBookingRequest): CreatedBookingResponse | ServiceError;
}
