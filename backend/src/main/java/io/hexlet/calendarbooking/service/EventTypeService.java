package io.hexlet.calendarbooking.service;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.hexlet.calendarbooking.dto.EventTypeCreateDto;
import io.hexlet.calendarbooking.dto.EventTypeDto;
import io.hexlet.calendarbooking.mapper.EventTypeMapper;
import io.hexlet.calendarbooking.model.EventType;
import io.hexlet.calendarbooking.repository.BookingRepository;
import io.hexlet.calendarbooking.repository.EventTypeRepository;

@Service
public class EventTypeService {

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
    private EventTypeMapper eventTypeMapper;

    public EventTypeDto createEventType(EventTypeCreateDto dto) {
        var eventType = eventTypeMapper.map(dto);
        return eventTypeMapper.map(eventTypeRepository.save(eventType));
    }

    public List<EventTypeDto> listEventTypes() {
        var eventTypes = eventTypeRepository.findAll().stream()
            .sorted(Comparator.comparing(EventType::getName, String.CASE_INSENSITIVE_ORDER))
            .map(eventTypeMapper::map)
            .toList();

        for (var dto : eventTypes) {
            var count = (int) bookingRepository.countByEventTypeId(dto.getId());
            dto.setBookingCount(count);
            dto.setNextAvailableSlot(findNextAvailableSlot(dto.getDurationMinutes()));
        }

        return eventTypes;
    }

    private Instant findNextAvailableSlot(int durationMinutes) {
        var now = Instant.now(clock).truncatedTo(ChronoUnit.MINUTES);
        var windowEnd = now.plus(BOOKING_WINDOW_DAYS, ChronoUnit.DAYS);

        var firstDay = now.atZone(ZoneOffset.UTC).toLocalDate();
        var lastDay = windowEnd.atZone(ZoneOffset.UTC).toLocalDate();

        for (var day = firstDay; !day.isAfter(lastDay); day = day.plusDays(1)) {
            var workdayStart = day.atTime(WORK_DAY_START).toInstant(ZoneOffset.UTC);
            var workdayEnd = day.atTime(WORK_DAY_END).toInstant(ZoneOffset.UTC);

            for (
                var slotStart = workdayStart;
                !slotStart.plus(durationMinutes, ChronoUnit.MINUTES).isAfter(workdayEnd);
                slotStart = slotStart.plus(durationMinutes, ChronoUnit.MINUTES)
            ) {
                if (slotStart.isBefore(now) || !slotStart.isBefore(windowEnd)) {
                    continue;
                }

                var slotEnd = slotStart.plus(durationMinutes, ChronoUnit.MINUTES);

                if (!bookingRepository.hasOverlap(slotStart, slotEnd)) {
                    return slotStart;
                }
            }
        }

        return null;
    }
}
