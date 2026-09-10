import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Tunnel-Skip-Anti-Abuse': 'true' // DevTunnel warning bypass කිරීම සඳහා
  }
});
// Bus Operations
export const getAllBusesAPI = () => api.get('/buses');
export const searchBusesAPI = (source, destination) => 
  api.get(`/buses/search?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`);
export const getNetworkTownsAPI = () => api.get('/buses/towns');
export const addBusAPI = (busData) => api.post('/buses', busData);
export const updateBusAPI = (id, busData) => api.put(`/buses/${id}`, busData);
export const deleteBusAPI = (id) => api.delete(`/buses/${id}`);
export const updateBusLocationAPI = (id, latitude, longitude, status) =>
  api.put(`/buses/${id}/location`, { latitude, longitude, status });

// Seat Hold Operations
export const holdSeatsAPI = (payload) => api.post('/buses/hold-seats', payload);
export const releaseSeatsAPI = (payload) => api.post('/buses/release-seats', payload);

// Booking & Passenger Operations
export const createBookingAPI = (bookingData) => api.post('/bookings', bookingData);
export const getBookingByRefAPI = (ref) => api.get(`/bookings/${encodeURIComponent(ref)}`);
export const getBookingByReferenceAPI = (ref) => api.get(`/bookings/${encodeURIComponent(ref)}`);
export const searchBookingsAPI = (query) => api.get(`/bookings/search?query=${encodeURIComponent(query)}`);
export const getBookingHistoryAPI = (query) => api.get(`/bookings/search?query=${encodeURIComponent(query)}`);
export const getBookingByNicOrPhoneAPI = (query) => api.get(`/bookings/search?query=${encodeURIComponent(query)}`);
export const getAllBookingsAPI = () => api.get('/bookings/all');
export const checkInTicketAPI = (ref) => api.put(`/bookings/${encodeURIComponent(ref)}/checkin`);
export const cancelBookingAPI = (ref) => api.put(`/bookings/${encodeURIComponent(ref)}/cancel`);

// Promo Codes
export const getAllPromoCodesAPI = () => api.get('/promo/all');
export const createPromoCodeAPI = (data) => api.post('/promo/create', data);
export const validatePromoCodeAPI = (code, amount) => api.get(`/promo/validate?code=${encodeURIComponent(code)}&amount=${amount}`);

// Reviews
export const getBusReviewsAPI = (busId) => api.get(`/buses/${busId}/reviews`);
export const addBusReviewAPI = (reviewData) => api.post('/buses/reviews', reviewData);

export default api;