const { Driver } = require('../models');

// POST /drivers
exports.create = async (req, res) => {
  try {
    const { name, phone, license_number, license_expiry, status } = req.body;

    if (!name || !license_number || !license_expiry) {
      return res.status(400).json({ message: 'name, license_number and license_expiry are required' });
    }

    if (new Date(license_expiry) < new Date()) {
      return res.status(400).json({ message: 'Cannot create a driver with an already-expired license' });
    }

    const existing = await Driver.findOne({ where: { license_number } });
    if (existing) {
      return res.status(409).json({ message: 'A driver with this license number already exists' });
    }

    const driver = await Driver.create({
      name,
      phone: phone || null,
      license_number,
      license_expiry,
      status: status || 'Available',
    });

    return res.status(201).json(driver);
  } catch (err) {
    console.error('Error creating driver:', err);
    return res.status(500).json({ message: 'Failed to create driver', error: err.message });
  }
};

// GET /drivers
exports.list = async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};
    const drivers = await Driver.findAll({ where, order: [['createdAt', 'DESC']] });
    return res.status(200).json(drivers);
  } catch (err) {
    console.error('Error listing drivers:', err);
    return res.status(500).json({ message: 'Failed to list drivers', error: err.message });
  }
};

// GET /drivers/:id
exports.getById = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    return res.status(200).json(driver);
  } catch (err) {
    console.error('Error fetching driver:', err);
    return res.status(500).json({ message: 'Failed to fetch driver', error: err.message });
  }
};

// PUT /drivers/:id
exports.update = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    const { name, phone, license_number, license_expiry, status } = req.body;

    if (status && !['Available', 'On Trip', 'Off Duty', 'Suspended'].includes(status)) {
      return res.status(400).json({ message: `Invalid status '${status}'` });
    }

    await driver.update({
      name: name ?? driver.name,
      phone: phone ?? driver.phone,
      license_number: license_number ?? driver.license_number,
      license_expiry: license_expiry ?? driver.license_expiry,
      status: status ?? driver.status,
    });

    return res.status(200).json(driver);
  } catch (err) {
    console.error('Error updating driver:', err);
    return res.status(500).json({ message: 'Failed to update driver', error: err.message });
  }
};

// DELETE /drivers/:id
exports.remove = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    await driver.destroy();
    return res.status(204).send();
  } catch (err) {
    console.error('Error deleting driver:', err);
    return res.status(500).json({ message: 'Failed to delete driver', error: err.message });
  }
};
