package io.hexlet.calendarbooking.model;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Slot {
    private Instant startTime;
    private Instant endTime;
    private boolean isAvailable;
}
