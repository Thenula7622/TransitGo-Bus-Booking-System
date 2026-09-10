package com.transport.backend.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "buses")
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String busName;
    private String busNumber;
    private String busType;
    private String source;
    private String destination;
    private String departureTime;
    private String arrivalTime;
    private String duration;
    private Double price;
    private Integer totalSeats;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "bus_booked_seats", joinColumns = @JoinColumn(name = "bus_id"))
    @Column(name = "seat_number")
    private List<String> bookedSeats = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "bus_boarding_points", joinColumns = @JoinColumn(name = "bus_id"))
    @Column(name = "point_name")
    private List<String> boardingPoints = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "bus_route_halts", joinColumns = @JoinColumn(name = "bus_id"))
    private List<RouteHalt> routeHalts = new ArrayList<>();

    @Transient
    private Map<String, Long> heldSeats = new HashMap<>();

    private Double currentLatitude;
    private Double currentLongitude;
    private String currentStatusText;

    private Double averageRating = 4.8;
    private Integer totalReviews = 12;

    public Bus() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBusName() { return busName; }
    public void setBusName(String busName) { this.busName = busName; }

    public String getBusNumber() { return busNumber; }
    public void setBusNumber(String busNumber) { this.busNumber = busNumber; }

    public String getBusType() { return busType; }
    public void setBusType(String busType) { this.busType = busType; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }

    public String getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getTotalSeats() { return totalSeats; }
    public void setTotalSeats(Integer totalSeats) { this.totalSeats = totalSeats; }

    public List<String> getBookedSeats() { return bookedSeats; }
    public void setBookedSeats(List<String> bookedSeats) { this.bookedSeats = bookedSeats; }

    public List<String> getBoardingPoints() { return boardingPoints; }
    public void setBoardingPoints(List<String> boardingPoints) { this.boardingPoints = boardingPoints; }

    public List<RouteHalt> getRouteHalts() { return routeHalts; }
    public void setRouteHalts(List<RouteHalt> routeHalts) { this.routeHalts = routeHalts; }

    public Map<String, Long> getHeldSeats() { return heldSeats; }
    public void setHeldSeats(Map<String, Long> heldSeats) { this.heldSeats = heldSeats; }

    public Double getCurrentLatitude() { return currentLatitude; }
    public void setCurrentLatitude(Double currentLatitude) { this.currentLatitude = currentLatitude; }

    public Double getCurrentLongitude() { return currentLongitude; }
    public void setCurrentLongitude(Double currentLongitude) { this.currentLongitude = currentLongitude; }

    public String getCurrentStatusText() { return currentStatusText; }
    public void setCurrentStatusText(String currentStatusText) { this.currentStatusText = currentStatusText; }

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

    public Integer getTotalReviews() { return totalReviews; }
    public void setTotalReviews(Integer totalReviews) { this.totalReviews = totalReviews; }
}