package com.transport.backend.service;

import com.transport.backend.model.Bus;
import com.transport.backend.model.PromoCode;
import com.transport.backend.model.RouteHalt;
import com.transport.backend.repository.BusRepository;
import com.transport.backend.repository.PromoCodeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final BusRepository busRepository;
    private final PromoCodeRepository promoCodeRepository;

    public DataSeeder(BusRepository busRepository, PromoCodeRepository promoCodeRepository) {
        this.busRepository = busRepository;
        this.promoCodeRepository = promoCodeRepository;
    }

    @Override
    public void run(String... args) {
        try {
            seedPromoCodes();
            seedBuses();
        } catch (Exception e) {
            System.err.println("Seeder Notice: " + e.getMessage());
        }
    }

    private void seedPromoCodes() {
        if (promoCodeRepository.count() == 0) {
            promoCodeRepository.save(new PromoCode("TRANSIT20", "Get 20% discount on any booking over LKR 2,000", 20.0, null, 2000.0, true));
            promoCodeRepository.save(new PromoCode("WELCOME500", "Flat LKR 500 discount for new passengers", null, 500.0, 1500.0, true));
            promoCodeRepository.save(new PromoCode("EXPRESS10", "10% off on all Expressway bookings", 10.0, null, 1000.0, true));
        }
    }

    private void seedBuses() {
        if (busRepository.count() >= 9) {
            return;
        }

        try {
            busRepository.deleteAll();
        } catch (Exception ignored) {}

        List<Bus> networkBuses = new ArrayList<>();

        // 1. Colombo -> Kandy
        Bus bus1 = new Bus();
        bus1.setBusName("Super Line Intercity");
        bus1.setBusNumber("ND-4589");
        bus1.setBusType("Luxury A/C");
        bus1.setSource("Colombo");
        bus1.setDestination("Kandy");
        bus1.setDepartureTime("06:30 AM");
        bus1.setArrivalTime("09:45 AM");
        bus1.setDuration("3h 15m");
        bus1.setPrice(1850.0);
        bus1.setTotalSeats(49);
        bus1.setBookedSeats(new ArrayList<>(List.of("1A", "1B", "3C")));
        bus1.setBoardingPoints(List.of("Bastian Mawatha", "Kadawatha Interchange", "Nittambuwa", "Kegalle", "Mawanella"));
        bus1.setRouteHalts(List.of(
            new RouteHalt("Kadawatha", 400.0, 1),
            new RouteHalt("Nittambuwa", 700.0, 2),
            new RouteHalt("Warakapola", 950.0, 3),
            new RouteHalt("Kegalle", 1300.0, 4),
            new RouteHalt("Mawanella", 1500.0, 5),
            new RouteHalt("Peradeniya", 1750.0, 6),
            new RouteHalt("Kandy", 1850.0, 7)
        ));
        bus1.setCurrentLatitude(7.0016);
        bus1.setCurrentLongitude(79.9542);
        bus1.setCurrentStatusText("APPROACHING_KADAWATHA");
        bus1.setAverageRating(4.8);
        bus1.setTotalReviews(32);
        networkBuses.add(bus1);

        // 2. Kandy -> Colombo
        Bus bus1Ret = new Bus();
        bus1Ret.setBusName("Super Line Intercity");
        bus1Ret.setBusNumber("ND-4590");
        bus1Ret.setBusType("Luxury A/C");
        bus1Ret.setSource("Kandy");
        bus1Ret.setDestination("Colombo");
        bus1Ret.setDepartureTime("02:30 PM");
        bus1Ret.setArrivalTime("05:45 PM");
        bus1Ret.setDuration("3h 15m");
        bus1Ret.setPrice(1850.0);
        bus1Ret.setTotalSeats(49);
        bus1Ret.setBookedSeats(new ArrayList<>(List.of("2A", "2B")));
        bus1Ret.setBoardingPoints(List.of("Goodshed Terminal", "Peradeniya", "Mawanella", "Kegalle"));
        bus1Ret.setRouteHalts(List.of(
            new RouteHalt("Peradeniya", 300.0, 1),
            new RouteHalt("Mawanella", 600.0, 2),
            new RouteHalt("Kegalle", 900.0, 3),
            new RouteHalt("Warakapola", 1200.0, 4),
            new RouteHalt("Kadawatha", 1600.0, 5),
            new RouteHalt("Colombo", 1850.0, 6)
        ));
        bus1Ret.setCurrentLatitude(7.2906);
        bus1Ret.setCurrentLongitude(80.6337);
        bus1Ret.setCurrentStatusText("BOARDING_AT_KANDY");
        bus1Ret.setAverageRating(4.7);
        bus1Ret.setTotalReviews(28);
        networkBuses.add(bus1Ret);

        // 3. Colombo -> Matara (E01)
        Bus bus2 = new Bus();
        bus2.setBusName("Southern Highway Cruiser");
        bus2.setBusNumber("WP-7821");
        bus2.setBusType("Super Luxury Volvo");
        bus2.setSource("Colombo");
        bus2.setDestination("Matara");
        bus2.setDepartureTime("08:00 AM");
        bus2.setArrivalTime("10:00 AM");
        bus2.setDuration("2h 00m");
        bus2.setPrice(1650.0);
        bus2.setTotalSeats(45);
        bus2.setBookedSeats(new ArrayList<>(List.of("4A", "4B")));
        bus2.setBoardingPoints(List.of("Makumbura Multi-Modal", "Kottawa Interchange", "Dodangoda"));
        bus2.setRouteHalts(List.of(
            new RouteHalt("Makumbura", 0.0, 1),
            new RouteHalt("Dodangoda", 650.0, 2),
            new RouteHalt("Kurundugahahetekma", 950.0, 3),
            new RouteHalt("Galle", 1350.0, 4),
            new RouteHalt("Matara", 1650.0, 5)
        ));
        bus2.setCurrentLatitude(6.5861);
        bus2.setCurrentLongitude(80.0573);
        bus2.setCurrentStatusText("CRUISING_EXPRESSWAY_E01");
        bus2.setAverageRating(4.9);
        bus2.setTotalReviews(54);
        networkBuses.add(bus2);

        // 4. Matara -> Colombo (E01)
        Bus bus2Ret = new Bus();
        bus2Ret.setBusName("Southern Highway Cruiser");
        bus2Ret.setBusNumber("WP-7822");
        bus2Ret.setBusType("Super Luxury Volvo");
        bus2Ret.setSource("Matara");
        bus2Ret.setDestination("Colombo");
        bus2Ret.setDepartureTime("03:00 PM");
        bus2Ret.setArrivalTime("05:00 PM");
        bus2Ret.setDuration("2h 00m");
        bus2Ret.setPrice(1650.0);
        bus2Ret.setTotalSeats(45);
        bus2Ret.setBookedSeats(new ArrayList<>());
        bus2Ret.setBoardingPoints(List.of("Matara Kotuwegoda", "Galle Pinnaduwa Exit", "Kurundugahahetekma"));
        bus2Ret.setRouteHalts(List.of(
            new RouteHalt("Galle", 500.0, 1),
            new RouteHalt("Kurundugahahetekma", 850.0, 2),
            new RouteHalt("Dodangoda", 1200.0, 3),
            new RouteHalt("Makumbura", 1650.0, 4),
            new RouteHalt("Colombo", 1650.0, 5)
        ));
        bus2Ret.setCurrentLatitude(5.9496);
        bus2Ret.setCurrentLongitude(80.5469);
        bus2Ret.setCurrentStatusText("PREPARING_DEPARTURE");
        bus2Ret.setAverageRating(4.8);
        bus2Ret.setTotalReviews(41);
        networkBuses.add(bus2Ret);

        // 5. Colombo -> Jaffna (A9 Sleeper)
        Bus bus3 = new Bus();
        bus3.setBusName("Northern Royal Sleeper");
        bus3.setBusNumber("NC-9912");
        bus3.setBusType("Super Luxury Sleeper");
        bus3.setSource("Colombo");
        bus3.setDestination("Jaffna");
        bus3.setDepartureTime("08:30 PM");
        bus3.setArrivalTime("04:30 AM");
        bus3.setDuration("8h 00m");
        bus3.setPrice(3400.0);
        bus3.setTotalSeats(36);
        bus3.setBookedSeats(new ArrayList<>(List.of("1A", "2A", "5B")));
        bus3.setBoardingPoints(List.of("Bastian Mawatha", "Kadawatha", "Kurunegala", "Anuradhapura", "Vavuniya"));
        bus3.setRouteHalts(List.of(
            new RouteHalt("Kadawatha", 400.0, 1),
            new RouteHalt("Kurunegala", 1100.0, 2),
            new RouteHalt("Dambulla", 1600.0, 3),
            new RouteHalt("Anuradhapura", 2100.0, 4),
            new RouteHalt("Vavuniya", 2600.0, 5),
            new RouteHalt("Kilinochchi", 3050.0, 6),
            new RouteHalt("Jaffna", 3400.0, 7)
        ));
        bus3.setCurrentLatitude(7.4863);
        bus3.setCurrentLongitude(80.3623);
        bus3.setCurrentStatusText("HALT_KURUNEGALA_STATION");
        bus3.setAverageRating(4.9);
        bus3.setTotalReviews(76);
        networkBuses.add(bus3);

        // 6. Jaffna -> Colombo
        Bus bus3Ret = new Bus();
        bus3Ret.setBusName("Northern Royal Sleeper");
        bus3Ret.setBusNumber("NC-9913");
        bus3Ret.setBusType("Super Luxury Sleeper");
        bus3Ret.setSource("Jaffna");
        bus3Ret.setDestination("Colombo");
        bus3Ret.setDepartureTime("07:30 PM");
        bus3Ret.setArrivalTime("03:30 AM");
        bus3Ret.setDuration("8h 00m");
        bus3Ret.setPrice(3400.0);
        bus3Ret.setTotalSeats(36);
        bus3Ret.setBookedSeats(new ArrayList<>());
        bus3Ret.setBoardingPoints(List.of("Jaffna Central Terminal", "Kilinochchi", "Vavuniya", "Anuradhapura"));
        bus3Ret.setRouteHalts(List.of(
            new RouteHalt("Kilinochchi", 500.0, 1),
            new RouteHalt("Vavuniya", 1000.0, 2),
            new RouteHalt("Anuradhapura", 1500.0, 3),
            new RouteHalt("Kurunegala", 2400.0, 4),
            new RouteHalt("Kadawatha", 3100.0, 5),
            new RouteHalt("Colombo", 3400.0, 6)
        ));
        bus3Ret.setCurrentLatitude(9.6615);
        bus3Ret.setCurrentLongitude(80.0255);
        bus3Ret.setCurrentStatusText("BOARDING_AT_JAFFNA");
        bus3Ret.setAverageRating(4.9);
        bus3Ret.setTotalReviews(62);
        networkBuses.add(bus3Ret);

        // 7. Colombo -> Ella
        Bus bus4 = new Bus();
        bus4.setBusName("Highland Express Sleeper");
        bus4.setBusNumber("UP-3411");
        bus4.setBusType("Luxury A/C");
        bus4.setSource("Colombo");
        bus4.setDestination("Ella");
        bus4.setDepartureTime("09:00 PM");
        bus4.setArrivalTime("04:45 AM");
        bus4.setDuration("7h 45m");
        bus4.setPrice(2600.0);
        bus4.setTotalSeats(40);
        bus4.setBookedSeats(new ArrayList<>(List.of("6A", "6B")));
        bus4.setBoardingPoints(List.of("Bastian Mawatha", "Avissawella", "Ratnapura", "Pelmadulla", "Balangoda"));
        bus4.setRouteHalts(List.of(
            new RouteHalt("Avissawella", 450.0, 1),
            new RouteHalt("Ratnapura", 900.0, 2),
            new RouteHalt("Pelmadulla", 1200.0, 3),
            new RouteHalt("Balangoda", 1600.0, 4),
            new RouteHalt("Beragala", 2000.0, 5),
            new RouteHalt("Bandarawela", 2350.0, 6),
            new RouteHalt("Ella", 2600.0, 7)
        ));
        bus4.setCurrentLatitude(6.6828);
        bus4.setCurrentLongitude(80.4036);
        bus4.setCurrentStatusText("CROSSING_RATNAPURA");
        bus4.setAverageRating(4.7);
        bus4.setTotalReviews(45);
        networkBuses.add(bus4);

        // 8. Colombo -> Trincomalee
        Bus bus5 = new Bus();
        bus5.setBusName("Eastern Pearl Express");
        bus5.setBusNumber("EP-5620");
        bus5.setBusType("Luxury A/C");
        bus5.setSource("Colombo");
        bus5.setDestination("Trincomalee");
        bus5.setDepartureTime("10:00 PM");
        bus5.setArrivalTime("05:15 AM");
        bus5.setDuration("7h 15m");
        bus5.setPrice(2750.0);
        bus5.setTotalSeats(44);
        bus5.setBookedSeats(new ArrayList<>());
        bus5.setBoardingPoints(List.of("Bastian Mawatha", "Kadawatha", "Kurunegala", "Dambulla", "Habarana", "Kantale"));
        bus5.setRouteHalts(List.of(
            new RouteHalt("Kadawatha", 400.0, 1),
            new RouteHalt("Kurunegala", 1100.0, 2),
            new RouteHalt("Dambulla", 1600.0, 3),
            new RouteHalt("Habarana", 1950.0, 4),
            new RouteHalt("Kantale", 2350.0, 5),
            new RouteHalt("Trincomalee", 2750.0, 6)
        ));
        bus5.setCurrentLatitude(7.8731);
        bus5.setCurrentLongitude(80.6511);
        bus5.setCurrentStatusText("APPROACHING_DAMBULLA");
        bus5.setAverageRating(4.6);
        bus5.setTotalReviews(38);
        networkBuses.add(bus5);

        // 9. Colombo -> Katunayake (E03 Airport Express)
        Bus bus6 = new Bus();
        bus6.setBusName("Airport Express Shuttle");
        bus6.setBusNumber("WP-1002");
        bus6.setBusType("Luxury A/C");
        bus6.setSource("Colombo");
        bus6.setDestination("Katunayake");
        bus6.setDepartureTime("07:00 AM");
        bus6.setArrivalTime("07:45 AM");
        bus6.setDuration("0h 45m");
        bus6.setPrice(600.0);
        bus6.setTotalSeats(35);
        bus6.setBookedSeats(new ArrayList<>());
        bus6.setBoardingPoints(List.of("Colombo Fort", "Peliyagoda Interchange"));
        bus6.setRouteHalts(List.of(
            new RouteHalt("Peliyagoda", 200.0, 1),
            new RouteHalt("Katunayake", 600.0, 2)
        ));
        bus6.setCurrentLatitude(6.9821);
        bus6.setCurrentLongitude(79.8872);
        bus6.setCurrentStatusText("ON_SCHEDULE_E03");
        bus6.setAverageRating(4.9);
        bus6.setTotalReviews(19);
        networkBuses.add(bus6);

        busRepository.saveAll(networkBuses);
        System.out.println("✅ Seeded " + networkBuses.size() + " National Express Schedules!");
    }
}