package com.transport.backend.service;

import com.transport.backend.model.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Async
    public void sendBookingConfirmationEmail(Booking booking) {
        if (mailSender == null || booking.getEmail() == null || booking.getEmail().trim().isEmpty()) {
            System.out.println("MailSender not configured or empty email address. Skipping email sending.");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("TransitGo Bus Reservations <no-reply@transitgo.lk>");
            message.setTo(booking.getEmail());
            message.setSubject("Ticket Confirmed: " + booking.getBookingReference() + " - TransitGo");
            
            String body = "Dear " + booking.getPassengerName() + ",\n\n"
                    + "Thank you for booking with TransitGo! Your ticket details are below:\n\n"
                    + "---------------------------------------------\n"
                    + "Reference ID : " + booking.getBookingReference() + "\n"
                    + "Bus Operator : " + (booking.getBus() != null ? booking.getBus().getBusName() : "N/A") + "\n"
                    + "Bus Number   : " + (booking.getBus() != null ? booking.getBus().getBusNumber() : "N/A") + "\n"
                    + "Route        : " + (booking.getBus() != null ? booking.getBus().getSource() + " -> " + booking.getBus().getDestination() : "N/A") + "\n"
                    + "Departure    : " + (booking.getBus() != null ? booking.getBus().getDepartureTime() : "N/A") + "\n"
                    + "Seats        : " + (booking.getSelectedSeats() != null ? String.join(", ", booking.getSelectedSeats()) : "") + "\n"
                    + "Total Paid   : LKR " + booking.getTotalAmount() + "\n"
                    + "---------------------------------------------\n\n"
                    + "Please present your Reference ID or PDF Ticket when boarding.\n\n"
                    + "Safe travels,\n"
                    + "TransitGo Support Team";

            message.setText(body);
            mailSender.send(message);
            System.out.println("Confirmation email sent to " + booking.getEmail());
        } catch (Exception e) {
            System.err.println("Failed to send booking email: " + e.getMessage());
        }
    }

    @Async
    public void sendBookingCancellationEmail(Booking booking) {
        if (mailSender == null || booking.getEmail() == null || booking.getEmail().trim().isEmpty()) {
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("TransitGo Bus Reservations <no-reply@transitgo.lk>");
            message.setTo(booking.getEmail());
            message.setSubject("Ticket Cancelled: " + booking.getBookingReference() + " - TransitGo");

            String body = "Dear " + booking.getPassengerName() + ",\n\n"
                    + "Your booking (" + booking.getBookingReference() + ") has been CANCELLED successfully.\n\n"
                    + "---------------------------------------------\n"
                    + "Released Seats : " + (booking.getSelectedSeats() != null ? String.join(", ", booking.getSelectedSeats()) : "") + "\n"
                    + "Refund Amount  : LKR " + booking.getRefundAmount() + " (85% refund after processing)\n"
                    + "---------------------------------------------\n\n"
                    + "The refund will be processed to your original payment card within 2-3 business days.\n\n"
                    + "Regards,\nTransitGo Support Team";

            message.setText(body);
            mailSender.send(message);
            System.out.println("Cancellation email sent to " + booking.getEmail());
        } catch (Exception e) {
            System.err.println("Failed to send cancellation email: " + e.getMessage());
        }
    }
}