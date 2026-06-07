package io.hexlet.calendarbooking.repository.inmemory;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import io.hexlet.calendarbooking.model.Booking;
import io.hexlet.calendarbooking.repository.BookingRepository;

@Repository
public class InMemoryBookingRepository implements BookingRepository {
    private final List<Booking> bookings = new ArrayList<>();
    private final Object lock = new Object();

    @Override
    public Booking save(Booking booking) {
        synchronized (lock) {
            bookings.add(booking);
            return booking;
        }
    }

    @Override
    public List<Booking> findUpcoming() {
        var now = Instant.now().truncatedTo(ChronoUnit.MINUTES);

        synchronized (lock) {
            return bookings.stream()
                .filter(booking -> !booking.getStartTime().isBefore(now))
                .toList();
        }
    }

    @Override
    public boolean hasOverlap(Instant startTime, Instant endTime) {
        synchronized (lock) {
            for (var booking : bookings) {
                var overlaps = startTime.isBefore(booking.getEndTime()) && booking.getStartTime().isBefore(endTime);

                if (overlaps) {
                    return true;
                }
            }
            return false;
        }
    }

    @Override
    public long countByEventTypeId(UUID eventTypeId) {
        synchronized (lock) {
            return bookings.stream()
                .filter(booking -> booking.getEventTypeId().equals(eventTypeId))
                .count();
        }
    }
}
