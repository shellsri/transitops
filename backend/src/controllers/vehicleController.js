const { Vehicle } = require('../models');

// POST /vehicles
exports.create = async (req, res) => {
  try {
    const { registration_number, type, capacity, status } = req.body;

    if (!registration_number) {
      return res.status(400).json({ message: 'registration_number is required' });
    }

    const existing = await Vehicle.findOne({ where: { registration_number } });
    if (existing) {
      return res.status(409).json({ message: 'A vehicle with this registration number already exists' });
    }

    const vehicle = await Vehicle.create({
      registration_number,
      type: type || 'Van',
      capacity: capacity || null,
      status: status || 'Available',
    });

    return res.status(201).json(vehicle);
  } catch (err) {
    console.error('Error creating vehicle:', err);
    return res.status(500).json({ message: 'Failed to create vehicle', error: err.message });
  }
};

// GET /vehicles
exports.list = async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};
    const vehicles = await Vehicle.findAll({ where, order: [['createdAt', 'DESC']] });
    return res.status(200).json(vehicles);
  } catch (err) {
    console.error('Error listing vehicles:', err);
    return res.status(500).json({ message: 'Failed to list vehicles', error: err.message });
  }
};

// GET /vehicles/:id
exports.getById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    return res.status(200).json(vehicle);
  } catch (err) {
    console.error('Error fetching vehicle:', err);
    return res.status(500).json({ message: 'Failed to fetch vehicle', error: err.message });
  }
};

// PUT /vehicles/:id
exports.update = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const { registration_number, type, capacity, status } = req.body;

    if (status && !['Available', 'On Trip', 'Maintenance', 'Out of Service'].includes(status)) {
      return res.status(400).json({ message: `Invalid status '${status}'` });
    }

    await vehicle.update({
      registration_number: registration_number ?? vehicle.registration_number,
      type: type ?? vehicle.type,
      capacity: capacity ?? vehicle.capacity,
      status: status ?? vehicle.status,
    });

    return res.status(200).json(vehicle);
  } catch (err) {
    console.error('Error updating vehicle:', err);
    return res.status(500).json({ message: 'Failed to update vehicle', error: err.message });
  }
};

// DELETE /vehicles/:id
exports.remove = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    await vehicle.destroy();
    return res.status(204).send();
  } catch (err) {
    console.error('Error deleting vehicle:', err);
    return res.status(500).json({ message: 'Failed to delete vehicle', error: err.message });
  }
};
