const path = require("path");
const dotenv = require("dotenv");

const result = dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

console.log("dotenv result:", result);
console.log("JWT_SECRET:", process.env.JWT_SECRET);

console.log("JWT_SECRET:", process.env.JWT_SECRET);

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { sequelize } = require("./models");

const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const driverRoutes = require("./routes/driverRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/trips", tripRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/drivers", driverRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");

    await sequelize.sync({
      alter: process.env.NODE_ENV === "development",
    });

    app.listen(PORT, () => {
      console.log(`🚀 TransitOps backend listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Unable to start server:", err);
    process.exit(1);
  }
}

start();

module.exports = app;