module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define(
    'Vehicle',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      registration_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      type: {
        type: DataTypes.ENUM('Bus', 'Van', 'Car', 'Truck'),
        allowNull: false,
        defaultValue: 'Van',
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('Available', 'On Trip', 'Maintenance', 'Out of Service'),
        allowNull: false,
        defaultValue: 'Available',
      },
    },
    {
      tableName: 'vehicles',
      timestamps: true,
    }
  );

  return Vehicle;
};
