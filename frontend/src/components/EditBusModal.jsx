import React, { useState } from 'react';
import { X, Edit3, Save, AlertTriangle } from 'lucide-react';
import { updateBusAPI } from '../services/api';

const EditBusModal = ({ bus, onClose, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    busName: bus.busName || '',
    busNumber: bus.busNumber || '',
    busType: bus.busType || 'Luxury A/C',
    source: bus.source || '',
    destination: bus.destination || '',
    departureTime: bus.departureTime || '',
    arrivalTime: bus.arrivalTime || '',
    duration: bus.duration || '',
    price: bus.price || 0,
    totalSeats: bus.totalSeats || 49,
    boardingPoints: bus.boardingPoints ? bus.boardingPoints.join(', ') : '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        totalSeats: Number(formData.totalSeats),
        boardingPoints: formData.boardingPoints
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean),
      };

      await updateBusAPI(bus.id, payload);
      if (onUpdateSuccess) onUpdateSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update bus details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Edit Bus Schedule</h3>
              <p className="text-[11px] text-slate-400">{bus.busName} ({bus.busNumber})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs text-white max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-2.5 rounded-xl flex items-center gap-2 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Bus Name</label>
              <input
                type="text"
                required
                value={formData.busName}
                onChange={(e) => setFormData({ ...formData, busName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Bus Number</label>
              <input
                type="text"
                required
                value={formData.busNumber}
                onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Category</label>
              <select
                value={formData.busType}
                onChange={(e) => setFormData({ ...formData, busType: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Luxury A/C">Luxury A/C</option>
                <option value="Super Luxury Volvo">Super Luxury Volvo</option>
                <option value="Semi-Luxury Express">Semi-Luxury Express</option>
                <option value="Super Luxury Sleeper">Super Luxury Sleeper</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Seat Fare (LKR)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Source</label>
              <input
                type="text"
                required
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Destination</label>
              <input
                type="text"
                required
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Departure</label>
              <input
                type="text"
                required
                placeholder="06:30 AM"
                value={formData.departureTime}
                onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Arrival</label>
              <input
                type="text"
                required
                placeholder="09:45 AM"
                value={formData.arrivalTime}
                onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Duration</label>
              <input
                type="text"
                required
                placeholder="3h 15m"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Boarding Points (Comma separated)</label>
            <input
              type="text"
              placeholder="Terminal 1, Interchange, City Halt"
              value={formData.boardingPoints}
              onChange={(e) => setFormData({ ...formData, boardingPoints: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:opacity-50 text-slate-950 font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving Changes...' : 'Save & Update Bus'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default EditBusModal;