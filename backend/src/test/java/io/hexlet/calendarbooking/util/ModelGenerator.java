package io.hexlet.calendarbooking.util;

import java.time.Instant;
import java.util.UUID;

import org.instancio.Instancio;
import org.instancio.Model;
import org.instancio.Select;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import io.hexlet.calendarbooking.model.Booking;
import io.hexlet.calendarbooking.model.EventType;
import io.hexlet.calendarbooking.model.Slot;
import io.hexlet.calendarbooking.model.User;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import net.datafaker.Faker;

@Getter
@Component
public class ModelGenerator {

    private Model<Booking> bookingModel;
    private Model<EventType> eventTypeModel;
    private Model<Slot> slotModel;
    private Model<User> userModel;

    @Autowired(required = false)
    private Faker faker;

    public ModelGenerator() {
        init();
    }

    @PostConstruct
    private void init() {
        if (faker == null) {
            faker = new Faker();
        }

        eventTypeModel = Instancio.of(EventType.class)
            .supply(Select.field(EventType::getId), UUID::randomUUID)
            .supply(Select.field(EventType::getName), () -> faker.lorem().word())
            .supply(Select.field(EventType::getDescription), () -> faker.lorem().sentence())
            .supply(Select.field(EventType::getDurationMinutes), () -> faker.number().numberBetween(5, 481))
            .toModel();

        bookingModel = Instancio.of(Booking.class)
            .supply(Select.field(Booking::getId), UUID::randomUUID)
            .supply(Select.field(Booking::getEventTypeId), () -> Instancio.of(getEventTypeModel()).create().getId())
            .supply(Select.field(Booking::getGuestName), () -> faker.name().firstName())
            .supply(Select.field(Booking::getGuestEmail), () -> faker.internet().emailAddress())
            .supply(Select.field(Booking::getStartTime), () -> Instant.now().plusSeconds(3600))
            .supply(Select.field(Booking::getEndTime), () -> Instant.now().plusSeconds(5400))
            .supply(Select.field(Booking::getCreatedAt), () -> Instant.now())
            .toModel();

        slotModel = Instancio.of(Slot.class)
            .supply(Select.field(Slot::getStartTime), () -> Instant.now().plusSeconds(3600))
            .supply(Select.field(Slot::getEndTime), () -> Instant.now().plusSeconds(5400))
            .supply(Select.field(Slot::isAvailable), () -> true)
            .toModel();

        userModel = Instancio.of(User.class)
            .supply(Select.field(User::getId), () -> UUID.randomUUID().toString())
            .supply(Select.field(User::getName), () -> faker.name().fullName())
            .supply(Select.field(User::getEmail), () -> faker.internet().emailAddress())
            .toModel();
    }

}
