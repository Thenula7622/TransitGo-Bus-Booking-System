import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { X, CheckCircle2, AlertCircle, Loader2, Scan, RotateCcw } from 'lucide-react';
import { checkInTicketAPI } from '../services/api';
import { sounds } from '../utils/soundEffects';

const ConductorScannerModal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [successTicket, setSuccessTicket] = useState(null);
  const [error, setError] = useState('');
  const [scannedRef, setScannedRef] = useState('');

  const handleScan = async (detectedCodes) => {
    if (loading || !detectedCodes || detectedCodes.length === 0) return;
    const rawValue = detectedCodes[0].rawValue;
    if (!rawValue) return;

    sounds.playSuccessBeep();
    setScannedRef(rawValue);
    setLoading(true);
    setError('');

    try {
      const response = await checkInTicketAPI(rawValue.trim().toUpperCase());
      setSuccessTicket(response.data);
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data || 'Ticket validation failed!';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheckIn = async (e) => {
    e.preventDefault();
    if (!scannedRef.trim()) return;

    setLoading(true);
    setError('');
    try {
      const response = await checkInTicketAPI(scannedRef.trim().toUpperCase());
      sounds.playSuccessBeep();
      setSuccessTicket(response.data);
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data || 'Ticket validation failed!';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setSuccessTicket(null);
    setError('');
    setScannedRef('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 relative shadow-2xl animate-in zoom-in-95 space-y-4">
        
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-white transition">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Scan className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Boarding Pass Scanner</h3>
            <p className="text-xs text-slate-400">Scan QR Code or enter Reference ID</p>
          </div>
        </div>

        {/* QR Scanner Camera View */}
        {!successTicket && (
          <div className="space-y-4">
            <div className="h-56 w-full rounded-xl overflow-hidden border border-slate-800 relative bg-black">
              <Scanner
                onScan={handleScan}
                allowMultiple={false}
                scanDelay={2000}
                styles={{
                  container: { width: '100%', height: '100%' },
                  video: { objectFit: 'cover' }
                }}
              />
            </div>

            {/* Manual Reference Form */}
            <form onSubmit={handleManualCheckIn} className="flex gap-2">
              <input
                type="text"
                placeholder="Or type BK-XXXXXX"
                value={scannedRef}
                onChange={(e) => setScannedRef(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Check-In'}
              </button>
            </form>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={resetScanner} className="text-xs underline text-rose-300 font-bold">Retry</button>
          </div>
        )}

        {/* Boarded Success Card */}
        {successTicket && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl space-y-3 animate-in zoom-in-95 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>PASSENGER BOARDED SUCCESSFULLY</span>
            </div>
            <div className="space-y-1 text-slate-300 border-t border-emerald-500/20 pt-2">
              <div className="flex justify-between"><span>Ref:</span><strong className="font-mono text-white">{successTicket.bookingReference}</strong></div>
              <div className="flex justify-between"><span>Passenger:</span><span className="text-white">{successTicket.passengerName}</span></div>
              <div className="flex justify-between"><span>NIC:</span><span className="text-white">{successTicket.nic}</span></div>
              <div className="flex justify-between"><span>Seats:</span><strong className="text-emerald-400">{successTicket.selectedSeats?.join(', ')}</strong></div>
            </div>
            <button
              onClick={resetScanner}
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Scan Next Passenger</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ConductorScannerModal;