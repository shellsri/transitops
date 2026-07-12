module.exports = (sequelize, DataTypes) => {
  const Trip = sequelize.define(
    'Trip',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      origin: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      destination: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      planned_distance: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      actual_distance: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('Planned', 'Dispatched', 'Completed', 'Cancelled'),
        allowNull: false,
        defaultValue: 'Planned',
      },
      scheduled_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      dispatched_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      cancelled_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      cancellation_reason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      driverId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: 'trips',
      timestamps: true,
    }
  );

  return Trip;
};
