package com.transport.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "seat_holds", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"bus_id", "seat_number"})
})
public class SeatHold {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bus_id", nullable = false)
    private Long busId;

    @Column(name = "seat_number", nullable = false)
    private String seatNumber;

    @Column(name = "expiry_timestamp", nullable = false)
    private Long expiryTimestamp;

    public SeatHold() {}

    public SeatHold(Long busId, String seatNumber, Long expiryTimestamp) {
        this.busId = busId;
        this.seatNumber = seatNumber;
        this.expiryTimestamp = expiryTimestamp;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getBusId() { return busId; }
    public void setBusId(Long busId) { this.busId = busId; }

    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }

    public Long getExpiryTimestamp() { return expiryTimestamp; }
    public void setExpiryTimestamp(Long expiryTimestamp) { this.expiryTimestamp = expiryTimestamp; }
}