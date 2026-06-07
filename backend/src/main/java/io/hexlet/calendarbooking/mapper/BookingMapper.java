package io.hexlet.calendarbooking.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import io.hexlet.calendarbooking.dto.BookingCreateDto;
import io.hexlet.calendarbooking.dto.BookingDto;
import io.hexlet.calendarbooking.model.Booking;

@Mapper(
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    componentModel = MappingConstants.ComponentModel.SPRING,
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public abstract class BookingMapper {
    public abstract Booking map(BookingCreateDto dto);
    public abstract BookingDto map(Booking model);
}
