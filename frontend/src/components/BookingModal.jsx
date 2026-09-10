import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle, ShieldCheck, Ticket, User, Mail, 
  Phone, CreditCard, Tag, Luggage, MapPin, Clock, AlertTriangle 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createBookingAPI, validatePromoCodeAPI, holdSeatsAPI, releaseSeatsAPI } from '../services/api';
import { generateTicketPDF } from '../utils/generateTicketPDF';
import { playBookingSuccessSound, playErrorSound } from '../utils/soundEffects';
import PaymentModal from './PaymentModal';

const BookingModal = ({ bus, selectedSeats, onClose, onBookingSuccess }) => {
  const { t } = useTranslation();

  const [passengerName, setPassengerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nic, setNic] = useState('');
  const [boardingPoint, setBoardingPoint] = useState(bus.boardingPoints?.[0] || `${bus.source} Central`);
  
  const defaultDropping = bus.routeHalts && bus.routeHalts.length > 0 
    ? bus.routeHalts[bus.routeHalts.length - 1].haltName 
    : bus.destination;
    
  const [droppingPoint, setDroppingPoint] = useState(defaultDropping);
  const [extraBaggage, setExtraBaggage] = useState(0);

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [promoError, setPromoError] = useState('');

  const [timeLeft, setTimeLeft] = useState(600);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isHoldFailed, setIsHoldFailed] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);

  let currentPerSeatFare = bus.price;
  if (bus.routeHalts && bus.routeHalts.length > 0) {
    const matchedHalt = bus.routeHalts.find((h) => h.haltName === droppingPoint);
    if (matchedHalt) {
      currentPerSeatFare = matchedHalt.fareFromOrigin;
    }
  }

  const seatsTotal = currentPerSeatFare * selectedSeats.length;
  const baggageFee = extraBaggage * 300;
  const originalTotal = seatsTotal + baggageFee;
  const finalTotal = Math.max(0, originalTotal - promoDiscount);

  useEffect(() => {
    holdSeatsAPI({ busId: bus.id, seats: selectedSeats }).catch((err) => {
      const errMsg = err.response?.data?.error || "Some selected seats are already booked or held!";
      setError(errMsg);
      setIsHoldFailed(true);
      playErrorSound();
    });

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert("Time Expired! Your reserved seats have been released.");
          releaseSeatsAPI({ busId: bus.id, seats: selectedSeats });
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleClose = () => {
    if (!confirmedBooking && !isHoldFailed) {
      releaseSeatsAPI({ busId: bus.id, seats: selectedSeats });
    }
    onClose();
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleApplyPromo = async () => {
    if (!promoCodeInput.trim()) return;
    setPromoError('');
    setPromoMessage('');
    try {
      const res = await validatePromoCodeAPI(promoCodeInput.trim(), seatsTotal);
      const promo = res.data;
      let discount = 0;

      if (promo.discountPercentage && promo.discountPercentage > 0) {
        discount = (seatsTotal * promo.discountPercentage) / 100;
      } else if (promo.flatDiscountAmount) {
        discount = promo.flatDiscountAmount;
      }

      setAppliedPromo(promo);
      setPromoDiscount(discount);
      setPromoMessage(`Promo ${promo.code} applied! Saved LKR ${discount.toLocaleString()}`);
    } catch (err) {
      setPromoDiscount(0);
      setAppliedPromo(null);
      setPromoError(err.response?.data?.error || 'Invalid or expired promo code');
    }
  };

  const handleOpenPayment = (e) => {
    e.preventDefault();
    if (isHoldFailed) {
      alert("Please go back and re-select available seats.");
      return;
    }
    setShowPaymentGateway(true);
  };

  const handleFinalizeBookingAfterPayment = async () => {
    setShowPaymentGateway(false);
    setLoading(true);
    setError('');

    try {
      const payload = {
        busId: bus.id,
        passengerName,
        email,
        phone,
        nic,
        boardingPoint,
        droppingPoint,
        extraBaggageCount: extraBaggage,
        selectedSeats,
        promoCode: appliedPromo ? appliedPromo.code : null,
      };

      const res = await createBookingAPI(payload);
      playBookingSuccessSound();
      setConfirmedBooking(res.data);
      if (onBookingSuccess) onBookingSuccess();
    } catch (err) {
      playErrorSound();
      setError(err.response?.data?.error || 'Booking failed after transaction. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const shareViaWhatsApp = () => {
    if (!confirmedBooking) return;
    const text = `🚌 *TransitGo E-Ticket Confirmation*\n\n🔖 *Ref:* ${confirmedBooking.bookingReference}\n👤 *Passenger:* ${confirmedBooking.passengerName}\n🚍 *Bus:* ${bus.busName} (${bus.busNumber})\n📍 *Route:* ${bus.source} ➔ ${confirmedBooking.droppingPoint}\n⏰ *Time:* ${bus.departureTime}\n🪑 *Seats:* ${confirmedBooking.selectedSeats.join(', ')}\n📍 *Boarding:* ${confirmedBooking.boardingPoint}\n💰 *Total Paid:* LKR ${confirmedBooking.totalAmount.toLocaleString()}\n\n_Show this ticket at boarding. Safe Travels!_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-950 p-5 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {confirmedBooking ? 'Booking Confirmed' : 'Passenger Checkout'}
              </h3>
              <p className="text-xs text-slate-400">{bus.busName} ({bus.busNumber})</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!confirmedBooking && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 font-mono text-xs font-bold">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                <span>{formatTimer(timeLeft)}</span>
              </div>
            )}
            <button
              onClick={handleClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-white">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
              {isHoldFailed && (
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-2.5 py-1 rounded-lg text-[10px]"
                >
                  Change Seats
                </button>
              )}
            </div>
          )}

          {confirmedBooking ? (
            /* Success State */
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 animate-bounce">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white">Reservation Confirmed!</h4>
                <p className="text-xs text-slate-400">Confirmation email & SMS sent to <span className="text-emerald-400">{confirmedBooking.email}</span></p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-left font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Booking Ref:</span>
                  <span className="text-emerald-400 font-bold">{confirmedBooking.bookingReference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Passenger:</span>
                  <span>{confirmedBooking.passengerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Origin ➔ Dropping:</span>
                  <span>{bus.source} ➔ <strong className="text-emerald-400">{confirmedBooking.droppingPoint}</strong></span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Boarding Point:</span>
                  <span>{confirmedBooking.boardingPoint}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Seats:</span>
                  <span className="text-emerald-400 font-bold">{confirmedBooking.selectedSeats.join(', ')}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2">
                  <span className="text-slate-500">Total Paid:</span>
                  <span className="text-emerald-400 font-bold text-sm">LKR {confirmedBooking.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => generateTicketPDF(confirmedBooking, bus)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 text-xs"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Download PDF Ticket</span>
                </button>

                <button
                  type="button"
                  onClick={shareViaWhatsApp}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 text-xs"
                >
                  <span>Share on WhatsApp</span>
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleOpenPayment} className="space-y-4">
              
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Boarding Point</span>
                    </label>
                    <select
                      value={boardingPoint}
                      onChange={(e) => setBoardingPoint(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      {(bus.boardingPoints || [`${bus.source} Central`]).map((bp) => (
                        <option key={bp} value={bp}>{bp}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>Dropping Halt (Stage Fare)</span>
                    </label>
                    <select
                      value={droppingPoint}
                      onChange={(e) => {
                        setDroppingPoint(e.target.value);
                        setAppliedPromo(null);
                        setPromoDiscount(0);
                        setPromoMessage('');
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-medium"
                    >
                      {bus.routeHalts && bus.routeHalts.length > 0 ? (
                        bus.routeHalts.map((h) => (
                          <option key={h.haltName} value={h.haltName}>
                            {h.haltName} (LKR {h.fareFromOrigin?.toLocaleString()})
                          </option>
                        ))
                      ) : (
                        <option value={bus.destination}>{bus.destination} (LKR {bus.price})</option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex justify-between pt-1 border-t border-slate-800">
                  <span>Seats: <strong className="text-emerald-400 font-mono">{selectedSeats.join(', ')}</strong></span>
                  <span>Calculated Fare: <strong className="text-white font-mono">LKR {currentPerSeatFare.toLocaleString()} / seat</strong></span>
                </div>
              </div>

              {/* Passenger Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Passenger Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">NIC / Passport Number</label>
                  <input
                    type="text"
                    required
                    placeholder="200212345678 / 987654321V"
                    value={nic}
                    onChange={(e) => setNic(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Email Address (for Ticket)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Mobile Phone (for SMS Alert)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      placeholder="077 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Extra Baggage Selection */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Luggage className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="font-semibold block">Extra Baggage (+15kg)</span>
                    <span className="text-[10px] text-slate-500">LKR 300 per additional bag</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setExtraBaggage(Math.max(0, extraBaggage - 1))}
                    className="w-7 h-7 bg-slate-800 rounded-lg text-white font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold w-4 text-center">{extraBaggage}</span>
                  <button
                    type="button"
                    onClick={() => setExtraBaggage(Math.min(3, extraBaggage + 1))}
                    className="w-7 h-7 bg-slate-800 rounded-lg text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Promo Code Input */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Promo Code</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter TRANSIT20, WELCOME500"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white uppercase font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl transition"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && <span className="text-emerald-400 text-[11px] block mt-1">{promoMessage}</span>}
                {promoError && <span className="text-rose-400 text-[11px] block mt-1">{promoError}</span>}
              </div>

              {/* Price Breakdown */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Seats Fare ({selectedSeats.length} × LKR {currentPerSeatFare.toLocaleString()}):</span>
                  <span>LKR {seatsTotal.toLocaleString()}</span>
                </div>
                {extraBaggage > 0 && (
                  <div className="flex justify-between text-slate-400">
                    <span>Extra Baggage ({extraBaggage} × LKR 300):</span>
                    <span>LKR {baggageFee.toLocaleString()}</span>
                  </div>
                )}
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Promo Discount:</span>
                    <span>- LKR {promoDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-white font-bold text-sm border-t border-slate-800 pt-2">
                  <span>Final Total:</span>
                  <span className="text-emerald-400">LKR {finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || isHoldFailed}
                className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:opacity-50 text-slate-950 font-extrabold py-3 rounded-xl transition shadow-lg shadow-emerald-500/20 text-xs flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>{loading ? 'Processing...' : `Proceed to Pay LKR ${finalTotal.toLocaleString()}`}</span>
              </button>

            </form>
          )}
        </div>

      </div>

      {/* Payment Gateway Modal Sandbox */}
      {showPaymentGateway && (
        <PaymentModal
          totalAmount={finalTotal}
          passengerName={passengerName}
          onPaymentSuccess={handleFinalizeBookingAfterPayment}
          onClose={() => setShowPaymentGateway(false)}
        />
      )}

    </div>
  );
};

export default BookingModal;