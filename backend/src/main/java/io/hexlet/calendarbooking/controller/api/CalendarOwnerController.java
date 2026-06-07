package io.hexlet.calendarbooking.controller.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import io.hexlet.calendarbooking.dto.UserDto;
import io.hexlet.calendarbooking.service.UserService;

@RestController
@RequestMapping
public class CalendarOwnerController {

    @Autowired
    private UserService userService;

    @GetMapping("/calendar-owner")
    @ResponseStatus(HttpStatus.OK)
    public UserDto show() {
        return userService.getCalendarOwner();
    }
}
