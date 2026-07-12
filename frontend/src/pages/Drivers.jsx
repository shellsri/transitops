import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { fetchDrivers, createDriver } from "../services/realApi";

function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    license_number: "",
    license_expiry: "",
    contact: "",
  });

  useEffect(() => {
    loadDrivers();
  }, []);

  async function loadDrivers() {
    try {
      setLoading(true);

      const data = await fetchDrivers();

      setDrivers(Array.isArray(data) ? data : data.data || []);
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
      await createDriver(formData);

      setShowForm(false);

      setFormData({
        name: "",
        license_number: "",
        license_expiry: "",
        contact: "",
      });

      loadDrivers();
    } catch (err) {
      console.error(err);
      alert("Unable to add driver.");
    }
  }

  function isLicenseExpired(date) {
    if (!date) return false;
    return new Date(date) < new Date();
  }

  function getStatusClass(status) {
    switch ((status || "").toLowerCase()) {
      case "available":
        return "badge badge-green";

      case "on trip":
      case "active":
        return "badge badge-blue";

      case "off duty":
        return "badge badge-orange";

      case "suspended":
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
            <h1>Drivers & Safety</h1>

            <p
              style={{
                color: "#9ca3af",
                marginTop: 6,
              }}
            >
              Manage drivers, licences and safety records.
            </p>
          </div>

          <button
            className="btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Close" : "+ Add Driver"}
          </button>
        </div>

        {showForm && (
          <form
            className="inline-form"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              name="name"
              placeholder="Driver Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="license_number"
              placeholder="Licence Number"
              value={formData.license_number}
              onChange={handleChange}
              required
            />

            <input
              type="date"
              name="license_expiry"
              value={formData.license_expiry}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="contact"
              placeholder="Phone Number"
              value={formData.contact}
              onChange={handleChange}
              required
            />

            <button className="btn-primary">
              Save Driver
            </button>
          </form>
        )}

        {loading ? (
          <div
            style={{
              marginTop: 70,
              textAlign: "center",
              color: "#9ca3af",
            }}
          >
            Loading drivers...
          </div>
        ) : drivers.length === 0 ? (
          <div
            style={{
              marginTop: 80,
              textAlign: "center",
            }}
          >
            <h2>No Drivers Found</h2>

            <p
              style={{
                color: "#9ca3af",
              }}
            >
              Add your first driver to begin assigning trips.
            </p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Licence</th>
                <th>Expiry</th>
                <th>Contact</th>
                <th>Safety Score</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.id}>
                  <td>{driver.name}</td>

                  <td>{driver.license_number}</td>

                  <td>
                    {driver.license_expiry}

                    {isLicenseExpired(driver.license_expiry) && (
                      <span
                        className="badge badge-red"
                        style={{ marginLeft: 8 }}
                      >
                        Expired
                      </span>
                    )}
                  </td>

                  <td>{driver.contact}</td>

                  <td>
                    {driver.safety_score ?? "-"}
                  </td>

                  <td>
                    <span
                      className={getStatusClass(driver.status)}
                    >
                      {driver.status || "Unknown"}
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

export default Drivers;