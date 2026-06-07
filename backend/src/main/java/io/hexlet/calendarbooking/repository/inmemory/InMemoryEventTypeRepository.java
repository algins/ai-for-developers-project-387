package io.hexlet.calendarbooking.repository.inmemory;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Repository;

import io.hexlet.calendarbooking.model.EventType;
import io.hexlet.calendarbooking.repository.EventTypeRepository;

@Repository
public class InMemoryEventTypeRepository implements EventTypeRepository {
    private final Map<UUID, EventType> eventTypes = new ConcurrentHashMap<>();

    @Override
    public EventType save(EventType eventType) {
        eventTypes.put(eventType.getId(), eventType);
        return eventType;
    }

    @Override
    public Optional<EventType> findById(UUID id) {
        return Optional.ofNullable(eventTypes.get(id));
    }

    @Override
    public List<EventType> findAll() {
        return new ArrayList<>(eventTypes.values());
    }
}
