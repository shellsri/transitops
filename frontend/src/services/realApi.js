import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
});

// ===============================
// Attach JWT automatically
// ===============================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ===============================
// AUTH
// ===============================
export const login = (credentials) =>
  api.post("/auth/login", credentials).then((res) => res.data);

// ===============================
// VEHICLES
// ===============================
export const fetchVehicles = () =>
  api.get("/vehicles").then((res) => res.data);

export const createVehicle = (vehicle) =>
  api.post("/vehicles", vehicle).then((res) => res.data);

// ===============================
// DRIVERS
// ===============================
export const fetchDrivers = () =>
  api.get("/drivers").then((res) => res.data);

export const createDriver = (driver) =>
  api.post("/drivers", driver).then((res) => res.data);

// ===============================
// TRIPS
// ===============================
export const fetchTrips = () =>
  api.get("/trips").then((res) => res.data);

export const createTrip = (trip) =>
  api.post("/trips", trip).then((res) => res.data);

export const dispatchTrip = (id) =>
  api.put(`/trips/${id}/dispatch`).then((res) => res.data);

// ===============================
// DASHBOARD
// ===============================
export async function fetchDashboardStats() {
  try {
    const [vehicles, drivers, trips] = await Promise.all([
      fetchVehicles(),
      fetchDrivers(),
      fetchTrips(),
    ]);

    return {
      activeVehicles: vehicles.length,

      availableVehicles: vehicles.filter(
        (v) => v.status === "Available"
      ).length,

      inMaintenance: vehicles.filter(
        (v) => v.status === "In Shop"
      ).length,

      activeTrips: trips.filter(
        (t) => t.status === "Dispatched"
      ).length,

      pendingTrips: trips.filter(
        (t) => t.status === "Draft"
      ).length,

      driversOnDuty: drivers.filter(
        (d) => d.status === "On Trip"
      ).length,
    };
  } catch (err) {
    console.error(err);

    return {
      activeVehicles: 0,
      availableVehicles: 0,
      inMaintenance: 0,
      activeTrips: 0,
      pendingTrips: 0,
      driversOnDuty: 0,
    };
  }
}

export default api;