import { mockVehicles, mockDrivers, mockTrips } from './mockData';

// ===== VEHICLES =====
export const fetchVehicles = () => {
  return Promise.resolve(mockVehicles);
};

export const createVehicle = (data) => {
  console.log('Vehicle created:', data);
  const newVehicle = { id: Date.now(), ...data, status: 'Available' };
  mockVehicles.push(newVehicle);
  return Promise.resolve(newVehicle);
};

// ===== DRIVERS =====
export const fetchDrivers = () => {
  return Promise.resolve(mockDrivers);
};

export const createDriver = (data) => {
  console.log('Driver created:', data);
  const newDriver = { id: Date.now(), ...data, status: 'Available' };
  mockDrivers.push(newDriver);
  return Promise.resolve(newDriver);
};

// ===== TRIPS =====
export const fetchTrips = () => {
  return Promise.resolve(mockTrips);
};

export const createTrip = (data) => {
  console.log('Trip created:', data);
  const newTrip = { id: Date.now(), ...data, status: 'Draft' };
  mockTrips.push(newTrip);
  return Promise.resolve(newTrip);
};

export const dispatchTrip = (id) => {
  console.log('Trip dispatched:', id);
  const trip = mockTrips.find((t) => t.id === id);
  if (trip) trip.status = 'Dispatched';
  return Promise.resolve(trip);
};

// ===== DASHBOARD =====
export const fetchDashboardStats = () => {
  const activeVehicles = mockVehicles.filter((v) => v.status !== 'Retired').length;
  const availableVehicles = mockVehicles.filter((v) => v.status === 'Available').length;
  const inMaintenance = mockVehicles.filter((v) => v.status === 'In Shop').length;
  const activeTrips = mockTrips.filter((t) => t.status === 'Dispatched').length;
  const pendingTrips = mockTrips.filter((t) => t.status === 'Draft').length;
  const driversOnDuty = mockDrivers.filter((d) => d.status === 'On Trip').length;

  return Promise.resolve({
    activeVehicles,
    availableVehicles,
    inMaintenance,
    activeTrips,
    pendingTrips,
    driversOnDuty,
  });
};