module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define(
    "Vehicle",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      reg_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      max_load: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      odometer: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },

      acquisition_cost: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM(
          "Available",
          "On Trip",
          "In Shop",
          "Retired"
        ),
        defaultValue: "Available",
      },
    },
    {
      tableName: "vehicles",
      timestamps: false,
    }
  );

  return Vehicle;
};