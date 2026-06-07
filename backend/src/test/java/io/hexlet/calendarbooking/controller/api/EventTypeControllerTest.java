package io.hexlet.calendarbooking.controller.api;

import static net.javacrumbs.jsonunit.assertj.JsonAssertions.assertThatJson;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Map;

import org.instancio.Instancio;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.hexlet.calendarbooking.dto.EventTypeCreateDto;
import io.hexlet.calendarbooking.dto.EventTypeDto;
import io.hexlet.calendarbooking.exception.ConflictException;
import io.hexlet.calendarbooking.exception.NotFoundException;
import io.hexlet.calendarbooking.service.EventTypeService;
import io.hexlet.calendarbooking.util.ModelGenerator;

@WebMvcTest(EventTypeController.class)
@Import(io.hexlet.calendarbooking.exception.GlobalExceptionHandler.class)
class EventTypeControllerTest {
    private static final ModelGenerator MODEL_GENERATOR = new ModelGenerator();

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EventTypeService eventTypeService;

    @Test
    void testIndex() throws Exception {
        var eventTypeModel = Instancio.of(MODEL_GENERATOR.getEventTypeModel()).create();

        var eventType = new EventTypeDto(
            eventTypeModel.getId(),
            eventTypeModel.getName(),
            eventTypeModel.getDescription(),
            eventTypeModel.getDurationMinutes(),
            0,
            null
        );

        when(eventTypeService.listEventTypes())
            .thenReturn(List.of(eventType));

        var request = get("/event-types");

        var result = mockMvc.perform(request)
            .andExpect(status().isOk())
            .andReturn();

        var body = result.getResponse().getContentAsString();

        assertThatJson(body).and(v -> {
            v.node("[0].id").isEqualTo(eventType.getId().toString());
            v.node("[0].name").isEqualTo(eventType.getName());
            v.node("[0].durationMinutes").isEqualTo(eventType.getDurationMinutes());
        });
    }

    @Test
    void testCreate() throws Exception {
        var eventTypeModel = Instancio.of(MODEL_GENERATOR.getEventTypeModel()).create();

        var data = new EventTypeCreateDto(
            eventTypeModel.getName(),
            eventTypeModel.getDescription(),
            eventTypeModel.getDurationMinutes()
        );

        var createdEventType = new EventTypeDto(
            eventTypeModel.getId(),
            eventTypeModel.getName(),
            eventTypeModel.getDescription(),
            eventTypeModel.getDurationMinutes(),
            0,
            null
        );

        when(eventTypeService.createEventType(any(EventTypeCreateDto.class)))
            .thenReturn(createdEventType);

        var request = post("/event-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(data));

        var result = mockMvc.perform(request)
            .andExpect(status().isCreated())
            .andReturn();

        var body = result.getResponse().getContentAsString();

        assertThatJson(body).and(v -> {
            v.node("id").isEqualTo(createdEventType.getId().toString());
            v.node("name").isEqualTo(createdEventType.getName());
        });
    }

    @Test
    void testCreateWithInvalidData() throws Exception {
        var data = Map.of(
            "name", "",
            "description", "A short introduction call",
            "durationMinutes", 30
        );

        var request = post("/event-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(data));

        var result = mockMvc.perform(request)
            .andExpect(status().isBadRequest())
            .andReturn();

        var body = result.getResponse().getContentAsString();

        assertThatJson(body).node("code").isEqualTo("BAD_REQUEST");
    }

    @Test
    void testCreateWithNotFound() throws Exception {
        var eventTypeModel = Instancio.of(MODEL_GENERATOR.getEventTypeModel()).create();

        var data = new EventTypeCreateDto(
            eventTypeModel.getName(),
            eventTypeModel.getDescription(),
            eventTypeModel.getDurationMinutes()
        );

        when(eventTypeService.createEventType(any(EventTypeCreateDto.class)))
            .thenThrow(new NotFoundException("Owner profile not found"));

        var request = post("/event-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(data));

        var result = mockMvc.perform(request)
            .andExpect(status().isNotFound())
            .andReturn();

        var body = result.getResponse().getContentAsString();

        assertThatJson(body).node("code").isEqualTo("NOT_FOUND");
    }

    @Test
    void testCreateWithConflict() throws Exception {
        var eventTypeModel = Instancio.of(MODEL_GENERATOR.getEventTypeModel()).create();

        var data = new EventTypeCreateDto(
            eventTypeModel.getName(),
            eventTypeModel.getDescription(),
            eventTypeModel.getDurationMinutes()
        );

        when(eventTypeService.createEventType(any(EventTypeCreateDto.class)))
            .thenThrow(new ConflictException("Event type already exists"));

        var request = post("/event-types")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(data));

        var result = mockMvc.perform(request)
            .andExpect(status().isConflict())
            .andReturn();

        var body = result.getResponse().getContentAsString();

        assertThatJson(body).node("code").isEqualTo("CONFLICT");
    }
}
