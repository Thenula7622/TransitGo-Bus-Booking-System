import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export const generateTicketPDF = async (booking, bus) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5',
    });

    // Dark Background Header Box
    doc.setFillColor(15, 23, 42); // Slate 900
    doc.rect(0, 0, 148, 38, 'F');

    // Logo & Header Title
    doc.setTextColor(52, 211, 153); // Emerald 400
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('TransitGo', 12, 18);

    doc.setTextColor(203, 213, 225); // Slate 300
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Smart Intercity Bus Ticketing Pass', 12, 25);

    // Reference ID Badge
    doc.setFillColor(30, 41, 59); // Slate 800
    doc.roundedRect(88, 10, 48, 18, 3, 3, 'F');
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(7);
    doc.text('BOOKING REFERENCE', 92, 16);
    doc.setTextColor(52, 211, 153);
    doc.setFont('courier', 'bold');
    doc.setFontSize(10);
    doc.text(booking.bookingReference || 'BK-UNKNOWN', 92, 23);

    // Route Details Strip
    doc.setFillColor(241, 245, 249);
    doc.rect(0, 38, 148, 20, 'F');

    const source = bus?.source || booking.bus?.source || 'Origin';
    const destination = bus?.destination || booking.bus?.destination || 'Destination';
    const busName = bus?.busName || booking.bus?.busName || 'Express Fleet';
    const busNumber = bus?.busNumber || booking.bus?.busNumber || 'NC-XXXX';
    const busType = bus?.busType || booking.bus?.busType || 'Luxury A/C';
    const departureTime = bus?.departureTime || booking.bus?.departureTime || 'Direct';
    const duration = bus?.duration || booking.bus?.duration || 'Express';

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(`${source}   ➜   ${destination}`, 12, 51);

    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Duration: ${duration}`, 100, 51);

    // Passenger & Schedule Grid
    let y = 70;
    const addRow = (label1, val1, label2, val2) => {
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(label1.toUpperCase(), 12, y);
      if (label2) doc.text(label2.toUpperCase(), 80, y);

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(String(val1 || '-'), 12, y + 6);
      if (label2) doc.text(String(val2 || '-'), 80, y + 6);

      y += 15;
    };

    addRow('Passenger Name', booking.passengerName, 'NIC / ID Number', booking.nic);
    addRow('Bus Name / Reg No', `${busName} (${busNumber})`, 'Category', busType);
    addRow('Departure Time', departureTime, 'Boarding Point', booking.boardingPoint);
    addRow('Allocated Seats', booking.selectedSeats ? booking.selectedSeats.join(', ') : 'N/A', 'Status', booking.status || 'CONFIRMED');

    // Payment Section
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(10, y + 2, 128, 20, 2, 2, 'F');
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.text('TOTAL FARE PAID', 15, y + 10);
    doc.setTextColor(16, 185, 129);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(`LKR ${(booking.totalAmount || 0).toLocaleString()}`, 15, y + 18);

    if (booking.extraBaggageCount && booking.extraBaggageCount > 0) {
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(8);
      doc.text(`(Includes ${booking.extraBaggageCount} Extra Bag fees)`, 70, y + 18);
    }

    // QR Code Generation
    const qrData = JSON.stringify({
      ref: booking.bookingReference,
      passenger: booking.passengerName,
      bus: busNumber,
      seats: booking.selectedSeats,
    });

    const qrDataUrl = await QRCode.toDataURL(qrData, {
      margin: 1,
      width: 120,
    });

    doc.addImage(qrDataUrl, 'PNG', 98, y + 26, 38, 38);

    // Verification Note
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text('• Please present this e-ticket along with your original NIC upon boarding.', 12, y + 36);
    doc.text('• Scan the QR code at the vehicle door terminal for fast gate verification.', 12, y + 42);
    doc.text('• 15% cancellation penalty applies for cancellations made prior to departure.', 12, y + 48);

    // Save File
    doc.save(`TransitGo-Ticket-${booking.bookingReference || 'E-Pass'}.pdf`);
  } catch (err) {
    console.error('Failed to generate Ticket PDF', err);
    alert('Could not download PDF ticket. Please try again.');
  }
};

// Export alias to support both import styles
export const downloadTicketPDF = generateTicketPDF;
export default generateTicketPDF;