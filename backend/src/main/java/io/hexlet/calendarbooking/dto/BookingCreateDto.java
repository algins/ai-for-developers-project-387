package io.hexlet.calendarbooking.dto;

import java.time.Instant;
import java.util.UUID;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingCreateDto {

    @NotNull
    private UUID eventTypeId;

    @NotBlank
    @Size(min = 1, max = 255)
    private String guestName;

    @NotBlank
    @Email
    private String guestEmail;

    @NotNull
    private Instant startTime;
}
