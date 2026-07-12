const { sequelize, Trip, Vehicle, Driver } = require("../models");

// ==========================
// CREATE TRIP
// ==========================
exports.create = async (req, res) => {
  try {
    const {
      source,
      destination,
      vehicle_id,
      driver_id,
      cargo_weight,
      planned_distance,
    } = req.body;

    if (
      !source ||
      !destination ||
      !vehicle_id ||
      !driver_id ||
      !cargo_weight ||
      !planned_distance
    ) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const vehicle = await Vehicle.findByPk(vehicle_id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    const driver = await Driver.findByPk(driver_id);

    if (!driver) {
      return res.status(404).json({
        message: "Driver not found",
      });
    }

    if (vehicle.status !== "Available") {
      return res.status(400).json({
        message: "Vehicle is not available",
      });
    }

    if (driver.status !== "Available") {
      return res.status(400).json({
        message: "Driver is not available",
      });
    }

    const trip = await Trip.create({
      source,
      destination,
      vehicle_id,
      driver_id,
      cargo_weight,
      planned_distance,
      status: "Draft",
    });

    res.status(201).json(trip);
  } catch (err) {
    console.error("Create Trip Error:", err);

    res.status(500).json({
      message: "Failed to create trip",
      error: err.message,
    });
  }
};

// ==========================
// LIST TRIPS
// ==========================
exports.list = async (req, res) => {
  try {
    const trips = await Trip.findAll({
      include: [
        {
          model: Vehicle,
          as: "vehicle",
        },
        {
          model: Driver,
          as: "driver",
        },
      ],
      order: [["id", "DESC"]],
    });

    res.json(trips);
  } catch (err) {
    console.error("Trip List Error:", err);

    res.status(500).json({
      message: "Failed to list trips",
      error: err.message,
    });
  }
};

// ==========================
// GET ONE
// ==========================
exports.getById = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id, {
      include: [
        {
          model: Vehicle,
          as: "vehicle",
        },
        {
          model: Driver,
          as: "driver",
        },
      ],
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    res.json(trip);
  } catch (err) {
    console.error(err);

    res.status(500).json(err.message);
  }
};
// ==========================
// DISPATCH TRIP
// ==========================
exports.dispatch = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const trip = await Trip.findByPk(req.params.id, {
      include: [
        { model: Vehicle, as: "vehicle" },
        { model: Driver, as: "driver" },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!trip) {
      await t.rollback();
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    if (trip.status !== "Draft") {
      await t.rollback();
      return res.status(400).json({
        message: "Only Draft trips can be dispatched",
      });
    }

    trip.status = "Dispatched";
    trip.start_time = new Date();

    await trip.save({ transaction: t });

    if (trip.vehicle) {
      trip.vehicle.status = "On Trip";
      await trip.vehicle.save({ transaction: t });
    }

    if (trip.driver) {
      trip.driver.status = "On Trip";
      await trip.driver.save({ transaction: t });
    }

    await t.commit();

    res.json(trip);
  } catch (err) {
    await t.rollback();

    console.error("Dispatch Error:", err);

    res.status(500).json({
      message: "Failed to dispatch trip",
      error: err.message,
    });
  }
};

// ==========================
// COMPLETE TRIP
// ==========================
exports.complete = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      actual_odometer_end,
      fuel_consumed_liters,
    } = req.body;

    const trip = await Trip.findByPk(req.params.id, {
      include: [
        { model: Vehicle, as: "vehicle" },
        { model: Driver, as: "driver" },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!trip) {
      await t.rollback();
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    trip.status = "Completed";
    trip.end_time = new Date();

    if (actual_odometer_end != null)
      trip.actual_odometer_end = actual_odometer_end;

    if (fuel_consumed_liters != null)
      trip.fuel_consumed_liters = fuel_consumed_liters;

    await trip.save({ transaction: t });

    if (trip.vehicle) {
      trip.vehicle.status = "Available";
      await trip.vehicle.save({ transaction: t });
    }

    if (trip.driver) {
      trip.driver.status = "Available";
      await trip.driver.save({ transaction: t });
    }

    await t.commit();

    res.json(trip);
  } catch (err) {
    await t.rollback();

    console.error("Complete Error:", err);

    res.status(500).json({
      message: "Failed to complete trip",
      error: err.message,
    });
  }
};

// ==========================
// CANCEL TRIP
// ==========================
exports.cancel = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const trip = await Trip.findByPk(req.params.id, {
      include: [
        { model: Vehicle, as: "vehicle" },
        { model: Driver, as: "driver" },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!trip) {
      await t.rollback();
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    trip.status = "Cancelled";

    await trip.save({ transaction: t });

    if (trip.vehicle) {
      trip.vehicle.status = "Available";
      await trip.vehicle.save({ transaction: t });
    }

    if (trip.driver) {
      trip.driver.status = "Available";
      await trip.driver.save({ transaction: t });
    }

    await t.commit();

    res.json(trip);
  } catch (err) {
    await t.rollback();

    console.error("Cancel Error:", err);

    res.status(500).json({
      message: "Failed to cancel trip",
      error: err.message,
    });
  }
};