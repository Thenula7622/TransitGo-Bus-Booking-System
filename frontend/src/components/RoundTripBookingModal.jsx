import React, { useState } from 'react';
import { 
  X, CheckCircle, Ticket, User, Mail, Phone, CreditCard, 
  Tag, Luggage, MapPin, Repeat, ArrowRight, AlertTriangle, Sparkles 
} from 'lucide-react';
import { createBookingAPI, validatePromoCodeAPI } from '../services/api';
import { generateTicketPDF } from '../utils/generateTicketPDF';
import { playBookingSuccessSound, playErrorSound } from '../utils/soundEffects';
import PaymentModal from './PaymentModal';

const RoundTripBookingModal = ({ 
  outboundBus, 
  outboundSeats, 
  returnBus, 
  returnSeats, 
  onClose, 
  onSuccess 
}) => {
  const [passengerName, setPassengerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nic, setNic] = useState('');
  
  const [outboundBoarding, setOutboundBoarding] = useState(outboundBus.boardingPoints?.[0] || `${outboundBus.source} Central`);
  const [returnBoarding, setReturnBoarding] = useState(returnBus.boardingPoints?.[0] || `${returnBus.source} Central`);
  const [extraBaggage, setExtraBaggage] = useState(0);

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [promoError, setPromoError] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedOutbound, setConfirmedOutbound] = useState(null);
  const [confirmedReturn, setConfirmedReturn] = useState(null);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);

  // Financial Calculations
  const outboundSubtotal = outboundBus.price * outboundSeats.length;
  const returnSubtotal = returnBus.price * returnSeats.length;
  const grossTotal = outboundSubtotal + returnSubtotal;
  
  // 5% Round-Trip Bundle Discount
  const roundTripBundleDiscount = Math.round(grossTotal * 0.05);
  const baggageFee = extraBaggage * 300 * 2; // For both ways
  const combinedBeforePromo = (grossTotal - roundTripBundleDiscount) + baggageFee;
  const finalTotal = Math.max(0, combinedBeforePromo - promoDiscount);

  const handleApplyPromo = async () => {
    if (!promoCodeInput.trim()) return;
    setPromoError('');
    setPromoMessage('');
    try {
      const res = await validatePromoCodeAPI(promoCodeInput.trim(), grossTotal);
      const promo = res.data;
      let discount = 0;

      if (promo.discountPercentage && promo.discountPercentage > 0) {
        discount = (grossTotal * promo.discountPercentage) / 100;
      } else if (promo.flatDiscountAmount) {
        discount = promo.flatDiscountAmount;
      }

      setAppliedPromo(promo);
      setPromoDiscount(discount);
      setPromoMessage(`Promo ${promo.code} applied! Extra LKR ${discount.toLocaleString()} Off`);
    } catch (err) {
      setPromoDiscount(0);
      setAppliedPromo(null);
      setPromoError(err.response?.data?.error || 'Invalid promo code');
    }
  };

  const handleOpenPayment = (e) => {
    e.preventDefault();
    setShowPaymentGateway(true);
  };

  const handleFinalizeBookingAfterPayment = async () => {
    setShowPaymentGateway(false);
    setLoading(true);
    setError('');

    try {
      // 1. Outbound Booking Creation
      const outPayload = {
        busId: outboundBus.id,
        passengerName,
        email,
        phone,
        nic,
        boardingPoint: outboundBoarding,
        droppingPoint: outboundBus.destination,
        extraBaggageCount: extraBaggage,
        selectedSeats: outboundSeats,
        promoCode: appliedPromo ? appliedPromo.code : null,
      };
      const outRes = await createBookingAPI(outPayload);

      // 2. Return Booking Creation
      const retPayload = {
        busId: returnBus.id,
        passengerName,
        email,
        phone,
        nic,
        boardingPoint: returnBoarding,
        droppingPoint: returnBus.destination,
        extraBaggageCount: extraBaggage,
        selectedSeats: returnSeats,
        promoCode: null,
      };
      const retRes = await createBookingAPI(retPayload);

      playBookingSuccessSound();
      setConfirmedOutbound(outRes.data);
      setConfirmedReturn(retRes.data);
      if (onSuccess) onSuccess();
    } catch (err) {
      playErrorSound();
      setError(err.response?.data?.error || 'Round-trip checkout failed. Please contact customer support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Round-Trip Express Checkout</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> 5% Bundle Discount
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Outbound + Return Journey Combined Booking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-white">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {confirmedOutbound && confirmedReturn ? (
            /* Success State */
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 animate-bounce">
                <CheckCircle className="w-7 h-7" />
              </div>

              <h4 className="text-base font-bold text-white">Round-Trip Journey Confirmed!</h4>
              <p className="text-xs text-slate-400">Confirmation SMS & E-Tickets dispatched to <span className="text-emerald-400 font-mono">{confirmedOutbound.phone}</span></p>

              {/* Dual Tickets Summary */}
              <div className="space-y-2 font-mono text-left">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between text-emerald-400 font-bold text-xs">
                    <span>1. Outbound Ticket: {confirmedOutbound.bookingReference}</span>
                    <span>{outboundBus.departureTime}</span>
                  </div>
                  <div className="text-slate-300 text-[11px]">{outboundBus.source} ➔ {outboundBus.destination} ({outboundBus.busName})</div>
                  <div className="text-slate-400 text-[10px]">Seats: {confirmedOutbound.selectedSeats.join(', ')} • Halt: {confirmedOutbound.boardingPoint}</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between text-emerald-400 font-bold text-xs">
                    <span>2. Return Ticket: {confirmedReturn.bookingReference}</span>
                    <span>{returnBus.departureTime}</span>
                  </div>
                  <div className="text-slate-300 text-[11px]">{returnBus.source} ➔ {returnBus.destination} ({returnBus.busName})</div>
                  <div className="text-slate-400 text-[10px]">Seats: {confirmedReturn.selectedSeats.join(', ')} • Halt: {confirmedReturn.boardingPoint}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    generateTicketPDF(confirmedOutbound, outboundBus);
                    generateTicketPDF(confirmedReturn, returnBus);
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 text-xs"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Download Both PDFs</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl transition text-xs"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleOpenPayment} className="space-y-4">
              
              {/* Trip Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Outbound Trip: {outboundBus.source} ➔ {outboundBus.destination}
                  </span>
                  <div className="text-white font-semibold">{outboundBus.busName} ({outboundBus.departureTime})</div>
                  <div className="text-slate-400 text-[11px]">Seats: <strong className="text-emerald-400 font-mono">{outboundSeats.join(', ')}</strong></div>
                  <div>
                    <label className="block text-slate-500 text-[10px] mb-1">Boarding Halt</label>
                    <select
                      value={outboundBoarding}
                      onChange={(e) => setOutboundBoarding(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-[11px]"
                    >
                      {(outboundBus.boardingPoints || [`${outboundBus.source} Central`]).map((bp) => (
                        <option key={bp} value={bp}>{bp}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                    Return Trip: {returnBus.source} ➔ {returnBus.destination}
                  </span>
                  <div className="text-white font-semibold">{returnBus.busName} ({returnBus.departureTime})</div>
                  <div className="text-slate-400 text-[11px]">Seats: <strong className="text-amber-400 font-mono">{returnSeats.join(', ')}</strong></div>
                  <div>
                    <label className="block text-slate-500 text-[10px] mb-1">Boarding Halt</label>
                    <select
                      value={returnBoarding}
                      onChange={(e) => setReturnBoarding(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-[11px]"
                    >
                      {(returnBus.boardingPoints || [`${returnBus.source} Central`]).map((bp) => (
                        <option key={bp} value={bp}>{bp}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Passenger Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Passenger Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">NIC / Passport Number</label>
                  <input
                    type="text"
                    required
                    placeholder="200212345678"
                    value={nic}
                    onChange={(e) => setNic(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="077 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Promo Code Input */}
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="ENTER TRANSIT20, WELCOME500"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white uppercase font-mono focus:outline-none focus:border-emerald-500 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl transition text-xs"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && <span className="text-emerald-400 text-[10px] block mt-1">{promoMessage}</span>}
                {promoError && <span className="text-rose-400 text-[10px] block mt-1">{promoError}</span>}
              </div>

              {/* Price Calculation Summary */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Outbound ({outboundSeats.length} seats) + Return ({returnSeats.length} seats):</span>
                  <span>LKR {grossTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Round-Trip 5% Bundle Discount:</span>
                  <span>- LKR {roundTripBundleDiscount.toLocaleString()}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Promo Coupon Discount:</span>
                    <span>- LKR {promoDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-white font-bold text-sm border-t border-slate-800 pt-2">
                  <span>Total Combined Payable:</span>
                  <span className="text-emerald-400">LKR {finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:opacity-50 text-slate-950 font-extrabold py-3 rounded-xl transition shadow-lg shadow-emerald-500/20 text-xs flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>{loading ? 'Processing...' : `Pay LKR ${finalTotal.toLocaleString()} & Book Both Trips`}</span>
              </button>

            </form>
          )}
        </div>

      </div>

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

export default RoundTripBookingModal;