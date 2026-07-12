const { Vehicle } = require("../models");

// POST /vehicles
exports.create = async (req, res) => {
  try {
    const {
      reg_number,
      name,
      type,
      max_load,
      odometer,
      acquisition_cost,
      status,
    } = req.body;

    const existing = await Vehicle.findOne({
      where: { reg_number },
    });

    if (existing) {
      return res.status(409).json({
        message: "Vehicle already exists",
      });
    }

    const vehicle = await Vehicle.create({
      reg_number,
      name,
      type,
      max_load,
      odometer: odometer || 0,
      acquisition_cost,
      status: status || "Available",
    });

    res.status(201).json(vehicle);
  } catch (err) {
    console.error("Error creating vehicle:", err);
    res.status(500).json({
      message: "Failed to create vehicle",
      error: err.message,
    });
  }
};

// GET /vehicles
exports.list = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      order: [["id", "DESC"]],
    });

    res.json(vehicles);
  } catch (err) {
    console.error("Error listing vehicles:", err);
    res.status(500).json({
      message: "Failed to list vehicles",
      error: err.message,
    });
  }
};

// GET /vehicles/:id
exports.getById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    res.json(vehicle);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
};

// PUT /vehicles/:id
exports.update = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    await vehicle.update(req.body);

    res.json(vehicle);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
};

// DELETE /vehicles/:id
exports.remove = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    await vehicle.destroy();

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
};