package io.hexlet.calendarbooking.repository;

import java.util.Optional;

import io.hexlet.calendarbooking.model.User;

public interface UserRepository {
    Optional<User> findCalendarOwner();
}
