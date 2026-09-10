import React, { useState, useEffect } from 'react';
import { 
  Bus, Search, Shield, ArrowUpDown, Clock, MapPin, 
  Star, ChevronRight, PhoneCall, Sparkles, Filter, Navigation, 
  Repeat, ArrowRight, Layers 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import BusCard from './components/BusCard';
import SeatLayout from './components/SeatLayout';
import BookingModal from './components/BookingModal';
import RoundTripBookingModal from './components/RoundTripBookingModal';
import AdminDashboard from './pages/AdminDashboard';
import AdminAuthModal from './components/AdminAuthModal';
import CheckTicketModal from './components/CheckTicketModal';
import ConductorScannerModal from './components/ConductorScannerModal';
import RouteMapModal from './components/RouteMapModal';
import ContactModal from './components/ContactModal';
import FleetExplorerModal from './components/FleetExplorerModal';
import ReviewModal from './components/ReviewModal';
import SosModal from './components/SosModal';
import Footer from './components/Footer';
import { getAllBusesAPI, searchBusesAPI, getNetworkTownsAPI } from './services/api';
import { connectWebSocket, subscribeToBusUpdates } from './services/websocket';

function App() {
  const { t } = useTranslation();

  const [currentView, setCurrentView] = useState('HOME');
  const [tripType, setTripType] = useState('ONE_WAY');
  const [source, setSource] = useState('Colombo');
  const [destination, setDestination] = useState('Kandy');
  const [availableTowns, setAvailableTowns] = useState([
    'Colombo', 'Kadawatha', 'Kegalle', 'Mawanella', 'Peradeniya', 'Kandy', 
    'Kurunegala', 'Anuradhapura', 'Vavuniya', 'Kilinochchi', 'Jaffna', 
    'Galle', 'Matara', 'Ratnapura', 'Ella'
  ]);
  
  const [buses, setBuses] = useState([]);
  const [allNetworkBuses, setAllNetworkBuses] = useState([]);
  const [returnBuses, setReturnBuses] = useState([]);
  const [loading, setLoading] = useState(false);

  // One-Way State
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Round-Trip State
  const [selectedOutboundBus, setSelectedOutboundBus] = useState(null);
  const [selectedOutboundSeats, setSelectedOutboundSeats] = useState([]);
  const [selectedReturnBus, setSelectedReturnBus] = useState(null);
  const [selectedReturnSeats, setSelectedReturnSeats] = useState([]);
  const [roundTripStep, setRoundTripStep] = useState('SELECT_OUTBOUND');
  const [showRoundTripModal, setShowRoundTripModal] = useState(false);

  // Auxiliary Modals
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [showCheckTicket, setShowCheckTicket] = useState(false);
  const [showConductorScanner, setShowConductorScanner] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showFleetExplorer, setShowFleetExplorer] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);
  const [reviewingBus, setReviewingBus] = useState(null);
  const [activeRouteMapBus, setActiveRouteMapBus] = useState(null);

  const fetchTowns = async () => {
    try {
      const res = await getNetworkTownsAPI();
      if (Array.isArray(res.data) && res.data.length > 0) {
        setAvailableTowns(res.data);
      }
    } catch (e) {
      console.warn("Using fallback town list");
    }
  };

  const fetchBuses = async () => {
    setLoading(true);
    try {
      const allRes = await getAllBusesAPI();
      const fullList = Array.isArray(allRes.data) ? allRes.data : [];
      setAllNetworkBuses(fullList);

      if (source && destination) {
        const res = await searchBusesAPI(source, destination);
        setBuses(Array.isArray(res.data) ? res.data : []);

        const retRes = await searchBusesAPI(destination, source);
        setReturnBuses(Array.isArray(retRes.data) ? retRes.data : []);
      } else {
        setBuses(fullList);
        setReturnBuses([]);
      }
    } catch (err) {
      setBuses([]);
      setReturnBuses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTowns();
    fetchBuses();

    connectWebSocket(() => {
      subscribeToBusUpdates(() => {
        fetchBuses();
      });
    });
  }, [tripType]);

  const handleSwapLocations = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSelectedBus(null);
    setSelectedSeats([]);
    setSelectedOutboundBus(null);
    setSelectedOutboundSeats([]);
    setSelectedReturnBus(null);
    setSelectedReturnSeats([]);
    setRoundTripStep('SELECT_OUTBOUND');
    fetchBuses();
  };

  const handleTripTypeChange = (type) => {
    setTripType(type);
    setSelectedBus(null);
    setSelectedSeats([]);
    setSelectedOutboundBus(null);
    setSelectedOutboundSeats([]);
    setSelectedReturnBus(null);
    setSelectedReturnSeats([]);
    setRoundTripStep('SELECT_OUTBOUND');
  };

  const handleSelectFromExplorer = (bus) => {
    setSource(bus.source);
    setDestination(bus.destination);
    setSelectedBus(bus);
    setSelectedSeats([]);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  if (currentView === 'ADMIN') {
    return (
      <AdminDashboard
        onBackToHome={() => setCurrentView('HOME')}
        onUpdate={() => fetchBuses()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      
      <Navbar
        onOpenAdmin={() => setShowAdminAuth(true)}
        onOpenCheckTicket={() => setShowCheckTicket(true)}
        onOpenConductorScanner={() => setShowConductorScanner(true)}
        onOpenContact={() => setShowContactModal(true)}
        onOpenFleetExplorer={() => setShowFleetExplorer(true)}
        onOpenSos={() => setShowSosModal(true)}
      />

      {/* Hero Search Section */}
      <div className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 py-10 sm:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_50%)] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('brand_sub')}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              {t('hero_title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {t('hero_desc')}
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-3xl shadow-2xl backdrop-blur-md max-w-4xl mx-auto space-y-4">
            
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleTripTypeChange('ONE_WAY')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                  tripType === 'ONE_WAY'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {t('one_way')}
              </button>

              <button
                type="button"
                onClick={() => handleTripTypeChange('ROUND_TRIP')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                  tripType === 'ROUND_TRIP'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>{t('round_trip')}</span>
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              
              <div className="sm:col-span-5 relative">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  {t('from_town')}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                  <input
                    list="towns-source"
                    type="text"
                    required
                    placeholder="Kadawatha, Colombo..."
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                  <datalist id="towns-source">
                    {availableTowns.map((town) => (
                      <option key={`src-${town}`} value={town} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="sm:col-span-2 flex justify-center sm:pt-4">
                <button
                  type="button"
                  onClick={handleSwapLocations}
                  className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition active:rotate-180 duration-200 border border-slate-700"
                  title="Swap"
                >
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </div>

              <div className="sm:col-span-5 relative">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  {t('to_town')}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-rose-400 absolute left-3 top-3" />
                  <input
                    list="towns-dest"
                    type="text"
                    required
                    placeholder="Peradeniya, Kandy..."
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                  <datalist id="towns-dest">
                    {availableTowns.map((town) => (
                      <option key={`dest-${town}`} value={town} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="sm:col-span-12 pt-2">
                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.99] text-slate-950 font-extrabold py-3 rounded-2xl transition shadow-lg shadow-emerald-500/20 text-xs flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>{t('search_btn')}</span>
                </button>
              </div>

            </form>

          </div>

        </div>
      </div>

      {/* Main Results Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        
        {tripType === 'ONE_WAY' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">{t('available_buses')}</h2>
                <p className="text-xs text-slate-400">
                  Travelling from <strong className="text-emerald-400">{source}</strong> ➔ <strong className="text-emerald-400">{destination}</strong>
                </p>
              </div>
              <span className="text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl text-slate-300">
                {buses.length} {t('schedules_found')}
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-xs text-slate-400">Searching network corridor schedules...</div>
            ) : buses.length === 0 ? (
              <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 text-center space-y-2">
                <p className="text-sm font-semibold text-slate-300">{t('no_buses')}</p>
                <button
                  onClick={() => setShowFleetExplorer(true)}
                  className="mt-2 text-xs text-emerald-400 hover:underline font-bold"
                >
                  Explore All Available National Corridors & Fleet →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {buses.map((bus) => (
                  <div key={bus.id} className="space-y-4">
                    <BusCard
                      bus={bus}
                      isSelected={selectedBus?.id === bus.id}
                      onSelectBus={(b) => {
                        if (selectedBus?.id === b.id) {
                          setSelectedBus(null);
                        } else {
                          setSelectedBus(b);
                          setSelectedSeats([]);
                        }
                      }}
                      onOpenRouteMap={(b) => setActiveRouteMapBus(b)}
                      onOpenReview={(b) => setReviewingBus(b)}
                    />

                    {selectedBus?.id === bus.id && (
                      <div className="bg-slate-950/80 border border-emerald-500/30 rounded-3xl p-5 shadow-2xl space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                          <h3 className="text-sm font-bold text-white">{t('book_seats')}</h3>
                        </div>
                        <SeatLayout
                          bus={selectedBus}
                          onProceedToBooking={(seats) => {
                            setSelectedSeats(seats);
                            setShowBookingModal(true);
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tripType === 'ROUND_TRIP' && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRoundTripStep('SELECT_OUTBOUND')}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
                    roundTripStep === 'SELECT_OUTBOUND'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {t('step_outbound')}: {source} ➔ {destination}
                </button>
                <ArrowRight className="w-4 h-4 text-slate-600" />
                <button
                  type="button"
                  onClick={() => {
                    if (selectedOutboundSeats.length > 0) setRoundTripStep('SELECT_RETURN');
                  }}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
                    roundTripStep === 'SELECT_RETURN'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {t('step_return')}: {destination} ➔ {source}
                </button>
              </div>

              {selectedOutboundBus && selectedOutboundSeats.length > 0 && selectedReturnBus && selectedReturnSeats.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowRoundTripModal(true)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold px-5 py-2 rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
                >
                  <Repeat className="w-3.5 h-3.5" />
                  <span>{t('double_checkout')}</span>
                </button>
              )}
            </div>

            {roundTripStep === 'SELECT_OUTBOUND' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-emerald-400">{t('step_outbound')}: {source} ➔ {destination}</h3>
                {buses.map((bus) => (
                  <div key={bus.id} className="space-y-3">
                    <BusCard
                      bus={bus}
                      isSelected={selectedOutboundBus?.id === bus.id}
                      onSelectBus={(b) => setSelectedOutboundBus(b)}
                      onOpenRouteMap={(b) => setActiveRouteMapBus(b)}
                      onOpenReview={(b) => setReviewingBus(b)}
                    />
                    {selectedOutboundBus?.id === bus.id && (
                      <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/30">
                        <SeatLayout
                          bus={selectedOutboundBus}
                          onProceedToBooking={(seats) => {
                            setSelectedOutboundSeats(seats);
                            setRoundTripStep('SELECT_RETURN');
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {roundTripStep === 'SELECT_RETURN' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-amber-400">{t('step_return')}: {destination} ➔ {source}</h3>
                  <button
                    type="button"
                    onClick={() => setRoundTripStep('SELECT_OUTBOUND')}
                    className="text-xs text-slate-400 hover:text-white underline"
                  >
                    ← Change Outbound
                  </button>
                </div>

                {returnBuses.map((bus) => (
                  <div key={bus.id} className="space-y-3">
                    <BusCard
                      bus={bus}
                      isSelected={selectedReturnBus?.id === bus.id}
                      onSelectBus={(b) => setSelectedReturnBus(b)}
                      onOpenRouteMap={(b) => setActiveRouteMapBus(b)}
                      onOpenReview={(b) => setReviewingBus(b)}
                    />
                    {selectedReturnBus?.id === bus.id && (
                      <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30">
                        <SeatLayout
                          bus={selectedReturnBus}
                          onProceedToBooking={(seats) => {
                            setSelectedReturnSeats(seats);
                            setShowRoundTripModal(true);
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      <Footer onOpenContact={() => setShowContactModal(true)} />

      {/* ALL MODALS */}
      {showFleetExplorer && (
        <FleetExplorerModal
          buses={allNetworkBuses}
          onClose={() => setShowFleetExplorer(false)}
          onSelectBusForBooking={(bus) => handleSelectFromExplorer(bus)}
          onOpenRouteMap={(bus) => setActiveRouteMapBus(bus)}
        />
      )}

      {reviewingBus && (
        <ReviewModal
          bus={reviewingBus}
          onClose={() => setReviewingBus(null)}
          onReviewSubmitted={() => fetchBuses()}
        />
      )}

      {showSosModal && (
        <SosModal onClose={() => setShowSosModal(false)} />
      )}

      {showBookingModal && selectedBus && (
        <BookingModal
          bus={selectedBus}
          selectedSeats={selectedSeats}
          onClose={() => setShowBookingModal(false)}
          onBookingSuccess={() => {
            fetchBuses();
            setSelectedSeats([]);
          }}
        />
      )}

      {showRoundTripModal && selectedOutboundBus && selectedReturnBus && (
        <RoundTripBookingModal
          outboundBus={selectedOutboundBus}
          outboundSeats={selectedOutboundSeats}
          returnBus={selectedReturnBus}
          returnSeats={selectedReturnSeats}
          onClose={() => setShowRoundTripModal(false)}
          onSuccess={() => {
            fetchBuses();
            setShowRoundTripModal(false);
          }}
        />
      )}

      {showAdminAuth && (
        <AdminAuthModal
          onClose={() => setShowAdminAuth(false)}
          onSuccess={() => {
            setShowAdminAuth(false);
            setCurrentView('ADMIN');
          }}
        />
      )}

      {showCheckTicket && <CheckTicketModal onClose={() => setShowCheckTicket(false)} onUpdate={() => fetchBuses()} />}
      {showConductorScanner && <ConductorScannerModal onClose={() => setShowConductorScanner(false)} onUpdate={() => fetchBuses()} />}
      {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}

      {activeRouteMapBus && (
        <RouteMapModal bus={activeRouteMapBus} onClose={() => setActiveRouteMapBus(null)} />
      )}

    </div>
  );
}

export default App;