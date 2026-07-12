import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { fetchDashboardStats } from '../services/mockApi';

function Dashboard() {
  const [stats, setStats] = useState({
    activeVehicles: 0,
    availableVehicles: 0,
    inMaintenance: 0,
    activeTrips: 0,
    pendingTrips: 0,
    driversOnDuty: 0,
  });

  useEffect(() => {
    fetchDashboardStats().then((data) => setStats(data));
  }, []);

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="main-content">
        <h1>Dashboard</h1>

        <div className="kpi-grid">
          <div className="kpi-card">
            <p className="kpi-label">Active Vehicles</p>
            <p className="kpi-value">{stats.activeVehicles}</p>
          </div>
          <div className="kpi-card">
            <p className="kpi-label">Available Vehicles</p>
            <p className="kpi-value">{stats.availableVehicles}</p>
          </div>
          <div className="kpi-card">
            <p className="kpi-label">In Maintenance</p>
            <p className="kpi-value">{stats.inMaintenance}</p>
          </div>
          <div className="kpi-card">
            <p className="kpi-label">Active Trips</p>
            <p className="kpi-value">{stats.activeTrips}</p>
          </div>
          <div className="kpi-card">
            <p className="kpi-label">Pending Trips</p>
            <p className="kpi-value">{stats.pendingTrips}</p>
          </div>
          <div className="kpi-card">
            <p className="kpi-label">Drivers On Duty</p>
            <p className="kpi-value">{stats.driversOnDuty}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;