package io.hexlet.calendarbooking.controller.api;

import static net.javacrumbs.jsonunit.assertj.JsonAssertions.assertThatJson;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.instancio.Instancio;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import io.hexlet.calendarbooking.dto.SlotDto;
import io.hexlet.calendarbooking.exception.BadRequestException;
import io.hexlet.calendarbooking.exception.ConflictException;
import io.hexlet.calendarbooking.exception.NotFoundException;
import io.hexlet.calendarbooking.service.SlotService;
import io.hexlet.calendarbooking.util.ModelGenerator;

@WebMvcTest(SlotController.class)
@Import(io.hexlet.calendarbooking.exception.GlobalExceptionHandler.class)
class SlotControllerTest {
    private static final ModelGenerator MODEL_GENERATOR = new ModelGenerator();

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SlotService slotService;

    @Test
    void testIndex() throws Exception {
        var slotModel = Instancio.of(MODEL_GENERATOR.getSlotModel()).create();

        var slot = new SlotDto(
            slotModel.getStartTime(),
            slotModel.getEndTime(),
            slotModel.isAvailable()
        );

        when(slotService.listAvailableSlots(30))
            .thenReturn(List.of(slot));

        var request = get("/slots");

        var result = mockMvc.perform(request)
            .andExpect(status().isOk())
            .andReturn();

        var body = result.getResponse().getContentAsString();

        assertThatJson(body).and(v -> {
            v.node("[0].isAvailable").isEqualTo(true);
            v.node("[0].startTime").isEqualTo(slot.getStartTime().toString());
        });
    }

    @Test
    void testIndexWithBadRequest() throws Exception {
        when(slotService.listAvailableSlots(30))
            .thenThrow(new BadRequestException("Invalid time range"));

        var request = get("/slots");

        var result = mockMvc.perform(request)
            .andExpect(status().isBadRequest())
            .andReturn();

        var body = result.getResponse().getContentAsString();

        assertThatJson(body).node("code").isEqualTo("BAD_REQUEST");
    }

    @Test
    void testIndexWithNotFound() throws Exception {
        when(slotService.listAvailableSlots(30))
            .thenThrow(new NotFoundException("Owner not found"));

        var request = get("/slots");

        var result = mockMvc.perform(request)
            .andExpect(status().isNotFound())
            .andReturn();

        var body = result.getResponse().getContentAsString();

        assertThatJson(body).node("code").isEqualTo("NOT_FOUND");
    }

    @Test
    void testIndexWithConflict() throws Exception {
        when(slotService.listAvailableSlots(30))
            .thenThrow(new ConflictException("Slots generation conflict"));

        var request = get("/slots");

        var result = mockMvc.perform(request)
            .andExpect(status().isConflict())
            .andReturn();

        var body = result.getResponse().getContentAsString();

        assertThatJson(body).node("code").isEqualTo("CONFLICT");
    }
}
