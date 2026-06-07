package io.hexlet.calendarbooking.service;

import java.time.Clock;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.hexlet.calendarbooking.dto.SlotDto;
import io.hexlet.calendarbooking.mapper.SlotMapper;
import io.hexlet.calendarbooking.repository.BookingRepository;
import io.hexlet.calendarbooking.repository.SlotRepository;

@Service
public class SlotService {
    private static final long BOOKING_WINDOW_DAYS = 14;

    @Autowired
    private Clock clock;

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SlotMapper slotMapper;

    public List<SlotDto> listAvailableSlots(int slotDurationMinutes) {
        var now = Instant.now(clock).truncatedTo(ChronoUnit.MINUTES);
        var windowEnd = now.plus(BOOKING_WINDOW_DAYS, ChronoUnit.DAYS);

        var availableSlots = slotRepository.findAvailable(now, windowEnd, slotDurationMinutes).stream()
            .filter(slot -> !bookingRepository.hasOverlap(slot.getStartTime(), slot.getEndTime()))
            .map(slotMapper::map)
            .toList();

        return availableSlots;
    }
}
