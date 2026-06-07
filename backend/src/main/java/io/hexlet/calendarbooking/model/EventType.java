package io.hexlet.calendarbooking.model;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventType {
    private UUID id = UUID.randomUUID();
    private String name;
    private String description;
    private int durationMinutes;
}
