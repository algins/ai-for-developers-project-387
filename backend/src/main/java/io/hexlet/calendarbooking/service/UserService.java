package io.hexlet.calendarbooking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.hexlet.calendarbooking.dto.UserDto;
import io.hexlet.calendarbooking.mapper.UserMapper;
import io.hexlet.calendarbooking.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    public UserDto getCalendarOwner() {
        var calendarOwner = userRepository.findCalendarOwner()
            .orElseThrow(() -> new IllegalStateException("Calendar owner profile is not configured"));

        return userMapper.map(calendarOwner);
    }
}
