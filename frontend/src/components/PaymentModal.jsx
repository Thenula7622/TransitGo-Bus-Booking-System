import React, { useState } from 'react';
import { 
  X, CreditCard, ShieldCheck, Lock, Smartphone, CheckCircle, 
  AlertCircle, ArrowRight, RefreshCw, KeyRound 
} from 'lucide-react';

const PaymentModal = ({ totalAmount, passengerName, bookingRef, onPaymentSuccess, onClose }) => {
  const [step, setStep] = useState('CARD_DETAILS'); // CARD_DETAILS, OTP_VERIFY, SUCCESS
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(passengerName || '');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('784921');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Format Card Number (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    if (raw.length <= 16) setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (raw.length <= 4) {
      if (raw.length > 2) {
        setExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
      } else {
        setExpiry(raw);
      }
    }
  };

  const handleProceedToOtp = (e) => {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, '').length < 16) {
      setError('Please enter a valid 16-digit Card Number.');
      return;
    }
    if (cvv.length < 3) {
      setError('Please enter a valid 3-digit CVV.');
      return;
    }
    setError('');
    setLoading(true);

    // Simulate 3D Secure Handshake
    setTimeout(() => {
      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(mockOtp);
      setLoading(false);
      setStep('OTP_VERIFY');
    }, 1200);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp !== generatedOtp && otp !== '123456') {
      setError('Invalid OTP code. Please use the simulated demo code shown.');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStep('SUCCESS');
      setTimeout(() => {
        onPaymentSuccess();
      }, 1000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">TransitGo Secure Pay</h3>
              <p className="text-[10px] text-slate-400 font-mono">256-Bit SSL Encrypted Sandbox Gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Amount Ribbon */}
        <div className="bg-slate-950/60 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
          <span className="text-xs text-slate-400">Amount Payable:</span>
          <span className="text-base font-extrabold text-emerald-400 font-mono">
            LKR {Number(totalAmount).toLocaleString()}
          </span>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-2.5 rounded-xl flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 'CARD_DETAILS' && (
            <form onSubmit={handleProceedToOtp} className="space-y-4">
              
              {/* Virtual Card Graphic */}
              <div className="h-40 w-full rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-emerald-950 border border-slate-700/60 p-4 shadow-xl flex flex-col justify-between text-white font-mono relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="flex justify-between items-start">
                  <div className="w-10 h-7 rounded-md bg-amber-400/80 border border-amber-300"></div>
                  <span className="text-xs font-bold tracking-widest text-emerald-400">VISA / MASTERCARD</span>
                </div>
                <div>
                  <div className="text-sm sm:text-base tracking-widest font-semibold">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>
                </div>
                <div className="flex justify-between items-end text-[10px] text-slate-400 uppercase">
                  <div>
                    <span className="block text-[8px] text-slate-500">CARD HOLDER</span>
                    <span className="font-bold text-white">{cardHolder || 'PASSENGER'}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-slate-500">EXPIRES</span>
                    <span className="font-bold text-white">{expiry || 'MM/YY'}</span>
                  </div>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Card Number</label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="4532 0192 8374 2910"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Expiry Date</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={handleExpiryChange}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">CVV / CVC</label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="•••"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Name on Card</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white uppercase focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:opacity-50 text-slate-950 font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Connecting Bank Gateway...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to 3D-Secure Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {step === 'OTP_VERIFY' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-2 py-2">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                  <Smartphone className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="text-sm font-bold text-white">Bank OTP Verification</h4>
                <p className="text-xs text-slate-400">
                  A 6-digit one-time password has been simulated for your card.
                </p>
                <div className="bg-slate-950 p-2 rounded-xl border border-emerald-500/30 font-mono text-emerald-400 text-xs font-bold inline-block">
                  Simulation OTP: {generatedOtp}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-semibold text-center text-xs">Enter 6-Digit Code</label>
                <div className="relative max-w-xs mx-auto">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white font-mono text-center tracking-widest text-base font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:opacity-50 text-slate-950 font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Authorizing Payment...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify & Authorize LKR {Number(totalAmount).toLocaleString()}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {step === 'SUCCESS' && (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 animate-bounce">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white">Payment Authorized!</h4>
              <p className="text-xs text-slate-400">Generating your confirmed ticket & reservation credentials...</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PaymentModal;