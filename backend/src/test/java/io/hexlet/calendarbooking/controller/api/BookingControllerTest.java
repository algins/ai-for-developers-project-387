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

import io.hexlet.calendarbooking.dto.BookingCreateDto;
import io.hexlet.calendarbooking.dto.BookingDto;
import io.hexlet.calendarbooking.exception.ConflictException;
import io.hexlet.calendarbooking.exception.NotFoundException;
import io.hexlet.calendarbooking.service.BookingService;
import io.hexlet.calendarbooking.util.ModelGenerator;

@WebMvcTest(BookingController.class)
@Import(io.hexlet.calendarbooking.exception.GlobalExceptionHandler.class)
class BookingControllerTest {
    private static final ModelGenerator MODEL_GENERATOR = new ModelGenerator();

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private BookingService bookingService;

    @Test
    void testIndexUpcoming() throws Exception {
        var bookingModel = Instancio.of(MODEL_GENERATOR.getBookingModel()).create();

        var booking = new BookingDto(
            bookingModel.getId(),
            bookingModel.getEventTypeId(),
            bookingModel.getGuestName(),
            bookingModel.getGuestEmail(),
            bookingModel.getStartTime(),
            bookingModel.getEndTime(),
            bookingModel.getCreatedAt()
        );

        when(bookingService.listUpcomingBookings())
            .thenReturn(List.of(booking));

        var request = get("/bookings");

        var result = mockMvc.perform(request)
            .andExpect(status().isOk())
            .andReturn();

        var body = result.getResponse().getContentAsString();

        assertThatJson(body).and(v -> {
            v.node("[0].id").isEqualTo(booking.getId().toString());
            v.node("[0].guestEmail").isEqualTo(booking.getGuestEmail());
        });
    }

    @Test
    void testCreate() throws Exception {
        var bookingModel = Instancio.of(MODEL_GENERATOR.getBookingModel()).create();

        var data = new BookingCreateDto(
            bookingModel.getEventTypeId(),
            bookingModel.getGuestName(),
            bookingModel.getGuestEmail(),
            bookingModel.getStartTime()
        );
        var createdBooking = new BookingDto(
            bookingModel.getId(),
            bookingModel.getEventTypeId(),
            bookingModel.getGuestName(),
            bookingModel.getGuestEmail(),
            bookingModel.getStartTime(),
            bookingModel.getEndTime(),
            bookingModel.getCreatedAt()
        );

        when(bookingService.createBooking(any(BookingCreateDto.class)))
            .thenReturn(createdBooking);

        var request = post("/bookings")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(data));

        var result = mockMvc.perform(request)
            .andExpect(status().isCreated())
            .andReturn();

        var body = result.getResponse().getContentAsString();

        assertThatJson(body).and(v -> {
            v.node("id").isEqualTo(createdBooking.getId().toString());
            v.node("guestEmail").isEqualTo(createdBooking.getGuestEmail());
        });
    }

    @Test
    void testCreateWithInvalidData() throws Exception {
        var data = Map.of(
            "eventTypeId", "5e2cb43b-a9e0-4dda-a09f-040f11366549",
            "guestName", "Alice",
            "guestEmail", "not-an-email",
            "startTime", "2026-05-27T09:00:00Z"
        );

        var request = post("/bookings")
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
        var bookingModel = Instancio.of(MODEL_GENERATOR.getBookingModel()).create();

        var data = new BookingCreateDto(
            bookingModel.getEventTypeId(),
            bookingModel.getGuestName(),
            bookingModel.getGuestEmail(),
            bookingModel.getStartTime()
        );

        when(bookingService.createBooking(any(BookingCreateDto.class)))
            .thenThrow(new NotFoundException("Event type not found"));

        var request = post("/bookings")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(data));

        var result = mockMvc.perform(request)
            .andExpect(status().isNotFound())
            .andReturn();

        var body = result.getResponse().getContentAsString();

        assertThatJson(body).node("code").isEqualTo("NOT_FOUND");
    }

    @Test
    void testCreateConflict() throws Exception {
        var bookingModel = Instancio.of(MODEL_GENERATOR.getBookingModel()).create();

        var data = new BookingCreateDto(
            bookingModel.getEventTypeId(),
            bookingModel.getGuestName(),
            bookingModel.getGuestEmail(),
            bookingModel.getStartTime()
        );

        when(bookingService.createBooking(any(BookingCreateDto.class)))
            .thenThrow(new ConflictException("Selected slot is already booked"));

        var request = post("/bookings")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(data));

        var result = mockMvc.perform(request)
            .andExpect(status().isConflict())
            .andReturn();

        var body = result.getResponse().getContentAsString();

        assertThatJson(body).node("code").isEqualTo("CONFLICT");
    }
}
