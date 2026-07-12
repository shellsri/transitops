import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { fetchDashboardStats } from "../services/realApi";

function Dashboard() {
  const [stats, setStats] = useState({
    activeVehicles: 0,
    availableVehicles: 0,
    inMaintenance: 0,
    activeTrips: 0,
    pendingTrips: 0,
    driversOnDuty: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const cards = [
    {
      title: "🚚 Active Vehicles",
      value: stats.activeVehicles,
      color: "#22c55e",
    },
    {
      title: "🟢 Available Vehicles",
      value: stats.availableVehicles,
      color: "#3b82f6",
    },
    {
      title: "🛠 In Maintenance",
      value: stats.inMaintenance,
      color: "#f59e0b",
    },
    {
      title: "🗺 Active Trips",
      value: stats.activeTrips,
      color: "#8b5cf6",
    },
    {
      title: "⏳ Pending Trips",
      value: stats.pendingTrips,
      color: "#ef4444",
    },
    {
      title: "👨‍✈️ Drivers On Duty",
      value: stats.driversOnDuty,
      color: "#06b6d4",
    },
  ];

  return (
    <div className="page-layout">
      <Sidebar />

      <div className="main-content">
        <h1 className="dashboard-title">Dashboard</h1>

        <p className="dashboard-subtitle">
          Live overview of your fleet operations
        </p>

        {loading ? (
          <p style={{ color: "#aaa", marginTop: "30px" }}>
            Loading dashboard...
          </p>
        ) : (
          <div className="kpi-grid">
            {cards.map((card) => (
              <div
                key={card.title}
                className="kpi-card"
                style={{
                  borderLeft: `5px solid ${card.color}`,
                }}
              >
                <p className="kpi-label">{card.title}</p>

                <p className="kpi-value">{card.value}</p>

                <small
                  style={{
                    color: "#888",
                  }}
                >
                  Live Data
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;