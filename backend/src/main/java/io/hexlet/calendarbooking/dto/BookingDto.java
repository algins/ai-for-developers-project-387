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
public class BookingDto {
    private UUID id;
    private UUID eventTypeId;
    private String guestName;
    private String guestEmail;
    private Instant startTime;
    private Instant endTime;
    private Instant createdAt;
}
