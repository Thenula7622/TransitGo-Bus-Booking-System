package com.transport.backend.controller;

import com.transport.backend.model.*;
import com.transport.backend.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {
    RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS
})
public class BusController {

    private final BookingService bookingService;

    public BusController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // --- BUS & ROUTE ENDPOINTS ---
    @GetMapping("/api/buses")
    public List<Bus> getAllBuses() {
        return bookingService.getAllBuses();
    }

    @GetMapping("/api/buses/search")
    public List<Bus> searchBuses(@RequestParam(required = false, defaultValue = "") String source, 
                                 @RequestParam(required = false, defaultValue = "") String destination) {
        return bookingService.searchBuses(source, destination);
    }

    @GetMapping("/api/buses/towns")
    public List<String> getAllNetworkTowns() {
        return bookingService.getAllNetworkTowns();
    }

    @PostMapping("/api/buses")
    public Bus addBus(@RequestBody Bus bus) {
        return bookingService.addBus(bus);
    }

    @PutMapping("/api/buses/{id}")
    public Bus updateBus(@PathVariable Long id, @RequestBody Bus bus) {
        return bookingService.updateBus(id, bus);
    }

    @DeleteMapping("/api/buses/{id}")
    public ResponseEntity<Void> deleteBus(@PathVariable Long id) {
        bookingService.deleteBus(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/api/buses/hold-seats")
    public ResponseEntity<?> holdSeats(@RequestBody SeatHoldRequest request) {
        try {
            bookingService.holdSeats(request);
            return ResponseEntity.ok(Map.of("message", "Seats reserved for 10 minutes"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/api/buses/release-seats")
    public ResponseEntity<?> releaseSeats(@RequestBody SeatHoldRequest request) {
        try {
            bookingService.releaseHeldSeats(request);
            return ResponseEntity.ok(Map.of("message", "Seats released successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/api/buses/{busId}/reviews")
    public List<Review> getBusReviews(@PathVariable Long busId) {
        return bookingService.getReviewsForBus(busId);
    }

    @PostMapping("/api/buses/reviews")
    public Review addReview(@RequestBody Review review) {
        return bookingService.addReview(review);
    }

    @PutMapping("/api/buses/{id}/location")
    public Bus updateLocation(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Double lat = Double.parseDouble(payload.get("latitude").toString());
        Double lng = Double.parseDouble(payload.get("longitude").toString());
        String status = payload.get("status") != null ? payload.get("status").toString() : null;
        return bookingService.updateBusLocation(id, lat, lng, status);
    }

    // --- BOOKING ENDPOINTS ---
    @PostMapping("/api/bookings")
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        try {
            Booking booking = bookingService.createBooking(request);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/api/bookings/all")
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/api/bookings/{reference}")
    public ResponseEntity<?> getBookingByReference(@PathVariable String reference) {
        return bookingService.getBookingByReference(reference)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/api/bookings/search")
    public List<Booking> searchBookings(@RequestParam String query) {
        return bookingService.getBookingsByNicOrPhone(query);
    }

    @PutMapping("/api/bookings/{reference}/checkin")
    public ResponseEntity<?> checkInTicket(@PathVariable String reference) {
        try {
            Booking booking = bookingService.checkInPassenger(reference);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/api/bookings/{reference}/cancel")
    public ResponseEntity<?> cancelTicket(@PathVariable String reference) {
        try {
            Booking booking = bookingService.cancelBooking(reference);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // --- PROMO CODE ENDPOINTS ---
    @GetMapping("/api/promo/all")
    public List<PromoCode> getAllPromoCodes() {
        return bookingService.getAllPromoCodes();
    }

    @PostMapping("/api/promo/create")
    public PromoCode createPromoCode(@RequestBody PromoCode promoCode) {
        return bookingService.createPromoCode(promoCode);
    }

    @GetMapping("/api/promo/validate")
    public ResponseEntity<?> validatePromoCode(@RequestParam String code, @RequestParam Double amount) {
        try {
            PromoCode promo = bookingService.validatePromoCode(code, amount);
            return ResponseEntity.ok(promo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}