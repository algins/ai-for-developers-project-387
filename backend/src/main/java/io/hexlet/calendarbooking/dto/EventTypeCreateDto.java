package io.hexlet.calendarbooking.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
public class EventTypeCreateDto {

    @NotBlank
    @Size(min = 1, max = 100)
    private String name;

    @NotNull
    @Size(max = 1000)
    private String description;

    @NotNull
    @Min(5)
    @Max(480)
    private Integer durationMinutes;
}
