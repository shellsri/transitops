import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { fetchTrips } from "../services/realApi";

export default function ReportsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  async function loadTrips() {
    try {
      const data = await fetchTrips();
      setTrips(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }

  const totalDistance = trips.reduce(
    (sum, t) => sum + Number(t.planned_distance || 0),
    0
  );

  const activeTrips = trips.filter(
    (t) => t.status === "Dispatched"
  ).length;

  return (
    <div className="page-layout">
      <Sidebar />

      <div className="main-content">

        <div className="page-header">
          <h1>Reports & Analytics</h1>
        </div>

        <div className="kpi-grid">

          <div className="kpi-card">
            <p className="kpi-label">Total Trips</p>
            <p className="kpi-value">{trips.length}</p>
          </div>

          <div className="kpi-card">
            <p className="kpi-label">Active Trips</p>
            <p className="kpi-value">{activeTrips}</p>
          </div>

          <div className="kpi-card">
            <p className="kpi-label">Distance</p>
            <p className="kpi-value">{totalDistance} km</p>
          </div>

        </div>

        {loading ? (
          <p style={{ color: "#999", marginTop: 30 }}>
            Loading...
          </p>
        ) : (
          <table
            className="data-table"
            style={{ marginTop: 30 }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Cargo</th>
                <th>Distance</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id}>
                  <td>{trip.id}</td>

                  <td>{trip.source}</td>

                  <td>{trip.destination}</td>

                  <td>
                    {trip.vehicle?.name || trip.vehicle?.reg_number || "-"}
                  </td>

                  <td>
                    {trip.driver?.name || "-"}
                  </td>

                  <td>
                    {trip.cargo_weight} kg
                  </td>

                  <td>
                    {trip.planned_distance} km
                  </td>

                  <td>
                    {trip.status}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>
    </div>
  );
}