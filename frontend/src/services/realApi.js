import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== VEHICLES =====
export const fetchVehicles = () => api.get('/vehicles').then((res) => res.data);
export const createVehicle = (data) => api.post('/vehicles', data).then((res) => res.data);

// ===== DRIVERS =====
export const fetchDrivers = () => api.get('/drivers').then((res) => res.data);
export const createDriver = (data) => api.post('/drivers', data).then((res) => res.data);

// ===== TRIPS =====
export const fetchTrips = () => api.get('/trips').then((res) => res.data);
export const createTrip = (data) => api.post('/trips', data).then((res) => res.data);
export const dispatchTrip = (id) => api.put(`/trips/${id}/dispatch`).then((res) => res.data);

// ===== DASHBOARD =====
export const fetchDashboardStats = () => api.get('/dashboard').then((res) => res.data);