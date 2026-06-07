package io.hexlet.calendarbooking.dto;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SlotDto {
    private Instant startTime;
    private Instant endTime;

    @JsonProperty("isAvailable")
    private boolean isAvailable;
}
