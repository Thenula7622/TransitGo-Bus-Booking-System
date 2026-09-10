package com.transport.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String bookingReference;

    private String passengerName;
    private String email;
    private String phone;
    private String nic;
    private String boardingPoint;
    private String droppingPoint;

    private Integer extraBaggageCount = 0;
    private Double baggageFee = 0.0;

    @ManyToOne
    @JoinColumn(name = "bus_id")
    private Bus bus;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "booking_selected_seats", joinColumns = @JoinColumn(name = "booking_id"))
    @Column(name = "seat_number")
    private List<String> selectedSeats;

    private Double originalAmount;
    private Double discountAmount = 0.0;
    private Double totalAmount;
    private Double refundAmount = 0.0;

    private LocalDateTime bookingTime;
    private LocalDateTime cancellationTime;

    private String status = "CONFIRMED"; // CONFIRMED, BOARDED, CANCELLED

    public Booking() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }

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

    public Double getBaggageFee() { return baggageFee; }
    public void setBaggageFee(Double baggageFee) { this.baggageFee = baggageFee; }

    public Bus getBus() { return bus; }
    public void setBus(Bus bus) { this.bus = bus; }

    public List<String> getSelectedSeats() { return selectedSeats; }
    public void setSelectedSeats(List<String> selectedSeats) { this.selectedSeats = selectedSeats; }

    public Double getOriginalAmount() { return originalAmount; }
    public void setOriginalAmount(Double originalAmount) { this.originalAmount = originalAmount; }

    public Double getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(Double discountAmount) { this.discountAmount = discountAmount; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public Double getRefundAmount() { return refundAmount; }
    public void setRefundAmount(Double refundAmount) { this.refundAmount = refundAmount; }

    public LocalDateTime getBookingTime() { return bookingTime; }
    public void setBookingTime(LocalDateTime bookingTime) { this.bookingTime = bookingTime; }

    public LocalDateTime getCancellationTime() { return cancellationTime; }
    public void setCancellationTime(LocalDateTime cancellationTime) { this.cancellationTime = cancellationTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}