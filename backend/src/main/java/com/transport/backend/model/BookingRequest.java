package com.transport.backend.model;

import java.util.List;

public class BookingRequest {

    private Long busId;
    private String passengerName;
    private String email;
    private String phone;
    private String nic;
    private String boardingPoint;
    private String droppingPoint;
    private Integer extraBaggageCount;
    private List<String> selectedSeats;
    private String promoCode;

    public BookingRequest() {}

    public Long getBusId() { return busId; }
    public void setBusId(Long busId) { this.busId = busId; }

    public String getPassengerName() { return passengerName; }
    public void setPassengerName(String passengerName) { this.passengerName = passengerName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getNic() { return nic; }
    public void setNic(String nic) { this.nic = nic; }

    public String getBoardingPoint() { return boardingPoint; }
    public void setBoardingPoint(String boardingPoint) { this.boardingPoint = boardingPoint; }

    public String getDroppingPoint() { return droppingPoint; }
    public void setDroppingPoint(String droppingPoint) { this.droppingPoint = droppingPoint; }

    public Integer getExtraBaggageCount() { return extraBaggageCount; }
    public void setExtraBaggageCount(Integer extraBaggageCount) { this.extraBaggageCount = extraBaggageCount; }

    public List<String> getSelectedSeats() { return selectedSeats; }
    public void setSelectedSeats(List<String> selectedSeats) { this.selectedSeats = selectedSeats; }

    public String getPromoCode() { return promoCode; }
    public void setPromoCode(String promoCode) { this.promoCode = promoCode; }
}