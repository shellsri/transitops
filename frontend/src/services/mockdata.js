// Mock Vehicles
export const mockVehicles = [
  { id: 1, reg_number: 'MH-01-AB-1234', name: 'Van-05', type: 'Van', max_load: 500, odometer: 12000, status: 'Available' },
  { id: 2, reg_number: 'MH-02-CD-5678', name: 'Truck-A1', type: 'Truck', max_load: 2000, odometer: 34500, status: 'On Trip' },
  { id: 3, reg_number: 'MH-03-EF-9012', name: 'Van-08', type: 'Van', max_load: 500, odometer: 8700, status: 'In Shop' },
];

// Mock Drivers
export const mockDrivers = [
  { id: 1, name: 'Alex', license_number: 'DL-1234', license_expiry: '2027-05-10', contact: '9876543210', safety_score: 92, status: 'Available' },
  { id: 2, name: 'Priya', license_number: 'DL-5678', license_expiry: '2026-01-15', contact: '9123456789', safety_score: 85, status: 'On Trip' },
  { id: 3, name: 'Rohan', license_number: 'DL-9012', license_expiry: '2025-03-20', contact: '9988776655', safety_score: 70, status: 'Suspended' },
];

// Mock Trips
export const mockTrips = [
  { id: 1, source: 'Mumbai', destination: 'Pune', vehicle_id: 2, driver_id: 2, cargo_weight: 1500, distance: 150, status: 'Dispatched' },
  { id: 2, source: 'Delhi', destination: 'Jaipur', vehicle_id: 1, driver_id: 1, cargo_weight: 450, distance: 280, status: 'Draft' },
];