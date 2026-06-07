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

import io.hexlet.calendarbooking.dto.BookingCreateDto;
import io.hexlet.calendarbooking.dto.BookingDto;
import io.hexlet.calendarbooking.service.BookingService;
import jakarta.validation.Valid;

@RestController
@RequestMapping
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping("/bookings")
    @ResponseStatus(HttpStatus.OK)
    public List<BookingDto> index() {
        return bookingService.listUpcomingBookings();
    }

    @PostMapping("/bookings")
    @ResponseStatus(HttpStatus.CREATED)
    public BookingDto create(@Valid @RequestBody BookingCreateDto dto) {
        return bookingService.createBooking(dto);
    }
}
