package io.hexlet.calendarbooking.dto;

import java.time.Instant;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventTypeDto {
    private UUID id;
    private String name;
    private String description;
    private Integer durationMinutes;
    private Integer bookingCount;
    private Instant nextAvailableSlot;
}
