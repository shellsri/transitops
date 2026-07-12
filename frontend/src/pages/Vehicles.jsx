import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { fetchVehicles, createVehicle } from "../services/realApi";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    reg_number: "",
    name: "",
    type: "Van",
    max_load: "",
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  async function loadVehicles() {
    try {
      setLoading(true);
      const data = await fetchVehicles();
      setVehicles(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await createVehicle(formData);

      setFormData({
        reg_number: "",
        name: "",
        type: "Van",
        max_load: "",
      });

      setShowForm(false);

      loadVehicles();
    } catch (err) {
      console.error(err);
      alert("Unable to create vehicle.");
    }
  }

  function getStatusClass(status) {
    switch ((status || "").toLowerCase()) {
      case "available":
        return "badge badge-green";

      case "on trip":
        return "badge badge-blue";

      case "maintenance":
      case "in shop":
        return "badge badge-orange";

      case "retired":
        return "badge badge-red";

      default:
        return "badge";
    }
  }

  return (
    <div className="page-layout">
      <Sidebar />

      <div className="main-content">
        <div className="page-header">
          <div>
            <h1>Fleet Registry</h1>

            <p
              style={{
                color: "#9ca3af",
                marginTop: "6px",
              }}
            >
              Manage all vehicles available in your fleet.
            </p>
          </div>

          <button
            className="btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Close" : "+ Add Vehicle"}
          </button>
        </div>

        {showForm && (
          <form className="inline-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="reg_number"
              placeholder="Registration Number"
              value={formData.reg_number}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="name"
              placeholder="Vehicle Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option>Van</option>
              <option>Truck</option>
              <option>Bike</option>
            </select>

            <input
              type="number"
              name="max_load"
              placeholder="Max Load (kg)"
              value={formData.max_load}
              onChange={handleChange}
              required
            />

            <button className="btn-primary">
              Save Vehicle
            </button>
          </form>
        )}

        {loading ? (
          <div
            style={{
              marginTop: "60px",
              textAlign: "center",
              color: "#9ca3af",
            }}
          >
            Loading vehicles...
          </div>
        ) : vehicles.length === 0 ? (
          <div
            style={{
              marginTop: "80px",
              textAlign: "center",
            }}
          >
            <h2>No Vehicles Found</h2>

            <p
              style={{
                color: "#9ca3af",
                marginTop: "10px",
              }}
            >
              Add your first fleet vehicle to begin managing operations.
            </p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Registration</th>
                <th>Name</th>
                <th>Type</th>
                <th>Max Load</th>
                <th>Odometer</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>{vehicle.reg_number}</td>

                  <td>{vehicle.name}</td>

                  <td>{vehicle.type}</td>

                  <td>{vehicle.max_load} kg</td>

                  <td>{vehicle.odometer || 0} km</td>

                  <td>
                    <span className={getStatusClass(vehicle.status)}>
                      {vehicle.status || "Unknown"}
                    </span>
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

export default Vehicles;