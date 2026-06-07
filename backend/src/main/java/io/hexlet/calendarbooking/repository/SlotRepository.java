package io.hexlet.calendarbooking.repository;

import java.time.Instant;
import java.util.List;

import io.hexlet.calendarbooking.model.Slot;

public interface SlotRepository {
    List<Slot> findAvailable(Instant fromInclusive, Instant toExclusive, int slotDurationMinutes);
}
