import React, { useState } from 'react';
import { X, Search, Ticket, CheckCircle2, AlertCircle, Loader2, Download, Ban, History, UserCheck } from 'lucide-react';
import { getBookingByReferenceAPI, getBookingHistoryAPI, cancelBookingAPI } from '../services/api';
import { downloadTicketPDF } from '../utils/generateTicketPDF';

const CheckTicketModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('ref'); // 'ref' or 'history'
  const [queryInput, setQueryInput] = useState('');
  const [ticket, setTicket] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!queryInput.trim()) return;

    setLoading(true);
    setError('');
    setCancelSuccess('');
    setTicket(null);
    setHistoryList([]);

    try {
      if (activeTab === 'ref') {
        const response = await getBookingByReferenceAPI(queryInput.trim().toUpperCase());
        setTicket(response.data);
      } else {
        const response = await getBookingHistoryAPI(queryInput.trim());
        if (response.data && response.data.length > 0) {
          setHistoryList(response.data);
        } else {
          setError('No travel records found matching this NIC or Phone Number.');
        }
      }
    } catch (err) {
      setError(activeTab === 'ref' ? 'Ticket not found. Please verify Reference ID.' : 'No records found.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTicket = async (refCode) => {
    if (!window.confirm('Are you sure you want to cancel this ticket? The seats will be released immediately and an 85% refund will be processed.')) {
      return;
    }

    setCancelLoading(true);
    setError('');
    try {
      const response = await cancelBookingAPI(refCode);
      if (ticket && ticket.bookingReference === refCode) {
        setTicket(response.data);
      }
      setHistoryList(prev => prev.map(item => item.bookingReference === refCode ? response.data : item));
      setCancelSuccess('Ticket successfully cancelled. Seats released and refund initiated!');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to cancel ticket.');
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 relative shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto space-y-4">
        
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-white transition">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Ticket Portal & Passenger History</h3>
            <p className="text-xs text-slate-400">Search specific ticket or view all trips by NIC/Phone</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => { setActiveTab('ref'); setQueryInput(''); setTicket(null); setHistoryList([]); setError(''); }}
            className={`flex-1 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'ref' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Reference ID</span>
          </button>
          <button
            onClick={() => { setActiveTab('history'); setQueryInput(''); setTicket(null); setHistoryList([]); setError(''); }}
            className={`flex-1 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'history' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Passenger Trip History</span>
          </button>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            required
            placeholder={activeTab === 'ref' ? 'e.g. BK-XXXXXX' : 'Enter NIC or Phone Number'}
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 px-4 py-2 rounded-xl font-bold transition flex items-center justify-center text-xs"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </button>
        </form>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {cancelSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-3 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{cancelSuccess}</span>
          </div>
        )}

        {/* Single Ticket Display */}
        {ticket && (
          <div className="space-y-3 bg-slate-950 border border-dashed border-slate-700 rounded-xl p-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-emerald-400 text-sm">{ticket.bookingReference}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                ticket.status === 'CANCELLED' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                ticket.status === 'BOARDED' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {ticket.status}
              </span>
            </div>
            <div className="flex justify-between"><span className="text-slate-400">Passenger:</span><span className="text-white font-medium">{ticket.passengerName}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Route:</span><span className="text-white">{ticket.bus?.source} → {ticket.bus?.destination}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Boarding Point:</span><span className="text-emerald-400">📍 {ticket.boardingPoint}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Seats:</span><span className="text-white font-semibold">{ticket.selectedSeats?.join(', ')}</span></div>
            <div className="flex justify-between border-t border-slate-800 pt-2 font-bold text-sm">
              <span className="text-slate-400">Total Paid:</span>
              <span className="text-emerald-400">LKR {ticket.totalAmount?.toLocaleString()}</span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => downloadTicketPDF(ticket)}
                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-1.5 transition text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
              {ticket.status === 'CONFIRMED' && (
                <button
                  onClick={() => handleCancelTicket(ticket.bookingReference)}
                  disabled={cancelLoading}
                  className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-semibold transition"
                >
                  <Ban className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* History List Display */}
        {historyList.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Found {historyList.length} Booking(s)
            </h4>
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {historyList.map(item => (
                <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-emerald-400">{item.bookingReference}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'CANCELLED' ? 'bg-rose-500/20 text-rose-400' :
                      item.status === 'BOARDED' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="text-slate-300">
                    {item.bus?.source} → {item.bus?.destination} ({item.selectedSeats?.join(', ')})
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400 border-t border-slate-900 pt-1.5">
                    <span>LKR {item.totalAmount?.toLocaleString()}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadTicketPDF(item)}
                        className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Download className="w-3 h-3" /> PDF
                      </button>
                      {item.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleCancelTicket(item.bookingReference)}
                          className="text-rose-400 hover:underline font-semibold"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CheckTicketModal;