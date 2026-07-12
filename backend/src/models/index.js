const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./User')(sequelize, DataTypes);
const Vehicle = require('./Vehicle')(sequelize, DataTypes);
const Driver = require('./Driver')(sequelize, DataTypes);
const Trip = require('./Trip')(sequelize, DataTypes);

// --- Associations ---

// A driver may optionally have a linked login account
Driver.belongsTo(User, { foreignKey: 'userId', as: 'account' });
User.hasOne(Driver, { foreignKey: 'userId', as: 'driverProfile' });

// A vehicle can appear in many trips
Vehicle.hasMany(Trip, { foreignKey: 'vehicleId', as: 'trips' });
Trip.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });

// A driver can appear in many trips
Driver.hasMany(Trip, { foreignKey: 'driverId', as: 'trips' });
Trip.belongsTo(Driver, { foreignKey: 'driverId', as: 'driver' });

// Track who created a trip
User.hasMany(Trip, { foreignKey: 'createdBy', as: 'createdTrips' });
Trip.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

module.exports = {
  sequelize,
  User,
  Vehicle,
  Driver,
  Trip,
};
