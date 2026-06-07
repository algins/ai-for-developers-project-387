package io.hexlet.calendarbooking.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import io.hexlet.calendarbooking.dto.EventTypeCreateDto;
import io.hexlet.calendarbooking.dto.EventTypeDto;
import io.hexlet.calendarbooking.service.EventTypeService;
import jakarta.validation.Valid;

@RestController
@RequestMapping
public class EventTypeController {

    @Autowired
    private EventTypeService eventTypeService;

    @GetMapping("/event-types")
    @ResponseStatus(HttpStatus.OK)
    public List<EventTypeDto> index() {
        return eventTypeService.listEventTypes();
    }

    @PostMapping("/event-types")
    @ResponseStatus(HttpStatus.CREATED)
    public EventTypeDto create(@Valid @RequestBody EventTypeCreateDto dto) {
        return eventTypeService.createEventType(dto);
    }
}
