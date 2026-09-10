import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bus as BusIcon, Search, MapPin, ShieldCheck, Star, Map, 
  ArrowUpDown, Filter, Wifi, Armchair, ChevronRight 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { searchBusesAPI, getAllBusesAPI } from '../services/api';
import SeatLayout from '../components/SeatLayout';
import BookingModal from '../components/BookingModal';
import RouteMapModal from '../components/RouteMapModal';
import ReviewModal from '../components/ReviewModal';

const Home = () => {
  const { t } = useTranslation();
  const [buses, setBuses] = useState([]);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [isWsConnected, setIsWsConnected] = useState(false);

  // Filters & Sorting States
  const [selectedBusType, setSelectedBusType] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState('DEFAULT');

  // Modals & Selection States
  const [selectedBusForBooking, setSelectedBusForBooking] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeMapBus, setActiveMapBus] = useState(null);
  const [activeReviewBus, setActiveReviewBus] = useState(null);

  const fetchAllBuses = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await getAllBusesAPI();
      setBuses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBuses();

    // WebSocket STOMP Connection for Live Synchronization
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        setIsWsConnected(true);
        stompClient.subscribe('/topic/bus-updates', () => {
          fetchAllBuses(true);
        });
      },
      onDisconnect: () => {
        setIsWsConnected(false);
      }
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!source || !destination) {
      fetchAllBuses();
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const res = await searchBusesAPI(source.trim(), destination.trim());
      setBuses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBuses = useMemo(() => {
    return buses
      .filter((bus) => {
        if (selectedBusType !== 'ALL' && bus.busType !== selectedBusType) return false;
        if (bus.price > maxPrice) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'PRICE_LOW') return a.price - b.price;
        if (sortBy === 'RATING_HIGH') return (b.averageRating || 0) - (a.averageRating || 0);
        return 0;
      });
  }, [buses, selectedBusType, maxPrice, sortBy]);

  const handleProceedToBooking = (bus, seats) => {
    setSelectedBusForBooking(bus);
    setSelectedSeats(seats);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-slate-950 text-white pb-24">
      
      {/* Hero Header */}
      <div className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 px-6 pt-10 pb-12 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          
          <div className="inline-flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> {t('heroBadge')}
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 text-slate-300 rounded-full border border-slate-700 text-[11px] font-mono">
              <Wifi className={`w-3 h-3 ${isWsConnected ? 'text-emerald-400 animate-pulse' : 'text-rose-400'}`} />
              <span>{isWsConnected ? 'Live Real-Time Sync' : 'Reconnecting...'}</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            {t('heroTitle')} <span className="text-emerald-400">{t('heroTitleHighlight')}</span>
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-6 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3.5 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <MapPin className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder={t('fromPlaceholder')}
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex-1 relative">
              <MapPin className="w-4 h-4 text-rose-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder={t('toPlaceholder')}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold px-6 py-2 rounded-xl transition flex items-center justify-center gap-2 text-xs"
            >
              <Search className="w-4 h-4" />
              <span>{t('searchBtn')}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Advanced Filters & Sorting Controls */}
      <div className="max-w-6xl mx-auto px-6 mt-6">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs">
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-400">Class:</span>
            <select
              value={selectedBusType}
              onChange={(e) => setSelectedBusType(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="Luxury A/C">Luxury A/C</option>
              <option value="Super Luxury Volvo">Super Luxury Volvo</option>
              <option value="Semi-Luxury Express">Semi-Luxury Express</option>
              <option value="Super Luxury Sleeper">Super Luxury Sleeper</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Max Fare:</span>
            <input
              type="range"
              min="1000"
              max="5000"
              step="200"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="accent-emerald-500 cursor-pointer w-28"
            />
            <span className="text-emerald-400 font-bold font-mono">LKR {maxPrice}</span>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-400">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="DEFAULT">Recommended</option>
              <option value="PRICE_LOW">Price: Low to High</option>
              <option value="RATING_HIGH">Passenger Rating (⭐)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Buses List */}
      <div className="max-w-6xl mx-auto px-6 mt-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BusIcon className="w-5 h-5 text-emerald-400" />
            {t('availableRoutes')} ({filteredBuses.length})
          </h2>
          {searched && (
            <button onClick={() => { setSource(''); setDestination(''); setSearched(false); fetchAllBuses(); }} className="text-xs text-emerald-400 hover:underline">
              {t('showAll')}
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm">Loading available fleet...</div>
        ) : filteredBuses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredBuses.map((bus) => (
              <div key={bus.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-5 hover:border-slate-700 transition">
                
                {/* Header Card Info */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">{bus.busName}</h3>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md border border-slate-700 font-mono">
                        {bus.busNumber}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                        {bus.busType}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <button
                        onClick={() => setActiveReviewBus(bus)}
                        className="flex items-center gap-1 text-amber-400 hover:underline font-semibold"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{bus.averageRating || 4.8} / 5 ({bus.totalReviews || 12} {t('reviews')})</span>
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => setActiveMapBus(bus)}
                        className="flex items-center gap-1 text-emerald-400 hover:underline font-semibold"
                      >
                        <Map className="w-3.5 h-3.5" />
                        <span>{t('viewRouteMap')}</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-right flex md:flex-col items-baseline md:items-end justify-between w-full md:w-auto">
                    <span className="text-xs text-slate-400">{t('seatFare')}</span>
                    <span className="text-2xl font-black text-emerald-400">LKR {bus.price?.toLocaleString()}</span>
                  </div>
                </div>

                {/* Timing & Route Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-500 block uppercase font-bold text-[10px]">{t('departure')}</span>
                    <span className="text-white font-semibold text-sm">{bus.departureTime}</span>
                    <span className="text-slate-400 block">{bus.source}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-slate-400 font-medium">{bus.duration}</span>
                    <div className="w-full h-0.5 bg-slate-800 relative my-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 absolute left-1/2 -top-[3px] -translate-x-1/2"></div>
                    </div>
                    <span className="text-[10px] text-slate-500">{t('nonStop')}</span>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="text-slate-500 block uppercase font-bold text-[10px]">{t('arrival')}</span>
                    <span className="text-white font-semibold text-sm">{bus.arrivalTime}</span>
                    <span className="text-slate-400 block">{bus.destination}</span>
                  </div>
                </div>

                {/* Seat Selection Blueprint */}
                <SeatLayout
                  bus={bus}
                  onProceedToBooking={(seats) => handleProceedToBooking(bus, seats)}
                />

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-sm">
            No bus schedules matched your filters or search criteria.
          </div>
        )}
      </div>

      {/* Mobile Sticky Booking Action Ribbon */}
      {selectedSeats.length > 0 && selectedBusForBooking && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-3.5 shadow-2xl flex items-center justify-between max-w-xl mx-auto sm:rounded-t-2xl">
          <div>
            <div className="text-[11px] text-slate-400">
              <span className="text-emerald-400 font-bold">{selectedSeats.length}</span> Seats ({selectedSeats.join(', ')})
            </div>
            <div className="text-base font-extrabold text-white font-mono">
              LKR {(selectedBusForBooking.price * selectedSeats.length).toLocaleString()}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsBookingModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition"
          >
            <span>Proceed to Checkout</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modals */}
      {isBookingModalOpen && selectedBusForBooking && (
        <BookingModal
          bus={selectedBusForBooking}
          selectedSeats={selectedSeats}
          onClose={() => setIsBookingModalOpen(false)}
          onBookingSuccess={() => fetchAllBuses(true)}
        />
      )}

      {activeMapBus && (
        <RouteMapModal
          bus={activeMapBus}
          onClose={() => setActiveMapBus(null)}
        />
      )}

      {activeReviewBus && (
        <ReviewModal
          bus={activeReviewBus}
          onClose={() => setActiveReviewBus(null)}
          onReviewSubmitted={() => fetchAllBuses(true)}
        />
      )}

    </div>
  );
};

export default Home;