package io.hexlet.calendarbooking.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import io.hexlet.calendarbooking.dto.SlotDto;
import io.hexlet.calendarbooking.service.SlotService;

@RestController
@RequestMapping
public class SlotController {

    @Autowired
    private SlotService slotService;

    @GetMapping("/slots")
    @ResponseStatus(HttpStatus.OK)
    public List<SlotDto> index(@RequestParam(defaultValue = "30") int durationMinutes) {
        return slotService.listAvailableSlots(durationMinutes);
    }
}
