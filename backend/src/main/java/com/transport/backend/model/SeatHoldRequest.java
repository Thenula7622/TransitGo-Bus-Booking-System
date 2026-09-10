package com.transport.backend.model;

import java.util.List;

public class SeatHoldRequest {
    private Long busId;
    private List<String> seats;
    private String sessionId;

    public SeatHoldRequest() {}

    public Long getBusId() { return busId; }
    public void setBusId(Long busId) { this.busId = busId; }

    public List<String> getSeats() { return seats; }
    public void setSeats(List<String> seats) { this.seats = seats; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
}