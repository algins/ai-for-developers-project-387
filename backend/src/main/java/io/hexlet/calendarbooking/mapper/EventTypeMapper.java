package io.hexlet.calendarbooking.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import io.hexlet.calendarbooking.dto.EventTypeCreateDto;
import io.hexlet.calendarbooking.dto.EventTypeDto;
import io.hexlet.calendarbooking.model.EventType;

@Mapper(
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    componentModel = MappingConstants.ComponentModel.SPRING,
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public abstract class EventTypeMapper {
    public abstract EventType map(EventTypeCreateDto dto);
    public abstract EventTypeDto map(EventType model);
}
