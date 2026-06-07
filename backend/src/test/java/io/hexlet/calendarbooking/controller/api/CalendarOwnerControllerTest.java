package io.hexlet.calendarbooking.controller.api;

import static net.javacrumbs.jsonunit.assertj.JsonAssertions.assertThatJson;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.instancio.Instancio;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import io.hexlet.calendarbooking.dto.UserDto;
import io.hexlet.calendarbooking.exception.BadRequestException;
import io.hexlet.calendarbooking.exception.ConflictException;
import io.hexlet.calendarbooking.exception.NotFoundException;
import io.hexlet.calendarbooking.service.UserService;
import io.hexlet.calendarbooking.util.ModelGenerator;

@WebMvcTest(CalendarOwnerController.class)
@Import(io.hexlet.calendarbooking.exception.GlobalExceptionHandler.class)
class CalendarOwnerControllerTest {
    private static final ModelGenerator MODEL_GENERATOR = new ModelGenerator();

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void testShow() throws Exception {
        var ownerModel = Instancio.of(MODEL_GENERATOR.getUserModel()).create();

        var owner = new UserDto(
            ownerModel.getId(),
            ownerModel.getName(),
            ownerModel.getEmail()
        );

        when(userService.getCalendarOwner())
            .thenReturn(owner);

        var request = get("/calendar-owner");

        var result = mockMvc.perform(request)
            .andExpect(status().isOk())
            .andReturn();

        var body = result.getResponse().getContentAsString();

        assertThatJson(body).and(v -> {
            v.node("id").isEqualTo(owner.getId());
            v.node("name").isEqualTo(owner.getName());
            v.node("email").isEqualTo(owner.getEmail());
        });
    }

    @Test
    void testShowWithBadRequest() throws Exception {
        when(userService.getCalendarOwner())
            .thenThrow(new BadRequestException("Bad owner profile request"));

        var request = get("/calendar-owner");

        var result = mockMvc.perform(request)
            .andExpect(status().isBadRequest())
            .andReturn();

        var body = result.getResponse().getContentAsString();

        assertThatJson(body).node("code").isEqualTo("BAD_REQUEST");
    }

    @Test
    void testShowWithNotFound() throws Exception {
        when(userService.getCalendarOwner())
            .thenThrow(new NotFoundException("Owner profile not found"));

        var request = get("/calendar-owner");

        var result = mockMvc.perform(request)
            .andExpect(status().isNotFound())
            .andReturn();

        var body = result.getResponse().getContentAsString();

        assertThatJson(body).node("code").isEqualTo("NOT_FOUND");
    }

    @Test
    void testShowWithConflict() throws Exception {
        when(userService.getCalendarOwner())
            .thenThrow(new ConflictException("Owner profile state conflict"));

        var request = get("/calendar-owner");

        var result = mockMvc.perform(request)
            .andExpect(status().isConflict())
            .andReturn();

        var body = result.getResponse().getContentAsString();

        assertThatJson(body).node("code").isEqualTo("CONFLICT");
    }
}
