const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = require("./User")(sequelize, DataTypes);
const Vehicle = require("./Vehicle")(sequelize, DataTypes);
const Driver = require("./Driver")(sequelize, DataTypes);
const Trip = require("./Trip")(sequelize, DataTypes);

// =======================
// Associations
// =======================

// Vehicle -> Trips
Vehicle.hasMany(Trip, {
  foreignKey: "vehicle_id",
  as: "trips",
});

Trip.belongsTo(Vehicle, {
  foreignKey: "vehicle_id",
  as: "vehicle",
});

// Driver -> Trips
Driver.hasMany(Trip, {
  foreignKey: "driver_id",
  as: "trips",
});

Trip.belongsTo(Driver, {
  foreignKey: "driver_id",
  as: "driver",
});

module.exports = {
  sequelize,
  User,
  Vehicle,
  Driver,
  Trip,
};