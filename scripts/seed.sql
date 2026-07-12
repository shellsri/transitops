-- Use the database we created earlier
USE transitops;

-- 1. Insert Roles
INSERT INTO roles (name) VALUES ('Fleet Manager'), ('Driver'), ('Safety Officer');

-- 2. Insert a Fleet Manager user (password = 'admin123')
-- bcrypt hash for 'admin123' (pre-hashed so login works immediately)
INSERT INTO users (email, password_hash, name, role_id) 
VALUES ('admin@transitops.com', '$2b$10$kRzC4KNxB5Z7hYvN6xT0N.1O5X3e6X8Q6L4Y7T9W2Z1X8V4N6M', 'Admin User', 1);

-- 3. Insert 2 Vehicles
INSERT INTO vehicles (reg_number, name, type, max_load, status) 
VALUES ('MH-01-VAN', 'Van-05', 'Cargo Van', 500.00, 'Available'),
       ('MH-02-TRK', 'Truck-A1', 'Box Truck', 2000.00, 'Available');

-- 4. Insert 3 Drivers
INSERT INTO drivers (name, license_number, license_category, license_expiry, status) 
VALUES ('Alex Johnson', 'LIC-12345', 'Class B', '2028-12-31', 'Available'),
       ('Maria Gomez', 'LIC-67890', 'Class A', '2027-06-30', 'Available'),
       ('Raj Patel', 'LIC-54321', 'Class C', '2026-01-15', 'Available');

-- 5. Insert 1 Draft Trip (so the UI has something to show immediately)
INSERT INTO trips (source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, status) 
VALUES ('Mumbai', 'Pune', 1, 1, 400.00, 150.00, 'Draft');