import React, { useState } from 'react';
import { 
  X, Bus, Star, MapPin, Clock, ShieldCheck, Sparkles, 
  ArrowRight, Filter, Search, Layers, Navigation 
} from 'lucide-react';

const FleetExplorerModal = ({ buses, onClose, onSelectBusForBooking, onOpenRouteMap }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');

  // Filter buses based on query and type
  const filteredBuses = (buses || []).filter((bus) => {
    const matchesQuery = 
      bus.busName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.destination.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = 
      selectedType === 'ALL' || 
      (selectedType === 'VOLVO' && bus.busType.toLowerCase().includes('volvo')) ||
      (selectedType === 'SLEEPER' && bus.busType.toLowerCase().includes('sleeper')) ||
      (selectedType === 'AC' && bus.busType.toLowerCase().includes('luxury'));

    return matchesQuery && matchesType;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-950 p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  National Express Network & Fleet Directory
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                  {buses.length} Active Corridors
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Explore available luxury coaches, expressways, and scenic highway schedules across Sri Lanka
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="self-end sm:self-auto p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition border border-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-col sm:flex-row items-center gap-3">
          
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search by Bus Name (e.g. Super Line), Route (Colombo, Jaffna) or Bus No..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
            <button
              onClick={() => setSelectedType('ALL')}
              className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
                selectedType === 'ALL' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Buses
            </button>
            <button
              onClick={() => setSelectedType('VOLVO')}
              className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
                selectedType === 'VOLVO' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Super Volvo
            </button>
            <button
              onClick={() => setSelectedType('SLEEPER')}
              className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
                selectedType === 'SLEEPER' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Night Sleepers
            </button>
            <button
              onClick={() => setSelectedType('AC')}
              className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
                selectedType === 'AC' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Luxury A/C
            </button>
          </div>

        </div>

        {/* Directory Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {filteredBuses.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              No matching buses or routes found for "{searchQuery}".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBuses.map((bus) => (
                <div 
                  key={bus.id} 
                  className="bg-slate-950 border border-slate-800/90 rounded-2xl p-4 sm:p-5 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4 shadow-lg group"
                >
                  
                  {/* Top Bus Info & Class */}
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm group-hover:text-emerald-400 transition">
                          {bus.busName}
                        </span>
                        <span className="text-[10px] font-mono bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-md text-emerald-300">
                          {bus.busNumber}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {bus.busType} • {bus.totalSeats} Reclining Seats
                      </span>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{bus.averageRating || 4.8}</span>
                    </div>
                  </div>

                  {/* Route & Timings */}
                  <div className="bg-slate-900/70 rounded-xl p-3 border border-slate-850 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-extrabold text-white">{bus.source}</div>
                      <div className="text-[10px] text-emerald-400 font-mono">{bus.departureTime}</div>
                    </div>

                    <div className="flex flex-col items-center px-2">
                      <span className="text-[9px] text-slate-500 font-mono">{bus.duration}</span>
                      <div className="w-16 h-px bg-slate-700 relative my-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute right-0 -top-0.5"></div>
                      </div>
                      <span className="text-[9px] text-slate-400">Direct Express</span>
                    </div>

                    <div className="text-right">
                      <div className="font-extrabold text-white">{bus.destination}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{bus.arrivalTime}</div>
                    </div>
                  </div>

                  {/* Intermediate Halts snippet */}
                  {bus.routeHalts && bus.routeHalts.length > 0 && (
                    <div className="text-[10px] text-slate-400 truncate">
                      <span className="text-slate-500 font-semibold">Corridor Halts: </span>
                      {bus.routeHalts.map((h) => h.haltName).join(' ➔ ')}
                    </div>
                  )}

                  {/* Footer & Actions */}
                  <div className="flex items-center justify-between border-t border-slate-900 pt-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Standard Fare</span>
                      <span className="text-sm font-extrabold text-white font-mono text-emerald-400">
                        LKR {bus.price?.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          if (onOpenRouteMap) onOpenRouteMap(bus);
                        }}
                        className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition border border-slate-800"
                        title="View Live GPS Route"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          if (onSelectBusForBooking) onSelectBusForBooking(bus);
                        }}
                        className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                      >
                        <span>Select Bus</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default FleetExplorerModal;