package io.hexlet.calendarbooking.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import io.hexlet.calendarbooking.model.EventType;

public interface EventTypeRepository {
    EventType save(EventType eventType);
    Optional<EventType> findById(UUID id);
    List<EventType> findAll();
}
