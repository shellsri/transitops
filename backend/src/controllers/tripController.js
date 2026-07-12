const { sequelize, Trip, Vehicle, Driver } = require('../models');

const TRIP_INCLUDES = [
  { model: Vehicle, as: 'vehicle' },
  { model: Driver, as: 'driver' },
];

/**
 * Shape a flattened response for dispatch/complete/cancel actions.
 */
const flattenTripResponse = (trip) => ({
  id: trip.id,
  status: trip.status,
  vehicle_status: trip.vehicle ? trip.vehicle.status : null,
  driver_status: trip.driver ? trip.driver.status : null,
  trip,
});

// POST /trips
exports.create = async (req, res) => {
  try {
    const {
      origin,
      destination,
      vehicleId,
      driverId,
      scheduled_at,
      planned_distance,
    } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({ message: 'origin and destination are required' });
    }

    if (vehicleId) {
      const vehicle = await Vehicle.findByPk(vehicleId);
      if (!vehicle) {
        return res.status(404).json({ message: `Vehicle ${vehicleId} not found` });
      }
    }

    if (driverId) {
      const driver = await Driver.findByPk(driverId);
      if (!driver) {
        return res.status(404).json({ message: `Driver ${driverId} not found` });
      }
    }

    const trip = await Trip.create({
      origin,
      destination,
      vehicleId: vehicleId || null,
      driverId: driverId || null,
      scheduled_at: scheduled_at || null,
      // planned_distance defaults to 0 when not provided
      planned_distance: planned_distance !== undefined && planned_distance !== null ? planned_distance : 0,
      status: 'Planned',
      createdBy: req.user ? req.user.id : null,
    });

    const created = await Trip.findByPk(trip.id, { include: TRIP_INCLUDES });

    return res.status(201).json(created);
  } catch (err) {
    console.error('Error creating trip:', err);
    return res.status(500).json({ message: 'Failed to create trip', error: err.message });
  }
};

// GET /trips
exports.list = async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};

    const trips = await Trip.findAll({
      where,
      include: TRIP_INCLUDES,
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(trips);
  } catch (err) {
    console.error('Error listing trips:', err);
    return res.status(500).json({ message: 'Failed to list trips', error: err.message });
  }
};

// GET /trips/:id
exports.getById = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id, { include: TRIP_INCLUDES });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    return res.status(200).json(trip);
  } catch (err) {
    console.error('Error fetching trip:', err);
    return res.status(500).json({ message: 'Failed to fetch trip', error: err.message });
  }
};

// PUT /trips/:id/dispatch
exports.dispatch = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const trip = await Trip.findByPk(req.params.id, {
      include: TRIP_INCLUDES,
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!trip) {
      await t.rollback();
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.status !== 'Planned') {
      await t.rollback();
      return res.status(400).json({
        message: `Trip cannot be dispatched from status '${trip.status}'. Only 'Planned' trips can be dispatched.`,
      });
    }

    if (!trip.vehicle || !trip.driver) {
      await t.rollback();
      return res.status(400).json({
        message: 'Trip must have both a vehicle and a driver assigned before it can be dispatched',
      });
    }

    // Only 'Available' vehicles can be assigned/dispatched
    if (trip.vehicle.status !== 'Available') {
      await t.rollback();
      return res.status(400).json({
        message: `Vehicle ${trip.vehicle.registration_number} is not available (current status: '${trip.vehicle.status}')`,
      });
    }

    // Only 'Available' drivers can be assigned/dispatched
    if (trip.driver.status !== 'Available') {
      await t.rollback();
      return res.status(400).json({
        message: `Driver ${trip.driver.name} is not available (current status: '${trip.driver.status}')`,
      });
    }

    // Reject expired licenses
    if (trip.driver.license_expiry && new Date(trip.driver.license_expiry) < new Date()) {
      await t.rollback();
      return res.status(400).json({
        message: `Driver ${trip.driver.name}'s license expired on ${trip.driver.license_expiry} and cannot be dispatched`,
      });
    }

    trip.status = 'Dispatched';
    trip.dispatched_at = new Date();
    await trip.save({ transaction: t });

    trip.vehicle.status = 'On Trip';
    await trip.vehicle.save({ transaction: t });

    trip.driver.status = 'On Trip';
    await trip.driver.save({ transaction: t });

    await t.commit();

    return res.status(200).json(flattenTripResponse(trip));
  } catch (err) {
    await t.rollback();
    console.error('Error dispatching trip:', err);
    return res.status(500).json({ message: 'Failed to dispatch trip', error: err.message });
  }
};

// PUT /trips/:id/complete
exports.complete = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { actual_distance } = req.body;

    const trip = await Trip.findByPk(req.params.id, {
      include: TRIP_INCLUDES,
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!trip) {
      await t.rollback();
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.status !== 'Dispatched') {
      await t.rollback();
      return res.status(400).json({
        message: `Trip cannot be completed from status '${trip.status}'. Only 'Dispatched' trips can be completed.`,
      });
    }

    trip.status = 'Completed';
    trip.completed_at = new Date();
    if (actual_distance !== undefined && actual_distance !== null) {
      trip.actual_distance = actual_distance;
    }
    await trip.save({ transaction: t });

    if (trip.vehicle) {
      trip.vehicle.status = 'Available';
      await trip.vehicle.save({ transaction: t });
    }

    if (trip.driver) {
      trip.driver.status = 'Available';
      await trip.driver.save({ transaction: t });
    }

    await t.commit();

    return res.status(200).json(flattenTripResponse(trip));
  } catch (err) {
    await t.rollback();
    console.error('Error completing trip:', err);
    return res.status(500).json({ message: 'Failed to complete trip', error: err.message });
  }
};

// PUT /trips/:id/cancel
exports.cancel = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { reason } = req.body;

    const trip = await Trip.findByPk(req.params.id, {
      include: TRIP_INCLUDES,
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!trip) {
      await t.rollback();
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (!['Planned', 'Dispatched'].includes(trip.status)) {
      await t.rollback();
      return res.status(400).json({
        message: `Trip cannot be cancelled from status '${trip.status}'`,
      });
    }

    const wasDispatched = trip.status === 'Dispatched';

    trip.status = 'Cancelled';
    trip.cancelled_at = new Date();
    if (reason) {
      trip.cancellation_reason = reason;
    }
    await trip.save({ transaction: t });

    // Only free up vehicle/driver if they had actually been put "On Trip"
    if (wasDispatched) {
      if (trip.vehicle) {
        trip.vehicle.status = 'Available';
        await trip.vehicle.save({ transaction: t });
      }
      if (trip.driver) {
        trip.driver.status = 'Available';
        await trip.driver.save({ transaction: t });
      }
    }

    await t.commit();

    return res.status(200).json(flattenTripResponse(trip));
  } catch (err) {
    await t.rollback();
    console.error('Error cancelling trip:', err);
    return res.status(500).json({ message: 'Failed to cancel trip', error: err.message });
  }
};
