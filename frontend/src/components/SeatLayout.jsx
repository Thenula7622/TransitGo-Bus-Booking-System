import React, { useState } from 'react';
import { Armchair, Check, AlertCircle, LogIn, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { playSeatSelectSound, playErrorSound } from '../utils/soundEffects';

const SeatLayout = ({ bus, onProceedToBooking }) => {
  const { t } = useTranslation();
  const [selectedSeats, setSelectedSeats] = useState([]);

  const bookedSeats = bus.bookedSeats || [];
  const heldSeats = bus.heldSeats || {};
  const totalSeats = bus.totalSeats || 49;
  const isSleeper = bus.busType === 'Super Luxury Sleeper';

  const rows = Math.floor((totalSeats - 5) / 4);

  const toggleSeat = (seatNumber) => {
    // If seat is confirmed booked
    if (bookedSeats.includes(seatNumber)) {
      playErrorSound();
      return;
    }

    // If seat is held by someone else
    if (heldSeats[seatNumber] && !selectedSeats.includes(seatNumber)) {
      playErrorSound();
      alert("This seat is currently held by another passenger in checkout!");
      return;
    }

    playSeatSelectSound();

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
    } else {
      if (selectedSeats.length >= 6) {
        alert("Maximum 6 seats can be selected per booking.");
        return;
      }
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const renderSeat = (seatNumber, isPriority = false) => {
    const isBooked = bookedSeats.includes(seatNumber);
    const isHeld = heldSeats[seatNumber] && !selectedSeats.includes(seatNumber);
    const isSelected = selectedSeats.includes(seatNumber);

    let seatClasses = "w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-xs transition duration-200 shadow-sm ";

    if (isBooked) {
      seatClasses += "bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-50";
    } else if (isHeld) {
      seatClasses += "bg-amber-500/20 text-amber-400 border border-amber-500/40 cursor-not-allowed animate-pulse";
    } else if (isSelected) {
      seatClasses += "bg-emerald-500 text-slate-950 border border-emerald-400 shadow-lg shadow-emerald-500/30 scale-105";
    } else if (isPriority) {
      seatClasses += "bg-slate-900 text-amber-300 border border-amber-500/40 hover:bg-slate-800 hover:border-amber-400";
    } else {
      seatClasses += "bg-slate-900 text-slate-300 border border-slate-700/80 hover:bg-slate-800 hover:border-emerald-500";
    }

    return (
      <button
        key={seatNumber}
        type="button"
        disabled={isBooked || isHeld}
        onClick={() => toggleSeat(seatNumber)}
        className={seatClasses}
        title={
          isBooked
            ? `Seat ${seatNumber} (Booked)`
            : isHeld
            ? `Seat ${seatNumber} (Temporarily Held in Checkout)`
            : isPriority
            ? `Seat ${seatNumber} (Front Priority Seat)`
            : `Seat ${seatNumber} (Available)`
        }
      >
        {isBooked ? (
          <span className="text-[10px] line-through">{seatNumber}</span>
        ) : isHeld ? (
          <Lock className="w-3.5 h-3.5 text-amber-400" />
        ) : isSelected ? (
          <Check className="w-4 h-4 stroke-[3]" />
        ) : (
          seatNumber
        )}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-slate-900 border border-slate-700"></div>
          <span className="text-slate-400">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-emerald-500"></div>
          <span className="text-emerald-400">Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-amber-500/20 border border-amber-500/40"></div>
          <span className="text-amber-400">Locked (Held)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-slate-800 border border-slate-700"></div>
          <span className="text-slate-500">Booked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-slate-900 border border-amber-500/40 text-amber-300"></div>
          <span className="text-amber-300">Priority (Front)</span>
        </div>
      </div>

      {/* Bus Realistic Chassis */}
      <div className="max-w-xs sm:max-w-sm mx-auto bg-slate-900 border-2 border-slate-700/80 rounded-t-[40px] rounded-b-2xl p-5 shadow-2xl relative">
        
        {/* Windshield & Cockpit */}
        <div className="border-b border-slate-800 pb-4 mb-4">
          <div className="h-4 bg-emerald-500/10 border border-emerald-500/30 rounded-t-2xl mb-3 flex items-center justify-center">
            <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest">FRONT / WINDSHIELD</span>
          </div>

          <div className="flex justify-between items-center px-2">
            {/* Passenger Entry Door */}
            <div className="flex items-center gap-1 text-[11px] font-mono font-semibold px-2.5 py-1 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 rounded-lg">
              <LogIn className="w-3.5 h-3.5" />
              <span>ENTRY DOOR</span>
            </div>

            {/* Driver Cockpit */}
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-amber-400/40 flex items-center justify-center text-[10px] font-mono font-bold text-amber-400 shadow-inner">
              🛞 Driver
            </div>
          </div>
        </div>

        {/* 2x2 Main Cabin Grid */}
        <div className="space-y-2.5">
          {Array.from({ length: rows }).map((_, index) => {
            const r = index + 1;
            const isFrontRow = r === 1;

            return (
              <div key={r} className="flex justify-between items-center">
                {/* Left Window & Aisle Pair */}
                <div className="flex gap-2">
                  {renderSeat(`${r}A`, isFrontRow)}
                  {renderSeat(`${r}B`, isFrontRow)}
                </div>

                {/* Central Aisle */}
                <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest px-1 select-none">
                  AISLE
                </div>

                {/* Right Aisle & Window Pair */}
                <div className="flex gap-2">
                  {renderSeat(`${r}C`, isFrontRow)}
                  {renderSeat(`${r}D`, isFrontRow)}
                </div>
              </div>
            );
          })}

          {/* 5-Seat Rear Bench */}
          <div className="pt-2 border-t border-slate-800">
            <div className="text-[9px] font-mono text-slate-500 text-center uppercase tracking-wider mb-2 select-none">
              REAR BENCH
            </div>
            <div className="flex justify-between gap-1 sm:gap-1.5">
              {renderSeat(`${rows + 1}A`)}
              {renderSeat(`${rows + 1}B`)}
              {renderSeat(`${rows + 1}C`)}
              {renderSeat(`${rows + 1}D`)}
              {renderSeat(`${rows + 1}E`)}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Action Panel */}
      {selectedSeats.length > 0 && (
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl mx-auto shadow-xl">
          <div className="text-center sm:text-left">
            <div className="text-xs text-slate-400">
              Selected: <span className="text-emerald-400 font-bold font-mono">{selectedSeats.join(', ')}</span> ({selectedSeats.length} {selectedSeats.length > 1 ? 'Seats' : 'Seat'})
            </div>
            <div className="text-lg font-extrabold text-white">
              Total Fare: <span className="text-emerald-400 font-mono">LKR {(bus.price * selectedSeats.length).toLocaleString()}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onProceedToBooking(selectedSeats)}
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/20 text-xs flex items-center justify-center gap-2"
          >
            <Armchair className="w-4 h-4" />
            <span>{t('bookNow')}</span>
          </button>
        </div>
      )}

    </div>
  );
};

export default SeatLayout;