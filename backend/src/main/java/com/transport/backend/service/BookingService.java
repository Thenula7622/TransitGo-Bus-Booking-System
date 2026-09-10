package com.transport.backend.service;

import com.transport.backend.model.*;
import com.transport.backend.repository.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BusRepository busRepository;
    private final BookingRepository bookingRepository;
    private final PromoCodeRepository promoCodeRepository;
    private final ReviewRepository reviewRepository;
    private final SeatHoldRepository seatHoldRepository;
    private final EmailService emailService;
    private final SmsService smsService;
    private final SimpMessagingTemplate messagingTemplate;

    public BookingService(BusRepository busRepository, 
                          BookingRepository bookingRepository, 
                          PromoCodeRepository promoCodeRepository,
                          ReviewRepository reviewRepository,
                          SeatHoldRepository seatHoldRepository,
                          EmailService emailService,
                          SmsService smsService,
                          SimpMessagingTemplate messagingTemplate) {
        this.busRepository = busRepository;
        this.bookingRepository = bookingRepository;
        this.promoCodeRepository = promoCodeRepository;
        this.reviewRepository = reviewRepository;
        this.seatHoldRepository = seatHoldRepository;
        this.emailService = emailService;
        this.smsService = smsService;
        this.messagingTemplate = messagingTemplate;
    }

    public List<Bus> getAllBuses() {
        cleanExpiredHolds();
        List<Bus> buses = busRepository.findAll();
        for (Bus bus : buses) {
            populateHeldSeats(bus);
        }
        return buses;
    }

    // Smart Sequential Intermediate Route Matching
    public List<Bus> searchBuses(String fromTown, String toTown) {
        cleanExpiredHolds();
        List<Bus> allBuses = busRepository.findAll();
        List<Bus> matchedBuses = new ArrayList<>();

        if (fromTown == null || toTown == null || fromTown.isBlank() || toTown.isBlank()) {
            return getAllBuses();
        }

        String searchFrom = fromTown.trim().toLowerCase();
        String searchTo = toTown.trim().toLowerCase();

        for (Bus bus : allBuses) {
            List<RouteNode> routeNodes = getOrderedRouteNodes(bus);

            int fromIndex = -1;
            int toIndex = -1;
            double fromFare = 0.0;
            double toFare = bus.getPrice() != null ? bus.getPrice() : 0.0;

            for (int i = 0; i < routeNodes.size(); i++) {
                RouteNode node = routeNodes.get(i);
                String nodeName = node.name.toLowerCase();

                if (fromIndex == -1 && (nodeName.contains(searchFrom) || searchFrom.contains(nodeName))) {
                    fromIndex = i;
                    fromFare = node.fareFromOrigin;
                }
                if (nodeName.contains(searchTo) || searchTo.contains(nodeName)) {
                    toIndex = i;
                    toFare = node.fareFromOrigin;
                }
            }

            if (fromIndex != -1 && toIndex != -1 && fromIndex < toIndex) {
                double segmentPrice = Math.max(300.0, Math.abs(toFare - fromFare));
                Bus contextualBus = cloneBusForSearch(bus, segmentPrice);
                populateHeldSeats(contextualBus);
                matchedBuses.add(contextualBus);
            }
        }

        return matchedBuses;
    }

    // Auto-Discovery of all distinct network towns with null-safety
    public List<String> getAllNetworkTowns() {
        Set<String> uniqueTowns = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
        try {
            List<Bus> buses = busRepository.findAll();
            for (Bus b : buses) {
                if (b.getSource() != null && !b.getSource().trim().isEmpty()) {
                    uniqueTowns.add(b.getSource().trim());
                }
                if (b.getDestination() != null && !b.getDestination().trim().isEmpty()) {
                    uniqueTowns.add(b.getDestination().trim());
                }
                if (b.getBoardingPoints() != null) {
                    for (String bp : b.getBoardingPoints()) {
                        String cleaned = cleanTownName(bp);
                        if (!cleaned.isEmpty()) uniqueTowns.add(cleaned);
                    }
                }
                if (b.getRouteHalts() != null) {
                    for (RouteHalt rh : b.getRouteHalts()) {
                        if (rh != null && rh.getHaltName() != null) {
                            String cleaned = cleanTownName(rh.getHaltName());
                            if (!cleaned.isEmpty()) uniqueTowns.add(cleaned);
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error extracting network towns: " + e.getMessage());
        }

        if (uniqueTowns.isEmpty()) {
            uniqueTowns.addAll(List.of(
                "Colombo", "Kadawatha", "Kegalle", "Mawanella", "Peradeniya", 
                "Kandy", "Kurunegala", "Anuradhapura", "Vavuniya", "Kilinochchi", 
                "Jaffna", "Galle", "Matara", "Ratnapura", "Ella"
            ));
        }

        return new ArrayList<>(uniqueTowns);
    }

    private String cleanTownName(String raw) {
        if (raw == null || raw.trim().isEmpty()) return "";
        return raw.replaceAll("(?i)\\b(Central|Stand|Bus Stand|Terminal|Interchange|Exit|Town|Clock Tower|Junction|Old Stand|Main Stand|Goodshed|City|Main Halt)\\b", "")
                  .replaceAll("[^a-zA-Z0-9\\s]", "")
                  .trim();
    }

    private static class RouteNode {
        String name;
        double fareFromOrigin;
        RouteNode(String name, double fareFromOrigin) {
            this.name = name != null ? name : "";
            this.fareFromOrigin = fareFromOrigin;
        }
    }

    private List<RouteNode> getOrderedRouteNodes(Bus bus) {
        List<RouteNode> nodes = new ArrayList<>();
        nodes.add(new RouteNode(bus.getSource(), 0.0));

        if (bus.getRouteHalts() != null && !bus.getRouteHalts().isEmpty()) {
            List<RouteHalt> sorted = new ArrayList<>(bus.getRouteHalts());
            sorted.sort(Comparator.comparing(RouteHalt::getOrderIndex, Comparator.nullsLast(Comparator.naturalOrder())));
            for (RouteHalt h : sorted) {
                if (h != null && h.getHaltName() != null) {
                    nodes.add(new RouteNode(h.getHaltName(), h.getFareFromOrigin() != null ? h.getFareFromOrigin() : bus.getPrice()));
                }
            }
        }

        nodes.add(new RouteNode(bus.getDestination(), bus.getPrice() != null ? bus.getPrice() : 0.0));
        return nodes;
    }

    private Bus cloneBusForSearch(Bus original, double segmentPrice) {
        Bus b = new Bus();
        b.setId(original.getId());
        b.setBusName(original.getBusName());
        b.setBusNumber(original.getBusNumber());
        b.setBusType(original.getBusType());
        b.setSource(original.getSource());
        b.setDestination(original.getDestination());
        b.setDepartureTime(original.getDepartureTime());
        b.setArrivalTime(original.getArrivalTime());
        b.setDuration(original.getDuration());
        b.setPrice(segmentPrice);
        b.setTotalSeats(original.getTotalSeats());
        b.setBookedSeats(original.getBookedSeats() != null ? new ArrayList<>(original.getBookedSeats()) : new ArrayList<>());
        b.setHeldSeats(new HashMap<>());
        b.setBoardingPoints(original.getBoardingPoints());
        b.setRouteHalts(original.getRouteHalts());
        b.setCurrentLatitude(original.getCurrentLatitude());
        b.setCurrentLongitude(original.getCurrentLongitude());
        b.setCurrentStatusText(original.getCurrentStatusText());
        b.setAverageRating(original.getAverageRating());
        b.setTotalReviews(original.getTotalReviews());
        return b;
    }

    private void populateHeldSeats(Bus bus) {
        if (bus == null || bus.getId() == null) return;
        Map<String, Long> holdsMap = new HashMap<>();
        List<SeatHold> holds = seatHoldRepository.findByBusId(bus.getId());
        long now = System.currentTimeMillis();
        for (SeatHold h : holds) {
            if (h.getExpiryTimestamp() != null && h.getExpiryTimestamp() > now) {
                holdsMap.put(h.getSeatNumber(), h.getExpiryTimestamp());
            }
        }
        bus.setHeldSeats(holdsMap);
    }

    @Transactional
    public synchronized boolean holdSeats(SeatHoldRequest request) {
        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new RuntimeException("Bus not found"));

        long now = System.currentTimeMillis();
        long expiry = now + (10 * 60 * 1000); // 10 mins

        for (String seat : request.getSeats()) {
            if (bus.getBookedSeats() != null && bus.getBookedSeats().contains(seat)) {
                throw new RuntimeException("Seat " + seat + " is already confirmed booked!");
            }
            seatHoldRepository.upsertHold(bus.getId(), seat, expiry);
        }

        notifyFleetUpdate();
        return true;
    }

    @Transactional
    public synchronized void releaseHeldSeats(SeatHoldRequest request) {
        if (request.getBusId() != null && request.getSeats() != null) {
            for (String seat : request.getSeats()) {
                seatHoldRepository.deleteByBusIdAndSeatNumber(request.getBusId(), seat);
            }
            notifyFleetUpdate();
        }
    }

    @Scheduled(fixedRate = 30000)
    @Transactional
    public void cleanExpiredHolds() {
        long now = System.currentTimeMillis();
        seatHoldRepository.deleteByExpiryTimestampLessThan(now);
    }

    @Transactional
    public Booking createBooking(BookingRequest request) {
        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new RuntimeException("Bus not found with ID: " + request.getBusId()));

        if (bus.getBookedSeats() == null) {
            bus.setBookedSeats(new ArrayList<>());
        }

        for (String seat : request.getSelectedSeats()) {
            if (bus.getBookedSeats().contains(seat)) {
                throw new RuntimeException("Seat " + seat + " is already booked!");
            }
        }

        bus.getBookedSeats().addAll(request.getSelectedSeats());
        busRepository.save(bus);

        seatHoldRepository.deleteByBusIdAndSeatNumberIn(bus.getId(), request.getSelectedSeats());

        String boarding = request.getBoardingPoint() != null ? request.getBoardingPoint() : bus.getSource();
        String dropping = request.getDroppingPoint() != null ? request.getDroppingPoint() : bus.getDestination();

        List<RouteNode> nodes = getOrderedRouteNodes(bus);
        double originFare = 0.0;
        double destFare = bus.getPrice() != null ? bus.getPrice() : 0.0;

        for (RouteNode node : nodes) {
            if (node.name.equalsIgnoreCase(boarding) || boarding.toLowerCase().contains(node.name.toLowerCase())) {
                originFare = node.fareFromOrigin;
            }
            if (node.name.equalsIgnoreCase(dropping) || dropping.toLowerCase().contains(node.name.toLowerCase())) {
                destFare = node.fareFromOrigin;
            }
        }

        double perSeatPrice = Math.max(300.0, Math.abs(destFare - originFare));
        double seatsTotal = perSeatPrice * request.getSelectedSeats().size();
        int extraBaggage = request.getExtraBaggageCount() != null ? request.getExtraBaggageCount() : 0;
        double baggageFee = extraBaggage * 300.0;
        double originalTotal = seatsTotal + baggageFee;

        double discount = 0.0;
        if (request.getPromoCode() != null && !request.getPromoCode().trim().isEmpty()) {
            PromoCode promo = validatePromoCode(request.getPromoCode().trim(), seatsTotal);
            if (promo.getDiscountPercentage() != null && promo.getDiscountPercentage() > 0) {
                discount = (seatsTotal * promo.getDiscountPercentage()) / 100.0;
            } else if (promo.getFlatDiscountAmount() != null) {
                discount = promo.getFlatDiscountAmount();
            }
        }

        double finalAmount = Math.max(0.0, originalTotal - discount);

        Booking booking = new Booking();
        booking.setBookingReference("BK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setPassengerName(request.getPassengerName());
        booking.setEmail(request.getEmail());
        booking.setPhone(request.getPhone());
        booking.setNic(request.getNic());
        booking.setBoardingPoint(boarding);
        booking.setDroppingPoint(dropping);
        booking.setExtraBaggageCount(extraBaggage);
        booking.setBaggageFee(baggageFee);
        booking.setBus(bus);
        booking.setSelectedSeats(request.getSelectedSeats());
        booking.setOriginalAmount(originalTotal);
        booking.setDiscountAmount(discount);
        booking.setTotalAmount(finalAmount);
        booking.setBookingTime(LocalDateTime.now());
        booking.setStatus("CONFIRMED");

        Booking savedBooking = bookingRepository.save(booking);
        
        emailService.sendBookingConfirmationEmail(savedBooking);
        smsService.sendBookingConfirmationSms(savedBooking);

        notifyFleetUpdate();
        return savedBooking;
    }

    public Bus addBus(Bus bus) {
        if (bus.getBookedSeats() == null) bus.setBookedSeats(new ArrayList<>());
        if (bus.getBoardingPoints() == null || bus.getBoardingPoints().isEmpty()) {
            bus.setBoardingPoints(List.of(bus.getSource() + " Central", bus.getSource() + " Express Halt"));
        }
        if (bus.getRouteHalts() == null || bus.getRouteHalts().isEmpty()) {
            bus.setRouteHalts(List.of(new RouteHalt(bus.getDestination(), bus.getPrice(), 1)));
        }
        Bus saved = busRepository.save(bus);
        notifyFleetUpdate();
        return saved;
    }

    @Transactional
    public Bus updateBus(Long busId, Bus updatedData) {
        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new RuntimeException("Bus not found with ID: " + busId));

        if (updatedData.getBusName() != null) bus.setBusName(updatedData.getBusName());
        if (updatedData.getBusNumber() != null) bus.setBusNumber(updatedData.getBusNumber());
        if (updatedData.getBusType() != null) bus.setBusType(updatedData.getBusType());
        if (updatedData.getSource() != null) bus.setSource(updatedData.getSource());
        if (updatedData.getDestination() != null) bus.setDestination(updatedData.getDestination());
        if (updatedData.getDepartureTime() != null) bus.setDepartureTime(updatedData.getDepartureTime());
        if (updatedData.getArrivalTime() != null) bus.setArrivalTime(updatedData.getArrivalTime());
        if (updatedData.getDuration() != null) bus.setDuration(updatedData.getDuration());
        if (updatedData.getPrice() != null) bus.setPrice(updatedData.getPrice());
        if (updatedData.getTotalSeats() != null) bus.setTotalSeats(updatedData.getTotalSeats());
        if (updatedData.getBoardingPoints() != null && !updatedData.getBoardingPoints().isEmpty()) {
            bus.setBoardingPoints(updatedData.getBoardingPoints());
        }
        if (updatedData.getRouteHalts() != null && !updatedData.getRouteHalts().isEmpty()) {
            bus.setRouteHalts(updatedData.getRouteHalts());
        }

        Bus saved = busRepository.save(bus);
        notifyFleetUpdate();
        return saved;
    }

    public void deleteBus(Long busId) {
        busRepository.deleteById(busId);
        notifyFleetUpdate();
    }

    public Optional<Booking> getBookingByReference(String reference) {
        return bookingRepository.findByBookingReference(reference);
    }

    public List<Booking> getBookingsByNicOrPhone(String query) {
        List<Booking> byNic = bookingRepository.findByNicIgnoreCaseOrderByBookingTimeDesc(query.trim());
        if (!byNic.isEmpty()) return byNic;
        return bookingRepository.findByPhoneOrderByBookingTimeDesc(query.trim());
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<PromoCode> getAllPromoCodes() {
        return promoCodeRepository.findAll();
    }

    public PromoCode createPromoCode(PromoCode promoCode) {
        return promoCodeRepository.save(promoCode);
    }

    public PromoCode validatePromoCode(String code, Double totalAmount) {
        PromoCode promo = promoCodeRepository.findByCodeIgnoreCaseAndActiveTrue(code)
                .orElseThrow(() -> new RuntimeException("Invalid or inactive promo code!"));

        if (promo.getMinBookingAmount() != null && totalAmount < promo.getMinBookingAmount()) {
            throw new RuntimeException("Minimum booking amount of LKR " + promo.getMinBookingAmount() + " required for " + code);
        }
        return promo;
    }

    @Transactional
    public Booking checkInPassenger(String reference) {
        Booking booking = bookingRepository.findByBookingReference(reference)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        if ("BOARDED".equalsIgnoreCase(booking.getStatus())) throw new RuntimeException("Already boarded!");
        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) throw new RuntimeException("Ticket cancelled!");
        booking.setStatus("BOARDED");
        Booking saved = bookingRepository.save(booking);
        notifyFleetUpdate();
        return saved;
    }

    @Transactional
    public Booking cancelBooking(String reference) {
        Booking booking = bookingRepository.findByBookingReference(reference)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) throw new RuntimeException("Already cancelled!");
        if ("BOARDED".equalsIgnoreCase(booking.getStatus())) throw new RuntimeException("Already boarded!");

        Bus bus = booking.getBus();
        if (bus != null && bus.getBookedSeats() != null) {
            bus.getBookedSeats().removeAll(booking.getSelectedSeats());
            busRepository.save(bus);
        }

        booking.setRefundAmount(booking.getTotalAmount() * 0.85);
        booking.setStatus("CANCELLED");
        booking.setCancellationTime(LocalDateTime.now());
        Booking cancelled = bookingRepository.save(booking);

        emailService.sendBookingCancellationEmail(cancelled);
        smsService.sendCancellationSms(cancelled);

        notifyFleetUpdate();
        return cancelled;
    }

    public List<Review> getReviewsForBus(Long busId) {
        return reviewRepository.findByBusIdOrderByCreatedAtDesc(busId);
    }

    @Transactional
    public Review addReview(Review review) {
        Review saved = reviewRepository.save(review);
        List<Review> list = reviewRepository.findByBusIdOrderByCreatedAtDesc(review.getBusId());
        double avg = list.stream().mapToInt(Review::getRating).average().orElse(5.0);
        busRepository.findById(review.getBusId()).ifPresent(b -> {
            b.setAverageRating(Math.round(avg * 10.0) / 10.0);
            b.setTotalReviews(list.size());
            busRepository.save(b);
        });
        notifyFleetUpdate();
        return saved;
    }

    @Transactional
    public Bus updateBusLocation(Long busId, Double lat, Double lng, String status) {
        Bus bus = busRepository.findById(busId).orElseThrow(() -> new RuntimeException("Bus not found"));
        bus.setCurrentLatitude(lat);
        bus.setCurrentLongitude(lng);
        if (status != null) bus.setCurrentStatusText(status);
        Bus saved = busRepository.save(bus);
        notifyFleetUpdate();
        return saved;
    }

    private void notifyFleetUpdate() {
        try {
            messagingTemplate.convertAndSend("/topic/bus-updates", "FLEET_UPDATED");
        } catch (Exception e) {
            System.err.println("WS error: " + e.getMessage());
        }
    }
}