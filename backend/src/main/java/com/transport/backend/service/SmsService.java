package com.transport.backend.service;

import com.transport.backend.model.Booking;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class SmsService {

    @Value("${sms.twilio.account-sid:}")
    private String twilioAccountSid;

    @Value("${sms.twilio.auth-token:}")
    private String twilioAuthToken;

    @Value("${sms.twilio.from-phone:}")
    private String twilioFromPhone;

    public void sendBookingConfirmationSms(Booking booking) {
        String busName = booking.getBus() != null ? booking.getBus().getBusName() : "TransitGo Express";
        String busNumber = booking.getBus() != null ? booking.getBus().getBusNumber() : "Fleet";
        String departure = booking.getBus() != null ? booking.getBus().getDepartureTime() : "On Schedule";
        String origin = booking.getBus() != null ? booking.getBus().getSource() : "Origin";
        String dropping = booking.getDroppingPoint() != null ? booking.getDroppingPoint() : "Destination";

        String message = String.format(
                "🚌 TransitGo Ticket Confirmed!\n" +
                "Ref: %s\n" +
                "Passenger: %s\n" +
                "Bus: %s (%s)\n" +
                "Route: %s -> %s\n" +
                "Time: %s\n" +
                "Seats: %s\n" +
                "Boarding: %s\n" +
                "Fare: LKR %,.2f\n" +
                "Safe Travels!",
                booking.getBookingReference(),
                booking.getPassengerName(),
                busName,
                busNumber,
                origin,
                dropping,
                departure,
                String.join(",", booking.getSelectedSeats()),
                booking.getBoardingPoint(),
                booking.getTotalAmount()
        );

        dispatchSms(booking.getPhone(), message);
    }

    public void sendCancellationSms(Booking booking) {
        String message = String.format(
                "⚠️ TransitGo Ticket Cancelled\n" +
                "Ref: %s\n" +
                "Seats: %s released.\n" +
                "Refund: LKR %,.2f (15%% fee deducted).\n" +
                "Thank you for using TransitGo.",
                booking.getBookingReference(),
                String.join(",", booking.getSelectedSeats()),
                booking.getRefundAmount() != null ? booking.getRefundAmount() : 0.0
        );

        dispatchSms(booking.getPhone(), message);
    }

    private void dispatchSms(String recipientPhone, String messageBody) {
        if (twilioAccountSid != null && !twilioAccountSid.isBlank() 
                && twilioAuthToken != null && !twilioAuthToken.isBlank()) {
            // Live Twilio SMS Dispatch
            try {
                String normalizedPhone = formatPhoneNumber(recipientPhone);
                String formUrlEncoded = "To=" + normalizedPhone +
                        "&From=" + twilioFromPhone +
                        "&Body=" + java.net.URLEncoder.encode(messageBody, StandardCharsets.UTF_8);

                String authHeader = "Basic " + Base64.getEncoder().encodeToString((twilioAccountSid + ":" + twilioAuthToken).getBytes());

                HttpClient client = HttpClient.newHttpClient();
                HttpRequest req = HttpRequest.newBuilder()
                        .uri(URI.create("https://api.twilio.com/2010-04-01/Accounts/" + twilioAccountSid + "/Messages.json"))
                        .header("Authorization", authHeader)
                        .header("Content-Type", "application/x-www-form-urlencoded")
                        .POST(HttpRequest.BodyPublishers.ofString(formUrlEncoded))
                        .build();

                HttpResponse<String> response = client.send(req, HttpResponse.BodyHandlers.ofString());
                System.out.println(">>> [SMS GATEWAY LIVE] Status: " + response.statusCode());
            } catch (Exception e) {
                System.err.println(">>> [SMS GATEWAY ERROR] " + e.getMessage());
            }
        } else {
            // Enterprise Local Mock Gateway Simulator
            System.out.println("=================================================");
            System.out.println(">>> 📱 [MOCK SMS GATEWAY DISPATCHED]");
            System.out.println(">>> TO: " + recipientPhone);
            System.out.println(">>> MESSAGE BODY:\n" + messageBody);
            System.out.println("=================================================");
        }
    }

    private String formatPhoneNumber(String phone) {
        if (phone == null) return "+94770000000";
        String clean = phone.replaceAll("[^0-9]", "");
        if (clean.startsWith("0")) {
            return "+94" + clean.substring(1);
        }
        if (clean.startsWith("94")) {
            return "+" + clean;
        }
        return "+94" + clean;
    }
}