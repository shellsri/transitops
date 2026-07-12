module.exports = (sequelize, DataTypes) => {
  const Trip = sequelize.define(
    "Trip",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      source: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      destination: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      vehicle_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      driver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      cargo_weight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      planned_distance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM(
          "Draft",
          "Dispatched",
          "Completed",
          "Cancelled"
        ),
        defaultValue: "Draft",
      },

      start_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      end_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      actual_odometer_end: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },

      fuel_consumed_liters: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },

      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "trips",
      timestamps: false,
    }
  );

  return Trip;
};