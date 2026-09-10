import React, { useState, useEffect, useCallback } from 'react';
import { X, Navigation, MapPin, Compass, AlertCircle, Clock, ShieldCheck } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer, InfoWindow } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '1.25rem',
};

// Default Center: Sri Lanka Central Coordinates
const defaultCenter = {
  lat: 7.8731,
  lng: 80.7718,
};

// Coordinates Lookup Table for major Sri Lankan Transit Hubs
const CITY_COORDINATES = {
  'colombo': { lat: 6.9271, lng: 79.8612 },
  'kandy': { lat: 7.2906, lng: 80.6337 },
  'galle': { lat: 6.0535, lng: 80.2210 },
  'matara': { lat: 5.9549, lng: 80.5550 },
  'jaffna': { lat: 9.6615, lng: 80.0255 },
  'ella': { lat: 6.8667, lng: 81.0466 },
  'badulla': { lat: 6.9934, lng: 81.0550 },
  'anuradhapura': { lat: 8.3114, lng: 80.4037 },
  'kurunegala': { lat: 7.4863, lng: 80.3623 },
  'trincomalee': { lat: 8.5874, lng: 81.2152 },
  'negombo': { lat: 7.2008, lng: 79.8736 },
  'batticaloa': { lat: 7.7310, lng: 81.6747 }
};

const getCityLatLng = (cityName, fallback) => {
  if (!cityName) return fallback;
  const key = cityName.trim().toLowerCase();
  return CITY_COORDINATES[key] || fallback;
};

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#34d399' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#64748b' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#1e293b' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#1e293b' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#334155' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#10b981' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#059669' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#020617' }],
  },
];

const RouteMapModal = ({ bus, onClose }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  });

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [map, setMap] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const originCoords = getCityLatLng(bus.source, { lat: 6.9271, lng: 79.8612 });
  const destCoords = getCityLatLng(bus.destination, { lat: 7.2906, lng: 80.6337 });

  const currentBusPos = {
    lat: bus.currentLatitude || (originCoords.lat + destCoords.lat) / 2,
    lng: bus.currentLongitude || (originCoords.lng + destCoords.lng) / 2,
  };

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const calculateRoute = useCallback(async () => {
    if (!isLoaded || !window.google) return;

    try {
      const directionsService = new window.google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: originCoords,
        destination: destCoords,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });

      setDirectionsResponse(results);
      if (results.routes[0]?.legs[0]) {
        setDistance(results.routes[0].legs[0].distance.text);
        setDuration(results.routes[0].legs[0].duration.text);
      }
    } catch (err) {
      console.warn('Google Directions API route calculation fallback', err);
    }
  }, [isLoaded, originCoords, destCoords]);

  useEffect(() => {
    if (isLoaded) {
      calculateRoute();
    }
  }, [isLoaded, calculateRoute]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
              <Navigation className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">{bus.busName}</h3>
                <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-800 border border-slate-700 text-emerald-400 rounded">
                  {bus.busNumber}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {bus.source} ➔ {bus.destination} • Live Telemetry & Highway Highway Corridors
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="bg-slate-950/60 border-b border-slate-800 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-slate-300 font-semibold">Status:</span>
              <span className="text-emerald-400 font-bold font-mono">
                {bus.currentStatusText || 'EN ROUTE / ON SCHEDULE'}
              </span>
            </div>

            {distance && (
              <div className="hidden sm:flex items-center gap-1 text-slate-400">
                <span>• Distance:</span>
                <span className="text-white font-mono font-bold">{distance}</span>
              </div>
            )}

            {duration && (
              <div className="hidden sm:flex items-center gap-1 text-slate-400">
                <span>• Est. Time:</span>
                <span className="text-white font-mono font-bold">{duration}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>LAT: {Number(currentBusPos.lat).toFixed(4)} | LNG: {Number(currentBusPos.lng).toFixed(4)}</span>
          </div>
        </div>

        {/* Google Map Container */}
        <div className="flex-1 p-3 bg-slate-950 relative overflow-hidden">
          {isLoaded && !loadError ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={currentBusPos}
              zoom={9}
              onLoad={onLoad}
              options={{
                styles: darkMapStyle,
                disableDefaultUI: false,
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
              }}
            >
              {/* Origin Marker */}
              <Marker
                position={originCoords}
                title={`Origin: ${bus.source}`}
                onClick={() => setSelectedMarker({ title: `Origin: ${bus.source}`, pos: originCoords })}
              />

              {/* Destination Marker */}
              <Marker
                position={destCoords}
                title={`Destination: ${bus.destination}`}
                onClick={() => setSelectedMarker({ title: `Destination: ${bus.destination}`, pos: destCoords })}
              />

              {/* Live Moving Bus GPS Marker */}
              <Marker
                position={currentBusPos}
                title={`Live Bus: ${bus.busName}`}
                icon={{
                  url: 'https://maps.google.com/mapfiles/kml/shapes/bus.png',
                  scaledSize: new window.google.maps.Size(34, 34),
                }}
                onClick={() => setSelectedMarker({ title: `Live Vehicle: ${bus.busName} (${bus.busNumber})`, pos: currentBusPos, isBus: true })}
              />

              {/* Highway Route Polyline */}
              {directionsResponse && (
                <DirectionsRenderer
                  directions={directionsResponse}
                  options={{
                    suppressMarkers: true,
                    polylineOptions: {
                      strokeColor: '#10b981',
                      strokeOpacity: 0.85,
                      strokeWeight: 5,
                    },
                  }}
                />
              )}

              {/* Info Window on Click */}
              {selectedMarker && (
                <InfoWindow
                  position={selectedMarker.pos}
                  onCloseClick={() => setSelectedMarker(null)}
                >
                  <div className="p-1 text-slate-900 text-xs font-sans">
                    <p className="font-bold">{selectedMarker.title}</p>
                    {selectedMarker.isBus && (
                      <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                        Status: {bus.currentStatusText || 'Active on Route'}
                      </p>
                    )}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            /* Fallback Mock Visualizer when API Key is pending */
            <div className="w-full h-full bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <MapPin className="w-8 h-8 animate-bounce" />
              </div>
              <div className="max-w-md space-y-1">
                <h4 className="text-base font-bold text-white">Google Maps Engine Ready</h4>
                <p className="text-xs text-slate-400">
                  Provide your Google Maps JavaScript API key in <code className="text-emerald-400 font-mono">frontend/.env</code> to render live vector tiles and real-time turn-by-turn road curves.
                </p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left font-mono text-xs text-slate-300 space-y-1">
                <div><span className="text-slate-500">Route:</span> {bus.source} Central ➔ {bus.destination}</div>
                <div><span className="text-slate-500">GPS Fix:</span> {currentBusPos.lat}, {currentBusPos.lng}</div>
                <div><span className="text-slate-500">Boarding Halts:</span> {(bus.boardingPoints || []).join(' • ')}</div>
              </div>
            </div>
          )}
        </div>

        {/* Boarding Points Footer List */}
        {bus.boardingPoints && bus.boardingPoints.length > 0 && (
          <div className="bg-slate-950 p-3.5 border-t border-slate-800 shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Verified En-Route Express Halts
            </span>
            <div className="flex flex-wrap gap-2">
              {bus.boardingPoints.map((bp, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 font-medium"
                >
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>{bp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default RouteMapModal;