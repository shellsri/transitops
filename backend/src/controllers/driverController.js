const { Driver } = require("../models");

// =========================
// CREATE DRIVER
// =========================
exports.create = async (req, res) => {
  try {
    const {
      name,
      license_number,
      license_category,
      license_expiry,
      phone,
      safety_score,
      status,
    } = req.body;

    const existing = await Driver.findOne({
      where: { license_number },
    });

    if (existing) {
      return res.status(409).json({
        message: "Driver already exists",
      });
    }

    const driver = await Driver.create({
      name,
      license_number,
      license_category,
      license_expiry,
      phone,
      safety_score: safety_score || 5,
      status: status || "Available",
    });

    res.status(201).json(driver);
  } catch (err) {
    console.error("Create Driver Error:", err);

    res.status(500).json({
      message: "Failed to create driver",
      error: err.message,
    });
  }
};

// =========================
// LIST DRIVERS
// =========================
exports.list = async (req, res) => {
  try {
    const drivers = await Driver.findAll({
      order: [["id", "DESC"]],
    });

    res.json(drivers);
  } catch (err) {
    console.error("Driver List Error:", err);

    res.status(500).json({
      message: "Failed to list drivers",
      error: err.message,
    });
  }
};

// =========================
// GET DRIVER
// =========================
exports.getById = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);

    if (!driver) {
      return res.status(404).json({
        message: "Driver not found",
      });
    }

    res.json(driver);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
};

// =========================
// UPDATE DRIVER
// =========================
exports.update = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);

    if (!driver) {
      return res.status(404).json({
        message: "Driver not found",
      });
    }

    await driver.update(req.body);

    res.json(driver);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
};

// =========================
// DELETE DRIVER
// =========================
exports.remove = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);

    if (!driver) {
      return res.status(404).json({
        message: "Driver not found",
      });
    }

    await driver.destroy();

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
};