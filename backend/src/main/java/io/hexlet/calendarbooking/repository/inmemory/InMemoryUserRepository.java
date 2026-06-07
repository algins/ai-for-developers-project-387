package io.hexlet.calendarbooking.repository.inmemory;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import io.hexlet.calendarbooking.model.User;
import io.hexlet.calendarbooking.repository.UserRepository;

@Repository
public class InMemoryUserRepository implements UserRepository {
    private final User calendarOwner = new User(
        "2a5ef4ce-becf-4e27-b212-833b77f6116d",
        "John Doe",
        "john.doe@example.com"
    );

    @Override
    public Optional<User> findCalendarOwner() {
        return Optional.of(calendarOwner);
    }
}
