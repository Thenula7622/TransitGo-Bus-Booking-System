import React from 'react';
import { Bus, Star, Clock, MapPin, Navigation, MessageSquare } from 'lucide-react';

const BusCard = ({ bus, isSelected, onSelectBus, onOpenRouteMap, onOpenReview }) => {
  return (
    <div className={`bg-slate-900 border rounded-3xl p-5 transition-all shadow-xl ${
      isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-slate-800 hover:border-slate-700'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Bus Info */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="font-extrabold text-white text-base tracking-tight">{bus.busName}</span>
            <span className="text-[11px] font-mono bg-slate-950 border border-slate-700/80 px-2.5 py-0.5 rounded-lg text-emerald-400 font-bold">
              {bus.busNumber}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{bus.busType}</span>
            <span>•</span>
            <span className="text-slate-300 font-semibold">{bus.totalSeats} Total Seats</span>
            <span>•</span>
            
            {/* Rating & Review Button */}
            <button
              type="button"
              onClick={() => onOpenReview && onOpenReview(bus)}
              className="flex items-center gap-1 text-amber-400 hover:underline bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 font-bold text-[11px]"
              title="Rate this bus service"
            >
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{bus.averageRating || 4.8} ({bus.totalReviews || 12})</span>
            </button>
          </div>
        </div>

        {/* Schedule & Timing */}
        <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-850 p-3 rounded-2xl text-xs">
          <div>
            <div className="font-extrabold text-white">{bus.source}</div>
            <div className="text-[10px] text-emerald-400 font-mono font-semibold">{bus.departureTime}</div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 font-mono">{bus.duration}</span>
            <div className="w-12 h-px bg-slate-700 my-1"></div>
            <span className="text-[9px] text-slate-400">Highway</span>
          </div>

          <div>
            <div className="font-extrabold text-white">{bus.destination}</div>
            <div className="text-[10px] text-slate-400 font-mono font-semibold">{bus.arrivalTime}</div>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
          <div className="sm:text-right">
            <span className="text-[10px] text-slate-400 block font-semibold">Standard Fare</span>
            <span className="text-base font-black text-white font-mono text-emerald-400">
              LKR {bus.price?.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenRouteMap && onOpenRouteMap(bus)}
              className="p-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-2xl transition border border-slate-800"
              title="View GPS Track"
            >
              <Navigation className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onSelectBus(bus)}
              className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs transition shadow-lg ${
                isSelected
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              {isSelected ? 'Close Seats' : 'View Seats'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BusCard;