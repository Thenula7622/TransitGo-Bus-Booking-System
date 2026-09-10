package com.transport.backend.repository;

import com.transport.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByBookingReference(String bookingReference);
    List<Booking> findByNicIgnoreCaseOrderByBookingTimeDesc(String nic);
    List<Booking> findByPhoneOrderByBookingTimeDesc(String phone);
}