import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Plus, Trash2, Edit3, Navigation, Tag, Users, Bus as BusIcon, 
  MapPin, Clock, CheckCircle, Radio, Sparkles, RefreshCw, Save, Play, Square, FastForward 
} from 'lucide-react';
import { 
  getAllBusesAPI, addBusAPI, updateBusAPI, deleteBusAPI, 
  getAllBookingsAPI, getAllPromoCodesAPI, createPromoCodeAPI, updateBusLocationAPI 
} from '../services/api';

// Pre-calculated Sri Lankan Waypoints for Highway Corridors
const ROUTE_WAYPOINTS = {
  KANDY_ROUTE: [
    { name: 'Colombo Bastian Mawatha', lat: 6.9344, lng: 79.8543, status: 'DEPARTED_ORIGIN' },
    { name: 'Kadawatha Highway Interchange', lat: 7.0016, lng: 79.9542, status: 'ON_SCHEDULE' },
    { name: 'Nittambuwa Town', lat: 7.1444, lng: 80.1006, status: 'ON_SCHEDULE' },
    { name: 'Warakapola Junction', lat: 7.2241, lng: 80.1983, status: 'MODERATE_TRAFFIC' },
    { name: 'Kegalle Clock Tower', lat: 7.2514, lng: 80.3464, status: 'HALT_BOARDING' },
    { name: 'Mawanella Town', lat: 7.2536, lng: 80.4461, status: 'CLIMBING_GRADIENT' },
    { name: 'Peradeniya Junction', lat: 7.2600, lng: 80.5960, status: 'APPROACHING_DEST' },
    { name: 'Kandy Goodshed Terminal', lat: 7.2906, lng: 80.6337, status: 'TRIP_COMPLETED' }
  ],
  SOUTHERN_ROUTE: [
    { name: 'Makumbura Multi-Modal', lat: 6.8402, lng: 79.9984, status: 'DEPARTED_ORIGIN' },
    { name: 'Dodangoda Exit (E01)', lat: 6.5861, lng: 80.0573, status: 'CRUISING_EXPRESSWAY' },
    { name: 'Kurundugahahetekma Exit', lat: 6.3262, lng: 80.1412, status: 'CRUISING_EXPRESSWAY' },
    { name: 'Pinnaduwa (Galle Exit)', lat: 6.0645, lng: 80.2523, status: 'APPROACHING_GALLE' },
    { name: 'Matara Kotuwegoda Stand', lat: 5.9496, lng: 80.5469, status: 'TRIP_COMPLETED' }
  ],
  JAFFNA_ROUTE: [
    { name: 'Colombo Central', lat: 6.9344, lng: 79.8543, status: 'DEPARTED_ORIGIN' },
    { name: 'Kurunegala Main Stand', lat: 7.4863, lng: 80.3623, status: 'HALT_REFRESHMENT' },
    { name: 'Anuradhapura Old Stand', lat: 8.3114, lng: 80.4037, status: 'ON_SCHEDULE' },
    { name: 'Vavuniya Bus Stand', lat: 8.7514, lng: 80.4971, status: 'ON_SCHEDULE' },
    { name: 'Kilinochchi Town', lat: 9.3803, lng: 80.3992, status: 'APPROACHING_NORTH' },
    { name: 'Jaffna Central Terminal', lat: 9.6615, lng: 80.0255, status: 'TRIP_COMPLETED' }
  ]
};

const AdminDashboard = ({ onBackToHome, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('FLEET');
  const [buses, setBuses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Bus Form State
  const [editingBusId, setEditingBusId] = useState(null);
  const [busName, setBusName] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [busType, setBusType] = useState('Luxury A/C');
  const [source, setSource] = useState('Colombo');
  const [destination, setDestination] = useState('Kandy');
  const [departureTime, setDepartureTime] = useState('06:30 AM');
  const [arrivalTime, setArrivalTime] = useState('09:45 AM');
  const [duration, setDuration] = useState('3h 15m');
  const [price, setPrice] = useState(1850);
  const [totalSeats, setTotalSeats] = useState(49);
  const [boardingPointsStr, setBoardingPointsStr] = useState('Bastian Mawatha, Kadawatha Interchange');

  // Promo Code Form State
  const [promoCode, setPromoCode] = useState('');
  const [promoDesc, setPromoDesc] = useState('');
  const [promoDiscountPct, setPromoDiscountPct] = useState(15);
  const [promoMinAmount, setPromoMinAmount] = useState(1500);

  // GPS Telemetry State & Auto-Pilot Simulation
  const [selectedGpsBusId, setSelectedGpsBusId] = useState('');
  const [simLat, setSimLat] = useState('6.9344');
  const [simLng, setSimLng] = useState('79.8543');
  const [simStatus, setSimStatus] = useState('ON_SCHEDULE');
  const [gpsSuccessMsg, setGpsSuccessMsg] = useState('');
  const [isAutoSimulating, setIsAutoSimulating] = useState(false);
  const [simStepIndex, setSimStepIndex] = useState(0);
  
  const simulationIntervalRef = useRef(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const busRes = await getAllBusesAPI();
      const busList = Array.isArray(busRes.data) ? busRes.data : [];
      setBuses(busList);
      if (busList.length > 0 && !selectedGpsBusId) {
        setSelectedGpsBusId(busList[0].id.toString());
      }
    } catch (e) {
      console.warn("Buses load error:", e);
    }

    try {
      const bookRes = await getAllBookingsAPI();
      setBookings(Array.isArray(bookRes.data) ? bookRes.data : []);
    } catch (e) {
      console.warn("Bookings load error:", e);
    }

    try {
      const promoRes = await getAllPromoCodesAPI();
      setPromoCodes(Array.isArray(promoRes.data) ? promoRes.data : []);
    } catch (e) {
      console.warn("Promos load error:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    return () => {
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
    };
  }, []);

  const handleEditClick = (bus) => {
    setEditingBusId(bus.id);
    setBusName(bus.busName);
    setBusNumber(bus.busNumber);
    setBusType(bus.busType);
    setSource(bus.source);
    setDestination(bus.destination);
    setDepartureTime(bus.departureTime);
    setArrivalTime(bus.arrivalTime);
    setDuration(bus.duration);
    setPrice(bus.price);
    setTotalSeats(bus.totalSeats);
    setBoardingPointsStr((bus.boardingPoints || []).join(', '));
  };

  const handleCancelEdit = () => {
    setEditingBusId(null);
    setBusName('');
    setBusNumber('');
    setPrice(1850);
  };

  const handleBusSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      busName,
      busNumber,
      busType,
      source,
      destination,
      departureTime,
      arrivalTime,
      duration,
      price: Number(price),
      totalSeats: Number(totalSeats),
      boardingPoints: boardingPointsStr.split(',').map((s) => s.trim()).filter(Boolean)
    };

    try {
      if (editingBusId) {
        await updateBusAPI(editingBusId, payload);
      } else {
        await addBusAPI(payload);
      }
      handleCancelEdit();
      loadData();
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDeleteBus = async (id) => {
    if (!window.confirm('Delete this bus schedule from network?')) return;
    try {
      await deleteBusAPI(id);
      loadData();
      if (onUpdate) onUpdate();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleCreatePromo = async (e) => {
    e.preventDefault();
    try {
      await createPromoCodeAPI({
        code: promoCode.toUpperCase(),
        description: promoDesc,
        discountPercentage: Number(promoDiscountPct),
        minBookingAmount: Number(promoMinAmount),
        active: true
      });
      setPromoCode('');
      setPromoDesc('');
      loadData();
    } catch (err) {
      alert('Failed to create promo code');
    }
  };

  const handleBroadcastGps = async (customLat, customLng, customStatus) => {
    if (!selectedGpsBusId) return;
    const latToSend = customLat || parseFloat(simLat);
    const lngToSend = customLng || parseFloat(simLng);
    const statusToSend = customStatus || simStatus;

    try {
      await updateBusLocationAPI(selectedGpsBusId, latToSend, lngToSend, statusToSend);
      setGpsSuccessMsg(`Telemetry broadcasted: [${latToSend}, ${lngToSend}] (${statusToSend})`);
      setTimeout(() => setGpsSuccessMsg(''), 3000);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('GPS broadcast error:', err);
    }
  };

  // Preset Location Click
  const handleSelectPreset = (point) => {
    setSimLat(point.lat.toString());
    setSimLng(point.lng.toString());
    setSimStatus(point.status);
    handleBroadcastGps(point.lat, point.lng, point.status);
  };

  // Start / Stop Auto Simulation
  const toggleAutoSimulation = () => {
    if (isAutoSimulating) {
      clearInterval(simulationIntervalRef.current);
      setIsAutoSimulating(false);
      return;
    }

    setIsAutoSimulating(true);
    let step = 0;
    const waypoints = ROUTE_WAYPOINTS.KANDY_ROUTE;

    simulationIntervalRef.current = setInterval(() => {
      const point = waypoints[step % waypoints.length];
      setSimLat(point.lat.toString());
      setSimLng(point.lng.toString());
      setSimStatus(point.status + ` (At ${point.name})`);
      setSimStepIndex(step % waypoints.length);
      
      handleBroadcastGps(point.lat, point.lng, point.status);
      step++;
    }, 4000); // Advances every 4 seconds along the highway
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Top Admin Control Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition text-xs font-bold border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Passenger Portal</span>
          </button>
          <div className="h-5 w-px bg-slate-800 mx-1"></div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20">
              <BusIcon className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white">TransitGo Operations Console</h1>
              <span className="text-[10px] text-purple-400 font-mono">Master Fleet Control Active</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={loadData}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
            title="Refresh Fleet Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            System Live
          </span>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-slate-950 border-b border-slate-850 px-4 sm:px-8 py-2.5 flex gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('FLEET')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'FLEET' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BusIcon className="w-4 h-4" />
          <span>Fleet & Schedules ({buses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('BOOKINGS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'BOOKINGS' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Passenger Bookings ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('PROMOS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'PROMOS' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Promo Vouchers ({promoCodes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('GPS_SIMULATOR')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'GPS_SIMULATOR' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Radio className="w-4 h-4 animate-pulse text-rose-400" />
          <span>Auto GPS Telemetry Simulator</span>
        </button>
      </div>

      {/* Main Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full flex-1">
        
        {/* TAB 1: FLEET & SCHEDULES */}
        {activeTab === 'FLEET' && (
          <div className="space-y-6">
            <form onSubmit={handleBusSubmit} className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-purple-400" />
                  {editingBusId ? 'Edit Selected Bus Schedule' : 'Create New Bus Corridor Schedule'}
                </span>
                {editingBusId && (
                  <button type="button" onClick={handleCancelEdit} className="text-slate-400 hover:text-white text-xs underline">
                    Cancel Editing
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Bus Operator / Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Super Line Express"
                    value={busName}
                    onChange={(e) => setBusName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Bus Reg Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NA-4589"
                    value={busNumber}
                    onChange={(e) => setBusNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Bus Fleet Class</label>
                  <select
                    value={busType}
                    onChange={(e) => setBusType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium"
                  >
                    <option value="Luxury A/C">Luxury A/C</option>
                    <option value="Super Luxury Volvo">Super Luxury Volvo</option>
                    <option value="Super Luxury Sleeper">Super Luxury Sleeper</option>
                    <option value="Semi-Luxury Non-A/C">Semi-Luxury Non-A/C</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Origin City</label>
                  <input
                    type="text"
                    required
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Destination City</label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Departure Time</label>
                  <input
                    type="text"
                    required
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Arrival Time</label>
                  <input
                    type="text"
                    required
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Total Standard Fare (LKR)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Total Seats</label>
                  <input
                    type="number"
                    required
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Boarding Halts</label>
                  <input
                    type="text"
                    value={boardingPointsStr}
                    onChange={(e) => setBoardingPointsStr(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2.5 rounded-xl transition text-xs flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{editingBusId ? 'Save Changes' : 'Publish Bus Schedule'}</span>
              </button>
            </form>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-4 bg-slate-950 border-b border-slate-800 font-bold text-xs text-white">
                Active Fleet Schedules ({buses.length})
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 text-[11px]">
                  <tr>
                    <th className="p-4">Bus & Model</th>
                    <th className="p-4">Route Corridor</th>
                    <th className="p-4">Timings</th>
                    <th className="p-4">Fare</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {buses.map((bus) => (
                    <tr key={bus.id} className="hover:bg-slate-850/50">
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{bus.busName}</div>
                        <div className="text-[11px] font-mono text-purple-400">{bus.busNumber} • {bus.busType}</div>
                      </td>
                      <td className="p-4 text-slate-300 font-semibold">{bus.source} ➔ {bus.destination}</td>
                      <td className="p-4 font-mono text-slate-400">{bus.departureTime} - {bus.arrivalTime}</td>
                      <td className="p-4 font-mono font-bold text-emerald-400 text-sm">LKR {bus.price?.toLocaleString()}</td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => handleEditClick(bus)} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteBus(bus.id)} className="p-2 bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 rounded-xl transition">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: BOOKINGS */}
        {activeTab === 'BOOKINGS' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-950 border-b border-slate-800 font-bold text-xs text-white">
              All Confirmed Passenger Bookings ({bookings.length})
            </div>
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Passenger</th>
                  <th className="p-4">Route</th>
                  <th className="p-4">Seats</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-850/50">
                    <td className="p-4 font-bold text-purple-400">{b.bookingReference}</td>
                    <td className="p-4 font-sans font-semibold text-white">
                      <div>{b.passengerName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{b.phone}</div>
                    </td>
                    <td className="p-4 font-sans text-slate-300">{b.bus?.source} ➔ {b.droppingPoint || b.bus?.destination}</td>
                    <td className="p-4 font-bold text-emerald-400">{(b.selectedSeats || []).join(', ')}</td>
                    <td className="p-4 font-bold text-white">LKR {b.totalAmount?.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        b.status === 'BOARDED' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        b.status === 'CANCELLED' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: PROMO VOUCHERS */}
        {activeTab === 'PROMOS' && (
          <div className="space-y-6">
            <form onSubmit={handleCreatePromo} className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
              <span className="font-bold text-sm text-white block">Create Discount Coupon Voucher</span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <input
                  type="text"
                  required
                  placeholder="Code (e.g. FLASH30)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase"
                />
                <input
                  type="text"
                  required
                  placeholder="Description"
                  value={promoDesc}
                  onChange={(e) => setPromoDesc(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
                <input
                  type="number"
                  required
                  placeholder="Discount %"
                  value={promoDiscountPct}
                  onChange={(e) => setPromoDiscountPct(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
                <input
                  type="number"
                  required
                  placeholder="Min Spend (LKR)"
                  value={promoMinAmount}
                  onChange={(e) => setPromoMinAmount(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl transition text-xs">
                Create Promo Code
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {promoCodes.map((p) => (
                <div key={p.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-extrabold text-purple-400 text-base">{p.code}</span>
                    <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full font-bold">
                      {p.discountPercentage ? `${p.discountPercentage}% OFF` : `LKR ${p.flatDiscountAmount} OFF`}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SMART AUTO-PILOT GPS SIMULATOR */}
        {activeTab === 'GPS_SIMULATOR' && (
          <div className="max-w-2xl mx-auto space-y-6">
            
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-5 shadow-2xl">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-rose-400 animate-pulse" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Real-Time Highway GPS Simulator</h4>
                    <p className="text-[11px] text-slate-400">Broadcast live telemetry without leaving Sri Lankan roads</p>
                  </div>
                </div>

                {/* Auto Simulation Toggle */}
                <button
                  type="button"
                  onClick={toggleAutoSimulation}
                  className={`px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-2 transition shadow-lg ${
                    isAutoSimulating
                      ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse shadow-rose-600/30'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/30'
                  }`}
                >
                  {isAutoSimulating ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Stop Auto-Pilot</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Auto-Pilot Run</span>
                    </>
                  )}
                </button>
              </div>

              {gpsSuccessMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-2xl text-center text-xs font-semibold flex items-center justify-center gap-2 animate-in fade-in">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{gpsSuccessMsg}</span>
                </div>
              )}

              {/* Target Bus Selection */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold text-xs">Target Bus Schedule</label>
                <select
                  value={selectedGpsBusId}
                  onChange={(e) => setSelectedGpsBusId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium text-xs"
                >
                  {buses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.busName} ({b.busNumber}) - {b.source} ➔ {b.destination}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Sri Lankan Town Preset Buttons */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Quick Highway Waypoint Jump (Colombo ⇄ Kandy Corridor):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ROUTE_WAYPOINTS.KANDY_ROUTE.map((point, index) => (
                    <button
                      key={point.name}
                      type="button"
                      onClick={() => handleSelectPreset(point)}
                      className={`p-2 rounded-xl text-[11px] font-semibold transition text-left border ${
                        simStepIndex === index && isAutoSimulating
                          ? 'bg-purple-600 text-white border-purple-400 ring-2 ring-purple-400/40'
                          : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                      }`}
                    >
                      <div className="truncate font-bold text-white">{point.name.split(' ')[0]}</div>
                      <div className="text-[9px] text-slate-500 font-mono">{point.lat}, {point.lng}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Broadcast Telemetry Form */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="font-bold">Current Broadcast Payload</span>
                  {isAutoSimulating && (
                    <span className="text-emerald-400 font-mono text-[10px] animate-pulse">● Auto-Steering Active (4s loop)</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 mb-1 text-[10px] font-mono">LATITUDE</label>
                    <input
                      type="text"
                      value={simLat}
                      onChange={(e) => setSimLat(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1 text-[10px] font-mono">LONGITUDE</label>
                    <input
                      type="text"
                      value={simLng}
                      onChange={(e) => setSimLng(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 mb-1 text-[10px] font-mono">TRAFFIC & HIGHWAY STATUS</label>
                  <input
                    type="text"
                    value={simStatus}
                    onChange={(e) => setSimStatus(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleBroadcastGps()}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Broadcast Manual Telemetry</span>
                </button>
              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
};

export default AdminDashboard;