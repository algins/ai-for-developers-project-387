package io.hexlet.calendarbooking.repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import io.hexlet.calendarbooking.model.Booking;

public interface BookingRepository {
    Booking save(Booking booking);
    List<Booking> findUpcoming();
    boolean hasOverlap(Instant startTime, Instant endTime);
    long countByEventTypeId(UUID eventTypeId);
}
