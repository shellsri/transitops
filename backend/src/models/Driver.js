module.exports = (sequelize, DataTypes) => {
  const Driver = sequelize.define(
    "Driver",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      license_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      license_category: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      license_expiry: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      safety_score: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 5.0,
      },

      status: {
        type: DataTypes.ENUM(
          "Available",
          "On Trip",
          "Off Duty",
          "Suspended"
        ),
        defaultValue: "Available",
      },
    },
    {
      tableName: "drivers",
      timestamps: false,
    }
  );

  return Driver;
};