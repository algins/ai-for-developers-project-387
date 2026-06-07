package io.hexlet.calendarbooking.service;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.hexlet.calendarbooking.dto.BookingCreateDto;
import io.hexlet.calendarbooking.dto.BookingDto;
import io.hexlet.calendarbooking.exception.BadRequestException;
import io.hexlet.calendarbooking.exception.ConflictException;
import io.hexlet.calendarbooking.exception.NotFoundException;
import io.hexlet.calendarbooking.mapper.BookingMapper;
import io.hexlet.calendarbooking.repository.BookingRepository;
import io.hexlet.calendarbooking.repository.EventTypeRepository;

@Service
public class BookingService {
    private static final LocalTime WORK_DAY_START = LocalTime.of(9, 0);
    private static final LocalTime WORK_DAY_END = LocalTime.of(18, 0);
    private static final long BOOKING_WINDOW_DAYS = 14;

    @Autowired
    private Clock clock;

    @Autowired
    private EventTypeRepository eventTypeRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingMapper bookingMapper;

    public BookingDto createBooking(BookingCreateDto dto) {
        var eventTypeId = dto.getEventTypeId();

        var eventType = eventTypeRepository.findById(eventTypeId)
            .orElseThrow(() -> new NotFoundException("Event type not found"));

        var now = Instant.now(clock).truncatedTo(ChronoUnit.MINUTES);
        var windowEnd = now.plus(BOOKING_WINDOW_DAYS, ChronoUnit.DAYS);

        var startTime = dto.getStartTime().truncatedTo(ChronoUnit.MINUTES);
        var endTime = startTime.plus(eventType.getDurationMinutes(), ChronoUnit.MINUTES);

        if (startTime.isBefore(now) || !startTime.isBefore(windowEnd)) {
            throw new BadRequestException("startTime must be within the next " + BOOKING_WINDOW_DAYS + " days");
        }

        if (!isSlotAlignedWithWorkingHours(startTime, endTime, eventType.getDurationMinutes())) {
            throw new BadRequestException("Selected slot is invalid for this event type");
        }

        if (bookingRepository.hasOverlap(startTime, endTime)) {
            throw new ConflictException("Selected slot is already booked");
        }

        var booking = bookingMapper.map(dto);
        booking.setEventTypeId(eventType.getId());
        booking.setStartTime(startTime);
        booking.setEndTime(endTime);
        booking.setCreatedAt(Instant.now(clock));

        return bookingMapper.map(bookingRepository.save(booking));
    }

    public List<BookingDto> listUpcomingBookings() {
        var upcomingBookings = bookingRepository.findUpcoming().stream()
            .map(bookingMapper::map)
            .toList();

        return upcomingBookings;
    }

    private boolean isSlotAlignedWithWorkingHours(Instant startTime, Instant endTime, int durationMinutes) {
        var startUtc = startTime.atZone(ZoneOffset.UTC);
        var endUtc = endTime.atZone(ZoneOffset.UTC);

        if (!startUtc.toLocalDate().equals(endUtc.toLocalDate())) {
            return false;
        }

        var localStart = startUtc.toLocalTime();
        var localEnd = endUtc.toLocalTime();

        if (localStart.isBefore(WORK_DAY_START) || localEnd.isAfter(WORK_DAY_END)) {
            return false;
        }

        var minuteOffset = Duration.between(WORK_DAY_START, localStart).toMinutes();
        return minuteOffset >= 0 && minuteOffset % durationMinutes == 0;
    }
}
