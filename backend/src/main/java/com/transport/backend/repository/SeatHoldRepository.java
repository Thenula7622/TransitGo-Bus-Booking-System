package com.transport.backend.repository;

import com.transport.backend.model.SeatHold;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatHoldRepository extends JpaRepository<SeatHold, Long> {

    List<SeatHold> findByBusId(Long busId);

    Optional<SeatHold> findByBusIdAndSeatNumber(Long busId, String seatNumber);

    @Transactional
    @Modifying
    @Query("DELETE FROM SeatHold s WHERE s.expiryTimestamp < :now")
    void deleteByExpiryTimestampLessThan(@Param("now") Long now);

    @Transactional
    @Modifying
    @Query("DELETE FROM SeatHold s WHERE s.busId = :busId AND s.seatNumber = :seatNumber")
    void deleteByBusIdAndSeatNumber(@Param("busId") Long busId, @Param("seatNumber") String seatNumber);

    @Transactional
    @Modifying
    @Query("DELETE FROM SeatHold s WHERE s.busId = :busId AND s.seatNumber IN :seats")
    void deleteByBusIdAndSeatNumberIn(@Param("busId") Long busId, @Param("seats") List<String> seats);

    default void upsertHold(Long busId, String seatNumber, Long expiry) {
        Optional<SeatHold> existing = findByBusIdAndSeatNumber(busId, seatNumber);
        SeatHold hold = existing.orElseGet(SeatHold::new);
        hold.setBusId(busId);
        hold.setSeatNumber(seatNumber);
        hold.setExpiryTimestamp(expiry);
        save(hold);
    }
}